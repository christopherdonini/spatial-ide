# A2-1 — column names that do not round-trip: the preregistration draft (for Fable's sighting, before any code)

- **Node:** `b1-close-nul-column-names` (wave-2 A2-1, S1). It lands before whichever node closes B1.
- **Authority:**
  - the 2026-09-28 S1 batch (`state/directives/2026-09-28-after-wave-s1-batch.md`, its ruling line and Fable's A2-1 paragraph);
  - the 2026-09-29 A2-1 clarification (`state/directives/2026-09-29-a2-1-clarification.md`). Its preregistration, with any new refusal code and the ADR-023 amendment text, comes to Fable before any code.
- **Status:** a draft. No code of it exists. After the sighting, §1 is appended to `engine/B1-PROJECTION-PREREGISTRATION.md` §10, and the texts in §2 land on main as a docs commit before any code (§1, 12.1 (g)). `<sight>` is filled then.
- **Drafted by:** the architect agent on the custodian's brief (`state/consults/2026-09-29-a2-1-prereg-architect-draft.md`, read at 1af041b), then edited by the custodian as listed below.
- **Evidence:** `state/drafts/a2-1-p0/`, committed in two parts:
  - c1218dd: `probe.rs.txt` and `p0-output.txt` (cases c01–c21), and `covering-probe.rs.txt` and `covering-output.txt` (k0–k3);
  - c7f7e3c: `extra-probe.rs.txt` and `extra-output.txt` (P-1 to P-4, O-1, O-2).
- **The custodian's edits to the consult's text:**
  1. P-1 to P-4, and the optional pair, were run before this draft. Their outcomes are facts in 12.0 (E6–E10) rather than probes for the branch, and N-7, N-10 and N-14 assert them. P-1's outcome is not the consult's prediction: the open does not refuse.
  2. E2 now names the third group, a name that exports empty (c04, c06).
  3. E4 now separates a filter that fails after the open (c01, c05) from one that silently binds another column (c02, c03, c15).
  4. The covering's sanity level is `NotChecked`, the enum's own name, not "none".
  5. The reproducer and control test names were read at c37b427. The file's sha256 is `515db6f692edd7b78393a13b651c9222893101fceecf5626efb2a68ddd58190d`.
  6. The DESCRIBE read's cancellation is stated in 12.3 (the consult's note 8).
  7. OPEN (g), the describe "filterable" fact, is added from the consult's note 1.
  8. The disposition of the consult's section 4 is in §4.

---

## 1. The amendment text (to append to `engine/B1-PROJECTION-PREREGISTRATION.md` §10)

### Amendment 12 — 2026-09-29, post-result (this addition's P0 seen; no code of it exists): scope addition on `state/directives/2026-09-28-after-wave-s1-batch.md` (its ruling line; Fable's A2-1 paragraph) and `state/directives/2026-09-29-a2-1-clarification.md`: column names that do not round-trip (wave-2 A2-1), PLAN node `b1-close-nul-column-names`

This is class 9 (scope addition), not a record correction. It is written before any code of the addition. Fable sighted it at `<sight>`. It lands before whichever node closes B1 (the 2026-09-29 clarification).

**12.0 Disclosure**

**Sources:**
- The finding: `state/cloud/wave2/W2-A2.md`, Finding A2-1, and the custodian's unproven observation 3.
- The P0: run by the custodian against DuckDB v1.5.5 (crate `duckdb` 1.10505.0, per `Cargo.lock`), at main 1af041b and c1218dd, as untracked scratch tests since removed.
- The probes and outputs are kept as text under `state/drafts/a2-1-p0/`, committed at c1218dd and c7f7e3c. They are evidence, not Authority.

**Established by the P0.** Case ids refer to `p0-output.txt`, `covering-output.txt` and `extra-output.txt`.
- **E1.** DuckDB's Arrow export truncates a top-level name at its first U+0000, and a struct child's name likewise (k2). DESCRIBE over the same `SELECT *`, and `parquet_schema`, both carry the full name (c01–c06, c15–c21, O-1, O-2).
- **E2.** The truncated name does one of three things:
  - binds to nothing (c01, c05, c16, c18, c20, c21);
  - binds to a different column (c02, c03, c15, c17, c19);
  - is empty and cannot be written as an identifier (c04, c06).

  A bind check passes the second group.
- **E3.** No SQL spelling carries U+0000 through duckdb-rs. A raw NUL is refused, and the `U&` escape is not implemented (the three SPELLING rows).
- **E4.** Every use by name goes wrong today:
  - **Projection** is admitted, then fails after the stream opens (c01, c02, c04, c05, c06, c15).
  - **Filter:**
    - admitted, then fails after the stream opens (c01, c05);
    - admitted, and silently binds another column (c15; c02, c03 through the real same-named column);
    - refused as unparsable (c04, c06).
  - **`projectable`** is true for every such column.
  - **Geometry** refuses the open with a false reason (c16, c17).
  - **Native identity** refuses the open as a binder error (c18).
  - **Declared identity** refuses with a false reason and a phantom candidate (c20), or with a binder error (c21).
  - **A covering** whose path contains U+0000 opens, then fails at the first bbox stream item (k1, k2).
- **E5.** Names that round-trip keep DuckDB's own bound names, identical in the export and in DESCRIBE:
  - an empty name becomes `C2` (c07);
  - case duplicates become `Zone_1` and `Zone_1_1` (c14);
  - c08–c13 (NFD/NFC, a space, 5000 characters, a BOM, control characters) all round-trip.

  `parquet_schema` disagrees with the binder in c07 and c14.
- **E6 (P-1).** Under the format default (no `crs` key, degrees, no geo `bbox` member), a U+0000 covering opens:
  - the sanity level is `NotChecked`, with the false reason "the covering names … which the file's schema does not contain" (the path check runs before any statement);
  - the covering is kept, and the bbox stream fails after the mint (p1a, p1b).
  - The control records `Metadata` (p1c).
- **E7 (P-2).** A real `zone` (`Utf8`) beside `zone\0x` (`Int64`):
  - `namespace_admit`'s map keeps the last of the two equal truncated names, so the surrogate carries the `Int64` column's type in one order;
  - there, `zone LIKE 'col0%'` is falsely refused (`rejected_by_binder`), while `zone > 3` is admitted and fails after the mint (p2). The other order types it `Utf8` (p2r).
- **E8 (P-3).** `id\0x` (`Utf8`) ahead of a real `id` (`UInt64`): the open falsely refuses the file's valid identity as `identity_unusable`, "type is Utf8" (p3).
- **E9 (P-4).** U+0000 inside predicate text is refused synchronously as unparsable in all five shapes (p4), including a valid prefix followed by a NUL. The NUL truncates the admission wrapper's own tail. This is not a finding.
- **E10 (O-1, O-2).**
  - Two names truncating to one prefix export as two equal names, and DESCRIBE tells them apart (o1).
  - DuckDB's case dedup renames the second of `zone\0x` and `ZONE\0x` to `ZONE\0x_1`, whose suffix the export loses (o2).
  - The positional rule classifies both.
- **k3** (a covering that names a column the file lacks, with no U+0000) fails at the first bbox item as a binder error. It is not an A2-1 case (OPEN A12-c).

**Reproducers:** `a_nul_in_a_column_name_is_admitted_then_fails_after_the_stream_opens` and `a_nul_in_a_column_name_makes_admission_type_a_different_column_than_duckdb_binds`, in `engine/tests/b1_projection_hostile_names.rs` at c37b427 (`cloud/wave2-A2`, unmerged; nothing merges from it; file sha256 `515db6f692edd7b78393a13b651c9222893101fceecf5626efb2a68ddd58190d`). No code of this addition exists.

**12.1 §2 shape**

**(a) Detection, in `dataset::probe_schema`.** Two drained reads of the same `SELECT * FROM read_parquet(?) LIMIT 0` on the open's lease:
- the Arrow export (the types);
- DESCRIBE's `column_name` values (the names DuckDB binds).

If the two lists differ in length, the open refuses `EngineError::InternalInconsistency`, naming both counts. Position *i* round-trips if and only if the two names are byte-equal. This positional comparison is the discriminator: a bind check misses E2's second group, and `parquet_schema` misreads E5.

**(b) The resident schema.** `Dataset::file_schema` carries each position's export type under DESCRIBE's name (OPEN A12-a). A field that does not round-trip also carries its exported name, under the metadata key declared in §7. Every function that already receives the `Field` therefore reads the fact without a second lookup.

**(c) One classifying function, `pub(crate)`.** A name is **not addressable** when either:
- its `Field` carries an exported name that differs from its bound name; or
- the name contains U+0000. This is the rule for a name that no comparison covers, such as a covering's struct-child segment (E1, E3).

The function returns a typed engine fact: the bound name, the exported name where there is one, and the byte offset of the first U+0000.

**(d) Every use by name goes through (c), at its existing single site:**

| Use | Site | For a name that is not addressable |
|---|---|---|
| Projection, live and publish | `attributes::admit_projection_column` (shared by `admit_projection` pass 2 and `projectable`) | New `ProjectionError::ColumnNameNotAddressable { column, detail }`. The per-column order becomes name, geometry, identity, duplicate, type. |
| describe `projectable` | `kernel::skp::describe_dataset`, through the same function | `false` |
| Filter namespace: membership and a referenced name | `predicate::filterable_column_type`, and so `filter_surrogate` and `namespace_admit` (O4, row X5) | Left out of the namespace. When referenced: `FilterError::ColumnNotFilterable { column, reason }`. |
| Geometry lookup at open | `dataset::check_geometry_column` | The open refuses `EngineError::GeoMetadata` (OPEN A12-b). |
| Native identity | `dataset::admit_identity`, no-declaration arm | Never matches `id`. With no addressable `id`, the dataset takes the session tier, R-I3 (OPEN A12-d). With an addressable `id` beside it, it is native on that `id` (E8's file). |
| Declared identity | `dataset::admit_identity`, declared arm, before any SQL | `EngineError::IdentityUnusable { column, detail, candidate_columns }`. No scan runs. |
| Candidate list | `identity::candidate_identity_columns` | Omitted, beside the comma rule. |
| Covering | At open, `dataset::sanity_check`'s path check (beside `field_path_exists`) and the stored covering. `Dataset::covering()` returns a usable covering only. `stream::build_sql`, `build_index_observed` and `build_row_group_index_observed` take their `NoCoveringBbox` detail from one private function. | The open succeeds with the covering recorded as unusable. A bbox query refuses `NoCoveringBbox` before any lease, with a detail naming the fact. The sanity level is `NotChecked`, with a reason naming the fact (OPEN A12-c). |

**(e) Kernel and publish.**
- `projection_error_of` gains one arm and stays exhaustive. `error_of` and `filter_error_of` are unchanged.
- Publish: `From<ProjectionError> for EngineError` gains one arm, producing `AttributeUnpublishable { column, detail }`. `publish.engine` is unchanged.

**(f) Wire.**
- One new code (the ADR-023 amendment).
- describe's `schema[].name` is the bound name, with U+0000 JSON-escaped (OPEN A12-a).
- `covering_bbox` reports a usable covering (OPEN A12-c).
- The literal is the one after main's at merge (§2.7's rule). It is `skp/0.6` today, and B-1's fix may take the next one.
- Both sides' fixtures change in the bump commit, plus one error fixture for the new code.

**(g) Documents.**
- The ADR-023 amendment and the ADR-021 note (OPEN A12-f) land on main as a docs commit, after Fable's sight and before any code of this addition.
- SKP-V0 gains dated notes only: §9.5 (the new row), §9.4 step 4, §7.3 (the namespace), describe's `name`, and the §8 entry for the new literal. Nothing earlier is rewritten.

**(h) Messages.** Every message states engine facts only. The wording is the human's, at B1's close (§1).

**12.2 §4 tests, one mutation each**

For each test, the mutation is applied, the test is run, its failure is recorded by name with the commit, and the mutation is reverted (round 25, item 2 (c)). Fixtures are generated in-test in the P0 writer's shape and hash-verified before and after each run (§3's discipline).

The reproducer file's three passing control tests come along unchanged:
- `hostile_names_round_trip_to_their_own_columns`;
- `hostile_names_colliding_after_case_folding_bind_one_column_each`;
- `hostile_names_an_uppercase_id_under_a_mapped_identity_is_admitted_beside_id`.

- **N-1** `a_nul_in_a_column_name_is_refused_by_admission_before_any_stream_opens`. It inverts `a_nul_in_a_column_name_is_admitted_then_fails_after_the_stream_opens` (c01).
  - Asserts: the resident name is `nu\u{0}l`. `["nu\u{0}l"]` is refused `ColumnNameNotAddressable`. `["nu"]` is refused `ColumnUnknown`, with `known_columns` holding `nu\u{0}l` (under OPEN A12-a as recommended). No stream opens.
  - Mutation: `probe_schema` returns the export's names.
- **N-2** `a_nul_named_column_never_makes_admission_type_a_column_duckdb_does_not_bind`. It inverts `a_nul_in_a_column_name_makes_admission_type_a_different_column_than_duckdb_binds` (c02).
  - Asserts: `["zone"]` admits the `Utf8` column and streams values equal to a DuckDB read. `["zone\u{0}x"]` is refused `ColumnNameNotAddressable`.
  - Mutation: the function in (c) always returns `Ok`.
- **N-3** `projectable_and_admission_agree_on_a_nul_named_column` (kernel, K-5's harness, c01 and c02).
  - Asserts: each row's `projectable` equals admission, and each row's `name` is the bound name.
  - Mutation: the name rule moves into `admit_projection`'s pass 1 only.
- **N-4** `a_projection_naming_a_nul_named_column_is_refused_synchronously_typed_and_pre_mint` (kernel, K-2's pattern, F12's harness).
  - Asserts: the new code with its exact key set; `cancel_all_for_dataset` returns 0; `leases_issued` is unchanged; the refusal matches the committed error fixture (X9's pattern).
  - Mutation: `projection_error_of` maps the variant to `projection_column_unknown`.
- **N-5** `a_nul_named_column_is_refused_as_not_filterable_by_name` (a constructed `Field`, E-19's pattern).
  - Asserts: the reason names U+0000.
  - Mutation: the name check is removed from `filterable_column_type`.
- **N-6** `a_filter_on_a_file_with_a_nul_named_column_binds_and_streams_its_other_columns` (live, c01).
  - Asserts: `"Num" IS NOT NULL` is admitted and streams. `"nu" IS NOT NULL` is refused `UnknownColumn`.
  - Mutation: `namespace_admit` inserts every field without the name check (the surrogate SQL then carries U+0000).
- **N-7** `a_filter_types_the_column_duckdb_binds_when_a_nul_named_column_shares_its_name` (E7's p2 file).
  - Asserts: the namespace surrogate for `zone` is `VARCHAR`, and `zone LIKE 'col0%'` is admitted and streams the rows whose `zone` begins `col0`.
  - Mutation: `probe_schema` returns the export's names.
  - (`zone = 5` on that file is B-1's shape and is not asserted here.)
- **N-8** `a_geometry_column_whose_name_contains_u0000_refuses_open_naming_that_fact` (c16, c17).
  - Asserts: the message never says that the file lacks the column.
  - Mutation: the name check is removed from `check_geometry_column`.
- **N-9** `a_native_id_with_u0000_opens_on_the_session_tier_with_no_nul_candidate` (c18).
  - Mutation: `candidate_identity_columns` drops the U+0000 omission.
- **N-10** `the_native_id_is_the_column_duckdb_binds_when_a_nul_named_id_precedes_it` (E8's p3 file).
  - Asserts: the open succeeds, native on the `UInt64` `id`, with the identity verification scan run once.
  - Mutation: `admit_identity` matches by exported name.
- **N-11** `a_declared_identity_naming_a_nul_named_column_is_refused_before_any_scan` (c20).
  - Asserts: `column` is the full name; `candidate_columns` is empty; `IDENTITY_VERIFICATION_SCANS` is unchanged.
  - Mutation: the name check is removed from the declared arm.
- **N-12** `a_declared_identity_naming_the_truncated_prefix_is_an_absent_column` (c21).
  - Asserts: never `engine.query`.
  - Mutation: `probe_schema` returns the export's names.
- **N-13** `a_covering_whose_path_contains_u0000_is_unusable_and_a_bbox_query_refuses_before_any_lease` (k1, k2; engine and kernel).
  - Asserts: the open succeeds. The bbox stream's open returns `NoCoveringBbox`. The kernel's `viewport_query` refuses `engine.no_covering_bbox` before the mint. The no-bbox stream is unchanged.
  - Mutation: `covering()` returns the declared covering whatever its usability.
- **N-14** `a_nul_covering_under_the_format_default_records_not_checked_with_the_true_reason` (E6's p1a and p1b files).
  - Asserts: the sanity level is `NotChecked`; the reason names U+0000 and never says the schema lacks the column; a bbox query refuses `NoCoveringBbox` before any lease.
  - Mutation: `sanity_check`'s path check skips the function in (c).
- **N-15** `the_schema_probe_classifies_by_position_and_keeps_duckdbs_own_renames` (c01–c07, c14, c15, o1, o2).
  - Asserts: `C2`, `Zone_1` and `Zone_1_1` are byte-equal to today's. The exported-name key appears exactly at the U+0000 positions.
  - Mutation: names are taken from `parquet_schema`.
- **N-16** `publish_refuses_a_nul_named_column_at_preflight_before_any_write`.
  - Mutation: the new `From` arm renders `ColumnUnknown`'s detail.
- **N-17** `every_projection_refusal_matches_its_committed_error_fixture_shape` is extended to eight codes, and both sides' fixture tests read the new fixture.
  - Mutation: the fixture's `detail` key is renamed.

**Changed existing tests:** the closing `codes.len() == 7` assertion in `every_projection_refusal_is_synchronous_typed_and_pre_mint` becomes 8, and the literal assertions follow.

**12.3 §5**

**Declared unchanged:**
- For every name that round-trips (E5, including `C2`, `Zone_1`, `Zone_1_1` and c08–c13), byte for byte: the resident name, the describe row, namespace membership and surrogate, the projection outcome, `known_columns`, `candidate_columns`, and the identity and geometry outcomes.
- The six existing `ProjectionError` variants: their codes, fields and texts.
- The eleven filter codes (ADR-021 decision 8), and `error_of`'s arms.
- Publish's codes and every existing publish text.
- `build_sql` for every addressable name, the `WHERE` rule, and `BBOX_COND`.
- `protocol/data-plane/` (an empty diff).
- R-S3 for k3, unless OPEN A12-c rules otherwise.
- Cold open gains one footer-only statement (the DESCRIBE read) on the open's lease. It is not bound to the cancel token, because it reads only the footer, as the existing schema probe does. No `docs/08` figure is claimed.

**Invalidators** (stop and return to the architect):
- On any fixture, the two lists differ in length, a position differs without U+0000, or a U+0000 name matches its export.
- Any item declared unchanged moves.
- A refusal of this addition cannot be made pre-lease and pre-mint.
- The filter side needs a new code, or ADR-021's Decision text has to change.
- A second classification function is needed.
- A data-plane diff is needed.

**Falsification:** at the pinned DuckDB, DESCRIBE's column order is not the export's order for the same `SELECT *`.

**§7.** One new declaration: the `Field` metadata key that carries the exported name (`spatial.exported_name`). It is internal and never serialized to SKP or into a frame (§8 item 8). No constant changes.

**12.4 §8, continuing from item 24**

25. A use by name that does not reach (c) through its site in 12.1 (d), or a second classification function.
26. A refusal from this addition that arrives as a data-plane terminal, arrives after a lease or mint, or comes after a statement naming the column has been prepared.
27. A false code or detail for a name that is not addressable:
    - `projection_column_unknown` or `projection_type_not_admitted` for its full name;
    - "no such column" or "does not contain" for a column the file carries;
    - "declares no covering.bbox" for a covering the file declares;
    - `engine.query` from any open or query path.
28. Any byte change for a name that round-trips.
29. `parquet_schema`, a prefix match or a bind check used as the discriminator.
30. A new filter code or a new `engine.*` code; any ADR-017 edit; or an ADR-021 or ADR-023 edit other than the texts Fable sighted, landed on main before the code.
31. The new code without its error fixture on both sides in the literal-bump commit, or a literal that is not the one after main's at merge.
32. A name that is not addressable appearing in `candidate_columns`, or the exported-name key reaching the wire or a frame.
33. An engine message stating another module's consequence.

How the existing items read with this addition:
- Item 2's seven codes are eight (ADR-023 as amended).
- Item 15 carves out the publish and filter observables of names that are not addressable, on the 2026-09-28 ruling.
- Item 21 holds for this node's diff, because the ADR texts land on main beforehand.

**12.5 §9.** Full gating: the piece touches an ADR, the wire and a guarantee.
- **Architect:**
  - 12.4 item by item, and items 1–24 as read above;
  - the ADR texts on main byte-identical to what Fable sighted;
  - the seam: kernel → engine through `ProjectionError`'s new variant, read on the branch and proved by N-4;
  - the caller rule: the variant's product callers are `projection_error_of` and publish's `From`; (c)'s callers are the 12.1 (d) sites. The live non-null `columns` path stays under round 8's exemption (§2.9).
- **Reviewer:**
  - the full diff, with `git diff --stat origin/main...HEAD -- protocol/data-plane/` shown empty;
  - each mutation observed;
  - discharge claims resolved.
- **Suites:** §9's list.
- **Operator:** none. The strings are sighted with B1's close.
- **Merge:** before the node that closes B1 (the dependency is in PLAN.yaml). The literal is computed at merge.
- **Record:** the gate reports are the observation of record. Any closing amendment is references and hashes only (the record cap).

---

## 2. The texts for Fable

### 2a. The ADR-023 amendment (to append to `docs/adr/ADR-023-attribute-projection-on-viewport-query.md`)

## Amendment 2026-09-29 (Proposed; for the human's acceptance with B1's close) — a column name DuckDB binds but its Arrow export does not carry

*Appended while this ADR is Proposed. Authority: the human's ruling of 2026-09-28 (`state/directives/2026-09-28-after-wave-s1-batch.md`, its ruling line and Fable's A2-1 paragraph), as clarified in `state/directives/2026-09-29-a2-1-clarification.md`. The Decision text above is unchanged. Evidence: wave-2 finding A2-1 (`state/cloud/wave2/W2-A2.md`) and its P0 (`state/drafts/a2-1-p0/`). Implementation: `engine/B1-PROJECTION-PREREGISTRATION.md` §10, Amendment 12.*

1. **The fact.** A Parquet column name may contain U+0000. At DuckDB v1.5.5:
   - the binder resolves the full name;
   - the Arrow export truncates it at the first U+0000;
   - no statement text the engine issues can carry U+0000.

   The truncated name then binds to nothing, or to a different column.
2. **Addressability.** The resident schema names every column by the name DuckDB binds. A column whose bound name and exported name differ is **not addressable**. This is found at open, by comparing the two lists position by position. One engine function decides it, and every use by name applies it. §2's rule of one admission function is unchanged: addressability is a precondition, not a second type policy.
3. **§3 gains one code.** It is refused synchronously, before any lease or mint, like the others:
   - **`skp.projection_column_name_not_addressable`**, with fields `column` (the bound name) and `detail` (the engine's fact).

   A declared name that resolves to no column, including the truncated prefix, stays `skp.projection_column_unknown`. The per-column order becomes name, geometry, identity, duplicate, type. §3's set is now seven codes mapped from `ProjectionError`, plus `skp.projection_empty_list`.
4. **§8, `describe`.** `projectable` is false for such a column, computed by the same per-column function. `schema[].name` is the bound name.
5. **§10.** The code rides the literal after `main`'s at merge.
6. **§11 gains item 10:** a column that is not addressable is admitted by any projection path, or its name is placed in any statement text.
7. **Not decided here:**
   - the filter namespace (ADR-021's note of 2026-09-29);
   - the geometry, identity and covering outcomes at open, which use existing engine codes.

### 2b. The SKP-V0 §9.5 row

Add it as a dated note under §9.5; the "seven codes" heading stays untouched:

| Code | Fields |
|---|---|
| `skp.projection_column_name_not_addressable` | `column`, `detail` |

### 2c. The ADR-021 note, drafted for OPEN A12-f (to append to `docs/adr/ADR-021-row-filter-on-viewport-query.md`)

## Note 2026-09-29 — a column that is not addressable is excluded from the namespace by name

*Appended under the human's ruling of 2026-09-28 (`state/directives/2026-09-28-after-wave-s1-batch.md`). The text above is unchanged, the Status line included.*

1. Decision 5's namespace excludes any column that is not addressable (ADR-023, Amendment 2026-09-29, item 2), whatever its type. A predicate naming such a column is refused with the existing `skp.filter_column_not_filterable` (fields `column` and `reason`), with the `reason` stating the fact. A predicate naming the truncated prefix is refused `skp.filter_unknown_column`. No code is added, and decision 8's eleven codes stand.
2. Implemented by PLAN node `b1-close-nul-column-names`.

---

## 3. OPEN, for Fable — the architect's recommendation on each

- **(a) Which name the resident schema and describe carry.**
  - **Recommendation:** the full bound name, with U+0000 JSON-escaped.
    - `known_columns` lists it, which is true: it is a column the dataset carries.
    - `candidate_columns` omits it: declaring it would be refused, so offering it would be false.
  - **Against the truncated name:** describe would keep stating a name the file does not have, which is Fable's S1 reason. c02's two `zone` rows would also stay ambiguous.
- **(b) The new code's name and fields.**
  - **Recommendation:** `skp.projection_column_name_not_addressable`, with `column` and `detail`. It mirrors `filter_column_not_filterable`.
  - **Alternative:** `…_name_contains_nul`, with `column` only. It is narrower: true only for today's mechanism.
  - **Geometry at open:** use the existing `engine.geo_metadata`. Its variant doc reads, verbatim, "The `geo` metadata is present but not usable." `engine.source`, which the sibling arms use today, is documented, verbatim, as "The file could not be opened or read at all." — false here. No new engine code is needed.
- **(c) The covering.**
  - k1, k2, p1a and p1b are in scope as a use by name. Please confirm, because Fable's list does not name the covering.
  - **Recommendation: drop the covering at open.**
    - The open succeeds, and a bbox query refuses `engine.no_covering_bbox` before any lease, with a true detail.
    - `NoCoveringBbox`'s variant doc widens to "no usable covering".
    - `describe.covering_bbox` reports a usable covering, recorded in a dated SKP-V0 note.
  - **Against refusing the open:** doing that for k1 and k2 alone would make a U+0000 covering harsher than an absent-column one. Refusing the open is on ADMISSION §12d's human list, as `sanity_check`'s own comment records.
  - **k3:** keep it out of this piece. It has no U+0000 and is not A2-1's finding. File it separately: a bbox query gets a post-mint `engine.query`. Dropping it at open through the same `covering()` would keep the open succeeding, so only refusing the open would need the human.
- **(d) Native `id\0x`.**
  - **Recommendation:** the session tier. Under (a) the file has no column named `id`, and R-I3 governs such files. A refusal would state a new rule.
  - A file that carries both `id\0x` and a real `id` is native on the real `id`, which E8 shows is falsely refused today.
- **(e) Where this lives.**
  - **Recommendation:** class 9 on B1's form, as drafted. Fable's paragraph places the fix in B1's close, "not a separate cut". Items 2, 15 and 21 of §8 read as 12.4 states.
  - **Alternative:** its own full-form file. That is cleaner against a merged node's §8 and §9.
- **(f) The ADR-021 note.**
  - The exclusion narrows the effect of decision 5.
  - **Recommendation:** a Note under the 2026-09-28 ruling, following the 2026-09-24 precedent, sighted with the ADR-023 text.
  - If Fable reads it as a change to ADR-021's Decision text, it becomes the human's typed text, as B-1's paragraph in the same directive says.
- **(g) The describe "filterable" fact.**
  - Fable's A2-1 paragraph speaks of describe's "projectable and filterable facts". `FieldInfo` (`protocol/skp/src/v0/commands.rs`) carries only `projectable`.
  - **Recommendation:** add no member. A wire field with no consumer breaks the caller rule. O4 still holds, because `filterable_column_type` is the single site for namespace membership and for refusing a referenced name.

## 4. The consult's section 4, disposed

1. Became OPEN (g).
2. P-1 was run (E6). Its outcome is not the predicted open refusal: the open succeeds, and the bbox stream fails after the mint.
3. P-2 was run (E7), and N-7 asserts it.
4. P-3 was run (E8), and N-10 asserts it.
5. P-4 was run (E9). It is refused synchronously in every shape, so there is no finding.
6. Kept: N-6 pins it.
7. O-1 and O-2 were run (E10), and N-15 carries both files.
8. Stated in 12.3.
9. Done: the evidence is committed at c1218dd and c7f7e3c.
10. Done: the names were read at c37b427, with the file's sha256 above.
