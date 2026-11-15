Reviewed: PR #297 at f82adfc519a98f0b5160e1fd0625c471a466a1b2 (base 47da4d05), gate 1, reviewer — cut/narrow-integer-id-unstreamable @ f82adfc519a98f0b5160e1fd0625c471a466a1b2

Verdict: PASS WITH NOTES

The code passes, the seam holds and all five mutations fail where §4 predicts. There are no blocking findings. One worker doc sentence must be fixed before the merge (D1), and one point on the ADR-016 note goes to the human (C1).

Brief sha256 afc79565f4751b0f201331d3ae99be000d015a536e2969ffa8263a0c7b196d26 and packet sha256 2f367e23f9f029f343658bbbda6922dc899d59d0dff9a092e7d243efd28b54d3: both match. I read the rulings (Part 1, items 1 to 9), the form (settlement and Amendment 1), the worker report and the full diff (44075 bytes). `<S>` below is the scratch folder.

## Findings

### Correctness
No blocking finding.

- **C1 — for the human, no replacement words.** This is the human's note, now at the end of ADR-016. It is red-line text, so it is reported here. Closing it is the human's decision (accept it as it stands, or give new words at the click), not a condition on the code.
  - The clause "its values widen to the 64-bit integer the stream carries without change, signed to signed and unsigned to unsigned" does not describe what the code does. Every width reaches the stream as UInt64. Int8, Int16 and Int32 go through `u64::try_from` one value at a time and a negative value is refused (`column_u64`, the three signed arms). Nothing widens signed to signed.
  - The note's conclusion, "the identity is the same number", is true for every value that is admitted: E1 checks N1 to N6 and D1 by id set.
  - "from that piece every width streams" is true for the viewport stream (E1, K1). The LOD tier reader still takes only UInt64 or Int64 (`engine/src/lod.rs`, the `id_type` match), and so does the fixed-grid index. Both are out of scope under OPEN-2 (A) and OPEN-3 (A), and the shipped app never calls either.

### Evidence
No blocking finding. The suite and every mutation were re-run by me (checks 2 and 3). CI is green at the head (check 7).

### Documentation (must fix before the merge; not the human's wording, so the worker applies it with no re-gate and the PR body lists it)
- **D1 — `engine/src/fixture.rs`, the doc on `IdentityMode::NarrowInteger`, the paragraph "It refuses, and never wraps."**
  - The clause "when `features` exceeds what `width` can hold" is untrue under `GeometryMode::Rows` and `GeometryMode::RowsWithBounds`. In those modes `features` is ignored (the `GeometryMode` docs say so) and the refusal checks the number of explicit rows, `total` (fixture.rs `generate`, the `total` match, then `narrow_refusal(width, values, total)`).
  - It only matters with the `fixture` feature, which is test support and not in the shipped build. That is why it does not block.
  - Replacement words: "**It refuses, and never wraps.** `generate` returns `EngineError::Source` before the first row when the row count (`features`, or the number of explicit rows under `GeometryMode::Rows` and `GeometryMode::RowsWithBounds`) exceeds what `width` can hold (its maximum plus one), or when `values` is `Negative` and `width` is unsigned, and `write_geoparquet_cancellable` then removes the partial file. A value that does not fit its width is an error in `narrow_array` as well."
  - Clause check against the head:
    - "returns `EngineError::Source` before the first row": `narrow_refusal` returns `Err(EngineError::Source(..))` and is called before `while written < total`.
    - "the row count (`features`, or the number of explicit rows …)": the `total` match is `Polygon => spec.features`, `Rows(rows) => rows.len()`, `RowsWithBounds(rows) => rows.len()`.
    - "(its maximum plus one)": `capacity = width.max() as u64 + 1; if features as u64 > capacity`.
    - "when `values` is `Negative` and `width` is unsigned": the first check in `narrow_refusal`.
    - "then removes the partial file": `File::create` runs before the refusal, and `write_geoparquet_cancellable` calls `remove_file` when `generate` errs, reporting a removal failure.
    - "an error in `narrow_array`": `T::try_from(*v).map_err(.. EngineError::Source ..)`.

### Notes (preferences, not conditions)
- N1. stream.rs, the comment on the new arms, "the route is reachable through the engine API alone":
  - The kernel's `Catalog::open_cancellable` passes the engine's `IdentityDeclaration` through, and `skip_uniqueness_check` is a `pub` field. So a Rust caller of the kernel can reach the route too.
  - No product code sets it: the only uses in `kernel/src` are comments, and the comment at skp.rs:1728 says the wire has no field for it.
  - The clause is true if "engine API" covers the engine's declaration type.
  - Optional words: "The SKP wire has no field for that option and no product caller sets it, so only a Rust caller that builds the engine's `IdentityDeclaration` itself reaches the route."
- N2. K1's doc says "`EngineSourceFactory::ticket_only` redeems it". Strictly, the factory that `ticket_only` builds redeems the ticket in `create`.
- N3. Known finding 2: under M-1 I also ran E2. It fails at s3, the "negative" detail assertion (`s3: `id` is Int32; expected a 64-bit integer`). Not recorded in E2's doc; §4 does not ask for it.

## Checks

### 1. The diff against §2, §5, §7 and §8
- **Files.** `git diff --name-only 47da4d05...f82adfc5` (rc 0) lists exactly the seven files of §7's (B) row.
- **`column_u64`**, by script `<S>/8g-g1r-fns.mjs` (rc 0, ALL EQUAL):
  - The head's function with the added block removed equals the base's function byte for byte (1585 bytes). So the null check, the UInt64 and Int64 arms, the type error and all four format strings are unchanged.
  - The Int64 arm ends right before the block, and the type error follows right after it.
  - The six arms, in order: UInt32, UInt16, UInt8, Int32, Int16, Int8.
  - 35 non-comment lines in the block, 0 with the token `as`. Self-test positive: the same scan finds 24 elsewhere in the diff.
  - `negative()`'s text equals the Int64 arm's: "`{name}` holds a negative value: {v}".
- **Functions §5 declares unchanged.** Equal base against head by the same script: `build_sql` (18565 bytes), `admit_column_type`, `candidate_identity_columns`, `admit_identity`, `run_identity_scan`.
- **`pub` items.** No added `pub` outside fixture.rs (count 0, grep rc 1). Self-test positive over the whole diff: the three `pub enum`s in fixture.rs.
- **Forbidden paths.** None changed: lib.rs, Cargo files, lod.rs, index.rs, rowgroup.rs, layout.rs, kernel/src, protocol, frontends, renderer, .github (rc 0, empty output).
- **Commit times.** All four commits fall between 2026-11-07T22:19:57Z and 23:15:19Z. That is after the human's message (20:25Z) and after #294's merge (95e89c10, `mergedAt` 2026-11-07T20:26:20Z by `gh pr view 294`). 95e89c10 is an ancestor of the base (rc 0). The form was added at 47da4d05 itself, and no line of it has been removed since.
- **Size.** §7's command at the head (origin/main 84a16ed5, merge base 47da4d05): 629 added, 6 removed, 635 changed lines over 7 files, against a ceiling of 480. That matches Amendment 1 (class 8), and §7 is not edited.
- **Bytes** (`<S>/8g-g1r-bytes.mjs`, rc 0): over 629 added lines, 0 CR, 0 tab, 0 non-ASCII bytes in code. 3 non-ASCII lines, all in Markdown. All seven files end in LF and carry no CR. No "No newline" marker in the diff.

### 2. The suite at the head, run by me
D: had 201.5 GiB free before the run.
- **`cargo test --workspace --locked`** (worktree target, shared hold, `timeout 3600`): rc 0.
  - 118 result lines: 1027 passed, 0 failed, 66 ignored, 0 lines FAILED.
  - These four pass by name: E1, E2, K1, and `identity::tests::only_value_preserving_integer_types_are_admitted`.
  - Every test that ran passed. The fixture-hash binaries are all ok: geoarrow_batch_fixtures 3 passed (1 ignored), polygon_wire_golden 1, publish_partition_golden 1, regenerate_fixture_s 6 (1 ignored), first_batch_and_pruning 17, import_layout_fixtures 0 (1 ignored). The ignored ones are the existing generators.
- **`cargo fmt --all -- --check`**: rc 0, no output.
- **Clippy, workspace** (`cargo clippy --workspace --locked --tests --no-deps -- -D warnings`): rc 101. It stops at spatial-renderer with two errors outside the seven files (renderer/src/canonical.rs:240, renderer/src/style.rs:10), before it reaches engine or kernel.
- **Clippy, engine and kernel** (my addition: `cargo clippy -p spatial-engine -p spatial-kernel --keep-going --locked --tests --no-deps -- -D warnings`): rc 101. The engine lib has three errors, none on a diff line:
  - engine/src/rowgroup.rs:331, too many arguments (not one of the seven files);
  - engine/src/stream.rs:2346/2350, identical `if` blocks (in a seven-file, but not in the diff; the hunk is at :2688-2736);
  - engine/src/stream.rs:2462, too many arguments (not in the diff).
- **What clippy did not cover.** No lint fired on the lib's diff lines. Because the engine lib fails, the engine's test targets (the identity.rs unit test, engine/tests) and the kernel were never linted.
- **Porcelain** afterwards: empty (0 bytes); HEAD is f82adfc5.

### 3. M-1 to M-5, observed by me, on an export
- **Export.** `git archive f82adfc5`, extracted with `tar --force-local` into D:/wt-targets/8g-g1r-export (rc 0). Its .cargo/config.toml hash equals the worktree's. D: had 200.8 GiB free before the build. Target D:/wt-targets/8g-g1r-target, new and cold. Every run used `--locked`, `timeout 3600`, and one cargo command per shared hold.
- **Unmutated:** engine test 2 passed; kernel test 1 passed; `--lib` filtered to the unit test 1 passed (209 filtered out). All rc 0.
- Mutations were applied by `<S>/8g-g1r-mut.mjs`, which refuses to run unless the file is the head's bytes and asserts exactly one occurrence. I ran the whole engine test binary each time (E1 and E2), not only the named test.

| Mutation | Test run | Observed (line at the head) | Predicted | Match |
|---|---|---|---|---|
| M-1: Int32 arm removed | E1 | fails at :152, `n3: the stream ended in Some(Query("`id` is Int32; expected a 64-bit integer"))` | N3, stream error | yes |
| M-1 | K1 | fails at :92, `the data plane received a terminal error: engine.query: query: `id` is Int32; expected a 64-bit integer` | terminal assertion, detail beginning `engine.query` | yes |
| M-1 | E2 (extra) | fails at s3 (N3) | not predicted | — |
| M-2: Int16 arm `Ok(*v as u64)` | E2 | fails at :256, `s2: rows before the refusal: 100`; E1 passes | S2 | yes |
| M-3: UInt32 arm `*v as i32 as u64` | E1 | fails at :154, `n6: ids`; E2 passes | N6 (v) | yes |
| M-4: `data_type` returns UInt64 and `narrow_array` builds UInt64Array | E1 | fails at :140, `n1: written type`, left UInt64, right Int8 | N1 (i) | yes |
| M-4 | E2 (side effect) | fails at :32 writing the fixture: negatives cannot be written as u64 | not predicted | — |
| M-5: `D::Int8` removed from `admit_column_type` | unit test | fails at identity.rs:378, `Int8 should widen exactly` | the unit test by name | yes |

- **Restores.** After each mutation the file was restored and its sha256 shown equal to the head's: stream.rs 90f4908c…a7 (after M-1, M-2, M-3), fixture.rs 4b61649b…da0 (after M-4), identity.rs 1b6b1d3f…ffc (after M-5). All three checked again at the end.
- **Cleanup.** The export, its target, both tmp folders and the tar are removed; `ls D:/wt-targets/8g-g1r-*` finds nothing.

### 4. The tests at their boundaries
- **E1.**
  - Each file is written by `write_geoparquet` with `IdentityMode::NarrowInteger`, the real producer.
  - Each column's type is read back from the parquet footer (`ParquetRecordBatchReaderBuilder`), which is the vacuity guard. M-4 proves it bites.
  - Opened by `Dataset::open_cancellable`; D1 with `IdentityDeclaration("parcel_key")`.
  - Drained by `stream_with_cancel(&ViewportQuery::all(), CancelToken::new())`.
  - (i) to (v) are asserted for N1 to N6, D1 and C0: source, uniqueness, `verified_rows` 100, `max_value`, no error, the UInt64 downcast (`expect`), and the id set and count.
- **E2.**
  - G1 to G3: `Err(EngineError::IdentityUnusable { detail, .. })` with "negative".
  - S1 to S3: admitted `DeclaredNotVerified`; `ids.is_empty()` before the first `Err(EngineError::Query(detail))` with "negative".
  - S0: 100 rows, the set equal.
- **K1.** Same shape as `typed_terminal_codes.rs`'s harness, without the touch, against the real interfaces at the head:
  - `Catalog::open(name, path, Option<CrsAssertion>)`;
  - `SkpHost::new` / `generations().mint_for_open` / `viewport_query`;
  - `EngineSourceFactory::ticket_only(catalog, tickets, generations)` → `SourceFactory::create(&OpenRequest)` → `BatchSource::next_into(&mut Vec<u8>) -> Option<Result<BatchMeta, String>>` (kernel/src/lib.rs).
  - The shell installs the same factory (`frontends/shell/src-tauri/src/lib.rs:429`).
  - Asserts no `Err` item, every buffer as Arrow IPC with `id` as UInt64, 100 ids equal to the written set.
- **No sleep, retry, timeout, watchdog, `#[ignore]` or `cfg`** in either new file (git grep rc 1; self-test positive on stream.rs, 8 hits).
- **Fixture directories.** Each test writes under its own: target/fixtures/narrow-integer-id-stream/e1, …/e2, and …-kernel.
- **Existing tests.** Among §4's existing tests, only identity.rs's unit test changes. Its diff is the list gaining `D::Int8` and `D::UInt16` (rustfmt reflowed it one per line) plus a doc comment. No assertion is loosened, and the refused list (Utf8, Float64, Binary, Boolean) is unchanged.
- **`RECORDED MUTATION` lines.** Six of them: E1 ×3, E2, K1, and the unit test. Each names its mutation and `8cce80cade922cfbec62d8de6064f76fd1cab488` "on the uncommitted tree". Each claims only the failing assertion, and each matched my own observation.

### 5. The comments, clause by clause at the head
- **stream.rs, the comment on the new arms:**
  - "`u64::from`, which cannot change a value": the three `u64::from` arms. True.
  - "`u64::try_from` per value, as the Int64 arm above does": true.
  - "same detail as there (`negative` builds that text)": equal by script. True.
  - "None of the arms uses `as`": 0 hits. True.
  - "Admission scans for a negative value at open (`admit_identity`)": `admit_identity`'s `min` check. True.
  - "returns before that scan for a declared mapping with `skip_uniqueness_check`": `if skip { return Ok(..DeclaredNotVerified..) }` comes before the scan SQL. True.
  - "on that route this is the only place a negative value is caught": `column_u64` is the only caller-reached id reader on the stream path (one caller, the stream.rs chunk loop). True.
  - "The SKP wire has no field for that option": skp.rs:1728. True.
  - "reachable through the engine API alone": see N1.
  - "Every type `admit_column_type` admits … each have an arm": eight types in the match, eight downcasts. True.
  - "Any other Arrow type keeps the type error": the unchanged final `Err`. True.
- **fixture.rs docs.**
  - The variant doc: "same writer", "`width` is the column's Arrow type", "`parcel_key` with no `id` column (as `ForeignKeyColumn`)", and "row index seeds the geometry exactly as … `NativeUnique`" (`id = (written + i)` and `parcel(&mut rng, spec, id)` for every mode) are all true. The refusal clause is D1.
  - `NarrowWidth`, `NarrowColumn`, `NarrowValues` (top of range is unique and non-negative given the refusal; negative is "-1, -2, ..."), `data_type`, `max` (every range fits an i64), `narrow_value`, `narrow_refusal` (maximum plus one equals the count of distinct values both ways: 0..max, and -1..min since |min| = max+1), `narrow_array`: true.
- **The tests' docs.** E1 (assertion order and values; 99 for the control), E2 (the scan reads the minimum; `DeclaredNotVerified`; "negative" before any row) and K1 (see N2): true. The unit test doc ("all eight… four types… refused") is true.
- **The three comments §2.6 names:**
  - identity.rs's admission comment ("A signed type is admitted here and its *values* are checked when they are read"): true at the head for all eight types.
  - `build_sql`'s comment: true. The function is byte-unchanged and the checks are shared.
  - lod.rs "Unreachable through `Dataset`" (in the `id_type` match): still false for the narrow types. Untouched and out of scope under OPEN-2 (A), as known finding 4 says. For the human.

### 6. The records
- **engine/README.md's three lines.**
  - The E1 pointer is added to the Viewport stream row: the test exists at the head.
  - The form's path is added to the preregistration list: the form exists at b52522c3 and at the head (`git cat-file -e` rc 0).
  - The Last verified clause ending "at b52522c3" is true. Both pointers resolve at b52522c3, and `git diff --stat b52522c3 f82adfc5` touches only the README and ADR-016. So known finding 3 is no defect.
- **ADR-016,** by my script `<S>/8g-g1r-adr.mjs` (rc 0):
  - The head (19592 bytes, sha256 e2641596…fd36) begins with the base's file byte for byte (18841 bytes, a26ca0f3…f4a6).
  - The appended bytes are 751, sha256 bb0de1aa…876f, equal to the worker's append file.
  - The directive's line 8 at main hashes to a4821dbb…a79c, matching the settlement's pin.
  - The span between `My note on ADR-016: "` and `" (C) is refused` is 413 bytes, sha256 c3e7098b…0226. The last appended paragraph, without its final LF, equals it byte for byte.
  - The heading and the italic line are not the human's words; their clauses are true (receipt time, the heading date, nothing above changed). ADR text is not a gate's to word.
  - The finding on the note's own words is C1, for the human.

### 7. The verify scripts and CI (at the head, in the worktree)
- `verify.mjs --offline`: rc 0, PASS.
- `verify-cites.mjs`: rc 0, PASS (2745 files; 174 loose references advised).
- `verify-quotes.mjs` (shared hold): rc 0, PASS. 138 checked, 107 verified, 30 baselined, 1 advisory, 0 hash-reference errors, 920 ruling cites resolved, 0 errors.
- `verify-test-claims.mjs`: rc 0, PASS. 756 claimed, 43 planned.
- `node --test` over the three script globs (shared hold): rc 0. 598 tests, 598 pass, 0 fail.
- `gh pr checks 297`: rc 0, 18 checks, all pass.
- `gh run view` on each of the 12 runs the packet lists: each headSha is f82adfc519a98f0b5160e1fd0625c471a466a1b2, status completed, conclusion success (7 pull_request runs, 5 push runs).

## For the human
- C1: the ADR-016 note's clause "signed to signed and unsigned to unsigned". Every width is carried as UInt64, signed values through a per-value non-negative check. The conclusion, "the identity is the same number", holds. Accept it as it stands or give new words; no replacement words from me.
- lod.rs's "Unreachable through `Dataset`" is still false at the head, under OPEN-2 (A) (known finding 4).

## What I did beyond or against the brief
- **Against the brief:** my first command included `git fetch -q origin` in the main checkout. That is a network fetch other than `gh`, and it updated remote-tracking refs there. origin/main stayed 84a16ed5, equal to the packet's. Nothing else was written outside the permitted places.
- **Beyond the brief:**
  - a second clippy run limited to engine and kernel, because the workspace run never reached them;
  - each mutation ran the whole engine test binary (E1 and E2), not only the named test;
  - mutation scripts were dry-run once on a scratch copy of engine/, since deleted.

## The packet's gaps
- It did not say that the workspace clippy stops at spatial-renderer before engine and kernel, so none of the seven files is linted that way.
- It did not list which tests are "every test that asserts a fixture hash" (§5, I-5); I found them by search.
- It did not give #294's merge time; I read it with `gh pr view 294`.
- It did not say whose words ADR-016's heading and italic line are; the custodian's and the worker's, under the settlement's shape, is my reading.
- It did not give the line numbers of the tests' assertions at the head. The worker's recorded panic lines are at 8cce80ca, before commit 3's docs moved them; I read the head's lines myself.

## Hold lines (this project only, `also=` elided)
Each was `MACHINE_HOLD shared project=SpatialIDE cores=0-7 affinity=FF shell=bash.exe:<pid>`, followed by `MACHINE_RELEASED project=SpatialIDE shell=bash.exe:<pid> affinity=FF (cores 0-7)`:
- 40896: workspace suite
- 44372: workspace clippy
- 78772: engine and kernel clippy
- 6020, 78208, 17368: engine test, kernel test and unit test, unmutated
- 72052, 32472: M-1, engine and kernel
- 56684, 78276, 51532: M-2, M-3, M-4
- 58020: M-5
- 8936: verify-quotes
- 23512: node --test

No hold was refused (no exit code from 96 to 99).

## Background shells left
None. Every background command (the suite, both clippy runs, nine export runs, verify-quotes, node --test, and one bounded wait loop that ended on its own timeout) finished and reported; I killed nothing. The worktree's porcelain is empty at HEAD f82adfc5. D:/wt-targets/8g-g1r-export, 8g-g1r-target, 8g-g1r-tmp and 8g-g1r-xtmp are all gone. Scratch files are `<S>/8g-g1r-*`.
