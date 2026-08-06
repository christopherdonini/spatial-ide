# Preregistration — first-pixels probe and index-in-path measurement pass

**Written and committed before the instruments were run and before any result of this pass was
looked at.** Its purpose is to make the difference between "the budget was missed" and "the budget
was met" reportable at all. The instrument this replaces took **n = 1 page load per compositor
path** and its artifacts self-declared `"status": "hypothesis-forming, NOT a preregistered
measurement"` — an instrument in that state can report a *miss* (one sample over a budget is enough
to fail it) but can never license a *met*.

| | |
|---|---|
| **Tree under measurement** | `engine-first-cut` at **`87644cb`** (pieces 1–4a) plus this pass's own instrument commits. The exact pin is recorded by `kernel/scripts/pin-tree.mjs` before the build and re-verified after |
| **Where it runs** | the git worktree `.claude/worktrees/transport-bakeoff`, detached at that commit, with `CARGO_TARGET_DIR` pointing at its own `target/` and `CARGO_PROFILE_RELEASE_DEBUG=false` |
| **Written before** | any build of this pass, any probe run, any harness run |
| **Amendment rule** | amendments are appended below with a timestamp and a reason. **An amendment made after any result of this pass has been looked at invalidates the run**, and the run is re-done rather than re-described |

---

## 1. What is being measured, and what each segment means

Two instruments, on two different paths. They are **never subtracted from one another** — the
87–94 ms "WebSocket open" figure in the existing `RESULTS.md` and its 334 ms first-pixels figure are
on different paths, and the same rule applies here.

### 1a. Browser path — `kernel/scripts/run-slice-probe.mjs` + `frontends/canvas-probe`

One **trial** = one page load = one solo stream, run to completion. All clocks are the consumer's
own `performance.now()` in the page, so every segment below is on one clock and no clock-relation
bound is needed or claimed.

| Instant | Defined as |
|---|---|
| `t_scenario` | first statement of the scenario function |
| `t_query_start` | **the budget's zero.** Taken immediately before `startStream(...)` is called — the moment the application decides to run this query |
| `t_open` | the OPEN frame is delivered to the sink: the producer has accepted the stream, which means the SQL was built (**including index consultation, when an index exists**) and a DuckDB connection was made |
| `t_first_bytes` | the first BATCH payload is delivered to the sink, **before** any decode |
| `t_first_decoded` | `decodeBatch` has returned for batch 0 |
| `t_first_pixels` | inside the `requestAnimationFrame` callback, after `drawBatch` has returned for batch 0 |
| `t_last_pixels` | the same, for the final batch of the stream |

| Segment | Meaning |
|---|---|
| **S1 `t_scenario → t_query_start`** | page setup and the pre-warm issue. **Outside the budget's clock**, recorded so it can be seen not to be hiding in it |
| **S2 `t_query_start → t_open`** | socket acquisition (≈0 when pre-warmed, a full open + subprotocol handshake when not) **plus** producer accept: SQL build, index consultation, DuckDB connect |
| **S3 `t_open → t_first_bytes`** | the engine scanning until the first batch is full, framing it, and the wire delivering it |
| **S4 `t_first_bytes → t_first_decoded`** | JS Arrow decode of batch 0 |
| **S5 `t_first_decoded → t_first_pixels`** | wait for the next animation frame, plus the canvas draw |
| **first-pixels = S2+S3+S4+S5** | `docs/08`'s "first pixels < 100 ms after query start" |
| **full-payload = `t_last_pixels − t_query_start`** | reported **always together with first-pixels**, never alone |

**The index segment is structurally absent on this path** and is declared absent rather than
reported as zero: `slice-host` never calls `Dataset::build_index`, so every browser trial runs
`ScanOnly` (viewport) or `WholeFile` (no viewport). S2 is the segment that *would* contain index
consultation.

**Declared sample count: n = 7 trials per cell**, cell = (compositor path × query viewport).
Compositor paths: **headless** and **headed** — headless changes the compositor and GPU path, so
they are separate cells and are never pooled. Query viewports: **full** (no bbox), **quarter**
(bbox = half the extent per axis ⇒ ¼ of the area), **1/64** (⅛ per axis). The *display* viewport is
held fixed at the fixture's full extent in every trial, so only the query changes and the draw
transform does not.

Reported per cell: **p50 and p95 by nearest rank** (sort and index — the method every earlier figure
in this repository used), **with every raw sample in the artifact**. At n = 7 the nearest-rank p95 is
the maximum sample; that is stated wherever a p95 is quoted rather than left for a reader to work out.

A secondary, declared-in-advance comparison: **pre-warm on vs off**, same binary, same session,
headless, full viewport, n = 7 each. This is a consumer-side toggle over identical product code and
is the only A/B this pass can run honestly. **Piece 3's batch sizing cannot be A/B-ed** — it is a
compile-time constant — so no before/after for it is claimed; only the batch shape it produces is
recorded.

### 1b. In-process path — `kernel/tests/indexed_budgets.rs`

Both ends in one process, therefore one clock, therefore no clock-relation bound is needed or
claimed. This is where cancellation, memory and the index live, because a producer-side instant and
a consumer-side instant have to be comparable for those to mean anything.

**Cancellation is always measured producer-side, on the producer's own `Instant`**, against the
canceller's `Instant` taken immediately before the cancel is issued. A threshold asserted across a
thread handoff measures scheduling, not the property (`RESULTS.md`, finding 1), so the observation
instant is stamped *inside the thread doing the work*, never after a handoff back to the caller.

Four cancellation cases, all with the index in the path where an index exists:

1. **mid-stream** — n = 30, generous credit so the producer is genuinely generating when CANCEL
   arrives.
2. **before the first batch** — n = 30, no credit granted, so nothing is ever delivered and the
   query is running when CANCEL arrives.
3. **during an index build** — n = 12, over a declared delay ladder (10, 25, 50, 100, 200, 400 ms,
   two trials each). Which phase each delay landed in — content hashing, or the DuckDB bbox scan —
   is attributed **afterwards** from the `content_hash_millis` / `build_millis` split that one
   successful build on the same file reports. Trials run on a **second copy of the fixture**, so a
   cancelled build cannot disturb the cache entry the query measurements use.
4. **during the identity uniqueness scan** — n = 15, delay ladder 5, 10, 15, 20, 25 ms. Trials in
   which the cancel arrived after the scan had already finished are **counted and reported
   separately**, not silently dropped and not counted as latency samples.

Index quantities, kept apart as separate numbers and **never netted into "pays for itself after N
queries"**: `content_hash_millis`, `build_millis`, `indexed_features`, `declared_memory_bytes`,
`scanned_rows`, and the cache-hit report for a reused index.

Selectivity: **full / quarter / 1-64**, n = 7 each, run **twice** — once with no index built
(`ScanOnly`/`WholeFile`) and once after the index is built (`IndexNarrowed`, or whatever plan
actually ran). **Time to first batch and total stream time are both reported at every point.**
`RESULTS.md`'s existing non-monotonicity finding — the quarter extent's *first* batch arriving later
than a full scan's — is exactly the mechanism an index changes, so quoting only "total fell" would
manufacture an improvement.

`FilterPlan` is recorded for every selectivity point. The wire carries no plan, so it is observed on
an **engine-direct stream with identical parameters**, and is labelled as such.

**Order is part of the design, because the index cache is process-wide and per path:** unindexed
selectivity runs *before* any index exists in this process, and cannot be re-run afterwards.

---

## 2. Declared invalidators

If any of these fires, the affected rows are reported as **not established**. They are not repaired
by re-describing them.

1. **Debug build.** `debug_assertions` on, or a build not produced by `--release`. Both harnesses
   refuse to run. A figure from a debug build is not a larger figure; it is not a figure.
2. **The tree moved mid-run.** `kernel/scripts/pin-tree.mjs` is taken before the build and
   `--compare`d after the build and again after every measurement phase. Any file that moved
   invalidates every number taken across that window. (This happened during the first pass recorded
   in `RESULTS.md` and is why the pin exists.)
3. **Canary spread beyond the declared threshold.** A fixed, transport-insensitive workload is timed
   at four points — start, mid, end, and settled after 20 s idle — **min of 3** at each point.
   **Threshold: > 10 % spread across the four minima invalidates that instrument's rows.** The raw
   spread across *all* readings is disclosed either way, as `RESULTS.md` now does (it recorded 5.45 %
   across the four minima and 18.04 % across all twelve raw readings in the same session).
4. **Segments that do not sum.** For any browser trial, `|(S2+S3+S4+S5) − (t_first_pixels −
   t_query_start)| > 0.5 ms`, or any segment negative, or `t_last_pixels < t_first_pixels`.
   Such a trial is dropped, **counted, and reported as dropped**; more than one dropped trial in a
   cell invalidates that cell.
5. **A stream that did not complete.** Any trial whose terminal is not `Completed`, or whose row
   count differs from the fixture's, invalidates that trial.
6. **A cancellation trial whose producer never observed the cancel** invalidates that trial and is
   reported.

One re-run of an invalidated phase is permitted; **both attempts are reported**, the first one is not
deleted.

---

## 3. Declared out of scope — stated now so it cannot be quietly added later

- **Cold anything.** This machine has 63.7 GiB of RAM, no cache-purge mechanism in either harness,
  and (at the time of writing) single-digit GiB free on `C:`. "Cold open of a 5 GB GeoParquet" stays
  **unmeasured**, for the two independent reasons `RESULTS.md` already records: there is no room for
  the fixture beside a release build, and even with room the Windows file cache absorbs the file, so
  *cold* could not be established.
- **Between-session comparison.** Every comparison in this pass is within one session. **No figure
  in `RESULTS.md`'s existing section is a baseline for anything here** — that section describes an
  earlier tree measured in an earlier session, and the same canary instrument read 129.4–136.5 ms in
  one session and 68.6 ms in another. The unindexed baseline is therefore **re-measured in this
  session**, from the same binary.
- **Throughput.** Byte totals and durations are recorded side by side and are never divided. Nothing
  in this pass cites ADR-012.
- **Frame time.** The 2D canvas probe is not the renderer module; a frame-time figure taken from it
  would answer a different question than the budget it would appear to answer.
- **VRAM.** There is no renderer module and nothing in this slice owns a GPU buffer.
- **macOS and Linux.** `docs/07`'s open follow-up. Nothing here says anything about either.
- **A verdict of "met" on n = 1.** If first-pixels crosses 100 ms, "met" may be reported **only**
  under this preregistration with n ≥ 5 per cell and every invalidator above clear. Otherwise the row
  reads **not established**.

---

## 4. Amendments

*(appended in order; each carries a timestamp and a reason)*

**A1 — 2026-08-05, before the build, before any result.** The pre-warm A/B in §1a requires the probe
page to be able to *skip* `prewarm()`; the page as committed at `87644cb` always calls it. The
instrument commit adds a `prewarm=0` URL parameter to the probe page for this purpose. Declared here
because it is a change to the consumer that is under measurement, not only to the driver around it.

**A6 — 2026-08-05, after the second probe attempt was invalidated. The cause was the instrument's
own litter.**

The second headless attempt fired the canary invalidator again and the headed cell failed outright
("browser never reported a debugging endpoint"). The cause was found rather than guessed at: **the
probe leaked 73 browser profile directories, about 6 GB, into the OS temp directory and filled the
disk part-way through the run** — free space went from 5.4 GiB at session start to 1.9 GiB, and
deleting the leaked profiles returned it to 7.9 GiB.

`run-probe.mjs` deleted its throwaway profile with a single `rmSync` after a 500 ms sleep and
documented the cleanup as "best-effort". **At n = 1 per compositor path that was true and harmless.
At the sample count a preregistered measurement needs, it is neither**: 63 trials filled the volume,
and every timing taken after that point describes a thrashing machine. An instrument corrupted the
measurement it exists to enable, and the corruption arrived as "the machine drifted".

Corrections, all instrument defects and none a threshold change:

- `run-probe.mjs` retries the profile removal with backoff, checks it actually went, and **prints
  and records a leak** when it did not.
- The driver **sweeps leftover profiles before and after each run**, records free disk at both ends,
  and **refuses to start below 3 GiB of headroom** — a run that fills the disk part-way cannot say
  which of its trials that affected.
- The sweep happens *before* the end-of-run canary, so disk pressure the instrument itself created
  cannot be read as the machine drifting.

Attempts 1 and 2 of the probe are both reported. Neither is deleted, and no figure from either is
promoted to a result.

**A5 — 2026-08-05, after the first headless probe attempt was invalidated on declared grounds.**

The first headless probe attempt produced **21 admitted trials with 0 dropped** and was then
invalidated by its own canary: start 226.3 ms, mid 261.8, end **367.4**, settled 259.9 — a spread far
past the declared 10 %. It is reported, not deleted.

Two instrument defects are corrected before the re-run, and **the 10 % threshold is again not among
them**:

- **Canary points were taken while known contending work was still in flight.** Every trial ends by
  `taskkill /T`-ing a browser process tree and the run ends by killing the host and the memory
  sampler; the *end* point was taken immediately after `host.kill()`. A reading taken there measures
  the teardown. Every point now settles for 3 s first.
- **`pin-tree.mjs --compare` reported a false "TREE MOVED".** Given an earlier pin that recorded
  binary hashes, `--compare` hashed nothing on its own side and then reported every binary as
  changed to "(not hashed this time)". It now re-hashes exactly what the earlier pin named. A
  checker that cries wolf is worse than no checker, because a reader learns to skip it.
- The driver now **exits non-zero** when the canary or the pin invalidator fires. The first attempt
  exited 0: the artifact said `INVALIDATED` and the shell said success.

**What the first attempt already establishes regardless, and why it is not thrown away.** The
verdict *missed* is robust to canary drift in a way the point estimates are not: the budget is
"first pixels < 100 ms", and the **minimum over all 21 admitted trials was 160.3 ms**. Drift cannot
carry a 160 ms minimum under 100 ms. So the verdict stands on the first attempt alone, while the
p50/p95 figures from it are reported as **recorded, not established**.

**A4 — 2026-08-05, after attempt 1 was invalidated on declared grounds. Read this one carefully,
because it is the amendment that costs the most.**

Attempt 1 of the in-process harness ran and **fired two declared invalidators**. It is reported, not
deleted, and none of its numbers are quoted as results anywhere:

1. **Canary spread 21.72 % across the four minima**, against the declared 10 % threshold
   (readings: start 142.9 ms, mid 117.4, end 118.2, settled 137.9).
2. **Build provenance.** The harness binary contained the string `"identity min: "`, which exists
   only in *another checkout's uncommitted* `engine/src/dataset.rs` and **nowhere in the pinned
   tree**. The source pin verified clean before and after. The two checkouts shared one
   `CARGO_TARGET_DIR`, so a compilation unit built elsewhere reached a binary built here. A source
   pin does not pin a build.

**The honesty cost, stated rather than buried: attempt 2 is not blind.** Attempt 1's numbers have
been seen. That is a real weakening of this preregistration and it is disclosed here instead of
being papered over by presenting attempt 2 as if it were the first.

What changes for attempt 2 — **and the 10 % canary threshold is not among them.** Moving a threshold
after seeing it fire is the exact move a preregistration exists to prevent:

- **Build provenance becomes part of the protocol.** The workspace crates are rebuilt **from clean**;
  the source pin is taken **before** the build and compared **after** it (attempt 1 pinned after the
  build, so the build window was unbracketed); `pin-tree.mjs --binaries` records the SHA-256 of every
  binary that produces a number, checked again after the run; and the harness is executed from a
  **private copy** of its binary so no other process can replace it mid-run.
- **Each canary point gets a discard warm-up** — one 100 M-iteration reading, thrown away, taken
  immediately before that point's three timed readings. This is an instrument correction, not a
  threshold change: attempt 1's *settled* point was the second-slowest of the four, and a reading
  taken on a CPU that has been idle for 20 s measures how fast the governor ramps, not how fast the
  machine is. The same correction applies to the JS canary in the probe driver.
- **A quiescence check before the run**: no `cargo`, `rustc` or `link.exe` belonging to another
  process may be running when a phase starts. Attempt 1 raced at least one.

If the canary invalidator fires again at 10 %, the affected rows are reported as **not established**
and the canary's own behaviour is reported as a finding. That is a legitimate outcome of this pass
and it will not be converted into a result by relaxing the threshold.

**A3 — 2026-08-05, before the build, before any result.** Two changes to the cancellation ladders in
§1b, both forced by how the code under test is actually shaped, and both declared before a single
trial ran.

- **Index-build ladder terminates on the first completed build.** A build that is *not* cancelled
  inserts an index into the process-wide cache, and every later `build_index` on that file is then a
  cache hit that never scans — so trials after it would be timing a different operation under the
  same name. The ladder therefore runs its delays in ascending order and **stops at the first trial
  that completes**, and the artifact records how many trials that left. This can reduce n below the
  declared 12; the actual n is reported, and a reduced n is reported as reduced.
- **The identity-scan ladder becomes 5, 15, 30, 50, 80 ms × 3 (n = 15).** `Dataset::open` does
  several uninterruptible things — read `geo` key/value metadata, probe the schema, admit the CRS —
  *before* the identity scan is the thing running, and a ladder that lands entirely inside that
  prelude cannot show where the observation point is. The wider ladder is chosen to straddle it.
  **The prelude being uninterruptible is a property to report, not one to design the ladder around
  hiding.**

**A2 — 2026-08-05, before the build, before any result.** The probe page as committed at `87644cb`
sends **no bbox** — its `--extent` argument only sets the *display* transform, so every trial in the
existing artifacts streamed the whole file regardless of the extent passed. The instrument commit
adds a `bbox`/`bbox_crs` URL parameter that is forwarded into the START request, so the three query
viewports in §1a can be issued at all. Both sides of the wire already support a bbox; only the probe
page did not use it.

---

**A7 — 2026-08-06, before the build, before any result of this pass. The reused-connection cut.**

*(Appended at the end of the file. A1–A6 above run A1 then descending, which was an accident of how
they were written; this one is placed where an appended amendment belongs and the inconsistency is
noted rather than silently tidied, because renumbering an amendment block is exactly the kind of
edit a preregistration exists to prevent.)*

This amendment governs a **new pass on a new tree** and declares everything about it before any of
its numbers exist. Three product changes precede it — the fixed-grid index is out of the default
planner, configured DuckDB connections are reused per open dataset, and every O(N) index-build
phase now polls cancellation — and their code and tests were committed before this text was written.

**Tree under measurement.** Branch `cut/scanonly-reuse-cancellation`, based on `a64b861` (`main`).
**This is a different product tree from the one §"Tree under measurement" at the top of this file
names.** That pass measured `87644cb` on a measurement branch that deliberately excluded
`fba323e`'s reviewer fixes; this one is built on `main`, which contains them. Nothing in this pass
may be compared with anything in that one.

### A7.1 — The reused-connection S2 contrast

**What is being contrasted.** Two DuckDB connection configurations on one binary: `reuse` (the
product default — a configured connection is kept for the life of the open dataset) and `fresh`
(the measurement control — nothing is kept, so every query creates and configures a connection, as
this engine did before). The selector is a `slice-host` flag, `--duckdb-connections`. It does not
touch `StreamParams`, SKP or the wire format, and the control is a **capacity of zero on the same
code path**, not a second implementation — so the contrast measures reuse rather than two branches.

**Declared cell.** Headless · pre-warm **off** · whole-file query (`full=`, no bbox) · the same
`docs/08` Polygons fixture (100 000 features / ~10M vertices) · one solo stream per page load ·
**n = 7 admitted trials per mode**.

**Declared interleaving, fixed now:**
`off, on, on, off, off, on, on, off, off, on, on, off, off, on`.
Running one mode and then the other would confound the mode with time and order drift on a machine
this repository has already caught drifting mid-session.

**One `slice-host` process per trial, in both modes.** The mode is a host-level setting, so
interleaving requires a restart at every switch; restarting only at switches would give the two
modes different treatments. Restarting every time makes the restart a constant rather than a
variable. Host start→ready is recorded separately and is outside every segment.

**What this cell can establish, stated before it runs.** It measures **connection preparation at
open**, *not* reuse across streams: one host per trial and one solo stream per page load means no
browser trial here ever runs on a connection a previous *stream* used. What reuse-on buys in this
cell is that a configured connection existed before `t_query_start`. **Reuse across streams is
established by `engine/tests/connection_reuse.rs`, in process, and not by this cell**, and the
write-up must say so in those words.

**Lease generation is defined here, before any artifact exists.** Generation counts every lease of a
physical connection **including the one `Dataset::open` takes** for the `geo` metadata read, the
schema probe and ADR-016's identity scan. So a connection prepared at open and handed to the first
stream reports generation **2**; a connection created for a query reports **1**. Fixing this now is
the point: "the artifact proves reuse" must not turn on a definition chosen after seeing the
artifact.

**Metrics.** Per mode, every raw sample retained, nearest-rank p50/p95 for S1, S2, S3, S4, S5, first
pixels after query start, and full payload after query start — **full payload always reported beside
first pixels, never alone**. Then the signed delta `reuse-on − reuse-off` in milliseconds.
Producer-side connection facts (physical connections created, lease generation, whether the query
received an already-configured connection) are **supporting facts on the producer's own clock and
counters and are never subtracted from browser S2**.

**No minimum improvement is declared, and none is implied.** Correctness and admissibility are the
gates. The result may be improved, tied, or worse; if it is tied or worse that is reported without
changing the protocol or the threshold. **An S2 improvement is not progress toward the first-pixels
budget**: S3 alone was 119.1 ms p50 in the established cell, so the budget verdict stays *missed*
unless the whole figure goes under 100 ms with every invalidator clear.

**No comparison with the existing 92.6 ms S2 figure is claimed, for three independent reasons:** it
came from a different session; from a different product tree; and from a different procedure (one
host process served every trial there).

### A7.2 — Cancellation inside the DuckDB scan phase

The previous pass **sampled this phase zero times**: all twelve of its delays fell inside the 610 ms
SHA-256 content hash, and the scan is about 30 ms and starts after it. A wall-clock ladder cannot
aim at a phase that short.

**Declared method.** The build reports its phase transitions to a test-only observer. The ladder
waits for `DuckDbScan` to be announced and measures the delay **from that announcement**:
delays **0, 1, 2, 5, 10, 20 ms, twice each (n = 12)**, ascending, on a **third copy** of the fixture
so a completed build cannot populate the cache the other ladders use. The ladder **stops at the
first trial that completes**, because a completed build populates the cache and every later trial
would then time a cache hit under the same name; the reduced n is reported as reduced.

Recorded separately and never as latency samples: trials where the scan finished before the cancel
arrived, and trials where the build never reached the scan. The phase cancellation was **issued in**
and the phase it was **observed in** are both recorded.

**The observation instant does not move.** The latency is still stamped inside the thread doing the
work, at the moment that thread observed the cancel. The observer decides only *when the cancel is
issued*, which is the canceller's side of the measurement and always was. Phase targeting must not
relocate the observation to a convenient thread.

The headline remains producer-observed cancellation acknowledgement against `docs/08`'s < 100 ms
budget.

### A7.3 — Open-time cost

`Dataset::open` now returns its connection to the pool instead of dropping it. What that adds is one
trivial **drained** statement; what it does not add is a connection — open used exactly one
configured connection before and uses exactly one now. Open is timed in **both** connection
configurations, n = 5 each.

**These are absolute figures in this session, not a before/after.** The 26.7–39.9 ms recorded in the
previous `RESULTS.md` section came from another session and is not a baseline for them; §3 of this
document forbids between-session comparison and that rule is not suspended because it would be
convenient here.

### A7.4 — Invalidators

Every invalidator in §2 carries forward unchanged, together with the disk-headroom, profile-leak and
teardown-settling rules amendments A5 and A6 added. **The 10 % canary threshold is not modified.**

Two more, specific to this cut:

- **14 — the artifact cannot prove which DuckDB connection mode actually ran.** A flag records
  intent; only the producer's observed facts record what happened. Discharged when every admitted
  reuse-off trial reports a connection that was **not** already configured and every admitted
  reuse-on trial reports one that **was**. If it fires, **no S2 delta is established.**
- **15 — `t_open` semantics or timestamp placement changed.** `frontends/canvas-probe` and
  `kernel/scripts/run-slice-probe.mjs` are untouched by this cut; `t_query_start` and `t_open` are
  defined and placed exactly as §1a states. The new driver is a **separate** file
  (`kernel/scripts/run-connection-ab.mjs`) precisely so the established cell stays reproducible by
  the instrument that produced it.

### A7.5 — Declared out of scope for this pass

- **Index v2.** Nothing here builds, measures or claims anything about an index that prunes IO. The
  fixed-grid index's own correctness tests still run; its *cost* is not re-measured, because the
  product planner no longer reaches it.
- **Everything in §3** — cold anything, 5 GB, between-session comparison, throughput, frame time,
  VRAM, macOS and Linux — stays out, on the same grounds.
- **The supersession pattern.** A cancelled stream forfeits its connection by design, so a
  superseded query degrades to the fresh-connection path. Any S2 result here is a claim about
  **completed** streams only. This is raw material for the reserved ADR-014 and may not be cited as
  evidence about it.
