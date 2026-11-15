Reviewed: PR #294 at 0307fdfb2106eb2030bcef2f04235e8c5989dbf1 (base d37112d8), gate 1, architect

Verdict: PASS WITH NOTES (WORDS-ONLY)

I have no shell. I could not check the sha256 of the brief, the packet or any file, I give no sha256 of my own, and I leave no background shell. I read the files whole or by range from the worktree `C:/dev/wt/8f`, and main at `C:/dev/spatial-ide` for the base. The packet says HEAD equals 0307fdfb and the ten files did not change on main past the base; I took both facts from it. Line cites below are into the head's tree unless marked.

## Findings by class

**Correctness: none.** **Evidence: none** (but see check 3: items 8, 9 and 13 rest on the worker's report).

**Documentation: seven sentences, all the worker's.** None is the human's wording and none is red-line text, so under Part 1 item 2 the worker applies these words with no re-gate and the PR body lists them. Each is must-fix before the merge. D1 and D2 are what §8 item 6 names: claims about DuckDB that step 0 did not observe, or that the code does not support.

- **D1.** `engine/src/dataset.rs:1862-1866`, `partitioned_source_detail`'s step 0 paragraph.
  - Defect 1: "read a decoy file beside it and never the file itself" (:1864) leaves out the condition step 0 ran under. Step 0 saw the pair read a decoy only when a decoy matching the pair was present (K1, K2, K5, K6). It did not observe a pair with no matching decoy.
  - Defect 2: "and read no file at all when the file was absent" (:1866) generalises from one name. K7-K3 ran `zones{a,b}` only; the step 0 report says `zones{1}` with L absent was not run.
  - Words: "Given a file name holding a well-formed `[`…`]` pair, with a file beside it whose name the pair matches as a pattern, DuckDB's `glob`, `read_parquet` and its footer-metadata functions read that file and never the named one; given a lone `[` or a lone `]` they read the file. Given `{` and `}`, `{a,b}` among them, they read the file and none of its decoys, and, for `{a,b}`, read no file at all when the file was absent."
  - Clause check against the step 0 report's tables:
    - A pair with a matching decoy reads the decoy: K1, K2, K5 and K6 under F-raw.
    - A lone bracket reads the file: K4's `zones[` and `zones]`.
    - Braces read the file and no decoy: K3, and K4's `zones}` and `zones{1}`.
    - `{a,b}` absent reads no file: K7-K3.
- **D2.** `engine/src/dataset.rs:1867-1868`.
  - Defect: "rewrites them at every" / "DuckDB file-reading call" is untrue for `layout.rs`. The helper's own doc (:1925-1926) says those calls are not rewritten.
  - Words: "rewrites them at every DuckDB file-reading call outside the fixture-only `layout.rs`".
  - Clause check: by grep at the head there are 11 DuckDB file-reading sites outside `layout.rs`:
    - `dataset.rs` :1084, :1117, :1130, :1436, :1715, :1745, :1810, :2044;
    - `stream.rs` :1445, through `path` at :1228;
    - `index.rs` :326;
    - `rowgroup.rs` :391.
    - Each takes `duckdb_literal_path`.
    - The `layout.rs` sites at :344, :442, :600 and :624 do not, and `layout.rs` is not in the diff.
- **D3.** `engine/src/dataset.rs:1844-1845` ("The only thing it asks the filesystem is a" … "stat") and `:324-325` ("it asks the filesystem a stat" … "and no more").
  - Defect: a path holding a bracket or a brace gets two stats, `is_dir` at :1882 and then `is_file` at :1905.
  - Words for :1844-1845: "The only things it asks the filesystem are stats: whether the path is a directory and, for a path holding `[`, `]`, `{` or `}`, whether it is a file."
  - Words for :324-325: "it asks the filesystem for stats and no more".
  - Clause check: :1905's `!matches!(found, '*' | '?') && path.is_file()` short-circuits, so `is_file` runs only for the four characters.
- **D4.** `engine/tests/single_file_bracket_name.rs:151-152` ("because the fixture numbers every file's ids from 0") and `:214-215` ("The fixture numbers every" … "file from 0").
  - Defect: the reason holds only for the native rows. The keyless rows use `IdentityMode::ForeignKeyColumn`, which has no `id` column (`engine/src/fixture.rs:533-535`). Their streamed id is the session ordinal, built on `file_row_number` (`engine/src/identity.rs:58-77`).
  - Words for :151-152: "Where the sum is 500, K2 and K3, the sum comparison is skipped and the distinct-id assertion is what tells the literal from the pair, because every file's ids start again from 0: the fixture's `id` column on the native rows, and the row's position within its file on the keyless rows."
  - Words for :214-215: "Assertion 3: the ids are distinct and as many as the rows. Every file's ids start again from 0 (the fixture's `id` on the native rows, the row's position in its file on the keyless rows), so a read of two files repeats them."
  - Clause check:
    - Native ids: `fixture.rs:1055` writes `id = (written + i)`, so each file's ids start at 0.
    - Keyless ids: per-file position (`identity.rs:58-77`).
- **D5.** `engine/src/dataset.rs:2351-2355`, T2's `RECORDED MUTATION`.
  - Defect: Amendment 1 (b) says the `]` equivalent mutant is "recorded so and not run". The test's mutation record does not say so; only the worker's report does.
  - Words to append: "Dropping `]` instead was not run: the form's Amendment 1 (b) records it as an equivalent mutant on this DuckDB, a reading of DuckDB's source and not an observation."
  - Clause check: Amendment 1 (b), and the worker's report at line 56.
- **D6.** `engine/src/dataset.rs:2316`, `files_read`'s doc ("DuckDB's error text when it reads none.").
  - Defect: the function returns `Err` on any prepare, query or row failure (:2326, :2331, :2333), not only when no file is read.
  - Words: "or the error's text when the statement fails (step 0 observed `read_parquet` fail when it reads no file)."
  - Clause check: the three `map_err(|e| e.to_string())` calls, and the step 0 report's "No file" note (O2 to O6 return an error).
- **D7.** `engine/tests/session_identity.rs:683` ("What is decided for such a path at which a file does exist is in").
  - Defect: "such a path" includes `*` and `?`. E1's shapes hold only `[ ] { }` names (`single_file_bracket_name.rs:29-84`).
  - Words: "What is decided for a path holding `[`, `]`, `{` or `}` at which a file does exist is in `engine/tests/single_file_bracket_name.rs`; this test writes no file."
  - Clause check: E1's `SHAPES` list.

**Notes** (preferences and observations; none is a condition):
- **N1.** In the cases §1 does not claim, (c), (d) and (e), a refused open would show DuckDB's no-match text carrying the escaped path form (`[[]`) through the existing `Source`/`Query` wrappers. No engine format string is new, so §1's strings line holds. On Windows, ordinary use reaches this only if case (e) is reachable, which is unsettled.
- **N2.** No test kills a removal of the helper at `index.rs:332` or `rowgroup.rs:396`. Neither site has a product caller (no `build_index` or `build_row_group_index` call in `kernel/src` or the shell's `src-tauri`; README: experimental seams). See check 8.
- **N3.** The engine README's Last verified clause names e05a8b90, a branch commit. That is fine under a merge commit (packet known finding 7). The README is not an append-only record, so round 15 (e) does not reach it.

## Checks

**1. §1 at the head: met.**
- **May claim:** RAW for `{` `}` and ESCAPED for `[` `]`, with E1 asserting against decoys.
- **May not claim:** no comment or record claims macOS, `*`/`?` files, a run time or the directory advice. Amendment 1's (c), (d) and (e) are named:
  - in `partitioned_source_detail`'s doc (:1872-1876);
  - in item 20 (`KNOWN-LIMITATIONS.md:284-287`).
- **ADR readings:**
  - ADR-016 Amendment 1 §5 (`docs/adr/ADR-016-stable-feature-identity-admission.md:230-232`) and boundary 7 and A5 (`state/drafts/post-tag/DRAFT-2-BRIEF-A-admission-and-session-lifecycle.md:61-63`, `:81`) say single file only, partitioned refused by name.
  - Admitting an existing single file keeps that true, as the directive of 2026-11-07 rules: "A single existing file is admitted by its path under boundary 7".
- **Wire:**
  - Unchanged: no literal (skp/0.12 per the packet), field, command, code or fixture changed; no file under `protocol/skp/tests/`, `kernel/src` or `error.rs` is in the diff.
  - The one wire touch is SKP-V0 §1's sentence (`protocol/skp/SKP-V0.md:31-37`), a §21a touch under OPEN-3 (A). 1c touches 0 files under protocol/ (packet §6).
- **Strings:** none added or changed. The only error string in the `stream.rs` hunk, "path is not valid UTF-8", is unchanged from main's `stream.rs:1231`.
- **Portability:** Windows by step 0 and the suite, Linux by CI's ubuntu L1, macOS not claimed. Item 20 and SKP-V0 both say "observed on Windows", which claims less than this, not more.

**2. The route: met.**
- **The helper** (`dataset.rs:1927-1937`): `[`→`[[]` and `]`→`[]]` in one pass over `chars()`, every other character copied. That is F-escB, with class C raw.
- **`*` and `?`** are refused by text: first in `GLOB_METACHARACTERS` (:1903), with no stat.
- **§2.1's five steps, in order** (:1882-1913):
  1. `is_dir`;
  2. the scan, with `*`/`?` refused;
  3. the four characters with no file: the same `format!` detail as main's;
  4. `is_file` returns `None`;
  5. `None`.
- **`open_inner`** calls the gate first (:327) and then keeps the not-a-file refusal (:330-335).
- **The helper's sites:** at all 11 §0.4 sites outside `layout.rs` (see D2).
- **Non-DuckDB consumers keep the raw path:**
  - pre-check, post-check (`stream.rs:1263`), index and row-group cache keys, `content_hash` and validity (`dataset.rs:755-758`, :869-874), `geo_from_kv` messages;
  - `produce` uses `path` only as the bound parameter (`stream.rs:1810`);
  - `index.rs` and `rowgroup.rs` take the raw `path_str` from `dataset.rs:771-781` and :888-895, and apply the helper only inside the SQL;
  - `Dataset::path`'s body is unchanged (packet).
- **The kernel** reads no file through DuckDB: `read_parquet` appears in `kernel/src` only in comments.

**3. §8, item by item:**
1. **Met.** Amendment 1 is the base d37112d8, the parent of every code commit. #290 merged at 10:06Z (the brief). The human's answers to OPEN-3 and OPEN-4 are the directive of 11:22Z. The first code commit, 7b7f467d, is at 14:35:28Z.
2. **Met** (check 2).
3. **Met** (check 2).
4. **Met.**
   - The directory detail is the same `format!` at :1883, and the scan detail at :1908-1911 is unchanged.
   - The fixture, wire code and literal are not in the diff.
   - `*` and `?` are still refused by text.
5. **Met.** The diff names only the ten files, and no Cargo file or `lib.rs`.
6. **Not met until D1 to D7 are applied** (sentences only). Amendment 1 (f) is met: no fallback wording in the ten files, by grep.
7. **Pending the click.** Item 20 and SKP-V0 §1 are drafts, and the PR is a draft.
8. **Met.** The packet shows 0 added `#[ignore`, `cfg(`, `sleep(` or `retry`. The renamed test's assertions are byte-equal to main's (`session_identity.rs:690-702` against main's :689-701).
9. **Met on the record I relied on:** the worker's report and its filing note (M1, M2 and M3 at 4f0d50ce, each reverted; `]` not run). The three `RECORDED MUTATION` lines name the full id, and no `verify-mutation` run is called an observation. M1 as built (the `is_file` return removed) is the base's text-only behaviour, which is §4's M1. The reviewer re-observes.
10. **Met.** No new string.
11. **Not verifiable by me.**
    - Step 0 ran on its own target (the step 0 report).
    - The worker's report does not state its `CARGO_TARGET_DIR` (see the packet's gaps).
    - Nothing from a probe is committed.
12. **Met.**
    - Ten files, exactly §7's ESCAPED row.
    - Rule (00): port-2 shares `KNOWN-LIMITATIONS.md` in other items (separate paths), and nothing in flight touches protocol/ (packet §6).
13. **Relied on the worker's report:** the push runs at the head are green, both L1 jobs included (run 42388945770). I could not read the pull_request runs; the reviewer reads CI.

**4. §5 at the head:**
- **Declared-unchanged: holds.**
  - The directory half, the not-a-file detail, `*`/`?`, the wire, `error_of`, ADRs, forms, the walkthrough, `frontends/`, `lib.rs`, `layout.rs`, Cargo files and `kernel/README.md` are all out of the diff.
  - The only new item is `pub(crate) fn duckdb_literal_path`, with 11 product callers.
- **I-5:**
  - The rule, read at the head as item 13, "Schema evolution", now `protocol/skp/SKP-V0.md:305-306`. The form's pin (:302-303 @ 43f9b1d5) is historical, and the tree at the head is authoritative for this reading. The rule ties a new version string to a field change.
  - 8f changes no field, value set, code or fixture. It changes which `path` values `open_dataset` admits.
  - The value-domain ruling at `:680-691` concerns new output values of an existing key, and 8f adds none.
  - So the rule as written does not require a version change, and nothing goes to the human under I-5.
- **I-3:**
  - At the head, every DuckDB file-reading call in `engine/src` outside `layout.rs` is one of §0.4's eleven.
  - `pool.rs:792` is a test constant URL, not a file path.
  - `lod.rs:1384`'s `parquet_schema` is the arrow-rs builder, not DuckDB.
  - Main's dataset.rs carries the same 8 sites, unescaped (for example main's :1811).
  - The base-time grep is the worker's (filing note: rc 0).
- **I-4: did not fire.** No file is outside the ESCAPED row.
- **I-7:** relied on the filing note and the report. At the base, `verify-test-claims` returned rc 0 and no record it reads names the old test; at the head it passes.
- **I-8:** relied on the worker's report of green ubuntu and windows L1. A decoy read would fail E1's assertion 2 or 3.

**5. Amendment 1 at the head:**
- **(a) Met.** T2's first row is `zones[1].parquet` absent, with `zones1.parquet` written beside every row (`dataset.rs:2364-2396`).
- **(b) Met in the code.** M3 drops `[` and is recorded at the present-pair row (:2353-2355). Recording `]` as equivalent is D5.
- **(c) Met** (:1872-1874).
- **(d) and (e) Met** (:1874-1876; item 20 :285-287).
- **(f) Met.** No text states DuckDB's fallback. T2's "a path that matches nothing" (:2419) describes the observed error.
- **K2/K3 item:**
  - E1 asserts the sum only where it is not 500 (:209-212).
  - Assertion 3, distinct ids, is unconditional (:216-221).

**6. Comments, clause by clause:**
- **True:**
  - the five steps (:1847-1858);
  - "The refusals of steps 1 to 3 are one variant … the text it had before step 4 existed";
  - the inline scan comment (:1894-1902), including the order rule, since `find` walks the list in order;
  - the `open_inner` addition apart from D3;
  - `duckdb_literal_path`'s doc;
  - E1's four-assertion summary and its three mutation outcomes (against the report);
  - K1's doc, with `describe`'s basis `identity-uniqueness-scan-full-file` and the extent basis `not-established-at-open` read at `kernel/src/skp.rs:1945` and :2053;
  - T2's row list;
  - `names_listed_by_glob`'s doc;
  - the renamed test's mutation line.
- **Untrue: D1 to D7**, with words above.

**7. The records:**
- **KNOWN-LIMITATIONS item 20** (`KNOWN-LIMITATIONS.md:274-288`): every clause is true at the head.
  - The title's admit/not-admit split.
  - `*`/`?` refused whether or not a file exists.
  - `[ ] { }` with no file refused, with the metacharacter detail.
  - An existing file of those four opened as one file.
  - Observed on Windows.
  - (d), (e) and (c) not claimed.
  - It carries (d) and (e) and claims no more.
- **SKP-V0 §1's sentence** (`protocol/skp/SKP-V0.md:31-37`): every clause is true. The `*`-first order matches the scan, and it defers the bounds to item 20.
- I found no false clause in either draft, so I give no replacement words. Both are the human's to approve or replace at the click.
- **engine/README.md's three lines:**
  - E1 is added to the Open and admission pinned-by list (:539).
  - The form's path is in the preregistration list (:557).
  - The Last verified clause names e05a8b90 (:537), where both pointers exist.
  - All true.

**8. The packet's known findings 1 and 2:**
- **Size (677 against 480).** The overrun carries nothing §7's ESCAPED row does not name:
  - the ten files only;
  - 502 of the 618 added lines are the three tests (228 + 135 + 139);
  - the rest is §2.3's sites and §2.4's comments.
  - It is recorded as class 8 (Amendment 2), and §7's 480 line is unedited at main.
- **The index.rs and rowgroup.rs sites.** No test is owed, and I name no requirement as broken:
  - §4 declares E1's path as open and stream.
  - §8 item 3 is satisfied by the helper being present.
  - Part 1 item 7's boundary (helper to DuckDB) keeps its integration tests: T2 on `glob`/`read_parquet`, and E1 across bound `parquet_metadata`, bound `read_parquet` and the interpolated `read_parquet` (the native-mode identity scan at :2044).
  - Both sites are experimental seams with no product caller.
  - See N2.

## For the human
1. **Red line:** item 20 and SKP-V0 §1's sentence are your words to approve or replace at the click. I found every clause true at the head and give no replacement words.
2. **I-5 (a reading, no decision asked):** the versioning rule as written does not require a version change for 8f.
3. **N1 (information):** in the cases left unclaimed, the refusal shows DuckDB's text with the escaped path.

## The packet's gaps
- The worker's `CARGO_TARGET_DIR`, for §8 item 11: neither the packet nor the worker's report gives it.
- d37112d8's commit time: the packet gives times for the four branch commits only. I relied on ancestry for item 1's order.
- The CI status of the pull_request runs: the packet gives locators only, by design, and I have no shell to read them.
