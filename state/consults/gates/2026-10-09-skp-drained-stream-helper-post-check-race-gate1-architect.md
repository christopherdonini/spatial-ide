# PR #198 gate 1 — architect
Reviewed: cut/skp-drained-stream-helper-post-check-race @ 82a3c8cd0fb7fcc30f4aae49da82e6e981a10ade

**Verdict: pass with notes.** No Correctness or Evidence block. The merge waits on one open Evidence condition, E-1 (P-1 run alone). The five Documentation findings (D-1 to D-5) are must-fix in this PR before the merge, with no re-gate.

Unless a line says otherwise, branch cites are at 82a3c8cd. Main cites are at 8284498e. The form's pins are historical pins at a23e709b, and I re-derived each site by symbol in the tree, which is authoritative for the code. Every engine/src site the form pins sits at the same line in the tree (engine/src is unchanged on the branch).

## Correctness: pass

**§2, Part A (A4 before the guard).** The order holds as built:
- The touch (kernel/src/skp.rs:3497) comes before the first `next_into` (:3500).
- The loop counts `Ok` items only (:3501-3503) and clears `buf` after each one (:3504).
- A4 (:3506-3510) comes before the unchanged guard (:3511-3515).
- The queue is `sync_channel(MAX_QUEUED_BATCHES)` (engine/src/stream.rs:1237), and `MAX_QUEUED_BATCHES` is 2 (:85). The only `recv` on this path is the one inside `next_into` (:786). Each batch is one blocking send (:2561-2570).
- The post-check (:1330-1340) runs after `produce` returns, and the terminal follows it (:1343-1362).
- So when more than 2 `Ok` batches arrive, the send at index 2 finished after the first `next_into`, and that call comes after the touch.

**The arithmetic is correct.**
- `estimate_bytes` is 20·v + 12·r (:2288-2291), and the estimate adds row by row (:2037-2038).
- The cut happens before the append, and the incoming row's vertex estimate `wkb.len()/16` cannot undercount (:2007-2013). The cut after the append is at ≥ target (:2256). So each batch is at most its own `target_for`.
- `target_for` gives 65,536, then 262,144, then 1,048,576. `MIN_BATCH_BYTES` is 32 KiB and does not raise the first target (:66, :452-461).
- A row has at least 4 vertices (engine/src/fixture.rs:1251-1254, :1520-1531). Attribute bytes can only add.
- 5,000 × 92 = 460,000, which is more than 327,680. 50 features give 1 batch.
- The margin holds even if the closing vertex were not counted: 72-byte rows give 360,000 and 1,440,000, still above 327,680 and 1,376,256.

**B1 (before the terminal match).** The count assertion (engine/tests/session_identity.rs:500-504) comes before the match (:505), and it counts `Ok(_)` only (:493). The 132-byte bound at `avg_vertices` 12 checks: the spread is 6, so n is at least 6. M-B1's "at most 2 batches" checks too: 500 × 492 = 246,000.

**B2 (20,000 features and the moved touch).**
- The touch (:537) now comes before `cancel.cancel()` (:538).
- 20,000 × 92 = 1,840,000, which is more than 1,376,256, so the stream has at least 4 batches and the batch at index 2 is not the last.
- The send at index 2 finishes only after a `recv` that follows the cancel. After that send, every path to `Ok(())` passes a cancel check: the loop top (:1885), each row (:1975), and `flush` (:2540). The flag uses SeqCst (engine/src/cancel.rs:121, :168).
- An earlier cancel path (:1780, the execute guard, `classify` :2573-2579) is also caused by the cancel, which follows the touch.
- The terminal is therefore `Cancelled`, and the post-check reads after the touch. The argument is sound.

**§8, item by item.**
1. Clean. The base is b8ad22ff (#197 merged), and Amendment 1 precedes the code on the base.
2. Clean. The kernel/src/skp.rs hunks lie inside `mod ticket_drop_under_lock_regression` (:3399). There is nothing under engine/src, protocol/ or frontends/.
3. Clean. Four files, all on §7's list.
4. Clean. The set of `recv_timeout`, `Duration` and `Instant` sites in kernel/src/skp.rs is the same on main and on the branch, with lines offset only. `HANG_TIMEOUT` is still 5 s (:3410).
5. Clean. The added comments name symbols. There is no path:line.
6. Clean, as shown above.
7. Clean. `fixture()` delegates with 50 (:3412-3414), with its spec byte-identical to main's. `keyless()` and both `touch_modification_time` functions are unchanged. The nine helper reachers are exactly §4's list (:3591, :3625, :3691, :3736, :3843 ×3, :4059, :4167).
8. No hit, but see D-1.
9. Clean. Amendment 1 settled OPEN-1 before the Part B code.
10. Round-25 checks:
    - There is no §7 overrun. Part A is 67 of 110 and Part B 66 of 70, and §7 is unedited.
    - No `verify-mutation` run is called an observation.
    - No branch span is pinned by hash.
    - The worker's extra M-B1 and M-B2 notes are comments in §4's tests, inside §7's file and ceiling. They are not a class-9 scope addition.
    - One record finding: a span named without its commit id (D-4).

**§1.** Every claim made stays inside §1. The may-not-claim list is respected in the code and the report, with one wording issue in the PR body (D-1). No timing is claimed: the worker states the wall times without a number and says they were not relied on.

**The worker's three differences from the form.** All three are acceptable:
1. The rewritten B2 paragraph and the clean test's doc are required or harmless.
2. The extra notes are in scope (see item 10).
3. "Applied to a clean tree of 7469a801" is accurate.

**Owner's index against §9's bullet.** It matches:
- kernel/README.md:375 ends with this form's path.
- The Stream tickets and Close ordering lines (:353, :358) still resolve, and none is edited.
- engine/README.md:520 has the sub-bullet in the update's shape.
- The test pinned by :508 keeps its name (engine/tests/session_identity.rs:466).

**Timing line.** It is present and correct: no timing was introduced, and the existing bounds are unchanged. No record says the changed tests have no timeout.

## Evidence

**P-2 and P-3: established.** The observations, made at 7469a801, match §4:
- M-0 fails the predicted test. It also fails `after_cancelling…`, which the existing doc at kernel/src/skp.rs:3571-3579 already records.
- M-1 fails all nine at A4 with "got 1".
- M-2 fails at the guard.
- M-B1 fails with "got 2".
- M-B2 fails with `SourceChanged`.
- P-3 passed 20 of 20.

**E-1 (open; a merge condition, not a correction round): P-1 is not established.** In the shared hold, 19 of 20 runs passed. Run 3 failed at the 5 s `HANG_TIMEOUT` in `after_cancelling_a_ticket_whose_source_changed_the_next_viewport_query_refuses_by_name`.

§4's argument says the timed window holds no work that grows with the fixture: the stream is already drained, the producer has detached its token before the terminal (engine/src/stream.rs:1273), and the Drops only cancel or read a flag. The 5,000-feature fixtures still add load inside the process, beside the other tests' windows.

For the merge, the solo run must show all of the following:
- `cargo test -p spatial-kernel --lib ticket_drop_under_lock_regression` with no extra filter.
- A build whose kernel/src/skp.rs equals 82a3c8cd's (be7eecb3 or 82a3c8cd), named by commit id.
- One pre-declared set of 20 runs under the custodian's exclusive hold, with the thread setting recorded.
- 20 of 20 runs, each "22 passed; 0 failed".
- The result added to the PR body with the commit, the hold and the count.

A failure in the solo set is a failure. It falsifies P-1: stop, do not re-run toward a pass, and return to the architect. In that case the first suspect is the larger fixture's load inside the process against the 5 s window. If the solo set passes 20 of 20, no re-gate is needed.

## Documentation (each must be fixed before the merge)

- **D-1 (PR body, opening paragraph and "What changed").**
  - "That happened twice in CI on ubuntu" follows the race narrative, so it reads as a claim that CI's cause was observed. §1 forbids that claim, and §8 item 8 blocks it on sight. Reword it: the guard failed twice in CI; that is consistent with §0.3's cause read from code (M-2) and was not observed to be it.
  - "That makes the post-check run after the touch" gives the cause to the assertion. Say instead that the 5,000-feature fixture makes at least 3 batches, and A4 states the condition under which the post-check reads after the touch (§1's form of the claim).
- **D-2 (PR body).**
  - The Reports list leaves out `state/consults/2026-10-09-skp-drained-stream-helper-post-check-race-worker-report-2.md`, the run that made the head commit. Add it.
  - The M-0 row names one failing test. The report records two (worker report 1, MUTATIONS, M-0). Name both.
- **D-3 (the owner's-index update as filed).**
  - state/consults/2026-10-09-skp-drained-stream-helper-post-check-race-owners-index-update.md:94-95 @ 8284498e states 51 and 39 test pointers.
  - My count is 45 (kernel/README.md:352-366) and 40 (engine/README.md:501-513), and lead-data's own correction gives the same numbers. The filed record carries no correction.
  - Add one correction sentence, in a custodian's filing note or a PR-body line. No pointer is unresolved, so "Last verified at" stands.
- **D-4 (worker report 1, PREDICTIONS; round 25, item 2).**
  - The P-1 and P-3 loops name no commit.
  - "skp.rs:3783" is a test-text span on an unmerged branch named without its commit id. It resolves to the cancel-timeout `panic!` at be7eecb3, whose kernel/src/skp.rs equals 82a3c8cd's.
  - Fix in the PR body: name the commit each loop ran at, taken from the transcript, and the span's commit.
- **D-5 (form, Amendment 1 item 3).**
  - The superseded index points to "§3's OPEN-1", but the form's §3 is Fixtures, and the form never defines OPEN-1.
  - It is defined in `state/consults/2026-10-09-skp-drained-stream-helper-post-check-race-architect-draft.md` (its OPEN-1 entry).
  - Append a correction of at most three sentences that names that source. The form is on §7's file list.

## Observation outside this diff (not a finding of this PR)

The doc of `Dataset::stream` at engine/src/stream.rs:898-899 says the first batch is produced on the first `next_into` call. That is false by §0.3: the producer is spawned inside the call, and up to `MAX_QUEUED_BATCHES` sends finish before any `next_into`. That false premise is the one this flake rested on. §8 item 2 forbids engine/src edits here, so the doc fix should go in as a proposed node.

No ADR is needed.
