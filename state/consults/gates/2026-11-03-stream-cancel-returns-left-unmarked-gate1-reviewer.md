Reviewed: PR #277 at 48600edc42d3d5caf585153b583cd556e7515651 (base 7b311b11), gate 1, reviewer
cut/stream-cancel-returns-left-unmarked @ 48600edc42d3d5caf585153b583cd556e7515651
Verdict: PASS WITH NOTES

## Findings by class

**Correctness:** none.

**Evidence:** none blocking.

**Documentation:** none. I propose no replacement words.

**Note (operational, not a class finding, does not block):** `gh pr checks 277` still lists one failed check: `test · verify:plan · queue/site drift` in the push-event run 41638434792 at 48600edc. Its log shows the failure is GitHub's API, not this piece. `node scripts/plan/verify.mjs` reported "verify:plan FAIL — 2 issue(s)", both of the form "PR #108 is not merged (Command failed: gh api …/pulls/108 / gh: HTTP 502)" and "PR #161 … gh: HTTP 503". The same job passed in the pull_request run 41645887641 at the same sha. Fix: re-run 41638434792 before the merge so the check list reads green.

## Check 1: the diff, against the five lines and the notes

Commands: `git diff 7b311b11...HEAD` (rc 0) and `git diff c63e5daf 48600edc -- engine/src/stream.rs` (rc 0), both in the worktree. Line numbers below are at the head.
- **`classify`** (engine/src/stream.rs:2634-2643): it marks `crate::trace::mark(crate::trace::PRODUCER_CANCELLED, 0, 0)` inside its single `if cancel.is_cancelled()`, before `EngineError::Cancelled`. Its doc (2628-2633) says so, and says every call is followed at once by a return out of `produce`.
- **Product callers.** A Grep of `classify\(|classify_fetch_panic\(` over engine/src finds three: :1803 (prepare, `?`), :1854 (`return Err(classify(…))`) and :1927 (`return Err(classify_fetch_panic(…))`). `classify_fetch_panic` (:2650-2656) only delegates. So the at-most-once stamp holds by reading.
- **The two outer reads** are removed: the execute-`Err` arm (:1850-1855) and the fetch-panic arm (:1922-1927). Each return is byte-unchanged, and each has a shorter comment.
- **The prepare site** gains its 2-line comment (:1799-1800). The `prepare` call is unchanged.
- **The pre-prepare check** (:1794-1797): its mark and return are unchanged.
- **Unchanged parts.** The send to a gone receiver (`.map_err(|_| EngineError::Cancelled)`, :2579), flush's check and error arm, the loop-top check and the per-row check are all unchanged. `engine/src/trace.rs` and `engine/src/cancel.rs` are not in the diff, so they are byte-unchanged.
- **Nothing new.** The diff adds no `pub` item, no `cfg(test)` hook, no seam and no string a user sees. The `classify` messages and `OUT_OF_RANGE_DETAIL` are untouched.
- **Existing tests.** In existing tests the only removed lines are T-2's 4 old doc lines. No assertion line is removed or changed.
- **The locks.** `TEST_LOCK` is the first statement of `only_duckdbs_out_of_range_class_is_read_as_an_evaluation_failure` (:2737-2739) and of `the_fetch_panic_is_read_as_out_of_range_only_by_its_fixed_prefixes_at_the_start` (:2800-2802). This is OPEN-4 (a).
- **T-2** has only its doc revised (:3225-3233), plus a `RECORDED MUTATION:` line naming c63e5daf. Its body is unchanged. This is OPEN-3 (a).
- **Commit 3** changes stream.rs only in comment lines: the two `RECORDED MUTATION:` paragraphs, 8 inserted lines. So the mutation commit c63e5daf is code-identical to the head.
- **engine/README.md**:
  - the Producer trace row gains T-3;
  - the preregistration list gains `governance/forms/engine/ENGINE-CANCEL-BEFORE-EXECUTE-SIBLINGS-PREREGISTRATION.md` and this form, both in alphabetical place (OPEN-5 (a));
  - the Last verified line gains two segments.
  Both forms exist at 7b311b11 (`git cat-file -e`, rc 0 each).
- **The form** is unchanged since base: sha256 4252d2f6… at 7b311b11 and on main.
- **Size:** `git diff --numstat origin/main...HEAD -- engine/src/stream.rs engine/README.md` (rc 0; origin/main = 6dff90e9) gives 91 and 29 for stream.rs and 3 and 3 for README.md. That is 126 changed lines against 150, over 2 files.
- **Main drift:** `git diff --stat 7b311b11 6dff90e9 -- engine kernel` is empty (rc 0).

## Check 2: the head, in the worktree, target D:/wt-targets/scrlu, each in a shared hold

- **`cargo test -p spatial-engine --locked`: rc 0.**
  - 51 `test result: ok` lines out of 51, and no FAILED or panicked line.
  - The lib line is `ok. 209 passed; 0 failed`.
  - These pass, each `... ok`:
    - `classify_stamps_producer_cancelled_when_it_returns_cancelled`
    - `the_pre_prepare_cancel_exit_stamps_producer_cancelled`
    - `only_duckdbs_out_of_range_class_is_read_as_an_evaluation_failure`
    - `the_fetch_panic_is_read_as_out_of_range_only_by_its_fixed_prefixes_at_the_start`
    - `flush_cancel_exit_stamps_producer_cancelled_and_sends_nothing`
- **`cargo test -p spatial-kernel --locked --test trace_spans --test skp_admission --test skp_filter_cancellation`: rc 0.**
  - skp_admission: `ok. 10 passed`.
  - skp_filter_cancellation: `ok. 1 passed`, 47.16 s.
  - trace_spans: `ok. 6 passed`, 139.66 s.
  - No timing-sensitive failure appeared.
- **`cargo fmt --all -- --check`: rc 0.** Output is empty (0 bytes).
- **`cargo clippy -p spatial-engine --locked --tests --no-deps`: rc 0.** In stream.rs it warns at 2346, 2350, 2462 and 3807. None of these is in a changed hunk; the changed hunks at the head are 1799-1800, 1851-1853, 1922-1926, 2628-2636, 2737-2739, 2800-2802, 3225-3233 and 3276-3334.

## Check 3: mutations on an export

- **The export.** `git archive c63e5daf` (rc 0), then `tar --force-local -xf` into D:/wt-targets/scrlu-g1r-export (rc 0).
  - Its stream.rs sha256 is 22ea659f452e7affe2aba2490a12a156a9bc85ae8b644d95b102656be8e04fd9, equal to `git show c63e5daf:engine/src/stream.rs | sha256sum`.
  - Its .cargo/config.toml sha256 is 6889110645ec…, the one the worker report names.
- **The build.** CARGO_TARGET_DIR=D:/wt-targets/scrlu-g1r-target, cold. The DuckDB build ran in M-3's hold: `Finished … in 10m 58s`.
- **M-3** deletes line 2636 of c63e5daf, the mark in `classify`; that is the only diff line. The mutated file's sha256 is e779ce69….
  - `cargo test -p spatial-engine --locked --lib classify_stamps_producer_cancelled_when_it_returns_cancelled` gave rc 101.
  - The test reported `... FAILED`, panicked at `engine\src\stream.rs:3298:9` with `(i) classify must stamp producer_cancelled when it returns Cancelled`. That is (i)'s presence assertion.
  - Restored: sha256 22ea659f… again.
- **M-2** deletes line 1795, the pre-prepare check's mark, with its `return` kept; that is the only diff line. The mutated file's sha256 is 061c02f4….
  - `cargo test -p spatial-engine --locked --lib the_pre_prepare_cancel_exit_stamps_producer_cancelled` gave rc 101.
  - The test reported `... FAILED`, panicked at `engine\src\stream.rs:3261:9` with `the pre-prepare cancel exit must stamp producer_cancelled`. That is its presence assertion; the earlier `Cancelled` and `batches_generated == 0` assertions passed.
  - Restored: sha256 22ea659f… again.
- **Agreement with the record.** Both match the worker report and the `RECORDED MUTATION:` lines: the same tests, assertions, messages and line numbers. Both runs were applications of the mutation, not `verify-mutation` runs.

## Check 4: the tests' soundness

- **T-3 reaches the mark with no product seam.** It calls the private `classify` and `classify_fetch_panic` directly from `mod tests`, with a token cancelled before the call.
- **What can stamp in this crate.** A Grep of `PRODUCER_CANCELLED` over engine/src (Grep tool, no exit code) finds stamping sites only in stream.rs: 1795, 1847, 1899, 1992, 2549 and 2636. trace.rs only defines it (:441) and documents it (:383).
- **Every test that can stamp it takes `TEST_LOCK` first:** :2737, :2800, :3164, :3236 and :3292.
- **Other in-crate `.cancel()` calls** are in cancel.rs, index.rs and pin.rs tests. They reach no `PRODUCER_CANCELLED` site; `cancel()` stamps only `CANCELLATION_REQUESTED` (cancel.rs:135).
- **So the presence assertions are unambiguous under the lock, as item 5 argues.** T-3's doc sentence that other tests "stamp other names into a live trace" is true: `CANCELLATION_REQUESTED` comes from cancel.rs:135.
- **Determinism.** Every new or changed test is in-memory, with no sleep, retry, timeout or fixture.
- **Other consumers.** kernel/tests/trace_spans.rs:356 asserts absence only on a completed run, and it passed. first_batch_factorial reads the stamp only through `segment_ms`.

## Check 5: verify scripts and CI

The verify scripts ran in the worktree at the head:
- `node scripts/plan/verify.mjs --offline`: rc 0, `verify:plan PASS`.
- `node scripts/plan/verify-cites.mjs`: rc 0. `PASS — every rooted (in-tree) path:line reference across 2572 file(s) resolves. (82 loose reference(s) advised above.)`
- `node scripts/plan/verify-quotes.mjs` (under `timeout 1500`, in the background): rc 0. `verify:quotes PASS — 134 checked, 103 verified, 30 baselined, 1 advisory, 0 baseline entry errors, 0 hash-reference errors (2 hash-baselined), 0 hash-baseline entry errors, 909 ruling cites resolved, 0 ruling-cite errors.`
- `node scripts/plan/verify-test-claims.mjs`: rc 0. `verify:test-claims PASS — all 713 claimed test(s) across 226 file(s) exist or are planned, superseded or withdrawn`

CI:
- **`gh pr checks 277`: rc 1**, from the one failed push-run check described in the Note above.
- **Every run's head sha is 48600edc42d3d5caf585153b583cd556e7515651** (`gh run view`, rc 0 each).
- **Product CI pull_request run 41645887649** was in progress at first look and later completed success, both jobs. Its log: T-3 `... ok` on windows-latest and on ubuntu-24.04, and 0 `test result: FAILED`.
- **Product CI push run 41638434736** succeeded. Its log shows `... ok` on both OS entries for T-3, T-2, the two lock-only tests and the flush test. The kernel binaries ran on both.
- **The "before" side.** No Product CI ran at base 7b311b11 (docs-only commit). The latest main Product CI, 41625319748 at 8d933d26, succeeded. 8d933d26 is an ancestor of 7b311b11, and nothing changed between them under engine, kernel, protocol, Cargo.* or .github.

## Hold lines (my project's, `also=` elided)

All holds were shared, none was refused, and there was no exit code from 96 to 99. Each was followed by its `MACHINE_RELEASED project=SpatialIDE shell=… affinity=FF (cores 0-7)`.
- `MACHINE_HOLD shared project=SpatialIDE cores=0-7 affinity=FF shell=bash.exe:59512` (engine tests, cmdrc=0)
- `… shell=bash.exe:58576` (kernel tests, cmdrc=0)
- `… shell=bash.exe:53120` (clippy, cmdrc=0)
- `… shell=bash.exe:75436` (fmt, cmdrc=0)
- `… shell=bash.exe:49404` (M-3, cmdrc=101)
- `… shell=bash.exe:43548` (M-2, cmdrc=101)

## Background shells and cleanup

- **Background tasks.** Every background task I started has completed: the six holds, verify-quotes and four bounded wait loops. Two of the loops were foreground calls the tool moved to the background; all four ended by completion or at their deadlines. I killed nothing.
- **Processes I did not start.** Two `node scripts/plan/verify-quotes.mjs` processes are running (PIDs 61292 and 55392). They started at about 14:22Z and 14:29Z, after my own verify-quotes run had finished with rc 0, so they are not mine and I did not touch them.
- **Clean state.** The worktree's `git status --porcelain` is empty (0 bytes, rc 0), and HEAD is 48600edc. `ls` shows that D:/wt-targets/scrlu-g1r-export and D:/wt-targets/scrlu-g1r-target are gone. The scratch tar was removed. I wrote nothing outside the scratch folder, the export and the two targets.
