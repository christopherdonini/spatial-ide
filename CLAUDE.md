# Spatial IDE

AI-native spatial computing platform: headless Rust kernel speaking SKP, Tauri shell, DuckDB/Arrow data engine, GPU rendering. Not a QGIS clone — a platform with replaceable clients.

## Read first

- `docs/README.md` — constitution index. **Cite docs by number** ("per 01, derived rule 2"); conflicts resolve lower-number-wins. Accepted ADRs in `docs/adr/` are immutable — append amendments or propose new ADRs, never rewrite. Never edit `docs/01_Principles.md`.
- **Current focus: the ADR-003 spike** (`spikes/adr-003-crs-rendering/README.md`). It is the only open technical gate. Do not build kernel/engine/renderer modules until it concludes.

## Non-negotiables (digest — full versions in docs/01)

- Never block the canvas: every operation cancellable, streaming, progress-reporting.
- CRS is a type. Analytical reprojection is an explicit operation; display reprojection only via a visible view transform. No silent conversion — the spike exists to prove EPSG:2056 works natively.
- No JSON on data hot paths. Binary, chunked, backpressured, **copy-minimized** — never claim "zero-copy" (ADR-004).
- Perf claims require measurements against docs/08 (p50/p95, defined datasets). No numbers, no claim.
- Undo is classed (ADR-006): pure transforms replay; workspace mutations are transactional; external side effects are approval-gated, never called undoable.
- Plain text everywhere: project files, styles, configs are diffable text.

## Repo layout

- `docs/` — the constitution (00–14) + `docs/adr/` (canonical; the old design folder is an archive)
- `spikes/` — throwaway validation code. Spikes may be messy; **written conclusions are the deliverable.**
- `.claude/agents/` — architect (constitution review), reviewer (code review), tester (benchmarks)
- `kernel/`, `engine/`, `renderer/`, `frontends/` — arrive only after the spike (docs/02 module map)

## Environment

Windows 11 · Rust stable (MSVC) · WebView2 · VS Build Tools · Node LTS (required for Tauri frontend tooling). Spike frontend is **vanilla TypeScript deliberately** — ADR-001 left React-vs-Svelte open, and a spike must not decide it.

## Workflow

Before non-trivial work: consult the `architect` agent. After significant code: `reviewer` agent. Perf/milestone claims: `tester` agent fills the spike results table. Commit style: `<type>: <summary>` (feat/fix/chore/spike/docs).
