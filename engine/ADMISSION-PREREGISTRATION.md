# Preregistration — admission format semantics and the session identity lifecycle (Brief A)

*Drafted 2026-09-10 at Brief A's P0 by the architect agent on the custodian's brief; assembled by the custodian for the human's sight. Committed once, complete — the pinned-text appendix (§2b's precondition) and the extended corpus rows (§3) included; append-only from this commit (§12e).*

**Committed before any code and before any corpus file has been opened by this engine.** Same discipline as `frontends/shell/RESIDENCY-PREREGISTRATION.md` and `kernel/QUERY-WINDOW-ATTRIBUTION-PREREGISTRATION.md`: every rule, expected outcome, fixture and gate below is fixed by this commit; an amendment made after an outcome has been seen **must say so in its first line** and invalidates the work it touches. **Append-only once committed.**

**Authority.** `state/drafts/post-tag/DRAFT-2-BRIEF-A-admission-and-session-lifecycle.md` — its "Settled boundaries" 1–10 (`:23-70`) are binding and are cited by number, never restated here as this document's own reasoning. The review-loop amendment (Draft 1, `AI_DEVELOPMENT.md` Amendment 1) is in force from its merge. This file declares *what is admitted, refused, and recorded*; it does not design the reader.

---

## 0. Disclosure — no pilot, one architect consult, one corpus already collected

No admission run of any kind informed this file. Two inputs did, and are disclosed rather than left to be inferred:

1. **The compatibility corpus was collected before this file was written** (`target/fixtures/compat-corpus/`, 12 files collected 2026-09-10, then extended the same day with GDAL- and QGIS-written files and a `mutations/` directory, four files retired to keep the main set at the brief's ceiling). It deliberately records **no expected outcome** (`MANIFEST.json`, its README), so nothing below is reverse-engineered from a verdict someone else already formed. Every "observed" value cited here is quoted from that manifest.
2. **The architect consult of 2026-09-09** (`state/drafts/post-tag/architect-consult-adr-032.md`) shaped §2's rules and §10's ADR list. Two of its cites are second-hand in this file and labelled where used.

**One observed field this document needed did not exist in the first manifest.** It recorded `crs_shape`, `crs_projjson_name` and `crs_projjson_id`, but not `coordinate_system.axis` directions or names — the exact input `engine/src/geoparquet.rs:159-189` reads to establish axis order. The corpus extension adds `crs_axis_names` and `crs_axis_directions` under `observed`; every axis-dependent prediction below states its branch condition and is resolved from those fields where they are present, else marked **not derivable statically — record at P4**.

---

## 1. What this preregistration may and may not claim

- **No performance claim, no `docs/08` row, not even proposed** (boundary 10; A6). No duration appears in any row, table or walkthrough step (ADR-018). "Fast admission" (boundary 6) is a **structural** claim — reads that do not happen — and is scored by G-A1 as an assertion on read accounting, never as a time.
- **No snapshot-consistency claim** (boundary 4; A1). The read-around check detects *some* changes; the phrase "one open reads one snapshot" appears nowhere, and §4's M-1c fixture exists to keep that honest by demonstrating a change the check does **not** catch.
- **A sanity check convicts, never confirms** (boundary 2). No string, comment or status may say a file "passed", "is valid", or "was verified" on its basis; the recorded values are the level (`metadata` / `sample` / `none`) and, on conviction, the refusal.
- **A format rule is not a producer claim.** Applying GeoParquet's absent-key default or its WKB axis override records what the *format* states; it establishes nothing about whether the file's producer conformed (`spikes/item8-crs-catalog-extension/README.md:74-77`).
- **An absent `crs` key is not evidence that the producer had no CRS.** GDAL 3.11.3, rewriting a source whose `geo` metadata declared EPSG:4326 as PROJJSON, wrote **no `crs` key at all** (`gdal/ogr2ogr-epsg4326-default.parquet`: `observed.crs_key_present false`, `crs_shape "absent-key"`, `crs_axis_names`/`crs_axis_directions` `null`; the source is `geopandas/gp-epsg4326-covering.parquet`, whose `crs_shape` is `projjson:EPSG:4326`). The format-default rule is therefore reached by files whose upstream *did* declare a CRS, and the provenance shown to the operator must say the CRS came from the format's default — never that the file, or its producer, had none.
- **Nothing is normalized.** `axis_normalization` stays `none-performed` (`engine/src/envelope.rs:88`); no coordinate value is transformed by anything this cut adds.
- **Native and mapped identity are out of scope as behaviour** (boundary 6; A4): additive envelope/describe fields only, existing suites green unmodified.
- **This document files no ADR content.** The five ADR drafts named in the brief's P0 are separate files, Proposed, and are the human's at P6.

---

## 2. The classification rules — stated before they are applied

Rules run in the reader's own order. **The admission table records the first outcome reached**, so a file may never reach a rule this cut adds.

### 2a. Pre-existing gates (unchanged by this cut, listed because they fire first)

- **R-P1** Not a readable file → `EngineError::Source` (`dataset.rs:241-243`).
- **R-P2** No `geo` key in the footer → `EngineError::GeoMetadata` (`dataset.rs:684-686`).
- **R-P3** `geo.version`, `geo.primary_column`, `geo.columns.<primary>` or `encoding` missing → `EngineError::GeoMetadata` (`geoparquet.rs:61-86`); `geo` not JSON → same (`geoparquet.rs:58-59`).
- **R-P4** `encoding` ≠ WKB → `EngineError::GeoMetadata` (`dataset.rs:269-274`).
- **R-P5** `geometry_types` non-empty and not all `Polygon` → `EngineError::GeoMetadata` (`dataset.rs:275-282`). **This gate is not changed by Brief A and refuses `Point`, `MultiPolygon` and mixed lists.** Whether it is widened is DECISIONS-PENDING entry 73, the human's.
- **R-P6** Geometry column absent or non-binary → `EngineError::Source` (`dataset.rs:872-888`).

### 2b. CRS provenance (boundary 1)

- **R-C1 Pinned-version precondition.** The format rules R-C2/R-C4 apply only when the file's declared `geo.version` has its governing text **pinned in-tree** under the entry-51 discipline (URL, retrieval date, page sha256). Before this cut only 1.1.0's axis-order passage was pinned (`spikes/item8-crs-catalog-extension/README.md:55-72`), and the absent-key default was pinned for **no** version; Appendix A of this file pins the `crs` text for 1.0.0, 1.1.0, 2.0.0-rc.1 and `main`; the precondition holds for `1.0.0` and `1.1.0`, and **not** for a file declaring `2.0.0` until `v2.0.0` is tagged and pinned (§3's note). A file declaring an unpinned version takes **no** format rule; an absent key refuses under the existing `EngineError::CrsUndeclared` with `detail` naming the unpinned version. Applying a rule from a specification version the file does not claim would be a guess (docs/01 principle 8).
- **R-C2 Absent `crs` key** → admitted as OGC:CRS84 with provenance `crs:format-default`, carrying the spec version and the pinned-rule reference. The provenance value is recorded on the envelope and surfaced in `describe.crs.provenance`.
- **R-C3 Explicit `crs: null`** → unchanged: not a declaration; `CrsUndeclared` unless the caller asserts (`geoparquet.rs:98-109`, `crs.rs:236-239`).
- **R-C4 Declared CRS whose definition axis order is not x-first** → the **data** order is established from the format's WKB override, provenance `axis:format-override`; **the definition's own declared order is retained as a recorded fact** and is never discarded. Reader-only: `crs.rs::is_x_first` (`:120-124`) and `crs::admit` (`:218-240`) are not touched.
- **R-C5 Declared CRS, x-first** → admitted-as-declared, no provenance marker beyond `crs_source = file` (`envelope.rs:72-74`).
- **R-C6 Caller assertion** → unchanged in every respect (`crs.rs:203-240`), including refusal over a declaring file.

### 2c. The sanity check (boundary 2)

- **R-S1 Level selection, in order.** `metadata` if the geometry column carries a `bbox` member **or** the covering columns carry Parquet statistics (both footer-resident); else `sample` — the **first row group of the covering bbox columns only**, capped at `SANITY_SAMPLE_MAX_ROWS` (§7); else `none`. Never two levels, never all coordinates, never a WKB decode at open.
- **R-S2 Conviction.** The check applies only where a format rule supplied the CRS (R-C2). A coordinate outside ±180/±90 convicts the assumed CRS84 → `engine.format_default_contradicted{detail}`. A file inside the domain is **not** thereby correct (a projected file may sit inside it); KNOWN-LIMITATIONS says so verbatim.
- **R-S3 Covering pointing at columns absent from the probed schema** → level `none` with the reason recorded. Open still succeeds; today's code accepts such a covering at parse (`geoparquet.rs:111`, `:117-131` check only that the path is strings) and fails later at query. Refusing at open instead is a user-visible behaviour change and is on §12's human list, not taken here.

### 2d. Identity class (boundaries 3, 6, 7)

- **R-I1 native** — the file carries an `id` column admissible under ADR-016; full verification scan runs, unchanged (`dataset.rs:741-831`).
- **R-I2 mapped** — a caller declaration; verification scan runs, unchanged.
- **R-I3 session-ordinal** — reached when neither R-I1 nor R-I2 yields an admissible identity on a **single-file** source: identity = (generation G, `file_row_number`). **No whole-file read, no content hash, no uniqueness scan** (boundary 6). The ADR-016 candidate list is still reported so an operator can declare a mapping.
- **R-I4 refused** — partitioned source on the R-I3 path → `engine.identity_ordinal_partitioned_unsupported` (boundary 7); or any pre-existing typed identity refusal on the native/mapped path.

### 2e. Change detection (boundary 4)

- **R-D1** Descriptor = byte size, mtime, footer length, footer hash; footer hash omitted and the degradation shown when the footer exceeds §7's ceiling (boundary 5).
- **R-D2** Checked before every query issue and after every stream terminal. A difference in **any** component invalidates G → `engine.source_changed{detail: <which component>}`.
- **R-D3** The descriptor is a change detector, not what makes ordinals unique; uniqueness within a generation is by construction (boundary 3).

---

## 3. The compatibility-corpus manifest — one row per file, two pre-declared outcomes

Hashes are the first 12 hex of each `observed` block's `sha256` in `MANIFEST.json`. "Today" = the tree at `main` 279b43f, derived from the cited lines. "Brief A" = the rules in §2 with the polygon gate (R-P5) **held** (DECISIONS-PENDING entry 73 pending). Every axis-dependent row is resolved from the manifest's `crs_axis_directions`; nothing here is conditional.

| # | path (under `target/fixtures/compat-corpus/`) | pipeline | sha256 | observed that matters | **today** | **Brief A** | class |
|---|---|---|---|---|---|---|---|
| 1 | `geopandas/gp-epsg2056-intkey.parquet` | GeoPandas/pyarrow | `66afc49203cb` | geo `1.0.0`; `projjson:EPSG:2056`; axes `["Easting","Northing"]`/`["east","north"]`; types `[Polygon]`; `covering_present false`; `bbox` present; `parcel_id` int64; no `id` | **refused** `identity_unusable` (`dataset.rs:756-769`), candidates `[parcel_id]` | **admitted-as-declared** (R-C5, x-first per `crs.rs:123`); sanity level `none` (nothing assumed to check) | **session-ordinal** |
| 2 | `geopandas/gp-nocrs-nokey.parquet` | GeoPandas/pyarrow | `a55e41bbfd4c` | types `[Point]`; `crs_shape` `null` (explicit); no integer- or string-typed column | **refused** `GeoMetadata` non-polygon (`dataset.rs:275-282`) | **refused-by-name, unchanged** — R-P5 precedes every rule this cut adds. Its explicit-null case (R-C3) stays **unexercised by the corpus**; F-3 carries it | n/a |
| 3 | `geopandas/gp-epsg4326-covering.parquet` | GeoPandas/pyarrow | `bbb8d0bcb0c3` | geo `1.0.0`; `projjson:EPSG:4326`; axes `["Geodetic latitude","Geodetic longitude"]`/`["north","east"]`; types `[Polygon]`; covering → `bbox` struct; `bbox` `[7.24…, 46.75…, 7.64…, 47.15…]`; `fid` int64; no `id` | **refused** `AxisOrderUnsupported{established:"latitude,longitude"}` — resolved: `("north","east")` + geographic axis names → `LatitudeLongitude` (`geoparquet.rs:174-184`), `is_x_first` false (`crs.rs:122-123`), refusal at `dataset.rs:303-307` | **admitted-under-format-rule-with-provenance `axis:format-override`** (1.0.0 pinned, Appendix A); declared order `latitude,longitude` **retained** as a recorded fact; sanity `metadata`, not convicted (y within ±90). Degrees dataset → boundary-8 publish preflight refusal + the equirectangular statement | **session-ordinal** |
| 4 | `duckdb-spatial/duckdb-lv95range-intkey.parquet` | DuckDB spatial | `7a9da0271676` | types `[Point]`; `crs_shape` `absent-key`; `bbox` in the LV95 metre range | **refused** `GeoMetadata` non-polygon | **refused-by-name, unchanged**. Would otherwise be a second `format_default_contradicted` instance | n/a |
| 5 | `duckdb-spatial/duckdb-degreesrange-nokey.parquet` | DuckDB spatial | `b471a90f2e87` | types `[Point]`; `absent-key`; `bbox` inside ±180/±90; no integer- or string-typed column | **refused** `GeoMetadata` non-polygon | **refused-by-name, unchanged**. Would otherwise be a second `crs:format-default` admit | n/a |
| 6 | `duckdb-spatial/duckdb-mercatorrange-strkey.parquet` | DuckDB spatial | `94c737ebb4e7` | geo `1.0.0`; types `[Polygon]`; **`absent-key`**; `covering_present false`; `bbox` `[827975.0, 5932975.0, 834194.0, 5947154.0]`; primary column `geom`; no integer column | **refused** `crs_undeclared` (`crs.rs:236-239`, message `error.rs:175-179`) | **refused-by-name `engine.format_default_contradicted`** — R-C2 supplies CRS84, R-S1 gives level `metadata` from the geo `bbox`, R-S2 convicts on \|x\| ≫ 180 | n/a (refused) |
| 7 | `gdal/ogr2ogr-epsg2056-default.parquet` | GDAL 3.11.3 `ogr2ogr` (local, QGIS 3.44.2's) | `4e8e21d423dc` | geo `1.1.0`; `projjson:EPSG:2056`; axes `east/north`; types `[Polygon]`; covering → `geometry_bbox`; `bbox` present; `parcel_id` int64; no `id` | **refused** `identity_unusable`, candidates `[parcel_id]` | **admitted-as-declared**; sanity `none` | **session-ordinal** |
| 8 | `gdal/ogr2ogr-epsg4326-default.parquet` | GDAL 3.11.3 `ogr2ogr` (local) | `79dabf9db66a` | geo `1.1.0`; **`crs_shape` `absent-key`**, `crs_key_present false`, `crs_axis_names`/`crs_axis_directions` `null` — written from a source declaring EPSG:4326 lat-first (#3); types `[Polygon]`; covering → `geometry_bbox`; `bbox` `[7.24…, 46.75…, 7.64…, 47.15…]`; `fid` int64; no `id` | **refused** `crs_undeclared` | **admitted-under-format-rule-with-provenance `crs:format-default`** (OGC:CRS84, 1.1.0 pinned); sanity `metadata`, **not** convicted (whole bbox inside ±180/±90). Degrees dataset → boundary-8 preflight refusal + the equirectangular statement | **session-ordinal** |
| 9 | `gdal/ogr2ogr-epsg2056-no-covering.parquet` | GDAL 3.11.3 `ogr2ogr` (local, `-lco WRITE_COVERING_BBOX=NO`) | `9d6f01256274` | geo `1.1.0`; `projjson:EPSG:2056`; axes `east/north`; types `[Polygon]`; **`covering_present false`**; `bbox` present; no `geometry_bbox` column | **refused** `identity_unusable`, candidates `[parcel_id]` — the absent covering does **not** refuse at open (`dataset.rs:439-442` is a `build_index`/viewport-filter path, not admission) | **admitted-as-declared**; sanity `none`. A later viewport filter still refuses `NoCoveringBbox`, unchanged by this cut | **session-ordinal** |
| 10 | `qgis/qgis-savefeatures-epsg2056.parquet` | QGIS 3.44.2 `qgis_process native:savefeatures` | `a36914b3f075` | geo `1.1.0`; `projjson:EPSG:2056`; axes `east/north`; types `[Polygon]`; covering → `geometry_bbox`; `bbox` present; `parcel_id` int64; `label` `string` (not `large_string` — the one schema difference from #7); no `id` | **refused** `identity_unusable`, candidates `[parcel_id]` | **admitted-as-declared**; sanity `none` | **session-ordinal** |
| 11 | `geoparquet-spec/example.parquet` | spec example (downloaded) | `ff90b4800d71` | geo **`2.0.0`**; `projjson:OGC:CRS84`; axes `["Geodetic longitude","Geodetic latitude"]`/`["east","north"]`; types `[Polygon, MultiPolygon]`; `edges` `planar` | **refused** `GeoMetadata` non-polygon | **refused-by-name, unchanged**. Recorded for the rule: its `2.0.0` is unpinned (R-C1 — Appendix A pins `v2.0.0-rc.1` and `main`, neither of which is the `2.0.0` release), and its CRS is declared and x-first, so no format rule is needed either way | n/a |
| 12 | `overture/overture-2026-08-19.0-building-bern.parquet` | Overture CLI | `6cd47a3e6e31` | geo `1.1.0`; types `[MultiPolygon, Polygon]`; `absent-key`; covering → `bbox` struct; **`bbox_present_in_column_metadata false`** | **refused** `GeoMetadata` non-polygon | **refused-by-name, unchanged**. The only main-set file whose sanity level would be decided by covering-column statistics rather than a geo `bbox` member | n/a |

**Retired — observed blocks kept, not run:** `retired/gp-epsg3857-strkey.parquet` (`fc8a150a5519`), `retired/poly.parquet` (`002f42489f96` — the corpus's only EPSG:27700, axes `east/north`), `retired/test_geoparquet_1_1.parquet` (`f7703e1f2a43`), `retired/test_with_fid_and_geometry_bbox.parquet` (`a29df781c644`); moved 2026-09-10 to keep the main set at the brief's ceiling, full `observed` blocks retained in `MANIFEST.json`'s `retired` array, no outcome predicted and none run against them.

**On Appendix A and `2.0.0`, the rule kept:** a release candidate is not the release, and `main` is a moving branch pinned at a commit. R-C1's precondition holds for `1.0.0` and `1.1.0` and **not** for a file declaring `geo.version` `2.0.0` until `v2.0.0` is tagged and pinned; such a file with an absent key refuses under the existing `CrsUndeclared` naming the unpinned version. The spike README pins the *rendered* 1.1.0 page and Appendix A the *tagged raw markdown* — two artifacts of one version; either satisfies R-C1, and the pair is not a cross-check.

**Rule-derived summary of the main set (12), registered as predictions (§5).** Refused at R-P5 before any rule this cut adds: **5** (#2, #4, #5, #11, #12 — three `Point` files and two `MultiPolygon`-bearing files). Reaching the CRS rules: **7**. Under Brief A: **4 admitted-as-declared** (#1, #7, #9, #10), **2 admitted-under-format-rule** (#8 `crs:format-default`; #3 `axis:format-override`), **1 refused-by-name `engine.format_default_contradicted`** (#6). Identity class of every admit: **session-ordinal, 6 of 6** — no main-set file yields native or mapped identity, so G-A1's native/mapped direction is carried only by fixtures F-8/F-9. Sanity levels recorded: `metadata` ×3 (#3, #6, #8), `none` ×4 (#1, #7, #9, #10), `sample` ×0. Explicit-null (R-C3) exercised by **0** main-set files.

**Files arriving later** are classified by §2 without amendment to this file: run R-P1…R-P6, then R-C1…R-C6, then R-S1…R-S3, then R-I1…R-I4, and record the first outcome reached. A file whose class cannot be decided from `observed` alone is recorded **not derivable statically — record at P4**, never predicted.

---

## 4. Fixtures — purpose-written, because the corpus does not cover these

| id | fixture | exercises | expected under Brief A |
|---|---|---|---|
| F-1 | absent-key, polygons, coordinates inside ±180/±90, pinned version | R-C2 + R-S1 `metadata` | admitted, `crs:format-default`, level `metadata` |
| F-2 | as F-1 but coordinates outside the domain | R-S2 | `engine.format_default_contradicted` |
| F-3 | explicit `crs: null`, polygons | R-C3 | `crs_undeclared`; assertion prompt; unchanged from today |
| F-4 | declared lat-first geographic CRS, polygons, degrees | R-C4 | admitted, `axis:format-override`, declared order retained; **publish refuses at preflight by name** (boundary 8) |
| F-5 | as F-1 but no geo `bbox` and no covering | R-S1 → `none` | admitted, level `none`, "not checked" stated |
| F-6 | as F-1 but covering present, no statistics, ≥2 row groups | R-S1 → `sample` | admitted, level `sample` |
| F-7 | polygons, no `id`, no declaration, single file | R-I3 | session-ordinal; zero whole-file reads (G-A1) |
| F-8 | polygons, admissible `id` | R-I1 | native; verification scan runs (G-A1's other direction) |
| F-9 | partitioned source, no usable key | R-I4 | `engine.identity_ordinal_partitioned_unsupported` |

**Mutation fixtures — the five real files under `mutations/` (derivations in `mutations/DERIVATIONS.json`; boundary 2's own rule and G-A2):**

| fixture (`mutations/`) | id | derivation, from `DERIVATIONS.json` | **today** | **Brief A** |
|---|---|---|---|---|
| `gp-epsg2056-intkey-truncated.parquet` `b9c8525fe068` | **M-2** | last 1024 bytes not written; the trailing `<uint32 len><PAR1>` is inside the removed range — `mutation_tail_magic_present false`, `mutation_footer_length_field null`; the recorded `mutation_parquet_open_error` is **pyarrow's**: `ArrowInvalid: Parquet magic bytes not found in footer…` | open fails inside `read_kv_metadata` (`dataset.rs:690-708`); DuckDB's message is not pyarrow's and the exact variant (prepare vs row iteration) is **not derivable statically — record at P4** | unchanged; additionally the descriptor's footer-length read has nothing to read, so the refusal precedes any descriptor. A file that never opened has no generation and can never produce `source_changed` |
| `gp-epsg2056-intkey-geojson-invalid.parquet` `d197817244ad` | **M-3** | pyarrow rewrite with the `geo` value replaced by an unclosed JSON object; `mutation_geo_metadata_parses_as_json false`, `mutation_parquet_open_error null` | **derivable**: `EngineError::GeoMetadata("`geo` is not JSON: …")` at `geoparquet.rs:58-59` | unchanged. Caveat recorded: a pyarrow rewrite, so `parquet_footer_created_by` is pyarrow's, not GeoPandas's — not a byte-minimal edit of its base |
| `ogr2ogr-epsg2056-default-covering-absent-columns.parquet` `17396fe23243` | **M-4** | covering `bbox` members repointed from `geometry_bbox` to `no_such_bbox_column`, a name absent from the schema; nothing else in `geo` changed; `mutation_geo_metadata_parses_as_json true` | **open succeeds** — `GeoMeta::parse` accepts it (`geoparquet.rs:111`, `:117-131` validate only that the path is strings). The failure surfaces later when the path reaches SQL; that variant is **not derivable statically — record at P4** | **open succeeds**, sanity level **`none`** with the reason "covering names a column absent from the schema" (R-S3). Refusing at open instead is DECISIONS-PENDING entry 73's item (c), not taken here |
| `gp-epsg2056-intkey-changed-same-size.parquet` `65bac6ea0ee1` | **M-1c — the honest not-detected case** | one byte at absolute offset 9764 XORed `0xA2 → 0xA3`, inside row group 0's `geometry` column chunk (first page offset 4211 + half of compressed size 11107) — compressed page data, **not** the footer; `size_equals_base true`, `mtime_ns_restored_to_base true`, `footer_length_changed false`, tail magic intact. `mutation_sha256` differs from `base_sha256`, which is the independent proof the bytes changed | no change detection exists; the file simply opens | **NOT DETECTED — asserted as a passing test that `engine.source_changed` does not fire.** All four descriptor components (size, mtime, footer length, footer hash) match the base by construction. This is boundary 4's declared limit made a fixture, and KNOWN-LIMITATIONS states it in the same words. No text, comment or status may describe this as a check that passed |
| `gp-epsg2056-intkey-appended.parquet` `b1c63221ec92` | **M-1a-equivalent (size component)** | a rewrite with the base's rows written twice as two row groups — *not* a byte append; a Parquet footer cannot be appended in place. `mutation_bytes 43046` vs `base_bytes 27132`; `mutation_footer_length_field 12406` vs `11806` | opens as a valid 2-row-group file (identity still refuses `identity_unusable`, as its base does) | **`engine.source_changed`**, with `detail` naming **every** component that differed: `{size, mtime, footer-length, footer-hash}` |

**Two coverage gaps this mapping exposes, recorded before any code:**

- **No fixture isolates a single descriptor component except M-1c's "none of them".** `-appended`, `-geojson-invalid` and `-covering-absent-columns` differ in size, mtime *and* footer simultaneously, so a passing `source_changed` on any of them does not show which component fired. Rule adopted: **the refusal's `detail` names every component that differed**, pre-declared per fixture, so the assertion is exact without new fixtures.
- **One additional mutation is requested at P1** — the M-1a-proper case: a data-page byte flipped, size identical, mtime **not** restored. It is the cheapest component (mtime alone) and the only one no current fixture proves fires by itself. **M-1b** (footer bytes changed with size and mtime preserved) has no fixture and is not requested; the `detail` rule above covers it once a real footer-only edit exists.

---

## 5. Registered predictions — wrong is a result

*Pre-commit note, for the record: an earlier draft of this section, written against the 12 files first collected, predicted 8 of 12 at the polygon gate. The set was extended and four files retired before this file was committed, so this is completion, not a deviation from a registered prediction — nothing had been registered.*

1. **The polygon gate refuses 5 of 12**, by name: `gp-nocrs-nokey`, `duckdb-lv95range-intkey`, `duckdb-degreesrange-nokey`, `example.parquet`, `overture-…-building-bern`. Fewer or more means the reading of `observed.geometry_types` against `dataset.rs:275-282` was wrong, and every affected row is re-derived as a recorded deviation.
2. **Exactly one file reaches `engine.format_default_contradicted`** — `duckdb-mercatorrange-strkey`, convicted at level `metadata` on its geo `bbox`.
3. **Exactly one file exercises `axis:format-override`** — `gp-epsg4326-covering`, resolved from `crs_axis_directions` `["north","east"]` with geographic axis names.
4. **`mutations/gp-epsg2056-intkey-changed-same-size.parquet` is NOT detected** — asserted as a passing test that `engine.source_changed` does not fire (§4). Being right here is the honesty of boundary 4; being wrong would mean the descriptor catches more than it claims, which is also a result.
5. **The `sample` level is reached by no main-set file** — every file passing R-P5 carries `bbox_present_in_column_metadata: true`, so `sample` is exercised only by F-6.
6. **The format-default path carries more traffic than the axis-override path, because producers drop the key.** One observed instance: GDAL 3.11.3, given a source whose geo metadata declared EPSG:4326 lat-first, wrote **no `crs` key at all** (#8). Predicted: across any wider producer set, absent-key files outnumber lat-first-declared files, so `crs:format-default` is the common path and `axis:format-override` the rare one. One instance is not a population; being wrong is a result.

**A consequence carried into Part N's wording (P6):** the two format-rule provenance strings must be distinguishable at sight, because #3 and #8 are the *same* real-world CRS (WGS 84 longitude/latitude) reached by two different routes — one where the file declared 4326 lat-first and the override applied, one where the producer wrote nothing and the default applied. A single "CRS84 (from the format)" line would collapse two different facts.

---

## 6. Instruments

| quantity | class | instrument |
|---|---|---|
| Reads on the open path (G-A1) | assertion | unconditional process-wide counters in the shape `dataset.rs:36-50` already uses for `INDEX_CONSULTATIONS` — never `cfg(test)`-gated, never an SKP field, never on the wire. A counter compiled only into a test build proves a negative about a build nobody runs |
| Footer bytes read per open | **reported-only, never gated** (boundary 5) | recorded on the open record; never compared to a budget |
| Sanity level per open | recorded | `metadata` / `sample` / `none` + reason |
| CRS / axis provenance | recorded | envelope + `describe.crs.provenance`, `describe.axis.provenance` |
| Identity class | recorded | `describe.identity.class` + the session-tier statement |
| Generation | **kernel + client state only** | asserted absent from every persisted and published artifact by typed-schema test **and** grep (G-A4) |
| Admission table (P4) | result | one row per corpus + mutation file, against §3's pre-declared outcomes; deviations recorded, never adjusted |

---

## 7. Declared values and ceilings

| name | value | basis |
|---|---|---|
| `FOOTER_DESCRIPTOR_MAX_BYTES` | **8 MiB (8,388,608)** | Declared, not discovered (ADR-010 rule 6), in the shape of `MAX_CRS_DEFINITION_BYTES` (`crs.rs:26-36`). Arithmetic, not a measurement: Parquet footer size scales with (row groups × columns); the hero-slice fixture's ~3,300,000 rows (`docs/adr/ADR-025-publish-above-the-readers-ceilings.md:19-20`) at the 8,192-row row groups its 145 MB sibling records (`kernel/QUERY-WINDOW-ATTRIBUTION-PREREGISTRATION.md:74-78`) give ~400 row groups over a handful of columns. 8 MiB is order-of-magnitude headroom over that shape. **Exceeding it degrades the descriptor to size + mtime + footer length and shows the degradation — it never refuses and never gates.** |
| `SANITY_SAMPLE_MAX_ROWS` | **8,192** | One row group at the same recorded figure; the read is of the covering bbox columns only, never the WKB |
| single-file only | boundary 7 | partitioned → `engine.identity_ordinal_partitioned_unsupported` |

---

## 8. Standing rules

- Every corpus and mutation file is **hash-verified against `MANIFEST.json` before the P4 run and again after it**; a mismatch invalidates the row.
- A registered element not run is recorded **`unrun — reason`**, never a pass by omission.
- A deviation from a §3 prediction is a **recorded result**; the prediction is never edited to match (the brief's P4 rule).
- No file in the corpus is called correct or incorrect — only admitted, admitted-under-format-rule, or refused-by-name.
- Every quoted refusal string is re-grepped against the source before it is written into any artifact.
- No duration anywhere (ADR-018); no perf word anywhere (boundary 10).

---

## 9. Non-goals

Tier 2 / verified identity / prepare-to-save (Brief B) · partitioned ordinal identity · string-id hashing · attribute projection · bundle reader changes · numeric classification · geometry predicates · LOD · **widening the polygon-only gate** (DECISIONS-PENDING entry 73, the human's) · any `docs/08` row · any perf number.

---

## 10. ADR touches

Nothing accepted is amended by this file. Cited: **ADR-005** (ResourceRef vocabulary — identity vs locator; A7, `docs/adr/ADR-005-resource-identity-reproducibility.md:10`) · **ADR-013** (coordinate-space class is compile-time, CRS is runtime instance data) · **ADR-015 §5** (`:56-60` and its conflict block `:62-75`; amendment 1 is a separate Proposed draft, the human's) · **ADR-016** (its second OPEN block, `:171-176`, is *not* answered here; the verified tier is Brief B) · **ADR-017 §14** (deferred via boundary 8's preflight refusal) · **ADR-025** (the refuse-typed-at-preflight pattern boundary 8 reuses, `:3-4`) · **ADR-028** (the open-generation seed at `:193-195`, appended 2026-09-02 as "a seed for a future slice, not scheduled, not itself a proposal", `:177`) · **ADR-032** (redrafted as this cut's accepting record) · **ADR-018** (no duration) · **ADR-010 rule 6** (declared, not discovered — §7).

---

## 11. Outcomes this preregistration is pre-authorized to reach

Any of G-A1…G-A7 failing is a legitimate and complete result. So is a corpus run in which most files never reach the rules this cut adds (prediction 1) — that is a finding about the reader's geometry gate, recorded as such, and the rules are still carried by §4's fixtures. A full pass is **not** by itself a ruling that ADR-015 Amendment 1, ADR-016 Amendment 1, ADR-013's instance, ADR-028's qualification or ADR-032 are accepted; those acceptances are the human's at P6 (red lines).

---

## 12. Block-on-sight conditions, gates, and the items that must reach the human

### 12a. Block-on-sight (verbatim from `DRAFT-2-BRIEF-A…:72-80`)

> - **A1** No snapshot-consistency claim anywhere (text, comment, status string).
> - **A2** No generation value in any persisted or published artifact (typed-schema + grep tests).
> - **A3** Data plane EMPTY DIFF; describe additions only; SKP 0.3 with fixtures in the same commit.
> - **A4** Existing native/mapped identity tests remain green unmodified (additive fields only).
> - **A5** Single-file only; partitioned refusal by name; no packing contract introduced.
> - **A6** No perf claim, no docs/08 row, no duration in any walkthrough row (ADR-018).
> - **A7** ADR-005 ResourceRef vocabulary used for identity vs locator; no competing model.

### 12b. Gates (verbatim from `DRAFT-2-BRIEF-A…:96-112`)

> - **G-A1 Fast admission is structural.** A test that observes reads on the open path (byte accounting or an instrumented reader): session-ordinal open → zero whole-file reads, no hash call, no uniqueness scan; mapped-ID open on the same file → exactly its verification scan. Both directions asserted in one test module so the distinction cannot drift apart.
> - **G-A2 Detected-change invalidation.** Open; issue a query; mutate the file (mutation fixture); the next read refuses `engine.source_changed`; residency cleared; picks refused; status text verbatim. Asserted at the pre-check and at the post-check paths separately.
> - **G-A3 Late-generation rejection.** A batch whose ticket belongs to an invalidated generation, delivered after invalidation, is dropped and never rendered (client test with a delayed batch; E2E on the shipped default). The test text states it demonstrates detection of a *detected* change, not of every possible modification.
> - **G-A4 No generation persisted.** Typed-schema test + grep over every persisted and published artifact the tree can produce.
> - **G-A5 Corpus table** produced against the preregistered expectations; every deviation is a recorded result.
> - **G-A6 Native/mapped unchanged**: existing identity and CRS test suites green without edits.
> - **G-A7 Part N** operator-verified.

### 12c. Falsification statement

This preregistration is falsified if any of the following is observed: a corpus or mutation file whose outcome differs from §3/§4 in a way §2's rules do not generate; a file admitted under a format rule whose governing text is not pinned in-tree; a change the descriptor reports as detected that M-1c's construction shows it cannot see; a session-ordinal open that performs a whole-file read; a generation value found in any persisted or published artifact; or any string, comment or row that claims a snapshot, a verification, a duration or a performance property. Each is a complete result and is recorded, never smoothed.

### 12d. The items that reach the human at sight

DECISIONS-PENDING entry 73 carries them: the polygon-only gate (the ruling); and for sight — the pinning of the absent-key default (Appendix A); the four new user-visible states whose strings are sighted at P6; R-S3's open choice; R-I3's consequence for files that today refuse `identity_unusable`; the ADR-015 §2 narrowing (scoping or guarantee change); `MIN_ANCHOR_SPAN` under degrees; the home of the binding equirectangular wording.

### 12e. Amendments

*(none — this section opens empty and is append-only from the first commit)*

### Amendment 1 — P3 implementation record (2026-09-15, appended)

**Written AFTER outcomes were seen.** §12e's own rule, honoured in this line: the §13 F escalation
gate had already been run and passed, and the P3 code had already been written and tested, before
this amendment was drafted. Nothing above is edited; every item below is a record of what P3 did,
or a named deviation, and none of it is a prediction.

1. **§13 F's escalation gate — PASSED, and what the probe observed.** The vendored `duckdb`
   `1.10505.0` (reporting DuckDB `v1.5.5`) accepts `file_row_number = true` on the `read_parquet`
   path, in the interpolated form and in the **bound-parameter** form the engine's own statements
   use (`FROM read_parquet(?, file_row_number=true)`). Over a 240-row corpus file it returned
   `count 240, min 0, max 239, count(DISTINCT) 240`. The escalation was therefore **not** raised and
   the identity mechanism is unchanged from §2d's. The probe is kept as a standing test
   (`engine/tests/session_identity.rs`), because the answer is a property of the vendored crate.
2. **R-I3's reach, narrowed in implementation and recorded here.** R-I3 is implemented for the case
   where the file carries **no `id` column at all** and no mapping is declared. A file that *does*
   carry an `id` column which then fails admission — a non-integer type, a negative value, a
   repeated value — still refuses `identity_unusable` by name and does **not** fall through to the
   session tier. Reason: those are a different fact (the file offers an identity and it does not
   work), and routing them to the session tier would have silently changed three existing ADR-016
   behaviours that A4 protects. Consequence for §3: unchanged — all six predicted session-ordinal
   corpus admits are no-`id` files.
3. **R-I4's detection, and its narrowness.** Implemented as a structural check that opens nothing:
   a **directory**, or a path carrying a `*` or `?` glob metacharacter, is a partitioned source. A
   missing path or a non-parquet file keeps `EngineError::Source`. `[` is deliberately **not**
   treated as a glob character (a bracket in a real directory name is ordinary). Windows'
   extended-length prefix (`\?\`) is stripped before the scan — an earlier revision did not, and
   every canonicalized path was read as a glob; caught by the kernel's own permission-boundary
   suite and recorded here rather than only fixed.
4. **The post-check's call site, as §13 C required P3 to name it.** `engine/src/stream.rs`, inside
   the producer thread's closure: after `produce(...)` returns (DuckDB's iterator fully drained),
   after `thread_cancel.detach()`, and after the `match outcome` that releases or discards the
   lease — and **before** `tx` is dropped, which for a clean run is the terminal itself. Rules (i),
   (ii) and (iii) are implemented as written; rule (ii) required a side channel, because a cancelled
   stream keeps its `cancelled` terminal and the change must still end the generation:
   `StreamStats::source_changed_detail`, which carries the components that differed and never a
   generation value.
5. **A fourth `EngineError` variant, beyond boundary 9's three.** `InternalInconsistency` — the
   retype of `dataset::open_inner`'s provenance arm, which the brief names as a scoped carry-over.
   It is a retype of an existing failure, not a new refusal: no input reaches it that did not reach
   `EngineError::Source` before. Recorded here so an A3/A5 reviewer does not read the count as scope
   creep, in the same shape §13 H records boundary 8's own fourth refusal.
6. **Two `describe` facts recorded but NOT put on the wire**, because boundary 9's list is closed
   and says "only": the descriptor's **footer bytes read** and its **degradation text** (§7/§13 A
   require the degradation to be *shown*), and the **ADR-016 candidate list** on a session-tier open
   (R-I3 requires it to be *reported*). Both are recorded on the engine and reachable through
   accessors (`Dataset::descriptor()`, `DatasetIdentity::candidate_columns()`); neither reaches an
   operator's eye in this cut. Surfacing either needs a `describe` field boundary 9 does not name,
   which is a decision above P3's authority and is flagged to the architect and the human rather
   than taken.
7. **Two existing tests changed, both unavoidable consequences of work the brief assigns, both
   narrow.** (a) `engine/tests/admission_format_semantics.rs`'s covering-sample assertion quotes the
   exact wording the brief asks to reword; only the quoted phrase changed and every other assertion
   in it (the row-group count bounds the read; the file's row count does not; the ceiling does not)
   stands. (b) `engine/tests/identity.rs`'s keyless-file assertion is the one R-I3 replaces — the
   consequence §12d already put on the human's sight list by name. The mapped half of that test is
   untouched. No other existing test was edited (A4/G-A6).
8. **The invalidation state is three-valued, not two.** "Never had a generation minted" and
   "generation ended by a detected change" are held apart in the kernel
   (`GenerationRegistry`): only the second refuses. A `Catalog` this host shares is reachable
   through entry points that do not run `open_dataset`, and collapsing the two told a caller its
   file had changed when nothing about the file was ever observed — a false statement, caught by the
   kernel's own SKP admission suite.
9. **What P3 did NOT build, so no reader infers it from a green suite.** No gate test: G-A1, G-A2,
   G-A3 and G-A4 are P5's and are not approximated. No corpus run (P4). No Part N, no
   KNOWN-LIMITATIONS, no ADR acceptance (P6). No duration, no rate and no performance word anywhere
   in this piece (A6).

---

## 13. Architect-routed answers recorded at P0 (implementation-level; none changes behaviour, authority, a guarantee or scope)

**A. Footer ceiling.** `FOOTER_DESCRIPTOR_MAX_BYTES = 8 MiB` — §7's basis: a declared byte bound in the shape of `MAX_CRS_DEFINITION_BYTES` (`engine/src/crs.rs:26-36`), sized by arithmetic on row-group × column counts, not by any measurement. Over the ceiling the descriptor degrades to size + mtime + footer length and says so; it never refuses, never gates. Footer bytes read are reported per open.

**B. Sanity-check sample size and level semantics.** `SANITY_SAMPLE_MAX_ROWS = 8,192` — one row group. **`metadata`** = decided from footer-resident facts only (the geo `bbox` member and/or Parquet statistics on the covering columns); **`sample`** = the first row group of the **covering bbox columns only**, never the WKB; **`none`** = neither available, and the status says *not checked*, never *passed*. Selection is ordered and exclusive (R-S1). The check applies only where a format rule supplied the CRS; a file with a declared CRS is not range-checked, because there is nothing assumed to convict.

**C. Post-check placement.** The post-check runs **after DuckDB's result iterator is fully drained and the stream's lease released, and before the stream's terminal status is emitted** — never inside the batch loop (a per-batch descriptor read would put filesystem work on the data path, docs/10, and would multiply one refusal into many). Rules: (i) the terminal is `ok` only if the post-check finds no change; otherwise the terminal *is* the typed `engine.source_changed`; (ii) a **cancelled** stream keeps its `cancelled` terminal (ADR-018 vocabulary) — the check still runs and may invalidate G, but a cancel is never reported as a source change; (iii) a change detected only at the post-check is exactly boundary 4's declared limit and the status text says so. The precise call site is named at P3 against `engine/src/stream.rs`, which the consult did not read.

**D. Where the ticket→generation mapping lives.** **Both sides, and no generation value crosses the wire.** Kernel side is authoritative — the ticket registry already exists and already has per-dataset lifetime authority (`kernel/src/skp.rs:432`, `cancel_all_for_dataset`) — and it decides refusals under an invalidated G. Client side mirrors by *live-ticket set*, not by value: on invalidation the client clears its live set and drops any batch whose ticket is not in it. This satisfies boundary 4's "every batch is attributed to a generation via its ticket" with **no new wire field** (boundary 9, A3), and both sides fail closed independently. A generation value must not appear in `describe` either; `describe` gains only the three fields boundary 9 names plus the sanity level.

**E. SKP 0.3 bump mechanics, coordinated with Brief B.** Follow the `skp/0.2` precedent exactly (`protocol/skp/SKP-V0.md:456-486`): one literal bumped once on Brief A's branch; plain `==` comparison retained (`kernel/src/skp.rs:438-443`); `deny_unknown_fields` both directions; **every fixture on both the Rust and the TypeScript side updated in the same commit**; an appended §8 change-log entry listing the version's **full** field set. While 0.3 is unmerged, further additions to it are appended addenda to that same entry — the `skp/0.2` P2/P3c addendum precedent (`SKP-V0.md:482-484`). **Once Brief A merges to `main`, 0.3's field set is closed and Brief B bumps to 0.4.** `skp/1` stays RESERVED (`protocol/skp/src/v0/mod.rs:22-23`).

**F. Conditional escalation, flagged now.** `file_row_number` appears nowhere in this tree (grepped: the brief is its only occurrence). Whether the vendored `duckdb` crate exposes it on the `read_parquet` path is verified at the **start** of P3, before any session-ordinal code. If it is unavailable, the identity mechanism itself changes and the question becomes the human's, not the architect's.

**G. Naming.** `generation` already names a connection **lease** generation in `engine/src/pool.rs:406,426-434` (`ConnectionFacts.lease_generation`, ADR-004 Amendment 4). Brief A's dataset-session generation G is named distinctly at P3 (`dataset_session_generation` or equivalent) so the A2 grep test reads the right symbol.

**H. A fourth typed refusal.** Boundary 9 names three new typed refusals, all open/describe-class; boundary 8's degrees-publish preflight refusal is a publish-class refusal boundary 8 mandates independently. Read together, not as a contradiction; its name is minted at P2 and this reading is recorded so A3/A5 reviewers do not read it as scope creep.

---

## Appendix A — the pinned GeoParquet `crs` text (entry-51 discipline)

*Pinned 2026-09-10 by a P0 pinning pass (entry-51 discipline: URL, commit, UTC retrieval time, sha256, byte count; every quoted line re-checked verbatim against the fetched bytes; the fetched bytes' git blob hashes match the repository blobs at the named commits). Shaped after `spikes/item8-crs-catalog-extension/README.md` §2, whose pin covers the axis-order passages of the rendered 1.1.0 page only; this appendix pins the `crs` key's text from the tagged raw markdown and nothing else. The two pins are of different artifacts of the same version — recorded, not reconciled here.*

### 1. What was fetched

Source repository: `opengeospatial/geoparquet`, file `format-specs/geoparquet.md`, fetched raw over
HTTPS with `curl` (HTTP 200 in all four cases).

| Ref | URL fetched | Commit at that ref | Retrieved (UTC) | sha256 of fetched bytes | Bytes |
| --- | --- | --- | --- | --- | --- |
| `v1.0.0` | <https://raw.githubusercontent.com/opengeospatial/geoparquet/v1.0.0/format-specs/geoparquet.md> | `53d90c6423af82c3d12273ff4d8083dac7453948` | 2026-09-10T11:01:22Z | `347e5917b247e3f249fd8f684b38a15d7c6f2889128a5c0c5979ada4961adc65` | 15,135 |
| `v1.1.0` | <https://raw.githubusercontent.com/opengeospatial/geoparquet/v1.1.0/format-specs/geoparquet.md> | `525b8f9150db637a7dfa9d8ba46af5f0ed354094` | 2026-09-10T11:01:23Z | `c80590c262b4d7e96e1bf86d4a6d7b59dd38b11e2c0372e500da6e9b68e8a087` | 24,169 |
| `v2.0.0-rc.1` | <https://raw.githubusercontent.com/opengeospatial/geoparquet/v2.0.0-rc.1/format-specs/geoparquet.md> | `0c7fab74cf1177e2fe61df8eb7fcd1813b73e4aa` | 2026-09-10T11:01:24Z | `370e2efcb1b6a755660fab01f15f4d2240d070f9b29dcfd773c3de3c6ab65f30` | 25,500 |
| `main` | <https://raw.githubusercontent.com/opengeospatial/geoparquet/main/format-specs/geoparquet.md> | `4c9f87e5226e36f2022d6bd7d3c1980debdf7431` (HEAD at fetch time) | 2026-09-10T11:01:24Z | `3a80f2846a52cd44bf7cfc4504fb103581e6325cf4222535d90dbb1ae528615f` | 29,808 |

**There is no `v2.0.0` tag.** `gh api repos/opengeospatial/geoparquet/git/ref/tags/v2.0.0` returned
HTTP 404. The published tags are `v0.1.0`, `v0.2.0`, `v0.3.0`, `v0.4.0`, `v1.0.0-beta.1`,
`v1.0.0-rc.1`, `v1.0.0`, `v1.1.0`, `v1.1.0+p1`, `v2.0.0-rc.1`. So 2.0.0 is pinned twice: at the
release-candidate tag and at `main`, both of which state their version as 2.0.0 (§2.4).

`v1.0.0` and `v1.1.0` are annotated tags (tag objects `00b96bd4b6b6d8a0e16a54085435cff519e98f41`
and `8399f80565fab8a7b497634ab928e864e059085d` respectively); `v2.0.0-rc.1` is lightweight and
points directly at its commit. The commit column above is the commit each ref resolves to.

**Integrity check.** For each ref the fetched bytes were hashed with `git hash-object` and compared
against the blob sha reported by `gh api repos/opengeospatial/geoparquet/contents/format-specs/geoparquet.md?ref=<commit>`.
All four MATCH, i.e. the bytes quoted below are the bytes in the repository tree at the named commit:

| Ref | blob sha (API) | blob sha (fetched bytes) | |
| --- | --- | --- | --- |
| `v1.0.0` | `bbaa11486bf01d6c940e8828ad3d0a76f2d8f8ec` | `bbaa11486bf01d6c940e8828ad3d0a76f2d8f8ec` | MATCH |
| `v1.1.0` | `46d9f5bab6cf4b632bf0b5b239fe7f5e416a95f6` | `46d9f5bab6cf4b632bf0b5b239fe7f5e416a95f6` | MATCH |
| `v2.0.0-rc.1` | `b041ffbb5d8a574cc84e3c826fd1fca8eba5a259` | `b041ffbb5d8a574cc84e3c826fd1fca8eba5a259` | MATCH |
| `main` | `7547d900069805ed8e2c6beea64ed280d2b41df6` | `7547d900069805ed8e2c6beea64ed280d2b41df6` | MATCH |

### 2. The verbatim text

Every block below was extracted from the fetched bytes by line range and prefixed with `> `; no
character inside a quote was typed by hand, and the markdown is the source's own (links, backticks,
table pipes and all). Line numbers are 1-based into the fetched file.

#### 2.1 GeoParquet 1.0.0 (`v1.0.0`, commit `53d90c6`)

**(b) The version statement** (line 11, under the heading `## Version and schema`):

> This is version 1.0.0 of the GeoParquet specification.  See the [JSON Schema](schema.json) to validate metadata for this version.

**(a) The `crs` field — the column metadata table row** (line 53, in the table under `### Column metadata`):

> | crs            | object\|null | [PROJJSON](https://proj.org/specifications/projjson.html) object representing the Coordinate Reference System (CRS) of the geometry. If the field is not provided, the default CRS is [OGC:CRS84](https://www.opengis.net/def/crs/OGC/1.3/CRS84), which means the data in this column must be stored in longitude, latitude based on the WGS84 datum. |

**(a) The `crs` field — its own section, in full** (lines 59-73, the whole `#### crs` section up to the following `#### epoch` heading):

> #### crs
>
> The Coordinate Reference System (CRS) is an optional parameter for each geometry column defined in GeoParquet format.
>
> The CRS MUST be provided in [PROJJSON](https://proj.org/specifications/projjson.html) format, which is a JSON encoding of [WKT2:2019 / ISO-19162:2019](https://docs.opengeospatial.org/is/18-010r7/18-010r7.html), which itself implements the model of [OGC Topic 2: Referencing by coordinates abstract specification / ISO-19111:2019](http://docs.opengeospatial.org/as/18-005r4/18-005r4.html). Apart from the difference of encodings, the semantics are intended to match WKT2:2019, and a CRS in one encoding can generally be represented in the other.
>
> If CRS is not provided, all coordinates in the geometries MUST use longitude, latitude based on the WGS84 datum, and the default value is [OGC:CRS84](https://www.opengis.net/def/crs/OGC/1.3/CRS84) for CRS-aware implementations.
>
> [OGC:CRS84](https://www.opengis.net/def/crs/OGC/1.3/CRS84) is equivalent to the well-known [EPSG:4326](https://epsg.org/crs_4326/WGS-84.html) but changes the axis from latitude-longitude to longitude-latitude.
>
> Due to the large number of CRSes available and the difficulty of implementing all of them, we expect that a number of implementations will start without support for the optional `crs` field. Users are recommended to store their data in longitude, latitude (OGC:CRS84 or not including the `crs` field) for it to work with the widest number of tools. Data that are more appropriately represented in particular projections may use an alternate coordinate reference system. We expect many tools will support alternate CRSes, but encourage users to check to ensure their chosen tool supports their chosen CRS.
>
> See below for additional details about representing or identifying OGC:CRS84.
>
> The value of this key may be explicitly set to `null` to indicate that there is no CRS assigned to this column (CRS is undefined or unknown).


#### 2.2 GeoParquet 1.1.0 (`v1.1.0`, commit `525b8f9`)

**(b) The version statement** (line 11):

> This is version 1.1.0 of the GeoParquet specification.  See the [JSON Schema](schema.json) to validate metadata for this version. See [Version Compatibility](#version-compatibility) for details on version compatibility guarantees.

**(a) The `crs` field — the column metadata table row** (line 54):

> | crs            | object\|null | [PROJJSON](https://proj.org/specifications/projjson.html) object representing the Coordinate Reference System (CRS) of the geometry. If the field is not provided, the default CRS is [OGC:CRS84](https://www.opengis.net/def/crs/OGC/1.3/CRS84), which means the data in this column must be stored in longitude, latitude based on the WGS84 datum. |

**(a) The `crs` field — its own section, in full** (lines 62-76):

> #### crs
>
> The Coordinate Reference System (CRS) is an optional parameter for each geometry column defined in GeoParquet format.
>
> The CRS MUST be provided in [PROJJSON](https://proj.org/specifications/projjson.html) format, which is a JSON encoding of [WKT2:2019 / ISO-19162:2019](https://docs.opengeospatial.org/is/18-010r7/18-010r7.html), which itself implements the model of [OGC Topic 2: Referencing by coordinates abstract specification / ISO-19111:2019](http://docs.opengeospatial.org/as/18-005r4/18-005r4.html). Apart from the difference of encodings, the semantics are intended to match WKT2:2019, and a CRS in one encoding can generally be represented in the other.
>
> If the `crs` key does not exist, all coordinates in the geometries MUST use longitude, latitude based on the WGS84 datum, and the default value is [OGC:CRS84](https://www.opengis.net/def/crs/OGC/1.3/CRS84) for CRS-aware implementations. Note that a missing `crs` key has different meaning than a `crs` key set to `null` (see below).
>
> [OGC:CRS84](https://www.opengis.net/def/crs/OGC/1.3/CRS84) is equivalent to the well-known [EPSG:4326](https://epsg.org/crs_4326/WGS-84.html) but changes the axis from latitude-longitude to longitude-latitude.
>
> Due to the large number of CRSes available and the difficulty of implementing all of them, we expect that a number of implementations will start without support for the optional `crs` field. Users are recommended to store their data in longitude, latitude (OGC:CRS84 or not including the `crs` field) for it to work with the widest number of tools. Data that are more appropriately represented in particular projections may use an alternate coordinate reference system. We expect many tools will support alternate CRSes, but encourage users to check to ensure their chosen tool supports their chosen CRS.
>
> See below for additional details about representing or identifying OGC:CRS84.
>
> The value of this key may be explicitly set to `null` to indicate that there is no CRS assigned to this column (CRS is undefined or unknown).


#### 2.3 GeoParquet 2.0.0 at `v2.0.0-rc.1` (commit `0c7fab7`)

**(b) The version statement** (line 11) — the document calls itself 2.0.0, at a tag named `-rc.1`:

> This is version 2.0.0 of the GeoParquet specification.  See the [JSON Schema](schema.json) to validate metadata for this version. See [Version Compatibility](#version-compatibility) for details on version compatibility guarantees.

**(a) The `crs` field — the column metadata table row** (line 52):

> | crs            | object\|null | [PROJJSON](https://proj.org/specifications/projjson.html) object representing the Coordinate Reference System (CRS) of the geometry, or `null` if the CRS is undefined or unknown. It MUST describe the same CRS as the Parquet logical-type `crs` property on the geometry column (see [`crs` Parquet property](#crs-parquet-property)). If the field is not provided, the default CRS is [OGC:CRS84](https://www.opengis.net/def/crs/OGC/1.3/CRS84), which means the data in this column must be stored in longitude, latitude based on the WGS84 datum. |

**(a) The `crs` field — its own section, lines 58-74** (the `#### crs` section up to the following `##### `crs` Parquet property` subheading, which is quoted separately below):

> #### crs
>
> The Coordinate Reference System (CRS) is an optional parameter for each geometry column defined in GeoParquet format.
>
> Since GeoParquet 2 the CRS travels with the geometry column on the Parquet `GEOMETRY`/`GEOGRAPHY` logical type's `crs` property, which is the source of truth (see [`crs` Parquet property](#crs-parquet-property)). That Parquet property is flexible and MAY identify the CRS in several forms. The GeoParquet column-metadata `crs` field described here restates that same CRS for files that carry GeoParquet `geo` metadata. (Writing that metadata is itself optional — a writer MAY emit only the native Parquet geospatial types — but a file that does carry GeoParquet metadata describes its CRS here.) Unlike the Parquet property, the GeoParquet `crs` field MUST be inline PROJJSON (or `null`), so that a reader of the GeoParquet metadata can always obtain a complete CRS definition directly, without resolving an authority code against an external registry.
>
> The CRS, when given in the GeoParquet column-metadata `crs` field, MUST be provided in [PROJJSON](https://proj.org/specifications/projjson.html) format, which is a JSON encoding of [WKT2:2019 / ISO-19162:2019](https://docs.opengeospatial.org/is/18-010r7/18-010r7.html), which itself implements the model of [OGC Topic 2: Referencing by coordinates abstract specification / ISO-19111:2019](http://docs.opengeospatial.org/as/18-005r4/18-005r4.html). Apart from the difference of encodings, the semantics are intended to match WKT2:2019, and a CRS in one encoding can generally be represented in the other.
>
> If the `crs` key does not exist, all coordinates in the geometries MUST use longitude, latitude based on the WGS84 datum, and the default value is [OGC:CRS84](https://www.opengis.net/def/crs/OGC/1.3/CRS84) for CRS-aware implementations. Note that a missing `crs` key has different meaning than a `crs` key set to `null` (see below).
>
> [OGC:CRS84](https://www.opengis.net/def/crs/OGC/1.3/CRS84) is equivalent to the well-known [EPSG:4326](https://epsg.org/crs_4326/WGS-84.html) but changes the axis from latitude-longitude to longitude-latitude.
>
> See below for additional details about representing or identifying OGC:CRS84.
>
> The value of this key may be explicitly set to `null` to indicate that there is no CRS assigned to this column (CRS is undefined or unknown). When the GeoParquet column-metadata `crs` is `null`, the Parquet logical-type `crs` property SHOULD be set to the string `srid:0` (see [`crs` Parquet property](#crs-parquet-property)).
>
> The GeoParquet column-metadata `crs` field, when present, MUST describe the same CRS as the Parquet `crs` property on the `GEOMETRY` or `GEOGRAPHY` logical type. Because the GeoParquet field is always inline PROJJSON (or `null`) while the Parquet property MAY use other forms, the two need not be byte-for-byte identical, but they MUST NOT describe different coordinate reference systems.

**The 2.0.0 mapping table** (lines 97-102, inside `##### `crs` Parquet property`), which states the absent case in tabular form:

> | Parquet logical-type `crs`              | GeoParquet column-metadata `crs`           | Meaning                                       |
> | --------------------------------------- | ------------------------------------------ | --------------------------------------------- |
> | absent (Parquet default)                | absent                                     | OGC:CRS84                                     |
> | inline PROJJSON object                  | the same CRS as inline PROJJSON            | CRS fully described in metadata               |
> | `<authority>:<code>` string             | the resolved CRS as inline PROJJSON        | CRS identified by an authority code           |
> | `srid:0`                                | `null`                                     | CRS undefined or unknown                      |


#### 2.4 GeoParquet 2.0.0 at `main` (commit `4c9f87e`, HEAD at fetch time)

**(b) The version statement** (line 11):

> This is version 2.0.0 of the GeoParquet specification.  See the [JSON Schema](schema.json) to validate metadata for this version. See [Version Compatibility](#version-compatibility) for details on version compatibility guarantees.

**(a) The `crs` field — the column metadata table row** (line 52):

> | crs            | object\|null | [PROJJSON](https://proj.org/specifications/projjson.html) object representing the Coordinate Reference System (CRS) of the geometry, or `null` if the CRS is undefined or unknown. It MUST describe the same CRS as the Parquet logical-type `crs` property on the geometry column (see [`crs` Parquet property](#crs-parquet-property)). If the field is not provided, the default CRS is [OGC:CRS84](https://www.opengis.net/def/crs/OGC/1.3/CRS84), which means the data in this column must be stored in longitude, latitude based on the WGS84 datum. |

**(a) The `crs` field — its own section, lines 59-75:**

> #### crs
>
> The Coordinate Reference System (CRS) is an optional parameter for each geometry column defined in GeoParquet format.
>
> Since GeoParquet 2 the CRS travels with the geometry column on the Parquet `GEOMETRY`/`GEOGRAPHY` logical type's `crs` property, which is the source of truth (see [`crs` Parquet property](#crs-parquet-property)). That Parquet property is flexible and MAY identify the CRS in several forms. The GeoParquet column-metadata `crs` field described here restates that same CRS for files that carry GeoParquet `geo` metadata. (Writing that metadata is itself optional — a writer MAY emit only the native Parquet geospatial types — but a file that does carry GeoParquet metadata describes its CRS here.) Unlike the Parquet property, the GeoParquet `crs` field MUST be inline PROJJSON (or `null`), so that a reader of the GeoParquet metadata can always obtain a complete CRS definition directly, without resolving an authority code against an external registry.
>
> The CRS, when given in the GeoParquet column-metadata `crs` field, MUST be provided in [PROJJSON](https://proj.org/specifications/projjson.html) format, which is a JSON encoding of [WKT2:2019 / ISO-19162:2019](https://docs.opengeospatial.org/is/18-010r7/18-010r7.html), which itself implements the model of [OGC Topic 2: Referencing by coordinates abstract specification / ISO-19111:2019](http://docs.opengeospatial.org/as/18-005r4/18-005r4.html). Apart from the difference of encodings, the semantics are intended to match WKT2:2019, and a CRS in one encoding can generally be represented in the other.
>
> If the `crs` key does not exist, all coordinates in the geometries MUST use longitude, latitude based on the WGS84 datum, and the default value is [OGC:CRS84](https://www.opengis.net/def/crs/OGC/1.3/CRS84) for CRS-aware implementations. Note that a missing `crs` key has different meaning than a `crs` key set to `null` (see below).
>
> [OGC:CRS84](https://www.opengis.net/def/crs/OGC/1.3/CRS84) is equivalent to the well-known [EPSG:4326](https://epsg.org/crs_4326/WGS-84.html) but changes the axis from latitude-longitude to longitude-latitude.
>
> See below for additional details about representing or identifying OGC:CRS84.
>
> The value of this key may be explicitly set to `null` to indicate that there is no CRS assigned to this column (CRS is undefined or unknown). When the GeoParquet column-metadata `crs` is `null`, the Parquet logical-type `crs` property SHOULD be set to the string `srid:0` (see [`crs` Parquet property](#crs-parquet-property)).
>
> The GeoParquet column-metadata `crs` field, when present, MUST describe the same CRS as the Parquet `crs` property on the `GEOMETRY` or `GEOGRAPHY` logical type. Because the GeoParquet field is always inline PROJJSON (or `null`) while the Parquet property MAY use other forms, the two need not be byte-for-byte identical, but they MUST NOT describe different coordinate reference systems.

**The mapping table** (lines 98-103):

> | Parquet logical-type `crs`              | GeoParquet column-metadata `crs`           | Meaning                                       |
> | --------------------------------------- | ------------------------------------------ | --------------------------------------------- |
> | absent (Parquet default)                | absent                                     | OGC:CRS84                                     |
> | inline PROJJSON object                  | the same CRS as inline PROJJSON            | CRS fully described in metadata               |
> | `<authority>:<code>` string             | the resolved CRS as inline PROJJSON        | CRS identified by an authority code           |
> | `srid:0`                                | `null`                                     | CRS undefined or unknown                      |


### 3. The differences between the versions, in the pinned sentences

Each statement here was checked mechanically against the fetched bytes (`diff` of the single lines,
`grep -c` of the phrases), not read off by eye:

1. **The absent-key default is the same in all three versions: OGC:CRS84.** The column-metadata
   table row's default clause — "If the field is not provided, the default CRS is
   [OGC:CRS84](...)" — is present in 1.0.0, 1.1.0 and 2.0.0. The 1.0.0 and 1.1.0 table rows are
   byte-identical (`diff` of `v1.0.0:53` against `v1.1.0:54` is empty).

2. **1.0.0 does not state that an absent `crs` differs from `crs: null`; 1.1.0 does.** The phrase
   "different meaning" occurs zero times in the 1.0.0 file and once in each of 1.1.0, `v2.0.0-rc.1`
   and `main` (`grep -c`). 1.0.0's wording is "If CRS is not provided, ..." (one occurrence in
   1.0.0, zero in every later version); 1.1.0 rewrote that opening to "If the `crs` key does not
   exist, ..." and appended "Note that a missing `crs` key has different meaning than a `crs` key
   set to `null` (see below)." So 1.0.0 does carry both statements separately — the absent default
   (OGC:CRS84) and the meaning of an explicit `null` (CRS undefined or unknown), that `null`
   sentence being byte-identical in 1.0.0 and 1.1.0 — but it never says in so many words that the
   two cases are distinct. 1.1.0 makes the distinction explicit. On the pinned text, this is a
   clarification of wording, not a change of the absent-key default: in neither version does the
   absent case resolve to anything but OGC:CRS84.

3. **2.0.0 did not change the default.** The sentence "If the `crs` key does not exist, all
   coordinates in the geometries MUST use longitude, latitude based on the WGS84 datum, and the
   default value is [OGC:CRS84](...) for CRS-aware implementations. Note that a missing `crs` key
   has different meaning than a `crs` key set to `null` (see below)." is byte-identical across
   1.1.0 (`:68`), `v2.0.0-rc.1` (`:66`) and `main` (`:67`). 2.0.0 adds material around it — the
   `crs` field must be inline PROJJSON, it must agree with the Parquet `GEOMETRY`/`GEOGRAPHY`
   logical type's own `crs` property, `null` pairs with `srid:0` — and a mapping table whose first
   row states the absent case again: Parquet `crs` absent + GeoParquet `crs` absent = OGC:CRS84.
   The default itself is unchanged from 1.0.0 through 2.0.0.

4. **`v2.0.0-rc.1` and `main` carry the same `crs` section.** A `diff` of the extracted `#### crs`
   sections of the two files is empty. The files differ elsewhere (`main` adds the headings
   `#### covering`, `##### bbox covering encoding` and `### Bounding Box Columns`, and is 4,308
   bytes larger); both state their version as 2.0.0. No `v2.0.0` tag exists to pin instead (§1).

### 4. What this pin does and does not establish

It establishes what the specification states, at four named commits, with the bytes hashed and the
hashes checked against the repository's own blob shas: that in GeoParquet 1.0.0, 1.1.0 and 2.0.0 an
ABSENT `crs` key means OGC:CRS84, that an explicit `crs: null` means the CRS is undefined or
unknown, and that from 1.1.0 onward the specification says in its own words that those two cases
differ. That is the whole of it.

It establishes nothing about any producer's conformance. A file written by any tool may omit the
`crs` key while holding coordinates that are not longitude/latitude on WGS84; the specification's
default is what a conformant reader is told to assume, not a fact about the bytes in front of it,
and no quotation here can convict or acquit a particular writer — that needs a falsification check
against the file itself, which can convict and never confirm (the discipline of
`spikes/item8-crs-catalog-extension/README.md` §2). Nor does this record say what our engine should
do when the key is absent: whether to assume the default, to refuse, or to surface the absence as an
undefined CRS is a decision for the CRS-type rules (docs/01's "CRS is a type"; ADR-015 §5's
territory) and the human's, not something a pinned quotation settles.

## §14. Amendments recorded at P2 (architect-routed values)

*Drafted 2026-09-10 at Brief A's P2, **after P1's results were seen** (P1 landed at 92d87f1) — §5's
rule. What it touches: P2's own declared values only. No P1 outcome, prediction (§3, §5) or fixture
(§4) is altered by it, and none is invalidated.*

*(Custodian's filing note: the four items below are the architect agent's text, appended verbatim on the P2 consult of 2026-09-10 under Draft 2 boundary 5 — "architect sets the value; recorded in the preregistration". Item IV is the human's and is queued as DECISIONS-PENDING entry 81; nothing in item IV is decided here.)*

- **I. The coordinate unit is read, never inferred.** From `coordinate_system.axis[0..2].unit` of the
  admitted PROJJSON only — never `base_crs`, never `conversion.parameters[].unit` (`engine/src/crs-catalog.json:8`).
  Both axes angular-degree → degrees instance; disagreeing, missing or unrecognized → `unestablished`,
  which is **not** an instance and **not** a refusal. Recorded on `AdmissionRecord` (`engine/src/geoparquet.rs:177-188`).
- **II. `MIN_ANCHOR_SPAN` under degrees = `1e-6` degree** (`frontends/shell/src/canvas/tileGrid.ts:78`
  is the metre-basis value). Declared, not discovered (ADR-010 rule 6); the arithmetic is in the P2
  architect consult. Sibling owed, value NOT set: `RECENTER_MAX_DRIFT_M` (`offsetFrame.ts:37`).
- **III. The fourth typed refusal** is `publish.geographic_crs_not_publishable`, publish-class
  (§13 H), a `PublishError` variant (`kernel/src/publish/error.rs`) with no SKP code and no
  `error_of` arm — publish is not an SKP command (`protocol/skp/SKP-V0.md:175`).
- **IV. Open, the human's:** whether an absent-key CRS84 admit (definition `None`,
  `geoparquet.rs:392-399`) yields the instance. Unresolved, §3 row 8's degrees prediction stands
  unmet and is recorded as a deviation at P4 (§8).
- **V. Item IV resolved — 2026-09-11, the human (DECISIONS-PENDING entry 81 = "(b), unit:format-rule
  beside unit:definition"); recorded BEFORE the code.** The pinned format rule is a second admissible
  source of the unit fact: the R-C2 (absent-key, pinned-version) admission records `coordinate_unit =
  degree` on both axes with `coordinate_unit_source = unit:format-rule`; `unit:definition` is unchanged;
  the identifier string stays forbidden as a source; no definition is invented. §3 row 8's degrees
  prediction is thereby reachable (at the publish preflight, P2's held part). The P4 record names item
  I's original reading, this resolution and its date. The Proposed ADR-013 amendment carries the
  matching clarification, appended the same day.

### Amendment 2 — corrections to Amendment 1, and the P3 gate-fix round (2026-09-16, appended)

**Written after the P3 gate outcomes were seen** (reviewer FAIL and architect FAIL, attempt 1), and
after the fixes below were written and run. §12e's rule, honoured in this line. **Amendment 1 is not
edited**: every item here corrects or extends it by appending, and each says which item it touches.

1. **Correcting Amendment 1 item 4's "Rules (i), (ii) and (iii) are implemented as written."** That
   sentence was not true of rule (ii). The flag rule (ii) needs —
   `StreamStats::source_changed_detail` — was written by the producer and **read by nobody**, so a
   cancelled stream's detected change ended no generation; and on the error path the terminal was
   sent *before* the post-check ran, so even a reader would have raced it. Both are fixed in this
   round: `crate::EngineSource` reads the flag on every terminal class (clean, error, cancelled, and
   `Drop` as the backstop) and ends the generation through `SessionInvalidator`; the producer now
   decides the lease, runs the post-check, records the finding, and only then emits any terminal.
   Rules (i) and (iii) were as described. **The claim was wrong at the time it was written, and the
   correction is recorded rather than the original edited.**

2. **`describe.crs.display_convention` is a P2-licensed field, not a boundary-9 one.** Amendment 1
   item 6 leaned on boundary 9's word "only" while `describe` also carries this fifth member. The
   licence is separate and predates it: `state/NEXT-CUT.md:102` (P2) puts the ruled equirectangular
   wording "in status + describe", and the P2 architect's carry-over note requires P3 to carry it
   "over the wire via describe, never as a second TypeScript literal". So `describe` gains
   boundary 9's four **plus** this one, by P2's own authority, and the two lists are recorded apart
   rather than blurred into one.

3. **`crs.source` gains a third value, `format-rule` — the human's ruling of 2026-09-16.**
   `DECISIONS-PENDING.md` RULED 2026-09-16 — question round 3, item 3, applied verbatim: the value
   sits beside `file` and `caller_asserted`, `crs.provenance` carries the specific class
   (`crs:format-default`), the published manifest carries the same value, and it is recorded as a
   value-domain widening under the `skp/0.3` bump (`protocol/skp/SKP-V0.md`'s own addendum). This
   settles the P1 reviewer's Finding 1, which Amendment 1 left flagged rather than fixed: recording
   a format-rule admission as `file` said the file declared a CRS it does not declare, and that
   false record reached published bundle manifests. Assertions are re-aimed with the ruling named at
   each site.

4. **The pre-check now maps an unreadable source onto `SourceChanged`, as the post-check always
   did.** Amendment 1 did not record that the two disagreed. They did: the pre-check propagated
   `SourceDescriptor::of`'s failure as `EngineError::Source`, so a source deleted or locked
   mid-session refused with a type the host does not match on and **left the generation live**.
   Both checks now route through `SourceDescriptor::refuse_if_changed_or_unreadable`, which is the
   whole of the invariant `descriptor.rs` states.

5. **Correcting Amendment 1 item 5's accounting of `InternalInconsistency`.** Two things in it were
   wrong. It attributed the retype to "a scoped carry-over the brief names" — **there is no such
   source**: `state/NEXT-CUT.md` contains no such item, and the claim is withdrawn here and dropped
   from all four code sites. The retype stands on its own reasoning (`EngineError::Source` means
   "the file could not be opened or read at all", and a caller shown that for a contradiction in
   this tree's own record goes looking at their file for a defect that is in this code). And it
   understated the count: the variant mints a **fifth typed SKP code** for this cut,
   `engine.internal_inconsistency`, beside boundary 9's three and boundary 8's publish-class one —
   not merely an `EngineError` variant. No input reaches it that did not already reach
   `EngineError::Source`.

6. **Correcting Amendment 1 item 1's joining of two different things.** That item reported the
   escalation probe's corpus figures (240 rows, `min 0`, `max 239`, 240 distinct, from
   `geopandas/gp-epsg2056-intkey.parquet`) and the standing test in one breath. They are not the
   same run: the **standing** test
   (`engine/tests/session_identity.rs::the_vendored_duckdb_exposes_file_row_number_on_read_parquet`)
   generates its own 500-row fixture and asserts the same *properties* — 0-based, dense, distinct by
   construction, and available on the bound-parameter form — against that file. The corpus figures
   stand as what the one-off probe observed on that one corpus file and are **not** re-observed by
   the standing test; that file is P4's to open under its preregistered expectation.

7. **Correcting Amendment 1 item 3's markdown.** It renders the Windows extended-length prefix as
   `\?\`; the prefix is `\\?\`, and the doubled backslash was consumed by markdown escaping. The
   code and its own comment carry the correct form.

8. **R-I4's detection was widened in this round, and the trade-off is recorded.** Amendment 1 item 3
   described `*` and `?` only, excluding `[` on the reasoning that a bracket in a real directory
   name is ordinary. DuckDB's `read_parquet` also expands `[...]` character classes and `{a,b}`
   brace alternation, so all six characters are detected now. **The false positive is accepted and
   is visible**: a literal file whose name contains one of them is refused by name even though it is
   one file, and the refusal says the path was read as naming more than one file — a sentence an
   operator can act on. The alternative is silent: DuckDB expands the pattern, the source becomes a
   multi-file scan, and `file_row_number` becomes a per-file ordinal reused across files — the
   session tier's identity colliding with nothing said, which is the outcome R-I4 exists to prevent.
   The check is deliberately **not** stat-based: it is a property of the path text alone, so the
   same path is never admitted or refused according to what happens to be on disk.

9. **A descriptor on a filesystem that reports no modification time degrades; it does not refuse.**
   Not recorded in Amendment 1 because it was not noticed: `components_differing_from` treated an
   absent mtime as a difference unconditionally, so on such a filesystem every query refused forever
   with the false sentence "the source file changed". Three cases now, not two — both present, an
   ordinary comparison; **neither** present, a **degradation** whose text names the unavailable
   component (boundary 5's "the degradation is shown", applied to mtime as it already was to the
   footer); one present and the other not, still a difference, because that is observable and
   fail-closed governs it.

10. **The generation map is bounded.** Not recorded in Amendment 1 because it was not noticed:
    ticket attributions accumulated for the life of the process, removed only by `close_dataset`.
    They are pruned now on every mutating call, on the sibling `StreamRegistry`'s own discipline —
    by age (`TICKET_TTL + TERMINAL_ENTRY_MAX_AGE`, the sum, because a ticket may sit pending for a
    whole TTL before its terminal clock starts) and by the rule that an attribution naming a
    generation that is no longer live can only ever answer what a missing entry already answers.

11. **No dead public API.** `GenerationRegistry::is_invalidated` and `::live_generation` had no
    callers and are gone; `::ticket_is_live` gained the caller it was written for — ticket
    **redemption** (`EngineSourceFactory::create_from_ticket`), so a ticket whose generation ended
    between mint and redeem never produces a stream, kernel-authoritatively and without depending on
    the client's mirror having noticed; and `SkpHost::generations()` is what hands that registry to
    the factory. `attributed_ticket_count` is new and exists so item 10's bound is assertable rather
    than asserted about in prose.

12. **What this round still does not build.** Unchanged from Amendment 1 item 9: no gate test
    (G-A1–G-A4 are P5's), no corpus run (P4), no Part N, no KNOWN-LIMITATIONS, no ADR acceptance
    (P6), and no duration, rate or performance word anywhere (A6). The pre-check's cost shape — a
    footer read and a SHA-256 per query issue — is **unchanged and deliberately not weakened**: it
    is what boundary 4 and R-D2 ask for, and any relaxation is the human's question, not this
    round's.

### Amendment 3 — the P3 split, on the human's ruling (2026-09-16, appended)

**Written after the attempt-2 gate outcomes were seen (reviewer FAIL, architect FAIL) and after the
human's ruling of 2026-09-16 (round 4) that split the piece.** §12e's rule, honoured in this line.
Amendments 1 and 2 are not edited; item 11 below corrects one of Amendment 2's claims by appending.

**The ruling, verbatim:**

> "Split P3, on conditions. The landing half (P3a) contains only code with a real product caller and
> an end-to-end test from the real producer/consumer shape — both gates run the grep: no callback,
> code path or pub item lands without a caller; the unwired dead-ticket refusal and its fabricated
> source-change are removed from P3a, not carried; the publish-consumer regression is fixed in P3a
> (the shell parses the refusal code — no operator-visible regression on main); the Drop-backstop
> comment corrected. P3a claims nothing about boundary 4: the ADR-016 amendment's acceptance and any
> statement that detection "clears residency and refuses picks" wait for P3b, and the ledger says
> so. P3b gets its own preregistration and gates: the owner-side invalidation (residency cleared,
> picks refused — the consequence P3's own row promised), the kernel-authoritative dead-ticket
> refusal wired with a real caller and correct unknown-handle behaviour, and the §12e amendment
> recording the split. No release includes P3a without P3b. Class fix, permanent, in the worker
> brief and both gate checklists: any cross-module seam is written against the interface the other
> side actually has — read it first — and is proven by one end-to-end test from the real shape; a
> test that encodes an imagined interface is a gate failure by name."

**1. What P3a lands.** The session identity tier (R-I3/R-I4) and its record; the structural
descriptor with the pre-check and the post-check (R-D1/R-D2, §13 C); the kernel's
`GenerationRegistry` with its pruning, minting, attribution and `end_generation`, all reached from
`SkpHost`'s own product paths; `SessionInvalidator`, held by every `EngineSource`; the typed code
carried into both stringified refusal surfaces, each proven end to end from the producing side; SKP
0.3 with its fixtures; the P2-held publish preflight refusal; and the 2026-09-16 round-3 `crs.source`
ruling.

**2. What is REMOVED rather than carried.** Every item below had **zero product callers**, verified
by grep before removal:

- `EngineSourceFactory::ticket_only_with_generations` — nothing ever constructed a factory that
  held the generation map, so the guard it existed for never ran in any build.
- The redemption-time `ticket_is_live` guard in `kernel/src/lib.rs`, **and its fabricated
  source-change refusal**. That refusal told a caller its source "was observed to have changed" for
  any handle the map did not know — expired, already redeemed, never minted — which is a diagnosis
  the kernel had not made (`docs/01` principle 8). It is not softened and re-landed; it is gone.
- `GenerationRegistry::ticket_is_live`, which had no caller left once the guard went. A test-only
  caller does not count under the ruling.
- `SkpHost::generations()` and `SkpHost::invalidator()` — accessors for a field the host already
  passes directly. The **field** stays; the accessors are gone.
- `onSessionEnded` on both streaming managers, and `TileViewportStreamManager.isSessionEnded()`.
  No owner subscribed to either.

**3. What is DEFERRED to P3b, and therefore claimed nowhere in P3a.**

- **Owner-side invalidation: residency cleared and picks refused.** P3a's managers drop their
  tickets, cancel their own queued and in-flight work, and latch closed. They do **not** clear the
  resident geometry and do **not** refuse picks — neither lives in a manager. Every comment and test
  narration that said or implied otherwise has been deleted or rewritten; what an operator sees today
  is that filling stops and stale batches are dropped, and the view already on screen stays.
- The kernel-authoritative dead-ticket refusal, wired to a real caller, with correct three-valued
  unknown-handle behaviour.
- **The ADR-016 Amendment 1 acceptance**, which stays Proposed and binds nothing.
- Boundary 4's own sentence about detection clearing residency and refusing picks. P3a does not
  claim boundary 4 is satisfied.

**No release includes P3a without P3b.**

**4. The publish-consumer regression, fixed.** `PublishError::refusal_detail()` produced
`"<code>: <display>"`, but `frontends/shell/src/publish/formatPublishRefusal.ts` — the real consumer,
which `PublishPanel.tsx` calls and `RefusalBlock.tsx` renders — hardcoded `code: "publish-refused"`
and passed the message through whole. So the machine prefix reached the operator as raw text *and*
the code was discarded, making `refusalGuidance` unreachable for every publish code: an
operator-visible regression that would have shipped. The consumer now parses the prefix, returns the
real `publish.*` code, and strips it from the message. Both of `publish.rs`'s preflight sites send
the prefixed form, so SKP-V0.md's sentence is true of the surface it names, and that sentence is now
scoped to `PublishError` (the same seam carries permission errors and IPC rejections, which have no
code and are not given one). The shell's test input is the kernel's own output, captured from a real
`cargo test` run and pinned on the Rust side as an exact-equality assertion, so a drift fails in the
producer's suite first.

**5. The `Drop`-backstop comment, corrected.** It claimed `Drop` was a backstop that would catch a
post-check finding on an abandoned stream. `BatchStream::drop` cancels the token and returns — it
does **not** join the producer — so the flag may still be empty at that point and nothing is ended
there. The residual is now stated where the code is: the change is not lost, but its invalidation is
**deferred to the next query issue's pre-check** rather than happening at drop.

**6. `unreachable!()` retyped.** `dataset::open_inner`'s `CrsSource::FormatRule` arm returned
`unreachable!()`; a panic in admission would take down a host serving other datasets over a
contradiction in this tree's own bookkeeping. It returns `EngineError::InternalInconsistency` — the
variant this cut already owns for exactly that condition — behind an unchanged `debug_assert!`.

**7. Three cannibalised doc comments, restored.** Appending to a file above an existing item had
left three functions wearing their neighbour's documentation: `admit_identity`'s ADR-016 §3–§6 block
had migrated onto `partitioned_source_detail`; `DatasetCrs::from_file`'s onto
`recorded_as_format_rule`; and `prune_locked`'s pruning rationale onto `attributed_ticket_count`.
Each is back on its own item, and each of the three displaced items now has its own doc. The cite in
`kernel/tests/session_generation.rs` to "`prune_locked`'s own doc" therefore holds again.

**8. Smaller corrections.** `descriptor.rs`'s intra-doc link named `refuse_unreadable`, which is not
a symbol — it is `refuse_if_changed_or_unreadable`. `kernel/src/skp.rs`'s naming-rule comment listed
the registry's methods and omitted `attributed_ticket_count` while naming the now-removed
`ticket_is_live`. `session_identity.rs`'s cancelled-terminal assertion was
`matches!(terminal, Some(Cancelled) | None)`, which also passed when the cancel was never exercised
at all; it is split so each half fails for the reason it names, and the admissible `None` case is
stated rather than hidden.

**9. The post-check sits inside the cancel-acknowledgement window, recorded in-source.** The R-D2
post-check runs before `PRODUCER_FINISHED`, the producer's cancel-acknowledgement stamp, so that
acknowledgement now also covers a bounded metadata-plus-footer read. **No figure is claimed and none
is implied**; what it costs against `docs/08`'s acknowledgement budget is P5's to measure, and the
comment exists so that measurement knows the term is there. Observed once during this round, and
recorded because it bears on that measurement: `engine/tests/slice.rs`'s
`cancelling_mid_stream_stops_production_promptly` (a pre-existing test with its own declared bound)
failed once in a full parallel workspace run and passed in isolation, in its own suite, and on an
immediate re-run of the same full suite. Reported as an observation, not as a measurement.

**10. Correcting Amendment 2 item 8's "deliberately not stat-based".** That sentence described
R-I4's detection as a property of the path text alone. It is true of the **metacharacter branch**
only: `partitioned_source_detail`'s first branch is `path.is_dir()`, which is a stat. The accurate
statement is that the *glob* decision never consults the filesystem, so a pattern is refused
identically whether or not a literal file of that name happens to exist; the directory decision does
consult it, and must.

**11. Correcting Amendment 2 item 11.** It said `ticket_is_live` "gained the caller it was written
for". That was untrue of the tree: the only caller was reached through a constructor no product code
ever called, so the method was dead in every build that shipped. The claim is withdrawn, and the
method is removed by item 2 above rather than left with a false justification.

**12. The class rule, recorded here because it is permanent.** Any cross-module seam is written
against the interface the other side actually has — read first, cited by `file:line` — and is proven
by one end-to-end test that starts from the real producer or consumer shape. A test that encodes an
imagined interface is a gate failure by name. P3a's two seams each have one: the data-plane terminal
(`kernel/tests/typed_terminal_codes.rs` drives a real ticket through the real factory and reads the
terminal off the real `dyn BatchSource`) and the publish refusal (the shell's parser test, whose
input is the kernel's captured output).

### Amendment 4 — P3a's attempt-2 corrections (2026-09-16, appended)

**Written after P3a's attempt-1 gate outcomes were seen (reviewer FAIL, architect FAIL — narrow;
every removal confirmed absent, the three seams verified from the real shape, this file's Amendment
3 confirmed append-only with the ruling verbatim).** §12e's rule, honoured in this line. Amendments
1–3 are not edited; items (i) and (iv) below correct Amendment 3 by appending.

**(i) Correcting Amendment 3 item 3's "Every comment and test narration that said or implied
otherwise has been deleted or rewritten."** That sentence was untrue of the tree when it was
written. Two survivors carried the deferred consequence as though P3a delivered it:

- `frontends/shell/src/streaming/viewportStreamManager.test.ts` — a test titled *"clears residency,
  refuses further requests, and reports the typed status"*, whose body asserted none of the
  residency clearing. Renamed to what it asserts: *"drops its tickets, refuses further requests, and
  returns session-ended"*.
- `frontends/shell/src/streaming/tileViewportStreamManager.ts` — the `endSession` call-site comment
  claimed "the client half of the invalidation path, **with its consequences**", quoting
  "residency cleared, picks refused, typed status". Rewritten in the shape its untiled sibling
  already carried.

Both are now rewritten. Three kernel-side sentences in the same family are marked **(P3b)** rather
than left in the present tense: `end_generation`'s doc, `terminal_detail_of`'s doc, and
`EngineSource::next_into`'s comment. **The lesson recorded, since this is the second round in which
a narration outlived the behaviour it described:** a claim about a consequence belongs with the code
that performs it, and when the consequence is deferred the claim is deleted rather than reworded
into the conditional.

**(ii) Boundary 5's "the degradation is shown" is NOT met by P3a.** The descriptor records the text
— an over-ceiling footer, or a filesystem reporting no modification time — and
`SourceDescriptor::degradation()` returns it, but **no surface carries it to an operator's eye**.
The one surface that would fit is a `describe` field, and boundary 9's list is closed
(`crs.provenance`, `axis.provenance`, `identity.class` + its statement, the sanity level), so P3a
does not invent one. The code comments that said the text was "in the words shown to the operator"
are corrected to say that nothing shows it.

**Where it is owed: P6.** §12d already routes the cut's user-visible strings to the human's sight at
P6 ("the four new user-visible states whose strings are sighted at P6"), and this is a fifth string
of the same kind — operator-facing words with no settled wording. It is **not** P3b's: P3b's row in
`state/NEXT-CUT.md` is the owner-side invalidation, the dead-ticket refusal and the ADR-016
acceptance, and a degradation notice is none of those. The same disposition covers
`DatasetIdentity::candidate_columns()`, which R-I3 requires to be *recorded* on a session-tier open
and which likewise reaches no operator in P3a: the refusal that used to carry the list no longer
fires on that path.

**(iii) The instrument-accessor category, and the exemption's wording.** Both gates passed
`GenerationRegistry::attributed_ticket_count` on the basis that its doc declares its only caller is
the test suite and why the property must be proven about the shipped build — the precedent being
`spatial_engine`'s `index_consultations`, `row_group_consultations` and `attribute_concatenations`.
P3a applies that consistently:

- **Declared** (four): `GenerationRegistry::attributed_ticket_count`,
  `SourceDescriptor::footer_bytes_read`, `SourceDescriptor::degradation`,
  `DatasetIdentity::candidate_columns`, and on the TypeScript side `LiveTicketSet.size`.
- **Deleted** (three): `SourceDescriptor::byte_size()` and `SourceDescriptor::footer_length()` —
  nothing needed them, including the test, which reads `footer_bytes_read()` instead; and
  `dataset::ordinal_is_physical_not_scan_ordered`, which had no product caller **and which the
  exemption does not cover, because it acts** — it runs two queries rather than reading state the
  build already maintains. Its evidence is not lost: the check is now a local helper inside the one
  test that ever called it, so the physical-vs-scan property is still asserted on a written fixture.
  The corpus-wide verification remains **P4**'s, and P4 may reintroduce a product-side form when it
  has a product caller to justify one.

  Recorded because it is the exemption's first real boundary case: "read-only accessor over state
  the shipped build already maintains" excluded it, and the drafted sentence's closing clause — "It
  exempts nothing that acts" — is what decided it.

**The exemption's wording is pending the human's ruling.** The architect's drafted sentence, recorded
here unaltered so the ruling has something exact to accept or amend: *"The caller rule exempts
instrument accessors: a `pub` read-only accessor over state the shipped build already maintains,
whose doc declares that its only caller is the test suite and why the property must be proven about
the shipped build. It exempts nothing that acts."*

**(iv) Correcting Amendment 3 item 9's cancel-window term.** That item said the post-check now sits
inside "`docs/08`'s acknowledgement budget". It does not. `engine/src/trace.rs:363`'s own table
assigns the instants: *"`cancel_observed` (the worker stopped advancing — **what `docs/08`
budgets**) and `cancel_acknowledged` (the operation quiescent — what `kernel/RESULTS.md`'s fifth
section actually measured)"*, with `cancel_observed` = `PRODUCER_CANCELLED` and `cancel_acknowledged`
= `PRODUCER_FINISHED`. `docs/08:8` budgets `cancel_requested → cancel_observed` and reports
"`cancel_quiescent` … beside it with no budget". `PRODUCER_CANCELLED` is stamped inside `produce()`,
**before** the post-check. So the post-check lands in the **unbudgeted quiescent term**, not in the
budgeted one, and the in-source comment now says so. The observation recorded in Amendment 3 item 9
stands as an observation and still claims no figure.

**(v) A pointer for readers of §12b's G-A2** (`:221`: "residency cleared; picks refused"). That
line is a verbatim quotation inside an append-only document and cannot be edited. Read it with
Amendment 3 item 3: **those two consequences are P3b's**, and G-A2 is not satisfiable by P3a alone.
P3a satisfies G-A2's earlier clauses — the refusal by name at the pre-check and at the post-check
paths separately — and nothing more.

**(vi) Recorded for P3b's scope (the attempt-1 reviewer's suggestion 7).** On the latched
`session-ended` path the baseline owner renders neutral advice — `frontends/shell/src/App.tsx`'s
"not applied — try again" copy — which cannot succeed until the dataset is reopened, because the
manager is latched. Today the typed guidance reaches an operator only by the **pre-check** route (a
`viewport_query` refused synchronously with `engine.source_changed`). P3b owns making the terminal
route say the same thing.

**(vii) The terminal prefix reaching an operator — fixed in P3a, recorded here.** P3a prefixes every
engine terminal's `detail` with its typed code, and the baseline owner interpolated that detail
whole onto the streaming banner (`App.tsx`'s `onFailureTerminal` →
`setCanvasRefusal("stream <kind>: <detail>")`), so an operator would have read
`engine.source_changed: refused: …` as raw text on every failing stream. That is the same
operator-visible regression class the publish consumer had, on the other surface, and the ruling's
"no operator-visible regression on main" covers both. `frontends/shell/src/streaming/
formatTerminalRefusal.ts` now splits the code from the text, in the shape of the publish parser, and
the banner shows the text only. **No owner-side behaviour is added**: nothing clears residency,
latches a pick, or renders a session status — those remain P3b's. The test input is the kernel's own
bytes, captured from a real run and pinned by exact equality in `kernel/tests/typed_terminal_codes.rs`;
the streaming-manager tests now read the same pinned constant instead of a hand-transcribed string,
which also closes the attempt-1 reviewer's suggestion 5.

**(viii) The status string, replaced now rather than left false on main.** The human's ruling of
2026-09-16 (round 5, item 1), verbatim:

> "a false status string does not sit on main between P3a and P3b. Replace P3a's 'Everything read so
> far has been discarded' now, in one docs-class commit, with a sentence true at that commit — 'The
> source file changed while it was open; reopen the dataset to continue.' — and P3b restores the
> stronger sentence when it becomes true, wording at P6."

Applied in its own commit (`docs(shell): the source-changed guidance reads a sentence true at this
commit`). `refusalGuidance("engine.source_changed")` now returns exactly the ruled sentence and
nothing else; the limitation sentences that followed it are P6-sight wording and are **not**
reintroduced in another form. Its test asserts the string **verbatim** — alone among the four
placeholders — because the human ruled these exact words, so a rewording has to break a test rather
than pass as a refactor; the file header's "no test asserts any of them verbatim" was corrected in
the same commit, since that sentence would otherwise have become false there.

**(ix) The cancel window: rule (ii) kept, the cost reported.** The ruling, verbatim:

> "Keep rule (ii); the post-check stays inside the acknowledged term and P5 measures it, no figure
> claimed before. Two obligations: the post-check's cost is reported per cancellation (session log
> or the terminal's timing fields, never silent, its ≤ 8 MiB bound named); and the pre-existing
> slice.rs liveness test is re-aimed to assert the budgeted interval, requested → observed,
> reporting observed → terminal beside it with the disclaimer — a test asserting a budget nobody
> declared is the class that fails once under load and teaches nothing."

Both obligations discharged; the post-check is **not** moved.

*The cost, reported through the engine's existing instruments.* `engine/src/trace.rs` gains
`POST_CHECK_BEGIN` and `POST_CHECK_END` in that module's own shape, so the session log carries the
interval; `POST_CHECK_END`'s `bytes` field carries the footer bytes the check read, and
`StreamStats::post_check_bytes_read` carries the same figure where a stream's terminal stats already
travel. The bound is named at every one of those sites (`FOOTER_DESCRIPTOR_MAX_BYTES`, 8 MiB).
**The bytes come from the read the post-check already performed** — `post_check_source` now returns
them — because counting them with a second descriptor read would have doubled the very cost this
reports. **No duration is claimed in any doc, comment or test.**

*The test, re-aimed.* `engine/tests/slice.rs::cancelling_mid_stream_stops_production_promptly` now
asserts `cancel_requested → cancel_observed` — read from `CANCELLATION_REQUESTED` (stamped by
`CancelToken::cancel` itself, not by the test) and `PRODUCER_CANCELLED`, per `trace.rs:363`'s table
— against the 100 ms `docs/08:8` declares. `observed → terminal received` is **printed, never
asserted**, with the disclaimer that it is the unbudgeted acknowledged term and now contains the
post-check, and the post-check's byte count is printed beside it. The test previously bounded the
consumer's receipt of `Err(Cancelled)` at 100 ms with no disclaimer — a budget nobody declared, and
the one that failed once under load during P3a's own development (Amendment 3 item 9's observation).

**(x) The accessor exemption, adopted with the human's addition.** The ruling, verbatim:

> "Adopt the architect's sentence as written, with one addition: the accessor's doc names the test
> that calls it, so the caller-grep can verify the exemption instead of trusting the words
> 'test-only.' An exemption that can't be grepped is a hole in the rule it exempts from."

So the exemption reads, in full and in force: *"The caller rule exempts instrument accessors: a
`pub` read-only accessor over state the shipped build already maintains, whose doc declares that its
only caller is the test suite and why the property must be proven about the shipped build. It
exempts nothing that acts."* — **and the doc names the test(s) that call it.**

Every declared accessor now names its callers, and each named test was grep-verified to exist:
`GenerationRegistry::attributed_ticket_count` (five tests in `kernel/tests/session_generation.rs`);
`SourceDescriptor::footer_bytes_read` and `SourceDescriptor::degradation` (two each in
`engine/tests/session_identity.rs`); `DatasetIdentity::candidate_columns`
(`engine/tests/session_identity.rs` and `engine/tests/identity.rs`); `LiveTicketSet.size`
(`liveTicketSet.test.ts`). `StreamStats::post_check_bytes_read`, added by item (ix), is declared in
the same shape and names its test.

**Recorded because it is the addition's point:** naming the test converts the exemption from a claim
into something a reviewer can check mechanically — the same move as pinning a cross-module fixture
to the producer's own bytes rather than to a transcription.

### Amendment 5 — P3a's attempt-3 corrections (2026-09-16, appended)

**Written after P3a's attempt-2 gate outcomes were seen (reviewer FAIL, architect FAIL — narrow;
`state/gate-log.json`'s `briefa-p3-p6` attempt-4 entries), and after question round 7 ruled the
scope of this attempt.** §12e's rule, honoured in this line. **Amendments 1–4 are byte-untouched**;
items (v) and (vi) below correct Amendment 4 by appending, as Amendment 4 itself corrected
Amendment 3.

**The fence, applied to this amendment's own words** (the human, 2026-09-16, round 7, permanent in
both gate checklists): *"every "discharged" or "done" clause in an amendment names the test or line
that proves it, and the gate resolves each — a discharge claim with no resolvable proof is a gate
failure by name, the same way an imagined interface and a stale cite are."* Every clause below that
says something is done names either a test by its exact function name or a `file:line`. Where a
thing is **not** done, this amendment says so and names the open item instead.

**Classes used** (`docs/PREREGISTRATION-TEMPLATE.md` §10): **class 5** for (i); **class 4** for each
mutation in (ii); **class 3** for (iii); **post-result records** for (iv), (v), (vi) and (vii).

---

**(i) Class 5 — a scope narrowing on a ruling: the engine's `SourceChanged` `Display` states the
engine's fact only.** The human's ruling of 2026-09-16 (question round 7), verbatim:

> "Fresh worker, exactly the listed five items, gates attempt 3 — the last attempt for P3a: if
> either gate fails again, P3a holds and the architect re-scopes the piece before any further worker
> touches it. Two additions: (1) the engine's SourceChanged Display text states the engine's fact
> only — "the source file changed while it was open (<component>)" — and never a consequence: the
> engine cannot know what the shell discarded, so the consequence sentence belongs to the owner that
> performs it, added by P3b when it becomes true. Engine messages state engine facts; owners state
> consequences. (2) Fence for the over-claim class, permanent in the gate checklists: every
> "discharged" or "done" clause in an amendment names the test or line that proves it, and the gate
> resolves each — a discharge claim with no resolvable proof is a gate failure by name, the same way
> an imagined interface and a stale cite are."

Applied at `engine/src/error.rs:324`. Deleted from the arm: the consequence sentence ("Everything
read for this session is discarded and the identities it handed out no longer refer to anything")
and the guidance ("reopen the file to continue"). Kept: the `refused: ` prefix every variant of the
enum carries, and boundary 4's limitation sentence — both are facts about the engine's own check,
which is the test the ruling states. `{detail}` is unchanged.

Re-pinned byte-identically in the three copies, each with its proof:

- the Rust pin — `kernel/tests/typed_terminal_codes.rs`'s
  `a_data_plane_terminal_detail_begins_with_the_refusal_s_typed_code` (exact equality, plus a new
  sweep asserting the engine's own text contains none of `discard`, `no longer refer`, `reopen the
  file`);
- the TS pin — `frontends/shell/src/testUtils/terminalShapes.ts:25-29`
  (`REAL_SOURCE_CHANGED_TERMINAL_DETAIL`);
- the SKP wire fixture — `protocol/skp/tests/data/v0-error-source_changed.json:3`, read by
  `protocol/skp/tests/fixtures.rs`'s
  `the_new_typed_refusal_fixtures_round_trip_with_their_detail_fields` and by
  `frontends/shell/src/skp/__tests__/fixtures.test.ts`.

The three were previously tied to each other only by a reviewer reading them. They are now tied
**mechanically**: `frontends/shell/src/admission/RefusalBlock.test.tsx:57`'s test asserts
`"engine.source_changed: " + fixture.message === REAL_SOURCE_CHANGED_TERMINAL_DETAIL`, and the Rust
pin asserts the same literal equals `Display`'s output.

**The whole rendered refusal is now checked as one string, on the filter route.** That test renders
`RefusalBlock` — the component `frontends/shell/src/filter/FilterPanel.tsx:134` renders inside
`.filter-refusal`, and the **only** product dispatcher of `refusalGuidance` (`RefusalBlock.tsx:25`;
grep-verified: no other product module imports it) — over the wire fixture through `formatRefusal`,
and sweeps `message` **and** guidance together for `discard`, `no longer refer`, `reopen the file`,
and for any affirmative snapshot claim. The half-checked form is what let the engine's message and
the owner's guidance disagree while each of their own tests stayed green.

**Two strings join the P6 sight list** (§12d's "the four new user-visible states whose strings are
sighted at P6", which Amendment 4 (ii) already extended to a fifth):

1. the engine's new `SourceChanged` sentence (`engine/src/error.rs:324`) — the operator-facing words
   an engine refusal now carries;
2. the owner's guidance sentence — `refusalGuidance("engine.source_changed")`
   (`frontends/shell/src/admission/formatRefusal.ts:83`), the human's own ruled wording from round 5
   item 1, restated here as a P6 sight item because P3b replaces it when the stronger sentence
   becomes true.

---

**(ii) Class 4 — the mutations added or corrected after the gate findings, each observed once and
recorded by name.** All four were performed against this branch, the failure observed, and the
mutation reverted. None is a second harness run; each is a unit or integration run of the named
test.

| Mutation | Test it must fail | Observed failure |
| --- | --- | --- |
| Restore the deleted consequence sentence to the engine's message in both copies the test reads (the SKP fixture and `REAL_SOURCE_CHANGED_TERMINAL_DETAIL`), so only the class assertion bites | `RefusalBlock.test.tsx`'s *"the rendered refusal states the engine's fact and the owner's sentence, and no consequence the shell did not perform"* | FAILED — `AssertionError: expected 'engine.source_changed refused: the so…' not to match /discard/i` |
| Restore `(Some(a), Some(b)) if a == b => {}, _ => push("mtime")` in `components_differing_from` | `descriptor::tests::a_filesystem_with_no_modification_time_degrades_rather_than_refusing_forever` | FAILED — panicked on the both-absent assertion, `engine/src/descriptor.rs:454-457` in the unmutated file (`descriptor::tests::an_unobservable_modification_time_degrades_while_an_observable_change_in_it_still_differs` failed with it, on its own both-absent assertion at `engine/src/descriptor.rs:375`) |
| In the `pairs` closure, yield the row's **position in the result set** instead of its `file_row_number` (`.enumerate()`, `(i as i64, key)`) — the scan-ordered reading the test rules out | `the_ordinal_stays_attached_to_its_row_under_a_reordered_scan_on_this_fixture` | FAILED — panicked at `engine/tests/session_identity.rs:156`: *"on this file the ordinal did not renumber under ORDER BY…"* |
| Zero `post_check_bytes_read` in `StreamConnectionRecord`'s construction in `impl Drop for EngineSource` | `a_cancelled_stream_s_connection_record_carries_the_post_check_s_cost` | FAILED — panicked at `kernel/tests/post_check_cost_report.rs:100`: *"the post-check read a footer on the cancelled path and the record must say how much of one"* |

The third row replaces a recorded mutation that **was not executable as written**: it named
`ordinal_is_physical_not_scan_ordered`, deleted by Amendment 4 (iii). Each mutation is also recorded
in-source beside its test, which is what `node scripts/plan/verify-mutation.mjs` resolves.

---

**(iii) Class 3 — cite fixes: ten in-code cites of the round-5 rulings were off by one item
number.** `DECISIONS-PENDING.md`'s "RULED 2026-09-16 — question round 5" numbers its items: **1** the
status string, **2** the §21 housekeeping ruling, **3** the cancel-window guarantee, **4** the
instrument-accessor exemption.

- The cancel window, `"round 5 item 2"` → `"item 3"`: `engine/src/trace.rs:437`,
  `engine/src/stream.rs:588`, `:1179`, `:1580`, `engine/tests/slice.rs:648`, and
  `engine/tests/session_identity.rs:495` — a **sixth** site of the same class, found by the sweep and
  not on the gate's list.
- The exemption, `"round 5 item 3"` → `"item 4"`: `kernel/src/skp.rs:390`,
  `engine/src/descriptor.rs:194`, `:213`, `engine/src/identity.rs:241`,
  `frontends/shell/src/streaming/liveTicketSet.ts:101`.

Every remaining "round 5" cite in the tree was resolved against the authoritative list and is
correct: the three item-1 cites (`frontends/shell/src/admission/formatRefusal.ts:66`, `:73`,
`formatRefusal.test.ts:142`), `AI_DEVELOPMENT.md:279` (item 4) and `AUTONOMY.md:345` (item 2). No
claim changed; only where a cite points.

---

**(iv) Post-result record — the narrations, the stale record, and the acting `pub`.**

- **The narration that survived the Amendment 4 (i) sweep is gone**, and so is the class of sentence
  it belonged to. The test comment *"the operator is told which component is unavailable"* and the
  `expect("the degradation is shown, never silent")` claimed a consequence P3a does not have; the
  moved test at `engine/src/descriptor.rs:426` now says the degradation is **recorded** and reachable
  through `degradation()`, shown to nobody. The same sweep over the two files the gate named
  corrected three more sentences: `of()`'s comment heading (*"Boundary 5's 'the degradation is
  shown', applied to mtime…"* → the degradation is recorded here, nothing shows it),
  `components_differing_from`'s *"names it in the operator's own words"* → returns the recorded
  words, shown to nobody in P3a, and `degradation()`'s own caller list, which now names the tests
  that exist after the move. `engine/tests/session_identity.rs:474`'s *"whatever terminal a consumer
  sees"* was read and left: it is about a consumer receiving a terminal, not about a degradation
  being shown.
- **The stale intra-doc link is gone.** `engine/src/identity.rs`'s link to
  `crate::dataset::ordinal_is_physical_not_scan_ordered` named a function Amendment 4 (iii) deleted.
  The sentence now states the two things that are true — the engine performs no such check at open,
  and the evidence is the `pairs` closure in `engine/tests/session_identity.rs:136-142` — as a prose
  cite, because a test is not part of this crate's public item tree. Proof:
  `cargo doc --no-deps -p spatial-engine` reports **zero** `broken_intra_doc_links` warnings (the
  crate's remaining doc warnings are pre-existing `private_intra_doc_links` at
  `engine/src/predicate.rs:258` and `:272`, untouched by this piece).
- **`SourceDescriptor::without_modification_time_for_test` is deleted** — the identifier no longer
  occurs anywhere in the tree. It was a `pub` constructor whose only caller was a test and which
  **acted** — it pushed a fabricated degradation — so the instrument-accessor exemption did not cover
  it, by that exemption's own closing clause. The literal it duplicated now exists **once**, as the
  private `ABSENT_MODIFICATION_TIME_DEGRADATION` (`engine/src/descriptor.rs:54`), recorded from one
  private fn, `SourceDescriptor::record_absent_modification_time` (`:93`), whose only shipped caller
  is `of()`'s no-mtime branch (`:118-120`).
- **The shipped path is what the test exercises now.**
  `descriptor::tests::a_filesystem_with_no_modification_time_degrades_rather_than_refusing_forever`
  (`engine/src/descriptor.rs:426`) builds its descriptor with the shipped `of()` over a written
  fixture, applies the same private fn `of()` calls, and asserts `degradation()` returns the shipped
  const's words and that `components_differing_from` reports no `mtime` difference for
  `(None, None)`. No new `pub` item, no `#[doc(hidden)]`, nothing test-only on the crate surface.

---

**(v) Correcting Amendment 4 (vi), by appending — the typed guidance and the plain camera pre-check
route.** Amendment 4 (vi) reads: *"Today the typed guidance reaches an operator only by the
**pre-check** route (a `viewport_query` refused synchronously with `engine.source_changed`)."* That
sentence is **false of the tree**, and it was false when it was written.

The plain camera pre-check route is `frontends/shell/src/App.tsx:929-932`
(`setViewportRefusal(formatRefusal(e.skpError))`), rendering at `:1452-1466`. That JSX renders
`viewportRefusal.code` and `viewportRefusal.message` and **dispatches no guidance at all** — it does
not call `refusalGuidance`, and `RefusalBlock.tsx:25` is the only place in the product that does
(grep-verified). On that route an operator reads the engine's message and nothing else.

`App.tsx` is **not** changed here: that surface is P3b's, and this amendment records the fact rather
than fixing it. Where the guidance does reach an eye is wherever `RefusalBlock` renders —
`AdmissionPanel.tsx:376`, `FilterPanel.tsx:134`, `PublishPanel.tsx:652`, `ConsolePanel.tsx:177`.

---

**(vi) Withdrawing Amendment 4 (ix)'s "Both obligations discharged", by appending.** Amendment 4 is
not edited; this item states what is and is not discharged, each clause with its proof.

**Not discharged when Amendment 4 was written.** The cost obligation rested on two carriers no
shipped run reads: `engine::trace`'s `POST_CHECK_BEGIN`/`POST_CHECK_END` marks — `trace::ENABLED` is
`false` by default (`engine/src/trace.rs:88`) and `trace::start` has no product caller, so the marks
record nothing outside a test that enables them — and `StreamStats::post_check_bytes_read`
(`engine/src/stream.rs:617`), which at that time had only a test caller. The figure existed; nothing
in a shipped run reported it. Calling that discharged is the class this amendment's fence exists to
stop. The **other** obligation of round-5 item 3 — the re-aimed liveness test — was and is
discharged: `engine/tests/slice.rs`'s `cancelling_mid_stream_stops_production_promptly` asserts
`cancel_requested → cancel_observed` (`:679-686`) and prints `observed → terminal` beside it with
the disclaimer (`:688-700`).

**Discharged now, on the kernel binary, with proof:**

- `StreamConnectionRecord::post_check_bytes_read` (`kernel/src/lib.rs:98`), filled in
  `impl Drop for EngineSource` (`kernel/src/lib.rs:484`) on **every** stream end — cancelled, failed
  or completed — and printed by its product consumer, `kernel/src/main.rs:141-151`, as
  `post_check_bytes=… (bound FOOTER_DESCRIPTOR_MAX_BYTES=…)`.
- The always-on session line, `kernel/src/lib.rs:452`, carries the same figure and the same named
  bound on the source-changed path; its comment now states what the line is — a record of which
  stream noticed, how many siblings went with it, and what the post-check cost.
- Proven end to end from the real product shape by `kernel/tests/post_check_cost_report.rs:56`'s
  `a_cancelled_stream_s_connection_record_carries_the_post_check_s_cost`: a stream created through
  `EngineSourceFactory::with_connection_reports` — the constructor `kernel/src/main.rs:157-161` uses
  — cancelled through the product's own `SourceCancel::cancel`
  (`protocol/data-plane/src/transport.rs:128-135`), whose record arrives on the channel with
  `0 < post_check_bytes_read <= FOOTER_DESCRIPTOR_MAX_BYTES`.
- `StreamStats::post_check_bytes_read`'s instrument-accessor declaration is **retired** rather than
  restated: it has two product callers now, both in `kernel/src/lib.rs`'s `EngineSource`
  (`:452`, `:484`), so it stands on the plain caller rule and its doc (`engine/src/stream.rs:602-616`)
  says so.
- No SKP field was added: the wire is closed (boundary 9 / ADR-004 Amendment 4), and no new
  cross-module seam exists — the record and its channel were already there.
- **No duration is claimed anywhere**: no `ms`, no `µs`, no latency word, no p50/p95 on any of these
  paths (ADR-018).

**NOT discharged, and named as an open item rather than claimed: *the shell*.** The Tauri shell has
**no consumer for `StreamConnectionRecord`** — it installs `EngineSourceFactory::ticket_only`
(`frontends/shell/src-tauri/src/lib.rs:368`), whose `connection_reports` is `None`
(`kernel/src/lib.rs:296-297`), and `kernel/src/skp.rs:688-697` passes `None` explicitly and says why. Its
stderr is unattached when the app is launched from the desktop, so the session line at
`kernel/src/lib.rs:452` reaches nobody there either. **In the shell the post-check's cost is still
not seen by an operator**, and nothing in this piece changes that.

**Which runs see the report, stated exactly:** the kernel binary's own consumer
(`kernel/src/main.rs:134-155`, printing on stdout) sees the per-stream record; a **console-attached**
process sees the session line on stderr (`kernel/src/lib.rs:452`); the desktop shell sees neither.

**Open item for the human (P3b or P6): the shell-side carrier for the post-check's cost.** A
`StreamConnectionRecord` consumer in `frontends/shell/src-tauri`, or some other surface, is a design
choice with an operator-visible component, and P3a does not invent one. Recorded here so the gap has
a name and a place instead of living inside a discharge claim.

---

**(vii) What this amendment does not claim.** P3a still clears no residency, refuses no pick and
renders no session status — Amendment 3 item 3 and Amendment 4 (v) stand unchanged, and G-A2 remains
not satisfiable by P3a alone. Boundary 5's "the degradation is shown" remains **not met**
(Amendment 4 (ii)); this piece deleted the sentences that implied otherwise and added none. The
ADR-016 amendment's acceptance remains P6's.

---

**(viii) Correcting item (iv)'s doc-warning count, by appending (this amendment's own fence applied
to itself).** Item (iv) says the crate's remaining `cargo doc` warnings are "pre-existing
`private_intra_doc_links` at `engine/src/predicate.rs:258` and `:272`". That names two of **eight**.
The full, verified figure from `cargo doc --no-deps -p spatial-engine` on this branch:
`broken_intra_doc_links` **0**; `private_intra_doc_links` **8**, at `engine/src/predicate.rs:10`,
`:13`, `:16`, `:17`, `:52`, `:258`, `:272` and `engine/src/geoparquet.rs:353`. None is in a file this
piece touches, and none is introduced by it — the claim item (iv) makes (zero broken intra-doc
links) is unchanged; only its parenthetical was under-counted.

---

**Corrections of record, appended after P3a attempt 3 PASSED both gates (2026-09-17).** Items (ix)
to (xiv) below are docs-class only: no code behaviour changes, and nothing above this line is
edited. Each names its proof, per this amendment's own fence.

**(ix) Correcting item (iv)'s "the identifier no longer occurs anywhere in the tree" (architect
M1).** `engine/ADMISSION-PREREGISTRATION.md:1152-1153` overstates. What is true, with proof: the
`pub` constructor `SourceDescriptor::without_modification_time_for_test` is **deleted** — there is
no definition of it and no caller of it anywhere; the shipped no-mtime path is the private const
`engine/src/descriptor.rs:54`, recorded by the private fn `:93`, called from `of()` at `:118-120`,
and tested through `of()` by `descriptor::tests::a_filesystem_with_no_modification_time_degrades_rather_than_refusing_forever`
(`engine/src/descriptor.rs:433`). What survives is the **identifier in prose, naming it as
deleted**, at exactly two in-code sites — `engine/src/descriptor.rs:412` and
`engine/tests/session_identity.rs:607` — plus this amendment's own text and the ledger's history
(`DECISIONS-PENDING.md:182`, `state/gate-log.json:38`). A deleted item and an unmentionable name are
different things; item (iv) claimed the second.

**(x) Correcting item (i)'s "the `refused: ` prefix every variant of the enum carries" (architect
M2).** False as stated. **17** arms of `EngineError`'s `Display` carry it —
`engine/src/error.rs:235`, `:240`, `:245`, `:251`, `:257`, `:263`, `:269`, `:277`, `:283`, `:291`,
`:306`, `:326`, `:332`, `:349`, `:355`, `:361`, `:367` — and eleven do not: `Cancelled`, `Query`,
`Arrow`, `Wkb`, `Source`, `GeoMetadata`, `EncodingMismatch`, `CeilingExceeded`,
`InternalInconsistency`, `FeatureTooLarge`, `ConnectionSetup`.

**The decision stands; the stated ground was wrong.** The prefix is kept on `SourceChanged` not
because every variant carries it, but because it is **the engine stating its own act**: this engine
refused this call. That is an engine fact about engine behaviour, which is exactly what the round-7
rule preserves ("Engine messages state engine facts"). The arms that lack it are the ones that
report a condition rather than a refusal — a cancellation, a pass-through from DuckDB or Arrow, a
malformed input surfaced as-is — and the split is `refusal` versus `report`, not an inconsistency.

**(xi) Retiring `SourceDescriptor::footer_bytes_read`'s instrument-accessor declaration (architect
M3 = reviewer S-1).** Its doc declared "An instrument: its only caller is the test suite". That was
false of the tree: `post_check_source` (`engine/src/stream.rs:1590`), product code on the producer
thread, calls it to report the bytes the R-D2 post-check read — which is the figure item (vi) of
this amendment rests on. The declaration is retired in the same shape as
`StreamStats::post_check_bytes_read`'s (`engine/src/stream.rs:602-616`): the doc
(`engine/src/descriptor.rs:185-203`) now names the product caller and says the accessor stands on
the plain caller rule, with its test callers kept as a reader's aid rather than as an exemption.

**This also corrects Amendment 4 (iii)'s "Declared (four)" list** (`:886-888`), by appending and
never by editing: of the items that list declares, `SourceDescriptor::footer_bytes_read` is **no
longer** an instrument accessor (product caller `engine/src/stream.rs:1590`) and
`StreamStats::post_check_bytes_read` is no longer one either (product callers `kernel/src/lib.rs:452`
and `:484`, item (vi) above). The declarations that stand, each with its named test grep-verified to
exist: `GenerationRegistry::attributed_ticket_count` (`kernel/tests/session_generation.rs:77`, `:96`,
`:121`, `:150`, `:173`), `SourceDescriptor::degradation`, `DatasetIdentity::candidate_columns`
(`engine/tests/session_identity.rs:168`, `engine/tests/identity.rs:114`) and `LiveTicketSet.size`
(`frontends/shell/src/streaming/liveTicketSet.test.ts:30`).

**(xii) Correcting Amendment 4 (x)'s location of `degradation()`'s callers (reviewer S-2).**
`engine/ADMISSION-PREREGISTRATION.md:1004` places `SourceDescriptor::degradation`'s two callers "in
`engine/tests/session_identity.rs`". After the move recorded in item (iv), they are
`engine/tests/session_identity.rs:300` (asserts `None` on an undegraded descriptor) and
`engine/src/descriptor.rs:451` / `:469` (the in-module test, asserting the shipped const's words on
a degraded one). `degradation()`'s own doc (`engine/src/descriptor.rs:207-224`) already names them
in that shape; this records the preregistration's copy as corrected.

**(xiii) Class 3 — two correct cites this attempt added, omitted from item (iii)'s enumeration
(reviewer S-3).** Item (iii) claims to enumerate every remaining "round 5" cite in the tree. Two
that this attempt itself added were left out, both correct against the authoritative numbering:
`frontends/shell/src/admission/RefusalBlock.test.tsx:68` (item 1, the status string) and
`engine/src/descriptor.rs:415` (item 4, the accessor exemption). With these, the enumeration is
complete.

**(xiv) Class 3 — two cite spans made consistent.** Item (i) cites
`frontends/shell/src/admission/RefusalBlock.test.tsx:57` for the fixture-to-pin byte-equality
assertion; the test opens at `:56` and that assertion is at `:60`. And item (iv) cited the `pairs`
closure as `engine/tests/session_identity.rs:136-142` while `engine/src/identity.rs` cited
`:127-155` for the same evidence. Both now name the same two spans: the closure is
`engine/tests/session_identity.rs:136-142`, inside the test
`the_ordinal_stays_attached_to_its_row_under_a_reordered_scan_on_this_fixture`
(`engine/tests/session_identity.rs:126-159`); `engine/src/identity.rs:63-66` was updated to match.

**(xv) One code-comment correction outside this file, recorded here for completeness.**
`frontends/shell/src/admission/formatRefusal.test.ts`'s header said "No string here is asserted
verbatim. All four are placeholders" twelve lines above the verbatim assertion the round-5 ruling
required. The sentence was true when written and stopped being true when that ruling landed; the
header now says which one string is asserted verbatim and why, and says that it changed. No
assertion is altered.

---

### Amendment 6 — P3b landed: the deferrals, discharged one by one (2026-09-17, appended)

**Written after P3b's results were seen.** §12e's rule, honoured in this line. **Amendments 1–5 are byte-untouched**; this one records what P3b did with what Amendment 3 item 3 deferred, and says plainly which of those deferrals is still open.

**The fence, applied to this amendment's own words** (the human, 2026-09-16, round 7, permanent in both gate checklists): every clause below that says something is discharged names the test by its exact name or a `file:line`, and every clause that says something is **not** discharged names the open item instead. P3b's own preregistration is `frontends/shell/OWNER-INVALIDATION-PREREGISTRATION.md`; its §10 Amendment 4 carries the full result record, and this amendment does not restate it.

**Classes used** (`docs/PREREGISTRATION-TEMPLATE.md:101-122`): **post-result records** throughout.

---

**(i) Which deferral each landed item discharges.** Amendment 3 item 3 (`:752-763`) lists four.

1. *"Owner-side invalidation: residency cleared and picks refused."* **Discharged for the client, on both arms and both detection routes.**
   - Residency cleared, baseline: `frontends/shell/src/streaming/viewportStreamManager.ts:308` calls `clearResidency()` before nulling `residentStreamHandle`, which fires `onSuperseded` → `canvas.clearStream` (`App.tsx:541-543`). Proof: `viewportStreamManager.test.ts`'s *"a source-changed terminal clears the working canvas residency"*.
   - Residency cleared, candidate: `frontends/shell/src/residency/candidateArmSession.ts:1075` calls `canvas.clearAllTiles()`, which also clears the untiled first look (ingested under `INITIAL_TILE_KEY`). Proof: `candidateArmSession.test.ts`'s *"a TILE stream's terminal ends the session and clears every tile"* and *"the UNTILED first look's own terminal ends the session and clears every tile"*.
   - Picks refused: `frontends/shell/src/canvas/pick.ts:100`'s `latchedHoverReadout`, at one site covering both arms (`App.tsx:1477`), with its own readout state so silence is never the answer (ADR-010 rule 5). Proof: `pick.test.ts`'s *"every readout state becomes the refusal while latched, including null and a standing id"* and `HoverReadoutView.test.tsx`'s *"renders the refusal in the hover slot, and never a bare or standing id"*.
   - **The third sink Amendment 3 did not know about.** P3a's `isSourceChangedTerminal` had exactly two product call sites, both in streaming managers; the candidate session's own untiled stream tested no terminal code at all, so a change detected on the first query of a tiled session ended nothing on the client. `candidateArmSession.ts:1325` now routes it through `TileViewportStreamManager.notifySourceChanged`.
2. *"The kernel-authoritative dead-ticket refusal, wired to a real caller, with correct three-valued unknown-handle behaviour."* **Discharged.** `GenerationRegistry::ticket_liveness` (`kernel/src/skp.rs:466`) answers `Live`/`EndedBySourceChange`/`Unknown`; only the middle arm refuses by name (`kernel/src/lib.rs:410`), and `Unknown` falls through to `StreamRegistry::redeem`'s own three refusals. Its product caller is `EngineSourceFactory::create_from_ticket`, reached on every real START frame; the factory now takes the registry as a third parameter and the shell installs it at `frontends/shell/src-tauri/src/lib.rs:373-377`. Proof, end to end from the real shape: `kernel/tests/session_generation.rs`'s `a_ticket_whose_generation_ended_refuses_at_redemption_with_its_typed_code`, in which nothing is fabricated and no test calls `end_generation`; and the fabrication it replaces is fenced by `an_unknown_handle_falls_through_to_the_ticket_registrys_own_refusal`.
3. *"The ADR-016 Amendment 1 acceptance, which stays Proposed and binds nothing."* **NOT discharged, and not touchable by this work.** It is the human's at P6 (`state/NEXT-CUT.md:106`). `git diff origin/main...cut/briefa-p3b -- docs/adr` is empty: no ADR Status is changed by P3b, and a full pass on both its gates does not accept it either.
4. *"Boundary 4's own sentence about detection clearing residency and refusing picks."* **Now claimed, at the scope §2e of P3b's preregistration fixes and no wider**: *on a detected change, this client clears the resident geometry it holds for that dataset and refuses picks until the dataset is reopened.* It remains true in the same breath that the policy does not establish snapshot consistency, cannot detect every in-place modification, and may detect a change during a query only at the post-check (`state/NEXT-CUT.md:60-63`) — those are the engine's own words and arrive in the refusal's `message`; the shell's sentence states only what the shell did. The operator-facing form of the claim is `refusalGuidance("engine.source_changed")` (`frontends/shell/src/admission/formatRefusal.ts:97-100`), which is the stronger sentence the human's round-5 ruling said P3b would restore *"when it becomes true"*; it is asserted verbatim by `formatRefusal.test.ts`'s *"engine.source_changed: says only what is true at this commit"* and rendered whole, with the engine's message, by `RefusalBlock.test.tsx`'s *"the rendered refusal states the engine's fact and the owner's sentence, and no consequence the shell did not perform"*.

---

**(ii) What this amendment does NOT claim, stated rather than left to be inferred.**

- **The claim is about this client, not about the file.** Nothing here says a session up to the detection was a snapshot (A1), and no test asserts one.
- **The end-to-end evidence is owed.** §4 of P3b's preregistration declares a T10 E2E step (`frontends/shell/e2e/source-changed.mjs`). **It was not written and no E2E run was made** — the reason is recorded in P3b's §10 Amendment 4 (e) with its two blockers, and it is owed before P3b's gates conclude. Until then every clause in (i) rests on unit and integration assertions at named seams, not on an operator-visible run.
- **The post-check's own cost still has no shell-side carrier.** Amendment 5 (vi)'s open item stands unchanged: the Tauri shell installs `EngineSourceFactory::ticket_only`, whose `connection_reports` is `None`, and its stderr is unattached from the desktop. P3b's preregistration does not name that surface, so P3b built nothing for it.
- **R-D2's `detail` contract is still unmet on the generation-ended paths.** `protocol/skp/SKP-V0.md:602-608` declares that `detail` names every component that differed; `kernel/src/skp.rs:796-802` and `:840-846` fill it with a brace-delimited sentence, and P3b's redemption refusal (`kernel/src/lib.rs:424-428`) is deliberately a third such site — that registry holds no descriptor and never read the file, so naming components there would be a fabrication of the same class the round-4 ruling removed. Owed, 2026-09-17, recorded in P3b's §10 Amendment 4 (g)(1).

---

**(iii) G-A2's status, said rather than claimed.** §12b's G-A2 (`:221`) reads: *"Open; issue a query; mutate the file (mutation fixture); the next read refuses `engine.source_changed`; residency cleared; picks refused; late batches dropped. Asserted at the pre-check and at the post-check paths separately."*

**G-A2 remains P5's gate, and P3b does not score it.** What P3b builds is the *behaviour* G-A2 scores — the refusal at both paths, residency cleared, picks refused, late batches dropped — and each half is asserted at its own seam by the tests named in (i) above, at both the pre-check (`liveTicketSet.test.ts`'s *"matches the real thrown refusal on its code, never on its prose"*; `tileViewportStreamManager.test.ts`'s *"a source-changed refusal at a tile mint ends the session, and is not retried"*) and the post-check (the terminal-route tests in (i)) **separately**, as G-A2's own wording requires. What is missing for the gate itself is the single end-to-end run over a real mutated fixture, which is (ii)'s owed T10. A gate is scored by its own run; this amendment records the behaviour, not the score.

---

**(iv) "No release includes P3a without P3b"** (`DECISIONS-PENDING.md:44`, verbatim). P3b is the branch `cut/briefa-p3b`; until it merges, that sentence still binds, and it is recorded as a plan dependency rather than only here.

---

### Amendment 7 — correcting Amendment 6 (ii) and (iii) by appending: T10 was written, run, and satisfied (2026-09-17, appended)

**Written after P3b's T10 runs were seen.** §12e's rule, honoured in this line. **Amendments 1–6 are byte-untouched.** This item exists because **Amendment 6 is false at this head**, and it is the record the human reads before accepting the Proposed ADR-016 Amendment 1 by click, so it must be true.

**The fence, applied to this amendment's own words** (the human, 2026-09-16, round 7): every clause below that says something is done names the test, the report or the `file:line` that proves it.

---

**(i) What Amendment 6 (ii) says, and why it is now false.** It reads: *"§4 of P3b's preregistration declares a T10 E2E step (`frontends/shell/e2e/source-changed.mjs`). **It was not written and no E2E run was made** … and it is owed before P3b's gates conclude."* That was true when written. **T10 is now written and satisfied**, in the file that clause names, and the sentence that follows it there — *"every clause in (i) rests on unit and integration assertions at named seams, not on an operator-visible run"* — no longer holds either.

**(ii) The runs, and what each proves.** Three runs, each from a fresh launch, each `launched: true` (AI_DEVELOPMENT.md's own condition for a run that proves a branch), each on the exe `C:\dev\spatial-ide\frontends\shell\src-tauri\target\debug\spatial-ide-shell.exe` with a creation time after its own run's start — the documented ownership check. Reports live under `frontends/shell/e2e/out/`, which `frontends/shell/.gitignore:1` ignores, so they are cited by path and kept on disk.

| run | report | app session log | outcome |
| --- | --- | --- | --- |
| **5** | `frontends/shell/e2e/out/source-changed-1789618861740.json` | `%LOCALAPPDATA%\dev.spatialide.shell\logs\session-1789618848.log` | every step PASS, exit 0 |
| **6**, the recorded mutation | `frontends/shell/e2e/out/source-changed-1789618937407.json` | `…\logs\session-1789618924.log` | **S5b FAIL by name**; S5a and S5c PASS |
| **7**, reverted | `frontends/shell/e2e/out/source-changed-1789618985531.json` | `…\logs\session-1789618972.log` | every step PASS, exit 0 |

**The kernel's own detection, in the app's session log** (`session-1789618848.log:19-21`, read as content and not inferred from a size — the stale-directory-entry rule):

> `tile-stream-mint-refused 7:8: engine.source_changed {"detail":"{mtime}"}`
> `warn tile-session-ended-source-changed: engine.source_changed: refused: the source file changed while it was open ({mtime}). …`
> `candidate-session-ended-source-changed ds_5fc4839d1363849c9bb6e74a8f680820: every resident tile cleared; no further plan until reopen — …`

**The owner-side consequences, observed in the running app:**

- **residency cleared** — `observation.residentBefore` `{totalResidentVertices: 188665, totalResidentFeatures: 10000}` → `observation.residentAfter` `{0, 0}`, read through the counts-only hook `residentCounts` (`frontends/shell/src/e2e-test-surface.ts:192-221`, registered `frontends/shell/src/App.tsx:923`);
- **picks refused** — the readout at a pixel proven occupied before the change (interior-verified by read-back, and hovered to an id) is `className: "hover-readout hover-readout-session-ended"`: not an id, and **not silence**, which is the answer ADR-010 rule 5 forbids here;
- **the typed status** — the session-ended block rendered with `dismissButtons: 0` (not dismissible), its code in its own labelled `.admission-refusal-code` element, and no `engine.` code in the operator's sentence or its guidance.

**The recorded mutation, performed once and reverted** — delete `this.clearResidency();` from `viewportStreamManager.ts`'s source-changed branch and `canvas?.clearAllTiles();` from `candidateArmSession.ts`'s `endCandidateSession`. Observed failure on run 6, verbatim:

> `S5b: resident vertices are 188665 (features 10000), expected 0 -- the owner did not clear what it was showing`

**and S5a and S5c passed under it**, which is the discrimination the driver predicted in advance: those two are the owner *saying* something, S5b is the owner having *done* it. Run 7 is green from the reverted tree.

**The fixture discipline held on all three**: the scratch copy's sha256 is `fd0c74ab2d5df1e1df084802134d2a6678278e764ba180ea2ea5812f53ddfb49` before and after every run, so every mutation was an mtime touch and never a byte edit (P3b's §8.8).

---

**(iii) Correcting Amendment 6 (iii) by appending.** That item says: *"What is missing for the gate itself is the single end-to-end run T10 is the first half of."* **That is no longer what is missing.** The end-to-end run exists and is green (above). What remains for **G-A2** is narrower and is stated here rather than left implied:

1. **The post-check route's own end-to-end.** G-A2's wording requires both routes — *"Asserted at the pre-check and at the post-check paths separately"* (`:221`). Runs 5 and 7 detected the change through the **pre-check**, on a tile mint (`tile-stream-mint-refused` above). The **post-check** route — a change found at a stream's own end, `EngineSource::end_session_if_source_changed` — is covered by its unit and integration tests (`kernel/tests/typed_terminal_codes.rs`'s `the_data_plane_terminal_a_real_redeemed_stream_produces_carries_its_typed_code`; the shell's terminal-route tests in `viewportStreamManager.test.ts` and `candidateArmSession.test.ts`) but **not** by an end-to-end run. Arranging one needs the change to land while a stream is still open, which T10's scenario does not do.
2. **P5's own scoring.** G-A2 is P5's gate, and a gate is scored by its own run. P3b builds the behaviour G-A2 scores and now demonstrates most of it end to end; it does not score the gate, and this amendment does not claim it does.

---

**(iv) One cite correction carried here** (class 3, mechanical, no claim changed): Amendment 6 (i) cites `frontends/shell/src/App.tsx:1477` for the one pick-latch site and `frontends/shell/src/residency/candidateArmSession.ts:1075` for the tile clear. Both shifted when the `residentCounts` hook landed. At this head they are **`App.tsx:1488`** (`onHover={(readout) => setHover(latchedHoverReadout(readout, sessionEndedRef.current))}`) and **`candidateArmSession.ts:1076`** (`canvas?.clearAllTiles();` inside `endCandidateSession`). Amendment 6 is not edited; this states where they point now.

---

### Amendment 8 -- correcting Amendment 6 (iii) and Amendment 7 (iii) by appending: two misquotes and a stale P6 cite (2026-09-17, appended)

**Written after the verification pass that found them.** §12e's rule, honoured in this line. **Amendments 1-7 are byte-untouched**; this item corrects three record-fidelity defects in Amendments 6 and 7, one by one, without editing either.

**The fence, applied to this amendment's own words** (the human, 2026-09-16, round 7, permanent in both gate checklists): every clause below that says something is discharged names the test by its exact name or a `file:line`, and every clause that says something is **not** discharged names the open item instead.

**Classes used** (`docs/PREREGISTRATION-TEMPLATE.md:101-122`): item (3) below is **class 3** (cite/line-number fix, `:110-112`, mechanical, never changes a claim). Items (1)-(2) correct misquotes of the same mechanical kind -- the quoted text is made to match its source; item (2)'s correction also completes a list the misquote had left one clause short. No claim Amendments 6 or 7 already discharged is reopened by any of the three.

---

**(1) Amendment 7 (iii) (`:1425`) misquotes Amendment 6 (iii).** Introduced by *"That item says:"*, it attributes to Amendment 6 (iii) the sentence, quoting: *"What is missing for the gate itself is the single end-to-end run T10 is the first half of."* Amendment 6 (iii) (`:1377`) does not contain that sentence. What Amendment 6 (iii) says, verbatim: *"What is missing for the gate itself is the single end-to-end run over a real mutated fixture, which is (ii)'s owed T10."* Amendment 7's conclusion drawn from the misquoted sentence -- that the run named there now exists, is green, and is no longer what is missing (Amendment 7 (ii)'s three reports) -- does not depend on the exact wording and is unaffected; only the attributed sentence was wrong, and this corrects it.

**(2) Amendment 6 (iii) (`:1375`) misquotes §12b's G-A2.** It quotes G-A2 (`:221`) as ending, verbatim: *"picks refused; late batches dropped. Asserted at the pre-check and at the post-check paths separately."* G-A2 (`:221`) does not end that way; it states: *"picks refused; status text verbatim. Asserted at the pre-check and at the post-check paths separately."* "Late batches dropped" is G-A3's language, which reads: *"A batch whose ticket belongs to an invalidated generation, delivered after invalidation, is dropped and never rendered"* (`:222`) -- not G-A2's.

Because the misquote dropped G-A2's own "status text verbatim" clause, the list of what G-A2 still lacks (Amendment 7 (iii), `:1427-1428`) is short one item. Restated complete, G-A2 has **three** outstanding clauses, not two:

1. The post-check route's own end-to-end (Amendment 7 (iii) item 1, unchanged by this correction).
2. P5's own scoring (Amendment 7 (iii) item 2, unchanged by this correction).
3. **The status text verbatim clause.** G-A2 requires the refused status text to match a specific string, word for word -- that is what "verbatim" means in its own wording. No test in this tree pins that string against G-A2, because the string itself has not been decided: deciding the exact operator-facing status text is a **P6 wording decision that is the human's**, not this piece's or this amendment's to make. It stands beside the pick refusal and the session-ended status line that `frontends/shell/OWNER-INVALIDATION-PREREGISTRATION.md` Amendment 10 (d) already names as joining §9's P6 sight list, rather than being settled here.

**(3) Amendment 6 (i)3 (`:1361`) cites the wrong `NEXT-CUT.md` row.** It reads: *"It is the human's at P6 (`state/NEXT-CUT.md:106`)."* At this head, `state/NEXT-CUT.md:106` is the **P5** row, whose Phase cell reads: *"Tests carrying the claims (see Gates) + E2E: detected-change invalidation; late-generation rejection; fast-admission distinction"* and whose Gate column reads: *"Reviewer"*. The **P6** row -- whose Phase cell reads, at its opening: *"Walkthrough **Part N** (no durations): open a CRS84 file, read the provenance line; open a keyless single file, read the session-identity statement; mutate the source mid-session, read the refusal"* and whose Gate column reads: *"Human (operator-verified; acceptances are red lines)"* -- is `state/NEXT-CUT.md:107`. Corrected here: the citation is `state/NEXT-CUT.md:107`.

---

### Amendment 9 -- two record-fidelity glyph corrections, appended (2026-09-17)

**Written after the checker's gates found them, ruled as belonging to P3b's round rather than to a baseline.** §12e's rule, honoured in this line. **Amendments 1-8 are byte-untouched**; this item corrects two sites where a nested quotation's glyph was retyped when a ruling was transcribed into this document.

**The fence, applied to this amendment's own words** (the human, 2026-09-16, round 7): every clause below that says something is done names the test, the report or the `file:line` that proves it.

**Classes used** (`docs/PREREGISTRATION-TEMPLATE.md:101-122`): **class 3** throughout (cite/glyph fix, `:110-112`, mechanical, never changes a claim).

---

**(1) `:949-951` re-types round 5 item 1's two nested quotations as single quotes.** The ruling (`DECISIONS-PENDING.md:45`, "RULED 2026-09-16 -- question round 5", item 1) nests two double-quoted phrases inside its own double-quoted whole: P3a's superseded string, rendered here as *'Everything read so far has been discarded'* with single quotes, and the replacement, rendered here as *'The source file changed while it was open; reopen the dataset to continue.'*, also with single quotes. The source uses double quotes for both. Reproduced below byte for byte, from `DECISIONS-PENDING.md:45` (the ruling's relevant span; its own full sentence opens "Accept as pre-committed with one change to (d):", which this document's `:949` quote begins after):

> "a false status string does not sit on main between P3a and P3b. Replace P3a's "Everything read so far has been discarded" now, in one docs-class commit, with a sentence true at that commit — "The source file changed while it was open; reopen the dataset to continue." — and P3b restores the stronger sentence when it becomes true, wording at P6."

**(2) `:993-995` re-types round 5 item 4's one nested quotation as single quotes.** The ruling (`DECISIONS-PENDING.md:48`, same round, item 4) nests one double-quoted word inside its own double-quoted whole: rendered here as *'test-only.'* with single quotes; the source has double quotes. Reproduced below byte for byte, from `DECISIONS-PENDING.md:48`:

> "Adopt the architect's sentence as written, with one addition: the accessor's doc names the test that calls it, so the caller-grep can verify the exemption instead of trusting the words "test-only." An exemption that can't be grepped is a hole in the rule it exempts from."

**(3) What changed and what did not.** At both sites, the meaning of the quoted ruling is unchanged either way -- a reader takes the same instruction from the single- or double-quoted rendering; only the glyph marking the ruling's own nested quotation changed, from the human's double quotes to a single-quote substitute. Neither `:949-951` nor `:993-995` is edited by this amendment (Amendments 1-8 stay byte-untouched); this is the correction, appended, per the round-7 fence.

---

### Amendment 10 -- class 3, mechanical, no claim changed. Written 2026-09-17, a fresh worker's verification pass on the reviewer and architect gates' attempt-3 findings (2026-09-17, appended)

**Written after the verification pass that found them.** §12e's rule, honoured in this line. **Amendments 1-9 are byte-untouched**; this item corrects one misquote in Amendment 9, one unmarked elision in Amendment 7, and mirrors one shell correction.

**The fence, applied to this amendment's own words** (the human, 2026-09-16, round 7): every clause below that says something is done names the test, the report or the `file:line` that proves it.

**Classes used** (`docs/PREREGISTRATION-TEMPLATE.md:101-122`): **class 3** throughout (cite/quote fix, mechanical, never changes a claim).

---

**(1) Amendment 9 (1)'s reproduction (`:1472`) is not byte for byte against its named source, and drops the ruling's final clause unmarked.** Introduced *"Reproduced below byte for byte, from `DECISIONS-PENDING.md:45`"*, the blockquote at `:1472` reads in full:

> "a false status string does not sit on main between P3a and P3b. Replace P3a's "Everything read so far has been discarded" now, in one docs-class commit, with a sentence true at that commit — "The source file changed while it was open; reopen the dataset to continue." — and P3b restores the stronger sentence when it becomes true, wording at P6."

Two defects against the source (`DECISIONS-PENDING.md:45`, "RULED 2026-09-16 -- question round 5", item 1): it adds an opening `"` before *"a false status string"* and a closing `"` after *"wording at P6."* — positions the source carries no quote mark at, since the source's own outer quote pair opens before *"Accept as pre-committed"* and closes after *"the P6 sight list."*; and it drops the ruling's own final clause, *"P3b starts after P3a lands; its two new strings join the P6 sight list."*, with no `…` marking the cut.

The ruling, reproduced complete and byte for byte, from `DECISIONS-PENDING.md:45` (465 characters; `frontends/shell/OWNER-INVALIDATION-PREREGISTRATION.md:549` already carries it complete, and the two are script-compared identical):

> "Accept as pre-committed with one change to (d): a false status string does not sit on main between P3a and P3b. Replace P3a's "Everything read so far has been discarded" now, in one docs-class commit, with a sentence true at that commit — "The source file changed while it was open; reopen the dataset to continue." — and P3b restores the stronger sentence when it becomes true, wording at P6. P3b starts after P3a lands; its two new strings join the P6 sight list."

---

**(2) Amendment 7 (`:1405-1407`) elides the kernel's own limitation sentence with `…`, dropping negations and a qualifier, and drops the three lines' leading timestamps unmarked.** It reads:

> `tile-stream-mint-refused 7:8: engine.source_changed {"detail":"{mtime}"}`
> `warn tile-session-ended-source-changed: engine.source_changed: refused: the source file changed while it was open ({mtime}). …`
> `candidate-session-ended-source-changed ds_5fc4839d1363849c9bb6e74a8f680820: every resident tile cleared; no further plan until reopen — …`

The three lines, read as content from `%LOCALAPPDATA%\dev.spatialide.shell\logs\session-1789618848.log:19-21`, complete and byte for byte:

> `1789618859411 tile-stream-mint-refused 7:8: engine.source_changed {"detail":"{mtime}"}`
> `1789618859412 warn tile-session-ended-source-changed: engine.source_changed: refused: the source file changed while it was open ({mtime}). This check does not establish snapshot consistency, cannot detect every in-place modification, and may detect a change during a query only after that query has finished reading`
> `1789618859412 candidate-session-ended-source-changed ds_5fc4839d1363849c9bb6e74a8f680820: every resident tile cleared; no further plan until reopen — engine.source_changed: refused: the source file changed while it was open ({mtime}). This check does not establish snapshot consistency, cannot detect every in-place modification, and may detect a change during a query only after that query has finished reading`

Amendment 7's `…` cut, on lines 2 and 3, removed the same clause both times: *"This check does not establish snapshot consistency, cannot detect every in-place modification, and may detect a change during a query only after that query has finished reading"* — two negations (*"does not establish"*, *"cannot detect every"*) and a qualifier (*"only after that query has finished reading"*), which the round-10 rule forbids an elision from dropping even when marked. Amendment 7 also opened each quoted line at its own message text, dropping the leading epoch-millisecond timestamp (`1789618859411` / `1789618859412` / `1789618859412`) with no mark at all.

---

**(3) The nit: `state/NEXT-CUT.md`'s true range for boundary 4's policy sentence.** Amendment 6 item 4 (`:1362`) cites `state/NEXT-CUT.md:60-63` for the sentence beginning *"The policy does not establish snapshot consistency"*. At this head that sentence runs `state/NEXT-CUT.md:59-61` (it opens mid-line at `:59` and closes at `:61`) — mirroring the identical correction `frontends/shell/OWNER-INVALIDATION-PREREGISTRATION.md` Amendment 13 (5) makes for that document's own `:950`/`:295` cites of the same sentence. `:1362` is not edited; this states where the range actually falls.

---

**(4) Checked and not carried here: whether a merge-falsified "resolved when main merges" note lives in this document too.** It does not. The only instance of that shape — *"this branch's own `DECISIONS-PENDING.md` does not yet contain it. … Resolved when `main` next merges into this branch."*, false since merge `7286c81` landed — sits in `frontends/shell/OWNER-INVALIDATION-PREREGISTRATION.md:970` (Amendment 12), corrected there by that document's own Amendment 13 (3) item 2. This document's Amendment 9 cites `DECISIONS-PENDING.md:45` and `:48`, both rulings long since present on `main` and on this branch, with no comparable "not yet merged" claim anywhere in Amendments 1-9.

---

### Amendment 11 -- class 3, mechanical, no claim changed. Written 2026-09-17, a fresh worker's final record-fidelity append under round 12, item 2, closing the architect and reviewer attempt-4 findings and converting every ledger line-cite in this document to the round+item form. Amendments 1-10 are byte-untouched; this item states what is true instead.

**Written after the gates' attempt-4 findings were seen.** §12e's rule, honoured in this line.

**The fence, applied to this amendment's own words** (round 7, item 1): every clause below that says something is done names the test, the report or the `file:line` that proves it.

**Classes used** (`docs/PREREGISTRATION-TEMPLATE.md:101-129`): class 3 throughout (cite/reference form fix, mechanical, never changes a claim).

---

**(1) `kernel/src/skp.rs:796-802` corrected to `:797-803`, in place.** `:1371` cited the live-generation pre-check block one off at both ends, the same defect class the P3b comment-fix round already corrected at this document's own `:840-846` and at the sibling document's `:1006` (its item 5). Corrected in place at `:1371`: this is a stale cross-reference, not a claim, per the template's class 3.

**(2) B-1 -- Amendment 10 (1)'s charge against Amendment 9 (`:1492`) is itself an unmarked elision.** It quotes Amendment 9's introduction (`:1470`) only up to a backtick, dropping the parenthetical in which Amendment 9 names its own head cut, with no `…` marking the drop. Corrected reference, no reproduction: `engine/ADMISSION-PREREGISTRATION.md:1470 @ 60ece22 sha256:b62f1777e3a9de9b404cc1e013c93f1caff2eb299ffaf9fcbf76297ce8260bbc` is that introduction sentence whole, parenthetical included; Amendment 10 (1)'s other two defects against `DECISIONS-PENDING.md:45` stand as it found them, and neither Amendment 9 nor Amendment 10 is edited.

**(3) 465 vs 467 -- what is counted.** `:1498` reproduces round 5, item 1 complete: 465 characters is the ruling's own quoted span inside its source's `**"` … `"**` pair; 467 is that span plus the two `"` marks the source carries around it. Both figures are correct, each for what it counts; `:1498` already says so and is not edited.

**(4) Every `DECISIONS-PENDING.md` line-cite in this document, converted.** Round 12, item 1 (a) (`docs/PREREGISTRATION-TEMPLATE.md:135`): ledger rulings are cited by round and item, never by line. `§12e` opens empty (`:238`), so every one of this document's ledger cites sits inside an amendment (5, 6, 9 or 10); none is edited in place, per §10's own append-only rule (mirrored for the sibling document at its `:876-878`) — each is retired in the index below instead.

---

**Superseded as of this amendment.**

| site | old form | superseded by |
| --- | --- | --- |
| Amendment 5 (ix), `:1274` | `DECISIONS-PENDING.md:182` | not a "question round" ruling -- an entries-style block (`DECISIONS-PENDING.md:173-192`, "entries 59, 60, 61 …") with no round or item number; no round+item form exists to cite, so this stays a plain path:line reference, uncorrected |
| Amendment 6 (iv), `:1381` | `DECISIONS-PENDING.md:44`, verbatim | round 4, item 1 |
| Amendment 9 (1), `:1470` | `DECISIONS-PENDING.md:45` (already self-named "question round 5", item 1 in the same sentence) | round 5, item 1 -- form only, no change in fact |
| Amendment 9 (2), `:1474` | `DECISIONS-PENDING.md:48` (already self-named "same round, item 4" in the same sentence) | round 5, item 4 -- form only, no change in fact |
| Amendment 10 (1), `:1492`/`:1498` | `DECISIONS-PENDING.md:45`, reproduced complete at `:1500` | round 5, item 1; the reproduction itself is superseded by (2) above's reference form |
| `kernel/src/skp.rs` cite, `:1371` | `:796-802` | `:797-803`, corrected in place by (1) above |

---

### Amendment 12 -- the closing state-of-the-record list (2026-09-17, appended; the architect's re-scope under round 12, item 2)

**Written after the gates' attempt-5 findings were seen.** §12e's rule, honoured in this line. **Read this amendment first**: it is the single resolution point for every earlier amendment in §12e, and it supersedes Amendment 11's index in whole.

**Why this form, and what it is not.** Round 12, item 2 provides that if the round fails on the record again, the record -- not the code -- is re-scoped by the architect as a shorter amendment set rather than corrected again; attempt 5 failed on the record, and this is that re-scope, not a sixth correction. This amendment carries **no bare line cite into this document**, **no ledger line cite**, and **no reproduced text**: self-references and references to the sibling preregistration are by section, amendment and item; rulings are by round and item (round 12, item 1 (a)); anything else is `path:line @ <commit> sha256:<hex>` (round 12, item 1 (b)). Where a row must name a defective cite in order to identify it, the cell says **retired form**.

**This commit restores one byte, and appends nothing else.** Amendment 11 (1) corrected a cite **in place** inside Amendment 6, which §12e's append-only rule forbids and which this document has no precedent for; the committed bytes of that line at `60ece22` are restored by this commit, and the correction it intended is carried by the first row below instead. Proof, gate-checkable: after this commit `git diff --numstat 60ece22..HEAD -- engine/ADMISSION-PREREGISTRATION.md` shows **zero deletions**, so every line of Amendments 1-11 is byte-identical to `60ece22`.

**Classes used.** **Class 3** (`docs/PREREGISTRATION-TEMPLATE.md:110-112 @ e53bb97 sha256:e4bc1272dfbdb1f0af4b32592670e6a7b3f0646805c95570e7232723e67b7812`) for every row that only corrects where a reference points. **Class 1** for every row that withdraws, supersedes or narrows a claim, on the stated reading that a gate round's findings are this round's results and such a row records what they invalidate -- stated, not settled, and routed as gap 2. Gaps 1, 3 and 4 fit no pre-declared class and go to the human, unforced.

**The fence, applied to this amendment's own words** (round 7, item 1): every "stands" / "corrected" / "withdrawn" / "owed" clause below names the reference, the commit range, the amendment item or the gate resolution that proves it.

---

**The state of the record, by amendment and item.**

| id | status | what governs now |
| --- | --- | --- |
| Amendment 11 (1) | **withdrawn as to method; its correction stands by this row** | The in-place edit it made inside Amendment 6 is reverted to the bytes at `60ece22`, because §12e is append-only and the sibling document's Amendment 12 item 4 is the precedent: record, never edit. What Amendment 6 (ii)'s fourth bullet cites as `kernel/src/skp.rs:796-802` (retired form) is, at this head, `kernel/src/skp.rs:797-803 @ e53bb97 sha256:4592255528daaca2a102fa1d248411be97ea9bf858664c8b9ed7bbedff74f7b1` -- the live-generation pre-check block, its `if` at the span's first line and its closing brace at the last. Amendment 6 is not edited; this row is the correction. |
| Amendment 11's header clause that Amendments 1-10 are byte-untouched | **corrected** | It was false at `e53bb97`, whose engine hunk is a single in-place replacement inside Amendment 6, and it is true again at this commit after the restore. The falsity is recorded here rather than erased. Proof: the range `60ece22..e53bb97` carries one deletion in this file, and `60ece22..HEAD` carries none. |
| Amendment 11 (1)'s two supporting references | **withdrawn** | As written, one names this document's own `:840-846` (retired form) for a correction of this class; that span is Amendment 4's header and item (i), a test-narration correction, and no correction of this class exists in this document. The other names the sibling document's `:1006` (retired form) for its item 5: the item named is right and the line is wrong, so it governs as **the sibling document's Amendment 13 (1), list item 5**. Neither reference supports the row above, which rests on the pinned `kernel/src/skp.rs` span alone. |
| Amendment 11 (2) | **stands, with its span named** | Its pinned reference replaces Amendment 10 (1)'s unmarked elision, and the hash is the **whole line's**, while the passage it names is a sub-line span of that line -- said here, as the hash form requires. The commit it names is `60ece22`; those bytes are identical at `e53bb97` and this commit does not change them. |
| Amendment 11 (3) | **corrected** | Its claim that Amendment 10 (1)'s closing sentence already disambiguates the figure is false: that sentence states 465 and says nothing about what the figure counts, which is exactly what (3) supplies. The arithmetic stands -- 465 is the ruling's own span inside its source's quote pair, and 467 is that span plus those two marks. Proof: the gate's character count over round 5, item 1's ruling span. |
| Amendment 11's header clause and item (4), that every ledger line-cite in this document is converted and retired | **narrowed** | False as written: three instances had no row -- Amendment 10 (1)'s inner ledger cite, and Amendment 10 (4)'s two. The three rows below supply them, and the clause is narrowed to what this list carries. |
| Amendment 10 (1)'s inner ledger cite | **retired** | **Round 5, item 1** -- form only, no change in fact. |
| Amendment 10 (4)'s two ledger cites | **retired** | **Round 5, item 1** and **round 5, item 4** -- form only, no change in fact. |
| Amendment 10 (4)'s cross-file line cite of the sibling document | **corrected by reference** | It names that document's **Amendment 12 (1)** closing note, corrected there by its **Amendment 13 (3) item 2**; cited by amendment and item, no line, so no later append can move it. |
| Amendment 10 (1)'s cross-file line cite of the sibling document | **corrected by reference** | It names that document's **§10 Amendment 1**, which carries round 5, item 1 complete. The claim that the two are script-compared identical stands, and the gate resolves both against round 5, item 1. |
| Amendment 11 (4)'s rendering of clause (a) | **marked paraphrase** | It inserts a word the clause does not carry and is introduced by a colon after its source cite, which presents a paraphrase as a quotation; marked a paraphrase here. The binding text is `docs/PREREGISTRATION-TEMPLATE.md:135 @ e53bb97 sha256:52ac25cf7d952920e7607afba503c4de93c44deb80422b76bdc6396b0f61a259`, and no rendering of it is reproduced. |
| Amendment 11 (4)'s mirror reference into the sibling document | **corrected by reference** | The passage it points at is that document's **Amendment 10 (a)**, opening paragraph; cited by amendment, no line. |
| Amendment 11's index row for Amendment 5 (ix) | **withdrawn** | The row resolves the wrong text: the retired form `DECISIONS-PENDING.md:182` was written at `264773c`, where that line carried **entry 98**, and at any later head it names unrelated ledger text. Governs now: **entry 98**, the stable identifier Amendment 5 (ix)'s sentence is about; the row's verdict that the cite stays uncorrected is withdrawn. Clause (a) has no form for an entries-style block and clause (b)'s path:line is forbidden into the ledger, so gap 3 routes the form to the human. |
| Amendment 10 (2)'s reading of Amendment 7's elision | **corrected** | Its statement that the cut removed the same clause on both lines understates the third: there the elision also removed the engine's own refusal sentence preceding the limitation clause. Proof: the three log lines reproduced complete at Amendment 10 (2) show the third carrying both. Amendment 10 is not edited. |
| Amendment 11's "Classes used" line | **corrected** | It describes `docs/PREREGISTRATION-TEMPLATE.md:101-129` as five classes and claims class 3 throughout; that span declares **six** (class 6 added on round 5, item 2), and its own items that withdraw or narrow a claim are not class 3. Proof: `docs/PREREGISTRATION-TEMPLATE.md:101-129 @ e53bb97 sha256:d47d4a27c20b2e03cf9d7cccb765735a27a11bfdbbecc8d9f0e21f2772859d8a`. Gap 2 routes the class of a withdrawal. |
| Amendment 6 (i) item 3 -- the ADR-016 Amendment 1 acceptance | **NOT discharged**, unchanged | The human's at P6; its P6-row cite is corrected by Amendment 8 (3). |
| Amendment 6 (ii) third bullet -- the post-check's shell-side cost carrier | **owed**, 2026-09-17 | Unchanged; mirrored in the sibling document's Amendment 4 (g) item 3. |
| Amendment 6 (ii) fourth bullet -- R-D2's `detail` contract | **owed**, 2026-09-17 | Unchanged; its cite is corrected by the first row above, and it is mirrored in the sibling document's Amendment 4 (g) item 1. |
| Amendment 8 (2) item 3 -- G-A2's status-text-verbatim clause | **owed**, at P6 | Unchanged: the string is a P6 wording decision that is the human's, and no test pins it until then. |

**Items that simply stand, by id.** Amendments 1, 2, 3, 4, 5 (i)-(viii) and (x)-(xv), 6 (i) items 1, 2 and 4 and (ii) first bullet, 7, 8 (1) and (3), 9, 10 (3) and (4). Nothing in this amendment touches them; the owed items above are listed only to date them.

**Superseded earlier and unchanged here:** Amendment 6 (ii) second bullet and Amendment 6 (iii)'s T10 verdict (by Amendment 7); Amendment 7 (iii)'s two-item list (by Amendment 8 (2)); Amendment 9 (1)'s reproduction (by Amendment 10 (1), and its charge by Amendment 11 (2)).

---

**Gaps routed to the human, named and not forced** (`docs/PREREGISTRATION-TEMPLATE.md` §10's own instruction).

1. **A class for an evidence-driven sight-list addition** -- the sibling document's Amendment 11 (b) and Amendment 14 (e); the architect's re-scope of 2026-09-17 proposes a class 7. Nothing is assigned here.
2. **The class of a withdrawal in a record-correction round** -- not class 3, and no ruling is narrowed, so not class 5; this amendment uses class 1 on the reading stated above.
3. **How a ledger passage is pinned, and how an entries-style block is cited** -- clause (a) forbids a line cite into the ledger and clause (b)'s path:line is therefore unavailable for ledger text, while an entries-style block carries no round or item at all (Amendment 5 (ix)'s case, the row above). The architect proposes a clause (a').
4. **Where this document's "read the last amendment first" pointer lives.** §12d is this document's sight list and it is pre-code declaration text; a line added there would edit a declaration and shift every §12e line, which is the defect this re-scope exists to remove. The pointer is carried at this amendment's head and foot instead, and whether §12d should carry one at P6 is the human's.

---

**Read this amendment first.** §12e's amendments correct each other only by a later one; this is the last, and it is where any earlier amendment's current state is written.
