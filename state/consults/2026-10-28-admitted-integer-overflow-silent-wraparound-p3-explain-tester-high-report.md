*Custodian's filing note (2026-10-28): the tester-high's one EXPLAIN of P3 over one statistics file, as the human's ruling of 2026-10-28 orders (`state/directives/2026-10-28-o1-p3-accepted-one-explain-6b-takes-s-from-6d-262-stands-8a-goes-ahead.md`, item 1), in the throwaway checkout C:/dev/wt/o1-clang on its own target; nothing committed. The optimised plans hold no FILTER, no Parquet scan and no expression over v: the IS NOT NULL folded, no multiply evaluated, as the human's account says; so OPEN-4 (A) is not reached. Disclosed: the connection ran the probe's own SET explain_output = 'all' before the one EXPLAIN. The custodian's check: the transcript shows one cargo call, inside a shared hold, no git write, and one write, the throwaway test file, removed (the checkout's porcelain back to its two untracked files). The session scratch folder's path, 2 place(s), is written as <the session scratch folder>. The run 09:44:01Z to 09:46:18Z by its transcript (Bash 8, Read 6, Grep 8, Write 1). Extracted by script from its SubagentHandback call, with one final newline added and the path written as stated; nothing else is changed. Its sha256, from line 5 to the end, is 215bf85b891051c89aedbcc31c0cb03e30d308e465dd36f3bb83e4686b0cd233.*

---

EXPLAIN: admitted-integer-overflow-silent-wraparound P3 on A-ar-s

Model as the harness reports it: Sonnet 5.5, model ID claude-sonnet-5-5, the tester role at high effort. No override, no context handoff. I committed, staged and pushed nothing, and wrote no report file. Brief sha256 shown by command: 5a126dd755fac642804d632c9d5648d2ac144194138d527babe9b3766a0713fb (matches). The ruling's sha256 shown by command and matches: 0a1631df8c452882407f38713fab228d01c10784a20a2e4bf26269268c65d91e.

## Reading in one line
The plan shows the IS NOT NULL folded, with no multiply evaluated. The optimised plan contains no FILTER, no READ_PARQUET and no expression over `v`. DuckDB answered the whole query as a constant row. This matches the human's account. Nothing here is graded.

## The statistics file
`D:/wt-targets/o1-clang-data/attempt-2/run1/A-ar-s.parquet`: 815802 bytes, sha256 eec0e4f766a752edf18bf6084a8a80bb74e9408d95e38fb016efef0a8318d819. The size was non-zero, and the same size was read again at the end.

## The checkout before and after
`C:/dev/wt/o1-clang` at 688b847d325f3129fbde32f31d76dd004b19bd48 (detached, unchanged). The two untracked files were unchanged before and after: `.cargo/config.toml` 6889110645ec075c0cba3bf4aa71c4b43e5b5dfafe7d5a3e8228c05c5010e35f and `engine/tests/o1_probe.rs` c89d746fcc00ef4738b4a460f103d7a4c2d75ce1d5946151f16a1c6e7df4dd67.

## The test file
`engine/tests/o1_explain_p3.rs`, 922 bytes, sha256 4381c7daa159b8728c279d00084107b52030ec7704317ef65494ab3b5c9a5f29. Whole file, as written:
```
//! O1: one EXPLAIN of P3 over one statistics file. Throwaway; not committed.

use spatial_engine::fixture::configured_connection;

#[test]
fn explain_p3_on_a_ar_s() {
    let conn = configured_connection().expect("conn");
    // As the probe's `explain` does: the same setting, then the EXPLAIN.
    conn.execute_batch("SET explain_output = 'all'").expect("set");
    let sql = "EXPLAIN SELECT count(*) FROM read_parquet('D:/wt-targets/o1-clang-data/attempt-2/run1/A-ar-s.parquet') WHERE ((v * v) IS NOT NULL)";
    let mut stmt = conn.prepare(sql).expect("prepare");
    let rows: Vec<(String, String)> = stmt
        .query_map([], |r| Ok((r.get::<_, String>(0)?, r.get::<_, String>(1)?)))
        .expect("query")
        .collect::<Result<_, _>>()
        .expect("rows");
    println!("EXPLAIN-BEGIN sql=[{sql}]");
    for (k, t) in &rows {
        println!("--- {k} ---\n{t}");
    }
    println!("EXPLAIN-END");
}
```
Disclosure, a small departure from the brief's "exactly one statement": the connection is the probe's own (`configured_connection()`, the connection of the probe's default cell D). The probe's `explain` runs `SET explain_output = 'all'` before the EXPLAIN, and I copied that, so the connection runs that one SET and then the one EXPLAIN. Without the SET, DuckDB prints only the physical plan, and the logical plans are the evidence. Nothing else was run. The SQL is the probe's EXPLAIN shape with P3's predicate, text `(v * v) IS NOT NULL`, which the probe defines as P3.

## The run (build lines, exit code)
Command, inside one shared hold: `CC_ENABLE_DEBUG_OUTPUT=1 CARGO_TARGET_DIR=D:/wt-targets/o1-clang CARGO_BUILD_JOBS=8 RUST_TEST_THREADS=8 timeout 1500 cargo test -p spatial-engine --locked --test o1_explain_p3 -- --nocapture`, output to `<the session scratch folder>/o1ex-run.log`. The cargo build output was only:
```
   Compiling spatial-engine v0.0.0 (C:\dev\wt\o1-clang\engine)
    Finished `test` profile [unoptimized + debuginfo] target(s) in 44.25s
     Running tests\o1_explain_p3.rs (D:/wt-targets/o1-clang\debug\deps\o1_explain_p3-09855294c3108e5f.exe)
```
DuckDB was not recompiled. The log has 0 matches for `libduckdb-sys` and 0 for `running:`. The only crate compiled was `spatial-engine`, for the new test. `test result: ok. 1 passed; 0 failed; ... finished in 0.07s`. Exit code: `cmd-rc=0` (the call's exit code was also 0).

## The plan, whole (byte-copied from the log)
```
EXPLAIN-BEGIN sql=[EXPLAIN SELECT count(*) FROM read_parquet('D:/wt-targets/o1-clang-data/attempt-2/run1/A-ar-s.parquet') WHERE ((v * v) IS NOT NULL)]
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
│   ((v * v) IS NOT NULL)   │
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
│       EXPRESSION_GET      │
│    ────────────────────   │
└─────────────┬─────────────┘
┌─────────────┴─────────────┐
│         DUMMY_SCAN        │
│    ────────────────────   │
└───────────────────────────┘

--- physical_plan ---
┌───────────────────────────┐
│      COLUMN_DATA_SCAN     │
│    ────────────────────   │
│           ~1 row          │
└───────────────────────────┘

EXPLAIN-END
```

## Reading, against the human's account
- There is a FILTER node, but only in the unoptimised `logical_plan`. The deciding lines, byte-copied: `│           FILTER          │` and `│   ((v * v) IS NOT NULL)   │`, with `│        READ_PARQUET       │` beneath it. This is the plan as bound, before any optimiser has run. The multiply `v * v` appears there only as the text of the predicate.
- After optimisation (`logical_opt`) and in the `physical_plan`, there is no FILTER, no READ_PARQUET and no expression over `v`. The only nodes are PROJECTION `count_star()` over EXPRESSION_GET over DUMMY_SCAN, and the physical plan is a single `COLUMN_DATA_SCAN` of `~1 row`. A grep of the whole log for `FILTER`, `READ_PARQUET`, `* v` and `v *` matched only the unoptimised plan's two lines and the SQL echo.
- So the planner removed the predicate and the Parquet scan altogether and replaced the query with a constant one-row result. No multiply is evaluated on any path: there is no expression over `v` left in any plan after optimisation.
- Stated plainly: the plan shows the IS NOT NULL folded, with no multiply evaluated, and not a product evaluated. This is consistent with the human's account (the IS NOT NULL decided from the operand's null statistics). If anything, the plan goes further than the account: the optimiser dropped the scan too, so `count(*)` is a constant.
- Limit of this reading: EXPLAIN does not state which statistic decided the fold. The plan is consistent with the account but does not name the null statistics as the mechanism. I did not run anything beyond the EXPLAIN, so the folded result's value is not shown here. The earlier run's P3 completion on this file (id set = X, 2,048 ids, in the second P0 report) is the only other evidence, and I did not re-run it.

## Cleanup
`engine/tests/o1_explain_p3.rs` removed (`rm-rc=0`). The checkout's porcelain after:
```
?? .cargo/
?? engine/tests/o1_probe.rs
```
The two untracked files' sha256 are as above, unchanged. No process of mine is left running. I wrote only the test file (removed), the build output in `D:/wt-targets/o1-clang`, and `o1ex-run.log` in my scratch folder.

## Hold lines (my own project's only; the `also=` segment elided because it names another process)
```
MACHINE_HOLD shared project=SpatialIDE cores=0-7 affinity=FF shell=bash.exe:17640
MACHINE_RELEASED project=SpatialIDE shell=bash.exe:17640 affinity=FF (cores 0-7)
```
The -What text was `o1-clang P3 EXPLAIN: cargo test o1_explain_p3`. One shared hold, no exclusive hold, no exit code 96 to 99. The command ran in the Bash tool's background mode and completed with exit code 0.

## Failure classes (as they apply here)
- The harness uses the connection constructor the probe and the engine use (`configured_connection`, which calls the engine's `configure_connection`). It does not go through the engine's admitted-predicate path, so the plan is DuckDB's for the SQL as written, which is what the ruling asked for.
- The result claim points to a log that exists: `<the session scratch folder>/o1ex-run.log`.
- No operator-facing results file was written. No timed measurement was made.
- The test reaches its assertion: its `expect` calls are its assertions, and it printed the plan.
