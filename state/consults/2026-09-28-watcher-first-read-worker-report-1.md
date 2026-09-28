*Custodian's filing note (2026-09-28): the hand-back report of the high-effort worker that implemented PLAN node `watcher-first-read-on-watch-thread` (wave-2 C-1), transcribed from the hand-back message with the harness's two-space indent removed. The text below the rule is the agent's. The worker stopped on the size bound with nothing committed. The custodian then normalised `engine/src/watch.rs` from CRLF to LF (the worker's edit had rewritten all 765 lines as CRLF; `.gitattributes` normalises to LF), re-ran the two new tests and `source_watch_windows` (all passed), and committed the work at 0f68413. The class-6 amendment followed at 0c7be38, and the piece takes full gating. Profile paths redacted at filing (0).*

---

STOP — implementation complete and verified, but the diff exceeds the preregistration's size bound. Nothing committed, nothing pushed, no unpushed commits exist.

WHAT WAS BUILT (uncommitted, in C:/dev/wt/watcher-first-read)
- engine/src/watch.rs: each handle's watch thread now issues its own first `ReadDirectoryChangesW` (new `SendableHandle` Send wrapper + `watch_thread` calling `issue_read` as its first action), reports the outcome once over a one-shot `mpsc` handshake; `arm()` spawns P's thread and waits on `await_first_read` before doing anything else, then (only if P succeeded) opens G and does the same, via a shared `spawn_watch_thread` helper (used by both P and G, closes the handle and disarms/joins P via `SourceWatch::drop` on any G failure). Every existing `ChecksOnly` reason text is byte-unchanged; §2a's mapping table (engine/SOURCE-WATCHER-PREREGISTRATION.md) was not touched.
- kernel/tests/watcher_first_read_windows.rs (new, `#![cfg(windows)]`): regression test (1) — arms through `SkpHost::open_dataset` from a spawned thread that exits, asserts no `dataset_session_ended` within 5s and `viewport_query` is admitted.
- engine/src/watch.rs test module: unit test (2) — `an_invalid_handle_reports_its_issuing_error_through_the_handshake`, calling `watch_thread`/`await_first_read` directly with a null handle.

TEST (1) FAILURE BEFORE THE FIX (required proof)
Reverted watch.rs to HEAD (0d2576c, pre-fix), ran `cargo test -p spatial-kernel --test watcher_first_read_windows`: FAILED — panic "a healthy session must not end just because its opener thread exited: Ok(DatasetSessionEnded { session: ..., reason: CoverageLost })", i.e. it reproduced wave-2 C-1 exactly. Restored the fix; test then passed (`test result: ok. 1 passed`).

MUTATIONS (applied, run, observed failure by name, reverted)
- Test (1)'s declared mutation (first read issued on the arming thread again) = the pre-fix code itself; observed failure above.
- Test (2): in `watch_thread`, sent `ready.send(Ok(()))` unconditionally before `issue_read`. `cargo test -p spatial-engine --lib watch::windows_watch::tests::an_invalid_handle` → FAILED by name (`an_invalid_handle_reports_its_issuing_error_through_the_handshake`, "an invalid handle must fail to issue its first read"). Reverted; diffed byte-identical to the pre-mutation file afterward.
Both tests carry `RECORDED MUTATION:` doc comments per convention. `an_unlistable_directory_arms_checks_only_with_its_reason` (engine/tests/source_watch_adapter.rs) untouched, still green.

TEST COMMANDS / RESULTS
- `cargo test -p spatial-engine` → exit 0, all suites ok (incl. source_watch_adapter, watch:: unit tests).
- `cargo test -p spatial-kernel` → exit 0, every suite `ok`, incl. source_watch_windows (3 passed), session_end_event, session_generation, session_reference, watcher_first_read_windows (1 passed).
- `cargo test --workspace` → exit 0, 81 suites, 0 failed.
- `cargo clippy -p spatial-engine -p spatial-kernel --all-targets` → clean on both touched files (added `#[allow(clippy::too_many_arguments)]` on `watch_thread`/`spawn_watch_thread`, both now at 8 params); other warnings are pre-existing, in files I did not touch.
- `rustfmt --check --edition 2021` on both touched files: compared hunk-for-hunk against the base file (line-shift-adjusted); every remaining hunk in watch.rs is byte-identical pre-existing drift in code I did not edit; the new kernel test file is fully rustfmt-clean (0 hunks).

SIZE — WHY I STOPPED
`git diff --numstat 191ecbd(merge-base of origin/main) -- engine/src/watch.rs kernel/tests/watcher_first_read_windows.rs`:
- engine/src/watch.rs: 185 insertions, 131 deletions
- kernel/tests/watcher_first_read_windows.rs: 100 insertions, 0 deletions
Total 416 lines over 2 files, vs. the form's ≤150-line bound (Scope line, engine/WATCHER-FIRST-READ-PREREGISTRATION.md:7). I made two real trimming passes (comment compression, then de-duplicating P/G's spawn+handshake logic into one shared `spawn_watch_thread` helper used by both) — this only moved the total from ~395 to ~416→ eventually 285(watch.rs)+87(test, pre-format-fix) before the final rustfmt-driven reformatting added a few lines back. The floor is structural: correctly implementing "P's thread must be disarmed and joined if G's first read fails" requires spawning P's thread (with its own handshake channel, Send wrapper, spawn-error handling) *before* G is even opened — this reorders roughly 90 lines of the original step-6 spawn logic into steps 4/5, and git's line-level diff counts that reorder as full delete+insert rather than a move. I did not trim tests to fit, and did not edit the form.

NOT DONE / STOP
Did not commit, did not push. The 3-files/≤150-lines bound (2 files, 416 lines) is exceeded; per the brief I stopped rather than trim tests or edit the form. The custodian should decide whether to grant a size exception, split the piece, or accept a design that would need a genuinely different (and I believe less safe/clear) structural approach to shrink further.

STATE LEFT (git status --porcelain, in C:/dev/wt/watcher-first-read, branch cut/watcher-first-read, still at 0d2576c)
 M engine/src/watch.rs
?? kernel/tests/watcher_first_read_windows.rs
No commits made. No process left running (verified via tasklist).

PRE-GATE SELF-CHECK
- Cross-module use: kernel/tests/watcher_first_read_windows.rs calls `SkpHost::open_dataset`/`viewport_query`/`session_end_channel` exactly as kernel/tests/source_watch_windows.rs already does against the real kernel/engine shapes — no imagined interface.
- No completion claim made (I stopped); every test-pass/fail claim above is backed by the command output shown.
- No new user-facing message text; every `ChecksOnly` reason string is byte-identical to the original.
- Both new tests reach their intended assertion (not just setup) under both fix-applied and fix-reverted/mutated conditions, as shown.
- Model: Sonnet 5 (claude-sonnet-5), no override. No context handoff received or produced.
