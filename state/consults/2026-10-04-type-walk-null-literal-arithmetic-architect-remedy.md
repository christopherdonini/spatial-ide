*Custodian's filing note (2026-10-04): the architect's drafting consult on PR #170's gate-1 S1-1 (§2.1 falsified) and its N-1 (the pre-existing unary `-NULL` defect on main), under the tag node:type-walk-null-literal-arithmetic@g2. A consult, not a gate. It arrived as a message and is extracted here mechanically from the session transcript's copy of the hand-back, with the harness's two-space indent removed. Its sha256, from this file's line 5 to the end, is 7820fedd68bcb8339edba2372dbb57aa77bc8b97389abcd7d543509c2d63b936. Write audit PASS: zero write calls. C3 clean: before 09:54:58Z, after; main moved only by the custodian's own commits, and the worktree is at c6809d0c with an empty porcelain at both. **It recommends remedy B:** type every NULL-valued arithmetic result as the binder types it, with probe P-0 first. It withdraws its own gate-1 N1, and drafts Amendments 1 (class 1) and 2 (class 9, N-1). **Its Q1 and Q2 go to the human.** Profile paths redacted at filing: none.*

---

Reviewed: cut/type-walk-null-literal-arithmetic @ c6809d0c

**Verdict: none, since this is a drafting consult and not a gate.** I recommend remedy B: the walk types every NULL-valued arithmetic node the way the binder types it, and the NULL type is left to the NULL literal alone. N-1 should ride in node 10 as a class-9 amendment, on the human's word. No ADR Note is needed.

Most branch line numbers below were read at c6809d0c. Main files were read at 2bab186a. Everything outside the block is my paraphrase. I quote nothing.

## (1) Remedy within node 10

**The cause.** The walk's NULL type for a NULL-valued arithmetic result (§2.1's arm in `admitted_arithmetic_result`, and the unary arm's `operand.ty == EngineType::Null` branch in `type_of_arithmetic`) is not the binder's type. Comparison rule 2 in `is_admitted_comparison` tests the type, so such a result passes against any partner. At a VARCHAR or BOOLEAN partner the plan casts the file column to BIGINT. The NULL test has five readers: comparison rule 2, arithmetic rule 2, `require_boolean_or_null`, `check_pattern`, and the precedence in `determine_reason`. Each one inherits the defect. `flag AND -NULL` reaches `require_boolean_or_null` the same way. That is unobserved, and C49/C51 pin it.

**Option B (recommended): type the NULL-valued arithmetic result as the binder does.** Predicted BIGINT, kind expression, within bounds. Two arms change, the §2.1 arm and (under N-1) the unary arm over NULL. No reader changes.
- After it, `EngineType::Null` is produced only by `literal_typed`. Every reader then tests exactly what ADR-021's Note 2026-09-30 item 2 names, a NULL literal, at every junction: comparison, BETWEEN, IN, AND/OR/NOT and LIKE.
- It applies the human's own principle from the Note 2026-10-03 item 2: a NULL-valued result does not count as a NULL literal and is judged by its type. Admitting `-NULL` as NULL was the walk modelling an imagined binder interface. The seam rule's logic points the same way, though DuckDB is a dependency, not a module.
- It also makes my gate-1 N1 premise (NULL-typed means NULL literal) true by construction. N1 as written was wrong and is withdrawn.

**Option A, rule 2 admits a NULL literal only: rejected.** Kind-literal-only refuses C39 and C32 (`-NULL > 0`). That edits an existing prediction (§8 item 4) and defeats case (a).

**Option C, a NULL-typed expression admitted against numeric partners only: not recommended.**
- It needs guards at four or five readers.
- It admits pairs that no Note bullet names when read by the binder's type, for example `f32 > -NULL`, which is BIGINT against REAL.
- It is a reading of "NULL literal" that is the human's to make, and it runs against the Note 2026-10-03 item 2.

**What B does to C39 and C32.**
- Both predictions are unchanged. Each is now admitted by rule 3 (integer against integer) instead of rule 2.
- The existing C32 pin and M1 to M5 stand. M1 still fails on C39.

**A cost to declare.** Degenerate constant-NULL shapes against REAL, DOUBLE or a double literal are refused by bit width with the residual reason, for example `f32 > NULL * NULL` and, under N-1, `f32 > -NULL`. That is F7's class. Under N-1 some of them are admitted on main today. They are declared, they are not rows (their sentence is F7's question), they are pinned as refused in B-T1, and they are routed with F7.

**Probe P-0, before any code.** On B-T1's oracle connection, the worker prints `typeof(NULL + NULL)`, `typeof(NULL - NULL)`, `typeof(NULL * NULL)` and `typeof(-NULL)`.
- Prediction: BIGINT for all four. This is consistent with S1-1's VARCHAR→BIGINT and BOOLEAN→BIGINT casts, but not proven by them.
- If the probe shows another numeric type, STOP and take a further amendment before code.
- If it shows NULL or a non-numeric type, STOP; B is void and the route returns to me.

**Rows and pins.**

| Row | Predicates | Prediction | Why |
|---|---|---|---|
| C48 | 5 S1-1 shapes, plus BETWEEN and `*` | refused, VARCHAR/BOOLEAN → text_with_non_text / boolean_conversion | true of the observed column casts |
| C49 | `flag AND NULL + NULL` | refused, boolean_conversion | the boolean junction |
| C50 | integer-path controls | admitted | the integer path still admits |
| C51 | N-1's 3 shapes plus `flag AND -NULL` | refused | N-1 |

Each refused shape is also pinned in B-T1 part 3. If it were ever re-admitted, the C48 and C51 shapes would show the column cast that check (i) catches, and every refused pin moves P-3's tally.

## (2) N-1's route

**Recommendation: node 10 carries it, as class 9 on the human's word.**
- The same remedy closes both: one line in the unary arm, and the same rows, mutation pattern and invariant.
- A separate node would need a full form, because it changes the admitted class (round 25, item 2 (e)), and two gates for about 10 code lines.
- Meanwhile main keeps an admitted-class violation, and a stream error that names a file value (`zone IS DISTINCT FROM -NULL`), against docs/01 principle 8.
- The budget holds: about 250–275 lines of 300, over the same 2 files.
- Caveat: class 9's text names a standing rule, a permanent ruling or a directive. Here the work is added by a gate finding plus the human's ruling. The human's answer should say that the ruling is the class-9 authority (Q1).

## (3) The amendment (to append to §10, in order)

```
### Amendment 1 — 2026-10-04, written after gate 1's results on PR #170 (head c6809d0c): §2.1 falsified and replaced; touches §1, §2.1, §2.6, §3, §4, §5, §8 and §9

*Class 1, post-result. Written after gate 1's results were seen. The reviewer's S1-1 (`state/consults/gates/2026-10-04-type-walk-null-literal-arithmetic-gate1-reviewer.md:14-36 @ 2bab186a sha256:HASH-TBD`) met §5's Falsification clause for §2.1's own shape at a VARCHAR or BOOLEAN junction; the architect's gate-1 N1 (`state/consults/gates/2026-10-04-type-walk-null-literal-arithmetic-gate1-architect.md:95-101 @ 2bab186a sha256:HASH-TBD`) is withdrawn by it. It invalidates §2.1's typing of the result as NULL and §2.1's claim that the result takes C32's path. No row C1 to C47, mutation M1 to M5, reason, wire value, sentence or Display changes. Where a section is restated, the text is this form's new wording; nothing here is a quotation.*

- **The result.** At DuckDB v1.5.5 (§0's crate pin), §2.1's NULL-typed result passed comparison rule 2 against VARCHAR and BOOLEAN partners; the plan cast the file column to BIGINT, outside the predecessor's §7 set, and one such shape ended its stream in a conversion error naming a file value (the reviewer's evidence, pinned above). The observed casts show that the binder does not treat a NULL-valued `+`, `-` or `*` as the NULL literal that ADR-021's admitted class names (`docs/adr/ADR-021-row-filter-on-viewport-query.md:255 @ 2bab186a sha256:HASH-TBD`).
- **§2.1, replaced.**
  - A NULL-typed operand beside a NULL-typed operand in `+`, `-`, `*` is admitted. The walk types the result as the binder types it, as P-0 observes (H-3 predicts BIGINT), kind expression, within bounds.
  - The result is then judged by that type under the predecessor's rules, unchanged. It is not a NULL literal, as the Note 2026-10-03, item 2 already holds for the decimal case (`docs/adr/ADR-021-row-filter-on-viewport-query.md:274 @ 2bab186a sha256:HASH-TBD`). Against VARCHAR it refuses `text_with_non_text`, against BOOLEAN `boolean_conversion` (precedence items 1 and 2); against an integer it is admitted by comparison rule 3 (`docs/adr/ADR-021-row-filter-on-viewport-query.md:256 @ 2bab186a sha256:HASH-TBD`); against a decimal literal within bounds, by rule 4.
  - Inside `+`, `-`, `*` it is an integer expression: beside an integer, admitted by rule 3; beside a decimal literal, refused `conversion_can_fail` (`docs/adr/ADR-021-row-filter-on-viewport-query.md:263 @ 2bab186a sha256:HASH-TBD`), as an integer literal beside a decimal literal already is.
  - §2.1's third bullet stands.
  - §2.3's set condition is unchanged in code. A NULL-typed operand there is a NULL literal or a unary `-` over one; the latter is outside this amendment.
- **H-3 and P-0, before any code of this amendment.** H-3: at v1.5.5 the binder types `NULL + NULL`, `NULL - NULL`, `NULL * NULL` and `-NULL` as BIGINT; consistent with S1-1's observed column casts to BIGINT, not proven by them. P-0: the worker runs a throwaway test, never committed, on B-T1's oracle connection, printing `typeof` of the four expressions, and records the printout with the commit it ran at and the DuckDB version, as evidence. Predicted: BIGINT for all four. A different numeric type: STOP, no code, return to the custodian; the type names here are corrected by a further amendment, never edited. A NULL or non-numeric type: STOP; this remedy is void and the route returns to the architect.
- **§3, new B-T3 rows,** appended after C47 in this order:

| # | Predicate | Predicted |
|---|---|---|
| C48 | `zone = NULL + NULL`; `flag = NULL + NULL`; `zone = NULL - NULL`; `zone IS DISTINCT FROM NULL + NULL`; `zone BETWEEN NULL * NULL AND NULL` | TNA `=`, `VARCHAR; BIGINT expression`, `text_with_non_text`; TNA `=`, `BOOLEAN; BIGINT expression`, `boolean_conversion`; TNA `=`, `VARCHAR; BIGINT expression`, `text_with_non_text`; TNA `IS DISTINCT FROM`, `VARCHAR; BIGINT expression`, `text_with_non_text`; TNA `BETWEEN`, `VARCHAR; BIGINT expression`, `text_with_non_text` |
| C49 | `flag AND NULL + NULL` | TNA `AND`, `BIGINT expression`, `boolean_conversion` |
| C50 | `i64 BETWEEN NULL + NULL AND 1`; `u8 = NULL * NULL` | admitted (rule 3) |

  - C48's first four are S1-1's observed shapes; its fifth reaches `BETWEEN` and `*`. C49 is the boolean junction. C50 is the integer path. Each refusal's sentence is true of its shape: the binder converts the text or BOOLEAN operand to the integer type.
  - H-4: the surrogate prepare binds C48's fifth predicate and C49 at v1.5.5. A `rejected_by_binder` outcome is a class-2 result.
  - The type names in C48 and C49 are P-0's; H-3's BIGINT is the prediction.
  - C39 keeps its prediction; it is now admitted by rule 3.
- **B-T1 pins.** Appended to part 3: C48 (five), C49, C50 (two), and `f32 > NULL * NULL` (refused; no B-T3 row, §5 below). Part 3 goes from 332 to 341 cases, the total from 9,714 to 9,723.
- **§4.** B-T3 gains C48 to C50. New mutation M6: §2.1's arm types its result NULL (the arm as at c6809d0c). Fails on C48's first predicate: expected `TypeNotAdmitted`, got `Ok`. M1 to M5 stand; M1 still fails on C39. B-T1 claims no new mutation. B-T1b is unchanged at 2,083 (F5).
- **§5.**
  - P-1 covers C48 to C50 as tabled.
  - P-3 is restated: at the head, B-T1's refused tally equals the merge base's plus this amendment's seven refused pins; its admitted tally equals the base's plus eleven (§3's nine and C50's two); B-T1b's checked count is equal at both.
  - Declared changes outside §3, not rows: a NULL-op-NULL result against a REAL or DOUBLE column or a double literal refuses at the comparison with the residual reason (rules 5 and 7 by bit width), as F7's example does; beside a decimal literal in `+`, `-`, `*` it refuses `conversion_can_fail` at that operator. Both shapes were refused at the merge base, by the inner operator; only the construct, the operand types and the reason move. They join F7's routing.
  - New invalidators: P-0 differs from H-3 (stop as above); a C48 or C49 shape admitted.
- **§8.** New item 20: §2.1's result typed other than as P-0 observed, or code of this amendment before P-0's record. Item 7's second bullet is read with the O-2 disjunct's read of the partner as a fourth named place (question round 45, item 1); the field's doc comment and the comment at the set condition are corrected in the code to say so (the reviewer's S2-1).
- **§9.** Reviewer: P-0's record; M6 observed by name at a commit, then reverted; P-3's two runs. Architect: §2.1 as replaced against the Note 2026-09-30, item 2 and the Note 2026-10-03, item 2.
- **§2.6, what a client sees.** The C48 and C49 shapes are refused `filter_type_not_admitted` with the tabled reasons; at the merge base they were refused with `conversion_rounds` at the inner operator, and at c6809d0c they were admitted.
- **§7.** Unchanged. Estimated with this amendment: 220 to 240 of 300, over the same 2 files. An overrun is class 8, and §7 is not edited.

### Amendment 2 — 2026-10-04, scope addition (question round <N>, item <k>): unary `-` over a NULL literal typed as the binder types it (the reviewer's N-1)

*Class 9, scope addition, on the human's ruling of question round <N>, item <k>, cited and not reproduced. Written after gate 1's results; declared before any of its code. The defect is the reviewer's N-1 (`state/consults/gates/2026-10-04-type-walk-null-literal-arithmetic-gate1-reviewer.md:48 @ 2bab186a sha256:HASH-TBD`), pre-existing on main in the predecessor's §2.5(b) as amended (`engine/FILTER-BIND-COERCIONS-PREREGISTRATION.md:384 @ 2bab186a sha256:HASH-TBD`) and its C32 (`engine/FILTER-BIND-COERCIONS-PREREGISTRATION.md:389 @ 2bab186a sha256:HASH-TBD`).*

- **§2.9 (new).** Unary `-` over a NULL literal is admitted, typed as P-0 observes for `-NULL` (H-3: BIGINT), kind expression, within bounds. Over a numeric operand the unary arm is unchanged and carries every attribute but kind, §2.3's field included (C47). With Amendment 1, no path of the walk produces the NULL type except a NULL literal. So comparison rule 2, arithmetic rule 2, the BOOLEAN-or-NULL junction test, the pattern test, the reason precedence and §2.3's set condition each test a NULL literal, as the Note 2026-09-30, item 2 (`docs/adr/ADR-021-row-filter-on-viewport-query.md:255 @ 2bab186a sha256:HASH-TBD`) and the Note 2026-10-03, item 1 (`docs/adr/ADR-021-row-filter-on-viewport-query.md:273 @ 2bab186a sha256:HASH-TBD`) name it. None of them changes in code.
- **§3, new B-T3 row,** appended after C50:

| # | Predicate | Predicted |
|---|---|---|
| C51 | `zone = -NULL`; `flag = -NULL`; `zone IS DISTINCT FROM -NULL`; `flag AND -NULL` | TNA `=`, `VARCHAR; BIGINT expression`, `text_with_non_text`; TNA `=`, `BOOLEAN; BIGINT expression`, `boolean_conversion`; TNA `IS DISTINCT FROM`, `VARCHAR; BIGINT expression`, `text_with_non_text`; TNA `AND`, `BIGINT expression`, `boolean_conversion` |

  - The first three are N-1's observed shapes; the fourth is the boolean junction, under H-4. C32 keeps its prediction (admitted), now by rule 3; its B-T1 pin stands.
- **B-T1 pins.** Appended to part 3: C51 (four) and `f32 > -NULL` (refused; no B-T3 row). Part 3 goes from 341 to 346 cases, the total from 9,723 to 9,728.
- **§4.** New mutation M7: the unary arm keeps the NULL type over a NULL literal (its behaviour on main at 2bab186a). Fails on C51's first predicate: expected `TypeNotAdmitted`, got `Ok`.
- **§5.**
  - P-3's refused pins become twelve; its admitted pins stay eleven.
  - Declared changes outside §3, admitted at the merge base and refused after, not rows, routed with F7: `-NULL` against a REAL or DOUBLE column or a double literal (residual reason); `-NULL` beside a REAL or DOUBLE column or a double literal in `+`, `-`, `*` (residual reason); `-NULL` beside a decimal literal in `+`, `-`, `*` (`conversion_can_fail`), which also ends c6809d0c's admission of `(-NULL) - 0.5 > 0`. §1's claim that no other admission outcome changes is narrowed to exclude these and C51.
  - New invalidators: a C51 shape admitted; an existing B-T3 row moves.
- **§8.** New item 21: the NULL type produced by anything but a NULL literal.
- **§9.** Reviewer: M7 observed by name at a commit, then reverted. Architect: the NULL-literal reading at each of §2.9's readers.
- **§2.6, crossing under C2.** C51's shapes move from admitted (an empty stream, or for `zone IS DISTINCT FROM -NULL` a stream error naming a file value) to `filter_type_not_admitted` with the tabled reasons; the degenerate shapes in §5 above move from admitted to refused. No code under `kernel/`, `protocol/`, `frontends/` or `renderer/`.
- **§7.** Unchanged. Estimated with Amendment 1: 250 to 275 of 300, over the same 2 files. An overrun is class 8, and §7 is not edited.
```

**If the human picks the other route (N-1 gets its own node):**
- Amendment 2 is not appended.
- Amendment 1 is written to stand alone, and its figures stand: 341 / 9,723; P-3 at seven refused pins and eleven admitted.
- `-NULL`, including `(-NULL) - 0.5` being marked at §2.3's set condition, stays on main's behaviour until the new node.
- The new node takes Amendment 2's content as its §2 to §5 on a full form (round 25, item 2 (e)), with a ledger finding for N-1.
- The placeholders `question round <N>, item <k>` are the custodian's to fill. The reviewer computes every `HASH-TBD`.

## (4) Notes

- **No further ADR-021 Note is needed.** Remedy B brings the engine into line with the Note 2026-09-30 item 2 as written ("NULL literal" read literally, everything else judged by type), and it is consistent with the Note 2026-10-03 item 2.
- **A Note would be needed only under Q2(b),** a reading that a NULL-valued result counts as a NULL literal against numeric operands. That text would be the human's.

## Questions for the human

**Q1. N-1's route.**
- (a) Node 10 carries it as Amendment 2, class 9, with your ruling named as the class-9 authority. **Recommended.** It is one remedy and one set of rows, and it ends a file value in a stream error on main.
- (b) Its own node, full form, after node 10 merges. Main keeps the defect until then.

**Q2. The degenerate constant-NULL shapes against REAL, DOUBLE or a double literal** (`f32 > NULL * NULL`; under Q1(a) also `f32 > -NULL` and `1e3 > -NULL`, which main admits today).
- (a) Refuse them by the binder's type, with the residual reason, joined to F7's routing. **Recommended.** This follows your Note 2026-10-03 item 2 principle, and these predicates always return no rows.
- (b) Admit them under a reading that a NULL-valued arithmetic result counts as a NULL literal against numeric operands. That reading is yours, would need a Note, and adds guards at four or five readers.

Files:
- C:\dev\spatial-ide\engine\TYPE-WALK-NULL-LITERAL-ARITHMETIC-PREREGISTRATION.md
- C:\dev\spatial-ide\engine\FILTER-BIND-COERCIONS-PREREGISTRATION.md
- C:\dev\spatial-ide\docs\adr\ADR-021-row-filter-on-viewport-query.md
- C:\dev\spatial-ide\state\consults\gates\2026-10-04-type-walk-null-literal-arithmetic-gate1-reviewer.md
- C:\dev\spatial-ide\state\consults\gates\2026-10-04-type-walk-null-literal-arithmetic-gate1-architect.md
- C:\dev\wt\null-literal\engine\src\predicate.rs
- C:\dev\wt\null-literal\engine\tests\filter_type_admission.rs

Write audit: Read, Grep, Glob and the hand-back only; no write-capable call was made.
