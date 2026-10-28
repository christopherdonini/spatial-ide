Reviewed: PR #266 at 492973009fbc1aaf31fcb12f6c974a0574ff1b4e (base af9c25bc), gate 1, reviewer
Verdict: FAIL

The engine work holds: the pinned test passes on Windows and Linux CI, and M2, M3 and M4 each fail where §4 predicts. The gate fails for two other reasons. On Windows, the shell's debug build now aborts inside DuckDB, so the shell's CI entry is red on both runs at the head (C-1). And the link line the human's ruling asks the PR's Windows build to capture is in neither CI log, although the PR body says it is (E-1).

Brief sha256 shown by command: 242271f5feb16f930d7cdd78fe49b92c672d097812f8ad0c03c4b0167a661fc8, which matches.

## Correctness (blocking)

**C-1. On Windows, the shell's debug build aborts inside DuckDB, and `product-ci-shell` is red at the head on both runs.**
- **What fails:** the job "typecheck · build · vitest · cargo test", in run 40684687264 (push) and run 40689099557 (pull_request). Both are at head 492973009fbc. Both runs fail the same way: `Assertion failed: result == static_cast<uint64_t>(__builtin_clzl(value_in)), file …\libduckdb-sys-21f59d0aa12a70a2\out/duckdb/src/include\duckdb/common/bit_utils.hpp, line 45`. The shell's lib test binary then exits with 0xc0000409.
- **Main is green on the same job:** run 40690150533 at 961b5d9b passes. So the regression comes from this piece.
- **Root cause, read from the vendored source** (`duckdb/src/include/duckdb/common/bit_utils.hpp:44-46` and `:61-63` in the libduckdb-sys 1.10505.0 extraction):
  - `CountZeros<uint64_t>::Leading` and `::Trailing` carry `#ifdef __clang__ D_ASSERT(result == __builtin_clzl(value_in))` (and `ctzl`). These builtins take `unsigned long`.
  - On Windows (LLP64) `long` is 32 bits, so under clang-cl the assert compares against a truncated value and fails.
  - `D_ASSERT` is plain `assert` (`assert.hpp:27`). It is live whenever NDEBUG is absent.
- **Why only the shell is hit:**
  - libduckdb-sys defines NDEBUG only when cargo's `DEBUG` is false (`build_bundled_cc.rs:127-133`).
  - The root workspace sets `[profile.dev.package.libduckdb-sys] debug = false` (`Cargo.toml:66-69`). My export build shows `-DNDEBUG` on all 352 units.
  - `frontends/shell/src-tauri` is its own workspace and has no `[profile]` table. Its dev and test builds therefore compile DuckDB with asserts on.
  - Under cl.exe (before this piece) and under GCC the `#ifdef __clang__` assert is compiled out. That is why main is green.
  - Release builds define NDEBUG, so `tauri build` passes and the installer is unaffected.
- **Reach:** ordinary use reaches this. Every Windows `cargo test` of the shell and every `npm run tauri dev` session aborts the first time DuckDB counts the zero bits of a non-zero value. The same exposure applies to `spikes/adr-029-g1-scan-progress`, which also depends on duckdb.
- **Gates it trips:** §8 item 13 ("Any CI entry red"). It is also a failed criterion that is not a build failure, so under the 2026-10-27 direction (item 4) and OPEN-4 (A) it stops and goes to the human.
- **Fix, for the custodian and the human; both options are scope additions:**
  - (a) `[profile.dev.package.libduckdb-sys] debug = false` (and `opt-level = 2`, as the root has) in `frontends/shell/src-tauri/Cargo.toml`. The shell's DuckDB then builds exactly as the root workspace's does. That file is outside §7's Scope, so it needs an amendment before the code.
  - (b) `-DNDEBUG` added to the `CXXFLAGS_x86_64-pc-windows-msvc` entry. That changes Amendment 2's bytes and the human's direction, item 2, so it needs the human's word.
  - Whichever is chosen, the source comment should name the LLP64 assert.

## Evidence (blocking)

**E-1. The PR's Windows CI does not capture the link line, and the PR body says it does.**
- **The requirement:** the human's ruling of 2026-10-28, item 1, reads: "the PR's Windows build captures the link line once, for the record". Amendment 3's ADR-030 bullet repeats it.
- **What the PR body says:** "the linker line itself is captured once by this PR's Windows CI, for the record".
- **What the CI logs hold:** neither Windows job log (push job 122803904852, pull_request run 40689099450) contains a `link.exe` line, a `running:` line, or the word clang-cl. Counts by grep over the downloaded logs: clang-cl 0, link.exe 0, `running:` 0. cargo hides both on success, and no workflow may change (§8 item 3).
- **What clang-cl on CI rests on instead:** behaviour, not a log line. T-A passes on windows-latest, and M1 shows the MSVC build fails T-A. The shell job's `#ifdef __clang__` assert also shows clang-cl compiled DuckDB there.
- **My local capture is supplementary, not the PR's Windows build.** `cargo rustc -p spatial-engine --locked --test admitted_integer_overflow -- --print link-args` on my export at 5d9a7eb3 printed one MSVC `link.exe` line (14.44.35207; 27,776 characters; sha256 of the line a3be1303b9953e5a322c2c6823b8c216ebc15eab06df04287e75c4aee103379e).
  - It contains no clang_rt, compiler-rt or compiler_rt name, and no clang or llvm path.
  - Its system libraries are advapi32, bcrypt, cfgmgr32, dbghelp, gdi32, kernel32, msimg32, ntdll, opengl32, rstrtmgr, synchronization, user32, userenv, winspool and ws2_32.
  - `libduckdb.a` and the test exe each contain 0 occurrences of clang_rt, compiler-rt and compiler_rt.
- **Fix:** either a CI capture that needs no workflow edit, or the human's word that a local capture recorded at a named commit stands in for it. Until then, the PR body sentence comes out.

## Documentation (must fix before the merge; no re-gate)

**D-1. `engine/Cargo.toml:43-45` at the head (a worker's source comment, not the human's wording).**
- "The one case `.cargo/config.toml` does not reach" leaves out a second developer-only case. The `[env]` entries carry no `force`, so a developer's own `CXX_x86_64-pc-windows-msvc` or `CXXFLAGS_x86_64-pc-windows-msvc` environment value wins over the file's.
- Replacement words (three lines replace lines 43-45):
  ```
  # Two developer-only cases are not reached by `.cargo/config.toml`: a cargo run whose working directory is outside this checkout, which builds DuckDB with MSVC's cl.exe and no define; and a developer's own `CXX_x86_64-pc-windows-msvc` or `CXXFLAGS_x86_64-pc-windows-msvc` environment value, which wins over the file's because its `[env]` entries carry no `force`.
  # `engine/tests/admitted_integer_overflow.rs` pins the outcome the build of record gives.
  ```
- **Clause check:**
  - "outside this checkout … cl.exe and no define": cargo reads `.cargo/config.toml` only from the working directory's ancestors. With no CXX variable set, cc falls back to cl.exe. My no-config check confirmed no ancestor or cargo-home config on D:.
  - "a developer's own … value wins": cargo's `[env]` does not override an existing environment value without `force`.
    - For CXX, the hyphenated name is the first one cc 1.4.0 reads (`target_envs`, `src/lib.rs, lines 4204-4218`).
    - For CXXFLAGS, `envflags` (`src/lib.rs, lines 4240-4259`) concatenates every set variable. The process value of the hyphenated name therefore replaces the file's define.
    - An underscored variant would not win, so it is not named.
  - "pins the outcome": T-A to T-E pass at the head (check 2).
- If C-1's fix lands in a source comment, the LLP64 assert is named there too.

**D-2. The PR body's block "The build-of-record lines, as committed in `engine/Cargo.toml` at 49297300".**
- It reproduces every `#` comment line of `engine/Cargo.toml`, from different places and with the dependency lines dropped. It is not the committed build-of-record lines.
- Replace the block's contents with exactly the seven lines the diff adds, `engine/Cargo.toml:39-45` at 49297300 (sha256 of the sentence line without its `# ` is b8f6b1d4bfafb10462f1b157b289da49356ee7ff8563b4f08aba67734fd9fb5d). With D-1 applied, use the lines at the new head.
- Clause check: `git diff af9c25bc...49297300 -- engine/Cargo.toml` shows 7 added lines, the blank `#`, the marker, the sentence, the blank `#` and the three comment lines, with 0 removed.

**D-3. The PR body's Evidence sentence.**
- "M2 to M4 fail as §4 predicts" leaves out M2's extra failures, which Amendment 5 records.
- Replacement: "M2 to M4 fail the named test where §4 predicts; under M2, T-C and T-E fail beside T-B (Amendment 5)".
- Clause check: my M2 run failed T-B, T-C and T-E, and passed T-A and T-D (check 3).
- The sentence's link-line clause comes out under E-1.

**Not findings (the human's words, checked against the code; no replacement words):**
- The build-of-record sentence: CI (the T-A pass on windows-latest), the checked path (M1 against T-A), W-2 (port-2 not merged: `product-ci-rust.yml` on main has only `windows-latest` and `ubuntu-24.04`) and W-1 (T-A and T-B) each hold.
- The CLAUDE.md OPEN-6 line is byte-equal to its source.

## Suggestions (not blocking)
- The T-B false overflow on MSVC (Amendment 5, "the row is not identified") is most likely the row `(-4294967296, 2147483648)`, whose product is exactly i64::MIN. The MSVC fallback checks magnitudes. This is unverified and needs no work under route (a).
- H-CACHE: rust-cache lists `.cargo/config.toml` under "Lockfiles considered" in both Windows runs. Both runs restored main's key (`…-df6ba878`, full match false) and compiled libduckdb-sys again. A re-run that hits the branch's own clang-cl cache has not yet been seen.

## Check 1: the diff (rc 0 unless stated)
- **Files and size:** `git diff --numstat af9c25bc...492973009fbc` gives the five files: .cargo/config.toml 4, CLAUDE.md 1, CONTRIBUTING.md 1, engine/Cargo.toml 7, engine/tests/admitted_integer_overflow.rs 523. That is 536 lines, 0 deletions: 535 over §7's four files, 536 with CLAUDE.md, as Amendment 6 records.
- **Record commit:** `git diff 5d9a7eb3 492973009fbc` is 26 added lines, all `/// ` doc comments. No other added or removed line (grep rc 1).
- **Nothing §8 lists:** no `.github`, `Cargo.lock` or shell lockfile in the diff (empty output); no `#[ignore]`, `#[cfg`, `cfg!` or `cfg_attr` added (grep rc 1); no weakened assertion (0 removed lines).
- **The form is append-only:** it was added at 688b847d. `git diff 688b847d 961b5d9b` on it shows 0 removed lines, so §7's line is unedited.
- **My script `o1-g1r-check1.mjs`, rc 0, ALL PASS:**
  - `.cargo/config.toml` equals Amendment 2's fence byte for byte (sha256 6889110645ec…e35f, no CR).
  - The marker line equals the form's §2a.
  - The sentence at `engine/Cargo.toml:41` equals the human's line-17 sentence, assembled with three parts: the 2026-10-27 clause with `-DDUCKDB_STATIC_BUILD`, W-2's and W-1's words taken from the 2026-10-26 answers, all extracted by script.
  - The form's own copies of the clause, W-1 and W-2 equal their directives.
  - `CLAUDE.md:29` equals the OPEN-6 words (sha256 fefa6ca8…bcfb).
  - `CONTRIBUTING.md:124` equals the form's §2a words.
  - `FIXED_DETAIL` equals `admission_property_campaign.rs:1018`'s const at base.

## Check 2: the head on the clang-cl build (worktree target, CC_ENABLE_DEBUG_OUTPUT=1)
- **Pinned test:** cmd-rc 0, 5 passed, 0 Compiling lines.
- **Engine suite:** cmd-rc 0, 49 result lines, 469 passed, 0 failed, 17 ignored, 0 Compiling lines. The six named existing tests are ok.
- **The target's DuckDB build output:** all 352 units name clang-cl and carry DUCKDB_STATIC_BUILD and NDEBUG; 0 name cl.exe.

## Check 3: mutations on the export
- **The export:** `git archive 5d9a7eb3` was extracted with `tar --force-local`. Cold target, CC_ENABLE_DEBUG_OUTPUT=1.
- **Before the cold build, the CONTRIBUTING observation:** with LLVM's bin folder removed from PATH, cmd-rc 101, `failed to run custom build command for libduckdb-sys` with `error occurred in cc-rs: failed to find tool "clang-cl": program not found`. The sentence holds as observed, not only by the source reading.
- **Cold build plus baseline:** cmd-rc 0, `Finished … in 9m 05s` (cargo's own line, not a measurement). 352 of 352 units clang-cl with the define, 0 cl.exe, 5 of 5 tests pass.
- **M2** (`NOT (…)`): cmd-rc 101.
  - T-B fails at "E-ar-n all [v * v > 0]: completed with 1 ids, first [0]" against {1..5}.
  - T-E fails at "B-ar-s all [4000000000 * 4000000000 > 0]: completed with 0 ids".
  - T-C fails: "16 runs completed with a wrong id set".
  - T-A and T-D pass.
- **M3** (BOOLEAN check removed): cmd-rc 101.
  - Only T-D fails, at C1, as `TypeNotAdmitted { construct: "AND", … reason: BooleanConversion }`.
  - Warning: unused `inferred`.
- **M4** (out-of-range arm deleted): cmd-rc 101.
  - Only T-A fails: 30 FAIL lines, 0 ok. The first is A-ar-n all, `"query: execute: Out of Range Error: Overflow in multiplication of INT64 (4000000000 * 4000000000)!"`.
- **Restores:** after each mutation, stream.rs b1e2e146…c9f5 and predicate.rs 950cd7a9…09f6 were restored EQUAL by sha256 (restore rc 0 each time).
- All three agree with the doc comments and with Amendment 5. M1 was not re-run.

## Check 4: seams
- **The config read by `cc`:** cc 1.4.0's `target_envs` reads `{env}_{target}` (hyphenated) first and `envflags` collects CXXFLAGS. The build output proves both entries arrive: the clang-cl program and the define on every unit.
- **The test against the engine's public API:**
  - It uses `AdmittedPredicate::admit`, `Dataset::stream_with_cancel` with `next_into`, `ViewportQuery::all/viewport/with_limit/with_filter`, `spatial_engine::fixture::*`, and the `FilterError` variants. It compiles and runs against them.
  - The fixed detail equals `"query: "` plus `OUT_OF_RANGE_DETAIL` (`engine/src/stream.rs` at 5d9a7eb3) and the campaign's const.
  - No `pub` item is added, and there is no product code in the diff.
- **The CONTRIBUTING sentence against the build:** observed (check 3).
- **The PR body's claims:**
  - Hold: the five tests pass; the suite passes (469); no compiler-rt in the imports or the archive (my grep, plus the worker's dumpbin); no overlap with Rule (00)'s paths (`gh pr diff --name-only` for #264 and #265 matches none of the five files or `protocol/`).
  - Fail: the link-line sentence (E-1) and the block (D-2). D-3 adds M2's extra failures.

## Check 5: scripts and CI
- **Verify scripts at the head:**
  - `verify.mjs --offline`: rc 0, PASS.
  - `verify-cites.mjs`: rc 0, PASS, 2460 files.
  - `verify-quotes.mjs`: rc 0, PASS (131 checked, 0 errors).
  - `verify-test-claims.mjs`: rc 0, PASS (687).
- **`cargo fmt --all -- --check`:** rc 0, empty output.
- **`gh pr checks 266`:** rc 1. Every run's head sha, read with `gh run view`, is 492973009fbc1aaf31fcb12f6c974a0574ff1b4e.
  - Product CI shell: push run 40684687264 and pull_request run 40689099557 both FAIL in "typecheck · build · vitest · cargo test" (C-1). Their tauri build jobs pass.
  - Product CI Rust: run 40684686930 (push) and run 40689099450 (pull_request) both pass. Windows 30m46s on the push run, within the 90-minute timeout. The pinned test's 5 tests are ok in both the windows-latest and ubuntu-24.04 logs.
  - Every other check passes: fmt, governance, ported-notices, DCO, exposure, cfg boundary.
- **Windows job log:** clang-cl is not named and no link line is present (E-1). No compiler-rt name appears.

## Holds (SpatialIDE only; all shared, cores 0-7, affinity FF; no exit code 96 to 99)
| Command | Hold bash pid | cmd-rc |
|---|---|---|
| pinned test, worktree | 6008 | 0 |
| engine suite, worktree | 32812 | 0 |
| no-clang build, first try (my wrapper emptied PATH, so cargo was not found and nothing was built) | 22088 | 127 |
| no-clang build | 27816 | 101 (expected) |
| cold build and baseline, export | 32396 | 0 |
| M2 | 49344 | 101 |
| M3 | 5196 | 101 |
| M4 | 12512 | 101 |
| link args, export | 33144 | 0 |

## End state
- The worktree `C:/dev/wt/o1-clang`: `git status --porcelain` is empty, HEAD is 492973009fbc.
- `D:/wt-targets/o1-g1r-export` is removed (`ls`: no such file).
- `D:/wt-targets/o1-g1r-target` (the cold clang-cl target) is left for the custodian to sweep.
- A final process list showed no cargo, rustc, clang-cl or test process.
- Scratch files are named `o1-g1r-*` in my scratch folder. I wrote no repository file.
