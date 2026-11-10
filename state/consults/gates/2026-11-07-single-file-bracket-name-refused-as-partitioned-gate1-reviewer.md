*Custodian's filing note (2026-11-07): the reviewer's report for gate 1 of PR #294, from its hand-back (sha256 8e2e9e4379bb95eb3a13c71782058fc43d3bd6d0fac241126a165595884cd8af, 18250 bytes), byte for byte except one span: the path of the session scratch folder in its last paragraph (1 time), a user-profile path, replaced by `<the session scratch folder>/` under the human's rule that no filed record quotes a user-profile path. A report, not Authority.*

---

Reviewed: PR #294 at 0307fdfb2106eb2030bcef2f04235e8c5989dbf1 (base d37112d8), gate 1, reviewer · cut/single-file-bracket-name-refused-as-partitioned @ 0307fdfb2106eb2030bcef2f04235e8c5989dbf1
Verdict: PASS WITH NOTES

I checked the brief's sha256 (6f05116c…0571, 12691 bytes) and the packet's (dcd11a5c…2f44, 10392 bytes). Both match. I read the Part 1 rulings, the form at main (sha256 14d80faf…a7cd, Amendments 1 and 2 and the settlement included), the worker report (ee771eb4…ff61), the step 0 report and the whole diff.

No finding blocks. The notes are five comment sentences that must be fixed before the merge, each given with replacement words below, and one Evidence note. The marker is not WORDS-ONLY because the Evidence note is not a sentence.

## Findings by class

### Correctness: none
- Gate, helper and sites match §2.1 and §2.3. I re-ran the suite at the head myself.
- All three mutations fail as §4 and Amendment 1 predict, and I observed each one myself at 0307fdfb.
- The seam test K1 starts from the real `OpenDatasetRequest` and goes through `SkpHost::open_dataset`.

### Evidence: none blocking; one note (item 6: a preference, not a new acceptance condition)
- **EV-1. The helper at `index.rs` (`build_observed`) and `rowgroup.rs` (`read_metadata`) is covered by no test.**
  - My probe X1 on the export put the raw path back at both sites (`p = path.replace(…)` and `.query([path])`). E1, T2 and K1 all still passed (rc 0, 0, 0).
  - So a regression at either site would go unseen. For a bracket-named file, the spatial index or the row-group index would then be built from a decoy's rows.
  - Requirement: none is broken. §4 declares E1's path as open then `stream(&ViewportQuery::all())`, and §8 item 3 is met (every site uses the helper). This is the packet's known finding 2, now observed.
  - What would close it, if the custodian wants it: one bbox-stream row in E1 on a file with a covering, or a follow-up node.

### Documentation (must-fix before the merge; none is the human's wording; the worker applies these words with no re-gate and the PR body lists them)

**D1. `open_inner`'s gate comment** (engine/src/dataset.rs at the head, the R-I4 comment).
- The text: "it asks the filesystem a stat and no more".
- What is wrong: the gate can ask two stats, `path.is_dir()` and then `path.is_file()`.
- Replacement: "never by opening anything: it asks the filesystem only whether the path is a directory and, for a path holding `[`, `]`, `{` or `}`, whether it is a file; a path holding one of those four that is an existing file is not refused here."
- Clause check:
  - "whether the path is a directory": `partitioned_source_detail`'s first statement is `if path.is_dir()`.
  - "for a path holding … whether it is a file": `path.is_file()` is reached only inside `if !matches!(found, '*' | '?') && path.is_file()`.
  - "not refused here": that branch returns `None`.

**D2. `partitioned_source_detail`'s doc.**
- The text: "The only thing it asks the filesystem is a stat."
- What is wrong: the same as D1.
- Replacement: "It asks the filesystem nothing but stats: whether the path is a directory and, when the text holds `[`, `]`, `{` or `}` and neither `*` nor `?`, whether it is a file."
- Clause check:
  - The `find` goes over the list in the order `* ? [ ] { }`.
  - `matches!(found, '*' | '?')` short-circuits before `is_file()`.

**D3. The same doc, step 0's bracket-pair sentence.**
- The text: "Given a file name holding a well-formed `[`…`]` pair, DuckDB's `glob`, `read_parquet` and its footer-metadata functions read a decoy file beside it and never the file itself".
- What is wrong: it generalises past what step 0 ran.
  - Every pair case in step 0 (K1, K2, K5, K6) had a file beside it whose name the pair matches.
  - With no such file, the O8 reading (a reading, not an observation) has DuckDB fall back to the literal.
  - The architect may also want to read this sentence against §8 item 6.
- Replacement: "Given a file name holding a well-formed `[`…`]` pair, with a file beside it whose name the pair matches (as in every pair case step 0 ran), DuckDB's `glob`, `read_parquet` and its footer-metadata functions read that other file and never the file itself".
- Clause check:
  - The step 0 report's O1–O6 table: K1, K2, K5 and K6 under F-raw read the decoy or decoys.
  - Amendment 1 (f): the words do not state the fallback as a DuckDB fact.

**D4. The same doc, the brace sentence.**
- The text: "Given `{` and `}`, `{a,b}` among them, they read the file and none of its decoys, and read no file at all when the file was absent."
- What is wrong: K7 ran only `zones{a,b}` with the file absent. The report says "`zones{1}` with L absent was not run".
- Replacement: "Given `{` and `}`, `{a,b}` among them, they read the file and none of its decoys; with `zones{a,b}.parquet` absent, the one brace case step 0 ran that way, they read no file at all."
- Clause check: the step 0 report's K7 table (K7-K3 reads no file in every form) and its class C bullets.

**D5. The renamed test's doc** (engine/tests/session_identity.rs, `a_path_holding_any_glob_metacharacter_where_no_file_exists_is_refused_by_name`).
- The text: "What is decided for such a path at which a file does exist is in `engine/tests/single_file_bracket_name.rs`".
- What is wrong: "such a path" includes `*` and `?`, and that file tests only the four bracket and brace characters.
- Replacement: "What is decided for a path holding `[`, `]`, `{` or `}` at which a file does exist is in `engine/tests/single_file_bracket_name.rs`; this test writes no file."
- Clause check:
  - E1's `SHAPES` hold only `[ ] { }` names.
  - `dir()` creates a directory and the test writes no file.

## Checks 1 to 7

### 1. The diff (`git diff d37112d8...0307fdfb` in C:/dev/wt/8f, rc 0)
- **Files.** `--name-only` (rc 0) lists exactly the ten files of §7's ESCAPED row.
- **Gate (§2.1), in order:**
  - `is_dir` → directory detail (unchanged);
  - prefix strip, then `find` over `* ? [ ] { }`;
  - `*` or `?` → refused by text, whatever is on disk;
  - the four with `!is_file()` → the same variant and detail text;
  - the four with `is_file()` → `None`;
  - otherwise `None`.
- **Declared unchanged (§5), all byte-equal:** the directory detail and Display, the `format!` detail, the open_inner not-a-file `EngineError::Source`, and `*`/`?` by text.
- **M1's code against the base.** With comments stripped, the base gate and M1's code hash the same (363592ac…bb56 for both).
- **The helper.** One pass over `chars()`: `[` becomes `[[]`, `]` becomes `[]]`, and everything else is pushed as it is.
- **The DuckDB sites (my own grep).** `git grep -nE "read_parquet\(|parquet_metadata\(|parquet_kv_metadata\(|parquet_schema\(|parquet_file_metadata\(|glob\(" 0307fdfb -- engine/src` (rc 0).
  - Every product site outside `layout.rs` passes its path through the helper, and on the interpolated sites the helper runs before `.replace('\'', "''")`.
  - The 11 product callers: dataset.rs:1093, 1120, 1133, 1439, 1719, 1748, 1815, 2046; stream.rs:1228; index.rs:332; rowgroup.rs:396. These are §0.4's eleven.
  - The other matches are comments, tests, `pool.rs:792` (a fixed https URL) and `lod.rs:1384` (the parquet crate, not DuckDB).
  - Outside engine/src, no `.rs` file calls DuckDB on a file (the matches are two comments).
- **`stream()`.** The binding `path` (stream.rs:1228) is used only at :1271, as `produce`'s `path`, which is used only in `params` (:1810), DuckDB's bind. `post_check_path` stays `self.path()`, the raw path.
- **Raw path kept.** `Dataset::path` is unchanged. Pin, content hash, caches, LOD and `geo_from_kv` all receive the raw path. There is no double escape: every escape is applied inside the leaf function that receives the raw text.
- **`pub` items.** One added line has a visibility: `pub(crate) fn duckdb_literal_path`. No line with `pub` was removed.
- **Commit times** (`git log --format='%H %cI'`, rc 0). The earliest is 7b7f467d at 2026-11-07T15:35:28+01:00 (14:35:28Z). That is after the directive's enqueue at 11:22:58Z and after #290's merge (`gh pr view 290`: mergedAt 2026-11-07T10:06:21Z).
- **Size** (`--numstat`, rc 0): 618 added + 59 deleted = 677 against 480.
  - This is class 8, recorded as Amendment 2, and §7's 480 line is unedited at main.
  - No changed line falls outside the ESCAPED row's scope.
- **Bytes.** Checked with node over the 618 added lines (the Git Bash grep CR count was false):
  - CR 0, tab 0, and every file ends in LF.
  - 23 non-ASCII characters on 7 lines, all punctuation: —, §, →, ·, …. Six of the lines carry characters the lines they replace already had. The new one is the `…` in `partitioned_source_detail`'s doc.

### 2. The suite at the head (C:/dev/wt/8f, `CARGO_TARGET_DIR=D:/wt-targets/8f`, shared holds, `timeout 3600`)
- **D: free** before the run: 218,638,299,136 bytes.
- **`cargo test --workspace --locked`: rc 0.**
  - 116 `test result:` lines, none FAILED, summing to 1024 passed, 0 failed, 66 ignored.
  - Passing by name: E1, K1, `dataset::tests::the_reader_path_matches_only_the_literal_file_and_nothing_once_it_is_gone` (T2), and `a_path_holding_any_glob_metacharacter_where_no_file_exists_is_refused_by_name`.
- **`cargo fmt --all -- --check`: rc 0**, no output.
- **`cargo clippy --workspace --locked --tests --no-deps -- -D warnings`: rc 101.** It stopped at spatial-renderer (renderer/src/canonical.rs:240, renderer/src/style.rs:10), outside the ten files.
- **Clippy re-run with `--keep-going -p spatial-engine -p spatial-kernel`: rc 101.** Three errors in the engine lib, two of them in files of the ten. None of their lines is in the diff (blame: 93a32458, 8a1f3eac, 0116c676):
  - rowgroup.rs:331, too many arguments (8/7);
  - stream.rs:2346, `if` with identical blocks;
  - stream.rs:2462, too many arguments (10/7).
- **Not linted.** Because the engine lib fails clippy, the engine's tests and the kernel were not linted, so the two new test files were not linted.
- **Porcelain afterwards:** empty (0 bytes). HEAD is 0307fdfb.

### 3. M1, M2 and M3 on the export
- **The export.** `git archive 0307fdfb` into D:/wt-targets/8f-g1r-export, extracted with `tar --force-local`.
  - `.cargo/config.toml` sha256 6889110645ec…e35f, the same as the worktree's.
  - D: free before the build: 216,116,973,568 bytes.
  - Target D:/wt-targets/8f-g1r-target (new and cold); TMP and TEMP set to D:/wt-targets/8f-g1r-xtmp; `--locked --no-fail-fast`, each run under `timeout 3600` in a shared hold.
- **Unmutated:** E1, T2 and K1 all rc 0, all `ok`.
- **M1 (the `is_file` return removed, so the gate's code is the base's):**
  - E1 rc 101, at :194, "K1, a bracket pair (keyless): assertion 1, the file must be admitted: refused: this source is partitioned …".
  - K1 rc 101, at the open (:78), code `engine.identity_ordinal_partitioned_unsupported`.
  - T2 rc 0, as expected.
  - As predicted. The worker's M1 is the same edit and is §4's M1 in effect: without the branch, the code is the base gate.
- **M2 (the helper returns its input):**
  - T2 rc 101 at the L-absent pair row: "a bracket pair, literal absent: glob lists no file once the literal is gone, got [\"zones1.parquet\"]".
  - E1 rc 101 at assertion 2, K1 keyless row: left 300, right 500.
  - K1 rc 101 at the row count: `Some(300)` against `Some(500)`.
  - As predicted.
- **M3 (the `'['` arm dropped):**
  - T2 rc 101 at the L-present pair row: left `[]`, right `["zones[1].parquet"]`.
  - E1 rc 101 at assertion 1, with DuckDB's "No files found that match the pattern" for `zones[1[]].parquet`.
  - K1 rc 101 at the open, code `engine.source`.
  - As predicted.
- **Restores.** After each mutation, `engine/src/dataset.rs` sha256 was 8af4ffc0…489d, equal to `git show 0307fdfb:engine/src/dataset.rs`.
- **My two probes, labelled as probes and not form mutations:**
  - X1 is EV-1 above. After it, index.rs and rowgroup.rs were restored to e1e8a5a2… and 3def06c3…, equal to the head's.
  - X2 added two rows to E1: `zones[1]{a,b}.parquet` with decoys `zones1{a,b}.parquet` and `zones[1]a.parquet`, and `d{a,b}/zones[1].parquet` with decoys `d{a,b}/zones1.parquet` and `da/zones[1].parquet`. E1 rc 0, `ok`: mixed bracket-and-brace names open as the one file on Windows. The E1 file was restored to 75edb8d1…, the head's.
- **One void run.** My first X1 edit failed to apply (rc 3, no match) while its run had already been launched. That run (rc 0, 0, 0) was therefore an unmutated rerun; its outputs are renamed `x1void` and are not counted.
- **Cleanup.** The export, its target and both tmp folders are removed (`ls` finds none).

### 4. Tests at their boundaries
- **E1.**
  - Path: `Dataset::open_cancellable` then `stream(&ViewportQuery::all())`, drained.
  - Rows: 8 shapes (K1, K2, K3, four K4, K5), each under `IdentityMode::ForeignKeyColumn` (equal to `keyless()` in session_identity.rs) and under `NativeUnique`, beside decoys of 300 and 200 with distinct seeds.
  - Four assertions, as declared. The decoy-sum check is skipped only where the sum is 500 (K2 and K3), as Amendment 1's K2/K3 item says, and assertion 3 then tells the literal from the pair.
- **K1.**
  - Path: `SkpHost::open_dataset` on the describe_crs_unit.rs harness (identical constructor), then `describe`, then the catalog's dataset streamed and drained.
  - The extent is a constant (`not-established-at-open`, kernel/src/skp.rs `describe_dataset`), so the drained stream is the packet's known finding 3, as the form provides.
- **T2.**
  - Rows in order: pair absent with decoy, pair present, lone `[`, lone `]`.
  - Each row goes through `glob` and `read_parquet` on `configured_connection()`.
  - The no-match error is taken from DuckDB on a plain absent path, never typed.
- **Forbidden constructs.** No `#[ignore`, `cfg`, `sleep`, `retry` or `timeout` in the added lines (grep rc 1).
- **Existing tests.** The only diff over existing tests is session_identity.rs: the rename and its doc. The four assertion paths are unchanged.
- **The three `RECORDED MUTATION` lines** name `4f0d50cee15f0e48abd582053677b55f62af077d`.
  - Each describes its mutations, and each outcome matches what I observed at 0307fdfb.
  - From 4f0d50ce to the head, the only non-comment Rust change is the rename.

### 5. The comments, clause by clause
- False clauses: D1 to D5 above.
- True against the code:
  - every other changed comment line, including the five steps;
  - "The refusals of steps 1 to 3 are one variant …";
  - the order-of-scan sentence;
  - the "file appearing later changes the answer" clause;
  - the helper's doc (sites, `{`/`}` copied, `layout.rs` untouched, `Dataset::path` raw);
  - the docs of E1, K1, T2 and T2's two helpers;
  - the "Not claimed" paragraph, which carries Amendment 1's (c), (d) and (e).

### 6. The records
- **KNOWN-LIMITATIONS.** The diff touches item 20's lines only: the hunk at 272 changes nothing above item 20, and item 21 is context.
- **Item 20 (the human's wording, a draft).** Each clause is true at the head:
  - `[ ] { }` existing file admitted, `*`/`?` refused whatever is on disk, the four refused when no file is there (`!is_file()`), the Display unchanged;
  - "observed on Windows";
  - not claimed: (d), (e) and (c).
  - X2 adds evidence for the general "opened as that one file" clause on mixed names.
- **SKP-V0 §1's sentence (the human's wording, a draft).** Every clause is true at the head. No replacement words for either draft.
- **engine/README.md, the worker's three lines.** True:
  - E1's name matches the test;
  - the form's path is placed in order between MULTIPOLYGON and SOURCE-WATCHER;
  - the Last verified clause names e05a8b90, the packet's known finding 7.

### 7. Verify scripts and CI (in C:/dev/wt/8f at the head)
- `node scripts/plan/verify.mjs --offline`: rc 0, "verify:plan PASS".
- `verify-cites.mjs`: rc 0, PASS, 2734 files.
- `verify-quotes.mjs`: rc 0, PASS, 138 checked, 107 verified, 30 baselined.
- `verify-test-claims.mjs`: rc 0, PASS, 751 claims.
- `node --test` over the plan, hooks and evidence suites: rc 0, 598 pass, 0 fail.
- `gh pr checks 294` (read 2026-11-07T16:46:26Z): rc 8, because one check was pending.
  - Every completed check passed.
  - Pending: `cargo test --workspace (windows-latest)` in pull_request run 42392481643.
  - The push run 42388945770 passed both L1 jobs at the same sha.
- `gh run view` on all 12 runs: each headSha is 0307fdfb2106eb2030bcef2f04235e8c5989dbf1. 11 had completed with success; 42392481643 was in_progress.

## For the human
- Item 20's and SKP-V0's drafts are clause-true against the head, and I give no words. They carry (d), (e) and (c) and claim no more.
- X2 is evidence that mixed bracket-and-brace names also open as the one file on Windows.
- The architect's I-5 reading is not mine.

## The packet's gaps
- #290's merge time (needed for §8 item 1); I took it from `gh pr view 290`.
- Which clippy errors are main's own: the packet says only that main fails. I mapped them by blame.
- That step 0's K7 ran only `zones{a,b}` absent (needed for D4); it is in the step 0 report, by locator.

## Holds (own project only, `also=` elided)
All were `MACHINE_HOLD shared project=SpatialIDE cores=0-7 affinity=FF`, each followed by `MACHINE_RELEASED … (cores 0-7)`. There were ten:
- the workspace test;
- fmt plus clippy;
- clippy over engine and kernel;
- the export baseline;
- M1, M2 and M3;
- X1 void;
- X1;
- X2.

No exclusive hold, no `-TargetPid`, and no exit code from 96 to 99.

## Disclosures and background shells
- One stray write outside scratch: a redirect to /tmp/8f-g1r-x inside a hash comparison. I removed it in the same call, and `ls` confirms it is gone.
- Every background shell I started has completed: the workspace suite, verify-quotes with the node tests, two clippy runs and six export runs. None is running, so I killed nothing.
- The worktree's porcelain is empty and its HEAD is 0307fdfb.
- Scratch files are under <the session scratch folder>/, all named `8f-g1r-*` (for example 8f-g1r-ws-test.txt, 8f-g1r-clippy2.txt, 8f-g1r-m1-e1.txt to 8f-g1r-m3-k1.txt, 8f-g1r-x1-*.txt, 8f-g1r-x2-e1.txt).
