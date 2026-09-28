*Custodian's filing note (2026-09-28): gate 1 (reviewer; full gating under AUTONOMY.md §21a, entered through §21b's mid-piece clause after the class-6 overrun) of PLAN node `watcher-first-read-on-watch-thread`. Reviewed: cut/watcher-first-read @ 0c7be386304882e2b693f77cc7300a07b92b898f (from the report's own first line). Filed under `state/consults/gates/` by `AUTONOMY.md` §25(b), transcribed from the hand-back message with the harness's two-space indent removed. The text below the rule is the agent's. Profile paths redacted at filing (0).*

---

Reviewed: cut/watcher-first-read @ 0c7be386304882e2b693f77cc7300a07b92b898f
VERDICT: PASS

Range: `origin/main...HEAD`. The merge-base is 191ecbd. origin/main moved from 85cb849 to 09f6917 while I worked, which brought in the merges of #136, #137, #139 and #140. The merge-base did not change, so the diff and its numstat are the same under both. All line cites below are to the branch at 0c7be38.

## 1. Correctness and concurrency of engine/src/watch.rs

- **First read on the owning thread.** `issue_read` has two callers, both inside `watch_thread`: the first read at `engine/src/watch.rs:294` and the re-issue at `:350`. `arm` (`:571-678`) no longer issues a read. Nothing binds a completion port, and `frontends/shell/src-tauri/src/commands.rs` is not in the diff, so the caller thread's lifetime and tokio's keep-alive are unchanged. The Change line holds.
- **One-shot handshake** (`:294-303`, `:501-509`, `:555-568`):
  - Every return path of `watch_thread` sends exactly once: `Ok` after the read is pending, or `Err` followed by an immediate return. The receiver is consumed by value in `await_first_read`, so a second send cannot happen.
  - `arm` cannot wait forever. The send follows an overlapped `ReadDirectoryChangesW`, which does not block, and `open_directory` always sets `FILE_FLAG_OVERLAPPED` (`:202`).
  - A spawn failure drops the closure, and the `Sender` with it. `arm` never reaches `recv`.
  - A panic before the send would unwind and drop the `Sender`, so there is no deadlock. `recv` then errors, and `.expect` at `:507` panics on the caller's thread and leaks the handle (see S1). No operation before the send can panic today: `issue_read` only allocates (which aborts on failure), makes the FFI call and formats a string.
- **Failure paths release everything:**
  - P's spawn fails: `CloseHandle` at `:547-549`. No read exists yet.
  - P's handshake returns `Err`: the thread is joined, then the handle is closed (`:561-566`). The thread returned without a pending read.
  - G's open fails: `drop(SourceWatch { fired, handles })` at `:649`, which disarms, cancels, joins and closes P (`:469-496`).
  - G's spawn or handshake fails: G is closed inside `spawn_watch_thread`, and P is dropped through `SourceWatch` at `:670`.
  - A `Handle` is built only after `Ok` arrives (`:556-560`). So no disarm's `CancelIoEx` can come before a thread's first read, which rules out a join that never returns.
- **PendingRead's cancel-and-synchronize is preserved.** A `PendingRead` is now created and dropped only on its own watch thread. `Drop` (`:232-240`) still cancels by `OVERLAPPED` and waits on the cancellation. The B1 re-check after a re-issue (`:364-368`) is unchanged.
- **New window, checked against the consumer.** P's thread now runs while G is still arming, so the sink can fire before `arm` returns `ChecksOnly`. The kernel's sink only writes into the `PreAdmission` latch (`kernel/src/skp.rs:1012-1016`). The `ChecksOnly` arm (`:1129-1140`) admits regardless, and by then `arm` has joined every thread. Nothing leaks and nothing false is emitted. Before the fix the same window existed on the G-spawn-failure path.
- **Send wrapper** (`:274-277`): sound. A HANDLE is an opaque id, and the wrapper has a single consumer thread. `SendableHandle` has no `Drop`, so a failed spawn cannot close the handle twice.
- **§2a mapping and reason strings.**
  - No mapping-table row changed: the diff never touches `engine/SOURCE-WATCHER-PREREGISTRATION.md`, and the `watch_thread` loop body is unchanged.
  - I extracted every literal from origin/main's and the branch's watch.rs with a script (continuations resolved). With `which` = "parent"/"grandparent" (`:627`, `:666`), the branch produces the same set byte for byte: "could not arm the {parent|grandparent} directory watch: {e}", "could not spawn the {…} watch thread: {e}", the open, canonicalize and platform reasons, and the three CoverageLost causes.

## 2. Tests

- **Results** (`CARGO_TARGET_DIR=C:/dev/spatial-ide/target`, all exit 0):

| Command | Suites | Passed | Failed | Ignored |
|---|---|---|---|---|
| `cargo test -p spatial-engine` | 29 | 354 | 0 | 12 |
| `cargo test -p spatial-kernel` | 38 | 295 | 0 | 28 |
| `cargo test --workspace` | 81 | 776 | 0 | 40 |

  In the kernel run, `watcher_first_read_windows` passed 1, `source_watch_windows` 3 and `session_end_event` 7. In the engine run, `source_watch_adapter` passed 13, and both `watch::windows_watch::tests` passed.
- **Test (1) fails on the pre-fix code.** I checked out origin/main's `engine/src/watch.rs` and ran `cargo test -p spatial-kernel --test watcher_first_read_windows`. It FAILED by name at `kernel/tests/watcher_first_read_windows.rs:82` with "a healthy session must not end just because its opener thread exited: Ok(DatasetSessionEnded { session: SessionRef(..), reason: CoverageLost })". After `git checkout -- engine/src/watch.rs`, `git status` was clean.
- **Test (2)'s mutation, re-made.** I inserted `let _ = ready.send(Ok(()));` before `issue_read` in `watch_thread` and ran `cargo test -p spatial-engine --lib watch::windows_watch::tests`. `an_invalid_handle_reports_its_issuing_error_through_the_handshake` FAILED with "an invalid handle must fail to issue its first read" at the `assert!(mapped.is_err(), ..)` line. That is `:752`; it was `:753` in the mutated file. After reverting, `git status` was clean.
- **Both RECORDED MUTATION comments match what I observed** (`kernel/tests/watcher_first_read_windows.rs:38-42`, `engine/src/watch.rs:723-726`). The mutations above were observed by applying them, running the test and reverting. I also ran `node scripts/plan/verify-mutation.mjs` (PASS, 2/2), but that is only the recorded-by-name heuristic and not an observation of any mutation.
- **Additional probes, each applied and reverted, with the tree clean afterwards:**
  - (a) Vacuity. With `watch_thread` always sending `Err` and returning, every arm becomes `ChecksOnly`. Test (1) still PASSES (see S2).
  - (b) Removing `unsafe impl Send for PendingRead {}` (`:220`): `cargo check -p spatial-engine -p spatial-kernel --all-targets` is clean (see S3).
  - (c) The seam against the current main. In a temporary detached worktree at 09f6917 (main after #136 rewrote `kernel/src/skp.rs`), I checked out the branch's `watch.rs` and test file. main's watch.rs equals the base's. Results: `watcher_first_read_windows` 1, `source_watch_windows` 3, `session_end_event` 7, `source_watch_ordering` 14, `source_watch_adapter` 13, `--lib watch::` 2, all passing. The probe worktree was removed and pruned.

## 3. Hygiene

- **clippy** (`-p spatial-engine -p spatial-kernel --all-targets`, rc 0): 65 warnings, none in `engine/src/watch.rs` or `kernel/tests/watcher_first_read_windows.rs`. The two `#[allow(clippy::too_many_arguments)]` (`:282`, `:515`) are declared.
- **rustfmt `--check --edition 2021`:**
  - The kernel test file is clean.
  - watch.rs has 8 hunks, against 13 in the base file. Seven are identical to base hunks. The eighth (`:268`, `Ok(PendingRead { .. })`) is pre-existing drift whose trailing context changed because the new SAFETY comment follows it. The diff introduces no formatting hunk.
- **Line endings:** `git ls-files --eol` reports i/lf w/lf for all three files, with zero CR bytes.
- **Profile paths:** none in the diff; the only match of the scan is the copyright header, and the pattern was self-tested positive.
- **DCO:** all three commits are signed off.

## 4. Size figure

`git diff --numstat origin/main...HEAD` gives: form 13+0, `engine/src/watch.rs` 185+131, `kernel/tests/watcher_first_read_windows.rs` 100+0. That is 416 across 2 files with the form excluded, and it is 416 under histogram, patience and minimal as well. This matches the Amendment. `git diff 0d2576c HEAD -- engine/WATCHER-FIRST-READ-PREREGISTRATION.md` shows only the appended Amendment, so the Scope line is unedited. The Amendment's reason also checks out: P is spawned and its handshake received at `:619-631`, before G is opened at `:646`.

## 5. WATCH_BUFFER_BYTES (`engine/src/watch.rs:71`)

The diff does not change it. Line 71 and its uses (`:104`, `:211`, `:246`) are the same as the base. It produces no warning on Windows in this clippy run. Its only users are inside `#[cfg(windows)] mod windows_watch`, so the warning would be off-Windows dead code. Noted only.

## Blocking
None.

## Should-fix
- **S1: `await_first_read` `.expect` on a fallible `recv`** (`engine/src/watch.rs:505-508`). Reviewer rule 1 forbids `unwrap` on fallible paths in non-spike code.
  - If a watch thread panicked before sending, `arm` would panic on the `open_dataset` caller's thread. The directory handle would leak, because `CloseHandle` at `:563-565` is never reached, and the thread would be detached.
  - This is unreachable today, and it fails loudly rather than silently, which is why it is not a block.
  - Fix: map `RecvError` to `Err`, so the existing join and close path at `:561-566` runs.
- **S2: test (1) cannot tell "fixed" from "never armed".**
  - Probe (a) shows it passes when every arm is `ChecksOnly`. It asserts no event and an admitted query, but never that the session was actually Watching.
  - The rest of the suite (W1-W3, the A-tests) would catch that regression, but this test on its own is vacuous under it.
  - Add a positive control after the open: assert `describe(..).coverage.state == CoverageState::Watching`, as `kernel/tests/source_watch_ordering.rs:237` does.
- **S3: PendingRead's Send impl and its docs are now stale** (`:215-220`, `:229-231`).
  - The SAFETY comment describes `arm` moving a freshly issued `PendingRead` into the watch thread. The `Drop` doc describes a failed `Builder::spawn` dropping a closure that captured one. Neither happens any more.
  - Probe (b) shows the `unsafe impl Send` is no longer needed.
  - Removing it would make the compiler enforce C-1's property: a `PendingRead` could never leave its issuing thread. `SendableHandle`'s SAFETY comment (`:274-275`) would then need its own reasoning instead of pointing at PendingRead's.
  - These lines are outside the Scope parenthetical (see S4), so this needs the custodian's disposition.
- **S4: Scope parenthetical.** The Scope line reads "arm, watch_thread and their test module only". The diff also adds items outside those three:
  - `SendableHandle` (`:274-277`);
  - `await_first_read` (`:498-509`);
  - `spawn_watch_thread` (`:511-569`);
  - the `mpsc` import (`:111`).

  All of these are private, and their only product callers are `arm` and `watch_thread`, so the caller rule is satisfied. But the Amendment records only the budget. It is for the architect to rule whether helpers extracted from `arm` count as `arm`.
- **S5: §2a's Arming steps no longer describe the product.** `engine/SOURCE-WATCHER-PREREGISTRATION.md` §2a still reads: step 4 issues P's read, step 5 issues G's, and step 6 spawns threads only once every read is pending. The code now spawns each thread and issues each read on it, P before G is opened. The form's Out-of-scope keeps "§2a's mapping table" unchanged and says nothing about the Arming steps. The directive's C-1 paragraph (`state/directives/2026-09-28-after-wave-s1-batch.md`) authorises the direction. Whether the stale step text needs a record, and whether "guarantee none" stands, is for the architect gate.
- **S6: merge prep.**
  - `git merge-tree` shows an add/add conflict on `engine/WATCHER-FIRST-READ-PREREGISTRATION.md`. main carries the identical 11-line form from 84f7183; the branch adds the Amendment on top.
  - The branch is behind #136, which rewrote `kernel/src/skp.rs`. Probe (c) passes, but the branch should merge main and re-run `cargo test -p spatial-kernel` before merging, with a merge commit so 0f68413 stays reachable.

## Nits
- **N1:** the two new `unsafe { CloseHandle(handle) }` blocks (`:547-549`, `:563-565`) have no `// SAFETY:` line. The arm code they replace did not have one either.
- **N2:** test (2) exercises `watch_thread` plus `await_first_read`, not `spawn_watch_thread`, so its join-and-close `Err` arm (`:561-567`) and `arm`'s `Err(reason) => ChecksOnly` (`:630`, `:669-672`) run in no test. `an_unlistable_directory_arms_checks_only_with_its_reason` fails at step 2, before any handshake. Calling `spawn_watch_thread(null_mut(), ..)` would cover both; `CloseHandle(null)` is a harmless error.
- **N3:** `watch_thread` keeps `ready` alive for its whole life after sending `Ok`. `drop(ready)` after the send would state the one-shot intent. Cosmetic.

Files: `C:/dev/wt/watcher-first-read/engine/src/watch.rs`, `C:/dev/wt/watcher-first-read/kernel/tests/watcher_first_read_windows.rs`, `C:/dev/wt/watcher-first-read/engine/WATCHER-FIRST-READ-PREREGISTRATION.md`, `C:/dev/wt/watcher-first-read/kernel/src/skp.rs` (the sink's consumer, `:1005-1140`), `C:/dev/wt/watcher-first-read/engine/SOURCE-WATCHER-PREREGISTRATION.md` (§2a Arming). The worktree was left clean at 0c7be38. No process was left running; three stale `tail`/`grep` waiter processes I had started were killed. The probe worktree `C:/dev/wt/c1-gate-probe` was removed and pruned.
