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

## Amendment 2 — scope-narrowing on the human's ruling (class 5, §10)

Ruling: `DECISIONS-PENDING.md:49 @ 971d76e sha256:763e49d5bbf5f6704a4d430b22e04caab4956c0411d090099dbb9972c540bfc2`, applying `DECISIONS-PENDING.md:388-392 @ 971d76e sha256:3688231895d54984d2b76868b03ea684b8678cc0cb085077ea2e8ee870a13567` (entry 127's recommendation). The applied clause, byte-copied from `DECISIONS-PENDING.md:49`: "An unclosed attribute falls back to single-line handling after a bounded look-ahead, and the unclosed case is printed as a finding."

Narrowing: the two Correctness FAILs (Correction round 1 above; the pre-existing raw-string-in-test-body residual) are all instances of one class — an attribute that netBracketDelta never sees close. The fix stops tracking any one unterminated attribute after a **bounded look-ahead of 20 continuation lines** (`MULTILINE_ATTR_LOOKAHEAD = 20`): this repo's multi-line attributes (an `#[ignore = "..."]` reason wrapped once or twice) never run past a handful of lines, so 20 is generous headroom while bounding the worst case to a fixed 20-line window instead of the rest of the file. On the bound being reached without a close, the scanner drops `attrDepth` to 0, prints one finding line naming `rel:attrStartLine`, and resumes today's (main's) single-line handling from the next line onward — the same per-line rules `origin/main:scripts/plan/verify-mutation.mjs` uses today (an attribute-looking line keeps `pending`; any other non-comment/non-blank line clears it). This is the single mechanism that bounds all four of entry 127's named causes (unbalanced bracket in a string, a trailing line comment, a char literal holding `[` or `"`, a raw-string line starting `#[` inside a test body) without special-casing any of them individually.

This is a fresh count: the two Correctness FAILs against the multi-line-tracking design are superseded by this bounded-fallback design, which is a different mechanism, not a further correction of the same one; nothing in Correction round 1 above is re-litigated.

Budget (declared for this narrowing, base commit fcf4177): <= 90 insertions + deletions across `scripts/plan/verify-mutation.mjs` and `scripts/plan/verify-mutation.test.mjs`.

## Results (Amendment 2)

Landed at commit `532c6e3`: `scripts/plan/verify-mutation.mjs` +20/-1, `scripts/plan/verify-mutation.test.mjs` +136/0 (`git show 532c6e3 --numstat`) — 156 non-generated lines total against the declared <= 90; overrun recorded per §10 class 6, `Scope` not edited.

Tests, one per entry-127 residual plus the bound and the finding line, each verified to fail by name under its named `RECORDED MUTATION` (`scripts/plan/verify-mutation.test.mjs`, commit 532c6e3): `a_trailing_line_comment_bracket_past_the_lookahead_falls_back` (:129), `a_char_literal_bracket_past_the_lookahead_falls_back` (:147), `a_raw_string_line_starting_the_attribute_opener_in_a_test_body_falls_back` (:167), `the_lookahead_bound_gives_exactly_20_lines_before_falling_back` (:195), `an_attribute_past_the_lookahead_prints_a_finding_naming_the_file_and_line` (:229); the pre-existing `an_unbalanced_bracket_inside_an_attribute_string_does_not_swallow_later_tests` (:75) and `a_raw_string_bracket_inside_an_attribute_does_not_swallow_later_tests` (:87) still fail under their own recorded mutation, unaffected by this narrowing. `node --test scripts/plan/verify-mutation.test.mjs`: 14/14 pass at HEAD.

No-regression proof, redone against today's `origin/main` (`6430fc9`) per RULED 2026-09-24 round 17 item 9, superseding entry 127's 2238/2251 count taken against an earlier main: `findTestsInFile` over every `.rs` file in the tree lists 250 files / 2253 tests on `origin/main` (`6430fc9`) and 250 files / 2262 tests at branch HEAD (`532c6e3`) — 0 lost, 9 gained (4 carried from the original multi-line-attribute fix already on this branch, 5 new here).

Checks at HEAD (`532c6e3`), each rc 0: `node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs"` (265/265 pass); `node scripts/plan/verify-quotes.mjs`; `node scripts/plan/verify-cites.mjs`; `node scripts/plan/verify-test-claims.mjs`; `node scripts/plan/verify-mutation.mjs --base origin/main --head HEAD` (9/9 new tests named by a recorded mutation); `node scripts/plan/verify.mjs --offline`.

The Correction round 1 "Known residual (disclosed, not fixed)" line above (the raw-string-in-test-body case) is superseded by this amendment's bound, which covers it (`a_raw_string_line_starting_the_attribute_opener_in_a_test_body_falls_back`, :167); the original line stays by append-only.
