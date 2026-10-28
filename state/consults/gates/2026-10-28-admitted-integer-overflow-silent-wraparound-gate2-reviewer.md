Reviewed: PR #266 at 4943d8b4a0272e02ea9d49371bb4ae1a069fbad6 (base af9c25bc), gate 2, reviewer
Verdict: FAIL

Branch: cut/admitted-integer-overflow-silent-wraparound @ 4943d8b4a0272e02ea9d49371bb4ae1a069fbad6. I read the form, the directives and the reports on main at 22e86b0504c7cccb1f1f6cfc37f8f1c6579f9d11. I computed the brief's sha256 with `sha256sum`: 5e5daedd4e9f8fa19f4d3ef7bdd5cfdbacc199d591d317accf4549ced49bfdbc, which matches the brief.

**Summary.** The round's code is right and CI is green at the head. Gate 1's C-1 is closed:
- the shell job compiled libduckdb-sys in the run, on both runs;
- its cargo test passes;
- no assertion fired.

The gate fails on one Evidence finding, under the brief's own rule. At 4943d8b4 the `tauri build` job did not compile DuckDB. It restored a cache entry. That entry was compiled under the same config by the job's run at 49297300. No code change is needed to close it.

## Correctness
None.
- The shell's table equals Amendment 7's fence, byte for byte.
- Every comment claim holds against the source:
  - `build_bundled_cc.rs` lines 127-133 define NDEBUG only when `DEBUG` is false;
  - `bit_utils.hpp` lines 44-46 and 61-63 hold the `#ifdef __clang__` asserts;
  - `assert.hpp:27` reads `#define D_ASSERT assert`.
- No `pub` item, no `src` change, no seam.

## Evidence (blocking)

**E-1. At 4943d8b4, the installer's DuckDB was not compiled in the `tauri build` run. It was restored from a cache entry written at 49297300.**

What the logs and the cache list show:
- **The head's runs.** Push job 122959748346 and pull_request job 122959781231 (runs 40728961364 and 40728970643, both at head 4943d8b4) each log `Restored from cache key "v0-rust-windows-latest-shell-tauri-build-build-Windows_NT-x64-e70cdc14-476dea4e" full match: false.`
  - Each log has 0 `Compiling … libduckdb-sys` lines and 0 `Compiling … duckdb v` lines.
  - Only the workspace path crates compile. `Finished release … in 1m 48s` and `in 1m 54s`.
- **Where that entry came from.** `gh api …/actions/caches` lists `…-476dea4e` twice: on the branch ref, created 2026-10-28T12:20:56.079Z, and on refs/pull/266/merge, created 12:48:23.8Z.
  - The 49297300 tauri jobs saved them: 122803907061 (push) and 122819014871 (pull_request).
  - Each of those jobs restored main's `…-b64a8a20` (the cl.exe build) with `full match: false`.
  - Each then compiled vswhom-sys and libduckdb-sys in the run: push, 12:08:32 to 12:18:28; pull_request, 12:39:30 to 12:46:40.
  - Each then saved its entry: push, `Saving cache` at 12:20:44.
- **Why the restored objects are the clang-cl build.** `git diff 49297300 4943d8b4 -- .cargo/config.toml` is empty (0 bytes). At the head the file's sha256 is 6889110645ec…e35f, Amendment 2's. `Cargo.lock` is unchanged, and the round's profile table is dev-only. So the release inputs are identical, and the restored objects came from a build under the same `[env]`.
- **What remains unproven.** No log in the head's `tauri build` runs shows libduckdb-sys compiled in that run. That is the brief's condition for this check and the architect's gate-1 E-1 condition ("If they show no compile after a cache restore, this is an Evidence block").
- **Fix, with no code change and no workflow edit (the custodian's action):**
  1. Delete the tauri-build cache entries `…-476dea4e` and `…-f459d22b` on both the branch ref and the PR ref.
  2. Re-run the `tauri build` job at 4943d8b4.
  3. Read its log for `Compiling libduckdb-sys` after the restore from main's `…-b64a8a20`.

  Alternatively, the architect, who owns gate 1's E-1, may rule the provenance chain above sufficient.

## Documentation (must fix before the merge; no re-gate)

**D-1. The PR body still records the stop that Amendment 9 lifted.** This is the custodian's text, not the human's wording.
- **Line 3.** Replace "with Amendments 1 to 8 (P0's two attempts and the define; P0 recorded; M1 corrected; the deviations; the overrun; correction round 1's scope addition; its results)." with: "with Amendments 1 to 9 (P0's two attempts and the define; P0 recorded; M1 corrected; the deviations; the overrun; correction round 1's scope addition; its results; your ruling on its stop and the ADR-030 record)."
- **Line 29.** Replace the whole bullet with: "- The helper listings: none of the fifteen helpers in DuckDB's archives; `__fixdfti`, `__floattidf` and `__floatuntidf` referenced by the Rust test objects and by main's `spatial_engine` rlibs. Not a stop, by your ruling (Amendment 9), whose ADR-030 record the form carries in your words."
- **Line 36.** Replace "gate 2, the reviewer, after your word." with "your word on Amendment 8's stop given (Amendment 9); gate 2, the reviewer, at 4943d8b4."
- **Clause check:**
  - "none … in DuckDB's archives": listings a and b have 0 hits for each of the 15 helpers, and 0 for clang_rt (my script).
  - "referenced by the Rust test objects": listing c has `__fixdfti` 2, `__floattidf` 1, `__floatuntidf` 1.
  - "by main's `spatial_engine` rlibs": both sefd listings have each of the three once.
  - "Not a stop": the ruling's item 1 opens "#266: not a stop."
  - "in your words": Amendment 9's record line is byte-equal to the ruling (check 2).
  - The gate-2 state is this report.

**D-2. Amendment 7 says the README's last-verified line "moves to the new head" (form on main, line 474). That is not what was applied.**
- At 4943d8b4, `engine/README.md:533` gains the clause "the O1 preregistration and its pinned test, at 5d9a7eb3".
- That narrower clause is the true one: the form and T-A both exist at 5d9a7eb3 (`git cat-file -e`, rc 0). Nobody re-checked every pointer at 4943d8b4.
- The README stays as it is. The closing amendment adds one reference, in these words: "Amendment 7's last-verified item was applied as a clause naming 5d9a7eb3 (engine/README.md, the Last verified line at 4943d8b4), not as a move of the whole line to the new head."
- Clause check: the README line read by my script; the existence check above.

**D-3 (owed, not yet due).** Amendment 7 says the closing amendment extends Amendment 6's class-8 figure. The figures at 4943d8b4:
- §7's four files: 537 added, 0 deleted (`engine/Cargo.toml` is now 9).
- All seven files: 555 added, 4 deleted. The PR body's "559 lines" counts added plus deleted.

## Checks

**Check 1: C-1 at the head.**
- **The shell's `Cargo.toml`.** My script `o1-g2r-check1.mjs` exited 0 with ALL PASS. The file at the head equals the file at the base, plus one LF, plus Amendment 7's nine fence lines (form lines 455-463), plus a final LF. It has no CR. Its only `[profile` table is `[profile.dev.package.libduckdb-sys]`, with the root `Cargo.toml:66` keys (`debug = false`, `opt-level = 2`).
- **CI at the head.**
  - Job 122959747796 (push): `Compiling libduckdb-sys` at 16:52:19 and `duckdb` at 17:01:56, inside the step `cargo test --manifest-path frontends/shell/src-tauri/Cargo.toml --locked`. Test results: 71 passed and 2 passed, 0 failed.
  - Job 122959780868 (pull_request): `Compiling libduckdb-sys` at 16:51:53 and `duckdb` at 17:02:29. Same test results.
  - Both runs restored main's `…-b64a8a20` (`full match: false`). Each also recompiled libduckdb-sys in the release `cargo check`.
  - `Assertion failed`: 0 in both logs. The string clang does not appear, because cargo hides the command lines.
- **The local check.** The file is `D:/wt-targets/o1-shell/debug/build/libduckdb-sys-302df1fd8a09d25b/output`, read by `o1-g2r-units.mjs` (rc 0) and by grep (rc 0).
  - It holds 382 `running:` lines, 352 of them carrying `"-c"`.
  - All 352 have `clang-cl` as the command: 334 start the line, and 18 follow an interleaved `exit code:` prefix.
  - All 352 carry `"-DNDEBUG"` and DUCKDB_STATIC_BUILD; 0 name cl.exe.
  - By extension: 326 `.cpp` and 26 `.cc` (re2/re2 21, re2/util 2, snappy 2, fmt 1).
- **What Amendment 8's two numbers count.** The 326 is the `.cpp` units of the shell workspace's dev build. That build has 352 units in all. The 352 is every `-c` unit of the root workspace's release build on the o1-clang target, read the same way (`libduckdb-sys-f21303ad518a1075/output`): 326 `.cpp` plus 26 `.cc`, all clang-cl with NDEBUG and the define. The 26 units Amendment 8 left unread all pass. Amendment 7's invalidator ("a unit … without NDEBUG") is not met.

**Check 2: E-1 and the listings.**
- **The raw files.** sha256 of the 8 raw files (rc 0) all match the values Amendments 8 and 9 state:

  | File | sha256 |
  |---|---|
  | link-verbose-lib | bd8067f0… |
  | nm-a | d4612343… |
  | nm-b | 1de42771… |
  | nm-c | 89aa6b78… |
  | dumpbin | 08dc6dab… |
  | sefd 7ec97dc5… | 34f312da… |
  | sefd ceded34f… | 814ea012… |
  | msvc-imin | 85833ff8… (the tester's value) |

- **The link output** (`o1-g2r-ev3.mjs`, rc 0):
  - 1062 `Searching` lines, 152 distinct library basenames: 21 `.lib` and 131 `.rlib`.
  - No basename names clang, compiler-rt or compiler_rt. `libcompiler_builtins-ce654cf527ce7df8.rlib` is opened.
  - `grep -ic clang_rt` printed 0, rc 1; the self-test `grep -c memcpy` on nm-a printed 290, rc 0.
- **The helpers** (exact last-token match):
  - nm-a and nm-b: none of the 15, and clang_rt 0.
  - nm-c: `__fixdfti` 2 (the test's cgu.07 object and the rlib's cgu.04), `__floattidf` 1, `__floatuntidf` 1.
  - Each sefd listing: the same three, once each, and clang_rt 0.
  - The sefd rlibs' mtimes are 2026-10-25 18:00:22Z and 19:26:51Z, as Amendment 9 states.
- **dumpbin.** 20 DLLs, all MSVC runtime or system. Its one clang match is the target folder's name in the "Dump of file" line.
- **The ADR-030 record.** `o1-g2r-adr030.mjs` (rc 0): Amendment 9's record (form line 530) is byte-equal to the ruling's words (directive line 8), sha256 of the span 83735d9c6f828435979bcb6e423e82070efcabb8013b1c51cd775faf393946f8. The record is the human's wording. Its clause "resolved by Rust's compiler_builtins" rests on elimination, as Amendment 8 says ("not traced"). That is a note to the human, not a finding.
- **D-3's five hashes** (Amendment 8) recompute equal at fd149e24 and at 22e86b05. fd149e24 is on main (rc 0). Both filing-note hashes of the round's reports recompute equal: db66fc4c… and d7c6aa2a….
- **The PR body's lines.** Line 28 holds. Line 29 is stale (D-1).

**Check 3: the architect's E-1 and E-2, from CI at 4943d8b4.**
- **`gh pr checks 266`:** rc 0, 16 checks, all pass. `gh run view` gives head sha 4943d8b4a0272e02ea9d49371bb4ae1a069fbad6 for all 11 runs.
- **product-ci-rust, Windows** (jobs 122959747413 and 122959781682):
  - It restored `…-workspace-…-b6d030d3` with `full match: true` (saved on the branch at 12:33:52Z by a 49297300 run) and compiled 0 libduckdb-sys.
  - The run is self-guarding: the pinned test's 5 tests are ok (`test result: ok. 5 passed`), and on the MSVC DuckDB T-A, T-C and T-E fail (Amendment 5).
- **The shell job:** compiled DuckDB in the run (check 1).
- **`tauri build`:** restored, not compiled (E-1).
- **H-CACHE is answered.**
  - rust-cache lists `.cargo/config.toml` under "Lockfiles considered", so main's entry never fully matches.
  - Cargo reran the libduckdb-sys build script after restoring main's cl.exe cache: in the 49297300 tauri runs, and in the head's shell release `cargo check`.
- **The pinned test on both matrix entries:** listed and ok on windows-latest (2 runs) and ubuntu-24.04 (jobs 122959747961 and 122959780875).
- **vswhom-sys:** compiled in the run, in the head's shell jobs (16:51:08 and 17:03:29 push; 16:50:36 and 17:04:02 pull_request) and in the 49297300 tauri runs. All green.
- **Cold builds inside their timeouts** (workflow lines 201, 171 and 30 at the head: 90, 60 and 60 minutes):

  | Job | Commit | Time | Timeout |
  |---|---|---|---|
  | rust Windows | 49297300 | 30m46s / 32m39s | 90 min |
  | `tauri build` | 49297300 | 17m49s / 12m40s | 60 min |
  | shell | head | 30m05s / 31m11s | 60 min |

  These are CI observations, not docs/08 figures.

**Check 4: gate 1's Documentation words.** `o1-g2r-check1.mjs`, rc 0.
- **`engine/Cargo.toml`:**
  - line 40 equals Amendment 7's marker;
  - line 41 is `# ` plus A.4's sentence (675 characters, extracted from the directive by script);
  - line 42 is `#`;
  - lines 43-47 equal the architect's D-2 five lines;
  - line 48 is `duckdb = …`.
- **README:**
  - lines 523-527, joined by single spaces, equal the architect's D-4 words, each line at most 100 columns;
  - the form follows `engine/ADMISSION-PREREGISTRATION.md` in the preregistrations line;
  - the Viewport stream line ends with T-A;
  - T-A exists in the test file.
- **The PR body's block** (9 lines) equals the 9 lines `git diff af9c25bc...4943d8b4 -- engine/Cargo.toml` adds (0 removed).
- **The architect's D-1:** applied in Amendment 8 in reworded form. The figures and arithmetic are the same, and it is not presented as a quote.
- **The architect's D-3:** Amendment 8; hashes as in check 2.
- **The architect's D-5:** the PR body's Merge line.
- **The reviewer's D-1:** superseded by the architect's D-2 words, which name the same two cases.
- **The reviewer's D-2:** the block, as above.
- **The reviewer's D-3:** PR body line 25 carries the replacement words; the link-line clause is gone.
- **No CR** in either file.

**Check 5: Amendment 7's addition and §8.**
- `git diff --name-only af9c25bc...4943d8b4` lists exactly the seven files.
- `--numstat` over them: config 4/0, CLAUDE.md 1/0, CONTRIBUTING.md 1/0, engine/Cargo.toml 9/0, README 7/4, the test file 523/0, the shell's Cargo.toml 10/0.
- No `.github`, `Cargo.lock` or shell lockfile in the diff (grep count 0, rc 1).
- `git diff --quiet af9c25bc 4943d8b4 -- .github`: rc 0.
- The only added `CXXFLAGS` line is the config's existing entry, unchanged this round. The only added `[profile` line is in the shell's `Cargo.toml`. No workflow sets `RUSTFLAGS`, `CXXFLAGS` or `CXX` (grep rc 1).
- Verify scripts at the head:
  - `verify.mjs --offline`: rc 0, PASS.
  - `verify-cites.mjs`: rc 0, PASS, 2460 files.
  - `verify-test-claims.mjs`: rc 0, PASS, 687.
  - `verify-quotes.mjs` under `timeout 580`: rc 0, PASS, 131 checked, 0 errors. The call moved to the background after 180 s and completed with exit 0.

## End state
- I ran no cargo command and took no hold.
- The worktree is clean (porcelain empty). Its HEAD and origin's branch are both 4943d8b4.
- Scratch files are `o1-g2r-*` in my scratch folder. I wrote no repository file.

Paths:
- C:/dev/spatial-ide/engine/ADMITTED-INTEGER-OVERFLOW-SILENT-WRAPAROUND-PREREGISTRATION.md
- C:/dev/wt/o1-fix/frontends/shell/src-tauri/Cargo.toml
- C:/dev/wt/o1-fix/engine/Cargo.toml
- C:/dev/wt/o1-fix/engine/README.md
- C:/dev/spatial-ide-local/evidence/2026-10-28
- D:/wt-targets/o1-shell/debug/build/libduckdb-sys-302df1fd8a09d25b/output
