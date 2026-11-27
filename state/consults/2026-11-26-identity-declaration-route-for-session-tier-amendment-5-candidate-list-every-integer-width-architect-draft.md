# The identity route's Amendment 5, drafted by the architect: the candidate list for every integer width admission takes (ADV-2026-11-26-04 item 1), not appended, not a gate

*Filed by the custodian: node:identity-declaration-route-for-session-tier@am5-architect-draft, under ADV-2026-11-26-04 item 1.*

- **What it is.** A draft, not a gate, with no verdict. It is not appended to the form: it is appended only after the narrow read by the form's gate has passed, and after the advisor answers the Note clause it flags.
- **Where it read.** Read only, in D:/wt/read-1124f at c28c8cf10a5b616af3ce660d13b1478d90e4ea08.
- **Dispatch and run.** Dispatched just before 2026-11-26T18:45:35Z (date -u after the call), with its brief byte for byte: brief-id-route-am5-architect-final.md in the scratch folder, 4941 bytes, sha256 7bf72b8da234a8ba245e72be031e73c5974d445b4338ea01078da1f5206d6bee. Its run comes from its completion notice only (ADV-2026-11-26-02: no transcript opened): 74 tool uses, 871633 ms, 253433 tokens. The model is opus, by its definition's model line. It handed back once, before 2026-11-26T19:01:49Z (date -u after saving), and no message was sent to it.
- **How it was written here.** The custodian wrote the report below through the Write tool from the hand-back message, with the harness's two-space indent removed, byte for byte and nothing masked: 31429 bytes, sha256 3b69568d7931c7aae055ecccd9ae23b3cfd8a0e45e97ead6922938dea7e49333.
- **Checked by script.** Each of the nine Old texts occurs once in the form at c28c8cf1, and no New text occurs in it.

---

main @ c28c8cf10a5b616af3ce660d13b1478d90e4ea08 (detached read checkout D:/wt/read-1124f). This is an architect draft, not a gate, so it carries no verdict. Every cite is read at that commit. Nothing was run and no file was written.

The amendment text runs between the two marker lines. Append it byte for byte. The marker lines themselves are not part of it.

<<<AMENDMENT 5 BEGINS>>>
## Amendment 5 — 2026-11-26 — the candidate list for every integer width admission takes (ADV-2026-11-26-04 items 1 to 6): the class 9 files, the claims it reverses, W-1, W-2 and K-2 with their mutations, ADR-016's Note 2026-11-26 and the two strings by reference, the class 8 figures

*Pre-code amendment. It is written on the advisor's ruling ADV-2026-11-26-04, under the human's delegation of 2026-11-13. The ruling's words are the advisor's, not the human's, and it is cited by id and item. The design rests on the architect's consult `state/consults/2026-11-24-the-candidate-list-for-every-integer-width-architect-consult.md` (its parts 2, 3 and 6), cited by part. It records class 9 (Scope) additions and a predicted class 8 overrun, both before any code. Every `path:line` is read at c28c8cf10a5b616af3ce660d13b1478d90e4ea08, which is on main, and the custodian adds the span hashes in a later references-only amendment. A reference into this form is by section, amendment and item. Each Old text below is copied byte for byte from the form above this amendment (verbatim) and occurs there once. Where an Old text is part of a line, only that part is replaced. Each New text occurs nowhere above.*

1. **Authority and placement.** Under ADV-2026-11-26-04 item 1, the candidate list widens in this piece, before its code, and rides `skp/0.15` with no further literal. Item 2 records the change in the `skp/0.15` entry. Item 3 supplies ADR-016's Note 2026-11-26. Item 4 supplies the legend, the hint and row I4. Item 5 requires one private predicate. Item 6 is the merge check. One narrow read by the form's gate follows this amendment (item 1), and no code of this piece starts before it has passed.

2. **What does not change.**
   - The `protocol/` place, order A and `skp/0.15` (ADV-2026-11-23-26 item 3) stay as ruled. No further literal is taken. No wire type changes: the refusal's `candidate_columns` stays one comma-joined string (`kernel/src/skp.rs:2223-2237`), and the `describe.identity` member stays as §2 item 1 has it. No protocol fixture changes, because every fixture's list holds names only, and none holds a type (`protocol/skp/tests/data/v0-error-identity_unusable-with-candidates.json:7`; `protocol/skp/tests/conformance/fixtures/responses-accept.json:101`).
   - ADR-016's Amendment 2, its Decision 4 included, lands as ADV-2026-11-23-26 item 1 words it (ADV-2026-11-26-04 item 3, its last bullet).
   - D1 to D4, the offer rule of §2 item 4, K-1, S-1 to S-4, T-1 and E-1 stay as amended. Their fixtures hold only 64-bit keys, so their expected lists do not move (§3; `engine/src/fixture.rs:756`, :773).
   - §2 item 1's "The list is the engine's, unchanged" means that the kernel carries the engine's list as the engine gives it. Item 3 below changes the engine's rule itself. The member's docs (`commands.rs`, `types.ts`, SKP-V0.md §1) name no width. They say that the list is the engine's and the same as the refusal's.

3. **The engine change (ADV-2026-11-26-04 item 5).** It is in `engine/src/identity.rs` and nowhere else.
   - One private `fn` takes `&arrow::datatypes::DataType` and returns `bool`. It is true exactly for `UInt64 | UInt32 | UInt16 | UInt8 | Int64 | Int32 | Int16 | Int8`, the set the admitting arm holds today (`engine/src/identity.rs:333`). It is not `pub` and not `pub(crate)`. Its doc names its two callers and ADR-016 §4 with the Note 2026-11-26.
   - `candidate_identity_columns`'s type filter (`engine/src/identity.rs:304`) calls the predicate. The not-addressable filter (:311), the comma filter (:313) and schema order (:301-314) stay.
   - `admit_column_type`'s admitting arm (:333-335) becomes a guarded arm that calls the predicate. The refusal arm and its detail (:336-344) stay byte-unchanged, because text-id edits that detail on this piece's head (§8 below).
   - Callers: the predicate has two product callers, and nothing `pub` is added.

4. **The claims reversed, section by section.**
   - **§1, Declared unchanged (reversed).**
````text
- the engine's candidate rule (`identity.rs:299-315`);
````
````text
- the engine's candidate omissions (the not-addressable and comma filters); its type rule is reversed by Amendment 5 item 3, and the refusal's field set is unchanged while its `candidate_columns` value may hold more names;
````
   - **§2 item 2 (reversed).**
````text
No engine code changes.
````
````text
Engine code changes only as Amendment 5 item 3 says: one private predicate in `engine/src/identity.rs` that `candidate_identity_columns` and `admit_column_type` both call.
````
   - **§2 item 6 (reversed for the legend and the hint).**
````text
No other new string. The form's legend, hint and button are unchanged.
````
````text
No other new string except the legend and the hint of ADV-2026-11-26-04 item 4 (Amendment 5 item 5). The form's button is unchanged.
````
   - **Amendment 2 item 2, "What it leaves to the existing text" (superseded).** The ADR text it pointed to is itself superseded by the Note's Decision 5.
````text
Which columns are candidates: 64-bit integer columns in schema order, unranked, unpreselected (:165-166).
````
````text
Which columns are candidates: as ADR-016's Note 2026-11-26 decides (ADV-2026-11-26-04 item 3), every column of an integer width admission takes, in schema order, unranked, unpreselected; the settled block's fourth bullet keeps its other words.
````
   - **§9 item 2, as Amendment 2 item 4 amended it (replaced).**
````text
2. `workspaceState.ts`, `admitDataset.ts`, or any engine code changed (only the doc lines in `identity.rs`); `App.tsx` changed beyond the one prop of §2 item 4 (f).
````
````text
2. `workspaceState.ts`, `admitDataset.ts`, or any engine code changed beyond Amendment 5 item 3 (the predicate, the candidate filter and the admitting arm in `identity.rs`; the doc lines in `identity.rs` and `error.rs`); `App.tsx` changed beyond the one prop of §2 item 4 (f).
````
   - **§9 item 5, as Amendment 2 item 1 amended it (extended).**
````text
A string beyond D1 to D4;
````
````text
A string beyond D1 to D4 and the legend and hint of ADV-2026-11-26-04 item 4;
````

5. **The two strings and row I4 (ADV-2026-11-26-04 item 4), carried by reference.** Their text is the ruling's item 4, the backticked text of its first two bullets, and is not retyped here.
   - **The legend** replaces the text of the `<legend>` at `frontends/shell/src/admission/IdentityDeclarationForm.tsx:60`.
   - **The hint** replaces the text of the `<p className="identity-declaration-free-text-hint">` at :77-80.
   - Each string is written whole on one source line, as JSX text or as a string constant, so that item 6's byte comparison finds it in the diff.
   - The source comment at :56-59 is replaced. The new comment names ADV-2026-11-26-04 item 4 as the source of both strings (the advisor's words under the delegation, not the human's) and the predicate of item 3 as the legend's criterion. For the hint, it names the free-text route that accepts any name (`frontends/shell/src/admission/identityDeclarationState.ts:35-44`) and the checks at open (`engine/src/dataset.rs:1998-2003`, :2019-2025, :2028, :2045-2098). It also names, for the source comment and not for ordinary use, a column whose name nothing can address: it is left off the list, and it is refused if declared (:2019-2025).
   - Both strings are built under the placeholder mark and receive item 4's bytes in the words commit, as D1 to D3 do (ADV-2026-11-23-20 item 6; ADV-2026-11-23-26 item 2).
   - **Row I4** (`frontends/shell/MANUAL-WALKTHROUGH.md:598`): only the quoted legend title changes, to item 4's legend. Nothing else of the row changes, and no past result log is edited. The fixture still offers exactly `parcel_key` (`kernel/tests/manual_walkthrough_fixtures.rs:503-512`; `engine/src/fixture.rs:757-774`).

6. **ADR-016's Note 2026-11-26 (ADV-2026-11-26-04 item 3), carried by reference.** Its text is the ruling's item 3 four-backtick text block, from its heading line to its last Consequences bullet, and is not retyped here.
   - It is appended at the end of `docs/adr/ADR-016-stable-feature-identity-admission.md`, in this piece's PR. The order is: Amendment 2 with its acceptance line (ADV-2026-11-23-26 item 1), then the Note 2026-11-23 (ADV-2026-11-23-27 item 4), then this Note. No line of the ADR is edited.

7. **The `skp/0.15` entry (ADV-2026-11-26-04 item 2).** SKP-V0.md §8's `skp/0.15` entry, which §2 item 1 requires to give the version's full field set, gains one paragraph. A draft follows. It is the worker's text and not the human's, and the reviewer reads its clauses:
````text
**`candidate_columns`, on `engine.identity_unusable` and on `describe.identity`, widens in this version.** It names every column whose type `open_dataset` admits as an identity column — `Int8`, `Int16`, `Int32`, `Int64`, `UInt8`, `UInt16`, `UInt32` or `UInt64` — in schema order across all widths, unranked and unpreselected. Two kinds of column stay out of it, as before: a name that holds a comma (the `skp/0.2` P3c addendum) and a name nothing can address. The `skp/0.2` entry's "`Int64` and `UInt64` only" records that version and is not edited. No fixture changes for this: each fixture's list holds names only (ADR-016, Note 2026-11-26).
````
   - Clause checks:
     - "every column whose type `open_dataset` admits": the shared predicate (item 3) and `engine/src/dataset.rs:2028`.
     - "schema order": `engine/src/identity.rs:301-314`.
     - "a name that holds a comma": :313.
     - "a name nothing can address": :311.
     - The quoted span is verbatim from `protocol/skp/SKP-V0.md:592`.
     - "No fixture changes": see item 2.
   - `protocol/skp/SKP-V0.md:591-598` (the `skp/0.2` entry) stays as written. This satisfies §4 item 13's conditions (ii) and (iv) (`protocol/skp/SKP-V0.md:314-320`). `skp/0.15` has not merged.

8. **Doc lines changed with item 3, and lines read and left.**
   - **Changed:**
     - `engine/src/identity.rs:201-204` (the field doc) and :281-283 (the function doc), which state "64-bit" and "Int64 and UInt64 only" (paraphrase);
     - `engine/src/error.rs:158-160`;
     - `kernel/src/skp.rs:2234`;
     - `protocol/skp/tests/fixtures.rs:900-901`, which keeps the `skp/0.2` history and adds that from `skp/0.15` the list holds every admitted width;
     - `frontends/shell/src/admission/IdentityDeclarationForm.tsx:14-16`, the prop doc, as well as Amendment 2's N9 addition;
     - `frontends/shell/src/admission/candidateColumns.ts:11-12`;
     - the test name at `frontends/shell/src/admission/candidateColumns.test.ts:17`, which becomes `an empty string (no candidate column at all) yields an empty list, not [""]`. This is a rename with its assertion unchanged, not a new test.
   - **Read and left, each still true:**
     - `engine/tests/identity.rs:129-132`: its fixture's `id` is UInt64;
     - `engine/tests/multipolygon_corpus.rs:26`: it is a statement about a type;
     - the recorded mutation in the doc of `only_value_preserving_integer_types_are_admitted` (`engine/src/identity.rs:362-364`): it is historical and names its commit;
     - the narrow-id form's lists, whose node is `done`: they are that piece's record. The old test name is not test-shaped for `verify-test-claims`.

9. **The tests (the consult's part 3, with the seam test).** They are in addition to §4 and Amendment 2 item 5. Each mutation is applied in the worktree, the named test is run, the failure is recorded by name with its commit, and the mutation is reverted. A `verify-mutation` run is not an observation. The kernel runs are inside the machine's holds.
   - **W-1** (changed from `candidate_columns_are_the_64_bit_integer_columns_in_schema_order_unranked`, `engine/src/identity.rs:394-409`), in `engine/src/identity.rs`'s `mod tests`: `the_candidate_list_is_every_admitted_integer_column_in_schema_order_unranked`.
     - Fixture: the same in-memory schema (:397-403): `name` Utf8, `big_signed` Int64, `small_signed` Int32, `big_unsigned` UInt64, `geometry` Binary.
     - Expected: `candidate_identity_columns` gives `["big_signed", "small_signed", "big_unsigned"]`. Alphabetical order and grouping by width would both give another order.
     - **M-W1:** the type filter goes back to `Int64 | UInt64` instead of calling the predicate. W-1 fails at its list assertion with `["big_signed", "big_unsigned"]`. No test at the base catches it, because it is the base's behaviour. Set: {W-1, W-2, K-2}.
   - **W-2** (new), in the same module: `the_candidate_list_and_the_type_check_admit_exactly_the_same_types`.
     - Fixture (i): for each of the eight integer types and `Utf8`, `Float64`, `Binary`, `Boolean`, `Date32` and `Decimal128(38, 0)`, a one-field schema built with `schema_with("k", ty)` (:353-357).
     - Fixture (ii): one schema of `u8` UInt8, `i64` Int64, `i16` Int16, `u32` UInt32, `name` Utf8, `i8` Int8, `u64` UInt64, `i32` Int32, `u16` UInt16.
     - Expected for (i): `candidate_identity_columns` is `["k"]` exactly when `admit_column_type("k", &ty, &schema)` is `Ok`, and that holds for exactly eight types.
     - Expected for (ii): the list is `["u8", "i64", "i16", "u32", "i8", "u64", "i32", "u16"]`.
     - **M-W2:** the candidate filter stops calling the predicate and lists its own seven types, with `UInt8` left out. The type check is unchanged. W-2 fails at (i) for UInt8. W-1 passes, because its schema has no UInt8, and so do `only_value_preserving_integer_types_are_admitted`, the comma test and `kernel/tests/skp_admission_remediation.rs:300-304`, because `u64` is still listed. Set: {W-2, K-2}.
   - **K-2** (new, the seam's real-shape test), in `kernel/tests/skp_admission_remediation.rs`: `a_narrow_integer_key_is_offered_on_both_carriers_and_declaring_it_from_the_list_opens_mapped`.
     - It runs through `host()` (:53-60): `SkpHost::open_dataset` (`kernel/src/skp.rs:1108`) and `SkpHost::describe` (:1361), with `open_req` (`kernel/tests/skp_admission_remediation.rs:62-75`). There is no stub. The imports at :19-21 gain `NarrowColumn`, `NarrowValues` and `NarrowWidth`.
     - (a) Fixture: `fixture("narrow-parcel-key", …)` with `identity: IdentityMode::NarrowInteger { width: NarrowWidth::Int32, column: NarrowColumn::ParcelKey, values: NarrowValues::TopOfRange }` and `..small_spec()` (`engine/src/fixture.rs:549-568`, :761-768). A plain open is admitted. On describe, `class` is `"session-ordinal"` and `serde_json::to_value(&describe.identity)`'s `candidate_columns` equals `["parcel_key"]`.
     - (b) The column is taken from (a)'s JSON list, not typed in the test, and declared through the wire's `IdentityDeclaration`. On describe, `source` is `"mapped:parcel_key"`, `uniqueness` is `"verified-at-open-full-file"`, and the JSON `candidate_columns` is `null`.
     - (c) Fixture: `fixture("every-width-refused", …)` with the spec at :275-285 (`IdentityMode::StringIds`, `AttributeMode::FilterWitness`, 2 features). A plain open is refused with `engine.identity_unusable`, and `err.fields["candidate_columns"]` equals `"i8,i16,i32,i64,u8,u16,u32,u64"` (`engine/src/fixture.rs:797-812`).
     - **M-K2:** in `describe_dataset`, the member is computed from `ds.file_schema()`'s `Int64`/`UInt64` fields in place of `identity.candidate_columns()`, under the same session-tier guard. K-2 fails at (a) with `[]`. K-1 passes, because its session fixture's only key is UInt64 (§3 F-1), and so do T-1, E-1 and every engine test. Set: {K-2}.
   - **Added to §3's table:**

| # | Scenario | Base | After |
|---|---|---|---|
| F-4 | K-2 (a): Int32 `parcel_key`, no `id`, session open, describe JSON | no `candidate_columns` key | `["parcel_key"]` |
| F-5 | F-4's path declared from F-4's list | mapped; no key | `mapped:parcel_key`, `verified-at-open-full-file`; `null` |
| F-6 | K-2 (c): Utf8 `id` beside the eight widths, plain open | refused; `"i64,u64"` | refused; `"i8,i16,i32,i64,u8,u16,u32,u64"` |

   - **Added to §4's P0.**
     - Commit 1 also adds W-2 and K-2 and changes W-1.
     - Commit 2 lands §2 without item 3. Commit 3 lands item 3 with item 8's doc lines. The strings land in the words commit.
     - At commits 1 and 2, W-1, W-2 and K-2 each fail and are recorded by name with the commit id:
       - W-1 at its list assertion;
       - W-2 at a narrow width, whose list is empty where the type check admits;
       - K-2 at (a), at commit 1 because the member is absent and at commit 2 because the member is `[]`.
     - At commit 3 all three pass.
   - **§4 and §5 counts:**
````text
**The mutation set** is M-K1, M-S1, M-S2, M-S3, M-S4, M-T1 and M-E1.
````
````text
**The mutation set** is M-K1, M-K2, M-S1, M-S2, M-S3, M-S4, M-T1, M-E1, M-W1 and M-W2.
````
````text
- All seven tests pass on the fix.
````
````text
- All ten tests pass on the fix: the seven of Amendment 2 item 5, and W-1, W-2 and K-2 (Amendment 5 item 9).
````
````text
- P0 and the seven mutations, observed again;
````
````text
- P0 and the ten mutations, observed again (Amendment 5 item 9);
````
   - **No test pins the two strings.** The package has no render harness (Amendment 2 item 5). Their proof is item 6's byte comparison at the merge check and row I4's sight.

10. **§1 and §5, added.**
    - **May claim:** on the refusal and on the session tier, the candidate list names every column of the eight integer widths, in schema order, without the engine's two omissions.
    - **May not claim:** that an operator has seen a narrow-width column in the list. No walkthrough fixture holds one (`kernel/tests/manual_walkthrough_fixtures.rs`, by Grep). The proof is K-2.
    - **Declared unchanged (assertions not edited):**
      - `only_value_preserving_integer_types_are_admitted`;
      - `a_comma_bearing_column_is_omitted_from_candidates_but_still_declarable_by_free_text`;
      - `engine/tests/identity.rs`, `engine/tests/b1_projection_hostile_names.rs`, `engine/tests/b1_nul_declared_identity_no_scan.rs` and `engine/tests/narrow_integer_id_stream.rs`;
      - `protocol/skp/tests/fixtures.rs:905-919` and the shell's fixture test of the same field.
    - **Invalidators:**
      - I6 (stop): at the recorded base, a test outside §7's Scope and this amendment asserts an exact candidate list over a file that holds an integer column narrower than 64 bits. The form is amended before any code. I found none at c28c8cf1.
      - I7 (stop): at the recorded base, `admit_column_type` admits a type set other than the eight.
    - **Falsification:** after the fix, either of these holds:
      - a column of an admitted width that neither omission covers is missing from the list;
      - the list is not in schema order.

11. **Scope, class 9, declared before any code.**
    - **New files:**
      - `engine/src/error.rs` (doc only, :158-160);
      - `frontends/shell/src/admission/candidateColumns.ts` (doc only, :11-12);
      - `frontends/shell/src/admission/candidateColumns.test.ts` (one test name, :17).
    - **Widened regions:**
      - `engine/src/identity.rs`, in Scope "(doc only)", gains item 3's code and W-1 and W-2;
      - `frontends/shell/MANUAL-WALKTHROUGH.md`, in Scope "(a new Part)", gains row I4's quoted legend.
    - **Already in Scope, so not class 9:** `kernel/src/skp.rs`, `kernel/tests/skp_admission_remediation.rs`, `protocol/skp/SKP-V0.md`, `protocol/skp/tests/fixtures.rs`, `IdentityDeclarationForm.tsx`, and `docs/adr/ADR-016-stable-feature-identity-admission.md` (Amendment 2 item 2).
    - §7's lines are not edited.

12. **The class 8 figures.** Lines are insertions plus deletions, counted by §7's command as Amendment 2 item 7 amended it.

| File | Before this amendment | This amendment's lines |
|---|---|---|
| `engine/src/identity.rs` | in Scope, doc only | ~60 (predicate ~8, filter and arm ~4, docs ~10, W-1 ~8, W-2 ~30) |
| `engine/src/error.rs` | new, class 9 | ~4 |
| `kernel/src/skp.rs` | in Scope | ~2 |
| `kernel/tests/skp_admission_remediation.rs` | in Scope | ~65 |
| `protocol/skp/SKP-V0.md` | in Scope | ~6 |
| `protocol/skp/tests/fixtures.rs` | in Scope | ~3 |
| `frontends/shell/src/admission/IdentityDeclarationForm.tsx` | in Scope | ~16 |
| `frontends/shell/src/admission/candidateColumns.ts` | new, class 9 | ~3 |
| `frontends/shell/src/admission/candidateColumns.test.ts` | new, class 9 | ~2 |
| `docs/adr/ADR-016-stable-feature-identity-admission.md` | in Scope (Amendment 2) | ~18 (the Note) |
| `frontends/shell/MANUAL-WALKTHROUGH.md` | in Scope, a new Part | ~2 (row I4) |
| **This amendment** | 11 files, 3 of them new | **~180** |

   - **Against the form's figures:** §7 has at most 650 lines over 38 files, and Amendment 2 item 7 predicts about 715 over 40. This amendment brings the prediction to about 895 lines over 43 files. Neither ceiling of §7 holds.
   - This amendment's own share is bounded at 230 lines over these 11 files. An excess is recorded as class 8 at the count with this amendment named.
   - The overrun is predicted here, before code, and recorded as class 8 at the count. §7's line is not edited (Amendment 2 item 7).

13. **§8, rows added at the end of its table.**

| Path(s) | Shared with |
|---|---|
| `engine/src/identity.rs` (item 3 and docs), `engine/src/error.rs` (the `IdentityUnusable` doc), `frontends/shell/MANUAL-WALKTHROUGH.md` row I4 | text-id, built on this piece's head and merging after it (ADV-2026-11-23-35 item 2). It edits `admit_column_type`'s refusal detail, `error.rs` and row I4's quoted message (its own form; paraphrase), so item 3 leaves that detail byte-unchanged. |
| `engine/src/error.rs` | the node `partitioned-ordinal-refusal-opens-the-identity-form` (its §7: the variant's doc and its `Display` arm). It is already a base while its code changes a file this piece changes (Amendment 2 item 1, item 8). The regions are disjoint. |
| `frontends/shell/src/admission/candidateColumns.ts`, `candidateColumns.test.ts` | none known to me; the custodian confirms |

14. **§9 and §10, added.**
    - **§9:**
      - 15. A second list of the admitted types: in the engine, the candidate filter or `admit_column_type` not calling item 3's one predicate; anywhere in the kernel or the shell, a width list. Or the predicate visible outside `identity.rs`.
      - 16. `admit_column_type`'s refusal arm or its detail changed by this piece.
      - 17. The Note or either string differing from ADV-2026-11-26-04's bytes, or either string split across source lines.
      - 18. Row I4 changed beyond its quoted legend, or a past result log edited.
    - **§10, Architect:**
      - the Note appended after the Note 2026-11-23, with no line of the ADR edited, and Amendment 2's Decision 4 as ruled;
      - the predicate's two product callers, and nothing `pub` added.
    - **§10, Reviewer:**
      - W-1, W-2 and K-2 at P0 (item 9), and M-W1, M-W2 and M-K2 observed again;
      - the clause checks of item 7 and of the source comment of item 5.
    - **§10, Seams:** each is written against the interface the other side has at c28c8cf1 and is re-read at the recorded base. The real-shape test of both is K-2.
      - `EngineError::IdentityUnusable { candidate_columns }` into `error_of`'s comma join (`kernel/src/skp.rs:2223-2237`);
      - `DatasetIdentity::candidate_columns()` (`engine/src/identity.rs:257`) into `describe_dataset`'s member (§2 item 2).
    - **§10, Suites:** `cargo test --locked -p spatial-engine --lib identity` joins the list.

15. **The merge check (ADV-2026-11-26-04 item 6).** The advisor compares the Note of item 6 and the strings of item 5 with the diff byte for byte, beside ADV-2026-11-23-26 item 5's comparison.

16. **Superseded by this amendment, by section:**
    - §1: Declared unchanged, first bullet; May claim and May not claim added to;
    - §2: item 1, read as item 2 says; item 2's last sentence; item 6's last bullet;
    - §3: rows F-4 to F-6 added;
    - §4: P0, the mutation set, W-1, W-2 and K-2;
    - §5: Predictions; Declared unchanged, I6, I7 and Falsification added;
    - §7: Scope additions and the predicted overrun recorded here, with §7's lines not edited;
    - §8: rows added;
    - §9: items 2 and 5; items 15 to 18 added;
    - §10: Architect, Reviewer, Seams and Suites added to;
    - Amendment 2: item 2's "Which columns are candidates" bullet, item 4's §9 item 2 text, item 1's §9 item 5 text, item 5's counts.

17. **Next.** The form's gate reads this amendment and what it touches, once (ADV-2026-11-26-04 item 1). It also checks each clause of the ruling's item 3 Note and item 4 strings against the code, and a clause it finds untrue goes to the advisor with words. No code of this piece starts before that read has passed.

Read the last amendment first.

Nothing above is edited.
<<<AMENDMENT 5 ENDS>>>

---

**Clauses of item 3's Note and item 4's strings that the code does not bear out, flagged for the narrow read:**

1. **Note, Decision 3, "and stay declarable by name": untrue for one of the two omissions.** A name that holds a comma is declarable (`engine/src/identity.rs:290-298`; test :430-433). A name that nothing can address is left out (:311), and it is refused when declared (`engine/src/dataset.rs:2019-2025`; `engine/src/addressability.rs:86-106`, which covers U+0000 and an exported name that differs). It is not declarable. ADR-016 Amendment 2's Consequences limit their "declarable by name" sentence to the comma case, but this Decision does not. These are the advisor's words, not the human's, and the ruling's item 1 sends them to the advisor. Replacement words:
   "3. The columns the engine already leaves out of the list stay out of it. A column left out because its name holds a comma stays declarable by name; a column left out because nothing can address its name is refused if it is declared, as it is now."
   - Clause checks:
     - "stay out of it": :311 and :313 are kept (item 3 changes only :304).
     - "comma … stays declarable by name": :430-433. A comma name passes `not_addressable` (no U+0000 and no differing exported name, `addressability.rs:86-97`).
     - "nothing can address … refused if declared": `dataset.rs:2019-2025`; `engine/tests/b1_nul_declared_identity_no_scan.rs:46-52`.
     - "as it is now": the refusal is unchanged by this piece.
2. **Borne out, with a qualification the read should see:**
   - **Context "(§4)".** §4's text names no widths. The eight widths are the engine's reading of §4 (`engine/src/identity.rs:317-323` calls itself "the whole of ADR-016 §4's "value-preserving" test", verbatim from :320 inside its doc).
   - **Context "could be declared only by typing its name".** This holds on the refusal path and on the wire. On the session tier the app offered no declaration at all before this piece.
   - **Consequences, "every width streams (Note 2026-11-09)".** The Note 2026-11-09 speaks of a column named `id`. For a declared column the code bears it out (`engine/src/stream.rs:2702-2738`), and a test proves it for Int32 only (`engine/tests/narrow_integer_id_stream.rs:161-189`).
   - **Decision 1, read alone.** "every column whose type §4 admits" overstates, and it is true together with Decision 3.
3. **The hint.** When the list is empty, no list renders above it (`IdentityDeclarationForm.tsx:54`), and "not listed above" then covers every column. That is not untrue. A not-addressable name cannot be typed in practice and is refused anyway. That case is named for the source comment (amendment item 5).
4. **The legend.** I found nothing untrue.

**Findings outside the amendment's scope:**

- **Unrecorded work in this PR.** ADV-2026-11-23-27 item 4 lands ADR-016's Note 2026-11-23 in this piece's PR (about 6 lines), and item 2 conditionally adds the partitioned wire fixture's message and `protocol/skp/SKP-V0.md:734-735` as class 9. No amendment of this form records either: Grep finds no "11-23-27" or "Note 2026-11-23" in the form. It should be recorded before code. The class 8 figure above does not include those 6 lines.
- **Text-id.** Its PLAN title (`governance/PLAN.yaml:5039`, "can open only if it holds a unique 64-bit integer column") and its §0 (`governance/forms/frontends/TEXT-ID-OPENS-FOR-THE-SESSION-BY-ROW-POSITION-PREREGISTRATION.md:27-28`, which leans on `identity.rs:304`) assume the 64-bit filter. They are re-read at text-id's base, which is this piece's head.
- **Corpus #12.** `frontends/shell/MANUAL-WALKTHROUGH.md:1592` (S1) says the file "has no unsigned 64-bit integer column to map". After this change, its refusal may list that file's narrower integer columns. I could not read its schema because the file is not in the tree. The row records the form rather than asserting it, so no step fails.
- **Stale cites.** `KNOWN-LIMITATIONS.md:68` cites `engine/src/identity.rs:196-217` and `engine/src/error.rs:234-238`. Today these are :324-346 and :359-364 (per text-id's form). This piece edits that item. Text-id has planned the fix, but under "scope is the file" this piece could make it first, as a class 3 change.
- **A third width list.** `engine/src/stream.rs:2709-2738` holds the eight widths as downcast arms. It cannot share a `matches!` predicate, and `engine/tests/narrow_integer_id_stream.rs` guards it. This is a note only.
- **The protocol/ place.** It does not need to change: no fixture, wire type or literal moves (amendment item 2), and `SKP_VERSION` is `skp/0.14` at `protocol/skp/src/v0/mod.rs:136` and `frontends/shell/src/skp/types.ts:15`.

**Files read**, under D:/wt/read-1124f:
- the form, whole;
- the ruling ADV-2026-11-26-04, whole;
- the consult, whole;
- ADV-2026-11-23-26, -27 (whole) and -20 (item 6); ADV-2026-11-23-35 (items 1-2);
- `engine/src/identity.rs`, whole;
- `engine/src/dataset.rs:1950-2109`;
- `engine/src/error.rs:145-194`;
- `engine/src/stream.rs:2688-2739`;
- `engine/src/fixture.rs:520-619`, :690-824;
- `engine/src/addressability.rs:86-106`;
- `engine/tests/identity.rs:100-179`, `engine/tests/session_identity.rs:180-214`, `engine/tests/b1_projection_hostile_names.rs:715-759`, `engine/tests/narrow_integer_id_stream.rs:1-210`, `engine/tests/multipolygon_corpus.rs:15-59`;
- `kernel/src/skp.rs:2030-2059`, :2215-2244;
- `kernel/tests/skp_admission_remediation.rs`, whole;
- `kernel/tests/manual_walkthrough_fixtures.rs:475-599`;
- `protocol/skp/SKP-V0.md:298-321`, :585-634;
- `protocol/skp/tests/fixtures.rs:895-922`;
- `frontends/shell/src/admission/IdentityDeclarationForm.tsx`, `frontends/shell/src/admission/candidateColumns.ts`, `frontends/shell/src/admission/candidateColumns.test.ts` and `frontends/shell/src/admission/identityDeclarationState.ts`, whole;
- `frontends/shell/MANUAL-WALKTHROUGH.md:590-601`, and :522 and :1592 by Grep;
- `docs/adr/ADR-016-stable-feature-identity-admission.md`, whole;
- `KNOWN-LIMITATIONS.md:60-71`;
- `scripts/plan/verify-test-claims.mjs:1-120`;
- `governance/PLAN.yaml`, three nodes, by Grep;
- the partitioned-refusal and text-id forms and `governance/forms/engine/NARROW-INTEGER-ID-UNSTREAMABLE-PREREGISTRATION.md`, by Grep, and the last at :220-249.

Model: Opus 5.5 (claude-opus-5-5).
