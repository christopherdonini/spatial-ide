*Custodian's filing note (2026-09-30): the architect's scoped confirmation of the comment-only reduction fb2e75c on PR #145, for PLAN node `filter-bind-admission-implicit-coercions` at generation 4, with its ruling on the reviewer's attempt-3 N1. Reviewed: cut/filter-bind-coercions @ 9ee215c53e3f0194772d462b29b6939f38f11a46 (from the report's own first line). Filed under `state/consults/gates/` by `AUTONOMY.md` §25(b). It is transcribed from the hand-back message with the harness's two-space indent removed, and the text below the rule is the agent's. Its branch-only `path:line` cites are read at 9ee215c. Its proposed follow-up node is appended to PLAN.yaml as `type-walk-null-literal-arithmetic`, status proposed. Profile paths redacted at filing: none.*

---

Reviewed: cut/filter-bind-coercions @ 9ee215c

**Overall: PASS.** B1 is closed, Amendment 6 is valid, and none of N1's four cases blocks the merge.

1. **B1: closed.**
   - Rule 2's comment in `admitted_arithmetic_result` (`engine/src/predicate.rs:1878-1881`) now states the walk's own typing and disclaims any claim about the plan. The contradiction with the folded-node comment is gone.
   - The `BT1B_COLS` doc (`engine/src/predicate.rs:2756`) and the folded-node comment (`engine/src/predicate.rs:3040`) both carry "at v1.5.5".
   - The N4 line (`engine/tests/filter_type_admission.rs:806-807`) now names three widenings: same signedness, unsigned to a wider signed type, and any integer to HUGEINT. It matches `is_declared_cast`'s body in the branches `fs == ts && tb >= fb`, `!fs && ts && tb > fb` and `to == "HUGEINT"`.
2. **Amendment 6: valid.** Its first line carries "budget overrun, §7 not edited" and says it supersedes Amendment 5. It gives the final figure by §7's command at fb2e75c: 3,215 plus 244, 3,459 lines over 25 files. That is consistent with fb2e75c's +8/−7. The reason is carried by reference, and §7 is unedited. The code at 9ee215c equals fb2e75c outside `*.md`, so the figure holds.
3. **The reviewer's N1: none of (a)-(d) blocks the merge.**
   - All four are constant-NULL expressions. No file value is cast or exposed, and none puts file data in a terminal error.
   - **(a) `NULL + NULL > 0`, refused `conversion_rounds`.** This is a defect in the code, not a falsification of the design: rule 2 applied pairwise admits it, and the design already has the rule that would admit it. The §5 invalidator guards the design's reason set, which remains sufficient, so it is not engaged. The false Display sentence is low severity and should be corrected in the follow-up below.
   - **(b) `NULL - 0.5 > 0` and (c) `i64 < NULL + <scale-27 decimal>`.** The comparison refuses a decimal-typed expression. The form's rule 4 names only a decimal literal, so refusing is within the form. Only the reason is imprecise.
   - **(d) `i64 = (NULL + <39-digit literal>)`, admitted.** This is not §8 item 7: the bounds are the §7 constants, and the walk counts a literal's digits from its value. Rule 2 admits the pair, and §2.2 bounds literals, not arithmetic results. The plan casts only a constant, and the stream ends without error. It is consistent with the form's letter.
   - **Proposed follow-up node.**
     - Title: "Type walk: NULL-literal arithmetic — admit NULL with NULL, carry a literal's bound flag through a NULL-typed result, and give constant-NULL expressions true refusal reasons (B-1 N1)".
     - Scope: `admitted_arithmetic_result`'s rule 2 and how `Typed` passes on a literal's bound flag to a result in `engine/src/predicate.rs`, plus B-T3 rows for (a)-(d). No wire change and no new reason.
     - Phase: `prototype`, lane `engine`, the same as `filter-bind-admission-implicit-coercions`, which it depends on.
