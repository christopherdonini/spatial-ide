*Custodian's filing note (2026-09-26): the reviewer gate's attempt-2 report for PLAN node `governance-test-claims-superseded-followups` at 761915c, filed as returned (extracted by script from the agent's hand-back; byte-identical). Everything below the rule is the agent's text, as returned, except one rooted cite to lines that exist only on the branch, on this file's line 12. A script rewrote it to the reviewer's worktree path, `C:\dev\spatial-ide\.claude\worktrees\test-claims-followups\` followed by the same path and lines, because `verify-cites` resolves rooted cites against main's tree. Nothing else changed.*

---

**Reviewer gate, attempt 2: `governance-test-claims-superseded-followups` @ 761915c. Verdict: FAIL**

Everything mechanical passes: suites, self-checks, P1, P2 both ways, figures, `AUTONOMY.md`, CRLF and append-only. Two fixes are incomplete (reviewer B3, architect B3) and one part of the architect's B6 is not answered. Each is a one-line or one-sentence change. The worktree is clean at 761915c and nothing was committed.

**Blocking**

- **R1. Reviewer B3 is not fully fixed: two recorded failures are still not as printed.** Rule: attempt-1 B3; §8 item 9; a2e6025 and Amendment 3 item 3 both say every recorded mutation was re-observed at 7400dac.
  - `C:\dev\spatial-ide\.claude\worktrees\test-claims-followups\scripts\plan\verify-test-claims.test.mjs:1349-1350` (test `a_marker_in_row_position_without_its_colon_is_still_checked`):
    - The comment quotes `"AssertionError [ERR_ASSERTION]: [] / 0 !== 1"`.
    - Node v24.18.1 prints `[]`, a blank line, then `0 !== 1` (the mutation run gives 54 of 55).
    - The ` / ` join is a retyped shape. The text dates from c617ddc; a2e6025 only added "observed at 7400dac" (git blame on line 1351).
  - `scripts/plan/verify-test-claims.test.mjs:676-679` (written in a2e6025). It quotes one "DIFFERENT printed reason" for two tests: `"+ actual - expected\n\n+ 'refused: hash does not recompute'\n- 'refused: a line range'"`.
    - For `a_refused_withdrawn_test_line_names_its_unresolvable_ruling` the run printed `+ 'refused: hash does not recompute; unresolvable ruling: round 99, item 1'` / `- 'refused: a line range; unresolvable ruling: round 99, item 1'`. That is not the quoted text.
    - For `a_withdrawn_test_line_pinning_a_line_range_fails_by_name` the run printed an extra caret line (`            ^`) that the quote leaves out.
  - Fix: comments only, two passages.
- **R2. Architect B3 has a leftover dead field.** Rule: caller rule (checklist 8) and §8 item 1's own finding.
  - `scripts/plan/verify-test-claims.mjs:625` still sets `refLine: lineNo` on every `validSpans` entry, and nothing reads it. Caller grep for `refLine`: lines 267-268 are `markedSpans`' local variable; line 625 is the only property write; there is no `.refLine` read anywhere.
  - 7400dac removed `singleLineOnly` and `markedSpans`' `refLine`, but this second `refLine` (present at f6ccfd2:627 too) stays. Amendment 3 item 1 maps B3 to 7400dac as if the fix were complete.
  - Fix: delete the line.
- **R3. Architect B6, part 3 has no answer.** Rule: the form's header rule, "a post-outcome amendment says so in its first line".
  - Amendment 3's superseded index deals with B6(1), the over-ceiling bullets (superseded by item 3), and B6(2), the restatement (withdrawn).
  - No sentence in Amendment 3 corrects Amendment 2's first line ("before either gate"), although Amendment 2 was written after Amendment 1's results.
  - Architect B6 is not in Amendment 3's finding-to-commit map at all.
  - Either a one-sentence correction, or the architect reduces the record under the record cap, since this is the second record round. The architect decides which.

**Attempt-1 findings, one by one**

| Finding | Status | Evidence |
|---|---|---|
| Reviewer B1 (§2.9 bullet 6) | fixed | 4d9644b; comment at `verify-test-claims.test.mjs:636-641` gives §2.1(a) as the reason; title and assertions unchanged. |
| Reviewer B2 (failure texts with no commit in 5 rejoined comments) | fixed | a2e6025. Lines 301, 315, 336 and 360 are re-observed at 7400dac; I re-ran them and they are byte-exact apart from the `<sha>`/`<hash>` elision the header discloses. Lines 406 and 468 are qualified 2c69c0b and a9a1f9d, marked "no re-run". |
| Reviewer B3 (failures not as printed) | not fixed | R1. |
| Reviewer B4 (split reference) | fixed | Line 710 is rejoined. A search for split references across the test file, the module and the README finds none. |
| Reviewer B5 (mutations for tests 5/8/19 differ from §4) | fixed, one comment issue | See S1. Test 8's recorded mutation (`ok = true`) is §4's own: 53 of 55 fail-set as recorded. Test 5's is a faithful reading of "refused lines": 53 of 55. |
| Reviewer B6 (row-level (e) SKIP) | fixed | 7400dac. New test at 4d9644b; its mutation gives 54 of 55, isolated, `false !== true` exactly as recorded. |
| Reviewer B7 (Amendment 1's file count) | fixed | Superseded by Amendment 3 item 6; 6 files confirmed. |
| Architect B3 | partly fixed | R2. |
| Architect B6 | parts 1–2 fixed, part 3 open | R3. |

**Mutations**

Each was applied for real, the test file run, then reverted; the source was restored byte-identical after each batch. Every count below matches its comment.

- §4's own mutations, applied literally:
  - Test 5 (riders not read on grammar-refused lines): 54 of 55, only test 5 fails.
  - Test 19 (riders not read when the pin fails): 54 of 55, only test 19 fails.
  - Test 8 (prefix check): 53 of 55.
  - Recorded union mutation for tests 5 and 19: 53 of 55; both texts byte-exact.
- New test's mutation: 54 of 55.
- Test 17, narrowed (drop the refusal line only): 54 of 55, `[]` then `0 !== 1`. §4's broader "skip the (e) check" gives 53 of 55 and also kills the new test, which is why it was narrowed (disclosed in Amendment 3 item 2).
- `a_pin_with_no_rev_does_not_exempt`: 55 of 55 pass. The 55-of-55 claim is confirmed; it is an equivalent mutant.
- 20 more comment mutations: lines 299, 311, 333, 355, 642, 666, 705, 934, 951, 971, 990, 1030, 1054, 1102, 1117, 1135 (which also covers the comments at 1153 and 1180), 1202 and 1301. All counts match and all failure texts are byte-exact, except the two passages in R1.

**§8 item 9**

- Every new or changed comment carries "observed at 7400dac, Node v24.18.1", or the original commit marked "no re-run, class 3".
- The comments with a count but no commit are all pre-piece and unchanged.

**Suites and self-checks, all at 761915c**

- `node --test` over the plan and hooks suites: 311 of 311 pass, rc 0.
- verify-test-claims: rc 0, 0 findings, 15 withdrawn, 3 superseded. The superseded entries are the same three triples as origin/main 4d0e727's own tool on its own tree: `OWNER-INVALIDATION-PREREGISTRATION.md` lines 621, 627 and 677 @ 46cde2c.
- verify-cites: rc 0.
- verify-quotes: rc 0.
- verify-mutation (`--base origin/main --head HEAD`): rc 0, 20 of 20 new tests have a recorded mutation.
- `verify.mjs --offline`: rc 0.
- `queue.mjs --check` and `site.mjs --check`: rc 0.
- Temp-directory delta: 0 (7,728 before, 7,728 after).

**P2 enumeration**

- (i) is the tool byte-identical at 7400dac and HEAD (sha256 686ade74…), with one export line appended in a scratch clone. (ii) is an independent script.
- Result, over the merge base cf95d14 and over a no-commit merge of origin/main 4d0e727:
  - Rows: `VERIFY-MUTATION-MULTILINE-ATTRS-PREREGISTRATION.md` lines 142–146, all accepted.
  - Mentions: `TEST-CLAIMS-WITHDRAWN-PREREGISTRATION.md:97` and `VERIFY-MUTATION-MULTILINE-ATTRS-PREREGISTRATION.md:138`.
  - (i) and (ii) agree, and both equal P2(a) and (b). The two mention lines' hashes match §2.7's pins.

**Figures, files, `AUTONOMY.md`**

- `git diff --numstat origin/main...HEAD` over the three counted files: README 46+24, module 261+84, tests 616+56, total 1,087. This is the same at 8fb4999 and matches Amendment 3 item 6.
- Non-generated files: 6 (the form, the three counted files, `AUTONOMY.md`, `PLAN.yaml`).
- `AUTONOMY.md`: one hunk, `@@ -160,7 +160,7 @@`, changing only line 163 in place (numstat 1/1, 470 lines before and after).
- `file`: every changed file is UTF-8 with no CRLF.
- The form is append-only across all four of its commits (165/0, 16/0, 10/0, 14/0) and has no line in row position.

**Record (Amendment 3)**

- Every commit id resolves, and each `git show --stat` matches its mapping: 7400dac touches only the module; 4d9644b only the tests; a2e6025 only the tests; af9d34d only the README; 603940d only `AUTONOMY.md`; 8fb4999 touches `PLAN.yaml` and the generated files; 761915c adds 14 lines to the form.
- The superseded index covers 912, the file count 5, 919, Amendment 2 item 1's bullets, and Amendment 2 item 2's second sentence.
- The one quotation, "skip the row-level (e) check", matches §4 byte for byte. There is no unmarked paraphrase.
- Item 3's "re-observes every recorded mutation" is false in the two places named in R1.

**Suggestions (not blocking)**

- **S1.** Test 19's comment (`verify-test-claims.test.mjs:1327-1332`) says its mutation must be the same code change as test 5's, "since this implementation reads riders conditionally on `reason`". That is not true: the code reads riders unconditionally, and `grammarAccepted` separates the two cases. The literal §4 mutation, `grammarAccepted && reason !== undefined ? { ok: true } : withdrawnRiders(...)`, gives 54 of 55 with only test 19 failing. Record that one, or fix the reason given.
- **S2.** The no-commit merge with origin/main conflicts in `site/index.html`. Regenerate the generated files when merging.
- **S3.** `verify-test-claims.mjs:838` prints the note "for at least one withdrawn claim or accepted row above", but accepted rows are never printed, so with 0 withdrawn claims nothing "above" matches it. The wording needs adjusting.
- **S4.** `a_pin_with_no_rev_does_not_exempt` has no mutation that makes it fail any more. Consider recording one that drops both the `COMMIT_ID_RE` guard and the prefix check.

**Nits**

- `verify-test-claims.test.mjs:380-381`: the recorded replacement, taken literally, declares `rev` twice and would not parse. It has to be read as replacing both lines.
- `verify-test-claims.test.mjs:387`: the comment points to "the piece's hand-back", which is not in the record.
- Amendment 3 item 4's sentence "§2.4's `revResolvesToCommit` refuses the same rev" restates a2e6025's comment, which a reference could carry (record cap). The architect decides.

Gate-log note:
@ 761915c (the follow-ups, fix round f6ccfd2..761915c): suites 311/311 and all self-checks rc 0; P1 holds (0 findings/15 withdrawn/3 superseded, triples = main); P2 (i)=(ii) on cf95d14 and the origin/main merge; figures 1,087 and 6 files; AUTONOMY one line in place; attempt-1 reviewer B1/B2/B4/B5/B6/B7 fixed; blocking: R1 two recorded failures still not as printed (test.mjs:1349-1350 "[] / 0 !== 1"; test.mjs:676-679's quote wrong for a_refused_withdrawn_test_line_names_its_unresolvable_ruling); R2 dead `refLine` at verify-test-claims.mjs:625 (architect B3 residual); R3 architect B6(3) Amendment 2's first line uncorrected; S1 test 19's §4 mutation separable (54/55)
