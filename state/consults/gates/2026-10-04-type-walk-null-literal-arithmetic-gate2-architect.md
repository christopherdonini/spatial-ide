*Custodian's filing note (2026-10-04): PR #170's gate 2, the architect, for PLAN node `type-walk-null-literal-arithmetic`, under the tag node:type-walk-null-literal-arithmetic@g4. Reviewed: cut/type-walk-null-literal-arithmetic @ 3074e9a0f6dea131a57d30e30da56022a4d85751 (from the report's own first line). Filed under `state/consults/gates/` by `AUTONOMY.md` §25(b). It arrived as a message and is extracted here mechanically from the session transcript's copy of the hand-back, with the harness's two-space indent removed. Its sha256, from this file's line 5 to the end, is 497f8c88d8591ae2cfdf7fb5e5a5bbe3a5af886545a5201c2f2934a65822af17. Write audit PASS: zero write calls (Read 18, Grep 34, the hand-back 1). C3: the worktree is at 3074e9a0 with an empty porcelain before (11:22:11Z) and after (11:30:31Z); the architect read a byte-exact export of the head's `engine/` tree, not the worktree, while the parallel gate-2 reviewer ran its mutations there. Profile paths redacted at filing: none.*

---

Reviewed: cut/type-walk-null-literal-arithmetic @ 3074e9a0f6dea131a57d30e30da56022a4d85751

# Gate 2, architect: type-walk-null-literal-arithmetic (PR #170, node 10)

**Verdict: PASS.** I found no S1 and no S2. There are four N findings, and none of them blocks.

**How I read it.** I read the export `C:/dev/wt/n170-head-3074e9a0/engine/` and compared it with main's `engine/` (the base's copies). I have no Bash, so I made no diff, no hash and no ancestry check. Those are the reviewer's job, and they are listed under "Closing-record list" below. Branch line numbers are read at 3074e9a0. Main line numbers are read at c7d0b200, whose `engine/` is the base's. Nothing below is a quotation. Every sentence is my paraphrase.

## §8, item by item

1. **Code before the form, or O-2 code before its ruling: holds.** The form, and Amendments 1 and 2 in 8786ff6a, are on main. Worker report 3 puts P-0 at 013a3eb4 and all code at 8efcde98, after both. O-2 was ruled by round 45, item 1. The reviewer still has to confirm the ancestry (closing list, item 3).
2. **A new reason, wire value, sentence or Display: none.** `TypeRefusalReason`, `determine_reason`'s outcomes and `Display` are unchanged. Every added text is a comment.
3. **A diff outside `engine/`, or an ADR-021 or SKP-V0 edit: none.** All four changed files are under `engine/`. Worker report 3 shows the stat empty, and the reviewer re-shows it.
4. **An existing B-T3 prediction edited, or B-T1 weakened: neither.**
   - C1 to C47 are unchanged: main `engine/tests/filter_type_admission.rs:320-340` matches branch :322-342, and the C39 to C47 entries are as at gate 1.
   - C32 is still predicted admitted.
   - Only part 3's count (346, at :1270) and the total (9,728, at :1289) change.
   - B-T1b still asserts 2,083 (`engine/src/predicate.rs:3215`).
5. **An arithmetic pair admitted beyond §2.5(a) as changed by §2.1: none.**
   - The only new binary admission is NULL with NULL (`engine/src/predicate.rs:2043-2048`).
   - Unary `-NULL` was already admitted on main. It is now retyped, not newly admitted.
6. **The flag set other than from both operands, or bounds on `/`: holds.** The flag is the conjunction of both operands' flags (:1989). `type_of_division` (:1909-1939) has no bounds logic.
7. **Misuse of the field: holds, with item 7 read as Amendment 1 reads it.**
   - It is false in both constructors and in every `literal_typed` arm (:1512, :1522, :1740, :1762, :1778, :1786, :1793).
   - It is set only at :1985-1987.
   - It is read at the three named places (:2140, :2147, :2259), plus the partner read at :1983, which Amendment 1 adds as a fourth named place under round 45, item 1.
   - It is never set over an out-of-bounds literal: the literal arm requires `within_bounds`, and a marked partner is always within bounds.
   - No result is retyped NULL.
8. **A file value, or another module's consequence: none.**
9. **A new `pub` item: none.** `predicate.rs` has 10 `pub` lines at both base and head. The test file has none.
10. **A new cfg: none.** The `cfg(`/ignore count in `predicate.rs` is 2 at both. The test file has none.
11. **A new platform ignore: none.**
12. **Mutation observations: holds.**
   - Worker report 3 records M1 to M7 as applied, run, failed by name, reverted, and observed at 8efcde98, with no `verify-mutation` run.
   - Amendment 3 makes no mutation claim.
   - The reviewer re-observes them at the head.
13. **A DuckDB behaviour stated without its version: holds,** on the reading given in N1.
14. **Discharge claims: each one resolves.**
   - Amendment 1 says the comments are corrected: they are at :1493-1501 and :1975-1979.
   - Amendment 3 says every other C48 to C51 outcome came out as tabled. The B-T3 entries at test :394-459 assert the tabled construct, operand types and reason for C48a to d, C49, C50 and C51a to d.
   - Amendment 3's P-3 claim matches worker report 3's tallies: base 4553/5152, head 4564/5164, +11/+12, and B-T1b at 897 both times.
   - Amendment 3 says no invalidator fired. P-0 equals H-3, no C48, C49 or C51 shape is admitted, and C1 to C47 are unchanged.
15. **A performance claim: none.**
16. **§2.7: present and matching.** `engine/README.md:499` reads last verified at 8efcde9. Line 518 has the form's path between TESTS-CONFIGURED-CONNECTIONS and WATCHER-FIRST-READ.
17. **The ADR-021 Note: holds.** It landed at 1445eaf3 (round 46, item 3), and the gate-1 reviewer recomputed its hash. The PR does not touch the ADR.
18. **Budget and scope additions: holds.**
   - Worker report 3 counts 270 lines of 300 over 2 files, so there is no class 8, and §7 is unedited.
   - Amendment 2 is class 9 on round 49, item 1, and was declared before its code.
19. **A test-text span pinned at a branch commit: none.** Amendment 3 names 8efcde98 in words, by its full id, with no hash.
20. **§2.1's type and P-0's ordering: holds.** P-0 printed BIGINT for all four expressions at v1.5.5, at 013a3eb4 and before code. The code types the result BIGINT (:2047, :1956).
21. **The NULL type produced by anything but a NULL literal: holds.** `EngineType::Null` is constructed only at :1736, in `literal_typed`'s NULL arm.
   - Columns map only through `engine_type_of_surrogate`, which has no NULL arm.
   - Boolean nodes are typed BOOLEAN, and `/` gives REAL or DOUBLE.
   - Binary arithmetic gives NULL with NULL → BIGINT, and NULL with a numeric operand → the numeric type. Every other rule gives a numeric type.
   - Unary NULL → BIGINT, and unary numeric → the operand's own type.

## §2.1 as replaced, against the Note 2026-09-30, item 2 and the Note 2026-10-03, item 2

- NULL op NULL is a BIGINT expression, judged by its type. That is the 2026-10-03 item 2 principle: a NULL-valued result is not a NULL literal.
- **Against text and BOOLEAN:** precedence items 1 and 2 give `text_with_non_text` and `boolean_conversion` (C48, C49). This ends the column cast that gate 1's S1-1 observed.
- **Against an integer:** rule 3 admits it, as item 2's lossless-widening bullet allows (C39, C50).
- **Against a decimal literal within the bounds:** rule 4 admits it, under item 2's third bullet (64 bits).
- **Inside `+`, `-`, `*`:** beside a decimal literal it refuses `conversion_can_fail` (:2268), as item 2's closing paragraph says.
- **Against REAL, DOUBLE or a double literal:** it refuses by bit width with the residual reason. Amendments 1 and 2 declare this, round 49, item 2 rules it, and it is routed to F7's node.
- The code is no wider and no narrower than these.

## The NULL-literal reading at each of §2.9's readers

Each reader tests `ty == Null`, and by item 21 that type is now only a NULL literal:
- comparison rule 2: :2131;
- arithmetic rule 2: :2043, :2049, :2052;
- the BOOLEAN-or-NULL junction test: :2410;
- the pattern test: :2394;
- the reason precedence: :2235-2244;
- §2.3's set condition: :1985-1987.

So each one tests exactly what the Note 2026-09-30, item 2 and the Note 2026-10-03, item 1 call a NULL literal. None of these readers changed in code, and the comments at :2130, :1976-1977 and :2398 already say NULL literal.

## §2.4 as ruled yes (round 45, item 1)

- **The unary carry:** the struct update at :1958-1962 still carries the field over a numeric operand. `-(NULL - 0.5)` stays marked (C47a).
- **The marked-partner disjunct:** :1983 (C47b).
- **Item 7:** it is read with that partner read as the fourth named place, as Amendment 1 says.

## Amendment 3

- **The class is right.** Class 2 is a run outcome that differs from a registered §3 prediction (`docs/PREREGISTRATION-TEMPLATE.md` class 2). Amendment 1's H-4 declared ahead of time that a `rejected_by_binder` outcome is a class-2 result.
- **The prediction is unedited.** Amendment 1's C48 row still tables the fifth predicate as a TypeNotAdmitted of `BETWEEN`, with `text_with_non_text`. P-1 is untouched.
- **The observed outcome is pinned as the test shows it.** Test :422-426 predicts `Predicted::Code("skp.filter_rejected_by_binder")` for that predicate, and Amendment 3 records that same code.
- **Its reason resolves.** `bind_admit` runs before `type_walk` (`engine/src/predicate.rs:187-193`, unchanged from main), so the binder's refusal is independent of the walk. That also supports Amendment 3's statement that the merge base refused the shape too.
- **The superseded index is present** (none).

## The Note 2026-10-03 against the code, after remedy B and §2.9

- **Item 1.** The set condition requires a NULL literal (item 21) beside a decimal literal within the bounds, or beside an already-marked result.
  - The negation carries the mark (:1958-1962).
  - NULL with such a result is marked (:1983).
  - Before remedy B, the code was wider: it also marked `(NULL + NULL) - 0.5` and `(-NULL) - 0.5`. That was gate-1 N1, now withdrawn. Today those shapes are refused `conversion_can_fail` (Amendments 1 and 2, §5).
  - So the code is no wider than item 1.
  - Every comparison junction goes through `is_admitted_comparison` (C44 pins BETWEEN), so it is no narrower either.
- **Item 2.** A marked result keeps its DECIMAL type, so rule 2 does not admit it.
  - Text gives `text_with_non_text` (C45b).
  - A wide integer gives `conversion_can_fail` through read 3 (C45a).
  - Arithmetic does not read the field: `is_decimal_arithmetic_pair` is type-based.
- **Item 3.** No code, field or reason value changes.
- No further Note is owed (round 49, item 2).

## docs/01 principle 8; ADR-010 rule 6

- **Principle 8: holds, and the piece strengthens it.**
  - C48 and C51 remove the silent VARCHAR→BIGINT and BOOLEAN→BIGINT column casts.
  - They also remove a stream error that named a file value (gate-1 S1-1 and N-1).
  - Each refusal sentence in the new rows is true of its shape.
  - The degenerate REAL/DOUBLE shapes keep F7's residual sentence. Round 49, item 2 ruled that, and it is routed.
- **ADR-010 rule 6: holds.** The declared literal ceilings are unchanged, and the carried flag makes them bind through rule-2 results.

## The seams

- **Kernel to engine:**
  - `filter_error_of` matches `FilterError::TypeNotAdmitted` by its three fields, and takes `reason` from `wire_value` (`kernel/src/skp.rs:2253`, `:2279`). The diff does not touch either side, and no variant or field changes.
  - B-T7 is at `kernel/tests/skp_admission.rs:607` and drives the real admission.
  - It is green at the head, by the custodian's CI account at dispatch.
- **Shell to kernel:**
  - `refusalGuidance` switches on the code alone (`frontends/shell/src/admission/formatRefusal.ts:70`), and the code is unchanged.
  - B-T9 is unmoved, and green at dispatch.
- **No seam is written to an imagined interface.**
  - B-T3 and B-T1 enter through the product's `AdmittedPredicate::admit`.
  - The BIGINT type is P-0's observation of the binder, not an assumption.

## The caller rule

Holds. There is no new `pub` item, callback or option. Only the product admission path reaches the changed arms.

## Gate-1 findings, disposed

- **Reviewer S1-1:** Amendment 1 (class 1, remedy B), code :2043-2048, rows C48 to C50, M6.
- **Reviewer S2-1:** the comments at :1493-1501 and :1975-1979.
- **Reviewer N-1:** Amendment 2 (class 9, round 49, item 1), code :1952-1957, row C51, M7.
- **Reviewer N-2 to N-5:** informational. They are still true at the head, and the disjunct is unchanged.
- **Architect N1:** withdrawn by Amendment 1. That is class 1 under round 15 (g). Item 21 now makes its premise true by construction.
- **Architect N2:** Amendment 1's item 7 reading.
- **Architect N3:** the comment fix.
- **Architect N4:** stands as written. Nothing is owed (see N3 below).
- **The gate-1 architect closing list:** items 1 to 3 were discharged in gate 1 by the reviewer. Items 4 and 5 carry forward, below.

## Findings

- **N1. One new test comment states a binder refusal without naming DuckDB's version** (`engine/tests/filter_type_admission.rs:418-421` @ 3074e9a0, a branch commit, named in words). It also points at an unnamed "this commit".
  - I do not count it under §8 item 13. Its subject is H-4's class-2 result, and Amendment 1 states H-4 at v1.5.5.
  - Amendment 3 records the outcome at v1.5.5 at 8efcde98.
  - The neighbouring comment at :393 names v1.5.5.
  - No action. It may ride any later touch of the file.
- **N2. The walk's BIGINT typing of NULL op NULL and of `-NULL` rests on P-0** (worker report 3, evidence), and no committed instrument re-checks it.
  - B-T1b skips constant-folded nodes (F5). C32b's `(-NULL) > 0` at :3101-3102 stays skipped, since its checked count stays at 897.
  - B-T3 asserts the walk's own type. B-T1 (i) catches only an undeclared cast.
  - §1 already claims nothing at another version.
  - No action in this piece. It is worth knowing at the next DuckDB bump.
- **N3. Gate-1 architect N4 (no mutation declared for the O-2 disjunct) stands as written.** The gate-1 reviewer's extra probe N-2 showed that C47b pins the disjunct. Nothing is owed.
- **N4. The F7 node's text predates round 49, item 2.** The node is `type-walk-rule2-residual-reasons` (`PLAN.yaml:3904-3920`, read at c7d0b200). Its title and summary do not yet name the degenerate NULL op NULL and `-NULL` shapes that round 49, item 2 joins to it. The RULED block is the reference, and the node can cite it when the human places it. This is not this PR's scope.

## Closing-record list

1. **Merge commit.** Merge as a merge commit, never a squash (header Branch line; §2.7), so that 8efcde98 (last-verified 8efcde9) and the other branch commits stay reachable.
2. **The reviewer's re-runs:** M1 to M7, each observed by name at a commit and reverted; P-3's two runs; P-0's record read from worker report 3.
3. **The reviewer's ancestry checks:**
   - 8786ff6a is an ancestor of 8efcde98, so Amendments 1 and 2 came before the code (§8 items 1, 18 and 20);
   - the branch form's lines 1-390 are byte-identical to main's, and Amendment 3 is a pure append.
4. **The empty stat.** Show `git diff --stat origin/main...HEAD -- kernel/ protocol/ frontends/ renderer/` empty, three-dot.
5. **The budget recount** by §7's own command (the worker reports 270 of 300 over 2 files).
6. **Any closing amendment is references and hashes only** (the record cap).

Files read:
- `C:\dev\wt\n170-head-3074e9a0\engine\TYPE-WALK-NULL-LITERAL-ARITHMETIC-PREREGISTRATION.md`
- `C:\dev\wt\n170-head-3074e9a0\engine\src\predicate.rs`
- `C:\dev\wt\n170-head-3074e9a0\engine\tests\filter_type_admission.rs`
- `C:\dev\wt\n170-head-3074e9a0\engine\README.md`
- `C:\dev\wt\n170-head-3074e9a0\engine\Cargo.toml`
- main's copies of the same files, under `C:\dev\spatial-ide\engine\`
- `C:\dev\spatial-ide\state\consults\2026-10-04-type-walk-null-literal-arithmetic-worker-report-3.md`
- `C:\dev\spatial-ide\state\consults\2026-10-04-type-walk-null-literal-arithmetic-architect-remedy.md`
- `C:\dev\spatial-ide\state\consults\gates\2026-10-04-type-walk-null-literal-arithmetic-gate1-reviewer.md`
- `C:\dev\spatial-ide\state\consults\gates\2026-10-04-type-walk-null-literal-arithmetic-gate1-architect.md`
- `C:\dev\spatial-ide\DECISIONS-PENDING.md` (RULED rounds 43, 45, 46 and 49)
- `C:\dev\spatial-ide\docs\adr\ADR-021-row-filter-on-viewport-query.md` (lines 244-275)
- `C:\dev\spatial-ide\docs\PREREGISTRATION-TEMPLATE.md`
- `C:\dev\spatial-ide\docs\01_Principles.md`
- `C:\dev\spatial-ide\kernel\src\skp.rs`, `C:\dev\spatial-ide\kernel\tests\skp_admission.rs` and `C:\dev\spatial-ide\frontends\shell\src\admission\formatRefusal.ts` (by Grep)
- `C:\dev\spatial-ide\PLAN.yaml` (lines 3904-3920)

Write audit: I used only Read, Grep and this hand-back, and made no write-capable call.
