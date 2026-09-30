# B-1 — the architect's consult after gate attempt 2: the reviewer's B1 and Amendment 4's text (2026-09-30)

*Custodian's filing note: the architect agent's hand-back, continuing the agent that gated PR #145 at ff3a841, for PLAN node `filter-bind-admission-implicit-coercions`. It is copied from the hand-back message with the harness's two-space indent removed. It was read-only, at cut/filter-bind-coercions @ ff3a841, and its `path:line` cites are read at that commit. Amendment 4 in the form is copied by script from this file's item 2, from its heading line through the B-T8 bullet.*

---

Consult: the reviewer's B1 and the text of Amendment 4. Read at cut/filter-bind-coercions @ ff3a841, read-only.

1. **Is B1 removable inside the sighted design? Yes, by the candidate. It does not go to Fable.**
   - **BETWEEN.** Apply §2.3's rules to every pair of the three operands, not only input against bound. This admits no new conversion and adds no rule, reason or bound. The pairs it refuses newly are conversions the Note's item 1 already names as refused, such as a BIGINT column cast to FLOAT. Each refusal takes an existing reason under Amendment 1's precedence.
   - Point 3 of the 2026-09-29 sightings accepted the mechanism: the walk plus the binder-agreement pin. The junction list in §2.3 is the form's own drafting, not a ruling. So correcting it changes neither Part 1 of `state/directives/B-1-RULINGS-AND-TYPED-TEXTS-2026-09-30.md` nor the Note.
   - I rejected the alternative, refusing every non-literal bound. It would refuse admitted-class triples such as `i16 BETWEEN i32 AND f64` with no true reason (principle 8).
   - **Why all pairs is sound.** Suppose the binder's three-way common type T is the maximum of the pairwise types, and each non-literal operand is admitted against the operand that fixes T. Then each non-literal cast into T is under rule 3, 4 or 7, and each literal cast is literal to numeric, which §7 declares. The one case where T is fixed jointly is two 64-bit integer columns of mixed sign beside a decimal literal. There the column values have at most 20 digits, so a cast to DECIMAL(≤38) cannot fail. It is still a hypothesis at v1.5.5, pinned by C37 below. If the binder picks DOUBLE there, that is §5's invalidator again. The walk would then have to compute a junction's common type, which is a new rule and goes to Fable.
   - **IN.** Leave it unchanged. `walk_expr`'s `COMPARE_IN` arm refuses any member that is not a `CONSTANT` (`engine/src/predicate.rs:938`). So the needle is the only operand carrying file data, and `check_in` checks it against every member. The binder's common-type cast over the needle and all members cannot cast a second file value.
   - The widest joint case with literal members is C21, which puts a HUGEINT literal beside 0.5. It rests on §2.3's closing paragraph: DECIMAL width at most 38 when every literal is within bounds. That paragraph covers literal members only. It does not cover non-literal operands, which IN cannot have and BETWEEN can, which is why BETWEEN needs all pairs. After B6, B-T1's mixed lists pin C21.

2. **Amendment 4, for §10:**

### Amendment 4 — 2026-09-30, after gate attempt 2's results, before the round-2 code: §2.3's BETWEEN junction, §2.5(b), new §3 rows C29–C38, and in §4 where B-T1's check (ii) lives, B-T1's enumeration and mutation, B-T3 and B-T8

*A record only, by reference. It was written after the results of gate attempt 2 were seen. The findings are in `state/consults/gates/2026-09-30-b-1-code-gate1-reviewer.md`, B1 to B7 and N1 and N4, and in `state/consults/gates/2026-09-30-b-1-code-gate1-architect.md`, B2 to B6 and item 8. The reviewer's B1 is §5's cast invalidator. The architect ruled that it is removable inside the sighted design, so no new sighting is needed. The Note, the bounds, the reasons and the precedence are unchanged. Where a section is restated below, the text is this form's new wording, not a quotation. Rows C29–C38 are post-result.*

- **§2.3, BETWEEN.** The junction list's BETWEEN item now reads: in a `BETWEEN`, every pair of its three operands, in the order input with lower, input with upper, lower with upper. `operand_types` names the first refused pair in that order. The `IN` item is unchanged, because `walk_expr` admits only literal members. The closing paragraph's list argument covers literal operands. A non-literal BETWEEN bound is covered by the all-pairs rule.
- **§2.5(b).** Unary `-` is admitted on any numeric operand or a NULL literal, and its type is the operand's type.
- **§3, new rows:**
  - C29: `u64 * i64 < 0.5` predicts TNA `<`, with operand types `HUGEINT expression; DECIMAL(2,1) literal` and reason `conversion_can_fail`. The walk's HUGEINT type for this product is the worker's v1.5.5 table, which I have not seen. The discriminator is B-T1b.
  - C30: `u64 * -9223372036854775808 < 0.5` predicts TNA, `conversion_can_fail`. Operand types are not asserted.
  - C31: `f32 * f32 > 0` and `f64 + f64 > 0` predict admitted. Hypothesis: the results are REAL and DOUBLE. The discriminator is B-T1b.
  - C32: `i32 + NULL > 0` and `-NULL > 0` predict admitted. Hypothesis: the plan casts only the NULL. The discriminator is B-T1 (i).
  - C33: `(f32 + 1e3) = i32` predicts admitted. The `+` result is DOUBLE by rule 6's widening, as the reviewer observed in B4.
  - C34: `(i32 > 0) = flag`, `(i32 > 0) IS NOT NULL` and `flag = (zone LIKE 'c%')` predict admitted.
  - C35: `i16 BETWEEN f32 AND i64` predicts TNA `BETWEEN`, with operand types `REAL; BIGINT` and reason `conversion_rounds`.
  - C36: `i32 BETWEEN i64 AND f64` predicts TNA `BETWEEN`, with operand types `BIGINT; DOUBLE` and reason `conversion_rounds`.
  - C37: `i64 BETWEEN u64 AND 0.5` and `i64 BETWEEN u64 AND 0.000000000000000001` predict admitted. Hypothesis: the plan's common type is DECIMAL(w,s) with w at most 38, reached by integer casts only. The discriminator is B-T1 (i). A falsification is §5's invalidator.
  - C38: `i16 BETWEEN i32 AND f64` predicts admitted. It is the control.
- **§4, B-T1 check (ii) moves** to a new unit test, B-T1b, `the_walk_types_every_arithmetic_node_as_the_binder_does`, in `engine/src/predicate.rs`'s `mod tests`.
  - Private access within the crate adds no `pub` item (§2.11).
  - It builds an in-memory table with FX-1's schema. Over it, it rebuilds the arithmetic cases of B-T1's enumeration, completed as below, plus C29–C33. It cannot import an integration test's generator, so it rebuilds the cases from the same operand lists, and its count is asserted as a literal.
  - For every arithmetic node the walk types `Ok`, it asserts that the walk's type equals the `return_type` of that node in `json_serialize_plan`, including `/`'s own node. Plan text is read at test time only, so §8 item 4 is untouched.
  - Mutation: rule 6 returns the float column's own type beside a double literal (the arm at ff3a841). It fails by name on the `f32 + 1e3` cases.
  - B-T1 keeps checks (i) and (iii). Its re-derived table is removed: `expected_arith_type`, `expected_arith_type_colcol`, `expected_division_type`, `fold_or_promote_test`, and `ArithNode`'s use for check (ii).
- **§4, B-T1's enumeration** is five parts, each counted separately:
  1. the probe set, 7,620;
  2. discriminators.txt's N-ARY lists;
  3. the boundary literals of the sightings' point 2 with their negatives, bare against every integer column and in mixed `IN`/`BETWEEN` lists with 0.5 and with scale 18;
  4. C23-shaped rows;
  5. `BETWEEN` over every ordered triple of FX-1's twelve columns, 1,728 cases.

  Second mutation: `check_between` checks only input against each bound. It fails by name on C35's plan cast.
- **§4, B-T3.** C25 also asserts `RejectedByBinder` with Display's prefix unchanged, and C27 asserts that `construct` names CAST.
- **§4, B-T8.** "A byte-identical round trip" now reads: a round trip equal as JSON values, as the precedent `every_new_projection_error_fixture_round_trips` does. Its claim is reduced to what the test proves (round 15 (b)).

   Under (d), no other record change is needed. The reviewer's B7 second site (`kernel/src/skp.rs:1989`) and my B8 are comment edits. My B1 and B2 are code edits within the §2 text as it stands. §8 item 15 reads through §4 as amended.

3. **Class 8: confirmed.** Class 8 in `docs/PREREGISTRATION-TEMPLATE.md`'s Round 25 additions records the final figure by §7's counting command at a named commit. The custodian writes it after round 2's final code commit and before gate attempt 3 is dispatched, so that gate reads it (round 25, item 2). The commit is named by id in words; it is not a hash reference, so round 15 (e) does not apply. If any code commit follows, append a superseding class-8 row; never edit §7 or the earlier row.
