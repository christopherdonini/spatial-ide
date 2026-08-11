# Spatial IDE

AI-native spatial computing platform: headless Rust kernel speaking SKP, Tauri shell, DuckDB/Arrow data engine, GPU rendering. Not a QGIS clone — a platform with replaceable clients.

## Read first

- `docs/README.md` — constitution index. **Cite docs by number** ("per 01, derived rule 2"); conflicts resolve lower-number-wins. Accepted ADRs in `docs/adr/` are immutable — append amendments or propose new ADRs, never rewrite. Never edit `docs/01_Principles.md`.
- **Current focus: the docs/07 Prototype hero slice** — open a 5 GB GeoParquet → filter in SQL → style it → publish a static interactive bundle. The ADR-003 renderer/arbitrary-CRS gate concluded 2026-08-03 (accepted for Windows/WebView2; see the ADR's Resolution and `spikes/adr-003-crs-rendering/README.md`'s Outcome) — kernel, engine, and renderer modules may now begin against that architecture, governed by **ADR-010** (render frames, origins, boundary rules — Accepted 2026-08-03, architect-blockable in review). **ADR-011** (tiled render batches and GPU cache lifecycle) holds the *unmeasured* implementation direction split out of ADR-010 on 2026-08-03: it binds nothing, is **not** architect-blockable, and may not be cited either to block a review or as settled design until its acceptance gates are met. Three follow-up items stay open and don't block module work, but do bound what "concluded" means (see docs/07 for all three in full): macOS/Linux hardware validation; the transport bake-off and server-side spatial indexing (both named undesigned in the spike's Outcome, now this slice's own engine work, not a deferred spike gap); and ADR-009 (license/open-core boundary, before any public code).

## Non-negotiables (digest — full versions in docs/01)

- Never block the canvas: every operation cancellable, streaming, progress-reporting.
- CRS is a type. Analytical reprojection is an explicit operation; display reprojection only via a visible view transform. No silent conversion — proven for EPSG:2056 natively on Windows/WebView2 by the concluded ADR-003 spike; macOS/Linux still need their own hardware validation before the same claim holds there.
- No JSON on data hot paths. Binary, chunked, backpressured, **copy-minimized** — never claim "zero-copy" (ADR-004).
- Perf claims require measurements against docs/08 (p50/p95, defined datasets). No numbers, no claim.
- Undo is classed (ADR-006): pure transforms replay; workspace mutations are transactional; external side effects are approval-gated, never called undoable.
- Plain text everywhere: project files, styles, configs are diffable text.

## Repo layout

- `docs/` — the constitution (00–14) + `docs/adr/` (canonical; the old design folder is an archive)
- `spikes/` — throwaway validation code. Spikes may be messy; **written conclusions are the deliverable.**
- `.claude/agents/` — architect (constitution review), reviewer (code review), tester (benchmarks)
- `kernel/`, `engine/` (the **data-engine** module — 05), `protocol/` (SKP control/data plane + MCP adapter — 04, 10), `renderer/`, `frontends/` — five top-level directories, one per docs/02 module. The ADR-003 gate that blocked these has concluded; they may now be built against docs/02's module map. **Scaffolded per vertical slice, as the slice needs them** (07), not created empty up front.

## Environment

Windows 10 Pro 22H2 (build 19045) · Rust stable (MSVC) · WebView2 · VS Build Tools **with the "Desktop development with C++" workload** (MSVC v143 + Windows SDK — without it cargo fails with `link.exe not found`) · Node LTS (required for Tauri frontend tooling). Spike frontend is **vanilla TypeScript deliberately** — ADR-001 left React-vs-Svelte open, and a spike must not decide it.

## Custodian

In remote-operation periods the main session holds the Custodian role — see `AI_DEVELOPMENT.md`'s
"Custodian role" section for the loop, the red lines (decisions that always wait for the human via
`DECISIONS-PENDING.md`), and the accumulated mechanics. The red lines apply in every mode.

## Workflow

Before non-trivial work: consult the `architect` agent. After significant code: `reviewer` agent. Perf/milestone claims: `tester` agent fills the spike results table. Commit style: `<type>: <summary>` (feat/fix/chore/spike/docs).
