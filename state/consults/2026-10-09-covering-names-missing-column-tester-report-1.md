*Custodian's filing note (2026-10-09): `covering-names-missing-column`'s tester report 1, the form's §9 suites run by the tester at PR #197's head 9340c5f885d88dc8effc1275c53b79a309c661e3, 11:57:32Z to 12:16:38Z by its transcript, each command in its own shared hold. It arrived as a message and is extracted here by script from the SubagentHandback call in the subagent's own transcript, with nothing changed except one final newline. Its sha256, from this file's line 5 to the end, is cbff60af5614df3890288dd6b5cf13727ab64d7edd285659cade8d2504a2ba5a. The custodian checked that the worktree is clean at that head after the run. The rest is the tester's.*

---

All four suites passed at head 9340c5f885d88dc8effc1275c53b79a309c661e3 (worktree C:/dev/wt/cov, branch cut/covering-names-missing-column), with no failing test. The worktree was clean before and after. I'm Sonnet 5.5 (claude-sonnet-5-5), with no model override and no context handoff. No timing figure was taken and nothing was edited.

Harness against the four failure classes:
- **Product interface:** the suites are the repo's own `cargo test` targets, so the harness uses the interface the product exposes.
- **Claims point to output:** the workspace output was captured to a scratch file (`ws.txt` in my scratchpad) and the counts below are computed from it. The other results are copied from the run output.
- **Operator-facing lines:** the lines I quote are from this run at this commit.
- **Assertions reached:** every test reported `ok` rather than being filtered out. C-5 ran with `--include-ignored` and the P4 generator with `--ignored`.

Each command ran in its own shared hold (granted at once, cores 0-7), released afterwards, with `CARGO_BUILD_JOBS=8` and `RUST_TEST_THREADS=8`.

**1. `cargo test --workspace --no-fail-fast`** (hold "cargo test workspace", 40 min, max wait 8). Exit code 0.
- Totals from summing the `test result:` lines: passed 927, failed 0, ignored 55.
- There were 102 `test result:` lines.
- No test failed. The only "FAILED"/"failed" matches in the output were `0 failed` result lines and one passing test whose name contains "failure".

**2. C-5** (`cargo test -p spatial-engine --test covering_names_missing_column -- --include-ignored`, hold "C-5 test"). Exit code 0, summary `test result: ok. 5 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.47s`.
- `m4_the_corpus_mutation_opens_with_its_covering_unusable_and_refuses_a_bbox_query_pre_lease`: ok
- `a_covering_naming_an_absent_child_under_an_existing_struct_is_unusable`: ok
- `a_covering_naming_a_column_the_file_lacks_is_unusable_and_a_bbox_query_refuses_before_any_lease`: ok
- `a_format_rule_file_whose_covering_names_an_absent_column_keeps_its_sanity_record_and_refuses_a_bbox_query_pre_lease`: ok
- `the_covering_decision_agrees_with_the_binder_on_every_p0_row`: ok

**3. P4 generator** (`cargo test -p spatial-engine --test admission_p4_corpus -- --ignored --nocapture`, hold "P4 generator"). Exit code 0, and the one test `the_p4_admission_table_runs_against_the_preregistered_corpus_and_writes_admission_results` is ok. Summary line, byte-copied from the run output:
`P4 admission table: 17 row(s) opened, 0 unrun, 2 DEVIATION row(s) — see C:\dev\wt\cov\engine\ADMISSION-RESULTS.md`

`git diff --stat`:
```
 engine/ADMISSION-RESULTS.md | 4 ++--
 1 file changed, 2 insertions(+), 2 deletions(-)
```
`git diff -U0 -- engine/ADMISSION-RESULTS.md` changed two lines:
- Line 2 is the `<!-- commit: ... -->` comment. It moved from 7196452e9d353515c49b856e11a6704a0e8b7365 to 9340c5f885d88dc8effc1275c53b79a309c661e3.
- Line 8 is the "Generator: ..." header line. Its only change is "Generated from the tree at `<hash>`", from 7196452e... to 9340c5f8....

Reading: only the header lines moved. The diff touches no row, verdict, Notes line or the Totals, so those are byte-identical to the committed file. M-4 is still DEVIATION: the row at line 26 ends in `DEVIATION | ADMISSION-PREREGISTRATION.md §4 mutation table, M-4`. Line 57 still reads `DEVIATION rows: #12, M-4`. The Notes line for M-4 still says the reason lacks "no_such_bbox_column".

I then ran `git checkout -- engine/ADMISSION-RESULTS.md`.

**4. K-1** (`cargo test -p spatial-kernel --test skp_projection covering`, hold "K-1 skp_projection covering"). Exit code 0, summary `test result: ok. 2 passed; 0 failed; 0 ignored; 0 measured; 12 filtered out; finished in 0.04s`.
- `a_covering_naming_a_column_the_file_lacks_refuses_a_bbox_viewport_query_before_the_mint_and_describe_reports_no_covering`: ok
- `a_hostile_covering_refuses_a_bbox_viewport_query_before_the_mint_and_describe_reports_no_covering`: ok

**Final state:** `git status --porcelain` is empty and HEAD is 9340c5f885d88dc8effc1275c53b79a309c661e3.
