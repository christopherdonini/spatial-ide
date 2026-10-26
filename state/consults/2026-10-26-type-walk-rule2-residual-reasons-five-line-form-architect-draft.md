*Custodian's filing note (2026-10-26): the architect's read-only draft of the five-line form for `type-walk-rule2-residual-reasons`, the filler queue's entry 8b (S3), read at main fc78efa6. Its recommended route (A) rewords T-C's fifth sentence, the human's accepted text, so that every conversion_rounds refusal states a conversion refused by type (a P6 placeholder), engine only, no admission outcome moved, about 95 lines in 2 files; routes (B) and (C) need a red-line ADR-021 Note. Its OPEN-1 (the route), OPEN-2 (the sentence's wording, now or at the sitting) and OPEN-3 (F-C, the constant-NULL conversion_can_fail shapes, whose reason the ADR states) are the human's and are put to the human; nothing is committed from this draft until the human answers. The custodian's choices: OPEN-4 (A), a P6 string fits the filler on entry 2's precedent; OPEN-5, F-A (literal-only float and integer arithmetic refused, although FILTER-BIND section 2.5(a) and ADR-021's Note admit it) proposed as its own node, `literal-only-float-integer-arithmetic-refused`, for the human to place; F-B (text or BOOLEAN beside NULL in arithmetic falling to the residual reason) follows the piece's P-0 probe and is not proposed until P-0 has run. The run 03:30:37Z to 03:46:05Z by its transcript (Grep 23, Read 24, Glob 3; no write tool). Extracted by script from its SubagentHandback call, with one final newline added; nothing else is changed. Its sha256, from line 5 to the end, is 96838ebd231a1997a60d19b05cc8ba754799ad06cd2e90c68479c1c42b18140f.*

---

Drafted: type-walk-rule2-residual-reasons, five-line form, architect. Read at main @ fc78efa6. This is a drafting task, not a gate, so there is no verdict.

I made Read, Grep and Glob calls only, and no write call. I have no shell, so no sha256 appears below. Every cite is `path:line @ fc78efa6` and was read in the main checkout. The custodian pins them by script.

**First, admission.** The recommended route (A) does not change what admission admits. Routes B and C below would. Route A fits §21c's size: about 100 lines over 2 files. B and C do not fit a five-line form.

```
Authority: PLAN node `type-walk-rule2-residual-reasons` (PLAN.yaml:4139-4155 @ fc78efa6), generation 2; filler queue entry 8b, graded S3 (state/directives/2026-10-24-weekend-exception-third-product-slot-placements-forms-ahead-250-click.md:16-17 @ fc78efa6; state/FILLER-QUEUE.md:24 @ fc78efa6); the filler rule, AUTONOMY.md §36 (AUTONOMY.md:692 @ fc78efa6): a five-line form under §21c, the reviewer and the architect from dispatch, round 25, item 2 (e) set aside, its strings a user sees P6 placeholders; proposed by node 10's architect draft, F7 and Q-3 (state/consults/2026-10-03-type-walk-null-literal-arithmetic-architect-draft.md:78 @ fc78efa6; state/consults/2026-10-03-type-walk-null-literal-arithmetic-architect-draft.md:362 @ fc78efa6), the degenerate constant-NULL shapes' sentence routed here by question round 49, item 2 and engine/TYPE-WALK-NULL-LITERAL-ARITHMETIC-PREREGISTRATION.md §10 Amendment 4, item 11 (engine/TYPE-WALK-NULL-LITERAL-ARITHMETIC-PREREGISTRATION.md:424 @ fc78efa6); admission stays as question round 43, item 1 and question round 49, item 2 bound it; the route and the replacement of T-C's fifth sentence are the human's OPEN-1 ruling <cited by round and item once ruled>; the reuse index found no prior art on either search (type walk null; residual reason), a miss noted here.
Scope: 2 files, engine/src/predicate.rs (the `ConversionRounds` arm of `TypeRefusalReason::sentence`, engine/src/predicate.rs:1441-1443 @ fc78efa6, and that function's doc comment, engine/src/predicate.rs:1430-1432 @ fc78efa6) and engine/tests/filter_type_admission.rs (one new test, T1); declared line budget 130 (insertions plus deletions, comments counted, AUTONOMY.md:357 @ fc78efa6); this form exempt; no other sentence arm, admission rule, reason, precedence, `Typed` field or Display format changes, no B-T1, B-T1b or B-T3 row, count or assertion changes, no new `pub` item, no file under kernel/, protocol/, frontends/ or renderer/, no KNOWN-LIMITATIONS.md item and no engine/README.md line.
Change: every `skp.filter_type_not_admitted` refusal whose reason is `conversion_rounds` ends its Display, and so its wire `message` (protocol/skp/SKP-V0.md:343-344 @ fc78efa6), with one `[P6 placeholder]` sentence stating a conversion between a float type and an integer or decimal type refused by type, instead of T-C's sentence naming a value read from the file (state/directives/B-1-RULINGS-AND-TYPED-TEXTS-2026-09-30.md:57 @ fc78efa6), which is false where the integer or decimal side is a constant NULL (`f32 > NULL + 100000`, `f32 > NULL * NULL`, `f32 + -NULL > 0`); no admission outcome, code, `construct`, `operand_types` or `reason` wire value changes.
Tests+mutation: before any code, P-0 (a throwaway test on FX-1, never committed): `zone + NULL > 0`, `flag + NULL > 0` and `'1' + NULL > 0`, each once through `AdmittedPredicate::admit`, the outcome recorded with DuckDB's version and the 40-hex commit, predicted (a hypothesis) `skp.filter_rejected_by_binder` for each, and a `TypeNotAdmitted` for any is a stop, because the new sentence is false of it; T1 every_conversion_rounds_refusal_states_a_conversion_refused_by_type (new, engine/tests/filter_type_admission.rs): for each of eleven predicates (`f32 > NULL + 100000`, `f32 > NULL + i32`, `f64 > NULL + i64`, `1e3 > NULL + i64`, `f32 > NULL * NULL`, `f64 > -NULL`, `f32 + -NULL > 0`, `(NULL - 0.5) + f32 > 0`, and the controls `i32 = f32`, `i64 = 1e3`, `i32 + f32 > 0`) it asserts `TypeNotAdmitted` with the construct, operand types and reason that note 1 tables, and a Display equal to the Display format (engine/src/predicate.rs:382-387 @ fc78efa6) carrying the new sentence; a construct, operand type or reason that differs at the base is a class-2 result and a stop; M-1: the `ConversionRounds` arm restored to T-C's sentence, predicted to fail exactly T1 in a run of the whole binary, by name at its Display assertion on `f32 > NULL + 100000`; observed in a debug build on the branch's code commit, recorded by name with the 40-hex commit in a `RECORDED MUTATION:` doc line, and reverted; a verify-mutation run is not an observation.
Out-of-scope: ADR: no status line or amendment; ADR-021's Notes 2026-09-30 and 2026-10-03 (docs/adr/ADR-021-row-filter-on-viewport-query.md:244-275 @ fc78efa6) keep their text, their admitted and refused classes, their twelve codes and their five reason values, and no admission outcome moves; security: nothing ADR-020, ADR-009 or ADR-021 governs; wire: no SKP code, field, reason value or literal, nothing under protocol/, FX-4 unchanged (protocol/skp/tests/data/v0-error-filter_type_not_admitted.json:3 @ fc78efa6, a `text_with_non_text` message), and the `message` change is a Display wording change, which O-4 places outside the wire (state/directives/B-1-RULINGS-AND-TYPED-TEXTS-2026-09-30.md:10 @ fc78efa6), under SKP-V0's unchanged message rule; guarantee: none changed, "touched" read as changed (kernel/KERNEL-CLOSE-DURING-OPEN-ADMISSION-PREREGISTRATION.md:99 @ fc78efa6); no test asserts the residual sentence at the base, and T1 newly puts it under test, a contact with FILTER-BIND's sentence invalidator (engine/FILTER-BIND-COERCIONS-PREREGISTRATION.md:376 @ fc78efa6) disclosed here, which the change makes hold of more refusals; the user-visible sentence is a P6 placeholder, as entry 2's detail was (state/FILLER-QUEUE.md:8 @ fc78efa6; engine/STREAM-EVALUATION-FAILURE-FIXED-DETAIL-PREREGISTRATION.md:8 @ fc78efa6); the five-line form stands under §36, which sets round 25, item 2 (e) aside.
```

## Notes (my reading)

### 1. The predicates the node names: what each gets today, and after route A

**How the walk reaches them.**
- **Rule 2's result.** Arithmetic rule 2 gives a NULL-literal-with-numeric result the partner's type (engine/src/predicate.rs:2071-2076 @ fc78efa6). NULL-with-NULL and unary `-NULL` are typed BIGINT (engine/src/predicate.rs:2065-2070 @ fc78efa6, engine/src/predicate.rs:1974-1979 @ fc78efa6). Each result is kind expression and within bounds (engine/src/predicate.rs:2010-2014 @ fc78efa6).
- **The bit-width bounds.** Comparison rules 5 and 7 need a non-literal integer of at most 32 or 16 bits (engine/src/predicate.rs:2177-2183 @ fc78efa6, engine/src/predicate.rs:2210 @ fc78efa6, engine/src/predicate.rs:2225-2235 @ fc78efa6).
- **Rule 6(i) does not apply.** It needs a literal or a marked result (engine/src/predicate.rs:2168-2173 @ fc78efa6).
- **The reason.** `determine_reason` passes items 1 to 4 and returns the residual (engine/src/predicate.rs:2255-2294 @ fc78efa6). The Display carries T-C's sentence (engine/src/predicate.rs:1441-1443 @ fc78efa6, engine/src/predicate.rs:382-387 @ fc78efa6). That Display is the operator's refusal text (kernel/src/skp.rs:2231-2232 @ fc78efa6, frontends/shell/src/admission/formatRefusal.ts:13 @ fc78efa6).

**The shapes (from reading; P-1 is T1's run):**

| Predicate | Class | Construct; operand types | Reason, today and after A | T-C's sentence true? | Route A's sentence |
|---|---|---|---|---|---|
| `f32 > NULL + 100000` | F7: a rule-2 result over an integer literal, refused by rule 7 | `>`; REAL; INTEGER expression | `conversion_rounds` | no: the INTEGER side is NULL in every row | the new sentence |
| `f32 > NULL + i32` | F7, over a column | `>`; REAL; INTEGER expression | same | no | same |
| `f64 > NULL + i64` | F7, over a column, rule 7's DOUBLE bound | `>`; DOUBLE; BIGINT expression | same | no | same |
| `1e3 > NULL + i64` | F7's class, by rule 5's bound. The title names only rule 7; I read rule 5 as the same class. | `>`; DOUBLE literal; BIGINT expression | same | no | same |
| `f32 > NULL * NULL`, `f64 > -NULL` | degenerate (round 49, item 2; node 10's Amendments 1 and 2, §5) | `>`; REAL or DOUBLE; BIGINT expression | same | no | same |
| `f32 + -NULL > 0` | degenerate, in arithmetic (engine/TYPE-WALK-NULL-LITERAL-ARITHMETIC-PREREGISTRATION.md:385 @ fc78efa6) | `+`; REAL; BIGINT expression | same | no | same |
| `(NULL - 0.5) + f32 > 0` | adjacent: a marked result in arithmetic. The Note 2026-10-03, item 2 says inside `+`, `-` and `*` nothing changes (docs/adr/ADR-021-row-filter-on-viewport-query.md:274 @ fc78efa6). | `+`; DECIMAL(2,1) expression; REAL | same | no | same |
| C8 `i32 = f32`, C7 `i64 = 1e3`, C19 `i32 + f32 > 0` (engine/tests/filter_type_admission.rs:215-216 @ fc78efa6, engine/tests/filter_type_admission.rs:258 @ fc78efa6) | controls | `=`; INTEGER; REAL / `=`; BIGINT; DOUBLE literal / `+`; INTEGER; REAL | same | yes | same, and still true |

### 2. Why no existing reason is true of these shapes, and the routes

- **The five reasons mirror Note item 1's five refused-case bullets** (O-3, state/directives/B-1-RULINGS-AND-TYPED-TEXTS-2026-09-30.md:9 @ fc78efa6; docs/adr/ADR-021-row-filter-on-viewport-query.md:248-253 @ fc78efa6).
- **These shapes fall under none of those bullets.** They are refused only by item 2's lead sentence, which says every conversion not named is refused (docs/adr/ADR-021-row-filter-on-viewport-query.md:254 @ fc78efa6). So none of the five sentences is true of them.
- **This is a live instance of FILTER-BIND's invalidator** (engine/FILTER-BIND-COERCIONS-PREREGISTRATION.md:376 @ fc78efa6). It sits outside the corpus, so that form's §8 item 9 (engine/FILTER-BIND-COERCIONS-PREREGISTRATION.md:377 @ fc78efa6) is not tripped.

The routes:
- **(A) Reword T-C's fifth sentence (recommended).** One engine string becomes type-level. That is consistent with round 49, item 2's "refused by type", and the wire name `conversion_rounds` then reads as a type-level claim. Cost: it replaces the human's accepted T-C text (FILTER-BIND's statement at engine/FILTER-BIND-COERCIONS-PREREGISTRATION.md:350 @ fc78efa6 becomes historical for this sentence). The rounding statement also moves from a file value to the operand types.
- **(B) A sixth reason, exact.** It means a new wire value and a dated ADR-021 Note, because Note item 6 says "one of five fixed values" (docs/adr/ADR-021-row-filter-on-viewport-query.md:267 @ fc78efa6). That is red-line text. It also needs a SKP-V0 §7.5 dated note (protocol/skp/SKP-V0.md:516-519 @ fc78efa6) and a full form. Not S3.
- **(C) Admit the constant-NULL shapes against a float, by a reading.** This changes admission. It needs a dated ADR-021 Note (red line) and reverses round 49, item 2's "Refuse by type". It also needs a probe of the plan's casts first: node 10's Amendment 1 found the binder does not treat a NULL-valued expression as a NULL literal.
- **(D) Accept as it stands.** No code. The gap is recorded in `sentence()`'s source comment and on the form, and FILTER-BIND's invalidator stays live.

### 3. The sentence words (W-1, P6 placeholder, replacing the human's accepted T-C wording; OPEN-2)

W-1 is my wording:

> [P6 placeholder] a conversion between a float type and an integer or decimal type, refused by type: values of the integer or decimal type can round in the float type

Each clause checked against the code at fc78efa6:
- **"between a float type and an integer or decimal type".** Only `check_pair` (engine/src/predicate.rs:2333 @ fc78efa6) and the binary arithmetic arm (engine/src/predicate.rs:2018 @ fc78efa6) can reach engine/src/predicate.rs:2293 @ fc78efa6. The unary, `/` and junction callers have a VARCHAR or BOOLEAN operand there, so items 1 and 2 fire first (engine/src/predicate.rs:1986 @ fc78efa6, engine/src/predicate.rs:1944-1950 @ fc78efa6, engine/src/predicate.rs:2431-2441 @ fc78efa6).
  - Admitted: integer with integer (engine/src/predicate.rs:2187-2189 @ fc78efa6, engine/src/predicate.rs:2078-2080 @ fc78efa6), and decimal with integer or decimal inside rule 4.
  - Refused at items 3 and 4: decimal with a wide integer, out of bounds, or decimal in arithmetic.
  - NULL is admitted in comparisons (engine/src/predicate.rs:2153 @ fc78efa6).
  - What remains is a REAL/DOUBLE operand (column, result or double literal) beside an integer or decimal operand. **Holds**, except P-0's three shapes if the binder lets any of them through (note 4).
- **"refused by type".** The walk reads type, kind, the bound flag and the marked field, never a row value (engine/src/predicate.rs:1506-1525 @ fc78efa6). `literal_int_value` serves only result typing (engine/src/predicate.rs:1665-1681 @ fc78efa6). **Holds.**
- **"values of the integer or decimal type can round in the float type".**
  - The residual integer types are INTEGER and wider against REAL, and BIGINT and wider against DOUBLE or a double literal. Rules 5 and 7 admit the narrower ones. The decimal types carry a scale of 1 or more, from a decimal literal.
  - **Holds**, except for a double literal beside an INTEGER literal in `+`, `-` or `*` (note 4), where T-C's sentence is false too.
- **Ordinary use.** Every shape above can be typed in the shipped app. Its operator sees W-1 inside "refused: `>` over REAL and INTEGER expression: … (docs/01 principle 8)".
- **Whose wording.** T-C is the human's accepted text, and W-1 is a string the app shows. So it stays under P6, not the wording-blocks rule.

**W-2, the doc comment at engine/src/predicate.rs:1430-1432 @ fc78efa6.** These are my words, not the human's; the worker applies them:

> /// The `Display` sentence, never sent on the wire. The first four are copied byte for byte from
> /// `state/directives/B-1-RULINGS-AND-TYPED-TEXTS-2026-09-30.md` T-C by the script that wrote this
> /// file. The fifth, `ConversionRounds`'s, replaces T-C's under
> /// `engine/TYPE-WALK-RULE2-RESIDUAL-REASONS-PREREGISTRATION.md` and is a P6 placeholder: T-C's
> /// named a value read from the file, which is false where the integer or decimal side is a constant
> /// NULL (`f32 > NULL + 100000`). This one states the type pair alone. It is still false of a double
> /// literal beside an INTEGER literal in `+`, `-` or `*`, which the walk refuses although no INTEGER
> /// value rounds in DOUBLE.

Each clause checked:
- **"first four copied".** engine/src/predicate.rs:1435-1440 @ fc78efa6 matches state/directives/B-1-RULINGS-AND-TYPED-TEXTS-2026-09-30.md:53-56 @ fc78efa6 (read side by side). **Holds.**
- **"named a value read from the file".** :57 there. **Holds.**
- **"false … constant NULL".** Note 1. **Holds.**
- **"still false of a double literal …".** Note 4, F-A. Holds by reading, not run.

### 4. Findings outside this piece

None is fixed here. Each is reading-only and unexecuted, and each is the custodian's to propose (OPEN-5).
- **F-A: literal-only arithmetic is refused although the walk's governing rules admit it.**
  - The arithmetic arm needs a non-literal float for rule 6 and a non-literal integer for rule 5 (engine/src/predicate.rs:2034-2050 @ fc78efa6, engine/src/predicate.rs:2081-2097 @ fc78efa6, engine/src/predicate.rs:2125-2131 @ fc78efa6). So `1e3 + 5 > 0` and `0.5 + 1e3 > 0` refuse `conversion_rounds`.
  - Against that: FILTER-BIND §2.5(a) says "a double literal with an integer follows rule 5", and "integer" includes a literal within bounds (engine/FILTER-BIND-COERCIONS-PREREGISTRATION.md:92 @ fc78efa6, engine/FILTER-BIND-COERCIONS-PREREGISTRATION.md:71 @ fc78efa6). The ADR admits two numeric literals within the bounds inside `+`, `-` and `*` (docs/adr/ADR-021-row-filter-on-viewport-query.md:261 @ fc78efa6, docs/adr/ADR-021-row-filter-on-viewport-query.md:263 @ fc78efa6).
  - B-T1's probe set builds column-op-operand only, so nothing pins this.
  - The fix changes admission, so it needs its own node, probably under full gating. Once it lands, W-1 is true of every residual refusal.
- **F-B: in arithmetic, text or BOOLEAN beside NULL falls to the residual reason.**
  - Items 1 and 2 exclude a NULL partner (engine/src/predicate.rs:2260-2269 @ fc78efa6), and arithmetic rule 2 is guarded by `is_numeric` (engine/src/predicate.rs:2071-2076 @ fc78efa6). So `zone + NULL` would refuse `conversion_rounds`, against §2.5(a)'s text and boolean refusals (engine/FILTER-BIND-COERCIONS-PREREGISTRATION.md:94 @ fc78efa6).
  - It shows only if the surrogate prepare accepts the shape, which P-0 decides.
- **F-C: the constant-NULL `conversion_can_fail` shapes.** `(NULL + NULL) - 0.5` and `-NULL - 0.5` (engine/TYPE-WALK-NULL-LITERAL-ARITHMETIC-PREREGISTRATION.md:362 @ fc78efa6, engine/TYPE-WALK-NULL-LITERAL-ARITHMETIC-PREREGISTRATION.md:385 @ fc78efa6) carry "a conversion that can fail during the scan", which is false of a NULL. But the ADR states that class's reason itself, "because that conversion can fail" (docs/adr/ADR-021-row-filter-on-viewport-query.md:263 @ fc78efa6). That is red-line text (OPEN-3).

### 5. ADR-021 and FILTER-BIND readings

- **ADR-021.** No ADR text and no class moves.
  - Under A, `conversion_rounds` is read as covering item 2's lead-sentence refusal of a float pair, not only bullet 5 of item 1. That moves O-3's one-to-one rationale, which is Fable's ruling, not ADR text.
  - The reading is the human's, under OPEN-1.
- **FILTER-BIND.** FILTER-BIND §2.6's "sentences are T-C's" (engine/FILTER-BIND-COERCIONS-PREREGISTRATION.md:350 @ fc78efa6) is a historical pin for the fifth sentence after this piece: the tree is authoritative once it merges. Its "(else conversion_rounds)" (engine/FILTER-BIND-COERCIONS-PREREGISTRATION.md:91 @ fc78efa6) is unchanged.

### 6. Tests and the mutation

- **T1 is the only test the claim needs.** B-T3 asserts reasons, not sentences (engine/tests/filter_type_admission.rs:469-555 @ fc78efa6). Its rows, B-T1's A1 and A2 pins (engine/tests/filter_type_admission.rs:1161 @ fc78efa6, engine/tests/filter_type_admission.rs:1171 @ fc78efa6) and every count are untouched.
- **M-1 is predicted to fail T1 alone.** No other string in the tree carries the residual sentence: a repository search for "can round" over engine, kernel, the shell's src, protocol and renderer finds only engine/src/predicate.rs:1442 @ fc78efa6. Kernel B-T6, FX-4 and shell B-T9 pin `zone = 1`.
- **P-0 runs before code**, so that W-1's first clause is checked against F-B.

### 7. Size

- Estimate: 6 lines in predicate.rs (the arm and W-2), and about 85 in the test file (eleven table entries, the body and a `RECORDED MUTATION:` line). That is about 95 in 2 files, under the declared budget of 130 and §21c's 150 lines and 8 files.
- An overrun is class 6, with the Scope line unedited (AUTONOMY.md:345 @ fc78efa6).
- §21c's fourth bound, no new user-visible behaviour (AUTONOMY.md:350-351 @ fc78efa6), is met through §36's P6 clause, as entry 2 was (OPEN-4).
- The node's budget is 60 minutes: plausible for one probe, one debug build and two runs, but not measured.

### 8. Rule (00), path by path

The piece's paths are engine/src/predicate.rs, engine/tests/filter_type_admission.rs and the new form, engine/TYPE-WALK-RULE2-RESIDUAL-REASONS-PREREGISTRATION.md.

| In flight | Overlap |
|---|---|
| slot 2, 1c step 1 | none |
| port-2 | none. Contact only: engine/src/lib.rs re-exports `FilterError` and `TypeRefusalReason`, which T1 imports. |
| 6b | none |
| #260 | none |
| #252 | none. Contact: engine/src/dataset.rs holds `Dataset::open`. |
| #249, #244 | none (no KNOWN-LIMITATIONS item, no walkthrough Part) |
| #241 | none. engine/README.md is not touched, and no line is owed, as for the slice form. Contact: engine/src/fixture.rs supplies FX-1's `FixtureSpec`. |

Nothing touches protocol/. The path lists are the brief's; I cannot read branches.

## OPEN items

- **OPEN-1, the human's: the route.**
  - (A) Reword T-C's fifth sentence, engine only. **Recommended.**
  - (B) A sixth reason: a red-line ADR-021 Note, a wire value and a full form.
  - (C) Admit the constant-NULL float shapes: a red-line Note that reverses round 49, item 2.
  - (D) Accept as it stands and record it.

  A is the only route that fits a five-line form. It makes the residual sentence true of every refusal of the node's class, with the one shape named in note 4 (F-A) as the exception.
- **OPEN-2, the human's, at the sitting.** W-1's words replace the human's accepted T-C fifth sentence. The human can word it now, or the placeholder lands and is worded at P6. W-2 is not the human's wording.
- **OPEN-3, the human's: F-C.** Recommendation: keep the `conversion_can_fail` constant-NULL shapes out of this piece. The ADR text states that class's reason, and changing it is red-line.
- **OPEN-4, the custodian's.** Does a user-visible P6 string fit "under §21c's size" for a filler? Recommendation: yes, on entry 2's precedent (#255).
- **OPEN-5, the custodian's.** Propose F-A and F-B as nodes. Recommendation: F-A ahead of or beside this piece. F-B follows P-0's outcome; if P-0 stops this piece, its precedence fix joins as class 9 or goes to its own node.

## Not settled

- The DuckDB v1.5.5 binder's outcomes for P-0's three shapes: a hypothesis, decided by P-0.
- The binder's cast direction for float-against-integer pairs. W-1 is written so that it does not depend on it.
- Whether the human accepts the type-level reading of `conversion_rounds`.
- F-A rests on reading only and was not run.
