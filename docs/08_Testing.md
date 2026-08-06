# 08 — Testing and Benchmarks

## Performance budgets (CI-enforced; regressions fail the build)

- ≤ vsync interval, zero dropped frames, across the benchmark matrix below (06) — *(amended 2026-08-03, ADR-003 spike M4: a display's compositor cannot present faster than its own refresh tick regardless of how cheap a frame is to produce. M4's graded scenario measured consistently at 16.7 ms p50 on a 60 Hz display — 0.7 ms over a naive "≤16 ms" reading — which is the vsync floor being hit exactly, not a miss. Expressing the budget as a fixed millisecond figure fails well-behaved code the instant it touches a real compositor; expressing it as the display's own interval does not. "The display's own interval" means the fixed reference hardware profile's own refresh rate (already required below — "tested on fixed reference hardware profiles"), not whatever a runtime happens to negotiate — a renderer that let power-saving mode or variable refresh silently lower the target has not met this budget, only relocated the miss.)*
- First pixels < 100 ms after query start (06)
- Cold open of a 5 GB GeoParquet < 5 s (05)
- Cancellation acknowledged < 100 ms, any operation (01)
- Webview VRAM ceiling respected at matrix scale; memory profiled per commit (ADR-001 mitigation, 06)

Budgets are tested on fixed reference hardware profiles so numbers are comparable across commits.

> **State of that enforcement, 2026-08-06.** The heading says what these budgets are *for*; it is not
> yet a description of a running pipeline, and the distinction is worth one line now that CI exists.
> `.github/workflows/product-ci-*.yml` run the ordinary Rust and viewer suites and **deliberately do
> not run the budget harnesses** (`kernel/tests/slice_budgets.rs`, `kernel/tests/indexed_budgets.rs`,
> both `#[ignore]`d and both refusing a debug build outright). A shared CI runner is not a fixed
> reference hardware profile, and a figure taken on one would not be a worse number — it would not be
> a measurement. The harnesses are committed and re-runnable by an operator, which is what
> `kernel/RESULTS.md`'s figures come from. **"Regressions fail the build" is therefore owed, not
> operating**, and it stays owed until budgets run somewhere comparable across commits.

## Benchmark matrix

Feature count alone is not a workload — 10M points and 10M polygon vertices are different problems. Budgets are defined per dataset class:

| Dataset | Target scale |
|---|---|
| Points | 10M total, defined visible count |
| Lines | 1M features / 10M vertices |
| Polygons | 100k features / 10M vertices |
| Labels | 20k candidates, defined visible labels |
| Raster | Defined dimensions, bands, overview levels |
| Remote source | Defined latency and bandwidth |

**Measured:** input latency p95 · frame time p50/p95 · time to first meaningful pixels · time to stable view · picking latency · selection latency · memory + VRAM · cancellation latency · cross-platform deltas (Windows/macOS/Linux webviews) · arbitrary-CRS coordinate and picking accuracy (ADR-003 spike).

## Regression corpus

- **Public data**: Overture Maps, OSM extracts, Sentinel/NAIP samples — real scale, redistributable.
- **Dirty data zoo**: real-world broken shapefiles, wrong-encoding CSVs, mislabeled-CRS files, truncated columns. This is the data doctor's (05) test suite — every bug report that involves a weird file donates a specimen.
- **Published control coordinates**: official reference points for CRS-transformation validation — for the Swiss fixture, swisstopo's LV95↔ETRS89 points — stored with their publication source and date. Used only as the PROJ oracle (see Correctness).

## Correctness

- Geometry operations validated against PostGIS/GEOS reference results.
- CRS transforms validated against authoritative PROJ values (05).
- **Test-oracle separation.** Each oracle answers only the question it is authoritative for, and
  neither substitutes for the other:
  - **CRS transformation** is validated against **PROJ**, using *officially published control
    coordinates* — for the Swiss fixture, swisstopo's published LV95↔ETRS89 reference points, held as
    the third regression-corpus category above.
  - **Geometry predicates, nearest-point, snapping and post-edit topology** are validated against
    **GEOS**. **GEOS is never used as a CRS oracle.**
  - **PostGIS is not an independent CRS oracle either**, because it embeds PROJ: a PostGIS result
    that depends on `ST_Transform` is the same oracle reached by a longer path.
- **Round-trip tolerance is not declared accuracy.** Forward/inverse round-trip determinism is
  validated against a strict **computational** tolerance. That number is different from, and far
  tighter than, an operation's **declared real-world accuracy**. The two must never be conflated in
  any test, budget row, or claim — a tight round-trip figure is not evidence about picking or
  digitizing accuracy, and a declared accuracy is not a licence for loose arithmetic. Both numbers
  land with their measurements; neither is written here in advance (`no numbers, no claim`).
- Style compilation: same style + data → identical style/layout decisions; raster output compared within declared platform tolerances (06).

## Protocol conformance

- An SKP conformance suite that any client or kernel implementation must pass (02).
- MCP tools tested via replayed AI sessions — recorded agent workflows become regression tests (04).

## Reproducibility

Replay the Workflow IR (13) against pinned inputs → identical outputs within declared tolerance. Each test asserts at the workflow's declared reproducibility grade (ADR-005): an Exact-graded workflow failing replay is a build-breaking bug; a Reference-only workflow is only required to record what it saw. This is principle 3 as a test, not a promise.
