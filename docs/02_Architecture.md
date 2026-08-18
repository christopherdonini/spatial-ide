# 02 — Architecture

## Spatial Kernel Protocol (SKP)

The kernel is headless and exposes one **semantic API** with multiple optimized bindings (ADR-004, details in 10):

```text
Spatial Kernel semantic API
├── Native/generated bindings (in-process)
├── SKP — desktop UI, CLI, notebooks, CI, plugins
└── MCP adapter — external LLMs and agent hosts (04)
```

**Control plane** (commands, progress, cancellation — Tauri IPC) and **data plane** (binary, chunked, backpressured, copy-minimized — never JSON on the hot path) are separate; MCP is never the bulk data plane. The protocol is the product; frontends are replaceable. This is the single most important architectural decision — it is what makes principles 4–7 real.

## Module map

| Module | Directory | Responsibility | Notes |
|---|---|---|---|
| `kernel` | `kernel/` | Orchestration, dataset registry, lineage DAG, permissions, undo | Rust |
| `data-engine` | `engine/` | DuckDB + Arrow, connectors, CRS engine, data doctor | See 05 |
| `renderer` | `renderer/` | GPU map rendering, labels, style compilation | See 06 |
| `protocol` | `protocol/` | SKP control/data plane + MCP adapter | See 04, 10 |
| `frontends` | `frontends/` | Desktop app, CLI, notebook UI | Clients only — no logic |

**Directory naming** *(added 2026-08-03 to resolve a docs/02-vs-CLAUDE.md conflict; module set unchanged)*: the five modules map one-to-one onto five top-level directories. The only name that differs is `data-engine` → `engine/`, and `engine/` holds the **data-engine module and nothing else** — render code lives in `renderer/`, orchestration and workflow execution in `kernel/`. `protocol/` is a directory in its own right, not a subtree of `kernel/`: collapsing it is how the SKP surface gets absorbed into the kernel and the ADR-004 control/data-plane split stops being structural. Directories are **scaffolded per vertical slice as the slice needs them**, not created empty up front — 07's method rule is vertical slices, never every module built in parallel to 20 %.

## Resource type system

Everything is an addressable, typed resource (ADR-005; model in 11). **Data resources**, defined now so principle 1 doesn't quietly mean "everything is a vector table":

- **Table** — vector features / attributes (Arrow/GeoArrow)
- **Raster / datacube** — COG, Zarr
- **Point cloud** — COPC / LAS
- **Mesh / 3D tiles**
- **Network / graph**

**Artifacts**: styles, notebooks/workflows, diagnostics, project state, lineage records. Every resource carries: URI, schema, CRS (where spatial), metadata, lineage, reproducibility grade. Operations declare which types they accept. Transfer representations are typed per resource — Arrow is central, not universal (11).

## Incremental computation

The map is a query result. Operations form a **DAG with cached, content-addressed intermediates** (build-system-style recompute). An upstream edit recomputes only affected downstream nodes; the renderer streams the updated results.

Undo is layered by operation class (ADR-006), never implemented in the UI: **pure transformations** replay via the DAG; **workspace mutations** go through a kernel command/event log with transaction boundaries (ADR-007); **external side effects** are audited and approval-gated — not undoable, and never claimed to be.

## Projects

Plain-text, diffable, gittable files. Data referenced by **ResourceRef** — logical URI, content hash, source revision, locators (11) — so moving files never breaks a project. One-command export as a self-contained bundle that copies referenced resources into a local object store. This directly fixes the `.qgz` binary-blob / broken-paths failure mode.

## Time travel

Version the **lineage**, not the data: content-address inputs, store recipes, re-derive outputs on demand. Raster/large-binary diffing is explicitly rejected as a tar pit. Prior art to study: Kart (git-for-geodata, instructive limits), Iceberg-style table formats. Reproducibility is graded Exact → Best-effort per source (ADR-005): mutable or remote sources get snapshots or revision pins, never silent claims of exactness.

## Plugins

Out-of-process SKP/MCP clients — the same API and the same capability permissions as AI agents (04). Sandboxed (WASM is the leading candidate). No in-process Python that breaks on every API bump. This is the direct answer to QGIS plugin rot.

## Editing architecture

Per **ADR-002** (amended) and **ADR-007**: the kernel owns the editing *primitives* — geometry ops, selection, undo via the command/event log — and delegates transactions to the store that owns the mutation: a local mutable store (SQLite/GeoPackage delta store) for fine-grained edits, DuckDB for analytics only, PostGIS as the remote system of record. Transaction machinery is never reinvented. The editing *UI* (digitizing, minimal snapping, later CAD) is a **first-party plugin**, the first serious consumer of the plugin API (12): researchers never load it, surveyors do. Lightweight feedback (snapping, validity hints) may run synchronously; dataset-wide topology checks always run asynchronously.

## ADRs

Architectural decisions live in `adr/`, numbered, immutable once accepted.

- **ADR-001 (accepted, amended)** — Tauri as desktop shell; DuckDB-WASM browser path. Renderer portion reopened by ADR-003; "zero-copy" superseded by ADR-004's copy-minimized data plane.
- **ADR-002 (accepted, amended)** — Phased editing (1.0 safe → 2.x professional → 3.x enterprise) as a plugin; 1.0 includes minimal snapping; consent-based geometry repair; print composer post-1.0.
- **ADR-003 (accepted for Windows/WebView2, 2026-08-03; amended 2026-08-06)** — Renderer + arbitrary-CRS strategy: **three canvases** — the projected *working* canvas (deck.gl custom layers), the web publishing canvas (MapLibre), and the projected *publishing* canvas added by the 2026-08-06 amendment, which renders a published bundle in its source CRS with no reprojection and no basemap. The amendment leaves the dual-canvas decision for the working canvas untouched; canvas selection is an explicit declared decision against a supported-CRS contract with definitional equivalence, never a CRS identifier string, and **v1 always uses the projected publishing canvas — the MapLibre branch is unimplemented**. The EPSG:2056 spike concluded; macOS/WKWebView and Linux/WebKitGTK are accepted at **architecture level only**, pending hardware validation (07) — the "all three system webviews" gate is not met, so the renderer stays provisional on those two platforms.
- **ADR-004 (accepted)** — One semantic API, multiple bindings; control/data plane split; MCP as adapter, never bulk data.
- **ADR-005 (accepted)** — Typed resources, ResourceRef, reproducibility levels; rewords principle 1.
- **ADR-006 (accepted)** — Lineage vs undo vs external side effects: three operation classes with distinct machinery.
- **ADR-007 (accepted)** — Local mutable store (SQLite/GeoPackage) for edits; DuckDB analytical; PostGIS remote system of record.
- **ADR-008 (accepted; clarified 2026-08-06)** — Static publishing bundle through 1.0; managed sharing service is a separate future ADR. An appended clarification reconciles its second Consequence with the amended ADR-003 and with ADR-017: a bundle is rendered by the **projected publishing canvas**, v1 always uses it, and DuckDB-WASM is reserved (ADR-017 §9) rather than delivered.
- **ADR-010 (accepted, 2026-08-03)** — Render frames, origins, and boundary rules: discriminated coordinate spaces, authoritative lookup vs. scoped cursor unprojection, f64-before-f32 narrowing, the static/dynamic editing boundary, renderer caches as derived state, declared capacity ceilings, and an observable failure/recovery contract. Measured invariants from the ADR-003 spike; **architect-blockable in review** (CLAUDE.md).
- **ADR-011 (proposed)** — Tiled render batches and GPU cache lifecycle: per-tile static buffers with local origins, partial GPU range updates, tile-spanning fragmentation, cache versioning, async consolidation, multi-origin precision. **Unmeasured design direction** split out of ADR-010; binds nothing and is not architect-blockable until its acceptance gates are met.
- **ADR-012 (proposed — status withheld twice)** — Data-plane transport. No measurement selects a candidate: Phase 2 returned confounded blocks, Phase 3 ran on a repaired instrument and returned no branch that selects one. Evidence in `protocol/transport-bakeoff/`, a crate deliberately outside the workspace so a dependency bump cannot change a measured artifact.
- **ADR-013 (proposed)** — Typed coordinate spaces and provenance: the vehicle ADR-010's OPEN block names. **Must be accepted before the editing plugin's digitizing path is built**, per that block's own deadline.
- **ADR-015 (accepted, 2026-08-05)** — Source CRS requirement and caller assertion: refusal when a file declares no CRS, an admission path for a caller's assertion over a source that declares none, and §7's rule that a **viewport** CRS is a caller assertion about the query and never an equivalence judgement. **Architect-blockable.**
- **ADR-016 (proposed)** — Stable feature identity admission and source-key mapping. Split out of ADR-015 §8 on 2026-08-05 so that accepting a CRS policy does not silently accept an identity policy; its Context states what the implemented check does *not* establish.
- **ADR-017 (accepted, 2026-08-06)** — Static bundle format and publish semantics: layout, canonical JSON, the operation digest, `docs/11` conformance, reader conformance, and the declared ceilings. **Architect-blockable.** Carries the human's acceptance condition — scoped publish grant, explicit approval and a redacted audit record before any SKP/CLI/UI/MCP/plugin/notebook/AI surface, and no later than Prototype exit, so `publish-bundle` is developer/test tooling until then. **Three corrigenda are appended** and must be read with it: **1** (2026-08-06) makes `license.license` string-or-null under `declared-by-source`, amending §5/§6/§10; **2** (2026-08-06) corrects the Status line's "§15/§18" (§15, with §13 defining redaction) and its reference to the ADR-003 amendment as unapplied; **3** (2026-08-07) adds the required top-level `viewer_license` member — the distributed code's notice and its corresponding-source route — discharging ADR-009 item 7, amending §5/§14/§15 and making display of the code's terms normative. Corrigendum 3 is **a breaking format change held at `bundle_version` 1** because the population it breaks is empty, and it declares that exception **spent**: no further schema change is available at v1.
- **ADR-009 is open** (license and open-core boundary — see 14, before any public code) and **ADR-014 is reserved** (data-plane stream concurrency and admission control — the question ADR-012's result left open; not yet drafted).
- **ADR-019 (proposed)** — Control-plane admission tickets for data-plane streams: a `viewport_query` mints a single-use, expiring ticket; the data-plane `TAG_START` frame carries only the ticket handle, never query parameters. Retires `protocol/data-plane`'s own declared temporary deviation now that `frontends/shell` gives the project a control plane. Binds nothing; implemented under ADR-004's existing license.
- **ADR-020 (accepted, 2026-08-13)** — Data-plane origin admission for an embedded-webview consumer: the expected origin becomes host-declared (`DataPlaneConfig::expected_origin`), exact-match, never page-supplied, never a wildcard; the port-derived same-origin default remains for consumers that declare none. Accepted as the **mechanism** only — `cfg!(debug_assertions)` as the shell's origin selector is not part of the acceptance, and the `tauri build --debug` mismatch is a recorded fail-closed defect owed before packaged-debug support is claimed. Applied ADR-012 Amendment 1 (the threat-model **Origin** bullet's referent) and `docs/09`'s "Local listening sockets" section at acceptance.
- **ADR-021 (accepted, 2026-08-13)** — A row filter on `viewport_query` (SKP v0.1): filtering is a `filter: {predicate, dialect}` parameter on the existing command, not a new command or a derived-dataset handle; `skp/0.1`; the predicate is a boolean expression (never a statement or SELECT), admitted in three stages against DuckDB's own parse tree with a differential two-sentinel probe that closes a composition-escape class found across three adversarial reviews, eleven typed `skp.filter_*` refusals, and no data-plane change. Two recorded security properties: the allowlist is the boundary that stops a dataset-scoped grant becoming arbitrary local-file read, and the predicate-admission parser is statically linked (admission performs no runtime extension fetch). **Carries the human's acceptance condition:** the filter-panel cut must present liveness + a working cancel during zero-batch filtered scans before any user-facing filter UI ships (true scan-progress is the named SKP-V0 §4.5 debt).
- **ADR-022 (proposed)** — Style v0 as the project's single style model, beyond the bundle: ADR-017 §5a's accepted document becomes the model wherever a style exists; semantics stay in `renderer/`'s two pinned implementations (the shell joined as a third *reader* of the agreement vector, via the extracted renderer-owned `renderer/style-ts`); no consumer canonicalizes or hashes outside `renderer/src/canonical.rs`; a session-scoped style is ephemeral view state (no undo; persisting one triggers ADR-006 class-2 + docs/11 obligations in the same commit — not granted). Implemented by the `cut/style-panel` shell surface, operator-confirmed end to end (walkthrough Part F).
- **ADR-023 (proposed — decision deliberately open)** — Attribute projection on `viewport_query`: the named home for the categorical/live-attributes deferral (the ADR-011-gate-8 pattern). Until decided: the working canvas styles by literal only, hover shows `id` only, and "colour by attribute" lives in the published bundle. No implementation is licensed by the filing.
- **ADR-024 (proposed)** — The class-3 permission boundary and its first exposure surface: files the grant/approval/audit machinery `kernel/src/permission/` already carried (built 2026-08-07, previously recorded only in `kernel/PERMISSION-BOUNDARY.md`, which this ADR **supersedes as home of record** without rewriting its F-1–F-10 findings or its 2026-08-07 human rulings on F-5/F-10) plus the `cut/publish-ui` shell surface that first reaches it — binding-local Tauri commands, never SKP (`SKP-V0.md` §4 items 1/3/11/13); the requester never mints the grant (F-5, made concrete: dataset facts and the native picker's own answer mint it, never a JS-asserted value, including through a dev-only, release-compiled-out E2E test seam that supplies a destination without the picker); DOM approval with one comparison in Rust and a stated limitation (proves deliberateness against operator error, not against an in-page script — an independent reason MCP/AI exposure stays fenced); `ApprovalRoute::ShellDialog` as a dated, QUEUED value-domain widening within `spatial-audit/1`; one `AuditLog` per attempt (F-9); row scope limited to ADR-017 §8's two shapes plus P0's row-filter preflight refusal. **Binds nothing, and filing it is explicitly not the human's own review of the exposure surface that ADR-017's acceptance condition additionally requires — that review, and only that review, discharges the condition.**
- **ADR-026 (proposed)** — CRS definition supply for a caller assertion: where the PROJJSON definition an ADR-015 §3 assertion requires actually comes from, given no PROJ dependency and ADR-015 §5's axis-order-from-the-definition rule. Two explicit routes — a pinned, versioned, content-hashed, in-tree plain-text definition set displayed in full before assertion (never fetched at runtime — ADR-021's security property applied), and paste-PROJJSON-verbatim; provenance recorded as catalog entry id + content hash or `pasted` (docs/05's grid rule applied to definitions); no matching, scoring, or default (ADR-016 §3's discipline applied to CRS). Supply-route decision queued for the human; the admission-remediation cut builds to the both-routes recommendation. *(ADR-025 stays reserved for the publish dead-artifact decision pending Part H8.)*
- **ADR-027 (proposed)** — The action console and display truth: principle 4's "and shows it" clause, delivered as the Prototype's visibility payoff only (notebook recording and AI trace collection stay Alpha). Three display classes — A (SKP command, exact serialized request, copyable), B (binding-local Tauri command, name and plain-language effect only, no arguments, no copy), C (no command at all, "no API equivalent exists" plus the owning decision). Display truth is structural (one capture choke point, reference identity, a language lint), not editorial; an unclassified command fails the build. Carries the human's 2026-08-18 ruling (DECISIONS-PENDING entry 18): principle 4's unmet status for style and publish is accepted-with-a-deadline, inherited from ADR-017's acceptance condition and ADR-022/ADR-023's own resolution respectively.
