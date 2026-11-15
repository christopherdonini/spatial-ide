Reviewed: PR #266 at 492973009fbc1aaf31fcb12f6c974a0574ff1b4e, gate 1, architect
Verdict: PASS WITH NOTES
Branch: cut/admitted-integer-overflow-silent-wraparound @ 492973009fbc1aaf31fcb12f6c974a0574ff1b4e (read in C:/dev/wt/o1-clang; form, directives and reports read on main at 961b5d9b).

I have no shell, so I computed no sha256. That includes the brief's own hash, which I could not check. Byte-equality claims below are by reading.

I could not see the PR's CI or its body. I had no `gh`, so §8 item 13 and every CI-borne item below are not checked by me. They are listed under Evidence as owed before the merge.

## Findings by class

### Correctness
None. The diff adds no `pub` item and no `src/**` change. The test runs against the engine API as it exists: it compiles, and it passes at the head per the worker report. The composition is unchanged (`engine/src/stream.rs:1452` still `format!("({})", f.sql_text())`).

### Evidence (open until read from CI; none checked by me)
- **E-1. Does the installer build really compile DuckDB with clang-cl?** The form left one question open ("What I could not settle": whether cargo's fingerprint reads `[env]` for `rerun-if-env-changed`). It said P-3 and M1 would settle it. Neither did:
  - P-3 ran `cargo clean -p libduckdb-sys` first (second-run report, P-3).
  - M1 was a cold build on a new target.
  
  The risk: `tauri-build.yml:48-50` and `product-ci-shell.yml:183-185` use `Swatinem/rust-cache`, which falls back to a prefix restore. If the cache restores the MSVC-built `libduckdb-sys` and cargo does not rerun the build script, the shipped installer carries the MSVC DuckDB. Those jobs run no pinned test, so nothing would go red. The product-ci-rust Windows entry is self-guarding: a stale MSVC DuckDB fails T-A, T-B, T-C and T-E there (Amendment 5).
  
  Owed before the merge: the PR's `product-ci-shell` and `tauri-build` Windows logs must show `libduckdb-sys` compiled in that run. If they show no compile after a cache restore, this is an Evidence block. This is §9 item 6 (H-CACHE), widened to the installer path.
- **E-2.** §8 item 13: every CI entry green. Also from CI:
  - the pinned test listed as run on the Linux L1 entry (§8 item 5, the Title's "Windows and Linux L1");
  - `vswhom-sys` compiling under clang-cl (§5 invalidator);
  - the cold builds inside their timeouts.
  
  Read by the reviewer or custodian, not me.

### For the human (their rulings; no replacement words)
- **H-a. The link line cannot be captured as ordered.** The ruling of 2026-10-28, item 1, says "the PR's Windows build captures the link line once". `product-ci-rust.yml:223,234` run cargo without `-v`, and cargo hides the link line on success (P0 second-run report, P-3). §8 item 3 forbids any workflow edit. So the PR's CI cannot record it as worded. The human picks the route, for example a local `--print link-args` on the clang-cl target.
- **H-b. A gap in the ADR-030 archive check.** The check (P0 second-run report, P-3 link bullet) grepped library names: `clang_rt`, `builtins`, `compiler-rt`, `compiler_rt`. It did not list undefined routine names. The four `__uint128_t` paths clang-cl now compiles use `__builtin_mul_overflow` on unsigned 128-bit values (`hugeint.cpp:216-222`, `:316`; `uhugeint.cpp:99`, `:174`, read in the build's unpacked 1.5.5 source). If LLVM lowered any of these to a libcall, the Rust toolchain's own builtins would resolve it at link. Neither the grep nor the imports list would show that.
  
  For unsigned multiplies this is unlikely, but nothing checked it. Listing the undefined symbols in `libduckdb.a` (`__*ti3` / `__*oti4`) would close it. The human ruled that the archive check stands, so this is theirs to take or leave.

### Documentation (must fix before the merge; no re-gate)
- **D-1. Amendment 5 records the T-o result in the wrong direction.** It says "(T-o's `a * b > 0` completes with a row exact arithmetic does not select)".
  - What happened: the worker report's M1 T-o table shows `T-o-ar-n [a * b > 0] | completed with 1 id, first [0] (exact: ids 0 and 1)`. A row that exact arithmetic selects was dropped; no extra row was added.
  - Why: 268435456 × 1152921504606846976 = 2^88, which wraps to 0 (second-run report, T-o row: "wrapped W = 0"), and 0 > 0 is false.
  - The worker report's line "Q1 wraps and delivers rows that exact arithmetic does not" carries the same error. It is filed evidence and stays as it is.
  - This is the custodian's record, not the human's wording. Words to append:
    > ### Amendment 7 (2026-10-28), class 1: Amendment 5's T-o clause corrected. Written after the piece's results were seen.
    > - Amendment 5's parenthesis on T-o states the wrong direction: on MSVC, T-o's `a * b > 0` completed without a row exact arithmetic selects (1 id, [0], where exact arithmetic selects ids 0 and 1). Proof: the M1 T-o table in `state/consults/2026-10-28-admitted-integer-overflow-silent-wraparound-build-worker-report.md`; 268435456 × 1152921504606846976 = 2^88, which wraps to 0 in int64.
  - Clause check:
    - "1 id, [0]" and "ids 0 and 1": worker report, M1 T-o table.
    - 2^28 × 2^60 = 2^88, and 2^88 mod 2^64 = 0: arithmetic, agreeing with the second-run report's "wrapped W = 0".
    - The test's own M1 comment (`admitted_integer_overflow.rs:388-393`) says "completed with wrapped rows … 1 id", which is true and needs no change.
- **D-2. The `engine/Cargo.toml` comment names one gap where there are two.** Lines 43-45 open "# The one case `.cargo/config.toml` does not reach is a cargo run whose working directory is outside". The `[env]` entries carry no `force` (`.cargo/config.toml:3-4`; form §2a says "a developer's own environment value wins"). So a developer environment that already sets either target-specific variable also escapes the config. That case is developer-only and does not block, but §31 says it must be named in this comment. This is a worker's comment, not the human's wording. Replacement for lines 43-45:
  ```
  # Two cases `.cargo/config.toml` does not reach, both developer-only: a cargo run whose working
  # directory is outside this checkout, and an environment that already sets
  # `CXX_x86_64-pc-windows-msvc` or `CXXFLAGS_x86_64-pc-windows-msvc` (the `[env]` entries carry no
  # `force`, so that value wins). Outside the checkout, the build uses MSVC's cl.exe and no define;
  # `engine/tests/admitted_integer_overflow.rs` pins the outcome the build of record gives.
  ```
  Clause check:
  - "outside this checkout": cargo looks for its config from the working directory upward (form §2a). No other `.cargo/config*` exists in the tree (glob).
  - "already sets … that value wins": no `force` at `.cargo/config.toml:3-4`. `cc` 1.4.0 reads the target-specific `CXX` first (`src/lib.rs`, lines 4222-4228) and gathers every `CXXFLAGS` variable (`src/lib.rs`, lines 4240-4260).
  - "cl.exe and no define": M1, with the config deleted, built all 352 units with cl.exe and none with the define (worker report, M1).
  - "pins the outcome": the file exists and holds T-A to T-E.
- **D-3. The hash references in Amendments 3 and 4 name no revision.** They read "sha256 from line 5, …" with no `@ <rev>`. Round 15 (e) requires an explicit revision at a commit on main. Words to add to the same appended amendment:
  > - The sha256 values in Amendments 3 and 4 hold at main <the commit at which the custodian recomputes them>.
  
  The custodian or reviewer recomputes them, since I cannot.
- **D-4. OPEN-7 (A) is now in force, and the diff does not carry it.** The human's answer is "OPEN-7 (A), else (B)". #241 has merged (CUT-STATE, in-flight gate states), so (A) holds: `engine/README.md`'s measurement scope and the owner's-index pointer belong in this PR. Neither is in the diff.
  - The README line is a worker's, not the human's wording. Replacement for `engine/README.md:523-524`:
    > Windows 10 Pro 22H2 / bundled DuckDB v1.5.5. Figures recorded before admitted-integer-overflow-silent-wraparound merged were taken on the DuckDB that MSVC's cl.exe compiled; from that merge the Windows build compiles it with clang-cl (`.cargo/config.toml`), and no figure on record has been re-taken on that build. Nothing here says anything about macOS or Linux — the same limit `docs/07` places on ADR-003.
  - Clause check:
    - "taken on … cl.exe": form §1, docs/08 bullet. `.cargo/config.toml` is new in this diff, so no earlier build used clang-cl.
    - "compiles it with clang-cl": `.cargo/config.toml:3-4`, and P-3's 352 clang-cl units.
    - "no figure … re-taken": form §1 says no figure is stated here.
  - Owner's index:
    - add `engine/ADMITTED-INTEGER-OVERFLOW-SILENT-WRAPAROUND-PREREGISTRATION.md` to "preregistrations in this module" (`engine/README.md:550`);
    - add `engine/tests/admitted_integer_overflow.rs::an_admitted_bigint_product_that_overflows_ends_the_stream_in_the_fixed_detail` to the Viewport stream line's "pinned by" list (`:533`);
    - update "Last verified at" (`:530`).
  - This makes a sixth file. The closing amendment extends Amendment 6's class-8 figure with it, and §7 is not edited.
- **D-5. Keep the observation commit reachable.** Amendment 5 and the test's RECORDED MUTATION comments name 5d9a7eb3f446b0d2ced5785805e3ca6c8765cdf0 as the observation commit, and a squash would orphan it. If the PR body does not already say so, add:
  > Merge with a merge commit, not a squash: Amendment 5 and the test's RECORDED MUTATION comments name 5d9a7eb3f446b0d2ced5785805e3ca6c8765cdf0 as the commit the mutations were observed at, and it must stay reachable from main.

## Check 1: the build-of-record lines (`engine/Cargo.toml:40-41`)
This is the human's sentence (resent directive, line 17) with three agreed changes. Assembled by reading, it matches line 41 exactly.
1. **The clause from the 2026-10-27 direction (its line 15)** is inserted after "(CXX_x86_64-pc-windows-msvc=clang-cl)", with the define written in as `-DDUCKDB_STATIC_BUILD`.
2. **W-2:** "as the macOS and Linux builds do" becomes "as the Linux build does, and as DuckDB's source has the macOS build do". Port-2 is not merged: CUT-STATE shows `cut/port-2-macos-l1-and-app-dirs (built, 83d2ecef, not merged)` and "Port-2: built, no PR yet".
3. **W-1:** the human's settled words, `state/directives/2026-10-26-clicks-…-rulings.md` line 15. They apply because L1 completed rather than ending in the fixed detail (second-run report, L1 row).

The marker at line 40 is the same as the form's §2a marker.

Clause by clause:
- **"compiled with clang-cl (CXX_…=clang-cl)"**: `.cargo/config.toml:3`. Once that variable is set, `cc` 1.4.0 never falls back to cl.exe:
  - a failed detection only warns and takes the family from the file name (`src/tool.rs`, lines 274-279);
  - a missing program is a `ToolNotFound` error (`src/command_helpers.rs`, lines 442-453).
  
  So a green Windows build proves clang-cl was used. That depends on E-1 for the cached shell and installer jobs.
- **"export decorations switched off … (-DDUCKDB_STATIC_BUILD)"**: `.cargo/config.toml:4`. In the header, `winapi.hpp:11-14` and `:29-30` make `DUCKDB_API` and `DUCKDB_EXTENSION_API` empty under that define. Its two uses in `duckdb.h` only choose decorations (second-run report, header check).
- **"clang-cl rejects the exported deleted functions in … variant_stats.hpp"**: first P0 report, P-3 (`variant_stats.hpp(59,42)` and `(63,55)`: "attribute 'dllexport' cannot be applied to a deleted function").
- **"in CI and on the development machine"**: development machine, P-0 and the head builds. CI: E-1 and E-2. The dev-only gaps are named in the source comment once D-2 is applied.
- **"the compiler's checked path"**: the guard (run report `:370`), and T-A passing at the head while M1 fails it.
- **W-2's macOS half**: source only, as worded.
- **W-1's first half**: T-A, whose A-ar-n and S-ar-n files hold 4000000000 (`admitted_integer_overflow.rs:218`, `:227`; assertion at `:406`). M1 and M4 fail it.
- **W-1's second half**: T-B (E-ar-n and T-e-ar-n against the i128 oracle, `:291-302`, `:436`). M2 fails it.

## Check 2: the ADR readings and §8
- **ADR-030 Reopen 4 (`ADR-030…:82`)**: the reading holds on the evidence the human accepted:
  - the archive and exe greps found 0 matches;
  - the archive's DEFAULTLIBs are msvcprt, msvcrt, oldnames, uuid and ws2_32;
  - the head's imports are the MSVC set, with no clang or compiler-rt DLL.
  
  Residuals: H-a and H-b.
- **ADR-021, decision 4 (`:67-70`) and Note item 4 (`:265`)**: the composition is untouched (`stream.rs:1452`), and nothing decides overflow inside ADR-021. Route (b) is not started.
- **ADR-004**: the form does not read it, and the diff touches no data path.
- **ADR-006 class 1 and ADR-010 rule 7**: unchanged. The existing terminal is surfaced.

§8, item by item:
1. Pass. The probe was never committed. P0 ran on `D:/wt-targets/o1-clang` and M1 on the new `D:/wt-targets/o1-msvc`; neither is shared.
2. Pass. CXX is set only in `.cargo/config.toml`.
3. Pass by the brief's and the worker's five-file list. I could not list the diff myself.
4. Pass: `Cargo.lock` unchanged per the worker; no vendored patch. H-b stays open.
5. Read: no `#[ignore]` and no `cfg` in the test file. The run on both entries is E-2.
6. Pass:
   - T-A: exact text and 0 batches;
   - T-B: no terminal and the oracle's set;
   - T-C: as registered;
   - T-D: `NotBoolean` / `TypeNotAdmitted`;
   - T-E: exact sets.
7. Pass: no campaign file in the diff.
8. Pass: no KNOWN-LIMITATIONS item.
9. Pass (check 1).
10. Pass: no docs/08 figure.
11. Pass.
12. Pass: every mutation was applied, run, named and reverted; no `verify-mutation` run is called an observation.
13. Not checked by me (E-2).

## Check 3: the amendments
- **Amendments 1 and 2**: class 1 by their first lines.
- **Amendment 3 (class 1)**: agrees with the reports and with the ruling of 2026-10-28, item 1.
- **Amendment 4 (class 4)**: M1 ran as Amendment 4 words it:
  - both entries gone, since the config was deleted;
  - run at 5d9a7eb3, the commit that holds the test;
  - a dedicated checkout and new target;
  - 352 cl.exe units with no define;
  - no ancestor config.
  
  T-A collects every cell before it asserts (`:399-416`).
- **Amendment 5 (class 2)**: right, apart from D-1:
  - T-A fails 28 of 30, with S-ar-n at 2 ids;
  - T-C fails at A-ar-n, 1023 against 2047;
  - T-E fails at L1, 0 against 2048;
  - the T-B deviation holds: every T-e product fits in int64, and the fixed detail comes only from an `Out of Range Error` (`stream.rs:2609`);
  - M2 matches.
- **Amendment 6 (class 8)**: the first line carries "budget overrun, §7 not edited", and §7 is unedited. 4 + 7 + 523 + 1 = 535. The figures agree with the head: config 4 lines, 7 new comment lines in `Cargo.toml`, test file 523 lines. D-4 extends it by one file.

## Check 4: CONTRIBUTING and CLAUDE.md
- **`CONTRIBUTING.md:124`** has the form's §2a words exactly, by reading. The missing-tool claim is not observed (clang-cl was on PATH throughout), but it holds by source in `cc` 1.4.0:
  - `src/tool.rs`, lines 274-279: a failed detection only warns and the family stays clang-cl, so there is no fall back to cl.exe;
  - `src/command_helpers.rs`, lines 442-453: "failed to find tool …", `ToolNotFound`;
  - `libduckdb-sys` 1.10505.0 `build_bundled_cc.rs`, line 138: `cfg.compile("duckdb")`, which panics on that error.
  
  The form's condition "if P0 shows other text" was never triggered. The claim is disclosed as resting on the source reading.
- **`CLAUDE.md:29`** matches the human's OPEN-6 words (`state/directives/2026-10-26-clicks-…-rulings.md` line 20) exactly, by reading; I computed no hash. It is a new line after the Environment line, as the settlement places it.

## Check 5: out of scope and the guarantee
- **MSVC**: nothing in the diff claims an outcome for an MSVC build. §1 excludes any build without clang-cl, and the test's doc (`:12`) calls that build the one the tests catch. Amendment 5's false overflow on an exact product is an MSVC fact, recorded and not claimed.
- **Linux**: shown by the L1 run once E-2 is read. `cc` ignores the variables there, because they are named for the Windows target.
- **macOS**: by source only, as W-2 says, until port-2's entry runs the test.
- **No guarantee beyond §1.**

Paths: C:/dev/spatial-ide/engine/ADMITTED-INTEGER-OVERFLOW-SILENT-WRAPAROUND-PREREGISTRATION.md · C:/dev/wt/o1-clang/engine/Cargo.toml · C:/dev/wt/o1-clang/.cargo/config.toml · C:/dev/wt/o1-clang/engine/tests/admitted_integer_overflow.rs · C:/dev/wt/o1-clang/engine/README.md · C:/dev/spatial-ide/state/consults/2026-10-28-admitted-integer-overflow-silent-wraparound-build-worker-report.md
