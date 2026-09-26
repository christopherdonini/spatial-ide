# Wave 1, D (batch 2: C+D): the session's report

**Source:** session_018eVthFaJ2kpLGx5Xg3YhFM, the final assistant turn, copied at 2026-09-26 about 00:17Z with the message's own Copy action in claude.ai/code, and saved with LF line endings. Everything between the two rules below is the session's text, verbatim. The WAVE1 REPORT proper begins at `# WAVE1 REPORT`; the lines above it are the same turn's progress narration. The custodian fields follow the second rule. They are filled locally, per `state/cloud/wave1-prompts.md` §3.

---

Found 11 failures in `lod_tier_builder.rs`, all tied to the Windows-only `LOCALAPPDATA` tier root, which halted `cargo test` at that target. I'm rerunning the full workspace with `--no-fail-fast` to catalogue any remaining issues.

The reruns of the failing test targets are taking longer than expected. Running `-p` on its own changes feature unification, which probably forces DuckDB to recompile. I'll wait for them.

All failures are the same on both reruns. Next: listing the ignored tests and running the Tauri `cargo check`.

Now the optional Tauri `cargo check` (system packages already installed).

The Tauri check is still running; it has to compile DuckDB again in its own target directory. Waiting for it to finish.

Waiting on the Tauri `cargo check`; the report follows when it completes.

# WAVE1 REPORT
## Worker fields
**Item:** not named in the brief; filling it in would be a guess, so I left it blank. **Lens/purpose:** run and catalogue the project's suites on Linux at a fixed baseline. This is evidence only; nothing was fixed.

**Baseline SHA:** `bb98f71f43a2891d317b10a124387df9d5ee0ebf`, confirmed by `git -C /tmp/wave1-baseline rev-parse HEAD` at the start.

**Branch:** none. **Commits:** none. `git status --short` in the worktree shows 0 changes. The build outputs and one stray fixture (see B-4) are all covered by `.gitignore`.

**Environment:**
- OS: Ubuntu 24.04.4 LTS, kernel 6.18.44, x86_64, 4 cores, 15 GB RAM.
- Toolchain: rustc 1.94.1 (e408947bf 2026-03-25), cargo 1.94.1, node v22.22.2, npm 10.9.7. npm 11.20.0 was also run through `npx`; see C-1.
- Network used: crates.io, the npm registry and the Ubuntu apt repositories only.

**Commands run (all from `/tmp/wave1-baseline`), with exit codes and wall time:**

| # | Command | Exit | Wall time |
|---|---|---|---|
| 1 | `cargo build --workspace` | 0 | 740 s |
| 1 | `cargo test --workspace` | 101 | 103 s (stopped at the first failing target, `lod_tier_builder`) |
| 1 | `cargo test --workspace --no-fail-fast` | 101 | 144 s |
| 1 | Reruns ×2 of each failing target: `cargo test -p spatial-engine --test lod_tier_builder`, `--test lod_tier_cancellation`, `--test lod_tier_preflight`; `-p spatial-kernel --lib`; `-p spatial-kernel --test no_generation_in_persisted_artifacts` | all 101, same results each time | ~20 min, mostly DuckDB recompiling under `-p` feature resolution |
| 1 | `cargo test --workspace -- --list --ignored` | 0 | — |
| 2 | `renderer/bundle-viewer`: `npm ci`, `npm run typecheck`, `npm run build`, `npm test` | 0 / 0 / 0 / 0 | 7 s total; 69 of 69 pass |
| 3 | `frontends/shell`: `npm ci` (npm 10.9.7) | 1, three runs, identical | 2 s |
| 3 | `frontends/shell`: `npm run typecheck`, `npm test` on the failed install | 2 / 2 (no `node_modules`) | — |
| 3 | `frontends/shell`: `npx -y npm@11 ci` | 0 | 13 s |
| 3 | `frontends/shell`: `npm run typecheck`, then `npm test` (its `pretest` runs the Vite/`tsc` frontend build, not the Tauri app) | 0 / 0 | ~81 s combined; 71 files, 1055 of 1055 pass |
| 4 | `apt-get install` of the Tauri Linux prerequisite list, copied from `.github/workflows/adr-003-spike-ci-linux.yml` | 0 | 74 s |
| 4 | `cargo check --manifest-path frontends/shell/src-tauri/Cargo.toml` | 0 | 672 s |

Suite 1 totals (no-fail-fast): 650 passed, 15 failed, 40 ignored. The build produced 0 warnings.

**#[ignore]d tests (40, listed only, not run):**
- **engine/tests:**
  - `admission_p4_corpus::the_p4_admission_table_runs_against_the_preregistered_corpus_and_writes_admission_results`
  - `import_layout_5gb_digest::the_5gb_cross_file_digest_correctness_pass`
  - `import_layout_5gb_fixtures::generate_the_5gb_fixture_set`
  - `import_layout_digest::the_cross_file_digest_correctness_pass`
  - `import_layout_fixtures::generate_the_145mb_fixture_matrix`
  - `lod_tier_builder::{the_5gb_ladder_under_disk_discipline, two_concurrent_callers_of_an_absent_fixture_both_get_the_complete_file}`
  - `lod_tier_cancellation::cancel_observed_within_the_declared_ceiling_at_5gb`
  - `lod_tier_measurements::{the_5gb_ladder_outcomes_o1_to_o4, wall_time_arm_p_over_parcels_5gb, wall_time_arm_s_and_arm_p_over_polygons_100k, wall_time_arm_s_over_parcels_5gb}`
- **kernel/tests:**
  - `cancel_rescore::measure_the_cancellation_rescore`
  - `first_batch_factorial::{cancellation_holds_with_pruning_in_the_path, cancellation_holds_with_pruning_in_the_path_on_h5, the_5gb_clustered_cell, the_5gb_spot_cells, the_factorial_first_batch_pass}`
  - `import_layout_factorial::{the_145mb_factorial_pass, the_5gb_scored_cells}`
  - `import_layout_publish_determinism::adr017_publish_determinism_across_layouts_at_145mb`
  - `indexed_budgets::measure_the_indexed_slice_against_docs_08`
  - `manual_walkthrough_fixtures::{generate_the_100k_happy_path_fixture, generate_the_absent_crs_contradicted_fixture, generate_the_bothneeded_refusing_fixture, generate_the_dupkey_refusing_fixture, generate_the_filter_fixture, generate_the_missing_identity_refusing_fixture, generate_the_no_crs_refusing_fixture, generate_the_over_ceiling_refusing_fixture, generate_the_slow_filter_fixture}`
  - `permission_boundary::an_adr_025_reader_ceiling_refusal_at_preflight_produces_no_audit_record`
  - `publish::{a_dataset_whose_verified_row_count_exceeds_max_features_refuses_at_preflight_before_any_write, a_dataset_whose_verified_row_count_exceeds_max_features_refuses_before_any_hash_is_taken}`
  - `query_window_attribution::the_query_window_attribution_pass`
  - `regenerate_fixture::regenerate_parcels_5gb_fixture`
  - `scale_pass::{measure_publish_at_five_gigabytes, measure_the_five_gigabyte_scale_pass}`
  - `scale_pass_a6::measure_the_registered_rows_that_had_no_instrument`
  - `slice_budgets::measure_the_slice_against_docs_08`

**Findings:** 4

### Finding B-1
**Claim:** 14 default (not ignored) Rust tests fail on Linux because they need `LOCALAPPDATA`, which is not set here. Every rerun failed the same way.

**Category:** platform assumption in code or tests.

**Suggested severity:** S3.

**Tests affected:**
- `spatial-engine --test lod_tier_builder` (11): `a_build_measures_the_largest_single_feature_simplify`, `a_stale_tier_batch_cannot_exist_without_the_stale_label`, `a_tier_altered_on_disk_is_not_reused_and_the_disclosure_is_the_on_disk_size`, `engine_opens_its_own_tier`, `tier_is_not_served_when_source_content_hash_changes`, `tier_larger_than_its_source_is_refused`, `tier_build_emits_zero_invalid_polygons`, `the_built_sets_size_is_disclosed_with_the_tiers`, `wkb_writer_round_trips_the_first_tier_written`, `tier_preserves_identity_for_every_row`, `tier_writer_does_not_reorder_rows`
- `spatial-engine --test lod_tier_cancellation`: `cancel_observed_within_the_declared_ceiling`
- `spatial-engine --test lod_tier_preflight`: `the_preflight_refuses_before_the_first_tier_is_written`
- `spatial-kernel --test no_generation_in_persisted_artifacts`: `a_built_lod_tier_sets_manifest_and_tier_files_carry_no_generation_substring`

**Code path:** the tests call `build_tiers`, which reaches `engine/src/lod.rs:1143` (`std::env::var_os("LOCALAPPDATA").ok_or_else(...)`, a typed refusal `engine.lod_tier_root_unresolved`). Separately, the test helper at `engine/tests/lod_tier_builder.rs:88` does `.expect("LOCALAPPDATA")`, and `engine/tests/lod_tier_cancellation.rs:36` does the same.

**Reproducer:** `cargo test --workspace --no-fail-fast`. Observed output:
```
panicked at engine/tests/lod_tier_builder.rs:675:78: build: LodRefused { refusal: "engine.lod_tier_root_unresolved", detail: "LOCALAPPDATA is not set, so the declared tier root cannot be resolved. …" }
panicked at engine/tests/lod_tier_builder.rs:88:62: LOCALAPPDATA
```

**Guarantee violated:** none for the product. The refusal is the declared behaviour: `engine/LOD-PREREGISTRATION.md:380` says "tier building is Windows-only in this cut … on any other platform the root does not resolve … so every build refuses, fail-closed, typed". The tests, however, are not `cfg(windows)`-gated. `grep cfg(windows|target_os` finds nothing in `lod_tier_builder.rs`.

**Evidence:** 3 identical runs (`--no-fail-fast` plus two reruns): `lod_tier_builder` 3 passed, 11 failed, 2 ignored; the other three targets fail 1 each.

**False-positive check:** this is a known, dated limit for the product. The only new fact is that the default suite goes red on non-Windows. `.github/workflows/product-ci-rust.yml:189` runs only `os: [windows-latest]`.

**Confidence:** proven.

### Finding B-2
**Claim:** `spatial-kernel` lib test `permission::boundary::tests::the_confirmation_phrase_is_the_final_component` fails on Linux, every run.

**Category:** platform assumption in code or tests.

**Suggested severity:** S3.

**Code path:** the test at `kernel/src/permission/boundary.rs:530` asserts `confirmation_phrase(Path::new(r"D:\maps\out")) == "out"`. `confirmation_phrase` (`boundary.rs:498`) uses `Path::file_name()`, and on Unix a backslash is an ordinary filename character, not a separator.

**Reproducer:** `cargo test -p spatial-kernel --lib`. Observed output:
```
assertion `left == right` failed  left: "D:\\maps\\out"  right: "out"
```
Result line: 115 passed, 1 failed. Identical on 3 runs.

**Guarantee violated:** none stated. On Linux the product behaviour, where the whole name is the final component, is arguably correct; it is the test input that is Windows-only.

**Evidence:** as above. The `/a/b/parcels-2026` assertion on the line before passes.

**False-positive check:** the function body has no platform gating, and I found no documentation of this test being Windows-only.

**Confidence:** proven.

### Finding B-3 (reclassified; the worker's own heading was C-1)
**Claim:** `npm ci` in `frontends/shell` fails deterministically with npm 10.9.7 (Node 22) because of a lockfile/`package.json` mismatch. With npm 11.20.0 it succeeds on the same lockfile.

**Category:** environment or setup failure. It depends on the npm version.

**Suggested severity:** S3.

**Code path:** in `frontends/shell/package-lock.json`, `node_modules/vite-node/node_modules/vite` 8.3.0 declares the optional peer `"esbuild": "^0.27.0 || ^0.28.0"` (around line 4021). The top-level `node_modules/esbuild` is 0.25.12 (line 2669). npm 10 reports `Missing: esbuild@0.28.2 from lock file`, plus 26 `@esbuild/*` platform packages.

**Reproducer:**
- `cd frontends/shell && npm ci` gives `npm error code EUSAGE … can only install packages when your package.json and package-lock.json … are in sync … Missing: esbuild@0.28.2 from lock file`. Exit 1 on all 3 runs.
- `npx -y npm@11 ci` exits 0.
- On the npm 11 install, typecheck exits 0 and the tests pass 1055 of 1055.

**Guarantee violated:** only a documented environment contract, loosely. `CLAUDE.md` says "Node LTS"; Node 22 is still an LTS line, and CI (`product-ci-shell.yml:171`) pins Node 24.

**Evidence:** as above. npm 11 printed a warning that `esbuild@0.25.12`'s postinstall was "not yet covered by allowScripts"; the build and tests passed anyway.

**False-positive check:** CI uses Node 24 / npm 11, so CI would not see this. I did not find a documented minimum npm version.

**Confidence:** proven.

### Finding B-4
**Claim:** on Linux the default engine suite writes a 151,812,642-byte file literally named `C:\dev\spatial-ide\target\fixtures\slice-budgets\polygons-100k.parquet` into `engine/`.

**Category:** platform assumption in code or tests. It is a side effect, not a test failure.

**Suggested severity:** S3.

**Code path:** `engine/tests/common/mod.rs:20` sets `POLYGONS_100K = r"C:\dev\spatial-ide\target\fixtures\slice-budgets\polygons-100k.parquet"`, and the regenerate-if-absent helper in that file writes it. On Unix that string is a relative single-component filename, so it lands in the crate's working directory. The same kind of absolute Windows path appears at `lod_tier_builder.rs:60`, `lod_tier_cancellation.rs:31`, `lod_tier_measurements.rs:42` and `admission_p4_corpus.rs:68` (5 GB and corpus paths, used by ignored tests).

**Reproducer:** after `cargo test --workspace`, `ls -la engine/` shows `-rw-r--r-- 151812642 … C:\dev\spatial-ide\target\fixtures\slice-budgets\polygons-100k.parquet`. `git check-ignore` matches it with `.gitignore:24:*.parquet`, so git never sees it.

**Guarantee violated:** none stated.

**Evidence:** the file listing above.

**False-positive check:** the comment at `common/mod.rs:16-17` says the absolute path is deliberate ("shared target directory is not inside a worktree"), but that describes the Windows machine layout. I found nothing that addresses non-Windows hosts.

**Confidence:** proven.

### Unproven observations (not findings)
- `cargo test` without `--no-fail-fast` stops at `lod_tier_builder`, so on Linux the plain command hides the B-2 kernel failure and the other three failing targets.
- Running `cargo test -p <crate>` on its own recompiled DuckDB, presumably because features unify differently than under `--workspace`. That makes reruns slow (~20 min).
- Some shell vitest files (`notices/*`, `streaming/viewportStreamManager.test.ts`, `publish/formatPublishRefusal.test.ts`) mention cargo. During `npm test`, cargo's "Blocking waiting for file lock on package cache" appeared while my background build was running. It had no effect on the results.
- The Tauri crate `cargo check` on Linux passed (exit 0, 672 s) with the webkit2gtk-4.1 packages installed. That is compile-only evidence, and no Tauri app was built.
- The bundle viewer's `test:e2e` script and the shell's `verify` extras (e2e and check scripts) were not run; the brief didn't include them.

### Stops
None triggered. On C-1/B-3, rather than run `npm install`, which would rewrite `package-lock.json`, I used npm 11 through `npx`. That changes no repository file and matches the npm that ships with CI's Node 24. Treat the shell suite result as "passes under npm 11, and `npm ci` fails under npm 10".

**Wall time overall:** about 41 minutes of the session, dominated by the two separate DuckDB compiles (workspace build 740 s, Tauri check 672 s). This is Linux evidence only and says nothing about Windows or product verification.

---

## Custodian fields (filled locally, never by the worker)

Session ID: session_018eVthFaJ2kpLGx5Xg3YhFM   Model: Opus 5.5, Medium (as launched)   Launched/ended: 2026-09-25T23:30:23Z / the report posted by about 00:12Z (2026-09-26). There are no commits: D writes nothing.
Spend: not individually attributable; batch delta $4 for batch 2 (C+D). The readings are in `C.md`'s custodian fields.

**The Item field is blank, and the finding labels are the worker's.** D's prompt, as assembled under deviation 2, never names its item. C's names its branch, and D has none. The worker therefore left Item blank and labelled its findings B-1 to B-4, reclassifying one that it first headed C-1. They are recorded here as D-1 to D-4, in the same order. This is a gap in the custodian's assembly and not the worker's error: §3's Item field has no source in D's own text.

Suite totals (Linux evidence only):
- the Rust workspace: 650 passed, 15 failed, 40 ignored;
- the bundle viewer: 69 of 69;
- the shell: 1,055 of 1,055, after an npm 11 install;
- `cargo check` of the Tauri crate: exit 0, compile-only.

Triage against main (wave-1 rule 1): `engine/tests`, `engine/src/lod.rs`, `kernel/src/permission/boundary.rs` and `frontends/shell/package-lock.json` are unchanged since bb98f71, so every item below is **still-present**.

- **D-1** (the worker's B-1), 14 default tests needing `LOCALAPPDATA`: RECORD, S2.
- **D-2** (B-2), a Windows path literal in `boundary.rs`'s `the_confirmation_phrase_is_the_final_component`: RECORD, S2.
- **D-4** (B-4), a Windows absolute fixture path that writes a 151 MB file named with the literal path into `engine/` on non-Windows: RECORD, S2.
- D-1, D-2 and D-4 are one class: the default Rust suites assume Windows. The product's refusal is declared (`engine/LOD-PREREGISTRATION.md`, tier building Windows-only); the tests' portability is not. They are recorded together as one note for the paused macOS/Linux validation.
- **D-3** (B-3), `npm ci` in `frontends/shell` refused under npm 10.9.7 (Node 22) and succeeding under npm 11: RECORD, S2. The minimum npm version is undocumented, and CI pins Node 24. This confirms A2's watch-point.

Reproduced locally (Windows): not applicable. All four are Linux-only by construction.

Unproven observations:
1. DISCARD, S3: informational. The plain `cargo test` stops at the first failing target.
2. DISCARD, S3: `-p` recompiles DuckDB, a build-time note.
3. DISCARD, S3: a cargo lock contention message with no effect on the results.
4. Kept as evidence, no severity: the Tauri crate checks on Linux with the webkit2gtk-4.1 packages. It is compile-only.
5. DISCARD, S3: the scripts it did not run were outside its brief.
