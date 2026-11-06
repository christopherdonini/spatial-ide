Reviewed: PR #286 at 29f13158574d61a2c857a083011c23135716cb74 (base 0c84b816), gate 1, architect

Verdict: PASS WITH NOTES

I have no shell, so I could not check the brief's sha256 or the packet's, and this report gives no sha256 of its own. I leave no background shell. Head cites below are read at 29f13158 in the worktree at C:/dev/wt/atln. Base cites are read at main e0a4810d, because the packet says the two Scope files have not changed on main since the base.

## Findings by class

**Correctness: none.**

**Evidence: none blocking.**
- I could not observe M-1 or M-2 myself (no shell). Under Part 1 item 9, mutation observations stay the gates' own, so the reviewer's observation is the one that counts.
- My check of the RECORDED MUTATION lines against the worker's report agrees with what the form predicts (check 4).

**Documentation, must-fix before the merge:**
- **D-1.** The form's closing amendment still has to be written. It must:
  - record the size as 147 changed lines against the declared 140, class 6, without editing the Scope line (the custodian's disposition 1);
  - cite P-0's record (the stop report), since section 1, "Where the record lives", says the closing amendment cites it.
  
  These are record words, not code. No replacement words are needed in the code.

**Notes (preferences, item 6; none is an acceptance condition):**
- **N-1. The kernel clause in the selector's comment** (engine/src/predicate.rs:1467-1469 @ 29f13158). The comment says "the kernel builds that variant by struct literal". That is true only of the kernel crate's test module: kernel/src/skp.rs:2931 sits inside `mod tests`, which begins at :2446 under `#[cfg(test)]`. The shipped kernel instead destructures the variant with an exhaustive pattern, with no `..` (kernel/src/skp.rs:2351-2355). Either way, a new field would change a contract across modules, so the comment's conclusion holds.
  - Optional words, not the human's wording: "because no field of `FilterError::TypeNotAdmitted` carries the choice, and the kernel matches every field of that variant (and its B-T6 test builds it by struct literal), so a field would change a contract across modules."
  - Clause check: "no field carries the choice" matches the fields `construct`, `operand_types` and `reason`. "Matches every field" matches skp.rs:2351-2355. "B-T6 builds it" matches skp.rs:2931.
- **N-2. "names the text or BOOLEAN operand"** in `sentence`'s doc (predicate.rs:1441 @ 29f13158). The sentence describes the operand's type class ("an operand of text or BOOLEAN type"). It does not name the particular operand; `operand_types` does that in the Display. The clause is not false.
  - Optional words, not the human's wording: "which describes the operand as of text or BOOLEAN type and says the refusal is by type".
- **N-3. How M-1 was done.** The form describes M-1 as "the selector removed". The worker instead made the guard never match (`if false && …`). The effect is the same: every `ConversionRounds` refusal carries W-1.
- **N-4. Where the mutations were observed.** They ran at ce5afff5 (the test commit), not at 06ab051a, the commit that adds the code alone. T1 does not exist at 06ab051a, and the worker reports that predicate.rs at ce5afff5 is byte-equal to commit 2's. I read the form's "on the branch's code commit" as "a commit carrying the code", which ce5afff5 does.
- **N-5. A possible false case for W-1, outside this piece; I found it by reading and could not run it.**
  - Unary `-` over a decimal operand keeps the operand's type and sets `counts_as_decimal_literal` false (predicate.rs:2019-2023 @ 29f13158).
  - If DuckDB's parser left such a node unfolded, a comparison like `i32 = -(0.5)` would reach `ConversionRounds` with no float operand, and W-1 would be false of it.
  - By my reading, the parser folds a negated numeric constant into the constant (its `doNegate`), so the case is unreachable. I could not verify this.
  - It is W-1's domain, which this piece leaves unchanged. The new doc's "known to be false" hedge covers it. For the human's sight only.

## Check 1: the change against sections 2 and 3, the Out-of-scope line and Amendment 1

The head does exactly what the form says, and no more.
- **`sentence`'s signature.** `sentence` now takes the operand types: `fn sentence(self, operand_types: &[String]) -> &'static str {` (predicate.rs:1444 @ 29f13158). It is still private.
- **One caller.** The only call is `reason.sentence(operand_types),` (predicate.rs:386). A search for `.sentence(` and `fn sentence` over every `.rs`, `.ts` and `.tsx` file in the worktree finds that call, the definition, and one doc mention at engine/tests/filter_type_admission.rs:563.
- **New arm before W-1's.** The new arm sits at predicate.rs:1452-1455, before W-1's arm at 1456-1459. W-1's text is byte-equal to the base's (main predicate.rs:1450-1453).
- **The selector.** `names_text_or_boolean` (predicate.rs:1481-1485) is private. It compares the first token before a space for equality with VARCHAR or BOOLEAN.
- **The diff accounting matches the numstat.**
  - Deleted (10): the call line, eight doc lines (base 1434-1441) and the old signature.
  - Inserted (39): the call, ten doc lines (1434-1443), the signature, the four-line arm, and the selector with its comment and the blank line before it (1463-1485).
  - Total 39/10, so nothing else in predicate.rs moved.

Each item the brief asks about:
- **Reason values and the wire `reason`: untouched.** `wire_value` (1420-1428) is unchanged. The kernel takes `reason` from `wire_value()` (kernel/src/skp.rs:2377).
- **`message` and Display (SKP-V0): unchanged.** The Display format string is unchanged (384), and the kernel passes `message` through.
- **`TypeNotAdmitted`'s fields: unchanged.**
- **New Rust variant: none.** The enum is unchanged (1401-1414).
- **W-1's words: unchanged.**
- **ADR-021: not touched.** No admission rule changed; `determine_reason`, `admitted_arithmetic_result`, `type_of_division` and the comparison rules are all outside the diff.
- **Kernel: untouched.** A search finds no `ConversionRounds` or `conversion_rounds` in kernel/.
- **protocol/: untouched.**

## Check 2: is the selector complete?

`ConversionRounds` is produced only at the end of `determine_reason` (predicate.rs:2351). `determine_reason` is called from five places (lines 1984, 2025, 2057, 2391, 2493). Item 1 of its precedence (2318-2322) and item 2 (2323-2327) decide the cases below.

- **Division (1984).** It is reached only when an operand is VARCHAR or BOOLEAN. A `ConversionRounds` result therefore means VARCHAR beside VARCHAR or NULL, or BOOLEAN beside BOOLEAN or NULL. All of these are routed to the new sentence.
- **Unary `-` (2025).** The partner is a DOUBLE column (`numeric_virtual`). A VARCHAR operand gives `TextWithNonText` and a BOOLEAN one gives `BooleanConversion`. It is never `ConversionRounds`.
- **Junction operands (2493).** The partner is a BOOLEAN column. A VARCHAR operand gives `TextWithNonText` and a numeric one gives `BooleanConversion`. It is never `ConversionRounds`.
- **Comparisons, BETWEEN and IN (2391, not arithmetic).** Rule 1 (identical types) and rule 2 (NULL on either side) admit every VARCHAR or BOOLEAN pair that items 1 and 2 would not refuse first. So no comparison `ConversionRounds` carries VARCHAR or BOOLEAN.
- **Binary `+`, `-` and `*` (2057).** Rule 1 is limited to REAL and DOUBLE, and rule 2 requires a numeric partner. So VARCHAR or BOOLEAN beside its own type or NULL falls through to `ConversionRounds`. These are routed to the new sentence.
- **W-1 keeps every pair with a REAL or DOUBLE operand.** Such a pair cannot carry VARCHAR or BOOLEAN, because a float is neither VARCHAR/NULL nor BOOLEAN/NULL, so item 1 or item 2 fires first.

No reachable pair gets the wrong sentence through the selector. N-5 is a case in W-1's own domain, not a routing error.

## Check 3: the sentences, clause by clause against the head

**`sentence`'s doc (1430-1443): true.** It covers everything section 4 item 1 lists.
- "has two sentences, both P6 placeholders": true (1452-1459).
- What selects between them: `names_text_or_boolean`, true.
- The form's path: given at 1440.
- "the refusal is not that conversion": true, since a routed pair has no float operand (check 2).
- "the float sentence goes to every `ConversionRounds` refusal with no VARCHAR or BOOLEAN entry": true by the order of the arms.
- "Neither sentence is known to be false": I found no reachable false case. N-5 is unreachable by reading.

**The selector's comment (1464-1480): true.** It covers everything section 4 item 2 lists, with Amendment 1 items 3 and 4.
- What it reads (the leading token) and why: true (see N-1).
- The pairs it routes, in all four operators, in either order: true by check 2.
- The DuckDB version, `duckdb` and `libduckdb-sys` 1.10505.0: matches Cargo.lock:541-542 and :1185-1186.
- The pairs that reach the walk (K1, K2, K3 and A2), the binder-refused rows (K4, A1, A3, B1-B8, B13-B16, C5) and the CAST-refused rows (B9-B12, C1-C4), kept apart: these match the stop report's P-0 record and Amendment 1 item 2.
- "the BOOLEAN arm is by reading": true.
- FX-1's `zone` column is Utf8 and `flag` is Boolean (engine/src/fixture.rs:662-663).

**The placeholder sentence (1453-1454): true.** Its words are the human's at the sitting (OPEN-2, the 2026-11-06 ruling, item 1). They are a red line, so I give no replacement words. Clause by clause:
- It begins with `[P6 placeholder]`: yes.
- "an operand of text or BOOLEAN type beside NULL or beside an operand of its own type": true of every routed pair, which is VARCHAR or BOOLEAN beside NULL or beside its own type, in either order, in all four operators. That includes the binder-refused pairs if they were to reach the walk, and BOOLEAN expressions.
- "refused by type": yes.
- It claims no conversion of a value read from the file, and no rounding: yes.
- It states no consequence that belongs to another module.

**T1's doc (632-651): true of the body.**
- Its four text rows and two float controls match rows 662-694.
- The two RECORDED MUTATION lines are each named, with a 40-hex commit.

**The enum's doc (1396-1399) stays true.** The text of both sentences still lives only in `sentence`; the selector returns a bool.

**The `ConversionRounds` variant's doc (1412) stays true.**

## Check 4: tests at real boundaries

T1 (`every_conversion_rounds_refusal_over_a_text_or_boolean_operand_carries_its_own_sentence`, filter_type_admission.rs:652-728 @ 29f13158):
- It calls the real `AdmittedPredicate::admit` on FX-1, through `dataset()` at :81 and `fixture()` at :53.
- It matches the real `PredicateAdmitError::Filter(FilterError::TypeNotAdmitted { .. })`.
- It checks `to_string()` against the format at predicate.rs:384.
- It ends with `assert_fixture_unchanged`.
- Its imports are unchanged (:22-27), and the test file's diff is 98/0, which is exactly T1.
- Its rows are Amendment 1 item 2's: K1, K2, K3 and A2 in the table's order, then the controls `f32 > NULL + 100000` and `i32 + f32 > 0`. The controls are copied from 8b's T1 at :577 and :595.
- It has no sleep, retry, `#[ignore]` or `cfg`.

M-1 and M-2, read from the RECORDED MUTATION lines (639-651) against report 2's "Mutations" section:
- **M-1:** T1 alone fails, at its Display assertion on `'1' + NULL > 0`; 6 passed and 1 failed. This is as predicted.
- **M-2:** T1 and 8b's T1 fail, each at `f32 > NULL + 100000`; 5 passed and 2 failed. This is as predicted.
- The binary has 7 `#[test]` functions, which agrees with both counts.
- The reported failure line :703 at ce5afff5 agrees with :717 at the head, which is 14 doc lines later.
- No `verify-mutation` run is called an observation.

## Check 5: scope

- The packet's numstat lists only the two files.
- In the worktree, the 8d names (`names_text_or_boolean`, the new sentence, the form's path) appear only in the two code files and in records that are already on main at the base.
- engine/README.md has no 8d line (OPEN-4 (a)).
- No new `pub` item was added.
- I could not run `git diff`, so the numstat is the packet's; my line accounting in check 1 matches it.

## Check 6: FILTER-BIND's invalidator

**Yes.** FILTER-BIND's Amendment 3 (its "§5, invalidators" bullet) says the reason-sentence invalidator fires on "a refusal that no five-reason sentence states truly." A "five-reason sentence" is a sentence under one of the five reasons, not one of five sentences. The new sentence sits under `conversion_rounds`, one of the five, so it is inside the invalidator. The same amendment's §8 item 9 ("a reason outside the five, or a reason sentence false for a corpus row") reads the same way. This change makes the invalidator hold for more refusals: K1, K2, K3 and A2 now get a true sentence.

## The packet's gaps

- The diff was given only as a locator. With no shell, I reconstructed it by reading the base and head spans and reconciling them with the numstat.
- The packet says the base's predicate.rs and test file equal main's, but gives no hash I could check. I relied on that statement for the old spans.
- That the kernel builds `TypeNotAdmitted` by struct literal only in its test module was not in the packet; I found it (N-1).
- Whether DuckDB's parser folds a unary minus over a decimal constant is in no record (N-5).
- CI status was not given, by design; it is not a dispatch condition (item 4).

Files read:
- C:/dev/wt/atln/engine/src/predicate.rs
- C:/dev/wt/atln/engine/tests/filter_type_admission.rs
- C:/dev/wt/atln/kernel/src/skp.rs
- C:/dev/wt/atln/Cargo.lock
- C:/dev/wt/atln/engine/src/fixture.rs
- C:/dev/spatial-ide/engine/src/predicate.rs
- C:/dev/spatial-ide/governance/forms/engine/ARITHMETIC-TEXT-LITERAL-BESIDE-NULL-REASON-PREREGISTRATION.md
- C:/dev/spatial-ide/governance/forms/engine/FILTER-BIND-COERCIONS-PREREGISTRATION.md
- C:/dev/spatial-ide/state/consults/2026-11-06-arithmetic-text-literal-beside-null-reason-worker-report.md
- C:/dev/spatial-ide/state/consults/2026-11-06-arithmetic-text-literal-beside-null-reason-worker-report-2.md
- C:/dev/spatial-ide/state/directives/2026-11-05-main-architect-gate-rounds-part-1-rulings-review-packet-design-part-3-additions.md
