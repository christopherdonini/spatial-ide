# Consult — node 1's correction round 1 report (engine-cancel-before-stream-window, g2)

*Custodian's filing note: the hand-back of the fresh worker-high that ran correction round 1 (of two) for PLAN node `engine-cancel-before-stream-window` at node:engine-cancel-before-stream-window@g2, on gate 1's FAIL/FAIL (`state/consults/gates/2026-09-30-cancel-before-execute-gate1-*.md`) and the form's Amendment 3. Recorded verbatim below the rule, from the message, with the harness's report indentation removed. The custodian's checks before filing: the branch is pushed and clean at 9801778, which is signed off; the numstat totals 494 as reported; T5 admits the predicate named below through `AdmittedPredicate::admit`; `EXECUTE_CALLED` is stamped inside the guarded closure; `gh pr checks 146` shows every check passing on 9801778, both windows-latest workspace runs included. Its predicate evidence is the record Amendment 3, item 3 asks for.*

---

node:engine-cancel-before-stream-window@g2, CORRECTION ROUND 1 for PR #146. Model observed: Sonnet 5.5 (claude-sonnet-5-5), no override. Context handoff: none received or produced.

BUILT (commit 9801778 on cut/cancel-before-execute, pushed, `git commit -s`; worktree porcelain empty; no PR opened or edited; form, state/, PLAN.yaml and site/ untouched):
1. B1 (both gates): the re-interrupter starts through `std::thread::Builder` with the name "engine-cancel-reinterrupt", and a spawn Err is discarded (`let _ =`). No panic path is left, and the outcome stays Cancelled via guard step 4 (form §2 item 3).
2. Architect B2: the `Inner.interrupt` doc says attach's interrupt is not latched (`an_interrupt_on_an_idle_connection_is_not_latched`). What stops a query cancelled before attach or prepare is a flag check, `produce`'s pre-prepare check and guard step 2, qualified to callers that check under the guard.
3. Architect B3: the module header attributes the clears to `InitialCleanup` (reached from Prepare and PendingQueryPreparedInternal among others). It says `RunFunctionInTransactionInternal` clears only when it opens an auto-commit transaction (§10 Amendment 1, item 2).
4. Reviewer B2: T5 now streams the same 2,000,000-feature fixture (plus `AttributeMode::CategoricalZone`, which the predicate needs a `zone` column for) with a whole-extent viewport. The filter goes through `AdmittedPredicate::admit`, with the predicate below. The fixture lives in a per-run temp dir (pid plus nanos) removed by a Drop guard, also on panic. I checked that no dir is left behind.
5. Folded in:
   - `in_execute` is cleared by an RAII `WindowOpen` guard, dropped explicitly before step 4's read of `cancelled`.
   - The re-interrupter now sleeps, then under the slot lock checks `in_execute` and the bound slot, then interrupts. Single condition site; this is architect N1 and reviewer N2.
   - `EXECUTE_CALLED` is now stamped inside the guarded closure, so a step-2 Cancelled leaves no `execute_called` (the baseline trace), and the SPAN_BIND_AND_EXECUTE comment is true for the guarded path (architect N2).

PREDICATE EVIDENCE (item 4). Predicate, verbatim: `zone LIKE '%zz%' OR id + id < id`. It is admitted by the engine's real `AdmittedPredicate::admit`. A scratch crate outside the repo (in my scratchpad, sharing the worktree's Cargo.lock and profiles) wrote the T5 fixture and ran the SQL shape of `build_sql` (`SELECT "id" AS "id","geometry" FROM read_parquet(..) WHERE (<pred>) AND bbox conds over the whole extent`) under EXPLAIN ANALYZE. It then streamed through the real `Dataset::stream_with_cancel`. The fixture has row groups of 1,048,576 and 951,424 rows (parquet_metadata).
- `zone LIKE '%zz%'` alone (my first candidate) was pushed to the scan as `contains(zone,'zz')`, and the query took 0.003 s and returned 0 rows. Engine stream: 4.8 ms. This was decided from the file's metadata, so it is REJECTED, and it is the plausible cause of the CI miss.
- `id + id < id` alone was pushed to the scan and took 0.02 s (engine stream 23.6 ms). `id * 2 + 1 = 0` alone took 0.0015 s. Both are rejected.
- The OR of `zone LIKE '%zz%'` and `id + id < id` is not decidable from statistics. The plan is FILTER (`contains(zone,'zz') OR ((id + id) < id)`) over TABLE_SCAN, and the TABLE_SCAN reports 2,000,000 rows read, which is the sum of both row groups, with 0 rows out of the FILTER. Total 0.540 s; engine stream through the product path 503.9 ms, 0 rows, no terminal error. Timings are local, printed only, and asserted nowhere.
- Unmutated T5: 6 passing local runs (1 via cargo, 5 via the test binary; 43-50 s each, dominated by the debug fixture write), plus a 7th inside the full `cargo test -p spatial-engine` run.
- Why a T5 failure under the mutation is the mutation: `in_execute` is set only in `execute_guarded`, so with `produce` calling `stream_arrow` outside the guard `is_executing()` can never be true. The unmutated scan window is about 0.5 s against a 1 ms sleep poll (Windows timer granularity is coarser), and T5 passed 7 of 7. This is evidence, not proof: on the assertion alone a missed window is still indistinguishable, per Amendment 3 item 4.

MUTATIONS at 9801778 (each applied, run, reverted with `git checkout -- engine`; porcelain empty after each):
| Test | Mutation | Failing assertion |
|---|---|---|
| P0-1 `an_interrupt_raised_after_prepare_is_cleared_when_execution_begins` | execute routed through `execute_guarded` | cancel.rs:361:9 "an interrupt raised between prepare and execute must not fail execution: Some(InvalidParameterName("Cancelled"))" |
| T2 `a_cancel_landing_before_execution_begins_is_re_raised_once_it_has` | spawn condition prefixed `false &&` | cancel.rs:409:9 "the re-interrupter must end the query before the liveness watchdog does" (60.03 s) |
| T3 `the_re_interrupter_exits_when_the_execute_window_closes` | the `in_execute` exit condition removed from the loop (its only site now) | cancel.rs:273:13 "timed out waiting for: the re-interrupter thread to exit" |
| T4 `a_cancel_after_execution_returns_is_seen_by_the_post_return_check` | step 4's arm reduced to `Ok(v) => Guarded::Ok(v)` | cancel.rs:466:9 "a cancel observed after the closure returned Ok must still end the guard as Cancelled" |
| T5 `a_cancel_inside_the_producers_execute_window_ends_the_stream_cancelled` | `stream_arrow` matched directly outside the guard (stream.rs) | cancel_execute_window.rs:101:9 "timed out waiting for the producer to start executing" (102.5 s) |
The T3 mutation is worded differently from the form's §4 because the loop's condition was restructured into one recheck under the lock; it is the same intent, and I did not add a test.

GREP (item 5): `grep -rlE "EXECUTE_CALLED|EXECUTE_RETURNED|execute_called|execute_returned|SPAN_BIND_AND_EXECUTE|SPAN_PARAM_ASSEMBLY" kernel engine scripts` (rs/mjs/js/ts) lists exactly: kernel/src/publish/mod.rs (a doc comment only), kernel/tests/cancel_rescore.rs, kernel/tests/query_window_attribution.rs, kernel/tests/trace_spans.rs, engine/src/stream.rs, engine/src/trace.rs. scripts/ has no match.
- The consumers that pair the two events are `Trace::segment_ms` and `spans()` (trace.rs:200 and 220), which return `None` or omit the span when an end is missing. This is the doc'd contract: "omitted rather than zeroed".
- Tests: trace_spans.rs:375-398 (asserts on a completed trace), cancel_rescore.rs:805-806 (`segment_ms`, Option) and query_window_attribution.rs (a completed run). None pairs the events on a cancelled trace.
- Behaviour change on the cancelled path: a step-4 Cancelled (the call returned Ok, then a cancel was seen) now leaves `execute_called` without `execute_returned`, where the baseline stamped both. `spans()` omits that span. Nothing pairs them there.

CHECKS (exit codes read directly), all at 9801778's tree:
- `cargo test -p spatial-engine` rc 0: 383 passed, 0 failed, 12 ignored.
- Same with `--features fixture` rc 0: 383 / 0 / 12.
- `cargo test -p spatial-kernel` rc 0: 305 / 0 / 28.
- rustfmt `--edition 2021 --check` hunks: cancel.rs 6 (baseline's 6, same functions), stream.rs 47 (baseline's 47), cancel_execute_window.rs 0.
- From C:/dev/spatial-ide: `node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs"` rc 0, 353/353.
- `verify-quotes --show-cites` on the 3 changed files: PASS, 0 checked.

NUMSTAT: `git diff --numstat c6f61f5...HEAD -- engine/src engine/tests engine/README.md`: README 4+0, cancel.rs 288+6, stream.rs 40+23, cancel_execute_window.rs 133+0. Total 494 changed lines (insertions plus deletions) over 4 files, against the declared 400 and 4. Amendment 2 recorded 429 at c93d0ec. This round adds 65 lines (mostly the docs and the new T5 setup); the custodian records the class-8 row.

CI (`gh pr checks 146`, on 9801778): both `cargo test --workspace (windows-latest)` runs pass (push 19m36s, pull_request 14m57s; T5 passed on windows-latest in both), both `typecheck · build · vitest · cargo test` pass, both tauri NSIS builds pass, `every commit is signed off` passes. None failing.

PRE-GATE SELF-CHECK (four classes):
1. Cross-module interface: nothing new crosses a module boundary. T5 goes through the real `Dataset::open`, `AdmittedPredicate::admit` and `stream_with_cancel`. The trace consumers were read, not assumed (grep above).
2. Completion claims point to evidence: every claim above names a test, a failing assertion with its line, or a measured run. The window and predicate claims are labelled local measurements outside the repo.
3. User-facing messages: none changed. The code comments state only what the code does at this commit.
4. Required tests reach the intended assertion: each of the five mutations fails at the named assertion, not at setup. T5's mutation and a missed window share one message. I said above why I read it as the mutation, and the reviewer should keep that residual in mind.

OFF-SCOPE, not done: `engine/README.md`'s blockquote still says "the only thing", and the `lease_for_stream` doc at dataset.rs (reviewer N4) is still stale; both are for the siblings node. The doc for `SPAN_PARAM_ASSEMBLY` in trace.rs says "one cancellation check", which is still true (guard step 2). I did not touch it.

A memory-worthy hazard: a powershell kill matching "cargo build --release" also killed my own Bash call, because my command line contained the string. I built the scratch crate again under the workspace's profile settings, and it reused the cached libduckdb. The scratch files sit in the session scratchpad only, and the 385 MB scratch fixture in Temp is deleted.

State left: C:/dev/wt/cancel-before-execute at 9801778 == origin/cut/cancel-before-execute, `git status --porcelain` empty. Paths: C:/dev/wt/cancel-before-execute/engine/src/cancel.rs, engine/src/stream.rs, engine/tests/cancel_execute_window.rs.
