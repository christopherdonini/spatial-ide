# Wave 3, W3-B (one batch: W3-A+W3-B+W3-C): the session's report

**Source:** session_01DmBGvV5LCpMZepxrs5Rmb2, the final assistant turn (the page's timestamp 2026-09-30T08:11:27Z), after the human's lens authorisation (`state/cloud/wave3/W3-B-lens-authorisation.md`). Copied at 2026-09-30T08:27:31Z (the saved copy's write time) with the message's own Copy action in claude.ai/code, and saved with LF line endings: 192 lines, sha256 3f413dc6bb8806568dda9d77684bc08ebda78d5c9fef6f7d35056d7ed8347f2a. Everything between the two rules below is the session's text, verbatim. The WAVE3 REPORT proper begins at `# WAVE3 REPORT`, and the lines above it are the same turn's progress narration. The custodian fields follow the second rule. They are filled locally at triage, per `state/cloud/wave1-prompts.md` §3, carried into wave 3 by `state/cloud/wave3-prompts.md` §1. The saved text scans clean under the profile-path scanner's `--message` mode.

---

Confirmed — the session checkout stays on main at 3212bfe (later than cf86d60), with everything else at a023546. Now I'll wait for the Rust workspace tests and src-tauri check to finish.

Meanwhile, collecting the ignored-test inventory from source (the run's own output will confirm it).

The Rust workspace tests and the src-tauri `cargo check` are both still running. Standing by for the monitor.

`cargo check` on src-tauri now passes (exit 0) with four packages installed; appindicator was not needed. Now running `cargo test` on src-tauri.

Both remaining runs, src-tauri `cargo test` and the workspace tests, are still in progress. Standing by.

Workspace tests: exit 0, with 777 passed, 0 failed and 54 ignored. Now extracting the ignored list with reasons, and checking what the run left in the tree.

Three ignored tests print no reason. Checking their source to see whether they are platform-conditional.

The D-4 fix is present at baseline, and the workspace run left no stray files. Now waiting for src-tauri `cargo test`.

The src-tauri `cargo test` is still compiling. Standing by for the notification.

The test failure was just "no space left on device," a disk limit issue rather than a code problem. I'll clear out old build artifacts to free space and re-run the tests.

Deleted the workspace's ignored `target/` (9.8 GB; its results are already recorded) and re-running src-tauri `cargo test`. Standing by.

All four steps are green. Last checks: whether the one Linux-only warning would matter under CI's flags, and whether it is already recorded.

# WAVE3 REPORT

On Linux at the baseline, every step builds and passes. The Rust workspace had 0 failures. The Tauri shell compiled and passed its tests off Windows for the first time, after I installed four WebKitGTK-related packages in the container. The only failures along the way were environment gaps: missing system packages and a full disk. I found nothing that needs a product source change and triggered no stop condition.

## Worker fields
Item: WAVE3 (Linux L1 baseline)     Lens/purpose: what builds and passes on Linux at the baseline, and what `frontends/shell/src-tauri` needs to compile there.
Baseline SHA: a02354677d6c03aaed4b2dbdf4d14b09621d5766 (confirmed by `git -C /tmp/wave3-baseline rev-parse HEAD` at start; the worktree was created with `git worktree add /tmp/wave3-baseline a023546…`, exit 0)
Branch: none   Commits: none
Environment:
- **OS:** Ubuntu 24.04.4 LTS (container), x86_64, 4 CPUs, 15 GB RAM.
- **Rust:** rustc 1.94.1, cargo 1.94.1.
- **Node and npm:** Node v22.22.2. The container's default npm is 10.9.7, below the npm 11+ the repo requires. All npm steps therefore ran under **npm 11.20.0**, taken as a tarball from registry.npmjs.org, unpacked to `/opt/npm11` and run on Node 22.22.2. Node 24, which CI pins, was not available.
- **Network used:** crates.io, registry.npmjs.org, and Ubuntu's apt archives.
- **Directive:** `state/directives/PORTABILITY-2026-09-30.md` is not in the baseline. On the human's instruction I read it from the session checkout on main (3212bfe, which is later than cf86d60).

Commands run (all in `/tmp/wave3-baseline`):

| # | Command | Exit | Result |
|---|---|---|---|
| 1 | `cargo test --workspace --no-fail-fast` | 0 | 777 passed, 0 failed, 54 ignored, across 87 test result blocks |
| 2a | `renderer/bundle-viewer`: `npm ci` | 0 | |
| 2b | `renderer/bundle-viewer`: `npm run typecheck` | 0 | |
| 2c | `renderer/bundle-viewer`: `npm run build` | 0 | |
| 2d | `renderer/bundle-viewer`: `npm test` | 0 | 80 passed, 0 failed, 0 skipped |
| 3a | `frontends/shell`: `npm ci` | 0 | |
| 3b | `frontends/shell`: `npm run typecheck` | 0 | Its `pretypecheck` runs `cargo metadata` over src-tauri, downloading crates |
| 3c | `frontends/shell`: `npm run build` | 0 | |
| 3d | `frontends/shell`: `npm test` | 0 | Its `pretest` builds first; 72 files, 1092 passed, 0 failed, 0 skipped |
| 4a | `src-tauri`: `cargo check`, no packages added | 101 | `gdk-sys` needs `gdk-3.0` |
| 4b | `apt-get install libgtk-3-dev`, then `cargo check` | 0, then 101 | `soup3-sys` needs `libsoup-3.0` |
| 4c | `apt-get install libsoup-3.0-dev`, then `cargo check` | 0, then 101 | `javascriptcore-rs-sys` needs `javascriptcoregtk-4.1` |
| 4d | `apt-get install libjavascriptcoregtk-4.1-dev`, then `cargo check` | 0, then 101 | `webkit2gtk-sys` needs `webkit2gtk-4.1` |
| 4e | `apt-get install libwebkit2gtk-4.1-dev`, then `cargo check` | 0, then **0** | 1 warning (Finding 1) |
| 4f | `src-tauri`: `cargo test`, first run | 101 | `No space left on device (os error 28)` (details below) |
| 4g | `rm -rf /tmp/wave3-baseline/target`, then `src-tauri`: `cargo test` | **0** | 59 passed, 0 failed, 0 ignored (57 lib, 0 main, 2 `sole_caller_scan`, 0 doc) |

Every `apt-get install` used `-y --no-install-recommends`, after `apt-get update` (exit 0). No `tauri build` was run and the app was never launched.

## Counts

**Step 1, Rust workspace: 777 passed, 0 failed, 54 ignored.** This matches §1b's 54 ignored; passed is 777 now against 742 in W2-D.

- **Ignored off Windows, 14 tests.** Each is `cfg_attr(not(windows), ignore = "needs the Windows-only LOD tier root (%LOCALAPPDATA%)")`.
  - `engine/tests/lod_tier_builder.rs`, 11 tests:
    - `a_build_measures_the_largest_single_feature_simplify`
    - `a_stale_tier_batch_cannot_exist_without_the_stale_label`
    - `a_tier_altered_on_disk_is_not_reused_and_the_disclosure_is_the_on_disk_size`
    - `engine_opens_its_own_tier`
    - `the_built_sets_size_is_disclosed_with_the_tiers`
    - `tier_build_emits_zero_invalid_polygons`
    - `tier_is_not_served_when_source_content_hash_changes`
    - `tier_larger_than_its_source_is_refused`
    - `tier_preserves_identity_for_every_row`
    - `tier_writer_does_not_reorder_rows`
    - `wkb_writer_round_trips_the_first_tier_written`
  - `engine/tests/lod_tier_cancellation.rs`: `cancel_observed_within_the_declared_ceiling`
  - `engine/tests/lod_tier_preflight.rs`: `the_preflight_refuses_before_the_first_tier_is_written`
  - `kernel/tests/no_generation_in_persisted_artifacts.rs`: `a_built_lod_tier_sets_manifest_and_tier_files_carry_no_generation_substring`
- **Ignored on every platform, 40 tests.** Each is a plain `#[ignore…]` with no platform condition.
  - **Measurement and scale harnesses, 21 tests.** Reasons are all of the form "measurement pass/harness … release-only" or "reads the 5 GB fixture":
    - `first_batch_factorial`: 5 tests
    - `import_layout_factorial`: 2
    - `lod_tier_measurements`: 4
    - `scale_pass`: 2
    - `query_window_attribution`, `indexed_budgets`, `slice_budgets`, `scale_pass_a6`, `cancel_rescore`: 1 each
    - `lod_tier_builder::the_5gb_ladder_under_disk_discipline`
    - `lod_tier_cancellation::cancel_observed_within_the_declared_ceiling_at_5gb`
  - **Correctness passes at scale, 4 tests.** Reasons say "correctness pass; run explicitly with --release":
    - `import_layout_5gb_digest`
    - `import_layout_digest`
    - `import_layout_publish_determinism`
    - `lod_tier_builder::two_concurrent_callers_of_an_absent_fixture_both_get_the_complete_file`. Its reason text embeds a `C:\dev\spatial-ide\…` path; the code uses a non-Windows path off Windows (`engine/tests/common/mod.rs:18-26`).
  - **Fixture generators, 12 tests:**
    - `manual_walkthrough_fixtures`: 9
    - `import_layout_fixtures`: 1
    - `import_layout_5gb_fixtures`: 1
    - `regenerate_fixture`: 1
  - **Corpus, 1 test:** `admission_p4_corpus`, which opens on-disk fixtures.
  - **No reason string, 3 tests.** The run prints no reason for these (Finding 2):
    - `kernel/tests/permission_boundary.rs:978` `an_adr_025_reader_ceiling_refusal_at_preflight_produces_no_audit_record`
    - `kernel/tests/publish.rs:600` `a_dataset_whose_verified_row_count_exceeds_max_features_refuses_at_preflight_before_any_write`
    - `kernel/tests/publish.rs:656` `a_dataset_whose_verified_row_count_exceeds_max_features_refuses_before_any_hash_is_taken`
- **Against R6:**
  - The 14 off-Windows reasons name the mechanism ("the Windows-only LOD tier root (%LOCALAPPDATA%)"). They do not use §2's boundary label ("Application directories", `engine/src/lod.rs`). Whether that counts as naming the boundary is the custodian's call.
  - No off-Windows ignore lacks a reason.
  - The 3 tests with no reason are all-platform ignores, not platform ignores.

**Step 2, shell frontend (`frontends/shell`), under Node 22.22.2 and npm 11.20.0:**
- `npm ci` 0, `typecheck` 0, `build` 0, `test` 0.
- vitest: 72 files, 1092 tests passed, 0 failed, 0 skipped.
- `npm ci` warned: "esbuild@0.25.12 (postinstall) not yet covered by allowScripts". The build succeeded anyway.

**Step 3, bundle viewer (`renderer/bundle-viewer`), same versions:**
- `npm ci` 0, `typecheck` 0, `build` 0, `test` 0.
- `node --test`: 80 passed, 0 failed, 0 skipped.
- Same esbuild allowScripts warning, for esbuild@0.28.2.

**Step 4, Tauri shell (`frontends/shell/src-tauri`):**
- `cargo check`: failed 4 times, one missing system library each, then exit 0.
- `cargo test`: exit 0 on the second run. 59 passed, 0 failed, 0 ignored.

## Linux packages for src-tauri

Distribution: Ubuntu 24.04.4 LTS (noble). Each package is listed in the order it was found necessary, with the `cargo check` error that required it:

| # | Package | Version | Required by | apt pulled in |
|---|---|---|---|---|
| 1 | `libgtk-3-dev` | 3.24.41-4ubuntu1.3 | `gdk-sys v0.18.2`, which needs `gdk-3.0` | 72 new, 14 upgraded |
| 2 | `libsoup-3.0-dev` | 3.4.4-5ubuntu0.8 | `soup3-sys v0.5.0`, which needs `libsoup-3.0` | 13 new, 1 upgraded |
| 3 | `libjavascriptcoregtk-4.1-dev` | 2.52.6-0ubuntu0.24.04.1 | `javascriptcore-rs-sys v1.1.1`, which needs `javascriptcoregtk-4.1` | 3 new |
| 4 | `libwebkit2gtk-4.1-dev` | 2.52.6-0ubuntu0.24.04.1 | `webkit2gtk-sys v2.0.2`, which needs `webkit2gtk-4.1` | 49 new, 1 upgraded |

- `pkg-config` (1.8.1) was already present.
- An appindicator package was **not** needed for `cargo check` or `cargo test`, even though `libappindicator-sys` is in `src-tauri/Cargo.lock`.

**Catalogued failures.** All four `cargo check` failures (4a to 4d) and the first `cargo test` (4f) are classified as **Linux build environment gaps**. The first `cargo check` error in full:

```
error: failed to run custom build command for `gdk-sys v0.18.2`
...
  The system library `gdk-3.0` required by crate `gdk-sys` was not found.
  The file `gdk-3.0.pc` needs to be installed and the PKG_CONFIG_PATH environment variable must contain its parent directory.
```

The first `cargo test` failed because the container's writable-disk allowance ran out. The two target directories held 17 GB (src-tauri) and 9.8 GB (workspace). The first error in full:

```
error: failed to build archive at `/tmp/wave3-baseline/frontends/shell/src-tauri/target/debug/deps/libspatial_ide_shell_lib.a`: No space left on device (os error 28)
```

Findings: 2

### Finding WAVE3-1
Claim: On Linux, compiling `spatial-engine` emits `warning: constant WATCH_BUFFER_BYTES is never used` (`engine/src/watch.rs:71`), because its only users are inside `#[cfg(windows)] mod windows_watch` (`engine/src/watch.rs:102-104, 214, 242`).
Suggested severity: S3
Code path: `engine/src/watch.rs:71` (`pub(crate) const`, unconditional) → used only in `windows_watch`, which is `#[cfg(windows)]` at line 102.
Reproducer: `cd frontends/shell/src-tauri && cargo check` (exit 0) prints the warning. It also appears twice in the `cargo test --workspace` log.
Guarantee violated: none stated. It does not fail today, because `product-ci-rust.yml` and `product-ci-shell.yml` set no `-D warnings`, `RUSTFLAGS` or clippy (grep found none). It would fail if PORT-1's Linux job ran with warnings denied. `watch.rs` is a declared boundary file under §2, so this is not R4 coupling.
Evidence: the warning text, observed verbatim in the step 4 logs and twice in the step 1 log.
False-positive check: `WATCH_BUFFER_BYTES` and "never used" appear in none of KNOWN-LIMITATIONS.md, PLAN.yaml or state/cloud/wave1/D.md. It is not one of D-1 to D-4.
Confidence: proven

### Finding WAVE3-2
Claim: 3 of the 40 all-platform-ignored workspace tests use a bare `#[ignore]` with no reason string, so `cargo test` prints them with no reason in the ignored list that R6 has each CI run print.
Suggested severity: S3
Code path: the three bare `#[ignore]` lines:
- `kernel/tests/permission_boundary.rs:978`
- `kernel/tests/publish.rs:600`
- `kernel/tests/publish.rs:656`

Each has its reason only in the doc comment above it (release-only; "not run in CI").
Reproducer: `cargo test --workspace --no-fail-fast` prints `test <name> ... ignored` with no text after it for these three, and only these three.
Guarantee violated: R6 ("Each CI run prints the platform's ignored list"), in spirit only. R6's naming rule targets platform ignores, and these are all-platform.
Evidence: the ignored-list extraction from the step 1 log.
False-positive check: they are ignored on every platform, so they are not Linux gaps. I found no record of them in D.md's D-1 to D-4.
Confidence: proven

### Unproven observations (not findings; at most five, one line each)
- `src-tauri` needed about 17 GB of debug `target/` next to the workspace's 9.8 GB; a CI runner with a small disk may hit the same os error 28 in PORT-3.
- Nothing was run under Node 24 (CI's pin), only Node 22.22.2 with npm 11.20.0.
- `libappindicator-sys` appears to load its library at runtime, so a tray feature might still need an appindicator package at L2; this was not tested.
- The 14 off-Windows ignores were not run under `--ignored` on Linux; they presumably fail via `engine.lod_tier_root_unresolved`.

### Stops (if any): none

**Housekeeping and deletions:**
- **Repository:** I edited no repository file and made no commits. `git status --porcelain --untracked-files=all` is empty. I deleted `/tmp/wave3-baseline/target/` (9.8 GB, git-ignored) after step 1's results were captured, to free disk. Left in place, all git-ignored: `node_modules/`, `dist/`, `frontends/shell/src/generated/`, `frontends/shell/src-tauri/target/`. The worktree itself stays at `/tmp/wave3-baseline`.
- **Container only:** I installed the four apt packages and their dependencies, and unpacked `/opt/npm11`. My first attempt, `npm install -g npm@11` (exit 2, `Cannot find module 'promise-retry'`), aborted partway and may have left the container's global npm 10.9.7 partly damaged. That npm was not used afterwards.

---

## Custodian fields (filled locally, never by the worker)

(Filled at triage, after the batch ends.)
