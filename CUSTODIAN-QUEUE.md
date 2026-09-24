# CUSTODIAN-QUEUE

Generated from `PLAN.yaml` (sha256 `6faecffa4840154f3943cfc6eb7c3225c65b54d06c6d32cd592cbaff99c55567`) at `2026-09-24T19:03:21.275Z`.

## 1. Next

- (nothing ready)

## 2. Ready

- (none)

## 3. Waiting on the human (total: 0 min)

- (none)

## 4. Blocked on dependencies

- **geometry-types-beyond-polygons** — Geometry types beyond polygons -- MultiPolygon first, by an architect assessment; reading, rendering, picking, attributes, styling and publishing agree; its own preregistration — blocked by: crs-unit-fact-and-bounds, engine-source-change-watcher, b1-engine-kernel-half
- **engine-source-change-watcher** — The advisory source-change watcher — blocked by: crs-unit-fact-and-bounds, kernel-ticket-drop-under-registry-lock
- **b1-engine-kernel-half** — Brief B, stage B1 — the engine/kernel half (attribute projection on viewport_query) — blocked by: crs-unit-fact-and-bounds, adr-021-023-b1-notes
- **entry-79-b1-consult-items** — Entry 79 — three items routed for Brief B stage B1's close — blocked by: b1-engine-kernel-half
- **decision-adr-029-scan-progress-route** — ADR-029's scan-progress route, given G1 (a minimal crate patch exposing the connection handle; raw ffi end to end on the scan path; upstream first) -- deferred to Brief B's B2 by the human, round 16 item 3 — blocked by: b1-engine-kernel-half, geometry-types-beyond-polygons
- **entry-77-code-signing** — Entry 77 — code signing for the Windows installer — blocked by: signpath-application-draft
- **m13-bracketed-values** — Part M row M13's two bracketed values — blocked by: release-v0-1-1
- **signpath-application-draft** — Entry 77 — the SignPath OSS application and disclosure text drafted for the human sight, once a release is CI-built — blocked by: release-v0-1-1
- **site-design-v1** — Landing page redesign — DRAFT-4 (status strip, milestone banner, waiting-on-you cards with unblocks counts, the swimlane board) — blocked by: governance-ci-built-site
- **test-claims-landedness-bound** — verify:test-claims -- bound the advisory window: a planned claim must become binding when its piece lands, not only when the plan says done (architect finding 4, 2026-09-16) — blocked by: governance-test-claims-superseded-scanner

## 5. In progress

- **briefa-p3b-owner-side-invalidation** — Brief A P3b -- owner-side invalidation (residency cleared, picks refused), the kernel-authoritative dead-ticket refusal wired with a real caller and three-valued unknown-handle behaviour, the §12e split amendment; its own preregistration and gates. No release includes P3a without P3b — evidence: PR #86
- **adr-021-023-b1-notes** — ADR-021's dated note (Float32 filterable by reference to ADR-023; dictionaries excluded by name) and ADR-023's one clarifying sentence (admission one function; the bundle check format-owned) -- one docs PR — evidence: PR #113
- **kernel-ticket-drop-under-registry-lock** — kernel -- a Pending ticket's EngineSource is dropped while StreamRegistry's std Mutex is held; if its post-check found a change, Drop ends the generation and re-locks the same Mutex on the same thread (a hang). Move the removed TicketState out and drop it after the guard is released — evidence: PR #116
- **crs-unit-fact-and-bounds** — ADR-013 A1 item 6 made true of the build -- a typed CRS unit fact on describe (the next SKP literal), MIN_ANCHOR_SPAN's declared per-unit values and RECENTER_MAX_DRIFT_M's architect-declared degrees value, both pinned by tests — evidence: PR #112
- **fixture-regeneration-entry-point** — The 5 GB fixture regenerated through its own entry point outside the measurement harness, byte-identical output (entry 121's second half) — evidence: PR #115
- **known-limitations-owed-rows** — KNOWN-LIMITATIONS -- the rows owed: N9's five (Part N) and entry 120's two lines, in one docs PR — evidence: PR #109
- **governance-verify-mutation-multiline-attrs** — verify-mutation.mjs -- a multi-line string attribute (an ignore reason continued with a line-continuation) clears the pending test state, so the test behind it is silently skipped, never listed and never MISS; found on the LOD fixture-race fix, two tests unseen — evidence: PR #108

## 6. Proposed / unscheduled

### Proposed

- **governance-test-claims-superseded-scanner** — verify:test-claims -- the superseded-name scanner (governance/test-claims-superseded @ 3100766, held under round 16 item 4) (phase `prototype`) — never queued until placed
- **lod-tier-selection** — LOD tier selection -- which tier a viewport draws (renderer/shell, under its own gate); the named product caller of build_tiers (RULED 2026-09-17, round 8); the prepare report and the two labels' shell surface owed here; the operator walkthrough (phase `prototype`) — never queued until placed
- **crs-zoom-constants-per-unit** — ADR-013 A1 item 6, the remaining class -- MAX_ZOOM and extent.ts's fit and degenerate zoom constants declared per CRS unit (crs-unit's STOP LIST Q2) (phase `prototype`) — never queued until placed
- **interactive-zoom-ceiling** — A declared ceiling for interactive zoom (ADR-010 rule 6) -- crs-unit's STOP LIST Q3 (phase `prototype`) — never queued until placed
- **shell-redesign-map-studio** — Shell redesign -- the Map studio direction (the human's choice of 2026-09-23; a design reference, not Authority; the migration plan is to be ruled) (phase `prototype`) — never queued until placed
- **release-v0-1-1** — v0.1.1 release (patch) — the human schedules it; static-CRT declined (69a stands), evidence-archive and SignPath draft ride it (phase `prototype`) — never queued until placed
- **adr-032-decision** — ADR-032 — the GeoParquet non-x-first axis order decision (phase `prototype`) — never queued until placed
- **briefb-b2-save-reopen** — Brief B, stage B2 — recipe save / reopen / verification / rebind / cancellation (phase `prototype`) — never queued until placed
- **briefb-b3-publish-v2** — Brief B, stage B3 — bundle v2 and CLI replay through the same publish implementation (phase `prototype`) — never queued until placed
- **briefb-part-o-walkthrough** — Part O — the nine-step recipe walkthrough, after B3 only (phase `prototype`) — never queued until placed
- **governance-ci-built-site** — Governance -- the site built by CI after merge, the design also addressing tracked-queue conflicts between sibling PRs (phase `prototype`) — never queued until placed
- **geometry-points-cut** — Geometry -- points, its own bounded vertical cut (phase `prototype`) — never queued until placed
- **geometry-lines-cut** — Geometry -- lines, its own bounded vertical cut (phase `prototype`) — never queued until placed

### Unscheduled

- **governance-verify-mutation-header-token** — verify-mutation.mjs -- the RECORDED MUTATION token is accepted anywhere inside the check's fixed window around a test, so a token in a file header or in a neighbouring test's comment greens a test that carries no mutation of its own (phase `prototype`) — ambition, never queued
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
