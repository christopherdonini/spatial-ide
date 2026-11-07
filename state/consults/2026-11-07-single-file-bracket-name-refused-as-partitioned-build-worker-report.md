*Custodian's filing note (2026-11-07): filler entry 8f, `single-file-bracket-name-refused-as-partitioned`, built by a worker-high (claude-sonnet-5-5, by its transcript) on `cut/single-file-bracket-name-refused-as-partitioned` from main d37112d8, head 0307fdfb, under the form's Amendment 1 (the ESCAPED shape), from its brief by path and sha256 (15633 bytes, sha256 91e8fc686174c78c89210843e09e9915d41e056d95b3969659e24a39364d0204). Its transcript runs from 2026-11-07T13:22:41.494Z to 2026-11-07T16:20:23.528Z; unique calls 254 (Bash 177, Edit 35, Read 25, Write 13, Grep 3 and the hand-back), equal to the notification's. Its writes are in its checkout and the session scratch folder only. The custodian's checks by git: origin's branch equals the head; the diff from the base names exactly the ten files of section 7's ESCAPED row; four signed-off commits; no process of the run left, by command line.*

*The four items the report names as lost to its compaction, read by the custodian from its transcript: at the start, the checkout's HEAD equal to the base, its porcelain empty, `.cargo/config.toml` sha256 6889110645ec075c0cba3bf4aa71c4b43e5b5dfafe7d5a3e8228c05c5010e35f, and D: at 222G available; the I-3 grep and `verify-test-claims` each rc 0 at the base, no record naming the old test name (I-7); SKP-V0's versioning rule read at the base, with no stop and no reading of it stated (I-5); `describe`'s `row_count` from the identity's verified rows and its `extent` the constant `not-established-at-open`, so K1 also drains a stream, as the form's "What I could not settle" provides; after each of M1, M2 and M3, `engine/src/dataset.rs` at sha256 637ecf681f29c8613c7cdd360b525118e72a32495dbed3acdc491b2c39a2a6e3, equal to commit 2's; every cargo call in a shared hold, released, with no exclusive hold. The final suite started after commit 4 (2026-11-07T16:31:48+01:00), so it ran at the head: 1024 passed, 0 failed, 66 ignored. One user-profile path, at the report's line 3, is replaced by `<the session's subagent transcript folder>\agent-a9a5dcc0791a2ed2b.jsonl`; the report is otherwise byte-identical to its hand-back (sha256 3debb3bcd8a0f9a082d9f6ad2d4b1ed6b431129b5d714aa46179206f5dd8219c). A report, not Authority.*

---

Built: single-file-bracket-name-refused-as-partitioned at 0307fdfb2106eb2030bcef2f04235e8c5989dbf1

Gaps in this report: four items from the first half of the run did not survive a context compaction. They are the start-of-run HEAD, porcelain, config hash and D: free space; the base-check exit codes and the `describe` finding; the per-mutation revert sha256 lines; and the Hold lines other than "own project only". All four are in the transcript `<the session's subagent transcript folder>\agent-a9a5dcc0791a2ed2b.jsonl`. I did not retype them from memory. D: free space was not re-measured at the end; `df D:` does not resolve in this shell, and no step failed for space.

SHAPE AND BRANCH
- Shape: ESCAPED. `[` and `]` are escaped with F-escB (`[`→`[[]`, `]`→`[]]`). `{` and `}` go raw.
- Branch `cut/single-file-bracket-name-refused-as-partitioned`, base B = d37112d8ae70fd03606ea47327b679b5e2d38a7d.
- Pushed. origin/branch equals HEAD (0307fdfb2106eb2030bcef2f04235e8c5989dbf1) and `git status --porcelain` is empty.
- I took no PR action.

COMMITS (each subject names the piece, `commit -s -F`, no `@` outside the first trailer line)
1. 7b7f467d282862e759052f83e476086e004df22d (feat, the code)
2. 4f0d50cee15f0e48abd582053677b55f62af077d (test: E1, K1, T2)
3. e05a8b90 (docs, the comments; full id from `git log` of that commit)
4. 0307fdfb2106eb2030bcef2f04235e8c5989dbf1 (docs, the records)

CODE (commit 1)
- `partitioned_source_detail` gate:
  1. A directory is refused.
  2. `*` or `?` is refused by text, with the `\\?\` prefix set aside.
  3. `[ ] { }` with no file at the path is refused: same variant, same detail text.
  4. `[ ] { }` with an existing file returns None.
  5. Anything else returns None.
- `duckdb_literal_path` is `pub(crate)`, with no new `pub` item. It makes one pass over the original text.
- Helper sites:
  - In `engine/src/dataset.rs`: `read_kv_metadata`, `probe_schema` (two binds), `read_file_names`, `first_row_group_rows`, `covering_statistics`, `covering_sample` and `admit_identity`'s scan.
  - Also `engine/src/stream.rs` (`stream()`), `engine/src/index.rs` (`build_observed`) and `engine/src/rowgroup.rs` (`read_metadata`).
  - `layout.rs` is untouched. `Dataset::path()` and every non-DuckDB consumer keep the raw path.

TESTS (commit 2, byte-copied from drafts in scratch)
- E1: `engine/tests/single_file_bracket_name.rs::an_existing_single_file_whose_name_holds_a_bracket_or_a_brace_opens_and_streams_only_its_own_rows`.
  - It has 8 shapes (K1, K2, K3, four K4, K5), each keyless and native, at 500 / 300 / 200 rows.
  - Four assertions per row: admitted; row count is 500 and not a decoy's count (nor the decoy sum where that differs from 500); ids distinct; file sha256 unchanged.
  - K2's and K3's decoys total 500, so the sum comparison is skipped there. The distinct-id assertion tells the literal from the pair.
- K1: `kernel/tests/single_file_bracket_name_open.rs::open_dataset_admits_an_existing_bracket_named_file_and_describe_reports_only_its_rows`.
  - Deviation: `describe`'s extent is a constant (`not-established-at-open`) that reads no file, so the test also drains the stream from `host.catalog()` and asserts 500 distinct ids.
- T2: `engine/src/dataset.rs`, `the_reader_path_matches_only_the_literal_file_and_nothing_once_it_is_gone`, plus two helpers.
  - Rows in order: pair with L absent and a decoy present, pair with L present, lone `[`, lone `]`.
  - DuckDB's no-match error is observed from a plain absent path and compared, never typed.
- Disclosed: E1 does not exercise the `index.rs` and `rowgroup.rs` sites.

MUTATIONS (observed at 4f0d50cee15f0e48abd582053677b55f62af077d; each reverted; per-mutation revert sha256s are in the transcript)

| Mutation | E1 | T2 | K1 |
|---|---|---|---|
| M1: `path.is_file()` return removed | fails at assertion 1, K1 keyless row, with the partitioned refusal | passes (M1 not recorded for T2) | fails at the open, code `engine.identity_ordinal_partitioned_unsupported` |
| M2: helper returns its input | fails at assertion 2, left 300 / right 500 | fails at the L-absent pair row (`glob` lists `zones1.parquet`) | fails at the row count, `Some(300)` against `Some(500)` |
| M3: helper drops the `[` escape | fails at assertion 1, DuckDB no-match `...zones[1[]].parquet` | fails at the L-present pair row (`glob` lists nothing) | fails at the open, code `engine.source`, no-match text |

- M3 drops `[` only. Dropping `]` is an equivalent mutant and was not run (Amendment 1 (b)).
- Outputs are in `8fw-mutations.txt` and `8fw-m{1,2,3}-{e1,t2,k1}.out` in the scratchpad.

COMMENTS WRITTEN (commit 3). The only non-comment change is the test rename.
- `partitioned_source_detail` doc:
  - The five steps. These rest on the gate code: `is_dir`, the `GLOB_METACHARACTERS` find, and `!matches!(found, '*'|'?') && path.is_file()`.
  - Step 0, citing the form's Amendment 1 by path and name with no line numbers, DuckDB 1.5.5 in `duckdb` 1.10505.0 on Windows:
    - A bracket pair reads a decoy.
    - A lone bracket reads the file.
    - `{` and `}` read the file raw.
    - The escaped form reads the file when present and none when absent.
  - Routes: `[`/`]` escaped, `{`/`}` raw.
  - Not claimed, per Amendment 1 (c), (d) and (e): the file removed between the stat and the call; a Linux bracket in the first component of an absolute path; Windows letter-case differing in a bracket-holding component.
  - "Only Windows was run in step 0."
  - The A5 paragraph is kept.
- Stale paragraphs replaced:
  - "Every metacharacter DuckDB expands", the "trade-off" paragraph and the "not stat-ing" paragraph are gone.
  - The new inline comment says `*`/`?` are decided by text, a stat decides the other four, the list is scanned in order (so `*`/`?` wins when mixed), and the answer depends on what is on disk.
  - Its last clause rests on the unchanged `format!` text.
- `open_inner` gate comment: gains "asks the filesystem a stat and no more, and a path holding `[ ] { }` that is an existing file is not refused here".
- `duckdb_literal_path` doc: the one pass, `{`/`}` copied, the sites list, `layout.rs` not rewritten, `Dataset::path` raw.
- E1, K1 and T2 docs with `RECORDED MUTATION (observed at 4f0d50cee15f0e48abd582053677b55f62af077d)` lines taken from the outputs above; T2's helper docs.
- `session_identity.rs`:
  - Renamed `every_glob_metacharacter_read_parquet_expands_is_refused_by_name` to `a_path_holding_any_glob_metacharacter_where_no_file_exists_is_refused_by_name`. Form §2.4 requires the rename because class C is R0.
  - Its doc no longer states the refused-literal trade-off.
  - Assertions are unchanged.
  - I-7 shown: the old name starts with `every_`, which is not a recognised narrative prefix. Only the 8f form names it. `verify-test-claims` passes at head.
  - No comment states DuckDB's fallback as fact and no code comment carries a `path:line` cite.

RECORDS (commit 4). These are DRAFTS for the human's wording; no line says they are approved.
- KNOWN-LIMITATIONS item 20:
  - The title now names `[ ] { }` as admitted, and `*`/`?` as not admitted.
  - The three routes are stated.
  - It says "observed on Windows, with the DuckDB the build bundles".
  - It names bounds (d), (e) and (c) as not claimed.
  - Its cite comment now names `open_inner`'s gate, `partitioned_source_detail`'s doc, `duckdb_literal_path` and the form's Amendment 1 by name. The two old `dataset.rs` pins are dropped. The `error.rs` pin is kept.
  - I edited item 20's lines only.
- `protocol/skp/SKP-V0.md` §1: the refusal sentence is rewritten the same way and points to item 20 for what is not claimed.
- `engine/README.md`: the Last verified clause (`at e05a8b90`), the E1 name in the Open and admission pinned-by list, and this form's path in the preregistration list, between MULTIPOLYGON and SOURCE-WATCHER.

CI (head 0307fdfb)
- Governance CI (plan, queue, site): success
- Product CI — Rust workspace (run 42388945770): success. Both L1 jobs passed, ubuntu-24.04 and windows-latest.
- Product CI — shell: success
- Rust fmt: success
- Ported notices: success
- No failed or cancelled run, no re-run.

SIZE AND NAMES: `git diff --name-only B...HEAD` lists exactly the ten ESCAPED files.
- KNOWN-LIMITATIONS.md: 14 added / 9 deleted
- engine/README.md: 3/3
- engine/src/dataset.rs: 219/32
- engine/src/index.rs: 1/1
- engine/src/rowgroup.rs: 1/1
- engine/src/stream.rs: 5/5
- engine/tests/session_identity.rs: 7/6
- engine/tests/single_file_bracket_name.rs: 228/0
- kernel/tests/single_file_bracket_name_open.rs: 135/0
- protocol/skp/SKP-V0.md: 5/2
- Total: 618 added, 59 deleted (677 together).
- **Class 8 overrun of the 480 ceiling.** It is over on added lines alone (by 138) and on the sum (by 197). I did not trim and did not edit the form. The form's counting rule says only `git diff --numstat`, with no stated added/deleted convention.
- Most of the size is the two new test files (363 lines) and the comment docs in `dataset.rs`.

CHECKS AT HEAD (exit code, last line)
- `cargo fmt --all -- --check`: rc 0.
- `cargo test --workspace --locked` in a shared hold: rc 0, **1024 passed, 0 failed, 66 ignored**. Base was 1021, so only the 3 new tests were added.
- `node scripts/plan/verify.mjs --offline`: rc 0, "verify:plan PASS".
- `verify-cites.mjs`: rc 0, "PASS — every rooted (in-tree) path:line reference across 2734 file(s) resolves".
- `verify-quotes.mjs`: rc 0, "PASS — 138 checked, 107 verified, 30 baselined".
- `verify-test-claims.mjs`: rc 0, "PASS — all 751 claimed test(s)".
- `node --test` of the plan, hooks and evidence suites: rc 0, 598 pass, 0 fail.

STOP RULES AND DEVIATIONS
- No stop rule fired.
- Deviations: the K1 stream drain above, the not-exercised `index.rs` and `rowgroup.rs` sites, and the class 8 size overrun.
- Linux behaviour was not observed locally. It rests on the green ubuntu L1 run.
- Step 0's DuckDB facts are Windows-only.
- The README "Last verified" clause names e05a8b90, a branch commit. If the merge squashes, that id will not be on main.

HOLDS: every cargo call ran in a shared hold, `-Project SpatialIDE`, cores 0-7 affinity FF, each released (`MACHINE_RELEASED project=SpatialIDE ... (cores 0-7)`). I used no exclusive hold and no `-TargetPid`. `also=` is elided.

BACKGROUND SHELLS: none left. Every background wait loop and the final-suite hold completed (see the completion notices).

MODEL: Sonnet 5.5 (claude-sonnet-5-5).
