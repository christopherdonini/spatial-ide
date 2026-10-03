*Custodian's filing note (2026-10-03): worker report 3 for PLAN node `kernel-ticket-drop-followups` (node 9's correction round 1, Amendment 1's code and observations, by the worker-high), written by the worker to this path itself under the 2026-10-03 trial directive (part 1) and committed as written below the rule. The hash of record of the report as written, from this file's line 5 (the report's first line) to the end, is 7c39495cb4a344cd9dcecfa3feca9e1cf0d9363c35ecf6089f8bdf5daee83e33, computed by the custodian. It equals the worker's returned sha256. Its commits are on `cut/kernel-ticket-drop-followups` (F = ca005fe0, head afaa990b) and on `cut/kernel-ticket-drop-followups-p1-base` (7ba142da), which is kept. CI at afaa990b, read by the custodian: Product CI Rust workspace push run 37133969866 and pull_request run 37133972215, both success.*

---

# kernel-ticket-drop-followups (node 9): worker report 3 (Amendment 1, T3's precondition made deterministic)

- Worker model observed: Sonnet 5.5 (`claude-sonnet-5-5`), no override, no context handoff.
- Start: `git fetch`, then origin's branch head and local HEAD both read `8195789b43368c4d8bc20f2a3ee7ce6aeed66771`, worktree clean. §10, Amendment 1 read whole before any code; the form was not edited. The gate-1 reviewer's findings S1-1 and S2-1 to S2-3 were read. `CARGO_TARGET_DIR=D:/wt-targets/ticket-drop-fu` throughout.
- Final state: branch `cut/kernel-ticket-drop-followups` pushed at `afaa990b1b081bed498cbc1caa06a1f812c4f426` (plain `git push`). Worktree clean, on that branch. No process left running (`tasklist` shows no cargo, rustc or test binary).

## Commits (all signed off, `profile-path-scan --staged` clean before each)

| Commit | Branch | Purpose |
|---|---|---|
| F = `ca005fe0f3a2c236ff24feec2c803cc784cc7478` | `cut/kernel-ticket-drop-followups` | `test: T3's precondition made deterministic by an in-place swap (Amendment 1, item 2)` |
| `afaa990b1b081bed498cbc1caa06a1f812c4f426` | same | Comments only: the three recorded-mutation comments now name `ca005fe0f3a2` instead of `1c8cea2207e2`. The final head. |
| `7ba142dae1670583a994cbf1497b5289e2efa209` | `cut/kernel-ticket-drop-followups-p1-base` (new, pushed, observation-only, not for merge) | The P1 composition. |

### What F changes (item 2 and item 3)

Only the test module's helper, in `kernel/src/skp.rs`. No product code changes. The re-key loop and `MAX_REKEY_ATTEMPTS` are gone. The helper is renamed `put_p_first` and does the following under the registry's lock, before `attribute_p`:
- it requires that the map holds exactly P's and Q's entries, and otherwise fails with a message naming the test (`the map does not hold exactly P's and Q's entries`);
- if P's key is not first in iteration order (`map.keys().next()`), it swaps the two values in place with `mem::swap` over `values_mut()`, and swaps the test's names for the two keys (`self.p` and `self.q`) with them;
- no key is removed or inserted, and no `TicketState` is dropped.

T3's doc text and call site follow the rename. T3's call and its four assertions, M3, T1 and T2 are unchanged.

### The P1 composition (item 4)

`kernel/src/skp.rs` on the P1 branch is `git show 4c50677c:kernel/src/skp.rs` lines 1 to 3016, followed by F's file from the regression module's `#[cfg(test)]` line (line 3042 at F) to the end. The regression module is the last item of the file at both commits. `git diff 4c50677c 7ba142da -- kernel/src/skp.rs` gives 237 insertions and 4 deletions, in four hunks, all inside `ticket_drop_under_lock_regression`: the new tests and helpers plus three comment edits. The product code is therefore 4c50677c's. The rest of the tree on that branch is F's. This composition also carries F's two doc-comment edits at lines 3046 and 3145 and the cite edit, which are comments.

## Item 4's runs

Command for every run except the P2 T3-alone series: `cargo test -p spatial-kernel --lib an_unwind_through` (or `skp::` where stated), each run a fresh cargo invocation. Messages are the first failing line of each failing test, truncated after `did not return within 5s — the unwind dropped...` (the tail is the same in each).

### P1: 5 runs at `7ba142da` (branch `cut/kernel-ticket-drop-followups-p1-base`)

| Run | rc | Result | Failed tests and their message |
|---|---|---|---|
| 1 | 101 | 0 passed, 3 failed, 5.20 s | T1: `an_unwind_through_cancel_drops_its_swept_source_after_releasing_the_guard: StreamRegistry::cancel did not return within 5s — ...`; T2: `an_unwind_through_cancel_all_for_dataset_drops_its_swept_source_after_releasing_the_guard: StreamRegistry::cancel_all_for_dataset did not return within 5s — ...`; T3: `an_unwind_through_cancel_all_for_dataset_drops_its_retired_source_after_releasing_the_guard: StreamRegistry::cancel_all_for_dataset did not return within 5s — ...` |
| 2 | 101 | 0 passed, 3 failed, 5.19 s | the same three messages |
| 3 | 101 | 0 passed, 3 failed, 5.17 s | the same three messages |
| 4 | 101 | 0 passed, 3 failed, 5.16 s | the same three messages |
| 5 | 101 | 0 passed, 3 failed, 5.17 s | the same three messages |

In all 5 runs, T1 to T3 each failed by timeout and none failed on the helper's message. Expected result met. P1 holds.

### M1, M2, M3: 5 runs each at F (`ca005fe0`)

Each applied by hand to F's tree, run, reverted with `git checkout kernel/src/skp.rs`, and `git status --porcelain` was empty after each series. The mutations are the same as in report 1: M1 is `cancel` with `swept` declared after the guard; M2 is the same in `cancel_all_for_dataset`; M3 is `cancel_all_for_dataset` with `retired` declared after the guard.

| Mutation | Runs | rc each | Result each run | Failed (only) | Message each run |
|---|---|---|---|---|---|
| M1 | 5 | 101 | 2 passed, 1 failed (5.18 to 5.28 s) | T1 | `an_unwind_through_cancel_drops_its_swept_source_after_releasing_the_guard: StreamRegistry::cancel did not return within 5s — ...` |
| M2 | 5 | 101 | 2 passed, 1 failed (5.17 to 5.41 s) | T2 | `an_unwind_through_cancel_all_for_dataset_drops_its_swept_source_after_releasing_the_guard: StreamRegistry::cancel_all_for_dataset did not return within 5s — ...` |
| M3 | 5 | 101 | 2 passed, 1 failed (5.17 to 5.20 s) | T3 | `an_unwind_through_cancel_all_for_dataset_drops_its_retired_source_after_releasing_the_guard: StreamRegistry::cancel_all_for_dataset did not return within 5s — ...` |

In all 15 runs exactly the mutation's own test failed by timeout, and the other two passed. No run failed on the helper's message. P3 holds.

### P2

- **T3 alone, 100 runs at F.** The test binary built at F, `spatial_kernel-ae7e60b79ca7d0aa.exe`, was run 100 times directly, one fresh process per run (so a fresh `RandomState` per run), with `skp::ticket_drop_under_lock_regression::an_unwind_through_cancel_all_for_dataset_drops_its_retired_source_after_releasing_the_guard --exact`. Result: 100 of 100 rc 0, each `1 passed; 0 failed`. No failure. (This is a deviation in method from cargo per run, taken because 100 cargo invocations would add nothing a fresh process does not give: each process draws its own hash seed.)
- **5 runs of `cargo test -p spatial-kernel --lib skp::` at F.** All five rc 0, `50 passed; 0 failed` each (0.86 to 1.06 s).
- **Suites, once, at the final head `afaa990b`:** see the next section.
- **CI's push and pull_request runs at that head:** not mine to read and not done here.
- O1 was not re-made, per item 4. Its observation of record stays worker report 1 (at `1c8cea2207e2`).

## Suites (§9) at the final head `afaa990b`, each rc as it came out

| Command | rc | Result |
|---|---|---|
| `cargo test -p spatial-kernel --lib skp::` | 0 | 50 passed, 0 failed, 91 filtered out |
| `cargo test -p spatial-kernel` | 0 | 39 test targets: 321 passed, 0 failed, 28 ignored |
| `cargo clippy -p spatial-kernel --all-targets` | 0 | 20 individual warnings, the same count as the baseline of 20 (taken at the base, in report 1). `skp.rs` has only the one baseline warning (`type_complexity` on `redeem`'s return type, now at line 277). No new rustc or clippy warning. |
| `cargo fmt --all -- --check` | 0 | clean |
| `node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs"` | 0 | 415 tests, 415 pass, 0 fail |
| `node scripts/plan/verify-cites.mjs` | 0 | PASS |
| `node scripts/plan/verify-quotes.mjs` | 0 | PASS |
| `node scripts/plan/verify-test-claims.mjs` | 0 | PASS |
| `node scripts/plan/verify-mutation.mjs --base origin/main --head HEAD` | 0 | PASS: all 3 new tests have a recorded mutation naming them (a recording check; it is not an observation of any mutation) |
| `timeout 1200 node scripts/plan/verify.mjs --offline` | 0 | PASS |

## §7's count (item 6)

`git diff --numstat <merge-base>..HEAD -- kernel/src/skp.rs`, with the merge-base `4c50677cd4a9e78c2e647b737976814899277e91`, gives `284 26`, so 310 of 320. This is within §7, so class 8 is not taken. Amendment 1 item 6 expected about 306. The same command for `kernel/README.md` gives `3 3` (unchanged from report 2). No other file differs from the merge-base in the diff beyond the form's own amendment and the README; the skp.rs count is the only one §7 sets a ceiling for.

## Deviations

1. **P2's T3-alone series ran the built test binary directly**, 100 fresh processes, not 100 cargo invocations (reason above). The binary was the one cargo had just built at F.
2. **The P1 composition is by file splice, not by cherry-pick.** The merge-base product code and F's test module do not compose by a plain apply, because the product commits touch the same file. The method and its diff against the merge-base are given above, and the branch is pushed so a reviewer can re-run it.
3. **The helper's name changed from `put_p_before_q` to `put_p_first`**, since it no longer re-keys. This touches T3's doc text and call site only.
4. **F's doc comments still name `1c8cea2207e2`** by design: a commit cannot name itself, and item 4 asks for the comment update as a second commit, which is `afaa990b`.

## Pre-gate self-check

- Cross-module code: none added. The tests drive the real registries as before.
- Caller rule: no new `pub` item, no `cfg(test)` branch, no seam. The change is inside the test module's private helper. No product code changed in either commit.
- Completion claims: each points to the runs above (P1 5/5, M1 to M3 15/15, T3 100/100, `skp::` 5/5) with commit, rc and messages.
- User-facing messages: none. The helper's failure message is developer-facing and describes behaviour implemented at this commit.
- Intended assertions are reached: in every passing T3 run all four assertions executed (T3 passes only after its call returned, unwound with the test-named payload, P was `EndedBySourceChange` and P's entry was `CancelledBeforeRedeem`). I4's second clause did not fire in any run.

## Off-scope, noticed but not done

- Nothing new beyond report 1 and report 2's lists. The CI runs at the head are the custodian's to read.
