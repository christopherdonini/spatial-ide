# Spike — ADR-003: Arbitrary-CRS Rendering

**Question:** can deck.gl inside a Tauri webview render and edit large datasets in a projected CRS (EPSG:2056) with centimetre picking accuracy — without converting to Web Mercator?

**Stakes:** the only open technical gate in the constitution (docs/adr/ADR-003). Pass → deck.gl is the projected working canvas. Fail → purpose-built WebGPU renderer for the projected canvas; Tauri shell unaffected either way. Both outcomes are wins — the failure mode is *not knowing*.

## Acceptance gate (from ADR-003)

> Load and interactively edit a large dataset in EPSG:2056 **without permanently converting it to EPSG:3857**, maintaining centimetre-level picking accuracy, within docs/08 budgets, on all three system webviews.

This spike proves Windows/WebView2 first; macOS (WKWebView) and Linux (WebKitGTK) run in CI before the ADR flips to accepted.

## Technical approach

- deck.gl `OrthographicView` over raw projected metres — no geographic projection in the view at all.
- **Offset-relative rendering** is where precision lives or dies: EPSG:2056 eastings ≈ 2.6×10⁶ m; float32 carries ~7 significant digits, so absolute coords lose centimetres. Re-center on the view origin (f64 math kernel-side, or deck.gl `coordinateOrigin`) before f32 GPU upload.
- Data path: Rust generates/loads → Arrow IPC → webview via custom protocol / binary channel (**no JSON, even in the spike**) → binary attributes into deck.gl layers.
- Picking: GPU pick → feature id → resolve exact f64 coordinate on the Rust side; compare against ground truth.

## Test data (synthetic first, generated — never committed)

EPSG:2056 extent: E 2,485,000–2,834,000 · N 1,075,000–1,296,000.

- **P1** — 10M random points, uniform over extent
- **P2** — 100k "parcel" polygons / ~10M vertices (perturbed grid)

Real data later: swisstopo open data (cadastral surveying, swissTLM3D) for the final validation run.

## Milestones

- **M0** — Tauri v2 app boots; log renderer availability (WebGL2/WebGPU), GPU adapter info from inside WebView2.
- **M1** — P1 rendered via Arrow → binary attributes; pan/zoom ≥ 60 fps p50, measured p95.
- **M2** — Precision: no vertex jitter at 1:500 zoom anywhere in the extent; screen-space error < 0.5 px.
- **M3** — Picking: click → feature id + exact source coordinate; error < 1 cm.
- **M4** — P2 polygons + vertex-drag editing; precision and frame rate hold during edits.
- **M5** — Data-plane audit: count every copy end-to-end (Rust → IPC → JS → GPU), MB/s throughput, cancellation < 100 ms mid-load (ADR-004 honesty check).

## Results

| Milestone | Metric | Target | Measured | Hardware / method |
|---|---|---|---|---|
| M0 | WebGL2 / WebGPU available | report | WebGL2: **available** (ANGLE/D3D11, GLSL ES 3.00) · WebGPU: **available** (18 features, `core-features-and-limits`) | Windows 11, Intel UHD Graphics 630 (gen-9, ANGLE D3D11 backend), WebView2/Edge runtime 150.0.4078.105, via `tauri dev` |
| M1 | Frame time p50 / p95 (pan, 10M pts) | ≤16 ms / report | **MISSED.** Run 1: p50 157.4 ms / p95 160.9 ms (121 samples). Run 2: p50 158.5 ms / p95 163.9 ms (118 samples). ~10× over the ≤16 ms (60 fps) budget on both runs; p50/p95 tight within a run and consistent across runs, so this reads as a real sustained cost, not noise. | Windows 11, Intel UHD Graphics 630 (gen-9, ANGLE/D3D11, WebGL2), WebView2/Edge 150.0.4078.105, via `tauri dev`, 2 independent runs. Method: self-driven synthetic pan+zoom sweep (`src/m1-render.ts`) over P1 (10M pts, uniform random over the EPSG:2056 extent) rendered as one `ScatterplotLayer` with binary `getPosition` attributes in an `OrthographicView`; 1000 ms warm-up, then frame time = wall-clock delta between consecutive deck.gl `onAfterRender` calls, collected until 150 post-warmup samples or 20 s elapsed (both runs hit the 20 s cap with 118-121 samples). p50/p95 computed by sorting samples and indexing. |
| M1 | Time to first pixels | < 100 ms | **MISSED.** Run 1: 2178 ms (fetch 1906 ms, parse 107 ms). Run 2: 2243 ms (fetch 1970 ms, parse 113 ms). ~22× over the <100 ms budget; fetch of the single unchunked P1 response dominates. | Same hardware/method as above. Measured as `performance.now()` delta from just before the `p1://` fetch starts to the first deck.gl `onAfterRender` callback (query start → first rendered frame), per docs/08. `fetchMs`/`parseMs` are sub-measurements within that span, taken around the Arrow IPC fetch and `tableFromIPC` parse respectively (`src/p1-loader.ts`). Both runs confirmed `pointCount: 10000000` in the report and log line `[M1] P1 generated: 10000000 points, 162500488 bytes Arrow IPC` — evidence the path carried valid binary Arrow (a malformed/JSON payload would fail `tableFromIPC` or yield a wrong count), not the JSON path ADR-004 forbids. Caveat: "query start" is the P1 fetch, which starts only after the app window exists; P1 generation currently runs synchronously *before* the window is created (`src-tauri/src/lib.rs`), so real cold-launch-to-pixels latency is this number plus that startup delay, not reflected here. |
| M2 | Screen-space error @1:500 | < 0.5 px | | |
| M3 | Picking error | < 1 cm | | |
| M4 | Frame p50 during vertex drag (P2) | ≤16 ms | | |
| M5 | Copies on hot path (count) | measured, minimized | | |
| M5 | Cancellation latency | < 100 ms | | |

## Outcome

_To be written when milestones conclude: **Accept deck.gl** / **Fallback WebGPU renderer**, with rationale. Feeds the ADR-003 status change. Spike code is throwaway; this section is the deliverable._
