# A cancel landing before DuckDB begins executing is not lost — preregistration

**Authority:** PLAN node `engine-cancel-before-stream-window`; placed position 1 by question round 31, item 1 (RULED 2026-09-30). Origin: wave-1 A5 observation 4, S2 (`state/cloud/wave1/A5.md:122` @ 8efc554 sha256:8ed066880eaf76424d79542446d49709297080455cdecee0b144558112e80cb9).
**Drafted by** the architect agent on the custodian's brief, read at `main` 8efc554 (the consult: `state/consults/2026-09-30-engine-cancel-before-execute-architect-draft.md`). **Committed before any code.** Append-only once committed; an amendment made after any outcome has been seen says so in its first line.
**Custodian's edits to the draft, before commit:** the three span hashes computed (`git show 8efc554:<path> | sed -n '<a>,<b>p' | sha256sum`); F3's feature count stated; §9's kernel package named `spatial-kernel`; §4's liveness-watchdog reading stated. Nothing else changed.
**Gating:** full (AUTONOMY.md §21a: a cancellation guarantee, ADR-018).

## §0. Disclosure
- No pilot, spike or measurement informs this document. The window is reasoned from code: `engine/src/stream.rs:1755-1764` @ 8efc554 sha256:32ad5706e2a6a8fa5e54c9282e17dcc9c1fed49cbba4bc3946a0a08d176a6df3, `engine/src/cancel.rs:85-92` @ 8efc554 sha256:7e4db8cf3b95e552bdc428434a56b6d49bcc4bfa0466bf42a9d9a452b58665c3, and the test `an_interrupt_on_an_idle_connection_is_not_latched`. A5 did not reproduce it.
- Hypothesis H1 (evidence, not Authority): DuckDB clears its interrupt flag at the start of every prepare and execute (`ClientContext::InitialCleanup`, called from `Prepare` and `PendingQueryPreparedInternal`), and again in `RunFunctionInTransactionInternal`. This was read from an untracked build-output extraction whose version the drafter did not confirm. Discriminator: P0-1 and P0-2 (§4).
- In-code statements this defect makes false at 8efc554 (the consult's item 1): the `lease_for_stream` doc at `engine/src/dataset.rs:1751-1752`; the `Inner.interrupt` doc at `engine/src/cancel.rs:29-30`; the module header's second-line-of-defence claim at `engine/src/cancel.rs:4-11`. ADR-018 items 1 and 5 are the governing clauses.
- Sibling search (AUTONOMY.md:215): `engine/src/dataset.rs:1332`, `engine/src/dataset.rs:1636`, `engine/src/index.rs:332`, `engine/src/rowgroup.rs:336`, `engine/src/layout.rs:345`, `engine/src/layout.rs:438`, each @ 8efc554. All have the same window, with no check before executing, and each checks after execution, so the outcome is correct and the work is not stopped. All are out of scope (§2.4).
- Fixture drive: this piece measures nothing against the 5 GB fixture.

## §1. May and may not claim
- May claim: once the guard's check has passed, a cancel either is seen by the producer before `stream_arrow` returns control to the batch loop, or DuckDB is re-interrupted after every clear inside that call. Proven by §4's tests.
- May not claim:
  - any time bound (ADR-018 item 5); `REINTERRUPT_INTERVAL` is class (a) and says how often the thread looks, while DuckDB's reaction and thread scheduling are class (b) (ADR-018 item 4);
  - any `docs/08` figure;
  - any change at the six sibling sites;
  - stopping when the re-interrupter's spawn fails (§2.3).
- Unchanged: no SKP or MCP change, no new dependency, no user-visible string, no ADR amended. The `cancel_requested`, `cancel_observed` and quiescent vocabulary follows ADR-018 item 1.

## §2. The change
1. **`engine/src/cancel.rs`.**
   - `Inner` gains `in_execute: AtomicBool`.
   - A crate-private window guard runs one execute closure in four steps:
     1. store `in_execute = true` (SeqCst);
     2. if `cancelled` is set, clear `in_execute` and return `Cancelled` without running the closure;
     3. run the closure;
     4. clear `in_execute`; then, if `cancelled` is set and the closure returned `Ok`, drop the value and return `Cancelled`. A closure `Err` is returned unchanged.
   - `cancel_inner`, on the false-to-true transition only, after its existing interrupt and outside the slot lock: if `in_execute` is set, spawn one thread. While `in_execute` is set and the slot is bound, the thread sleeps `REINTERRUPT_INTERVAL` and interrupts under the slot mutex. It exits when either is false.
   - `detach` needs no change: the re-interrupter interrupts only under the slot mutex and while the slot is bound, so it cannot reach a returned connection.
   - Doc comments corrected: the module header's second-line claim, the `Inner.interrupt` claim at `cancel.rs:29-30` (qualified to callers that check under the guard), and `attach`'s paragraph.
   - New `pub fn is_executing(&self) -> bool`, an instrument accessor under round 5 item 4. Its doc names its only caller, `a_cancel_inside_the_producers_execute_window_ends_the_stream_cancelled`, and says why: the product wiring must be proven about the shipped build.
2. **`engine/src/stream.rs` `produce`:** the check at `:1755` and the call at `:1764` are replaced by the guard around `stmt.stream_arrow(..)`. A guard `Cancelled` stamps `PRODUCER_CANCELLED`. The `:1774` stamp is kept for a closure `Err` with the flag set.
3. **Residual, declared:** if the spawn fails (OS resource exhaustion), stopping degrades to today's behaviour for that cancel, and the outcome stays `Cancelled` through step 4. There is no panic and no new message.
4. **Out of scope:** the six siblings. The custodian records PLAN node `engine-cancel-before-execute-siblings`, proposed and depending on this piece; `dataset.rs:1636` and `index.rs:332` come first, because their work is unbounded.
5. **`engine/README.md` §3:** one appended sentence naming the guard.
6. **Portability (PORTABILITY-2026-09-30.md §2 R3):** not OS-dependent; there is no `cfg`, and std threads, atomics and the DuckDB C API behave the same on Windows, macOS and Linux. R3 does not apply. Timer granularity changes the real period of `REINTERRUPT_INTERVAL`, which is not claimed.

## §3. Fixtures and predicted outcomes
- F1: in-memory DuckDB, `SELECT count(*) FROM range(0, 1000) t(i)`. Predicted: completes.
- F2: in-memory DuckDB, `SELECT count(*) FROM range(0, 9223372036854775807) t(i) WHERE i % 7 = 0`. Predicted: never completes unless interrupted.
- F3: an engine `fixture`-feature GeoParquet written by `write_geoparquet_cancellable` into the test's own temporary directory, 2,000,000 features (the late-match precedent, `kernel/tests/skp_filter_cancellation.rs:124`), streamed with a filter that matches no row, so that `stream_arrow` scans the whole file before any chunk.

## §4. Tests, one mutation each
- **P0-1** `an_interrupt_raised_after_prepare_is_cleared_when_execution_begins` (cancel.rs, F1): attach, prepare, cancel, `query_arrow`; asserts `Ok`. Mutation: run the execute through the guard → returns `Cancelled` → fails by name.
- **P0-2** (a record, not a test): DuckDB's clear points, enumerated by function name from the source in the `libduckdb-sys` 1.10505.0 tarball (`Cargo.lock` line 1188, checksum 6cb514dab5e271e849235c1cb98bd65a2ae107fbd619a6740219319c54a71d95).
- **T2** `a_cancel_landing_before_execution_begins_is_re_raised_once_it_has` (cancel.rs, F2):
  - the guard's closure cancels, then executes;
  - a watchdog holds a second interrupt handle and sets `fired` before interrupting at `TEST_LIVENESS_DEADLINE`;
  - asserts `Err` and `!fired`; elapsed time is printed, never asserted.
  - Mutation: drop the spawn in `cancel_inner` → the watchdog ends the query → fails by name.
- **T3** `the_re_interrupter_exits_when_the_execute_window_closes` (cancel.rs, F2 then F1):
  - after the guard returns, and before `detach`, `Arc::strong_count(&inner)` falls back to its value before the cancel, within the liveness deadline;
  - then F1 on the same connection returns `Ok`.
  - Mutation: the loop's condition ignores `in_execute` → the count never falls → fails by name.
- **T4** `a_cancel_after_execution_returns_is_seen_by_the_post_return_check` (cancel.rs, F1): the closure executes and then cancels; asserts `Cancelled`. Mutation: remove step 4's check → `Ok` → fails by name.
- **T5** `a_cancel_inside_the_producers_execute_window_ends_the_stream_cancelled` (new `engine/tests/cancel_execute_window.rs`, F3, through `Dataset::stream_with_cancel`):
  - spins on `is_executing()` until it is true, within the liveness deadline, then cancels;
  - asserts the terminal is `Cancelled`, and `is_executing()` is false after it.
  - Mutation: `produce` calls `stream_arrow` outside the guard → never true → fails by name.
- Mutations are observed by applying each one, running the named test, recording its failure by name and commit, and reverting (the template's Round 25 additions). A `verify-mutation` run is not an observation.
- **The liveness watchdog, the custodian's reading:** `TEST_LIVENESS_DEADLINE` bounds only how long a failing test runs. The tests assert who ended the query (the token, not the watchdog) and the ordering of events, and print elapsed time without asserting it. That is the property-and-ordering shape of the human's round 25 item 1 (a) ruling, not a latency budget. The gates confirm or refuse this reading.

## §5. Predictions, declared unchanged, invalidators, falsification
- **Predictions:** P0-1 is `Ok`; T2 to T5 pass on the fix, and each fails under its mutation.
- **Declared unchanged (green before and after):**
  - the four existing tests in `engine/src/cancel.rs`;
  - `engine/tests/connection_reuse.rs`;
  - `kernel/tests/skp_filter_cancellation.rs`;
  - `kernel/tests/publish_cancellation.rs`;
  - `CancelToken::cancel`'s signature and stamp;
  - the six sibling sites, byte for byte.
- **Invalidators:**
  - P0-1 returns `Err` (the premise is false): stop, and amend;
  - the watchdog fires on the fixed build (the machine cannot schedule within the deadline): the run is invalid, not a result;
  - T5 misses a window that F3 makes too short: invalid, and F3 is re-declared by a class-2 amendment.
- **Falsification:** DuckDB clears the flag after the query becomes active. The re-interrupter still covers that case, so it is falsified only if a clear follows a finished execute.

## §6. Instruments
All are assertions: typed outcomes, the watchdog flag, `Arc` counts, and `is_executing()`. There is no measurement and no `docs/08` row.

## §7. Declared values and ceilings
- `REINTERRUPT_INTERVAL` = 10 ms, at its own site in `cancel.rs`, by the precedent of `PUBLISH_STREAM_POLL_INTERVAL`. It bounds how often the re-interrupter interrupts. It bounds no latency.
- `TEST_LIVENESS_DEADLINE` = 60 s, test-only. It bounds how long a failing test runs. It is never reported as a latency.
- **Size budget:** ≤ 400 changed lines, counted as insertions plus deletions over non-generated code and tests, excluding this file. Files: `engine/src/cancel.rs`, `engine/src/stream.rs`, `engine/README.md`, `engine/tests/cancel_execute_window.rs`, so ≤ 4 files. Counted by `git diff --numstat <base>...HEAD -- engine/src engine/tests engine/README.md` at a named commit. An overrun is class 8.

## §8. Block-on-sight
1. A timing assertion other than the liveness watchdog, or an elapsed-time figure presented as a latency.
2. Any change at a sibling site, or any wire, SKP or dependency change.
3. An interrupt issued outside the slot mutex, or after `detach`.
4. More than one re-interrupter per token, or a spawn on the uncancelled path.
5. `unwrap` or panic on the spawn's failure.
6. `is_executing()` doc lacking any of the instrument-accessor elements.
7. A test from §4 missing, or its mutation unobserved.
8. `cancel.rs:29-30`'s claim left unqualified.

## §9. Gates
- **Architect:** ADR-018 items 1, 4 and 5; ADR-010 rule 6; docs/01 principle 7; §8 checked one by one.
- **Reviewer:** the full diff; the SeqCst argument; each mutation observed.
- **Suites:** `cargo test -p spatial-engine` (including `--features fixture`), `cargo test -p spatial-kernel`, `verify:cites`, `verify:plan`, and CI's `node --test` scripts suite.
- **Operator:** none. No user-visible behaviour changes.

## §10. Amendments (opens empty, append-only)

### Amendment 1 — P0-1 and P0-2 recorded (class 1)

Written after P0-1 and P0-2 were run (class 1, a post-result amendment). It invalidates nothing.

1. **P0-1.** `an_interrupt_raised_after_prepare_is_cleared_when_execution_begins` was committed alone at a6f5310, before any product change, and returned `Ok`, as §4 and §5 predict. §5's first invalidator did not fire. Its mutation, the execute routed through the guard, was observed failing by name. The record of the observation is the worker's report, `state/consults/2026-09-30-cancel-before-execute-worker-report-1.md`.
2. **P0-2.** The source is `libduckdb-sys` 1.10505.0 (`Cargo.lock` line 1188, checksum 6cb514dab5e271e849235c1cb98bd65a2ae107fbd619a6740219319c54a71d95), whose bundled archive `duckdb.tar.gz` hashes sha256 e11f1209cdbb2a99b2ea2d348de21bdfb01dc494b55d1271df94b09c52bf229c. In its `duckdb/src/main/client_context.cpp`, `ClientContext::Interrupt` only sets the flag. The flag is cleared in four functions:
   - `ClientContext::InitialCleanup`, reached from both `Prepare` overloads, `PendingQueryPreparedInternal`, `ParseStatements`, both `PendingQuery` overloads, `CancelTransaction`, and `PendingQueryInternal` for a relation;
   - `ClientContext::RunFunctionInTransactionInternal`, when it opens an auto-commit transaction;
   - `ClientContext::Query`, after a failed statement in a multi-statement batch;
   - `ClientContext::ClearInterrupt`, an explicit clear.
   H1 (§0) holds at the locked version. The custodian re-read the archive's hash and the four clearing lines in the worker's extraction; the enumeration by caller is the worker's (the report above).

### Amendment 2 — budget overrun, §7 not edited (class 8)

Budget overrun, §7 not edited. §7 declares at most 400 changed lines over at most 4 files. The final figure is 429 over 4 files at c93d0ec, by §7's command (`git diff --numstat c6f61f5...c93d0ec -- engine/src engine/tests engine/README.md`: `engine/README.md` 4+0, `engine/src/cancel.rs` 266+4, `engine/src/stream.rs` 28+18, `engine/tests/cancel_execute_window.rs` 109+0). At the worker's fb98e43 it was 395. The reason is the custodian's formatting commit c93d0ec, made before any gate: rustfmt over the lines this piece added (six hunks of `cancel.rs` and the new test file whole), and the README sentence wrapped to the file's width. Each changed file hashes identically at fb98e43 and at c93d0ec with whitespace and `,{};` removed. The baseline's own unformatted hunks in `cancel.rs` and `stream.rs` are left as they were.

### Amendment 3 — T5 missed its window on CI; F3 re-declared (class 2)

Written after gate 1's results were seen (class 2, a deviation recorded after results, with the reason). §3's F3 and §5 are not edited.

1. **The deviation.** At c93d0ec, T5 failed on windows-latest in PR run 36703920918: the producer was never observed executing within the liveness deadline. The push run 36703531817 at the same commit passed, and five local runs passed. The evidence is the gate-1 reviewer's report, checks 3 and 8 (`state/consults/gates/2026-09-30-cancel-before-execute-gate1-reviewer.md`). By §5's third invalidator, that run is invalid, not a result.
2. **The reason, a hypothesis nobody has measured** (the gate-1 reviewer's B2). F3's viewport lies wholly outside the extent, so DuckDB can exclude every row group from the bbox statistics. If it does, `stream_arrow` need not scan the file, and F3's premise, a whole-file scan before any chunk, does not hold on a fast runner.
3. **F3 re-declared.**
   - The fixture is the same: 2,000,000 features, written by the test.
   - It is streamed with a viewport that covers the whole extent and an admitted predicate (`ViewportQuery`'s `filter`) that matches no row and that DuckDB cannot decide from row-group statistics, so that `stream_arrow` reads every row group before any chunk.
   - Before T5 relies on the predicate, the worker names it and records two things in its report: evidence that DuckDB reads every row group for it (a scratch `EXPLAIN ANALYZE` or an equivalent count), and repeated passing local runs of the unmutated T5.
   - If no admitted predicate can meet this, the worker stops and reports, and the piece comes back as a new amendment.
   - T5's fixture moves to a per-run temporary path, removed at the end (the gate-1 notes on the shared path).
4. **Unchanged.** T5's name, its assertions, its mutation, and §5's third invalidator, which still covers a window F3 makes too short. By its assertion alone, T5 still cannot tell a missed window from its mutation (the gate-1 reviewer's B2). The re-declared F3 is what makes a missed window implausible. A missed window on a later head is still an invalid run, recorded as such.
