*Custodian's filing note (2026-10-27): the tester-high's second P0 for O1, under the form's §9, its Amendment 1 and the human's direction of 2026-10-27, in the throwaway checkout C:/dev/wt/o1-clang at 688b847d, on the probe's own target; nothing committed. The header check confirmed `-DDUCKDB_STATIC_BUILD` (winapi.hpp honours it as the direction describes; its other uses only choose export or import decorations), so no stop; one cold clang-cl build passed with the define on all 352 DuckDB units; P0 ran through (both runs identical, the S1 tally 0). The suite's first command ended at 101 only because the untracked probe needs its output variable; the tester ran the remaining targets in two more holds and discloses it. The custodian's check: the transcript shows every cargo build, clean and run inside a shared hold, no git write, no exclusive hold, and writes only to the config line and scratch; the config's sha256 read again is 6889110645ec075c0cba3bf4aa71c4b43e5b5dfafe7d5a3e8228c05c5010e35f. Lead-data reads it against the form's pass criteria next; nothing is graded here. The run 20:41:26Z to 21:48:35Z by its transcript (Bash 90, Read 5, Grep 1, Edit 1, Write 2). Extracted by script from its SubagentHandback call, with one final newline added; nothing else is changed. Its sha256, from line 5 to the end, is accbcfe1b8007b27d9521136a20365748c2f2c8e83e552684193f0772a437ef2.*

---

P0 run: admitted-integer-overflow-silent-wraparound at 688b847d325f3129fbde32f31d76dd004b19bd48

Model as the harness reports it: Sonnet 5.5, model ID claude-sonnet-5-5, the tester role at high effort. No override and no context handoff. I committed, staged and pushed nothing. I wrote no report file. The checkout is still at 688b847d, and its porcelain is `?? .cargo/` and `?? engine/tests/o1_probe.rs`.

Brief sha256 shown by command: 726ff572205933d71e28eee07f569865328ab55c080db43b613b963e737db038 (matches). The direction (b53eda10...) and the form (65604c84...) were shown by `sha256sum` and match. I read all three documents whole.

## Summary
- Header check: `DUCKDB_STATIC_BUILD` is honoured as the direction describes, so the define is `-DDUCKDB_STATIC_BUILD`. No other use of the macro does more than choose export or import decorations. No stop.
- P-3: one cold clang-cl build, exit 0. 352 DuckDB compile units, all clang-cl, all carrying the define, none cl.exe. The link succeeded, with no compiler-rt.
- P-4: both probe runs exit 0, with identical output. S1 tally is 0 (`TALLY` and `TALLY-NEW` both 0).
- P-5: `cargo test -p spatial-engine --locked` exited 101, but only because the untracked probe test panicked on a missing env var. Cargo stopped there, so I ran the remainder in two further commands (see P-5). Result lines: 49 suites, 464 tests passed, 0 failed, 17 ignored; there are 48 `ok` lines plus the one probe `FAILED` line.
- P-6: the imports are the MSVC runtime set, with no clang runtime DLL.

## Step 2: the header check (read only)
Source root: the build's unpacked DuckDB 1.5.5 source, `D:/wt-targets/o1-clang/debug/build/libduckdb-sys-e687d2665fbd4cae/out/duckdb`. The crate itself ships it as `duckdb.tar.gz`, so it exists unpacked only under the target. File: `src/include/duckdb/common/winapi.hpp`, sha256 6201fc815bab381c824552cdf35964c658f322d00ed8462af87d4a6f0823253f. 3,596 files were scanned, and the macro lines below are byte-copied from `cat -n`:
```
    11	#ifndef DUCKDB_API
    12	#if defined(_WIN32) && !defined(__MINGW32__)
    13	#ifdef DUCKDB_STATIC_BUILD
    14	#define DUCKDB_API
    15	#else
    16	#if defined(DUCKDB_BUILD_LIBRARY) && !defined(DUCKDB_BUILD_LOADABLE_EXTENSION)
    17	#define DUCKDB_API __declspec(dllexport)
    18	#else
    19	#define DUCKDB_API __declspec(dllimport)
    20	#endif
    21	#endif
    22	#else
    23	#define DUCKDB_API
    24	#endif
    25	#endif
    27	#ifndef DUCKDB_EXTENSION_API
    28	#ifdef _WIN32
    29	#ifdef DUCKDB_STATIC_BUILD
    30	#define DUCKDB_EXTENSION_API
    31	#else
    32	#define DUCKDB_EXTENSION_API __declspec(dllexport)
    33	#endif
    34	#else
    35	#define DUCKDB_EXTENSION_API __attribute__((visibility("default")))
    36	#endif
    37	#endif
```
**Decision: `-DDUCKDB_STATIC_BUILD`.** On Windows (line 12), when it is defined, line 13 takes the branch `#define DUCKDB_API` (empty, line 14) instead of dllexport at line 17. All of it sits under `#ifndef DUCKDB_API` (line 11), as the direction describes. `-DDUCKDB_API=` was therefore not needed.

Every use of `DUCKDB_STATIC_BUILD` in the whole vendored source (`grep -rn`, rc 0, and the Grep tool agrees): 4 lines, in 2 files.
- `src/include/duckdb/common/winapi.hpp:13` and `:29` (above).
- `src/include/duckdb.h:18` is `#ifdef DUCKDB_STATIC_BUILD`, and it picks `#define DUCKDB_C_API` (empty) or dllexport/dllimport.
- `src/include/duckdb.h:35` is `#ifdef DUCKDB_STATIC_BUILD`, and it picks `#define DUCKDB_EXTENSION_API` (empty) or dllexport.
- All four only choose export or import decorations. There is none in `third_party/` or `extension/`. No stop.

The crate's build script and its other files (read only, in the cargo registry's unpacked crate): `build_bundled_cc.rs:135-137` is the only match for `DUCKDB_STATIC_BUILD`, `DUCKDB_API`, `DUCKDB_BUILD_LIBRARY` or `DUCKDB_BUILD_LOADABLE`:
```
    if win_target() {
        cfg.define("DUCKDB_BUILD_LIBRARY", None);
    }
```
The script never defines `DUCKDB_STATIC_BUILD` or `DUCKDB_API`. The `src/` folder has none of the three. The only other defines are `NDEBUG`, `DUCKDB_EXTENSION_AUTOINSTALL_DEFAULT`, `DUCKDB_EXTENSION_AUTOLOAD_DEFAULT` and the `cc` call at `:91`. Other uses of `DUCKDB_BUILD_LIBRARY` or `DUCKDB_BUILD_LOADABLE_EXTENSION` in the source are `winapi.hpp:16`, `duckdb.h:21` and `extension/parquet/parquet_extension.cpp:953` (`#ifdef DUCKDB_BUILD_LOADABLE_EXTENSION`). I did not choose or change those macros.

## Step 3 / P-2b: the config
- Added exactly one line after the CXX line, using the Edit tool on the untracked file. The file is 191 bytes, LF only, ASCII (`od -c` and `file`).
- Bytes:
```
# Bundled DuckDB on Windows: see engine/Cargo.toml, above the `duckdb` dependency.
[env]
"CXX_x86_64-pc-windows-msvc" = "clang-cl"
"CXXFLAGS_x86_64-pc-windows-msvc" = "-DDUCKDB_STATIC_BUILD"
```
- New sha256: 6889110645ec075c0cba3bf4aa71c4b43e5b5dfafe7d5a3e8228c05c5010e35f. The old one was 9075af4d..., as given.
- The probe `engine/tests/o1_probe.rs` sha256 is unchanged: c89d746fcc00ef4738b4a460f103d7a4c2d75ce1d5946151f16a1c6e7df4dd67. It is the same at the end of the run, and the config sha256 is also unchanged since the edit.

## P-0
- `where clang-cl` rc 0: `C:\Program Files\LLVM\bin\clang-cl.exe`.
- `clang-cl --version` rc 0: `clang version 20.1.8`, `Target: x86_64-pc-windows-msvc`, `Thread model: posix`, `InstalledDir: C:\Program Files\LLVM\bin`.
- Both ran in the Git Bash shell that the builds used.
- D: free space was 155 GB: `df` showed 155G available of 466G, and `Get-PSDrive D` showed 154.97 GB. It is well over the 20 GB floor.

## P-3: the one cold build
- `cargo clean -p libduckdb-sys` in a shared hold, rc 0: `Removed 3758 files, 52.8MiB total`. Every DuckDB unit therefore compiled again.
- Then `CC_ENABLE_DEBUG_OUTPUT=1 CARGO_TARGET_DIR=D:/wt-targets/o1-clang CARGO_BUILD_JOBS=8 RUST_TEST_THREADS=8 cargo test -p spatial-engine --locked --test o1_probe --no-run`, in one shared hold. The call printed `cmd-rc=0`, and cargo's own last lines were `Finished \`test\` profile ... in 17m 11s` and `Executable tests\o1_probe.rs (...o1_probe-1302719615501df6.exe)`. That duration is cargo's own line and is not a measurement.
- The `running:` lines are not in cargo's stdout on success. They are in the build script's saved `output` file in the target (`.../libduckdb-sys-e687d2665fbd4cae/output`). I read them from there with my script `o1p0b-check.sh`, and I self-tested every count positive.
- Of 382 `running:` lines (18 are prefixed `exit code: `, so I extracted from `running: ` onward):
  - 352 are DuckDB compile units (they carry the `"-c"` token). All 352 name `"clang-cl"` as the program, all 352 carry the token `"-DDUCKDB_STATIC_BUILD"`, and all 352 carry `"-DDUCKDB_BUILD_LIBRARY"` (the crate's own define). 0 name cl.exe, and 0 carry a `-std=` flag (H-STD: no flag, so no warning about it).
  - The other 30 are 10 `llvm-lib.exe` archive steps, 10 `clang-cl --print-search-dirs`, 5 `clang-cl -?`, and 5 `clang-cl -E` compiler detections. No `running:` line anywhere names cl.exe. There are 352 `.o` files in `out`.
  - `exit code: [1-9]` matches 0 times.
- A compile line, with its `-I` options elided, reads: `"clang-cl" "-nologo" "-MD" "-O2" "-Brepro" "--target=x86_64-pc-windows-msvc" ... "-W0" "/EHsc" "/utf-8" "/bigobj" "-w" "-DDUCKDB_EXTENSION_CORE_FUNCTIONS_LINKED=1" "-DDUCKDB_EXTENSION_JSON_LINKED=1" "-DDUCKDB_EXTENSION_PARQUET_LINKED=1" "-DDUCKDB_EXTENSION_AUTOINSTALL_DEFAULT=1" "-DDUCKDB_EXTENSION_AUTOLOAD_DEFAULT=1" "-DNDEBUG" "-DDUCKDB_BUILD_LIBRARY" "-DDUCKDB_STATIC_BUILD" "-Fo..." "-c" "--"`.
- Warnings: 1 in total, and 0 from DuckDB. The build script's output has 0 `warning` text. The one warning is in the probe: `warning: fields \`writer\` and \`path\` are never read` at `engine\tests\o1_probe.rs:448:5` (`#[warn(dead_code)]`). It was byte-copied from `o1p0b-build.log` and is cargo's `generated 1 warning`.
- Link: succeeded. Cargo hides the link line on success, so I checked instead:
  - `libduckdb.a` (199,148,992 B) and the probe exe (80,619,008 B) contain 0 occurrences of `clang_rt`, `builtins`, `compiler-rt` or `compiler_rt` (`grep -ac`).
  - The archive's `/DEFAULTLIB` directives are only `msvcprt.lib`, `msvcrt.lib`, `oldnames.lib`, `uuid.lib` and `ws2_32.lib`.
  - The script's `cargo:rustc-link-lib` lines are `static=duckdb`, `dylib=ws2_32`, `dylib=rstrtmgr` and `dylib=bcrypt`.
  - Caveat: I did not see the linker command line itself.

## P-4: two probe runs
- Each ran in its own process in its own shared hold, with `O1_OUT_DIR=D:/wt-targets/o1-clang-data/attempt-2/runN`, the logs at `.../attempt-2/run1.log` and `run2.log`, and `cargo test -p spatial-engine --locked --test o1_probe -- --nocapture --test-threads=1`. Both printed `cmd-rc=0`, both `test result: ok. 1 passed; ... finished in 12.57s` (run 1) and `10.12s` (run 2), and both `O1 PROBE DONE`.
- The two logs are identical (3,444 lines each) apart from cargo timing lines (diff empty after masking the run folder and the times). All 23 fixture files are byte-identical across the runs (`cmp` of the sha256 lists, rc 0).
- `VERSIONS pragma_version() = Ok(("v1.5.5", "d8cdaa33fd"))`. Every fixture passed `checks=PASS` with 0 readback mismatches.
- `TALLY engine_runs=136 runs_meeting_design_conditions(admitted, no Some(Err), id set != X)=0 []`.
- `TALLY-NEW engine_runs=60 runs_meeting_design_conditions(admitted, no Some(Err), id set != X)=0 []`.
- The new-cell predicates are all admitted (49 `ADMIT` lines, all `Ok`).

## P-7: every cell against §3's prediction (no grading)
"Fixed" means: the terminal is an error whose Display equals the fixed-detail text exactly (`query: [P6 placeholder] a value computed while this query ran was out of range for its type; the row values and the query text are withheld`), with batches=[] (none delivered). Every cell below was identical in all four runs (2 shapes `all`/`view` × 2 reps) and in both processes. My classifier script is `o1p0b-erun.awk`; its output is `o1p0b-erun1.txt`.

| Cell | Predicted | Observed |
|---|---|---|
| W: A-ar-s, A-ar-n, A-dk, B-ar-n, S-ar-n, P1 and P2 | fixed, no batch | fixed, no batch (all 10) |
| W, second row group: B3-ar-n P1, P2 | an error, site unpredicted (H-FETCH) | fixed. The streaming probe records the error at the `execute:` site, with `(4000004095 * 4000004095)`, 0 chunks (`ISTREAM`). |
| F: B-ar-s, B-dk, P1 and P2 | fixed; EXPLAIN shows no `EMPTY_RESULT` | fixed. `EMPTY_RESULT` appears 0 times in the log, across 36 EXPLAINs. |
| F, second row group: B3-ar-s, B3-dk, P1 and P2 | as B3-ar-n | fixed (`execute:` site) |
| exact control P3, -ar-n files with an overflow row (A-ar-n, B-ar-n, B3-ar-n) | fixed | fixed |
| P3 on statistics files (A-ar-s, A-dk, B-ar-s, B-dk, B3-ar-s, B3-dk) | the fixed detail or X (unpredicted) | completed, id set = X: 2,048 ids (A, B files) or 4,096 ids (B3 files), `eq_X=true` |
| refusal controls A-ar-s and B-ar-s: C1 `v * v`, C2 `v * 1.5 > 0` | refused, `skp.filter_not_boolean` and `skp.filter_type_not_admitted` | refused with exactly those codes. C1: "refused: the predicate's inferred type is Int64, not BOOLEAN; an implicit conversion to BOOLEAN is not performed (docs/01 principle 8)". C2: "refused: \`*\` over BIGINT and DECIMAL(2,1) literal: a conversion that can fail during the scan (docs/01 principle 8)". |
| magnitude, independent `SELECT v * v`: S-ar-n k=0..5 | k=2..5 raise `Out of Range Error`, k=0,1 exact | k=0 (4) and k=1 (9223372030926249001) exact; k=2 (3037000500), k=3 (-3037000500), k=4 (4000000000), k=5 (4294967295) raise `Out of Range Error: Overflow in multiplication of INT64 (...)!` |
| R-ar-n, same | R as before | k=0 exact; k=1 (4294967296) and k=2 (3600000000003999000) raise |
| R-ar-n P1 and P2 (stream) | not named in §3 | fixed |
| L1 `4000000000 * 4000000000 > 0` on B-ar-s | H-L: completed = X (2,048), no error | completed, 2,048 ids, `eq_X=true`, no error |
| L2 `... < 0` | H-L: completed, 0 | completed, 0 ids, `eq_X=true`, no error |
| L3 `4294967296 * 4294967296 > 0` | recorded, not graded | completed, 2,048 ids, `eq_X=true`, no error |
| L4 `268435456 * 1152921504606846976 > 0` | as H-L | completed, 2,048 ids, `eq_X=true`, no error |
| literal-only `SELECT` outside the engine (`L47`, `L4-47`, cells D, SP, ER) | not predicted | all 9 L47 and 6 L4-47 lines raise `Out of Range Error: Overflow in multiplication of INT64 (...)!` (4000000000², 3037000500², 4294967296², 268435456 × 1152921504606846976, and the mirror) |
| T-c, two-column: T-c-ar-n Q1, Q2 | fixed | fixed |
| T-c-ar-n Q3 | as P3 | fixed |
| T-c-ar-s Q1, Q2 | fixed | fixed |
| T-c-ar-s Q3 | as P3 | completed, 3 ids, `eq_X=true` |
| T-o, one-sided: T-o-ar-n and T-o-mirror-ar-n, Q1 and Q2 | fixed; independent per-k queries raise | fixed. Per-k: k=1 (268435456 × 1152921504606846976, and the mirror) raises, with X = 309485009821345068724781056 and wrapped W = 0. |
| T-e, exact two-column: T-e-ar-n Q1, Q2, Q3 | X, no error | Q1 completed with 4 ids, Q2 with 1 id, Q3 with 5 ids, all `eq_X=true`, no error. Per-k values all exact (including 2147483648², -4294967296 × 2147483648 = -9223372036854775808, 9223372036854775807 × 1, 3037000499²). |
| T-m, both raise: T-m-ar-n Q1 | the fixed detail | fixed. Per-k: k=1 (4294967296²) and k=2 (-1 × -9223372036854775808) raise. |
| T-c per-k | not stated | k=0 exact (6); k=1 (3037000500 × 4000000000) and k=2 (-4000000000 × 4294967295) raise, on both -ar-n and -ar-s |

Counts over the 49 (file, predicate) groups in run 1: 35 are fixed, 14 completed (all 14 with `eq_X=true`: 6 P3 statistics cells + T-c-ar-s Q3 + 4 L cells + 3 T-e cells), 0 other terminals. The S1 tally (completed runs whose ids differ from the i128 oracle) is 0 by the probe's own `TALLY` lines, and the same by my script (0 COMPLETED lines with `eq_X` not true). The probe's I128 lines agree with the hand arithmetic where it was given. All reported ids are the probe's own; nothing was timed.

## P-5: the engine suite
- First command, as the form has it: `CC_ENABLE_DEBUG_OUTPUT=1 CARGO_TARGET_DIR=D:/wt-targets/o1-clang CARGO_BUILD_JOBS=8 RUST_TEST_THREADS=8 cargo test -p spatial-engine --locked`, in a shared hold, log `.../attempt-2/suite.log`. It printed `cmd-rc=101`.
  - The cause is not the engine. The probe's test `o1_probe` panicked at `engine\tests\o1_probe.rs:1054:61` with `O1_OUT_DIR must be set: NotPresent`, because the suite command does not set the env var. Cargo stopped there (`error: test failed, to rerun pass \`-p spatial-engine --test o1_probe\``), so the targets after it did not run.
  - Before that point: 35 `test result` lines, 34 `ok`, and 372 tests passed, 15 ignored, 0 failed (the one FAILED is `o1_probe`, "0 passed; 1 failed"). That includes the lib tests (204 passed) and the long `lod_tier_builder` suite (17 passed, 2 ignored, 1760.41s).
  - In that log, with `... ok`: `filter_admission_property_campaign`, `a_join_of_clauses_each_admitted_alone_returns_their_intersection_and_its_subsets_admit`, `an_admitted_integer_overflow_ends_the_stream_with_the_fixed_detail`, `the_type_walk_agrees_with_the_binder_over_the_p0_matrix`, `predicate::tests::the_walk_types_every_arithmetic_node_as_the_binder_does`, and `stream::tests::filter_composition::the_where_composition_matrix_matches_the_declared_rule_exactly`.
- Deviation, mine: to finish the same suite I ran the not-yet-run targets in two more shared holds, with the same env and target.
  - `cargo test -p spatial-engine --locked --test planner_seam --test point_corpus --test point_stream --test polygon_wire_golden --test predicate_admission --test predicate_referenced_columns --test publish_stream --test row_group_seam --test session_identity --test slice --test source_observation --test source_watch_adapter --test spatial_index` gave `cmd-rc=0`: 13 `test result: ok` lines, 92 passed, 0 failed, 2 ignored (`suite-rest.log`).
  - `cargo test -p spatial-engine --locked --doc` gave `cmd-rc=0`: `Doc-tests spatial_engine`, 0 tests (`suite-doc.log`).
  - I did not rerun the whole suite (it takes about 50 minutes), so the passed counts come from the three logs, not one run. `o1_probe` itself was exercised in P-4 (passed twice) and failed in the suite only for the missing env var.
- Together: 49 `test result` lines, 464 tests passed, 0 failed (apart from the probe's env-var panic), 17 ignored.

## P-6: imports
`dumpbin /DEPENDENTS` on `D:/wt-targets/o1-clang/debug/deps/o1_probe-1302719615501df6.exe`, rc 0 (my first call mangled `/DEPENDENTS` into a path, rc 157, and I reran it with `MSYS2_ARG_CONV_EXCL='*'`):
kernel32.dll, bcryptprimitives.dll, api-ms-win-core-synch-l1-2-0.dll, KERNEL32.dll, WS2_32.dll, RstrtMgr.DLL, ntdll.dll, USERENV.dll, MSVCP140.dll, VCRUNTIME140.dll, VCRUNTIME140_1.dll, and the api-ms-win-crt-* set (string, math, runtime, heap, environment, filesystem, convert, stdio, locale). No clang, compiler-rt or libc++ DLL appears.

## Hold lines (my own project's only; the `also=` segment of each is elided because it names another process)
All were `MACHINE_HOLD shared project=SpatialIDE cores=0-7 affinity=FF shell=bash.exe:<pid> …` and `MACHINE_RELEASED project=SpatialIDE shell=bash.exe:<pid> affinity=FF (cores 0-7)`. No exit code 96 to 99 appeared.

| Hold (-What) | pid | command rc |
|---|---|---|
| `o1-clang P0b: cargo clean -p libduckdb-sys` | 29812 | 0 |
| `o1-clang P0b: cargo test --no-run (clang-cl DuckDB build)` | 35268 | 0 |
| `o1-clang P0b: probe run 1` | 10800 | 0 |
| `o1-clang P0b: probe run 2` | 40664 | 0 |
| `o1-clang P0b: engine suite` | 32248 | 101 (the probe's env-var panic) |
| `o1-clang P0b: engine suite remainder after o1_probe` | 28316 | 0 |
| `o1-clang P0b: engine doc-tests` | 43956 | 0 |

## Failure classes as they apply to this harness
- The harness uses the interface the product exposes (the engine's `AdmittedPredicate`, `Dataset::stream_with_cancel`, `next_into`).
- Every result claim points to a log that exists, under `D:/wt-targets/o1-clang-data/attempt-2` (`run1.log`, `run2.log`, `suite.log`, `suite-rest.log`, `suite-doc.log`, `run1/`, `run2/`) and my scratch folder (`o1p0b-*` files: `o1p0b-build.log`, `o1p0b-running.txt`, `o1p0b-check2.out`, `o1p0b-erun1.txt`, `o1p0b-erun2.txt`, `o1p0b-dumpbin.txt`).
- The probe asserts nothing and grades nothing, so every cell outcome is read from its printed lines.
- No timed measurement was made.

## Housekeeping
- I wrote nothing outside `C:/dev/wt/o1-clang` (the one config line), `D:/wt-targets/o1-clang`, `D:/wt-targets/o1-clang-data/attempt-2` and my scratch folder, with two small exceptions. I made two throwaway files in the shell's `/tmp` by mistake (one hash list and one temp file) and deleted both in the same minute with `rm -f` (rc 0). The wrapper noted that the awk and check scripts were modified on disk, which was me editing them.
- No process I started still runs. After my last call `tasklist` found no cargo, rustc, clang-cl, link or probe process. Two short-lived `cargo.exe` processes appeared in one `ps` check, started a second before it, and were gone on the next check. They were not mine; I started no process at that time, and I did not touch them.
- Nothing was killed. The scratch folder has my `o1p0b-` files and the earlier `o1p0d-` files from the first attempt, which I did not touch.
