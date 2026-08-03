# ADR-011 — Tiled Render Batches and GPU Cache Lifecycle

**Status:** Proposed — **unmeasured design direction, not validated.** Split out of ADR-010's first draft on 2026-08-03 so that unmeasured implementation choices do not inherit the authority of ADR-010's measured invariants. Unlike ADR-010, **this ADR is not architect-blockable in review**; it binds nothing until it clears the acceptance gates below.
**Sources:** ADR-003 spike M4 measured costs + the spike's "Diagnostic notes (M4 editing-architecture direction) — design direction only, not implemented" (`spikes/adr-003-crs-rendering/README.md`)
**Related:** ADR-003 (Resolution), ADR-006, ADR-007, **ADR-010** (the invariants this proposal must satisfy, not replace)

## Context

**Scope of every number below** — all of it is **Windows 10 Pro 22H2 / WebView2 / ANGLE-D3D11**, on two GPUs (Intel UHD 630, NVIDIA GTX 1650), against one display's 60 Hz refresh, on **synthetic** P2 data whose polygons never cross a grid cell by construction. macOS and Linux are unrepresented (07). The last of those matters more here than anywhere else in the constitution: this ADR proposes *tiling*, and the spike's own data can never exercise a feature that spans a tile.

ADR-010 rule 4 records what the spike's static/overlay editing split does and does not solve. It holds the display's vsync floor during a drag on both measured GPU profiles **for the graded visible-subset scenario only** — ~15–20 polygons / ~1 500–2 000 vertices, ≈0.02 % of P2. The same drag with the full P2 static buffer live underneath (`fullP2Visible`, reported but not graded) measured **137.0–139.0 ms p50 on the UHD 630** — ~8× over budget — while the GTX 1650 stayed at the floor. That divergence is the shape of the problem: the split makes an *edit* cheap, not a large *resident buffer*, and workload shaping stays the binding lever (ADR-003 Resolution).

Beyond that, the split does **not** solve the two O(dataset) costs that sit either side of the drag, both measured at P2 scale (100 000 polygons / 10 000 000 vertices) on both GPUs:

| Operation | Measured cost | Against |
|---|---|---|
| Whole-dataset origin rebase, chunked mitigation | 829.8–831.7 ms (GTX 1650) · 1117.4–1134.0 ms (UHD 630) total wall clock | ≤ vsync interval (08) |
| Whole-dataset origin rebase, unmitigated CPU loop | 44.6–56.7 ms (GTX 1650) · 42.4–45.0 ms (UHD 630) — pure CPU array writes with no GPU call in them, so both profiles land in the same range; setProps-to-frame proxy 42–121 ms (GTX 1650) · 298.7–311.2 ms (UHD 630) | ≤ vsync interval (08) |
| Single-vertex commit patch + full-buffer re-upload | 80.1–82.2 ms (GTX 1650) · 325.9–333.5 ms (UHD 630) | ≤ vsync interval (08) |
| Final GPU upload+render frame after chunked rebase | 65.5–67.5 ms, both GPUs | ≤ vsync interval (08) |

The chunked mitigation solved exactly what it targeted — the CPU rebuild loop no longer blocks a single frame — and did not touch the GPU-side full-buffer re-upload, which is the real ceiling. A single-vertex edit costing O(dataset) is a direct docs/01 "never block the canvas" problem at any dataset size the hero slice cares about.

**Nothing below has been built or measured.** Per docs/01 and CLAUDE.md's "no numbers, no claim", every benefit claimed here is a **hypothesis pending its own validation**, held to the same rigor as spike milestones M1–M4.

## Proposed decision (unvalidated)

1. **Per-tile/block static GPU buffers, each with its own local origin.** Would replace the single shared `OffsetFrame` the spike used throughout M1–M4. *Hypothesis:* re-centering becomes a per-tile view-matrix update instead of a dataset rewrite, because panning never touches off-screen tiles and a tile's own local origin rarely needs to move. Unmeasured.
2. **Partial / sub-range GPU buffer updates.** A single-vertex commit would patch O(edited region) rather than re-uploading O(dataset). *Constraint discovered by the spike:* deck.gl exposes no partial-attribute-update API (observed on 9.3.7, the version the spike measured), so *any* change signal re-uploads the whole buffer — this item therefore depends on a renderer-side capability that does not currently exist and must be established, not assumed. Unmeasured.
3. **Tile-spanning feature fragmentation with stable-ID mapping.** A feature whose geometry crosses a tile boundary would be fragmented across tile buffers while keeping one stable feature identity (11), so ADR-010 rule 2's ordinal → stable ID → authoritative f64 lookup still resolves to exactly one feature. Unmeasured, and **untested by construction**: P2's generator confines every polygon to one grid cell, so the spike's own data never exercised this case.
4. **Renderer-cache versioning after atomic commits.** Each tile's GPU cache would carry a version derived from the committed authoritative state it was built from, making a cache behind the current commit detectably stale. This is a candidate *mechanism* for ADR-010 rule 5's staleness obligation — the obligation itself lives in ADR-010 and stands whether or not this ADR is accepted, so rejecting this item means finding another mechanism, not dropping the requirement. Unmeasured.
5. **Asynchronous cache consolidation.** Strictly downstream of an already-committed mutation, never inside the transaction: the commit itself stays atomic and synchronous per ADR-006/ADR-007 and ADR-010 rules 4–5. Two distinct things must not be conflated — logical/topological fan-out is the kernel-owned incremental DAG recompute docs/02 already specifies (not a new mechanism), while GPU-cache patch-up for the *edited* tile is renderer-owned and would run synchronously with the commit for interactive feedback. That patch-up is an upload cost **scoped to one tile and never measured**; the only comparable figure the spike has is the 65.5–67.5 ms upload of a *full 10M-vertex* buffer, which bounds it from above and must not be read as the per-tile number. Unmeasured.
6. **Multi-origin precision behaviour.** With N tiles there are N simultaneous local origins rather than one. *This is a materially different precision model from the one ADR-003's gate measured.* M2/M3's PASS results were obtained against a single global `OffsetFrame` — four origin policies, but always exactly one origin in play at a time — and **do not transfer to a multi-origin scheme automatically.** Unmeasured.

## Known risks this proposal creates

Stated up front rather than discovered in review:

- **Batching fragmentation.** N per-tile draw calls, each with its own f64→f32 origin uniform, is a new cost variable that could fragment exactly the batching M1 depended on to render 10M points at all. A per-tile cost that looks small individually is not evidence of a net win.
- **Seam precision.** Adjacent tiles with different origins compute neighbouring vertices through different f32 narrowings; whether that is visible at a shared boundary is unknown and is a precision question, not a cosmetic one.
- **Pick-path complexity.** Tiling multiplies layers, and ADR-010 rule 6's 24-bit per-layer pick ceiling interacts with that — favourably (smaller per-layer counts) or unfavourably (more layers to reassemble index ranges across), untested either way.
- **Cross-tile stale window.** Item 5 creates the exact window ADR-010 rule 5 forbids serving silently. The mechanism must close it or signal it.

## Acceptance gates

All must be met before this ADR may be moved to Accepted. Each is a deliverable, not an intention.

1. **Precision re-validation at P2 scale under the multi-origin model, equivalent to M2.** Same probe methodology, same calibration floor discipline ("nothing claimed below the floor"), same run-validity gate, on both measured GPU profiles. Must include the tile-seam case that a single-origin scheme has no analogue for.
2. **Draw-call and batching benchmark, per docs/08.** Per-tile draw-call count and frame time against the tiled scheme versus the single-buffer baseline, at the docs/08 polygon and point dataset classes. **The docs/08 rows land with the measurement, not before it** — adding CI-enforced budget rows for an unbuilt system inverts "no numbers, no claim".
3. **Partial-update benchmark, per docs/08.** Single-vertex commit cost measured against the 80–330 ms full-buffer re-upload baseline above, and origin rebase measured against the 830 ms–1.1 s chunked baseline. A claimed improvement is quoted against those specific numbers.
4. **Tile-spanning real geometry.** A written policy for features crossing tile boundaries, exercised on **irregular real data** (swisstopo cadastral or equivalent) — not on P2, whose polygons cannot span cells by construction. Stable-ID resolution must be shown to return exactly one feature for a fragmented geometry.
5. **Stale-pick prevention.** Demonstrated behaviour across the commit → cache-update window: a pick during that window either returns the committed state or is visibly signalled as stale. Silence in that window fails this gate (ADR-010 rule 5).
6. **Commit/cache consistency statement.** Explicit, written, against ADR-006 and ADR-007 — not implied: what participates in the transaction, what is strictly downstream of it, and the guarantee that no cache work gates or delays a commit (ADR-010 rule 5, negative form).
7. **Declared fallback.** See below. A fallback that is merely "keep the current design" is not sufficient, because the current design's measured costs already fail docs/08.

## Fallback if the tiled approach fails

Reverting to a single global `OffsetFrame` with the chunked CPU rebase is the **status quo ante, and it is a known budget failure, not an approved resting state**: at P2 scale it misses the docs/08 frame budget by one to two orders of magnitude on both measured GPUs (830 ms–1.1 s rebase, 80–330 ms single-vertex commit re-upload), and docs/08 budgets are CI-enforced with regressions failing the build.

So the fallback obligation is: if tiling is rejected on the evidence, **the O(dataset)-cost-per-edit problem remains open and requires its own remedy**, and **must then be named as an open gate in 07** — no such gate exists today, and rejecting this ADR does not close the problem. Candidate directions that would then need their own evaluation — off-thread (Worker) rebase, a renderer with a partial-buffer-update API, workload shaping that keeps the resident buffer small enough for the cost to fit budget, or a purpose-built WebGPU projected canvas (ADR-003's original fallback, not triggered at the time and not re-opened by this ADR). None is chosen here.

## Consequences

- **While Proposed:** binds nothing. Renderer work may proceed against ADR-010's invariants without adopting any item above. Nobody may cite this ADR to block a review, and nobody may cite it as a settled design.
- **If accepted:** becomes the starting shape of the production scene graph, entirely within the `renderer` module boundary (02). ADR-007's transaction/delta store is untouched — this is a rendering-cache partitioning scheme, which is a reason to *expect*, not yet confirm, that it is renderer-local rather than kernel work.
- **CRS scope (clean, checked):** per-tile origins are a float-precision translation technique, not a reprojection. This does not touch CRS-as-a-type or the analytical/display reprojection split ADR-003 and docs/01 govern.
