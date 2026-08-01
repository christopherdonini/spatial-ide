# 07 — Roadmap

## Method

**Vertical slices, not horizontal modules.** Each phase ships one end-to-end workflow, fast, within the perf budgets (08). Never build all eight modules in parallel to 20%.

## Prototype — the hero slice

> Open a 5 GB GeoParquet → filter in SQL → style it → publish a static interactive bundle (ADR-008).

Minimal kernel + engine + renderer + one frontend, all speaking SKP. This proves the protocol split, the perf budgets, and the sharing story in one demo.

**Gate — resolved:** ADR-001 accepted (as amended). Rust core + Tauri shell; copy-minimized binary data plane (ADR-004).

**Gate — open:** the **ADR-003 arbitrary-CRS spike** — interactively edit a large EPSG:2056 dataset at centimetre picking accuracy without converting to 3857, on all three webviews. The renderer is provisional until this passes; failure routes the projected canvas to a purpose-built WebGPU renderer without changing the shell.

**Gate — open:** **ADR-009 license and open-core boundary** (14) — must be resolved before the repository goes public, at the latest by the end of Prototype.

## Alpha

- Data doctor + legacy imports (05)
- Action console (03)
- Problems panel / spatial linting (03)
- Notebooks: record and replay (03)
- MCP server with the permission model (04)
- First external plugin as an out-of-process SKP client (02)

**Gate — resolved:** editing scope fixed by ADR-002 (phased; basic digitizing in 1.0 as a plugin; topology is post-processing).

## Beta

- Lineage time travel + scenario branches (02, 03)
- PostGIS remotes (05)
- Metadata auto-drafting (05)
- Style DSL + editor (03, 06)
- Publishing bundles hardened (managed sharing service stays out — ADR-008)

## 1.0

- Stability and performance polish against 08 budgets
- **SKP v1 protocol freeze** — the ecosystem commitment
- Plugin ecosystem seed (docs, templates, example clients)
- Basic editing plugin (ADR-002 amended, ADR-007): digitize/move/delete, attributes, undo, local-store transactions, minimal snapping — **scheduled last in the phase**; never delays the analysis pillars

## Editing phases (ADR-002)

| Capability | 1.0 | 2.x | 3.x |
|---|---|---|---|
| Add/move/delete features, attribute editing | ✔ | | |
| Undo/redo, DB-backed transactions | ✔ | | |
| Minimal snapping (vertex/segment, tolerance, grid) | ✔ | | |
| Shared vertices, constraints, full snapping environments | ✘ | ✔ | |
| Topology validation, constraints, geometry repair | async only (Data Doctor) | ✔ | |
| Multi-user editing, conflict resolution, branch versioning | ✘ | ✘ | ✔ |

## Explicit non-goals until post-1.0

Print composer (export SVG/PDF/GeoJSON/PMTiles instead), dataset-wide real-time topology enforcement (2.x), enterprise/multi-user editing (3.x), managed sharing service (separate ADR, plausibly separate product — ADR-008), field data collection, 3D globe. Saying no here is what keeps the hero slices shippable.
