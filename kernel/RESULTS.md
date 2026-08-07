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
| **Source tree** | pinned: `3f11e90de06549a82042977ec84100f2` over 46 files (`target/slice-evidence/tree-pin-before.json`). **Corrected after independent verification:** that pin is the tree of commit **`00de930`**, not `3413fd0` as this row first said — `3413fd0`'s tree is `c1ff7851…` over **42** files, and cannot equal the pin because the four harness files and this document do not exist in it. The figures therefore describe `3413fd0`'s **product code** as measured by `00de930`'s **instruments**; the diff between them is four pure additions and no product file. Later commits (`5b33dae`, `14fc086`, `7325c62`) changed tests, a redaction and an escaper — **no product code on any measured path** — but two *instruments* were edited after these numbers were taken, so the pin no longer matches HEAD |
| **Dataset class** | `docs/08` benchmark matrix, **Polygons**: 100,000 features / **10,467,093 vertices** / 114,286 rings / 151,812,642 B on disk; 50–200 vertices per feature, every 7th with an interior ring; seed `0x5EED205600000002` |
| **Consumer** | in-process Rust client for the cancellation/memory/streaming rows; Edge 151.0.0.0 (Chromium) for the pixel rows |
| **Excluded everywhere** | macOS and Linux (`docs/07`'s open follow-up) · any transport comparison · any reprojection (this slice has none) · any spatial index (`docs/07`'s other open gate) |

**Canary** (fixed transport-insensitive workload, bake-off §22.1's recommendation), taken at four
points around the run of record — 400 M-iteration reading, minimum of 3.

**How firmly this is evidenced, stated rather than implied:** the tree pin was written before the
build and re-read after the probes, and both files survive (`tree-pin-before.json` 01:48:34,
`tree-pin-after.json` 01:52:33) — that window does cover the gate, the run of record and both probe
runs. The two *intermediate* `--compare` invocations printed to stdout and left no artifact, so
"verified at four points" is auditable at two. The substance holds; the disclosure overstated it.

| start | mid (after 60 cancel trials) | end | settled (+20 s idle) |
|---|---|---|---|
| 129.4 ms | 135.2 ms | 136.5 ms | 133.6 ms |

Spread across those four minima is 5.45 %, quoted as 5.5 %. **The session was itself throughout.**
Earlier, unpinned passes in this same session were *not* — one bracketed a 28 % shift and another a
26 % shift in the opposite direction — and those passes are discarded, not reported.

**Dispersion the estimator removes, now disclosed:** over all **twelve raw** 400 M readings the
spread is **18.04 %** (129.435 … 152.783 ms). Min-of-3 is the declared estimator and a defensible
one against transient interference, but a reader judging whether the session held should see both
numbers.

> **Instrument finding.** The 40 M-iteration canary in `kernel/tests/concurrency_in_situ.rs` is too
> short to certify a session on this hardware — it sits inside the CPU's own frequency-transition
> window. The harness now records a 400 M-iteration reading alongside it, and that is the one to
> read.
>
> **Corrected after independent verification.** This note previously said the 40 M canary "lands
> near 7–15 ms" and that idle readings "disagreed by up to 3×". **Neither figure is a measurement in
> any artifact** — both were prose literals in `kernel/tests/slice_budgets.rs`, echoed into the JSON
> as text. The 20 readings actually recorded span **12.712–19.979 ms**, a max/min ratio of **1.57×**.
> The conclusion is unchanged and still holds on the recorded data; the numbers that were quoted for
> it did not exist.

---

## Results

| `docs/08` row | Verdict | Measured | Trials | Scope / what was excluded |
|---|---|---|---|---|
| **Cancellation acknowledged < 100 ms, any operation** — *mid-stream* | **met** | **p50 0.107 ms · p95 0.767 ms** (min 0.056, max 2.739). Batches generated after cancel observed: **max 1**, in 5 of 30 trials | 30 | Producer-side, on the producer's own `Instant`, stamped inside the adapter the moment it parses the CANCEL frame. Both ends in one process → **same clock; no clock-relation bound was taken and none is claimed.** Generous credit, so the producer was actively generating, framing and writing when the frame arrived |
| **Cancellation acknowledged < 100 ms** — *before the first batch* | **met** | **p50 0.161 ms · p95 0.213 ms** (min 0.109, max 0.230). Batches after cancel: **max 0**. Zero batches ever delivered in all 30 trials | 30 | The case a flag polled between batches cannot serve. No credit granted; the query was running when the CANCEL arrived. Cancellation reaches DuckDB's interrupt, not just a loop flag |
| **First pixels < 100 ms after query start** | **missed** | **headless: first-batch-rendered 334.0 ms · full-payload-rendered 5157.6 ms.** **headed: 317.8 ms · 7307.9 ms.** Both figures always travel together (bake-off §6: quoting one without the other manufactures an improvement). **The probe artifacts self-declare `"status": "hypothesis-forming, NOT a preregistered measurement"`, and that label travels with these numbers** — it was dropped from this row before. The verdict is "missed", so nothing here is inflated by it | 1 page load per mode | Ran **both headless and `--headed`** — headless changes the compositor path. Clock: consumer `performance.now()` from scenario start (before the WebSocket opens) to the completion of the rAF callback that drew the first decoded batch. Supporting decomposition below |
| **Cold open of a 5 GB GeoParquet < 5 s** | **unmeasured** | — | — | **Two independent blockers, both recorded rather than worked around.** (1) Disk: 6.55 GiB free at session start, 1.75 GiB at the run of record. The release build itself consumed ≈ 3.2 GiB, and a measurement without a release build is not a measurement. (2) 63.7 GiB RAM with no cache-purge mechanism in this harness: even given the space, a 5 GB file is fully absorbed by the Windows file cache, so "cold" could not be established. See *Cold open* below |
| **Benchmark matrix — Polygons: 100k features / 10M vertices** | **on-matrix** | 100,000 features / **10,467,093 vertices** / 114,286 rings / 151,812,642 B | — | Shaped to the class, not just to the feature count. Irregular polygons, variable per-feature vertex counts, interior rings |
| **Memory — producer private commit** | **recorded** | **slice-host (producer only): baseline 3.85 MB private commit / 15.16 MB working set → peak 80.08 MB / 77.66 MB** (headless, 172 samples @ 50 ms). Headed: 4.12/15.23 MB → 81.12/76.55 MB (339 samples) | 2 runs | Producer in its own process, browser consumer in another. **WebView2/Chromium child-process totals are not summed** — declared gap, as the bake-off declared it |
| **Memory — producer-resident counter vs declared bound** | **met** | **peak 1,354,016 B against a declared bound of 83,886,080 B** = `(MAX_INFLIGHT_BATCHES + 1) × MAX_FRAME_BYTES` = (4+1) × 16 MiB. **1.6 % of bound** | 7 runs | This counter, not an OS reading, is what the bounded-memory claim rests on. **Two things sit outside it and neither is claimed to be inside it:** DuckDB's own streaming buffer, and — newly named — the **engine's own queue**, `(MAX_QUEUED_BATCHES + 1) × MAX_BATCH_BYTES` = (2+1) × 4 MiB = 12 MiB, which this counter never sees because only the data-plane pump feeds it. The composed per-stream bound is therefore **92 MiB**, not 80; see `kernel/README.md`. Both exclusions *are* inside the OS counters above, which is why the two disagree |
| **Memory — accounted consumer counter** | **recorded** | **867,912 B peak retained** (identical across all 7 runs) | 7 runs | Largest payload held at one time by the in-process client, which decodes and drops one batch at a time. The browser probe has **no** accounted retained-bytes counter in this slice; it counts cumulative received bytes (173,759,432 B), which is not a retention figure and is not reported as one |
| **Memory — in-process harness (both ends)** | **recorded** | baseline 8.54 MB private commit / 22.80 MB working set → peak **85.84 MB / 87.45 MB**. **The peak is 85 samples @ 50 ms; the baseline is a single sample** — the two are not the same kind of number and the row previously read as though they were | 1 run | **Covers producer *and* consumer**: one process holds both. Reported separately from the producer-only figure rather than conflated with it |
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
| whole file | 100,000 | 102–126 ms | 596–629 ms |
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
| Free at session end | **2.38 GiB** (`session-context.txt`: 2,498,368 1K-blocks). **Corrected:** this row previously read "1,716,052 KiB = 1.64 GiB", a figure that appears in no artifact — and it is the one mis-transcription here that pointed the self-serving way, since a smaller number strengthens this row's own "there was no room" argument. Note also that `session-context.txt`'s end stamp (01:40:30) precedes the run of record (01:51) and both probes |
| Release build's own consumption | ≈ 3.2 GiB (vendored DuckDB C++) |
| Fixture density, measured | 151,812,642 B / 10,467,093 vertices = **14.50 B per vertex** on disk |
| A **5 GB** fixture at this shape would need | ≈ **344,737,199 vertices ≈ 3,293,181 features** |
| *(a 5 GiB one — the unit this row used to compute in, which `docs/08` does not say)* | *≈ 370,158,749 vertices ≈ 3,536,405 features* |
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

> **That green run was one draw, and the suite was not reliably green.** Independent verification
> re-ran it and found **2 of 8** workspace invocations failing, on two tests neither this document
> nor the session noticed:
>
> - `engine/tests/slice.rs::cancelling_before_the_first_batch_stops_the_stream_inside_the_budget` —
>   **6 failures in 57** runs of that binary (10.5 %), overshooting its 100 ms assertion by up to
>   **20×** (observed 168 ms, 581, 623, 697, 842, 1962). Run alone with `--exact` it passed 40/40, so
>   the trigger is the binary's own 16-way parallelism. The test was timing `cancel → the consumer
>   thread is scheduled again`, which is not the cancellation path.
> - `protocol/data-plane/tests/candidate_a.rs::a_grant_of_n_moves_exactly_n_batches` — **1 in 33**,
>   on a fixed 400 ms settle window that conflates "no more were sent" with "they had not arrived
>   yet".
>
> **Both are now fixed** — the first asserts the property structurally (nothing was produced) under a
> generous liveness bound and leaves the <100 ms budget where the clock means something, on the
> producer's own observation instant; the second waits for the expected batches under a generous
> deadline and keeps a settle window only for the *no-more-than* half. H1's bit-identity assertion
> was never among the failures, so the payload claim above is untouched.

No PROJ/PostGIS validation applies to this slice: it performs **no transform** and has no PROJ. The
fixture's PROJJSON is a fixture and is not treated as a CRS oracle anywhere (`docs/08`, test-oracle
separation).

> **Addendum (2026-08-05, after the R8 deadlock fix).** The count above describes the pin, not HEAD.
> Two commits landed after these measurements: `0116c67` (gate-pass findings) and `2c64cf3` (R8
> deadlock fix). At `2c64cf3` the workspace suite is **100 passed, 0 failed, 1 ignored** (fixing
> session, two clean-process runs). The deadlock was a **product regression introduced inside the
> gate-pass layer itself**: a credit clamp conflated the in-flight window with cumulative grant
> credit, silently discarding 96 conforming credits — caught by R8
> (`every_batch_and_a_terminal_frame_are_delivered`), diagnosed from a minidump's thread shape,
> proven by lone revert. The clamp existed only between those two commits and **never during any
> measurement**, so every figure above remains attributed to its pin, unchanged. The test was
> independently defective — an unbounded await that hangs instead of failing — and every blocking
> wait in the suite now carries a deadline that names its property.

---

## Reported loudly: two things this session found

### 1. Wall-clock thresholds on cross-thread handoffs are the wrong instrument — three times over

This section originally reported one flaky test,
`engine/tests/slice.rs::the_first_batch_arrives_without_waiting_for_the_whole_result` (`first * 3 <
total`, 2 failures in ~26 release runs, one missing by 1.2 ms), and deliberately left the threshold
alone for review to decide.

**Review decided, and the finding turned out to be general.** That test was restructured in
`5b33dae` to assert the producer's own `batches_generated` counter at the moment the first batch is
handed over — no clock at all — and now passes 57/57. Two more tests had the same defect and were
found only by re-running the suite dozens of times; both are described in the box above and both are
now fixed the same way.

The rule the three cases share, worth stating once: **a threshold asserted across a thread handoff
measures scheduling, not the property.** Raising it does not help, because the quantity being
measured is not the one named. `docs/08`'s <100 ms cancellation budget is asserted on the producer's
own `Instant`, stamped inside the adapter — that clock means something, and it is where the budget
rows above come from.

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

### No regression comparison is possible yet — and the mechanism for one does not exist

The artifacts that existed in `target/slice-evidence/` before this session were **debug-build** runs.
They are not measurements and nothing here is compared against them. **This document is the
baseline.**

**Corrected after independent verification — the two claims that followed were both wrong:**

- *"the next run of the harness compares against it"* — it does not. `kernel/tests/slice_budgets.rs`
  reads no prior artifact. Its four assertions are **absolute `docs/08` budget gates**, not
  regression-vs-baseline gates, and nothing in the tree implements a baseline comparison.
- *"a regression fails the build"* — it cannot. The harness is `#[ignore]`d and runs only under
  `-- --ignored`, so no ordinary build or CI invocation executes it at all. What it does do is fail
  *its own run* when a budget is missed, which is worth having and is not the same claim.

**A baseline that nothing compares against is a document, not a gate.** Building the comparison is
outstanding work, and it needs the canary to be compared *first*: the same 400 M instrument recorded
**68.6 ms** in a later session against **129.4–136.5 ms** here, so a naive comparison against these
numbers would report a large improvement that is entirely session effect (bake-off §21 Q1 / §22.1).

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
    --out target/fixtures/slice-budgets/polygons-100k.parquet --features 100000 --vertices 100
#    (the harness writes this itself from the same spec and seed if it is absent)

# 4. cancellation / streaming / memory / selectivity — let the machine settle first,
#    then run the built binary directly so rustc is not still hot in the background
cargo test --release --workspace --test slice_budgets -- --ignored --nocapture
#    → target/slice-evidence/slice-budgets.json

# 5. first pixels + producer-process memory, both compositor paths
node kernel/scripts/run-slice-probe.mjs --data target/fixtures/slice-budgets/polygons-100k.parquet \
    --out-prefix target/slice-evidence/polygons-100k \
    --extent 2600000,1200000,2612680,1212680 --timeout 300000
node kernel/scripts/run-slice-probe.mjs --data target/fixtures/slice-budgets/polygons-100k.parquet \
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

---
---

# Second section — 2026-08-05, the index-in-path pass over pieces 1–4a

**Everything above this line describes an earlier tree measured in an earlier session and is left
exactly as it was.** Nothing below is compared with anything above it. The same canary instrument
read 129.4–136.5 ms in that session and 68.6 ms in another, so a diff across the two would report a
change that is entirely session effect. **The unindexed baseline this section needs was therefore
re-measured here, in this session, from this binary.**

Governed by `kernel/PROBE-PREREGISTRATION.md`, committed **before** the instruments were built and
before any result of this pass was looked at. It declares the sample counts, what every segment
means, and the invalidators. Six amendments are appended to it; **A4, A5 and A6 were written after
results had been seen**, each after a declared invalidator fired, and each says so.

## Scope carried by every number below

| | |
|---|---|
| **Hardware** | Intel Core i9-9980HK @ 2.40 GHz · 8 cores / 16 threads · 63.7 GiB RAM · Windows 10 Pro 22H2 build 19045 |
| **Build** | `release`, `debug_assertions` **off** (both harnesses refuse to run otherwise), `CARGO_PROFILE_RELEASE_DEBUG=false`; workspace crates rebuilt **from clean** |
| **Tree** | branch `measure/pieces-1-4a`, whose **product tree is exactly `87644cb`** (pieces 1–4a) and whose only additions are the instruments and the preregistration. Source pin `eb7e96a2…` over 52 files, taken **before** the build and re-verified after it and after every phase |
| **Binaries** | pinned by SHA-256 and re-verified after every phase: `slice-host.exe` `c11c8bb5…`, harness `ac8aea6e…`, `dist/app.js` `8548649f…` |
| **Dataset** | `docs/08` Polygons: 100,000 features / **10,467,093 vertices** / 114,286 rings / 151,812,642 B; seed `0x5EED205600000002` |
| **Correctness gate at this pin** | `cargo test --release --workspace` — **130 passed, 0 failed, 2 ignored** (the two measurement harnesses) |
| **Excluded** | macOS/Linux · cold-cache anything · 5 GB · any between-session comparison · any throughput figure · frame time · VRAM. Nothing here cites ADR-012 |

**Where the numbers come from.** Two instruments on two different paths, and **they are never
subtracted from one another**:

- `kernel/tests/indexed_budgets.rs` — in-process, both ends in one process, therefore one clock.
  Cancellation, memory, the index, and the unindexed/indexed selectivity comparison.
- `kernel/scripts/run-slice-probe.mjs` + `frontends/canvas-probe` — a real browser consumer against
  `slice-host` in its own process. First pixels.

---

## What moved underneath this pass — read this before any number

Three things went wrong, all of them found rather than guessed at, and each changed what may be
claimed.

### 1. The branch moved mid-pass, so this section does not describe the branch tip

`fba323e` — *"fix: close the reviewer's blocking findings on pieces 1-2"* — landed on
`engine-first-cut` **between two of this pass's own instrument commits**, changing
`engine/src/index.rs` (115 lines), `dataset.rs` and `stream.rs`. Measuring the tip would have
described 87644cb's product code plus reviewer fixes, under the name of 87644cb. A measurement branch
was cut from `87644cb` instead. **Every figure here describes `87644cb` and none of them describes
the branch tip.** A re-run against the tip is outstanding work and is not attempted here.

### 2. A shared `CARGO_TARGET_DIR` linked another checkout's code into a binary while the source pin verified clean

The first harness run was invalidated after the fact. Its binary contained the string
`"identity min: "`, which exists only in another checkout's *uncommitted* `engine/src/dataset.rs`
and **nowhere in the pinned tree**; the pin verified clean before and after. Two checkouts shared one
target directory.

**A source pin does not pin a build.** `kernel/scripts/pin-tree.mjs` now records the SHA-256 of every
binary that produces a number and compares them, and its header states the two disciplines that go
with it: pin **before** the build so the build window is bracketed at all (the first attempt pinned
*after* the build, so a source change during it was invisible), and build from clean. The
contamination is visible in the numbers too: attempt 1 reported the index's declared memory as
5,073,144 B, the pinned tree reports **4,800,000 B**.

### 3. The probe leaked ~6 GB of browser profiles and filled the disk during its own measurement

`run-probe.mjs` deleted its throwaway Edge profile with a single `rmSync` after a 500 ms sleep and
documented the cleanup as "best-effort". **At n = 1 page load per compositor path that was true and
harmless. At the sample count a preregistered measurement needs, it is neither**: 63 trials left
**73 profile directories and about 6 GB** in the OS temp directory. Free space fell from 5.4 GiB to
1.9 GiB during the pass and returned to 7.9 GiB when they were deleted. Every timing taken after the
disk filled describes a thrashing machine, one browser failed to launch at all, and the corruption
arrived disguised as *the machine drifted*.

The root cause is that `taskkill /T` was spawned fire-and-forget, so the profile removal raced a
browser that still held every file in it open. That is now awaited and the pid polled; the driver
sweeps leftovers, records free disk at both ends, and **refuses to start below 3 GiB of headroom**.
**It is not fully fixed:** 21 of 21 profiles still resisted removal in the final attempts, because
Edge's child processes outlive the pid being polled. The leak is now *reported* rather than silent,
which is the difference between a known limitation and a corrupted measurement.

---

## Every attempt, and which invalidator each fired

**More attempts were made than the preregistration permits** (it allows one re-run per phase). All of
them are listed; none is deleted; and the multiple-attempt selection risk this creates is the reason
the probe's point estimates below are reported as **recorded, not established** rather than being
represented by the best-looking run.

| Attempt | Phase | Outcome |
|---|---|---|
| 1 | in-process harness | **invalidated, twice**: canary spread 21.72 % across the four minima (declared 10 %), and build provenance (§2 above) |
| 2 | in-process harness | **all gates met.** Canary spread **5.76 %** across minima, 10.80 % across all raw readings. This is the harness run of record |
| 1 | probe, headless | **invalidated**: canary 226.3 / 261.8 / **367.4** / 259.9 ms — the end point was taken immediately after `host.kill()` |
| 2 | probe, headless + headed | **invalidated**: canary again, and the disk filled (§3). The headed cell failed outright — *"browser never reported a debugging endpoint"* |
| 3 | probe, headless | **invalidated**: canary spread beyond 10 % |
| 4 | probe, headless | **invalidated**: canary spread **14.4 %** — the closest any pre-warm-on cell came |
| 4 | probe, headed | **invalidated**: canary spread 15.6 % |
| 4 | probe, headless **no-prewarm** | **held.** Canary spread **2.8 %**, pin and binaries unchanged, 7 admitted / 0 dropped. **The only probe cell this pass establishes** |

The probe artifacts are overwritten per invocation, so attempts 1–3's raw JSON no longer exists;
only their printed summaries survive. That is another instrument shortcoming and is recorded as one.

---

## Results

| `docs/08` row | Verdict | Measured | Trials | Scope |
|---|---|---|---|---|
| **Cancellation < 100 ms — mid-stream, index in path** | **met** | **p50 0.083 ms · p95 0.089 ms** (min 0.067, max 0.099). **Batches generated after cancel: 0 in all 30** | 30 | Quarter-extent viewport against a **built index** (`IndexNarrowed`), so the index is genuinely in the path — a whole-file query never reaches it. Producer-side, stamped inside the adapter as it parses the CANCEL frame; both ends in one process, **same clock, no clock-relation bound claimed** |
| **Cancellation < 100 ms — before the first batch** | **met** | **p50 0.132 ms · p95 0.211 ms** (min 0.111, max 0.217). Batches after cancel: **0 in all 30** | 30 | No credit granted, so nothing was ever delivered and the query was running when CANCEL arrived. Reaches DuckDB's interrupt, not a loop flag |
| **Cancellation < 100 ms — during an index build** | **met, for one of the two phases only** | **p50 2.147 ms · p95 4.356 ms** (min 0.584, max 4.356) | 12 | **All 12 delays (10–400 ms) landed in the SHA-256 content-hash phase**, which runs 610 ms before the DuckDB scan starts. The scan phase (30 ms) was **never sampled** — see the gap named below |
| **Cancellation < 100 ms — during the identity uniqueness scan** | **met** | **p50 16.233 ms · p95 22.393 ms** (min 2.195, max 22.393) | 7 of 15 | ADR-016's whole-column scan on the open path. **8 of 15 trials completed before the cancel arrived** and are reported, not dropped and not counted as samples. The split is structural, not noise — see below |
| **First pixels < 100 ms after query start** | **missed** | **The only established cell** (headless, no pre-warm, whole file): **p50 216.6 ms · p95 231.6 ms** (min 214.4). Full payload, always beside it: **p50 7956.1 ms · p95 9079.7 ms**. Every other cell is *recorded, not established* — table below | 7 admitted / 0 dropped per cell | **The verdict survives every invalidation.** The budget is 100 ms; the **smallest single-trial value observed in any cell of any attempt was 160.3 ms**, and every one of the 112 admitted trials across all attempts exceeded the budget. No plausible drift carries a 160 ms minimum under 100 ms. The point estimates are not so robust and are not presented as though they were |
| **Memory — producer-resident counter vs declared bound** | **met** | **peak 1,730,272 B against a declared bound of 83,886,080 B** = `(MAX_INFLIGHT_BATCHES + 1) × MAX_FRAME_BYTES`. **2.06 % of bound** | 42 wire runs | **This percentage describes the batch shape it was taken under.** Piece 3 makes early batches small and `MAX_INFLIGHT_BATCHES` counts *batches*, so the same window now holds fewer bytes: the bound stays a valid **upper** bound and is looser than before |
| **Memory — the index's own bound** | **met, and it is per dataset** | **4,800,000 B declared** = 100,000 features × 48 B, reported by `IndexReport::declared_memory_bytes` | 1 | **Not per stream.** One index serves every stream over that file, so it is added **once** to the composed process bound and **must not be multiplied by `MAX_CONCURRENT_STREAMS`** |
| **Memory — process private commit** | **recorded** | in-process harness: baseline 4,796,416 B → **peak 113,999,872 B** (670 samples @ 50 ms). Producer-only (`slice-host`, browser consumer in another process): baseline 9,535,488 B → **peak 89,882,624 B** private / 86,089,728 B working set (3,293 samples) | 2 | The harness figure covers **both ends plus the index plus the fixture writer**, which wrote two 145 MB files; it is not a per-stream number. WebView2/Chromium child-process totals are **not** summed — declared gap |
| **Index build cost** | **recorded, and it is dominated by hashing** | **content hash 610.2 ms · index build 30.2 ms · wall 654.2 ms** for 100,000 features / 100,000 rows scanned | 1 build + 3 reuses | **A cache hit still costs the full hash**: three reuses took 610.5 / 622.8 / 665.4 ms wall, of which the build was **0.0 ms every time**. Build cost and query benefit are kept apart and are never netted into "pays for itself after N queries" |
| **Cold open of a 5 GB GeoParquet < 5 s** | **unmeasured** | — | — | Unchanged and for the same two independent reasons. Free disk moved between 1.9 and 8.2 GiB during this pass and a 5 GB fixture plus a release build does not fit; and with 63.7 GiB of RAM and no cache-purge mechanism, "cold" could not be established even with the space |
| **Frame time p50/p95 · VRAM** | **excluded, deliberately** | — | — | There is still no renderer module. The 2D canvas probe is not one, and a figure from it would answer a different question than the budget it appears to answer |
| **Reproducibility (ADR-005 grade)** | **no grade claimed** | — | — | The slice still persists nothing, so there is no workflow to replay and nothing to assert a grade at |

---

## The finding this pass exists to report: the index made every filtered query slower

Same session, same binary, same file, same process. The unindexed measurements ran **before any index
existed in the process** — the index cache is process-wide and keyed by path, so this ordering is
the measurement, not a convenience.

| Viewport | Plan | Rows | Wire: time to **first batch** | Wire: **total** | Engine-direct first | Engine-direct total |
|---|---|---|---|---|---|---|
| whole file, no index | `WholeFile` | 100,000 | p50 **84.1** / p95 89.1 ms | p50 466.2 / p95 486.8 | p50 84.3 / p95 89.5 | p50 441.8 / p95 447.0 |
| whole file, index built | `WholeFile` | 100,000 | p50 **81.6** / p95 96.7 ms | p50 457.9 / p95 493.9 | p50 83.4 / p95 84.8 | p50 434.8 / p95 454.5 |
| quarter extent, no index | `ScanOnly` | 25,281 | p50 **140.2** / p95 143.4 ms | p50 197.7 / p95 199.8 | p50 141.7 / p95 151.9 | p50 187.5 / p95 199.0 |
| quarter extent, index built | `IndexNarrowed { ranges: 159, candidates: 25281 }` | 25,281 | p50 **190.1** / p95 209.1 ms | p50 240.5 / p95 264.4 | p50 182.7 / p95 190.2 | p50 225.8 / p95 235.8 |
| 1/64 extent, no index | `ScanOnly` | 1,600 | p50 **49.7** / p95 58.2 ms | p50 54.0 / p95 62.5 | p50 55.1 / p95 58.8 | p50 59.2 / p95 63.0 |
| 1/64 extent, index built | `IndexNarrowed { ranges: 40, candidates: 1600 }` | 1,600 | p50 **58.4** / p95 61.2 ms | p50 62.4 / p95 65.4 | p50 57.1 / p95 61.7 | p50 60.7 / p95 65.5 |

n = 7 per point per path. `FilterPlan` is observed on an **engine-direct stream with identical
parameters** — the wire carries no plan.

**With the index in the path, the quarter extent's first batch is 35.6 % slower (140.2 → 190.1 ms)
and its total is 21.7 % slower (197.7 → 240.5 ms). The 1/64 extent is 17.5 % slower to first batch
and 15.5 % slower in total.** The whole-file case is unchanged, as it must be: no viewport means the
index is never consulted.

**Both halves are reported because reporting either alone would manufacture a result.** The previous
section's non-monotonicity finding — the quarter extent's *first* batch arriving later than a full
scan's — is exactly the mechanism an index is supposed to fix. It is not fixed; it is worse. Quoting
only "total time fell" would have been available if the index had helped, and would have been the
wrong number anyway, because first-batch time is what the first-pixels budget depends on.

**The mechanism is visible in the plan, and it is not a tuning problem.** `engine/src/index.rs`
answers the predicate `covering-bbox-intersects`, and `build_sql` deliberately keeps the bbox
comparison *alongside* the candidate-id ranges so the indexed result set is provably identical to
the unindexed one — which it is: **identical row counts and byte-identical payload totals at every
point** (25,281 rows / 44,018,088 B; 1,600 rows / 2,798,952 B). But because the index answers
*exactly the predicate the scan already computes*, the range predicate cannot exclude a single row
the bbox test would have kept. It is 159 OR-ed `BETWEEN` comparisons of pure added work per row, on
top of a scan that still runs in full. At this data shape the index cannot win, and this is a
property of what it answers rather than of how it is built.

This is a **regression against the same-session unindexed baseline**, and it is reported as one.
Nothing here says the index is wrong — `an_indexed_query_returns_exactly_what_the_scan_returns`
holds, and the equality above confirms it on the measured file. It says the index does not currently
pay for itself on this shape, and that the first-pixels budget is not what it improves.

---

## First pixels, decomposed into the segments the budget is actually spent in

`t_query_start` is taken immediately before `startStream(...)` — the moment the application decides
to run the query. Every instant is the consumer's own `performance.now()`, so all segments are on one
clock.

**Established cell** (headless, **no pre-warm**, whole file, canary spread 2.8 %, 7 admitted / 0
dropped):

| Segment | p50 | p95 | min | max |
|---|---|---|---|---|
| S2 `query start → OPEN` — socket open + handshake + **producer accept** | **92.6 ms** | 100.4 | 85.9 | 100.4 |
| S3 `OPEN → first bytes in JS` — engine scanning until the first batch is full, plus the wire | **119.1 ms** | 132.1 | 111.0 | 132.1 |
| S4 `first bytes → decoded` — JS Arrow decode | 6.1 ms | 6.8 | 4.9 | 6.8 |
| S5 `decoded → first pixels` — rAF wait plus canvas draw | 2.4 ms | 2.7 | 1.7 | 2.7 |
| **first pixels after query start** | **216.6 ms** | 231.6 | 214.4 | 231.6 |
| **full payload after query start** | **7956.1 ms** | 9079.7 | 7341.2 | 9079.7 |

**Recorded, not established** — every one of these cells failed the declared canary threshold, and
they are shown so the dispersion between attempts is visible rather than hidden behind one run:

| Cell | first pixels p50 / p95 | full payload p50 | S2 p50 | S3 p50 | S4 p50 | S5 p50 |
|---|---|---|---|---|---|---|
| headless, pre-warm, whole file | 205.3 / 249.9 | 8647.2 | 67.8 | 125.3 | 6.1 | 2.5 |
| headless, pre-warm, quarter | 320.3 / 354.8 | 2278.6 | 92.9 | 226.6 | 6.5 | 2.5 |
| headless, pre-warm, 1/64 | 222.0 / 236.2 | 360.0 | 88.2 | 94.3 | 8.4 | 24.1 |
| headed, pre-warm, whole file | 224.8 / 259.7 | 8372.7 | 78.1 | 119.3 | 6.2 | 9.0 |
| headed, pre-warm, quarter | 301.7 / 309.7 | 2107.2 | 87.6 | 211.4 | 5.9 | 2.3 |
| headed, pre-warm, 1/64 | 253.1 / 333.1 | 372.3 | 103.7 | 82.6 | 7.4 | 64.3 |

Earlier attempts of the same headless pre-warm cells, all invalidated, for the same reason: whole
file **185.0 / 176.2 / 205.3** p50 across attempts 1 / 3 / 4; quarter **306.0 / 270.8 / 320.3**; 1/64
**202.0 / 172.7 / 222.0**. **That between-attempt spread — up to 29 ms on a p50 — is the honest
uncertainty on every "recorded, not established" figure above.**

At n = 7 the nearest-rank p95 **is** the maximum sample. Every raw sample is in the artifacts.

### What the decomposition says, which is the point of doing it

`engine/README.md` recorded that no claim about the first-pixels budget could follow from piece 3
"until the two are decomposed, because if start-up alone is ≥ 100 ms, no batch size reaches it."
**They are now decomposed, and start-up alone is 68–93 ms.**

- **S2 is 67.8 ms p50 even with a pre-warmed socket.** With the socket already open, that is the
  producer accepting the stream — `EngineSourceFactory::create` → `stream_with_cancel` → a **new
  in-memory DuckDB connection per stream** plus `SET enable_geoparquet_conversion=false` plus
  `build_sql`. Two thirds of the entire 100 ms budget is spent before the query has looked at a row.
- **S3 is 94–227 ms** and tracks selectivity the same way the in-process harness does: the quarter
  extent's first batch is the *slowest* of the three viewports on both instruments. The two
  instruments agreeing on that shape, on different paths, is the strongest single corroboration in
  this pass.
- **S4 + S5 together are under 11 ms** in four of the seven cells (8.5, 8.6, 9.0, 8.2 ms). **The
  browser is not the problem.** Decode is ~6 ms and the draw ~2.4 ms; the budget is gone before
  either runs. The three exceptions are the two **1/64 cells** (32.5 ms headless, 71.7 ms headed) and
  the headed whole-file cell (15.2 ms), all of it in S5 — with only 5 batches in the stream the
  `requestAnimationFrame` cadence, not the drawing, is what S5 is measuring there.
- **Piece 3's progressive sizing is visible and is doing exactly what it says**: the first batch is
  **55,944 B in every cell of every attempt**, against `FIRST_TARGET_BATCH_BYTES` = 64 KiB, and the
  whole-file stream is 203 batches for 173,807,128 B. The policy is in force. It cannot reach a
  budget that S2 has already spent.
- **JSON frames on the data path: 0**, in every cell of every attempt.

### The pre-warm A/B is inconclusive, and that is the finding

Piece 4a's pre-warmed connection is a consumer-side toggle over identical product code, so it is the
one before/after this pass can run honestly. Whole file, headless, n = 7 each:

| | S2 `query start → OPEN` p50 | first pixels p50 |
|---|---|---|
| pre-warm **on** (recorded, not established) | 67.8 ms | 205.3 ms |
| pre-warm **off** (established) | 92.6 ms | 216.6 ms |

The 24.8 ms S2 difference is in the direction piece 4a predicts and lands in the segment it targets.
**No effect is claimed**: the pre-warm-on cell failed its canary, and the 11.3 ms first-pixels
difference is well inside the 29 ms between-attempt spread of that same cell. **Piece 4a's benefit is
smaller than this instrument can resolve on this machine under this session's contention.**

**Piece 3 cannot be A/B-ed at all** — the batch-size policy is a compile-time constant — so no
before/after for it is claimed anywhere, only the batch shape it produces.

---

## Cancellation, in more detail than the verdict row

### The identity-scan split is structural, not noise

| Delay before cancel | Trials | Observed latency |
|---|---|---|
| 5 ms | 3 | 20.674, 22.393, 21.682 ms |
| 15 ms | 3 | 2.195, 2.306, 16.233 ms |
| 30 ms | 1 of 3 cancelled | 3.430 ms |
| 30 / 50 / 80 ms | **8 of 15 completed before the cancel arrived** | — |

**`Dataset::open` is only interruptible once it reaches the identity scan.** Reading the `geo`
key/value metadata, probing the schema and admitting the CRS all happen first and contain no
cancellation point; `cancel.attach` is called immediately before the scan. So a cancel issued at 5 ms
waits out the remaining prelude — hence ~21 ms — while one issued at 15 ms, closer to or inside the
scan, is observed in ~2 ms. Whole opens took **26.7–39.9 ms** (5 samples), consistent with a
~20–25 ms uninterruptible prelude followed by a short scan. Everything is far inside the 100 ms
budget at this file size; **at `docs/07`'s 5 GB the scan grows and the prelude does not, so this
ratio is not portable.**

### A gap this pass could not close, named rather than papered over

**The DuckDB covering-bbox scan phase of an index build was never sampled.** All 12 ladder delays
(10–400 ms) fell inside the 610 ms SHA-256 content hash, which runs first; the scan is only 30 ms and
starts after it. The mechanism exists — `SpatialIndex::scan` checks the token per chunk and DuckDB's
interrupt handle is attached — but it is unmeasured here.

**And one that is a code fact, not a timing.** After `SpatialIndex::build` finishes the scan and
performs its last `is_cancelled()` check, the extent pass and the grid-construction loops contain
**no cancellation point at all**. A cancel arriving in that window is not observed and the build
completes. At 100,000 features that window is a few milliseconds and nothing is at stake; at
`MAX_INDEXED_FEATURES` = 20,000,000 it is the same code with 200× the work. This is reported as a
property of the code, and **no measured number is offered for it**.

---

## What could not be measured honestly on this machine

| | |
|---|---|
| **Cold anything** | 63.7 GiB RAM, no cache-purge mechanism in either harness. Every open, every scan and every index build here read a **warm** Windows file cache |
| **5 GB** | Free disk oscillated between 1.9 and 8.2 GiB during this pass, partly because of the probe's own leak. A 5 GB fixture plus a from-clean release build does not fit, and even given the space the file would be cache-resident |
| **Between-session anything** | Forbidden here and not attempted. The unindexed baseline was re-measured in-session for exactly this reason |
| **macOS / Linux** | `docs/07`'s open follow-up. Nothing in this section says anything about either |
| **The branch tip** | This section describes `87644cb`. `fba323e` landed during the pass and is not measured |
| **Throughput** | Byte totals and durations appear side by side and are never divided |
| **The index in the browser path** | **`slice-host` never calls `Dataset::build_index`.** The index is unreachable from the shipped binary, so every browser trial ran `ScanOnly` or `WholeFile`. The index segment is *structurally absent* on that path, not zero. This is scope, not a defect: `kernel/README.md` already says "when built" |

---

## Reproducing this

```bash
# The measurement branch: 87644cb's product code plus the instruments, nothing else.
git checkout measure/pieces-1-4a

# 0. Clean, so no cached unit from another checkout can be linked in, then pin BEFORE the build.
cargo clean --release -p spatial-engine -p spatial-kernel -p spatial-data-plane
node kernel/scripts/pin-tree.mjs > target/slice-evidence/index-pass/tree-pin-before.json

# 1. Build, then confirm the build window was quiet.
CARGO_PROFILE_RELEASE_DEBUG=false cargo build --release --workspace --tests
(cd frontends/canvas-probe && npm install && npm run build)
node kernel/scripts/pin-tree.mjs --compare target/slice-evidence/index-pass/tree-pin-before.json

# 2. Pin the BINARIES, not just the sources.
node kernel/scripts/pin-tree.mjs --binaries \
  "target/release/slice-host.exe,target/release/deps/indexed_budgets-<hash>.exe,frontends/canvas-probe/dist/app.js" \
  > target/slice-evidence/index-pass/tree-pin-before.json

# 3. Correctness gate on the same build.
CARGO_PROFILE_RELEASE_DEBUG=false cargo test --release --workspace

# 4. The index-in-path harness. Run the BINARY, from a private copy, so nothing can replace it.
cp target/release/deps/indexed_budgets-<hash>.exe /some/private/harness.exe
/some/private/harness.exe --ignored --nocapture --test-threads=1

# 5. The probe. Cells are (compositor path x viewport x pre-warm); each trial is its own page load.
node kernel/scripts/run-slice-probe.mjs \
  --data target/fixtures/slice-budgets/polygons-100k.parquet \
  --out-prefix target/slice-evidence/index-pass/polygons-100k \
  --extent 2600000,1200000,2612680,1212680 \
  --viewports 'full=;quarter=2600000,1200000,2606340,1206340;sixtyfourth=2600000,1200000,2601585,1201585' \
  --trials 7 --pin target/slice-evidence/index-pass/tree-pin-before.json   # [--headed] [--no-prewarm]

# 6. Confirm nothing moved — sources AND binaries.
node kernel/scripts/pin-tree.mjs --compare target/slice-evidence/index-pass/tree-pin-before.json
```

Both harnesses refuse to run on a debug build, and the probe driver now exits non-zero when the
canary or the pin invalidator fires — the first probe attempt exited 0 while its own artifact said
`INVALIDATED`.

### Raw artifacts (`target/slice-evidence/`, gitignored)

| File | What it holds |
|---|---|
| `indexed-budgets.json` | the harness run of record: every raw cancellation, selectivity, index and memory sample, plus all four canary points |
| `index-pass/polygons-100k-probe-headless.json` | headless probe, pre-warm on — per-trial segments, admitted/dropped, canary, pin, disk |
| `index-pass/polygons-100k-probe-headless-noprewarm.json` | **the one established probe cell** |
| `index-pass/polygons-100k-probe-headed.json` | windowed, all three viewports |
| `index-pass/polygons-100k-trials-*/` | the per-trial browser artifacts behind every summary |
| `index-pass/tree-pin-before.json`, `tree-pin-probe.json` | the 52-file source pin **and the binary SHA-256s** |
| `index-pass/correctness-gate.txt` | 130 passed / 0 failed / 2 ignored at this pin |
| `index-pass/session-context.txt` | session start/end, free disk, git head |

### Instrument sources (committed)

| File | Role |
|---|---|
| `kernel/PROBE-PREREGISTRATION.md` | the preregistration and its six amendments |
| `kernel/tests/indexed_budgets.rs` | the index-in-path harness; `#[ignore]`d, release-only, asserts the hard gates **and the canary threshold** |
| `kernel/tests/slice_budgets.rs` | the earlier harness, unchanged, describing the pre-index tree |
| `kernel/scripts/run-slice-probe.mjs` | n-trial probe driver: cells, segments, p50/p95, enforced invalidators, disk guard |
| `kernel/scripts/pin-tree.mjs` | source pin, **binary pin**, and `--compare` |
| `frontends/canvas-probe/scripts/run-probe.mjs` | one trial: one browser, one page load, one stream |

---
---

# Third section — 2026-08-06, the ScanOnly / reused-connection / cancellable-phases cut

**Everything above this line describes earlier trees measured in earlier sessions and is left exactly
as it was.** Nothing below is compared with anything above it, and the one place where a figure above
is *named* — the 92.6 ms S2 — is named in order to say that it is **not** a baseline for anything
here.

Governed by `kernel/PROBE-PREREGISTRATION.md` **amendment A7**, committed in `8396194` **before the
build, before the run, and before any result of this pass existed**. A7 declares the interleaving,
the sample counts, the definition of lease generation, what the browser cell can and cannot
establish, and two cut-specific invalidators. **No amendment was made after a result was seen.**

## What this pass is measuring, and what changed underneath it

Three product changes precede it, all committed before A7 was written:

1. **The fixed-grid index is out of the default planner** — the measured regression in the second
   section is the reason, and the mechanism is in `engine/src/stream.rs`'s planner comment.
2. **Configured DuckDB connections are reused per open dataset** — a bounded per-dataset lease pool.
3. **Every O(N) index-build phase polls cancellation**, and a phase observer makes the DuckDB scan
   phase targetable at all.

## Scope carried by every number below

| | |
|---|---|
| **Hardware** | Intel Core i9-9980HK @ 2.40 GHz · 8 cores / 16 threads · 63.7 GiB RAM · Windows 10 Pro 22H2 build 19045 |
| **Build** | `release`, `CARGO_PROFILE_RELEASE_DEBUG=false`, built **from clean**. `debug_assertions` **off** — self-reported by the in-process harness, which refuses to run otherwise; **`slice-host` carries no such guard**, so the browser cell's release status rests on the build command, the path and the pinned hash. See invalidator 1 |
| **Tree** | branch `cut/scanonly-reuse-cancellation` at **`15db779`**, based on **`a64b861` (`main`)**. Source pin `0a2a45cc0a0f8c5b3e61b7312ba3e181` over **57 files**, taken **before** the build and re-verified after it and after the browser cell |
| **Binaries** | pinned by SHA-256 and re-verified: `slice-host.exe` `cd9fcb9c…`, harness `16e1dcc7…`, `dist/app.js` `8548649f…`. The harness ran from a **private copy** whose hash was checked against the pin |
| **Dataset** | `docs/08` Polygons: 100,000 features / **10,467,093 vertices** / 114,286 rings / 151,812,642 B; seed `0x5EED205600000002` |
| **Correctness gate at this pin** | `cargo test --release --workspace` — **159 passed, 0 failed, 2 ignored** (the two measurement harnesses) |
| **Excluded** | macOS/Linux · cold-cache anything · 5 GB · **any between-session comparison** · any throughput figure · frame time · VRAM. Nothing here cites ADR-012 |

**This is not the tree the second section describes.** That section measured `87644cb` on a
measurement branch that deliberately excluded `fba323e`'s reviewer fixes. This cut is built on
`main`, which contains them, so the two trees differ in `engine/src/{index,dataset,stream}.rs`. No
figure crosses between the sections even setting the session rule aside.

---

## The one number this cut set out to move: S2

**Both modes ran in one session, from one pinned binary, interleaved
`off, on, on, off, off, on, on, off, off, on, on, off, off, on`, with one `slice-host` process per
trial in both modes** so the restart is a constant rather than a treatment applied to one arm.
7 admitted / 0 dropped per mode. Whole-file query, headless, pre-warm off, one solo stream per page
load.

| Segment | reuse-**off** p50 / p95 | reuse-**on** p50 / p95 | signed delta (on − off), p50 |
|---|---|---|---|
| S1 `scenario → query start` (outside the budget) | 0.3 / 0.5 | 0.2 / 1.1 | −0.1 |
| **S2 `query start → OPEN`** | **74.0 / 82.6** | **55.6 / 184.3** | **−18.4** |
| S3 `OPEN → first bytes` | 92.7 / 104.3 | 102.3 / 312.3 | +9.6 |
| S4 `first bytes → decoded` | 4.5 / 5.8 | 4.8 / 12.6 | +0.3 |
| S5 `decoded → first pixels` | 2.0 / 2.8 | 3.7 / 5.8 | +1.7 |
| **first pixels after query start** | **171.9 / 190.7** | **163.9 / 514.2** | **−8.0** |
| **full payload after query start** | **7623.5 / 8329.8** | **7099.7 / 8830.7** | **−523.8** |

**Every delta in that table except S2's is unseparated on rank, and none of them is claimed.** Full
payload's −523.8 ms is the largest number in the column and reuse-on wins only **35 of 49** pairwise
comparisons; S4's +0.3 and S5's +1.7 sit at 32/49 and 33/49 — and S5 is browser-side draw and
animation-frame work that a connection mode cannot touch at all. **S2 is the only segment in this
table where anything is established**, and the rest are printed because a table that showed only the
moving segment would be a different claim. *(These pairwise counts are descriptive and post hoc; see
the note below.)*

**At n = 7 the nearest-rank p95 *is* the maximum sample.** Every raw S2 sample:

- reuse-**off**: **61.5, 71.5, 71.7, 74.0, 79.4, 79.7, 82.6**
- reuse-**on**: **46.2, 50.6, 53.1, 55.6, 55.9, 59.1, 184.3**

**What that supports, stated as narrowly as it deserves.** Six of the seven reuse-on samples fall
strictly below **all seven** reuse-off samples. That separation is not a percentile artefact, and it
is in the segment and the direction the change targets. **The seventh reuse-on trial read 184.3 ms,
and it is not excluded** — it stays in the sample set, in the p95 and in the delta, which is why the
p95 delta is **+101.7 ms** while the p50 delta is −18.4 ms.

**That outlier is a whole-trial stall, and the artifact says so rather than the write-up asserting
it.** The strongest evidence is not in the segments at all: that trial records
**`host_ready_ms: 120`, against 51–62 ms for all thirteen others** — the `slice-host` process took
twice as long to become ready, which is measured **before the browser window opened**, and therefore
before `t_scenario`, let alone before `t_query_start`. The segments agree: S1 1.1 ms (against
0.2–0.4), S3 **312.3** (against 95.8–117.0), S4 **12.6** (against 4.0–6.9), first pixels **514.2**.
S5 at 5.0 ms sits inside its own cell's 1.6–5.8 spread and is *not* inflated, so "every segment"
would be an overstatement. And `full_payload` at 7,494 ms is mid-distribution, so the disturbance was
transient and confined to the trial's opening. The trial's connection facts are normal
(`already_configured: true`, physical 1, lease 2), so it is not a failure of the reuse path.

**This is an explanation, not a licence:** no trial was dropped, no robust estimator was substituted
for the declared nearest-rank one, and the p95 is reported as it came out.

**This cell measures connection *preparation at open*, not reuse across streams** — declared in A7
before the run and true by construction: one host per trial and one solo stream per page load means
no browser trial here ran on a connection a previous *stream* had used. Reuse across streams is
established *functionally* in process by `engine/tests/connection_reuse.rs`; its **performance is
measured nowhere in this pass**.

### The number that has to travel with the −18.4 ms

**`S2 + S3` is the boundary-independent quantity, and it moved −10.9 ms with no rank separation.**

`t_open` is a boundary inside the producer's work. Any work that merely moved across it cancels in
`S2 + S3` and does not cancel in S2 alone — so `S2 + S3` is what survives if part of the S2 gain is a
boundary shift rather than work removed. Per-trial p50: **166.3 (off) → 155.4 (on), −10.9 ms**, and
the reuse-on values are *not* separated from reuse-off's on rank (16 of 49 pairwise comparisons
favour reuse-off). **No difference in time to first bytes is established.** The −18.4 ms is a claim
about S2, and only about S2.

### An instrument asymmetry that lands on one arm by construction

The mid-run canary fires when `i + 1 >= 7`, which in this sequence is **between trial 6 (`on`) and
trial 7 (`off`)** — and each canary point ends with roughly a second of CPU-saturating loop
immediately before the next trial starts. **Trial 7 produced 82.6 ms, the reuse-off maximum and
therefore the reuse-off p95.**

It is disclosed rather than corrected: **dropping trial 7 would put reuse-off's p50 at 71.7 ms and
the delta at −16.1 ms instead of −18.4 ms**, so at most ~2 ms of the headline could be attributable
to it, in the direction that *flatters* the result. The trial is not dropped — the same rule that
keeps the 184.3 ms trial keeps this one.

**And the mechanism is asserted, not shown — the one comparable case cuts the other way.** The
*start* canary also runs immediately before a trial, with only a pin comparison in between; that
trial is trial 0, also `off`, and it produced **61.5 ms — the reuse-off *minimum***. Two trials
follow a canary, one gave the cell's maximum and one its minimum. So "the canary inflated trial 7" is
a plausible story that this run's own data does not corroborate, and it is recorded as a disclosure
of instrument placement rather than as a finding.

### The producer's own account of which mode actually ran

**Cut-specific invalidator 14 is discharged by observed facts, not by the flag that requested them.**

| | physical connection | lease generation | already configured |
|---|---|---|---|
| reuse-**off**, all 7 admitted trials | 2 | 1 | **false** |
| reuse-**on**, all 7 admitted trials | 1 | 2 | **true** |

Generation counts every lease **including the one `Dataset::open` takes** — fixed in A7 before the
run, not chosen after seeing this table. So reuse-on's stream is the second use of the connection
open prepared, and reuse-off's is the first use of one made for the query, exactly as designed.
Producer-side facts sit on the producer's own clock and counters and are **never subtracted from
browser S2**.

### What the S2 result does *not* mean

- **It is not progress toward `docs/08`'s first-pixels budget.** S3 alone is 92.7–102.3 ms p50
  against a 100 ms budget for the whole figure. The verdict below is **missed**, and the
  first-pixels difference between the modes is **not established**: −8.0 ms p50 with no rank
  separation at all (32 of 49 pairwise comparisons favour reuse-on, which is close to the 24.5 a
  coin would give).
- **S3 moved the wrong way** — +9.6 ms p50 — and this pass offers **no explanation for it**. It is
  reported because quoting only the segment that improved would manufacture a result. **Its
  separation is stronger than S2's, not weaker**: reuse-off is faster in 45 of 49 pairwise
  comparisons, against 42 of 49 for S2's improvement. Whatever weight the S2 separation carries, the
  S3 one carries more — so "S3 is noise" is not available while "S2 improved" is being claimed.
  *(These pairwise counts are descriptive and **post hoc**. A7 declared p50, p95 and a signed delta
  and no test of any kind; the counts are stated so a reader can see the shape of the samples, and
  they are not a preregistered result.)*
- **No comparison with the 92.6 ms S2 in the second section is claimed**, for three independent
  reasons: a different session, a different product tree, and a different procedure — one host
  served every trial there; here one host serves each trial.
- **It is a claim about completed streams only.** A cancelled stream forfeits its connection by
  design, so the supersession pattern degrades to the fresh-connection path.

---

## Results against `docs/08`

| `docs/08` row | Verdict | Measured | Trials | Scope |
|---|---|---|---|---|
| **First pixels < 100 ms after query start** | **missed** | reuse-on **p50 163.9 · p95 514.2 · min 148.8**; reuse-off **p50 171.9 · p95 190.7 · min 165.4**. Full payload, always beside it: **7099.7 / 7623.5 ms p50** | 7 + 7 admitted, 0 dropped | **The verdict is robust in a way the point estimates are not.** The budget is 100 ms and the **smallest single value in any of the 14 admitted trials was 148.8 ms**. No plausible drift carries a 148.8 ms minimum under 100 ms |
| **Cancellation < 100 ms — mid-stream** | **met** | **p50 0.080 · p95 0.115 ms** (min 0.050, max 0.129). Batches generated after cancel: **0 in all 30** | 30 | Producer-side, stamped inside the thread doing the work; both ends in one process, one clock, no clock-relation bound claimed |
| **Cancellation < 100 ms — before the first batch** | **met** | **p50 0.138 · p95 0.398 ms** (min 0.115, max 0.458). Batches after cancel: **0 in all 30** | 30 | No credit granted, so nothing was ever delivered and the query was running when CANCEL arrived |
| **Cancellation < 100 ms — inside the DuckDB scan phase** | **met, and sampled at all for the first time** | **p50 4.974 · p95 14.686 ms** (min 1.992, max 14.686) | **10** | The gap the second section named and could not close. **n is 10, not the 12 the artifact prints** — two trials are reclassified below under the rule A7.2 declared in advance. 0 trials failed to reach the scan |
| **Cancellation in grid population, incidentally** | **no verdict claimed — post hoc** | **3.956 and 4.201 ms** | 2 | The two 20 ms trials, in which the ~30 ms scan had already finished. **A7 declared no cell for this**, and it declared that these two trials are not latency samples for the scan — so they are reported here as observations rather than promoted to a `met` verdict for a phase nobody preregistered. They are, incidentally, the only direct evidence in this pass that piece 3's *grid-population* polling fires at all |
| **Cancellation < 100 ms — during an index build (delay ladder)** | **met** | **p50 1.618 · p95 4.707 ms** (min 0.180) | 12 | The ladder ran all twelve declared delays without a build completing, so n is the full 12. **Inferred, not recorded: all twelve almost certainly landed in the SHA-256 content hash again** — 10–400 ms delays against a ~603 ms hash — so this row does not sample the scan a second time. This ladder predates the phase observer and does not use it, so unlike the row above it carries **no per-trial phase field**, and the attribution is arithmetic rather than evidence. Wiring it to the observer is an instrument correction for the next pass |
| **Cancellation < 100 ms — during the identity uniqueness scan** | **met** | **p50 2.524 · p95 22.049 ms** (min 1.896) | 7 of 15 | **8 of 15 trials completed before the cancel arrived**, reported and not counted as latency samples — the same structural split the second section explains |
| **Memory — producer-resident counter vs declared bound** | **met** | peak **1,729,952 B** against a declared bound of **83,886,080 B** = `(MAX_INFLIGHT_BATCHES + 1) × MAX_FRAME_BYTES`. **2.06 % of bound** | all runs | The percentage describes the batch shape it was taken under; the bound stays a valid **upper** bound and is looser under progressive sizing |
| **Memory — process private commit** | **recorded** | baseline 5,472,256 B → peak **196,546,560 B** | 1 | Covers **both ends plus the index plus the fixture writer**, which wrote three 145 MB files. Not a per-stream number, and not comparable with the second section's figure |
| **Cold open of a 5 GB GeoParquet < 5 s** | **unmeasured** | — | — | Unchanged, for the same two independent reasons. Every free-disk reading in the artifacts sits between **4.21 and 5.82 GiB**, and a 5 GB fixture plus a from-clean release build does not fit in that; the ~10.8 GiB available immediately after `cargo clean` is an **operator observation with no artifact behind it** and is recorded as one. And with 63.7 GiB of RAM and no cache-purge mechanism, "cold" cannot be established even given the space |
| **Frame time p50/p95 · VRAM** | **excluded, deliberately** | — | — | There is still no renderer module. The 2D canvas probe is not one, and a figure from it would answer a different question than the budget it appears to answer |
| **Reproducibility (ADR-005 grade)** | **no grade claimed** | — | — | The slice still persists nothing, so there is no workflow to replay |

---

## The gap the second section named, now closed

> *"The DuckDB covering-bbox scan phase of an index build was never sampled. All 12 ladder delays
> (10–400 ms) fell inside the 610 ms SHA-256 content hash… the mechanism exists… but it is
> unmeasured here."*

**It is measured now, and the fix was to stop guessing at a wall-clock offset.** The build reports
its phase transitions to a test-only observer; the ladder waits for `DuckDbScan` to be *announced*
and measures the delay from there. Delays 0, 1, 2, 5, 10, 20 ms, twice each, on a **third** copy of
the fixture so a completed build could not populate the cache the other ladders use.

| Delay after the scan was announced | Phase the cancel was **issued** in | Phase it was **observed** in | Latency |
|---|---|---|---|
| 0, 0, 1, 1, 2, 2, 5, 5, 10, 10 ms | `duckdb-scan` | `duckdb-scan` | 14.686, 11.870, 7.450, 7.637, 4.974, 5.432, 3.474, 2.143, 3.550, 1.992 ms |
| 20, 20 ms | `populate-grid` | `populate-grid` | 4.201, 3.956 ms |

### The instrument miscounted this cell, and the preregistration is what corrects it

**`indexed-budgets.json` prints this cell as n = 12, p50 4.201 ms, and
`trials_where_the_scan_completed_before_the_cancel: 0`. All three are wrong, and the last one is the
defect that caused the other two.**

`scan_completed_first` only increments when the whole **build** returns `Ok` — not when the **scan**
finishes. In the two 20 ms trials the scan demonstrably finished: by then the ~30 ms scan was over
and the build had moved on, which is why both cancels were issued *and* observed in
`populate-grid`. The counter read 0 anyway, and both trials were kept as scan-phase latency samples.

**A7.2 declared the opposite before the run:** *"Recorded separately and never as latency samples:
trials where the scan finished before the cancel arrived."* Applying that declared rule to the
recorded per-trial phase fields — which exist precisely so this is possible — gives the corrected
cell:

| | n | p50 | p95 | min | max |
|---|---|---|---|---|---|
| **`duckdb-scan`** | **10** | **4.974** | 14.686 | 1.992 | 14.686 |
| `populate-grid` (the two 20 ms trials) | 2 | — | — | 3.956 | 4.201 |

**This is honouring the preregistration, not amending it after the fact.** The rule was written down
before the run; the instrument failed to implement it; the phase attribution it *did* record makes
the reclassification mechanical rather than a judgement.

**The published p50 of 4.201 ms was itself one of the two grid-population samples.** Quoting it as
the scan phase's median would have been a grid-population measurement wearing the scan's name — the
precise error class the phase attribution was added to prevent. Both corrected figures stay two
orders of magnitude inside the 100 ms budget, so no verdict changes; only the label, the n and the
p50 do. **The harness is not edited to fix the counter**, for the same reason as the memory label
below: it would be a post-result protocol change.

**The observation instant did not move.** The latency is still stamped inside the thread doing the
work, at the moment it observed the cancel. The observer decides only when the cancel is *issued*,
which is the canceller's side of the measurement and always was.

**One thing this cell does not explain and this text will not narrate:** observed latency falls as
the delay grows — per-delay means 13.28, 7.54, 5.20, 2.81 ms at 0, 1, 2, 5 ms. It is **not** monotone
sample by sample (the 10 ms pair gives 3.550 and 1.992 against the 5 ms pair's 3.474 and 2.143). No
mechanism is offered for the trend and none should be inferred from n = 2 per rung.

### The other gap in that section — a code fact, now a tested one

> *"After `SpatialIndex::build` finishes the scan… the extent pass and the grid-construction loops
> contain **no cancellation point at all**."*

Closed — and closing it exposed a defect a cadence alone would not have caught. Polling every N items
bounds waiting *inside* a phase and says nothing about the tail, or about a phase whose loop never
runs: a **degenerate extent** (every feature sharing an x or a y — a point layer, a single feature,
duplicated bboxes) skips grid population entirely. Without an unconditional check before the index is
constructed, a cancelled build returned `Ok` **and was inserted into the cache**. Found in review,
fixed in `15db779`, and pinned by a test that cancels at the last phase transition on a 64-feature
fixture where every in-loop poll has already run.

---

## Piece 1, corroborated by the instrument and proved by the test

The selectivity section ran twice, as it always has: once with no index in the process, once after
one was built.

**The plan is not observed on the wire, and this section does not claim it is.** The wire carries no
plan — `selectivity.filter_plan_provenance` says so in the artifact — so `FilterPlan` is read from an
**engine-direct stream run with identical parameters**, and is labelled that way here as it is there.
What the wire independently corroborates is the row counts, the byte-identical payloads and the
overlapping timings.

| Viewport | Plan, no index | Plan, index built | Rows | Wire first batch p50 (no index → built) | Wire total p50 |
|---|---|---|---|---|---|
| whole file | `WholeFile` | `WholeFile` | 100,000 | 70.5 → 73.9 ms | 479.1 → 467.0 ms |
| quarter extent | `ScanOnly` | **`ScanOnly`** | 25,281 | 123.9 → 125.0 ms | 178.7 → 176.8 ms |
| 1/64 extent | `ScanOnly` | **`ScanOnly`** | 1,600 | 38.2 → 38.7 ms | 41.3 → 41.7 ms |

n = 7 per point per path. Payload totals byte-identical across both halves at every point
(173,807,128 / 44,018,088 / 2,798,952 B). The artifact declares this expectation **before** the rows,
so the agreement is a check rather than a finding after the fact.

**The two halves are not claimed to "match" — no difference is established either way at n = 7.**
All three first-batch figures drifted the same direction (+0.9 % to +4.9 %), and the ordering is
**forced**: the index cache is process-wide, so the unindexed half must run first, which perfectly
confounds "indexed" with "later in the session".

The support for "no difference" is the samples themselves, not the canary. At the two rows where the
plan could have differed, the per-run values overlap almost exactly — reuse of the earlier half wins
**24 of 49** pairwise comparisons at the quarter extent and **25 of 49** at 1/64, either side of the
24.5 a coin gives. **The canary does not support this claim and is not offered for it**: the two
points that actually bracket this boundary are `mid` (116.362 ms, taken immediately after the
unindexed half) and `end` (115.915 ms), so across the two halves the canary *fell* 0.4 %. The 5.75 %
figure quoted elsewhere in this section is the spread across all four minima and spans fixture
writing, three opens and every cancellation ladder — not this boundary.

What *is* visibly ordered is the **whole-file** row, which ran `WholeFile` in both halves and never
touched the index at all: it favours the earlier half 40 of 49. That is session drift, measured on a
row where the index cannot be the cause, and it is the reason the ±1–5 % differences above are not
read as an index effect in either direction.

**In the second section those same rows read `IndexNarrowed { ranges: 159, candidates: 25281 }` and
190.1 ms.** They now read `ScanOnly` on a dataset whose index is built, cached and admissible.
**That is a structural result, not a measured improvement**: the 35.6 % regression that motivated the
change came from another session and another tree, and comparing it with anything here is forbidden.
What this pass establishes is that the product planner returns `ScanOnly` — **proved
deterministically by `engine/tests/planner_seam.rs`**, which asserts on a call counter that the seam
is never *reached*, and corroborated by the engine-direct plan observation and the wire's identical
rows and payloads. **The index's cost is deliberately not re-measured**, and removing it is not shown
here to have made anything faster.

`engine/tests/planner_seam.rs` proves the stronger statement a timing cannot — that the seam is not
merely unhelpful but **unreached** — deterministically, on a call counter, in its own process.

---

## Open-time cost, since this cut changed what `Dataset::open` does

`Dataset::open` now returns its connection to the pool instead of dropping it. What that adds is one
trivial **drained** statement; what it does not add is a connection — open used exactly one
configured connection before and uses exactly one now.

| | samples (n = 5) | range |
|---|---|---|
| `PoolConfig::reuse()` — the product default | 30.464, 24.170, 23.395, 23.581, 25.655 ms | **23.4 – 30.5 ms** |
| `PoolConfig::fresh_per_query()` — the control | 27.415, 26.272, 25.837, 26.296, 25.423 ms | **25.4 – 27.4 ms** |

**These are absolute figures in this session, and — this is the part that matters — neither column is
a "before".** Two independent reasons the guard cannot be discharged by measurement here:

1. **Between-session comparison is forbidden.** The 26.7–39.9 ms in the second section came from
   another session and is not a baseline for these. Nor is "well, it did not *double*" a safe weaker
   claim: this repository has recorded the *same* canary instrument reading 129.4–136.5 ms in one
   session and 68.6 ms in another — roughly a factor of two. **Session drift here is the same size as
   the effect the guard is looking for.**
2. **The control does not control for the thing this cut added.** `Lease::release_healthy` runs the
   drained `SELECT 1` **before** it consults `max_idle`, so the `fresh_per_query()` column pays the
   added statement too and then throws the connection away. That column is a control for *keeping* a
   connection, not for the statement. **The added cost was never isolated by any measurement in this
   pass.**

So the guard is discharged **structurally, not numerically**, and the honest form is: open created
exactly one configured connection before this cut and creates exactly one now — that is a code fact —
and what was added is one drained statement. The two columns overlap and nothing distinguishes them
at n = 5. Nothing here measures what the statement costs.

A7.3's other claim — that preparation does not extend `Dataset::open`'s uninterruptible prelude — is
likewise a code fact and is **unmeasured here**. The identity-scan ladder is *consistent* with a
prelude of roughly 25 ms (the three 5 ms trials read 22.0 / 19.5 / 20.0 ms of observed latency, the
cancel waiting the prelude out, so 5 ms + ~20 ms; against 1.9–2.2 ms once the delay reaches 15 ms),
but that is an inference from a ladder built for a different purpose, not a measurement of the
prelude.

---

## Every attempt, and which invalidators fired

**One attempt per phase. Neither was re-run, and nothing was discarded.**

| Attempt | Phase | Outcome |
|---|---|---|
| 1 | in-process harness | **all gates met.** Canary spread **5.75 %** across the four minima (declared 10 %) and 16.26 % across all raw readings — both disclosed. Source and binary pins unchanged |
| 1 | browser cell, interleaved | **all gates met.** Canary spread **6.91 %** across minima, 15.08 % across all raw. 7 admitted / 0 dropped per mode. Pins unchanged before and after |

Declared invalidators, each with what discharged it:

1. **Debug build** — **clear for the in-process rows, and asserted rather than self-evidenced for the
   browser cell.** `indexed-budgets.json` records `debug_assertions: false`, which is the measured
   binary reporting on itself, and `refuse_debug()` is the first statement of the measured function.
   **`slice-host` has no such guard**: the browser cell's release status rests on the build command,
   the `target/release/` path and the pinned SHA-256, not on a self-report. Earlier sections' phrase
   "both harnesses refuse to run on a debug build" is true of the two Rust harnesses and is **not**
   true of `slice-host`, which is what produced every browser number here.
2. **The tree moved mid-run** — **clear over the window the artifacts bracket, which is not the build
   window.** `tree_pin.before` and `tree_pin.after` in the A/B artifact both report
   `unchanged: true` for all 57 files and all three binaries, bracketing everything from before the
   first trial to after the last — which contains every number in this section. The retained
   `tree-pin-before.json` was *overwritten* with the binary-carrying pin after the build, so **no
   surviving artifact brackets the build itself**; that the sources were pinned before the build and
   compared clean after it is recorded here as an operator account, not as something a reader of
   `target/slice-evidence/` can verify. Retaining the pre-build pin as its own file is an instrument
   correction for the next pass.
3. **Canary spread beyond 10 %** — clear on both instruments: 5.75 % and 6.91 % across the four
   minima. The raw spreads (16.26 %, 15.08 %) are disclosed either way, as this file's convention
   requires.
4. **Segments that do not sum, a negative segment, last pixels before first** — clear: **0 of 14**
   browser trials dropped; every residual is exactly 0.0 ms. **That check is close to tautological on
   this instrument and is not offered as corroboration of clock integrity**: both sides are derived
   by subtraction from the same five `performance.now()` stamps, so an exact zero is what the
   arithmetic must produce. What it does catch — a missing, reordered or negative instant — it caught
   nothing of.
5. **A stream that did not complete, or the wrong row count** — clear: all 14 terminal `Completed`,
   all 14 at exactly **100,000 rows**, 203 batches, first batch 55,944 B, and **0 JSON frames on the
   data path** in every trial.
6. **A cancellation trial whose producer never observed the cancel** — clear for the identity ladder,
   which checks the error text and reports `trials_with_an_unexpected_error: 0`, and **not verified**
   for the scan and index-build ladders: both count *any* `Err` as an observed cancellation, so a
   non-cancellation failure would have been counted as a latency sample. No evidence one occurred;
   the instrument simply would not have said. Recorded as an instrument gap.
   **0 batches were generated after cancel in all 60** stream trials.
7. **More than one dropped trial in a cell** — clear: zero dropped in either cell. Note the driver's
   own `ESTABLISHED` verdict checks only `admitted >= 1` per cell, not the declared n = 7; the 7/7
   here comes from the artifact, not from the driver's word.
8. **At least 3 GiB free disk before launch** — clear: **5.54 GiB** at start, **4.21 GiB** at end,
   against a declared 3 GiB floor the driver enforces by refusing to start.
9. **Browser-profile cleanup verified and leaks recorded** — **half-fired: recording held,
   verification did not.** All **14 of 14** trial artifacts record `profile_removed: false`, and the
   end-of-run sweep removed **0 and found 16 resisted** — 16 rather than 14 because the *pre*-run
   sweep had already found 2 it could not remove either. Free disk fell **1.33 GiB across the run,
   roughly 100 MiB per trial**, so the last trials ran with materially less headroom than the first —
   though never near the floor. This is the same unfixed root cause the second section records
   ("Edge's child processes outlive the pid being polled"), and "cleanup verified" is simply false
   here. **The A/B driver's own summary line — "every declared invalidator is clear" — does not
   consider the leak at all and must not be quoted as though it did.**
10. **Teardown settled before the final canary** — clear: every canary point settles 3 s and discards
    a warm-up reading first, and the profile sweep runs *before* the end canary so pressure the
    instrument created cannot read as the machine drifting.
11. **No competing Cargo/rustc/linker process at phase start** — **operator-asserted, not
    instrumented.** It was checked, and nothing was running. Neither instrument implements the check
    amendment A4 declared, and no artifact field records one, so a reader cannot verify it. An
    instrument correction for the next pass.
12. **One re-run maximum per invalidated phase** — not needed; no phase was invalidated. Note that
    the per-trial filenames are fixed, so a prior attempt would have been overwritten without trace —
    the same instrument shortcoming the second section already names.
13. **(14) The artifact cannot prove which DuckDB connection mode actually ran** — clear, by observed
    producer facts, in both arms, as tabulated above.
14. **(15) `t_open` semantics or timestamp placement changed** — clear: `frontends/canvas-probe` and
    `kernel/scripts/run-slice-probe.mjs` are **byte-identical to `a64b861`**. The A/B ran on a
    separate driver (`kernel/scripts/run-connection-ab.mjs`) precisely so this could be discharged by
    construction rather than by inspection.

---

## Three stale strings in the artifact, deliberately not fixed here

**None of them is a wrong number; all three are prose that stopped describing the code.** They are
recorded rather than edited because editing a harness after its results have been seen is a
post-result protocol change, and a stale description is worth less than that discipline. All three
are corrected in a later cut.

**1. The index memory expression.** `indexed-budgets.json` reports the bound as **5,073,144 B** under
the label `"features x 48 B (id + bbox + one grid slot)"`. **The value is right and the label is
stale.** `fba323e` changed the formula to `features × 40 B + cell_entries × 4 B`, so
`100,000 × 40 + 268,286 × 4 = 5,073,144`, where **268,286 is the bucket-entry count** — a figure the
artifact never prints, and which has to appear somewhere for the expression to be checkable at all.
The old formula would give `100,000 × 48 = 4,800,000`.

**When this figure is read beside the second section's 4,800,000, it is a formula correction, not
5.7 % of memory growth** — `fba323e` stopped ignoring bucket entries and understating multi-cell
features. And the bound is *declared*, not observed: nothing in this pass measured the index's actual
heap occupancy.

**2. `cancellation.index_in_path`** still reads *"yes for the two stream cases: they run the
quarter-extent viewport against a built index"*. **After piece 1 that cannot be true**, and the same
artifact contradicts it: `selectivity.indexed[1].filter_plan` reads `ScanOnly`. The harness contains
no reference to the experimental seam, so those streams went through the product planner. The correct
statement is that the cancellation stream cases ran **`ScanOnly` on a dataset with a built-but-unused
index in the process cache**.

**3. `trials_where_the_scan_completed_before_the_cancel: 0`** — wrong, and corrected above.

### And it independently corroborates the second section's contamination finding

That section reports attempt 1 of its harness as invalidated on build provenance — a binary
containing a string that existed only in *another checkout's uncommitted* `engine/src/dataset.rs` —
and records the symptom in the numbers: **"attempt 1 reported the index's declared memory as
5,073,144 B, the pinned tree reports 4,800,000 B."**

**5,073,144 B is exactly what the reviewer-fixed formula produces on this fixture** — the formula
that later landed as `fba323e`. So the contaminating compilation unit was not merely "from another
checkout": it was the in-progress reviewer fix itself. A diagnosis made in one session from a string
found in a binary is confirmed in another session by arithmetic, from a tree where that fix is
committed. The two agree, and neither was constructed to.

---

## What is not established, and is not claimed

| | |
|---|---|
| **Reuse *across streams*, in the browser** | Structurally absent from this cell: one host per trial, one stream per page load. Established in process by `engine/tests/connection_reuse.rs`; by **no** number above |
| **A decomposition of S2** | The −18.4 ms p50 is the **measured difference between the two modes**; the mechanism the change targets is removing connection creation and the configuration statement from S2. It is **not** a measurement of what fraction of S2 those were — S2 still contains socket acquisition, the handshake, SQL construction and producer accept, nothing here divides it, and if any part of the difference is work moving across `t_open` rather than work removed, only the unseparated −10.9 ms of `S2 + S3` survives |
| **Why S3 rose 9.6 ms** | Unexplained. Reported anyway |
| **Anything about the p95 beyond the number itself** | At n = 7 the p95 *is* the maximum sample. One reuse-on trial stalled across every segment; the p95 carries it, and the cell was not re-run to remove it. What excluding it would manufacture is worth stating: at n = 6 reuse-on's p95 becomes 59.1 ms and the **+101.7 ms p95 delta flips to −23.5 ms** — a sign change conjured out of a rule invented after seeing which sample it removes |
| **Time to first bytes** | `S2 + S3` moved −10.9 ms p50 with no rank separation. **No difference in first bytes is established**, and the −18.4 ms may not be restated as one |
| **That removing the index made anything faster** | Structural only. The two selectivity halves agree within the drift envelope; the index's cost is not re-measured, and the second section's regression figures are another session and another tree |
| **Any browser-side memory or VRAM figure** | The A/B driver runs no memory sampler. **Absent, not zero** |
| **Anything about concurrency or supersession on the browser path** | One solo stream per page load; `MAX_CONCURRENT_STREAMS = 4` is not exercised in this cell at all |
| **The supersession path under reuse** | A cancelled stream forfeits its connection by design, so it degrades to fresh-connection behaviour. Unmeasured here. Raw material for the reserved **ADR-014**, and citable as evidence for nothing else |
| **The engine/binding admission race** | On a cancel, the binding's admission permit is released before the engine's lease, so at the concurrency ceiling a cancel-and-immediately-re-request can be admitted by one and refused by the other. A **code fact found in review**; no measured number is offered for it, and nothing in this repository has met it |
| **Index v2** | **Neither built nor measured.** No row-group summaries, no sidecars, no partition pruning, no spatial clustering, no new structure, no new planner heuristic. Its gate stands as written: on one pinned binary in one admissible session it must beat `ScanOnly` at quarter-extent time to first batch while returning exactly the same rows and payload |
| **Cold anything · 5 GB · macOS/Linux · throughput · frame time · VRAM** | Out of scope, on the same grounds as every section above |
| **Between-session anything** | Forbidden here and not attempted |

---

## Reproducing this

```bash
git checkout cut/scanonly-reuse-cancellation      # product tree 15db779, based on main a64b861

# 0. Clean, so no cached unit from another checkout can be linked in, then pin BEFORE the build.
cargo clean
node kernel/scripts/pin-tree.mjs > target/slice-evidence/connection-ab/tree-pin-before.json

# 1. Build from clean, then confirm the build window was quiet.
CARGO_PROFILE_RELEASE_DEBUG=false cargo build --release --workspace --tests
(cd frontends/canvas-probe && npm install && npm run build)
node kernel/scripts/pin-tree.mjs --compare target/slice-evidence/connection-ab/tree-pin-before.json

# 2. Correctness gate on the same build.
CARGO_PROFILE_RELEASE_DEBUG=false cargo test --release --workspace

# 3. Pin the BINARIES, not just the sources.
node kernel/scripts/pin-tree.mjs --binaries \
  "target/release/slice-host.exe,target/release/deps/indexed_budgets-<hash>.exe,frontends/canvas-probe/dist/app.js" \
  > target/slice-evidence/connection-ab/tree-pin-before.json

# 4. The in-process harness, from a private copy so nothing can replace it mid-run.
cp target/release/deps/indexed_budgets-<hash>.exe /some/private/harness.exe
/some/private/harness.exe --ignored --nocapture --test-threads=1

# 5. The interleaved connection cell. One host process per trial, in both modes.
node kernel/scripts/run-connection-ab.mjs \
  --data target/fixtures/slice-budgets/polygons-100k.parquet \
  --out-prefix target/slice-evidence/connection-ab/polygons-100k \
  --extent 2600000,1200000,2612680,1212680 \
  --trials-per-mode 7 --expect-rows 100000 \
  --pin target/slice-evidence/connection-ab/tree-pin-before.json

# 6. Confirm nothing moved — sources AND binaries.
node kernel/scripts/pin-tree.mjs --compare target/slice-evidence/connection-ab/tree-pin-before.json
```

The **in-process harness** refuses to run on a debug build and records `debug_assertions` in its own
artifact; **`slice-host` has no such guard**, so the browser cell's release status rests on the build
command, the path and the pinned hash. Both drivers exit non-zero when a declared invalidator fires —
with the exception recorded above, that the A/B driver's verdict does not consider the profile leak.

### Raw artifacts (`target/slice-evidence/`, gitignored)

| File | What it holds |
|---|---|
| `indexed-budgets.json` | the in-process run of record: every raw cancellation, selectivity, index, open and memory sample, plus all four canary points |
| `connection-ab/polygons-100k-connection-ab.json` | the interleaved cell: every raw segment per trial, both cells, the signed delta, the producer connection facts, canary, pins, disk |
| `connection-ab/polygons-100k-trials-connection-ab/*.json` | the 14 per-trial browser artifacts behind that summary |
| `connection-ab/tree-pin-before.json` | the 57-file source pin **and** the three binary SHA-256s |
| `connection-ab/correctness-gate.txt` | 159 passed / 0 failed / 2 ignored at this pin |
| `connection-ab/indexed-budgets-stdout.txt`, `connection-ab/ab-stdout.txt` | console records of both runs |
| `archive-index-pass-2026-08-05/` | the previous pass's 74 raw artifacts, moved here before this pass cleaned its build tree so they would survive it |

### Instrument sources (committed)

| File | Role |
|---|---|
| `kernel/PROBE-PREREGISTRATION.md` | the preregistration and its seven amendments; **A7** governs this pass |
| `kernel/tests/indexed_budgets.rs` | the in-process harness: cancellation including the scan-phase ladder, selectivity, index, open in both connection configurations, memory |
| `kernel/scripts/run-connection-ab.mjs` | the interleaved connection cell — a **separate** driver, so the established cell's instrument stays byte-identical |
| `kernel/scripts/run-slice-probe.mjs` | the earlier probe driver, **unchanged**, describing the earlier cell |
| `kernel/scripts/pin-tree.mjs` | source pin, binary pin, and `--compare` |
| `frontends/canvas-probe/scripts/run-probe.mjs` | one trial: one browser, one page load, one stream — **unchanged** |

---
---

# Fourth section — 2026-08-06, the style v0 and static-bundle-publish cut

**Everything above this line describes earlier trees measured in earlier sessions and is left exactly
as it was.** Nothing below is compared with anything above it, and no figure crosses in either
direction. That rule matters more than usual here, because this section contains **no measurement at
all** in the sense the three sections above use the word.

## What kind of section this is, stated first because it changes how everything below should be read

**This is a correctness pass, not a measurement campaign.** There was no preregistration, because
there is nothing to preregister: no hypothesis, no budget, no percentile, no A/B, no canary, no
invalidator ladder. `kernel/PROBE-PREREGISTRATION.md` governs measurement passes and **does not
govern this one**.

Two numbers are recorded — **build wall time** and **bundle size** — and the brief that commissioned
this cut attaches **no budget to either**. They appear as individual observations, not as
distributions. **Nothing in this section may be cited about `docs/08`'s first-pixels budget, the
cold-open budget, ADR-011, ADR-012, ADR-014, the index question, or the transport bake-off.**

## Scope carried by everything below

| | |
|---|---|
| **Hardware** | Windows 10 Pro 22H2 build 19045 |
| **Tree** | branch `cut/style-publish` at **`9c63c84`**, based on **`4c67dc6` (`main`)** |
| **Build** | `release` for the publish and fixture runs; `cargo test --workspace` in the ordinary profile |
| **Browser** | **headless Chrome 151.0.7922.76** (`--headless=new`), one machine, one browser. **No Edge run** |
| **Not WebView2, which is the platform ADR-003 is accepted on** | Every viewer observation below is **Windows 10 + headless Chrome 151**. ADR-003's acceptance rests on Windows/WebView2/ANGLE-D3D11 evidence, and nothing here touched that platform. A Tauri shell embeds a system webview, so how this viewer behaves inside one is **unobserved** |
| **Dataset** | **The fixture generator's default polygon spec** at seed `0x5EED205600000002`, plus a nullable categorical `zone` column: 100 000 features / **2 508 699 vertices** / 114 286 rings / 39 049 894 B; 12–48 vertices per feature; zone counts `[20 252, 19 794, 19 999, 20 036]` + 19 919 null |
| **The dataset is NOT `docs/08`'s Polygons class, and must not be described as it** | That class is "100k features / **10M vertices**", and the file the third section pins has 10 467 093 of them. This one has **roughly a quarter of that geometry** — the feature count matches and the vertex count does not. The difference from the third section's file is therefore *not* only the added column. Nothing here is comparable with any earlier section, on this ground as well as the session rule |
| **Free disk** | **15 GB at start, 13 GB at end.** `target/` had filled the volume earlier in the session and was cleaned before this run |
| **Excluded** | macOS · Linux · Edge · 5 GB · frame time · picking latency · precision · VRAM · anything cold · any percentile |

**The acceptance run and the tree it describes.** Everything in the table below was observed at
`9c63c84`.

`f6f7034` follows it and closes three defects the run itself found. **It changes no product code** —
the diff is two test files, one instrument, and one `#[cfg(test)]` module — so the artifacts
described here are unchanged by it. That is a code fact read from the diff, not a re-run.

**Later commits do change product code, and that is re-verified rather than argued.** Closing the
write-up review, and then a correction pass, made the viewer's manifest reader **strictly conformant
with ADR-017 §§3/5/14** — exact key sets on every object the document defines, `bytes` and `rows` as
mandatory non-negative integers on partition entries, `rows` forbidden on viewer assets, the version
gate ahead of the key check — and removed a silent unit-square fallback when a bundle declares no
bounds.

**A stricter reader can reject the very manifests this section reports as accepted**, which is not a
risk that can be reasoned away. So the 100k bundle was republished and re-driven at the correction
tree, and this time the run has its own artifact rather than being described:

> `target/acceptance/viewer-correction-pass.json` — served manifest
> `sha256:3e7f9f84…`, browser `Chrome/151.0.7922.76`, verdict `rendered-and-hover-resolved`:
> **51/51 partitions verified · 100 000 features drawn**, no banner, all four legend rows, **67 of
> 256** hover probes resolving. Same counts as the acceptance run, down to the same sampled ids.
>
> The product redaction scanner, re-run over that bundle: **56 files, 44 601 149 bytes, 0 findings**,
> with the machine's real username and hostname both available and both scanned for.

**An earlier draft of this paragraph quoted an artifact from the *previous* tree** — the write-up
review's bundle, not the correction pass's — while quoting a size figure from the correction pass's.
That is the same defect the driver's own manifest-hash binding exists to prevent, committed in prose
instead of in code. Both figures above now come from one bundle, and the artifact names the manifest
hash that identifies it.

**What moved, exactly:**

| | acceptance run | correction pass | delta |
|---|---|---|---|
| `viewer/app.js` | 427 155 B | 437 588 B | **+10 433** — the reader's conformance checks |
| `build-info.json` | 394 B | 395 B | +1 — a wall-clock digit, in the file §12 excludes |
| **bundle total** | 44 590 715 B | 44 601 149 B | **+10 434** |

**Every other figure in this section is the acceptance run's and was not re-taken**, and that is
stated rather than implied: the build wall times below are from the acceptance run's publishes and a
republish necessarily produces different ones; the partition sizes, row counts, hashes and
determinism comparison are unchanged because no partition byte changed. Saying "every other figure is
unchanged" — as an earlier draft did — would have claimed a re-measurement that did not happen.

The writer is held to the same contract from its own side by
`kernel/tests/publish.rs::the_emitted_manifest_has_exactly_the_key_sets_adr_017_declares`. **Both
tests read one shared artifact, `renderer/tests/data/manifest-key-sets.json`, and neither generates
it** — the discipline `style-agreement.json` already applies to style resolution. That matters
because two hand-maintained tables, each with its own test, guarantee only that neither side moves
without *its own* test failing: editing the reader and its table keeps the JS suite green while every
real bundle becomes unreadable. Anchoring both to one artifact is what makes "writer and reader
agree" a checked property rather than a hope.

---

## What the run established

| Checklist item | Outcome | What was actually observed |
|---|---|---|
| **Publish the 100k fixture, serve it, visibly styled result with legend and hover** | **met** | `51/51 partitions verified · 100000 features drawn`, no failure banner. All four legend rows present, including both fallbacks. 67 of 256 hover grid probes resolved to a stable id and its attributes |
| **Style actually applied** | **met, and checked in pixels rather than in text** | Canvas read back with `getImageData`: after zooming, the four declared fills are the four dominant colours at **exact L1 distance 0** from the style document (`#cfc9bd`, `#7a7a7a`, `#c2553f`, `#3f5fc2`) |
| **Publishing twice → byte-identical manifest and identical hashes** | **met** | `manifest.json` byte-identical (16 020 B), **all 51 partitions byte-identical**, `style.json` and both viewer assets identical. `diff -r` over the two bundles reports **exactly one** differing file: `build-info.json`, the non-hashed sidecar, excluded by design |
| **Corrupting a partition → named failure state** | **met** | Bytes flipped in place, length preserved → `asset-hash-mismatch`, banner naming the asset and both hashes, loading stopped at `25/51` with 25 partitions still drawn beneath it |
| **Corrupting a manifest entry → named failure state** | **met** | One recorded `content_hash` altered by one hex digit, manifest length unchanged → `asset-hash-mismatch` at `7/51`. **This is the case only re-hashing can detect**, which is why the viewer re-hashes |
| *(beyond the checklist)* **Truncated partition** | **met** | → `partition-byte-count-mismatch`, a *different* named state, at `3/51` |
| **Cancelling mid-publish leaves no partial bundle** | **met** | With a genuine `CTRL_C_EVENT` at **3, 25 and 51 partitions already on disk**: all three runs reported cancelling, exited non-zero, and left **nothing under the final name, no staging directory, and nothing matching `*staging*` anywhere under `target/`** |
| **Redaction grep passes on the emitted bundle** | **met** | The **product scanner**, run over the 100k bundle: **56 files, 44 590 715 bytes, 0 findings**. The machine's real username and hostname were both available and both scanned for, so this is not a silent gap. A planted-path control fired |
| **Attribution/license and grade present with stated basis** | **met** | `license: {state: "not-declared", basis: …}` — nothing invented. `reproducibility: {grade: "Snapshot"}` with a four-item basis and a `why_not_higher` naming what Exact would require |
| **Ordinary workspace suite green** | **met** | At the acceptance run: `cargo test --workspace` **249 passed, 0 failed, 2 ignored** (the two measurement harnesses, ignored by design), viewer **33 tests**. **At the correction tree the same suites are 251 / 0 / 2 and 42** — the counts moved because the correction pass added tests, not because anything changed underneath, and this row gives both rather than a figure no tree produces |
| **Viewer build reproducible** | **met, three ways** | Rebuild in place → identical; `rm -rf dist` then rebuild → identical; **whole source tree copied to a different absolute path and built there → `dist/app.js` and `dist/index.html` byte-identical**. No absolute path leaks into the output |

### Attribute alignment — the check that mattered most

The concern was that a partition's attribute column could be misaligned against its geometry by a row
or two: every length would still match, the batch constructor's length check would still pass, and
the result would be **the right feature wearing its neighbour's attributes**, with nothing raised.
That is the ADR-010 rule 2 failure class arriving one level up.

It was not spot-checked. **All 51 partitions were decoded and all 100 000 `(id, zone)` pairs compared
against an independent transcription of the generator's oracle**, itself validated against the
generator's own printed counts before being used as an oracle.

**100 000 features decoded · 100 000 distinct ids · strictly ascending across partitions · 51/51
partitions verifying their manifest hash and byte count · published zone counts identical to the
generator's · 0 mismatches.** Decoded vertex count matched the fixture exactly and decoded bounds
matched the manifest's to three decimal places.

## Facts, with no budget and no distribution

The brief attaches no budget to either quantity. These are **individual observations from named
runs**, printed as such rather than aggregated — there is no p50, no p95, and nothing to compare them
with.

| | |
|---|---|
| Bundle total | **44 590 715 B** |
| `data/` — 51 partitions | 44 141 400 B |
| Partition size range | 120 840 – 880 712 B |
| `manifest.json` | 16 020 B |
| `viewer/app.js` · `viewer/index.html` | 427 155 B · 5 419 B |
| `style.json` · `build-info.json` | 327 B · 394 B |
| Rows / partitions | 100 000 / 51 |
| Source fixture | 39 049 894 B |
| **Build wall time**, individual observations | 641.8, 617.3, 624.9, 712.3 ms. Separately, 770.3 and 759.6 ms in two publishes running concurrently — **the two conditions are recorded, and no comparison between them is claimed or implied** |
| **Content-hash time**, individual observations | 149.6, 151.0, 150.2, 166.7 ms |

## Three defects the run found, all of which reported something confidently false

Recorded because each is the class of thing that invalidates a pass rather than failing one — and two
of the three were in this cut's own instruments, which is exactly where they are hardest to notice.

**1. The acceptance driver did not bind a run to the bundle it tested.** Its first use reported
`rendered-and-hover-resolved` with "2/2 partitions verified · 3000 features drawn" — against a bundle
with 51 partitions and 100 000 features. The intended server had died with `EADDRINUSE` and **a
leftover server from an earlier session was answering on that port with a different bundle**. Nothing
in the artifact distinguished that from a correct run; the URL was all it recorded. Fixed in
`f6f7034`: the driver fetches `manifest.json` itself, records its SHA-256 in every artifact, and
refuses when `--expect-manifest-hash` does not match.

**That fix is *not* what protected the runs reported above, and saying otherwise would repeat the
defect's own lesson.** `--expect-manifest-hash` does not exist at `9c63c84`. What protected them was
an **out-of-band** check: before each reported run the tester compared the SHA-256 of the served
`manifest.json` against the bundle on disk by hand. In-driver enforcement landed afterwards, so a
future run gets the guarantee without anyone having to remember.

**2. The shared style vector could declare zero probes and both languages would still report
green.** `renderer/tests/data/style-agreement.json` exists so the Rust compiler and the TypeScript
viewer agree on what a style *means*; every resolution assertion on both sides sits inside
`for probe in probes`. Emptying the array leaves both tests passing while resolving **nothing**, and
the cross-implementation agreement would then rest on constants hardcoded separately in each language
— the exact failure the vector was written to prevent. Found by mutation. Both sides now assert the
vector is non-empty.

**3. `kill -INT` never cancelled anything, and the first cancellation attempt was a false pass.**
Sending `SIGINT` from a POSIX-emulating shell to a native Windows process does not become a console
control event: the publish **ran to completion and wrote a full valid bundle** while the shell
reported 130. A second attempt through `GenerateConsoleCtrlEvent` also failed, because **a process
created in a new process group inherits a NULL handler that disables CTRL+C** — the API reported
success and the child ignored it. Only after `SetConsoleCtrlHandler(NULL, FALSE)` before the spawn
did a real `CTRL_C_EVENT` arrive. Had the tester not checked stderr for the operation's own
"cancelling" line, all three attempts would have been recorded as passes. **The cancellation result
above rests on the third harness only.**

A fourth, cosmetic: one test name claimed two properties it did not check. Renamed; it now checks one
of them and states why the other is a property of the signature rather than pretending to exercise it.

## What is **not** established, and is not claimed

| | |
|---|---|
| **The hero slice is not complete** | `docs/07`'s Prototype names **a 5 GB GeoParquet**. This is validated at 100 000 features / 39 MB. The slice's second half is implemented and correct at that scale; **the slice is not complete**, and the word "complete" does not apply to it without that qualifier |
| **DuckDB-WASM in-browser queryability** | Deferred to v1 by the human's decision. ADR-008's Consequences clause on it is **unmet**; only the manifest surface is reserved |
| **ADR-008's other Consequences clause** | *"The web publishing canvas (ADR-003) renders these bundles"* is **also unmet**: this viewer is a projected 2D canvas — not MapLibre, not deck.gl. **Both** of ADR-008's stated consequences are outstanding |
| **The projected publishing canvas is provisional** | Pending the human's approval of the drafted, unapplied ADR-003 amendment proposal. It is a **third** canvas — deliberately distinct from ADR-003's deck.gl projected *working* canvas, which it shares a coordinate discipline with and nothing else. Nothing here is evidence for or against deck.gl: this is a 2D canvas, and it measures nothing |
| **Canvas selection is unimplemented, and v1 does not choose** | Every bundle uses the projected source-CRS viewer, always; the MapLibre branch does not exist. The amendment proposal states that any future selection must be explicit and rest on a declared supported-CRS contract with a definitional-equivalence check — **never inferred from a CRS identifier string** -- `docs/05` decides CRS identity by comparing normalized definitions and never by name comparison, and ADR-015 §7's closing clause licenses no later code to assume a matching identifier means the definitions agree. Inferring would route a mislabelled source to the wrong canvas and draw it in the wrong place, silently |
| **Any performance property whatsoever** | No frame time, no picking latency, no precision measurement, no throughput. The viewer's hashing cost is **not** measured and may never be quoted as a rendering figure. The ordered publish path may never be cited about first pixels |
| **The cancellation *cadence*** | Cancellation was proved to land cleanly at three points during partition writing. The **uninterruptible window was not measured**, and the partition-size bound that is meant to make it a bound rather than a hope is unverified here |
| **Network blocking was partial, and exactly this much** | DNS blackholing plus a full CDP request log: **56 requests, all 56 to `127.0.0.1`**, zero elsewhere, zero failures. **A request to a literal external IP would still have gone out**, and no OS-level firewall rule was applied. The separate static scan of the built bundle found zero absolute URLs, zero protocol-relative URLs, and no `crypto.subtle` |
| **The opening view of a 100k bundle is a dark mesh, not a categorical map** | At fit-to-bounds each parcel is ~3.8 px and the fills do not appear among the canvas's dominant colours at all. That is 100 000 parcels on a 1280×900 canvas rather than a defect — but "visibly styled" was confirmed **after zooming**, and saying otherwise would overstate it |
| **The viewer cannot verify its own executing code** | The manifest's viewer-asset hashes are for an **external** verifier. They were checked externally and match; the chain does not close in-page |
| **Identity stability across reopen** | Unestablished, as the manifest's own caveat says. A bundle persists identity while that question is open, and records what it does and does not know |
| **The redaction scan is a necessary condition only** | 0 findings means the named classes are absent, not that the bundle carries nothing sensitive. Its 12-byte printable-run threshold means a short path, or one surrounded by non-printable bytes, is not reported |
| **The class-3 approval gate** | `docs/09` requires approval for publish. There is none. Declared in the operation's API, in ADR-017 and here — **owed and absent** |
| **The viewer build's byte-identity is established on this machine only** | `npm ci` warned that esbuild's postinstall was skipped. The build and all 33 tests worked — the platform binary arrives through an optional dependency rather than that script — so the three-way identity result stands **here**. Whether it holds on a machine where that optional package resolves differently is **unestablished** |
| **No CRS oracle was consulted, and none was owed** | Nothing in this cut reprojects, so there was no transform to validate against PROJ or PostGIS. The CRS travels as an opaque tag and `transform: none — rendered in source CRS` is the recorded fact. Stated because a repository whose first principle makes CRS a type should not leave a reader wondering whether it was checked |
| **macOS · Linux · Edge · cold anything · between-session anything** | Out of scope, on the same grounds as every section above |

## The three `docs/07` gates are untouched

macOS/Linux hardware validation; the transport bake-off and server-side spatial indexing; ADR-009.
**All three remain open**, and nothing in this cut advanced or closed any of them. ADR-009 is not
*triggered* by publishing a bundle to a directory — but viewer code embedded in a distributed bundle
is distributed code, and its licensing is ADR-009's question.

## Reproducing this

```bash
git checkout cut/style-publish            # 9c63c84 for the run above; f6f7034 adds only test fixes

CARGO_PROFILE_RELEASE_DEBUG=false cargo build --release --workspace
(cd renderer/bundle-viewer && npm ci && npm run verify)

# 1. the fixture: the generator's DEFAULT polygon spec (12-48 vertices per feature) plus the
#    nullable categorical column. This is NOT docs/08's Polygons class, which is 10M vertices.
cargo run --release -p spatial-engine --features fixture --example make-fixture -- \
    --out target/acceptance/parcels-100k.parquet --features 100000 --attributes zone

# 2. publish twice, to two destinations, from identical inputs
cargo run --release -p spatial-kernel --bin publish-bundle -- \
    --data target/acceptance/parcels-100k.parquet --style <style.json> \
    --viewer renderer/bundle-viewer/dist --out target/acceptance/bundle-a \
    --name parcels --attributes zone
#   …and again to bundle-b. Only build-info.json may differ.

# 3. serve and drive. --expect-manifest-hash is what stops a stale server passing quietly.
node renderer/bundle-viewer/scripts/serve-bundle.mjs target/acceptance/bundle-a 8842
node renderer/bundle-viewer/scripts/run-acceptance.mjs \
    --url http://127.0.0.1:8842/viewer/index.html \
    --expect-manifest-hash sha256:<manifest hash> \
    --out target/acceptance/viewer-ok.json

# 4. the corruption cases, each into its own copy of the bundle, then the same driver with
#    --expect-failure asset-hash-mismatch (and partition-byte-count-mismatch for a truncation)

# 5. the suites
cargo test --workspace                                   # 249 passed, 0 failed, 2 ignored
(cd renderer/bundle-viewer && npm test)                  # 33 passed
```

> **This recipe no longer runs unmodified on HEAD, as of 2026-08-07 — and it is left as written
> because it is the recipe for the run recorded above, not a maintained script.** ADR-017
> **Corrigendum 3** made five `publish-bundle` arguments required, so step 2 now needs them appended:
>
> ```sh
>     --viewer-program "Spatial IDE bundle viewer" \
>     --viewer-copyright "Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors" \
>     --viewer-license AGPL-3.0-or-later \
>     --viewer-notice NOTICE.txt \
>     --corresponding-source-url https://<the public repository URL>
> ```
>
> `NOTICE.txt` is generated into `renderer/bundle-viewer/dist/` by `npm run verify` in step 0, so it
> is present wherever `--viewer` points. **The numbers above are unaffected**: they were taken on
> the tree at `9c63c84` and describe it. Re-running on HEAD would be a different measurement of a
> different tree and is not performed here.

**Cancellation needs a real `CTRL_C_EVENT`.** `kill -INT` from a POSIX-emulating shell will let the
publish run to completion and then report success; see defect 3 above, including the
`SetConsoleCtrlHandler(NULL, FALSE)` detail without which `GenerateConsoleCtrlEvent` reports success
and delivers nothing.

### Instruments (committed)

| File | Role |
|---|---|
| `renderer/bundle-viewer/scripts/run-acceptance.mjs` | headless browser driver; writes a JSON artifact, binds the run to a manifest hash, exits non-zero on a wrong or missing outcome |
| `renderer/bundle-viewer/scripts/serve-bundle.mjs` | a deliberately ordinary static file server, path-contained and loopback-only |
| `renderer/bundle-viewer/scripts/boundaries.test.mjs` | scans the **built** bundle for absolute URLs and `crypto.subtle`, and `renderer/` for any reference to the probe |
| `kernel/src/bundle/redaction.rs` | the `docs/09` scan, run over the emitted bundle rather than believed about it |

## Post-run note — 2026-08-06 — the provisional canvas decision was resolved

*Appended after the run. **Nothing above this heading is edited**: every number, every defect and
every "not established" row is the record as the run left it, including the rows that describe the
canvas decision as provisional. This note says what changed **afterwards**, and changes no evidence.*

The row above reading *"The projected publishing canvas is provisional — pending the human's
approval of the drafted, unapplied ADR-003 amendment proposal"* described the state at run time. The
human approved the amendment on **2026-08-06** after a correction pass, and it is now appended to
ADR-003 as *Amendment (2026-08-06) — the projected publishing canvas*; the proposal file is retained
as the decision record rather than as pending work. **The projected publishing canvas is therefore
decided, not provisional.** ADR-017 was accepted the same day, carrying the human's acceptance
condition on the class-3 gate.

**What that does and does not change about this section:**

- **It changes no measurement, because this run produced none of the kind at issue.** The canvas
  decision was always an architectural question; this section's own scope line says the run measures
  nothing, and approving an amendment cannot retroactively make it evidence. Every "not established"
  row still stands as written.
- **The neighbouring rows are still true.** Canvas selection is still unimplemented and v1 still uses
  the projected source-CRS viewer always, with the MapLibre branch absent — the amendment *decides*
  that architecture rather than implementing it, and says so itself. ADR-008's two stated
  Consequences are still both unmet, which ADR-008's own appended clarification (2026-08-06) now
  records from its side.
- **The class-3 approval gate is still owed and absent.** Nothing in the amendment or in ADR-017's
  acceptance discharges it; ADR-017's acceptance condition sets its deadline and does not close it.
- **The three `docs/07` gates above are still open.** The gate text for the transport bake-off and
  server-side spatial indexing was corrected on 2026-08-06 — it had claimed producer-side
  cancellation and indexing were wholly undesigned, when cancellation is implemented and asserted
  end-to-end and an index exists but is deliberately disabled on this section's own measured finding.
  **That is a correction to how the gate was described, not a gate closing**, and the finding it
  rests on is the one recorded in this file's second section, unchanged.
