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
