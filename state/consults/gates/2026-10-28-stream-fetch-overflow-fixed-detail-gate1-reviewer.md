Reviewed: PR #268 at 5efcc6696481a729a658f1e39c8dcfaa0ccdc5e6 (base 1fa66237), gate 1, reviewer
Verdict: PASS WITH NOTES

Branch and commit: cut/stream-fetch-overflow-fixed-detail @ 5efcc6696481a729a658f1e39c8dcfaa0ccdc5e6. The brief file's sha256 is ef7a15242a1a8218e2feb06b9c4925c0108ae22c4694a032fe781d120d9d3bac, which matches.

## Correctness: no findings

## Evidence: no findings

## Documentation (must be fixed before the merge; no re-gate)

**D1. `engine/README.md:533` at 5efcc669, the "Last verified at" line.**
- **What is wrong:** the segment reads "checked at the head of `cut/stream-fetch-overflow-fixed-detail` (the merge commit replaces this)". It names a branch head, not a commit. Once the branch moves or is deleted, nothing resolves it. And "the merge commit replaces this" is a promise that no step owns.
- **The fix, my replacement words for the segment** (not the human's wording; the worker applies them with no re-gate, and the PR body lists them):
  `; the Viewport stream row's fetch-site overflow test, at e967da33`
- **Clause check:**
  - "the Viewport stream row's fetch-site overflow test": the same commit adds `engine/tests/stream_fetch_overflow.rs::an_admitted_integer_overflow_first_raised_during_a_fetch_ends_the_stream_with_the_fixed_detail` to the Viewport stream row's "pinned by" list (README diff, B...e967da33).
  - "at e967da33", part 1: both the README pointer and the test exist at that commit. The export of e967da33 holds the E1 file (sha256 4a2e666b604ae78cef81c87f0bc014d6f4af8d36976916996b2ef4f4439f41c3, equal to `git show`).
  - "at e967da33", part 2: E1 passes there (my export baseline run, below).
  - It is a commit that the fixing commit does not create. It stays reachable on main because this repo merges with merge commits (f5f91424, fa720a7f).
  - It follows the line's own precedent: "the O1 preregistration and its pinned test, at 5d9a7eb3" names #266's code commit.

**Note on Amendment 2's "now stale"** (not a finding, no fix):
- Amendment 2 calls the header of `engine/tests/admitted_integer_overflow.rs` lines 14-16 stale. At 5efcc669 those lines' sha256 is 46cb82c29bd19502cefc0abdd584b6978270973ff5526c20fca2aa04d653243d.
- Read against the head, the sentence is still true. That file's fixtures are row groups of at most 2,048 rows, so the fetch site is not reached, and node `stream-fetch-overflow-fixed-detail` is where it is now covered.
- Nothing needs to change in or outside Scope.

**Other notes** (no action required):
- E1 writes to a fixed `temp_dir()/spatial-engine-stream-fetch-overflow/F-1M.parquet`, which follows `admitted_integer_overflow.rs:213` and `b1_projection_hostile_covering.rs:27`. On a failure the 44 MB file is left behind.
  - My M1 run left one: 44,441,691 bytes. I did not delete it, because the user temp folder is outside my permitted write locations. The next E1 run overwrites it and removes it.
- The default panic hook still prints the crate's payload, operands included, to stderr. That was true before this piece. In the shipped app it is not visible: `frontends/shell/src-tauri/src/main.rs:3` sets `windows_subsystem = "windows"` for release builds, and no panic hook exists in engine, kernel or frontends (my grep found none).
  - The piece's claim is the terminal text only, and that holds.

## Check 1: the diff against §2 and §8

**Scope:**
- `git diff --name-only 1fa66237...5efcc669` (rc 0) lists 4 files: `engine/README.md`, `engine/src/stream.rs`, `engine/tests/admission_property_campaign.rs`, `engine/tests/stream_fetch_overflow.rs`.
- No Cargo.toml, Cargo.lock or `engine/src/lib.rs` is touched.
- Nothing under kernel/, protocol/, frontends/ or .github/ is touched, and neither is KNOWN-LIMITATIONS.md.

**Constants, by my script** (`node e9-g1r-bytes.mjs`, rc 0, every line EQUAL):
- The script read stream.rs and E1 at 5efcc669, the registry's `duckdb-1.10505.0/src/arrow_batch.rs`, DuckDB v1.5.5 extracted from libduckdb-sys 1.10505.0's `duckdb.tar.gz` (pragma_version.cpp:11 is `v1.5.5`), and both step-0 stdout files.
- `FETCH_PANIC_PREFIX` equals the bytes before `{err}` at arrow_batch.rs:46 (36 bytes). It also equals bytes 30..66 of the step-0 terminal.
- `PENDING_RESULT_WRAPPER` (97 bytes) equals exception.cpp:146 `Invalid Input`, then error_data.cpp:65 `" "`, then error_data.cpp:67 `Error: `, then stream_query_result.cpp:181, then stream_query_result.cpp:183's `\nError: ` up to `%s`. It also equals bytes 66..163 of the step-0 terminal.
- The step-0 records hold 16 terminals, all one text: 263 bytes, sha256 1a18f782fb2bf7242d176e8cd47cc98432c11df3b72301bf5ab8e2b46fe5fd25, which equals Amendment 1. They hold 4 cell-I records, all one text.
- The constants' sha256 values are 9f971b882ab5836b887eb5734c26487fbbc247b4409b4cf92a4b66d6a32e4c72 and 9887ed68789f303687bbb137eada3297f18b591c846b37f7d87df8555ce96531, which agree with the worker's report.
- The evidence files' sha256 values (rc 0) all equal Amendment 1's list.

**Anchored strips only:**
- `fetch_panic_duckdb_text` uses only `strip_prefix`, `strip_prefix` and `is_out_of_range`; `is_out_of_range` is unchanged `starts_with`.
- My grep of the added lines for contains, find, regex, matches, split and search (rc 0) hits only:
  - two doc comments ("Nothing is searched for"; the M3 record);
  - E1's assertion `.contains` calls (the leak checks);
  - T3's `matches!` on `EngineError`.
- None is a matcher.

**`Cancelled` first:** `classify` is unchanged (stream.rs:2642 at head), and `classify_fetch_panic` calls it. T3 asserts `Cancelled` for WRAPPED, BARE and io under a cancelled token.

**Non-matching text unchanged:**
- When the recogniser returns `None`, `fetch_panic_duckdb_text(payload).unwrap_or(payload)` passes the payload whole to the same `classify(cancel, "duckdb fetch panicked", …)`.
- T3's 6 negatives each assert exactly `duckdb fetch panicked: {payload}`.
- The prepare and execute lines (:1801, :1856) are not in the diff.

**No new item:**
- Grepping the added lines for `pub` gives rc 1 (no match).
- There are no new enum or variant lines; the `EngineError::` hits are only existing `Query` and `Cancelled` in tests.
- Grepping for `#[ignore]`, `#[cfg` and `cfg!` gives rc 1 (no match).

**The record commit (e967da33..5efcc669):**
- 2 files are touched: stream.rs and the E1 file.
- All 16 changed lines are added `///` lines. My count of non-comment changed lines is 0.

**Amendment 2's figures:**
- `git diff --numstat origin/main...5efcc669 -- <4 paths>` (rc 0) gives README 2/2, stream.rs 139/16, campaign 4/3, E1 266/0. That is 411 added and 21 deleted, 432 in all.
- stream.rs is 155 and E1 is 266, matching the amendment.
- §7's line still reads 380 on main, so class 8 is recorded and §7 is not edited.

**T3 bare sample against the source:** the script confirms `DUCKDB_TEXT` equals exception.cpp:116 `Out of Range` + `" "` + `Error: ` + multiply.hpp:77's format filled with INT64 and the operands (100 bytes). It also equals the step-0 cell-I text. `BARE` equals the prefix followed by that text, 136 bytes. `E1 FIXED_DETAIL` equals `query: ` + `OUT_OF_RANGE_DETAIL`, 139 bytes.

## Check 2: the head, worktree C:/dev/wt/e9 on D:/wt-targets/e9

The worktree HEAD is 5efcc669 and its porcelain was empty before and after.

**E1 and T3:** `cargo test -p spatial-engine --locked --lib --test stream_fetch_overflow -- <T3> <E1>` gave rc 0.
- It finished in 0.52s and compiled nothing.
- T3: ok.
- E1: ok, 13.62s.

**Engine suite:** `cargo test -p spatial-engine --locked` gave rc 0.
- 51 result lines: 471 passed, 0 failed, 19 ignored.
- It finished in 0.45s with no `Compiling libduckdb-sys` line, so DuckDB was not recompiled.
- §4's existing tests all pass: T2, `an_admitted_integer_overflow_ends_the_stream_with_the_fixed_detail`, `filter_admission_property_campaign`, the join test, `the_type_walk_agrees_with_the_binder_over_the_p0_matrix`, and the five tests in `admitted_integer_overflow.rs` (5 passed).

## Check 3: mutations on the export

- **The export:** I ran `git archive e967da33` to a tar in my scratch folder and extracted it with `tar --force-local` into the new D:/wt-targets/e9-g1r-export (rc 0).
  - stream.rs sha256 is 0a1eeaf545e0bd0faab1a8e0c9ea294884ed41027eaead71265846817df3c12e, equal to `git show`.
  - `.cargo/config.toml` is 6889110645ec075c0cba3bf4aa71c4b43e5b5dfafe7d5a3e8228c05c5010e35f.
- **Cold build and baseline:** the target was the new, cold D:/wt-targets/e9-g1r-target, with `CC_ENABLE_DEBUG_OUTPUT=1`, in one shared hold.
  - `Compiling libduckdb-sys v1.10505.0` finished in 10m 01s.
  - Its build output has the `running: "clang-cl" "-E" …` line and 326 `running:` lines naming clang-cl on a `.cpp` file.
  - At e967da33, T3 is ok and E1 is ok (13.98s), rc 0.
- **M1** (the fetch arm line replaced by `classify(cancel, "duckdb fetch panicked", &detail)`, a 1-line diff):
  - E1 gave rc 101 and FAILED at `engine\tests\stream_fetch_overflow.rs:240:9`, with "all: the terminal after 31 batches is not the fixed detail".
  - The left side begins `query: duckdb fetch panicked: Failed to fetch Arrow record batch: Invalid Input Error: …`.
  - This is assertion 4, as predicted and as recorded.
- **Restore 1:** `tar -xf` of stream.rs, sha256 0a1eeaf5…3c12e.
- **M2** (`Some(inner) => Some(inner),`):
  - T3 gave rc 101 and FAILED at `engine\src\stream.rs:2827:13`, at "the wrapper with an IO Error inside".
  - left `Some("IO Error: No files found that match the pattern \"x.parquet\"")`, right `None`. This is as predicted and as recorded.
- **Restore 2:** 0a1eeaf5…3c12e.
- **M3** (the strip match replaced by `rest.find("Out of Range Error").map(|at| &rest[at..])`):
  - T3 gave rc 101 and FAILED at `engine\src\stream.rs:2824:13`, at "the label later in the text after the crate prefix".
  - left `Some("Out of Range Error: Overflow in multiplication of INT64 (3600000000000000000 * 3600000000000000000)!")`, right `None`. This is as predicted and as recorded.
- **Restore 3:** 0a1eeaf5…3c12e.
- No mutation run recompiled DuckDB. These were my own runs of the mutations; no `verify-mutation` run was involved.

## Check 4: the seam

**E1 against the real producer:**
- E1 calls `AdmittedPredicate::admit`, then `Dataset::stream_with_cancel(&q, CancelToken::new())`, and drains with `next_into`.
- That is the shape of the drain pin the form cites. Its sha256 recomputes to 08df3d74ff76c2b2315d379f14f9f74622b0d0aaa8c43108c85ad6205cb27ba6, matching §4.
- It is also the product's path:
  - `kernel/src/lib.rs:279` calls `ds.stream_with_cancel`;
  - `kernel/src/lib.rs:681` drains `self.stream.next_into(out)`;
  - `skp::terminal_detail_of` wraps the engine's Display unchanged.
- The fetch arm (stream.rs:1909) is the only `catch_unwind` and fetch site in engine/src.

**The fixture is the step-0 file:**
- E1's writer matches the step-0 probe's `write_f`: the same `xy`, `v_of`, 65,536-row batches, writer defaults and geo metadata.
- The F-1M left by the M1 run has sha256 5570b4d0599fa0b2055661d960ba640ba9cb103e3cc9d661b95f958b2d9e6453, equal to step 0's F-1M. So N by §3's rule carries over byte for byte.

**T3's bare sample:** it is built from the exact text DuckDB's source composes. The cites in T3's doc (multiply.hpp:77; exception.cpp:116; error_data.cpp:65, 67) resolve in the vendored v1.5.5 source to the lines my script read, as do the constant docs' cites (arrow_batch.rs:46; exception.cpp:146; stream_query_result.cpp:181, 183).

**The claim split, as the settlement words it:**
- The wrapped shape is observed through the engine (step 0: 16 of 16 runs; E1 locally and on CI).
- The bare shape is recognised and proven by the T3 unit sample only, never observed. The docs say so at:
  - the `OUT_OF_RANGE_DETAIL` doc;
  - E1's header (lines 9-11);
  - T3's doc.

**The PR body against the head and my runs:**
- 4 files: holds.
- Two private constants, each checked against both sources: holds.
- E1 on a 1,000,000-row fixture in both shapes: holds.
- E1 and T3 pass at head: holds.
- M1 to M3 fail where §4 predicts: holds.
- The engine suite is green: holds.
- Rule (00): `gh pr list --state open` shows only #268.
- The disclosure about `admitted_integer_overflow.rs`: see the note under D1.

## Check 5: verify scripts, fmt and CI

All run at the head in the worktree:
- `verify.mjs --offline`: rc 0, "verify:plan PASS".
- `verify-cites.mjs`: rc 0, PASS over 2493 files (75 loose references advised).
- `verify-quotes.mjs` (timeout 580 s): rc 0, PASS — 131 checked, 100 verified, 30 baselined, 0 hash-reference errors, 884 ruling cites resolved.
- `verify-test-claims.mjs`: rc 0, PASS — 695 claimed tests.
- `cargo fmt --all -- --check` (shared hold): rc 0, empty output.

**CI:**
- `gh pr checks 268` first gave rc 8 with one entry pending. On re-run: rc 0, 18 of 18 pass.
- `gh run view` gives every run's headSha as 5efcc6696481a729a658f1e39c8dcfaa0ccdc5e6. The runs are:
  - push: 40784015861 (Rust), 40784015967, 40784015802, 40784015803, 40784016072;
  - pull_request: 40788263665 (Rust, completed success), 40788263724, 40788263773, 40788263595, 40788263685, 40788263780, 40788263750.
- E1 and T3 in the job logs, `... ok` on both L1 entries in both runs:
  - push run 40784015861: Windows E1 9.62s; Linux E1 5.98s.
  - pull_request run 40788263665: the Windows and ubuntu-24.04 entries.
- I ran no macOS entry, and none exists in these runs.

## Hold lines (this project only; `also=` elided)

- `MACHINE_HOLD shared project=SpatialIDE cores=0-7 affinity=FF shell=bash.exe:1128` / `MACHINE_RELEASED project=SpatialIDE shell=bash.exe:1128 affinity=FF (cores 0-7)`: E1 and T3 at head.
- `… shell=bash.exe:6692` hold and release: engine suite at head.
- `… shell=bash.exe:23120` hold and release: fmt check.
- `… shell=bash.exe:18696` hold and release: cold build and baseline on the export.
- `… shell=bash.exe:30212` hold and release: M1.
- `… shell=bash.exe:39584` hold and release: M2.
- `… shell=bash.exe:10164` hold and release: M3.

Every cargo call ran inside one of these holds; there was no exclusive hold and no script exit code from 96 to 99.

**Shape variance, disclosed:** each hold line added `echo cmd_rc=$rc` between `rc=$?` and the release, to print the exit code.

## State at the end

- The worktree's porcelain is empty (0 bytes) and HEAD is 5efcc669.
- D:/wt-targets/e9-g1r-export is removed: `ls` gives rc 2, "No such file or directory".
- D:/wt-targets/e9-g1r-target is left in place: it is a cold clang-cl build, and the custodian may sweep it.
- My `e9-g1r-` files stay in my scratch folder, including the extracted DuckDB source and the tar.
- One E1 fixture is left in the user temp folder (see the notes above).
- I made no commit, push or PR action, and the only network calls were `gh`. I killed no process.

Model: Opus 5.5 (claude-opus-5-5), as the harness reports it.
