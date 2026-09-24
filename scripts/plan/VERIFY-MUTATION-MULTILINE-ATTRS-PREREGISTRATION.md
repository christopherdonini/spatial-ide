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

## Correction round 1

Reviewer attempt 1 (state/gate-log.json, node governance-verify-mutation-multiline-attrs, @ cf4dad6): `netBracketDelta` counted brackets inside string literals, so an attribute string holding an unbalanced `[` left the scanner "inside an attribute" and swallowed every later test with no diagnostic. Corrected at commit c69297d: `stripStringLiterals` drops `"..."`/raw-string contents before bracket-counting (state carried across lines), and an attribute still open at end of file prints a diagnostic. Proof: `an_unbalanced_bracket_inside_an_attribute_string_does_not_swallow_later_tests`, `a_raw_string_bracket_inside_an_attribute_does_not_swallow_later_tests`, and `an_unterminated_attribute_at_eof_prints_a_diagnostic` (scripts/plan/verify-mutation.test.mjs, commit c69297d), plus the pre-existing `finds_a_test_behind_a_multiline_ignore_attribute` still passing.

Documentation note (reviewer attempt 1, Documentation PASS-with-notes): the CRLF normalisation sits on the `lines` variable shared by the JS/TS branch, which this form's Change/Scope lines do not disclose; recorded here, not a Scope amendment.

Known residual (disclosed, not fixed): a raw-string literal inside a test's own body whose text happens to start a line with `#[...` can still be misread by the line-scanner as a real attribute open — a pre-existing limit of the whole line-heuristic, not introduced by commit c69297d.

Budget: declared <= 60; original 55 (35+4 mjs, 16+0 test, commit cf4dad6); correction 87 (41+5 mjs, 41+0 test, commit c69297d); total 142 non-generated lines, under AUTONOMY.md §21b's class-6 overrun is recorded (declared 60, landed 142); under §21c's 150-line single-gate threshold, no STOP.
