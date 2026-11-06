Reviewed: PR #284 at 2c5627a208cd0d71f122b2783b2d7cef3a687bde (base 2c72923e), gate 1, reviewer
Branch: cut/literal-only-float-integer-arithmetic-refused @ 2c5627a208cd0d71f122b2783b2d7cef3a687bde
Verdict: PASS WITH NOTES (WORDS-ONLY)

The brief (sha256 4efa6d34…af2a, 9950 bytes) and the packet (sha256 ea87caff…a546, 26563 bytes) both matched. I read the rulings directive (Part 1, items 1 to 9) and the whole form.

## Correctness
None. The clause meets §2.1 and §8 (check 1). M-1 and M-2 failed as predicted when I ran them myself (check 3).

## Evidence
None blocking. One thing for the custodian under THE MACHINE rule: `lod_tier_builder` failed in both of my shared suite runs (details in check 2). This piece does not touch that file. I am not recording it as a failure; it needs a re-run with nothing else on the machine.

## Documentation (sentences under §2.3; none is the human's wording; each must be fixed before the merge; the worker applies the words without a re-gate and the PR body lists them)

**D-1. `TypeRefusalReason::sentence`'s doc, its new last clause (predicate.rs:1438-1440).**
- Requirement: form §2.3 item 1 says the sentence must name only cases W-1 is still false of at the head. Item 1 of the rulings says the gate checks it clause by clause.
- Evidence: in my export probe at the head, through the real `admit`:
  - `'1' + NULL > 0` and `'1' - NULL > 0` (and `NULL + '1' > 0`) were refused `TypeNotAdmitted`, operand types `VARCHAR literal` and `NULL literal`, reason `ConversionRounds`.
  - `'1' * NULL > 0` returned `RejectedByBinder` ("Could not choose a best candidate function for the function call \"*(STRING_LITERAL, \"NULL\")\""). It never reaches the walk, because `bind_admit` (:189) runs before `type_walk` (:195).
  - So "in `+`, `-` or `*`" is false for `*`.
- Closure, these words replace the sentence "It is still false of … NULL partner.":
  > It is still false of a text literal beside a NULL literal in `+` or `-` (`'1' + NULL > 0`), which reaches this reason because the text reason excludes a NULL partner; at DuckDB v1.5.5 the binder refuses the `*` form (`'1' * NULL > 0`) before the walk runs.
- Clause check:
  - "still false of … `+` or `-`": the probe shows the two TNA results above. W-1 names a float type, and neither operand has one.
  - "text reason excludes a NULL partner": `determine_reason` :2285-2286 has `!is_null`, and so does the boolean test at :2290-2291. VARCHAR and NULL literals are within bounds (`Typed` doc :1510-1513), so the pair falls to :2318. Rule 2 does not admit it because it is guarded by `is_numeric` (:2083-2088).
  - "at v1.5.5 the binder refuses `*` before the walk": the probe gives `RejectedByBinder`, and the order is :189 then :195. The version is the form's §0 item 3, and Cargo.lock is unchanged in the diff.
  - An operator can reach this: the `*` form is typed in the ordinary filter panel.

**D-2. `admitted_arithmetic_result`'s doc (:2040-2043).**
- Requirement: form §2.3 item 2 ("which branches can admit a `Decimal` operand"), checked clause by clause.
- Evidence: rule 6's `is_float_col` (:2046-2048) is REAL or DOUBLE with `kind != Literal`, so it covers expressions as well as columns. In my probe:
  - `(f32 * 2) + 0.5 > 0` and `(f64 + 1) * 0.5 > 0` were admitted.
  - `i64 = ((f32 * 2) + 0.5)` was refused with operand types `BIGINT` and `REAL expression`, which shows rule 6 admitted a decimal literal beside a float expression.
  - So "a float column beside …" is too narrow, and "Any other pair with a `Decimal` operand falls through to `None`" is false as worded.
- Closure: replace "a float column beside a within-bounds decimal literal (rule 6)" with
  > a REAL or DOUBLE column or expression beside a within-bounds decimal literal (rule 6)
- Clause check:
  - :2046-2048 as above, and the probe.
  - The other branches cannot admit a `Decimal`: rule 1 (:2070) is REAL/DOUBLE only; rule 3 is `is_int`; rule 7 and rule 5 use `int_le` or float types (:2111-2143); NULL beside NULL gives BIGINT.
  - The last branch needs `is_double_lit` beside `is_numeric_lit`, which requires kind literal and the within-bounds flag. With the change, the doc's final sentence is true.
  - The rest of the doc holds. O-5's pairs are admitted by no branch. Rule 2 admits NULL beside any numeric operand (:2083-2088, `is_numeric` :1582).

**D-3. The new clause's comment (:2144-2150): its cites have no paths.**
- Requirement: form §2.3 item 3, "its governing cites, by path and section".
- Evidence: the comment writes "ADR-021's Note …" and "FILTER-BIND section 2.3". It is the only place in the file that uses the "FILTER-BIND" shorthand; :1385 and :2964 use the file name.
- Closure: replace "(ADR-021's Note 2026-09-30, item 2; FILTER-BIND section 2.3, rule 6's second clause, applied pairwise by section 2.5(a))" with
  > (`docs/adr/ADR-021-row-filter-on-viewport-query.md`, Note 2026-09-30, item 2; `FILTER-BIND-COERCIONS-PREREGISTRATION.md` section 2.3, rule 6's second clause, applied pairwise by its section 2.5(a))

  and "(ADR-021's Note 2026-10-03, item 2)" with
  > (`docs/adr/ADR-021-row-filter-on-viewport-query.md`, Note 2026-10-03, item 2)
- Clause check: both paths exist at the head. The ADR has "## Note 2026-09-30" at :244 and "## Note 2026-10-03" at :269. The FILTER-BIND form is at `governance/forms/engine/`, and the file name alone is the file's own convention.

The rest of the clause's comment checks out against the code:
- the admitted pairs and DOUBLE (:2151-2156; rule 1 catches DOUBLE beside DOUBLE first);
- the bound test leaves `LiteralOutOfBounds` (:2295-2296, T2 rows 1-2);
- a counted rule-2 result has the expression kind (`Typed::expression` at :2022) and is not admitted (T2 row 4, M-2).

**Notes (no acceptance condition)**
- N-1. The size is 170 changed lines against §7's 150 (numstat 2/2, 22/5, 139/0). The closing amendment records it as class 8, and §7's line stays as it is (Round 25 rule).
- N-2. The hand-back says clippy gave 6 warnings. My run gave many more across the lib and test targets (the lib alone 3). None is at a changed line: the predicate.rs changes are at :1438-1440, :2037-2043 and :2144-2156, and the test file's only warning is at :1169, outside the new :632-770.

## Checks

**1. Diff.**
- `git diff --numstat 2c72923e...2c5627a2` rc 0, three files, all in Scope. `git diff` rc 0, byte-equal to the packet's diff (`cmp` rc 0).
- One clause, both operand orders, placed last (:2151-2156). It tests `is_double_lit` beside `is_numeric_lit`, which is kind literal plus `within_bounds` plus an integer, decimal or double type. It never reads `counts_as_decimal_literal`. It returns DOUBLE.
- Every deleted line in predicate.rs is `///` doc. The W-1 string (:1449-1451) is byte-equal to the base's. No other arm, rule, precedence or Display changed. No `pub` line was added (grep rc 1).
- Bytes:
  - CR: 0 in each head file and in the diff, counted with `tr` (grep cannot see CR here; self-test confirmed).
  - Tab: 0 (grep rc 1, self-test rc 0).
  - Every file ends in LF; no "No newline" marker.
  - Non-ASCII: one added README line, the pre-existing `§2a` (the base and head counts are equal, 133 each).

**2. Suite at the head, in the worktree, on `D:/wt-targets/lofi`, shared holds, `timeout 1800`.**
- Run 1, `cargo test -p spatial-engine --locked`: rc 101.
  - `filter_type_admission` passed 6/6, with T1, T2, B-T1 (`the_type_walk_agrees_with_the_binder_over_the_p0_matrix`), B-T2, B-T3 and 8b's T1 by name.
  - `admission_property_campaign` passed 4.
  - The run stopped at `lod_tier_builder`, 6 failed with NotFound under the machine-wide `%LOCALAPPDATA%/spatial-ide/tiers/<hash>`, because cargo stops at the first failing binary.
- Run 2, the same command plus `--no-fail-fast` (my deviation, made to get every binary's result): rc 101.
  - 51 result lines: 477 passed, 1 failed, 19 ignored.
  - The one failure is `lod_tier_builder::tier_build_emits_zero_invalid_polygons`: "open for geometry: Os { code: 3, kind: NotFound … }".
  - That test file clears the shared tier directory before it builds (`clear_tier_directory`, lod_tier_builder.rs:87-96).
  - Another SpatialIDE hold was active during both runs.
  - 477+1 equals the custodian's 478 at the head. Not recorded as a failure; it goes to the custodian for a re-run with nothing else on the machine.
  - B-T1b (`predicate::tests`), the campaign tests and every `filter_type_admission` test passed.
- `cargo fmt --all -- --check`: rc 0, no output.
- `cargo clippy -p spatial-engine --locked --tests --no-deps`: rc 0, no warning at a changed line (N-2).

**3. M-1 and M-2, my own runs.**
- The export: `git archive 2c5627a2`, unpacked with `tar --force-local`. Head predicate.rs sha256 eaed7ddf0e855907b1854b8d006fac282d692d916ab8fc596c6c1d289b760a32.
- Cold build of `--test filter_type_admission --no-run`: rc 0, 10m 46s, run with no timeout as the brief asked.
- M-1, lines 2144-2156 removed (sha256 e4f388f7…): rc 101.
  - T1 FAILED at filter_type_admission.rs:675: `"1e3 + 5 > 0": expected admitted, got refused: `+` over DOUBLE literal and INTEGER literal: [P6 placeholder] …`.
  - "5 passed; 1 failed". The file was restored to eaed7ddf….
- M-2, `|| r.counts_as_decimal_literal` and `|| l.counts_as_decimal_literal` added (sha256 c26adda3…): rc 101.
  - T2 FAILED at :764: `"1e3 + (NULL + 0.5) > 0": expected TypeNotAdmitted, got Ok(AdmittedPredicate { text: "1e3 + (NULL + 0.5) > 0", columns: [] })`.
  - "5 passed; 1 failed". The file was restored to eaed7ddf….

**4. Tests' soundness.**
- Both tests drive the real `AdmittedPredicate::admit` on FX-1 and match the real `PredicateAdmitError::Filter(FilterError::TypeNotAdmitted { construct, operand_types, reason })`.
- T1's eight rows match §3 in all four parts: the ids through the real `drain_ids`, compared with all or none; `i64 = (<a>)` refused with `=`, `BIGINT`/`DOUBLE expression` and `ConversionRounds`; `typeof` DOUBLE on `configured_connection`; then FX-1's sha256.
- T2's five rows match §3, with row 2 as `DECIMAL(20,19) literal` as recorded (packet §5 item 5, class 2).
- No sleep, retry, timeout, `#[ignore]` or `cfg` (grep rc 1).
- The only state shared with other tests is the file's read-only, hash-checked FX-1 `OnceLock` (form §3).
- Each `RECORDED MUTATION:` line names its mutation and commit f2955007…. Each claims only the run and the named failure, both of which my runs reproduce.

**5. §2.3 sentences.** D-1, D-2 and D-3 above. The probe ran in my export as a scratch test file that was never committed. Probe 1 rc 0 and probe 2 rc 0, with the outputs quoted above.

**6. Verify scripts in the worktree.**
- `verify.mjs --offline` rc 0.
- `verify-cites.mjs` rc 0.
- `verify-quotes.mjs` rc 0 (138 checked, 0 hash-reference errors).
- `verify-test-claims.mjs` rc 0.
- CI: `gh pr checks 284` gave rc 8 at the time I read it (one job pending). `gh run view` rc 0 for all twelve runs, each with headSha 2c5627a208cd0d71f122b2783b2d7cef3a687bde. The pending run 42147392471 (Product CI, Rust workspace) was re-read as completed success, updatedAt 2026-11-06T02:20:05Z. Every run completed success; read at 2026-11-06T03:04Z.

## Packet's gaps
- It did not say that `lod_tier_builder` uses a machine-wide `%LOCALAPPDATA%` tier directory, or that another SpatialIDE suite might run during the gate.
- It did not give the order of the stages inside `admit` (binder before walk), which was needed to judge D-1's `*` clause. I read it from the code.
- The hand-back's clippy "6 warnings" came without their locations, so I matched by changed lines instead.

## Holds (mine; `also=` elided)
Each was granted and then released (MACHINE_RELEASED printed): bash.exe:63484 (suite 1), 42064 (suite 2), 74236 (export build), 45316 (M-1), 67608 (M-2), 49388 (probe 1), 59048 (probe 2), 80404 (clippy).

## Cleanup
- Background shells: none left running. All seven background tasks finished and notified, and `tasklist` shows no test process.
- The worktree's porcelain is empty and HEAD is 2c5627a2.
- `D:/wt-targets/lofi-g1r-export` and `D:/wt-targets/lofi-g1r-target` were removed (rm rc 0; `ls` reports neither exists).
- Scratch files are under `<the session scratch folder>/lofi-g1r-*`. The logs are `lofi-g1r-suite.log`, `lofi-g1r-suite2.log`, `lofi-g1r-m1.log`, `lofi-g1r-m2.log`, `lofi-g1r-probe.log`, `lofi-g1r-probe2.log` and `lofi-g1r-clippy.log`.
