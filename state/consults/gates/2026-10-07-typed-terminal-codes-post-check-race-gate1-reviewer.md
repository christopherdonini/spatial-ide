# PR #187 gate 1 — reviewer
Reviewed: cut/typed-terminal-codes-post-check-race @ 0c94dcb033b8b5f3b961329a7525ab1484ffd297

(I did not write the report file. My standing instructions in this run forbid writing report files, so I am treating that as the refusal the brief allows for. The full report follows. Its file path would have been C:/dev/spatial-ide/state/consults/gates/2026-10-07-typed-terminal-codes-post-check-race-gate1-reviewer.md.)

## Verdict

**PASS.** No Correctness finding and no Evidence finding. There is no open Documentation finding.

Base 92884cc4a9aaafa12394814c4dedee0ef0b9abeb (the merge-base with origin/main, and the base the PR body names). Commits 150ea7d7 (Part A) and 0c94dcb0 (Part B). Worktree C:/dev/wt/ttc-rev: HEAD is 0c94dcb0 and the porcelain was empty at the end.

## Correctness — none

- **Scope.** `git diff --name-only 92884cc4 0c94dcb0` lists only `kernel/tests/session_end_event.rs` and `kernel/tests/typed_terminal_codes.rs`. Nothing is touched under protocol/, in wire fixtures, in lockfiles, in kernel/README.md, or in any file on the lines cut's §7 list. I checked that list against `engine/GEOMETRY-LINES-PREREGISTRATION.md` on origin/main, and neither test file is on it. `git diff --stat 3d740f7b 0c94dcb0 -- engine/src kernel/src engine/GEOMETRY-LINES-PREREGISTRATION.md` is empty, so no product line changed and every product-code pin in the form is still current at the head.
- **Ordering argument (§2), re-read at the head.**
  - `viewport_query` → `open_engine_stream` → `stream_with_cancel` spawns the producer with `sync_channel(MAX_QUEUED_BATCHES)`, and `MAX_QUEUED_BATCHES` = 2.
  - Neither `wrap_for_data_plane` nor ticket redeem receives from the channel. The test's `next_into` → `EngineSource::next_into` → `BatchStream::next_into` → `rx.recv()` is the only receive.
  - So a third delivered Ok batch proves that the third send finished after the first receive, and that receive comes after the touch. The post-check runs after `produce` returns, which is after the last send.
  - The assertion `batches > MAX_QUEUED_BATCHES` is placed after the drain loop and before the terminal expect, in both A4 and B2.
  - Arithmetic: the targets are 64 KiB, 256 KiB and 1 MiB (FIRST_TARGET_BATCH_BYTES and growth 4, capped at TARGET_BATCH_BYTES). The first two sum to 327,680 and the first three to 1,376,256. A batch cut before append never exceeds its target. `estimate_bytes(1, v)` = 20v+12, and the fixture's ring has at least 4 points, so a row is at least 92 bytes. The policy is `BatchCutPolicy::SizeOnly` on `stream_with_cancel`. 5,000 × 92 and 20,000 × 92 clear the bounds as §2 states.
- **E3 (B3).** The row loop checks cancellation on every row (`produce`'s per-row check), the loop top checks it once per chunk, and `flush` checks it before its send. The only path to an Ok return that does not check cancellation after a send is the final end-of-stream flush. With at least 4 batches by size, the blocked third send cannot be that flush. The argument holds.
- **E2/E3 event waits.** These are the pre-existing `recv_timeout` calls at lines 206, 209, 275 and 278 of `kernel/tests/session_end_event.rs` at 0c94dcb0. They do not order anything. `EngineSource::end_session_if_source_changed` → `SessionInvalidator::end_generation` emits on the consumer thread before `next_into` returns the terminal, so the event is already queued when the wait starts.
- **No new sleep, synchronising timeout or timing assertion.** A scan of the diff for `sleep|timeout|Duration|.rs:<n>` matched only a hunk-header context line. No path:line cite was added into engine/src or kernel/src (§8 item 5). No pub item, constant, dependency, cfg or ignore was added. `fixture()` delegates with its old count (200 and 300) and the same spec.

## Evidence — none

- **§7 count**, by its own command `git diff --numstat 92884cc4 0c94dcb0 -- kernel/tests/typed_terminal_codes.rs kernel/tests/session_end_event.rs` (rc 0):
  - typed_terminal_codes.rs: 45+7 = 52, within the ceiling of 80 (Part A).
  - session_end_event.rs: 34+6 = 40, within the ceiling of 70 (Part B).
  - 2 non-generated files changed, within the ceiling of 4.
- **Hashes.** All 43 `path:line @ 3d740f7b sha256:` pins in the form match when recomputed (`git show 3d740f7b:<path> | sed -n 'a,bp' | sha256sum`). Amendment 1's hash also matches: line 6 of `state/directives/2026-10-07-round-65-rulings.md` at 92884cc4, the commit that adds it, gives 83a8126f41aaca3f660c2e92f102d138c83bc88860d6704e3db98dadf5b79f73. No mismatch.
- **M-2's message.** `state/consults/2026-10-05-main-ci-run-37264494821-attempt-1-failed-steps.txt:1270 @ 3d740f7b` carries the same expect message that M-2 produced (below), as §4 says.
- **Predictions.** P-1 and P-3 each gave 20 of 20 (below). The invalidator did not fire.

## Documentation — none open

- I agree with the architect's D-1, as the PR body carries it. Worker report 1 (`state/consults/2026-10-07-typed-terminal-codes-post-check-race-worker-report-1.md:29`, on main) says that no changed test has a timeout. E2 and E3 still have their unchanged `recv_timeout` event waits. The PR body's Timing line already supersedes that sentence. Nothing further is needed in this PR.

## Mutations (each applied by hand at 0c94dcb0, the named test run alone with `--exact`, held; no verify-mutation run)

| Row | Mutation | Test run alone | Failing assertion (this run's output) | Reverted |
|---|---|---|---|---|
| M-0 | kernel/src/lib.rs:684: `skp::terminal_detail_of(&e)` → `e.to_string()` | the_data_plane_terminal_a_real_redeemed_stream_produces_carries_its_typed_code | the prefix assertion: panic at line 181 of kernel/tests/typed_terminal_codes.rs at 0c94dcb0; the detail opened "refused: the source file changed …" with no code prefix | yes (`git checkout -- kernel/src/lib.rs`) |
| M-1 | the test's `5_000` → `200` | same | the batch-count assertion: panic at line 175 of that file at 0c94dcb0, "the ordering argument needs more than MAX_QUEUED_BATCHES batches; got 1" | yes |
| M-2 (observation, not a test of record) | `touch_modification_time(&path)` moved to after the drain loop | same | the terminal expect: panic at line 180 of that file at 0c94dcb0, "a changed source terminates this stream with a typed refusal" | yes |
| M-B2 | E2's `5_000` → `300` | a_post_check_end_on_a_clean_terminal_emits_once | the batch-count assertion: panic at line 199 of kernel/tests/session_end_event.rs at 0c94dcb0, "…; got 1" | yes |
| M-B3 | E3's `cancel.cancel()` moved to after the drain loop | a_post_check_end_on_an_error_terminal_emits_once | the "cancellation keeps its own terminal" assertion: panic at line 270 of that file at 0c94dcb0; the terminal was engine.source_changed: refused: … | yes |

After the reverts, the porcelain was empty. Both test files were re-run at the clean head and passed.

## Commands (cwd C:/dev/wt/ttc-rev; every cargo command had CARGO_TARGET_DIR=D:/wt-targets/ttc, and every held one also had CARGO_BUILD_JOBS=8 and RUST_TEST_THREADS=8)

Each held call ran in the paragraph's one-call shape: `<M> hold shared -Project SpatialIDE …` && the command ; rc=$? ; `<M> release` ; exit $rc. `<M>` is the custodian-given script. Every hold was granted (MACHINE_HOLD shared), and no exit code from 96 to 99 occurred.

| Command | Held | Exit | Result |
|---|---|---|---|
| git fetch; git diff --stat / --name-only / --numstat (three-dot and B H) | no | 0 | 2 files, 52 + 40 |
| hash recompute over the form's 43 pins, plus Amendment 1's line-6 hash | no | 0 | 44/44 OK |
| `cargo test --locked -p spatial-kernel --test typed_terminal_codes` | yes | 0 | 7 passed |
| `cargo test --locked -p spatial-kernel --test session_end_event` | yes | 0 | 7 passed |
| P-1: `node scripts/evidence/repeat.mjs 20 -- cargo test --locked -p spatial-kernel --test typed_terminal_codes` | yes | 0 | summary runs=20 failed=0 |
| P-3: `node scripts/evidence/repeat.mjs 20 -- cargo test --locked -p spatial-kernel --test session_end_event` | yes | 0 | summary runs=20 failed=0 |
| M-0, M-1, M-2: `cargo test --locked -p spatial-kernel --test typed_terminal_codes -- --exact the_data_plane_terminal_a_real_redeemed_stream_produces_carries_its_typed_code` (three calls) | yes | 101 each | failed as tabled |
| M-B2: `… --test session_end_event -- --exact a_post_check_end_on_a_clean_terminal_emits_once` | yes | 101 | failed as tabled |
| M-B3: `… --test session_end_event -- --exact a_post_check_end_on_an_error_terminal_emits_once` | yes | 101 | failed as tabled |
| `cargo test --locked -p spatial-kernel --test typed_terminal_codes --test session_end_event` (after the reverts) | yes | 0 | 7 + 7 passed |
| `cargo fmt --all --check` | no (lint) | 0 | clean |
| `node --test scripts/plan/*.test.mjs scripts/hooks/*.test.mjs scripts/evidence/*.test.mjs` | yes (background) | 0 | 450 pass, 0 fail |
| `node scripts/plan/verify.mjs` | no | 0 | PASS |
| `node scripts/plan/queue.mjs --check` | no | 0 | current |
| `node scripts/plan/site.mjs --check` | no | 0 | current |
| `node scripts/plan/verify-cites.mjs` | no | 0 | PASS (34 loose advisories, all in older files, none in this branch's files) |
| `node scripts/plan/verify-quotes.mjs` | no | 0 | PASS (121 checked; pre-existing baselined and advisory entries only) |
| `node scripts/plan/verify-test-claims.mjs` | no | 0 | PASS (504 claims; withdrawn and superseded advisories in older files) |
| `gh pr checks 187` (final read, after `gh run watch 37669205505`, rc 0) | no | 0 | 16/16 pass, listed below |

Two earlier reads of `gh pr checks 187` exited 8 because a Windows job was still pending.

The CI logs show both ubuntu and Windows ran the three changed tests by name, and each reported ok. I read job 112954316023 (Windows) and job 112954316344 (ubuntu), both from run 37668508015. The second Windows job, in run 37669205505, passed in 18m36s.

## gh pr checks 187 (final, every line)

```
L1 portable correctness · cargo test --workspace (ubuntu-24.04)	pass	5m24s	https://github.com/christopherdonini/spatial-ide/actions/runs/37668508015/job/112954316344
L1 portable correctness · cargo test --workspace (ubuntu-24.04)	pass	4m52s	https://github.com/christopherdonini/spatial-ide/actions/runs/37669205505/job/112956256976
cargo fmt --check (workspace and src-tauri)	pass	14s	https://github.com/christopherdonini/spatial-ide/actions/runs/37668508496/job/112953875731
cargo fmt --check (workspace and src-tauri)	pass	14s	https://github.com/christopherdonini/spatial-ide/actions/runs/37669205677/job/112956257229
cargo test --workspace (windows-latest)	pass	18m45s	https://github.com/christopherdonini/spatial-ide/actions/runs/37668508015/job/112954316023
cargo test --workspace (windows-latest)	pass	18m36s	https://github.com/christopherdonini/spatial-ide/actions/runs/37669205505/job/112956256531
cfg boundary (PORTABILITY R2)	pass	7s	https://github.com/christopherdonini/spatial-ide/actions/runs/37668508092/job/112953874420
cfg boundary (PORTABILITY R2)	pass	9s	https://github.com/christopherdonini/spatial-ide/actions/runs/37669205428/job/112956255963
every commit is signed off	pass	9s	https://github.com/christopherdonini/spatial-ide/actions/runs/37669205543/job/112956256513
no profile path in the range	pass	9s	https://github.com/christopherdonini/spatial-ide/actions/runs/37669205580/job/112956256761
tauri build (NSIS, build-only, no signing) / tauri build (NSIS, build-only, no signing)	pass	3m39s	https://github.com/christopherdonini/spatial-ide/actions/runs/37668508409/job/112954267936
tauri build (NSIS, build-only, no signing) / tauri build (NSIS, build-only, no signing)	pass	3m24s	https://github.com/christopherdonini/spatial-ide/actions/runs/37669205917/job/112956257848
test · verify:plan · queue/site drift	pass	1m14s	https://github.com/christopherdonini/spatial-ide/actions/runs/37668508092/job/112953874238
test · verify:plan · queue/site drift	pass	1m34s	https://github.com/christopherdonini/spatial-ide/actions/runs/37669205428/job/112956255608
typecheck · build · vitest · cargo test	pass	5m48s	https://github.com/christopherdonini/spatial-ide/actions/runs/37668508409/job/112954267504
typecheck · build · vitest · cargo test	pass	5m46s	https://github.com/christopherdonini/spatial-ide/actions/runs/37669205917/job/112956257495
```

No timing-sensitive failure happened in any shared run.
