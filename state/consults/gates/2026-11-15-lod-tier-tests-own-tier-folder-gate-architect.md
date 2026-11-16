Reviewed: PR #326 at f8f931e2ce6c4ba04f4bbc54c6352ae6a8c0c2bb (the custodian's filing note, 2026-11-15: the architect, PLAN node lod-tier-tests-own-tier-folder, under its form (`governance/forms/engine/LOD-TIER-TESTS-OWN-TIER-FOLDER-PREREGISTRATION.md`, Amendment 2), one of its two gates from dispatch; dispatched at 2026-11-15T21:27:39Z by the custodian's transcript, in the background, its prompt naming the brief in the custodian's scratch folder (6856 bytes, sha256 7aa633f88a5db254efabad42a7c3218ec92fac02d6e116b3f04ca8e40eeff2cc); the run 2026-11-15T21:27:40Z to 2026-11-15T21:38:11Z by its transcript, 64 calls (Read 36, Grep 24, Glob 3, SubagentHandback 1), none errored, model claude-opus-5-5; it writes nothing; received at 2026-11-15T21:38:11Z by the custodian's transcript; the report below, byte for byte, from its hand-back of 14733 bytes, sha256 fcca2691aab5424b39217ef8c190ab4b8c7defa511ee44ae9bf23142883b0895, with this note added in its first line), gate architect — cut/lod-tier-tests-own-tier-folder @ f8f931e2ce6c4ba04f4bbc54c6352ae6a8c0c2bb
Verdict: PASS WITH NOTES

There are no Correctness or Evidence findings. The six Documentation findings below must be fixed before the merge, with no re-gate. Each comes with replacement words, and none is the human's wording. Cites are at H unless I name another commit. For the four `engine/tests` suites, `common/mod.rs`, the kernel test and the README, the line numbers are H's. For `engine/src`, `kernel/src` and `engine/tests/lod_tier_root.rs` they are main's, which is B's for each of those files. The form and the directives are on main at 4327a2ee and are cited by section, amendment and item.

**Read note (Observation O1).** The worktree was not clean at H while I read it. At my last read of `engine/tests/common/mod.rs`, lines 139-140 were an empty `if cfg!(windows) { }`. That is M1 applied, presumably the reviewer's observation in progress, because my earlier grep found the `set_var` at line 140. So for the changed lines I relied on `<S>/lodt-326-diff.patch`, where lines 101-103 have the `set_var`. I have no shell, so I did not recompute its sha256. Every other worktree read matched the patch. The reviewer should confirm that the worktree is back to H after its mutations.

## Correctness
None.

## Evidence
None. The mutation observations are the reviewer's (Part 1 item 9). I checked the M1 and M2 design and predictions by reading the code (check 2).

## Documentation (must fix before the merge; WORDS-ONLY; none is the human's wording)

**D1. `kernel/tests/no_generation_in_persisted_artifacts.rs:475-477`.** The sentence "Nothing else in this binary reads `LOCALAPPDATA`" is untrue as worded. `normalize_destination` reads the variable through `roots_from_environment` (`kernel/src/permission/audit/normalize.rs:54-60, 118-128`). In this binary it is reached from `AuditLog::open_for`'s refusal arms (`log.rs:128-154`) and from `append`'s `unwritable` (`log.rs:236-240`). No test outcome depends on it.
- Replacement for that sentence only: `Nothing else in this binary depends on` `` `LOCALAPPDATA` ``: `the audit-log test sets` `` `AUDIT_LOG_ENV` ``, `so its log path never reaches the data directory and the variable is read there only to normalize a path in an error's text; the history and project tests pass their own store roots.`
- Clause check:
  - `AUDIT_LOG_ENV` is set at :532, and `resolve_log_path` returns at `log.rs:344-356`, before `data_dir` at :358. ✓
  - The only other read is through `normalize_destination`, on the error paths named above. ✓ The other environment reads in `kernel/src` are `redaction.rs:130,136`, `grant.rs:103` and `log.rs:344`, none of them `LOCALAPPDATA`. ✓
  - `StepRecorder::new(d.join("store"), …)` is at :875 and `Projects::new(d.join("machine"), …)` at :992. ✓
  - `publish_unguarded` writes no audit record (`kernel/src/publish/mod.rs:627`). ✓

**D2. `engine/tests/common/mod.rs:201-202`, the `inherited_local_app_data` doc.** In T-B's second process the inherited value is the first process's run folder, not the machine-wide root. Off Windows nothing replaces it.
- Replacement: `` `LOCALAPPDATA` `` `as this process inherited it, read before [`` `tier_run_root` ``] `sets its own (on Windows only). For a run that cargo starts it is the machine-wide root a test run must not build under; in T-B's second process it is the first process's own folder.`
- Clause check:
  - It is read at :133, before the `set_var` in the `cfg!(windows)` block at the patch's :101-103. ✓
  - The child inherits the parent's environment (`lod_tier_builder.rs:1759-1777`), which `set_var` changed at the parent's first build. ✓

**D3. `engine/tests/common/mod.rs:208-209`, the wrapper's doc.** "after this process's tier folder exists and `LOCALAPPDATA` points at it" is false off Windows, and false during the preflight's injection.
- Replacement: `The engine's` `` `build_tiers` ``, `called after [`` `tier_run_root` ``], `so that on Windows this process's tier folder exists and` `` `LOCALAPPDATA` `` `points at it unless a test has set another value for an injection (` `` `lod_tier_preflight.rs` `` `). The four LOD suites build through this and not through` `` `spatial_engine::lod::build_tiers` `` `itself;` `` `lod_tier_root.rs` `` `keeps the engine's.`
- Clause check:
  - The wrapper calls `tier_run_root()` at :216, before it delegates at :217. ✓
  - On Windows, the folder is created at :187 and the variable set at the patch's :101-103. ✓
  - The preflight injection is at `lod_tier_preflight.rs:171-177`. ✓
  - The four suites import from common at `lod_tier_builder.rs:59`, `lod_tier_cancellation.rs:29`, `lod_tier_measurements.rs:40` and `lod_tier_preflight.rs:33`. `lod_tier_root.rs:26` keeps the engine's import. ✓

**D4. `engine/tests/common/mod.rs:192`.** "for the rest of the process" ignores the preflight's temporary injection.
- Replacement: after "for the rest of the process", insert `(a test that injects another value puts this one back, as` `` `lod_tier_preflight.rs` `` `does)`.
- Clause check: the restore is at `lod_tier_preflight.rs:174-177`. ✓

**D5. `engine/tests/lod_tier_builder.rs:1687-1688`.** The form's file name is split across the comment continuation as "`LOD-TIER-TESTS-OWN-TIER-FOLDER-` / `PREREGISTRATION.md`". A reader cannot tell whether the trailing hyphen is part of the name, and a grep for the name misses this pointer.
- Replacement: break the line before the name and keep it whole, so line 1687 ends `in its own folder` and line 1688 begins `` (`LOD-TIER-TESTS-OWN-TIER-FOLDER-PREREGISTRATION.md`): ``. The text after it is unchanged.
- Clause check: no clause changes.

**D6. The record, the five lines' Out-of-scope line, its clause "T-A's (2) now checks it end to end".** This goes in the closing amendment, because the five lines are not edited. T-A's (2) (`lod_tier_builder.rs`, the `assert_eq!` after `drop_tiers` in T-A) would still pass if `lod::tier_directory` read `LOCALAPPDATA` directly, bypassing `app_dirs`. So it proves the Windows row end to end, not port-2's §1 claim 3 that one boundary decides. That claim itself holds: `app_dirs.rs:91-115`, `lod.rs:1169-1180` and `lod_tier_root.rs`'s recorded mutation M5 at :75-79 support it.
- Words for the closing amendment: `The Out-of-scope line's "T-A's (2) now checks it end to end" is read as: T-A's (2) checks from` `` `build_tiers` `` `that on Windows a build's tier root is the process's` `` `LOCALAPPDATA` `` `(app_dirs.rs's Windows row); that no second place decides the root stays proven by` `` `engine/tests/lod_tier_root.rs` `` `'s M5 and app_dirs.rs's unit tests, which this piece leaves unchanged.`
- Clause check:
  - T-A's (2) compares against `tier_run_root().join(LOD_TIER_ROOT).join(hash)`, which on Windows is the `LOCALAPPDATA` that `tier_run` set. ✓
  - M5 is at `lod_tier_root.rs:75-79`. ✓
  - The app_dirs tests are at `app_dirs.rs:142-279`. ✓
  - The diff touches neither file. ✓

## Observations (no action required)
- **O2. Sweep orphan (`common/mod.rs:182-184`).** The lock file is removed even when `remove_dir_all` of the folder failed, for example on a file held by another process. That folder then drops out of every later sweep, which reads `.lock` files only (:172). The Change line's "a later run removes a finished run's folder" holds in ordinary use. A follow-up could remove the lock only when the folder is gone (`Ok`, or `NotFound`).
- **O3. pid-reuse window (`common/mod.rs:160-166, 175-183`).** If a new run gets the same pid while another run's sweep holds that `.lock`, the new run's `expect("take this run's lock")` panics. The window is microseconds. Noted only.
- **O4. M1 wording.** The form's M1 names `common::tier_run_root`, but the `set_var` sits in `tier_run` (:130-148), which `tier_run_root` calls. The recorded-mutation comment at `lod_tier_builder.rs:1707` names `tier_run` correctly.
- **O5. Kernel guard.** The kernel test uses a guard type, not OPEN-8 (A)'s inline window (Amendment 1 item 2's table records it). It also restores on unwind. It is inside Scope, and §A lets the five lines govern.
- **O6. Floor volume.** The 5 GB floors now read the run folder's volume (OPEN-3 (A), in Scope). The assertion's expression is unchanged and its property, room where the ladder is built (LOD form I6), is the same. Later LOD-RESULTS rows should name the tier volume. The harness already prints the directory (`lod_tier_measurements.rs`, `wall_time_arm_s_and_arm_p_over_polygons_100k`'s first `println!`).
- **O7. Stale sentence outside the diff.** `lod_tier_preflight.rs:67` ("needs nothing from the other two") now sits beside `mod common;`. It is still true of the source fixture. Not in the diff.

## The checks
1. **Change line.** Holds clause by clause.
   - Per-run folder: the engine uses `CARGO_TARGET_TMPDIR/lod-tier-runs/<pid>` (common:134-136) and the kernel uses `CARGO_TARGET_TMPDIR/kernel-lod-tier-run-<pid>` (:422-423). Each is owned by its process: the lock at common:160-166 and the guard at kernel:415-440.
   - Set once, before the first build: through the `OnceLock` (:131-132), reached by every build through the wrapper (:216) and by every path site (`lod_tier_builder.rs:91, 1150, 1440, 1544, 1607, 1670`; cancellation:37; measurements:76).
   - Product resolution unchanged: the numstat names no `engine/src` or `kernel/src` file.
   - Machine-wide folder: no test reaches it. `lod_tier_root.rs` cannot resolve a root, and the `kernel/src/skp.rs:2739-2745` test is refused at `lod.rs:1018`, before `tier_directory` at :1028, the root's only reader.
   - Later-run removal: common:175-184, with O2 noted.
   - Three new tests: `lod_tier_builder.rs:1719`, T-B and the child half.
2. **Tests and mutations.**
   - T-A (1) and (2) each fail when false; (1) fails under M1.
   - T-B (1) to (4) each fail when false. Under M1 the child's `clear_tier_directory` clears its own run path, then reuses the parent's set in the shared hash folder and drops it, so (2) fails, as predicted. Under M2 the child's sweep removes the parent's live folder, so (2) fails, as predicted.
   - T-B's order comes from `Command::output()` alone, with no sleep, timer or timing window. The child half returns at once without the variable.
   - The recorded-mutation comments at `lod_tier_builder.rs:1707-1711` and before T-B say what the worker's report records was observed at 36c12ff2.
   - N5 holds: no expected value changed (O6 noted).
3. **P-0 (b), the advisor's wording (Amendment 1 item 1, matching ADV-2026-11-15-18 item 2's fence).** Holds clause by clause.
   - The four suites' `spatial_engine::lod` imports have no `build_tiers` (builder:41-46, cancellation:24-26, measurements:34-37, preflight:30), and each imports it from common.
   - The only call is common:217.
   - `lod_tier_root.rs` is unchanged: it imports at :26, sets a relative value at :104-111, and is refused at `lod.rs:1028`, before any write.
   - The remaining mentions are comments, not calls: builder:674 and :1386, measurements:15, preflight:138.
   - No other file under `engine/tests` names `build_tiers`.
4. **§C (term (c)).** The sentence holds. The reports' statements hold against the code:
   - `data_dir` has three callers: `log.rs:358`, `session_history.rs:249` and `store.rs:57`.
   - `default_root` and `projects_root` are called only by the shell.
   - The kernel binary reaches `open_for` once, with `AUDIT_LOG_ENV` set (:532-533), and passes explicit roots (:875, :992).
   - `user_data_dir`'s only caller is `log.rs:378`. Nothing under `engine/src` reads it.
   - D1 is the one wording gap.
5. **Scope.** These changed lines are not named in their file's Scope entry. They go to the advisor:
   - `engine/tests/common/mod.rs:4-7`, the module doc's list of the suites;
   - `engine/tests/common/mod.rs:25` and `:78`, the two `#[allow(dead_code)]` (N3 names them, the Scope line does not);
   - `engine/tests/common/mod.rs:112-114`, `generations_performed`'s doc, three to four;
   - `engine/tests/lod_tier_preflight.rs:10-11`, the module doc.
   All four are consequences of preflight's `mod common;`. Every other line is inside its file's entry.
6. **Out-of-scope.** Holds item by item.
   - ADR: none. ADR-018's cancellation path is untouched, and the cancellation test changes only at :24-29 and :37.
   - Security: writes stay in the cargo target and the existing scratch directories.
   - Wire: none.
   - Guarantee: holds, with D6.
   - Dependency: std only. Exposure: none. Strings a user sees: none.
   - No accepted ADR is made untrue.
7. **Comments and doc lines.**
   - Hold: the module docs (common:4-7, preflight:7-11); the cancellation paragraph (:7-11); `drop_tiers` (builder:476-477); the T6 comment (builder:980-983); both floors' docs (builder:1367-1368, measurements:58-59); T-A's, T-B's and the child's docs; the recorded-mutation comments; the README entry, whose 36c12ff2 pointer resolves because the form exists at B.
   - Fail: D1 to D5.
8. **Run 6.** The reading holds. Rows 44 and 45 of the clippy node's Windows read are `renderer/src/canonical.rs` and `style.rs`. The architect's draft places them in its 12d row with rows 27-32. Rows 24 and 25, the one-time warnings in `lod_tier_measurements.rs`, carry `#[allow]` at :257 and :491.
   - Because the renderer lib failed, the `-D` run could not lint the kernel targets that depend on it. "None in a changed file" therefore rests on the run without `-D`.
   - The worker's `-D` run reported no error for the engine-lib `enum_variant_names` warning that the run without `-D` reported. The records do not explain this. The reviewer's clippy runs settle it.
   - ADV-2026-11-15-21 is not on main, so I did not read it.
9. **Size and time.** No extra line goes beyond the piece's purpose. The excess is the lock and sweep, the guard type, T-B's four assertions, the floor docs and the formatter. The totals check: 423 = 357 + 66, and the C3 delta is 14.
10. **The window.** No recorded result rests on the 17:09:05Z-17:35:14Z cold build. Only P-0 (d)'s compile fact ran in it. M1, M2 and runs 4 to 6 ran from 19:20Z to 20:03Z (Amendment 2 item 6).
11. **The packet's flags.**
    - 1: holds (check 3).
    - 2: holds, with D1.
    - 3: the lines in check 5.
    - 4: check 10.
    - 5: check 8.
    - 6: check 9.
    - 7: the code matches N9 (T-A and T-B are ignored off Windows; the child half carries `#[ignore]` on every platform at builder:1814). The CI lines come from the worker's report; I did not read CI.
    - 8: the folder lists are the worker's evidence; I did not read them.
    - 9: I re-read the packet as a locator only.