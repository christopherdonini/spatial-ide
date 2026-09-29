*Custodian's filing note (2026-09-29): gate 1 (architect) of PR #143 for PLAN node `b1-close-nul-column-names`. Reviewed: cut/b1-close-nul-names-2 @ 303dca0 (from the report's own first line). Filed under `state/consults/gates/` by `AUTONOMY.md` §25(b). It is transcribed from the hand-back message with the harness's two-space indent removed, and the text below the rule is the agent's. Its closing file list gives absolute worktree paths, and they are kept as the agent wrote them, all backslashes. Verdict FAIL, with blocking findings B1-B8. They go to correction round 1 together with the reviewer gate's findings. Profile paths redacted at filing: none.*

---

Reviewed: cut/b1-close-nul-names-2 @ 303dca0 — **Verdict: FAIL**

Base main @ d37fd76. PR #143. PLAN node `b1-close-nul-column-names` (wave-2 A2-1). Full gating (AUTONOMY §21a: wire, guarantee). Governing form: `engine/B1-PROJECTION-PREREGISTRATION.md` §10, Amendment 12. I read the branch in worktree `C:\dev\wt\b1-close-nul-names`, whose HEAD is 303dca0 according to its reflog. Code is cited by symbol and file. Nothing below is quoted.

## Blocking findings

**B1. The branch has more than one classification function, and its uses by name do not all go through the single one.** This breaks 12.4 item 25, 12.1(c) and (d), and 12.3's invalidator "a second classification function is needed". It also breaks ADR-023, Amendment 2026-09-29, item 2 (one engine function decides it).
- `dataset::covering_not_addressable_reason` (`engine/src/dataset.rs`) runs its own U+0000 test on the covering's path segments. It is called from `open_inner` and from `sanity_check`.
- `identity::candidate_identity_columns` (`engine/src/identity.rs`) filters on its own U+0000 test of the name, even though it already holds the `Field`.
- Neither of them reaches `addressability::not_addressable_reason`.
- The module doc in `engine/src/addressability.rs` says there is no second classification function. On this branch that is false.
- The invalidator should have stopped the piece. The worker's report says no stop condition fired.
- **Root cause:** 12.1(c) declares that the function returns a typed engine fact: the bound name, the exported name where there is one, and the byte offset of the first U+0000. The branch returns `Option<String>`, prose already rendered for display. The name-only uses therefore could not call it.
- **Projection also reaches (c) at two sites.** `admit_projection` pass 2 calls `not_addressable_reason` directly, beside `admit_projection_column`.
- **Fix:**
  - (c) returns the typed fact, computed over a name plus an optional exported name. A `Field` entry point wraps it.
  - The covering and candidate-list uses call (c).
  - Message sites render text from the fact.
  - The projection's call to (c) moves into the helper that both projection paths already share (`check_geometry_and_identity`, as its first check). Projection then reaches (c) at one site.

**B2. Engine messages carry a raw U+0000.** This breaks §8 item 34, and the 2026-09-29 sightings' addition.
- `ProjectionError::ColumnUnknown`'s `Display` (`engine/src/attributes.rs`) writes the `known_columns` list and the requested `column` without rendering them.
- On the c01 file, N-1's own `["nu"]` refusal therefore puts U+0000 as the raw byte into the message.
- `kernel::skp::projection_error_of` carries `e.to_string()` as the SKP `message`.
- Publish's `From<ProjectionError> for EngineError` arm for `ColumnUnknown` builds its `detail` from the same raw list.
- A wire request naming an absent column that contains U+0000 reaches the same `Display`.
- **Fix:** send all three through `render_visible_escape`. Names that round-trip keep their bytes, so item 28 holds. `known_columns_wire_field` is a field value and stays raw (OPEN A12-a as ruled).

**B3. N-1a asserts less than 12.2 declares, and the mutation the form declares for it was not run.**
- The form requires the `Display` text and every `detail` or `reason` field of each refusal these files produce to be free of the raw byte.
- The test checks only `detail` for `ColumnNameNotAddressable`, `IdentityUnusable` and `NoCoveringBbox`. It never checks their `Display` text.
- It never checks `ColumnNotFilterable`'s `Display`. N-5 checks only `reason`.
- The `ColumnUnknown` refusal from B2 must be added to the test.
- The worker's report records N-1a's mutation as the `probe_schema` mutation. The form's mutation ("the rendering function returns the name unchanged") was not run, and the report does not disclose the substitution.

**B4. Some named tests are missing, or assert less than 12.2 declares.**
- **N-3** (`projectable_and_admission_agree_on_a_nul_named_column`) does not exist as a test.
  - It was folded into K-5 as one `check_one` call. This is the same defect that 303dca0 corrected for N-4.
  - It covers c01 only; the form says c01 and c02.
  - It does not assert that each row's `name` is the bound name.
  - Its recorded mutation is not the form's ("the name rule moves into pass 1 only"). The mutation actually run was `admit_projection_column` reduced to `type_check`, and it failed first on the pre-existing native `id` case, so nothing was observed for the N-3 case. The substitution is not disclosed.
- **N-13, kernel half, is absent.**
  - No kernel test opens a hostile-covering file, so nothing proves that `viewport_query` refuses `engine.no_covering_bbox` before the mint.
  - The engine half never compares `leases_issued`, so its "before any lease" is not asserted.
- **N-14:**
  - The p1b file (a child segment carrying U+0000) is absent.
  - "Before any lease" is not asserted.
- **N-15:**
  - The form lists c01–c07, c14, c15, o1 and o2. The test covers c07, c14 and one U+0000 position.
  - o1 and o2 are not exercised. These are E10's cases, for which the form states that the positional rule classifies both.
- **N-10:**
  - "Scan run once" is inferred from `IdUniqueness::VerifiedAtOpenFullFile`, not asserted.
  - The form's mutation ("`admit_identity` matches by exported name") was not run; the `probe_schema` mutation was run instead. This substitution is not disclosed.
- **N-11:** see (4) below.

**B5. The fixture discipline is not met** (12.2: fixtures are hash-verified before and after each run, §3's discipline).
- No new test hash-verifies its fixture: the tests in `engine/tests/b1_projection_hostile_names.rs` and `engine/tests/b1_projection_hostile_covering.rs`, N-16 in `kernel/tests/publish.rs`, and the hostile cases in `kernel/tests/skp_projection.rs`.
- That same kernel file's existing K-tests already do it (`sha256_file`).

**B6. SKP-V0 has an in-place rewrite** (12.1(g), nothing earlier is rewritten; brief check (3), dated notes only).
- In `protocol/skp/SKP-V0.md`, the §9.5 heading was changed from "seven codes" to "eight codes". On main it reads "seven codes".
- Restore the heading. The dated note already states the eighth code.
- With the same correction: the §8 `skp/0.7` entry, the conformance `README.md` note and the `AMBIGUITIES.md` A9 row each say the literal was minted on `cut/b1-close-nul-names`. That branch will not merge. Name the bump commit (19f37da) instead.

**B7. The Arrow read is not drained** (12.1(a): two drained reads).
- `probe_schema` never consumes the Arrow export iterator before it prepares DESCRIBE on the same connection.
- The comment in `read_kv_metadata` documents the hazard of doing this.
- With `LIMIT 0` the iterator yields no batches, so draining it costs nothing. Drain it before the DESCRIBE prepare.

**B8. Test text claims a mutation observation that was never made** (the round 7 discharge rule).
- N-6's doc comment says the form's mutation "is therefore observed as" a lower-level failure. The worker's report says that mutation was not run.
- N-15's doc comment says the form's mutation has nothing to swap in. That misreads the mutation: it makes `parquet_schema` the source of the names.
- Both comments must state what was actually observed, at a named commit.

## Checks requested

**12.1 (a)–(h).**
- (a) FAIL on "drained" (B7). The length check (`InternalInconsistency`, naming both counts) and the positional byte comparison are as declared.
- (b) PASS.
- (c) FAIL (B1).
- (d) FAIL for the covering and candidate rows and for projection's second site (B1). The rest is as declared:
  - geometry → `GeoMetadata` with a true detail;
  - both identity arms reach the check at `admit_identity`'s single site, before any SQL;
  - `Dataset::covering()` returns a usable covering only;
  - `no_covering_bbox_detail` is the one detail function, and it keeps today's bytes when no covering is declared.
- (e) PASS on reading. `projection_error_of` has one arm and stays exhaustive. The publish `From` arm produces `AttributeUnpublishable { column, detail }`.
- (f) PASS. describe's `name` is the bound name. `covering_bbox` reports a usable covering. There is one new code.
- (g) FAIL (B6).
- (h) PASS. The messages state engine facts only.

**12.3.**
- The data-plane diff is empty according to the worker. The reviewer must show it.
- Round-trip bytes are unchanged on reading, because the render function is a no-op for names without U+0000.
- The invalidator fired (B1).

**§7.** PASS on reading.
- `EXPORTED_NAME_KEY` is `pub(crate)`.
- `FieldInfo` carries only name, type, nullable and projectable.
- `type_check` builds the emitted fields fresh, without metadata.
- Only fields that are not addressable carry the key, and those are always refused.
- The key therefore reaches neither the wire nor a frame. This is structural; no test asserts it.

**§8.**
- Items 25–34:
  - 25 FAIL (B1).
  - 26 PASS on reading. Lease assertions are missing (B4).
  - 27, 28 and 29 PASS.
  - 30 PASS. The ADR files are unedited: their headings sit where they sit on main. The reviewer should confirm with `git diff --stat`.
  - 31 PASS according to the record: 19f37da holds the literal, both sides' fixtures and the error fixture. The reviewer should confirm with `git show --stat 19f37da`.
  - 32 and 33 PASS.
  - 34 FAIL (B2, B3).
- Items 2, 15 and 21, as 12.4 reads them: PASS.
- Items 1–24, as they bear on this diff:
  - 1, 3, 8, 16, 19 and 20 PASS.
  - 5: the reviewer must show the data-plane diff.

**12.5 seam, kernel → engine: PASS.**
- The kernel arm destructures the variant's actual fields, `{ column: String, detail: String }`.
- N-4, as its own test at 303dca0, starts from the real shape: a hostile parquet file, then `Catalog::open`, then `SkpHost::viewport_query`. It asserts:
  - the exact key set;
  - `cancel_all_for_dataset` returns 0;
  - `leases_issued` is unchanged;
  - the code and key set match the committed fixture.
- The publish seam is proved by N-16 through `preflight_pinless`.

**12.5 caller rule: PASS**, apart from the projection's extra (c) site (B1).
- The variant's product callers are `projection_error_of` and the publish `From`.
- `render_visible_escape` and `no_covering_bbox_detail` are `pub(crate)`, with product callers.

**(1) ADR texts.**
- The code implements ADR-023, Amendment 2026-09-29, items 1 and 3–6, and ADR-021's Note 2026-09-29, item 1: the namespace excludes the column through `filterable_column_type`, and the truncated prefix is refused `filter_unknown_column` (N-6).
- The exception is ADR-023 item 2's single function (B1).
- Neither ADR file is edited on the branch.

**(2) Directives.**
- Fable's A2-1 rulings:
  - (a), (b), (d), (e), (f) and (g) are honoured.
  - (c) is honoured on the engine side. Its kernel-side proof is missing (B4).
  - The item 34 addition fails (B2, B3).
- The formatting ruling: old head → new head is the recorded change, four code spans losing their backticks. c37b427 and the file's sha256 are unchanged.
- *Note:* compared with the draft §1 in `state/drafts/a2-1-p0/A2-1-PREREGISTRATION.draft.md`, Amendment 12 also carries:
  - the sight fill;
  - §8 item 34 and N-1a, both ordered by the sighting;
  - the PR #142 architect gate's notes 1 and 5 (N-5's last bullet, and 12.1(g)'s last sentence).

  All of these have been present since 63b240c and are recorded in CUT-STATE. Notes 1 and 5 postdate Fable's sight. This does not block, but the human should see it.

**(3) SKP-V0.** FAIL (B6). The literal `skp/0.7`, both sides' fixtures and the error fixture are in 19f37da according to the record.

**(4) Disclosed deviations.** None is acceptable as it stands.
- **N-11 (counter not asserted): needs correction.** `engine/tests/admission_instruments.rs` already isolates `identity_verification_scans` in a file with a single `#[test]`, for exactly this race (its module doc). Put the N-11 delta, and N-10's "run once", into a file like that.
- **N-6 (substitute mutation): needs correction.** The form's mutation can be run and kills the test: every surrogate prepare fails, so the `"Num"` admission panics. A lower-level failure is still a failure by name.
- **N-15 (substitute mutation): needs correction.** Export names equal DESCRIBE names for C2 and Zone_1 (E5), so the substitute cannot kill the rename assertions. Only the form's `parquet_schema` mutation proves item 29 for renames.
- **N-17, Rust half: needs correction.** N-17's named test is the kernel test `every_projection_refusal_matches_its_committed_error_fixture_shape`. The form's mutation (rename `detail` in the fixture) fails it on key-set equality. Run the mutation against that test. That the protocol round-trip test does not pin keys is a disclosed fact and is fine.
- **Substitutions not disclosed:** N-1a (B3), N-3 (B4), N-10 (B4).
- **N-4 at 303dca0** has no mutation observation at that commit. The worker observed the mutation on K-2's folded case at 1507845. The reviewer must observe it on the standalone test.
- **Suites:** `cargo fmt --check` and `clippy` were not run by the worker. They are still owed under §9.

**(5) Beyond the form.**
- **The `fixture.rs` writers** (`write_hostile_names`, `write_hostile_geometry_name`, `write_hostile_covering`, `HostileColumn`): acceptable.
  - They sit in `engine::fixture`, which is `#[cfg(feature = "fixture")]` and enabled only through the dev-dependency.
  - B1's §3 names `engine::fixture` as the form's fixture channel, and 12.2 carries §3 over.
  - They are not shipped surface, so the caller rule is not engaged.
- **The conformance renumbering** (the one-version-ahead fixture, 0.7 → 0.8): acceptable as literal-bump mechanics, following Amendment 9's precedent. The branch-name correction in B6 applies.
- **`write_format_default_covering`**, a writer local to one test: acceptable.

**Round 25, item 2.**
- The class 9 amendment precedes the code: 1add801 comes before 1a6584d.
- There is no §7 overrun.
- No record calls a `verify-mutation` run an observation of a mutation.
- There is no test-text row pinned on an unmerged branch.
- The piece is not on a five-line form.

## Notes (not blocking)
- K-2's doc comment in `kernel/tests/skp_projection.rs` is stale. It still calls N-4 "this test's own changed existing test", and it still says "seven outcomes" and "fewer than 7 members".
- N-7 proves `VARCHAR` indirectly, through `LIKE` admission. That is acceptable: E7 shows `LIKE` is refused on the `Int64` surrogate.
- N-2 compares against the writer's values, not "a DuckDB read" as the form says. Align it, or say why when correcting.

No decision is missing, so no ADR skeleton is needed.

Files:
- `C:\dev\wt\b1-close-nul-names\engine\src\addressability.rs`
- `C:\dev\wt\b1-close-nul-names\engine\src\dataset.rs`
- `C:\dev\wt\b1-close-nul-names\engine\src\identity.rs`
- `C:\dev\wt\b1-close-nul-names\engine\src\attributes.rs`
- `C:\dev\wt\b1-close-nul-names\engine\tests\b1_projection_hostile_names.rs`
- `C:\dev\wt\b1-close-nul-names\engine\tests\b1_projection_hostile_covering.rs`
- `C:\dev\wt\b1-close-nul-names\kernel\tests\skp_projection.rs`
- `C:\dev\wt\b1-close-nul-names\kernel\tests\publish.rs`
- `C:\dev\wt\b1-close-nul-names\protocol\skp\SKP-V0.md`
- `C:\dev\wt\b1-close-nul-names\protocol\skp\tests\conformance\README.md`
- `C:\dev\wt\b1-close-nul-names\protocol\skp\tests\conformance\AMBIGUITIES.md`
- `C:\dev\wt\b1-close-nul-names\engine\B1-PROJECTION-PREREGISTRATION.md`
