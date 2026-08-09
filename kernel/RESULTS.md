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
> is present wherever `--viewer` points.
>
> **And as of 2026-08-07 the publish is gated** (ADR-006 class 3; `kernel/PERMISSION-BOUNDARY.md`).
> Step 2 either prompts for the destination's name on stdin, or takes it as a flag — which is what a
> scripted run wants:
>
> ```sh
>     --approve bundle-a          # …and `--approve bundle-b` for the second publish
> ```
>
> The argument must equal the destination's final path component, so the two publishes take
> **different** values; that is the point of a named confirmation rather than a `--yes`. Each run
> also appends two records to the per-user audit log, or to wherever `SPATIAL_IDE_AUDIT_LOG` points.
>
> **The numbers above are unaffected**: they were taken on the tree at `9c63c84` and describe it.
> Re-running on HEAD would be a different measurement of a different tree and is not performed here.

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

---

## Post-run note — 2026-08-07 — the class-3 gate exists; nothing above is edited

**Nothing above this line is changed**, including the 2026-08-06 note whose bullet reads *"The
class-3 approval gate is still owed and absent."* That was true when written and is the record of
what was true then; it is answered here rather than rewritten, on the same discipline this file's
earlier post-run note declares for itself.

**ADR-006's class-3 row is now discharged for publish.** A scoped, expiring grant; an explicit
approval that names the destination; and a two-phase append-only redacted audit record all exist in
`kernel/src/permission/`, and an unauditable publish refuses. The design, its declared properties
and ten findings flagged for the custodian are in `kernel/PERMISSION-BOUNDARY.md`; ADR-017 carries a
dated progress note recording the same thing against its acceptance condition.

**This changes no measurement in this file, and produces none.** The gate is a correctness change
with no measurement campaign behind it: no number here moves, no budget is touched, and the two
`docs/08` harnesses are untouched and still `#[ignore]`d. The one operational consequence for
re-running anything in this file is that `publish-bundle` now requires an approval — the
reproduction recipe above carries the `--approve` caveat.

**One size figure is recorded, and it is a size rather than a budget.** A record pair measured from
this repository's own boundary tests is **1 053 bytes** for a successful publish (555 intent + 498
outcome, newlines included) and 915 bytes for a refused attempt. That is the basis for the retention
arithmetic in `kernel/PERMISSION-BOUNDARY.md` — ~7 900 publishes per 8 MiB generation, ~39 000 across
the five retained files. It is not a `docs/08` measurement, has no budget attached, and implies no
comparison with anything.

---

# Fifth section — 2026-08-07, the 5 GB scale pass

**Everything above this line describes earlier trees and earlier sessions and is left exactly as it
was.** Nothing below is compared with anything above it. Where a figure from an earlier section is
mentioned at all — the 145 MB and 39 MB fixture sizes, and the data-plane memory readings of the
first three sections (1,354,016 B in the first; ~1.73 MB in the second and third) — it is mentioned
**only** to say what it is *not* a baseline for here.

*(The brief that commissioned this cut called for "a dated fourth section". The file already had
four, the last being the 2026-08-06 style-and-publish correctness pass, so this is the fifth. The
numbering is the file's, not the brief's.)*

Governed by `kernel/SCALE-PASS-PREREGISTRATION.md`, committed in `30985fb` **before the fixture
existed, before the instruments existed, and before any result of this pass had been looked at**.
Six amendments are appended to its §10. **Four were made after results were seen and each says so in
its first line**; the file's own header makes such an amendment invalidate the run, and that is what
happened twice — attempts 1 and 2 are invalidated and reported below beside the run of record rather
than discarded.

`docs/07`'s hero slice names **5 GB**. The largest file this repository had measured was **145 MB**
(the third section's; the fourth section's is 39 MB). This pass
measures the existing engine — **ScanOnly, no index** — at the declared scale, and validates publish
through the class-3 permission boundary at that scale.

## Scope carried by every number below

| | |
|---|---|
| **Hardware** | Intel Core i9-9980HK @ 2.40 GHz · 8 cores / 16 threads · 63.7 GiB RAM · Windows 10 Pro 22H2 build 19045 · **SSD** |
| **Build** | `release`; the in-process harnesses refuse to run under `debug_assertions`, and `time-open` refuses as well |
| **Tree** | branch `cut/scale-pass`. Streaming run of record: source pin `e10046c009c9aa7993907a540d2de3e3` over 84 files. The publish run of record's tree differs from it in **exactly one file**, `kernel/tests/scale_pass.rs` — the A5 amendment — verified file-by-file rather than asserted. **The publish run has no pin artifact of its own**: see the pin gaps below |
| **Fixture** | generated **after** the preregistration was committed; `sha256:5ae955c5…c1788`, **5,004,376,705 B**, 3,300,000 features, 345,507,850 vertices, 3,771,429 rings, seed `0x5EED_2056_0000_0005`; `row_group_rows` **8,192**, from which 403 row groups follow arithmetically but were **never read back** (see the fixture table). Gitignored, so the hash is what says what was measured |
| **In-session control** | 100,000 features / 10,493,122 vertices / 151,987,739 B, generated by the **same binary in the same session with the same `row_group_rows`** — the second point the flatness statement needs |
| **Excluded** | macOS/Linux · WASM · MapLibre · index v2 (this cut produces its baseline-to-beat) · **any browser or viewer measurement at this scale** (§8, and finding 2) · any throughput figure · **any between-session comparison** |

**Declared confound, recorded before generation:** this fixture is written at `row_group_rows` 8,192
and so has **~403 row groups** — a derived figure, not a measured one — where every
earlier fixture in this file had one, so DuckDB may prune on `bbox` statistics in ways it never
could before. No number here is compared with any earlier section in any case, and the in-session
control shares the row-group setting, so the two-point memory comparison is not confounded by file
structure.

## Every attempt, and the invalidator each fired

**Not one attempt is discarded.** §7 requires an invalidated attempt to be recorded with its
invalidator named, and all of them are retained under `target/slice-evidence/scale-pass/`.

| Attempt | What it was | Verdict |
|---|---|---|
| 1 | full streaming half | **invalidated** — canary spread 0.1194 against the declared 0.10. The `start` canary at 114.174 ms was the outlier, taken seconds after a 12-minute clean build and a 328-test gate; the five points bracketing actually-measured phases spread 9.4 %. Amendment **A3** added a 120 s settle and a recorded, deliberately excluded pre-settle reading |
| 2 | full streaming half | **invalidated** — the harness computed a **global** min/max across the whole pass, stricter than §6's registered per-phase scope. Amendment **A4** corrected the scope toward the registered text; the bound stayed 10 %. Every phase carrying a `docs/08` row was inside it |
| 3 (streaming) | **run of record** | canary per phase **6.31 / 1.01 / 3.29 / 3.30 / 6.05 %**, all inside 10 %. A4's generation exemption is recorded in the artifact as available but **did not have to be used** — every phase passed on its own |
| 3 (publish, pre-A5) | publish half | **superseded, and reported** — its canary exceeded on a rule A5 then corrected. Its numbers stand below beside the re-run |
| 3 (publish, A5) | **run of record** | re-run under the amended instrument; **every correctness outcome reproduced** |
| A6 (additive) | registered items that had no instrument — four found by validation, a fifth found while building it | **new phases, later session, own pins** — see below. Invalidates nothing; re-measures nothing |

**A4, A5 and A6 are all shaped like exemptions or extensions, and all deserve the scrutiny that
invites.** A4 narrowed the canary from a global test to the per-phase one §6 registered before any
instrument existed. A5 stated the rule once and generally: *the canary gates a phase whose output is
a timing number used against a budget or in a comparison; it does not gate a phase whose output is a
correctness claim.* **A hot CPU cannot make two SHA-256 values agree.** Every phase carrying a timing
claim stayed gated at the unchanged 10 % and all five passed. A6 is the opposite shape — it adds
work rather than excusing it.

## The fixture: predicted before generation, measured after

| Quantity | Predicted (§1b) | Actual | |
|---|---|---|---|
| vertices | 345,414,000 ± 0.1 % | **345,507,850** | +0.027 %, inside |
| rings | 3,771,429 exactly | **3,771,429** | exact |
| bytes | 5.01 GB, band 4.76–5.26 | **5,004,376,705** | −0.1 %, inside |
| row groups | 403 | **not measured** | derived from `row_group_rows`; see below |
| **quarter viewport rows** | **826,281 exactly** | **826,281** | **exact** |
| **1/64 viewport rows** | **51,984 exactly** | **51,984** | **exact** |
| partitions | 6,633, band 6,550–6,750 | **6,636** | inside |
| bundle `data/` | ≈5.74 GB | **5,737,397,728 B** | inside |
| `manifest.json` | 1.3–2.0 MB | **997,532 B** | **below the band** |

**Two rows in that table are not clean, and both are listed rather than dropped.** The
**`manifest.json` prediction missed low** — 997,532 B against a predicted 1.3–2.0 MB, i.e. ~150 B per
entry rather than the 200–300 B §1b assumed. Nothing rests on it; it is a size with no budget, and it
is reported because every other §1b row is.

**The row-group count was never measured.** §1c registers a `fixture-facts.json` carrying "the
row-group count read back from the parquet footer"; **that artifact does not exist**, and
`scale-pass.json` carries only `predicted_row_groups: 403`. The harness never re-reads the footer.
403 = ⌈3,300,000 / 8,192⌉ follows from `row_group_rows`, so it is almost certainly right — but it is
**derived, not verified**, and the "403 row groups" confound declared below rests on the same
derivation.

**The two exact row counts are the strongest instrument check in this cut**, and both hit. They are
pure arithmetic over the generator's grid, so a mismatch would have meant the filter, the generator
or the CRS admission was wrong — §7 makes that an instrument failure that stops the pass, and it did
not fire. Amendment **A1** had already moved the 1/64 edge to a cell centre before the fixture
existed, after the reviewer replayed the generator and showed the old edge returned 51,953.

**The brief's partition estimate was wrong by 3.2×** and the preregistration said so before
generation: ~2,050 in the brief against 6,633 predicted and 6,636 measured. At 6,636 the determinism
row exercises **6.6 % of `MAX_PUBLISH_PARTITIONS`**, and ADR-017 §1's five-digit partition-name width
holds.

**Generation is a fact with no budget**, per §8's no-throughput rule: 5,004,376,705 B written in
**51,927.6 ms**, and the two numbers are deliberately not divided. The control: 151,987,739 B in
1,528.3 ms.

**The generator is deterministic under its seed** — attempts 1 and 2 produced the identical
`sha256:5ae955c5…c1788` from independent generations. §1c assumed that; nothing had established it.

## Results

| Row | Gate | Result | Verdict |
|---|---|---|---|
| **Cold open of the 5 GB file** | **< 5 s (`docs/08`)** | **181.267 / 146.681 / 146.679 ms**, one per boot, never pooled. Verdict on the **maximum**: **181.267 ms** | **met**, by 27× — **and it is the only budget row in this table with no canary evidence** (see below) |
| Warm open + identity uniqueness scan | report | open p50 **131.267 ms** (n=6); prelude-only p50 **25.982 ms** (n=6); the scan is **105.584 / 104.988 ms** by the two orderings | reported |
| Whole-file stream: first batch · total | report | first batch p50 **72.175** / p95 **84.831** ms; total p50 **15,488** / p95 **15,734** ms; 3,300,000 rows in 6,637 batches (n=5) | reported |
| Quarter viewport (ScanOnly) | report — index v2's baseline | first batch p50 **94.943** / p95 **105.051** ms; total p50 **5,665** / p95 **5,911** ms; **826,281 rows** in 1,663 batches (n=7) | reported |
| 1/64 viewport (ScanOnly) | report — index v2's baseline | first batch p50 **256.684** / p95 **273.053** ms; total p50 **454.051** / p95 **482.032** ms; **51,984 rows** in 107 batches (n=7) | reported |
| **Cancellation mid-stream at scale** | **< 100 ms** | acknowledgement p50 **16.007** / p95 **40.670** / max **40.670** ms (n=7); **0 batches after cancel** in every trial | **met** |
| Publish 5 GB through grant → approval → audit | **completes** · **cancellable** · audit correct | A **98,983 ms**, B **106,492 ms**; audit 2 intent + 2 outcome, key sets as emitted. Cancellation measured under A6: **21 of 21** cancelled publishes left **nothing** on disk and were audited with a terminal cancellation record | **completes: met** · **audit: met** · **cancellable: see the next row** |
| **Publish cancellation latency** (A6) | **< 100 ms** | `VerifyingSource` p50 **13.700** ms (n=7); the **sort window 3,920.251 ms** (**n=1**); `WritingPartitions` p50 **25.475** / p95 **418.321** ms (n=7). Inter-partition cadence p50 **8.573** / p95 **10.836** / **max 999.924** ms | **MISSED** — `WritingPartitions` p95 established at n=7; the sort window **recorded, not established** at n=1 |
| **Producer-resident memory vs declared bound** (A6) | **bound holds** | `peak_resident_bytes` **2,095,440 B** at 5 GB and **2,095,440 B** at 145 MB — **byte-identical**, ratio 1.0000 — against the engine-queue bound of **12,582,912 B**: **16.65 %** | **met**; flat **with respect to row count at constant per-row shape** — see the caveats below |
| **Publish determinism at scale** | **byte-identical manifest + all partitions** | manifest `sha256:768f6908…d37c` identical across two destinations; **6,636 / 6,636 partitions byte-identical** | **met** |
| Strict-reader verification | all partitions verified | 6,636 partitions, 3,300,000 rows, 5,737,397,728 B, 2 viewer assets. **29,384.239 ms** by the reader's own clock (`verify-summary.json`); 29,401 ms by the harness's outer timing | **met** |

**One budget is missed and it is the cancellation one**, in publish only; every other gate in this
table is met. **Two rows are scored against the same 100 ms budget and are not scored against each
other**: stream cancellation met it at 40.670 ms max, publish cancellation missed it. They come from
different sessions and different builds, so the budget is what they share — not a comparison.
Details, and the mechanism behind the publish latency, are in the A6 section below.

**Every correctness outcome reproduced across the pre-A5 and A5 publish runs** — same manifest hash
`sha256:768f6908…d37c`, same 6,636 byte-identical partitions, same audit shape. That reproduction is
the claim, and it is a **correctness** claim: hash equality, which no amount of machine drift can
fake.

**The two runs' wall times are reported separately and are deliberately not compared.** Pre-A5:
A 98,722 ms, B 107,320 ms, strict reader 28,215 ms. A5 re-run: A 98,983 ms, B 106,492 ms, strict
reader 29,401 ms. §5b makes publish wall time "a fact with no budget", and **the publish run of
record's own canary exceeded the declared bound** — `publish-start` → `after-publish-a` spread
**11.64 %**, recorded in `scale-publish.json` as `within_declared: false` (the pre-A5 run recorded
12.12 %). A5's rule is that the canary gates a phase whose output is a timing number used against a
budget **or in a comparison**; so by that rule these wall times may be reported as individual facts
and **may not be differenced**, and this write-up does not difference them. The excursion itself is
the machine behaving as expected under ~99 s of a ~7 GB DuckDB sort, 6,636 Arrow IPC encodes and
5.7 GB of writes — recorded, not used to discard the determinism result, which is true regardless.

## The cold-open row, in the detail the protocol demands

**Three reboots are three sessions**, so the three samples are **never pooled**: each is reported
with its own boot's evidence and compared only against a warm control taken **in the same boot**.

| Boot | Cold | Warm min, same boot | Ratio | Device read during the open | Boot type |
|---|---|---|---|---|---|
| 1 | **181.267 ms** | 137.532 ms | 1.32× | 66.93 MB | **0x0 — full boot** |
| 2 | **146.681 ms** | 135.482 ms | 1.08× | 34.86 MB | **0x0 — full boot** |
| 3 | **146.679 ms** | 134.318 ms | 1.09× | 34.89 MB | **0x0 — full boot** |

Quiet gate, all three: CPU mean 2.10 / 1.63 / 1.60 % (declared < 5), max 6 / 13 / 16 % (< 25), settle
disk 4.31 / 13.02 / 19.72 MB (< 50), no build process, free disk 104.6 / 105.96 / 105.93 GiB (≥ 20).
Uptime at record 0.88 / 0.61 / 0.60 min against the 20-minute refusal. `protocol_modified: false` in
all three — no lenience flag was used. `time-open.exe` hashed `52f766ff…aa36` in every boot and equals
the binary pin.

### The Restart is confirmed by the OS, not asserted by the script

§7 makes `HiberbootEnabled = 1 with no confirmed Restart` an invalidator, and all three boots record
`hiberboot_enabled: 1`. **`cold-open.ps1` only warns about it** — it records no boot-type evidence, so
the artifacts alone cannot discharge the invalidator it arms.

The System event log can, and does. `Microsoft-Windows-Kernel-Boot` **event 27** reports **"boot type
0x0" — a full boot** — at 16:47:22, 16:52:19 and 16:57:18, each within a second of the `boot_time` its
artifact records. A Fast Startup resume is 0x1 and a hibernation resume is 0x2; neither appears. A
clean `6006` + `109` shutdown-transition pair precedes **each** of the three, and `id 1074` — *"has
initiated the restart of computer … on behalf of user"* — is present for cycles 2 and 3 and
**absent for cycle 1**. That asymmetry is recorded rather than smoothed over: 1074 is written by
user32 on an interactive shutdown and can be missed when the initiating session is already tearing
down, and the property that decides "cold" is the **boot** type, not how the shutdown was started.
No `6008` and no `41`: no unexpected shutdown. `LastBootUpTime` still reads boot 3, so nothing has
rebooted since. Recorded in
`cold-open/boot-evidence-external.json`, taken **after** the samples and labelled as post-hoc
verification of an invalidator rather than as a measurement — **and itself amended once**, at 18:29,
when review found it had recorded only cycle 1's shutdown pair while the prose above described all
three. Eight corroborating records were added and the file carries an `amended_at` saying so. No boot
type, boot time, sample or verdict changed; evidence is held to the same disclosure standard as this
pass's prose amendments, not a looser one.

**Fast Startup was on and it did not matter, because the operator used Restart.** That is the protocol
working — but it was established by reading the OS afterwards, not by the instrument.

### What the row actually measures, and why the ratios are small

§4d stated this in advance: `Dataset::open` at 5 GB reads the parquet footer plus **one column** — the
`id` column, for ADR-016's `count(DISTINCT)` — not 5 GB. **So the budget is nearly independent of the
other 4.95 GB.**

Predicted device read **30–60 MB**; measured 34.86 and 34.89 MB — and **66.93 MB on boot 1, outside
the predicted band**, on the very boot that supplies the verdict-bearing maximum. The band was
registered before the run and the miss is reported as one. It is also the anomaly the missing
`IOReadBytes` instrument would have resolved: the `_Total` counter is machine-wide, so it cannot say
whether boot 1's extra ~32 MB was the fixture or SysMain and Defender touching the machine's first
post-boot minutes.

The A/B in the row above finishes the explanation: the identity scan is **~105 ms of a ~131 ms warm
open**, so an open is dominated by CPU-bound `DISTINCT` work rather than by IO. ~35 MB off an SSD
overlaps most of that, which is why boots 2 and 3 sit only 8–9 % above their own warm control while
still reading tens of megabytes off the device. §7's ratio invalidator is armed only when there is
**no** disk-read evidence; there is, in all three, far above the declared 5 MB floor.

**Two observations recorded rather than explained away.** Boot 1 read **twice** what boots 2 and 3 read
for the identical operation on the identical file, and was 34 ms slower; the settle-window disk traffic
also rose monotonically across the three boots (4.31 → 13.02 → 19.72 MB), which is what SysMain
progressively prefetching a repeatedly-opened file would look like. SysMain and Defender were left
running by design — §4b: turning either off measures a different machine. And boots 2 and 3's cold
samples agree to **2 µs** (146.681 vs 146.679 ms) while the warm value **137.532 ms** appears in both
boot 1's and boot 2's sample sets. `time-open.rs` is a plain `Instant` around `Dataset::open` formatted
to three decimals, with no quantisation or PRNG that could manufacture either; with 18 samples an exact
collision is an unremarkable birthday-style coincidence, and the 2 µs agreement is the more striking
one. Both are recorded because a reader can check them.

### Two registered elements of this protocol were never instrumented

Named as gaps, because they cannot be repaired: the boots are gone, and re-running would be a
**different session** that could only replace those samples, not fix them.

- **No canary was taken in the cold-open phase.** §4a step 5 names one and A5's own table gates the
  cold row on it. `cold-open.ps1` carries the section heading *"The within-boot warm control, and the
  canary"* and never takes one. So the pass's headline budget row is the one budget row with no canary
  evidence. Its own §4 invalidators all pass; §6's was never applied to it.
- **Process-level `IOReadBytes` was never recorded**, though §4b registers it and calls the gap between
  it and the machine-wide counter *"the cache-hit measure"*. Only the `_Total` PhysicalDisk counter
  exists, which cannot separate the fixture's read from SysMain's or Defender's — which is exactly what
  the boot-1 anomaly above would need in order to be settled rather than noted.

## Streaming, and the numbers index v2 has to beat

**No 100 ms fantasy at 5 GB whole-file, and none was registered.** Whole-file first batch is **72 ms
p50** and the whole file takes **15.5 s** to stream — 3,300,000 rows in 6,637 batches. Those are the
ScanOnly facts that price index v2's gate.

The viewport rows are the baseline proper. Both were planned **`ScanOnly`**, and the artifact records
the engine's own `filter_plan` rather than inferring it. **The 1/64 viewport's first batch (257 ms p50)
is slower than the quarter's (95 ms) and slower than the whole file's (72 ms)** — with no index, a
smaller viewport means scanning until enough matching rows are found, so a tighter filter costs *more*
to first batch and far less in total (454 ms against 5.7 s and 15.5 s). That inversion is the shape of
the problem index v2 exists to fix, stated as a measurement rather than as a prediction.

**Cancellation mid-stream holds at 5 GB**: acknowledgement max **40.670 ms** against the 100 ms budget,
and **zero batches produced after cancel** in all seven trials. A2 item 1 split this into
acknowledgement (`cancel()` → the first return after it, which is what `docs/08` names) and
drain-to-terminal, because the first instrument measured the drain — dominated by batches produced
*before* the cancel — and reported it as the property.

## The publish half, through the class-3 boundary

**§5a's disclosure, verbatim, because the pass would otherwise read as stronger than it is:** the
harness minted its own grant. The human's F-5 ruling binds a **future exposure surface** — *the
requester must never mint the grant* — and a harness invoked from the operator's own shell is the
operator's hand, not a requester. **This measures the machinery at scale, not the authority model; the
CLI's default grant checks nothing.** The one non-tautological part was passed and recorded:
`--grant-destination`, checked against a resolved fact, with `--grant-ttl 900`.

Both publishes went to **different destinations**, because re-publish over an existing destination is a
typed refusal — and that is a *bonus*: ADR-017 §13 forbids any local path in a bundle, so two different
destinations must still produce a byte-identical manifest. They did, and `manifest.json` carries no
local path, checked over the emitted file.

**The audit record, asserted against `record.rs`'s emitted key sets.** 4 lines; every line parses; every
`schema == "spatial-audit/1"`; 2 intent + 2 outcome, correlated by attempt. Both outcomes carry the
**same** `manifest_hash`, equal to the manifest on disk. §5c's assertions **3** and **5** were
hand-checked during validation and hold as a four-way identity each:

- intent `source_content_hash` == the fixture's independently recomputed SHA-256 == both manifests'
  `source.content_hash` == `sha256:5ae955c5…c1788`;
- outcome `rows` 3,300,000 == the manifest's summed partition rows == the manifest's `data.rows` == the
  strict reader's count; outcome `partitions` 6,636 == the manifest's list length == the files in
  `data/` == the strict reader's count.

**The pre-A5 run's audit log is not retained** and is reported as counts only: the harness clears the
audit directory at the start of each publish run, because §5c's record-count assertions are true only
of a log that starts empty. The retained `audit/publish.jsonl` is the A5 re-run's.

## The rows that had no instrument — amendment A6

**Validating this pass's own artifacts against its preregistration found four things the file
registers and the harness never implemented** — §5b's three cancellation cells, §5b's inter-partition
cadence, §5d's settings readback, and §2b's bounded quantity. Two of them are the unattended half's
only `docs/08` budget claims. **A fifth surfaced while building the instrument** — §5d's
`temp_directory` control — and is reported in its own subsection below rather than folded into a
success. A6 was committed **before** the instrument existed, declaring every trigger point,
ceiling and sample count below; the instrument was reviewed before it was run; and the phases are
**additive** — they run in a later session from a later build with their own pins
(`a6-tree-pin.json`, `a6-binary-pin.json`), they re-measure nothing, and **both runs of record are
untouched**. The new work is a new file so that `kernel/tests/scale_pass.rs` could be left alone: it
is byte-identical (`fdf3eb6343e747b7`) to the source that produced **the publish run of record**.
**It is not the source that produced the streaming run of record** — `tree-pin.json` records that as
`b639134a641f3aaf`, the pre-A5 revision, which exists today only as that pin hash and in git history.

Canary, per phase: **1.38 / 1.43 / 8.98 %**, all inside the unchanged 10 %.

### The bounded quantity — and a bound this pass had mislabelled

**`scale-pass.json` reports `"declared_composed_bound_bytes": 83886080`. That is not the composed
bound.** Per `kernel/README.md` and the three earlier sections that cite this bound — the first,
second and third; the file has four earlier sections in all:

| Component | Bound | In this pass's path? |
|---|---|---|
| `protocol/data-plane` | `(MAX_INFLIGHT_BATCHES + 1) × MAX_FRAME_BYTES` = **83,886,080 B** | **no** |
| engine queue | `(MAX_QUEUED_BATCHES + 1) × MAX_BATCH_BYTES` = **12,582,912 B** | yes |
| **composed, per stream** | **96,468,992 B (92 MiB)** | one half of it |

83,886,080 B is the **data-plane half alone**, and this pass streams **in process** — there is no
pump in the path, so its counter cannot be read here and **no run of this pass ever could have read
it**. What the earlier artifact recorded instead was process **private commit**, which §2b registered
in advance as *not* the claim: *"must never be presented as the claim."* So the memory row's budget
verdict rested on no measurement of the bounded quantity. A6 measures it.

| | 5 GB fixture | 145 MB in-session control |
|---|---|---|
| **`StreamStats::peak_resident_bytes`** | **2,095,440 B** | **2,095,440 B** |
| against the engine-queue bound | **16.65 %** | **16.65 %** |
| rows · batches | 3,300,000 · 6,637 | 100,000 · 204 |

**The two peaks are byte-identical** — ratio exactly **1.0000**. §2b said the counter would be "flat
by construction", and this is what that looks like: the peak is a property of the **pipeline**, not of
the file. 2,095,440 B is **two** batches of 1,047,720 B against a `TARGET_BATCH_BYTES` of 1 MiB — so
the queue never held its full `MAX_QUEUED_BATCHES + 1` = 3, and the peak is therefore set as much by
how fast the consumer drains as by what the queue may hold. Both are properties of the pipeline and
neither is a property of the file, which is the point; but "the queue's ceiling" would be the wrong
name for it.

**Three things that claim is not.** §2b calls flatness *"a two-point claim"* and two points is its
**minimum**, not a strong form — this establishes it, it does not exceed it. Both points come from
the **same generator spec** at near-identical vertex density (104.7 against 104.9 vertices/feature),
so per-batch bytes are identical **by construction** and only the row count varies; the honest
statement is *flat with respect to row count at constant per-row shape*, which is weaker than "flat
with respect to file size" and is what was measured. And **16.65 % describes the cut policy, not
headroom**: batches are cut at 1 MiB while the bound is built from the 4 MiB `MAX_BATCH_BYTES`
ceiling, so the percentage would move if the cut moved, exactly as the second and third sections
already caveat for their own data-plane figures.

Both row counts were asserted against §1b before the peak was accepted, so a truncated stream could
not have been reported as a bound measurement.

**Process private commit is a different quantity, from a different session, and is not the claim.**
The streaming run of record recorded 351,735,808 B at 5 GB and 154,361,856 B at 145 MB; those are
that run's figures, not comparable with A6's, and §2b registered in advance that they must never be
presented as the bounded-memory claim. DuckDB's streaming buffer, and publish's ~7 GB sort, sit
outside every declared bound by design. The earlier sections' data-plane readings — 1,354,016 B in
the first, 1,730,272 B and 1,729,952 B in the second and third — are named here only to say that they
measure the **other** component, in other sessions, and are not a baseline for the 2,095,440 B above.

### Cancellation and cadence — reported together, because they are one mechanism

`PUBLISH_PARTITION_TARGET_BYTES` (1 MiB) and `PUBLISH_PARTITION_ROWS` (8,192) make **the
uninterruptible window one partition's encode and write** — `engine/src/stream.rs` says exactly that.
So the inter-partition interval *is* the mechanism that produces the cancellation latency. Quoted
alone, the latency reads as a property of the boundary and the cadence reads as throughput; neither
is true, and this pass reports neither without the other.

**The cadence**, from one publish run to completion — 6,635 intervals over 6,636 partitions:

| p50 | p95 | **max** | wall |
|---|---|---|---|
| **8.573 ms** | **10.836 ms** | **999.924 ms** | 84,176.7 ms |

p50 and p95 land inside §5b's predicted 5–15 ms. **The max does not, by two orders of magnitude**,
and that tail is the whole story of the row below.

**The cancellation cells.** Latency is `cancel()` → `boundary::execute` returns. That window
strictly **contains** the acknowledgement `docs/08` names — it also carries staging removal and the
outcome record's fsync — so a pass is a pass *a fortiori*, and only a miss needs a finer instrument
to attribute. Every trial asserted "leaves nothing": destination absent, its own staging directory
absent.

| Cell | usable n | p50 | p95 | max | vs the 100 ms budget |
|---|---|---|---|---|---|
| `VerifyingSource` (1 s into the 5 GB rehash) | **7 of 7** | **13.700 ms** | 23.541 ms | 23.541 ms | **met** |
| **the sort window** (fired before the first partition) | **1 of 7** | — | — | **3,920.251 ms** | **missed, by 39×** |
| `WritingPartitions` (after 100 partitions) | **7 of 7** | **25.475 ms** | **418.321 ms** | 418.321 ms | **p50 met; p95 missed by 4.2×** |

**Verdict: the 100 ms budget is MISSED for publish at 5 GB — recorded, not established.** Worst
usable sample **3,920.251 ms**. `docs/08` says *"cancellation acknowledged < 100 ms, any operation"*
and `docs/01` principle 7 has no size exemption, so this is a genuine miss against a real budget and
it is reported as the pass's principal finding rather than reframed.

**What the pairing suggests — and these are hypotheses, not decompositions.** Nothing here measured
the cost of removing a staging directory, and no per-partition interval was recorded at the instant
of any cancel; the cadence came from a *different* publish operation than the trials did. So:
the `WritingPartitions` p50 of **25.475 ms** sits **16.9 ms above** the 8.573 ms cadence p50, and
"leaves nothing" — removing 100 staged files, which this window deliberately includes — is the
obvious candidate for that gap but was not measured. And the **418 ms p95 resembles the cadence's
999.9 ms max** closely enough to suspect one mechanism: partition writing is not uniform, and a
cancel landing at the start of a stall would wait it out, because the uninterruptible window is one
partition's encode and write. **Suspecting it is not measuring it.** Both would be settled by an
instrument that stamps the live inter-partition interval into each trial — which this pass does not
have, and which is the first thing a follow-up should build.

**The sort is a different failure and a worse one.** 3,920 ms is not a partition-sized window — it is
DuckDB sorting ~7 GB inside a single call that does not return to a cancellation check. **What fails
is publish's `Querying` phase**, and that is a statement about this cell alone. The streaming half's
40.670 ms is scored against the same 100 ms budget in its own row, from its own session and build;
it is **not** a comparator for this number, and neither are earlier sections' figures.

**One caveat on "inside the sort", because the retained console makes it checkable.** The observer
recorded this trial's live phase label as `writing-partitions` with `partitions_at_fire: 0`. That the
cancel landed in the sort is an **inference from the partition count** — zero partitions written
means the first batch had not yet arrived, which is the sort — not something the observer reported
directly, because `publish::run` reports `WritingPartitions` before the first `next_into` blocks.

### The `Querying` cell has n = 1 of 7, and the reason is itself a finding

§5b describes `Querying` as *"the DuckDB `ORDER BY` sort — a multi-minute phase nobody has ever
sampled"*, and A6 declared the trigger at **5 s after the phase is reported**, before measuring, so
it could not be tuned to a result. **The sort is not multi-minute.** In six of seven trials, 5 s had
already carried the operation into `WritingPartitions` with 16 to 157 partitions written — so those
six are **observations, not samples**, exactly as §5b requires, and their latencies (12.36 / 30.68 /
31.02 / 88.02 / 879.34 / 993.20 ms) are reported as observations only. The seventh trial fired with
**zero** partitions written and is the single on-target sample.

The six off-target latencies are printed in `a6-console.txt`, retained as an artifact beside the JSON
precisely so they can be checked — the JSON's `latency` block for this cell carries the single
on-target sample only, by design, and `partitions_at_fire` is recorded there for all seven.

**One sample establishes an order of magnitude, not a distribution**, and this row says so rather
than dressing n = 1 as a p50. What it does establish is enough to act on: cancelling inside the sort
costs seconds, not milliseconds. **The trigger is not re-tuned in this cut** — that would be aiming a
declared instrument at a result it had already seen. A future pass can declare a shorter delay *on
the strength of this measurement*, which is what preregistration is for.

### The audit log, and §5c's remaining assertions

A6 wrote to its own log, `audit/cancellation.jsonl`, so the publish run of record's
`audit/publish.jsonl` keeps the "starts empty" property its own assertions depend on.

**44 lines · 22 attempts · 21 cancelled · 1 success** — 21 cancellation trials plus the cadence
publish. This closes two §5c assertions the earlier harness left unmade, one of them only vacuously
because no attempt had ever been cancelled:

- **Assertion 6** — every cancelled attempt's outcome is terminal, `error_kind` is the **variant
  name** `"Cancelled"` rather than a rendered message, and `manifest_hash`, `rows` and `partitions`
  are all `null`. 21 of 21.
- **Assertion 8, append-only** — the log's bytes were read **before and after every one of the 22
  attempts**, and every previously written line was byte-identical afterwards. 22 of 22.
- **Assertion 2** was strengthened while implementing it: not equal totals, which a log with two
  intents and no outcome would also satisfy, but **exactly one intent and one outcome per `attempt`
  id**. 22 of 22.

### §5d is partially measurable, and the reason is a design decision

§5d asks for `SELECT current_setting('memory_limit')` and `current_setting('temp_directory')`
against the engine's connection. **`Lease::connection()` is `pub(crate)`** — *"the connection itself
never leaves this crate"* — so a test in `kernel/tests/` cannot issue it, and a fresh connection
would report a different connection's defaults under the engine's name. That is a property of the
design, not a gap in the harness, and it is reported rather than worked around with a new
dependency.

What is established instead: an exhaustive source search over `engine/src` and `kernel/src` returns
**no hits for either setting**, so both stand at DuckDB's defaults — which is what §5d predicted
(*"nothing in this workspace sets either value"*).

**And that same search establishes a fifth un-instrumented registered item, which belongs in the list
above rather than hidden in a success.** §5d does not only predict; it declares a **control**:
*"`temp_directory` is set explicitly to a path under `target/`, so a spilling sort cannot write
gigabytes into the repository under a pinned tree and cannot fill the drive."* **That control was
never implemented** — nothing sets it, which is exactly why the search returns nothing. So the
protection §5d promised did not exist during any publish in this pass, and what follows is
observation in its place.

The risk was **observed** rather than controlled: spill directories were polled **every 250 ms during
the publish**, because DuckDB removes spill files when the query ends and a post-hoc look could only
ever report "none". **None appeared** at any of `.tmp`, `kernel/.tmp`, `engine/.tmp` or `target/.tmp`
— four guessed locations, which is weaker than knowing where the setting points. Free disk
113,698,861,056 → 107,644,280,832 B across the phase: a delta of **6,054,580,224 B**, against a
5,737,397,728 B bundle. **~317 MB is unattributed**, and is stated as unattributed rather than
rounded into the bundle.

## Findings

### 1. Cancellation of a publish at 5 GB misses the 100 ms budget — the pass's principal finding

Stated first because it is a miss against a real budget on a non-negotiable. `docs/08`:
*"Cancellation acknowledged < 100 ms, **any operation**"*; `docs/01` principle 7 has no size
exemption.

**The two halves of the miss are not equally established, and the verdict label has to say so:**

- **`WritingPartitions` p95 418.321 ms — an established miss, n = 7 of 7 on target.** 4.2× the
  budget, from a full sample.
- **The sort window 3,920.251 ms — a single sample, n = 1 of 7.** 39× the budget. One observation
  establishes an **order of magnitude**, not a distribution, and this figure must not be quoted as a
  p50 or as "the" latency. Why n = 1 is itself a finding (7 below).

So the row is recorded as **missed** — the `WritingPartitions` half **established** at n = 7, the
sort half (**n = 1**, 3,920.251 ms) **recorded, not established**.

**What is not broken.** The engine's own stream cancellation, scored against the same 100 ms budget
in its own row and from its own session, **met** it — 40.670 ms max, zero batches produced after
cancel, seven of seven. The class-3 boundary's
"leaves nothing" property held in **21 of 21** cancelled publishes: no destination, no staging
directory, every one audited with a terminal cancellation record. Cancellation *works*; what misses
is **how long publish takes to notice**, in two phases, for two different reasons — a ~1 s
partition-write tail, and a multi-second sort that does not return to a cancellation check.

**This is the baseline that future work must beat**, in the brief's own terms. No fix is attempted
here and none is designed here; naming a remedy is a decision for the custodian, and the obvious
candidates — a cancellation check inside the sort, or a sort that streams — are ADR-shaped, not
harness-shaped.

### 2. `docs/07`'s hero slice does not complete end-to-end at 5 GB under bundle format v1

**Recorded in §9b before the run**, because it follows from §1b's arithmetic rather than from any
result, and a finding discovered after a measurement is easy to mistake for one.

The bundle this pass publishes carries **3,300,000 rows** against ADR-017 §16's declared
`MAX_FEATURES` of **2,000,000**, and **5,737,397,728 B** against `MAX_RESIDENT_BYTES` of
**536,870,912**. Both are implemented in `renderer/bundle-viewer/src/main.ts` as `ceiling-exceeded`
refusals, and the rows check runs against the manifest — so **the reference viewer's correct,
declared behaviour on this bundle is a typed refusal before a single partition is fetched.**

So: **publish succeeds, and the view half correctly refuses.** Nothing is broken and no ceiling was
discovered late — this is ADR-010 rule 6 working exactly as intended. This pass records it and does
not try to fix it. No ADR decides what should happen above those ceilings, and the options — publish
refuses too, the slice publishes a declared subset, the format gains tiling, or the ceilings rise on
evidence nobody has taken — are a decision for the custodian.

### 3. The identity scan is ~80 % of open cost — the cost half of an ADR-016 consequence

ADR-016 states: *"Uniqueness verification costs a pass over one column at open. **No performance
claim is made here**; the cost is measured against `docs/08`'s dataset classes when the code exists,
and `docs/08` gains a correctness case for a duplicate-id source being refused."* The code exists,
and this is the cost half of that measurement.

**Two precisions, because the consequence is worded narrowly.** `docs/08`'s dataset classes are
Points / Lines / Polygons / Labels / Raster / Remote source — **there is no "5 GB class"**; 5 GB is
the cold-open *budget line*. This fixture is a 3.3 M-feature polygon file at ~105 vertices/feature
and is **not** `docs/08`'s Polygons class (100 k features / 10 M vertices), so this measures the scan
cost **at this pass's own declared scale**, not against a matrix class. And the consequence's second
half — the duplicate-id correctness case — is **not** addressed here.

The A/B is on two **product** paths — `Dataset::open_with_declared_identity` with
`skip_uniqueness_check` true and false — not inferred from a cancel ladder, and run as alternating
ABBA pairs after a discarded warm-up so DuckDB's first-instance cost lands in neither arm. **Both
order estimates are reported and deliberately not averaged**, per A2 item 2: **105.584 ms** (A first)
and **104.988 ms** (B first). They agree to 0.6 %, so there is no order effect to report as a
finding.

Open p50 is **131.267 ms**; prelude-only p50 is **25.982 ms**. **The scan is roughly 80 % of the
cost of opening a 5 GB file** — the brief predicted it "may become the dominant open cost", and it
is. This also explains the cold row's small cold/warm ratios: an open is dominated by CPU-bound
`DISTINCT` work, so ~35 MB of SSD reads overlaps most of it. Progressive or deferred verification is
**future work, not this cut**; ADR-016 is the vehicle.

### 4. Without an index, a tighter viewport costs *more* to first batch

First batch: whole file **72.175 ms** → quarter **94.943 ms** → 1/64 **256.684 ms**. Total: 15.5 s →
5.7 s → 454 ms. With `ScanOnly` planning, a smaller viewport means scanning further before enough
matching rows are found, so the filter that returns least takes longest to produce anything.

**These are index v2's baseline-to-beat**, which is what this cut was for. The inversion is the
shape of the problem, measured rather than predicted.

### 5. Two registered elements of the cold-open protocol were never instrumented

The canary (§4a step 5, and A5's table gates the cold row on it) and process-level `IOReadBytes`
(§4b, *"the gap between the two is the cache-hit measure"*). Both are unrepairable: the boots are
gone and a re-run would be a different session. Detailed above, and the second is what a boot-1
anomaly — twice the device read of boots 2 and 3 for the identical operation — would need in order to
be settled rather than noted.

### 6. `scale-pass.json` named the data-plane bound the *composed* bound

83,886,080 B is `(MAX_INFLIGHT_BATCHES + 1) × MAX_FRAME_BYTES`, the data-plane half. The composed
per-stream bound is **96,468,992 B**. Corrected in A6 and measured against the component actually in
the path. A number checked against a bound belonging to a component that was never in the path is
not a checked bound.

### 7. §5b's assumption about the sort was wrong, and it cost six of seven samples

*"A multi-minute phase nobody has ever sampled"* — the sort finishes in under 5 s at this scale.
Reported because it is exactly the kind of assumption a preregistration exists to expose: the
trigger point was declared in advance, it overshot, and the overshoot is now a measured fact a
future pass can aim at.

## Reported loudly: what this pass did *not* get right the first time

**Two attempts were invalidated, a third had its publish half re-run, and *five* registered items had
no instrument until validation went looking** — §5b's cancellation cells, §5b's cadence, §5d's
settings readback, §2b's bounded quantity, and §5d's `temp_directory` control, the last of which
surfaced only while writing A6's own instrument. Add the row-group count §1c registers and no
artifact carries, and the cold-open phase's missing canary and `IOReadBytes`, and the contract went
unmet in eight places.

A ninth belongs on that list: **the publish run of record has no pin**, which §7's invalidator
presumes exists.

**The contract caught all nine — but not all of them by machinery.** The cancellation cells, the
cadence, the settings and the bounded quantity were found by reading the preregistration against the
artifacts by hand; the row-group gap the same way; the `temp_directory` control only while writing
the instrument that replaced it. **No harness failed for any of them**, because a harness cannot fail
to run a phase nobody wrote. That is the argument for writing the contract first *and* reading it
back afterwards — and a preregistration that nothing ever fails is not doing any work.

**The amendment rule bit three times and was obeyed three times.** A3, A4 and A5 were each written
after a result had been looked at, each says so in its first line, and each invalidated or re-ran the
work it touched rather than re-describing it. A6 is the one amendment that adds work instead of
excusing it.

**The pattern worth watching:** A4 and A5 both narrowed the scope of an invalidator, and a reader is
right to be suspicious of that shape. Both narrowed *toward* text §6 had registered before any
instrument existed, neither changed the 10 % bound, and every phase carrying a timing claim stayed
gated and passed. **A5's rule is the one to hold future passes to:** the canary gates timing
comparisons, not correctness claims — and if a future amendment uses that sentence to exempt a
timing row, it is being misused.

**Three things this pass cannot say about itself.**

- **`binary-pin.json`'s five entries can no longer be re-verified from disk, and they fail in two
  different ways.** Four — `publish-bundle.exe`, `verify-bundle.exe`, `time-open.exe`,
  `make-fixture.exe` — matched their pin when validation checked them after the last cold sample, and
  were rebuilt afterwards by the A6 build; that check is the evidence, the files no longer are. **The
  fifth, the `scale_pass` harness itself, already differed before any of this validation ran**: A5's
  re-run rebuilt it at 16:27:18 — four minutes before the artifact it produced — and no pin was taken
  afterwards, so **the publish run of record was produced by a binary no pin records**. Its observed
  hash (`310c98b9…`, against the pinned `2e0ef86e…`) is written into `a6-binary-pin.json` so the claim
  rests on an artifact rather than on reasoning. Recorded rather than repaired — rebuilding to chase
  a hash produces a third set of bytes and proves less.
- **The publish run of record has no pin artifact of its own.** `tree-pin.json` and
  `binary-pin.json` are the *streaming* run's, taken before the A5 amendment; the publish half writes
  none. Its tree is established by a file-by-file comparison done during validation and by the
  committed history, not by a retained pin. §7 makes a pin difference an invalidator, and the run it
  would guard has nothing to guard it.
- **The streaming run of record's instrument source is not on disk.** See A6 above.

## What could not be measured, and why — declared up front, not after a failed attempt

- **Any browser or viewer figure at this scale.** §8 declared this before the fixture existed, and
  finding 2 above is why: the reference viewer's correct behaviour on this bundle is a **typed
  refusal before a single partition is fetched**. Measuring it would measure the refusal.
- **Throughput, anywhere**, including fixture generation. Bytes and seconds appear side by side and
  are deliberately not divided.
- **DuckDB's own memory as a bounded quantity.** Reported as a fact, claimed as nothing. Its
  streaming buffer, and the ~7 GB `ORDER BY` sort in publish, sit outside every declared bound **by
  design**, as `engine/src/stream.rs` already states.
- **Cross-process cancellation latency** (Ctrl-C on the CLI): a scheduling measurement, not the
  property. Every cancellation figure here is in-process, producer-observed, on one clock.
- **Geometric correctness of anything.** No GEOS or PostGIS oracle is present (`docs/08`,
  test-oracle separation).
- **The data-plane resident counter**, and this one is a correction rather than a scope note — see
  finding 6 above.

## Reproducing this

```bash
# 0. The preregistration is the contract. Read it before the numbers.
#    kernel/SCALE-PASS-PREREGISTRATION.md — committed BEFORE the fixture, the instruments and any run.

# 1. Pin the tree BEFORE the build; a measurement is a claim about a tree, not about a moment.
node kernel/scripts/pin-tree.mjs > target/slice-evidence/scale-pass/tree-pin.json

# 2. Build from clean, then pin the binaries by SHA-256. A source pin does not pin a build.
cargo build --release --workspace --tests --examples

# 3. Correctness gate on the same build.
cargo test --release

# 4. The streaming half: generates the 5 GB fixture and the 145 MB in-session control, does the
#    identity-scan A/B, streams whole-file / quarter / 1-64, and measures cancellation mid-stream.
#    Settles 120 s before the first canary (A3).  → target/slice-evidence/scale-pass/scale-pass.json
#
#    THIS DOES NOT REPRODUCE scale-pass.json's RUN OF RECORD. The committed scale_pass.rs is
#    `fdf3eb6343e747b7`, the post-A5 revision; the streaming run of record was produced by
#    `b639134a641f3aaf`, which differs from it by A5's canary-scope change and lives only in git
#    history. To re-run the streaming half AS RECORDED, check that revision out first. The A5 change
#    touches which phases the canary gates, not what is measured — but "the numbers should come out
#    the same" is a claim, and this file does not make claims it has not checked.
cargo test --release --test scale_pass -- --ignored --nocapture --test-threads=1 \
  measure_the_five_gigabyte_scale_pass

# 5. The publish half. REFUSES to generate a fixture, so the two halves cannot measure different
#    files.  → scale-publish.json, bundles/, audit/publish.jsonl
cargo test --release --test scale_pass -- --ignored --nocapture --test-threads=1 \
  measure_publish_at_five_gigabytes

# 6. The A6 additive phases: the bounded quantity, the cadence, and the three cancellation cells.
#    → scale-pass-a6.json, audit/cancellation.jsonl
cargo test --release --test scale_pass_a6 -- --ignored --nocapture --test-threads=1

# 7. The cold-open row runs LAST, after the unattended phases (§9a), and needs an operator.
#    Three RESTARTS — not "Shut down", which is a hybrid hibernation that would not evict the cache.
#    After each restart, before opening anything else:
powershell -NoProfile -ExecutionPolicy Bypass -File kernel\scripts\cold-open.ps1 -Boot 1
#    (then Restart, -Boot 2; then Restart, -Boot 3)
#    Or the one-command wrapper, which checks the preconditions and refuses before costing a reboot:
powershell -NoProfile -ExecutionPolicy Bypass -File run-cold-open.ps1

# 8. Re-verify: the fixture's full SHA-256 after the last cold sample (§9a), and the pins.
```

**Three things that will not reproduce, and are recorded rather than smoothed over.**

- **`binary-pin.json`'s hashes.** Four of its five entries — the two examples, the CLI and the
  fixture generator — were rebuilt by the A6 build; adding a test target to a package invalidates
  that package's bins and examples, and Rust builds are not bit-reproducible. All four matched their
  pin when validation checked them after the last cold sample, so what is lost is the ability to
  re-verify from the files on disk, not the check itself. **The fifth, the `scale_pass` harness, is
  a different case** — A5 rebuilt it and no pin was taken afterwards, so it never matched.
- **The streaming run of record's instrument source**, which is `b639134a641f3aaf` and lives only in
  git history; see step 4.
- **The cold-open row**, which cannot be reproduced without three more reboots — a **different
  session**, and therefore a replacement for these samples rather than a confirmation of them.

## Raw artifacts (`target/slice-evidence/scale-pass/`, gitignored)

| File | What it holds |
|---|---|
| `scale-pass.json` | the streaming run of record — fixture facts, the open A/B, three streaming rows, cancellation, memory, per-phase canary verdicts |
| `scale-publish.json` | the publish run of record — A and B wall times, manifest hashes, the 6,636-partition comparison, strict reader, audit counts, canary |
| `scale-pass-a6.json` | the A6 additive phases — the bounded quantity at both file sizes, the inter-partition cadence, the three cancellation cells, §5d as far as it reaches |
| `attempt-1-invalidated/`, `attempt-2-invalidated-*` | the two invalidated attempts, retained with their invalidators named (§7) |
| `attempt-3-publish-pre-A5.json` | the superseded publish run, retained and reported beside the re-run |
| `cold-open/boot-{1,2,3}.json` + `-cold`/`-warm` | one artifact per boot; never pooled |
| `cold-open/boot-evidence-external.json` | post-hoc verification of §7's Fast-Startup invalidator from the Windows event log |
| `audit/publish.jsonl` | the publish run of record's audit log — 2 intent + 2 outcome |
| `audit/cancellation.jsonl` | A6's own log, separate so the above keeps its "starts empty" property |
| `a6-console.txt` | A6's full console output — the only record of the six off-target `Querying` observations |
| `tree-pin.json`, `binary-pin.json` | the streaming run's source and binary pins |
| `a6-tree-pin.json`, `a6-binary-pin.json` | A6's own pins, and the note on the rebuilt binaries |
| `bundles/verify-summary.json` | the strict reader's own output over bundle A |

## Instrument sources (committed)

| File | What it is |
|---|---|
| `kernel/SCALE-PASS-PREREGISTRATION.md` | the contract: spec, predictions, ceilings, protocols, invalidators, and six amendments |
| `kernel/tests/scale_pass.rs` | the streaming and publish halves. Byte-identical to the source that produced **the publish run of record**; the streaming run's revision is pinned as `b639134a641f3aaf` and lives in git history |
| `kernel/tests/scale_pass_a6.rs` | the A6 additive phases, added as a new file so the above could stay untouched |
| `kernel/scripts/cold-open.ps1` | the per-boot cold-open protocol; refuses rather than producing a warm number labelled cold |
| `run-cold-open.ps1` | the operator wrapper: checks preconditions before a reboot is spent |
| `kernel/examples/time-open.rs` | `Instant` around `Dataset::open` and nothing else |
| `kernel/examples/verify-bundle.rs` | the strict reader |

---

# Sixth section — 2026-08-07 — publish cancellation re-scored, and the sort located

**Contract:** `kernel/CANCEL-RESCORE-PREREGISTRATION.md`, committed before the harness existed.
**Semantics:** `kernel/CANCELLATION-AND-TRACING.md`, committed before the preregistration — so that a
preregistration could not quietly redefine an interval while declaring a measurement of it.
**Nothing above this line is edited.** The fifth section stands as its tree's record.

> **Correction, filed by the eighth section — this title's second clause, "the sort located", is
> withdrawn.** The cell that produced "Where the sort actually happens" below
> (`kernel/tests/cancel_rescore.rs`'s consistency demonstration) runs `ViewportQuery::all()` —
> `RowOrdering::Unordered`, no `ORDER BY` at all — so there is no sort in that query and nothing in
> this section located one. The measured split (`sql_prepared → execute_returned` dominant over
> `execute_returned → first_source_row`, n = 1) stands as a number; only the causal label attached to
> it is retracted. `kernel/CANCELLATION-AND-TRACING.md` §2's open question — with an `ORDER BY`, does
> DuckDB sort inside `stream_arrow` or the first `next()` — remains unanswered, and is also amended
> in `kernel/CANCELLATION-AND-TRACING.md` §8. Full correction below, in this section's own "Where the
> sort actually happens" subsection; the eighth section's registered prediction leaned on the number
> this section measured, not on the retracted label.

## What this section may not claim, stated before any number

**No figure here may be differenced against the fifth section's.** Different tree, different session.
That is the standing within-session rule, and there is a second reason that bites harder:

> The fifth section's **3,920.251 ms** and **418.321 ms** measure `cancel()` → `boundary::execute`
> returns. This section's budget-bearing figures measure `cancel_requested → cancel_observed`.
> **These are different intervals.** Neither is a baseline for the other in any direction.

So "cancellation got faster" is not a claim this section makes, and the word "improvement" does not
appear below. What it does is take a verdict against the same `docs/08` budget, independently, on a
tree where the consumer can now look at its own token.

## Scope

| | |
|---|---|
| Fixture | the scale pass's own 5 GB file, unmodified, re-hashed **once, before the run** — `sha256:5ae955c5…1788`. The harness **refuses to generate one** |
| Whole-file rehash, measured | **not recorded for the run of record** — see the provenance gaps below |
| Control | the same 145 MB in-session control |
| Hardware | Intel i9-9980HK, 8 cores / 16 threads, 63.7 GiB, SSD |
| Attempts | **4, of which 3 invalidated** — see below |
| Canary | all six phases **within** the declared 10 % bound |
| Tree pin | `27d412d2…` over 90 files (`tree-pin-attempt4.json`) — **taken after the run, not before, so it cannot exclude a source edit during it** |
| Binary pin | `eeca7a4d…`, **confirmed 2026-08-08 from build order and binary content** to be the run of record's; its `source_pin` field names the wrong tree pin — see the provenance gaps below |

### Two provenance gaps in this pass's own record, found in review and recorded rather than repaired

Both were found by the write-up review, after the run. Neither is repairable without re-running, and
neither is quietly dropped.

**1. The whole-file rehash duration was never recorded for the run of record.** `cancel-rescore.json`
carries no rehash figure at all. A draft of this section printed **20,046.3 ms** for it; that figure
is from `attempt-2-invalidated-console.txt`, an **invalidated** attempt, and it is withdrawn here
rather than laundered into the run of record. The same draft said the rehash was *"paid once per
trial"* — that is also wrong: `kernel/tests/cancel_rescore.rs` calls `pin_content` **once, before the
trial loop**, so it is paid once per run. The correct statement is the narrow one: **the fixture was
hashed once before the run and matched the preregistration's `sha256:5ae955c5…1788`, and how long
that took is not on record for attempt 4.**

**2. The binary pin names the wrong tree pin — but the hash itself is the run of record's, and that
was established by re-verification rather than by argument.** `binary-pin.json` records `eeca7a4d…`
with `source_pin: "tree-pin.json, combined 76fd7b69…"`, and `tree-pin.json` is **attempt 3's** tree.
Review read that field and concluded the pinned binary was attempt 3's build — which would have meant
A1's settle never ran. **That conclusion is wrong, and the check that settles it is cheap enough that
asserting either way would have been inexcusable:**

Filesystem timestamps, to the second, local time (`+02:00`; the tree pins record the same instants in
`Z` — `tree-pin-attempt4.json`'s `19:40:56.958Z` is the `21:40:56` below):

| | |
|---|---|
| attempt 3's artifacts written | **21:17:03** — attempt 3 is over |
| `kernel/tests/cancel_rescore.rs` last modified | **21:17:55** — A1 applied; the file contains `CANARY_SETTLE` |
| `cancel_rescore-040613f5bbbd8610.exe` built | **21:18:01** — 6 s *after* that edit |
| `binary-pin.json` taken | **21:18:11** — 10 s after that build |
| run of record written | **21:39:28** |
| `tree-pin-attempt4.json` taken | **21:40:56** — *after* the run, which is why `binary-pin.json` could not name it |

The order is unambiguous at second resolution: attempt 3 finished, A1 was applied, the binary was
rebuilt, and only then was it pinned. `binary-pin.json`'s `taken_before: "the re-score run"` is
therefore accurate — it means attempt 4 — while its `source_pin` is stale.

**The decisive check is a content check, and it depends on no clock at all.** A1's `settled_canary`
prints `settling {}s before the [{label}] canary…`, so the literal **`s before the [`** exists in a
post-A1 build and cannot exist in a pre-A1 one. It is **present in the pinned binary** (1 occurrence),
and attempt 3's console contains **zero** per-phase settle lines — only the pre-A1 opening
`settling 120 s before the first canary…`. **Bytes against behaviour: the pinned binary contains code
attempt 3 demonstrably did not run.**

**What the weaker checks do and do not add, stated so they can be attacked.** `cargo build --release
--test cancel_rescore --locked` finishes with **nothing to do** (0.32 s) and the binary still hashes
to `eeca7a4d…` — but cargo's freshness verdict is *mtime-derived*, so it is **not independent of the
table above** and is not counted as a second line of evidence. `pin-tree.mjs`'s own header says the
rest: a binary hash proves *"unchanged since I hashed it", not "built from these sources"*. The hash
establishes that the artifact on disk today is the one that was pinned; the **content** check
establishes which sources it came from.

**So `eeca7a4d…` is the binary that ran the run of record**, and A1's settle was compiled into it.
Attempt 4's canary spreads are **consistent with** a settled machine — they cannot witness which code
ran, since a quieter machine yields the same spreads, and `cancel-rescore.json` records no settle.

**This section is the retained record of that.** The mtimes, the hash and the content check all live
in `target/`, which is gitignored and which any `cargo clean` erases; printing them here is what makes
the closure checkable by a later reader rather than something to take on trust. And "re-verified" is
the wrong verb, so it is not used: **no post-run hash was ever recorded**, so there was nothing to
verify *against*. What happened is **confirmed from build order and binary content**.

**What is genuinely defective is the pin's label, not its hash.** `binary-pin.json` points at the
only tree pin that existed when it was written, and that pin is the wrong one; the tree pin that does
describe attempt 4 was taken **after** the run rather than before it, contrary to this section's own
"pin, then build" instruction. Both are recording-order defects and both are fixed the same way:
**take the tree pin before the run, take the binary pin after the last source edit, and have the
binary pin name the tree pin it belongs to.** The fifth section's own reproduce block put the reason
in one line — *"A source pin does not pin a build"* — and this pass took the binary pin it asks for;
the pin here is real, its provenance label is not.

## Every attempt, and what invalidated it

**Three of four attempts were thrown away, and two of them were my instrument's fault rather than the
machine's.** Stated first because a pass that reports only its successful run is not reporting.

| # | outcome | cause | artifact |
|---|---|---|---|
| 1 | **invalidated** | no trigger fired in 28 trials; the harness recorded the *trigger's* view of why (`"QueryRunning never fired: the sort finished inside one poll interval"`) but not the *operation's* outcome — and the trigger's view was actively misleading | `attempt-1-invalidated-no-trigger-fired.json` |
| 2 | **invalidated** | same cause, now visible: the request asked to publish a `zone` attribute the 5 GB fixture does not have | `attempt-2-invalidated-wrong-attribute.json` |
| 3 | **invalidated** | §6 invalidator 2 — canary spread exceeded 10 % in **five of six phases** | `attempt-3-invalidated-by-canary.json` |
| 4 | **run of record** | all six phases within bound, 28 of 28 trials on target | `cancel-rescore.json` |

**Attempt 1's real defect was the reporting, not the request.** It could say why its *trigger* had not
fired but not what the *operation* had done, and the trigger's explanation pointed at a fast sort when
the truth was that publish had refused the request outright. A wrong answer is worse than none, and
this was the pass's own instrument committing the uninformative-artifact failure the pass was written
to argue against. Every trial row now carries the operation's actual outcome, which is why attempt 2
diagnosed itself in one line.

**Attempt 2's cause is the engine being right.** Publish refused with *"`zone` cannot be published as
an attribute — the file has no such column… a conversion the caller did not ask for is the silent
conversion `docs/01` principle 8 forbids."* The 5 GB fixture is `AttributeMode::None`; the helper was
copied from a small-fixture test. A non-negotiable caught a harness bug.

**Attempt 3 was the machine, and the canary said so before any number was believed.** The 400 M
instrument's long minimum climbed 105.7 → 116.5 → 134.7 → **162.6** ms and then fell back
131.9 → 117.8 → 119.8 as the load lightened — a rise and a recovery, which is thermal drift under 28
publishes reading 5 GB each and not a step change. Amendment **A1** added a 60 s settle
before every canary reading; it declares in its first line that it was written after a result was
seen, changes no trigger, ceiling, sample count or verdict rule, and carries **no number forward**.
Attempt 4's spreads: **0.11 / 0.55 / 2.43 / 6.68 / 6.90 / 1.65 %**.

## Results

| Cell | Trigger | n | `observed` p50 / p95 / max | `acknowledged` p50 / max | Verdict vs 100 ms |
|---|---|---|---|---|---|
| **C1 — inside the sort** | `QueryRunning` + 250 ms, **off-thread** | 7/7 | **2.180 / 14.964 / 14.964 ms** | 6.579 / 21.941 ms | **MET** |
| C2 — mid partition write | first partial-write callback, inline | 7/7 | 0.001 / 0.001 / 0.001 ms | 24.774 / 29.778 ms | **MET — vacuous, see below** |
| C3 — immediately pre-fsync | final write callback, inline | 7/7 | 0.001 / 0.002 / 0.002 ms | 27.910 / 32.841 ms | **MET — vacuous** |
| C4 — A6's trigger, continuity | `partition_written`, inline | 7/7 | 0.001 / 0.001 / 0.001 ms | 26.347 / 29.115 ms | **MET — vacuous** |

The verdict column prints what `cancel-rescore.json` recorded — `verdict_on_observed_vs_100ms: "MET"`
for all four cells — beside this section's reading of it. **Where the artifact and the write-up
differ, both are shown**, rather than the write-up silently overwriting the recorded field.

**28 of 28 trials fired on target, ended as `Cancelled`, and left nothing on disk** — no destination,
no staging directory, every one checked. That is a correctness result and the canary does not gate it.

### The fifth section's numbers, printed beside these

`NEXT-CUT.md` rev 2 requires the old figures printed next to the new ones so the evidence chain reads
without a cross-reference. They are below. **Every figure carries its interval label, because the two
columns are not the same interval and three of the four pairings are not even the same quantity.**

| the fifth section recorded | its interval | n | this section's counterpart | its interval | n |
|---|---|---|---|---|---|
| sort window **3,920.251 ms** | `cancel_requested → execute returns` — **quiescent-interval** (`acknowledged`-class) | **1 — recorded, not established** | **C1** `acknowledged` **6.579** p50 / **21.941** max — and, separately, `observed` **2.180** p50 / **14.964** max | `acknowledged` / **`observed`** = `cancel_requested → cancel_observed` | **7 — established** |
| `WritingPartitions` p50 **25.475** / p95 **418.321 ms** | quiescent-interval (`acknowledged`-class) | 7 | **C4**, the same trigger *definition* re-implemented (`partition_written`, inline, after 100 partitions): `acknowledged` p50 **26.347** / max **29.115 ms**; `observed` p50 **0.001 ms** | `acknowledged` / `observed` | 7 |
| `VerifyingSource` p50 **13.700 ms** | quiescent-interval (`acknowledged`-class) | 7 | **not re-measured** — no cell in this pass triggers in that phase | — | — |
| inter-partition cadence p50 **8.573** / p95 **10.836** / **max 999.924 ms** | a cadence, not a cancellation figure at all | 7 | **not re-measured** — out of scope per the preregistration's §7 | — | — |

**These columns are printed side by side and are never differenced.** Not subtracted, not divided,
not called faster or slower. Two independent reasons, either sufficient:

1. **Interval.** The fifth section's **3,920.251 ms** and **418.321 ms** are quiescent-interval
   figures — they run to `boundary::execute` returning. This section's budget-bearing figures are
   `cancel_requested → cancel_observed`. **Differencing a quiescent-interval figure against an
   `observed` figure is a category error**, and it is the specific error this pass was built to make
   impossible to commit by accident.
2. **Session.** Even the `acknowledged`-to-`acknowledged` pairings above — 3,920.251 against 21.941,
   418.321 against 29.115 — are **not** differenced. Different tree, different build, different
   session; the preregistration's §1 forbids it, and the within-session rule that has governed every
   section of this file forbids it independently of anything this cut did.

What the table is for is the thing a reader can legitimately do with it: **see two verdicts against
the same `docs/08` budget, each standing on its own evidence.** The fifth section scored `MISSED` on
its tree. This section scores what it scores on this one. Neither is evidence about the other.

### Only C1 measures a latency, and the reason is a finding against this pass's own preregistration

**§3 of the preregistration declared C2 "the cell that tests intra-partition polling", explicitly
contrasting it with A6's cell and closing "C2 is that evidence or nothing is". That declaration was
wrong, and C2 as declared has the same defect it was written to avoid.** (The harness's own C2
`caveat` field put it more strongly still — *"THE ONLY cell that establishes anything about
intra-partition polling"* — and that string is the instrument's, not the contract's; a draft of this
section quoted it as though it were §3's. Corrected here.)

C2, C3 and C4 fire **inline**, from a callback the publishing thread itself invokes. The very next
statement that thread executes is a cancellation check. So `cancel_requested → cancel_observed` is
**~0 by construction** — the 0.001 ms is the cost of an atomic swap and a `Cell::replace`, not a
property of the code being quick. This is exactly what `CANCELLATION-AND-TRACING.md` §1 established
about A6's cell, and it applies unchanged to two cells this pass declared as its answer to it.

**Their `MET` verdicts are therefore vacuous** — an artifact compared against a budget. They are
printed above because the artifact recorded them and this section does not edit the artifact's
fields; the authority for calling them vacuous is amendment **A1**, which states it in the
preregistration itself: *"C2/C3/C4's `observed` figures may not be quoted as latencies, and their
`MET` verdicts against the 100 ms budget are **vacuous**."* (A draft of this section instead cited a
preregistration rule "forbidding reporting a cell without its verdict column". **No such rule
exists** — that citation is withdrawn.)

**The triggers are not re-tuned.** §8 forbids re-declaring a trigger after seeing where it landed, and
that is the same discipline under which the fifth section refused to re-tune its own overshooting
`Querying` trigger. What C2 and C3 do establish is real and unchanged: **a cancel raised inside a
partition write, and one raised immediately before the fsync, both end the operation and leave
nothing** — the intra-partition seam is reachable and acted upon, 14 of 14.

Measuring intra-partition *latency* needs an off-thread trigger, as C1 has. That is declared future
work, not something to fix here by moving a declared line.

### C1, the one real measurement

Seven `observed` samples: **0.101, 1.024, 2.016, 2.180, 11.925, 13.870, 14.964 ms** — and beside
them, as §3 requires and in the same sentence rather than later in the subsection, the same seven
trials' `acknowledged`: **3.957, 6.069, 6.137, 6.579, 15.667, 20.961, 21.941 ms** (p50 **6.579**,
max **21.941 ms**).

The shape is the mechanism. Four `observed` samples land under 2.2 ms and three between 11.9 and
15.0 ms — which is what a **10 ms poll cadence** produces: a cancel arriving just before a wakeup is
seen at once, one arriving just after waits out the interval plus scheduling. The gap between the two
clusters is 9.7 ms. That is **consistent with** the `PUBLISH_STREAM_POLL_INTERVAL` constant at n = 7;
it is not an identity, and this section does not claim the distribution *is* the constant.

**This is the window the fifth section could enter only by timing luck, 1 trial in 7.** It is now
reachable on purpose, 7 of 7, because `QueryRunning` is emitted only when a batch has been demanded
and none has arrived. **That pairing is a comparison of trigger determinism, not of latency** — it
counts how often a declared trigger reached its window, which no clock decides and the canary does
not gate. No timing figure of the fifth section's is compared with any timing figure here.

Against the budget: `observed` max **14.964 ms** against 100 ms — **met by ~6.7× on the measured
maximum**, with `acknowledged` max **21.941 ms** beside it and carrying no budget.

**What it is not.** 14.964 ms is a *measurement*, not a bound. `CANCELLATION-AND-TRACING.md` §3 is
explicit that the 10 ms cadence is exact while the latency it produces is not derivable — waking on
time needs the OS scheduler, which is an unbounded external section on a machine saturated by a 5 GB
publish. **No figure here may be quoted as a ceiling.**

**The sort-window caution, carried verbatim from `CANCELLATION-AND-TRACING.md` §3** because this is
the section where a reader would otherwise reach for the withdrawn number:

> **An earlier revision of this table called 25.625 ms "the acknowledgement bound for the whole
> pre-first-batch window". It is withdrawn**, for the same reason the `262,144 B ÷ 10 MB/s = 25.0 ms`
> claim on `PUBLISH_WRITE_CHUNK_BYTES` was withdrawn: it netted a code-controlled cadence against
> unbounded external sections, and "the whole window" was false besides. **No figure in the sixth
> section may cite it as a bound.**

**And one place this pass tripped over its own withdrawal, recorded rather than tidied away.** The
preregistration's C1 predicted *"`observed` ≤ 25.625 ms (the derived bound)"* — citing as a bound the
figure the semantics file had **already withdrawn** one commit earlier. The prediction came in true
(max 14.964 ms), and **that agreement may not be read as the withdrawn bound holding.** A measurement
landing under a number that was never a bound says nothing about the number. The prediction is
reported as what it was — a guess that happened to be right — and the withdrawal stands.

## Tracing overhead — below noise, and the sign is why

145 MB control, ABBA after a discarded warm-up, six runs per arm:

| arm | p50 | p95 | all samples (ms) |
|---|---|---|---|
| tracing **off** | 756.924 ms | 857.110 ms | 732.545 · 744.924 · 756.924 · 786.217 · 808.240 · 857.110 |
| tracing **on** | 743.433 ms | 896.491 ms | 702.092 · 721.264 · 743.433 · 771.997 · 833.066 · 896.491 |

**Both order estimates, reported separately and deliberately not averaged**, as §3 C5 requires and A2
item 2 required of the earlier A/B:

| order | samples (ms) | p50 |
|---|---|---|
| **off first** | 786.217 · 756.924 · 808.240 | 786.217 |
| **on first** | 702.092 · 771.997 · 833.066 | 771.997 |

Delta at p50 over the pooled arms: **−13.491 ms, −1.78 %** — tracing *on* is nominally faster, which
is the clearest available evidence that the difference is noise rather than a cost. It is evidence,
not proof: at n = 6 per arm with ranges that overlap almost completely, a negative sign is what a
null effect looks like, not a demonstration of one. **No overhead is measurable at this scale**, and
because the number is negative it is reported as "below noise" rather than as a speedup, which would
be the same error in the other direction.

**A declared deviation, disclosed rather than left to a reader to notice.** `NEXT-CUT.md` rev 2 asks
for the overhead cell at **n ≥ 7 per state**; the preregistration declared **n = 6** and the harness
ran 6. This section scores the cell as declared, because the preregistration was committed before the
run — but **which document wins is not this section's call to make.** `NEXT-CUT.md` rev 2's own header
says the tighter form binds where it tightened a claim, and a preregistration that loosened a brief's
sample floor without saying so is exactly the drift that document exists to stop. **Flagged for the
human rather than decided here.** Either way the cell does **not** meet the brief's floor, and the
sentence below is
therefore weaker than "what the brief asked for": if enabling tracing had shifted p50 beyond noise,
that figure would have to be printed beside every trace-derived number below. It did not, at n = 6.

## The consistency demonstration, and the question it settled

Trace-derived values against the instruments that already measure the same thing, **same run**,
`dropped_records: 0` so the exact comparisons are valid to make:

| | traced | `StreamStats` | consumer | |
|---|---|---|---|---|
| batches | 204 | 204 | 204 | **exact** |
| rows | 100,000 | 100,000 | 100,000 | **exact** |
| time to first batch | 57.759 ms | — | wall 58.087 ms | **contained**, as designed |

Containment rather than equality on the timing pair is deliberate: the outer clock starts before the
lease is acquired and stops after the batch is serialized, so demanding equality would be demanding
that the code between them cost nothing.

**Agreement corroborates both instruments against the preregistered boundary definitions — it does
not "validate" them in the abstract**, which is the wording `NEXT-CUT.md` rev 2 requires and the
distinction it requires it for. `StreamStats` is the counter every earlier section of this file rests
on, and the spans agree with it exactly *where the preregistration declared the two to be counting
the same events*. Two instruments agreeing is evidence that neither miscounts what both were pointed
at; it is not evidence that the boundary they were pointed at is the right one. **No unexplained
disagreement arose, so this cut carries no unresolved instrumentation discrepancy** — the condition
rev 2 attached to piece 2's validation claim.

### Where the sort actually happens — a title this section can no longer claim, corrected by the eighth section

> **Withdrawn.** This subsection's own question is still open. `ViewportQuery::all()` — the query the
> cell below actually runs — is `RowOrdering::Unordered`: no `ORDER BY`, no sort to locate. The
> architect's ruling for the eighth section's cut caught this on inspection of `engine/src/stream.rs`
> before any new measurement ran, and it is recorded here rather than smoothed into a silent rewrite.
> **The numbers below are unchanged and still hold** — n = 1, "recorded, not established", exactly as
> this section always said — only the causal story "this is the sort" is retracted. What the
> `sql_prepared → execute_returned` dominance actually reflects is **positional, not causal**: the
> cost falls somewhere inside `Statement::stream_arrow` — which binds parameters and executes in one
> call, a seam the vendored `duckdb` crate does not expose on this path — before `execute_returned`.
> *What within that call* produces the cost (IO, DuckDB's own query-plan execution, Arrow
> materialization, or some mix) is **not established, at n = 1 or otherwise**; the eighth section
> states this limit explicitly rather than filling it with a second unmeasured claim. What n = 7 per
> viewport *does* independently establish, in the eighth section's own session and own trials, is the
> same **positional** split — cost before `execute_returned` dominating cost after it — not a deeper
> account of what that cost is. See the eighth section in full.

`CANCELLATION-AND-TRACING.md` §2 named the sort question open: with an `ORDER BY`, does DuckDB sort
inside `stream_arrow`, or inside the first `next()`? The fifth section's window sits on one side of
that line and no measurement said which. **Neither does this cell** — it has no `ORDER BY` — but the
two spans below still answer a different, real question: which side of `stream_arrow`/`next()` the
bulk of query-window cost falls on, positionally.

Both segments are trace-derived, so the preregistration's §C6 requires the drop count printed beside
them regardless of whether it is zero: **`dropped_records: 0`.**

| segment | ms | share |
|---|---|---|
| `sql_prepared → execute_returned` | **55.109** | **96.3 %** |
| `execute_returned → first_source_row` | 2.127 | 3.7 % |

**Withdrawn: "The sort is inside `stream_arrow`."** There is no sort in this query. What the split
actually shows, positionally — confirmed independently at n = 7 per viewport by the eighth section —
is that whatever `stream_arrow` itself costs dominates the query window, and the first fetch from it
is nearly free. *What* `stream_arrow` spends that cost on is not decomposed here or in the eighth
section; see that section's own stated limit.

**Both segments are n = 1 — recorded, not established**, by this file's own standing rule that one
sample gives an order of magnitude and not a distribution. What makes the *location* claim more than
one sample is a direction rather than a number: **the first segment dominated in every attempt that
ran this cell, including the three invalidated ones.** That is a qualitative statement and it is
deliberately kept qualitative — A1 forbids carrying any attempt-3 number forward, attempts 1 and 2
are invalidated artifacts, and the canary gates timing numbers rather than directions. **A draft of
this section said "the ratio held at roughly 25:1 across all three attempts". That is withdrawn:**
four attempts ran the cell, not three, and their ratios are not all roughly 25:1. The magnitudes of
the invalidated attempts are not quoted here, and the ratio of the run of record — 25.9:1 — carries
n = 1 like the segments it comes from.

**Scope, stated because it is easy to over-read:** this is the 145 MB control, not 5 GB. It says
which side of `stream_arrow`/`next()` the cost falls on — the question this subsection can actually
answer, now that "the sort" is withdrawn as its label. It says nothing about how long that cost runs
at hero-slice scale, and the 5 GB figure is not derivable from it.

### The figure this section deliberately does not print, and the caveat that stops it

The instrument stamps `partition_sync_start` / `partition_sync_end`, so a *"which term dominates the
418 ms"* decomposition is mechanically available. **It is not printed, and the reason is a limit the
design note declared before the run rather than one discovered after it.** Carried verbatim from
`CANCELLATION-AND-TRACING.md` §7:

> **`TRACE_BUFFER_RECORDS` is reached in normal use, and on the publish path it truncates in a
> *biased* way.** The 145 MB consistency cell is safe **because it does not fill the buffer at all**
> — its own harness asserts `dropped == 0` before making any exact claim, and the claim rests on that
> assertion rather than on any property of first occurrences.
>
> An earlier revision of this bullet said "first occurrences are never what gets dropped". **That is
> false and it was load-bearing, so it is withdrawn.** Drop-with-count is *positional*, not
> name-aware: once the buffer is full, every later record goes, first occurrence or not — including
> `publish_cancel_observed` and `publish_staging_removed`, which is to say the cancellation instant
> the instrument exists to time. **The rule that replaces it: no segment whose endpoint occurs after
> the buffer filled may be derived from a trace with `dropped > 0`.**
>
> **On the publish path it does not hold, and this bounds what the sixth section may claim.**
> `write_inner` stamps four marks per partition (`partition_create_start`, `partition_write_start`,
> `partition_sync_start`, `partition_sync_end`) plus one `batch_full` — five records per partition.
> At a 4,096-record ceiling that is roughly the **first 819 partitions of the fifth section's
> ~5,700**, and they are the *earliest* ones: the cold-writeback-cache end of the run. The C2/C3
> cancellation cells deliberately fire after `PARTITION_FLOOR = 100`, with the cache loaded — **the
> opposite population.**
>
> So a "which term dominates the 418 ms" figure derived from `partition_sync_*` describes early,
> cold-cache partitions and **may not be generalised to the run**. `dropped()` reports how many
> records were refused but not which. Any such figure must be printed with that scope attached, or it
> is unfalsifiable in exactly the way this instrument exists to prevent.

The 145 MB consistency cell escapes this entirely — it reports `dropped_records: 0`, so its exact
comparisons rest on an assertion the harness makes before it claims anything, not on a property of
which records survive. **The publish-path decomposition has no such escape at 5 GB and is therefore
left unmeasured rather than published with a scope caveat that would swallow the figure whole.**

## Findings

### 1. The sort window is cancellable, measured, and the mechanism is visible in the distribution

C1, both intervals together as §3 requires: `observed` p50 **2.180** / max **14.964 ms** — the
budget-bearing one — beside `acknowledged` p50 **6.579** / max **21.941 ms**. 7 of 7 on target,
against a 100 ms budget. The bimodal shape is consistent with the 10 ms poll cadence rather than a
curiosity — at n = 7 that is a reading of the distribution, not an identity. The
fifth section's own diagnosis — that the interrupt had always been attached and the *consumer* was the
thing that could not look — is what this closes.

### 2. Two of this pass's own cells cannot measure what they were declared to measure

C2 and C3 fire inline and therefore report ~0 by construction. Recorded as a finding against the
preregistration rather than presented as a success, because the preregistration named C2 as the cell
that would settle intra-partition polling and it does not. **An off-thread trigger is required, and
declaring one now would be re-tuning after seeing the result.**

### 3. `acknowledged` is uniformly 22–33 ms across every write-path cell, and that is the interesting half

C2/C3/C4's acknowledged windows cluster tightly (22.961–32.841 ms across 21 trials) despite three
different trigger points. That window contains staging removal over ~100 partition files and the audit
record's fsync — the class-(b) sections that carry no budget by declaration. **The consistency of the
number across trigger points is evidence that it is dominated by the teardown rather than by where the
cancel landed**, which is the same conclusion the design note reached from the source.

### 4. The engine's own refusal caught a harness bug that two attempts could not

Attempt 2 died on principle 8 refusing a silent conversion. A harness asking for a column that does
not exist got a typed refusal naming the columns that do. Recorded because the non-negotiables are
usually discussed as constraints on the product, and here one worked as a diagnostic.

### 5. The canary earned its cost

Attempt 3 produced 28 on-target trials and a complete, plausible, internally coherent set of numbers —
p50s in the right places, a bimodal C1, sensible acknowledged windows. **It was wrong**, and the only
thing that said so was an instrument measuring the machine rather than the code. A pass without it
would have published those numbers with no way to know.

### 6. This pass recorded its failures better than its success — and its own record misled a reviewer

**All three invalidated attempts retained a console; the run of record did not.** The whole-file
rehash duration existed only as console output, so for attempt 4 it is simply gone — while the same
quantity remains readable for **two of the three** thrown-away attempts (attempt 1's console was
captured only from mid-run and has no rehash line either). A draft of this section quietly filled that
hole with **attempt 2's** figure. Review caught it, and it is withdrawn rather than corrected, because
there is nothing to correct it to.

**The second half is the more instructive one, because the recording defect propagated into the
review itself.** `binary-pin.json` names attempt 3's tree pin in its `source_pin` field — not because
the binary is attempt 3's, but because attempt 4's tree pin was taken *after* the run and did not yet
exist. Review read that field, concluded the pinned binary predated A1's settle, and marked it
blocking. **A mis-labelled pin produced a confident, wrong conclusion about which code ran** — which
is precisely the failure mode this pass argues instruments exist to prevent, occurring in the pass's
own instrument metadata. **What resolved it was reading outside the retained artifact set** — the
pinned binary's own bytes, which still carry A1's format literal that attempt 3's console never
printed. Nothing in `target/slice-evidence/cancel-rescore/` could have separated the two readings,
which sharpens the lesson rather than softening it: the evidence set was complete enough to record
the numbers and not complete enough to say which build produced them.

The corrections are procedural and cost nothing: **retain the run of record's console; take the tree
pin before the run; take the binary pin after the last source edit and have it name the tree pin it
belongs to.** The general lesson is narrower and worth more than the three: **a provenance field that
is merely stale is more dangerous than one that is missing**, because a missing field prompts a
check and a stale one answers the question wrongly.

## What could not be measured, and why

- **Intra-partition cancellation *latency*.** Needs an off-thread trigger; the declared ones fire
  inline. Future work, declared rather than retrofitted.
- **Whatever `stream_arrow` costs, at 5 GB.** C6 runs on the 145 MB control and has no `ORDER BY` —
  "the sort" was withdrawn as this cost's label, above. Which side of `stream_arrow`/`next()` it falls
  on is positionally consistent at n = 1, across every attempt that ran the cell, and how long it
  takes at 5 GB scale is neither located nor derivable from it. "Established" is this file's word for
  n ≥ 7 and is not used of either segment at this scale.
- **Which term dominates the publish write path at 5 GB.** The spans exist; the trace buffer's
  positional drop makes any such figure describe the first ~819 of ~5,700 partitions — the cold-cache
  population, and the opposite one from where the cancellation cells fire. Declared as a limit before
  the run, quoted verbatim above, and left unmeasured rather than published with a caveat larger than
  the claim.
- **`temp_directory` / `memory_limit`.** Still unreachable — `Lease::connection()` is `pub(crate)` by
  design. A ~7 GB sort can still spill somewhere unrecorded. Carried forward from the fifth section as
  an open ADR-010 rule 6 gap, closed by nothing here.
- **Anything on macOS or Linux.** Windows reference profile only.
- **The data-plane half of the span model.** `protocol/data-plane` does not depend on the engine, and
  giving it that dependency would create the coupling `engine/tests/slice.rs` exists to forbid.
- **The run of record's own whole-file rehash duration.** A provenance gap in this pass's record
  rather than a measurement limit — see gap 1 above. All three *invalidated* attempts retained a
  console; **the run of record did not**, which is why this one cannot be closed from the artifacts.
  A pass that keeps a console for its failures and not for its success has the retention policy
  backwards. (The binary pin, gap 2, *was* closable and is closed: see finding 6.)

## Reproducing this

```bash
# 0. The contract, then the semantics. Both committed before the harness existed.
#    kernel/CANCEL-RESCORE-PREREGISTRATION.md  (incl. amendment A1)
#    kernel/CANCELLATION-AND-TRACING.md

# 1. Pin the TREE first -- this pass took attempt 4's tree pin AFTER the run, which brackets
#    nothing (pin-tree.mjs's own header: "A pin taken after the build brackets nothing").
node kernel/scripts/pin-tree.mjs > target/slice-evidence/cancel-rescore/tree-pin-before.json
cargo build --release --workspace --tests --locked

# 1b. Compare the tree after the build, then pin the BINARY -- after the last source edit and
#     after the build, naming the tree pin it belongs to. This pass's binary pin named a stale
#     tree pin, and a reviewer read it as the wrong build.
node kernel/scripts/pin-tree.mjs --compare target/slice-evidence/cancel-rescore/tree-pin-before.json
node kernel/scripts/pin-tree.mjs --binaries target/release/deps/cancel_rescore-*.exe \
  > target/slice-evidence/cancel-rescore/binary-pin-before.json

# 2. Correctness gate on the same build.
cargo test --release --locked

# 3. The six cells. REFUSES to generate a fixture; re-hashes the 5 GB file ONCE, before the trial
#    loop, and refuses on mismatch. Attempt 3's console recorded 968.81 s for the whole test --
#    the 120 s opening settle included -- and A1's six 60 s settles add ~6 min: budget ~22 min.
#    TEE THE CONSOLE -- this pass did not, and its rehash duration is unrecoverable because of it.
#    -> target/slice-evidence/cancel-rescore/cancel-rescore.json
cargo test --release --test cancel_rescore -- --ignored --nocapture --test-threads=1 2>&1 \
  | tee target/slice-evidence/cancel-rescore/run-of-record-console.txt
```

## Raw artifacts (`target/slice-evidence/cancel-rescore/`, gitignored)

`cancel-rescore.json` (run of record) · `attempt-1-invalidated-no-trigger-fired.json` ·
`attempt-2-invalidated-wrong-attribute.json` · `attempt-3-invalidated-by-canary.json` · the three
invalidated attempts' consoles — **and no console for the run of record** · `tree-pin.json`
(attempt 3) · `tree-pin-attempt4.json` (run of record) · `tree-pin-discrepancy.json` ·
`binary-pin.json` (**correct hash, wrong `source_pin` label — see the provenance gaps**)

**The two tree pins differ by exactly one file**, `kernel/tests/cancel_rescore.rs`, which is amendment
A1's settle. Recorded in `tree-pin-discrepancy.json` rather than repaired, so the difference is
checkable rather than asserted. That same file compiles into the pinned test binary — which is what
makes `binary-pin.json`'s stale `source_pin` field misleading, and what makes the rebuild check that
resolved it decisive.

## Instrument sources (committed)

`kernel/tests/cancel_rescore.rs` — **the new file**, holding all six cells of this pass.
`kernel/tests/scale_pass_a6.rs` is untouched by this cut and remains **byte-identical** to the source
that produced the fifth section's A6 phases, for the reason that file gave for leaving
`scale_pass.rs` alone. C4 re-implements A6's trigger *definition* inside `cancel_rescore.rs`; it does
not re-run `scale_pass_a6.rs`.

`engine/src/trace.rs` · `engine/src/stream.rs` · `kernel/src/publish/mod.rs` — the instrument and the
code it measures. `kernel/tests/publish_cancellation.rs`, `trace_spans.rs`, `wire_bytes_invariant.rs`
— the deterministic tests, which run in the ordinary suite and assert no latency.

---

# Seventh section — 2026-08-08 — time-to-first-batch: two levers, measured factorially

**Contract:** `kernel/FIRST-BATCH-AND-PRUNING-PREREGISTRATION.md`, committed at `60d3d57` **before**
the harness existed. Every cell, ceiling, sample count, verdict rule and invalidator below comes from
that document; this section applies them and decides nothing.

## What this section may not claim, stated before any number

- **No number here is differenced against any earlier section.** Different session, different build,
  different tree. Both gates are scored within this session or not at all.
- **A plan is not evidence that IO was excluded.** "The predicate was built" and "fewer bytes were
  read" are different facts, and the second section's mistake was to time the first while believing
  the second. Every pruning claim below rests on a read-volume measurement.
- **B1's numbers are layout-variant results** — a different file with a different content hash — and
  are never stated as a same-file claim.
- **Build cost and query benefit are never netted.** No "pays for itself after N queries" appears.
- The cancellation figures are a **re-assertion of a property**, not a preregistered scored cell, and
  nothing in the gate verdicts rests on them.

## Scope

Windows 10 Pro 19045 · Intel i9-9980HK, 8 cores / 16 threads · 63.7 GiB RAM · SSD · release build.
Nothing here says anything about macOS or Linux — the same limit `docs/07` places on ADR-003. The
read-volume instrument is Windows-only and is declared so.

**Metered-safe held in the strong sense: `Cargo.toml` and `Cargo.lock` are byte-identical to their
state before this cut.** Parquet metadata is read through DuckDB's own `parquet_metadata()` rather
than by promoting the `parquet` crate out of the `fixture` feature — which would also have put a
**second footer reader in the shipped binary beside DuckDB's**. One reader would decide what to prune
and the other would execute the query, and a disagreement between them would surface as a
wrong-but-plausible result set rather than as an error: the class `docs/01` principle 8 exists to keep
signalled rather than absorbed. (An earlier draft cited ADR-010 rule 2 here. Rule 2 is about
authoritative coordinate lookup and cursor unprojection and does not reach this; the citation is
withdrawn rather than restated more loosely.)

## Every attempt, and what invalidated it

| # | outcome |
|---|---|
| 1 | **INVALIDATED — instrument defect. 384 trials, 384 `unmeasured` rows, zero samples.** |
| 2 | **Run of record.** 384 trials, **0 unmeasured**, 0 inadmissible cells, every canary phase inside the declared bound. |

**Attempt 1's mechanism, because the way it hid is the transferable part.** The child printed its
result behind an `@@TRIAL@@` sentinel and the driver used `strip_prefix` to find it. libtest with
`--nocapture` writes a test's output *on the same line as its own progress banner* —
`test night_trial_child ... @@TRIAL@@{…}` — so the sentinel was never at position 0 and the prefix
never matched.

**The mechanism was smoke-tested before the run, and the smoke test passed.** A human reading
`test night_trial_child ... @@TRIAL@@{"error":…}` on a console sees the sentinel and the JSON and
concludes it works; a human does not notice that the sentinel is not first on the line, because a
human does not parse. **The check passed a person and would never have passed the code.**

Two changes, chosen to make the class unreachable rather than the instance fixed: the result now
travels through a **file** whose path the driver passes in, so no formatting layer remains between
child and driver; and the driver runs a **mechanism self-check — one full trial, parsed — before the
opening settle and before any measurement**. The second matters more than the first. Attempt 1 ran
for minutes and produced a complete-looking artifact in which every row said the same thing; a run
that cannot measure should cost seconds, not a night.

## The fixtures — three at the 145 MB class, and why the third exists

| id | writer | order | bytes | row groups | B2 admissibility | SHA-256 |
|---|---|---|---|---|---|---|
| `S` | arrow-rs `ArrowWriter` | raster by id | 151,629,665 | 13 | admissible | `fe61e704fcc01d40…` |
| `C` | **DuckDB** `COPY` | raster by id | 150,775,777 | 13 | admissible | `ffc76db3c8e9bed2…` |
| `H` | **DuckDB** `COPY` | Hilbert order 16 | 151,514,313 | 13 | **`id-ranges-overlap`** | `ced7c1ac070a1bbc…` |

**`C` is the writer control and the pass would be worthless without it.** A clustered variant is
written by DuckDB's parquet writer while the fixture it is made from is written by arrow-rs;
compression matches but page size, dictionary thresholds, encodings and statistics emission do not.
Differencing `H` against `S` would measure *writer plus order* and attribute all of it to order.
`C` is the identical `COPY` with only the `ORDER BY` changed, so `H` against `C` differs by the row
order and by nothing else. **§9 of this section prices the confound, and it is not small.**

Row counts: whole **100,000** · near-quarter **25,281** · far-quarter **25,108** · 1/64 **1,600**.

**What that check is, stated at its real strength.** §3 called for an *exact predicted* row count
asserted by the harness. What the harness does is run the same engine, the same predicate and the same
fixture once up front and record the answer — so it catches **nondeterminism**, and it cannot catch a
wrong filter, because the reference and the trials share every input. The fifth section derived
826,281 and 51,984 **by arithmetic before the fixture existed** and called that the strongest
instrument check in its cut; this pass did not do that, and the weaker check is labelled rather than
promoted. The numbers are independently right — 159² = 25,281 for the near quarter, 157 × 159 + 145 =
25,108 for the far — but **nothing in the run checked that**.

**The far-quarter viewport is new**, and it is the only viewport in which lever B2's mechanism can
reach time-to-first-batch. Every viewport this repository had registered is south-west anchored, so
on a raster-ordered file its matching rows are at the **front** of the scan while row-group
elimination removes work from the **tail**.

## Admissibility

384 trials over 64 cells: 32 untraced cells at n = 7, traced twins at n = 7 for the two gate
viewports and n = 3 elsewhere (labelled not verdict-bearing). One process per trial. Interleaving by
a committed pure function, never a runtime shuffle.

**Every cell passed the admissibility criteria that were checked, and the criteria that were not
checked are named rather than implied.** Each cell reached its declared n with **one** row count, one
filter plan, one cut policy and one wire fold across all its trials — and the read-volume counter was
likewise a single distinct value across all seven trials of all sixty-four cells, which is stronger
than the "p50" the tables below imply.

**Not checked, and therefore not claimed:** §7 also makes admissibility conditional on "source pin and
binary pin identical **before and after** the phase". **No tree pin was taken at all**, and the binary
was hashed **once, after** the run (`binary-pin-attempt2.txt`, 03:15:19, against a pass that ended at
03:13:33). A pin taken after a run brackets nothing — this file's sixth section says exactly that in
its own first reproduction step. The summarizer applies the five criteria it can see and reports on
those; it never evaluates a pin, the disk floor or the fixture hashes. **This is the sixth section's
finding 6 recurring in a new place**, and it is recorded rather than smoothed over.

Canary spread, in phase order: rep-0 **1.5 %**, rep-1 **1.0 %**, rep-2 **2.4 %**, rep-3 **2.8 %**,
rep-4 **2.4 %**, rep-5 **1.7 %**, rep-6 **1.4 %**, pass-end **1.0 %**, against the declared 10 %.

**Every 145 MB figure below is warm-OS-cache, and no figure in this section is a cold-open number.**
Three files of ~150 MB against 63.7 GiB of RAM, 384 back-to-back trials. The read-volume instrument
counts *logical* bytes the process asked the file system for — which is exactly the IO-exclusion
question, and is **not** a statement about disk traffic.

## The baseline everything else rests on: how much DuckDB already prunes, with no index in the path

`NIGHT-CUT.md`'s premise was that parquet's per-row-group statistics "prune nothing today because the
fixture's rows are spatially random". **Both halves are false.** `fixture::parcel` places feature
`id` at grid `(id % cols, id / cols)` — the fixture is **raster-ordered**, so its row groups have
narrow y envelopes and DuckDB's zone maps can and do use them.
`kernel/SCALE-PASS-PREREGISTRATION.md` §1d had already declared this as a confound.

Read volume of a plain `ScanOnly` query, as a share of the file. Nothing injected, nothing built:

| file | whole | near quarter | far quarter | 1/64 |
|---|---|---|---|---|
| `S` raster | 148,601,340 (**98.0 %**) | 78,579,653 (**51.8 %**) | 77,618,512 (**51.2 %**) | 22,444,625 (**14.8 %**) |
| `C` raster | 148,227,249 (98.3 %) | 86,966,899 (57.7 %) | 77,017,173 (51.1 %) | 25,146,407 (16.7 %) |
| `H` Hilbert | 149,072,353 (98.4 %) | 99,860,366 (65.9 %) | 87,339,342 (57.6 %) | **12,870,243 (8.5 %)** |

**A quarter-extent query on a raster-ordered file already reads about half the file and no more.**
It is the number every claim in this section has to be read against, and no document in this
repository stated it before.

**What is observed and what is inferred, kept apart.** *Observed:* the process asked the file system
for 78,579,653 of 151,629,665 bytes, identically in all seven trials. *Inferred:* that this is DuckDB
skipping six of thirteen row groups on the covering-bbox statistics — from the external index's own
`kept: 7` and the arithmetic agreement, 7/13 = 53.8 % against 51.8 % measured, the gap being the
columns a viewport query does not read. **Nothing here observed DuckDB's internal group selection.**
This section's own rule — a plan is not evidence that IO was excluded — applies one level down, to
this sentence.

## Lever A — the time budget

**Total `time-budget` cuts across all 384 trials of the pass: 0.** The budget was armed in half of
every cell pair and **never fired once**.

The registered prediction said it would not, on arithmetic: at `avg_vertices = 100`,
`estimate_bytes(1, 100) ≈ 2 012 B` per row, so a 64 KiB first batch is about 33 rows — far inside one
2 048-row DuckDB chunk. The traced twins turn that prediction into a measured mechanism, and the
number is more extreme than the arithmetic suggested:

| segment | over all **160** traced trials | p50 |
|---|---|---|
| `query` — `sql_prepared → first_source_row` | **21.314 – 74.576 ms** | — |
| `source_to_first_batch` — the window the budget bounds | **0.030 – 0.255 ms** | **0.053 ms** |

`dropped_records` is **0** in every traced trial, so both segments are fully derivable.

> **A correction to an earlier draft of this table, kept because the error is instructive.** The
> summarizer prints one representative trace per cell — `summarize-first-batch.mjs` takes the first
> traced trial — and a first draft transcribed those thirty-two single samples as though they were
> ranges over the cells, reporting `0.0 – 0.1 ms` under an `n` column that said 7. Over all 160 traced
> trials the true maximum is **0.255 ms** and **30 of 160 trials exceed 0.1 ms**. The figures above are
> over every trial. The conclusion is unaffected; the number was wrong.

> **Lever A is an 8 ms budget on a window whose worst observed value is 0.255 ms** — thirty times
> smaller — with a p50 of 0.053 ms. Time to first batch is, at this shape, almost entirely the query
> window: the time DuckDB spends before handing over its first chunk. **Batch-cutting policy cannot
> reach it on this shape.**

Every budgeted-versus-size-only pair is therefore a null, and the ranks confirm it rather than merely
failing to reject: 10/49 to 38/49 across sixteen pairs, against the 42/49 the gate requires. The p50
differences that look favourable (43.7 vs 47.5 ms at `S`/far-quarter) carry 38/49 and are dispersion,
not effect.

**What this does and does not establish.** It establishes that the budget does not fire on **this
shape**, and why. It establishes nothing about whether a time budget would help where a first batch
genuinely takes milliseconds to accumulate — a sparse filter returning few matching rows per chunk,
or a feature class far larger than `docs/08`'s Polygons. The mechanism was never exercised, so this is
an **unexercised null**, which is a weaker statement than a measured refutation. It is stated that way
deliberately.

The lever's standing after this pass is as a **declared behaviour with a structural guarantee** —
`stream_for_publish` cannot acquire it, by a typed refusal, so ADR-017 §12's determinism cannot become
timing-dependent — and **not as a first-pixels lever at this shape**.

## Lever B2 — row-group pruning, and the exact size of what it excluded

The plan was in force and correct in every cell: `RowGroupsPruned` keeping **7 of 13** row groups at
both quarters and **2 of 13** at 1/64, returning the same rows and the same wire fold as `ScanOnly` in
all seven trials of every cell.

**It excluded exactly zero bytes of IO.** Not "a negligible amount" — zero, to the byte, in four of
four viewports:

Both columns are the **whole-trial** counter, which includes `Dataset::open`'s identity scan on both
sides — so the difference remains exactly attributable:

| viewport | B2 read, less the index build | `ScanOnly` read | difference |
|---|---|---|---|
| whole | 148,601,340 | 148,601,340 | **0** |
| near quarter | 78,579,653 | 78,579,653 | **0** |
| far quarter | 77,618,512 | 77,618,512 | **0** |
| 1/64 | 22,444,625 | 22,444,625 | **0** |

**How that figure was recovered, disclosed because it was not read directly.** The run-of-record
instrument takes its read-volume counter at the **start of the trial**, so a `RowGroups` cell's raw
figure also contains `Dataset::open` and the index build's SHA-256 content hash — which reads the
whole file. The raw figures were 300,231,005 / 230,209,318 / 229,248,177 / 174,074,290, and
subtracting the file's own 151,629,665 bytes recovers the four numbers above **exactly, in all four
cells**. What is corroborated four times is that the excess is **viewport-independent and exactly one
file size**; the index build's own read volume is confirmed **once**, not four times. That is enough
to make the subtraction a measurement rather than an argument, and it is worth stating at its real
strength rather than at a flattering one.

**Why a subtraction and not a direct reading.** The second binary records a query-scoped counter, and
the 5 GB phase uses it — but adding a 145 MB cell to read it directly would have meant a cell outside
the preregistered set, measured on a different binary from every cell it would be compared against.
The subtraction is exact and stays inside the run of record; a fresh reading would have been cleaner
and would not have been comparable.

**The mechanism, because a number without one is a tuning excuse.** DuckDB was already skipping
exactly the row groups this index computes — the same statistics, the same predicate, one level up. So
the injected id-range predicate re-expressed a decision already made, and the only thing it could add
was a longer statement. **This is the second section's finding again, one level up**, and it is the
sharper form of it: there, an index answered the predicate the *scan* already computed; here, an index
answered the predicate the *storage layer* already computed.

Against the gate: **0 of 8 cells beat their `ScanOnly` twin**, ranks 6/49 to 28/49. The index build
cost **575.6 ms p50 over a 556.7 – 636.0 ms range** across every `RowGroups` trial — reported
separately and never netted against any query time.

> **Correction to the record, stated because the old sentence is still true in its own regime.**
> `build_sql`'s planner comment says the fixed-grid index "adds work while DuckDB still scans the
> GeoParquet bbox columns". That held for the second section's fixture, which had **a single row
> group** and therefore nothing to prune. It does not hold for a multi-row-group file, where DuckDB
> prunes first and an index adds work to what is left. Both regimes are now measured, and the comment
> is bounded rather than withdrawn.

## Lever B1 — clustered layout, against its writer control

`H` against `C`. Time to first batch, p50 and pairwise rank at n = 7 vs 7:

| batch | viewport | verdict | p50 (H vs C) | rank | read volume H vs C |
|---|---|---|---|---|---|
| size-only | whole | does not beat | 72.2 vs 69.9 | 19/49 | 149.1 MB vs 148.2 MB |
| size-only | near quarter | does not beat | 59.0 vs 52.4 | **0/49** | 99.9 MB vs 87.0 MB |
| size-only | far quarter | does not beat | 52.2 vs 47.6 | **0/49** | 87.3 MB vs 77.0 MB |
| size-only | **1/64** | **BEATS** | **23.3 vs 24.6** | **45/49** | **12.9 MB vs 25.1 MB** |
| budgeted | whole | does not beat | 71.9 vs 68.6 | 17/49 | 149.1 MB vs 148.2 MB |
| budgeted | near quarter | does not beat | 60.2 vs 51.8 | **0/49** | 99.9 MB vs 87.0 MB |
| budgeted | far quarter | does not beat | 53.3 vs 48.7 | **0/49** | 87.3 MB vs 77.0 MB |
| budgeted | **1/64** | **BEATS** | **23.0 vs 24.3** | **47/49** | **12.9 MB vs 25.1 MB** |

**Registered prediction 3, scored.** §8 predicted, from the files' own footers before the run, that
the curve would **lose at both quarters and win at 1/64**. **The direction is confirmed in all three
viewports.** The magnitude prediction is **not**: the footer table predicted raster and Hilbert both
reading 7 of 13 groups at the far quarter, i.e. no difference, and the run measured **51.1 % against
57.6 %** — the curve reading materially *more*. The prediction's arithmetic counted groups; the
measurement counts bytes, and a group is not a fixed number of bytes when the rows inside it differ.
**Direction: confirmed. Magnitude: wrong, and recorded as wrong.**

Clustering does not help or hurt uniformly — it **trades a viewport's height against its area**:

> Raster order's row groups are **full-width strips**, so a viewport costs its **height**. A
> space-filling curve's row groups are **compact blobs**, so a viewport costs its **area plus a
> boundary term**. At a quarter viewport — half the extent in each axis — height (≈ 50 %) beats
> area-plus-boundary, and the curve loses **0 of 49**, decisively. At 1/64 the area term wins, the
> curve reads **half the bytes** (8.5 % of the file against 16.7 %), and it beats **45–47 of 49**.

The read-volume column is what makes that a mechanism rather than a story: at 1/64 the clustered file
reads 12,870,243 B where the control reads 25,146,407 B, and at the near quarter it reads
99,860,366 B where the control reads 86,966,899 B. **The layout changed how much IO the storage layer
could exclude, in both directions, and first-batch time moved in the same direction every time.**

**Direction only — the magnitudes do not scale together and the section does not pretend they do.**
Read volume is a whole-query quantity; first-batch time is a ~33-row prefix. Per megabyte of extra
read the first-batch cost is 0.51 ms at the near quarter, 0.45 at the far quarter and 0.11 at 1/64 — a
factor of roughly 4.5 across the three. Sign is a finding; slope is not.

### The writer confound, priced — and it is larger than the layout effect

`C` against `S`: the same rows in the same order, from a different parquet writer.

| batch | viewport | p50 (C vs S) | rank |
|---|---|---|---|
| size-only | whole | **69.9 vs 49.8** | 0/49 |
| size-only | near quarter | 52.4 vs 47.3 | 1/49 |
| size-only | far quarter | 47.6 vs 47.5 | 22/49 |
| size-only | 1/64 | 24.6 vs 24.4 | 21/49 |

**A whole-file first batch is 20.1 ms slower from the DuckDB-written file than from the arrow-rs one —
about 40 % — with the same rows in the same order.** In absolute terms that is about fifteen times the
layout effect at 1/64 (1.3 ms), though the two are at different viewports and in relative terms it is
40 % against 5.3 %. Had `H` been differenced against `S`, as the brief's setup implied, the writer's
20 ms would have been reported as a property of Hilbert ordering. **The control is the reason this
section can say anything about layout at all**, and its cost was one extra file and one extra
`ORDER BY`.

**And it corroborates itself:** `C` and `S` produce byte-identical wire folds and payload totals at
every viewport, so the 20 ms separates two encodings of provably the same rows in provably the same
order.

## Cancellation, re-asserted with pruning in the path

Required by `NIGHT-CUT.md`; **not a preregistered scored cell**, so it is reported as a property
assertion and nothing in the gate verdicts rests on it. Interval labels are the frozen ones from
`kernel/CANCELLATION-AND-TRACING.md` §2, and ADR-018's vocabulary is cited **descriptively** while it
remains Proposed.

Seven trials, near-quarter, plan `RowGroupsPruned { total: 13, kept: 7, ranges: 1 }` in all seven:

| interval | figure | budget |
|---|---|---|
| `cancel_requested → cancel_observed` | 0.000 · 0.001 · 0.000 · **0.060** · 0.000 · 0.000 · 0.000 ms | `docs/08` 100 ms — **met**, 7/7 |
| `cancel_requested → the consumer's terminal return` | 6.365 – 8.089 ms | **none attached** (`cancel_acknowledged` class) |

**A sub-microsecond cross-thread figure is at the instrument's resolution** — the trace stamps a
`QueryPerformanceCounter`-backed `Instant`, whose tick is on the order of 100 ns — **and is read as
"observed essentially immediately", never as an exact latency.** This file's first section records that
wall-clock thresholds on cross-thread handoffs are the wrong instrument; the same caution applies to
an implausibly good reading as to an implausibly bad one.

One engine change made this measurable: `PRODUCER_CANCELLED` is now stamped on the producer's
**row-loop** cancellation exit as well as at the chunk boundary. That is the path that actually fires
— a chunk is thousands of rows — so the interval `docs/08`'s budget is scored on previously had no
endpoint on the common path, and an always-absent span reads as "did not happen".

## The 5 GB spot cells — the `ScanOnly` arm, which is the whole of what was declared

`NIGHT-CUT.md` scopes 5 GB spot cells to "ScanOnly vs **the winning** pruning candidate" and requires
a "same-session `ScanOnly` re-baseline first". No candidate won, so this is that re-baseline and
nothing else. The clustered 5 GB cell is a morning item and the reason is in §"What could not be
measured".

The scale pass's own fixture, **reused and never written to**: 5,004,376,705 B, **403 row groups**,
SHA-256 `5ae955c5fb7ee4d3…` — identical to the hash the fifth section recorded, and re-hashed after
the last trial with no change.

**This also closes a caveat the fifth section left open.** That section recorded its 403 row groups as
**derived, not verified**. This pass read the count **from the file's own footer** — 403 — so the
figure is now a measurement of the artifact rather than an arithmetic prediction about it. Row counts came out at **3,300,000 / 826,281 / 825,700**; the first two
are the fifth section's own preregistered numbers, arrived at independently here.

n = 7, one process per trial, every canary phase inside the bound (0.7 – 3.6 %):

| batch | viewport | rows | first batch p50 / p95 | total p50 | read: whole trial | read: query only | share (whole trial) | `time-budget` cuts |
|---|---|---|---|---|---|---|---|---|
| size-only | whole | 3,300,000 | 68.7 / 75.0 ms | 15,247.7 ms | 4,905,189,027 | 4,886,046,331 | **98.0 %** | 0 |
| size-only | near quarter | 826,281 | 80.2 / 93.7 ms | 5,437.6 ms | 2,525,760,273 | 2,506,617,577 | **50.5 %** | 0 |
| size-only | far quarter | 825,700 | 82.3 / 94.0 ms | 5,333.1 ms | 2,526,948,620 | 2,507,805,924 | **50.5 %** | 0 |
| budgeted | whole | 3,300,000 | 65.1 / 73.4 ms | 15,598.3 ms | 4,905,189,027 | 4,886,046,331 | 98.0 % | 0 |
| budgeted | near quarter | 826,281 | 78.0 / 93.7 ms | 5,451.8 ms | 2,525,760,273 | 2,506,617,577 | 50.5 % | 0 |
| budgeted | far quarter | 825,700 | **78.7 / 82.4 ms** | 5,509.7 ms | 2,526,948,620 | 2,507,805,924 | 50.5 % | 0 |

**Both scopes are printed because this is the only table that can print both**, and because a first
draft of this row carried **82.4 / 94.0 ms** — this cell's p95 written into the p50 column and the
neighbouring row's p95 copied down. It was the one table no script produced. Corrected here, and the
lesson is in the instrument list below.

**Lever A fired zero times here too**, on a file 33 times larger with 31 times the row groups.

**The finding this arm was worth running for — and the one comparison this section makes across
phases, with its licence stated first.**

> **Timings are never compared across phases here, and byte counts are — deliberately, and this is the
> carve-out.** The reason the cross-phase rule exists is machine drift, and this pass measured its
> own: the 400 M canary read **106.9 ms** during the 145 MB phase and **54.7 ms** during the 5 GB
> phase twenty minutes later, on the same machine. **A factor of two.** Every phase held its own 10 %
> bound, which is what makes each phase's timings good; comparing timings across them would be
> comparing two machines, and **this section does not do it anywhere.**
>
> A read-byte counter is not subject to that drift and this run proves it rather than assuming it:
> the counter produced **exactly one distinct value** across all seven trials of all sixty-four
> 145 MB cells and all seven of every 5 GB cell. It is a deterministic function of the file, the
> query and the reader — not of how fast the machine was. **That is the licence, it is narrow, and it
> extends to nothing else in this section.**

At the **whole-trial** counter — the same scope the 145 MB table uses — a quarter-extent query reads
**50.5 %** of the 5 GB file at **403** row groups against **51.8 %** of the 145 MB file at **13**.
Both are near half. **The 1.3-point difference is not tested and no claim is made about it**: each
figure is a single deterministic value, so there is no dispersion to test against, and the files differ
in more than their row-group count.

What that supports is the weaker and sufficient statement: **raster order's strips span the full x
extent at every granularity, so a quarter-extent viewport costs about its height — near half — at both
13 and 403 row groups, and finer row groups did not reduce it.** Registered prediction 4 therefore
rests entirely on its other half, that the *curve's* boundary term shrinks as groups get smaller, and
that half is exactly what the morning cell has to measure. **Half the prediction has support; the
interesting half is untested.**

> **No figure in this table is differenced against the fifth section's**, in either direction, even
> though its whole-file total (15,247.7 ms here) is close to what that section recorded. Different
> session, different build, different binary pin.

## Gate verdicts — stated separately, as the preregistration requires

"Beat" is **p50 lower and ≥ 42 of 49 pairwise** at n = 7 vs 7. A p50 delta alone is not a pass.

### Lever A — **does not enter the default planner.**

Zero budget cuts in 384 trials; no cell beats its twin; best rank 38/49. The window the budget bounds
is 0.0–0.1 ms. **An unexercised null**, not a refutation — see the qualification above.

### Lever B2 — **does not enter the default planner.** It failed the condition the lever exists for.

| gate condition (§8) | result |
|---|---|
| plan is `RowGroupsPruned { kept < total }` in all 7 trials of the gate viewport | **met** — 7 of 13 kept |
| pruning **evidenced** by read volume strictly lower than `ScanOnly`'s | **FAILED — difference is exactly 0 bytes** |
| first-batch p50 lower and 42/49 at the far quarter | **failed** — size-only 45.4 vs 47.5, rank **28/49**; budgeted 48.0 vs 43.7, rank **6/49**. §8 does not say which policy scores the gate, so both are printed and neither passes |
| digest sets identical, row count equals prediction | **row counts met; digest sets NOT evidenced by this run** — see the note below |
| no whole-file regression, and `FilterPlan::WholeFile` with no viewport | **met** — plan observed `whole-file`, no predicate injected, no regression |
| …**and zero metadata work** | **NOT met, and the harness is why.** `first_batch_factorial.rs` builds the index for every `RowGroups` cell *before* it looks at the viewport, so the whole-viewport trials paid **575 ms** and read an extra 151,629,665 B for an index the plan then never consulted. Whether the **planner** would do metadata work at whole-file is a different question, and **this run cannot answer it** |
| metadata build cost reported separately and never netted | met — 575 ms p50 |

The **evidence-of-pruning** condition is the one that matters — the first condition, that the plan was
built at all, was met — and failing it is why this is a **structural** verdict rather than a close
call: an index over the same statistics DuckDB itself uses cannot exclude IO DuckDB has
not already excluded. The fixed-grid index's planner note stands, and now has a companion.

### The comparison §6 declared, and what the run of record actually recorded

**Disclosed because a gate row cites it.** §6 declares three comparisons: a **SHA-256** over each
cell's concatenated wire bytes, and a **sorted per-feature digest set `{(id, sha256(coords))}`** across
plans and across files. The harness implements the first as a **64-bit FNV-1a fold**, not SHA-256, and
**does not compute the per-feature digest set at all**.

What that means for each claim:

- **Within a cell** — the fold is identical across all seven trials of all sixty-four cells. A
  mismatch would have been conclusive; a match is strong evidence and not a proof, and the substituted
  hash is weaker than the one declared. Recorded as a substitution, not as compliance.
- **Across plans, one file** — `ScanOnly` and `RowGroups` produce **byte-identical folds and payload
  totals** at every viewport, with equal row counts. That is as strong as a digest set for this pair.
- **Across files** — `C` and `S` produce **byte-identical folds and payload totals at every
  viewport**, which is direct evidence that the writer control really is the same rows in the same
  order, and is worth stating as a result rather than an assumption. `H` does **not**: its payload
  totals differ from `C` by **+128, +64, −256 and 0 bytes** at whole, near, far and 1/64, with equal
  row counts throughout. That is the size and sign of Arrow IPC padding under different batch
  boundaries — a reordered file cuts batches at different features — but **this run does not rule out
  any other cause**, because the comparison that would have (the per-feature digest set) was not
  computed.

The digest-set property *is* asserted, by `engine/tests/first_batch_and_pruning.rs` in the ordinary
suite, on a smaller fixture at a different row-group size. **That is a different file, so it supports
the code and not this run**, and the gate rows above say so rather than borrowing it.

### Lever B1 — **cannot enter the default planner; there is nothing to switch.** Its gate is split.

| viewport | verdict |
|---|---|
| quarter extent — **the declared gate viewport** | **FAILS — 0 of 49**, both batch policies. Decisively worse. |
| 1/64 extent — *not a gate viewport*, reported as a result | **beats — 45/49 and 47/49**, with half the read volume |

**Neither row is scored on the digest-set condition §8 also requires**, for the reason in the note
above. The 1/64 row is therefore a first-batch and read-volume result, and is not a gate pass in any
sense — it is not the gate viewport, and one of the gate's conditions was not evidenced.

**B1's declared gate is the quarter extent, so B1 does not pass.** The 1/64 result is real, mechanism
-backed and reproducible, and it is reported as what it is: a pass at a viewport that is not the gate.
It changes the roadmap without clearing a bar.

**A pass would have yielded a proposed ADR, not a code change**, and that stands: reordering a user's
file at import is new product behaviour with its own reproducibility grade (ADR-005) and its own
recorded-operation obligation (`docs/05`, `docs/01` principle 3). Nothing in this cut touches the
import path.

## Findings

### 1. At this shape, time to first batch is the query window, and batch policy cannot reach it

`source_to_first_batch` is **0.0–0.1 ms** in all 32 traced cells while `query` is **22.8–70.5 ms**.
The third section decomposed first pixels from the *consumer's* side and found start-up dominant;
this is the same conclusion from the producer's side, at a finer grain, and it retires batch-cut
policy as a first-pixels lever on this shape. **What is left is the query window itself** — statement
preparation, DuckDB's planning, and the scan up to its first chunk.

### 2. DuckDB already prunes row groups on the covering-bbox statistics, and the number is large

A quarter-extent query reads **51.8 %** of a 13-row-group file and a 1/64 query **14.8 %**, unaided.
This is stated nowhere else in this repository, and it silently underlies every viewport number in the
fifth section, whose fixture was the first here to have more than one row group.

### 3. An external index over the same statistics is redundant — measured at exactly zero

Not "small": **0 bytes** of difference in 4 of 4 viewports. The corrected design lesson in `docs/07`
— an index must replace IO, not re-filter it — needs a second clause: *and it must replace IO the
storage layer would not have skipped anyway.* A candidate that reads the same statistics DuckDB reads
can never satisfy it.

### 4. Storage layout trades a viewport's height against its area, and the crossover is measurable

Strips cost height; blobs cost area plus a boundary term. Measured on one file pair, one session: the
curve loses **0/49** at a quarter and wins **45–47/49** at 1/64, with read volume moving 87.0 → 99.9 MB
and 25.1 → 12.9 MB respectively. **This is the most useful thing the pass produced**, because it says
the right question is not "should we cluster?" but "cluster for which viewport size, at which
row-group granularity?"

### 5. The two levers are mutually exclusive on one file, structurally

B1 reorders rows by a space-filling curve; B2 needs the identity column's per-row-group statistics
monotone and disjoint in file order — a property **ADR-016 never promised** and that raster order
happened to provide. Clustering destroys it, so the clustered file is refused by name
(`id-ranges-overlap`), which the setup table records for `H`. "B2 on the clustered file is out of
scope" is a fact about the design, not a scoping choice. ADR-016 is not amended; the property is
checked per file and refused when absent.

### 6. The parquet **writer** moved first-batch time more than the layout did

20 ms at whole-file — about 40 % — for the same rows in the same order. Any future layout, sort-order
or ingest experiment in this repository must control for the writer or it is measuring one thing and
reporting another. The control cost one extra file and one extra `ORDER BY`.

### 7. An instrument that a human validated and the code could not

Attempt 1's smoke test passed a person and would never have passed the parser. The durable fix was
not the parser — it was moving the mechanism check **into the run, before the settle**, so a harness
that cannot measure fails in seconds instead of producing a complete-looking artifact full of
identical `unmeasured` rows.

### 8. DuckDB's parquet writer does not honour an arbitrary `ROW_GROUP_SIZE`

*(Findings 5 and 8 rest on deterministic tests and on a pre-run implementation probe, **not** on the
run of record. They are stated here because they bound what the run means, and they are marked so a
reader does not take them for measurements of this pass. §0's disclosure rule for pilot numbers
applies to both.)*

It flushes on a multiple of its vector size: 8,000 rows asked for groups of 1,000 came out as **four**
groups. Row-group size decides how much extent one group spans, which is exactly what a layout
experiment varies, so `write_clustered_variant` now verifies the written layout against the request
and **refuses** on mismatch rather than letting a differently-grouped variant reach a results table.

## What could not be measured, and why — declared rather than discovered

### Declared in the preregistration and **not run** — recorded `unmeasured`, as the unattended rule requires

These four were registered and did not happen. Each is a gap in this pass, not a property of the
system, and none was noticed until review.

1. **§5's traced trial per 5 GB cell — `unmeasured — not implemented in the harness.`** §5 declares
   "5 GB spot cells run untraced, **plus one traced first-batch-only trial per cell**". All six 5 GB
   cells ran untraced and `first-batch-5gb.json` contains no trace at all.
2. **§5's trace-buffer drop check at 5 GB — `unmeasured — depends on (1).`** §5 predicted that a
   5 GB whole-file trace would fill the 4 096-record buffer and drop ~2 547 records, and said that
   would be "checked in the artifact via `dropped_records`, not assumed". It was neither checked nor
   assumed; the prediction is simply open. The `dropped_records = 0` reported above is the **145 MB**
   result only.
3. **§2's post-run re-hash of the 145 MB fixtures — `unmeasured — hashed once, before the trial
   loop.`** §2 says every fixture's SHA-256 is "recorded … and **re-verified after the last trial**".
   The 5 GB phase does re-hash and its before/after hashes match; the 145 MB phase does not. That
   asymmetry makes the omission read as rigour that was applied when it was not, which is why it is
   listed here rather than left to a reader to notice.
4. **§6's empirical determinism assertion for lever A — `unmeasured — never run.`** §6 declares
   "publish identical inputs under a build carrying the budgeted policy and confirm manifest and every
   partition byte-identical". Only the **structural** half exists — `stream_for_publish` cannot
   acquire the budgeted policy, enforced by a typed refusal and asserted by a unit test. The
   structural guarantee is arguably *why* the empirical run is unreachable, but **an argument is not a
   measurement** and the registered item is not discharged by one.

### Out of scope by declaration

- **The 5 GB clustered cell, which would test the pass's most interesting registered prediction.**
  Prediction 4 says the crossover in finding 4 should **move with row-group count**: the boundary term
  shrinks as groups get smaller, so at the 5 GB class's **403** row groups the curve should win at a
  quarter where at 13 groups it loses 0/49. Running it needs a Hilbert rewrite of a 5 GB file — a
  DuckDB sort of 5 GB and 5 GB of disk — that nothing declared, and `NIGHT-CUT.md` scopes 5 GB spot
  cells to "ScanOnly vs **the winning** pruning candidate". **An unattended run may not improvise past
  a declared scope**, so it is a morning item, and it is the first thing to schedule.
- **Browser-probe cells: deferred to morning**, per `NIGHT-CUT.md` rule 3 — they need a visible
  window. No number in this section depends on one.
- **Physical disk traffic.** The read-volume instrument counts *logical* bytes the process asked the
  file system for, warm OS cache included. That is precisely the IO-exclusion question and it is not a
  statement about disk.
- **Any other platform.** The instrument is Windows-only.
- **Whether a time budget helps where a first batch takes milliseconds to accumulate.** Finding 1
  says the window is 0.1 ms *on this shape*; it says nothing about a sparser one.

## Obligations this cut creates and does not discharge

- **`engine/README.md` still carries the unqualified sentence** that finding 3 bounds — "…while
  DuckDB still scans the GeoParquet bbox columns … Until an index prunes actual IO, `ScanOnly` is the
  preferred product plan." The planner comment in `engine/src/stream.rs` **was** bounded in this cut;
  the README was not. Owed.
- **`docs/07`'s open item "an index that prunes actual IO"** needs finding 3's second clause — *and
  that the storage layer would not have skipped anyway*. This cut is engine-only and does not edit
  `docs/`. Owed.
- **ADR-019 is not filed.** The architect drafted a proposed ADR on metadata-derived IO exclusion to
  be filed **only if a lever passed its gate**. Neither did, so it is not filed, and this is recorded
  so a successor does not go looking for it. Its five draft clauses stand as the discipline any future
  candidate must meet whether or not the ADR is ever written.

## Morning items

*(Items 1 and 2 were authorized by the operator and **ran** on 2026-08-08 under amendments A1 and A2;
their results are in the amendment section at the end of this file. They are left here as written, so
the night's own record of what it deferred and why stays legible.)*

1. **The 5 GB clustered cell** — the test of registered prediction 4, that finding 4's crossover moves
   with row-group count. At 403 row groups the curve should win at a quarter where at 13 it lost
   0/49. Needs a Hilbert rewrite of the 5 GB fixture and a declaration covering it. **Schedule first.**
   → **ran under A1.** Confirmed on read volume; the first-batch gate still fails.
2. **Browser-probe cells**, deferred per `NIGHT-CUT.md` rule 3. → **ran under A2.** All eight
   comparisons `not-resolvable-by-this-instrument`.
3. **A decision on whether ingest-layout policy earns an ADR.** Finding 4 says clustering is a
   *conditional* win, not a win, so the ADR would have to carry the condition — which is the honest
   version and a better decision than an unconditional one would have been.

## Reproducing this

```bash
# 0. The contract. Committed BEFORE the harness existed; read it before the numbers.
#    kernel/FIRST-BATCH-AND-PRUNING-PREREGISTRATION.md   (commit 60d3d57)

# 1. Build from clean. A number taken on a debug build is not a smaller number, it is not a
#    measurement -- the harness refuses one.
cargo build --release --tests -p spatial-kernel

# 2. The factorial pass. Generates all three 145 MB fixtures on first run, runs a mechanism
#    self-check BEFORE the opening settle, then 384 trials in 384 processes.
#    Budget ~13 min: a 120 s opening settle, then EIGHT 60 s settles (seven rep-starts plus
#    pass-end), plus the trials. The run of record took 771.31 s.
#    -> target/slice-evidence/first-batch/first-batch.json
BIN=$(ls -t target/release/deps/first_batch_factorial-*.exe | head -1)
"$BIN" the_factorial_first_batch_pass --exact --ignored --nocapture --test-threads=1

# 3. The tables in this section, from that artifact. It scores; it does not decide.
node scripts/summarize-first-batch.mjs

# 4. The cancellation re-assertion. Reuses the fixture from step 2; asserts the property.
"$BIN" cancellation_holds_with_pruning_in_the_path --exact --ignored --nocapture --test-threads=1

# 5. The 5 GB spot cells. REFUSES to generate a fixture and re-hashes the one it finds, before the
#    first trial and after the last.
"$BIN" the_5gb_spot_cells --exact --ignored --nocapture --test-threads=1
```

**A provenance split this section will not paper over.** The factorial pass ran on a binary pinned at
`ab9c5aa43dd7113d…`; the cancellation and 5 GB phases ran on `f6790f56c2891a3c…`, which differs by
two additions — a second read-volume counter in the harness, and the `PRODUCER_CANCELLED` mark on the
producer's row-loop cancellation exit. The second is product code, on a branch that is not taken in a
non-cancelled stream. **Nothing is differenced across the two binaries**: the factorial verdicts come
entirely from the first, and the cancellation and 5 GB figures entirely from the second.

## Raw artifacts (`target/slice-evidence/first-batch/`, gitignored)

`first-batch.json` (run of record) · `summary.md` · `attempt-2-console.log` ·
`attempt-1-INVALIDATED-console.log` · `first-batch-cancel.json` · `cancel-console.log` ·
`first-batch-5gb.json` · `5gb-console.log` · `binary-pin-attempt2.txt` · `binary-pin-phase2.txt` ·
the three 145 MB fixtures.

The 5 GB fixture is the scale pass's own, in `target/slice-evidence/scale-pass/`, reused and never
written to: SHA-256 `5ae955c5fb7ee4d3…`, identical to the hash the fifth section recorded.

## Instrument sources (committed)

`kernel/tests/first_batch_factorial.rs` — the harness: the factorial driver, the child, the
cancellation re-assertion and the 5 GB spot cells.
`scripts/summarize-first-batch.mjs` — the summarizer. **It produced the 145 MB tables and the gate
tables, and it did not produce the 5 GB table or the cancellation table**, which were transcribed by
hand from their artifacts — and the hand-transcribed one is exactly where this section's one
transcription error was found in review. It reads `first-batch.json` only. It also applies §7's
`n = 7` as a *scoring* criterion rather than an *admissibility* one, and labels a traced quarter cell
in a way that could be read as verdict-bearing when §5 says untraced carries every verdict. Both are
recorded rather than silently corrected, because the tables above were read off it.
`kernel/tests/support/mod.rs` — the canary, watchdog and disk gate, unchanged by this cut.
`engine/src/stream.rs` · `engine/src/rowgroup.rs` · `engine/src/layout.rs` — the levers themselves.
`engine/tests/first_batch_and_pruning.rs` · `engine/tests/row_group_seam.rs` — the deterministic
tests, which run in the ordinary suite and assert no latency.

---

## Amendments run 2026-08-08 with the operator present — A1 and A2

**What does not change, stated before anything else.** The verdicts above stand exactly as written:
**neither lever enters the default planner.** A1 re-runs B1's gate at a new class under the same
rule; A2 scores **no gate at all**. No number below is differenced against any number above, and
neither amendment was written by an unattended session — both say in their own first lines that they
were written after the run of record's verdicts were read, and both were authorized by the operator.

**One class of number is compared across phases and one is not, and the line is drawn before it is
used.** The seventh section declared a narrow carve-out: **byte counters** produced exactly one
distinct value across every trial of every cell, so they are a deterministic function of the file,
the query and the reader rather than of how fast the machine was. That licence is restated at the one
place below that uses it, and **it extends to nothing else** — A1 §"What this phase may not claim"
says "**No timing comparison across phases**", and this section makes none. An earlier draft of this
preamble claimed no number below was differenced against any number above; that was simply false of
the read-volume comparison, and the sentence is replaced rather than quietly narrowed.

### Why these ran at all

`NIGHT-CUT.md` deferred two things. **A1** is registered prediction 4 — that finding 4's
height-versus-area crossover **moves with row-group count** — which the night could establish only
half of. **A2** is the browser-probe cells, which rule 3 deferred *without ever specifying what they
were*, so A2 is the declaration that was owed rather than a re-scoping of one that existed.

---

## A1 — the 5 GB clustered cell

Three files at the 5 GB class. The scale pass's own fixture, reused and re-hashed before the first
trial and after the last with no change, plus two rewrites into this cut's evidence directory:

**`G5` is the file amendment A1 calls `S5`.** The contract names the arrow-rs 5 GB file `S5`
throughout; the harness, the artifact and this section call it `G5`, because `S` was already taken by
the 145 MB source and a single letter reused across two classes is how a table gets misread. The
rename is recorded here rather than left for a reader to infer, and no other identifier moved.

| id | writer | order | bytes | row groups | B2 admissibility | rewrite |
|---|---|---|---|---|---|---|
| `G5` (A1's `S5`) | arrow-rs | raster by id | 5,004,376,705 | 403 | admissible | — (reused, never written) |
| `C5` | DuckDB `COPY` | raster by id | 4,976,612,784 | 403 | admissible | 18,544 ms |
| `H5` | DuckDB `COPY` | Hilbert 16 | 5,000,231,051 | 403 | **`id-ranges-overlap`** | 28,600 ms |

Zero clamped centroids in both rewrites. **Finding 5 holds at 5 GB**: clustering costs the file B2
admissibility at 403 row groups exactly as it did at 13, so the two levers remain mutually exclusive
on one file at both classes.

**The row-count check, repaired.** Review found (S13) that the night's "prediction" ran the same
engine, predicate and fixture as the trials and could therefore catch nondeterminism but not a wrong
filter. A1 derives all four counts from the generator's grid **before the phase runs** —
`cols = ⌈√3 300 000⌉ = 1817`, 40 m cell, the last grid row holding 3 300 000 − 1816 × 1817 = **328**
features — and asserts them:

| viewport | derivation | predicted | observed |
|---|---|---|---|
| whole | — | 3,300,000 | **3,300,000** |
| near quarter | 909 × 909 | 826,281 | **826,281** |
| far quarter | 909 × 908 full rows + 328 | 825,700 | **825,700** |
| 1/64 | 228 × 228 | 51,984 | **51,984** |

Two are the fifth section's own registered numbers, arrived at independently here; the far quarter is
this cut's addition and the night had only observed it. A unit test pins the arithmetic against those
registered constants so it cannot drift from `SCALE-PASS-PREREGISTRATION.md` §1b.

n = 7, one process per trial, ScanOnly and size-only only (A1 declares why: lever A's gate is
answered — as an **unexercised** null, which the seventh section is careful to say and this one does
not upgrade — and re-running it would buy a null already held at n = 7 in six cells). Every canary phase inside the
bound: **1.9, 2.1, 3.3, 0.5, 1.5, 4.3, 4.1, 3.5 %**. Zero unmeasured trials.

### Results

| viewport | file | first batch p50 / p95 | total p50 | read (whole trial) | share |
|---|---|---|---|---|---|
| whole | `G5` | 64.8 / 74.7 | 15,915.7 | 4,905,189,027 | 98.0 % |
| | `C5` | 96.4 / 140.0 | 16,431.3 | 4,893,302,870 | 98.3 % |
| | `H5` | 105.9 / 119.4 | 16,414.5 | 4,920,006,862 | 98.4 % |
| near quarter | `G5` | 80.6 / 103.8 | 5,651.5 | 2,525,760,273 | 50.5 % |
| | `C5` | 119.9 / 323.7 | 5,821.3 | 2,509,291,154 | 50.4 % |
| | **`H5`** | 107.6 / 132.8 | **4,265.0** | **1,553,060,895** | **31.1 %** |
| far quarter | `G5` | 81.0 / 105.1 | 5,642.7 | 2,526,948,620 | 50.5 % |
| | `C5` | 134.0 / 161.2 | 5,703.2 | 2,507,427,105 | 50.4 % |
| | **`H5`** | 140.1 / 145.6 | **4,263.0** | **1,479,187,457** | **29.6 %** |
| 1/64 | `G5` | 252.9 / 304.8 | 460.8 | 647,451,443 | 12.9 % |
| | `C5` | 247.8 / 275.3 | 464.8 | 644,620,847 | 13.0 % |
| | **`H5`** | **91.6 / 100.6** | **239.9** | **163,217,277** | **3.3 %** |

### Prediction 4: **confirmed on the mechanism, and the gate still fails**

Those are two different sentences and this section keeps them apart.

**Confirmed, on read volume.** At 403 row groups the curve reads **31.1 %** of the file at the near
quarter against raster's **50.4 %**, and **3.3 %** against **13.0 %** at 1/64. At **13** row groups
the same curve read *more* than raster at a quarter — 65.9 % against 57.7 %. **The crossover moved
with row-group count, in the direction registered in §8 before either run.**

> **This is the one cross-phase comparison in this section, and it is made under the seventh
> section's declared byte-counter carve-out, restated here rather than assumed.** Read counters are
> deterministic: in this phase each of the twelve cells produced **one** distinct `read_bytes` across
> all seven trials, as every cell of the night's sixty-four did, so they are a function of the file,
> the query and the reader and not of how fast the machine was. Both sides are the **whole-trial**
> counter over file bytes — the 145 MB artifact carries no query-scoped counter, so that is the only
> scope in which the two are the same quantity, and the column above is labelled accordingly. The
> licence covers byte counts and **nothing else in this section**; no timing crosses phases anywhere.
>
> **Free corroboration, since it is available:** `G5`'s read volumes here are **byte-identical** to
> the seventh section's 5 GB `ScanOnly` cells — 4,905,189,027 / 2,525,760,273 / 2,526,948,620 —
> across a different binary and a different phase twenty minutes apart. That is direct evidence for
> the carve-out rather than an argument for it.

**What is observed and what is inferred.** *Observed:* the process asked the file system for fewer
bytes. *Inferred:* that the curve's per-row-group envelopes are tighter and its boundary term shrank
as the blobs got smaller. **Nothing here observed DuckDB's row-group selection**, and the seventh
section's rule applies unchanged one level down. The counter is **logical** bytes, warm OS cache
included, on **Windows only**; it is not a statement about disk traffic or any other platform.

**The gate still fails**, and it fails differently from the night, which is the informative part:

| viewport | `H5` vs `C5` p50 | rank | verdict |
|---|---|---|---|
| whole | 105.9 vs 96.4 | 22/49 | fails |
| **near quarter** — the declared gate | **107.6 vs 119.9** | **31/49** | **fails** |
| far quarter | 140.1 vs 134.0 | 20/49 | fails |
| 1/64 | 91.6 vs 247.8 | **49/49** | beats on this metric — see the digest caveat below |

At 145 MB the curve lost the quarter on **p50** at 0 of 49 — decisively worse. At 5 GB it **wins on
p50** and misses only the rank separation, 31 of 49 against the 42 the gate requires. **The sign
flipped; the significance did not clear the bar.** Dispersion in the baseline arm is where the separation went, and **the p95 is the wrong number to
cite for it**: `C5`'s 323.7 ms outlier *gives* `H5` seven of its thirty-one wins. The shortfall comes
from `C5`'s **fast** tail — 93.7 ms and 95.6 ms, both below `H5`'s minimum of 98.1 ms, costing
fourteen pairs on their own. The raw samples are `C5` [323.7, 95.6, 93.7, 133.0, 113.4, 119.9, 121.8]
against `H5` [107.4, 116.1, 98.1, 107.6, 103.3, 132.8, 110.7].

> **The digest-set condition is still not evidenced, and it is a gate condition.** §8 requires
> identical sorted per-feature digest sets, and the harness still records only a 64-bit FNV-1a fold —
> the shortfall the seventh section disclosed, unchanged here. At this class `H5`'s payload totals
> differ from `C5`'s by **+4,672 / −640 / +1,216 / +448 bytes** at equal row counts, with different
> folds, which is the same pattern that section flagged and declined to explain. **No row above is
> scored on that condition**, the 1/64 row included, so none of them is a gate pass in the full sense
> even where the metric it does measure is unanimous.
>
> Two things that *are* clean and worth stating: each of the twelve cells produced **one** distinct
> `read_bytes` and **one** distinct wire fold across all seven of its trials, and **`G5` and `C5`
> produce byte-identical folds and payload totals at every viewport** — direct evidence that the 5 GB
> writer control really is the same rows in the same order, which was assumed rather than shown at
> 145 MB.

**Where the win actually lands is total time, and the first-batch gate cannot see it.** Near quarter
**4,265.0 ms against 5,821.3** (**−26.7 %**), far quarter **4,263.0 against 5,703.2** (**−25.3 %**),
against read volumes falling 38.1 % and 41.0 %. **The two move together in direction and not in
magnitude**, and the section does not claim otherwise.

> **What `total_ms` contains at this class, disclosed because the largest claim in this section rests
> on it.** `RETAIN_PAYLOAD_CEILING` is 256 MiB, so every 5 GB cell folds its wire bytes **inside** the
> timed loop — a fold over 1.4–5.7 GB per trial is in each of these totals. It is uniform across all
> three 5 GB files by construction, so those cells remain comparable **with each other**, which is
> the only comparison made here. It is one more reason no total above is compared with any other
> phase's. The gate is a first-batch gate by declaration and is not rewritten
here to admit a quantity it was not scored on; the number is reported because it is the largest
effect this cut measured, and a reader who only saw the gate row would not know it existed.

### The writer control, larger at 5 GB than at 145 MB

`C5` against `G5` — the same rows in the same order through a different parquet writer:

| viewport | p50 | rank |
|---|---|---|
| whole | 96.4 vs 64.8 | **0/49** |
| near quarter | 119.9 vs 80.6 | 2/49 |
| far quarter | 134.0 vs 81.0 | **0/49** |
| 1/64 | 247.8 vs 252.9 | 31/49 |

**At this class the writer moves first batch by 31.6 ms at whole file, 39.3 ms at the near quarter
and 53.0 ms at the far quarter — and by −5.1 ms at 1/64, where the sign reverses.** Three of the four
are larger than the whole layout effect at the near quarter (12.3 ms). Had `H5` been differenced
against `G5` — the comparison the brief's setup implied — the writer would have swallowed the layout
signal completely and inverted its sign. **The control is again the reason this section can say
anything about layout.**

> **A "the writer effect grows with file size" claim appeared in an earlier draft and is withdrawn.**
> It differenced these figures against the seventh section's 20.1 ms, which is a **timing** comparison
> across phases — the one thing A1 explicitly forbids — and it was not like for like: 20.1 ms is that
> section's **whole-file** cell, whose 145 MB viewport analogues are 5.1 ms and 0.1 ms, and the
> draft's "at the viewports" range silently included a whole-file number and dropped the 1/64 cell
> where the sign reverses. Two points across a changed file size, a changed row-group count, a
> changed binary and a changed phase would not support the claim even if the comparison were
> licensed. **What stands is the within-phase statement above.**

---

## A2 — the browser-probe cells

**No gate is scored here.** B1's gate was decided producer-side and is closed. This phase asks one
question: the producer-side pass found a **1.3 ms** layout win at 1/64 at the 145 MB class — does it
survive to a pixel?

`{S, C, H} × {quarter, 1/64} × {headless, headed}`, n = 7, one page load per trial, layouts
interleaved *within* each viewport × compositor block by a committed rotation. The three files are
the run of record's own, re-hashed; nothing was generated for the probe.

### The criterion, declared before any probe trial ran

A2.1 fixed it while the data did not yet exist: the third section recorded up to **29 ms** of
between-attempt dispersion on a first-pixels p50, and **any difference below that is reported as
`not-resolvable-by-this-instrument`** — neither "no effect" nor a win, because at that scale this
instrument supports neither. A2.1 registered the layout arm as **predicted unresolvable in advance**,
1.3 ms being more than twenty times below the floor.

### Results

**Headless** — canary spread 5.4 %, every cell n = 7, every cell returning its declared row count:

| layout | viewport | rows | first pixels p50 / p95 | full payload p50 | S2 | S3 | S4 | S5 |
|---|---|---|---|---|---|---|---|---|
| `S` | quarter | 25,281 | 162.1 / 173.5 | 1,914.5 | 29.7 | 73.6 | 6.1 | 54.4 |
| `C` | quarter | 25,281 | 166.1 / 179.3 | 2,077.7 | 27.2 | 75.4 | 7.5 | 52.0 |
| `H` | quarter | 25,281 | 153.3 / 184.1 | 1,837.5 | 34.7 | 83.9 | 6.4 | 35.7 |
| `S` | 1/64 | 1,600 | 127.9 / 148.1 | 229.4 | 33.3 | 43.4 | 6.7 | 45.3 |
| `C` | 1/64 | 1,600 | 129.2 / 131.8 | 226.7 | 34.6 | 38.8 | 6.5 | 45.1 |
| `H` | 1/64 | 1,600 | 123.5 / 131.9 | 220.5 | 39.1 | 38.0 | 6.8 | 45.9 |

**Headed** — canary spread 6.5 %, same n and same row checks:

| layout | viewport | first pixels p50 / p95 | full payload p50 | S2 | S3 | S4 | S5 |
|---|---|---|---|---|---|---|---|
| `S` | quarter | 196.8 / 221.0 | 2,104.7 | 38.2 | 71.2 | 7.4 | 79.1 |
| `C` | quarter | 194.8 / 221.2 | 2,131.4 | 36.3 | 73.4 | 6.9 | 79.7 |
| `H` | quarter | 199.4 / 222.0 | 1,949.5 | 34.3 | 86.2 | 6.6 | 73.1 |
| `S` | 1/64 | 172.7 / 180.2 | 261.6 | 35.9 | 44.6 | 6.3 | 86.9 |
| `C` | 1/64 | 179.8 / 199.9 | 285.9 | 37.0 | 46.7 | 7.9 | 81.4 |
| `H` | 1/64 | 165.7 / 271.6 | 262.8 | 35.5 | 44.6 | 6.3 | 84.1 |

**Headless and headed are never pooled** (`PROBE-PREREGISTRATION.md` §1a).

### Verdicts — all eight, and the registered prediction holds

| comparison | headless Δp50 | headed Δp50 | verdict, both paths |
|---|---|---|---|
| `H` − `C` @ quarter | −12.8 ms | +4.6 ms | **not resolvable** |
| `C` − `S` @ quarter | +4.0 ms | −2.0 ms | **not resolvable** |
| `H` − `C` @ 1/64 | −5.7 ms | −14.1 ms | **not resolvable** |
| `C` − `S` @ 1/64 | +1.3 ms | +7.1 ms | **not resolvable** |

> **The claim this licenses, and it is sharper than the producer-side pass can make alone: storage
> layout is an IO and total-time lever, and this instrument cannot see it as a first-pixels lever at
> this fixture class.**
>
> **Stated with its floor, because A2.1's own rule forbids the shorter version.** The instrument
> cannot distinguish "no effect" from "an effect of up to 29 ms"; what it establishes is that the
> producer-side difference — **1.3 ms**, the budgeted arm's 1.315 ms as registered — is more than
> twenty times below what this instrument can resolve, on a consumer path whose S2 alone is
> 27–39 ms. "Does not survive to a pixel" is a reasonable reading and is **not** what was measured.

**The sign result, which A2 named as the only thing this instrument could speak to.** A2 registered
that "what the probe can say is whether the *sign* of the layout effect is still visible at the
pixel". It is at 1/64, where both compositor paths agree with the producer's direction (−5.7 and
−14.1 ms against the producer's −1.3). **It is not at the quarter**, where the two paths disagree with
*each other* — −12.8 ms headless against +4.6 ms headed — and headless disagrees in sign with the
producer's +6.7 ms. All four are far below the floor, so none of this is an effect; it is reported
because A2 asked the question and a silent answer would be a worse one.

**Full payload is the one place a difference is visible, and no verdict is available for it.** `H`
against `C` at the quarter is **−240.2 ms headless and −181.9 ms headed**, in the direction the read
volume predicts and in both compositor paths. **A2.1 declared a floor for first-pixels p50 and for
nothing else**, and this pass characterized no dispersion for full payload — so these are reported as
observations and are not scored. Declaring a second floor now, after seeing them, is exactly what the
first one exists to prevent.

### The first headless block is invalidated, and the two attempts together are the argument for the floor

| attempt | outcome |
|---|---|
| 0a | **abandoned during setup** — the page ran the wrong scenario and the wrong window (defect 1). No artifact retained; the run was stopped once a trial record was read |
| 0b | **abandoned during setup** — the driver could not parse what the page wrote (defect 2). Same run as 0a; both defects were present together |
| 1 | **INVALIDATED by the canary: 53.0 % spread against a declared 10 %.** Artifacts retained |
| 2 | **run of record.** Canary 5.4 % |

**Attempt 1's cells were individually admissible and the *phase* was not**, and the distinction
matters enough to state plainly: all six of its cells reached `admitted: 7`, `dropped: 0` and the
correct row count. Nothing about any single trial was wrong. What failed was the declared per-phase
canary bound, which is a statement about the machine the trials ran on rather than about the trials.
An earlier draft said "no admissible cell"; that was wrong in the direction that flatters the
instrument, and it is corrected here.

**Three instrument defects, all found in use and none in review.**

1. **A stale page bundle, failing silently.** `frontends/canvas-probe/dist/` is a **gitignored build
   artifact**, so nothing in the repository makes it track `src/`. `dist/app.js` carried a filesystem
   mtime of **2026-08-05 13:11** against `src/main.ts` at **2026-08-07 10:30** — both read from the
   working tree during diagnosis and neither retained in an artifact. The page therefore ignored
   **both** `scenario=solo` and `bbox`: every trial streamed the whole 100,000 rows under the
   supersede scenario while being filed as a quarter-viewport solo trial. No error, no warning, and
   timings that looked entirely reasonable. The script now **refuses a bundle older than its source**
   and **asserts each cell's row count** — 25,281 at the quarter, 1,600 at 1/64 — and, since review,
   **exits before any verdict is computed or written** rather than setting an exit code and carrying
   on, which is what it did when this text first claimed it stopped the phase.
2. **The record was read at the wrong level.** `run-probe.mjs` writes a wrapper and the trial lives
   under `results.trial` / `results.segments`; the new script read the top level, found `undefined`,
   and dropped **every trial of that run** while the page loads themselves were fine. (An earlier
   draft put a number on it. The run was stopped partway and no artifact of it is retained, so there
   is no count to cite.) This is precisely the cost that script's own header predicted when it
   recorded its duplication of `run-slice-probe.mjs` as owed.
3. **The instrument loaded the machine it was measuring.** Removing a profile directory is not
   enough — the browser holds it open, so `rmSync` fails with EPERM while the process lives, and
   headless Edge leaves children behind. The retained artifact records **44 profiles still held** at
   the end of the block; a `Get-CimInstance` count taken during cleanup, **in the session and not in
   any artifact**, found **459 live `msedge.exe` processes** whose command lines named a
   `canvas-probe-*` profile. That second figure is a session observation and is labelled as one. That
   is the second section's leak finding recurring in a new place. Browsers are now killed **by
   command-line match** — never by image name, because the operator was at the machine with their own
   browser open — and swept after every trial.

> **What the invalidated block reported, and why the pre-declared floor is the whole point.** It gave
> `H` faster by **46.3 ms** at the quarter *and* `C` faster by **156.6 ms** at 1/64 — two
> "resolvable" verdicts **in opposite directions**, both above the floor. The clean **headless** block
> gives **−12.8 ms** and **−5.7 ms** — same sign, both far below it. **The clean headed block gives
> +4.6 ms and −14.1 ms, which are opposite signs in clean data**, so "same sign" is a property of one
> compositor path and not of the fix; both are below the floor, which is the point that does hold.
> Contaminated data did not look like noise. It looked like a finding.
>
> **What that argues for, precisely.** It was the **canary invalidator** that rejected attempt 1, not
> the floor — no criterion chosen after the fact could rescue a block whose declared 10 % bound was
> breached by five times. The floor's contribution is different and narrower: it fixed *the wording*
> of a verdict before anyone could see which phrasing would flatter the result. The two do different
> jobs, and an earlier draft of this paragraph gave the floor credit for the canary's.

The invalidated attempt's artifacts are retained under
`target/slice-evidence/first-batch/invalidated-headless-attempt1/` rather than deleted.

**Its canary constant differed from the re-run's** — a 40 M-iteration `BigInt` loop costing 4.7 s a
sample and 14 s a point, itself a load on the machine — so the two canary series are two different
instruments and the "53.0 % → 5.4 %" above is **not** a measurement of an improvement. It is two
readings, each valid against its own declared 10 % bound, printed together because the second
instrument is the one the fix was made for.

**And the invalidated block's own timings are quoted above, deliberately.** An earlier draft claimed
no number crossed between the attempts; three do — the two contradictory deltas and the canary pair.
They are cited **as the invalidated block's numbers, to characterize what contamination looks like**,
and never as evidence about layout. That is a different use from a measurement, and the distinction
is the reason they are labelled at every mention rather than dropped.

---

## What A1 and A2 change, and what they leave standing

- **Gate verdicts: unchanged.** Nothing enters the default planner. B1 fails its declared quarter gate
  at both classes; A2 scores nothing.
- **Finding 4 is sharpened rather than overturned.** The height-versus-area trade is real, its
  crossover **moves with row-group granularity** as registered, and the effect is an **IO and
  total-time** effect that does not reach first pixels at this fixture class. "Which granularity, for
  which viewport" remains the framing to carry forward, and now has two points on the curve.
- **Finding 5 confirmed at 5 GB**: the two levers stay mutually exclusive on one file.
- **Finding 6 holds again at a new class, and is not extended.** Within this phase the writer moves
  first batch by 31.6 / 39.3 / 53.0 ms at whole, near and far, and by −5.1 ms at 1/64 — larger, at
  three of four viewports, than the layout effect it would have been mistaken for. **No claim is made
  about how the writer effect scales with file size**: that would be a cross-phase timing comparison,
  which A1 forbids and which two confounded points could not support anyway.
- **Three obligations remain open**, unchanged by these phases: `docs/07`'s "index that prunes actual
  IO" still needs finding 3's second clause; **`engine/README.md`'s** now-bounded twin sentence was
  corrected in this cut but `docs/07` was not; and **ADR-019 is still not filed**, because no lever
  passed a gate, which is the condition the architect attached to filing it.

## Reproducing A1 and A2, and what each ran on

```bash
# A1 — the 5 GB clustered cell. Rewrites C5 and H5 from the scale pass's fixture on first run,
# re-hashes the source before the first trial and after the last, and REFUSES to generate one.
# Asserts the four arithmetic row counts BEFORE the opening settle; a mismatch panics.
cargo build --release --tests -p spatial-kernel
BIN=$(ls -t target/release/deps/first_batch_factorial-*.exe | head -1)
"$BIN" the_5gb_clustered_cell --exact --ignored --nocapture --test-threads=1
#   -> target/slice-evidence/first-batch/first-batch-5gb-clustered.json   (1,443.49 s)

# A2 — the probe. Headless first, unattended; the headed block needs a visible, unlocked session.
cd frontends/canvas-probe && npm run build && cd ../..   # the staleness guard refuses a stale bundle
cargo build --release --bin slice-host
node kernel/scripts/run-probe-layout-ab.mjs   --files 'S=…/parcels-145mb.parquet;C=…-duckdb-raster.parquet;H=…-duckdb-hilbert16.parquet'   --viewports 'quarter=2600000,1200000,2606340,1206340;1-64=2600000,1200000,2601580,1201580'   --extent 2600000,1200000,2612680,1212680 --out-prefix …/probe --trials 7 [--headed]
```

**Pins, and the provenance gaps in them.** A1 ran on test binary `3596ae4e…`, a **third** build
distinct from both of the night's; A2 ran on `slice-host` `194d7468…` and a probe bundle rebuilt at
11:25. **No tree pin was taken for either phase, and each binary was hashed once rather than before
and after** — the same §7 shortfall the seventh section disclosed about itself, recurring here and
disclosed for the same reason. Nothing is differenced across any binary boundary except read-byte
counts under the carve-out above.

**A1's instrument was committed *after* its run, and A2's before.** `kernel/scripts/run-probe-layout-ab.mjs`
was committed before any probe trial existed and says so in its own commit message; `the_5gb_clustered_cell`
and `predicted_rows` lived only in the working tree while A1 ran and were committed afterwards, so
**A1 was not reproducible from any tree in history until that commit**. The two are not symmetric and
an earlier draft presented them as though they were.

## Raw artifacts (`target/slice-evidence/first-batch/`, gitignored)

`first-batch-5gb-clustered.json` · `5gb-clustered-console.log` · `probe-headless.json` ·
`probe-headed.json` · their `probe-trials-*` directories · `invalidated-headless-attempt1/` ·
`binary-pin-phase3.txt` · `binary-pin-slice-host.txt` · the two 5 GB rewrites (~10 GB).

## Instrument sources (committed)

`kernel/tests/first_batch_factorial.rs` — A1's driver, `predicted_rows`, and the unit test pinning it
against `SCALE-PASS-PREREGISTRATION.md` §1b's registered counts.
`kernel/scripts/run-probe-layout-ab.mjs` — A2's driver: the counterbalanced rotation, the bundle
staleness guard, the per-cell row assertion, the kill-by-command-line sweep and the resolvability
criterion applied mechanically.

**Every table in this amendment was transcribed by hand.** `scripts/summarize-first-batch.mjs` reads
the night's `first-batch.json` only and knows nothing of these three artifacts. The seventh section
named hand transcription as the source of its one error; this section says which tables are exposed
to it rather than leaving a reader to find out.

---

# Eighth section — 2026-08-08 — the query window attributed, and the lever the brief expected does not apply

**Contract:** `kernel/QUERY-WINDOW-ATTRIBUTION-PREREGISTRATION.md`, committed before the harness
existed. **Vocabulary:** `engine/src/trace.rs`'s doc comments and `SPANS` constant, committed before
the preregistration. **Brief:** `NEXT-CUT.md` — scope engine/kernel only.

**Every number below is this session's own.** Nothing here is differenced against the night pass's
21.3–74.6 ms `query` figure or the sixth section's n = 1 consistency-demonstration split
(55.109 / 2.127 ms) — both are cited as another-session context only, per the standing within-session
rule this file has kept since the fifth section.

## Scope

Intel(R) Core(TM) i9-9980HK CPU @ 2.40GHz · 8 cores / 16 threads · 63.7 GiB RAM · Windows 10 Pro 19045
· SSD · release build (the harness refuses a debug one). 145 MB class only, `ScanOnly` plan,
`SizeOnly` batching, unordered viewport path — the ordered publish path's query window is not
attributed here (see "What this cut leaves for a future one"). Nothing here says anything about
macOS or Linux, or about the 5 GB hero-slice scale.

**No source-tree pin was taken for this pass, before or after — a disclosed gap, not an oversight
smoothed over.** Started from commit `d84715b`; every file this pass touches was still a working-tree
change, uncommitted, when the trials ran. A reader auditing exactly which tree produced these numbers
has only this document's own git history to go on until the commits this section's numbers are filed
under land.

## What this section corrects before it claims anything

`NEXT-CUT.md`'s own premise needed three corrections before any code was written, and an architect
consultation (per this repository's CLAUDE.md workflow) supplied them, in the same spirit the previous
cut's C1–C3 corrected `NIGHT-CUT.md`:

1. **The brief called the window "lease acquired → first source row" but pointed at the wrong span's
   numbers.** The `query` span (`sql_prepared → first_source_row`) produced the night pass's
   21.3–74.6 ms figure; the window actually described by "lease acquired → first source row" is wider
   and had no name. It is named `lease_to_first_row` below, and it — not `query` — is what this
   section's decision rule is scored against, so that a segment outside `query` (namely
   `statement_prepare`) is not structurally barred from ever being found dominant.
2. **One of the brief's four requested event names cannot exist.** `statement_ready`
   ("prepared/bound, if the API distinguishes") does not: the vendored `duckdb` crate's
   `Statement::stream_arrow` binds parameters and executes in one call, with no public seam between
   the two on this path. Patching the vendored crate to manufacture one was ruled out — a measurement
   against a locally patched dependency describes a binary nobody ships.
3. **A finding this cut's own registered prediction leaned on had an unsupported causal claim.** The
   sixth section's "the sort is inside `stream_arrow`" is withdrawn (see the correction filed against
   that section's title and its "Where the sort actually happens" subsection, above): the cell that
   produced it runs `ViewportQuery::all()` — `RowOrdering::Unordered` — so there was no sort to
   locate. The 55.109/2.127 ms split stands as a number; the label is retracted.
   `kernel/CANCELLATION-AND-TRACING.md` §2's sort question is still open and is unaffected by this
   cut, which measures an unordered window throughout.

## What was built

Three new trace events, all per-operation marks (none inside a per-row loop, per `trace.rs`'s hard
rule): `SQL_BUILT` (caller thread, before a lease exists — outside the scored window by construction),
`PRODUCER_STARTED` (first statement in `produce()`'s body, on the producer thread — spawn-closure
work above it lands in `producer_handoff`, below), `EXECUTE_CALLED` (immediately before `stream_arrow`
is called). Combined with the four events already in place
(`LEASE_ACQUIRED`, `SQL_PREPARED`, `EXECUTE_RETURNED`, `FIRST_SOURCE_ROW`), seven derived spans were
added to `trace::SPANS`: `lease_bind`, `producer_handoff`, `statement_prepare`, `param_assembly`,
`bind_and_execute`, `first_fetch`, and the composite `lease_to_first_row`. `query` and
`source_to_first_batch` keep their original definitions unchanged.

**Additivity is exact by construction and is asserted, not assumed** — by three new structural unit
tests in `engine/src/trace.rs`. `spans_table_has_unique_names_and_unique_event_pairs` proves no span
name and no `(from, to)` event pair repeats in the nine-entry `SPANS` table. Separately —
uniqueness and telescoping are different properties, and one test proving the first does not cover
the second — `the_spans_table_telescopes_by_construction` resolves every leg from `SPANS` **by name**
and proves
the five-leg and three-leg chains telescope to `lease_to_first_row` and `query` respectively
**regardless of what durations the marks record** — it would catch a table entry silently re-pointed
at the wrong event pair, which review confirmed by deliberately corrupting `SPAN_STATEMENT_PREPARE`'s
entry and watching the test fail, then reverting. A third test
(`the_query_windows_events_telescope_exactly`) proves the millisecond `segment_ms` API doesn't lose
that exactness to floating-point rounding. The measurement harness (below) re-derives the identical
check on every **live** trial, in raw nanoseconds, and refuses to promote a trial that fails it into a
cell's statistics — an instrument defect, not a data point.

Both the wire-bytes invariant test (`kernel/tests/wire_bytes_invariant.rs`) and the full trace test
suite pass; nothing here adds a field, a tag or a byte to any wire type (ADR-004 Amendment 4 intact).

## The preregistered cells, and what ran

`kernel/QUERY-WINDOW-ATTRIBUTION-PREREGISTRATION.md`: 145 MB class, the exact fixture already on disk
at `target/slice-evidence/first-batch/parcels-145mb.parquet` (151,629,665 bytes, sha256
`fe61e704fcc01d40…`) reused rather than regenerated, in-session `ScanOnly` baseline, `SizeOnly`
batching, three viewports (`whole`, `near-quarter`, `1-64`), every trial traced, n ≥ 7 per viewport,
one process per trial. The tester ran it end to end: release build, mechanism self-check on the gate
viewport (additivity verified live, `dropped_records: 0`), all three viewports' predicted row counts
asserted before any trial, 120 s opening settle, canary before each of 7 repetitions and at pass-end,
21 trials total (7 × 3), wall time 614.06 s.

**Every canary phase held inside the declared 10 % spread** (0.2 %–4.7 % across all eight
checkpoints). **All three viewports are admissible**: n = 7 each, `dropped_records: 0` in all 21
trials, one filter plan per viewport (`whole-file` for `whole`; `scan-only` for the other two), and
every trial's row count matched the registered prediction exactly (100,000 / 25,281 / 1,600). Zero
errored trials.

### The segment decomposition, p50 / p95 (ms)

| viewport | n | producer_handoff | statement_prepare | param_assembly | bind_and_execute | first_fetch | `query` (composite) | `lease_to_first_row` (composite) | `lease_bind` (reported, not scored) |
|---|---|---|---|---|---|---|---|---|---|
| whole | 7 | 0.218 / 0.296 | 0.154 / 0.221 | 0.000 / 0.000 | 43.710 / 47.518 | 1.667 / 5.067 | 45.327 / 49.160 | 45.722 / 49.531 | 0.001 / 0.002 |
| near-quarter | 7 | 0.194 / 0.351 | 0.163 / 0.179 | 0.001 / 0.001 | 41.383 / 45.009 | 1.090 / 1.547 | 42.474 / 46.014 | 42.790 / 46.394 | 0.001 / 0.002 |
| 1-64 | 7 | 0.220 / 0.227 | 0.172 / 0.179 | 0.001 / 0.001 | 23.602 / 26.279 | 0.319 / 0.621 | 23.853 / 26.639 | 24.255 / 27.037 | 0.001 / 0.002 |

**`query` and `lease_to_first_row` are composites of the leaves beside them, never a sixth and
seventh independent sample, and never summed with the leaves** — `SPAN_LEASE_TO_FIRST_ROW`'s doc
comment states the hazard explicitly, because before this cut the table's two entries were disjoint
and summing every row was harmless; it no longer is.

### Dominance, scored per §5: the p50 of each trial's own segment share — not a ratio of p50s

Rows kept in the order `scripts/summarize-query-window-attribution.mjs` emits them (its `LEAVES`
order), not reordered by result:

| viewport | segment | p50 of per-trial shares | ratio of p50s | ≥ 40 %? |
|---|---|---|---|---|
| whole | producer_handoff | 0.5 % | 0.5 % | no |
| whole | statement_prepare | 0.4 % | 0.3 % | no |
| whole | param_assembly | 0.0 % | 0.0 % | no |
| whole | bind_and_execute | **95.6 %** | 95.6 % | **yes** |
| whole | first_fetch | 3.6 % | 3.6 % | no |
| near-quarter | producer_handoff | 0.5 % | 0.5 % | no |
| near-quarter | statement_prepare | 0.4 % | 0.4 % | no |
| near-quarter | param_assembly | 0.0 % | 0.0 % | no |
| near-quarter | bind_and_execute | **96.7 %** | 96.7 % | **yes** |
| near-quarter | first_fetch | 2.5 % | 2.5 % | no |
| 1-64 | producer_handoff | 0.8 % | 0.9 % | no |
| 1-64 | statement_prepare | 0.7 % | 0.7 % | no |
| 1-64 | param_assembly | 0.0 % | 0.0 % | no |
| 1-64 | bind_and_execute | **97.2 %** | 97.3 % | **yes** |
| 1-64 | first_fetch | 1.3 % | 1.3 % | no |

**No gap between the two dominance figures exceeds 0.1 percentage points anywhere in the table**
(`whole`/`statement_prepare`: 0.4 vs 0.3; `1-64`/`bind_and_execute`: 97.2 vs 97.3;
`1-64`/`producer_handoff`: 0.8 vs 0.9 — all three are ties at this precision, not one largest gap).
Close agreement between the two is expected at this margin — `bind_and_execute` does not merely lead,
it saturates the window — and both are reported rather than one assumed from the other, per §5's
declared rule that the two must never be conflated.

## The registered prediction, and whether it held

Recorded in the preregistration **before any trial ran**, from the architect's ruling: `statement_prepare`
under 5 % of `lease_to_first_row` at every viewport, `bind_and_execute` dominant. Mechanism argued in
advance: `stream.rs` builds `FROM read_parquet(?)` with the file path as a bound parameter, so at
`conn.prepare()` time DuckDB does not yet know which file it will read and cannot open it, read its
footer, resolve the projected columns, or plan the scan — all of that necessarily defers to
`stream_arrow`, the call that does know the file.

**The prediction held at all three viewports, not just the gate.** `statement_prepare`'s share was
0.4 %, 0.4 %, 0.7 % (whole / near-quarter / 1-64) — comfortably under 5 % everywhere — and
`bind_and_execute` was dominant everywhere at 95.6–97.2 %.

## The decision rule (§6), applied mechanically at the gate viewport (near-quarter)

**`bind_and_execute` dominates at 96.7 % of `lease_to_first_row` — the ≥ 40 % threshold, cleared by a
wide margin.** Per `kernel/QUERY-WINDOW-ATTRIBUTION-PREREGISTRATION.md` §6's table, verbatim, for the
`bind_and_execute` row:

> **Not** the prepared-statement lever — that lever cannot reach this segment (it binds and executes
> on every call regardless of whether the statement object was freshly prepared). Recorded as a
> finding; the architect proposes a lever for this segment as its own preregistered phase, not
> improvised here.

**Phase 2 — the prepared-statement / plan-reuse lever this brief was written to build — does not
proceed.** This is the outcome `NEXT-CUT.md` itself pre-authorized ("If scan spin-up dominates →
record the finding, and the architect proposes the appropriate lever *as its own preregistered phase*
rather than improvising past scope") and is a legitimate result of Phase 1, not a failure to find one.

**Why the lever could never have reached this segment, stated plainly rather than left to infer.**
`bind_and_execute` brackets exactly `Statement::stream_arrow` — the one call that binds parameters
*and* executes on this path (correction #2, above). A prepared-statement cache
(`Connection::prepare_cached`, confirmed present in the vendored crate, D10 in the architect's ruling)
removes the cost of `conn.prepare()` — measured here inside `statement_prepare`, which also includes
one pre-prepare cancellation check (`engine/src/trace.rs`'s doc on `SPAN_STATEMENT_PREPARE`) — at
0.4–0.7 % of the window. Even generously crediting the whole segment to `conn.prepare()` alone, the
conclusion only strengthens: it does not touch bind or execute, which happen on every call regardless
of whether the statement object is freshly prepared or reused. A lever built against this brief's
literal text would have spent Phase 2 shortening a segment measured, at every viewport, under one
percent of the window it was meant to move.

## `lease_bind`, reported per §8 — never eligible to win the decision rule, and it did not

`lease_bind` (`sql_built → lease_acquired`) is a class-(b) section
(`kernel/CANCELLATION-AND-TRACING.md` §3) nothing had ever measured before this cut. Measured here at
0.001 ms p50 / 0.002 ms p95 at every viewport — negligible, and structurally unsurprising: every trial
in this harness calls `Dataset::open` before streaming, which primes the connection pool, so
`reused_connection` was `true` in all 21 trials and `lease_bind` never contains a fresh
connection-open/PRAGMA cost here. **This does not establish that `lease_bind` is always negligible** —
only that it is negligible on a warm connection, which is what every trial in this pass measured by
construction. A cold-connection figure is unmeasured and is not claimed.

## First-pixels arithmetic, restated so no one has to ask

This cut moves nothing on the browser-visible first-pixels path, and says so before anyone asks.
`bind_and_execute` (23.6–43.7 ms p50 across the three viewports) is a **producer-side, in-process**
segment, plausibly inside the third section's `S3` window (`OPEN → first bytes`) — plausibly, because
that section's own cell (whole-file, headless, connection reuse on, n = 7: `kernel/RESULTS.md`
"The one number this cut set out to move: S2", S3 = 102.3 ms p50) and this cut's cells are different
sessions and different harnesses, so containment is architectural, not measured, and no subtraction
between them is claimed. **This cut built no lever, so it moves nothing on the browser-visible
first-pixels path — not because a lever here couldn't matter, but because none was warranted (the
decision rule, above) and none was built.**

**`S2` (`query start → OPEN`, the third section's browser-side socket/handshake segment, same cell as
above) sits at 55.6 ms p50 with connection reuse on, and is untouched by this cut** — S2 and the query
window this cut attributes are different segments of the pipeline, measured in different sessions with
different instruments, and nothing here bears on socket handshake time. That same cell's first pixels
after query start stood at 163.9 ms p50 with reuse on, against `docs/08`'s < 100 ms budget — a
third-section figure, restated here only so a reader does not have to go looking for it. **No
`< 100 ms` claim is available from this cut's own work**, and none is made.

## What this cut leaves for a future one

- **A `bind_and_execute` lever is undesignated and unscoped.** The architect's own decision table
  (§6) is explicit that this cut may not improvise one — it would need its own preregistered phase,
  and the mechanism (parallelism across viewports? a different DuckDB scan strategy? something in the
  Parquet reader's own tuning?) is not investigated here.
- **ADR-020 is not filed.** The architect drafted a skeleton — mechanism (`Connection::prepare_cached`),
  cache identity (physical connection × SQL text, dataset/lease-health scoping inherited structurally
  from the pool), revision handling (invalidation on content-pin change, never a per-query content
  hash), a declared ceiling with its reason stated at the call site, and mandatory `discard()` on
  every error or cancellation — conditionally, to be filed only if Phase 1 named `statement_prepare`
  as dominant. It did not. The skeleton stands as the discipline a future candidate for this exact
  lever would have to meet, in case a different query shape ever makes `conn.prepare()` itself the
  bottleneck.
- **Whether `bind_and_execute`'s cost is IO, DuckDB's own query-plan execution, Arrow materialization,
  or some mix is not decomposed here.** The vendored crate exposes no seam inside `stream_arrow` on
  this path (correction #2), so decomposing it further without forking the dependency is out of
  reach for a `duckdb`-crate-based engine — a real limit, not an oversight.
- **Warm-vs-cold connection is not varied.** Every trial in this pass reused a warm connection
  (`lease_bind`'s near-zero cost, above); whether `bind_and_execute` itself has a cold-connection
  component (first query on a freshly opened connection) is unmeasured.
- **The 145 MB class only.** Whether `bind_and_execute` still dominates at the hero-slice's 5 GB
  scale is unmeasured — the sixth section made the equivalent disclaimer about its own C6 cell, and
  it applies here unchanged.
- **The unordered viewport path only, under `ScanOnly`.** The ordered publish path's query window
  (`RowOrdering::ByIdentityAscending`, per `stream_for_publish`) is unattributed by this cut, and the
  preregistration's assumption that attribution is plan-independent — that whatever dominates under
  `ScanOnly` would also dominate under a pruning plan — is untested.

## Reproducing this

```
# 0. The contract, committed before the harness or any number existed.
#    kernel/QUERY-WINDOW-ATTRIBUTION-PREREGISTRATION.md

# 1. Build from clean, release only — the harness refuses a debug build.
cargo build --release -p spatial-kernel --test query_window_attribution

# 2. The pass. Mechanism self-check on the gate viewport BEFORE the settle; 120 s opening settle;
#    7 canary-bounded repetitions across 3 viewports, interleaved; 21 trials in 21 processes.
#    Budget ~10 min. The run of record took 614.06 s (cargo's own test-result line; not itself
#    written into the JSON artifact).
cargo test --release -p spatial-kernel --test query_window_attribution \
  -- --ignored the_query_window_attribution_pass --nocapture --test-threads=1
#   -> target/slice-evidence/query-window-attribution/query-window-attribution.json

# 3. The tables in this section, from that artifact. It scores; it does not decide.
node scripts/summarize-query-window-attribution.mjs
```

## Raw artifacts (`target/slice-evidence/query-window-attribution/`, gitignored)

`query-window-attribution.json` (the run of record) · `query-window-attribution.log`.

## Instrument sources (committed)

`kernel/QUERY-WINDOW-ATTRIBUTION-PREREGISTRATION.md` — the contract. `engine/src/trace.rs` — the
event vocabulary, the derived `SPANS` table, and the three structural unit tests pinning its
uniqueness and additivity. `kernel/tests/query_window_attribution.rs` — the harness: one process per
trial, the mechanism self-check, the live additivity gate. `kernel/tests/support/mod.rs` — the shared
canary, watchdog, disk-floor and now `file_facts` instruments, reused rather than reimplemented a
third time. `scripts/summarize-query-window-attribution.mjs` — applies §5's dominance rule and §6's
decision rule mechanically to the artifact.

**The two tables above (segment decomposition, dominance) are the summarizer's own output, checked
cell by cell against a live re-run of `node scripts/summarize-query-window-attribution.mjs` — not
transcribed by hand.** Every other figure in this section (ranges, percentages restated in prose, the
wall-clock time) is derived by hand *from* those tables and should be checked against them, not
assumed correct on its own — the seventh section named exactly this class of hand-transcription as the
source of its one error, and this section does not claim to be exempt from the same risk merely
because its tables are not.
