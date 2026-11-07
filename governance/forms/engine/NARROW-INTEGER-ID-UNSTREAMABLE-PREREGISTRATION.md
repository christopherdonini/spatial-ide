# engine: an 8, 16 or 32-bit integer identity column that admission accepts streams every row, its value widened exactly into u64. Full preregistration.

*Committed before any change. Append-only once committed; an amendment written after any outcome has been seen says so in its first line. PLAN node narrow-integer-id-unstreamable, filler entry 8g. The form, its notes, its rule (00) table, the reuse index, the OPEN items and what could not be settled are the architect's draft (`state/consults/2026-11-07-narrow-integer-id-unstreamable-form-architect-draft.md`, read only at main 8e30b9d9; extracted sha256 737d67352f22d55b22b5a38c366b2201aecd97fc265c38605e62ea511dfbccbe), carried byte for byte with these changes, all the custodian's: each cite the draft writes `path:line @ 8e30b9d9…` expanded by script to `path:line @ <commit> sha256:<the lines with their LFs>` (31 pins; 0 by a file name that resolves to one tracked path at that commit; 0 kept as written; cites without a commit kept as written); this lead line added under the draft's title; the draft's opening lines and its closing line dropped; the custodian's settlement added, and the Amendments heading at the end. Form path: `governance/forms/engine/NARROW-INTEGER-ID-UNSTREAMABLE-PREREGISTRATION.md`. The custodian keeps the PLAN node on main.*

## Header

- **Title.** `column_u64` gains arms for Int8, Int16, Int32, UInt8, UInt16 and UInt32.
  - Every identity type that admission accepts now reaches the stream as its own value, carried as UInt64.
  - A negative value is refused, as it already is for Int64.
  - Admission, the SQL, the wire and every string stay as they are.
  - This title assumes OPEN-1 (B). Under OPEN-1 (C), a narrow native `id` is refused at open instead, and only declared columns stream.
- **Authority:**
  - PLAN node `narrow-integer-id-unstreamable` (governance/PLAN.yaml:6532-6548 @ 8e30b9d995bd64cdc540afc7f7a3e7b9f69b470e sha256:042104407f6612610777599ec2cad98873bddf138c0ab8d73a3cf0c5f7e1a4c6). It is filler entry 8g, S2 (state/FILLER-QUEUE.md:31 @ 8e30b9d995bd64cdc540afc7f7a3e7b9f69b470e sha256:268ee56696a5982425e766a7488a572eb5b0e631575232208d0addf686ab68e6).
  - Placed by the human's ruling of 2026-11-05 (evening), item 2 (state/directives/2026-11-05-8c-full-form-nine-s2-placed-u12-slot-2-u1-reproducer-adr-notes-words-e2e-readme-words-8b-d3.md:12 @ 8e30b9d995bd64cdc540afc7f7a3e7b9f69b470e sha256:0716aaeb23d7190aa121ee6d6ebd123da1e5ca063bf3a65d6e8a440cd8c9ed10; a sub-line span, the line's hash). My paraphrase: after 8f in the filler queue.
  - The human's rulings on gate rounds of 2026-11-05, Part 1, items 1 to 9, by reference (state/directives/2026-11-05-main-architect-gate-rounds-part-1-rulings-review-packet-design-part-3-additions.md:28-64 @ 8e30b9d995bd64cdc540afc7f7a3e7b9f69b470e sha256:b7b9954b95c6a23808cc8a2fbacb8b6157335e23da53ccda20f4a35ba8e05e8a).
  - The filler rule, AUTONOMY §36 (governance/AUTONOMY.md:692 @ 8e30b9d995bd64cdc540afc7f7a3e7b9f69b470e sha256:1135b89c01d0e676bce0bc42a4d6710af445fa0ae95ed12ef6ca0fef7a4d4e84). Its five-line condition is set aside only by the human's answer to OPEN-6.
  - OPEN items that are not red lines are taken under the direction of 2026-10-31, item 4 (`state/directives/2026-10-31-away-until-11-04-clicks-from-the-app-270-size-o0-file-open-items-take-recommendation.md`, as the brief names it; I did not read it). That direction holds until 2026-11-09.
  - Evidence, not Authority:
    - the reading by test, state/consults/2026-11-07-narrow-integer-id-unstreamable-u2-reproducer-tester.md:55-81 @ 8e30b9d995bd64cdc540afc7f7a3e7b9f69b470e sha256:de691f48ef926743d409094db1362cae0060d1b65de4fa4d6e43f11e9abcb47b (printed lines, run 2). Its test file is untracked, and is evidence only.
    - lead-data's impact read, state/consults/2026-11-07-narrow-integer-id-unstreamable-impact-read-lead-data.md (read at 59c93093; I re-read at 8e30b9d9 every pointer this form relies on).
  - **The reuse index:** no prior art on either search; the misses are noted here. Byte for byte from the brief:

```text
$ node tools/reuse.mjs narrow integer id column widen stream   (exit 1)
No prior art recorded for "narrow integer id column widen stream". Research it before planning an implementation.
$ node tools/reuse.mjs identity column integer cast u64 arrow   (exit 1)
No prior art recorded for "identity column integer cast u64 arrow". Research it before planning an implementation.
```

- **Drafted by** the architect, on the custodian's brief, read only at main 8e30b9d9.
- **Committed before any code.** Append-only once committed. An amendment written after any outcome has been seen says so in its first line, and names what it touches or invalidates. Self-references are by section only.
- **Branch.** `cut/narrow-integer-id-unstreamable`:
  - cut from main after PR #294 merges;
  - on its own checkout and its own new cargo target;
  - merged by merge commit, never squashed, so the `RECORDED MUTATION:` commits stay reachable.
- **Form path.** `governance/forms/engine/NARROW-INTEGER-ID-UNSTREAMABLE-PREREGISTRATION.md`, following 8c's and 8f's forms. The template names no place for forms, and I read no forms index.

## §0 Disclosure

1. **The behaviour at main** (each site read at 8e30b9d9):
   - **Admission accepts all eight integer widths** for a native `id` and for a declared column alike:
     - the type match: engine/src/identity.rs:330-335 @ 8e30b9d995bd64cdc540afc7f7a3e7b9f69b470e sha256:534eaf05cc2a6a633187c531f3f8a11b3e4c2d44261e0b0545757d8eac7aec26;
     - native and declared both reach that check: engine/src/dataset.rs:1917-1931 and :1976-1977 @ 8e30b9d995bd64cdc540afc7f7a3e7b9f69b470e;
     - the scan's negative refusal: :2025-2036;
     - `max_value` kept as u64: :2049-2054.
   - **The stream projects the source column under the alias `id`, with no cast** (engine/src/stream.rs:1438-1440 @ 8e30b9d995bd64cdc540afc7f7a3e7b9f69b470e sha256:eac73efc99df3f0cb16be172116b0f3f445b038a71ed860715766fae3dd41dd5).
   - **Each chunk's ids are read by `column_u64`** (engine/src/stream.rs:1947 @ 8e30b9d995bd64cdc540afc7f7a3e7b9f69b470e sha256:53f3fea3dca1d63b588b2ec4366e2439c902f490731acab30b7e6e624f673e12):
     - it accepts UInt64, and Int64 with a negative refusal per value (:2674-2687);
     - every other type gets the type error at :2688-2691.
   - **The reading by test** (the report, :55-78): at 7a0eab36, all six narrow widths and a declared Int32 `parcel_key` were admitted. DuckDB passed each column on in its own narrow Arrow type, and every stream failed at its first chunk. The UInt64 control streamed 100 rows.
2. **The kernel's path is unchanged by this piece.**
   - The terminal detail is formed in `EngineSource::next_into` (kernel/src/lib.rs:679-706 @ 8e30b9d995bd64cdc540afc7f7a3e7b9f69b470e sha256:dfcac7832ae927374d53b850022524dd036fcc6995f86340c6698d0820e4d20c).
   - The wire has no field for skipping the uniqueness check (kernel/src/skp.rs:1726-1729 @ 8e30b9d995bd64cdc540afc7f7a3e7b9f69b470e sha256:cc876b9ebc79d12c449df2215a76f8dd274f45aa31ebbf81dabf381e5fe4f68e; docs/adr/ADR-016-stable-feature-identity-admission.md:161-164 @ 8e30b9d995bd64cdc540afc7f7a3e7b9f69b470e sha256:d2fac86ac54fc69ece245a09524e176297df456add92519063f411e5c348d30c). So the skip route is reachable only through the engine API.
3. **Siblings that read the identity outside `column_u64`.** Each is decided by an OPEN item:
   - the LOD tier reader: engine/src/lod.rs:1367-1380 and :1820-1854 @ 8e30b9d995bd64cdc540afc7f7a3e7b9f69b470e. Its comment "Unreachable through `Dataset`" (:1371) is false at main for the narrow types. No SKP command builds a tier (kernel/src/skp.rs:2258-2264 @ 8e30b9d995bd64cdc540afc7f7a3e7b9f69b470e sha256:fef1fe3f1245eb1b2a470f612f65b251c91ec129bc62a481a8fc7ea1995462ad). By Grep, the only caller of `build_tiers` outside engine/ is a kernel test.
   - the fixed-grid index's scan, UInt64 only, so Int64 already fails there (engine/src/index.rs:325-326, :471-475 @ 8e30b9d995bd64cdc540afc7f7a3e7b9f69b470e);
   - layout.rs, behind the `fixture` feature, out of the shipped build.
4. **Hypothesis H-SCAN** (labelled; discriminator: P-0). I have not observed it.
   - A signed narrow column holding a negative value is refused at open with the scan's negative detail. The reason to expect it: the scan tries `Option<u64>` first and falls back to `Option<i64>` (engine/src/dataset.rs:2085-2095 @ 8e30b9d995bd64cdc540afc7f7a3e7b9f69b470e sha256:82182b7921b98db4304406bdecc116e02fc11e7a93641687374a3cfc327042f7).
   - On the skip route at the base, the stream fails with the type error. After the change it fails with the negative detail.
5. **Hypothesis H-PRIM** (labelled; discriminator: P-0 and E1). The pinned DuckDB passes each narrow column as its plain primitive Arrow type, never as a dictionary. The reading by test saw plain types at 100 features only.
6. **DuckDB version.** The pinned crate is 1.10505.0, which vendors DuckDB v1.5.5. This is an earlier form's record (governance/forms/engine/SINGLE-FILE-BRACKET-NAME-REFUSED-AS-PARTITIONED-PREREGISTRATION.md:41-42 @ 8e30b9d995bd64cdc540afc7f7a3e7b9f69b470e sha256:9dddd3f8e7470d54cb265a771f106348d8370fed542e4d9856f897110c3a1358), cited for what it recorded.
7. **No fixture-drive confound.** Nothing is measured, and the 5 GB fixture is not read.

## §1 What this preregistration may and may not claim

- **May claim, once §4 is green on CI's Windows and Linux L1 entries** at the pinned DuckDB:
  - **For each of Int8, Int16, Int32, UInt8, UInt16 and UInt32** as a native `id`, and for a declared Int32 `parcel_key`, with non-negative unique values up to that type's maximum:
    - the open is admitted, as at main;
    - `Dataset::stream_with_cancel(&ViewportQuery::all(), …)` delivers every row;
    - each `id` equals its source value, carried as UInt64.
  - **For an Int32 native `id`, the same through the kernel.** The ticket is redeemed by `EngineSourceFactory` and drained as the data plane drains it.
  - **For Int8, Int16 and Int32, a negative value:**
    - is refused at open as `IdentityUnusable`, as at main;
    - on the skip route, the stream ends in `EngineError::Query` with the existing negative detail, before any row.
- **May not claim:**
  - publish, the live projected stream or the indexed seam as tested. They share `column_u64` by reading only (§0.1). The worker confirms one caller at the base;
  - LOD tiers or the fixed-grid index (OPEN-2, OPEN-3);
  - a dictionary-encoded or otherwise non-primitive narrow column (H-PRIM);
  - macOS; any run time or docs/08 row;
  - that the shell draws such a file. There is no e2e run; see §9 item 7.
- **ADR readings:**
  - **ADR-016:**
    - **§2** (docs/adr/ADR-016-stable-feature-identity-admission.md:62-63 @ 8e30b9d995bd64cdc540afc7f7a3e7b9f69b470e sha256:3b9907df69ea2d75bbf89931c894ae3801a4cd08471429bea0197987636e694c) recognises "a 64-bit integer column named `id`" (:63). A narrow native `id` departs from that letter at main, in admission. This piece makes the departure work. OPEN-1 decides it. Under (B) a dated note in the human's words; under (C) no note.
    - **§4 and §5** (:70-92) admit a value-preserving widening for a declared mapping (:83). There is no conflict for declared columns.
    - **§7** (:106-110): narrow values are below 2^53, so `js_exact` holds.
    - **The candidate list** (:165-169) stays 64-bit only.
    - **Amendment 1, item 6** (:234-236): native and mapped stay governed by §1 to §7.
  - **ADR-010 rule 2:** the id is the source value, so the indirection holds.
  - **ADR-006:** open and stream are pure reads, so no undo class is touched.
  - **ADR-004:** the narrow arms copy into the same `Vec<u64>` the UInt64 arm already fills (engine/src/stream.rs:2675 @ 8e30b9d995bd64cdc540afc7f7a3e7b9f69b470e sha256:9fb93a0ab1ef1cc52ef53bb1a0385c02de92821b77b45d8d9cc6142573a3df09). No copy claim is made.
  - **ADR-018:** no cancellation path is touched.
- **Wire:**
  - nothing under `protocol/`;
  - the envelope's `id` stays UInt64, non-null;
  - SKP-V0, the candidate list and every protocol fixture are unchanged.
- **Strings:** none added or changed. The three `column_u64` messages stay byte for byte. Under OPEN-1 (C), one new refusal detail is added, a `[P6 placeholder]`.
- **Portability:** not an OS-dependent feature, so no R3 item.

## §2 The change, stated before it is applied (engine; the kernel by test only)

**2.1 engine/src/stream.rs, `column_u64` (:2658-2692)**
- **Added:** six arms, after the Int64 arm and before the type error.
  - UInt8, UInt16 and UInt32 widen losslessly.
  - Int8, Int16 and Int32 are checked per value, as the Int64 arm is (:2677-2686). A negative value returns the existing negative detail (:2683) unchanged.
- **Kept as they are:** the null check (:2668-2673), the UInt64 and Int64 arms, and the type error (:2688-2691).
- **Not added:** an `as` cast on any signed value, a new allocation class, or a `pub` item.
- **Unchanged:** `build_sql` and the chunk loop.

**2.2 engine/src/fixture.rs (OPEN-4 (A))**
- **Added:** one identity mode. It writes the identity column natively at a narrow Arrow width, through the real producer, `write_geoparquet`. Its parameters:
  - the width, one of the six;
  - the column: `id`, or `parcel_key` with no `id` column;
  - the values, one of two:
    - top of range: the width's maximum minus the row index;
    - negative: −(row index) − 1, for signed widths only.
- **Arms:** one in `schema()` (:624-632), one in the value match (:1094-1106) and one in the column finish (:1167-1176).
- **The row index stays the seed of the geometry**, so a narrow file's rows differ from `NativeUnique`'s only in the identity column.
- **The writer refuses, never wraps,** when `features` exceeds what the width can hold.
- **Unchanged:**
  - every existing variant and its written bytes;
  - `FixtureSpec`'s defaults;
  - `FixtureFacts`.
- The variant shape and its names are the worker's, inside these constraints.

**2.3 engine/src/identity.rs** (test only). `only_value_preserving_integer_types_are_admitted` (:359-377) gains `D::Int8` and `D::UInt16` in its admitted list. Product code is unchanged.

**2.4 New tests:** `engine/tests/narrow_integer_id_stream.rs` (E1, E2) and `kernel/tests/narrow_integer_id_stream.rs` (K1). See §4.

**2.5 engine/README.md** (owner's index, pointers only):
- the Viewport stream row (:540) gains E1;
- the Last verified line (:537) gains its clause;
- the preregistration list (:557) gains this form's path.

**2.6 Sentences about behaviour.** These are written after the code (Part 1, item 1). They are checked clause by clause by both gates, and none is drafted here.
- **The comment on the new arms** covers:
  - the types widened, and how;
  - that the per-value check matters on the route where admission's scan did not run, the skip route;
  - that every type `admit_column_type` admits now reaches a u64 here;
  - that any other Arrow type keeps the type error;
  - its governing cites, by path and function.
- **The fixture mode's doc** covers what it writes and when it refuses.
- **E1's, E2's and K1's docs** each carry their `RECORDED MUTATION:` lines.
- **No comment elsewhere becomes false** by my reading:
  - the admission comment (engine/src/identity.rs:331-332) becomes true;
  - `build_sql`'s comment (engine/src/stream.rs:1433-1437) stays true;
  - lod.rs:1371 stays false and out of scope (OPEN-2).
  - The worker re-reads each of these at the head.

**2.7 docs/adr/ADR-016-stable-feature-identity-admission.md:** under OPEN-1 (B) only, a dated note in the human's typed words. The worker drafts no ADR text.

**2.8 Under OPEN-1 (C) instead:**
- `admit_column_type` (or its caller, engine/src/dataset.rs:1977) refuses a narrow width for `IdSource::File` with a new `[P6 placeholder]` detail. Declared columns are as above.
- KNOWN-LIMITATIONS.md item 3 changes, in the human's words at the click.
- E1's native rows become refusal rows.
- Files and ceiling: §7's (C) row.

## §3 Fixtures, outcomes predicted before P-0 and before code

All rows have 100 features, `avg_vertices` 8, and the default seed.

| Row | Column, width, values | At the base | At the head |
|---|---|---|---|
| N1-N6 | `id` as Int8, Int16, Int32, UInt8, UInt16, UInt32; top of range | admitted, `file:id`, verified, `max_value` = the width's max; the stream fails at its first chunk with the type error (observed for 0..99 values, report :55-72) | admitted, the same identity; the stream delivers 100 rows, their ids equal to the written set, as UInt64 |
| D1 | `parcel_key` Int32, top of range, no `id`, declared | admitted, `Mapped`, verified; the stream fails with the type error naming `id` (report :77-78) | admitted; 100 rows, ids equal to the written set |
| C0 | `NativeUnique` UInt64 (control) | 100 rows | 100 rows, unchanged |
| G1-G3 | `id` as Int8, Int16, Int32; negative | refused at open, `IdentityUnusable` with "negative" (H-SCAN) | unchanged |
| S1-S3 | G1-G3 declared as `id` with `skip_uniqueness_check` | admitted `DeclaredNotVerified`; the stream fails with the type error (H-SCAN) | admitted; the stream ends in `EngineError::Query` with the negative detail after 0 rows |
| S0 | `id` Int16, top of range, declared with skip (control) | admitted; the stream fails with the type error | 100 rows |

Declaring `id` itself as a mapping is an engine route already under test (engine/tests/identity.rs:308-311 @ 8e30b9d995bd64cdc540afc7f7a3e7b9f69b470e sha256:d1bfb2a8a742868edce053633664f95f7cbdca3052426f6743e181d0afdfd9b4).

## §4 Tests, and the mutation per new test

**P-0, before any code.** The worker runs a throwaway test at the branch base, under a shared hold, on its own target, and commits nothing.
- **Inputs:** the reading by test's rewrite (cast, with the `geo` key carried), extended to §3's G, S and top-of-range rows. The values are built by the rewrite, since the fixture mode does not exist yet.
- **Recorded:** each outcome in full, and the 40-hex commit.
- **Stops**, sent to the custodian with no code written:
  - a G row admitted, or refused with anything other than `IdentityUnusable` with "negative";
  - an N row's stream error that names a type other than the row's own narrow type (H-PRIM);
  - an N row admitted with any `max_value` other than the width's maximum.
- **Not a stop:** the S rows' base error text. It is recorded, and nothing more.

**E1** (new; proposed name `a_narrow_integer_identity_column_streams_every_row_with_its_source_value_widened_to_u64`). The rows are N1-N6, D1 and C0, each through `Dataset::open_cancellable` (D1 with an `IdentityDeclaration`), then `stream_with_cancel(&ViewportQuery::all(), CancelToken::new())`. The batches are decoded as engine/tests/filter_type_admission.rs:85-116 @ 8e30b9d995bd64cdc540afc7f7a3e7b9f69b470e sha256:fee7626a3444e601b614b91c70b650d8a72b05c85204e4f81ba0f6f7e6b547d0 does. For each row it asserts:
- (i) the column's Arrow type, read back from the written file's footer, is the intended width (the vacuity guard);
- (ii) the identity's source, its uniqueness, `verified_rows` = 100 and `max_value`;
- (iii) the drain ends with no error;
- (iv) every batch's `id` downcasts to `UInt64Array`;
- (v) the delivered ids equal the written set exactly, and number 100.

Mutations for E1:
- **M-1:** the Int32 arm removed. Predicted to fail E1 by name at N3 (stream error).
- **M-3:** the UInt32 arm reads through `i32` (`as i32 as u64`). Predicted to fail at N6 (v).
- **M-4:** the fixture's narrow mode writes UInt64. Predicted to fail at N1 (i).

**E2** (new; proposed name `a_negative_value_in_a_signed_narrow_identity_is_refused_at_open_and_at_stream_on_the_unverified_route`). It covers G1-G3, S1-S3 and S0.
- G rows: `Err(EngineError::IdentityUnusable { detail, .. })` with "negative" in the detail, as engine/tests/identity.rs:262-265 @ 8e30b9d995bd64cdc540afc7f7a3e7b9f69b470e sha256:3c17931fc4fc625861aaa2eec7f4ff3c587991964a43b09a1a9d79243624436d asserts.
- S rows: the open is admitted `DeclaredNotVerified`, and the first stream item is `Err(EngineError::Query(detail))` with "negative" in the detail, after 0 rows. This is the real shape, not an invented string (Part 1, item 7).
- S0: 100 rows.
- **M-2:** the Int16 arm maps with `as u64` instead of `u64::try_from`. Predicted to fail E2 by name at S2.

**K1** (new; proposed name `a_narrow_integer_id_file_opened_through_the_kernel_streams_to_the_data_plane_without_a_terminal_error`). The kernel boundary test (Part 1, item 7; OPEN-5 (A)).
- **File:** N3's shape.
- **Harness:** that of kernel/tests/typed_terminal_codes.rs:113-174 @ 8e30b9d995bd64cdc540afc7f7a3e7b9f69b470e sha256:d5afd74b4c60061ee03a27443d459acb292e3efd414df78c130495cf0574ea0c (`Catalog::open`, `SkpHost::viewport_query`, `EngineSourceFactory::ticket_only`, `next_into`), without the touch.
- **Asserts:**
  - no `Err` terminal;
  - each buffer decodes as Arrow IPC;
  - the ids equal the written set;
  - 100 rows.
- **M-1**, observed against K1 as well. Predicted to fail at the terminal assertion, with a detail beginning with `engine.query`.

**The changed unit test** (§2.3). **M-5:** `D::Int8` removed from `admit_column_type`'s match. Predicted to fail `only_value_preserving_integer_types_are_admitted` by name.

**How each mutation is observed:**
1. Apply it alone.
2. Run the named test.
3. Record the failing assertion by name, with the full commit id, in a `RECORDED MUTATION:` doc line.
4. Revert it.

A `verify-mutation` run is not an observation (docs/PREREGISTRATION-TEMPLATE.md:172 @ 8e30b9d995bd64cdc540afc7f7a3e7b9f69b470e sha256:316062ef43090b93187b8410a97bdd9d3424fa747dd09f4cafe84906622e88c2).

**Determinism:**
- No sleep, retry, timeout, watchdog, `#[ignore]` or `cfg` in E1, E2 or K1.
- Each test writes its fixtures under its own directory, under a name unique to the test.

**Existing tests that stay green, unloosened:**
- `only_value_preserving_integer_types_are_admitted` (it gains types only);
- `candidate_columns_are_the_64_bit_integer_columns_in_schema_order_unranked`;
- `a_declared_mapping_to_a_non_integer_column_is_refused_not_hashed`;
- `a_negative_identity_value_is_refused_because_it_cannot_widen_into_u64`;
- `skipping_the_uniqueness_check_is_recorded_rather_than_hidden`;
- `kernel/tests/skp_admission_remediation.rs::a_declared_identity_beside_the_files_own_id_refuses_a_filter_naming_id_as_ambiguous`;
- `stream.rs::tests::the_where_composition_matrix_matches_the_declared_rule_exactly`, and every other test of the SQL text;
- every test that asserts a fixture hash.

## §5 Predictions, declared unchanged, invalidators, falsification

- **Predictions:**
  - §3's table;
  - E1, E2 and K1 green on both L1 entries;
  - M-1 to M-5 failing as §4 says.
- **Declared unchanged:**
  - `build_sql`'s SQL text;
  - `admit_column_type`'s arms and refusal detail (under (B));
  - `candidate_identity_columns`;
  - `admit_identity` and `run_identity_scan`;
  - the null check, the UInt64 and Int64 arms, and the three messages of `column_u64`;
  - the envelope's `id` field;
  - SKP-V0, every protocol fixture, `error_of` and `terminal_detail_of`;
  - everything under kernel/src, frontends/ and renderer/;
  - engine/src/lod.rs, index.rs, rowgroup.rs, layout.rs and lib.rs;
  - Cargo.toml and Cargo.lock;
  - every existing `IdentityMode` variant's bytes, and every fixture hash (kernel/FIXTURES.md, the S fixture);
  - KNOWN-LIMITATIONS.md (under (B));
  - every ADR, except ADR-016's note under (B);
  - every committed form (ADMISSION, 8c, 8f and the rest).
- **Invalidators.** Each one stops the piece and goes to the custodian:
  - **I-1:** any P-0 stop.
  - **I-2:** any declared-unchanged item moves.
  - **I-3:** at the base, `column_u64` has a second caller, or a stream-path id reader exists outside it. The worker checks with `git grep -n column_u64` and `git grep -nE "UInt64Array|Int64Array" -- engine/src`, each grep self-tested positive.
  - **I-4:** an exhaustive `match` over `IdentityMode` outside fixture.rs. By my Grep, every other use is a constructor.
  - **I-5:** the fixture change alters any existing variant's output.
  - **I-6:** code started before the human answers OPEN-1 and OPEN-6.
  - **I-7:** a file outside the selected §7 row is needed.
- **Falsification.** At the head, any one of these:
  - a narrow row delivers an id that differs from its source value, or a negative value;
  - E1 passes under M-1;
  - any C0 or S0 count changes.

## §6 Instruments

Every quantity is an assertion: a typed outcome, an Arrow type, an id set, a row count. Nothing is measured, and there is no docs/08 figure.

## §7 Declared values and ceilings

- **Fixtures:** 100 features per row; the values are as §2.2 states.
- **Size.**
  - **Counting command:** `git diff --numstat origin/main...HEAD -- <the row's paths>` at a named commit.
  - **Excluded:** this form, PLAN.yaml and FILLER-QUEUE.md.
  - **Overrun:** an overrun is class 8, with the words `budget overrun, §7 not edited`, and this line is not edited.
  - **Estimates:** mine, unmeasured, with rustfmt growth allowed for.

| OPEN-1 | Files | Ceiling | Estimate |
|---|---|---|---|
| (B) | engine/src/stream.rs, engine/src/fixture.rs, engine/src/identity.rs, engine/tests/narrow_integer_id_stream.rs, kernel/tests/narrow_integer_id_stream.rs, engine/README.md, docs/adr/ADR-016-stable-feature-identity-admission.md (7) | 480 | ~390 |
| (C) | (B)'s first six, plus engine/src/dataset.rs and KNOWN-LIMITATIONS.md (item 3 only); no ADR file (8) | 560 | ~450 |

- **Time:** the node's 60 minutes are the custodian's to revise.

## §8 Block-on-sight

1. Code before #294 merges, before the human's answers to OPEN-1 and OPEN-6, or before P-0's record.
2. An `as` cast on a signed value in `column_u64`, or a `column_u64` message changed.
3. Any SQL text, admission arm, scan or refusal detail changed (under (C): beyond §2.8).
4. A new `pub` item outside the `fixture` module; an edit to engine/src/lib.rs, Cargo.toml or Cargo.lock.
5. Any path under kernel/src, protocol/, frontends/, renderer/ or .github/; engine/src/lod.rs or index.rs (OPEN-2, OPEN-3).
6. An existing fixture's bytes changed.
7. ADR-016 text that is not the human's typed words. ADR or KNOWN-LIMITATIONS text drafted by the worker.
8. A comment, doc or test-text clause not checked against the built code.
9. A sleep, retry, timeout, watchdog, `#[ignore]` or `cfg` in E1, E2 or K1. An existing assertion weakened.
10. A mutation not observed as §4 says, or a `verify-mutation` run called an observation.
11. P-0 or any probe on a shared cargo target, or anything from it committed.
12. A claim beyond §1. A DuckDB behaviour stated without its version.
13. A path in §(00)'s in-flight lists, unless that list's condition is met.
14. Any CI entry red.

## §9 Gates and sequence

1. **This form is committed** on main by the custodian, with its settlement.
2. **P-0, by the worker**, at the branch base after #294 merges, with nothing committed (§4). The custodian may run it earlier with a tester, under §36's one filler at a time. If so, the worker shows at its base that `admit_identity` and `run_identity_scan` did not change between the two commits.
3. **A class 1 amendment**, only if P-0 requires one.
4. **Code, then comments.**
   - M-1 to M-5 are observed.
   - The full suite runs in a shared hold at the head and passes there before any gate (Part 1, item 4).
5. **The draft PR, then both gates from dispatch,** given one packet (Part 1, item 5):
   - **the architect:** §1's ADR-016 reading against the human's OPEN-1 answer, and §8 item by item;
   - **the reviewer:**
     - the full diff;
     - the seam from `column_u64` to the kernel's `EngineSource`, against its real interface, through K1;
     - every comment clause by clause.
6. **The words.**
   - Under (B), the ADR-016 note is the human's, typed in the OPEN-1 answer or at the click.
   - Under (C), KNOWN-LIMITATIONS item 3 and the placeholder are the human's at the click and at the sitting.
7. **Operator.** No walkthrough row. The custodian notes for the next sitting that a narrow-id file now draws.
8. **Verification.**
   - **The worker, at the base:**
     - I-3's greps;
     - `git grep -n "IdentityMode" -- "*.rs"` (I-4);
     - `node scripts/plan/verify-test-claims.mjs`.
   - **The worker, at the head:**
     - `cargo fmt --all --check`;
     - `cargo test --workspace --locked`, in full;
     - each mutation;
     - §7's command;
     - `git diff --name-only origin/main...HEAD`;
     - `verify-cites.mjs`, `verify-quotes.mjs` and `verify-test-claims.mjs`;
     - `node --test` over the scripts suite, before pushing.
   - **The gates:** they re-run the full suite at the reviewed head and re-observe each mutation (Part 1, item 9).
   - **CI:** both L1 entries of product-ci-rust, rust-fmt and governance CI.
9. **Out-of-scope categories, as I read them:**
   - **ADR:** touched under (B), by the note; this is a red line.
   - **Wire:** none.
   - **Security:** none.
   - **Guarantee:** touched, because ADR-016's identity contract is brought to the code.
   - **Size:** over §21c's bound. So the route is full gating.

# Rule (00), path by path

Rule (00): governance/AUTONOMY.md:609 @ 8e30b9d995bd64cdc540afc7f7a3e7b9f69b470e sha256:db1a80acb95c7872de091ec4a4eb9647e09c17b0a5475050b4d934e0a39e2bd0. The in-flight lists are the brief's; I cannot read branches.

| In flight | Overlap |
|---|---|
| 8f, #294 | engine/src/stream.rs and engine/README.md. No code before it merges (PLAN `depends_on`). engine/src/index.rs and dataset.rs only under OPEN-3 (B) and OPEN-1 (C) respectively. KNOWN-LIMITATIONS.md only under (C), item 3 against 8f's item 20, checked by hunk. |
| #292, #293, area A | None. |
| port-2 | engine/src/lod.rs only under OPEN-2 (B) or (C). Contact only on engine/src/lib.rs, which is not edited. KNOWN-LIMITATIONS.md under (C), checked by hunk. |
| 1c step 1 | None. Its kernel paths are disjoint from K1's new file; kernel/src/lib.rs is not edited. |

Nothing here touches `protocol/`, a wire fixture, Cargo.lock or package-lock.json.

## §10 Amendments (opens empty; append-only)

---

## Notes (mine)

1. **The route.** Full form and full gating:
   - by §21c's line bound (governance/AUTONOMY.md:347-357 @ 8e30b9d995bd64cdc540afc7f7a3e7b9f69b470e sha256:87932677b77260bd12a21590a4611707aec57b89f69124ca0465a4d058bfeb31), on lead-data's estimate and mine;
   - by its fourth bound, since a stream that failed now draws, which is new user-visible behaviour;
   - under OPEN-1 (B), also by §21a's ADR category (:315-332). §25(e) then forbids the five-line form at dispatch (:482).
   - The filler slot's five-line condition (§36) is not met, so keeping the piece there is the human's (OPEN-6).
2. **The custodian's item 2.** I read "Unreachable through `Dataset`" (engine/src/lod.rs:1371) as an invariant claim that is false at main. It is a pre-existing Correctness defect in a file rule (00) closes to this piece. OPEN-2 (A) records it as out of scope, with a node proposed, so the hand-back's disclosure is decided before dispatch (Part 1, item 4).
3. **The caller rule and the fixture mode.** The `fixture` feature is test support, gated out of the shipped path (engine/Cargo.toml:11-20 @ 8e30b9d995bd64cdc540afc7f7a3e7b9f69b470e sha256:17b4a0a4270d16fc5d158ad56c8e7127651966050a6792d621f0b87d14cf171d), and every `IdentityMode` variant has only test callers. A prior piece added `write_zone_texts` to it (engine/README.md:537). My reading: the round-4 rule's "product caller" binds the shipped build, not this module. If a gate reads otherwise, OPEN-4 (B) is the fallback.
4. **Seen, not this piece's to fix:**
   - KNOWN-LIMITATIONS item 3's anchor comment cites engine/src/identity.rs:196-217 and engine/src/error.rs:234-238 (KNOWN-LIMITATIONS.md:68 @ 8e30b9d995bd64cdc540afc7f7a3e7b9f69b470e sha256:2af2b6c0d1c97370bdb64a20b1ea1a1911628b9522f07e9f81624f615a4f4e00). At 8e30b9d9 those spans are :317-346 and the Display arm. Docs lane.
   - engine/README.md:557 lists `engine/*-PREREGISTRATION.md` paths. Lead-data reports they are not under engine/; I did not check.
5. **Perf (docs/08).** No risk introduced and none claimed. The narrow arms fill the same per-chunk `Vec<u64>` as the UInt64 arm.

## OPEN items

**OPEN-1: ADR-016 §2 against a narrow native `id`.** I read a conflict.
- §2 recognises only "a 64-bit integer column named `id`" (docs/adr/ADR-016-stable-feature-identity-admission.md:63 @ 8e30b9d995bd64cdc540afc7f7a3e7b9f69b470e sha256:245c7fc1fe5e78e12b4fe1fab786a08f1f15e731344240cc55988fe918f7e38a). Amendment 1, item 6 keeps §1 to §7 in force for native identity (:234-236).
- Admission already departs from that letter at main (engine/src/identity.rs:333 with engine/src/dataset.rs:1930, 1977). Shape C makes the departure work.
- For declared columns there is no conflict (§4, §5 :83).
- **(A) Shape C with no note.** Not recommended. It would land code against an accepted, architect-blockable ADR with the conflict unrecorded, and I would block it at the gate.
- **(B) Recommended. Shape C for all, with a dated note on ADR-016 in the human's words. A red line, the human's** (governance/AI_DEVELOPMENT.md:451-454 @ 8e30b9d995bd64cdc540afc7f7a3e7b9f69b470e sha256:573c907fab55b870ebdc353b7f19459438e3b74c8667217b4c07f8f5a332d821: ADR amendments). What the note must cover, my words and not drafted text:
  - §2's "64-bit" is the identity as carried;
  - a native `id` of an integer type that widens into u64 exactly is recognised, with uniqueness and negative values verified as §5 says;
  - the candidate list stays 64-bit.
  
  Why (B):
  - KNOWN-LIMITATIONS item 3, which the brief records as the human's wording, already tells users the column "must be an integer type that widens into `u64` without transformation" (KNOWN-LIMITATIONS.md:64 @ 8e30b9d995bd64cdc540afc7f7a3e7b9f69b470e sha256:ebee8389e5cda66a4c20be05c937e394172750dd0f7bdccca74a9c76ef861aec). (B) makes that true and leaves it unchanged.
  - (B) adds no string.
  - Under (C), a refused narrow `id` could be declared by its own name and then open (engine/tests/identity.rs:308-311 shows the engine accepts a declaration of `id`; I did not read whether the kernel or the shell allows it). The refusal would protect nothing.
- **(C) Shape A for a native `id`, shape C for a declared column.** No ADR text, but these come with it:
  - a new `[P6 placeholder]` refusal detail;
  - KNOWN-LIMITATIONS item 3 in the human's words;
  - a file that opens today is refused.
  
  It conforms to the letter without a note. The behaviour change for users is the human's either way (AI_DEVELOPMENT.md:454).

**OPEN-2: the LOD sibling (engine/src/lod.rs).** Not a red line.
- **(A) Recommended.** Out of scope. lod.rs is untouched, its comment stays as it is, and this form records the reason:
  - rule (00) against port-2;
  - no product caller reaches `build_tiers` (kernel/src/skp.rs:2258-2264), so the app cannot reach the false arm.
  - The custodian proposes a node, after port-2: `read_ids` widened like `column_u64`, the comment corrected, and a test.
- **(B)** In scope. The piece waits for port-2's merge; that wait has no date.
- **(C)** A comment-only correction, also after port-2. Not recommended: it leaves the defect and still waits.

**OPEN-3: the fixed-grid index's UInt64-only read (engine/src/index.rs:471-475).** Not a red line.
- **(A) Recommended.** Out of scope, recorded:
  - it is an experimental seam the product planner never reaches (`engine/tests/planner_seam.rs::the_product_planner_never_reaches_the_index_seam`, engine/README.md:549 @ 8e30b9d995bd64cdc540afc7f7a3e7b9f69b470e sha256:900c3455c4ff05d197873fa023b3b69724834fd06dce45eea482708d649d029c);
  - Int64 already fails there, so it is a gap of the seam, not a narrow-type sibling;
  - its error text, "index: id column is not u64", is true.
- **(B)** In scope after #294 (index.rs is in its diff): a shared widening helper, plus a seam test. This adds code on a path with no product caller. Not recommended.

**OPEN-4: where the narrow fixture lives.** Not a red line.
- **(A) Recommended.** A new `IdentityMode` in engine/src/fixture.rs, written natively by `write_geoparquet` (§2.2):
  - Part 1, item 7 asks for the real producer;
  - K1 needs it, because kernel/Cargo.toml:36-38 @ 8e30b9d995bd64cdc540afc7f7a3e7b9f69b470e sha256:dae7a90e91ee08796aef48b685deb77b50d8f1312e1c885ef4de0528c2863360 has no `parquet` dev-dependency;
  - M-3's top-of-range values are written values, not casts of 0 to 99.
- **(B)** The reading by test's rewrite stays in the engine test. K1 is then dropped, or the kernel gains a dev-dependency, which is a red line (dependency changes). Not recommended.

**OPEN-5: K1, the kernel boundary test.** Not a red line.
- **(A) Recommended:** in scope (Part 1, item 7).
- **(B)** Engine tests only.

**OPEN-6: the route. A red line, the human's.** §36's five-line condition is set aside, as in the human's rulings for 8c and 8f.
- **(A) Recommended.** The full form, both gates, kept in the filler slot.
- **(B)** The piece leaves the filler queue for a slot placement.

**OPEN-7: P-0 by the worker at its base (A, recommended), or earlier by a tester (B).** The custodian's call under §36. Not a red line.

## What I could not settle

- Whether HEAD is 8e30b9d9. I read the working tree.
- 8f's diff to engine/src/stream.rs (5/5 lines by its Amendment 2) and to engine/README.md. The worker re-reads, at its base after #294:
  - `build_sql`, `column_u64` and its caller, by content;
  - README :537, :540 and :557;
  - under (C), `admit_identity`.
  - Every cite in this form is re-derived there, and a clause whose code has moved is re-checked, not carried.
- H-SCAN and H-PRIM (P-0 decides them).
- Whether the kernel or the shell accepts a declaration naming `id` (relevant to OPEN-1 (C) only).
- `stream_for_publish`'s and the projected stream's paths to `column_u64`: lead-data's reading, not mine.
- The line estimates, which are unmeasured.
- The directive of 2026-10-31, item 4, and its hold to 2026-11-09: cited as the brief gives them, not read.

Whose words:
- **ADR-016's note (OPEN-1 (B))** is the human's, and a red line. No words are given.
- **KNOWN-LIMITATIONS item 3** does not change under (B). Under (C) it is the human's at the click, and no words are given.
- **Every other sentence the piece writes** is code comments, test docs, fixture docs or README pointers. None is the human's wording or red-line text, and each is checked clause by clause after the code.

## The custodian's settlement (class 1, before any change)

- **OPEN-1 (B) and OPEN-6 (A): the human's**, by the message of 2026-11-07 (20:25Z; its first line dates it 2026-11-09): state/directives/2026-11-07-8g-open-1-b-adr-016-note-open-6-a-294-not-held-index-sites-narrowed-entry-13-x2-into-item-20.md:8 @ 1bc349ae2b77ec955138e2b40e32be5b7b0c8352 sha256:a4821dbbe0dc8001c2ec0b4e3fee530a5e39685538b709ca8aae6fe92943a79c and state/directives/2026-11-07-8g-open-1-b-adr-016-note-open-6-a-294-not-held-index-sites-narrowed-entry-13-x2-into-item-20.md:9 @ 1bc349ae2b77ec955138e2b40e32be5b7b0c8352 sha256:6b464fd1ca494f22c3034e4cd49f147fb95ede6544587e9bf104074cebd4b2a2. (C) is refused there.
- **ADR-016's note (§2.7):** the human's words are the span of that OPEN-1 line between `My note on ADR-016: "` and `" (C) is refused`, 413 bytes, sha256 c3e7098b35021c19f17d1cfc2d524a4016dbd2f205ccd87a3934d38d19320226. The worker appends them byte for byte at the end of ADR-016, in the shape of ADR-021's note of 2026-11-06 (a `## Note` heading with the note's date, an italic line naming the directive, then the note), and drafts no ADR text.
- **OPEN-2 (A), OPEN-3 (A), OPEN-4 (A) and OPEN-5 (A)**, each the draft's recommendation, taken on 2026-11-07 (the direction of 2026-10-31, item 4, `state/directives/2026-10-31-away-until-11-04-clicks-from-the-app-270-size-o0-file-open-items-take-recommendation.md`, held until 2026-11-09 by `state/directives/2026-11-03-away-until-11-09-276-open-1-seven-clauses-open-4-c-placed-sitting-wording-leaves-slot-cloud-credit.md`, line 6); the human reviews each on return and may reverse it, a reversal recorded, never edited in.
- **OPEN-7 (A), the custodian's:** P-0 by the worker at its base, with nothing committed.
- **Sequencing:** PR #294 (8f) merged on 2026-11-07 (95e89c10), so §8 item 1's "before #294 merges" is met, and the PLAN `depends_on` is done. This piece is the filler slot's one in flight.
- **The read commit and main:** `git diff --name-only 8e30b9d9 1bc349ae` over the 22 files the pins name lists 7: `KNOWN-LIMITATIONS.md`, `engine/README.md`, `engine/src/dataset.rs`, `engine/src/stream.rs`, `governance/PLAN.yaml`, `governance/forms/engine/SINGLE-FILE-BRACKET-NAME-REFUSED-AS-PARTITIONED-PREREGISTRATION.md`, `state/FILLER-QUEUE.md`. The pins keep the read commit's lines. The worker re-reads every pinned cite at its own base by content; a clause whose code has moved is re-checked, not carried.
- **Rule (00)** at main 1bc349ae, `git diff --name-only origin/main...<branch>` against §7's (B) paths (the two test files are new): area A (`cut/shell-comments-drift-sweep-area-a`): none; port-2 (`cut/port-2-macos-l1-and-app-dirs`): none; 1c (`cut/b2-piece-1c-save-and-reopen`): none. It is checked again at dispatch.

## Amendments (opens empty; append-only)
