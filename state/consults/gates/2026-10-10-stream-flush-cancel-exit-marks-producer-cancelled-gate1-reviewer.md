# PR #201 gate 1 — reviewer
Reviewed: cut/stream-flush-cancel-exit-marks-producer-cancelled @ 8d494d02ccd72f688ea09f55c221690ce49ec0b6

**Verdict: PASS.** I found no Correctness or Evidence finding. One Documentation finding (D-1) must be fixed in this PR before the merge. It needs no re-gate.

Base B = `git merge-base origin/main HEAD` = 82ceae7fca2795212dbb7693ef47cd425b579188. origin/main was at 9b28dc68 when I read it. The branch merges cleanly with it (`git merge-tree` rc 0). Since B, main has changed the form only, adding 10 lines; it has not touched `engine/`'s code or README, `kernel/src` or `kernel/tests`.

## Correctness
None.

- **Diff** (`origin/main...origin/cut/…`): three files only, `engine/README.md`, `engine/src/stream.rs` and `engine/src/trace.rs`.
- **C1** (`flush`): the mark is the first statement in the `if cancel.is_cancelled()` branch, before the `batches_after_cancel` increment and the return. All four `flush` call sites carry the error out with `)?;` (head lines 2028, 2077, 2113, 2133), so `produce` returns and the event is stamped at most once.
- **C2** (`produce`): the mark comes after `PRODUCER_STARTED` and before the pre-prepare return.
- **Nothing else in product code changed.** That covers `classify`, the send arm, the counters and their order, `cancel.rs` and `Drop`.
- **The only places that stamp `PRODUCER_CANCELLED`** are stream.rs lines 1781, 1831, 1840, 1887, 1920, 1987 and 2544.
- **Cross-crate readers:** `kernel/tests/{first_batch_factorial,skp_admission,skp_filter_cancellation,trace_spans}.rs` and `engine/tests/slice.rs` read the event with `first()` or presence only. Nothing counts it exactly once.
- **The trace.rs move:** `TEST_LOCK` is `#[cfg(test)] pub(crate)` at module level. Its doc moved byte-identical. `Mutex` was already imported at module level.
- **The only added line containing `pub`** is that `pub(crate)` lock. No added comment holds a path:line cite.
- **Can T-1's (iv) be satisfied by a stray stamp?** No.
  - No test in `engine/src` outside trace.rs and stream.rs calls `trace::start`.
  - The only in-crate real streams (`stream_projected_with_cancel` and `stream_for_publish`, both with `CancelToken::new()`) drain to disconnection.
  - T-1 and T-2 serialize on `TEST_LOCK`.
  - So M-1 and M-2 cannot be masked by another test's stamp. (v) is ordered correctly, because T-1's own `cancel()` comes before `flush`.

## Evidence
None blocking.

- **§7 counts**, by `git diff --numstat 82ceae7f HEAD -- engine/src/stream.rs engine/src/trace.rs`:
  - stream.rs: 121 added, 1 deleted. trace.rs: 8 added, 7 deleted. **Total 137 of 150.**
  - stream.rs outside `mod tests`, from the `-U0` hunks at 1779, 1781 and 2542-2544: **6 of 10.**
  - trace.rs: **15 of 15.**
  - Three branch files, plus the form and PLAN on main: at most 5. No overrun.
- **Hash pins:**
  - The form has 87 `path:line @ rev sha256` references, 82 of them distinct: 84 at f0fccfaf, 2 at a82ba6d3 and 1 at 82ceae7f. I recomputed each with `git show <rev>:<path> | sed -n a,bp | sha256sum`: **82 of 82 match, 0 mismatches.**
  - f0fccfaf and a82ba6d3 are on main.
  - The impact read's whole-file hash 4357adab… and the worker report's line-5-to-end hash 4b6ae7e0… both match.
  - The form's commits 82ceae7f and d9bdc3a0 delete no line (append-only holds).
- **M-1 and M-2:** I took both from the report; I did not re-observe them myself. My attempt to apply M-1 (deleting C1's mark line in the worktree) was refused by the permission classifier. I did not pursue it, the tree was never changed, and porcelain is empty.
  - The record is complete for each: commit 0a3d6de4, command, test name, exit 101, panic message. The reported panic lines (2999:9 and 3051:9 in the mutated tree) agree with the head's assertion lines 3000 and 3052 minus the one deleted line.
  - No `verify-mutation` run is called an observation, in the report or the PR body.
- **E-1 and E-2:** read from the report, not re-run.
  - The patch text is byte-copied in the report and sits immediately before flush's check at B (stream.rs:2539 @ 82ceae7f), matching phase B's placement in the experiment README.
  - The record shows `git apply --check`, apply and `apply -R` each rc 0, with porcelain and `git diff` empty afterwards. rustc 1.97.1 is recorded.
  - E-1 gave 0 of 20 at 82ceae7f and E-2 gave 0 of 20 at 0a3d6de4. Amendment 2 records this as class 2, and the E claim falls back to T-1.
  - No `SCRATCH` and no `from_millis(20)` is in the tree (`git grep` rc 1).
- **CI** (`gh pr checks 201`): all 13 lines pass, every run at head 8d494d02. That includes `cargo test --workspace (windows-latest)` twice (18m46s and 18m49s) and the ubuntu-24.04 runs twice, so P-4 holds on both platforms.

## Documentation (must-fix before the merge)

- **D-1.** §6 says the custodian files the E logs and the patch text as evidence. The patch text is filed, byte-copied inside worker report 1. The E-1 and E-2 run logs and their per-run summary are not on origin/main at 9b28dc68; they are only in the worker's scratch folder, by the report's own account. §9 lists "E-1 and E-2 with their commits and logs" for the reviewer.
  - **Fix:** file the logs, or record in the PR that they are not filed and why.
  - No claim rests on them, since the E claim fell back to T-1.

## §8, item by item
1. Pass. The form was committed at 5d26f84a and Amendment 1 at 82ceae7f, both before 9bfc686e and 0a3d6de4. Wire-bytes' merge 1280e7e0 is an ancestor of B.
2. Pass. `git diff --name-only 82ceae7f HEAD -- engine/tests kernel/tests` is empty.
3. Pass (see Correctness).
4. Pass. Both marks are on branches that return.
5. Pass. No seam, no new pub item; the only `cfg(test)` item is the lock.
6. Pass. Both tests take `TEST_LOCK` as their first statement and assert presence only. Neither has an absence or exact-list assertion.
7. Pass. The patch is not in the tree or the commits, and both worktrees were recorded clean.
8. Pass. No code for an out-of-scope row of §2.3.
9. Pass.
   - The flush comment's "leaves the budgeted interval no end" describes the state before the fix, as §2.5 does.
   - The PR body stays inside §1 and lists §1's may-not-claims.
10. Pass. No path:line cite in an added comment (grep rc 1).
11. Pass.
    - No §7 overrun, and §7 is not edited.
    - No scope addition: Amendment 2 names a two-core run as class 9 and does not run it.
    - No `verify-mutation` run is called an observation.
    - No test-text span is pinned by hash. lead-data's line cites name 0a3d6de4.

## Owner's index
- **The three replaced lines** (README 499, 513, 519) are byte-identical, by sha256, to lines 30, 46 and 62 of lead-data's update. The old lines (24, 40, 56) match B.
- **Pointers at the head, checked by script:**
  - All 44 test pins resolve to a `fn` in the named file. T-1 and T-2 sit inside `mod tests` (2641).
  - All 33 ceiling constants exist as `const` under `engine/src`, which confirms the erratum (33, not 34).
  - Every named file exists, and `engine/*-PREREGISTRATION.md` has 19 entries.
  - The Status lines of all listed ADRs agree: 16 Accepted; ADR-023 and ADR-036 Proposed.
  - `pub mod trace` is at lib.rs:115, and `PRODUCER_CANCELLED` is `pub const`.
  - kernel/README needs no change.

## PR body
- It matches the head and the report: 6 of 10, 137 of 150, 15 of 15, M-1 and M-2 at 0a3d6de4, 202 and 22 passed, and the erratum note.
- Low-profile direction: there is no outside issue or PR reference and no @mention in the title, the body, or the three commit messages. All three commits are signed off.

## Commands (worktree C:/dev/wt/flush at 8d494d02; CARGO_TARGET_DIR=D:/wt-targets/cov; CARGO_BUILD_JOBS=8; RUST_TEST_THREADS=8)

| Command | Hold (-What) | rc | Result |
|---|---|---|---|
| `cargo test -p spatial-engine --lib` | shared, "flush-cancel-exit gate: cargo test spatial-engine lib" | 0 | 202 passed; T-1 and T-2 ok |
| `cargo test -p spatial-engine --test slice` | shared, "flush-cancel-exit gate: cargo test spatial-engine slice" | 0 | 22 passed (`cancelling_mid_stream_stops_production_promptly` ok) |
| `cargo test -p spatial-kernel --test trace_spans --test skp_admission --test skp_filter_cancellation` | shared, "flush-cancel-exit gate: cargo test spatial-kernel three tests" | 0 | skp_admission 10, skp_filter_cancellation 1 (77.75 s), trace_spans 6 |
| `cargo clippy -p spatial-engine --all-targets` | shared, "flush-cancel-exit gate: cargo clippy spatial-engine all-targets" | 0 | warnings only on unchanged lines (stream.rs 2341, 2457, 3534; trace.rs 637, 658; engine/tests); none on an added line |
| `cargo fmt --all --check` | none (free) | 0 | clean |
| `verify-cites`, `verify-quotes`, `verify-test-claims`, `verify` (each `node scripts/plan/<name>.mjs`) | none | 0 each | stderr holds only pre-existing, baselined entries; none name this piece's files |
| the same three verify-* scripts in the main checkout (7511eafb) | none | 0 each | |
| `queue.mjs --check` | none | 0 | current |
| `site.mjs --check` | none | 0 | current |
| `cfg-boundary.mjs` | none | 0 | 18 sites, 0 outside every boundary |
| `node --test scripts/plan/*.test.mjs scripts/hooks/*.test.mjs scripts/evidence/*.test.mjs` | none | 0 | 457 pass, 0 fail |
| `gh pr checks 201` (polled every 120 s until settled) | none | 0 | 13 of 13 pass |

- Every hold was granted; no 96 to 99 code.
- No timing-sensitive failure was seen in any shared run.
- The M-1 apply was refused by the permission classifier before it ran, as reported under Evidence.

**Final state:** the worktree is at 8d494d02ccd72f688ea09f55c221690ce49ec0b6 on its branch, and `git status --porcelain` is empty. Nothing was committed, rebased, merged or published.
