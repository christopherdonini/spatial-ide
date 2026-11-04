# engine: every conversion_rounds refusal states a conversion refused by type — five-line short form (`AUTONOMY.md` §21d)

*Committed before any code. Append-only once committed; an amendment written after any run of this piece's tests or mutations has been seen says so in its first line. PLAN node type-walk-rule2-residual-reasons, the filler queue's entry 8b (S3). The five lines, the admission paragraph, the notes, the OPEN items and what is not settled are the architect's draft (`state/consults/2026-10-26-type-walk-rule2-residual-reasons-five-line-form-architect-draft.md`, read only at main fc78efa6; its sha256 from line 5 is 96838ebd231a1997a60d19b05cc8ba754799ad06cd2e90c68479c1c42b18140f), carried byte for byte with these changes, all the custodian's: each cite the draft marks `@ fc78efa6`, and each cite on a line before that line's last marker, is expanded by script to `path:line @ <commit> sha256:<the lines with their LFs>` (a dot path as `path:line` at <commit>, sha256 <hex>; 0 such) (80 pins; 0 by a file name that resolves to one tracked path at that commit; 0 bare line numbers bound to the path written before them; 0 bare line numbers the draft leaves unmarked kept as written; 1 remaining markers given the full commit id); this title and lead line added; the draft's two opening paragraphs (its calls and its cite convention) dropped. Every pin is historical, read before governance piece F moved the forms and the process files: for the code, the piece's base on main is authoritative. Form path: `governance/forms/engine/TYPE-WALK-RULE2-RESIDUAL-REASONS-PREREGISTRATION.md`. The custodian keeps the PLAN node on main.*

```
Authority: PLAN node `type-walk-rule2-residual-reasons` (PLAN.yaml:4139-4155 @ fc78efa6b7bbc54f8306d7d2569e3b869050bc03 sha256:87483b1f42fe55dc3432f4ed69f9377a5c1e6b91205a8b5ce0a67d32254e1b92), generation 2; filler queue entry 8b, graded S3 (state/directives/2026-10-24-weekend-exception-third-product-slot-placements-forms-ahead-250-click.md:16-17 @ fc78efa6b7bbc54f8306d7d2569e3b869050bc03 sha256:cc9f63fefb077542bbb96e19bdaaa56204605f8db342497f8d3c83e69e2c185e; state/FILLER-QUEUE.md:24 @ fc78efa6b7bbc54f8306d7d2569e3b869050bc03 sha256:cad312decf089e675914ce38d64ff755a6787494232e22d582cd61e363bb0dbf); the filler rule, AUTONOMY.md §36 (AUTONOMY.md:692 @ fc78efa6b7bbc54f8306d7d2569e3b869050bc03 sha256:1135b89c01d0e676bce0bc42a4d6710af445fa0ae95ed12ef6ca0fef7a4d4e84): a five-line form under §21c, the reviewer and the architect from dispatch, round 25, item 2 (e) set aside, its strings a user sees P6 placeholders; proposed by node 10's architect draft, F7 and Q-3 (state/consults/2026-10-03-type-walk-null-literal-arithmetic-architect-draft.md:78 @ fc78efa6b7bbc54f8306d7d2569e3b869050bc03 sha256:0af8042aa1aa09c1a93285463348befed716edef3bb2faec034fa54d68ccf796; state/consults/2026-10-03-type-walk-null-literal-arithmetic-architect-draft.md:362 @ fc78efa6b7bbc54f8306d7d2569e3b869050bc03 sha256:e68011acfbe9de8e5280bc83aff0881acff30e52ee73d351e6d2cf8ca0206591), the degenerate constant-NULL shapes' sentence routed here by question round 49, item 2 and engine/TYPE-WALK-NULL-LITERAL-ARITHMETIC-PREREGISTRATION.md §10 Amendment 4, item 11 (engine/TYPE-WALK-NULL-LITERAL-ARITHMETIC-PREREGISTRATION.md:424 @ fc78efa6b7bbc54f8306d7d2569e3b869050bc03 sha256:02cbaa38ddc7d41c2f7df612d9e9c364d364488b5ea3756ff0314b068ea6f10e); admission stays as question round 43, item 1 and question round 49, item 2 bound it; the route and the replacement of T-C's fifth sentence are the human's OPEN-1 ruling <cited by round and item once ruled>; the reuse index found no prior art on either search (type walk null; residual reason), a miss noted here.
Scope: 2 files, engine/src/predicate.rs (the `ConversionRounds` arm of `TypeRefusalReason::sentence`, engine/src/predicate.rs:1441-1443 @ fc78efa6b7bbc54f8306d7d2569e3b869050bc03 sha256:34cd0dbda78327babfd989fef2048cb760ec1751e44467114e2d2bb988fc57b1, and that function's doc comment, engine/src/predicate.rs:1430-1432 @ fc78efa6b7bbc54f8306d7d2569e3b869050bc03 sha256:115b5d7df9feb6ff59618cee50a16bffbd080ea5ca114069a19d7c6140adf204) and engine/tests/filter_type_admission.rs (one new test, T1); declared line budget 130 (insertions plus deletions, comments counted, AUTONOMY.md:357 @ fc78efa6b7bbc54f8306d7d2569e3b869050bc03 sha256:367596df34a73d122765d000ba5df601dbe54da9e5a6aefca966747809a44fec); this form exempt; no other sentence arm, admission rule, reason, precedence, `Typed` field or Display format changes, no B-T1, B-T1b or B-T3 row, count or assertion changes, no new `pub` item, no file under kernel/, protocol/, frontends/ or renderer/, no KNOWN-LIMITATIONS.md item and no engine/README.md line.
Change: every `skp.filter_type_not_admitted` refusal whose reason is `conversion_rounds` ends its Display, and so its wire `message` (protocol/skp/SKP-V0.md:343-344 @ fc78efa6b7bbc54f8306d7d2569e3b869050bc03 sha256:8363598a8624e8a2af14e065f498efa55dc6c311d0c3c6947cd629ae00de9157), with one `[P6 placeholder]` sentence stating a conversion between a float type and an integer or decimal type refused by type, instead of T-C's sentence naming a value read from the file (state/directives/B-1-RULINGS-AND-TYPED-TEXTS-2026-09-30.md:57 @ fc78efa6b7bbc54f8306d7d2569e3b869050bc03 sha256:c490d656ae16fa572820d23c48725dbd2b94b807fe9a33a03f5b6d9eecb5e2c5), which is false where the integer or decimal side is a constant NULL (`f32 > NULL + 100000`, `f32 > NULL * NULL`, `f32 + -NULL > 0`); no admission outcome, code, `construct`, `operand_types` or `reason` wire value changes.
Tests+mutation: before any code, P-0 (a throwaway test on FX-1, never committed): `zone + NULL > 0`, `flag + NULL > 0` and `'1' + NULL > 0`, each once through `AdmittedPredicate::admit`, the outcome recorded with DuckDB's version and the 40-hex commit, predicted (a hypothesis) `skp.filter_rejected_by_binder` for each, and a `TypeNotAdmitted` for any is a stop, because the new sentence is false of it; T1 every_conversion_rounds_refusal_states_a_conversion_refused_by_type (new, engine/tests/filter_type_admission.rs): for each of eleven predicates (`f32 > NULL + 100000`, `f32 > NULL + i32`, `f64 > NULL + i64`, `1e3 > NULL + i64`, `f32 > NULL * NULL`, `f64 > -NULL`, `f32 + -NULL > 0`, `(NULL - 0.5) + f32 > 0`, and the controls `i32 = f32`, `i64 = 1e3`, `i32 + f32 > 0`) it asserts `TypeNotAdmitted` with the construct, operand types and reason that note 1 tables, and a Display equal to the Display format (engine/src/predicate.rs:382-387 @ fc78efa6b7bbc54f8306d7d2569e3b869050bc03 sha256:e57946a4d22150cec9a129f62d9fc60c8aae9ce32faf4d5340f9e2cd02c4d008) carrying the new sentence; a construct, operand type or reason that differs at the base is a class-2 result and a stop; M-1: the `ConversionRounds` arm restored to T-C's sentence, predicted to fail exactly T1 in a run of the whole binary, by name at its Display assertion on `f32 > NULL + 100000`; observed in a debug build on the branch's code commit, recorded by name with the 40-hex commit in a `RECORDED MUTATION:` doc line, and reverted; a verify-mutation run is not an observation.
Out-of-scope: ADR: no status line or amendment; ADR-021's Notes 2026-09-30 and 2026-10-03 (docs/adr/ADR-021-row-filter-on-viewport-query.md:244-275 @ fc78efa6b7bbc54f8306d7d2569e3b869050bc03 sha256:1a829ad9ca68989eefdb41d9e0c1ffddfffb7e0eee42e7200a8e40f12ba9c892) keep their text, their admitted and refused classes, their twelve codes and their five reason values, and no admission outcome moves; security: nothing ADR-020, ADR-009 or ADR-021 governs; wire: no SKP code, field, reason value or literal, nothing under protocol/, FX-4 unchanged (protocol/skp/tests/data/v0-error-filter_type_not_admitted.json:3 @ fc78efa6b7bbc54f8306d7d2569e3b869050bc03 sha256:c087e2916f6db399e80ddb0540795faa55d361eca6da566ea31ad2b845694be6, a `text_with_non_text` message), and the `message` change is a Display wording change, which O-4 places outside the wire (state/directives/B-1-RULINGS-AND-TYPED-TEXTS-2026-09-30.md:10 @ fc78efa6b7bbc54f8306d7d2569e3b869050bc03 sha256:1b3f78c0dab48121ab968afccea766aac624919154ae85a8c4c54272491416d7), under SKP-V0's unchanged message rule; guarantee: none changed, "touched" read as changed (kernel/KERNEL-CLOSE-DURING-OPEN-ADMISSION-PREREGISTRATION.md:99 @ fc78efa6b7bbc54f8306d7d2569e3b869050bc03 sha256:409f44fb055bb53fc13bf4c1160cefdcaf7048472a76a84f512cbd94ece5e113); no test asserts the residual sentence at the base, and T1 newly puts it under test, a contact with FILTER-BIND's sentence invalidator (engine/FILTER-BIND-COERCIONS-PREREGISTRATION.md:376 @ fc78efa6b7bbc54f8306d7d2569e3b869050bc03 sha256:5449d5966f4399321a2caaece17136c92d25ac0bc3bf11cd4bb5a8a4f2511959) disclosed here, which the change makes hold of more refusals; the user-visible sentence is a P6 placeholder, as entry 2's detail was (state/FILLER-QUEUE.md:8 @ fc78efa6b7bbc54f8306d7d2569e3b869050bc03 sha256:e156cb2d1c6bc147a802fedf6adda00f0c960e157d27a40f00adc9059cd4bdfe; engine/STREAM-EVALUATION-FAILURE-FIXED-DETAIL-PREREGISTRATION.md:8 @ fc78efa6b7bbc54f8306d7d2569e3b869050bc03 sha256:fd19c21d6839db36611f0225d4af680c8bf827c32f6a40acfa06f3d6d82e01a4); the five-line form stands under §36, which sets round 25, item 2 (e) aside.
```

*The admission paragraph, the notes, the OPEN items and what is not settled below are the architect's from its draft, carried byte for byte except for the pins; where they say I or my, they mean the architect's. They are this form's reading.*

**First, admission.** The recommended route (A) does not change what admission admits. Routes B and C below would. Route A fits §21c's size: about 100 lines over 2 files. B and C do not fit a five-line form.

## Notes (my reading)

### 1. The predicates the node names: what each gets today, and after route A

**How the walk reaches them.**
- **Rule 2's result.** Arithmetic rule 2 gives a NULL-literal-with-numeric result the partner's type (engine/src/predicate.rs:2071-2076 @ fc78efa6b7bbc54f8306d7d2569e3b869050bc03 sha256:9cb58ef11a5ad66b0f8a0cd035a6851670801b781170810331cace84c061dc6d). NULL-with-NULL and unary `-NULL` are typed BIGINT (engine/src/predicate.rs:2065-2070 @ fc78efa6b7bbc54f8306d7d2569e3b869050bc03 sha256:ddaf316473afacb84c9ea4af9772968f390efcd8a52e0743298393b97cc0dfc0, engine/src/predicate.rs:1974-1979 @ fc78efa6b7bbc54f8306d7d2569e3b869050bc03 sha256:0ebee9039cf23a6fa0ad2e44ed0b9816b259cb0a6baa5a2e0d51c15dfc48973b). Each result is kind expression and within bounds (engine/src/predicate.rs:2010-2014 @ fc78efa6b7bbc54f8306d7d2569e3b869050bc03 sha256:57e6292867d6f94d73e81fd68b85e0c08b919094bc01f3b4d43b70ef6c691568).
- **The bit-width bounds.** Comparison rules 5 and 7 need a non-literal integer of at most 32 or 16 bits (engine/src/predicate.rs:2177-2183 @ fc78efa6b7bbc54f8306d7d2569e3b869050bc03 sha256:6ad67f7bed26a55a576440fb6527504a4f3c8b54836df92ce8b8d1aa1fbcb670, engine/src/predicate.rs:2210 @ fc78efa6b7bbc54f8306d7d2569e3b869050bc03 sha256:aa59c0cadce2d90d900d3a5d4c5427dd4bf5487f28db22f832a621bbc150feb0, engine/src/predicate.rs:2225-2235 @ fc78efa6b7bbc54f8306d7d2569e3b869050bc03 sha256:6364a518760ba370a7c1b4e687e183a89ba3e8f741c9a003468021f72d3582e7).
- **Rule 6(i) does not apply.** It needs a literal or a marked result (engine/src/predicate.rs:2168-2173 @ fc78efa6b7bbc54f8306d7d2569e3b869050bc03 sha256:3f57ea12c33531e6bfc7de7f129afbf96bca7ff487840ab6e327bce384119aaa).
- **The reason.** `determine_reason` passes items 1 to 4 and returns the residual (engine/src/predicate.rs:2255-2294 @ fc78efa6b7bbc54f8306d7d2569e3b869050bc03 sha256:c30596d67a9ce73d3765ded7b7eb03fca0e6e145a96b5d74c5af9767b1f4ed64). The Display carries T-C's sentence (engine/src/predicate.rs:1441-1443 @ fc78efa6b7bbc54f8306d7d2569e3b869050bc03 sha256:34cd0dbda78327babfd989fef2048cb760ec1751e44467114e2d2bb988fc57b1, engine/src/predicate.rs:382-387 @ fc78efa6b7bbc54f8306d7d2569e3b869050bc03 sha256:e57946a4d22150cec9a129f62d9fc60c8aae9ce32faf4d5340f9e2cd02c4d008). That Display is the operator's refusal text (kernel/src/skp.rs:2231-2232 @ fc78efa6b7bbc54f8306d7d2569e3b869050bc03 sha256:f90560580646b1b35e4bdd534afac3dbdc7e020f538ec7839096221dd1e6ac0b, frontends/shell/src/admission/formatRefusal.ts:13 @ fc78efa6b7bbc54f8306d7d2569e3b869050bc03 sha256:8a9c7c961d9bf4a9054327cd7b3bc3e4d049eb0372e6cc80b507b36411f72860).

**The shapes (from reading; P-1 is T1's run):**

| Predicate | Class | Construct; operand types | Reason, today and after A | T-C's sentence true? | Route A's sentence |
|---|---|---|---|---|---|
| `f32 > NULL + 100000` | F7: a rule-2 result over an integer literal, refused by rule 7 | `>`; REAL; INTEGER expression | `conversion_rounds` | no: the INTEGER side is NULL in every row | the new sentence |
| `f32 > NULL + i32` | F7, over a column | `>`; REAL; INTEGER expression | same | no | same |
| `f64 > NULL + i64` | F7, over a column, rule 7's DOUBLE bound | `>`; DOUBLE; BIGINT expression | same | no | same |
| `1e3 > NULL + i64` | F7's class, by rule 5's bound. The title names only rule 7; I read rule 5 as the same class. | `>`; DOUBLE literal; BIGINT expression | same | no | same |
| `f32 > NULL * NULL`, `f64 > -NULL` | degenerate (round 49, item 2; node 10's Amendments 1 and 2, §5) | `>`; REAL or DOUBLE; BIGINT expression | same | no | same |
| `f32 + -NULL > 0` | degenerate, in arithmetic (engine/TYPE-WALK-NULL-LITERAL-ARITHMETIC-PREREGISTRATION.md:385 @ fc78efa6b7bbc54f8306d7d2569e3b869050bc03 sha256:eb9f08fadb1bb0ac8b1c6ae1b0fa614843fac4566df2597abd0d764dc6715d03) | `+`; REAL; BIGINT expression | same | no | same |
| `(NULL - 0.5) + f32 > 0` | adjacent: a marked result in arithmetic. The Note 2026-10-03, item 2 says inside `+`, `-` and `*` nothing changes (docs/adr/ADR-021-row-filter-on-viewport-query.md:274 @ fc78efa6b7bbc54f8306d7d2569e3b869050bc03 sha256:38266c5affad4b76a79899edd251680e52edfeed29d45ee40db525c5ed319a76). | `+`; DECIMAL(2,1) expression; REAL | same | no | same |
| C8 `i32 = f32`, C7 `i64 = 1e3`, C19 `i32 + f32 > 0` (engine/tests/filter_type_admission.rs:215-216 @ fc78efa6b7bbc54f8306d7d2569e3b869050bc03 sha256:76bb077a98c5e4ac976094ab2c61fcdff7de50a8aefc871c3d2f5701bd2c7579, engine/tests/filter_type_admission.rs:258 @ fc78efa6b7bbc54f8306d7d2569e3b869050bc03 sha256:511bf057cd17a64a9fa4fec2390bc1d9f0f1c93825ef370353c6b252c4842068) | controls | `=`; INTEGER; REAL / `=`; BIGINT; DOUBLE literal / `+`; INTEGER; REAL | same | yes | same, and still true |

### 2. Why no existing reason is true of these shapes, and the routes

- **The five reasons mirror Note item 1's five refused-case bullets** (O-3, state/directives/B-1-RULINGS-AND-TYPED-TEXTS-2026-09-30.md:9 @ fc78efa6b7bbc54f8306d7d2569e3b869050bc03 sha256:e8de8ccbbac0f328274876bea4933b8cebf2d620d22f68d4b73c3da83bd9a403; docs/adr/ADR-021-row-filter-on-viewport-query.md:248-253 @ fc78efa6b7bbc54f8306d7d2569e3b869050bc03 sha256:cd3f686c195696afbb3e6662a6ae48898cc9101dd363cf597d549229051d5736).
- **These shapes fall under none of those bullets.** They are refused only by item 2's lead sentence, which says every conversion not named is refused (docs/adr/ADR-021-row-filter-on-viewport-query.md:254 @ fc78efa6b7bbc54f8306d7d2569e3b869050bc03 sha256:d97cf86f9361e0709a6372554e4e26e81ed9e5aea98b1dca8c9dab1cac193b8f). So none of the five sentences is true of them.
- **This is a live instance of FILTER-BIND's invalidator** (engine/FILTER-BIND-COERCIONS-PREREGISTRATION.md:376 @ fc78efa6b7bbc54f8306d7d2569e3b869050bc03 sha256:5449d5966f4399321a2caaece17136c92d25ac0bc3bf11cd4bb5a8a4f2511959). It sits outside the corpus, so that form's §8 item 9 (engine/FILTER-BIND-COERCIONS-PREREGISTRATION.md:377 @ fc78efa6b7bbc54f8306d7d2569e3b869050bc03 sha256:8009a213d29003c9f19acebb8cb9d9e5b74aa2435886e585ef14e03493870c81) is not tripped.

The routes:
- **(A) Reword T-C's fifth sentence (recommended).** One engine string becomes type-level. That is consistent with round 49, item 2's "refused by type", and the wire name `conversion_rounds` then reads as a type-level claim. Cost: it replaces the human's accepted T-C text (FILTER-BIND's statement at engine/FILTER-BIND-COERCIONS-PREREGISTRATION.md:350 @ fc78efa6b7bbc54f8306d7d2569e3b869050bc03 sha256:467ec3664422acd2e7adbbca616b19366a658e7256caa7b957aafcc69e0bb2d7 becomes historical for this sentence). The rounding statement also moves from a file value to the operand types.
- **(B) A sixth reason, exact.** It means a new wire value and a dated ADR-021 Note, because Note item 6 says "one of five fixed values" (docs/adr/ADR-021-row-filter-on-viewport-query.md:267 @ fc78efa6b7bbc54f8306d7d2569e3b869050bc03 sha256:c38ba12625effda137375a60b6395e7fcb0a25793ef3ee8f7a09e1dbac1de3d0). That is red-line text. It also needs a SKP-V0 §7.5 dated note (protocol/skp/SKP-V0.md:516-519 @ fc78efa6b7bbc54f8306d7d2569e3b869050bc03 sha256:2cc19b67758d18e8ad0cff97a6fe30e4d04f8a6a447ac96b87420202f68eaa39) and a full form. Not S3.
- **(C) Admit the constant-NULL shapes against a float, by a reading.** This changes admission. It needs a dated ADR-021 Note (red line) and reverses round 49, item 2's "Refuse by type". It also needs a probe of the plan's casts first: node 10's Amendment 1 found the binder does not treat a NULL-valued expression as a NULL literal.
- **(D) Accept as it stands.** No code. The gap is recorded in `sentence()`'s source comment and on the form, and FILTER-BIND's invalidator stays live.

### 3. The sentence words (W-1, P6 placeholder, replacing the human's accepted T-C wording; OPEN-2)

W-1 is my wording:

> [P6 placeholder] a conversion between a float type and an integer or decimal type, refused by type: values of the integer or decimal type can round in the float type

Each clause checked against the code at fc78efa6b7bbc54f8306d7d2569e3b869050bc03:
- **"between a float type and an integer or decimal type".** Only `check_pair` (engine/src/predicate.rs:2333 @ fc78efa6b7bbc54f8306d7d2569e3b869050bc03 sha256:0a5ac4dc3d6ff00b32f34843dcc0e50999449e94af9fa52d81624c8970d8704a) and the binary arithmetic arm (engine/src/predicate.rs:2018 @ fc78efa6b7bbc54f8306d7d2569e3b869050bc03 sha256:ca12f75994d472cde1fc8330a18ce6f941c8b01f0f69aa2b68ee488c297b965f) can reach engine/src/predicate.rs:2293 @ fc78efa6b7bbc54f8306d7d2569e3b869050bc03 sha256:be11179a0b0aa8c2e93b0dfee21d9fe60ed57fd4fed753f7e8f206b4779b575a. The unary, `/` and junction callers have a VARCHAR or BOOLEAN operand there, so items 1 and 2 fire first (engine/src/predicate.rs:1986 @ fc78efa6b7bbc54f8306d7d2569e3b869050bc03 sha256:481c5808f592369bb5d34c7bc0ddacb0af2de0380fb621e00b21c92979318d43, engine/src/predicate.rs:1944-1950 @ fc78efa6b7bbc54f8306d7d2569e3b869050bc03 sha256:e7dac33424bbd2ea64b66bc7e63ebe2d26cfb063d59f144f1a42a1398a0be4bb, engine/src/predicate.rs:2431-2441 @ fc78efa6b7bbc54f8306d7d2569e3b869050bc03 sha256:ec3bf158cb5e313504626884b06f4811abf73d6f6d8e6757c29736420b877565).
  - Admitted: integer with integer (engine/src/predicate.rs:2187-2189 @ fc78efa6b7bbc54f8306d7d2569e3b869050bc03 sha256:f610a8f9fa01c55af5fe747f91f36739652101e6bf1b2962b486e19aebacbb99, engine/src/predicate.rs:2078-2080 @ fc78efa6b7bbc54f8306d7d2569e3b869050bc03 sha256:c05e9b2e6b2e4922967ef273a3d860314e1d6f31a4536c1ff97005e11e79fdf6), and decimal with integer or decimal inside rule 4.
  - Refused at items 3 and 4: decimal with a wide integer, out of bounds, or decimal in arithmetic.
  - NULL is admitted in comparisons (engine/src/predicate.rs:2153 @ fc78efa6b7bbc54f8306d7d2569e3b869050bc03 sha256:abe16113605589a0f9808d6be891c1f4471065488363d45db98402a6f905b6ee).
  - What remains is a REAL/DOUBLE operand (column, result or double literal) beside an integer or decimal operand. **Holds**, except P-0's three shapes if the binder lets any of them through (note 4).
- **"refused by type".** The walk reads type, kind, the bound flag and the marked field, never a row value (engine/src/predicate.rs:1506-1525 @ fc78efa6b7bbc54f8306d7d2569e3b869050bc03 sha256:dbea3c17ed30ce03267ddbcf0f56e106b6d5e033462166d482a973aa0d30fb84). `literal_int_value` serves only result typing (engine/src/predicate.rs:1665-1681 @ fc78efa6b7bbc54f8306d7d2569e3b869050bc03 sha256:c468b73492d9e36324a240fc7fec202b59f87f87bb76be1575b10e77ab50a184). **Holds.**
- **"values of the integer or decimal type can round in the float type".**
  - The residual integer types are INTEGER and wider against REAL, and BIGINT and wider against DOUBLE or a double literal. Rules 5 and 7 admit the narrower ones. The decimal types carry a scale of 1 or more, from a decimal literal.
  - **Holds**, except for a double literal beside an INTEGER literal in `+`, `-` or `*` (note 4), where T-C's sentence is false too.
- **Ordinary use.** Every shape above can be typed in the shipped app. Its operator sees W-1 inside "refused: `>` over REAL and INTEGER expression: … (docs/01 principle 8)".
- **Whose wording.** T-C is the human's accepted text, and W-1 is a string the app shows. So it stays under P6, not the wording-blocks rule.

**W-2, the doc comment at engine/src/predicate.rs:1430-1432 @ fc78efa6b7bbc54f8306d7d2569e3b869050bc03 sha256:115b5d7df9feb6ff59618cee50a16bffbd080ea5ca114069a19d7c6140adf204.** These are my words, not the human's; the worker applies them:

> /// The `Display` sentence, never sent on the wire. The first four are copied byte for byte from
> /// `state/directives/B-1-RULINGS-AND-TYPED-TEXTS-2026-09-30.md` T-C by the script that wrote this
> /// file. The fifth, `ConversionRounds`'s, replaces T-C's under
> /// `engine/TYPE-WALK-RULE2-RESIDUAL-REASONS-PREREGISTRATION.md` and is a P6 placeholder: T-C's
> /// named a value read from the file, which is false where the integer or decimal side is a constant
> /// NULL (`f32 > NULL + 100000`). This one states the type pair alone. It is still false of a double
> /// literal beside an INTEGER literal in `+`, `-` or `*`, which the walk refuses although no INTEGER
> /// value rounds in DOUBLE.

Each clause checked:
- **"first four copied".** engine/src/predicate.rs:1435-1440 @ fc78efa6b7bbc54f8306d7d2569e3b869050bc03 sha256:6712d02d4ec17c1d28c742ce0b0443665a3b93c35b1f255fd6b03030d8fcc244 matches state/directives/B-1-RULINGS-AND-TYPED-TEXTS-2026-09-30.md:53-56 @ fc78efa6b7bbc54f8306d7d2569e3b869050bc03 sha256:faef62ebe7c60afe83cd12fb72e8614f9653ff66a46c5fb32c6a218e3b67ae4e (read side by side). **Holds.**
- **"named a value read from the file".** :57 there. **Holds.**
- **"false … constant NULL".** Note 1. **Holds.**
- **"still false of a double literal …".** Note 4, F-A. Holds by reading, not run.

### 4. Findings outside this piece

None is fixed here. Each is reading-only and unexecuted, and each is the custodian's to propose (OPEN-5).
- **F-A: literal-only arithmetic is refused although the walk's governing rules admit it.**
  - The arithmetic arm needs a non-literal float for rule 6 and a non-literal integer for rule 5 (engine/src/predicate.rs:2034-2050 @ fc78efa6b7bbc54f8306d7d2569e3b869050bc03 sha256:72bf4968eefdf00fd760400d126c05a50a57f033616d2f11b3a3299ecc19f879, engine/src/predicate.rs:2081-2097 @ fc78efa6b7bbc54f8306d7d2569e3b869050bc03 sha256:8977349032ae3fd7a7aac87f4a9ba5803ed764138760be13f59edffc06ffba09, engine/src/predicate.rs:2125-2131 @ fc78efa6b7bbc54f8306d7d2569e3b869050bc03 sha256:b3ac807174afd609824ca212e79eb25bf08884580fd3334f34da558f09d2f3df). So `1e3 + 5 > 0` and `0.5 + 1e3 > 0` refuse `conversion_rounds`.
  - Against that: FILTER-BIND §2.5(a) says "a double literal with an integer follows rule 5", and "integer" includes a literal within bounds (engine/FILTER-BIND-COERCIONS-PREREGISTRATION.md:92 @ fc78efa6b7bbc54f8306d7d2569e3b869050bc03 sha256:6e6190030e40aa5de33f47cf79c17e3ae016f3c0f1d6c1e2f15194c238123177, engine/FILTER-BIND-COERCIONS-PREREGISTRATION.md:71 @ fc78efa6b7bbc54f8306d7d2569e3b869050bc03 sha256:48b410ff2b03acacd57873f56adf97d18ed6e88a85f3a80d2a91b41bc18a27c2). The ADR admits two numeric literals within the bounds inside `+`, `-` and `*` (docs/adr/ADR-021-row-filter-on-viewport-query.md:261 @ fc78efa6b7bbc54f8306d7d2569e3b869050bc03 sha256:05b90e77fda0d041db47bc0c6b3fd503396a0bdbe7e907478e4529b2cd4dba4c, docs/adr/ADR-021-row-filter-on-viewport-query.md:263 @ fc78efa6b7bbc54f8306d7d2569e3b869050bc03 sha256:c0eafbcdfb26cf1039898501861dcd3a276125b1de126587439f9a5a084da7d3).
  - B-T1's probe set builds column-op-operand only, so nothing pins this.
  - The fix changes admission, so it needs its own node, probably under full gating. Once it lands, W-1 is true of every residual refusal.
- **F-B: in arithmetic, text or BOOLEAN beside NULL falls to the residual reason.**
  - Items 1 and 2 exclude a NULL partner (engine/src/predicate.rs:2260-2269 @ fc78efa6b7bbc54f8306d7d2569e3b869050bc03 sha256:6f093fc524b9adf6d242a4e61cfccadb3f6bd6269b296fbd2b3fe35a63d0e2d8), and arithmetic rule 2 is guarded by `is_numeric` (engine/src/predicate.rs:2071-2076 @ fc78efa6b7bbc54f8306d7d2569e3b869050bc03 sha256:9cb58ef11a5ad66b0f8a0cd035a6851670801b781170810331cace84c061dc6d). So `zone + NULL` would refuse `conversion_rounds`, against §2.5(a)'s text and boolean refusals (engine/FILTER-BIND-COERCIONS-PREREGISTRATION.md:94 @ fc78efa6b7bbc54f8306d7d2569e3b869050bc03 sha256:6f6d93241b375121f6bf84461ce8f21a1162369880fe37a3e772f303b7a0a5ee).
  - It shows only if the surrogate prepare accepts the shape, which P-0 decides.
- **F-C: the constant-NULL `conversion_can_fail` shapes.** `(NULL + NULL) - 0.5` and `-NULL - 0.5` (engine/TYPE-WALK-NULL-LITERAL-ARITHMETIC-PREREGISTRATION.md:362 @ fc78efa6b7bbc54f8306d7d2569e3b869050bc03 sha256:6590d99220fb79b8439f2332abb9429f3cb81660b68bd4b3833e6f0b4a09a33f, engine/TYPE-WALK-NULL-LITERAL-ARITHMETIC-PREREGISTRATION.md:385 @ fc78efa6b7bbc54f8306d7d2569e3b869050bc03 sha256:eb9f08fadb1bb0ac8b1c6ae1b0fa614843fac4566df2597abd0d764dc6715d03) carry "a conversion that can fail during the scan", which is false of a NULL. But the ADR states that class's reason itself, "because that conversion can fail" (docs/adr/ADR-021-row-filter-on-viewport-query.md:263 @ fc78efa6b7bbc54f8306d7d2569e3b869050bc03 sha256:c0eafbcdfb26cf1039898501861dcd3a276125b1de126587439f9a5a084da7d3). That is red-line text (OPEN-3).

### 5. ADR-021 and FILTER-BIND readings

- **ADR-021.** No ADR text and no class moves.
  - Under A, `conversion_rounds` is read as covering item 2's lead-sentence refusal of a float pair, not only bullet 5 of item 1. That moves O-3's one-to-one rationale, which is Fable's ruling, not ADR text.
  - The reading is the human's, under OPEN-1.
- **FILTER-BIND.** FILTER-BIND §2.6's "sentences are T-C's" (engine/FILTER-BIND-COERCIONS-PREREGISTRATION.md:350 @ fc78efa6b7bbc54f8306d7d2569e3b869050bc03 sha256:467ec3664422acd2e7adbbca616b19366a658e7256caa7b957aafcc69e0bb2d7) is a historical pin for the fifth sentence after this piece: the tree is authoritative once it merges. Its "(else conversion_rounds)" (engine/FILTER-BIND-COERCIONS-PREREGISTRATION.md:91 @ fc78efa6b7bbc54f8306d7d2569e3b869050bc03 sha256:0581d7f2824084cace061f62a4bd7914ccc8ef5fa96cf2fd500cef38fcbbf1d1) is unchanged.

### 6. Tests and the mutation

- **T1 is the only test the claim needs.** B-T3 asserts reasons, not sentences (engine/tests/filter_type_admission.rs:469-555 @ fc78efa6b7bbc54f8306d7d2569e3b869050bc03 sha256:72f26b6e0b407ca35e31650e3f50ec068f2b99fcbb912c7204570477e35af105). Its rows, B-T1's A1 and A2 pins (engine/tests/filter_type_admission.rs:1161 @ fc78efa6b7bbc54f8306d7d2569e3b869050bc03 sha256:2719681110a9d441b2b2bd78495ea743eb256482479ea0464ef2ddd4aaf10da3, engine/tests/filter_type_admission.rs:1171 @ fc78efa6b7bbc54f8306d7d2569e3b869050bc03 sha256:41c92d8f7406aeab154fb597b200d06564c765d7663deaf31769c87db5384712) and every count are untouched.
- **M-1 is predicted to fail T1 alone.** No other string in the tree carries the residual sentence: a repository search for "can round" over engine, kernel, the shell's src, protocol and renderer finds only engine/src/predicate.rs:1442 @ fc78efa6b7bbc54f8306d7d2569e3b869050bc03 sha256:6173602ecf11bb65636abd51b1aeacad368d840caf6656b1d092cde479837cd9. Kernel B-T6, FX-4 and shell B-T9 pin `zone = 1`.
- **P-0 runs before code**, so that W-1's first clause is checked against F-B.

### 7. Size

- Estimate: 6 lines in predicate.rs (the arm and W-2), and about 85 in the test file (eleven table entries, the body and a `RECORDED MUTATION:` line). That is about 95 in 2 files, under the declared budget of 130 and §21c's 150 lines and 8 files.
- An overrun is class 6, with the Scope line unedited (AUTONOMY.md:345 @ fc78efa6b7bbc54f8306d7d2569e3b869050bc03 sha256:ac3b30f25e10d5a8efd8202a960e95a02e00672d5d5b9faf9226c8216b2456c3).
- §21c's fourth bound, no new user-visible behaviour (AUTONOMY.md:350-351 @ fc78efa6b7bbc54f8306d7d2569e3b869050bc03 sha256:ab244b928ccaaaddf7cee273363bc2481ad0e53cd6aa97d1e57fe8f7eefcd333), is met through §36's P6 clause, as entry 2 was (OPEN-4).
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

## The custodian's settlement (class 1, before any code)

- **The human's ruling of 2026-10-26** (`state/directives/2026-10-26-clicks-260-261-244-r2-241-o1-answers-pb-draft-b-6d-260-lines-5b-8a-8b-rulings.md`, line 32), referenced and not restated:
  - **OPEN-1: (A).** The route as drafted: T-C's fifth sentence reworded, engine only.
  - **OPEN-2:** the placeholder lands now and is worded at P6 with the others.
  - **OPEN-3:** F-C stays out of this piece.
  - **OPEN-4: (A).**
  - **OPEN-5:** F-A is its own node, `literal-only-float-integer-arithmetic-refused` (S3, after this piece, in PLAN); F-B waits on P-0.
- **The read commit and main:** `git diff --name-only fc78efa6 d84171b0 -- engine/src/predicate.rs engine/tests/filter_type_admission.rs` is empty, so the two Scope files read at main d84171b0 as they did at fc78efa6. Every cite in this form is pinned at fc78efa6 and read at its pin; the forms the draft cites at their old paths are mapped in `governance/MOVED.tsv`, so none is re-pointed.
- **Rule (00)** was checked at main d84171b0 by `git diff --name-only origin/main...<branch>` over the open PRs (#273, #272, #271) and the branches in flight (`cut/b2-piece-1c-save-and-reopen`, `cut/port-2-macos-l1-and-app-dirs`, `cut/b1-shell-half-pr-c`): none touches the two Scope files or this form. It is checked again at dispatch, which follows the filler queue's order (one filler in flight under §36).

## Amendments (opens empty; append-only)

### Amendment 1 — 2026-11-04 — the custodian's record (class 1), written after P-0's run was seen; references and hashes only

- **P-0 ran** on the branch `cut/type-walk-rule2-residual-reasons` at main 66fb3d8d2dfb7cf13d46f00e748677bacc172b96, with Cargo.lock's `duckdb` and `libduckdb-sys` entries at 1.10505.0. The worker's report is `state/consults/2026-11-04-type-walk-rule2-residual-reasons-worker-report.md` (its hand-back's sha256 4ba399601fe6363529a582e0628965568cb7e91c6fd96532e54f1368a65a58ce).
  - `zone + NULL > 0` and `flag + NULL > 0`: `RejectedByBinder`, as predicted.
  - `'1' + NULL > 0`: `TypeNotAdmitted`, construct `+`, operand types `VARCHAR literal` and `NULL literal`, reason `ConversionRounds`.
- **The Tests+mutation line's stop is met.** No code was written, and nothing was committed or pushed; the branch stands at its base.
- **OPEN-5's F-B, the custodian's after P-0** (the human's ruling of 2026-10-26: F-B waits on P-0): proposed as its own node in the filler queue's proposed additions, not joined here as class 9. Joining it would change that shape's wire `reason`, which the Change line excludes: a scope change to an item the human has ruled, a red line.
- **The piece is held at its stop.** Whether it proceeds, and how, is the human's on return. Entry 8c, placed after 8b, waits with it; the filler slot takes the next filler by the queue order.
