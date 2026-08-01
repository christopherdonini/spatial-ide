# 02 — Architecture

## Spatial Kernel Protocol (SKP)

The kernel is headless and exposes one **semantic API** with multiple optimized bindings (ADR-004, details in 10):

```text
Spatial Kernel semantic API
├── Native/generated bindings (in-process)
├── SKP — desktop UI, CLI, notebooks, CI, plugins
└── MCP adapter — external LLMs and agent hosts (04)
```

**Control plane** (commands, progress, cancellation — Tauri IPC) and **data plane** (binary, chunked, backpressured, copy-minimized — never JSON on the hot path) are separate; MCP is never the bulk data plane. The protocol is the product; frontends are replaceable. This is the single most important architectural decision — it is what makes principles 4–7 real.

## Module map

| Module | Responsibility | Notes |
|---|---|---|
| `kernel` | Orchestration, dataset registry, lineage DAG, permissions, undo | Rust |
| `data-engine` | DuckDB + Arrow, connectors, CRS engine, data doctor | See 05 |
| `renderer` | GPU map rendering, labels, style compilation | See 06 |
| `protocol` | SKP control/data plane + MCP adapter | See 04, 10 |
| `frontends` | Desktop app, CLI, notebook UI | Clients only — no logic |

## Resource type system

Everything is an addressable, typed resource (ADR-005; model in 11). **Data resources**, defined now so principle 1 doesn't quietly mean "everything is a vector table":

- **Table** — vector features / attributes (Arrow/GeoArrow)
- **Raster / datacube** — COG, Zarr
- **Point cloud** — COPC / LAS
- **Mesh / 3D tiles**
- **Network / graph**

**Artifacts**: styles, notebooks/workflows, diagnostics, project state, lineage records. Every resource carries: URI, schema, CRS (where spatial), metadata, lineage, reproducibility grade. Operations declare which types they accept. Transfer representations are typed per resource — Arrow is central, not universal (11).

## Incremental computation

The map is a query result. Operations form a **DAG with cached, content-addressed intermediates** (build-system-style recompute). An upstream edit recomputes only affected downstream nodes; the renderer streams the updated results.

Undo is layered by operation class (ADR-006), never implemented in the UI: **pure transformations** replay via the DAG; **workspace mutations** go through a kernel command/event log with transaction boundaries (ADR-007); **external side effects** are audited and approval-gated — not undoable, and never claimed to be.

## Projects

Plain-text, diffable, gittable files. Data referenced by **ResourceRef** — logical URI, content hash, source revision, locators (11) — so moving files never breaks a project. One-command export as a self-contained bundle that copies referenced resources into a local object store. This directly fixes the `.qgz` binary-blob / broken-paths failure mode.

## Time travel

Version the **lineage**, not the data: content-address inputs, store recipes, re-derive outputs on demand. Raster/large-binary diffing is explicitly rejected as a tar pit. Prior art to study: Kart (git-for-geodata, instructive limits), Iceberg-style table formats. Reproducibility is graded Exact → Best-effort per source (ADR-005): mutable or remote sources get snapshots or revision pins, never silent claims of exactness.

## Plugins

Out-of-process SKP/MCP clients — the same API and the same capability permissions as AI agents (04). Sandboxed (WASM is the leading candidate). No in-process Python that breaks on every API bump. This is the direct answer to QGIS plugin rot.

## Editing architecture

Per **ADR-002** (amended) and **ADR-007**: the kernel owns the editing *primitives* — geometry ops, selection, undo via the command/event log — and delegates transactions to the store that owns the mutation: a local mutable store (SQLite/GeoPackage delta store) for fine-grained edits, DuckDB for analytics only, PostGIS as the remote system of record. Transaction machinery is never reinvented. The editing *UI* (digitizing, minimal snapping, later CAD) is a **first-party plugin**, the first serious consumer of the plugin API (12): researchers never load it, surveyors do. Lightweight feedback (snapping, validity hints) may run synchronously; dataset-wide topology checks always run asynchronously.

## ADRs

Architectural decisions live in `adr/`, numbered, immutable once accepted.

- **ADR-001 (accepted, amended)** — Tauri as desktop shell; DuckDB-WASM browser path. Renderer portion reopened by ADR-003; "zero-copy" superseded by ADR-004's copy-minimized data plane.
- **ADR-002 (accepted, amended)** — Phased editing (1.0 safe → 2.x professional → 3.x enterprise) as a plugin; 1.0 includes minimal snapping; consent-based geometry repair; print composer post-1.0.
- **ADR-003 (proposed)** — Renderer + arbitrary-CRS strategy: dual canvas (projected working canvas + web publishing canvas). Blocked on the EPSG:2056 spike; renderer is provisional until it passes.
- **ADR-004 (accepted)** — One semantic API, multiple bindings; control/data plane split; MCP as adapter, never bulk data.
- **ADR-005 (accepted)** — Typed resources, ResourceRef, reproducibility levels; rewords principle 1.
- **ADR-006 (accepted)** — Lineage vs undo vs external side effects: three operation classes with distinct machinery.
- **ADR-007 (accepted)** — Local mutable store (SQLite/GeoPackage) for edits; DuckDB analytical; PostGIS remote system of record.
- **ADR-008 (accepted)** — Static publishing bundle through 1.0; managed sharing service is a separate future ADR.
