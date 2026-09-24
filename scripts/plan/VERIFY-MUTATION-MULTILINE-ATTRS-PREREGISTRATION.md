# verify-mutation.mjs multi-line attribute fix — five-line preregistration (AUTONOMY.md §21d)

*Committed before any code, per the header rule both full and short forms keep.*

```
Authority: PLAN.yaml node governance-verify-mutation-multiline-attrs; state/directives/2026-09-24-night-program.md item 5 (the human, verbatim: "All are light-lane fixes to tools that can silently skip tests, not new policy."); AUTONOMY.md §21b-§21d.
Scope: scripts/plan/verify-mutation.mjs (the Rust-scanning branch of findTestsInFile only) and scripts/plan/verify-mutation.test.mjs; declared line budget <= 60 insertions + deletions across these 2 files.
Change: an unterminated multi-line attribute (e.g. an #[ignore = "..."] whose string continues onto a following line) no longer clears `pending`; the scanner recognises the attribute is still open and keeps `pending` true until the attribute closes, printing a diagnostic for any attribute block it had to treat this way.
Tests+mutation: a new test with a fixture pairing #[test] / a multi-line #[ignore = "..."] / fn, asserting the test is still listed by findTestsInFile; the recorded mutation reverts the fix (restores the old "any other line clears pending" behaviour) and that test fails by name.
Out-of-scope: no ADR, wire, security or guarantee text; no change to verify-test-claims.mjs or any other script (sibling search reported, not fixed); no change to the JS/TS scanning branch or to hasMutationMention/runVerifyMutation.
```

Budget: references only, filled in at landing.
