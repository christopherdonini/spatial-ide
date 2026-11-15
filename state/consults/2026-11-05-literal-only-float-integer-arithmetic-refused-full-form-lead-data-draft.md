*Custodian's filing note (2026-11-05): lead-data's full-form draft for filler entry 8c, `literal-only-float-integer-arithmetic-refused`, on the human's ruling of 2026-11-05 (evening), item 1 (`state/directives/2026-11-05-8c-full-form-nine-s2-placed-u12-slot-2-u1-reproducer-adr-notes-words-e2e-readme-words-8b-d3.md`). Its brief by file (sha256 bc2f2fb3a516fd9eb0fa7e52dc8f6e6311f8d8390081c4d8f46fa92fd6d89c18), carrying the human's Part 1 rulings of 2026-11-05 by reference and the reuse index's output byte for byte; read at main 8b9193a1. The run 23:13:52Z to 23:23:21Z by its transcript (claude-opus-5-5; unique calls Read 41, Grep 25 and the hand-back, 67, equal to the notification's). Extracted by script from the hand-back in that transcript (37487 bytes, sha256 a0e6f0e50daec5e733cbb9498c4822abdc6e34966d3bd5e051dfcd5bbed33484); nothing is changed. The form is committed from it at `governance/forms/engine/LITERAL-ONLY-FLOAT-INTEGER-ARITHMETIC-REFUSED-PREREGISTRATION.md`. A draft, not Authority.*

---

Draft: literal-only-float-integer-arithmetic-refused full form, lead-data
Blocking questions: none. No new OPEN item.
Report path: C:/dev/spatial-ide/state/consults/2026-11-05-literal-only-float-integer-arithmetic-refused-full-form-lead-data-draft.md
sha256: none. I have no shell, so I computed no hashes. I say this once: every cite below is `path:line @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a` with no hash, left for the custodian's script to expand.

*How I worked: lead-data, read only. I read the main checkout's working tree. The session's start snapshot shows HEAD at 8b9193a1 with no tracked change, and I ran no git command. I read the brief whole, then both owner's indexes, my own five-line draft, the two rulings directives, PLAN's 8c and F-B nodes, FILLER-QUEUE.md, 8b's form, 8b's merged code and test, both gate-1 reports for #282, entry 9's form, the template, the architect's checks, AUTONOMY §21a to §21d, §25 and §36, FILTER-BIND §2.2 to §2.6 and §7, ADR-021's Notes, the type walk, B-T1, B-T1b, B-T3 and the property campaign. Everything below is in my wording, except the reuse block, which is copied byte for byte from the brief and marked as such. No other passage is marked verbatim. I wrote no file, I started no process, and I leave no background shell.*

---

# engine: literal-only `+`, `-`, `*` with a double literal beside an integer or decimal literal is admitted, as ADR-021's Note 2026-09-30 already states — full preregistration

## Header

- **Title.** In `+`, `-` and `*`, the type walk admits a DOUBLE literal beside an integer or decimal literal within the bounds, and types the result DOUBLE. Every other refusal keeps its code, reason and operand types.
- **Authority:**
  - PLAN node `literal-only-float-integer-arithmetic-refused` (governance/PLAN.yaml:4193-4209 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a), filler entry 8c, S3 (state/FILLER-QUEUE.md:27 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a).
  - **The route.** OPEN-1 (A) is the human's ruling of 2026-11-05 (evening), item 1 (state/directives/2026-11-05-8c-full-form-nine-s2-placed-u12-slot-2-u1-reproducer-adr-notes-words-e2e-readme-words-8b-d3.md:8 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a): the full form, both gates, in the filler slot, as entry 9 had (state/FILLER-QUEUE.md:32 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a); no ADR-021 text; it starts after #282, which is merged. The ruling sets aside §36's five-line condition for this piece (governance/AUTONOMY.md:692 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a). This is my reading of the ruling, not its words.
  - **Placement.** Placed S3 after 8b by the human's ruling of 2026-10-26 (state/directives/2026-10-26-clicks-260-261-244-r2-241-o1-answers-pb-draft-b-6d-260-lines-5b-8a-8b-rulings.md:32 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a). It follows 8b by the ruling of 2026-11-05, item 3 (state/directives/2026-11-05-platform-runs-filed-c1-governance-next-fixtures-kernel-node-8b-route-a-f-b-after-8c.md:10 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a).
  - **Origin.** Proposed as F-A by 8b's architect draft (state/consults/2026-10-26-type-walk-rule2-residual-reasons-five-line-form-architect-draft.md:93-97 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a; its OPEN-5 at :151).
  - **The human's rulings on gate rounds of 2026-11-05, Part 1, items 1 to 9**, by reference (state/directives/2026-11-05-main-architect-gate-rounds-part-1-rulings-review-packet-design-part-3-additions.md:28-64 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a). Item 1 (:28-32) governs §2.3. Item 7 (:58-62) governs §4.
  - **OPEN-2 to OPEN-5 settled.** Each takes the drafter's recommendation under the human's direction of 2026-10-31, item 4 (state/directives/2026-10-31-away-until-11-04-clicks-from-the-app-270-size-o0-file-open-items-take-recommendation.md:14 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a). That direction is held until 2026-11-09 (state/directives/2026-11-03-away-until-11-09-276-open-1-seven-clauses-open-4-c-placed-sitting-wording-leaves-slot-cloud-credit.md:6 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a). PLAN records them as taken 2026-11-05 (governance/PLAN.yaml:4208 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a). The human reviews each on return and may reverse it; a reversal is recorded, never edited in. Each is taken on 2026-11-05 under that direction:
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
- **Drafted by** lead-data, on the custodian's brief, read only at main 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a, from its own draft's section 8 outline (state/consults/2026-11-05-literal-only-float-integer-arithmetic-refused-five-line-form-lead-data-draft.md:199-242 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a).
  - Every restatement of a source in this form is lead-data's paraphrase. Nothing is marked verbatim except the reuse block above.
  - Self-references are by section only.
- **Committed before any code.** Append-only once committed. An amendment written after any outcome has been seen says so in its first line and names what it touches or invalidates.
- **Branch.** `cut/literal-only-float-integer-arithmetic-refused`, cut from main at dispatch, on its own checkout and its own new cargo target. It merges by merge commit, never a squash, so that the `RECORDED MUTATION:` commits stay reachable from main.

## §0 Disclosure

1. **Evidence, not Authority:** the reviewer's throwaway probe at ae4d94d4, the head of #282 before its words commit, now reachable on main through 540b4afd:
   - `1e3 + 5 > 0` was refused `TypeNotAdmitted`, construct `+`, operand types DOUBLE literal and INTEGER literal, reason `ConversionRounds` (state/consults/gates/2026-11-05-type-walk-rule2-residual-reasons-gate1-reviewer.md:68 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a);
   - `0.5 + 1e3 > 0` (a DECIMAL(2,1) literal beside a DOUBLE literal) was refused with the same reason (state/consults/gates/2026-11-05-type-walk-rule2-residual-reasons-gate1-reviewer.md:74 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a).
   - Both are `TypeNotAdmitted`, so both passed the surrogate prepare (governance/forms/engine/FILTER-BIND-COERCIONS-PREREGISTRATION.md:61 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a). The binder accepts both shapes.
2. **Everything else is reading at 8b9193a1, never run.** That covers the base outcomes of every other row in §3, every result type, and the two-DOUBLE-literal row.
3. **DuckDB.** Cargo.lock's `duckdb` and `libduckdb-sys` are 1.10505.0 (governance/forms/engine/TYPE-WALK-RULE2-RESIDUAL-REASONS-PREREGISTRATION.md:173 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a), which the forms call DuckDB v1.5.5. Every statement here about the binder is at that version, or is a labelled hypothesis.
4. **Hypothesis H-NEG** (discriminator: P-0, record only). DuckDB's parser folds a negated numeric literal into a constant, so `-1e3` and `-5` reach the walk as literals. If it does not, the walk sees them as unary `-` expressions, and the base may already admit `-1e3 + 5 > 0` and `1e3 + -5 > 0` (rules 6 and 5). Either way, this form claims nothing about negated operands (§1).
5. **No fixture-drive confound.** Nothing is measured, and the 5 GB fixture is not read.

## §1 What this preregistration may and may not claim

- **May claim, once §4 is green on CI's Windows and Linux L1 entries** (.github/workflows/product-ci-rust.yml:194-197 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a, :234), at libduckdb-sys 1.10505.0. For each of T1's eight predicates over FX-1:
  - `AdmittedPredicate::admit` admits it;
  - the walk types its arithmetic node DOUBLE, seen through the public refusal of `i64 = (<a>)`;
  - the binder types the same node DOUBLE (`typeof`);
  - its stream delivers exactly the predicted ids and ends without error.
  - T2's five refusals keep their construct, reason and operand types.
- **May not claim:**
  - any performance figure or docs/08 row;
  - any shape not in §3: negated operands (H-NEG), nested literal-only arithmetic, `/` (already admitted for any numeric operands, docs/adr/ADR-021-row-filter-on-viewport-query.md:264 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a), and comparisons of the new DOUBLE results against columns;
  - any other duckdb crate or DuckDB version;
  - macOS;
  - that W-1 is now true of every `conversion_rounds` refusal. The text-beside-NULL shape and the architect's shapes (a) to (c) stay outside it. They belong to F-B (governance/PLAN.yaml:4210-4225 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a; state/consults/gates/2026-11-05-type-walk-rule2-residual-reasons-gate1-architect.md:39-44 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a). None of those shapes has a float side (:44), so this piece neither reaches nor moves them.
- **ADR readings, none amended:**
  - ADR-021: no status line, Note or amendment, by the human's ruling (item 1).
    - The admitted pairs are those of the Note 2026-09-30, item 2 (docs/adr/ADR-021-row-filter-on-viewport-query.md:254-263 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a): its two-literals bullet (:261) under its arithmetic sentence (:263).
    - The exception at :263 names a decimal literal beside an integer or a decimal, never beside a double.
    - The Note 2026-10-03, item 2 (docs/adr/ADR-021-row-filter-on-viewport-query.md:274 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a) keeps a counted rule-2 result out of this arm (OPEN-3 (a)).
    - The twelve codes and five reason values stand (:267).
  - ADR-010 rule 6: no constant is added or changed.
  - ADR-006: admission is a pure check, and no undo class is touched.
  - ADR-018: no cancellation path is touched.
- **FILTER-BIND reading** (my reading; the form is immutable and is not edited):
  - §2.5(a) applies §2.3's rules pairwise (governance/forms/engine/FILTER-BIND-COERCIONS-PREREGISTRATION.md:89 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a).
  - §2.3 counts an integer literal within the bounds as an integer (:71).
  - Rule 6's second clause admits a double literal against an integer or decimal literal within the bounds (:77), as comparison rule 6(ii) already does in code (engine/src/predicate.rs:2227-2232 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a).
  - §2.5(a)'s double-literal bullet (:92), read alone, would bound the integer to 32 bits. OPEN-2 (i) reads it under :77 and the ADR's :261. That is why a BIGINT or HUGEINT literal within the bounds is admitted.
- **Wire:** no SKP code, field, reason value or literal, and nothing under `protocol/`. `filter_type_not_admitted` is sent for fewer predicates, and its shape is unchanged.
- **Strings:** none added or changed. W-1 (engine/src/predicate.rs:1448-1451 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a) stays a P6 placeholder. It no longer reaches the shapes in §3.
- **Portability:** not an OS-dependent feature, so no R3 item.

## §2 The change, stated before it is applied (engine only)

### 2.1 The rule

This is the table of outcomes, a prediction. It is not a sentence for the code.

| Pair in `+`, `-`, `*` (both operands of kind literal) | Governing text | The walk at 8b9193a1 (reading) | After this piece |
|---|---|---|---|
| DOUBLE literal and an integer literal within the bounds (INTEGER, BIGINT, HUGEINT: at most 20 digits) | ADR :258, :261, :263; FILTER-BIND :77, :92 under :89 | Refused, `conversion_rounds`. Rule 6 needs a non-literal float (engine/src/predicate.rs:2042-2044 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a, :2092-2105), and rule 5 needs a non-literal integer (:2052-2058, :2133-2139). | Admitted, result DOUBLE |
| DOUBLE literal and a decimal literal within the bounds (scale at most 18, at most 20 integer digits) | ADR :261, :263 (its exception does not name a double); FILTER-BIND :77 | Refused, `conversion_rounds`: `is_decimal_arithmetic_pair` is false for a DOUBLE partner (engine/src/predicate.rs:2146-2150 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a) | Admitted, result DOUBLE |
| Two DOUBLE literals | ADR :255; FILTER-BIND rule 1 (:72) | Admitted by arithmetic rule 1, which reads type and not kind (engine/src/predicate.rs:2066-2068 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a) | Unchanged; T1 pins it |

- **The bounds** are the walk's existing flags (engine/src/predicate.rs:1778-1817 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a). A DOUBLE literal is always within bounds (:1509-1512, :1811-1817).
  - Note for the architect, not an OPEN item: FILTER-BIND §2.2 bounds integer and decimal literals only (governance/forms/engine/FILTER-BIND-COERCIONS-PREREGISTRATION.md:67 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a), while the ADR's bound bullet speaks of any numeric literal (docs/adr/ADR-021-row-filter-on-viewport-query.md:251 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a). Comparison rule 6(ii) already relies on the same reading.
- **The only conversions** these pairs need are literal to DOUBLE, which FILTER-BIND §7 declares for literals (governance/forms/engine/FILTER-BIND-COERCIONS-PREREGISTRATION.md:273 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a).
- **The code change:** one admitting clause in `admitted_arithmetic_result` (engine/src/predicate.rs:2040-2141 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a), for both operand orders.
  - It tests the partner's kind is literal, never `counts_as_decimal_literal`.
  - It tests the partner's within-bounds flag.
  - It returns DOUBLE.
  - Its placement among the rules is the worker's. No other rule reaches these pairs, so placement does not change any result type.

### 2.2 Stays refused, each pinned in T2

- A literal beyond the bounds beside a DOUBLE literal. It keeps `literal_out_of_bounds` (engine/src/predicate.rs:2278-2280 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a).
- A DOUBLE literal beside a column or expression of BIGINT or wider. It keeps `conversion_rounds`, because rule 5's 32-bit bound stands.
- A DOUBLE literal beside a rule-2 result that counts as a decimal literal. It keeps `conversion_rounds` (OPEN-3 (a); ADR :274).
- A decimal literal beside an integer literal. It keeps `conversion_can_fail` (ADR :263; engine/src/predicate.rs:2298-2300 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a).

### 2.3 Sentences about behaviour: where they go, not their words (Part 1, item 1)

The worker writes each sentence from the built code. Both gates check it clause by clause against that code. None is the human's wording, and none is drafted here.

1. **`TypeRefusalReason::sentence`'s doc** (engine/src/predicate.rs:1430-1439 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a). Its last clause (:1438-1439) names this piece's shape as one W-1 is still false of. After the code, that clause is false. The sentence must cover only the cases that W-1 is still false of at the head, or name none. W-1's own string (:1448-1451) does not change.
2. **`admitted_arithmetic_result`'s doc** (engine/src/predicate.rs:2036-2039 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a). It says no branch classifies a `Decimal` operand as admitted. That is already false at the base, because rule 2 admits NULL beside a decimal (:2079-2084), and the new clause makes it more false (OPEN-5 (a)). The doc must cover:
   - which pairs are refused outright (O-5's decimal pairs);
   - which branches can admit a `Decimal` operand.
3. **The new clause's comment.** It must cover:
   - the pairs it admits and the result type;
   - the bound test;
   - that a counted rule-2 result is not admitted here (Note 2026-10-03, item 2);
   - its governing cites, by path and section.
4. **T1's and T2's doc comments,** each with its `RECORDED MUTATION:` line.
5. **The owner's index** (OPEN-4 (a)): the form's path joins the preregistration list (engine/README.md:557 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a), and the Last verified line (:537) names the commit. These are pointers only, under the index rule at :535.

No sentence goes into an ADR, SKP-V0, KNOWN-LIMITATIONS.md or the shell.

### 2.4 Not changed

- Every other arm and rule of the walk.
- `determine_reason`'s precedence (engine/src/predicate.rs:2263-2302 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a).
- `is_admitted_comparison`, `type_of_division` and `check_pair` (whose `is_arithmetic` branch has no `true` caller: state/consults/gates/2026-11-05-type-walk-rule2-residual-reasons-gate1-architect.md:37 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a).
- `Typed`'s fields, `literal_typed`, the five reasons and their wire values (engine/src/predicate.rs:1396-1428 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a), `FilterError`'s Display, and W-1.
- `MAX_INTEGER_LITERAL_DIGITS` and `MAX_DECIMAL_LITERAL_SCALE`.
- No `pub` item. No change to `engine/src/lib.rs`, Cargo.toml or Cargo.lock.
- Nothing under `kernel/`, `protocol/`, `frontends/` or `renderer/`. KNOWN-LIMITATIONS.md: no item covers these shapes, and none is added.

## §3 Fixtures and corpus, outcomes predicted before P-0 and before code

**FX-1 is unchanged.** It has 13 features, a fixed seed, and is written once through a `OnceLock` (engine/tests/filter_type_admission.rs:29-32 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a, :53-70). Its sha256 is checked at the end of each test (:73-79). "All" means FX-1's 13 ids.

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
- **Why `i64`:** a BIGINT column against a DOUBLE expression is refused by every comparison rule (engine/src/predicate.rs:2155-2259 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a). A REAL, INTEGER or DECIMAL result type would give a different outcome or different operand types, so the assertion pins the walk's type.

**T2 (new); every row holds at the base and at the head:**

| Row | Predicate | Refusal |
|---|---|---|
| 1 | `1e3 + 100000000000000000000 > 0` | TNA `+`, `LiteralOutOfBounds`; operand types DOUBLE literal / HUGEINT literal (the second a hypothesis) |
| 2 | `1e3 + 0.0000000000000000001 > 0` | TNA `+`, `LiteralOutOfBounds`; operand types DOUBLE literal / a scale-19 DECIMAL literal (width a hypothesis) |
| 3 | `1e3 + i64 > 0` | TNA `+`, DOUBLE literal / BIGINT, `ConversionRounds` |
| 4 | `1e3 + (NULL + 0.5) > 0` | TNA `+`, DOUBLE literal / DECIMAL(2,1) expression, `ConversionRounds` |
| 5 | `0.5 + 5 > 0` | TNA `+`, DECIMAL(2,1) literal / INTEGER literal, `ConversionCanFail` |

DECIMAL(2,1) for `0.5` is observed at 8b's head: 8b's T1 asserts `(NULL - 0.5) + f32 > 0` refused with DECIMAL(2,1) expression (engine/tests/filter_type_admission.rs:588-592 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a).

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
- (ii) `drain_ids` (engine/tests/filter_type_admission.rs:87-116 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a) succeeds and equals the predicted set;
- (iii) `i64 = (<a>)` is refused in its real shape, `PredicateAdmitError::Filter(FilterError::TypeNotAdmitted { .. })`, with construct `=`, operand types BIGINT and DOUBLE expression, and `ConversionRounds`;
- (iv) `typeof(<a>)` is DOUBLE.
- Then FX-1's sha256.

**M-1:** the new clause removed (the arm restored to its base). Predicted to fail exactly T1 in a run of the whole binary, by name at row 1's admission (expected admitted, got TNA `+`).

**T2** (new, same file; proposed name `literal_only_arithmetic_outside_the_double_literal_pairs_keeps_its_refusal`). Every row goes through the real `admit`. It asserts the real `TypeNotAdmitted` shape with construct, reason and operand types per §3, then FX-1's sha256.

**M-2:** the new clause also accepts a partner that counts as a decimal literal. Predicted to fail exactly T2, by name at row 4 (expected TNA, got admitted).
- **M-2',** only if P-0 drops row 4: the clause's bound test removed. Predicted to fail T2 by name at row 1.

**How each mutation is observed:** applied alone, in a debug build on the branch's code commit; the named test run; its failure recorded by name, with the 40-hex commit, in a `RECORDED MUTATION:` doc line; then reverted. A `verify-mutation` run is not an observation (docs/PREREGISTRATION-TEMPLATE.md:172 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a).

**Determinism and CI:**
- No sleep, retry or timeout in either test.
- Neither test is `#[ignore]` or `cfg`-gated.
- Both run in `cargo test --workspace --locked` on both L1 entries (.github/workflows/product-ci-rust.yml:194-197 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a, :234).

**Existing tests that stay green, unloosened:**
- B-T3 (engine/tests/filter_type_admission.rs:469-555 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a);
- 8b's T1 (:557-630);
- B-T2 (:125-147);
- B-T1 (:1318-1441);
- B-T1b (engine/src/predicate.rs:3228-3304 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a);
- `filter_admission_property_campaign`, `b1_an_implicit_coercion_is_admitted_and_fails_in_the_scan_carrying_file_data` and `a_join_of_clauses_each_admitted_alone_returns_their_intersection_and_its_subsets_admit` (engine/tests/admission_property_campaign.rs:1044, :1261, :1413 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a).

## §5 Predictions, declared unchanged, invalidators, falsification

- **Predictions:** §3's tables; T1 and T2 green on both L1 entries; M-1 and M-2 failing as §4 says.
- **Declared unchanged, with the reading behind each:**
  - **B-T1's counts:** 7,620, 18, 346, 16, 1,728 and 9,728 (engine/tests/filter_type_admission.rs:1339-1368 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a). Every B-T1 case puts a column in the arithmetic or the comparison (:792-829, :733-754, :1085-1104, :1136-1255, :1264-1304). Its admitted and refused tallies are printed, not asserted (:1427-1430).
  - **B-T1b's count:** 2,083 (engine/src/predicate.rs:3245 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a). Its cases are column-left (:3053-3143), and `checked` is asserted only to be above zero (:3300-3303).
  - **Every B-T3 row:** no corpus row is literal-only arithmetic with a DOUBLE literal (engine/tests/filter_type_admission.rs:189-461 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a). C33 at :326 has a column beside the literal.
  - **8b's T1, its eleven rows and its Display:** none has a DOUBLE literal as an operand of `+`, `-` or `*` (:576-596).
  - **The campaign:** leaf 10 always puts a column in the arithmetic (engine/tests/admission_property_campaign.rs:270-278 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a). G4 compares its DOUBLE literals with a column (:595-607). The only assertion is that there is no counterexample (:1242-1246). A newly admitted shape is float arithmetic, which never raises out-of-range at v1.5.5 (engine/tests/filter_type_admission.rs:1066-1076 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a).
  - Also unchanged: the five reason values, the twelve codes, W-1, SKP-V0, kernel's `filter_error_of`, the shell, and every assertion in the repository. A Grep over `engine/`, `kernel/`, `frontends/` and `protocol/` found no literal-only predicate with an e-notation literal beside `+`, `-` or `*`. Its only predicate hits are C33 and B-T1b's C33.
- **Invalidators.** Each stops the piece and goes to the custodian:
  1. any P-0 stop (§4);
  2. any declared-unchanged item moves;
  3. a change outside `admitted_arithmetic_result` and the docs §2.3 names is needed to admit T1's rows;
  4. FILTER-BIND's sentence invalidator (governance/forms/engine/FILTER-BIND-COERCIONS-PREREGISTRATION.md:376 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a) found newly live for a shape this piece admits or refuses.
- **Falsification:** at v1.5.5 an admitted T1 shape's stream ends in error; or the binder types one as other than DOUBLE; or the walk admits a T2 shape.

## §6 Instruments

- Every quantity is an assertion: a typed outcome, a result type, an id set, a fixture hash.
- No measurement and no docs/08 figure.
- P-0's run time is not recorded as a figure.

## §7 Declared values and ceilings

- **Size:** at most 150 changed lines (insertions plus deletions, comments and tests counted) over at most 3 files: `engine/src/predicate.rs`, `engine/tests/filter_type_admission.rs` and `engine/README.md`. This form, PLAN.yaml and FILLER-QUEUE.md are excluded.
  - Counting command: `git diff --numstat origin/main...HEAD -- engine/src/predicate.rs engine/tests/filter_type_admission.rs engine/README.md` at a named commit.
  - An overrun is class 8, and this line is not edited.
- **Constants:** `MAX_INTEGER_LITERAL_DIGITS` (20) and `MAX_DECIMAL_LITERAL_SCALE` (18) are unchanged (engine/src/predicate.rs:1391 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a, :1394). The DuckDB pin is unchanged.
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
   - Security: §21a's bullet labels ADR-021 as bundling and no runtime fetch (governance/AUTONOMY.md:321-322 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a). Read by that label, nothing here is security. Read by the ADR's number, admission is inside the bullet. The route, full gating, is the same either way.
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
| F-B, `arithmetic-text-literal-beside-null-reason` (8d) | Not in flight: it depends on this node (governance/PLAN.yaml:4217 @ 8b9193a1015acb05b2fb6d6b5721d3891a1e0a0a). Both edit `engine/src/predicate.rs` and the sentence doc, in sequence. |

Nothing touches `protocol/`. I cannot read branches; the path lists are the brief's.

## §10 Amendments (opens empty; append-only)

---

## Size against the budget

My estimate is about 125 to 140 of 150 lines, over 3 files, with the form exempt:

| File | What changes | Lines |
|---|---|---|
| `engine/src/predicate.rs` | the clause in both orders with its comment (~12); `admitted_arithmetic_result`'s doc rewritten (~8); `sentence`'s doc, its last clause (~4) | ~24 |
| `engine/tests/filter_type_admission.rs` | T1 with its doc and RECORDED MUTATION line (~55); T2 likewise (~45) | ~100 |
| `engine/README.md` | the preregistration list line and the Last verified line, each replaced | ~4 |

The margin is thin. On entry 9 and on O1, rustfmt made the tests longer than estimated (entry 9's form, Amendment 2). An overrun is class 8, with §7 not edited.

## What changed from the outline, and why

1. **Every cite was re-read at 8b9193a1.** 8b's merge moved `engine/src/predicate.rs` by 8 lines below :1430, and `engine/tests/filter_type_admission.rs` by 75 lines from :557.
2. **Section 7, corrected against the merged bytes.**
   - `sentence`'s doc at engine/src/predicate.rs:1430-1439 matches, line for line, the reviewer's replacement words at state/consults/gates/2026-11-05-type-walk-rule2-residual-reasons-gate1-reviewer.md:37-46 (read side by side, not hashed). So my outline's §5 item 1 stands.
   - The correction: the doc's last clause names only a DOUBLE literal beside an INTEGER literal. The walk also refuses a DOUBLE literal beside BIGINT, HUGEINT and decimal literals. §2.3 item 1 therefore requires the clause to be made true of the head as a whole, not trimmed.
   - Two other places I had not read: the enum doc (:1396-1399, now carrying N-1's wire clause) and 8b's T1 doc (engine/tests/filter_type_admission.rs:557-567) name no F-A shape. A Grep finds the clause nowhere else in code. 8b's form notes 3 and 4 name it too, but they are an immutable record and are not edited.
   - 8b's eleven T1 rows are as my outline listed them (:576-596).
3. **T1's plan-cast assertion is dropped, and T1 now has four checks.** In literal-only arithmetic every cast's child is a constant, and `is_declared_cast` admits a constant numeric-to-numeric cast unconditionally (engine/tests/filter_type_admission.rs:1026-1028). The plan may also fold the filter away, as B-T1b's own skip records (engine/src/predicate.rs:3271-3275). That check could not fail, so it fails Part 1, item 7. The binder's type rests on `typeof` instead.
4. **P-0 gains two things:** DuckDB's own id sets for T1's rows, as an oracle independent of the engine for T1 (ii); and the record-only H-NEG rows.
5. **P-0's record goes in the worker's report.** A class 1 amendment is needed only when a fallback switches. That keeps the filler to its one gate round.
6. **The shapes now carried by F-B** ((a) to (c) of the architect's gate-1 report) are named in §1 as outside this piece (no float side), and F-B's sequencing contact is in Rule (00).
7. **The §21a security-label reading** is now explicit in §9, with both readings. The route does not depend on it.
8. **Authority** adds the ruling of 2026-11-05 (evening), item 1, the Part 1 rulings, and the 2026-11-03 extension of the 2026-10-31 direction. OPEN-2 to OPEN-5 are recorded as taken.
9. **The size estimate** moves from about 125 to about 128, after dropping one T1 check and adding the P-0 rows (which are not committed).

## OPEN items

None new. OPEN-1 is the human's ruling. OPEN-2 to OPEN-5 are taken as recorded in Authority.

## What I could not settle

- **The binder at 1.10505.0, for every row except the two the reviewer observed:** acceptance, operand-type names (T1 row 7, T2 rows 1 and 2) and result types. P-0 and T1 decide these.
- **Whether `typeof` runs on `configured_connection()`.** P-0 decides; a fallback is declared.
- **H-NEG,** whether a negated literal reaches the walk as a constant.
- **The 2026-11-03 extension.** The text of the 2026-10-31 direction names 2026-11-04 as its end; I rely on the 2026-11-03 directive's :6 for holding it until 2026-11-09.
- **8b's Amendment 4** was not on main when I read 8b's form, which ends at Amendment 3. The brief says it would change nothing I draft.
- **The node's 120 minutes,** which are not measured. The reviewer reported about 11 minutes for a cold build and 3 to 4 minutes for the binary (state/consults/gates/2026-11-05-type-walk-rule2-residual-reasons-gate1-reviewer.md:136).
- **Hashes.** I recomputed none. Every pin awaits the custodian's script.

I leave no background shell; I had no shell.
