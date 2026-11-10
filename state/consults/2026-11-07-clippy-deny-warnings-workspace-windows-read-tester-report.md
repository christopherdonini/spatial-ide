*Custodian's filing note (2026-11-07): the tester's Windows read for `clippy-deny-warnings-workspace`, the filler queue's entry 12, placed by the human's message of 2026-11-06 (15:59Z), line 22 (`state/directives/2026-11-06-8e-words-replaced-u1-h1-h2-class-8-m10-kl-c1-c3-draft-marks-u12-mark-n1-n3-slot-2-order-clippy-placed-288-clicked.md`). Read only at main fbc905ec, in a detached worktree with its own target. Dispatched at 2026-11-07T10:35:19.498Z by its transcript from a brief of 6131 bytes (sha256 270539592c123e55b64c2c39f24f9396459139e859a69b7c5c50e6544c47ea73); the run to its hand-back at 2026-11-07T10:47:26.666Z (claude-sonnet-5-5; unique calls Bash 23, Write 1 and the hand-back, 25). This report is the hand-back, saved from it with one final newline (sha256 1758328e7b382a09459466372e8d43d8ab67eb1711726581a99081d488b73ba2); nothing is changed.

The custodian checked it by script against the transcript and the files it names:
- The tool results show `cmdrc=101` for the -D run and `cmdrc=0` for the JSON run. Each hold's output shows its own release line.
- The tool results show `raw primary-span diagnostics 64 distinct 45`, and the JSON's sha256 as reported. The file's own sha256 is still equal to it.
- Its 45 match the cloud report's 48 less its three `dead_code` rows (7, 35, 42), in order, by lint and file: engine/ 26, kernel/ 17 and renderer/ 2, over 28 files.

Against the brief:
- 3 of its wait loops had no counter of their own (2 in the background; 1 in the foreground under the tool's own timeout). Each ended when the hold's `cmdrc` line appeared, and at 2026-11-07T10:49:56Z the custodian found no process whose command line names `cmdrc` or `clippy0`.
- 3 foreground waits carried a timeout under the brief's 300 s; none was a cargo call. One `sleep 120` was refused by the harness.

The custodian removed the worktree and its target at 2026-11-07T10:55:56Z; the small output files the report names stay outside the repository. A read, not a measurement under docs/08, and not Authority.*

---

Report for `node:clippy-deny-warnings-workspace@read`, measured at main fbc905ecc704380a640e59f4f874d2c9e10d8f0c. I run as Sonnet 5.5 (claude-sonnet-5-5) with no model override and no context handoff.

**Bottom line:** the Windows run lists 45 distinct diagnostics. The Linux report's 48 minus its 3 Linux-only `dead_code` items gives exactly 45, and Windows adds none. This is a read-only diagnostic count, not a docs/08 perf measurement, so I make no time or speed claim.

**Four failure classes, as they apply to this harness**
- **Product interface:** I used cargo's own `clippy` subcommand on the committed lockfile (`--locked`), with nothing patched.
- **Result claims:** every claim below points to a file in `D:/wt-targets/`, listed at the end.
- **Operator-facing lines:** each describes this commit and this run.
- **Assertion reached:** the counts come from a script run over the JSON, and its output is in `clippy0-distinct.txt`. For the deny run, the failure is cargo's exit 101.

**Versions** (`D:/wt-targets/clippy0-ver.txt`, both exit 0)
- `clippy 0.1.97 (8bab26f4f6 2026-07-14)`
- `rustc 1.97.1 (8bab26f4f 2026-07-14)`
- clang-cl is on PATH at `/c/Program Files/LLVM/bin/clang-cl`.

**Commands** (worktree `C:/dev/wt/clippy0`, `CARGO_TARGET_DIR=D:/wt-targets/clippy0`, `CARGO_BUILD_JOBS=8`, `RUST_TEST_THREADS=8`, each cargo call inside a shared hold)
1. `cargo clippy --version` and `rustc -V`: exit 0 and 0.
2. `cargo clippy --locked --workspace --all-targets -- -D warnings`, output to `D:/wt-targets/clippy0-deny.txt`: **exit 101**. The errors that stopped it were:
   - `error: manual '!Range::contains' implementation` (`renderer/src/canonical.rs:240`)
   - `error: doc list item without indentation` (`renderer/src/style.rs:10`)
   - `error: could not compile 'spatial-renderer' (lib) due to 2 previous errors`
   - `warning: build failed, waiting for other jobs to finish...`
   - On Windows the stop is at the renderer lib with 2 errors. The Linux run reported 6 errors across renderer and engine before stopping. Both runs leave everything else unchecked.
3. `cargo clippy --locked --workspace --all-targets --message-format=json`, stdout to `D:/wt-targets/clippy0-all.json` and stderr to `D:/wt-targets/clippy0-all.err`: **exit 0**. It finished the dev profile with warnings only.
4. The script `D:/wt-targets/clippy0-distinct.mjs` (outside the repository) produced `D:/wt-targets/clippy0-distinct.txt`, exit 0.

**Counting rule.** Every `compiler-message` that has a primary span is a diagnostic. All 64 raw ones were warnings in workspace files. I deduplicated by (lint code, primary file, start and end line and column, message). This is the cloud report's rule: it counts distinct diagnostics by (lint, primary span, message), and a diagnostic emitted by several targets, such as `kernel/tests/support/mod.rs` in 9 test binaries, counts once. 64 raw becomes **45 distinct**.

**Distinct list, 45.** Format: `# lint file:line (message first line)`. "x-lib" means the line differs from the cloud report. A message of "this function has too many arguments (n/7)" is abbreviated "tma".

| # | lint | file:line | first line of message |
|---|---|---|---|
| 1 | too_many_arguments | engine/src/rowgroup.rs:331 | tma (8/7) |
| 2 | if_same_then_else | engine/src/stream.rs:2346 | this `if` has identical blocks |
| 3 | too_many_arguments | engine/src/stream.rs:2462 | tma (10/7) |
| 4 | type_complexity | engine/src/stream.rs:3808 | very complex type used. Consider factoring parts into `type` definitions |
| 5 | explicit_auto_deref | engine/src/trace.rs:637 | deref which would be done by auto-deref |
| 6 | explicit_auto_deref | engine/src/trace.rs:658 | deref which would be done by auto-deref |
| 7 | large_enum_variant | engine/tests/admission_p4_corpus.rs:363 | large size difference between variants |
| 8 | explicit_auto_deref | engine/tests/admission_property_campaign.rs:218 | deref which would be done by auto-deref |
| 9 | format_in_format_args | engine/tests/admission_property_campaign.rs:270 | `format!` in `format!` args |
| 10 | explicit_auto_deref | engine/tests/admission_property_campaign.rs:543 | deref which would be done by auto-deref |
| 11 | double_ended_iterator_last | engine/tests/admission_property_campaign.rs:556 | called `Iterator::last` on a `DoubleEndedIterator`; this will needlessly iterate the entire iterator |
| 12 | redundant_pattern_matching | engine/tests/filter_type_admission.rs:1267 (x-lib: cloud had 955) | redundant pattern matching, consider using `is_some()` |
| 13 | needless_borrows_for_generic_args | engine/tests/fixture_generation.rs:126 | the borrowed expression implements the required traits |
| 14 | needless_borrows_for_generic_args | engine/tests/fixture_generation.rs:127 | same |
| 15 | needless_borrows_for_generic_args | engine/tests/fixture_generation.rs:143 | same |
| 16 | unnecessary_get_then_check | engine/tests/identity.rs:321 | unnecessary use of `get("id_js_exact").is_none()` |
| 17 | unnecessary_get_then_check | engine/tests/identity.rs:324 | unnecessary use of `get("id_verified_rows").is_none()` |
| 18 | assertions_on_constants | engine/tests/import_layout_5gb_digest.rs:395 | this assertion has a constant value |
| 19 | needless_borrow | engine/tests/import_layout_5gb_fixtures.rs:318 | this expression creates a reference which is immediately dereferenced by the compiler |
| 20 | needless_borrow | engine/tests/import_layout_5gb_fixtures.rs:326 | same |
| 21 | assertions_on_constants | engine/tests/import_layout_5gb_fixtures.rs:338 | this assertion has a constant value |
| 22 | assertions_on_constants | engine/tests/import_layout_digest.rs:461 | same |
| 23 | assertions_on_constants | engine/tests/import_layout_fixtures.rs:247 | same |
| 24 | assertions_on_constants | engine/tests/lod_tier_measurements.rs:253 | same |
| 25 | assertions_on_constants | engine/tests/lod_tier_measurements.rs:486 | same |
| 26 | needless_range_loop | engine/tests/publish_stream.rs:534 | the loop variable `i` is used to index `union` |
| 27 | manual_is_multiple_of | kernel/src/bin/publish-bundle.rs:149 | manual implementation of `.is_multiple_of()` |
| 28 | type_complexity | kernel/src/lib.rs:414 | very complex type used. Consider factoring parts into `type` definitions |
| 29 | type_complexity | kernel/src/lib.rs:489 | same |
| 30 | ptr_arg | kernel/src/permission/boundary.rs:536 (x-lib: cloud had 531) | writing `&PathBuf` instead of `&Path` involves a new object where a slice will do |
| 31 | needless_borrow | kernel/src/publish/mod.rs:839 (x-lib: cloud had 812) | this expression creates a reference which is immediately dereferenced by the compiler |
| 32 | type_complexity | kernel/src/skp.rs:277 | very complex type used. Consider factoring parts into `type` definitions |
| 33 | manual_contains | kernel/tests/import_layout_factorial.rs:1858 | using `contains()` instead of `iter().any()` is more efficient |
| 34 | assertions_on_constants | kernel/tests/indexed_budgets.rs:569 | this assertion has a constant value |
| 35 | format_in_format_args | kernel/tests/indexed_budgets.rs:1166 | `format!` in `format!` args |
| 36 | bool_assert_comparison | kernel/tests/publish.rs:279 | used `assert_eq!` with a literal bool |
| 37 | bool_assert_comparison | kernel/tests/publish.rs:280 | same |
| 38 | bool_assert_comparison | kernel/tests/publish.rs:957 | same |
| 39 | manual_is_multiple_of | kernel/tests/scale_pass.rs:191 | manual implementation of `.is_multiple_of()` |
| 40 | assertions_on_constants | kernel/tests/slice_budgets.rs:467 | this assertion has a constant value |
| 41 | assertions_on_constants | kernel/tests/support/mod.rs:342 (fires in 9 test binaries) | this assertion has a constant value |
| 42 | await_holding_lock | kernel/tests/wire_bytes_invariant.rs:191 | this `MutexGuard` is held across an await point |
| 43 | await_holding_lock | kernel/tests/wire_bytes_invariant.rs:398 | same |
| 44 | manual_range_contains | renderer/src/canonical.rs:240 | manual `!Range::contains` implementation |
| 45 | doc_lazy_continuation | renderer/src/style.rs:10 | doc list item without indentation |

**Counts by lint** (`clippy0-distinct.txt` last two lines)
- `assertions_on_constants` 9
- `type_complexity` 4
- `explicit_auto_deref` 4
- `needless_borrow` 3
- `needless_borrows_for_generic_args` 3
- `bool_assert_comparison` 3
- `too_many_arguments` 2
- `format_in_format_args` 2
- `manual_is_multiple_of` 2
- `unnecessary_get_then_check` 2
- `await_holding_lock` 2
- one each: `if_same_then_else`, `large_enum_variant`, `double_ended_iterator_last`, `redundant_pattern_matching`, `needless_range_loop`, `ptr_arg`, `manual_contains`, `manual_range_contains`, `doc_lazy_continuation`

**Counts by module**
- `engine/`: 26 (6 in `src`, 20 in `tests`).
- `kernel/`: 17 (5 in `src`, 12 in `tests`; `tests` includes the one `support/mod.rs` item).
- `renderer/`: 2.
- Any other module: 0.
- Total 45.

**Windows-only** (by my reading of the source): **0** of the 45.
- The only `cfg(windows)` marker in the product source files I searched (including `boundary.rs:552`) is a test-only attribute inside `boundary.rs`, which clippy does not flag.
- The five flagged sites in test files that contain `cfg(windows)` blocks are all outside those blocks:
  - `indexed_budgets.rs:569`, in `fn refuse_debug`
  - `indexed_budgets.rs:1166`
  - `slice_budgets.rs:467`
  - `import_layout_factorial.rs:1858`
  - `support/mod.rs:342`, in `fn refuse_debug`
- I did not read all of `indexed_budgets.rs:1166–1384` against its cfg boundaries beyond the grep above.
- No clippy diagnostic or rustc warning with a code of `dead_code` appears. The Windows `procmem` `Counters` therefore produces none, which settles the cloud report's open question in section 3.3.

**Comparison with the cloud report's 48**
- In both: **45**. All 45 match by lint and file, in the same order. Three have shifted line numbers because main has moved since 6b67d44: `filter_type_admission.rs` 955 → 1267, `boundary.rs` 531 → 536, `publish/mod.rs` 812 → 839.
- Linux-only: **3**, the rustc `dead_code` items #7 (`engine/src/watch.rs:73` `WATCH_BUFFER_BYTES`), #35 (`kernel/tests/indexed_budgets.rs:209`) and #42 (`kernel/tests/slice_budgets.rs:186`). They are absent on Windows, as the cloud report predicted.
- Windows-only: **0**.
- Caution on #1 to #6 and the nine `assertions_on_constants` guards: the Linux report's proposed fixes for them stand unchanged, because the diagnostics are the same.

**Files and state**
- sha256 of `D:/wt-targets/clippy0-all.json`: `229a836c46013db64eb36c2450d07568fc5db910019ccb5829da5b9657c2d532`
- Other files under `D:/wt-targets/`: `clippy0-ver.txt`, `clippy0-deny.txt`, `clippy0-all.err`, `clippy0-distinct.mjs`, `clippy0-distinct.txt`.
- `git -C C:/dev/wt/clippy0 status --porcelain` is empty (0 lines). I changed no tracked file, committed nothing and pushed nothing.
- The worktree `C:/dev/wt/clippy0` and the target `D:/wt-targets/clippy0` are left for you to remove. Both holds were released (`MACHINE_RELEASED` seen for each).
- I leave no background shell or process. All waiter shells I started have exited.
