# engine: literal-only `+`, `-`, `*` with a double literal beside an integer or decimal literal is admitted, as ADR-021's Note 2026-09-30 already states — full preregistration

*Committed before any code. Append-only once committed; an amendment written after any outcome has been seen says so in its first line. PLAN node literal-only-float-integer-arithmetic-refused, the filler queue's entry 8c (S3), the full form with both gates on the human's ruling of 2026-11-05 (evening), item 1 (`state/directives/2026-11-05-8c-full-form-nine-s2-placed-u12-slot-2-u1-reproducer-adr-notes-words-e2e-readme-words-8b-d3.md`). The form below is lead-data's draft (`state/consults/2026-11-05-literal-only-float-integer-arithmetic-refused-full-form-lead-data-draft.md`, read only at main 8b9193a1; extracted sha256 a0e6f0e50daec5e733cbb9498c4822abdc6e34966d3bd5e051dfcd5bbed33484), carried byte for byte from its title through its section 10 heading with these changes, all the custodian's: each cite the draft writes `path:line @ 8b9193a1…` is expanded by script to `path:line @ <commit> sha256:<the lines with their LFs>` (59 pins; 0 by a file name that resolves to one tracked path at that commit; 0 by a file name that resolves to more than one, kept as written; bare line numbers kept as written); this lead line added; the custodian's settlement added before section 10. The draft's opening lines, its size table, its changes from its outline, its OPEN line and what it could not settle stay in the filed draft. Form path: `governance/forms/engine/LITERAL-ONLY-FLOAT-INTEGER-ARITHMETIC-REFUSED-PREREGISTRATION.md`. The custodian keeps the PLAN node on main.*

## Header

- **Title.** In `+`, `-` and `*`, the type walk admits a DOUBLE literal beside an integer or decimal literal within the bounds, and types the result DOUBLE. Every other refusal keeps its code, reason and operand types.
- **Authority:**
  - PLAN node `literal-only-float-integer-arithmetic-refused` (governance/PLAN.yaml:4193-4209 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a sha256:bb68d411ae044d06d1e5d14e27947c7a1ca05f40cafd6c89c7c2c9d3f313ad28), filler entry 8c, S3 (state/FILLER-QUEUE.md:27 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a sha256:c96499cfda5831f544db6f69521075735316de2623f32a577163f34352976c89).
  - **The route.** OPEN-1 (A) is the human's ruling of 2026-11-05 (evening), item 1 (state/directives/2026-11-05-8c-full-form-nine-s2-placed-u12-slot-2-u1-reproducer-adr-notes-words-e2e-readme-words-8b-d3.md:8 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a sha256:69a7e63a2bdaaef7b2b72b860b70b3dd33ab14bce8227a481b36be829c0129f2): the full form, both gates, in the filler slot, as entry 9 had (state/FILLER-QUEUE.md:32 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a sha256:212de792ae8f887f4a041a0fa7b057c1abbd13894bf40fd3dc9daa345a7440b5); no ADR-021 text; it starts after #282, which is merged. The ruling sets aside §36's five-line condition for this piece (governance/AUTONOMY.md:692 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a sha256:1135b89c01d0e676bce0bc42a4d6710af445fa0ae95ed12ef6ca0fef7a4d4e84). This is my reading of the ruling, not its words.
  - **Placement.** Placed S3 after 8b by the human's ruling of 2026-10-26 (state/directives/2026-10-26-clicks-260-261-244-r2-241-o1-answers-pb-draft-b-6d-260-lines-5b-8a-8b-rulings.md:32 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a sha256:cf037a1ed6aefffca9539781f2cffaf2d80a64fc4d09e53b1730707928c4aa58). It follows 8b by the ruling of 2026-11-05, item 3 (state/directives/2026-11-05-platform-runs-filed-c1-governance-next-fixtures-kernel-node-8b-route-a-f-b-after-8c.md:10 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a sha256:17f4de6d0e9c7105f6c149e4130021d7f8e0183917895c9d59f3342ae9200e6f).
  - **Origin.** Proposed as F-A by 8b's architect draft (state/consults/2026-10-26-type-walk-rule2-residual-reasons-five-line-form-architect-draft.md:93-97 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a sha256:18d9ebb43b0a7cfd42250d06f26c4840d4b6225339611609e1e36a1bb8d24891; its OPEN-5 at :151).
  - **The human's rulings on gate rounds of 2026-11-05, Part 1, items 1 to 9**, by reference (state/directives/2026-11-05-main-architect-gate-rounds-part-1-rulings-review-packet-design-part-3-additions.md:28-64 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a sha256:b7b9954b95c6a23808cc8a2fbacb8b6157335e23da53ccda20f4a35ba8e05e8a). Item 1 (:28-32) governs §2.3. Item 7 (:58-62) governs §4.
  - **OPEN-2 to OPEN-5 settled.** Each takes the drafter's recommendation under the human's direction of 2026-10-31, item 4 (state/directives/2026-10-31-away-until-11-04-clicks-from-the-app-270-size-o0-file-open-items-take-recommendation.md:14 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a sha256:30b606119103bd1340cb6c72f7508d5780556097b85311fefb96f666ea5c6b38). That direction is held until 2026-11-09 (state/directives/2026-11-03-away-until-11-09-276-open-1-seven-clauses-open-4-c-placed-sitting-wording-leaves-slot-cloud-credit.md:6 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a sha256:5c2e1399389aad0106932f484fda92f351ad5394ac421a6988115716a0452e83). PLAN records them as taken 2026-11-05 (governance/PLAN.yaml:4208 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a sha256:33aebd39d944693b7abcd0a7f2765eb3d64ef7fd0bd37cec5142e288f99731e2). The human reviews each on return and may reverse it; a reversal is recorded, never edited in. Each is taken on 2026-11-05 under that direction:
    - **OPEN-2 (i):** every integer literal within the bounds is admitted beside a DOUBLE literal, not only literals of 32 bits or fewer;
    - **OPEN-3 (a):** a rule-2 result that counts as a decimal literal stays refused beside a DOUBLE literal in arithmetic;
    - **OPEN-4 (a):** this form joins `engine/README.md`'s preregistration list in this PR;
    - **OPEN-5 (a):** the stale doc of `admitted_arithmetic_result` is rewritten in this piece, after the code.
  - **The reuse index:** no prior art found on either search, a miss noted here. The custodian's run in the read-only reuse clone at 89bbac3738dbb46d47988e55a7c0f0d4f9fe4c5c, byte for byte from the brief:

```text
$ node tools/reuse.mjs literal float integer arithmetic   (exit 1)
No prior art recorded for "literal float integer arithmetic". Research it before planning an implementation.
$ node tools/reuse.mjs numeric literal coercion type walk   (exit 1)
No prior art recorded for "numeric literal coercion type walk". Research it before planning an implementation.
```

- **What it continues:**
  - `governance/forms/engine/FILTER-BIND-COERCIONS-PREREGISTRATION.md` (§2.3, §2.5(a), §2.6, §7);
  - `governance/forms/engine/TYPE-WALK-NULL-LITERAL-ARITHMETIC-PREREGISTRATION.md` (node 10, rule 2's results);
  - `governance/forms/engine/TYPE-WALK-RULE2-RESIDUAL-REASONS-PREREGISTRATION.md` (8b; its notes 3 and 4 name this shape as F-A).
  - Each keeps its text. None is edited.
- **Drafted by** lead-data, on the custodian's brief, read only at main 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a, from its own draft's section 8 outline (state/consults/2026-11-05-literal-only-float-integer-arithmetic-refused-five-line-form-lead-data-draft.md:199-242 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a sha256:4da45b751d9688306009c6f56008238975f3a88d6c8210b4515abff2eefbd759).
  - Every restatement of a source in this form is lead-data's paraphrase. Nothing is marked verbatim except the reuse block above.
  - Self-references are by section only.
- **Committed before any code.** Append-only once committed. An amendment written after any outcome has been seen says so in its first line and names what it touches or invalidates.
- **Branch.** `cut/literal-only-float-integer-arithmetic-refused`, cut from main at dispatch, on its own checkout and its own new cargo target. It merges by merge commit, never a squash, so that the `RECORDED MUTATION:` commits stay reachable from main.

## §0 Disclosure

1. **Evidence, not Authority:** the reviewer's throwaway probe at ae4d94d4, the head of #282 before its words commit, now reachable on main through 540b4afd:
   - `1e3 + 5 > 0` was refused `TypeNotAdmitted`, construct `+`, operand types DOUBLE literal and INTEGER literal, reason `ConversionRounds` (state/consults/gates/2026-11-05-type-walk-rule2-residual-reasons-gate1-reviewer.md:68 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a sha256:abf9697be859ae4557f53a40ab42c3b6d3ea4be974a708ef44f8cc90c589f9c5);
   - `0.5 + 1e3 > 0` (a DECIMAL(2,1) literal beside a DOUBLE literal) was refused with the same reason (state/consults/gates/2026-11-05-type-walk-rule2-residual-reasons-gate1-reviewer.md:74 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a sha256:0e72166fa9036f97f8fe02a9845a240b41a62504db80d2711a84a2566b6567e0).
   - Both are `TypeNotAdmitted`, so both passed the surrogate prepare (governance/forms/engine/FILTER-BIND-COERCIONS-PREREGISTRATION.md:61 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a sha256:e325c20c1c84463250fb2f0feadc36a2832f898a2da1a148621b19801dc603c1). The binder accepts both shapes.
2. **Everything else is reading at 8b9193a1, never run.** That covers the base outcomes of every other row in §3, every result type, and the two-DOUBLE-literal row.
3. **DuckDB.** Cargo.lock's `duckdb` and `libduckdb-sys` are 1.10505.0 (governance/forms/engine/TYPE-WALK-RULE2-RESIDUAL-REASONS-PREREGISTRATION.md:173 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a sha256:f3b2ba16c690ac18c358fba68f463c341e5bf3bfeaf2fec8dc0c92dd0353d545), which the forms call DuckDB v1.5.5. Every statement here about the binder is at that version, or is a labelled hypothesis.
4. **Hypothesis H-NEG** (discriminator: P-0, record only). DuckDB's parser folds a negated numeric literal into a constant, so `-1e3` and `-5` reach the walk as literals. If it does not, the walk sees them as unary `-` expressions, and the base may already admit `-1e3 + 5 > 0` and `1e3 + -5 > 0` (rules 6 and 5). Either way, this form claims nothing about negated operands (§1).
5. **No fixture-drive confound.** Nothing is measured, and the 5 GB fixture is not read.

## §1 What this preregistration may and may not claim

- **May claim, once §4 is green on CI's Windows and Linux L1 entries** (.github/workflows/product-ci-rust.yml:194-197 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a sha256:d06209e30a3082d5514bd9d4b3873a329f21324eab4e0c444d370e1c2c377e27, :234), at libduckdb-sys 1.10505.0. For each of T1's eight predicates over FX-1:
  - `AdmittedPredicate::admit` admits it;
  - the walk types its arithmetic node DOUBLE, seen through the public refusal of `i64 = (<a>)`;
  - the binder types the same node DOUBLE (`typeof`);
  - its stream delivers exactly the predicted ids and ends without error.
  - T2's five refusals keep their construct, reason and operand types.
- **May not claim:**
  - any performance figure or docs/08 row;
  - any shape not in §3: negated operands (H-NEG), nested literal-only arithmetic, `/` (already admitted for any numeric operands, docs/adr/ADR-021-row-filter-on-viewport-query.md:264 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a sha256:3e8658e4dc5b79e4c06801728e2865140774c1afa79e3949ec3da77f1ca99630), and comparisons of the new DOUBLE results against columns;
  - any other duckdb crate or DuckDB version;
  - macOS;
  - that W-1 is now true of every `conversion_rounds` refusal. The text-beside-NULL shape and the architect's shapes (a) to (c) stay outside it. They belong to F-B (governance/PLAN.yaml:4210-4225 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a sha256:c710c3338ffc6cb053e90d28fd169612d96a471de77bdcdb3ace1806e3d257fb; state/consults/gates/2026-11-05-type-walk-rule2-residual-reasons-gate1-architect.md:39-44 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a sha256:cbfa50c3bf89d964745ed4f6afe0f01ebe2def814c419f67067f13e7059c1ca9). None of those shapes has a float side (:44), so this piece neither reaches nor moves them.
- **ADR readings, none amended:**
  - ADR-021: no status line, Note or amendment, by the human's ruling (item 1).
    - The admitted pairs are those of the Note 2026-09-30, item 2 (docs/adr/ADR-021-row-filter-on-viewport-query.md:254-263 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a sha256:6111b4c65e9a5440ed726f280049ef7ed408de77ee8a5a33e60a9053706551d5): its two-literals bullet (:261) under its arithmetic sentence (:263).
    - The exception at :263 names a decimal literal beside an integer or a decimal, never beside a double.
    - The Note 2026-10-03, item 2 (docs/adr/ADR-021-row-filter-on-viewport-query.md:274 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a sha256:38266c5affad4b76a79899edd251680e52edfeed29d45ee40db525c5ed319a76) keeps a counted rule-2 result out of this arm (OPEN-3 (a)).
    - The twelve codes and five reason values stand (:267).
  - ADR-010 rule 6: no constant is added or changed.
  - ADR-006: admission is a pure check, and no undo class is touched.
  - ADR-018: no cancellation path is touched.
- **FILTER-BIND reading** (my reading; the form is immutable and is not edited):
  - §2.5(a) applies §2.3's rules pairwise (governance/forms/engine/FILTER-BIND-COERCIONS-PREREGISTRATION.md:89 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a sha256:1a7ca8d659a88dcba640d681b2846a7dc43cfaef6d3ac2504315526fc14f63ba).
  - §2.3 counts an integer literal within the bounds as an integer (:71).
  - Rule 6's second clause admits a double literal against an integer or decimal literal within the bounds (:77), as comparison rule 6(ii) already does in code (engine/src/predicate.rs:2227-2232 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a sha256:8299470eee266b9d1fcabc64e92d805d8d9fa2b1df19f7ce2cc5aa4ec0eb60f2).
  - §2.5(a)'s double-literal bullet (:92), read alone, would bound the integer to 32 bits. OPEN-2 (i) reads it under :77 and the ADR's :261. That is why a BIGINT or HUGEINT literal within the bounds is admitted.
- **Wire:** no SKP code, field, reason value or literal, and nothing under `protocol/`. `filter_type_not_admitted` is sent for fewer predicates, and its shape is unchanged.
- **Strings:** none added or changed. W-1 (engine/src/predicate.rs:1448-1451 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a sha256:86ed8424b5334b84e605e3a84e0c9b935959cd7af7cfd7ea4639eaa65a3778f4) stays a P6 placeholder. It no longer reaches the shapes in §3.
- **Portability:** not an OS-dependent feature, so no R3 item.

## §2 The change, stated before it is applied (engine only)

### 2.1 The rule

This is the table of outcomes, a prediction. It is not a sentence for the code.

| Pair in `+`, `-`, `*` (both operands of kind literal) | Governing text | The walk at 8b9193a1 (reading) | After this piece |
|---|---|---|---|
| DOUBLE literal and an integer literal within the bounds (INTEGER, BIGINT, HUGEINT: at most 20 digits) | ADR :258, :261, :263; FILTER-BIND :77, :92 under :89 | Refused, `conversion_rounds`. Rule 6 needs a non-literal float (engine/src/predicate.rs:2042-2044 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a sha256:dcdb5f1cb0ddd30c0a1b87d2bac10d5fa563cd803c18951fc1bd5542caac6e8f, :2092-2105), and rule 5 needs a non-literal integer (:2052-2058, :2133-2139). | Admitted, result DOUBLE |
| DOUBLE literal and a decimal literal within the bounds (scale at most 18, at most 20 integer digits) | ADR :261, :263 (its exception does not name a double); FILTER-BIND :77 | Refused, `conversion_rounds`: `is_decimal_arithmetic_pair` is false for a DOUBLE partner (engine/src/predicate.rs:2146-2150 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a sha256:ce2f3b79d4369ce5d660d43f2be1509444e5c58a08e873a85730ab9de25a2422) | Admitted, result DOUBLE |
| Two DOUBLE literals | ADR :255; FILTER-BIND rule 1 (:72) | Admitted by arithmetic rule 1, which reads type and not kind (engine/src/predicate.rs:2066-2068 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a sha256:e2be79eda0e71c5d831fb6054d834b2b11bea73e9a497317f62766a57218e2df) | Unchanged; T1 pins it |

- **The bounds** are the walk's existing flags (engine/src/predicate.rs:1778-1817 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a sha256:022069cc3ee70508f8d0641d0b3d087bf7e78a59bf982e6494fafc6518508cb2). A DOUBLE literal is always within bounds (:1509-1512, :1811-1817).
  - Note for the architect, not an OPEN item: FILTER-BIND §2.2 bounds integer and decimal literals only (governance/forms/engine/FILTER-BIND-COERCIONS-PREREGISTRATION.md:67 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a sha256:6b88dffb7e9048a3fddfae4f185fc035564417770d1f00a71ff72a7b8977abdd), while the ADR's bound bullet speaks of any numeric literal (docs/adr/ADR-021-row-filter-on-viewport-query.md:251 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a sha256:b534cbc9e6c081a3656794cc6429b55f77695ba2c5f37f68c9697b6fafe50c5a). Comparison rule 6(ii) already relies on the same reading.
- **The only conversions** these pairs need are literal to DOUBLE, which FILTER-BIND §7 declares for literals (governance/forms/engine/FILTER-BIND-COERCIONS-PREREGISTRATION.md:273 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a sha256:4aefe80fd76084493db65bfd424a0b785a68232eab56acef3442e692f559c49c).
- **The code change:** one admitting clause in `admitted_arithmetic_result` (engine/src/predicate.rs:2040-2141 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a sha256:efd3c45a893f8a11727f2ea034f376f8d74e4837d8850def2b8c9e949e9a3c5a), for both operand orders.
  - It tests the partner's kind is literal, never `counts_as_decimal_literal`.
  - It tests the partner's within-bounds flag.
  - It returns DOUBLE.
  - Its placement among the rules is the worker's. No other rule reaches these pairs, so placement does not change any result type.

### 2.2 Stays refused, each pinned in T2

- A literal beyond the bounds beside a DOUBLE literal. It keeps `literal_out_of_bounds` (engine/src/predicate.rs:2278-2280 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a sha256:27e8e23ff74d357cbc8f0f966507f3201605ead1a15cb8a417053166ddb54ad3).
- A DOUBLE literal beside a column or expression of BIGINT or wider. It keeps `conversion_rounds`, because rule 5's 32-bit bound stands.
- A DOUBLE literal beside a rule-2 result that counts as a decimal literal. It keeps `conversion_rounds` (OPEN-3 (a); ADR :274).
- A decimal literal beside an integer literal. It keeps `conversion_can_fail` (ADR :263; engine/src/predicate.rs:2298-2300 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a sha256:fdb6bd2ccdb6bdb38aed9658ffe180404e3e0ac552e5d736f4399fdd968df209).

### 2.3 Sentences about behaviour: where they go, not their words (Part 1, item 1)

The worker writes each sentence from the built code. Both gates check it clause by clause against that code. None is the human's wording, and none is drafted here.

1. **`TypeRefusalReason::sentence`'s doc** (engine/src/predicate.rs:1430-1439 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a sha256:835bf098945e87e0ceec42c06df5b42e272ed5ed60c563e3741537301f174659). Its last clause (:1438-1439) names this piece's shape as one W-1 is still false of. After the code, that clause is false. The sentence must cover only the cases that W-1 is still false of at the head, or name none. W-1's own string (:1448-1451) does not change.
2. **`admitted_arithmetic_result`'s doc** (engine/src/predicate.rs:2036-2039 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a sha256:a708a468908bcc40611273b6dcfbf5434c077209a49420928f8fe352178eaab1). It says no branch classifies a `Decimal` operand as admitted. That is already false at the base, because rule 2 admits NULL beside a decimal (:2079-2084), and the new clause makes it more false (OPEN-5 (a)). The doc must cover:
   - which pairs are refused outright (O-5's decimal pairs);
   - which branches can admit a `Decimal` operand.
3. **The new clause's comment.** It must cover:
   - the pairs it admits and the result type;
   - the bound test;
   - that a counted rule-2 result is not admitted here (Note 2026-10-03, item 2);
   - its governing cites, by path and section.
4. **T1's and T2's doc comments,** each with its `RECORDED MUTATION:` line.
5. **The owner's index** (OPEN-4 (a)): the form's path joins the preregistration list (engine/README.md:557 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a sha256:3526b3f7cf585ef49e917ae07f78250740ac2ae2f423a89fb165cedb7f1b3ccc), and the Last verified line (:537) names the commit. These are pointers only, under the index rule at :535.

No sentence goes into an ADR, SKP-V0, KNOWN-LIMITATIONS.md or the shell.

### 2.4 Not changed

- Every other arm and rule of the walk.
- `determine_reason`'s precedence (engine/src/predicate.rs:2263-2302 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a sha256:c30596d67a9ce73d3765ded7b7eb03fca0e6e145a96b5d74c5af9767b1f4ed64).
- `is_admitted_comparison`, `type_of_division` and `check_pair` (whose `is_arithmetic` branch has no `true` caller: state/consults/gates/2026-11-05-type-walk-rule2-residual-reasons-gate1-architect.md:37 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a sha256:4b9d93d1377f338b11ddba045c15f6287403fa068b05c4fe3f0cefb3c98caef9).
- `Typed`'s fields, `literal_typed`, the five reasons and their wire values (engine/src/predicate.rs:1396-1428 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a sha256:fa9649e0008d73fad9f19a0693e10ac694ad2493ebba92996b132d0e70617e4d), `FilterError`'s Display, and W-1.
- `MAX_INTEGER_LITERAL_DIGITS` and `MAX_DECIMAL_LITERAL_SCALE`.
- No `pub` item. No change to `engine/src/lib.rs`, Cargo.toml or Cargo.lock.
- Nothing under `kernel/`, `protocol/`, `frontends/` or `renderer/`. KNOWN-LIMITATIONS.md: no item covers these shapes, and none is added.

## §3 Fixtures and corpus, outcomes predicted before P-0 and before code

**FX-1 is unchanged.** It has 13 features, a fixed seed, and is written once through a `OnceLock` (engine/tests/filter_type_admission.rs:29-32 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a sha256:7ff86e6cf84ca85a9bf5f686aa958d5a03b5e472210beb01f3cd90c55d375ed5, :53-70). Its sha256 is checked at the end of each test (:73-79). "All" means FX-1's 13 ids.

**T1 (new):**

| Row | Predicate (arithmetic node `<a>`) | At the base (P-0) | At the head: stream | Walk type, via `i64 = (<a>)` | `typeof(<a>)` |
|---|---|---|---|---|---|
| 1 | `1e3 + 5 > 0` | TNA `+`, DOUBLE literal / INTEGER literal, `ConversionRounds` (observed, §0) | all | refused TNA `=`, BIGINT / DOUBLE expression, `ConversionRounds` | DOUBLE |
| 2 | `1e3 - 5 < 0` | TNA `-`, DOUBLE literal / INTEGER literal, `ConversionRounds` | none | as row 1 | DOUBLE |
| 3 | `5 * 1e3 > 0` | TNA `*`, INTEGER literal / DOUBLE literal, `ConversionRounds` | all | as row 1 | DOUBLE |
| 4 | `1e3 + 3000000000 > 0` | TNA `+`, DOUBLE literal / BIGINT literal, `ConversionRounds` | all | as row 1 | DOUBLE |
| 5 | `1e3 - 99999999999999999999 < 0` | TNA `-`, DOUBLE literal / HUGEINT literal, `ConversionRounds` | all | as row 1 | DOUBLE |
| 6 | `0.5 + 1e3 > 0` | TNA `+`, DECIMAL(2,1) literal / DOUBLE literal, `ConversionRounds` (observed, §0) | all | as row 1 | DOUBLE |
| 7 | `1e3 * 0.000000000000000001 < 0` | TNA `*`, DOUBLE literal / a scale-18 DECIMAL literal (width a hypothesis), `ConversionRounds` | none | as row 1 | DOUBLE |
| 8 | `1e3 + 1e3 > 0` | admitted | all | as row 1 | DOUBLE |

- **Hypotheses.** Every cell not marked observed is a hypothesis, decided by P-0 for the base and by T1 for the head.
- **Why `i64`:** a BIGINT column against a DOUBLE expression is refused by every comparison rule (engine/src/predicate.rs:2155-2259 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a sha256:e57e38c2af4258f44c4ac9dd5d17d65a1f20e6db4725adf0a1f8021e07b53833). A REAL, INTEGER or DECIMAL result type would give a different outcome or different operand types, so the assertion pins the walk's type.

**T2 (new); every row holds at the base and at the head:**

| Row | Predicate | Refusal |
|---|---|---|
| 1 | `1e3 + 100000000000000000000 > 0` | TNA `+`, `LiteralOutOfBounds`; operand types DOUBLE literal / HUGEINT literal (the second a hypothesis) |
| 2 | `1e3 + 0.0000000000000000001 > 0` | TNA `+`, `LiteralOutOfBounds`; operand types DOUBLE literal / a scale-19 DECIMAL literal (width a hypothesis) |
| 3 | `1e3 + i64 > 0` | TNA `+`, DOUBLE literal / BIGINT, `ConversionRounds` |
| 4 | `1e3 + (NULL + 0.5) > 0` | TNA `+`, DOUBLE literal / DECIMAL(2,1) expression, `ConversionRounds` |
| 5 | `0.5 + 5 > 0` | TNA `+`, DECIMAL(2,1) literal / INTEGER literal, `ConversionCanFail` |

DECIMAL(2,1) for `0.5` is observed at 8b's head: 8b's T1 asserts `(NULL - 0.5) + f32 > 0` refused with DECIMAL(2,1) expression (engine/tests/filter_type_admission.rs:588-592 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a sha256:21618149862868513515169e7f176ba969a9892da0e0e25bf89fb85c680ff2b5).

**P-0 record-only rows (H-NEG; no test, no stop):** `-1e3 + 5 > 0` and `1e3 + -5 > 0`. The prediction is that each is refused at the base as row 1 is. If either is admitted at the base, that is recorded and nothing more.

## §4 Tests, and the mutation per new test

**P-0, before any code** (a throwaway test, never committed, run by the worker at the branch base on its own target, under a shared hold):
- **What runs:**
  - T1's eight rows, T2's five and the two H-NEG rows, each once through `AdmittedPredicate::admit` on FX-1;
  - for T1's eight nodes, `SELECT typeof(<a>)` on `configured_connection()`;
  - for T1's eight predicates, the ids DuckDB returns over FX-1 on that connection, an oracle independent of the engine.
- **What is recorded:** each outcome in full (code, construct, operand types, reason), DuckDB's version, and the 40-hex commit.
- **Stops,** each sent to the custodian, with no code written:
  - a T1 row 1 to 7 at the base with any outcome but TNA and `ConversionRounds` (for example `RejectedByBinder`, which would mean the binder refuses the shape);
  - T1 row 8 refused;
  - any `typeof` other than DOUBLE;
  - a DuckDB id set that differs from §3's predicted set;
  - any T2 row whose construct or reason differs from §3.
- **Not stops; each recorded in a class 1 amendment before code:**
  - T2 row 4 is `RejectedByBinder`: the row is dropped, and M-2 becomes M-2';
  - `typeof` is unusable on the configured connection: T1 (v) becomes the `value.type` of the folded constant in `json_serialize_plan` of `SELECT <a>`.
- **Not stops; recorded in the worker's report and asserted as recorded:** an operand-type name for T2 row 1 or 2 that differs from the hypothesis. It is a class 2 deviation in the closing amendment, and the prediction is not edited.

**T1** (new, `engine/tests/filter_type_admission.rs`; proposed name `literal_only_arithmetic_with_a_double_literal_is_admitted_typed_double_and_streams`). It goes through the real producer and the real stream (Part 1, item 7). For each row it asserts:
- (i) `admit` returns `Ok`;
- (ii) `drain_ids` (engine/tests/filter_type_admission.rs:87-116 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a sha256:7541fb42971f29a5b59b83c7d674f6106528876a37ace58a8cd18c1973696c2b) succeeds and equals the predicted set;
- (iii) `i64 = (<a>)` is refused in its real shape, `PredicateAdmitError::Filter(FilterError::TypeNotAdmitted { .. })`, with construct `=`, operand types BIGINT and DOUBLE expression, and `ConversionRounds`;
- (iv) `typeof(<a>)` is DOUBLE.
- Then FX-1's sha256.

**M-1:** the new clause removed (the arm restored to its base). Predicted to fail exactly T1 in a run of the whole binary, by name at row 1's admission (expected admitted, got TNA `+`).

**T2** (new, same file; proposed name `literal_only_arithmetic_outside_the_double_literal_pairs_keeps_its_refusal`). Every row goes through the real `admit`. It asserts the real `TypeNotAdmitted` shape with construct, reason and operand types per §3, then FX-1's sha256.

**M-2:** the new clause also accepts a partner that counts as a decimal literal. Predicted to fail exactly T2, by name at row 4 (expected TNA, got admitted).
- **M-2',** only if P-0 drops row 4: the clause's bound test removed. Predicted to fail T2 by name at row 1.

**How each mutation is observed:** applied alone, in a debug build on the branch's code commit; the named test run; its failure recorded by name, with the 40-hex commit, in a `RECORDED MUTATION:` doc line; then reverted. A `verify-mutation` run is not an observation (docs/PREREGISTRATION-TEMPLATE.md:172 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a sha256:316062ef43090b93187b8410a97bdd9d3424fa747dd09f4cafe84906622e88c2).

**Determinism and CI:**
- No sleep, retry or timeout in either test.
- Neither test is `#[ignore]` or `cfg`-gated.
- Both run in `cargo test --workspace --locked` on both L1 entries (.github/workflows/product-ci-rust.yml:194-197 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a sha256:d06209e30a3082d5514bd9d4b3873a329f21324eab4e0c444d370e1c2c377e27, :234).

**Existing tests that stay green, unloosened:**
- B-T3 (engine/tests/filter_type_admission.rs:469-555 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a sha256:72f26b6e0b407ca35e31650e3f50ec068f2b99fcbb912c7204570477e35af105);
- 8b's T1 (:557-630);
- B-T2 (:125-147);
- B-T1 (:1318-1441);
- B-T1b (engine/src/predicate.rs:3228-3304 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a sha256:3f88e8576f32733fe9e2fab54e67845c91a59aaaa0eb5a55a81ea7b1c8ad651b);
- `filter_admission_property_campaign`, `b1_an_implicit_coercion_is_admitted_and_fails_in_the_scan_carrying_file_data` and `a_join_of_clauses_each_admitted_alone_returns_their_intersection_and_its_subsets_admit` (engine/tests/admission_property_campaign.rs:1044, :1261, :1413 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a).

## §5 Predictions, declared unchanged, invalidators, falsification

- **Predictions:** §3's tables; T1 and T2 green on both L1 entries; M-1 and M-2 failing as §4 says.
- **Declared unchanged, with the reading behind each:**
  - **B-T1's counts:** 7,620, 18, 346, 16, 1,728 and 9,728 (engine/tests/filter_type_admission.rs:1339-1368 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a sha256:42d9c037543524bafa7919cd81a59e143d73c0caffe5983712a1c27b88256365). Every B-T1 case puts a column in the arithmetic or the comparison (:792-829, :733-754, :1085-1104, :1136-1255, :1264-1304). Its admitted and refused tallies are printed, not asserted (:1427-1430).
  - **B-T1b's count:** 2,083 (engine/src/predicate.rs:3245 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a sha256:6c9741a4f35beb83f848b16609b1c19547893a9aab46c006bbcf360755dfd160). Its cases are column-left (:3053-3143), and `checked` is asserted only to be above zero (:3300-3303).
  - **Every B-T3 row:** no corpus row is literal-only arithmetic with a DOUBLE literal (engine/tests/filter_type_admission.rs:189-461 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a sha256:d2335a7fdd5777a1523dd2a6a3b343afa0795aad8e464b79fa7a9701c2068169). C33 at :326 has a column beside the literal.
  - **8b's T1, its eleven rows and its Display:** none has a DOUBLE literal as an operand of `+`, `-` or `*` (:576-596).
  - **The campaign:** leaf 10 always puts a column in the arithmetic (engine/tests/admission_property_campaign.rs:270-278 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a sha256:061c0a555dc4ae61a9d5df964be0f96d3a5ff5e99c09b9b75ab1e2b1290dbc6c). G4 compares its DOUBLE literals with a column (:595-607). The only assertion is that there is no counterexample (:1242-1246). A newly admitted shape is float arithmetic, which never raises out-of-range at v1.5.5 (engine/tests/filter_type_admission.rs:1066-1076 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a sha256:7e32efee3850699064fd1e865aebb65676fd363e5b4fc8de3b40371be0939613).
  - Also unchanged: the five reason values, the twelve codes, W-1, SKP-V0, kernel's `filter_error_of`, the shell, and every assertion in the repository. A Grep over `engine/`, `kernel/`, `frontends/` and `protocol/` found no literal-only predicate with an e-notation literal beside `+`, `-` or `*`. Its only predicate hits are C33 and B-T1b's C33.
- **Invalidators.** Each stops the piece and goes to the custodian:
  1. any P-0 stop (§4);
  2. any declared-unchanged item moves;
  3. a change outside `admitted_arithmetic_result` and the docs §2.3 names is needed to admit T1's rows;
  4. FILTER-BIND's sentence invalidator (governance/forms/engine/FILTER-BIND-COERCIONS-PREREGISTRATION.md:376 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a sha256:5449d5966f4399321a2caaece17136c92d25ac0bc3bf11cd4bb5a8a4f2511959) found newly live for a shape this piece admits or refuses.
- **Falsification:** at v1.5.5 an admitted T1 shape's stream ends in error; or the binder types one as other than DOUBLE; or the walk admits a T2 shape.

## §6 Instruments

- Every quantity is an assertion: a typed outcome, a result type, an id set, a fixture hash.
- No measurement and no docs/08 figure.
- P-0's run time is not recorded as a figure.

## §7 Declared values and ceilings

- **Size:** at most 150 changed lines (insertions plus deletions, comments and tests counted) over at most 3 files: `engine/src/predicate.rs`, `engine/tests/filter_type_admission.rs` and `engine/README.md`. This form, PLAN.yaml and FILLER-QUEUE.md are excluded.
  - Counting command: `git diff --numstat origin/main...HEAD -- engine/src/predicate.rs engine/tests/filter_type_admission.rs engine/README.md` at a named commit.
  - An overrun is class 8, and this line is not edited.
- **Constants:** `MAX_INTEGER_LITERAL_DIGITS` (20) and `MAX_DECIMAL_LITERAL_SCALE` (18) are unchanged (engine/src/predicate.rs:1391 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a sha256:34d66f819d8c3a8c0b94a424b28c3f29f6b6c1cddfcfd180451ece2bba112956, :1394). The DuckDB pin is unchanged.
- **Time:** the node's 120 minutes of worker time are the custodian's to revise. They are not measured.

## §8 Block-on-sight

1. Any code committed before P-0's record (the worker's report, or a class 1 amendment where §4 requires one).
2. The new clause reading `counts_as_decimal_literal`, or admitting a non-literal partner.
3. Any B-T1, B-T1b or B-T3 row, count or assertion changed; 8b's T1 changed.
4. Any other arm, rule, reason, precedence, `Typed` field, Display, W-1 or constant changed.
5. A new `pub` item; an edit to `engine/src/lib.rs`, Cargo.toml or Cargo.lock.
6. Any path under `kernel/`, `protocol/`, `frontends/`, `renderer/` or `.github/`, any ADR file, or KNOWN-LIMITATIONS.md.
7. A behaviour sentence drafted in this form or its amendments, or a §2.3 sentence not checked clause by clause against the built code.
8. A sleep, retry, timeout, `#[ignore]` or `cfg` in T1 or T2.
9. A mutation not observed as §4 says, or a `verify-mutation` run called an observation.
10. A DuckDB behaviour stated without its version.
11. P-0 or any probe on a shared cargo target, or anything from it committed.
12. A claim beyond §1.
13. Any CI entry red.

## §9 Gates and sequence

1. **This form is committed.**
2. **P-0, by the worker,** with nothing committed (§4). Its stops are checked before any code.
3. **A class 1 amendment, only if §4 requires one.** Otherwise P-0's record lives in the worker's report and the closing amendment cites it.
4. **Code, on the branch.** M-1 and M-2 are observed and recorded. The full engine suite runs at the head and passes there before any gate is dispatched (Part 1, item 4).
5. **The draft PR, then both gates from dispatch,** given one review packet (Part 1, item 5):
   - the architect: §1's readings, the ADR-021 and FILTER-BIND readings, and §8 item by item;
   - the reviewer: the full diff, the tests at their real boundaries (item 7), and each §2.3 sentence clause by clause (item 1).
6. **Out-of-scope categories, as I read them:**
   - ADR: none, by the ruling.
   - Wire: none.
   - Guarantee: touched. The implementation is brought to ADR-021's admitted class. No asserted figure moves.
   - Security: §21a's bullet labels ADR-021 as bundling and no runtime fetch (governance/AUTONOMY.md:321-322 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a sha256:61906e9c90498d10e7b265806962434fde6ac701e9b3fdbdd542377ec624e962). Read by that label, nothing here is security. Read by the ADR's number, admission is inside the bullet. The route, full gating, is the same either way.
7. **Suites:** product-ci-rust on both L1 entries, the governance checks, and `node --test` over the scripts suite before pushing.
8. **Operator:** no walkthrough row is proposed. The custodian may note against W-1's owed P6 sighting that this piece removes the F-A shapes from W-1's reach.

# Rule (00), path by path

This piece's paths:
- `engine/src/predicate.rs`
- `engine/tests/filter_type_admission.rs`
- `engine/README.md`
- this form (new), at `governance/forms/engine/LITERAL-ONLY-FLOAT-INTEGER-ARITHMETIC-REFUSED-PREREGISTRATION.md`
- the custodian's rows in PLAN.yaml and FILLER-QUEUE.md

| In flight at 8b9193a1 (the brief's lists) | Overlap |
|---|---|
| `cut/port-2-macos-l1-and-app-dirs` (engine paths: `engine/src/app_dirs.rs`, `engine/src/lib.rs`, `engine/src/lod.rs`, four `engine/tests/lod_tier_*.rs`) | None. Contact only: `engine/src/lib.rs` re-exports what T1 and T2 import, and this piece adds no re-export (§8 item 5). |
| `cut/b2-piece-1c-save-and-reopen` | None under `engine/`. |
| `cut/b1-shell-half-pr-c` | 0 files. |
| `publish-filter-sentence-under-whole-dataset` (shell publish files, KNOWN-LIMITATIONS item 8) | None. |
| `walkthrough-rows-stale-against-main-sweep-area-b` (`frontends/shell/MANUAL-WALKTHROUGH.md`) | None. |
| F-B, `arithmetic-text-literal-beside-null-reason` (8d) | Not in flight: it depends on this node (governance/PLAN.yaml:4217 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a sha256:c0cd1ee27ebd05330019e572e264e8d2cd83c15aa4913894fb07d3c1b4c3f1bd). Both edit `engine/src/predicate.rs` and the sentence doc, in sequence. |

Nothing touches `protocol/`. I cannot read branches; the path lists are the brief's.

## The custodian's settlement (class 1, before any code)

- **The human's ruling of 2026-11-05 (evening)** (`state/directives/2026-11-05-8c-full-form-nine-s2-placed-u12-slot-2-u1-reproducer-adr-notes-words-e2e-readme-words-8b-d3.md`, item 1), referenced and not restated: OPEN-1 (A).
- **OPEN-2 to OPEN-5** taken on 2026-11-05 as the Authority section records them (the direction of 2026-10-31, item 4, `state/directives/2026-10-31-away-until-11-04-clicks-from-the-app-270-size-o0-file-open-items-take-recommendation.md`, held until 2026-11-09 by `state/directives/2026-11-03-away-until-11-09-276-open-1-seven-clauses-open-4-c-placed-sitting-wording-leaves-slot-cloud-credit.md`, line 6); the human reviews each on return and may reverse it, a reversal recorded, never edited in.
- **8b's Amendment 4** (on main from d3391d4b) records the human's ruling on 8b's gate 1; section 1 above already keeps W-1 and the shapes (a) to (c) outside this piece, so nothing here changes.
- **The read commit and main:** `git diff --name-only 8b9193a1 d3391d4b -- engine/src/predicate.rs engine/tests/filter_type_admission.rs engine/README.md` is empty, so the Scope files read at main as cited.
- **Rule (00)** was checked at main d3391d4b by `git diff --name-only origin/main...<branch>` over the branches in flight (`cut/port-2-macos-l1-and-app-dirs`, `cut/b2-piece-1c-save-and-reopen`, `cut/b1-shell-half-pr-c`): none touches the three Scope files; no PR is open. It is checked again at dispatch.

## §10 Amendments (opens empty; append-only)

### Amendment 1 — 2026-11-06 — the closing record (class 1), with the class 2 and class 8 records, written after gate 1's reports, the words commit, the custodian's alone run and the head's CI were seen; references and hashes only

- **The final head:** 7d8a7b059880574affb1590c79067b6cddd5b345, four commits on 2c72923e9046daa373d112e8e8d2f0f5a73e4fb1 (ad223091, f2955007, 2c5627a2, 7d8a7b05); the three Scope files and 175 changed lines (`git diff --numstat 2c72923e...7d8a7b05`: `engine/README.md` 2/2, `engine/src/predicate.rs` 26/5, `engine/tests/filter_type_admission.rs` 140/0).
- **Class 8:** 175 changed lines against section 7's 150 (170 at 2c5627a2, gate 1's reviewed head); section 7's line is not edited.
- **P-0:** its record is in `state/consults/2026-11-06-literal-only-float-integer-arithmetic-refused-worker-report.md` (sha256 6cf1f3e350249479f92dcb23f0ee9bd6a34cfd835af10db0937077ffcd7b7aa3), with no stop; no class 1 amendment was required (section 9, item 3).
- **Class 2:** T2 row 2's operand type at P-0 is DECIMAL(20,19) literal, where section 3 left its width a hypothesis; T2 asserts the recorded type (section 4); the prediction is not edited.
- **Gate 1 at 2c5627a2:**
  - `state/consults/gates/2026-11-06-literal-only-float-integer-arithmetic-refused-gate1-architect.md` (sha256 e610a5bde9cea3f86ca14065ba4bc99d807181d0da076622e3328317535bfe0b), gate-log 682, PASS WITH NOTES, WORDS-ONLY.
  - `state/consults/gates/2026-11-06-literal-only-float-integer-arithmetic-refused-gate1-reviewer.md` (sha256 0fbf346b74795c89d2e590c6efd1409bd18c6b49694c5d759e981ae36813cb40), gate-log 683, PASS WITH NOTES, WORDS-ONLY.
- **The words:** the architect's C-1, D-1 and D-2 and the reviewer's D-1 (wrapped by the custodian, whitespace only), taken for the reasons gate-log 683's note gives; the reviewer's D-2 and D-3 (the spans of the architect's C-1 and D-1) and the architect's N-1 not applied. Applied at 7d8a7b05 by a worker, `state/consults/2026-11-06-literal-only-float-integer-arithmetic-refused-gate1-words-worker-report.md` (sha256 55b97ce209378b7a1a4c0654c6838d5676a39249cd434a5a547bd031f230fe16); the two files' sha256 at the head, 357723edb09d6f8e09aacc47aa1395ab92536899e9b11570224cfbe8740fd3b1 and 5bc4a811d243e09b00be9bea138cc8a308dd58a744861ac36f7e3d48f36a9668, equal to the brief's, checked by git.
- **The reviewer's shared-run failure:** `cargo test -p spatial-engine --locked --test lod_tier_builder` at 7d8a7b05, run by the custodian in a shared hold with no other SpatialIDE cargo run in its window: rc 0, 17 passed, 0 failed, 2 ignored.
- **Notes:** each gate's notes, recorded in its report, not applied.
- **CI at 7d8a7b05:** Product CI — shell 42157514625 and 42157520672, Product CI — Rust workspace 42157514658 and 42157520633, Rust fmt 42157514672 and 42157520634, Ported notices 42157514678 and 42157520896, Governance CI — plan, queue, site 42157514700 and 42157520762, Exposure scan 42157520642, DCO sign-off 42157520664, each success.
- **Merge:** the human's click, by merge commit.
