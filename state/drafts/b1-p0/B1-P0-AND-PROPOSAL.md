# B-1 — bind admission and implicit coercions: the P0 table and the proposal (draft, for Fable's sighting)

- **Node:** `filter-bind-admission-implicit-coercions` (wave-2 B-1, S1).
- **Authority:** the 2026-09-28 S1 batch (`state/directives/2026-09-28-after-wave-s1-batch.md`), Fable's B-1 paragraph. It asks for a measured P0 table, then a proposal of the admitted set and the detection mechanism, sighted before any code.
- **Status:** a draft. No code has been written and nothing is committed on a branch. The full-form preregistration is written after this sighting, and it follows what is sighted.
- **Measured at:** main 4e46166, with the pinned `duckdb` crate 1.10505.0, which reports DuckDB `v1.5.5`.
- **Evidence** (all under `state/drafts/b1-p0/`):
  - the probe, `probe.rs.txt`. It ran as a scratch integration test and was removed after the run. Its raw output (4.6 MB of JSON lines) is not kept, because re-running the probe regenerates it.
  - the generated matrices, `matrices.txt`.
  - the analysis scripts that derive the matrices and every count below from that output, `analysis/*.py`, with the counts themselves in `analysis/counts.txt`.
  - two discriminators run after the architect's read (§3, §11), `discriminators.rs.txt` and `discriminators.txt`.
- **Drafted by:** the custodian. The #139 gate-1 reviewer's notes 2 and 3 (`state/consults/gates/2026-09-28-wave2-b-admission-campaign-merge-gate1-reviewer.md`) are taken in at §4 and §5.
- **Architect read** (`state/consults/2026-09-29-b1-p0-proposal-architect-read.md`): the architect read this draft at 4e46166 and blocked on three points: a misquoted Decision 8, a wrong attribution of `construct_not_admitted`'s definition, and rule 6 overstating what H5 covered. This version corrects all three and takes in its notes, and §11 lists what it flagged for the full form.

## 1. How P0 measured

The probe covers the 12 filterable surrogate types `duckdb_type_name` maps:
- VARCHAR and BOOLEAN;
- TINYINT to UBIGINT, signed and unsigned;
- REAL and DOUBLE.

Each column type is crossed with 42 operands (30 literals and 12 columns) and every admitted form:
- **The operands:**
  - literals of every parse type: INTEGER, BIGINT, HUGEINT and UHUGEINT; DECIMAL at scales 1, 9, 18, 19, 20, 27, 28, 29, 34 and 36, plus negative and 2^53+1 forms; DOUBLE; VARCHAR in its spellings `'x'`, `'5'`, `'true'`, `x'41'`, `B'01'`, `e'x'` and `$$x$$`; and NULL;
  - a column of each of the 12 types.
- **The comparison forms:** `=`, `<>`, `<`, `<=`, `>`, `>=`, `IS [NOT] DISTINCT FROM`, reversed `=`, `BETWEEN` and `IN`.
- **Arithmetic:** `+`, `-`, `*` and `/` with each operand, followed by `> 0`.
- **Per-column forms:** `LIKE`/`ILIKE`, `IS [NOT] NULL`, `NOT`, an `AND`/`OR` operand, the bare column, unary `-`, `x * x`, `x / 0`, and mixed `IN`/`BETWEEN` lists.

That gives 7,620 cases, not counting the forms stage 1 already refuses as `CAST`: `TRUE`, `FALSE` and `N'x'`. Each was measured four ways:

1. **Binder casts.** `json_serialize_plan` of `SELECT * FROM t WHERE (<predicate>)`, run over an in-memory table of the 12 types. It records every `BOUND_CAST` whose child type differs from its target, and whether that child is the column, a literal or an intermediate expression. This is the binder's own output as structured JSON. It is used here only to measure.
2. **Today's bind admission.** A replica of `bind_admit`'s zero-row surrogate query, with all 12 columns in the namespace. It is a replica because `bind_admit` is private. For the three predicates W2-B ran through the real `admit`, it agrees with W2-B.
3. **The scan.** A parquet file written by DuckDB holds adversarial values per type, for example `'civic'`, `' 7 '`, the integer minimum and maximum, 2^53+1, `inf` and `nan`. It is read with `build_sql`'s shape: `SELECT * FROM read_parquet(?) WHERE (<predicate>) AND bx >= 0.0`. The probe records any error text, and whether that text carries a stored value that the predicate does not itself contain.
4. **Whether a cast fails or rounds.** For a cast of the column, over the stored values: a `TRY_CAST` that returns NULL means it fails, and a round trip that changes the value means it rounds. For a cast of the literal, the same checks run on the literal.

## 2. P0 — what the binder does (the facts)

**2.1 The operator changes the answer only for VARCHAR and BOOLEAN.** VARCHAR against any number or against BOOLEAN, and BOOLEAN against a DECIMAL or float (literal or column), bind under the equality group (`=`, `<>`, `IS [NOT] DISTINCT FROM`, `IN`). The binder then inserts a cast of the *column* to the other type. Under the ordering group (`<`, `<=`, `>`, `>=`, `BETWEEN`), the binder refuses the same pairs, which is today's synchronous `rejected_by_binder`. Every other pair binds the same way in both groups.

**2.2 The comparison matrix, in summary.** The full cell-by-cell matrices are in `matrices.txt`.

| Column \ operand | same type | integer literal | decimal literal (scale s) | double literal | string literal | NULL | other column |
|---|---|---|---|---|---|---|---|
| VARCHAR | no cast | column → number: **fails, leaks** (EQ); binder refuses (ORD) | same | same | no cast | literal only | **fails, leaks** (EQ); refused (ORD) |
| BOOLEAN | no cast | column → integer, cannot fail | column → DECIMAL (EQ); refused (ORD) | column → DOUBLE (EQ); refused (ORD) | literal → BOOLEAN: `'x'` fails when folded, carrying no file value | literal only | numeric: column → number; VARCHAR: **fails, leaks** |
| integers | no cast | the literal takes the column's type when it fits, otherwise the column widens (lossless). A UHUGEINT literal against a signed column is mis-targeted and fails when folded | column and literal → DECIMAL(max+s, s): lossless when digits(T)+s ≤ 38, and **fails, leaks** above that | column → DOUBLE: lossless for ≤ 32-bit, **rounds** for 64-bit | literal → integer: `'x'` fails when folded, carrying no file value | literal only | other integers: lossless widening (to HUGEINT for UBIGINT and signed); REAL: lossless ≤ 16-bit, **rounds** 32/64-bit; DOUBLE: lossless ≤ 32-bit, **rounds** 64-bit |
| REAL, DOUBLE | no cast | literal → the column's type | literal → the column's type | REAL: the column widens to DOUBLE (lossless) | literal → float: `'x'` fails when folded | literal only | as the integer row, mirrored; REAL and DOUBLE widen losslessly |

- **The DECIMAL thresholds.** Only scales 1, 9, 18, 19, 20, 27, 28, 29, 34 and 36 were probed. At every probed point, a comparison failed exactly when digits(T)+s > 38. The thresholds between probed points are inferred from that rule. For example, TINYINT at scale 35 was never run. The binder-agreement test (§4) would enumerate every scale.

  | Type | Digits | Passes at scale | Fails at scale |
  |---|---|---|---|
  | TINYINT, UTINYINT | 3 | 34 | 36 |
  | SMALLINT, USMALLINT | 5 | 29 | 34 |
  | INTEGER, UINTEGER | 10 | 28 | 29 |
  | BIGINT | 19 | 19 | 20 |
  | UBIGINT | 20 | 18 | 19 |

  W2-B's `i64 < 0.000…1` has scale 27.
- **Witnesses:**
  - VARCHAR → INTEGER fails on `civic`, `true` and `''`, and rounds `' 7 '` → 7 and `'1.5'` → 2.
  - BIGINT → DOUBLE rounds 9007199254740993.
  - INTEGER → REAL rounds 16777217.
  - BIGINT → DECIMAL(38,27) fails on 9007199254740993 and on both extremes.
- **A literal is rounded into a float column's type.**
  - `f32 = 0.1`, a decimal literal against REAL, compares the stored float with the nearest float to 0.1. This is H5 (`engine/B1-PROJECTION-PREREGISTRATION.md` §5 H5 and its Amendment 2), the behaviour round 17 item 3 relied on to make REAL filterable, and E-20 pins it. H5 covers exactly this shape, and no other.
  - An integer literal rounds the same way, and that shape is **not** covered by H5 or round 17: `f32 = 16777217` matches a stored 16777216. So does a large literal rounded into DOUBLE.
  - `f32 = 1e3`, with a double literal, instead widens the column to DOUBLE (lossless).

**2.3 Boolean operands.**
- `NOT i32`, `i32 AND flag` and `flag OR f64` bind with a cast of the column to BOOLEAN.
- They are **admitted today and run without error**. This is §7.6's own named case, the implicit int-to-bool coercion: 30 of the generated cases are admitted this way.
- `NOT zone` and `zone AND flag` fail in the scan and leak (`Could not convert string 'civic' to BOOL`).
- A bare non-BOOLEAN column is refused, as today, with `not_boolean`. A bare BOOLEAN column is admitted.
- `TRUE` and `FALSE` parse as `CAST('t' AS BOOLEAN)`, and `N'x'` parses as `CAST('x' AS VARCHAR)`, so stage 1 already refuses all three as `CAST`.

**2.4 LIKE and ILIKE.** The binder refuses a non-VARCHAR operand and a non-VARCHAR pattern, `zone LIKE 1` included. That is synchronous today. `IS [NOT] NULL` inserts no cast for any type.

**2.5 Arithmetic (the #139 reviewer's note 3).**
- **Integer `+`, `-` and `*`** keep the operand's type (`u8 + 1` is UTINYINT). They therefore overflow in the scan when a stored value is extreme. The error text carries the operands, for example `Overflow in addition of UTINYINT (255 + 1)!`: 91 generated cases leaked this way.
- **Unary `-`** on a signed minimum fails without a value in the text.
- **Integer with DECIMAL** is promoted to a DECIMAL(18, s) that can overflow. For example, `i32 + 0.000000001` fails on 2147483647.
- **`/`** returns DOUBLE, and `x / 0` raises no error.
- **Float arithmetic** raised no error in any case.

**2.6 Today's admission against the scan.**
- Of 7,620 cases, today's bind admission admits 6,804.
- 1,676 of those end in a stream error:
  - 576 where a column cast fails, all leaking a stored value;
  - 91 from arithmetic overflow, leaking;
  - 8 from overflow with no value in the text;
  - 1,001 where a literal conversion fails when folded (a string, or UHUGEINT). These carry only the literal's own text, but the refusal is asynchronous, which §7.6 does not allow.
- Another 363 admitted cases run without error while a cast of the column rounds a stored value first.
- The replica and the binder disagree in 3 cases, and bind admission refuses all three: `u64 {+,-,*} 9223372036854775808` raises a DuckDB **INTERNAL error**, "Information loss on integer cast". In `discriminators.txt`, after that error the same connection, a pre-existing second connection to the same database, and a new connection all kept working. It does not invalidate the database instance at v1.5.5, so it is recorded as an observation, not a finding.

## 3. Proposal A — the admitted set

A conversion is admitted only when it **cannot fail during the scan and cannot change a stored value before that value is compared**. The rule is decided from types alone, and it is allowlist-shaped: every rule names what it admits, and the final rule refuses the rest.

**Comparison-shaped junctions.** These are `=`, `<>`, `<`, `<=`, `>`, `>=`, `IS [NOT] DISTINCT FROM`, a `BETWEEN` operand against each bound, and an `IN` operand against each member. A pair is admitted by the first rule that matches:

1. **Identical types.**
2. **A NULL literal on either side.**
3. **Integer against integer,** whether a column or an integer literal of **at most 20 digits**. Every admitted column's range fits in 20 digits. The widening is lossless in every case measured. Longer literals are refused: they are HUGEINT or UHUGEINT, and a UHUGEINT literal against a signed column is mis-targeted and fails.
4. **An integer column against a decimal literal whose scale is at most `MAX_DECIMAL_LITERAL_SCALE` = 18.** This is one declared constant (ADR-010 rule 6). It is safe for every integer type, since UBIGINT's 20 digits plus 18 is 38.
   - **Mixed `IN` and `BETWEEN` lists.** DuckDB takes one common type over the operand and every member, not pairwise. The digit bound in rule 3 is what keeps that sound: integer literals of at most 20 digits and scales of at most 18 cannot need a DECIMAL wider than 38.
   - The discriminator shows the gap without that bound. `i64 IN (170141183460469231731687303715884105727, 0.5)` passes both pairwise checks, but its common type, DECIMAL(38,1), cannot hold the 39-digit literal, so it fails when folded.
   - The 19- and 20-digit mixes that were probed all passed, among them `u64 IN (9223372036854775808, 0.000000000000000001)`, which gives DECIMAL(38,18).
   - The binder-agreement test (§4) carries mixed lists.
5. **A double literal against an integer column of at most 32 bits.** At 64 bits the column rounds.
6. **A REAL or DOUBLE column against a numeric literal** covered by rule 3's digit bound or rule 4's scale bound, or a double literal.
   - **The mechanism** differs by case. A decimal or integer literal is converted to the column's own type. REAL against a double literal widens the column to DOUBLE, which is lossless.
   - **(6i)** A decimal literal rounded into REAL is H5's shape, pinned by E-20.
   - **(6ii)** An integer literal, or a large literal, rounded into the column's type is **new policy, not inherited reliance**: `f32 = 16777217` matches a stored 16777216.
   - **Recommended:** admit both, *and* name "a literal converted to its column's float type, the nearest value" in the Decision 6.3 Note as a declared, admitted conversion (§7). An omission would admit it silently, which principle 8 weighs against.
   - **Alternative:** refuse an integer literal that the column's float type cannot represent exactly (above 2^24 for REAL, 2^53 for DOUBLE). That can be decided from the literal alone, and it keeps (6i).
7. **Column against column across types:**
   - an integer against REAL when the integer is at most 16 bits;
   - an integer against DOUBLE when it is at most 32 bits;
   - REAL against DOUBLE.
8. **Everything else is refused.** In particular:
   - VARCHAR against anything but VARCHAR or NULL;
   - BOOLEAN against anything but BOOLEAN or NULL. BOOLEAN to a number cannot fail, so this one is refused by policy, as §7.6's own class of coercion;
   - a string literal against any non-VARCHAR column. This includes `flag = 'true'`, which works today;
   - every pair that fails or rounds in 2.2.

**Boolean junctions.** Each operand of `AND` and `OR`, and the operand of `NOT`, must be BOOLEAN-typed: a BOOLEAN column, a comparison, `BETWEEN`, `IN`, `IS [NOT] NULL`, `LIKE`/`ILIKE`, or a nested `AND`/`OR`/`NOT`.

**LIKE and ILIKE.** The operand must be VARCHAR and the pattern a VARCHAR literal. The binder already refuses the rest. This rule makes the walk total without relying on the binder.

**Arithmetic.** See §5 for the recommendation. An arithmetic result then enters a comparison under the rules above, by its type.

**Result.** The whole predicate must still infer BOOLEAN, as today.

## 4. Proposal B — the detection mechanism

**Recommended: the engine's own type rules, walked over the allowlisted tree.**

- **The tree.** Stage 1 already parses, walks and admits a tree: `differential_operands`, then the operands before the sentinel. Today `structural_admit` returns only the column names and drops that tree. The fix changes it to return the admitted operands as well, rather than parsing a second time, and types that same tree:
  - a `COLUMN_REF` takes its surrogate type from the namespace that `namespace_admit` returns;
  - a `CONSTANT` takes its type from `json_serialize_sql`'s own `value.type`, including DECIMAL's width and scale;
  - each junction looks its operand types up in §3's rules.
- **Position.** The type walk runs inside stage 3, after the surrogate prepare. Every predicate the binder refuses today therefore keeps `rejected_by_binder` and its text. The DuckDB INTERNAL error in 2.6 is still reached by the prepare before the walk runs. That is acceptable at v1.5.5, because it does not invalidate the database instance (2.6); the alternative is to walk before the prepare.
- **No new text reaches DuckDB,** and no plan text is read at runtime.
- **The pin, a binder-agreement test (test time only).** It enumerates the P0 matrix and runs `json_serialize_plan` over it. For every predicate the walk admits, it asserts two things:
  - the binder inserts no cast of a column outside the lossless set, and no cast to BOOLEAN;
  - the witness-parquet scan ends without error.

  A DuckDB upgrade that changes promotion therefore fails a named test, not a user's stream.

**Rejected alternatives:**
- `json_serialize_plan` at runtime, over the surrogate query, refusing any cast outside the set:
  - it reads the binder's real decisions, but its format is DuckDB's internal serialization;
  - it still needs §3's lossless table to classify each cast;
  - it cannot see arithmetic overflow, because no cast is involved;
  - it is the plan-reading that Fable's paragraph ranks second.
- EXPLAIN text: rejected, per the same paragraph.

## 5. Arithmetic overflow — a decision this cut needs

Overflow depends on the stored values, so no type rule on the *operands* can predict it. The only type-decidable rule is to refuse by *result* type. **Recommended (5a):**
- `+`, `-`, `*` and unary `-` are admitted only when the result is REAL or DOUBLE. That means at least one operand is float-typed, and the other converts losslessly under §3's rules 5 to 7. Integer and DECIMAL results are refused.
- `/` is admitted when both operands convert losslessly to DOUBLE: integers of at most 32 bits, REAL, DOUBLE, or numeric literals. Its result is DOUBLE, and `x / 0` raises no error.

What 5a buys and what it costs:
- It is synchronous, it carries no file data, and it covers every leak P0 found. With it, the #139 campaign can *assert* that no admitted predicate's stream fails (reviewer note 2), rather than only record it.
- It costs integer arithmetic: `a + b > 10` over integer columns becomes refused. Nothing in the product generates such predicates, because the shell sends the typed text verbatim.
- It narrows what ADR-021's named arithmetic set admits, so it is the human's text (§7).

**Alternatives:**
- **(5b)** Keep integer arithmetic. For a failure while evaluating an admitted predicate in the scan, map the terminal error to a fixed, engine-authored detail, never DuckDB's message. This would also close W2-B's observation 2, the composed-SQL slice in `engine.query` details. But the failure stays asynchronous, it introduces a new terminal text (a string for the human to sight), and it touches the kernel's terminal mapping.
- **(5c)** Route overflow to its own node and keep B-1 to casts. The campaign's leak assertion would then have to exclude arithmetic.

## 6. The refusal

**Recommended (6a): a twelfth code,** for example `skp.filter_type_not_admitted`.
- **Fields:** `construct` (the operator as written), `operand_types` (the engine's type names), and `reason`, from a closed set:
  - a conversion that can fail during the scan;
  - a conversion that rounds a stored value;
  - a comparison of text with a non-text value;
  - a conversion to or from BOOLEAN;
  - integer or decimal arithmetic that can overflow.
- **No file data.** The refusal carries no value from the file; only the predicate's own literals may appear.
- **What it requires:**
  - a change to ADR-021 Decision 8. Its closing sentence is the exhaustive-mapping discipline: every failure mode must be mapped into the named list. It does not foresee a twelfth code, and the Note of 2026-09-24, item 2, keeps the eleven. A twelfth code is therefore a Decision change, and the human's;
  - a `FilterError` variant and its kernel mapping;
  - an SKP-V0 §7.5 row, a fixture, and the protocol literal by merge order;
  - the reason texts are new user-visible strings, which the human sights.

**Alternative (6b): reuse `skp.filter_construct_not_admitted`,** with `construct` naming the typed shape (for example `` `=` between VARCHAR and an INTEGER literal``).
- It needs no wire change.
- Neither ADR-021 Decision 8 nor SKP-V0 §7.5 defines the code beyond its name and its field. The code itself already uses it for named nodes in shapes it does not admit, such as `IN` with a non-literal member, a non-literal `LIKE` pattern, or a sentinel mismatch. So a named node is not what rules it out.
- What rules it out is the engine's own message. `FilterError::ConstructNotAdmitted`'s `Display` says the construct is not on the admitted construct list, and names that list as a docs/09 security boundary (paraphrase). For a type refusal that sentence states a false fact.
- Principle 8 rejects a false code. So does Fable's A2-1 test in the same batch, verbatim: "An existing code that would be false is not acceptable".
- **Not recommended.**

## 7. Where the text changes

- **ADR-021, Decision 6.3 — the human's typed text.** It says an implicit coercion ("int-to-bool or otherwise") is refused. Read literally, §3's lossless widenings are coercions too: `i64 = 1` casts the literal, and `f32 = 0.1` rounds it. §3 therefore needs a Note that names both classes, so nothing is admitted by omission:
  - the refused class: a conversion that can fail during the scan, changes a stored value before it is compared, or converts to or from BOOLEAN;
  - the admitted class: a lossless widening, and a literal converted to its column's type, including the nearest float (rule 6, with E-20 as its pin).
- **ADR-021, Decision 8 — the human's typed text,** under 6a: the twelfth code.
- **ADR-021's arithmetic set — the human's typed text,** under 5a.
  - The set is not in the Decision. It is in the Consequences, and under "What this ADR does not decide", where the two named sets are "fixed by this ADR".
  - It is still the human's, because ADR-021 is accepted, and 5a changes what that fixed set admits.
  - Under 5a, SKP-V0 §7.4's admitted list, which names `+ - * /`, is reworded as well.
- **The protocol version.** ADR-021 Decision 2 allows schema evolution only as a version bump. Whether 5a alone, or 6b with no new code, still needs a bump is for the architect's gate to settle. 6a clearly does.
- **SKP-V0 §7.6** (stage 3's sentence), **§7.5** (the row), **§7.4** (under 5a) and **§8** (the change-log entry): wording, which follows the above.
- **Nothing else needs a change:** ADR-023 §2 (its type list is untouched), ADR-004 (the refusal stays on the control plane), and docs/08 (no row, and no performance claim).
- **Engine and kernel:**
  - `predicate.rs`: the type walk, with its rule table as a declared `match`;
  - `FilterError`;
  - `kernel/src/skp.rs`: `filter_error_of`.
- **Gating:** full, both agents (AUTONOMY §21a: an ADR, the wire, and a stated guarantee).

## 8. Behaviour that changes (admitted today → refused)

- **Text against a number:** `zone = 1`, `zone IN (1, 2)`, `zone IS DISTINCT FROM 1.5`.
- **Numbers against BOOLEAN:** `flag = 1` and `flag = 'true'`.
- **Non-BOOLEAN operands of `NOT`, `AND` and `OR`:** `NOT i32` and `i32 AND flag`.
- **Rounding conversions of a stored value:** `i64 = 1e3`, `i32 = f32`, `i64 < f64`.
- **Decimal literals of scale above 18** against integers.
- **Integer literals longer than 20 digits** anywhere.
- **Arithmetic,** under 5a: integer and decimal `+`, `-` and `*`, and `/` on 64-bit integers.

Refusals that are already synchronous keep their codes: the ordering group on VARCHAR, `LIKE` on non-text, the bare non-BOOLEAN column, and `CAST`.

The #139 campaign's G1 grammar generates some of these shapes: arithmetic, unary minus, and cross-type numeric column comparisons such as `i64 < area`. They become refusals, and the campaign's P1–P4 still apply to them. Under 6a, the campaign's list of named refusal codes gains the twelfth.

## 9. Not in this cut (routed)

- **W2-B's observation 2,** the composed SQL in `engine.query` details: a proposed S2 node, unless 5b is chosen.
- **The DuckDB INTERNAL error,** from 2.6: an observation, already refused synchronously. It could go upstream, as a report on DuckDB's own tracker, if the human wants that.
- **`TRUE` and `FALSE` literals,** refused as `CAST` today: whether to admit them is a separate question.

## 10. For Fable — the points to sight

1. **The admitted set (§3), and rule 6 in particular.**
   - (6i), a decimal literal against REAL, is H5's shape and is pinned by E-20.
   - (6ii) is new policy. `f32 = 16777217` matches a stored 16777216.
   - Admit (6ii), declared in the Note, or refuse an integer literal the float type cannot represent exactly?
2. **Rules 3 and 4's bounds.**
   - The integer-literal digit bound is 20, and the scale constant is 18. Together they are what makes mixed lists sound.
   - The alternative is the exact per-type bound digits(T)+s ≤ 38. That bound would need its own n-ary argument.
3. **The mechanism (§4):** the engine's type walk, pinned by a test-time binder-agreement test.
4. **Arithmetic (§5):** 5a is recommended; the alternatives are 5b and 5c.
5. **The refusal (§6):** 6a, a twelfth code, is recommended; the alternative is 6b.
6. **Which of §7's ADR-021 changes go to the human as typed text.**

## 11. For the full-form preregistration (flagged now, block-on-sight there)

- **(a) Where the walk runs.** It runs after the surrogate prepare, which keeps today's binder codes. The INTERNAL error does not invalidate the database at v1.5.5 (2.6). The form states that as an observation at that version (round 15 (c)), and states it again if DuckDB is bumped.
- **(b) Scope** includes removing the campaign's `#[ignore]` from the B-1 reproducer, as Fable's paragraph says, and the campaign's leak assertion (reviewer note 2).
- **(c) The caller rule.** The binder-agreement pin may need `bind_admit`, or a new `pub` constant or accessor, to be reachable. If so, it is checked against the caller rule. Only a read-only instrument accessor is exempt.
- **(d) Float arithmetic.** "Float arithmetic raised no error" is an observation at v1.5.5. The pin's witnesses include `inf`, `nan` and the float maximum for both REAL and DOUBLE.
- **(e) REAL against a double literal.** `f32 = 1e3` widens REAL to DOUBLE inside the comparison. It is declared outside B1 preregistration §8 item 13, whose opening reads, verbatim, "`Float32` widened anywhere". That way a literal reading of the item does not trip on it.
- **(f) Declared unchanged:** E-20 stays green, and every refusal the binder produces today keeps its code and text.
- **(g) Strings.** The new reason strings (§6) go to the human for sight.
