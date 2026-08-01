# ADR-002 — Editing, Topology, and Print Composer Scope

**Status:** Accepted — 2026-07-31 · Amended (see Amendments)
**Resolves:** OPEN block in 03 (editing/topology); confirms print-composer deferral

## Context

Professionals stay on ArcGIS because they can *trust* editing (parcels, utility networks, centerlines). But real-time topology enforcement and multi-user editing are the known swamp: synchronous geometry checks violate "async by default," and the feature set quietly becomes CAD. Meanwhile, the primary user profile here is analysis- and import-dominated; geometry editing is occasional (digitizing field boundaries or vine rows from imagery), not daily.

## Decision

1. **Editing is phased.**
   - **1.0 — safe editing:** add/move/delete features, attribute editing, undo/redo, DB-backed transactions. Single-user. No topology, no snapping.
   - **2.x — professional editing:** snapping, shared vertices, geometry constraints, topology validation, geometry repair.
   - **3.x — enterprise editing:** versioning, conflict resolution, multi-user editing, utility networks, branch versioning.
2. **Editing ships as a first-party plugin, not core.** The kernel owns the primitives — geometry ops, selection, transactional undo via the DAG — and **delegates transactions to the database layer** (DuckDB/SQLite/PostGIS); we never invent transaction machinery. The editing plugin is the first serious consumer of the plugin API: researchers never load it, surveyors do.
3. **Topology is post-processing, not real-time.** Users draw freely; the Data Doctor and async SQL pipelines (`ST_MakeValid` etc.) repair geometry; the AI explains violations in the Problems panel. No synchronous per-vertex checks — the canvas never freezes to validate topology.
4. **Print composer deferred post-1.0.** Web share-link is the publishing path. Escape hatch: export SVG / PDF / GeoJSON / PMTiles and finish layout elsewhere.

## Priority note

Given the user profile (rare geometry editing), basic editing ships in 1.0 but is **scheduled last within the phase** — it must never delay the analysis, import, or AI pillars.

## Consequences

- 1.0 keeps its minimum viable identity as a GIS (you can create data) without entering the swamp.
- The plugin API must be production-ready by 1.0 — editing forces it to be real.
- Multi-user editing is acknowledged as effectively a separate enterprise product (3.x at the earliest).

## Amendments (2026-07-31, per architecture review)

- **Minimal snapping added to 1.0:** snap to vertex, snap to segment, configurable pixel tolerance, optional grid snapping, live geometry-validity warning. Still excluded from 1.0: shared-vertex propagation, network topology, blocking topology enforcement. Rationale: digitizing without any snapping produces data users cannot trust; this subset is far smaller than professional topology.
- **"No real-time enforcement, ever" reworded:** lightweight local feedback (snapping, validity hints) may run synchronously or incrementally; expensive dataset-wide topology checks always run asynchronously.
- **Geometry repair is consent-based:** `ST_MakeValid` can change geometry structure, so it is never applied silently. The Data Doctor shows original → proposed → diff and requires approval; the raw source remains recoverable (05).
- **Editing store corrected:** fine-grained edits live in a local mutable store (SQLite/GeoPackage delta store), not DuckDB. See **ADR-007**.
