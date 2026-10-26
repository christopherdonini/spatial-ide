*Custodian's filing note (2026-10-25): the tester-high's run of lead-data's O1 probe design (`state/consults/2026-10-25-admitted-integer-overflow-silent-wraparound-probe-design-lead-data-draft.md`), with the custodian's choices OPEN-1 to OPEN-4 (a), in the throwaway checkout C:/dev/wt/o1-probe, detached at fb361420, nothing committed (its porcelain at filing: the one untracked probe file). The cargo target was D:/wt-targets/sefd, not the design's new folder (the custodian's change, for a warm build), and the data is under D:/wt-targets/o1-probe/o1-data, both kept. The custodian's check of its transcript: its writes were the untracked probe file and its own scratch files only; no commit, stage, push, branch, worktree or PR action; three shared holds (the build and the two runs). This report grades nothing; lead-data reads it, and the human grades the node on the reading. The run 17:54:23Z to 18:07:49Z by its transcript (Read 24, Bash 37, Grep 9, Write 5, Edit 1). Extracted by script from its SubagentHandback call, with one final newline added; nothing else is changed. Its sha256, from line 5 to the end, is ed6d6b4f187ebb89dc0a84c83e5d4e0719182d6fbb43a6c271451bd2e58df51a.*

---

Ran: admitted-integer-overflow-silent-wraparound, the O1 probe, at fb361420

No stop rule fired. Both runs finished (`test result: ok. 1 passed`, line `O1 PROBE DONE`). I graded nothing and propose no fix. Figures below come from `run1.log` and `run2.log`, both under `D:/wt-targets/o1-probe/o1-data/`, which are kept (OPEN-4 (a)). Anything labelled "lead-data's" or "prediction" is not mine.

Setup check before starting:
- Design file: sha256 of lines 5 to the end is cb09fc3857d1ffc445aad478478202fafe1deea61ee97453f10fc7b0e2626d35, equal to the stated hash.
- Probe: `engine/tests/o1_probe.rs`, untracked, 1371 lines, sha256 2128f3542d8a50ed8001f886fba655882cf6a5e7c3ce2133fa2f39239716f90a.
- Environment: `CARGO_TARGET_DIR=D:/wt-targets/sefd`, data under `O1_OUT_DIR=D:/wt-targets/o1-probe/o1-data/run<N>/`.

## Item 1. Worktree, toolchain, versions

- HEAD: `fb361420f512d2f631e29d4e2f9fcc5e5d2fd2be`. Porcelain at the start was empty (no output, rc 0). Porcelain at the end: `?? engine/tests/o1_probe.rs`, and nothing else.
- `rustc -vV`:
  - `rustc 1.97.1 (8bab26f4f 2026-07-14)`
  - `binary: rustc`
  - `commit-hash: 8bab26f4f68e0e26f0bb7960be334d5b520ea452`
  - `commit-date: 2026-07-14`
  - `host: x86_64-pc-windows-msvc`
  - `release: 1.97.1`
  - `LLVM version: 22.1.6`
- `SELECT library_version, source_id FROM pragma_version()` gave `Ok(("v1.5.5", "d8cdaa33fd"))`.
- The probe file is the appendix at the end.

## Item 2. Per file

- Base fixtures (`write_geoparquet`, 2,048 rows per row group, writer-default statistics):

| base | rows | bytes | sha256 (run1 = run2) |
|---|---|---|---|
| base-2048 | 2048 | 804485 | 7798a58be1f12b01aaadbde0c0cb3b1d7dbeb850d828a81a0a3ae7533823e21c |
| base-4096 | 4096 | 1599129 | 68af8515e4fd15aab59e135494d1c7874c4cf055e2479ebc8ce553e9eeb5acf9 |
| base-6 | 6 | 6854 | 19861b8fedbcfcdf3cc187be8ce992bf9f70c3d3966747fa750d3886b69cfafc |
| base-3 | 3 | 5760 | ecb2bf90c5f83c9fabe696c066b9e70dfa3483be09b3686ba81275d5b9d6806a |

- Layout and statistics checks passed on all eleven files; none was stopped. Readback was 0 mismatches and `Dataset::open` was `Ok` with `v: Int64` for every file. The DuckDB-written files (`-dk`, `threads = 1`) had the declared layout.
- The `v` statistics are `stats_min_value`/`stats_max_value`/`stats_null_count` from `parquet_metadata`.

| file | writer | rows | row groups (rows each) | v statistics | bytes | sha256, run1 = run2 (both runs identical) |
|---|---|---|---|---|---|---|
| A-ar-s | arrow-rs, stats | 2048 | 1 (2048) | rg0 min -4000001023, max 4000001022, nulls 0 | 815802 | eec0e4f766a752edf18bf6084a8a80bb74e9408d95e38fb016efef0a8318d819 |
| A-ar-n | arrow-rs, none | 2048 | 1 (2048) | absent | 815030 | b81f7bcbebaf5e1b9aee14168e91a6efb87de4997d3a041fab7c6821b2a04e8e |
| A-dk | DuckDB | 2048 | 1 (2048) | as A-ar-s | 800503 | a85467767c84f1633242bf83c1f419d17cb025351e59365f0189bdc1914c2877 |
| B-ar-s | arrow-rs, stats | 2048 | 1 (2048) | rg0 min 0, max 4000002047, nulls 0 | 815792 | 9a5a5f2ab20fec366e393b7e261a368de6d7547729c6515447204ed4511d9872 |
| B-ar-n | arrow-rs, none | 2048 | 1 (2048) | absent | 815020 | a97bde64d71657861c1f38b03e0b252d9e6d0bedbd9837e3c739c77e7672f79f |
| B-dk | DuckDB | 2048 | 1 (2048) | as B-ar-s | 800493 | 0448a737fe494d17d8b1b27aee9ed146a106b7d809893cb99da85d25e4cf251b |
| B3-ar-s | arrow-rs, stats | 4096 | 2 (2048, 2048) | rg0 min 0, max 2047; rg1 min 0, max 4000004095; nulls 0 | 1621672 | 67516ca812f862086cf826ac58617c0e768e376e9b16f20656976447c47a4277 |
| B3-ar-n | arrow-rs, none | 4096 | 2 (2048, 2048) | absent | 1620114 | 115b783669c140ce7f46922500e55c108f4099051f7a47514c911a3aa3f2ebb4 |
| B3-dk | DuckDB | 4096 | 2 (2048, 2048) | as B3-ar-s | 1594838 | 41d7999a8bb790cd53a483fe464576ce4e580f189eb86459218164050f6381c6 |
| S-ar-n | arrow-rs, none | 6 | 1 (6) | absent | 6399 | 73f26905c6fe151d2c76f6bd173e2ec4c4f15904ac997178d20acf8adeec5866 |
| R-ar-n | arrow-rs, none | 3 | 1 (3) | absent | 5279 | a0fad7641a7a4da2b45117191cde73f592bbff19e4ccaa966588ca81d4b356f8 |

## Item 10. The probe's i128 counts beside lead-data's hand table

All 10 rows that have a hand-table entry agree (`agree=Some(true)`). No arithmetic disagreement.

| kind pred | X count (ids) | W count (ids) | hand (X, W), lead-data's |
|---|---|---|---|
| A P1 | 2047 (1..=2047) | 1023 (1..=1023) | (2047, 1023) |
| A P2 | 0 | 1024 (1024..=2047) | (0, 1024) |
| A P3 | 2048 | 2048 | (2048, 2048) |
| B P1 | 2047 (1..=2047) | 2046 (1..=2046) | (2047, 2046) |
| B P2 | 0 | 1 (2047) | (0, 1) |
| B P3 | 2048 | 2048 | (2048, 2048) |
| B3 P1 | 4094 ({1..=2047, 2049..=4095}) | 4093 ({1..=2047, 2049..=4094}) | (4094, 4093) |
| B3 P2 | 0 | 1 (4095) | (0, 1) |
| B3 P3 | 4096 | 4096 | none in the table |
| S P1 | 6 | 2 (0..=1) | (6, 2) |
| S P2 | 0 | 4 (2..=5) | (0, 4) |
| S P3 | 6 | 6 | none |
| R P1 | 3 (0..=2) | 2 ({0,2}) | none |
| R P2 | 0 | 0 | none |
| R P3 | 3 | 3 | none |

## Item 3. Engine runs (`Dataset::stream_with_cancel`)

- 136 runs: file × shape (all, view) × predicate × rep (1, 2). Only P1 and P2 ran on S and R; 12 of the 136 are the step 4.7 literal runs.
- **Admission:** every P1, P2 and P3 was admitted, with `referenced_columns = ["v"]` and `sql_text` equal to the predicate text.
- **Controls:** C1 and C2 were refused on both A-ar-s and B-ar-s, so there was no OPEN-2 stop.
  - C1 `v * v`: `skp.filter_not_boolean: refused: the predicate's inferred type is Int64, not BOOLEAN; an implicit conversion to BOOLEAN is not performed (docs/01 principle 8)`.
  - C2 `v * 1.5 > 0`: `skp.filter_type_not_admitted: refused: `*` over BIGINT and DECIMAL(2,1) literal: a conversion that can fail during the scan (docs/01 principle 8)`.
- **Repeatability:**
  - Rep 1 and rep 2 are identical, and shape all and shape view give the same batches and ids. This holds for all 34 (file, predicate) groups, in both processes.
  - The probe printed 0 `REP-DIFFER` lines.
  - The 136 `ERUN` lines are byte-identical between run1 and run2 (md5 37255fbe7b01c4db389862435217c9df on both).
  - `filter_plan` is `WholeFile` for shape all and `ScanOnly` for shape view in every run.
- **Terminal:** `ended-no-error` in every run except the four R runs (R P1 and R P2, both shapes, both reps).
  - Display: `query: [P6 placeholder] a value computed while this query ran was out of range for its type; the row values and the query text are withheld`
  - Debug: `Query("[P6 placeholder] a value computed while this query ran was out of range for its type; the row values and the query text are withheld")`
  - R P2 shows `eq_X=true` only because X is empty and the stream delivered no ids before the error.

Batches below are `(batch_index: rows / payload_bytes / cut_by)`. "Diff vs X" is the symmetric-difference size and its first 8 ids.

| file(s) | pred | ids n (min..max) | eq X / eq W / empty | diff vs X | batches |
|---|---|---|---|---|---|
| A-ar-s, A-ar-n, A-dk | P1 | 1023 (1..1023) | no / yes / no | 1024: 1024..1031 | #0:125/58440/size-target, #1:512/221960/size-target, #2:386/170824/stream-end |
| same | P2 | 1024 (1024..2047) | no / yes / no | 1024: 1024..1031 | #0:126/58632/size-target, #1:508/222088/size-target, #2:390/170568/stream-end |
| same | P3 | 2048 (0..2047) | yes / yes / no | none | #0:124/58440/size-target, #1:512/221896/size-target, #2:1412/610760/stream-end |
| B-ar-s, B-dk | P1 | 0 | no / no / yes | 2047: 1..8 | none |
| B-ar-n | P1 | 2046 (1..2046) | no / yes / no | 1: 2047 | #0:125/58440/size-target, #1:512/221960/size-target, #2:1409/609736/stream-end |
| B-ar-s, B-ar-n, B-dk | P2 | 1 (2047) | no / yes / no | 1: 2047 | #0:1/4552/stream-end |
| B (all three) | P3 | 2048 | yes / yes / no | none | as A P3 |
| B3-ar-s, B3-dk | P1 | 0 | no / no / yes | 4094: 1..8 | none |
| B3-ar-n | P1 | 4093 (1..4094) | no / yes / no | 1: 4095 | #0:125/58440/size-target, #1:512/221960/size-target, #2:2021/876808/size-target, #3:1435/609800/stream-end |
| B3 (all three) | P2 | 1 (4095) | no / yes / no | 1: 4095 | #0:1/4680/stream-end |
| B3 (all three) | P3 | 4096 (0..4095) | yes / yes / no | none | #0:124/58440/size-target, #1:512/221896/size-target, #2:2021/876616/size-target, #3:1439/611528/stream-end |
| S-ar-n | P1 | 2 (0..1) | no / yes / no | 4: 2,3,4,5 | #0:2/5256/stream-end |
| S-ar-n | P2 | 4 (2..5) | no / yes / no | 4: 2,3,4,5 | #0:4/5704/stream-end |
| R-ar-n | P1, P2 | 0 | terminal error | P1: 3 (0,1,2); P2: none | none |
| B-ar-s L1 (4000000000 * 4000000000 > 0) | | 0 | no / n/a / yes | 2048: 0..7 | none; admission Ok, `referenced_columns=[]` |
| B-ar-s L2 (... < 0) | | 2048 (0..2047) | no / n/a / no | 2048: 0..7 | as A P3 |
| B-ar-s L3 (4294967296 * 4294967296 > 0) | | 2048 | yes / n/a / no | none | as A P3 |

- **Design's three conditions:** admission Ok, stream ended with no `Some(Err)`, delivered id set differs from X.
  - Runs meeting them: 88 of the 136 (`TALLY ... =88`; the same count in run2).
  - Cells (file, pred), 22 in all, each with 4 runs (2 shapes × 2 reps):
    - P1 on A-ar-s, A-ar-n, A-dk, B-ar-s, B-ar-n, B-dk, B3-ar-s, B3-ar-n, B3-dk, and S: 10 cells.
    - P2 on those nine plus S: 10 cells.
    - L1 and L2 on B-ar-s: 2 cells.
  - Runs not meeting them: P3 everywhere (equal to X), L3 (equal to X), and R (error).

## Item 4. Independent counts and the comparison table

Every independent query is cell D (default settings) on a fresh `configured_connection()`. SQL, byte for byte:
- `SELECT count(*) FROM read_parquet(?) WHERE (<P>)`, path bound.
- For P1 additionally `SELECT count(*) FROM read_parquet('<path>') WHERE (v * v > 0)` (literal path).
- I-stream: `SELECT "id" AS "id", "geometry" FROM read_parquet(?) WHERE (<P>)`, with `prepare`, `stream_arrow`, and `catch_unwind` around each `next()`.

None of the independent queries raised an error or panic. The literal-path P1 count equals the bound-path count in every file.

One row per (file group, pred). Engine(all), engine(view), I-count and I-stream are all equal in every row.

| files | pred | the four measured | X | W |
|---|---|---|---|---|
| A-ar-s, A-ar-n, A-dk | P1 / P2 / P3 | 1023 / 1024 / 2048 | 2047 / 0 / 2048 | 1023 / 1024 / 2048 |
| B-ar-s, B-dk | P1 / P2 / P3 | **0** / 1 / 2048 | 2047 / 0 / 2048 | 2046 / 1 / 2048 |
| B-ar-n | P1 / P2 / P3 | 2046 / 1 / 2048 | same | same |
| B3-ar-s, B3-dk | P1 / P2 / P3 | **0** / 1 / 4096 | 4094 / 0 / 4096 | 4093 / 1 / 4096 |
| B3-ar-n | P1 / P2 / P3 | 4093 / 1 / 4096 | same | same |

- I-stream chunk counts: 1 chunk for the A and B files with rows; 0 chunks where it returned 0 rows; 2 chunks for B3 P3 and for B3-ar-n P1.
- Symmetric differences against X, from the `CMP-DIFF` lines. The engine (all), engine (view) and I-stream sets all differ from X by the same figure:

| files | pred | symmetric difference vs X | first 8 ids |
|---|---|---|---|
| A (3 writers) | P1, P2 | 1024 | 1024..1031 |
| B-ar-s, B-dk | P1 | 2047 | 1..8 |
| B-ar-n | P1 | 1 | 2047 |
| B (3 writers) | P2 | 1 | 2047 |
| B3-ar-s, B3-dk | P1 | 4094 | 1..8 |
| B3-ar-n | P1 | 1 | 4095 |
| B3 (3 writers) | P2 | 1 | 4095 |

## Item 5. I-product (`SELECT id, v, v * v AS p FROM read_parquet(?)`)

- The query never raised an error in any file or cell. `p` came back as BIGINT.
- Rows and counts:
  - A (any writer or cell): 2048 rows, 1024 overflowing rows (ids 1024..2047), `rows_where_p_ne_x` = 1024.
  - B: 2048 rows, 1 overflowing row, `p ≠ x` for 1 row.
  - B3: 4096 rows, 1 overflowing row, `p ≠ x` for 1 row.
- Every overflowing row's `p` equals the wrapped product `w` exactly. The log holds 12,312 `IPRODUCT-ROW` lines (cell D plus SP, FP, SPFP); a script found 0 rows where `p` ≠ `w`. Every line is in `run1.log`, with id, v, p, x and w.
- B row, as returned: `id=2047 v=4000002047 p_returned=BigInt(-2446727697705361407) x=16000016376004190209 w=-2446727697705361407`
- B3 row: `id=4095 v=4000004095 p_returned=BigInt(-2446711313692782591) x=16000032760016769025 w=-2446711313692782591`
- A first and last rows:
  - `id=1024 v=4000000000 p_returned=BigInt(-2446744073709551616) x=16000000000000000000 w=-2446744073709551616`
  - `id=1025 v=-4000000001 p_returned=BigInt(-2446744065709551615) x=16000000008000000001 w=-2446744065709551615`
  - `id=1026 v=4000000002 p_returned=BigInt(-2446744057709551612) x=16000000016000000004 w=-2446744057709551612`
  - `id=1027 v=-4000000003 p_returned=BigInt(-2446744049709551607) x=16000000024000000009 w=-2446744049709551607`
  - `id=2046 v=4000001022 p_returned=BigInt(-2446735897708507132) x=16000008176001044484 w=-2446735897708507132`
  - `id=2047 v=-4000001023 p_returned=BigInt(-2446735889708505087) x=16000008184001046529 w=-2446735889708505087`

## Item 4.2 and 4.4. Planner-statistics switches (I-count with a bound path, fresh connection per cell)

`SET disabled_optimizers` accepted all three settings; there were 0 `CELL-REFUSED` lines. P1 / P2 / P3 per cell:

| file | D | SP | FP | SPFP |
|---|---|---|---|---|
| A (3 writers) | 1023 / 1024 / 2048 | same | same | same |
| B-ar-s, B-dk | 0 / 1 / 2048 | 2046 / 1 / 2048 | 0 / 1 / 2048 | 2046 / 1 / 2048 |
| B-ar-n | 2046 / 1 / 2048 | same | same | same |
| B3-ar-s, B3-dk | 0 / 1 / 4096 | 4093 / 1 / 4096 | 0 / 1 / 4096 | 4093 / 1 / 4096 |
| B3-ar-n | 4093 / 1 / 4096 | same | same | same |

- The 4096-row B3 files with statistics return 0 in D, not 2047 (group 0 only).
- I-product in SP, FP and SPFP is identical to cell D, with `p = w` on every overflowing row.
- Step 4.3 (statistics absent) is the `-ar-n` rows: the engine returns the W sets (A 1023 / 1024, B 2046 / 1, B3 4093 / 1), with no error.

## Item 6. EXPLAIN texts

- `SET explain_output = 'all'`, literal path, P1 count query. 36 blocks (9 files × cells D, SP, FP, SPFP) are in `run1.log` (and `run2.log`) between `EXPLAIN-BEGIN` and `EXPLAIN-END`.
- Each block holds the `logical_plan`, `logical_opt` and `physical_plan` sections.
- Summary by script:
  - `EMPTY_RESULT` in the optimized plan: B-ar-s, B-dk, B3-ar-s and B3-dk, in cells D and FP only.
  - Every other block (all A files, all `-ar-n` files, and SP/SPFP of the B and B3 stats files) has the filter inside `READ_PARQUET` as `Filters: ((v * v) > 0)`, with a row estimate of ~409 (A and B) or ~819 (B3).
- Whole text of two blocks, copied from the log (lines 13656-13715 and 13721-13792 of `run1.log`):

```
EXPLAIN-BEGIN cell=D file=B-ar-s sql=[SELECT count(*) FROM read_parquet('D:/wt-targets/o1-probe/o1-data/run1/B-ar-s.parquet') WHERE (v * v > 0)]
--- logical_plan ---
┌───────────────────────────┐
│         PROJECTION        │
│    ────────────────────   │
│        Expressions:       │
│        count_star()       │
└─────────────┬─────────────┘
┌─────────────┴─────────────┐
│         AGGREGATE         │
│    ────────────────────   │
│        Expressions:       │
│        count_star()       │
└─────────────┬─────────────┘
┌─────────────┴─────────────┐
│           FILTER          │
│    ────────────────────   │
│        Expressions:       │
│    ((v * v) > CAST(0 AS   │
│          BIGINT))         │
└─────────────┬─────────────┘
┌─────────────┴─────────────┐
│        READ_PARQUET       │
│    ────────────────────   │
└───────────────────────────┘

--- logical_opt ---
┌───────────────────────────┐
│         PROJECTION        │
│    ────────────────────   │
│        Expressions:       │
│        count_star()       │
│                           │
│           ~1 row          │
└─────────────┬─────────────┘
┌─────────────┴─────────────┐
│         AGGREGATE         │
│    ────────────────────   │
│        Expressions:       │
│        count_star()       │
│                           │
│           ~1 row          │
└─────────────┬─────────────┘
┌─────────────┴─────────────┐
│        EMPTY_RESULT       │
│    ────────────────────   │
└───────────────────────────┘

--- physical_plan ---
┌───────────────────────────┐
│    UNGROUPED_AGGREGATE    │
│    ────────────────────   │
│        Aggregates:        │
│        count_star()       │
└─────────────┬─────────────┘
┌─────────────┴─────────────┐
│        EMPTY_RESULT       │
└───────────────────────────┘

EXPLAIN-END cell=D file=B-ar-s
```

```
EXPLAIN-BEGIN cell=SP file=B-ar-s sql=[SELECT count(*) FROM read_parquet('D:/wt-targets/o1-probe/o1-data/run1/B-ar-s.parquet') WHERE (v * v > 0)]
--- logical_plan ---
[identical to the cell D logical_plan above]

--- logical_opt ---
┌───────────────────────────┐
│         PROJECTION        │
│    ────────────────────   │
│        Expressions:       │
│        count_star()       │
│                           │
│           ~1 row          │
└─────────────┬─────────────┘
┌─────────────┴─────────────┐
│         AGGREGATE         │
│    ────────────────────   │
│        Expressions:       │
│        count_star()       │
│                           │
│           ~1 row          │
└─────────────┬─────────────┘
┌─────────────┴─────────────┐
│        READ_PARQUET       │
│    ────────────────────   │
│          Filters:         │
│       ((v * v) > 0)       │
│                           │
│         ~409 rows         │
└───────────────────────────┘

--- physical_plan ---
┌───────────────────────────┐
│    UNGROUPED_AGGREGATE    │
│    ────────────────────   │
│        Aggregates:        │
│        count_star()       │
└─────────────┬─────────────┘
┌─────────────┴─────────────┐
│        READ_PARQUET       │
│    ────────────────────   │
│         Function:         │
│        READ_PARQUET       │
│                           │
│          Filters:         │
│       ((v * v) > 0)       │
│                           │
│         ~409 rows         │
└───────────────────────────┘

EXPLAIN-END cell=SP file=B-ar-s
```

The first section above is abbreviated only where marked in brackets. The other 34 blocks are whole in `run1.log` at these lines (`BEGIN` to `END`):

| cell | A-ar-s | A-ar-n | A-dk | B-ar-s | B-ar-n | B-dk | B3-ar-s | B3-ar-n | B3-dk |
|---|---|---|---|---|---|---|---|---|---|
| D | 3474-3545 | 6868-6939 | 10262-10333 | 13656-13715 | 13946-14017 | 14271-14330 | 14561-14620 | 14851-14922 | 15176-15235 |
| SP | 4574-4645 | 7968-8039 | 11362-11433 | 13721-13792 | 14023-14094 | 14336-14407 | 14626-14697 | 14928-14999 | 15241-15312 |
| FP | 5674-5756 | 9068-9150 | 12462-12544 | 13798-13857 | 14100-14182 | 14413-14472 | 14703-14762 | 15005-15087 | 15318-15377 |
| SPFP | 6785-6867 | 10179-10261 | 13573-13655 | 13863-13945 | 14188-14270 | 14478-14560 | 14768-14850 | 15093-15175 | 15383-15465 |

## Item 7. Step 4.5 (per k) and step 4.7 (per query)

**4.5, independent:** `SELECT v * v AS p FROM read_parquet(?) WHERE id = <k>`. Cells D and SP gave identical results.

| file k | v | result (D = SP) | x | w |
|---|---|---|---|---|
| S 0 | 2 | BigInt(4) | 4 | 4 |
| S 1 | 3037000499 | BigInt(9223372030926249001) | 9223372030926249001 | same |
| S 2 | 3037000500 | BigInt(-9223372036709301616) | 9223372037000250000 | -9223372036709301616 |
| S 3 | -3037000500 | BigInt(-9223372036709301616) | 9223372037000250000 | same |
| S 4 | 4000000000 | BigInt(-2446744073709551616) | 16000000000000000000 | -2446744073709551616 |
| S 5 | 4294967295 | BigInt(-8589934591) | 18446744065119617025 | -8589934591 |
| R 0 | 2 | BigInt(4) | 4 | 4 |
| R 1 | 4294967296 | ERROR `Out of Range Error: Overflow in multiplication of INT64 (4294967296 * 4294967296)!` | 18446744073709551616 | 0 |
| R 2 | 3600000000003999000 | ERROR `Out of Range Error: Overflow in multiplication of INT64 (3600000000003999000 * 3600000000003999000)!` | 12960000000028792800000015992001000000 | 967113234518241856 |

- Engine P1 and P2 on S and R are in the item 3 table.
- S P1 delivered ids 0 and 1 and S P2 delivered ids 2 to 5. R errored.
- This matches lead-data's H-MSVC prediction on its stated points (operands below 2^32 wrap silently, operands at or above 2^32 raise). That match is lead-data's to read.

**4.7, literal-only, on B-ar-s.**
- Engine: admission Ok for L1, L2 and L3 (`referenced_columns=[]`). Results are in the item 3 table:
  - L1 delivered 0 rows (X is 2048).
  - L2 delivered 2048 rows (X is 0).
  - L3 delivered 2048 rows (equal to X).
  - All with no stream error, in both shapes, in both reps.
- Independent (cells D, SP and ER = `expression_rewriter`, all accepted, identical across the three cells):

| SQL | result |
|---|---|
| `SELECT 4000000000 * 4000000000 AS p` | `value=BigInt(-2446744073709551616)` |
| `SELECT 3037000500 * 3037000500 AS p` | `value=BigInt(-9223372036709301616)` |
| `SELECT 4294967296 * 4294967296 AS p` | `ERROR [Out of Range Error: Overflow in multiplication of INT64 (4294967296 * 4294967296)!]` |

## Item 8. Step 4.6, the vendored source

- Extraction root: the `out/duckdb/` folder under the `libduckdb-sys` build directory in `D:/wt-targets/sefd/debug/build/`. Three such build directories exist; `multiply.cpp` and `arithmetic.cpp` are byte-identical in all three (sha256 2332e8cc038dcadd22816e2b1e7b26745edf01795c96c0e97a40b192fba1c4da and f6acf438845958d4d3e770744646b0327446907936932fcca3e8feb6a32625f1). I read them from one of the three.
- Build target: `host: x86_64-pc-windows-msvc`.
- Compiler naming: no build-script output line names `cl.exe` or any compiler binary. The lines that name the toolchain are the target-triple environment variables, e.g. `cargo:rerun-if-env-changed=CXX_x86_64-pc-windows-msvc` (line 23 of the build-script `output`). The build's `out` folder holds `flag_check.obj`. The package's `build_bundled_cc.rs:123` reads `    if win_target() && is_compiler("msvc") {`.
- I did not inspect which preprocessor macros the compiler defined. The evidence for the `#else` branch is the behaviour in item 7.

`src/function/scalar/operator/multiply.cpp:191-265`:
```
template <>
bool TryMultiplyOperator::Operation(int64_t left, int64_t right, int64_t &result) {
#if (__GNUC__ >= 5) || defined(__clang__)
	if (__builtin_mul_overflow(left, right, &result)) {
		return false;
	}
#else
	if (left == std::numeric_limits<int64_t>::min()) {
		if (right == 0) {
			result = 0;
			return true;
		}
		if (right == 1) {
			result = left;
			return true;
		}
		return false;
	}
	if (right == std::numeric_limits<int64_t>::min()) {
		if (left == 0) {
			result = 0;
			return true;
		}
		if (left == 1) {
			result = right;
			return true;
		}
		return false;
	}
	uint64_t left_non_negative = uint64_t(std::abs(left));
	uint64_t right_non_negative = uint64_t(std::abs(right));
	// split values into 2 32-bit parts
	uint64_t left_high_bits = left_non_negative >> 32;
	uint64_t left_low_bits = left_non_negative & 0xffffffff;
	uint64_t right_high_bits = right_non_negative >> 32;
	uint64_t right_low_bits = right_non_negative & 0xffffffff;

	// check the high bits of both
	// the high bits define the overflow
	if (left_high_bits == 0) {
		if (right_high_bits != 0) {
			// only the right has high bits set
			// multiply the high bits of right with the low bits of left
			// multiply the low bits, and carry any overflow to the high bits
			// then check for any overflow
			auto low_low = left_low_bits * right_low_bits;
			auto low_high = left_low_bits * right_high_bits;
			auto high_bits = low_high + (low_low >> 32);
			if (high_bits & 0xffffff80000000) {
				// there is! abort
				return false;
			}
		}
	} else if (right_high_bits == 0) {
		// only the left has high bits set
		// multiply the high bits of left with the low bits of right
		// multiply the low bits, and carry any overflow to the high bits
		// then check for any overflow
		auto low_low = left_low_bits * right_low_bits;
		auto high_low = left_high_bits * right_low_bits;
		auto high_bits = high_low + (low_low >> 32);
		if (high_bits & 0xffffff80000000) {
			// there is! abort
			return false;
		}
	} else {
		// both left and right have high bits set: guaranteed overflow
		// abort!
		return false;
	}
	// now we know that there is no overflow, we can just perform the multiplication
	result = left * right;
#endif
	return true;
}
```

`src/function/scalar/operator/arithmetic.cpp:799-834` (`MultiplyPropagateStatistics`):
```
struct MultiplyPropagateStatistics {
	template <class T, class OP>
	static bool Operation(const LogicalType &type, BaseStatistics &lstats, BaseStatistics &rstats, Value &new_min,
	                      Value &new_max) {
		// statistics propagation on the multiplication is slightly less straightforward because of negative numbers
		// the new min/max depend on the signs of the input types
		// if both are positive the result is [lmin * rmin][lmax * rmax]
		// if lmin/lmax are negative the result is [lmin * rmax][lmax * rmin]
		// etc
		// rather than doing all this switcheroo we just multiply all combinations of lmin/lmax with rmin/rmax
		// and check what the minimum/maximum value is
		T lvals[] {NumericStats::GetMin<T>(lstats), NumericStats::GetMax<T>(lstats)};
		T rvals[] {NumericStats::GetMin<T>(rstats), NumericStats::GetMax<T>(rstats)};
		T min = NumericLimits<T>::Maximum();
		T max = NumericLimits<T>::Minimum();
		// multiplications
		for (idx_t l = 0; l < 2; l++) {
			for (idx_t r = 0; r < 2; r++) {
				T result;
				if (!OP::Operation(lvals[l], rvals[r], result)) {
					// potential overflow
					return true;
				}
				if (result < min) {
					min = result;
				}
				if (result > max) {
					max = result;
				}
			}
		}
		new_min = Value::Numeric(type, min);
		new_max = Value::Numeric(type, max);
		return false;
	}
};
```

`src/function/scalar/operator/arithmetic.cpp:174-184` (the swap in `PropagateNumericStats`; the function starts at line 143), and `:917-921` (the integral registration):
```
	if (potential_overflow) {
		new_min = Value(expr.return_type);
		new_max = Value(expr.return_type);
	} else {
		// no potential overflow: replace with non-overflowing operator
		if (input.bind_data) {
			auto &bind_data = input.bind_data->Cast<DecimalArithmeticBindData>();
			bind_data.check_overflow = false;
		}
		expr.function.SetFunctionCallback(GetScalarIntegerFunction<BASEOP>(expr.return_type.InternalType()));
	}
```
```
		} else if (TypeIsIntegral(type.InternalType())) {
			multiply.AddFunction(ScalarFunction(
			    {type, type}, type, GetScalarIntegerFunction<MultiplyOperatorOverflowCheck>(type.InternalType()),
			    nullptr, nullptr,
			    PropagateNumericStats<TryMultiplyOperator, MultiplyPropagateStatistics, MultiplyOperator>));
```

## Item 9. Hold and release lines (my project only), reruns

I elided the `also=...` segment of each hold line, which names another process.

| step | hold line | command | release line |
|---|---|---|---|
| build (`-What "o1-probe: cargo test --no-run" -Minutes 40 -MaxWaitMinutes 8`) | `MACHINE_HOLD shared project=SpatialIDE cores=0-7 affinity=FF shell=bash.exe:37412 [...]` | `cmd-rc=0` | `MACHINE_RELEASED project=SpatialIDE shell=bash.exe:37412 affinity=FF (cores 0-7)` |
| run 1 (`-What "o1-probe: run 1" -Minutes 10 -MaxWaitMinutes 8`) | `... shell=bash.exe:31216 [...]` | `cmd-rc=0` | `MACHINE_RELEASED project=SpatialIDE shell=bash.exe:31216 affinity=FF (cores 0-7)` |
| run 2 (`-What "o1-probe: run 2" -Minutes 10 -MaxWaitMinutes 8`) | `... shell=bash.exe:28468 [...]` | `cmd-rc=0` | `MACHINE_RELEASED project=SpatialIDE shell=bash.exe:28468 affinity=FF (cores 0-7)` |

- Each call ended `[exited with code 0]`. No exit code 96 to 99 appeared. I used the shared hold only, and ran each call in the background.
- No fix-and-rerun cycles. The probe compiled on its first build, with one dead-code warning for the unread `FileInfo` fields `writer` and `path`.
- Run 2 was the second process for repeatability. All 15 parquet files (4 bases, 11 fixtures) have equal sha256 in run1 and run2 (table in item 2).
- The `ERUN` lines, and the `ICOUNT`, `ISTREAM`, `CMP`, `S45` and `L47` lines, are byte-identical between the two runs (md5 c4db5d381adafc98321d638508b3400a on both for the second group).
- No timing figure is claimed.

## Tester additions

- Model: I observe myself as Sonnet 5.5 (model ID `claude-sonnet-5-5`), running the `tester.md` role at high effort. No model override and no context handoff.
- Four failure classes for this harness:
  - **Interface:** engine runs go through `AdmittedPredicate::admit` and `Dataset::stream_with_cancel` (the product's shapes); independent runs use the `duckdb` crate directly.
  - **Result claims:** every figure points to `run1.log`/`run2.log`; I wrote no results file.
  - **Operator-facing lines:** none written.
  - **Assertions:** the test makes no assertions, but each run printed `O1 PROBE DONE`; run 1 also printed its `TALLY` line and run 2's `TALLY` line is identical.
- Where the transcript has no call behind it: the `diff` of the two logs (empty after normalising the run path and dropping cargo and test-framework lines) is not repeated in other forms.

## Final state

- Checkout: HEAD fb361420f512d2f631e29d4e2f9fcc5e5d2fd2be, porcelain `?? engine/tests/o1_probe.rs`, nothing else. Nothing staged or committed.
- No process I started still runs: `tasklist` filtered for `o1_probe|cargo|rustc` found none (grep rc 1).
- Kept (OPEN-4 (a)): the checkout, `D:/wt-targets/sefd`, `D:/wt-targets/o1-probe/o1-data/` with `run1/`, `run2/`, `run1.log`, `run2.log`.
- Scratch files, all under the names `o1-t-*` in my scratch folder: `o1-t-build1.log` (the build log), `o1-t-compact.js`, `o1-t-rowcheck.js`, `o1-t-explain.js`, `o1-t-batchcheck.js`, `o1-t-eruns.txt`.

## Appendix: `C:/dev/wt/o1-probe/engine/tests/o1_probe.rs`

1371 lines, LF endings, sha256 2128f3542d8a50ed8001f886fba655882cf6a5e7c3ce2133fa2f39239716f90a. The file on disk is the authority; this copy is the text I wrote, with the one edit applied (the `DESCRIBE` leftover removed).

```rust
// O1 probe for admitted-integer-overflow-silent-wraparound. Untracked, throwaway, nothing committed.
// Designed by lead-data; run by a tester-high. One test runs every step in order and prints its
// figures; it asserts nothing about the engine and grades nothing.

use std::collections::{BTreeMap, BTreeSet};
use std::fs::File;
use std::panic::{catch_unwind, AssertUnwindSafe};
use std::path::{Path, PathBuf};
use std::sync::Arc;

use arrow::array::{Array, Int64Array, UInt64Array};
use arrow::datatypes::{DataType, Field, Schema};
use arrow::record_batch::RecordBatch;
use duckdb::types::Value;
use duckdb::{params, Connection, ToSql};
use parquet::arrow::arrow_reader::ParquetRecordBatchReaderBuilder;
use parquet::arrow::ArrowWriter;
use parquet::basic::Compression;
use parquet::file::metadata::KeyValue;
use parquet::file::properties::{EnabledStatistics, WriterProperties};

use spatial_engine::cancel::CancelToken;
use spatial_engine::fixture::{
    configured_connection, write_geoparquet, FixtureSpec, StatisticsMode,
};
use spatial_engine::{
    AdmittedPredicate, Bbox, Dataset, FilterError, PredicateAdmitError, ViewportQuery,
};

// ------------------------------------------------------------------------------------------------
// Model: values, exact and wrapped products
// ------------------------------------------------------------------------------------------------

#[derive(Clone, Copy, PartialEq, Eq, Debug)]
enum Kind {
    A,
    B,
    B3,
    S,
    R,
}

#[derive(Clone, Copy, PartialEq, Eq, Debug)]
enum Writer {
    ArS,
    ArN,
    Dk,
}

fn v_of(kind: Kind, id: u64) -> i64 {
    match kind {
        Kind::A => {
            if id < 1024 {
                id as i64
            } else {
                let k = (id - 1024) as i64;
                if k % 2 == 0 {
                    4_000_000_000 + k
                } else {
                    -(4_000_000_000 + k)
                }
            }
        }
        Kind::B => {
            if id < 2047 {
                id as i64
            } else {
                4_000_002_047
            }
        }
        Kind::B3 => match id {
            0..=2047 => id as i64,
            2048 => 0,
            2049..=4094 => id as i64,
            _ => 4_000_004_095,
        },
        Kind::S => [
            2,
            3_037_000_499,
            3_037_000_500,
            -3_037_000_500,
            4_000_000_000,
            4_294_967_295,
        ][id as usize],
        Kind::R => [2, 4_294_967_296, 3_600_000_000_003_999_000][id as usize],
    }
}

fn x_of(v: i64) -> i128 {
    (v as i128) * (v as i128)
}

fn w_of(v: i64) -> i64 {
    v.wrapping_mul(v)
}

fn rows_of(kind: Kind) -> usize {
    match kind {
        Kind::A | Kind::B => 2048,
        Kind::B3 => 4096,
        Kind::S => 6,
        Kind::R => 3,
    }
}

fn expected_groups(kind: Kind) -> Vec<i64> {
    match kind {
        Kind::B3 => vec![2048, 2048],
        k => vec![rows_of(k) as i64],
    }
}

fn kind_name(kind: Kind) -> &'static str {
    match kind {
        Kind::A => "A",
        Kind::B => "B",
        Kind::B3 => "B3",
        Kind::S => "S",
        Kind::R => "R",
    }
}

fn writer_name(w: Writer) -> &'static str {
    match w {
        Writer::ArS => "ar-s",
        Writer::ArN => "ar-n",
        Writer::Dk => "dk",
    }
}

#[derive(Clone, Copy)]
struct Pred {
    key: &'static str,
    text: &'static str,
}

const P1: Pred = Pred {
    key: "P1",
    text: "v * v > 0",
};
const P2: Pred = Pred {
    key: "P2",
    text: "v * v < 0",
};
const P3: Pred = Pred {
    key: "P3",
    text: "(v * v) IS NOT NULL",
};
const L1: Pred = Pred {
    key: "L1",
    text: "4000000000 * 4000000000 > 0",
};
const L2: Pred = Pred {
    key: "L2",
    text: "4000000000 * 4000000000 < 0",
};
const L3: Pred = Pred {
    key: "L3",
    text: "4294967296 * 4294967296 > 0",
};

/// (X set, W set) for a predicate on a file kind. W is None for the literal-only predicates.
fn model_sets(kind: Kind, pred: &str) -> (BTreeSet<u64>, Option<BTreeSet<u64>>) {
    let n = rows_of(kind) as u64;
    let all: BTreeSet<u64> = (0..n).collect();
    let pick = |f: &dyn Fn(i64) -> bool| -> BTreeSet<u64> {
        (0..n).filter(|&id| f(v_of(kind, id))).collect()
    };
    match pred {
        "P1" => (pick(&|v| x_of(v) > 0), Some(pick(&|v| w_of(v) > 0))),
        "P2" => (pick(&|v| x_of(v) < 0), Some(pick(&|v| w_of(v) < 0))),
        "P3" => (all.clone(), Some(all)),
        "L1" => (all, None),
        "L2" => (BTreeSet::new(), None),
        "L3" => (all, None),
        other => panic!("no model for {other}"),
    }
}

/// The hand table's (X, W) counts (lead-data's, labelled as such when printed).
fn hand(kind: Kind, pred: &str) -> Option<(usize, usize)> {
    match (kind, pred) {
        (Kind::A, "P1") => Some((2047, 1023)),
        (Kind::A, "P2") => Some((0, 1024)),
        (Kind::A, "P3") => Some((2048, 2048)),
        (Kind::B, "P1") => Some((2047, 2046)),
        (Kind::B, "P2") => Some((0, 1)),
        (Kind::B, "P3") => Some((2048, 2048)),
        (Kind::B3, "P1") => Some((4094, 4093)),
        (Kind::B3, "P2") => Some((0, 1)),
        (Kind::S, "P1") => Some((6, 2)),
        (Kind::S, "P2") => Some((0, 4)),
        _ => None,
    }
}

fn fmt_ids(s: &BTreeSet<u64>) -> String {
    if s.is_empty() {
        return "{}".to_string();
    }
    let v: Vec<u64> = s.iter().copied().collect();
    let rng = |a: u64, b: u64| {
        if a == b {
            format!("{a}")
        } else {
            format!("{a}..={b}")
        }
    };
    let mut out = Vec::new();
    let (mut a, mut b) = (v[0], v[0]);
    for &x in &v[1..] {
        if x == b + 1 {
            b = x;
        } else {
            out.push(rng(a, b));
            a = x;
            b = x;
        }
    }
    out.push(rng(a, b));
    if out.len() > 40 {
        let total = out.len();
        out.truncate(40);
        out.push(format!("...({total} ranges)"));
    }
    format!("{{{}}}", out.join(","))
}

fn first8_symdiff(a: &BTreeSet<u64>, b: &BTreeSet<u64>) -> (usize, Vec<u64>) {
    let d: Vec<u64> = a.symmetric_difference(b).copied().collect();
    (d.len(), d.iter().copied().take(8).collect())
}

fn norm(p: &Path) -> String {
    p.to_string_lossy().replace('\\', "/")
}

fn sq(s: &str) -> String {
    s.replace('\'', "''")
}

fn code_of(e: &FilterError) -> &'static str {
    match e {
        FilterError::DialectUnsupported { .. } => "skp.filter_dialect_unsupported",
        FilterError::Unparsable { .. } => "skp.filter_unparsable",
        FilterError::NotASingleExpression { .. } => "skp.filter_not_a_single_expression",
        FilterError::ConstructNotAdmitted { .. } => "skp.filter_construct_not_admitted",
        FilterError::UnknownColumn { .. } => "skp.filter_unknown_column",
        FilterError::ColumnNotFilterable { .. } => "skp.filter_column_not_filterable",
        FilterError::IdentityAliasAmbiguous { .. } => "skp.filter_identity_alias_ambiguous",
        FilterError::NotBoolean { .. } => "skp.filter_not_boolean",
        FilterError::TooLong { .. } => "skp.filter_too_long",
        FilterError::TooDeep { .. } => "skp.filter_too_deep",
        FilterError::RejectedByBinder { .. } => "skp.filter_rejected_by_binder",
        FilterError::TypeNotAdmitted { .. } => "skp.filter_type_not_admitted",
    }
}

fn panic_text(p: Box<dyn std::any::Any + Send>) -> String {
    p.downcast_ref::<String>()
        .cloned()
        .or_else(|| p.downcast_ref::<&str>().map(|s| s.to_string()))
        .unwrap_or_else(|| "<non-string panic>".to_string())
}

// ------------------------------------------------------------------------------------------------
// Fixtures
// ------------------------------------------------------------------------------------------------

struct Base {
    path: PathBuf,
    extent: [f64; 4],
    geo: String,
}

fn make_base(dir: &Path, n: usize) -> Base {
    let spec = FixtureSpec {
        features: n,
        row_group_rows: 2_048,
        statistics: StatisticsMode::WriterDefault,
        ..Default::default()
    };
    let path = dir.join(format!("base-{n}.parquet"));
    let facts = write_geoparquet(&path, &spec).expect("base fixture");
    let file = File::open(&path).expect("open base");
    let b = ParquetRecordBatchReaderBuilder::try_new(file).expect("base reader");
    let geo = b
        .metadata()
        .file_metadata()
        .key_value_metadata()
        .and_then(|kv| kv.iter().find(|k| k.key == "geo"))
        .and_then(|k| k.value.clone())
        .expect("base geo key");
    println!(
        "BASE n={n} path={} bytes={} extent={:?} geo_len={}",
        norm(&path),
        facts.bytes,
        facts.extent,
        geo.len()
    );
    Base {
        path,
        extent: facts.extent,
        geo,
    }
}

fn add_v_arrow(base: &Base, kind: Kind, dst: &Path, stats: bool) -> Result<(), String> {
    let file = File::open(&base.path).map_err(|e| e.to_string())?;
    let b = ParquetRecordBatchReaderBuilder::try_new(file)
        .map_err(|e| e.to_string())?
        .with_batch_size(1024);
    let schema = b.schema().clone();
    let mut fields: Vec<Arc<Field>> = schema.fields().iter().cloned().collect();
    fields.push(Arc::new(Field::new("v", DataType::Int64, false)));
    let new_schema = Arc::new(Schema::new(fields));
    let reader = b.build().map_err(|e| e.to_string())?;
    let builder = WriterProperties::builder()
        .set_compression(Compression::SNAPPY)
        .set_max_row_group_row_count(Some(2048))
        .set_key_value_metadata(Some(vec![KeyValue::new(
            "geo".to_string(),
            base.geo.clone(),
        )]));
    let props = if stats {
        builder.build()
    } else {
        builder
            .set_statistics_enabled(EnabledStatistics::None)
            .build()
    };
    let out = File::create(dst).map_err(|e| e.to_string())?;
    let mut w =
        ArrowWriter::try_new(out, new_schema.clone(), Some(props)).map_err(|e| e.to_string())?;
    for batch in reader {
        let batch = batch.map_err(|e| e.to_string())?;
        let ids = batch
            .column_by_name("id")
            .ok_or("no id column")?
            .as_any()
            .downcast_ref::<UInt64Array>()
            .ok_or("id is not UInt64")?
            .clone();
        let v = Int64Array::from_iter_values((0..ids.len()).map(|i| v_of(kind, ids.value(i))));
        let mut cols = batch.columns().to_vec();
        cols.push(Arc::new(v));
        let nb = RecordBatch::try_new(new_schema.clone(), cols).map_err(|e| e.to_string())?;
        w.write(&nb).map_err(|e| e.to_string())?;
    }
    w.close().map_err(|e| e.to_string())?;
    Ok(())
}

fn add_v_duckdb(base: &Base, kind: Kind, dst: &Path) -> Result<(), String> {
    let conn = configured_connection().map_err(|e| e.to_string())?;
    conn.execute_batch("SET threads = 1;")
        .map_err(|e| e.to_string())?;
    conn.execute_batch("CREATE TABLE __v (id UBIGINT, v BIGINT)")
        .map_err(|e| e.to_string())?;
    {
        let mut app = conn.appender("__v").map_err(|e| e.to_string())?;
        for id in 0..rows_of(kind) as u64 {
            app.append_row(params![id, v_of(kind, id)])
                .map_err(|e| e.to_string())?;
        }
        app.flush().map_err(|e| e.to_string())?;
    }
    let sql = format!(
        "COPY (SELECT s.*, t.v FROM read_parquet('{b}') s JOIN __v t ON s.id = t.id ORDER BY s.id) \
         TO '{d}' (FORMAT PARQUET, COMPRESSION SNAPPY, ROW_GROUP_SIZE 2048, KV_METADATA {{geo: '{g}'}})",
        b = sq(&norm(&base.path)),
        d = sq(&norm(dst)),
        g = sq(&base.geo),
    );
    conn.execute_batch(&sql).map_err(|e| e.to_string())
}

#[derive(Clone, Debug)]
struct GroupStat {
    rg: i64,
    rows: i64,
    min: Option<String>,
    max: Option<String>,
    nulls: Option<String>,
}

fn parquet_groups(path: &str) -> Result<Vec<GroupStat>, String> {
    let conn = configured_connection().map_err(|e| e.to_string())?;
    let sql = "SELECT CAST(row_group_id AS BIGINT), CAST(row_group_num_rows AS BIGINT), \
               CAST(stats_min_value AS VARCHAR), CAST(stats_max_value AS VARCHAR), \
               CAST(stats_null_count AS VARCHAR) FROM parquet_metadata(?) \
               WHERE path_in_schema = 'v' ORDER BY row_group_id";
    let res: Result<Vec<GroupStat>, duckdb::Error> = (|| {
        let mut stmt = conn.prepare(sql)?;
        let rows = stmt.query_map([path], |r| {
            Ok(GroupStat {
                rg: r.get(0)?,
                rows: r.get(1)?,
                min: r.get(2)?,
                max: r.get(3)?,
                nulls: r.get(4)?,
            })
        })?;
        let out: Result<Vec<GroupStat>, duckdb::Error> = rows.collect();
        out
    })();
    match res {
        Ok(v) => Ok(v),
        Err(e) => {
            println!("PARQUET_METADATA-ERROR {e}; running DESCRIBE");
            if let Ok(mut st) = conn.prepare("DESCRIBE SELECT * FROM parquet_metadata(?)") {
                if let Ok(rows) = st.query_map([path], |r| r.get::<_, String>(0)) {
                    for r in rows.flatten() {
                        println!("PARQUET_METADATA-COLUMN {r}");
                    }
                }
            }
            Err(e.to_string())
        }
    }
}

fn readback(path: &str, kind: Kind) -> Result<(usize, usize), String> {
    let conn = configured_connection().map_err(|e| e.to_string())?;
    let n = rows_of(kind);
    let mut stmt = conn
        .prepare("SELECT id, v FROM read_parquet(?)")
        .map_err(|e| e.to_string())?;
    let rows = stmt
        .query_map([path], |r| Ok((r.get::<_, u64>(0)?, r.get::<_, i64>(1)?)))
        .map_err(|e| e.to_string())?;
    let (mut total, mut bad) = (0usize, 0usize);
    let mut seen = BTreeSet::new();
    for r in rows {
        let (id, v) = r.map_err(|e| e.to_string())?;
        total += 1;
        if id as usize >= n || v != v_of(kind, id) || !seen.insert(id) {
            bad += 1;
        }
    }
    bad += n.saturating_sub(seen.len()).min(n);
    Ok((total, bad))
}

struct FileInfo {
    name: String,
    kind: Kind,
    writer: Writer,
    path: PathBuf,
    spath: String,
    extent: [f64; 4],
    groups: Vec<GroupStat>,
    bytes: u64,
    ok: bool,
}

// ------------------------------------------------------------------------------------------------
// Admission and engine runs
// ------------------------------------------------------------------------------------------------

fn admit_text(ds: &Dataset, text: &str) -> Result<AdmittedPredicate, String> {
    match catch_unwind(AssertUnwindSafe(|| {
        AdmittedPredicate::admit(text.to_string(), ds)
    })) {
        Ok(Ok(p)) => Ok(p),
        Ok(Err(e)) => {
            let code = match &e {
                PredicateAdmitError::Filter(f) => code_of(f),
                PredicateAdmitError::ConnectionsExhausted { .. } => "connections_exhausted",
            };
            Err(format!("{code}: {e}"))
        }
        Err(p) => Err(format!("PANIC in admission: {}", panic_text(p))),
    }
}

#[derive(Clone, Copy, PartialEq, Eq)]
enum Shape {
    All,
    View,
}

fn shape_name(s: Shape) -> &'static str {
    match s {
        Shape::All => "all",
        Shape::View => "view",
    }
}

#[derive(Default, Clone)]
struct ERun {
    admission_err: Option<String>,
    refcols: Vec<String>,
    start_err: Option<String>,
    batches: Vec<String>,
    ids: Vec<u64>,
    terminal: Option<(String, String)>,
    plan: String,
    panic: Option<String>,
}

impl ERun {
    fn set(&self) -> BTreeSet<u64> {
        self.ids.iter().copied().collect()
    }
    fn completed(&self) -> bool {
        self.admission_err.is_none()
            && self.start_err.is_none()
            && self.terminal.is_none()
            && self.panic.is_none()
    }
    fn summary(&self) -> String {
        if let Some(e) = &self.admission_err {
            return format!("REFUSED[{e}]");
        }
        if let Some(e) = &self.start_err {
            return format!("START-ERR[{e}]");
        }
        if let Some(p) = &self.panic {
            return format!("PANIC[{p}]");
        }
        if let Some((d, _)) = &self.terminal {
            return format!("ERR[{d}]");
        }
        format!("n={}", self.set().len())
    }
}

fn engine_run_inner(ds: &Dataset, text: &str, shape: Shape, extent: [f64; 4], rows: usize) -> ERun {
    let mut run = ERun::default();
    let p = match admit_text(ds, text) {
        Ok(p) => p,
        Err(e) => {
            run.admission_err = Some(e);
            return run;
        }
    };
    run.refcols = p.referenced_columns().to_vec();
    let q = match shape {
        Shape::All => ViewportQuery::all(),
        Shape::View => ViewportQuery::viewport(
            Bbox {
                xmin: extent[0],
                ymin: extent[1],
                xmax: extent[2],
                ymax: extent[3],
            },
            ds.crs().identifier(),
        )
        .with_limit(rows as u64 + 1),
    }
    .with_filter(p);
    let mut stream = match ds.stream_with_cancel(&q, CancelToken::new()) {
        Ok(s) => s,
        Err(e) => {
            run.start_err = Some(format!("{e}"));
            return run;
        }
    };
    let mut buf = Vec::new();
    while let Some(info) = stream.next_into(&mut buf) {
        match info {
            Err(e) => {
                run.terminal = Some((format!("{e}"), format!("{e:?}")));
                break;
            }
            Ok(info) => {
                run.batches.push(format!(
                    "(idx={} rows={} payload_bytes={} cut_by={})",
                    info.batch_index,
                    info.rows,
                    info.payload_bytes,
                    info.cut_by.as_str()
                ));
                let reader =
                    arrow::ipc::reader::StreamReader::try_new(std::io::Cursor::new(&buf), None)
                        .expect("ipc");
                for batch in reader {
                    let batch = batch.expect("batch");
                    let col = batch.column_by_name("id").expect("id");
                    let col = col.as_any().downcast_ref::<UInt64Array>().expect("u64");
                    run.ids.extend((0..batch.num_rows()).map(|r| col.value(r)));
                }
                buf.clear();
            }
        }
    }
    run.plan = format!("{:?}", stream.filter_plan());
    run
}

fn engine_run(ds: &Dataset, text: &str, shape: Shape, extent: [f64; 4], rows: usize) -> ERun {
    match catch_unwind(AssertUnwindSafe(|| {
        engine_run_inner(ds, text, shape, extent, rows)
    })) {
        Ok(r) => r,
        Err(p) => ERun {
            panic: Some(panic_text(p)),
            ..Default::default()
        },
    }
}

struct Tally {
    condition_met: Vec<String>,
    runs: usize,
}

#[allow(clippy::too_many_arguments)]
fn report_run(
    tally: &mut Tally,
    file: &str,
    shape: Shape,
    pred: &Pred,
    rep: usize,
    run: &ERun,
    x: &BTreeSet<u64>,
    w: &Option<BTreeSet<u64>>,
) {
    tally.runs += 1;
    let mut line = format!(
        "ERUN file={file} shape={} pred={} rep={rep} sql_pred=[{}] ",
        shape_name(shape),
        pred.key,
        pred.text
    );
    if let Some(e) = &run.admission_err {
        println!("{line}admission=REFUSED {e}");
        return;
    }
    line += &format!("admission=Ok refcols={:?} ", run.refcols);
    if let Some(e) = &run.start_err {
        println!("{line}start=ERR {e}");
        return;
    }
    if let Some(p) = &run.panic {
        println!("{line}PANIC {p}");
        return;
    }
    line += &format!("batches=[{}] ", run.batches.join(" "));
    match &run.terminal {
        None => line += "terminal=ended-no-error ",
        Some((d, g)) => line += &format!("terminal=Some(Err) display=[{d}] debug=[{g}] "),
    }
    let set = run.set();
    let dup = run.ids.len() - set.len();
    line += &format!(
        "ids_n={} min={:?} max={:?} dup={} ",
        run.ids.len(),
        set.iter().next(),
        set.iter().next_back(),
        dup
    );
    let eq_x = &set == x;
    let eq_w = w.as_ref().map(|w| &set == w);
    line += &format!(
        "eq_X={} eq_W={} empty={} ",
        eq_x,
        match eq_w {
            Some(b) => b.to_string(),
            None => "n/a".to_string(),
        },
        set.is_empty()
    );
    if !eq_x {
        let (n, first) = first8_symdiff(&set, x);
        line += &format!("symdiff_vs_X={n} first8={first:?} ");
    }
    line += &format!("plan={}", run.plan);
    println!("{line}");
    if run.completed() && !eq_x {
        tally.condition_met.push(format!(
            "{file} shape={} pred={} rep={rep} delivered={} X={}",
            shape_name(shape),
            pred.key,
            set.len(),
            x.len()
        ));
    }
}

// ------------------------------------------------------------------------------------------------
// Independent connection
// ------------------------------------------------------------------------------------------------

fn cell_conn(setting: Option<&str>) -> Result<Connection, String> {
    let conn = configured_connection().map_err(|e| e.to_string())?;
    if let Some(s) = setting {
        conn.execute_batch(&format!("SET disabled_optimizers = '{s}'"))
            .map_err(|e| format!("SET disabled_optimizers = '{s}' refused: {e}"))?;
    }
    Ok(conn)
}

fn i_count(conn: &Connection, pred: &str, path: &str, literal: bool) -> Result<i64, String> {
    if literal {
        conn.query_row(
            &format!(
                "SELECT count(*) FROM read_parquet('{}') WHERE ({pred})",
                sq(path)
            ),
            [],
            |r| r.get::<_, i64>(0),
        )
        .map_err(|e| e.to_string())
    } else {
        conn.query_row(
            &format!("SELECT count(*) FROM read_parquet(?) WHERE ({pred})"),
            [path],
            |r| r.get::<_, i64>(0),
        )
        .map_err(|e| e.to_string())
    }
}

#[derive(Default, Clone)]
struct SOut {
    chunks: usize,
    ids: Vec<u64>,
    error: Option<String>,
    sql: String,
}

fn i_stream(conn: &Connection, geom: &str, pred: &str, path: &str) -> SOut {
    let sql = format!(
        "SELECT \"id\" AS \"id\", \"{geom}\" FROM read_parquet(?) WHERE ({pred})"
    );
    let mut out = SOut {
        sql: sql.clone(),
        ..Default::default()
    };
    let mut stmt = match conn.prepare(&sql) {
        Ok(s) => s,
        Err(e) => {
            out.error = Some(format!("prepare: {e}"));
            return out;
        }
    };
    let path_s = path.to_string();
    let ps: Vec<&dyn ToSql> = vec![&path_s];
    let mut arrow = match stmt.stream_arrow(ps.as_slice()) {
        Ok(a) => a,
        Err(e) => {
            out.error = Some(format!("execute: {e}"));
            return out;
        }
    };
    loop {
        match catch_unwind(AssertUnwindSafe(|| arrow.next())) {
            Ok(Some(chunk)) => {
                out.chunks += 1;
                let col = chunk.column(0);
                let col = col.as_any().downcast_ref::<UInt64Array>().expect("u64");
                out.ids.extend((0..chunk.num_rows()).map(|r| col.value(r)));
            }
            Ok(None) => break,
            Err(p) => {
                out.error = Some(format!("fetch panicked: {}", panic_text(p)));
                break;
            }
        }
    }
    out
}

fn value_text(v: &Value) -> String {
    format!("{v:?}")
}

/// I-product. Returns (error text if the query raised, rows seen, rows where x does not fit i64,
/// rows where p != x).
fn i_product(conn: &Connection, path: &str, kind: Kind, label: &str) {
    let sql = "SELECT id, v, v * v AS p FROM read_parquet(?)";
    let res: Result<Vec<(u64, i64, Value)>, String> = (|| {
        let mut stmt = conn.prepare(sql).map_err(|e| e.to_string())?;
        let rows = stmt
            .query_map([path], |r| {
                Ok((r.get::<_, u64>(0)?, r.get::<_, i64>(1)?, r.get::<_, Value>(2)?))
            })
            .map_err(|e| e.to_string())?;
        let mut v = Vec::new();
        for r in rows {
            v.push(r.map_err(|e| e.to_string())?);
        }
        Ok(v)
    })();
    match res {
        Err(e) => println!("IPRODUCT {label} sql=[{sql}] ERROR [{e}]"),
        Ok(rows) => {
            let (mut over, mut differ) = (0usize, 0usize);
            for (id, v, p) in &rows {
                let x = x_of(*v);
                let w = w_of(*v);
                let fits = x >= i64::MIN as i128 && x <= i64::MAX as i128;
                let p_i128 = match p {
                    Value::BigInt(b) => Some(*b as i128),
                    _ => None,
                };
                if p_i128 != Some(x) {
                    differ += 1;
                }
                if !fits {
                    over += 1;
                    println!(
                        "IPRODUCT-ROW {label} kind={} id={id} v={v} p_returned={} x={x} w={w}",
                        kind_name(kind),
                        value_text(p)
                    );
                }
            }
            println!(
                "IPRODUCT {label} sql=[{sql}] rows={} overflowing_rows={over} rows_where_p_ne_x={differ}",
                rows.len()
            );
        }
    }
}

fn explain(conn: &Connection, sql: &str) -> String {
    if let Err(e) = conn.execute_batch("SET explain_output = 'all'") {
        return format!("SET explain_output refused: {e}");
    }
    let r: Result<Vec<(String, String)>, duckdb::Error> = (|| {
        let mut stmt = conn.prepare(&format!("EXPLAIN {sql}"))?;
        let rows = stmt.query_map([], |r| Ok((r.get::<_, String>(0)?, r.get::<_, String>(1)?)))?;
        let out: Result<Vec<(String, String)>, duckdb::Error> = rows.collect();
        out
    })();
    match r {
        Ok(v) => v
            .iter()
            .map(|(k, t)| format!("--- {k} ---\n{t}"))
            .collect::<Vec<_>>()
            .join("\n"),
        Err(e) => format!("EXPLAIN error: {e}"),
    }
}

fn scalar_value(conn: &Connection, sql: &str) -> String {
    match conn.query_row(sql, [], |r| r.get::<_, Value>(0)) {
        Ok(v) => format!("value={}", value_text(&v)),
        Err(e) => format!("ERROR [{e}]"),
    }
}

// ------------------------------------------------------------------------------------------------
// The probe
// ------------------------------------------------------------------------------------------------

#[test]
fn o1_probe() {
    let out_dir = PathBuf::from(std::env::var("O1_OUT_DIR").expect("O1_OUT_DIR must be set"));
    std::fs::create_dir_all(&out_dir).expect("mkdir O1_OUT_DIR");
    println!("O1 PROBE out_dir={}", norm(&out_dir));

    // Versions.
    {
        let c = configured_connection().expect("conn");
        let r = c.query_row(
            "SELECT library_version, source_id FROM pragma_version()",
            [],
            |r| Ok((r.get::<_, String>(0)?, r.get::<_, String>(1)?)),
        );
        println!("VERSIONS pragma_version() = {r:?}");
    }

    // ---- Step 1: fixtures --------------------------------------------------------------------
    let b2048 = make_base(&out_dir, 2048);
    let b4096 = make_base(&out_dir, 4096);
    let b6 = make_base(&out_dir, 6);
    let b3 = make_base(&out_dir, 3);

    let mut specs: Vec<(Kind, Writer)> = Vec::new();
    for k in [Kind::A, Kind::B, Kind::B3] {
        for w in [Writer::ArS, Writer::ArN, Writer::Dk] {
            specs.push((k, w));
        }
    }
    specs.push((Kind::S, Writer::ArN));
    specs.push((Kind::R, Writer::ArN));

    let mut files: Vec<FileInfo> = Vec::new();
    let mut datasets: Vec<Option<Dataset>> = Vec::new();
    for (kind, writer) in specs {
        let name = format!("{}-{}", kind_name(kind), writer_name(writer));
        let base = match kind {
            Kind::A | Kind::B => &b2048,
            Kind::B3 => &b4096,
            Kind::S => &b6,
            Kind::R => &b3,
        };
        let path = out_dir.join(format!("{name}.parquet"));
        let spath = norm(&path);
        let wr = match writer {
            Writer::ArS => add_v_arrow(base, kind, &path, true),
            Writer::ArN => add_v_arrow(base, kind, &path, false),
            Writer::Dk => add_v_duckdb(base, kind, &path),
        };
        let mut fi = FileInfo {
            name: name.clone(),
            kind,
            writer,
            path: path.clone(),
            spath: spath.clone(),
            extent: base.extent,
            groups: vec![],
            bytes: 0,
            ok: false,
        };
        let mut why: Vec<String> = Vec::new();
        if let Err(e) = wr {
            why.push(format!("write failed: {e}"));
        } else {
            fi.bytes = std::fs::metadata(&path).map(|m| m.len()).unwrap_or(0);
            // check 1
            match parquet_groups(&spath) {
                Err(e) => why.push(format!("parquet_metadata: {e}")),
                Ok(g) => {
                    fi.groups = g;
                    let exp = expected_groups(kind);
                    let got: Vec<i64> = fi.groups.iter().map(|g| g.rows).collect();
                    if got != exp {
                        why.push(format!("layout {got:?} != declared {exp:?}"));
                    }
                    let want_stats = writer != Writer::ArN;
                    for g in &fi.groups {
                        let has = g.min.is_some() && g.max.is_some();
                        if has != want_stats {
                            why.push(format!(
                                "statistics presence in rg {}: have={has}, declared={want_stats}",
                                g.rg
                            ));
                        }
                    }
                }
            }
            // check 2
            match readback(&spath, kind) {
                Err(e) => why.push(format!("readback: {e}")),
                Ok((rows, bad)) => {
                    println!("READBACK {name} rows={rows} mismatches={bad}");
                    if bad != 0 || rows != rows_of(kind) {
                        why.push(format!("readback rows={rows} mismatches={bad}"));
                    }
                }
            }
        }
        // check 3
        let mut ds = None;
        if why.is_empty() {
            match Dataset::open(&path) {
                Ok(d) => {
                    let vt = d
                        .file_schema()
                        .field_with_name("v")
                        .map(|f| format!("{:?}", f.data_type()))
                        .unwrap_or_else(|e| format!("no v: {e}"));
                    println!("OPEN {name} Ok v_type={vt}");
                    if vt != "Int64" {
                        why.push(format!("file_schema v is {vt}"));
                    }
                    ds = Some(d);
                }
                Err(e) => {
                    println!("OPEN {name} Err {e}");
                    why.push(format!("Dataset::open: {e}"));
                }
            }
        }
        let stats_line = fi
            .groups
            .iter()
            .map(|g| {
                format!(
                    "rg{}(rows={} min={:?} max={:?} nulls={:?})",
                    g.rg, g.rows, g.min, g.max, g.nulls
                )
            })
            .collect::<Vec<_>>()
            .join(" ");
        println!(
            "FILE {name} writer={} kind={} rows={} bytes={} groups={} v_stats=[{stats_line}] checks={}",
            writer_name(writer),
            kind_name(kind),
            rows_of(kind),
            fi.bytes,
            fi.groups.len(),
            if why.is_empty() {
                "PASS".to_string()
            } else {
                format!("FAIL {why:?}")
            }
        );
        if why.is_empty() {
            fi.ok = true;
        } else {
            println!("ARM-STOPPED {name}: {why:?}");
        }
        files.push(fi);
        datasets.push(ds);
    }

    // ---- i128 counts beside the hand table -------------------------------------------------------
    for kind in [Kind::A, Kind::B, Kind::B3, Kind::S, Kind::R] {
        for p in [P1, P2, P3] {
            let (x, w) = model_sets(kind, p.key);
            let w = w.unwrap();
            let h = hand(kind, p.key);
            let agree = h.map(|(hx, hw)| hx == x.len() && hw == w.len());
            println!(
                "I128 kind={} pred={} X_n={} X_ids={} W_n={} W_ids={} hand(X,W)={:?} agree={:?}",
                kind_name(kind),
                p.key,
                x.len(),
                fmt_ids(&x),
                w.len(),
                fmt_ids(&w),
                h,
                agree
            );
        }
    }

    let mut tally = Tally {
        condition_met: Vec::new(),
        runs: 0,
    };
    let mut stop: Option<String> = None;
    // (file, shape, pred, rep) -> run
    let mut runs: BTreeMap<(String, &'static str, &'static str, usize), ERun> = BTreeMap::new();

    // ---- Step 2: engine runs ---------------------------------------------------------------------
    'step2: for (i, fi) in files.iter().enumerate() {
        if !fi.ok {
            continue;
        }
        let ds = datasets[i].as_ref().unwrap();
        let preds: Vec<Pred> = match fi.kind {
            Kind::S | Kind::R => vec![P1, P2],
            _ => vec![P1, P2, P3],
        };
        for p in &preds {
            match admit_text(ds, p.text) {
                Ok(a) => println!(
                    "ADMIT file={} pred={} Ok referenced_columns={:?} sql_text=[{}]",
                    fi.name,
                    p.key,
                    a.referenced_columns(),
                    a.sql_text()
                ),
                Err(e) => {
                    println!("ADMIT file={} pred={} REFUSED {e}", fi.name, p.key);
                    stop = Some(format!(
                        "stop rule 1: {} refused on {}: {e}",
                        p.key, fi.name
                    ));
                    break 'step2;
                }
            }
            let (x, w) = model_sets(fi.kind, p.key);
            for shape in [Shape::All, Shape::View] {
                for rep in 1..=2usize {
                    let run = engine_run(ds, p.text, shape, fi.extent, rows_of(fi.kind));
                    report_run(&mut tally, &fi.name, shape, p, rep, &run, &x, &w);
                    runs.insert((fi.name.clone(), shape_name(shape), p.key, rep), run);
                }
            }
        }
        if fi.name == "A-ar-s" || fi.name == "B-ar-s" {
            for (cname, ctext) in [("C1", "v * v"), ("C2", "v * 1.5 > 0")] {
                match admit_text(ds, ctext) {
                    Err(e) => println!("CONTROL file={} {cname} [{ctext}] REFUSED {e}", fi.name),
                    Ok(a) => {
                        println!(
                            "CONTROL file={} {cname} [{ctext}] ADMITTED sql_text=[{}]",
                            fi.name,
                            a.sql_text()
                        );
                        stop = Some(format!(
                            "OPEN-2 (a): control {cname} admitted on {}",
                            fi.name
                        ));
                        break 'step2;
                    }
                }
            }
        }
    }
    if let Some(s) = &stop {
        println!("STOP {s}");
        println!(
            "TALLY engine_runs={} condition_met={} {:?}",
            tally.runs,
            tally.condition_met.len(),
            tally.condition_met
        );
        return;
    }

    // rep consistency
    for ((f, s, p, rep), r) in &runs {
        if *rep == 2 {
            if let Some(r1) = runs.get(&(f.clone(), *s, *p, 1)) {
                if r1.set() != r.set() || r1.summary() != r.summary() {
                    println!(
                        "REP-DIFFER file={f} shape={s} pred={p}: rep1={} rep2={}",
                        r1.summary(),
                        r.summary()
                    );
                }
            }
        }
    }

    // ---- Step 3: independent counts ------------------------------------------------------------
    let mut icount: BTreeMap<(String, &'static str), Result<i64, String>> = BTreeMap::new();
    let mut istream: BTreeMap<(String, &'static str), SOut> = BTreeMap::new();
    for (i, fi) in files.iter().enumerate() {
        if !fi.ok || !matches!(fi.kind, Kind::A | Kind::B | Kind::B3) {
            continue;
        }
        let ds = datasets[i].as_ref().unwrap();
        let geom = ds.geometry_column().to_string();
        for p in [P1, P2, P3] {
            let conn = cell_conn(None).expect("cell D");
            let r = i_count(&conn, p.text, &fi.spath, false);
            println!(
                "ICOUNT cell=D file={} pred={} path=bound sql=[SELECT count(*) FROM read_parquet(?) WHERE ({})] -> {:?}",
                fi.name, p.key, p.text, r
            );
            if p.key == "P1" {
                let conn = cell_conn(None).expect("cell D");
                let r2 = i_count(&conn, p.text, &fi.spath, true);
                println!(
                    "ICOUNT cell=D file={} pred={} path=literal sql=[SELECT count(*) FROM read_parquet('<path>') WHERE ({})] -> {:?}",
                    fi.name, p.key, p.text, r2
                );
            }
            icount.insert((fi.name.clone(), p.key), r);
            let conn = cell_conn(None).expect("cell D");
            let s = i_stream(&conn, &geom, p.text, &fi.spath);
            println!(
                "ISTREAM cell=D file={} pred={} sql=[{}] chunks={} ids_n={} error={:?}",
                fi.name,
                p.key,
                s.sql,
                s.chunks,
                s.ids.len(),
                s.error
            );
            istream.insert((fi.name.clone(), p.key), s);
        }
        let conn = cell_conn(None).expect("cell D");
        i_product(&conn, &fi.spath, fi.kind, &format!("cell=D file={}", fi.name));
    }

    // The comparison table.
    for fi in files.iter() {
        if !fi.ok || !matches!(fi.kind, Kind::A | Kind::B | Kind::B3) {
            continue;
        }
        for p in [P1, P2, P3] {
            let (x, w) = model_sets(fi.kind, p.key);
            let w = w.unwrap();
            let all = runs.get(&(fi.name.clone(), "all", p.key, 1)).unwrap();
            let view = runs.get(&(fi.name.clone(), "view", p.key, 1)).unwrap();
            let ic = icount.get(&(fi.name.clone(), p.key)).unwrap();
            let is = istream.get(&(fi.name.clone(), p.key)).unwrap();
            let ic_s = match ic {
                Ok(n) => format!("n={n}"),
                Err(e) => format!("ERR[{e}]"),
            };
            let is_s = match &is.error {
                None => format!("n={}", is.ids.len()),
                Some(e) => format!("ERR[{e}] (ids before error {})", is.ids.len()),
            };
            println!(
                "CMP file={} pred={} | engine(all)={} | engine(view)={} | I-count={} | I-stream={} | X={} | W={}",
                fi.name,
                p.key,
                all.summary(),
                view.summary(),
                ic_s,
                is_s,
                x.len(),
                w.len()
            );
            let xs = format!("n={}", x.len());
            let uniform = [
                all.summary(),
                view.summary(),
                ic_s.clone(),
                is_s.clone(),
                xs.clone(),
                format!("n={}", w.len()),
            ]
            .iter()
            .all(|s| *s == xs);
            if !uniform {
                for (lbl, set, done) in [
                    ("engine(all)", all.set(), all.completed()),
                    ("engine(view)", view.set(), view.completed()),
                    (
                        "I-stream",
                        is.ids.iter().copied().collect::<BTreeSet<u64>>(),
                        is.error.is_none(),
                    ),
                ] {
                    if done {
                        let (n, first) = first8_symdiff(&set, &x);
                        println!(
                            "CMP-DIFF file={} pred={} {lbl}: symdiff_vs_X={n} first8={first:?}",
                            fi.name, p.key
                        );
                    }
                }
            }
        }
    }

    // ---- Step 4.1: statistics as written ---------------------------------------------------------
    for fi in files.iter() {
        let s = fi
            .groups
            .iter()
            .map(|g| {
                format!(
                    "rg{}(rows={} min={:?} max={:?} nulls={:?})",
                    g.rg, g.rows, g.min, g.max, g.nulls
                )
            })
            .collect::<Vec<_>>()
            .join(" ");
        println!("STATS4.1 file={} {s}", fi.name);
    }

    // ---- Step 4.2: planner-statistics switches --------------------------------------------------
    let cells: [(&str, Option<&str>); 4] = [
        ("D", None),
        ("SP", Some("statistics_propagation")),
        ("FP", Some("filter_pushdown")),
        ("SPFP", Some("statistics_propagation,filter_pushdown")),
    ];
    for fi in files.iter() {
        if !fi.ok || !matches!(fi.kind, Kind::A | Kind::B | Kind::B3) {
            continue;
        }
        for (cell, setting) in cells {
            let conn = match cell_conn(setting) {
                Ok(c) => c,
                Err(e) => {
                    println!("CELL-REFUSED cell={cell} file={} {e}", fi.name);
                    continue;
                }
            };
            if cell != "D" {
                for p in [P1, P2, P3] {
                    println!(
                        "ICOUNT cell={cell} file={} pred={} path=bound -> {:?}",
                        fi.name,
                        p.key,
                        i_count(&conn, p.text, &fi.spath, false)
                    );
                }
                i_product(
                    &conn,
                    &fi.spath,
                    fi.kind,
                    &format!("cell={cell} file={}", fi.name),
                );
            }
            let esql = format!(
                "SELECT count(*) FROM read_parquet('{}') WHERE ({})",
                sq(&fi.spath),
                P1.text
            );
            println!(
                "EXPLAIN-BEGIN cell={cell} file={} sql=[{esql}]\n{}\nEXPLAIN-END cell={cell} file={}",
                fi.name,
                explain(&conn, &esql),
                fi.name
            );
        }
    }

    // ---- Step 4.5: the operator by magnitude (S and R), independent ---------------------------
    for fi in files.iter() {
        if !fi.ok || !matches!(fi.kind, Kind::S | Kind::R) {
            continue;
        }
        for (cell, setting) in [("D", None), ("SP", Some("statistics_propagation"))] {
            let conn = match cell_conn(setting) {
                Ok(c) => c,
                Err(e) => {
                    println!("CELL-REFUSED cell={cell} file={} {e}", fi.name);
                    continue;
                }
            };
            for k in 0..rows_of(fi.kind) {
                let sql = format!("SELECT v * v AS p FROM read_parquet(?) WHERE id = {k}");
                let r = match conn.query_row(&sql, [fi.spath.as_str()], |r| r.get::<_, Value>(0)) {
                    Ok(v) => format!("value={}", value_text(&v)),
                    Err(e) => format!("ERROR [{e}]"),
                };
                let v = v_of(fi.kind, k as u64);
                println!(
                    "S45 cell={cell} file={} k={k} v={v} sql=[{sql}] -> {r} (x={} w={})",
                    fi.name,
                    x_of(v),
                    w_of(v)
                );
            }
        }
    }

    // ---- Step 4.7: literal-only constant folding, last, on B-ar-s -------------------------------
    if let Some(i) = files.iter().position(|f| f.name == "B-ar-s" && f.ok) {
        let fi = &files[i];
        let ds = datasets[i].as_ref().unwrap();
        for p in [L1, L2, L3] {
            let (x, w) = model_sets(fi.kind, p.key);
            match admit_text(ds, p.text) {
                Ok(a) => println!(
                    "ADMIT file={} pred={} Ok referenced_columns={:?} sql_text=[{}]",
                    fi.name,
                    p.key,
                    a.referenced_columns(),
                    a.sql_text()
                ),
                Err(e) => println!("ADMIT file={} pred={} REFUSED {e}", fi.name, p.key),
            }
            for shape in [Shape::All, Shape::View] {
                for rep in 1..=2usize {
                    let run = engine_run(ds, p.text, shape, fi.extent, rows_of(fi.kind));
                    report_run(&mut tally, &fi.name, shape, &p, rep, &run, &x, &w);
                }
            }
        }
        for (cell, setting) in [
            ("D", None),
            ("SP", Some("statistics_propagation")),
            ("ER", Some("expression_rewriter")),
        ] {
            let conn = match cell_conn(setting) {
                Ok(c) => c,
                Err(e) => {
                    println!("CELL-REFUSED cell={cell} {e}");
                    continue;
                }
            };
            for sql in [
                "SELECT 4000000000 * 4000000000 AS p",
                "SELECT 3037000500 * 3037000500 AS p",
                "SELECT 4294967296 * 4294967296 AS p",
            ] {
                println!(
                    "L47 cell={cell} sql=[{sql}] -> {}",
                    scalar_value(&conn, sql)
                );
            }
        }
    }

    println!(
        "TALLY engine_runs={} runs_meeting_design_conditions(admitted, no Some(Err), id set != X)={} {:?}",
        tally.runs,
        tally.condition_met.len(),
        tally.condition_met
    );
    println!("O1 PROBE DONE");
}
```
