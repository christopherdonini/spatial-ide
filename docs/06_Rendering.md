# 06 — Rendering

## Targets (enforced in CI, see 08)

- Frame and input budgets per the 08 **benchmark matrix** — points, lines, polygons, labels, and rasters are different workloads; there is no single "10M features" number.
- First pixels < 100 ms after query start — results stream in, never a blank wait.
- Every render is cancellable mid-frame batch.

"Never block the canvas" (01) is this module's contract with the user.

## Pipeline

- GPU renderer over a scene graph; layers bind directly to Arrow streams from the engine (05).
- Vector tiles for remote and very large sources.
- **Label engine as a first-class differentiator**: placement quality, collision handling, priorities. Both QGIS and ArcGIS frustrate here; excellent automatic labeling is a visible, marketable win.

## Styles

The style DSL (03) compiles to renderer state. Deterministic: same style + same data → identical style and layout *decisions*; rasterized output is compared within declared platform tolerances (08) — font shaping, antialiasing, and GPU rasterization make cross-platform byte identity unrealistic. Required for reproducibility (01) and AI-written cartography (04).

## Scope

2D first. Terrain, 3D tiles, and globe view are post-1.0 (07) unless the hero slice demands otherwise.

## Stack (ADR-001 amended; ADR-003 pending its spike)

**Dual canvas** behind one renderer interface (ADR-003):

- **Projected 2D canvas** — the working canvas: current project CRS, Cartesian/projected coordinates, offset-relative rendering for float32 precision at national-grid magnitudes. deck.gl custom views/layers, or a purpose-built WebGPU renderer if the spike fails.
- **Web publishing canvas** — MapLibre: Web Mercator/globe, basemaps, PMTiles/vector tiles, published bundles (ADR-008).

**Acceptance gate:** interactively edit a large EPSG:2056 dataset without permanently converting it to EPSG:3857, at centimetre-level picking accuracy, at budget, on all three system webviews. Until this passes, the renderer choice is *provisional*.

**Data plane:** binary, chunked, backpressured, JSON-free; copies are measured and minimized — not assumed absent (ADR-004). VRAM ceilings and cross-platform webview differences are part of the CI budgets (08).
