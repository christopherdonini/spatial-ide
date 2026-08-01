# 11 — Project and Resource Model

Implements ADR-005.

## Typed resources

Everything is an addressable, typed resource (01). **Data resources**: table, raster/datacube, point cloud, mesh/3D tiles, network. **Artifacts**: style, notebook/workflow, diagnostic, project state, lineage record. Every resource has a stable URI, schema, lifecycle, and provenance.

## Typed data plane

| Resource type | Preferred transfer representation |
|---|---|
| Tables and vectors | Arrow / GeoArrow |
| Rasters and datacubes | Tiled/chunked array buffers, COG/Zarr semantics |
| Point clouds | COPC chunks or typed point buffers |
| Meshes | Vertex/index buffers, glTF / 3D Tiles structures |
| Metadata and commands | SKP control messages |

Arrow is central without being forced into every abstraction.

## ResourceRef

```text
ResourceRef
- logical URI
- content hash, if known
- source revision
- one or more locators
- cache status
- portability policy
```

A content hash alone cannot say where to retrieve data after a file moves; locators can. A self-contained bundle copies required resources into a local object store — projects survive moved files (02).

## Stable feature IDs

Editing (ADR-007) and lineage require stable per-feature identity across edits, snapshots, and compaction. The ID-assignment policy is per dataset and recorded in metadata.

## Reproducibility levels

**Exact → Snapshot → Revision-pinned → Reference-only → Best-effort** (ADR-005). Every notebook and project displays its grade; a derived output's grade is the weakest among its inputs. Mutable PostGIS tables, WFS/REST APIs, live cloud tables, expiring signed URLs, external basemaps, and remote AI models can never silently claim "Exact."

## Lifecycle

Cache and garbage collection operate on resources: unreferenced content-addressed objects are collectable; pinned resources are not.
