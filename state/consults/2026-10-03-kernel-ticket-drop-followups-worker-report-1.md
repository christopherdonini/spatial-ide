*Custodian's filing note (2026-10-03): worker report 1 for PLAN node `kernel-ticket-drop-followups` (node 9's implementation, by the worker-high), written by the worker to this path itself under the 2026-10-03 trial directive (part 1) and committed as written below the rule. The hash of record of the report as written, from this file's line 5 (the report's first line) to the end, is b6511735b8c9cc8211fa08806d21e9e082aa6ee89314c7ccf811272554bb4a2f, computed by the custodian from the saved bytes. It equals the worker's returned sha256. Its commits are on the branch `cut/kernel-ticket-drop-followups`, at head 4d487d51.*

---

# kernel-ticket-drop-followups (node 9): worker report 1

- Worker model observed: Sonnet 5.5 (`claude-sonnet-5-5`), high-effort variant of the worker role. No model override. No context handoff received or produced.
- Worktree `C:/dev/wt/ticket-drop-fu`, branch `cut/kernel-ticket-drop-followups`, cut and pushed at `4c50677c`. `git fetch` at the start showed origin's branch head at `4c50677c`. `CARGO_TARGET_DIR=D:/wt-targets/ticket-drop-fu` for every cargo command.
- Pushed with a plain `git push`: `4c50677c..4d487d51`. No PR opened. Worktree clean (`git status --porcelain` empty).
- Verdict: the form's work is done as specified. P1, P2, P3 and P4 held, no invalidator (I1 to I5) fired, §7's count is 316 of 320, every suite exited 0.

## Commits (all `git commit -s`, `profile-path-scan --staged` clean before each)

| Commit (full id) | Purpose |
|---|---|
| `2813aead1d5c6d8ca57c3fc86215649f294af5c5` | Tests only: T1, T2, T3 and their test-only types (`EmptySource`, `PanickingCancel`, `UnwindSetup`). Doc comments carry the mutation as planned. This is P1's commit. |
| `fc86039c244edb2f6cff0cf1e7160866f57c552d` | §2.1: the `tickets` field's invariant doc comment. |
| `2481ec5551a09c142aaad893d5452c6bac4e76c0` | §2.2: `swept` (all five methods) and `retired` (`cancel`, `cancel_all_for_dataset`) declared before the guard. |
| `847c6f0d8ae77d1d8635d204e7f79eb30f40635c` | §2.3: `prev` and the two `debug_assert!`s in `mint` and `redeem`. T1 to T3 pass here (P2). |
| `84d43648ab858142e0ddb82be949eae0e0849274` | §2.4: the two test doc comments name the predecessor by path. |
| `1c8cea2207e2df71d61895077d2f2ae18e340b70` | §2.5: the `sweep_locked` sentence and the three symbol cites. The M1 to M3 and O1 observations were made on this commit's clean tree plus the mutation. |
| `4d487d51f20cf0e637ad4068320760f91cfc858e` | Records M1 to M3 in the three tests' doc comments (comments only, plus removal of one section comment). The final head. |

## Baseline (step 1)

- `cargo clippy -p spatial-kernel --all-targets` at the base: rc 0. 20 individual warnings (37 lines starting `warning`, 17 of them per-target summaries). One is in `kernel/src/skp.rs`: `type_complexity` on `redeem`'s return type.
- Recovery note: my first baseline run timed out in a cold build. The second ran while my test code was already in the tree and so was contaminated (a lib-test compile error). The valid baseline above was re-run on the clean base with `git stash` and then popped.

## P1 (step 2)

Run at `2813aead`, which is test-only on top of the unchanged product code. All three hang and fail by timeout, each after its own `SourceCancel::cancel panics on purpose` panic had printed on the spawned thread. Each failing message:

- T1: `an_unwind_through_cancel_drops_its_swept_source_after_releasing_the_guard: StreamRegistry::cancel did not return within 5s — the unwind dropped a swept or retired EngineSource while the guard was held, and its Drop re-locked the same Mutex (the spawned thread is leaked, not joined)`
- T2: `an_unwind_through_cancel_all_for_dataset_drops_its_swept_source_after_releasing_the_guard: StreamRegistry::cancel_all_for_dataset did not return within 5s — [same tail]`
- T3: `an_unwind_through_cancel_all_for_dataset_drops_its_retired_source_after_releasing_the_guard: StreamRegistry::cancel_all_for_dataset did not return within 5s — [same tail]`
- Summary line: `test result: FAILED. 0 passed; 3 failed; ... 138 filtered out; finished in 5.32s`. H1 is confirmed. I1 did not fire.

## P2

After `847c6f0d`: `cargo test -p spatial-kernel --lib an_unwind_through`: 3 passed, 0 failed (rc 0).

## M1 to M3 (step 4)

Each was applied on the clean tree at `1c8cea2207e2df71d61895077d2f2ae18e340b70`. Each was run with `cargo test -p spatial-kernel --lib an_unwind_through`, rc 101. Each was reverted with `git checkout kernel/src/skp.rs`, and the tree was clean afterwards. Each was recorded in its test's doc comment at `4d487d51`, naming `1c8cea2207e2`.

| Mutation | Applied change | Failed (and only this test) | First failing message | Passed beside it |
|---|---|---|---|---|
| M1 | `cancel`: `swept` declared after the guard (`let swept = ...` after the lock) | T1 | `an_unwind_through_cancel_drops_its_swept_source_after_releasing_the_guard: StreamRegistry::cancel did not return within 5s — [same tail]` | T2, T3 (`2 passed; 1 failed`) |
| M2 | `cancel_all_for_dataset`: the same change | T2 | `an_unwind_through_cancel_all_for_dataset_drops_its_swept_source_after_releasing_the_guard: StreamRegistry::cancel_all_for_dataset did not return within 5s — [same tail]` | T1, T3 |
| M3 | `cancel_all_for_dataset`: `retired` declared after the guard (`swept` left before it) | T3 | `an_unwind_through_cancel_all_for_dataset_drops_its_retired_source_after_releasing_the_guard: StreamRegistry::cancel_all_for_dataset did not return within 5s — [same tail]` | T1, T2 |

P3 held for all three.

## O1 (step 5)

Observed once at `1c8cea2207e2df71d61895077d2f2ae18e340b70`. The change was `mint`'s inserted key, `handle.as_str().to_string()` replaced by `"fixed".to_string()`. I ran `cargo test -p spatial-kernel --lib the_pending_ceiling_is_per_dataset_and_declared`, rc 101. The test `skp::tests::the_pending_ceiling_is_per_dataset_and_declared` failed. Its panic message, at `kernel\src\skp.rs:267:9` in that tree, was `mint: a fresh key displaced an entry`. That is the `debug_assert`'s own message. I reverted it, and the tree was clean. P4 held. O1 is not recorded in code.

## Suites (step 6), each rc captured directly

| Command | rc | Result |
|---|---|---|
| `cargo test -p spatial-kernel --lib skp::` | 0 | 50 passed, 0 failed, 91 filtered out |
| `cargo test -p spatial-kernel` | 0 | 39 test targets: 321 passed, 0 failed, 28 ignored. The lib target is 141 passed. |
| `cargo clippy -p spatial-kernel --all-targets` | 0 | 20 individual warnings, 37 `warning` lines: the same as the baseline. The sorted warning lists differ only in which target a summary labels "(1 duplicate)". `skp.rs` still has only the one baseline `type_complexity` warning, now at `skp.rs:277`. No new rustc or clippy warning, and no new `allow`. |
| `cargo fmt --all -- --check` | 0 | clean |
| `node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs"` | 0 | 415 tests, 415 pass |
| `node scripts/plan/verify-quotes.mjs` | 0 | PASS: 113 checked, 82 verified, 30 baselined |
| `node scripts/plan/verify-quotes.mjs --show-cites kernel/src/skp.rs` | 0 | cite listing read: every cite into or out of `skp.rs` is pre-existing, none is mine |
| `node scripts/plan/verify-cites.mjs` | 0 | PASS |
| `node scripts/plan/verify-test-claims.mjs` | 0 | PASS: 486 claimed tests |
| `node scripts/plan/verify-mutation.mjs --base origin/main --head HEAD` | 0 | PASS: all 3 new tests have a recorded mutation naming them. Run after the last commit, at `4d487d51`. |
| `timeout 570 node scripts/plan/verify.mjs --offline` | 0 | PASS |

## §7's count

`git diff --numstat 4c50677c..HEAD -- kernel/src/skp.rs` gives 290 insertions and 26 deletions, so 316 of 320. 4 lines of headroom. The merge-base with origin/main is `4c50677c`. Only `kernel/src/skp.rs` changed in the whole branch diff. The form and `kernel/README.md` are untouched, and so is the predecessor form.

## Deviations from the form, with reasons

1. **A blank `///` line in §2.1's doc.** The form's §2.1 text runs the bullet list straight into the paragraph "Each method declares ...". I inserted a blank `///` line between them so markdown does not read the paragraph as a lazy continuation of the last bullet (clippy `doc_lazy_continuation`, which warns elsewhere at baseline). No word changed. I did not test whether the lint would fire without it.
2. **`debug_assert` messages are short and name the method:** `mint: a fresh key displaced an entry` and `redeem: the re-insert displaced an entry`. The form fixes the shape (a message naming the method) and not the wording. Short messages kept `mint`'s assert on one line, for the budget.
3. **§2.2's form: deferred initialisation.** `let swept;` before the guard and `swept = Self::sweep_locked(..)` after it, in all five methods. It adds no warning (`needless_late_init` did not fire, and `unused_assignments` does not apply to a deferred init), so I5 did not fire. `prev` is `let mut prev = None;` with its type inferred. I added no per-method comment about the order, because the field's invariant doc carries it and the budget was tight.
4. **Datasets and test layout.** I used short dataset names (`ds_p`, `ds_q`, `ds_d`). The fixture stems are §3's. The new tests sit after the predecessor's four, with one shared helper, `UnwindSetup`. Nothing in the predecessor's tests or helpers changed except the two doc-comment edits of §2.4. To keep §7, a two-line section comment I had added above the helpers was dropped in the last commit.
5. **Recorded-mutation text.** The commit is named by its 12-character prefix `1c8cea2207e2` in the comments. The full id is above. Each comment says the test failed "by timeout (its name, then `: StreamRegistry::... did not return within 5s`)". I abbreviated the full message in the comments, because quoting it whole would not fit a doc line.
6. **`origin/main` moved after the cut** (now `14a9636f3c672109657d1c2c9016d2c009d61161`). The merge-base is still `4c50677c`, and `verify-mutation --base origin/main` passes against the moved main. I did not rebase.
7. **Observation scope.** M1 to M3 were run with the filter `an_unwind_through`, which selects exactly the three new tests (as step 4 says, "run all three tests"). The full suites (§9) ran separately, on the unmutated head.

## Pre-gate self-check (the four failure classes)

- Cross-module code uses the interface the other side exposes: no new cross-module path. The tests drive the real `StreamRegistry::{mint, redeem, cancel, cancel_all_for_dataset}`, the real `GenerationRegistry` and `SessionInvalidator`, and `crate::wrap_for_data_plane` (the shipped producer shape, as the predecessor's `seeded_pending_ticket` uses it). The test-only `BatchSource` and `SourceCancel` stubs implement `spatial_data_plane::transport`'s real traits (`protocol/data-plane/src/transport.rs`).
- Caller rule: no new `pub` item, option, `cfg(test)` branch or seam in product code. The new types are private items inside the `#[cfg(test)]` module. Product-code changes are locals, two `debug_assert!`s and comments.
- Every completion claim points to evidence: P1 to P4 and M1 to M3 to the outputs above, each at a named commit; the suites to their rc lines.
- User-facing messages: none. The `debug_assert` and test panic messages are developer-facing and describe behaviour implemented at this commit.
- Every test reaches its intended assertion, not only its setup. Each asserts the call returned in time, that it panicked with this test's own message (so a different panic cannot pass), and that P's `ticket_liveness` is `EndedBySourceChange`. T3 additionally fails by name if the key precondition cannot be met within 64 re-keys, and asserts that P's entry is `CancelledBeforeRedeem` after the call. The passing runs reach those assertions, because the three tests pass only after the unwind.
- No `verify-mutation` run is named as an observation of a mutation. Each mutation was applied, run and reverted by hand.

## Off-scope, noticed but not done

- `kernel/README.md:177-179` (the owner's index): lead-data writes that update in a later round (§9, C1). I did not touch it.
- The regression module's top doc comment still says "the first three tests below" in its hang-detection paragraph. It predates this piece and is now loosely stale, since the module has more tests. Not in §2's list, so untouched.
- `redeem`'s `type_complexity` clippy warning is a pre-existing baseline item.
- The tests' panics print `thread '<unnamed>' panicked at ...` to stderr, as expected from a caught panic. Cargo captures it on a passing run.
