Reviewed: PR #282 at ae4d94d4e463a4b213f3ecaeb98bc09ba3d92ec2 (base 4009a97e), gate 1, architect
Verdict: PASS WITH NOTES

cut/type-walk-rule2-residual-reasons @ ae4d94d4e463a4b213f3ecaeb98bc09ba3d92ec2. Every cite below is read at that commit, in the worktree C:/dev/wt/twr2.

I have no shell, so I recomputed no sha256: not the brief's, not the packet's, and none of the form's pins. I could not run `git rev-parse` either. To confirm the worktree is at the reviewed commit, I checked its predicate.rs:1430-1449 and filter_type_admission.rs:557-630 against the packet's whole diff, and they are equal. I left no background shell. I could not observe M-1 or run the suite. Part 1 item 9 leaves both of those with the reviewer.

## Findings by class

**Correctness: none blocking.** The diff changes only the `ConversionRounds` string and its doc comment in predicate.rs:1430-1449, plus one new test. The test sits at filter_type_admission.rs:557-630 at commit ae4d94d4e463a4b213f3ecaeb98bc09ba3d92ec2. No admission rule, precedence, `wire_value` or Display format moves (predicate.rs:1420-1428 and 382-387). No new `pub` item. No path under kernel/, protocol/, frontends/ or renderer/.

**Evidence: none blocking.**
- T1 goes through the real producer, `AdmittedPredicate::admit` over FX-1. It asserts the real `PredicateAdmitError::Filter(FilterError::TypeNotAdmitted{..})` shape, and it checks the Display against the real format. That satisfies item 7.
- M-1's line names the mutation and its 40-hex commit. It claims only one binary run, with "3 passed; 1 failed", and that matches the hand-back as the packet's §4 gives it. It does not call a verify-mutation run an observation.
- The gates' own observation of M-1 is the reviewer's. I cannot run it.
- CI "Product CI — Rust workspace" was still running at assembly. CI green is a merge condition, not a dispatch condition (item 4).

**Documentation, must-fix before the merge.** None of these is the human's wording. The worker applies these words with no re-gate, and the PR body lists them.

- **D-1. W-2 names a form path that does not exist** (predicate.rs:1433 at commit ae4d94d4e463a4b213f3ecaeb98bc09ba3d92ec2).
  - Requirement: a doc comment's reference must resolve. I grepped governance/MOVED.tsv for `TYPE-WALK-RULE2-RESIDUAL-REASONS` and got no row. The form is at `governance/forms/engine/TYPE-WALK-RULE2-RESIDUAL-REASONS-PREREGISTRATION.md`, which I read.
  - Closure, replacement words for the whole doc comment (wrap at 100 columns):
    `/// The `Display` sentence, never sent on the wire. The first four are copied byte for byte from` / `/// `state/directives/B-1-RULINGS-AND-TYPED-TEXTS-2026-09-30.md` T-C by the script that wrote this` / `/// file. The fifth, `ConversionRounds`'s, replaces T-C's under` / `/// `governance/forms/engine/TYPE-WALK-RULE2-RESIDUAL-REASONS-PREREGISTRATION.md` and is a P6` / `/// placeholder: T-C's named a value read from the file, which is false where the integer or` / `/// decimal side is a constant NULL (`f32 > NULL + 100000`). This one states the type pair` / `/// alone. It is still false of a double literal beside an INTEGER literal in `+`, `-` or `*`,` / `/// which the walk refuses although no INTEGER value rounds in DOUBLE.`
  - Clause check: the only change is the path, and it resolves. Every other clause is checked under check 2 below.
- **D-2. T1's doc names the same path that does not exist** (filter_type_admission.rs:557 at commit ae4d94d4e463a4b213f3ecaeb98bc09ba3d92ec2).
  - Closure, replacement words: `/// T1 (`governance/forms/engine/TYPE-WALK-RULE2-RESIDUAL-REASONS-PREREGISTRATION.md`,` / `/// Tests+mutation and note 1): each of the eleven predicates is refused `TypeNotAdmitted` with its` / `/// construct, operand types and the reason `ConversionRounds`, and its `Display` is the format of` / `/// `FilterError`'s `TypeNotAdmitted` arm carrying the type-level sentence (a P6 placeholder) instead` / `/// of one naming a value read from the file.`
  - Clause check: under check 2. The edit is to a comment only. The test body and the RECORDED MUTATION lines stay unchanged.
- **D-3. The form's note 3 says something false about `/`.** It says that "The unary, `/` and junction callers have a VARCHAR or BOOLEAN operand there, so items 1 and 2 fire first". That is false of `/`.
  - At predicate.rs:1950-1951, `type_of_division` sends VARCHAR or BOOLEAN beside a NULL literal, or beside its own type, to `determine_reason`.
  - Items 1 and 2 of `determine_reason` exclude a NULL partner and need differing types (predicate.rs:2266-2275). Those pairs therefore fall to the residual at 2299.
  - The unary and junction halves of the sentence hold: `numeric_virtual` is DOUBLE (1575-1577) and `boolean_virtual` is BOOLEAN (1569-1571), so items 1 and 2 always fire for them.
  - Closure: one appended amendment to the form, with references only. Suggested words: "Note 3's sentence on the unary, `/` and junction callers is false of `/`: `type_of_division` refuses VARCHAR or BOOLEAN beside a NULL literal or beside its own type, and `determine_reason` returns `ConversionRounds` for those pairs, as the binary arithmetic arm does when no rule admits the same pairs; whether the binder lets any of them reach the walk is unprobed. The architect's gate-1 report for PR #282 carries the shapes to the human."
  - Clause check: predicate.rs:1950-1956 and 2266-2299 support the first clause. Arithmetic rule 1 covers REAL/DOUBLE only (2064), and rule 2 is guarded by `is_numeric` (2077-2082). That supports "as the binary arithmetic arm does". "Unprobed" holds: P-0 (Amendment 1) probed only `+`.

**Notes (no acceptance condition).**
- N-1. W-2 names only the F-A shape. It does not name the text-beside-NULL shape that P-0 observed. Leaving it out makes no clause false, so this is not a finding. Optional extra sentence: "It is also false of a text literal beside NULL in `+`, `-` or `*` (`'1' + NULL > 0`), which reaches this reason because the text reason excludes a NULL partner." Clause check: predicate.rs:2266-2267 and 2077-2082; observed for `+` by P-0 (Amendment 1); `-` and `*` share the same arm.
- N-2. In `check_pair`, the `is_arithmetic` branch has no `true` caller at this commit. Every call at predicate.rs:2361, 2385, 2387, 2388 and 2399 passes `false`. This is pre-existing and not this piece's.

**For the human (W-1; no replacement words).** These shapes reach `ConversionRounds` beyond the two known ones. They are from reading only, and whether the binder lets them through has not been probed:
- (a) Text beside NULL in `/`, e.g. `'1' / NULL > 0`, through `type_of_division` at predicate.rs:1950-1951. This is the closest analogue of P-0's `'1' + NULL > 0`, which did reach the walk. It is the human's text-beside-NULL shape under a different construct and code path. F-B's reading in note 4 cites only the `+ - *` arm's rule-2 guard, so F-B's form should name `/`.
- (b) VARCHAR beside VARCHAR and BOOLEAN beside BOOLEAN in `+ - *` and `/`, e.g. `'1' + '2' > 0` and `TRUE * FALSE > 0`.
- (c) A BOOLEAN literal beside NULL in `+ - *` and `/`, e.g. `TRUE + NULL > 0`. P-0 found that the column form `flag + NULL > 0` was rejected by the binder.

None of these has a float side. The text ones fall under Amendment 2's "says nothing of text". The BOOLEAN ones are not text: if the binder admits any of them, that is a third shape.

## Check 1: W-1, clause by clause (the human's wording, at P6)

Every refusal that reaches the residual at predicate.rs:2299 comes from `determine_reason`, which has five callers: 1951, 1992, 2024, 2339 and 2441.

**"between a float type and an integer or decimal type"**
- **check_pair** (comparisons, BETWEEN and IN): **holds on every path.** The type set is closed: EngineType at 1465-1482. Columns are never DECIMAL or HUGEINT (1691-1708).
  - Identical types are admitted (2155). So is NULL (2159), integer with integer (2193), and integer or decimal beside a decimal literal or a counts-as result (2207-2214).
  - A float that is not a literal is admitted beside any numeric literal or counts-as result (2220-2224). Rule 6(ii) admits a double literal beside an integer or decimal literal (2226-2230).
  - That leaves only a REAL/DOUBLE column or expression, or a double literal, beside a non-literal integer wider than the bound of rule 5 or 7.
  - Out-of-bounds literals and a decimal beside a wide integer stop at items 3 and 4 (2276-2295).
- **Unary `-`** (1992): never residual. A VARCHAR operand against the DOUBLE virtual hits item 1; a BOOLEAN operand hits item 2.
- **Junction** (2441): never residual. Any operand that is not NULL and not BOOLEAN, set against the BOOLEAN virtual, hits item 1 or item 2.
- **Binary arithmetic** (2024): **holds** for float beside integer and for float beside decimal (e.g. `(NULL - 0.5) + f32`, where `is_numeric_lit` needs kind literal, 2043-2048). **Does not hold** for:
  - text beside NULL (known shape 1, F-B, 8d);
  - the (b) and (c) shapes above.
- **`/`** (1951): **does not hold.** It reaches the residual only for the (a), (b) and (c) shapes.

**"refused by type"**: **holds on every path.** `determine_reason` reads `ty`, `kind`, `within_bounds` and `counts_as_decimal_literal` (2261-2299), and never a row value. A literal's value moves only the result type, in `fold_or_promote_integer` (1671-1687). The refusal is still by the operands' types.

**"values of the integer or decimal type can round in the float type"**
- **Holds** for the residual float pairs above:
  - INTEGER and wider against REAL, and BIGINT and wider against DOUBLE or a double literal, because rules 5 and 7 admit the narrower ones (2216-2241, 2105-2116, 2132-2137);
  - DECIMAL(2,1) against REAL.
- **Does not hold:**
  - for F-A, a double literal beside an INTEGER literal (known shape 2, 8c): `int_le` needs a non-literal (2050-2056), and an INTEGER value is exact in DOUBLE;
  - for the text and BOOLEAN shapes, where no integer or decimal type is present.

## Check 2: W-2 and T1's doc, clause by clause (not the human's words)

**W-2** (predicate.rs:1430-1437):
- "never sent on the wire": holds. `wire_value` is separate (1420-1428), and O-4 is at B-1:10.
- "first four … byte for byte … T-C": holds by reading. predicate.rs:1440-1445 against B-1:53-56 are equal as read side by side. I did not recompute a hash.
- "The fifth … replaces T-C's under `engine/TYPE-WALK-…`": does not hold. See D-1, which gives the words.
- "and is a P6 placeholder": holds. See 1447.
- "T-C's named a value read from the file": holds (B-1:57).
- "false where … a constant NULL (`f32 > NULL + 100000`)": holds by reading. The INTEGER side is NULL in every row. The binder's cast direction is unobserved, as the form's "Not settled" says.
- "states the type pair alone": holds.
- "still false of a double literal beside an INTEGER literal in `+`, `-` or `*` … no INTEGER value rounds in DOUBLE": holds (2131-2138). It names the F-A path, not the text path, as the packet's §5 says.

**T1's doc** (filter_type_admission.rs:557-567):
- The path does not hold. See D-2.
- "eleven predicates … construct, operand types … `ConversionRounds`": holds (576-596, 609-615).
- "Display is the format … carrying the type-level sentence": holds (619-626 against predicate.rs:382-387).
- "instead of one naming a value read from the file": holds, because M-1 tells the two apart.
- The RECORDED MUTATION lines are as given under Evidence.

## Check 3: the Out-of-scope line, item by item

- **ADR-021's Notes, classes, five reason values and twelve codes:** hold. No ADR file is in the packet's numstat. `TypeRefusalReason` keeps its five variants (1401-1414) and `wire_value` is unchanged. I did not re-run git: this rests on the packet's numstat.
- **No admission outcome moves:** holds. No line of `admitted_arithmetic_result`, `is_admitted_comparison` or `determine_reason` is in the diff.
- **Nothing under protocol/, and FX-4 unchanged:** holds. FX-4 at protocol/skp/tests/data/v0-error-filter_type_not_admitted.json:3 is a `text_with_non_text` message. Grepping kernel, frontends, protocol and renderer for `conversion_rounds|ConversionRounds` finds only SKP-V0.md:522, the reason list.
- **The `message` change is a Display wording change:** holds under O-4 (B-1:10) and SKP-V0.md:346, which says `message` is Display verbatim. The shell's `refusalGuidance` has no `skp.filter_type_not_admitted` copy (formatRefusal.ts:70-114).
- **FILTER-BIND's invalidator:** holds as disclosed. The cite resolves through MOVED.tsv:44 to governance/forms/engine/FILTER-BIND-COERCIONS-PREREGISTRATION.md:376. That line is Amendment 3's restatement of the §5 invalidator; §8 item 9 is at :377.
  - Every conversion_rounds corpus row (C7, C8, C9, C19, and the two BETWEEN rows at filter_type_admission.rs:215-217, 258, 333 and 338) is a float/integer pair, so W-1 is true of them. §8 item 9 is not tripped.
  - The invalidator stays live for F-A and for the shapes above.
- **No guarantee changed:** holds. No test asserted the residual sentence at the base: the test file's diff is 75 insertions and 0 deletions, and a grep at head finds "can round" only at predicate.rs:1448 and filter_type_admission.rs:573. So no property under test moved (§21a).
- **Anything beyond what the line declares:** nothing.

## Check 4: the five lines against the head

- **Scope:** holds. Two files, 89 changed lines against a budget of 130, and the form is exempt. Only the arm and its doc changed in predicate.rs. In the test file, only T1 was added, with no B-T1, B-T1b or B-T3 change.
- **Change:** holds as Amendment 2 narrows it. Every `ConversionRounds` Display ends with W-1, because the arm is keyed on the reason alone. W-1 names float against integer or decimal and nothing of text.
- **Tests+mutation:**
  - P-0 is as Amendment 1 records it.
  - T1's eleven rows match note 1's table row for row: construct, operand types, `DECIMAL(2,1) expression` and the three controls.
  - M-1's line is as given under Evidence.
- **§21c's fourth bound:** met through §36's P6 clause ("its strings a user sees are P6 placeholders", AUTONOMY.md:692). The human ruled OPEN-4 (A) in the 2026-10-26 directive, at its line 32.

## Check 5: Amendment 2 against the head

Nothing at the head claims more for W-1 than "the conversions it describes":
- W-2 claims no exhaustive truth.
- T1's name and doc state what the Display carries, not that it is true.
- T1 has no text row, and no code touches the text-beside-NULL path (2266-2267 and 2077-2082 are unchanged). F-B's shape is untouched.
- Amendment 2's quoted span matches its source byte for byte, read side by side, at state/directives/2026-11-05-platform-runs-filed-c1-governance-next-fixtures-kernel-node-8b-route-a-f-b-after-8c.md:10.

D-3 and the (a) to (c) shapes go to the human with W-1.

## The packet's gaps

- Binder outcomes for `/` and for same-type text/BOOLEAN arithmetic shapes. No record holds them, and I could not probe them.
- Where FILTER-BIND's invalidator sits after the move: it is Amendment 3's restatement of §5 at :376, not §8. I resolved this myself through MOVED.tsv.
- The text of §21a/§21c/§36 and O-4: the packet names them only by number, so I read them in AUTONOMY.md and B-1.
- Consumers of the sentence downstream (kernel and shell): the packet points to the form's note 1. I grepped them.
- Confirmation that the worktree HEAD is ae4d94d4: the packet asserts it. With no shell, I checked it only by file content against the diff.
