# Cloud session 5: suite repeatability and clippy on Linux

**Measured, not decided.** This file records what was run and what came back. It proposes clippy fixes
and does not apply any of them. It changes no tracked file and does not touch a gate, a results table or a
`docs/08` budget.

- **Commit measured:** `6b67d44bc242dc1cbc9f73efdbd7cd20e4ecd1f4` (`main`, "Merge pull request #275 …"), fresh
  clone, clean tree.
- **Date:** 2026-11-03 (UTC). Debug series 16:36–17:41, clippy 17:42–17:45, release series 18:00–18:23.
- **Branch carrying this file:** `cloud/suite-linux`. New files only, all under `state/consults/cloud/suite-linux/`.

## 0. Result

1. **`cargo test --workspace`: no test failed in any of the 20 runs.** Ten debug runs and ten release
   runs each exited 0. Every run reported the same 1,044 tests: **965 passed, 0 failed, 79 ignored**.
   Each of the 111 test executables and doc-test groups printed its `test result:` line in every run.
   No binary crashed, timed out or went unreported. **The list of tests that did not pass every run is
   empty**, so §2.1 has no rows: there is no failure text to quote, no run number to give and no
   source span to cite.
2. **`cargo clippy --workspace --all-targets -- -D warnings` exits 101.** It stops after six
   errors in two library crates: `spatial-engine` (lib) with 4 and `spatial-renderer` (lib) with 2.
   Every crate and target that depends on either one, which is all of `spatial-kernel` and all of
   both crates' test targets, is never checked by that command. Run without `-D warnings` so that
   every target gets checked, clippy reports **48 distinct diagnostics**: 45 clippy lints and 3
   rustc `dead_code` warnings, in `engine/`, `kernel/` and `renderer/`. `protocol/skp` and
   `protocol/data-plane` have none. §3 lists every one with its span and a proposed smallest fix.
3. **Three of the 48 exist because this is Linux** (§3.3). They are `dead_code` on items whose only
   readers are compiled under `#[cfg(windows)]`. In the other direction, clippy on Linux checks no
   `#[cfg(windows)]` code at all, so this list says nothing about the lint state of Windows-only code.

## 1. What was run, exactly

### 1.1 Machine and toolchain

| | |
|---|---|
| OS | Ubuntu 24.04 (`/etc/os-release`), x86_64, Linux kernel 6.18.44 |
| CPU / memory | 4 vCPU, "Intel(R) Xeon(R) Processor @ 2.10GHz" (`/proc/cpuinfo`), 16 GB RAM, no swap. A cloud container, shared host. |
| Rust | rustc 1.97.0 (2d8144b78 2026-07-07), cargo 1.97.0 (c980f4866 2026-06-30), clippy 0.1.97 (2d8144b788 2026-07-07), host `x86_64-unknown-linux-gnu` |
| C/C++ (vendored DuckDB) | gcc/g++ 13.3.0 (Ubuntu 13.3.0-6ubuntu2~24.04.1) |

### 1.2 Commands

From the repository root, in this order, one at a time:

| step | command | exit |
|---|---|---|
| build (debug) | `cargo test --workspace --locked --no-run` | 0 (11m03s wall) |
| debug runs 1–10 | `cargo test --workspace --locked --no-fail-fast` | 0, all ten |
| clippy, as asked | `cargo clippy --workspace --all-targets -- -D warnings` | **101** (17.4 s wall) |
| clippy, enumeration | `cargo clippy --workspace --all-targets --message-format=json`, then the same command without `--message-format` for the human-readable text | 0, 0 |
| free disk | `rm -rf target/debug/deps target/debug/incremental target/debug/examples` | 0 |
| build (release) | `cargo test --workspace --locked --release --no-run` | 0 (15m13s wall) |
| release runs 1–10 | `cargo test --workspace --locked --no-fail-fast --release` | 0, all ten |

**Two flags differ from the literal task command, and neither changed what ran:**

- **`--locked`** makes cargo refuse to rewrite `Cargo.lock`, which honours the task's "change no
  tracked file". CI passes the same flag (`.github/workflows/product-ci-rust.yml`). The lockfile was
  already current, since the `--locked` build succeeded, so the flag changed nothing that was built.
- **`--no-fail-fast`** makes cargo keep going past a failing test binary. Without it, one failing
  binary hides the outcome of every binary after it in that run, and "passed every run" could not
  be decided for those tests. No binary failed in any run, so the twenty runs executed exactly what
  the literal command would have executed.

Each run had a 75-minute ceiling (`timeout 4500`), and no run came near it. `git status --porcelain`
was recorded after every run. It was **empty** after debug runs 1–10 and release runs 1–2. After
release runs 3–10 it held exactly one line, `?? state/consults/cloud/`. That line is **this
report's own directory**, which this session created at about 18:06 UTC, during release run 3. No
run modified a tracked file or created an unignored file of its own.

### 1.3 Conditions a reader should know

- **Shared fixture state.** The suite writes fixtures under `target/fixtures/`, which persists from
  run to run and is shared by both profiles. Debug run 1 started from a fresh clone with no
  `target/`. Every later debug run, and the whole release series, found the fixtures from earlier
  runs already present. One visible trace: `spatial-engine [tests/lod_tier_builder.rs]` reported
  18.54 s in debug run 1 against 6.39–7.16 s in debug runs 2–10. That fits the generate-on-first-use
  path in `engine/tests/common/mod.rs` (`polygons_100k()`), but this session did not establish the
  cause. The release series therefore never exercised the absent-fixture path.
- **Default test parallelism.** Cargo runs test binaries one at a time, and libtest runs the tests
  inside a binary in parallel at its default thread count (4 here). Nothing was pinned or
  serialised.
- **Load on the machine during runs.** No build, test or clippy job overlapped a run. During the
  runs, the only other activity was this session's own light shell work: reading source and logs
  (`grep`, `sed`, log parsing), plus, during release run 3, `git switch -c cloud/suite-linux`,
  `git config core.hooksPath .githooks` and writing this report's draft. A throwaway scratch crate
  outside the repository (§3.4, §3.5) was built while the release *build* ran, before release run 1.
- **Durations are context, not measurements.** The wall times in this file come from one shared
  cloud machine and are not `docs/08` measurements. They support no performance claim.

## 2. Repeatability

### 2.1 Tests that did not pass every run

**None.** Across 20 runs, every one of the 965 non-ignored tests reported `ok` in every run. The
parse that backs this treats a test as "not passing" in a run if its line is `FAILED`, if it has no
line in that run's log, or if its binary printed no `test result:` line. Zero tests met any of
those conditions in any run. The per-test, per-run matrix is `outcomes.tsv`.

| test | failure text | runs | source span |
|---|---|---|---|
| *(no rows)* | | | |

### 2.2 Per-run totals

| profile | run | start (UTC) | wall s | exit | passed | failed | ignored | tree changed |
|---|---|---|---|---|---|---|---|---|
| debug | 1 | 2026-11-03T16:36:28Z | 396 | 0 | 965 | 0 | 79 | no |
| debug | 2 | 2026-11-03T16:43:04Z | 397 | 0 | 965 | 0 | 79 | no |
| debug | 3 | 2026-11-03T16:49:41Z | 397 | 0 | 965 | 0 | 79 | no |
| debug | 4 | 2026-11-03T16:56:18Z | 406 | 0 | 965 | 0 | 79 | no |
| debug | 5 | 2026-11-03T17:03:04Z | 394 | 0 | 965 | 0 | 79 | no |
| debug | 6 | 2026-11-03T17:09:38Z | 388 | 0 | 965 | 0 | 79 | no |
| debug | 7 | 2026-11-03T17:16:06Z | 391 | 0 | 965 | 0 | 79 | no |
| debug | 8 | 2026-11-03T17:22:37Z | 379 | 0 | 965 | 0 | 79 | no |
| debug | 9 | 2026-11-03T17:28:56Z | 379 | 0 | 965 | 0 | 79 | no |
| debug | 10 | 2026-11-03T17:35:15Z | 391 | 0 | 965 | 0 | 79 | no |
| release | 1 | 2026-11-03T18:00:56Z | 132 | 0 | 965 | 0 | 79 | no |
| release | 2 | 2026-11-03T18:03:08Z | 134 | 0 | 965 | 0 | 79 | no |
| release | 3 | 2026-11-03T18:05:22Z | 136 | 0 | 965 | 0 | 79 | own report dir (see below) |
| release | 4 | 2026-11-03T18:07:38Z | 133 | 0 | 965 | 0 | 79 | own report dir (see below) |
| release | 5 | 2026-11-03T18:09:51Z | 133 | 0 | 965 | 0 | 79 | own report dir (see below) |
| release | 6 | 2026-11-03T18:12:04Z | 136 | 0 | 965 | 0 | 79 | own report dir (see below) |
| release | 7 | 2026-11-03T18:14:20Z | 134 | 0 | 965 | 0 | 79 | own report dir (see below) |
| release | 8 | 2026-11-03T18:16:34Z | 136 | 0 | 965 | 0 | 79 | own report dir (see below) |
| release | 9 | 2026-11-03T18:18:50Z | 137 | 0 | 965 | 0 | 79 | own report dir (see below) |
| release | 10 | 2026-11-03T18:21:07Z | 137 | 0 | 965 | 0 | 79 | own report dir (see below) |

Totals are summed over every `test result:` line in that run's log. "Own report dir" means the
single `?? state/consults/cloud/` line described in §1.2, which is not a test's doing.

### 2.3 What the result does not cover

- **The 79 ignored tests did not run**, so this result says nothing about them. The set is identical
  in all 20 runs and is listed in `ignored.tsv`: the `docs/08` budget harnesses, the
  multi-gigabyte fixture and corpus passes, the 22 manual-walkthrough fixture writers, and similar.
- **Three test binaries compile to zero tests on Linux**: `spatial-engine [tests/source_watch_adapter.rs]`,
  `spatial-kernel [tests/source_watch_windows.rs]` and `spatial-kernel [tests/watcher_first_read_windows.rs]`.
  Their tests are compiled out off Windows, as `KNOWN-LIMITATIONS.md` item 24 states. They report
  `0 passed; 0 failed; 0 ignored` and appear in no count above.
- **Ten runs per profile bound a flake rate; they do not rule one out.** As arithmetic, not a
  measurement: a test that fails independently with probability *p* per run passes all ten runs of
  one profile with probability (1−*p*)^10, which is about 0.90 at *p* = 1% and about 0.60 at
  *p* = 5%. It passes all twenty with probability (1−*p*)^20, about 0.82 and 0.36. Twenty clean runs
  still leave a 1-in-20 flake about a one-in-three chance of going unseen.
- **One machine, one OS, one toolchain.** Nothing here speaks for Windows, macOS, another Linux
  distribution or architecture, or the CI runner's image.

### 2.4 Libtest's own slowness notices

These are libtest's "has been running for over 60 seconds" lines. They are not failures, and the
counts are the number of runs in which the line appeared. Debug: `spatial-engine
[tests/filter_type_admission.rs] the_type_walk_agrees_with_the_binder_over_the_p0_matrix` (10 of
10); in `spatial-kernel [tests/trace_spans.rs]`, `the_query_windows_internal_spans_are_all_present_and_ordered`
(6), `a_traced_publish_and_an_untraced_one_produce_the_same_bundle` (5),
`a_traced_publish_decomposes_a_partition_write` (5), `a_successful_run_stamps_no_cancellation_instant` (3),
`spans_serialize_to_one_json_object_per_line` (3) and `traces_agree_with_the_instruments_that_already_measured_the_same_thing` (1).
Release: `spatial-engine [tests/filter_type_admission.rs] the_type_walk_agrees_with_the_binder_over_the_p0_matrix` (10 of 10), and no other test.

## 3. Clippy

### 3.1 The command as asked

`cargo clippy --workspace --all-targets -- -D warnings` exited **101** after 17.4 s. Its
non-progress lines, verbatim and in order (each `error:` line is the head of a full diagnostic; the
full text is in `clippy-deny.log`):

```
error: manual `!Range::contains` implementation
error: doc list item without indentation
error: could not compile `spatial-renderer` (lib) due to 2 previous errors
warning: build failed, waiting for other jobs to finish...
error: constant `WATCH_BUFFER_BYTES` is never used
error: this function has too many arguments (8/7)
error: this `if` has identical blocks
error: this function has too many arguments (10/7)
error: could not compile `spatial-engine` (lib) due to 4 previous errors
```

The only workspace crates it reached were `spatial-engine`, `spatial-skp` and `spatial-renderer`.
Fixing these six errors alone would not make the command pass. The next errors would come from
the 42 diagnostics in targets this run never reached.

### 3.2 Every warning

The JSON run checked 116 compilation units across all five workspace members: every lib, bin,
example and integration test, with libs and bins counted once as built and once as test harness.
Diagnostics were deduplicated by (lint, primary span, message). A diagnostic emitted by more than
one target, such as a lib and its test harness, or `kernel/tests/support/mod.rs`, which is compiled
into nine test binaries, appears once. Span format: `file:line:col–line:col`, or `file:line:col–col`
for a single line. "Fires in" names the target. *lib* means the crate's library target, and
*lib (cfg(test))* means code inside a `#[cfg(test)]` module of that library.

By lint: `assertions_on_constants` 9, `explicit_auto_deref` 4, `type_complexity` 4, `dead_code`
(rustc) 3, `needless_borrows_for_generic_args` 3, `needless_borrow` 3, `bool_assert_comparison` 3,
`too_many_arguments` 2, `format_in_format_args` 2, `manual_is_multiple_of` 2, `await_holding_lock`
2, `unnecessary_get_then_check` 2, and one each of `manual_range_contains`, `doc_lazy_continuation`,
`if_same_then_else`, `double_ended_iterator_last`, `needless_range_loop`, `ptr_arg`,
`manual_contains`, `large_enum_variant` and `redundant_pattern_matching`. Total 48.

**Every fix below is a proposal. None was applied.**

| # | lint | span | fires in | proposed smallest fix |
|---|---|---|---|---|
| 1 | `clippy::too_many_arguments` (8/7) | `engine/src/rowgroup.rs:331:5–340:22` | engine lib | `#[allow(clippy::too_many_arguments)]` on `RowGroupIndex::build`. The workspace already does this in ten places, e.g. `engine/src/index.rs:313` and `engine/src/stream.rs:1769`. |
| 2 | `clippy::if_same_then_else` | `engine/src/stream.rs:2346:73–2348:10` | engine lib | Fold the `BooleanArray` arm into the `Int8Array \|\| UInt8Array` condition below it. Both yield `1`, so the value and the test order are unchanged. |
| 3 | `clippy::too_many_arguments` (10/7) | `engine/src/stream.rs:2462:1–2473:16` | engine lib | `#[allow(clippy::too_many_arguments)]` on `fn flush`, as at `stream.rs:1769`. |
| 4 | `clippy::type_complexity` | `engine/src/stream.rs:3808:24–91` | engine lib (cfg(test)) | A local `type Case = (Option<AdmittedPredicate>, Option<Bbox>, Option<u64>, String);` and `let cases: [Case; 8]`. |
| 5 | `clippy::explicit_auto_deref` | `engine/src/trace.rs:637:18–43` | engine lib (cfg(test)) | `pair(five_leg.last().unwrap())`, i.e. drop the `*`. |
| 6 | `clippy::explicit_auto_deref` | `engine/src/trace.rs:658:18–44` | engine lib (cfg(test)) | `pair(three_leg.last().unwrap())`, i.e. drop the `*`. |
| 7 | `dead_code` (rustc) | `engine/src/watch.rs:73:18–36` | engine lib | **Linux-only (§3.3).** `#[cfg(windows)]` on `WATCH_BUFFER_BYTES`. Its only users are inside `#[cfg(windows)] mod windows_watch` (lines 107, 222, 250). |
| 8 | `clippy::large_enum_variant` | `engine/tests/admission_p4_corpus.rs:363:1–386:2` | `admission_p4_corpus` | `#[allow(clippy::large_enum_variant)]` on the test-local `enum Observed`. Clippy's `Box<String>` suggestion would touch every construction and match site of a test-only type. |
| 9 | `clippy::explicit_auto_deref` | `engine/tests/admission_property_campaign.rs:218:5–56` | `admission_property_campaign` | Drop the leading `*`. |
| 10 | `clippy::format_in_format_args` | `engine/tests/admission_property_campaign.rs:270:15–278:10` | `admission_property_campaign` | Inline the inner call: template `"({} {} {}) {} {} {} {}"`, with `r.pick(&["<", ">", "="]), num_lit(r)` as the last two arguments in place of the inner `format!`. Format arguments evaluate left to right, so the RNG draws keep their order and the generated strings are byte-identical. |
| 11 | `clippy::explicit_auto_deref` | `engine/tests/admission_property_campaign.rs:543:31–53` | `admission_property_campaign` | `let t: &str = r.pick(SPLICE_TOKENS);`, i.e. drop the `*`. |
| 12 | `clippy::double_ended_iterator_last` | `engine/tests/admission_property_campaign.rs:556:27–560:28` | `admission_property_campaign` | `.last()` → `.next_back()`. Same element: the last boundary `<= end`. |
| 13 | `clippy::redundant_pattern_matching` | `engine/tests/filter_type_admission.rs:955:16–23` | `filter_type_admission` | `if int_info(from).is_some() {` |
| 14 | `clippy::needless_borrows_for_generic_args` | `engine/tests/fixture_generation.rs:126:31–52` | `fixture_generation` | `d.join("fa.parquet")` without `&`. The parameter is `impl AsRef<Path>` (`engine/src/fixture.rs:860`). |
| 15 | `clippy::needless_borrows_for_generic_args` | `engine/tests/fixture_generation.rs:127:31–52` | `fixture_generation` | `d.join("fb.parquet")` without `&`. |
| 16 | `clippy::needless_borrows_for_generic_args` | `engine/tests/fixture_generation.rs:143:38–58` | `fixture_generation` | `d.join("f.parquet")` without `&`. |
| 17 | `clippy::unnecessary_get_then_check` | `engine/tests/identity.rs:321:12–40` | `identity` | `!md.contains_key("id_js_exact")` |
| 18 | `clippy::unnecessary_get_then_check` | `engine/tests/identity.rs:324:16–49` | `identity` | `assert!(!md.contains_key("id_verified_rows"));` |
| 19 | `clippy::assertions_on_constants` | `engine/tests/import_layout_5gb_digest.rs:395:5–398:6` | `import_layout_5gb_digest` | See §3.4: `if cfg!(debug_assertions) { panic!(<same message>) }`. **Not** clippy's `const { assert!(..) }`. |
| 20 | `clippy::needless_borrow` | `engine/tests/import_layout_5gb_fixtures.rs:318:17–21` | `import_layout_5gb_fixtures` | `log.as_str()` in place of `&log as &str`. `log` is already `&mut String` (parameter at line 265). |
| 21 | `clippy::needless_borrow` | `engine/tests/import_layout_5gb_fixtures.rs:326:17–21` | `import_layout_5gb_fixtures` | As #20. |
| 22 | `clippy::assertions_on_constants` | `engine/tests/import_layout_5gb_fixtures.rs:338:5–342:6` | `import_layout_5gb_fixtures` | §3.4. |
| 23 | `clippy::assertions_on_constants` | `engine/tests/import_layout_digest.rs:461:5–466:6` | `import_layout_digest` | §3.4. |
| 24 | `clippy::assertions_on_constants` | `engine/tests/import_layout_fixtures.rs:247:5–251:6` | `import_layout_fixtures` | §3.4. |
| 25 | `clippy::assertions_on_constants` | `engine/tests/lod_tier_measurements.rs:253:5–257:6` | `lod_tier_measurements` | §3.4. |
| 26 | `clippy::assertions_on_constants` | `engine/tests/lod_tier_measurements.rs:486:5–491:6` | `lod_tier_measurements` | §3.4. |
| 27 | `clippy::needless_range_loop` | `engine/tests/publish_stream.rs:534:14–18` | `publish_stream` | `for (i, u) in union.iter().enumerate() { assert_eq!(u.to_bits(), facts.extent[i].to_bits(), "bound {i}"); }`. `union` is a 4-element array (line 508), so the iteration count is unchanged. |
| 28 | `clippy::manual_is_multiple_of` | `kernel/src/bin/publish-bundle.rs:149:12–27` | `publish-bundle` (bin) | `index.is_multiple_of(20)`. The method is already in use in the workspace (`engine/src/fixture.rs:412`), so it imposes no new toolchain floor. |
| 29 | `clippy::type_complexity` | `kernel/src/lib.rs:414:10–71` | kernel lib | Return `Result<CreatedSource, String>`, using the alias `spatial_data_plane::transport::CreatedSource` (`protocol/data-plane/src/transport.rs:151`), which is exactly this tuple. The same tuple at `lib.rs:393` (a trait impl) and `lib.rs:566` (already `#[allow(clippy::type_complexity)]`) is not flagged. |
| 30 | `clippy::type_complexity` | `kernel/src/lib.rs:489:10–71` | kernel lib | As #29. |
| 31 | `clippy::ptr_arg` | `kernel/src/permission/boundary.rs:531:26–34` | kernel lib | `fn manifest_hash(bundle: &Path)`, adding `Path` to the `use std::path::PathBuf;` at line 101. The one caller (line 431) passes `&outcome.bundle_path`, which coerces. |
| 32 | `clippy::needless_borrow` | `kernel/src/publish/mod.rs:812:67–73` | kernel lib | `watch` in place of `&watch`. It is already `&CancelWatch<'_>` (parameter at line 698). |
| 33 | `clippy::type_complexity` | `kernel/src/skp.rs:277:10–71` | kernel lib | As #29: `Result<CreatedSource, String>`. |
| 34 | `clippy::manual_contains` | `kernel/tests/import_layout_factorial.rs:1858:27–1860:37` | `import_layout_factorial` | `[gate1_verdict, gate2_verdict, gate3_verdict].contains(&"UNMEASURED")` |
| 35 | `dead_code` (rustc) | `kernel/tests/indexed_budgets.rs:209:13–29` | `indexed_budgets` | **Linux-only (§3.3).** Delete `peak_working_set` from the `#[cfg(not(windows))]` stub `procmem::Counters`. Nothing reads `Counters::peak_working_set` on any platform. The `.peak_working_set` read at line 266 is the separate `MemorySampler` field. |
| 36 | `clippy::assertions_on_constants` | `kernel/tests/indexed_budgets.rs:569:5–573:6` | `indexed_budgets` | §3.4. |
| 37 | `clippy::format_in_format_args` | `kernel/tests/indexed_budgets.rs:1166:15–1384:6` | `indexed_budgets` | The direct inner call is `a_miss = format!("{:?}", a_report.miss)` (line 1324). Change it to `a_miss = a_report.miss` and the template's `"{a_miss}"` (line 1214) to `"{a_miss:?}"`. The output bytes are unchanged. *Which inner `format!` the lint names is inferred from the lint's definition and not verified by applying the change.* The other inner `format!` (line 1297) sits inside an `if`/`else` and is not a direct argument. |
| 38 | `clippy::bool_assert_comparison` | `kernel/tests/publish.rs:279:5–72` | `publish` | `assert!(!manifest["sidecar"]["hashed"].as_bool().unwrap());` |
| 39 | `clippy::bool_assert_comparison` | `kernel/tests/publish.rs:280:5–74` | `publish` | `assert!(!manifest["sidecar"]["verified"].as_bool().unwrap());` |
| 40 | `clippy::bool_assert_comparison` | `kernel/tests/publish.rs:957:5–74` | `publish` | `assert!(!m["query_surface"]["available"].as_bool().unwrap());` |
| 41 | `clippy::manual_is_multiple_of` | `kernel/tests/scale_pass.rs:191:12–23` | `scale_pass` | `n.is_multiple_of(50)`. `n` is the `usize` from `fetch_add`. |
| 42 | `dead_code` (rustc) | `kernel/tests/slice_budgets.rs:186:13–29` | `slice_budgets` | **Linux-only (§3.3).** As #35: delete the field from the `#[cfg(not(windows))]` stub (line 182). |
| 43 | `clippy::assertions_on_constants` | `kernel/tests/slice_budgets.rs:467:5–471:6` | `slice_budgets` | §3.4. |
| 44 | `clippy::assertions_on_constants` | `kernel/tests/support/mod.rs:342:5–347:6` | nine test binaries: `cancel_rescore`, `first_batch_factorial`, `import_layout_factorial`, `import_layout_publish_determinism`, `query_window_attribution`, `regenerate_fixture`, `regenerate_fixture_s`, `scale_pass`, `scale_pass_a6` | §3.4. One edit clears it in all nine. |
| 45 | `clippy::await_holding_lock` | `kernel/tests/wire_bytes_invariant.rs:191:9–16` | `wire_bytes_invariant` | `#[allow(clippy::await_holding_lock)]` on the test fn, with its reason. The guard is from a process-global `std::sync::Mutex` (`TRACE_SERIAL`, line 183) used only to serialise these two tests. Each test's `#[tokio::test(flavor = "multi_thread")]` runtime is its own, and no task inside that runtime takes the lock, so the in-runtime deadlock the lint warns about has no second taker. The larger alternative is a `tokio::sync::Mutex`. |
| 46 | `clippy::await_holding_lock` | `kernel/tests/wire_bytes_invariant.rs:398:9–16` | `wire_bytes_invariant` | As #45. |
| 47 | `clippy::manual_range_contains` | `renderer/src/canonical.rs:240:20–67` | renderer lib | `!(MIN_ABS_DOUBLE..MAX_ABS_DOUBLE).contains(&mag)`, as clippy suggests. **Equivalent here only because** line 233 already returns on a non-finite `d`. For a NaN `mag` the two forms disagree: the original is `false` and the rewrite is `true`. |
| 48 | `clippy::doc_lazy_continuation` | `renderer/src/style.rs:10:5–5` | renderer lib | **Clippy's suggested indentation is the wrong fix.** The cause is line 9, `//! + same data → identical style and layout *decisions*". …`, where a `+ ` at the start of a line opens a Markdown bullet list in the middle of a quotation. Smallest fix: escape it as `//! \+ same data …` (one character), or reflow lines 8–9 so the `+` is not first on its line. §3.5 shows both renderings. |

### 3.3 Linux-specific diagnostics, and what Linux cannot see

- **#7, #35 and #42 are absent on Windows by construction, as far as this source shows.**
  `WATCH_BUFFER_BYTES` is used only inside `#[cfg(windows)] mod windows_watch`. The two
  `peak_working_set` warnings sit on the `#[cfg(not(windows))]` stub structs. Whether the
  `#[cfg(windows)]` `#[repr(C)]` `Counters` produces any `dead_code` warning of its own on Windows is
  not observable from this session. The same `dead_code` warnings also appear in the plain
  `cargo test` builds (`build-debug.log`, `build-release.log`).
- **Clippy on Linux checks no `#[cfg(windows)]` code.** That covers `mod windows_watch`, the Windows
  `procmem`, and the bodies of `source_watch_windows.rs`, `watcher_first_read_windows.rs` and
  `source_watch_adapter.rs`. A Windows clippy run could report diagnostics that this list does not
  contain.

### 3.4 The nine `assertions_on_constants`: don't apply clippy's suggestion

All nine (#19, #22–26, #36, #43, #44) are the same runtime guard,
`assert!(!cfg!(debug_assertions), "…Run with --release.")`, inside a release-only harness. Clippy's
help text proposes `const { assert!(..) }`. **That changes a runtime refusal into a compile error in
the debug profile.** Checked on this toolchain in a scratch crate outside the repository: an
`#[ignore]`d test whose body is `const { assert!(!cfg!(debug_assertions), "Run with --release.") };`
fails `cargo test` in debug with `error[E0080]: evaluation panicked: Run with --release.`, and
passes in `--release`. Applied here, it would stop the debug `cargo test --workspace` build of
every binary that contains one, including the nine that share `kernel/tests/support/mod.rs`.

Proposed instead, as a behaviour-preserving form: `if cfg!(debug_assertions) { panic!(<the same
message>); }`. In the same scratch crate this passes `cargo clippy --all-targets -- -D warnings`,
and run in debug with `--ignored` it still panics at runtime, as the guard does today. The smaller
textual alternative is `#[allow(clippy::assertions_on_constants)]` on each enclosing function.

### 3.5 #48: the rendering, checked

The same two-line doc comment, built with `cargo doc` in the scratch crate:

- As written (`//! + same data …` on the second line), rustdoc closes the paragraph after
  `“same style` (`<p>A deterministic compile — “same style</p>`), and the `+` line starts a list.
- With `//! \+ same data …`, it renders as one paragraph:
  `<p>A deterministic compile — “same style\n+ same data → identical decisions”. …</p>`.

The scratch crate's text was a shortened stand-in for `renderer/src/style.rs` lines 8–10, not the
file itself.

## 4. Files in this directory

| file | what it is |
|---|---|
| `REPORT.md` | this file |
| `runs.tsv` | one line per run: profile, run, start (UTC), wall seconds, exit code, count of `git status --porcelain` lines afterwards |
| `outcomes.tsv` | one row per test (1,044), one column per run (20): `.` ok, `i` ignored, `F` failed, `-` absent |
| `ignored.tsv` | the 79 tests ignored in every run |
| `logs/debug-N.log`, `logs/release-N.log` | each run's complete `cargo test` output, unedited |
| `logs/build-debug.log`, `logs/build-release.log` | the two `--no-run` builds |
| `logs/clippy-deny.log` | the as-asked clippy run (`-D warnings`), complete |
| `logs/clippy-warn.log` | the enumeration run's human-readable output, complete, with every diagnostic's full text and clippy's own suggestions |

The `.log` files were added with `git add -f`, because the root `.gitignore` ignores `*.log`. That
follows the precedent of `state/consults/FLAKE-HUNT-RUN-1-2026-10-10-logs/`. The parsing scripts
were throwaway scratch files and are not committed. The counts in this report
can be re-derived from the logs: `grep '^test result'` per run, and `grep -E '^test .* \.\.\. '` per test.
