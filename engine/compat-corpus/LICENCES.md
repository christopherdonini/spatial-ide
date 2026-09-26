# Compatibility corpus: licences

Current-state summary (`AUTONOMY.md` §22), written under `engine/CORPUS-REPRODUCIBILITY-PREREGISTRATION.md` §2b. Provenance is in `engine/compat-corpus/RECORD.md`.

**Rules:**
- Only primary sources are used: the rights holder's own statement for that material, at a pinned revision where the host allows one.
- A licence is **identified** only when that source names it for the material.
- An identified licence is **open** only when the OSI approved-licence list or the Open Definition conformant-licence list also names it. For #11, OSI approval is read from the SPDX licence list at a pinned release (O4; RULED 2026-09-26, the corpus positions, item (3)).
- A third-party row (#11, #12, R-2–R-4) is `reproducible` only when its licence is both identified and open, and `local-only` otherwise. A project-generated row is `reproducible — by regeneration`, its licence undeclared and no data file distributed (round 26, item 2).

**How sources were handled:**
- No licence text is reproduced here.
- The fetched documents are not tracked; only their hashes are.
- Every source was fetched twice with `curl -sL`. The sha256 is of the first fetch's bytes. "Byte-stable" means both fetches hashed the same.

| id | path | licence as the source names it | primary source (URL, pinned) | retrieved (UTC) | sha256 of the fetched bytes | set |
|---|---|---|---|---|---|---|
| #1 | `geopandas/gp-epsg2056-intkey.parquet` | undeclared — project-generated (round 26, item 2) | none exists (§2b) | n/a | n/a | reproducible — by regeneration |
| #2 | `geopandas/gp-nocrs-nokey.parquet` | undeclared — project-generated (round 26, item 2) | none exists (§2b) | n/a | n/a | reproducible — by regeneration |
| #3 | `geopandas/gp-epsg4326-covering.parquet` | undeclared — project-generated (round 26, item 2) | none exists (§2b) | n/a | n/a | reproducible — by regeneration |
| #4 | `duckdb-spatial/duckdb-lv95range-intkey.parquet` | undeclared — project-generated (round 26, item 2) | none exists (§2b) | n/a | n/a | reproducible — by regeneration |
| #5 | `duckdb-spatial/duckdb-degreesrange-nokey.parquet` | undeclared — project-generated (round 26, item 2) | none exists (§2b) | n/a | n/a | reproducible — by regeneration |
| #6 | `duckdb-spatial/duckdb-mercatorrange-strkey.parquet` | undeclared — project-generated (round 26, item 2) | none exists (§2b) | n/a | n/a | reproducible — by regeneration |
| #7 | `gdal/ogr2ogr-epsg2056-default.parquet` | undeclared — project-generated (round 26, item 2) | none exists (§2b) | n/a | n/a | reproducible — by regeneration |
| #8 | `gdal/ogr2ogr-epsg4326-default.parquet` | undeclared — project-generated (round 26, item 2) | none exists (§2b) | n/a | n/a | reproducible — by regeneration |
| #9 | `gdal/ogr2ogr-epsg2056-no-covering.parquet` | undeclared — project-generated (round 26, item 2) | none exists (§2b) | n/a | n/a | reproducible — by regeneration |
| #10 | `qgis/qgis-savefeatures-epsg2056.parquet` | undeclared — project-generated (round 26, item 2) | none exists (§2b) | n/a | n/a | reproducible — by regeneration |
| #11 | `geoparquet-spec/example.parquet` | Apache License, Version 2.0 (Apache-2.0), named by the repository's `LICENSE` at the pinned commit. There is no `NOTICE` at that commit (HTTP 404, S2). Open: the SPDX licence list at v3.29.0 marks it OSI-approved (O4; RULED 2026-09-26, the corpus positions, item (3)) | https://raw.githubusercontent.com/opengeospatial/geoparquet/4c9f87e5226e36f2022d6bd7d3c1980debdf7431/LICENSE (byte-stable) | 2026-09-26T14:19:00Z | cc771485216b90342591f565e62ad0d406ef036d40891cf27917b919956c4fb1 | reproducible — by fetch |
| #12 | `overture/overture-2026-08-19.0-building-bern.parquet` | Every licence the source names, with attribution (RULED 2026-09-26, the corpus positions, item (3)). The buildings theme: ODbL. Per source, in the source's order: © OpenStreetMap contributors — Open Database License; Esri Community Maps contributors — CC BY 4.0; Global ML Building Footprints — Open Database License; Google Open Buildings — CC BY 4.0; USGS 3D Elevation Program Digital Elevation Program — no licence named by the source; Qian Shi, et al. A First High-quality Vector Data of Buildings in East Asian Countries Based on a Comprehensive Large-scale Mapping Framework. Zenodo, 22 July 2023, doi:10.5281/zenodo.8174931 — CC BY 4.0; Work derived from BTN 2024 ign.es — CC BY 4.0. The release's own notes name no licence (S7). The Open Definition list names ODbL-1.0 and CC-BY-4.0 (O3) | https://raw.githubusercontent.com/OvertureMaps/docs/3d742db2401e785d608d7c0497068f5c9326f8d2/docs/_generated_attribution.mdx (the Foundation's docs repository at its commit for the August 2026 release; byte-stable) | 2026-09-26T14:21:26Z | ed39c1ff27eaf6cb021d80bdc9e142c06255f293bb9b95502e645ca8cfb41c89 | local-only — fetch-only, never redistributed (RULED 2026-09-26, the corpus positions, item (3)) |
| M-2 | `mutations/gp-epsg2056-intkey-truncated.parquet` | undeclared — project-generated (round 26, item 2) | none exists (§2b) | n/a | n/a | reproducible — by regeneration |
| M-3 | `mutations/gp-epsg2056-intkey-geojson-invalid.parquet` | undeclared — project-generated (round 26, item 2) | none exists (§2b) | n/a | n/a | reproducible — by regeneration |
| M-4 | `mutations/ogr2ogr-epsg2056-default-covering-absent-columns.parquet` | undeclared — project-generated (round 26, item 2) | none exists (§2b) | n/a | n/a | reproducible — by regeneration |
| M-1c | `mutations/gp-epsg2056-intkey-changed-same-size.parquet` | undeclared — project-generated (round 26, item 2) | none exists (§2b) | n/a | n/a | reproducible — by regeneration |
| M-1a-equivalent | `mutations/gp-epsg2056-intkey-appended.parquet` | undeclared — project-generated (round 26, item 2) | none exists (§2b) | n/a | n/a | reproducible — by regeneration |
| R-1 | `retired/gp-epsg3857-strkey.parquet` | undeclared — project-generated (round 26, item 2) | none exists (§2b) | n/a | n/a | reproducible — by regeneration |
| R-2 | `retired/poly.parquet` | unidentified. The test-data section of `autotest/README.md` names no licence. The General section of `LICENSE.TXT` names an MIT-style licence for GDAL/OGR in general, and makes no statement specific to autotest data (S4) | https://raw.githubusercontent.com/OSGeo/gdal/03fc216e1fc4af769c651a58176cae602417cca3/autotest/README.md (byte-stable) | 2026-09-26T14:19:46Z | 247f8f8a2bb171400da575744d57939467b03569200034412357daff9a12dcef | local-only |
| R-3 | `retired/test_geoparquet_1_1.parquet` | unidentified, as R-2 | https://raw.githubusercontent.com/OSGeo/gdal/03fc216e1fc4af769c651a58176cae602417cca3/autotest/README.md (byte-stable) | 2026-09-26T14:19:46Z | 247f8f8a2bb171400da575744d57939467b03569200034412357daff9a12dcef | local-only |
| R-4 | `retired/test_with_fid_and_geometry_bbox.parquet` | unidentified, as R-2 | https://raw.githubusercontent.com/OSGeo/gdal/03fc216e1fc4af769c651a58176cae602417cca3/autotest/README.md (byte-stable) | 2026-09-26T14:19:46Z | 247f8f8a2bb171400da575744d57939467b03569200034412357daff9a12dcef | local-only |

## Open-licence lists

- **O1. OSI approved-licence list.**
  - Source: https://opensource.org/licenses, retrieved 2026-09-26T14:21:56Z, sha256 48e5a2b6582d229410e10b35d12266e53852ee122bfefc778fb95e7a36805e76.
  - **Not byte-stable:** a second fetch hashed c44c540291a94e545baaa6a8d3fd91b5f88a8f85a2762c73293ce482cb728140.
  - Its licence table names Apache License, Version 2.0 (Apache-2.0).
- **O2. OSI licence API (disclosed conflict).**
  - Source: https://opensource.org/api/licenses, retrieved 2026-09-26T14:22:20Z, sha256 91305b070052c410dc95b50e2e9a0abd2fcc009078889a99b717639798a68449 (byte-stable).
  - It lists Apache-2.0, but its `approved` field reads false for 119 of its 126 entries, Apache-2.0 and MIT among them.
  - Superseded as #11's pin by O4.
- **O3. Open Definition conformant-licence list.**
  - Source: https://opendefinition.org/licenses/, retrieved 2026-09-26T14:21:57Z, sha256 2e437e107c33501fc3d906697b02182d6974cdbbca50c387d084df4406bfed3e (byte-stable).
  - Its table names ODbL-1.0 and CC-BY-4.0.
- **O4. SPDX licence list, release v3.29.0 (#11's OSI pin; RULED 2026-09-26, the corpus positions, item (3)).** Source: https://raw.githubusercontent.com/spdx/license-list-data/31ba1a50e5397e00a304dbadc76531740e89ee48/json/licenses.json, retrieved 2026-09-26T19:47:35Z, sha256 47d1cc681abe31166b342b6cc4aab13a6ba8ea5c48794697fe3bf8b1dbaf509a (byte-stable). Its `licenses[]` entry with `licenseId` `Apache-2.0` has `isOsiApproved` `true`; `licenseListVersion` 3.29.0.

## Other sources consulted

Each was fetched from the rights holder at the same pin as its row.

| # | URL | retrieved (UTC) | sha256 | byte-stable | what it names for the material |
|---|---|---|---|---|---|
| S1 | https://raw.githubusercontent.com/opengeospatial/geoparquet/4c9f87e5226e36f2022d6bd7d3c1980debdf7431/README.md | 2026-09-26T14:19:12Z | f59d854a7a71abf831f2a10f9a4d366b6b6aaab9bacfa0bee0059d7f99b8f718 | yes | no licence |
| S2 | https://raw.githubusercontent.com/opengeospatial/geoparquet/4c9f87e5226e36f2022d6bd7d3c1980debdf7431/NOTICE | 2026-09-26T14:19:01Z | d5558cd419c8d46bdc958064cb97f963d1ea793866414c025906ec15033512ed | yes | HTTP 404; the hash is of the error body |
| S3 | https://raw.githubusercontent.com/OSGeo/gdal/03fc216e1fc4af769c651a58176cae602417cca3/PROVENANCE.TXT | 2026-09-26T14:19:46Z | 7e07bb47964f77fa4a60344cd3d66a046426c4d91dde5088717ba12a4137a0b9 | yes | nothing on autotest data |
| S4 | https://raw.githubusercontent.com/OSGeo/gdal/03fc216e1fc4af769c651a58176cae602417cca3/LICENSE.TXT | 2026-09-26T14:19:45Z | 1dae3468e81d00da56e2936f74d33b8b3ad09d726437f19ce209a5dabea41f77 | yes | an MIT-style licence for GDAL/OGR in general; nothing specific to autotest data |
| S5 | https://raw.githubusercontent.com/OvertureMaps/docs/3d742db2401e785d608d7c0497068f5c9326f8d2/docs/attribution.mdx | 2026-09-26T14:21:27Z | 1572e735c167d0bbbd6611cbda42dc3897431a8100a0330808e1c193ebedda1b | yes | the page that embeds #12's source; no licence of its own for the theme |
| S6 | https://raw.githubusercontent.com/OvertureMaps/docs/418db30cbdd1b26ca924b9562415ffa579f006ae/docs/_generated_attribution.mdx | 2026-09-26T14:20:32Z | ad1ab5b9d6db92ad298c603db96375a0d4c5708dc35004dad1bf67a1aebb0759 | yes | the docs repository's head on the retrieval date; its buildings section is identical to #12's source |
| S7 | https://raw.githubusercontent.com/OvertureMaps/docs/3d742db2401e785d608d7c0497068f5c9326f8d2/blog/2026-08-19-release-notes.mdx | 2026-09-26T14:21:40Z | a4930aac93d9f1a79355dd0eb6aa8c48fe7767ae084d078edded400946c89c19 | yes | release 2026-08-19.0's own notes: no licence; they point to the attribution page |

## Reproducible set (17)

- `geoparquet-spec/example.parquet` — by fetch
- `geopandas/gp-epsg2056-intkey.parquet` — by regeneration
- `geopandas/gp-nocrs-nokey.parquet` — by regeneration
- `geopandas/gp-epsg4326-covering.parquet` — by regeneration
- `duckdb-spatial/duckdb-lv95range-intkey.parquet` — by regeneration
- `duckdb-spatial/duckdb-degreesrange-nokey.parquet` — by regeneration
- `duckdb-spatial/duckdb-mercatorrange-strkey.parquet` — by regeneration
- `gdal/ogr2ogr-epsg2056-default.parquet` — by regeneration
- `gdal/ogr2ogr-epsg4326-default.parquet` — by regeneration
- `gdal/ogr2ogr-epsg2056-no-covering.parquet` — by regeneration
- `qgis/qgis-savefeatures-epsg2056.parquet` — by regeneration
- `mutations/gp-epsg2056-intkey-truncated.parquet` — by regeneration
- `mutations/gp-epsg2056-intkey-geojson-invalid.parquet` — by regeneration
- `mutations/ogr2ogr-epsg2056-default-covering-absent-columns.parquet` — by regeneration
- `mutations/gp-epsg2056-intkey-changed-same-size.parquet` — by regeneration
- `mutations/gp-epsg2056-intkey-appended.parquet` — by regeneration
- `retired/gp-epsg3857-strkey.parquet` — by regeneration

By regeneration means the procedure `RECORD.md` records. Its section "Regeneration run" gives one run's outcome for #1–#6 and R-1. An entry that carries the human's phrase (RULED 2026-09-26, the corpus positions, item (2)) is one whose regeneration is not established, or is built from one.

## Local-only set (4)

- `overture/overture-2026-08-19.0-building-bern.parquet` — fetch-only, never redistributed
- `retired/poly.parquet`
- `retired/test_geoparquet_1_1.parquet`
- `retired/test_with_fid_and_geometry_bbox.parquet`

Sighted by the human:
