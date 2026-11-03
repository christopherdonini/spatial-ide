# Cloud session 4: integer-overflow outcomes and the redaction scan's cost, measured on Linux

*Measured on 2026-11-03 in a Claude Code cloud session, a Linux KVM guest, at main
`6b67d44bc242dc1cbc9f73efdbd7cd20e4ecd1f4`, and committed on branch `cloud/linux-measurements`. This is a
measurement report. It grades nothing and decides nothing. It edits no form, ADR or PLAN row, and no
figure in it is a docs/08 figure. Every outcome is read from a file in this folder, named where it is
used.*

## What this session did and did not do

- It changed no tracked file. It wrote only new files under `state/consults/cloud/linux-measurements/`.
  Build output, fixtures and raw logs went to the session's scratch directory, outside the checkout
  (written `<SCRATCH>` in the filed logs).
- It made one branch, `cloud/linux-measurements`, with signed-off commits, and pushed it. It opened no
  pull request and no issue, posted no comment and made no fork.
- The harness is its own Cargo workspace (`harness/`), not a member of the root workspace. Its
  `Cargo.lock` is the root's, copied at `6b67d44b`. Its 273 shared entries match the root's exactly, in
  name, version, source and checksum (checked by script), and it adds only the two harness packages.

## The host

| | |
|---|---|
| CPU | `Intel(R) Xeon(R) Processor @ 2.10GHz` (lscpu: family 6, model 207, stepping 2), 4 vCPUs (1 thread per core, 4 cores, 1 socket), KVM guest |
| Caches (lscpu) | L1d 192 KiB (4 instances), L2 8 MiB (4 instances), L3 260 MiB (1 instance) |
| Memory | 16,872,804,352 B, no swap |
| OS | Ubuntu 24.04.5 LTS, kernel `6.18.44-fc-v230` |
| Rust | `rustc 1.97.0 (2d8144b78 2026-07-07)`, host `x86_64-unknown-linux-gnu`, LLVM 22.1.6; `cargo 1.97.0` |
| C++ | `c++ (Ubuntu 13.3.0-6ubuntu2~24.04.1) 13.3.0`: `/usr/bin/c++` → `/etc/alternatives/c++` → `/usr/bin/x86_64-linux-gnu-g++-13` |
| Frequency control | none visible to the guest (`/sys/devices/system/cpu/cpu0/cpufreq` absent). The host's turbo, frequency and co-tenancy cannot be seen from inside |

Source: `host.txt`.

## Task A: the admitted BIGINT product on a GCC build of the bundled DuckDB

The form is `governance/forms/engine/ADMITTED-INTEGER-OVERFLOW-SILENT-WRAPAROUND-PREREGISTRATION.md`. Its
§2c says of Linux: "GCC 5 or later takes the builtin path by source, and §4 on the L1 entry shows it."
Below is what this host's build and runs show. Nothing here is a §4 run on the L1 CI entry.

### The build, and what its log names

- **Command:** `cargo test -p spatial-engine --locked --lib --test admitted_integer_overflow --test
  stream_fetch_overflow --test admission_property_campaign --no-run -vv`. It ran from the repository root,
  with `CC_ENABLE_DEBUG_OUTPUT=1` (so the `cc` crate's `running:` lines reach the log), on a fresh
  target in scratch, with 4 jobs. It exited 0. Cargo's own line reads `Finished test profile
  [unoptimized + debuginfo] target(s) in 11m 43s`; that is cargo's line, not a measurement.
- **The compiler:** the log has 352 DuckDB compile units. All 352 name `c++` as the program, and all
  352 carry one identical flag set: `-O2 -ffunction-sections -fdata-sections -fPIC -m64 -w -std=c++11
  -w -DDUCKDB_EXTENSION_CORE_FUNCTIONS_LINKED=1 -DDUCKDB_EXTENSION_JSON_LINKED=1
  -DDUCKDB_EXTENSION_PARQUET_LINKED=1 -DDUCKDB_EXTENSION_AUTOINSTALL_DEFAULT=1
  -DDUCKDB_EXTENSION_AUTOLOAD_DEFAULT=1 -DNDEBUG`.
  - `cc`'s compiler-family probe printed `#pragma message "gcc"` (5 times).
  - `c++` is GCC 13.3.0. With empty input, `c++ -dM -E` defines `__GNUC__ 13`, `__GNUC_MINOR__ 3` and
    `__GNUC_PATCHLEVEL__ 0`, and does not define `__clang__`.
  - The build script's only `cargo:warning` lines (5 × 3) come from `cc`'s `c++ -?` probe, which GCC
    rejects. The workspace's own crates gave one Rust warning: `WATCH_BUFFER_BYTES` is never used
    (`engine/src/watch.rs:73`, on this non-Windows target).
- **The DuckDB version:** the log says `Compiling libduckdb-sys v1.10505.0`. The vendored source that
  this build unpacked and compiled defines `DUCKDB_VERSION "v1.5.5"` and `DUCKDB_SOURCE_ID "d8cdaa33fd"`
  (`src/function/table/version/pragma_version.cpp:11` and `:14`). At run time, `pragma_version()` returned
  `("v1.5.5", "d8cdaa33fd")`. Those are the version and source id the Windows runs report.
- **The int64 multiply, by source:** `src/function/scalar/operator/multiply.cpp:193` (sha256
  `2332e8cc…c4da`) is `#if (__GNUC__ >= 5) || defined(__clang__)`, over `__builtin_mul_overflow`. The
  file reaches the build through unit `ub_src_function_scalar_operator.cpp:5`, one of the 352 above. That
  the preprocessor took the builtin branch is read from the defines; it was not observed in the object
  code.

Sources: `task-a/build-facts.txt` and `task-a/duckdb-compile-units-dev.txt` (one line per unit, flags
without the `-I` options).

### The pinned overflow tests, and the suites §4 says must stay green

Each was run once, from the repository root, on that build. The whole output is in `task-a/pinned-tests.txt`.

| Target | Tests | Result |
|---|---|---|
| `engine/tests/admitted_integer_overflow.rs` (T-A to T-E) | 5 | 5 passed, 0 failed |
| `engine/tests/stream_fetch_overflow.rs` | 1 | 1 passed |
| `engine/tests/admission_property_campaign.rs` (including `an_admitted_integer_overflow_ends_the_stream_with_the_fixed_detail`, `filter_admission_property_campaign`, `a_join_of_clauses_each_admitted_alone_…`) | 4 | 4 passed |
| `engine/tests/filter_type_admission.rs`, `the_type_walk_agrees_with_the_binder_over_the_p0_matrix` | 1 | 1 passed |
| lib, `predicate::tests::the_walk_types_every_arithmetic_node_as_the_binder_does` | 1 | 1 passed |
| lib, `stream::tests::filter_composition::the_where_composition_matrix_matches_the_declared_rule_exactly` | 1 | 1 passed |

The rest of the engine suite was not run.

### The P0 cells, against exact i128 arithmetic

- **The harness:** `harness/o1-probe/src/main.rs`, a binary in the harness workspace. It uses the engine's
  public interface only: `AdmittedPredicate::admit`, `Dataset::stream_with_cancel` drained with
  `next_into`, and the `fixture` writer.
- **It linked the same DuckDB build** the pinned tests ran on. Its build log shows `Fresh
  libduckdb-sys v1.10505.0` with the same build directory hash.
- **The files** are those of lead-data's probe design (A, B and B3 in the three writers `-ar-s`,
  `-ar-n` and `-dk`; S and R in `-ar-n`) and the pinned test's two-column files (T-c, T-o and its mirror,
  T-e, T-m), plus one two-column file added after the first results (T-e-swap, below). All 18 passed
  their checks before use: row groups and statistics as declared, a readback with 0 mismatches, and
  `Dataset::open` Ok with Int64 columns.
- **The runs:** every engine cell ran in both shapes (`all`, and the viewport over the file's extent
  with the limit at rows + 1), twice each, in each of two processes.
  - The two processes' outputs are identical once the scratch path and times are masked.
  - The 24 parquet files each process wrote (the 18 above and their 6 base files) are byte-identical
    across the two (`task-a/probe-fixtures-sha256.txt`).
- **The terms:**
  - X is the id set exact i128 arithmetic selects.
  - W is the set two's-complement wrapping selects, given for reference only.
  - "Fixed" means the stream's error Display equals the engine's fixed detail byte for byte, with no
    batch delivered. The text is `query: [P6 placeholder] a value computed while this query ran was out
    of range for its type; the row values and the query text are withheld`.
- **The tally:** 224 admitted engine runs (56 file and predicate pairs × 4).
  - 156 ended in the fixed detail with no batch.
  - 68 completed, every one with exactly X's id set and no duplicate id.
  - 0 had any other terminal. 0 completed with a set other than X: the S1 condition was met by no run.

In the table, "4/4" is two shapes × two repetitions, identical again in the second process. "Overflow
rows" counts the rows whose exact product leaves int64.

| Form cell | File | Predicate | Overflow rows | \|X\| | \|W\| | Outcome on this host |
|---|---|---|---|---|---|---|
| W | A-ar-s, A-ar-n, A-dk | `v * v > 0` | 1,024 | 2,047 | 1,023 | fixed, 4/4 on each file |
| W | A-ar-s, A-ar-n, A-dk | `v * v < 0` | 1,024 | 0 | 1,024 | fixed, 4/4 on each file |
| W | B-ar-n | `v * v > 0` / `< 0` | 1 | 2,047 / 0 | 2,046 / 1 | fixed, 4/4 each |
| W | S-ar-n | `v * v > 0` / `< 0` | 4 | 6 / 0 | 2 / 4 | fixed, 4/4 each |
| W, second row group | B3-ar-n | `v * v > 0` / `< 0` | 1 | 4,094 / 0 | 4,093 / 1 | fixed, 4/4 each |
| F | B-ar-s, B-dk | `v * v > 0` / `< 0` | 1 | 2,047 / 0 | 2,046 / 1 | fixed, 4/4 each. EXPLAIN shows a FILTER over READ_PARQUET and `EMPTY_RESULT` 0 times, for both predicates on both files |
| F, second row group | B3-ar-s, B3-dk | `v * v > 0` / `< 0` | 1 | 4,094 / 0 | 4,093 / 1 | fixed, 4/4 each; `EMPTY_RESULT` 0 times |
| Exact control P3 | A-ar-n, B-ar-n, B3-ar-n (no statistics) | `(v * v) IS NOT NULL` | 1,024 / 1 / 1 | all rows | all rows | fixed, 4/4 each |
| Exact control P3 | A-ar-s, A-dk, B-ar-s, B-dk, B3-ar-s, B3-dk (statistics) | `(v * v) IS NOT NULL` | 1,024 or 1 | 2,048 or 4,096 | the same | completed, equal to X, 4/4 each |
| R (stream) | R-ar-n | `v * v > 0` / `< 0` | 2 | 3 / 0 | 2 / 0 | fixed, 4/4 each |
| Refusal control C1 | A-ar-s, B-ar-s | `v * v` | — | — | — | refused, `NotBoolean` (`skp.filter_not_boolean`): "refused: the predicate's inferred type is Int64, not BOOLEAN; an implicit conversion to BOOLEAN is not performed (docs/01 principle 8)" |
| Refusal control C2 | A-ar-s, B-ar-s | `v * 1.5 > 0` | — | — | — | refused, `TypeNotAdmitted` (`skp.filter_type_not_admitted`): "refused: `*` over BIGINT and DECIMAL(2,1) literal: a conversion that can fail during the scan (docs/01 principle 8)" |
| L1 | B-ar-s | `4000000000 * 4000000000 > 0` | 0 (literal) | 2,048 | — | completed, 2,048 ids, equal to X, 4/4 |
| L2 | B-ar-s | `4000000000 * 4000000000 < 0` | 0 (literal) | 0 | — | completed, 0 ids, equal to X, 4/4 |
| L3 | B-ar-s | `4294967296 * 4294967296 > 0` | 0 (literal) | 2,048 | — | completed, 2,048 ids, equal to X, 4/4 (recorded, not graded, as the form has it) |
| L4, one-sided | B-ar-s | `268435456 * 1152921504606846976 > 0` | 0 (literal) | 2,048 | — | completed, 2,048 ids, equal to X, 4/4 |
| T-c, two-column | T-c-ar-n | `a * b > 0` / `< 0` / `(a * b) IS NOT NULL` | 2 | 2 / 1 / 3 | 2 / 1 / 3 | fixed, 4/4 each |
| T-c, two-column | T-c-ar-s | `a * b > 0` / `< 0` | 2 | 2 / 1 | 2 / 1 | fixed, 4/4 each |
| T-c, two-column | T-c-ar-s | `(a * b) IS NOT NULL` | 2 | 3 | 3 | completed, equal to X, 4/4 |
| T-o, one-sided columns | T-o-ar-n, T-o-mirror-ar-n | `a * b > 0` | 1 | 2 | 1 | fixed, 4/4 each |
| T-o, one-sided columns | T-o-ar-n, T-o-mirror-ar-n | `a * b < 0` | 1 | 0 | 0 | fixed, 4/4 each |
| T-o (not a §3 cell) | T-o-ar-n, T-o-mirror-ar-n | `(a * b) IS NOT NULL` | 1 | 2 | 2 | fixed, 4/4 each |
| T-e, exact two-column | T-e-ar-n | `a * b > 0` / `< 0` / `(a * b) IS NOT NULL` | 0 | 4 / 1 / 5 | 4 / 1 / 5 | completed, equal to X, 4/4 each |
| T-m, both raise | T-m-ar-n | `a * b > 0` | 2 | 3 | 1 | fixed, 4/4 |
| T-m (not §3 cells) | T-m-ar-n | `a * b < 0` / `(a * b) IS NOT NULL` | 2 | 0 / 3 | 1 / 3 | fixed, 4/4 each |
| T-e-swap (added after the first results; not a §3 cell) | T-e-swap-ar-n: (2, 3), (−2147483648, 4294967296) | `a * b > 0` / `< 0` / `(a * b) IS NOT NULL` | 0 | 1 / 1 / 2 | 1 / 1 / 2 | completed, equal to X, 4/4 each |

**Independent products**, run per row as `SELECT a * b AS p FROM read_parquet(?) WHERE id = k` on a
fresh `configured_connection()`. All 29 rows agree with i128 arithmetic: each product that fits returned
its exact value, and each one that does not raised `Out of Range Error: Overflow in multiplication of
INT64 (…)!`.

| File | Rows whose product fits (exact value returned) | Rows whose product leaves int64 (raised) |
|---|---|---|
| S-ar-n | k=0 (4), k=1 (3037000499² = 9223372030926249001) | k=2 (3037000500²), k=3 ((−3037000500)²), k=4 (4000000000²), k=5 (4294967295²) |
| R-ar-n | k=0 (4) | k=1 (4294967296²), k=2 (3600000000003999000²) |
| T-c-ar-n, T-c-ar-s | k=0 (6) | k=1 (3037000500 × 4000000000), k=2 (−4000000000 × 4294967295) |
| T-o-ar-n, T-o-mirror-ar-n | k=0 (6) | k=1 (2^28 × 2^60, both orders; X = 309485009821345068724781056, W = 0) |
| T-e-ar-n | all five: 6; 2147483648² = 4611686018427387904; −4294967296 × 2147483648 = −9223372036854775808 (i64::MIN); 9223372036854775807 × 1; 3037000499² | none |
| T-m-ar-n | k=0 (6) | k=1 (4294967296²), k=2 (−1 × −9223372036854775808) |
| T-e-swap-ar-n (added) | k=0 (6), k=1 (−2147483648 × 4294967296 = −9223372036854775808, i64::MIN) | none |

**The literal products alone**, each as `SELECT <product> AS p`: `4000000000 * 4000000000`, `3037000500 *
3037000500`, `4294967296 * 4294967296`, `268435456 * 1152921504606846976`, and its mirror. All five
raised `Out of Range Error: Overflow in multiplication of INT64 (…)!`. The same products inside an
admitted predicate on B-ar-s (L1 to L4 above) completed equal to X.

Sources: `task-a/probe-run1.txt` and `task-a/probe-run2.txt` (every CELL, PERK, CONTROL, LITERAL,
EXPLAIN and FILE line), and `harness/o1-probe/src/main.rs`.

### Beside the Windows record, for reference only

The Windows clang-cl P0 is recorded in
`state/consults/2026-10-27-admitted-integer-overflow-silent-wraparound-p0-second-run-tester-high-report.md`,
§ P-7. For every cell that record lists, this host's outcome class is the same: fixed, completed equal to
X, or refused with the same code and text. That includes the six statistics-file P3 cells and T-c-ar-s
Q3, which complete equal to X there too, and L1 to L4. The pairs marked "not a §3 cell" above have no Windows
counterpart in that record.

One row differs from what the form's amendments record for the MSVC build: a product whose exact
value is i64::MIN.
- **The MSVC record:** Amendment 5 records T-e-ar-n's `a * b > 0` ending in the fixed detail on MSVC,
  although every product fits. Amendment 8 (A.1) reads that as the MSVC path flagging a product of
  magnitude exactly 2^63. Its figure is `SELECT a * b` over the row (−2147483648, 4294967296), which raised
  `Out of Range Error`.
- **This host:** both operand orders return −9223372036854775808 exactly in the per-row query: T-e's
  row (−4294967296, 2147483648), and Amendment 8's own row (−2147483648, 4294967296) in the added file
  T-e-swap. Every engine cell on both files completed equal to X, and T-B, which covers T-e, passed.
- **About T-e-swap:** it was added after the first two probe runs had been seen. Both processes were
  then run again with it. Every line of the first runs reappears unchanged in the final runs; only
  T-e-swap's lines and the tally are new.
- This host has no MSVC build, so this compares records. It is not an observation of MSVC.

### Not shown here

- No §4 run on the CI L1 entry, and no mutation (M1 to M4) was applied.
- No macOS behaviour.
- No GCC version other than 13.3.0.
- No release build of DuckDB under these cells.
- No timing: no figure in Task A is a measurement.

## Task B: the per-byte cost of `bundle::redaction::scan`, Linux only

TASK_B_PLACEHOLDER

## Files in this folder

FILES_PLACEHOLDER
