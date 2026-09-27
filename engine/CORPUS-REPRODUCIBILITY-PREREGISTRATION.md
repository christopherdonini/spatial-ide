# Preregistration — the compatibility corpus made reproducible from the tracked tree (`corpus-reproducibility-record`)

*Drafted 2026-09-26 by the architect agent on the custodian's brief. Inputs: the ruling (`DECISIONS-PENDING.md`, RULED 2026-09-26, question round 24, item 3); `state/cloud/wave1/B.md` (Findings B-1 to B-5, its unproven observations, its custodian fields); PLAN node `corpus-reproducibility-record`; the untracked corpus of record under `target/fixtures/compat-corpus/`; PR #124's three files. Tracked files read at `main` b44f401.*

**Committed before any change**, alone, on branch `cut/corpus-reproducibility-record`. **Append-only once committed.** An amendment made after any outcome has been seen says so in its first line and states what it touches or invalidates (`docs/PREREGISTRATION-TEMPLATE.md` §10).

**Authority.** The ruling of round 24, item 3, cited by round and item; its words are not reproduced here. PLAN node `corpus-reproducibility-record`. The corpus of record and PR #124 are material and evidence, never Authority.

**Form: full, with full gating (`AUTONOMY.md` §21a).** Either reason alone is enough:
1. **Security posture.** This piece decides which third-party-derived material and which machine facts enter a repository that has been public since 2026-08-03 (ADR-009, its Corrigendum; its pre-public checklist item 6 on third-party material and fixtures in history). It also produces a licence table. Public exposure is a red line for the human (`AI_DEVELOPMENT.md` Amendment 1 §B), so the licence table and the exposure-scan hit list go to the human before merge.
2. **Size.** Thirteen byte-copied files, nine of them scripts, exceed §21c.

The other §21a categories are not touched: no ADR text or status, no wire (SKP / MCP), no stated guarantee or invariant, no product code.

---

## §0. Disclosure

1. **The architect read the local corpus.** `MANIFEST.json`, `PROBE.json`, `README.md` and the nine scripts were read through the `target/` junction, which resolves to D:. The following shaped §3 and are **hypotheses the worker re-derives from the files**, not facts of this record:
   - (a) The local manifest's #12 entry holds an `overturemaps download` invocation carrying `--bbox` and the release. Its #11 entry holds a commit-pinned URL and a full sha256. B-3 and B's first unproven observation are therefore answerable from the local record.
   - (b) The local record names no DuckDB spatial extension version, and `gen_duckdb.py` installs the extension at run time.
   - (c) The corpus README's venv package list does not include pandas or numpy.
   - (d) `gen_geopandas.py` writes five outputs. One is retired (R-1). One, `gp-epsg2056-dupint-struid.parquet`, appears in no manifest array.
   - (e) `gen_geopandas.py` and `gen_duckdb.py` write to absolute paths inside the corpus of record, so running either one unchanged overwrites it. The other generators write relative to their script's parent directory.
2. **`gdal/`'s directory time moved.** The custodian observed that it changed on 2026-09-20, while its files and `MANIFEST.json` date from 2026-09-10. Step 2 therefore verifies every file before anything is recorded.
3. **The custodian's grep is not relied on.** It found no user-name or local-user-path string in the scripts, manifest, README or `PROBE.json`. Check C6 is required regardless.
4. **PR #124 (held): this piece feeds it.** The piece adds no tool, does not touch `tools/corpus/` or branch `cloud/wave1-B`, and creates no second machine-readable manifest. Its tracked record is what #124's `null`s could later be filled from. What happens to #124 is the human's decision.
5. **No regeneration run** informed this file, and this piece makes none.

## §1. What this preregistration may and may not claim

- **May claim:**
  - the 13 tracked copies are byte-identical to the corpus of record's files;
  - each recorded full sha256 equals the file on disk and the local manifest;
  - the local manifest is the one the admission results pinned (P-1);
  - each licence cell is what its cited primary source names.
- **May not claim:**
  - the byte-reproducibility of any file;
  - a licence from any source other than a primary one (§2b);
  - anything about a file's content or correctness;
  - any performance number or `docs/08` row;
  - any wire change, or any ADR content.
- **"Procedure recorded: yes" means only this:** the tracked tree holds the invocation, the versions of the software that wrote the bytes, and every input, each input being a hash-pinned corpus file or a commit-pinned URL.
- **The copies are inert records.** No build, test, CI job or product path invokes them. They land because the ruling names them to be tracked. No `pub` item, callback, option or code path is added.
- **The copies speak as of 2026-09-10.** They are historical pins. Where the tree has moved since (for example, the copied README calls its directory untracked), `RECORD.md` names the pin as authoritative for what the pin states, and never reads it as current.

## §2. The change

**Scope: these exact paths and nothing else.** This file is committed first, by the custodian.

- **New:** `engine/compat-corpus/of-record/`, holding 13 byte-identical copies at the same relative paths as under `target/fixtures/compat-corpus/`:
  - `MANIFEST.json`
  - `PROBE.json`
  - `README.md`
  - `mutations/DERIVATIONS.json`
  - `scripts/build_manifest.py`, `scripts/gen_duckdb.py`, `scripts/gen_gdal.py`, `scripts/gen_geopandas.py`, `scripts/gen_mutations.py`, `scripts/gen_qgis.py`, `scripts/observe.py`, `scripts/probe_producers.py`, `scripts/qgis_env.py`
- **New:** `engine/compat-corpus/RECORD.md` (§2a).
- **New:** `engine/compat-corpus/LICENCES.md` (§2b).
- **Appended after the last existing line, with no existing byte changed:**
  - `.gitattributes`: one comment line, then `engine/compat-corpus/of-record/** -text`. This is the hash-pinned-corpus mechanic (`AI_DEVELOPMENT.md`'s accumulated mechanics, the fifth member of the eol class). As the last line, it wins.
  - `kernel/FIXTURES.md`: one section giving the local path, the local manifest's sha256, a pointer to `engine/compat-corpus/RECORD.md`, and the statement that no data file is tracked. This answers B's second unproven observation.

**Why `engine/`:** the corpus serves the engine's admission records (`engine/ADMISSION-PREREGISTRATION.md` §3, `engine/ADMISSION-RESULTS.md`, `engine/tests/admission_p4_corpus.rs`). `tools/corpus/` is avoided because it holds #124's paths.

**Never tracked:**
- any data file, meaning any file carrying feature geometry or attribute values: Parquet, Arrow / Feather / IPC, DuckDB, SQLite / GeoPackage, GeoJSON, Shapefile parts, FlatGeobuf, PMTiles, CSV / TSV, and any archive;
- the Overture CLI's `.state` sidecar;
- `target/corpus-venv`;
- anything else under `target/`.

**Reading, which the human confirms at sight:** `MANIFEST.json`'s `observed` blocks are footer metadata (schema names and types, geo members, extents, row counts). They are treated as metadata, not data.

**The copies are byte-identical:** no header added, nothing redacted, nothing reformatted. They are project-authored (written for this project on 2026-09-10) and are under the repository's licence (ADR-009). `RECORD.md` says so. No SPDX header is added, because one would break byte identity.

**Record classes (`AUTONOMY.md` §22):**
- `of-record/**` is pinned evidence. It is never edited; a re-collection replaces it in a new piece.
- `RECORD.md` and `LICENCES.md` are current-state summaries.

### §2a. `RECORD.md`

**Header:**
- the corpus of record's path;
- the local manifest's sha256 and its tracked twin, `of-record/MANIFEST.json`;
- the admission results' pin of that hash, cited as `engine/ADMISSION-RESULTS.md:3 @ 15f558816bf1 sha256:e69e59d9887e692dd065db3ff5770da2dcc2ea6403c4e29aaf3ee6114c9169bd`.

**One table row per manifest entry, 21 in all:**
- `#1`–`#12` (§3's numbering in `engine/ADMISSION-PREREGISTRATION.md`);
- `M-2`, `M-3`, `M-4`, `M-1c`, `M-1a-equivalent` (the ids `engine/tests/admission_p4_corpus.rs` assigns to the mutation paths);
- `R-1`–`R-4` (the manifest's `retired[]` order).

**Row format.** Columns: id · path · producer and version · invocation · inputs · sha256 · bytes · procedure recorded · why.
- The path is in backticks, relative to the corpus root.
- Each row carries exactly one 64-hex string: its sha256.

**What each column holds:**
- **Producer and version:**
  - Every value names the field it came from in `of-record/*`.
  - A version the local record does not hold is written `unrecorded`. It is never filled from a present-day read, whether of a venv, an extension directory or `pip freeze`.
- **Invocation:**
  - For #1–#6 and R-1: the script, plus the block or section inside it that writes the file.
  - For every other row: a reference to the manifest entry's `how_obtained.command_or_url` field.
  - Commands are referenced, not reproduced.
- **Inputs:**
  - #7, #9, #10 ← #1;
  - #8 ← #3;
  - M-4 ← #7;
  - the other M rows ← #1;
  - #11, R-2–R-4 ← the pinned URL field;
  - #12 ← the invocation field (release and bbox);
  - #1–#6 and R-1 ← none (synthetic).
- **Procedure recorded (yes / no):** per §1's definition. The why column names each missing item, or for a yes, names the fields that satisfy it.

**Hazards section.** Each statement about a script's behaviour names that script's sha256 (C1's value). It covers:
- which scripts write absolute paths into the corpus of record, and which write relative paths;
- the outputs of `gen_geopandas.py` that lie outside the main set;
- `INSTALL spatial` resolving the extension at run time;
- #7–#10 requiring the Windows standalone QGIS 3.44.2.

**Verify section:** C1–C4 of §4, as re-runnable commands.

**Size:** at most `RECORD_MAX_LINES` (§7).

### §2b. `LICENCES.md`, and the licence research

**Table: one row per manifest entry (the same 21 ids).** Columns: id · path · licence as the source names it · primary source (URL, pinned to a commit or release where the host allows it) · retrieved (UTC) · sha256 of the fetched bytes · set (`reproducible` / `local-only`).

**Lists after the table, each by file name:**
- the reproducible set;
- the local-only set.

**The last line** is "Sighted by the human:", left blank. The custodian fills it with the ruling, cited by round and item.

**What counts as a primary source:** the rights holder's own statement for that material, at the pinned revision.
- **#11:** the LICENSE / NOTICE of `opengeospatial/geoparquet` at the manifest's commit.
- **R-2–R-4:** the licence files of `OSGeo/gdal` at the manifest's commit, including any statement specific to the autotest data directory.
- **#12:** the Overture Maps Foundation's own published licence or attribution documentation for the buildings theme, and release 2026-08-19.0's own published notes where they name a licence.
- **Project-generated files (#1–#10, M rows, R-1):** only the project's own declaration for those files could be a primary source, and none exists. The cell reads `unidentified — project-generated, no licence declared`.

**Never a primary source, so never used to identify a licence:**
- package-registry metadata;
- SPDX guesses;
- aggregators or blogs;
- the producing tool's licence;
- the repository's own `LICENSE` (these files are not repository contents);
- `state/cloud/wave1/B.md`;
- PR #124;
- memory.

**Rules for identifying a licence:**
- A licence is **identified** only when the primary source names it for that material. It is never inferred.
- A licence is **open** only when an identified licence is also named on the OSI approved-licence list or the Open Definition conformant-licence list. That list is cited the same way: URL, retrieved (UTC), sha256.
- If a source names more than one licence for the material, every one is listed, and the row stays `local-only` until the human decides.
- A row is `reproducible` only when its licence is identified and open. Every other row is `local-only` and is listed by name.

**How sources are handled:**
- No licence text is reproduced.
- Fetched documents are not tracked; only their hashes are.

**Who does it:** the worker, using web fetch. If the worker has no web access, it stops at step 6, and the custodian performs step 6 under these same rules and records that it did.

### §2c. The worker's procedure (numbered; STOP means hand back and commit nothing further)

1. Branch from this file's commit. Confirm that `engine/compat-corpus/` does not exist.
2. Run C3, then C2. Record the 13 originals' sha256 (C1's left-hand column). **STOP** on any mismatch or missing file.
3. **Commit A:** the `.gitattributes` append. Confirm that `git check-attr text engine/compat-corpus/of-record/MANIFEST.json` reports `unset`.
4. **Commit B:** copy the 13 files with `cp`, never through an editor or a text-rewriting script. Run C1.
5. Run C6 over the copies. **STOP** on any hit in classes P-a to P-d: a byte-identical copy cannot be redacted, so the case goes to the human.
6. Do the licence research (§2b).
7. **Commit C:** `RECORD.md`. **Commit D:** `LICENCES.md`. **Commit E:** the `kernel/FIXTURES.md` append.
8. Run C4, C5, C6 (now over every added or modified path) and C7. Run C2 again.
9. **Resolution step.** Resolve every row of `RECORD.md` and `LICENCES.md` against the copies, the outputs of C1–C6 and each fetched source's hash. **STOP** on any mismatch instead of pushing.
10. Push, then hand back:
    - the commits;
    - each check's output, as counts;
    - C6's hit list;
    - the source hashes;
    - any stop.

    Do not merge. Do not touch #124.

## §3. Corpus — pre-declared outcomes per entry

These are predictions, and a wrong one is a result. "given #N" means given #N's hash-pinned bytes. "none" means no prediction is registered for that cell.

| id | path (under the corpus root) | writer (local record) | inputs | procedure recorded | licence | set |
|---|---|---|---|---|---|---|
| #1 | `geopandas/gp-epsg2056-intkey.parquet` | GeoPandas/pyarrow, `gen_geopandas.py` | none | no — pandas, numpy unrecorded | unidentified (project-generated) | local-only |
| #2 | `geopandas/gp-nocrs-nokey.parquet` | same | none | no — same | same | local-only |
| #3 | `geopandas/gp-epsg4326-covering.parquet` | same | none | no — same | same | local-only |
| #4 | `duckdb-spatial/duckdb-lv95range-intkey.parquet` | DuckDB + spatial, `gen_duckdb.py` | none | no — extension version unrecorded | unidentified (project-generated) | local-only |
| #5 | `duckdb-spatial/duckdb-degreesrange-nokey.parquet` | same | none | no — same | same | local-only |
| #6 | `duckdb-spatial/duckdb-mercatorrange-strkey.parquet` | same | none | no — same | same | local-only |
| #7 | `gdal/ogr2ogr-epsg2056-default.parquet` | QGIS-shipped `ogr2ogr`, `gen_gdal.py` | #1 | yes, given #1; Windows QGIS 3.44.2 | unidentified (project-generated) | local-only |
| #8 | `gdal/ogr2ogr-epsg4326-default.parquet` | same | #3 | yes, given #3; same | same | local-only |
| #9 | `gdal/ogr2ogr-epsg2056-no-covering.parquet` | same | #1 | yes, given #1; same | same | local-only |
| #10 | `qgis/qgis-savefeatures-epsg2056.parquet` | `qgis_process`, `gen_qgis.py` | #1 | yes, given #1; same | same | local-only |
| #11 | `geoparquet-spec/example.parquet` | download, commit-pinned URL | URL | yes | Apache-2.0 at the pinned commit | reproducible |
| #12 | `overture/overture-2026-08-19.0-building-bern.parquet` | overturemaps CLI | release + bbox | yes; the release's continued availability is not checked | none | none |
| M-2 | `mutations/gp-epsg2056-intkey-truncated.parquet` | `gen_mutations.py` | #1 | yes, given #1 | unidentified (project-generated) | local-only |
| M-3 | `mutations/gp-epsg2056-intkey-geojson-invalid.parquet` | same | #1 | yes, given #1 | same | local-only |
| M-4 | `mutations/ogr2ogr-epsg2056-default-covering-absent-columns.parquet` | same | #7 | yes, given #7 | same | local-only |
| M-1c | `mutations/gp-epsg2056-intkey-changed-same-size.parquet` | same | #1 | yes, given #1 | same | local-only |
| M-1a-equivalent | `mutations/gp-epsg2056-intkey-appended.parquet` | same | #1 | yes, given #1 | same | local-only |
| R-1 | `retired/gp-epsg3857-strkey.parquet` | `gen_geopandas.py` | none | no — as #1 | unidentified (project-generated) | local-only |
| R-2 | `retired/poly.parquet` | download, commit-pinned URL | URL | yes | none | none |
| R-3 | `retired/test_geoparquet_1_1.parquet` | same | URL | yes | none | none |
| R-4 | `retired/test_with_fid_and_geometry_bbox.parquet` | same | URL | yes | none | none |

## §4. Tests, and the mechanical checks the gates re-run

**No tool, test or mutation is added.** Nothing executable enters any build, test or CI path. The gates re-run the checks below from the repository root in Git Bash instead.

**C1 — byte identity.** For each of the 13 relative paths `$f`:
- compare `sha256sum < "target/fixtures/compat-corpus/$f"` with `git show "HEAD:engine/compat-corpus/of-record/$f" | sha256sum`;
- `git ls-files --eol engine/compat-corpus/of-record/`.

Pass: 13 equal pairs; 13 files listed, each showing `attr/-text`.

**C2 — corpus of record against its manifest.**
- `node -e "const m=require('./target/fixtures/compat-corpus/MANIFEST.json');for(const e of [...m.files,...m.retired])console.log(e.sha256+'  '+e.path)" | sha256sum -c -`
- A byte-size comparison of each path's size against its `bytes` field.

Pass: 21 `OK` lines and 0 size mismatches, at step 2 and again at step 8.

**C3 — manifest identity.** `sha256sum target/fixtures/compat-corpus/MANIFEST.json` equals the 64-hex value on `engine/ADMISSION-RESULTS.md:3 @ 15f558816bf1 sha256:e69e59d9887e692dd065db3ff5770da2dcc2ea6403c4e29aaf3ee6114c9169bd`.

**C4 — recorded hashes agree.**
- (a) Every `RECORD.md` row's 64-hex value equals `of-record/MANIFEST.json`'s `sha256` for that row's path. Pass: 21 rows, 0 disagree.
- (b) For the manifest's own hash and each of the 21 entry hashes `$h`: `git grep -hoE "${h:0:12}[0-9a-f]{52}" | sort -u | grep -vx "$h"`. Pass: no output anywhere, which covers `frontends/shell/MANUAL-WALKTHROUGH.md` and `kernel/FIXTURES.md`.

**C5 — no data, in any commit on the branch.** Build the path set from every commit in `git log --format=%H origin/main..HEAD`, using `git diff-tree -r --no-commit-id --diff-filter=AM --name-only`. Pass when all of these hold:
- (i) every path in the set is in §2's Scope;
- (ii) no path matches `DENY_EXT` (§7);
- (iii) every added blob is at most `MAX_ADDED_BLOB` (`git cat-file -s <commit>:<path>`);
- (iv) no added blob's first or last four bytes are `PAR1`;
- (v) `git diff origin/main...HEAD -- .gitattributes kernel/FIXTURES.md` has no removed line, and its hunks begin after the base's last line.

**C6 — public-exposure scan.** It covers every path C5 lists, except this preregistration, which names the patterns and is read by the gates instead. Use `grep -rnIiE`, and `-F` for P-a.
- **P-a:** the values of `$USERNAME` and `$COMPUTERNAME`, read at run time. Only the count is recorded, never the values.
- **P-b:** `'[A-Za-z]:\\+Users\\+|/Users/|/home/'`
- **P-c:** `'[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}'`
- **P-d:** `'ghp_|gho_|github_pat_|xox[bp]-|sk-[A-Za-z0-9]{20}|AKIA[0-9A-Z]{16}|-----BEGIN [A-Z ]*PRIVATE KEY|passw(or)?d|secret|api[_-]?key|bearer '`
- **P-e (reported, not blocking by itself):** `'[A-Za-z]:\\+|%[A-Z_]+%'`, each hit listed by file, line and path prefix.

Pass: P-a to P-d give 0 hits, and every P-e hit falls under `PERMITTED_PATH_PREFIXES` (§7). The full hit list goes to the human with `LICENCES.md`.

**C7 — suites.** Each must exit 0:
- `node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs"`
- `node scripts/plan/verify-cites.mjs`
- `node scripts/plan/verify-quotes.mjs` (no new finding)
- `node scripts/plan/verify-test-claims.mjs`
- `node scripts/plan/verify.mjs`
- `node scripts/plan/queue.mjs --check`
- `node scripts/plan/site.mjs --check`

## §5. Registered predictions · declared unchanged · invalidators · falsification

**Predictions:**
- **P-1:** C3 passes.
- **P-2:** C2 passes, including `gdal/`'s three files despite the directory's 2026-09-20 time.
- **P-3:** #12's invocation field holds `--bbox` and the release. #11's field holds a commit-pinned URL. #11's full sha256 agrees with the leading and trailing hex that `state/cloud/wave1/B.md` shows for it.
- **P-4:** no DuckDB spatial extension version appears anywhere in the local record.
- **P-5:** every per-row outcome in §3.
- **P-6:** C6 finds 0 hits in classes P-a to P-d, and every P-e hit falls under a permitted prefix.
- **P-7:** the largest copy, `MANIFEST.json`, is below `MAX_ADDED_BLOB`.
- **P-8:** `RECORD.md`'s hazards section lists `gp-epsg2056-dupint-struid.parquet`, and it is not corrected.
- **P-9:** the reproducible set contains #11, plus whichever of #12 and R-2–R-4 their sources support. At least 16 files are local-only.

**Declared unchanged:**
- `engine/src/**` and `engine/tests/**`, including `CORPUS_ROOT`, which still names the untracked corpus;
- `engine/ADMISSION-PREREGISTRATION.md`, `engine/ADMISSION-RESULTS.md`, `frontends/shell/MANUAL-WALKTHROUGH.md`;
- every existing line of `.gitattributes` and `kernel/FIXTURES.md`;
- `docs/**`, `.github/**`, `scripts/**`;
- `tools/corpus/` and branch `cloud/wave1-B`;
- the corpus of record (C2 gives the same result at step 2 and step 8);
- `target/corpus-venv`.

**Invalidators (STOP):**
- **I-1:** C3 fails.
- **I-2:** any C2 mismatch or missing file.
- **I-3:** C1 fails after Commit A.
- **I-4:** a P-a to P-d hit in a file that must be copied.
- **I-5:** no web access, and the custodian cannot take step 6.
- **I-6:** an added blob exceeds `MAX_ADDED_BLOB`.
- **I-7:** the budget is reached.

**Falsification.** This preregistration is wrong if any of these holds:
- **F-1:** the local manifest does not describe the files on disk, so "from the local corpus of record" has no single referent. That goes to the human.
- **F-2:** a script embeds dataset content, so tracking the scripts and "no data" cannot both hold.
- **F-3:** a copy cannot be stored byte-identical under the repository's attributes.

## §6. Instruments

Every quantity is an **assertion**: hash equality, byte counts, hit counts, path sets. There is no measurement, no `docs/08` row, and no fixture-drive confound (nothing is timed).

## §7. Declared values and ceilings

- `COPIED_FILES` = 13: the paths listed in §2.
- `MANIFEST_ENTRIES` = 21: `files[]` holds 17 (12 main and 5 mutations) and `retired[]` holds 4.
- `MAX_ADDED_BLOB` = 262144 bytes: the ceiling on every blob any branch commit adds (the data-file guard).
- `DENY_EXT` = `\.(parquet|arrow|feather|ipc|duckdb|db|sqlite|gpkg|geojson|shp|shx|dbf|prj|fgb|pmtiles|csv|tsv|zip|gz|7z|tar|state)$`
- `PERMITTED_PATH_PREFIXES` = `C:\dev\spatial-ide`, `C:\Program Files\QGIS 3.44.2`, `C:\OSGeo4W`, `C:\Windows`, a bare `C:\`, and the literal token `%USERPROFILE%` (not an expansion). Any other prefix blocks until the human rules.
- Size ceilings:
  - `RECORD_MAX_LINES` = 200
  - `LICENCES_MAX_LINES` = 100
  - `FIXTURES_APPEND_MAX_LINES` = 15
  - `GITATTRIBUTES_APPEND_MAX_LINES` = 4

## §8. Block-on-sight

1. A data file in any commit on the branch (C5 ii–iv).
2. A path outside the Scope, or a removed or changed existing line (C5 i, v).
3. A copy that is not byte-identical, or that lacks `attr/-text` (C1).
4. A recorded full hash that disagrees with the disk, the local manifest, the tracked manifest or any full hash elsewhere in the tree (C2, C4).
5. A licence cell without its URL, retrieved time and sha256, or a licence taken from any source §2b excludes.
6. An unidentified or non-open licence in the reproducible set, or a local-only file not listed by name.
7. A P-a to P-d hit, or a P-e prefix outside `PERMITTED_PATH_PREFIXES` without the human's ruling.
8. A "procedure recorded: yes" whose why-cell does not name the invocation field, the version fields and every input; or any claim of byte-reproducibility.
9. A version filled from a present-day read, or a gap left blank instead of written `unrecorded`.
10. Any generator script executed during the piece, or any change to the corpus of record.
11. Any change on `cloud/wave1-B` or under `tools/corpus/`.
12. A passage presented as a quotation that is not byte-exact against its named source; a line cite without its pin; any line cite into `DECISIONS-PENDING.md`.
13. A merge before the human has seen `LICENCES.md` and C6's hit list. A gate PASS is not that sighting.

## §9. Gates

- **Architect (full gating):**
  - checks §1 and §2's Scope;
  - checks block-on-sight 1–13 one by one;
  - checks ADR-009's visibility and history terms;
  - checks §1's reading that the copies land on the ruling as inert records.
- **Reviewer:**
  - reviews the full diff;
  - re-runs C1–C7 independently;
  - recomputes e69e59d9887e692dd065db3ff5770da2dcc2ea6403c4e29aaf3ee6114c9169bd.
- **Suites:** C7.
- **Human, before merge (red line):**
  - `LICENCES.md`: the table, the reproducible set and the local-only list;
  - C6's hit list;
  - the reading of "data" in §2.

  The merge is the human's click.
- **Operator:** none. There is no walkthrough row.

**Budget:** 180 minutes (PLAN `budget_minutes`), split as:
- steps 1–2: 20 minutes;
- steps 3–5: 30 minutes;
- step 6: 60 minutes;
- step 7: 35 minutes;
- steps 8–10: 35 minutes.

When the budget is reached, the worker hands back from wherever it stands.

## §10. Amendments — opens empty, append-only

*(none)*

### Amendment 1 — post-result: written after the build's results (branch head `ae0220b`) were seen

It records round 26's rulings and the build's results, and names the changes an apply round makes. It invalidates no commit of the build; §3's #12 cell, P-5 and P-6 stand as registered and are recorded as not met. Class per item: the rulings take class 5, the nearest class (a ruling changes what the piece does), because class 9 does not exist until PR #129 merges. Evidence: `state/consults/2026-09-26-corpus-record-worker-report.md` (on main), by its section numbers.

**1. Rulings (class 5, nearest).**

- **1.1** Round 26, item 1 adopts readings (a)–(g) as put in `state/questions/round-26.md`, item 1. §2's reading of "data", and §9's human-sight item for it, are thereby ruled.
- **1.1(d)** Rider (d) (paraphrase: the script copies are exempted from the SPDX check by an explicit path list, never a pattern, and `RECORD.md` names their licence) adds one path to Scope: `LICENSES/README.md`, one section appended after its last line (text in 3.3).
  - Why there: no automated SPDX check exists. The header audit is documentary. `PRE-PUBLIC-CHECKLIST.md` §1 is a completed pass whose counted extensions do not include `.py`, and it names `LICENSES/README.md` as the current-state record of each part's layer.
  - Appending after that file's last line edits no landed text.
  - C5 (i) and (v) now include this path, as a consequence of Scope, not a change to the check.
- **1.2** Rider (e) (paraphrase: no path under the Windows Users folder appears in a public copy, asserted by a grep in the PR; entry 49, F-1/F-2) adds check C8. The custodian runs it at the pushed head and carries both commands and their output in the PR body:

      git diff origin/main...HEAD -U0 | grep '^[+]' | grep -v '^[+][+][+]' | grep -ciE '[a-z]:[^a-z0-9]+users[^a-z0-9]|/[a-z]/users/'
      git grep -niE '[a-z]:[^a-z0-9]+users[^a-z0-9]|/[a-z]/users/' HEAD -- engine/compat-corpus/

  - Expected: the first command prints `0`; the second prints nothing.
  - The patterns hold no backslash, so 2.4 does not affect them.
  - C8 covers every line the PR adds and every copy in full. Main's existing lines are outside it (4, D2).
- **1.3** Round 26, item 2: the 16 project-generated rows (#1–#10, M-2, M-3, M-4, M-1c, M-1a-equivalent, R-1) stay undeclared and enter the reproducible set by regeneration. Their bytes are not distributed.
  - §2b's set rule and block-on-sight 6 now govern the third-party rows only (#11, #12, R-2–R-4).
  - The sets become: reproducible 17 (#11 by fetch, the 16 by regeneration); local-only 4 (#12, R-2, R-3, R-4).
  - P-9 is not edited. It held at `ae0220b` (reproducible 1, local-only 20; report §4). The table now departs from it by ruling, not as a prediction result.
- **1.4** Round 26, item 3: records cite this piece's commits, so its PR merges by merge commit only.

**2. Results.**

- **2.1 (class 1)** C1–C4 and C7 pass. P-1 to P-4, P-7 and P-8 hold. No STOP. The corpus of record is unchanged (report §2, §4, §7).
- **2.2 (class 1)** C5 fails on (i) by the letter. `488b641`, the form's commit, carries six paths outside §2's Scope: `PLAN.yaml`, `CUSTODIAN-QUEUE.json`, `CUSTODIAN-QUEUE.md`, `site/data/health.json`, `site/data/plan.json` and `site/index.html`.
  - The build's five commits carry 17 paths, all in Scope, and (ii)–(v) pass (report §2).
  - Cause: §2 did not list the node bookkeeping that the form's commit carries.
  - Block-on-sight 2 holds by the letter. Its disposition is a gate ruling, which is the human's (4, D1).
- **2.3 (class 2, P-6 not met)** C6 fails by the letter: 1 P-b hit and 10 P-e hits outside `PERMITTED_PATH_PREFIXES`. Over the 13 copies alone, P-a to P-d give 0 (report §3). By kind:
  - five non-paths: four JSON `\n` escapes after a colon (`of-record/MANIFEST.json`, `of-record/PROBE.json`) and one Python `%s%` format (`of-record/scripts/build_manifest.py`);
  - three in main's existing second-copy table of `kernel/FIXTURES.md`: one `D:` path, and a shared-folder path under the Windows Users folder counted twice (also the P-b hit). None is in an added line;
  - two in `site/data/health.json` at `488b641`: the worktree path, from that commit's regeneration.

  Block-on-sight 7 routes each hit to the human (4, D2).
- **2.4 (class 1)** Typed inline into the Bash tool, the §4 patterns lose backslashes and silently stop matching (report §3). The patterns are unchanged. The gates copy P-b to P-e out of §4's bullets into pattern files, self-test each against a positive sample, and run `grep -f`.
- **2.5 (class 2)** #12's procedure recorded is **no**, where §3 predicted yes. Its input is a release name and a bbox, which is neither a hash-pinned file nor a commit-pinned URL; §3's cell contradicted §1. P-5 fails on #12 only.
- **2.6 (class 2)** R-2–R-4 have no `how_obtained` field in `retired[]`. `RECORD.md` cites the commit-pinned URL in `retired[n].reason`, following the manifest as it is rather than the field name §2a assumed.
- **2.7 (class 1)** Licences (report §5):
  - #11 is Apache-2.0 at the pinned commit. It counts as open by the OSI list page only; that page is not byte-stable, and OSI's API returns `approved: false` for it (disclosed in `LICENCES.md`).
  - #12 names more than one licence, so it is local-only pending the human.
  - R-2–R-4 are unidentified, so local-only.

**3. Apply round.** `RECORD.md` and `LICENCES.md` are current-state summaries and are revised. `of-record/**`, `.gitattributes` and `kernel/FIXTURES.md` are not touched. A worker applies exactly 3.1–3.4, one signed-off commit per file, not pushed.

- **3.1 `LICENCES.md`:**
  - (a) In the Rules block, replace the bullet that begins "A row is `reproducible` only when" with:
    > - A third-party row (#11, #12, R-2–R-4) is `reproducible` only when its licence is both identified and open, and `local-only` otherwise. A project-generated row is `reproducible — by regeneration`, its licence undeclared and no data file distributed (round 26, item 2).
  - (b) In the 16 project-generated rows, set the licence cell to `undeclared — project-generated (round 26, item 2)` and the set cell to `reproducible — by regeneration`. No other cell changes.
  - (c) Set #11's set cell to `reproducible — by fetch`.
  - (d) Replace the two list sections with `## Reproducible set (17)` and `## Local-only set (4)`:
    - the first lists #11's path suffixed ` — by fetch`, then the 16 paths suffixed ` — by regeneration`, in table order, followed by this one line:
      > By regeneration means the procedure `RECORD.md` records; for #1–#6 and R-1 it lacks versions (procedure recorded: no), and the others take #1, #3 or #7 as input.
    - the second lists the paths of #12, R-2, R-3 and R-4.
  - (e) The sighting line stays last and blank.
  - (f) At most `LICENCES_MAX_LINES`.
- **3.2 `RECORD.md`:** replace the Header bullet that begins "**Licence of the copies:**" with:
  > - **Licence of the copies:** they are project-authored, written for this project on 2026-09-10, and licensed `AGPL-3.0-or-later`, the core layer (`LICENSES/README.md`, its layers table). They carry no SPDX header, because one would break byte identity; the nine scripts are exempt by explicit path in `LICENSES/README.md`, section "Byte-identical copies without an SPDX header" (round 26, item 1, rider (d)).
- **3.3 `LICENSES/README.md`:** append after the last line one blank line, then this section:
  > ## Byte-identical copies without an SPDX header
  >
  > *Appended 2026-09-26 by `corpus-reproducibility-record` (round 26, item 1, rider (d)).* The files below are exempt from the SPDX-header requirement (`CONTRIBUTING.md`; `PRE-PUBLIC-CHECKLIST.md` §1's header audit) by explicit path, never by pattern. Each is a byte-identical copy of a project-authored script, pinned by sha256 in `engine/compat-corpus/RECORD.md`, and a header would break that identity. They are in the core layer, `AGPL-3.0-or-later`, like the rest of `engine/`.
  >
  > - `engine/compat-corpus/of-record/scripts/build_manifest.py`
  > - `engine/compat-corpus/of-record/scripts/gen_duckdb.py`
  > - `engine/compat-corpus/of-record/scripts/gen_gdal.py`
  > - `engine/compat-corpus/of-record/scripts/gen_geopandas.py`
  > - `engine/compat-corpus/of-record/scripts/gen_mutations.py`
  > - `engine/compat-corpus/of-record/scripts/gen_qgis.py`
  > - `engine/compat-corpus/of-record/scripts/observe.py`
  > - `engine/compat-corpus/of-record/scripts/probe_producers.py`
  > - `engine/compat-corpus/of-record/scripts/qgis_env.py`

  First confirm that no script or test reads `LICENSES/README.md`'s bytes or hash (`git grep -n "LICENSES/README" -- '*.ts' '*.mjs' '*.rs'`, each hit read), and report what was found.
- **3.4 Checks, re-run at the new head, with counts handed back:**
  - C1, C4 (a) and (b), and C5 with 1.1(d)'s path;
  - C6, with the patterns from pattern files (2.4), over every path C5 lists;
  - C7, and the line ceilings of §7;
  - C8 (1.2).

**The custodian, before the push:**
- Bring the branch's generated set to a state where every C6 P-e hit at the head falls under a permitted prefix. Use the generated-files directive of 2026-09-19, regenerating from a checkout under a permitted prefix.
- `488b641`'s blob stays in history under 1.4 (4, D2).
- Run C8 and carry its output in the PR body.
- Put `LICENCES.md`, C6's hit list and item 4 to the human. The PR merges by merge commit.

**4. To the human, at the PR (gate rulings and red lines).**

- **D1.** Block-on-sight 2, by the letter (2.2). Either accept the six bookkeeping paths as a recorded deviation, or rewrite `488b641` (the branch is unpushed). Recommended: accept. A rewrite would leave the report on main citing commits no merge brings in, against round 26, item 3's intent.
- **D2.** Block-on-sight 7, over each hit in 2.3:
  - the five non-paths;
  - main's `kernel/FIXTURES.md` line, and whether rider (e) reaches it. It is outside this Scope; if it does, a separate piece handles it;
  - the worktree path in `488b641`'s `site/data/health.json`, which stays in history;
  - the literal `%USERPROFILE%` token, which is on §7's list but was not among reading (e)'s prefixes as put.
- **D3.** #12's set: its source names several licences (2.7).
- **D4.** Round 26, item 2's premise (1.3). For none of the 16 does the tracked tree pin every writing version end to end: #1–#6 and R-1 lack versions, and the others take those files' undistributed bytes as input. It is applied as ruled; confirm or narrow.
- **D5.** #11's open status rests on a list page that is not byte-stable, and OSI's API contradicts it (2.7).

### Amendment 2 — post-result: written after Amendment 1's apply-round results (branch head `dce598c`) were seen

It records RULED 2026-09-26, the corpus positions, items (2) and (3), and the results of Amendment 1's apply round. It names the changes a second apply round makes, and it invalidates no commit. Class per item: the results are class 1. The rulings are class 5, the nearest class, as in Amendment 1, item 1. Evidence: `state/consults/2026-09-26-corpus-apply-round-worker-report.md` (on main), cited as "the report". Amendment 1 item 4's decisions are disposed as follows: D1 in 3.1, D2 in 3.2, D3 in 3.3, D5 in 3.4, and D4 by item 2's narrowing.

**1. Results (class 1).** The apply round's checks stand as the report gives them. One hit is new against Amendment 1, item 2.3: C6 lists two P-e hits on a pre-existing line of `LICENSES/README.md` (the report, its C6 bullet). They are outside `PERMITTED_PATH_PREFIXES`, in a file that entered Scope by Amendment 1, item 1.1(d). Block-on-sight 7 routes them to the human (item 5).

**2. Item (2): the regeneration (class 5).** The ruling narrows round 26, item 2 (Amendment 1, item 1.3) for #1–#6 and R-1. Paraphrase: regenerate them with the installed pandas, numpy and DuckDB spatial, compare full hashes, and record as 2.3 says.

- **2.1 What gives way, and how far.**
  - Block-on-sight 10's first clause, and §0 item 5's second clause, give way for exactly two executions in item 4's round: one of a scratch copy of `scripts/gen_geopandas.py` and one of a scratch copy of `scripts/gen_duckdb.py`, made as 2.2 says.
    - No other generator runs.
    - Neither execution is repeated.
    - No tracked copy under `of-record/` is executed.
    - Block-on-sight 10's second clause (any change to the corpus of record) does not give way.
  - Block-on-sight 9 gives way for two things only: the pandas and numpy versions of #1–#3 and R-1, and the spatial extension version of #4–#6. §2a's rules that a version is never filled from a present-day read and that every value names an `of-record/*` field give way in the same bound.
    - Each such value comes from 2.2's run and names `RECORD.md`'s section "Regeneration run".
    - It is written only in a row whose outcome is `equal`.
    - Every other version cell stays under block-on-sight 9. An `unrecorded` in any row that is not `equal` stays.
  - §5's declared-unchanged list holds, including the corpus of record and `target/corpus-venv` (C9).
- **2.2 The run.** STOP means hand back and commit nothing further.
  - (a) **Scratch directory.** STOP if `C:\dev\corpus-regen` exists.
    - Create it with the subdirectories `scripts`, `geopandas`, `duckdb-spatial` and `evidence`. It is outside the repository and outside the corpus of record.
    - It is never named in `RECORD.md` or `LICENCES.md`.
  - (b) **Before the run.** Run these from `C:/dev/spatial-ide`, writing the listings to `evidence/`:
    - C3, then C2;
    - listing L0: every file under `target/fixtures/compat-corpus/`, with relative path, size, mtime and sha256, sorted;
    - listing V0: every file under `target/corpus-venv/`, with relative path, size and mtime, sorted.

    STOP on any C2 or C3 failure.
  - (c) **Read E0.** Use the venv's `Scripts/python.exe` with `PYTHONDONTWRITEBYTECODE=1`, and read:
    - `sys.version` and `platform.platform()`;
    - `importlib.metadata.version` of pandas, numpy, pyarrow, geopandas, shapely, pyproj and duckdb;
    - DuckDB's `PRAGMA version` (`library_version`, `source_id`).

    Then, in a fresh `duckdb.connect()` after `SET autoinstall_known_extensions=false; SET autoload_known_extensions=false;`:
    - from the `duckdb_extensions()` row for `spatial`: `installed`, and `install_mode` and `installed_from` where those columns exist;
    - the sha256, size and mtime of the file at that row's `install_path`. Never print or record the path itself, which may lie under the Windows Users root (3.2);
    - then `LOAD spatial`, and that row's `extension_version`.

    STOP if `installed` is not true.
  - (d) **Copies.** Copy `gen_geopandas.py` and `gen_duckdb.py` from `engine/compat-corpus/of-record/scripts/` into `scripts/`.
    - STOP unless each copy's sha256 equals its value in `RECORD.md` Hazards, item 1.
    - In each copy, change only the `OUT =` line's value, to `C:\dev\corpus-regen\geopandas` and `C:\dev\corpus-regen\duckdb-spatial` respectively.
    - Make the change with a script that asserts exactly one occurrence. Never use an inline Bash literal (Amendment 1, item 2.4).
    - STOP unless `diff` of each original and its copy shows exactly one changed line, the `OUT =` line, and `grep -c` for `compat-corpus` and for `spatial-ide` over the copies gives 0.
    - Both diffs go into the hand-back as printed.
  - (e) **Run.** With working directory `C:\dev\corpus-regen`, the venv's python and `PYTHONDONTWRITEBYTECODE=1`, run `scripts/gen_geopandas.py`, then `scripts/gen_duckdb.py`, once each.
    - Record each exit code and its UTC start and end. STOP on a non-zero exit.
    - `gp-epsg2056-dupint-struid.parquet` (Hazards, item 3) is neither compared nor recorded.
  - (f) **After the run.** Take E1 as in (c), L1 and V1 as in (b), and run C2 and C3 again. STOP if any of these holds:
    - E1's extension facts differ from E0's (installed, install_mode, installed_from, extension_version, and the file's sha256, size and mtime);
    - L1 differs from L0, or V1 differs from V0;
    - C2 or C3 fails.

    Whether the run's `INSTALL spatial` reaches the network is not asserted. A changed extension is detected, and a fetch that leaves the file byte-identical with the same mtime is not.
  - (g) **Compare.** Take the full sha256 of the seven outputs and compare each with `of-record/MANIFEST.json`'s `sha256` for its entry. The outputs are:
    - in scratch `geopandas/`: `gp-epsg2056-intkey` (#1), `gp-nocrs-nokey` (#2), `gp-epsg4326-covering` (#3) and `gp-epsg3857-strkey` (R-1);
    - in scratch `duckdb-spatial/`: the three files of #4–#6.

    The outcome for each id is `equal` or `differs`.
  - (h) **Leave the scratch directory in place.** Nothing under `C:\dev\corpus-regen` enters the repository.
- **2.3 The recording rule.**
  - **{P}:** the phrase that item (2) places in double quotes. It is extracted by script from `state/directives/2026-09-26-corpus-positions-and-stop-hook.md`, §2, the line that begins `(2) `, at the commit on origin/main that added the file. It is never retyped, and it is not reproduced here (round 12, the rider on (b)).
  - **U:** every id whose outcome is `differs`, plus every id built from one by §2a's inputs, transitively.
    - From #1: #7, #9, #10, M-2, M-3, M-1c, M-1a-equivalent, and M-4 (through #7).
    - From #3: #8.
    - From #2, #4, #5, #6 and R-1: none.
  - **An `equal` row:** its versions are pinned as observed to reproduce the file (4.1 (a)–(b)).
  - **A row in U:** it carries {P} (4.1 (d), 4.2 (b)).
- **2.4 Reconciliation with §1.**
  - **The may-not-claim list stands whole.** `equal` records one fact: one named run, with the versions it lists, wrote bytes whose sha256 equals the manifest's. It is an observation of hash equality, of the same kind as C1. It is not the claim that the file is byte-reproducible, and block-on-sight 8 reads it that way. By this ruling, §1's may-claim list gains that observation for #1–#6 and R-1, and nothing more.
  - **§1's definition of "procedure recorded: yes" is not edited.** An `equal` row meets it: the tracked tree holds the invocation, versions of software that wrote those exact bytes, and no input.
    - Its cell reads `yes (versions observed: Regeneration run)`, never a plain `yes`.
    - The human confirms this reading (item 5). The alternative, leaving `no`, is a one-cell change per row.
  - **A row in U** keeps its procedure-recorded value and its set, each with `; {P}` appended. No set changes and no claim widens.

**3. Item (3): the positions (class 5).**

- **3.1 D1.** Paraphrase: the six paths are accepted as a disclosed scope deviation if they are bookkeeping only. The operational test is C13. It applies to every branch commit `<c>` that touches any of the six, `488b641` and any later commit (for example the custodian's pre-push regeneration):
  - (i) `git diff-tree -r --no-commit-id --name-status <c>` lists only the six paths, plus this preregistration (`A`) for `488b641` alone;
  - (ii) every changed line of `git diff <c>^ <c> -- PLAN.yaml` lies inside node `corpus-reproducibility-record`'s block at `<c>`, meaning from its `- id:` line through the line before the next `- id:` line;
  - (iii) in a detached checkout of `<c>` under `C:\dev\wt\`, both `node scripts/plan/queue.mjs --check` and `node scripts/plan/site.mjs --check` exit 0 (the tools as they stand at `<c>`);
  - (iv) `site/data/health.json` has the same set of JSON key paths at `<c>` as at `<c>^`.

  If all four hold, C5 (i)'s hits on those paths are the accepted deviation, and block-on-sight 2 is disposed for them and for nothing else. If any fails, block-on-sight 2 stands for that commit and goes to the human. D1 disposes of no C6 hit (3.2).
- **3.2 D2.** Paraphrase: the literal `%USERPROFILE%` token is accepted as an unexpanded variable token, and any expanded path under the Windows Users root is refused.
  - §7's list already holds the token and is not edited.
  - C6's text and pass condition are unchanged. P-b stays blocking with no exception, and C8 is unchanged.
  - Main's pre-existing `kernel/FIXTURES.md` line is outside this Scope, which is append-only for that file. It carries the P-b hit (refused) and a `D:` P-e hit. A separate node, which the custodian files, removes it.
    - C6 fails on that line at the head, and block-on-sight 7 blocks the merge, until the line is gone from main and main is merged into this branch.
    - The human may rule otherwise at the PR.
  - Block-on-sight 7 is unchanged. The positions dispose of the `%USERPROFILE%` hit only.
- **3.3 D3.** Paraphrase: #12's row lists every licence its source names, with attribution, and the file is fetch-only and never redistributed. `LICENCES.md` changes as 4.2 (d) says.
  - A source entry that names no licence is recorded as `no licence named by the source`. That is not decided here (item 5).
  - The rule of Amendment 1, item 3.1(a) says a third-party row is reproducible only when its licence is identified and open. So #12 stays in the local-only set, annotated fetch-only.
  - It moves only on the human's ruling on that entry.
- **3.4 D5.** Paraphrase: #11's open status is pinned to the SPDX licence list at a pinned release, plus the source repository's `LICENSE` at the pinned commit.
  - The `LICENSE` is already the row's primary source.
  - O1 is no longer #11's pin.
  - §2b's exclusion of SPDX guesses stands. It concerns identifying a licence, and #11's identification stays on its `LICENSE`. The list is read only for the OSI marking of that licence.

  What the worker fetches, under §2b's source rules:
  - **The release:** the latest release of `spdx/license-list-data` at retrieval. Its tag is resolved to a commit with `git ls-remote https://github.com/spdx/license-list-data "refs/tags/<tag>^{}"`, or with the tag ref itself if the tag is not annotated.
  - **The file:** `https://raw.githubusercontent.com/spdx/license-list-data/<commit>/json/licenses.json`, fetched twice with `curl -sL`.
  - **The fields:** `isOsiApproved` of the `licenses[]` entry whose `licenseId` is `Apache-2.0`, and the file's `licenseListVersion`.

  STOP if the two fetches differ, if `licenseListVersion` is not the tag without its leading `v`, or if `isOsiApproved` is not `true`.

**4. The apply round.** A worker applies 2.2, then exactly 4.1–4.2, with one signed-off commit per file, not pushed.
- `of-record/**`, `.gitattributes`, `kernel/FIXTURES.md` and `LICENSES/README.md` are not touched.
- Inserted strings are extracted by script from this amendment or from their named source, and never retyped. `{…}` placeholders are filled from the run's evidence.

- **4.1 `RECORD.md`:**
  - (a) In each `equal` row among #1–#3 and R-1:
    - in the producer-and-version cell, replace `` pandas `unrecorded`; numpy `unrecorded` `` with `pandas {v}; numpy {v} (observed to reproduce this file: Regeneration run)`;
    - set procedure recorded to `yes (versions observed: Regeneration run)`;
    - set the why cell to `` invocation: `scripts/gen_geopandas.py`, block {n}. Versions: Regeneration run's list, observed to write these bytes. No inputs (synthetic) ``, where {n} is 1, 3, 4 and 2 for #1, #2, #3 and R-1.
  - (b) In each `equal` row among #4–#6:
    - in the producer-and-version cell, replace `` spatial extension version `unrecorded` `` with `spatial extension {v} (observed to reproduce this file: Regeneration run)`;
    - set procedure recorded as in (a);
    - set the why cell to `` invocation: `scripts/gen_duckdb.py`, block {X}. Versions: Regeneration run's list, observed to write these bytes. No inputs (synthetic) ``, where {X} is A, B and C.
  - (c) In a `differs` row whose why cell begins `as #1` or `as #4`, where that referent row is `equal`: replace the why cell with the referent's why cell at `dce598c`, byte-copied.
  - (d) In each row in U, append `; {P}` to the procedure-recorded cell.
  - (e) After Hazards and before Verify, insert:
    > ## Regeneration run (the preregistration's Amendment 2)
    >
    > - **Run:** {UTC start} to {UTC end}, with the corpus venv `target/corpus-venv`. Copies of `scripts/gen_geopandas.py` and `scripts/gen_duckdb.py` (sha256 as in Hazards, item 1), with only `OUT` changed to a scratch directory outside the repository and the corpus of record, were each executed once. The corpus of record and the venv were unchanged (C2, C3 and full listings, before and after).
    > - **Versions read:** Python {v}; {platform}; pandas {v}; numpy {v}; pyarrow {v}; geopandas {v}; shapely {v}; pyproj {v}; duckdb {library_version} ({source_id}); spatial extension {extension_version} (`duckdb_extensions()`), binary sha256 {hex}, unchanged by the run.
    > - **Outcome** (the full sha256 of the regenerated bytes against the entry's row):
    > - **What `equal` states:** this one run, with the versions above, wrote bytes with the entry's sha256. It is not a claim that the file is byte-reproducible (the preregistration's §1).
    > - **The mark** in the procedure-recorded cells is the human's phrase, RULED 2026-09-26, the corpus positions, item (2). It is byte-copied by script from `state/directives/2026-09-26-corpus-positions-and-stop-hook.md` @ {rev}, §2, the line beginning `(2) `, sha256:{hash}. The phrase is a sub-line span; the hash is its line's. It marks a file whose bytes did not regenerate, and every file built from one (§2a's inputs).

    Under "Outcome", insert seven sub-bullets in the order #1, #2, #3, #4, #5, #6, R-1, each `  - {id}: equal` or `  - {id}: differs, regenerated sha256 {hex}`. {rev} is `git log origin/main --diff-filter=A --format=%h -1 -- <that path>`, and {hash} is `git show {rev}:<that path> | sed -n '{line}p' | sha256sum`.
- **4.2 `LICENCES.md`:**
  - (a) In Rules, replace the bullet that begins "An identified licence is **open** only when" with:
    > - An identified licence is **open** only when the OSI approved-licence list or the Open Definition conformant-licence list also names it. For #11, OSI approval is read from the SPDX licence list at a pinned release (O4; RULED 2026-09-26, the corpus positions, item (3)).
  - (b) For each row in U, append `; {P}` to its set cell and to its path's line in the reproducible-set list.
  - (c) In #11's licence cell, replace `Open: the OSI list names it (O1)` with `Open: the SPDX licence list at {tag} marks it OSI-approved (O4; RULED 2026-09-26, the corpus positions, item (3))`.
  - (d) #12:
    - **Re-fetch first.** Re-fetch the row's URL. STOP if its sha256 is not the row's, if the buildings section's per-source entries cannot be separated mechanically, or if the licences named differ from the build's report §5 (the theme ODbL; ODbL 2 sources, CC BY 4.0 4 sources, none for 1).
    - **Licence cell:** replace it with `Every licence the source names, with attribution (RULED 2026-09-26, the corpus positions, item (3)). The buildings theme: {licence}. Per source, in the source's order: {entry} — {licence, or no licence named by the source}; … The release's own notes name no licence (S7). The Open Definition list names ODbL-1.0 and CC-BY-4.0 (O3)`.
      - Each {entry} and {licence} is byte-copied by script from the pinned bytes.
      - `|` is escaped as `\|`, and line breaks are joined with one space.
    - **Set cell:** `local-only — fetch-only, never redistributed (RULED 2026-09-26, the corpus positions, item (3))`.
    - **Local-only list:** suffix #12's path with ` — fetch-only, never redistributed`.
  - (e) Replace O2's third sub-bullet with `  - Superseded as #11's pin by O4.` After O3, insert one line:
    > - **O4. SPDX licence list, release {tag} (#11's OSI pin; RULED 2026-09-26, the corpus positions, item (3)).** Source: {commit-pinned URL}, retrieved {UTC}, sha256 {hex} ({byte-stable or not byte-stable}). Its `licenses[]` entry with `licenseId` `Apache-2.0` has `isOsiApproved` `true`; `licenseListVersion` {v}.
  - (f) Replace the line that begins "By regeneration means" with:
    > By regeneration means the procedure `RECORD.md` records. Its section "Regeneration run" gives one run's outcome for #1–#6 and R-1. An entry that carries the human's phrase (RULED 2026-09-26, the corpus positions, item (2)) is one whose regeneration is not established, or is built from one.
  - (g) The sighting line stays last and blank. The file stays at most `LICENCES_MAX_LINES` long.
- **4.3 Checks at the new head.** Hand back counts.
  - C1, C4 (a) and (b), C5 with 1.1(d)'s path, C6 from pattern files (2.4 of Amendment 1), C7, C8, and §7's ceilings.
  - **C9:** L0 = L1, V0 = V1, and C2 and C3 pass before and after.
  - **C10:** E0's extension facts equal E1's, and `installed` is true at E0.
  - **C11:** 2.2 (d).
  - **C12:** read `git diff` of each file cell by cell; the checks below apply to every id.
    - Only the cells 4.1 and 4.2 name change, and each changes as its outcome requires.
    - {P} occurs in `RECORD.md` exactly |U| times, all in procedure-recorded cells, and in `LICENCES.md` exactly 2|U| times. Each occurrence equals the extracted phrase byte for byte.
    - The count of `unrecorded` in `RECORD.md` falls by exactly the cells pinned: 2 per `equal` geopandas row and 1 per `equal` DuckDB row.
    - Neither file names the scratch directory or an extension path.
  - **C13:** 3.1 (i)–(iv).
  - **C14:** the STOP conditions of 3.4 and 4.2 (d).
  - **Resolution step:** resolve every changed cell and every "Regeneration run" line against E0, E1, the outcome hashes, the extracted phrase and the fetched hashes. STOP on a mismatch.
- **4.4 Hand-back.** It contains:
  - the commits;
  - both diffs from 2.2 (d);
  - E0 and E1, with no path;
  - the counts and sha256 of L0, L1, V0 and V1;
  - the seven outcomes, with full sha256;
  - each check, as counts;
  - C6's hit list;
  - the fetch hashes;
  - any STOP.

  The values of `$USERNAME` and `$COMPUTERNAME` are never printed, only the count (§4, P-a), and no path under the Windows Users root is printed. Budget: 90 minutes; at the budget the worker hands back from where it stands.

**The custodian:**
- Amendment 1 item 3's pre-push steps stand. Any commit they make that touches the six paths passes C13.
- The branch stays local until the human has sighted `LICENCES.md` and the scan hits (the directive's item (1)).
- After the reviewer's gate, delete `C:\dev\corpus-regen`.

**5. To the human, at the PR.**
- `LICENCES.md`: the table, both sets and their lists, and the sighting line.
- C6's hits that the positions leave open:
  - the five non-paths (Amendment 1, item 2.3);
  - `kernel/FIXTURES.md`'s `D:` hit, and its Users-root hit (refused; the merge waits for the separate node unless the human rules otherwise, 3.2);
  - `LICENSES/README.md`'s two pre-existing P-e hits (item 1);
  - the worktree path in `488b641`'s `site/data/health.json`, which stays in history (Amendment 1, item 1.4). It is also at the head if the custodian's regeneration has not removed it.
- C13's result for each commit (3.1).
- #12: the source entry that names no licence, and whether #12 moves to `reproducible — by fetch` (3.3).
- The reading in 2.4: `yes (versions observed: Regeneration run)`, or `no` left in place.
- #11: the SPDX release the worker took, the latest at retrieval.
- The merge is by merge commit (Amendment 1, item 1.4).

### Amendment 3 — post-result: written after gate 1's results (branch head `0fcf006`) were seen

It records gate 1's results (class 1) and RULED 2026-09-26 — question round 27, items 1 to 4 (class 5, the nearest, as in Amendment 1, item 1), and names the changes a third apply round makes. It is the architect's reduction under the record cap (`state/directives/2026-09-18-record-cap.md`, item (3)): this piece's two record rounds are spent, the text below is applied as written, and no record round follows. It invalidates no commit and edits no registered text. Evidence, by finding: `state/consults/2026-09-26-corpus-record-gate1-architect.md` ("the architect report") and `state/consults/2026-09-26-corpus-record-gate1-reviewer.md` ("the reviewer report"). The questions as put: `state/questions/round-27.md`, by item. Superseded index: item 8.

**1. Results (class 1).**

- **1.1** C13 at `0fcf006` passes under the merge reading that round 27, item 4 adopts; `488b641` passes as written (the reviewer report, finding 2; the architect report, E1). C5 by the letter lists no path for a merge; the merge's blobs were checked separately (the reviewer report, finding 2).
- **1.2** P-a: 140 hits, all in `site/index.html` (the reviewer report, finding 1). Every earlier P-a count of 0 came from a command that aborted and printed nothing (3.2). P-6 stays as registered and not met (Amendment 1, item 2.3).
- **1.3** E2: the Regeneration run's window and each script's single execution are supported by the scratch files' times, with the residual stated there; exit 0 is inferred, not recorded (the reviewer report, finding 3).
- **1.4** The reviewer report's findings 4–6 and the architect report's D-a to D-e are disposed in item 5.

**2. Round 27, item 1 (class 5).**

- **2.1 {Q}:** the phrase that round 27, item 1 places in double quotes after `read`. It is extracted by script from `git show ae92f10:DECISIONS-PENDING.md` (the commit that adds the round-27 RULED block): from the one line containing the substring `the five mutations read "`, take the span from the end of that substring up to the next `"`. It is never retyped and is not reproduced here (round 12, the rider on (b)). STOP unless `ae92f10` is an ancestor of `origin/main`, exactly one line matches, and the span is non-empty and holds no `|`.
- **2.2 Cells.** In `RECORD.md`, the procedure-recorded cells of #7, #8, #9, #10, M-2, M-3, M-4, M-1c and M-1a-equivalent read {Q} (6.1(a)). #1–#6 and R-1 keep `yes (versions observed: Regeneration run)`, which settles Amendment 2, item 2.4's reading. #11 and R-2–R-4 keep `yes`, and #12 keeps `no`: the ruling names neither. `LICENCES.md` has no procedure-recorded cell; its one line describing a mark is replaced (6.2(c)).
- **2.3 Reconciliation.**
  - §1 is not edited. {Q} is not "yes", so the nine rows make no "yes" claim, and block-on-sight 8's first clause does not reach them. Their why cells are unchanged. Nothing widens.
  - §2a's yes / no column carries a third value in nine rows by ruling, as Amendment 2, item 2.4 carried a qualified yes.
  - §3's cells for those rows, and P-5, stand as registered. They held at `ae0220b` (Amendment 1, item 2.5). The table departs from them by ruling, not as a prediction result, as Amendment 1, item 1.3 did for P-9.

**3. Round 27, item 2 (class 5).**

- **3.1 Accepted hits and readings.** Hits (a) to (e), as put in `state/questions/round-27.md`, item 2, are accepted, and block-on-sight 7 is disposed for them. Amendment 2, item 3.2's wait on a separate node is withdrawn: no node is filed, `kernel/FIXTURES.md` is untouched and the merge does not wait. Rider (e) of round 26, item 1 reads as clarified: a path naming a user profile is refused, and the public folder under the Windows Users root and every path outside that root are permitted. From now on:
  - **§7's `PERMITTED_PATH_PREFIXES`:** not edited. Its "until the human rules" is met by this item for any path outside the Windows Users root and for the public folder.
  - **C6's pass condition reads:**
    - P-a: every hit lies in the owner segment of the repository's own `github.com/<owner>/spatial-ide` URLs (hit (a)), with a residual of 0 by 3.2, step 7.
    - P-b: every hit names the public folder under the Windows Users root.
    - P-c and P-d: 0.
    - P-e: every hit falls under §7's list, is a path outside the Windows Users root or the public folder under it, or is one of the five non-paths in `of-record/MANIFEST.json` (2), `of-record/PROBE.json` (2) and `of-record/scripts/build_manifest.py` (1). Those five are fixed by C1's byte identity.
    - Any other hit is STOP and goes to the human.
  - **C8:** its commands and expected output are unchanged (Amendment 1, item 1.2). A match whose folder after the Users root is the public folder is permitted and listed; any other match fails. Main's `kernel/FIXTURES.md` line is outside C8 (the same item) and is accepted as hit (b).
  - This preregistration's own `C:\dev\` paths, which C6 excludes, lie outside the Users root (the architect report, human list item 7).
- **3.2 The scan correction, (i) and (ii), binding on C6 and C8 from now on.** It extends Amendment 1, item 2.4's pattern files.
  - Tool fact: GNU grep 3.0 (Git Bash, this machine) aborts with exit 134 when `-i` and `-F` are combined. `git grep -iF`, `grep -i` and `grep -iE` did not abort in the custodian's run after gate 1. Only the canary proves a tool at run time. Git's version goes into the hand-back (6.4).
  1. **Scratch.** Use `C:\dev\corpus-scan`, outside the repository; STOP if it exists. Everything below is written there by a script file, never typed inline (Amendment 1, item 2.4).
  2. **Pattern files**, one pattern per line, LF:
     - `pa-user.txt` and `pa-host.txt`, from `$USERNAME` and `$COMPUTERNAME`, never printed;
     - `pb.txt` to `pe.txt`, each copied by script from the single-quoted span of §4's P-b to P-e bullet;
     - `c8.txt`, copied by script from the single-quoted pattern in Amendment 1, item 1.2's commands.

     STOP if any file is empty or holds an empty line.
  3. **Paths.** `paths.txt` holds C5's path set (4.2 for a merge), minus this preregistration.
  4. **Canary first.**
     - Build `canary.txt` by script from separate parts, so that no tracked line and no pattern file holds a canary string. It holds: each P-a value with the case of its letters inverted; one line each that P-b, P-c, P-d and P-e match; and one line per alternative of C8's pattern.
     - Run step 5's commands on it with `git grep --no-index` from the scratch directory, and run C8 command 1's last stage on it.
     - Each class must exit 0 and list its own canary line, and step 7's script must print at least 1 on it. Otherwise STOP.
  5. **Run at HEAD**, from the worktree root, one class at a time:
     - P-a, per value: `git grep -I -i -F -c -f <file> HEAD -- <paths>` for lines per file; the same with `-o` in place of `-c`, into a scratch file, for instances.
     - P-b to P-e: `git grep -n -I -i -E -f <pX.txt> HEAD -- <paths>`.
     - C8 command 2: `git grep -n -I -i -E -f c8.txt HEAD -- engine/compat-corpus/`.
     - C8 command 1, one stage per command, each writing a file: `git diff origin/main...HEAD -U0`; `grep '^[+]'`; `grep -v '^[+][+][+]'`; `grep -c -i -E -f c8.txt`.
     - Paths are passed as a Bash array, never through `xargs`, and no stage is piped.
  6. **Status.**
     - Exit 0 with output means found. Exit 1 with no output means none; a `grep -c` stage prints `0` and exits 1.
     - Anything else (another exit code, exit 0 without output, or any stderr) prints `SCAN ERROR <class> rc=<n>` and is STOP.
  7. **P-a residual** (hit (a)).
     - A node script reads each value from its file, and each file with a P-a hit through `git show HEAD:<path>`.
     - It replaces the owner segment of every case-insensitive `github.com/<owner>/spatial-ide` with a fixed token, then prints only the count of case-insensitive occurrences of the value that remain.
     - It exits non-zero on any error, which is STOP. Pass: 0 for every file.
  8. **Close.** Delete the scratch directory. Record the counts per class and per file, and the canary result per class.
- **3.3 (iii), owed before the push.**
  - A separate read-only worker lists every earlier exposure check that used the broken command, entry 49's audit included if it did, and re-runs each by 3.2.
  - Its report is filed at `state/consults/2026-09-26-exposure-checks-rerun.md`, with counts and classes only (no P-a value, and no path under the Windows Users root), and goes to the human before the push (item 7).
  - This amendment records only that the report is owed.

**4. Round 27, items 3 and 4 (class 5).**

- **4.1 Item 3.** `LICENCES.md` already reads as ruled: #12 is local-only, fetch-only and never redistributed, and its attribution is contributor and licence names (the reviewer report, C12 and C14). No change.
- **4.2 Item 4.** For a merge commit, C13 compares against the main parent:
  - (i) `git diff --name-status <main parent> <merge>`;
  - (ii) the same diff of `PLAN.yaml`;
  - (iii) as written;
  - (iv) `site/data/health.json` byte-equal to the main parent's (the architect report, E1).

  For a non-merge commit, (iv)'s key paths are object-key paths, the reading under which `488b641` passed (the reviewer report, finding 2). The architect's gate reading, not the ruling: C5 and C6 take a merge's paths from the same main-parent diff.

**5. Low findings, reduced.**

- **5.1** O4's retrieved time becomes the write time of both fetch files (the reviewer report, finding 4); see 6.2(a).
- **5.2** #12's cell gives each source entry as its text with every Markdown link reduced to its link text, entries 6 and 7 as well as 1 to 5. Round 27, item 3 rules names without links. Amendment 2, item 4.2(d)'s "byte-copied" reads, for this cell, as exactly that reduction. The cell is not presented as a quotation (the reviewer report, finding 5; the architect report, C1, item 12). No change.
- **5.3** The two sentences describing a mark no cell carries are replaced (6.1(c), 6.2(c)). This also settles D-d.
- **5.4** The run's exit codes are recorded as not captured (6.1(b)).
- **5.5** O1 is noted as no row's pin (6.2(b)).
- **5.6** D-e is outside this piece. It is a ledger finding and a proposal for the weekly window of 2026-10-02 (the record cap, item (2)). D-a is settled by round 27.

**6. The apply round.** A worker applies 3.2 and exactly 6.1–6.3, with one signed-off commit per file, not pushed.
- Only `RECORD.md` and `LICENCES.md` change. `of-record/**`, `.gitattributes`, `kernel/FIXTURES.md` and `LICENSES/README.md` are not touched.
- Every inserted string is extracted by script from this item's blockquotes or from {Q}'s source, never retyped. Each replacement asserts exactly one occurrence of its target.

- **6.1 `RECORD.md`:**
  - (a) In rows #7, #8, #9, #10, M-2, M-3, M-4, M-1c and M-1a-equivalent, replace the procedure-recorded cell (the eighth) with {Q}. STOP unless each cell reads `yes, given #N` beforehand, N being its input.
  - (b) At the end of the line beginning `- **Run:**`, append one space and:
    > Exit codes: not captured.
  - (c) Replace the line beginning `- **The mark**` with:
    > - **Not re-run:** #7–#10, M-2, M-3, M-4, M-1c and M-1a-equivalent were not executed in this run. Their procedure-recorded cells carry the human's phrase for that, byte-copied by script from RULED 2026-09-26 — question round 27, item 1.
- **6.2 `LICENCES.md`:**
  - (a) In O4, replace `retrieved 2026-09-26T19:47:35Z` with `retrieved 2026-09-26T19:47:24Z`. STOP unless both fetch files under Amendment 2's scratch directory, `evidence/spdx/`, have a UTC mtime in the second 2026-09-26T19:47:24Z.
  - (b) Replace the line `- **O1. OSI approved-licence list.**` with:
    > - **O1. OSI approved-licence list.** No row's pin; superseded by O4.
  - (c) Replace the line beginning `By regeneration means` with:
    > By regeneration means the procedure `RECORD.md` records for each entry, as its procedure-recorded column states.
  - (d) Nothing else changes. The sighting line stays last and blank.
- **6.3 Checks at the new head,** handed back as counts:
  - C1, C4 (a) and (b), C5 (with 4.2's merge paths), C7, and §7's ceilings;
  - C6 and C8, by 3.2;
  - **C15** (`git diff` of each file):
    - `RECORD.md`: only the nine cells of 6.1(a) and the two lines of 6.1(b)–(c) change. The procedure-recorded column over the 21 rows reads {Q} ×9 (#7–#10 and the M rows), `yes (versions observed: Regeneration run)` ×7 (#1–#6, R-1), `yes` ×4 (#11, R-2–R-4) and `no` ×1 (#12).
    - {Q} occurs 9 times in `RECORD.md` and 0 times in `LICENCES.md`.
    - `LICENCES.md`: only the three lines of 6.2 change, and #12's row is unchanged.
  - **Resolution step** (round 15, (a)): resolve every changed cell and line against this amendment, {Q}'s extraction and the fetch files' times. STOP on a mismatch.
- **6.4 Hand-back.** It contains:
  - the commits;
  - {Q}'s extraction: the matching line count, the span's length in bytes and the span's sha256;
  - `git --version` and the first line of `grep --version`;
  - the canary result per class;
  - each check, as counts;
  - C6's hit list: P-a as counts per file only; P-b and P-e by file:line and 3.1's class, with no line text;
  - any STOP.

  No P-a value and no path under the Windows Users root is printed. Budget: 45 minutes; at the budget the worker hands back from where it stands.

**7. The custodian, before the push.**
- Before this amendment is committed: file both gate-1 reports on main at the paths named in the header.
- Put 3.3's report to the human. If it lists a hit outside round 27, item 2's accepted hits, the push waits for the human's word.
- Fill the sighting line, in one commit touching `LICENCES.md` only: `Sighted by the human: RULED 2026-09-26 — question round 27, items 1, 2 and 3.`
- Every commit that touches the six paths passes C13 (4.2).
- Take a scoped gate read (reviewer) of item 6 and the sighting commit: C15, C1, C4, C5 and C7, with C6 and C8 re-run independently by 3.2, and P-a also by a node fixed-string matcher. An application mismatch is corrected to this amendment's text; it is not a record round.
- Keep `C:\dev\corpus-regen` until the scoped read is done, then delete it.
- Push. Run C8 at the pushed head by 3.2, and carry the commands, the canary result and the output in the PR body.
- The merge is by merge commit, the human's click (round 26, item 3).

**8. Superseded index.**
- Amendment 1, item 2.3, and Amendment 2, item 1: P-a's count of 0 (1.2).
- Amendment 1, item 2.4: extended by 3.2, not replaced.
- Amendment 2, item 2.4: the reading it left open, settled (2.2).
- Amendment 2, item 3.2: the merge's wait on a separate node, and C6 failing on `kernel/FIXTURES.md`'s line (3.1).
- Amendment 2, item 4.1(e)'s bullet "The mark" and item 4.2(f)'s line (6.1(c), 6.2(c)).
- Amendment 2, item 4.2(d): "byte-copied", for #12's cell (5.2).
- Amendment 2, item 5: disposed by round 27, items 1 to 4.
- Amendment 2, the custodian's note on deleting `C:\dev\corpus-regen`: deferred (item 7).
