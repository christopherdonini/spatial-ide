*Custodian's filing note (2026-11-09): lead-data's five-line form draft for filler entry 13, `duckdb-literal-path-index-and-rowgroup-tests`, read only at main 8e4fdb07. Its brief was given by file (7339 bytes, sha256 e8cb8c503ec11018ccb20256fb001841fac13cb1d895823948105ed610fec44d), with the in-flight paths by git and the reuse index's output byte for byte. Dispatched at 2026-11-09T21:42:21.850Z by its transcript; the run went to 2026-11-09T21:51:29.357Z (claude-opus-5-5; unique calls: Read 33, Grep 19, Glob 2, the hand-back, 55 in all; no errored call; no Write or Edit call). The report below was extracted by script from the hand-back in that transcript (26186 bytes, sha256 b3cbed0457d6ecf93359e8d003b5bf2c8bbea8b8fdbc94130886d78c12750daa) and is unchanged. Every repository path it cites is one its Read calls opened, except five it read through Grep's matched lines (`state/FILLER-QUEUE.md`, `engine/src/identity.rs`, `scripts/plan/verify-test-claims.mjs`, `.github/workflows/product-ci-rust.yml` and the human's message of 2026-11-09 on item 4) and the form's own path, not yet a file. The custodian checked by script, at 8e4fdb07: its three byte-copied blocks (index.rs :325-333, rowgroup.rs :391-398, dataset.rs :1930-1940), each equal to the lines it names; each mutation's old text, once in its file; and `duckdb_literal_path` on index.rs :332 and rowgroup.rs :397 only, among the two files' lines. Its OPEN-1 (A) to OPEN-4 (A) are taken under item 4 of 2026-10-31, held to 2026-11-16. A draft, not Authority: the form is committed in the same commit (`governance/forms/engine/DUCKDB-LITERAL-PATH-INDEX-AND-ROWGROUP-TESTS-PREREGISTRATION.md`).*

---

Draft: duckdb-literal-path-index-and-rowgroup-tests, five-line form, lead-data

*This is lead-data's draft. I read it only, against the working tree of C:/dev/spatial-ide, which I take to be main 8e4fdb0719c68dace77be0a154ee99feba424400. Text marked byte-copied is copied from my Read results. Everything else is my own words; where it says I or my, it means lead-data. Every cite is written `path:line @ 8e4fdb0719c68dace77be0a154ee99feba424400`, for the custodian's script to pin. I have no shell, so I give no sha256, and I leave no background shell.*

## The form

Form path: `governance/forms/engine/DUCKDB-LITERAL-PATH-INDEX-AND-ROWGROUP-TESTS-PREREGISTRATION.md`.
- The template sets no path. governance/README.md:23 @ 8e4fdb0719c68dace77be0a154ee99feba424400 says a new form goes in `governance/forms/<folder>/`, where the folder is the first path segment of the code the form is about. Here that is `engine`.
- governance/forms/ has no index file: a Glob for `governance/forms/*.md` found none.
- 8f's form is in the same folder.

```
Authority: PLAN node `duckdb-literal-path-index-and-rowgroup-tests` (governance/PLAN.yaml:6804-6820 @ 8e4fdb0719c68dace77be0a154ee99feba424400), filler queue entry 13, S3 (state/FILLER-QUEUE.md:36 @ 8e4fdb0719c68dace77be0a154ee99feba424400), placed by the human's message of 2026-11-07, 20:25Z (state/directives/2026-11-07-8g-open-1-b-adr-016-note-open-6-a-294-not-held-index-sites-narrowed-entry-13-x2-into-item-20.md:11 @ 8e4fdb0719c68dace77be0a154ee99feba424400); run in the filler slot under AUTONOMY §36 (governance/AUTONOMY.md:692 @ 8e4fdb0719c68dace77be0a154ee99feba424400): a five-line form under §21c's size, the reviewer and the architect gating from dispatch, §25 (e) set aside; what it answers: 8f's gate 1 reviewer's EV-1 and its probe X1 (state/consults/gates/2026-11-07-single-file-bracket-name-refused-as-partitioned-gate1-reviewer.md:20-24 and :137 @ 8e4fdb0719c68dace77be0a154ee99feba424400), the gate 1 architect's N2 (state/consults/gates/2026-11-07-single-file-bracket-name-refused-as-partitioned-gate1-architect.md:59 @ 8e4fdb0719c68dace77be0a154ee99feba424400), and 8f's Amendment 4 (governance/forms/engine/SINGLE-FILE-BRACKET-NAME-REFUSED-AS-PARTITIONED-PREREGISTRATION.md:498-504 @ 8e4fdb0719c68dace77be0a154ee99feba424400); the human's rulings on gate rounds, Part 1, items 1 to 9, by reference (state/directives/2026-11-05-main-architect-gate-rounds-part-1-rulings-review-packet-design-part-3-additions.md:28-64 @ 8e4fdb0719c68dace77be0a154ee99feba424400); evidence, not Authority: 8f's step 0 table for K1 and K7-K1 (state/consults/2026-11-07-single-file-bracket-name-refused-as-partitioned-step0-tester-high-report.md:56, :63, :74, :80 @ 8e4fdb0719c68dace77be0a154ee99feba424400); drafted by lead-data, read at main 8e4fdb0719c68dace77be0a154ee99feba424400; reuse index: two misses, no prior art recorded for "duckdb path escaping test" or for "mutation test unreached code path" (tools/reuse.mjs in the reuse clone at 89bbac3738dbb46d47988e55a7c0f0d4f9fe4c5c, exit 1 each, run by the custodian).
Scope: engine/tests/single_file_bracket_name.rs (1 file); declared line budget 150, counted as insertions plus deletions over non-generated code and tests under §21c's rule, this form excluded, by `git diff --numstat origin/main...HEAD -- engine/tests/single_file_bracket_name.rs` at a named commit (estimate 95).
Change: two tests are added beside E1, one for each site that 8f routes through `duckdb_literal_path` and that no test observes. Each writes, through `spatial_engine::fixture::write_geoparquet`, an existing `zones[1].parquet` of 500 features (native unique `id`, the default covering) beside a decoy `zones1.parquet` of 300 features (E1's K1 shape and seeds, in a directory of the test's own). It opens the file with `Dataset::open_cancellable`, then builds one index through the public seam that calls the site: `Dataset::build_index` reaches `SpatialIndex::build_observed` (engine/src/index.rs), and `Dataset::build_row_group_index` reaches `RowGroupIndex::read_metadata` (engine/src/rowgroup.rs). Each asserts that the built index describes the literal file and not the decoy. No line outside the test file changes: no product line, the helper, a comment, a README, a record or a fixture.
Tests+mutation: (new) `an_index_built_over_an_existing_bracket_named_file_holds_only_that_files_features`: after the open, `build_index(&CancelToken::new())` is Ok, and its report's `indexed_features` and `scanned_rows` each equal 500, the literal's count, not the decoy's 300. Mutation M-I, in engine/src/index.rs, its old text occurring once: `p = crate::dataset::duckdb_literal_path(path).replace('\'', "''"),` becomes `p = path.replace('\'', "''"),` (the reviewer's X1 at that site). Predicted: this test fails by name at its `indexed_features` assertion, 300 against 500. (new) `a_row_group_index_built_over_an_existing_bracket_named_file_reads_only_that_files_footer`: the literal and the decoy are written with `row_group_rows` and `chunk` at 100, so the literal has 5 row groups and the decoy 3. After the open, `build_row_group_index(&CancelToken::new())` is Ok, and its report's `row_groups` equals `500.div_ceil(100)`, which is 5, not the decoy's 3. Mutation M-R, in engine/src/rowgroup.rs, its old text occurring once: `.query([crate::dataset::duckdb_literal_path(path)])` becomes `.query([path])` (X1 at that site). Predicted: this test fails by name at its `row_groups` assertion, 3 against 5. Each mutation is observed at the test commit on Windows, by itself. The worker applies it, runs `cargo test --locked -p spatial-engine --test single_file_bracket_name` (expected rc 101, with exactly that site's test failing and the other two tests in the file passing), records the failing assertion and the full commit id in the test's `RECORDED MUTATION` doc line, and reverts with `git checkout -- <file>`, showing `git status --porcelain` empty. Unmutated, the same command exits rc 0. No `verify-mutation` run is called an observation. No `#[ignore]`, `cfg`, sleep, retry or timeout is used, and E1's name, rows and assertions are byte-unchanged. A survival of either mutation by its own test is a stop that returns to the architect. If the unmutated open or build is refused, that is also a stop: the fix would touch a non-test line, which is the human's.
Out-of-scope: ADR: none (no status, text, note or amendment). Security: none (nothing ADR-020, ADR-009 or ADR-021 governs). Wire: none (no SKP, data-plane, MCP or kernel file). Guarantee: none. No stated guarantee, invariant, undo class or cancellation behaviour changes, and no existing test's assertion or name changes. The two tests observe the routing that 8f's Amendment 4 records as unobserved, and they claim nothing beyond their assertions: one platform's mutation runs (Windows), no Linux bracket-in-the-first-component case, no timing, no docs/08 figure. §25 (e) is set aside for a filler by §36. No new dependency, product seam, `pub` item, string a user sees or cfg site; Cargo.toml and Cargo.lock are unchanged.
```

---

## Notes (mine)

### N1. Each site at main, byte-copied

**`build_observed`** (engine/src/index.rs:313-333 @ 8e4fdb0719c68dace77be0a154ee99feba424400; the statement is interpolated). Byte-copied, :325-333:
```
        let sql = format!(
            "SELECT \"{id}\", {xmin}, {ymin}, {xmax}, {ymax} FROM read_parquet('{p}')",
            id = id_column.replace('"', "\"\""),
            xmin = covering.xmin.to_sql(),
            ymin = covering.ymin.to_sql(),
            xmax = covering.xmax.to_sql(),
            ymax = covering.ymax.to_sql(),
            p = crate::dataset::duckdb_literal_path(path).replace('\'', "''"),
        );
```

**`read_metadata`** (engine/src/rowgroup.rs:376-398 @ 8e4fdb0719c68dace77be0a154ee99feba424400; the path is bound). Byte-copied, :391-398:
```
        let sql = "SELECT row_group_id, row_group_num_rows, path_in_schema, stats_min_value, \
                   stats_max_value, stats_null_count FROM parquet_metadata(?)";
        let mut stmt = conn
            .prepare(sql)
            .map_err(|e| EngineError::Query(format!("row-group metadata prepare: {e}")))?;
        let mut rows = stmt
            .query([crate::dataset::duckdb_literal_path(path)])
            .map_err(|e| EngineError::Query(format!("row-group metadata: {e}")))?;
```

**The helper** (engine/src/dataset.rs:1919-1940 @ 8e4fdb0719c68dace77be0a154ee99feba424400). Its doc names both sites (:1927-1929). Byte-copied, :1930-1940:
```
pub(crate) fn duckdb_literal_path(path: &str) -> String {
    let mut out = String::with_capacity(path.len());
    for c in path.chars() {
        match c {
            '[' => out.push_str("[[]"),
            ']' => out.push_str("[]]"),
            other => out.push(other),
        }
    }
    out
}
```

**Callers** (Grep over engine/, kernel/ and every `*.rs`):
- `SpatialIndex::build_observed` is called by `SpatialIndex::build` (engine/src/index.rs:288-298 @ 8e4fdb0719c68dace77be0a154ee99feba424400), by `Dataset::build_index_observed` (engine/src/dataset.rs:771-788 @ 8e4fdb0719c68dace77be0a154ee99feba424400) and by the unit test `a_cancel_inside_the_index_scans_execute_window_ends_the_build_cancelled` (engine/src/index.rs:909-965 @ 8e4fdb0719c68dace77be0a154ee99feba424400).
- `read_metadata` is private. Its one caller is `RowGroupIndex::build` (engine/src/rowgroup.rs:331-347 @ 8e4fdb0719c68dace77be0a154ee99feba424400). That is called by `Dataset::build_row_group_index_observed` (engine/src/dataset.rs:888-902 @ 8e4fdb0719c68dace77be0a154ee99feba424400) and, directly, by engine/tests/first_batch_and_pruning.rs:564-574 and :904 @ 8e4fdb0719c68dace77be0a154ee99feba424400.
- `Dataset::build_index` and `Dataset::build_row_group_index` (engine/src/dataset.rs:730-732, :853-855 @ 8e4fdb0719c68dace77be0a154ee99feba424400) are called only by tests: engine/tests/spatial_index.rs, planner_seam.rs, row_group_seam.rs, index_build_cancellation.rs, first_batch_and_pruning.rs, covering_names_missing_column.rs, kernel/tests/first_batch_factorial.rs and kernel/tests/indexed_budgets.rs.
- No caller is in kernel/src. engine/README.md:549 @ 8e4fdb0719c68dace77be0a154ee99feba424400 lists both as experimental seams.

### N2. What a test can reach, and the path that shows a difference

- **Both sites are already reached by tests, through plain names.** For a name with no `[` or `]` the helper returns its input, so those tests cannot tell the escaped form from the raw one. That is why X1 left E1, T2 and K1 green. My reading of the human's "no test reaches either site" (directive :11) is therefore: no test passes those sites a path the escape changes. This is my reading, not a correction of the human's words.
- **No seam is needed.**
  - The `Dataset` route hands each site the raw `self.path().to_str()` (dataset.rs:771-774 and :888-891), and the site applies the helper itself.
  - `SpatialIndex::build` and `RowGroupIndex::build` are `pub`, so a direct call would also work (OPEN-1 (B)).
  - Nothing here needs a product caller or a change to a non-test line.
- **The discriminating path is K1's shape:** `zones[1].parquet` beside `zones1.parquet`.
  - In step 0, under F-raw, every function family read the decoy, 300 rows, and never L. Under F-escB they read exactly L (step 0 report :63). All six observations agreed, so the interpolated `read_parquet` (O6) and the bound `parquet_metadata` (O5) agreed too (:56, :80, :82 @ 8e4fdb0719c68dace77be0a154ee99feba424400).
  - So the raw path at `build_observed` would scan the decoy's 300 rows, and the raw path at `read_metadata` would read the decoy's footer.
  - The lone `[` and lone `]` rows read L even raw (:66), and the braces are routed raw. Neither could fail under X1, so each test has one row.
- **What each test asserts** (fields read in their existing tests):
  - The index test asserts `IndexReport.indexed_features` and `scanned_rows` against the literal's count. engine/tests/spatial_index.rs:110-118 @ 8e4fdb0719c68dace77be0a154ee99feba424400 asserts `indexed_features` against the fixture's count.
  - The row-group test asserts `RowGroupReport.row_groups` against `features.div_ceil(row_group_rows)`, as engine/tests/first_batch_and_pruning.rs:259-263 @ 8e4fdb0719c68dace77be0a154ee99feba424400 does.
  - With one group per file the count would not tell the files apart. That is why the row-group test sets `row_group_rows` and `chunk` to 100 (fixture.rs:445-462 @ 8e4fdb0719c68dace77be0a154ee99feba424400; the default is 1 048 576, :692).
- **The crate's own shape, reused:**
  - E1's file already declares `LITERAL_FEATURES` 500, `DECOY_A_FEATURES` 300 and its seeds (engine/tests/single_file_bracket_name.rs:14-18), the K1 shape (:30-35), and the helpers `fixture_root`, `spec` and `write_file` (:86-118, all @ 8e4fdb0719c68dace77be0a154ee99feba424400).
  - The default fixture writes a covering and a native unique `id` (engine/src/fixture.rs:681-705 @ 8e4fdb0719c68dace77be0a154ee99feba424400). Both builds need a covering (dataset.rs:747-751, :863-866).
  - The inputs are built through the real producer, and each test crosses the engine-to-DuckDB boundary, under Part 1, item 7 (directive :58-62).
- **Each test gets its own directory under `fixture_root()`.** Tests in one binary run on parallel threads, and E1 deletes and rewrites its own directories (:171-172). The two index caches are keyed by path (index.rs:681-704, rowgroup.rs:652-674), and a fresh path cannot meet an earlier entry.
- **The session tier is left out (OPEN-4).** `build_observed` selects the identity's source column from `read_parquet` without `file_row_number=true` (index.rs:326). For the session tier that column is `file_row_number` (engine/src/identity.rs:92-98 @ 8e4fdb0719c68dace77be0a154ee99feba424400). So, by my reading only, a session-tier dataset cannot build the spatial index. I have not observed this and claim nothing.

### N3. The mutations

| | M-I | M-R |
|---|---|---|
| File | engine/src/index.rs | engine/src/rowgroup.rs |
| Old (once in the file) | `p = crate::dataset::duckdb_literal_path(path).replace('\'', "''"),` | `.query([crate::dataset::duckdb_literal_path(path)])` |
| New | `p = path.replace('\'', "''"),` | `.query([path])` |
| Must fail | the index test, at `indexed_features` (300 against 500) | the row-group test, at `row_groups` (3 against 5) |
| Command | `cargo test --locked -p spatial-engine --test single_file_bracket_name` | the same |
| Expected exit | rc 101, one failing test | rc 101, one failing test |
| Revert | `git checkout -- engine/src/index.rs`, porcelain empty | `git checkout -- engine/src/rowgroup.rs`, porcelain empty |

- Both new texts are X1's (reviewer :21). X1 compiled and ran there (rc 0, 0, 0), so neither mutant should fail to build.
- **The sequence:**
  1. Commit the tests (commit T).
  2. Observe M-I and M-R at T.
  3. Add the two `RECORDED MUTATION` doc lines naming T's full id, in a later commit that changes doc lines only. This is E1's convention (single_file_bracket_name.rs:155-161).
  4. Keep each `RECORDED MUTATION` paragraph last in its doc and short, so the test's name falls within verify-mutation's 500-character window (scripts/plan/verify-mutation.mjs:13-22 @ 8e4fdb0719c68dace77be0a154ee99feba424400; the tool's behaviour at that commit).
- **A survival that is a coverage finding, not a stop:**
  - Under either mutation, E1 and the other site's test passing. That is expected, because each test aims at its own site. X1 already showed it for E1, T2 and K1.
  - The existing index and row-group suites passing under either mutation. Their names hold no bracket. They are not run as a condition.
  - The other half of the helper. Dropping only `[` is T2's and E1's mutation. Dropping only `]` is an equivalent mutant on this DuckDB (8f's Amendment 1 (b), the form at :474 @ 8e4fdb0719c68dace77be0a154ee99feba424400), and is not run.
  - Linux. The mutations are observed on Windows only, as in step 0. Linux CI runs the tests unmutated.
- **A stop:**
  - Either new test passing under its own mutation.
  - The unmutated open or build being refused.

### N4. The route

- **Files:** 1, within §21c's 8 (governance/AUTONOMY.md:347-357 @ 8e4fdb0719c68dace77be0a154ee99feba424400).
- **Lines** (my estimate, insertions only, tests counted; there are no deletions):

| Part | Lines (about) |
|---|---|
| index test: doc with its mutation paragraph | 10 |
| index test: body (directory, two writes, open, build, two assertions, rustfmt'd) | 35 |
| row-group test: doc | 10 |
| row-group test: body, with its spec | 38 |
| the module doc, one sentence written after the code (Part 1, item 1) | 2 |
| **Total** | **about 95** |

- **The other bounds:**
  - §21c: no new exposure surface, dependency or user-visible behaviour.
  - §21a's four categories (:315-332): none touched (the Out-of-scope line).
  - The nearest category is "any property currently under test". No existing test's property or assertion changes; the two tests add an observation.
- **So a five-line form fits**, and §21b would allow the single gate (:334-345). The smallest true reading is 1 file and about 95 lines. Scope is not trimmed: OPEN-1 (B) would be 2 files of about the same size.
- **Overruns:** an overrun past 150 is class 6 (docs/PREREGISTRATION-TEMPLATE.md:125-131 @ 8e4fdb0719c68dace77be0a154ee99feba424400), with Scope not edited.
- **Gates:** under §36 (:692), the reviewer and the architect gate from dispatch, as 8f's own piece had both gates. §25 (e) is set aside.
  - The architect's checklist fails a five-line form whose Out-of-scope line names a §21a category (.claude/agents/architect.md:15 @ 8e4fdb0719c68dace77be0a154ee99feba424400). This line names none.
  - The architect has no shell, so the reviewer makes the re-runs (N5).
- **Grade and strings:** S3. No string a user sees. No red-line text inside Scope.
- **The PLAN node:** its `gate` is `none` (PLAN.yaml:6813). The custodian sets it to this form's path when the form is committed. verify-test-claims then reads the two new names as planned until the node is done, and as binding after (scripts/plan/verify-test-claims.mjs:32-40 @ 8e4fdb0719c68dace77be0a154ee99feba424400; the tool at that commit). The worker uses the names exactly as written.

### N5. Verification (every cargo call inside a shared hold; under §36 a filler takes a shared hold only)

The worker uses its own checkout and its own new target.

**At the base:**
1. `git rev-parse HEAD`, rc 0.
2. `git grep -n "duckdb_literal_path" -- engine/src/index.rs engine/src/rowgroup.rs`, rc 0. Expected: exactly two lines, index.rs:332 and rowgroup.rs:397 as at 8e4fdb07, each the old text of N3. The grep is self-tested positive by that match.
   - Any other count stops the piece before code.

**At the head:**
1. `cargo test --locked -p spatial-engine --test single_file_bracket_name`, rc 0, with E1 and the two new tests passing.
2. M-I and M-R, as N3: rc 101 each, each reverted, porcelain empty after.
3. `cargo test --workspace --locked`, rc 0, the full suite in one shared hold before any gate (Part 1, item 4, directive :43-46).
4. `cargo fmt --all -- --check`, rc 0 (CI's rust-fmt).
5. Clippy, recorded and not claimed: `cargo clippy --locked -p spatial-engine --all-targets -- -D warnings`.
   - CI runs no clippy: product-ci-rust.yml:233-234 @ 8e4fdb0719c68dace77be0a154ee99feba424400 runs `cargo test --workspace --locked`, and a Grep for `clippy` over .github/workflows finds only a comment at rust-fmt.yml:14.
   - A diagnostic in the new lines is fixed inside Scope. Any other diagnostic is recorded only.
6. `git diff --numstat origin/main...HEAD -- engine/tests/single_file_bracket_name.rs`: 150 or less. `git diff --name-only origin/main...HEAD`: that one file.
7. `node scripts/plan/verify-mutation.mjs --base origin/main --head HEAD`, rc 0. This is a pre-gate self-check and never an observation (template :172).
8. The governance checks as CI runs them, rc 0 each:
   - `node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs" "scripts/evidence/*.test.mjs"`
   - `node scripts/plan/verify-cites.mjs`
   - `node scripts/plan/verify-quotes.mjs`
   - `node scripts/plan/verify-test-claims.mjs`
   - `node scripts/plan/verify.mjs`
   - `node scripts/plan/forms-layout.mjs`

**The gates:**
- The reviewer re-runs the full suite at the reviewed head (Part 1, item 9: no reliance on CI yet) and re-observes M-I and M-R itself (item 9: mutation observations stay the gates' own). It also re-runs fmt and the counting command.
- The architect reads: the Out-of-scope line first, then N6 item by item, against the diff.

**CI:** both L1 entries of product-ci-rust, rust-fmt, and governance CI.

### N6. What must not change

- **Files:** every file but engine/tests/single_file_bracket_name.rs, among them:
  - engine/src/index.rs, engine/src/rowgroup.rs, engine/src/dataset.rs (the helper and its doc), engine/src/stream.rs and engine/src/fixture.rs;
  - engine/README.md (OPEN-3);
  - KNOWN-LIMITATIONS.md (item 20, :274-288 @ 8e4fdb0719c68dace77be0a154ee99feba424400, says nothing of the index sites and stays true);
  - 8f's form (OPEN-2);
  - every kernel/, protocol/ and frontends/ file;
  - Cargo.toml and Cargo.lock.
- **In the test file:**
  - E1's name, `SHAPES`, constants, helpers, rows, assertions and doc, apart from the one module-doc sentence N4 allows;
  - no existing test renamed.
- **Mutations:** each is applied only in the worker's checkout and never committed.

### N7. Rule (00) at main 8e4fdb0719c68dace77be0a154ee99feba424400

Rule (00): governance/AUTONOMY.md:609 @ 8e4fdb0719c68dace77be0a154ee99feba424400.

- **This piece's paths:**
  - engine/tests/single_file_bracket_name.rs;
  - this form;
  - the custodian's PLAN.yaml and FILLER-QUEUE.md edits.
  - Nothing under protocol/, no wire fixture, no Cargo.lock and no package-lock.json.
- **Against the brief's lists:**

| Branch | Its engine/ and protocol/ paths | Overlap |
|---|---|---|
| `cut/shell-resource-dir-dev-comments` (#304, draft) | none | none |
| `cut/port-2-macos-l1-and-app-dirs` | app_dirs.rs, lib.rs, lod.rs, the four lod_tier tests | none |
| `cut/b2-piece-1c-save-and-reopen` | none | none |
| `cut/b1-shell-half-pr-c` | none | none |

- Disjoint by those lists. The custodian checks again at dispatch.

---

## OPEN items

Under the human's direction of 2026-10-31, item 4, held to 2026-11-16 by item 1 of the message of 2026-11-09 (state/directives/2026-11-09-item-4-to-11-16-12c-open-a-d-taken-slot-2-order-pr-b-slot-1-availability-monday-list.md:9 @ 8e4fdb0719c68dace77be0a154ee99feba424400), each item that is not a red line takes my recommendation.

- **OPEN-1: where the two tests live.**
  - (A) **Recommended.** Both in engine/tests/single_file_bracket_name.rs, through `Dataset::open_cancellable` and the two `Dataset` builds.
    - 1 file, reusing E1's shape, seeds and helpers.
    - It is the route a future product caller would take, and it also catches an escape added a second time in dataset.rs.
  - (B) In each site's own `mod tests`, calling `SpatialIndex::build_observed` and `RowGroupIndex::build` directly with a hand-built `CoveringBbox`, as index.rs:909-965 does.
    - 2 files, test-module lines only. Each mutation is beside its test.
    - It does not cover the `Dataset` hand-off.
  - (C) A new file under engine/tests/. 1 file; E1's helpers would be copied.
  - Not a red line: each stays within the two sites' tests.
- **OPEN-2: 8f's Amendment 4 after the merge.**
  - (A) **Recommended.** 8f's form is not touched. Its Amendment 4 stays the record of 8f at its merge, and this form's closing amendment names the two tests and their observations by reference. Not a red line.
  - (B) An amendment to 8f's form saying the two sites are now observed. **Red line, as I read it:** it rewords a claim the human narrowed in their own words (directive :11), in a file beyond the tests.
- **OPEN-3: the owner's index.**
  - (A) **Recommended.** engine/README.md is not in Scope.
    - No pointer's target changes: E1's pointer at :539 and the experimental-seams pins at :549 stay true.
    - This form's entry in the preregistration list (:557), and any new pins, are lead-data's after-merge update under the pilot (governance/AI_DEVELOPMENT.md:749 @ 8e4fdb0719c68dace77be0a154ee99feba424400), as 12b's form left it.
  - (B) engine/README.md in Scope as a second file. **Red line:** the brief reads any file beyond the two sites' tests as a scope change to a ruled item.
- **OPEN-4: the session tier.**
  - (A) **Recommended.** A native-`id` row only, for both tests. One row per site is what the placement asks.
    - The reading that a session-tier dataset cannot build the spatial index (N2) is reported, unobserved, for the custodian to place if wanted.
  - (B) Also a keyless row in the row-group test.
    - `read_metadata` matches the identity by name and does not select it (rowgroup.rs:391-392, :460-463 @ 8e4fdb0719c68dace77be0a154ee99feba424400), so by my reading such a build completes with an `IdStatsAbsent` verdict.
    - It adds lines and no site.
  - Not a red line under (A) or (B). Any product fix for the session-tier index build would be one (a non-test line).

## What I could not settle

- Whether the working tree I read is byte-identical to 8e4fdb0719c68dace77be0a154ee99feba424400. I have no shell; the custodian's pin script settles it.
- Five unobserved readings, all settled by the worker's runs:
  - that the default fixture's covering lets `build_index` and `build_row_group_index` run on the bracket-named file once it is admitted;
  - that `row_group_rows` 100 with `chunk` 100 gives 5 and 3 row groups;
  - that each mutant compiles and fails where N3 predicts;
  - the line estimate;
  - whether the clippy run lists anything in the new lines.
- That a session-tier dataset cannot build the spatial index (N2, OPEN-4): a reading of the SQL only.
- Whether the raw path reads the decoy on Linux, as on Windows. Step 0 ran only on Windows, so the mutations are claimed for Windows only.
- The branches' contents beyond the brief's lists.

No sha256: I have no shell. No background shell was started.
