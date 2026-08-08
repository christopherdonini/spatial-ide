> **NOT SCHEDULED. A preregistration written in advance of need, on the ADR-012 pattern — drafted
> before anyone is invested in the outcome.** Prerequisites before this may run: ADR-011's
> machinery exists (chunked renderer packets are real, not benchmark-only — this header's
> prerequisite prevails over the body's Step 0 allowance to define a smaller benchmark-only packet:
> that allowance is for defining this experiment's contract if none exists yet, not a licence to
> treat an undefined contract as a reason to start); **Candidate W read correctly, not as a phantom
> architecture, and the body below does not itself resolve which reading applies** — no accepted
> decision commits to a *browser WebGPU* product renderer. ADR-003's Resolution accepted deck.gl
> custom layers over WebGL/ANGLE-D3D11 as the projected working canvas, and the purpose-built
> WebGPU fallback was never triggered: today's renderer is WebGL, not WebGPU. The body's Objective
> and its "Candidate W: Existing WebView WebGPU" heading assume that baseline already exists. Read
> literally, satisfying Candidate W as titled means building a genuine browser WebGPU renderer from
> nothing, in addition to Candidate N's native `wgpu` renderer — **two new renderers, and the cost
> estimate must say so.** The body's own Candidate W section reads differently — "use the current
> browser renderer, extended only as required to accept the common benchmark packet" — which would
> instead compare native `wgpu` against today's *WebGL* renderer: a different, cheaper, and
> currently undecided experiment. Whoever schedules this work picks one reading before running it,
> not after; this document does not choose for them. **Also flagged, not harmonized:** the
> coordinate-encoding sub-bake-off's WGSL snippet (`let delta_cm = position_cm - camera_cm;`)
> subtracts on an **i32** representation before narrowing to f32 — a literal departure from
> ADR-010 rule 3's accepted, architect-blockable text ("Offset subtraction happens in f64, before
> narrowing to f32"). ADR-011's own Context (added in this harvest) names that departure as an
> unaccepted extension requiring its own appended ADR-010 amendment; this document does not resolve
> that either, and no i32-subtraction path may be implemented against rule 3 as currently written
> without one. The sub-bake-off's EPSG:3857 fixed-point cell is a range-stress case for that
> comparison, not a claim about the canvas CRS — the working canvas is EPSG:2056 and stays so
> (ADR-003's Acceptance gate: "without permanently converting it to EPSG:3857"). And a trigger —
> either macOS/Linux hardware validation (07's open follow-up gate) fails and reopens the renderer
> choice ADR-003 accepted, or a docs/08 budget failure survives the workload-shaping levers ADR-003's
> Resolution names as binding (viewport culling/LOD, per-tile buffers) — those levers are
> renderer-agnostic per that Resolution, so their exhaustion, not mere use, is what would license
> asking whether the renderer itself is the remaining lever. May not be cited to justify starting
> the work; its Expected interpretation section already predicts several null results and those
> predictions bind. **Correction that bounds any future verdict: the workloads contain no text. A
> verdict from this document cannot exceed unlabeled rendering, and — matching docs/06's label note
> in the same harvest — its result may not be converted into a renderer-replacement decision without
> a label-pipeline design spike; label cost stays a named open line-item in any ADOPT
> recommendation** (see docs/06's label note, added in the same harvest as this filing).

# Native Rust `wgpu` Renderer Bake-off

## Objective

Determine whether replacing the desktop WebView WebGPU renderer with a native Rust `wgpu` renderer produces enough measured user-facing improvement to justify its implementation, integration and permanent maintenance cost.

This is a **shadow-renderer experiment**, not a product migration. The browser renderer and ADR-017 static viewer remain intact.

The experiment must distinguish:

1. improvements caused specifically by native rendering;
2. improvements from RTC, batching, culling or buffer-layout changes that could equally be applied to browser WebGPU.

Unknown or inadmissible results do not count as wins.

## Step 0: Architecture review

Read `CLAUDE.md`, the current architecture and performance documents, and the accepted ADRs governing:

- engine/renderer separation;
- CRS and publishing canvases;
- control and data planes;
- renderer invariants;
- transport selection;
- static publishing.

Locate the current renderer input contract and all relevant benchmark fixtures and results. Do not assume that the renderer-packet design discussed below already exists.

Consult the architect agent before writing code. The architect must answer:

1. How can a native `wgpu::Surface` coexist with the current Tauri/WebView UI?
2. Can both renderers consume identical input bytes and WGSL shaders?
3. Which work must remain shared, and which work is necessarily backend-specific?
4. How will the native renderer preserve the standalone ADR-017 browser viewer?
5. What platform-specific surface, DPI, input and lifecycle risks exist?

If no stable renderer-packet contract exists, define the smallest **benchmark-only packet** needed for this experiment. Record it as a proposal, not a silently adopted production protocol.

Do not alter accepted architecture or production behavior merely to make the native candidate easier to implement.

## Required renderer contract

Both candidates must consume semantically identical prepared geometry.

The benchmark packet should contain:

- format version;
- chunk ID;
- geometry revision;
- stable `f64` chunk origin, bit-encoded where necessary;
- primitive and draw counts;
- aligned buffer offsets and lengths;
- RTC coordinate payload using the encoding selected by the coordinate sub-bake-off;
- index/topology buffers;
- feature-ID references;
- style-table references;
- sufficient metadata to validate every range before upload.

The envelope may be parsed by the frontend. Geometry must not be reconstructed into JavaScript objects.

Use stable chunk-relative coordinates:

```text
authoritative f64 geometry
        ↓
stable f64 chunk origin
        ↓
chunk-relative f32 geometry
        ↓
versioned renderer packet
```

Camera movement must remain renderer-local. The renderer holds its camera origin in `f64`, computes `chunk_origin - camera_origin` locally, and sends only the small `f32` delta to the GPU.

No per-frame Rust IPC is permitted for pan or zoom.

## Coordinate encoding sub-bake-off

Run a separate encoding comparison inside both renderer candidates. This comparison tests a shared renderer-packet choice; it must not be counted as evidence that native rendering wins.

Compare:

1. **RTC `f32`:** stable `f64` chunk origin with chunk-relative `vec2<f32>` vertex coordinates.
2. **RTC fixed-point `i32`:** stable chunk origin with quantized `vec2<i32>` vertex offsets and an explicit units-per-step scale.
3. **High/low `f32` (optional):** include only if one of the first two representations fails the declared large-coordinate precision gate.

For the EPSG:3857-specific fixed-point cell, use centimetre quantization unless the architect identifies a stricter existing precision requirement:

```text
encoded_cm = round(coordinate_metres * 100)

EPSG:3857 extent: approximately -20,037,508.343 m to +20,037,508.343 m
encoded extent:     approximately -2,003,750,834 to +2,003,750,834
i32 extent:                       -2,147,483,648 to +2,147,483,647
maximum quantization error: approximately 0.5 cm
```

Signed `i32` is preferred for the benchmark because the complete valid EPSG:3857 coordinate range fits without a bias. An unsigned biased representation is admissible only if its world-wrap or packet-layout advantage is stated before measurement.

The shader must subtract or localize coordinates before conversion to `f32`. It must not convert a global fixed-point coordinate directly to `f32`:

```wgsl
let delta_cm = position_cm - camera_cm;
let delta_m = vec2<f32>(delta_cm) * 0.01;
```

Use chunking and visibility controls to prove that the signed subtraction cannot overflow. World wrap at the antimeridian must be explicit rather than relying accidentally on integer overflow.

For the general renderer contract, do not hard-code centimetres or EPSG:3857. The packet proposal should support:

```text
chunk_origin: authoritative f64 or bit-encoded origin
scale:        source units represented by one integer step
offsets:      vec2<i32>
```

The quantization scale must be declared from the canvas CRS and precision budget. Fixed-point values remain derived render data; authoritative geometry, topology, snapping, measurement and commit remain `f64` in the kernel.

For every encoding record:

- bytes per vertex and total packet bytes;
- encode and validation time;
- upload time;
- vertex-shader cost and frame p50/p95/p99;
- maximum source-unit and pixel error;
- camera and chunk-boundary jitter;
- world-overview and antimeridian behavior;
- picking agreement with authoritative feature IDs.

The fixed-point encoding wins only if it meets every correctness and precision gate and improves precision or determinism without a material performance or memory regression. Equal storage size alone is not a win. Any benefit must reproduce in both Candidate W and Candidate N or be explicitly explained.


## Candidates

### Candidate W: Existing WebView WebGPU

Use the current browser renderer, extended only as required to accept the common benchmark packet.

Measure the actual transfer and upload path, including all process and memory copies.

### Candidate N: Native Rust `wgpu`

Implement an isolated native renderer using the same:

- prepared packet bytes;
- RTC coordinate convention;
- WGSL shader logic;
- styles;
- camera trace;
- viewport;
- visible feature set;
- present/vsync policy.

Begin with a separate native window or offscreen target. If it passes the isolated measurement, implement a minimal Tauri coexistence proof.

Do not replace the application shell during this spike.

## Workloads

Use existing fixtures wherever possible. At minimum:

1. The established 100,000-feature styled polygon bundle.
2. The established large point workload, including the 10-million-point case where available.
3. A representative mixed polygon workload with holes and multipart geometry.
4. A fixed, replayable pan-and-zoom camera trace.
5. A dirty-chunk replacement operation representing an edit.
6. A large-coordinate precision fixture covering the project’s supported projected-canvas behavior.

Both candidates must draw identical geometry and styles from identical prepared input.

## Measurement cells

Run two distinct cells.

### Cell A: Renderer-isolated

Start timing when the complete renderer packet is available in the renderer’s address space.

Measure:

- envelope validation;
- buffer preparation;
- CPU-to-GPU upload;
- command encoding;
- first submitted frame;
- first presented or completed frame;
- steady-state camera playback.

This isolates renderer and upload cost.

### Cell B: In-situ desktop path

Start timing at the existing application request boundary.

Measure the real pipeline through:

- engine production;
- transport or native handoff;
- packet availability;
- upload;
- first frame.

This determines whether removing the WebView boundary changes an actual user-visible result.

Do not use Cell A to claim an end-to-end improvement.

## Metrics

Record raw per-run data for:

- request-to-first-pixel;
- packet-ready-to-first-frame;
- packet validation time;
- upload time;
- total transferred bytes;
- observed or structurally accounted copy count;
- frame time p50, p95 and p99;
- percentage of frames exceeding 16 ms;
- process CPU consumption;
- peak resident CPU memory;
- GPU memory where reliably observable;
- drawn feature and primitive counts;
- picking agreement;
- precision/jitter error in pixels and source units;
- cancellation response;
- device-loss or surface-recovery failures.

Report unavailable metrics as unavailable. Do not infer them from unrelated measurements.

## Controls

For each run:

- use the same machine, GPU and driver;
- record adapter, backend, OS and driver versions;
- use the same viewport dimensions and DPI scale;
- keep the window foreground and visible;
- disable display sleep and background occlusion effects;
- use the same dataset and camera trace;
- use equivalent shaders and buffer layouts;
- use the same vsync/present policy;
- declare cold and warm runs separately;
- do not pre-warm cold runs;
- use at least seven valid runs per reported cell;
- retain individual run values, not only aggregates.

Run on both the GTX 1650 and Intel UHD 630 available on the Windows reference machine.

Windows evidence alone may resolve whether further work is warranted, but it cannot establish cross-platform production readiness.

## Correctness and precision gates

A candidate is inadmissible if any of these fail:

- feature and primitive counts agree;
- visual output agrees within a declared raster tolerance;
- picking resolves to the same authoritative feature IDs;
- RTC precision remains within the declared pixel and source-unit budgets;
- camera movement introduces no chunk-boundary jitter;
- dirty-chunk replacement cannot install an obsolete revision;
- malformed packet ranges are rejected safely;
- device/surface loss has a defined recovery path;
- producer-side cancellation remains valid;
- the ADR-017 browser viewer remains unchanged and functional.

Native rendering receives no assumed precision advantage. Both candidates continue to rely on authoritative `f64` geometry and derived RTC renderer buffers whose GPU-facing math remains `f32`.

## Predeclared decision rule

Recommend native adoption only if the native candidate is admissible and demonstrates at least one of:

1. at least **30% lower p95 frame cost** in two representative workloads, with no material regression elsewhere; or
2. at least **2× better packet-ingestion performance**, accompanied by a measurable end-to-end improvement; or
3. at least **15% lower in-situ first-pixels latency**, or enough improvement to cross an existing product budget.

Reduced memory or smoother tail latency may strengthen a qualifying result but must not replace the primary gate without an explicit amendment made before seeing the results.

An optimization available to both candidates is classified as a shared renderer improvement, not a native-renderer win.

Possible verdicts:

- **ADOPT EXPERIMENTALLY:** the gate passes and the integration proof is credible;
- **REJECT:** the gate fails or the integration cost overwhelms the measured benefit;
- **INCONCLUSIVE:** measurements are unstable, equivalent or incomplete.

An inconclusive result leaves the existing WebGPU renderer in place.

## Cross-platform condition

Even if Windows passes, production adoption remains provisional until a minimal surface and lifecycle proof succeeds on:

- Windows/D3D12;
- macOS/Metal;
- Linux/Vulkan or the declared supported fallback.

CI compilation alone is not presentation evidence. Record the required real-hardware validation separately if unavailable during this cut.

## Expected interpretation

The experiment must explicitly test these existing expectations:

- GTX 1650 point rendering already reaches the vsync floor through the established 10-million-point test; native rendering may show no visible improvement there.
- The UHD 630’s large-workload slowdown has previously appeared GPU-bound; using the same GPU through native `wgpu` may not materially change it.
- The established first-pixels floor is substantially affected by engine scanning and first-batch production; renderer replacement cannot claim to solve work that happens before a packet exists.
- RTC, visibility pruning, LOD, buffer separation and incremental updates may provide larger gains than changing presentation API.

## Deliverables

Produce:

1. the architect’s design note;
2. the benchmark-only packet specification or reference to the existing contract;
3. Candidate W and Candidate N implementations;
4. reproducible benchmark commands;
5. raw machine-readable measurements;
6. a concise `RESULTS.md`;
7. copy and ownership accounting;
8. correctness and precision evidence;
9. the Tauri coexistence proof or a named blocker;
10. a verdict using the predeclared rule;
11. an ADR proposal only if adoption is recommended.

The results must separate renderer-isolated performance from end-to-end performance and shared architectural gains from native-only gains.

Tester runs the final protocol. Reviewer checks the implementation, arithmetic, evidence and claims before commit. Preserve existing spike archives, do not silently amend accepted ADRs, and finish with `git status --porcelain` empty.