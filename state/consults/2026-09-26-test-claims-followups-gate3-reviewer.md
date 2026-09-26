*Custodian's filing note (2026-09-26): the reviewer gate's attempt-3 report (scoped confirmation) for PLAN node `governance-test-claims-superseded-followups` at 6b4f7d2, filed as returned (extracted by script from the agent's hand-back; byte-identical). Everything below the rule is the agent's text.*

---

**Reviewer gate, attempt 3 (scoped confirmation): `governance-test-claims-superseded-followups` @ 6b4f7d2. Verdict: PASS**

Every check was run at 6b4f7d2 in C:\dev\spatial-ide\.claude\worktrees\test-claims-followups on Node v24.18.1. Nothing was committed. The module's blob was restored after each mutation (sha256 e2a53269…c421, the same as HEAD's), and the tree is clean.

**Blocking:** none.

**1. R1: confirmed, all three comments byte-exact (0f865e8's comments, run against b82941e's code, which is unchanged at HEAD)**

Each mutation was applied for real, `node --test scripts/plan/verify-test-claims.test.mjs` was run, and the change was reverted. The comparison joins the wrapped comment lines and treats each "then" as one printed line with blank lines skipped. That is the same convention the rest of the file uses.

- **Comment above `a_withdrawn_test_row_pinning_a_line_range_does_not_exempt`** (mutation: drop the `ref.startLine !== ref.endLine` branch).
  - Count: 52 of 55 pass, as the comment says.
  - The test's own failure matches its text, including the "1 !== 0" line; only the `<sha>`/`<hash>` placeholders differ.
  - `a_withdrawn_test_line_pinning_a_line_range_fails_by_name`: the JSON line, `+ actual - expected`, `+ 'refused: hash does not recompute'` and `- 'refused: a line range'` all match, followed by a caret line (`            ^`), which the comment describes as "a caret line".
  - `a_refused_withdrawn_test_line_names_its_unresolvable_ruling`: the JSON line, `+ actual - expected`, `+ 'refused: hash does not recompute; unresolvable ruling: round 99, item 1'` and `- 'refused: a line range; unresolvable ruling: round 99, item 1'` all match. There is no caret line, and the comment claims none.
- **Comment above `a_withdrawn_test_row_whose_pin_and_ruling_both_fail_names_both`** (mutation: `grammarAccepted && reason !== undefined ? { ok: true } : withdrawnRiders(root, lineText)`, which is §4's own mutation).
  - Count: 54 of 55 pass; only this test fails.
  - The JSON line, `+ actual - expected`, `+ 'refused: hash does not recompute'` and `- 'refused: hash does not recompute; unresolvable ruling: round 99, item 1'` all match.
- **Comment above `a_marker_in_row_position_without_its_colon_is_still_checked`** (mutation: `ROW_POSITION_RE` requires the colon).
  - Count: 54 of 55 pass; only this test fails.
  - Node prints `AssertionError [ERR_ASSERTION]: []`, a blank line, then `0 !== 1`, which matches the comment.
- Test 5's comment still says the older mutation also fails test 19 (53 of 55). That is still true: the module is unchanged apart from the dead line removed in b82941e.

**2. R2: confirmed.** b82941e removes exactly one line, `refLine: lineNo,`. Running `git grep refLine` at HEAD finds only lines 267–268 of `verify-test-claims.mjs`, which are `markedSpans`' local variable. No `refLine` property is written or read anywhere, so the caller grep is clean.

**3. R3: confirmed.** Amendment 4 item 5 says Amendment 2 was written after the results Amendment 1 item 2 records. Amendment 4's superseded index lists "Amendment 2's first line, as to when it was written, by item 5".

**4. Amendment 4 is byte-exact: confirmed at 44bf8df.**
- The block from its heading line through its superseded-index line, LF with one trailing newline, is 9 lines with sha256 0c2d30b53bf384e955f73f1961c98c1d74fa6e26a04ea4ff789b3dcd3ebc7b52.
- It is `cmp`-identical to lines 59–67 of the fenced block in C:\dev\spatial-ide\state\consults\2026-09-26-test-claims-followups-gate2-architect.md.
- 44bf8df adds 10 lines and removes none: a blank separator plus the block.

**5. Amendment 5: confirmed.**
- b82941e touches only the module (removes 1 line). 0f865e8 touches only the test file (20 lines added, 18 removed).
- `git diff --numstat origin/main...HEAD` over the three counted files, at both 0f865e8 and 6b4f7d2: README 46+24, module 260+84, tests 618+56, total **1,088**. The step from 1,087 is −1 in b82941e and +2 in 0f865e8.
- The merge base is cf95d14. It did not change when origin/main moved to dea920e during this review.
- The amendment's first line says it was written after the results were seen. Its items are commit ids and references with no restated prose.
- Its superseded index names the one thing its text replaces, Amendment 3 item 6's figure. 6b4f7d2 only adds lines (8 added, 0 removed).

**6. Nothing else changed: confirmed.**
- `git diff 761915c..6b4f7d2 --stat` lists only the form (+18), the module (−1) and the test file (+20/−18).
- 0f865e8 is comments only: filtering its changed lines for anything that does not start with `//` returns nothing.

**7. Re-runs: all pass (rc 0).**
- **Scripts suite** (`node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs"`): 311 of 311 pass.
- **verify-test-claims:** PASS with 0 findings, 15 withdrawn and 3 superseded. The superseded entries are `OWNER-INVALIDATION-PREREGISTRATION.md` lines 621, 627 and 677 @ 46cde2c.
- **verify-mutation** (`--base origin/main --head HEAD`): all 20 new tests have a recorded mutation.
- **verify-cites:** PASS, with 31 loose references advised, all in other files.
- **verify-quotes:** PASS (109 checked, 0 errors, 1 advisory in another file).
- **`timeout 120 node scripts/plan/verify.mjs --offline`:** PASS.
- **`queue.mjs --check` and `site.mjs --check`:** both current.
- **Temp-directory delta** (entries named `verify-test-claims*`): 0.
  - Measured on a clean run of the test file (7,828 before and after) and on a failing mutated run (7,828 before and after), so the `after()` sweep also runs when tests fail.
  - Attempt 2's figure was 7,728. The extra 100 appeared before my first prefixed count and can't be attributed to my runs.
  - The whole suite leaves 114 entries from other test files (hooks-test-repo, verify-quotes, site-bugs-plan and others). Neither this diff nor this piece touches those files.
- **`file`:** all three changed files are UTF-8 with 0 CR bytes, and no file in the branch diff is CRLF.

**Notes** (not blocking; the record-cap reduction is the architect's call):
- **N1.** Amendment 5 item 1 labels all of 0f865e8 as class 3. But 0f865e8 changes which mutation test 19 records (now §4's own text). By Amendment 4 item 1's own reading, "its mutation changes class 4", that part is class 4.
- **N2.** Amendment 3 item 3, scoped by Amendment 4 item 2 to the comments naming 7400dac @ 8fb4999, still claims every one of them was re-observed. Attempt 2's R1 showed two of those comments were not as printed. Amendment 5 item 1 records the fix but its superseded index does not qualify item 3 for those two comments. The false claim is reachable only through the gate-log's R1.

**Suggestion**
- **S1.** origin/main moved to dea920e (state and PLAN files only) during this review. Regenerate the generated files at merge, as attempt 2's S2 already said.

Gate-log note:
@ 6b4f7d2 (scoped re-read of 761915c..6b4f7d2): PASS. R1: the three re-observed comments match Node's output byte for byte (52/55, 54/55, 54/55). R2: `refLine` gone, caller grep clean. R3: answered by Amendment 4 item 5. Amendment 4 is byte-exact to the architect's block (sha256 0c2d30b5…7b52). Amendment 5's commits and the 1,088 figure hold. Only the form, module and tests changed; 0f865e8 is comments only. Suite 311/311 and every check rc 0 (verify-test-claims 0 findings/15 withdrawn/3 superseded; verify-mutation 20/20). Temp delta 0. No CRLF. Notes: N1 test 19's mutation change is class 4 by Amendment 4 item 1; N2 Amendment 3 item 3 not superseded for R1's two comments.
