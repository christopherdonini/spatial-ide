*Custodian's filing note (2026-11-06): the worker's continuation report for `arithmetic-text-literal-beside-null-reason` (filler entry 8d; the five-line form `governance/forms/engine/ARITHMETIC-TEXT-LITERAL-BESIDE-NULL-REASON-PREREGISTRATION.md`, under its Amendment 1), extracted by script from its second SubagentHandback call, unchanged. Unique calls in the continuation 67, equal to the notification's (Bash 47, Edit 11, Read 4, Write 4); run 2026-11-06T05:46:11Z to 2026-11-06T07:22:03Z by its transcript. Its claimed runs were read against its scratch logs: the full engine suite at the head 51 result lines, 479 passed, 0 failed; M-1 6 passed, 1 failed; M-2 5 passed, 2 failed. The branch's head and numstat and its CI (5 runs on the head, each success) were read by the custodian. One disclosure is the worker's own: its push ran in the same call as its third commit, where the brief asked for its own call. The earlier stop report is `state/consults/2026-11-06-arithmetic-text-literal-beside-null-reason-worker-report.md`. A report, not Authority.*

---

Built: arithmetic-text-literal-beside-null-reason at 29f13158574d61a2c857a083011c23135716cb74 (pushed; origin's branch equals HEAD; porcelain empty). Continuation 1 under Amendment 1 (brief-atln-2 sha256 bd24c257... matched; the form at 78220373982b6ccd2a72f9687c8bcf682f0107f5 had sha256 50fe45bb... as the message gave). The checkout stayed at base 0c84b816 with porcelain empty until step 3.

**P-0:** not re-run; the record is the earlier Stopped report. The base grep had no hit, and S-5 was settled by Amendment 1. T1's rows are K1, K2, K3, A2, then the two controls.

**Commits (each signed off, `-s`)**
- 06ab051a `feat: arithmetic-text-literal-beside-null-reason, the code: ...` (engine/src/predicate.rs only, 39+/10-). The full engine suite passed at this commit: rc=0, 478 tests, 0 failed.
- ce5afff5 `test: ..., T1: every ConversionRounds refusal over a text or BOOLEAN operand carries its own sentence` (engine/tests/filter_type_admission.rs only). The `filter_type_admission` binary: 7 passed, 0 failed.
- 29f13158 `test: ..., T1's two RECORDED MUTATION lines (M-1, M-2), each observed at the test commit` (doc lines only).

**Code, byte-copied at head (engine/src/predicate.rs)**
- The call in the `TypeNotAdmitted` arm is now `reason.sentence(operand_types),`. The format string is unchanged.
- `fn sentence(self, operand_types: &[String]) -> &'static str` has a new arm before the W-1 arm, which is unchanged: `Self::ConversionRounds if names_text_or_boolean(operand_types) => {` returning "[P6 placeholder] an operand of text or BOOLEAN type beside NULL or beside an operand of its own type, refused by type".
- The selector is `fn names_text_or_boolean(operand_types: &[String]) -> bool { operand_types.iter().any(|t| matches!(t.split(' ').next(), Some("VARCHAR" | "BOOLEAN"))) }`.
- `sentence`'s doc and the selector's comment are at engine/src/predicate.rs from line 1430 on.
- The selector's comment states duckdb and libduckdb-sys 1.10505.0 (Cargo.lock), keeps the binder-refused rows and the `ConstructNotAdmitted` (`CAST`) rows apart, and says no probed predicate brings a BOOLEAN operand to the walk, so the BOOLEAN arm is by reading.
- The enum doc and the `ConversionRounds` variant doc were checked and left, since both stay true.

**T1 rows as asserted** (all `ConversionRounds`; Display equals the 382-387 format, with the new sentence on the first four rows and W-1 on the controls)
- `'1' + NULL > 0`: `+`, ["VARCHAR literal","NULL literal"].
- `'1' - NULL > 0`: `-`, ["VARCHAR literal","NULL literal"].
- `NULL + '1' > 0`: `+`, ["NULL literal","VARCHAR literal"].
- `NULL / '1' > 0`: `/`, ["NULL literal","VARCHAR literal"].
- `f32 > NULL + 100000`: `>`, ["REAL","INTEGER expression"].
- `i32 + f32 > 0`: `+`, ["INTEGER","REAL"].
- T1 ends with FX-1's sha256 check.

**Mutations** (each alone, debug build, observed at ce5afff5d863d088741050c270afa0c10ff617aa, whole binary run; predicate.rs restored to sha256 07a51c910d272c5a812dca5b902948cd74e0a0e720523ed1c390ba74704bcd47, equal to commit 2's)
- M-1 (guard made `if false && names_text_or_boolean(..)`): rc=101, `6 passed; 1 failed`. The failing lines are byte-copied from the run log.
  - `assertion `left == right` failed: "'1' + NULL > 0": Display`
  - `at engine\tests\filter_type_admission.rs:703:9`
  - left was the W-1 text, right the new sentence.
  - `test result: FAILED. 6 passed; 1 failed; 0 ignored; 0 measured; 0 filtered out; finished in 567.91s`
- M-2 (guard made `if true || names_text_or_boolean(..)`): rc=101, `5 passed; 2 failed`. Two failures, as predicted.
  - `every_conversion_rounds_refusal_states_a_conversion_refused_by_type`, panicked at engine\tests\filter_type_admission.rs:619:9: `"f32 > NULL + 100000": Display`.
  - T1, panicked at engine\tests\filter_type_admission.rs:703:9: `"f32 > NULL + 100000": Display`.
  - `test result: FAILED. 5 passed; 2 failed; 0 ignored; 0 measured; 0 filtered out; finished in 194.84s`
- Both mutations are recorded as `RECORDED MUTATION` doc lines on T1 in commit 29f13158.

**CI:** product-ci-rust run 42177516201, head 29f13158574d61a2c857a083011c23135716cb74, completed with conclusion success. Jobs: `cargo test --workspace (windows-latest)` success; `L1 portable correctness · cargo test --workspace (ubuntu-24.04)` success.

**Checks at head**
- Full engine suite: rc=0, 479 passed, 0 failed.
- `cargo clippy -p spatial-engine --locked --tests --no-deps`: rc=0. Its warnings are all in other files (rowgroup.rs, stream.rs, publish_stream, identity and others); none is in the two files I touched.
- `cargo fmt --all -- --check`: rc=0.
- `node scripts/plan/verify.mjs --offline`: rc=0, PASS.
- `verify-cites.mjs`: rc=0, PASS.
- `verify-quotes.mjs` over the two changed files: rc=0, PASS.
- `verify-test-claims.mjs`: rc=0, PASS (738 claimed tests).
- Size: `git diff --shortstat 0c84b816...HEAD` gives 2 files changed, 137 insertions(+), 10 deletions(-), which is 147 lines against the declared 140. Numstat: predicate.rs 39/10, filter_type_admission.rs 98/0. This is an overrun of 7 lines, class 6 (a full-form §7 overrun is class 8). I left it, as instructed.

**Disclosures**
- I pushed in the same Bash call as commit 3, not in its own call as the brief says. The result is the same.
- Hold lines (my project only): `MACHINE_HOLD shared project=SpatialIDE cores=0-7 affinity=FF` / `MACHINE_RELEASED project=SpatialIDE`. No hold refusal. Every cargo call ran inside a shared hold.
- No other stop rule was met. No PR action. No new `pub` item, no change to W-1 or the format string, and no path:line cite in code comments.
- Background shells: none left running. Every wait loop and cargo run exited and notified.
- Model: Sonnet 5.5 (claude-sonnet-5-5), no override; the continuation was given as a brief file, no context handoff.

**Self-check:**
- Cross-module code: none; the kernel builds `TypeNotAdmitted` by struct literal and is untouched.
- Completion claims: each is backed by a run in this transcript.
- User-visible message: the one new placeholder sentence, which is true of every pair the selector routes.
- Required tests reached their intended assertions: M-1 and M-2 failed at the Display assertions, not at setup.
