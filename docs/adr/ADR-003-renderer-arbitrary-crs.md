# ADR-003 — Renderer and Arbitrary-CRS Strategy

**Status:** Accepted for Windows/WebView2 (2026-08-03) · conditionally accepted at architecture level for macOS/Linux — see Resolution
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

## Resolution (2026-08-03 — spike concluded, M0–M5)

**deck.gl custom layers over the projected 2D canvas are accepted as the renderer architecture.** The purpose-built WebGPU fallback was not triggered: the spike showed raw throughput is not the binding constraint — workload shaping (viewport culling/LOD, per-tile buffers) is, and that lever is renderer-agnostic.

Evidence (`spikes/adr-003-crs-rendering/README.md`; Intel UHD 630 reference profile + GTX 1650 second profile):

- **M0** — WebGL2 and WebGPU both available in WebView2.
- **M1/M1.5** — GPU-bound scaling confirmed on two vendors; vsync floor holds to ~1M rendered points (UHD 630) and 10M (GTX 1650); visible-count reduction fully recovers 60 fps.
- **M2** — offset-relative rendering passes precision at its designed worst case (0.0446 px vs 0.5 px budget, ~11×); the absolute-f32 control fails — re-centering must happen in f64 *before* narrowing.
- **M3** — picking passes via id indirection + host-side f64 lookup (70/70 bit-exact); id discrimination reliable from 2.27 px; `info.coordinate` local-frame hazard documented (ADR-010).
- **M4** — static/overlay editing split holds the vsync floor on the graded scenario on both GPUs; chunked rebase mitigation works CPU-side.
- **M5** — copy audit: 4 avoidable copies + 1 GPU upload, named; ~105–112 MB/s; producer-side cancellation gap in the custom protocol identified (ADR-004 amendment).

**Cross-platform status:**

- CI (macOS + Linux) covers: builds and tests, serialization and exact-ID behaviour, CRS/local-frame calculations, editing and cancellation semantics, report-schema validation.
- CI explicitly does **not** validate: native WebView integration, frame pacing, GPU performance, picking latency, driver behaviour.
- **Hardware validation on macOS/WKWebView and Linux/WebKitGTK are follow-up gates, required before claiming production support on those platforms** (tracked in 07). Until then, macOS/Linux acceptance is at architecture level only.
