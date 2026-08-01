# ADR-003 — Renderer and Arbitrary-CRS Strategy

**Status:** Proposed — blocked on validation spike
**Amends:** ADR-001 (renderer portion)

## Context

The constitution promises a true desktop GIS: native work in EPSG:2056, EPSG:2154, local cadastral systems, polar projections, national equal-area systems, engineering coordinates. MapLibre is fundamentally Web Mercator/globe-centred; deck.gl supports lng/lat, Cartesian, and local offsets — which is not full projected-CRS support. Separately, float32 GPU pipelines lose centimetre precision at national-grid coordinate magnitudes (~10⁶ m) unless rendering is offset-relative. Promoting MapLibre/deck.gl to "the GIS renderer" without proof risks shipping an excellent GeoParquet web-map IDE instead of a desktop spatial platform.

## Proposed architecture

Dual canvas behind one renderer interface:

```text
Renderer interface
├── Projected 2D canvas (the working canvas)
│   ├── current project CRS, Cartesian/projected coordinates
│   ├── offset-relative rendering for float32 precision
│   └── deck.gl custom views/layers, or a later purpose-built WebGPU renderer
└── Web publishing canvas
    ├── MapLibre — Web Mercator / globe
    └── basemaps, PMTiles/vector tiles, published bundles (ADR-008)
```

## Acceptance gate (the spike)

> Load and interactively edit a large dataset in EPSG:2056 **without permanently converting it to EPSG:3857**, maintaining centimetre-level picking accuracy, within the 08 budgets, on all three system webviews (Windows, macOS, Linux).

Pass → this ADR is accepted with deck.gl custom layers as the projected canvas. Fail → the projected canvas gets a purpose-built WebGPU renderer; the Tauri shell (ADR-001) is unaffected, and MapLibre remains for basemaps/publishing either way.

## Consequences

- The 07 Prototype gate includes this spike; the renderer is provisional until it passes.
- 08 gains arbitrary-CRS coordinate/picking accuracy tests and a cross-platform webview matrix.
