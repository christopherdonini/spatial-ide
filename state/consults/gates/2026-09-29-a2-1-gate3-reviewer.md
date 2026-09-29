*Custodian's filing note (2026-09-29): gate 3 (reviewer) of PR #143 for PLAN node `b1-close-nul-column-names`. Reviewed: cut/b1-close-nul-names-2 @ f4d81c5 (from the report's own first line). Filed under `state/consults/gates/` by `AUTONOMY.md` §25(b). It is transcribed from the hand-back message with the harness's two-space indent removed, and the text below the rule is the agent's. Its branch-only locations are kept as printed. Verdict FAIL, with blocking findings B1-B2: the N-15 and N-6 observation citations in doc comments, the same as the gate-3 architect's B1-B2. Both are handled by the architect's prescribed reduction (720f930, comment lines only). Its mutation table is the observation of record at f4d81c5 for every test it names (round 25, item 2 (c)). It also finds that round 2 is formatting-only in source, that 60 unserialized runs are clean, and that CI is green on f4d81c5. Profile paths redacted at filing: none.*

---

Reviewed: cut/b1-close-nul-names-2 @ f4d81c5
Verdict: FAIL

Worktree `C:\dev\wt\b1-close-nul-names`. Before starting I confirmed HEAD f4d81c51dc98 and an empty porcelain. Every cargo command used `CARGO_TARGET_DIR=C:\dev\wt\b1-close-nul-names\target`. Governing form: `engine/B1-PROJECTION-PREREGISTRATION.md` §10, Amendment 12. Between b4d7aa1 and f4d81c5 the form changed only by one appended line, a2e8810's correction.

## BLOCKING

**B1. N-15 still cites an observation made on an uncommitted tree. My gate-2 B6 and the architect's gate-2 B3 are not fixed for N-15.**
- The N-15 doc comment in `engine/tests/b1_projection_hostile_names.rs` at f4d81c5 (the line after "`SELECT name FROM parquet_schema(?) OFFSET 1` (12.4 item 29's own named discriminator). Observed") still reads: "(gate-1 correction round 1, uncommitted on base 303dca0)". a3be169 changed only the N-6 comment. `git diff b4d7aa1 f4d81c5` has no hunk in the N-15 doc.
- The worker's disposition table says "N-15's equivalent cites the gate-2 reviewer at b4d7aa1". That is false, and the brief repeats it.
- Round 25, item 2 (c) requires the commit the failure was observed at.
- Fix: cite this report's observation at f4d81c5 (the table below: same test, same failure text), or drop the sentence. Either way this is a doc-comment edit. The body does not change, so the mutation record below still holds.

**B2. N-6's cited observation is for a test whose body has changed since the cited commit (check 6's criterion).**
- N-6 now reads "Observed by the gate-1 reviewer (`state/consults/gates/2026-09-29-a2-1-gate1-reviewer.md`) at 303dca0". That file is tracked on main. Its N-6 row matches the quoted failure text.
- But the body of `a_filter_on_a_file_with_a_nul_named_column_binds_and_streams_its_other_columns` at f4d81c5 is not the body at 303dca0.
  - 6a366e2 added `let fixture_sha_before = sha256_file(&path);` and the closing fixture-hash `assert_eq!`.
  - Round 2 then removed the guard and applied rustfmt.
  - Even after stripping whitespace, trailing commas, comments and the guard, the body differs from 303dca0.
- The failure text itself reproduces exactly at f4d81c5 (table below).
- Fix: the same as B1. Cite this report at f4d81c5, or drop the sentence.

## 1. Gate-2 findings, verified from the code at f4d81c5

- **A-B1 / R-B5 (mutex): fixed.**
  - `grep -rn "SERIAL\|serial_guard" engine/ kernel/ --include=*.rs` matches only `engine/tests/source_watch_adapter.rs`, which is not in this PR, and `kernel/tests/trace_spans.rs` (`TRACE_SERIAL`, also not in this PR).
  - The rationale paragraph is removed from both module docs.
  - The concurrency result is under item 3.
- **A-B2 (controls): fixed.**
  - The bodies of all three controls hash identically at c37b427, at 303dca0 and at f4d81c5 (376a60fd…, 442b400a…, cf9ca25e…). They differed at b4d7aa1.
  - The module doc's "unchanged since c37b427, sha256 515db6f6…" resolves: the file at c37b427 hashes to 515db6f692ed….
  - The local `write` is byte-identical at c37b427, b4d7aa1 and f4d81c5.
  - The corrected `fixture.rs` comment is covered in Suggestions.
- **A-B3 / R-B6 (observation cites):** N-6 is fixed on the commit-naming rule but fails check 6 (B2). N-15 is not fixed (B1).
- **A-B4 / R-B1 (N-14 leases): fixed.**
  - `leases_issued` is read before and after both the p1a and p1b bbox refusals.
  - Supplementary power check (not a form mutation): I inserted `let _early = lease_for_stream(self, &cancel)?;` ahead of `build_sql` in `stream_inner`. N-14 then failed with "p1a: before any lease -- a covering refusal must not touch the connection pool left: 2 right: 1". I reverted it and porcelain was empty.
- **A-B5 / R-B2 (K-2 fixture): fixed.** `hostile_fixture_sha_before` is taken after the write, and a fixture-hash `assert_eq!` runs before the closing `codes.len()` check. The mislabeled "N-4" comment is gone.
- **A-B6 / R-B3 (N-3 c02): fixed.**
  - The test writes `zone\0x` (Int64) and then `zone` (Utf8). That matches `p0-output.txt`'s c02 row: `cols=["zone\0x", "zone"]`.
  - Supplementary check: under 12.2's N-3 mutation, with the c01 call removed, the c02 case alone fails with "column `zone\0x` marked projectable, but viewport_query refused it: … skp.projection_column_name_not_addressable". The c02 order therefore has power of its own. I reverted it and porcelain was empty.
- **A-B7 / R-B4 (N-10 p3): fixed.**
  - The local `write_p3_native_id` writes key UInt64, geometry Binary, `id\0x` Utf8 and `id` UInt64. That matches `extra-output.txt`'s p3 export line.
  - The test asserts `file_schema().field_with_name("id")` is `DataType::UInt64`.
- **A-B8 (instrument doc): fixed.** The doc of `identity_verification_scans` names all three callers. The caller grep finds exactly `admission_instruments.rs`, `b1_nul_native_id_scan_once.rs` and `b1_nul_declared_identity_no_scan.rs`, and no product caller.
- **A-B9:** a2e8810 appends a two-sentence correction at the end of Amendment 12, with no hash and no line cite. It is the only diff to the form since b4d7aa1, so append-only holds. Its sufficiency is the architect's ruling.
- **No src behaviour changed in round 2.** rustfmt's normal form of `dataset.rs`, `fixture.rs`, `attributes.rs` and `skp.rs` differs between b4d7aa1 and f4d81c5 only in the two doc/comment edits (the `identity_verification_scans` doc and the `fixture.rs` section comment).

## 2. Mutations at f4d81c5

Each mutation is 12.2's own, applied at f4d81c5 from a clean tree and run with that test alone (`--exact`). Each was reverted with `git checkout`, and porcelain was empty after every revert.

| Test | Mutation | Failing test: message |
|---|---|---|
| N-1 | `probe_schema`: `return Ok(exported);` after the drain | `a_nul_in_a_column_name_is_refused_by_admission_before_any_stream_opens`: "the resident name is the full, untruncated one DESCRIBE binds by left: ["id","geometry","nu"] right: [...,"nu\0l"]" |
| N-7 | same | `a_filter_types_the_column_duckdb_binds_when_a_nul_named_column_shares_its_name`: `left: [..,"zone","zone"] right: [..,"zone","zone\0x"]` |
| N-12 | same | `a_declared_identity_naming_the_truncated_prefix_is_an_absent_column`: "must never reach a raw query error: identity scan prepare: Binder Error: Referenced column "key" not found…" |
| N-1a | `render_visible_escape` returns `name.to_string()` | `a_nul_in_a_name_renders_as_a_visible_escape_in_every_engine_message_and_detail`: "ColumnNameNotAddressable detail: "the resident name `nu\0l`…"" |
| N-2 | `not_addressable` returns `None` | `a_nul_named_column_never_makes_admission_type_a_column_duckdb_does_not_bind`: "expected ColumnNameNotAddressable, got Ok(AdmittedProjection { fields: [Field { name: "zone\0x", data_type: Int64…" |
| N-6 | `namespace_admit` inserts every field (`filter_surrogate(..).unwrap_or("VARCHAR")`) | `a_filter_on_a_file_with_a_nul_named_column_binds_and_streams_its_other_columns`: "Num is filterable: Filter(RejectedByBinder { detail: "nul byte found in provided data at position: 155" })" |
| N-8 | `check_geometry_column`'s check → `None` | `a_geometry_column_whose_name_contains_u0000_refuses_open_naming_that_fact`: "expected GeoMetadata, got Ok" |
| N-9 | the (c) filter removed from `candidate_identity_columns` | `a_native_id_with_u0000_opens_on_the_session_tier_with_no_nul_candidate`: "the NUL-named column must never be offered as a candidate: ["id\0x"]" |
| N-15 | DESCRIBE → `SELECT name FROM parquet_schema(?) OFFSET 1` | `the_schema_probe_classifies_by_position_and_keeps_duckdbs_own_renames`: "c07: resident names must be DESCRIBE's own bound names, positionally left: [""] right: ["C2"]" |
| N-13 engine | `let covering = geo.covering.clone();` | `a_covering_whose_path_contains_u0000_is_unusable_and_a_bbox_query_refuses_before_any_lease`: "a covering whose path is not addressable is not usable" |
| N-14 | `sanity_check`'s (c) check → `None::<String>` | `a_nul_covering_under_the_format_default_records_not_checked_with_the_true_reason`: `left: Metadata right: NotChecked` |
| N-10 | `admit_identity` looks fields up by exported name | `the_native_id_is_the_column_duckdb_binds_when_a_nul_named_id_precedes_it`: "open must succeed, native on the real `id`: IdentityUnusable { column: "id", … candidate_columns: ["key", "id"] }" |
| K-2 (8th case) | `projection_error_of` arm → `"projection_column_unknown"` | `every_projection_refusal_is_synchronous_typed_and_pre_mint`: "nul-named column: wrong code left: "skp.projection_column_unknown" right: "skp.projection_column_name_not_addressable"" |
| N-4 | same | `a_projection_naming_a_nul_named_column_is_refused_synchronously_typed_and_pre_mint`: "wrong code left: "skp.projection_column_unknown" right: …" |
| N-17 kernel | fixture key `detail` → `detail_x` | `every_projection_refusal_matches_its_committed_error_fixture_shape`: "…live field key set must match the committed fixture's left: {"column","detail"} right: {"column","detail_x"}" |
| K-5 | E-7's: `projectable` from `admit_attribute_type` | `describe_projectable_agrees_with_viewport_query_admission_for_every_column`: "column `id` marked projectable, but viewport_query refused it: SkpError { code: "skp.projection_column_is_identity"…" |
| N-3 | name check moved from `check_geometry_and_identity` to `admit_projection` pass 1 | `projectable_and_admission_agree_on_a_nul_named_column`: "column `nu\0l` marked projectable, but viewport_query refused it: … skp.projection_column_name_not_addressable…" (fails on c01; for c02 alone see item 1) |

- **Three control tests.** Their bodies changed between b4d7aa1 and f4d81c5 by the guard's removal. 12.2 declares no mutation for them, and they are now byte-identical to c37b427.
- **Bodies unchanged since b4d7aa1; my gate-2 table remains the record:**
  - N-11 `a_declared_identity_naming_a_nul_named_column_is_refused_before_any_scan`;
  - N-13 kernel `a_hostile_covering_refuses_a_bbox_query_before_the_mint_and_describe_reports_no_covering`;
  - N-5 `predicate::tests::a_nul_named_column_is_refused_as_not_filterable_by_name`;
  - N-16 `publish_refuses_a_nul_named_column_at_preflight_before_any_write`.
  - `predicate.rs`, `kernel/tests/publish.rs` and `b1_nul_declared_identity_no_scan.rs` are not in the round's diff.
- **Gate 1's table at 303dca0 remains the record for:** `skp_version_is_skp_0_7`, the shell N-17 test and `every_new_projection_error_fixture_round_trips` (all unchanged).

## 3. Concurrency

- I ran the f4d81c5 binaries from the suite build directly, with no mutex, at `--test-threads=12`:
  - `b1_projection_hostile_names`: 30/30 pass, each run "12 passed";
  - `b1_projection_hostile_covering`: 30/30 pass, each run "2 passed".
- No log contains "nul byte".
- Part of this ran while the kernel suite was building and running, which added load.

## 4. f4d81c5 (rustfmt)

- **It is formatting only.** rustfmt(e8cf4bc's file) is byte-identical to rustfmt(f4d81c5's file) for both `engine/src/attributes.rs` and `kernel/src/skp.rs`.
- **Its subject says "rustfmt hunks on this branch's own added lines", but 14 of the rewritten lines in `attributes.rs` blame to main commits** (cf1c3c58, 6cd17640, ca3d7aee), for example `TypeNotAdmitted { column: String, … }` and `known_columns_wire_field`'s body. They sit inside the same rustfmt hunks as branch lines. Not blocking.
- **Recount by my scripted method** (`rustfmt --check --edition 2021` hunks whose span intersects `origin/main...HEAD`'s added lines):
  - at f4d81c5 the total is **3**, all in `engine/src/dataset.rs` (hunks at 796, 1072 and 1737);
  - two of them rewrite a branch-added line itself: line 799 (`no_covering_bbox_detail(", so a row group…")`) and line 1075 (`Schema::new_with_metadata`), both blamed to 1a6584df;
  - every other file is 0.
- **The worker's "after 0 for all seven files" is false.** It is a report claim, not record text, so this is not blocking.
- **Method note.** The same script at b4d7aa1 gives 51, not my gate-2 figure of 55. The gate-2 count is not reproduced exactly by this script, but the before/after direction holds.

## 5. Suites at f4d81c5

- `cargo test -p spatial-engine --features fixture`: rc=0; 372 passed, 0 failed, 13 ignored; wall 665s.
  - hostile_names 12/12, hostile_covering 2/2, native_id_scan_once 1/1, declared_identity_no_scan 1/1.
- `cargo test -p spatial-kernel`: rc=0; 303 passed, 0 failed, 28 ignored.
- `cargo test -p spatial-skp`: rc=0; 48 passed.
- `verify`: PASS.
- `verify-cites`: PASS (32 advisories).
- `verify-quotes`: PASS (112 checked, 81 verified, 30 baselined).
- `verify-test-claims`: PASS (388).
- `node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs"`: rc=0, 353/353.
- clippy (`-p spatial-engine -p spatial-kernel -p spatial-skp --features spatial-engine/fixture --all-targets`): rc=0 and 41 located warnings. None is on an added line; the matcher was self-tested positive with a planted location.
- `gh pr checks 143`: all 8 pass on headSha f4d81c5, including both `cargo test --workspace (windows-latest)` runs (17m47s and 15m15s) and DCO.
- Diff hygiene:
  - `git diff --stat origin/main...HEAD -- protocol/data-plane/ engine/Cargo.toml kernel/Cargo.toml Cargo.lock` prints nothing.
  - All seven round commits carry `Signed-off-by`.
  - The PR timeline has no `head_ref_force_pushed` event.

## 6. Test text

- The only branch-added observation claims are N-6 and N-15:
  - N-15 names no commit (B1);
  - N-6 names 303dca0 for a body that has changed since then (B2).
- The brief's premise that N-15 cites my gate-2 table at b4d7aa1 does not hold at f4d81c5.
- Round 25, item 2:
  - Amendment 12 declares no line budget, so there is no class-8 question.
  - This round adds no scope.
  - No record calls a `verify-mutation` run an observation.
  - No class-3 test-text row exists.
  - The piece is on the full form.

## SUGGESTIONS

- The new `engine/src/fixture.rs` section comment says the local `write` is "used by every test in that file, control and hostile alike". That is false for N-8 (`a_geometry_column_whose_name_contains_u0000_refuses_open_naming_that_fact`), which calls only `spatial_engine::fixture::write_hostile_geometry_name`. Say "every test but N-8", or drop the clause.
- The module doc of `b1_projection_hostile_names.rs` carries a file sha256 at c37b427, a branch commit that never reaches main. It is test text, not an append-only record, so round 15 (e) does not bind it. Still, the words form (commit, no hash) would match a2e8810's treatment of the same reference.
- Still open from gate 2: N-3 uses `contains` rather than exact equality; there is no kernel-level k2 for N-13; there is no publish `ColumnUnknown`-detail assertion on c01.

## NITS

- `NotAddressableFact::nul_offset` still has no reader.

No cargo or test process I started is still running (tasklist is clean). Porcelain is empty at f4d81c5.

Files:
- `C:\dev\wt\b1-close-nul-names\engine\tests\b1_projection_hostile_names.rs`
- `C:\dev\wt\b1-close-nul-names\engine\tests\b1_projection_hostile_covering.rs`
- `C:\dev\wt\b1-close-nul-names\engine\tests\b1_nul_native_id_scan_once.rs`
- `C:\dev\wt\b1-close-nul-names\kernel\tests\skp_projection.rs`
- `C:\dev\wt\b1-close-nul-names\engine\src\fixture.rs`
- `C:\dev\wt\b1-close-nul-names\engine\src\dataset.rs`
- `C:\dev\wt\b1-close-nul-names\engine\src\attributes.rs`
- `C:\dev\wt\b1-close-nul-names\kernel\src\skp.rs`
- `C:\dev\wt\b1-close-nul-names\engine\B1-PROJECTION-PREREGISTRATION.md`
- `C:\dev\spatial-ide\state\consults\gates\2026-09-29-a2-1-gate1-reviewer.md`
