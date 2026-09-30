*Custodian's filing note (2026-09-30): the reviewer's gate 1 on PR #146, for PLAN node `engine-cancel-before-stream-window` at generation 1, full gating. Reviewed: cut/cancel-before-execute @ c93d0ec10ac51512ad77ce3e93cbdc8636346789 (from the report's own first line). Filed under `state/consults/gates/` by `AUTONOMY.md` §25(b). It is transcribed from the hand-back message with the harness's two-space indent removed, and the text below the rule is the agent's. Its branch-only `path:line` cites are read at c93d0ec. Its mutation table (each applied on c93d0ec, run and reverted) is the observation of record for §4's five mutations. The custodian re-read B2's CI evidence: run 36703920918's failed log shows `a_cancel_inside_the_producers_execute_window_ends_the_stream_cancelled` panicking at `engine\tests\cancel_execute_window.rs:77:9` with the timed-out message, after 77.00 s. Profile paths redacted at filing: none.*

---

Reviewed: cut/cancel-before-execute @ c93d0ec

FAIL — cut/cancel-before-execute @ c93d0ec10ac51512ad77ce3e93cbdc8636346789 (reviewer, GATE 1, PR #146, node engine-cancel-before-stream-window@g1)

**Check 1: diff c6f61f5...c93d0ec (correctness)**
- SeqCst argument holds. Guard: store `in_execute=true` then load `cancelled` (cancel.rs:158-159). Canceller: swap `cancelled` then load `in_execute` (cancel.rs:107,120). All four are SeqCst. If the guard's load reads false, that load precedes the swap in the total order, so the canceller's `in_execute` load sees true. The only exception is the step-4 store(false) at cancel.rs:164, and at that point the closure has already returned; the step-4 recheck or the batch-loop check then covers it. So either step 2 sees the cancel or a re-interrupter is spawned.
- Interrupts happen only under the slot mutex (cancel.rs:111, 135-138). `detach` takes the same mutex (cancel.rs:226), so nothing interrupts after `detach`. At most one spawn per token, because the spawn needs `!already` (cancel.rs:107,120). There is no spawn on the uncancelled path: a drop-cancel of a finished stream sees `in_execute` false.
- Races I tried: a cancel between step 2 and the start of `stream_arrow` (covered by the re-interrupter, which T2 exercises); a cancel between the step-2 load and the step-2 clear (the thread exits, or makes one interrupt on an idle, still-bound connection that is not latched and is then discarded); a second stream on a detached token (the pre-prepare check stops it, and the thread sees an unbound slot and exits); a second execute on one token (none in the product, since `produce` calls the guard once per attach). None of these broke it.
- **Broken: §8 item 5.** cancel.rs:122 uses `std::thread::spawn`, which panics if the OS cannot create a thread. See B1.

**Check 2: mutations.** Table below. Each mutation was applied to the working tree at c93d0ec, run, then reverted with `git checkout`. `git status --porcelain` was empty after every revert. No verify-mutation run was used.

**Check 3: suites at c93d0ec (exit codes read directly)**
- `cargo test -p spatial-engine`: rc 0. 383 passed, 0 failed, 12 ignored.
- `cargo test -p spatial-engine --features fixture`: rc 0. 383 passed, 0 failed, 12 ignored.
- `cargo test -p spatial-kernel`: rc 0. 305 passed, 0 failed, 28 ignored.
- In C:/dev/spatial-ide at 39ee43b: `node --test` rc 0 (353/353); verify-cites rc 0; verify-quotes rc 0; verify rc 0. The last three are also rc 0 in the worktree at c93d0ec.
- T5 also passed three extra standalone local runs. Locally that is 5 of 5.

**Check 4: c93d0ec is formatting only (confirmed)**
- Hash of each file with whitespace and `,{};` removed, identical at fb98e43 and c93d0ec:
  - cancel.rs: e5cdbbc5…ac6db
  - cancel_execute_window.rs: e1717e17…0244e
  - README.md: c4370291…60cdb2
  - stream.rs is untouched by c93d0ec: b5318973…2968
- `rustfmt --check --edition 2021` hunk counts (cancel.rs / stream.rs / cancel_execute_window.rs):
  - c6f61f5: 6 / 47 / file absent
  - fb98e43: 12 / 47 / 5
  - c93d0ec: 6 / 47 / 0

**Check 5: Amendment 2's figure and Amendment 1's P0-2 facts (both confirmed)**
- numstat c6f61f5...c93d0ec: README 4+0, cancel.rs 266+4, stream.rs 28+18, test 109+0. That is 429 over 4 files, matching Amendment 2.
- At fb98e43 the numstat is 2+0, 251+4, 28+18, 92+0, which is 395.
- §7 is unedited: the diff c6f61f5→39ee43b only appends §10.
- The archive's sha256 is e11f1209cdbb2a99b2ea2d348de21bdfb01dc494b55d1271df94b09c52bf229c, matching Amendment 1.
- The worker's extracted client_context.cpp and the copy streamed from the archive both hash d5b4d9c1…5a5d.
- Clears are at lines 692 (`InitialCleanup`), 1084 (`Query`, failed batch statement), 1198 (`ClearInterrupt`) and 1248 (`RunFunctionInTransactionInternal`, inside the auto-commit branch). `Interrupt` at 1189-1190 only sets the flag.
- The `InitialCleanup` callers are at 781/792 (both `Prepare`), 812 (`PendingQueryPreparedInternal`), 1108, 1136, 1160, 1203 and 1363. This matches the amendment.
- Cargo.lock:1188 is the checksum line, 6cb514da…1d95.

**Check 6: the form's three `@ 8efc554` pins.** All recompute exactly: A5.md:122 gives 8ed06688…0cb9, stream.rs:1755-1764 gives 32ad5706…6df3, cancel.rs:85-92 gives 7e4db8cf…65c3.

**Check 7: caller rule (confirmed)**
- `execute_guarded` and `Guarded` have their product caller at stream.rs:1771-1786.
- `is_executing` is called only from tests (cancel_execute_window.rs:76,102). Its doc (cancel.rs:177-184) states the round 5 item 4 accessor, its only caller by name, and the reason.
- The six sibling files hash the same at 8efc554 and c93d0ec, and the diff does not touch dataset.rs, index.rs, rowgroup.rs or layout.rs.

**Check 8: `gh pr checks 146` rc 1, one failing check**
- `cargo test --workspace (windows-latest)` **fail**: run 36703920918, the pull_request event on c93d0ec.
- The push run 36703531817 on the same SHA passed. Everything else passed: signed-off, both tauri builds, and both typecheck/vitest jobs.
- The failing log shows `a_cancel_inside_the_producers_execute_window_ends_the_stream_cancelled ... FAILED`, panicking at engine\tests\cancel_execute_window.rs:77:9 with "timed out waiting for the producer to start executing", after 77.00 s. See B2.

**Mutation table (all applied on c93d0ec, all rc 101, all reverted, porcelain empty after each)**

| Test | Mutation | Failing assertion |
|---|---|---|
| P0-1 `an_interrupt_raised_after_prepare_is_cleared_when_execution_begins` | the execute routed through `execute_guarded` | cancel.rs:337:9 "an interrupt raised between prepare and execute must not fail execution: Some("Cancelled")" |
| T2 `a_cancel_landing_before_execution_begins_is_re_raised_once_it_has` | spawn condition prefixed `false &&` (cancel.rs:120) | cancel.rs:389:9 "the re-interrupter must end the query before the liveness watchdog does" (printed 60.0009 s) |
| T3 `the_re_interrupter_exits_when_the_execute_window_closes` | loop condition reduced to `!bound` (cancel.rs:128) | cancel.rs:256:13 "timed out waiting for: the re-interrupter thread to exit" |
| T4 `a_cancel_after_execution_returns_is_seen_by_the_post_return_check` | step 4's arm reduced to `Ok(v) => Guarded::Ok(v)` | cancel.rs:446:9 "a cancel observed after the closure returned Ok must still end the guard as Cancelled" |
| T5 `a_cancel_inside_the_producers_execute_window_ends_the_stream_cancelled` | `stream_arrow` matched directly, outside the guard (stream.rs:1771) | cancel_execute_window.rs:77:9 "timed out waiting for the producer to start executing" (99.87 s) |

**Blocking**

- **B1: a panic on spawn failure (form §8 item 5; also against §2 item 3's declared residual).**
  - cancel.rs:122 calls `std::thread::spawn`, which panics when the OS refuses a thread. §2 item 3 declares that there is no panic on that path.
  - `cancel_inner` also runs from `cancel_for_drop` in `BatchStream`'s `Drop` (cancel.rs:99-101). A panic there during unwinding aborts the process.
  - The fix has an in-tree precedent at stream.rs:1201-1203: use `std::thread::Builder::new().name(..).spawn(..)` and discard the `Err`, so stopping degrades as §2 item 3 declares.

- **B2: PR CI is red on c93d0ec, and §5's third invalidator fired.**
  - T5 missed its window on the windows-latest runner (run 36703920918, cancel_execute_window.rs:77). Per §5, that makes the run invalid and requires F3 to be re-declared by a class-2 amendment. None has been filed.
  - The missed-window failure uses the same assertion as T5's mutation failure (see the table). As written, T5 cannot tell its invalidator apart from its mutation.
  - Hypothesis, not measured: the viewport lies wholly outside the extent (cancel_execute_window.rs:35-47), so DuckDB can prune every row group from the bbox statistics. If so, `stream_arrow` does not scan the whole file, and F3's premise in §3 does not hold on a fast runner.
  - Local runs passed 5 of 5; CI passed 1 of 2.

**Non-blocking**

- **N1:** Nothing resets `in_execute` on unwind (cancel.rs:163-164). If `f` panics, `is_executing()` stays true. The producer path also has no detach-on-panic, so a later cancel would spawn a re-interrupter that never exits. An RAII reset would close this.
- **N2:** After waking from its sleep, the re-interrupter interrupts without rechecking `in_execute` (cancel.rs:131-138). This allows one extra interrupt after the window closes. It is harmless: the token is cancelled and the slot is still this stream's. But §2 item 1's "while in_execute is set" is stricter than the code. A recheck under the slot lock would align them.
- **N3:** The module header (cancel.rs:12-14) says DuckDB clears at the start of every `RunFunctionInTransactionInternal`. Line 1248 of the source and Amendment 1 both show that clear happens only when it opens an auto-commit transaction.
- **N4:** Two stale texts outside §2's scope remain: the README blockquote at engine/README.md:46 still says "the only thing", and the `lease_for_stream` doc (named false in §0) is at dataset.rs:1751-1752. Carry both to `engine-cancel-before-execute-siblings`.
- **N5:** The re-interrupter thread is unnamed; the producer thread is named.
- **N6:** The T5 fixture path is a fixed shared temp file (cancel_execute_window.rs:24-28). Concurrent runs on one machine would collide.

Paths:
- C:/dev/wt/cancel-before-execute/engine/src/cancel.rs
- C:/dev/wt/cancel-before-execute/engine/src/stream.rs
- C:/dev/wt/cancel-before-execute/engine/tests/cancel_execute_window.rs
- C:/dev/spatial-ide/engine/CANCEL-BEFORE-EXECUTE-PREREGISTRATION.md

The worktree is clean (porcelain empty). Main was not changed. An untracked `state/consults/gates/2026-09-30-cancel-before-execute-gate1-architect.md` already exists on main; I did not create it.
