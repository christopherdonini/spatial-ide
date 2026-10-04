*Custodian's filing note (2026-10-04): node 10's worker-high report 3, correction round 1 (Amendments 1 and 2) under node:type-walk-null-literal-arithmetic@g3. Written by the worker to this path and committed as written below the rule. Its sha256, from this file's line 5 to the end, is f4a6d9a721bd25aed9b620eeede687f1c4660ae74c1280482b3162b2b961fda3, equal to the hand-back. Its commits are 8efcde98 (the code and tests; P-0 all BIGINT at v1.5.5) and a5325ad4 (the owner's index). The class-2 result it reports (C48's fifth predicate rejected by the binder, H-4's declared outcome) is recorded as the form's Amendment 3, appended by the custodian on the branch at 3074e9a0. The node moves to generation 4. Worker cost: 135,984 subagent tokens, 53 tool uses, 2,638,318 ms.*

---

# node 10 worker report 3 — correction round 1 (Amendments 1 and 2)

Tag `node:type-walk-null-literal-arithmetic@g3`. Branch `cut/type-walk-null-literal-arithmetic`, worktree `C:/dev/wt/null-literal`, per-worktree `CARGO_TARGET_DIR=D:/wt-targets/null-literal`. Started at 013a3eb4. Code and tests at 8efcde98, owner's index at a5325ad4 (head, pushed). Model observed: Sonnet 5.5 (`claude-sonnet-5-5`), run at the worker-high profile; no override; no context handoff received or produced.

**Verdict: complete, no invalidator fired. One class-2 result to record (C48's fifth predicate), below.**

## P-0 (Amendment 1), before any code

A throwaway test `engine/tests/p0_throwaway.rs` on B-T1's oracle connection (`configured_connection()`), never committed (deleted, porcelain empty after). Ran at commit 013a3eb4, DuckDB version printed by `select version()` is v1.5.5. Printout, as run:

```
P0 duckdb version: v1.5.5
P0 typeof(NULL + NULL) = BIGINT
P0 typeof(NULL - NULL) = BIGINT
P0 typeof(NULL * NULL) = BIGINT
P0 typeof(-NULL) = BIGINT
```

All four BIGINT, as H-3 predicted. Code went on after this record.

## What was built (`engine/src/predicate.rs`)

- Amendment 1's section 2.1 as replaced: in `admitted_arithmetic_result`, NULL beside NULL now returns BIGINT (the binder's type), kind expression, within bounds. Previously NULL.
- Amendment 2's section 2.9: in `type_of_arithmetic`'s unary arm, a NULL operand returns `Typed::expression(EngineType::BigInt)`. A numeric operand is unchanged (struct update, carries the field, C47).
- Amendment 1's section 8 (the reviewer's S2-1): the doc comment on `Typed::counts_as_decimal_literal` and the comment at the binary arm's set condition now say the NULL-typed operand is a NULL literal, the partner may be a result that already counts, and the set condition is a fourth read (of the partner). The unary arm's doc comment states the NULL literal's BIGINT type.
- The only construction of `ty: EngineType::Null` left in the file is `literal_typed`'s NULL arm (grep: one site). That is section 8 item 21's condition.
- No `pub` item added; no `cfg`; `git diff origin/main...HEAD` over `engine/src` and `engine/tests` has no added `pub` or `cfg(` line.

## Tests (`engine/tests/filter_type_admission.rs`)

- B-T3 rows C48 to C51 appended to `corpus`, as the amendments table them, plus the corpus's doc comments naming Amendments 1 and 2 and M1 to M7.
- B-T1 part 3 pins appended: C48 (five), C49, C50 (two), `f32 > NULL * NULL`, C51 (four), `f32 > -NULL`. Part 3 is 346 and the total 9,728; the assertions and doc comments say so.
- **Class-2 result (H-4), one predicate.** C48's fifth predicate, `zone BETWEEN NULL * NULL AND NULL`, is not a `TypeNotAdmitted` at v1.5.5. The surrogate prepare refuses it before the type walk runs (stage order: `bind_admit` precedes the walk), with `Binder Error: Cannot mix values of type VARCHAR and BIGINT in BETWEEN clause - an explicit cast is required`, so the outcome is `RejectedByBinder` (`skp.filter_rejected_by_binder`). I pinned the observed outcome in its B-T3 entry as `Predicted::Code("skp.filter_rejected_by_binder")`, with a comment. The form's C48 table row still predicts `TypeNotAdmitted`, so the custodian owes the class-2 record. The shape is refused at the merge base as well, so no admission outcome moves. It does not meet the invalidator "a C48 or C49 shape admitted". The other four C48 predicates, C49 and C51's four came out as tabled, operand types and reasons included.

## Mutations (each applied, run, failure recorded by name, reverted; observed at 8efcde98)

All run as `cargo test -p spatial-engine --test filter_type_admission each_corpus_row`; every failure is in `each_corpus_row_is_admitted_or_refused_with_its_code_reason_and_operand_types`, exit 101; `git status --porcelain` empty after each revert. No `verify-mutation` run used.

| M | Applied as | First failing row, as printed |
|---|---|---|
| M1 | the NULL-beside-NULL arm deleted | C39 `NULL + NULL > 0`: expected admitted, got refused (`+` over NULL literal and NULL literal) |
| M2 | binary result `within_bounds: true` | C41: reason, left `ConversionRounds`, right `LiteralOutOfBounds` |
| M3 | reads 1 and 2 of the field reverted to kind literal only | C40 `NULL - 0.5 > 0`: expected admitted, got refused |
| M4 | read 3 (in `determine_reason`) reverted to kind literal only | C45 `(NULL - 0.5) < (u64 * i64)`: reason, left `ConversionRounds`, right `ConversionCanFail` |
| M5 | marked result typed `EngineType::Null` | C45 `(NULL - 0.5) < (u64 * i64)`: expected TypeNotAdmitted, got Ok |
| M6 | NULL-beside-NULL arm returns NULL again | C48 `zone = NULL + NULL`: expected TypeNotAdmitted, got Ok |
| M7 | unary arm over a NULL literal returns NULL again | C51 `zone = -NULL`: expected TypeNotAdmitted, got Ok |

The mutation helper script lived in the session scratchpad and is not committed.

## P-3, two runs

Command: `cargo test -p spatial-engine --test filter_type_admission the_type_walk_agrees_with_the_binder_over_the_p0_matrix -- --nocapture`, and `cargo test -p spatial-engine --lib the_walk_types_every_arithmetic_node_as_the_binder_does -- --nocapture`.

| Run | B-T1 printed | B-T1b printed | exit |
|---|---|---|---|
| merge base (the two engine files checked out from 10febb28; origin/main's `engine/src` and `engine/tests` are identical to it, `git diff --stat` empty), restored after | `B-T1: 4553 admitted, 5152 refused, 0 failures` | `B-T1b: 897 arithmetic nodes checked, 0 failures` | 0, 0 |
| head (code at 8efcde98; a5325ad4 changes only `engine/README.md`) | `B-T1: 4564 admitted, 5164 refused, 0 failures` | `B-T1b: 897 arithmetic nodes checked, 0 failures` | 0, 0 |

Admitted rose by 11 (the nine admitted pins already in part 3 at 332, which the base's 323-case part 3 lacks, plus C50's two); refused rose by 12 (seven from Amendment 1, five from Amendment 2). B-T1b is equal at 897. P-3 as restated holds.

## Suite, format, budget

- `cargo test -p spatial-engine` at head: exit 0; 36 suites, 383 passed, 0 failed, 12 ignored (the existing ignores).
- `cargo fmt -p spatial-engine --check`: exit 0.
- Form section 7's count by its own command, `git diff --numstat origin/main...HEAD` with the form's exclusions: `predicate.rs` 64 + 8, `filter_type_admission.rs` 192 + 6 = 270 of 300, over 2 files. Within budget; no class 8.
- `git diff --stat origin/main...HEAD -- kernel/ protocol/ frontends/ renderer/`: empty.

## The owner's index

`engine/README.md`'s owner's-index section was checked at 8efcde9: 27 `path::test` pointers resolve to a `fn`, 32 file pointers exist, 76 `spatial_engine::`, `spatial_kernel::` and ceiling-constant symbols appear in the sources; 0 misses. The form's path is already on the preregistrations line, between the two entries section 2.7 names. "Last verified at" moved from c66b7a0 to 8efcde9 (a5325ad4). No other line changed.

## Verifiers at head (exit codes)

- `node scripts/plan/verify-cites.mjs`: 0 (PASS, 1234 files; 34 loose advisories, none in my files).
- `node scripts/plan/verify-quotes.mjs`: 0 (PASS, 113 checked).
- `node scripts/plan/verify-quotes.mjs --show-cites engine/README.md engine/src/predicate.rs engine/tests/filter_type_admission.rs`: 0 (0 checked; no quote in my files).
- `node scripts/plan/verify-test-claims.mjs`: 0 (PASS, 488 claimed tests).
- `node scripts/plan/verify.mjs`: 0 (verify:plan PASS).

## Invalidators and block-on-sight

- Amendment 1's: P-0 equal to H-3 (no stop); no C48 or C49 shape admitted by the walk.
- Amendment 2's: no C51 shape admitted; C1 to C47 all pass unchanged (the full B-T3 run is green).
- Section 8 item 20: the type is P-0's (BIGINT), and the P-0 record precedes all code. Item 21: one `Null` construction, in `literal_typed`. Item 7: the field is set only in the binary arm, read at the three named places plus the setter's partner read, and no result is retyped as NULL (M5 pins it). Items 3, 4, 9, 10, 11: no diff outside `engine/`, no existing prediction or assertion weakened (only the part-3 count and total change), no `pub`, no `cfg`, no ignore.

## Pre-gate self-check (the four classes)

1. Cross-module: none touched; the form's seams (kernel through `FilterError::TypeNotAdmitted`) are unchanged, no code outside `engine/`.
2. Completion claims: each points to a run above (mutations, P-3, suite) with its exit code.
3. User-facing messages: no string added or changed; the reason sentences are the existing ones, and each C48 to C51 refusal's sentence is true of its shape.
4. Tests reach their assertion: each mutation fails at the named row's assertion, not at setup.

## Off-scope noticed, not done

- Amendment 1's section 5 and section 3 name C48's fifth predicate as `TypeNotAdmitted`; the observed outcome is `RejectedByBinder` (above). A class-2 record is the custodian's.
- The declared changes outside section 3 (a REAL or DOUBLE column against a NULL-op-NULL or `-NULL` result) have no B-T3 row, as the amendments say; their B-T1 pins are `f32 > NULL * NULL` and `f32 > -NULL`, both counted refused in the tallies above.

## State left

Pushed head a5325ad49a409ded4d9048dac975069062295d6a (`origin/cut/type-walk-null-literal-arithmetic`), two new commits on 013a3eb4, both signed off: 8efcde98 (code and tests) and a5325ad4 (owner's index). `git status --porcelain` in the worktree: empty. The throwaway P-0 test file is deleted and was never committed. No cargo target removed.
