# Spatial IDE

AI-native spatial computing platform: headless Rust kernel speaking SKP, Tauri shell, DuckDB/Arrow data engine, GPU rendering. Not a QGIS clone — a platform with replaceable clients.

## Read first

- `docs/README.md` — constitution index. **Cite docs by number** ("per 01, derived rule 2"); conflicts resolve lower-number-wins. Accepted ADRs in `docs/adr/` are immutable — append amendments or propose new ADRs, never rewrite. Never edit `docs/01_Principles.md`.
- **Current focus: the follow-ups after v0.1.0.** v0.1.0 (tagged at b391e43, 2026-09-13) shipped the docs/07 Prototype hero slice — open a GeoParquet → filter in SQL → style it → publish a static interactive bundle — as the first packaged Windows build (`RELEASE-0.1.md` §1); the work in hand is what `PLAN.yaml` places and `CUSTODIAN-QUEUE.md` lists. The ADR-003 renderer/arbitrary-CRS gate concluded 2026-08-03 (accepted for Windows/WebView2; see the ADR's Resolution and `spikes/adr-003-crs-rendering/README.md`'s Outcome) — the kernel, engine and renderer modules are built against that architecture, governed by **ADR-010** (render frames, origins, boundary rules — Accepted 2026-08-03, architect-blockable in review). **ADR-011** (tiled render batches and GPU cache lifecycle) holds the *unmeasured* implementation direction split out of ADR-010 on 2026-08-03: it binds nothing, is **not** architect-blockable, and may not be cited either to block a review or as settled design until its acceptance gates are met. Two follow-up items stay open and don't block module work, but do bound what "concluded" means (see docs/07 for both in full): macOS/Linux hardware validation; and the transport bake-off and server-side spatial indexing (both named undesigned in the spike's Outcome, now this slice's own engine work, not a deferred spike gap). ADR-009 (license/open-core boundary) was accepted 2026-08-07, and docs/07 keeps its gate line as history (**note, 2026-09-07: the repository has been public since 2026-08-03, before that acceptance — "before any public code" did not hold in fact; see ADR-009's corrigendum**).

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
- `.claude/agents/` — the subagent definitions: architect (constitution review), reviewer (code review), tester and tester-high (tests and benchmarks), worker and worker-high (implementation), lead-data (engine/kernel preregistration drafts and impact reads), evidence-reader (read-only extraction)
- `kernel/`, `engine/` (the **data-engine** module — 05), `protocol/` (SKP control/data plane + MCP adapter — 04, 10), `renderer/`, `frontends/` — five top-level directories, one per docs/02 module, built against docs/02's module map. **Scaffolded per vertical slice, as the slice needs them** (07), not created empty up front.

## Environment

Windows 10 Pro 22H2 (build 19045) · Rust stable (MSVC) · WebView2 · VS Build Tools **with the "Desktop development with C++" workload** (MSVC v143 + Windows SDK — without it cargo fails with `link.exe not found`) · Node 24 LTS (npm 11+) (required for Tauri frontend tooling). The desktop shell (`frontends/shell/`) is React + TypeScript (ADR-001's 2026-08-09 amendment, scoped to the shell); `renderer/bundle-viewer` and the archived ADR-003 spike frontend stay vanilla TypeScript.

## Custodian

In remote-operation periods the main session holds the Custodian role — see `AI_DEVELOPMENT.md`'s
"Custodian role" section for the loop, the red lines (decisions that always wait for the human via
`DECISIONS-PENDING.md`), and the accumulated mechanics. The red lines apply in every mode.

## Workflow

Before non-trivial work: consult the `architect` agent. After significant code: `reviewer` agent. Perf/milestone claims: `tester` agent records the measured numbers (docs/08) in the results file the piece names. Commit style: `<type>: <summary>` (feat/fix/chore/spike/docs).
