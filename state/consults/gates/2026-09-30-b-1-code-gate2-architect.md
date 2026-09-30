*Custodian's filing note (2026-09-30): the architect's gate on PR #145 after correction round 2, for PLAN node `filter-bind-admission-implicit-coercions` at generation 4, the node's attempt 3. Reviewed: cut/filter-bind-coercions @ 53c6e3eca88e45a5a0f43f0be2fd28a9d9210920 (from the report's own first line). Filed under `state/consults/gates/` by `AUTONOMY.md` §25(b). It is transcribed from the hand-back message with the harness's two-space indent removed, and the text below the rule is the agent's. Its branch-only `path:line` cites are read at 53c6e3e. Its one blocking finding, B1, is in comment lines only, and the architect prescribes the edit. That is the shape of A2-1's two prescribed comment-only reductions, so it is applied as a reduction and not as a correction round. Profile paths redacted at filing: none.*

---

Reviewed: cut/filter-bind-coercions @ 53c6e3e

**Overall: FAIL, on one low-severity documentation finding (B1).** Every behavioural defect from attempt 2 is resolved, and so is the reviewer's BETWEEN finding. Amendment 4 is implemented row for row. Amendment 5 is a valid class-8 record.

**Correctness: PASS.** Severity none. Scope: the type walk in `engine/src/predicate.rs`. Disposition: none.
**Evidence: PASS with notes (N1, N2).** Severity low. Scope: B-T1b and B-T1. Disposition: none required.
**Documentation: FAIL (B1).** Severity low. Scope: three code comments. Disposition: an edit to comments only (see B1).

1. **Attempt-2 findings.**
   - B1 resolved: `check_boolean_operand`'s OPERATOR arm now ends in a refusal.
   - B2 resolved: rule 4 uses `int64_or_literal` in `is_admitted_comparison`, `determine_reason` gains a `ConversionCanFail` branch, and `is_declared_cast` now requires `fb <= 64` for DECIMAL and no longer accepts UHUGEINT unconditionally.
   - B3 resolved: rules 1 and 2 are in `admitted_arithmetic_result`.
   - B4 resolved: rule 6 returns DOUBLE beside a double literal.
   - B5 resolved: `type_of_value` has the BOOLEAN arms.
   - B6 resolved: B-T1's five parts are `generate_cases`, `nary_cases`, `boundary_literal_cases`, `c23_shaped_cases` and `between_triple_cases`.
   - B7 resolved: `FilterError`'s doc and `filter_error_of`'s doc both say "thirteenth".
   - B8 resolved: two of the five sites are versioned, and the other three (`is_declared_overflow`'s doc and the two test-file sites) were deleted with the oracle.
   - The reviewer's B1 (BETWEEN) is resolved: `check_between` checks input with lower, input with upper, then lower with upper.
2. **Amendment 4 as implemented.**
   - §2.3 BETWEEN: the pairs are checked in the amended order, and `operand_types` comes from `check_pair`.
   - §2.5(b): `type_of_arithmetic`'s unary branch admits `EngineType::Null`.
   - B-T3, C29-C38, each checked against the text as written:
     - C29 `tna_named("<", ConversionCanFail, ["HUGEINT expression","DECIMAL(2,1) literal"])` matches.
     - C30 `tna(ConversionCanFail)` matches; operand types are not asserted, as the amendment says.
     - C31-C34 are Admitted, and match.
     - C35 and C36 are `tna_named("BETWEEN", ConversionRounds, …)` with `["REAL","BIGINT"]` and `["BIGINT","DOUBLE"]`, and match.
     - C37 and C38 are Admitted, and match.
     - Each hypothesis sits in its named discriminator: C31 and C29 in B-T1b; C32 and C37 in B-T1 part 3, and `i32 + NULL` also in part 1.
   - B-T1b `the_walk_types_every_arithmetic_node_as_the_binder_does` is in `predicate.rs`'s `mod tests`, with no `pub` item.
     - Its count is 2,083: 12 columns × 42 operands × 4 operators, plus 5 family forms × 12 columns, plus 7 rows from C29-C33.
     - Parts 2-5 carry no arithmetic apart from `-NULL`, which B-T1b includes as C32b, so the enumeration is complete.
     - It reads the `/` node by name. The reported 897 checked nodes match my estimate only if `/` is included.
     - Its mutation is as written.
   - B-T1's re-derived table is removed, and B-T1 keeps checks (i) and (iii).
   - The part counts 7,620, 18, 323, 16 and 1,728 are each asserted, and the total is 9,705. The second mutation is declared in B-T1's doc.
   - B-T3 now asserts C25 as `RejectedByBinder` with Display's prefix unchanged, and C27's `construct` as containing CAST.
   - The B-T8 change is record only.
3. **W3's scope choice matches §2.5(a) as amended.**
   - Its specific bullets govern the general "rules pairwise":
     - a string operand refuses `text_with_non_text`;
     - a BOOLEAN operand refuses `boolean_conversion`;
     - a decimal literal beside a decimal refuses `conversion_can_fail` (O-5, Amendment 1 precedence 4, and the Note's item 2 exception).
   - Identical integers are rule 3. So confining rule 1 to REAL and DOUBLE is correct. Note N3 covers one probably unreachable reason gap.
   - W5 against `walk_expr`, one to one: CONSTANT, COLUMN_REF, COMPARISON, BETWEEN, CONJUNCTION, OPERATOR (NOT, IS NULL, IS NOT NULL, COMPARE_IN), and FUNCTION (arithmetic and `~~`/`~~*`) each have an arm. Everything else refuses. The one-to-one mirror holds (§2.2).
4. **§8 on the new head, changes only.**
   - Now PASS: item 5 (both new default arms refuse), item 6 (rule 4 is bounded), item 11, and item 15.
   - **Item 22 FAIL again (B1).**
   - Unchanged: every other item stays PASS. The diff is the same 28 files, with no `protocol/data-plane/` or `docs/adr` path. The round adds no `pub` item. Item 18 is re-checked at merge.
5. **Amendment 5 satisfies class 8.**
   - Its first line carries "budget overrun, §7 not edited".
   - The declared figure is 1,800 lines over 32 files. The final figure is 3,214 plus 244, 3,458 lines over 25 files, at 42a8c73 by §7's counting command, named in words with no hash.
   - The reason is size, citing my item 9, and the new lines trace to Amendment 4's §4 items. §7 is not edited, which I confirmed in the form at the head.
   - It meets my item 9 and round 25, item 2. The code at 53c6e3e equals 42a8c73 outside `*.md`, so the figure holds. Any further code commit needs a superseding row, as the amendment itself says.
6. **Beyond W1-W12:** nothing in scope. N4 records one doc inaccuracy.

**Blocking**
- **B1 (§8 item 22; a code-file comment, not a behaviour defect and not a record finding, so the architect cannot reduce it).** Three comments added this round state DuckDB behaviour without the version:
  - `engine/src/predicate.rs:1879` (rule 2: the binder casts only the NULL, and the result takes the other operand's type);
  - `engine/src/predicate.rs:2756` (`REAL` is valid SQL, the same as `FLOAT`);
  - `engine/src/predicate.rs:3040` (NULL-involving nodes are constant-folded away).

  Line 1879 is also contradicted by line 3040: if the binder folds `i32 + NULL`, the result is not the other operand's type.

  Remedy: add "at v1.5.5" to lines 2756 and 3040. Reword line 1879 to state the walk's own typing, not the binder's. The commit touches only comment lines, and a superseding class-8 row follows. Whether that commit counts against the correction-round cap is the custodian's routing call.

**Non-blocking**
- N1: B-T1b skips any node the plan lacks, for example a folded NULL node, and asserts only `checked > 0`, not 897. Reduction if wanted: Amendment 4's check (ii) reads "every arithmetic node the walk types `Ok` and the plan carries as a BOUND_FUNCTION".
- N2: nothing pins the walk's type for `i32 + NULL` (INTEGER). If the binder folds it to NULL, a predicate such as `(i32 + NULL) = zone` would be refused `text_with_non_text` over an expression that is always NULL. No file data is involved.
- N3: VARCHAR with VARCHAR in arithmetic would get `conversion_rounds`, while §2.5(a)'s bullet says `text_with_non_text`. The binder probably refuses it first, and no test pins it.
- N4: `is_declared_cast`'s doc says integers widen within "the same signedness", but the code also accepts unsigned to a wider signed type, as §7 allows. Only the doc is wrong.
- N5: the reviewer's attempt-2 N3 (B-T5's exclusion matched by text, not type) is unchanged. It stays a note.
