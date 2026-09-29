# B-1 full-form preregistration — the architect's drafting consult (2026-09-29)

*Custodian's filing note: this is the architect agent's hand-back on the custodian's drafting brief for PLAN node `filter-bind-admission-implicit-coercions`, read at main 834b2e7. It is a drafting consult, not a gate. It is copied from the hand-back message with the harness's two-space indent removed, and its closing file list's absolute paths are shortened to repository paths.*

*The report's FORM TEXT section is committed, byte for byte, as `engine/FILTER-BIND-COERCIONS-PREREGISTRATION.md`, from its title line to its "§10. Amendments" heading. It is not repeated here. Everything else in the report follows below: its verdict line, the texts for the human to type, and the gaps.*

*The custodian's checks before filing:*
- *The report's two measurable gaps were confirmed against DuckDB v1.5.5.*
  - *O-1: P0's plans show REAL division. `i32 / f32` casts `i32` to FLOAT, and `f32 / 1` and `f32 / 1.5` cast only the literal to FLOAT. With a DOUBLE operand, the division is in DOUBLE. The evidence is `state/drafts/b1-p0/` (probe.rs.txt's output, re-read with `analysis/`).*
  - *O-2: `state/drafts/b1-p0/o2-discriminator.txt`. A decimal literal with 21 or more integer digits in a list with a scale-18 literal forces DECIMAL(38,18), and its cast fails ("out of range"). With 20 digits it passes.*
- *F5 was confirmed: the reproducer's own `#[ignore]` reason says it asserts the fixed behaviour.*
- *Every test and symbol the form names as existing was found in the tree at 9c21145.*

---

**Verdict: pass with notes. Reviewed: main @ 834b2e7** (a drafting consult, not a gate). The sighted design drafts cleanly. Three gaps are real, and they sit in Fable's premises, not in the proposal: `/` over REAL, the n-ary bound, and whether reason 1 is true. The form carries them as OPEN O-1 to O-3, and the last section argues each one. I ran no commands. Everything below comes from reading files at 834b2e7.

=====================================================================
TEXTS FOR THE HUMAN TO TYPE (not part of the form; drafts for Fable's sight)
=====================================================================

**T-A. The ADR-021 Note** (one Note, following the 2026-09-24 precedent; appended after the Note of 2026-09-29):

## Note <date> — what bind admission admits and refuses (decision 6.3), and a twelfth refusal code (decision 8)

*Appended under the human's typed acceptance of <date> (the 2026-09-29 sightings, Fable's B-1 point 6). The text above is unchanged, the Status line and the earlier Notes included. Implementation: `engine/FILTER-BIND-COERCIONS-PREREGISTRATION.md`.*

1. **The refused class.** Decision 6.3's implicit coercion is refused when the predicate's binding needs:
   - a conversion that can fail during the scan;
   - a conversion that changes a value read from the file before it is compared;
   - a conversion to or from BOOLEAN;
   - a comparison of text with a non-text value;
   - a numeric literal beyond the declared bounds: more than 20 digits in its integer part, or a decimal scale above 18.
2. **The admitted class.** Every conversion not named here is refused:
   - identical types, and a NULL literal against anything;
   - integer against integer: a lossless widening;
   - an integer of at most 64 bits against a decimal literal within the bounds;
   - a double literal against an integer of at most 32 bits;
   - an integer of at most 16 bits against REAL, of at most 32 bits against DOUBLE, and REAL against DOUBLE;
   - a numeric literal against a REAL or DOUBLE value. The literal becomes its nearest value in that float type, and the value from the file is never changed. The comparison is made in the float type, so values at the boundary can compare equal: a stored REAL 16777216 equals the literal 16777217.

   The same rules apply inside `+`, `-` and `*`. `AND`, `OR` and `NOT` take BOOLEAN operands only.
3. **`/` is declared floating-point division.** It is admitted for any numeric operands. Its operands convert to DOUBLE, so a 64-bit integer beyond 2^53 rounds, and its result is DOUBLE. [O-1 as recommended adds: where one operand is REAL and none is DOUBLE, the division is made in REAL, and an integer operand follows item 2's rules for REAL.] The float semantics belong to the operator. They are not an implicit coercion.
4. **The arithmetic set is unchanged.** The two named function sets (Consequences; What this ADR does not decide) stand. An integer overflow in `+`, `-`, `*` or unary `-` involves no conversion and is not decided here.
5. **Where it runs.** In stage 3, after the surrogate prepare and its BOOLEAN check. A predicate the binder refuses keeps `filter_rejected_by_binder`.
6. **Decision 8 gains a twelfth code:** `filter_type_not_admitted`, with fields `construct` (the operator), `operand_types` (the engine's type names) and `reason` (one of four fixed values). It is refused synchronously, before any lease or mint, and carries no value read from the file. Decision 8's exhaustive mapping applies to the twelve. The Note of 2026-09-24 spoke to its own item, and this Note does not change it.

**T-B. Decision 8's twelfth code:** `skp.filter_type_not_admitted`, with fields `construct`, `operand_types` (entries joined with `; `) and `reason`. Its variant is `FilterError::TypeNotAdmitted`.

**T-C. The four reason strings, for sight** (wire value → sentence):
- `conversion_can_fail` → a conversion that can fail during the scan, or a literal beyond the declared bounds (20 integer digits; decimal scale 18)
- `conversion_rounds` → a conversion that can round a value read from the file before it is compared
- `text_with_non_text` → a comparison of text with a non-text value
- `boolean_conversion` → a conversion to or from BOOLEAN

Display draft: `` refused: `{construct}` over {operand_types joined with " and "} needs {sentence}, which filter admission does not perform implicitly (docs/01 principle 8) ``

**T-D. SKP-V0 wording** (dated notes only):
- **§7.4 note:** the admitted constructs are also subject to stage 3's type rules (§7.6). `/` is floating-point division, as ADR-021's Note <date> declares. No construct is added or removed.
- **§7.5 note:** one row, `skp.filter_type_not_admitted` | `construct`, `operand_types`, `reason`, followed by the four `reason` values. The heading stays as it is.
- **§7.6 note:** stage 3's refused coercion is the class ADR-021's Note <date> defines. After the surrogate prepare and the BOOLEAN check, the engine types the admitted tree and refuses anything outside the admitted class as `skp.filter_type_not_admitted`. A binder refusal keeps `skp.filter_rejected_by_binder`.
- **§8 entry**, `skp/0.<n>`, bind admission's type rules:
  - no command, no request or response member; one new typed refusal;
  - `protocol/data-plane/` has an empty diff;
  - mechanics: one literal bumped once, from main's to the next at merge, with both sides' fixtures and `v0-error-filter_type_not_admitted.json` in the bump commit;
  - `skp/1` stays RESERVED.

=====================================================================
GAPS THE SIGHTING LEAVES — each a proposal for Fable
=====================================================================

1. **O-1 (real gap).** Fable's point 4 gives `/` a DOUBLE result with operands converting to DOUBLE. P0's DIV block (matrices.txt) shows that at v1.5.5 the binder divides in REAL when an operand is REAL: `i32 / f32` casts `i32` to REAL (rounding), and `f32 / 1` casts only the literal. As written, the Note would state a false fact. Two options:
   - **Recommended:** in REAL division, integer operands follow rules 6–7. Otherwise admit, and word the Note accordingly.
   - Alternative: admit all REAL division and declare REAL rounding in the Note.
2. **O-2 (real gap).** Bounding integer literals and scales alone does not make mixed lists sound. For example, `i64 IN (<37 integer digits>.5, 0.000000000000000001)` needs DECIMAL(55,18). Proposal: the 20-digit bound also applies to a decimal literal's integer part. C23 and B-T1 test it.
3. **O-3 (real gap).** A literal refused only by a bound often cannot fail, as with a 21-digit literal against BIGINT or scale 19 against TINYINT. "Can fail" would then be false (principle 8; the rule that engine messages state engine facts). Proposal: reason 1's sentence names the declared bounds as well, which keeps four reasons. The alternative is a fifth reason.
4. **O-4.** Fable ruled 6a without a name. The form uses `skp.filter_type_not_admitted`, and puts fixed snake_case values on the wire for `reason`, with the sentence in Display, so that a wording change never changes the wire.
5. **O-5.** Fable names integer-with-DECIMAL arithmetic. The form refuses decimal-with-decimal too, by the same argument that the conversion can fail.
6. **O-6.** "Same-type overflow" is read as overflow in admitted integer arithmetic whose operand conversions are all lossless widenings. This includes `i32 + i64`. The test identifies the class by the predicate's typed class and by an `Overflow` terminal text, together.
7. **Brief note, not a gap in the sighting.** The reproducer's assertion already asserts the fixed behaviour (F5), so "inverted" is carried out as "strengthened".
8. **Filled without a ruling, flagged:**
   - the reason precedence (text before BOOLEAN before bounds before rounding);
   - `operand_types` naming the first refused pair, joined with `; `;
   - a type refusal discarding the lease (stage 3's discipline);
   - untyped nodes and literals refusing `construct_not_admitted`;
   - rules applied to literal-with-literal pairs and to arithmetic results by type;
   - the typed Note landing on main before any code (A2-1's route).

**Files:**
- `state/directives/2026-09-29-a2-1-and-b-1-sightings.md`
- `state/drafts/b1-p0/B1-P0-AND-PROPOSAL.md`
- `state/drafts/b1-p0/matrices.txt`
- `state/drafts/b1-p0/discriminators.txt`
- `state/drafts/b1-p0/probe.rs.txt`
- `engine/src/predicate.rs`
- `kernel/src/skp.rs`
- `engine/tests/admission_property_campaign.rs`
- `engine/tests/live_projection.rs`
- `docs/adr/ADR-021-row-filter-on-viewport-query.md`
- `protocol/skp/SKP-V0.md`
- `docs/PREREGISTRATION-TEMPLATE.md`
