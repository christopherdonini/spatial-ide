# Compatibility corpus — manifest and fetch-and-verify (proposal)

The twelve files of `engine/ADMISSION-PREREGISTRATION.md` §3's main set, described so that anyone can
fetch or regenerate them and prove the bytes are the ones the admission results were scored on. No
data file is committed here, and none should be.

- `MANIFEST.json` — per file: path, pipeline, sha256, how to obtain it, licence, attribution, and a
  `gaps` list. A `null` is a gap, never a default. Each value cites the tracked file it came from.
- `fetch-verify.mjs` — Node standard library only. It downloads only from an entry's one pinned URL
  (redirects refused, no fallback source), writes nothing whose sha256 differs, refuses every entry
  without a full pinned sha256, and hash-checks writer-produced files where they already sit.

```
node tools/corpus/fetch-verify.mjs --out target/fixtures/compat-corpus          # the CI set
node tools/corpus/fetch-verify.mjs --out target/fixtures/compat-corpus --all    # all twelve
node tools/corpus/fetch-verify.mjs --out target/fixtures/compat-corpus --id '#8'
```

Behind an HTTPS proxy, set `NODE_USE_ENV_PROXY=1` (Node ≥ 22.21) so `fetch` uses `HTTPS_PROXY`.
Exit 0 means every selected entry verified. 1 means at least one was refused, missing, or
mismatched. 2 means a usage error.

## What is actually pinned today

The corpus of record is untracked, on the human's Windows machine at `target/fixtures/compat-corpus/`,
along with its own `MANIFEST.json` (sha256 `4b1fbca6…af6b3`, `engine/ADMISSION-RESULTS.md:8`) and the
generator scripts in `scripts/` beside it. None of these is in the repository. The tracked record
holds a 12-hex prefix for every file and a full sha256 for only three (#1, #3, #8). It names no
generator command, no writer source input except #8's, and no licence for any project-generated
file. Every missing value is `null` in `MANIFEST.json`, and the script refuses those entries rather
than trusting a 48-bit prefix. The gaps can only be filled by copying the facts from the corpus of
record's own manifest and scripts. Nothing here reconstructs them.

| # | file | obtain | full sha256 | CI | reproducible in a Linux cloud session? |
|---|---|---|---|---|---|
| 1 | `geopandas/gp-epsg2056-intkey.parquet` | writer | yes | no | **No.** The generator script is untracked, so no source or command is known. |
| 2 | `geopandas/gp-nocrs-nokey.parquet` | writer | no | no | **No.** Same reason, and there is no full hash. |
| 3 | `geopandas/gp-epsg4326-covering.parquet` | writer | yes | no | **No.** The generator script is untracked. |
| 4–6 | `duckdb-spatial/*.parquet` | writer | no | no | **No.** The SQL is untracked, the spatial extension version is unrecorded, and there are no full hashes. |
| 7, 9 | `gdal/ogr2ogr-epsg2056-*.parquet` | writer | no | no | **No.** The source input and command are unrecorded. The writer was QGIS 3.44.2's Windows GDAL 3.11.3. A Linux GDAL 3.11.3 is a different build, and matching bytes are not established. |
| 8 | `gdal/ogr2ogr-epsg4326-default.parquet` | writer (from #3) | yes | no | **No.** The command is unrecorded, and its input #3 is itself unreproducible. |
| 10 | `qgis/qgis-savefeatures-epsg2056.parquet` | writer | no | no | **No.** The source and command are unrecorded. The recorded writer is `qgis_process` from the Windows standalone QGIS 3.44.2. QGIS does run on Linux, but a Linux QGIS 3.44.2 links a different GDAL build, and nothing establishes identical Parquet output across the two. Pinning this file requires the Windows install. |
| 11 | `geoparquet-spec/example.parquet` | download, pinned commit | yes (computed here) | **yes** (28,438 B, Apache-2.0) | **Yes.** Fetched and verified 2026-09-26. |
| 12 | `overture/overture-2026-08-19.0-building-bern.parquet` | writer (overturemaps 1.0.2) | no | no | **No.** The Bern `--bbox` is unrecorded, so the extract cannot be re-derived. The buildings-theme licence is not recorded in the repository. |

**CI set.** Only #11 today: it is small, openly licensed, and pinned to a commit. The whole corpus is
about 780 KB (`state/cut-archive/CUT-STATE-2026-09-13-release-0.1.0.md:204`), so once the gaps are
filled, size is not a reason to keep any file out of CI. Licence and determinism may still be.

**Optional.** Every other entry, until its gaps close. Once filled, a writer entry becomes
verify-only: regenerate it with the pinned tool, or copy it from the corpus of record, into `--out`,
and the script checks it.

## Licences and attribution

#11 is Apache-2.0 (the GeoParquet repository's `LICENSE` at the pinned commit, fetched in this
session). The script never redistributes it. Anyone who does must follow Apache-2.0 §4. Every other
entry's licence is `null` because the tracked record does not state it. This proposal does not decide
those licences.

## Platform

Results from this directory's first run are Linux evidence only (a cloud container). They say nothing
about the Windows corpus of record beyond the hashes compared.
