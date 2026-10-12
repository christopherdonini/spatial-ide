# PR #198 gate 1 — reviewer
Reviewed: cut/skp-drained-stream-helper-post-check-race @ 82a3c8cd0fb7fcc30f4aae49da82e6e981a10ade

**Verdict: PASS.** Nothing blocks on Correctness or Evidence. One Evidence condition is still open, and it is the custodian's: P-1's 20-run prediction, run alone. It was not established in a shared run, and that is not a failure (see E-1). Five Documentation findings must be fixed in this PR before the merge, with no re-gate.

Main moved during the gate, from 8284498e to 608a8aa4. The new commits add the architect's gate 1, worker report 2 and the form's Amendment 2. I read all three. Worker report 2's body hash recomputes to b12ebe69…, as its filing note states. Amendment 2 fixes the dangling "§3's OPEN-1" reference in Amendment 1 item 3, which I had also found, so that one is not repeated below.

## Correctness: pass

**The diff** (`origin/main...origin/cut/skp-drained-stream-helper-post-check-race`, merge-base b8ad22ff):
- Four files: kernel/src/skp.rs (+58 −9), engine/tests/session_identity.rs (+54 −12), kernel/README.md (+2 −2), engine/README.md (+2 −1).
- At b8ad22ff, `mod ticket_drop_under_lock_regression` spans lines 3399 to 4969. All 13 skp.rs hunks fall inside it, from 3405 to 4118 on the base side.

**Part A, checked against the code:**
- `fixture()` delegates to `fixture_with_features(name, 50)` with the same spec.
- The 5,000 literal appears at one site only.
- The helper is called from 5 sites: `seeded_pending_ticket` (which serves the cancel, sweep and cancel_all tests), after_cancelling, `UnwindSetup::new`, sweep-emits and close-drop. All 7 fixture calls on those paths now use `drained_stream_fixture`.
- The 11 remaining `fixture()` callers do not reach the helper.
- A4 counts only `Ok` items, clears `buf` on every item, and sits before the guard. The guard is unchanged.

**The ordering argument, checked against the engine:**
- The channel is `sync_channel(MAX_QUEUED_BATCHES)` and carries only `Ok(Item)` batches and the terminal `Err`.
- `next_into`'s `recv` is the only receive.
- The post-check and the flag are written after `produce` returns and before any terminal.
- Rows are at least 4 vertices: `ring` closes n ≥ 4 points, and `estimate_bytes` gives 20·v + 12.
- `target_for` sums to 65,536 + 262,144 = 327,680 bytes, and adding `TARGET_BATCH_BYTES` gives 1,376,256.
- The argument holds.

**Part B:**
- B1's count is `Ok(_) => batches += 1`, placed before the terminal match.
- B2 swaps only the touch and the cancel, keeps its assertions, and keeps the `None` arm.
- `keyless()` and both copies of `touch_modification_time` are unchanged.

**§8, item by item:**
1. Code came after the form (8604c819) and after #197's merge: the base is b8ad22ff. Part B's commit 7469a801 has Amendment 1 (76a09d5c) as an ancestor.
2. Nothing under protocol/, frontends/ or engine/src. No skp.rs edit outside the module. No Cargo.lock, package-lock.json or wire fixture.
3. The diff stays within §7's files.
4. A grep of the added lines finds no sleep, `Duration::`, `recv_timeout` or `Instant`. `HANG_TIMEOUT` and `run_with_timeout` are untouched.
5. No path:line cite in any added comment.
6. A4 comes before the guard, B1 before the terminal match, and both count `Ok` items only.
7. `fixture()`'s output and `keyless()` are unchanged. Only the tests §4 lists changed.
8. The code makes no claim beyond §1: the M-2 note says the result is consistent with CI's failure, not that it was the cause. The PR body is covered in D-1.
9. Satisfied by Amendment 1.
10. No §7 overrun, no scope addition, and no verify-mutation run. No branch span is pinned by hash. One branch span is named without its commit id: D-4.

**clippy:** the only warning in a touched file is kernel/src/skp.rs:277, which is not an added line. No warning in session_identity.rs.

## Evidence: pass, with E-1 open

**§7 counts.** The form's command, `git diff --numstat b8ad22ff 82a3c8cd -- kernel/src/skp.rs engine/tests/session_identity.rs`, exit code 0:
- Part A: 58 + 9 = 67 changed lines, against a ceiling of 110.
- Part B: 54 + 12 = 66, against 70.
- 4 non-generated files in the diff, plus the form and PLAN.yaml on main, which is at most 6.
- No overrun.

**Hash pins.** All 67 `path:line @ rev sha256:` pins in the form recompute to their stated hashes, by `git show <rev>:<path> | sed -n 'a,bp' | sha256sum`: 66 at a23e709b and 1 at b4dc05e0 (the ruling's lines 48 and 49). None mismatches. The impact read's whole-file hash, 9ed71a48…, matches the file at a23e709b, its only commit, and at main. Worker report 1's body hash recomputes to 7b3d139d…, as its filing note states.

**Mutations, from the record.** The worker report and the code's notes name all five, each observed at 7469a801:
- M-0 failed `cancel_of_…`, and also `after_cancelling_…`.
- M-1 failed all nine tests, each by name, at A4 with a count of 1, and no other test.
- M-2 failed the same nine at the guard.
- M-B1 failed at B1 with a count of 2.
- M-B2 failed at the first assertion with `SourceChanged`.

These match §4.

**Mutations, observed again by me.** Each was applied to 82a3c8cd in the worktree, run in its own shared hold, then reverted with `git checkout --`, and `git status --porcelain` was empty after each. Line numbers below are at 82a3c8cd with the mutation applied.
- **M-0** (`retired = Some(std::mem::replace(…))` changed to `*state = TicketState::CancelledBeforeRedeem { cancelled_at: Instant::now() };`): rc 101; 20 passed, 2 failed.
  - `cancel_of_a_pending_ticket_whose_post_check_found_a_change_does_not_hang` panicked at skp.rs:3595 with the did-not-return-within-5s message.
  - `after_cancelling_a_ticket_whose_source_changed_the_next_viewport_query_refuses_by_name` panicked at skp.rs:3778.
- **M-1** (5_000 to 50): rc 101; 13 passed, 9 failed, all nine at skp.rs:3506 (A4). The output read: the ordering argument needs more batches than the queue holds (2); got 1. The nine:
  - cancel_of_a_pending_ticket_whose_post_check_found_a_change_does_not_hang
  - sweep_of_an_expired_pending_ticket_whose_post_check_found_a_change_does_not_hang
  - cancel_all_for_dataset_of_a_pending_ticket_whose_post_check_found_a_change_does_not_hang
  - after_cancelling_a_ticket_whose_source_changed_the_next_viewport_query_refuses_by_name
  - a_pending_ticket_retired_by_sweep_emits_once_and_does_not_hang
  - a_pending_drop_inside_close_emits_once_with_its_session_reference
  - an_unwind_through_cancel_drops_its_swept_source_after_releasing_the_guard
  - an_unwind_through_cancel_all_for_dataset_drops_its_swept_source_after_releasing_the_guard
  - an_unwind_through_cancel_all_for_dataset_drops_its_retired_source_after_releasing_the_guard
- **M-2** (the touch moved after the drain loop): rc 101; 13 passed, and the same nine failed at skp.rs:3511, the guard, past A4. after_cancelling is among them.
- **M-B1** (5_000 to 500): rc 101; 17 passed, 1 failed. `a_clean_stream_whose_source_changed_terminates_as_source_changed` failed at session_identity.rs:500 with got 2.
- **M-B2** (`cancel.cancel()` moved after the drain): rc 101; 17 passed, 1 failed. `a_cancelled_stream_keeps_its_cancelled_terminal_while_the_change_is_still_recorded` failed at session_identity.rs:554 with `Some(SourceChanged { detail: "{mtime}" })`.

**P-3,** once at 82a3c8cd in a shared hold: rc 0, 18 passed, 0 failed.

**P-1,** once at 82a3c8cd in a shared hold: rc 0, 22 passed, 0 failed.

**E-1 (open; a merge condition, not a correction round).** P-1's 20-run prediction is not established. The worker's shared set gave 19 of 20; run 3 hit the 5 s `HANG_TIMEOUT` in after_cancelling. Under the machine rule that is not a failure. The custodian's 20 runs alone, under an exclusive hold, settle it.

One point for that run. §4's argument covers each test's own timed window: the stream is already drained, and the Drops only cancel or read a flag. But the nine 5,000-feature fixtures add CPU work inside the process while other tests' 5 s windows are open. If the solo set fails at a hang bound, that load is the first suspect, not the ordering argument.

**CI,** `gh pr checks 198`, exit code 0. All runs are at head 82a3c8cd, waited out with `gh run watch --interval 115`:
```
L1 portable correctness · cargo test --workspace (ubuntu-24.04)	pass	4m57s	https://github.com/christopherdonini/spatial-ide/actions/runs/37953459458/job/113898276864
L1 portable correctness · cargo test --workspace (ubuntu-24.04)	pass	4m46s	https://github.com/christopherdonini/spatial-ide/actions/runs/37953926761/job/113899486917
cargo fmt --check (workspace and src-tauri)	pass	11s	https://github.com/christopherdonini/spatial-ide/actions/runs/37953926704/job/113899486024
cargo test --workspace (windows-latest)	pass	19m41s	https://github.com/christopherdonini/spatial-ide/actions/runs/37953459458/job/113898277157
cargo test --workspace (windows-latest)	pass	18m49s	https://github.com/christopherdonini/spatial-ide/actions/runs/37953926761/job/113899486432
cfg boundary (PORTABILITY R2)	pass	8s	https://github.com/christopherdonini/spatial-ide/actions/runs/37953926658/job/113899486164
every commit is signed off	pass	7s	https://github.com/christopherdonini/spatial-ide/actions/runs/37953926610/job/113899485762
no profile path in the range	pass	10s	https://github.com/christopherdonini/spatial-ide/actions/runs/37953926683/job/113899485925
tauri build (NSIS, build-only, no signing) / tauri build (NSIS, build-only, no signing)	pass	4m38s	https://github.com/christopherdonini/spatial-ide/actions/runs/37953460143/job/113897902234
tauri build (NSIS, build-only, no signing) / tauri build (NSIS, build-only, no signing)	pass	4m49s	https://github.com/christopherdonini/spatial-ide/actions/runs/37953927097/job/113899487816
test · verify:plan · queue/site drift	pass	1m26s	https://github.com/christopherdonini/spatial-ide/actions/runs/37953926658/job/113899486472
typecheck · build · vitest · cargo test	pass	5m24s	https://github.com/christopherdonini/spatial-ide/actions/runs/37953460143/job/113897901695
typecheck · build · vitest · cargo test	pass	6m42s	https://github.com/christopherdonini/spatial-ide/actions/runs/37953927097/job/113899487386
```

## Documentation: must fix before the merge

- **D-1 (PR body, opening paragraph, sentences 3 to 5).** The CI sentence follows the race narrative, so it reads as a claim that CI's cause was observed. §1 forbids that claim and §8 item 8 names it. Reword: the guard failed twice in CI; that is consistent with §0.3's cause, read from code and shown possible by M-2, and was not observed to be it. This agrees with the architect's D-1.
- **D-2 (PR body).**
  - The M-0 row names one failing test. The report, and my own run, show two: `after_cancelling_…` fails too. Name both.
  - The Reports list leaves out worker report 2, the run that made the head commit. Add it.
  - This agrees with the architect's D-2.
- **D-3 (worker report 1, PREDICTIONS).** "skp.rs:3783" is a test-text span on an unmerged branch, named without its commit id (round 25 item 2). The P-1 and P-3 loops also name no commit. The span resolves at be7eecb3, whose kernel/src/skp.rs equals 82a3c8cd's, to after_cancelling's cancel-timeout `panic!`. Name the commits in the PR body. The mutation spans (skp.rs:3495 and 3500, session_identity.rs:497 and 551) resolve at 7469a801, which that section names. This agrees with the architect's D-4.
- **D-4 (lead-data's filed update, section 3).** It states 51 kernel and 39 engine test pointers. My count of backticked `*.rs::name` pointers at 82a3c8cd is 45 (kernel/README.md, lines 350 to 384) and 40 (engine/README.md, lines 499 to 528). All 85 resolve to a `fn` with a test attribute. The correction lives only in CUT-STATE.md and the weekly-window draft, not in the filed record or the PR. Add one correction line. This agrees with the architect's D-3.
- **D-5 (form, header line 6).** The impact read's whole-file sha256 has no `@ <rev>` (round 15 (e)), and the form's Pins line covers only "every pin below". It resolves at a23e709b, the file's only commit. Name that rev in the PR body's record line; no form amendment is needed.

**Owner's index against the diff:** consistent.
- kernel/README.md: the form's path is added last on the preregistrations line, and Last verified at is be7eecb3.
- engine/README.md: the new sub-bullet sits under Governed by, in lead-data's shape.
- The pinned names on the Stream tickets, Close ordering and Source descriptor lines are unchanged and resolve. The diff renames no pinned test and adds no public item.

**PR body against the head and the report:** consistent apart from D-1 to D-3. Base, head, the §7 counts, the Timing line and the P-1 status all match.

**Low profile:** the title, body and four commit messages carry no `#N` reference and no @mention.

## Commands and holds

Every heavy command ran in its own shared hold, in the paragraph's shape, with CARGO_TARGET_DIR=D:/wt-targets/cov, CARGO_BUILD_JOBS=8 and RUST_TEST_THREADS=8. Every hold was granted and released, and none returned 96 to 99.

| Command | Exit code | Result |
|---|---|---|
| `cargo clippy -p spatial-kernel -p spatial-engine --all-targets` | 0 | no warning on an added line |
| P-3 | 0 | 18 passed, 0 failed |
| P-1 (once) | 0 | 22 passed, 0 failed |
| M-0, M-1, M-2 | 101 each | as above |
| M-B1, M-B2 | 101 each | as above |

Unheld, at 82a3c8cd in the worktree:

| Command | Exit code | Result |
|---|---|---|
| `cargo fmt --all --check` | 0 | clean |
| `node scripts/plan/verify-cites.mjs` | 0 | PASS |
| `node scripts/plan/verify-quotes.mjs` | 0 | PASS |
| `node scripts/plan/verify-test-claims.mjs` | 0 | PASS |
| `node scripts/plan/verify.mjs` | 0 | PASS |
| `node scripts/plan/queue.mjs --check` | 0 | current |
| `node scripts/plan/site.mjs --check` | 0 | current |
| `node scripts/plan/cfg-boundary.mjs` | 0 | 0 sites outside every boundary |
| `node --test scripts/plan/*.test.mjs scripts/hooks/*.test.mjs scripts/evidence/*.test.mjs` | 0 | 457 passed, 0 failed |

These governance checks ran on the head, not on a merge with main at 608a8aa4. CI's governance job passed on the PR ref.

The worktree C:/dev/wt/skp is at 82a3c8cd0fb7fcc30f4aae49da82e6e981a10ade and `git status --porcelain` is empty. Nothing was committed or published.
