*Custodian's filing note (2026-09-29): gate 2 (reviewer) of PR #143 for PLAN node `b1-close-nul-column-names`. Reviewed: cut/b1-close-nul-names-2 @ b4d7aa1 (from the report's own first line). Filed under `state/consults/gates/` by `AUTONOMY.md` §25(b). It is transcribed from the hand-back message with the harness's two-space indent removed, and the text below the rule is the agent's. Its branch-only locations are kept as printed. Verdict FAIL, with blocking findings B1-B6. They go to correction round 2 together with the gate-2 architect's findings. Its mutation table is the observation of record at b4d7aa1 for every test it names (round 25, item 2 (c)). It could not reproduce the concurrent-run failure that the worker's test mutex claims. Profile paths redacted at filing: none.*

---

Reviewed: cut/b1-close-nul-names-2 @ b4d7aa1
Verdict: FAIL

Worktree `C:\dev\wt\b1-close-nul-names`. I confirmed HEAD b4d7aa12cc0b and an empty porcelain before starting. Every cargo command used `CARGO_TARGET_DIR=C:\dev\wt\b1-close-nul-names\target`. Governing form: `engine/B1-PROJECTION-PREREGISTRATION.md` §10, Amendment 12. The form is unchanged since 303dca0, and no amendment was added in correction round 1.

## BLOCKING

**B1. N-14 still does not assert "before any lease".**
- In `engine/tests/b1_projection_hostile_covering.rs` at b4d7aa1, `a_nul_covering_under_the_format_default_records_not_checked_with_the_true_reason` (fn at line 219) never reads `leases_issued`, for either p1a or p1b.
- The only `leases_issued` reads in the file (lines 148, 156, 193, 199) are in N-13.
- 12.2 N-14 asserts "a bbox query refuses `NoCoveringBbox` before any lease". Gate-1 architect B4 (N-14, second bullet) and reviewer B3 both named this gap.
- The worker's disposition table says "both N-13/N-14's lease assertions at `6a366e2`". That does not hold for N-14.

**B2. B5 (fixture hashing) is only partly fixed: K-2's hostile case is still unhashed.**
- `every_projection_refusal_is_synchronous_typed_and_pre_mint` writes `skp-projection-k2-refusals-hostile.parquet` in-test (`kernel/tests/skp_projection.rs` line 432 at b4d7aa1) and never hashes it.
- This is the "changed existing test" of 12.2, and its fixture is new to this addition. Gate-1 architect B5 covered "the hostile cases in `kernel/tests/skp_projection.rs`".
- Every other new fixture is hashed before and after its run.

**B3. N-3's second case is not c02.**
- 12.2 N-3 declares "c01 and c02". In the P0 output (`state/drafts/a2-1-p0/p0-output.txt`, the `c02-nul-int-before-utf8` row), c02 is `["zone\0x" (Int64), "zone"]`.
- The test's second case (the comment at `kernel/tests/skp_projection.rs` line 1006 at b4d7aa1) writes `zone` (Utf8) ahead of `zone\0x` (Int64). That is E7's p2 order, and the comment says so while labelling it c02.
- The same PR's N-15 table writes c02 in the P0 order, so the two tests disagree.
- Gate-1 reviewer B2 and architect B4 both asked for c02. The case the form names is still not exercised.
- Fix: swap the order, or add c02 beside p2.

**B4. N-10's fixture is not E8's p3 file, and its doc says it is.**
- 12.2 N-10 is "(E8's p3 file)" and asserts "native on the `UInt64` `id`". In p3 (`state/drafts/a2-1-p0/extra-output.txt`, the `p3-utf8-nul-id-then-id` row) the real `id` is `UInt64`.
- `engine/tests/b1_nul_native_id_scan_once.rs` writes the real `id` as `HostileColumn { int: true }`, which is Int64 (line 49).
- Its doc (line 27) reads "E8's p3 file: … a real, addressable `id` (Int64)".
- The test never asserts the id's type.
- The same shape was present at 303dca0. Gate 1 missed it.
- Fix: write p3's shape (a `UInt64` `id`), or an amendment reduces the row.

**B5. The test-wide `SERIAL` mutex breaks the "unchanged" controls and carries an unproven failure claim.**
- *Controls changed.* 6a366e2 adds `let _guard = serial_guard();` to all three control tests. Their bodies hash identically at c37b427 and 303dca0 and differ at b4d7aa1; the one-line diff is the guard.
  - 12.2 says they "come along unchanged".
  - The module doc (`engine/tests/b1_projection_hostile_names.rs` line 13) still says "Unchanged since this file's own reproducer commit (c37b427, sha256 515db6f6…)".
  - `engine/src/fixture.rs` (the header comment at lines 997-998) repeats "unchanged since c37b427".
  - These are discharge claims that no longer resolve (round 7).
- *Unproven claim.* The rationale (module doc lines 17-28) says unserialized runs intermittently made "an unrelated case's admitted SQL text fail DuckDB's own prepare with 'nul byte found in provided data'". It attributes this to "a concurrency-sensitive fragility below this crate's own admission logic".
  - I could not reproduce it at b4d7aa1 with the guard made a no-op (a fresh leaked mutex per call):
    - 20 runs of both hostile binaries under `cargo test`: 20/20 pass;
    - 60 runs of `b1_projection_hostile_names` at `--test-threads=12`: 60/60 pass.
  - The quoted message is Rust's `NulError` text. It is exactly what this gate's N-6 mutation produces ("nul byte found in provided data at position: 155").
  - So the likelier source is a mutated tree being built during the worker's session, not concurrency.
- Either way this is a gate failure:
  - if the failure is real, a serial mutex hides a correctness defect (admitted SQL carrying U+0000 is what this piece exists to rule out);
  - if it is not real, the test text states a failure that was never shown.
- Fix: remove the mutex and its rationale, which restores the controls byte for byte. Otherwise produce a reproducer and treat it as a defect.

**B6. The N-6 and N-15 docs still name no commit for their observation.**
- Both say "Observed (gate-1 correction round 1, uncommitted on base 303dca0)" (`engine/tests/b1_projection_hostile_names.rs` lines 632-633 and 819-820 at b4d7aa1).
- Round 25, item 2 (c) requires the failure to be recorded "with the commit it was observed at", and gate-1 architect B8 asked for "a named commit". A working tree with uncommitted changes is not a commit.
- The quoted failures do match this gate's observations at b4d7aa1 (table below).
- Fix: cite this report's observation at b4d7aa1, or drop the observation sentence.

## Gate-1 findings: verified at b4d7aa1

**Architect's findings**
- **B1: fixed.**
  - `addressability::not_addressable(bound, exported) -> Option<NotAddressableFact { bound, exported, nul_offset }>`, plus a `not_addressable_for_field` wrapper.
  - Projection reaches it at one site, `check_geometry_and_identity`; the check was removed from `admit_projection` pass 2 and from `admit_projection_column`.
  - The covering (`covering_not_addressable_reason`) and the candidate list call (c).
  - The engine/kernel src grep for U+0000 tests (`'\0'`, `\u{0}`, `\x00`, `from(0`) finds only `addressability.rs` lines 39-40 (`render_visible_escape`) and line 87 (`not_addressable`), plus N-5's own unit-test asserts in `predicate.rs`.
- **B2: fixed.** A scratch probe (`engine/tests/zz_review_probe.rs`, deleted afterwards) on the c01 file printed:
  - `ColumnUnknown` Display: "…(it has: id, geometry, nu\\u0000l)";
  - publish detail: "the file has no such column (it has: id, geometry, nu\\u0000l)";
  - publish Display: rendered;
  - an absent requested name `zz\0q`: rendered as `zz\\u0000q`.
  - No raw U+0000 in any of them.
  - `AttributeUnpublishable`'s and `IdentityUnusable`'s Displays also render `column`.
- **B3: fixed.** N-1a asserts Display plus detail for `ColumnNameNotAddressable`, `ColumnUnknown` (c01), `GeoMetadata`, `IdentityUnusable` and `NoCoveringBbox`. `ColumnNotFilterable`'s Display is asserted in N-5.
- **B4: partly fixed.**
  - Done: N-3 is standalone; N-13 has a kernel half; N-14 has p1b; N-15 covers c01–c07, c14, c15, o1 and o2; the N-10 "scan run once" counter delta is asserted; N-13's engine half checks leases.
  - Open: N-14 leases (B1), N-3 c02 (B3), N-10 p3 (B4).
- **B5: partly fixed** (B2 above).
- **B6: fixed.** The §9.5 heading reads "seven codes" again, and the three texts name 19f37da.
- **B7: fixed.** `arrow.for_each(drop)` runs before the DESCRIBE prepare.
- **B8: open** (B6 above).

**Reviewer's findings**
- B1: fixed.
- B2: the test exists; B3 above.
- B3: the kernel half exists; the N-14 leases are B1 above.
- B4: fixed. N-11's counter is unchanged, N-10's counter is +1, and N-1a checks Display.
- B5: partly fixed; B2 above.
- B6: fixed.

## Mutations

Each mutation is the form's own 12.2 mutation, applied at b4d7aa1 (HEAD b4d7aa12cc0b, clean tree) and run with that test alone (`--exact`). Each was then reverted, and porcelain was empty after every revert.

| Test | Mutation | Failing test: assertion message |
|---|---|---|
| N-1 | `probe_schema`: `return Ok(exported);` after the drain | `a_nul_in_a_column_name_is_refused_by_admission_before_any_stream_opens`: `left: ["id","geometry","nu"] right: ["id","geometry","nu\0l"]` |
| N-1a | `render_visible_escape` returns `name.to_string()` | `a_nul_in_a_name_renders_as_a_visible_escape_in_every_engine_message_and_detail`: "ColumnNameNotAddressable detail: \"the resident name \`nu\0l\`…\"" |
| N-2 | `not_addressable` returns `None` | `a_nul_named_column_never_makes_admission_type_a_column_duckdb_does_not_bind`: "expected ColumnNameNotAddressable, got Ok(AdmittedProjection { fields: [Field { name: \"zone\0x\", data_type: Int64…" |
| N-3 | name check removed from `check_geometry_and_identity` and added to `admit_projection` pass 1 | `projectable_and_admission_agree_on_a_nul_named_column`: "column \`nu\0l\` marked projectable, but viewport_query refused it: SkpError { code: \"skp.projection_column_name_not_addressable\"…" (fails on c01) |
| N-4 | `projection_error_of` new arm → `"projection_column_unknown"` | `a_projection_naming_a_nul_named_column_is_refused_synchronously_typed_and_pre_mint`: "wrong code left: \"skp.projection_column_unknown\" right: \"skp.projection_column_name_not_addressable\"" |
| N-5 | `filterable_column_type`'s check → `None::<NotAddressableFact>` | `predicate::tests::a_nul_named_column_is_refused_as_not_filterable_by_name`: "expected ColumnNotFilterable naming U+0000, got Ok(Utf8)" |
| N-6 | `namespace_admit` inserts not-addressable fields (`VARCHAR`) | `a_filter_on_a_file_with_a_nul_named_column_binds_and_streams_its_other_columns`: "Num is filterable: Filter(RejectedByBinder { detail: \"nul byte found in provided data at position: 155\" })" |
| N-7 | same as N-1 | `a_filter_types_the_column_duckdb_binds_when_a_nul_named_column_shares_its_name`: `left: ["id","geometry","zone","zone"] right: [...,"zone\0x"]` |
| N-8 | `check_geometry_column`'s check → `None` | `a_geometry_column_whose_name_contains_u0000_refuses_open_naming_that_fact`: "expected GeoMetadata, got Ok" |
| N-9 | the (c) filter line removed from `candidate_identity_columns` | `a_native_id_with_u0000_opens_on_the_session_tier_with_no_nul_candidate`: "the NUL-named column must never be offered as a candidate: [\"id\0x\"]" |
| N-10 | `admit_identity`'s lookup matches by exported name | `the_native_id_is_the_column_duckdb_binds_when_a_nul_named_id_precedes_it`: "open must succeed, native on the real \`id\`: IdentityUnusable { column: \"id\", … }" |
| N-11 | declared-arm check → `None` | `a_declared_identity_naming_a_nul_named_column_is_refused_before_any_scan`: "expected IdentityUnusable, got Query(\"identity scan prepare: nul byte found in provided data at position: 36\")" |
| N-12 | same as N-1 | `a_declared_identity_naming_the_truncated_prefix_is_an_absent_column`: "must never reach a raw query error: identity scan prepare: Binder Error: Referenced column \"key\" not found…" |
| N-13 engine | `let covering = geo.covering.clone();` | `a_covering_whose_path_contains_u0000_is_unusable_and_a_bbox_query_refuses_before_any_lease`: "a covering whose path is not addressable is not usable" |
| N-13 kernel | same | `a_hostile_covering_refuses_a_bbox_query_before_the_mint_and_describe_reports_no_covering`: "a covering whose path is not addressable is not usable" |
| N-14 | `sanity_check`'s (c) check → `None::<String>` | `a_nul_covering_under_the_format_default_records_not_checked_with_the_true_reason`: `left: Metadata right: NotChecked` |
| N-15 | DESCRIBE → `SELECT name FROM parquet_schema(?) OFFSET 1` | `the_schema_probe_classifies_by_position_and_keeps_duckdbs_own_renames`: "c07: resident names must be DESCRIBE's own bound names, positionally left: [\"\"] right: [\"C2\"]" |
| N-16 | new `From` arm detail → `"the file has no such column"` | `publish_refuses_a_nul_named_column_at_preflight_before_any_write`: panicked "\"the file has no such column\"" |
| N-17 kernel | fixture key `detail` → `detail_x` | `every_projection_refusal_matches_its_committed_error_fixture_shape`: "skp.projection_column_name_not_addressable: live field key set must match the committed fixture's left: {\"column\",\"detail\"} right: {\"column\",\"detail_x\"}" |
| K-5 (body changed) | E-7's mutation: `projectable` from `admit_attribute_type` | `describe_projectable_agrees_with_viewport_query_admission_for_every_column`: "column \`id\` marked projectable, but viewport_query refused it: SkpError { code: \"skp.projection_column_is_identity\"…" |

- **Supplementary check (not a form mutation):** I reverted only `ColumnUnknown`'s Display rendering. N-1a then failed with "ColumnUnknown Display: \"… (it has: id, geometry, nu\0l)\"", so the B1-fix assertion has power.
- **Every mutation could be applied as the form writes it.**
- **Gate 1's table at 303dca0 remains the record for the bodies that did not change:**
  - `every_projection_refusal_is_synchronous_typed_and_pre_mint` (K-2; only its doc changed);
  - `skp_version_is_skp_0_7`;
  - the shell N-17 test;
  - `every_new_projection_error_fixture_round_trips`.
- **The three control tests changed only by the guard (B5).** 12.2 declares no mutation for them.

## Declared shapes (check 3)

- 12.1(c) returns the typed fact.
- The U+0000 grep is as listed under B1 above.
- Fixture hashes are checked before and after in every new test. The one exception is K-2's hostile case (B2).
- N-10 and N-11 each sit in their own binary with exactly one `#[test]`: each ran "1 passed; 0 filtered out".

## Suites at b4d7aa1

- `cargo test -p spatial-engine --features fixture`: rc=0; 372 passed, 0 failed, 13 ignored; wall 12m14s.
  - hostile_names 12/12, hostile_covering 2/2, native_id_scan_once 1/1, declared_identity_no_scan 1/1.
- `cargo test -p spatial-kernel`: rc=0; 303 passed, 0 failed, 28 ignored; wall 2m58s.
- `cargo test -p spatial-skp`: rc=0; 48 passed.
- `verify`: PASS.
- `verify-cites`: PASS (32 advisories).
- `verify-quotes`: PASS (112 checked, 81 verified, 30 baselined).
- `verify-test-claims`: PASS (388 claims).
- `node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs"`: rc=0, 353/353.
- `gh pr checks 143` (runs on headSha b4d7aa1): all 8 pass, including both `cargo test --workspace (windows-latest)` runs (13m54s and 16m59s) and DCO.

## Diff hygiene

- **Manifest and data plane.** `git diff --stat origin/main...HEAD -- protocol/data-plane/ engine/Cargo.toml Cargo.lock` prints nothing (rc=0).
- **rustfmt.** Counted as `rustfmt --check --edition 2021` hunks whose span intersects the three-dot diff's added lines. Total 55:
  - `kernel/tests/skp_projection.rs` 16;
  - `engine/tests/b1_projection_hostile_covering.rs` 10;
  - `engine/tests/b1_projection_hostile_names.rs` 8;
  - `engine/src/fixture.rs` 8;
  - `engine/src/dataset.rs` 7;
  - `engine/src/attributes.rs` 5;
  - `kernel/src/skp.rs` 1;
  - every other file 0.
  - The worker's report claims "zero overlapping hunks remaining anywhere in the diff". That is false, but it is a report claim, not record text, so this is not blocking.
- **clippy.** `cargo clippy -p spatial-engine -p spatial-kernel -p spatial-skp --features spatial-engine/fixture --all-targets`: rc=0, 40 located warnings, none on an added line.
- **History.** All 11 branch commits carry `Signed-off-by`. The PR timeline has no `head_ref_force_pushed` event.
- **`kernel/tests/watch_support/mod.rs`** is not in the diff, and the reformat the worker saw is explained. `rustfmt kernel/tests/skp_projection.rs` also formats its `mod watch_support;` submodule, and its check output shows exactly one hunk at `watch_support/mod.rs:20` (`ArmOutcome::ChecksOnly { reason: … }` split across lines). The worker's own rustfmt application produced it.

## Test text (check 6)

- The N-6 and N-15 observation claims match this gate's observed failures, but name no commit (B6).
- The SERIAL rationale states an unreproduced failure (B5).
- No other added test text claims a mutation observation.

## SUGGESTIONS

- N-3 checks names with `names.contains(expected)`. Assert exact equality with the describe row list, so that a truncated extra name also fails.
- The N-13 kernel half has its own name and covers k1 only. The form's N-13 name is carried by the engine test. Consider adding k2 at kernel level.
- No test asserts publish's `ColumnUnknown` detail on c01. The probe shows it is rendered correctly, but under N-1a's mutation nothing would catch a regression there.
- `covering_not_addressable_reason` still writes its own prose and returns `Option<String>` instead of rendering from `NotAddressableFact`. The classification does go through (c).
- K-2's inline comment (`kernel/tests/skp_projection.rs` line 424) still labels its eighth case "**N-4**".
- SKP-V0's added `skp` literal-comparison dated note sits outside 12.1(g)'s list. This is for the architect, carried over from gate 1.

## NITS

- `NotAddressableFact::nul_offset` is produced but never read. Only the derived `PartialEq` touches it.

No cargo or test process I started is still running (tasklist is clean). Porcelain is empty at b4d7aa1.

Files:
- `C:\dev\wt\b1-close-nul-names\engine\tests\b1_projection_hostile_covering.rs`
- `C:\dev\wt\b1-close-nul-names\engine\tests\b1_projection_hostile_names.rs`
- `C:\dev\wt\b1-close-nul-names\engine\tests\b1_nul_native_id_scan_once.rs`
- `C:\dev\wt\b1-close-nul-names\engine\tests\b1_nul_declared_identity_no_scan.rs`
- `C:\dev\wt\b1-close-nul-names\engine\src\fixture.rs`
- `C:\dev\wt\b1-close-nul-names\engine\src\addressability.rs`
- `C:\dev\wt\b1-close-nul-names\kernel\tests\skp_projection.rs`
- `C:\dev\wt\b1-close-nul-names\engine\B1-PROJECTION-PREREGISTRATION.md`
