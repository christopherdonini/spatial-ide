*Custodian's filing note (2026-10-03): node 10's worker-high report 1, written by the worker to this path and committed as written below the rule. Its sha256, from this file's line 5 to the end, is c362ba4f6f6493fa2fdcf426c2fc11fdd409d42a7203a5d9fae0a7ce29b4add2, equal to the worker's hand-back. The round's commits are c66b7a06 and 51296907, on `cut/type-walk-null-literal-arithmetic`. O-2 was not coded in this round. It was ruled yes by question round 45, item 1, after the worker had finished, and the worker was resumed to apply it (report 2). Worker cost, round 1: 106,207 subagent tokens, 48 tool uses, 3,789,091 ms.*

---

# node 10 worker report 1 — type-walk-null-literal-arithmetic

Verdict: sections 2.1, 2.2 and 2.3, rows C39 to C46, the B-T1 part-3 pins, section 2.7 and mutations M1 to M5 are done and green. O-2 is not coded and no ruling had reached me. No invalidator in section 5 fired and no section 8 item was crossed, with one tension flagged under "What is left for O-2".

Worktree `C:/dev/wt/null-literal`, branch `cut/type-walk-null-literal-arithmetic`, merge base `10febb28cd56bf233df04321b2ed7d6c020a9df7` (checked by `git merge-base origin/main HEAD` after a fetch). Every cargo command ran with `CARGO_TARGET_DIR=D:/wt-targets/null-literal`, for the root workspace. The shell crate was not built. No `cargo clean`, no `target/` removal, no force-push, no rebase.

## Commits (both signed off, both pushed; the pushed tip matches local HEAD)

- `c66b7a0619191e365fb69ea2f3a563898c073545` — `engine/src/predicate.rs`, `engine/tests/filter_type_admission.rs`: the code and tests.
- `51296907cd4f9e6f9636a6a83b6196978549ab1f` — `engine/README.md` (section 2.7): the owner's index.

Scope kept:
- `git diff --stat origin/main...HEAD -- kernel/ protocol/ frontends/ renderer/` prints nothing.
- No `pub` item is added.
- No `cfg`, no platform ignore, and no string, reason or wire change.

## What was built

- Section 2.1: `admitted_arithmetic_result` rule 2 gained a NULL-with-NULL arm that returns NULL. NULL beside a numeric operand is unchanged. NULL beside VARCHAR or BOOLEAN is unchanged.
- Section 2.2: `type_of_arithmetic`'s binary arm sets `within_bounds` to the conjunction of the two operands' flags. The unary arm and `/` are untouched.
- Section 2.3: `Typed` gained the private field `counts_as_decimal_literal`.
  - It is false in both constructors and in every `literal_typed` arm.
  - It is set only in the binary arm, when one operand is NULL-typed and the other is a decimal literal within bounds (kind literal, DECIMAL, flag true).
  - It is read in exactly three places, each commented "1 of 3", "2 of 3" and "3 of 3": the decimal-literal test in `is_admitted_comparison`, the numeric-literal-within-bounds test in `is_admitted_comparison`, and `determine_reason`'s decimal-literal test.
  - The result keeps its DECIMAL type and its expression kind.
- B-T3: corpus rows C39 to C46 appended in the form's order. They add 13 corpus entries: C39, C40, C41, C42, C43, C44 (five), C45 (two) and C46. Both doc comments name the form. C41 asserts the construct `<` and the reason, with operand types not asserted.
- B-T1 part 3: seven admitted pins appended, each with `arith_op` set. C39 is `+`. C40 and C44a to C44e are `-`. Part 3 goes from 323 to 330 and the total from 9,705 to 9,712. No C47 row and no C47 pins.
- Section 2.7: `engine/README.md` gains the preregistration after `engine/TESTS-CONFIGURED-CONNECTIONS-PREREGISTRATION.md` and before `engine/WATCHER-FIRST-READ-PREREGISTRATION.md`. "Last verified at" moves to `c66b7a0`.
  - Every backticked pointer in the section (137 tokens, lines 495 to 527 of the file before my edit) was checked mechanically at `c66b7a06` with a scratch script: each named file exists and each named symbol or test name occurs in it. There were 0 misses. Every other line is unchanged.

## Test runs (command, exit code)

All cargo commands were run from the worktree with the target directory above.

| Command | Exit code | Result |
|---|---|---|
| `cargo fmt -p spatial-engine --check` | 0 | after one `cargo fmt -p spatial-engine`, which touched only my two files |
| `cargo test -p spatial-engine -- --nocapture` at `51296907` (output kept in the target directory) | 0 | the whole crate green; lib 175 passed; every `test result` line is ok |
| `node scripts/plan/verify-cites.mjs` | 0 | PASS; 1210 files, 34 loose references advised, none mine |
| `node scripts/plan/verify-quotes.mjs` | 0 | PASS; 113 checked, 82 verified, 30 baselined |
| `node scripts/plan/verify-quotes.mjs --show-cites engine/README.md engine/src/predicate.rs engine/tests/filter_type_admission.rs` | 0 | PASS; 0 checked (my files carry no quote) |
| `node scripts/plan/verify-test-claims.mjs` | 0 | PASS; 488 claimed tests exist or are planned, superseded or withdrawn |
| `node scripts/plan/verify.mjs` | 0 | PASS |
| `node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs"` | 0 | 425 tests, 425 pass, 0 fail |

The B-T3 test `each_corpus_row_is_admitted_or_refused_with_its_code_reason_and_operand_types` passed first time with all of C39 to C46 as the form predicts. In the engine run above it is inside `filter_type_admission`, which reports 3 passed.

## Mutations M1 to M5

Each was observed by applying it with a scratch script (no `verify-mutation` run), running `cargo test -p spatial-engine --test filter_type_admission each_corpus_row`, reading the failure, and reverting with `git checkout` on the file. Observed at commit `c66b7a06`. The failing test in every case is `each_corpus_row_is_admitted_or_refused_with_its_code_reason_and_operand_types`. The tree was clean after each.

| Mutation | First failing row, from the run | Failure |
|---|---|---|
| M1: the NULL-with-NULL arm removed | C39 `NULL + NULL > 0` | expected admitted, got refused |
| M2: the flag forced to true | C41 `i64 < NULL + 0.000000000000000000000000001`, reason | left `ConversionRounds`, right `LiteralOutOfBounds` |
| M3: `is_admitted_comparison` ignores the field | C40 `NULL - 0.5 > 0` | expected admitted, got refused |
| M4: `determine_reason` ignores the field | C45 `(NULL - 0.5) < (u64 * i64)`, reason | left `ConversionRounds`, right `ConversionCanFail` |
| M5: a marked result typed NULL | C45 `(NULL - 0.5) < (u64 * i64)` | expected `TypeNotAdmitted`, got `Ok(AdmittedPredicate ...)` |

The form says M2 also breaks C42. The panic stops at the first row, so C42's failure under M2 was not separately observed. The form's prediction is that C41 fails first, and that is what was observed.

## P-3

All four runs print the tally lines below. Base is the merge base `10febb28`, run on the clean tree after `git stash` and restored with `git stash pop`.

| Run | Admitted | Refused | Total | Failures |
|---|---|---|---|---|
| B-T1 at the merge base | 4553 | 5152 | 9,705 | 0 |
| B-T1 at head `c66b7a06` (alone, 282.72 s) | 4560 | 5152 | 9,712 | 0 |
| B-T1 at head `51296907` (inside the full crate run, 223.47 s for the 3-test file) | 4560 | 5152 | 9,712 | 0 |

- The refused tally is equal at 5152.
- The admitted tally rose by 7, which is exactly the pin count.
- B-T1b printed "897 arithmetic nodes checked, 0 failures" at the merge base (run alone, `--lib`) and at head `51296907` (in the full run). The checked count is equal.
- P-3 holds. P-2 holds, since (i) and (iii) show 0 failures over the 7 new pins. P-4 holds, since C43 is admitted. P-1 holds for C39 to C46.
- `51296907` differs from `c66b7a06` only in `engine/README.md`, so the code at both is identical.

## Section 7 figure

By the form's command, `git diff --numstat origin/main...HEAD` (fetched; `origin/main` is `63889d78`, merge base `10febb28`):
- `engine/src/predicate.rs`: 47 insertions, 5 deletions.
- `engine/tests/filter_type_admission.rs`: 79 insertions, 6 deletions.
- `engine/README.md`: 2 and 2, which is excluded as `*.md`.

The counted figure is 137 insertions plus deletions over 2 files, against a ceiling of 300 over 2. No class-8 overrun.

## Pre-gate failure classes

- No cross-module code: nothing under `kernel/`, `protocol/`, `frontends/` or `renderer/` changed. The engine to kernel path is by `FilterError::TypeNotAdmitted`, whose variants are unchanged.
- No completion claim above lacks its evidence: each run's output is kept in the target directory, and each mutation was observed by name.
- No user-facing message changed.
- B-T3's assertions reach the reason and operand-type checks, not only setup. M2, M4 and M5 each failed at the reason or outcome assertion.
- Caller rule: no `pub` item, no callback and no option was added, so there is no caller grep to paste.

Observed model: Sonnet 5.5 (`claude-sonnet-5-5`), run at high effort as the dispatch named, with no other override. I received and produced no context handoff.

## What is left for O-2

Not coded: the unary arm's handling of the field, the binary arm's marked-partner condition, and row C47. The B-T1 counts in the code are the "O-2 ruled no" counts, 330 and 9,712. No ruling reached me.

**The unary arm's default.** The unary arm builds its result by struct update from its operand, `Typed { kind: Expression, ..operand }`. Adding the field therefore makes the unary arm carry `counts_as_decimal_literal` with no code of its own. By default, unary `-` over a marked result is itself marked. The binary arm has no marked-partner disjunct. I observed both at head with a throwaway test that was appended, run and reverted with `git checkout` (never committed; the tree was clean afterwards):
- `-(NULL - 0.5) > 0` is admitted.
- `NULL + (NULL - 0.5) > 0` is refused with `ConversionRounds` on `>` over `DECIMAL(2,1) expression` and `INTEGER literal`.

So the default is asymmetric: step (i) behaves as O-2 "yes" and step (ii) as O-2 "no".

**Tension with section 8 item 7.** The first bullet of item 7 forbids the field being set outside section 2.3's condition "as extended only by an O-2 ruling". At the default, the unary arm sets it on a result outside that condition without a ruling. Neither shape above is pinned by B-T1 or B-T3, so `-(NULL - 0.5) > 0` is admitted but unchecked against B-T1 (i) and (iii). The custodian should read this before any gate.

**What a ruling needs:**
- Ruled yes: one disjunct in the binary arm's set condition, a marked-partner clause on the non-NULL operand. C47's two rows go into B-T3 and its two pins into B-T1 part 3, taking the counts to 332 and 9,714.
- Ruled no: one clearing line in the unary arm, setting the field false. A class-5 amendment records the narrowing and C47's prediction before C47 is run. The counts stay at 330 and 9,712.

## Not done and noticed

- The ADR-021 Note question is open for the human. Section 8 item 17 forbids the merge before the human answers it. Nothing in this piece touches ADR-021.
- The branch is pushed and the working tree is clean, so `git status --porcelain` is empty in `C:/dev/wt/null-literal`. The main checkout has this report untracked at its path and nothing else of mine.
