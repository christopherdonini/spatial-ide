*Custodian's filing note (2026-11-06): filler entry 8c (`literal-only-float-integer-arithmetic-refused`), built by a worker on `cut/literal-only-float-integer-arithmetic-refused` from main 2c72923e, head 2c5627a2, its brief by path and sha256 (156bfe76). The run 2026-11-05T23:45:45.677Z to 2026-11-06T01:47:47.551Z by its transcript (claude-sonnet-5-5; unique calls Bash 96, Read 7, Write 5, Monitor 1, Edit 11 and the hand-back, 121, equal to the notification's); by a scan of its Bash commands, one push and no reset, rebase, amend, force, PR action or claude command. The custodian's checks: the head suite's log summed by script (51 result lines, 478 passed, 0 failed, 19 ignored), and the scripts suite run in the worktree at the head (598 of 598). Extracted by script from its hand-back, unchanged. A report, not Authority.*

---

Built: literal-only-float-integer-arithmetic-refused at 2c5627a208cd0d71f122b2783b2d7cef3a687bde

Start: HEAD 2c72923e9046daa373d112e8e8d2f0f5a73e4fb1, porcelain empty, .cargo/config.toml sha256 6889110645ec075c0cba3bf4aa71c4b43e5b5dfafe7d5a3e8228c05c5010e35f, form sha256 adf02ceb... matched. Worktree C:/dev/wt/lofi, target D:/wt-targets/lofi.

P-0 (throwaway test, deleted, porcelain empty after; DuckDB version() v1.5.5; base 2c72923e9046daa373d112e8e8d2f0f5a73e4fb1; no stop, no fallback):
- T1 rows 1-7 at base all TNA/ConversionRounds. Operand types: 1 `+` DOUBLE literal/INTEGER literal; 2 `-` same; 3 `*` INTEGER literal/DOUBLE literal; 4 `+` DOUBLE literal/BIGINT literal; 5 `-` DOUBLE literal/HUGEINT literal; 6 `+` DECIMAL(2,1) literal/DOUBLE literal; 7 `*` DOUBLE literal/DECIMAL(19,18) literal. Row 8 ADMITTED.
- typeof of all 8 nodes = DOUBLE. DuckDB ids: rows 2 and 7 `[]`; rows 1,3,4,5,6,8 all 13 ids (0..12); this equals section 3.
- T2 at base: 1 `+` LiteralOutOfBounds DOUBLE literal/HUGEINT literal; 2 `+` LiteralOutOfBounds DOUBLE literal/DECIMAL(20,19) literal (width recorded, not a stop); 3 `+` ConversionRounds DOUBLE literal/BIGINT; 4 `+` ConversionRounds DOUBLE literal/DECIMAL(2,1) expression (TNA, not binder); 5 `+` ConversionCanFail DECIMAL(2,1) literal/INTEGER literal.
- H-NEG: `-1e3 + 5 > 0` and `1e3 + -5 > 0` both refused TNA `+` DOUBLE literal/INTEGER literal ConversionRounds (folded to literals).

Commits (each -s, no @ outside the first trailer line):
- ad223091e06b179df06adebb7a00558d3c64fa30 "feat: literal-only-float-integer-arithmetic-refused, the admitting clause and the two docs written from it". Full engine suite after it: rc=0, 476 passed, 0 failed, 19 ignored.
- f2955007b11985f72e10c77712694149fd82f137 "test: ... T1 and T2 over FX-1". filter_type_admission binary: 6 passed, 0 failed.
- 2c5627a208cd0d71f122b2783b2d7cef3a687bde "docs: ... the recorded mutations and the owner's index pointers".

Clause and docs, byte-copied at head (engine/src/predicate.rs):
```
    if is_double_lit(l) && is_numeric_lit(r) {
        return Some(EngineType::Double);
    }
    if is_double_lit(r) && is_numeric_lit(l) {
        return Some(EngineType::Double);
    }
```
with its comment (pairs, DOUBLE result, bound test via is_numeric_lit, counted rule-2 result has expression kind so not admitted, ADR-021 Notes 2026-09-30 item 2 and 2026-10-03 item 2, FILTER-BIND 2.3/2.5(a); no path:line). admitted_arithmetic_result doc now: refuses outright a decimal literal beside an integer or decimal (O-5); a Decimal operand is admitted only by rule 2 (NULL beside numeric), rule 6 (float column beside within-bounds decimal literal) and the last branch. `sentence` doc's last clause now: "It is still false of a text literal beside a NULL literal in `+`, `-` or `*` (`'1' + NULL > 0`), which reaches this reason because the text reason excludes a NULL partner." (written from determine_reason and the rule-2 guard; the `-`/`*` forms were not run, they share the arm). W-1's string unchanged.

T1 asserts per row: admit Ok; drain_ids equals the predicted set (rows 2,7 none; others all 13); `i64 = (<node>)` refused TNA `=`, ["BIGINT","DOUBLE expression"], ConversionRounds; typeof = DOUBLE; then FX-1 sha. T2 rows as P-0's T2 list (row 2 as DECIMAL(20,19) literal), real TNA shape, FX-1 sha.

Mutations (each alone, debug build, applied to a clean tree at f2955007b11985f72e10c77712694149fd82f137, whole binary run, reverted via git checkout, predicate.rs sha256 eaed7ddf0e855907b1854b8d006fac282d692d916ab8fc596c6c1d289b760a32 equal to commit 2's):
- M-1 (clause removed): `test literal_only_arithmetic_with_a_double_literal_is_admitted_typed_double_and_streams ... FAILED`; `"1e3 + 5 > 0": expected admitted, got refused: `+` over DOUBLE literal and INTEGER literal: [P6 placeholder] ...`; `test result: FAILED. 5 passed; 1 failed`.
- M-2 (`|| r.counts_as_decimal_literal` / `|| l.counts_as_decimal_literal` added): `test literal_only_arithmetic_outside_the_double_literal_pairs_keeps_its_refusal ... FAILED`; `"1e3 + (NULL + 0.5) > 0": expected TypeNotAdmitted, got Ok(AdmittedPredicate { text: "1e3 + (NULL + 0.5) > 0", columns: [] })`; `test result: FAILED. 5 passed; 1 failed`. Both as section 4 predicts.
- Disclosure: my first M-2 launch ran on the unmutated tree (the Edit had failed on a not-yet-Read file); I killed it by its own PID (cargo.exe 8176 and test exe 46936, my children), it released its hold, no result used.

CI: product-ci-rust run 42141967861 on head 2c5627a208cd0d71f122b2783b2d7cef3a687bde: completed, success; jobs "L1 portable correctness / cargo test --workspace (ubuntu-24.04)" success, "cargo test --workspace (windows-latest)" success.

Checks at head: `cargo test -p spatial-engine --locked` rc=0, 478 passed 0 failed 19 ignored (51 result lines, last "test result: ok. 0 passed..."); `cargo clippy -p spatial-engine --locked --tests --no-deps` rc=0 (6 warnings, none from my lines; the one in filter_type_admission.rs is line 1169, d036c112c, not mine); `cargo fmt --all -- --check` rc=0; verify.mjs --offline rc=0 (PASS); verify-cites rc=0 (PASS); verify-quotes rc=0 (PASS, 138 checked); verify-test-claims rc=0 (PASS, 733 claimed tests).

Size (section 7 command, origin/main...HEAD): README 2/2, predicate.rs 22/5, filter_type_admission.rs 139/0 = 170 changed lines over 3 files against 150: OVERRUN of 20 lines, not trimmed; per the form this is class 8, its section 7 line not edited.

Stop rules: none met. No pub item, dependency, unsafe, user-visible string or code-comment path:line added; only the three Scope files touched. Deviation: commit 3 and the push ran in one Bash call (brief asked for the push as its own call). Origin branch equals HEAD (2c5627a2...), porcelain empty. Nothing off-scope done. Seam check: intra-module only (engine walk and its tests); no cross-module interface.

Hold lines (own project): "MACHINE_HOLD shared project=SpatialIDE cores=0-7 affinity=FF ..." and matching "MACHINE_RELEASED project=SpatialIDE ... affinity=FF (cores 0-7)" on every heavy run (P-0, suite x2, T1/T2 binary, M-1, M-2 (and the killed one), clippy); no exit code 96-99. verify-quotes ran outside a hold (node, not cargo). Background shells left: none (all my background commands exited; no PID left to kill). Model as the harness reports: Sonnet 5.5 (claude-sonnet-5-5), no override, no context handoff.

Pre-gate self-check: interface classes (intra-module, real producer admit/drain_ids, real TNA shape); completion claims each tied to a named test/run above; no user-facing message added; T1 and T2 reach their assertions (M-1/M-2 fail at the named rows, not at setup).
