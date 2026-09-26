*Custodian's filing note (2026-09-26): the build's hand-back for PLAN node `corpus-reproducibility-record` (a general-purpose agent under the worker's instructions, for web access), at cut/corpus-reproducibility-record @ ae0220b, a local branch not pushed until the human's sight, filed as returned (extracted by script from the agent's hand-back; byte-identical). Everything below the rule is the agent's text.*

---

## Hand-back: `corpus-reproducibility-record`

Worktree `C:\dev\wt\corpus-record`, branch `cut/corpus-reproducibility-record`. There was no STOP, and the work is committed locally but **not pushed**. The copies, `RECORD.md` and `LICENCES.md` are written. Four things need your or the human's decision:
- **C5(i) fails by the letter.** Your preregistration commit `488b641` carries 6 files outside §2's Scope.
- **C6 fails by the letter.** There is 1 P-b hit and 10 P-e hits outside the permitted prefixes. Two of those put a worktree path into `site/data/health.json`, which would go public on merge.
- **#12 is recorded "procedure: no"**, where §3 predicted yes.
- **The C6 patterns silently fail when typed into the Bash tool**, so the gates must load them from a file.

Timestamps: started 2026-09-26T14:14:13Z, finished 14:35:23Z, within budget.

### 1. Commits (all `-s`, on top of `488b641`)
- `5f46abf` A: `.gitattributes` gets 2 appended lines, and `git check-attr` reports `unset`.
- `e1e999c` B: the 13 `cp` copies under `engine/compat-corpus/of-record/`.
- `22dbedb` C: `engine/compat-corpus/RECORD.md`, 88 lines against a ceiling of 200.
- `baede98` D: `engine/compat-corpus/LICENCES.md`, 95 lines against 100. The "Sighted by the human:" line is left blank.
- `ae0220b` E: `kernel/FIXTURES.md` gets 7 appended lines against 15.

### 2. Checks C1–C7
- **C1 pass:** 13 of 13 pairs are equal, and all 13 files show `attr/-text`.
- **C2 pass:** 21 OK and 0 size mismatches, both at step 2 and at step 8.
- **C3 pass:** the manifest hashes to `4b1fbca6c565ad4fd1c59d6d8f79927d20ed170611d448dbc8f39c13224af6b3`. Line 3 of `ADMISSION-RESULTS.md` at `15f558816bf1` hashes to `e69e59d9887e692dd065db3ff5770da2dcc2ea6403c4e29aaf3ee6114c9169bd`.
- **C4 pass:** (a) 21 rows with 0 disagreements, and the byte counts also match; (b) prints nothing.
- **C5 FAIL on (i).** There are 24 path-commit pairs. All 17 paths in my five commits are in Scope. The 6 outside Scope all come from `488b641`: `CUSTODIAN-QUEUE.json`, `CUSTODIAN-QUEUE.md`, `PLAN.yaml`, `site/data/health.json`, `site/data/plan.json` and `site/index.html`. The other sub-checks pass:
  - (ii) 0 `DENY_EXT` matches;
  - (iii) 0 blobs over the ceiling; the largest is `site/data/plan.json` at 185521 bytes (from `488b641`), and the largest copy is `MANIFEST.json` at 110068;
  - (iv) 0 `PAR1` markers in 24 blobs;
  - (v) 0 removed lines, with hunks `@@ -70,0 +71,2 @@` and `@@ -117,0 +118,7 @@`.
- **C6 FAIL** (23 paths): P-a 0, P-b 1, P-c 0, P-d 0, P-e 53 (43 permitted, 10 outside the list). Over the 13 copies alone at step 5, P-a to P-d gave 0 hits, so there was no STOP.
- **C7 pass:** all seven commands exit 0.
  - `node --test`: 311 of 311 pass.
  - `verify-cites`: PASS.
  - `verify-quotes`: PASS. It has no finding in any file the branch touches. The pinned cite in `RECORD.md` checks as hash PASS.
  - `verify-test-claims`, `verify`, `queue --check` and `site --check`: all PASS.

### 3. C6 hit list (P-a values not recorded)
**P-b (1 hit):** `kernel/FIXTURES.md` line 100, matching `C:\Users\`. It is the shared `C:\Users\Public\` folder, and the line is already on main; none of my appended lines contain it.

**P-e, outside the permitted list (10 hits):**
- `of-record/MANIFEST.json` line 38 (×2) and `of-record/PROBE.json` line 11 (×2): each is `s:\`, a JSON `\n` escape after a colon, not a path.
- `of-record/scripts/build_manifest.py` line 38: `%s%`, a Python format string (the `-i` flag lets `%[A-Z_]+%` match it).
- `kernel/FIXTURES.md` line 100: `D:\spatial-ide\target` and `C:\Users\Public\…` (×2). This is base content from main.
- `site/data/health.json` lines 8 and 9: `C:\dev\wt\corpus-record\…`. `488b641` introduced these; main had `C:\dev\spatial-ide\…`.

**P-e, permitted (43 hits):**

| Prefix | Hits | File: lines |
|---|---|---|
| `C:\Program Files\QGIS 3.44.2` | 16 | MANIFEST.json: 29, 30, 31, 32, 1904, 2033, 2147, 2251; PROBE.json: 2–5; README.md: 55; build_manifest.py: 24; gen_gdal.py: 3; qgis_env.py: 17 |
| `C:\dev\spatial-ide` | 22 | MANIFEST.json: 1334, 1441, 1524, 1651, 1748, 1826, 1904 (×2), 2033 (×2), 2147 (×2), 2251 (×2), 2756, 2797, 2872, 3041, 3179; build_manifest.py: 23; gen_duckdb.py: 2; gen_geopandas.py: 12 |
| `C:\OSGeo4W` | 1 | README.md: 54 |
| literal `%USERPROFILE%` | 1 | README.md: 127 |
| bare `C:\` | 2 | gen_qgis.py: 50; probe_producers.py: 27 |
| `C:\Windows` | 1 | qgis_env.py: 26 |

**The patterns fail silently in the Bash tool.** It collapses `\\` to `\` even inside single quotes, so P-b and P-e as written in §4 reach grep altered and never match. My first P-e pass wrongly showed only 2 hits. I extracted the patterns byte-exact from the preregistration with sed into files, self-tested them, and used `grep -f`. The reviewer has to do the same.

### 4. Per-row outcome against §3
Every row matches its prediction except one, and one prediction was worded against a field that doesn't exist:
- **#12 differs.** Procedure recorded is **no**, where §3 predicted yes. Its input is a release name plus a bbox, and §1 requires each input to be a hash-pinned corpus file or a commit-pinned URL.
- **#12, R-2, R-3 and R-4** had no licence or set prediction. The results are below.
- **R-2 to R-4:** the manifest's `retired[]` entries have no `how_obtained` field. §2a's wording assumes one, so their invocation cites the commit-pinned URL in `retired[n].reason` instead.

The P-predictions:
- P-1 to P-4 hold.
- P-5 holds except for #12.
- P-6 fails (section 3).
- P-7 and P-8 hold; `gp-epsg2056-dupint-struid.parquet` is listed in the hazards and is also absent from disk.
- P-9 holds: the reproducible set is #11 only, and 20 files are local-only.

### 5. Licence sources
Every URL below was fetched twice, and both fetches gave the same bytes unless marked otherwise.

- **#11:** https://raw.githubusercontent.com/opengeospatial/geoparquet/4c9f87e5226e36f2022d6bd7d3c1980debdf7431/LICENSE, retrieved 14:19:00Z, sha256 `cc771485216b90342591f565e62ad0d406ef036d40891cf27917b919956c4fb1`. It names Apache License, Version 2.0.
  - `…/NOTICE`: HTTP 404, 14:19:01Z, `d5558cd419c8d46bdc958064cb97f963d1ea793866414c025906ec15033512ed`.
  - `…/README.md`: 14:19:12Z, `f59d854a7a71abf831f2a10f9a4d366b6b6aaab9bacfa0bee0059d7f99b8f718`. It names no licence.
- **R-2 to R-4:** https://raw.githubusercontent.com/OSGeo/gdal/03fc216e1fc4af769c651a58176cae602417cca3/autotest/README.md, 14:19:46Z, `247f8f8a2bb171400da575744d57939467b03569200034412357daff9a12dcef`. Its test-data section names no licence.
  - `…/LICENSE.TXT`: 14:19:45Z, `1dae3468e81d00da56e2936f74d33b8b3ad09d726437f19ce209a5dabea41f77`. It names an MIT-style licence for GDAL/OGR in general, with nothing specific to the autotest data.
  - `…/PROVENANCE.TXT`: 14:19:46Z, `7e07bb47964f77fa4a60344cd3d66a046426c4d91dde5088717ba12a4137a0b9`. Nothing on autotest data.
- **#12:** https://raw.githubusercontent.com/OvertureMaps/docs/3d742db2401e785d608d7c0497068f5c9326f8d2/docs/_generated_attribution.mdx, 14:21:26Z, `ed39c1ff27eaf6cb021d80bdc9e142c06255f293bb9b95502e645ca8cfb41c89`. `3d742db` is the docs repository's commit for the August 2026 release. The buildings section names:
  - ODbL for the theme;
  - ODbL for 2 sources and CC BY 4.0 for 4 sources;
  - nothing for 1 source (USGS 3DEP).

  More than one licence is named, so the row is local-only until the human decides. Supporting fetches:
  - `…/3d742db…/blog/2026-08-19-release-notes.mdx`: 14:21:40Z, `a4930aac93d9f1a79355dd0eb6aa8c48fe7767ae084d078edded400946c89c19`. It names no licence.
  - `…/3d742db…/docs/attribution.mdx`: 14:21:27Z, `1572e735c167d0bbbd6611cbda42dc3897431a8100a0330808e1c193ebedda1b`.
  - The docs head `…/418db30cbdd1b26ca924b9562415ffa579f006ae/docs/_generated_attribution.mdx`: 14:20:32Z, `ad1ab5b9d6db92ad298c603db96375a0d4c5708dc35004dad1bf67a1aebb0759`. Its buildings section is identical to the one at `3d742db`.
- **Open-licence lists:**
  - The OSI list page https://opensource.org/licenses: 14:21:56Z, `48e5a2b6582d229410e10b35d12266e53852ee122bfefc778fb95e7a36805e76`. It is **not byte-stable** (the second fetch hashed `c44c540291a94e545baaa6a8d3fd91b5f88a8f85a2762c73293ce482cb728140`). It names Apache-2.0.
  - **Conflict, disclosed in `LICENCES.md`:** OSI's API https://opensource.org/api/licenses (14:22:20Z, `91305b070052c410dc95b50e2e9a0abd2fcc009078889a99b717639798a68449`) has `approved: false` for 119 of its 126 entries, Apache-2.0 and MIT among them.
  - The Open Definition list https://opendefinition.org/licenses/: 14:21:57Z, `2e437e107c33501fc3d906697b02182d6974cdbbca50c387d084df4406bfed3e`. It names ODbL-1.0 and CC-BY-4.0.
  - Consulted but not used: https://opensource.org/license/apache-2-0 (14:22:53Z, `d315150298895e863258784f11b8375c3b065cf7f0eb954f568643c5d349b206`, not byte-stable).

### 6. Sets
- **Reproducible (1):** `geoparquet-spec/example.parquet`.
- **Local-only (20):**
  - #1 to #6: `gp-epsg2056-intkey`, `gp-nocrs-nokey`, `gp-epsg4326-covering`, `duckdb-lv95range-intkey`, `duckdb-degreesrange-nokey`, `duckdb-mercatorrange-strkey`.
  - #7 to #10: `ogr2ogr-epsg2056-default`, `ogr2ogr-epsg4326-default`, `ogr2ogr-epsg2056-no-covering`, `qgis-savefeatures-epsg2056`.
  - #12: `overture-2026-08-19.0-building-bern`.
  - The five mutations: `-truncated`, `-geojson-invalid`, `-covering-absent-columns`, `-changed-same-size`, `-appended`.
  - R-1 to R-4: `gp-epsg3857-strkey`, `poly`, `test_geoparquet_1_1`, `test_with_fid_and_geometry_bbox`.
  - Each name is `.parquet`, and `LICENCES.md` lists them with full relative paths.

### 7. STOPs
None. Step 9's resolution ran 277 mechanical checks with 0 mismatches. It covered row ids, manifest paths and field references, versions against their named fields, hazard hashes against C1, and licence cells against the fetch log. Step 10 was not pushed, as you instructed. No generator was executed, and the corpus of record is unchanged: C2 is identical at steps 2 and 8, and all 34 files are still there.

### 8. Final state
- `git status --porcelain` in the worktree is empty. The branch is not on origin (`ls-remote` shows nothing).
- The main checkout holds only its pre-existing `?? .codex-remote-attachments/`.
- `git log --oneline origin/main..HEAD`: `ae0220b`, `baede98`, `22dbedb`, `e1e999c`, `5f46abf`, `488b641`.
- Nothing is left running.

### Self-check and model
- **Seams:** no code was written. Every field the record cites was resolved against the actual manifest.
- **Evidence:** every claim above points to a C-check or the resolution run.
- **Messages:** there are no user-facing messages.
- **Checks:** every check reached its assertion. The C6 patterns were self-tested positive after the backslash problem was found.
- **Model:** I ran as Opus 5.5 (`claude-opus-5-5[1m]`), dispatched as general-purpose for web access. There was no override and no context handoff.

### Noticed but not changed
Four things sit outside my Scope:
- `488b641`'s `site/data/health.json` embeds the worktree path.
- `488b641` puts 6 files outside §2's Scope, which trips C5(i).
- The same Bash-tool backslash collapse will hit anyone re-running C6 with inline patterns.
- The OSI API's `approved` field disagrees with OSI's own list page.
