Reviewed: PR #305 at d47df40b9120265e00e674836621bb3c64c72d09 (base 6936af59), gate 1, architect · cut/duckdb-literal-path-index-and-rowgroup-tests @ d47df40b9120265e00e674836621bb3c64c72d09
Verdict: PASS WITH NOTES (WORDS-ONLY)

I have no shell, so I cannot show the sha256 of the brief, the packet or any file, and I give none of my own. I leave no background shell. I read the head in `C:/dev/wt/e13`, and I read main at `C:/dev/spatial-ide` for the base. The packet says no engine path changed on main since the base. Line cites are into the head's tree (`@ d47df40b…`) unless marked "main". I read the rulings first: Part 1, items 1 to 9, of the directive of 2026-11-05.

## Findings by class

**Correctness: none.** **Evidence: none.**

**Documentation: one sentence, D1, the worker's wording.** It is not the human's wording and not red-line text. It is must-fix before the merge: the worker applies the words with no re-gate, and the PR body lists them (Part 1, item 2).

- **D1.** The module-doc sentence, `engine/tests/single_file_bracket_name.rs:5-6 @ d47df40b…`. Byte-copied: "The file also covers the spatial-index and row-group-index builds over such a file, one test each."
  - **What is wrong.** "Such a file" refers back to :4, "An existing single file whose path holds `[`, `]`, `{` or `}`", which is the whole class that E1's `SHAPES` covers (:30-85). The two new tests build over one name only, `zones[1].parquet` (:251). No brace name and no K2 or K5 shape reaches either index site. So the sentence claims more than the two assertions observe, which the form's Out-of-scope line rules out ("they claim nothing beyond their assertions").
  - **Replacement words (mine):** "The file also covers the spatial-index and row-group-index builds over one such file, `zones[1].parquet` beside a decoy `zones1.parquet`, one test each."
  - **Clause check:**
    - "the spatial-index and row-group-index builds": `ds.build_index(` at :276-277 and `ds.build_row_group_index(` at :310-311.
    - "over one such file, `zones[1].parquet`": `write_k1_pair` writes only that literal (:251), whose name holds `[` and `]`.
    - "beside a decoy `zones1.parquet`": :253.
    - "one test each": the two tests at :265 and :298.
  - Rustfmt does not reflow comments, so the worker wraps the words by hand under 100 columns.

**Notes** (none is a condition):
- **N1.** The index test's doc says "the build is admitted" (:258-259), and its `expect` text says the same (:278). In this crate "admitted" is the cache's term (`engine/src/dataset.rs:726-729 @ d47df40b…`), and here the build is a miss. The code means that `build_index` returned `Ok`. This is a preference about wording, not an untrue clause.
- **N2.** The three process deviations in the filing note leave the head unaffected:
  - `cargo fmt` ran outside a hold. §36's hold clause binds heavy runs, and fmt is not one.
  - The quoted heredoc wrote to scratch only.
  - The push was piped through `tail`, but the custodian read that origin equals the head.
  - The report's sentence "Every cargo call … ran in a shared hold" is untrue, and the filing note on the same file already discloses it. No correction round follows (the record cap).

## Checks

**1. Out-of-scope, against the head: holds.**
- **ADR: none.** The diff is one test file (packet §1; filing note).
- **Security: none.** Nothing ADR-020, ADR-009 or ADR-021 governs is touched.
- **Wire: none.** There is no file under protocol/ or kernel/, and no SKP or MCP surface.
- **Guarantee: none.**
  - No product line changes: `index.rs:332` and `rowgroup.rs:397 @ d47df40b…` still carry `crate::dataset::duckdb_literal_path(path)`.
  - No existing test's name or assertion changes. Main's :6-230 read equal to the head's :7-231, line for line.
  - The new tests claim nothing beyond equality on counts. No timing, no Linux mutation and no first-component case is claimed.
  - No `#[ignore]`, `cfg`, sleep, retry, timeout or `pub` item is added. `write_k1_pair` is private to the test crate (:236).
- **The five-line route still applies.** The diff is 91 lines in 1 file, against §21c's 150 lines and 8 files (`governance/AUTONOMY.md` §21c). The Out-of-scope line names no §21a category, so §25 (e) does not fire. §36's "§25 (e) set aside for it" applies as a filler. Rule (00) is disjoint (packet §6).

**2. What each test observes.**
- **Index test.** The path is `Dataset::build_index` (`dataset.rs:730-732`), then `build_index_observed`. On a cache miss, that hands the raw `path_str` (:771-774) to `SpatialIndex::build_observed` (:779-788), which escapes the path at `index.rs:332`.
  - This is OPEN-1 (A)'s seam.
  - The assertion is equality: `indexed_features` and `scanned_rows` each equal 500 (:280-287).
  - Under M-I, `e13-mi.txt` lines 14-17 show it failing at `indexed_features` (left 300, right 500), with the other two tests passing (lines 6 and 8).
- **Row-group test.** The path is `Dataset::build_row_group_index` (:853-855), then `RowGroupIndex::build` with the raw `path_str` (:888-901). That calls `read_metadata` (`rowgroup.rs:347`), which escapes the bound path at :397.
  - The assertion is equality: `row_groups` equals `500.div_ceil(100)` (:314-318).
  - Under M-R, `e13-mr.txt` lines 14-17 show it failing (left 3, right 5), with the others passing.
- **Unmutated,** all three tests pass (`e13-unmut.txt:183-188`; `e13-head.txt:5-10`).
- **Could either test pass while its site read the decoy? No.**
  - The decoy has 300 features in 3 row groups, and each assertion is an equality on the literal's count.
  - A cache hit could skip a site only if an entry already existed for the same path in the same process. Each test is the only builder for its path. E1 builds no index, and the caches are per-process (`index.rs:669-683`, `rowgroup.rs:648-654`).
  - Each mutation changes only its own site. The open still goes through the other escaped sites, so the test isolates that site.
- **These tests observe the routing that 8f's Amendment 4 records as unobserved** (`governance/forms/engine/SINGLE-FILE-BRACKET-NAME-REFUSED-AS-PARTITIONED-PREREGISTRATION.md`, Amendment 4, "The sites"), on Windows. The mutation observations are the worker's. Under item 9 they stay the gates' own, so the reviewer re-observes them, not I.
- The M-I and M-R panic lines (:279 and :312 at T) map to :280 and :314 at the head. That is consistent with the doc commit's numstat (6 added, 4 deleted).

**3. N6: holds, on what I can read.**
- **E1 is byte-unchanged except the module-doc sentence.** Main's :5 `//! rows.` became the head's :5-6, and every other line of main's :6-230 reads equal to the head's :7-231.
- **No product line, README, record or fixture is changed.** This rests on the packet's numstat and the filing note's custodian check: one file, 90 added and 1 deleted. The two site lines at the head carry the helper.
- **Mutations are not committed:** the same two lines show it.

**4. The doc comments, clause by clause.**
- **The module-doc sentence: D1.**
- **The index test's doc (:257-263): true.**
  - 500 features beside 300: `write_k1_pair`, :239-244.
  - Built through `Dataset::build_index`: :277.
  - Its report holds 500 indexed features and 500 scanned rows, not 300: :280-287 and M-I.
  - On "admitted", see N1.
  - `RECORDED MUTATION`: the full commit id, a096ebbb… (:261); "the `read_parquet` path left unescaped" in `build_observed`, which is M-I; and "fails at the `indexed_features` assertion, 300 against 500", as in `e13-mi.txt:14-17`.
- **The row-group test's doc (:290-296): true.**
  - Both files are written at 100 rows per group: :245-249 with `Some(100)` at :300.
  - The report holds 5 row groups, not 3: :314-318 and M-R.
  - `RECORDED MUTATION`: "the bound path left unescaped" in `read_metadata`, which is M-R; and "3 against 5", as in `e13-mr.txt:14-17`.
- **`write_k1_pair`'s doc (:233-235): true.** It writes a directory of the caller's own (:237); both files carry `NativeUnique` (:239-243); and `row_group_rows` and `chunk` are set from the argument (:245-249).

**5. Isolation: holds.**
- The new directories are `index-k1` and `row-group-k1` under `fixture_root()` (:266, :300). E1's directories are `<shape>-keyless` and `<shape>-native` (:172), so no name collides. Each test removes only its own directory (:238).
- `create_dir_all` tolerates a parent created at the same moment.
- The kernel test uses a different root (`kernel/tests/single_file_bracket_name_open.rs:53`).
- Both caches are keyed by `PathBuf`. Each test builds through only one cache, at its own path. Each `Dataset` has its own pool (`dataset.rs:165`, :351), so neither test contends for the other's maintenance slot.

**6. OPEN-2 (A) and OPEN-3 (A): hold.**
- **8f's form and `engine/README.md` are untouched.** This rests on the one-file diff. README :549 still pins the experimental seams.
- **This form's closing amendment is the right record.**
  - Amendment 4 is 8f's append-only record at its merge, and it already points forward: "The tests: PLAN node `duckdb-literal-path-index-and-rowgroup-tests`" (Amendment 4, last but one bullet).
  - So a reader reaches this form from 8f.
  - OPEN-2 (B) would reword the human's narrowed words.
  - Under the record cap, the closing amendment carries the two test names, T, the observation files and hashes, and no prose.

**7. The two readings: neither is claimed.**
- No line of the diff and no sentence of the report claims "no test reaches either site", or claims its reading. The report says the session-tier reading "stays unobserved".
- The session-tier reading has a basis in the code:
  - `build_observed` selects `"{id}"` from `read_parquet('{p}')` with no `file_row_number=true` (`index.rs:326`);
  - for the session tier, `source_column` is `file_row_number` (`identity.rs:92-97`).
  - It has no product reach: neither build has a product caller (README :549; Amendment 4's quoted words).
- **Both go to the human as information only.**

## For the human (information, no decision asked)
1. **The session-tier reading** (N2, OPEN-4) is unobserved. If it holds, a session-tier dataset cannot build the spatial index. It becomes a precondition only when a product caller of `build_index` is designed.
2. **Your words in the placement and in 8f's Amendment 4** ("unobserved: no test reaches either site") stand as the record of 8f at its merge. After this merge, these two tests observe both sites on Windows, and this form's closing amendment records that.

## The packet's gaps
- The diff text was a locator only, and I have no shell. I confirmed E1 is unchanged by reading main and the head side by side; byte equality rests on the numstat and the reviewer.
- `e13-ws.txt` was not on my read list, so the full-suite pass at the head (Part 1, item 4) rests on the worker's report.
- T's file text was not given. I reconciled the mutation outputs' line numbers through the doc commit's numstat.
- CI status: locators only, by design.

Files: `C:/dev/wt/e13/engine/tests/single_file_bracket_name.rs`, `C:/dev/spatial-ide/governance/forms/engine/DUCKDB-LITERAL-PATH-INDEX-AND-ROWGROUP-TESTS-PREREGISTRATION.md`, `C:/dev/spatial-ide/state/consults/2026-11-10-duckdb-literal-path-index-and-rowgroup-tests-worker-report.md`.
