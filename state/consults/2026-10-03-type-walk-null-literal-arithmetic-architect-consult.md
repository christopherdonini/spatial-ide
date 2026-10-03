*Custodian's filing note (2026-10-03): the architect's drafting consult on lead-data's node 10 draft (`state/consults/2026-10-03-type-walk-null-literal-arithmetic-lead-data-draft.md`): the draft's questions 2 and 3, and the options for O-1. A consult, not a gate, and not Authority. It arrived as a message, since the architect has no Write tool, and is transcribed here from its hand-back with the harness's two-space indent removed. Write audit PASS: zero write calls (Read 13, Grep 15). C3 clean: before 18:39:46Z at fcc4146d, after 18:46:46Z at b64a8d39, with HEAD moved only by the custodian's ledger commits and no worktree difference. **Checked by the custodian:** the defect bearing on Q2 is confirmed by `git grep` at b64a8d39. Three fixture lines name `text_with_non_text` (`kernel/src/skp.rs:2846`, `protocol/skp/tests/data/v0-error-filter_type_not_admitted.json:7`, `frontends/shell/src/skp/__tests__/fixtures.test.ts:470`), as does SKP-V0's note listing the five values (`protocol/skp/SKP-V0.md:490-491`).*

---

Reviewed: main @ fcc4146d; draft sha256 e22f787ebecb24d3b2779f1319076992d0715b872d624c7a135cc8905e3bd4f2 (from line 5 of the filed file)

**Verdict (drafting consult, not a gate):** Q2: confined under C2, with one condition. Q3: conformance, so no ruling is needed. O-1: neither drafted outcome is true of case (b). Recommendation and options below. There are no quotations in this report. Every restatement is my paraphrase, cited by path:line at fcc4146d. sha256: not computed.

## Q2 (C2, confinement): confined, on one condition

- **What C2 tests.** It asks whether a piece changes a contract another module consumes (`state/directives/2026-10-03-lead-data-pilot-clarification.md:24-28`). Whether a client can see the change is not the test.
- **What the SKP contract is.**
  - SKP-V0 §7.6's dated note does not list outcomes predicate by predicate. It defines stage 3's refused class by reference to ADR-021's Note 2026-09-30, and it says the engine refuses anything outside that class with the one code (`protocol/skp/SKP-V0.md:512-516`).
  - §7.5's note fixes the code, the three fields and the five values (`protocol/skp/SKP-V0.md:488-491`).
  - ADR-021's Note item 6 fixes the same three things (`docs/adr/ADR-021-row-filter-on-viewport-query.md:267`). Items 1 and 2 define the class (`:248-263`).
- **What follows.** A change that moves an engine outcome into line with the Note's class changes no contract another module consumes. It fixes the engine's conformance to a contract that already exists.
- **The consumers do not encode the four shapes.**
  - `filter_error_of` takes `reason` from `wire_value` (`kernel/src/skp.rs:2253-2266`).
  - The shell's guidance switches on the code alone (`frontends/shell/src/admission/formatRefusal.ts:70-71`).
  - The three fixtures that name a reason all pin one shape, `VARCHAR; INTEGER literal` with `text_with_non_text`, and none of the four NULL shapes: `kernel/src/skp.rs:2846`, `protocol/skp/tests/data/v0-error-filter_type_not_admitted.json:7` and `frontends/shell/src/skp/__tests__/fixtures.test.ts:470`.
- **The condition.**
  - The piece is confined for (a), (c) and (d).
  - It is confined for (b) only if O-1 rules (i) or (ii).
  - O-1 (iii) changes how the Note's admitted class is read. That class is the text §7.6 consumes by reference, so (iii) makes the piece crossing.
  - O-1 (iv) changes the five-value set in §7.5 and in Note item 6, and it touches kernel, protocol and shell fixtures, so it is crossing too.
  - Under (iii) or (iv), the architect drafts it under C2.
- **Defect, bearing on Q2.** Draft §0 F6 and section 2 both say no file under `kernel/`, `protocol/` or `frontends/` names a reason value. That is false: the three fixture lines above each name `text_with_non_text`. The conclusion still holds, because those fixtures pin a shape this piece does not move, but the grep claim must be corrected.

## Q3: (a) and (d) are conformance to the Note as written

- **(a) `NULL + NULL > 0`**
  - Item 2 admits a NULL literal against anything, and applies the same rules inside `+`, `-` and `*` (`docs/adr/ADR-021-row-filter-on-viewport-query.md:255`, `:263`).
  - At the comparison, admitting a NULL-typed expression uses the reading main already ships for C32's `-NULL > 0` (`engine/tests/filter_type_admission.rs:323`): comparison rule 2 tests the type, not the kind (`engine/src/predicate.rs:2081-2084`).
  - The refusal at 79bc76d2 is the non-conformance. Its `conversion_rounds` sentence (`engine/src/predicate.rs:1420`) names a value read from the file, and the predicate has none.
  - My reduction-1 gate already ruled (a) a code defect (`state/consults/gates/2026-09-30-b-1-code-reduction1-architect.md:16`).
- **(d) `i64 = (NULL + <39-digit literal>)`**
  - The junction pair is a BIGINT column against a UHUGEINT expression. The reviewer observed the plan cast the constant UHUGEINT to HUGEINT (`state/consults/gates/2026-09-30-b-1-code-gate2-reviewer.md:83`).
  - Item 2 admits integer against integer only as a lossless widening (`docs/adr/ADR-021-row-filter-on-viewport-query.md:256`). UHUGEINT to HUGEINT is not lossless.
  - Rule 3 equals item 2 only while the bounds hold (`engine/src/predicate.rs:2110-2113`). The lost flag is what lets rule 3 admit outside item 2.
  - Item 1's bounds bullet names the literal (`:251`).
  - Item 2's NULL bullet governs the `+` pair, not the junction. Under the walk's own typing, rule 2 gives the result the other operand's type (`engine/src/predicate.rs:2000-2005`).
  - My earlier word that (d) was consistent with the letter (reduction-1 gate `:18`) was about the predecessor form's §2.2, not the Note. The same gate proposed this node to carry the flag (`:20-21`).
  - Nothing here alters a guarantee, so the human need not rule.
- **Defect, bearing on Q3.**
  - Draft §2.2 says the refusal falls on a junction that needs the out-of-bounds literal converted. The plan converts the UHUGEINT-typed constant, not the literal (gate2 `:83`).
  - The form should rest (d) on item 2's lossless-widening bullet together with item 1's bounds bullet.
  - It should also state its reading of the order between items 1 and 2, which the Note leaves unstated. The direct pairs `NULL = <oob literal>` and `NULL + <oob literal>` stay admitted: comparison rule 2 runs before any bounds check (`engine/src/predicate.rs:2247-2253`), and arithmetic rule 2's `is_numeric` ignores the flag (`:1539-1545`).
  - That is the predecessor's merged reading. This node does not change it, and it should not be argued here.

## O-1 (the human's to rule): case (b), `NULL - 0.5 > 0`

The facts that decide it:
- The predicate has no column.
- The walk types `NULL - 0.5` as a DECIMAL(2,1) expression (rule 2), and the junction compares it with the INTEGER literal 0.
- The value is a constant NULL. The literal 0 fits the decimal, and nothing is evaluated per row that could round or fail.

| Option | Is the sentence true of (b)? | What ruling it needs |
|---|---|---|
| (i) keep `conversion_rounds` | **False.** Its sentence (`engine/src/predicate.rs:1420`) is about a value read from the file, and there is none. | The human accepts a Display known to be false for this shape. That waives the predecessor's reason-sentence invalidator (`engine/FILTER-BIND-COERCIONS-PREREGISTRATION.md:376`), and it should be recorded as a known limitation. Against it: the round 5, item 1 ruling on a false status string on main is analogous, though not binding here. |
| (ii) `conversion_can_fail`, as drafted | **False.** Its sentence (`:1418`) is about a conversion that can fail during the scan, and nothing in (b) can. | The same waiver as (i). (ii) also reaches further than (i), as set out in the three points after this table. |
| (iii) admit (b) | No sentence is needed, so nothing false is said. | A reading of item 2 that a NULL-valued result of rule 2 counts as a NULL literal at the junction. The walk already reads NULL-typed expressions this way (C32, and the draft's (a)). It is a reading of human-accepted ADR text, so it goes to the human, and under C2 it makes the piece crossing. The node's title changes, so PLAN needs amending. |
| (iv) a sixth reason | It can be written to be true. | A new T-C sentence typed by the human, a new wire value, changes to Note item 6 and the §7.5 note, a literal bump and the fixtures. Crossing, drafted by the architect. The node excludes it, and it is the heaviest option. |

**Why (ii) is worse than (i).**
- By the draft's own §2.3, the only DECIMAL expressions that reach the new clause are constant-NULL results of rule 2 and their negation. So the clause's sentence is false wherever it fires, unless the partner is a file-derived integer wide enough that its decimal conversion can overflow. That case already has its own clause (`engine/src/predicate.rs:2203-2211`), and whether DuckDB v1.5.5 folds it before the scan is unobserved.
- The draft's basis, precedence item 4's first clause and the doc at `:1387-1389`, is the form's classification label. The Display sentence is the human's T-C text (`state/directives/B-1-RULINGS-AND-TYPED-TEXTS-2026-09-30.md:56`). Satisfying the label does not make the sentence true.
- Fable's O-3 reasoning (`state/directives/B-1-RULINGS-AND-TYPED-TEXTS-2026-09-30.md:9`) refuses a sentence about failing for a case that cannot fail. That reasoning rules (ii) out directly.

**A fifth option the brief did not list.** The human retypes the residual sentence in T-C so that it is true of every residual case. O-4 made wording wire-free (`state/directives/B-1-RULINGS-AND-TYPED-TEXTS-2026-09-30.md:10`). This needs the human's typed text and an amendment to the node's no-string-change line, and it weakens the sentence for every residual refusal.

**Recommendation: (iii), scoped narrowly.**
- Treat a rule-2 result over a decimal literal that is within the bounds as that literal for comparison rules 4 and 6.
- Then (b) is admitted under item 2's third bullet (`docs/adr/ADR-021-row-filter-on-viewport-query.md:257`).
- A wide-integer partner still refuses under the existing first clause.
- It needs no sentence and no wire change.
- Do not retype rule-2 results as NULL. That would let NULL-with-numeric expressions pass comparison rule 2 against VARCHAR and BOOLEAN.
- If the human declines to widen admission, (iv) is the honest fallback. (i) and (ii) both put a known-false engine message on main.
- Meanwhile (a), (c) and (d) need no ruling. The draft's OPEN marker already holds only §2.3's code.

**Precedent for who rules: yes.**
- The predecessor's OPEN items, O-3 among them, waited for Fable's ruling, relayed by the human (`engine/FILTER-BIND-COERCIONS-PREREGISTRATION.md:6`).
- Fable ruled O-3 (`state/directives/B-1-RULINGS-AND-TYPED-TEXTS-2026-09-30.md:9`). Fable also confirmed the bound-only rows' reasons afterwards, with no sighting (Amendments 2 and 3, `engine/FILTER-BIND-COERCIONS-PREREGISTRATION.md:368`, `:372`).
- The text that resulted went to the human's typed acceptance (`state/directives/B-1-RULINGS-AND-TYPED-TEXTS-2026-09-30.md:3`).
- So: choosing among existing outcomes, or a reading of item 2 ((i), (ii), (iii)), follows the O-3 route, Fable relayed by the human. New or changed typed text ((iv), or the fifth option) needs the human's typed acceptance, as T-C did.

**Case (c) does not raise the same question.**
- The `literal_out_of_bounds` sentence (`engine/src/predicate.rs:1416`) is true of (c). The predicate carries a scale-27 literal, beyond the scale-18 bound, and the binding needs it to type the `+` node.
- That reason is precedence item 3 (`engine/FILTER-BIND-COERCIONS-PREREGISTRATION.md:346`). It outranks `conversion_rounds` whichever sentence would otherwise apply.
- (c) is C2's predicate (`:374`) with `NULL +` inserted. Fable has already confirmed that rows refused only by a bound take this reason (`:368`). No new ruling is needed.

Files:
- `C:/dev/spatial-ide/state/consults/2026-10-03-type-walk-null-literal-arithmetic-lead-data-draft.md`
- `C:/dev/spatial-ide/engine/src/predicate.rs`
- `C:/dev/spatial-ide/engine/FILTER-BIND-COERCIONS-PREREGISTRATION.md`
- `C:/dev/spatial-ide/state/directives/B-1-RULINGS-AND-TYPED-TEXTS-2026-09-30.md`
- `C:/dev/spatial-ide/docs/adr/ADR-021-row-filter-on-viewport-query.md`
- `C:/dev/spatial-ide/protocol/skp/SKP-V0.md`
- `C:/dev/spatial-ide/state/directives/2026-10-03-lead-data-pilot-clarification.md`
