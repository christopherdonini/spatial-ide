Reviewed: PR #326 at f8f931e2ce6c4ba04f4bbc54c6352ae6a8c0c2bb (the custodian's filing note, 2026-11-15: the reviewer, PLAN node lod-tier-tests-own-tier-folder, under its form (`governance/forms/engine/LOD-TIER-TESTS-OWN-TIER-FOLDER-PREREGISTRATION.md`, Amendment 2), one of its two gates from dispatch; dispatched at 2026-11-15T21:27:18Z by the custodian's transcript, in the background, its prompt naming the brief in the custodian's scratch folder (15400 bytes, sha256 7668855558df409396bb384f17c8cfd0e97683101672f40491ce7988fbe8dcf1); the run 2026-11-15T21:27:40Z to 2026-11-15T22:29:47Z by its transcript, 89 calls (Bash 78, Read 10, SubagentHandback 1), none errored, model claude-opus-5-5; the custodian's message of 2026-11-15T22:26:43Z added PR B's head-series tester to those it yields to (PR B's form, Amendment 24 item 4); each run it claims has a call behind it, by the custodian's audit; received at 2026-11-15T22:29:47Z by the custodian's transcript; the report below, byte for byte, from its hand-back of 23615 bytes, sha256 d26e8a4a4f1dd7b3377590e26fa9830ffdf7ad77efe4e602b4771e2c8320de5d, with this note added in its first line), gate reviewer
cut/lod-tier-tests-own-tier-folder @ f8f931e2ce6c4ba04f4bbc54c6352ae6a8c0c2bb
Verdict: PASS WITH NOTES

Correctness and Evidence are closed. I found nothing that blocks. Four Documentation findings must be fixed before the merge, with no re-gate. None of the four sentences is in the human's wording, and replacement words with a clause check are given for each. One Scope question goes to the advisor.

## Findings by class

### Correctness
None.

### Evidence
None. I re-observed both mutations at H. All runs 4 to 6, the light checks and CI agree with the form and with Amendment 2. There is one nuance on run 6, under Observation O1.

### Documentation (must fix before the merge; not the human's wording; the worker applies these words with no re-gate, and the PR body lists them)

**D1. `engine/tests/common/mod.rs:202-203`, the doc of `inherited_local_app_data`.**
- It says the inherited value is "the machine-wide root a test run must not build under".
- That is untrue in T-B's second process. That process inherits the parent's run folder, because the parent sets the variable at line 140 before it spawns the child at `lod_tier_builder.rs:1770-1779`, and `Command` does not clear the environment.
- Replacement words: "`LOCALAPPDATA` as this process inherited it, read by the first call of [`tier_run_root`] before that call, on Windows, replaces it. For a test process cargo starts, this is the machine-wide root a test run must not build under; in the second process of `a_second_run_clearing_and_removing_its_own_tiers_leaves_this_runs_tiers_in_place` it is the first process's own folder."
- Clause check:
  - "read by the first call": `var_os` at :133, inside `get_or_init`.
  - "on Windows, replaces it": `set_var` under `cfg!(windows)` at :139-141.
  - "cargo starts … machine-wide": the shell's environment, unmodified.
  - "second process … first process's own folder": the parent's `set_var` happens before the spawn, and the child inherits the environment.

**D2. `engine/tests/common/mod.rs:209-210`, the doc of the `build_tiers` wrapper.**
- It says the wrapper runs "after this process's tier folder exists and `LOCALAPPDATA` points at it".
- That is untrue for preflight's first call. `lod_tier_preflight.rs:172-173` sets the variable to the absent volume and then calls the wrapper. The wrapper does not re-set it, because `OnceLock` runs only once.
- It is also untrue off Windows, where nothing is created.
- Replacement words: "The engine's `build_tiers`, called after [`tier_run_root`] has run: on Windows this process's tier folder then exists, and `LOCALAPPDATA` points at it unless the caller has set it since (`lod_tier_preflight.rs` points it at an absent volume for one call). The suites build through this and not through `spatial_engine::lod::build_tiers` itself."
- Clause check:
  - `tier_run_root()` runs at :217, then the call delegates at :218.
  - The folder is created only under `#[cfg(windows)]` (`take_folder_and_sweep`, :150).
  - `set_var` runs once inside the `OnceLock` init.
  - The preflight lines are 171-177.

**D3. `engine/tests/common/mod.rs:192-198`, the doc of `tier_run_root`.**
- It says the variable points at the folder "for the rest of the process". Preflight's injection changes it for one call and puts it back.
- Replacement words: "The folder this test process builds its LOD tiers under. On Windows the first call creates it, removes the folders of runs that have finished, and points `LOCALAPPDATA` at it, once and before any build there, so a build made through [`build_tiers`] below lands in `<this folder>/spatial-ide/tiers/<content hash>`; nothing here sets the variable again, so a test that changes it puts it back itself, as `lod_tier_preflight.rs` does. Call it before reading `LOCALAPPDATA` for a tier path. Off Windows it creates nothing and sets nothing: no tier root is declared there."
- Clause check:
  - Creation is at :150, and the sweep is at :130-148.
  - The single `set_var` is at :140, inside `OnceLock`.
  - The path is `engine/src/lod.rs:1180` with `LOD_TIER_ROOT = "spatial-ide/tiers"` (lod.rs:151).
  - Preflight's restore is at its lines 174-177.
  - Off Windows: the sweep function is `cfg(windows)`, `set_var` is under `cfg!(windows)`, and app_dirs.rs:14 declares no tier root there.

**D4. `kernel/tests/no_generation_in_persisted_artifacts.rs:474-477`.**
- "Nothing else in this binary reads `LOCALAPPDATA`" is literally untrue. `AuditLog::open_for` (`kernel/src/permission/audit/log.rs:130-152`, on its error paths) calls `normalize_destination`, whose `roots_from_environment` (normalize.rs:118-133) reads `LOCALAPPDATA`. It reads it as a root to turn into a token in a message, not to resolve a directory.
- Replacement words: "Nothing else in this binary resolves a directory from `LOCALAPPDATA`: the audit-log test sets `AUDIT_LOG_ENV`, so the log path never reaches `data_dir`, and the history and project tests pass their own store roots."
- Clause check:
  - `resolve_log_path` returns from the environment variable at log.rs:344, before `data_dir` at :358.
  - The test sets the variable at :532 before `open_for` at :533.
  - `StepRecorder::new(d.join("store"), …)` is at :875, and `Projects::new(d.join("machine"), …)` at :992.
  - `default_root` and `projects_root` have callers only in `frontends/shell/src-tauri/src/lib.rs:454,460`.

### Observation (no fix asked)

- **O1. Run 6 with `-D warnings`.**
  - My run exited 101 on three errors, not two. The two renderer rows were joined by `clippy::enum_variant_names` at `engine\src\app_dirs.rs:39:5`, and both the `spatial-renderer` lib and the `spatial-engine` lib failed.
  - Amendment 2 item 5 records two errors. With cargo's "waiting for other jobs to finish", which errors appear depends on scheduling.
  - So rows 44 and 45 alone do not make this command green. The app_dirs row, now in 12d by the packet's flag 5, is needed too. None of the three is in a changed file.
- **O2. Measurement conditions.**
  - The tiers of the `--ignored` measurement rows now go to the volume of `CARGO_TARGET_TMPDIR`, which is D: for this worktree, instead of C:.
  - `one_sample`'s timed region (lod_tier_measurements.rs:204-206) now includes the wrapper's `OnceLock` fast path.
  - Neither is measured. A tester re-running those rows should record the volume.
- **O3. A rare race (my reading).** A new process whose pid matches a finished run's leftover `<pid>.lock` can panic at `expect("take this run's lock")` (common/mod.rs:129). That needs another process's sweep to hold that same file open with `share_mode(0)` at that instant.
- **O4. Leftovers.**
  - A lock-less folder is never swept.
  - The kernel's `kernel-lod-tier-run-<pid>` folder is removed on drop, unwind included, but it is left if the process is killed.
  - Neither reaches `<L>`.
- **O5. A file name split across two comment lines.** The form's file name is split across lines at lod_tier_builder.rs:1687-1688 (`LOD-TIER-TESTS-OWN-TIER-FOLDER-` / `PREREGISTRATION.md`), so a grep for it misses. It is not a pinned reference.
- **O6. A child PowerShell.** In the `--ignored` rows, `free_bytes_on_run_volume` spawns PowerShell with the run folder as its `LOCALAPPDATA`. Anything it writes stays inside the run folder.

### Scope question for the advisor (Amendment 1 item 2; not mine to rule)

My reading, a paraphrase of mine: each line below is a mechanical consequence of a named item, but the Scope line does not name it for that file. Lines are at H.

- **`engine/tests/common/mod.rs`:**
  - 4-7: the module doc adds `lod_tier_preflight.rs`.
  - 25 and 78: `#[allow(dead_code)]` on `POLYGONS_100K` and `polygons_100k`. They are named only in N3, not in the Scope line.
  - 112 and 114: the `generations_performed` doc, "four" and "other three".
- **`engine/tests/lod_tier_builder.rs`:** 1409 and 1490. These are disclosure prints that call the renamed floor function; they are not the floor itself.
- **`engine/tests/lod_tier_measurements.rs`:** 272 and 292, the free-space prints of the 100k measurement, which has no floor; and 322 and 639, the disclosure prints. Each now reads the run volume.
- **`engine/tests/lod_tier_preflight.rs`:** 10-11, the module doc.

Everything else is inside the named items: the kernel file wholly, the README wholly, and the cancellation file wholly.

## The checks

**0. The packet and the checker.**
- The packet `<S>/packet-326.md` is 6145 bytes, sha256 537a5f6e199a18f1f14e3b722b797025124ed4fbaf9d6100ab3ee477bf3798a0.
- `<S>/m4b-rec-onehold.mjs` is 635 bytes, sha256 18677923dc49fe463c072f071a2d74a70fefdec9119f46eff4600564743c28bf, as given.
- The form at origin/main is 28969 bytes, sha256 207b86ac79fe1391302770da65673cc3c894201c567f47508c753e5b329df6ca.
- The fetch exited 0. Main is at 4327a2eea8673954e6590d6346598d75575e3709.

**1. Start.**
- HEAD was f8f931e2…, the branch was `cut/lod-tier-tests-own-tier-folder`, and the porcelain was empty.
- `ls-remote` gave H (rc 0). The merge base is d2008810.
- `df -h`: C: 51G available (90%), D: 366G available.

**2. The diff (all rc 0).**
- numstat: 2/2 README, 115/7 common, 171/31 builder, 7/9 cancellation, 18/13 measurements, 9/4 preflight, 35/0 kernel. That is 357 + 66 = 423 over 7 files.
- The out-of-scope name list (`engine/src kernel/src protocol docs KNOWN-LIMITATIONS.md engine/tests/lod_tier_root.rs`) is empty.
- No manifest or lockfile is in the diff, and there are 0 added `unsafe` lines.
- No new dependency. No string a user sees: only test panic text changed.
- My diff file has the same sha256 as the packet's, 1f3b041d383af6ec2c8261c3e968ca5f6c8dda9428e08647fe68b119ee7ef15c.
- Main changed none of the seven files since B (an empty list).

**3. The Scope question.** Listed above.

**4. The code at H against the Change line and the Tests+mutation line.** Every clause holds.
- **The per-run folder:** `CARGO_TARGET_TMPDIR/lod-tier-runs/<pid>` (common:134-136).
- **`LOCALAPPDATA` set once, before the first build:** it is set in the `OnceLock` init (:131-149). The wrapper calls `tier_run_root()` before the engine (:217-218), and every path site calls it first.
- **The product's resolution unchanged:** no file under `engine/src` is in the diff.
- **T-A (1) and (2):** builder lines 1729-1738.
- **T-B:**
  - (1) is at :1781-1785, (2) at :1793-1797, (3) at :1798-1802 and (4) at :1803-1807.
  - The second process uses `current_exe`, `--exact`, `--ignored` and the environment variable (:1770-1779).
  - `.output()` waits, so the order comes from process sequence alone.
- **The child half:** it is `#[ignore]` with no `cfg` (:1813-1814), and it returns at once when its variable is absent (:1816-1818).
- **The sweep with its lock test (OPEN-2 (A)):** :154-186.
- **The kernel test's own folder and its removal (OPEN-8 (A)):** the `OwnTierRoot` guard on `kernel-lod-tier-run-<pid>`, removed on drop. After run 5, 0 such folders remained.
- **The no-timing stop, by script:** a grep for sleep, instant, duration, timeout, thread, elapsed or retry from builder line 1680 to the end exited 1 (no match).
- **The N5 stop, by script:** every removed line containing assert, expect or == is a path site's `.expect("LOCALAPPDATA")` or comment text. No assertion's expected value was edited.

**5. P-0 (b), by script over `git grep build_tiers H -- engine/tests`.**
- **The four suites:**
  - Each has exactly one use line, which is `use common::{build_tiers, …}` (builder:59, cancellation:29, measurements:40, preflight:33).
  - Their calls are unqualified: builder 21, cancellation 2, measurements 2, preflight 2.
  - The only other mentions are `//` RECORDED-MUTATION text (builder:674, preflight:138), test-function names `build_tiers_refuses_*` (builder:1515, 1579, 1642), and doc comments (builder:1386, measurements:15).
- **common:** a definition at :211 and the one qualified call `spatial_engine::lod::build_tiers(` at :218. The three doc lines are 194, 209 and 210.
- **lod_tier_root.rs:** its use line at :26 and its call at :113 are the same as at B. `git diff --quiet B H` on the file exited 0. It is its own binary, it sets a relative value on Windows (:104-111), and the build is refused (:114-135).
- **Six files** name `build_tiers`, and no other. There is no glob import.
- Every clause of the fenced text holds.

**6. §C.**
- **The kernel binary, first:**
  - `data_dir` has users at log.rs:358 (`resolve_log_path`), session_history.rs:249 and store.rs:57.
  - `default_root` and `projects_root` have callers only in the shell.
  - The binary reaches `open_for` only at :533, with `AUDIT_LOG_ENV` set at :532.
  - Its stores get explicit roots (:875, :991-992).
  - `publish_unguarded` opens no audit log.
  - `watch_support` has no environment reads.
  - The only other `LOCALAPPDATA` reader is `normalize_destination`, on error paths only (see D4).
- **The engine binaries:** in `engine/src`, `LOCALAPPDATA` is read only by `data_dir_for` and `tier_root_for`. `user_data_dir`'s only product caller is kernel log.rs:378. The process-level extras are T-B's child (the same binary) and the PowerShell child in the ignored rows (O6).
- **The stop report's statements:**
  - These hold: the three `data_dir` users at those lines, `open_for` once with the environment variable set, the explicit roots, `watch_support` with no reads, nothing in `engine/src` reading the data directory, and `user_data_dir`'s one caller at log.rs:378.
  - "Nothing there depends on the machine's real directory" holds. T-A only compares against the inherited value.
  - The kernel comment's broader sentence is D4.

**7. The mutations, observed at H.** Each was applied alone by one anchored `node -e` (anchor count must be 1, which it was).

- **M1:**
  - The diff removes the line `            std::env::set_var("LOCALAPPDATA", &root);` from `tier_run` (common:140), leaving `if cfg!(windows) { }`.
  - The form names its caller `common::tier_run_root`; it is the same line.
  - Command: `cargo test -p spatial-engine --locked --test lod_tier_builder -- a_test_runs_tiers_are_built a_second_run_clearing`, rc 101. Result: `test result: FAILED. 0 passed; 2 failed; 0 ignored; 0 measured; 20 filtered out; finished in 0.57s`.
  - T-A panicked at `engine\tests\lod_tier_builder.rs:1729:5`, message prefix `(1) the tiers were built under the machine-wide tier root: ` (the path is under `<L>`).
  - T-B panicked at `engine\tests\lod_tier_builder.rs:1794:5`, prefix `(2) the second run took this run's tiers away: [`, listing tier-1, tier-2 and tier-3 under `<L>`.
  - The source lines are `"(1) the tiers were built under the machine-wide tier root: {directory:?}"` and `"(2) the second run took this run's tiers away: {gone:?}"`.
  - As predicted.
  - `<L>/spatial-ide/tiers` before and after: 1 entry each, sha256 5139d535df51741a85f481cfe3d6172859bc88f1cdd10268a52ba4c83079f9f2 both. Equal.
  - Reverted with `git checkout -- engine/tests/common/mod.rs`. The diff is 0 bytes, and the sha256 is 62c56d2f5beb6507bc3448e37a9dd4fa42ffd59c0d0265f69aece6c7ff1d71a0, equal to `git show H:` of the file.
- **M2:**
  - I applied the Tests+mutation wording ("without first testing its lock"), which differs from the comment's application. The diff replaces the whole `let Ok(finished) = std::fs::OpenOptions::new()…open(&lock) else { continue; };` with `let finished = ();`, so there is no lock open at all. The comment keeps the open and ignores its result.
  - Command filtered to `a_second_run_clearing`, rc 101. Result: `test result: FAILED. 0 passed; 1 failed; 0 ignored; 0 measured; 21 filtered out; finished in 0.89s`.
  - T-B panicked at `engine\tests\lod_tier_builder.rs:1794:5` with `(2) the second run took this run's tiers away: [`. As predicted. One compile warning came from the mutation (dropping a `Copy` value).
  - Reverted: the diff is 0 bytes, and the sha256 is 62c56d2f…71a0, equal to H.
  - The M2 run left two run folders in `<T>/tmp/lod-tier-runs`. Run 4's sweep removed them.

**8. The heavy runs**, each at H with `CARGO_TARGET_DIR=<T> CARGO_BUILD_JOBS=8 RUST_TEST_THREADS=8`.
- **Run 4**, `cargo test -p spatial-engine --locked`: rc 0.
  - 54 result lines, 491 passed, 0 failed, 20 ignored.
  - `lod_tier_builder` 19/0/3. T-A and T-B are `ok`, and the child half is `ignored, the second process of …`.
  - `lod_tier_cancellation` 1/0/1, `lod_tier_measurements` 1/0/4, `lod_tier_preflight` 1/0/0, `lod_tier_root` 1/0/0. Every other binary passed with 0 failed.
- **Run 5**, the kernel test `no_generation_in_persisted_artifacts`: rc 0, `test result: ok. 9 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 3.44s`.
- **Run 6**, clippy with `-D warnings`: rc 101, as Amendment 2 records. The errors were:
  - `clippy::manual_range_contains` at renderer\src\canonical.rs:303:20 (row 44, whose line has moved from the read's 240);
  - `clippy::doc_lazy_continuation` at renderer\src\style.rs:10:5 (row 45);
  - plus `clippy::enum_variant_names` at engine\src\app_dirs.rs:39:5 (O1).
- **Run 6b**, without `-D warnings`: rc 0. Nine warnings:
  - the two renderer rows;
  - `enum_variant_names` at app_dirs.rs:39;
  - `ptr_arg` at kernel/src/permission/boundary.rs:536 (row 30);
  - `needless_borrow` at kernel/src/publish/mod.rs:839 (row 31);
  - `type_complexity` at kernel/src/skp.rs:277 (row 32), lib.rs:415 and lib.rs:490 (rows 28 and 29);
  - `manual_is_multiple_of` at kernel/src/bin/publish-bundle.rs:149 (row 27).
  - None is in a changed file.
- **The tier lists:** `g326r-tiers-4.txt` (before run 4) and `g326r-tiers-5.txt` (after run 5) are 1 entry each, sha256 5139d535…f9f2 both. No entry is new or changed.

**9. The light runs**, from `<W>`.
- `cargo fmt --all -- --check`: rc 0, no output.
- `node --test` over the three script globs: rc 0. Tests 606, pass 606, fail 0.
- verify-cites: rc 0, PASS over 3107 files.
- verify-test-claims: rc 0, PASS, 812 claims over 269 files.
- verify.mjs --offline: rc 0, PASS.
- verify-quotes, in a hold: rc 0. `PASS — 156 checked, 125 verified, 30 baselined, 1 advisory, 0 baseline entry errors, 0 hash-reference errors (2 hash-baselined)…`.

**10. Comments and doc lines.** Only D1 to D4 fail.
- **The recorded-mutation comments:**
  - M1 (builder:1707-1711): the line is right, and assertions (1) and (2) are right, as observed at H.
  - M2 (:1744-1748): the effect and assertion (2) hold. Its application differs from the form's wording, as noted under check 7.
  - Both name the full commit id. Neither calls a verify-mutation run an observation.
- **The other doc and comment lines hold:**
  - `drop_tiers`'s doc;
  - the comment at :980-983;
  - the cancellation paragraph;
  - the preflight module doc and its inline comment;
  - the T-A, T-B and child docs, including "three", since `LOD_TIER_COUNT` is 3;
  - `SECOND_RUN_SOURCE`;
  - `TierRun._lock` (it sits in a static and is never dropped);
  - `take_folder_and_sweep`;
  - both `free_bytes_on_run_volume` docs (I6, LOD form :242, is about the volume the ladder is built on);
  - the kernel `OwnTierRoot` doc;
  - the README entry. The form's path exists at 36c12ff2, and PRs merge by merge commit, so the branch ids stay reachable.

**11. The packet's flags.**
1. P-0 (b) holds at H (check 5).
2. §C holds. D4 and O6 are noted.
3. The Scope list goes to the advisor (above).
4. The window is recorded as class 1. None of my holds overlapped another hold of this project.
5. Run 6 is confirmed, with O1.
6. Size 423 is confirmed by numstat. Time is not mine to check.
7. N9 is confirmed (check 12).
8. The tier folder is unchanged across all my runs.
9. I re-read everything; the locator's facts match.

**12. CI, read at 2026-11-15T21:43:17Z.**
- `gh pr checks 326` (rc 0) gave 20 rows, all pass.
- `gh run view` shows head sha f8f931e2ce6c4ba04f4bbc54c6352ae6a8c0c2bb for each of 12 runs, all completed success:
  - push: 43757260597, -596, -632, -619, -644;
  - pull_request: 43759921396, -399, -384, -473, -401, -407, -416.
- Logs from run 43759921396 were saved into `<S>`: jobs 132952201946 (Windows), 132952202022 (macOS) and 132952201925 (Ubuntu).
- **Windows, byte-copied:**
  `test a_test_runs_tiers_are_built_in_its_own_folder_and_never_under_the_machine_wide_tier_root ... ok`
  `test a_second_run_clearing_and_removing_its_own_tiers_leaves_this_runs_tiers_in_place ... ok`
  `test the_second_run_half_of_the_two_runs_test ... ignored, the second process of a_second_run_clearing_and_removing_its_own_tiers_leaves_this_runs_tiers_in_place; returns at once unless LOD_TIER_SECOND_RUN_SOURCE names a source`
  `the_second_run_half_of_the_two_runs_test: test`
- **macOS and Ubuntu (identical), byte-copied:**
  `test a_second_run_clearing_and_removing_its_own_tiers_leaves_this_runs_tiers_in_place ... ignored, boundary: application directories and free space (engine/src/app_dirs.rs, engine/src/lod.rs); deferred by engine/LOD-PREREGISTRATION.md Amendment 8(a)`
  `test a_test_runs_tiers_are_built_in_its_own_folder_and_never_under_the_machine_wide_tier_root ... ignored, boundary: application directories and free space (engine/src/app_dirs.rs, engine/src/lod.rs); deferred by engine/LOD-PREREGISTRATION.md Amendment 8(a)`
  `test the_second_run_half_of_the_two_runs_test ... ignored, the second process of a_second_run_clearing_and_removing_its_own_tiers_leaves_this_runs_tiers_in_place; returns at once unless LOD_TIER_SECOND_RUN_SOURCE names a source`
  plus the `: test` list lines for all three.

**13. End.**
- HEAD is f8f931e2ce6c4ba04f4bbc54c6352ae6a8c0c2bb, and the porcelain is empty.
- `df -h`: C: 51G available (90%), D: 365G available.

## The holds

Each hold was in its own background call, after a status read in a call of its own. In every hold the read after the grant gave "holds of this project after the grant: 1" (exit 0). None showed MACHINE_WAITING or MACHINE_ERROR, and no hold exited 96 to 99, 95 or 92. Every hold line read `MACHINE_HOLD shared project=SpatialIDE cores=0-7 affinity=FF shell=bash.exe:<n> also=<m> (…)`, followed by `MACHINE_RELEASED`.

| Hold | Status read before (time; this project's line; quiet, average, peaks-over-25) | Read after the grant (quiet, average, peaks) | Times |
|---|---|---|---|
| M1 | 21:33:49Z; none; False, 18.9%, 4 | False, 15.3%, 2 | 21:34:21Z to 21:35:37Z |
| M2 | 21:37:34Z; none; False, 20.2%, 3 | False, 21.7%, 6 | 21:37:55Z to 21:39:11Z |
| Run 4 | 21:42:18Z; none; False, 23.3%, 7 | False, 25.3%, 22 | 21:42:35Z to 22:04:00Z |
| Run 5 | 22:05:22Z; none; False, 22.7%, 11 | False, 22.9%, 10 | 22:05:32Z to 22:06:43Z |
| Run 6 (`-D`) | 22:08:31Z; none; False, 15.0%, 0 | False, 20.1%, 4 | 22:08:42Z to 22:09:55Z |
| Run 6b | 22:13:00Z; none; False, 19.4%, 5 | False, 19.5%, 5 | 22:13:09Z to 22:14:33Z |
| verify-quotes | 22:19:47Z; none; False, 19.5%, 5 | False, 16.6%, 3 | 22:19:56Z to 22:28:05Z |

Notes on the holds:
- For run 4, an earlier status read at 21:41:01Z (none; False, 22.4%, 4) shared a call with the tier listing, which departs from the brief. I read the status again in its own call at 21:42:18Z before holding.
- The coordinator's addition, that PR B's head-series tester may also hold, arrived after my last hold. I took no hold after it.
- A wait loop for run 6 polled a wrong task id. It was harmless and simply timed out.

## Background shells and model

- **Background shells left:** none. Every background command finished, including the backgrounded wait loop bvq32zp2f. I started no other process that is still running.
- **Model:** claude-opus-5-5 (Opus 5.5).

Scratch evidence is in `<S>`, under the `g326r-*` files.