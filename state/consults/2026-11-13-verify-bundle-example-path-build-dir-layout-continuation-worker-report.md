*Custodian's filing note (2026-11-13): the continuation worker's report for filler entry 15, from its hand-back (15096 bytes, sha256 c53e122c4341892867941bd45429744d9d0fdf43fd842d0066bae450537e2aea), below the rule; a final newline is added and nothing else is changed. Its brief by file (6546 bytes, sha256 1bafcaa6b6d742f1e303967aec073628dd3cb4481b9e5eaf60b3a978465a01ae), its prompt naming that sha256; the run 10:08:59Z to 10:13:00Z by its transcript, 17 calls (Bash 13, Read 2, Write 1, SubagentHandback 1), none errored, model claude-opus-5-5, dispatched with the model set to opus after the first worker's API error. The first run it reads by call number is `state/consults/2026-11-13-verify-bundle-example-path-build-dir-layout-first-worker-run-extract.md`. The custodian opened PR #313 as a draft from the branch it pushed.*

---

Pushed: verify-bundle-example-path-build-dir-layout at 5977712dd15d30b40cddb6d087f299275fc4f9df

I checked the worktree, ran the light checks, read the first run's record and pushed. I changed no tracked file and made no commit. My scratch files are `<S>/vbf2-fmt.txt`, `vbf2-numstat.txt`, `vbf2-names.txt`, `vbf2-vm.txt`, `vbf2-check.mjs` and `vbf2-check.txt`.

**Step 1: the state (my call 3).** Everything matched what your brief expected.
- `rev-parse HEAD HEAD~1 HEAD~2` gave 5977712dd15d30b40cddb6d087f299275fc4f9df, f740eeef26fe54f77c4a96f752b9647d13d0802e and 3fe9f97d066f49168170f63c23b4c14c0bc843ae.
- The porcelain was empty, and `ls-remote` printed nothing.
- `rustc --version` gave `rustc 1.97.1 (8bab26f4f 2026-07-14)`.

**Step 2: my own checks at HEAD.** All passed.
- **fmt check:** rc 0; its output file is 0 bytes, so it has no last line.
- **numstat (rc 0):**
```
2	2	kernel/README.md
50	0	kernel/tests/built_targets/mod.rs
5	20	kernel/tests/scale_pass.rs
4	10	kernel/tests/verify_bundle.rs
```
  - The total is 93 lines against the declared 120.
  - `--name-only` (rc 0) names the same four Scope files and nothing else.
- **verify-mutation:** rc 0; last line `verify:mutation PASS — all 0 new test(s) have a recorded mutation naming them.`
- **My script `<S>/vbf2-check.mjs`** (rc 0). It is the only one of my checks that is not a bare command.
  - `scale_pass entries equal: true`. Base and head are both `["measure_publish_at_five_gigabytes: test","measure_the_five_gigabyte_scale_pass: test","2 tests, 0 benchmarks"]`.
  - `vbf-r4 test result lines summed: {"lines":122,"passed":1074,"failed":0,"ignored":66,"measured":0,"filtered_out":0,"not_ok":0} unparsed test result lines: 0`.
- **The module whole,** from `git show HEAD:kernel/tests/built_targets/mod.rs` (rc 0):
```
// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

//! **Where a kernel test finds the targets cargo built beside it.**
//!
//! A test binary sits in `<profile>/deps/` on one cargo layout and under
//! `<profile>/build/<package>/<hash>/out/` on another, while the examples and binaries a test
//! runs sit under `<profile>/` on both. So the profile directory is the nearest ancestor of the
//! test binary named for the build's profile, not a fixed number of parents up. Test-only: this
//! module has no test target of its own.

use std::path::PathBuf;

/// The profile directory (`target/debug` or `target/release`) holding the built examples and
/// binaries: the nearest ancestor of the running test binary named for the build's profile.
///
/// RECORDED MUTATION: at f740eeef26fe54f77c4a96f752b9647d13d0802e, with the profile name replaced
/// by `deps`, `cargo test --locked -p spatial-kernel --test verify_bundle` on rustc 1.97.1 failed
/// `a_real_bundle_verifies`, `every_corruption_class_is_caught_with_its_declared_state` and
/// `a_missing_or_unparseable_manifest_is_refused_by_name` (exit 101, 0 passed, 3 failed) at the
/// post-build existence assertion; reverted.
///
/// Panics, naming the test binary's path, when no ancestor has that name.
pub fn profile_dir() -> PathBuf {
    let profile = if cfg!(debug_assertions) {
        "debug"
    } else {
        "release"
    };
    let me = std::env::current_exe().expect("the test binary knows where it is");
    me.ancestors()
        .skip(1)
        .find(|a| a.file_name().and_then(|n| n.to_str()) == Some(profile))
        .unwrap_or_else(|| {
            panic!(
                "no ancestor of the test binary {} is named `{profile}`",
                me.display()
            )
        })
        .to_path_buf()
}

/// The file name of a built executable on this OS.
pub fn exe_name(name: &str) -> String {
    if cfg!(windows) {
        format!("{name}.exe")
    } else {
        name.to_string()
    }
}
```
- **The hunks,** from `git diff B...HEAD` over the other three files (rc 0):
```
--- a/kernel/tests/verify_bundle.rs
+++ b/kernel/tests/verify_bundle.rs
@@ -16,6 +16,8 @@
 //! is derived rather than guessed, and if it is missing the test **fails loudly** rather than
 //! skipping: a vacuous pass here would be the exact failure the file exists to prevent.
 
+mod built_targets;
+
 use std::path::{Path, PathBuf};
 use std::process::Command;
 
@@ -62,16 +64,8 @@ fn verifier() -> PathBuf {
 }
 
 fn build_verifier() -> PathBuf {
-    let me = std::env::current_exe().expect("the test binary knows where it is");
-    let profile_dir = me
-        .parent()
-        .and_then(|deps| deps.parent())
-        .expect("target/<profile>/deps/<test>");
-    let exe = if cfg!(windows) {
-        "verify-bundle.exe"
-    } else {
-        "verify-bundle"
-    };
+    let profile_dir = built_targets::profile_dir();
+    let exe = built_targets::exe_name("verify-bundle");
     let path = profile_dir.join("examples").join(exe);
     if path.exists() {
         return path;
--- a/kernel/tests/scale_pass.rs
+++ b/kernel/tests/scale_pass.rs
@@ -33,6 +33,7 @@
 //!   the same `row_group_rows`, and it is the only thing the 5 GB memory figure may be compared
 //!   with.
 
+mod built_targets;
 mod support;
 
 use std::path::{Path, PathBuf};
@@ -1268,32 +1269,16 @@ fn compare_partitions(a: &Path, b: &Path) -> (usize, bool, Option<String>) {
 /// harness that silently measures a stale binary, which is the failure `pin-tree.mjs --binaries`
 /// exists to catch one level up.
 fn binary_beside_me(name: &str) -> PathBuf {
-    let me = std::env::current_exe().expect("the test binary knows where it is");
-    let profile = me
-        .parent()
-        .and_then(|d| d.parent())
-        .expect("target/<profile>/deps/<test>");
-    let exe = if cfg!(windows) {
-        format!("{name}.exe")
-    } else {
-        name.to_string()
-    };
+    let profile = built_targets::profile_dir();
+    let exe = built_targets::exe_name(name);
     let path = profile.join(&exe);
     assert!(path.exists(), "{name} is not built at {}", path.display());
     path
 }
 
 fn example_beside_me(name: &str) -> PathBuf {
-    let me = std::env::current_exe().expect("the test binary knows where it is");
-    let profile = me
-        .parent()
-        .and_then(|d| d.parent())
-        .expect("target/<profile>/deps/<test>");
-    let exe = if cfg!(windows) {
-        format!("{name}.exe")
-    } else {
-        name.to_string()
-    };
+    let profile = built_targets::profile_dir();
+    let exe = built_targets::exe_name(name);
     let path = profile.join("examples").join(&exe);
     assert!(
         path.exists(),
```
- **kernel/README.md:** two one-line hunks, each a long bullet line replaced whole. These are the only changes, byte-copied:
  - Hunk @@ -358,7 +358,7 @@: the Last-verified line gains, at its end, `; every pointer the build-dir layout piece adds or changes (this piece's form in the preregistration list) at 3fe9f97d`.
  - Hunk @@ -387,7 +387,7 @@: the preregistration list gains, at its end, `, `governance/forms/kernel/VERIFY-BUNDLE-EXAMPLE-PATH-BUILD-DIR-LAYOUT-PREREGISTRATION.md``.

**Step 3: the first run, from its record.** Every item comes from the extract `vbf-run1-calls-c.txt`, by call number. Exit codes and lines marked "task" come from the background task output the extract names for that call; I read those files but did not change them.

*The first brief's steps 1 to 5:*
- **Step 1:**
  - Call 6: `3fe9f97d066f49168170f63c23b4c14c0bc843ae` and `rustc 1.97.1 (8bab26f4f 2026-07-14)`.
  - Call 11: the hashes, below.
  - Call 13: the base list. Exit 0 (task `[exited with code 0]`). Last line of `vbf-list-base.txt`: `0 tests, 0 benchmarks`.
- **Step 2:**
  - Call 30 wrote the module; calls 32, 35 and 36 made the edits.
  - Call 37: `rc=0`; last line `kernel/tests/verify_bundle.rs`.
- **Step 3:** call 41, `rc=0`; last line `f740eeef26fe54f77c4a96f752b9647d13d0802e`.
- **Step 4:**
  - Calls 42 and 43 are M1, below.
  - Call 49 reverted it; last line `f740eeef26fe54f77c4a96f752b9647d13d0802e`.
  - Call 52 wrote the doc line.
  - Call 54 made commit 2: `rc=0`, `5977712dd15d30b40cddb6d087f299275fc4f9df`; last line `verify-bundle.exe`.
- **Step 5,** each run with its exit code and last line:
  - Call 55, the example deleted: `deleted`; `r1rc=0` (call 64); `test result: ok. 3 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 639.67s`.
  - Call 65, the example present: `r2rc=0` (call 69); `test result: ok. 3 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 3.61s`.
  - Call 70, the build: `r3rc=0` (task); ``    Finished `dev` profile [unoptimized + debuginfo] target(s) in 6m 04s`` (call 72).
  - Call 73, the full suite: `r4rc=0` (task; call 85 counts 1 match). Call 85 summed it as `{ lines: 122, passed: 1074, failed: 0, ignored: 66 }`. Last non-empty line: `test result: ok. 0 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.00s`.
  - Call 86, the list at head: `listrc=0`.
  - Call 87, the compare: `scale_pass entries base 3 head 3 equal true` and `all ignored entries base 66 head 66`.
  - Call 88, fmt: `fmtrc=0`; output 0 bytes.
  - Call 89, clippy with `-D warnings`: `clippyrc=101`; last line `warning: build failed, waiting for other jobs to finish...`. By call 90, the errors are at `renderer\src\canonical.rs:303:20` and `renderer\src\style.rs:10:5`, neither in an added line.
  - Call 92, numstat: the same four lines as above.
  - Call 93, verify-mutation: `vmrc=0`.
  - Call 94: `ntrc=0`, `verify-cites rc=0`, `verify-test-claims rc=0`, `verifyrc=0` and `flrc=0`. Call 95 gives `ℹ pass 598` and `ℹ fail 0`.
  - Call 96, verify-quotes: `vqrc=0` (task). Last line `verify:quotes PASS — 155 checked, 124 verified, 30 baselined, 1 advisory, 0 baseline entry errors, 0 hash-reference errors (2 hash-baselined), 0 hash-baseline entry errors, 925 ruling cites resolved, 0 ruling-cite errors.`

*M1:*
- **The diff (call 42):**
```
-    let profile = if cfg!(debug_assertions) {
-        "debug"
-    } else {
-        "release"
-    };
+    let profile = "deps";
```
- **Exit code:** `m1rc=101` (call 47).
- **The failing tests (call 48),** each `panicked at` line with the line after it:
```
thread 'a_missing_or_unparseable_manifest_is_refused_by_name' (57484) panicked at kernel\tests\verify_bundle.rs:92:5:
verify-bundle was built but is not at D:\wt-targets\vbf\debug\deps\examples\verify-bundle.exe — the path derivation is wrong, and this test would otherwise pass vacuously
thread 'every_corruption_class_is_caught_with_its_declared_state' (57840) panicked at kernel\tests\verify_bundle.rs:92:5:
verify-bundle was built but is not at D:\wt-targets\vbf\debug\deps\examples\verify-bundle.exe — the path derivation is wrong, and this test would otherwise pass vacuously
thread 'a_real_bundle_verifies' (61448) panicked at kernel\tests\verify_bundle.rs:92:5:
verify-bundle was built but is not at D:\wt-targets\vbf\debug\deps\examples\verify-bundle.exe — the path derivation is wrong, and this test would otherwise pass vacuously
```
- **Summary line:** `test result: FAILED. 0 passed; 3 failed; 0 ignored; 0 measured; 0 filtered out; finished in 717.65s`.

*The base hashes (call 11):* `538f53e30d1f584e4076125f0e840ee2fbf57164b4bb0b0b9a6bb68ae6f89d9b *-` and `fc5fa7f88bfc14a38c6dbceb65936071ede2bde647fef6d256d0daabbeb7a7b2 *-`. Both equal the form's Change-line pins.

*The hold lines,* with `also=` elided:
- Call 13 (task):
  `MACHINE_HOLD shared project=SpatialIDE cores=0-7 affinity=FF shell=bash.exe:78360 also=… (commands started from now on inherit it; release when done)`
- Calls 38, 43, 65, 70, 86, 89, 91 and 96 each show `MACHINE_HOLD shared project=SpatialIDE cores=0-7 affinity=FF shell=bash.exe:<pid> also=… (commands started from now on inherit it; release when done)`, with these pids in order: 16536, 57932, 62120, 61296, 37300, 72856, 21632 and 15336.
- Call 55 (task): `shell=bash.exe:62076`. Call 73 (task): `shell=bash.exe:74356`.
- Every hold has its `MACHINE_RELEASED` line.

*The five errored calls,* each with what the run did next:
- **17:** `<tool_use_error>Blocked: sleep 240 followed by: ...`. Next was call 18.
- **28:** `<tool_use_error>spatial-guardian: refused, because the path cannot be placed.</tool_use_error>`. Next was call 29 (`mkdir -p`), then call 30, the same Write.
- **33:** `<tool_use_error>File has not been read yet. Read it first before writing to it.</tool_use_error>`. Next was call 34, a grep for `deps`, which finds none in verify_bundle.rs. The doc edit was not retried.
- **50:** `<tool_use_error>File has been modified since read, ...`. Next was call 51 (Read), then call 52.
- **89:** `Exit code 101`. Next were call 90 (the diagnostics) and call 91.

*Calls not as the first brief says,* reported and not judged:
- **Call 13:** `-Minutes 55`, beside the brief's line "give that hold 3600 s". The call did not print its own `$?`.
- **Calls 15, 16 and 19:** wait loops that were moved to the background. Call 16 is `sleep 20` repeated 100 times with no condition. The brief's line is "carries a hard timeout ... that ends it". All three tasks show `[exited with code 0]`.
- **Calls 31, 35, 36 and 42:** scratch scripts written with a shell heredoc. By my `tr` count they hold 0, 4, 4 and 1 backslash bytes. The brief's line is "Write any file with a backslash in it with the Write tool, never a shell heredoc".
- **Calls 37 and 88:** `cargo fmt` run with no hold and without `CARGO_BUILD_JOBS` or `RUST_TEST_THREADS`. The brief's line is "Every cargo call sets ... and runs inside a shared hold".
- **Call 38:** an extra `--no-run` build of verify_bundle and scale_pass, which is in none of the brief's steps.
- **Call 91:** an extra clippy run without `-D warnings`.
- **Call 92:** numstat and name-only were not sent to a file and printed no `$?`. The brief's line is "Redirect each command's output to a file, and print `$?` right after it".
- **Call 95:** `verify-quotes.mjs --help`, run outside a hold, which errored with ENOENT. The brief's line is "`node scripts/plan/verify-quotes.mjs`, inside a shared hold".
- **Calls 41 and 53:** the commit message files carry the trailer `Claude Sonnet 5.5`, which the first brief prescribed.
- **The end of the run:** it stopped after call 97 (`API Error: 403`), with no push and no report.

**The push.** `git push -u origin cut/verify-bundle-example-path-build-dir-layout` ran in its own call, `* [new branch]`. Afterwards `ls-remote` gives `5977712dd15d30b40cddb6d087f299275fc4f9df	refs/heads/cut/verify-bundle-example-path-build-dir-layout`, which equals HEAD, and the porcelain is empty. I opened no PR and did not wait for CI.

**Background shells left:** none. All my calls ran in the foreground.

**Model:** the harness reports Opus 5.5 (claude-opus-5-5); no override. I received no context handoff and produced none.

**Pre-gate self-check:**
- No cross-module code was written.
- Every claim above names its call.
- No user-facing message changed.
- The required tests reach their assertions: T1 to T3 pass unmutated (calls 64 and 69) and fail under M1 at `verify_bundle.rs:92:5` (call 48).
