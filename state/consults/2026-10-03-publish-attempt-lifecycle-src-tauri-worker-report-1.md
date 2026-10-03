# Worker report — publish-attempt-lifecycle-src-tauri (2026-10-03)

*Custodian's filing note: the worker-high's hand-back on the brief for PLAN node `publish-attempt-lifecycle-src-tauri` (form `frontends/shell/PUBLISH-ATTEMPT-LIFECYCLE-SRC-TAURI-PREREGISTRATION.md`, committed ff57832), recorded verbatim with the harness's report indentation removed. No rooted `path:line` cite needed de-rooting; nothing in the text is changed.*

*The custodian's checks:*
- *branch `cut/publish-attempt-lifecycle-src-tauri` at 4d92733, read from origin: commits 6035fe7, 40aa795, 8fe073a, 005d2f5, c92b17b, faab659 and 4d92733;*
- *the worktree is clean;*
- *at filing (07:52Z) no `cargo.exe` was running, and the `node.exe` processes visible (started 07:42Z and 07:47Z) run a `node --test tests/*.test.mjs` script that no tracked `package.json` declares; whether they are the ones the hand-back mentions is not known; they are not attributed to this piece and are left alone.*

*Profile paths redacted at filing: none.*

---

## Hand-back 1 (the build)

Node 8 (`publish-attempt-lifecycle-src-tauri`) is implemented and pushed to `cut/publish-attempt-lifecycle-src-tauri` (head 4d92733). No PR opened, nothing rebased or force-pushed, the shell app was not run. I stopped on none of §5's invalidators. The suites all exit 0 and §7's count is 694 over 5 files.

## Commits
Each is signed off and carries the Co-Authored-By and Claude-Session trailers.
- 6035fe7: P0, T2 alone, test-only.
- 40aa795: item 1 (`try_insert`, `run_exclusive`, `binding_publish_execute` through `run_exclusive`) plus T1. It also adds the registry's exit API (`cancel_all`, `wait_idle`, `on_exit_requested`, `ExitAction`, `DrainOutcome`, `EXIT_DRAIN_CEILING` = 30 s). Those are dead code at this commit, since `lib.rs` is two commits later.
- 8fe073a: item 2, the narrowed grants critical section (new `Authority` enum), plus T3.
- 005d2f5: item 3, the `lib.rs` event callback, plus T4, T5 and T6.
- c92b17b: KNOWN-LIMITATIONS item 30 and Part R row R1.
- faab659: the six `// RECORDED MUTATION:` comments.
- 4d92733: keeps the startup `.expect` text byte-identical to the base. I had changed it to "building"; that is a changed message under §8 item 3.

## P0
T2 failed at the base (ff57832) with panic text "try_lock found the shared grants mutex held while publish_prepared ran". That is its `try_lock` assertion. The execute had parked, so the failure was not a setup failure. The commit is 6035fe7.

## M1 to M6
Each was applied on c92b17b, the named test was run, and the mutation was reverted (`git status` was clean afterwards). The comment commit is faab659.
- **M1** (unconditional insert in `run_exclusive`): T1 failed at "the second call must be refused".
- **M2** (guard held across `boundary::execute`): T2 failed at "try_lock found the shared grants mutex held while publish_prepared ran".
- **M3** (`remove_matching` after the boundary on the Ok path): T3 failed at "C's grant must have survived A's consumption", C being refused with "no grant authorizes".
- **M4** (empty `cancel_all`): T4 failed at its `Refused` let-else with `got Some(Success {..})`, the publish having run to completion.
- **M5** (`wait_idle` returns Drained unread): T5 failed at "one entry left at a zero ceiling" (left Drained, right TimedOut).
- **M6** (no once-flag): T6 failed at "a drain has already begun" (left PreventAndDrain, right Proceed).

`verify:mutation` passed, but I did not treat that run as an observation of any mutation.

## Crate versions re-read
These match `Cargo.lock`: tauri 2.11.5, tauri-runtime-wry 2.11.4, tao 0.35.3, muda 0.19.3, plus tokio 1.53.1. Nothing differed from §0:
- `RunEvent::ExitRequested` carries `code` `None` for a user exit.
- `prevent_exit` sends on a channel.
- wry's last-window `Destroyed` emits `ExitRequested { code: None }` and reads the answer with `try_recv` right after the callback.
- `LoopDestroyed` emits only `Exit`.
- The default menu is macOS-only, and muda maps Quit to `terminate:`.
- `applicationWillTerminate` calls `AppState::exit`, which emits `LoopDestroyed`.
- `WM_ENDSESSION` calls `loop_destroyed`, and `WM_QUERYENDSESSION` is commented out in tao.
- tao has no SIGTERM handling.
- `process::exit` is called in tao's Windows event loop.

## Suites and counts
Exit codes were captured directly:
- `cargo test --manifest-path frontends/shell/src-tauri/Cargo.toml --locked`: rc 0, final run after 4d92733. That is 65 lib tests, 0 main, 2 `sole_caller_scan`, 0 doc.
- All nine §5 declared-unchanged tests that live in `publish.rs` printed ok in the full run, and so did `sole_caller_scan`.
- `cargo fmt --manifest-path frontends/shell/src-tauri/Cargo.toml -- --check`: rc 0.
- `cargo check --release --locked` and `cargo check --release --locked --features measure-build`: rc 0, no warnings, run before the last commit. This is CI's check; it would otherwise have warned about an unused `CancelToken` import.
- `npm run verify` in `frontends/shell`: rc 0, with 1096 vitest tests in 72 files and 30 citation checks. It needed `npm ci` in `renderer/bundle-viewer` and `frontends/shell` first, and then a build, because the tauri build script wants `src/generated/NOTICE.txt`.
- `node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs"`: rc 0, 408 passed, 0 failed (run before the last commit; that commit touches only `lib.rs`).
- `verify-cites`, `verify-quotes` and `verify-test-claims`: rc 0 each, re-run on the final tree.
- `verify-mutation --base origin/main --head HEAD`: rc 0, all 6 new tests named.
- `timeout 570 node scripts/plan/verify.mjs`: rc 0, re-run on the final tree.
- `profile-path-scan --staged`: clean before every commit.

## §7 count
`git diff --numstat ff57832...HEAD`, run at 4d92733 with §7's exclusions, gives 657 insertions and 37 deletions, total 694 over exactly 5 files, within 700.

| File | Ins | Del |
|---|---|---|
| `KNOWN-LIMITATIONS.md` | 14 | 0 |
| `MANUAL-WALKTHROUGH.md` | 32 | 0 |
| `commands.rs` | 24 | 21 |
| `lib.rs` | 26 | 2 |
| `publish.rs` | 561 | 14 |

## KNOWN-LIMITATIONS item 30 (from the diff, appended after item 28)
> 30. **A publish interrupted by an exit the app does not drain can leave a hidden staging directory beside its destination, and the audit then shows the attempt with no outcome.** When the last window is closed while a publish is running, the app cancels it and waits for it to stop, for at most 30 seconds; the publish removes its own staging directory and the audit records an outcome of cancelled. The app does not do that, and the publish is not cancelled, in these cases: the application menu's Quit on macOS, a SIGTERM, a logout or shutdown, a forced kill or power loss, and a publish that has not stopped when the 30 seconds end. After any of them a directory named `.<destination name>.staging-<hex>` can remain in the destination's parent folder; nothing removes it, and it is safe to delete. The audit then shows the attempt as its intent with no outcome, which `--audit-show` prints as "no outcome (interrupted?)", because the app cannot yet record "unknown" explicitly. Only Windows has been exercised. On macOS and Linux the app also quits when its last window closes; it does not follow macOS's convention of staying running.

Its trailing comment marks it as draft wording for the human's sight.

## Row R1 (from the diff, Part R at the end of `MANUAL-WALKTHROUGH.md`, result log blank)
The row's Step cell:
> **1.** Open `parcels-5gb.parquet` (Part H's H1). **2.** Click **Publish…**, choose **Current view** after sizing the viewport as H6 does (about 1/8 × 1/8 of the layer's extent, under about 300k rows: **Whole dataset** is refused before the pin at this size, Part M's M10), pick a fresh destination under `C:\dev\spatial-ide\target\`, and confirm. **3.** While the phase line reads `verifying-source` or `writing-partitions`, close the window with its close button. **4.** Relaunch the app at once, the same way it was launched. **5.** In the relaunched window, open `100k-happy-path.parquet` (Part A). **6.** Wait at least 30 s after the close.

Its Expected cell:
> **(i)** The relaunched app starts with no startup-refusal dialog, admits the 100k fixture and draws it (the data plane works). **(ii)** After the wait, only one instance of the app's process (`spatial-ide-shell.exe`) remains. **(iii)** The destination is absent, and with hidden items shown its parent holds no `.<name>.staging-*` entry. **(iv)** From `C:\dev\spatial-ide`, `target\debug\publish-bundle.exe --audit-show` reads that attempt as CANCELLED (Part H's H9 runs the same command), not as "no outcome (interrupted?)", and no line is reported corrupt. **(v)** `%LOCALAPPDATA%\dev.spatialide.shell\logs` holds two distinct `session-*.log` files for this sitting, one per process. A result of "no outcome (interrupted?)" together with a staging entry is the declared ceiling case (KNOWN-LIMITATIONS 30): record it as a deviation, never as a pass. If step 3's publish finished before the window could be closed, record that and repeat with a larger viewport. Row G9 is unchanged.

## Deviations and additions, with reasons
1. **R1 step 2 names Current view.** §9's paraphrase says "publish to a fresh destination". Part M's M10 shows Whole dataset on the 5 GB fixture is refused at preflight (ADR-025), so H6's viewport sizing is the only way to reach `writing-partitions`. This is an addition to §9's paraphrase.
2. **R1 launch mode.** The "Before R1" note says to build with `npx tauri build --debug --no-bundle` and launch the executable directly, both times, as Part M's M12 mode 2 does. Reason: `vite.config.ts` has `strictPort: true`, so a second `npm run tauri dev` while the first is alive would fail for an unrelated reason.
3. **`Authority` enum.** I used a private enum for the Local/Shared grants in `execute_with_progress` instead of Options. If `add` on an empty set ever failed, the code falls back to the shared path, so there is no panic.
4. **`CancelToken` annotation.** The closure in `binding_publish_execute` is annotated `|cancel: CancelToken|`. Without it the import is unused in a release build, and a `#[cfg]` would breach §8 item 10.
5. **`with_registered_cancel`.** Its doc gained one sentence saying it is prepare-only; its behaviour is unchanged.
6. **Test shape.** The tests use `Park` and `Settle` helpers in `mod tests`: a `Barrier(2)` plus an atomic once. `Settle` takes both rendezvous on drop if the execute never parked, so a failed run cannot hang. T4 also calls `wait_idle(60 s)` after the release; that is a hang guard, not an assertion on time.
7. **Dead code at 40aa795.** The exit API there has no caller until 005d2f5. This was a commit-splitting choice, so that commit alone would warn.

## Caller grep (new pub items)
- `try_insert` is called from `run_exclusive` in `publish.rs`.
- `run_exclusive` is called from `commands.rs:422`.
- `on_exit_requested`, `ExitAction`, `wait_idle` and `EXIT_DRAIN_CEILING` are all used in `lib.rs:567-572`.
- `cancel_all` is called from `on_exit_requested`.
- `DrainOutcome` is returned by `wait_idle`.

## Pre-gate self-check
- **Cross-module interfaces:** the shell uses `GrantSet::find`, `remove_matching` and `add`, `PublishGrant: Clone`, and `boundary::execute` as they exist at ff57832. S1 is proved by T2 and T3, S2 by T4. S3, the event loop, is by the source read plus R1, as question round 40, item 3 rules.
- **Completion claims:** each points at an observed failure above.
- **User-facing messages:** there is no new or changed UI string, Display or log line.
- **Tests reach their assertions:** the T2 and T4 positive controls and the `park.reached()` assertions fire before the interesting ones.
- **Model and context:** I ran as Sonnet 5.5, with no override and no context handoff.

## Off-scope observations, not acted on
- `origin/main` is now 80cbcba and the cut base is ff57832. I did not rebase.
- Per §2 item 3 and T6, a second `ExitRequested` while a drain is in progress returns `Proceed`. A future second caller of `app.exit` would therefore end the drain early. §8 item 6 may deserve the architect's eye.
- A publish that registers after the drain begins is not cancelled, because `cancel_all` runs once. That seems unreachable with the window closed.
- Clippy reports pre-existing `large_enum_variant` and other lints in `commands.rs` and `publish.rs`; none are from this piece.
- The scratch logs are in `D:/wt-targets/publish-lifecycle-*.log`, outside the repo.
- I could not tell whether the `node.exe` and `cargo.exe` processes still visible in the process list belong to this session, so I left them alone.

Files:
- `C:/dev/wt/publish-lifecycle/frontends/shell/src-tauri/src/publish.rs`
- `C:/dev/wt/publish-lifecycle/frontends/shell/src-tauri/src/commands.rs`
- `C:/dev/wt/publish-lifecycle/frontends/shell/src-tauri/src/lib.rs`
- `C:/dev/wt/publish-lifecycle/KNOWN-LIMITATIONS.md`
- `C:/dev/wt/publish-lifecycle/frontends/shell/MANUAL-WALKTHROUGH.md`

`git status --porcelain` in the worktree is empty.
