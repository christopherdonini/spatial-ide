# as-corpora: test datasets and conformance suites for GeoParquet admission (Round 1)

Researcher: Claude (advisor session), 2026-10-08. Clones are under `~/spatial-ide-archaeology/candidates/as-corpora/`. Footers of remote files were range-fetched (footer bytes only, never the data pages) into `as-corpora/_footers/`. Every footer below was decoded with a stdlib-only Thrift-compact reader written for this pass (`scratchpad/scripts/pqmeta.py`, run with `python3 -I`). No candidate code was built or run.

Licence verdicts below are flags, not rulings. Data licences are not code licences: the AGPL core and the ADR-009 layering govern code, while a data file's licence governs whether the file may be **committed to a public repository**, **kept local-only with a pinned hash**, or only **referenced**. The repository's own rules for this decision are in `engine/compat-corpus/LICENCES.md:5-9 @ 4561f3b8` (primary source only; "open" means it appears on the OSI or Open Definition list; a third-party row is `reproducible` only when it is identified and open). This note follows those rules and does not replace them.

---

## 1. Spatial IDE facts relied on (`4561f3b` unless marked)

- **The readable set** is Polygon, MultiPolygon, Point, LineString, MultiLineString (`engine/src/geoarrow.rs:88-94 @ 4561f3b8`). Lines landed in #188 (`PLAN.yaml:2314 @ 4561f3b8` summary).
- **Encoding gate:** `encoding` must be `WKB` (`engine/src/dataset.rs:358-362 @ 4561f3b8`). A GeoParquet 1.1 native (GeoArrow) encoding is refused by name.
- **Open-time gate order** (`engine/src/dataset.rs`):
  1. the `geo` key (`:1054-1064`);
  2. `GeoMeta::parse` (`engine/src/geoparquet.rs:369-466 @ 4561f3b8`);
  3. encoding (`:358`);
  4. `encoding_for_declared_types` (`:368`);
  5. CRS and format semantics (`:399-425`);
  6. the geometry column must be `Binary`, `LargeBinary` or `BinaryView` (`:1835-1860`);
  7. identity (`:550`, `admit_identity` `:1643`).
- **Identity:** a file with no `id` column admits on the session tier (`engine/src/dataset.rs:1666-1694 @ 4561f3b8`). An `id` column that is not an integer is refused, as `engine.identity_unusable` (`engine/src/identity.rs:325-343 @ 4561f3b8`). This is why corpus #12 (Overture, Utf8 `id`) refuses (`engine/ADMISSION-RESULTS.md`, row #12).
- **Covering:**
  - A viewport query with a bbox refuses `NoCoveringBbox` when the file has no usable `covering.bbox` (`engine/src/stream.rs:1477-1479 @ 4561f3b8`).
  - `build_index` and `build_row_group_index` need one too (`engine/src/dataset.rs:734-738 @ 4561f3b8`, `:850-853`).
  - So a file with no covering opens and describes, but does not reach the canvas. MP-1's form says this of #11 (`engine/MULTIPOLYGON-MP1-PREREGISTRATION.md:293 @ 4561f3b8`), and it is why `mp-prime-e2e-covered-fixture` exists (`PLAN.yaml:4176-4192 @ 4561f3b8`).
- **WKB strictness** (`engine/src/wkb.rs`):
  - Z, M and EWKB flags are refused (`:17`, `:30-45`, `:84-86`).
  - An empty LineString, or one with a single position, is refused (`:318-329`).
  - An empty Point (NaN) is refused (`:300-303`).
  - A null geometry fails the stream (`engine/src/stream.rs:2617-2620 @ 4561f3b8`).
- **Pinned spec versions:** GeoParquet `1.0.0` and `1.1.0` only (`engine/src/geoparquet.rs:30-37 @ 4561f3b8`). `2.0.0` is unpinned, so it takes no format rule (R-C1, `engine/ADMISSION-PREREGISTRATION.md:50 @ 4561f3b8`). A 2.0.0 file with a declared, x-first CRS still admits (#11, `engine/ADMISSION-RESULTS.md`).
- **Axis order:**
  - The engine derives the declared order from PROJJSON `coordinate_system.axis` directions plus names (`engine/src/geoparquet.rs:674-724 @ 4561f3b8`).
  - For a pinned version, a declared lat-first order gets the WKB override (`engine/src/geoparquet.rs:508-547 @ 4561f3b8`, `:599-606`, R-C4).
  - The absent key gives OGC:CRS84 by format rule (`:549-566`, R-C2).
  - ADR-032 is **Accepted** 2026-09-23 (`docs/adr/ADR-032-…:5`). The brief called it "pending decision", but the file says Accepted.
  - ADR-032 leaves the GeoArrow export path open: "an external consumer would receive a lat-first definition over an x-first buffer … no GeoArrow export is licensed until it does" (`docs/adr/ADR-032-…:48`).
- **DuckDB configuration:**
  - `SET enable_geoparquet_conversion=false` is applied on every engine connection (`engine/src/pool.rs:185-187 @ 4561f3b8`).
  - The stated reason is that DuckDB's conversion "would put a **second CRS policy** in the path" (`engine/src/pool.rs:168-174 @ 4561f3b8`).
  - The bundled DuckDB is 1.5.5 (`engine/Cargo.toml:39 @ 4561f3b8`, `duckdb = "1.10505.0"`). The duckdb-rs tag `v1.10505.0` pins the `duckdb-sources` submodule at `d8cdaa33fd`, which is the `v1.5.5` tag (`git ls-tree v1.10505.0 crates/libduckdb-sys/`).
- **Rust parquet** is 58.4.0 (`Cargo.lock:1372-1373 @ 4561f3b8`), with features `arrow` and `snap` only (`engine/Cargo.toml:44 @ 4561f3b8`). It is used by `fixture.rs` and `lod.rs`, and not on the admission path.
- **What is never tracked:**
  - Any data file (Parquet, Arrow IPC, GeoJSON, CSV and so on; `engine/CORPUS-REPRODUCIBILITY-PREREGISTRATION.md:65-69 @ 4561f3b8`).
  - The corpus of record is untracked, under `target/fixtures/compat-corpus/`, and only metadata is tracked (`engine/compat-corpus/RECORD.md:7-12 @ 4561f3b8`).
  - The set rules are in `engine/compat-corpus/LICENCES.md:5-9 @ 4561f3b8`.
  - #12 (Overture) was ruled "local-only — fetch-only, never redistributed" (`engine/compat-corpus/LICENCES.md:29 @ 4561f3b8`).
  - GDAL autotest files R-2 to R-4 are "unidentified … local-only", because `autotest/README.md` names no licence (`engine/compat-corpus/LICENCES.md:36-38 @ 4561f3b8`).
- **The corpus has no line file** (`engine/GEOMETRY-LINES-PREREGISTRATION.md:60 @ 4561f3b8`, `:391`; PLAN node `corpus-line-files`, `PLAN.yaml:4210-4226 @ 4561f3b8`). Its MANIFEST records no Parquet logical type: `grep -c -i logical engine/compat-corpus/of-record/MANIFEST.json` returns 0.
- **docs/08:**
  - It defines a Lines class of 1M features / 10M vertices (`docs/08_Testing.md:30 @ 4561f3b8`).
  - Its "Public data" corpus line says "Overture Maps, OSM extracts … real scale, redistributable" (`docs/08_Testing.md:40 @ 4561f3b8`). The word "redistributable" is in tension with the human's #12 ruling. See §5.
- **docs/14:** "Overture and OSM attribution must be preserved in benchmarks, demos, and published bundles" (`docs/14_Governance_and_Licensing.md:27 @ 4561f3b8`).

---

## 2. The sweep

One line per candidate. The commit is the clone's HEAD unless marked.

| # | Project / dataset | Kept? | Why |
|---|---|---|---|
| 1 | `opengeospatial/geoparquet` `test_data/` @ `4c9f87e` (2.0.0) and @ tag `v1.1.0` (`525b8f9`) | **KEPT, shortlist** | Apache-2.0 (`LICENSE`). One tiny file per geometry type, including LineString and MultiLineString. 2.0.0 files carry the native Parquet `GEOMETRY` type. Already the corpus #11 source |
| 2 | `geoarrow/geoarrow-data` @ `e8eaa04` (tag `v0.2.0`) | **KEPT, shortlist** | Real-world lines: ns-water `water-line`, 483,268 LineString Z / MultiLineString Z rows. A full geometry-type × dimension × encoding grid. Paired `_geo.parquet` (GeoParquet) and bare `.parquet` (native `GEOMETRY`) files. EPSG:4326 lat-first PROJJSON files for ADR-032. No repo-level LICENSE; licences are per-dataset in READMEs |
| 3 | `apache/parquet-testing` `data/geospatial/` and `bad_data/` @ `56653c4` | **KEPT, shortlist** | Apache-2.0. The only public conformance set for Parquet `GEOMETRY`/`GEOGRAPHY` with the CRS forms (`srid:`, `projjson:`, inline PROJJSON, default), and GEOGRAPHY lines. `bad_data` holds two GeoParquet 0.1.0 files |
| 4 | Microsoft ML Road Detections, Source Cooperative mirror (`nlebovits/microsoft-ml-road-detections`) | **KEPT, shortlist** | A real-world LineString GeoParquet 1.1.0 with a covering bbox. Per-country partitions from 19 KB (MCO). ODbL-1.0 (Microsoft's `LICENSE`; the STAC `license`) |
| 5 | Overture Maps transportation `segment`, release 2026-09-23.0 | KEPT (reference) | Real-world LineString GeoParquet 1.1.0 with a covering. Utf8 `id`, so refused at identity unless the caller maps one. ODbL theme licence |
| 6 | OSM US Layercake `waterways.parquet` (and `highways`) | KEPT (reference) | LineString, `id` INT64 (a native identity), GeoParquet 1.0.0, **no covering**. ODbL. 8.0 GB single file. Range-read only |
| 7 | Natural Earth (`nvkelso/natural-earth-vector` @ tag `v5.1.2`) | KEPT (as a regeneration input) | Public domain (`LICENSE.md`). Line layers as shapefiles: `ne_50m_rivers_lake_centerlines`, 477 records, 182 multipart, up to 12 parts. No upstream GeoParquet; geoarrow-data's NE files are polygons and points only |
| 8 | GDAL `autotest/ogr/data/parquet` @ `4386ba2` | kept, shortlist (read only) | `gh_14610.parquet` is an Overture-derived LineString written by DuckDB 1.5.2 (ODbL per its own `license` column). The README names no autotest-data licence (as the corpus record already found). The writer and reader code is the axis-order prior art |
| 9 | GDAL `ogr/ogrsf_frmts/parquet` (MIT-style, `LICENSE.TXT`) | kept for Q2/Q4 | Native-type writer defaults and the axis-mapping read path |
| 10 | `duckdb/duckdb` `extension/parquet` @ `v1.5.5` (`d8cdaa3`) | kept for Q2/Q4 | MIT (`LICENSE`). The native `GEOMETRY` read path **ignores `enable_geoparquet_conversion`** (§3 D4). `data/geoparquet/` is a copy of GeoParquet 1.1.0 test data with its own Apache `LICENSE` |
| 11 | `duckdb/duckdb-spatial` @ `eb1e57c` (the corpus's recorded extension) | kept for Q4 | MIT. `geometry_always_xy` defaults to unset, which means "follow the CRS" (lat-first for EPSG:4326) in `ST_Transform`. `test/data/segments.parquet` is a 6-row EPSG:3857-range LineString file with no CRS (unattributed) |
| 12 | `geopandas/geopandas` @ `2c7a442` | kept for Q2/Q4 | BSD-3-Clause (`LICENSE.txt`). Writes GeoParquet 2.0.0 since 1.2.0 (`CHANGELOG.md:36-38`). On read, an absent `crs` becomes `OGC:CRS84` (`geopandas/io/arrow.py:617-624`). `to_crs` uses `always_xy=True` (`geopandas/array.py:1184`). Its test data copies the GeoParquet test_data byte for byte (sha256 equal) |
| 13 | `apache/arrow` C++ @ `apache-arrow-25.0.1` (`beccec0`) | kept for Q2/Q4 | Apache-2.0. `geoarrow.wkb` maps to Parquet `GEOMETRY` from Arrow 21 (`cpp/src/parquet/arrow/schema.cc:479-483` at tag 21.0.0; absent at 20.0.0). **EPSG:4326 PROJJSON is written as an empty Parquet `crs`** (`cpp/src/parquet/geospatial/util_json_internal.cc:47-68`) |
| 14 | `apache/arrow-rs` @ `6c31f41` | kept for Q2 | Apache-2.0. `parquet` 58.4.0 already has `LogicalType::Geometry { crs }` / `Geography` (`parquet/src/basic.rs:297-303` at tag 58.4.0). The `parquet-geospatial` crate (60.0.0 on crates.io) is behind the `geospatial` feature, which the engine does not enable |
| 15 | `apache/parquet-format` @ `bf09939` | kept for Q2/Q4 | Apache-2.0. `GEOMETRY`/`GEOGRAPHY` first appear in tag 2.11.0 (2025-03-21) and are absent at 2.10.0. Geospatial.md's "Coordinate Axis Order" override |
| 16 | `geoarrow/geoarrow` spec @ `6ff51fb` | kept for Q4 | BSD-3-Clause. The axis-order override for GeoArrow (`extension-types.md:76-80`). Relevant to ADR-032's unlicensed GeoArrow export |
| 17 | `apache/arrow-testing` @ `9ff285c` | dropped | Apache-2.0. 138 ClusterFuzz Parquet cases and IPC fuzz cases, none with a `geo` key (`grep -l -a '"primary_column"'` = 0). They exercise DuckDB's Parquet reader, not Spatial IDE's admission. Use only as a "DuckDB refuses, engine maps the error" smoke test, if at all |
| 18 | `planetlabs/gpq` validator @ `a5a6b20` | kept (concept donor) | Apache-2.0. 29 validator cases stored as JSON (`metadata` plus GeoJSON `data`), not Parquet. Covers geometry-type-not-in-list, bad-crs, bad-edges, empty and null geometry. Generate locally |
| 19 | `opengeospatial/geoparquet` `scripts/test_json_schema.py` | kept (concept donor) | 44 invalid and 67 valid `geo`-metadata cases as Python dicts. A ready list of metadata mutations for admission-refusal tests |
| 20 | OvertureMaps/docs `_generated_attribution.mdx` @ `4415e90` | read | The per-theme licence source (§3 D5) |
| 21 | OSS-Fuzz corpora for GDAL / Arrow | dropped | GDAL's `fuzzers/build.sh` has no Parquet target (`git show HEAD:fuzzers/build.sh | grep -i parquet` is empty). Arrow's are already in arrow-testing (#17). Corpora on OSS-Fuzz infrastructure are not public downloads |
| 22 | Source Cooperative in general | partly | Only the road-detections mirror was read in source. Other datasets were not opened: Ordnance Survey NGD boundaries are polygons, and `cholmes/gpio-test` is benchmark material |
| 23 | Esri, Foursquare and other proprietary GeoParquet | dropped | Not openly licensed for redistribution, or not checked |

---

## 3. Dossiers

### D1. `opengeospatial/geoparquet` test_data: the committable line files

- **Repository:** https://github.com/opengeospatial/geoparquet, HEAD `4c9f87e` (2026-09-07), the same commit as corpus #11's pin. Tag `v1.1.0` resolves to `525b8f9`.
- **Licence:** Apache-2.0, from `LICENSE` at both commits. There is no `NOTICE` (the corpus record already shows it 404s; `engine/compat-corpus/LICENCES.md:62 @ 4561f3b8`). The test files carry no headers. Green.
- **Activity:** tags `v1.0.0`, `v1.1.0`, `v1.1.0+p1`, `v2.0.0-rc.1`. There is no `v2.0.0` tag yet (`git ls-remote --tags`). CI: `.github/workflows/{lint,release,scripts}.yml`.

**Files that matter.** Footers were decoded in this pass. Sizes are bytes.

| file @ commit | bytes | sha256 (first 16) | geo.version | types | CRS | covering | Parquet logical type | writer |
|---|---|---|---|---|---|---|---|---|
| `test_data/data-linestring-encoding_wkb.parquet` @ 4c9f87e | 1,376 | b4bede051154e39d | 2.0.0 | [LineString] | key absent | no | **GEOMETRY** (crs unset); row-group geostats types=[2] | parquet-cpp-arrow 23.0.1 |
| `test_data/data-multilinestring-encoding_wkb.parquet` @ 4c9f87e | 1,446 | b9552229b7cad4f9 | 2.0.0 | [MultiLineString] | absent | no | GEOMETRY, types=[5] | 23.0.1 |
| `…point/polygon/multipoint/multipolygon…_wkb.parquet` @ 4c9f87e | 1,359–1,545 | (in clone) | 2.0.0 | one each | absent | no | GEOMETRY | 23.0.1 |
| `test_data/data-linestring-encoding_wkb.parquet` @ v1.1.0 | 1,474 | 62782079d405bf91 | 1.1.0 | [LineString] | absent | no | none (plain BYTE_ARRAY) | parquet-cpp-arrow 15.0.2 |
| `test_data/data-multilinestring-encoding_wkb.parquet` @ v1.1.0 | 1,805 | d651bb7a538a8950 | 1.1.0 | [MultiLineString] | absent | no | none | 15.0.2 |
| `test_data/data-*-encoding_native.parquet` @ v1.1.0 | 1,835–2,421 | | 1.1.0 | one each | absent | no | struct/list GeoArrow | 15.0.2 |
| `examples/example.parquet` @ 4c9f87e (= corpus #11) | 28,438 | ff90b4800d71b94c | 2.0.0 | [Polygon, MultiPolygon] | PROJJSON OGC:CRS84 | no | **GEOMETRY** (crs unset) | 23.0.1 |
| `examples/example.parquet` @ v1.1.0 | 29,834 | f3e4bf0b0376904f | 1.1.0 | [Polygon, MultiPolygon] | PROJJSON OGC:CRS84 | **yes** (`bbox` struct) | none | 12.0.0 |

**Row content** is from the CSV twins (`test_data/data-*-wkt.csv`) and the generator (`test_data/generate_test_data.py:71-118`):
- LineString: `LINESTRING (30 10, 10 30, 40 40)`, `LINESTRING EMPTY`, NULL.
- MultiLineString: one 1-part row, one 2-part row, `MULTILINESTRING EMPTY`, NULL.

**Why it matters for Spatial IDE:**
1. These are the smallest openly licensed LineString and MultiLineString GeoParquet files in existence, and they come from the specification's own repository.
2. Under the engine's strict decode (§1), each file is a **predictable refusal test**:
   - It opens: the version is unpinned for 2.0.0, and absent for 1.1.0 (CRS84 by format rule).
   - It admits LineString or MultiLineString.
   - The stream then refuses by name at row 1 (the EMPTY linestring, `engine/src/wkb.rs:324-328 @ 4561f3b8`), or at row 2 (the NULL, `engine/src/stream.rs:2618-2620 @ 4561f3b8`).

   That is exactly ADR-034's "never silently dropped" rule (Decision 4) on a real producer's bytes. Inference: not run. The prediction is for the human's preregistration.
3. Corpus #11's twin `example.parquet` @ 4c9f87e **already carries the Parquet `GEOMETRY` logical type**. The corpus never recorded this: its MANIFEST has no logical-type field, because the probe read pyarrow's Arrow schema (`MANIFEST.json` `read_with`). That fact matters for D4.
4. The v1.1.0 `example.parquet` is the covered twin of #11. Its rows are Natural Earth lowres countries (`geoparquet/scripts/generate_example.py:21` at v1.1.0).

**What not to reuse.** These files are **not "real-world"** in PLAN's sense ("so that line admission is tried on a real-world file", `PLAN.yaml:4211 @ 4561f3b8`). They are synthetic, 3–5 rows, coordinates 10–45, with no CRS and no covering. They are conformance fixtures, not field data.

**Licence implications.** Apache-2.0 data in an AGPL repository is fine. Redistribution owes §4: the licence text, plus retaining notices. There is no NOTICE file.
- **Mode: committable.** It fits the repository's `reproducible — by fetch` set, as #11 does. Per the preregistration the repository commits **no** data file (`engine/CORPUS-REPRODUCIBILITY-PREREGISTRATION.md:65-66 @ 4561f3b8`), so in practice it is "fetch by commit-pinned URL and sha256", exactly like #11.

**Reuse mode: ADOPT** (as corpus entries, by commit-pinned URL). Avoided work: small. Timing: before `corpus-line-files` is preregistered.

**Recommendation.** Add `data-linestring-encoding_wkb.parquet` and `data-multilinestring-encoding_wkb.parquet` at **both** `v1.1.0` (pinned version, no logical type) and `4c9f87e` (2.0.0, native `GEOMETRY`) as four refusal or conformance rows. Do not count them as the "real-world" line file.

### D2. `geoarrow/geoarrow-data`: real-world lines, the EPSG:4326 lat-first files, and paired native-type files

- **Repository:** https://github.com/geoarrow/geoarrow-data, HEAD `e8eaa04` = tag `v0.2.0` (2025-04-30). There is no CI workflow and no repo-level LICENSE file. **Licence is per-dataset**, stated only in each `*/README.md`.
- **Manifest:** `manifest.json` lists 6 groups. Each file entry has only `name`, `format` and `url`: no sha256, no size, no licence.

| group | files | geometry | formats in manifest |
|---|---|---|---|
| example | 257 | every type × {xy, z, m, zm}, plus collections | tsv, arrows (wkt/wkb/native/interleaved), parquet, geoparquet, geoparquet/native |
| example-crs | 22 | Vermont polygon in 7 CRS forms | arrows/wkb, fgb, geoparquet, parquet |
| natural-earth | 28 | cities (Point), countries (MultiPolygon/Polygon), countries-bounds, countries-geography | all |
| quadrangles | 8 | 100k USGS sheets (Polygon) | all |
| ns-water | 42 | elevation, land-poly, water-junc, **water-line**, water-point, water-poly | all; release assets |
| microsoft-buildings | 7 | point | all; release asset |

**Per-dataset licence, verbatim from the dataset READMEs at `e8eaa04`:**
- natural-earth and example-crs: *"All versions of Natural Earth map data redistributed here are in the public domain."* The source is `natural-earth/README.md` and `example-crs/README.md`; Natural Earth's own `LICENSE.md` says "Everything here is public domain."
- ns-water: *"obtained under an Unrestricted Data Use License Agreement for Government Geographic Data as specified by the Province of Nova Scotia Geospatial Data Directory"* (`ns-water/README.md`). That agreement's text was **not fetched**; it is the primary source, and it is unverified here.
- quadrangles: *"redistributable without a Value-Added Software Application … with proper metadata and source/copyright attribution to the United States Geological Survey (USGS)"* (`quadrangles/README.md`, obtained from ESRI). This reads as conditional and source-available-like, so it is **red until counsel**.
- microsoft-buildings: ODbL (`microsoft-buildings/README.md`).
- example: no data licence is stated. The README says the files are "based on the wk R package's `wk::wk_example_wkt`". wk is MIT (`paleolimbot/wk` `DESCRIPTION`: "MIT + file LICENSE"). Toy WKT. **Unidentified** under the repository's rule, because no primary source names a licence for the files.

**Files that matter.** All footers below were decoded in this pass. ns-water was range-read.

| file | bytes | rows | geo | types | CRS (axes) | covering | logical type | writer |
|---|---|---|---|---|---|---|---|---|
| `ns-water_water-line_geo.parquet` (release v0.2.0) | 303,754,383 | 483,268 | 1.0.0 | [LineString Z, MultiLineString Z] | CompoundCRS PROJJSON (NAD83(CSRS) UTM 20 + CGVD2013 height), no id | no | none | parquet-cpp-arrow 19.0.0 |
| `ns-water_water-line.parquet` | 305,038,119 | 483,268 | — | geostats [1002, 1005] | GEOMETRY crs = the CompoundCRS PROJJSON | — | **GEOMETRY** | parquet-cpp-arrow 21.0.0-SNAPSHOT |
| `ns-water_water-junc_geo.parquet` | 12,331,692 | 309,188 | 1.0.0 | [Point Z] | the same CompoundCRS | no | none | 19.0.0 |
| `natural-earth_countries_geo.parquet` | 186,590 | 177 | 1.0.0 | [MultiPolygon, Polygon] | **EPSG:4326, axes [north, east]** | no | none | 19.0.0 |
| `natural-earth_cities_geo.parquet` | 17,322 | 243 | 1.0.0 | [Point] | **EPSG:4326 [north, east]** | no | none | 19.0.0 |
| `example-crs_vermont-4326_geo.parquet` | 6,977 | 1 | 1.0.0 | [Polygon] | **EPSG:4326 [north, east]** | no | none | 19.0.0 |
| `example-crs_vermont-4326.parquet` | 748 | 1 | — | — | GEOMETRY crs **unset** (= CRS84) | — | **GEOMETRY** | 21.0.0-SNAPSHOT |
| `example-crs_vermont-utm_geo.parquet` | 9,951 | 1 | 1.0.0 | [Polygon] | EPSG:32618 [east, north] | no | none | 19.0.0 |
| `example-crs_vermont-custom.parquet` | 2,015 | 1 | — | — | GEOMETRY crs = inline PROJJSON, no id | — | GEOMETRY | 21.0.0-SNAPSHOT |
| `example-crs_vermont-crs84-wkt2.parquet` | 1,603 | 1 | — | — | GEOMETRY crs = **WKT2 string** | — | GEOMETRY | 21.0.0-SNAPSHOT |
| `example/files/example_linestring_geo.parquet` | 1,446 | 4 | 1.0.0 | [LineString] | **`crs: null`** (explicit) | no | none | 19.0.0 |
| `example/files/example_multilinestring_geo.parquet` | 1,778 | 4 | 1.0.0 | [MultiLineString] | `crs: null` | no | none | 19.0.0 |
| `example/files/example_linestring-z_geo.parquet` etc. | ~1.5 KB | 4 | 1.0.0 | [LineString Z/M/ZM] | null | no | none | 19.0.0 |
| `natural-earth_*_native.parquet`, `quadrangles_100k_native.parquet` | | | 1.1.0 | `enc=multipolygon/point/polygon`, types [] | | no | struct | 19.0.0 |

**Why it matters:**
1. **`ns-water_water-line` is the only real-world, government-sourced line GeoParquet I found with an apparently permissive licence.** Spatial IDE would still refuse it today, in two places:
   - **Z on every row.** It declares `LineString Z` and `MultiLineString Z`, and the engine's readable set has no `… Z` names, so it is refused at open as `engine.geo_metadata` (inference from `engine/src/geoarrow.rs:88-94 @ 4561f3b8` and ADR-034 Decision 7; not run).
   - **A CompoundCRS PROJJSON.** `axis_order_from_projjson` reads top-level `coordinate_system.axis`, which a CompoundCRS lacks, so it would be refused `AxisOrderUnestablished` if it got that far. That is inference from `engine/src/geoparquet.rs:675-681 @ 4561f3b8`; the actual first refusal depends on gate order, so record it at P4.

   Either way it is a **real-world refusal row**: useful, but not "line admission tried on a real file".
2. **The EPSG:4326 [north, east] files are real producer output for ADR-032's rule.** `natural-earth_countries_geo` and `vermont-4326_geo` were written by geoarrow-pyarrow / pyarrow 19 with lon/lat WKB, which the README states explicitly (`example-crs/README.md`: "the GeoArrow and GeoParquet standards requires that consumers and producers write longitude, latitude").
   - geo.version is `1.0.0`, which is pinned, so R-C4 applies and they should admit with `axis:format-override`.
   - `countries_geo`'s bbox `[-180, -90, 180, 83.6]` is the R-S2 conviction check's mirror image: x spans ±180 while declared lat-first. A naive declared-order reading would put "latitude" at ±180 and would be convicted.
   - These are the second and third producers, after geopandas #3, to exercise R-C4. Prediction only; not run.
3. **`example-crs` gives a ready CRS-form matrix** for native `GEOMETRY` CRS strings (unset, inline PROJJSON, WKT2). The engine does not read these today (D4).
4. **The `_geo.parquet` / bare `.parquet` pairs carry the same rows**, one as GeoParquet 1.0 and one as native `GEOMETRY` (`collect_parquet_builtin.py:28-44`, written with `store_schema=False`, so no `geo` key and no Arrow schema). Each bare file is a **"no `geo` key" refusal** (`engine.geo_metadata`, `engine/src/dataset.rs:1061-1063 @ 4561f3b8`) on a file that DuckDB would nonetheless read as geometry (D4).

**What not to reuse:**
- `quadrangles`: red licence.
- `microsoft-buildings`: 1.6 GB, points, ODbL.
- `*_native.parquet` beyond one refusal row: the engine refuses non-WKB encodings by name, so one native file proves that.

**Licence implications:**
- **natural-earth / example-crs:** public domain by the source's statement. The repository's rule needs the licence to be "named" on the OSI or Open Definition list. The Open Definition list names CC0-1.0 and PDDL-1.0, not "public domain" as such (`opendefinition.org/licenses`, read 2026-10-08). So under `engine/compat-corpus/LICENCES.md:8 @ 4561f3b8` a public-domain statement is **identified but not "open" by the letter of the rule**. This is a question for the human, not a ruling here. The likely mode is **reproducible — by fetch**, if the human reads public domain as open; otherwise **local-only**.
- **ns-water:** **local-only with a pinned hash** until the Nova Scotia agreement is fetched as a primary source. Its size (≈304 MB) argues local-only regardless.
- **example (wk-based):** unidentified, so local-only, or **regenerate** a project-owned twin, which matches the corpus's "by regeneration" class.

**Reuse mode: ADOPT** (natural-earth and example-crs EPSG:4326 files, as ADR-032 producer evidence); **BENCHMARK AGAINST** (ns-water water-line, as a refusal row and a future Lines-class candidate). Avoided work: moderate. Timing: before `corpus-line-files` and any ADR-032 follow-up (ADR-015 Amendment 1).

### D3. `apache/parquet-testing` `data/geospatial/`: the native GEOMETRY/GEOGRAPHY conformance set

- **Repository:** https://github.com/apache/parquet-testing, HEAD `56653c4` (2026-09-15).
- **Licence:** Apache-2.0 (`LICENSE.txt`; each README and generator carries the ASF header). There is no NOTICE at the root. Green.
- **No CI.** It is a test-data submodule used by Arrow C++, arrow-rs (vendored as `arrow-rs/parquet-testing`), DuckDB and GDAL. GDAL copies three files into `autotest/ogr/data/parquet/parquet_testing_geospatial/`, with the README "Provenance of those files: https://github.com/apache/parquet-testing/tree/master/data/geospatial".

**Files** (footers decoded in this pass; README `data/geospatial/README.md` describes each):

| file | bytes | rows | logical type, `crs` | contents | writer |
|---|---|---|---|---|---|
| `geospatial.parquet` | 48,364 | 196 / 31 row groups | GEOMETRY, crs unset | every type × XY/Z/M/ZM, per row group; geostats types | parquet-cpp-arrow 20.0.0-SNAPSHOT |
| `geospatial-with-nan.parquet` | 1,111 | 3 | GEOMETRY | a LINESTRING with NaN in all dims; geostats types [3001, 3002] | same |
| `crs-default.parquet` | 15,944 | 1 | GEOMETRY, crs unset | Wyoming polygon, lon/lat | same |
| `crs-geography.parquet` | 15,903 | 1 | **GEOGRAPHY**, crs unset, algorithm unset | same polygon | same |
| `crs-projjson.parquet` | 15,417 | 1 | GEOMETRY, crs = `projjson:projjson_epsg_5070` (+ KV key) | EPSG:5070 metres | same |
| `crs-srid.parquet` | 12,559 | 1 | GEOMETRY, crs = `srid:5070` | EPSG:5070 | same |
| `crs-arbitrary-value.parquet` | 14,867 | 1 | GEOMETRY, crs = inline PROJJSON (EPSG:5070) | EPSG:5070 | same |
| `geography-lines.parquet` | 35,622 | 499 / 50 rgs | **GEOGRAPHY SPHERICAL**, `id` INT64 | **lines** crossing poles and the antimeridian; geostats wraparound | datafusion 52.5.0 |
| `geography-points.parquet` / `-polygons.parquet` | 33,026 / 59,910 | 500 | GEOGRAPHY SPHERICAL | | datafusion 52.5.0 |

**None of these files carries a `geo` key.** Spatial IDE therefore refuses every one at its first gate today (`engine.geo_metadata`, "carries no `geo` key: it is a parquet file, but not a GeoParquet file", `engine/src/dataset.rs:1061-1063 @ 4561f3b8`). That refusal is correct by the current contract. The point is that DuckDB, the engine's own reader, would read them as geometry (D4).

`bad_data/`:
- 8 files, 244 KB. README entries are bug reproductions for Arrow C++ / arrow-rs.
- `ARROW-GH-41317.parquet` and `ARROW-GH-41321.parquet` (72,995 bytes each) are **corrupted GeoParquet 0.1.0 files**: a `geo` key, WKT2 CRS, written by parquet-cpp-arrow 11.0.0. They differ from GDAL's `autotest/ogr/data/parquet/test.parquet` (same size) in 15 and 13 bytes (`cmp -l`).
- Through `read_kv_metadata` (`engine/src/dataset.rs:1067 @ 4561f3b8`) they reach `GeoMeta::parse` and refuse at the `"crs"` string (a 0.1.0 WKT string becomes `ExplicitNull`, then `CrsUndeclared`), or earlier on version. Inference; record at P4.
- They would be mutation rows **with a third-party origin**: the corpus's M-rows are all project-generated today.

**Why it matters:**
1. This is the **only public conformance set** for Parquet format ≥ 2.11 geospatial types, and the only place `GEOGRAPHY` lines exist as test data.
2. It holds the full CRS-string grammar (unset, `srid:`, `projjson:<key>`, inline) that GeoParquet 2.0's reader MUST/SHOULD rules cover (`geoparquet/format-specs/geoparquet.md:77-103` at 4c9f87e).

**Licence implications.** Apache-2.0 data. **Committable**; `reproducible — by fetch` at a commit-pinned URL. It owes Apache-2.0 §4 if redistributed.

**Reuse mode: ADOPT** (as refusal rows now; as admission rows if and when the human widens admission to native types). Avoided work: moderate. These files encode edge cases (pole, antimeridian wraparound, NaN statistics, `srid:`) that would be laborious to author correctly. Timing: before any piece that reads the Parquet logical type. Today, put them in the corpus as **refusal-by-name rows** so that a later DuckDB bump that changes behaviour is observed.

### D4. The native-type path is read by DuckDB whatever `enable_geoparquet_conversion` says (DuckDB v1.5.5, MIT)

- **Repository:** `duckdb/duckdb` @ `v1.5.5` (`d8cdaa3`), the exact sources libduckdb-sys 1.10505.0 vendors. Sparse clone of `extension/parquet`, `src/common/arrow`, `src/common/types`, `src/main`.
- **Licence:** MIT (`LICENSE`, "Copyright 2018-2025 Stichting DuckDB Foundation"). Green.

**How it works (code, not docs):**
- `GeoParquetFileMetadata::TryRead` returns `nullptr` when `enable_geoparquet_conversion` is false (`extension/parquet/parquet_geometry.cpp:30-32`, `:344-354`). That is the only use of the setting on the read side.
- `IsGeometryType`, however, checks the **Parquet logical type first** and returns true for `GEOMETRY` or `GEOGRAPHY`, with no reference to the setting (`extension/parquet/parquet_reader.cpp:488-512`). Only the GeoParquet-`geo` branch (`:514-527`) depends on `geo_metadata`, which the setting nulls.
- When true, the column is wrapped as `LogicalType::GEOMETRY(crs)` and decoded through `ST_GeomFromWKB` (`parquet_reader.cpp:586-614`; `parquet_geometry.cpp:368-386`). `Geometry::FromBinary(…, strict=true)` (`src/common/types/geometry.cpp:1038-1063`):
  - **rewrites big-endian or EWKB input to little-endian ISO WKB, dropping any SRID** (`ConvertWKB`, `:955-1000`);
  - throws on an unknown type.
- On Arrow export, `GEOMETRY` has no alias (`src/common/types.cpp:1936-1947`; `HasAlias` false), so `SetArrowFormat` falls to `default:`, then `SetArrowExtension` (`src/common/arrow/arrow_converter.cpp:401-406`). The registered `geoarrow.wkb` extension (`arrow_type_extension.cpp:587-590`) then sets:
  - `ARROW:extension:name = geoarrow.wkb`;
  - `ARROW:extension:metadata` with a `crs` (PROJJSON, else WKT2, else auth code, else srid; `:462-516`).
  - The storage is `z` (Binary) at the default `arrow_output_version` 1.0 (`:552-560`; default `"1.0"`, `src/include/duckdb/main/settings.hpp:282` at v1.5.5).
- The writer:
  - writes `GEOMETRY` unless `geoparquet_version` is `V1` (`parquet_writer.cpp:434`, `:266-285`);
  - writes `geo` metadata `"version": "1.0.0"` for V1 and BOTH, and `"2.0.0"` for V2 (`parquet_geometry.cpp:249-256`);
  - the default is `V1` (`parquet_extension.cpp:100`).
  - The binder error text lists only "'NONE', 'V1' or 'BOTH'" although `V2` is accepted (`:318-329`).

**Consequence for Spatial IDE.** This is inference from code, not run.
1. A Parquet file whose geometry column carries the `GEOMETRY` logical type reaches the engine's `probe_schema` (`engine/src/dataset.rs:1100-1112 @ 4561f3b8`) as an Arrow `Binary` field **with `geoarrow.wkb` extension metadata and DuckDB's own CRS reading**. Its WKB has been through DuckDB's normaliser.
2. `check_geometry_column` (`engine/src/dataset.rs:1852-1860 @ 4561f3b8`) and `binary_value` (`engine/src/stream.rs:2617-2630 @ 4561f3b8`) accept Binary regardless of field metadata. So such a file **admits through the `geo`-key path while DuckDB has already applied its own geometry decode**.
3. This includes **corpus #11 at its pinned commit**, which carries `GEOMETRY` (D1) and admits today.
4. Effects:
   - Big-endian and EWKB bytes are normalised before the engine's strict decoder sees them. The engine's EWKB refusal (`engine/src/wkb.rs:84-86 @ 4561f3b8`) and mixed-byte-order behaviour are **not exercised** for such files, which contradicts the strict-decode intent.
   - `engine/src/pool.rs:168-174 @ 4561f3b8`'s claim that the setting keeps "a second CRS policy" out of the path does not hold for this file class: DuckDB identifies the CRS (`CoordinateReferenceSystem::TryIdentify`, `parquet_reader.cpp:598-604`) and attaches it to the Arrow field. The engine does not appear to read that field metadata (no `ARROW:extension` read on the admission path; `rg "geoarrow.wkb" engine/src` finds nothing). So the effect is **latent**, and real only for the WKB normalisation.
   - A possible user-visible change:
     - `ST_GeomFromWKB` in strict mode **throws** on an unknown type code, e.g. a curve type. Such a file would fail inside DuckDB's scan rather than at `engine.wkb`.
     - DuckDB's `AnalyzeWKB` **accepts** Z/M/ZM. The engine's decoder still refuses them after normalisation, because the Z flag survives as ISO 1000/2000 codes (`geometry.cpp:974-976`).
   - Not verified by running; a probe test is owed.

**Spatial IDE should treat this as a finding for the engine owner, not a corpus decision.** The corpus implication is concrete: add one native-`GEOMETRY` file with big-endian or EWKB rows, and one without a `geo` key, so that the behaviour is pinned by a P4 row.
- No public file with big-endian WKB under `GEOMETRY` was found; it would have to be project-generated.
- parquet-testing's `crs-*` files cover the no-`geo` case.

**Reuse mode: WATCH** (DuckDB's native-type path) and **CONCEPTUAL DONOR** (its CRS-string handling, if native types are ever admitted). Avoided work: n/a (a hazard finding). Timing: now. It touches files the corpus already admits.

### D5. Overture, OSM-derived and Microsoft road lines: real-world line files and their licences

**Overture transportation.**
- **Licence:** `OvertureMaps/docs` @ `4415e90` (2026-10-07) `OvertureMaps/docs/docs/_generated_attribution.mdx:344-349`: Transportation is "**License for theme:** ODbL", with sources "© OpenStreetMap contributors. Available under the Open Database License" and "Data from TomTom". TomTom is listed without a licence.
- The same file gives:
  - Base, Buildings and Divisions: ODbL (`:289`, `:302`, `:318`);
  - Places: no theme line, with sources under CDLA-Permissive-2.0, Apache-2.0 (Foursquare, with a NOTICE) and CC0 (`:328-341`);
  - Addresses: mixed permissive, per source (`:5`).
- **So the brief's "CDLA-Permissive-2.0 vs ODbL" split is: Places is CDLA/Apache/CC0; every geometry theme with lines (transportation) is ODbL.**
- **File** (range-read footer): `release/2026-09-23.0/theme=transportation/type=segment/part-00000-…zstd.parquet` on `overturemaps-us-west-2`.
  - 474,953,760 bytes, 2,738,669 rows, 128 row groups.
  - geo `1.1.0`, `[LineString]`, crs absent, covering `bbox` struct.
  - `id` Utf8; writer parquet-cpp-arrow 17.0.0.
  - No Parquet logical type.
- **Spatial IDE outcome** (inference): opens through R-C2 (CRS84), then **refuses `engine.identity_unusable`** on the Utf8 `id`, as #12 did (`ADMISSION-RESULTS.md` #12). A caller-declared mapping cannot help, because no integer column exists in the segment schema except nested ones. Not checked exhaustively.
- GDAL's `gh_14610.parquet` (15,854 bytes, 4 rows, LineString, DuckDB v1.5.2) is an Overture segment extract. Its `sources.license` column contains `ODbL-1.0` (`strings`). It inherits ODbL and Overture attribution, whatever GDAL's README says.

**OSM US Layercake.**
- **Licence:** `https://layercake.openstreetmap.us/layers/`: "Data is © OpenStreetMap contributors, available under the Open Database License." ODbL.
- **File:** `waterways.parquet` (range-read): 8,036,771,319 bytes, 39,308,138 rows, 320 row groups.
  - geo `1.0.0`, `[LineString]`, crs absent, **no covering**.
  - `id` **INT64** (a native identity candidate).
  - Writer DuckDB v1.5.5 (d8cdaa33fd), the same DuckDB build as the engine's. last-modified 2026-10-04; there are no versioned URLs, so the file changes underfoot.
- **Spatial IDE outcome** (inference): opens through R-C2; identity native, R-I1, which means a full verification scan over 39M rows; viewport refuses `NoCoveringBbox`. Too large, unversioned, and canvas-blocked.

**Microsoft ML Road Detections** (Source Cooperative mirror, `nlebovits/microsoft-ml-road-detections`):
- **Licence:**
  - Microsoft `RoadDetections/LICENSE`: "Data in this repository has been licensed by Microsoft under the Open Data Commons Open Database License (ODbL)."
  - The mirror's STAC `collection.json` says `"license": "ODbL-1.0"`.
  - Its `catalog.json` names Microsoft as producer and licensor, and the mirror as processor.
- **Files:** `road-detections/by_country/country=XXX/XXX.parquet`, 235 partitions, about 12 GB. Range-read examples:
  - `MCO.parquet`: 19,402 bytes, 367 rows.
  - `LIE.parquet`: 258,521 bytes, 5,437 rows.
  - `AND`: 197,539 bytes. `SMR`: 171,335 bytes. `CHE`: 33,669,880 bytes.
- **Each partition:**
  - geo `1.1.0`, `[LineString]`, crs absent, **covering `bbox` struct present**;
  - no `id` column, so session-ordinal;
  - ZSTD; writer parquet-cpp-arrow 21.0.0;
  - WKB little-endian, LineString with 2–12 points (MCO stats min/max).
- **Spatial IDE outcome** (inference, not run):
  - opens through R-C2 (CRS84 default, version 1.1.0 pinned);
  - LineString gives `geoarrow.linestring`;
  - identity is session-ordinal;
  - a covering exists, so the viewport works;
  - publish refuses (degrees, `GeographicCrsNotPublishable`).
  - Of every candidate found, **this is the only real-world file predicted to reach the canvas as a line layer.** That depends on its rows having no EMPTY or NULL geometries; the statistics show `nulls=0` on geometry for MCO.

**ODbL and what it means for a test corpus.** The text was read at `opendatacommons.org/licenses/odbl/1-0/` on 2026-10-08, via WebFetch summary; it should be re-read from the primary text before relying on it.
- Committing an extract to a **public** repository is "Publicly Convey[ing]" a Derivative Database (§4.2). That owes:
  - a copy of the licence;
  - the notices kept intact;
  - ODbL share-alike on the extract (§4.4);
  - an offer of the machine-readable derivative (§4.6).
- Share-alike attaches to the **database**, not to the code that reads it. The AGPL code is not affected; that is a reading for counsel.
- Keeping the file local-only, as #12 is, is internal use (§4.5), which owes nothing to the public. It still owes nothing to docs/14 until a benchmark, demo or bundle is **published**, and then the attribution "© OpenStreetMap contributors" (and "Overture Maps Foundation" for Overture) must ride along (`docs/14_Governance_and_Licensing.md:27 @ 4561f3b8`).
- The human already ruled #12 "local-only — fetch-only, never redistributed" (`engine/compat-corpus/LICENCES.md:29 @ 4561f3b8`), with every licence the source names listed. The same treatment fits all three ODbL sources.

**Mode:**
- MS Roads (one small partition, e.g. MCO or LIE): **local-only with a pinned sha256**, fetched by URL. It owes ODbL attribution to Microsoft only if published.
- Overture segment: **reference only**. It refuses on identity, and is 475 MB per part.
- Layercake: **reference only**. Unversioned, 8 GB.

**Caveat on pinning:** the Source Cooperative object is not versioned; its ETag is the only change signal (`MCO`: `a832c00f5e9e3b1cc67803883417cdf2`, last-modified 2026-08-14T14:47:16Z). The corpus pins by sha256, so a changed upstream file is detected and refused by `tools/corpus/fetch-verify.mjs`'s rule. It can never be re-fetched, though. The same "release availability not checked" caveat as #12 applies (`engine/compat-corpus/RECORD.md:32 @ 4561f3b8`).

**Reuse mode: ADOPT** (MS Roads MCO or LIE as the `corpus-line-files` real-world entry, local-only); **REJECT** for commit (all ODbL). Avoided work: moderate. Timing: before `corpus-line-files`.

### D6. Axis-order prior art for ADR-032 (code paths read)

| implementation | read path (EPSG:4326 / lat-first PROJJSON in GeoParquet) | write path | file:line |
|---|---|---|---|
| **GDAL Parquet** (MIT-style) | Every SRS built from GeoParquet or Parquet CRS gets `SetAxisMappingStrategy(OAMS_TRADITIONAL_GIS_ORDER)`: data is x,y regardless of the definition, and the definition is kept unchanged on the layer. An absent `crs` gives `importFromEPSG(4326)` + traditional order. For a native type, `OGC:CRS84` is replaced by `EPSG:4326` + traditional order; `srid:N` → `EPSG:N` | `IdentifyCRS` matches with `IGNORE_DATA_AXIS_TO_SRS_AXIS_MAPPING=YES`. EPSG:4326 / CRS84 **omitted** by default (`OGR_PARQUET_CRS_OMIT_IF_WGS84=YES`), so #8 had an absent `crs` | `gdal/ogr/ogrsf_frmts/parquet/ogrparquetlayer.cpp:490-524`, `:620-690`, `:826-829`; `ogrparquetwriterlayer.cpp:640-662`; `arrow_common/ograrrowwriterlayer.hpp:145-175` @ `4386ba2` |
| **geopandas** (BSD-3) | An absent `crs` gives `"OGC:CRS84"`; otherwise the PROJJSON is passed to `from_wkb(…, crs=crs)` unchanged, with no axis action. The geometry stays x,y | `series.crs.to_json_dict()` verbatim (EPSG:4326 written lat-first, as #3 shows) | `geopandas/io/arrow.py:163-170`, `:617-624`; `array.py:1184` (`always_xy=True` in `to_crs`) @ `2c7a442` |
| **DuckDB core parquet** (MIT) | Native `GEOMETRY` crs, or geo PROJJSON, is identified (`TryIdentify`: AUTH:CODE first) and **attached to the type**; no axis action on WKB. An absent `crs` gives the OGC:CRS84 PROJJSON | `OGC:CRS84` not written; otherwise PROJJSON | `extension/parquet/parquet_geometry.cpp:113-138`, `:160-189`; `src/common/types/geometry_crs.cpp:732-762` @ `d8cdaa3` |
| **duckdb-spatial `ST_Transform`** (MIT) | `geometry_always_xy` defaults to **unset**, which means `false`: **follow the CRS axis order** (EPSG:4326 = lat,lon), and log a warning that this will change. `true` → `proj_normalize_for_visualization` | n/a | `src/spatial/spatial_settings.cpp:18-27`, `:49-52`; `src/spatial/modules/proj/proj_module.cpp:170-205`, `:380-392` @ `eb1e57c` |
| **Arrow C++ → Parquet native** (Apache-2.0) | n/a | GeoArrow `crs` that is EPSG:4326 or OGC:CRS84 (string or PROJJSON `id`) gives an **empty Parquet `crs`**, i.e. CRS84 by Parquet default, so the lat-first definition is discarded on purpose | `cpp/src/parquet/geospatial/util_json_internal.cc:36-68` @ `apache-arrow-25.0.1` |
| **GeoParquet spec** | "always (x, y) … explicitly overrides the axis order as specified in the CRS" (2.0.0 `format-specs/geoparquet.md:117-119`; 1.1.0 pinned in-tree). 2.0.0 adds "EPSG:4326 and OGC:CRS84 are equivalent with respect to this specification" (`:301`) | | @ `4c9f87e` |
| **Parquet format** | "Coordinate Axis Order … always (x, y) … explicitly overrides the axis order as specified in the CRS" (`Geospatial.md`, last section); `GEOMETRY` `crs` unset = OGC:CRS84 (`LogicalTypes.md:631-644`) | | @ `bf09939`; present from tag 2.11.0 |
| **GeoArrow spec** (BSD-3) | "regardless of the axis order specified by the CRS … axis order is always (longitude, latitude) and (easting, northing)" | | `extension-types.md:76-80` @ `6ff51fb` |

**What it says to ADR-032.**
1. Every *reader* above treats WKB as x,y and keeps the declared definition unchanged. That is ADR-032 Decision 3's position.
2. GDAL is closest to ADR-032's shape. It stores the definition as declared and records the data-to-CRS axis mapping separately (`OAMS_TRADITIONAL_GIS_ORDER`), which is ADR-032's "declared order retained … data order established by the reader".
3. The **writers disagree** on what they emit for 4326:
   - GDAL omits the `crs`, which turns a declared EPSG:4326 into an absent key, then CRS84 by default (#8).
   - geopandas writes lat-first PROJJSON (#3).
   - Arrow C++ drops it to an empty native `crs`.

   So "declared EPSG:4326" will reach Spatial IDE in three shapes. Only geopandas' shape reaches R-C4.
4. **duckdb-spatial is the outlier.** `ST_Transform` follows the definition unless told otherwise. This matters only if Spatial IDE ever lets DuckDB transform; it does not (ADR-032: "Neither licenses reprojection").
5. For ADR-032's open **GeoArrow export** item (`ADR-032:48`), Arrow C++'s rule and the GeoArrow spec's override are the two pinned readings that would close it. Fetching and pinning `geoarrow/geoarrow` `extension-types.md` at `6ff51fb` (BSD-3-Clause, `LICENSE`) is the minimal step.

**Reuse mode: CONCEPTUAL DONOR** (GDAL's definition-plus-mapping split; the GeoArrow spec text for the export reading). Licences: MIT-style, BSD-3, Apache-2.0. Only text or concepts are taken, no code. Timing: before ADR-015 Amendment 1, or any GeoArrow export piece.

### Disposition table: every dataset recommended, and what it would owe

"Committable" means the licence would allow it. The repository's own rule still tracks **no** data file (`engine/CORPUS-REPRODUCIBILITY-PREREGISTRATION.md:65-66 @ 4561f3b8`), so committable files are fetched by commit-pinned URL plus sha256, as #11 is.

| dataset (pin) | geometry | role for Spatial IDE (predicted, not run) | licence (source file) | disposition | notice owed |
|---|---|---|---|---|---|
| GeoParquet `test_data/data-{linestring,multilinestring}-encoding_wkb.parquet` @ `525b8f9` (v1.1.0) | LS / MLS, 3–4 rows | opens; stream refuses at the EMPTY row by name | Apache-2.0 (`LICENSE`) | committable → fetch by pin | Apache-2.0 §4 (licence copy, keep notices) if redistributed |
| the same files @ `4c9f87e` (2.0.0, native GEOMETRY) | LS / MLS | as above, plus the D4 native-type path | Apache-2.0 | committable → fetch by pin | same |
| GeoParquet `examples/example.parquet` @ `525b8f9` (v1.1.0, covered) | Poly/MPoly | covered twin of #11 (mp-prime-e2e-covered-fixture's need, real-world NE rows) | Apache-2.0 | committable → fetch by pin | same |
| geoarrow-data `natural-earth_countries_geo.parquet`, `example-crs_vermont-4326_geo.parquet` @ `e8eaa04` | MPoly / Poly, EPSG:4326 [north, east] | R-C4 `axis:format-override` admits from a second producer | public domain (dataset README; NE `LICENSE.md`) | human's call: by fetch if PD counts as open, else local-only | none required; "Made with Natural Earth" optional |
| geoarrow-data `example-crs_vermont-*.parquet` (bare, native GEOMETRY, no `geo`) | Poly | `engine.geo_metadata` (no `geo` key) on a file DuckDB reads as geometry | public domain (as above) | as above | as above |
| parquet-testing `data/geospatial/*` @ `56653c4` | all, incl. GEOGRAPHY lines | refusal rows today (no `geo` key); conformance rows if native types are ever admitted | Apache-2.0 (`LICENSE.txt`) | committable → fetch by pin | Apache-2.0 §4 |
| parquet-testing `bad_data/ARROW-GH-4131{7,21}.parquet` | Point (0.1.0) | third-party malformed GeoParquet refusal rows | Apache-2.0 | committable → fetch by pin | Apache-2.0 §4 |
| MS Road Detections `country=MCO/MCO.parquet` (19,402 B) or `LIE` (258,521 B), Source Cooperative | LineString, covering, CRS84 default, no `id` | **the real-world line file**: open, session-ordinal, viewport, draw; publish refuses (degrees) | ODbL-1.0 (Microsoft `LICENSE`; STAC `license`) | **local-only, sha256-pinned** (unversioned upstream; ETag recorded) | none while internal (ODbL §4.5); "Microsoft, ODbL" attribution and §4.2/4.4/4.6 if a derivative is ever published |
| Natural Earth `ne_50m_rivers_lake_centerlines` @ `f1890d9` (v5.1.2) → GeoParquet written by a project generator | LS + MLS (182 of 477 multipart) | owned, regenerable real-world line file, in CRS84 or reprojected to LV95 by the generator | public domain (`LICENSE.md`) | **project-generated, by regeneration** (the corpus's existing class) | none required |
| geoarrow-data `ns-water_water-line_geo.parquet` (v0.2.0 release, 303.8 MB) | LS Z / MLS Z, CompoundCRS | real-world refusal row (Z; CompoundCRS axis) | Nova Scotia agreement (not fetched) | local-only, sha256-pinned, after the licence is fetched | per that agreement (unknown) |
| Overture transportation segment (2026-09-23.0) | LineString, covering, Utf8 `id` | refuses `identity_unusable` | ODbL (Overture `_generated_attribution.mdx:344-349`) | reference only | "© OpenStreetMap contributors, Overture Maps Foundation" on anything published |
| OSM US Layercake `waterways.parquet` (8.0 GB) | LineString, INT64 `id`, no covering | opens; canvas blocked (no covering); identity scan of 39M rows | ODbL (layercake.openstreetmap.us/layers) | reference only | "© OpenStreetMap contributors" on anything published |
| geoarrow-data `quadrangles` | Poly | — | conditional USGS/ESRI terms | reject (red until counsel) | — |

**Recommendation for `corpus-line-files`:** two real-world entries plus the conformance pair.
1. **Local-only:** one MS Road Detections partition (MCO or LIE).
2. **By regeneration:** one project-generated GeoParquet from Natural Earth 50m river centerlines. The generator writes a covering, an integer `id`, and either CRS84 or LV95; its procedure is recorded as #1–#6 are. This is the only route to an owned, openly licensed, *real-world* MultiLineString with an x-first metre CRS.
3. **Fetch by pin:** the GeoParquet v1.1.0 LineString and MultiLineString test files.

The human decides. On the generator's dependencies: the corpus venv records geopandas, shapely, pyproj, pyarrow and duckdb with spatial (`engine/compat-corpus/RECORD.md:66 @ 4561f3b8`), but **not** pyogrio or fiona, which geopandas needs to read a shapefile. Two existing paths avoid adding one: the spatial extension's `ST_Read`, which `gen_duckdb.py` already installs, or a stdlib shapefile reader feeding shapely. Choosing between them is a dependency question for the human.

---

## 4. Do not reinvent / worth owning

- Spatial IDE should not author **geometry-type × dimension conformance fixtures** from scratch, because `opengeospatial/geoparquet` `test_data/` (Apache-2.0) and `geoarrow-data/example` (wk-derived, licence unidentified) already provide every type, including EMPTY and NULL rows. That holds unless a requirement later needs rows the engine *admits*; theirs are built to contain EMPTY and NULL.
- Spatial IDE should not author **Parquet GEOMETRY/GEOGRAPHY CRS-form and pole/antimeridian fixtures**, because `apache/parquet-testing` `data/geospatial/` (Apache-2.0) provides them with generator scripts. That holds unless the engine adopts a CRS grammar narrower than Parquet's.
- Spatial IDE should not author a **GeoParquet metadata-mutation list** from scratch, because `geoparquet/scripts/test_json_schema.py` (44 invalid, 67 valid cases; Apache-2.0) and `planetlabs/gpq` `internal/validator/testdata` (29 JSON cases; Apache-2.0) enumerate them. That holds unless the engine's own refusal taxonomy, not the spec's, is what must be covered. Port the cases as generator input, keeping the notice.
- **Worth owning:**
  - The corpus manifest, its licence classification, and its byte-pinned records (the existing `RECORD.md` / `LICENCES.md` discipline). No upstream does this per file.
  - **Project-generated line fixtures in LV95** (EPSG:2056). No public line file is in a metre CRS with an x-first definition, a covering and an integer `id`. The only public metre-CRS line file is ns-water, with Z and a CompoundCRS.
  - The engine's own fixtures (`kernel/tests/manual_walkthrough_fixtures.rs`) remain the owned admission evidence. The upstream files are refusal and conformance evidence.

---

## 5. What I could not verify

- **Behaviour, not code:** none of the "Spatial IDE would admit / refuse" outcomes above was run. Each is a prediction for a preregistration's §3 table. In particular:
  - D4's claim that `GEOMETRY`-typed files reach `probe_schema` with `geoarrow.wkb` field metadata needs a probe test against the bundled DuckDB.
  - Whether duckdb-rs's `query_arrow` keeps that field metadata is also unverified.
- **Nova Scotia's licence** ("Unrestricted Data Use License Agreement for Government Geographic Data") was not fetched. ns-water's licence is therefore second-hand (geoarrow-data README).
- **ODbL wording** was read through a summarising fetch, not byte-pinned. Re-fetch and pin per `LICENCES.md`'s rules before any licence cell is written.
- **TomTom** data in Overture transportation is listed with no licence in Overture's attribution file. Overture states the theme licence as ODbL; how TomTom's contribution is licensed is not stated there.
- **Release notes:** GDAL `GEOPARQUET_VERSION` (2.0 writing) landed on master 2026-08-15 (`75667c721`). It is **not in v3.13.3** (`git show v3.13.3:…ogrparquetwriterlayer.cpp | grep -c GEOPARQUET_VERSION` = 0). v3.13.3 defaults `USE_PARQUET_GEO_TYPES=NO`; master defaults `AUTO` (= native types only when writing 2.0). Native `GEOMETRY` read/write support itself is in 3.12.0's NEWS ("add support for reading/writing Parquet GEOMETRY data type (libarrow >= 21)", `NEWS.md:2325`). A released 3.14 was not found (`git ls-remote --tags 'v3.14*'` is empty).
- **geopandas 1.2.0** (2026-09-28): GeoParquet 2.0.0 writing needs pyarrow ≥ 21 (`arrow.py:407-411`). The default schema version is still `1.1.0` (`METADATA_VERSION`, `arrow.py:19`).
- **GeoParquet 2.0.0:** no release tag exists (only `v2.0.0-rc.1`), yet `main` and its test files already declare `"2.0.0"`. A file declaring `2.0.0` cannot be pinned under R-C1 until a tag exists.
- **docs/08_Testing.md:40 @ 4561f3b8 vs the #12 ruling:** docs/08 calls Overture and OSM extracts "redistributable". The human ruled Overture fetch-only. The two are not reconciled in-tree; flag for the human, no change proposed.
- **GitHub issue and PR pages** were not read (robots.txt). Upstream plans, e.g. a geoarrow-data v0.3 with LICENSE files, or DuckDB changing the native-type gate, are not known.
- **Other Source Cooperative line datasets** (e.g. national road networks) were not surveyed beyond the MS mirror.


## Errata from the independent check (2026-10-08)

- VERIFICATION-B row 11: Microsoft's road-detections `LICENSE` says "ODbL" with no version; "ODbL-1.0" comes from the Source Cooperative mirror's catalogue. The Monaco file is as described (19,402 B, 367 rows).
- VERIFICATION-B row 13: the two parquet-testing `bad_data` files are malformed at the Parquet layer; their GeoParquet metadata is fine.
- VERIFICATION-B row 5: ADR-032 is Accepted (2026-09-23). PLAN node `adr-032-decision` (`PLAN.yaml:1851-1867 @ 4561f3b8`) is stale — still `status: proposed`, `needs_human: ruling` — and `docs/README.md:27 @ 4561f3b8`'s prose is stale too.
