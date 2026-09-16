# CUSTODIAN-QUEUE

Generated from `PLAN.yaml` (sha256 `f2c4a4e8e9a6d17a8cfc0e81901418474c3c24a90db515042ad38ef5d5edae5a`) at `2026-09-16T11:51:31.169Z`.

## 1. Next

- **adr-029-g1-feasibility** — ADR-029 G1 — verify a monotone DuckDB scan-progress reading against the vendored crate (blocking feasibility gate) (lane `kernel-protocol`)

## 2. Ready

- **adr-029-g1-feasibility** — ADR-029 G1 — verify a monotone DuckDB scan-progress reading against the vendored crate (blocking feasibility gate) (lane `kernel-protocol`, order 5, budget 120 min)
- **drill-clean-clone** — The drill — clean-directory clone, regenerated fixtures, full suite, release build (lane `governance`, order 3, budget 60 min)

## 3. Waiting on the human (total: 0 min)

- (none)

## 4. Blocked on dependencies

- **briefa-p3b-owner-side-invalidation** — Brief A P3b -- owner-side invalidation (residency cleared, picks refused), the kernel-authoritative dead-ticket refusal wired with a real caller and three-valued unknown-handle behaviour, the §12e split amendment; its own preregistration and gates. No release includes P3a without P3b — blocked by: briefa-p3-p6
- **geometry-types-beyond-polygons** — Geometry types beyond polygons (points, lines) — widening the admission gate, its own preregistration — blocked by: briefa-p3-p6
- **b1-engine-kernel-half** — Brief B, stage B1 — the engine/kernel half (attribute projection on viewport_query) — blocked by: briefa-p3-p6
- **entry-79-b1-consult-items** — Entry 79 — three items routed for Brief B stage B1's close — blocked by: b1-engine-kernel-half
- **entry-77-code-signing** — Entry 77 — code signing for the Windows installer — blocked by: signpath-application-draft
- **m13-bracketed-values** — Part M row M13's two bracketed values — blocked by: release-v0-1-1
- **signpath-application-draft** — Entry 77 — the SignPath OSS application and disclosure text drafted for the human sight, once a release is CI-built — blocked by: release-v0-1-1
- **site-design-v1** — Landing page redesign — DRAFT-4 (status strip, milestone banner, waiting-on-you cards with unblocks counts, the swimlane board) — blocked by: drill-clean-clone

## 5. In progress

- **briefa-p3-p6** — Brief A P3-P6 — session identity tier, corpus table, Part N, ADR acceptances — evidence: branch `cut/briefa-p3`
- **engine-extension-autoload-off** — Engine — DuckDB extension autoload/autoinstall OFF by configuration at every connection open; ADR-021 amendment appended (security posture, full gate) — evidence: PR #81
- **lod-tier-builder-route-b** — LOD tier builder, route B (Rust geo) -- under engine/LOD-PREREGISTRATION.md; crate set + parquet promotion approved subject to its §8 gate steps — evidence: branch `engine/lod-tier-builder`
- **self-check-false-readings** — Pre-gate self-checks -- verify:test-claims reads a preregistration's planned tests as advisory until a node naming it as gate is done (the stop-the-line fix); also queued: site.mjs METRIC_RE misreads an ADR number followed by the word 'security' as a duration; verify-mutation only sees a preregistration changed in the same diff — evidence: PR #82

## 6. Proposed / unscheduled

### Proposed

- **test-claims-landedness-bound** — verify:test-claims -- bound the advisory window: a planned claim must become binding when its piece lands, not only when the plan says done (architect finding 4, 2026-09-16) (phase `prototype`) — never queued until placed
- **engine-tests-configured-connections** — engine/tests -- route the 10 raw duckdb::Connection::open_in_memory() sites through a test helper that applies pool::configure_connection (autoload/autoinstall off in test connections too) (phase `prototype`) — never queued until placed
- **release-v0-1-1** — v0.1.1 release (patch) — the human schedules it; static-CRT declined (69a stands), evidence-archive and SignPath draft ride it (phase `prototype`) — never queued until placed
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
