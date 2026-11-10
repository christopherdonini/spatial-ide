*Custodian's filing note (2026-11-05): lead-data's draft of filler entry 8c's five-line form, `literal-only-float-integer-arithmetic-refused`, drafted ahead while entry 8b (PR #282) waits for the human's click (the docs-lane rule of 2026-10-10: each slot's next form drafted while the current piece is in gates). Its brief by file (sha256 3d6f950e8aa5635cb907a37380f120da76f0fab1cfa82122d56c83a69ef0ff10), carrying the human's Part 1 rulings of 2026-11-05 by reference and the reuse index's output byte for byte; read at main 1546c0ac. The run 19:35:53Z to 19:47:00Z by its transcript (claude-opus-5-5; unique calls Read 35, Grep 33 and the hand-back, 69, equal to the notification's). Extracted by script from the hand-back message in that transcript (25970 bytes, sha256 955b9272d30154df74cef6f354d6924f13984697f98ed69f0cd177cfc0e53a25); nothing is changed. The drafter reads the five-line form closed and puts the route, its OPEN-1, to the human as a red line; no form is committed until the human rules, and no code starts before 8b merges (both edit `engine/src/predicate.rs`, rule (00)). A draft, not Authority.*

---

Draft: literal-only-float-integer-arithmetic-refused, the five-line form closed
Blocking question (red line, the human's): OPEN-1. The piece cannot meet §36's five-line condition, so which route does filler entry 8c take?
Report path: C:/dev/spatial-ide/state/consults/2026-11-05-literal-only-float-integer-arithmetic-refused-five-line-form-lead-data-draft.md
sha256: none. I have no shell, so I computed no hash. I say this once: every cite below is `path:line @ 1546c0ac` with no hash.

*Lead-data, read only. I read the main checkout's working tree. The session's start snapshot shows main at 1546c0ac with no tracked change, and I ran no git command. I could not read the 8b branch: what I say of it comes from the brief, from 8b's form, and from the reviewer's gate report. Everything here is my wording, except spans marked verbatim, which are byte-copied from the line cited. I ran nothing. Every claim about DuckDB's or the walk's behaviour is from reading, unless it is marked as observed by someone else.*

---

## 1. Item 1 first: the guarantee categories

**What the change moves.** These pairs move from refused to admitted in `+`, `-` and `*`:
- a DOUBLE literal beside an integer literal within bounds (`1e3 + 5 > 0`);
- a DOUBLE literal beside a decimal literal within bounds (`0.5 + 1e3 > 0`).

The third pair, two DOUBLE literals (`1e3 + 1e3 > 0`), is already admitted at the base. Arithmetic rule 1 compares type only, not kind (`engine/src/predicate.rs:2058-2060 @ 1546c0ac`). No test pins it. This piece pins it and changes no code for it.

**My reading: the five-line form is closed. There are two grounds, and either one closes it alone.**

- **(a) §21a, a stated guarantee** (`governance/AUTONOMY.md:325-327 @ 1546c0ac`).
  - The walk's admitted set implements ADR-021's Note 2026-09-30, items 1 and 2 (`docs/adr/ADR-021-row-filter-on-viewport-query.md:248-263 @ 1546c0ac`).
  - The closest precedent is the last merged type-walk form, in the same module and on the same arm. Its §9 reads, verbatim from `governance/forms/engine/TYPE-WALK-NULL-LITERAL-ARITHMETIC-PREREGISTRATION.md:307 @ 1546c0ac`: "The piece changes the outcome under a stated guarantee: ADR-021's admitted class, pinned by B-T3. It adds user-visible behaviour, which closes §21c".
  - The difference here: that piece needed a new Note, and this one needs none, because the Note's text already admits these pairs (`docs/adr/ADR-021-row-filter-on-viewport-query.md:261 @ 1546c0ac`, `:263`).
  - The counter-reading has a precedent too: a piece that makes the implementation meet a stated guarantee wrote "guarantee none" (`governance/forms/engine/WATCHER-FIRST-READ-PREREGISTRATION.md:10 @ 1546c0ac`). I give that reading to the human under OPEN-1 (B) and do not adopt it, because ground (b) holds either way.
- **(b) §21c's fourth bound, no new user-visible behaviour** (`governance/AUTONOMY.md:349-351 @ 1546c0ac`).
  - Today the shipped app refuses these predicates with a typed refusal. After this piece, it filters the map with them.
  - That is behaviour, not a string, so §36's P6 clause does not cover it. That clause is the route 8b's OPEN-4 used (`governance/forms/engine/TYPE-WALK-RULE2-RESIDUAL-REASONS-PREREGISTRATION.md:118 @ 1546c0ac`, `:148`). Node 10's §9 (cited above) read its own case the same way.

**Does any existing test's assertion change? None, by reading and by search.**
- **B-T1** (`engine/tests/filter_type_admission.rs:1243-1366 @ 1546c0ac`).
  - Every arithmetic case puts a column on the left (`:717-755`).
  - Part 3's pins are NULL-literal shapes (`:1121-1172`).
  - Its asserted counts, 7,620 / 18 / 346 / 16 / 1,728 / 9,728 (`:1264-1293`), are unchanged. Its admitted and refused tallies are printed, not asserted (`:1352-1355`).
- **B-T1b** (`engine/src/predicate.rs:3221-3296 @ 1546c0ac`).
  - Its cases are column-left (`:3050-3060`).
  - Its count of 2,083 (`:3237`) is unchanged. `checked` is asserted only to be above 0 (`:3292-3295`).
- **B-T3** (`engine/tests/filter_type_admission.rs:469-555 @ 1546c0ac`).
  - No corpus row (`:189-461`) has literal-only arithmetic with a DOUBLE literal. C33 (`:326`) is a column beside a DOUBLE literal.
- **The property campaign** (`engine/tests/admission_property_campaign.rs:1043-1247 @ 1546c0ac`).
  - Leaf 10 always puts a column inside the arithmetic (`:270-278`).
  - G4's DOUBLE literals are compared with a column (`:595-607`).
  - The seeds are fixed, and the only assertion is that there is no counterexample (`:1242-1246`). So no generated case changes its outcome.
- **8b's T1**: none of its eleven rows becomes admitted (§7 below).
- **Search** (the Grep tool over the working tree, not a script; no result was truncated):
  - A case-insensitive regex for an e-notation literal beside `+`, `-` or `*`, over `engine/`, `kernel/` and `frontends/` (`*.rs`, `*.ts`, `*.tsx`, `*.mjs`), found 5 hits in 3 files: C33 twice, B-T1b's doc, and one canvas test. None is a literal-only predicate.
  - `1e3` in `frontends/shell/**/*.md`: 0 hits.
  - "double literal" or "two numeric literals" in `protocol/skp/SKP-V0.md`: 0 hits.
  - `KNOWN-LIMITATIONS.md` has no item on these shapes. Its two `1e3` hits sit inside hashes (`:200`, `:294`).

**On the brief's line 176.** `docs/PREREGISTRATION-TEMPLATE.md:176 @ 1546c0ac` is round 25 item 2 (e), "Out-of-scope at dispatch". A piece whose Out-of-scope line would name a §21a category takes the full form from dispatch, and no five-line form is committed for it. That line does not say that a test's asserted figure is a property under test. That reading comes from §21a's "any property currently under test" (`governance/AUTONOMY.md:327 @ 1546c0ac`), as other forms apply it (for example `governance/forms/scripts/VERIFY-CITES-PIN-RESOLUTION-AND-LINE-ZERO-PREREGISTRATION.md:12 @ 1546c0ac`). Here no asserted figure moves, so the closure rests on grounds (a) and (b), not on a figure. Under line 176, the piece takes the full form from dispatch. The route is OPEN-1, which I read as a red line.

## 2. The rule

Read from FILTER-BIND §2.5(a) and ADR-021's Notes as they stand.

| Pair | ADR-021 | FILTER-BIND | The walk at the base (reading) | Observed | Result type: walk after / binder |
|---|---|---|---|---|---|
| DOUBLE literal with INTEGER literal (`1e3 + 5`) | Note 2026-09-30 item 2, the double-literal bullet (`:258`) and the two-literals bullet (`:261`); the same rules apply inside `+`, `-` and `*` (`:263`) | §2.5(a), its double-literal bullet (`engine/FILTER-BIND`: `governance/forms/engine/FILTER-BIND-COERCIONS-PREREGISTRATION.md:92 @ 1546c0ac`) through rule 5 (`:76`), and rule 6's second clause (`:77`) under §2.5(a)'s "pairwise" lead (`:89`) | Refused, `conversion_rounds`. Rule 5 needs a non-literal integer (`engine/src/predicate.rs:2044-2050`, `:2125-2131`). Rule 6 needs a non-literal float (`:2034-2036`, `:2081-2097`). | Refused: TNA `+`, `DOUBLE literal; INTEGER literal`, `ConversionRounds`, in 8b's reviewer's probe at ae4d94d4 (`state/consults/gates/2026-11-05-type-walk-rule2-residual-reasons-gate1-reviewer.md:68 @ 1546c0ac`). A TNA comes after the surrogate prepare (FILTER-BIND `:61`), so the binder accepted the shape. | DOUBLE / DOUBLE predicted (a hypothesis; T1 (v)) |
| DOUBLE literal with a wider integer literal within bounds (BIGINT `3000000000`; HUGEINT up to 20 digits) | the two-literals bullet (`:261`) | rule 6's second clause (`:77`), as comparison rule 6(ii) already applies it (`engine/src/predicate.rs:2219-2224`) | Refused | Not run | DOUBLE / predicted |
| DOUBLE literal with decimal literal within bounds (`0.5 + 1e3`) | `:261`. The exception at `:263` names a decimal beside an integer or a decimal, never a double. | rule 6's second clause (`:77`). §2.5(a)'s decimal bullet (`:93`) does not name a double. | Refused, `conversion_rounds`: `is_decimal_arithmetic_pair` is false for a double (`engine/src/predicate.rs:2138-2142`) | Refused, with W-1's Display (reviewer `:74`) | DOUBLE / predicted |
| Two DOUBLE literals (`1e3 + 1e3`) | identical types (`:255`) | rule 1 (`:72`) | Admitted, by rule 1 (`:2058-2060`) | Not run | DOUBLE / predicted |

**Stays refused.** Each of these is pinned in T2.
- **A rule-2 result that counts as a decimal literal, beside a DOUBLE literal** (`1e3 + (NULL + 0.5)`). Verbatim from `docs/adr/ADR-021-row-filter-on-viewport-query.md:274 @ 1546c0ac`: "Inside `+`, `-` and `*`, nothing changes." The new clause reads `kind == Literal` only, never `counts_as_decimal_literal`.
- **An integer or decimal literal beyond the bounds** → `literal_out_of_bounds` (`engine/src/predicate.rs:2270-2272`).
- **A DOUBLE literal beside a column or expression of BIGINT or wider**: rule 5's bound applies, as in C7's arithmetic sibling.
- **A decimal literal beside an integer literal** (`0.5 + 5`) → `conversion_can_fail` (ADR `:263`; FILTER-BIND `:93`).

**The code change, as I would describe it.**
- One clause in `admitted_arithmetic_result` (`engine/src/predicate.rs:2032-2133 @ 1546c0ac`), mirroring comparison rule 6(ii) (`:2219-2224`): a DOUBLE literal beside an integer or decimal literal, of kind literal and within bounds, is admitted, and the result is DOUBLE.
- Nothing else changes: no other arm, rule, reason, precedence, `Typed` field, Display or `pub` item.
- No ADR status line, Note or amendment is needed. The answer rests on the Note's text as it stands.

**One existing reading this piece relies on and does not change.**
- The walk treats every DOUBLE literal as within bounds (`engine/src/predicate.rs:1501-1504`).
- FILTER-BIND §2.2 defines bounds for integer and decimal literals only (`:67`), while ADR item 1's bound bullet speaks of any numeric literal (`docs/adr/ADR-021-row-filter-on-viewport-query.md:251`).
- Comparison rule 6(ii) already relies on the same reading. I note it for the architect. It is not an OPEN item.

**The binder at the pinned version.** Cargo.lock's `duckdb` is 1.10505.0, recorded in 8b's Amendment 1 (`governance/forms/engine/TYPE-WALK-RULE2-RESIDUAL-REASONS-PREREGISTRATION.md:173 @ 1546c0ac`); FILTER-BIND calls this version v1.5.5. Nothing beyond the reviewer's two observations has been run. P-0 decides the rest before any code, and T1 pins it.

## 3. The size (§21c: 150 changed lines with tests counted; 8 files)

My estimate:
- `engine/src/predicate.rs`: about 17 lines (the clause and its comment; the `sentence` doc's F-A clause; the doc of `admitted_arithmetic_result`).
- `engine/tests/filter_type_admission.rs`: about 105 lines (T1 about 55, T2 about 50).
- `engine/README.md`: 2 lines, under OPEN-4 (a).

That is about 125 lines over 3 files, plus the form, which is exempt (`governance/AUTONOMY.md:357`). It is inside §21c's line and file bounds, so size is not what closes the form. I propose a declared budget of 150.

## 4. Tests and mutations

**P-0, before any code.** A throwaway test on FX-1, never committed, run at the branch base after #282 merges.
- **What runs:** T1's eight predicates and T2's five, each once through `AdmittedPredicate::admit`. Then `SELECT typeof(<a>)` on `configured_connection()` for each of T1's eight arithmetic nodes. The record carries the DuckDB version and the 40-hex commit.
- **Predicted (hypotheses):** T1's rows 1 to 7 refused, TNA `ConversionRounds`; T1's row 8 admitted; T2's rows as T2 tables them; `typeof` DOUBLE for all eight.
- **Stops:**
  - any of T1's rows refused before the walk, `RejectedByBinder` or another code: the binder disagrees, and the piece cannot admit that shape;
  - any `typeof` other than DOUBLE;
  - T1's row 8 refused: the walk differs from my reading, so a change outside the declared clause would be needed.
- **Not stops; each recorded by amendment before code:**
  - T2's row 4 `RejectedByBinder`: M-2 becomes M-2'.
  - `typeof` unusable on the configured connection: the binder oracle becomes the `value.type` of the folded `BOUND_CONSTANT` in `json_serialize_plan` of `SELECT <a>`.

**T1 (new, `engine/tests/filter_type_admission.rs`).** The name is my proposal: `literal_only_arithmetic_with_a_double_literal_is_admitted_typed_double_and_streams`.

Its eight rows, with the stream each one predicts over FX-1's 13 ids (`:29`, `:53-70`):

| Row | Predicate | Stream |
|---|---|---|
| 1 | `1e3 + 5 > 0` | all ids |
| 2 | `1e3 - 5 < 0` | none |
| 3 | `5 * 1e3 > 0` | all |
| 4 | `1e3 + 3000000000 > 0` | all |
| 5 | `1e3 - 99999999999999999999 < 0` | all |
| 6 | `0.5 + 1e3 > 0` | all |
| 7 | `1e3 * 0.000000000000000001 < 0` | none |
| 8 | `1e3 + 1e3 > 0` | all |

For each row, T1 asserts:
- (i) `admit` returns `Ok`;
- (ii) `drain_ids` (`:87-116`) equals the predicted set;
- (iii) every `BOUND_CAST` in the plan is in the declared set (B-T1's `plan_json`, `walk_casts` and `is_declared_cast`, `:880-892`, `:833-875`, `:938-989`);
- (iv) `i64 = <a>` is refused TNA `=`, `BIGINT; DOUBLE expression`, `ConversionRounds`. This is the walk's result type, seen through the public refusal;
- (v) `SELECT typeof(<a>)` is `DOUBLE`. This is the binder's result type.

The fixture's sha256 is checked at the end (`:73-79`).

**M-1:** the new clause removed (the arm restored to its base).
- Predicted to fail exactly T1, in a run of the whole binary.
- By name: at row 1's admission (expected admitted, got TNA `+`).

**T2 (new, same file).** Proposed name: `literal_only_arithmetic_outside_the_double_literal_pairs_keeps_its_refusal`. Every row goes through the real `admit`, and the refusal is asserted in its real shape.

| Row | Predicate | Expected refusal |
|---|---|---|
| 1 | `1e3 + 100000000000000000000 > 0` | TNA `+`, `LiteralOutOfBounds`; operand types predicted `DOUBLE literal; HUGEINT literal` (a hypothesis, checked at P-0) |
| 2 | `1e3 + 0.0000000000000000001 > 0` | TNA `+`, `LiteralOutOfBounds` |
| 3 | `1e3 + i64 > 0` | TNA `+`, `DOUBLE literal; BIGINT`, `ConversionRounds` |
| 4 | `1e3 + (NULL + 0.5) > 0` | TNA `+`, `DOUBLE literal; DECIMAL(2,1) expression`, `ConversionRounds` |
| 5 | `0.5 + 5 > 0` | TNA `+`, `DECIMAL(2,1) literal; INTEGER literal`, `ConversionCanFail` |

All five hold at the base, by reading.

**M-2:** the new clause's partner test also accepts a result that counts as a decimal literal.
- Predicted to fail exactly T2, by name at row 4 (expected TNA, got admitted).
- **M-2'**, used only if P-0 sends it: the clause's within-bounds test dropped. T2 then fails by name at row 1.

**How each mutation is observed.** In a debug build on the branch's code commit. Recorded by name, with the 40-hex commit, in a `RECORDED MUTATION:` doc line, then reverted. A verify-mutation run is not an observation (`docs/PREREGISTRATION-TEMPLATE.md:172 @ 1546c0ac`).

**Determinism.** FX-1 is written once through a `OnceLock` with a fixed seed. There is no sleep, retry or timeout in either committed test.

**CI.** Neither test is `#[ignore]`. Both run in `cargo test --workspace --locked` on windows-latest and ubuntu-24.04 (`.github/workflows/product-ci-rust.yml:195-198 @ 1546c0ac`, `:234`). No CI change is needed.

**Unchanged:** no B-T1, B-T1b or B-T3 row, count or assertion; the campaign; 8b's T1.

## 5. Strings, and sentences written after the code

**Strings.** The piece adds no string a user sees, so it needs no P6 placeholder. For these shapes, it removes a refusal message (W-1's Display).

**Sentences about behaviour.** Under Part 1 item 1 (`state/directives/2026-11-05-main-architect-gate-rounds-part-1-rulings-review-packet-design-part-3-additions.md:28-32 @ 1546c0ac`), the worker writes these from the built code, and the form names where they go and not their words:
1. **`TypeRefusalReason::sentence`'s doc.** At 8b's head it carries the reviewer's words. Their last clause says that W-1 is still false of a DOUBLE literal beside an INTEGER literal in arithmetic (reviewer `:45-46`). After this piece that clause is false, so it is removed or made true.
2. **The doc of `admitted_arithmetic_result`.** Its claim that no branch below ever classifies a `Decimal` operand as admitted (`engine/src/predicate.rs:2028-2031 @ 1546c0ac`) is already false at the base: rule 2 admits NULL beside a decimal. It becomes more false under this piece. It is in the Scope file (OPEN-5).
3. **The new clause's comment.** It must cover:
   - the pairs it admits and the result type;
   - the bounds;
   - that a counted rule-2 result is not admitted here (Note 2026-10-03 item 2);
   - its governing cites.
4. **T1's and T2's doc comments**, with their `RECORDED MUTATION:` lines.

No sentence is needed in an ADR, SKP-V0 or KNOWN-LIMITATIONS.

## 6. Rule (00), and the owner's index

| Path | In flight at 1546c0ac | Overlap |
|---|---|---|
| `engine/src/predicate.rs` | `cut/type-walk-rule2-residual-reasons` (8b, PR #282) | Yes. Code starts after #282 merges. |
| `engine/tests/filter_type_admission.rs` | 8b | Yes, the same. |
| `engine/README.md` (OPEN-4 (a)) | none of the six branches | None |
| `governance/forms/engine/LITERAL-ONLY-FLOAT-INTEGER-ARITHMETIC-REFUSED-PREREGISTRATION.md` | none | None |

- **port-2:** contact only. `engine/src/lib.rs` re-exports what the tests import, and this piece adds no re-export.
- **1c, b1-shell-half-pr-c, #281 and #280:** no path under `engine/`.
- **protocol/:** nothing is touched.
- **The owner's index:** the `AdmittedPredicate::admit` pointer (`engine/README.md:542 @ 1546c0ac`) is unchanged. The forms list (`:557`) takes this form if OPEN-4 (a) is taken, and `engine/README.md` is then a file in the Scope.

## 7. What this piece touches of 8b's change

None of 8b's eleven rows (its Tests+mutation line, `governance/forms/engine/TYPE-WALK-RULE2-RESIDUAL-REASONS-PREREGISTRATION.md:9 @ 1546c0ac`) becomes admitted. The new clause needs a DOUBLE literal as an operand of `+`, `-` or `*`.
- `f32 > NULL + 100000`, `f32 > NULL + i32`, `f64 > NULL + i64`, `f32 > NULL * NULL` and `f64 > -NULL`: comparisons. The comparison arm is unchanged, and their inner arithmetic is already admitted by rule 2.
- `1e3 > NULL + i64`: the DOUBLE literal sits in a comparison, not in arithmetic. Unchanged.
- `f32 + -NULL > 0` (REAL column with a BIGINT expression) and `(NULL - 0.5) + f32 > 0` (a decimal expression with a REAL column): no DOUBLE literal. Unchanged.
- The controls `i32 = f32`, `i64 = 1e3` and `i32 + f32 > 0`: unchanged.

So T1 of 8b keeps its assertions, and W-1 is untouched. What this piece does touch is the doc sentence in §5 item 1. If any other sentence at 8b's merged head names the F-A exception, it falls under this piece's sibling search; I cannot read that branch.

## 8. The full form, in outline (in place of the five lines)

- **Header.**
  - Authority:
    - the PLAN node (`governance/PLAN.yaml:4193-4209 @ 1546c0ac`);
    - placed S3 after 8b by the human's ruling of 2026-10-26 (`state/directives/2026-10-26-clicks-260-261-244-r2-241-o1-answers-pb-draft-b-6d-260-lines-5b-8a-8b-rulings.md:32 @ 1546c0ac`);
    - following 8b by the ruling of 2026-11-05, item 3 (`state/directives/2026-11-05-platform-runs-filed-c1-governance-next-fixtures-kernel-node-8b-route-a-f-b-after-8c.md:10 @ 1546c0ac`);
    - filler entry 8c (`state/FILLER-QUEUE.md:27 @ 1546c0ac`);
    - proposed by 8b's draft, note 4 (F-A) and OPEN-5 (`state/consults/2026-10-26-type-walk-rule2-residual-reasons-five-line-form-architect-draft.md:93-94 @ 1546c0ac`, `:151`);
    - OPEN-1's ruling, once given;
    - the reuse index: no prior art found on either search ("literal float integer arithmetic"; "numeric literal coercion type walk"), a miss noted here.
  - It continues FILTER-BIND and node 10's form.
- **§0 Disclosure.**
  - Evidence: the reviewer's probe at ae4d94d4 (`:68`, `:74`).
  - Everything else is reading at 1546c0ac.
  - DuckDB: 1.10505.0, which FILTER-BIND calls v1.5.5.
- **§1 What it may claim.** It may claim that the three pairs are admitted, typed DOUBLE and stream without error over FX-1. It may not claim performance, anything about other shapes, or anything about the binder at another version.
- **§2 The rule.**
  - 2.1: §2 of this report.
  - 2.2: the stays-refused list.
  - 2.3: §5's sentence places.
  - 2.4: no `pub` item, and no change to `Typed` or to reasons.
- **§3 Fixtures and corpus.** FX-1 unchanged; T1's and T2's tables with their predictions.
- **§4 Tests.** P-0, T1, T2, M-1, M-2 (and M-2').
- **§5 Predictions, declared unchanged, invalidators.**
  - Declared unchanged: the B-T1 parts and their counts, the B-T1b count, the B-T3 rows, the campaign, 8b's T1 and its Display, the five reason values, the twelve codes, SKP-V0, kernel's `filter_error_of`, and the shell.
  - Invalidators: P-0's stops; any declared-unchanged item moves.
  - Falsification: at v1.5.5, an admitted T1 shape's stream ends in error, or the binder types it as other than DOUBLE.
- **§6 Instruments.** None, and no performance claim.
- **§7 Declared values.**
  - Budget: 150 lines (§21c's counting) over 3 files, plus the form.
  - `MAX_INTEGER_LITERAL_DIGITS`, `MAX_DECIMAL_LITERAL_SCALE` and the DuckDB pin unchanged.
- **§8 Block-on-sight.**
  - Any B-T1, B-T1b or B-T3 row, count or assertion changed.
  - `counts_as_decimal_literal` read by the new clause.
  - A `pub` item.
  - Any change under `kernel/` or `protocol/`.
  - Any ADR text.
  - A behaviour sentence drafted in the form.
  - A sleep, retry or timeout in a committed test.
  - An unobserved mutation.
  - A DuckDB behaviour stated without its version.
- **§9 Gates.** Full gating, with the reviewer and the architect from dispatch, under grounds (a) and (b) of §1. ADR none. Security none (the stage-1 allowlist and the namespace are unchanged; see the label observation at node 10's form `:66`). Wire none. Guarantee touched.
- **§10 Amendments.** Opens empty.

## 9. Only if OPEN-1 is ruled (B): the five lines as they would read

```
Authority: PLAN node literal-only-float-integer-arithmetic-refused (governance/PLAN.yaml:4193-4209 @ 1546c0ac); filler entry 8c, S3 (state/FILLER-QUEUE.md:27 @ 1546c0ac; the human's rulings of 2026-10-26, line 32, and 2026-11-05, item 3); OPEN-1 (B) <cited once ruled>; proposed as F-A (state/consults/2026-10-26-type-walk-rule2-residual-reasons-five-line-form-architect-draft.md:93-94 @ 1546c0ac); the reuse index found no prior art on either search, a miss noted here.
Scope: 3 files: engine/src/predicate.rs (one clause in admitted_arithmetic_result, its doc, sentence's doc), engine/tests/filter_type_admission.rs (T1, T2), engine/README.md (the forms list, OPEN-4 (a)); budget 150; this form exempt; no B-T1, B-T1b or B-T3 row or count, no pub item, nothing under kernel/ or protocol/.
Change: in +, - and *, a DOUBLE literal beside an integer or decimal literal within bounds is admitted and typed DOUBLE, as ADR-021's Note 2026-09-30 item 2 states; every other refusal keeps its code, reason and operand types.
Tests+mutation: P-0 before code; T1 (8 rows: admitted, stream set, declared casts, i64 = <a> refused as DOUBLE expression, typeof DOUBLE); M-1 clause removed, fails T1 at 1e3 + 5 > 0; T2 (5 refusals kept); M-2 partner accepts a counted result, fails T2 at 1e3 + (NULL + 0.5) > 0.
Out-of-scope: ADR none (no status line, Note or amendment); security none; wire none (no code, field or reason value; nothing under protocol/); guarantee none, by the human's ruling OPEN-1 (B) <cited>.
```

## OPEN items

- **OPEN-1, the route. A red line, as I read it:** a scope change to an item the human has ruled. The human placed 8c as a filler under §36 (`governance/AUTONOMY.md:692 @ 1546c0ac`), whose conditions include a five-line form, and the 2026-10-31 direction lists such changes as red lines (`state/directives/2026-10-31-away-until-11-04-clicks-from-the-app-270-size-o0-file-open-items-take-recommendation.md:14 @ 1546c0ac`). The options:
  - **(A) Recommended.** The full form, both gates, in the filler slot. This follows entry 9's precedent (`state/FILLER-QUEUE.md:29 @ 1546c0ac`).
  - **(B)** A five-line form by the human's word, reading the guarantee as untouched and setting the fourth bound aside. This follows 6d's precedent (`:18`).
  - **(C)** Leave the refusal as it is and record it. A KNOWN-LIMITATIONS item would be the human's wording.
  - **(D)** Take 8c off the filler queue for slot 1 or 2.
- **OPEN-2, which integer literals are admitted. Not a red line.**
  - **(i) Recommended.** Every integer literal within bounds. ADR `:261` says so, and comparison rule 6(ii) already does it.
  - **(ii)** Only literals of at most 32 bits, following the letter of §2.5(a)'s rule-5 bullet.
- **OPEN-3, a counted rule-2 result beside a DOUBLE literal in arithmetic.**
  - **(a) Recommended.** It stays refused, per ADR `:274`.
  - **(b)** Admit it. That needs a Note reading, so (b) is a red line.
- **OPEN-4, the owner's-index line. Not a red line.**
  - **(a) Recommended.** The form goes into `engine/README.md:557`'s list in this PR, as 4a's and 4b's forms are.
  - **(b)** No line, as 8b has none.
- **OPEN-5, the stale doc at `engine/src/predicate.rs:2028-2031`. Not a red line.**
  - **(a) Recommended.** Rewritten in this piece after the code. It is in the Scope file.
  - **(b)** Left to a sibling node.

## What I could not settle

- **The binder's result type and its acceptance at 1.10505.0** for every row except the two the reviewer observed. P-0 and T1 decide them.
- **Whether `typeof` runs on a configured connection.** P-0 decides it, and a fallback is declared.
- **The operand-type name of `100000000000000000000`** (HUGEINT is predicted).
- **8b's merged bytes.** I could not read the branch: §5 item 1 rests on the reviewer's words at ae4d94d4 (reviewer `:36-46`), which Amendment 3 records as applied at 341e4147.
- **The two-double-literal row is admitted by reading only**; it was never run.
- **The node's 120-minute budget** is not measured. A cold build was about 11 minutes and the binary 3 to 4 minutes, as the reviewer reported (`:136`).

## Background shells

I have no shell. I started no process, and I leave no background shell.
