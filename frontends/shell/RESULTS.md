# `frontends/shell` client-clock results — viewport-residency cut

## Baseline arm, 2026-08-31

**§1 (binding, restated here, not just in the preregistration).** Every number in this section is
**client-clock**, produced by `e2e/residency-harness.mjs` driving the real dev-mode WebView2 app over
CDP, scored **within this session only**. **No figure below is compared with, or netted against, any
`kernel/RESULTS.md` producer-clock figure** — different process, different clock, different transport
side, per `RESIDENCY-PREREGISTRATION.md` §1. **No number below may be quoted against a `docs/08`
normative row except exactly where `RESIDENCY-PREREGISTRATION.md` §2d's G3/G4/G7 say so** — this is
the *baseline arm's own relationship* to those rows, not a gate verdict (no candidate arm exists yet;
P3 is untouched). ADR-011 gate 8 is not addressed here in any way (that ruling is the human's, per
C4). All cells below are **arm = baseline (pre-residency, today's whole-viewport-refill,
`limits.ts`'s `MAX_RESIDENT_VERTICES` = 2,000,000 in force)**, `buildCommit`
**`f97d6a1f03b09590af64586349005b4c3c49a087`**, `traceVersion` **`"2"`** (Amendment 10's step order:
fit → 5 pans → zoom-to-layer → 3 zoom-ins → 1 zoom-out), `buildClass` **`vite-dev (tauri dev; DEV-gated
hooks; unminified client)`** per Amendment 4 — no release-build number exists anywhere in this file.
Machine: Windows 10 Pro 22H2 build 19045, headed, foreground, human present, RustDesk stopped
process-level (Amendment 11's attestation string, passed verbatim via `--attest` on every trial below).

---

### 1. Derivation of the cell list, trial counts, and ABBA order (quoted from the task, applied)

Per `RESIDENCY-PREREGISTRATION.md` §4, the baseline arm carries **no tile-size dimension** ("today's
whole-viewport-refill behaviour... exists so G4/G7's 'vs. baseline' language has a referent"). Three
cells were run:

1. **instrument-on × Polygons class × baseline** — G3 requires "First-pixels p95, per step-class,
   n ≥ 7" (§2d). The trace's step-classes are `fit` (1 sample/trial), `pan` (5/trial), `zoom-in`
   (3/trial), `zoom-out` (1/trial), `zoom-to-layer` (1/trial); the binding classes for the n≥7 floor
   are the ones supplying only 1 sample/trial (`fit`, `zoom-out`, `zoom-to-layer`), so **7 trials**
   is the minimum that satisfies all five classes at once. Run.
2. **instrument-off (`--control`) × Polygons class × baseline** — the §6/§8 control cell. Amendment 8
   records that a control cell can never produce a gated client-clock quantity (no gated percentile
   depends on its own n), so it does not need matched statistical power with cell 1 — it needs enough
   ABBA alternation with cell 1 to guard against session drift being mistaken for an instrument
   effect. **2 trials**, ABBA-interleaved against 2 of cell 1's own 7 trials (below).
3. **instrument-on × 5 GB × baseline** — "reported at its own scale only... G2's zero-refusal
   assertion and the reported-never-gated quantities... are the only things this fixture feeds" (§3).
   G1/G2 are per-step assertions (n=1 sufficient per step, every trial checked), so this cell's trial
   count is bounded by wall-clock budget, not a statistical floor. **1 trial attempted, 1 re-run
   (the one `§4b`/`§8` license for a settle-watchdog invalidation), both invalid — see §4 below.**

**ABBA order actually run** (`abbaInterleave`, `e2e/residencyTrace.mjs`, quoted mechanically from its
own committed logic): cell 0 = instrument-on-Polygons, cell 1 = instrument-off-Polygons (control).
`abbaInterleave(2, 2)` returns `[{0,0},{1,0},{1,1},{0,1}]` — i.e. **ON, OFF, OFF, ON** (canonical
ABBA) for the first 4 Polygons trials. The remaining 5 instrument-on Polygons trials needed to reach
n=7 have no comparison cell to interleave against in this piece (no candidate arm exists), so they
were run via `abbaInterleave(1, 5)`, which is sequential by the function's own `cellCount === 1`
branch. The 5 GB cell (no comparison cell either) likewise used `abbaInterleave(1, N)`'s sequential
branch. **Realized order:** `ON(cold), OFF, OFF, ON, ON, ON, ON, ON, ON` (9 Polygons trials: 7 ON + 2
OFF) → `ON(5GB, cold, invalidated)` → `ON(5GB, warm, the one licensed re-run, invalidated)`.

---

### 2. Cell table

| cell | fixture | arm | instrument | cold/warm | n (valid) | evidence files |
|---|---|---|---|---|---|---|
| 1 | Polygons (100k feat / ~10.5M vertices), `target/fixtures/slice-budgets/polygons-100k.parquet` | baseline | **on** | 1 cold, 6 warm (see note) | **7 / 7** | `residency-harness-instrument-on-{1788134392278,1788135010670,1788135209452,1788135451186,1788135665624,1788135886294,1788136100411}.json` |
| 2 | Polygons, same file | baseline | **off** (`--control`) | warm | **2 / 2** | `residency-harness-control-{1788134621015,1788134807915}.json` |
| 3 | 5 GB, `target/slice-evidence/scale-pass/parcels-5gb.parquet` | baseline | on | cold, then warm (re-run) | **0 / 2** (both invalid) | attempt 1: no JSON (watchdog `process.exit(2)` bypasses the write path) — raw log `e2e/out/p2-t10-on-5gb.log`; attempt 2: `residency-harness-instrument-on-1788136738769.json` |

**Cold/warm, applied honestly (§8's rule).** The harness's `--cold`/`--warm` flag is **declarative
metadata only** — read `e2e/residency-harness.mjs`'s `parseCellArgs`: it sets a string, it does not
flush any cache. No cache-clear mechanism exists in this harness or was available this session (same
disclosed gap `kernel/RESULTS.md`'s own "Cold open" note names for its 5 GB probe). Applied rule: the
**first trial to touch a given fixture in this campaign** is declared `--cold`; every later trial
against the same fixture in the same session is declared `--warm`, since the OS file cache is
kernel-level and survives the harness's own per-trial fresh app-process relaunch. **Caveat, disclosed
not absorbed:** the Polygons fixture had already been read by several `P2-prep2` dry-run trials
earlier the same session (most recently ~6 minutes before this campaign's own trial 1), so trial 1's
own `--cold` label almost certainly did not correspond to a genuinely cold OS cache — it is "first
touch by this campaign," not "first touch by this machine." Same caveat for the 5 GB fixture's first
attempt (a `P2-prep2` smoke run touched it ~3 minutes prior). Stated plainly rather than claimed as a
guarantee this harness cannot make.

---

### 3. Per-cell trial outcomes

| # | cell | mode | cold/warm | EXIT | valid? | notes |
|---|---|---|---|---|---|---|
| t01 | 1 (ON Polygons) | instrument-on | cold | 0 | **valid** | first attempt hit my own external 300s watch (masked, discarded, not counted); this retry completed clean, ~3m18s wall |
| t02 | 2 (OFF Polygons) | control | warm | 0 | **valid** | |
| t03 | 2 (OFF Polygons) | control | warm | 0 | **valid** | |
| t04 | 1 (ON Polygons) | instrument-on | warm | 0 | **valid** | |
| t05 | 1 (ON Polygons) | instrument-on | warm | 0 | **valid** | |
| t06 | 1 (ON Polygons) | instrument-on | warm | 0 | **valid** | |
| t07 | 1 (ON Polygons) | instrument-on | warm | 0 | **valid** | |
| t08 | 1 (ON Polygons) | instrument-on | warm | 0 | **valid** | |
| t09 | 1 (ON Polygons) | instrument-on | warm | 0 | **valid** | 7th and final ON-Polygons trial, n=7 reached |
| t10 | 3 (ON 5GB) | instrument-on | cold | **2** | **invalid** | settle-watchdog: `open-drain` 64,695ms, `fit` 90,240ms, `pan-north` 65,102ms — every one of these individually exceeded Amendment 9's 60,000ms large-fixture per-step ceiling; trial invalidated at step 1 (`pan-north`), all rows retroactively marked `unmeasured` per the harness's own S8 rule. No evidence JSON written — the harness's overall watchdog calls `process.exit(2)` directly, bypassing the normal write-on-exit path. Raw log: `e2e/out/p2-t10-on-5gb.log` |
| t11 | 3 (ON 5GB) | instrument-on | warm | **1** | **invalid** | the one re-run §4b/§8 license for t10's watchdog invalidation. Different failure: a real `.canvas-refusal` (ceiling-exceeded) banner physically intercepted Playwright's click on `.zoom-to-layer`, exhausting a 30s retry budget and throwing. `rows: []` in the evidence file — the uncaught exception unwound before any step row was preserved, even though the trace log shows progress through `fit` and all 5 pans before failing at `zoom-to-layer`. `openDrain` alone is present and *also* over budget: 64,842ms (again past the 60,000ms ceiling). No further re-run attempted (§8: "a phase is never re-run after its result is seen"; two independent, structural causes had by then emerged, not session noise) |

Both t10 and t11 independently show `open-drain` (the dataset's own first paint) taking **~65s** at 5
GB scale on two separate attempts (64,695ms cold, 64,842ms warm) — **reproducible (2/2), and both
over** the locked Amendment-9 60,000ms large-fixture ceiling, which was itself calibrated from
Polygons-scale dry-run observations (47–51s), not 5 GB ones. **Flagged for whoever designs the next
calibration pass (P3+): the 60s figure does not cover the 5 GB fixture even at the single cheapest
step (open-drain); the full 11-step trace at this scale could not be driven to completion by this
harness in either attempt.** This is disclosed as a real, structural finding, not fixed here (no
harness changes were made during this campaign, per this piece's own instruction).

---

### 4. Headline baseline figures — Polygons class, instrument-on, n=7 trials

**Method.** `percentileNearestRank` (`e2e/residencyTrace.mjs`), computed offline in a scratch script
(`e2e/out/p2-analyze.mjs`, deleted after use) against the 7 valid instrument-on evidence files.
Client wall clock throughout (`viewport_query` issue → first accepted-batch paint, per §6's own
"client wall clock" instrument for G3; the harness's own `onAfterRender`-hook proxy — see each
evidence file's `inputToPresentProxyDivergence` for the disclosed gap between this and a true
browser-compositor-present event).

**G3 — first-pixels per step-class, vs. the docs/08 row "First pixels < 100 ms after query start"
(baseline's own relationship to it, not a gate verdict — no candidate arm exists yet):**

| step-class | n (measured) | p50 | p95 | max | vs. 100 ms |
|---|---|---|---|---|---|
| `fit` | 7 | 436.5 ms | 471.5 ms | 471.5 ms | **4.4×–4.7× over** |
| `zoom-to-layer` | 7 | 519.5 ms | 654.5 ms | 654.5 ms | **5.2×–6.5× over** |
| `zoom-in` | 21 | 538.0 ms | 759.9 ms | 781.9 ms | **5.4×–7.8× over** |
| `zoom-out` | 7 | 487.5 ms | 663.9 ms | 663.9 ms | **4.9×–6.6× over** |
| `pan` | 16 (+19 no-batch, excluded — see below) | 691.6 ms | 1201.1 ms | 1201.1 ms | **6.9×–12.0× over** |

**Open-drain (G7's cold-first-view subject), n=7:** p50 434.7 ms, p95 493.5 ms, max 493.5 ms —
**4.3×–4.9× over** the same 100 ms row. (G7 itself is a candidate-vs-baseline margin; this is the
baseline's own half of that comparison, recorded for P3 to use once a candidate arm exists — no
margin is scored here.)

**Baseline, plainly: every step-class on the Polygons fixture sits well over an order of magnitude's
neighborhood of the 100 ms row** — this is not a near-miss, and it is consistent with `kernel/
RESULTS.md`'s own missed first-pixels row (334.0/317.8 ms) at the same dataset class, though **that
figure is a producer-clock number from a different build/tree and is never compared numerically
here** (§1) — cited only as the same qualitative shape (missed, not close), never as a number this
pass's own figures are checked against.

**`pan` class caveat, disclosed not absorbed:** 19 of 35 total pan-instances (5 pans × 7 trials)
returned `no-batch` (no new features for that direction from the resident set already in view —
`pan-east`/`pan-south`/`pan-northeast` were `no-batch` in every one of the 7 trials, consistently, not
flaky) and carry no first-pixel timestamp; they are excluded from the pan-class percentile above
(there is nothing to time) but are **not** excluded from the refill-work accounting below, where zero
refill is itself the honest figure.

**Determinism check (§8's "deterministic-or-unmeasured" rule), disclosed as a real tension, not
resolved here:** per-step resident feature counts were compared across all 7 ON trials. `fit` and
`zoom-to-layer` are **exactly deterministic** (19,055 features, every trial). `pan-north` (19,079 vs.
19,076), `zoom-in-2`/`zoom-out-1` (9,947 vs. 9,960), and `zoom-in-3` (2,620 vs. 2,500) each show **two
distinct values** across the 7 trials — small (0.02%–4.8%) but real, non-identical. Per §8's letter
("a cell whose per-step resident counts are not deterministic is recorded `unmeasured —
non-deterministic`... never averaged"), these four steps do not cleanly clear that bar. The
percentiles above are still reported (they are genuinely measured data, and the harness's own
top-of-file disclosure already states real synthetic gestures are *not* claimed bit-identical across
runs — only the separate `--wire-identity` mode's literal camera script is), but they are **flagged,
not silently presented as rule-clean** — a tension between §8's strict determinism rule and the
harness's own already-disclosed real-gesture design, for whoever tightens either one next.

**G4 — frame time.** The evidence files do not retain raw per-frame samples, only each step's own
pre-aggregated p50/p95/max/sampleCount (`frameTimeMs`). Reported here as the **worst single step's
own p50/p95 per trial** (a conservative proxy for a trace-wide figure, disclosed as such, not a true
pooled percentile over every frame):

| | mean-of-worst-step p50 | mean-of-worst-step p95 | trial range (p95) |
|---|---|---|---|
| across 7 trials | 704.6 ms | 1281.7 ms | 1034.9 ms – 1630.0 ms |

Against the docs/08 row "≤ vsync interval, zero dropped frames" (~16.7 ms @ 60 Hz): **baseline is
tens-to-hundreds of times over vsync during active streaming steps.** No claim of dropped-frame
counting is made here (not instrumented by this harness); only the p50/p95 figures above.

**G6 — budget adherence, every step, every trial (assertion, not a percentile).** **No violations**
across 7 trials × 12 steps (open-drain + 11) = 84 step-observations, `MAX_RESIDENT_VERTICES` =
2,000,000. **Closest approach: 1,995,220 vertices (99.76% of budget)**, trial 4 (t06), step
`pan-north`. Budget-calibration observation (§6, reported never gated, any change queued to the
human): baseline already sits within a quarter of a percent of the ceiling at the Polygons class's
own scale (100k features / ~10.5M vertices) — no change to the constant is proposed here, only
reported, per the preregistration's own instrument note.

**Refill work per step-class, reported beside first-pixels, never netted (§4a, §6):**

| step-class | mean features/step | mean bytes/step |
|---|---|---|
| `fit` | 19,055 | 33,134,336 |
| `zoom-to-layer` | 19,055 | 33,134,336 |
| `zoom-in` | 10,538 | 18,320,425 |
| `zoom-out` | 9,949 | 17,307,705 |
| `pan` (incl. the 19 genuine zero-refill no-batch instances) | 7,863 | 13,670,544 |

**5 GB cell (reported-only, never scored against any docs/08 row, §1/§3): unmeasured.** Both attempts
invalid (§3 above); no first-pixels, frame-time, refill, or G1/G2 assertion figures exist for this
cell this session. This is itself a disclosed result, not a gap papered over: at baseline (today's
pre-residency whole-viewport-refill), the 5 GB fixture's own natural cost — both a `~65s` open-drain
regardless of cold/warm, and a real ceiling-exceeded `.canvas-refusal` banner appearing somewhere in
the pan block before `zoom-to-layer` — could not be driven through a full camera trace by this
harness in either of the two licensed attempts.

---

### 5. Control cell (instrument-off, n=2)

No gated client-clock quantity is available from a control cell (Amendment 8). Both trials:
`instrumentEnabledReadback: false` (asserted, not merely read), `invalidated: false`, all 11 rows
measured. Existence of these two trials is the control cell's own claim — they do not feed any figure
above.

---

### 6. Evidence-file inventory (the cells of record; gitignored under `e2e/out/`, this section is
their durable record)

| file | cell | mode | cold/warm | key figures |
|---|---|---|---|---|
| `residency-harness-instrument-on-1788134392278.json` | 1 | on | cold | open-drain firstPixel 434.7ms; fit 411.2ms |
| `residency-harness-control-1788134621015.json` | 2 | off | warm | instrumentEnabledReadback=false, 11/11 rows measured |
| `residency-harness-control-1788134807915.json` | 2 | off | warm | instrumentEnabledReadback=false, 11/11 rows measured |
| `residency-harness-instrument-on-1788135010670.json` | 1 | on | warm | open-drain firstPixel 476.4ms; fit 416.5ms |
| `residency-harness-instrument-on-1788135209452.json` | 1 | on | warm | open-drain firstPixel 412.6ms; fit 424.5ms |
| `residency-harness-instrument-on-1788135451186.json` | 1 | on | warm | open-drain firstPixel 425.7ms; fit 464.7ms; closest-to-ceiling trial (pan-north 1,995,220 vertices) |
| `residency-harness-instrument-on-1788135665624.json` | 1 | on | warm | open-drain firstPixel 410.1ms; fit 470.9ms |
| `residency-harness-instrument-on-1788135886294.json` | 1 | on | warm | open-drain firstPixel 478.6ms; fit 436.5ms |
| `residency-harness-instrument-on-1788136100411.json` | 1 | on | warm | open-drain firstPixel 493.5ms; fit 471.5ms |
| (none — watchdog bypassed write) | 3 | on | cold | **invalid**; raw log `e2e/out/p2-t10-on-5gb.log`: open-drain 64,695ms unmeasured, fit 90,240ms unmeasured, pan-north 65,102ms unmeasured, invalidated at step 1, EXIT=2 |
| `residency-harness-instrument-on-1788136738769.json` | 3 | on | warm | **invalid**; `harnessError` set, `rows: []`, open-drain alone present (unmeasured, 64,842ms), EXIT=1 |

Raw per-trial console logs (redirected stdout/stderr, `> log 2>&1`), also gitignored under `e2e/out/`:
`p2-t01-on-polygons.log` … `p2-t09-on-polygons.log`, `p2-t10-on-5gb.log`, `p2-t11-on-5gb-rerun.log`.

---

### 7. Notes for P3 (candidate arm) / whoever calibrates next

- **The harness's own overall watchdog (`TRIAL_WATCHDOG_MS` + 120,000ms = 300,000ms,
  `residency-harness.mjs`) is not scaled by Amendment 9's fixture-aware per-step timeout.** A large
  fixture (Polygons *or* 5 GB) whose 11 real steps each legitimately need close to the 60s per-step
  ceiling can exceed the outer 300s watchdog even with zero actual hang — observed directly on the 5
  GB fixture (§3). This did not block the Polygons cell (every real trial there finished in
  ~3–4 minutes total), but it fully blocked the 5 GB cell. Not fixed here (no harness edits made
  during this campaign, per this piece's own instruction) — flagged for whoever next touches
  `residency-harness.mjs`.
- **An uncaught mid-trace exception (e.g. a blocked click on a real ceiling-exceeded banner) discards
  every already-measured row for that trial**, not just the failing step's own row (`runTrace`'s local
  `rows` array is never returned when the function throws instead of resolving). t11's `fit` and 5
  pans likely succeeded (the trace log shows progress to `zoom-to-layer`) but left no row-level
  evidence. A future harness revision might flush partial rows before re-throwing.
- **A real `.canvas-refusal` banner physically blocks this harness's own synthetic-gesture driver** at
  the 5 GB scale on baseline — the exact "error-shaped refusal on the hero path" the whole cut's
  restated target names. Once a candidate (tile-keyed residency) arm exists, the same 5 GB trace
  should be re-attempted; the cut's own success condition is that this specific failure mode
  disappears there.
- **§8's "deterministic-or-unmeasured" rule is in tension with the harness's own disclosed
  real-gesture camera control** (§4 above) — worth an amendment or a documented exception before P6
  (candidate-arm scoring) leans on it.
- Session total: **9 valid trials, 2 invalid trials, 11 harness invocations**, ~100 minutes wall,
  one machine, one session, ABBA-ordered per §1 above.
