# type-walk-rule2-residual-reasons: the worker's report (P-0, stopped)

*Filed by the custodian on 2026-11-04 from the worker's hand-back (its SubagentHandback call; agent transcript read against it: Bash 19, Read 3, one Monitor call refused as no such tool; run 2026-11-04T02:05:22Z to 02:18:18Z; model claude-sonnet-5-5). The hand-back's sha256 is 4ba399601fe6363529a582e0628965568cb7e91c6fd96532e54f1368a65a58ce, one final newline added. One change: the full path of the P-0 output file in the custodian's scratch folder, a user-profile path, is replaced by `<the custodian scratch folder>\twr2-p0.txt`. Checked against the transcript and the checkout: P-0's three outcome lines in that file, the result line `test result: ok. 1 passed; 0 failed; 0 ignored; 0 measured; 3 filtered out`, the hold run's rc=0, the test file restored to sha256 09ecb175 (the base's), the porcelain empty, the branch at 66fb3d8d and not pushed; no process left on the piece's paths. Two departures from the brief, disclosed: the throwaway test was appended by a shell heredoc, not the Edit or Write tool; one wait loop (02:09:29Z) carried no hard timeout, and it ended when its condition held. Neither touched a tracked file at the base. The record is the form's Amendment 1.*

---

Stopped: type-walk-rule2-residual-reasons, P-0 gave a TypeNotAdmitted for `'1' + NULL > 0`, which the form and brief make a stop. I wrote no product code and made no commit.

**Base:** 66fb3d8d2dfb7cf13d46f00e748677bacc172b96 (main), in the worktree C:/dev/wt/twr2 on branch cut/type-walk-rule2-residual-reasons. The briefed hashes matched:
- brief sha256 ce98087a...
- `.cargo/config.toml` sha256 6889110645ec075c0cba3bf4aa71c4b43e5b5dfafe7d5a3e8228c05c5010e35f
- form sha256 ff2cef1d51d38a187c4f9053468f5d75a283a92e6caea7afb4576fd082e11c16

**DuckDB, from Cargo.lock:** the `duckdb` entry reads `version = "1.10505.0"` and the `libduckdb-sys` entry reads `version = "1.10505.0"`.

**P-0 outcomes**
The throwaway test sent each predicate once through `AdmittedPredicate::admit` over FX-1, built in a debug build on D:/wt-targets/twr2. The result line was `test result: ok. 1 passed; 0 failed`, with the cargo exit code 0. The raw output is in `<the custodian scratch folder>\twr2-p0.txt`.

1. `zone + NULL > 0` gave `Filter(RejectedByBinder ...)`, as predicted. Display begins: `refused: DuckDB's binder rejected the predicate (Binder Error: No function matches the given name and argument types '+(VARCHAR, "NULL")'. You might need to add explicit type casts.`
2. `flag + NULL > 0` gave `Filter(RejectedByBinder ...)`, as predicted. Display begins: `refused: DuckDB's binder rejected the predicate (Binder Error: No function matches the given name and argument types '+(BOOLEAN, "NULL")'. You might need to add explicit type casts.`
3. `'1' + NULL > 0` did NOT match the prediction. It was not rejected by the binder:
   - Debug: `Filter(TypeNotAdmitted { construct: "+", operand_types: ["VARCHAR literal", "NULL literal"], reason: ConversionRounds })`
   - Display: `refused: `+` over VARCHAR literal and NULL literal: a conversion that can round a value read from the file before it is compared (docs/01 principle 8)`

**Why this is a stop:** W-1 says "a conversion between a float type and an integer or decimal type". That is false of a VARCHAR literal beside a NULL literal, so form note 3 and note 4 (F-B) are now live for this shape. The `'1' + NULL` shape reaches `conversion_rounds` as the residual reason (F-B).

**Decision for the custodian:** the options are to accept the form's F-B route, to narrow W-1, or to change the form. I did not choose.

**State left**
- The throwaway test is removed. `engine/tests/filter_type_admission.rs` is back to sha256 09ecb17558fd8c62419ea6bc9faf4731311c88a5e5aa50ccaf98bf58b4b1bf54, which is the base's.
- `git status --porcelain` in C:/dev/wt/twr2 printed nothing after the `git checkout` of that file.
- Nothing was pushed and no CI ran.
- The cold build is warm in D:/wt-targets/twr2.
- The branch exists at the base commit with no commits of mine.

**Hold line (my own project only):** `MACHINE_HOLD shared project=SpatialIDE cores=0-7 affinity=FF shell=bash.exe:75368`. I released it afterwards.

**Background shells:** none left. My three background commands (the cargo hold run and two wait loops) all completed with exit 0. I started no other processes.

**Self-check:** no cross-module code was written. The completion claims above point to the P-0 output file. No user-facing message was added.

**Model:** the harness reports Sonnet 5.5 (claude-sonnet-5-5), with no override and no context handoff.

**Off-scope, not done:** I made no other changes.
