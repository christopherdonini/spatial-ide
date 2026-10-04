# PR #170 gate 2 — reviewer
Reviewed: cut/type-walk-null-literal-arithmetic @ 3074e9a0f6dea131a57d30e30da56022a4d85751

**Verdict: FAIL.** One S1: the form's §8 item 13 (a DuckDB behaviour stated without its version) fires on a test comment added at 8efcde98. Every other item on the §9 Reviewer list, as Amendments 1 to 3 extend it, passes at the head: M1 to M7 observed, P-3 re-run (+11 admitted, +12 refused, B-T1b 897 at both), P-0 re-run (all four BIGINT at v1.5.5), budget 270 of 300 over 2 files, and 15 of 15 CI checks green at the head.

Governing form: `engine/TYPE-WALK-NULL-LITERAL-ARITHMETIC-PREREGISTRATION.md`, the branch's copy, read whole (Amendments 1 and 2 on main and the branch; Amendment 3 on the branch only). Worktree `C:/dev/wt/null-literal` at 3074e9a0, equal to `origin/cut/type-walk-null-literal-arithmetic`. `CARGO_TARGET_DIR=D:/wt-targets/null-literal`. origin/main was c7d0b200 at review time. The merge base is 8786ff6a. Every mutation and probe below was reverted, and `git status --porcelain` was empty after each one and at the end. The engine code and tests are unchanged from 8efcde98 to the head (`git diff --quiet 8efcde98 HEAD -- engine/src engine/tests`, rc 0), so an observation at the head is an observation of 8efcde98's code.

Test-text spans on this unmerged branch are cited by path:line and commit id, with no hash (round 25, item 2).

## S1 (blocking)

**S1-1. §8 item 13: a DuckDB behaviour stated without its version.** The comment above C48's fifth B-T3 entry, `engine/tests/filter_type_admission.rs:418-421` @ 8efcde98 (unchanged at 3074e9a0), states that DuckDB's surrogate prepare refuses `zone BETWEEN NULL * NULL AND NULL` before the type walk, and gives the binder's message. It names no DuckDB version. It dates the observation to the run of this commit, which is no commit id: in a source file it reads as whatever commit later carries the line. Every other DuckDB statement the diff adds names v1.5.5: `engine/src/predicate.rs:1954` and `engine/src/predicate.rs:2045` @ 8efcde98, `engine/tests/filter_type_admission.rs:393` @ 8efcde98, and Amendment 3's result bullet. The behaviour itself is true at v1.5.5; I observed it twice (P-0 re-run and the base probe, below). Remedy: name DuckDB v1.5.5 in that comment and either name 8efcde98 or drop the reference to this commit. It is a comment-only change; no outcome moves.

## S2

**S2-1. The PR body is stale at the head.** `gh pr view 170` (rc 0) still describes gate 1's state:
- it lists three commits, c66b7a06, 51296907 and c6809d0c, and omits 013a3eb4, 8efcde98, a5325ad4 and 3074e9a0;
- it names worker reports 1 and 2 only, M1 to M5, a P-3 that refuses the same number, and 146 of 300 lines;
- at the head the facts are worker report 3, M1 to M7, refused +12 (Amendments 1 and 2), and 270 of 300;
- it does not mention Amendments 1 to 3 or round 49.

The body is not an amendment, and its evidence section is scoped to reports 1 and 2, so I do not count it under the discharge rule. The human reads it at the click. It should be refreshed to the head before the PR is marked ready.

## N

- **N-1. P-0's timing (Amendment 1; §8 item 20).** The run preceded the code. The worker's subagent transcript (agent a09dc5b3c82901f9a) shows: `git log -1 --format=%H` at 10:17:53Z (013a3eb4); the throwaway test created at 10:18:04Z; its printout (v1.5.5, four BIGINT) at 10:18:24Z; the file deleted at 10:18:27Z; the first code edit to `engine/src/predicate.rs` at 10:18:52Z; commit 8efcde98 at 10:27:00Z. The written record, worker report 3, was written at 11:01:23Z and committed on main at c7d0b200, after the code. I read item 20's record as the printout with its commit and version, which precedes the code. I flag the reading for the architect.
- **N-2. Outcomes outside the tabled predicates, consistent with §2.9.** At the head, `NOT -NULL` and `flag OR -NULL` are refused (`NOT` / `OR`, `BIGINT expression`, `boolean_conversion`). At the merge base both were admitted. C51 tables only `flag AND -NULL`, as the boolean junction. Amendment 2's §2.9 says the BOOLEAN-or-NULL junction test now meets a NULL literal only, which covers both shapes; round 49, item 1 rules the fold. Not a defect. The architect may want the class named in the closing record.
- **N-3. Amendment 2 §5's third declared shape class holds.** `-NULL` beside a decimal literal in `+`, `-`, `*` is admitted at the merge base and refused after, for example `NULL = (-NULL) - 0.5` and `((-NULL) - 0.5) IS NULL`: admitted at 8786ff6a, refused at the head (`-`, `BIGINT expression; DECIMAL(2,1) literal`, `conversion_can_fail`). Its named example, `(-NULL) - 0.5 > 0`, was refused at the merge base (residual reason at `>`) and admitted only at c6809d0c, which is what the amendment says.
- **N-4. C48's fifth predicate no longer reaches the walk.** At v1.5.5 the binder pre-empts a VARCHAR operand against a BIGINT-typed bound in `BETWEEN` (C48's fifth predicate, and `zone BETWEEN 'a' AND -NULL` in my probe). So B-T3 has no walk-level `BETWEEN` refusal of a BIGINT expression against VARCHAR. Each shape is refused either way. `*` is still pinned by C50's second predicate, and `BETWEEN` by C50's first.
- **N-5 (nit).** `engine/tests/filter_type_admission.rs:1231` @ 8efcde98 is a 124-column doc-comment line. rustfmt does not reflow comments, so `cargo fmt --check` passes.

## §9 Reviewer list

**Three-dot diff.** `git diff origin/main...origin/cut/type-walk-null-literal-arithmetic` (rc 0; equal to `...HEAD`). It touches 4 files: `engine/README.md` (+2/-2), the form (+10/-0, Amendment 3, a pure append against origin/main; the two-dot diff of the form is the same append), `engine/src/predicate.rs` (+64/-8) and `engine/tests/filter_type_admission.rs` (+192/-6). Its seven commits are c66b7a06, 51296907, c6809d0c, 013a3eb4 (the merge of main), 8efcde98, a5325ad4 and 3074e9a0. Each carries a Signed-off-by trailer.

**Other modules.** `git diff --stat origin/main...origin/cut/type-walk-null-literal-arithmetic -- kernel/ protocol/ frontends/ renderer/` printed nothing (rc 0). `git diff --quiet origin/main...HEAD -- docs/` gave rc 0.

**M1 to M7.** Each was observed at 3074e9a0, whose engine code is 8efcde98's. Each was applied with `sed` and run as `cargo test -p spatial-engine --test filter_type_admission each_corpus_row`, then reverted with `git checkout -- engine/src/predicate.rs`, with porcelain empty after each one. The baseline at the head passed (rc 0). Every mutation failed `each_corpus_row_is_admitted_or_refused_with_its_code_reason_and_operand_types`, rc 101:

| M | Applied as | First failing row, as the run printed it |
|---|---|---|
| M1 | deleted the NULL-beside-NULL arm (`predicate.rs:2043-2048` @ 8efcde98) | C39 `NULL + NULL > 0`: expected admitted, got refused (the residual `conversion_rounds` sentence at `+`) |
| M2 | binary result `within_bounds: true` (`predicate.rs:1989`) | C41: reason, left `ConversionRounds`, right `LiteralOutOfBounds` |
| M3 | reads 1 and 2 of the field reverted to kind literal only (`predicate.rs:2140`, `:2147`) | C40 `NULL - 0.5 > 0`: expected admitted, got refused |
| M4 | read 3 reverted to kind literal only (`predicate.rs:2259`) | C45 `(NULL - 0.5) < (u64 * i64)`: reason, left `ConversionRounds`, right `ConversionCanFail` |
| M5 | a marked result typed `EngineType::Null` (`predicate.rs:1991`) | C45 `(NULL - 0.5) < (u64 * i64)`: expected TypeNotAdmitted, got Ok |
| M6 | the NULL-beside-NULL arm returns `EngineType::Null` (`predicate.rs:2047`) | C48 `zone = NULL + NULL`: expected TypeNotAdmitted, got Ok |
| M7 | the unary arm over a NULL literal returns `EngineType::Null` (`predicate.rs:1956`) | C51 `zone = -NULL`: expected TypeNotAdmitted, got Ok |

Each matches §4 and Amendments 1 and 2 by name. M2 and M4 were run twice (the first grep missed the row label); both runs of each failed the same way. §4's claim that C42 also breaks under M2 was confirmed in gate 1 and not re-run here. No `verify-mutation` run was used.

**P-0 (Amendment 1; §8 item 20).** Worker report 3's P-0 section is complete: the commit (013a3eb4), DuckDB v1.5.5 from `select version()`, and all four types (BIGINT). It preceded the code (N-1). I re-ran P-0 as a throwaway test on `configured_connection()`, created as `engine/tests/p0_reviewer_throwaway.rs`, run once, deleted, never committed (porcelain empty after). It printed DuckDB v1.5.5 and BIGINT for `NULL + NULL`, `NULL - NULL`, `NULL * NULL` and `-NULL`, and for the prepare of the C48 fifth-predicate shape over a VARCHAR table, DuckDB's binder error about mixing VARCHAR and BIGINT in a `BETWEEN` clause (rc 0).

**P-3 (as Amendments 1 and 2 restate it).** Both runs were made in this gate. The base run used the two engine files checked out from 8786ff6a and restored afterwards. `git diff --stat 10febb28 8786ff6a -- engine/src engine/tests` and `git diff --stat 8786ff6a origin/main -- engine/` are both empty.

| Run | Command | rc | Printed |
|---|---|---|---|
| B-T1 at 3074e9a0 | `cargo test -p spatial-engine --test filter_type_admission the_type_walk_agrees_with_the_binder_over_the_p0_matrix -- --nocapture` | 0 | `B-T1: 4564 admitted, 5164 refused, 0 failures` (235.40 s) |
| B-T1 at 8786ff6a | same | 0 | `B-T1: 4553 admitted, 5152 refused, 0 failures` (235.50 s) |
| B-T1b at 3074e9a0 | `cargo test -p spatial-engine --lib the_walk_types_every_arithmetic_node_as_the_binder_does -- --nocapture` | 0 | `B-T1b: 897 arithmetic nodes checked, 0 failures` |
| B-T1b at 8786ff6a | same | 0 | `B-T1b: 897 arithmetic nodes checked, 0 failures` |

Admitted rose by 11 (§3's nine plus C50's two), and refused rose by 12 (Amendment 1's seven plus Amendment 2's five). B-T1b is equal. P-3 holds as restated. Part 3 is 346 and the total 9,728, and both assertions passed.

**C48 to C51 against their tables.** The B-T3 entries match the tables cell by cell: construct, operand types and reason through `tna_named`, which asserts all three. C48's fifth predicate is the exception: it is pinned as `Predicted::Code("skp.filter_rejected_by_binder")`. C50's two predicates are `Admitted`. B-T3 is green at the head (rc 0), so every tabled outcome holds.

**Amendment 3 against what I observe.**
- The binder refusal of C48's fifth predicate holds at v1.5.5 (P-0 re-run; B-T3 green on that entry).
- The merge base also refused it. I appended the entry, and a sentinel `zone = NULL + NULL` expected admitted, to the corpus at 8786ff6a. The run passed the C48 fifth entry as `skp.filter_rejected_by_binder` and failed on the sentinel, which the base refuses at `+` (rc 101, as intended). Reverted.
- The entry is in 8efcde98 (`engine/tests/filter_type_admission.rs:418-426` @ 8efcde98), byte-identical at the head.
- Every other C48 to C51 outcome is as tabled; P-3 holds; no invalidator fired (§8 below).

**§5's declared changes outside §3.** Checked by a throwaway test appended to `engine/tests/filter_type_admission.rs`, run at the head and at 8786ff6a, then reverted (rc 0 at each; porcelain empty):
- Amendment 1:
  - `f32 > NULL * NULL`, `f64 > NULL + NULL` and `1e3 > NULL - NULL` refuse at the comparison with the residual reason (`REAL`/`DOUBLE`/`DOUBLE literal`; `BIGINT expression`; `ConversionRounds`);
  - `(NULL + NULL) - 0.5 > 0` refuses at `-` with `ConversionCanFail`;
  - at the base, all four were refused at the inner operator (`NULL literal; NULL literal`, `ConversionRounds`), as declared.
- Amendment 2:
  - `f32 > -NULL` and `f64 < -NULL` refuse with the residual reason; `-NULL + f64 > 0` and `-NULL * 1e3 > 0` refuse at the operator with the residual reason; `(-NULL) - 0.5 > 0` refuses at `-` with `ConversionCanFail`;
  - at the base, the first four were admitted;
  - see N-3 for the decimal-literal class.

**§2.7 against the diff.**
- `engine/README.md` carries the form's path between `TESTS-CONFIGURED-CONNECTIONS` and `WATCHER-FIRST-READ` (added at 51296907).
- Last verified at reads 8efcde9 (a5325ad4). It resolves uniquely to 8efcde986e5822048d77e29e8fd5b1ddbe20430f, which the merge commit keeps reachable.
- No other index line changed.
- At 8efcde98, the section's 25 unique backticked `path::fn` pointers and 32 file pointers all resolve (`git show` / `git cat-file -e`, 0 misses).
- `kernel/README.md` is untouched.

**§7 budget.** `git diff --numstat origin/main...HEAD` (rc 0), with the form's exclusions (`*.md`, `state/**`, `PLAN.yaml`, `CUSTODIAN-QUEUE.*`, `site/**`, lockfiles): `predicate.rs` 64+8 and `filter_type_admission.rs` 192+6, which is 270 of 300 over 2 files. There is no overrun, and §7 is unedited.

**CI.** `gh pr checks 170` (rc 0): all 15 checks pass, including both Windows `cargo test --workspace` jobs. `gh run view` on each of the nine runs (rc 0) shows `headSha` 3074e9a0f6dea131a57d30e30da56022a4d85751, with conclusion success.

## §8 item by item

1. **Pass.**
   - The form's commit 4270507d is an ancestor of c66b7a06 (rc 0).
   - 8786ff6a, which carries Amendments 1 and 2, is an ancestor of 8efcde98 (rc 0). It was committed at 10:17:08Z; the worker began at 10:17:53Z; 8efcde98 was committed at 10:27:00Z.
   - O-2's code was verified in gate 1.
2. **Pass.** No variant, wire value, sentence or Display changed. The predicate.rs diff adds no non-comment line with a string literal.
3. **Pass.** The stat under the four modules is empty, and there is no ADR-021 or SKP-V0 edit.
4. **Pass.** The corpus diff only appends. The only deletions are the part-3 count (323 to 346), the total (9,705 to 9,728) and three doc-comment lines.
5. **Pass.** NULL beside NULL comes from §2.1 as replaced. Unary over NULL comes from §2.9 (Amendment 2, class 9). NULL beside VARCHAR or BOOLEAN stays refused (`is_numeric` guard).
6. **Pass.** The flag comes from both operands (`predicate.rs:1989` @ 8efcde98), and `type_of_division` is not in the diff.
7. **Pass.**
   - The field is false at both constructors and in every `literal_typed` arm, and set only in the binary arm.
   - It is read at the three named places (`predicate.rs:2140`, `:2147`, `:2259` @ 8efcde98) plus the partner read that Amendment 1's §8 names.
   - It is never set over an out-of-bounds literal: the literal branch requires `within_bounds`, and a marked partner is in bounds by construction.
   - No result is retyped NULL (M5).
   - The doc comment and the set-condition comment now say what Amendment 1's §8 requires (`predicate.rs:1493-1502`, `:1975-1979` @ 8efcde98).
8. **Pass.** No file value in any field or Display, and no message added.
9. **Pass.** No added `pub` line (grep over the diff, rc 1).
10. **Pass.** No added `cfg(` line (same grep).
11. **Pass.** No added ignore (same grep).
12. **Pass.** Worker report 3 records each mutation's run and says no `verify-mutation` run was used. Amendment 3 makes no mutation claim.
13. **FAIL.** See S1-1.
14. **Pass.** Amendment 3's clauses resolve (above). The diff adds no other amendment.
15. **Pass.** No performance claim.
16. **Pass.** See §2.7.
17. **Pass.**
    - The draft's span from its line 7 to the end at origin/main, the ADR-021 span 269-275 at origin/main, and the same span at HEAD each hash (sha256 over `git show` output piped through `sed -n`) to 412038b1b662c46e2aba202767632a47c808ee5c835a1a6c8edd4bc6dda579b8 (rc 0).
    - The two-dot diff of ADR-021 and SKP-V0 against origin/main is empty (rc 0).
    - The human's answers are in the RULED blocks: round 45, item 2 and round 46, item 3.
    - The PR is unmerged.
18. **Pass.** 270 is at most 300, so there is no class-8 event, and §7 is unedited. Amendment 2's scope addition is recorded as class 9 (round 49, item 1) at 8786ff6a, before its code at 8efcde98.
19. **Pass.** Amendment 3 names the B-T3 entry by commit id (8efcde98, in full in its header) with no hash. The PR body pins no test text by hash.
20. **Pass.** The type is P-0's BIGINT, re-observed here, and the P-0 run preceded the code (N-1).
21. **Pass.** `EngineType::Null` is constructed only in `literal_typed`'s NULL arm (`predicate.rs:1736` @ 8efcde98). Surrogate column types never map to NULL (`engine_type_of_surrogate`). Unary and binary NULL results are BIGINT.

## Seams and the caller rule

There is no cross-module seam in the diff. The kernel's `filter_error_of` and the shell's `refusalGuidance` consume `FilterError::TypeNotAdmitted` and its code unchanged, and the workspace and shell suites are green at the head. The diff adds no `pub` item, callback or option. The new private field's only readers and its setter are on the admission path.

## Discharge claims resolved

Amendment 3 is the only amendment the diff adds. Each of its clauses resolves:
- the observation at 8efcde98: the entry is in that commit;
- the base also refused the shape: base probe;
- every other C48 to C51 outcome as tabled: B-T3 green, cell by cell;
- P-3 +11/+12 with B-T1b equal: re-run;
- no invalidator fired: §8 and the probes.

## Commands (rc)

- `git status --porcelain` (empty), `git rev-parse HEAD` → 3074e9a0, `git fetch origin`, `git rev-parse` of the branch and origin/main (0 each)
- `git log --oneline origin/main..HEAD`, `git merge-base origin/main HEAD` → 8786ff6a (0)
- `git diff --stat` / full / `--numstat` three-dot, and the four-module stat (0 each)
- `git diff origin/main HEAD -- <form>` (0); `git diff --stat 8786ff6a origin/main -- engine/` (0, empty); `git diff --stat 10febb28 8786ff6a -- engine/src engine/tests` (0, empty); `git diff --quiet 8efcde98 HEAD -- engine/src engine/tests` (0)
- `gh pr checks 170` (0); `gh run view <id> --json headSha,...` ×9 (0); `gh pr view 170` (0)
- B-T3 baseline at the head (0); M1 to M7 (101 each); M2 and M4 re-run (101 each)
- B-T1 at the head and at 8786ff6a (0, 0); B-T1b at both (0, 0)
- P-0 throwaway (0), deleted
- C48 fifth-predicate probe at 8786ff6a (101, the sentinel as intended), reverted
- §5 probes at the head and at 8786ff6a, three sets (0 each), reverted
- `git merge-base --is-ancestor 4270507d c66b7a06` (0); `git merge-base --is-ancestor 8786ff6a 8efcde98` (0)
- diff greps for `pub` / `cfg(` / ignore (1, none) and for string literals (1, none)
- the §2.7 pointer check at 8efcde98 (0 misses)
- the §8 item 17 hashes (0 ×3) and the ADR-021/SKP-V0 diff (0)
- `cargo fmt -p spatial-engine --check` (0)
- `git status --porcelain` after every revert and at the end: empty, HEAD 3074e9a0
