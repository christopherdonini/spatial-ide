# `docs/08` budget results — first `engine/` slice

Measured 2026-08-05, one session, on one machine. **Every figure below is this session's own.** Nothing
here is compared with any number from any earlier session or any transport bake-off phase: README §21
Q1 / §22.1 records that this machine drifts between sessions and does so *asymmetrically*, so a ratio
does not cancel it.

**No throughput claim is made, and nothing here cites ADR-012** (its open risk 3). Byte totals and
durations appear side by side and are deliberately not divided.

---

## Scope carried by every number

| | |
|---|---|
| **Hardware** | Intel Core i9-9980HK @ 2.40 GHz · 8 cores / 16 threads · 63.7 GiB RAM · Windows 10 Pro 22H2 build 19045 |
| **Build profile** | `release`, `debug_assertions` **off** (asserted by the harness, which refuses to run otherwise), built with `CARGO_PROFILE_RELEASE_DEBUG=false` — debug info does not affect codegen, and this machine had 6.55 GiB free at session start |
| **Source tree** | pinned: `3f11e90de06549a82042977ec84100f2` over 46 files (`target/slice-evidence/tree-pin-before.json`), **verified unchanged before the build, after the build, after the harness run and after both probe runs**. That pin is the tree of commit **`3413fd0`**; later commits change the tree, and a figure here describes `3413fd0` and nothing else |
| **Dataset class** | `docs/08` benchmark matrix, **Polygons**: 100,000 features / **10,467,093 vertices** / 114,286 rings / 151,812,642 B on disk; 50–200 vertices per feature, every 7th with an interior ring; seed `0x5EED205600000002` |
| **Consumer** | in-process Rust client for the cancellation/memory/streaming rows; Edge 151.0.0.0 (Chromium) for the pixel rows |
| **Excluded everywhere** | macOS and Linux (`docs/07`'s open follow-up) · any transport comparison · any reprojection (this slice has none) · any spatial index (`docs/07`'s other open gate) |

**Canary** (fixed transport-insensitive workload, bake-off §22.1's recommendation), taken at four
points around the run of record — 400 M-iteration reading, minimum of 3:

| start | mid (after 60 cancel trials) | end | settled (+20 s idle) |
|---|---|---|---|
| 129.4 ms | 135.2 ms | 136.5 ms | 133.6 ms |

Spread 5.5 %. **The session was itself throughout.** Earlier, unpinned passes in this same session
were *not* — one bracketed a 28 % shift and another a 26 % shift in the opposite direction — and those
passes are discarded, not reported.

> **Instrument finding.** The 40 M-iteration canary in `kernel/tests/concurrency_in_situ.rs` lands
> near 7–15 ms on this hardware, inside the CPU's own frequency-transition window; consecutive
> readings on an *idle* machine disagreed by up to 3×. It is too short to certify a session here. The
> harness now records a 400 M-iteration reading alongside it, and that is the one to read.

---

## Results

| `docs/08` row | Verdict | Measured | Trials | Scope / what was excluded |
|---|---|---|---|---|
| **Cancellation acknowledged < 100 ms, any operation** — *mid-stream* | **met** | **p50 0.107 ms · p95 0.767 ms** (min 0.056, max 2.739). Batches generated after cancel observed: **max 1**, in 5 of 30 trials | 30 | Producer-side, on the producer's own `Instant`, stamped inside the adapter the moment it parses the CANCEL frame. Both ends in one process → **same clock; no clock-relation bound was taken and none is claimed.** Generous credit, so the producer was actively generating, framing and writing when the frame arrived |
| **Cancellation acknowledged < 100 ms** — *before the first batch* | **met** | **p50 0.161 ms · p95 0.213 ms** (min 0.109, max 0.230). Batches after cancel: **max 0**. Zero batches ever delivered in all 30 trials | 30 | The case a flag polled between batches cannot serve. No credit granted; the query was running when the CANCEL arrived. Cancellation reaches DuckDB's interrupt, not just a loop flag |
| **First pixels < 100 ms after query start** | **missed** | **headless: first-batch-rendered 334.0 ms · full-payload-rendered 5157.6 ms.** **headed: 317.8 ms · 7307.9 ms.** Both figures always travel together (bake-off §6: quoting one without the other manufactures an improvement) | 1 page load per mode | Ran **both headless and `--headed`** — headless changes the compositor path. Clock: consumer `performance.now()` from scenario start (before the WebSocket opens) to the completion of the rAF callback that drew the first decoded batch. Supporting decomposition below |
| **Cold open of a 5 GB GeoParquet < 5 s** | **unmeasured** | — | — | **Two independent blockers, both recorded rather than worked around.** (1) Disk: 6.55 GiB free at session start, 1.75 GiB at the run of record. The release build itself consumed ≈ 3.2 GiB, and a measurement without a release build is not a measurement. (2) 63.7 GiB RAM with no cache-purge mechanism in this harness: even given the space, a 5 GB file is fully absorbed by the Windows file cache, so "cold" could not be established. See *Cold open* below |
| **Benchmark matrix — Polygons: 100k features / 10M vertices** | **on-matrix** | 100,000 features / **10,467,093 vertices** / 114,286 rings / 151,812,642 B | — | Shaped to the class, not just to the feature count. Irregular polygons, variable per-feature vertex counts, interior rings |
| **Memory — producer private commit** | **recorded** | **slice-host (producer only): baseline 3.85 MB private commit / 15.16 MB working set → peak 80.08 MB / 77.66 MB** (headless, 172 samples @ 50 ms). Headed: 4.12/15.23 MB → 81.12/76.55 MB (339 samples) | 2 runs | Producer in its own process, browser consumer in another. **WebView2/Chromium child-process totals are not summed** — declared gap, as the bake-off declared it |
| **Memory — producer-resident counter vs declared bound** | **met** | **peak 1,354,016 B against a declared bound of 83,886,080 B** = `(MAX_INFLIGHT_BATCHES + 1) × MAX_FRAME_BYTES` = (4+1) × 16 MiB. **1.6 % of bound** | 7 runs | This counter, not an OS reading, is what the bounded-memory claim rests on. **DuckDB's own streaming buffer is outside it and is not claimed to be inside it** (it *is* inside the OS counters above, which is why the two disagree) |
| **Memory — accounted consumer counter** | **recorded** | **867,912 B peak retained** (identical across all 7 runs) | 7 runs | Largest payload held at one time by the in-process client, which decodes and drops one batch at a time. The browser probe has **no** accounted retained-bytes counter in this slice; it counts cumulative received bytes (173,759,432 B), which is not a retention figure and is not reported as one |
| **Memory — in-process harness (both ends)** | **recorded** | baseline 8.54 MB private commit / 22.80 MB working set → peak **85.84 MB / 87.45 MB** (85 samples @ 50 ms) | 1 run | **Covers producer *and* consumer**: one process holds both. Reported separately from the producer-only figure rather than conflated with it |
| **Webview VRAM ceiling at matrix scale** | **unmeasured** | — | — | There is no renderer module. The 2D canvas probe uploads nothing to a GPU buffer this slice controls, and a VRAM figure taken from it would describe Chromium's compositor, not the system under test |
| **Frame time p50/p95** | **excluded, deliberately** | — | — | The 2D canvas probe **is not the renderer module**. A frame-time figure from it would be an off-architecture number quoted against a budget that was amended from ADR-003 spike M4 evidence about a real compositor. Measuring it here would produce a number that looks like the budget's and answers a different question |
| **Reproducibility (ADR-005 grade)** | **no grade claimed — this is the answer, not an omission** | — | — | The slice persists nothing (`kernel/README.md`: no persistence, no lineage, no Workflow IR). There is no workflow to replay against pinned inputs, so there is nothing to assert a grade at. The moment anything is written to disk, `docs/11`'s ResourceRef model and ADR-005's grades are owed |

---

## Supporting measurements

### First pixels, decomposed

The row is missed, and it is missed before the browser is reached.

| | headless | headed |
|---|---|---|
| WebSocket open + START | 86.9 ms | 93.5 ms |
| → first Arrow batch decoded in JS | 266.4 ms | 255.5 ms |
| → **first-batch-rendered (the budget's clock)** | **334.0 ms** | **317.8 ms** |
| → **full-payload-rendered** | **5157.6 ms** | **7307.9 ms** |
| batches / rows / vertices | 201 / 100,000 / 10,467,093 | same |
| JSON frames on the data path | **0** | **0** |
| reassembly copies | 0 | 0 |
| batches whose Arrow buffers were views into the delivered bytes | 201 / 201 | 201 / 201 |
| coordinate-buffer byte offsets, all 8-aligned | yes (12 distinct offsets) | yes |

Producer-side, with **no browser in the path at all**, time from query start to the first batch on the
wire is **p50 109.7 ms / p95 126.4 ms** (n = 7, in-process client). The 100 ms budget is therefore
already spent inside the engine at this dataset class, before decode, before layout, before any pixel.
That is a statement about this class and this slice, not about the eventual renderer.

### Streaming property — first batch vs total (not a throughput claim)

n = 7 full streams at the Polygons class, in-process consumer:

| | p50 | p95 | samples |
|---|---|---|---|
| time to first batch | 109.7 ms | 126.4 ms | 104.0, 102.3, 126.4, 109.7, 123.5, 114.4, 107.1 |
| total stream time | 610.0 ms | 629.4 ms | 610.0, 597.7, 629.4, 603.5, 619.3, 616.7, 595.9 |

First batch arrives at **18 % of total stream time**; 201 batches, 100,000 rows and 173,759,432 wire
payload bytes per run, identical every run. This is the streaming property — partial results flow
while the query runs. **It is not a throughput figure; the bytes and the seconds are recorded
separately and are not divided.**

### Viewport filter selectivity vs full scan

**There is no spatial index.** This is a linear scan over the GeoParquet 1.1 covering-bbox columns, and
`docs/07` keeps server-side spatial indexing as an open gate. What follows is what a scan costs, not
what an index would cost.

| Viewport | Rows | Time to first batch | Total |
|---|---|---|---|
| whole file | 100,000 | 104–126 ms | 596–629 ms |
| quarter of the extent | 25,281 | 166–196 ms | 234–260 ms |
| 1/64 of the extent | 1,600 | 65–70 ms | 68–73 ms |

n = 3 per filtered point, 7 for the full scan. **Note the non-monotonicity: filtering to a quarter of
the extent makes the *first* batch arrive later than a full scan does** (166–196 ms vs 104–126 ms),
because with no index the scan must cover roughly four times as many rows before it has accumulated
enough selected features to fill a 1 MiB batch. Total time falls as expected; time-to-first-pixel does
not. A viewport filter is not free with respect to the budget that matters most.

### Cold open — why the row is unmeasured

| | |
|---|---|
| Free on `C:` at session start | 6,865,604 KiB = **6.55 GiB** (99 % used) |
| Free at the run of record | 1,874,735,104 B = **1.75 GiB** |
| Free at session end | 1,716,052 KiB = **1.64 GiB** |
| Release build's own consumption | ≈ 3.2 GiB (vendored DuckDB C++) |
| Fixture density, measured | 151,812,642 B / 10,467,093 vertices = **14.50 B per vertex** on disk |
| A 5 GiB fixture at this shape would need | ≈ **370,158,749 vertices ≈ 3,536,405 features** |
| Largest fixture actually buildable at the run of record (leaving 0.5 GiB headroom) | ≈ **1.25 GiB ≈ 92.6 M vertices ≈ 885,000 features** |

Even at session start, building 5 GiB would have left no room for the release build the measurement
requires. And with 63.7 GiB of RAM and no cache-purge mechanism in this harness, a 5 GB file is fully
resident in the Windows file cache after the first read, so **"cold" could not have been established
even with the disk space.** Both blockers are recorded; neither was worked around by substituting a
smaller file.

An off-budget datapoint, offered as context and **not** as this row: `Dataset::open` on the
144.8 MiB polygon-class file took **17.4, 17.6, 17.6, 18.4, 24.5 ms** over 5 samples — with a warm
file cache, which is the wrong cache state for the row and is why it is not the row.

---

## Correctness gate at this pin

`cargo test --release --workspace` — **97 passed, 0 failed, 1 ignored** (the ignored one is this
measurement harness). Recorded in `target/slice-evidence/correctness-gate.txt`. H1's bit-identity
assertion (GeoParquet → DuckDB → WKB → GeoArrow → IPC → wire, no tolerance) passes on the release
build, so the payload these timings describe is the correct payload.

No PROJ/PostGIS validation applies to this slice: it performs **no transform** and has no PROJ. The
fixture's PROJJSON is a fixture and is not treated as a CRS oracle anywhere (`docs/08`, test-oracle
separation).

---

## Reported loudly: two things this session found

### 1. A pre-existing test is flaky on release builds

`engine/tests/slice.rs::the_first_batch_arrives_without_waiting_for_the_whole_result` asserts
`first * 3 < total`. It **failed once during an unloaded release workspace run**, and I reproduced it
deliberately under CPU load:

```
first batch at 30.6175ms against a total of 90.6591ms — that is not streaming
```

91.85 vs 90.66 — it missed by 1.2 ms. Observed 2 failures in ~26 release runs of that binary (0 in 15
unloaded direct runs, 1 in 8 runs under artificial load, 1 unloaded in a workspace run). **This is not
a defect in the streaming property** — the property holds, and is measured above at 18 % of total. It
is a ratio threshold that release builds made brittle: release shrinks the total to ~90 ms, at which
scale a 3× ratio is inside run-to-run noise. I have **not** changed the threshold; choosing a new one
is a design decision for the reviewer, not something a measurement pass should quietly relax.

### 2. The source tree moved twice underneath the measurement

During the first passes, another process edited `engine/src/stream.rs` (the hot path),
`engine/src/geoarrow.rs`, `engine/src/wkb.rs`, `protocol/data-plane/src/adapter_ws.rs`,
`protocol/data-plane/src/server.rs`, `protocol/data-plane/src/transport.rs` and others *while numbers
were being taken*. Those passes are **discarded, not reported** — a number that cannot be attributed
to a tree is not a measurement.

`kernel/scripts/pin-tree.mjs` was added for exactly this and is now part of the protocol: hash the
tree, build, re-hash, and only then measure. Every figure in this document comes from binaries built
from pin `3f11e90de06549a82042977ec84100f2`, verified unchanged after the build, after the harness run,
and after both probe runs.

### No regression comparison is possible yet

The artifacts that existed in `target/slice-evidence/` before this session were **debug-build** runs.
They are not measurements and nothing here is compared against them. **This document is the baseline**;
the next run of the harness compares against it, and the harness itself asserts the hard gates
(cancellation p95 < 100 ms in both cases, ≤ 1 batch after cancel, producer-resident ≤ declared bound)
so a regression fails the build rather than being written up as a new number.

---

## Reproducing this

```bash
# 0. pin the tree — a measurement is a claim about a tree, not about a moment
node kernel/scripts/pin-tree.mjs > target/slice-evidence/tree-pin-before.json

# 1. build everything, then confirm nothing moved during the build
CARGO_PROFILE_RELEASE_DEBUG=false cargo build --release --workspace --tests
(cd frontends/canvas-probe && npm install && npm run build)
node kernel/scripts/pin-tree.mjs --compare target/slice-evidence/tree-pin-before.json

# 2. correctness gate on the same build
CARGO_PROFILE_RELEASE_DEBUG=false cargo test --release --workspace

# 3. the on-matrix fixture (Polygons: 100k features / ~10M vertices)
cargo run --release -p spatial-engine --features fixture --example make-fixture -- \
    --out target/fixtures/polygons-100k.parquet --features 100000 --vertices 100
#    (the harness writes this itself from the same spec and seed if it is absent)

# 4. cancellation / streaming / memory / selectivity — let the machine settle first,
#    then run the built binary directly so rustc is not still hot in the background
cargo test --release --workspace --test slice_budgets -- --ignored --nocapture
#    → target/slice-evidence/slice-budgets.json

# 5. first pixels + producer-process memory, both compositor paths
node kernel/scripts/run-slice-probe.mjs --data target/fixtures/polygons-100k.parquet \
    --out-prefix target/slice-evidence/polygons-100k \
    --extent 2600000,1200000,2612680,1212680 --timeout 300000
node kernel/scripts/run-slice-probe.mjs --data target/fixtures/polygons-100k.parquet \
    --out-prefix target/slice-evidence/polygons-100k \
    --extent 2600000,1200000,2612680,1212680 --timeout 300000 --headed

# 6. confirm the tree still has not moved
node kernel/scripts/pin-tree.mjs --compare target/slice-evidence/tree-pin-before.json
```

The harness **refuses to run on a debug build**. That is not a convenience check: the bake-off
preregistration makes a debug build an outright invalidator, and a figure taken on one is not a larger
figure, it is not a figure.

### Raw artifacts (`target/slice-evidence/`, gitignored)

| File | What it holds |
|---|---|
| `slice-budgets-run-of-record.json` | the run of record: every raw sample behind the cancellation, streaming, memory, open and selectivity rows, plus all four canary points |
| `slice-budgets.json` | the most recent harness run (identical to the above for this session) |
| `polygons-100k-canvas-probe-headless.json` | browser probe, headless — first-batch-rendered and full-payload-rendered, envelope, alignment, JSON-frame count |
| `polygons-100k-canvas-probe-headed.json` | the same, windowed |
| `polygons-100k-host-memory-headless.json` | producer-process private commit / working set sampled at 50 ms during the headless probe |
| `polygons-100k-host-memory-headed.json` | the same, windowed |
| `tree-pin-before.json`, `tree-pin-after.json` | the 46-file source pin, before and after |
| `correctness-gate.txt` | `cargo test --release --workspace` results at this pin |
| `session-context.txt` | session start/end wall clock, free disk, git head |

### Harness sources (committed)

| File | Role |
|---|---|
| `kernel/tests/slice_budgets.rs` | the measurement harness; `#[ignore]`d, release-only, asserts the hard gates so a regression fails loudly |
| `kernel/scripts/run-slice-probe.mjs` | slice-host + browser probe + producer-process memory sampler, composed |
| `kernel/scripts/sample-process-memory.ps1` | the 50 ms private-commit / working-set sampler |
| `kernel/scripts/pin-tree.mjs` | source-tree pin and `--compare` |
