Reviewed: PR #267 at e834dcf73521fcd7f268c6cb8b4479c3eaf45353 (base fd149e24), gate 1, reviewer
Verdict: PASS WITH NOTES

Branch and commit reviewed: cut/corpus-line-files @ e834dcf73521fcd7f268c6cb8b4479c3eaf45353. My brief: sha256 2a4531b772c29845d0a47644d645dd1ddd07c663f82407eefec8b589541b5001, read in full first.

## Findings

### Correctness: none

### Evidence: none blocking
- **E-note 1 (no action owed by the worker).** The raw folder `C:/dev/spatial-ide-local/evidence/2026-10-28/8a` has seven files. Each fetched document is there once, and both fetches' header files are there. The following rest on the custodian's transcript, not on any raw file:
  - the second copies' byte-equality (Amendment 1);
  - "The S3 endpoint returns the same bytes when asked for that version id" (Amendment 1);
  - the licence documents' fetch times and URLs (Amendments 1 and 3);
  - the `gh api` read of the RoadDetections head (Amendment 3).

  None of these is in this PR's diff; they are on main in the form. The headers' server `Date:` values are 16:12:12 GMT and 16:12:15 GMT. Those fit the recorded start times of 16:12:10Z and 16:12:13Z, but they are not equal to them.

### Documentation: must be fixed before the merge (no re-gate)

**Doc-1. Red-line text (the licence row): a wording question for the human. I give no replacement words.**
- **Where:** `engine/compat-corpus/LICENCES.md` at the head:
  - :102, the LF-1 primary-source cell, which says the fetch URL is not recorded in Amendment 1;
  - :108, S8, which says the URL and time are not recorded, with the retrieved cell "not recorded";
  - :109, S9, which says the URL is not recorded.
- **What is wrong:** Amendment 3 (the form on main, e83155b1) now records:
  - LICENSE: `https://raw.githubusercontent.com/microsoft/RoadDetections/c1a8d6995ebcfcf248a764f6b67b13e2b3356f06/LICENSE`, at 16:13:36Z and 16:13:38Z;
  - README.md: `https://raw.githubusercontent.com/microsoft/RoadDetections/c1a8d6995ebcfcf248a764f6b67b13e2b3356f06/README.md`, at 16:13:41Z and 16:13:43Z;
  - collection.json: `https://data.source.coop/nlebovits/microsoft-ml-road-detections/road-detections/collection.json`.

  Amendment 3's last bullet says the cells take these values at the gate. §2b also defines the primary-source column as "URL, pinned". The cells as written now state something the record contradicts.
- **Each cell's facts, checked against Amendments 1 and 3 and the raw files (all agree):**
  - LICENSE: 113 bytes, sha256 1e4162…4b3c.
  - README: 9387 bytes, sha256 b42c3e…576f.
  - collection.json: 9592 bytes, sha256 8775…c311.
  - LICENSE and README both name "Open Data Commons Open Database License (ODbL)" with no version number. README links https://opendatacommons.org/licenses/odbl/.
  - collection.json gives `"license": "ODbL-1.0"`, and its license link goes to the same page, titled "Open Data Commons Open Database License (ODbL) v1.0".
  - Retrieved times for LICENSE (16:13:36Z) and S9 (16:13:54Z) are as in Amendments 1 and 3. The raw files cannot prove times (their mtimes are copy times).
  - The set cell is as the OPEN-1 (A) ruling has it.
- **Questions for the human:**
  - (a) Should the three cells take Amendment 3's URLs, and S8 its 16:13:41Z time?
  - (b) Your OPEN-1 (A) ruling (directive 2026-10-26, line 30) reads the licence as "ODbL 1.0 as I read it", and asks for the mirror's catalogue line "beside" the licence cell. The cell says no version number is stated or inferred, and the catalogue line is in S9, a separate table. Do you accept that form, or give your words?
- **Sighting line:** `LICENCES.md:111` is unchanged and still last. Its extension is owed by the human's ruling before the merge (form note 3). It is not a defect.
- **LICENCES_MAX_LINES:** LICENCES.md is now 111 lines against the corpus form's §7 `LICENCES_MAX_LINES` of 100. Amendment 4 discloses it, and the PR body already asks for the human's word. A grep of scripts/, tools/, .github/, engine/tests/ and every .mjs/.yml file found no script that enforces it. The worker owes no fix.

**Doc-2. PR body (the custodian's text, not the human's wording): the worker applies these words; no re-gate.**
- **Where:** the "The change" paragraph says "fetched once by the custodian and placed untracked under the corpus of record's new `lines/` directory".
- **What is wrong:** Amendment 1 records two fetches, and both header files are in the raw folder.
- **Replacement words:** "fetched twice by the custodian, both copies byte-equal (Amendment 1), and placed untracked under the corpus of record's new `lines/` directory."
- **Clause check:**
  - "fetched twice": Amendment 1, "The fetch, twice". `fetch1-headers.txt` and `fetch2-headers.txt` are both `200 OK` with `Content-Length: 5545`.
  - "both copies byte-equal (Amendment 1)": Amendment 1 gives both as sha256 ea3205…c24d. That is a transcript claim; the file on disk hashes to ea3205…c24d by my sha256sum.
  - "placed untracked under … `lines/`": the file is at `target/fixtures/compat-corpus/lines/msrd-pcn.parquet`, and `git check-ignore -v` shows it ignored by `.gitignore:2`.

### Notes (no action owed)
- **T2 decodes one batch per buffer.** It does not assert the reader is then exhausted, as `engine/tests/line_stream.rs`'s `decode` does. A dropped batch would still fail on `ids.len() == 12`, so there is no false pass.
- **The bbox literals are load-bearing.** M-2's failure output lists the swapped vertex (-23.9252873199134, -130.738645792007), which is exactly (ymax, xmin) of the bbox member. Real vertices lie on the member's edges, so the inclusive comparison and the byte-copied literals matter, as note 4 feared.

## Checks

### 1. The diff
- `git diff --numstat fd149e24...e834dcf7` (rc 0), and the same over `origin/main...HEAD` in the worktree (rc 0): LICENCES.md 13/0, RECORD.md 15/0, observe.txt 111/0, line_corpus.rs 137/0.
  - That is exactly the four files in Scope.
  - Amendment 4's figure holds: 137+15+13 = 165 by the form's counting, with no deletions.
  - The commits are 3b9e0662 (four files) and e834dcf7 (line_corpus.rs, +5/-2, the RECORDED MUTATION doc lines).
- **Observation file:** the raw stdout with CR bytes removed (`tr -d '\r'`, rc 0) against `git show e834dcf7:…/msrd-pcn.observe.txt` (rc 0): `cmp` rc 0. Both are sha256 f5f7f3a9…bc4a, 111 lines, 2469 bytes.
  - The raw file's sha256 is cf3eafba…5274, as in Amendment 1.
  - `git ls-files --eol` gives `i/lf w/crlf attr/text=auto eol=lf`. The worktree copy is CRLF and the index is LF. The test and the RECORD verify both tolerate CRLF.
- **bbox literals:** the four tokens in `const BBOX` are byte-equal to observation lines 60-63, by a node comparison: EQUAL.
- **Insertion positions** (node, rc 0):
  - RECORD: base 103 lines, head 118, the base's lines 1-103 equal to the head's. The section is appended after the last line.
  - LICENCES: base 98, head 111. Lines 1-97 are equal. The base's last line (the sighting line) equals the head's last line. The section sits directly above it, and nothing above either insertion moved.
- **No data file:** per commit (`git diff-tree … --diff-filter=AM`), against the corpus form's DENY_EXT (§7; a self-test matched `x/a.parquet`): 0 hits. The largest added blob is 24448 bytes, against MAX_ADDED_BLOB 262144. No blob has PAR1 as its first or last four bytes. The data file is untracked and ignored.
- **C8** (the pattern copied by script from the corpus form's Amendment 1, item 1.2; run stage by stage, unpiped, as in that form's Amendment 3, item 3.2):
  - Canary: 2 of 2 alternatives matched, rc 0.
  - Command 1 over 276 added lines: `0`, rc 1.
  - Command 2 (`git grep … e834dcf7 -- engine/compat-corpus/`): no output, rc 1.
  - C8 passes.
- **RECORD C4(a)** (line 98, run from the worktree root): rc 0, `rows 21 disagree 0`.
- **The LF-1 verify command** (lines 116-117, `CORPUS` set to main's corpus): rc 0, `row true disk true`.
  - Negative self-test against a zero-filled 5545-byte stand-in: rc 0, `row true disk false`.
- **Form:** append-only since 1011d479, with 0 removed lines through e83155b1.
- **Raw files:** sha256 of the listing (c67f6009…623c) and of the three licence documents match Amendment 1. The listing has 235 keys, `IsTruncated` false, and the smallest is `country=PCN/PCN.parquet` at 5545 bytes. Both header files carry the ETag, the Last-Modified value and `x-amz-version-id` that the RECORD row states. The data file on disk is ea3205…c24d, 5545 bytes.

### 2. The head
In C:/dev/wt/lf1, with `CARGO_TARGET_DIR=D:/wt-targets/lf1`, each run in a shared hold:
- `cargo test -p spatial-engine --test line_corpus -- --ignored`: 2 passed. It ran twice: the first returned with no error from the tool (exit 0, rc not printed); the re-run printed rc=0.
- Without `--ignored`: rc 0, 2 ignored.
- **DuckDB not recompiled:**
  - none of the three outputs has a `Compiling` line;
  - the libduckdb-sys build directories (17:36:53 and 18:04:20 local) are unchanged;
  - the `liblibduckdb_sys-*.rlib` (18:04:36) is unchanged.

### 3. Mutations
- **Setup:** `git archive 3b9e0662` into the new `D:/wt-targets/lf1-g1r-export` (archive rc 0, `tar --force-local` rc 0), with the new target `D:/wt-targets/lf1-g1r-target`.
- **Baseline hashes:** geoarrow.rs 631c59c8…, wkb.rs 9216e7bb…, line_corpus.rs 350fb6dc…, each equal to `git show 3b9e0662:<path>`.
- **Cold build plus unmutated run:** rc 0. libduckdb-sys was compiled once, in 34m 50s. 2 passed.
- **Mutations:** each was applied by a script with a one-occurrence anchor, with M-2 anchored on `read_line` at wkb.rs:333, not on the ring reader at :138.

| Mutation | rc | T1 | T2 | Matches the form's prediction |
|---|---|---|---|---|
| M-1, geoarrow.rs:213 to `MultiLineString` | 101 | FAILED at line_corpus.rs:65, the encoding `assert_eq` (left MultiLineString, right LineString) | FAILED at :115, `coordinate pairs` | yes |
| M-2, y pushed before x | 101 | passed | FAILED at :129, `positions outside the bbox member` | yes |
| M-3, `==` to `!=` in the sha comparison at :48 | 101 | FAILED at :63, `pre-open hash` | FAILED at :90, `pre-open hash` | yes |

- After each revert, `sha256sum -c` passed on all three files with rc 0.
- The worker's RECORDED MUTATION lines match these outcomes. They record real runs, not a `verify-mutation` run.
- **Disclosure:** during the cold build, before spatial-engine compiled, I ran one dry apply-and-revert of M-1 and M-3 on the export. The hashes were OK straight afterwards, and the unmutated baseline passed.
- **Clean-up:** the export was removed (rm rc 0; `test -e` rc 1). `D:/wt-targets/lf1-g1r-target` is left in place for the custodian to remove.

### 4. Seams
The test reads only existing public items:
- `Dataset::open` (dataset.rs:222);
- `geometry_encoding` (:975);
- `declared_geometry_types` (:984);
- `covering` (:993), which returns a `CoveringBbox` whose fields are `FieldPath(pub Vec<String>)` (geoparquet.rs:324, 339);
- `identity()` (:713), then `.source()` (identity.rs:260), then `IdSource::is_session_ordinal` (identity.rs:103);
- the envelope schema metadata key `crs_provenance` (envelope.rs:155), whose value is `crs:format-default` (geoparquet.rs:95);
- `stream` (stream.rs:913) and `next_into` (:795, appends one batch);
- the column layout, id at column 0 and geometry at column 1 with List, then FixedSizeList, then Float64, as in line_stream.rs:61-78.

The diff adds no `pub` item, so the caller grep has nothing to check. `CORPUS_ROOT` is byte-equal to admission_p4_corpus.rs:68 and point_corpus.rs:26.

The RECORD cells (URL, times, ETag, Last-Modified, version id, sha256, bytes, the footer value) agree with Amendments 1 and 2 and the raw files. The LICENCES cells are covered under Doc-1.

**PR body claims:**
- the four files: true;
- PCN, 5545 bytes, 12 rows: true;
- T1 and T2 pass at the head: true (my runs);
- M-1 to M-3 each fail where the form predicts: true (my runs);
- ODbL against ODbL-1.0: true;
- 98 to 111 lines: true;
- Rule (00): true (`gh pr list` shows #266 as the only other open PR, with 0 overlapping paths and nothing under protocol/);
- "fetched once": wrong; see Doc-2.

### 5. Verify scripts and CI
- Verify scripts at the head (the worktree):
  - `verify.mjs --offline`: rc 0, `verify:plan PASS`;
  - `verify-cites.mjs`: rc 0, PASS, with 75 loose advisories that predate this PR;
  - `verify-quotes.mjs`: rc 0, PASS, 0 errors;
  - `verify-test-claims.mjs`: rc 0, PASS, 690 claims;
  - `cargo fmt --all -- --check`: rc 0.
- **CI:** `gh pr checks 267` gave rc 8 at first, while run 40737217983 was in progress. After that run completed (success, both jobs), it gave rc 0 with 18 of 18 passing.
- **Head sha of every run** (from `gh run view`) is e834dcf73521fcd7f268c6cb8b4479c3eaf45353:
  - push runs: 40733098472, 40733097984, 40733098400, 40733097932, 40733098401;
  - pull_request runs: 40737217936, 40737218098, 40737217983, 40737218106, 40737217975, 40737218031, 40737218082.

## Hold lines (this project only)
- `MACHINE_HOLD shared project=SpatialIDE cores=0-7 affinity=FF shell=bash.exe:10192 also=<elided>` (head, ignored)
- `MACHINE_HOLD shared project=SpatialIDE cores=0-7 affinity=FF shell=bash.exe:42096 also=<elided>` (head, not ignored)
- `MACHINE_HOLD shared project=SpatialIDE cores=0-7 affinity=FF shell=bash.exe:32900 also=<elided>` (head, ignored, rc printed)
- `MACHINE_HOLD shared project=SpatialIDE cores=0-7 affinity=FF shell=bash.exe:4676 also=<elided>` (export, cold build and baseline)
- `MACHINE_HOLD shared project=SpatialIDE cores=0-7 affinity=FF shell=bash.exe:12264 also=<elided>` (M-1)
- `MACHINE_HOLD shared project=SpatialIDE cores=0-7 affinity=FF shell=bash.exe:19884 also=<elided>` (M-2)
- `MACHINE_HOLD shared project=SpatialIDE cores=0-7 affinity=FF shell=bash.exe:20892 also=<elided>` (M-3)

Every hold was granted and each was followed by `MACHINE_RELEASED project=SpatialIDE`.

## End state
- The worktree's `git status --porcelain` is 0 bytes, and HEAD is e834dcf73521fcd7f268c6cb8b4479c3eaf45353.
- `D:/wt-targets/lf1-g1r-export` is gone.
- I made no commit, push or PR action. I wrote only to my scratch folder (lf1-g1r-* files), the export (now removed) and `D:/wt-targets/lf1-g1r-target`.
