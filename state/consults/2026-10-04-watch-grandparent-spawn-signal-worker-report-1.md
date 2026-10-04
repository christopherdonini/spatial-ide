*Custodian's filing note (2026-10-04): watch-grandparent-spawn-signal worker report 1, under the tag node:watch-grandparent-spawn-signal@g1. A worker-high built the fix to `kernel/WATCH-GRANDPARENT-SPAWN-SIGNAL-PREREGISTRATION.md` in the worktree `C:/dev/wt/wgss`. It arrived as a message, and is extracted here by script from the SubagentHandback call in the subagent's own transcript, with nothing changed. The run lasted 15:01:50Z to 16:07:41Z, with Read 8, Bash 32, Edit 4 and Write 2, plus the hand-back. Its Edits touched the four code and test files in the worktree. Its Writes were two commit messages, to the session scratchpad. The custodian read the diff origin/main...f0e89280: 5 files, 97 insertions and 4 deletions; the README line counts outside §7. The fix and the tests match the form's §2 and §4. The RECORDED MUTATION docs follow the file's existing Expected-failure convention, and the observation commit is in this report. After the run, no cargo, rustc or test process was found running. Not a ruling.*

---
REPORT node:watch-grandparent-spawn-signal@g1 (worker, observed as Sonnet 5.5, claude-sonnet-5-5; no override, no context handoff)

COMMITS (pushed; head = origin head):
- f25aef60cf1a7e66d1215848d9db2c4fff0739ed fix(kernel): code (2a, 2b, 2c, GS1, GS2)
- f0e892806b0ab1ba28171a50c76afe25254fc148 docs(kernel): Owner's index (pushed head)
- Trailer: both commits carry `Co-Authored-By: Claude Sonnet 5.5`, as your correction asked. None carries the old Opus trailer, because both were made after your correction reached me.
- No PR opened, no amend/rebase/force.

P-1 (base 4c91a76e3edfb5a9e6621feb6b05e5580bff6641, clean porcelain before start):
- Applied only 2c and GS1/GS2, uncommitted. `git diff | sha256sum` = 95e5cea2af21d98c8435a11c7e8bc62fe2fc3e35b110e06f5621bbf4a488f348 (2 files, 77 insertions).
- GS1 and GS2 both FAILED at `expect_err` (the call is in the shared helper `a_checks_only_open_refuses_a_recorded_signal`, source_watch_ordering.rs line 396 in that uncommitted state). `open_dataset` returned `Ok(OpenDatasetResponse{..})`. H1 holds, so I1 did not fire.
- Design note: GS1 and GS2 share one helper to save budget. Each has its own RECORDED MUTATION doc and `// Mutation: see` line.

P-2 at f25aef60:
- source_watch_ordering: 16 passed, 0 failed. This includes GS1, GS2, K6 and K8.
- `cargo test -p spatial-kernel` rc 0. Summed from the per-binary result lines: 323 passed, 0 failed, 28 ignored.
- `cargo test -p spatial-engine` rc 0. Summed: 383 passed, 0 failed, 12 ignored.
- Every cargo command used CARGO_TARGET_DIR=D:/wt-targets/wgss. No cargo or test process of mine is left (tasklist checked).

MUTATIONS, each applied, run, reverted via `git checkout`, observed at f25aef60 (not via verify-mutation):
- GS1 mutation: `skp.rs` set to the 4c91a76e body, so the ChecksOnly arm admits without the latch read. GS1 FAILED at `expect_err` with `Ok(OpenDatasetResponse ..)`. GS2 failed the same way.
- GS2 mutation: the ChecksOnly refusal maps every signal to `EngineError::SourceChanged`. GS2 FAILED: `left: "engine.source_changed"`, `right: "engine.source_coverage_lost"`, at source_watch_ordering.rs line 397. GS1 stayed green (1 passed, 1 failed).
- Tree clean after each revert.

OWNER'S INDEX (kernel/README.md, in f0e89280):
- Line 356 replaced with the architect draft's line (consult line 202, inside its fence at 199-205), byte-copied by script.
- Form appended to the line 373 preregistration list.
- Last-verified (line 350) set to f25aef60. The README commit cannot name itself, and f25aef60 is the last commit that changes any pointed-to code or test.
- All four named tests and the form file exist (grep count 1 each).

7 BUDGET: `git diff --numstat origin/main...HEAD` over the four code files = 3+1 (engine watch.rs), 14+0 (skp.rs), 6+0 (injected_watch/mod.rs), 71+0 (source_watch_ordering.rs) = 95 lines, 4 files. That is within 160 and 4, so there is no class-8 overrun.

PRE-GATE (all run at the final head, from the worktree root):
- verify-cites rc 0 (PASS; loose advisories only, none from my files).
- verify-quotes --show-cites on the five changed files rc 0 (PASS, 0 checked).
- verify-test-claims rc 0 (PASS, 492 claimed tests).
- `cargo fmt -p spatial-kernel -p spatial-engine --check` rc 0.
- New-`pub` grep over the diff of kernel/src and engine/src: no matches (expected none).

SEAM READ (all at base 4c91a76e):
- engine/src/watch.rs: ArmOutcome and SourceWatchArm at 52-67; sink calls in the watch thread at 330-357; SourceWatch::drop (cancel, join, close) at 484-511; spawn_watch_thread joining before Err at 540-599; windows arm at 601-713.
- kernel/src/skp.rs: `SkpHost::open_dataset` at 1098-1282, with the sink closure at 1126-1169, the Watching arm at 1187-1257 and the ChecksOnly arm at 1258-1276.
- I3 did not fire: every failure return joins P (and G) before returning ChecksOnly, so no sink call can follow it.
- I4 did not fire: the only product implementor is `PlatformWatch` (watch.rs:84). The others are `#[cfg(test)]` or tests/ implementors (skp.rs NoWatchArm, RacingCoverageLossArm, FlagArm; tests/injected_watch; tests/watch_support).
- I2 did not fire: no change to the Watching arm, the sink closure, a string, or a new pub item.

PRE-GATE FAILURE CLASSES:
1. Cross-module code uses the interface the other side actually exposes: yes. The tests drive a real `SkpHost::open_dataset` through a test implementor of the real `SourceWatchArm`, with the sink called inside `arm` and then ChecksOnly returned (the real ordering).
2. Every completion claim points to evidence that exists: P-1, P-2 and the mutation results above are real runs at the named commits. The README pointers were checked to exist.
3. Every user-facing message describes behaviour implemented at this commit: no string was added or changed. The refusal reuses the existing codes and detail strings.
4. Every required test reaches its intended assertion, not only its setup: GS1 and GS2 fail by name at expect_err (GS1) and at the code assertion (GS2) under their mutations. The catalog-empty, no-event and second-open ChecksOnly assertions run after those and pass at the fix.

`git status --porcelain` at the end: empty.

OFF-SCOPE NOTICED, NOT ACTED ON:
- The engine-test run took about 40 minutes wall-clock on a cold target. The first kernel build was 17m43s.
- Nothing else. No invalidator fired.
- Scratch files (commit messages and logs) are under the session scratchpad only.
