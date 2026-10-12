# PR #201 gate 1 — architect
Reviewed: cut/stream-flush-cancel-exit-marks-producer-cancelled @ 8d494d02ccd72f688ea09f55c221690ce49ec0b6

**Verdict: pass.** No Correctness or Evidence finding. There are four Documentation findings (D-1 to D-4). Each must be fixed in this PR before the merge, with no re-gate.

**How I read it.** The code is from the worktree at the head. The branch is 82ceae7f plus 9bfc686e, 0a3d6de4 and 8d494d02, by the branch reflog. Amendment 2 is not on the branch. I read it on main at d9bdc3a0, where it appends to the form with lines 1 to 313 matching the branch's copy. I have no shell, so I recomputed no hash, ran no `git diff --numstat`, and did not check the PR's file list. Those are the reviewer's. My line counts come from reading the code. They agree with the report: outside `mod tests`, 5 lines added and 1 deleted. In `mod tests`, 116 lines added (2946-3061). In trace.rs, 8 added and 7 deleted. That is 137 in total.

## §2's readings, as built
- **C1:** engine/src/stream.rs:2541-2549. The mark is the first statement in the `if cancel.is_cancelled()` branch, after a new two-line comment. The H2 comment, the `batches_after_cancel` increment and the return are unchanged.
  - The form said "the H2 comment gains at most two lines". The worker added a separate two-line comment above the mark instead. The effect is the same and nothing further was needed. The report's differences list does not mention it.
- **C2:** engine/src/stream.rs:1779-1783. One comment line is extended and the mark comes before the return. The check itself is unchanged.
- **The lock's move:** engine/src/trace.rs:554-560. The doc moved unchanged. It is `#[cfg(test)] pub(crate)`. `Mutex` was already imported at module level (trace.rs:48), and trace.rs's tests use it through `use super::*`.
- **2.3, the out-of-scope rows:** untouched.
  - prepare's Err through classify: 1785-1787.
  - the two-read arms: 1839-1841 and 1919-1921, with `classify` at 2577-2583.
  - the send to a gone receiver: 2565-2574.
  - The proposed node exists in PLAN.yaml, depending on this piece.
- **2.4, the four kernel tests:** the trace_spans argument holds as built.
  - `next_into` returns None only through `finished` or on disconnection (stream.rs:782-797). The test drains to None and panics on any Err.
  - `produce` returns before the lease is decided (1254-1295).
  - `quiesce` (trace_spans.rs:163-175) runs under `serial()` (145-149).
  - C1 and C2 add stamps only when the flag is set. No kernel test file is edited, and no test in any crate asserts that `producer_cancelled` is absent, except trace_spans.rs:355-358, which still holds.
- **2.5 and 2.6:** consistent with the code. The section is in-memory work over one batch, bounded by MAX_BATCH_BYTES at flush's head. A run stamped after a drop with no request gives None from `segment_ms`.

## ADR-018
- **Item 1:** both new marks sit right after the flag is read as set, and right before the producer stops advancing: a return, with no send. That matches `cancel_observed`.
- **Item 4:** §2.5 classifies the section as (a) in bytes only, and the stream-end call site as (b). No time bound is derived. This holds.

## §8, item by item
1. **Pass.** The form and Amendment 1 are in base 82ceae7f. PR #199's merge (1280e7e0) is an ancestor of it. Both code commits come after.
2. **Pass**, by the code I read and the report. The reviewer confirms the file list.
3. **Pass.** The only product change is 5 lines added and 1 deleted, all in C1 and C2.
4. **Pass.** Both marks sit on branches that return.
5. **Pass.** There is no product seam and no new pub item. The only cfg(test) item is the lock.
6. **Pass.** Both tests take `TEST_LOCK` as their first statement and assert only presence. There is no absence or exact-list assertion.
7. **Pass.** There is no sleep in flush at the head, and the report records a revert to a clean tree.
8. **Pass.**
9. **Pass.** See §1 below.
10. **Pass.** The new comments and test docs cite no path:line.
11. **Pass**, the round-25 items:
    - there is no §7 overrun, and §7 is not edited;
    - there is no scope addition, and Amendment 2 item 2 defers a two-core repeat as class 9;
    - neither record calls a `verify-mutation` run an observation;
    - no test-text span is pinned by hash, and the report's mutated-tree locations name 0a3d6de4.
    - A five-line form does not apply here.

## §1, now that the E claim falls back to T-1
- The fix's claim rests on T-1 and T-2 (a structural assertion forced at each exit) and on M-1 and M-2 observed at 0a3d6de4.
- E-1 and E-2 may be quoted only as counts that discriminate nothing.
- Nothing in the PR body rests on the E pair. P-2's line in the PR body says the E claim falls back to T-1.

## Amendment 2's class
- **Correct.** §5's invalidators list declares a 0 of 20 E-1 as class 2 with no stop, and that is what happened.
- My form named no affinity, although the experiment reproduced the failure only under two-core pinning (FLAKE-HUNT-RUN-1-2026-10-10-logs/README.md:6). E-1 is therefore a non-reproduction under different conditions. It is not evidence against the inferred mechanism, and Amendment 2 item 2 records the difference.

## The worker's differences
All are accepted:
- the affinity and the sleep-only patch are covered by Amendment 2 items 2 and 3, and §8 item 2 forbids the test-side diagnostics;
- the pipe through tail is covered by item 3;
- T-1's `try_recv` is the receiver half of the form's (iii), not an addition;
- the doc sentence dropped from trace.rs keeps that file at 15 lines without editing §7.

## The owner's index
- engine/README.md lines 499, 513 and 519 change, and nothing else.
- They match §9's bullet and lead-data's update, line for line.

## The PR body
It carries a Timing line saying no committed timing was introduced. Its counts, B, head and mutation claims agree with the report.

## Documentation findings (each must be fixed before the merge)
- **D-1. The PR body, line 1.** It says the other cancel exits "after the first batch" already stamped. The execute guard's Cancelled arm and execute's Err (stream.rs:1830-1843) come before any batch. Drop the qualifier. The human's directive (2026-10-10-flake-hunt-run-1-flush-cancel-exit.md:6) says the five other exits mark it.
- **D-2. The PR body's Predictions block.**
  - P-4's runs were at 0a3d6de4, not at "the head". The head differs from it only in engine/README.md, so name 0a3d6de4.
  - The form's P-4 is decided by CI on both platforms. State that result at the head, or say it is pending.
  - P-3's line should also say that E-2 discriminates nothing, as Amendment 2 item 1 does.
- **D-3. The PR body's line on the four kernel tests.**
  - It drops the form's conditions for skp_filter_cancellation: the flush exit is reachable "only if the scan reaches its matching tail before the cancel lands", and the pre-prepare exit only if the producer has not yet passed that check.
  - It also drops "it has not been observed doing so" for skp_admission.
  - Under the record cap, replace the line with a reference to §2.4.
- **D-4. Two records.**
  - (a) The erratum the PR body reports (33 ceiling constants, not 34) is recorded nowhere tracked. The filed owner's-index update still says 34 in its §2. I counted 33 at engine/README.md:525-529. Record the erratum by reference beside the filed update.
  - (b) Amendment 2's italic line gives the worker report's sha256 with no `@ <rev>`. Round 15 (e) needs that for a hash reference in an append-only record. The rev is the main commit that filed the report, which by its subject is d9bdc3a0. Add it in one appended reference line, with no prose.
