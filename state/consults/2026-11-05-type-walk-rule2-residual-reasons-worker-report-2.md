*Custodian's filing note (2026-11-05): the worker's second report for type-walk-rule2-residual-reasons (the form `governance/forms/engine/TYPE-WALK-RULE2-RESIDUAL-REASONS-PREREGISTRATION.md`; the first report, P-0's stop, is `state/consults/2026-11-04-type-walk-rule2-residual-reasons-worker-report.md`), resumed under route (A) by the human's ruling of 2026-11-05 (the form's Amendment 2), built at ae4d94d4e463a4b213f3ecaeb98bc09ba3d92ec2 on its branch. The run 16:17:38.199Z to 17:19:47.669Z by its transcript (claude-sonnet-5-5; unique calls Bash 49, Read 5, Edit 6 and the hand-back), its engine suite, clippy and format runs at the head backed by calls in that transcript. Extracted by script from the hand-back message in that transcript (6127 bytes, sha256 b3c13ccd2ba275708857c68a3c5023dda5117d0c281580b08dee033a405b0c70). One change: a path-and-line cite the report repeats from `verify-quotes.mjs`'s advisory, to a form at its path before governance piece F moved it, is written as the path and then the word line with the number, so that `verify-cites.mjs` does not gate it as a cite on main; nothing else is changed. Under Part 1 item 4 of the human's rulings of 2026-11-05 the custodian read it before the gates: its disclosures name no unfixed sibling and no gap in the change, so none went back to the worker; they are in the review packet with their dispositions, beside one finding the custodian made at assembly (two comments name the form at a path it never had). A report, not Authority.*

---

Built: type-walk-rule2-residual-reasons at ae4d94d4e463a4b213f3ecaeb98bc09ba3d92ec2 (pushed; origin/cut/type-walk-rule2-residual-reasons equals HEAD; porcelain empty)

Start: checkout C:/dev/wt/twr2 HEAD 4009a97ec0bbe3d7d2f457a03acbe7f8b15f85ae, porcelain empty. .cargo/config.toml sha256 6889110645ec... matched. Brief sha256 1d230fce... matched. Form sha256 7c41896f... matched.

Commits:
- d2525326310fcf81609e395dcfa525fca43a16f9: "engine: type-walk-rule2-residual-reasons, the ConversionRounds sentence states the type pair"
- 853b5da6ff574f48e913e07e14e66c982738e07b: "engine: type-walk-rule2-residual-reasons, T1 states every ConversionRounds refusal's construct, types and sentence"
- ae4d94d4e463a4b213f3ecaeb98bc09ba3d92ec2: "engine: type-walk-rule2-residual-reasons, M-1's RECORDED MUTATION line on T1"
Each message file had exactly one `@`, in the first trailer line.

predicate.rs change:
- The `ConversionRounds` arm is at lines 1446-1449 and returns W-1. The string is split with a `\` continuation and the join keeps one space.
- The doc comment on `sentence` starts at line 1430 and is W-2. I diffed W-2 against form lines 73-80 and W-1 against form line 56, both with the leading `> ` cut: diff rc 0, both byte-identical.
- Nothing else in the file changed.

T1 `every_conversion_rounds_refusal_states_a_conversion_refused_by_type` (filter_type_admission.rs:569). All eleven rows passed at the base as note 1 gave them, so no class-2 result:
1. `f32 > NULL + 100000`: `>`, [REAL, INTEGER expression]
2. `f32 > NULL + i32`: `>`, [REAL, INTEGER expression]
3. `f64 > NULL + i64`: `>`, [DOUBLE, BIGINT expression]
4. `1e3 > NULL + i64`: `>`, [DOUBLE literal, BIGINT expression]
5. `f32 > NULL * NULL`: `>`, [REAL, BIGINT expression]
6. `f64 > -NULL`: `>`, [DOUBLE, BIGINT expression]
7. `f32 + -NULL > 0`: `+`, [REAL, BIGINT expression]
8. `(NULL - 0.5) + f32 > 0`: `+`, [DECIMAL(2,1) expression, REAL]
9. `i32 = f32`: `=`, [INTEGER, REAL]
10. `i64 = 1e3`: `=`, [BIGINT, DOUBLE literal]
11. `i32 + f32 > 0`: `+`, [INTEGER, REAL]
Each row also asserts reason `ConversionRounds` and a Display equal to "refused: `{construct}` over {types joined by ' and '}: {W-1} (docs/01 principle 8)". The format is lines 382-387 of predicate.rs.

M-1: observed at 853b5da6ff574f48e913e07e14e66c982738e07b in a debug build. I restored the arm to T-C's sentence (directive line 57, as base line 1442 carried it) and ran the whole `filter_type_admission` binary. The binary result line is "test result: FAILED. 3 passed; 1 failed; 0 ignored; 0 measured; 0 filtered out; finished in 179.84s". The failing lines, byte-copied:
```
test every_conversion_rounds_refusal_states_a_conversion_refused_by_type ... FAILED
thread 'every_conversion_rounds_refusal_states_a_conversion_refused_by_type' (41384) panicked at engine\tests\filter_type_admission.rs:613:9:
assertion `left == right` failed: "f32 > NULL + 100000": Display
  left: "refused: `>` over REAL and INTEGER expression: a conversion that can round a value read from the file before it is compared (docs/01 principle 8)"
```
The other three tests passed. I reverted with `git checkout`. predicate.rs sha256 is a0f6957452700f005e27917022013dc91c136c8af89ed89c62c6865fcc4b6fef both before the mutation (commit 2) and after the revert. Commit 3 records this by name and commit, and claims only that run.

Tests:
- Commit 1: `cargo test -p spatial-engine --locked` rc 0, no test changed outcome.
- Commit 2: `--test filter_type_admission`, "test result: ok. 4 passed; 0 failed; ... finished in 205.11s".
- At head: `cargo test -p spatial-engine --locked` rc 0, 51 "test result: ok" lines and no FAILED.
- Clippy: `cargo clippy -p spatial-engine --locked --tests --no-deps` rc 0. For the Scope files it prints one warning, `redundant pattern matching` at filter_type_admission.rs:1030, on `if let Some(_) = int_info(from)`. Blame shows commit d036c112c, not mine.

CI: product-ci-rust run 42069011049, head ae4d94d4e463a4b213f3ecaeb98bc09ba3d92ec2, status completed, conclusion success. Jobs: "L1 portable correctness · cargo test --workspace (ubuntu-24.04)" success; "cargo test --workspace (windows-latest)" success.

Checks at head:
- `cargo fmt --all -- --check`: rc 0.
- `node scripts/plan/verify.mjs --offline`: rc 0, "verify:plan PASS".
- `verify-cites.mjs`: rc 0, PASS (131 loose references advised).
- `verify-quotes.mjs` on the two changed files: rc 0, PASS with 0 checked; it advises on engine/LOD-PREREGISTRATION.md line 545, which I did not touch.
- `verify-test-claims.mjs`: rc 0, PASS (729 claimed tests).
- Size: `git diff --numstat origin/main...HEAD` shows predicate.rs 10/4 and filter_type_admission.rs 75/0, so 89 against the Scope's 130, within budget.

Self-check, the four failure classes:
- Interface: T1 calls the real `AdmittedPredicate::admit` and matches the real `FilterError::TypeNotAdmitted`, and its Display is the base's own format (predicate.rs 382-387). No cross-module seam is touched.
- Completion claims: each has a call behind it, in the logs under my scratch folder.
- User-facing message: W-1 is the only new string, and it describes behaviour implemented at the base.
- Required tests: T1 reaches its Display assertion on every row, and M-1 failed at that assertion.

Disclosures:
- No stop rule was met.
- I did not run P-0, and T1 has no text-operand row.
- T1 sits between B-T3 and `campaign_code_of`, so `campaign_code_of`'s doc still follows its own function, and B-T3 and the other tests are unchanged.
- No new `pub` item and no file outside the Scope.
- No cross-module caller grep applies.

Holds: four shared holds under -Project SpatialIDE (cargo test commit 1, cargo test filter_type_admission commit 2, the M-1 run, cargo test plus clippy at head), all granted and released with no refusal. Each hold line read "MACHINE_HOLD shared project=SpatialIDE cores=0-7 affinity=FF ...", with the `also=` segment elided.

Background shells: my wait-loop shells and the hold-wrapped commands all exited on their own, so none is left running.

Model: Sonnet 5.5 (claude-sonnet-5-5), no override, and no context handoff received or produced.
