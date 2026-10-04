# PR #173 gate 1 — reviewer
Reviewed: cut/watch-grandparent-spawn-signal @ f0e892806b0ab1ba28171a50c76afe25254fc148

Tag: `node:watch-grandparent-spawn-signal@g1`. Governing form: `kernel/WATCH-GRANDPARENT-SPAWN-SIGNAL-PREREGISTRATION.md` (on main since 4c91a76e3edfb5a9e6621feb6b05e5580bff6641; unchanged by the diff). Diff read three-dot, `origin/main...origin/cut/watch-grandparent-spawn-signal` (merge base 4c91a76e3edfb5a9e6621feb6b05e5580bff6641): 5 files, 97 insertions, 4 deletions. Worktree `C:/dev/wt/wgss`, every cargo run with `CARGO_TARGET_DIR=D:/wt-targets/wgss` under `timeout`. Run 2026-10-04 (UTC).

## Verdict: PASS

No blocking finding. One S2, three N.

## Findings

### S1 (blocking)

None.

### S2

- **S2-1. P-3 has no record.** §5 P-3 (the workspace `--list` gains exactly GS1 and GS2 on each CI entry; `--list --ignored` unchanged) is not recorded in worker report 1 or in the PR body's Evidence list; P-1 and P-2 are. Evidence collected here: the Product CI logs, run 37206457047 at 38bb2d63 (code-identical to the base: `git diff --stat 38bb2d63 4c91a76e -- kernel/ engine/src` lists only the form) against run 37215720603 at f0e89280. Executed-test names: ubuntu 854 to 856, windows 873 to 875; the diff of the sorted name lists is exactly `a_coverage_loss_recorded_before_a_checks_only_outcome_refuses_with_its_own_code` and `a_signal_recorded_before_a_checks_only_outcome_refuses_the_open` on both entries. `cargo test --workspace --locked -- --list --ignored` lines: ubuntu 55 and 55, windows 40 and 40, diff empty on both. P-3 holds. CI has no plain `--list` step, so the executed-name lists stand in for it. Suggest the closing record cite this report for P-3, as a reference.

### N

- **N-1.** The new comment in `kernel/src/skp.rs`'s `ChecksOnly` arm cites `SOURCE-WATCHER-PREREGISTRATION.md` unrooted. The same function already does so (the arming comment above it); verify-cites treats it as loose. No action.
- **N-2.** `kernel/README.md`'s "Last verified at" names f25aef60cf1a7e66d1215848d9db2c4fff0739ed, a branch commit; it is reachable on main only through a merge commit (the PR body says merge commit only). The prior value 4d487d51 was also not a first-parent main commit, so this follows existing practice.
- **N-3 (pre-existing, not this diff).** `engine_error_of_pre_admission_signal`'s `Change` detail literal is wrapped in braces, so they reach the message as literal characters (`kernel/src/skp.rs:1024 @ f0e892806b0ab1ba28171a50c76afe25254fc148`, identical at the base). §8 item 2 forbids changing it here; a ledger candidate at most.

## Checklist

### Full diff

- `engine/src/watch.rs`: the `ArmOutcome::ChecksOnly` doc gains the one engine-fact sentence (§2a). No code, `cfg`, `pub` item or reason text changes.
- `kernel/src/skp.rs`: one hunk inside the `ChecksOnly` arm of `SkpHost::open_dataset`. Under the latch guard the arm already takes, `PreAdmission { recorded: Some(signal) }` clones the signal, drops the guard, calls `self.catalog.remove`, then returns `Err(error_of(&engine_error_of_pre_admission_signal(signal)))`. It returns before `SessionRef::mint`, `mint_for_open`, the `Admitted` store and the `OpenRecord` insert, and leaves the latch `PreAdmission`. The order (latch released, then `catalog.remove`) matches the `Watching` refusal. The `None` path is byte-identical to the base. The comment states the owner's consequence and cites §2b step 1 by section.
- `kernel/tests/injected_watch/mod.rs`: a checks-only path fires and removes a queued `fire_on_next_arm` signal through the sink, then returns `ChecksOnly` (§2c). The only other `mark_checks_only` caller is K8 (`kernel/tests/source_watch_ordering.rs`), which queues nothing, so it behaves as before.
- `kernel/tests/source_watch_ordering.rs`: GS1, GS2 and their shared helper, each test with its `RECORDED MUTATION:` doc and `// Mutation: see` line (§4).
- `kernel/README.md`: the Owner's index (below).
- Correctness: no `unwrap` on a fallible product path (the latch lock uses `unwrap_or_else(|e| e.into_inner())` as before). No lock-order change: the sink takes the latch only while `open_dataset` does not hold it (inside `arm`; in tests synchronously, in the product on P's thread, joined before `arm` returns). No JSON, no CRS, no float, no perf claim. Nothing new blocks the UI path.
- Caller rule: no new `pub` item, option, callback or code path. The new branch's product caller is `PlatformWatch` on Windows, built in `frontends/shell/src-tauri/src/lib.rs` (`spatial_engine::PlatformWatch::new()`), reached through G's three failure returns.

### §1 seam, against `engine/src/watch.rs` at the head (it differs from the base only in the doc sentence)

- P's spawn failure: no thread was created. P's handshake failure: `spawn_watch_thread` joins the thread before returning `Err` (read at 38bb2d63, not pinned).
- G's open failure, and G's spawn or handshake failure: each does `drop(SourceWatch { fired, handles })` before `return ArmOutcome::ChecksOnly`. `SourceWatch::drop` cancels, joins every thread, then closes (`engine/src/watch.rs:484-510 @ 38bb2d63 sha256:29e320c493f9a252013de9dc37e5ab070206d0fe05ea7f5c64316de91f852009`). G's own handshake failure also joins G inside `spawn_watch_thread`.
- The early `ChecksOnly` returns before P's spawn (watch.rs lines 608-630 at the head) have no thread.
- Every sink call is therefore on a thread joined before `arm` returns. The reading holds; the test implementor's order (sink inside `arm`, then `ChecksOnly`) is the product's happens-before order. GS1 and GS2 drive the real `SkpHost::open_dataset` through the real `SourceWatchArm` trait.

### §4 mutations, observed by name at f0e892806b0ab1ba28171a50c76afe25254fc148 (each applied in the worktree, run, reverted; not via verify-mutation)

Command for each: `cargo test -p spatial-kernel --test source_watch_ordering -- checks_only_outcome`. Panic locations below are written with forward slashes; the Windows output prints backslashes.

- **GS1's mutation** (the `ChecksOnly` arm admits without reading the latch; `git checkout 4c91a76e -- kernel/src/skp.rs`, a 14-line deletion): rc 101. `a_signal_recorded_before_a_checks_only_outcome_refuses_the_open` FAILED, panicked at `kernel/tests/source_watch_ordering.rs:396:10`, the helper's `expect_err`, with `OpenDatasetResponse { .. }`. GS2 failed the same way. Reverted with `git checkout HEAD -- kernel/src/skp.rs`; porcelain empty.
- **GS2's mutation** (the `ChecksOnly` refusal maps every signal to `EngineError::SourceChanged`; line 1272 replaced by a `SourceChanged { detail: "mutation" }` return): rc 101. `a_coverage_loss_recorded_before_a_checks_only_outcome_refuses_with_its_own_code` FAILED at `kernel/tests/source_watch_ordering.rs:397:5` with left `"engine.source_changed"`, right `"engine.source_coverage_lost"`; GS1 ok (1 passed, 1 failed). Reverted; porcelain empty.
- **Extra probe, not a form mutation** (the refusal skips `self.catalog.remove`): rc 101; both tests FAILED at `kernel/tests/source_watch_ordering.rs:399:5`, the catalog-empty assertion. Reverted; porcelain empty. §8 item 6's catalog clause is held by the tests, not only by the code read.

### §5

- **P-1 reproduced.** With `kernel/src/skp.rs` at its base body over the head (the GS1-mutation tree above; the other head changes are a doc sentence and the README), GS1 and GS2 both fail at `expect_err`, at line 396, as the worker recorded. The worker's P-1 diff hash reproduces: `git diff 4c91a76e f25aef60 -- kernel/tests/injected_watch/mod.rs kernel/tests/source_watch_ordering.rs | sha256sum` gives `95e5cea2af21d98c8435a11c7e8bc62fe2fc3e35b110e06f5621bbf4a488f348`, the value in worker report 1, so the P-1 tree's tests are byte-identical to f25aef60's.
- **P-2.** At the head: `cargo test -p spatial-kernel --test source_watch_ordering`, rc 0, 16 passed (GS1, GS2, K6 `a_signal_between_arming_and_admission_refuses_the_open` and K8 `an_unwatchable_source_opens_checks_only_and_describe_says_so` among them). `cargo test -p spatial-kernel`, rc 0, 39 result lines summing to 323 passed, 0 failed, 28 ignored, matching worker report 1.
- **P-3.** Holds; see S2-1.
- **Declared unchanged.** watch.rs outside the doc; the `Watching` arm, the sink closure, `LatchState`, `engine_error_of_pre_admission_signal` (the hunk touches none); K6 and K8 (the test file diff is additions only, after K6); SKP-V0, ADR-035, KNOWN-LIMITATIONS (not in the diff). `cfg(` occurrences in `engine/src/watch.rs` plus `kernel/src/skp.rs`: 16 at the base (4 and 12), 16 at the head. The cfg-boundary CI check passes.
- **I1** did not fire: GS1 fails at the base (P-1 above).
- **I2** did not fire: no change to the `Watching` arm, the sink closure, a string or a `pub` item (diff read).
- **I3** did not fire: the seam read above finds no sink call that can follow a `ChecksOnly` return.
- **I4** did not fire: `impl SourceWatchArm for` across every `.rs` file finds `PlatformWatch` (`engine/src/watch.rs:86`), `NoWatchArm` and `RacingCoverageLossArm` (`kernel/src/skp.rs`, each `#[cfg(test)]`), `FlagArm` (inside `#[cfg(test)] mod ticket_drop_under_lock_regression`), and the two `kernel/tests/` modules. No other product implementor.

### §7, recounted by its own command

`git diff --numstat origin/main...HEAD` in the worktree, rc 0: `engine/src/watch.rs` 3/1, `kernel/README.md` 3/3 (excluded, `*.md`), `kernel/src/skp.rs` 14/0, `kernel/tests/injected_watch/mod.rs` 6/0, `kernel/tests/source_watch_ordering.rs` 71/0. Counted: 95 over 4 files, within 160 and 4, all four the named files. No overrun; §7 unedited.

### §8, item by item

1. The form landed on main at 4c91a76e; both code commits (f25aef60, f0e89280) descend from it on the branch. Clear.
2. No wire code, member, literal, detail or `Display` string added or changed in product code. Clear.
3. watch.rs: the doc sentence only; no new `cfg` in product code (count above). Clear.
4. No new `pub` item, option, callback or test-only product path. Clear.
5. The `Watching` arm, the sink closure, K6 and K8 untouched. Clear.
6. The refusal removes the catalog entry and returns before any `OpenRecord`, `SessionRef` or `Admitted` latch; with the latch still `PreAdmission` the sink's emitting arm cannot run. The tests assert catalog-empty and no event. Clear.
7. Mutations observed above by applying and running; verify-mutation run separately and not called an observation. Clear.
8. §7 not exceeded and not edited. Clear.
9. No diff under `protocol/`, `frontends/` or `renderer/`. Clear.

### Owner's index (`kernel/README.md`, §9)

- The new "Watcher arming and admission" line is byte-identical to the architect draft's proposed line: `state/consults/2026-10-04-watch-grandparent-spawn-signal-architect-draft.md:202` and `kernel/README.md:356 @ f0e892806b0ab1ba28171a50c76afe25254fc148` both hash to `66bc6d4937d9fffd4c6d2cc59f43d4e45aa5687f210b18baa89fc9884419768f`.
- Every pointer resolves at the head: both preregistration files exist; `engine/SOURCE-WATCHER-PREREGISTRATION.md` has its §2b heading; each of the four named tests occurs once as `fn <name>()` in its file (`source_watch_ordering.rs` three, `watcher_first_read_windows.rs` one).
- The form is appended to "preregistrations in this module". The index is 37 lines, under its 60-line cap. `engine/README.md` is unchanged, as §9 says.

### Pins at 38bb2d63

`38bb2d63e732bf3ceb7d0b48fc2f9f7bb5b366b7` is on main. All 20 `path:line @ 38bb2d63 sha256:` references in the form recomputed with `git show 38bb2d63:<path> | sed -n '<a>,<b>p' | sha256sum`: 20 OK, 0 mismatch. Content read for the code pins: `watch.rs:649-666` (P's spawn and handshake, before G), `484-510` (`SourceWatch::drop`: cancel, join, close), `681-691` and `693-707` (G's open, and its spawn and handshake, each dropping `SourceWatch` and returning `ChecksOnly`), `330-357` (P's thread calling the sink), `56-59` (the `ChecksOnly` doc, silent on sink calls), `90-99` (the non-Windows arm: `ChecksOnly`, no sink call); `skp.rs:1130-1137` (the sink recording into `PreAdmission`), `1203-1239` (the `Watching` refusal), `1258-1276` (the `ChecksOnly` arm minting without reading the latch). Each says what the form says it does. The form is the architect draft's fenced body (`state/consults/2026-10-04-watch-grandparent-spawn-signal-architect-draft.md:35-196`) differing, after the pins are normalized, in exactly the three changes the custodian declared: the pins filled at 38bb2d63, the bare `:16` expanded to its path (§0 item 3), and the header line replaced by on main before any code.

### Suites

- CI, `gh pr checks 173`, rc 0: 13 checks, all pass. Product CI runs 37215598027 (event: branch update) and 37215720603 (pull_request), and the Governance and fmt runs, all carry headSha f0e892806b0ab1ba28171a50c76afe25254fc148. GS1 and GS2 report `ok` in both `cargo test --workspace` jobs (ubuntu-24.04 job 111475699504, windows-latest job 111475699653).
- From the main checkout at f0b01da3e47533056bf3d3e6bd9b9d0f90acfa20 (scripts identical to the base: `git diff --stat 4c91a76e f0b01da3 -- scripts/` is empty):
  - `node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs"`: rc 0, 440 pass, 0 fail.
  - `node scripts/plan/verify-cites.mjs` (script last changed at 522e448d55e089b974e115e23f0c72bfc6e1120a): rc 0, PASS, 1272 files.
  - `node scripts/plan/verify-quotes.mjs` (f9444a4d99a9087394c55d4b1d4c414a8b11f980): rc 0, PASS, 117 checked, 0 hash-reference errors.
  - `node scripts/plan/verify-test-claims.mjs` (e9735d4749f094f03b69a8b570e8bf10f511c279): rc 0, PASS, 492 claimed tests (2 planned: GS1 and GS2, not yet on main).
  - `node scripts/plan/verify-mutation.mjs --base 4c91a76e3edfb5a9e6621feb6b05e5580bff6641 --head f0e892806b0ab1ba28171a50c76afe25254fc148` (7d24ed155a120556d6e726eea68237409270d975): rc 0, PASS, 2 new tests each named by a recorded mutation. A text heuristic, not an observation.
  - `node scripts/plan/verify.mjs` (260720226f136d1ec7d72da64656f07d29400ed7): rc 0, verify:plan PASS.
- The same three tree checks over the head tree (run in the worktree, same script bytes): verify-cites rc 0 (1265 files), verify-quotes rc 0, verify-test-claims rc 0 (492 claimed, 0 planned).
- `cargo fmt -p spatial-kernel -p spatial-engine --check` in the worktree: rc 0.

## Commands and exit codes (worktree unless stated)

- `git fetch -q origin`, then `git diff --stat origin/main...origin/cut/watch-grandparent-spawn-signal`: rc 0.
- `cargo test -p spatial-kernel --test source_watch_ordering` (head): rc 0, 16 passed.
- GS1 mutation run: rc 101. GS2 mutation run: rc 101. Catalog probe run: rc 101. Each followed by `git checkout HEAD -- kernel/src/skp.rs` and an empty porcelain.
- `cargo test -p spatial-kernel` (head): rc 0, 323 passed, 0 failed, 28 ignored.
- `cargo fmt -p spatial-kernel -p spatial-engine --check`: rc 0.
- Pin recompute loop (main checkout): rc 0, 20 OK.
- `git diff --numstat origin/main...HEAD`: rc 0.
- `gh pr checks 173`: rc 0. `gh run view` (head SHAs, job logs): rc 0.
- Main checkout: `node --test` rc 0; verify-cites rc 0; verify-quotes rc 0; verify-test-claims rc 0; verify-mutation rc 0; verify (plan) rc 0.
- Head tree: verify-cites rc 0; verify-quotes rc 0; verify-test-claims rc 0.

## End state

Worktree `C:/dev/wt/wgss` at f0e892806b0ab1ba28171a50c76afe25254fc148 with an empty `git status --porcelain`. No cargo, rustc or test process running (`tasklist` filter empty). Nothing committed or rebased; nothing sent to the remote.
