# Consult — node 1's worker report (engine-cancel-before-stream-window, g1)

*Custodian's filing note: the worker-high's hand-back for PLAN node `engine-cancel-before-stream-window` at node:engine-cancel-before-stream-window@g1, delivered as a message on 2026-09-30 after its run was interrupted by an expired login and resumed on the custodian's message. Recorded verbatim below the rule, from the message, with the harness's report indentation removed. The custodian's checks before filing: the branch is pushed at fb98e43; a6f5310 touches only `engine/src/cancel.rs` (+21, the P0-1 test alone); both commits are signed off; the numstat at fb98e43 totals 395 as reported; the four sibling files are unchanged; the archive's sha256 and the five clear and set lines in `client_context.cpp` read as reported in the extraction under the worktree's D: target. What followed: the custodian's formatting commit c93d0ec on the branch, and the form's §10 Amendments 1 and 2 on main.*

---

node:engine-cancel-before-stream-window@g1 -- REPORT

Model: I observe myself running as Sonnet 5.5 (claude-sonnet-5-5). The first part of the run reported Sonnet 5 (claude-sonnet-5); no model override. The run was interrupted (expired login) and resumed on the coordinator's message. No context handoff produced.

STATE: branch cut/cancel-before-execute pushed to origin at fb98e43 (c6f61f5..fb98e43), no PR. `git status --porcelain` is empty. No cargo or test process remains. Nothing written under state/, PLAN.yaml, CUSTODIAN-QUEUE.* or site/. Two commits, both `-s`: a6f5310 (P0-1 test alone, before any product change) and fb98e43 (guard, re-interrupter, stream.rs, T2-T5, README sentence).

P0-1: the test `an_interrupt_raised_after_prepare_is_cleared_when_execution_begins` ran before any product change and returned Ok, as the form predicted. The form's §5 invalidator did not fire. (My first attempt did not compile: `Arrow` has no Debug; I fixed the message, and the compile error is not an outcome.)

P0-2 (a record, the form not edited):
- Source: libduckdb-sys-1.10505.0 at D:/caches/cargo-registry/src/index.crates.io-1949cf8c6b5b557f/. Cargo.lock:1188 is the .crate checksum 6cb514dab5e271e849235c1cb98bd65a2ae107fbd619a6740219319c54a71d95.
- Bundled source: archive `duckdb.tar.gz` inside that directory, sha256 e11f1209cdbb2a99b2ea2d348de21bdfb01dc494b55d1271df94b09c52bf229c, extracted to D:/wt-targets/cancel-before-execute/scratch-duckdb-src (not in the repo).
- File inside the archive: duckdb/src/main/client_context.cpp.
- Places where `interrupted` is cleared, by function, with line numbers in that file:
  1. `ClientContext::InitialCleanup` (689-693) unconditionally sets interrupted=false. Its callers:
     - `Prepare(unique_ptr<SQLStatement>)` (781)
     - `Prepare(const string&)` (792)
     - `PendingQueryPreparedInternal` (812)
     - `ParseStatements(ClientContextLock&, const string&)` (1108)
     - `PendingQuery(const string&, PendingQueryParameters)` (1136)
     - `PendingQuery(unique_ptr<SQLStatement>, ..., QueryParameters)` (1160)
     - `CancelTransaction` (1203)
     - `PendingQueryInternal(ClientContextLock&, const shared_ptr<Relation>&, QueryParameters)` (1363)
  2. `ClientContext::RunFunctionInTransactionInternal` (1236-1272) sets it at 1248, only when it opens an auto-commit transaction.
  3. `ClientContext::Query(const string&, QueryParameters)` (1042-1105) sets it at 1084 after a failed statement in a multi-statement batch.
  4. `ClientContext::ClearInterrupt` (1197-1199) is an explicit public clear.
- `Interrupt()` (1189) only sets the flag. This matches H1: InitialCleanup runs from Prepare and PendingQueryPreparedInternal, and RunFunctionInTransactionInternal clears again.

MUTATIONS, each applied, run, failure recorded, reverted (tree confirmed clean by `git diff --stat` after each). Each was applied on top of fb98e43 (uncommitted), except P0-1, applied on the tree after fb98e43:
- P0-1: the test's execute routed through `execute_guarded` -> FAILED at cancel.rs:329:9, "an interrupt raised between prepare and execute must not fail execution".
- T2 `a_cancel_landing_before_execution_begins_is_re_raised_once_it_has`: the spawn in `cancel_inner` disabled -> FAILED at cancel.rs:381:9, "the re-interrupter must end the query before the liveness watchdog does" (elapsed 60.0013 s).
- T3 `the_re_interrupter_exits_when_the_execute_window_closes`: the loop's condition ignores `in_execute` -> FAILED at cancel.rs:253:13, "timed out waiting for: the re-interrupter thread to exit" (60.05 s).
- T4 `a_cancel_after_execution_returns_is_seen_by_the_post_return_check`: step 4's recheck removed -> FAILED at cancel.rs:432:9, "a cancel observed after the closure returned Ok must still end the guard as Cancelled".
- T5 `a_cancel_inside_the_producers_execute_window_ends_the_stream_cancelled`: `produce` calls `stream_arrow` outside the guard -> FAILED at cancel_execute_window.rs:66:9, "timed out waiting for the producer to start executing" (102.30 s).
- No `verify-mutation` run was used.
- The line numbers are as observed at the time of each run; they may have shifted since.

CHECKS (exit code read directly from cargo, redirected to a file, not through a pipe; the resumed run re-ran all three):
- `cargo test -p spatial-engine --features fixture`: exit 0, 383 passed, 0 failed, 12 ignored.
- `cargo test -p spatial-engine`: exit 0, 383 passed, 0 failed, 12 ignored. This includes the 8 cancel.rs tests and cancel_execute_window's T5. On the clean tree T5 took ~72 s (a 2,000,000-feature fixture write), T2 12.5 ms, T3 22.4 ms.
- `cargo test -p spatial-kernel`: exit 0, 305 passed, 0 failed, 28 ignored. This includes `skp_filter_cancellation` and `skp_admission`'s cancel test.
- `cargo fmt --check`: exit 1, and I did not fix it.
  - `cargo fmt --check` ignores file arguments and scans the whole package (attributes.rs, make-fixture.rs and others I did not touch).
  - Scoped to my three changed files, `rustfmt --check --edition 2021` on cancel.rs, stream.rs and cancel_execute_window.rs also exits 1.
  - The baseline was already unclean: cancel.rs plus stream.rs at c6f61f5 give 53 diff hunks, against 64 now.
  - The repo has no rustfmt.toml and CI does not run fmt. Reformatting would rewrite lines I did not write and break the size budget. This is for the gate to weigh.
- `node scripts/plan/verify-quotes.mjs --show-cites engine/README.md`: exit 0, PASS (0 cites; the stale-baseline notes concern other files). engine/README.md is the only .md I changed.
- CI's `node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs"`: exit 0, 353/353.

BUDGET (form §7), `git diff --numstat c6f61f5...HEAD -- engine/src engine/tests engine/README.md` at fb98e43:
- engine/README.md 2/0
- engine/src/cancel.rs 251/4
- engine/src/stream.rs 28/18
- engine/tests/cancel_execute_window.rs 92/0
- Total 395 (limit 400; 4 files, limit 4). No overrun.

BUILT: `CancelToken::execute_guarded` (four steps, returns `Guarded`), `in_execute`, the re-interrupter (one thread, only on the false-to-true transition and only when `in_execute` is set, interrupting only under the slot mutex), and `is_executing()` (instrument accessor whose doc names its only caller, T5). `REINTERRUPT_INTERVAL` = 10 ms. Doc comments corrected: the module header, `Inner.interrupt`, and `attach`'s paragraph. In stream.rs `produce`, the guard replaces the old pre-execute check and the bare `stream_arrow` call. A guard Cancelled stamps PRODUCER_CANCELLED; a guard Err keeps the existing stamp-if-cancelled and `classify` path. `EXECUTE_RETURNED` is still marked only on the Ok path. One sentence was appended to engine/README.md item 3. No cfg, no dependency, no wire change, no user-visible string. The six sibling sites are untouched (`git diff --stat` empty for dataset.rs, index.rs, rowgroup.rs and layout.rs).

CALLER GREP: `execute_guarded` and `Guarded` have a product caller at stream.rs `produce`. `is_executing` has only the test caller (instrument-accessor exemption, doc says so).

PRE-GATE SELF-CHECK (the four classes):
1. Cross-module interfaces: the seam is engine-internal (`cancel.rs` and `stream.rs`) plus the `duckdb` crate's real `interrupt_handle()`/`InterruptHandle::interrupt`, read in duckdb-1.10505.0/src/lib.rs:671. `classify` is unchanged. T5 runs through the real `Dataset::stream_with_cancel` path.
2. Completion claims have evidence: each mutation observation and each check above is a run seen complete. The earlier reads of the plain-engine and kernel runs went through `| tail`, so I re-ran both with direct exit codes.
3. Messages describe behaviour at this commit: no new user-visible strings. The corrected docs state what the guard does at fb98e43.
4. Tests reach their assertions, not just setup:
   - T2/T3 reach the guarded query and the watchdog and Arc-count assertions.
   - T4 reaches `matches!(outcome, Guarded::Cancelled)`.
   - T5 reaches the terminal `Some(Err(Cancelled))` match and the `is_executing()` fall-back poll.
   - Each mutation failed at the named assertion.

NOTES:
- The timing rule is kept: elapsed times are printed, never asserted. The only deadline is `TEST_LIVENESS_DEADLINE` = 60 s, the harness bound.
- The form is not edited. The custodian records P0 as a §10 amendment.
- Sonnet-run mutation waits: T2/T3/T5 mutations each take about a minute or more, by design of the liveness bound.
- Background tool tasks are killed at a time limit. That killed my first fixture-feature run; I re-ran it detached to completion.
- Off-scope observation, not acted on: the README item 3 blockquote still says the producer's check is "the only thing" that stops an already-cancelled stream. The form asked for one appended sentence only, so I left the blockquote as it was.

Files: C:/dev/wt/cancel-before-execute/engine/src/cancel.rs, C:/dev/wt/cancel-before-execute/engine/src/stream.rs, C:/dev/wt/cancel-before-execute/engine/tests/cancel_execute_window.rs, C:/dev/wt/cancel-before-execute/engine/README.md. Check logs (scratch, outside the repo) are in D:/wt-targets/cancel-before-execute/chk-fixture.txt, chk-engine.txt and chk-kernel.txt.
