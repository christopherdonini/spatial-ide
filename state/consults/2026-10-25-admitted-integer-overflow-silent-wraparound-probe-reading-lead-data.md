*Custodian's filing note (2026-10-25): lead-data's read-only reading of the O1 probe's results (`state/consults/2026-10-25-admitted-integer-overflow-silent-wraparound-probe-run-tester-high-report.md`), at main 6d6fa23a, by the human's ruling (`state/directives/2026-10-25-filler-entry-5-open-1-a-pr-b-open-1-2-3-a-o1-probe-lead-data-designs-tester-high-runs.md`, item 3); it grades nothing, and the human grades the node on it. Its first hand-back in the same transcript is the probe's design, filed as `state/consults/2026-10-25-admitted-integer-overflow-silent-wraparound-probe-design-lead-data-draft.md` (sha256 from line 5 cb09fc3857d1ffc445aad478478202fafe1deea61ee97453f10fc7b0e2626d35). Two notes of the custodian's: the run was dispatched as the tester-high agent (the tester's definition at high effort), which answers the reading's who-ran-it point; and its cites to the probe file write C:/wt/o1-probe (1 place(s)) for the checkout C:/dev/wt/o1-probe, kept as written. The reading's run 18:20:01Z to 18:23:58Z by its transcript (Read 6, Grep 16; no write tool). Extracted by script from its second SubagentHandback call, with one final newline added; nothing else is changed. Its sha256, from line 5 to the end, is 29be5cb25790568f8e4df4a63eca97240465f20e9eb13ad2ab24c681ceafcfbc.*

---

Read: admitted-integer-overflow-silent-wraparound, the O1 probe's results, at main 6d6fa23a

*Wording: everything here is mine, except text in double quotation marks, which is byte-copied from the line cited beside it. Repository cites are `path:line @ 6d6fa23a`, read in the main checkout, whose `.git/refs/heads/main` reads 6d6fa23af9c8d000c18fb9ea635b17ee5c733d2c. "Report" means `state/consults/2026-10-25-admitted-integer-overflow-silent-wraparound-probe-run-tester-high-report.md`. The logs and the probe file are cited by path and line; a probe-file line is the report appendix's line minus 544. I have no shell, so this reading carries no sha256. I grade nothing.*

## 1. The grading question, as facts

The three conditions are my design's: admission Ok, no `Some(Err)` at the end, and a delivered id set that differs from X. The probe applies them at `C:/wt/o1-probe/engine/tests/o1_probe.rs:671`, using `completed()` at `:506-511`. X is exact i128 arithmetic (`:89-91`).

| run class (×4 runs: 2 shapes × 2 reps) | admission | end | delivered vs X | conditions hold |
|---|---|---|---|---|
| A, all 3 writers, `v * v > 0` | Ok | no error | 1,023 vs 2,047 | yes |
| A, all 3 writers, `v * v < 0` | Ok | no error | 1,024 vs 0 | yes |
| B-ar-s, B-dk, `v * v > 0` | Ok | no error | 0 vs 2,047 | yes |
| B-ar-n, `v * v > 0` | Ok | no error | 2,046 vs 2,047 | yes |
| B, all 3 writers, `v * v < 0` | Ok | no error | 1 (id 2047) vs 0 | yes |
| B3-ar-s, B3-dk, `v * v > 0` | Ok | no error | 0 vs 4,094 | yes |
| B3-ar-n, `v * v > 0` | Ok | no error | 4,093 vs 4,094 | yes |
| B3, all 3 writers, `v * v < 0` | Ok | no error | 1 (id 4095) vs 0 | yes |
| S, `v * v > 0` / `v * v < 0` | Ok | no error | 2 vs 6 / 4 vs 0 | yes |
| L1 `4000000000 * 4000000000 > 0` (B-ar-s) | Ok, no columns | no error | 0 vs 2,048 | yes |
| L2 `4000000000 * 4000000000 < 0` (B-ar-s) | Ok, no columns | no error | 2,048 vs 0 | yes |
| P3 `(v * v) IS NOT NULL`, all files | Ok | no error | equals X | no (the third fails) |
| L3 `4294967296 * 4294967296 > 0` | Ok | no error | equals X | no (the third fails) |
| R, P1 and P2 | Ok | the fixed detail | none delivered | no (the second fails) |

- **Sources for the table.** Report lines 97-115 and 117-123. In the logs, `D:/wt-targets/o1-probe/o1-data/run1.log`: lines 76, 81, 93, 98, 121, 126, 138, 143, 155, 160, 170, 175, 185, 190, 213, 218, 228, 15485, 15490, 15495.
- **The tally.** In both processes, `TALLY engine_runs=136 runs_meeting_design_conditions(admitted, no Some(Err), id set != X)=88` (`run1.log:15508`, `run2.log:15508`).
- **Repeatability.** The two shapes agree, the two reps agree, and the two processes' `ERUN` lines are byte-identical (report lines 85-89).
- **The view shape** is T1's (`engine/tests/admission_property_campaign.rs:1469-1486 @ 6d6fa23a`).
- **The refusal path is live.** The controls were refused with their codes: C1 `skp.filter_not_boolean`, C2 `skp.filter_type_not_admitted` (`run1.log:88-89`, `:135-136`).

**Plainly:** yes. The report shows predicates the engine admits returning the wrong rows with no error, in 88 of 136 runs, across 22 (file, predicate) cells. The grade is the human's.

**A side note for the custodian.** The PLAN summary says every admitted P1 and P2 run ended with no error (`PLAN.yaml:3458 @ 6d6fa23a`). The R runs of P1 and P2 ended in the fixed detail (`run1.log:228`). The same sentence's later clause, about operands at or above 2^32, covers them.

## 2. The mechanism, against the models

**4.6, the source.** I read it first because it governs everything else; the text is quoted at report lines 368-442.
- Under `#if (__GNUC__ >= 5) || defined(__clang__)` the int64 multiply uses `__builtin_mul_overflow`. The `#else` path splits each operand's magnitude at bit 32 and only checks when exactly one side has high bits.
- When both high halves are zero it goes straight to "result = left * right;" (report line 439). So a product of two magnitudes below 2^32 that exceeds i64::MAX is never caught there.
- The build target is `x86_64-pc-windows-msvc` (report line 22). The package's build script has an MSVC branch (report line 363).
- The tester did not inspect which macros were defined (report line 364). That the `#else` branch is the one compiled is my inference, from the target together with the behaviour below.

**4.5, per k: the operator alone.** Files without statistics, cells D and SP alike (`run1.log:15466-15483`):
- S k=2 to 5 (3,037,000,500, −3,037,000,500, 4,000,000,000, 4,294,967,295) returned exactly the wrapped value w, with no error.
- S k=1 (3,037,000,499), whose product fits, was exact.
- R k=1 (2^32) and k=2 (3.6e18) raised `Out of Range Error`.

This is H-MSVC's signature, point for point (my reading). It rules out H-STATS as the whole explanation: with no statistics and statistics propagation disabled, the operator itself wraps.

**4.2, the switch cells** (report lines 177-189; `run1.log:3355-3356`, `:14621` for B3-ar-s P1):
- **W** holds wherever no planner fold happens:
  - every file without statistics, in every cell;
  - A in every writer and every cell;
  - B and B3 with statistics, under SP and SPFP (2,046 / 4,093).
  - I-product: p = w on every overflowing row, 0 exceptions in 12,312 lines (report line 164).
- **F** holds on B-ar-s, B-dk, B3-ar-s and B3-dk in cells D and FP: 0 rows, and `EMPTY_RESULT` in the optimised logical plan (report lines 196, 227-258). Disabling `statistics_propagation` removes it; disabling `filter_pushdown` does not. So the fold is the planner's statistics propagation, not the scan.
  - My reading of the quoted source: `MultiplyPropagateStatistics` multiplies the four min/max combinations with the same `TryMultiplyOperator` (report lines 466-469 and 500-504). The wrapped extremes therefore report no overflow.
  - The function is then swapped for the non-checking one (report lines 490-497), and the comparison is folded on the wrapped range.
  - F is H-MSVC working through the statistics path, not a separate defect. I did not read the comparison-folding code.
- **G** was not observed. B3 with statistics under SP gave 4,093, not 2,047: no row-group pruning on the expression filter in this build.
- **E** holds only at magnitudes of 2^32 and above: R, and S45 R k=1,2.
- **X** holds for no overflowing case.
- A shows no fold, as predicted: its statistics give a mixed-sign wrapped range.

**4.7, literals** (`run1.log:15484-15507`):
- L1 and L2 wrapped through the engine (0 and 2,048 rows). Standalone, `SELECT 4000000000 * 4000000000` gives the wrapped value in D, SP and ER alike.
- L3 is open, and it is unexplained:
  - through the engine, `4294967296 * 4294967296 > 0` delivered all 2,048 rows with no error, which equals X;
  - standalone, `SELECT 4294967296 * 4294967296` raises in all three cells.
  - My guess, untested: inside a comparison, DuckDB re-types an overflowing literal product, but only when the check reports an overflow. That would also explain why L1 (an overflow the check misses) stays BIGINT and wraps.
  - If so, the engine's type walk, which types it BIGINT (`engine/src/predicate.rs:1644-1681 @ 6d6fa23a`), would disagree with the binder for L3. That would be in B-T1's territory (`engine/src/predicate.rs:3221 @ 6d6fa23a`).

**Summary of the models** (my inference):
- Supported: H-MSVC, with W per row and F through statistics.
- Ruled out: H-STATS as the sole cause, and G for this build.
- Open: L3.

**A second hole, inferred from the quoted text only and never run.** The one-sided branches test `high_bits & 0xffffff80000000` (report lines 416 and 429). That mask covers bits 31 to 55 and not 56 to 63. My arithmetic: for 2^28 × 2^60, `high_bits` is exactly 2^56, the mask reads 0, and the product 2^88 wraps to 0 with no error. If that holds, an i64 value at or above 2^32 times a smaller operand can also wrap silently.

## 3. What it means for the engine (my reading)

**Which admitted classes it reaches.**
- **The int64 operator.** It applies to any admitted `*` whose type is BIGINT.
  - The type walk admits integer `*` integer by rule 3 (`engine/src/predicate.rs:2078-2079 @ 6d6fa23a`), with the result type from `fold_or_promote_integer` and `int_promote` (`:1644-1681`).
  - The overflows the observed hole can produce need both operands' magnitudes in [about 3.04e9, 2^32). That reaches:
    - `i64 * i64` (the same column or two columns);
    - `i64 * u32` and `u32 * <BIGINT literal>`;
    - BIGINT literal × literal (L1 and L2: column-free, wrong across the whole file);
    - nested BIGINT-typed products.
  - `i64 * i32` and `i32 * u32` cannot reach it, since their products stay below 2^63.
  - The inferred one-sided hole would widen this to i64 values at or above 2^32 times smaller operands.
  - UBIGINT, HUGEINT and INTEGER multiplies are separate specialisations I have not read.
  - `+`, `-` and unary `-` were not tested.
- **The statistics fold makes it worse.** One overflowing row's statistics can fold the whole filter to empty. The probe lost every correct row of B and B3 (2,046 and 4,093 correct rows not returned) on both writers' default files.
- **Both engine shapes are reached.** The kernel's SKP path was not run; its reach is by reading only.
- **The campaign cannot see it.** Its count oracle evaluates the same composition on the same DuckDB (`engine/tests/admission_property_campaign.rs:942-963 @ 6d6fa23a`), and here the independent connection agreed with the engine in every row (report line 134). Its exclusion keys on the fixed text (`:1031-1040`). T1 passes only because its `i64` values span the full 64-bit range.

**What it does to B-1 point 4.** The node records that this direction assumes the overflow ends the stream in error (`PLAN.yaml:3458 @ 6d6fa23a`). FILTER-BIND §2.5(d) routes the class on that footing (`engine/FILTER-BIND-COERCIONS-PREREGISTRATION.md:97 @ 6d6fa23a`). On this build the assumption holds only for operand magnitudes at or above 2^32. Below that, the class completes silently, or folds to an empty result. ADR-021 left integer overflow undecided: "An integer overflow in `+`, `-`, `*` or unary `-` involves no conversion and is not decided here." (`docs/adr/ADR-021-row-filter-on-viewport-query.md:265 @ 6d6fa23a`).

**Red lines a resolution would touch,** named only, none designed. Each is a question for the custodian and the human:
- an ADR-021 Note changing what admission admits;
- a dependency or build change: the `duckdb`/`libduckdb-sys` version, how the bundled DuckDB is compiled, a patch to vendored source, or optimiser settings added to the product's connection configuration (`engine/src/pool.rs:185-187 @ 6d6fa23a`);
- a predicate rewrite, against ADR-021's verbatim composition (`engine/src/stream.rs:1447-1452 @ 6d6fa23a`);
- a declared limitation, an altered guarantee; KNOWN-LIMITATIONS has no overflow item today (0 matches);
- any loosening of the campaign, which the human has excluded.

## 4. What I would not accept as evidence, and what is still unrun

**Accepted, with the caveats noted:**
- **The branch inference.** Which preprocessor branch compiled is inferred from the target and the behaviour, not observed. It is strong, but it is inference.
- **The independent connection** is the same DuckDB build. It corroborates the engine's composition, not the arithmetic; the i128 computation is the oracle for that.
- **The shared cargo target.** It was `D:/wt-targets/sefd`, not a new folder (report line 1). Three `libduckdb-sys` build directories exist there, with byte-identical `multiply.cpp`/`arithmetic.cpp` (report line 361). The probe reported `v1.5.5`, `d8cdaa33fd` (report line 25). Which one was linked is not stated.
  - A stale engine library from another worktree cannot be excluded by the report.
  - The grading facts rest on DuckDB's evaluation and on admission. #255's diff did not touch admission (the gate report's check 1). The fixed-detail text matches `engine/src/stream.rs:2602 @ 6d6fa23a`. So I accept the figures.
- **Who ran it.** The tester reports itself as running the `tester.md` role at high effort (report line 525), where the ruling named a tester-high. That is the custodian's dispatch record to confirm, not a defect in the figures.

**Nothing I would refuse.**

**Unrun:** nothing the S1 question itself needs; the condition is shown. Still unrun, for scope and for any resolution:
- the one-sided mask hole (for example `SELECT 268435456 * 1152921504606846976`);
- two-column `a * b`, and `u32 * <BIGINT literal>`;
- the UBIGINT, HUGEINT and INTEGER multiplies, and `+`, `-` and unary `-`;
- P3 on R;
- L3's typing (an EXPLAIN or plan read of its return type);
- the kernel's SKP `viewport_query` end to end;
- a GCC or Clang build (by this reading, macOS and Linux builds would take the builtin path; unverified);
- the `i64 * C` completion noted at `engine/tests/admission_property_campaign.rs:1455-1456 @ 6d6fa23a`.

## What I could not settle

- L3's mechanism.
- Whether the one-sided hole is real in behaviour.
- Which macros the compiler defined.
- The comparison-folding code path behind `EMPTY_RESULT` (not read).
- The reach of the other integer specialisations and of `+` and `-`.
- Which of the three build directories was linked.
- Owner's index: no change, since nothing was committed.

---
Blocking questions: none.
Report path: C:/dev/spatial-ide/state/consults/2026-10-25-admitted-integer-overflow-silent-wraparound-probe-reading-lead-data.md
sha256: not computed (I have no shell).
