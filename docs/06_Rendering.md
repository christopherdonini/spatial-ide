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

**Added 2026-08-08 (rendering-brainstorm harvest) — labels: a declared, unpriced cost.** 08 already carries a Labels dataset class (20k candidates, defined visible labels), but no measurement exists against it and no docs/07 phase schedules the label engine — Beta's nearest item is "Style DSL + editor" (07), not labeling. It is also a large, unpriced cost of any future native-renderer path: the browser supplies text shaping, font fallback, and atlas/SDF rendering; a native `wgpu` renderer supplies none of it. A label-pipeline design spike is owed before any renderer-replacement **decision** — the bake-off filed below may run without one, but its verdict may not be converted into a renderer-replacement decision without one (see `docs/experiments/NATIVE-WGPU-RENDERER-BAKEOFF-PREREGISTRATION.md`'s status header).

## Styles

The style DSL (03) compiles to renderer state. Deterministic: same style + same data → identical style and layout *decisions*; rasterized output is compared within declared platform tolerances (08) — font shaping, antialiasing, and GPU rasterization make cross-platform byte identity unrealistic. Required for reproducibility (01) and AI-written cartography (04).

## Scope

2D first. Terrain, 3D tiles, and globe view are post-1.0 (07) unless the hero slice demands otherwise.

**Added 2026-08-08 (rendering-brainstorm harvest) — reversed-Z parked for a future perspective-3D mode.** Reversed-Z redistributes depth-buffer precision under a perspective projection; the working and publishing canvases are 2D/orthographic today, where the gain is ~nothing, and layer order is **semantic** — style order and explicit passes, not microscopic depth differences. This has pick-path corroboration, not just assertion: ADR-010 rule 6 records last-drawn-fragment winning where symbol footprints overlap in picking resolution (M3) — a narrower fact than general layer ordering, but it shows the accepted evidence already treats overlap-at-a-point as an ordering question, not a depth question, in the one place it was measured. Revisit only when a perspective camera exists (post-1.0, above).

## Stack (ADR-001 amended; ADR-003 resolved 2026-08-03 for Windows/WebView2, amended 2026-08-06)

**Three canvases** behind one renderer interface (ADR-003, and its 2026-08-06 amendment for the
third). ADR-003's *dual-canvas decision for the working canvas is unchanged*; the amendment names an
additional publishing canvas rather than replacing either of the original two:

- **Projected 2D canvas** — the working canvas: current project CRS, Cartesian/projected coordinates, offset-relative rendering for float32 precision at national-grid magnitudes. **deck.gl custom views/layers**, accepted on the concluded spike's evidence; the purpose-built WebGPU fallback was not triggered. (A native Rust `wgpu` renderer bake-off is filed, unscheduled, at `docs/experiments/NATIVE-WGPU-RENDERER-BAKEOFF-PREREGISTRATION.md` — added 2026-08-08, rendering-brainstorm harvest.)
- **Web publishing canvas** — MapLibre: Web Mercator/globe, basemaps, PMTiles/vector tiles, published bundles from web-ready sources (ADR-008).
- **Projected publishing canvas** (ADR-003 amendment, 2026-08-06) — a published bundle whose source CRS is not web-ready renders in its source CRS in a self-contained viewer, no basemap. Canvas selection is explicit, against a declared supported-CRS contract with definitional equivalence — never a CRS identifier string. **In v1 that condition is met by every source and the sentence is not a contradiction:** until the engine can perform the equivalence check, the set routed to the web publishing canvas is *empty by construction* (ADR-008's 2026-08-06 clarification), so v1 always uses this canvas and the MapLibre branch is unimplemented.

**Acceptance gate:** interactively edit a large EPSG:2056 dataset without permanently converting it to EPSG:3857, at centimetre-level picking accuracy, at budget, on all three system webviews. **Met on Windows/WebView2. Not met on macOS/WKWebView or Linux/WebKitGTK** — every measured number in the spike is Windows/ANGLE-D3D11 evidence and does not transfer by assumption, and CI on those platforms covers platform-independent logic only. The renderer choice therefore remains *provisional on macOS and Linux* until their hardware validation gates close (07).

**Boundary rules:** renderer coordinate spaces, authoritative-lookup picking, f64-before-f32 narrowing, the static/dynamic editing split, caches as derived state, declared capacity ceilings, and the failure/recovery contract are governed by **ADR-010** (Accepted 2026-08-03, architect-blockable). The *tiled* buffer/cache implementation — per-tile origins, partial GPU range updates, multi-origin precision — is **ADR-011** (Proposed, unmeasured, binds nothing until its gates are met); its benchmark rows land in 08 with the measurements, not before.

**Data plane:** binary, chunked, backpressured, JSON-free; copies are measured and minimized — not assumed absent (ADR-004). VRAM ceilings and cross-platform webview differences are part of the CI budgets (08).
