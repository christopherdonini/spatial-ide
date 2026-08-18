# 07 — Roadmap

## Method

**Vertical slices, not horizontal modules.** Each phase ships one end-to-end workflow, fast, within the perf budgets (08). Never build all eight modules in parallel to 20%.

## Prototype — the hero slice

> Open a 5 GB GeoParquet → filter in SQL → style it → publish a static interactive bundle (ADR-008).

Minimal kernel + engine + renderer + one frontend, all speaking SKP. This proves the protocol split, the perf budgets, and the sharing story in one demo.

**Gate — resolved:** ADR-001 accepted (as amended). Rust core + Tauri shell; copy-minimized binary data plane (ADR-004).

**Gate — resolved (2026-08-03):** the **ADR-003 arbitrary-CRS spike** — deck.gl custom layers accepted as the projected-canvas renderer architecture, on Windows/WebView2 evidence (`spikes/adr-003-crs-rendering/README.md`, M0–M5; see ADR-003's Resolution for the full decision). Kernel + engine + renderer modules may now begin against this architecture. *(Added 2026-08-08, rendering-brainstorm harvest: a native Rust `wgpu` renderer bake-off is filed, unscheduled, at `docs/experiments/NATIVE-WGPU-RENDERER-BAKEOFF-PREREGISTRATION.md` — it binds nothing and may not be cited to start the work; its status header names the prerequisites.)*

**Gate — open, follow-up to the above:** **macOS/WKWebView and Linux/WebKitGTK hardware validation.** ADR-003's acceptance on those platforms is architecture-level only — every measured number in the spike (frame time, picking latency, precision, cancellation) is Windows/WebView2/ANGLE-D3D11 evidence, on one display's 60 Hz vsync, and does not transfer by assumption. CI (`.github/workflows/adr-003-spike-ci-{macos,linux}.yml`) covers the platform-independent logic only (builds/tests, serialization, CRS math, editing/cancellation semantics, report schemas) and explicitly does not touch native WebView integration, frame pacing, GPU performance, picking latency, or driver behaviour — this gate is not closed by CI going green. Required before claiming production support on those platforms.

**Gate — open, follow-up to the above:** **the transport bake-off and server-side spatial indexing** — both named as undesigned in the spike's Outcome, and **both since built into and partly answered by this slice, which is why the gate's wording is narrower than it was**. What remains open is stated per item rather than as one claim, because they are no longer open for the same reason. *(Corrected 2026-08-06: the sentence this replaces said the prototype "has no producer-side cancellation" and described indexing as wholly undesigned. Neither is true of the code as it stands, and the gate was overstating what is left to do.)*

- **Transport.** Producer-side cancellation **exists and is asserted**, not designed-for-later. Two distinct facts, each named with the test that carries it rather than bundled: a CANCEL control frame reaches the source and is observed on the producer's own socket (`protocol/data-plane/tests/candidate_a.rs::a_cancel_control_frame_reaches_the_source_and_is_observed_producer_side`), and a peer that closes *without* cancelling still stops the producer (`::a_peer_that_closes_without_cancelling_still_stops_the_producer`). From the kernel's side, `kernel/tests/end_to_end.rs` asserts **the first of the two** end to end (`h2_cancellation_is_observed_by_the_producer_inside_the_budget`, `h2_a_cancel_before_the_first_batch_still_stops_the_query`); the peer-close path has no kernel-level test. What is open is the **choice** the bake-off exists to make: **ADR-012 is Proposed and its status has been withheld twice** — Phase 3 returned no branch that selects a candidate. The evidence lives in `protocol/transport-bakeoff/README.md`, whose crate is deliberately outside the workspace so a dependency bump cannot silently change a measured artifact.
- **Spatial indexing — measured to a close (2026-08-13; `kernel/RESULTS.md` ninth section).** No index prunes IO: an external index over the covering-bbox statistics excluded exactly zero bytes (seventh section, finding 3), and DuckDB's zone maps already prune roughly half of a raster-ordered file at a quarter viewport. Physical layout is the only lever that moved read volume — a Hilbert-ordered 5 GB file read **61.7%** of the raster control's bytes at the near-quarter viewport and won total time 49/49 — but the **preregistered import-layout gate FAILED** on its no-whole-file-regression condition (100.544% vs the declared ≤ 100.5%; Hilbert-ordered files compress ~0.5% worse), and a fail is a complete result: **layout stays out of the import path; no ADR was filed.** The standing bracket: an **unordered** source gets no pruning at all (shuffled control ≥ 99.99% read at every viewport, both classes) — spatial pruning is a property of layout, not of any index. **Reopen conditions** (each requires a fresh preregistered gate, never an amendment): **(1)** evidence that the real workload is small-viewport-dominant with whole-file opens rare — the measured trade re-weights (Hilbert wins 3.3% vs 13.0% at 1/64, loses only on whole-file cost); **(2)** ADR-011's tiled-batch direction accepted in a form that removes whole-extent reads from the hot path (its gate 8 owns the residency question this connects to); **(3)** a demonstrated instrument/writer confound — e.g. explicitly pinned parquet encodings showing the ~0.5% whole-file overhead was the writer's, not the layout's, while the near-quarter win survives. Every figure is warm-cache logical bytes on Windows, one machine, one writer. *(The earlier form of this bullet — the built in-memory index, `IndexUse::Off`, and its measured-slower numbers — is preserved in `kernel/RESULTS.md`'s second section and this file's git history.)*

Both are engine/kernel/protocol-module work, not renderer work, and belong to this slice's build-out, not to a future spike.

**Gate — open:** **ADR-009 license and open-core boundary** (14) — must be resolved before the repository goes public, at the latest by the end of Prototype.

## Alpha

- Data doctor + legacy imports (05)
- Action console (03) — *(Appended 2026-08-18.)* **Split.** The Prototype ships the console's
  **principle-4 visibility obligation only**: every shell GUI action displays either the exact
  control-plane request it sent, or a named statement that no API equivalent exists and which
  decision owns that gap. This is not the Alpha item — docs/03's console additionally promises
  session→notebook recording (13's Workflow IR) and the AI flywheel (04, as narrowed by 09), and
  **both stay Alpha**. Pulling the visibility half forward is not phase-jumping: docs/01
  principle 4's "and shows it" clause is unphased and has been unmet across every shell surface
  since cut 1.
- Problems panel / spatial linting (03)
- Notebooks: record and replay (03)
- MCP server with the permission model (04)
- First external plugin as an out-of-process SKP client (02)

**Gate — resolved:** editing scope fixed by ADR-002 (phased; basic digitizing in 1.0 as a plugin; topology is post-processing).

## Beta

- Lineage time travel + scenario branches (02, 03)
- PostGIS remotes (05)
- Metadata auto-drafting (05)
- Style DSL + editor (03, 06)
- Publishing bundles hardened (managed sharing service stays out — ADR-008)

## 1.0

- Stability and performance polish against 08 budgets
- **SKP v1 protocol freeze** — the ecosystem commitment
- Plugin ecosystem seed (docs, templates, example clients)
- Basic editing plugin (ADR-002 amended, ADR-007): digitize/move/delete, attributes, undo, local-store transactions, minimal snapping — **scheduled last in the phase**; never delays the analysis pillars

## Editing phases (ADR-002)

| Capability | 1.0 | 2.x | 3.x |
|---|---|---|---|
| Add/move/delete features, attribute editing | ✔ | | |
| Undo/redo, DB-backed transactions | ✔ | | |
| Minimal snapping (vertex/segment, tolerance, grid) | ✔ | | |
| Shared vertices, constraints, full snapping environments | ✘ | ✔ | |
| Topology validation, constraints, geometry repair | async only (Data Doctor) | ✔ | |
| Multi-user editing, conflict resolution, branch versioning | ✘ | ✘ | ✔ |

## Explicit non-goals until post-1.0

Print composer (export SVG/PDF/GeoJSON/PMTiles instead), dataset-wide real-time topology enforcement (2.x), enterprise/multi-user editing (3.x), managed sharing service (separate ADR, plausibly separate product — ADR-008), field data collection, 3D globe. Saying no here is what keeps the hero slices shippable.
