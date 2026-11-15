*Custodian's filing note (2026-10-24): the worker-high's build of `covering-case-collision-binds-other-column` on its branch, from main ccd408f7 (the full form's Amendment 1), final head 77bbbc63127b99810fb9a5372983f3d0ffdf5c70; draft PR #252. The run 10:04:19Z to 11:15:40Z by its transcript (Read 11, Bash 58, Edit 3, Write 10; Edit and Write only on `engine/src/dataset.rs` and `engine/tests/covering_case_collision.rs` in its worktree and on its own scratch files, the b1 test and KNOWN-LIMITATIONS edited by its scratch scripts; the branch diff from ccd408f7 is the four files of §7; its one `git checkout` restores `engine/src/dataset.rs` after each mutation; no rebase, reset, merge, amend, force push or PR action). Extracted by script from its SubagentHandback call, with one final newline added; nothing else is changed. The clippy run's exit code was not printed (its own disclosure); gate 1 re-reads it. Its sha256, from line 5 to the end, is 40cf5e2676e324cfba066e5dc9f266aa92634ec6c1667ab726e14762e0759e45.*

---

Built: covering-case-collision-binds-other-column at 77bbbc63127b99810fb9a5372983f3d0ffdf5c70

The code, the tests, all 18 mutations and the KNOWN-LIMITATIONS words are done. Every check passed, with one exception: the clippy exit code was not printed (see Checks). Origin's branch equals HEAD and the porcelain is empty. No force push, no amend, no rebase, no PR action.

**Commits**, all signed off, all pushed one per call:
- 9fb3e4c3 `feat: covering-case-collision-binds-other-column code, form section 2 (dataset.rs) and the declared b1 test edit`. This is the commit that changes `dataset.rs`, so its short id fills the `<commit>` slots.
- 21fb02d9 `test: covering-case-collision-binds-other-column tests, form section 4 (covering_case_collision.rs)`
- 77bbbc63 `docs: covering-case-collision-binds-other-column KNOWN-LIMITATIONS item 53 and item 9's appended sentence, form section 11`
- Before each commit I showed that its message file has no `@` outside the Co-Authored-By line.

**The change against §2**, all in `engine/src/dataset.rs`:
- **§2.1** `read_file_names` runs one `SELECT name, num_children FROM parquet_schema(?)` inside `cancellable`. It rebuilds the tree iteratively in pre-order and refuses malformed rows as `InternalInconsistency` (i-tree). It sits between `probe_schema` and `check_geometry_column`. `probe_schema` and every resident name are untouched.
- **§2.2** `check_names_align` applies the K2 rule: it refuses only when the resident schema has fewer fields than the file has columns. The struct field-count check lives in the walk, along covering paths only.
- **§2.3** `check_geometry_column(schema, file, name)` runs in this order: more than one case match (a-p), then no byte match (the existing `Source` text, byte for byte), then renamed (g), then the existing U+0000 and type checks.
- **§2.4** `judge_covering` now returns `Result<Option<_>>` and takes the name tree. `field_path_exists` keeps its name and returns a `PathWalk`. The first ambiguous, misbound or inconsistent walk, in path order, wins over any absent path. One shared helper, `case_matches`, does all the counting for clause (a).
- No new variant, `pub` item, constant, dependency or `cfg`. `probe_schema`, `read_kv_metadata` and the Absent detail are unchanged.
- Callers: `read_file_names`, `check_names_align`, `check_geometry_column` and `judge_covering` are all called from `Dataset::open_inner` (dataset.rs lines 432-441).
- Seam: the kernel needs no change. `kernel/src/skp.rs:2060`, `:2115` and `:2118` map `Source`, `InternalInconsistency` and `GeoMetadata`, and the commit message cites them.
- Declared edit of `hostile_names_colliding_after_case_folding_bind_one_column_each`: I removed its `GEOMETRY` column and `"GEOMETRY_1"`, and changed the comment clause to name G-5.

**Tests** are in `engine/tests/covering_case_collision.rs`, 17 tests by their exact §4 names. Each assertion is the whole Display from Amendment 1 item 5, and each fixture is hash-verified before and after. All 17 pass at 21fb02d9. Each mutation was applied alone at 21fb02d9 and its named test run alone with `--exact`. The failure is an assertion, not a compile error, and `git checkout -- engine/src/dataset.rs` reverted it; the porcelain was empty after each.

| test | mutation | observed failure |
|---|---|---|
| CC-1 | M1 | "expected the open to be refused" |
| CC-2 | M2 | the same line |
| CC-2 | M3 | the same line |
| CC-3 | M4 | the same line |
| CC-4 | M5 | the same line |
| CC-5 | M6 | "the covering is dropped" |
| CC-6 | MKV | `InternalInconsistency` ("lists 3 top-level column(s) but the schema probe reported 4") |
| CC-7 | MO | "expected the open to be refused" |
| CC-8 | MC8 (the same edit as MG7) | "expected the open to be refused" |
| G-6 | MC8 (same edit) | "expected the open to be refused" |
| CC-9 | MC9 | `GeoMetadata("mutant")` |
| `hostile_names_colliding_after_case_folding_bind_one_column_each` | MC9 | `GeoMetadata("mutant")` |
| G-1 | MG1 | Display is text (g) for `GEOMETRY` read under `GEOMETRY_1` |
| G-2 | MG2 | "expected the open to be refused" |
| G-3 | MG3 | `GeoMetadata` with the same text |
| G-3 | MG10 | `GeoMetadata`, text (g), `GEOMETRY` read under `geometry` |
| G-4 | MG4 | "expected the open to be refused" |
| G-5 | MG6 | "expected the open to be refused" |
| G-7 | MG9 | `Source` with the text for `Geometry` |
| CK-1 | MK | `GeoMetadata` instead of `Cancelled` |

- I applied no `verify-mutation` run.
- The raw outputs are in my scratch folder, `ccc-c-mut/` (`summary.txt` plus one `.out` per run).

**KNOWN-LIMITATIONS** (commit 77bbbc63):
- Item 53 is appended after item 52 with one blank line. Item 9's two lines go after its two comment lines, before the blank line.
- Both blocks were checked byte-equal to §11 by script, with the `<commit>` slots set to 9fb3e4c3. Item 9 is 881 bytes, sha256 `f0f7c07ba11fd0e46ee62d12cdefadc2185ce71b201bcae0d25fe9a31609ad3a`. Item 53 is 5506 bytes, sha256 `825a7c3e6dd871fd906b0b0048f4eb3c231281977dd56bf7649aa2522934c6ec`.
- Item 53's comment line differs from the architect's consult only where the custodian's declared test-id slot fill (CC-8, CC-9, G-5 to G-7) put it. The other four lines match the consult exactly.
- Nothing of #249's or milestone 4 PR C's was touched. I did not do the `engine/README.md` owner's-index commit.

**§7 by file**, by the command over `ccd408f7...HEAD`:

| file | lines | ceiling |
|---|---|---|
| `engine/src/dataset.rs` | 276 + 49 = 325 | 330 |
| `engine/tests/covering_case_collision.rs` | 624 | 660 |
| `engine/tests/b1_projection_hostile_names.rs` | 12 | 15 |
| `KNOWN-LIMITATIONS.md` | 6 | 6 |

The total is 967 lines over 4 files. There is no overrun, no class 8, and no dependency, lockfile, fixture, wire or kernel change.

**Checks** at 77bbbc63:
- `cargo test -p spatial-engine --locked`, in a hold: exit 0. The 48 result lines sum to 462 passed, 0 failed, 17 ignored.
- `skp_error_codes` does not exist. The kernel tests that map these errors are `typed_terminal_codes`, `skp_projection` (K-1) and `manual_walkthrough_fixtures`, run with `cargo test -p spatial-kernel --locked --test ...` in a hold: exit 0. The results were 7 passed, 14 passed and 22 ignored.
- `cargo fmt --all -- --check`: exit 0.
- `cargo clippy -p spatial-engine --tests --locked`, in a hold: it finished and the tool reported no failure. I did not print `$?`, so I can't give the exit code. There are 39 warning lines, all in existing files (`rowgroup.rs`, `stream.rs`, `trace.rs`, other tests). None are in `dataset.rs`, `covering_case_collision.rs` or the b1 test.
- `verify-cites`, `verify-quotes`, `verify-test-claims` and `verify` (verify:plan): each exit 0 and PASS. `verify-quotes --show-cites` on the four changed files also exited 0.

**Invalidators and disclosures:**
- No §5 invalidator and no §8 item fired. No existing fixture raised an alignment `InternalInconsistency`.
- The code commit is separate from the tests commit. The code commit's tree has the edited b1 test, so existing tests stay green. The new tests arrive in the next commit.
- Process deviations:
  - My first `cargo check` hold call put an `export` before the hold line instead of using the exact shape. Every later call used the shape.
  - Early on I wrote a few `ccc-*.out` files into the parent folder of the cargo target. I moved them into my scratch folder, and nothing of mine remains there.
  - The mutation series ran as one script inside one hold. The script was my own and the only holder of that hold.
  - Every heavy command's output was redirected to a file.
- No timing-sensitive failure was seen.

**Hold lines**, my own project's only:
- hold shared SpatialIDE cores 0-7, "covering-case-collision code: cargo check spatial-engine tests"
- same, "cargo test the new test file and the two neighbours"
- same, "cargo test, 18 mutations one at a time"
- same, "cargo test whole spatial-engine suite"
- same, "cargo test three kernel test files"
- same, "cargo clippy spatial-engine tests"
- Each was followed by MACHINE_RELEASED.

**Off-scope noticed, not done:** the existing `engine/README.md` owner's index is waiting for #241's merge, as the brief says.

**Pre-gate self-check:**
- Cross-module use: the kernel arms were read at the lines cited above.
- Completion claims: each points to a transcript call.
- Messages: each message describes behaviour implemented at 9fb3e4c3.
- Assertions: every test reaches its whole-Display assertion, and the mutations prove it.

Model as the harness reports it: Sonnet 5.5 (claude-sonnet-5-5), no override, no context handoff. No process I started still runs: all background tasks completed, and I killed nothing.
