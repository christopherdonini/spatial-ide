# CUSTODIAN-QUEUE

Generated from `PLAN.yaml` (sha256 `f627af2ae7c8e540a71d863436c6bbfe2ef9fd56924a23260133697a7ca1ecb8`) at `2026-09-23T23:36:22.472Z`.

## 1. Next

- (nothing ready)

## 2. Ready

- (none)

## 3. Waiting on the human (total: 3 min)

### click

- **adr-013-display-statement** — ADR-013 Amendment 1 item 5 made true of the build -- the equirectangular statement rendered in the existing DescribeSummary, which shows at open; no new status surface (3 min)

## 4. Blocked on dependencies

- **accept-adr-013-instance** — Acceptance for the click at P6 -- the ADR-013 degrees-space instance (Proposed; Brief A digest Part 4, with the entry-81 clarification) — blocked by: briefa-p6-part-n-acceptances
- **accept-adr-015-a1** — Acceptance for the click at P6 -- ADR-015 Amendment 1 (Proposed; Brief A digest Part 5) — blocked by: briefa-p6-part-n-acceptances
- **accept-adr-016-a1** — Acceptance for the click at P6 -- ADR-016 Amendment 1, the identity tier model (Proposed; rule 3 true of the build since PR #86) — blocked by: briefa-p6-part-n-acceptances
- **accept-adr-028-qualification** — Acceptance for the click at P6 -- the ADR-028 qualification (Proposed; Brief A digest Part 7) — blocked by: briefa-p6-part-n-acceptances
- **accept-adr-032** — Acceptance for the click at P6 -- ADR-032 (Proposed; Brief A digest Part 8: Status and Decision) — blocked by: briefa-p6-part-n-acceptances
- **briefa-p6-part-n-acceptances** — Brief A P6 -- Brief A's close: Part N operator-verified at a sitting (G-A7), the KNOWN-LIMITATIONS rows, and the five ADR acceptances for the click — blocked by: adr-013-display-statement
- **geometry-types-beyond-polygons** — Geometry types beyond polygons -- MultiPolygon first, by an architect assessment; reading, rendering, picking, attributes, styling and publishing agree; its own preregistration — blocked by: briefa-p6-part-n-acceptances, b1-engine-kernel-half
- **engine-source-change-watcher** — The advisory source-change watcher — blocked by: briefa-p6-part-n-acceptances
- **b1-engine-kernel-half** — Brief B, stage B1 — the engine/kernel half (attribute projection on viewport_query) — blocked by: briefa-p6-part-n-acceptances, drill-fix-release-only-guard, drill-fix-fixture-watchdog, drill-fix-viewer-build-order
- **entry-79-b1-consult-items** — Entry 79 — three items routed for Brief B stage B1's close — blocked by: b1-engine-kernel-half
- **decision-adr-029-scan-progress-route** — ADR-029's scan-progress route, given G1 (a minimal crate patch exposing the connection handle; raw ffi end to end on the scan path; upstream first) -- deferred to Brief B's B2 by the human, round 16 item 3 — blocked by: b1-engine-kernel-half, geometry-types-beyond-polygons
- **shell-dependency-audit-piece** — PR #97 as one dependency piece under the full gate (RULED 2026-09-20): the three majors, the typed test helpers, suite, build, the notice diff, the dated package decisions — blocked by: briefa-p6-part-n-acceptances, accept-adr-013-instance, accept-adr-015-a1, accept-adr-016-a1, accept-adr-028-qualification, accept-adr-032
- **drill-fix-viewer-build-order** — Clean-clone repair 3 -- the bundle viewer built before the shell, explicitly (entry 115) — blocked by: shell-dependency-audit-piece
- **drill-fix-release-only-guard** — Clean-clone repair 1 -- the missing release-only guard on the wall-time measurement test (entry 115) — blocked by: shell-dependency-audit-piece
- **drill-fix-fixture-watchdog** — Clean-clone repair 2 -- fixture generation and the post-write watchdog coordinated (entry 115) — blocked by: shell-dependency-audit-piece
- **entry-77-code-signing** — Entry 77 — code signing for the Windows installer — blocked by: signpath-application-draft
- **m13-bracketed-values** — Part M row M13's two bracketed values — blocked by: release-v0-1-1
- **signpath-application-draft** — Entry 77 — the SignPath OSS application and disclosure text drafted for the human sight, once a release is CI-built — blocked by: release-v0-1-1
- **site-design-v1** — Landing page redesign — DRAFT-4 (status strip, milestone banner, waiting-on-you cards with unblocks counts, the swimlane board) — blocked by: governance-ci-built-site

## 5. In progress

- **briefa-p3b-owner-side-invalidation** — Brief A P3b -- owner-side invalidation (residency cleared, picks refused), the kernel-authoritative dead-ticket refusal wired with a real caller and three-valued unknown-handle behaviour, the §12e split amendment; its own preregistration and gates. No release includes P3a without P3b — evidence: PR #86

## 6. Proposed / unscheduled

### Proposed

- **test-claims-landedness-bound** — verify:test-claims -- bound the advisory window: a planned claim must become binding when its piece lands, not only when the plan says done (architect finding 4, 2026-09-16) (phase `prototype`) — never queued until placed
- **lod-tier-selection** — LOD tier selection -- which tier a viewport draws (renderer/shell, under its own gate); the named product caller of build_tiers (RULED 2026-09-17, round 8); the prepare report and the two labels' shell surface owed here; the operator walkthrough (phase `prototype`) — never queued until placed
- **governance-verify-mutation-multiline-attrs** — verify-mutation.mjs -- a multi-line string attribute (an ignore reason continued with a line-continuation) clears the pending test state, so the test behind it is silently skipped, never listed and never MISS; found on the LOD fixture-race fix, two tests unseen (phase `prototype`) — never queued until placed
- **governance-verify-mutation-header-token** — verify-mutation.mjs -- the RECORDED MUTATION token is accepted anywhere inside the check's fixed window around a test, so a token in a file header or in a neighbouring test's comment greens a test that carries no mutation of its own (phase `prototype`) — never queued until placed
- **governance-verify-gate-file-exists** — verify.mjs -- a node whose gate names a preregistration path that does not exist on main passes verify:plan; an in-progress or ready node with a dangling gate path should fail by name (found by the record-round-count gate, 2026-09-18) (phase `prototype`) — never queued until placed
- **engine-tests-configured-connections** — engine/tests -- route the 10 raw duckdb::Connection::open_in_memory() sites through a test helper that applies pool::configure_connection (autoload/autoinstall off in test connections too) (phase `prototype`) — never queued until placed
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
