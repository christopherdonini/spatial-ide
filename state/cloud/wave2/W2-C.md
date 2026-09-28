# Wave 2, W2-C (batch 2: W2-B+W2-C): the session's report

**Source:** session_01TS6NiEN6K48xsk9t37kRnb, the final assistant turn, copied at 2026-09-28T17:05:19Z with the message's own Copy action in claude.ai/code, and saved with LF line endings. Everything between the two rules below is the session's text, verbatim. The WAVE2 REPORT proper begins at `# WAVE2 REPORT`, and the lines above it are the same turn's progress narration. The custodian fields follow the second rule. They are filled locally, per `state/cloud/wave1-prompts.md` §3, carried into wave 2 by `state/cloud/wave2-prompts.md` §1. The saved text scans clean under the profile-path scanner's `--message` mode.

---

Worktree confirmed at d4245fe. Reading the kernel's generation registry, invalidator and watch sink now.

Still reading: ADR-035 and the watcher preregistration's ordering rules, then the close-races preregistration, to separate known limits from new mechanisms.

Checking the shell's admission flow for opens that are never closed, then the kernel's existing tests.

Not declared anywhere. Checking which thread runs `open_dataset` in the shell.

Found one undeclared Windows mechanism (first read issued on the arming thread). Now writing a Linux-runnable test for its kernel-side precondition, then building.

The DCO hook rejected an unsigned commit as required. Now I'm waiting for the kernel test build, which compiles DuckDB and is slow.

I'll be notified when the background build finishes.

The build is still compiling in the background; I'll report once the test runs.

Test passes. Also running the existing emission tests for a Linux baseline, then committing.

# WAVE2 REPORT
## Worker fields
Item: C          Lens/purpose: concurrency and lifecycle audit of the advisory source-change watcher and ADR-035's `dataset_session_ended` event
Baseline SHA: d4245feaef1ed94a4947bd2b2d1df9cc91a1a610 (confirmed with `git -C /tmp/wave2-baseline rev-parse HEAD` at start)
Branch: cloud/wave2-C   Commits: 5e821564c133deca9a7a5db9127a6e2bdb3ed894 (one test file only, DCO-signed; no PR opened)
Environment: Linux 6.18 container; rustc 1.94.1; cargo 1.94.1; node v22.22.2; npm 10.9.7. Network use: crates.io downloads for the build, plus git fetch and push to the repo's own origin. No other hosts.
Commands run:
- `git fetch origin d4245fe…` → 0
- `git worktree add /tmp/wave2-baseline d4245fe…` → 0
- `git -C /tmp/wave2-baseline rev-parse HEAD` → 0
- `git checkout -b cloud/wave2-C` → 0
- `git config core.hooksPath .githooks` → 0
- DCO probe: `git -c user.name=chris -c user.email=… commit -m "test: dco probe"` → 1. The hook refused it with "commit has no Signed-off-by trailer". The probe was then unstaged and deleted.
- `cargo test -p spatial-kernel --test wave2_arm_thread_lifetime -- --nocapture` → 0 (1 passed)
- `cargo test -p spatial-kernel --test session_end_event --test source_watch_ordering --test session_reference` → 0 (7, 1 and 15 passed)
- `git commit -s` → 0
- `git push -u origin cloud/wave2-C` → 0
Findings: 1

### Finding C-1
Claim: On Windows, the product watch issues each handle's first overlapped `ReadDirectoryChangesW` on the thread that calls `open_dataset`. In the shell that is a `spawn_blocking` pool thread. When that thread exits, the pending read is cancelled, and the watch thread reports it as `CoverageLost` even though no disarm happened. That ends a healthy session with reason coverage-lost.
Suggested severity: S2
Code path:
- `frontends/shell/src-tauri/src/commands.rs:60`: `tokio::task::spawn_blocking(move || host.open_dataset(request))`
- → `kernel/src/skp.rs:1049`: `self.arm.arm(...)` runs synchronously on that thread
- → `engine/src/watch.rs:526`: P's first read, `issue_read(parent_handle, P_FILTER)`, issued on the caller's thread; G's first read at `:551`, same thread
- → `:602-606` / `:640-652`: the pending read is moved to a new watch thread, but the I/O was issued by the caller's thread
- → caller thread exits (tokio's blocking-pool threads exit after an idle keep-alive)
- → `:292`: `GetOverlappedResult` fails with `ERROR_OPERATION_ABORTED`
- → `:296`: `disarming` is false, so the silent-disarm branch is skipped
- → `:301-309`: `CoverageLost` "completed with error 995"
- → `kernel/src/skp.rs:1017-1044`: `Admitted` arm → `end_generation(CoverageLost)` → event emitted; `viewport_query` then refuses `engine.source_coverage_lost` until reopen.
Reads re-issued later from inside `watch_thread` (`:332`) belong to the watch thread and are not affected. Only the first read per handle is.
Reproducer: `kernel/tests/wave2_arm_thread_lifetime.rs` on `cloud/wave2-C`; command `cargo test -p spatial-kernel --test wave2_arm_thread_lifetime -- --nocapture`. Observed: `OBSERVED: arm() ran on the open_dataset caller thread ThreadId(3); that thread exited; the ArmedWatch is still live in the host`, then `test result: ok. 1 passed`.
This proves only the kernel-side precondition on Linux: `arm` runs on the caller's thread, and the watch outlives that thread. The OS step is not reproduced; it is documented Win32 behaviour for handles with no I/O completion port (pending I/O is cancelled when the thread that issued it exits).
Guarantee violated:
- `SOURCE-WATCHER-PREREGISTRATION.md` §2a mapping table: only the watch's own disarm produces a silent abort, and `CoverageLost` means the watch actually lost coverage. Here it would be a false coverage-lost end.
- `docs/01` principle 8: no false diagnosis.
- ADR-035 Decision 4: the reason travels on the wire.
Evidence:
- Observed on Linux: the arming thread identity and exit (test output above).
- Read at the baseline: the first-read call sites (`watch.rs:526, :551`) and the abort mapping (`:294-310`).
- Read at the baseline: the shell calls `open_dataset` via `spawn_blocking` (`commands.rs:60`).
- Checked: every Windows test arms from a thread that stays alive until the signal (`engine/tests/source_watch_adapter.rs`, `kernel/tests/source_watch_windows.rs`), so this interleaving is not exercised anywhere.
False-positive check: I grepped KNOWN-LIMITATIONS.md, DECISIONS-PENDING.md, PLAN.yaml, `engine/SOURCE-WATCHER-PREREGISTRATION.md`, `kernel/GENERATION-CLOSE-RACES-PREREGISTRATION.md` and `state/` for "thread exit", "issuing thread", "completion port", "IOCP", "spawn_blocking" and "caller's thread". The only hit is an unrelated row ("after it, the thread exits", about the watch thread after one signal). It is not the known `live_or_mint` versus `close_dataset` race, not gate-2 S1 (a grandparent spawn failure), and not drafter note (i) (a post-close `invalidated` mark).
Confidence: code-path-only. The Linux test proves the precondition; the OS cancellation step needs Windows verification by CI or the custodian. I also did not check whether Tauri configures a non-default tokio `thread_keep_alive`.

### Unproven observations (not findings; at most five, one line each)
1. An event emitted between the kernel's `mint_for_open` and the shell's `handleAdmitted` is dropped as an unknown session (`App.tsx:743-750`); ADR-035 disclaims ordering and Decision 2 recovers it at the next refusal, so it is not a defect.
2. `admitDataset.ts:48-64`: if `describe` fails after a successful `open_dataset`, the open is never closed (catalog entry, `OpenRecord` and watch leak), but I found no reachable `describe` refusal after a successful open.
3. `close_dataset` returns `unknown_dataset` before removing the `OpenRecord` if the catalog entry was removed some other way (`skp.rs:1357-1365`), which would keep the watch's threads and handles alive; no product path removes it that way.
4. Checked and found sound at the baseline: lock order latch-then-generations; `StreamRegistry` never drops a retired source under its guard; `close_dataset` drops the watch outside the `watches` guard; `try_send` never blocks; emission happens only on `live.remove`, so at most once per generation.

### Stops (if any): none

---

## Custodian fields (filled locally, never by the worker)

Session ID: session_01TS6NiEN6K48xsk9t37kRnb   Model: Opus 5.5, Medium (as launched)   Launched/ended: 2026-09-28T07:36Z / the report posted by about 07:53Z (its commit 5e82156 at 07:53:22Z). The report was copied at 17:05Z, after the pause described in the ledger.
Spend: not individually attributable. The batch delta for the pair (W2-B+W2-C) was $8. The readings are in `state/cloud/wave2.md`.

**Triage against main at ec2b1c3.** `git diff d4245fe ec2b1c3` over `engine/src`, `kernel/src`, `frontends/shell/src` and `frontends/shell/src-tauri/src` touches only one line of `frontends/shell/src/docs/adrIndex.test.ts` (#135). Every item below is **still-present**.

**Finding C-1: S1 CANDIDATE.**
- **The grade.** The worker suggested S2 at code-path-only confidence. The custodian's own Windows reproduction settles the step the worker could not run. Wave 1 §4's S1 clause "a status that claims something untrue (principle 8)" applies: a healthy session ends with the reason coverage-lost, and the watch lost no coverage.
- **It is reachable in ordinary use.** At ec2b1c3, `frontends/shell/src-tauri/src/commands.rs:60` runs `open_dataset` on `tokio::task::spawn_blocking`. Nothing under `frontends/shell/src-tauri/src` sets `thread_keep_alive` or builds its own runtime, so a blocking-pool thread that goes idle exits under tokio's default. That leaves the question of when in the app's life the opening thread exits. The worker did not check this, and neither did the custodian.
- **Reproduced locally (Windows): yes, with the custodian's scratch test.** The test file is `kernel/tests/scratch_c1_windows.rs`, untracked and never committed, in the scratch worktree `C:/dev/wt/wave2-c` at 5e82156. It arms the real `PlatformWatch` through `SkpHost::open_dataset`, over a 30-feature fixture, and ran with `cargo test -p spatial-kernel --test scratch_c1_windows -- --nocapture --test-threads=1`:
  - **The opening thread exits.** Once it had joined, the `dataset_session_ended` event arrived within 136 µs, for this session with reason `CoverageLost`. `viewport_query` then refused with `engine.source_coverage_lost`.
  - **Control: the opening thread stays alive.** No event arrived within 5 s. After that thread was released and joined, `viewport_query` also refused with `engine.source_coverage_lost`. The session ends exactly when the thread that armed the watch exits.
- The worker's Linux test on cloud/wave2-C proves the kernel-side precondition: `arm` runs on the caller's thread. The regression test for any fix belongs on Windows, where the OS step happens.
- This item is on main now, in ordinary use, unlike A2-1 and B-1. Following the wave's rule, it still goes to Fable in the after-wave batch, and nothing becomes a cut during the wave. The custodian tells the human now.

**Unproven observations:**
1. DISCARD, S3. The worker itself reads this as no defect: ADR-035 disclaims ordering, and Decision 2 recovers the event at the next refusal.
2. RECORD, S2: a defect on a path unreachable today. The code convinces. At ec2b1c3, `frontends/shell/src/admission/admitDataset.ts:47-64` lets a `describe` failure after a successful `open_dataset` fall to the catch without closing the dataset. The worker found no reachable `describe` refusal after a successful open. A proposed PLAN node records it at the wave's end.
3. RECORD, S2: a defect on a path unreachable today. The code convinces. `close_dataset`, at `kernel/src/skp.rs:1357-1359` @ d4245fe, returns `unknown_dataset` before removing the `OpenRecord`, and no product path removes a catalog entry any other way. A proposed PLAN node records it at the wave's end, in `kernel-close-races-followups`' territory.
4. Kept as evidence, no severity: the checks the worker found sound. These are the lock order, `StreamRegistry`'s drop discipline, `close_dataset` dropping the watch outside its guard, `try_send`, and emission at most once per generation.
