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

---

## Dual-arm campaign, 2026-08-31/09-01 (P8, Amendment 22's screening reading)

**§1 (binding, restated).** Client-clock only, `e2e/residency-harness.mjs` driving the real dev-mode
WebView2 app over CDP (measure-build cell excepted, its own build class declared throughout),
`buildCommit` **`0da5ef59092264ab18d98457470588532b0f03d7`** (branch `cut/viewport-residency`,
verified unchanged for every trial in this section), `traceVersion` **`"3"`** (Amendment 20's step
order: fit → 5 pans → zoom-to-layer → 3 zoom-ins → 1 zoom-out, the pan-northeast diagonal at
0.5·√2·width), Polygons fixture (`target/fixtures/slice-budgets/polygons-100k.parquet`) throughout —
the 5 GB cells are **DEFERRED per Amendment 22**, not run, honestly unmeasured. Machine: Windows 10
Pro 22H2 build 19045, headed, foreground, human present, RustDesk verified stopped process-level
(`--attest "headed, foreground, human present, RustDesk stopped (amendment 22 session)"` on every
trial). **Verified before burning trials**: the first evidence file's `traceVersion` field reads
`"3"`; `gridFrame {originX, originY, baseSpan, level}` is present and, checked across every one of
the 7 valid fine-cell trials, **identical** (`{originX:2593666.478597825, originY:1187966.5220883386,
baseSpan:25346.943496502936, level:"fine"}` in all 7) — no grid-frame drift, so the fine cell is
measured per Amendment 21's own condition. This session's own scored gates are **G3, G4, G6, G7**
plus segments/refill/grid-frame-drift, per this piece's task scope — **G1, G2, G5 are out of this
session's scope** (G1/G2 are 5 GB-fixture assertions, deferred; G5 is scored producer-side from the
kernel's own ADR-018 instrumentation, a separate measurement this client-side campaign does not run).

### 1. ABBA order, applied to a 3-arm screening the committed function was not built for — disclosed

`abbaInterleave` (`e2e/residencyTrace.mjs`) pairs a single "cell 0" against each other cell in turn
(its own `for (candidate = 1; candidate < cellCount; candidate++)` loop) — built for the 2-arm
baseline-vs-control shape P2 used it for, not a 3-way peer sweep. Applied literally,
`abbaInterleave(3, 3)` (cell 0 = coarse, 1 = medium, 2 = fine) replays coarse's own 3 trials TWICE
(once interleaved against medium, once against fine) and would over-count it 6:3:3. **Resolution,
applied mechanically and disclosed rather than silently reinterpreted:** the raw literal output of
`abbaInterleave(3, 3)` — `(0,0),(1,0),(1,1),(0,1),(0,2),(1,2),(0,0),(2,0),(2,1),(0,1),(0,2),(2,2)` —
is deduplicated by first occurrence, preserving order, which yields exactly 9 unique (level, trial)
pairs, 3 per level: **coarse-0, medium-0, medium-1, coarse-1, coarse-2, medium-2, fine-0, fine-1,
fine-2.** This is the order actually run below. A dedicated 3-arm screening interleave function does
not exist in this codebase; this derivation is the committed function's own output, mechanically
reduced, not a hand-picked order.

### 2. Screening — n=3 per level, reported-never-scored (Amendment 22 step 1)

Each screening "trial" slot follows this repository's standing invalidator rule (§8: record, then one
licensed re-run; never a third attempt): a fired per-step settle watchdog invalidates the whole
trial (§4b), the trial gets exactly one re-run, and if the re-run also invalidates, the slot is
recorded invalid with no further attempt.

| level | slot 0 | slot 1 | slot 2 | valid/3 |
|---|---|---|---|---|
| coarse | INVALID×2 (pan-north watchdog, 62,570ms then 73,205ms > the 60,000ms Polygons-class bound) | INVALID×2 (pan-north watchdog, 61,866ms then re-run also invalid at pan-north) | **valid** (all 11 rows measured) | **1/3** |
| medium | **valid** | **valid** | INVALID×2 (zoom-out-1 watchdog, both attempts) | **2/3** |
| fine | **valid** | **valid** | INVALID once (zoom-in-1 watchdog) then **valid** on the licensed re-run | **3/3** |

**Selection, by Amendment 22's pre-declared criterion ("most valid trials; ties by lower fit-step
first-pixels p50; an all-invalid level is eliminated"):** fine wins outright, 3/3 valid vs. medium's
2/3 and coarse's 1/3 — **no tie exists, no tie-break arithmetic needed, no level is all-invalid so no
elimination-finding applies.** Coarse's own screening result is itself a finding, reported here and
never scored: coarse invalidated on the SAME step (`pan-north`) in every one of its 4 attempts
(2 slots × 1 re-run each), a reproducible structural failure — the fewer, larger coarse tiles' own
per-request fan-out at that specific pan exceeds the fixture-scaled 60 s per-step bound consistently,
not flakily. This is exactly the shape §4a's named risk (finding-4's inversion) predicted: at coarse,
individual tile requests are cheap, but the pan crosses enough of the misaligned grid that the
fan-out itself becomes the slow path.

### 3. Top-up — fine's 4 further trials (Amendment 22 step 3)

Fine's own 3 screening trials count toward its n=7 (Amendment 22, "same configuration, same session,
same build"). 4 further trials were needed; 2 of the 4 slots invalidated once before re-running
valid:

| topup slot | attempt 1 | attempt 2 (licensed re-run) |
|---|---|---|
| 1 | INVALID (pan-northeast watchdog, 119,926ms) | INVALID (zoom-in-3 watchdog) — **slot exhausted, no 3rd attempt (§8)** |
| 2 | INVALID (pan-northeast watchdog, 71,462ms) | **valid** |
| 3 | **valid** (first attempt) | — |
| 4 | INVALID (zoom-out-1 watchdog, 66,239ms) | **valid** |
| 5 | **valid** (first attempt) | — |

Topup slot 1 is the only fully-lost slot in this campaign (both its attempts invalid, for two
DIFFERENT steps — a genuine second, independent cause, not session noise, so no further re-run per
§8). 4 valid topup trials were still reached (slots 2, 3, 4, 5) inside the time budget, giving fine
**n=7 valid total** (3 screening + 4 topup), matching G3/G7's own n≥7 discipline.

**pan-northeast at fine is bimodal** (119,926ms / 71,462ms watchdog fires in 2 of 5 topup attempts,
vs. clean sub-10s completions in the other 3 and in all 3 screening trials) — consistent with
`CUT-STATE.md`'s own P5h-era finding ("pan-northeast BIMODAL no-batch vs 172s") persisting into trace
v3 at the fine tile size specifically; reported here as a real, reproducible property of the fine
cell, not netted against its otherwise-passing gates below.

### 4. Fresh baseline — n=7 + 2 controls (Amendment 22 step 4, superseding P2 per Amendment 19)

All 9 trials (7 instrument-on ON, 2 instrument-off OFF/control) **valid on first attempt, zero
re-runs** — ABBA order `abbaInterleave(2,2)` then sequential: ON, OFF, OFF, ON, ON, ON, ON, ON, ON.
Both control trials assert `instrumentEnabledReadback` off-ness unconditionally at start (Amendment
8's own limitation stands: a control cell supplies no gated client-clock value, only the wire/mount
identity guard).

### 5. Calibration cell — Amendment 16 (measure build), reported-only

`npm run build:measure` was **stale** (built 2026-08-31 10:15, before trace v3 / P6c / P6d / the P7
sweep selector all landed later that day) — **rebuilt** before use (`cargo` release recompile of the
single changed crate, ~2m02s, `EXIT=0`). One trial, **candidate arm, fine tile size** (the winning
cell — chosen so the calibration bears directly on this campaign's own headline comparison, not on
baseline's already-P3r-smoke-tested shape; disclosed choice, not defaulted), `--measure-build
"C:\dev\spatial-ide\frontends\shell\src-tauri\target\release\spatial-ide-shell.exe"`. **Valid, all 11
rows measured**, `buildClass` = `"measure (release-optimized + instrument + debug-gated CDP via cargo
feature measure-build; NOT a product release build)"`, `fixtureHashMatchedAcrossRun: true`.

---

### 6. G7 — cold first-view margin (open-drain), gated

| arm | n | p50 | p95 | max |
|---|---|---|---|---|
| candidate, fine | 7 | 233.0ms | 294.0ms | 294.0ms |
| baseline (fresh) | 7 | 497.9ms | 596.4ms | 596.4ms |

**Margin = candidate p95 / baseline p95 = 294.0 / 596.4 = 49.3%.** Preregistration ceiling: ≤110%.
**G7: PASS — comfortably**, not a near-miss: candidate's cold first view is roughly **2× FASTER**
than the fresh baseline's, not merely non-regressed. Segments explain the mechanism (§9 below):
candidate's open-drain `queryToFirstByteMs` (mean 154.3ms) is under half baseline's (mean 413.4ms) —
fine tiling's first tile arrives faster than baseline's whole-viewport-refill first batch.

### 7. G3 — first-pixels per step-class, gated (winning cell + fresh baseline, n≥7, nearest-rank)

| step-class | candidate (fine) n / p50 / p95 / max | baseline n / p50 / p95 / max | vs. 100ms row (candidate) |
|---|---|---|---|---|
| open-drain (G7's own subject, restated) | 7 / 233.0 / 294.0 / 294.0 | 7 / 497.9 / 596.4 / 596.4 | 2.3x–2.9x over |
| fit | 2/7 (5 no-batch) / 3373.9 / 3373.9 / 3373.9 | 0/7 (7/7 no-batch) | n/a — baseline's fit is no-batch every trial (post-open-drain residency already covers the fit view under whole-viewport refill, Amendment 5) |
| pan | 23/35 (12 no-batch) / 656.8 / 3443.3 / 3658.1 | 23/35 (12 no-batch) / 1216.5 / 2217.9 / 2290.9 | median 6.6x over, **tail 34x–37x over** |
| zoom-to-layer | 5/7 (2 no-batch) / 977.1 / 1073.4 / 1073.4 | 0/7 (7/7 no-batch) | n/a — same no-batch shape as `fit` |
| zoom-in | 15/21 (6 no-batch) / 995.6 / 1962.9 / 1962.9 | 21/21 / 915.8 / 1040.4 / 1105.9 | 10x–20x over |
| zoom-out | 7/7 / 926.6 / 1358.6 / 1358.6 | 7/7 / 969.7 / 1130.2 / 1130.2 | 9.3x–13.6x over |

**Reading, plainly, per-class not netted:** candidate wins decisively at `open-drain` (G7's own gated
subject) and at `pan`'s median; candidate's `pan` TAIL (p95/max) is markedly worse than baseline's —
the fan-out cost showing up exactly where §4a predicted it would, at the far tail rather than the
median. `zoom-in` favors baseline (tighter, lower). `zoom-out` is close, baseline's p50 slightly
better, candidate's p95 slightly better. `fit`/`zoom-to-layer` are not comparable between arms at all
(baseline is no-batch there in all 7 trials by construction — nothing to time); this is disclosed,
not treated as a candidate win by default. **No class here is netted against another** (§1's own
prohibition, restated): the pan-median win does not buy back the pan-tail loss, and vice versa.

### 8. G4 — frame time, worst-step p50/p95 proxy per trial (same method as the P2 section), gated

| | mean-of-worst-step p50 | mean-of-worst-step p95 | trial range (p95) |
|---|---|---|---|
| candidate, fine (n=7) | 1626.9ms | 2305.4ms | 1500.5ms – 3378.3ms |
| baseline (fresh, n=7) | 708.3ms | 1274.4ms | 1160.6ms – 1403.8ms |

**G4: FAIL — candidate regresses against the fresh baseline** on this proxy, ~2.3x worse mean-worst
p50, ~1.8x worse mean-worst p95, and a far wider trial-to-trial spread (baseline's own range is
tight, 1160–1404ms; candidate's swings 1500–3378ms). Both arms sit far over the docs/08 vsync-interval
row regardless (~16.7ms @ 60Hz) — this gate's own text is "no regression **vs. baseline**", scored
exactly that way: candidate is measurably, consistently worse than the same-session baseline on this
proxy, not just far from an already-unreachable vsync floor.

### 9. Segments (query→first-byte / first-byte→decoded / decoded→painted), reported beside, never netted

| step-class | candidate mean byte / decode / paint (ms) | baseline mean byte / decode / paint (ms) |
|---|---|---|
| open-drain | 154.3 / 28.0 / 56.2 | 413.4 / 26.8 / 62.0 |
| pan | 445.6 / 10.9 / 921.1 | 1030.7 / 4.9 / 24.5 |
| zoom-in | 67.4 / 23.3 / 1170.4 | 878.3 / 5.0 / 19.2 |
| zoom-out | 136.8 / 15.6 / 1326.1 | 961.5 / 15.6 / 1326.1 (n=3, see note) |

**The load-bearing decomposition finding, disclosed plainly, not absorbed into G4's headline
number:** candidate's own `byte` segment is consistently SMALLER than baseline's (smaller per-tile
payloads reach first byte faster — this is the tiling win, and it is what drives G7's pass). But
candidate's `paint` segment is dramatically LARGER than baseline's at every non-open-drain
class — pan 921ms vs. 25ms, zoom-in 1170ms vs. 19ms, zoom-out 1326ms vs. baseline's own (small-n)
figure. **This is where G4's regression actually lives**: not in fetching data, in painting it —
consistent with `CUT-STATE.md`'s own prior note about per-batch render cost (P5g/P5h's "coalesced
renders" fix addressed open-drain specifically; this session's own fresh measurement shows the paint
cost still elevated for candidate outside open-drain, at pan/zoom). Reported here as the mechanism,
never netted against the byte-segment win above or against G7's pass — a fast fetch and a slow paint
are two different facts, not one that cancels the other.

### 10. Refill work per step-class, reported beside first-pixels, never netted

| step-class | candidate mean features / bytes | baseline mean features / bytes |
|---|---|---|
| open-drain | 10,000 / 17,399,024 | 19,055 / 33,134,336 |
| fit | 1,864.7 / 3,291,990 | 0 / 0 (no-batch every trial) |
| pan | 6,056.9 / 10,646,868 | 11,576 / 20,106,818 |
| zoom-to-layer | 9,189.1 / 16,237,376 | 0 / 0 (no-batch every trial) |
| zoom-in | 1,983.6 / 3,486,948 | 17,693.1 / 30,769,701 |
| zoom-out | 3,714.7 / 6,537,957 | 19,027 / 33,131,648 |

Candidate refills markedly less data per step across the board (roughly half at open-drain/pan, an
order of magnitude less at zoom-in/zoom-out) — registered prediction 2 (§5 of the preregistration,
reuse net-reduces refill) reads consistent with this shape, though this session's trace measures
per-step-class refill, not the specific step-1-vs-step-11 fit comparison prediction 2 names; a direct
test of that exact prediction is not run here and is not claimed. **Not netted against G4's paint-cost
finding above**: less data moved does not mean less time spent painting it.

### 11. G6 — budget adherence, structural per Amendment 21

Per Amendment 21, G6's pass is **structural** (admission trims before insert; the ceiling is
unexceedable by construction), not a sampled measurement — stated as such, not re-derived here.
Observed resident-vertex high-water marks, reported beside as context, not as the gate's mechanism:

| arm | max observed vertices | % of 2,000,000 budget |
|---|---|---|
| candidate, fine | 1,997,834 | 99.89% |
| baseline (fresh) | 1,994,977 | 99.75% |

No excess observed either arm, consistent with the structural argument. Budget-calibration
observation (reported never gated, per §6): both arms sit within a quarter of a percent of the
2,000,000 ceiling at this fixture's own scale — no change to the constant is proposed here.

### 12. Determinism (Amendment 14's 2% band, Amendment 18's over-budget carve-out)

**Baseline:** clean — only `pan-northeast` (1.32% spread) and `zoom-in-3` (2.75% spread, marginally
outside the 2% band) show any per-step resident-count variation across the 7 trials; every other step
is exactly deterministic.

**Candidate (fine):** resident-FEATURE-count spreads of 19%–113% appear at nearly every step past
`fit`. **Per Amendment 18 (pre-decided, not re-litigated here):** the fine cell runs consistently
over-budget/declared-partial (the `.canvas-status-stack` "Showing N features — the farthest areas...
not drawn" text appeared repeatedly across trials), and the candidate's up-to-3-concurrent tile
streams make the SURVIVING feature set interleaving-dependent at an over-budget boundary — exactly
the property Amendment 18 named in advance. **Every one of these flagged steps is marked
`non-deterministic — over-budget interleaving` for its RESIDENT-COUNT quantity specifically; G3/G4/G7
above (first-pixels, segments, frame times) are single-batch/clock quantities Amendment 18 states are
unaffected, and are not invalidated by this.** `zoom-out-1`'s 113% spread (one trial's low outlier,
8,900 vs. six trials clustered 17,761–18,979) is the widest and is disclosed rather than smoothed
over; it does not by itself invalidate any gated quantity above, per Amendment 18's own letter.

### 13. Calibration cell — dev-vs-measure delta, reported-only, never gated, never quotable as product numbers

| build class | open-drain firstPixel |
|---|---|
| measure (this cell, n=1) | 120.7ms |
| dev (fine cell, n=7, p50) | 233.0ms |

**Headline delta: the measure build's open-drain first-pixel is ~52% of the dev build's own p50** —
roughly half the client-observed cost at this step is dev-build/instrumentation overhead, not
product-inherent cost, AT THIS ONE SAMPLE. Chosen on the candidate/fine arm (this campaign's own
winning cell), disclosed as a choice: baseline's dev-vs-measure delta is not measured this session
(P3r's own earlier smoke measured baseline/measure but against the small filter-zoned fixture, a
different fixture class, not comparable here). n=1, reported-only per Amendment 16 — this single
point is not a percentile and is never used to adjust any G3/G4/G7 figure above; it bounds how much
of this campaign's own dev-build numbers might shrink under a true release build, nothing more.

---

### 14. Invalid trials — full list with reasons (every rerun disclosed, §8)

| trial | cell | step | reason | reran? |
|---|---|---|---|---|
| coarse screening slot 0, attempt 1 | candidate/coarse | pan-north | settle watchdog: in-flight never reached 0 (62,570ms) | yes → also invalid |
| coarse screening slot 0, attempt 2 | candidate/coarse | pan-north | settle watchdog: console quiescence not reached (73,205ms) | no (§8, slot exhausted) |
| coarse screening slot 1, attempt 1 | candidate/coarse | pan-north | settle watchdog: in-flight never reached 0 (61,866ms) | yes → also invalid |
| coarse screening slot 1, attempt 2 | candidate/coarse | pan-north | settle watchdog: in-flight never reached 0 | no (§8, slot exhausted) |
| medium screening slot 2, attempt 1 | candidate/medium | zoom-out-1 | settle watchdog: console quiescence not reached (63,196ms wall) | yes → also invalid |
| medium screening slot 2, attempt 2 | candidate/medium | zoom-out-1 | settle watchdog: console quiescence not reached | no (§8, slot exhausted) |
| fine screening slot 2, attempt 1 | candidate/fine | zoom-in-1 | settle watchdog: console quiescence not reached | yes → **valid** |
| fine topup slot 1, attempt 1 | candidate/fine | pan-northeast | settle watchdog: in-flight never reached 0 (119,926ms) | yes → also invalid (different step) |
| fine topup slot 1, attempt 2 | candidate/fine | zoom-in-3 | settle watchdog: console quiescence not reached | no (§8, slot exhausted — 2 independent causes) |
| fine topup slot 2, attempt 1 | candidate/fine | pan-northeast | settle watchdog: in-flight never reached 0 (71,462ms) | yes → **valid** |
| fine topup slot 4, attempt 1 | candidate/fine | zoom-out-1 | settle watchdog: console quiescence not reached (66,239ms) | yes → **valid** |

**Total: 11 invalid attempts across the whole session** (8 screening-phase, 3 topup-phase); 2 slots
(coarse-0, coarse-1) and 1 slot (fine topup-1) were fully lost after their licensed re-run also
invalidated. Zero invalid trials in the fresh baseline or control cells (9/9 valid, first attempt).
Zero invalid trials in the calibration cell (1/1 valid, first attempt).

### 15. Evidence-file inventory (gitignored under `e2e/out/`; this section is their durable record)

Fine candidate cell (n=7, scored): `residency-harness-instrument-on-{1788210266746,1788210454782,
1788211105198,1788212651341,1788212900614,1788213504811,1788213676438}.json`. Fresh baseline (n=7):
`residency-harness-instrument-on-{1788213915102,1788214526695,1788214779024,1788215003297,
1788215226837,1788215475677,1788215725383}.json`. Control (n=2): `residency-harness-control-
{1788214109416,1788214305909}.json`. Calibration (n=1, measure build): `residency-harness-
instrument-on-measure-1788215912125.json`. Screening/topup invalid + coarse/medium valid trials:
`residency-harness-instrument-on-{1788208274350,1788208398870,1788208650326,1788208877221,
1788208971572,1788209075286,1788209395294,1788209695057,1788209981610,1788210727003,1788211352069,
1788211653052,1788211826352,1788212241249}.json`. Raw per-trial console logs (redirected, gitignored):
`p8-t01-candidate-coarse.log` … `p8-t15-candidate-fine-topup.log`, `p8-b01…b09`, `p8-cal01`,
`p8-build-measure.log`. Scratch analysis scripts `e2e/out/p8-analyze.mjs`, `e2e/out/p8-score.mjs`
(gitignored, retained for this session, not deleted, unlike P2's own deleted scratch script — kept
here since this section's own numbers are directly reproducible from them against the evidence files
above).

### 16. Session mechanics

Rebuilt the stale measure-build exe first (§5). 23 harness invocations total (12 screening/topup
attempts across coarse/medium/fine including re-runs, 9 fresh-baseline/control, 1 calibration; +1
build). Wall time, trial execution only (first trial launch to last trial's evidence write): **~133
minutes**. One machine, one session, ABBA-ordered per §1/§8 throughout, RustDesk verified stopped
before the first trial.

---

### 17. The campaign's own answer

**Does tile-keyed residency (fine tile size, the screening-selected level) beat the baseline, where,
and by how much?** Mixed, gate-by-gate, nothing netted: it wins G7 decisively (cold first view ~2x
faster, 49.3% of baseline's p95 against a 110% ceiling) and wins G3's `pan`-median and `open-drain`
classes, driven by a genuinely smaller byte-transfer segment per tile; it loses G4 (frame time,
~1.8–2.3x worse than the fresh baseline on the same worst-step proxy) and G3's `pan`-tail and
`zoom-in` classes, both traced to a dramatically larger PAINT segment, not a fetch problem. G6 holds
structurally on both arms. The coarse level failed its own screening on a single reproducible
step (`pan-north` fan-out cost), independently confirming §4a's named risk at the OTHER end of the
sweep from where this session's gates were spent. **This is not a clean win for the candidate**: the
declared-partial-view contract (24(a)) is real and the cold-open number is a genuine, large
improvement, but the paint-cost regression is real too, and per §1/§11 neither is allowed to buy back
the other. ADR-011 gate 8 is not marked met here (C4) — this is the written evidence, the ruling
stays the human's.

---

## Amendment-23 re-measure — the paint fix under full protocol, 2026-09-01 (P10)

**§1 (binding, restated).** Client-clock only, `e2e/residency-harness.mjs` driving the real dev-mode
WebView2 app over CDP (the calibration cell excepted, its own build class declared throughout),
branch `cut/viewport-residency` @ **`c796ba7da65fa16b51e82f38ac3517bab37b8069`** (the P9 paint fix —
`buildLayers.ts`'s per-tile geometry cache, keyed by `(ResidentBatch` object identity, frame
origin`)`, `git rev-parse HEAD` verified before the first trial and never switched during this
session), `traceVersion` **`"3"`** (unchanged from the P8 campaign — trace v3's step order and the
0.5·√2·width diagonal), `buildClass` **`vite-dev`** throughout except the calibration cell (measure
build, declared per-row). Fixture: `target/fixtures/slice-budgets/polygons-100k.parquet`, hashed
before the trial loop and re-hashed after the last trial — **identical**
(`9ecd79242ac7d99e09f1989c8c124fd53dcd697689546ec6013949f806ca6043`, both times; every one of the 17
evidence files below also carries its own `cell.fixtureHashMatchedAcrossRun: true`). The 5 GB cells
remain **DEFERRED** (Amendment 22, untouched by Amendment 23) — G1/G2/G5 stay **out of this session's
scope**, same as the P8 campaign (G1/G2 are 5 GB-fixture assertions; G5 is scored producer-side, a
separate measurement this client-side campaign does not run). Machine: Windows 10 Pro 22H2 build
19045, headed, foreground, human present, RustDesk verified absent, 46 stale processes swept before
this session began (per the launching brief); every trial's own `--attest` string:
`"headed, foreground, human present, RustDesk absent (amendment 23 re-measure)"`.

**Scope, per Amendment 23's own protocol.** Candidate arm at **FINE only** (the P8 sweep's own
screening-selected level stands; Amendment 23 does not re-screen), n=7; a **fresh** baseline arm
(same session, same build, per Amendment 19's own standing rule), n=7, plus 2 instrument-off
controls; **one** Amendment-16 calibration cell on a freshly **rebuilt** measure build (`npm run
build:measure`, ~2m02s, `EXIT=0` — confirmed to carry the P9 fix: the measure build's own source
tree is the same working tree `git rev-parse HEAD` reads at `c796ba7`). All three gates G3/G4/G7
re-scored in full below, against this session's own fresh baseline — never against the prior
section's baseline, which predates the fix and stays that section's own pre-fix record (§1 of this
document, restated: **no cross-session netting**).

### 1. Pre-checks, before burning any scored trial

1. **Build identity.** `git rev-parse HEAD` at session start: `c796ba7da65fa16b51e82f38ac3517bab37b8069`
   — matches the launching brief's pinned commit exactly. Branch `cut/viewport-residency`, unchanged
   throughout.
2. **`npm run build:measure` rebuilt first** (the P9 fix must be IN the measure build before the
   calibration cell runs, not the P8-era stale artifact): frontend build 7.40s, Rust release
   recompile 1m59s, `Finished release [optimized]`, `EXIT=0`.
3. **Dual-arm identity guard, at its declared config (the default fixture, `filter-zoned.parquet`,
   no `--fixture` override) — both arms:**

   | arm | evidence file | `identical` | criterion | `fieldSequenceProxyVacuousForThisArm` | tile traffic confirmed |
   |---|---|---|---|---|---|
   | baseline | `residency-harness-wire-identity-1788290603853.json` | **true** | exact-sequence (18 lines/run, all 4 runs) | `false` | n/a (baseline has no tile counters) |
   | candidate | `residency-harness-wire-identity-1788290734894.json` | **true** | multiset (Amendment 17; 2,415 lines/run, all 4 runs) | **`false`** | `tilesRequested=2344, duplicatesDropped=4992, evictionsApplied=0` (both ON runs, summed) |

   Both arms **PASS**. Candidate's own line count is 2,415 > 0 per run (not the vacuous-pass shape
   this pre-check exists to catch), and `fieldSequenceProxyVacuousForThisArm` reads `false` on both
   — the guard did not fire its own vacuous-pass warning. Cleared to proceed.
4. **First scored evidence file** (`residency-harness-instrument-on-1788290926973.json`, baseline
   trial 1, cold): `cell.traceVersion: "3"` ✓, `cell.buildCommit` matches `c796ba7...` ✓, `gridFrame:
   null` (expected — baseline never establishes a tile grid; the candidate's own first evidence file,
   `...1788291093560.json`, carries `gridFrame:
   {"originX":2593666.478597825,"originY":1187966.5220883386,"baseSpan":25346.943496502936,"level":"fine"}`,
   **identical across all 7 candidate trials** — no grid-frame drift, Amendment 21's own condition
   satisfied). `invalidated: false`, 11/11 rows measured.

All four pre-checks pass; proceeded to the scored trial loop.

### 2. Trial order (mechanically derived, disclosed) and outcomes

Same technique the P8 campaign used to adapt `abbaInterleave` (built for exactly 2 cells) to this
session's **3** cells (candidate-fine, baseline, control): `abbaInterleave(3, 7)` computed literally
with cell 0 = baseline, cell 1 = candidate, cell 2 = control, then deduplicated by first occurrence,
preserving order — yielding baseline/candidate fully ABBA-interleaved for all 14 scored trials
(`B,C,C,B,B,C,C,B,B,C,C,B,B,C`, the canonical repeating block), followed by control's own slots
truncated to the 2 Amendment 23 actually calls for (Amendment 8: a control cell needs no matched
statistical power, only session-drift-guarding alternation — reported as a disclosed truncation of
the mechanically-derived order, not a hand-picked one).

**Every one of the 17 trials run this session was valid on first attempt. Zero invalidations, zero
re-runs.**

| # | cell | mode | cold/warm | evidence file | valid? |
|---|---|---|---|---|---|
| 1 | baseline | on | **cold** | `...1788290926973.json` | valid |
| 2 | candidate/fine | on | warm | `...1788291093560.json` | valid |
| 3 | candidate/fine | on | warm | `...1788291202624.json` | valid |
| 4 | baseline | on | warm | `...1788291295827.json` | valid |
| 5 | baseline | on | warm | `...1788291376648.json` | valid |
| 6 | candidate/fine | on | warm | `...1788291490405.json` | valid |
| 7 | candidate/fine | on | warm | `...1788291615109.json` | valid |
| 8 | baseline | on | warm | `...1788291696585.json` | valid |
| 9 | baseline | on | warm | `...1788291777278.json` | valid |
| 10 | candidate/fine | on | warm | `...1788291881195.json` | valid |
| 11 | candidate/fine | on | warm | `...1788292007179.json` | valid |
| 12 | baseline | on | warm | `...1788292090561.json` | valid |
| 13 | baseline | on | warm | `...1788292182892.json` | valid |
| 14 | candidate/fine | on | warm | `...1788292257500.json` | valid |
| 15 | baseline | control (off) | warm | `residency-harness-control-1788292383485.json` | valid |
| 16 | baseline | control (off) | warm | `residency-harness-control-1788292460955.json` | valid |
| 17 | candidate/fine | on, **measure build** | warm | `residency-harness-instrument-on-measure-1788292522137.json` | valid |

Both control trials assert `cell.instrumentEnabledReadback: false` unconditionally (Amendment 8's own
limitation stands: a control cell supplies no gated client-clock value, only the wire/mount identity
guard). **n=7 candidate, n=7 baseline, n=2 control, n=1 calibration — every cell reached its full
declared n with no licensed re-run needed.**

### 3. G7 — cold first-view margin (open-drain), gated

| arm | n | p50 | p95 | max |
|---|---|---|---|---|
| candidate, fine | 7 | 249.2ms | 257.8ms | 257.8ms |
| baseline (fresh) | 7 | 469.2ms | 558.8ms | 558.8ms |

**Margin = candidate p95 / baseline p95 = 257.8 / 558.8 = 46.1%.** Preregistration ceiling: ≤110%.
**G7: PASS — comfortably**, candidate's cold first view remains roughly **2.2× faster** than the
fresh baseline's. Essentially unchanged from the P8 campaign's own 49.3% (§14 below has the full
comparison) — expected, since G7's own mechanism (open-drain is a single untiled bootstrap query,
never touched by the P9 fix at all: `open-drain`'s own `tiles=0` in every candidate row) was never
the fix's target.

### 4. G3 — first-pixels per step-class, gated (fine cell + fresh baseline, n≥7, nearest-rank)

| step-class | candidate (fine) n(measured)/no-batch / p50 / p95 / max | baseline n(measured)/no-batch / p50 / p95 / max | reading |
|---|---|---|---|---|
| open-drain | 7/0 / 249.2 / 257.8 / 257.8 | 7/0 / 469.2 / 558.8 / 558.8 | candidate wins decisively (G7's own subject, restated) |
| fit | 2/5 / 2543.0 / 2543.0 / 2543.0 | 0/7 (no-batch every trial) | not comparable — baseline's `fit` is no-batch every trial (post-open-drain residency already covers the fit view, Amendment 5) |
| pan | 28/7 / 663.1 / 2913.1 / 2974.0 | 23/12 / 709.8 / 1839.9 / 1846.3 | candidate wins the **median** (663.1 vs 709.8); baseline wins the **tail** (1839.9 vs 2913.1) — see §5's mechanism note |
| zoom-to-layer | 7/0 / 92.3 / 145.6 / 145.6 | 0/7 (no-batch every trial) | not comparable — same no-batch shape as `fit`; candidate now measures this class on **every** trial (was 5/7 in P8) |
| zoom-in | 19/2 / 72.1 / 836.5 / 836.5 | 21/0 / 818.6 / 1016.8 / 1035.4 | **candidate now wins decisively at both p50 and p95** — reversed from P8, where baseline won this class (995.6/1962.9 candidate vs 915.8/1040.4 baseline) |
| zoom-out | 5/2 / 135.5 / 789.4 / 789.4 | 7/0 / 879.9 / 1298.6 / 1298.6 | candidate now wins decisively — close in P8, a clear win now |

**Reading, per-class, nothing netted (§1's own prohibition, restated):** the fix flips `zoom-in` and
`zoom-out` decisively into the candidate's favor, and holds `open-drain`. `pan`'s median favors
candidate, its tail still favors baseline — narrower story than before (§7 below identifies the two
distinct mechanisms behind the remaining tail cost). `fit`/`zoom-to-layer` remain structurally
uncomparable to baseline (no-batch there by construction).

### 5. G4 — frame time, worst-step p50/p95 proxy per trial (same method as prior sections), gated — THE HEADLINE

| | mean-of-worst-step p50 | mean-of-worst-step p95 | trial range (p95) |
|---|---|---|---|
| candidate, fine (n=7) | 169.4ms | 1203.0ms | 1079.2ms – 1325.4ms |
| baseline (fresh, n=7) | 151.5ms | 325.6ms | 196.4ms – 831.2ms |

**G4: still FAIL — but the shape of the failure changed completely.** At the **median** the
regression is now nearly closed: candidate's mean-worst-step p50 is only **11.8% above** baseline's
(169.4ms vs 151.5ms — down from **130% over** pre-fix, §14). At the **tail**, the picture inverts:
candidate's mean-worst-step p95 is **3.70× baseline's** (1203.0ms vs 325.6ms) — **wider**, not
narrower, than the pre-fix session's own 1.81× (§14). Scored on the gate's own strict letter ("no
regression vs. baseline," no declared tolerance band the way G7 has one) this is an unambiguous FAIL
on both p50 and p95, though the p50 figure is now close enough that a future tolerance-banded reading
of G4 (not this preregistration's own wording) would read very differently from the p95 figure.

**Mechanism, identified by direct per-step attribution (not guessed):** for **all 7** candidate
trials, the step contributing the worst-step p95 is the **same one every time — `zoom-to-layer`**
(p95 1079–1325ms across the 7 trials; contrast baseline, whose worst step varies trial to trial —
`pan-east`, `zoom-in-1`, `open-drain`, `zoom-out-1`, `zoom-in-3` ×2, `zoom-in-2` — with p95 never
exceeding 831ms). `zoom-to-layer`'s own **first-batch** paint cost is already fast under the fix
(mean 92ms, §6 below) — its problem is not the first batch, it is the **tail across the step's own
long window**: `zoom-to-layer` runs ~20–23s wall per trial (`wallMs` 19,757–22,863 across the 7
trials) while requesting **83 distinct tiles**, and the vast majority of those tiles are being
admitted for the **first time this trace** (a genuinely new `ResidentBatch` object per tile,
correctly a cache miss by the fix's own stated invalidation rule — "Invalidated correctly by a
genuinely new batch object"). Sampled directly on one representative trial
(`...1788291881195.json`): `zoom-to-layer` frameTimeMs p50 117.2ms / **p95 1325.4ms** / max 1705.5ms
over 79 samples — a step whose *typical* frame is fast but whose tail, sustained by ~20 seconds of
genuinely-new-tile admissions, is not. **A second, distinct outlier — never the worst-step winner,
but visible in `max`** — sits at `pan-west`: 5 of 7 candidate trials show a large, reproducible spike
(`duplicatesDropped` 10,140–11,098, `firstPixelMs` 2,587–2,974ms, `decodedToPaintedMs` 2,083–2,430ms;
the other 2 trials show ordinary `pan-west` behaviour, `dup` ~978–1,037, paint ~56–90ms) — a large
batch of already-resident tiles being **re-delivered as fresh objects** (dedupe correctly drops them
as duplicate *features*, but each arrives as a new `ResidentBatch`, so the geometry cache correctly,
if expensively, misses for all of them). Neither mechanism is a defect in the P9 fix as scoped — both
are genuinely-new-object admissions the fix's own doc comment says must miss — but both are real,
reproducible, unresolved costs this session's evidence pins to specific, named steps rather than
leaving as a diffuse "candidate paints slower" finding.

### 6. Segments (query→first-byte / first-byte→decoded / decoded→painted), reported beside, never netted

| step-class | candidate mean byte / decode / paint (ms), n | baseline mean byte / decode / paint (ms), n |
|---|---|---|
| open-drain | 149.0 / 26.0 / 55.7, n=7 | 396.3 / 26.8 / 59.8, n=7 |
| fit | 487.4 / 7.8 / 2042.5, n=2 | n/a (no-batch every trial), n=0 |
| pan | 575.3 / 6.9 / 451.9, n=26 | 847.6 / 4.7 / 27.9, n=23 |
| zoom-to-layer | 0 / 6.6 / 92.0, n=7 | n/a (no-batch every trial), n=0 |
| zoom-in | 92.4 / 6.3 / 175.7, n=14 | 804.6 / 4.4 / 26.0, n=21 |
| zoom-out | 267.2 / 6.1 / 89.2, n=5 | 900.9 / 4.4 / 30.1, n=7 |

**The paint segment collapsed exactly where the fix targets it.** Compare against the P8 (pre-fix)
section's own §9 table: candidate `pan` paint 921.1ms → **451.9ms** (still elevated vs baseline's
27.9ms, but roughly **halved**); `zoom-in` paint 1170.4ms → **175.7ms** (**~6.7× smaller** — this is
what flipped G3's `zoom-in` class, §4); `zoom-out` paint 1326.1ms → **89.2ms** (**~14.9× smaller**).
`fit`'s own paint (2042.5ms, n=2 — the two trials where a real batch arrived on `fit` rather than
no-batch) is the one class that stayed large: `fit` is the step immediately after `open-drain`, so
every tile it touches is, by construction, being admitted for the first time this trace — the
cache's own necessary cold-start cost, not a fix failure. Candidate's `byte` segment stays smaller
than baseline's at every class except `fit` (unaffected by this fix, transport/decode are untouched
code) — the tiling win the P8 campaign already identified is intact, unchanged in kind.

### 7. Refill work per step-class, reported beside first-pixels, never netted

| step-class | candidate mean features / bytes | baseline mean features / bytes |
|---|---|---|
| open-drain | 10,000 / 17,399,024 | 19,055 / 33,134,336 |
| fit | 5,368.3 / 9,446,420.6 | 0 / 0 (no-batch every trial) |
| pan | 7,083.5 / 12,470,089.4 | 11,385.4 / 19,784,876.1 |
| zoom-to-layer | 12,611.4 / 22,278,278.9 | 0 / 0 (no-batch every trial) |
| zoom-in | 8,534.9 / 15,014,580.6 | 17,712.3 / 30,803,242.7 |
| zoom-out | 4,661.7 / 8,195,732.6 | 19,027 / 33,131,648 |

Same shape as the P8 campaign (candidate moves markedly less data per step throughout) — the P9 fix
touches only client-side layer construction, never the fetch/plan/dedupe path, so this table is
expected to be unchanged in kind and is reported for completeness, not as new evidence.

### 8. G6 — budget adherence, structural per Amendment 21

| arm | max observed vertices | % of 2,000,000 budget | where |
|---|---|---|---|
| candidate, fine | 1,999,978 | **99.9989%** | trial `...1788291881195.json`, step `zoom-out-1` |
| baseline (fresh) | 1,994,977 | 99.7489% | trial `...1788290926973.json`, step `open-drain` |

Per Amendment 21, G6's pass is **structural** (admission trims before insert; the ceiling is
unexceedable by construction), not a sampled measurement — stated as such, not re-derived here. No
excess observed either arm. Candidate's high-water mark sits closer to the ceiling than any prior
session recorded (99.9989% vs P8's own 99.89%) — reported as a budget-calibration observation
(never gated, per §6 of the preregistration): the 2,000,000 figure is not proposed for change here,
only flagged as consistently near-saturated at this fixture's own scale.

### 9. Determinism (Amendment 14's 2% band, Amendment 18's over-budget carve-out)

**Baseline:** clean — every step exactly deterministic (0.00% spread) except `pan-northeast`
(0.15%), well inside the 2% band.

**Candidate (fine):** resident-FEATURE-count spreads far outside the 2% band at nearly every step
past `open-drain` (`fit` 77.5%, `pan-north` 90.2%, `pan-east`/`pan-south` 176.7%, `pan-west` 6.75%,
`pan-northeast` 41.4%, `zoom-to-layer` 28.6%, `zoom-in-1` 21.7%, `zoom-in-2` 2.41%, `zoom-in-3` 4.3%,
`zoom-out-1` 2.74%) — wider than the P8 campaign's own 19–113% range. **Per Amendment 18
(pre-decided, unaffected by the P9 fix, which touches only paint, not planning/dedupe/eviction): the
fine cell runs consistently over-budget/declared-partial, and the candidate's up-to-3-concurrent tile
streams make the SURVIVING feature set interleaving-dependent at that boundary — exactly the property
Amendment 18 named in advance.** Every one of these flagged steps is marked
`non-deterministic — over-budget interleaving` for its RESIDENT-COUNT quantity specifically; G3/G4/G7
above (first-pixels, segments, frame times) are single-batch/clock quantities Amendment 18 states are
unaffected, and are not invalidated by this. `pan-east` and `pan-south` show **identical** value
arrays (`[16902,17518,15619,13380,18567,6711,16525]` both) — not a measurement error:
`pan-south` is `no-batch` in all 7 candidate trials (no new admission), so its own
`residentAtEndStep` simply carries forward `pan-east`'s unchanged count, disclosed rather than left
looking like a coincidence.

### 10. Calibration cell — dev-vs-measure delta, reported-only, never gated, never quotable as product numbers

| build class | open-drain firstPixel |
|---|---|
| measure (this cell, n=1, rebuilt with the P9 fix) | 101.3ms |
| dev (fine cell, n=7, p50) | 249.2ms |

**Delta: the measure build's open-drain first-pixel is ~40.7% of the dev build's own p50** — roughly
three-fifths of the client-observed cost at this step is dev-build/instrumentation overhead, similar
in shape to the P8 campaign's own ~51.8% figure (§14 below), n=1 both times, reported-only, never
used to adjust any G3/G4/G7 figure above.

### 11. Controls (instrument-off, n=2)

No gated client-clock quantity is available from a control cell (Amendment 8). Both trials:
`cell.instrumentEnabledReadback: false` (asserted, not merely read), `invalidated: false`, all 11
rows measured. Existence of these two trials is the control cell's own claim — they do not feed any
figure above.

### 12. Invalid trials

**None.** Every one of the 17 trials this session ran (14 scored + 2 controls + 1 calibration) was
valid on first attempt. Zero watchdog fires, zero banner-intercept retries, zero re-runs. This is a
genuine session property, not an artifact of a looser bound: every watchdog from the P8 campaign
(fixture-scaled per-step timeouts, the scaled outer trial watchdog, the 3-attempt banner
dismiss-retry) stayed in force, unmodified, throughout.

### 13. Evidence-file inventory (gitignored under `e2e/out/`; this section is their durable record)

Candidate/fine (n=7, scored): `residency-harness-instrument-on-{1788291093560,1788291202624,
1788291490405,1788291615109,1788291881195,1788292007179,1788292257500}.json`. Fresh baseline (n=7):
`residency-harness-instrument-on-{1788290926973,1788291295827,1788291376648,1788291696585,
1788291777278,1788292090561,1788292182892}.json`. Control (n=2):
`residency-harness-control-{1788292383485,1788292460955}.json`. Calibration (n=1, measure build):
`residency-harness-instrument-on-measure-1788292522137.json`. Identity-guard pre-check (both arms):
`residency-harness-wire-identity-{1788290603853,1788290734894}.json`. Raw per-trial console logs
(redirected, gitignored): `a23-t01-baseline-cold.log` … `a23-t17-calibration.log`,
`a23-identity-baseline.log`, `a23-identity-candidate.log`, `a23-build-measure.log`. Scratch analysis
script `e2e/out/a23-analyze.mjs` (gitignored, retained rather than deleted, same convention the P8
section's own scratch scripts follow) — this section's own figures are directly reproducible from it
against the evidence files above.

### 14. Pre-fix (P8) vs post-fix (this session) — directional-across-sessions context only

**Labeled explicitly: same protocol, different code.** Both sessions run the identical preregistered
protocol (same fixture, same trace v3, same tile size, same fresh-baseline discipline) but at two
different commits — P8 at the pre-fix candidate (`0da5ef5`-era), this session at `c796ba7` (the P9
fix). **The scored gate verdicts above are within-session only** (§1); this table is context for
reading the *direction* the fix moved things, never a third session's worth of statistical power and
never itself a gate verdict.

| quantity | pre-fix (P8) | post-fix (this session) | direction |
|---|---|---|---|
| G7 margin (candidate p95 / baseline p95) | 49.3% | 46.1% | flat (both comfortably under the 110% ceiling; open-drain was never the fix's target) |
| G4 mean-worst-step **p50**, candidate | 1,626.9ms | 169.4ms | **−89.6%** |
| G4 mean-worst-step **p50**, baseline | 708.3ms | 151.5ms | **−78.6%** |
| G4 mean-worst-step **p95**, candidate | 2,305.4ms | 1,203.0ms | **−47.8%** |
| G4 mean-worst-step **p95**, baseline | 1,274.4ms | 325.6ms | **−74.5%** |
| G4 verdict | FAIL | FAIL | unchanged at the gate level; p50 ratio candidate/baseline closed from 2.30× to 1.12×; p95 ratio widened from 1.81× to 3.70× (§5) |
| G3 `zoom-in`, winner | baseline (995.6/1962.9 vs 915.8/1040.4) | **candidate** (72.1/836.5 vs 818.6/1016.8) | **flipped** |
| G3 `zoom-out`, winner | roughly even (926.6/1358.6 vs 969.7/1130.2) | **candidate**, decisively (135.5/789.4 vs 879.9/1298.6) | **strengthened for candidate** |
| G3 `pan`, median winner | candidate (656.8 vs 1216.5) | candidate (663.1 vs 709.8) | narrower win, same direction |
| G3 `pan`, tail winner | baseline (p95/max 2217.9/2290.9 vs candidate's 3443.3/3658.1) | baseline, still (p95/max 1839.9/1846.3 vs candidate's 2913.1/2974.0) | unchanged direction |
| segments: `pan` paint, candidate | 921.1ms | 451.9ms | **−51.0%** |
| segments: `zoom-in` paint, candidate | 1,170.4ms | 175.7ms | **−85.0%** |
| segments: `zoom-out` paint, candidate | 1,326.1ms | 89.2ms | **−93.3%** |
| calibration delta (measure / dev p50) | 51.8% (n=1 vs n=7) | 40.7% (n=1 vs n=7) | similar magnitude, both n=1 |
| G6 high-water mark, candidate | 99.89% of budget | 99.9989% of budget | closer to saturated (both structural passes) |

**Reading this table plainly, nothing netted against the scored verdicts above:** the fix delivered a
large, real, broad-based paint-cost reduction — visible in the segments table directly and in G3's
`zoom-in`/`zoom-out` classes flipping outright — and it closed the **median** frame-time gap between
the two arms to near-parity. It did **not** flip G4's own gate verdict, because G4 is scored on
p50 **and** p95 with no declared tolerance, and the **tail** got relatively worse even as it got
absolutely faster in both arms — the `zoom-to-layer` long-tail mechanism (§5) is a genuinely
different cost than the one P8's segments table diagnosed, and this session is what surfaced it.

### 15. Session mechanics

Pre-hash + rebuild `build:measure` + dual-arm identity guard pre-check + 17 harness invocations (14
scored trials, 2 controls, 1 calibration) + post-hash + process cleanup. **Zero invalid trials, zero
re-runs.** One machine, one session, ABBA-ordered per §1/§8 throughout, RustDesk verified absent
before the first trial. Wall time, pre-checks through the last trial's evidence write: **~39
minutes** (21:19–21:58, machine clock) — well inside the 140-minute declared session bound, leaving
ample margin that was spent on this write-up rather than banked as unused trials (the preregistration
does not call for more than the declared n at this scope).

### 16. This session's own answer

**Did the P9 paint fix flip the campaign's verdict?** Partially, and precisely where the fix's own
diagnosed mechanism predicts it would. **G7 stands PASS, unchanged in kind** (candidate's cold first
view is ~2.2× faster than baseline's fresh p95, comfortably inside the 110% ceiling — open-drain was
never touched by this fix). **G3 improved materially**: `zoom-in` and `zoom-out` flip from
baseline-favored (or even) to decisively candidate-favored, driven by the same paint-segment collapse
the fix's own commit message predicted (`zoom-in` paint −85%, `zoom-out` paint −93%). **G4 remains a
FAIL** — but not the same failure: the **median** frame-time gap between candidate and baseline
closed from roughly 2.3× to 1.12× (near-parity), while the **tail** gap widened from 1.81× to 3.70×,
now traced to one specific, reproducible mechanism present in all 7 candidate trials
(`zoom-to-layer`'s own long tail across ~20s of genuinely-new-tile admission) plus a second,
independent one visible in 5 of 7 trials (`pan-west`'s large-batch re-admission spike). Both are
real, both are `ResidentBatch`-identity cache misses the fix's own doc comment says are correct to
miss — meaning closing them, if pursued, is separate future work, not a defect in this fix as scoped.
**Confirming the report's own question directly: baseline's own frame time improved substantially
too** (mean-worst-step p95 fell 74.5%, p50 fell 78.6%) — `buildLayers.ts` is shared code, and P9's
cache benefits any repeated call over a growing resident set, which baseline's own multi-batch
open-drain/pan/zoom streaming does just as candidate's tiling does, only with fewer, larger batches.
ADR-011 gate 8 is not marked met here (C4) — this is the written evidence under the iterated fix, the
ruling stays the human's, per Amendment 23 point 3.

---

## The 5 GB G1/G2 cells — 2026-09-02 (P12, the deferred cells)

**§1 (binding, restated).** Client-clock only, `e2e/residency-harness.mjs` driving the real
dev-mode WebView2 app over CDP, branch `cut/viewport-residency` @
**`32defc0fd3da7add69d07b94ff2daf842be18968`**, `git rev-parse HEAD` verified before the trial,
unchanged throughout. Fixture: `target/slice-evidence/scale-pass/parcels-5gb.parquet`
(5,004,376,705 bytes), hashed before and after —
`sha256:5ae955c5fb7ee4d3f10436df271e19361d84f0845fbaa69dc60516f1b60c1788` both times, identical
(`cell.fixtureHashMatchedAcrossRun: true`). Candidate arm, **fine** tile size (the campaign's own
screening-selected level), **one trial** (`--cold`) — per the preregistration, G1/G2 are per-step
assertions, n=1 sufficient per step, every trial checked; no statistical n is claimed or needed.
Machine: headed, foreground, human present, RustDesk verified absent immediately before the trial
(`--attest "headed, foreground, human present, RustDesk stopped (part-k / 5gb sitting)"`).
**This is the first-ever attempt at this exact combination** — candidate arm, tile-keyed
residency, against the 5 GB fixture. Both prior 5 GB attempts (P2 baseline session) were
baseline-arm and both were structurally invalid for harness reasons Amendments 12/13 have since
fixed; neither tells us anything about the candidate machinery, which did not exist when they ran.
Evidence file: `e2e/out/residency-harness-instrument-on-1788380132954.json`.

### 2. Per-step summary

| step | wallMs | settled | armDisarmedCleanly | tiles req. | dup dropped | evict | resident features (end) |
|---|---|---|---|---|---|---|---|
| open-drain | 5,063 | true | true | 0 | 0 | 0 | 10,000 |
| fit | 739 | true | true | 3 | 0 | 0 | 10,000 |
| pan-north | 1,872 | true | true | 11 | 0 | 0 | 10,000 |
| pan-east | 53,896 | true | true | 163 | 153 | 32 | 10,057 |
| pan-south | 5,405 | true | true | 84 | 0 | 0 | 10,057 |
| pan-west | 6,837 | true | true | 47 | 5,491 | 0 | 10,067 |
| pan-northeast | 96,389 | true | true | 29 | 1,637 | 72 | 17,896 |
| **zoom-to-layer** | **152,152** | **false** | **false** | 70 | 899 | 513 | 11,425 |
| zoom-in-1 | 1,313 | true | true | 3 | 0 | 0 | 11,425 |
| zoom-in-2 | 6,081 | true | true | 6 | 2 | 5 | 17,292 |
| zoom-in-3 | 13,986 | true | true | 3 | 228 | 18 | 16,599 |
| zoom-out-1 | 140,687 | true | true | 30 | 446 | 578 | 19,089 |

Top-level: `invalidated: false`, `invalidatedAtStep: null`, `anyRowUnmeasured: false`,
`measuredModeViewStateSeamAssertion.ok: true`, `supersededBytesDropped: 0`. By the harness's own
validity criteria this trial is **fully valid** — zoom-to-layer's own non-settle (below) did not
trip the per-trial invalidation path, only its own per-step calm-wait bound (Amendment 12,
150,000ms), which is designed to let the trace continue rather than fail the whole trial.

### 3. G2 — zero error-shaped refusals at 5 GB: **PASS**

Direct per-step assertion, stated plainly, the cut's core claim: `batchesRefused`,
`featuresRefused`, and `bytesRefused` are **all `0` at every single step**, including
`zoom-to-layer` and both multi-minute pans. No ceiling-exceeded-shaped refusal fired anywhere in
the committed camera trace at the 5 GB fixture. Where the trace crossed the declared budget, the
shell showed the declared partial-view status instead of any refusal — confirmed live at
`zoom-to-layer` (§5 below). This is exactly the restated target's own claim (`NEXT-CUT.md`): at
fit-to-extent the viewport IS the dataset, and the cut's job was never to make the whole dataset
render, only to retire the *error-shaped* refusal — which it does, at 5 GB, on this evidence.

**Operator addendum, same sitting, cancel felt at scale:** hand-exploring the same candidate-arm
5 GB session after this cell ran, the operator confirmed the Cancel affordance appeared during
`zoom-to-layer`'s own churn and that a mid-churn gesture (zoom-in) was "immediate and very
smooth" — escape from the stuck-looking state was felt to work, not merely present in the DOM.
Recorded beside G2 because it is the same honesty claim at the interaction level: a long-running,
never-settling operation still leaves the operator in control, never trapped behind a frozen or
uncancellable UI (`MANUAL-WALKTHROUGH.md`'s own Part K "5 GB addendum").

### 4. G1 — correctness (rendered ⊆ authoritative; dedupe exact; no superseded batch): **supported, not established**

What the evidence supports: refusal counters clean throughout (as G2 above); dedupe activity
looks proportionate to the gesture (`pan-west`: 5,501 features decoded, 5,491 correctly dropped as
duplicates — an almost-entirely-already-resident pan, exactly the shape a small westward drag
over already-visited tiles should produce); `supersededBytesDropped: 0` throughout — no stale
in-flight response was ever dropped as superseded, because none arose to test the mechanism
against, not because the mechanism was exercised and passed.

**What it does not establish:** this preregistration's own instrument has no
rendered-⊆-authoritative cross-check — no field or assertion anywhere in the evidence schema
compares the client's resident set against the kernel's own authoritative response set by stable
feature id. G1 is a genuine assertion this instrument was never built to make; its per-step
counters are consistent with correctness, not proof of it. **This is a preregistration instrument
gap, recorded as a future addition — not grounds for a re-run of this trial**, and not attempted
live: no re-runs, no further probing, per the human's own direction closing this cell out.

### 5. `zoom-to-layer` never reached quiescence — a complete finding, not a defect to chase

```
"calmWait": {"calmed": false, "waitedMs": 150058, "inFlight": 2, "queued": 14},
"armDisarmedCleanly": false
```

The step hit its full per-step calm-wait bound (Amendment 12's own 150,000ms 5 GB-class figure)
and the harness moved on regardless — 2 streams still in flight, 14 still queued, the
instrumentation arm unable to disarm cleanly as a direct consequence. `pan-east` (53,896ms) and
`pan-northeast` (96,389ms) were also unusually long but both did settle cleanly (`calmed: true`);
only `zoom-to-layer` failed to reach quiescence at all within its own declared bound.

**This is the same named mechanism ADR-028's gate-8 section already records as binding debt at
Polygons scale** (zoom-to-layer's sustained new-tile admission window, ~20–23s wall there,
83 first-time admissions) — **but it is not the same finding at a bigger number. At 5 GB, the
mechanism's own scale changes its character.** Polygons-scale zoom-to-layer fits to a bounded,
finite extent that a tile-keyed cache can eventually exhaust; 5 GB-scale zoom-to-layer fits to
the dataset's own full extent, which is exactly the case the restated target already names as
structural, not a caching problem: *"at fit-to-extent the viewport IS the dataset — viewport
scoping cannot make 3.3M features appear (that is LOD's job, NOT this cut)"* (`NEXT-CUT.md`).
A tile cache — however well it paces, keys, or evicts — cannot make a fit-to-5-GB-extent
admission window short, because the window's own length is proportional to the dataset itself,
not to any tiling inefficiency. **Pacing can't fix "the viewport is the dataset."** This finding
therefore does not belong on the ADR-011 tiling/pan-west line of binding debt (request-identity
keying, the pan-west design seed, etc. — all mechanisms that make an already-bounded admission
cheaper) — it belongs to the LOD/aggregate-overview slice's own problem statement
(`NEXT-CUT.md`'s own Non-goals: *"LOD/decimation/aggregate overviews (owes its own preregistered
gate)"*), which is the only lever that can shrink what fit-to-extent means at 5 GB in the first
place. **Recorded as complete — no further probing, no re-run**, per the human's own direction;
the diagnostic question raised when this cell first ran (timing artifact vs. eviction-metric bug)
is superseded by this reading: the length of the window is the finding, not a symptom to debug
away.

**Operator follow-up, same sitting — refines the framing above, kept verbatim rather than
rewritten.** Hand-exploring the same candidate-arm 5 GB session after this cell ran, the operator
found, verbatim: *"Zoom to layer reads as a dead button — the camera was already at fit, the
count climbed briefly then plateaued (19,089), and the view never visibly changed again while
work continued. Cancel affordance appeared. Mid-churn zoom-in was immediate and very smooth —
escape confirmed felt. Counter visibly ticking early confirms the two-snapshots reading of the
status discrepancy."* (`MANUAL-WALKTHROUGH.md`'s own Part K "5 GB addendum".) The plateau figure
— 19,089 — is not a new number: it is exactly this cell's own `zoom-out-1`
`residentAtEndStep.totalResidentFeatures` (§2, above). Two independent sessions, the same
practical ceiling for this camera position, landing on the same figure.

**This sharpens, and partly corrects, the "pacing can't fix it" claim two paragraphs up.** The
felt shape is not raw slowness across the whole 150-second window — resident count saturates in
*seconds*, and the view stops visibly changing at that point. What fills the remaining ~140+
seconds is **work-yield mismatch**: under distance-ordered eviction, once nearer content has
already claimed the budget, every further queued tile beyond that eviction frontier is
*provably* never going to be kept resident — the system keeps requesting and processing tiles
that cannot contribute to the final view, and nothing signals "this is as complete as it will
get" once that frontier is reached. The dataset-proportional claim above is still true of the
*theoretical* admission space (fit-to-5-GB-extent implies an unbounded number of tiles a naive
scheme could request) — but it overstated what THIS mechanism's own 150-second window is actually
spending its time on, which the operator's own live evidence shows is mostly futile continuation,
not proportional necessary work. **A design seed follows this section, filed against the
ADR-011 tiling line (not the LOD slice)**, because recognizing and pruning that futility is a
tiling-mechanism question, distinct from the "can the whole dataset ever render" question LOD
alone answers.

#### Design seed — futility pruning + a quiescent-partial signal (2026-09-02, a seed for a future slice, not scheduled)

**The candidate design, from the operator's own reading, recorded not yet built:** once the
render budget is saturated by nearer content under distance-ordered eviction, queued tiles beyond
the resulting eviction frontier are provably non-contributing — they will keep losing the
eviction contest to already-resident nearer tiles for as long as the camera doesn't move. Two
paired mechanisms: **(1) futility pruning** — stop requesting/processing tiles known to be beyond
that frontier once it stabilizes, rather than continuing to stream and immediately discard them;
**(2) a quiescent-partial status signal** — once pruning has run and nothing outstanding could
still change the resident set, the status can honestly declare the partial view *settled*
(distinct from today's open-ended "still working" churn), even though the dataset itself was
never fully rendered.

**Why this is filed separately from the raw non-settle finding above, not as the same claim
restated:** the raw finding (this section, before this addendum) says the *admission space* is
proportional to the dataset and LOD is the only lever that shrinks it. This seed does not
dispute that — a genuinely small camera move at 5 GB scale would still admit a large number of
tiles. It targets a narrower, cheaper claim: **once the budget is already saturated and the
frontier has stabilized, most of the remaining 150-second window is spent on work whose outcome
is already decided.** Pruning that specific futile tail is a tiling-line mechanism (eviction/
admission logic), not an overview/decimation one — **could plausibly retire most of the
150-second churn without LOD**, per the operator's own reading, though this is a hypothesis from
one session's evidence, not a measured claim.

**Explicit precondition before anyone builds this, not yet met:** the "eviction frontier" argument
needs verifying against the *actual* eviction ordering in code — is eviction genuinely
distance-ordered from a stable reference point in a way that makes "beyond the frontier" a
well-defined, computable set at any given moment, or does the real ordering have edge cases
(the pan-west re-admission spike's own design seed already names one source of non-determinism,
Amendment 18) that would make "provably non-contributing" a weaker guarantee than it sounds?
**Not verified here — no further probing this sitting, per the human's own direction.** Needs its
own reviewed slice: the frontier argument checked against code first, a preregistered gate if it
holds, before any implementation. Filed here so it is not rediscovered, same as the pan-west seed
above.

**VERIFIED, 2026-09-02, architect consult — the precondition above is now checked and does NOT
hold. Kept verbatim above rather than rewritten; this is the correction, appended.** Reading
`tileIngest.ts`, `tileResidentSet.ts`, `tileViewportStreamManager.ts`, `candidateArmSession.ts`,
and `WorkingCanvas.tsx` directly, on four independent counts:

1. **Admission is arrival-ordered, not distance-ordered.** `ingestTileBatch` admits a prefix by
   feature index of whatever batch arrives first (`tileIngest.ts:117-157`,
   `trimBatchToVertexBudget:179-198`) — distance never enters admission, so there is no distance
   at which "nearer content holds the budget" becomes a true statement.
2. **Distance ordering governs only non-covering tiles.** `planTileEviction` filters
   `viewportTileKeys` out *before* sorting (`tileResidentSet.ts:460-463`) — it orders eviction
   among tiles the viewport does NOT cover. At fit-to-extent, the exact case this finding is
   about, that set is nearly empty by construction.
3. **During over-budget, the protected set collapses to *complete* covering tiles only** —
   `onCameraChange` skips every candidate when over budget without headroom
   (`tileViewportStreamManager.ts:326-340`), reducing `covering` to `isTileCompleteInCandidateSet`
   (`candidateArmSession.ts:454,726`). **Partial covering tiles are therefore unprotected and
   evictable — a second, undeclared exception to ADR-028's "never evict a tile intersecting the
   viewport"** (its own architect-gate clarification 3 names exactly one: the dedupe-owner
   cascade). **Named open item, per the human's own ruling (2026-09-02):** neither declared nor
   fixed yet; resolution — amendment-with-rationale (declaring it intended, the pressure-valve
   reading) versus a fix (the thrash reading) — is decided from the debt slice's own 1a diagnosis
   phase, due at 1b. Not a blocker to ADR-028's own Accepted status; carried forward as named
   open work, the same way the two Polygons-scale mechanisms are. *(RESOLVED 2026-09-03, appended:
   the human ruled option (i) on 1a's evidence — declared intended, ADR-028 Amendment 1, docs
   only, with an explicit reopen condition: evidence of visible in-viewport holes attributable to
   partial-covering eviction reopens it as a defect. See the amendment for the full record.)*
4. **The camera-change over-budget recheck can never evict, and reduces to a pure partiality
   test.** `applyTileViewportContext` calls `planTileEviction` with `incomingVertices: 0`
   (`WorkingCanvas.tsx:1091`); since residency stays ≤ ceiling by construction (Amendment 21),
   that call always returns no evictions. So `fits` reduces to `!anyPartialAmongCovering`
   (`WorkingCanvas.tsx:1112-1119`) — **partiality (an honesty property) and budget exhaustion (a
   capacity property) are wired to the same flag**, which then gates all new issuance.

**What the 150-second window actually is, corrected:** `drainQueueIfRoom` refuses to drain while
`overBudgetFlag` is set (`tileViewportStreamManager.ts:447-455`), and only a camera change resumes
it. With no camera change during a single step, **queued tiles are held indefinitely — never
dropped, never cancelled, still reported as outstanding work.** §2's own terminal state
(`inFlight: 2, queued: 14` after 150,058ms) is exactly that: a held queue plus two long-running
in-flight per-tile queries, not a stable frontier being crossed by futile traffic. Per-tile
round-trip arithmetic from §2's own counters (`pan-east` 53,896ms/163 tiles ≈ 1s/tile;
`pan-northeast` 96,389ms/29 tiles ≈ 3.3s/tile) against Polygons-scale's own ~92ms first-batch
paint (ADR-028's gate-8 section) points at **the producer/query side, not client-side futile
work** — an attribution the existing segment instrument cannot settle (three of twelve steps in
this cell's own evidence file carry `queryToFirstByteMs: null`).

**Corrected framing:** "futility pruning" named an optimization for a mechanism that is not
running. The real, code-grounded item underneath it is stronger and cheaper: **a queue the
planner has already decided not to drain is held, uncancelled, and reported as pending** — a
`docs/01` principle 7 item ("every operation cancellable, streaming, progress-reporting" — a held
queue is none of the three), not a performance optimization. This reframing also survives LOD,
which an eviction-frontier heuristic would not have. **The design seed above is superseded by
this correction for scheduling purposes** — its own rescoping (queue disposition and a
settled-partial signal as two separate, dependent items, with the queue-disposition question
worth a diagnosis pass before either is preregistered) is cut-planning content, not evidence, and
lives in the architect consult for the next cut, not here.

### 6. The status-text discrepancy — resolved by code-reading, not measurement

`zoom-to-layer`'s own row shows `residentAtEndStep.totalResidentFeatures: 11425`; the console's
own `P4-RESIDENCY-STATUS-TEXT[zoom-to-layer]` probe captured the on-screen status reading
*"Showing 16362 features…"* — a different, higher count. Per the human's own direction, this is
explained by reading the code that drives each value, not by re-running or further probing:

- `residentAtEndStep` is captured **synchronously**, inside the `residencyEndStep` E2E hook
  (`frontends/shell/src/App.tsx:828-832`), which merges `endResidencyStep()`'s own step-end
  snapshot with `canvasRef.current?.getResidentCounts()` read "at the same moment" (the hook's
  own N4/G6 comment) — this fires the instant the step's calm-wait attempt exhausts, whether or
  not it actually calmed.
- The status-text probe (`captureResidencyStatusText`,
  `frontends/shell/e2e/residency-harness.mjs:621-631`) is a **separate, later** Playwright
  round-trip — `page.locator(".residency-status").textContent()` — issued only *after*
  `measureOneStep` has already returned and the row (including `residentAtEndStep`) has been
  pushed (`residency-harness.mjs:1305` precedes the probe at `:1325-1327`). The harness's own
  comment at that call site claims it "reads the status once the step has actually settled, not a
  mid-stream transient" — an assumption that holds when `calmed: true`, and does not hold here,
  where `calmed: false`.

**The two values are therefore sequential reads of a still-churning count, not two measurements
of one instant.** With 2 streams in flight and 14 queued at the moment `residentAtEndStep` was
snapshotted, admission plausibly continued during the async gap before the later DOM read,
raising the on-screen count from 11,425 to 16,362 in between. This is a direct consequence of §5's
own finding (the step never quiesced) — not an independent status-accuracy defect, and not
evidence the status ever *overstated* completeness at a moment it claimed to represent: each read
was accurate to its own instant, and the instants differ. No code change follows from this
reading; it is recorded as the mechanism, not chased further.

### 7. Session mechanics

One process, one trial, `--cold`, ABBA not applicable (single-cell measurement, no baseline
comparison at this scale — 5 GB has no G3/G4/G7 role, per §1 of both dual-arm campaigns above:
"reported at its own scale only, NEVER scored against any docs/08 matrix row"). Mount-readiness
gate passed after 1,868ms. Total wall time across all measured steps ≈ 8.1 minutes (summed
per-step `wallMs`); the full session including launch/mount/hash overhead landed inside the
declared 10–30 minute estimate, well under the 30-minute per-trial outer-watchdog ceiling. Zero
re-runs. App left running on CDP port 9223 per the harness's own end-of-run note (informational,
not itself part of this record).

### 8. This cell's own answer

G2 stands **PASS** at 5 GB — the cut's central honesty claim (declared partial view, never an
error-shaped refusal) holds at the scale that motivated the whole cut. G1 stands
**supported-not-established** — nothing observed contradicts correctness, but this instrument was
never built to prove it, a preregistration gap for a future addition, not a defect in this
evidence. One genuinely new, complete finding: `zoom-to-layer` does not reach quiescence within
150 seconds at 5 GB, a scale-calibrated instance of the same admission-window mechanism named at
Polygons scale — but its own lever is different, and it is filed against the LOD slice's problem
statement by name, not the tiling line's own binding debt. ADR-011 gate 8's own ruling — and
whether this evidence and Part K's own felt verdict together discharge the gate-8 rider — is
recorded in ADR-028's own acceptance section, not re-derived here.
