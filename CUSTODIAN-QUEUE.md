# CUSTODIAN-QUEUE

Generated from `PLAN.yaml` (sha256 `24d85882b0c7140fdbabaab36fa662cce7d7c5ca09bfc04229d1343813e8ddba`) at `2026-09-18T21:49:18.451Z`.

## 1. Next

- **geometry-types-beyond-polygons** — Geometry types beyond polygons (points, lines) — widening the admission gate, its own preregistration (lane `engine`)

## 2. Ready

- **geometry-types-beyond-polygons** — Geometry types beyond polygons (points, lines) — widening the admission gate, its own preregistration (lane `engine`, order 6, budget 480 min)
- **drill-clean-clone** — The drill — clean-directory clone, regenerated fixtures, full suite, release build (lane `governance`, order 3, budget 60 min)

## 3. Waiting on the human (total: 10 min)

### ruling

- **decision-prepare-managed-selection-default** — Whether "Prepare" for a source *already* managed as an immutable revision (a future tier or a published artifact) may be selected silently or must be confirmed by the operator — a user-visible default, decided at B2's preregistration sight. (5 min)
- **decision-watcher-scheduling** — Whether the watcher node is scheduled before or after Brief A's close (it depends on P3b only, already merged). (5 min)

## 4. Blocked on dependencies

- **accept-adr-013-instance** — Acceptance for the click at P6 -- the ADR-013 degrees-space instance (Proposed; Brief A digest Part 4, with the entry-81 clarification) — blocked by: briefa-p4-corpus-run, briefa-p5-gate-tests
- **accept-adr-015-a1** — Acceptance for the click at P6 -- ADR-015 Amendment 1 (Proposed; Brief A digest Part 5) — blocked by: briefa-p4-corpus-run, briefa-p5-gate-tests
- **accept-adr-016-a1** — Acceptance for the click at P6 -- ADR-016 Amendment 1, the identity tier model (Proposed; rule 3 true of the build since PR #86) — blocked by: briefa-p4-corpus-run, briefa-p5-gate-tests
- **accept-adr-028-qualification** — Acceptance for the click at P6 -- the ADR-028 qualification (Proposed; Brief A digest Part 7) — blocked by: briefa-p4-corpus-run, briefa-p5-gate-tests
- **accept-adr-032** — Acceptance for the click at P6 -- ADR-032 (Proposed; Brief A digest Part 8: Status and Decision) — blocked by: briefa-p4-corpus-run, briefa-p5-gate-tests
- **briefa-p6-part-n-acceptances** — Brief A P6 -- Brief A's close: Part N operator-verified at a sitting (G-A7), the KNOWN-LIMITATIONS rows, and the five ADR acceptances for the click — blocked by: briefa-p4-corpus-run, briefa-p5-gate-tests, briefa-p6-describe-fields
- **b1-engine-kernel-half** — Brief B, stage B1 — the engine/kernel half (attribute projection on viewport_query) — blocked by: briefa-p6-part-n-acceptances
- **entry-79-b1-consult-items** — Entry 79 — three items routed for Brief B stage B1's close — blocked by: b1-engine-kernel-half
- **decision-adr-029-scan-progress-route** — ADR-029's scan-progress route, given G1 (a minimal crate patch exposing the connection handle; raw ffi end to end on the scan path; upstream first) -- deferred to Brief B's B2 by the human, round 16 item 3 — blocked by: adr-029-g1-feasibility, briefb-b2-save-reopen
- **entry-77-code-signing** — Entry 77 — code signing for the Windows installer — blocked by: signpath-application-draft
- **m13-bracketed-values** — Part M row M13's two bracketed values — blocked by: release-v0-1-1
- **signpath-application-draft** — Entry 77 — the SignPath OSS application and disclosure text drafted for the human sight, once a release is CI-built — blocked by: release-v0-1-1
- **site-design-v1** — Landing page redesign — DRAFT-4 (status strip, milestone banner, waiting-on-you cards with unblocks counts, the swimlane board) — blocked by: drill-clean-clone
- **lod-tier-selection** — LOD tier selection -- which tier a viewport draws (renderer/shell, under its own gate); the named product caller of build_tiers (RULED 2026-09-17, round 8); the prepare report and the two labels' shell surface owed here; the operator walkthrough — blocked by: lod-tier-builder-route-b, lod-tier-cache-lifecycle

## 5. In progress

- **lod-tier-builder-route-b** — LOD tier builder, route B (Rust geo) -- under engine/LOD-PREREGISTRATION.md; crate set + parquet promotion approved subject to its §8 gate steps — evidence: PR #84
- **briefa-p3b-owner-side-invalidation** — Brief A P3b -- owner-side invalidation (residency cleared, picks refused), the kernel-authoritative dead-ticket refusal wired with a real caller and three-valued unknown-handle behaviour, the §12e split amendment; its own preregistration and gates. No release includes P3a without P3b — evidence: PR #86
- **briefa-p4-corpus-run** — Brief A P4 -- the compatibility-corpus run against the preregistered expectations (engine/ADMISSION-PREREGISTRATION.md sections 3-5, 8); the admission table generated; every deviation a recorded result, never an adjusted prediction (G-A5, G-A6) — evidence: branch `cut/briefa-p4`
- **briefa-p5-gate-tests** — Brief A P5 -- the gate tests G-A1 to G-A4 and G-A6 of engine/ADMISSION-PREREGISTRATION.md section 12b, each with a recorded mutation; G-A2's post-check route end to end in the real app; late-generation rejection; the fast-admission distinction — evidence: branch `cut/briefa-p5`
- **briefa-p6-describe-fields** — Brief A P6 -- render the three wire fields (crs.provenance, crs.axis_provenance, identity.session_statement) in the describe summary before Part N runs (round 16, item 1) — evidence: branch `cut/briefa-p6-describe-fields`
- **adr-029-g1-feasibility** — ADR-029 G1 — verify a monotone DuckDB scan-progress reading against the vendored crate (blocking feasibility gate) — evidence: PR #92
- **governance-verify-quotes** — verify-quotes -- a gated verbatim-quote check + an advisory cite-content listing (scripts/plan/verify-quotes.mjs), wired into CI beside verify:cites (RULED 2026-09-17, round 10); the Sonnet-default pilot — evidence: branch `governance/verify-quotes`
- **governance-record-round-count** — health strip -- a record-round count per piece: a gate record that gates a record-correction round carries record: true; scripts/plan/health.mjs counts them per node and the strip shows the count beside the first-pass rate, target zero (the human's 2026-09-18 directive, point 4) — evidence: PR #87

## 6. Proposed / unscheduled

### Proposed

- **test-claims-landedness-bound** — verify:test-claims -- bound the advisory window: a planned claim must become binding when its piece lands, not only when the plan says done (architect finding 4, 2026-09-16) (phase `prototype`) — never queued until placed
- **lod-tier-cache-lifecycle** — LOD tier-cache lifecycle -- an owed ADR-031 decision (RULED 2026-09-17, round 8): a total cache ceiling declared relative to free disk at its site, delete-on-supersede as the default candidate with LRU over directories as the alternative, a runner with a scheduler + a priority policy + a cancellation owner, an operator view (phase `prototype`) — never queued until placed
- **governance-verify-mutation-multiline-attrs** — verify-mutation.mjs -- a multi-line string attribute (an ignore reason continued with a line-continuation) clears the pending test state, so the test behind it is silently skipped, never listed and never MISS; found on the LOD fixture-race fix, two tests unseen (phase `prototype`) — never queued until placed
- **governance-verify-mutation-header-token** — verify-mutation.mjs -- the RECORDED MUTATION token is accepted anywhere inside the check's fixed window around a test, so a token in a file header or in a neighbouring test's comment greens a test that carries no mutation of its own (phase `prototype`) — never queued until placed
- **governance-verify-gate-file-exists** — verify.mjs -- a node whose gate names a preregistration path that does not exist on main passes verify:plan; an in-progress or ready node with a dangling gate path should fail by name (found by the record-round-count gate, 2026-09-18) (phase `prototype`) — never queued until placed
- **engine-tests-configured-connections** — engine/tests -- route the 10 raw duckdb::Connection::open_in_memory() sites through a test helper that applies pool::configure_connection (autoload/autoinstall off in test connections too) (phase `prototype`) — never queued until placed
- **release-v0-1-1** — v0.1.1 release (patch) — the human schedules it; static-CRT declined (69a stands), evidence-archive and SignPath draft ride it (phase `prototype`) — never queued until placed
- **adr-032-decision** — ADR-032 — the GeoParquet non-x-first axis order decision (phase `prototype`) — never queued until placed
- **briefb-b2-save-reopen** — Brief B, stage B2 — recipe save / reopen / verification / rebind / cancellation (phase `prototype`) — never queued until placed
- **briefb-b3-publish-v2** — Brief B, stage B3 — bundle v2 and CLI replay through the same publish implementation (phase `prototype`) — never queued until placed
- **briefb-part-o-walkthrough** — Part O — the nine-step recipe walkthrough, after B3 only (phase `prototype`) — never queued until placed
- **engine-source-change-watcher** — The advisory source-change watcher (phase `prototype`) — never queued until placed

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
