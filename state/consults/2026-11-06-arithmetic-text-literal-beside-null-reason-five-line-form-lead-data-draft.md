*Custodian's filing note (2026-11-06): lead-data's read-only draft of the five-line form for filler entry 8d, `arithmetic-text-literal-beside-null-reason` (S3), drafted ahead at main 67c0049e while #284 (8c), which edits the same two files, awaited the click. Its brief by file (sha256 56e8c2806c8a7f299997dd5a42e572220a1ffa666f58c755b2737bec3d5ad038), carrying the human's Part 1 rulings of 2026-11-05 by reference and the reuse index's output byte for byte. The run 04:07:29Z to 04:15:44Z by its transcript (claude-opus-5-5; unique calls Read 32, Grep 16, Glob 1 and the hand-back, 50, equal to the notification's; no write tool). Extracted by script from the hand-back in that transcript (28041 bytes, sha256 a5042b35b89d3e60e4dd2370da056c1a4bfa14ce9ea21320258c6e7c0fe8f8bc); nothing is changed. #284 merged at 6a63710d after the read; the form is committed from this draft in a later commit, with its cites pinned and the spans #284 moved mapped there. A draft, not Authority.*

---

Draft: arithmetic-text-literal-beside-null-reason five-line form, lead-data

Nothing blocks the draft. The five-line route holds on my reading (section 3 below). One OPEN item is a red line: OPEN-2, the new P6 sentence's words. It does not hold the piece, because §36 already lands the placeholder and the words are the human's at the sitting.

REPORT PATH: C:/dev/spatial-ide/state/consults/2026-11-06-arithmetic-text-literal-beside-null-reason-five-line-form-lead-data-draft.md. I have no shell, so this report has no sha256, and I could not check the brief's hash either. I left no background shell and wrote no file. Everything was read on the main checkout at 67c0049e95f80b4c572e043d7e69a721db78d746, written C below. Every cite `path:line @ C` means that commit. Self-references are by section. Everything is my own wording unless it is marked as byte-copied.

## The five lines

```
Authority: PLAN node `arithmetic-text-literal-beside-null-reason` (governance/PLAN.yaml:4210-4226 @ 67c0049e95f80b4c572e043d7e69a721db78d746), generation 1; filler queue entry 8d, S3 (state/FILLER-QUEUE.md:28 @ 67c0049e95f80b4c572e043d7e69a721db78d746); placed by the human's ruling of 2026-11-05, item 3 (state/directives/2026-11-05-platform-runs-filed-c1-governance-next-fixtures-kernel-node-8b-route-a-f-b-after-8c.md:10 @ 67c0049e95f80b4c572e043d7e69a721db78d746), and given the architect's shapes (a) to (c), with `/` named and probed first, by the ruling of 2026-11-05 (evening), item 5 (state/directives/2026-11-05-8c-full-form-nine-s2-placed-u12-slot-2-u1-reproducer-adr-notes-words-e2e-readme-words-8b-d3.md:27 @ 67c0049e95f80b4c572e043d7e69a721db78d746; the shapes at state/consults/gates/2026-11-05-type-walk-rule2-residual-reasons-gate1-architect.md:39-44 @ 67c0049e95f80b4c572e043d7e69a721db78d746); origin F-B of entry 8b's form (governance/forms/engine/TYPE-WALK-RULE2-RESIDUAL-REASONS-PREREGISTRATION.md:96-98 @ 67c0049e95f80b4c572e043d7e69a721db78d746, with its Amendments 1, 2 and 4); the filler rule, AUTONOMY.md §36 (governance/AUTONOMY.md:692 @ 67c0049e95f80b4c572e043d7e69a721db78d746): a five-line form under §21c, the reviewer and the architect gating from dispatch, round 25, item 2 (e) set aside, its strings a user sees P6 placeholders; the human's rulings on gate rounds of 2026-11-05, Part 1, items 1 to 9, by reference (state/directives/2026-11-05-main-architect-gate-rounds-part-1-rulings-review-packet-design-part-3-additions.md:28-64 @ 67c0049e95f80b4c572e043d7e69a721db78d746); OPEN items that are not red lines are taken under the direction of 2026-10-31, item 4 (state/directives/2026-10-31-away-until-11-04-clicks-from-the-app-270-size-o0-file-open-items-take-recommendation.md:14 @ 67c0049e95f80b4c572e043d7e69a721db78d746), held until 2026-11-09 (state/directives/2026-11-03-away-until-11-09-276-open-1-seven-clauses-open-4-c-placed-sitting-wording-leaves-slot-cloud-credit.md:6 @ 67c0049e95f80b4c572e043d7e69a721db78d746); the reuse index found no prior art on either search (text literal null arithmetic; type walk refusal reason sentence), a miss noted here; no code starts before PR #284 (8c, this node's depends_on) merges.
Scope: 2 files: engine/src/predicate.rs (`TypeRefusalReason::sentence` and its doc, engine/src/predicate.rs:1430-1453 @ 67c0049e95f80b4c572e043d7e69a721db78d746, a span PR #284 rewrites, so cited by item; in the `TypeNotAdmitted` arm of `FilterError`'s Display, engine/src/predicate.rs:382-387 @ 67c0049e95f80b4c572e043d7e69a721db78d746, only its call of `sentence`; one new private selector function) and engine/tests/filter_type_admission.rs (one new test, T1); declared line budget 140 (insertions plus deletions, comments and tests counted, governance/AUTONOMY.md:357 @ 67c0049e95f80b4c572e043d7e69a721db78d746); this form exempt; unchanged: every other sentence arm, W-1's string (engine/src/predicate.rs:1448-1451 @ 67c0049e95f80b4c572e043d7e69a721db78d746), every reason variant, `wire_value`, the precedence, every `Typed` field, `render`, every admission rule, every `FilterError` field and the Display format string; unchanged: 8b's T1, and every B-T1, B-T1b, B-T3 and 8c row, count, name and assertion; no new `pub` item; no edit to engine/src/lib.rs, Cargo.toml or Cargo.lock; no file under kernel/, protocol/, frontends/ or renderer/; no KNOWN-LIMITATIONS.md item; no engine/README.md line.
Change: every `skp.filter_type_not_admitted` refusal whose reason is `conversion_rounds` and one of whose `operand_types` entries names VARCHAR or BOOLEAN as its type ends its Display, and so its wire `message` (protocol/skp/SKP-V0.md:346-347 @ 67c0049e95f80b4c572e043d7e69a721db78d746), with a second `[P6 placeholder]` sentence of that reason instead of W-1, which is false of it; `TypeRefusalReason::sentence` chooses between the two from the refusal's own `operand_types`; every other refusal's Display, W-1's string, the five reason values, and every admission outcome, code, `construct`, `operand_types` and `reason` are unchanged.
Tests+mutation: before any code, P-0 (a throwaway test on FX-1, never committed, run at the branch base on the worktree's own target under a shared hold): the 28 predicates of the draft's probe table, each run once through `AdmittedPredicate::admit`; each outcome recorded in full (for a binder refusal the first line of its Display; for a `TypeNotAdmitted` its construct, operand types, reason and whole Display), with Cargo.lock's duckdb and libduckdb-sys versions and the 40-hex base commit; its stops are the table's S-1 to S-5, each sent to the custodian with no code written. T1 every_conversion_rounds_refusal_over_a_text_or_boolean_operand_carries_its_own_sentence (new, engine/tests/filter_type_admission.rs): it covers each P-0 predicate refused `TypeNotAdmitted` with `ConversionRounds`, in the table's order, plus the controls `f32 > NULL + 100000` and `i32 + f32 > 0`; for each it asserts the real `PredicateAdmitError::Filter(FilterError::TypeNotAdmitted { .. })` with the construct, operand types and reason P-0 recorded, and a Display equal to the Display format (engine/src/predicate.rs:382-387 @ 67c0049e95f80b4c572e043d7e69a721db78d746) carrying the new sentence on the P-0 rows and W-1 on the controls; then FX-1's sha256. M-1: the selector removed, so every `ConversionRounds` refusal carries W-1; predicted to fail exactly T1 in a run of the whole binary, by name at its Display assertion on its first row, `'1' + NULL > 0`. M-2: the selector made to choose the new sentence for every `ConversionRounds` refusal; predicted to fail exactly T1, at the control `f32 > NULL + 100000`, and 8b's T1 (engine/tests/filter_type_admission.rs:568-630 @ 67c0049e95f80b4c572e043d7e69a721db78d746), at the same predicate. Each mutation is observed in a debug build on the branch's code commit, recorded by name with the 40-hex commit in a `RECORDED MUTATION:` doc line on T1, and reverted; a verify-mutation run is not an observation. T1 has no sleep, retry, timeout, `#[ignore]` or `cfg`, and runs in `cargo test --workspace --locked` on both L1 entries (.github/workflows/product-ci-rust.yml:195 @ 67c0049e95f80b4c572e043d7e69a721db78d746, :197, :234).
Out-of-scope: ADR: no status line, Note or amendment; ADR-021's Notes keep their text, their admitted and refused classes, their twelve codes and their five reason values, and no admission outcome moves; security: nothing ADR-020, ADR-009 or ADR-021 governs, and admission is unchanged; wire: no SKP code, field, reason value or literal, nothing under protocol/, FX-4 (a `text_with_non_text` message) unchanged, kernel's `filter_error_of` (kernel/src/skp.rs:2351-2379 @ 67c0049e95f80b4c572e043d7e69a721db78d746) unchanged, and the `message` change is a Display wording change, which O-4 places outside the wire (state/directives/B-1-RULINGS-AND-TYPED-TEXTS-2026-09-30.md:10 @ 67c0049e95f80b4c572e043d7e69a721db78d746); guarantee: none changed, "touched" read as changed; no test at the base asserts the Display of a `conversion_rounds` refusal with a VARCHAR or BOOLEAN operand (the worker greps the base before code, and a hit is a stop); FILTER-BIND's reason-sentence invalidator (governance/forms/engine/FILTER-BIND-COERCIONS-PREREGISTRATION.md:376 @ 67c0049e95f80b4c572e043d7e69a721db78d746) is disclosed as a contact, which this change makes hold of more refusals; the sentence a user sees is a P6 placeholder, and §21c's fourth bound is met through §36's P6 clause, on 8b's OPEN-4 (A) precedent (governance/forms/engine/TYPE-WALK-RULE2-RESIDUAL-REASONS-PREREGISTRATION.md:164 @ 67c0049e95f80b4c572e043d7e69a721db78d746); the five-line form stands under §36.
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
- What: a throwaway `#[test]` appended to engine/tests/filter_type_admission.rs with the Edit tool. It is never committed. Each predicate is sent once through the real `AdmittedPredicate::admit` over FX-1. FX-1's text column is `zone` and its BOOLEAN column is `flag` (engine/src/fixture.rs:659-674 @ C).
- Afterwards: the file is restored to its sha256 at the base, and the porcelain is empty.

**What is recorded, per predicate:**
- the outcome variant;
- for `RejectedByBinder`, the first line of the Display;
- for `TypeNotAdmitted`, the construct, the operand types, the reason and the whole Display;
- once per run: Cargo.lock's `duckdb` and `libduckdb-sys` versions, the 40-hex base commit and the result line.

**Stages inside `admit`.** The binder runs before the walk (engine/src/predicate.rs:189 and :195 @ C). So a binder refusal means the walk never sees the shape.

**The walk, by my reading** (refusal construct, operand types, reason):
- `+`, `-` and `*`: VARCHAR or BOOLEAN beside NULL or beside its own type matches no rule.
  - Rule 1 covers REAL and DOUBLE only (engine/src/predicate.rs:2066-2068 @ C).
  - Rule 2 is guarded by `is_numeric` (engine/src/predicate.rs:2079-2084 @ C).
  - The pair then falls through to `determine_reason`. Its text item and its BOOLEAN item both exclude a NULL partner and need differing types (engine/src/predicate.rs:2268-2277 @ C). VARCHAR, BOOLEAN and NULL literals are within bounds (engine/src/predicate.rs:1509-1512 @ C). So the pair reaches the residual (engine/src/predicate.rs:2301 @ C).
- `/`: `type_of_division` sends any VARCHAR or BOOLEAN operand to the same `determine_reason` (engine/src/predicate.rs:1950-1958 @ C).

**The 28 predicates.** "Observed" cites a record; every other row is a hypothesis.

| Row | Predicate | Binder | If the walk sees it |
|---|---|---|---|
| K1 | `'1' + NULL > 0` | passes (observed: 8b's P-0, state/consults/2026-11-04-type-walk-rule2-residual-reasons-worker-report.md:21-23 @ C; 8c's reviewer, state/consults/gates/2026-11-06-literal-only-float-integer-arithmetic-refused-gate1-reviewer.md:18 @ C) | TNA `+`, VARCHAR literal / NULL literal, ConversionRounds (observed) |
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
- **S-4:** any `TypeNotAdmitted` Display at the base does not end with W-1. #284 was barred from changing W-1 (governance/forms/engine/LITERAL-ONLY-FLOAT-INTEGER-ARITHMETIC-REFUSED-PREREGISTRATION.md:256 @ C), so this would mean the base is not what this form reads.
- **S-5:** any outcome other than `RejectedByBinder` or `TypeNotAdmitted`.

**Not stops: these change only T1's rows.**
- Any A, B or C row the binder refuses gets no T1 row. It is recorded, and the selector still covers it by reading.
- Any A, B or C row that reaches the walk as the table says becomes a T1 row.
- If K4 reaches the walk, it becomes a T1 row and is recorded.
- If B9 to B16 or C1 to C5 reach the walk, they are T1 rows, under OPEN-3 (a).

**Where the record lives.** T1's rows follow from P-0's record by rule, so no class 1 amendment is needed before code. The record lives in the worker's report, and the closing amendment cites it.

## 2. The change, stated before it is applied

**A second sentence under the same wire value is possible without a new reason value.**
- `sentence` is private (engine/src/predicate.rs:1440 @ C).
- Its only caller is the `TypeNotAdmitted` arm of `FilterError`'s Display (engine/src/predicate.rs:386 @ C). A search for `.sentence(` over engine, kernel, protocol and frontends found no other call.
- That arm already holds `operand_types`. So `sentence` can take the refusal's operand types and choose its text from them. The enum's variants, `wire_value` (engine/src/predicate.rs:1420-1428 @ C) and every field stay as they are.

**What decides which text a refusal gets: the refusal's own `operand_types` (OPEN-1).**
- My proposal: the new sentence when the reason is `ConversionRounds` and an entry's leading type name is exactly VARCHAR or BOOLEAN. In every other case, W-1.
- The entries are `render`'s output: the `EngineType` name, then optionally a space and `literal` or `expression` (engine/src/predicate.rs:1558-1565 @ C). The names form a closed set (engine/src/predicate.rs:1486-1507 @ C). Neither VARCHAR nor BOOLEAN begins any other name, so the selector compares the token before the first space for equality, never by prefix.

**Why the selector is complete, by my reading.** Every `ConversionRounds` refusal with no REAL or DOUBLE operand has a VARCHAR or BOOLEAN operand:
- integer beside integer within bounds is admitted (engine/src/predicate.rs:2086-2088 @ C, :2195-2197);
- a `Decimal` beside an integer or a decimal in arithmetic is `ConversionCanFail` (engine/src/predicate.rs:2298-2300 @ C);
- NULL beside a numeric operand is admitted (engine/src/predicate.rs:2079-2084 @ C).

The converse also holds. Every residual with a REAL or DOUBLE operand has no VARCHAR or BOOLEAN operand, because text or BOOLEAN beside a float hits items 1 or 2 first. This agrees with the architect's Check 1 (state/consults/gates/2026-11-05-type-walk-rule2-residual-reasons-gate1-architect.md:46-61 @ C).

**Routes I rejected, each a stop or a question for the human, not a choice:**
- *A field on `TypeNotAdmitted` that carries the walk's choice.* The variant's fields are public, and kernel builds the variant by struct literal (kernel/src/skp.rs:2931-2935 @ C). That is a contract change across modules.
- *A new Rust variant mapped to `conversion_rounds`.* It adds a reason at the Rust level, against the five fixed values (8b's note 2, route B: governance/forms/engine/TYPE-WALK-RULE2-RESIDUAL-REASONS-PREREGISTRATION.md:48 @ C).
- *Re-routing these pairs to `text_with_non_text` or `boolean_conversion`.* That changes the wire `reason`, a red line by 8b's Amendment 1 (governance/forms/engine/TYPE-WALK-RULE2-RESIDUAL-REASONS-PREREGISTRATION.md:177 @ C).
- *Rewording W-1.* W-1 is the human's (the evening ruling, item 5).

None of these is needed.

## 3. The route

**§21a** (governance/AUTONOMY.md:315-332 @ C):
- ADR: none.
- Security: nothing changes in admission. On 8b's precedent a Display wording change is outside ADR-021's posture, under either reading of the bullet's ADR-021 label; 8c's form records that ambiguity at governance/forms/engine/LITERAL-ONLY-FLOAT-INTEGER-ARITHMETIC-REFUSED-PREREGISTRATION.md:280 @ C.
- Wire: `message` is Display verbatim (protocol/skp/SKP-V0.md:346-347 @ C). Under O-4 a wording change never changes the wire. No code, field or reason value moves.
- Guarantee: no property under test moves, provided the base grep finds no Display assertion on a text or BOOLEAN `conversion_rounds` refusal. The only `can round` hits outside the records are 8b's T1 and W-1 itself, and neither has a text or BOOLEAN row. I could not read #284's branch; its records give T1 and T2 assertions of shape, construct, operand types and reason, not Display (governance/forms/engine/LITERAL-ONLY-FLOAT-INTEGER-ARITHMETIC-REFUSED-PREREGISTRATION.md:191-200 @ C). Hence the grep, which is a stop if it hits.
- My reading: none of the four categories is touched.

**§21c's four bounds** (governance/AUTONOMY.md:347-357 @ C):
- **Lines.** My estimate, not measured:
  - predicate.rs about 30 to 40: the selector and its comment about 15, the new placeholder string 3, the signature and the call 3, the doc rewrite about 12 with deletions counted;
  - the test file about 60 to 95: the body about 45, about 2 per row, the doc and two `RECORDED MUTATION:` lines.
  - Total about 90 to 135 against a declared budget of 140. If P-0 lets every A, B and C row reach the walk, the count may pass 140. That is class 6, with Scope not edited (governance/AUTONOMY.md:345 @ C). The short form stays, and both gates are already in place under §36.
- **Files:** 2 of 8.
- **No exposure surface and no dependency.**
- **User-visible behaviour:** the new sentence is a string the app shows. It is met through §36's P6 clause, on 8b's OPEN-4 (A), ruled 2026-10-26, and 8b's gate read it so (state/consults/gates/2026-11-05-type-walk-rule2-residual-reasons-gate1-architect.md:112 @ C).

**Conclusion.** The five-line route holds. Round 25, item 2 (e) is not tripped, because the Out-of-scope line asserts that none of the four categories is touched (docs/PREREGISTRATION-TEMPLATE.md:176 @ C).

## 4. Where the sentences about behaviour go (Part 1, item 1: places only, never words)

1. **`TypeRefusalReason::sentence`'s doc** (the span #284 rewrites; its last clause is the reviewer's D-1 words, applied at 7d8a7b05 per governance/forms/engine/LITERAL-ONLY-FLOAT-INTEGER-ARITHMETIC-REFUSED-PREREGISTRATION.md:323 @ C). After this piece that clause is false, because W-1 no longer reaches the text-beside-NULL shape. The doc must cover:
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
   - the enum's doc (engine/src/predicate.rs:1396-1399 @ C), which says the sentence lives only in `sentence`; it stays true if the selector is called inside `sentence`;
   - the `ConversionRounds` variant's doc (engine/src/predicate.rs:1412 @ C).

No sentence goes into an ADR, SKP-V0, KNOWN-LIMITATIONS.md, engine/README.md or the shell.

## 5. Tests and mutations

**T1 sits at the real boundary** (item 7):
- it calls the real `AdmittedPredicate::admit` on FX-1;
- it matches the real `PredicateAdmitError::Filter(FilterError::TypeNotAdmitted { construct, operand_types, reason })`;
- it checks the real Display through `to_string()`, against the format at engine/src/predicate.rs:382-387 @ C, the way 8b's T1 does (engine/tests/filter_type_admission.rs:598-627 @ C);
- it imports only what the file already imports (engine/tests/filter_type_admission.rs:22-27 @ C);
- it ends with FX-1's hash check (engine/tests/filter_type_admission.rs:73-79 @ C).

**The controls.** They are copied from 8b's T1 rows at :577 and :595, and their Display carries W-1. With them, M-2 fails T1 itself, so the selector is pinned from both sides.

**The mutations:**
- M-1 (the selector removed) fails T1 alone at row K1's Display.
- M-2 (the selector always picks the new sentence) fails T1 at its control row and 8b's T1 at its first row.

**Unchanged.** 8b's T1 and its name. B-T3 asserts reasons, not sentences. Kernel's B-T6 builds a `TextWithNonText` refusal (kernel/src/skp.rs:2929-2947 @ C), which the selector never reaches.

**Determinism and CI.** There is no sleep, retry, timeout, `#[ignore]` or `cfg`. The only shared state is FX-1's read-only `OnceLock` (engine/tests/filter_type_admission.rs:53-70 @ C). The test runs in `cargo test --workspace --locked` on the Windows and Linux L1 entries.

**Before any gate:** the full engine suite runs at the head and passes there (Part 1, item 4).

## 6. Rule (00), path by path

This piece's paths:
- engine/src/predicate.rs
- engine/tests/filter_type_admission.rs
- the new form, governance/forms/engine/ARITHMETIC-TEXT-LITERAL-BESIDE-NULL-REASON-PREREGISTRATION.md
- the custodian's rows in governance/PLAN.yaml and state/FILLER-QUEUE.md

| In flight at C (the brief's lists) | Overlap |
|---|---|
| `cut/literal-only-float-integer-arithmetic-refused` (#284) | Both code files overlap. This node depends on it, and no code starts before it merges. At dispatch #284 must be merged, and the base is main after that merge. |
| `cut/publish-session-tier-identity` (engine/src/identity.rs, KNOWN-LIMITATIONS.md) | None. |
| `cut/port-2-macos-l1-and-app-dirs` (engine/src/app_dirs.rs, lib.rs, lod.rs, four lod_tier tests, KNOWN-LIMITATIONS.md) | None. Contact only: engine/src/lib.rs re-exports what T1 imports, and this piece adds no re-export. |
| `cut/publish-filter-sentence-under-whole-dataset` | None under engine/. |
| `cut/b2-piece-1c-save-and-reopen` | None under engine/. |
| `cut/walkthrough-rows-stale-against-main-sweep-area-b` | None. |
| `cut/b1-shell-half-pr-c` | 0 files. |

Nothing touches protocol/. The path lists are the brief's; I cannot read branches.

**The owner's index needs no line** (OPEN-4 (a)). No interface, pinned test, limit or ceiling pointer changes. The filter-admission row (engine/README.md:542 @ C) still points truly. Under the index rule (engine/README.md:535 @ C), only a change to what a pointer points to needs an update.

**A finding outside this piece, not fixed here:** 8b's form is absent from the index's preregistration list (engine/README.md:557 @ C).

## OPEN items

**OPEN-1, the selector.** Not a red line, so it is taken under item 4.
- (a) Recommended: the new sentence when an entry's leading type name is VARCHAR or BOOLEAN. It names what the new sentence describes, and leaves W-1 on the float pairs the human narrowed it to (8b's Amendment 2, governance/forms/engine/TYPE-WALK-RULE2-RESIDUAL-REASONS-PREREGISTRATION.md:184 @ C).
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
- The name says "every", but the doc it carries says each of its eleven predicates (engine/tests/filter_type_admission.rs:557-561 @ C).
- (a) Recommended: leave the name. Renaming it breaks 8b's form's claimed test name. The gate reads it by its doc. Section 4 already requires the new sentence to say the refusal is by type.
- (b) Also require the new sentence to state a conversion. This would constrain words that are the human's at P6. Not recommended.

## What I could not settle

- The binder's outcomes for A1 to C5 at DuckDB v1.5.5. P-0 decides them.
- The exact text and line numbers of `sentence`'s doc after #284 merges. I read #284 only through its records (8c's Amendment 1 and both gate-1 reports), not its branch.
- Whether any test at #284's merge asserts the Display of a VARCHAR or BOOLEAN `conversion_rounds` refusal. The worker's grep at the base decides, and a hit is a stop.
- FILTER-BIND's invalidator speaks of the "five-reason" sentences (governance/forms/engine/FILTER-BIND-COERCIONS-PREREGISTRATION.md:376 @ C). I read a second sentence under one of the five reasons as inside it. That reading is for the architect.
- The line count and the node's 60-minute budget are both unmeasured: 28 probe predicates, one warm debug build, two mutation runs and the suite.
