*Custodian's filing note (2026-10-03): the gate-1 reviewer for PR #168 (node 9) wrote this report to this path itself, through its shell as its brief permitted, under the 2026-10-03 trial directive (part 1). It is committed as written, below the rule. The hash of record of the report as written, from this file's line 5 (the report's first line) to the end, is 68a14b3d840f095ef8e7e8efb427a1486628c49a8ca3f6819b28217f89fa67af, computed by the custodian. It equals the reviewer's returned sha256. Its rooted pins are at 4c50677c, which is on main.*

---

VERDICT: FAIL
Reviewed cut/kernel-ticket-drop-followups @ 86774b0647b93f7ecf35de4b23a895f546f522d8. PR #168, gate 1, reviewer.

Form: `kernel/TICKET-DROP-FOLLOWUPS-PREREGISTRATION.md` at 4c50677c (on main; the merge-base). Diff: `git diff origin/main...HEAD` (three dots): `kernel/src/skp.rs` 290/26, `kernel/README.md` 3/3. `git fetch` showed origin's branch head at 86774b06 at the start and at the end. Every tool claim below is at the tools' commit 86774b06 (`scripts/` is unchanged from 4c50677c).

## S1 — blocking

**S1-1. T3 is flaky: its precondition fails in about one run in four, so invalidator I4 has fired.** (Checklist 1, correctness; checklist 7, a test that does not reliably test.)
- Test: `skp::ticket_drop_under_lock_regression::an_unwind_through_cancel_all_for_dataset_drops_its_retired_source_after_releasing_the_guard`, helper `UnwindSetup::put_p_before_q` in `kernel/src/skp.rs` at 86774b06 (branch commit, named; not pinned by hash).
- Failing message, byte-copied from my run: `an_unwind_through_cancel_all_for_dataset_drops_its_retired_source_after_releasing_the_guard: P's key did not come before Q's in the map's iteration order within 64 re-keys, so the test would not reach its retire-then-panic order`
- Evidence, at 86774b06, unmutated:
  - my first `cargo test -p spatial-kernel --lib skp::` exited 101 on exactly that message (49 passed, 1 failed);
  - T3 alone, 40 runs: 32 passed, 8 failed; 20 more runs: 6 failed, every failure on the precondition message. Total 14 of 60;
  - CI: `gh pr checks 168` lists `cargo test --workspace (windows-latest)` as fail, run 37129686783 (event push, headSha 86774b0647b93f7ecf35de4b23a895f546f522d8), on the same test and message (log line `test result: FAILED. 140 passed; 1 failed`). The pull_request run 37129918918 at the same sha passed;
  - a standalone rustc program over `std::collections::HashMap<String, u32>` doing the same thing (insert Q, insert P, re-key only P up to 64 times until P precedes Q in `keys()` order) left P never preceding Q in 5072 of 20000 trials (0.254).
- Cause (inference, labelled; consistent with the 0.254): with two entries std's `HashMap` has four buckets and iterates them in bucket order; re-keying only P can never put P ahead of Q when Q sits in the first bucket, about a quarter of the time. P's draws are not the independent coin flips the form assumed.
- Against the form: §7's labelled assumption, `kernel/TICKET-DROP-FOLLOWUPS-PREREGISTRATION.md:255 @ 4c50677c sha256:9491351ec33ae452fd93968646f7e67ae8f3325417afa16d4118f77f89466475`, is falsified (measured about 0.23 to 0.25, not about 2^-64). I4, `kernel/TICKET-DROP-FOLLOWUPS-PREREGISTRATION.md:232 @ 4c50677c sha256:c4f73a469d2040b3e6b8db7afdc7d821b2265be30d71626afdc0a39cad36ecb5`, fires: T3's precondition cannot be established in those runs. §5 says each invalidator stops the piece and is reported. Worker report 1's verdict says no invalidator (I1 to I5) fired; that holds only for the runs it made.
- Knock-on: P1 and P3 hold only modulo the flake. My P1 run 1 at 2813aead, M1 run 1 and M2 run 2 each had T3 fail on the precondition message instead of by timeout or passing (details in the checklist). In those runs T3 never reaches its call, so it discriminates nothing.
- The fix changes §4's T3 setup (the form's Precondition bullet, `kernel/TICKET-DROP-FOLLOWUPS-PREREGISTRATION.md:190 @ 4c50677c sha256:00be31fc415cf8e1b1bc4ee4c9e2b539003e9db8528116879d6e129d7682f3e6`, prescribes re-keying P only) and §7's assumption, after an outcome has been seen: an amendment first, then the code. See S2-1.

## Checklist (form §9 Reviewer, and the brief's items)

1. **Full diff vs §2.1 to §2.5.**
   - §2.1: word-for-word identical to the form's drafted text (tokenised compare: identical). Line-for-line, the only difference is one added blank `///` line between the list and the paragraph (worker report 1, deviation 1). No word changed. PASS.
   - §2.2: all five methods declare `swept` (deferred init) before `self.tickets.lock()`; `cancel` and `cancel_all_for_dataset` declare `retired` before it with the same initialiser. PASS.
   - §2.3: `mint` and `redeem` declare `let mut prev = None;` before the guard and assign `insert`'s return to it; `debug_assert!(prev.is_none(), ..)` immediately after `drop(tickets)`, messages `mint: a fresh key displaced an entry` and `redeem: the re-insert displaced an entry` (each names its method). PASS.
   - §2.4: both doc comments now name `kernel/TICKET-DROP-UNDER-LOCK-PREREGISTRATION.md`'s; no claim changed. PASS.
   - §2.5: the `sweep_locked` sentence added. The three line cites became symbol cites: `record_source_changed` (exists, `engine/src/stream.rs`), `EngineCancel` in `kernel/src/lib.rs` (exists), and `touch_modification_time` with its `(:251-259)` removed (exists, `kernel/tests/session_generation.rs`). PASS.
2. **Declaration order, all five methods** (read at 86774b06): `sweep_expired` swept, then the guard; `mint` swept, prev, then the guard; `redeem` swept, prev, then the guard; `cancel` swept, retired, then the guard; `cancel_all_for_dataset` swept, retired, then the guard. Return path: `drop(tickets)`, then (`mint`, `redeem`) the `debug_assert`, then `drop(swept)`, then `drop(retired)` (`cancel`, `cancel_all_for_dataset`); `prev` drops implicitly at scope end, after `swept`. The `debug_assert` is evaluated after `drop(tickets)`. §8 items 1 to 3: PASS.
3. **M1, M2, M3, O1 re-observed** in `C:/dev/wt/ticket-drop-fu` at 86774b06, each applied by hand, run with `cargo test -p spatial-kernel --lib an_unwind_through`, reverted with `git checkout kernel/src/skp.rs`, porcelain empty after each.
   - M1 (`cancel`: `let swept = Self::sweep_locked(..)` after the guard). Run 1: rc 101, T1 FAILED by timeout (`...: StreamRegistry::cancel did not return within 5s — ...`), T2 ok, **T3 FAILED on the precondition message** (S1-1). Runs 2 to 4: rc 101 each, T1 FAILED (5.2 s), T2 and T3 ok.
   - M2 (the same in `cancel_all_for_dataset`). Runs 1 and 3: rc 101, T2 FAILED by timeout (`...: StreamRegistry::cancel_all_for_dataset did not return within 5s — ...`), T1 and T3 ok. Run 2: T2 FAILED by timeout, **T3 FAILED on the precondition message**, T1 ok.
   - M3 (`cancel_all_for_dataset`: `retired` declared after the guard). Runs 1 to 3: rc 101, T3 FAILED by timeout, T1 and T2 ok.
   - O1 (`mint`'s inserted key replaced by `"fixed".to_string()`): rc 101, `skp::tests::the_pending_ceiling_is_per_dataset_and_declared` FAILED, panicked at `kernel\src\skp.rs:267:9` with `mint: a fresh key displaced an entry`. Reverted.
   - P3 and P4 hold when T3's precondition holds; see S1-1.
4. **P1** in a scratch worktree `C:/dev/wt/gate1-tdf-scratch` at 2813aead1d5c6d8ca57c3fc86215649f294af5c5 (`git diff --stat 4c50677c 2813aead`: `kernel/src/skp.rs` 237 insertions, one hunk inside `ticket_drop_under_lock_regression`; product code unchanged). Target `D:/wt-targets/gate1-tdf-scratch`, a copy of the branch's target: a deviation from the brief, so that a base build could not leave base artifacts in `D:/wt-targets/ticket-drop-fu` behind unchanged worktree mtimes. Run 1: rc 101, T1 and T2 FAILED by timeout, **T3 FAILED on the precondition message**. Runs 2 to 4: rc 101, 0 passed, 3 failed, all three by timeout (finished in 5.16 s each). P1 holds modulo S1-1. Worktree removed (`git worktree remove`), target directory deleted.
5. **Pins.** The form carries 49 hashed `path:line @ c9f41126 sha256:` occurrences (46 distinct: `kernel/src/lib.rs:699-705` three times, `kernel/src/skp.rs:235-242` twice, and one hash shared by `skp.rs:329` and `skp.rs:367`) and one in words (root `Cargo.toml` lines 49 to 57). Recomputed each with `git show c9f41126:<path> | sed -n '<a>,<b>p' | sha256sum`: 49 of 49 match; `Cargo.toml` 49 to 57 gives d60209a7929888184b674801a3f7d3ded1589837889102a64ec46ffed94b8efd, matching. c9f41126 is on main. No mismatch. (The brief's "50 ... and one in words" is 49 and one, 50 in total.)
6. **§8 item by item.**
   1. Return-path order: unchanged, `prev` added last. PASS.
   2. Declarations before the guard, all nine: PASS.
   3. `debug_assert` after `drop(tickets)`; `prev` not dropped before it: PASS.
   4. Added lines matching `pub `, `cfg(` or `allow(`: none. The new types (`EmptySource`, `PanickingCancel`, `UnwindSetup`) sit inside `#[cfg(test)] mod ticket_drop_under_lock_regression`. No seam in product code. PASS.
   5. Files: `kernel/src/skp.rs`, and `kernel/README.md` (owner's-index lines 350, 353, 373 only). No SKP literal, refusal code, `CancelOutcome` mapping or public signature changed. PASS.
   6. Each new test asserts its unwind (`expect_err` plus the test-named payload) and P's drop (`ticket_liveness` is `EndedBySourceChange`); T3 carries its `CancelledBeforeRedeem` check. PASS as written; reliability is S1-1.
   7. Predecessor form untouched. PASS.
   8. Clippy at the base 4c50677c (scratch worktree): rc 0, 37 `warning` lines. At 86774b06: rc 0, 37 `warning` lines; the same warning kinds and the same file set; in `kernel/src/skp.rs` only the pre-existing `type_complexity` on `redeem`'s return type (line 257 at base, 277 at head). No new `#[allow]`. PASS.
   9. Doc comment: the bold first sentence names `SourceCancel::cancel` and `StreamHandle::mint`; the std-call unwind is stated as "Not covered" with the four §2.6 (a) sites. "the only call made under this guard through a trait object", read against the five bodies: the other guard-held calls are on `HashMap`, `Vec`, `Instant`, `mem::replace`, `format!`, `SkpError::too_many_pending_streams`, `StreamHandle::mint` and `Arc::clone`; only `cancel.cancel()` is a trait-object call. PASS.
   10. Mutations recorded with commit `1c8cea2207e2`; no record names a `verify-mutation` run as an observation. PASS.
   11. Index update present (86774b06), byte-equal to lead-data's section 1 per worker report 2; the new pointers (T1, T3, the form's path) exist at head; the section runs 346 to 382, 37 lines (limit 60). "Last verified at: 4d487d51" is a branch commit, reachable after a merge-commit merge. PASS.
7. **Suites:** the exit codes below.

## Exit codes (each as it came out; worktree at 86774b06 unless stated)

| Command | rc | Result |
|---|---|---|
| `cargo test -p spatial-kernel --lib skp::` | 101 | 49 passed, 1 failed: T3 on the precondition message (S1-1) |
| `cargo test -p spatial-kernel --lib <T3 name>`, 60 runs | per run 0 or 101 | 46 passed, 14 failed, every failure the precondition message |
| `cargo test -p spatial-kernel` | 0 | 39 targets, 321 passed, 0 failed, 28 ignored (T3 passed in this run) |
| `cargo clippy -p spatial-kernel --all-targets` | 0 | 37 `warning` lines, the same as base 4c50677c (rc 0, 37) |
| `cargo fmt --all -- --check` | 0 | clean |
| `node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs"` | 0 | 415 tests, 415 pass, 0 fail |
| `node scripts/plan/verify-quotes.mjs` | 0 | PASS, 113 checked, 82 verified, 30 baselined |
| `node scripts/plan/verify-cites.mjs` | 0 | PASS (38 loose references advised, none in the diff) |
| `node scripts/plan/verify-test-claims.mjs` | 0 | PASS, 486 claimed tests |
| `node scripts/plan/verify-mutation.mjs --base origin/main --head HEAD` | 0 | PASS: a recorded-mutation text names each of the 3 new tests (a text check, not an observation) |
| `timeout 1200 node scripts/plan/verify.mjs --offline` | 0 | PASS |
| `gh pr checks 168` | 1 | one fail: `cargo test --workspace (windows-latest)`, run 37129686783 (push, 86774b06), T3's precondition; every other check passes, including the pull_request run 37129918918 at the same sha |

## S2 — suggestions

- **S2-1.** Route the T3 fix through an amendment first (§4's Precondition bullet and §7's assumption; an outcome has been seen), then the code. A setup that does not depend on re-keying P alone: re-key Q as well (Q is never attributed, so its key is free to move), or re-mint both keys each attempt; then bound the attempts against a measured failure rate, not the uniform-hash assumption. Re-observe P1 and M1 to M3 with repetition (several runs each), and record each with its commit.
- **S2-2.** §7 has 4 lines of headroom (316 of 320). If the T3 fix overruns, record it as class 8 and do not edit §7's line (Round 25 additions).
- **S2-3.** §4's Doc comments bullet sends the observation's commit to §10, which is still empty; O1 is recorded only in worker report 1 (commit 1c8cea2207e2df71d61895077d2f2ae18e340b70). The custodian decides whether the closing record carries M1 to M3 and O1 there as references.

## N — nits

- **N1.** The §2.4 edit in the doc of `after_cancelling_a_ticket_whose_source_changed_the_next_viewport_query_refuses_by_name` leaves a short line (`/// test failed; (B) (forgetting the`); rustfmt does not reflow comments.
- **N2.** The owner's index pins T1 and T3 but not T2; lead-data's report states the choice. Acceptable.
- **N3.** Worker report 1's Off-scope list calls `kernel/README.md:177-179` "the owner's index"; it is body text (lead-data's index report already says so).

## State left

Both checkouts as found: `C:/dev/wt/ticket-drop-fu` porcelain empty at 86774b06; in `C:/dev/spatial-ide`, no edit of mine other than this unstaged file (the staged changes and commit 35a51025 that appeared during this run are the custodian's). Scratch worktree removed and pruned; `D:/wt-targets/gate1-tdf-scratch` deleted; no cargo or test process left running. No commit, no push.
