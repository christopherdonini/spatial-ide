*Custodian's filing note (2026-10-03): lead-data's draft for node 10 (`type-walk-null-literal-arithmetic`), the pilot's measured piece 2, dispatched as the `lead-data` agent type on the custodian's brief under the 2026-10-03 lead-data clarification (C1 to C4). Written by the agent to this path itself and committed as written below the rule. The hash of record of the draft as written, from this file's line 5 to the end, is e22f787ebecb24d3b2779f1319076992d0715b872d624c7a135cc8905e3bd4f2, computed by the custodian. Write audit PASS: one Write, to this path (the tracked script, given the absolute report path). C3 clean: before 18:23:08Z and after 18:32:28Z, the only new file in the custodian checkout is this report, and the refs are unchanged. The draft is not yet a form: its questions go to an architect consult (questions 2 and 3, and the options for O-1) and then to the human (O-1).*

---

# lead-data draft — type-walk-null-literal-arithmetic (node 10) at 79bc76d2

*Drafted by lead-data on the custodian's brief, read-only, against main at 79bc76d2. lead-data ran no command, so every hash below is `HASH-TBD` for the custodian to compute. Under the 2026-10-03 lead-data clarification C3, this report returns "sha256: not computed". Nothing in this report is a quotation: every restatement is a paraphrase, and every reference is by `path:line` or by section.*

## 1. The draft

**Form: the full form (§0 to §10, §10 opening empty).** Three reasons:
- **§21b's category test fails.** The single gate and the five-line form are allowed only for docs, tests and polish (`AUTONOMY.md:334-343 @ 79bc76d2 sha256:HASH-TBD`). This piece changes product behaviour in the type walk, so it is none of the three.
- **A truthful Out-of-scope line could not assert that no §21a category is touched.**
  - The admitted and refused classes are a stated guarantee: ADR-021's Note 2026-09-30, items 1 and 2 (`docs/adr/ADR-021-row-filter-on-viewport-query.md:248-263 @ 79bc76d2 sha256:HASH-TBD`).
  - The piece changes the outcome under that guarantee for four predicate shapes.
  - Two of those outcomes reach a client as a different `reason` value, or as an admission instead of a refusal.
  - By §25(e) (`AUTONOMY.md:482 @ 79bc76d2 sha256:HASH-TBD`), a piece whose Out-of-scope line would name a category takes the full form from dispatch.
- **§21c fails on its own.** The bound includes "no new user-visible behaviour" (`AUTONOMY.md:349-355 @ 79bc76d2 sha256:HASH-TBD`). An admission flipping to a refusal, and the reverse, are user-visible.

The size alone (an estimated 80 to 140 lines) would fit §21c's line bound. It does not decide the form.

*An observation, not a decision:* §21a's security bullet labels ADR-021 as "bundling / no-runtime-fetch", but `docs/adr/ADR-021-row-filter-on-viewport-query.md` is the row-filter ADR. The full-form conclusion above does not depend on how that label is read.

**Proposed path:** `engine/TYPE-WALK-NULL-LITERAL-ARITHMETIC-PREREGISTRATION.md`. It sits beside its predecessor `engine/FILTER-BIND-COERCIONS-PREREGISTRATION.md` and follows the module's naming in the owner's index (`engine/README.md:518`).

```markdown
# Type walk: NULL-literal arithmetic -- admit NULL with NULL, carry a literal's bound flag through a NULL-typed result, and give constant-NULL expressions true refusal reasons -- preregistration (B-1 N1)

## Header

- **Status.** This is the preregistration of PLAN node `type-walk-null-literal-arithmetic` (`PLAN.yaml:3313-3329 @ 79bc76d2 sha256:HASH-TBD`). It becomes the node's gate when committed. It is committed before any code, and it is append-only once committed. An amendment written after any outcome has been seen says so in its first line and names what it touches or invalidates.
- **OPEN marker.** O-1 (§2.3) marks the reason for case (b). No code that touches §2.3 begins until the custodian relays a ruling on O-1. The code of §2.1 and §2.2 does not depend on O-1.
- **Authority:**
  - the node's placement: question round 31, item 1 (RULED 2026-09-30), position 10 of 16 in the human's order;
  - the architect's scoped confirmation on PR #145, item 3, which proposes this node and rules N1's four cases non-blocking for B-1 (`state/consults/gates/2026-09-30-b-1-code-reduction1-architect.md:14-22 @ 79bc76d2 sha256:HASH-TBD`);
  - the reviewer's gate-attempt-3 N1, cases (a) to (d) (`state/consults/gates/2026-09-30-b-1-code-gate2-reviewer.md:79-83 @ 79bc76d2 sha256:HASH-TBD`);
  - the record cap (`state/directives/2026-09-18-record-cap.md`).
- **What it continues.** `engine/FILTER-BIND-COERCIONS-PREREGISTRATION.md` (the predecessor), which names this node as its follow-up (`engine/FILTER-BIND-COERCIONS-PREREGISTRATION.md:447 @ 79bc76d2 sha256:HASH-TBD`). The predecessor's rules apply unchanged except where §2 below states otherwise: §2.3 rule 2, §2.5(a), the five-reason precedence of its Amendment 1, and its §7 bounds.
- **Drafted by** lead-data on the custodian's brief, read-only, against main at 79bc76d2. lead-data ran no command.
- **Reference form.**
  - Code is cited by symbol, with a pin `path:line @ 79bc76d2 sha256:<hex>` where a line is needed.
  - Rulings are cited by round and item.
  - A self-reference is by section only.
  - Every restatement of a source is a paraphrase, and nothing here is marked verbatim.
- **Branch.** `cut/type-walk-null-literal-arithmetic`, cut from main after this form lands.

## §0. Disclosure

- **Evidence, not Authority.** The reviewer's probe of N1 at 53c6e3e (DuckDB v1.5.5), reported in the gate report pinned above. This form measures nothing, and the 5 GB fixture is not read. Every statement below about DuckDB's behaviour is an observation, or a labelled hypothesis, at v1.5.5. The pin `duckdb = 1.10505.0` is at `engine/Cargo.toml:39 @ 79bc76d2 sha256:HASH-TBD`.
- **Code read at 79bc76d2:**
  - `engine/src/predicate.rs`:
    - `Typed`, `Typed::expression`, `literal_typed` (the NULL arm), `is_numeric`, `int_bits_signed`;
    - `type_of_value`, `type_of_arithmetic`, `type_of_division`, `admitted_arithmetic_result`, `is_decimal_arithmetic_pair`, `is_admitted_comparison`, `determine_reason`;
    - `check_pair`, `check_comparison`, `check_between`, `check_in`, `check_boolean_operand`, `require_boolean_or_null`;
    - `TypeRefusalReason`'s `wire_value` and `sentence`;
    - B-T1b (`the_walk_types_every_arithmetic_node_as_the_binder_does`) and its case builder.
  - `engine/tests/filter_type_admission.rs`: B-T3's `corpus` and its test, and B-T1's part 3 (`boundary_literal_cases`) and its count assertions.
  - `kernel/src/skp.rs`'s `filter_error_of` arm, where `reason` comes from `TypeRefusalReason::wire_value` (`kernel/src/skp.rs:2279 @ 79bc76d2 sha256:HASH-TBD`).
  - `frontends/shell/src/admission/formatRefusal.ts`, which switches on the code alone (`frontends/shell/src/admission/formatRefusal.ts:70-71 @ 79bc76d2 sha256:HASH-TBD`).
- **Documents read:**
  - ADR-021's Note 2026-09-30, items 1 to 6;
  - SKP-V0 §7.5's and §7.6's dated notes, and the `skp/0.8` entry in §8;
  - the predecessor in full;
  - `AUTONOMY.md` §21a to §21d and §25;
  - `state/directives/PORTABILITY-2026-09-30.md` §2.
- **Findings from reading the code at 79bc76d2:**
  - **F1, case (a).** In `admitted_arithmetic_result` (`engine/src/predicate.rs:1996-2005 @ 79bc76d2 sha256:HASH-TBD`), rule 2 admits a NULL literal only beside an operand that `is_numeric` accepts. `is_numeric` rejects NULL (`engine/src/predicate.rs:1539-1545 @ 79bc76d2 sha256:HASH-TBD`), so `NULL + NULL` falls through to `determine_reason`'s residual, `conversion_rounds`.
  - **F2, the bound flag.**
    - `type_of_arithmetic`'s binary arm builds its result with `Typed::expression`, which sets `within_bounds: true` unconditionally (`engine/src/predicate.rs:1505-1512 @ 79bc76d2 sha256:HASH-TBD`, `engine/src/predicate.rs:1947-1960 @ 79bc76d2 sha256:HASH-TBD`).
    - So rule 2's result beside an out-of-bounds literal is marked within bounds, and the bound flag is lost.
    - The unary arm already carries its operand's flag through its struct update (`engine/src/predicate.rs:1932-1939 @ 79bc76d2 sha256:HASH-TBD`).
  - **F3, the other admitting rules.** Every other admitting rule (1, 3, 5, 6 and 7) admits a pair only when both operands are within bounds. Each rule requires the flag, or admits only non-literals and double literals, which `literal_typed` marks within bounds (`engine/src/predicate.rs:1966-2062 @ 79bc76d2 sha256:HASH-TBD`). This is from reading. §5 states its discriminator.
  - **F4, cases (b) and (c).** Both reach a comparison as a DECIMAL-typed expression, which rule 4 does not admit (it names only a decimal literal). `determine_reason` finds none of its named clauses and returns `conversion_rounds` (`engine/src/predicate.rs:2180-2216 @ 79bc76d2 sha256:HASH-TBD`).
  - **F5, the B-T1b skip.** B-T1b skips a node that the plan has constant-folded away, which it names as a NULL-involving node (`engine/src/predicate.rs:3185-3189 @ 79bc76d2 sha256:HASH-TBD`). So the walk's type for a NULL-with-NULL result is not observable through B-T1b.
  - **F6, no consumer outside the engine.**
    - The kernel maps `reason` through `wire_value`, and the shell renders a refusal by its code.
    - No file under `frontends/`, `protocol/`, `kernel/` or `renderer/` names one of the five reason values or a NULL-arithmetic predicate. A grep at 79bc76d2 found one hit, a comment in `kernel/tests/manual_walkthrough_fixtures.rs` about a NULL zone value, which is unrelated.
    - The campaign generator (`engine/tests/admission_property_campaign.rs`) uses NULL only in `IS [NOT] NULL` forms.

## §1. What this preregistration may and may not claim

- **May claim, once §4 is green:** at DuckDB v1.5.5, the four constant-NULL shapes of §3 take the outcomes §3 predicts. An admitted shape carries only §7's declared casts, and its stream ends without error (B-T1, the C39 pin). No other admission outcome changes.
- **May not claim:**
  - any performance figure or docs/08 row;
  - any wire change: no code, field, reason value or literal changes;
  - any wording: no string changes, and the reason sentences and Display stay the human's;
  - any change to `/`, whose bounds stay unapplied (the predecessor's Amendment 1, §2.5(c));
  - anything about integer overflow, which belongs to node `stream-evaluation-failure-fixed-detail`;
  - that the outcomes hold at another DuckDB version without B-T1 and B-T3 green there.
- **ADRs cited:**
  - ADR-021's Note 2026-09-30, items 1 and 2. Item 2 admits a NULL literal against anything, and the same rules apply inside `+`, `-` and `*`. Item 1 refuses a numeric literal beyond the declared bounds.
  - ADR-010 rule 6, under which the bounds constants are unchanged.
  - No ADR is amended.

## §2. The change, stated before it is applied (engine only)

**2.1 Rule 2 in `+`, `-`, `*` (`admitted_arithmetic_result`).**
- A NULL literal with a NULL literal is admitted.
- The walk types the result as NULL, kind expression. This is the walk's own rule and makes no claim about the plan (F5). It matches what unary `-` on a NULL literal already gives at 79bc76d2.
- A comparison-shaped junction then admits the result by comparison rule 2. `is_admitted_comparison` tests the type, not the kind (`engine/src/predicate.rs:2081-2084 @ 79bc76d2 sha256:HASH-TBD`). This is the path C32's `-NULL > 0` already takes.
- NULL beside a numeric operand is unchanged, and so is NULL beside VARCHAR or BOOLEAN (still refused under the predecessor's §2.5(a)).

**2.2 The bound flag.**
- A `+`, `-` or `*` result is within bounds exactly when both of its operands are. The flag is set in `type_of_arithmetic`'s binary arm, from the two operands' flags.
- By F3, this binds only rule 2's results. Unary `-` already carries the flag, and `/` is unchanged.
- **Consequence.** A junction that meets such a result refuses `literal_out_of_bounds`, by the existing precedence item 3 (`determine_reason`'s bounds check). Comparison rules 3, 4 and 6 already require the flag.
- The `+` node itself stays admitted, since ADR-021's Note item 2 admits a NULL literal against anything. The refusal falls on the junction whose binding needs the out-of-bounds literal converted, which is item 1's bounds bullet.

**2.3 The reason for a DECIMAL-typed expression at a comparison-shaped junction (O-1).**
- `determine_reason` gains one clause, after the bounds item and beside the existing item-4 clauses: a DECIMAL-typed expression beside an integer or a DECIMAL refuses `conversion_can_fail`.
- The basis is the predecessor's Amendment 1, §2.6 precedence item 4, first clause: a DECIMAL conversion wider than rule 4 admits. Rule 4 admits only a decimal literal (`engine/FILTER-BIND-COERCIONS-PREREGISTRATION.md:343-348 @ 79bc76d2 sha256:HASH-TBD`). `TypeRefusalReason::ConversionCanFail`'s doc states the same clause (`engine/src/predicate.rs:1387-1389 @ 79bc76d2 sha256:HASH-TBD`).
- A DECIMAL-typed expression beside a float keeps the residual reason, unchanged by this piece.
- **Reachable DECIMAL-typed expressions** at 79bc76d2, from reading: rule 2's NULL beside a decimal literal, and unary `-` over such a result. O-5 refuses every other decimal arithmetic upstream.
  - **Hypothesis H-1:** a negative decimal literal is a `CONSTANT`, because the parser folds the sign, so the new clause never meets it. Discriminator: C43.
- **O-1, open.** The Display sentence for `conversion_can_fail` (`engine/src/predicate.rs:1418 @ 79bc76d2 sha256:HASH-TBD`) speaks of a conversion that can fail during the scan. Whether that is true for a constant-NULL DECIMAL expression is not this form's to decide.
  - If it is ruled true, §2.3 and C40 stand.
  - If it is ruled false, no five-reason sentence states case (b) truly, and §5's O-1 invalidator applies. The alternatives are admitting (b), which the node's title does not place, or a sixth reason, which the node excludes. Either would be an amendment on the ruling.

**2.4 Unchanged in this module:**
- the comparison rules;
- the `IS [NOT] NULL` arm;
- `/`;
- the reason set, its wire values and its sentences;
- `FilterError` and its variants;
- the bounds constants;
- the parse;
- the stage order.
No `pub` item is added.

**2.5 Kernel, protocol and frontends: no change.**
- `filter_error_of` is unchanged.
- There is no literal bump and no fixture change.
- FX-4 is unchanged (its predicate is `zone = 1`).

**2.6 Portability.** The type walk is pure logic: no OS mechanism, no `cfg`, no path. R3's Portability item does not apply (`docs/PREREGISTRATION-TEMPLATE.md:177 @ 79bc76d2 sha256:HASH-TBD`). R1, R4 and R6 bind as §8 items 9 and 10.

## §3. Fixtures and corpus, with pre-declared outcomes

- FX-1 is unchanged. B-T3 checks its hash at the end of the run, as today.
- **New corpus rows**, appended to B-T3's `corpus`. TNA means `TypeNotAdmitted`.

| # | Predicate | Predicted |
|---|---|---|
| C39 | `NULL + NULL > 0` | admitted (case (a)) |
| C40 | `NULL - 0.5 > 0` | TNA `>`, `DECIMAL(2,1) expression; INTEGER literal`, `conversion_can_fail` (case (b); O-1) |
| C41 | `i64 < NULL + 0.000000000000000000000000001` | TNA `<`, `literal_out_of_bounds`; operand types not asserted (the literal's width at v1.5.5 is not read here) (case (c)) |
| C42 | `i64 = (NULL + 170141183460469231731687303715884105728)` | TNA `=`, `BIGINT; UHUGEINT expression`, `literal_out_of_bounds` (case (d)) |
| C43 | `i64 < -0.5` | admitted (control, H-1) |

- **B-T1 pin:** C39's predicate is appended to B-T1's part 3, as C32's second case was. Part 3's count goes from 323 to 324, and the total from 9,705 to 9,706.

## §4. Tests, and the mutation per changed test

Each mutation is observed by applying it, running the named test, recording the test's failure by name with the commit it was observed at, and reverting it. A `verify-mutation` run is never recorded as an observation. No new test function is added.

- **B-T3 (changed)**, `each_corpus_row_is_admitted_or_refused_with_its_code_reason_and_operand_types`, in `engine/tests/filter_type_admission.rs`.
  - It gains rows C39 to C43.
  - Its doc comment names this form for those rows.
  - Its existing mutation stands: `MAX_INTEGER_LITERAL_DIGITS` = 21 fails on C14.
  - Mutations for the new rows:
    - M1: §2.1's NULL-with-NULL arm removed. Fails by name on C39 (expected admitted, got refused).
    - M2: §2.2's result flag forced to `true` (the 79bc76d2 behaviour). Fails by name on C42 (expected TypeNotAdmitted, got Ok).
    - M3: §2.3's clause removed. Fails by name on C40's reason.
- **B-T1 (changed)**, `the_type_walk_agrees_with_the_binder_over_the_p0_matrix`.
  - Part 3 gains the C39 pin, and the part-3 and total count assertions are updated as §3 states.
  - Its two existing mutations stand.
  - No new mutation is claimed for the pin, which checks (i) and (iii) on an admitted case.
- **B-T1b: unchanged.** It still has 2,083 cases.

## §5. Predictions · declared unchanged · invalidators · falsification

**Predictions** (a wrong one is a result, class 2):
- P-1: §3 as tabled.
- P-2: B-T1 (i) and (iii) hold for the C39 pin.
- P-3 (hypothesis, F3's discriminator): B-T1's printed admitted and refused tallies at the head equal those at the merge base, plus one admitted for the pin. B-T1b's printed checked count is equal at both. The worker records both runs.
- P-4 (H-1): C43 is admitted.

**Declared unchanged:**
- every existing B-T3 row (C1 to C38), with its code, reason, construct and operand types;
- every B-T1 and B-T1b assertion, except part 3's count and the total;
- B-T2, B-T4, B-T5, B-T6, B-T7, B-T8, B-T9 and B-T10;
- the five reasons, their wire values and their sentences;
- every Display;
- `kernel/`, `protocol/`, `frontends/`, ADR-021, SKP-V0 and FX-4;
- `/`'s typing, and the `IS [NOT] NULL` arm.

**Invalidators** (stop, and return to the custodian):
- O-1 is ruled false for case (b);
- a declared-unchanged item moves;
- P-3 fails, because the flag change reaches a case outside §3;
- a sixth reason, a wire change, a new `pub` item, or a kernel or shell change is needed.

**Falsification:** at v1.5.5, C39 is admitted but its stream ends in error, or its plan carries a cast outside the predecessor's §7 set.

## §6. Instruments

All are assertions: typed outcomes, plan casts, key sets and hashes. There is no measurement.

## §7. Declared values and ceilings

- **Unchanged:** `MAX_INTEGER_LITERAL_DIGITS` = 20 and `MAX_DECIMAL_LITERAL_SCALE` = 18 (private, `engine/src/predicate.rs`); the five-value reason set.
- **Budget** (a class-8 overrun is recorded against these lines):
  - at most 150 insertions plus deletions, over at most 2 files of non-generated code and tests (`engine/src/predicate.rs`, `engine/tests/filter_type_admission.rs`);
  - counted by `git diff --numstat origin/main...HEAD`, excluding this form, `*.md`, `state/**`, `PLAN.yaml`, `CUSTODIAN-QUEUE.*`, `site/**` and lockfiles.

## §8. Block-on-sight

1. Code before this form is on main, or code of §2.3 before O-1 is ruled.
2. A new `TypeRefusalReason` variant, a changed wire value, or a changed sentence or Display string.
3. Any diff under `kernel/`, `protocol/` or `frontends/`, or to ADR-021 or SKP-V0.
4. An existing B-T3 row's prediction edited, or a B-T1 or B-T1b assertion weakened (part 3's count and the total aside).
5. An arithmetic pair admitted outside the predecessor's §2.5(a) as changed by §2.1, for example NULL with VARCHAR or BOOLEAN.
6. The result flag set other than from both operands' flags, or bounds applied to `/`.
7. A file value in any field or Display.
8. A new `pub` item.
9. A new `cfg(windows)`, `cfg(unix)` or `cfg(target_os ...)`, or a Windows assumption in the walk (R1, R2, R4).
10. A new platform ignore (R6).
11. A mutation recorded as observed without its run, or a `verify-mutation` run called an observation.
12. A DuckDB behaviour stated without its version.
13. A discharge claim without a resolvable proof.
14. Any performance claim.
15. The owner's-index update, which lead-data writes when the implementation is ready (the 2026-10-03 lead-data clarification, C1), absent from the implementation PR, or not matching its diff.

## §9. Gates

Full gating (`AUTONOMY.md` §21a, the stated guarantee of ADR-021's Note; this draft's §1 gives the form's reasons).

- **Architect:**
  - §8 item by item;
  - ADR-021's Note items 1 and 2 against §2.1 to §2.3;
  - docs/01 principle 8, as the predecessor's §9 cites it;
  - ADR-010 rule 6;
  - O-1's ruling recorded before any §2.3 code.
- **Reviewer:**
  - the full diff, three-dot;
  - `git diff --stat origin/main...HEAD -- kernel/ protocol/ frontends/` shown empty;
  - M1 to M3 each observed by name at a commit, then reverted;
  - P-3's two runs;
  - the owner's-index update against the diff.
- **Suites:** every CI job on the PR green, including `cargo test --workspace` in each matrix job, `node --test` over `scripts/`, and the `scripts/plan` verifiers. The pre-gate self-checks (§6a) run first. No portability level beyond what KNOWN-LIMITATIONS 1 already states is claimed (R5).
- **Operator:** none. No string is added or changed.
- **Record:** the gate reports are the observation of record. A closing amendment is references and hashes only (the record cap).

## §10. Amendments — opens empty, append-only
```

## 2. C2: confined to engine/ and kernel/ by contract

**Reading: confined.** The paths are `engine/src/predicate.rs` and `engine/tests/filter_type_admission.rs`, plus `engine/README.md`'s index under C1. Nothing another module consumes changes:
- **SKP refusal.** The code `skp.filter_type_not_admitted`, its three fields and its five-value `reason` set are unchanged (`protocol/skp/SKP-V0.md:488-491 @ 79bc76d2 sha256:HASH-TBD`, `protocol/skp/SKP-V0.md:957-959 @ 79bc76d2 sha256:HASH-TBD`).
  - There is no literal bump.
  - `filter_error_of` takes `reason` from `wire_value` (`kernel/src/skp.rs:2279 @ 79bc76d2 sha256:HASH-TBD`) and is untouched.
  - FX-4 is untouched.
- **The reason strings the human typed.** No string changes. Cases (b) and (c) move from one existing sentence to another; that is O-1 for (b), and question 1 below.
- **Describe fields.** None is involved.
- **Client consumers.** The shell renders by code (`frontends/shell/src/admission/formatRefusal.ts:70-71 @ 79bc76d2 sha256:HASH-TBD`). No file under `frontends/`, `protocol/`, `kernel/` or `renderer/` names a reason value or a NULL-arithmetic predicate (grep at 79bc76d2).

**What a client can observe.** A client sending one of the four constant-NULL shapes sees a different outcome:
- (a) is admitted, with an empty stream;
- (b) moves to `conversion_can_fail`;
- (c) moves to `literal_out_of_bounds`;
- (d) is refused `literal_out_of_bounds` instead of admitted with an empty stream.

These outcomes sit inside the code, fields and values SKP-V0 §7.6's dated note already delegates to the engine's admitted class (`protocol/skp/SKP-V0.md:512-516 @ 79bc76d2 sha256:HASH-TBD`). Under ADR-021's Note item 2, (a) and (d) bring the engine into line with the stated class rather than altering it. I read this as confined. Because C2 lists "SKP behaviour" without saying whether per-predicate outcomes count, question 2 asks the custodian to confirm.

**Impact pointers, for the record:**
- engine interface "Filter admission" (`engine/README.md:504`), whose pins are unchanged;
- kernel "Wire error codes" (`kernel/README.md:358`), unchanged;
- ADR-021's Note 2026-09-30;
- the predecessor form;
- no KNOWN-LIMITATIONS item. The index lists 2, 3, 9, 11 and 19 to 27 for the engine (`engine/README.md:521`); none was re-read, and the piece declares no new limitation.

## 3. C1: owner's-index lines this piece will change

- `engine/README.md:499`: "Last verified at", moved to the implementation's commit.
- `engine/README.md:518`: "preregistrations in this module", which gains `engine/TYPE-WALK-NULL-LITERAL-ARITHMETIC-PREREGISTRATION.md`.
- No interface, pin, ceiling or limitation line changes. B-T3's name, the pin at `engine/README.md:504`, is unchanged.
- `kernel/README.md`: none. The piece has no kernel half, so line 375's "kernel halves" list does not gain it.

The update text comes when the implementation is ready (C1).

## 4. Measurement (C4)

**Files read**, by range:
1. `state/directives/2026-10-03-lead-data-pilot-clarification.md`, whole.
2. `.claude/agents/lead-data.md`, whole.
3. `engine/README.md:495-528` (the owner's index), plus a grep for its heading.
4. `kernel/README.md:346-383` (the owner's index), plus a grep for its heading.
5. `PLAN.yaml:3300-3344`.
6. `state/consults/gates/2026-09-30-b-1-code-reduction1-architect.md`, whole.
7. `state/consults/gates/2026-09-30-b-1-code-gate2-reviewer.md`, whole.
8. `engine/FILTER-BIND-COERCIONS-PREREGISTRATION.md`, whole.
9. `docs/PREREGISTRATION-TEMPLATE.md`, whole.
10. `.claude/agents/architect.md`, whole.
11. `AUTONOMY.md:306-377` and `:476-528`, plus a heading grep.
12. `state/directives/PORTABILITY-2026-09-30.md`, whole (path per the coordinator's mid-task correction).
13. `engine/src/predicate.rs:1370-1613`, `:1680-2479` and `:2900-3220`, plus one symbol grep.
14. `engine/tests/filter_type_admission.rs:1-499` and `:920-1177`, plus two greps.
15. `protocol/skp/SKP-V0.md:480-519` and `:950-969`, plus a grep.
16. `docs/adr/ADR-021-row-filter-on-viewport-query.md:244-268`, plus a grep.
17. `frontends/shell/src/admission/formatRefusal.ts:55-124`, plus a grep over `frontends/shell/src/admission/`.

**Greps only:**
- `kernel/src/skp.rs`, for `TypeNotAdmitted` and `wire_value`;
- `engine/tests/admission_property_campaign.rs`, for `NULL`;
- `engine/Cargo.toml`, for `duckdb`;
- one grep over `frontends/`, `protocol/`, `kernel/` and `renderer/` for the reason values and NULL-arithmetic predicates.

**Cited from the index instead of re-read:**
- the engine's interface list and its pins;
- the engine's preregistration list;
- the engine's and kernel's KNOWN-LIMITATIONS numbers;
- the engine's "consumed from other modules: none";
- the ceilings list;
- the kernel's wire-error-code and consumed-module pointers.

C2 still required reading `kernel/src/skp.rs`'s mapping and the shell's `formatRefusal`, so those were checked, not taken from the index.

**Not read:**
- docs/01, cited only as the predecessor's §9 cites it;
- `DECISIONS-PENDING.md` (round 31 item 1, cited from the PLAN node's summary);
- `state/directives/B-1-RULINGS-AND-TYPED-TEXTS-2026-09-30.md` (the sentences were read at `engine/src/predicate.rs:1411-1423`, whose comment says they are byte-copied from it);
- `KNOWN-LIMITATIONS.md`.

**Usage:** tokens and wall time are not observable by lead-data and are recorded as unknown.

## 5. Questions for the custodian

1. **Blocking, for row C40 and §2.3 only.** Is the `conversion_can_fail` sentence (`engine/src/predicate.rs:1418 @ 79bc76d2 sha256:HASH-TBD`, a reason string the human typed) true for case (b), a constant-NULL DECIMAL expression? If not, (b) needs admission, which the node does not place, or a sixth reason, which the node excludes. Either is not lead-data's to decide.
2. **Non-blocking.** Confirm that four predicate shapes changing outcome inside an unchanged code, field and reason set are confined by C2's contract test, not "SKP behaviour" that crosses (section 2's reading).
3. **Non-blocking.** Confirm that (a)'s admission and (d)'s refusal are conformance to ADR-021's Note item 2 and item 1 as written, not an altered guarantee.
