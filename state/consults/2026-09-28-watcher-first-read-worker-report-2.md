*Custodian's filing note (2026-09-28): the hand-back report of the high-effort worker that ran correction round 1 for PLAN node `watcher-first-read-on-watch-thread` (wave-2 C-1) after gate 1 (the architect's B1 and the reviewer's should-fixes), transcribed from the hand-back message with the harness's two-space indent removed. The text below the rule is the agent's. The form's Amendment 2 (the class-4 and class-6 lines, at c7f1afb on the branch) cites this report as the observation record. Gate 2 re-observes the mutations. Four branch-only line cites in the observations are rewritten from the path:line:column form to `line N, column M of <path>` (the lines exist only on the branch), so that main's verify-cites does not read them as rooted references; nothing else in the agent's text is changed. Profile paths redacted at filing (0).*

---

Correction round 1 for `watcher-first-read-on-watch-thread` (wave-2 C-1) done.

COMMIT: ad2e692 (pushed; origin/cut/watcher-first-read == ad2e692, worktree clean at that commit).

Fixes applied (engine/src/watch.rs, kernel/tests/watcher_first_read_windows.rs only):
1. Architect B1 / reviewer N2: test (2) now drives `spawn_watch_thread(null_mut(), ..)` directly (not a hand-assembled `watch_thread`+`await_first_read` pair). It asserts `Err(reason)` whose text contains "could not arm the parent directory watch". RECORDED MUTATION doc comment names both (a) the declared thread-side mutation and (b) `spawn_watch_thread` returning `Ok` without consulting the handshake.
2. Reviewer S1: `await_first_read` maps `RecvError` to `Err(..)` (new fallback string, previously-unreachable path) instead of `.expect`; the existing join-and-close path runs.
3. Reviewer S2: test (1) adds a positive control — `describe(..).coverage.state == CoverageState::Watching` right after open, matching `kernel/tests/source_watch_ordering.rs:237`'s pattern. RECORDED MUTATION doc comment gains the vacuity mutation (every watch thread sends `Err` and returns) and its expected failure.
4. Reviewer S3: `unsafe impl Send for PendingRead` removed; its struct doc and `Drop` doc rewritten to state PendingRead is created/dropped only on its own watch thread and never crosses a boundary. `SendableHandle` and `Handle` each get their own SAFETY reasoning (no more cross-reference to the removed `PendingRead` impl — `Handle`'s was also referencing it, so I gave it independent reasoning too since leaving a dangling "see above" pointing at deleted code seemed worse than a 3-line fix in the same spot; flagging this as a small addition beyond the literal 6 items, still inside the two named files).
5. Architect N2: added a comment before arm's Step 4 explaining §2a's Arming items 4-6 are superseded by this piece's Change line, and that "Step 4"/"Step 5" number this function's own order, not §2a's. `engine/SOURCE-WATCHER-PREREGISTRATION.md` untouched.
6. Reviewer N1: SAFETY comments added to both new `unsafe { CloseHandle(..) }` blocks in `spawn_watch_thread`. Reviewer N3: `drop(ready)` added right after each of `watch_thread`'s two sends.

No reason text changed except the one new RecvError fallback string; §2a's mapping table untouched; no new dependency.

MUTATION OBSERVATIONS (all applied/reverted at ad2e692, `git status` clean after each):
(i) Mutation (a), declared thread-side (send `Ok(())` unconditionally before `issue_read`): `cargo test -p spatial-engine --lib watch::windows_watch::tests::an_invalid_handle_reports_its_issuing_error_through_the_handshake` FAILED — panic "an invalid handle must fail to issue its first read" at line 772, column 26 of engine/src/watch.rs, observed at ad2e692 with the mutation applied.
(ii) Mutation (b), `spawn_watch_thread` returns `Ok` regardless of `await_first_read`: same test FAILED — same panic message, at line 766, column 26 of engine/src/watch.rs, observed at ad2e692 with the mutation applied.
(iii) Vacuity mutation (`watch_thread` unconditionally sends `Err` and returns before `issue_read`): `cargo test -p spatial-kernel --test watcher_first_read_windows` FAILED — `the_opener_threads_exit_does_not_end_a_healthy_session` panicked at line 95, column 5 of kernel/tests/watcher_first_read_windows.rs, `assertion left == right failed: the watch must actually be armed: SourceCoverage { state: ChecksOnly, reason: Some("... vacuity mutation: every arm becomes ChecksOnly") }`, observed at ad2e692 with the mutation applied.
(iv) origin/main's pre-fix `engine/src/watch.rs` checked out over the fixed test files: same test FAILED — panicked at line 103, column 5 of kernel/tests/watcher_first_read_windows.rs, `a healthy session must not end just because its opener thread exited: Ok(DatasetSessionEnded { session: SessionRef(..), reason: CoverageLost })`, observed with origin/main's watch.rs at this branch's other files. Restored with `git checkout HEAD -- engine/src/watch.rs` (note: `git checkout -- <path>` alone did not revert it, because the prior `git checkout origin/main -- <path>` had updated the index too, not just the tree — `HEAD` was needed explicitly).

SUITE COUNTS (all exit 0, no FAILED, at ad2e692):
- `cargo test -p spatial-engine`: engine lib 168 passed/0 failed (includes both watch::windows_watch::tests); integration suites (source_watch_adapter 13, spatial_index 10, and others) all ok, 0 failed.
- `cargo test -p spatial-kernel`: every suite shown "ok", `watcher_first_read_windows` 1 passed, `source_watch_windows` 3, `session_end_event` (K-series) 14, plus others; the harness's captured output file only retains a rolling tail so I don't have a grand total, but exit code 0 and no FAILED/panicked anywhere in the captured tail.
- `cargo test --workspace`: exit 0, no FAILED anywhere in the (tail-truncated) captured output, ends clean through spatial_skp doc-tests.

HYGIENE:
- `cargo clippy -p spatial-engine -p spatial-kernel --all-targets`: exit 0, 2 pre-existing warnings total (both in other kernel test files — `regenerate_fixture`, `import_layout_factorial`), none in watch.rs or watcher_first_read_windows.rs.
- `rustfmt --check --edition 2021` on both files: kernel test file clean (0 hunks). watch.rs has the same 8 pre-existing-drift hunks as the reviewer found at 0c7be38 (7 byte-identical to origin/main's hunks at 91/140/177/186/373-was-354/397-was-378/591-was-483; the 8th, 264-was-268, is the same trailing-context-shifted `Ok(PendingRead{..})` hunk the reviewer already named). No new hunk introduced by this round's edits.
- Line endings: `git ls-files --eol` on both files: `w/lf` (checked before commit and again at HEAD after all reverts).

SIZE: `git diff --numstat origin/main...HEAD`, form excluded: engine/src/watch.rs 220+145, kernel/tests/watcher_first_read_windows.rs 121+0 → 365 + 121 = 486 lines across 2 files (up from the Amendment's recorded 416; I did not touch the Amendment or the form — that's the custodian's to update).

NOTICED, NOT DONE: two harmless leftover comparison files (`/tmp_branch_hunks.txt`, `/tmp_base_hunks.txt`) from my own rustfmt-hunk diffing sit outside any repo (Git Bash root, owner Christopher's home), not inside the worktree or main checkout — an `rm` on them was blocked by the sandbox's dangerous-path check (single-segment path under `/`), so they're still there; they contain no secrets, just rustfmt diff text, safe to delete by hand if wanted.

STATE LEFT: `git status --porcelain` at C:/dev/wt/watcher-first-read is empty; HEAD ad2e692 == origin/cut/watcher-first-read; no cargo/test process left running (checked via tasklist). No PR opened, no state/PLAN.yaml/preregistration files touched.
