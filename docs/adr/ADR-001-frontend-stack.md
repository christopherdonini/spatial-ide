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

## Amendment (2026-08-09) — the web framework is React + TypeScript

**Recorded as the human's decision, 2026-08-09: the desktop shell's UI framework is React with
TypeScript.** The Decision above says "UI in web tech (React/Svelte)" and deliberately left the
choice between them open; the ADR-003 spike frontend was written in vanilla TypeScript precisely so
that a spike would not decide it (CLAUDE.md). The first cut of `frontends/shell/` — the Prototype-
completion arc's walking skeleton — cannot be built without a framework, so the choice is closed
here.

**The Decision itself is unchanged.** Rust core + Tauri web UI, rendering reusing
MapLibre GL JS / deck.gl / loaders.gl, DuckDB-WASM as the browser path: all stand as written and as
already amended. This amendment resolves one alternative *inside* the Decision and nothing else. It
does not touch ADR-003's renderer decision, ADR-004's control/data-plane split, or the 2026-07-31
amendments above — the "zero-copy" withdrawal and the narrowing of the renderer claim remain in
force.

**Scope, so the amendment is not read wider than it is.** Svelte is rejected as *this shell's*
framework, not as a possibility for some future client: docs/02's "the protocol is the product;
frontends are replaceable" means a second client written in another framework stays admissible, and
this is not a project-wide ban. Concretely: React + TypeScript enters the dependency surface of
`frontends/shell/` only. `renderer/bundle-viewer` is **not** migrated and stays dependency-free
vanilla TypeScript, because a published ADR-017 bundle carries its viewer's weight as part of the
artifact. The archived spike frontend is not migrated either.

**No performance claim attaches to this choice.** ADR-001's own mitigation — webview memory and VRAM
ceilings, docs/08 — is unchanged, and it is unmeasured for React: nothing here may be cited as
evidence that a React shell meets any docs/08 budget (docs/01, "no numbers, no claim").
