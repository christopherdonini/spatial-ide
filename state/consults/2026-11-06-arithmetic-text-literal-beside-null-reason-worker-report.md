*Custodian's filing note (2026-11-06): the worker's stop report for `arithmetic-text-literal-beside-null-reason` (filler entry 8d; the five-line form `governance/forms/engine/ARITHMETIC-TEXT-LITERAL-BESIDE-NULL-REASON-PREREGISTRATION.md`), extracted by script from its SubagentHandback call, with one change: the scratch-folder path of its P-0 log is written `<scratch>/`. Unique calls 35, equal to the notification's; run 2026-11-06T05:33:33Z to 2026-11-06T05:46:11Z by its transcript. The P-0 log's 28 outcome lines were read against the report's. Settled by the form's Amendment 1. A report, not Authority.*

---

Stopped: arithmetic-text-literal-beside-null-reason, S-5 met at P-0 (the form's section 1). Eight of the 28 probe predicates returned an outcome that is neither RejectedByBinder nor TypeNotAdmitted. No code, commit, push or PR was done.

**Start state**
- Checkout C:/dev/wt/atln, branch cut/arithmetic-text-literal-beside-null-reason, HEAD 0c84b816416bc1611649cf91415d9fc69f3693a6.
- Porcelain empty. .cargo/config.toml sha256 6889110645ec075c0cba3bf4aa71c4b43e5b5dfafe7d5a3e8228c05c5010e35f, equal to the brief's.
- Brief sha256 matched (41c3de38...). The form's sha256 matched (ef5230ce...).

**Base grep (step 1), run at the base**
- `grep -rn 'can round' engine/tests kernel`: rc=0, one hit, engine/tests/filter_type_admission.rs:573. It is 8b's T1, whose rows name no VARCHAR or BOOLEAN operand.
- `grep -rn 'ConversionRounds' engine/tests kernel`: rc=0, hits all in engine/tests/filter_type_admission.rs (lines 215-217, 258, 333, 338, 559, 563, 613, 694, 711, 724, 740, 745).
  - I read lines 555-632 and 670-760.
  - Lines 613 and 694 assert the reason, not a Display; the other hits are reason-only tables or doc text.
  - The only Display assertions in the file are 8b's T1 (line 620), which has no text or BOOLEAN operand, and C25's prefix check (lines 516-528), which is a `RejectedByBinder` Display.
  - No hit asserts a text or BOOLEAN `conversion_rounds` Display, so there is no stop here.
- `grep -rn 'conversion_rounds' engine/tests kernel`: rc=0, one hit, the test name at line 569. kernel/ has no hits for any of the three.

**P-0 record**
- Run at the base commit 0c84b816416bc1611649cf91415d9fc69f3693a6 on D:/wt-targets/atln, debug build, inside a shared hold, rc=0.
- Cargo.lock: duckdb 1.10505.0, libduckdb-sys 1.10505.0.
- Result line: `test result: ok. 1 passed; 0 failed; 0 ignored; 0 measured; 6 filtered out; finished in 0.67s`.
- All 28 outcomes:
  - K1 `'1' + NULL > 0`: TypeNotAdmitted, `+`, ["VARCHAR literal","NULL literal"], ConversionRounds, Display ends with W-1.
  - K2 `'1' - NULL > 0`: TypeNotAdmitted, `-`, same operand types, ConversionRounds.
  - K3 `NULL + '1' > 0`: TypeNotAdmitted, `+`, ["NULL literal","VARCHAR literal"], ConversionRounds.
  - K4 `'1' * NULL > 0`: RejectedByBinder, "Could not choose a best candidate function for the function call "*(STRING_LITERAL, "NULL")"".
  - A1 `'1' / NULL > 0`: RejectedByBinder, same message shape with `/`.
  - A2 `NULL / '1' > 0`: TypeNotAdmitted, `/`, ["NULL literal","VARCHAR literal"], ConversionRounds.
  - A3 `zone / NULL > 0`: RejectedByBinder, "No function matches the given name and argument types '/(VARCHAR, "NULL")'".
  - B1 to B4 (`'1' <op> '2' > 0`): RejectedByBinder, "Could not choose a best candidate function for the function call "<op>(STRING_LITERAL, STRING_LITERAL)"".
  - B5 to B8 (`zone <op> zone > 0`): RejectedByBinder, "No function matches ... '<op>(VARCHAR, VARCHAR)'".
  - B9 to B12 (`TRUE <op> FALSE > 0`): other, `Filter(ConstructNotAdmitted { construct: "CAST" })`.
  - B13 to B16 (`flag <op> flag > 0`): RejectedByBinder, "No function matches ... '<op>(BOOLEAN, BOOLEAN)'".
  - C1 to C4 (`TRUE <op> NULL > 0`): other, `Filter(ConstructNotAdmitted { construct: "CAST" })`.
  - C5 `flag / NULL > 0`: RejectedByBinder, "No function matches ... '/(BOOLEAN, "NULL")'".
- S-5 is met by B9, B10, B11, B12, C1, C2, C3 and C4. The BOOLEAN literals `TRUE` and `FALSE` become a CAST that admission refuses as `ConstructNotAdmitted`, before the type walk.
- S-1 to S-4 are not met. K1 to K3 are as the table says. Every walk-reached row (K1 to K3, A2) is TypeNotAdmitted with ConversionRounds, the table's construct and operand types, and a Display ending in W-1.
- Only 4 predicates reach the walk: K1, K2, K3 and A2. T1 would have had those four rows plus the two controls.
- The form's OPEN-3 (a) expected that B9 to B16 and C1 to C5 might reach the walk as BOOLEAN shapes. None of the BOOLEAN-literal rows does, and the BOOLEAN-column rows are binder-refused. So BOOLEAN residuals are not reachable at DuckDB 1.10505.0 by any of the 28 predicates.
- Restored: engine/tests/filter_type_admission.rs sha256 5bc4a811d243e09b00be9bea138cc8a308dd58a744861ac36f7e3d48f36a9668 before and after (via `git checkout --`). Porcelain empty, HEAD 0c84b816416bc1611649cf91415d9fc69f3693a6.

**For the custodian**
- The question is whether S-5 is a hard stop for the BOOLEAN-literal rows. They are refused by a different, earlier code, so no sentence question arises for them. The form's "Not stops" list does not name this outcome.
- I did not decide. The settlement could say that `ConstructNotAdmitted` rows are recorded and get no T1 row, as binder refusals do.
- A first-line quoting detail: P-0's output was captured with the whole Display printed. K4 through C5 binder first lines are as shown above, byte-copied in the log at <scratch>/atln-p0.log.

**Off-scope noticed, not done:** none.

**Hold line** (my project only): `MACHINE_HOLD shared project=SpatialIDE cores=0-7 affinity=FF` ... then `MACHINE_RELEASED project=SpatialIDE`. Cold build 10m55s. CI, M-1 and M-2 and the checks were not reached.

**Background shells:** none left running. My four wait loops and the cargo run all exited and notified.

**Model:** Sonnet 5.5 (claude-sonnet-5-5), no override. No context handoff received or produced.

**Self-check:**
- Cross-module code: none written.
- Completion claims: each is backed by a call in this transcript.
- User-facing messages: none changed.
- Required tests: the P-0 probe reached its assertions (it printed all 28 rows and ran its FX-1 hash check).
