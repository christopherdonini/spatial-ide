# CUSTODIAN-QUEUE

Generated from `PLAN.yaml` (sha256 `67acc1bba2ea5e0a69b665af1fac74d5e11858d01c7c6cb7b2c046ced48c2b08`) at `2026-09-14T11:35:59.672Z`.

## 1. Next

- (nothing ready)

## 2. Ready

- (none)

## 3. Waiting on the human (total: 95 min)

### click

- **evidence-archive-v0-1-0** — First application of the evidence archive — attach v0.1.0's evidence to its release (5 min)
- **entry-78-repo-description** — Entry 78 — repository description and topics (5 min)

### ruling

- **briefa-p3-p6** — Brief A P3-P6 — session identity tier, corpus table, Part N, ADR acceptances (20 min)
- **entry-90-static-crt-v0-1-1** — Entry 90 — static CRT as the v0.1.1 build piece (10 min)
- **entry-77-code-signing** — Entry 77 — code signing for the Windows installer (10 min)

### sitting

- **sitting-4-rows** — Walkthrough sitting — the queued operator rows (Part K 66(b), L7/L8, 84/85, Part G 86, polish rows) (45 min)

## 4. Blocked on dependencies

- **geometry-types-beyond-polygons** — Geometry types beyond polygons (points, lines) — widening the admission gate, its own preregistration — blocked by: briefa-p3-p6
- **b1-engine-kernel-half** — Brief B, stage B1 — the engine/kernel half (attribute projection on viewport_query) — blocked by: briefa-p3-p6
- **entry-79-b1-consult-items** — Entry 79 — three items routed for Brief B stage B1's close — blocked by: b1-engine-kernel-half
- **adr-029-g1-feasibility** — ADR-029 G1 — verify a monotone DuckDB scan-progress reading against the vendored crate (blocking feasibility gate) — blocked by: adr-029-operation-lifecycle, sitting-4-rows
- **lod-route-b-divergence** — LOD — explain route B's invalid-output divergence and check route A's static-bundling admissibility (reported-only) — blocked by: sitting-4-rows
- **entry-69-runtime-dependency** — Entry 69 — the dynamically imported VC++ runtime, beyond the v0.1.0 declared default — blocked by: entry-90-static-crt-v0-1-1
- **m13-bracketed-values** — Part M row M13's two bracketed values — blocked by: entry-90-static-crt-v0-1-1
- **signpath-application-draft** — Entry 77 — the SignPath OSS application and disclosure text drafted for the human sight, once a release is CI-built — blocked by: entry-90-static-crt-v0-1-1
- **drill-clean-clone** — The drill — clean-directory clone, regenerated fixtures, full suite, release build — blocked by: sitting-4-rows
- **site-design-v1** — Landing page redesign — DRAFT-4 (status strip, milestone banner, waiting-on-you cards with unblocks counts, the swimlane board) — blocked by: drill-clean-clone

## 5. In progress

- **adr-029-operation-lifecycle** — ADR-029 + the operation lifecycle — decision draft filed for sight — evidence: branch `docs/adr-029-decision`
- **hover-confirming-marker** — Entry 88 as a labelled state — the standing id keeps a plain muted confirming marker between a camera change and its settle re-pick — evidence: PR #64

## 6. Proposed / unscheduled

### Proposed

- **adr-031-lod-preregistration** — ADR-031 (LOD) preregistration, once the feasibility spike reports (phase `prototype`) — never queued until placed
- **adr-032-decision** — ADR-032 — the GeoParquet non-x-first axis order decision (phase `prototype`) — never queued until placed
- **briefb-b2-save-reopen** — Brief B, stage B2 — recipe save / reopen / verification / rebind / cancellation (phase `prototype`) — never queued until placed
- **briefb-b3-publish-v2** — Brief B, stage B3 — bundle v2 and CLI replay through the same publish implementation (phase `prototype`) — never queued until placed
- **briefb-part-o-walkthrough** — Part O — the nine-step recipe walkthrough, after B3 only (phase `prototype`) — never queued until placed

### Unscheduled

- **notebooks-record-replay** — Notebooks: record and replay (03) (phase `alpha`) — ambition, never queued
- **mcp-server-permission-model** — MCP server with the permission model (04) (phase `alpha`) — ambition, never queued
- **first-external-plugin-skp-client** — First external plugin as an out-of-process SKP client (02) (phase `alpha`) — ambition, never queued
- **platform-hardware-validation** — macOS/WKWebView and Linux/WebKitGTK hardware validation (phase `prototype`) — ambition, never queued
- **data-doctor-legacy-imports** — Data doctor + legacy imports (05) (phase `alpha`) — ambition, never queued
- **action-console-remainder** — Action console remainder — notebook recording and the AI flywheel (03) (phase `alpha`) — ambition, never queued
- **problems-panel-spatial-linting** — Problems panel / spatial linting (03) (phase `alpha`) — ambition, never queued
- **lineage-time-travel** — Lineage time travel + scenario branches (02, 03) (phase `beta`) — ambition, never queued
- **postgis-remotes** — PostGIS remotes (05) (phase `beta`) — ambition, never queued
- **style-dsl-editor** — Style DSL + editor (03, 06) (phase `beta`) — ambition, never queued
- **publishing-bundles-hardened** — Publishing bundles hardened (managed sharing service stays out — ADR-008) (phase `beta`) — ambition, never queued
- **skp-v1-protocol-freeze** — SKP v1 protocol freeze — the ecosystem commitment (phase `v1`) — ambition, never queued
- **plugin-ecosystem-seed** — Plugin ecosystem seed (docs, templates, example clients) (phase `v1`) — ambition, never queued
- **basic-editing-plugin** — Basic editing plugin (ADR-002 amended, ADR-007) — scheduled last in 1.0 (phase `v1`) — ambition, never queued
