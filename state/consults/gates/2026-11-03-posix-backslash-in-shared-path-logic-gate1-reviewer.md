Reviewed: PR #279 at 9999ef4dc451211a96733548eac333b343f6d158 (base b900c712), gate 1, reviewer
Verdict: PASS

Branch and commit: cut/posix-backslash-in-shared-path-logic @ 9999ef4dc451211a96733548eac333b343f6d158. The brief was read whole first. Its sha256 is 2e9608ff946aa71a5953996218ea0ae07a037cdcf9fff45ca50a1619dd350d14 (38 lines), equal to the given value.

## Findings

**Correctness:** none.
**Evidence:** none.
**Documentation:** none that needs a fix before the merge.

Three things I saw that need no action (not findings):
- **The worker report's estimate is low.** The filed report says "About 25" of the lines are the RECORDED MUTATION doc lines. The real figure is 32: by `git show --numstat`, 1949a5ce adds 4+6 and 9999ef4d adds 14+8, all of them doc lines. The form's Amendment 1 gives the correct 32. The report is an append-only record, and Amendment 1 is where the size is stated, so there is nothing to correct.
- **Size against §36.** At 160 lines the piece is over §21c's 150, and §36 asks that a filler fit a five-line form under §21c's size. The form's Amendment 1 handles this under the human's direction of 2026-10-31 (its closing paragraph), and the human reviews it on return. That is the human's call, not this gate's. My numstat agrees with Amendment 1 exactly.
- **Shared temp root (robustness only).** The new test file's `fresh_dir` (kernel/tests/posix_backslash_in_shared_path_logic.rs:15-22 at the head) uses a fixed root under `std::env::temp_dir()`, as wave 3's original does. Inside one test binary it is safe: T2 and T3 use different subdirectories, and `create_dir_all` tolerates a race. Two processes running this binary at the same time on one machine could still remove each other's directory. This is not a defect under check 4, which concerns threads within one binary.

## Check 1: the diff, test bytes and size

**Diff** (`git diff b900c712...HEAD`, rc 0). Only three files changed (`git diff --name-only`, rc 0).

normalize.rs:
- `to_slashes` is private and built on `std::path::is_separator` (normalize.rs:151-156).
- Step 2 calls `to_slashes(&stripped)` (normalize.rs:82).
- `roots_from` is private and reads each root through `to_slashes` (normalize.rs:123-149, the read at :137).
- `roots_from_environment()`'s signature is unchanged; it delegates through `roots_from(|key| std::env::var(key).ok())` (normalize.rs:118-120). The old `if let Ok` and the new `.ok()` treat a non-UTF-8 variable the same way.
- Step 1's strip is unchanged (normalize.rs:72-79).

viewer_assets.rs:
- The walk's name maps only what `is_separator` names (viewer_assets.rs:135-139).
- `validate_relative_path` is outside the only hunk.

Absences:
- A grep of the added lines for `unsafe`, `#[cfg(` and `cfg!(` finds nothing (rc 1).
- Cargo.toml, kernel/Cargo.toml and Cargo.lock have a 0-byte diff, so no new dependency.
- Product code adds no string literal.

Callers and their consumers:
- The seven named caller files have a 0-byte `git diff b900c712 HEAD` (rc 0).
- `is_inside` (log.rs:390-401) runs on raw paths with its own rewrite, so it does not depend on the normalized string.
- The shell's `from_dir` caller is built only on Windows, where the output is unchanged.

Existing tests: only N5's list changed.
- `norm` gains the `MAIN_SEPARATOR_STR` line.
- Two `cfg_attr(not(windows), ignore=…)` attributes are added, in `mod tests` only.
- The non-ASCII test takes two forward-slash inputs.
- No assertion was removed.

The mutations' predictions follow from the code. M1 leaves the root `/home/x\b` and turns the destination into `/home/x/b/out`, so T1's assertion 2 fails. M2 rewrites the root to `/home/x/b`, so assertion 1 fails.

**T2 against A3-1(b).** I read `git show 8a2ba65f…:kernel/tests/wave3_a_portability_audit.rs` only (rc 0) and compared its lines 72-100 with the head's lines 24-60.
- The only differences are the doc comment and the ignore reason, which gains the `boundary: path syntax (std::path::is_separator); ` prefix.
- The body, from `#[test]` to the closing brace (source 79-100, head 39-60), is byte-identical: both hash to sha256 03931d586078b2c6e5a98d8586291db125bc2c043b430132bda7c2f53571efc7.
- `fresh_dir` differs only in its directory name.

**Size.** `git diff --numstat origin/main...HEAD` (rc 0) gives 66/7, 5/1 and 81/0, which is 160. That matches Amendment 1.

**Bytes.**
- All three files: no CR, no tab, and each ends in LF.
- The non-ASCII bytes in added lines, found by a node scan that self-tests positive and negative, are three, all intended: the `→` in the step-2 doc (the existing list style), and `José` in two existing non-ASCII test inputs.

## Check 2: the head, in the worktree on D:/wt-targets/pbsl

- `cargo test -p spatial-kernel --locked`: exit 0 (hold notification). It prints 47 result lines: 391 passed, 0 failed, 44 ignored. These pass by name: T3 (`a_nested_viewer_asset_is_named_with_forward_slashes_on_every_platform ... ok`), `a_user_profile_destination_becomes_a_token ... ok` and `a_unc_path_keeps_its_share_form ... ok`. T1 and T2 show as ignored with the path-syntax reason.
- `--lib -- --list --ignored`: lists T1 only (`1 test`).
- `--test posix_backslash_in_shared_path_logic -- --list --ignored`: lists T2 only. Both listing holds released cleanly.
- `cargo fmt --all -- --check`: rc 0, empty output. **Disclosure:** this ran outside a hold. It is a format check with no build, but the brief says every cargo call goes inside a hold.
- `cargo clippy -p spatial-kernel --locked --tests --no-deps`: rc 0. Its 33 warning lines are all in other files; grep for the three Scope files returns rc 1.
- `cfg-boundary.mjs`: head rc 0 and main (d01ff1c8) rc 0, both "18 sites in 6 files, 0 outside every boundary". The only diff between the two outputs is normalize.rs:186/190 → :200/204, the 14 lines added above.

## Check 3: mutations

**Export.** `git archive 9999ef4d` (rc 0), extracted with `tar --force-local` (rc 0) into D:/wt-targets/pbsl-g1r-export. `.cargo/config.toml` is byte-equal to the worktree's. The target D:/wt-targets/pbsl-g1r-target was new and cold; the cold build took 11m 34s.

**M4: the walk's mapping removed**, the bare `to_string_lossy()` followed by `.to_string()`, applied by a script containing no backslash. `cargo test … --test posix_backslash_in_shared_path_logic` exits 101. T3 fails by name, panicking at kernel\tests\posix_backslash_in_shared_path_logic.rs:78:47 with:
`a nested asset is admitted: ViewerAssetPathRejected { path: "assets\\app.js", detail: "contains a backslash; bundle paths use forward slashes only" }`
This is the predicted panic. The worker's 64:47 at 724cb1fb plus the 14 later doc lines gives 78. I restored the file from `git show 9999ef4d:` (rc 0); its sha256, 06675a26bf4fc153734299f46b93d97ff3e5bea8807496edecd33011822f7994, equals the hash taken before the mutation.

**M5: `to_slashes` maps only `/`.** `cargo test … --lib a_user_profile_destination_becomes_a_token` exits 101, at normalize.rs:244:9: `left: "C:\\Users\\someone\\out"`, `right: "<user-home>/out"`. This is as predicted. Restored file sha256: 95bd6f035974461fd4df352e3b890ae097f312069a93fd65bf39ab835ae1ccd8, equal to the before-hash.

**M1 to M3, from CI.**
- `git show --stat` shows each mutation commit as one file and its mutation alone:
  - a47d8f72: normalize.rs 1/1, step 2 back to `stripped.replace('\\', "/")`.
  - cd29f057: normalize.rs 1/1, `roots_from` back to `v.replace('\\', "/")`.
  - 2618f4b7: viewer_assets.rs 1/3, the walk back to `.replace('\\', "/")`.
- `git diff 1949a5ce d441774c -- kernel/`, `… 761ff213 …` and `… 33102721 …` are each 0 bytes (rc 0). The parent chain is linear.
- `gh run view --job <id> --log` succeeded for all jobs (rc 0):
  - Job 126209332158 (run 41719825618, head a47d8f72): T1 FAILED at normalize.rs:333:9, `left: "/home/x/b/out"`, `right: "<user-home>/out"`. Result: `FAILED. 162 passed; 1 failed; 3 ignored`. Every earlier binary reads ok.
  - Job 126219815352 (run 41722839219, head cd29f057): T1 FAILED at normalize.rs:331:9, `left: [("/home/x/b", "<user-home>")]`, `right: [("/home/x\\b", "<user-home>")]`. Result: 162 passed, 1 failed.
  - Job 126227537123 (run 41725054647, head 2618f4b7): T2 FAILED at posix_backslash_in_shared_path_logic.rs:47:13 with `the file `a\b.js` was admitted and renamed; the published paths are ["a/b.js", "index.html"]`; T3 ok. Result: `FAILED. 1 passed; 1 failed; 0 ignored`.
  - The Windows jobs of the same runs, 126209331619, 126219815874 and 126227537485, each conclude success with 0 FAILED lines.

D:/wt-targets/pbsl-g1r-export and D:/wt-targets/pbsl-g1r-target were removed (rm rc 0; `ls` confirms both are gone).

## Check 4: test soundness and the mutation records

**Tests.**
- T1 calls `roots_from` with its own closure, `(key == "HOME").then(…)`, and changes no environment.
- T2 and T3 each use their own `fresh_dir` subdirectory (`a3-1b`, `nested`), with no sleep, retry, timeout or shared state.
- On POSIX, T2 writes `dir.join("a\\b.js")`, a file whose name holds a backslash. The ubuntu job's M3 failure message shows that name was walked.

**Records.**
- The M4 and M5 records name their mutation and `724cb1fb…` "on Windows".
- The M1, M2 and M3 records each name the commit, the run, the ubuntu-24.04 job and the revert commit. All of these match `git log` and `gh`.
- The pass/fail counts match the CI result lines.
- Each record says "no test that ran before it failed", never "no other test".
- No record names a runner's machine; "ubuntu-24.04" is the job label.
- T3's "On POSIX that mutation changes nothing, as declared" states a property of the code, not a run. It holds because `is_separator` is `/` alone on unix, so the mapping is the identity there.

## Check 5: verify scripts and CI

Verify scripts at the head:
- `verify.mjs --offline`: rc 0, PASS.
- `verify-cites.mjs`: rc 0, PASS.
- `verify-quotes.mjs`: rc 0, PASS (135 checked, 0 errors).
- `verify-test-claims.mjs`: rc 0, PASS (729 claims).

CI:
- `gh pr checks 279` returned rc 8 on the first call, with a second set of runs still pending. I waited for Rust run 41733970454 by a loop that slept 30 s per turn with a 540 s deadline. The re-run then returned rc 0 with 18 pass.
- `gh run list` and `gh run view` give head 9999ef4dc451211a96733548eac333b343f6d158 for every run of both sets: 41728423442, 41733970454, 41733970338, 41728423549, 41728423349, 41733970264, 41728423298, 41733970351, 41728423246, 41733970595, 41733970152 and 41733970092.
- Rust workspace, both runs (job logs read, 0 FAILED lines each):
  - ubuntu-24.04 (126239156059, 126258240119): T1, T2 and T3 `... ok`. The two Windows-syntax tests are ignored with their path-syntax reasons and listed under `--list --ignored`.
  - windows-latest (126239155300, 126258239592): T3 ok. T1 and T2 are ignored with the reason "boundary: path syntax (std::path::is_separator); …", and the `--list --ignored` listing names both.

## Holds (my own project only; every `also=` elided)

Six holds, all shared, each `MACHINE_HOLD shared project=SpatialIDE cores=0-7 affinity=FF …` followed by `MACHINE_RELEASED project=SpatialIDE … affinity=FF (cores 0-7)`. None was refused and no exit code was 96-99.
1. The head test.
2. The lib `--list --ignored`.
3. The integration `--list --ignored`.
4. Clippy.
5. M4 (cold build).
6. M5.

## Background shells and end state

- The background tasks were the head test, verify-quotes, M4, M5, and one wait loop the harness moved to the background, which ended at its own deadline. All have exited (0, 0, 101, 101, 0); none is running.
- The worktree's `git status --porcelain` is empty (0 bytes, rc 0) and HEAD is 9999ef4d.
- No commit, push or PR action was taken. Scratch files are only `pbsl-g1r-*` in the scratch folder, and the temporary archive tar there was deleted.
