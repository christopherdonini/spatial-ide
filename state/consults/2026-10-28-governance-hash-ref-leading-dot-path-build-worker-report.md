*Custodian's filing note (2026-10-28): the worker's second hand-back on `governance-hash-ref-leading-dot-path`: M3 in its worded shape fails the second test by name; the record commit; the checkers' findings on the real tree identical at the base and the head. The custodian's check by git: the head bf9c8463 equals origin's branch, 51 lines over the 2 files of the Scope. The run 10:19:17Z to 10:26:53Z by its transcript (Write 1, Bash 7). Extracted by script from its second SubagentHandback call, with one final newline added; nothing else is changed. Its sha256, from line 5 to the end, is 8cd02e05c3beb88aecea3abcaa5b301e054f95f44b23f856f34596339ff4f430.*

---

Built: governance-hash-ref-leading-dot-path at bf9c8463ce49f17850c532819fe003a8b16a8eef

**Branch state.** Origin's branch equals HEAD (bf9c8463ce49f17850c532819fe003a8b16a8eef), and `git status --porcelain` is empty. There are two commits, both signed off. In both message files the only `@` is in the first trailer line.
- Code commit: 850efbd89ad18daf8c14a0c485eb657cf868abb7.
- Record commit: bf9c8463ce49f17850c532819fe003a8b16a8eef.

**Base findings (step 1).** Both exited 0.
- `verify-quotes.mjs`: 131 checked, 100 verified, 30 baselined, 1 advisory, 0 hash-reference errors (2 hash-baselined), 879 ruling cites resolved.
- `verify-test-claims.mjs`: 687 claimed tests across 210 files (47 planned, 11 superseded, 17 withdrawn).

**Code commit 850efbd8.**
- The grammar change is in `scripts/plan/hashRefGrammar.mjs`. A lookbehind `(?<![A-Za-z0-9_./+-])` goes after the optional backtick, before the path. The path is `((?:\.(?=[A-Za-z0-9_]))?[A-Za-z0-9_](?:[A-Za-z0-9_.+-]|/(?!\.(?![A-Za-z0-9_])))*)`. A 3-line comment states the rule.
- The two named tests are appended to `verify-test-claims.test.mjs`. No existing test is changed.
- Both tests fail at the base grammar, swapped in from a scratch copy and restored.
  - `a_leading_dot_path_pin_resolves_in_both_checkers` at the base: actual { quotes: 2, claims: 0 }, expected { quotes: 0, claims: 1 }.
  - `each_dot_or_dot_dot_segment_reference_binds_in_neither_checker` at the base: actual [{0,1},{0,1},{0,0},{0,0}], expected four times { quotes: 1, claims: 0 }.
- Both tests pass at the head.

**Mutations (step 3).** Each was applied alone and the named test run. After each, I reverted with `git checkout` and the grammar's sha256 was again 2049d23606cc040738a40fbe3cd9886637570fd5574abf4023ce1752206656e2, the same as at 850efbd8.

| Mutation | Failing test | Actual value |
|---|---|---|
| M1: leading-dot alternative removed | `a_leading_dot_path_pin_resolves_in_both_checkers` | { quotes: 2, claims: 0 } |
| M2: guard removed | `each_dot_or_dot_dot_segment_reference_binds_in_neither_checker` | [{0,1},{0,1},{0,0},{0,1}] |
| M3: dot lookahead and first character widened to every path character, as the settlement words it | `each_dot_or_dot_dot_segment_reference_binds_in_neither_checker` | [{0,0},{1,0},{1,0},{1,0}] |
| M4: interior restriction removed | `each_dot_or_dot_dot_segment_reference_binds_in_neither_checker` | [{0,0}… see below] |

M4's actual value is [{1,0},{1,0},{1,0},{0,0}], with `sub/../` resolving. In M3 the `./` entry resolves.

For M3, I applied the single-match replacement by script and grepped the new `const PATH` line from the file before running the test.

My first M3 (`\.?`) passed. That is the class 2 deviation you recorded. I did not record it in the test file.

Each `RECORDED MUTATION` comment in the test file names its mutation, the 40-hex code commit 850efbd89ad18daf8c14a0c485eb657cf868abb7, and the observed value above. M3's comment names the widened shape.

**Head findings (step 5).** `verify-quotes.mjs` and `verify-test-claims.mjs` both exited 0 on the real tree at the head. `diff` against the base outputs printed nothing for either, so they are identical (diffq=0, diffc=0).

**Scope count.** `git diff --numstat 60bb2d4f...HEAD` gives 6 insertions and 1 deletion in `hashRefGrammar.mjs`, and 44 insertions and 0 deletions in `verify-test-claims.test.mjs`. That is 51 lines against the 110 budget, in two files.

**Checks at the head (step 6).**

| Check | Exit | Last line / summary |
|---|---|---|
| `node --test` over the plan, hooks and evidence globs | 0 | 570 tests, 570 pass, 0 fail |
| `verify.mjs --offline` | 0 | verify:plan PASS |
| `verify-cites.mjs` | 0 | PASS, 2458 files, 75 loose references advised |
| `verify-quotes.mjs` | 0 | PASS, same figures as the base |
| `verify-test-claims.mjs` | 0 | PASS, 687 tests across 210 files |

**Disclosures.** No stop rule was met after the settlement. No file outside the Scope changed. The form's text was not edited. No cargo ran and no shared hold was used. Scratch files are named `hrdot-w-*` in the scratch folder.

**Self-check.**
- Cross-module use: the grammar is consumed through `hashRefRegExp` (`verify-quotes.mjs:139`, `verify-quotes.mjs:590`), and the unchanged outputs of both importers on the real tree prove it.
- Completion claims: each rests on a transcript call and a scratch output file.
- User-facing messages: none were added.
- Required tests: both reach their `deepEqual` assertions, and each fails at the base with the form's figures.

Model: Sonnet 5.5 (claude-sonnet-5-5), no override, no context handoff.
