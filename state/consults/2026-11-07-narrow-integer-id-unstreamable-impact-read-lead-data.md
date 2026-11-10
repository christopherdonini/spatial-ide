*Custodian's filing note (2026-11-07): lead-data's impact read for filler entry 8g, `narrow-integer-id-unstreamable`, read only at main 59c93093, after the reading by test (`state/consults/2026-11-07-narrow-integer-id-unstreamable-u2-reproducer-tester.md`). Its brief was given by file (10148 bytes, sha256 aeb62a9a3f21c25d68c22a6b8e5e9d3f077aa5fe6ddded3e8a2226ccb9c879be), with the reuse index's output byte for byte (two misses) and the in-flight paths by git. Dispatched at 2026-11-07T17:32:14.584Z by its transcript; the run went to 17:40:35Z (claude-opus-5-5; unique calls: Read 47, Grep 58, Glob 2 and the hand-back, 108 in all, equal to the notification's). The report below was extracted by script from the hand-back in that transcript (23571 bytes, sha256 d8ca64cf8518ba3cd75ed382d6920cd43d38aafe4b771357b9e89ec1714562d3) and is unchanged. The custodian re-read four of its pointers at main (ADR-016 line 63, the LOD comment in engine/src/lod.rs, the admission comment in engine/src/identity.rs and the negative-value detail in engine/src/stream.rs) and found each as quoted. Its two blocking questions, ADR-016 §2 and the LOD sibling, go to the architect's form draft as OPEN items. A report, not Authority.*

---

Impact read: narrow-integer-id-unstreamable (lead-data, 2026-11-07)

I have no shell, so I could not check the brief's sha256 (aeb62a9a…), and I give no sha256 for this report and list no branch. I started no background shell and leave none. I wrote no file; the custodian files this text at C:/dev/spatial-ide/state/consults/2026-11-07-narrow-integer-id-unstreamable-impact-read-lead-data.md. I read the main checkout. The session's start snapshot gives its HEAD as 59c930939aa742655d39c54cbbf84b16078006eb (abbreviated below as 59c93093); I did not re-verify that HEAD. All prose is my own words unless it is in quotation marks, and every quotation is byte-copied from the file cited.

## 1. The behaviour at main

- **What admission accepts.**
  - The type check admits all eight integer widths (engine/src/identity.rs:333 @ 59c930939aa742655d39c54cbbf84b16078006eb). The comment above it says "Widening into u64 is exact." (engine/src/identity.rs:331 @ 59c930939aa742655d39c54cbbf84b16078006eb).
  - The check is called for both the native `id` and a declared column (engine/src/dataset.rs:1977 @ 59c930939aa742655d39c54cbbf84b16078006eb).
  - Then one scan reads count, distinct, min and max (engine/src/dataset.rs:1994-1999 @ 59c930939aa742655d39c54cbbf84b16078006eb). If min < 0 the open is refused as `IdentityUnusable` (engine/src/dataset.rs:2025-2036 @ 59c930939aa742655d39c54cbbf84b16078006eb). `max_value` is kept as u64 (engine/src/dataset.rs:2053 @ 59c930939aa742655d39c54cbbf84b16078006eb).
  - The candidate list offered on a refusal holds only Int64 and UInt64 columns (engine/src/identity.rs:299-315 @ 59c930939aa742655d39c54cbbf84b16078006eb).
- **What the stream asks DuckDB for.** The source column is aliased to `id` with no cast (engine/src/stream.rs:1438-1440 @ 59c930939aa742655d39c54cbbf84b16078006eb). Every stream entry point reaches this one `build_sql` through `stream_inner` (engine/src/stream.rs:1222 @ 59c930939aa742655d39c54cbbf84b16078006eb): viewport (:919-936), publish (:950-964), live projected (:1012-1039) and the experimental index seam (:1051-1068), all @ 59c930939aa742655d39c54cbbf84b16078006eb.
- **Where the type check fails.**
  - Each chunk's ids are read by `column_u64` (engine/src/stream.rs:1947 @ 59c930939aa742655d39c54cbbf84b16078006eb), its only caller.
  - `column_u64` accepts `UInt64Array`, and `Int64Array` with a per-value negative refusal (engine/src/stream.rs:2674-2687 @ 59c930939aa742655d39c54cbbf84b16078006eb). Anything else gets `EngineError::Query` with "`{name}` is {}; expected a 64-bit integer" (engine/src/stream.rs:2688-2691 @ 59c930939aa742655d39c54cbbf84b16078006eb).
  - The reproducer's printed lines show this for every narrow width and for the declared `parcel_key` (state/consults/2026-11-07-narrow-integer-id-unstreamable-u2-reproducer-tester.md:55-78 @ 59c930939aa742655d39c54cbbf84b16078006eb). Its error names `id`, not the source column (same file, line 31).
- **What the kernel sends.**
  - `EngineError::Query` maps to the code `query` (kernel/src/skp.rs:2184 @ 59c930939aa742655d39c54cbbf84b16078006eb). The terminal detail is built as `"<code>: <display>"` (kernel/src/skp.rs:2107-2109 @ 59c930939aa742655d39c54cbbf84b16078006eb), using the `query: ` Display (engine/src/error.rs:350 @ 59c930939aa742655d39c54cbbf84b16078006eb).
  - It leaves at `EngineSource::next_into` as `Err(detail)` (kernel/src/lib.rs:700-704 @ 59c930939aa742655d39c54cbbf84b16078006eb). The data plane turns that into `Terminal::ProducerFailed` (protocol/data-plane/src/adapter_ws.rs:211 @ 59c930939aa742655d39c54cbbf84b16078006eb).
- **What the app shows.**
  - `formatTerminalRefusal` strips the `engine.query` prefix (frontends/shell/src/streaming/formatTerminalRefusal.ts:33-45 @ 59c930939aa742655d39c54cbbf84b16078006eb).
  - The canvas banner is then set to `stream ${terminal.kind}: ${…message}` (frontends/shell/src/App.tsx:1756 @ 59c930939aa742655d39c54cbbf84b16078006eb), and the scan is marked failed (:1757).
  - No form is offered: the identity form is reached only through `engine.identity_unusable` (frontends/shell/src/admission/AdmissionPanel.tsx:31 @ 59c930939aa742655d39c54cbbf84b16078006eb).
- **Publish fails the same way.** Publish streams through `stream_for_publish` (kernel/src/publish/mod.rs:758 @ 59c930939aa742655d39c54cbbf84b16078006eb), so it hits the same `column_u64`.

## 2. The shapes of a fix

How negatives are treated today (my reading):
- A signed column with a negative value is refused at open by the scan (engine/src/dataset.rs:2025-2036 @ 59c930939aa742655d39c54cbbf84b16078006eb). This is pinned for Int64 by `engine/tests/identity.rs::a_negative_identity_value_is_refused_because_it_cannot_widen_into_u64` (engine/tests/identity.rs:250-268 @ 59c930939aa742655d39c54cbbf84b16078006eb), using `IdentityMode::NegativeIds` (engine/src/fixture.rs:542, :630, :1099 @ 59c930939aa742655d39c54cbbf84b16078006eb).
- The scan is skipped only when `skip_uniqueness_check` is set (engine/src/dataset.rs:1979-1988 @ 59c930939aa742655d39c54cbbf84b16078006eb). That is an engine-API-only route: the wire has no field for it (kernel/src/skp.rs:1726-1729 @ 59c930939aa742655d39c54cbbf84b16078006eb; docs/adr/ADR-016-stable-feature-identity-admission.md:163-164 @ 59c930939aa742655d39c54cbbf84b16078006eb). On that route an Int64 negative is refused at read (engine/src/stream.rs:2682-2683 @ 59c930939aa742655d39c54cbbf84b16078006eb).

Every other consumer I found that reads the identity as 64-bit:
- **LOD tier builder.** It reads the source with the Parquet reader, not DuckDB. A type other than UInt64 or Int64 is reported as an "internal inconsistency" (engine/src/lod.rs:1367-1379 @ 59c930939aa742655d39c54cbbf84b16078006eb). Its comment, "Unreachable through `Dataset`", is false at main for the narrow types; `read_ids` is at engine/src/lod.rs:1820-1854 @ 59c930939aa742655d39c54cbbf84b16078006eb. No SKP command builds a tier (kernel/src/skp.rs:2261-2262 @ 59c930939aa742655d39c54cbbf84b16078006eb).
- **Fixed-grid index (experimental seam).** UInt64 only, so Int64 already fails there too (engine/src/index.rs:326, :471-475 @ 59c930939aa742655d39c54cbbf84b16078006eb).
- **Row-group index.** It parses the id statistics as decimal strings into u64 (engine/src/rowgroup.rs:500-511 @ 59c930939aa742655d39c54cbbf84b16078006eb), so it does not depend on width.
- **Layout curve keys.** UInt64 only (engine/src/layout.rs:467-471 @ 59c930939aa742655d39c54cbbf84b16078006eb), but the module is behind the `fixture` feature (engine/src/lib.rs:118-119 @ 59c930939aa742655d39c54cbbf84b16078006eb).
- **Session tier.** Its source column is `file_row_number` (engine/src/identity.rs:96 @ 59c930939aa742655d39c54cbbf84b16078006eb), which the vendored probe reads as i64 (engine/tests/session_identity.rs:92, :108-109 @ 59c930939aa742655d39c54cbbf84b16078006eb). It is not a narrow file column.
- **Batch envelope.** It declares `id` as UInt64, non-null (engine/src/envelope.rs:254 @ 59c930939aa742655d39c54cbbf84b16078006eb), filled from the `Vec<u64>` (engine/src/stream.rs:2499 @ 59c930939aa742655d39c54cbbf84b16078006eb).
- **Publish and the kernel.** The bundle column is `UInt64` (kernel/src/publish/mod.rs:1296-1299 @ 59c930939aa742655d39c54cbbf84b16078006eb). `max_value`/`js_exact` go out on describe (kernel/src/skp.rs:2014-2015 @ 59c930939aa742655d39c54cbbf84b16078006eb) and into the bundle (kernel/src/publish/mod.rs:1470 @ 59c930939aa742655d39c54cbbf84b16078006eb). No other kernel source reads an id array; my grep of kernel/src for `UInt64Array`, `Int64Array` and `column_u64` found none.

**Shape A: refuse the narrow types at open.**
- Sites:
  - drop the six narrow arms (engine/src/identity.rs:333 @ 59c930939aa742655d39c54cbbf84b16078006eb) and its comment (:331-332);
  - the refusal detail (engine/src/identity.rs:338-342 @ 59c930939aa742655d39c54cbbf84b16078006eb), which would tell an Int32 column it "widens", so it needs new words;
  - the unit test `only_value_preserving_integer_types_are_admitted` (engine/src/identity.rs:360-367 @ 59c930939aa742655d39c54cbbf84b16078006eb);
  - the error doc (engine/src/error.rs:151-156 @ 59c930939aa742655d39c54cbbf84b16078006eb).
- Negatives: the question goes away, because a narrow signed column never reaches the scan. Int64 is treated as today.
- Other consumers: none change. The LOD and index comments become true.
- What the user sees:
  - A file with a narrow `id` would now refuse at open (the session tier is reached only when there is no `id`; engine/src/dataset.rs:1933-1960 @ 59c930939aa742655d39c54cbbf84b16078006eb).
  - The identity form is offered, but its candidate list holds only 64-bit columns.
  - The shell's free-text hint, "may also be admissible by name" (frontends/shell/src/admission/IdentityDeclarationForm.tsx:77-80 @ 59c930939aa742655d39c54cbbf84b16078006eb, with its comment at :56-59), becomes false. So this shape reaches frontends/.
- Wire: no new field and no new code (`engine.identity_unusable` exists, kernel/src/skp.rs:2199-2213 @ 59c930939aa742655d39c54cbbf84b16078006eb). There is a new detail value. Fixtures: none needed, except a test fixture for the refusal.

**Shape B: widen in the SQL projection.**
- Site: engine/src/stream.rs:1438-1440 @ 59c930939aa742655d39c54cbbf84b16078006eb. The cast has to depend on the type (via `self.file_schema()`, as used at engine/src/stream.rs:998 @ 59c930939aa742655d39c54cbbf84b16078006eb).
- If applied unconditionally, it changes the SQL text pinned by `stream.rs::tests::the_where_composition_matrix_matches_the_declared_rule_exactly` (engine/src/stream.rs:3787, :3801-3803 @ 59c930939aa742655d39c54cbbf84b16078006eb), and possibly `the_predicate_text_rides_verbatim_never_rewritten_or_case_folded` (:3874) and `identifiers_are_quoted_not_interpolated` (:3471).
- `ORDER BY` and range predicates name the source column (engine/src/stream.rs:1486-1489 @ 59c930939aa742655d39c54cbbf84b16078006eb), so they are unaffected.
- Negatives:
  - Signed narrow cast to BIGINT goes to the existing Int64 arm, so it behaves as Int64 does today.
  - Cast to UBIGINT, a negative on the skip route becomes a DuckDB cast error at fetch, with DuckDB's own text, which may name the file value. It goes through `classify` (engine/src/stream.rs:2634-2642 @ 59c930939aa742655d39c54cbbf84b16078006eb). Which DuckDB class that error carries is not settled by reading.
- Other consumers: unchanged. LOD and the index still fail, because they do not use this SQL.
- Wire: no field and no code change. On the UBIGINT route the detail text differs. Fixtures: none.

**Shape C: widen in `column_u64`.**
- Site: engine/src/stream.rs:2658-2692 @ 59c930939aa742655d39c54cbbf84b16078006eb. Add Int8/16/32 arms (per-value `u64::try_from`, as the Int64 arm does at :2677-2686) and UInt8/16/32 arms (lossless `From`).
- Negatives: they get the same refusal and detail as an Int64 on the skip route (:2683). On the wire route they are still refused at open by the scan.
- Other consumers: every stream path, publish included, is fixed at once. LOD and the index stay as they are, with LOD's false comment. Admission, describe and the envelope do not change.
- Wire: no field, code or fixture change. The UInt64 arm already copies into a `Vec<u64>` (:2675), so the narrow arms add no copy. This is a reading, not a performance claim.

**My reading: shape C.**
- It is one function on the one path every stream takes.
- Its treatment of negatives matches what admission and the Int64 arm already do.
- No SQL text, DuckDB error text or wire changes.
- It makes three existing texts true in practice without editing them: the admission comment (engine/src/identity.rs:331-332), KNOWN-LIMITATIONS item 3's "widens into `u64`" (KNOWN-LIMITATIONS.md:64-66), and the shell's free-text hint (IdentityDeclarationForm.tsx:77-80), all @ 59c930939aa742655d39c54cbbf84b16078006eb.
- It stays an engine change. Shape A narrows what opens, and it falsifies a shell string.
- Caveat: section 7, the ADR-016 §2 question.

## 3. Strings the app shows

- **Shape C:** adds or changes no string.
  - The reached detail would be the existing "`{name}` holds a negative value: {v}" (engine/src/stream.rs:2683 @ 59c930939aa742655d39c54cbbf84b16078006eb), on the engine-API skip route only.
  - "`{name}` is {}; expected a 64-bit integer" (:2689) stays, though nothing that admission accepts can reach it any more.
- **Shape B:** may put DuckDB's cast-error text on the canvas banner (frontends/shell/src/App.tsx:1756 @ 59c930939aa742655d39c54cbbf84b16078006eb) on the skip route.
- **Shape A:**
  - a new or changed `IdentityUnusable` detail (engine/src/identity.rs:338-342 @ 59c930939aa742655d39c54cbbf84b16078006eb), shown through the `Display` at engine/src/error.rs:359-364 @ 59c930939aa742655d39c54cbbf84b16078006eb;
  - the shell hint (frontends/shell/src/admission/IdentityDeclarationForm.tsx:77-80 @ 59c930939aa742655d39c54cbbf84b16078006eb) and the legend (:60);
  - KNOWN-LIMITATIONS item 3's quoted refusal (KNOWN-LIMITATIONS.md:64-66 @ 59c930939aa742655d39c54cbbf84b16078006eb).
- I propose no words. Placeholders: none of the texts above is marked `[P6 placeholder]`. The only marked placeholder near these sites, `OUT_OF_RANGE_DETAIL` (engine/src/stream.rs:2594 @ 59c930939aa742655d39c54cbbf84b16078006eb), stays a placeholder and is untouched by every shape. The banner's composition (App.tsx:1756) stays as it is.

## 4. Tests

- **Existing coverage:** no existing test streams a narrow-integer identity.
  - The fixture's `IdentityMode` has no narrow mode (engine/src/fixture.rs:530-549, :624-632 @ 59c930939aa742655d39c54cbbf84b16078006eb).
  - My grep of engine/tests and kernel/tests for Int8/16/32, UInt8/16/32, TINYINT, SMALLINT and INTEGER hits only engine/tests/filter_type_admission.rs, which uses predicate types over the default UInt64 `id` (:56-61), and one kernel doc comment (kernel/tests/skp_admission.rs:609).
  - The unit test `only_value_preserving_integer_types_are_admitted` (engine/src/identity.rs:360-367 @ 59c930939aa742655d39c54cbbf84b16078006eb) admits types but omits Int8 and UInt16, and it streams nothing.
  - No test pins `column_u64`'s negative or type-mismatch arms: grep of the detail texts found only their source lines.
- **Tests that pin admission by type, by name:**
  - `engine/src/identity.rs::tests::only_value_preserving_integer_types_are_admitted`
  - `engine/src/identity.rs::tests::candidate_columns_are_the_64_bit_integer_columns_in_schema_order_unranked`
  - `engine/tests/identity.rs::a_declared_mapping_to_a_non_integer_column_is_refused_not_hashed`
  - `engine/tests/identity.rs::a_negative_identity_value_is_refused_because_it_cannot_widen_into_u64`
  - `kernel/tests/skp_admission_remediation.rs::a_declared_identity_beside_the_files_own_id_refuses_a_filter_naming_id_as_ambiguous` (a Utf8 `id`)
- **Shape C test, at the real boundary.**
  - Build the fixtures as the reproducer does: `write_geoparquet`, then an Arrow cast rewrite that copies the `geo` key-value pair.
  - Open each through `Dataset::open_cancellable` (with an `IdentityDeclaration` for `parcel_key`) and drain `stream_with_cancel(ViewportQuery::all())`.
  - Assert every row's id equals the source value, the row count, and a UInt64 `id` field. Add a negative case per signed width: refused at open with the scan's "negative" detail, and, on the `skip_uniqueness_check` route, refused at stream with the negative detail.
  - No `SkpHost` test is required, since the kernel does not change. Whether Part 1 item 7's one-small-integration-test-per-boundary calls for an `open_dataset` + `viewport_query` drain of one Int32 file is the architect's call.
  - Mutation: map the Int32 arm with `as u64` instead of `u64::try_from`. The skip-route negative test must fail by name. A second option: delete the UInt16 arm, and the stream test must fail.
- **Shape B:** the same test.
  - Mutation: cast signed narrow types to UBIGINT instead of BIGINT. The negative-detail assertion must fail. Alternatively, drop the cast for UInt8.
- **Shape A:** an open of each narrow width must refuse with `IdentityUnusable` naming the column. Through `SkpHost::open_dataset` the code is `engine.identity_unusable`. The shell form's hint needs a vitest.
  - Mutation: re-admit Int32 in the match.
- **Can the reproducer's test become the piece's test?** In part, by its report:
  - It drives the public API (report line 120), and its fixture rewrite is fixed for the `geo` key (lines 44, 51).
  - But it asserts only what it writes, and prints the open and stream outcomes (line 45). It is named `u2_…`, and it sits untracked outside the repository: I did not read it.
  - It can be the base once its printed outcomes become assertions, it gets a behaviour name, and it gains the negative cases. Whether the rewrite moves into `spatial_engine::fixture` as a new `IdentityMode` (engine/src/fixture.rs:530-549 @ 59c930939aa742655d39c54cbbf84b16078006eb) is a scope choice for the form.

## 5. Files and overlap

Shape C, path by path, against the in-flight list:
- `engine/src/stream.rs`: overlaps 8f (PR #294). The PLAN already orders this node after 8f (governance/PLAN.yaml:6539 @ 59c930939aa742655d39c54cbbf84b16078006eb), and no code starts before #294 merges. The cites into stream.rs above may shift when #294 lands.
- `engine/tests/<new>.rs`: no overlap.
- `engine/README.md`: overlaps 8f.
- `engine/src/identity.rs`: optional, to add Int8 and UInt16 to the unit test. No overlap.
- `engine/src/fixture.rs`: optional. No overlap.
- `engine/src/lod.rs`: only if the LOD sibling is taken in scope. Overlaps `cut/port-2-macos-l1-and-app-dirs` (built, not merged).
- `KNOWN-LIMITATIONS.md`: only if the human changes it. Overlaps 8f and port-2.

Shape C touches no `protocol/` or `kernel/` path. Shape A adds `frontends/shell/src/admission/IdentityDeclarationForm.tsx` and its test. They are not in area A's list, but they cross into frontends.

Owner's index lines (shape C):
- engine/README.md:540 @ 59c930939aa742655d39c54cbbf84b16078006eb, the Viewport stream row: add the new test's pin.
- engine/README.md:537 @ 59c930939aa742655d39c54cbbf84b16078006eb, "Last verified at": a clause for that pointer.
- kernel/README.md: none.
- Shape A would instead touch engine/README.md:539, the Open and admission row.
- Seen while reading, and not this piece's to fix: the index's preregistration list (engine/README.md:557 @ 59c930939aa742655d39c54cbbf84b16078006eb) names `engine/*-PREREGISTRATION.md` paths. No such files exist under engine/ (Glob); the forms are under governance/forms/engine/.

KNOWN-LIMITATIONS:
- Under shape C, item 3's text (KNOWN-LIMITATIONS.md:62-68 @ 59c930939aa742655d39c54cbbf84b16078006eb) stays true and need not change.
- Its anchor comment cites engine/src/identity.rs:196-217 and engine/src/error.rs:234-238. At 59c93093 those lines are :317-346 and :359-364, so the anchors are stale.
- Under shape A, item 3's quoted refusal changes.
- Either way, the wording is the human's at the click.

## 6. Line estimate (§21c counting, tests and prose included; governance/AUTONOMY.md:347-357 @ 59c930939aa742655d39c54cbbf84b16078006eb)

- **Shape C:** about 180 to 260 changed lines in 3 to 5 files.
  - `column_u64` arms and comment: about 25 to 40.
  - The test with negative cases: about 150 to 210 (the reproducer is 7285 bytes by its filing note).
  - The README: 1 to 2.
  - The optional unit-test line: 1.
  - This is over 150 lines. A stream that failed now draws, which is arguably "new user-visible behaviour", §21c's fourth bound. That reading is the custodian's.
- **Shape B:** about 170 to 250 lines in 3 to 4 files.
- **Shape A:** about 90 to 140 lines in 5 to 7 files across engine/ and frontends/, with a new refusal shown to the operator. It is past the fourth bound regardless.

## 7. Risks and red lines

- **P6 strings:** as listed in section 3. Shape A needs the human's words for the detail, the shell hint and KNOWN-LIMITATIONS item 3. Shape C needs none.
- **Accepted ADR text (ADR-016, accepted and architect-blockable):**
  - §2 says "exactly one form of identity: a 64-bit integer column named `id`" (docs/adr/ADR-016-stable-feature-identity-admission.md:63 @ 59c930939aa742655d39c54cbbf84b16078006eb).
  - The code has admitted a narrow native `id` since before this node. Shape C makes such an `id` work, and so keeps the code apart from §2's letter. Shape A brings native `id` into line with §2.
  - For a declared mapping, §4 and §5 admit a "value-preserving widening" (lines 70-80, 83 @ 59c930939aa742655d39c54cbbf84b16078006eb), and §7 width (106-110) holds, because narrow values are below 2^53.
  - Context (31-33) and the SETTLED candidate-list line (165) also say "64-bit".
  - Any note on ADR-016 is in the human's words only.
- **Wire:** no change under any shape.
  - Ids cross as `DecU64` on the control plane (protocol/skp/SKP-V0.md:206-208 @ 59c930939aa742655d39c54cbbf84b16078006eb). Batches have `id` at column 0, non-null (SKP-V0.md:1169-1171), carried as UInt64 (engine/src/envelope.rs:254).
  - The candidate list stays Int64/UInt64 (SKP-V0.md:588-589 @ 59c930939aa742655d39c54cbbf84b16078006eb).
  - Shape A adds a new detail value for an existing code. Whether that needs any SKP note is the custodian's question.
- **More than an engine change:**
  - Shape A reaches frontends/ (the hint) and KNOWN-LIMITATIONS.
  - The LOD sibling (engine/src/lod.rs:1367-1379 @ 59c930939aa742655d39c54cbbf84b16078006eb) stays broken under B and C, and its comment stays false. Taking it in scope collides with port-2 (rule (00)). Under Part 1 item 4, an unfixed sibling disclosed at hand-back sends the piece back, so the form has to decide LOD in or out before dispatch.
  - The fixed-grid index's UInt64-only read (engine/src/index.rs:471-475) is an existing experimental-seam gap that Int64 shares. Same decision.
- **Not used:** the reuse index found no prior art for either query (brief lines 72-75). Nothing here relies on it.

## What I could not settle

- Whether DuckDB could ever hand a narrow integer as a dictionary or another Arrow type. The reproducer saw the plain narrow types only.
- Which error class DuckDB raises for a negative cast to UBIGINT (shape B).
- That the session tier's `file_row_number` reaches `column_u64` as Int64 on the stream path. I inferred it from the probe's i64 read and did not run it.
- 8f's changes to engine/src/stream.rs. I cannot read branches.
- The reproducer's test file, which is outside the repository.
- No engine or kernel preregistration states the identity type, by my grep of governance/forms for "64-bit" and "widen" and of the prereg names for Int32, UInt32 and "narrow integer". That grep is not exhaustive.

---

Result: shape C (widen in `column_u64`, engine/src/stream.rs) is my reading. It is engine-only, changes no wire field, code or fixture, adds no P6 string, and comes to about 180 to 260 lines in 3 to 5 files.

Blocking question: does ADR-016 §2's "64-bit integer column named `id`" (ADR-016:63) exclude a narrow native `id`? If yes, the piece needs the human's note or shape A for native `id`. That is a red line, for the custodian to ask.

Blocking question: is the LOD sibling (engine/src/lod.rs:1367-1379, false "Unreachable" comment) in scope? Taking it in collides with port-2's engine/src/lod.rs under rule (00).

Report path: C:/dev/spatial-ide/state/consults/2026-11-07-narrow-integer-id-unstreamable-impact-read-lead-data.md

sha256: none. I have no shell, so I can give no hash; the custodian computes it on filing.
