# B-1 — Fable's O rulings and the texts for the human's typed acceptance (2026-09-30)

*Fable, 2026-09-30. For PLAN node `filter-bind-admission-implicit-coercions`. Sources: `engine/FILTER-BIND-COERCIONS-PREREGISTRATION.md` §2.12 (O-1 to O-6) and the architect's drafting consult `state/consults/2026-09-29-b1-prereg-architect-draft.md` (T-A to T-D). Part 1 is Fable's rulings. Part 2 is the final text of T-A to T-D after those rulings. The human accepts Part 2 by a typed line; until then no code of B-1 begins.*

## Part 1 — rulings on O-1 to O-6

- **O-1, `/` with a REAL operand: admit all REAL division, declared.** My 2026-09-29 point 4 assumed every `/` divides in DOUBLE. At v1.5.5 that premise is false (F6), and the Note must state the true fact. The ruling's principle stands: a division's float semantics belong to the operator. So its operands convert to the float type the binder divides in, REAL or DOUBLE, and the rounding that follows is declared, not refused. Refusing wider integers in REAL division, as the architect recommended, would refuse `i32 / f32` density filters while `i64 / f64` stays admitted with the same kind of rounding. B-T1 pins the chosen type. C20 (`i32 / f32 > 0`) becomes admitted, and §7's "under O-1" line is removed.
- **O-2: accepted.** The 20-digit bound also applies to a decimal literal's integer part. C23 and B-T1 carry it.
- **O-3: a fifth reason, `literal_out_of_bounds`.** A 21-digit literal against BIGINT cannot fail, so it should not be refused with a sentence about failing, even inside a disjunction. The refusal names exactly why (principle 8). The five reasons also mirror the Note's five refused cases one for one. Precedence: `text_with_non_text`, `boolean_conversion`, `literal_out_of_bounds`, `conversion_can_fail`, `conversion_rounds`.
- **O-4: accepted.** The code is `skp.filter_type_not_admitted`. `reason` carries fixed snake_case wire values, and the sentence lives only in Display, so a wording change never changes the wire.
- **O-5: accepted.** A decimal literal beside an integer or a decimal in `+`, `-` or `*` is refused `conversion_can_fail`.
- **O-6: accepted as defined.** The class is overflow in admitted integer arithmetic whose operand conversions are all lossless widenings, `i32 + i64` included. It is identified by the typed class and an `Overflow` terminal text together, and routed to node `stream-evaluation-failure-fixed-detail`.
- **The architect's item 8 (filled without a ruling): accepted,** with the precedence above. T-A lands on main before any code, by A2-1's route.
- **The preregistration:** record these rulings as §10's first amendment before any code. That amendment updates §2.5(c), §2.6 (five reasons and the precedence), C20's pre-declared outcome and §7.

## Part 2 — the texts for the human's typed acceptance

`<date>` is the date of the human's typed acceptance, filled when the text lands.

### T-A. The ADR-021 Note

## Note <date> — what bind admission admits and refuses (decision 6.3), and a twelfth refusal code (decision 8)

*Appended under the human's typed acceptance of <date> (the 2026-09-29 sightings, Fable's B-1 point 6; Fable's O rulings of 2026-09-30). The text above is unchanged, the Status line and the earlier Notes included. Implementation: `engine/FILTER-BIND-COERCIONS-PREREGISTRATION.md`.*

1. **The refused class.** Decision 6.3's implicit coercion is refused when the predicate's binding needs:
   - a comparison of text with a non-text value;
   - a conversion to or from BOOLEAN;
   - a numeric literal beyond the declared bounds: more than 20 digits in its integer part, or a decimal scale above 18;
   - a conversion that can fail during the scan;
   - a conversion that changes a value read from the file before it is compared.
2. **The admitted class.** Every conversion not named here is refused:
   - identical types, and a NULL literal against anything;
   - integer against integer: a lossless widening;
   - an integer of at most 64 bits against a decimal literal within the bounds;
   - a double literal against an integer of at most 32 bits;
   - an integer of at most 16 bits against REAL, of at most 32 bits against DOUBLE, and REAL against DOUBLE;
   - a numeric literal against a REAL or DOUBLE value. The literal becomes its nearest value in that float type, and the value from the file is never changed. The comparison is made in the float type, so values at the boundary can compare equal: a stored REAL 16777216 equals the literal 16777217;
   - two numeric literals within the bounds.

   The same rules apply inside `+`, `-` and `*`, except that a decimal literal beside an integer or a decimal is refused, because that conversion can fail. `AND`, `OR` and `NOT` take BOOLEAN operands only.
3. **`/` is declared floating-point division.** It is admitted for any numeric operands. It divides in the float type the binder chooses: REAL when one operand is REAL and none is DOUBLE or a double literal, and DOUBLE otherwise. Its operands convert to that type, so an integer beyond 2^24 (REAL) or 2^53 (DOUBLE) rounds, and the result has that type. The float semantics belong to the operator. They are not an implicit coercion.
4. **The arithmetic set is unchanged.** The two named function sets (Consequences; What this ADR does not decide) stand. An integer overflow in `+`, `-`, `*` or unary `-` involves no conversion and is not decided here.
5. **Where it runs.** In stage 3, after the surrogate prepare and its BOOLEAN check. A predicate the binder refuses keeps `filter_rejected_by_binder`.
6. **Decision 8 gains a twelfth code:** `filter_type_not_admitted`, with fields `construct` (the operator), `operand_types` (the engine's type names) and `reason` (one of five fixed values). It is refused synchronously, before any lease or mint, and carries no value read from the file. Decision 8's exhaustive mapping applies to the twelve. The Note of 2026-09-24 spoke to its own item, and this Note does not change it.

### T-B. Decision 8's twelfth code

`skp.filter_type_not_admitted`, with fields `construct`, `operand_types` (entries joined with `; `) and `reason`. Its variant is `FilterError::TypeNotAdmitted`.

### T-C. The five reason strings (wire value → sentence), in precedence order

- `text_with_non_text` → a comparison of text with a non-text value
- `boolean_conversion` → a conversion to or from BOOLEAN
- `literal_out_of_bounds` → a numeric literal beyond the declared bounds (20 integer digits; decimal scale 18)
- `conversion_can_fail` → a conversion that can fail during the scan
- `conversion_rounds` → a conversion that can round a value read from the file before it is compared

Display: `` refused: `{construct}` over {operand_types joined with " and "}: {sentence} (docs/01 principle 8) ``

### T-D. SKP-V0 wording (dated notes only; they land with the code and the literal bump, never before)

- **§7.4 note:** the admitted constructs are also subject to stage 3's type rules (§7.6). `/` is floating-point division in the float type the binder chooses, as ADR-021's Note <date> declares. No construct is added or removed.
- **§7.5 note:** one row, `skp.filter_type_not_admitted` | `construct`, `operand_types`, `reason`, followed by the five `reason` values. The heading stays as it is.
- **§7.6 note:** stage 3's refused coercion is the class ADR-021's Note <date> defines. After the surrogate prepare and the BOOLEAN check, the engine types the admitted tree and refuses anything outside the admitted class as `skp.filter_type_not_admitted`. A binder refusal keeps `skp.filter_rejected_by_binder`.
- **§8 entry**, `skp/0.<n>`, bind admission's type rules:
  - no command, no request or response member; one new typed refusal;
  - `protocol/data-plane/` has an empty diff;
  - mechanics: one literal bumped once, from main's to the next at merge, with both sides' fixtures and `v0-error-filter_type_not_admitted.json` in the bump commit;
  - `skp/1` stays RESERVED.
