*Custodian's filing note (2026-10-25): the architect's read-only consult on the route for the fixture S after the worker-high's stop on `first-batch-factorial-ignored-trace-tests`, read at main 51805ca5. The custodian's reading: R1 and R3b cannot run now, because the engine generator's floor checks drive C: against 40 GiB and C: had 25G free by `df` at filing, and the unmutated precondition's timing budget would need an exclusive re-run on a miss, which needs the human's word; R2 is a class 5 narrowing of the Tests+mutation line, which needs the human's ruling. The piece is held on the human's choice. R3c is proposed as its own node. The run 20:58:55Z to 21:04:26Z by its transcript (Read 25, Grep 18, Glob 1; no write tool). Extracted by script from its SubagentHandback call, with one final newline added; nothing else is changed. Its sha256, from line 5 to the end, is fdd6a321431526ce55c43c3de78c7945e7314dc42b4cb62ef670a33ac542b1b2.*

---

Consulted: first-batch-factorial-ignored-trace-tests, the fixture S route, at main 51805ca5

The text below is my own words, apart from strings in backticks that I copied byte for byte from what the Read tool returned. I read the main checkout's working tree, whose HEAD the session's git status names as 51805ca5 with no tracked changes. Every cite is `@ 51805ca5`. I have no shell, so this report carries no sha256. I could not read the branch commit 3c8e91f6, so every line number in `first_batch_factorial.rs` is main's, which has no lock.

## 1. How S is produced (and H5)

**The spec.** S is `parcels-145mb.parquet`, written by `spatial_engine::fixture::write_geoparquet` with `spec_s()`:
- the spec: kernel/tests/first_batch_factorial.rs:112-123 @ 51805ca5;
- the constants: kernel/tests/first_batch_factorial.rs:46-53 @ 51805ca5. The seed is `0x5EED_2056_0000_0007`.

**Three code paths write it. None of them writes S alone.**
- (a) `the_factorial_first_batch_pass`. It generates S if absent (kernel/tests/first_batch_factorial.rs:783-799 @ 51805ca5), then makes the DuckDB rewrites C and H (:806-841), then runs the measured factorial. RESULTS.md names this as S's documented regeneration route (kernel/RESULTS.md:3548-3549 @ 51805ca5). It is a timed measurement pass: 384 trials, settles and canaries.
- (b) `generate_the_145mb_fixture_matrix` (engine/tests/import_layout_fixtures.rs:244-300 @ 51805ca5).
  - Its `spec_s()` (:98-109) has the same field values as the kernel's.
  - If the first-batch S is absent, it writes `import-layout/parcels-145mb-source.parquet` (:290-299) and logs that file's size and sha256 (:301-302).
  - It then writes the 9+2 DuckDB rewrites, about 1.5 GB by its own doc (:33).
  - Its doc calls it fixture writing, not measurement (:9-11). It needs `--release --features fixture` (:37-38, :247-251).
  - Its `require_disk` checks drive C:'s free space against 40 GiB (:130-151), wherever the export lives.
- (c) No dedicated entry point exists. `regenerate_fixture.rs` covers only the 5 GB G5 (kernel/tests/regenerate_fixture.rs:78-91 @ 51805ca5). kernel/FIXTURES.md @ 51805ca5 has no entry for S (:15-117 cover G5 only).

**Where it writes.** Every one of these paths is `env!("CARGO_MANIFEST_DIR")`'s parent joined to `target/slice-evidence/...`:
- kernel/tests/first_batch_factorial.rs:91-98 @ 51805ca5;
- engine/tests/import_layout_fixtures.rs:82-96 @ 51805ca5.

So a build inside an export writes into the export's own `target/slice-evidence/`, and the path does not follow `CARGO_TARGET_DIR`.

**Determinism.**
- The generator is seeded: `SplitMix64(spec.seed)` at engine/src/fixture.rs:995 @ 51805ca5, with fixed writer properties at :979-991.
- The engine test's doc says a fresh copy is byte-identical "by construction" (engine/tests/import_layout_fixtures.rs:27-29 @ 51805ca5). That is a claim, not a record.
- The only regeneration records on file are for G5: kernel/FIXTURES.md:78-83 @ 51805ca5, and kernel/FIXTURE-REGENERATION-ENTRY-POINT-PREREGISTRATION.md:14 and :27 @ 51805ca5. Both are the same writer with a different spec.
- kernel/FIXTURES.md:85-90 @ 51805ca5 says determinism across toolchain or crate versions is not established.
- For S I found no regeneration record. A grep of kernel/*.md for `parcels-145mb-source` found nothing.

**The hash to check against.** kernel/RESULTS.md:2988 @ 51805ca5 records only a 16-hex prefix, `fe61e704fcc01d40…`. The full value is at engine/tests/import_layout_fixtures.rs:79-80 @ 51805ca5, and its doc says it was re-verified on the file on disk (:75-78). The hash is sha256 (engine/src/index.rs:627-634 @ 51805ca5).

**H5.** H5 is `write_clustered_variant` (DuckDB `COPY`, Hilbert16) run over G5. Two paths write it:
- `the_5gb_clustered_cell` (kernel/tests/first_batch_factorial.rs:1078-1116 @ 51805ca5), which is followed by measured cells;
- `generate_the_5gb_fixture_set` (engine/tests/import_layout_5gb_fixtures.rs:337-394 @ 51805ca5, through `ensure` at :258-332). It writes C5 first, then H5, then R5.

Both need G5 in the export: a 5 GB copy, checked against kernel/FIXTURES.md:21 @ 51805ca5. That makes three 5 GB rewrites. The known hash is at engine/tests/import_layout_5gb_fixtures.rs:79 @ 51805ca5. Whether DuckDB's output is byte-deterministic is not established in anything I read. **H5 is not cheap.**

## 2. Does M-1 need S?

**Yes, for both tests.** In the first test, these run before the first `trace::start` (:1321-1325):
1. `serial()`, which under M-1 fills the trace slot;
2. `refuse_debug` (:1302);
3. `evidence_dir()` (:1303);
4. `assert!(path.exists(), "run the factorial pass first; this cell reuses its fixture")` (:1305-1308);
5. then, per trial, `Dataset::open(&path).expect("open")` (:1314) and `build_row_group_index(...).expect(...)` (:1315-1316).

With S absent, M-1 fails at :1305-1308, not at the start's `expect`. The form's Tests+mutation line counts that as a stop ("fails anywhere else"). The H5 test has the same order: :1436, :1437, :1439-1442, :1448-1450, then the start at :1455-1459.

**A debug build is no way round it.** It stops at `refuse_debug`, which is also "elsewhere".

**With S present, nothing before the start should panic because of M-1's live trace.** `mark` takes `mark_cold` (engine/src/trace.rs:302-316 @ 51805ca5), and a full buffer drops records with a count (:62-75) rather than panicking. That is a reading, not an observation.

## 3. The routes

**(R1) S regenerated inside the export; H5 by the settled (B) fallback.**
- **How:** run (b) in the export, copy `import-layout/parcels-145mb-source.parquet` to the export's `first-batch/parcels-145mb.parquet`, check it against the full value at engine/tests/import_layout_fixtures.rs:79-80 @ 51805ca5, then follow note 2 from step 4.
- **What the form allows:**
  - The five lines allow it: "the fixtures in place in an export of the code commit" names no source.
  - Note 2 step 2's copy source and prefix check do change, so an amendment is needed. The nearest class is **class 1**. Its first line says it was written after the worker's stop report was seen and before any run of the piece's tests. It records the new source, the full-hash check, and H5 absent so (B) applies.
  - The settlement's (B) covers an absent H5 only when S is present. R1 makes S present.
  - If you read class 1 as not fitting a stop with no test run, docs/PREREGISTRATION-TEMPLATE.md:96-99 @ 51805ca5 routes that to the human.
- **Evidence:** M-1 observed by name on test 1, and the unmutated pass. Test 2's M-1 is a reading.
- **Cost:**
  - an engine release build with `fixture`, besides the kernel release build;
  - a heavy write of about 1.5 GB, multi-core DuckDB;
  - no measured pass.
- **Machine rules:**
  - It is heavy (state/directives/2026-10-06-machine-script-adopted.md:13 @ 51805ca5), so it runs in a shared hold.
  - The generator is not a timed measurement. Its 900 s watchdog could fire under contention, but only after S is already written.
  - The unmutated cancellation run asserts `< 100` ms. The settlement treats it as a precondition and has a timing miss re-run alone, which means an exclusive hold, the custodian's only (state/directives/2026-10-06-machine-script-adopted.md:25 @ 51805ca5; state/directives/2026-10-06-probes-readme-node-and-script-adoption.md:19 @ 51805ca5).
- **Risk:** a hash mismatch is a stop by note 2 (the parquet crate stack may differ from the one that wrote S; not settled).

**(R2) OPEN-2 (C): neither test run, both M-1s readings.**
- **What the form allows:** the Tests+mutation line declares an observation. Narrowing it is **class 5**, which needs the human's ruling or a gate's finding. The custodian's choice alone is not enough.
- **Evidence:** none at runtime. The lock is not shown to be on either path. The code commit has not yet been compiled (stop report :33-34).
- **Cost:** nothing heavy.
- **Records:** must never call a reading or a `verify-mutation` run an observation (docs/PREREGISTRATION-TEMPLATE.md:172 @ 51805ca5).

**(R3) What else the records allow:**
- (R3a) Run (a), the measured factorial pass, in an export to get S. **Rejected:** a full timed pass taken only to make a fixture. It needs an exclusive hold, and its figures would be discarded.
- (R3b) Run (b) in a scratch export, check S's full hash, and place the copy at the main checkout's `target/slice-evidence/first-batch/`.
  - Note 2 step 2 then holds as written. A class 1 line still records where the copy came from.
  - It also restores the input that kernel/tests/query_window_attribution.rs:54 @ 51805ca5 reads.
  - Same cost and hold as R1, plus a 145 MB write into the main checkout's target.
- (R3c) A dedicated S regeneration entry point, like `regenerate_fixture.rs`, plus a kernel/FIXTURES.md entry for S. This is outside this piece's Scope ("no other file changes"), so it would be its own piece. It is the clean fix for a gap the records show: S's only documented regeneration is a measured pass.

**Recommendation: R1, or R3b if you want S back at the copy source.** In both, H5 goes by the (B) fallback already settled. File R3c as a follow-up node. R2 only if the human rules it.

## 4. Can a regenerated S be compared to the runs of record?

**Only as an input.** If its sha256 equals the full value at engine/tests/import_layout_fixtures.rs:79-80 @ 51805ca5, it is the same bytes the runs of record read (kernel/RESULTS.md:3244 and :4097 @ 51805ca5).

**No figure is compared.** The runs of record were taken on other binaries and in other sessions (kernel/RESULTS.md:3567-3572 @ 51805ca5). This piece re-takes no figure (the form's note 1, its docs/08 subsection). A shared hold is not a measurement's conditions.

So a regenerated S serves M-1 and the unmutated precondition only. Any figure the unmutated run prints is not recorded and not compared. A mismatched S is a stop and is comparable to nothing.

## What I could not settle

- Whether a regenerated S reproduces the recorded hash. That depends on whether the arrow/parquet stack changed since S was written (Cargo.lock:1372-1373 @ 51805ca5 has `parquet` 58.4.0). I did not read whether the writer embeds its version in the footer. Only the hash check decides it.
- Free space on drive C: (the engine generator's floor). The worker's `df` figure (stop report :24) does not name the drive.
- The branch's actual line placement at 3c8e91f6.
- Whether DuckDB rewrites are byte-deterministic (relevant to H5 only).
- No sha256 anywhere in this report: I have no shell.

Paths read: C:\dev\spatial-ide\kernel\FIRST-BATCH-FACTORIAL-IGNORED-TRACE-TESTS-PREREGISTRATION.md, C:\dev\spatial-ide\state\consults\2026-10-25-first-batch-factorial-ignored-trace-tests-worker-stop-report.md, C:\dev\spatial-ide\state\consults\2026-10-25-first-batch-factorial-ignored-trace-tests-five-line-form-architect-draft.md, C:\dev\spatial-ide\kernel\tests\first_batch_factorial.rs, C:\dev\spatial-ide\kernel\tests\regenerate_fixture.rs, C:\dev\spatial-ide\kernel\FIXTURE-REGENERATION-ENTRY-POINT-PREREGISTRATION.md, C:\dev\spatial-ide\kernel\FIXTURES.md, C:\dev\spatial-ide\kernel\RESULTS.md, C:\dev\spatial-ide\engine\tests\import_layout_fixtures.rs, C:\dev\spatial-ide\engine\tests\import_layout_5gb_fixtures.rs, C:\dev\spatial-ide\engine\src\fixture.rs, C:\dev\spatial-ide\engine\src\index.rs, C:\dev\spatial-ide\engine\src\trace.rs, C:\dev\spatial-ide\docs\PREREGISTRATION-TEMPLATE.md, C:\dev\spatial-ide\kernel\Cargo.toml, C:\dev\spatial-ide\engine\Cargo.toml, C:\dev\spatial-ide\Cargo.lock; the state/directives/2026-10-06-*.md files through Grep.
