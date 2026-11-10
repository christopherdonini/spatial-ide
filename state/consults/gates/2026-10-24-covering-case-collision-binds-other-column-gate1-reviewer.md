Reviewed: PR #252 at 77bbbc63127b99810fb9a5372983f3d0ffdf5c70, gate 1, reviewer
Branch and commit: cut/covering-case-collision-binds-other-column @ 77bbbc63127b99810fb9a5372983f3d0ffdf5c70
Verdict: PASS WITH NOTES. There are no Correctness or Evidence findings. Two Documentation findings must be fixed before the merge, with no re-gate.

## Findings

### Correctness
None.

### Evidence
None.

### Documentation (must-fix before the merge)

**D-1. The KNOWN-LIMITATIONS comments cite the tests at a commit where the test file does not exist.**
- Where: `KNOWN-LIMITATIONS.md:118` (item 9's comment) and `KNOWN-LIMITATIONS.md:423` (item 53's comment), at the head.
- What is wrong: both comments read "Where the code does this, at 9fb3e4c3 on the piece's branch: …". The same sentence then names tests in `engine/tests/covering_case_collision.rs`: CC-2 and CC-7 in item 9's comment; CC-1 to CC-5, CC-7, G-1 to G-4, CC-8, CC-9 and G-5 to G-7 in item 53's comment.
- Proof: `git ls-tree 9fb3e4c3 engine/tests/covering_case_collision.rs` is empty. The file arrives in 21fb02d9: `git diff --stat 9fb3e4c3 21fb02d9` shows only that file, +624.
- The fix is in the slot only. The custodian chose 9fb3e4c3 for `<commit>`; §11's words are otherwise unchanged.
- Replacement words, for both comments: "Where the code does this, at 21fb02d9 on the piece's branch:"
- Clause check:
  - At 21fb02d9, `engine/src/dataset.rs` and the b1 test are byte-identical to 9fb3e4c3 and to the head. `git diff --stat 9fb3e4c3 77bbbc63 -- engine/src/dataset.rs engine/tests/b1_projection_hostile_names.rs` prints nothing. So every function the comments name (`read_file_names`, `check_names_align`, `judge_covering`, `field_path_exists`, `check_geometry_column`) is there.
  - At 21fb02d9 the test file holds every test both comments name.
- Whose wording: not the human's. Both are DRAFT comments for the human's sight, so the worker applies these words with no re-gate and the PR body lists them. The sentences themselves are unchanged.

**D-2. One sentence in the PR body misstates K2's rule.**
- Where: the PR body, "The change" list, third bullet.
- What is wrong: "Positions are aligned only when the resident schema holds as many fields as the file (K2, from the P0)." The code aligns the file's n columns with the first n resident fields, whenever the resident schema has at least n fields. Trailing resident fields are allowed (CC-6, `year`). Only fewer than n is refused, as (i-root). Read as exact equality, the sentence describes MKV, the mutation CC-6 kills.
- Replacement words: "The file's columns line up by position with the first resident fields. Any trailing resident fields, such as a `k=v` folder's key, are names the file does not hold. A resident schema with fewer fields than the file is refused as an internal inconsistency (K2, from the P0)."
- Clause check:
  - Clause 1: `field_path_exists` indexes `resident_level[j]` by the file's position j (`engine/src/dataset.rs:1645`), and `check_geometry_column` indexes `schema.fields()[j]` (`:2129`).
  - Clause 2: `check_names_align` refuses only `if m < n`. CC-6 asserts the resident names `["id", "geometry", "bbox", "year"]` with the covering kept.
  - Clause 3: when m < n, `check_names_align` returns `InternalInconsistency` with (i-root). MKV re-observed this refusal (see check 4).
- Whose wording: not the human's (a worker/custodian PR-body line). Applied with no re-gate.

### Notes (no class, nothing owed)
- **Indexing assumes the alignment check ran first.** `engine/src/dataset.rs:2129` (`&schema.fields()[j]`) and `:1645` (`&resident_level[j]` at the top level) are in range only because `check_names_align` runs first at the single call site (`:433`). Today that cannot panic. A `.get(j)` that returns (i-root) would make `check_geometry_column` and `field_path_exists` safe on their own.
- **Rule (00), sequencing.** #253 (`cut/b1-shell-half-pr-c`) appends items 54 to 56 at the same end-of-file point where this piece appends item 53. Whichever merges second has a textual conflict, and item 53 must end up before 54. The PR body already says so.
- **The compat corpus did not run.** The corpus test `m4_the_corpus_mutation_opens_with_its_covering_unusable_and_refuses_a_bbox_query_pre_lease` is `#[ignore]` (it needs the on-disk corpus), so no corpus file was opened here. §5's "any corpus row moving" invalidator therefore rests on D9's manifest reading, not on a run.

## Checks

**1. The diff.** `git diff --numstat ccd408f7...77bbbc63`, rc 0:

| file | insertions + deletions | §7 ceiling |
|---|---|---|
| `KNOWN-LIMITATIONS.md` | 6 + 0 = 6 | 6 |
| `engine/src/dataset.rs` | 276 + 49 = 325 | 330 |
| `engine/tests/b1_projection_hostile_names.rs` | 3 + 9 = 12 | 15 |
| `engine/tests/covering_case_collision.rs` (new) | 624 | 660 |

- `--name-only` lists exactly these 4 files, and nothing under `kernel/`, `protocol/` or `frontends/` (rc 0).
- The diff over `engine/src/error.rs`, `Cargo.lock` and `engine/Cargo.toml` is 0 bytes.
- A scan of the added lines finds no `pub`, `#[cfg`, `const` or `static` in `dataset.rs`. The only additions of that kind are test-local items in the new test file (`N`, `OFFSET`, `MORE_THAN_ONE`, types).
- `NameNode` and `PathWalk` are private. The only new import is `FieldRef`.

**2. The code, read whole at the head against §2.**
- **§2.1.**
  - `read_file_names` runs one statement, `SELECT name, num_children FROM parquet_schema(?)`, drained in full inside `cancellable(conn, cancel, …)`.
  - It runs on the open's connection, between `probe_schema` and `check_geometry_column` (`:432-434`).
  - Its errors are Source with the three draft texts. A NULL name is a row error; a NULL count reads as 0.
  - The pre-order rebuild refuses (i-tree) on a negative count, rows left after the root, or an unfinished subtree. An empty result also gives (i-tree).
  - `probe_schema` and `read_kv_metadata` are untouched; the script found no string literal at B that is missing at the head.
  - The two comments are updated as §2.1 says.
- **§2.2.**
  - `check_names_align` is K2's leading-N rule (`m < n` refuses with (i-root)) and runs before both checks.
  - The struct count check runs only when the walk descends.
- **§2.3, (a-p) first (OPEN-E).** The order is:
  1. `case_matches` over the root children: more than one match gives (a-p), with the names rendered in file order and byte-equal duplicates counted twice.
  2. A byte-equal `position` miss gives Source with D4's text; the D4 literal appears exactly once in the code.
  3. A resident name at j that differs gives (g).
  4. The U+0000 and type checks run on the resident field at j.
  - N-8 still reaches step 4. At main the byte lookup found the resident `geo\0m` (N-8 was GeoMetadata at main), and P0 g8 shows the file name byte-equal at that position. N-8 passes at the head.
- **§2.4.**
  - The U+0000 check comes first.
  - Then the first Ambiguous, Misbound or Inconsistent walk, in path order, returns `Err`. Absent is held back, so the first Absent path wins only when no path refuses.
  - The Absent detail is built from `p.0.join(".")` and `CoveringFinding` exactly as at B.
  - The walk at each level follows §2.4: (a), then Absent, then (b) comparing `R[j]` alone, then the descend and struct checks.
  - Empty paths cannot reach the walk: `parse_covering` refuses them (`engine/src/geoparquet.rs:635`).
- **§2.5.** `covering_finding` is still `Option<CoveringFinding>`; the only change is `?`.
- **§2.6 and Amendment 1 item 5, by script (`ccc-g1r-disp.mjs`, rc 0).**
  - The seven §2.6 templates each equal exactly one code literal, placeholders aside.
  - All 11 whole Displays in item 5 (CC-3, CC-4, CC-1, CC-2, CC-7, CC-8, G-1, G-2, G-5, G-6, G-7) are byte-equal to the strings the tests assert, after Rust string continuation is processed.
  - G-3's asserted Display appears inside `p0-output.txt:160` at main. G-4's equals G-3's with `GEOMETRY_1` in its place.
- **Kernel arms at the head.** `kernel/src/skp.rs:2060` is `EngineError::Source(_) => ("source", vec![])`, `:2115` is `InternalInconsistency { detail } => ("internal_inconsistency", …)` and `:2118` is `GeoMetadata(_) => ("geo_metadata", vec![])`. The kernel is unchanged in the diff.
- **§8 items 1 to 15.** No statement or `Connection` in the four pure functions; one counting site (`case_matches`); the read is inside `cancellable`; every refusal comes before `sanity_check`; no forbidden file is touched; no message states another module's consequence.

**3. The tests (shared holds, `CARGO_TARGET_DIR=D:/wt-targets/ccc`).**
- `cargo test -p spatial-engine --locked`: rc 0. The 48 `test result:` lines sum to 462 passed, 0 failed, 17 ignored.
  - All 17 §4 tests pass by their exact names.
  - `hostile_names_colliding_after_case_folding_bind_one_column_each`, N-8 (`a_geometry_column_whose_name_contains_u0000_refuses_open_naming_that_fact`), the covering_names_missing_column tests (4 passed, 1 ignored: m4) and both b1_projection_hostile_covering tests pass.
- `cargo test -p spatial-kernel --locked --test typed_terminal_codes --test skp_projection --test manual_walkthrough_fixtures`: rc 0.
  - typed_terminal_codes: 7 passed, including `the_prefix_is_the_convention_for_every_engine_refusal_not_a_special_case`.
  - skp_projection: 14 passed.
  - manual_walkthrough_fixtures: 0 passed, 22 ignored.
- The b1 edit is the only change to that file, as §4 says:
  - the `GEOMETRY` Col is removed;
  - `"GEOMETRY_1"` is removed from the assertion (rustfmt joined it onto one line);
  - the comment clause names G-5;
  - the test's name, its other columns and its assertions are unchanged.

**4. The mutations.** All 18 were re-observed at the head in `C:/dev/wt/ccc`.
- One scripted series ran in one shared hold: the script `ccc-g1r-mut.mjs` in my scratch folder, outer rc 0.
- Before the series:
  - A dry run checked that every edit anchor occurs exactly once.
  - An unmutated control run of the new file gave 17 passed.
- For each mutation, applied alone:
  - Each named test ran alone with `--exact`. It exited 101 with "0 passed; 1 failed" from a panic, never a compile error.
  - `git checkout -- engine/src/dataset.rs` then reverted the edit. The porcelain was empty and the file byte-equal to the head after every mutation.

| mutation | test | observed failure |
|---|---|---|
| M1 | CC-1 | "expected the open to be refused" |
| M2 | CC-2 | "expected the open to be refused" |
| M3 | CC-2 | "expected the open to be refused" |
| M4 | CC-3 | "expected the open to be refused" |
| M5 | CC-4 | "expected the open to be refused" |
| M6 | CC-5 | "the covering is dropped" |
| MKV | CC-6 | "the open succeeds: InternalInconsistency", detail "the file's footer lists 3 top-level column(s) but the schema probe reported 4; …" |
| MO | CC-7 | "expected the open to be refused" |
| MC8 (= MG7, one shared helper) | CC-8 | "expected the open to be refused" |
| MC8 (= MG7) | G-6 | "expected the open to be refused" |
| MC9 | CC-9 | `GeoMetadata("mutant")` |
| MC9 | `hostile_names_colliding_after_case_folding_bind_one_column_each` | `open: GeoMetadata("mutant")` |
| MG1 | G-1 | assert_eq failed; the left side is text (g) for `GEOMETRY` read under `GEOMETRY_1` |
| MG2 | G-2 | "expected the open to be refused" |
| MG3 | G-3 | GeoMetadata, with D4's text |
| MG10 | G-3 | GeoMetadata, text (g): `GEOMETRY` read under `geometry` |
| MG4 | G-4 | "expected the open to be refused" |
| MG6 | G-5 | "expected the open to be refused" |
| MG9 | G-7 | Source, with the text for `Geometry` |
| MK | CK-1 | "expected Cancelled, got GeoMetadata", text (a) `bbox.xmin`: `BBOX`, `bbox` |

- After the series: porcelain empty, HEAD 77bbbc63.
- No verify-mutation run was made. These are re-observations made by applying each mutation.

**5. KNOWN-LIMITATIONS, by script (`ccc-g1r-kl.mjs`, rc 0).**
- The form is byte-identical at B and at main a217c5f5.
- §11's item 53 block (form lines 505-507) and item 9 block (lines 513-514) each contain one `<commit>` slot. With the slot set to 9fb3e4c3, both blocks are found byte-equal in the head file:
  - item 9: 881 bytes, sha256 f0f7c07ba11fd0e46ee62d12cdefadc2185ce71b201bcae0d25fe9a31609ad3a;
  - item 53: 5506 bytes, sha256 825a7c3e6dd871fd906b0b0048f4eb3c231281977dd56bf7649aa2522934c6ec.
- Removing the two blocks from the head gives the file at B byte for byte, so nothing else changed.
- Placement: item 9's lines are at 117-118, after the earlier comments and before the blank line. Item 53 is at 421-423, after a blank line, at the end of the file. The file has no CR.
- D-1 concerns the slot's value, not this byte match.

**6. fmt and clippy.**
- `cargo fmt --all -- --check`: rc 0, no output.
- `cargo clippy -p spatial-engine --tests --locked` (in a hold): **rc 0**.
  - 39 `warning` lines, located in `stream.rs`, `rowgroup.rs`, `trace.rs` and ten existing test files.
  - 0 lines mention `dataset.rs`, `covering_case_collision` or `b1_projection_hostile_names`.

**7. The verify scripts**, run in the worktree at 77bbbc63. The tool's commit is the head; the scripts' last change is 1b529f497153519c139f34e8029ccdc752f9fdd0.

| script | rc | result |
|---|---|---|
| `verify-cites.mjs` | 0 | PASS, 2324 files |
| `verify-quotes.mjs` | 0 | PASS: 131 checked, 0 hash-reference errors, 856 ruling cites resolved |
| `verify-test-claims.mjs` | 0 | PASS, 656 claimed tests |
| `verify.mjs` | 0 | verify:plan PASS |

The porcelain was empty after the runs.

**8. CI.**
- `gh pr checks 252`: rc 0, all 11 checks pass.
- `gh run view` on each of the 8 runs gave headSha 77bbbc63127b99810fb9a5372983f3d0ffdf5c70, completed, success:
  - 40102264932 Product CI, Rust workspace (ubuntu L1 and windows);
  - 40102264805 Rust fmt;
  - 40102264833 Governance CI;
  - 40102264801 DCO;
  - 40102264834 Exposure scan;
  - 40085864385 Ported notices (push);
  - 40102264968 Ported notices (pull_request);
  - 40102264918 Product CI, shell.
- No run was in progress.

**9. Rule (00) at main a217c5f5.**
- origin/main is a217c5f5.
- The branches checked: open PRs #253, #251, #249, #244 and #241, plus `cut/b2-piece-1c-save-and-reopen` (7109aeb2) and `cut/port-2-macos-l1-and-app-dirs` (83d2ecef). For each I ran `git diff --name-only a217c5f5...origin/<branch>`, rc 0 every time.
- None touches `engine/src/dataset.rs`, `engine/tests/covering_case_collision.rs` or `engine/tests/b1_projection_hostile_names.rs`.
- Four touch `KNOWN-LIMITATIONS.md`, all at other items:
  - #253: items 54 to 56, appended at the same end point (see Notes);
  - #249: one line inserted at 411, in item 51;
  - #241: item 47;
  - port-2: lines 30, 32 and 400.

## Hold lines (my project's only)
- MACHINE_HOLD shared project=SpatialIDE cores=0-7, "covering-case gate 1 review: cargo test spatial-engine suite", then MACHINE_RELEASED
- MACHINE_HOLD shared project=SpatialIDE cores=0-7, "covering-case gate 1 review: cargo test three spatial-kernel test files", then MACHINE_RELEASED
- MACHINE_HOLD shared project=SpatialIDE cores=0-7, "covering-case gate 1 review: 18 mutations, cargo test one test each", then MACHINE_RELEASED
- MACHINE_HOLD shared project=SpatialIDE cores=0-7, "covering-case gate 1 review: cargo clippy spatial-engine tests", then MACHINE_RELEASED

No exit code from 96 to 99, and no timing-sensitive failure was seen.

## Deviations
- Each hold line added `echo rc=$rc` between `rc=$?` and the release, so the exit code is printed.
- Clippy ran without `RUST_TEST_THREADS`, because it runs no tests.
- Scratch files are all under `ccc-g1r-` names in my scratch folder. The worktree's porcelain is empty and its HEAD is 77bbbc63. I made no commit, push or PR action.

Files that matter:
- C:/dev/wt/ccc/engine/src/dataset.rs
- C:/dev/wt/ccc/engine/tests/covering_case_collision.rs
- C:/dev/wt/ccc/KNOWN-LIMITATIONS.md
- <the session scratch folder>/ccc-g1r-mut-out/ccc-g1r-mut-summary.txt (the mutation series' per-run results)
