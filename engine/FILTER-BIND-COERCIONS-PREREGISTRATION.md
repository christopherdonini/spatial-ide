# Bind admission refuses implicit coercions synchronously, carrying no file data — preregistration (wave-2 B-1, S1)

## Header

- **Status.** This is the preregistration of PLAN node `filter-bind-admission-implicit-coercions`, and it becomes the node's gate when committed. It is committed before any code. It is append-only once committed. An amendment written after any outcome has been seen says so in its first line and names what it touches or invalidates.
- **OPEN markers.** O-1 to O-6 (§2.12) mark points the sighting leaves open. No code that touches a marked point begins until Fable rules it, relayed by the human.
- **Authority:**
  - the 2026-09-28 S1 batch (`state/directives/2026-09-28-after-wave-s1-batch.md`), Fable's B-1 paragraph;
  - the 2026-09-29 sightings (`state/directives/2026-09-29-a2-1-and-b-1-sightings.md`), Fable's B-1 points 1–6 and the two closing lines. These rule the design, and where they differ from the proposal they win;
  - round 25, item 2 (classes 8 and 9, mutation-observation wording, test-text spans, the full form at dispatch);
  - the record cap (`state/directives/2026-09-18-record-cap.md`).
- **What it decomposes:**
  - the sighted proposal `state/drafts/b1-p0/B1-P0-AND-PROPOSAL.md` §§3–9, as amended by the sightings;
  - the #139 gate-1 reviewer's non-blocking notes 2 and 3 (`state/consults/gates/2026-09-28-wave2-b-admission-campaign-merge-gate1-reviewer.md`);
  - the architect's read `state/consults/2026-09-29-b1-p0-proposal-architect-read.md`, items 11 and 14(a)–(g).
- **Drafted by** the architect agent on the custodian's brief, read-only, against main at 834b2e7. The architect ran no command.
- **Reference form.** Code is cited by symbol, documents by section, rulings by round and item or by directive path and paragraph name. There are no line cites. Every restatement of a source in this form is a paraphrase. Nothing here is marked verbatim.
- **Branch.** `cut/filter-bind-coercions`, cut from main after the ADR-021 Note (§2.9) lands. PR #139 has merged (node `wave2-b-admission-campaign-merge`, done), so the regression net is on main.
- **Neighbour.** Node `b1-close-nul-column-names` (A2-1) also edits `engine/src/predicate.rs` (`filterable_column_type`) and also bumps the protocol literal. Whichever of the two merges second rebases onto the other. Each takes the literal after main's at its own merge (the 2026-09-29 sightings, closing line).

## §0. Disclosure

- **Evidence, not Authority:** P0 was measured at main 4e46166 with the `duckdb` crate 1.10505.0 (DuckDB v1.5.5). The evidence is in `state/drafts/b1-p0/`: `probe.rs.txt`, `matrices.txt`, `analysis/counts.txt`, `discriminators.rs.txt` and `discriminators.txt`. Every statement below about DuckDB's behaviour is an observation at v1.5.5 (round 15 (c)). This form measures nothing, and the 5 GB fixture is not read.
- **Code read at 834b2e7:**
  - `engine/src/predicate.rs`: `AdmittedPredicate::admit`, `structural_admit`, `differential_operands`, `walk_expr`, `namespace_admit`, `filterable_column_type`, `filter_surrogate`, `duckdb_type_name`, `bind_admit`, `FilterError` and its Display, `PredicateAdmitError`, and the `tests` module;
  - `kernel/src/skp.rs`: `filter_error_of`, `predicate_admit_error_of`, the comment in `SkpHost::viewport_query_mint`, and the `filter_error_of` test module;
  - `kernel/tests/skp_admission.rs`;
  - `engine/tests/admission_property_campaign.rs`, `engine/tests/predicate_admission.rs`, and `engine/tests/live_projection.rs` (E-20);
  - `engine/src/fixture.rs` (`AttributeMode`, `F32_VALUES`, `configured_connection`);
  - `protocol/skp/tests/fixtures.rs`, `protocol/skp/tests/data/`, and `SKP_VERSION` (`skp/0.6`);
  - `frontends/shell/src/admission/formatRefusal.ts` and `frontends/shell/src/skp/__tests__/fixtures.test.ts`.
- **Documents read:** ADR-021 (Decisions 2, 5, 6, 8; Consequences; What this ADR does not decide; the Note of 2026-09-24), SKP-V0 §§7.4–7.6 and §8, docs/01 principle 8, docs/09's predicate-admission section, ADR-010 rule 6, and AUTONOMY §§21a–21d and §25.
- **Findings from reading the code:**
  - **F1.** `structural_admit` returns column names only. The admitted operands that `differential_operands` returns are dropped (architect read, item 9).
  - **F2.** Several doc comments count the filter codes as eleven:
    - in `engine/src/predicate.rs`: `AdmittedPredicate::admit`'s doc, `FilterError`'s doc and its `DialectUnsupported` doc, and `PredicateAdmitError`'s doc and its `Filter` doc;
    - in `kernel/src/skp.rs`: the comment in `SkpHost::viewport_query_mint`, `predicate_admit_error_of`'s doc, and comments in the tests module.
  - **F3.** No `skp.filter_*` error fixture exists under `protocol/skp/tests/data/`. The projection codes are the precedent (`every_new_projection_error_fixture_round_trips`).
  - **F4.** The predicate in `v0-viewport_query-request-with-filter.json` (`zone = 3 AND area > 100`) would be refused on a VARCHAR `zone`. It is a wire-shape fixture that is never admitted, so it stays unchanged.
  - **F5.** The B-1 reproducer `b1_an_implicit_coercion_is_admitted_and_fails_in_the_scan_carrying_file_data` already asserts the fixed behaviour: its closing assertion is that nothing was admitted. This piece removes its `#[ignore]` and strengthens the assertion (§4 B-T4). There is nothing to invert.
  - **F6.** The P0 DIV block shows REAL division. The REAL row against an `i32` column shows the integer cast to REAL, rounding, and an integer literal divided into `f32` casts only the literal. This conflicts with a DOUBLE result for every `/`. → O-1.
  - **F7.** The mixed-list soundness argument (proposal §3 rule 4) bounds integer literals and scales, but not a decimal literal's integer digits. → O-2.
  - **F8.** For a literal refused only by a declared bound (for example a 21-digit literal against BIGINT, which widens losslessly), reason 1 as proposed would be false. → O-3.
  - **F9.** The shell consumes every refusal through `formatRefusal(SkpError)`, generically by code, message and fields, so no shell code changes.
  - **F10.** The binder-agreement pin needs no private access. It uses `AdmittedPredicate::admit` over a real `Dataset`, and `fixture::configured_connection` for `json_serialize_plan`.
  - **F11.** G1 in the campaign generates shapes that become refusals (`i64 < area`, `i64 = 1e2`, `(i64 + 0.1) …`, `id < 'inf'`), so its tallies change. The tallies are printed and not asserted.

## §1. What this preregistration may and may not claim

- **May claim, once §4 is green:** bind admission refuses, synchronously and typed, before any lease or mint, every implicit conversion outside the admitted class in §2. The refusal carries no value read from the file. At DuckDB v1.5.5 the admitted class is pinned against the binder's own plan by B-T1.
- **May not claim:**
  - any performance figure or docs/08 row;
  - that an evaluation failure is fixed. Integer overflow in admitted arithmetic belongs to node `stream-evaluation-failure-fixed-detail`;
  - that the admitted class holds at another DuckDB version without B-T1 green there;
  - any wire change beyond one code and the literal;
  - wording. Every new string is the human's (§2.6).
- **ADRs:** cited are ADR-021, ADR-010 rule 6, ADR-004, ADR-019 and ADR-006 (class 1, unchanged). ADR-021 changes only by the human's typed Note (§2.9). Nothing else is amended.

## §2. The rule, stated before it is applied

**2.1 Where.** Inside stage 3. `AdmittedPredicate::admit` calls the type walk after `bind_admit` returns `Ok`, that is, after the surrogate prepare and its BOOLEAN check. Every refusal those produce keeps its code and text. The walk issues no DuckDB call, puts no new text before DuckDB, and reads no plan at runtime. A type refusal is a stage-3 refusal, so the lease is discarded, as `bind_admit`'s refusals are today.

**2.2 The tree.** `structural_admit` returns the admitted operands with the column names, in one private return type, and the tree is parsed only once.
- A `COLUMN_REF` takes the surrogate type that `namespace_admit` returned for it. A name missing from the namespace (unreachable after stage 2) refuses `UnknownColumn`.
- A `CONSTANT` takes its type from `json_serialize_sql`'s `value.type`, including DECIMAL's width and scale.
- The literal kinds are integer (INTEGER, BIGINT, HUGEINT, UHUGEINT), decimal, double, string (VARCHAR) and NULL. A literal of any other type refuses `ConstructNotAdmitted`, naming the type.
- Bounds (§7): an integer literal is within bounds when its value has at most `MAX_INTEGER_LITERAL_DIGITS` digits, sign excluded (counted from the value, never from the parse type). A decimal literal is within bounds when its scale is at most `MAX_DECIMAL_LITERAL_SCALE` and its integer digits (width − scale) are at most `MAX_INTEGER_LITERAL_DIGITS` (O-2).
- An arithmetic result takes the type the binder gives it. The walk computes that type by a declared table, which B-T1 checks against the plan's `return_type` for every arithmetic node it enumerates.
- The walk's arms mirror `walk_expr`'s admitted arms one to one. Any node outside them refuses `ConstructNotAdmitted` (the allowlist's final arm).

**2.3 Comparison-shaped junctions:** `=`, `<>`, `<`, `<=`, `>`, `>=`, `IS [NOT] DISTINCT FROM`, a `BETWEEN` input against each bound, and an `IN` needle against each member. The first rule that matches admits the pair. "Integer" means an integer column, an integer arithmetic result, or an integer literal within bounds. "Float" means a REAL or DOUBLE column or result.
1. Identical types.
2. A NULL literal on either side.
3. Integer against integer: a lossless widening.
4. An integer of at most 64 bits, or an integer literal, against a decimal literal within bounds; and a decimal literal against a decimal literal, both within bounds.
5. A double literal against an integer of at most 32 bits.
6. A float against a numeric literal within bounds, or against a double literal; and a double literal against an integer or decimal literal within bounds. This covers (6i) and (6ii) as one declared conversion (the 2026-09-29 sightings, B-1 point 1): the literal becomes its nearest value in the float type, the file's value is never changed, and values at the boundary can compare equal. A REAL operand against a double literal widens to DOUBLE, which is lossless. It is declared here, outside B1 preregistration §8 item 13 (architect read 14(e)).
7. An integer of at most 16 bits against REAL, an integer of at most 32 bits against DOUBLE, and REAL against DOUBLE.
8. Everything else is refused.

The bounds keep `IN` and `BETWEEN` lists sound. With every literal within bounds, a list's common type is a DECIMAL of width at most 38 (20 integer digits plus scale 18), an integer, or a float into which each non-literal operand widens under rules 5–7. B-T1 carries mixed lists.

**2.4 Other junctions.**
- Each operand of `AND` and `OR`, and the operand of `NOT`, is BOOLEAN-typed or a NULL literal. Anything else refuses with reason `boolean_conversion`.
- `LIKE`/`ILIKE`: the operand is VARCHAR, and the pattern is a VARCHAR or NULL literal. Anything else refuses `text_with_non_text`. Today the binder refuses this first, so the arm is what makes the walk total.
- `IS [NOT] NULL`: any typed operand, with no rule.

**2.5 Arithmetic** (the 2026-09-29 sightings, B-1 point 4).
- (a) `+`, `-`, `*` apply §2.3's rules pairwise:
  - integer with integer is admitted;
  - float with a literal follows rule 6, and float with an integer follows rule 7 (else `conversion_rounds`);
  - a double literal with an integer follows rule 5;
  - a decimal literal with an integer or a decimal refuses `conversion_can_fail`. This covers integer-with-DECIMAL, and decimal-with-decimal by the same argument (O-5);
  - a string operand refuses `text_with_non_text`, and a BOOLEAN operand refuses `boolean_conversion`.
- (b) Unary `-` on any numeric operand is admitted, and its type is the operand's type.
- (c) `/` is declared floating-point division, admitted for any two numeric or NULL operands, literal bounds not applied. Its result and its operands' conversion are those of the division's float type. **O-1:** at v1.5.5 the binder divides in REAL when one operand is REAL-typed and none is DOUBLE-typed or a double literal (F6). The recommendation is that in that case an integer operand follows rules 6–7 (a literal becomes its nearest REAL; a column is admitted only up to 16 bits; wider refuses `conversion_rounds`). In every other case the operands convert to DOUBLE, a 64-bit integer beyond 2^53 rounds, and the result is DOUBLE.
- (d) Out of scope: integer overflow in admitted `+`, `-`, `*` or unary `-`, whose operand conversions are all lossless widenings (O-6). It goes to node `stream-evaluation-failure-fixed-detail`.

**2.6 The refusal.**
- A twelfth variant, `FilterError::TypeNotAdmitted { construct: String, operand_types: Vec<String>, reason: TypeRefusalReason }` (code name: O-4).
- `TypeRefusalReason` is a public enum of four, each with a wire value (O-4, the 2026-09-29 sightings, B-1 point 5): `ConversionCanFail` → `conversion_can_fail`, `ConversionRounds` → `conversion_rounds`, `TextWithNonText` → `text_with_non_text`, `BooleanConversion` → `boolean_conversion`.
- **Reason precedence for a refused pair:**
  1. `text_with_non_text`: one side is VARCHAR (column or string literal) and the other is neither VARCHAR nor NULL;
  2. `boolean_conversion`: one side is BOOLEAN and the other is neither BOOLEAN nor NULL;
  3. `conversion_can_fail`: a literal beyond bounds, or a DECIMAL conversion wider than rule 4 admits;
  4. `conversion_rounds`: everything else.
- `construct` is the operator's canonical spelling, taken from the parse node through a declared map: `=`, `<>`, `<`, `<=`, `>`, `>=`, `IS DISTINCT FROM`, `IS NOT DISTINCT FROM`, `BETWEEN`, `IN`, `AND`, `OR`, `NOT`, `LIKE`, `ILIKE`, `+`, `-`, `*`, `/`.
- `operand_types` lists the first refused pair in tree order, or the single operand of a junction. Each entry is the engine's type name (VARCHAR, BOOLEAN, TINYINT … UBIGINT, HUGEINT, REAL, DOUBLE, DECIMAL(w,s)). A literal gets the suffix ` literal`, and an arithmetic result gets ` expression`. On the wire the entries are joined with `; `, because a DECIMAL name contains a comma.
- **No file data:** fields and Display are built from types, the operator and the reason only.
- The Display and reason sentences are the human's (§2.9, drafts in the typed-texts section).

**2.7 Kernel.** `filter_error_of` gains one arm → `filter_type_not_admitted`, with fields `construct`, `operand_types`, `reason` (the wire value). It keeps no wildcard arm. `predicate_admit_error_of` is unchanged, and so is the kernel's terminal mapping.

**2.8 Wire.**
- One new code, and no command or member.
- `protocol/skp/tests/data/v0-error-filter_type_not_admitted.json` is new. It is the kernel's output for `zone = 1` on the CategoricalZone fixture.
- The literal is the one after main's at merge. A2-1 also bumps it. Both sides' fixtures for the literal and the new error fixture land in the bump commit.
- `protocol/data-plane/` has an empty diff.

**2.9 Documents.**
- The ADR-021 Note (the human's typed text) lands on main, byte-identical to what Fable sights, before any code.
- SKP-V0 gains dated notes only: §7.4, §7.5 (the row), §7.6 (stage 3), and a §8 entry for the new literal. Nothing earlier is rewritten.
- F2's doc comments are corrected to twelve.

**2.10 The campaign** (`engine/tests/admission_property_campaign.rs`).
- `code_of` gains the twelfth arm.
- The reproducer's `#[ignore]` is removed (B-T4).
- `filter_admission_property_campaign` asserts that no admitted predicate's stream ends in error, and that no stream error carries file data. The one exclusion is the class in §2.5(d), identified by both of these:
  - the predicate's typed class, integer arithmetic;
  - a terminal text containing `Overflow`.
- A named function in the test carries that exclusion. Its doc names node `stream-evaluation-failure-fixed-detail`, and it is removed when that node lands (reviewer note 2).

**2.11 Caller rule.**
- `TypeNotAdmitted` has two product callers: the walk, and `filter_error_of`.
- `TypeRefusalReason` and its wire-value function are called by `filter_error_of` and Display, and it is re-exported at the crate root for the kernel.
- The two bound constants are private.
- The pin adds no `pub` accessor.
- The new fixture variant `AttributeMode::FilterWitness` lives in the `fixture` module, which is compiled only under the dev feature `fixture` and is not in the shipped build. `AttributeMode::MultiType` is the precedent. The architect checks it (§9).

**2.12 OPEN (for Fable).**
- **O-1:** `/` with a REAL operand (§2.5(c)).
- **O-2:** the integer-digit bound also applies to a decimal literal's integer part (§2.2).
- **O-3:** reason 1's sentence covers refusals made only by a bound.
- **O-4:** the code name `skp.filter_type_not_admitted`, and fixed wire values for `reason` with the sentence rendered in Display.
- **O-5:** decimal-with-decimal arithmetic is refused.
- **O-6:** the excluded overflow class, as defined.

## §3. Fixtures and corpus, with pre-declared outcomes

- **FX-1**, new `AttributeMode::FilterWitness`: `id` (UInt64) plus `zone` (Utf8), `flag`, `i8`, `i16`, `i32`, `i64`, `u8`, `u16`, `u32`, `u64`, `f32`, `f64`. Row `id` takes witness `[id % len]` of each column's declared list:
  - VARCHAR: `civic`, `1`, `-1`, `1.5`, `true`, `t`, empty, ` 7 `, `300`, `9223372036854775808`, `NaN`, `inf`, NULL;
  - integers: each type's minimum, −1, 0, 1 and maximum, plus 16777217 for `i32`/`u32` and 9007199254740993 for `i64`/`u64`;
  - REAL: 0.1, −0.0, 16777216, `f32::MAX`, inf, −inf, nan, 1e10;
  - DOUBLE: 0.1, 9007199254740993, `f64::MAX`, inf, −inf, nan, 1e20;
  - BOOLEAN: true, false, NULL.

  It is written in-test, and its sha256 is taken after the write and checked equal at the end of each run. Predicted: an identical hash across runs, and every declared witness read back present.
- **FX-2**, MultiType (the campaign's fixture): unchanged.
- **FX-3**, CategoricalZone (`kernel/tests/skp_admission.rs::fixture_zoned`): unchanged.
- **FX-4**, the new error fixture (§2.8). Predicted: equal to B-T7's output.

**Corpus (B-T3, over FX-1).** TNA = `TypeNotAdmitted`.

| # | Predicate | Predicted |
|---|---|---|
| C1 | `zone = 1` | TNA `=`, `VARCHAR; INTEGER literal`, `text_with_non_text` |
| C2 | `i64 < 0.000000000000000000000000001` | TNA, `conversion_can_fail` |
| C3 | `flag = 'x'` | TNA, `text_with_non_text` |
| C4 | `flag = 1` | TNA, `boolean_conversion` |
| C5 | `NOT i32` | TNA `NOT`, `INTEGER`, `boolean_conversion` |
| C6 | `i32 AND flag` | TNA `AND`, `boolean_conversion` |
| C7 | `i64 = 1e3` | TNA, `conversion_rounds` |
| C8 | `i32 = f32` | TNA, `conversion_rounds` |
| C9 | `i64 < f64` | TNA, `conversion_rounds` |
| C10 | `i64 + 0.5 > 0` | TNA `+`, `conversion_can_fail` |
| C11 | `id < 'inf'` | TNA, `text_with_non_text` |
| C12 | `zone IN (1, 2)` | TNA `IN`, `text_with_non_text` |
| C13 | `u64 = 18446744073709551615`, `u64 = 18446744073709551616`, `u64 = 99999999999999999999`, and the three negated against `i64` | admitted |
| C14 | `i64 = 100000000000000000000`, `i64 = -100000000000000000000` | TNA, `conversion_can_fail` |
| C15 | `u64 > 0.000000000000000001` / `u64 > 0.0000000000000000001` | admitted / TNA `conversion_can_fail` |
| C16 | `f32 = 16777217`, `f32 = 0.1`, `f32 = 1e3` | admitted |
| C17 | `i64 / f64 > 1`, `i64 / 3 > 1` | admitted |
| C18 | `u8 + 1 > 0`, `i16 + f32 > 0` | admitted |
| C19 | `i32 + f32 > 0` | TNA, `conversion_rounds` |
| C20 | `i32 / f32 > 0` | TNA `conversion_rounds` under O-1 as recommended |
| C21 | `i64 IN (9223372036854775808, 0.5)` | admitted |
| C22 | `i64 IN (170141183460469231731687303715884105727, 0.5)` | TNA, `conversion_can_fail` |
| C23 | `i64 IN (123456789012345678901.5, 0.000000000000000001)` | TNA, `conversion_can_fail` (O-2) |
| C24 | `f64 = 100000000000000000000` | TNA, `conversion_can_fail` |
| C25 | `zone < 1`, `zone LIKE 1`, `u64 + 9223372036854775808 > 0` | `rejected_by_binder`, today's text |
| C26 | `i32` / `flag` | `not_boolean` / admitted |
| C27 | `flag = TRUE`, `CAST(zone AS INT) = 1` | `construct_not_admitted` (CAST) |
| C28 | `zone = x'41'`, `zone = $$x$$`, `zone = NULL`, `zone LIKE 'c%'` | admitted |

## §4. Tests, and the mutation per new test

Each mutation is observed by applying it, running the named test, recording the test's failure by name with the commit it was observed at, and reverting it (round 25, item 2 (c)). A `verify-mutation` run is never recorded as an observation.

- **B-T1 (new)** `the_type_walk_agrees_with_the_binder_over_the_p0_matrix`, in `engine/tests/filter_type_admission.rs` (new file), over FX-1.
  - The enumeration is:
    - the probe's case set (`state/drafts/b1-p0/probe.rs.txt`: every column type crossed with every literal and column operand, under every form it generates), less the dropped `u_str` row, with the count asserted equal to 7,620 on the probe's counting;
    - discriminators.txt's N-ARY lists;
    - the 2026-09-29 sightings' B-1 point 2 boundary literals, with their negatives, bare and in mixed `IN`/`BETWEEN` lists;
    - C23-shaped decimal rows.
  - For each admitted case:
    - (i) every `BOUND_CAST` in `json_serialize_plan` of `SELECT * FROM read_parquet('<FX-1>') WHERE (<p>)` is in §7's declared set: no cast to or from BOOLEAN (except NULL), no cast from VARCHAR;
    - (ii) the walk's arithmetic result types equal the plan's `return_type`;
    - (iii) the product stream (`Dataset::stream_with_cancel`, `ViewportQuery::all()`) ends without error, outside §2.5(d).
  - It also asserts that FX-1 carries inf, −inf, nan and the maximum for both REAL and DOUBLE, and that the hash is unchanged.
  - Mutation: rule 5 widened to 64-bit integers. It fails by name on `i64 = 1e3` (a BIGINT→DOUBLE column cast outside the set).
- **B-T2 (new)** `a_float32_column_compared_with_16777217_matches_a_stored_16777216` (same file, FX-1). The row set of `f32 = 16777217` equals the ids whose stored `f32` is 16777216f32, is non-empty, and equals `f32 = 16777216`'s set. Mutation: rule 6 restricted to decimal literals. It fails by name (refused TNA).
- **B-T3 (new)** `each_corpus_row_is_admitted_or_refused_with_its_code_reason_and_operand_types` (same file). It asserts §3's table cell by cell. Mutation: `MAX_INTEGER_LITERAL_DIGITS` = 21. It fails by name on C14.
- **B-T4 (changed)** `b1_an_implicit_coercion_is_admitted_and_fails_in_the_scan_carrying_file_data`. The `#[ignore]` is removed, and the test asserts each of its three predicates refused TNA with C1's, C2's and C3's reasons. Mutation: `admit` skips the type walk. It fails by name on its existing no-admission assertion.
- **B-T5 (changed)** `filter_admission_property_campaign` (§2.10). Mutation: `admit` skips the type walk. It fails by name on the stream-error assertion.
- **B-T6 (new)** `filter_type_not_admitted_maps_to_its_code_and_fields`, in `kernel/src/skp.rs` tests. Mutation: the arm maps to `filter_rejected_by_binder`. It fails by name.
- **B-T7 (new)** `a_filtered_viewport_query_comparing_text_with_a_number_refuses_synchronously_typed_and_mints_no_ticket`, in `kernel/tests/skp_admission.rs` (FX-3, `zone = 1`). It asserts:
  - the code;
  - the exact key set {construct, operand_types, reason};
  - that code, message and fields equal FX-4;
  - `cancel_all_for_dataset` returns 0.

  Mutation: `admit` skips the type walk. It fails by name (the call is admitted).
- **B-T8 (new)** `the_filter_type_not_admitted_error_fixture_round_trips`, in `protocol/skp/tests/fixtures.rs`. It asserts the code, the exact key set and a byte-identical round trip. Mutation: FX-4's `reason` key renamed. It fails by name.
- **B-T9 (new)** a case in `frontends/shell/src/skp/__tests__/fixtures.test.ts` that parses FX-4 as `SkpError` with its three fields. Mutation: the same rename, and it fails by name.
- **B-T10 (new)** `an_untyped_node_or_literal_type_is_refused_by_the_type_walk`, in the `engine/src/predicate.rs` tests, on a constructed node (the `an_unrecognized_select_node_key_is_refused_rather_than_silently_passed` pattern). Mutation: the final arm returns `Ok`. It fails by name.
- **Changed mechanically, no assertion changed:** the `predicate.rs` unit tests that destructure `structural_admit`'s return, and the literal assertions in both sides' fixture and client tests.

## §5. Predictions · declared unchanged · invalidators · falsification

**Predictions** (a wrong one is a result, class 2):
- P-1: §3 as tabled.
- P-2: B-T1 (i)–(iii) hold for every admitted case.
- P-3 (hypothesis): REAL division as in F6. Discriminator: B-T1's plan for `i32 / f32`. The outcome selects the Note's wording under O-1 and does not invalidate the piece.
- P-4 (hypothesis): `value.type` carries DECIMAL width and scale, and HUGEINT values yield their digit count. Discriminator: B-T3, C13–C15.
- P-5: float arithmetic raises no error over FX-1's float witnesses at v1.5.5 (architect read 14(d)).
- **P-6, the INTERNAL-error observation, holds at v1.5.5** (the 2026-09-29 sightings, B-1 point 3). `u64 {+,-,*} 9223372036854775808` raises DuckDB's INTERNAL error in the surrogate prepare. It is refused `rejected_by_binder` before the walk runs, and the connection, a second pooled connection and a new connection all kept working (discriminators.txt, its INTERNAL rows). It is restated if DuckDB is bumped.

**Declared unchanged:**
- Every refusal that stages 1, 2 and 3 produce today, with its code and text, including `rejected_by_binder` and `not_boolean`.
- E-20 `how_a_float32_column_compares_with_a_numeric_literal_is_pinned` and `a_file_with_a_float32_column_binds_every_predicate_without_panicking`.
- Every test in `engine/tests/predicate_admission.rs`, and `kernel/tests/skp_projection.rs::a_filter_refusal_for_a_still_refused_type_keeps_todays_reason_byte_for_byte`.
- The eleven existing codes, with their fields and Display.
- The pool discipline for every stage.
- `build_sql` and the composition rule.
- ADR-021's two named function sets, and SKP-V0 §7.4's construct list.
- `protocol/data-plane/`, and the kernel's terminal mapping.
- The shell code.
- ADR-023 §2, ADR-004 and docs/08.

**Invalidators** (stop, and return to the architect):
- any declared-unchanged item moves;
- the walk cannot sit after the prepare without changing a binder refusal;
- an admitted case's plan shows a cast outside §7 that no rule inside the sighted design removes;
- a refusal that no four-reason sentence states truly;
- an INTERNAL error reached by an admitted case's scan, or observed to invalidate another connection (the walk then moves before the prepare, by amendment);
- a `pub` item without a product caller is needed.

**Falsification:** at v1.5.5, a conversion that §2 admits (other than `/` and the nearest-float literal) fails, or changes a file value, during the scan.

## §6. Instruments

All are assertions: typed outcomes, plan casts, row sets, key sets and hashes. There is no measurement. The CI wall time of B-T1 and B-T5 is stated at the reviewer gate as an observation, not a docs/08 figure.

## §7. Declared values and ceilings

- `MAX_INTEGER_LITERAL_DIGITS = 20`: the digits of an integer literal, or of a decimal literal's integer part, sign excluded. Private, in `engine/src/predicate.rs`, at its site (ADR-010 rule 6).
- `MAX_DECIMAL_LITERAL_SCALE = 18`: a decimal literal's scale. Private, at the same site.
- **The declared cast set** (B-T1's table, in the test file):
  - integer → wider integer or HUGEINT;
  - integer of at most 64 bits → DECIMAL(w,s) with w ≤ 38;
  - integer of at most 16 bits → REAL; integer of at most 32 bits → DOUBLE; REAL → DOUBLE;
  - as `/` operands: any integer → DOUBLE, and under O-1, integer of at most 16 bits → REAL;
  - on literals: numeric → numeric, NULL → any, VARCHAR → VARCHAR only.
- **The reason set:** four wire values (§2.6).
- **Budget** (a class-8 overrun is recorded against these lines): at most 1,800 insertions plus deletions over at most 32 files of non-generated code, tests and test data, counted by `git diff --numstat origin/main...HEAD` excluding this form, `*.md`, `state/**`, `PLAN.yaml`, `CUSTODIAN-QUEUE.*`, `site/**` and lockfiles.

## §8. Block-on-sight

1. Any code before this form is on main, or before the ADR-021 Note lands on main byte-identical to what was sighted. Any code touching an OPEN point before its ruling.
2. A refusal that exists today changes code or text.
3. The walk runs before the prepare or before the BOOLEAN check.
4. A second parse, a new DuckDB call or text in the walk, or plan text read at runtime.
5. A rule table that admits by default, or any arm without a final refusal.
6. A conversion admitted outside §2.3–§2.5.
7. Bounds that are not the §7 constants, or literals bounded by parse type.
8. A value from the file in any field or Display of `TypeNotAdmitted`, or a message stating another module's consequence.
9. A fifth reason, or a reason sentence false for a corpus row.
10. A wildcard arm in `filter_error_of` or `code_of`.
11. A doc comment from F2 still counting eleven.
12. The reproducer still ignored, or its assertions weakened.
13. A campaign exclusion broader than §2.5(d), or one that does not name the node.
14. E-20, or `a_file_with_a_float32_column_binds_every_predicate_without_panicking`, edited or red.
15. B-T1 ignored in CI, its enumeration short of §4's, or a boundary literal or float witness missing.
16. A new `pub` accessor, or a `pub` constant with only test callers.
17. A new wire member or command, or a `protocol/data-plane/` diff.
18. The new code without FX-4 on both sides in the literal-bump commit, or a literal other than the one after main's at merge.
19. An ADR-021 edit other than the Note, or an ADR-023 edit.
20. An SKP-V0 §§1–7 rewrite instead of dated notes, or an earlier §8 entry edited.
21. A shell code change not declared by amendment.
22. P-6, or any DuckDB behaviour, stated without its version.
23. A mutation recorded as observed without the run, or a `verify-mutation` run called an observation.
24. A test-text span on an unmerged branch pinned by hash at a branch commit, or named without its commit id.
25. A discharge claim without a resolvable proof.
26. Any performance claim.

## §9. Gates

Full gating (AUTONOMY §21a): the piece touches an ADR, the wire and a stated guarantee.
- **Architect:**
  - §8 item by item;
  - the Note on main byte-identical to what was sighted;
  - docs/01 principle 8 (every admitted conversion declared);
  - ADR-010 rule 6;
  - the seams, read on the branch:
    - kernel → engine through `FilterError::TypeNotAdmitted`, proved by B-T7;
    - shell → kernel through `formatRefusal(SkpError)`, proved by B-T9 on FX-4 and B-T7's equality with FX-4;
  - the caller rule (§2.11), including the dev-feature fixture variant.
- **Reviewer:**
  - the full diff, three-dot;
  - `git diff --stat origin/main...HEAD -- protocol/data-plane/` shown empty;
  - each mutation observed by name at a commit, then reverted;
  - discharge claims resolved;
  - the CI times of B-T1 and B-T5 stated.
- **Suites:** every CI job on the PR, green, including `cargo test --workspace` (Windows), the shell's suite, `node --test` over `scripts/`, and the `scripts/plan` verifiers. The pre-gate self-checks (§6a) run first.
- **Operator:** none. The strings are sighted with the typed texts (the 2026-09-29 sightings, B-1 point 6).
- **Record:** the gate reports are the observation of record. A closing amendment is references and hashes only (the record cap).

## §10. Amendments — opens empty, append-only

### Amendment 1 — 2026-09-30, before any code: §2.12's OPEN items ruled, and the typed texts accepted

*This amendment records two things. The first is Fable's rulings on O-1 to O-6 and on the architect's item 8: Part 1 of `state/directives/B-1-RULINGS-AND-TYPED-TEXTS-2026-09-30.md` (sha256 76e139be7a2515abae1b28c11b80a18f58f451d13e93dafd41ccbf427c23f079), cited by item and not reproduced. The second is the human's acceptance of that file's Part 2, which covers T-A, T-B and T-C with `<date>` filled as 2026-09-30 (RULED 2026-09-30 in `DECISIONS-PENDING.md`). This amendment is a record only; no code of this piece exists. Where a section is restated below, the text is this form's new wording, not a quotation of the rulings.*

- **§2.12.**
  - O-1 to O-6 are ruled. O-1 and O-3 take effect as below. O-2, O-4, O-5 and O-6 are accepted as this form states them.
  - The architect's item 8 is accepted, with O-3's precedence.
- **§2.5(c) is replaced (O-1).**
  - `/` is declared floating-point division. It is admitted for any two numeric or NULL operands, and the literal bounds do not apply.
  - It divides in the float type the binder chooses: REAL when one operand is REAL-typed and none is DOUBLE-typed or a double literal (F6), and DOUBLE otherwise.
  - Its operands convert to that type. The rounding that follows is declared, not refused.
  - The recommendation to admit only integers of at most 16 bits in REAL division, refusing wider ones `conversion_rounds`, is not adopted.
  - B-T1 pins the chosen type (P-3's discriminator).
- **§2.6 (O-3).** `TypeRefusalReason` is an enum of five: the four named, and `LiteralOutOfBounds` → `literal_out_of_bounds`. The precedence for a refused pair:
  1. `text_with_non_text`, as stated.
  2. `boolean_conversion`, as stated.
  3. `literal_out_of_bounds`: a literal beyond §7's two bounds.
  4. `conversion_can_fail`: a DECIMAL conversion wider than rule 4 admits, or §2.5(a)'s decimal literal beside an integer or a decimal (O-5).
  5. `conversion_rounds`: everything else.

  The reason sentences and the Display are T-C's, as accepted.
- **§3, C20** (`i32 / f32 > 0`): admitted (O-1).
- **§3, a consequence of O-3's precedence that Part 1's last item does not list.** This is for Fable's check alongside T-A's docs PR, before any code. The rows refused only by a bound predict `literal_out_of_bounds`, not `conversion_can_fail`:
  - C15's second case (a decimal scale of 19);
  - C22 (a 39-digit literal);
  - C23 (a 21-digit integer part, O-2);
  - C24 (a 21-digit literal).
- **§7.**
  - The `/` line of the declared cast set now reads: as `/` operands, any integer converts to the division's float type (§2.5(c)), with the rounding declared. The "under O-1" clause is removed.
  - The reason set is five wire values (§2.6).
  - The two bounds, the rest of the cast set and the budget stand.
- **Order of work.**
  1. T-A (the ADR-021 Note, `<date>` = 2026-09-30) lands on main by a docs PR, byte-identical to the accepted text, before any code (§2.9).
  2. T-B and T-C bind the code.
  3. T-D lands with the code and the literal bump, never before. The literal is the one after main's at merge; main's is now `skp/0.7`.

### Amendment 2 — 2026-09-30, before any code: Amendment 1's §3 consequence checked

*A record only, by reference. Fable's check of Amendment 1's §3 item, that the rows refused only by a bound (C15's second case, C22, C23 and C24) predict `literal_out_of_bounds`: confirmed as the intended consequence of O-3, with no further sighting (`state/directives/2026-09-30-takeover.md`, item 2). No row, test, value or section changes.*

### Amendment 3 — 2026-09-30, before any code: O-3's precedence applied to C2, C14, §5 and §8

*A record only, by reference. Each change encodes O-3's precedence (Part 1 of `state/directives/B-1-RULINGS-AND-TYPED-TEXTS-2026-09-30.md`), already recorded in Amendment 1's §2.6. Two more corpus rows carry a literal beyond §7's bounds, and two sections still counted four reasons. The custodian reported this as a P-004 closure, and Fable confirmed it with no sighting first (`state/directives/2026-09-30-fable-amendment-3-confirmed.md`). Where a section is restated below, the text is this form's new wording, not a quotation.*

- **§3, C2** (`i64 < 0.000000000000000000000000001`, a decimal scale of 27): predicts TNA, `literal_out_of_bounds`. B-T4's C2 predicate follows its cell.
- **§3, C14** (both cases: a 21-digit literal against BIGINT): predicts TNA, `literal_out_of_bounds`. B-T3's mutation (`MAX_INTEGER_LITERAL_DIGITS` = 21) still fails by name on C14.
- **§5, invalidators:** the reason-sentence invalidator reads: a refusal that no five-reason sentence states truly.
- **§8, item 9** reads: a reason outside the five, or a reason sentence false for a corpus row.
