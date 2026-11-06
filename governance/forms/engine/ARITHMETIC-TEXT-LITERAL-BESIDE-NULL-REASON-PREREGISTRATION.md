# engine: in arithmetic, a text or BOOLEAN operand beside NULL or beside its own type, refused by type as `conversion_rounds`, gets a true sentence under that reason value, no reason value added — five-line short form (`AUTONOMY.md` §21d)

*Committed before any code. Append-only once committed; an amendment written after any run of this piece's tests, probe or mutations has been seen says so in its first line. PLAN node arithmetic-text-literal-beside-null-reason, the filler queue's entry 8d (S3). The five lines, the reuse index's output, the notes, the OPEN items and what is not settled are lead-data's draft (`state/consults/2026-11-06-arithmetic-text-literal-beside-null-reason-five-line-form-lead-data-draft.md`, read only at main 67c0049e; its sha256 from line 5 is a5042b35b89d3e60e4dd2370da056c1a4bfa14ce9ea21320258c6e7c0fe8f8bc), carried byte for byte with these changes, all the custodian's: each cite the draft marks `@ C` (46) is given the full commit id, and each cite `path:line @ 67c0049e95f80b4c572e043d7e69a721db78d746` is expanded by script to `path:line @ 67c0049e95f80b4c572e043d7e69a721db78d746 sha256:<the lines with their LFs>` (68 pins); the one cite written before its line's marker (`engine/src/predicate.rs:189`) is given that marker; `In flight at C` reads `In flight at 67c0049e95f80b4c572e043d7e69a721db78d746`; the bare line numbers bound to the path written before them (11) are kept as written, `:195` with its marker's full commit id; this title and lead line added; the draft's first five lines (its heading, its summary, its read commit, its wording convention and its report path) dropped. Form path: `governance/forms/engine/ARITHMETIC-TEXT-LITERAL-BESIDE-NULL-REASON-PREREGISTRATION.md`. The custodian keeps the PLAN node on main.*

*The notes, the OPEN items and what is not settled below are lead-data's from its draft; where they say I or my, they mean lead-data's. They are this form's reading. Every cite into the code is at the read commit: the custodian's settlement maps the spans #284 moved to the base.*

## The five lines

```
Authority: PLAN node `arithmetic-text-literal-beside-null-reason` (governance/PLAN.yaml:4210-4226 @ 67c0049e95f80b4c572e043d7e69a721db78d746 sha256:76d2a13dcd6e319cf316fbb68aec36e815b4015618b7fc0ee48cf5b53c3ed84b), generation 1; filler queue entry 8d, S3 (state/FILLER-QUEUE.md:28 @ 67c0049e95f80b4c572e043d7e69a721db78d746 sha256:93c6cb5debd4cab7ba5ded87c0d39786dc291234d4ba0fc2515dfd3439fed728); placed by the human's ruling of 2026-11-05, item 3 (state/directives/2026-11-05-platform-runs-filed-c1-governance-next-fixtures-kernel-node-8b-route-a-f-b-after-8c.md:10 @ 67c0049e95f80b4c572e043d7e69a721db78d746 sha256:17f4de6d0e9c7105f6c149e4130021d7f8e0183917895c9d59f3342ae9200e6f), and given the architect's shapes (a) to (c), with `/` named and probed first, by the ruling of 2026-11-05 (evening), item 5 (state/directives/2026-11-05-8c-full-form-nine-s2-placed-u12-slot-2-u1-reproducer-adr-notes-words-e2e-readme-words-8b-d3.md:27 @ 67c0049e95f80b4c572e043d7e69a721db78d746 sha256:84529cc9d57aa0f2216c80a33c974e2f9b830318b5782bc1311819e88303da39; the shapes at state/consults/gates/2026-11-05-type-walk-rule2-residual-reasons-gate1-architect.md:39-44 @ 67c0049e95f80b4c572e043d7e69a721db78d746 sha256:cbfa50c3bf89d964745ed4f6afe0f01ebe2def814c419f67067f13e7059c1ca9); origin F-B of entry 8b's form (governance/forms/engine/TYPE-WALK-RULE2-RESIDUAL-REASONS-PREREGISTRATION.md:96-98 @ 67c0049e95f80b4c572e043d7e69a721db78d746 sha256:2a63ccdcbeb58a3d4a17e66f1eece2a19090df325c3bcb30ae58530f162c5073, with its Amendments 1, 2 and 4); the filler rule, AUTONOMY.md §36 (governance/AUTONOMY.md:692 @ 67c0049e95f80b4c572e043d7e69a721db78d746 sha256:1135b89c01d0e676bce0bc42a4d6710af445fa0ae95ed12ef6ca0fef7a4d4e84): a five-line form under §21c, the reviewer and the architect gating from dispatch, round 25, item 2 (e) set aside, its strings a user sees P6 placeholders; the human's rulings on gate rounds of 2026-11-05, Part 1, items 1 to 9, by reference (state/directives/2026-11-05-main-architect-gate-rounds-part-1-rulings-review-packet-design-part-3-additions.md:28-64 @ 67c0049e95f80b4c572e043d7e69a721db78d746 sha256:b7b9954b95c6a23808cc8a2fbacb8b6157335e23da53ccda20f4a35ba8e05e8a); OPEN items that are not red lines are taken under the direction of 2026-10-31, item 4 (state/directives/2026-10-31-away-until-11-04-clicks-from-the-app-270-size-o0-file-open-items-take-recommendation.md:14 @ 67c0049e95f80b4c572e043d7e69a721db78d746 sha256:30b606119103bd1340cb6c72f7508d5780556097b85311fefb96f666ea5c6b38), held until 2026-11-09 (state/directives/2026-11-03-away-until-11-09-276-open-1-seven-clauses-open-4-c-placed-sitting-wording-leaves-slot-cloud-credit.md:6 @ 67c0049e95f80b4c572e043d7e69a721db78d746 sha256:5c2e1399389aad0106932f484fda92f351ad5394ac421a6988115716a0452e83); the reuse index found no prior art on either search (text literal null arithmetic; type walk refusal reason sentence), a miss noted here; no code starts before PR #284 (8c, this node's depends_on) merges.
Scope: 2 files: engine/src/predicate.rs (`TypeRefusalReason::sentence` and its doc, engine/src/predicate.rs:1430-1453 @ 67c0049e95f80b4c572e043d7e69a721db78d746 sha256:d2dadaf8642d1a8b5dc410b9b053a2bd5cc2786a65547e71919c5ca7f7c75cca, a span PR #284 rewrites, so cited by item; in the `TypeNotAdmitted` arm of `FilterError`'s Display, engine/src/predicate.rs:382-387 @ 67c0049e95f80b4c572e043d7e69a721db78d746 sha256:e57946a4d22150cec9a129f62d9fc60c8aae9ce32faf4d5340f9e2cd02c4d008, only its call of `sentence`; one new private selector function) and engine/tests/filter_type_admission.rs (one new test, T1); declared line budget 140 (insertions plus deletions, comments and tests counted, governance/AUTONOMY.md:357 @ 67c0049e95f80b4c572e043d7e69a721db78d746 sha256:367596df34a73d122765d000ba5df601dbe54da9e5a6aefca966747809a44fec); this form exempt; unchanged: every other sentence arm, W-1's string (engine/src/predicate.rs:1448-1451 @ 67c0049e95f80b4c572e043d7e69a721db78d746 sha256:86ed8424b5334b84e605e3a84e0c9b935959cd7af7cfd7ea4639eaa65a3778f4), every reason variant, `wire_value`, the precedence, every `Typed` field, `render`, every admission rule, every `FilterError` field and the Display format string; unchanged: 8b's T1, and every B-T1, B-T1b, B-T3 and 8c row, count, name and assertion; no new `pub` item; no edit to engine/src/lib.rs, Cargo.toml or Cargo.lock; no file under kernel/, protocol/, frontends/ or renderer/; no KNOWN-LIMITATIONS.md item; no engine/README.md line.
Change: every `skp.filter_type_not_admitted` refusal whose reason is `conversion_rounds` and one of whose `operand_types` entries names VARCHAR or BOOLEAN as its type ends its Display, and so its wire `message` (protocol/skp/SKP-V0.md:346-347 @ 67c0049e95f80b4c572e043d7e69a721db78d746 sha256:8363598a8624e8a2af14e065f498efa55dc6c311d0c3c6947cd629ae00de9157), with a second `[P6 placeholder]` sentence of that reason instead of W-1, which is false of it; `TypeRefusalReason::sentence` chooses between the two from the refusal's own `operand_types`; every other refusal's Display, W-1's string, the five reason values, and every admission outcome, code, `construct`, `operand_types` and `reason` are unchanged.
Tests+mutation: before any code, P-0 (a throwaway test on FX-1, never committed, run at the branch base on the worktree's own target under a shared hold): the 28 predicates of the draft's probe table, each run once through `AdmittedPredicate::admit`; each outcome recorded in full (for a binder refusal the first line of its Display; for a `TypeNotAdmitted` its construct, operand types, reason and whole Display), with Cargo.lock's duckdb and libduckdb-sys versions and the 40-hex base commit; its stops are the table's S-1 to S-5, each sent to the custodian with no code written. T1 every_conversion_rounds_refusal_over_a_text_or_boolean_operand_carries_its_own_sentence (new, engine/tests/filter_type_admission.rs): it covers each P-0 predicate refused `TypeNotAdmitted` with `ConversionRounds`, in the table's order, plus the controls `f32 > NULL + 100000` and `i32 + f32 > 0`; for each it asserts the real `PredicateAdmitError::Filter(FilterError::TypeNotAdmitted { .. })` with the construct, operand types and reason P-0 recorded, and a Display equal to the Display format (engine/src/predicate.rs:382-387 @ 67c0049e95f80b4c572e043d7e69a721db78d746 sha256:e57946a4d22150cec9a129f62d9fc60c8aae9ce32faf4d5340f9e2cd02c4d008) carrying the new sentence on the P-0 rows and W-1 on the controls; then FX-1's sha256. M-1: the selector removed, so every `ConversionRounds` refusal carries W-1; predicted to fail exactly T1 in a run of the whole binary, by name at its Display assertion on its first row, `'1' + NULL > 0`. M-2: the selector made to choose the new sentence for every `ConversionRounds` refusal; predicted to fail exactly T1, at the control `f32 > NULL + 100000`, and 8b's T1 (engine/tests/filter_type_admission.rs:568-630 @ 67c0049e95f80b4c572e043d7e69a721db78d746 sha256:12c8d49af9795bad01b2180cbc4ee41d9a31aa5b9630d4f9417459494d506bca), at the same predicate. Each mutation is observed in a debug build on the branch's code commit, recorded by name with the 40-hex commit in a `RECORDED MUTATION:` doc line on T1, and reverted; a verify-mutation run is not an observation. T1 has no sleep, retry, timeout, `#[ignore]` or `cfg`, and runs in `cargo test --workspace --locked` on both L1 entries (.github/workflows/product-ci-rust.yml:195 @ 67c0049e95f80b4c572e043d7e69a721db78d746 sha256:825454e6febccd062c73f064662b34348e9638c7b8d3fa8f77359a5f1b545f24, :197, :234).
Out-of-scope: ADR: no status line, Note or amendment; ADR-021's Notes keep their text, their admitted and refused classes, their twelve codes and their five reason values, and no admission outcome moves; security: nothing ADR-020, ADR-009 or ADR-021 governs, and admission is unchanged; wire: no SKP code, field, reason value or literal, nothing under protocol/, FX-4 (a `text_with_non_text` message) unchanged, kernel's `filter_error_of` (kernel/src/skp.rs:2351-2379 @ 67c0049e95f80b4c572e043d7e69a721db78d746 sha256:47b97d8bfedba6a49381ab690b2a600556af0d163c165d760b9401716e042287) unchanged, and the `message` change is a Display wording change, which O-4 places outside the wire (state/directives/B-1-RULINGS-AND-TYPED-TEXTS-2026-09-30.md:10 @ 67c0049e95f80b4c572e043d7e69a721db78d746 sha256:1b3f78c0dab48121ab968afccea766aac624919154ae85a8c4c54272491416d7); guarantee: none changed, "touched" read as changed; no test at the base asserts the Display of a `conversion_rounds` refusal with a VARCHAR or BOOLEAN operand (the worker greps the base before code, and a hit is a stop); FILTER-BIND's reason-sentence invalidator (governance/forms/engine/FILTER-BIND-COERCIONS-PREREGISTRATION.md:376 @ 67c0049e95f80b4c572e043d7e69a721db78d746 sha256:5449d5966f4399321a2caaece17136c92d25ac0bc3bf11cd4bb5a8a4f2511959) is disclosed as a contact, which this change makes hold of more refusals; the sentence a user sees is a P6 placeholder, and §21c's fourth bound is met through §36's P6 clause, on 8b's OPEN-4 (A) precedent (governance/forms/engine/TYPE-WALK-RULE2-RESIDUAL-REASONS-PREREGISTRATION.md:164 @ 67c0049e95f80b4c572e043d7e69a721db78d746 sha256:f076c2190cbc177f98d92576ae465de067bc0ece2358a11d9b1be418896f5840); the five-line form stands under §36.
```

The reuse index output, byte for byte from the brief:

```text
$ node tools/reuse.mjs text literal null arithmetic   (exit 1)
No prior art recorded for "text literal null arithmetic". Research it before planning an implementation.
$ node tools/reuse.mjs type walk refusal reason sentence   (exit 1)
No prior art recorded for "type walk refusal reason sentence". Research it before planning an implementation.
```

## 1. The probe (P-0), first

**How it runs.**
- When: at the branch base, which is main after #284 merges. It runs before any code.
- Where: the worktree's own new cargo target, a debug build, inside a shared hold.
- What: a throwaway `#[test]` appended to engine/tests/filter_type_admission.rs with the Edit tool. It is never committed. Each predicate is sent once through the real `AdmittedPredicate::admit` over FX-1. FX-1's text column is `zone` and its BOOLEAN column is `flag` (engine/src/fixture.rs:659-674 @ 67c0049e95f80b4c572e043d7e69a721db78d746 sha256:03cc114ca33af26fdf8179f5c7d264b67e16750d3e85edb20dfdcbfb451a52ef).
- Afterwards: the file is restored to its sha256 at the base, and the porcelain is empty.

**What is recorded, per predicate:**
- the outcome variant;
- for `RejectedByBinder`, the first line of the Display;
- for `TypeNotAdmitted`, the construct, the operand types, the reason and the whole Display;
- once per run: Cargo.lock's `duckdb` and `libduckdb-sys` versions, the 40-hex base commit and the result line.

**Stages inside `admit`.** The binder runs before the walk (engine/src/predicate.rs:189 @ 67c0049e95f80b4c572e043d7e69a721db78d746 sha256:3a07571533cc3e3efbff9261956eba95055908f4b583c8f3c732a2346763c870 and :195 @ 67c0049e95f80b4c572e043d7e69a721db78d746). So a binder refusal means the walk never sees the shape.

**The walk, by my reading** (refusal construct, operand types, reason):
- `+`, `-` and `*`: VARCHAR or BOOLEAN beside NULL or beside its own type matches no rule.
  - Rule 1 covers REAL and DOUBLE only (engine/src/predicate.rs:2066-2068 @ 67c0049e95f80b4c572e043d7e69a721db78d746 sha256:e2be79eda0e71c5d831fb6054d834b2b11bea73e9a497317f62766a57218e2df).
  - Rule 2 is guarded by `is_numeric` (engine/src/predicate.rs:2079-2084 @ 67c0049e95f80b4c572e043d7e69a721db78d746 sha256:9cb58ef11a5ad66b0f8a0cd035a6851670801b781170810331cace84c061dc6d).
  - The pair then falls through to `determine_reason`. Its text item and its BOOLEAN item both exclude a NULL partner and need differing types (engine/src/predicate.rs:2268-2277 @ 67c0049e95f80b4c572e043d7e69a721db78d746 sha256:6f093fc524b9adf6d242a4e61cfccadb3f6bd6269b296fbd2b3fe35a63d0e2d8). VARCHAR, BOOLEAN and NULL literals are within bounds (engine/src/predicate.rs:1509-1512 @ 67c0049e95f80b4c572e043d7e69a721db78d746 sha256:c3415a30421da0d79c9d73a33b857e8c2315dd11ac9df9382d66c7a7d10ba04a). So the pair reaches the residual (engine/src/predicate.rs:2301 @ 67c0049e95f80b4c572e043d7e69a721db78d746 sha256:be11179a0b0aa8c2e93b0dfee21d9fe60ed57fd4fed753f7e8f206b4779b575a).
- `/`: `type_of_division` sends any VARCHAR or BOOLEAN operand to the same `determine_reason` (engine/src/predicate.rs:1950-1958 @ 67c0049e95f80b4c572e043d7e69a721db78d746 sha256:f3d6655ef1a17bd4019bf343711b6a8d68705bcd2c396c593fc5a1e9674fde93).

**The 28 predicates.** "Observed" cites a record; every other row is a hypothesis.

| Row | Predicate | Binder | If the walk sees it |
|---|---|---|---|
| K1 | `'1' + NULL > 0` | passes (observed: 8b's P-0, state/consults/2026-11-04-type-walk-rule2-residual-reasons-worker-report.md:21-23 @ 67c0049e95f80b4c572e043d7e69a721db78d746 sha256:59f4f75a5d10545c562d6feee0d67e6b58507dbf5fba566e2292f67343acb56d; 8c's reviewer, state/consults/gates/2026-11-06-literal-only-float-integer-arithmetic-refused-gate1-reviewer.md:18 @ 67c0049e95f80b4c572e043d7e69a721db78d746 sha256:0802967eb35888b974e1b7aed559d9a5d789c65d39d8d0a6cf08410f49d6dcb3) | TNA `+`, VARCHAR literal / NULL literal, ConversionRounds (observed) |
| K2 | `'1' - NULL > 0` | passes (observed, the reviewer, :18) | TNA `-`, same types (observed) |
| K3 | `NULL + '1' > 0` | passes (observed, the reviewer, :18) | TNA `+`, NULL literal / VARCHAR literal (observed) |
| K4 | `'1' * NULL > 0` | refused (observed, the reviewer, :19) | TNA `*`, VARCHAR literal / NULL literal |
| A1 | `'1' / NULL > 0` | unknown | TNA `/`, VARCHAR literal / NULL literal, ConversionRounds |
| A2 | `NULL / '1' > 0` | unknown | TNA `/`, NULL literal / VARCHAR literal |
| A3 | `zone / NULL > 0` | hypothesis: refused, as `zone + NULL` was at 8b's P-0 (:19) | TNA `/`, VARCHAR / NULL literal |
| B1 to B4 | `'1' + '2' > 0`, `'1' - '2' > 0`, `'1' * '2' > 0`, `'1' / '2' > 0` | unknown | TNA with that operator, VARCHAR literal / VARCHAR literal |
| B5 to B8 | `zone + zone > 0`, `zone - zone > 0`, `zone * zone > 0`, `zone / zone > 0` | hypothesis: refused | TNA, VARCHAR / VARCHAR |
| B9 to B12 | `TRUE + FALSE > 0`, `TRUE - FALSE > 0`, `TRUE * FALSE > 0`, `TRUE / FALSE > 0` | unknown | TNA, BOOLEAN literal / BOOLEAN literal |
| B13 to B16 | `flag + flag > 0`, `flag - flag > 0`, `flag * flag > 0`, `flag / flag > 0` | hypothesis: refused | TNA, BOOLEAN / BOOLEAN |
| C1 to C4 | `TRUE + NULL > 0`, `TRUE - NULL > 0`, `TRUE * NULL > 0`, `TRUE / NULL > 0` | hypothesis: refused, as `flag + NULL` was at 8b's P-0 (:20) | TNA, BOOLEAN literal / NULL literal |
| C5 | `flag / NULL > 0` | hypothesis: refused | TNA `/`, BOOLEAN / NULL literal |

Every "If the walk sees it" cell carries the reason ConversionRounds, and at the base its Display ends with W-1.

**Stops.** Each goes to the custodian, with no code written.
- **S-1:** K1, K2 or K3 is not `TypeNotAdmitted` with its listed construct, operand types and `ConversionRounds`. The node's own shape would have moved at the base.
- **S-2:** any of the 28 is admitted (`Ok`). That would be an admission question, not a sentence question.
- **S-3:** any predicate the walk refuses carries a reason other than `ConversionRounds`, a construct other than its operator, or operand types other than the table's. My reading of `determine_reason` would then be wrong, and so would the selector's premise.
- **S-4:** any `TypeNotAdmitted` Display at the base does not end with W-1. #284 was barred from changing W-1 (governance/forms/engine/LITERAL-ONLY-FLOAT-INTEGER-ARITHMETIC-REFUSED-PREREGISTRATION.md:256 @ 67c0049e95f80b4c572e043d7e69a721db78d746 sha256:104e20c3a104f479b1ddcd23db96320d284114765d5a93c8a571c08105e6e88e), so this would mean the base is not what this form reads.
- **S-5:** any outcome other than `RejectedByBinder` or `TypeNotAdmitted`.

**Not stops: these change only T1's rows.**
- Any A, B or C row the binder refuses gets no T1 row. It is recorded, and the selector still covers it by reading.
- Any A, B or C row that reaches the walk as the table says becomes a T1 row.
- If K4 reaches the walk, it becomes a T1 row and is recorded.
- If B9 to B16 or C1 to C5 reach the walk, they are T1 rows, under OPEN-3 (a).

**Where the record lives.** T1's rows follow from P-0's record by rule, so no class 1 amendment is needed before code. The record lives in the worker's report, and the closing amendment cites it.

## 2. The change, stated before it is applied

**A second sentence under the same wire value is possible without a new reason value.**
- `sentence` is private (engine/src/predicate.rs:1440 @ 67c0049e95f80b4c572e043d7e69a721db78d746 sha256:91949b76a1115b5c815d35230f201f99e85c5e556edaae3c3de8c7af905bb7c1).
- Its only caller is the `TypeNotAdmitted` arm of `FilterError`'s Display (engine/src/predicate.rs:386 @ 67c0049e95f80b4c572e043d7e69a721db78d746 sha256:ed517103d4213461ecb96fc29f0a92b12819ac12d9e75b9f25157a48b7236070). A search for `.sentence(` over engine, kernel, protocol and frontends found no other call.
- That arm already holds `operand_types`. So `sentence` can take the refusal's operand types and choose its text from them. The enum's variants, `wire_value` (engine/src/predicate.rs:1420-1428 @ 67c0049e95f80b4c572e043d7e69a721db78d746 sha256:d10d43507bfef211eea6a55a4f6bd5dd5d2b58b06b33301fc2b341c85f57e92b) and every field stay as they are.

**What decides which text a refusal gets: the refusal's own `operand_types` (OPEN-1).**
- My proposal: the new sentence when the reason is `ConversionRounds` and an entry's leading type name is exactly VARCHAR or BOOLEAN. In every other case, W-1.
- The entries are `render`'s output: the `EngineType` name, then optionally a space and `literal` or `expression` (engine/src/predicate.rs:1558-1565 @ 67c0049e95f80b4c572e043d7e69a721db78d746 sha256:4d62711be3a75d1fd26f08b9a12eb168ee258aaebc6c9100fd1f53d7b0af268e). The names form a closed set (engine/src/predicate.rs:1486-1507 @ 67c0049e95f80b4c572e043d7e69a721db78d746 sha256:e594544365fb94cfb6cfe9a14220f01cd62c9bb12848751d536dfa49d48b8037). Neither VARCHAR nor BOOLEAN begins any other name, so the selector compares the token before the first space for equality, never by prefix.

**Why the selector is complete, by my reading.** Every `ConversionRounds` refusal with no REAL or DOUBLE operand has a VARCHAR or BOOLEAN operand:
- integer beside integer within bounds is admitted (engine/src/predicate.rs:2086-2088 @ 67c0049e95f80b4c572e043d7e69a721db78d746 sha256:c05e9b2e6b2e4922967ef273a3d860314e1d6f31a4536c1ff97005e11e79fdf6, :2195-2197);
- a `Decimal` beside an integer or a decimal in arithmetic is `ConversionCanFail` (engine/src/predicate.rs:2298-2300 @ 67c0049e95f80b4c572e043d7e69a721db78d746 sha256:fdb6bd2ccdb6bdb38aed9658ffe180404e3e0ac552e5d736f4399fdd968df209);
- NULL beside a numeric operand is admitted (engine/src/predicate.rs:2079-2084 @ 67c0049e95f80b4c572e043d7e69a721db78d746 sha256:9cb58ef11a5ad66b0f8a0cd035a6851670801b781170810331cace84c061dc6d).

The converse also holds. Every residual with a REAL or DOUBLE operand has no VARCHAR or BOOLEAN operand, because text or BOOLEAN beside a float hits items 1 or 2 first. This agrees with the architect's Check 1 (state/consults/gates/2026-11-05-type-walk-rule2-residual-reasons-gate1-architect.md:46-61 @ 67c0049e95f80b4c572e043d7e69a721db78d746 sha256:a2f210e7cac3347416d6d1602a4b5207a5a63c720293cf6063ce8e7b40b9f9a4).

**Routes I rejected, each a stop or a question for the human, not a choice:**
- *A field on `TypeNotAdmitted` that carries the walk's choice.* The variant's fields are public, and kernel builds the variant by struct literal (kernel/src/skp.rs:2931-2935 @ 67c0049e95f80b4c572e043d7e69a721db78d746 sha256:9da06812831dd67e9ae65587f14dbe5ac6526871f38c49660a7bf88ff6465684). That is a contract change across modules.
- *A new Rust variant mapped to `conversion_rounds`.* It adds a reason at the Rust level, against the five fixed values (8b's note 2, route B: governance/forms/engine/TYPE-WALK-RULE2-RESIDUAL-REASONS-PREREGISTRATION.md:48 @ 67c0049e95f80b4c572e043d7e69a721db78d746 sha256:7a9d76f57390120caaed0c1cfbfd039973294c6520823f39fc88a54f9f3e00ab).
- *Re-routing these pairs to `text_with_non_text` or `boolean_conversion`.* That changes the wire `reason`, a red line by 8b's Amendment 1 (governance/forms/engine/TYPE-WALK-RULE2-RESIDUAL-REASONS-PREREGISTRATION.md:177 @ 67c0049e95f80b4c572e043d7e69a721db78d746 sha256:7c2c4f549c04bd3a05eb202f47f6fd04c9c87d43fb01e9fa2e287a2e35fae1d6).
- *Rewording W-1.* W-1 is the human's (the evening ruling, item 5).

None of these is needed.

## 3. The route

**§21a** (governance/AUTONOMY.md:315-332 @ 67c0049e95f80b4c572e043d7e69a721db78d746 sha256:211fe30919ba9ee55447ac9f66874374382d972ab58269c8f074a79fd4693cb3):
- ADR: none.
- Security: nothing changes in admission. On 8b's precedent a Display wording change is outside ADR-021's posture, under either reading of the bullet's ADR-021 label; 8c's form records that ambiguity at governance/forms/engine/LITERAL-ONLY-FLOAT-INTEGER-ARITHMETIC-REFUSED-PREREGISTRATION.md:280 @ 67c0049e95f80b4c572e043d7e69a721db78d746 sha256:4189803e083b09d78afdf89f6661b4d7b1a7d3b7c968a770d06b651b893e82f8.
- Wire: `message` is Display verbatim (protocol/skp/SKP-V0.md:346-347 @ 67c0049e95f80b4c572e043d7e69a721db78d746 sha256:8363598a8624e8a2af14e065f498efa55dc6c311d0c3c6947cd629ae00de9157). Under O-4 a wording change never changes the wire. No code, field or reason value moves.
- Guarantee: no property under test moves, provided the base grep finds no Display assertion on a text or BOOLEAN `conversion_rounds` refusal. The only `can round` hits outside the records are 8b's T1 and W-1 itself, and neither has a text or BOOLEAN row. I could not read #284's branch; its records give T1 and T2 assertions of shape, construct, operand types and reason, not Display (governance/forms/engine/LITERAL-ONLY-FLOAT-INTEGER-ARITHMETIC-REFUSED-PREREGISTRATION.md:191-200 @ 67c0049e95f80b4c572e043d7e69a721db78d746 sha256:a1f07e0fe9c9108cddf88954aff317b867e605ff1e819a18d27f9ac9bdfabfee). Hence the grep, which is a stop if it hits.
- My reading: none of the four categories is touched.

**§21c's four bounds** (governance/AUTONOMY.md:347-357 @ 67c0049e95f80b4c572e043d7e69a721db78d746 sha256:87932677b77260bd12a21590a4611707aec57b89f69124ca0465a4d058bfeb31):
- **Lines.** My estimate, not measured:
  - predicate.rs about 30 to 40: the selector and its comment about 15, the new placeholder string 3, the signature and the call 3, the doc rewrite about 12 with deletions counted;
  - the test file about 60 to 95: the body about 45, about 2 per row, the doc and two `RECORDED MUTATION:` lines.
  - Total about 90 to 135 against a declared budget of 140. If P-0 lets every A, B and C row reach the walk, the count may pass 140. That is class 6, with Scope not edited (governance/AUTONOMY.md:345 @ 67c0049e95f80b4c572e043d7e69a721db78d746 sha256:ac3b30f25e10d5a8efd8202a960e95a02e00672d5d5b9faf9226c8216b2456c3). The short form stays, and both gates are already in place under §36.
- **Files:** 2 of 8.
- **No exposure surface and no dependency.**
- **User-visible behaviour:** the new sentence is a string the app shows. It is met through §36's P6 clause, on 8b's OPEN-4 (A), ruled 2026-10-26, and 8b's gate read it so (state/consults/gates/2026-11-05-type-walk-rule2-residual-reasons-gate1-architect.md:112 @ 67c0049e95f80b4c572e043d7e69a721db78d746 sha256:78b57b00eedd1a0bfa742ff0ba297433a865212974f857a4662a896534dfb83f).

**Conclusion.** The five-line route holds. Round 25, item 2 (e) is not tripped, because the Out-of-scope line asserts that none of the four categories is touched (docs/PREREGISTRATION-TEMPLATE.md:176 @ 67c0049e95f80b4c572e043d7e69a721db78d746 sha256:92ffa7a083b8711357b414875afcf9d03d8186eb35234b0478babf1c8300a917).

## 4. Where the sentences about behaviour go (Part 1, item 1: places only, never words)

1. **`TypeRefusalReason::sentence`'s doc** (the span #284 rewrites; its last clause is the reviewer's D-1 words, applied at 7d8a7b05 per governance/forms/engine/LITERAL-ONLY-FLOAT-INTEGER-ARITHMETIC-REFUSED-PREREGISTRATION.md:323 @ 67c0049e95f80b4c572e043d7e69a721db78d746 sha256:5a8c1e09f111217e7bc76edec92bcf2f235eae0323d0380099920cfe876dcaa0). After this piece that clause is false, because W-1 no longer reaches the text-beside-NULL shape. The doc must cover:
   - that the fifth reason has two sentences;
   - what selects between them;
   - that both are P6 placeholders;
   - this form's path;
   - only the cases each sentence is still false of at the head, or none.
2. **The selector's own comment.** It must cover:
   - what it reads (each entry's leading type name);
   - why it reads that and not a field (no field carries the choice; kernel builds the variant);
   - the pairs it routes, in all four operators;
   - which of them the binder refuses at DuckDB v1.5.5, per P-0's record, with the version stated.
3. **The new placeholder sentence itself** (a P6 string). The worker writes it from the built code, and both gates check it clause by clause. It must:
   - begin with `[P6 placeholder]`, as W-1 does;
   - be true of every pair the selector routes to it, both operand orders and all four operators included, binder-refused pairs included;
   - say the refusal is by type;
   - claim no conversion of a value read from the file, and no rounding.
4. **T1's doc,** with both `RECORDED MUTATION:` lines.
5. **To check only, with no edit unless it becomes false:**
   - the enum's doc (engine/src/predicate.rs:1396-1399 @ 67c0049e95f80b4c572e043d7e69a721db78d746 sha256:3aa5c22f6666d668bd696a3509dc9c542a1e123518dbc2c556503fe72564d110), which says the sentence lives only in `sentence`; it stays true if the selector is called inside `sentence`;
   - the `ConversionRounds` variant's doc (engine/src/predicate.rs:1412 @ 67c0049e95f80b4c572e043d7e69a721db78d746 sha256:3fd814b23882c2b4fe4aae360148d103257825642ea7cef0fd428aba1bc867b6).

No sentence goes into an ADR, SKP-V0, KNOWN-LIMITATIONS.md, engine/README.md or the shell.

## 5. Tests and mutations

**T1 sits at the real boundary** (item 7):
- it calls the real `AdmittedPredicate::admit` on FX-1;
- it matches the real `PredicateAdmitError::Filter(FilterError::TypeNotAdmitted { construct, operand_types, reason })`;
- it checks the real Display through `to_string()`, against the format at engine/src/predicate.rs:382-387 @ 67c0049e95f80b4c572e043d7e69a721db78d746 sha256:e57946a4d22150cec9a129f62d9fc60c8aae9ce32faf4d5340f9e2cd02c4d008, the way 8b's T1 does (engine/tests/filter_type_admission.rs:598-627 @ 67c0049e95f80b4c572e043d7e69a721db78d746 sha256:4ad3b8e6d073bb6acb415168eccc8c4f5f284c400a14b3eb913fa6e26527f71f);
- it imports only what the file already imports (engine/tests/filter_type_admission.rs:22-27 @ 67c0049e95f80b4c572e043d7e69a721db78d746 sha256:aaa43b2e2f13e9b044ea569cf9506f840fef73861858bdf15751f0d7382f034b);
- it ends with FX-1's hash check (engine/tests/filter_type_admission.rs:73-79 @ 67c0049e95f80b4c572e043d7e69a721db78d746 sha256:d456f37f9b4e2e6615f1ebfdab5c4116b6b410c26abae0ba4dbdeeb2eea1b558).

**The controls.** They are copied from 8b's T1 rows at :577 and :595, and their Display carries W-1. With them, M-2 fails T1 itself, so the selector is pinned from both sides.

**The mutations:**
- M-1 (the selector removed) fails T1 alone at row K1's Display.
- M-2 (the selector always picks the new sentence) fails T1 at its control row and 8b's T1 at its first row.

**Unchanged.** 8b's T1 and its name. B-T3 asserts reasons, not sentences. Kernel's B-T6 builds a `TextWithNonText` refusal (kernel/src/skp.rs:2929-2947 @ 67c0049e95f80b4c572e043d7e69a721db78d746 sha256:d574ffd4ef90efe4172c6d70552b9397379144a5873fd033fcbbc53b805dd719), which the selector never reaches.

**Determinism and CI.** There is no sleep, retry, timeout, `#[ignore]` or `cfg`. The only shared state is FX-1's read-only `OnceLock` (engine/tests/filter_type_admission.rs:53-70 @ 67c0049e95f80b4c572e043d7e69a721db78d746 sha256:e3d3736558264dd027a467fb7bf83b01c5668a039ec0c1be0b4a25c9bea36f22). The test runs in `cargo test --workspace --locked` on the Windows and Linux L1 entries.

**Before any gate:** the full engine suite runs at the head and passes there (Part 1, item 4).

## 6. Rule (00), path by path

This piece's paths:
- engine/src/predicate.rs
- engine/tests/filter_type_admission.rs
- the new form, governance/forms/engine/ARITHMETIC-TEXT-LITERAL-BESIDE-NULL-REASON-PREREGISTRATION.md
- the custodian's rows in governance/PLAN.yaml and state/FILLER-QUEUE.md

| In flight at 67c0049e95f80b4c572e043d7e69a721db78d746 (the brief's lists) | Overlap |
|---|---|
| `cut/literal-only-float-integer-arithmetic-refused` (#284) | Both code files overlap. This node depends on it, and no code starts before it merges. At dispatch #284 must be merged, and the base is main after that merge. |
| `cut/publish-session-tier-identity` (engine/src/identity.rs, KNOWN-LIMITATIONS.md) | None. |
| `cut/port-2-macos-l1-and-app-dirs` (engine/src/app_dirs.rs, lib.rs, lod.rs, four lod_tier tests, KNOWN-LIMITATIONS.md) | None. Contact only: engine/src/lib.rs re-exports what T1 imports, and this piece adds no re-export. |
| `cut/publish-filter-sentence-under-whole-dataset` | None under engine/. |
| `cut/b2-piece-1c-save-and-reopen` | None under engine/. |
| `cut/walkthrough-rows-stale-against-main-sweep-area-b` | None. |
| `cut/b1-shell-half-pr-c` | 0 files. |

Nothing touches protocol/. The path lists are the brief's; I cannot read branches.

**The owner's index needs no line** (OPEN-4 (a)). No interface, pinned test, limit or ceiling pointer changes. The filter-admission row (engine/README.md:542 @ 67c0049e95f80b4c572e043d7e69a721db78d746 sha256:aa036a5c31bb6edb516bf26d2fb9ab830b046a8368a29e748b3d48e6ba6148aa) still points truly. Under the index rule (engine/README.md:535 @ 67c0049e95f80b4c572e043d7e69a721db78d746 sha256:41f836437120efcc22e26a2cf504a6ec6e5ca415053ec81e11665b8b467b108a), only a change to what a pointer points to needs an update.

**A finding outside this piece, not fixed here:** 8b's form is absent from the index's preregistration list (engine/README.md:557 @ 67c0049e95f80b4c572e043d7e69a721db78d746 sha256:3526b3f7cf585ef49e917ae07f78250740ac2ae2f423a89fb165cedb7f1b3ccc).

## OPEN items

**OPEN-1, the selector.** Not a red line, so it is taken under item 4.
- (a) Recommended: the new sentence when an entry's leading type name is VARCHAR or BOOLEAN. It names what the new sentence describes, and leaves W-1 on the float pairs the human narrowed it to (8b's Amendment 2, governance/forms/engine/TYPE-WALK-RULE2-RESIDUAL-REASONS-PREREGISTRATION.md:184 @ 67c0049e95f80b4c572e043d7e69a721db78d746 sha256:bc3f6724d42971045eb1d2e023e994f29ffb1df92691d4d3d5c330968ca04f9f).
- (b) The new sentence when no entry's leading type name is REAL or DOUBLE. It gives the same result on every reachable pair by my reading, and differs only on a residual that does not exist today.
- (c) A field on the variant. This is a contract change, so it goes to the custodian as a question, not as a choice. Not recommended.

**OPEN-2, the new sentence's words.** A red line: P6 strings are the human's.
- (a) Recommended, 8b's OPEN-2 precedent: the placeholder lands now, written by the worker from the built code and clause-checked by both gates, and the human words it at the sitting with W-1.
- (b) The human words it before code.

Because §36 already lands P6 placeholders, (a) needs no ruling to proceed. The words themselves wait for the human.

**OPEN-3, the BOOLEAN shapes.** Not a red line: the evening ruling, item 5, sends (c) to this node.
- (a) Recommended: one new sentence covers the text and the BOOLEAN residuals, and any B9 to B16 or C1 to C5 row that reaches the walk is a T1 row.
- (b) Text only, with BOOLEAN residuals left on W-1 and recorded. That leaves a false sentence in place, against the node's purpose.

**OPEN-4, the owner's index.** Not a red line.
- (a) Recommended: no engine/README.md line, as 8b had none. Scope stays at 2 files.
- (b) This form joins the preregistration list, a third file of about 2 lines. Listing 8b's form too would be a separate drift fix.

**OPEN-5, 8b's T1 name** (`every_conversion_rounds_refusal_states_a_conversion_refused_by_type`). Not a red line.
- The name says "every", but the doc it carries says each of its eleven predicates (engine/tests/filter_type_admission.rs:557-561 @ 67c0049e95f80b4c572e043d7e69a721db78d746 sha256:67d948cbd649a9e4698f00e0ba5c483390e56bedb81bbaea40e9ca45080763ad).
- (a) Recommended: leave the name. Renaming it breaks 8b's form's claimed test name. The gate reads it by its doc. Section 4 already requires the new sentence to say the refusal is by type.
- (b) Also require the new sentence to state a conversion. This would constrain words that are the human's at P6. Not recommended.

## What I could not settle

- The binder's outcomes for A1 to C5 at DuckDB v1.5.5. P-0 decides them.
- The exact text and line numbers of `sentence`'s doc after #284 merges. I read #284 only through its records (8c's Amendment 1 and both gate-1 reports), not its branch.
- Whether any test at #284's merge asserts the Display of a VARCHAR or BOOLEAN `conversion_rounds` refusal. The worker's grep at the base decides, and a hit is a stop.
- FILTER-BIND's invalidator speaks of the "five-reason" sentences (governance/forms/engine/FILTER-BIND-COERCIONS-PREREGISTRATION.md:376 @ 67c0049e95f80b4c572e043d7e69a721db78d746 sha256:5449d5966f4399321a2caaece17136c92d25ac0bc3bf11cd4bb5a8a4f2511959). I read a second sentence under one of the five reasons as inside it. That reading is for the architect.
- The line count and the node's 60-minute budget are both unmeasured: 28 probe predicates, one warm debug build, two mutation runs and the suite.

## The custodian's settlement (class 1, before any code)

- **OPEN-2, a red line, is the human's:** "8d's placeholder is worded at the sitting." (`state/directives/2026-11-06-u12-e2e-on-5400-u1-size-accepted-tier-folder-node-review-packet-decisions.md`, item 1). So (a): the placeholder lands under §36, written by the worker from the built code at section 4's places and checked clause by clause by both gates; its words wait for the human at the sitting, with W-1.
- **OPEN-1: (a), OPEN-3: (a), OPEN-4: (a) and OPEN-5: (a)**, each taken on 2026-11-06 (the direction of 2026-10-31, item 4, `state/directives/2026-10-31-away-until-11-04-clicks-from-the-app-270-size-o0-file-open-items-take-recommendation.md`, held until 2026-11-09 by `state/directives/2026-11-03-away-until-11-09-276-open-1-seven-clauses-open-4-c-placed-sitting-wording-leaves-slot-cloud-credit.md`, line 6); the human reviews each on return and may reverse it, a reversal recorded, never edited in.
- **The read commit and the base.** #284 merged after the read, at 6a63710db0f8e79a52c1b48fe3333dc8f8b01f26, and `git diff --name-only 67c0049e 6a63710d` names three files the draft cites: `engine/README.md`, `engine/src/predicate.rs` and `engine/tests/filter_type_admission.rs`. Their cites above stay pinned at the read commit. Mapped by script to the base, each by an exact match of its cited lines found once there:
  - `engine/src/predicate.rs:382-387` → engine/src/predicate.rs:382-387 @ 6a63710db0f8e79a52c1b48fe3333dc8f8b01f26 sha256:e57946a4d22150cec9a129f62d9fc60c8aae9ce32faf4d5340f9e2cd02c4d008
  - `engine/src/predicate.rs:1448-1451` → engine/src/predicate.rs:1450-1453 @ 6a63710db0f8e79a52c1b48fe3333dc8f8b01f26 sha256:86ed8424b5334b84e605e3a84e0c9b935959cd7af7cfd7ea4639eaa65a3778f4
  - `engine/tests/filter_type_admission.rs:568-630` → engine/tests/filter_type_admission.rs:568-630 @ 6a63710db0f8e79a52c1b48fe3333dc8f8b01f26 sha256:12c8d49af9795bad01b2180cbc4ee41d9a31aa5b9630d4f9417459494d506bca
  - `engine/src/predicate.rs:189` → engine/src/predicate.rs:189 @ 6a63710db0f8e79a52c1b48fe3333dc8f8b01f26 sha256:3a07571533cc3e3efbff9261956eba95055908f4b583c8f3c732a2346763c870
  - `engine/src/predicate.rs:2066-2068` → engine/src/predicate.rs:2072-2074 @ 6a63710db0f8e79a52c1b48fe3333dc8f8b01f26 sha256:e2be79eda0e71c5d831fb6054d834b2b11bea73e9a497317f62766a57218e2df
  - `engine/src/predicate.rs:2079-2084` → engine/src/predicate.rs:2085-2090 @ 6a63710db0f8e79a52c1b48fe3333dc8f8b01f26 sha256:9cb58ef11a5ad66b0f8a0cd035a6851670801b781170810331cace84c061dc6d
  - `engine/src/predicate.rs:2268-2277` → engine/src/predicate.rs:2289-2298 @ 6a63710db0f8e79a52c1b48fe3333dc8f8b01f26 sha256:6f093fc524b9adf6d242a4e61cfccadb3f6bd6269b296fbd2b3fe35a63d0e2d8
  - `engine/src/predicate.rs:1509-1512` → engine/src/predicate.rs:1511-1514 @ 6a63710db0f8e79a52c1b48fe3333dc8f8b01f26 sha256:c3415a30421da0d79c9d73a33b857e8c2315dd11ac9df9382d66c7a7d10ba04a
  - `engine/src/predicate.rs:2301` → engine/src/predicate.rs:2322 @ 6a63710db0f8e79a52c1b48fe3333dc8f8b01f26 sha256:be11179a0b0aa8c2e93b0dfee21d9fe60ed57fd4fed753f7e8f206b4779b575a
  - `engine/src/predicate.rs:1950-1958` → engine/src/predicate.rs:1952-1960 @ 6a63710db0f8e79a52c1b48fe3333dc8f8b01f26 sha256:f3d6655ef1a17bd4019bf343711b6a8d68705bcd2c396c593fc5a1e9674fde93
  - `engine/src/predicate.rs:1440` → engine/src/predicate.rs:1442 @ 6a63710db0f8e79a52c1b48fe3333dc8f8b01f26 sha256:91949b76a1115b5c815d35230f201f99e85c5e556edaae3c3de8c7af905bb7c1
  - `engine/src/predicate.rs:386` → engine/src/predicate.rs:386 @ 6a63710db0f8e79a52c1b48fe3333dc8f8b01f26 sha256:ed517103d4213461ecb96fc29f0a92b12819ac12d9e75b9f25157a48b7236070
  - `engine/src/predicate.rs:1420-1428` → engine/src/predicate.rs:1420-1428 @ 6a63710db0f8e79a52c1b48fe3333dc8f8b01f26 sha256:d10d43507bfef211eea6a55a4f6bd5dd5d2b58b06b33301fc2b341c85f57e92b
  - `engine/src/predicate.rs:1558-1565` → engine/src/predicate.rs:1560-1567 @ 6a63710db0f8e79a52c1b48fe3333dc8f8b01f26 sha256:4d62711be3a75d1fd26f08b9a12eb168ee258aaebc6c9100fd1f53d7b0af268e
  - `engine/src/predicate.rs:1486-1507` → engine/src/predicate.rs:1488-1509 @ 6a63710db0f8e79a52c1b48fe3333dc8f8b01f26 sha256:e594544365fb94cfb6cfe9a14220f01cd62c9bb12848751d536dfa49d48b8037
  - `engine/src/predicate.rs:2086-2088` → engine/src/predicate.rs:2092-2094 @ 6a63710db0f8e79a52c1b48fe3333dc8f8b01f26 sha256:c05e9b2e6b2e4922967ef273a3d860314e1d6f31a4536c1ff97005e11e79fdf6
  - `engine/src/predicate.rs:2298-2300` → engine/src/predicate.rs:2319-2321 @ 6a63710db0f8e79a52c1b48fe3333dc8f8b01f26 sha256:fdb6bd2ccdb6bdb38aed9658ffe180404e3e0ac552e5d736f4399fdd968df209
  - `engine/src/predicate.rs:1396-1399` → engine/src/predicate.rs:1396-1399 @ 6a63710db0f8e79a52c1b48fe3333dc8f8b01f26 sha256:3aa5c22f6666d668bd696a3509dc9c542a1e123518dbc2c556503fe72564d110
  - `engine/src/predicate.rs:1412` → engine/src/predicate.rs:1412 @ 6a63710db0f8e79a52c1b48fe3333dc8f8b01f26 sha256:3fd814b23882c2b4fe4aae360148d103257825642ea7cef0fd428aba1bc867b6
  - `engine/tests/filter_type_admission.rs:598-627` → engine/tests/filter_type_admission.rs:598-627 @ 6a63710db0f8e79a52c1b48fe3333dc8f8b01f26 sha256:4ad3b8e6d073bb6acb415168eccc8c4f5f284c400a14b3eb913fa6e26527f71f
  - `engine/tests/filter_type_admission.rs:22-27` → engine/tests/filter_type_admission.rs:22-27 @ 6a63710db0f8e79a52c1b48fe3333dc8f8b01f26 sha256:aaa43b2e2f13e9b044ea569cf9506f840fef73861858bdf15751f0d7382f034b
  - `engine/tests/filter_type_admission.rs:73-79` → engine/tests/filter_type_admission.rs:73-79 @ 6a63710db0f8e79a52c1b48fe3333dc8f8b01f26 sha256:d456f37f9b4e2e6615f1ebfdab5c4116b6b410c26abae0ba4dbdeeb2eea1b558
  - `engine/tests/filter_type_admission.rs:53-70` → engine/tests/filter_type_admission.rs:53-70 @ 6a63710db0f8e79a52c1b48fe3333dc8f8b01f26 sha256:e3d3736558264dd027a467fb7bf83b01c5668a039ec0c1be0b4a25c9bea36f22
  - `engine/README.md:542` → engine/README.md:542 @ 6a63710db0f8e79a52c1b48fe3333dc8f8b01f26 sha256:aa036a5c31bb6edb516bf26d2fb9ab830b046a8368a29e748b3d48e6ba6148aa
  - `engine/README.md:535` → engine/README.md:535 @ 6a63710db0f8e79a52c1b48fe3333dc8f8b01f26 sha256:41f836437120efcc22e26a2cf504a6ec6e5ca415053ec81e11665b8b467b108a
  - `engine/tests/filter_type_admission.rs:557-561` → engine/tests/filter_type_admission.rs:557-561 @ 6a63710db0f8e79a52c1b48fe3333dc8f8b01f26 sha256:67d948cbd649a9e4698f00e0ba5c483390e56bedb81bbaea40e9ca45080763ad
  - Not found at the base, because #284 rewrote them: `engine/src/predicate.rs:1430-1453`, `sentence` and its doc, at the base engine/src/predicate.rs:1430-1455 @ 6a63710db0f8e79a52c1b48fe3333dc8f8b01f26 sha256:6dd188e7d9932e874f276b2f4f4160ad4bc008f920583d046d7293506c1bb7e7, its doc ending with the reviewer's D-1 words; and `engine/README.md:557`, the preregistration list, to which #284 added its own form, at the base engine/README.md:557 @ 6a63710db0f8e79a52c1b48fe3333dc8f8b01f26 sha256:0e2db73529f986c3097957156937c155e9c6221acecd87aed61ecfa20b06136a, still without 8b's form (note 6's finding stands at the base).
- **The draft's third unsettled item, read at the base by the custodian:** of the tests under `engine/tests/`, only one line holds W-1's `can round` text, inside 8b's T1 (engine/tests/filter_type_admission.rs:569-630 @ 6a63710db0f8e79a52c1b48fe3333dc8f8b01f26 sha256:7897c9dd520da9555413c0855d58e904a6e2e944c739ec46212dad3c2a8e6d55), and that test's rows name no VARCHAR or BOOLEAN operand. The worker's grep at the base still decides, and a hit is a stop (the Out-of-scope line).
- **Rule (00),** by git at main 4994421c (`git diff --name-only origin/main...<branch>` over `cut/publish-session-tier-identity`, `cut/publish-filter-sentence-under-whole-dataset`, `cut/port-2-macos-l1-and-app-dirs`, `cut/b2-piece-1c-save-and-reopen`, `cut/b1-shell-half-pr-c`; no PR is open): none touches `engine/src/predicate.rs`, `engine/tests/filter_type_admission.rs`, this form or any path under `protocol/`. It is checked again at dispatch.
- **Not settled by the draft, and proven by the piece's own runs:** P-0's outcomes and the rows T1 takes from them, M-1, M-2, the placeholder's clause check and the size. The base is main after #284's merge; the worker's checkout starts at the main commit it is dispatched at.

## Amendments (opens empty; append-only)

**Amendment 1 (2026-11-06, class 1, before any code; written after P-0's run was seen).** P-0 ran at 0c84b816416bc1611649cf91415d9fc69f3693a6 (the worker's report, `state/consults/2026-11-06-arithmetic-text-literal-beside-null-reason-worker-report.md`; `duckdb` and `libduckdb-sys` 1.10505.0 by Cargo.lock) and met S-5: B9 to B12 and C1 to C4, a BOOLEAN literal beside a BOOLEAN literal or beside NULL, are refused before the walk as `ConstructNotAdmitted { construct: "CAST" }`. S-1 to S-4 were not met. The custodian settles the stop:
1. An outcome `ConstructNotAdmitted` is recorded and gets no T1 row, as a binder refusal does (section 1, "Not stops"). Every other outcome stays S-5.
2. T1's rows are the four P-0 predicates refused `TypeNotAdmitted` with `ConversionRounds`, in the table's order: K1, K2, K3 and A2; then the two controls. K4, A1, A3, B1 to B8, B13 to B16 and C5 are binder refusals and get no row.
3. OPEN-1 (a) stands: the selector routes a refusal one of whose entries has the leading type name VARCHAR or BOOLEAN. At this DuckDB no predicate of the 28 brings a BOOLEAN operand to the walk. The selector's comment (section 4, item 2) says so, naming the binder-refused rows and the CAST-refused rows apart, with the version; the new sentence stays true of every pair the selector routes to it (section 4, item 3).
4. Section 4, item 2's "DuckDB v1.5.5" reads as the version Cargo.lock names, 1.10505.0.
5. Outside this piece, for the human: shape (c) of the architect's shapes (a BOOLEAN literal beside NULL; the evening ruling of 2026-11-05, item 5) never reaches `conversion_rounds`. It is refused as the construct `CAST`, a word the predicate as written does not contain. Whether that refusal's sentence is true of it, and whether a BOOLEAN literal elsewhere is refused the same way, are not this piece's questions and were not probed; this piece's sentence does not reach it.

Nothing else in the form changes: Scope, the budget, M-1 (still predicted to fail T1 at row K1) and M-2 stand.
