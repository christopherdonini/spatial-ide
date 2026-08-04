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

### Pipeline pinning

The engine records, for **every executed reprojection**: the exact PROJ pipeline (the operation
chain), the datum grids used, and the PROJ database version. Saved projects **pin** the recorded
pipeline and re-instantiate it directly on load rather than re-selecting one.

If fresh pipeline selection after a dependency update would differ from the pinned pipeline, the
difference is **surfaced to the user and never silently applied** (principle 8; the no-silent-
conversion rule above).

- **Grids are identified by content hash, not filename.** A grid substituted under the same name is
  a different transformation, and ADR-005's Exact grade asks for content-hashed inputs.
- **An absent pinned grid fails visibly.** PROJ's default behaviour is to fall back to a
  lower-accuracy operation; that fallback is a silent change of result and is not permitted here.
- **Declining a surfaced difference keeps the pin.** The workflow proceeds on the pinned pipeline,
  marked; it does not silently adopt the new selection, and it does not fail.
- **Accepting a surfaced difference re-pins, and displays the consequence.** The new pipeline becomes
  the pin from that point, and any resulting reproducibility-grade change is displayed rather than
  absorbed.

**What this does and does not buy, stated precisely.** ADR-005's **Exact** grade requires *immutable,
content-hashed inputs* **and** *pinned software versions* — a pinned PROJ version plus content-hashed
grids satisfies that text without pinning the *selected pipeline*. Pipeline pinning is therefore
**this engine's own stricter requirement**, not ADR-005's, and it is **not sufficient** for Exact on
its own. It makes that step
*eligible* to participate in an Exact-grade workflow; it decides nothing about the workflow, whose
grade remains the weakest among its inputs (ADR-005; `11`). A reprojection whose pin cannot be
honoured must display the resulting grade demotion rather than quietly keep the old claim.

### CRS identity by definitional equivalence

Whether two CRS definitions are identical is decided by **comparing normalized definitions** — PROJ's
equivalence check may be consulted — and **never by name-string comparison**. Two datasets labelled
"CH1903+ / LV95" may carry different definitions, and two differently-labelled definitions may be the
same CRS.

- **Axis-order normalization happens first.** Ingestion normalizes to the declared internal **(E, N)**
  convention *before* the equivalence decision, and the normalization performed is recorded. An
  equivalence check that ignored axis order would reinstate the EPSG:4326 trap the identity bypass
  exists to avoid.
- **The comparison criterion is named, not implied.** Equivalence is decided on datum, ellipsoid,
  prime meridian, projection method and parameters, and unit — after axis normalization. Anything
  weaker is a name comparison wearing a different coat.
- **Decided once at dataset load, and cached.** The cache is invalidated when a dataset's CRS is
  reassigned — including by the data doctor — because a reassignment changes the answer.
- **Identity paths bypass transformation entirely** and preserve coordinate **bit patterns**. A
  no-op transform that round-trips through a pipeline is not identity; it is a transform that
  happens to be small, and it perturbs bits.

## Metadata

Auto-drafted on save: schema, extent, CRS, lineage summary, AI-drafted description (04). This is what makes principle 2 ("everything is searchable") true in practice — search fails when metadata is optional, so it isn't.

## Execution

Streaming, cancellable queries; partial results flow to the renderer as they arrive (06); intermediates cached content-addressed in the DAG (02).

## Hero capability

Join a 10M-row CSV to a parcels layer in seconds. This single demo sells the engine against both QGIS (slow joins) and spreadsheet workflows.
