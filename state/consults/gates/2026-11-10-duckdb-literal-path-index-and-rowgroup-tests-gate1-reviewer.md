Reviewed: PR #305 at d47df40b9120265e00e674836621bb3c64c72d09 (base 6936af59), gate 1, reviewer
cut/duckdb-literal-path-index-and-rowgroup-tests @ d47df40b9120265e00e674836621bb3c64c72d09
Verdict: PASS WITH NOTES

Nothing blocks. Both tests are correct, both mutations fail by name exactly as predicted (I applied each one myself), and the suite passes at the head. Nothing in the PR's diff has to be fixed before the merge. The notes below are preferences (Part 1 item 6) or concern a record already on main.

## Findings by class

**Correctness:** none.
**Evidence:** none.
**Documentation (must-fix before the merge):** none in the PR's diff.

**Notes (preferences, no acceptance condition):**
- N-a, the module-doc sentence (head :5-6), checked clause by clause. "The file also covers the spatial-index and row-group-index builds" is true: two tests, one per build. "over such a file" is literally true, since `zones[1].parquet` is such a file. But "such a file" points back to a class that includes `{`/`}` names, and the tests cover only the K1 bracket pair. If wanted (this is a worker's line, not the human's wording), replace it with: "The file also covers the spatial-index and row-group-index builds over one such file, `zones[1].parquet` beside its decoy, one test each."
  - "one such file, `zones[1].parquet`": `write_k1_pair` writes only that literal (:251).
  - "beside its decoy": `zones1.parquet` (:253).
  - "one test each": :265 and :298.
- N-b, the `write_k1_pair` doc (:233-235). "`row_group_rows` and `chunk` as given" does not say what happens on `None`: the fixture defaults stay (1 048 576 and 4 096, `fixture.rs` `impl Default`). The doc also leaves out that the helper clears the directory first (:238). This is not untrue. Optional words: "...each with a native unique id, and `row_group_rows` and `chunk` set to `rows_per_group` when it is given (the fixture's defaults otherwise), after clearing the directory. Returns the literal file's path."
- N-c, the worker's report (a record on main, not in this PR).
  - "Every cargo call and `verify-quotes` ran in a shared hold" is untrue, according to the custodian's filing note (four `cargo fmt` calls ran outside a hold). I did not read the worker's transcript myself; this rests on the filing note.
  - "Output lines 14-15 of `e13-mi.txt`" (and the same for `e13-mr.txt`) is imprecise. The spans it quotes are lines 14, 15, 16 and 17, and its Summary is line 24. Every span is byte-equal to its file (check 11).

## Checks

1. **Out-of-scope, clause by clause.**
   - The diff touches nothing outside `engine/tests/single_file_bracket_name.rs` (`git diff --name-only`, rc 0, that one file). So ADR, Security, Wire and Guarantee are each none.
   - E1's assertions and name are byte-unchanged (check 2). No claim about Linux, timing or docs/08 appears in the docs that were added.
   - My scan of the 90 added lines, each pattern self-tested positive first, found 0 hits each for `pub`, `cfg`, `#[ignore]`, sleep, retry, timeout, `.unwrap()`, `println!`, `unsafe`, serde_json and thread.
   - `git diff --quiet ... -- Cargo.toml Cargo.lock engine/Cargo.toml` returned rc 0 (unchanged).
   - No new dependency, product seam or user-visible string: assertion messages are test output.
   - The line names no §21a category as touched.
2. **The diff against the Change and Tests+mutation lines.**
   - Both tests call `write_k1_pair`. It writes `zones[1].parquet` (`LITERAL_FEATURES` 500) and `zones1.parquet` (`DECOY_A_FEATURES` 300, `DECOY_A_SEED`) through `write_file`, which calls `write_geoparquet`. They use `IdentityMode::NativeUnique` and the default covering (`with_covering_bbox: true`, `fixture.rs` Default). Each is written under `fixture_root()` in its own directory, `index-k1` or `row-group-k1`, distinct from E1's `k1-keyless`/`k1-native`. The row-group test sets `row_group_rows` and `chunk` to 100.
   - Each test opens with `Dataset::open_cancellable(&literal, None, None, &CancelToken::new(), PoolConfig::default())`, the signature at `dataset.rs:296`. It then calls `build_index(&CancelToken::new())` (:730) or `build_row_group_index(&CancelToken::new())` (:853).
   - The assertions read the real fields of `IndexReport` (`dataset.rs:134`) and `RowGroupReport` (`:119`): `indexed_features == LITERAL_FEATURES`, `scanned_rows == LITERAL_FEATURES as u64` and `row_groups == LITERAL_FEATURES.div_ceil(ROWS_PER_GROUP)`.
   - The seams at the head are as the form says. `build_index_observed` passes the raw `path_str` to `SpatialIndex::build_observed` (`index.rs:314`), which escapes it at :332. `build_row_group_index_observed` passes it to `RowGroupIndex::build`, then to `read_metadata` (`rowgroup.rs:384`), which escapes it at :397.
   - `write_k1_pair` is a private test helper with two product-free callers, both tests. That is within the Change line, whose "the helper" means the product `duckdb_literal_path`, which is unchanged.
   - Base against head, by my script (`e13-g1r-e1.mjs`, rc 0): every base line except base:5 is byte-equal and in order at head (mismatches `[]`). The one deleted line is base:5 `//! rows.`, replaced by head:5 `//! rows. The file also covers the spatial-index and row-group-index builds over such a file, one` and head:6 `//! test each.`. So E1's name, `SHAPES`, constants, helpers, rows, assertions and doc are byte-unchanged.
3. **Doc comments.**
   - Index test doc: every clause is true against the code. 500 and 300 are the constants; the open and build calls are as named; "the build is admitted" is the `.expect` on Ok; "500 indexed features and 500 scanned rows" are the two assertions.
   - Row-group test doc: every clause is true. "100 rows per row group" is `ROWS_PER_GROUP` set on both specs; "5 row groups, not the decoy's 3" is the assertion, and M-R observed 3.
   - Each `RECORDED MUTATION` paragraph is last in its doc and names T in full, `a096ebbb7358539664f46cb669d2c7856b86e175` (my script counts 2 such lines). Each names its site correctly. The outcomes "300 against 500" and "3 against 5" match `e13-mi.txt`/`e13-mr.txt` lines 15-17 (MATCH by script, `e13-g1r-q.mjs`).
   - The paragraphs quote no output line verbatim, so there is no quoted line to compare byte for byte. What they state matches.
   - `node scripts/plan/verify-mutation.mjs --base 6936af59 --head HEAD` returned rc 0: `verify:mutation PASS — all 2 new test(s) have a recorded mutation naming them.` This is a self-check, not an observation.
4. **Mutations, by me, at the committed head, one at a time, each in its own shared hold.**
   - **M-I:** the old text occurs once in `engine/src/index.rs`. The diff is :332 `p = crate::dataset::duckdb_literal_path(path).replace('\'', "''"),` becoming `p = path.replace('\'', "''"),`. The command returned rc 101. The row-group test and E1 ran `... ok`; the index test `... FAILED`. Byte-copied:
     - `thread 'an_index_built_over_an_existing_bracket_named_file_holds_only_that_files_features' (23680) panicked at engine\tests\single_file_bracket_name.rs:280:5:`
     - `assertion `left == right` failed: indexed_features is the literal file's count, not the decoy's`
     - `  left: 300`
     - ` right: 500`
     - `test result: FAILED. 2 passed; 1 failed; 0 ignored; 0 measured; 0 filtered out; finished in 1.87s`
     - Reverted with `git checkout -- engine/src/index.rs` (rc 0); the porcelain was empty (0 bytes).
   - **M-R:** the old text occurs once in `engine/src/rowgroup.rs`. The diff is :397 `.query([crate::dataset::duckdb_literal_path(path)])` becoming `.query([path])`. The command returned rc 101. The index test and E1 ran `... ok`; the row-group test `... FAILED`. Byte-copied:
     - `thread 'a_row_group_index_built_over_an_existing_bracket_named_file_reads_only_that_files_footer' (60476) panicked at engine\tests\single_file_bracket_name.rs:314:5:`
     - `assertion `left == right` failed: row_groups is the literal file's footer's count, not the decoy's`
     - `  left: 3`
     - ` right: 5`
     - `test result: FAILED. 2 passed; 1 failed; 0 ignored; 0 measured; 0 filtered out; finished in 1.83s`
     - Reverted (rc 0); the porcelain was empty (0 bytes).
   - Both match the prediction; neither mutation survived.
   - The line numbers differ from T's because the doc commit added a line to each test's doc. The assertions sit at 280 and 314 at head, and at 279 and 312 at T, which I confirmed by `git show a096ebbb`.
5. **Unmutated at the head:** rc 0, `test result: ok. 3 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 1.77s`.
6. **Suite.**
   - `cargo fmt --all -- --check`: rc 0.
   - `cargo test --workspace --locked` under `timeout 3600`, one shared hold, background: ws-rc 0. 118 `test result:` lines, 1029 passed, 0 failed, 66 ignored, 0 lines not ok.
7. **Clippy** (`-p spatial-engine --all-targets -- -D warnings`): rc 0, recorded and not claimed. Output: `Checking spatial-engine v0.0.0 ...` and `Finished `dev` profile ... in 11.13s`. 0 diagnostics, so none in the added lines.
8. **Size:** `90	1	engine/tests/single_file_bracket_name.rs`, 91 in all, against the declared 150. No class 6.
9. **Governance checks at the head, from the worktree root.**
   - `node --test` (plan, hooks, evidence), in a hold: rc 0; tests 598, pass 598, fail 0.
   - `verify-cites`: rc 0, PASS, 179 loose references advised.
   - `verify-quotes`, in a hold: rc 0, `PASS — 155 checked, 124 verified, 30 baselined, 1 advisory, ... 0 ruling-cite errors`.
   - `verify-test-claims`: rc 0, PASS, 783 claimed, 43 planned.
   - `verify.mjs --offline`: rc 0, `verify:plan PASS`.
   - `forms-layout`: rc 0, PASS, 215 files.
10. **Bytes**, by script, self-test positive (cr 1, tab 1, hi 2): the 90 added lines hold 0 CR, 0 tab and 0 non-ASCII bytes. The file ends in `\n`, both in the working tree and in `git show d47df40b`.
11. **The worker's report against its outputs.**
   - The raw files' 16 sha256 prefixes match the packet.
   - All ten quoted spans (M-I and M-R: the panicked line, the assertion, left, right and the summary) are byte-equal to lines 14, 15, 16, 17 and 24 of `e13-mi.txt`/`e13-mr.txt`.
   - The suite totals match `e13-ws.txt` by my script: 118 lines, 1029 passed, 0 failed, 66 ignored. My own run reproduced the same totals.
   - Also true: unmutated and head `3 passed`; clippy `44.56s`, 0 diagnostics; the 598 node tests; and the verify-mutation, verify-quotes, verify-test-claims, verify and forms-layout lines.
   - Untrue or imprecise sentences: see N-c.
   - The three deviations: nothing follows for the piece.
     - (1) `cargo fmt` outside a hold is a lint call with no code effect. The head's fmt check passes in a hold (check 6).
     - (2) The scratch helper written by heredoc touched nothing tracked. The diff is the Scope file only.
     - (3) The push was piped through `tail`, but `gh pr view 305` gives headRefOid `d47df40b9120265e00e674836621bb3c64c72d09`, and every CI run is at that sha.
12. **CI:** `gh pr checks 305` returned rc 0, every check pass. That covers the L1 ubuntu and windows `cargo test --workspace` runs, fmt, cfg boundary, DCO, the profile-path scan, ported-notices, the tauri build, verify:plan and the shell build. `gh run view` on all 12 runs (each rc 0) gives headSha `d47df40b9120265e00e674836621bb3c64c72d09` and conclusion success for each:
   - pull_request runs 42731790672, 42731790559, 42731790411, 42731790639, 42731790361, 42731790345 and 42731790262;
   - push runs 42721961749, 42721962302, 42721961957, 42721961783 and 42721962031.
13. **Porcelain afterwards:** `git status --porcelain --untracked-files=no` is empty (0 bytes), and HEAD is d47df40b9120265e00e674836621bb3c64c72d09.

**Disclosures:**
- I issued the clippy, `node --test` and `verify-quotes` hold calls in one parallel block, so those three shared holds overlapped in time. Each held one command; the mutation runs were strictly serial.
- D: had 194.4 GiB free (195G by `df`) before any cargo call.

## For the human
- Information only, unchanged from the packet: N2's reading that a session-tier dataset cannot build the spatial index is still unobserved (OPEN-4 (A)).
- OPEN-1 to OPEN-4 were taken (A) under the direction held to 2026-11-16, for your review on return. Nothing in this gate bears on them.

## The packet's gaps
- T's line numbers for the two assertions (279 and 312), which I needed to reconcile the worker's panicked lines with the head's 280 and 314. I derived them from `git show a096ebbb`.
- The packet did not say that the `RECORDED MUTATION` paragraphs quote no output line verbatim, which brief check 3 assumes. I found that by reading the diff.
- No other gaps.

## Hold lines (this project's only, `also=` elided)
- `MACHINE_HOLD shared project=SpatialIDE cores=0-7 affinity=FF shell=bash.exe:81608 also=…` (M-I), then `MACHINE_RELEASED project=SpatialIDE shell=bash.exe:81608 affinity=FF (cores 0-7)`
- `... shell=bash.exe:14900 ...` (M-R), held and released
- `... shell=bash.exe:55788 ...` (unmutated), held and released
- `... shell=bash.exe:69624 ...` (fmt), held and released
- `... shell=bash.exe:18000 ...` (workspace suite), held and released
- `... shell=bash.exe:63072 ...` (clippy), held and released
- `... shell=bash.exe:21008 ...` (node --test), held and released
- `... shell=bash.exe:69228 ...` (verify-quotes), held and released
- Every hold was granted (no exit code 96-99), and every one was released.

## Background shells left
None. bmza8gu1s (the workspace suite) and bh2wstb74 (verify-quotes) both completed with exit 0, and no `cargo.exe` is running. I killed nothing.

Scratch outputs are in <S>/, every file named `e13-g1r-*`: `e13-g1r-mi.txt`, `e13-g1r-mr.txt`, `e13-g1r-unmut.txt`, `e13-g1r-ws.txt`, `e13-g1r-clippy.txt`, `e13-g1r-nt.txt`, `e13-g1r-vq.txt`, `e13-g1r-runs.txt`, and the scripts `e13-g1r-e1.mjs`, `e13-g1r-q.mjs`, `e13-g1r-bytes.mjs`, `e13-g1r-scan.mjs`, `e13-g1r-tot.mjs` and `e13-g1r-mut.mjs`.
