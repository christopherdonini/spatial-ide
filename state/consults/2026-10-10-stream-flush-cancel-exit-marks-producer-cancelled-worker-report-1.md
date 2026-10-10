*Custodian's filing note (2026-10-10): `stream-flush-cancel-exit-marks-producer-cancelled`'s worker report 1, the worker-high run 13:07:34Z to 13:48:10Z by its transcript, on `cut/stream-flush-cancel-exit-marks-producer-cancelled` from 82ceae7f, head 0a3d6de433828efab94d94b1ba65d7763ddc5186, published. It arrived as a message and is extracted here by script from the SubagentHandback call in the subagent's own transcript, with nothing changed except one final newline. Its sha256, from this file's line 5 to the end, is 4b6ae7e0d59b6ced9b8ebee5e67d06533422ba4f2f235a2d57f61a3853f385ba.*

---

REPORT: stream-flush-cancel-exit-marks-producer-cancelled (slot 2)

Built and pushed. Two things need the custodian's attention before the gates:
- E-1 gave 0 of 20. That is class 2, no stop, as the form says. E-2 also gave 0 of 20 and discriminates nothing.
- The experiment ran under taskset -c 0,1 (two cores, Linux). E-1 and E-2 ran on 8 unpinned Windows cores, because the form names no affinity (see "Differed from the form").

Everything else passed.

**B and commits**
- B = `git merge-base origin/main H` = 82ceae7fca2795212dbb7693ef47cd425b579188. `origin/main` was still at that commit when I fetched.
- 9bfc686e `chore: trace TEST_LOCK moved to module level (cfg(test), pub(crate)) so stream's tests can take it` (§2.2).
- 0a3d6de4 `fix: flush's cancel exit and the pre-prepare exit stamp PRODUCER_CANCELLED; T-1 and T-2` (§2.1 C1 and C2, T-1, T-2).
- H = 0a3d6de433828efab94d94b1ba65d7763ddc5186.
- Both commits are signed off and carry the Co-Authored-By trailer.

**§7 counts**
Command: `git diff --numstat 82ceae7fca2795212dbb7693ef47cd425b579188 HEAD -- engine/src/stream.rs engine/src/trace.rs`
- engine/src/stream.rs: 121 added, 1 deleted = 122.
- engine/src/trace.rs: 8 added, 7 deleted = 15.
- Total 137, ceiling 150.
- stream.rs outside `mod tests`: 5 added, 1 deleted = 6, ceiling 10.
- trace.rs: 15, ceiling 15 (the lock's move only).
- Files changed: 2 (non-generated ceiling 5). No overrun.

**T-1 and T-2 at H**
- `stream::tests::flush_cancel_exit_stamps_producer_cancelled_and_sends_nothing`: ok.
- `stream::tests::the_pre_prepare_cancel_exit_stamps_producer_cancelled`: ok.
- Both take `TEST_LOCK` as their first statement. Neither asserts an absence or an exact list of names.
- T-1 asserts (i) to (v) of §4.
- T-2 uses invalid SQL, an in-memory DuckDB connection and a token cancelled before the call.

**M-1 and M-2**
Each was observed by applying the edit to the working tree on top of H (0a3d6de4), running the named command, then `git checkout -- engine/src/stream.rs`. Neither mutation was committed. No `verify-mutation` run was used.
- M-1: deleted the `crate::trace::mark(crate::trace::PRODUCER_CANCELLED, 0, 0);` line in `flush`'s cancel branch.
  - Command: `cargo test -p spatial-engine --lib flush_cancel_exit`.
  - Result: `stream::tests::flush_cancel_exit_stamps_producer_cancelled_and_sends_nothing ... FAILED`, exit 101.
  - Message: `(iv) flush's cancel exit must stamp producer_cancelled`. This is the predicted assertion, at stream.rs:2999:9 in the mutated tree.
  - After the revert: `git status --porcelain` empty, `git diff` empty, HEAD 0a3d6de4.
- M-2: deleted the same mark line in `produce`'s pre-prepare check.
  - Command: `cargo test -p spatial-engine --lib the_pre_prepare_cancel_exit`.
  - Result: `stream::tests::the_pre_prepare_cancel_exit_stamps_producer_cancelled ... FAILED`, exit 101.
  - Message: `the pre-prepare cancel exit must stamp producer_cancelled`, at stream.rs:3051:9 in the mutated tree.
  - After the revert: clean, same check.

**E-1 and E-2**
- `rustc -V`: rustc 1.97.1 (8bab26f4f 2026-07-14), Windows MSVC.
- The patch is a single scratch file in my scratch folder, sha256 48cad7a6d22ff4010be18bdf238be296de8f976f46b09d8c0c2c9a21583b2cf0. It is byte-copied here from that file:
```
diff --git a/engine/src/stream.rs b/engine/src/stream.rs
--- a/engine/src/stream.rs
+++ b/engine/src/stream.rs
@@ -2539,2 +2539,6 @@ fn flush(
         .fetch_add(rows as u64, Ordering::SeqCst);
+    // SCRATCH (E-1/E-2, never committed): 20 ms before the cancel check, only while a trace is on.
+    if crate::trace::is_enabled() {
+        std::thread::sleep(std::time::Duration::from_millis(20));
+    }
     if cancel.is_cancelled() {
```
- The permission system did not refuse it.
- It is the sleep only. I did not apply the experiment's test-side diagnostics, because that would edit `engine/tests/slice.rs` (§8 item 2). A failure is therefore recognised by the panic location in the log.
- The summary script prints the panic location and the line after it for any panic. It printed neither for any run.
- E-1, base worktree `C:/dev/wt/flush-base`, detached at B, target `D:/wt-targets/flush-base`:
  - `git apply --check` rc 0, `git apply` rc 0. The diff showed only that hunk.
  - The slice test was built with the patch applied (cold, 18m51s), then 20 runs of `cargo test -p spatial-engine --test slice`.
  - Result: runs 1 to 20 all rc 0, 22 passed, 0 failed. **0 of 20 failed at the :809 expect**, no budget-assertion failures.
  - `git apply -R` rc 0. After the revert, porcelain is empty and `git diff` is 0 bytes.
  - `git worktree remove C:/dev/wt/flush-base` succeeded, and the worktree list no longer shows it.
  - `D:/wt-targets/flush-base` is still on disk. I did not delete it, so the custodian's sweep should.
- E-2, this worktree at H, target `D:/wt-targets/cov`:
  - Same apply and check.
  - The slice test was rebuilt with the patch (24.6 s), then 20 runs.
  - Result: runs 1 to 20 all rc 0, 22 passed. **0 of 20 failed at :809.** The falsification (any E-2 run failing at :809) did not fire.
  - `git apply -R` rc 0. After the revert, porcelain is empty and `git diff` is 0 bytes.
- Counts: E-1 0/20 (P-2 predicted at least 1/20), E-2 0/20 (P-3 predicted 0/20). Because E-1 is 0/20, E-2 discriminates nothing, and §1's E claim falls back to T-1 alone (§5). No rate and no absence of the race is claimed.
- The run logs and the per-run summary are in my scratch folder (e1, e2 subfolders). They are not in the repository. The custodian files evidence from them, or I can paste them.
- Why E-1 may be 0/20 here is an inference, not an observation. The experiment pinned the process to two cores. On 8 cores the test thread probably cancels within microseconds of receiving batch 0, so the producer's per-row check (which marks) probably catches the cancel before flush's check.

**Suites at H** (all with no patch applied)
- `cargo test -p spatial-engine --lib`: exit 0, 202 passed.
- `cargo test -p spatial-engine --test slice`: exit 0, 22 passed.
- `cargo test -p spatial-kernel --test trace_spans --test skp_admission --test skp_filter_cancellation`: exit 0. skp_admission 10 passed, skp_filter_cancellation 1 passed (42.5 s), trace_spans 6 passed (31.6 s).
- `cargo fmt --all --check`: exit 0, run outside a hold (it is free).
- `cargo clippy -p spatial-engine --all-targets`: exit 0.
  - It prints warnings in other tests and in `src`, all on pre-existing code (e.g. `flush` too_many_arguments, trace.rs `*five_leg.last()` deref).
  - Nothing is on an added line. Clippy's own lines for the added tests are 2943 to 3065.

**Every heavy command**
All were run with CARGO_BUILD_JOBS=8 and RUST_TEST_THREADS=8. All holds were `hold shared -Project SpatialIDE` and were granted with no 96 to 99 codes. Targets: `D:/wt-targets/cov`, except E-1's build and runs, which used `D:/wt-targets/flush-base`.

| What ran | Exit code | Hold (-What) |
|---|---|---|
| lib T-1 and T-2 | 0 | "flush-cancel-exit: engine lib T-1 T-2 build and run" |
| M-1 | 101, the expected test failure | "M-1 lib test run" |
| M-2 | 101, the expected test failure | "M-2 lib test run" |
| E-1 slice build at base | 0 | "E-1 slice test build at base" |
| E-1 20 runs | 0 | "E-1 slice test 20 runs at base" |
| E-2 slice build at H | 0 | "E-2 slice test build at H" |
| E-2 20 runs | 0 | "E-2 slice test 20 runs at H" |
| spatial-engine lib | 0 | "spatial-engine lib tests" |
| spatial-engine slice | 0 | "spatial-engine slice test" |
| kernel three tests | 0 | "kernel trace_spans skp_admission skp_filter_cancellation" |
| clippy | 0 | "clippy spatial-engine all-targets" |

Each -What text was prefixed "flush-cancel-exit: ".

No timing-dependent failure was seen in any shared run, so there is nothing to re-run alone.

**§8, item by item**
1. Nothing was written before the form was committed. The form and Amendment 1 were in my base 82ceae7f. I did not independently check the wire-bytes merge; the log shows PR #199 merged.
2. `engine/tests/slice.rs` and the four kernel test files are untouched. The diff names only `engine/src/stream.rs` and `engine/src/trace.rs`.
3. There is no product change beyond C1 and C2. `classify`, the send arm, the counters and their order, the checks, `cancel.rs`, `Drop`, and trace.rs's product items are untouched.
4. Both marks sit on branches that return at once. Neither is in a loop.
5. No product seam and no new pub item. The only `cfg(test)` item added is `TEST_LOCK`, as `pub(crate)`.
6. T-1 and T-2 take `TEST_LOCK` first. They tolerate no absent `PRODUCER_CANCELLED`, and they assert no absence or exact list of names.
7. The patch was never committed or pushed. It is reverted and both worktrees were shown clean. The branch's two commits touch only stream.rs and trace.rs.
8. No code for the out-of-scope rows of §2.3.
9. No claim beyond §1.
10. No path:line cite appears in any added code comment (checked by grep on the diff).
11. The round-25 items:
    - There is no §7 overrun.
    - There is no scope addition.
    - No `verify-mutation` run is called an observation.
    - No test-text span is pinned.

**Differed from the form**
- Affinity. The form names no affinity, so E-1 and E-2 ran on 8 unpinned Windows cores. The experiment's phases A, B and C ran under `taskset -c 0,1`. Whether to repeat E with a two-core affinity is the custodian's and the architect's call. I did not add runs, because §7 fixes 20 per worktree.
- Patch scope. I applied the sleep only, with no test-side diagnostics (see above).
- Hold shape. One run (the slice suite) piped its output through `tail`, with rc taken from PIPESTATUS. That is a small deviation from "the command is its own step". The exit code was 0 and the tail showed `test result: ok. 22 passed`. All other holds follow the prescribed shape.
- T-1 adds a fifth assertion beyond the form's list: `rx.try_recv().is_err()`, which is (iii).
- trace.rs: I dropped a doc sentence I had first written about the lock being module-level, to stay at exactly 15 lines.

**Not done, as ordered**
- engine/README.md owner's-index update (lead-data writes it), PLAN.yaml, the form, and the PR.

**Final state**
- `git status --porcelain` in `C:/dev/wt/flush` is empty.
- HEAD is 0a3d6de433828efab94d94b1ba65d7763ddc5186.
- Published with `git push -u origin cut/stream-flush-cancel-exit-marks-producer-cancelled`. The branch tracks origin and is up to date.
- No force, no rebase, nothing on main, no PR.
