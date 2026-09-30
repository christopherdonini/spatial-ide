*Custodian's filing note (2026-09-30): the reviewer's gate 2 on PR #146, for PLAN node `engine-cancel-before-stream-window` at generation 2, full gating, after correction round 1. Reviewed: cut/cancel-before-execute @ 980177833ab308738d22a5da9a07ed34fde8358f (from the report's own first line). Filed under `state/consults/gates/` by `AUTONOMY.md` §25(b). It is transcribed from the hand-back message with the harness's two-space indent removed, and the text below the rule is the agent's. Its branch-only `path:line` cites are read at 9801778. Its mutation table (each applied on 9801778, run and reverted) is the observation of record for §4's five mutations at the merged head. Profile paths redacted at filing: none.*

---

Reviewed: cut/cancel-before-execute @ 9801778

PASS — cut/cancel-before-execute @ 980177833ab308738d22a5da9a07ed34fde8358f (reviewer, GATE 2, PR #146, node:engine-cancel-before-stream-window@g2)

Both gate-1 blockers are fixed, all five §4 mutations fail by name at 9801778, CI is green on 9801778, and the new F3 predicate really does force a full scan. Nothing blocks.

**Check 1: B1 and B2 resolved**
- **B1 resolved.** The re-interrupter now starts with `std::thread::Builder::new().name("engine-cancel-reinterrupt").spawn(..)` and its result is discarded with `let _ =` (cancel.rs:141).
  - Both `cancel` and `cancel_for_drop` reach this spawn only through `cancel_inner`, so neither has a panic path left.
  - Non-test cancel.rs (lines 1-259) has no `thread::spawn`, `unwrap` or `expect` left; the only two hits are comments (cancel.rs:136-137).
- **B2 resolved.** `gh pr checks 146` returns rc 0, with all 7 checks passing.
  - Both `cargo test --workspace (windows-latest)` runs are on head 9801778: run 36718716169 (push) and run 36718726962 (pull_request).
  - The logs of both runs show `a_cancel_inside_the_producers_execute_window_ends_the_stream_cancelled ... ok`.

**Check 2: trying to break the new code**
- **The `WindowOpen` reset.** `in_execute` is stored true, then the guard is built (cancel.rs:177-178).
  - An early return at step 2, or an unwind out of `f`, drops the guard and clears the flag.
  - Step 4 drops it explicitly (cancel.rs:184) before the SeqCst read of `cancelled`, so the ordering argument from gate 1 is unchanged.
- **The re-interrupter's recheck.** After its sleep, the thread takes the slot lock, then reads `in_execute`, then interrupts only while the slot is bound (cancel.rs:149-156).
  - `detach` takes the same lock, so there is still no interrupt after `detach`.
  - `in_execute` is not written under that lock, so a window that closes between the read at :150 and the interrupt can still get one interrupt (N1). That lands on the same cancelled stream's still-bound connection, which is then discarded, so it is harmless.
- **Step-4 races.** A cancel that arrives after the clear but before the read gives `Cancelled`. A cancel that arrives after the read is caught by the batch loop's check.
- **The `EXECUTE_CALLED` stamp moved inside the closure** (stream.rs:1774).
  - A step-2 `Cancelled` leaves no `execute_called`.
  - A step-4 `Cancelled` leaves `execute_called` with no `execute_returned`; the baseline stamped both on that path (see check 7).
- I found nothing that breaks.

**Check 3: T5 under Amendment 3's F3**
- I wrote a scratch crate outside the repo (in my session scratchpad) that writes the T5 fixture and runs `EXPLAIN ANALYZE` over `build_sql`'s filtered shape, with prepared parameters and a whole-extent bbox.
- `parquet_metadata` shows two row groups, of 1,048,576 and 951,424 rows.
- **The OR predicate:** `FILTER (contains(zone, 'zz') OR ((id + id) < id))` sits above a `TABLE_SCAN` that reports **2,000,000 rows**, and the `FILTER` passes 0 rows. Total time printed: 0.347 s.
- **Each disjunct alone** is pushed into the scan's `Filters:`, and the scan outputs 0 rows. Totals printed: 0.0050 s for the `LIKE` alone and 0.0184 s for the `id` comparison alone.
- **Through the real product path** (`Dataset::stream_with_cancel`), `is_executing()` stayed true for 353.6, 334.6 and 396.4 ms, and every run ended cleanly with no rows. These figures are printed only and asserted nowhere.
- **Unmutated T5** passed 3 of 3 standalone runs (40.8, 44.6 and 48.4 s) and also passed inside both engine suites.
- The scratch temp directory and the T5 run directories are all removed.

**Check 4: mutations** — see the table below. The observations of record are all at 9801778, and `git status --porcelain` was empty after each revert.

**Check 5: suites at 9801778 (exit codes read directly)**
- `cargo test -p spatial-engine`: rc 0, 383 passed / 0 failed / 12 ignored.
- `cargo test -p spatial-engine --features fixture`: rc 0, 383 / 0 / 12.
- `cargo test -p spatial-kernel`: rc 0, 305 / 0 / 28.
- From C:/dev/spatial-ide at f8b394d:
  - `node --test`: rc 0, 353/353.
  - verify-cites: rc 0.
  - verify-quotes: rc 0.
  - verify-test-claims: rc 0. On main it lists this form's tests as planned; in the worktree it reports 0 planned.
  - verify: rc 0.

**Check 6: Amendment 4's figure and the rustfmt counts**
- numstat c6f61f5...9801778: README 4+0, cancel.rs 288+6, stream.rs 40+23, cancel_execute_window.rs 133+0. That is **494 over 4 files**, which matches Amendment 4.
- §7 is unedited: the form's diff c6f61f5→f8b394d is 34 inserted lines and nothing removed.
- rustfmt `--check` hunk counts at 9801778: cancel.rs 6, stream.rs 47, cancel_execute_window.rs 0. That is equal to the 6/47/0 baseline.

**Check 7: the trace change**
- The worker's grep reproduces: the only files that name these events are kernel/src/publish/mod.rs (a doc comment), kernel/tests/cancel_rescore.rs, kernel/tests/query_window_attribution.rs, kernel/tests/trace_spans.rs, engine/src/stream.rs and engine/src/trace.rs.
- The code that pairs the events is `segment_ms` (trace.rs:200, which returns `None` when an endpoint is missing) and `spans()` (trace.rs:220, which leaves the span out). trace.rs:642-676 is a synthetic additivity test.
- The kernel pairings run on completed traces only:
  - trace_spans.rs:355-398 drains to the end;
  - cancel_rescore.rs:780-806 drains to the end;
  - query_window_attribution.rs:201 uses a token that is never cancelled.
- No consumer pairs the two events on a cancelled trace.

**Mutation table (applied on 9801778, all rc 101, reverted, porcelain empty after each)**

| Test | Mutation | Failing assertion |
|---|---|---|
| P0-1 | the execute routed through `execute_guarded` | cancel.rs:357:9 "an interrupt raised between prepare and execute must not fail execution: Some("Cancelled")" |
| T2 | spawn condition prefixed `false &&` (cancel.rs:134) | cancel.rs:409:9 "the re-interrupter must end the query before the liveness watchdog does" (printed 60.0007 s) |
| T3 | the loop's `in_execute` check replaced by `if false` (cancel.rs:150) | cancel.rs:276:13 "timed out waiting for: the re-interrupter thread to exit" |
| T4 | step 4's arm reduced to `Ok(v) => Guarded::Ok(v)` | cancel.rs:466:9 "a cancel observed after the closure returned Ok must still end the guard as Cancelled" |
| T5 | `stream_arrow` matched in a plain block, outside the guard (stream.rs:1770-1776) | cancel_execute_window.rs:101:9 "timed out waiting for the producer to start executing" (107.44 s) |

My first T5 mutation attempt did not compile (an immediately-invoked closure, error E0521 at stream.rs:1775). It is not an observation. The row above is the second attempt.

**Blocking:** none.

**Non-blocking**
- **N1:** In the re-interrupter, the read of `in_execute` and the interrupt are not atomic with the guard's clear (cancel.rs:150-155), so one interrupt can land after the window has closed. The comment only claims that a window closed *during the sleep* is not interrupted into, which is true. The effect is harmless, as explained in check 2.
- **N2:** A step-4 `Cancelled` trace now has `execute_called` with no `execute_returned`, where the baseline stamped both. The consumers leave that span out and nothing pairs the events there. The worker disclosed this in report 2.
- **N3:** The doc comment at cancel_execute_window.rs:28-32 says each disjunct alone is decided "without reading the row groups". `EXPLAIN ANALYZE` shows only the scan's output (0 rows, with the filters pushed down), not the rows it read, so the evidence for that half is timing only. The half the test relies on, the OR forcing a full scan, is proven by the 2,000,000-row `TABLE_SCAN`.
- **N4:** Still carried from gate 1: engine/README.md:46's blockquote ("the only thing") and the `lease_for_stream` doc at dataset.rs:1751-1752. Both belong to `engine-cancel-before-execute-siblings`.
- **N5:** A missed window and T5's mutation still fail with the same message. Amendment 3 item 4 records this, and the new F3 window of roughly 335-396 ms against a 1 ms poll makes a miss implausible.

Paths:
- C:/dev/wt/cancel-before-execute/engine/src/cancel.rs
- C:/dev/wt/cancel-before-execute/engine/src/stream.rs
- C:/dev/wt/cancel-before-execute/engine/tests/cancel_execute_window.rs
- C:/dev/spatial-ide/engine/CANCEL-BEFORE-EXECUTE-PREREGISTRATION.md

The worktree is clean at 9801778 and main was not changed. The untracked `state/consults/gates/2026-09-30-cancel-before-execute-gate2-architect.md` on main is not mine. The scratch crate's build artifacts sit in D:/wt-targets/cancel-before-execute, outside the repo.
