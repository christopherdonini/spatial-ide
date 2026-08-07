# Preregistration — the 5 GB scale pass

**Written and committed before the fixture exists, before the instruments exist, and before any
result of this pass has been looked at.** `docs/07`'s hero slice names **5 GB**; everything this
repository has measured is 145 MB. This pass measures the existing engine — **ScanOnly, no index** —
at the declared scale, and validates publish through the class-3 permission boundary at that scale.

**Honest outcomes include budget misses.** A miss here is the baseline index v2 and future work must
beat, and it is written up as a finding rather than engineered around.

| | |
|---|---|
| **Tree under measurement** | branch `cut/scale-pass`, pinned by `kernel/scripts/pin-tree.mjs` **before** the build, re-verified after, and the pre-build pin retained as its own artifact |
| **Binaries** | pinned by SHA-256 after the build; the harness runs from a **private copy**, so nothing can replace a binary mid-run |
| **Fixture** | generated **after this file is committed**, then SHA-256'd and pinned into the run's pin file **before any measurement phase begins**. It is gitignored, so nothing else establishes what was measured |
| **Written before** | the fixture, the instruments, any build of this pass, any run |
| **Amendment rule** | amendments are appended to §10 with a timestamp and a reason. **An amendment made after any result of this pass has been looked at invalidates the run**, and the run is re-done rather than re-described |

---

## 1. The fixture, specified before it is generated

### 1a. The spec, verbatim

| Field | Value |
|---|---|
| `features` | **3_300_000** |
| `avg_vertices` | **100** |
| `hole_every` | **7** |
| `seed` | **0x5EED_2056_0000_0005** |
| `crs_mode` | `CrsMode::DeclaredLv95` |
| `with_covering_bbox` | **true** |
| `identity` | `IdentityMode::NativeUnique` |
| `attributes` | `AttributeMode::None` |
| `license` | `LicenseMode::DeclaredBySource` |
| `chunk` | **8_192** |
| `row_group_rows` | **8_192** |

Three of these are chosen for reasons that are not obvious and are recorded so they cannot later be
read as arbitrary:

- **A new seed** (`…0005`, not the polygon class's `…0002`), so this file can never be confused with
  an earlier fixture in an artifact or a filename.
- **`attributes: None`**, because the 14.50 B/vertex density this pass predicts from was measured
  with no attribute column. Adding one would invalidate the prediction and buys no row here.
- **`license: DeclaredBySource`**, and this is **determinism-critical**. A source-declared license
  needs no `--license-at`; an operator-declared instant is a semantic input *inside* ADR-017 §12's
  determinism surface, and is the easiest way to break the byte-identity row by accident.

`row_group_rows: 8_192` is a **memory** decision, not a layout preference — see the field's own
documentation. The writer's 1 048 576 default would buffer well over a gigabyte before its first
flush at this size.

### 1b. Predictions, committed before generation

| Quantity | Prediction | Derivation |
|---|---|---|
| vertices | **345,414,000** (±0.1 %) | 3.3 M × 104.671, the generator's own measured mean at 100 k |
| rings | **3,771,429** exactly | 3,300,000 + ⌊3,299,999/7⌋ + 1 |
| row groups | **403** | ⌈3,300,000 / 8,192⌉ |
| bytes on disk | **5.01 GB** (5,009,600,000 B), band **4.76–5.26 GB** | 345,414,000 × 14.5039 B/vertex |
| grid columns | **1817** | ⌈√3,300,000⌉ |
| extent | ≈ `2600000, 1200000, 2672680, 1272680` | `E_LO`/`N_LO` + 1817 × 40 m |
| **quarter viewport** `2600000,1200000,2636340,1236340` | **826,281 rows exactly** | (⌊1817/2⌋+1)² |
| **1/64 viewport** `2600000,1200000,2609100,1209100` | **51,984 rows exactly** | (⌊1817/8⌋+1)² — edge amended by A1, count unchanged |
| partitions | **6,633**, band **6,550–6,750** | (345,414,000×20 + 3,300,000×12) / 1 MiB = 6,626, +0.1 % for cut-before-append |
| bundle `data/` | **≈5.74 GB** | 345,414,000 × 16.605 B/vertex measured wire density |
| `manifest.json` | **1.3–2.0 MB** | 6,633 entries × ~200–300 B |

**The two exact row counts are the strongest instrument check in this cut.** They are pure
arithmetic over the generator's grid; a mismatch means the filter, the generator or the CRS
admission is wrong — not that the machine drifted.

**The partition figure corrects this cut's brief**, which says ~2,050. That number is not
reproducible from any model that also reproduces the measured 201–203 batches at 145 MB. The cut is
made on `estimate_bytes = vertices×20 + rows×12` (not on raw coordinate bytes), which predicts 200.8
batches where the tree measured 201 and 203. A second derivation with no model at all — 5.01 GB /
0.152 GB = 33.0× the measured file, × 202 batches = 6,666 — lands ≈1 % away.

**Against the declared ceilings:** 6,633 / 100,000 = **6.6 % of `MAX_PUBLISH_PARTITIONS`**. Not
approached; ADR-017 §1's five-digit partition-name width holds comfortably (`part-00000` …
`part-06632`).

### 1c. How the actual is recorded

`fixture-facts.json` carries: this spec as a struct dump, these predictions copied from this file,
the returned `FixtureFacts` (every member measured while writing, never predicted), the file's
SHA-256, and the row-group count read back from the parquet footer.

**Generate once. Do not regenerate to hit a prediction** — a fixture tuned to its own prediction is
not evidence. One regeneration is permitted only if actual bytes fall outside **4.0–6.5 GB**, and
both files' facts are then recorded.

### 1d. The density assumption, and how it can fail

14.50 B/vertex is `151,812,642 B / 10,467,093 vertices`, from a **145 MB, single-row-group** file.
Three ways it may not hold at 5 GB, largest risk first:

1. **Snappy ratio drift from a wider coordinate range.** The 100 k grid spans 12.68 km; this one
   spans 72.68 km. Intra-feature redundancy is unchanged, so ≤2 % expected — but it is a genuine
   unknown, and it is why the band is ±5 %.
2. **Row-group count**: 403 vs 1 adds ~2,400 column-chunk headers and statistics, ≈1 MB. Negligible
   in size, **not** negligible in behaviour — see the confound below.
3. **Dictionary behaviour**: both regimes dictionary-encode the four bbox columns and fall back to
   plain for WKB. Same regime; ≤0.1 B/vertex.

**Declared confound, not a defect:** this fixture has 403 row groups where every earlier fixture had
one, so DuckDB may prune on `bbox` statistics in ways it never could before. No number in this pass
may be compared with any earlier section anyway, and the in-session 145 MB control (§6) is generated
with the **same** `row_group_rows`, so the flatness comparison is not confounded by file structure.

---

## 2. The rows, and what each one means

| Row | Gate | Measured as |
|---|---|---|
| Cold open of the 5 GB file | **< 5 s (docs/08)** | §4's protocol. Verdict on the **maximum** of three boots |
| Warm open + identity uniqueness scan | report | Wall time of `Dataset::open`, and the scan isolated by the A/B in §2a |
| Whole-file stream: first batch · total | report | Producer-side, one clock |
| Quarter and 1/64 viewport streams (ScanOnly) | report — **index v2's baseline** | Same instruments; row counts asserted against §1b |
| Cancellation mid-stream at scale | **< 100 ms (docs/08)** | Producer-observed, in-process |
| Producer-resident memory vs declared bound | **bound holds (docs/08)** | §2b |
| Publish 5 GB through grant → approval → audit | completes; cancellable; audit correct | §5 |
| Publish determinism at scale | **byte-identical manifest + all partitions** | Two publishes, two destinations, hash comparison |
| Strict-reader verification of the 5 GB bundle | all partitions verified | `kernel/examples/verify-bundle.rs`, §5c |

### 2a. Isolating the identity scan — an A/B, not an inference

The brief predicts the identity scan may dominate open cost. It is measurable with **no new product
code**: `Dataset::open_with_declared_identity` on the `id` column with `skip_uniqueness_check = true`
gives prelude-only; the default gives prelude + scan; **the difference is the scan.** Both are
product paths, both in-session, one binary. Registered as an A/B rather than inferred from a cancel
ladder.

### 2b. What "producer-resident memory, flat with respect to file size" may and may not claim

Three corrections registered in advance, because the phrase invites a stronger reading than the
instruments support:

- **The in-tree counter is a data-plane frame counter.** It is flat by construction and will read
  ~1.7 MB against the declared 83,886,080 B at any file size. That is the bounded-memory claim.
- **Process private commit will not be flat, and must never be presented as the claim.** DuckDB's
  streaming buffer sits outside every declared bound, as `engine/src/stream.rs` already states, and
  in publish an `ORDER BY` sort of ~7 GB sits outside it too.
- **"Flat" is a two-point claim** and cannot be made from one file size. Between-session comparison
  is forbidden here, so the second point is the **145 MB in-session control**, same binary, same
  session, same `row_group_rows`. Without it the row can only say "inside the bound at 5 GB".

---

## 3. Declared watchdog ceilings (ADR-010 rule 6)

Two per phase where a progress observer exists: a **total** ceiling and a **silence** ceiling —
`PublishPhase::Querying` is silent by construction while DuckDB sorts, so one number cannot serve
both.

| Phase | Total | Silence |
|---|---|---|
| Fixture generation (5 GB) | **1800 s** | 60 s |
| Fixture generation (145 MB control) | 300 s | 60 s |
| Cold open (per boot, per sample) | **300 s** | — |
| Warm open + identity scan | **300 s** | — |
| Whole-file stream (per run) | **900 s** | 120 s |
| Quarter / 1/64 viewport (per run) | **600 s** | 120 s |
| Cancellation trial (each) | **60 s** | — |
| Publish, whole operation | **3600 s** | `VerifyingSource` 120 s · `Querying` **900 s** · others 60 s |
| Determinism re-publish | **3600 s** | as above |
| Bundle comparison | 900 s | — |
| Strict-reader verification | **1800 s** | 120 s |

**At a ceiling:** the watchdog fires that phase's `CancelToken` — the product mechanism, so a fired
watchdog exercises cancellation but is **not** a measured cancellation sample — waits a declared
**60 s grace**, then flushes the artifact and aborts. The phase is recorded as `watchdog-fired` with
elapsed time and last progress event, and its row becomes **"unmeasured — watchdog at N s"**.

**The ceiling is not raised and the phase is not re-run in this cut.** Any later attempt requires a
dated amendment stating it was written after a result was seen.

---

## 4. The cold-open protocol

**"Cold" means:** no page of the fixture is resident in the Windows file cache when `Dataset::open`
begins, so every byte the open reads comes from the storage device.

**Three reboots, three samples, and they are three sessions.** This repository forbids
between-session comparison, so the three cold samples are **never pooled**. Each is reported
individually with its own boot's evidence, and each is compared against **a warm control taken in
the same boot** — the only within-session comparison available.

### 4a. Per boot, in order

1. Record: boot time, uptime, free disk, `HiberbootEnabled`, SysMain state, Defender real-time
   protection, `Get-PhysicalDisk | Select MediaType`, counter baselines.
2. **Quiet gate** — 120 s settle, then all four must pass: CPU sampled 30 s with mean < 5 % and
   max < 25 %; cumulative physical-disk read+write over the same 30 s < 50 MB; **no `cargo`,
   `rustc`, `link.exe`, `node` or `msbuild` process exists**; free disk ≥ 20 GiB. Failure → wait and
   retry up to 10 minutes → then abandon this boot and repeat it, recorded as an attempt.
3. Verify the **binary** SHA-256 pin (a small read).
4. Snapshot disk counters → **one** `Dataset::open`, timed on a fresh process's own `Instant` around
   `Dataset::open` alone → snapshot counters → write the artifact.
5. **Only then**: the within-boot warm control (5 further opens of the same file) and the canary.

**The script refuses to:** compile anything (the build is pre-frozen; it runs a hash-pinned private
copy); **hash the fixture** (a 5 GB read would warm the very file being measured — cold-time
integrity uses the length+mtime heuristic only, and the full hash is re-verified after the last cold
sample); run any other phase before the cold artifact exists; take a second cold sample in one boot;
run on a debug build; start below 20 GiB free or above 20 minutes uptime.

### 4b. The two additions without which this protocol is not sound

- **Fast Startup.** A Windows 10 "Shut down" is a hybrid hibernation that restores the kernel
  session. **Only "Restart" performs a full boot.** `HiberbootEnabled` and `LastBootUpTime` are
  recorded, and the script refuses if uptime > 20 minutes.
- **Positive evidence that the read came off the device**, not an assertion that it did: cumulative
  physical-disk read bytes across the open, from `Win32_PerfRawData_PerfDisk_PhysicalDisk`
  (`_Total`), snapshotted before and after. Process-level `IOReadBytes` is recorded beside it — the
  gap between the two **is** the cache-hit measure. Built into Windows; zero downloads.

**SysMain and Defender are recorded, not disabled.** Turning either off would measure a different
machine from the one under test; a first-touch scan is part of this machine's honest cold cost.

### 4c. The verdict rule, declared before measuring

All three samples are reported individually. **The verdict against the <5 s budget is taken on the
maximum of the three.** If the three straddle 5 s, the verdict is **"straddles — recorded, not
established"**, and all three stand.

### 4d. What this row actually measures — stated in advance because it reframes it

`Dataset::open` at 5 GB reads the parquet footer plus **one column** (the `id` column, for ADR-016's
`count(DISTINCT)`) — not 5 GB. Predicted device read **≈30–60 MB** across ~403 scattered column
chunks. So the cold-open budget measures **footer parse + one column's scattered IO + a DISTINCT
aggregation**, and is nearly independent of the other 4.95 GB. On an SSD it will likely pass; on a
spindle, 403 seeks alone could approach the budget — which is why `MediaType` is in the record.

---

## 5. Publish at scale, through the class-3 boundary

### 5a. The grant, and why the harness may mint one

The human's **F-5 ruling** (2026-08-07, in `kernel/PERMISSION-BOUNDARY.md` and appended to ADR-017)
binds a **future exposure surface**: *the requester must never mint the grant*. A harness invoked
from the operator's own shell against developer/test tooling is **the operator's hand, not a
requester**, so the sanctioned self-minted-grant CLI path is used — and the write-up carries F-5's
disclosure verbatim: **this measures the machinery at scale, not the authority model; the CLI's
default grant checks nothing.**

Mitigation that costs nothing: every publish passes **`--grant-destination <dir>`**, the only
non-tautological part of a self-minted grant, so at least one scope member is checked against a
resolved fact. `--grant-ttl 900` is passed explicitly and recorded (the CLI pins a 5 GB source before
the boundary runs).

### 5b. Paths, and why they differ

- **Publish A (row of record) and Publish B (determinism):** the **CLI**,
  `publish-bundle --approve <basename> --grant-destination <dir>`. Wall time is a fact with no budget.
- **Cancellation cells: in-process** through `permission::boundary::execute` with
  `PreNamedApproval` — never Ctrl-C on a child. A threshold asserted across a process boundary
  measures scheduling, not the property.
- **B goes to a different `--out`**, because re-publish over an existing destination is a typed
  refusal. This is a *bonus*: ADR-017 §13 forbids any local path in a bundle, so two different
  destinations must still produce a **byte-identical manifest** — a stronger check than the brief asks.

**Cancellation cadence: the declared number is 100 ms, not a free parameter.** `docs/08` says
"cancellation acknowledged < 100 ms, **any operation**" and `docs/01` principle 7 has no size
exemption. Declaring a looser "cadence" at 5 GB would be declaring a budget miss in advance and
scoring it as a pass. The row carries two numbers: the observed **inter-partition interval**
(p50/p95, from `PublishProgress::partition_written` — this *is* the cadence, predicted 5–15 ms) and
the observed **cancel latency** against the 100 ms budget.

**Three cancellation cells**, aimed through the progress observer: during `VerifyingSource` (the
chunked rehash), during `Querying` (**the DuckDB `ORDER BY` sort — a multi-minute phase nobody has
ever sampled**), and during `WritingPartitions`. Each asserts "leaves nothing": staging removed,
destination absent, removal outcome reported. **If trials land in the wrong phase they are reported
as observations and not promoted to latency samples for a phase nobody sampled.**

### 5c. The audit log, and the assertions made against it

`SPATIAL_IDE_AUDIT_LOG` → `target/slice-evidence/scale-pass/audit/publish.jsonl` (absolute;
`target/` is gitignored and outside the source pin). **It must not be the operator's real log**, for
four independent reasons: a log polluted with measurement publishes can no longer distinguish a test
from a real act; the assertions below are "exactly N records", true only of a log that starts empty;
**F-9** — rotation is checked at open, and a run near 8 MiB would rotate and *delete* a retained
generation of the operator's history; and it must sit outside every bundle destination. Asserted not
to exist before the run.

Assertions, made afterward against `record.rs`'s emitted key sets:

1. Every line parses; every `schema == "spatial-audit/1"`.
2. Record count = 2 × attempts that reached the gate; per `attempt` id exactly one `intent` and one
   `outcome`.
3. Intent `source_content_hash` == the fixture's independently computed SHA-256 == the manifest's
   `source.content_hash`.
4. Both completed publishes' outcome records carry **equal `manifest_hash`**, and that value equals
   SHA-256 of `manifest.json` computed independently by the strict reader for both bundles.
5. Outcome `rows` == 3,300,000 == the strict reader's summed partition rows; outcome `partitions` ==
   the strict reader's partition count == the manifest's list length.
6. Cancelled attempts: cancellation terminal, `error_kind` is the variant name, and
   `manifest_hash`/`rows`/`partitions` are all `null`.
7. `residual_classes` recorded as emitted. The destination path is checked against
   `CREDENTIAL_NEEDLES` **before** the run — a destination containing `secret`, `password`, `apikey`
   or `credential` refuses the publish with no audit record at all (F-3).
8. **Append-only:** the log's bytes are read before and after every attempt; every previously
   written line is byte-identical afterwards.
9. The override is recorded, with the default location it replaced — the log's declared property is
   "no value turns it off", and an override is a declared feature, not a bypass.

### 5d. Two DuckDB settings, read rather than assumed

`SELECT current_setting('memory_limit')` and `current_setting('temp_directory')`, recorded before
the publish phases. `stream_for_publish` orders by identity, so DuckDB sorts ~7 GB before the first
row and nothing in this workspace sets either value. **`temp_directory` is set explicitly to a path
under `target/`**, so a spilling sort cannot write gigabytes into the repository under a pinned tree
and cannot fill the drive. Whether spill files appeared is recorded.

---

## 6. Sample counts, cadences, and the in-session control

| | |
|---|---|
| Whole-file stream | **n = 5** |
| Quarter viewport | **n = 7** |
| 1/64 viewport | **n = 7** |
| Cancellation, per cell | **n = 7** |
| Cold open | **n = 1 per boot × 3 boots**, never pooled |
| Warm control | **n = 5 per boot** |
| Publish | **n = 1** (A) + **n = 1** (B, determinism) |
| **In-session 145 MB control** | generated in the same session, same binary, **same `row_group_rows`** — the second point the flatness claim needs |

**Memory sampler cadence, pre-registered per phase** so it cannot be changed after a result is seen:
**50 ms** for the sub-second cancellation cells (comparable with prior sections), **250 ms** for any
phase over 60 s. The cadence is recorded in the artifact.

**Canary discipline**, unchanged from prior sections: the 400 M instrument at the start and end of
every phase; a spread above the declared 10 % across a phase's canary points invalidates that phase.

**Free disk is recorded at every phase boundary**, and every phase **refuses to start below 20 GiB
free.** Predicted worst case for the whole pass is ≈26.7 GiB (fixture 4.67 + bundle A 5.34 + bundle B
5.34 + transient staging ≤0.50 + release build ≈3.20 + artifacts ≤0.10 + a ≤7.50 GiB DuckDB spill
contingency), against 111.5 GiB free at the time of writing.

---

## 7. Declared invalidators

Any one of these invalidates the phase it fires in; the attempt is **recorded with the invalidator
named**, never silently discarded.

- Free disk < 20 GiB at any phase boundary.
- Canary spread > 10 % across a phase's canary points.
- Source pin or binary pin differs before vs after any phase.
- A watchdog fired (the phase is `unmeasured`, and is not re-run in this cut).
- **Cold-open only:** uptime > 20 min · quiet gate failed · `HiberbootEnabled` = 1 with no confirmed
  Restart · **disk-read delta < 5 MB** (the file was already cached — "cold" is falsified, and the
  sample is discarded rather than reported) · cold/warm ratio < 2× with no disk-read evidence · the
  fixture's post-hoc hash differs · a second process touched the file.
- Fixture actual bytes outside **4.0–6.5 GB** (one regeneration permitted; both recorded).
- Any measured row count differing from §1b's exact predictions — this is an instrument failure, not
  a machine one, and stops the pass rather than being reported as a result.

---

## 8. Declared out of scope, and declared unmeasurable — stated now so nothing is quietly added

**Out of scope** (the brief's own list): index v2 — this cut produces its baseline-to-beat, nothing
more; any browser or viewer measurement at scale; macOS or Linux; WASM; MapLibre.

**Declared unmeasurable up front**, rather than after a failed attempt:

- **Any browser/viewer figure at this scale.** ADR-017 §16's reader ceilings are `max features`
  2,000,000 and `max resident bytes` 512 MiB; this bundle carries **3,300,000 rows** and ≈**5.74
  GB**, and `renderer/bundle-viewer/src/main.ts` implements both as `ceiling-exceeded` refusals.
  **The reference viewer's correct, declared behaviour on this bundle is a typed refusal before a
  single partition is fetched.** Measuring it would measure the refusal. Stated, not apologized —
  and see the finding this raises in §9.
- **Throughput, anywhere.** Bytes and seconds side by side, never divided — including fixture
  generation.
- **DuckDB's own memory as a bounded quantity.** Reported as a fact, claimed as nothing.
- **Cross-process cancellation latency** (Ctrl-C on the CLI): a scheduling measurement, not the
  property.
- **Geometric correctness of anything.** No GEOS or PostGIS oracle is present (`docs/08`,
  test-oracle separation).

---

## 9. Ordering, and one finding recorded before the pass runs

### 9a. The cold-open phase runs **last**

Decided with the human **before any measurement**, and recorded here because ordering is a protocol
choice: generator → this preregistration → instruments → reviewer → **freeze** → fixture generation
→ all unattended phases → **cold-open reboots** → results.

A reboot re-evicts the file cache, so running the unattended phases first costs the cold-open row
nothing — and if anything invalidates earlier, the operator's 45-minute window is not spent. The
fixture's integrity between login and each cold sample is checked by length+mtime only; the full
hash is re-verified after the last cold sample.

### 9b. The bundle this pass produces exceeds the reference viewer's declared ceilings

Recorded **before** the run, because it follows from §1b's arithmetic rather than from any result,
and because a finding discovered after a measurement is easy to mistake for a measurement.

3,300,000 rows against ADR-017 §16's 2,000,000; ≈5.74 GB against 512 MiB. **So `docs/07`'s hero
slice — "open a 5 GB GeoParquet → filter in SQL → style it → publish a static interactive bundle" —
does not complete end-to-end at 5 GB under bundle format v1.** The publish half succeeds; the view
half correctly refuses. Nothing is broken and no ceiling was discovered late: this is ADR-010 rule 6
working exactly as intended.

**This pass records it and does not try to fix it.** No ADR decides what should happen above those
ceilings, and the options — publish refuses too, the slice publishes a declared subset, the format
gains tiling, or the ceilings rise on evidence nobody has taken — are a decision for the custodian.

---

## 10. Amendments

### A1 — 2026-08-07 — the 1/64 viewport edge moves to a cell centre

**Made before the fixture exists, before any instrument has been run, and before any result of this
pass has been looked at.** The amendment rule in this file's header is therefore satisfied: nothing
here is a response to a number.

**What changed.** §1b registered the 1/64 viewport as
`2600000,1200000,2609085,1209085` → **51,984 rows exactly**. The edge is now
`2600000,1200000,2609100,1209100` — `+9100` rather than `+9085` — and the count stays **51,984**.

**Why.** The reviewer replayed the generator's `SplitMix64` and `parcel()`/`ring()` against the
registered seed and showed the old edge returns **51,953**, not 51,984. `1817/8 = 227.125`, so
`+9085` lands **15 m into cell 227**, whose centre is at `+20 m`. Inclusion then depends on a
parcel's leftward reach — `16.8 × jitter × −cos θ`, with `jitter ~ U[0.55, 1]` — being ≥ 15 m, which
fails for roughly 7 % of parcels, losing ~16 on each of the x and y edges.

`+9100` is `227 × 40 + 20`: **the centre of cell 227**. A parcel's bbox always straddles its own
centre, so that column is included unconditionally and the count is pure arithmetic over the grid,
independent of vertex jitter.

**The quarter viewport is unchanged and was already correct** — `1817/2 × 40 = +36340` happens to
equal `908 × 40 + 20`, a cell centre. It was robust by luck; both are now robust by construction,
computed from one function (`viewport_edge`) rather than from two hand-written expressions.

**Why this is an amendment rather than a correction to §1b in place.** The number did not change,
but the *edge that produces it* did, and §7 makes an exact-count mismatch an instrument failure that
stops the pass. A reader comparing the artifact's `xmax` against §1b would otherwise find a
discrepancy with no explanation. Recording it is cheaper than being trusted about it.

**Consequence for §7's invalidator.** Unchanged and now meaningful: both viewport row counts are
**asserted** by the harness, not merely printed. An earlier draft printed them and justified that by
calling the covering-bbox filter "conservative by design" — which contradicted §7 and would have let
the exact-count check pass silently while being wrong.

### A2 — 2026-08-07 — instrument corrections found in review, before any run

Recorded because each changes what a number *means*, and all were made before the fixture existed.
None is a change to a registered value.

1. **Cancellation is reported as two numbers, not one.** The registered row says
   "producer-observed". The first instrument timed `cancel()` until the stream was fully drained —
   with `MAX_QUEUED_BATCHES = 2` plus a producer blocked in `send`, that is up to three
   already-generated batches, each IPC-encoded before the terminal can arrive, so it measured work
   produced *before* the cancel. The row now carries **acknowledgement** (`cancel()` → the first
   return after it — what `docs/08`'s budget names) and **drain-to-terminal** separately, plus the
   engine's own `batches_after_cancel`.
2. **The identity-scan A/B gains a discarded warm-up and alternating ABBA pairs.** One A then one B
   put DuckDB's first-instance cost entirely into the "scan". Both order estimates are now reported
   and **not averaged**: if they disagree, the order effect is the finding.
3. **The memory control is measured after the 5 GB dataset is dropped**, with a baseline recorded
   between them. Sampling it while the 5 GB pool was still resident would have made both points of
   the flatness claim look flat for a reason unrelated to file size.
4. **Watchdog ceilings apply per run**, as §3 registers, rather than one watchdog spanning all five
   or seven runs — which would have made the effective per-run ceiling 5× or 7× tighter than
   declared, in the direction of a spurious abort.
5. **The watchdog now fires the token the phase actually uses.** In two phases it held a token
   nothing was listening to, so a fire could not cancel anything and the process would have aborted
   after the grace — losing the whole run instead of marking one row unmeasured.
6. **The viewports name the dataset's CRS** rather than sending `bbox_crs: None`, so the engine's
   CRS-admission branch is exercised and §1b's claim that a row-count mismatch would reveal an
   admission fault is true.

### A3 — 2026-08-07 — attempt 1 invalidated by its own canary; a settle is added and the run re-done

**This amendment was made AFTER results of attempt 1 were looked at.** The header's rule is explicit
about what follows: *"An amendment made after any result of this pass has been looked at invalidates
the run, and the run is re-done rather than re-described."* That is exactly what happens here.
Attempt 1 is invalidated, its numbers are **not** the run of record, and attempt 2 is re-run from
the same frozen tree and binaries.

**What fired.** §7's canary invalidator: long-instrument spread **0.1194** against the declared
0.10. The instrument worked; the run did not.

**What moved.** The `start` canary at **114.174 ms** is the outlier. The five points that bracket
actually-measured phases were 121.005 / 123.300 / 120.570 / 127.803 / 116.805 — a spread of
**9.4 %**, inside the declared bound. `start` was taken seconds after a 12-minute clean release
build and a 328-test correctness gate; the machine was still hot and had not settled.

**The change.** A **120 s settle** before the first canary — the same figure §4's cold-open protocol
already declares, so the attended and unattended halves of this pass ask the machine for the same
quiet. A **pre-settle canary is taken and recorded**, and is deliberately **not** one of the points
the spread is computed over.

**That exclusion is narrow, and stating it is the point.** The invalidator asks whether the machine
moved *while numbers were being taken*; no number is taken before the settle, so a point bracketing
no measurement cannot witness drift in one. Recording the pre-settle reading anyway is what keeps
this from being a way to dodge the invalidator: the artifact shows, in the same units, how far from
settled the machine was.

**Attempt 1's numbers are recorded, not discarded** (§7: "the attempt is **recorded with the
invalidator named**, never silently discarded"). Its artifact and console log are retained under
`target/slice-evidence/scale-pass/attempt-1-invalidated/`, and the write-up reports them beside
attempt 2's. Showing both is more honest than hiding an invalidated attempt whose numbers a reader
could otherwise never check against the run of record.

**The fixture is regenerated rather than reused.** Generation is seeded and deterministic and took
40 s, so a fresh one is cheaper than an instrument change to permit reuse — and it keeps
`generate()`'s refusal to reuse a file whose `FixtureFacts` it did not itself measure. Attempt 2's
fixture SHA-256 is recorded; if it differs from attempt 1's
(`sha256:5ae955c5fb7ee4d3f10436df271e19361d84f0845fbaa69dc60516f1b60c1788`) the generator is not
deterministic and **that** is the finding.

**Nothing else changed.** No ceiling, no sample count, no prediction, no viewport, no measured
quantity. The instrument that produced attempt 1's numbers and the instrument that produces attempt
2's differ by a `sleep` and one extra recorded canary reading.
