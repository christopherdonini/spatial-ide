Reviewed: PR #255 at 27924bbe2fe7cd2655db3406227153b55dccd671, gate 1, reviewer
Verdict: FAIL — one Correctness finding (C1), with its Evidence gap (E1)

Branch reviewed: `cut/stream-evaluation-failure-fixed-detail` @ 27924bbe2fe7cd2655db3406227153b55dccd671. Main is at 8f71e7fd0b582be2bfff90c6cde2d03e5318e683.

## Correctness (blocking)

**C1. The fix does not cover the fetch site, so an overflow found during a later fetch still shows file values.**

The Change line says the terminal detail for this class "carries no file value and no SQL". The head's doc on `OUT_OF_RANGE_DETAIL` calls it "The whole terminal detail for a stream whose evaluation went out of range". Neither holds at the fetch site:

- **Why it can never match there.** At the fetch arm the code passes the panic payload to `classify(cancel, "duckdb fetch panicked", &detail)`. The check is `message.starts_with("Out of Range Error")`. But the locked `duckdb` crate (1.10505.0, per Cargo.lock) builds every fetch panic as `Err(err) => panic!("Failed to fetch Arrow record batch: {err}"),`. I byte-copied that line from the registry source, `src/arrow_batch.rs:46`. So the out-of-range arm is dead code at the fetch site.
- **Observed: it happens.** I ran a scratch probe that copies the engine's call shape (prepare, `stream_arrow` with the path bound, `catch_unwind` around each `next()`, the head's `is_out_of_range`) against the locked `duckdb` crate. The input was an arrow-rs-written Parquet file (parquet 58.4.0) of 4,000,000 rows, where only the last 1,000 rows overflow `v * v`.
  - `stream_arrow` returned Ok.
  - 1,932 chunks (3,956,735 rows) were delivered.
  - Then `next()` panicked. The payload began `Failed to fetch Arrow record batch: Invalid Input Error: Attempting to execute an unsuccessful or closed pending query result`, and its next line was `Error: Out of Range Error: Overflow in multiplication of INT64 (3600000000003999000 * 3600000000003999000)!`.
  - `is_out_of_range` returned false.
  - Controls: with the overflow starting at row 2,000,000 of 4,000,000, and on a 2,048-row file, the error came at `stream_arrow` and did match.
- **What the operator sees.** The head would end that stream with `query: duckdb fetch panicked: Failed to fetch Arrow record batch: … (<row value> * <row value>)!`. That is the leak this piece exists to remove.
- **Ordinary use reaches it.** Any filtered viewport stream over a large file whose first overflowing row lies past what DuckDB processes before `stream_arrow` returns will hit it. The viewport path is `RowOrdering::Unordered`, so there is no sort to force the overflow into the execute step.
- **Limits of this evidence.**
  - The probe ran the locked `duckdb` crate directly, not `Dataset::stream_with_cancel`. The step from payload to the engine's detail rests on reading the head's `produce` and `classify`.
  - Note B says the fetch payload's format was "unobserved here". It is now observed, and it does not begin with the label.
  - Note B's stop rule sends a fix of this kind to a class 3 amendment, "never a looser match". Any fix must not widen the match beyond the class. Note the payload itself begins with `Invalid Input Error`.

## Evidence (blocking, with C1)

**E1. No test starts from the fetch-site shape.**
- T1, B-T1 and P5 all end at the execute site. The M1 text was `query: execute: Out of Range Error: …`.
- Nothing proves the Change line's claim for a failure that arrives at a fetch.
- The fix needs a test whose overflow is reached only after `stream_arrow` has returned, for example a fixture whose overflowing rows come after the first delivered chunks.
- When designing that fixture, see O1: operands near 4e9 wrap silently instead of raising. The probe's raising rows used operands near 3.6e18.

## Documentation (must fix before merge)

- The `OUT_OF_RANGE_DETAIL` doc sentence and the form's Change line are both false only because of C1.
  - The doc sentence will change with the code fix, so §31's wording-block route does not apply.
  - The form's Change line is immutable. The custodian's class 3 amendment records the fetch site.
  - Not the human's wording: the Change line is lead-data's draft, and the const doc is the worker's.

## Outside this diff (for the custodian; does not block #255)

**O1. Silent wrong rows for an admitted same-type integer overflow.**
- On the locked `duckdb`, BIGINT `v * v` with |v| about 4.0e9 wrapped around without an error:
  - `v * v < 0` returned exactly the 1,024 rows whose v is ±(4,000,000,000+i). A square is never negative.
  - On a 2,048-row file where only the last row has v = 4,000,002,047, `v * v > 0` returned 0 rows instead of 2,046, again with no error. This held on both a DuckDB-written and an arrow-rs-written file, and a non-streaming `count(*)` also returned 0.
- The mechanism is not determined.
- This was not run through the engine. It is the same typed class as T1's admitted `i64 * i64 > 0`.
- It means FILTER-BIND §2.5(d)'s class does not always end the stream in error, which bears on the direction this node rests on (B-1 point 4). It is the human's to route.

**Brief's question: can any other DuckDB failure class now read as out of range?**
- The check reads DuckDB's class label, not the cause. Anything DuckDB raises as `Out of Range Error` at prepare or execute gets S1.
- On the admitted path that means integer `+`, `-`, `*` and unary `-` overflow, including literal-only arithmetic folded at prepare.
- DECIMAL overflow carries the same label. I observed `v * 1.0 * v` give `Out of Range Error: Overflow in multiplication of DECIMAL(38) …`. But the binder refuses a decimal literal beside an integer or a decimal in `+`, `-`, `*` (predicate.rs lines 1409-1410 at head, O-5), so I found no admitted route to it. I read this; I did not prove it exhaustively.
- Float overflow did not raise: `v * 1e308 > 0` completed. That agrees with the rewritten doc line in filter_type_admission.rs.

## Checks

1. **Diff.** `git diff --numstat f0804432...27924bbe` rc 0: stream.rs 65/5, admission_property_campaign.rs 44/6, filter_type_admission.rs 9/5. That is 134 of 150, in exactly these three files.
   - Three commits: da4fa6f6, 86612bdd, 27924bbe.
   - A grep of the patch for added `pub` items found 0 (the pattern was checked positive on stream.rs: 97).
   - No change to Cargo.toml, Cargo.lock or error.rs (diff --stat empty). No new `EngineError` variant.
2. **Code against the Change line and notes B and D.**
   - `Cancelled` still comes first.
   - The label is read only at the start of DuckDB's message, and the phase is passed separately (Amendment 1 item 3).
   - Every other failure renders as `{phase}: {message}`, the same bytes as before at all three sites.
   - S1 byte-equality by script (rc 0): the form's line-63 text equals the stream.rs const, and each test file's single const equals `query: ` + S1, with no escapes.
   - Both test sites keep their typed class (`i64`/`id` with ` + `/` - `/` * `; arith_op `+`/`-`/`*`) and require exact equality.
   - The leak assertion's hunk is untouched.
   - The C1 defect is at the fetch site.
3. **Tests and mutations** (shared holds, `CARGO_TARGET_DIR=D:/wt-targets/sefd`).
   - `cargo test -p spatial-engine --locked`: rc 0. 47 result lines summed: 447 passed, 0 failed, 17 ignored.
   - `cargo test -p spatial-kernel --locked --test typed_terminal_codes`: rc 0, `test result: ok. 7 passed; 0 failed`.
   - **M1** (arm deleted, applied alone by script, diffstat 2 deletions):
     - T2 rc 101, at its first `classify` assertion.
     - T1 rc 101, at `assert_eq!(text, OVERFLOW_TERMINAL)`, with left `"query: execute: Out of Range Error: Overflow in multiplication of INT64 (-3602189387807864356 * -3602189387807864356)!"`.
     - P5 rc 101, `4 candidate(s)`, tally `"excluded": 0, "passed": 197`.
     - campaign rc 0.
     - B-T1 rc 101, `B-T1: 4564 admitted, 5164 refused, 135 failures`.
     - Reverted; porcelain 0 bytes.
   - **M2** (always true): T2 rc 101, `read as out of range: IO Error: No files found that match the pattern "x.parquet"`. Reverted; porcelain 0 bytes.
   - Both match the RECORDED MUTATION lines.
4. **fmt and clippy.**
   - `cargo fmt --all -- --check` rc 0, no output.
   - `cargo clippy -p spatial-engine --tests --locked` rc 0, 39 `warning` lines.
   - In the three files, warnings are at stream.rs 2355, 2359, 2471 and 3608; campaign 218, 270, 543 and 556; filter_type_admission 955. All are outside the changed hunks; blame puts 2359 and 3608 at 8a1f3eac and 1497fcb2. None is new.
5. **Verify scripts and CI.**
   - In the worktree: verify-cites rc 0, verify-quotes rc 0, verify-test-claims rc 0, verify rc 0, each PASS.
   - `gh pr checks 255`: 18 pass.
   - Every run has head 27924bbe2fe7cd2655db3406227153b55dccd671 by `gh run view`: 40113298069/070/107/122/157/249/254 (pull_request) and 40109780689/694/753/772/830 (push).
   - 40113298070 was in progress; I watched it to `completed success`.

## Holds (this project's only)

Each was granted as `MACHINE_HOLD shared project=SpatialIDE cores=0-7 affinity=FF` and followed by `MACHINE_RELEASED project=SpatialIDE`. None was refused, no exit 96-99, and nothing was timing-sensitive. They covered:
- the engine suite
- the probe's builds: one ~18 min, because the probe's own lock rebuilt duckdb; and one arrow-rs/parquet rebuild
- 5 probe-run batches
- the kernel test
- M1
- M2
- clippy

Three small probe-only rebuilds (about 20-37 s each) and some single 2,048-row probe runs ran outside holds, as light work.

## State left

- The worktree is clean at the head.
- No cargo, rustc or probe process is running.
- The probe crate and its Parquet files are in my scratch folder under `sefd-g1r-*`. Its build artifacts are in `D:/wt-targets/sefd`.
