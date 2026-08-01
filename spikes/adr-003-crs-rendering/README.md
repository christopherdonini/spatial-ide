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

## Diagnostic notes (M1.5)

Informal follow-up to M1, not a milestone: M1 already recorded (unfiltered) that both the frame-time and time-to-first-pixels budgets were missed. M1.5 exists only to characterize *why* — GPU-bound, framework-bound, or workload-shaping — to feed M2–M5 planning. No pass/fail verdicts below, and the M0–M5 table above is unchanged. All four experiments reuse M1's exact fixed-seed 10M-point EPSG:2056 P1 dataset, the same `p1` custom protocol delivering Arrow IPC (never JSON, ADR-004), and the same self-driving pan/zoom benchmark harness (still no browser-automation path into the native WebView2 window). Run twice for a consistency check; both runs agree closely.

Hardware/method common to all four blocks below (same as M1): Windows 11, Intel UHD Graphics 630 (gen-9, ANGLE/D3D11, WebGL2), WebView2/Edge 150.0.4078.105, via `RUN_M1_5=1 npm run tauri dev`, `src/m1_5-diagnostics.ts`. 2 independent runs, `frameTimeP50`/`p95` computed the same way as M1 (sorted `onAfterRender` deltas). Sample target/cap per block: scaling curve and toggles use 60 samples / 10 s cap; visible-count uses 120 samples / 20 s cap (closer to M1's own 150/20 s, since it's the block most directly comparable to M1's headline number); streaming doesn't use frame-time percentiles at all (see block 4).

**1. Scaling curve** — same pan/zoom sweep at n = 500k/1M/2M/5M/10M points (`?n=` slices a prefix of the same dataset, no new RNG draw).

| n | Run 1 p50 / p95 (ms) | Run 2 p50 / p95 (ms) |
|---|---|---|
| 500,000 | 16.8 / 17.5 | 16.7 / 17.2 |
| 1,000,000 | 16.7 / 17.2 | 16.7 / 17.1 |
| 2,000,000 | 33.1 / 33.7 | 33.2 / 34.1 |
| 5,000,000 | 66.7 / 85.9 | 66.7 / 83.3 |
| 10,000,000 | 131.9 / 147.0 | 136.2 / 193.7 |

500k and 1M both floor at ~16.7 ms (the 60 fps/vsync interval) — frame time only starts climbing once per-frame GPU work exceeds that budget. From 1M→10M, p50 grows roughly in proportion to point count (2M ≈ 2× the 1M-and-up baseline, 5M ≈ 4×, 10M ≈ 8×; 5M→10M alone is almost exactly 2.0× time for 2.0× points in both runs). p95 at 10M is noticeably noisier across runs (147 vs. 194 ms) than p50, consistent with occasional GC/compositor stalls layered on top of a real, roughly-linear-in-n cost floor.

**2. Cheap toggles at 10M** — one reference layer config (pickable / antialiasing / depth-test all on, `radiusMinPixels: 0`) plus 6 single-setting variants, each measured once, delta vs. the reference's p50.

| Variant | Run 1 p50 (Δ) | Run 2 p50 (Δ) |
|---|---|---|
| reference | 136.7 ms (+0) | 143.4 ms (+0) |
| pickable:false | 132.5 ms (−4.2) | 135.1 ms (−8.3) |
| antialiasing:false | 137.3 ms (+0.6) | 143.3 ms (−0.1) |
| useDevicePixels:false | 138.2 ms (+1.5) | 143.8 ms (+0.4) |
| radiusMinPixels:1 | 138.7 ms (+2.0) | 144.6 ms (+1.2) |
| depthTest:false | 139.3 ms (+2.6) | 144.9 ms (+1.5) |

All deltas are single-digit-ms against a ~137–143 ms baseline (a few percent each); the largest and most consistent is `pickable:false` (−4 to −8 ms), the rest sit within noise of each other. None of these individually, nor all six summed, gets anywhere near closing the ~120 ms gap between the reference and the 16 ms/60 fps budget.

**3. Visible-count scenario** — `?bbox=` does an unindexed linear scan (`src-tauri/src/p1.rs` `arrow_ipc_bbox`) over the same 10M-point dataset, sized via a uniform-density assumption for ~1M points, then benchmarks pan/zoom over just that subset.

| | Run 1 | Run 2 |
|---|---|---|
| Points selected | 999,841 / 10,000,000 | 999,841 / 10,000,000 |
| Fetch (bbox scan + transfer) | 476.2 ms | 492.7 ms |
| Parse | 21.2 ms | 11.5 ms |
| Frame time p50 / p95 | 16.7 / 17.2 ms | 16.7 / 17.1 ms |

p50 lands back at the 60 fps/vsync floor — essentially identical to the n=1M point on the scaling curve (16.7 ms both places, all four runs). Caveat: the bbox filter's own O(n) unindexed scan cost (~0.5 s fetch here) is a confound on this experiment's numbers — it shows "does a smaller *rendered* set help," not "is server-side viewport filtering itself cheap." A real spatial index would be needed to answer the latter, and that's undesigned (M5's job).

**4. Streaming first-pixels** — Tauri 2.11.5's `register_uri_scheme_protocol` only resolves one complete response per request; no lower-level streamed-body API exists in this version (confirmed while building this diagnostic — worth carrying into M5's transport decision directly). Simulated instead via 40 sequential fetch+parse+render round trips over disjoint ~256k-row slices, each its own self-contained Arrow IPC message (own schema message per chunk, unlike real IPC streaming's schema-once framing), accumulating into a growing binary attribute buffer.

| | Run 1 | Run 2 |
|---|---|---|
| Time to first batch rendered | 143.7 ms | 138.6 ms |
| Time to stable view (all 40 in) | 4724.6 ms | 4696.7 ms |

First-batch-rendered is far closer to the <100 ms budget than M1's monolithic transfer (~2200–2900 ms) — roughly 15–20× better — though still ~40–45 ms over it. Time-to-stable-view is *slower* than M1's single-request transfer of the full 10M points, as expected: 40 round trips add per-request overhead (including a re-sent schema message each time) that a real backpressured streaming connection wouldn't pay. Caveat: this is a request-level simulation of chunking, not real streaming — it answers "does splitting the payload help first-pixels," not "what will the real ADR-004 transport cost," which is still undesigned and is M5's job. The `?n=`/`?bbox=`/`?chunk=` query params used across all four experiments here are spike-local diagnostic scaffolding, not a proposed SKP wire protocol shape.

Reading the four together: the scaling curve is flat at the vsync floor through 1M points and then grows roughly linearly with point count from 1M to 10M, not flat — that rules out a fixed per-frame framework tax as the dominant cost. The toggle deltas are all small (single-digit ms on a ~140 ms baseline) and don't sum to anything close to the gap, which rules out any one of these particular deck.gl/WebGL settings as the culprit. The visible-count experiment, despite its own scan-cost confound, recovers the 60 fps budget almost exactly by cutting the rendered set to roughly the same size as the n=1M scaling-curve point — i.e., cost tracks *points rendered per frame*, and reducing that count is the one lever tried here that actually closes the gap. Verdict: this reads as **GPU-bound work that scales with point count** (per-point/per-instance processing cost, not a fixed framework overhead and not explained by any single cheap toggle), with **workload-shaping** (rendering fewer points per frame, via viewport culling or level-of-detail) as the practical mitigation confirmed to work here — the two aren't competing explanations so much as cause and cure: M2–M5 should treat "reduce points rendered per frame" as the primary lever, and treat server-side spatial indexing and a real streaming transport (both still undesigned) as the open questions that determine whether that lever can be pulled cheaply.

## Outcome

_To be written when milestones conclude: **Accept deck.gl** / **Fallback WebGPU renderer**, with rationale. Feeds the ADR-003 status change. Spike code is throwaway; this section is the deliverable._
