# GeoParquet compatibility corpus

Collected 2026-09-10 for the first post-tag cut's preregistration
(`RELEASE-DRAFTS-0.1.0/post-tag/DRAFT-2-BRIEF-A-admission-and-session-lifecycle.md`, phase P0),
and extended the same day with GDAL-written and QGIS-written files and with a `mutations/` set.

This directory is **untracked evidence** under `target/`. Nothing here is part of the repository's
tracked tree, and nothing here was produced by, or read by, the application. No Spatial IDE code was
run against any of these files.

## Layout

| Directory | What it holds | Counted in the cap |
|---|---|---|
| the main set (`geopandas/`, `duckdb-spatial/`, `gdal/`, `qgis/`, `geoparquet-spec/`, `overture/`) | 12 files from independent producer pipelines | yes — the main set is capped at 12 |
| `mutations/` | 5 files derived here from a named main-set file, each changing one thing | no |
| `retired/` | 4 files moved out of the main set on 2026-09-10, kept on disk | no |

## What this corpus is

Twelve GeoParquet files from independent producer pipelines, collected so that the reader's
admission behaviour can be exercised against bytes this project did not write. The set spans the
cases the P0 row names: declared projected CRS, an absent `crs` key, an explicit `crs: null`,
integer-typed key columns, string-typed key columns, files with neither, files with and files
without `covering` metadata, one Overture extract, and the GeoParquet specification's own example
file.

## What this corpus is NOT

- **Expected outcomes are not recorded here, by design** — for the main set and for the mutations
  alike. The `mutations/` files are fixtures for the preregistered refusals; their expected
  outcomes are pre-declared in `engine/ADMISSION-PREREGISTRATION.md`, not here. (That file does not
  exist in the tree as of 2026-09-10; this README names where the declarations belong, and does not
  create them.) No file in `MANIFEST.json` is called correct, incorrect, admissible, or refusable.
- **No observation that was not read from bytes.** Every field under `observed` in `MANIFEST.json`
  was read from the file itself with pyarrow, or — for the tail facts — from the raw last eight
  bytes. Where a writer emitted no value, the manifest records the absence rather than filling it
  in.

## Pipelines represented

| Directory | Pipeline | Obtained | Files |
|---|---|---|---|
| `geopandas/` | GeoPandas 1.1.4 `GeoDataFrame.to_parquet`, writing through pyarrow 25.0.1 | produced here | `gp-epsg2056-intkey.parquet`, `gp-epsg4326-covering.parquet`, `gp-nocrs-nokey.parquet` |
| `duckdb-spatial/` | DuckDB 1.5.5 + `spatial` extension, `COPY ... TO ... (FORMAT PARQUET)` | produced here | `duckdb-lv95range-intkey.parquet`, `duckdb-degreesrange-nokey.parquet`, `duckdb-mercatorrange-strkey.parquet` |
| `gdal/` | GDAL 3.11.3's OGR Parquet driver, run as `ogr2ogr` | produced here | `ogr2ogr-epsg2056-default.parquet`, `ogr2ogr-epsg4326-default.parquet`, `ogr2ogr-epsg2056-no-covering.parquet` |
| `qgis/` | QGIS 3.44.2 processing, run headless as `qgis_process` (`native:savefeatures`) | produced here | `qgis-savefeatures-epsg2056.parquet` |
| `geoparquet-spec/` | the specification repository's own `examples/example.parquet` | downloaded | `example.parquet` |
| `overture/` | Overture Maps release 2026-08-19.0 via the `overturemaps` 1.0.2 CLI | extracted | `overture-2026-08-19.0-building-bern.parquet` |

### GDAL and QGIS as writers, on this machine

The earlier collection note said GDAL could not be run as a writer here. That is no longer true.
`C:\OSGeo4W` is an empty stub, but a standalone **QGIS 3.44.2** is installed at
`C:\Program Files\QGIS 3.44.2`, and it ships its own GDAL and its own `qgis_process`. Probed
2026-09-10 (verbatim output is in `PROBE.json`, and copied into `MANIFEST.json` under
`probed_producers`):

- `bin\ogrinfo.exe --version` → `GDAL 3.11.3 "Eganville", released 2025/07/12`
- `bin\ogrinfo.exe --formats` → `  Parquet -vector- (rw+v): (Geo)Parquet (*.parquet)` — the driver
  is present **and writable**, in 80 driver lines
- `apps\qgis\bin\qgis_process.exe --version` → `QGIS 3.44.2-Solothurn 'Solothurn' (f30453dede3)`,
  with `GDAL/OGR version 3.11.3`, `PROJ version 9.6.2`, `Qt version 5.15.13`,
  `Python version 3.12.11`

`bin\o4w_env.bat` was **not** used to set the environment: called from this session's shell it fails
with `The filename, directory name, or volume label syntax is incorrect` (it does `pushd %~dp0` /
`cd ..` and depends on the parent process's current directory). `scripts/qgis_env.py` sets the same
variables directly, read out of `bin\o4w_env.bat`, `etc\ini\*.bat` and `bin\qgis_process-qgis.bat`.

`qgis_process` prints `Problem with GRASS installation: GRASS was not found or is not correctly
installed` on stderr on every run; GRASS is not installed with this QGIS. The algorithm still
returned 0 and wrote its output.

The `-lco` option that suppresses the bbox columns is **`WRITE_COVERING_BBOX=NO`**. It was taken
verbatim from `ogrinfo --format Parquet`, whose `LayerCreationOptionList` declares
`<Option name="WRITE_COVERING_BBOX" type="boolean" default="YES" ...>`. It was not invented for this
corpus.

## Mutations

`mutations/` holds five files, each derived from one named main-set file by
`scripts/gen_mutations.py`. They are fixtures for the preregistered refusals; the expected outcomes
are pre-declared in `engine/ADMISSION-PREREGISTRATION.md`, not here. `mutations/DERIVATIONS.json`
records, per file, the base, the derivation with the byte offsets and parameters actually used, and
the observed difference from the base (byte size, the uint32 footer-length field in the last eight
bytes, whether the trailing `PAR1` magic survives, whether the `geo` metadata parses as JSON). The
same records are copied into `MANIFEST.json`.

Two honest caveats about how they were made:

- `-geojson-invalid`, `-covering-absent-columns` and `-appended` are **pyarrow rewrites**, not
  in-place edits: the Parquet footer's `created_by` on those three is pyarrow's, not the base
  writer's. The manifest shows this under `observed.parquet_footer_created_by`.
- `-appended` is a rewrite with two row groups, because a Parquet footer cannot be appended to in
  place. It is recorded as such.

`-truncated` and `-changed-same-size` are byte operations on a copy and change nothing else.
`-changed-same-size` kept both the base's byte size and the base's `st_mtime_ns` (restored with
`os.utime`); the manifest records that both held.

## Retired files

The main set is capped at 12. Four files were added on 2026-09-10 (three GDAL-written, one
QGIS-written), so four were moved into `retired/`. They were **moved, not deleted** — the bytes are
still on disk and any of them can be moved back. `MANIFEST.json`'s `retired` array carries each
one's previous path, the reason, its sha256 and its full `observed` block, so a prediction already
made against one of them is not lost.

| Retired | Was | Why |
|---|---|---|
| `retired/gp-epsg3857-strkey.parquet` | `geopandas/gp-epsg3857-strkey.parquet` | near-duplicate of `gp-epsg2056-intkey.parquet` on every observed axis (same writer, geo 1.0.0, PROJJSON with a projected EPSG id, no covering, `bbox` member present, one integer-typed and one string-typed column); only the EPSG code differs, and 2056 is the code this slice names |
| `retired/poly.parquet` | `gdal/poly.parquet` | a downloaded stand-in for "GDAL-written". Its observed shape (geo 1.1.0, PROJJSON with a projected EPSG id, covering present) is now held by `gdal/ogr2ogr-epsg2056-default.parquet`, written by GDAL here with a recorded command. **It was the corpus's only EPSG:27700 file** — flagged for the P0 architect, and its `observed` block is retained in the manifest |
| `retired/test_geoparquet_1_1.parquet` | `gdal/test_geoparquet_1_1.parquet` | held "GDAL-written, geo 1.1.0, `crs` key absent, covering present"; `gdal/ogr2ogr-epsg4326-default.parquet` now has that same observed shape and was written here, and the Overture file holds it too |
| `retired/test_with_fid_and_geometry_bbox.parquet` | `gdal/test_with_fid_and_geometry_bbox.parquet` | overlapped `test_geoparquet_1_1.parquet`: same producer family, `crs` key absent in both, covering present in both, integer-heavy schema in both |

The three retired GDAL files were downloaded from the GDAL autotest corpus at commit
`03fc216e1fc4af769c651a58176cae602417cca3` on 2026-09-10; the URLs are in `MANIFEST.json`.

## How it was collected

A virtual environment at `target/corpus-venv/` (untracked) holds pyarrow 25.0.1, geopandas 1.1.4,
pyogrio 0.13.0, duckdb 1.5.5, overturemaps 1.0.2, shapely 2.1.2, pyproj 3.7.2 on Python 3.11.9.
Generated files were written by each library's or tool's own writer. Downloads are pinned to a
commit SHA in the URL and recorded in `MANIFEST.json` with URL, date, sha256 and byte size.

Loading DuckDB's `spatial` extension installs it under `%USERPROFILE%\.duckdb\extensions\`
(that directory already existed on this machine, holding other extensions); the install writes
outside both the repository and the venv. The GDAL and QGIS runs write nothing outside this
directory.

## Scripts

All of them are re-runnable from this directory with
`..\..\corpus-venv\Scripts\python.exe scripts\<name>.py`.

| Script | What it does |
|---|---|
| `scripts/qgis_env.py` | builds the environment the QGIS-shipped GDAL and `qgis_process` need, without `o4w_env.bat` |
| `scripts/probe_producers.py` | runs the version/driver probes and writes `PROBE.json` |
| `scripts/gen_geopandas.py` | writes the `geopandas/` files |
| `scripts/gen_duckdb.py` | writes the `duckdb-spatial/` files |
| `scripts/gen_gdal.py` | writes the `gdal/` files with `ogr2ogr -f Parquet`; the exact argv is printed and is also in `MANIFEST.json` |
| `scripts/gen_qgis.py` | writes the `qgis/` file with `qgis_process run native:savefeatures`; the exact argv is printed and is also in `MANIFEST.json` |
| `scripts/gen_mutations.py` | derives `mutations/` and writes `mutations/DERIVATIONS.json` |
| `scripts/observe.py` | the observer. Also a CLI: `python scripts/observe.py <file> ...` |
| `scripts/build_manifest.py` | rebuilds `MANIFEST.json`, calling `observe.py` for every entry |

`build_manifest.py` imports `observe.py` rather than repeating it, so the manifest and the CLI
cannot disagree.

## Reading the manifest

`MANIFEST.json` lists, per file: path, `set` (`main` or `mutations`), producer pipeline,
library/tool and version, how it was obtained (command or URL, with date), sha256, byte size, and
the observed facts. Mutation entries additionally carry `derived_from`, `derivation`,
`derivation_parameters` and `observed_difference_from_base`.

The observed facts are: the `geo` metadata version and `creator`, the Parquet footer `created_by`,
primary geometry column and encoding, the shape of the `crs` member (`absent-key` / `null` /
`projjson:<id or name>`), the PROJJSON `coordinate_system.axis[*].name` and `.direction` lists in
file order (`crs_axis_names` / `crs_axis_directions`, `null` where `crs` is absent or null),
whether `covering` is present, whether a `bbox` member is present in the geometry column metadata,
row count, row group count, the full column list with Arrow types, and which columns carry integer
or string Arrow types. That last list names types only — it does not call any column a key, and no
column values were read.

`crs_axis_names` / `crs_axis_directions` are read from the **top-level** `coordinate_system` of the
PROJJSON. For a `ProjectedCRS` that is the projected system's axis list; the `base_crs` axis list is
deliberately not substituted, because the coordinates in the file are in the projected system.
