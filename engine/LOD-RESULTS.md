# LOD tier builder (route B) — measured results

*Filled by the `tester` agent for `engine/LOD-PREREGISTRATION.md` §3 (O1–O8), §5 (P1–P6, I2/I3/I6) and
§6 (instruments). **This file is where every measured figure for this piece enters the tree** — §6's
rule verbatim: "The numbers are the tester's … no measured figure enters this document, ADR-031, or
any commit message except through that gate."*

**The sample counts in this header were declared and committed BEFORE any run** (commit `38c8341`,
with every results cell empty). Nothing below raises or lowers a declared N after the fact; a row
that got fewer samples than declared says so, with the reason. Every declared N was met.

**No performance claim is made here** (§1). Wall time is measured and reported, never asserted. No
`docs/08` row is proposed, added or amended. No route-A comparison appears, of any kind (§1, §0
item 6). Nothing here is called "zero-copy" (ADR-004). "Achieved typically" appears nowhere
(ADR-018).

---

## Scope carried by every number

| | |
|---|---|
| **Date** | 2026-09-17 local (Europe/Zurich, UTC+2). **All timestamps below are UTC**, the machine's own clock, so they read 2026-09-16T23:xx–2026-09-17T01:xx |
| **Commit measured** | `1d46678` — `engine/lod-tier-builder` after both gates PASSED at attempt 2 and after `origin/main` was merged in. **No file under `engine/src/` differs from `1d46678`** |
| **Harness commit** | `5289be1` (`engine/tests/lod_tier_measurements.rs`, tests only, all measuring tests `#[ignore]`d). The header of this file is `38c8341` |
| **Machine** | Intel Core i9-9980HK @ 2.40 GHz · **8 cores / 16 threads** · 63.73 GiB RAM (68,433,563,648 B) · Windows 10 Pro 22H2 build 19045. The same 8C/16T reference machine §7 declares `LOD_BUILD_WORKERS = 8` against |
| **Drive** (the §0 fixture-drive confound, stated before any number) | **`C:`** — Disk 0, **KIOXIA KXG60ZNV512G NVMe 512 GB, `MediaType` SSD**, `BusType` reported `RAID` (NVMe behind Intel RST), partition 510,319,919,104 B. **Both fixtures, every tier written and every build directory used here live on `C:`.** No figure here is differenced against a figure taken on any other drive |
| **Build profile** | `release`, via `cargo test --release -p spatial-engine`, with `CARGO_TARGET_DIR=C:/dev/spatial-ide/.claude/worktrees/agent-a3073bf516424356e/target` (never the shared `C:/dev/spatial-ide/target`). `debug_assertions` off — which is also why `engine/src/lod.rs:1097-1100`'s `debug_assert!` is not what enforces any size here (§10 Amendment 8 (i)6). The release build itself ran 23:41–23:52Z and is **not** a measurement |
| **Idle since** | **23:41Z**, and re-checked immediately before every measured run (23:53:44Z, 00:07:5xZ, 00:12Z, 00:21Z). At every check: **no `cargo`, `rustc`, `link`, `cl` or `vitest` process existed** other than my own. Three `node` helper servers (PIDs 22012 / 24068 / 30896, OpenAI Codex runtime) have been resident since 2026-09-15T21:59 local with **cumulative CPU 0.06 s, 0.06 s and 0.28 s** — resident and idle, not running work. Two disclosed disturbances are recorded below under *Machine state and contention*, one of them inside a measured interval |
| **Excluded** | macOS and Linux (tier building is Windows-only in this cut — §10 Amendment 8 (a)); any route-A comparison; any `docs/08` row other than the existing cancellation budget `docs/08:8`; any claim about a distribution where N = 1 |

### Fixtures — hash-verified before and after (§3, binding)

Both unchanged across every run: same length, same SHA-256 before and after.

| Fixture | Path | Declared bytes (§3) | Bytes seen | SHA-256 before (23:39Z) | SHA-256 after (01:05Z) |
|---|---|---|---|---|---|
| `parcels-5gb` | `C:\dev\spatial-ide\target\slice-evidence\scale-pass\parcels-5gb.parquet` | 5,004,376,705 | **5,004,376,705** | `5AE955C5FB7EE4D3F10436DF271E19361D84F0845FBAA69DC60516F1B60C1788` | **identical** — `5AE955C5FB7EE4D3F10436DF271E19361D84F0845FBAA69DC60516F1B60C1788` |
| `polygons-100k` | `C:\dev\spatial-ide\target\fixtures\slice-budgets\polygons-100k.parquet` | 151,812,642 | **151,812,642** | `9ECD79242AC7D99E09F1989C8C124FD53DCD697689546EC6013949F806CA6043` | **identical** — `9ECD79242AC7D99E09F1989C8C124FD53DCD697689546EC6013949F806CA6043` |

Neither fixture was regenerated; both were present, and the harness regenerates only an absent one.

### Free space on `C:` (§3's disk discipline; the tests' own floor `MIN_FREE_BYTES` = 42,949,672,960 B = 40 GiB)

| Point (UTC) | Free bytes | Note |
|---|---|---|
| 23:38Z, session start | 47,632,175,104 (44.36 GiB) | 4.36 GiB above the floor — tight, as the brief recorded |
| 23:53:58Z, row 1 start | 43,592,998,912 (40.60 GiB) | above the floor; the release build had consumed the difference |
| 00:07:08Z, row 1 end | 43,591,811,072 | ladder deleted; directory listed empty of parquet files |
| 00:12Z, row 3 start | 43,609,657,344 | above the floor |
| ~00:15Z, **inside row 3** | **41,057,435,648 (38.24 GiB)** | **fell below the floor mid-row** — see *I6, and what was done about it* |
| 00:21:10Z, after reclaiming my own build cache | 55,492,108,288 (51.68 GiB) | floor restored before any further 5 GB run |
| 00:21:2xZ, verified arm-P run start | 55,492,333,568 | above the floor |
| ~00:26Z, inside that run | 70,965,100,544 | the custodian's ~15 GB reclamation landing (disclosed below) |
| 00:35:32Z, arm-S 5 GB start | 70,947,016,704 (66.07 GiB) | above the floor |
| 01:04:25Z, arm-S 5 GB end | 70,945,382,400 | ladder deleted; directory listed empty of parquet files |
| 01:05:36Z, after cleaning `%LOCALAPPDATA%\spatial-ide\tiers` | 70,944,272,384 | tier directory **removed**; nothing of mine left on disk |

### Declared sample counts — fixed by this file's first commit (`38c8341`), before any run

| # | Row | Fixture | Arm | **Declared N** | **N achieved** | Reporting rule |
|---|---|---|---|---|---|---|
| 1 | The 5 GB ladder under disk discipline (O1–O5, O8, and one arm-P wall time) | `parcels-5gb` | P (8) | **1** | **1** | "one sample, not a p50/p95" |
| 2 | O7 — `cancel_requested → cancel_observed` | `parcels-5gb` | P (8) | **5** | **5** | p50 / p95 / max; p95 carries the verdict against `LOD_CANCEL_OBSERVED_CEILING_MS` = 100 ms |
| 3 | O6 — build wall time, arm S vs arm P | `polygons-100k` | S (1) **and** P (8) | **5 per arm** | **5 per arm** | p50 / p95 / max per arm, per tier |
| 4 | O6 — build wall time at 5 GB | `parcels-5gb` | P (8) and S (1) | **1 per arm** | **1 per arm** (+1 extra arm-P run carrying the O2/O3/O4 verification) | "one sample, not a p50/p95" |

p50/p95 are reported **only** where N ≥ 5 (rows 2 and 3). Rows 1 and 4 are single samples and are
labelled as such everywhere. Max is always reported.

**The p95 estimator, stated because at N = 5 it matters:** **nearest-rank** — p95 is the
`ceil(0.95 × 5) = 5`th of five ordered samples, which **is the maximum**. Every p95 in rows 2 and 3
therefore equals that row's max, and is reported as both rather than as two apparently independent
numbers. A p95 read off five samples is a weak estimate of a tail and is not presented as more.

---

## Row 1 — the 5 GB ladder under disk discipline (O1–O5, O8)

**Command** (exactly as run, 23:53:58Z → 00:07:08Z):

```
cargo test --release -p spatial-engine --test lod_tier_builder -- --ignored --exact \
  the_5gb_ladder_under_disk_discipline --nocapture
```

**Machine state:** idle since 23:41Z; quiet check at 23:53:44Z showed no `cargo`/`rustc`/`link`/`cl`
and only the three idle `node` helpers. Nothing else ran during this interval.

**Wall time — one sample, not a p50/p95: 789.05 s** (libtest's own `finished in`; the shell window
around the process was 790.13 s). Arm **P**, `LOD_BUILD_WORKERS` = 8 — the worker count this test
passes to `build_tiers`. **What that interval covers:** the free-space check, `Dataset::open`, an
explicit whole-file `content_hash` of the 5 GB source that *this test* computes to locate the tier
directory, `build_tiers` (which hashes the source **again**, internally), the three tier builds and
writes, the deletions and the directory listing. It therefore contains **two** whole-file hashes of
5,004,376,705 B and is not the same interval as row 4's `build_tiers`-only figures.

| Tier | Min triangle area | Features | Vertices before → after | **Reduction** | O5 expectation (§3) | Verdict | Bytes | SHA-256 |
|---|---|---|---|---|---|---|---|---|
| 1 | 0.1 m² (0.1 source square units) | 3,300,000 | 345,507,850 → 332,654,398 | **0.0372** | none declared for this fixture at 0.1 | recorded, no expectation | 4,822,812,458 | `9cb52963280bc47bc16aa566784b15c18909ee6f03637726995ea5c3fa5c8d22` |
| 2 | 1.0 m² (1.0 source square units) | 3,300,000 | 345,507,850 → **252,277,009** | **0.2698** | **≈ 0.270** (`spikes/lod-feasibility/README.md:142`) | **holds** | 3,693,668,762 | `b674b942ff3ee2d62258409cad9268b39733d32f829d92b4c903978696bccf81` |
| 3 | 5.0 m² (5.0 source square units) | 3,300,000 | 345,507,850 → 115,184,517 | **0.6666** | none declared for this fixture at 5.0 | recorded, no expectation | 1,755,439,602 | `05f9cd17434fbd2bdc28abd3b610c7bbe8ec4c0aa1e9b285a116f735efa8733d` |

**O5 — no recorded deviation.** Tier 2's *vertex count* is **252,277,009**, the same integer the
spike recorded for the same fixture at the same area (§0 item 2 quotes it); the reduction it yields,
0.2698, is §3's expectation to four places. Tiers 1 and 3 have no declared expectation on this
fixture and are recorded as measured.

**O1 — validity: 0 invalid.** `build_tiers` returned `Ok`, and O1's instrument is not a sampled
post-pass: `engine/src/lod.rs:1530` runs `geo::Validation::is_valid()` on **every** simplified
Polygon at the moment it exists, before it is written, and refuses the whole build with
`engine.lod_invalid_output` on the first failure. A build that returns `Ok` is therefore the
zero-invalid result for **9,900,000** written features (3 tiers × 3,300,000). **I2 did not fire.**
Across the three 5 GB ladders built tonight that is **29,700,000** feature-validations at 5 GB scale,
plus 3,000,000 at 100k scale (row 3), with zero invalid outputs. **P1 holds on the evidence taken
here**; §2a's falsifier did not fire.

**O8 — the set's bytes against the by-construction bound** (§10 Amendment 6: the 2.0× set ceiling is
withdrawn; the bound is `LOD_TIER_COUNT × LOD_TIER_MAX_RELATIVE_BYTES` = 3.0 × source):

| Quantity | Bytes | Against |
|---|---|---|
| Source | 5,004,376,705 | — |
| Ladder total (arithmetic, per §3 — never held on disk at once) | **10,271,920,822** | **2.0526 × source** |
| Hard bound (3.0 ×) | 15,013,130,115 | **within — 68.42 % of the bound** |
| Tier 1 / 2 / 3 against the per-tier 1.0 × ceiling | 4,822,812,458 / 3,693,668,762 / 1,755,439,602 | **0.9637 × / 0.7381 × / 0.3508 ×** — all within |

**O8 verdict: within the bound, at both scales.** One fact worth recording rather than leaving to be
rediscovered: the ladder is **2.0526 × source** here and **2.0509 × source** on `polygons-100k`
(row 3) — both **above the withdrawn 2.0 × set ceiling**. Amendment 5's deviation was not a
`polygons-100k` peculiarity; the same ladder exceeds that withdrawn value on the 5 GB fixture too.
Tier 1's 0.9637 × also sits close to the per-tier 1.0 × ceiling that *is* still in force.

**Disk discipline, as it actually ran** (§3, binding — never two 5 GB-scale outputs at once):

| Step | Free bytes at the step | Evidence |
|---|---|---|
| Before the build | 43,592,998,912 | printed by the test against its own 40 GiB floor |
| Tier 1 removed as tier 2 began to grow | 43,595,038,720 | `disk discipline: removed tier 1 … before tier 2 grew` |
| Tier 2 removed as tier 3 began to grow | 43,570,855,936 | `disk discipline: removed tier 2 … before tier 3 grew` |
| After the run | 43,591,811,072 | tier 3 deleted; **the directory was asserted to hold no parquet file** |

**Not printed by this test, and taken from row 4 instead:** `TierSet::max_single_feature_simplify()`
(§6's residual), per-tier wall marks, and O2/O3/O4. The ignored ladder test exposes none of them;
that is what `engine/tests/lod_tier_measurements.rs` was added for.

---

## Row 2 — O7, `cancel_requested → cancel_observed` at 5 GB

**Command** (five sequential runs, 00:07:57Z → 00:11:52Z, one process per run):

```
cargo test --release -p spatial-engine --test lod_tier_cancellation -- --ignored --exact \
  cancel_observed_within_the_declared_ceiling_at_5gb --nocapture
```

**Vocabulary and clock (ADR-018 §2).** `cancel_requested` is stamped **by the canceller**, on the
thread that calls `CancelToken::cancel()`. `cancel_observed` is stamped **inside the worker, on the
thread that stopped advancing** (`engine/src/lod.rs:1497`, before anything unwinds). Both are
elapsed readings from **one `Instant` origin**, so the interval is a difference on one clock and not
a gap between two `Instant::now()` calls. The canceller fires 250 ms after the first tier-progress
callback, so the cancel lands **inside the simplify loop** and not during the content hash that
precedes it.

| Run | `cancel_requested → cancel_observed` | Whole-test duration (context, not the property) |
|---|---|---|
| 1 | 91.3 µs | 40.77 s |
| 2 | 41.6 µs | 41.59 s |
| 3 | 94.0 µs | 47.12 s |
| 4 | 28.7 µs | 53.32 s |
| 5 | 47.6 µs | 47.60 s |

| Statistic (N = 5) | Value | Against `LOD_CANCEL_OBSERVED_CEILING_MS` = 100 ms (`docs/08:8`) |
|---|---|---|
| **p50** | **0.0476 ms** (47.6 µs) | inside |
| **p95** (nearest-rank = the 5th sample = the max) | **0.094 ms** (94.0 µs) | **inside — 0.094 % of the ceiling** |
| **max** | **0.094 ms** (94.0 µs) | always reported |
| min | 0.0287 ms (28.7 µs) | — |

**O7 verdict: met.** The p95 carries the verdict and it is **0.094 ms against a 100 ms budget**.
**I3 did not fire, and no ceiling was touched.** **P6 holds on this evidence** — per-feature
cooperative cancellation meets `docs/08:8` at 5 GB scale.

**`cancel_quiescent` — not instrumented, and that is a gap, not a pass.** ADR-018 asks for it beside
the verdict with no budget attached. `engine/tests/lod_tier_cancellation.rs` stamps `cancel_requested`
and `cancel_observed` only; `TierBuildProgress` has no quiescent callback, and `build_tiers`'s return
is stamped by nobody. What *is* asserted instead, every run: the cancelled build removed the partial
tier it was writing, and the tier directory held **no** parquet file afterwards — a statement about
the artifact's quiescence, not about its timing. **Reporting `cancel_quiescent` for this operation is
owed**, and no figure is invented for it here.

**One reading, stated so the margin is not over-read:** each of these five intervals is the time from
a cancel request to the *next per-feature check* in a worker, which is a sub-millisecond window by
construction (`LOD_CANCEL_CHECK_FEATURES` = 1). §7 declares the residual that this instrument cannot
see — a cancel landing *inside* one `simplify_vw_preserve` call waits for that call to finish. The
largest such call observed tonight is in row 3/4's residual line: **38.392 ms**, itself inside the
100 ms ceiling.

---

## Row 3 — O6, build wall time on `polygons-100k`, arm S vs arm P

**Command** (00:12Z → 00:19Z, one process, 418.68 s total):

```
cargo test --release -p spatial-engine --test lod_tier_measurements -- --ignored --exact \
  wall_time_arm_s_and_arm_p_over_polygons_100k --nocapture
```

Arm **S** = `LOD_BUILD_WORKERS_ARM_S` = 1 worker; arm **P** = `LOD_BUILD_WORKERS` = 8. Both are
declared constants passed to `build_tiers`, never read from the machine. Five samples per arm, arm S
first then arm P, each sample preceded by a directory clear and followed by a ladder delete; every
sample asserts `was_rebuilt()` on all three tiers, so **no sample is a reuse**. The measured interval
is `build_tiers` alone (which includes its own whole-file content hash of the 151,812,642 B source).

### Totals — `build_tiers`, per sample (ms)

| Arm | s1 | s2 | s3 | s4 | s5 | **p50** | **p95 = max** | min | spread (max/min) |
|---|---|---|---|---|---|---|---|---|---|
| **S (1 worker)** | 71,681.053 | 63,319.197 | 55,158.439 | 55,108.316 | 57,765.109 | **57,765.109** | **71,681.053** | 55,108.316 | 1.301 × (30.1 %) |
| **P (8 workers)** | 19,016.498 | 21,294.802 | 26,800.197 | 24,013.736 | 22,814.811 | **22,814.811** | **26,800.197** | 19,016.498 | 1.409 × (40.9 %) |

**Dispersion is disclosed rather than smoothed:** arm S's first sample is its slowest (cold file
cache), and arm P drifts upward across its five. Both p95s are their arm's maximum by the declared
estimator.

### Per-tier wall marks (ms), same five samples

`start(N)` is the first `tier_progress` callback of tier N on the sample's own clock origin;
`span(N) = start(N+1) − start(N)` covers tier N's simplify **and** its write; `span(3)` additionally
carries the manifest write and the set's construction. `start(1)` is the pre-tier preamble: the CRS
unit read, the whole-file content hash, the preflight and the manifest read.

| Arm | Phase | s1 | s2 | s3 | s4 | s5 | **p50** | **p95 = max** |
|---|---|---|---|---|---|---|---|---|
| S | preamble → tier 1 | 945.115 | 1,097.786 | 816.211 | 820.707 | 785.682 | **820.707** | **1,097.786** |
| S | tier 1 span | 20,022.969 | 24,553.533 | 18,591.639 | 18,622.745 | 18,735.848 | **18,735.848** | **24,553.533** |
| S | tier 2 span | 19,962.470 | 19,455.062 | 17,976.456 | 17,851.663 | 18,998.355 | **18,998.355** | **19,962.470** |
| S | tier 3 span (+ manifest) | 30,750.499 | 18,212.816 | 17,774.133 | 17,813.201 | 19,245.225 | **18,212.816** | **30,750.499** |
| P | preamble → tier 1 | 749.162 | 831.972 | 922.641 | 908.704 | 861.259 | **861.259** | **922.641** |
| P | tier 1 span | 6,184.810 | 6,903.205 | 8,859.568 | 8,548.218 | 8,137.473 | **8,137.473** | **8,859.568** |
| P | tier 2 span | 6,200.329 | 6,668.719 | 8,135.374 | 7,510.511 | 7,154.597 | **7,154.597** | **8,135.374** |
| P | tier 3 span (+ manifest) | 5,882.197 | 6,890.906 | 8,882.614 | 7,046.303 | 6,661.482 | **6,890.906** | **8,882.614** |

### The artifact, identical in all ten samples

| Tier | Min triangle area | Vertices before → after | **Reduction** | O5 expectation (§3) | Verdict | Bytes |
|---|---|---|---|---|---|---|
| 1 | 0.1 m² | 10,467,093 → **10,078,396** | **0.0371** | **≈ 0.037** (`:115`) | **holds** | 146,156,361 |
| 2 | 1.0 m² | 10,467,093 → **7,642,017** | **0.2699** | **≈ 0.270** (`:117`) | **holds** | 111,947,854 |
| 3 | 5.0 m² | 10,467,093 → **3,491,136** | **0.6665** | **≈ 0.667** (`:119`) | **holds** | 53,248,500 |

All three **emitted vertex counts are the same integers the spike recorded** (§3's O5 table quotes
each), in all ten samples, on both arms. **The builder is deterministic across worker counts**: the
byte sizes and SHA-256s were identical sample to sample and arm to arm. **O5 has no recorded
deviation on this fixture; P4 holds.**

**O8 on this fixture:** set total **311,352,715 B** against a hard bound of 455,437,926 B (3.0 ×
151,812,642) — **within, 68.36 % of the bound**; per tier 0.9627 × / 0.7374 × / 0.3508 × against the
1.0 × per-tier ceiling. The set is **2.0509 × source**, above the withdrawn 2.0 × set ceiling
(Amendment 5's finding, reproduced).

**P5 — direction only, and the direction holds.** Arm P's wall time is lower than arm S's, and the
two do not overlap: **arm P's maximum (26,800.197 ms) is below arm S's minimum (55,108.316 ms)** in
all five pairings. No speed-up figure is asserted from this, here or anywhere (§1); the two arms'
distributions are printed above and the comparison is read from them.

### §6's residual — `TierSet::max_single_feature_simplify()`, per sample (ms)

| Arm | s1 | s2 | s3 | s4 | s5 |
|---|---|---|---|---|---|
| S | **32.6661** | 2.2313 | 1.6885 | 1.6203 | 1.5702 |
| P | 2.8213 | 3.0067 | 3.0554 | 3.9950 | 4.3761 |

The instrument is wall time around one `simplify_vw_preserve` call
(`engine/src/lod.rs:1521-1526`), so it **includes any preemption of the calling thread** and is not
a pure CPU cost of the geometry. Arm S's first sample (32.67 ms) is an order above the other nine and
is the session's first build; it is reported, not discarded.

---

## Row 4 — O6, build wall time on `parcels-5gb`, and the 5 GB O2/O3/O4 verification

Two runs, both `build_tiers`-only intervals on the harness's own clock (each includes exactly **one**
whole-file content hash, inside `build_tiers`), both under §3's disk discipline with tier N−1 deleted
as tier N starts. **Single samples; neither is a p50/p95.**

```
cargo test --release -p spatial-engine --test lod_tier_measurements -- --ignored --exact \
  the_5gb_ladder_outcomes_o1_to_o4 --nocapture          # arm P, with verification   00:21–00:35Z
cargo test --release -p spatial-engine --test lod_tier_measurements -- --ignored --exact \
  wall_time_arm_s_over_parcels_5gb --nocapture          # arm S                      00:35–01:04Z
```

| Arm | `build_tiers` total | preamble → tier 1 | tier 1 span | tier 2 span | tier 3 span (+ manifest) | Residual `max_single_feature_simplify` | Whole-test duration |
|---|---|---|---|---|---|---|---|
| **P (8)**, *with* the O2/O3/O4 verification inside the build | **778,453.398 ms** (778.45 s) — one sample | 27,182.630 | 300,395.959 | 236,608.460 | 214,266.349 | **38.392 ms** | 842.43 s |
| **S (1)** | **1,709,062.179 ms** (1,709.06 s) — one sample | 21,303.189 | 578,347.103 | 553,044.046 | 556,367.841 | **2.9743 ms** | 1,731.67 s |

**Two things the arm-P figure carries and the arm-S figure does not, stated before it is read:**
(1) the O2/O3/O4 verification of tier N−1 runs **inside** the progress callback, on the building
thread, so tier 1's and tier 2's spans each include that tier's whole-column id read — the total is
an **upper** bound on a clean arm-P `build_tiers`; and (2) the custodian's ~15 GB worktree
reclamation overlapped this run (free space jumped from 55.49 GB at its start to 70.97 GB by tier 2).
Both push arm P's number **up**, so the direction below is the conservative one.

**P5 at 5 GB — direction only, and the direction holds:** 778.45 s (arm P, inflated as described)
against 1,709.06 s (arm S, clean). **One sample per arm, not a p50/p95**; no ratio is asserted.

**Row 1's arm-P sample is the clean one and is not the same interval** (789.05 s, but covering the
whole test including a *second* whole-file hash). The three 5 GB builds produced **byte-identical
ladders** — same vertex counts, same per-tier bytes (4,822,812,458 / 3,693,668,762 / 1,755,439,602),
same set total 10,271,920,822 B — across both arms and all three runs.

### O2, O3, O4 at 5 GB — verified per tier, before disk discipline removed it

Never asserted at this scale before: `engine/tests/lod_tier_builder.rs`'s T2/T3/T7 run on
`polygons-100k` only, and the ignored 5 GB ladder test checks none of them.

| Tier | O2 — identity | O3 — the engine opens its own tier | O4 — row order |
|---|---|---|---|
| 1 | **ok** — 3,300,000 ids, no duplicate, none missing, none extra | **ok** — opens with the source's CRS identifier, geometry column, GeoParquet version, its own covering bbox columns, and the source's identity column by name | **ok** — positionally equal to the source's identity order, every row |
| 2 | **ok** — 3,300,000 | **ok** | **ok** |
| 3 | **ok** — 3,300,000 | **ok** | **ok** |

**O2, O3, O4 verdicts: hard gates met at 5 GB.** With row 1's and row 3's evidence: **P2 holds**
(identity preserved on every row of every tier, 9,900,000 rows per ladder) and **P3's re-read half
holds at this scale** — the tiers were re-read through the Parquet reader and through
`Dataset::open`; P3's bit-identical-geometry half is `wkb_writer_round_trips_the_first_tier_written`
in the gated suite, on `polygons-100k`, and is not re-derived here.

---

## Verdicts

| Outcome | Class (§3) | Verdict | Where it is proven |
|---|---|---|---|
| **O1** — validity, 0 invalid | **HARD GATE** | **met** — 0 invalid over 29,700,000 feature-validations at 5 GB and 3,000,000 at 100k; **I2 did not fire** | Row 1, *O1*; row 3 |
| **O2** — identity on every row | **HARD GATE** | **met** at 5 GB, all three tiers | Row 4, *O2/O3/O4 at 5 GB* |
| **O3** — the engine opens its own tier | **HARD GATE** | **met** at 5 GB, all three tiers | Row 4, *O2/O3/O4 at 5 GB* |
| **O4** — row order | assertion | **met** at 5 GB, all three tiers, positionally | Row 4, *O2/O3/O4 at 5 GB* |
| **O5** — vertex reduction | expectation | **holds; no recorded deviation.** Every expectation §3 declares was met to four places, and every emitted vertex count equals the spike's integer | Row 1 table; row 3 *The artifact* |
| **O6** — wall time | measurement, reported only | **reported**: p50/p95/max per arm at 100k (N = 5 per arm); single samples at 5 GB | Rows 3 and 4 |
| **O7** — `cancel_requested → cancel_observed` | measurement vs `docs/08:8` | **met — p95 0.094 ms against 100 ms**; max 0.094 ms; **I3 did not fire** | Row 2 |
| **O8** — tier-set disk footprint | assertion vs the bound | **within** — 2.0526 × source at 5 GB and 2.0509 × at 100k, against the 3.0 × by-construction bound; every tier within the 1.0 × per-tier ceiling | Row 1 *O8*; row 3 |

| Prediction (§5) | Verdict on tonight's evidence |
|---|---|
| **P1** — 0 invalid at every ladder area on both fixtures | **held**; §2a's falsifier did not fire |
| **P2** — identity preserved on every row | **held**, including at 5 GB for the first time |
| **P3** — the writer round-trips and the tier opens | **held** for the re-read and open halves at 5 GB; the bit-identical-geometry half is the gated suite's, at 100k |
| **P4** — reduction inside O5's ranges | **held**, no deviation recorded |
| **P5** — arm P faster than arm S (direction only) | **held** at both scales, with no overlap at 100k (max P < min S over five samples each) and on single samples at 5 GB |
| **P6** — per-feature cancellation meets `docs/08:8` | **held**: p95 0.094 ms |

**Invalidators:** I2 did not fire. I3 did not fire. **I6's condition did arise once, mid-session,
and was resolved before any further 5 GB run** — see below. I1, I4, I5 are not this gate's.

---

## Machine state and contention — disclosed, not absorbed

1. **A 2.5 GB drop in free space inside row 3.** Between arm S sample 2 and sample 3 the free space
   on `C:` fell from 43,563,208,704 B to 41,057,435,648 B. No `cargo`, `rustc`, `link`, `cl` or
   `vitest` process was present at the checks that bracket the row, so the writer is **not
   attributed**. Effect on the numbers, stated rather than guessed: the sample that followed the drop
   (arm S s3, 55,158.439 ms) is the *second fastest* of its arm, so no slow-down is visible in the
   data — but the row was taken on a machine that was not provably alone with the disk, and that is
   recorded here rather than left out.
2. **I6, and what was done about it.** That drop left free space at **38.24 GiB, below the tests'
   own 40 GiB floor** (`MIN_FREE_BYTES`). Rows 1 and 2 had already completed, both at ≈ 40.6 GiB
   free, above the floor; **no 5 GB row ever refused, and no measurement was taken below the floor.**
   Rather than measure on a constrained volume (§5's I6), the run stopped and **16.36 GB of *my own*
   worktree's `target/debug` build cache was deleted** — this worktree's own regenerable artifacts,
   containing no evidence and no other worker's output — restoring 51.68 GiB free at 00:21:10Z.
   Nothing that was not mine was deleted. Both 5 GB rows that followed printed their own free-space
   reading against the floor before starting.
3. **The custodian's ~15 GB reclamation landed inside a measured interval.** During the verified
   arm-P 5 GB run the free space jumped from 55,492,333,568 B to 70,965,100,544 B — four merged
   worktrees' build directories being deleted by another actor. That is disk activity inside a
   measured window. Consequences: the verified arm-P total (778.45 s) is **not** a clean timing
   sample and is labelled as such wherever it appears; **row 1's 789.05 s is the clean arm-P sample**
   and had no such overlap; and the arm-S 5 GB run began at 00:35:32Z, after the reclamation had
   settled (free space held at ≈ 70.94 GB throughout it).
4. **Resident idle processes.** Three `node` helper servers of the OpenAI Codex runtime have been
   resident since 2026-09-15, with cumulative CPU of 0.06 s, 0.06 s and 0.28 s across two days. They
   are recorded for completeness; they ran no work in this session.

**Total measured time:** **4,012 s** (66.9 min) summed over the measured runs — row 1 789.05 s,
row 2 230.40 s over five runs, row 3 418.68 s, row 4 842.43 s + 1,731.67 s — inside the window
23:53:58Z → 01:04:25Z.

---

## Not run, not reported, and why

- **`cancel_quiescent`** — not instrumented anywhere in this piece (row 2). ADR-018 asks it be
  reported beside the verdict with no budget; there is no callback to stamp it. **Owed.** What is
  asserted instead is that the cancelled build left no partial tier on disk.
- **A second 5 GB sample per arm** — row 4's declared N was 1 per arm, and 1 per arm is what was
  taken. A 5 GB p50/p95 would need five ladders per arm; at ~13 min (arm P) and ~29 min (arm S) per
  ladder that is ≈ 3.5 h of building, which this session did not have and which nothing in §3
  declares.
- **O2/O3/O4 on `polygons-100k`** — not re-run here; they are T2/T3/T7 in the gated suite, green at
  attempt 2 (§10 Amendment 8 (e)). This file adds them at 5 GB, where they had never run.
- **O1 re-derived from the written bytes at 5 GB** — not done, and the reason is that it would
  measure the same property twice: the builder validates every feature before writing it and refuses
  the build otherwise. Re-decoding 332 M+ vertices per tier would add ~1 h per ladder and could only
  confirm what the refusal already guarantees.
- **macOS / Linux** — out of this cut by §10 Amendment 8 (a): the tier root is `%LOCALAPPDATA%` and
  the free-space call is `GetDiskFreeSpaceExW`; every build refuses elsewhere, fail-closed.
- **Any `docs/08` row, any route-A comparison, any claim** — out by §1, and nothing here proposes
  one.
