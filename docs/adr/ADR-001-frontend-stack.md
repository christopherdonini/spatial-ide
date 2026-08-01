# ADR-001 — Frontend Stack: Rust Core + Web UI (Tauri)

**Status:** Accepted — 2026-07-31 · Amended (see Amendments)
**Resolves:** OPEN blocks in 02 (frontend) and 06 (renderer)

## Context

The kernel is headless Rust speaking SKP (02). Targets: 10M features at 60 fps, and "share an interactive link" as a hero workflow (07). Candidates: Qt/QML (native, custom GPU engine from scratch) vs Rust core + web UI via Tauri.

## Decision

**Rust core + Tauri web UI.** UI in web tech (React/Svelte); rendering reuses MapLibre GL JS / deck.gl / loaders.gl; DuckDB-WASM provides the browser path.

## Rationale

1. **The share-link hero workflow.** Qt/QML has no viable browser path and would force two rendering engines. Tauri shares 90%+ of rendering, styling, and UI logic across desktop and web.
2. **Ecosystem leverage.** A performant GPU map engine from scratch is the project's biggest schedule risk. deck.gl/MapLibre/loaders.gl embody years of optimization we inherit for free.
3. **Enforces principle 6.** Kernel decoupled from UI via SKP over Tauri IPC — web apps and Jupyter clients later use the identical abstractions.
4. **Zero-copy Arrow.** Arrow IPC buffers stream from the Rust engine through Tauri into WebGPU memory with no JSON step, preserving the < 100 ms first-pixels budget.

## Consequences

- Web/WebGL talent pool; DuckDB-WASM runs the same SQL in the browser as the desktop client.
- **Mitigation required:** webview memory/VRAM limits. Streaming architecture is mandatory; VRAM ceiling checks added to the CI perf budgets (08).
- wgpu-native rendering is rejected for now; revisit only if webview limits break the budgets in 08.

## Amendments (2026-07-31, per architecture review)

- **Scope narrowed to the shell.** Tauri as desktop shell stands, provisionally accepted. MapLibre/deck.gl as the *general GIS renderer* is demoted to "validation required": arbitrary projected-CRS rendering must be proven first. See **ADR-003** (dual-canvas architecture + EPSG:2056 spike).
- **"Zero-copy" claim withdrawn.** The hot path is a **copy-minimized** binary data plane — chunked, backpressured, no JSON serialization; copies are measured and minimized, not assumed absent. Control plane and data plane are separated. See **ADR-004**.
- Cross-platform webview validation (Windows/macOS/Linux GPU behavior) added to the CI gates (08).
