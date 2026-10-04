*Custodian's filing note (2026-10-04): PR #170's gate 1, the reviewer, for PLAN node `type-walk-null-literal-arithmetic` (node 10), under the tag node:type-walk-null-literal-arithmetic@g2. Reviewed: cut/type-walk-null-literal-arithmetic @ c6809d0c2a56aebca951b9a018e547c499cb611d (from the report's own second line). Filed under `state/consults/gates/` by `AUTONOMY.md` §25(b). Written by the reviewer to this path through its shell, as its brief permitted, and committed as written below the rule. Its sha256, from this file's line 5 to the end, is 588242be603d22acc1c23e24cae5b88536949555cc54e778e41b280ff3b251cc, equal to the hand-back. The worktree's porcelain was empty after the run. **S1-1 is a falsification of §2.1 at DuckDB v1.5.5.** Its N-1, a pre-existing defect on main in the predecessor's unary admission (`zone = -NULL`, and `zone IS DISTINCT FROM -NULL` ending its stream in a Conversion Error that names a file value), is taken as a ledger finding and routed with S1-1's remedy. Cost: 120,051 subagent tokens, 50 tool uses, 1,585,239 ms. Profile paths redacted at filing: none.*

---

# PR #170 gate 1 — reviewer
Reviewed: cut/type-walk-null-literal-arithmetic @ c6809d0c2a56aebca951b9a018e547c499cb611d

**Verdict: FAIL.** There is one S1: the form's §5 Falsification clause fires for §2.1's own shape at a VARCHAR or BOOLEAN junction.

Governing form: `engine/TYPE-WALK-NULL-LITERAL-ARITHMETIC-PREREGISTRATION.md` on main (landed at 4270507d). Worktree `C:/dev/wt/null-literal`, `CARGO_TARGET_DIR=D:/wt-targets/null-literal`. Merge base 10febb28. origin/main was d55458c5 at review time. Every mutation and probe below was reverted, and `git status --porcelain` was empty after each one and at the end.

## S1 (blocking)

**S1-1. §2.1 is falsified at DuckDB v1.5.5 (§5 Falsification; §5 Invalidators: stop and return to the custodian; docs/01 principle 8).**

§2.1 admits NULL beside NULL, typed NULL (`engine/src/predicate.rs:2031-2035` @ c6809d0c). Any comparison-shaped junction then admits that result by comparison rule 2 (`engine/src/predicate.rs:2117-2120` @ c6809d0c), whatever the partner's type is. Against a VARCHAR or BOOLEAN column, the plan casts the file column to BIGINT. That cast is outside the predecessor's §7 set. In one shape the stream ends in a conversion error that carries a value read from the file.

I observed this by temporarily appending pins to B-T1 part 3 (`the_type_walk_agrees_with_the_binder_over_the_p0_matrix`), adjusting its two count assertions, running it, and reverting.
- **At c6809d0c,** probes 1 to 7: the run printed `B-T1: 4569 admitted, 5152 refused, 2 failures` (rc 101).
  - `zone = NULL + NULL` failed B-T1 (i) with an undeclared cast, column VARCHAR -> BIGINT.
  - `flag = NULL + NULL` failed B-T1 (i) with an undeclared cast, column BOOLEAN -> BIGINT.
  - `(NULL + NULL) - 0.5 > 0`, `(-NULL) - 0.5 > 0`, `(NULL + NULL) + i64 > 0`, `f32 > NULL * NULL` and `i64 BETWEEN NULL + NULL AND 1` were admitted, with no failure.
- **At c6809d0c,** probes 8 to 12: the run printed `B-T1: 4567 admitted, 5152 refused, 5 failures` (rc 101).
  - `zone IS DISTINCT FROM NULL + NULL` failed (i) (VARCHAR -> BIGINT). It also failed (iii): the stream ended in error. The run printed: `admitted, but the stream ended in error: query: execute: Conversion Error: Could not convert string 'civic' to INT64 when casting from source column zone`.
  - `zone = NULL - NULL` failed (i) (VARCHAR -> BIGINT).
  - `zone = -NULL` failed (i) (VARCHAR -> BIGINT), and `flag = -NULL` failed (i) (BOOLEAN -> BIGINT). Both are pre-existing; see N-1.
  - `zone = NULL` was admitted, with no failure.
- **At the merge base 10febb28,** with the two engine files checked out from it: the run printed `B-T1: 4555 admitted, 5154 refused, 3 failures` (rc 101).
  - `zone = NULL + NULL` and `zone IS DISTINCT FROM NULL + NULL` were refused. That is the +2 in the refused tally.
  - `zone = -NULL` and `zone IS DISTINCT FROM -NULL` were admitted, with the same cast. The latter's stream failed with the same Conversion Error.

So this PR newly admits `<VARCHAR|BOOLEAN column> <cmp> NULL op NULL` predicates that the base refuses. The new admissions carry a plan cast outside the predecessor's §7 set, and at least one of them ends its stream in error naming a file value. That is the §5 Falsification clause, met for "a shape that §2 admits".

The form's own pins do not reach the shape. B-T3 has only C39 (`NULL + NULL > 0`, an integer partner), and B-T1 pins only C39 for §2.1. §2.3 refuses to retype case (b) as NULL for this very reason: retyping would let the result pass rule 2 against VARCHAR and BOOLEAN (§2.3, "What it does not do"). §2.1 types NULL-with-NULL as NULL, which opens the same hazard and leaves it unpinned.

The remedy is the custodian's and the architect's, under §5's invalidator route. This gate does not choose it.

## S2

**S2-1. The field's doc comment is false at the head.** `engine/src/predicate.rs:1493-1497` @ c6809d0c says the field is set only over a NULL literal and is read in exactly three places.
- After c6809d0c, the binary arm's set condition also reads the field (`engine/src/predicate.rs:1968-1975` @ c6809d0c). That is the O-2 disjunct, ruled by round 45, item 1.
- The condition tests a NULL-typed operand (`ty == Null`), not a NULL literal. That matches §2.3's "NULL-typed", but not the comment.
- The inline comment at `engine/src/predicate.rs:1965-1967` @ c6809d0c also says "NULL literal".
- §8 item 7's second bullet ("read outside its three named places") has no O-2 qualifier. The fourth read follows from round 45, item 1, which adds a disjunct to §2.3's set condition. I do not count it as crossing item 7, but I flag it for the architect's reading of §8 item 7.

## N

- **N-1 (pre-existing, outside this piece).** Unary `-NULL` against a VARCHAR or BOOLEAN partner already carries an undeclared column cast at 10febb28. `zone IS DISTINCT FROM -NULL` already ends its stream in the Conversion Error (evidence under S1-1). §2.1 says it follows "the path C32's `-NULL > 0` already takes". That path is itself defective at non-numeric junctions. This belongs to the predecessor (`engine/FILTER-BIND-COERCIONS-PREREGISTRATION.md`, Amendment 4's unary admission) and should go to the custodian as a ledger finding.
- **N-2.** §4 claims no mutation for the O-2 disjunct. As an extra probe, I replaced the disjunct with `|| false` at `engine/src/predicate.rs:1971` @ c6809d0c. B-T3 failed on C47 (`NULL + (NULL - 0.5) > 0`): expected admitted, got refused (rc 101). Reverted. C47b does pin the disjunct.
- **N-3.** M3 removes reads 1 and 2 together. As an extra probe, I removed read 2 alone (`engine/src/predicate.rs:2134` @ c6809d0c). B-T3 failed on C44 (`f32 > NULL - 0.5`), refused (rc 101). Reverted. Each read is pinned.
- **N-4.** Worker report 1's "tension" (the unary arm carried the field at c66b7a06, before the O-2 ruling) does not cross §8 item 1. §2.4 states that default in advance: "(i) has no code either way at the default."
- **N-5.** The worker reports record M1 to M5 at c66b7a06. This gate re-observed them at the head, c6809d0c (below).

## §9 Reviewer list

**Three-dot diff.** `git diff origin/main...origin/cut/type-walk-null-literal-arithmetic`, rc 0. It touches 3 files: `engine/README.md` (+2/-2), `engine/src/predicate.rs` (+48/-5) and `engine/tests/filter_type_admission.rs` (+87/-6). It has three commits: c66b7a06, 51296907 and c6809d0c, all signed off.

**Other modules.** `git diff --stat origin/main...origin/cut/type-walk-null-literal-arithmetic -- kernel/ protocol/ frontends/ renderer/` printed nothing, rc 0. It is empty.

**M1 to M5.** Each was observed at c6809d0c. Each was applied with `sed`, run as `cargo test -p spatial-engine --test filter_type_admission each_corpus_row`, and reverted with `git checkout -- <file>`. The baseline run at the head passed (rc 0). Every mutation failed `each_corpus_row_is_admitted_or_refused_with_its_code_reason_and_operand_types`:

| Mutation | Applied as | rc | First failing row, as the run printed it |
|---|---|---|---|
| M1 | deleted `predicate.rs:2031-2035` (the §2.1 arm) | 101 | C39 `NULL + NULL > 0`: expected admitted, got refused (`conversion_rounds` sentence) |
| M2 | `within_bounds: true` at `predicate.rs:1977` | 101 | C41: reason, left `ConversionRounds`, right `LiteralOutOfBounds` |
| M2, second run (C41's entry removed from the test as well) | as above | 101 | C42: expected TypeNotAdmitted, got Ok. This confirms §4's "C42 also breaks". |
| M3 | reads 1 and 2 reverted to kind-literal only | 101 | C40 `NULL - 0.5 > 0`: expected admitted, got refused |
| M4 | read 3 reverted to kind-literal only | 101 | C45 `(NULL - 0.5) < (u64 * i64)`: reason, left `ConversionRounds`, right `ConversionCanFail` |
| M5 | result typed `EngineType::Null` when marked (`predicate.rs:1979`) | 101 | C45 `(NULL - 0.5) < (u64 * i64)`: expected TypeNotAdmitted, got Ok |

No `verify-mutation` run was used.

**P-3.** Both runs were made in this gate. The base run used the two engine files checked out from 10febb28, restored afterwards.

| Run | Command | rc | Printed |
|---|---|---|---|
| B-T1 at c6809d0c | `cargo test -p spatial-engine --test filter_type_admission the_type_walk_agrees_with_the_binder_over_the_p0_matrix -- --nocapture` | 0 | `B-T1: 4562 admitted, 5152 refused, 0 failures` (168.42 s) |
| B-T1 at 10febb28 | same | 0 | `B-T1: 4553 admitted, 5152 refused, 0 failures` (148.43 s) |
| B-T1b at c6809d0c | `cargo test -p spatial-engine --lib the_walk_types_every_arithmetic_node_as_the_binder_does -- --nocapture` | 0 | `B-T1b: 897 arithmetic nodes checked, 0 failures` |
| B-T1b at 10febb28 | same | 0 | `B-T1b: 897 arithmetic nodes checked, 0 failures` |

- The refused tally is equal (5152).
- The admitted tally rose by 9, which is the pin count (C39, C40, C44 ×5, C47 ×2).
- B-T1b's checked count is equal (897).
- P-3 holds as stated. Its discriminator does not reach S1-1's shapes, which are not in the enumeration.

**§2.7 against the diff.**
- `engine/README.md` gains the form's path between `TESTS-CONFIGURED-CONNECTIONS` and `WATCHER-FIRST-READ`. That matches.
- "Last verified at" moved to c66b7a0, which is reachable through the merge commit.
- No other line of the index changed.
- I checked every backticked `path::test` pointer (25) and file pointer (19) in the section at c66b7a06 with `git show`/`git cat-file -e`. There were 0 misses (rc 0).
- `kernel/README.md` is untouched.

**Discharge claims resolved.** The diff adds no amendment, and the form's §10 is empty. The PR body's claims resolve as follows:
- "M1 to M5 are each observed": re-observed above.
- P-3: re-run above.
- "146 of 300 lines over 2 files": `git diff --numstat origin/main...HEAD` (rc 0) gives 48+5+87+6 = 146 over `predicate.rs` and `filter_type_admission.rs`, with `README.md` excluded as `*.md`.
- "landed on main byte-identical at 1445eaf3": resolved under §8 item 17.

## §8 item by item

1. **Pass.**
   - The form's commit 4270507d is an ancestor of c66b7a06 (`git merge-base --is-ancestor`, rc 0).
   - The O-2 code is in c6809d0c only. `git diff c66b7a06 c6809d0c -- engine/src/predicate.rs` shows the one disjunct.
   - c6809d0c was committed at 2026-10-03T23:44:08+02:00. The ledger's round 45 (RULED block, item 1) records the answer at 21:42:27Z, which is 23:42:27+02:00.
2. **Pass.** No variant, wire value, sentence or Display changed.
3. **Pass.** The stat under the four modules is empty. No ADR-021 or SKP-V0 file is in the diff.
4. **Pass.** C1 to C38 are untouched (the diff only appends). Only the B-T1 part-3 count (323 to 332) and the total (9,705 to 9,714) change.
5. **Pass**, within the predecessor's §2.5(a) as changed by §2.1. NULL beside VARCHAR or BOOLEAN in arithmetic is still refused (`is_numeric` guard).
6. **Pass.** The flag comes from both operands (`predicate.rs:1977`). `type_of_division` is not in the diff.
7. **Pass, with S2-1's note.**
   - The field is set only in the binary arm, under §2.3's condition plus the ruled O-2 disjunct. It is carried by the unary struct update.
   - It is read at the three named places, and in the setter under O-2.
   - Over an out-of-bounds literal it is not set: the setter requires `within_bounds` on the literal.
   - No result is retyped as NULL.
8. **Pass for the engine's own fields and Display.** S1-1's file value comes from DuckDB's stream error on a newly admitted predicate, which is the defect itself.
9. **Pass.** No `pub` item.
10. **Pass.** No `cfg`.
11. **Pass.** No ignore.
12. **Pass.** The reports record runs, and "no `verify-mutation` run".
13. **Pass.** The diff states no DuckDB behaviour.
14. **Pass.** See "Discharge claims resolved".
15. **Pass.** No performance claim.
16. **Pass.** See §2.7.
17. **Pass.** These comparisons gave rc 0, identical:
    - `git show origin/main:state/drafts/adr-021-note-2026-10-03-rendered.md | sed -n '7,$p' | sha256sum`;
    - `git show 1445eaf3:docs/adr/ADR-021-row-filter-on-viewport-query.md | sed -n '269,275p' | sha256sum`;
    - the same span on origin/main.

    All three give 412038b1b662c46e2aba202767632a47c808ee5c835a1a6c8edd4bc6dda579b8, and `cmp` of the draft span against the main span gave rc 0. 1445eaf3 is an ancestor of origin/main (rc 0). Round 45, item 2 and round 46, item 3 are recorded in the RULED blocks.
18. **Pass.** 146 is at most 300, over 2 files. No class-8 or class-9 event, and §7 is unedited.
19. **Pass.** The PR body and commit messages pin no test-text span by hash. The worker reports name their commits.

**O-2 as ruled yes (round 45, item 1).**
- The unary arm carries the field (`predicate.rs:1948-1951`).
- One disjunct is added to the set condition (`predicate.rs:1968-1971`).
- C47 is in B-T3, and its two pins are in B-T1 part 3 (332 / 9,714).

This matches the ruling.

## CI and the kernel flake

- `gh pr checks 170` (rc 0): the PR run 37190656615 is green on every job, including `cargo test --workspace (windows-latest)`.
- The push run's Windows job 37156146756 shows pending, which is the re-run.
- `cancel_reaches_the_producer_directly_and_is_observed_on_its_own_clock` (`kernel/tests/skp_admission.rs:780` @ c6809d0c) delegates to `cancel_reaches_the_producer_directly_once`. That function streams with `filter: None` (`kernel/tests/skp_admission.rs:839` @ c6809d0c), so the type walk is never entered.
- `git diff --quiet origin/main...HEAD -- kernel/tests/skp_admission.rs` gave rc 0: untouched.
- Nothing in the diff can bear on it. It is consistent with the flake ruled in round 25, item 1 (a).

## Commands (rc)

- `git status --porcelain` (empty); `git rev-parse HEAD` → c6809d0c (0); `git fetch origin` (0); `git merge-base origin/main HEAD` → 10febb28 (0)
- `git diff` / `--stat` / `--numstat` three-dot, as above (0)
- `git log --format=... origin/main..HEAD` (0); the `merge-base --is-ancestor` checks (0, 0)
- `gh pr view 170` (0); `gh pr checks 170` (0)
- B-T3 baseline at the head (0); M1, M2, M2-second, M3, M4, M5 (101 each); the N-2 and N-3 extra probes (101 each); the first N-2 attempt failed to compile (paren error, 101) and was reverted
- B-T1 and B-T1b at the head and at the base (0 ×4)
- the S1-1 probes: at the head (101, 101), at the base (101)
- the §2.7 pointer check (0); the §8 item 17 hash and `cmp` (0)
- `git status --porcelain` after every revert and at the end: empty
