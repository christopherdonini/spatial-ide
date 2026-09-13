# Preregistration — admission format semantics and the session identity lifecycle (Brief A)

*Drafted 2026-09-10 at Brief A's P0 by the architect agent on the custodian's brief; assembled by the custodian for the human's sight. Committed once, complete — the pinned-text appendix (§2b's precondition) and the extended corpus rows (§3) included; append-only from this commit (§12e).*

**Committed before any code and before any corpus file has been opened by this engine.** Same discipline as `frontends/shell/RESIDENCY-PREREGISTRATION.md` and `kernel/QUERY-WINDOW-ATTRIBUTION-PREREGISTRATION.md`: every rule, expected outcome, fixture and gate below is fixed by this commit; an amendment made after an outcome has been seen **must say so in its first line** and invalidates the work it touches. **Append-only once committed.**

**Authority.** `RELEASE-DRAFTS-0.1.0/post-tag/DRAFT-2-BRIEF-A-admission-and-session-lifecycle.md` — its "Settled boundaries" 1–10 (`:23-70`) are binding and are cited by number, never restated here as this document's own reasoning. The review-loop amendment (Draft 1, `AI_DEVELOPMENT.md` Amendment 1) is in force from its merge. This file declares *what is admitted, refused, and recorded*; it does not design the reader.

---

## 0. Disclosure — no pilot, one architect consult, one corpus already collected

No admission run of any kind informed this file. Two inputs did, and are disclosed rather than left to be inferred:

1. **The compatibility corpus was collected before this file was written** (`target/fixtures/compat-corpus/`, 12 files collected 2026-09-10, then extended the same day with GDAL- and QGIS-written files and a `mutations/` directory, four files retired to keep the main set at the brief's ceiling). It deliberately records **no expected outcome** (`MANIFEST.json`, its README), so nothing below is reverse-engineered from a verdict someone else already formed. Every "observed" value cited here is quoted from that manifest.
2. **The architect consult of 2026-09-09** (`RELEASE-DRAFTS-0.1.0/post-tag/architect-consult-adr-032.md`) shaped §2's rules and §10's ADR list. Two of its cites are second-hand in this file and labelled where used.

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
