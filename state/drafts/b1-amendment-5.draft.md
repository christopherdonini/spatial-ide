*Custodian's note (2026-09-27): the architect's disposition under §5 of engine/B1-PROJECTION-PREREGISTRATION.md for PLAN node `b1-engine-kernel-half` (§5's invalidator "H3 false" fired at gate 1, at `a9ccd57`), saved as returned from the hand-back message with the harness's two-space indent removed. The amendment text is the part between the two rules; a worker appends it byte for byte. The cited rulings were checked against the tracked text before filing (RULED 2026-09-14 question set D, item D2; ADR-023's conditions carried into B1, condition 3; round 15 (g)).*

---

**Verdict: gate 1's block stands, and the disposition is route (a).** Neither this amendment nor the worker round it orders needs a ruling from the human. H3 is recorded as a class-2 result and Amendment 2 stays unedited. The retention bound is recorded as a class-2 result, and its new value going forward is a class-5 narrowing on the gate. One worker round (X1–X20) then goes to gate 2.

**What the code shows (read at `a9ccd57`):** every stream entry point runs `stream_inner` → `produce` → `flush`, and that includes `stream_for_publish`. All four `flush` call sites are in `produce`. On the branch, `flush`'s single-run arm calls `retain_or_compact_single_run` for every plan. On main that arm is `Ok(Arc::clone(&runs[0]))`. So publish partitions do go through the compacting `flush` today. That is why E1 threatens publish bytes.

Below the rule is the amendment text, ready to append as returned. It quotes nothing. Rulings are cited by round and item, code by symbol, and this file by section and amendment.

---

### Amendment 5 — 2026-09-27, post-result: gate 1's findings; §5's invalidator "H3 false" fired; the architect's disposition under §5

Class 1 (post-result), with rows of other classes where marked. Written after both gate-1 reports were seen: `state/consults/2026-09-27-b1-engine-kernel-half-gate1-architect.md` (findings cited here as A-*) and `state/consults/2026-09-27-b1-engine-kernel-half-gate1-reviewer.md` (R-*), both at `a9ccd57`. Before committing this amendment, the worker merges `origin/main` so both cited reports exist in the branch tree. This is record-correction round 1 of 2 for this piece (the record cap).

**5.1 H3, second clause (class 2, a result).** H3's second clause is false for nullable columns at `arrow-ipc` 58.4.0. R-E1's probe showed it: a byte-aligned nullable `Utf8` slice that carries a NULL, with a length that is not a multiple of 8, writes different IPC bytes from its `compact_attribute_slice` copy, and the difference is in the validity bitmap's padding bits. P0's probe (Amendment 2) and E-15 used only a non-null `Int64`. Amendment 2's text stands. The invalidator fired as §5 lists it. Architect's code fact, read at `a9ccd57`: every stream entry point, `stream_for_publish` included, reaches `flush` through `stream_inner` and `produce`. `flush`'s single-run arm applies `retain_or_compact_single_run` under every plan, while main's arm keeps the slice. So a publish partition whose single run passes the factor can differ from main's bytes; R-E1 did not observe this on a bundle. The architect also reads a `Boolean` values bitmap as taking the same writer path. That reading is unprobed; X6 carries it as a probe case, with its outcome recorded, not predicted.

**5.2 Route (a) (class 5, a scope narrowing on the gate).** §2.3's retention rule narrows to the live projected stream: only `stream_projected_with_cancel`'s plan compacts. Every other plan, `stream_for_publish`'s included, keeps main's single-run arm, which is the slice with no copy. The rule is the architect's under ADR-023's condition (3) (RULED 2026-09-14, question set D, item D2). The reasons:
- Publish bytes equal main's by construction, so §5's declared-unchanged publish-bytes bullet holds without a new claim about how the IPC writer slices bitmaps. Such a claim would bind engine correctness to one crate version.
- Route (b) needs exactly that claim, re-proved at every arrow bump.
- Route (c) changes a property §5 declares unchanged and would need the human; it is not taken.
- Publish loses one copy (ADR-004).
- Publish's producer-resident memory statement stays main's, in `MAX_QUEUED_BATCHES`'s doc and `flush`'s comment. Nothing about it is newly discovered.

On the live projected stream, §2.3's byte-identity sentence narrows to decoded equality: values, and validity within the array's length. Byte identity is not claimed there.

**5.3 The retention bound (class 2 result; class 1 withdrawal; class 5 value going forward).**
- Result: §7's bound, and §3's `[text]` row prediction that rests on it, are false for small compacted runs. R-E2 found that `MutableBuffer` rounds each allocation up to a multiple of 64 bytes at `arrow-buffer` 58.4.0 (`Cargo.lock`): a 1-row `Int64` run retains 64 bytes against 8, and a 100-row `Boolean` run 64 against 13.
- Result: `flush`'s wiring was untested. R-E2's mutation of the single-run arm to `Arc::clone` survived the engine suite at `a9ccd57`.
- Withdrawn (class 1, round 15(g)): Amendment 3's discharge of §2.3's retention rule by E-14 and E-15. It does not resolve (round 7).
- Going forward (class 5, on the gate; condition (3) is the architect's): `MAX_ATTRIBUTE_RETENTION_FACTOR = 2` stays.
  - The declared bound becomes: each attribute column of a live-projected batch retains at most 2 × its own slice memory + 64 bytes × the number of buffers it holds, its validity buffer included. The 64 is `arrow-buffer` 58.4.0's allocation multiple, and E-14's small-run cases re-check it at any arrow bump.
  - The live projected stream's producer-resident payload is `MAX_QUEUED_BATCHES + 1` batches under that bound, plus DuckDB's current chunk (uncounted, as today).
  - This is a declared bound, not a measurement, and no `docs/08` row changes.
  - §7's old value is not re-read to pass; its result is the first bullet of this row.

**5.4 §8 item 4 (class 1, the gate's reading, settled).** Read on its own text, §8 item 4 does not fire: R-D1 resolved from git that the bump commit `6cd1764` carries the literal and both fixture sides. A-E2's squash remedy is withdrawn. Round 26 item 3 bars squash-merging a PR whose commits a record cites, and Amendments 3–4 cite this branch's commits, so the branch lands by a merge commit with its history unrewritten. The commit facts R-D1 established are stated once, in SKP-V0 (X14), and this record adds nothing to them.

**5.5 Rulings conformed to (class 1).** A-C1, A-C3, A-C2 and A-C4 (= R-C1, R-C3, R-C4 and R-C2) are each settled by conforming the code to rulings already binding through Amendment 1 (round 22, item 2). Those rulings are O1, O2 and O8 of `state/consults/2026-09-25-b1-prereg-revision.md` §3, and round 17, item 3. No question goes to the human.

**5.6 One worker round.** Each fix below has a discriminating test and a named mutation, both verified mechanically. A §4-named test keeps its name; where its body narrows, its doc says so and cites this amendment. Rows that add or correct a mutation are recorded as class 4 in the closing amendment.

| # | Findings | Fix | Test (one line) | Mutation |
|---|---|---|---|---|
| X1 | A-C1 = R-C1 | O2: the filter `reason` for every still-refused type is main's text byte for byte. No refusal text sits in the gate unless an owner renders it. | `a_filter_refusal_for_a_still_refused_type_keeps_todays_reason_byte_for_byte` (kernel, through `viewport_query` with a predicate naming `d32`). The expected string is byte-copied by script from main's rendering at `d6d9862`. | The branch's placeholder final arm |
| X2 | A-C3 = R-C3, A-E1, A-E3 | O1 and O8: two passes. First the count. Then names in declared order, with the reserved `id` refused as identity before the unknown check. Then per-column rules column by column in declared order (geometry, identity, duplicate, type). Publish's restriction runs after shared admission. E-6's input becomes `["geometry","nope"]`. | E-6 (`names_resolve_before_per_column_rules_in_declared_order`). Also `the_multi_failure_order_is_count_then_names_then_per_column_rules` (engine), with inputs `["geometry","nope"]`→unknown, `["geometry","id"]`→identity and `["d32","geometry"]`→type. Also `publish_refuses_a_multi_failure_list_by_shared_admission_before_the_bundle_format_restriction` (kernel), with `[f32, nope]`→unknown. | Interleave; and the restriction before shared admission |
| X3 | A-C4 = R-C2 | `admit_projection_column` also refuses the reserved `id`, so `projectable` agrees with admission. The name pass keeps O8. | K-5 (`describe_projectable_agrees_with_viewport_query_admission_for_every_column`) gains a case: MultiType opened through the product path with the identity mapped to `i64`. | Remove the reserved-name arm from `admit_projection_column` |
| X4 | A-C2 = R-C4; R's publish `.expect` suggestion; R's unreachable-text nit | O1(c) and O2: `TypeNotAdmitted` carries the source type as a typed fact. Publish renders it: any `Dictionary` gets today's dictionary text, `Float32` today's text, anything else today's final-arm text. No `.expect` in publish. | K-9's dictionary unit test (`admit_bundle_format_refuses_a_dictionary_column_with_todays_admit_attribute_type_text`) extended to `Dict(Int8, Date32)`. The expected text is byte-copied from main's `Dictionary` arm. | `From` renders the final-arm text for every `TypeNotAdmitted` |
| X5 | A-C5; R's duplicated-exclusion suggestion | O4: namespace admission computes and carries each column's surrogate, and refuses a column with no surrogate by name as `filter_column_not_filterable`. `bind_admit` reads the carried surrogate. `namespace_admit`'s duplicate dictionary exclusion is removed, so `filterable_column_type` is the only copy. | `every_type_the_filter_namespace_admits_carries_a_surrogate` | Remove the `REAL` arm |
| X6 | R-E1 | Route (a) (row 5.2): a private retention field on the stream plan. Publish's plan and every unprojected plan keep the slice; only the live projected plan compacts. Every stream.rs doc that claims H3 is restated (§7's doc-comment bullet). | `publish_emits_a_nullable_byte_aligned_single_run_with_the_uncompacted_slices_ipc_bytes` drives `flush` with the retention that `stream_for_publish`'s plan declares. The run is nullable `Utf8` with a NULL inside and set validity bits after it. It is tried at offset/length 8/3, 0/10 and 40/20, plus a non-null `Boolean` probe case at 8/3. IPC bytes are compared against `TaggedBatch::assemble` over the uncompacted run. Also `a_compacted_single_run_decodes_equal_to_the_slice_it_replaces_nulls_included` (live mode). E-15 keeps its name and body, and its doc narrows to the non-null shape. | Publish's plan declares the live retention; and the compacted copy drops its null buffer |
| X7 | R-E2; R's §3 `[text]` suggestion | Row 5.3's bound. E-14 adds R-E2's two small runs. | E-14 (`every_emitted_attribute_column_retains_at_most_the_declared_factor`). Also `a_live_projected_text_stream_emits_every_attribute_column_within_the_declared_retention_bound`, in `engine/src/stream.rs`'s tests, which run `stream_projected_with_cancel` over MultiType `[text]` and read the queued items in-module. No accessor is added (§6). | Remove compaction; and `flush`'s single-run arm → `Arc::clone` |
| X8 | A-E4 | The seam fixture's declared order becomes `["area","zone"]` (§3's first row). Both sides' fixture tests change in the same commit. | K-1 (`a_projected_viewport_query_from_the_wire_fixture_streams_the_declared_columns`) asserts `[id, geometry, area, zone]` | Admission returns file order |
| X9 | A-E5 = R-E3 | K-2 asserts each code's exact key set. A seam test compares the kernel's output with the seven committed error fixtures. | K-2 (`every_projection_refusal_is_synchronous_typed_and_pre_mint`); `every_projection_refusal_matches_its_committed_error_fixture_shape` | Rename `known_columns` / `id_column` / `detail` in `projection_error_of` |
| X10 | A-E6; R's unrecorded-mutations suggestion | The closing amendment cites the reviewer report's "Mutations re-observed" section for the mutations it observed. The worker records E-6, E-15 and every new test by name. | — | — |
| X11 | R's K-1 oracle suggestion; A-D5 bullet 2 | K-1's oracle becomes a DuckDB read keyed on `id` covering `area` and `zone`, NULLs included (E-8's form). | K-1 | The chunk loop slices each attribute run one row late |
| X12 | R's fixture-hashing suggestion | §3's hash check before and after each run, on the engine test precedent (e.g. `engine/tests/filter_composition.rs`). Applies to X7's, E-8's and K-1's fixtures. | Inside those tests | One byte appended to the fixture between the two hashes |
| X13 | R's §3 `[f32]` suggestion | E-8 gains `[f32]`: the emitted `Float32` values are `to_bits`-equal to a DuckDB read. | E-8 (`a_live_projected_stream_emits_id_geometry_then_the_declared_columns`) | Emit `Float64` at the live entry |
| X14 | A-D1, R-D1, A-E2 | SKP-V0 §9.4 and §9.5 re-read against X2 and X4. §4 item 13's `skp/0.6` paragraph, §8's Mechanics sentence and §9.1 state the commit facts from `git show --stat`, in the form of the `skp/0.5` paragraph. | The reviewer reads the diff | — |
| X15 | A-D2 | The closing amendment references `924dd3f` and the green `vitest` run. | — | — |
| X16 | A-D3 bullets 1–2; R nits 1–2 | The closing amendment names every test on one line. No in-place edit. | — | — |
| X17 | A-D4 | The `projection_empty_list` message states a kernel fact and never says "omit". Both fixture sides change in the same commit. The human sees the wording at B1's close (§1). | X9's fixture test; the reviewer reads the text | — |
| X18 | A-D5 bullets 1 and 3 | Add `SKP_VERSION`'s `skp/0.6` doc paragraph. Add `engine/README.md`'s `MAX_ATTRIBUTE_RETENTION_FACTOR` row with row 5.3's bound. | The reviewer reads the diff | — |
| X19 | R's Amendment 3 `tsc` suggestion | Superseded-index row only | — | — |
| X20 | R nits 3, 4 and 6 | Wrap the two 136-column added lines; add a type alias for the `type_complexity` warning. Restore SKP-V0 §4 item 3's earlier sentence to main's bytes and append B1's note. Add item 1's note (B1 adds no command), as §2.1 declared. | The reviewer reads the diff | — |

**Out:**
- R's suggestion on Amendment 4's closing sentence: that sentence covers the tests Amendment 4 lists, and E-6 is not one of them. X10 records E-6.
- A-D3 bullet 3: R resolved Amendment 2's arrow-data line references as exact, and the symbols carry the reference.

The closing amendment after this round is references and hashes only (the record cap).

**Superseded index**
- Amendment 2, the H3 bullet: superseded by 5.1.
- Amendment 3, the first bullet (the retention rule's discharge): superseded by 5.3, withdrawn.
- Amendment 3, the last bullet's scope attribution of the `tsc` failure: introduced at `6cd1764` (this piece) and discharged at `26c9c87` (Amendment 4).
- Amendment 4, the `renderTruth.test.ts` bullet: fixed at `924dd3f`, which is inside §2.4's scope (A-D2); X15.
- §2.3's `flush` bullet and §7's retention bullets: their text stands; 5.2 and 5.3 govern.
- A-E2's squash remedy: withdrawn by 5.4.

---

**For the human**

- **Nothing blocks.** The two items my gate said should have waited for you are A-C1 (the filter refusal text) and A-C3 (the order of admission checks). Conforming to the existing rulings settles both (row 5.5): O1, O2 and O8, bound through round 22 item 2, and round 17 item 3.
- **Optional, one sentence.** Route (a) leaves publish's memory statement as main declares it, rather than bounding it by the factor. If you want the factor on publish too, that is route (b). It needs a new P0 hypothesis about how arrow-ipc 58.4.0 slices validity and `Boolean` bitmaps, and would be your choice.
- **Disclosed, not a question.** §9's `cargo fmt --check` still cannot be discharged on this machine because of the rustfmt baseline drift. The CI fmt step is already a weekly-window proposal.

Files:
- `C:/dev/wt/b1-projection/engine/B1-PROJECTION-PREREGISTRATION.md`
- `C:/dev/wt/b1-projection/engine/src/stream.rs`
- `C:/dev/wt/b1-projection/engine/src/attributes.rs`
- `C:/dev/spatial-ide/state/consults/2026-09-27-b1-engine-kernel-half-gate1-architect.md`
- `C:/dev/spatial-ide/state/consults/2026-09-27-b1-engine-kernel-half-gate1-reviewer.md`
- `C:/dev/wt/b1-projection/state/consults/2026-09-25-b1-prereg-revision.md`
- `C:/dev/spatial-ide/docs/adr/ADR-023-attribute-projection-on-viewport-query.md`
