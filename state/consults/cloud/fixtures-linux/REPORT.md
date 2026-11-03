# Fixture determinism on Linux: G5 and S regenerated off Windows

**Cloud session 3, 2026-11-03, measurement only.** This report decides nothing; every sentence below
is a measured value, a command that was run, or a reading of a named file. It answers
`kernel/FIXTURES.md`'s open line "Cross-machine or cross-toolchain-version determinism is NOT
established" for one Linux machine and one toolchain.

- **Measured commit:** `6b67d44bc242dc1cbc9f73efdbd7cd20e4ecd1f4` (`main` when the clone was made).
  `origin/main` moved to `84a90e26` during the session; `git diff --stat 6b67d44 origin/main` over
  `engine/src/fixture.rs`, `engine/Cargo.toml`, `Cargo.lock`, `kernel/tests/regenerate_fixture.rs`,
  `kernel/tests/regenerate_fixture_s.rs`, `kernel/tests/support/mod.rs`, `kernel/FIXTURES.md` and
  `engine/tests/import_layout_fixtures.rs` is empty.
- **No tracked file was changed.** The build directory and every fixture were written under the
  session's scratch directory (`$SCRATCH` below), outside the checkout; `--locked` held `Cargo.lock`.
  No fixture file is committed. This folder holds only this report, `harness-sources.md` and two
  `.tsv` tables.

## 1. Result

| Fixture | Recorded (Windows) size | Recorded SHA-256 | Linux size | Linux SHA-256 | Size | Hash |
|---|---|---|---|---|---|---|
| **G5** `parcels-5gb.parquet` | 5,004,376,705 B | `5ae955c5fb7ee4d3f10436df271e19361d84f0845fbaa69dc60516f1b60c1788` | **5,004,376,709 B** | **`fd482403101dd9f1f4d7ff5a64087cb847f3e768def2096c0b4b6fc37bd2ed60`** | **+4 B** | **differs** |
| **S** `parcels-145mb.parquet` | 151,629,665 B | `fe61e704fcc01d40b0e453d81a4987fc23862dcc38d62bd1f9635d124433ac7a` | 151,629,665 B | **`2cb1c6b10959279d40285cd80a0c3d6ce9a84b2d5eda286bdce4c173c9308049`** | equal | **differs** |

Where the recorded values come from: `kernel/FIXTURES.md`'s two tables (Size and SHA-256 rows for G5
and S); `engine/tests/import_layout_fixtures.rs`'s `FIRST_BATCH_S_SHA256` (S's hash, the same value;
that file records no size). The same values also stand in `kernel/tests/regenerate_fixture_s.rs`
(`S_BYTES`, `S_SHA256`) and `engine/tests/import_layout_5gb_fixtures.rs` (`G5_SHA256`).

The Linux values repeat on this machine:

| File | Writer | Size | SHA-256 |
|---|---|---|---|
| G5 | in-repo entry point at `6b67d44` | 5,004,376,709 | `fd482403…2ed60` |
| G5 | in-repo entry point at `f7bb537` (section 4) | 5,004,376,709 | `fd482403…2ed60` |
| G5 | out-of-repo harness `gen_g5` (section 3) | 5,004,376,709 | `fd482403…2ed60` |
| S | out-of-repo harness `gen_s`, run 1 | 151,629,665 | `2cb1c6b1…08049` |
| S | out-of-repo harness `gen_s`, run 2 | 151,629,665 | `2cb1c6b1…08049` |

## 2. Environment

| | This run (Linux) | Windows, as the repository records it |
|---|---|---|
| OS | Ubuntu 24.04.5 LTS, kernel 6.18.44-fc-v230, x86_64, glibc 2.39-0ubuntu8.9 | Windows 10 Pro 22H2 (build 19045) |
| CPU / RAM / disk | Intel Xeon @ 2.80GHz, 4 vCPU (flags include `avx2`, `fma`, `avx512f`); 15 GiB; ext4 on a virtual disk | not restated here |
| rustc | `rustc 1.97.0 (2d8144b78 2026-07-07)`, host `x86_64-unknown-linux-gnu`, LLVM 22.1.6 | `rustc 1.97.1 (8bab26f4f 2026-07-14)`, MSVC (`kernel/RESULTS.md`, "The drill — clean-directory clone, 2026-09-19", its Machine line; `state/consults/2026-10-24-publish-sort-window-cancel-not-exercised-on-ci-worker-report.md`). The two forms that record the Windows regenerations do not name a rustc version. |
| cargo | `cargo 1.97.0 (c980f4866 2026-06-30)` | 1.97.1 (same sources) |
| C/C++ for bundled DuckDB | gcc/g++ 13.3.0 (DuckDB is not on the fixture writer's path) | clang-cl (`engine/Cargo.toml`) |

**Crate versions, from `Cargo.lock` at `6b67d44`:** `parquet` **58.4.0**; `arrow` **58.4.0**, and
every `arrow-*` crate in the lock (`arrow-arith`, `-array`, `-buffer`, `-cast`, `-data`, `-ipc`,
`-ord`, `-row`, `-schema`, `-select`, `-string`) at 58.4.0; `snap` 1.1.2 (the Snappy codec);
`duckdb` / `libduckdb-sys` 1.10505.0 (not on the writer's path). `parquet`, `arrow`, `arrow-array`,
`snap` and `duckdb` stand at the same versions in `Cargo.lock` at `f7bb537` (G5's last recorded
Windows regeneration) and at `d505a60` (S's recorded Windows regeneration).

## 3. What was run

All cargo commands ran with `CARGO_TARGET_DIR=$SCRATCH/target`. The kernel's dev-dependency already
turns on `spatial-engine`'s `fixture` feature; `--features spatial-engine/fixture` is passed to state
it and changes nothing.

1. **Build:** `cargo test --locked --release -p spatial-kernel --features spatial-engine/fixture
   --test regenerate_fixture --test regenerate_fixture_s --no-run`. Exit 0. One compiler warning
   (`WATCH_BUFFER_BYTES` in `engine/src/watch.rs` never used; its one user is the `#[cfg(windows)]`
   watcher module), no error.
2. **G5, the documented entry point:** `SPATIAL_REGEN_OUT=$SCRATCH/out/g5/parcels-5gb.parquet cargo
   test --locked --release -p spatial-kernel --features spatial-engine/fixture --test
   regenerate_fixture -- --ignored --exact regenerate_parcels_5gb_fixture --nocapture`. Passed;
   printed `[regenerate] 3300000 features, 5004376709 B`. Size and hash read afterwards with `stat`
   and GNU `sha256sum`.
3. **S, the documented entry point:** the same command shape with `--test regenerate_fixture_s` and
   `regenerate_parcels_145mb_fixture`, output `$SCRATCH/out/s-entry/parcels-145mb.parquet`. **It
   refuses on Linux, before writing:** it panicked in `require_floor`
   (`kernel/tests/regenerate_fixture_s.rs`, the `drive_of(dir).unwrap_or_else` line) with
   `no drive in $SCRATCH/out/s-entry: refusing`, exit 101, 0.53 s wall. It had created the empty
   output folder; no file was written. This is the refusal its own module comment states ("Off
   Windows the drive is not read and the entry point refuses") and `kernel/FIXTURES.md`'s
   "(Windows only)". The other two in-repo writers of S cannot write it here either: both run a
   PowerShell free-space check on `C:` first (`engine/tests/import_layout_fixtures.rs`'s
   `require_disk`, and `kernel/tests/first_batch_factorial.rs` through `kernel/tests/support/mod.rs`'s
   `require_disk`), which reads 0 B free when `powershell` is absent and refuses.
4. **S, through an out-of-repo harness** (`harness-sources.md`, `gen_s`): one call to
   `spatial_engine::fixture::write_geoparquet_cancellable(path, &spec_s(), &CancelToken::new(), None)`
   with `spec_s()` restated field for field from `kernel/tests/regenerate_fixture_s.rs`. This is the
   call the entry point makes after its disk check. The entry point writes to `<name>.partial` and
   renames; the harness writes the final name directly. **Fidelity check:** the same harness,
   with `spec_5gb()` restated from `kernel/tests/regenerate_fixture.rs`'s
   `spec_5gb_matches_the_scale_pass` literals (`gen_g5`), wrote G5 byte-identical to the in-repo
   entry point's Linux output (`fd482403…`, 5,004,376,709 B).
5. **Attribution check, code against platform:** `f7bb537` is the commit at which the latest Windows regeneration of G5
   this session found recorded produced `5ae955c5…`
   (`governance/forms/kernel/FIXTURE-REGENERATION-ENTRY-POINT-PREREGISTRATION.md`, Amendment 2, item
   4, `finished in 121.01s`). Its `Cargo.toml`, `Cargo.lock`, `engine/`, `kernel/`, `protocol/`
   and `renderer/` were exported with `git archive f7bb537` into `$SCRATCH` and its own G5 entry
   point was run there, same command. It wrote **`fd482403…`, 5,004,376,709 B**: the same bytes as
   `6b67d44` on Linux. Between the two commits `engine/src/fixture.rs` gained 1,032 lines and lost
   60 (`git diff --stat`); none of it moves G5's bytes on Linux. For S the writer is unchanged:
   between `d505a60` (S's Windows regeneration, 2026-10-27) and `6b67d44`, `git diff --stat` over
   `engine/src/fixture.rs` and `Cargo.lock` is empty (only `kernel/tests/regenerate_fixture_s.rs`
   changed, +22 comment lines). **Both mismatches are therefore between platforms at the same writer
   code and the same crate versions, not between code versions.**

## 4. Timings (wall clock, single runs)

| Step | Linux (this run) | Windows record |
|---|---|---|
| Release build, cold (crate downloads, bundled DuckDB, 230 compile units) | **19 m 31 s** real (68 m 11 s user, 3 m 55 s sys) | not compared |
| G5 entry point at `6b67d44` | **56.99 s** (`finished in`); 57.5 s cargo wall | 117.93 s and 121.01 s (`finished in`; the form named in section 3, item 5: its Results' byte-identity proof and its Amendment 2, item 4) |
| `sha256sum` of G5 | 16.9 s | — |
| G5 entry point at `f7bb537` | 45.99 s (`finished in`); its build 26.3 s (DuckDB reused) | — |
| G5 via harness `gen_g5` (write only) | 49.80 s; `sha256sum` 17.2 s | — |
| S entry point | refused after 0.16 s (`finished in`), 0.53 s wall | 16.53 s for the whole test, disk read, write and hash included (`state/consults/2026-10-27-fixture-s-regeneration-entry-point-build-worker-report.md`); not comparable to the next row |
| S via harness `gen_s` (write only) | 1.05 s and 1.25 s (two runs) | — |
| Harness build | 15 m 47 s: run outside the checkout, so `.cargo/config.toml`'s `[env]` entries did not apply and cargo recompiled `libduckdb-sys` and others | — |

These are single runs on a shared cloud VM. They are not docs/08 measurements, and no performance
claim is made from them.

## 5. Disk

Free-space figures are from `df -B1 /`; sizes are from `du -sb` and `stat`.

| Point | Used on `/` | Note |
|---|---|---|
| Before the build | 9,146,675,200 B (32,136,859,648 B available) | `~/.cargo/registry` absent |
| After the build | 10,895,106,048 B | **+1,748,430,848 B**, of which the target directory is 1,461,914,257 B and the cargo registry 204,329,827 B |
| After G5 at `6b67d44` | 15,899,615,232 B | **+5,004,439,552 B** for one 5,004,376,709 B file |
| Highest sample, two G5 copies on disk at once | 22,141,083,648 B | 12,994,408,448 B above the pre-build figure |
| Target directory at the end | 2,366,420,276 B | after the harness and `f7bb537` builds |

One S file is 151,629,665 B. One cold build plus one G5 took about 6.75 GB on this platform. The
S entry point's 2×S floor (303,259,330 B) is never reached on Linux, because the refusal comes first.

## 6. Parquet footers

The Windows files are not reachable from this container, so **no footer of either Windows file was
read.** The table compares each Linux footer, read with the harness's `footer` (parquet 58.4.0's
`SerializedFileReader`), with what the repository records about the Windows file.

| Field | G5, Linux | S, Linux | Recorded for the Windows file |
|---|---|---|---|
| `created_by` | `parquet-rs version 58.4.0` | `parquet-rs version 58.4.0` | not recorded for either file. The lock pins parquet 58.4.0 at both recording commits, so the same string would follow, but it was not observed |
| format version | 1 | 1 | not recorded |
| rows | 3,300,000 | 100,000 | G5: 3,300,000 features (`kernel/RESULTS.md`, "Fifth section — 2026-08-07, the 5 GB scale pass", the Fixture row of its scope table) |
| **row groups** | **403** | **13** | G5: 403. The scale pass's Fixture row says they "follow arithmetically but were **never read back**"; later, `kernel/RESULTS.md`'s "The 5 GB spot cells" records the reused Windows file as "5,004,376,705 B, **403 row groups**", and `governance/forms/engine/LOD-PREREGISTRATION.md` §0, item 2, cites 403 from the LOD route-B run over it. S: 13 (`kernel/RESULTS.md`, "The fixtures — three at the 145 MB class") |
| **compression** | SNAPPY on all 2,418 column chunks | SNAPPY on all 78 column chunks | not recorded. The writer sets `Compression::SNAPPY` in `engine/src/fixture.rs`'s `generate()` for every fixture |
| encodings | `PLAIN, RLE, RLE_DICTIONARY` on every chunk | same | not recorded |
| statistics | present on every chunk | same | not recorded |
| columns | `id` INT64 (UINT_64); `bbox.xmin`, `bbox.ymin`, `bbox.xmax`, `bbox.ymax` DOUBLE; `geometry` BYTE_ARRAY | same | — |
| key-value metadata | `geo` 2,404 B; `license` 9 B; `attribution` 20 B; `redistribution` 9 B; `ARROW:schema` 584 B | the same five keys, each value byte-identical to G5's (same SHA-256) | not recorded |
| column bytes, compressed / uncompressed | 5,003,434,162 / 5,745,648,342 | 151,597,311 / 174,033,307 | not recorded |

The writer's own counts (`FixtureFacts`, printed by the harness) for G5 are 3,300,000 features,
**345,507,850 vertices and 3,771,429 rings**. These are the Windows file's recorded counts
(`kernel/RESULTS.md`'s fifth section: the Fixture row, and the vertices and rings rows of "The
fixture: predicted before generation, measured after"). For S they are
100,000 features, 10,465,165 vertices and 114,286 rings; no Windows record of S's vertex count was
found. `coord_bits_xor` is G5 `0x000fdab61a8940c3` and S `0xc3b57189f592028e`; no record of it
for the Windows files was found.

**What differs, as far as it can be read here.** Every footer-level fact the repository records
about the Windows files agrees with the Linux files: row counts, row groups (403 and 13), and, for
G5, the seeded structure (features, vertices, rings). `created_by` and compression are not recorded
for the Windows files. What differs is the file content: S's bytes at equal length, and G5's bytes
plus 4 B of length. Without the Windows file it cannot be said where in the file the bytes first
differ: which row group, which column chunk, data pages or footer. `g5-linux-rowgroups.tsv` and
`s-linux-rowgroups.tsv` hold the Linux per-row-group, per-column compressed sizes. The same
`footer` run against the Windows files would give the first row group and column whose size
differs; for S, where the sizes may all agree, a byte comparison would be needed.

## 7. A measured fact about this side's libm (not an established cause)

By reading `engine/src/fixture.rs`, the polygon path computes coordinates with `+ - * /`, `sqrt`
and `ceil` (all exactly specified by IEEE 754) and with `a.cos()` and `a.sin()` in `ring()`, whose
results IEEE 754 does not fix bit for bit. The ring sizes the two specs use are m = n − 1 points
before the closing repeat: outer rings m = 49..=149 and holes m = 15..=49 (`parcel()`, with
`avg_vertices` 100).

- `nm -D` shows that the G5 test binary, the harness's `gen_s` and the probe below all import glibc's
  **`sincos@GLIBC_2.2.5`**. LLVM fused the `sin`/`cos` pair on this target. What the Windows build
  calls was not observed.
- Probe (`harness-sources.md`, `libm/angles.rs` and `libm/check.py`): for every angle
  `a = (i as f64 / m as f64) * TAU` with m = 3..=400 (80,197 angles), the bits this build returns
  for `a.sin()` and `a.cos()` were compared with the correctly rounded double of the exact value,
  computed in Python `decimal` at 80 digits and again at 140 digits, with the same outcome. glibc
  2.39 on this CPU returns **109 `sin` and 71 `cos` results that are not the correctly rounded
  double**, each 1 ULP away. **25 of them fall at m = 15..=149**, the sizes S and G5 use:

| m | i | fn | this libm (bits) | correctly rounded (bits) |
|---|---|---|---|---|
| 39 | 1 | sin | `3fc4885b5a98c648` | `3fc4885b5a98c647` |
| 40 | 33 | sin | `bfec83201d3d2c6e` | `bfec83201d3d2c6d` |
| 40 | 39 | sin | `bfc4060b67a8537e` | `bfc4060b67a8537d` |
| 49 | 11 | sin | `3fef96fe405f1ac6` | `3fef96fe405f1ac7` |
| 51 | 8 | sin | `3feaacdee8cc8dbc` | `3feaacdee8cc8dbd` |
| 61 | 52 | sin | `bfe9984878c6dcab` | `bfe9984878c6dcaa` |
| 78 | 2 | sin | `3fc4885b5a98c648` | `3fc4885b5a98c647` |
| 80 | 66 | sin | `bfec83201d3d2c6e` | `bfec83201d3d2c6d` |
| 80 | 78 | sin | `bfc4060b67a8537e` | `bfc4060b67a8537d` |
| 91 | 38 | cos | `bfebcdee2431fa0d` | `bfebcdee2431fa0c` |
| 98 | 22 | sin | `3fef96fe405f1ac6` | `3fef96fe405f1ac7` |
| 101 | 99 | sin | `bfbfc4ef93f2c6a2` | `bfbfc4ef93f2c6a1` |
| 102 | 16 | sin | `3feaacdee8cc8dbc` | `3feaacdee8cc8dbd` |
| 103 | 3 | sin | `3fc74b4ddfa3d728` | `3fc74b4ddfa3d727` |
| 114 | 11 | sin | `3fe23bde1b801fca` | `3fe23bde1b801fc9` |
| 116 | 69 | cos | `bfea7c6da34af8a0` | `bfea7c6da34af89f` |
| 117 | 3 | sin | `3fc4885b5a98c648` | `3fc4885b5a98c647` |
| 120 | 99 | sin | `bfec83201d3d2c6e` | `bfec83201d3d2c6d` |
| 120 | 117 | sin | `bfc4060b67a8537e` | `bfc4060b67a8537d` |
| 122 | 43 | cos | `bfe334f494318462` | `bfe334f494318461` |
| 122 | 104 | sin | `bfe9984878c6dcab` | `bfe9984878c6dcaa` |
| 140 | 47 | cos | `bfe069abbed33676` | `bfe069abbed33677` |
| 146 | 119 | cos | `3fd971576a869dca` | `3fd971576a869dcb` |
| 147 | 33 | sin | `3fef96fe405f1ac6` | `3fef96fe405f1ac7` |
| 147 | 137 | sin | `bfda87adc5c3a96e` | `bfda87adc5c3a96f` |

This says only that this side's libm is not correctly rounded on angles the generator uses, so two
conforming libms can return different bits for them. It does not show that the Windows bytes differ
because of it. The probe's output here is `angles.txt`, 80,197 lines, SHA-256
`d9eb01d2096ee3882775510adff8e5744880d842cbe1491886360396e1ab6c86` (`angles.rs` SHA-256
`d54870125fab25da9934f1ad7c17828c733b250bccd4a6533ac68f476715c124`). The same program built and run
on the Windows machine, with its `angles.txt` diffed against this one, would show whether the two
platforms return different bits for any of these angles. That run was not made.

## 8. Limits

- One Linux machine, one CPU model, one glibc (2.39), one rustc (1.97.0, one patch release below the
  Windows records' 1.97.1). glibc picks its `sincos` implementation by CPU features at load time, so
  Linux-to-Linux byte identity across CPUs or glibc versions is not established by this run either.
- The Windows files were not read; every Windows-side value above is the repository's record.
- On Linux, S was written by the harness, not by its entry point, which refuses off Windows by
  design. The harness's fidelity rests on the G5 parity in section 3, item 4.
- The `f7bb537` attribution check is for G5. For S it rests on the empty `git diff` in section 3,
  item 5.

## 9. Files in this folder

- `REPORT.md`: this report.
- `harness-sources.md`: the harness (`Cargo.toml`, `gen_s`, `gen_g5`, `footer`) and the libm probe
  (`angles.rs`, `check.py`), as text, with the checkout path written `<checkout>`.
- `g5-linux-rowgroups.tsv` (403 rows) and `s-linux-rowgroups.tsv` (13 rows): row group, rows, total
  compressed bytes, then compressed bytes per column (`id`, `bbox.xmin`, `bbox.ymin`, `bbox.xmax`,
  `bbox.ymax`, `geometry`), from the Linux files' footers.
