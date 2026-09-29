*Custodian's filing note (2026-09-29): gate 1 (reviewer) of PR #143 for PLAN node `b1-close-nul-column-names`. Reviewed: cut/b1-close-nul-names-2 @ 303dca0 (from the report's own first line). Filed under `state/consults/gates/` by `AUTONOMY.md` §25(b). It is transcribed from the hand-back message with the harness's two-space indent removed, and the text below the rule is the agent's. The branch-only locations in its command output are kept as printed, all backslashes. Verdict FAIL, with blocking findings B1-B6. They go to correction round 1 together with the architect gate's findings. Its mutation table is the observation of record at 303dca0 for the mutations it ran (round 25, item 2 (c)). Profile paths redacted at filing: none.*

---

Reviewed: cut/b1-close-nul-names-2 @ 303dca0
Verdict: FAIL

Governing form: `engine/B1-PROJECTION-PREREGISTRATION.md` §10, Amendment 12 (1add801, committed before any code). Every observation below was made in `C:\dev\wt\b1-close-nul-names` with HEAD at 303dca0. After each mutation I reverted and confirmed `git status --porcelain` was empty.

## BLOCKING

**B1. §8 item 34 is breached: a raw U+0000 reaches two engine messages. The same breach is a 12.2 N-1a assertion that is missing.**
- `ProjectionError::ColumnUnknown`'s `Display` joins `known_columns` without escaping them. This text becomes the SKP `message` of `skp.projection_column_unknown`, because `projection_error_of` uses `e.to_string()`.
- Publish's `From<ProjectionError> for EngineError` arm for `ColumnUnknown` builds its `detail` the same way.
- Both are reached by N-1's own input: the c01 file with `["nu"]`.
- I confirmed it with a scratch test (`engine/tests/zz_review_probe.rs`, since deleted) at 303dca0:
```
PROJECTION DISPLAY: "refused: `nu` is not a column this dataset carries (it has: id, geometry, nu\0l)"
PUBLISH DISPLAY: "refused: `nu` cannot be published as an attribute — the file has no such column (it has: id, geometry, nu\0l). Nothing is cast, ..."
panicked at engine\tests\zz_review_probe.rs:14:5: raw U+0000 in an engine message
```
- 12.2 N-1a requires "the `Display` text and every `detail` or `reason` field of each refusal these files produce" to be free of a raw U+0000. The test at 303dca0 checks only `detail`/`msg` and never `Display`, so this went uncaught.
- Fix: pass the listed names through `render_visible_escape` in both texts. The `known_columns` wire field stays raw, per OPEN A12-a.
- Nothing declared unchanged moves: only names that do not round-trip change bytes.
- Add `Display` assertions to N-1a, including `ColumnUnknown` on the c01 file.

**B2. N-3 is missing by name.**
- 12.2 names `projectable_and_admission_agree_on_a_nul_named_column`. At 303dca0 no test has that name. The case is a `check_one` call inside K-5's `describe_projectable_agrees_with_viewport_query_admission_for_every_column`.
- This is the same deviation the custodian corrected for N-4 in 303dca0.
- The case also falls short of the form:
  - it covers c01 only, where the form says "c01 and c02";
  - it does not assert "each row's `name` is the bound name".
- `verify-test-claims` passes only because it never sees this name: its first word, `projectable`, is not in the tool's `TEST_PREFIXES` in `scripts/plan/verify-test-claims.mjs` at 303dca0. The tool is a floor.
- I did observe the form's own N-3 mutation, but through K-5's test (see the table).

**B3. N-13's kernel half is missing, and "before any lease" is not asserted.**
- 12.2 N-13 is "(k1, k2; engine and kernel)" and asserts "The kernel's `viewport_query` refuses `engine.no_covering_bbox` before the mint." The diff adds no kernel test for it. The kernel's `describe` `covering_bbox: ds.covering().is_some()` is also untested for an unusable covering.
- The N-13 and N-14 test names both claim "before any lease", but neither compares `leases_issued`.

**B4. 12.2 assertions that are not implemented, with no amendment recording the deviation.**
- N-11 does not assert that `IDENTITY_VERIFICATION_SCANS` is unchanged. The worker report discloses this, but disclosure is not an amendment.
- N-10 asserts `VerifiedAtOpenFullFile`, not "the identity verification scan run once".
- N-1a has no `Display` assertions (see B1).

**B5. 12.2's fixture discipline is not followed.**
- 12.2 says: "Fixtures are generated in-test … and hash-verified before and after each run (§3's discipline)."
- None of the new tests hash their fixtures. That covers `b1_projection_hostile_names.rs`, `b1_projection_hostile_covering.rs`, the N-4/N-17/N-3 cases in `kernel/tests/skp_projection.rs`, and N-16.

**B6. 12.1(c)'s declared shape and 12.4 item 25.**
- 12.1(c) says the one classifying function "returns a typed engine fact: the bound name, the exported name where there is one, and the byte offset of the first U+0000". `addressability::not_addressable_reason` returns `Option<String>` (prose), and no byte offset is produced anywhere.
- Two uses by name bypass (c) and apply the U+0000 rule themselves:
  - `dataset::covering_not_addressable_reason` (the covering row, which 12.1(d) says goes through (c));
  - `identity::candidate_identity_columns`'s `!name.contains('\0')`.
- The module doc's claim "There is no second classification function (12.4 item 25)" does not resolve against this.
- Fix, either:
  - code: (c) exposes a `&str` U+0000 predicate that returns the typed fact, and the covering and candidate sites call it; or
  - an amendment reducing 12.1(c).
- Item 25 is the architect's to rule on. I am blocking on the stated shape.

## Checks

**1. Diff.** `git diff --stat origin/main...HEAD`: 36 files, +1968/-130. `git diff --stat origin/main...HEAD -- protocol/data-plane/` printed nothing (rc=0).

Against 12.1, apart from B1 and B6:
- (a) `probe_schema` does two reads and refuses `InternalInconsistency` when the two lengths differ.
- (b) The resident field takes DESCRIBE's name, with `spatial.exported_name` only where the names differ.
- (d) The per-column order is name, geometry, identity, duplicate, type, in both `admit_projection` pass 2 and `admit_projection_column`. The geometry, declared-identity, native-identity, candidate and covering rows are present.
- `covering()` returns a usable covering only.
- The three `NoCoveringBbox` sites share `no_covering_bbox_detail`. The default text is byte-identical to main's; I compared the `index in this slice` spacing with `od -c`.
- (e) `projection_error_of` has one new arm, and publish's `From` has one new arm.
- Seam kernel→engine: I read `projection_error_of` on the branch. N-4 exercises it from the real shape: a real file, `Catalog::open`, `SkpHost::viewport_query`.
- Caller grep:
  - The new variant's product callers are `projection_error_of` and publish's `From`.
  - The new `pub` fixture items are feature-gated test support. `fixture::hostile_value` is `pub` but has no caller outside `fixture.rs` (nit).

**2. Mutations.** All applied at 303dca0, each run alone, then reverted.

| Test (12.2) | Mutation | Observed failure |
|---|---|---|
| N-1 `a_nul_in_a_column_name_is_refused_by_admission_before_any_stream_opens` | `probe_schema`: `return Ok(exported);` after the Arrow read | FAILED: `left: ["id", "geometry", "nu"] right: ["id", "geometry", "nu\0l"]` |
| N-1a `a_nul_in_a_name_renders_as_a_visible_escape_in_every_engine_message_and_detail` | `render_visible_escape` returns `name.to_string()` | FAILED, panicked at the `!detail.contains('\0')` assert (ColumnNameNotAddressable arm) |
| N-2 `a_nul_named_column_never_makes_admission_type_a_column_duckdb_does_not_bind` | `not_addressable_reason`: `if true {` (always `None`) | FAILED: `expected ColumnNameNotAddressable, got Ok(AdmittedProjection { fields: [Field { name: "zone\0x", data_type: Int64 ...` |
| N-3 (run through K-5's test, see B2) | name check removed from `admit_projection_column`; pass 2 keeps it | `describe_projectable_agrees_with_viewport_query_admission_for_every_column` FAILED: ``column `nu\0l` marked projectable, but viewport_query refused it: SkpError { code: "skp.projection_column_name_not_addressable" ...`` |
| N-4 `a_projection_naming_a_nul_named_column_is_refused_synchronously_typed_and_pre_mint` | `projection_error_of` new arm → `"projection_column_unknown"` | FAILED: `wrong code left: "skp.projection_column_unknown" right: "skp.projection_column_name_not_addressable"`; `every_projection_refusal_is_synchronous_typed_and_pre_mint` also FAILED (`nul-named column: wrong code`) |
| N-5 `a_nul_named_column_is_refused_as_not_filterable_by_name` | `filterable_column_type`'s check → `None::<String>` | FAILED: `expected ColumnNotFilterable naming U+0000, got Ok(Utf8)` |
| N-6 `a_filter_on_a_file_with_a_nul_named_column_binds_and_streams_its_other_columns` | form's mutation: `namespace_admit` inserts NUL-named fields (`VARCHAR`) | FAILED: `Num is filterable: Filter(RejectedByBinder { detail: "nul byte found in provided data at position: 155" })` |
| N-8 `a_geometry_column_whose_name_contains_u0000_refuses_open_naming_that_fact` | `check_geometry_column`'s check → `None::<String>` | FAILED: `expected GeoMetadata, got Ok` |
| N-9 `a_native_id_with_u0000_opens_on_the_session_tier_with_no_nul_candidate` | `candidate_identity_columns` NUL filter → `true` | FAILED: `the NUL-named column must never be offered as a candidate: ["id\0x"]` |
| N-10 `the_native_id_is_the_column_duckdb_binds_when_a_nul_named_id_precedes_it` | form's mutation: `admit_identity` looks up by exported name | FAILED: ``open must succeed, native on the real `id`: IdentityUnusable { column: "id", ...`` |
| N-11 `a_declared_identity_naming_a_nul_named_column_is_refused_before_any_scan` | declared-arm check → `None::<String>` | FAILED: `expected IdentityUnusable, got Query("identity scan prepare: nul byte found in provided data at position: 36")` |
| N-13 `a_covering_whose_path_contains_u0000_is_unusable_and_a_bbox_query_refuses_before_any_lease` | `let covering = geo.covering.clone();` | FAILED: `a covering whose path is not addressable is not usable` |
| N-14 `a_nul_covering_under_the_format_default_records_not_checked_with_the_true_reason` | `sanity_check`'s check → `None::<String>` | FAILED: `left: Metadata right: NotChecked` |
| N-15 `the_schema_probe_classifies_by_position_and_keeps_duckdbs_own_renames` | form's mutation: names from `SELECT name FROM parquet_schema(?) OFFSET 1` | FAILED: `left: ["id", "geometry", ""] right: ["id", "geometry", "C2"]` |
| N-16 `publish_refuses_a_nul_named_column_at_preflight_before_any_write` | new `From` arm renders `"the file has no such column"` | FAILED: panicked `"the file has no such column"` |
| N-17 kernel `every_projection_refusal_matches_its_committed_error_fixture_shape` | fixture key `detail` → `detail_x` | FAILED: `live field key set must match the committed fixture's left: {"column", "detail"} right: {"column", "detail_x"}` (N-4 also fails) |
| N-17 shell `a projection_column_name_not_addressable refusal carries column and detail (skp/0.7)` | same rename | FAILED: `AssertionError: expected undefined to be defined` |

Accepted from the record (`state/consults/2026-09-29-a2-1-worker-report-1.md`, observed at cdadc6d and 1507845, whose code trees equal 1a6584d and 19f37da; see check 6):
- N-7 and N-12, `probe_schema` revert (the form's own mutation for both);
- the literal revert on `skp_version_is_skp_0_7`.

The worker substituted mutations for N-6, N-10 and N-15 and never ran the form's; I ran the form's mutations above. The worker's N-3 mutation (E-7's) is superseded by mine.

**3. Discharge claims.**
- These resolve:
  - The hostile-names module doc says the three control tests are unchanged since c37b427. Each function body, plus `write` and `drain`, hashes identically at c37b427 and 303dca0, and `git show c37b427:engine/tests/b1_projection_hostile_names.rs | sha256sum` gives `515db6f6…190d`.
  - The `state/drafts/a2-1-p0/{probe,covering-probe,extra-probe}.rs.txt` sources exist on main.
  - The SKP-V0 §8 claim of an empty `protocol/data-plane/` diff holds.
  - The N-16 claim "no destination" is asserted.
- N-6's doc says "this mutation is therefore observed as a different, lower-level failure". The worker did not run it, so it was unresolved as written. It resolves by this gate's observation at 303dca0 (table), and its wording should say where it was observed.
- Fails: the `addressability` module doc's "There is no second classification function" (see B6).

**4. Literal bump.**
- 19f37da carries all of the following in one commit:
  - `SKP_VERSION` `skp/0.6` → `skp/0.7` on both sides (`protocol/skp/src/v0/mod.rs`, `frontends/shell/src/skp/types.ts`);
  - the eight request fixtures;
  - `v0-error-projection_column_name_not_addressable.json`;
  - `fixtures.rs` and `fixtures.test.ts`.
- The fixture's `message` matches the live text seen in the N-3 run. Main's literal is `skp/0.6`, so `skp/0.7` is the next one unless B-1 merges first.
- The conformance renumbering is sound:
  - `any-version-skp_0_7` becomes `any-version-skp_0_8`;
  - `"skp/0.7 "` (trailing space) is still refused;
  - the older-version rows (0.1–0.3) are unchanged;
  - the spec pointers now name the 0.7 entry;
  - AMBIGUITIES A9 and the README record it.

**5. Suites** (at 303dca0):
- `cargo test -p spatial-engine --features fixture`: rc=0; 372 passed, 0 failed, 13 ignored, across 32 result blocks; wall 666 s. The new binaries are hostile_names 14/14 and hostile_covering 2/2.
- `cargo test -p spatial-kernel`: rc=0; 301 passed, 0 failed, 28 ignored; wall 171 s.
- `cargo test -p spatial-skp`: rc=0; 48 passed, 0 failed, including `skp_version_is_skp_0_7` and `every_new_projection_error_fixture_round_trips`.
- Shell, `npx vitest run` on the three touched files: rc=0, 3 files, 31/31 passed.
- `node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs"`: rc=0, 353/353.
- `verify-cites` rc=0 (PASS, 32 pre-existing advisories). `verify-quotes` rc=0 (PASS: 112 checked, 81 verified, 30 baselined). `verify-test-claims` rc=0 (PASS, 388 claims; blind to N-3, see B2). `verify` rc=0 (PASS).
- `gh pr checks 143`: all pass, including both `cargo test --workspace (windows-latest)` runs (17m10s and 18m31s), DCO, tauri build, and typecheck/vitest/cargo.

**6. History.**
- All four commits carry `Signed-off-by: Christopher Donini`. The PR timeline has no `head_ref_force_pushed` event.
- `git range-diff cdadc6d~1..1507845 1a6584d~1..19f37da` shows both as `=` (identical patches).
- `git diff --stat cdadc6d 1a6584d` and `git diff --stat 1507845 19f37da` each show only `engine/B1-PROJECTION-PREREGISTRATION.md | 6 +++---`.
- That is `git diff 63b240c 1add801`: three lines and four de-backticked spans, byte-identical to the diff in `state/consults/2026-09-29-a2-1-rebranch-diff.md` on main.
- Class 9 order holds: the amendment (1add801) precedes all code.

**7. fmt and clippy.**
- `rustfmt --check --edition 2021` hunks that start on or next to the diff's added lines:
  - `engine/tests/b1_projection_hostile_names.rs` 20, `engine/tests/b1_projection_hostile_covering.rs` 11, `kernel/tests/skp_projection.rs` 15, `engine/src/dataset.rs` 11, `engine/src/fixture.rs` 9, `kernel/tests/publish.rs` 3;
  - `engine/src/attributes.rs` and `engine/src/predicate.rs` 2 each;
  - `engine/src/lib.rs`, `kernel/src/skp.rs` and `protocol/skp/tests/fixtures.rs` 1 each;
  - `engine/src/addressability.rs` and `protocol/skp/src/v0/mod.rs` 0.
- The same files already carry drift elsewhere, so this is not blocking, but the new code is not fmt-clean.
- `cargo clippy -p spatial-engine -p spatial-kernel -p spatial-skp --features spatial-engine/fixture --all-targets`: rc=0, 40 warnings in total, none on a line the diff adds.

## SUGGESTIONS
- 1a6584d on its own breaks the `spatial-kernel` build. Its `projection_error_of` has no wildcard and no arm for the new variant (read from `git show 1a6584d:kernel/src/skp.rs`, not built), so a bisect has a broken step.
- SKP-V0 §9.5's heading was edited from "seven codes" to "eight codes", and a §9.1 dated note was added. 12.1(g) says "dated notes only … Nothing earlier is rewritten" and does not list §9.1. This is for the architect.
- Several texts say the literal was minted "on `cut/b1-close-nul-names`": the SKP-V0 §8 `skp/0.7` entry, AMBIGUITIES A9 and the conformance README. The landing commit is 19f37da on `cut/b1-close-nul-names-2`, so name the commit.
- `fixture.rs` says its helpers are "promoted here so every test … shares one writer". It does not hold: `b1_projection_hostile_names.rs` keeps its own `write`, and `b1_projection_hostile_covering.rs` adds `write_format_default_covering`.
- N-1 and N-2 claim "No stream opens" but never compare `leases_issued`.
- The Rust `every_new_projection_error_fixture_round_trips` does not pin key sets (the worker disclosed this). Only the kernel X9 test and the shell test catch a renamed key.

## NITS
- The message says "not addressable" twice: "refused: `…` is not addressable — the resident name `…` is not addressable: …". The wording is the human's at B1's close.
- `no_covering_bbox_detail` is `pub(crate)`, not "private" as 12.1(d) says. It has to be, because `stream.rs` calls it.
- The N-15 doc's reason for substituting the mutation is moot: the form's `parquet_schema` mutation can be applied and was observed here.
