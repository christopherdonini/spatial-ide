*Custodian's filing note (2026-10-24): the worker-high's stop in filler entry 2's code, `stream-evaluation-failure-fixed-detail`, on its branch at f0804432d50cea3b9bb54903177e5ec260c5c3ae (nothing committed; its work left uncommitted in C:/dev/wt/sefd). The run 14:47:36Z to 15:21:24Z by its transcript (Read 8, Bash 36, Edit 13; Edit only on the Scope's three files; no commit, push, rebase, reset, merge or PR action). Extracted by script from its SubagentHandback call, with one final newline added; nothing else is changed. Its sha256, from line 5 to the end, is b65378f69053e514ff00494bab3dbcc4a7e28cf82c5bc0a06303beeb63fba0f6.*

---

STOPPED, nothing built or committed: stream-evaluation-failure-fixed-detail is at f0804432d50cea3b9bb54903177e5ec260c5c3ae, unchanged. Note E's T1 predicate, `i64 * 9223372036854775807 > 0`, does not overflow, so T1 as the form gives it cannot pass. That is a defect in the form, not in the code, and it is not one of your listed stop rules. It is the same kind as "T1's predicate refused at admission", and I did not route around it. Changing the predicate needs your class 3 amendment.

**What I observed (all via shared holds, target D:/wt-targets/sefd)**
- **T1 with the form's predicate:** the predicate is admitted. The stream ends with no error, and the probe counted 376 ids returned. T1 fails at its "must end in error" assertion (campaign file, run 1).
- **Probe of other predicates** (a temporary test I removed):

| Predicate | Result |
|---|---|
| `i64 * 9223372036854775807 > 0` | admitted, completes with 376 ids |
| `i64 * 9223372036854775807 < 0` | admitted, completes with 424 ids |
| `i64 + 9223372036854775807 > 0` | admitted, completes with 800 ids |
| `i64 * id > 0` | admitted, completes with 376 ids |
| `(i64 * 9223372036854775807) > 0 AND id >= 0` | admitted, completes with 376 ids |
| `i64 * 9223372036854775807 > id` | admitted, ends in error with text exactly `query: ` + S1 |
| `i64 * 2 > id` | admitted, ends in error with text exactly `query: ` + S1 |
| `i64 * i64 > 0` | admitted, ends in error with text exactly `query: ` + S1 |

- **T1 with `i64 * i64 > 0`** (a one-off run, not kept): all four assertions of note E pass.
- **Mechanism:** I did not determine why the comparison-with-constant forms don't overflow. Note E's claim that the form's predicate "overflows on any row with |i64| ≥ 2" is false as observed.
- **Closest fix to the form's shape:** `i64 * 9223372036854775807 > id`.
- **B-T1 stop rule not met.** `the_type_walk_agrees_with_the_binder_over_the_p0_matrix` printed "B-T1: 4564 admitted, 5164 refused, 0 failures" (run 2). So no overflow case ended in DuckDB's own text; every one ended in `query: ` + S1.
- **T2 passes:** `only_duckdbs_out_of_range_class_is_read_as_an_evaluation_failure` ok (run 1).
- **Campaign:** `filter_admission_property_campaign` ok. Its stream_errors were 0 in all four generators, so these seeds reach no overflow now (the 2026-09-28 gate report saw three).
- **P5:** `a_join_of_clauses_each_admitted_alone_returns_their_intersection_and_its_subsets_admit` ok. Tally was "excluded": 4, "passed": 197. The 4 excluded cases are accepted only on the exact `query: ` + S1 text, so they ran through the real pipeline.

**The code as I wrote it (uncommitted)**
- S1 is one private const, `OUT_OF_RANGE_DETAIL`, with its doc comment.
- A private `is_out_of_range(message)` uses `starts_with("Out of Range Error")`, so it matches the label at the start of DuckDB's message only.
- **Deviation to flag:** `classify` now takes `(cancel, phase, message)`. Its three call sites pass `"prepare"`, `"execute"` and `"duckdb fetch panicked"` with the message, so the check sees DuckDB's text without the phase prefix. Cancelled is still returned first. Other failures render as `{phase}: {message}`, the same as before. If you want the old signature, say so.
- The two other test files:
  - `is_declared_integer_arithmetic_overflow` in the campaign file and `is_declared_overflow` in `filter_type_admission.rs` are re-keyed to the exact `query: ` + S1 text, with the same typed class.
  - The campaign's two call sites and its header doc needed no edit.
  - S1 appears once per test file as a literal, because the engine's const is private.
- **S1 byte-equality** was checked by a node script against the form and against the string in all three files: true for all four.

**Not done**
- No commits, no mutations M1 or M2, no clippy.
- No full engine suite and no `typed_terminal_codes` run.
- No fmt check at the end. `cargo fmt --all -- --check` passed (exit 0) on the working tree after I applied rustfmt.
- The `RECORDED MUTATION:` lines are not written.
- verify-cites, verify-quotes, verify-test-claims and verify all exit 0 on the working tree. They are not the final check at a commit.

**Scope count so far** (`git diff --numstat` of the working tree against f0804432):
- stream.rs: 61 and 5.
- admission_property_campaign.rs: 33 and 6.
- filter_type_admission.rs: 9 and 5.
- Total: 119 of 150, before the two `RECORDED MUTATION:` doc lines.

**State left**
- Branch `cut/stream-evaluation-failure-fixed-detail`: HEAD equals origin's branch at f0804432. Nothing pushed.
- The worktree `C:/dev/wt/sefd` has the work above uncommitted: 3 modified files, porcelain not empty. T1 carries the form's predicate, so it fails.
- A copy of the diff is in my scratch folder as `sefd-c-wip.patch`.
- To continue: amend note E's predicate, then re-dispatch or message me. Then I commit, apply M1 and M2 at that commit, record them, and run the checks.
- No process I started is running. The cargo and rustc processes now on the machine belong to something else (`covering_case_collision`).

**Holds (my project's only):** three shared holds, each granted (`MACHINE_HOLD shared project=SpatialIDE cores=0-7 affinity=FF`) and each followed by `MACHINE_RELEASED project=SpatialIDE`. They covered the cold build plus the named tests, the B-T1 plus T1 run, and the probe test.

**Model:** Sonnet 5.5, `claude-sonnet-5-5` as the harness reports it. No override and no context handoff.
