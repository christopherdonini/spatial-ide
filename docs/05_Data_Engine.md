# 05 — Data Engine

## Core

DuckDB + Arrow in-process; PostGIS as a first-class remote; **GeoParquet as the native interchange format**. Tables and vectors cross module boundaries as Arrow/GeoArrow; rasters, point clouds, and meshes use typed chunked representations (11) — Arrow is central, not universal.

## Storage roles (ADR-007)

**DuckDB** — analysis, joins, aggregation, GeoParquet querying, materialized analytical results. **SQLite/GeoPackage delta store** — local mutable workspace, fine-grained feature edits, small transactions. **PostGIS** — remote system of record. Edited deltas overlay immutable GeoParquet and compact later; DuckDB queries across both.

## Formats

- **Read/write**: GeoParquet, FlatGeobuf, GeoPackage, COG, Zarr, COPC.
- **Import-only (legacy)**: shapefile, KML, Excel/CSV with coordinate or WKT columns. Legacy formats are import *sources*, never working formats — imports land as clean Arrow/GeoParquet.

## Data doctor

Import anything → **detect → propose → preview → apply**. The raw source is always preserved; issues are detected deterministically; proposed mappings carry confidence scores — "`prop_val`, `Value`, and `Est_Value` may represent the same concept (82%)", never "names restored" — ambiguous or lossy operations require confirmation; the output is a clean Arrow table plus a **transformation recipe and fix report**. Geometry repairs show original → proposed → diff before approval: `ST_MakeValid` can change structure, so it is never silent (principle 8). The AI proposes, it does not manufacture certainty (04); the dirty-data zoo tests all of it (08).

## CRS engine

- CRS is part of the dataset's type and flows through every operation.
- **Analytical** reprojection is always an explicit workflow operation. **Display** reprojection is automatic only through an explicit, visible map-view transform — view EPSG:2056 parcels over a WGS84 basemap without rewriting either source. Every transform is recorded.
- Measurements are units-aware (geodesic where appropriate); "area in degrees²" is unrepresentable.
- Mixing CRS without a declared transform is an **error**, not a warning.
- Axis order handled once, centrally, correctly (the EPSG:4326 lat/lon trap).

## Metadata

Auto-drafted on save: schema, extent, CRS, lineage summary, AI-drafted description (04). This is what makes principle 2 ("everything is searchable") true in practice — search fails when metadata is optional, so it isn't.

## Execution

Streaming, cancellable queries; partial results flow to the renderer as they arrive (06); intermediates cached content-addressed in the DAG (02).

## Hero capability

Join a 10M-row CSV to a parcels layer in seconds. This single demo sells the engine against both QGIS (slow joins) and spreadsheet workflows.
