Reviewed: PR #286 at 29f13158574d61a2c857a083011c23135716cb74 (base 0c84b816), gate 1, reviewer
Verdict: PASS WITH NOTES
Branch: cut/arithmetic-text-literal-beside-null-reason @ 29f13158574d61a2c857a083011c23135716cb74

Brief sha256 a9c596adddc6f454c0bfd287a342c63935fc002ce894ed1ede6d5cffff05a173 and packet sha256 f256339a1c49feaa4f8c93ebe354e7bb08a8a513f40b040718e64a7e3acee49c both match. The form at main e0a4810d has sha256 50fe45bbec5c34753f8075da743eeeae2809763f34d3f8a2c545636e8514c74d, which matches the packet.

## Findings by class

**Correctness:** none.

**Evidence:** none.

**Documentation (must-fix before the merge):**
- D-1, the size. The numstat gives 39/10 for engine/src/predicate.rs and 98/0 for engine/tests/filter_type_admission.rs: 147 lines against the declared 140. This is class 6, the custodian's disposition 1. The closing amendment records it, and the Scope line stays unedited. Nothing else.

**Notes (not acceptance conditions):**
- N-1. The doc of `sentence` says "Neither sentence is known to be false of a refusal that gets it". By my reading of the head this is true, under two conditions:
  - I found one shape only in theory: a DECIMAL operand of kind expression that does not count as a decimal literal, beside an integer in a comparison. That would reach `ConversionRounds` with no float operand. The only constructor is unary `-` over a decimal literal (`Typed { kind: OperandKind::Expression, ..operand }`, engine/src/predicate.rs:2020-2023 at the head). It is reachable only if DuckDB serializes `-0.5` as a FUNCTION and not as a folded CONSTANT. I did not probe this.
  - This is W-1's coverage, which belongs to 8b and the human, not this piece. No words proposed.
- N-2. The new placeholder sentence is visible to operators. The shell shows `message` verbatim (frontends/shell/src/admission/formatRefusal.ts, its doc at line 13). It passes every clause (check 5). Its wording is the human's at the sitting (OPEN-2), so no words are proposed.

## Check 1: the diff against section 2, Out-of-scope and Amendment 1

**Callers of `sentence`.**
- `git grep -n '\.sentence(' 29f13158 -- engine kernel protocol frontends` (rc=0) finds exactly one call: `engine/src/predicate.rs:386: reason.sentence(operand_types),`. This is the `TypeNotAdmitted` arm of `FilterError`'s Display.
- `names_text_or_boolean` has one caller, the guard at :1452 inside `sentence`, so it has a product caller.
- `git grep 'can round\|conversion_rounds\|a conversion between a float'` over kernel, protocol, frontends and renderer, excluding .md: rc=1, no consumer of the text.
- In kernel, `TypeNotAdmitted` is built by struct literal only in test B-T6 (kernel/src/skp.rs:2931). Product code only destructures it, in `filter_error_of` (:2351), which is unchanged.

**The arm and the selector.**
- The new arm `Self::ConversionRounds if names_text_or_boolean(operand_types) => {` (:1452) comes before W-1's unguarded `Self::ConversionRounds => {` (:1456).
- The selector is `.any(|t| matches!(t.split(' ').next(), Some("VARCHAR" | "BOOLEAN")))`. It compares the token before the first space for equality, never by prefix.

**Unchanged items, by script** (`atln-g1r-cmp.mjs`, base against head, rc=0, ALL-EQUAL). Each of these is byte-equal at base and head:
- W-1's arm body
- the Display format string
- `enum TypeRefusalReason`
- `wire_value`
- `FilterError::TypeNotAdmitted`'s three fields
- the other four sentence arms
- `Typed::render`
- the list of `pub` items

**Scope.**
- `git diff --name-only` (rc=0) names only the two Scope files.
- A grep of the diff's +/- lines for `pub` or `export` returns rc=1: none.

**Size.** `git diff --numstat 0c84b816...29f13158` (rc=0): 39 10 predicate.rs and 98 0 filter_type_admission.rs, total 147 against 140 (D-1).

**Bytes** (`atln-g1r-bytes.mjs`, rc=0). Over 147 changed lines: CR 0, tab 0, non-ASCII 0, "No newline" markers 0. Both files at the head end in LF and contain no CR.

## Check 2: the suite at the head, run by me

All runs used `CARGO_TARGET_DIR=D:/wt-targets/atln`, each inside a shared hold.

**Engine suite.** `timeout 3600 cargo test -p spatial-engine --locked`: rc=0, 51 `test result` lines, all `ok`. In total 479 passed, 0 failed, 19 ignored. The filter_type_admission binary reports "7 passed; 0 failed". Both named tests passed:
- `every_conversion_rounds_refusal_over_a_text_or_boolean_operand_carries_its_own_sentence ... ok`
- `every_conversion_rounds_refusal_states_a_conversion_refused_by_type ... ok`

**Clippy.** `timeout 3600 cargo clippy -p spatial-engine --locked --tests --no-deps`: rc=0 with 39 warning lines. The only hit in either Scope file is filter_type_admission.rs:1268 (`redundant_pattern_matching`). It is outside the changed hunks: `git diff -U0` puts them at +386, +1434-1444, +1452-1455 and +1464-1486 in predicate.rs, and +622-719 in the test file. `git blame` dates :1268 to commit d036c112c of 2026-09-30. No warning falls on a changed line.

**Fmt.** `timeout 600 cargo fmt --all -- --check`: rc=0, empty output.

## Check 3: M-1 and M-2, observed by me on an export

**Setup.**
- `git archive 29f13158` was unpacked with `tar --force-local` into D:/wt-targets/atln-g1r-export (archive rc=0, tar rc=0). On the export, predicate.rs had sha256 07a51c910d272c5a812dca5b902948cd74e0a0e720523ed1c390ba74704bcd47, equal to `git show 29f13158:engine/src/predicate.rs`.
- Cold build on the new target D:/wt-targets/atln-g1r-target: `cargo test -p spatial-engine --locked --test filter_type_admission --no-run` in a shared hold with no timeout. rc=0, finished in 10m 24s.
- Each mutation was applied by `atln-g1r-mutate.mjs`, which requires exactly one match. Each was alone, and `diff` showed only line 1452 changed.

**M-1, the guard made never true:** `Self::ConversionRounds if false && names_text_or_boolean(operand_types) => {`.
- `timeout 3600 cargo test -p spatial-engine --locked --test filter_type_admission`: rc=101. The crate recompiled ("Compiling spatial-engine").
- T1 FAILED at filter_type_admission.rs:717:9 with `assertion `left == right` failed: "'1' + NULL > 0": Display`. Left was the W-1 Display, right the new sentence.
- The other 6 tests were ok, including 8b's T1. Result line: `test result: FAILED. 6 passed; 1 failed; 0 ignored; 0 measured; 0 filtered out; finished in 233.68s`.
- Restored from `git show 29f13158:...` (rc=0); sha256 07a51c91…bcd47, equal to the head's.

**M-2, the guard made always true:** `Self::ConversionRounds if true || names_text_or_boolean(operand_types) => {`.
- rc=101, recompiled.
- `every_conversion_rounds_refusal_states_a_conversion_refused_by_type` FAILED at :619:9: `"f32 > NULL + 100000": Display`.
- T1 FAILED at :717:9: `"f32 > NULL + 100000": Display`.
- The other 5 tests were ok. Result line: `test result: FAILED. 5 passed; 2 failed; 0 ignored; 0 measured; 0 filtered out; finished in 206.58s`.
- Restored; sha256 07a51c91…bcd47, equal to the head's.

Both outcomes are as the form predicts (Tests+mutation; section 5). Afterwards I removed the export and the target (`rm -rf` rc=0; `ls` shows both gone).

## Check 4: the tests' soundness (item 7, section 5)

T1 (filter_type_admission.rs:632-729 at the head):
- It calls the real `AdmittedPredicate::admit(predicate, &ds)` on FX-1 through `fixture()` and `dataset()`.
- It matches the real `PredicateAdmitError::Filter(FilterError::TypeNotAdmitted { construct: c, operand_types: ot, reason })` and asserts the construct, the operand types and `TypeRefusalReason::ConversionRounds`.
- It checks `e.to_string()` against `format!("refused: `{construct}` over {}: {sentence} (docs/01 principle 8)", …)`, the same shape as 8b's T1 at :619-626.
- The diff adds no `use`.
- It ends with `assert_fixture_unchanged(fx)`.

**Rows.** K1 `'1' + NULL > 0`, K2 `'1' - NULL > 0`, K3 `NULL + '1' > 0`, A2 `NULL / '1' > 0`, then the controls `f32 > NULL + 100000` and `i32 + f32 > 0`. These are Amendment 1, item 2, in the table's order. The controls are byte-identical tuples to 8b's rows at :577 and :595. The construct and operand types on K1-K3 and A2 match the P-0 record in the stop report.

**Determinism.** No sleep, retry, timeout, `#[ignore]` or `cfg`. The only shared state is FX-1's `OnceLock` (:53-70), which is read-only after its write.

**RECORDED MUTATION lines.** Each names its mutation (the exact guard text) and commit ce5afff5d863d088741050c270afa0c10ff617aa, says it was reverted, and claims a whole-binary run with the failing test, row and pass counts. These agree with the continuation report's logged results and with my own runs (counts identical; line numbers differ by the 14 doc lines commit 29f13158 added). Neither line claims more than ran.

## Check 5: the sentences, clause by clause against the head

**`sentence`'s doc (:1430-1443), section 4 item 1:**
- "has two sentences, both P6 placeholders": true (:1453 and :1457 both begin `[P6 placeholder]`).
- The history of T-C replaced by 8b's float sentence: unchanged in substance from the base doc.
- "When `operand_types` has an entry whose leading type name is VARCHAR or BOOLEAN …, the refusal is not that conversion": true. `determine_reason` (:2318-2327) sends VARCHAR or BOOLEAN beside any non-NULL type other than its own to `TextWithNonText` or `BooleanConversion`. So a `ConversionRounds` refusal with such an entry is that type beside NULL or beside its own type, and has no float/integer conversion.
- It names this form's path: yes.
- "Neither sentence is known to be false": true by reading (N-1).
- All of section 4 item 1's required content is present.

**The selector's comment (:1464-1480), item 2 and Amendment 1, items 3 and 4:**
- It reads the leading type name, compared for equality: matches the code.
- Why not a field: the variant's fields are `pub`, and kernel builds it by struct literal in B-T6 and destructures all three fields without `..` in `filter_error_of`. True.
- "routes a text or BOOLEAN operand beside NULL or beside its own type, in +, -, * and /, in either order": true and complete.
  - Comparisons admit these pairs: rules 1-2 at :2207-2213.
  - Unary `-` and junction operands get `TextWithNonText` or `BooleanConversion`: :2025, :2493.
  - Pattern refusals are fixed `TextWithNonText`: :2482.
- The DuckDB version 1.10505.0: Cargo.lock at the head names duckdb and libduckdb-sys 1.10505.0.
- Walk-reached and binder-refused rows: match the stop report's P-0 record row for row.
- CAST: the CAST rows are kept apart, and are refused "before the walk". Stage 1's `walk_expr` arm `"CAST" => Err(FilterError::ConstructNotAdmitted …)` at :1102 runs inside `structural_admit`, before `type_walk` at :195.
- "the BOOLEAN arm is by reading": as Amendment 1, item 3 requires.

**The new placeholder sentence (:1453-1454), item 3.** The Display byte-copied from the M-1 log: `refused: `+` over VARCHAR literal and NULL literal: [P6 placeholder] an operand of text or BOOLEAN type beside NULL or beside an operand of its own type, refused by type (docs/01 principle 8)`.
- It begins `[P6 placeholder]`: yes.
- It is true of every routed pair, both orders, all four operators, binder-refused pairs included: yes, by the routing analysis above. The NULL partner is always a NULL literal, the only path to the NULL type.
- "refused by type": yes.
- It claims no conversion of a value read from the file and no rounding: yes.
- It is the human's wording at the sitting: no words proposed.

**T1's doc (:632-652):** each clause matches T1's body and the observed mutation runs.

**The enum doc (:1396-1399):** "The sentence lives only in [`Self::sentence`]". Still true: both strings are in `sentence`, and the selector only chooses between them.

**The `ConversionRounds` variant doc (:1412):** "Everything else a refused pair can be." Unchanged and still true: no reason routing changed.

No replacement words are needed.

## Check 6: the verify scripts and CI, at the head in the worktree

**Verify scripts:**
- `timeout 600 node scripts/plan/verify.mjs --offline`: rc=0, "verify:plan PASS".
- `timeout 600 node scripts/plan/verify-cites.mjs`: rc=0, "verify:cites PASS — … across 2676 file(s) resolves. (162 loose reference(s) advised above.)".
- `timeout 3000 node scripts/plan/verify-quotes.mjs`: rc=0, "verify:quotes PASS — 138 checked, 107 verified, 30 baselined, 1 advisory, … 0 ruling-cite errors."
- `timeout 900 node scripts/plan/verify-test-claims.mjs`: rc=0, "verify:test-claims PASS — all 738 claimed test(s) across 235 file(s) …".

**CI.**
- `gh pr checks 286`: rc=0, 18 checks, all pass. `gh pr view` gives head 29f13158574d61a2c857a083011c23135716cb74, draft, base main.
- `gh run view <id>` (each rc=0): all 12 runs have headSha 29f13158574d61a2c857a083011c23135716cb74 and conclusion success.
  - pull_request: 42184255664 Ported notices, 42184256052 Rust fmt, 42184255830 Exposure scan, 42184255796 DCO sign-off, 42184255811 Governance CI, 42184255807 Product CI — shell, 42184255716 Product CI — Rust workspace.
  - push: 42177516398 Governance CI, 42177516668 Product CI — shell, 42177516514 Rust fmt, 42177516554 Ported notices, 42177516201 Product CI — Rust workspace.
- `gh run list --branch …` shows no other run.

## The packet's gaps (Part 2, section C)

1. Section 3 says "the kernel builds `TypeNotAdmitted` by struct literal" but not that the only construction is inside test B-T6. Kernel product code only destructures it, in `filter_error_of`. I had to read kernel/src/skp.rs to settle the seam.
2. How an operator sees the sentence: the shell renders `message` verbatim (formatRefusal.ts). This is needed to judge the placeholder at operator level and is not in the packet.
3. The head's sha256 of engine/src/predicate.rs, for the restore checks. The continuation report gives it for commit 2 only; I computed it at 29f13158.

## Hold lines (my project only; `also=` elided)

Five holds: the suite, clippy, the export build, M-1 and M-2. Each logged:
- `MACHINE_HOLD shared project=SpatialIDE cores=0-7 affinity=FF shell=bash.exe:<pid> also=… (commands started from now on inherit it; release when done)`
- `MACHINE_RELEASED project=SpatialIDE shell=bash.exe:<pid> affinity=FF (cores 0-7)`

No hold was refused, and no exit code 96-99 occurred.

## End state and background shells

- The worktree's porcelain is empty (0 bytes) and HEAD is 29f13158574d61a2c857a083011c23135716cb74.
- D:/wt-targets/atln-g1r-export and D:/wt-targets/atln-g1r-target are gone.
- Every background task I started has completed and notified: the suite, the quotes verifier, clippy, the export build, M-1, M-2 and two wait loops (each with a hard timeout). None is still running, so I killed none.
- `tasklist` shows no cargo, rustc or test process.
- All scratch files are under `atln-g1r-` names; the archive tar is deleted.
