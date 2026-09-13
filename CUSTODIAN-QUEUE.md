# CUSTODIAN-QUEUE

Generated from `PLAN.yaml` (sha256 `5fc16a115e0995a7dc91a8dd3a7dfc91980cd16e5728af6e3c06db9c05cd0327`) at `2026-09-13T21:22:36.850Z`.

**Seeded, pending approval.** Lane priorities below are the seeded order from the directive; they have not yet been approved by the human (AUTONOMY.md §2, §4 — the first AskUserQuestion).

## 1. Next

- (nothing ready)

## 2. Ready

- (none)

## 3. Waiting on the human (total: 160 min)

### click

- **entry-78-repo-description** — Entry 78 — repository description and topics (5 min)

### sight

- **m13-bracketed-values** — Part M row M13's two bracketed values (5 min)

### ruling

- **entry-91-polish-held-halves** — Entry 91 — the polish piece's three held halves (87's engine half + ADR-033; 88; 89) (10 min)
- **entry-75-hover-repick-defaults** — Entry 75 — the three hover-repick behaviour choices the ruling on entry 47 did not make (10 min)
- **adr-029-operation-lifecycle** — ADR-029 + the operation lifecycle — decision draft filed for sight (10 min)
- **entry-79-b1-consult-items** — Entry 79 — three items routed for Brief B stage B1's close (15 min)
- **briefa-p3-p6** — Brief A P3-P6 — session identity tier, corpus table, Part N, ADR acceptances (20 min)
- **entry-73-polygon-gate-scope** — Entry 73 — Brief A P0's polygon-only geometry gate vs the compatibility corpus (15 min)
- **drill-clean-clone** — The drill — clean-directory clone, regenerated fixtures, full suite, release build (5 min)
- **entry-69-runtime-dependency** — Entry 69 — the dynamically imported VC++ runtime, beyond the v0.1.0 declared default (5 min)
- **entry-90-static-crt-v0-1-1** — Entry 90 — static CRT as the v0.1.1 build piece (5 min)
- **entry-77-code-signing** — Entry 77 — code signing for the Windows installer (10 min)

### sitting

- **sitting-4-rows** — Walkthrough sitting — the queued operator rows (Part K 66(b), L7/L8, 84/85, Part G 86, polish rows) (45 min)

## 4. Blocked on dependencies

- **b1-engine-kernel-half** — Brief B, stage B1 — the engine/kernel half (attribute projection on viewport_query) — blocked by: briefa-p3-p6
- **entry-86-known-limitations-rewrite** — Entry 86 — KNOWN-LIMITATIONS wording once the zoom-anchor fix lands — blocked by: viewer-86-zoom-anchor
- **evidence-archive-v0-1-0** — First application of the evidence archive — attach v0.1.0's evidence to its release — blocked by: autonomy-work-system
- **release-artifacts-from-ci** — Release artifacts built from the tagged commit's CI run, from v0.1.1 — blocked by: autonomy-work-system

## 5. In progress

- **polish-87-88-89** — Filter-and-hover polish (entries 87, 88, 89) — evidence: branch `polish/filter-and-hover`
- **reaim-no-crs-fixture** — Delegated re-aim — the no-CRS fixture and its tests to Brief A's ruled contract — evidence: branch `fix/no-crs-reaim`
- **lod-feasibility-spike** — LOD feasibility spike — Rust geo vs DuckDB-spatial, headless, reported-only — evidence: branch `spike/lod-feasibility`
- **viewer-86-zoom-anchor** — Entry 86 — the reference bundle viewer's zoom is not anchored at the pointer — evidence: branch `viewer/zoom-anchor`
- **autonomy-work-system** — The autonomous work system itself — plan-as-data, queue, Stop hook, rulings, landing page — evidence: branch `governance/autonomy`

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
