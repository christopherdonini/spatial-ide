# CUSTODIAN-QUEUE

Generated from `PLAN.yaml` (sha256 `7319aeff6cee44b3e78505fc882a4425c520da65212fe65081d2cbbf7cec6955`) at `2026-09-24T02:29:09.401Z`.

## 1. Next

- (nothing ready)

## 2. Ready

- (none)

## 3. Waiting on the human (total: 30 min)

### ruling

- **engine-source-change-watcher** — The advisory source-change watcher (15 min)
- **governance-verify-mutation-multiline-attrs** — verify-mutation.mjs -- a multi-line string attribute (an ignore reason continued with a line-continuation) clears the pending test state, so the test behind it is silently skipped, never listed and never MISS; found on the LOD fixture-race fix, two tests unseen (5 min)
- **governance-verify-mutation-header-token** — verify-mutation.mjs -- the RECORDED MUTATION token is accepted anywhere inside the check's fixed window around a test, so a token in a file header or in a neighbouring test's comment greens a test that carries no mutation of its own (5 min)
- **test-claims-landedness-bound** — verify:test-claims -- bound the advisory window: a planned claim must become binding when its piece lands, not only when the plan says done (architect finding 4, 2026-09-16) (5 min)

## 4. Blocked on dependencies

- **geometry-types-beyond-polygons** — Geometry types beyond polygons -- MultiPolygon first, by an architect assessment; reading, rendering, picking, attributes, styling and publishing agree; its own preregistration — blocked by: b1-engine-kernel-half
- **b1-engine-kernel-half** — Brief B, stage B1 — the engine/kernel half (attribute projection on viewport_query) — blocked by: drill-fix-release-only-guard, drill-fix-fixture-watchdog, drill-fix-viewer-build-order, crs-unit-fact-and-bounds
- **entry-79-b1-consult-items** — Entry 79 — three items routed for Brief B stage B1's close — blocked by: b1-engine-kernel-half
- **decision-adr-029-scan-progress-route** — ADR-029's scan-progress route, given G1 (a minimal crate patch exposing the connection handle; raw ffi end to end on the scan path; upstream first) -- deferred to Brief B's B2 by the human, round 16 item 3 — blocked by: b1-engine-kernel-half, geometry-types-beyond-polygons
- **entry-77-code-signing** — Entry 77 — code signing for the Windows installer — blocked by: signpath-application-draft
- **m13-bracketed-values** — Part M row M13's two bracketed values — blocked by: release-v0-1-1
- **signpath-application-draft** — Entry 77 — the SignPath OSS application and disclosure text drafted for the human sight, once a release is CI-built — blocked by: release-v0-1-1
- **site-design-v1** — Landing page redesign — DRAFT-4 (status strip, milestone banner, waiting-on-you cards with unblocks counts, the swimlane board) — blocked by: governance-ci-built-site

## 5. In progress

- **engine-tests-configured-connections** — engine/tests -- route the 10 raw duckdb::Connection::open_in_memory() sites through a test helper that applies pool::configure_connection (autoload/autoinstall off in test connections too) — evidence: PR #111
- **briefa-p3b-owner-side-invalidation** — Brief A P3b -- owner-side invalidation (residency cleared, picks refused), the kernel-authoritative dead-ticket refusal wired with a real caller and three-valued unknown-handle behaviour, the §12e split amendment; its own preregistration and gates. No release includes P3a without P3b — evidence: PR #86
- **crs-unit-fact-and-bounds** — ADR-013 A1 item 6 made true of the build -- a typed CRS unit fact on describe (the next SKP literal), MIN_ANCHOR_SPAN's declared per-unit values and RECENTER_MAX_DRIFT_M's architect-declared degrees value, both pinned by tests — evidence: branch `cut/crs-unit-fact-and-bounds`
- **shell-dependency-audit-piece** — PR #97 as one dependency piece under the full gate (RULED 2026-09-20): the three majors, the typed test helpers, suite, build, the notice diff, the dated package decisions — evidence: PR #97
- **drill-fix-viewer-build-order** — Clean-clone repair 3 -- the bundle viewer built before the shell, explicitly (entry 115) — evidence: PR #106
- **drill-fix-release-only-guard** — Clean-clone repair 1 -- the missing release-only guard on the wall-time measurement test (entry 115) — evidence: PR #104
- **drill-fix-fixture-watchdog** — Clean-clone repair 2 -- fixture generation and the post-write watchdog coordinated (entry 115) — evidence: PR #105
- **known-limitations-owed-rows** — KNOWN-LIMITATIONS -- the rows owed: N9's five (Part N) and entry 120's two lines, in one docs PR — evidence: PR #109
- **governance-verify-gate-file-exists** — verify.mjs -- a node whose gate names a preregistration path that does not exist on main passes verify:plan; an in-progress or ready node with a dangling gate path should fail by name (found by the record-round-count gate, 2026-09-18) — evidence: PR #107

## 6. Proposed / unscheduled

### Proposed

- **lod-tier-selection** — LOD tier selection -- which tier a viewport draws (renderer/shell, under its own gate); the named product caller of build_tiers (RULED 2026-09-17, round 8); the prepare report and the two labels' shell surface owed here; the operator walkthrough (phase `prototype`) — never queued until placed
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
