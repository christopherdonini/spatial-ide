# A2-1 — the gate-1 correction round 1 worker's report (2026-09-29)

*Custodian's filing note: the worker-high's hand-back for correction round 1 on `cut/b1-close-nul-names-2`. It covers every blocking finding of both gate-1 reports (`state/consults/gates/2026-09-29-a2-1-gate1-architect.md` and `-reviewer.md`) and pushed 303dca0..3ab3180. It is copied from the hand-back message with the harness's two-space indent removed. Its locations are branch-only and are kept as the worker printed them. After filing, the custodian removed the report's `engine/Cargo.toml` dev-dependency entry for `sha2`: it was redundant, since `sha2` is already a regular dependency, which integration tests use. The removal is commit b4d7aa1, so the PR carries no manifest change. The four changed engine test files pass at that commit. The report is byte-identical to the hand-back except for one disclosed rewrite: in the W1 grep block (section 4), the three branch-only `path:line` locations are de-rooted to a file name plus line, marked (branch), at 3ab3180. As rooted cites they do not resolve on main, or resolve to unrelated lines there.*

---

Gate-1 correction round 1 for PR #143 (PLAN node `b1-close-nul-column-names`) is complete. Worktree `C:\dev\wt\b1-close-nul-names`, branch `cut/b1-close-nul-names-2`, pushed range `303dca0..3ab3180`. `git status --porcelain` is empty.

## 1. Commits (pushed 303dca0..3ab3180)

- `af00a36` fix(engine): one classifying function returns a typed fact; every engine message renders U+0000 visibly
- `6a366e2` test(engine): hostile-name/covering fixtures -- fixture hashing, N-1a's five shapes, N-15's full case set, N-2's oracle, lease assertions
- `274731d` test(engine): N-10 and N-11 as their own isolated-counter processes
- `67a7991` test(kernel): N-3 as its own test, N-13's kernel half, fixture hashing for the hostile cases
- `e0a6c27` test(kernel): N-16's fixture hash-verified before and after its run
- `3ab3180` docs(skp): restore section 9.5's heading; name the literal's actual landing commit

All six carry `Signed-off-by` (`git commit -s`) and name "(B1-PROJECTION-PREREGISTRATION.md, Amendment 12; gate-1 correction round 1)".

## 2. Disposition table

Architect findings:
- A-B1 (two classification functions) -> fixed at `af00a36`. `addressability::not_addressable`/`not_addressable_for_field` now return the typed fact (bound name, exported name, byte offset); covering (`dataset::covering_not_addressable_reason`) and the candidate list (`identity::candidate_identity_columns`) call it instead of their own U+0000 test; projection's call moved into `attributes::check_geometry_and_identity`, the one site both `admit_projection_column` and `admit_projection`'s pass 2 share.
- A-B2 (raw U+0000 in messages) -> fixed at `af00a36`. `ProjectionError::ColumnUnknown`'s `Display` and publish's `From` arm now render every name through `render_visible_escape`.
- A-B3 (N-1a under-asserts, wrong mutation run) -> fixed at `6a366e2`. N-1a now asserts `Display` (not only `detail`) for all four live shapes plus a fifth `ColumnUnknown` block on c01 with `["nu"]`; the form's own mutation (`render_visible_escape` returns the name unchanged) is what is now recorded.
- A-B4 (N-3, N-13 kernel, N-14, N-15, N-10 missing/short) -> fixed: N-3 standalone at `67a7991`; N-13 kernel half at `67a7991`; N-14's p1b sub-case and both N-13/N-14's lease assertions at `6a366e2`; N-15's full c01-c07/c14/c15/o1/o2 table at `6a366e2`; N-10's "run once" measured at `274731d`.
- A-B5 / R-B5 (fixture discipline) -> fixed at `6a366e2` (engine), `274731d` (N-10/N-11's own files), `67a7991` and `e0a6c27` (kernel hostile cases).
- A-B6 / R-B6 wait, A-B6 is SKP-V0 -> fixed at `3ab3180` (heading restored; branch-name mentions renamed to commit `19f37da`).
- A-B7 (Arrow read not drained) -> fixed at `af00a36` (`arrow.for_each(drop)` before the DESCRIBE prepare).
- A-B8 (N-6/N-15 doc claims an unmade observation) -> fixed at `6a366e2`: N-6's doc now states the mutation was run and what failed; N-15's doc now names the correct (`parquet_schema`) mutation.
- Architect "(4)" disclosed deviations: N-11 correction -> `274731d`; N-6 mutation run -> `6a366e2`; N-15 mutation run -> `6a366e2`; N-17 Rust half -> mutation re-verified against the kernel test at `67a7991` (no code change was needed, the test already asserted key-set equality correctly); undisclosed substitutions (N-1a, N-3, N-10) -> resolved by running the form's own mutations, `6a366e2`/`67a7991`/`274731d`; N-4's mutation re-observed fresh this round (see mutation table); `cargo fmt`/clippy now run (results below).
- Architect notes (not blocking): K-2's stale doc -> fixed at `67a7991`; N-7 note -> left as is (architect called it acceptable); N-2's DuckDB-read note -> fixed at `6a366e2` (an independent oracle read added).

Reviewer findings:
- R-B1 (raw U+0000; N-1a missing) -> fixed at `af00a36` + `6a366e2`.
- R-B2 (N-3 missing by name) -> fixed at `67a7991`.
- R-B3 (N-13 kernel half missing; "before any lease" unasserted) -> fixed at `67a7991` (kernel) + `6a366e2` (engine leases).
- R-B4 (N-11/N-10/N-1a assertions incomplete) -> fixed at `274731d` + `6a366e2`.
- R-B5 (fixture discipline) -> fixed, same commits as A-B5.
- R-B6 (12.1(c)'s shape, item 25) -> fixed at `af00a36`.
- Reviewer SUGGESTIONS: "1a6584d breaks the standalone kernel build" -> left (custodian's "not to change" list: history is not rewritten). SKP-V0 §9.5 heading / §9.1 dated note -> heading fixed at `3ab3180`; the §9.1 dated note left as is, per your instruction, disclosed here for the architect (12.1(g) lists "dated notes only" but does not name §9.1 among them). Branch-name mentions -> fixed at `3ab3180` (all three: SKP-V0 §8, conformance README, AMBIGUITIES A9). fixture.rs's "shares one writer" claim -> fixed at `6a366e2`. N-1/N-2 missing `leases_issued` -> fixed at `6a366e2`. Rust round-trip test not pinning key sets -> left as a disclosed fact (architect: "fine").
- Reviewer NITS: "not addressable" said twice -> left (human's wording at B1's close; "not to change" list). `no_covering_bbox_detail` `pub(crate)` vs "private" -> left unchanged (code was already correct; this was a wording nit in 12.1(d)'s prose, not a code defect; also on the "not to change" list). N-15's moot substitution reason -> fixed at `6a366e2` (the correct `parquet_schema` mutation is now run and documented).

Left unchanged, as instructed: the "not addressable" wording; `no_covering_bbox_detail` staying `pub(crate)`; 1a6584d's history; OPEN A12-a (the wire's `known_columns`/`column` fields stay raw).

## 3. Mutation table (12.2's own declared mutation for each test; all applied alone, observed, reverted; `git status --porcelain` confirmed empty after each revert; every one observed fresh this round, uncommitted, on top of this round's own fixes, base 303dca0)

| Test | Mutation (form's own) | Observed failure |
|---|---|---|
| N-1 `a_nul_in_a_column_name_is_refused_by_admission_before_any_stream_opens` | `probe_schema` returns the export's names | `left: ["id","geometry","nu"] right: ["id","geometry","nu\0l"]` |
| N-1a `a_nul_in_a_name_renders_as_a_visible_escape_in_every_engine_message_and_detail` | rendering function returns the name unchanged | `ColumnNameNotAddressable detail: "the resident name \`nu\0l\`..."` (raw NUL present) |
| N-2 `a_nul_named_column_never_makes_admission_type_a_column_duckdb_does_not_bind` | the function in (c) always returns `None` | `expected ColumnNameNotAddressable, got Ok(AdmittedProjection { fields: [Field { name: "zone\0x", ... } ...` |
| N-5 `a_nul_named_column_is_refused_as_not_filterable_by_name` | this arm deleted | `expected ColumnNotFilterable naming U+0000, got Ok(Utf8)` |
| N-6 `a_filter_on_a_file_with_a_nul_named_column_binds_and_streams_its_other_columns` | `namespace_admit` inserts every field unconditionally | `Num is filterable: Filter(RejectedByBinder { detail: "nul byte found in provided data at position: 155" })` |
| N-7 `a_filter_types_the_column_duckdb_binds_when_a_nul_named_column_shares_its_name` | `probe_schema` returns the export's names | `left: ["id","geometry","zone","zone"] right: ["id","geometry","zone","zone\0x"]` |
| N-8 `a_geometry_column_whose_name_contains_u0000_refuses_open_naming_that_fact` | name check removed from `check_geometry_column` | `expected GeoMetadata, got Ok` |
| N-9 `a_native_id_with_u0000_opens_on_the_session_tier_with_no_nul_candidate` | `candidate_identity_columns` drops the U+0000 omission | `the NUL-named column must never be offered as a candidate: ["id\0x"]` |
| N-10 `the_native_id_is_the_column_duckdb_binds_when_a_nul_named_id_precedes_it` | `admit_identity` matches by exported name | `open must succeed, native on the real \`id\`: IdentityUnusable { column: "id", ... }` |
| N-11 `a_declared_identity_naming_a_nul_named_column_is_refused_before_any_scan` | name check removed from the declared arm | `expected IdentityUnusable, got Query("identity scan prepare: nul byte found in provided data at position: 36")` |
| N-12 `a_declared_identity_naming_the_truncated_prefix_is_an_absent_column` | `probe_schema` returns the export's names | `must never reach a raw query error: identity scan prepare: Binder Error: Referenced column "key" not found...` |
| N-13 engine `a_covering_whose_path_contains_u0000_is_unusable_and_a_bbox_query_refuses_before_any_lease` | `covering()` returns the declared covering whatever its usability | `a covering whose path is not addressable is not usable` |
| N-13 kernel `a_hostile_covering_refuses_a_bbox_query_before_the_mint_and_describe_reports_no_covering` | same as engine's N-13 | `a covering whose path is not addressable is not usable` |
| N-14 `a_nul_covering_under_the_format_default_records_not_checked_with_the_true_reason` | `sanity_check`'s path check skips (c) | `left: Metadata right: NotChecked` |
| N-15 `the_schema_probe_classifies_by_position_and_keeps_duckdbs_own_renames` | names taken from `parquet_schema` | `c07: ... left: [""] right: ["C2"]` |
| N-16 `publish_refuses_a_nul_named_column_at_preflight_before_any_write` | new `From` arm renders `ColumnUnknown`'s text | panicked `"the file has no such column"` |
| N-3 `projectable_and_admission_agree_on_a_nul_named_column` | name rule moves into `admit_projection`'s pass 1 only | `column \`nu l\` marked projectable, but viewport_query refused it: ... skp.projection_column_name_not_addressable ...` |
| N-4 `a_projection_naming_a_nul_named_column_is_refused_synchronously_typed_and_pre_mint` | `projection_error_of` maps the variant to `projection_column_unknown` | `left: "skp.projection_column_unknown" right: "skp.projection_column_name_not_addressable"` |
| N-17 kernel `every_projection_refusal_matches_its_committed_error_fixture_shape` | fixture's `detail` key renamed | `left: {"column","detail"} right: {"column","detail_x"}` |

## 4. W1 grep (every U+0000/`\0` test on a name or segment left in the engine)

```
addressability.rs line 39 (branch) if name.contains('\0') {          -- render_visible_escape (the one rendering fn)
addressability.rs line 87 (branch) let nul_offset = bound.find('\0'); -- not_addressable (the one classifying fn)
predicate.rs lines 1278/1286 (branch) !reason.contains('\0') / !display.contains('\0') -- N-5's own mutation-observation assertions
```
No other site tests a name or segment for U+0000; every use-by-name site calls `not_addressable`/`not_addressable_for_field`.

## 5. Suite and check results (all green, at final HEAD 3ab3180)

- `cargo test -p spatial-engine --features fixture`: rc=0, 372 passed, 0 failed (full log captured via `tee`, 33 binaries).
- `cargo test -p spatial-kernel`: rc=0, 303 passed, 0 failed (full log captured via `tee`, 34 binaries).
- `cargo test -p spatial-skp`: rc=0, 48 passed, 0 failed.
- `node scripts/plan/verify.mjs`: rc=0, PASS.
- `node scripts/plan/verify-cites.mjs`: rc=0, PASS (32 pre-existing advisories, none mine).
- `node scripts/plan/verify-quotes.mjs`: rc=0, PASS (112 checked, 81 verified, 30 baselined, 1 advisory -- identical to the reviewer's own baseline).
- `node scripts/plan/verify-test-claims.mjs`: rc=0, PASS (388 claims; all 18 of 12.2's declared names for this node confirmed present by exact `fn` name via grep, listed in my working notes).
- `node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs"`: rc=0, 353 passed, 0 failed.
- `git diff --stat origin/main...HEAD -- protocol/data-plane/`: empty (rc=0).
- Shell `vitest`: not run -- no shell file was touched this round.
- `rustfmt --edition 2021` (hunks overlapping branch-added lines only, applied via a line-overlap script so pre-existing drift elsewhere in the same files was left untouched): applied to every touched file; a final `rustfmt --check` shows zero overlapping hunks remaining anywhere in the diff.
- `cargo clippy -p spatial-engine -p spatial-kernel -p spatial-skp --features spatial-engine/fixture --all-targets`: rc=0. One new warning appeared mid-round (`type_complexity` on N-15's `cases` vec) and was fixed with a named `N15Case` type alias (`kernel/tests/skp_projection.rs`'s own `ProjectionRefusalCase` precedent); final run shows zero warnings on any line this branch adds.

## 6. Anything left / stopped on

- Left, disclosed for the architect: SKP-V0 §9.1's dated note (added alongside §9.5's, not itself named by 12.1(g)'s "dated notes only" list) -- the reviewer raised it, the architect did not; I left it as-is per your instruction.
- A one-off, unexplained reformatting of `kernel/tests/watch_support/mod.rs` (a single pre-existing line reflowed) appeared in the working tree three separate times during this session, never from any command I ran intentionally; I reverted it each time with `git checkout --` and it is not present in the final diff or any commit. I could not identify its source (not `cargo fmt`, not my scripts, not `clippy --fix`) -- flagging it since it recurred, though it never touched anything I own and the final state is clean.
- No stop condition fired: every mutation in 12.2 could be applied and observed as declared; no Amendment 12 invalidator fired.
- `git status --porcelain`: empty. No `cargo`/test process left running (checked via `tasklist`, confirmed empty).

Files touched (absolute paths): `C:\dev\wt\b1-close-nul-names\engine\src\{addressability,attributes,dataset,identity,predicate,fixture}.rs`, `C:\dev\wt\b1-close-nul-names\engine\Cargo.toml`, `C:\dev\wt\b1-close-nul-names\engine\tests\{b1_projection_hostile_names,b1_projection_hostile_covering}.rs`, `C:\dev\wt\b1-close-nul-names\engine\tests\{b1_nul_native_id_scan_once,b1_nul_declared_identity_no_scan}.rs` (new), `C:\dev\wt\b1-close-nul-names\kernel\tests\{skp_projection,publish}.rs`, `C:\dev\wt\b1-close-nul-names\protocol\skp\SKP-V0.md`, `C:\dev\wt\b1-close-nul-names\protocol\skp\tests\conformance\{README,AMBIGUITIES}.md`.
