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
