# CUSTODIAN-QUEUE

Generated from `PLAN.yaml` (sha256 `5a081f379c5880611cdac787b160f696c8c138964737e5d4e774cef4009c6a95`) at `2026-09-26T10:55:59.278Z`.

## 1. Next

- **corpus-reproducibility-record** — The compatibility corpus made reproducible from the tracked tree -- its generator scripts, exact commands and full hashes, no data (wave-1 B) (lane `engine`)

## 2. Ready

- **corpus-reproducibility-record** — The compatibility corpus made reproducible from the tracked tree -- its generator scripts, exact commands and full hashes, no data (wave-1 B) (lane `engine`, order null, budget 180 min)
- **data-plane-origin-non-ascii** — The data plane refuses a stated Origin that is not visible ASCII, as any foreign origin (wave-1 A1-1) (lane `kernel-protocol`, order null, budget 120 min)
- **bundle-viewer-partition-offset-bounds** — The bundle viewer bounds every partition offset by its coordinate array and refuses as partition-decode-failed (wave-1 A3 3(b)) (lane `publish-viewer`, order null, budget 120 min)
- **test-claims-landedness-bound** — verify:test-claims -- bound the advisory window: a planned claim must become binding when its piece lands, not only when the plan says done (architect finding 4, 2026-09-16) (lane `governance`, order 2, budget 90 min)

## 3. Waiting on the human (total: 0 min)

- (none)

## 4. Blocked on dependencies

- **geometry-types-beyond-polygons** — Geometry types beyond polygons -- MultiPolygon first, by an architect assessment; reading, rendering, picking, attributes, styling and publishing agree; its own preregistration — blocked by: engine-source-change-watcher, b1-engine-kernel-half
- **data-plane-stream-registry-bound** — The data plane's StreamRegistry bounded by time plus a declared count ceiling, mirroring the kernel's registry (wave-1 A5-1) — blocked by: data-plane-origin-non-ascii
- **kernel-generation-close-races** — The kernel generation close races -- a post-close invalidate leaving a stray invalidated entry; a viewport_query racing close_dataset minting a generation for a closed name (ADR-035 drafter notes) — blocked by: engine-source-change-watcher
- **b1-engine-kernel-half** — Brief B, stage B1 — the engine/kernel half (attribute projection on viewport_query) — blocked by: engine-source-change-watcher
- **entry-79-b1-consult-items** — Entry 79 — three items routed for Brief B stage B1's close — blocked by: b1-engine-kernel-half
- **decision-adr-029-scan-progress-route** — ADR-029's scan-progress route, given G1 (a minimal crate patch exposing the connection handle; raw ffi end to end on the scan path; upstream first) -- deferred to Brief B's B2 by the human, round 16 item 3 — blocked by: b1-engine-kernel-half, geometry-types-beyond-polygons
- **entry-77-code-signing** — Entry 77 — code signing for the Windows installer — blocked by: signpath-application-draft
- **m13-bracketed-values** — Part M row M13's two bracketed values — blocked by: release-v0-1-1
- **signpath-application-draft** — Entry 77 — the SignPath OSS application and disclosure text drafted for the human sight, once a release is CI-built — blocked by: release-v0-1-1
- **site-design-v1** — Landing page redesign — DRAFT-4 (status strip, milestone banner, waiting-on-you cards with unblocks counts, the swimlane board) — blocked by: governance-ci-built-site

## 5. In progress

- **engine-source-change-watcher** — The advisory source-change watcher — evidence: branch `cut/source-change-watcher`

## 6. Proposed / unscheduled

### Proposed

- **governance-hash-grammar-shared** — Share the path:line @ rev sha256:hex reference grammar between verify-test-claims.mjs and verify-quotes.mjs (phase `prototype`) — never queued until placed
- **lod-tier-selection** — LOD tier selection -- which tier a viewport draws (renderer/shell, under its own gate); the named product caller of build_tiers (RULED 2026-09-17, round 8); the prepare report and the two labels' shell surface owed here; the operator walkthrough (phase `prototype`) — never queued until placed
- **kernel-ticket-drop-followups** — StreamRegistry tickets -- the no-drop-under-guard invariant made unwind-safe and checkable (PR #116's deferred items) (phase `prototype`) — never queued until placed
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
- **b1-shell-half** — Brief B, stage B1 -- the shell half (the hover readout and match per ADR-023, the panel consuming projectable) (phase `prototype`) — never queued until placed
- **publish-refusal-codes-and-attempt-lifecycle** — Publish path: refusal codes kept end to end, and the attempt lifecycle (wave-1 A4-1 to A4-4, A1 observations 1-2, A5-2) (phase `prototype`) — never queued until placed
- **shell-session-log-line-framing** — The shell's session log keeps one line per record: level escaped, and carriage returns escaped in both fields (wave-1 A1-2) (phase `prototype`) — never queued until placed
- **engine-cancel-before-stream-window** — A cancel landing between the producer's last cancellation check and stream_arrow is not lost (wave-1 A5 observation 4) (phase `prototype`) — never queued until placed
- **tile-issue-epoch-growth** — TileViewportStreamManager's issueEpoch map bounded within a dataset session (wave-1 A5 observation 5) (phase `prototype`) — never queued until placed
- **audit-reader-char-boundary** — The audit reader's plain_date refuses a non-char-boundary slice instead of panicking (wave-1 A3 observation 1) (phase `prototype`) — never queued until placed
- **skp-cancel-state-closed-set** — The cancel response's state held to SKP-V0's closed set on both sides, or the spec says a reader may accept others (wave-1 C-1) (phase `prototype`) — never queued until placed
- **suites-and-toolchain-beyond-windows** — The default Rust suites and the shell's install run beyond Windows (wave-1 D-1 to D-4) (phase `prototype`) — never queued until placed

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
