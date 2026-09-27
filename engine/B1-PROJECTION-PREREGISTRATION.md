# Brief B stage B1, engine/kernel half: attribute projection on `viewport_query` — preregistration

## Header

- **Status.** The preregistration of PLAN node `b1-engine-kernel-half`, sighted by the human (RULED 2026-09-24 — question round 17, items 3 and 4). Committed before any code. Append-only once committed; an amendment written after any outcome has been seen says so in its first line.
- **OPEN markers.** O1–O8 mark choices no ruling covers yet. No code that touches a marked point begins until the human rules it.
- **Authority:**
  - PLAN node `b1-engine-kernel-half`; `entry-79-b1-consult-items` follows it.
  - RULED 2026-09-24 — question round 17, item 3 (ADR-017 unedited; the bundle-format restriction at the publish site; `Float32` filterable; dictionary-encoded columns excluded from the filter namespace by name) and item 4 (the draft sighted, its stop items 3–8 as recommended, revised to item 3 and committed as this node's preregistration).
  - RULED 2026-09-24 (night), item (2): literals follow merge order. The precedent is RULED 2026-09-14, question set C, item C2.
  - RULED 2026-09-14, question set D, item D2 (ADR-023's Decision text, its two §2 amendments and four B1 conditions).
  - RULED 2026-09-11, entry 79, items (1)–(3).
  - RULED 2026-09-23 (late), shell direction, items (a)–(e).
  - RULED 2026-09-24 — question round 21, item 1 (ADR-035 accepted as merged; it fixes the watcher's literal, which §2.7 follows).
- **What it decomposes:**
  - ADR-023 Decision §§1–5 and §§8–11, including §2's clarifying sentence of 2026-09-24, and its B1 conditions (1)–(4).
  - ADR-021's Note 2026-09-24.
  - DRAFT-3 Stage B1, the engine/kernel half.
  - The two architect consults of 2026-09-10 (Doc 1, the ADR-023 decision; Doc 2, the ADR-004 data-plane review). Their cites are historical.
- **Drafted by** the architect agent. Source: its draft of 2026-09-24 (`state/consults/2026-09-24-b1-engine-prereg-draft.md`, read at eab8e82), revised to the rulings and re-read against `main` at c16f41d. Read-only; the architect ran no command. Every statement about how DuckDB or arrow-rs behaves is a P0 hypothesis (§5), not a claim.
- **Reference form.** Code is cited by symbol, documents by section, and the ledger by round and item. There are no line cites. A gate that needs a line pins it at a commit on `main`.
- **Branch.** `cut/b1-engine-projection`, cut from `main` after `engine-source-change-watcher` merges. If code is wanted earlier, the branch stacks on the watcher's branch and merges after it (round 17 item 4, the draft's stop item 7).

## §0. Disclosure

- **Read in full:**
  - ADR-023, ADR-021, ADR-035 and ADR-017 §4.
  - The ledger blocks named in the Header.
  - DRAFT-3 Stage B1 and both 2026-09-10 consults.
  - `docs/08`, `docs/PREREGISTRATION-TEMPLATE.md`, and the PLAN nodes named here.
- **Code read at c16f41d:**
  - Protocol: `protocol/skp/src/v0/{mod.rs,commands.rs}` (`SKP_VERSION` is `skp/0.4`), `protocol/skp/SKP-V0.md` §§1, 4, 5, 7 and 8, and `protocol/skp/tests/data/*.json`.
  - Kernel:
    - `kernel/src/skp.rs`: `SkpHost::{describe,viewport_query}`, `build_viewport_query`, `predicate_admit_error_of`, `describe_dataset`, `error_of`, `filter_error_of`, `check_version`.
    - `kernel/src/lib.rs`: `open_engine_stream`, and its raw-path caller in `EngineSourceFactory`.
    - `kernel/src/publish/{mod.rs,error.rs,ceilings.rs}`: `preflight_pinless_parts`, `From<EngineError> for PublishError`, `PublishError::code`.
  - Engine:
    - `engine/src/attributes.rs`.
    - `engine/src/stream.rs`: `stream_with_cancel`, `stream_for_publish`, `resolve_projection`, `stream_inner`, `build_sql`, `attr_row_bytes`, `flush`, `MAX_QUEUED_BATCHES`, and the `filter_composition` tests.
    - `engine/src/predicate.rs`: `namespace_admit`, `duckdb_type_name`, `bind_admit`.
    - `engine/src/error.rs`, `engine/src/pool.rs` (`Pool::leases_issued`), `engine/src/fixture.rs` (`AttributeMode`, `IdentityMode`).
  - Tests: `kernel/tests/{skp_admission.rs,wire_bytes_invariant.rs}` and `engine/tests/{publish_stream.rs,row_group_seam.rs}`.
  - Shell: `frontends/shell/src/skp/{types.ts,client.ts,client.test.ts,__tests__/fixtures.test.ts}` and `frontends/shell/src/style/document.ts`.
- There was no pilot, spike or corpus run, and nothing was measured. The 5 GB fixture is not read.
- **Findings from reading the code, disclosed rather than absorbed:**
  - **F1.** `predicate.rs::bind_admit` builds its surrogate from every column in the namespace and calls `duckdb_type_name(..).expect(..)`, which has no `Float32` arm. Widening the gate without widening it makes every filtered query panic on a file that carries a `Float32` column. The fix is compulsory.
  - **F2 (ruled).** ADR-017 §4 refuses `float32` and dictionaries. Round 17 item 3 leaves ADR-017 byte-identical and places a named bundle-format restriction at the publish site (§2.2).
  - **F3 (ruled).** SKP-V0 §7.3 defines the filter namespace by reference to `admit_attribute_type`. ADR-021's Note 2026-09-24 states the widening and the dictionary exclusion (§2.3).
  - **F4.** `resolve_projection(&[])` is publish's valid empty projection. The `columns: []` refusal lives at the SKP boundary (§2.2), never in the shared gate.
  - **F5.** The raw `StreamParams` path (`AdmissionMode::Raw`) is `open_engine_stream`'s second caller. B1 gives it no projection (caller rule).
  - **F6.** ADR-023's Status line is stale, and so is §10's `skp/0.4`, which is now `crs-unit-fact-and-bounds`'s literal (B1's is in §2.7). Both are corrected by dated notes at ADR-023's acceptance, at B1's close. This half does not edit ADR-023.
  - **F7 (out of scope).** A filter refusal's `reason` for a refused type renders `EngineError::AttributeUnpublishable`'s Display, which speaks of publishing. It is kept byte-identical (§5).
  - **F8.** The final arm of `admit_attribute_type` gives a detail that lists the admissible set for a published attribute, ending at `float64`. After ADR-023 §2's amendments that list is false on the live path. → O2.
  - **F9.** Every projection refusal reaches publish's operator as `publish.engine` with `EngineError`'s Display. The count refusal's Display names the constant. → O1.
  - **F10.** `client.ts::viewportQuery` is the only constructor of the `viewport_query` request. `viewportStreamManager.ts`, `tileViewportStreamManager.ts` and `candidateArmSession.ts` call it. `client.test.ts` pins the exact request object and the literal.
  - **F11.** No per-class lease accessor exists. The real windows are `StreamRegistry::cancel_all_for_dataset`'s returned count (the `skp_admission.rs` pattern) and `Dataset::connections().leases_issued()`.
  - **F12.** `SkpHost::open_dataset` mints its own handle, so a committed request fixture's `dataset` cannot name it. The real harness opens the file with `Catalog::open` under the fixture's handle and builds `SkpHost::new`: the shape of `a_filtered_viewport_query_with_a_valid_predicate_delivers_a_correctly_subset_stream_over_the_wire`.
  - **F13.** `AttributeMode::CategoricalZone` carries only `zone`. Every other column in §3 comes from a new `AttributeMode` variant.
  - **F14.** The unit test in `engine/src/attributes.rs`'s `tests` module that checks the admissible set against the bundle asserts that `Float32` and a dictionary are refused. It changes with B1 (§4, changed tests).
  - **F15.** `MAX_INFLIGHT_BATCHES` belongs to `protocol/data-plane/src/server.rs`, not to the engine.
  - **F16.** Under `IdentityMode::ForeignKeyColumn` the file carries `parcel_key` and no `id` column. → O8.
- **Hypotheses H1–H5** are labelled as hypotheses; each has its discriminator in §5.

## §1. What this preregistration may and may not claim

- **May claim, once the tests pass:**
  - `viewport_query` accepts a declared projection and streams it as further Arrow columns in the same batch.
  - Admission refuses with seven typed codes, synchronously, before any lease or mint.
  - `describe` carries a kernel-computed `projectable` fact on each schema row.
  - `columns: null` is unchanged.
  - `Float32` columns are filterable, and dictionary-encoded columns are refused from the filter namespace by name.
  - Publish refuses `Float32` and dictionary columns at preflight with today's text.
- **May not claim:**
  - That hover shows attributes, that `match` works live, that B1 is done, or anything about the workflow (DRAFT-3 B-1).
  - Any duration, performance number or `docs/08` row (DRAFT-3 B-7; ADR-023 §9).
  - "zero-copy" (ADR-004).
  - That ADR-023 is accepted.
- **The wire changes (SKP), scoped and gated for it.** MCP is untouched (ADR-023 §9).
- **ADRs cited, none edited here:** ADR-004, ADR-006, ADR-010 (rules 1, 2, 6), ADR-016, ADR-017 (byte-identical, round 17 item 3), ADR-019, ADR-021 and ADR-023 (both already carry the texts round 17 item 3 ordered), ADR-022, ADR-035.
- **The wording of every new refusal message is the human's,** sighted at B1's close with the shell half. Engine messages state engine facts only (the operator-visible-text rule).
- **No new display surface** (shell direction items (b)–(d)). §2.4 is the wire mirror only; it adds no component and no visible string.

## §2. The change, stated before it is applied

### 2.1 `protocol/skp`

- `ViewportQueryRequest` gains `columns: Option<Vec<String>>`, an ordered list supplied by the caller.
  - It follows the `bbox_crs`/`filter` discipline: no `#[serde(default)]`, no `skip_serializing_if`, and `None` serialized as `null`.
- `FieldInfo` gains `projectable: bool`.
- `SKP_VERSION` takes §2.7's literal. `deny_unknown_fields` stays in both directions, and comparison stays `==`.
- Fixtures, read by both the Rust and TypeScript fixture tests:
  - a new `v0-viewport_query-request-with-columns.json`, whose declared order differs from the file's;
  - `"columns": null` on every existing `viewport_query` request fixture;
  - `projectable` on every schema row of every `describe` response fixture;
  - one error fixture per new code, seven in all.
- `SKP-V0.md`:
  - A new numbered section, "Attribute projection on `viewport_query`", after the last section at merge (§9 if none is added first). It is laid out as §7 is: version, wire shape, contract, refusal table, pre-lease admission, data plane (empty diff).
  - A §8 entry giving the version's full field set.
  - Version notes in §4 items 1, 3, 8 and 13.
  - A dated note under §7.3 recording this literal's namespace change as ADR-021's Note 2026-09-24 states it.
  - Nothing earlier is rewritten.

### 2.2 `kernel`

- `SkpHost::viewport_query` keeps its order: version, dataset, live generation, then `build_viewport_query`. Projection admission runs inside `build_viewport_query`, before `open_engine_stream` leases and before `tickets.mint` (ADR-023 §3; ADR-019).
- **Its position relative to filter admission: O3.**
- **Projection admission order:**
  1. `Some([])` → `skp.projection_empty_list`, minted in the kernel (F4) and never read as `null` (entry 79 item (1)).
  2. The count ceiling, before any name is resolved.
  3. Names, in declared order (the reserved `id`: O8).
  4. Per-column rules, in declared order: geometry, identity, duplicate, type.
  5. The first failure is reported.
- `build_viewport_query`'s error type carries the projection refusals beside `PredicateAdmitError`'s two kinds. The mapping is exhaustive, with no wildcard.
- `projection_error_of(&ProjectionError) -> SkpError` is one exhaustive `match` with no wildcard (the `filter_error_of` precedent):

  | Code | Fields |
  |---|---|
  | `skp.projection_column_unknown` | `column`, `known_columns` |
  | `skp.projection_type_not_admitted` | `column`, `arrow_type`, `detail` |
  | `skp.projection_column_is_geometry` | `column` |
  | `skp.projection_column_is_identity` | `column`, `id_column` |
  | `skp.projection_column_duplicated` | `column` |
  | `skp.projection_too_many_columns` | `limit`, `saw` |

  - `known_columns` is comma-joined in the `candidate_columns` form. A name that contains a comma is omitted, and the Display states that (round 17 item 4, stop item 8).
  - `arrow_type` is `describe.schema[].arrow_type`'s string, which is the source type.
- `open_engine_stream` takes an optional admitted projection. With one present it calls the engine's live entry point (§2.3); `columns: null` calls `stream_with_cancel` unchanged; the raw path passes none (F5).
- `describe_dataset` fills `projectable` from `admit_projection_column` (§2.3). It is pure and in-memory (ADR-006 class 1).
- **Publish (round 17 item 3; ADR-023 §2's sentence of 2026-09-24).** `kernel/src/publish`'s preflight enforces ADR-017 §4's type list as a named bundle-format restriction.
  - Every projected column whose **source** type is `Float32` or any `Dictionary`, whatever its value type, is refused at preflight, before any write.
  - The refusal is `publish.engine` with the `AttributeUnpublishable` Display and the detail that `admit_attribute_type`'s `Float32` and `Dictionary` arms format at c16f41d from that source type, byte for byte, until B3's `bundle_version`-2 ADR decides.
  - The restriction refuses and admits nothing; admission stays one function.
  - Its position among publish's other refusals, and the ceiling name in publish's count refusal: O1.

### 2.3 `engine`

- **`attributes.rs`: the one gate.**
  - `admit_attribute_type` implements ADR-023 §2 as amended:
    - `Float32` is admitted and emitted as `Float32`, never widened.
    - `Dictionary(k, v)` is admitted exactly when `v` is admitted, and is emitted as `v`.
  - It returns the emitted field type.
  - The refusal detail for every type still refused: O2.
  - The module doc is rewritten to the amended rule. It names publish's bundle-format restriction as the bundle format's, not the gate's.
- **Typed refusals.**
  - A `ProjectionError` enum with six variants is returned by `admit_projection` and `resolve_projection`.
  - `From<ProjectionError> for EngineError` serves publish (texts: O1, O2).
  - `projection_column_is_identity` fires for the identity's source column and for the reserved `id`. Its Display states whichever of the two facts applies.
- **Per-column admission.** `admit_projection_column(field, geometry_column, identity_column)` holds geometry, identity and type. Both `admit_projection` and `projectable` use it (round 17 item 4, stop item 4).
  - `projectable` states **live** admission. A projectable `Float32` or dictionary column is still refused at publish (§2.2).
- **The constant.** `MAX_PUBLISHED_ATTRIBUTES` is renamed `MAX_PROJECTED_ATTRIBUTES`: one declared number (32) bounding both surfaces (ADR-023 §4). The effect on publish's text is O1.
- **The projection type.** `PublishedProjection` is renamed `AdmittedProjection`, with its single constructor unchanged. The `engine/src/lib.rs` re-export follows.
- **The live entry point.** `Dataset::stream_projected_with_cancel(q, &AdmittedProjection, cancel)` runs `stream_inner` with the viewport `StreamPlan` (`IndexUse::Off`, `Unordered`, the default policy, `report_bounds: false`) and `BatchEnvelope::with_attributes`.
  - Its product caller is `kernel::open_engine_stream`.
  - Assembly stays `TaggedBatch::assemble`.
- **The chunk loop.**
  - A dictionary column is decoded to its value type (`arrow::compute::cast`). This is a named copy (ADR-004).
  - The decode happens before the declared-type check, so no index reaches the envelope.
  - `attr_row_bytes` gains a `Float32` arm (4 bytes).
- **`flush`, the retention rule** (condition (3); §7).
  - A single-run slice is kept unless the buffers it retains exceed `MAX_ATTRIBUTE_RETENTION_FACTOR` × its own memory. Past that it is compacted by one copy, decided after the cut.
  - Emitted IPC bytes are identical either way (H3).
- **`predicate.rs`** (round 17 item 3; ADR-021 Note 2026-09-24):
  - `Float32` is filterable: `duckdb_type_name` maps `Float32` → `REAL`.
  - Dictionary-encoded columns are excluded from the namespace by name, whatever their value type. They are left out of the admitted namespace. A predicate that names one is refused `FilterError::ColumnNotFilterable { column, reason }`, which becomes `skp.filter_column_not_filterable`, with a `reason` stating that the column is dictionary-encoded. No filter code is added.
  - F1: `duckdb_type_name` covers every type the namespace admits, and `bind_admit`'s `expect` is replaced by a typed refusal (its variant: O4).
  - A filter refusal's `reason` for every type still refused stays byte-identical (F7), except for dictionary-encoded columns, whose reason is the one ruled above.
  - A later widening of ADR-023 §2 widens this namespace by reference (PLAN node `b1-engine-kernel-half`, from PR #113's architect gate).
- **`build_sql`:** unchanged. Projected names come only from the resident schema and are quoted by `quote_ident`.

### 2.4 `frontends/shell`: the wire mirror only

- `src/skp/types.ts`: the literal, `columns: string[] | null` on `ViewportQueryRequest`, and `projectable: boolean` on `FieldInfo`. `SkpError.code` is a `string`, so no code list is added.
- `src/skp/client.ts::viewportQuery` sends `columns: null` and gains no parameter. Its consumer is the shell half (caller rule). Its three callers are unchanged.
- `client.test.ts`'s expected request objects and literal follow. `fixtures.test.ts` covers the new keys.
- `src/style/document.ts`: the module doc's statement, in its Literal-only bullet, that `viewport_query` carries no attributes is corrected to the new fact: the wire can carry a projection, and this shell requests none (condition (1); round 17 item 4, stop item 5). `StyleDocumentV0` stays literal-only.
- `src-tauri` needs a recompile only.

### 2.5 Data plane

`protocol/data-plane/` has an empty diff (Doc 2 §2). The widening lives inside the Arrow IPC payload; `attribute_columns` rides the schema metadata. No attribute value crosses the control plane.

### 2.6 Documents

No ADR is edited. SKP-V0 changes as in §2.1. The constant's row in `engine/README.md` and the doc comment in `kernel/src/publish/ceilings.rs` follow the constant. Nothing is written to `docs/08`.

### 2.7 The wire literal (RULED 2026-09-24 (night), item (2); C2)

- `main` is `skp/0.4` (`crs-unit-fact-and-bounds`). The watcher takes `skp/0.5` (ADR-035 Decision 6). **B1 takes `skp/0.6`** if no other wire change merges between them; otherwise B1 renumbers before its PR to the literal after `main`'s.
- The literal is minted once, on B1's branch, and freezes at merge. Both sides' fixtures change in the same commit (SKP-V0 §4 item 13 (iii), (iv)).

### 2.8 Composition with the watcher

- `crs.unit` is on `main`.
- The watcher's literal adds these (ADR-035 Decisions 2, 4 and 6; RULED 2026-09-24, the watcher sight):
  - `describe`'s coverage and checks facts, and its ended state and reason;
  - the session member of the `open_dataset` response;
  - the `dataset_session_ended` event;
  - `engine.source_coverage_lost` through `error_of`.
- B1 changes none of them. It adds only `columns` and `projectable`, and no arm to `error_of`.
- Conflicts are expected in `SKP_VERSION` (both sides), `commands.rs`, `describe_dataset`, `types.ts`, `client.test.ts`, the shared fixtures, and SKP-V0 §8. They are resolved by carrying every piece's fields.
- §8 entries follow merge order, and B1's lists only B1's fields.

### 2.9 Seams: the consumer's actual interface, and the proof from the real shape

| Seam | Interface at c16f41d | Proof |
|---|---|---|
| shell → JSON → kernel | `client.ts::viewportQuery`; serde `ViewportQueryRequest` (`deny_unknown_fields`) | K-1 deserializes the committed fixture that `fixtures.test.ts` also reads; S-2 |
| kernel → engine | `Dataset::resolve_projection`, `stream_projected_with_cancel`, `ProjectionError` | K-1, K-2 |
| engine → data plane → consumer | `TaggedBatch::write_ipc_into` into the existing frame | K-1 decodes real frames; K-6 |
| gate → filter namespace | `namespace_admit`, `duckdb_type_name`, `bind_admit` | E-18, E-19, E-20 |
| gate → publish | `preflight_pinless_parts` via `resolve_projection`; `From<EngineError> for PublishError` | K-9; publish and determinism suites unchanged |
| kernel → shell `describe` | `FieldInfo` in both mirrors | P-3, S-1, K-5 |

- **Caller rule.** The non-null `columns` path and `projectable` have no product caller until B1's shell half. They land under round 8's exemption, pre-committed by round 17 item 4 (the draft's stop item 3).
  - The consumer is B1's shell half: the hover readout (ADR-023 §6), `match` (§7) and the panel consuming `projectable`.
  - Its gate is `shell-redesign-map-studio`. The PR body and PLAN name both (its node id: O7).
  - There is no option on `StreamParams` and no instrument accessor.

## §3. Fixtures: outcomes declared in advance

Every fixture is generated in-test through `engine::fixture` (feature `fixture`) and hash-verified before and after each run. A new `AttributeMode` variant writes, in file order: `zone` (text, with NULLs), `area` (`Float64`), `f32` (`Float32`), `i64` (`Int64`), `flag` (`Boolean`), `d32` (`Date32`), `text` (text, values of about 1 KiB).

| Fixture | Request | Predicted outcome |
|---|---|---|
| native `id` | `[area, zone]` | schema `[id, geometry, area, zone]`; projected fields nullable; NULLs travel as NULL |
| same | `columns: null` | today's frames; no `attribute_columns` |
| same | `[]` | `skp.projection_empty_list`, pre-lease, pre-mint |
| same | 33 unknown names | `skp.projection_too_many_columns` {32, 33} |
| same | `[nope]` | `skp.projection_column_unknown` with `known_columns` |
| same | `[geometry]` / `[id]` / `[zone, zone]` / `[d32]` | geometry / identity / duplicated / type_not_admitted (`Date32`) |
| `IdentityMode::ForeignKeyColumn` (`parcel_key`) | `[parcel_key]`; `[id]` | identity (`id_column` = `parcel_key`); `[id]`: O8 |
| native `id` | `[f32]` | emitted `Float32`, bit-equal to the source |
| same, filter `f32 > 0` | `columns: null` | admitted; exactly the rows whose `f32` exceeds 0 |
| same, default policy | `[text]` | every emitted batch within the retention bound (E-14) |
| dictionary column | per H2 | reachable: emitted as the value type. Unreachable: proven over an arrow-rs `DictionaryArray` through the real chunk-loop function and recorded as unreachable from `read_parquet` (round 17 item 4, stop item 6) |

## §4. Tests, one mutation per new test

Each mutation makes its test fail by name; each is verified mechanically as a pre-gate self-check.

**Protocol**
- **P-1** `viewport_query_request_carries_columns_as_explicit_null_when_absent`. Mutation: `skip_serializing_if` on `columns`.
- **P-2** `viewport_query_request_with_columns_fixture_reads_in_declared_order`. Mutation: `#[serde(rename = "projection")]`.
- **P-3** `describe_fixtures_carry_projectable_on_every_schema_row`. Mutation: `skip_serializing_if` on a false `projectable`.
- **P-4** The existing literal assertions on both sides, including `client.test.ts`'s. Mutation: revert the literal.

**Engine**
- **E-1** `float32_is_admitted_as_its_own_type_and_never_widened`. Mutation: emit `Float64`.
- **E-2** `dictionary_is_admitted_under_its_value_types_rule_and_emitted_as_the_value_type`. `Dict(Int32, Utf8)` is admitted as `Utf8`; `Dict(Int8, Date32)` is refused. Mutation: admit every `Dictionary`.
- **E-3** `every_type_still_refused_is_refused_by_the_gate`: Binary, Date32, Decimal128, Timestamp, List, Struct. Mutation: admit `Date32`. (Detail text: O2.)
- **E-4** `each_projection_refusal_is_its_own_variant`. Mutation: the duplicate arm returns `ColumnIsIdentity`.
- **E-5** `the_count_ceiling_is_checked_before_any_name_is_resolved`. Mutation: count after resolution.
- **E-6** `names_resolve_before_per_column_rules_in_declared_order`. Mutation: interleave.
- **E-7** `projectable_is_the_per_column_admission`. Mutation: `projectable` from `admit_attribute_type` alone.
- **E-8** `a_live_projected_stream_emits_id_geometry_then_the_declared_columns` (`engine/tests/live_projection.rs`). Values are checked row by row against a DuckDB read keyed on `id`, NULLs included. Mutation: `resolve_projection` sorts by file order.
- **E-9** `projection_leaves_frame_crs_axis_and_identity_metadata_byte_identical`. Mutation: `with_attributes` drops `axis_normalization`.
- **E-11** `float32_costs_four_bytes_in_the_estimate`. Mutation: remove the arm.
- **E-12** `a_dictionary_chunk_is_decoded_before_the_declared_type_check_and_no_index_reaches_the_envelope`. Mutation: skip the decode.
- **E-14** `every_emitted_attribute_column_retains_at_most_the_declared_factor`. Mutation: remove compaction.
- **E-15** `a_compacted_and_a_sliced_single_run_serialize_to_identical_ipc_bytes`. Mutation: compact the whole chunk.
- **E-17** (condition (4)) `the_where_composition_matrix_matches_the_declared_rule_exactly` re-pinned projection-aware: 16 cells (projection none or `[zone]`). A projected twin of `the_predicate_text_rides_verbatim_never_rewritten_or_case_folded`, named `the_projected_select_prefix_places_declared_columns_after_geometry_and_leaves_where_verbatim`. `BBOX_COND` and every `WHERE`/`LIMIT` suffix stay byte-identical. Mutation: `build_sql` emits projected columns before geometry.
- **E-18** `a_file_with_a_float32_column_binds_every_predicate_without_panicking`. Mutation: remove the `REAL` arm. Also `a_float32_column_is_filterable`. Mutation: leave `Float32` out of the namespace.
- **E-19** `a_dictionary_encoded_column_is_refused_as_not_filterable_with_a_reason_naming_the_encoding`. Mutation: remove the exclusion. (If H2 holds: O6.)
- **E-20** `how_a_float32_column_compares_with_a_numeric_literal_is_pinned` (from PR #113's architect gate, recorded on the PLAN node): `f32 = 0.1` and `f32 > 0.1` over declared stored values, asserted against the observed row sets (H5). Mutation: the fixture writes `f32` as `Float64` with the same values.

**Changed existing tests.** The admissible-set unit test in `engine/src/attributes.rs`'s `tests` module moves `Float32` and `Dict(_, Utf8)` to admitted, and is renamed for the live admitted set. Publish's refusal of them is K-9's.

**Kernel** (`kernel/tests/skp_projection.rs`)
- **K-1, the seam test.** `a_projected_viewport_query_from_the_wire_fixture_streams_the_declared_columns`:
  1. `Catalog::open` under the handle in `v0-viewport_query-request-with-columns.json`, and `SkpHost::new` (F12);
  2. the fixture's committed bytes deserialized into `ViewportQueryRequest` and passed to `viewport_query`;
  3. the ticket redeemed over the real data-plane WebSocket (`skp_admission.rs`'s harness);
  4. the IPC decoded, and schema and values checked against an oracle.

  Mutation: `build_viewport_query` ignores `req.columns`.
- **K-2** `every_projection_refusal_is_synchronous_typed_and_pre_mint`: the seven codes with their exact field keys. After each refusal, `StreamRegistry::cancel_all_for_dataset` returns 0 and `Dataset::connections().leases_issued()` is unchanged (F11). Mutation: admit after `open_engine_stream`.
- **K-3** `columns_empty_list_is_refused_never_read_as_null`. Mutation: map `Some([])` to `None`.
- **K-4** `projection_error_of_maps_each_variant_to_its_own_code`. Mutation: two variants share a code.
- **K-5** `describe_projectable_agrees_with_viewport_query_admission_for_every_column`, over the native, mapped and session-ordinal fixtures. Mutation: as E-7.
- **K-6** The `wire_bytes_invariant` projection case, through the SKP ticket path. Mutation: `attribute_columns` written only while tracing.
- **K-7** `a_projection_composes_with_a_filter`. Mutation: the projection is dropped when a filter is present.
- **K-9** `publish_refuses_float32_and_dictionary_columns_at_preflight_as_a_bundle_format_restriction_with_todays_text`. Expected strings are byte-copied from `admit_attribute_type`'s `Float32` and `Dictionary` arms at c16f41d, as publish renders them. Nothing is written before the refusal. Mutation: remove the restriction. (Dictionary case if H2 holds: O6.)

**Shell**
- **S-1** `fixtures.test.ts` covers `columns` and `projectable`. Mutation: drop `projectable` from the declared key set.
- **S-2** In `client.test.ts`, `viewportQuery` sends `columns: null`, never omitted. Mutation: omit the key.
- The existing shell E2E suite runs on the branch, unchanged and green.

**Condition (1)'s proof** is the corrected sentence in `document.ts`, which the reviewer reads in the diff.

## §5. P0 · predictions · declared unchanged · invalidators · falsification

**P0** is a set of read-only probes on the branch, each naming the pinned crate version from `Cargo.lock` (round 15 (c)).
- **H1.** DuckDB reports parquet `FLOAT` as Arrow `Float32` in `Dataset::file_schema`. *Predicted yes.*
- **H2.** `read_parquet` never reports an Arrow `Dictionary`. *Predicted: unreachable.*
- **H3.** The pinned arrow-rs exposes a slice's own memory beside `get_buffer_memory_size`, and its IPC writer emits identical bytes for a slice and its compacted copy. *Predicted yes.*
- **H4.** DuckDB orders ENUM values by declared position under `<` and `>`. *Predicted yes.* It is round 17 item 3's stated reason. A false H4: O5.
- **H5.** DuckDB compares a `REAL` column with a decimal literal after casting both to `REAL`, so a stored `0.1f` equals the literal `0.1`. *Predicted yes.*

A wrong prediction is a class-2 result, never edited.

**Declared unchanged:**
- `columns: null` frames.
- The frame tag, `crs`, `crs_source`, `axis_order`, `axis_normalization` and identity metadata.
- `id` at column 0 (non-null) and geometry at column 1.
- The `WHERE` composition rule and the duckdb-expr/0 dialect.
- Credit, chunking, the `MAX_*` batch constants, and cancellation.
- Every publish output byte and every publish refusal code.
- The text of publish's `Float32` and dictionary refusals (round 17 item 3). Every other publish refusal text and precedence: O1.
- Every filter refusal text for a type still refused, except dictionary-encoded columns (round 17 item 3).
- The raw `StreamParams` path, `protocol/data-plane/`, every field of the watcher's, and MCP.

**Invalidators** (the piece stops and returns to the architect):
- H3 false.
- A publish determinism test changes, or a publish refusal test changes beyond round 17 item 3 and O1's ruling.
- A data-plane diff is needed.
- A projection refusal cannot be made pre-lease.
- A second batch constructor is needed.

A change in merge order renumbers the literal (§2.7); it does not invalidate the piece.

**Falsification:** the live projection cannot share `admit_attribute_type` with the filter and publish paths without a second admission policy beyond publish's bundle-format restriction.

## §6. Instruments

Every instrument is an assertion (a typed outcome, a schema, a byte comparison, or a buffer-size inequality over emitted arrays). None is a measurement, and there is no `docs/08` figure. No counter or accessor is added. `attribute_concatenations()` stays engine-API-only (ADR-004 Amendment 4).

## §7. Declared values and ceilings (ADR-010 rule 6)

- **`MAX_PROJECTED_ATTRIBUTES = 32`** bounds one live query's projection and one bundle's: one number (ADR-023 §4).
- **`MAX_ATTRIBUTE_RETENTION_FACTOR = 2`** (condition (3)). The attribute buffers an emitted batch retains are at most 2 × its own slice memory (E-14).
  - Producer-resident payload is then bounded by `MAX_QUEUED_BATCHES + 1` batches under that factor, plus DuckDB's current chunk (uncounted, as today).
  - `MAX_QUEUED_BATCHES`'s doc comment, and `flush`'s comment on slice retention, are rewritten to say so. This is a declared bound, not a measurement.
- **Unchanged:** `MAX_BATCH_BYTES`, `TARGET_BATCH_BYTES`, `FIRST_TARGET_BATCH_BYTES`, `MIN_BATCH_BYTES`, `MAX_ROWS_PER_BATCH`, `MAX_QUEUED_BATCHES`, and the data plane's `MAX_INFLIGHT_BATCHES` (F15).
- No wire list-size ceiling is added: the count check runs first. `known_columns` is bounded by the file's column count.
- **`docs/08` rows touched (none measured, none claimed, none added):**
  - First pixels: a projection spends first-batch bytes on attributes.
  - Memory: the retention bound above.
  - Cancellation: unchanged; a dictionary decode is one bounded per-chunk step.
  - Cold open: unchanged.
  - VRAM and frame time: the shell half's.

## §8. Block-on-sight (each checked separately)

1. A projection refusal as a data-plane terminal, or taken after a lease or mint (ADR-023 §11 item 1).
2. A wildcard or `String`-flattened arm in `projection_error_of`, or a code outside the seven (§11 item 2; ADR-021 decision 8).
3. A projected column admitted by any gate other than `admit_attribute_type` / `admit_projection_column` (§11 item 3).
4. A literal that is not the one after `main`'s at merge, or a bump without both fixture sides in the same commit (§11 item 8).
5. Any diff under `protocol/data-plane/`, JSON in a frame, or an attribute value on the control plane (Doc 2 §8 items 1–2; B-5).
6. "zero-copy" anywhere (Doc 2 §8 item 3).
7. A projected column at or before index 1, a nullable `id`, a second batch constructor, or assembly that skips the declared-field check (Doc 2 §8 items 4–5).
8. An instrument field on SKP or a frame (Doc 2 §8 item 6).
9. A batch-boundary estimate that reads an allocation size or a NULL slot (Doc 2 §8 item 7). The retention decision, taken after the cut, is exempt only for that reason.
10. A credit or chunking change; any performance number (B-7; Doc 2 §8 items 8–9).
11. `columns: []` read as `null`, or the empty-list check in the shared gate (F4).
12. `duckdb_type_name` missing a type the filter namespace admits, or any `expect` left on that path (F1).
13. `Float32` widened anywhere, or a dictionary index reaching the envelope, the wire or a fixture.
14. A `WHERE`/`LIMIT` assertion in `filter_composition` weakened or rewritten (condition (4)).
15. A publish or filter observable change beyond round 17 item 3 and the rulings on O1 and O2.
16. A `pub` item, option or code path with no product caller outside round 17 item 4's pre-commitment.
17. Any display surface or visible string in the shell, or any sentence describing B1 or the workflow as complete.
18. A B1 change to a field, value or error arm of the watcher's or crs-unit's.
19. An engine message stating another module's consequence.
20. A seam test written to an imagined interface instead of the committed fixture and the real data plane (the seam rule).
21. Any edit to ADR-017, ADR-021 or ADR-023 in this piece.
22. A publish refusal of a `Float32` or dictionary column that differs by one byte from today's text (round 17 item 3).
23. A dictionary-encoded column admitted to the filter namespace, or refused with any code other than `skp.filter_column_not_filterable` (round 17 item 3).

## §9. Gates

- **Architect** (full gating: a wire change, a data-plane-adjacent change, ADR-bound conditions): §8 item by item; ADR-023 conditions (1)–(4); the seam and caller rules against §2.9; verbatim quotes and discharge claims resolved.
- **Reviewer:**
  - the full diff, with `git diff --stat origin/main...HEAD -- protocol/data-plane/` shown empty;
  - condition (4);
  - every discharge claim resolved;
  - hashes recomputed for any pin.
- **Suites, green before either gate:**
  - `cargo test --workspace` (engine with `fixture`), `cargo fmt --check`, `clippy`;
  - the shell's `vitest`, `tsc --noEmit` and E2E suite;
  - `node --test` over the scripts suite;
  - `verify:cites` and `verify:quotes` (a floor);
  - the licence audit (no new crate or package);
  - every §4 mutation.
- **Operator:** none in this half. DRAFT-3's B1 E2E and the sight of the new strings belong to the shell half. ADR-023's acceptance, with condition (2)'s corrigendum and F6's notes, comes at B1's close.
- **Merge order:** after the watcher; the literal is computed at merge (§2.7).

## §10. Amendments

*(Opens empty; append-only.)*

### Amendment 1 — 2026-09-25, before any code (no outcome seen): OPEN markers O1–O8 resolved by RULED 2026-09-25, question round 22, item 2

Class 5, a scope settled on a ruling. The ruling, byte-copied by script from `DECISIONS-PENDING.md`'s RULED block: "All eight as rec. (Recommended)"

Each OPEN marker O1–O8 resolves to its recommendation as written in `state/consults/2026-09-25-b1-prereg-revision.md`, §3 (the architect's stop list), which binds this piece from this amendment. O7's node is `b1-shell-half` (PLAN.yaml), the consumer §2.9's caller rule names. The Header's OPEN-marker line no longer holds any point back.

### Amendment 2 — 2026-09-26, post-result: §5 P0, all five hypotheses

Class 1 (post-result). Made after the P0 outcomes below were seen.

P0 ran as read-only probes on branch `cut/b1-engine-projection` at commit 86d6b4b (`main`'s tip at
cut), never committed (scratch, removed after the run; no engine or kernel source touched).
`Cargo.lock`-pinned crate versions: `duckdb` 1.10505.0, `arrow`/`arrow-ipc`/`arrow-array` 58.4.0.

- **H1 — confirmed (predicted yes).** `ArrowWriter` (parquet 58) wrote one `Float32` column;
  `duckdb::Connection::prepare("SELECT * FROM read_parquet(?) LIMIT 0").query_arrow(..)` reported
  its Arrow field type as `Float32`.
- **H2 — confirmed (predicted unreachable).** A 2000-row, 4-value `Utf8` column written with
  `WriterProperties::builder().set_dictionary_enabled(true)` (the shape most likely to be
  physically dictionary-encoded) was reported by the same `read_parquet` probe as `Utf8`, never
  `Dictionary(_, _)`.
- **H3 — confirmed (predicted yes), both clauses.**
  - First clause (a slice's own memory beside `get_buffer_memory_size`): read directly from the
    pinned crate's own vendored source (not a path in this tree), not run —
    `arrow-data` 58.4.0's `src/data.rs`, `ArrayData::get_buffer_memory_size` beside
    `ArrayData::get_slice_memory_size` (around lines 481 and 507 of that crate's file), the
    latter's doc comment giving the worked example this hypothesis names.
  - Second clause (the IPC writer emits identical bytes for a slice and its compacted copy): run —
    an `Int64Array` of 1000 values, sliced to a 20-element run at offset 10, and a second array
    freshly built from exactly those 20 values, each written through
    `arrow::ipc::writer::StreamWriter` into its own buffer. Byte-for-byte identical (584 bytes
    each).
  - H3 is not false; no invalidator fires.
- **H4 — confirmed (predicted yes).** `CREATE TYPE zone_enum AS ENUM ('charlie', 'alpha', 'bravo')`
  (declared order charlie=0, alpha=1, bravo=2); `'charlie'::zone_enum < 'alpha'::zone_enum` was
  `true` — declared-position order, not lexical order (under which `'alpha' < 'charlie'` would
  hold instead).
- **H5 — confirmed (predicted yes).** A `REAL` column holding `CAST(0.1 AS REAL)`: `f32 = 0.1` was
  `true` and `f32 > 0.1` was `false` — DuckDB casts the literal to `REAL` for the comparison rather
  than widening the column to `DOUBLE`.

No class-2 result. No §5 invalidator fires from P0.

### Amendment 3 — 2026-09-27, post-result: §2.3's retention rule, and §4's remaining tests

Class 1 (post-result). Made after every test named below was seen green, on commits `eacdd0d`
(engine) and `b7225db` (kernel) on this branch.

- §2.3's retention rule (condition (3); §7; `MAX_ATTRIBUTE_RETENTION_FACTOR = 2`) lands in
  `engine/src/stream.rs`, discharged by `every_emitted_attribute_column_retains_at_most_the_
  declared_factor` (E-14) and `a_compacted_and_a_sliced_single_run_serialize_to_identical_ipc_
  bytes` (E-15) — unit tests against the retention decision directly, not through an IPC round
  trip (which always yields compact buffers and would make the property vacuous).
- E-17's 16-cell re-pin and its projected twin
  (`the_projected_select_prefix_places_declared_columns_after_geometry_and_leaves_where_verbatim`)
  land in `engine/src/stream.rs`'s existing `filter_composition` unit-test module (§0's own read
  list already names it), not in `engine/tests/live_projection.rs`.
- A new `fixture::AttributeMode::MultiType` (F13) writes `zone, area, f32, i64, flag, d32, text`,
  each a pure function of `(seed, id)` (`zone_for`'s own construction, restated).
- `engine/tests/live_projection.rs` (new) discharges E-8
  (`a_live_projected_stream_emits_id_geometry_then_the_declared_columns`), E-9
  (`projection_leaves_frame_crs_axis_and_identity_metadata_byte_identical`), the live half of E-18
  (`a_file_with_a_float32_column_binds_every_predicate_without_panicking`) and E-20
  (`how_a_float32_column_compares_with_a_numeric_literal_is_pinned`).
- `engine/src/predicate.rs`'s new `filterable_column_type` (extracted from `namespace_admit`,
  behaviour-preserving) discharges E-19
  (`a_dictionary_encoded_column_is_refused_as_not_filterable_with_a_reason_naming_the_encoding`,
  over a constructed `Field`, per O6/H2) and the namespace half of E-18
  (`a_float32_column_is_filterable`).
- `kernel/tests/skp_projection.rs` (new) discharges K-1
  (`a_projected_viewport_query_from_the_wire_fixture_streams_the_declared_columns`), K-2/K-3/K-4
  (`every_projection_refusal_is_synchronous_typed_and_pre_mint`,
  `columns_empty_list_is_refused_never_read_as_null` — K-4's seven-distinct-codes claim is the
  first test's own closing assertion), K-5
  (`describe_projectable_agrees_with_viewport_query_admission_for_every_column`), K-7
  (`a_projection_composes_with_a_filter`) and K-9's live Float32 sub-case
  (`publish_refuses_float32_and_dictionary_columns_at_preflight_as_a_bundle_format_restriction_
  with_todays_text`).
- `kernel/tests/wire_bytes_invariant.rs` gains K-6
  (`wire_bytes_invariant_holds_for_the_projected_ticket_path_case_too`).
- `kernel/src/publish/mod.rs` gains K-9's dictionary sub-case (unreachable live, O6) as
  `admit_bundle_format_refuses_a_dictionary_column_with_todays_admit_attribute_type_text`, beside
  a same-pattern Float32 unit test.
- Suites this session: `cargo test -p spatial-engine --features fixture` (full, green);
  `cargo test -p spatial-kernel` (full, including `--lib`'s 123, green);
  `node --test scripts/plan/*.test.mjs scripts/hooks/*.test.mjs` (311 passed); `verify:cites` and
  `verify:quotes` (both PASS); `git diff --stat origin/main...HEAD -- protocol/data-plane/`
  (empty). `cargo fmt --check`, the shell's `vitest` and the licence audit remain blocked by this
  worktree's pre-existing environment gaps (rustfmt-baseline drift on this machine; `renderer/
  bundle-viewer` and three sibling JS packages missing `node_modules`) — unrelated to this piece's
  diff, recorded rather than fixed, on the prior worker's same disclosure. `tsc --noEmit` fails on
  four shell test files (`AdmissionPanel.test.ts`, `admitDataset.test.ts`,
  `App.lateResult.test.tsx`, `App.test.ts`) missing `FieldInfo.projectable` on a hand-built
  literal — pre-existing since `6cd1764`, in `b1-shell-half`'s own scope, not this piece's.

### Amendment 4 — 2026-09-27, post-result: §4's remaining tests mutation-verified; the shell
typecheck fix

Class 1 (post-result). Made after every mutation below was observed and reverted, on commits
`26c9c87` (shell), `e49f133` (engine/protocol) and `ac08761` (kernel) on this branch.

- The shell typecheck gap Amendment 3 disclosed is discharged at `26c9c87`: `projectable: false` on
  the four hand-built `FieldInfo` literals `tsc --noEmit` named, each fixture naming the dataset's
  identity column, which `admit_projection_column` (§2.3) always refuses. `npx tsc --noEmit`: 0
  errors.
- Each test below now carries its own `// RECORDED MUTATION:` comment beside it, naming the
  mutation applied to the code under test, the observed by-name failure, and the revert — engine
  and protocol tests at `e49f133`, kernel tests at `ac08761`: E-8, E-9, E-18 (the live half), E-20,
  the F14-renamed admissible-set test, the nullable-projection test
  (`every_admitted_projection_column_comes_back_nullable_whatever_the_source_said`), the
  non-dictionary pass-through test
  (`a_non_dictionary_chunk_column_passes_through_the_decode_step_unchanged`), the seven-fixture
  round-trip test (`every_new_projection_error_fixture_round_trips`); K-1, K-4 (the closing
  `codes.len() == 7` assertion inside `every_projection_refusal_is_synchronous_typed_and_pre_mint`),
  K-5, K-6, K-7, K-9's live sub-case, K-9's dictionary unit test. No test cited a mutation it could
  not be made to fail by.
- Suites this session: `cargo test --workspace --features spatial-engine/fixture` (755 passed, 0
  failed, 40 ignored, full workspace including `engine`/`kernel`); shell `npx tsc --noEmit` (0
  errors); shell `npx vitest run` (1087 passed, 3 failed, 71/72 files); `node --test
  scripts/plan/*.test.mjs scripts/hooks/*.test.mjs` (311 passed); `verify:cites` and
  `verify:quotes` (both PASS); `git diff --stat origin/main...HEAD -- protocol/data-plane/`
  (empty).
- The `renderer/bundle-viewer` `node_modules` gap Amendment 3 disclosed is closed this session by
  `npm ci` there (and its own `npm run build`, both un-committed): the 20 `src/notices/*` tests
  Amendment 3 counted as environmentally failing are now 37 tests, all passing. No `node_modules`
  or lockfile change is committed.
- **New finding, disclosed rather than fixed (out of this piece's named scope):** the shell's
  `src/console/renderTruth.test.ts` fails 3 of its fixture-round-trip cases (the three
  `v0-viewport_query-request*.json` fixtures) — its own hand-maintained `REQUEST_KEY_SETS.viewport_query`
  list was not updated for `columns` (§2.1). Unrelated to the `node_modules` gap: this test reads
  `protocol/skp/tests/data/` directly and would fail the same way with or without it.

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

### Amendment 6 — 2026-09-27, post-result: the closing record for record-correction round 1 (X1-X20)

Class 1 (post-result). References and hashes only (the record cap).

**Commits** (branch `cut/b1-engine-projection`, on top of Amendment 5 at `e3430d2`):
- `cf1c3c5` — X1-X5 (engine/src/attributes.rs, engine/src/predicate.rs).
- `5b0e1de` — X6-X7 (engine/src/stream.rs, engine/README.md).
- `5358ff6` — X4/X9/X14/X17/X18/X20 (kernel/src/skp.rs, kernel/src/publish/mod.rs, protocol/skp/SKP-V0.md, protocol/skp/src/v0/mod.rs, protocol/skp/tests/data/v0-error-projection_empty_list.json).
- `9348a40` — X1/X3/X8/X9/X11/X12/X13/X20 (protocol/skp/tests/data/v0-viewport_query-request-with-columns.json, protocol/skp/tests/fixtures.rs, frontends/shell/src/skp/__tests__/fixtures.test.ts, kernel/tests/skp_projection.rs, engine/tests/live_projection.rs).
- `9150cc0` — X20 (kernel/tests/session_end_event.rs, kernel/tests/session_reference.rs).

**Per-row test and mutation observed:**

| # | Test | Mutation observed failing, then reverted and passing |
|---|---|---|
| X1 | `a_filter_refusal_for_a_still_refused_type_keeps_todays_reason_byte_for_byte` (`kernel/tests/skp_projection.rs`) | restore the branch's placeholder final arm in `admit_attribute_type` |
| X2 | `names_resolve_before_per_column_rules_in_declared_order`; `the_multi_failure_order_is_count_then_names_then_per_column_rules` (`engine/src/attributes.rs`) | interleave (single-pass) `admit_projection` |
| X3 | `admit_projection_column_refuses_the_reserved_id_name_even_under_a_mapped_identity` (`engine/src/attributes.rs`) | remove the `ID_COLUMN` arm from `check_geometry_and_identity` — see note below on the row's own named K-5 case |
| X4 | `admit_bundle_format_refuses_a_dictionary_column_with_todays_admit_attribute_type_text` (`Dict(Int8, Date32)` case, `kernel/src/publish/mod.rs`) | `From` renders the final-arm text for every `TypeNotAdmitted` |
| X5 | `every_type_the_filter_namespace_admits_carries_a_surrogate` (`engine/src/predicate.rs`) | remove the `REAL` arm from `duckdb_type_name` |
| X6 | `publish_emits_a_nullable_byte_aligned_single_run_with_the_uncompacted_slices_ipc_bytes` (`engine/src/stream.rs`) | `single_run_retention` ignores `compact` and always compacts |
| X7 | `every_emitted_attribute_column_retains_at_most_the_declared_factor` (R-E2's two small runs, `engine/src/stream.rs`) | remove the `64 * buffer_count` term from the allowance |
| X8 | `a_projected_viewport_query_from_the_wire_fixture_streams_the_declared_columns` (`kernel/tests/skp_projection.rs`) | admission returns file order |
| X9 | `every_projection_refusal_matches_its_committed_error_fixture_shape` (`kernel/tests/skp_projection.rs`) | rename `known_columns` to `candidate_columns` in `projection_error_of` |
| X10 | (record only) | — cites `state/consults/2026-09-27-b1-engine-kernel-half-gate1-reviewer.md`'s "Mutations re-observed" section (E-6, E-15 and every X1-X20 new/changed test recorded above are the record this row asks for) |
| X11 | `a_projected_viewport_query_from_the_wire_fixture_streams_the_declared_columns` (oracle half) | the chunk loop slices each attribute run one row late |
| X12 | (fixture hashing, folded into X7/E-8/K-1's own tests) | — no separate mutation; a hash-check failure is its own proof |
| X13 | `a_live_projected_stream_emits_id_geometry_then_the_declared_columns` (`[f32]` case, `engine/tests/live_projection.rs`) | emit `Float64` at the live entry |
| X14 | (record only, `protocol/skp/SKP-V0.md` §4 item 13) | — resolved by `git show --stat 6cd1764` / `2963021`, cited in commit `5358ff6` |
| X15 | (record only) | — references `924dd3f` and the green `vitest run` (72 files, 1090 tests, `npx vitest run` under `frontends/shell`) |
| X16 | (record only) | — this table names every test on one line |
| X17 | (record only, wording) | — the reviewer/architect gates read the text at commit `5358ff6` |
| X18 | (record only, docs) | — `engine/README.md`, `protocol/skp/src/v0/mod.rs` at commit `5b0e1de` / `5358ff6` |
| X19 | (record only) | — this amendment's own superseded index, below |
| X20 | (record only, formatting) | — commit `9150cc0`; the `ProjectionRefusalCase` type alias in commit `9348a40` |

**Class 4 (a mutation added or corrected against Amendment 5's own table):**
- X1's test did not exist before this round; it is added, not corrected.
- X3's own K-5 case, as Amendment 5 row 5.6 names it, is not run — STOP, not improvised (see note below). The row's underlying fix is proved instead by X3's own new unit test.
- X7's two small-run cases are built from a raw `MutableBuffer`/`ArrayData`, not a `Builder` (`PrimitiveBuilder`'s own values buffer is a plain `Vec`, which carries no 64-byte rounding) — a corrected construction, not the row's own text.

**X3's STOP, stated once:** `engine/src/fixture.rs::i64_for`'s own doc: "a signed value that is neither `id` nor a simple affine function of it, so a projection test cannot mistake it for the identity column." `Catalog::open_cancellable` with `IdentityDeclaration::new("i64", ..)` over `AttributeMode::MultiType` throws `IdentityUnusable` at open time (observed, `kernel/tests/skp_projection.rs`, commit `9348a40`'s own diff comment). No dataset exists on which to compare `describe`'s `projectable` against `viewport_query`'s own admission. This is disclosed, not silently substituted.

**Suite counts** (this branch, at `9150cc0`, `CARGO_TARGET_DIR` local to this worktree). `cargo test --workspace --features spatial-engine/fixture` in one invocation did not complete in this session on this machine (no compile or test-binary activity was observed across repeated attempts, on a machine also running other resource-heavy processes); every crate and test binary was instead run individually, decomposed below, all green. Total across every row: **597 passed, 0 failed, 29 ignored** (every ignored case a named measurement/manual-fixture-generation harness):
- `cargo test -p spatial-engine --features fixture --lib`: 163 passed, 0 failed.
- `cargo test -p spatial-engine --features fixture --test live_projection --test filter_composition --test predicate_admission --test publish_stream --test row_group_seam`: 24 passed, 0 failed.
- `cargo test -p spatial-kernel --features spatial-engine/fixture --lib`: 123 passed, 0 failed.
- `cargo test -p spatial-kernel --features spatial-engine/fixture --test skp_projection`: 9 passed, 0 failed.
- `cargo test -p spatial-kernel --features spatial-engine/fixture --test session_end_event --test session_reference`: 8 passed, 0 failed.
- `cargo test -p spatial-kernel --features spatial-engine/fixture --test wire_bytes_invariant --test skp_admission --test skp_filter_cancellation --test typed_terminal_codes --test publish --test publish_cancellation --test session_generation --test skp_admission_remediation`: 70 passed, 2 ignored, 0 failed.
- `cargo test -p spatial-kernel --features spatial-engine/fixture --test cancel_rescore --test concurrency_in_situ --test describe_crs_unit --test first_batch_factorial --test import_layout_factorial --test import_layout_publish_determinism --test indexed_budgets --test manual_walkthrough_fixtures --test no_generation_in_persisted_artifacts --test permission_boundary --test post_check_cost_report --test publish_cli --test query_window_attribution --test regenerate_fixture --test slice_budgets --test source_watch_ordering --test source_watch_windows --test trace_spans --test verify_bundle`: 69 passed, 24 ignored, 0 failed (every ignored case is a measurement/manual-fixture-generation harness, named as such at each line, e.g. "release-only", "not part of the default suite").
- `cargo test -p spatial-kernel --features spatial-engine/fixture --test end_to_end --test scale_pass --test scale_pass_a6`: 10 passed, 3 ignored, 0 failed.
- `cargo test -p spatial-skp`: 47 passed, 0 failed.
- `cargo test -p spatial-data-plane -p spatial-renderer` (untouched by this piece; run for completeness): 74 passed, 0 failed.
- `npx tsc --noEmit` (`frontends/shell`): 0 errors.
- `npx vitest run` (`frontends/shell`): 72 files, 1090 tests, 0 failed.
- `node --test scripts/plan/*.test.mjs scripts/hooks/*.test.mjs`: 314 passed, 0 failed.
- `node scripts/plan/verify.mjs`, `queue.mjs --check`, `site.mjs --check`, `verify-cites.mjs`, `verify-quotes.mjs`, `verify-test-claims.mjs`: all PASS (advisories only, pre-existing, none in files this piece touches).
- `cargo fmt --check`: not discharged (Amendment 5's own disclosed baseline drift stands).

**Superseded index**
- Amendment 5, row 5.6's K-5 case for X3: not run; see the STOP note above.

### Amendment 7 — 2026-09-27, post-result: one correction to Amendment 6 — X4's mutation re-verified against a real test

Class 1 (post-result). References and hashes only (the record cap).

Amendment 6's X4 row cited `admit_bundle_format_refuses_a_dictionary_column_with_todays_admit_attribute_type_text` as X4's own mechanically-verified test; that test exercises `admit_bundle_format` directly, never `From<ProjectionError> for EngineError`, which is what X4's own mutation ("`From` renders the final-arm text for every `TypeNotAdmitted`") actually targets. Commit `7765b98` adds `engine/src/attributes.rs::tests::from_projection_error_renders_a_dictionary_sources_own_text_and_the_final_arm_otherwise`, a direct unit test on the `From` impl, and the mutation was re-verified against it: applied, observed failing by name, reverted, observed passing.

The same commit's own diff is additive only (`+56` lines, `0` deletions against the state after commit `9150cc0`), so nothing Amendment 6 or the commits before it discharged is disturbed.

Every mutation in Amendment 6's table for X1, X2, X3, X4 (corrected here), X5, X6, X7, X8, X9, X11 and X13 was independently re-applied, observed failing by name, reverted, and observed passing again in this same session, after Amendment 6 was filed — a stronger discharge than the reasoned RECORDED MUTATION comments alone. No row's own text, order or claim otherwise changes.

**Suite counts, re-confirmed after commit `7765b98`:**
- `cargo test -p spatial-engine --features fixture --lib --test live_projection --test filter_composition --test predicate_admission --test publish_stream --test row_group_seam`: 188 passed, 0 failed (the lib suite gained the one new test: 164, not 163).
- `cargo test -p spatial-kernel --features spatial-engine/fixture --test skp_projection --test session_end_event --test session_reference`: 17 passed, 0 failed.
- Every other suite count in Amendment 6 stands unchanged (this commit touches only `engine/src/attributes.rs`, additively).

**Superseded index**
- Amendment 6's suite-count line for `spatial-engine --lib` (163) is superseded by 164, above.

### Amendment 8 — 2026-09-27, post-result: the closing record for record-correction round 2 of 2 (gate 2)

Class 1 (post-result), with class rows where marked. Gate 2's reports, on `main` at `cec34b8`: `state/consults/gates/2026-09-27-b1-engine-kernel-half-gate2-architect.md` (cited here as A2) and `state/consults/gates/2026-09-27-b1-engine-kernel-half-gate2-reviewer.md` (R2). Code commits: `a472add`, `ca3d7ae` (C), `a30007c` and `d0631fe` (comments only); documentation: `fd9036f`. Each run below was applied at the named commit, run by the named test, recorded as observed, and reverted; a line is the failing assertion's line at the named commit.

| Row | Test | Commit | Observation of record |
|---|---|---|---|
| X1 | `a_filter_refusal_for_a_still_refused_type_keeps_todays_reason_byte_for_byte` | `273a79d` | `state/consults/gates/2026-09-27-b1-engine-kernel-half-gate2-reviewer.md:115 @ cec34b8 sha256:5d947f576b363a9aea1597784ce3e313f4669bd5191face591cf966e9d086b79` |
| X2 | `names_resolve_before_per_column_rules_in_declared_order`; `the_multi_failure_order_is_count_then_names_then_per_column_rules` | `273a79d` | `state/consults/gates/2026-09-27-b1-engine-kernel-half-gate2-reviewer.md:116 @ cec34b8 sha256:3081b1f2a7962fecef32df71b7f72504b3d0f0bf55c44aa6cfa47c3b14a508c6` |
| X2 | `publish_refuses_a_multi_failure_list_by_shared_admission_before_the_bundle_format_restriction` | `ca3d7ae` | the restriction run before `resolve_projection`, each name's type read from `file_schema()`: fails at line 845 of `kernel/tests/skp_projection.rs`. R2-B3's own form (`resolve_projection` after the `admit_bundle_format` loop), run at `a472add`: fails at line 848 of that file there; at `ca3d7ae` it does not compile (the loop reads the admitted projection) |
| X3 | `describe_projectable_agrees_with_viewport_query_admission_for_every_column` (the `i64` case) | `ca3d7ae` | the `ID_COLUMN` arm removed from `check_geometry_and_identity`: fails at line 595 of `kernel/tests/skp_projection.rs` |
| X3 | `admit_projection_column_refuses_the_reserved_id_name_even_under_a_mapped_identity` | `273a79d` | `state/consults/gates/2026-09-27-b1-engine-kernel-half-gate2-reviewer.md:118 @ cec34b8 sha256:a4e75d2a37afd35dff6e21ba51f0e2a571a72fa62b7660ebf1cbff84e39ae830` |
| X4 | `from_projection_error_renders_a_dictionary_sources_own_text_and_the_final_arm_otherwise` | `ca3d7ae` | `From` renders the final-arm text for every `TypeNotAdmitted`: fails at line 777 of `engine/src/attributes.rs` |
| X5 | `every_type_the_filter_namespace_admits_carries_a_surrogate` | `ca3d7ae` | the `REAL` arm removed, and separately `LargeUtf8` and `Utf8View` removed from the `VARCHAR` arm: each fails at line 1283 of `engine/src/predicate.rs` |
| X6 | `publish_emits_a_nullable_byte_aligned_single_run_with_the_uncompacted_slices_ipc_bytes` | `ca3d7ae` | `StreamPlan::for_publish` declares `compact_attribute_retention: true`: fails at line 2787 of `engine/src/stream.rs`, at offset/length 8/3 |
| X6 | `a_compacted_single_run_decodes_equal_to_the_slice_it_replaces_nulls_included` | `ca3d7ae` | the compacted copy drops its null buffer: fails at line 2824 of `engine/src/stream.rs` |
| X7 | `every_emitted_attribute_column_retains_at_most_the_declared_factor` | `ca3d7ae` | the 64-byte term removed from the allowance: fails at line 2612 of `engine/src/stream.rs`; compaction removed: fails at line 2578 |
| X7 | `a_live_projected_text_stream_emits_every_attribute_column_within_the_declared_retention_bound` | `ca3d7ae` | compaction removed: fails at line 2906 of `engine/src/stream.rs`. `flush`'s single-run arm → `Arc::clone`, at `273a79d`: `state/consults/gates/2026-09-27-b1-engine-kernel-half-gate2-reviewer.md:125 @ cec34b8 sha256:5004784d2ad9a6b43554af5681d628218537684f4ba62ff7fa42c9ab0d4cc567` |
| X8 | `a_projected_viewport_query_from_the_wire_fixture_streams_the_declared_columns` | `273a79d` | `state/consults/gates/2026-09-27-b1-engine-kernel-half-gate2-reviewer.md:127 @ cec34b8 sha256:3d240fc7eabff2c888dae751c35c562d5e8399fc569cfc9a82272199dc09e959` |
| X9 | `every_projection_refusal_is_synchronous_typed_and_pre_mint`; `every_projection_refusal_matches_its_committed_error_fixture_shape` | `273a79d` | `state/consults/gates/2026-09-27-b1-engine-kernel-half-gate2-reviewer.md:128 @ cec34b8 sha256:edcebacb1141b7bc67449a04887134ae7598797b722dbcc858d9e4f571f8941b` |
| X10 | `a_compacted_and_a_sliced_single_run_serialize_to_identical_ipc_bytes` (E-15) | `ca3d7ae` | E-15's mutation, compact the whole chunk, realized as the run's data rebased to offset 0 over offset + length rows: survives (the test passes) |
| X11 | `a_projected_viewport_query_from_the_wire_fixture_streams_the_declared_columns` | `273a79d` | `state/consults/gates/2026-09-27-b1-engine-kernel-half-gate2-reviewer.md:129 @ cec34b8 sha256:03f7d14d6a2a00e2d89efd59108c8db4117909ec67ff90fbf10d7b89299fef3f` |
| X12 | `a_projected_viewport_query_from_the_wire_fixture_streams_the_declared_columns`; `a_live_projected_stream_emits_id_geometry_then_the_declared_columns`; `a_live_projected_text_stream_emits_every_attribute_column_within_the_declared_retention_bound` | `ca3d7ae` | one byte appended to the fixture between the two hashes: fails at line 277 of `kernel/tests/skp_projection.rs`, line 177 of `engine/tests/live_projection.rs` and line 2928 of `engine/src/stream.rs` |
| X13 | `a_live_projected_stream_emits_id_geometry_then_the_declared_columns` | `273a79d` | `state/consults/gates/2026-09-27-b1-engine-kernel-half-gate2-reviewer.md:130 @ cec34b8 sha256:2ad57e2da4e2621ae73e5bcfab1edfcadb4f6e1450dd6a46600bf09935945175` |
| C-a | `a_refused_dictionary_takes_the_final_arms_text_and_no_text_of_its_own` | `ca3d7ae` | the `Dictionary` arm's own text at `273a79d` restored: fails at line 818 of `engine/src/attributes.rs` |
| C-b | `an_admitted_projection_carries_each_columns_source_type_beside_its_emitted_field` | `ca3d7ae` | admission carries the emitted type as the source type: fails at line 847 of `engine/src/attributes.rs` |
| C-c | `the_reserved_id_refusal_states_the_reserved_name_on_the_wire_and_keeps_publishs_text` | `ca3d7ae` | publish's `From` arm renders the wire's reworded text: fails at line 871 of `engine/src/attributes.rs` |
| X14 | — | `fd9036f` | `protocol/skp/SKP-V0.md` §4 items 3 and 13, §8's `skp/0.6` entry, §9.1, §9.4 |
| Docs | — | `ca3d7ae` | `SKP_VERSION`'s doc (`protocol/skp/src/v0/mod.rs`); `flush`'s comment and the two H3 docs (`engine/src/stream.rs`); the round 7, item 1 cite (`kernel/src/skp.rs`) |
| Class 2 (row 5.1; R2-B5) | `publish_emits_a_nullable_byte_aligned_single_run_with_the_uncompacted_slices_ipc_bytes` | `ca3d7ae` | non-null `Boolean` at `arrow-ipc` 58.4.0: compaction changes the IPC bytes at 8/3, 0/10 and 40/20, and not at 3/5 (the test's `changes` column; the test passes). The reviewer's probe: `state/consults/gates/2026-09-27-b1-engine-kernel-half-gate2-reviewer.md:58-60 @ cec34b8 sha256:005a471d27c1fe371a85a975dda9d6365a3c44b4bc606a445d613208eacfc845` |
| Class 4 (X4) | `from_projection_error_renders_a_dictionary_sources_own_text_and_the_final_arm_otherwise` | `7765b98` | X4's row above; `state/consults/gates/2026-09-27-b1-engine-kernel-half-gate2-architect.md:35 @ cec34b8 sha256:b26d04870e3af04f9e647cf717afffabebc014220d06ec1ecb28d637f247c152` |
| Class 4 (X6) | `publish_emits_a_nullable_byte_aligned_single_run_with_the_uncompacted_slices_ipc_bytes` | `ca3d7ae` | X6's first row above, replacing Amendment 6's always-compact pairing (`state/consults/gates/2026-09-27-b1-engine-kernel-half-gate2-reviewer.md:123 @ cec34b8 sha256:182715287a911c370adffa2023556d5ed34d9adc740b6058177561ec64710b53`) |
| Class 4 (X12) | the three tests of X12's row | `ca3d7ae` | X12's row above; `state/consults/gates/2026-09-27-b1-engine-kernel-half-gate2-architect.md:54 @ cec34b8 sha256:63910ae1759239353fe5324667d152a9e8dc48efccb5b1322d075389215948a0` |
| Class 4 (X3's route) | `describe_projectable_agrees_with_viewport_query_admission_for_every_column` | `ca3d7ae` | `Catalog::open_cancellable` with `skip_uniqueness_check = true` (the engine-API route); `state/consults/gates/2026-09-27-b1-engine-kernel-half-gate2-architect.md:76 @ cec34b8 sha256:c3128cb2593298a3eb69bf6a32d08854590fc224e3b0335755052a6f04f3e9e1` |

**Superseded as of this amendment**
- Amendment 6, its X2, X3, X6, X7, X10 and X12 rows: this amendment's rows of the same names.
- Amendment 6, its class-4 section: this amendment's class-4 rows.
- Amendment 6, "X3's STOP, stated once" and its superseded-index entry: withdrawn, `state/consults/gates/2026-09-27-b1-engine-kernel-half-gate2-architect.md:77 @ cec34b8 sha256:8f3d8a99a87d667215ca9e034a2a025e7c1af52078d4792cd9edd25d3f661f3b`; `i64_for`'s doc is lines 273-274 of `engine/src/fixture.rs` at `273a79d`.
- Amendment 6, its suite counts (R2-B4, `state/consults/gates/2026-09-27-b1-engine-kernel-half-gate2-reviewer.md:50 @ cec34b8 sha256:88173650d0b6e4ed7c6d91e5c10c3de5125f7b18ef6d5db014b9c5e4713afc46`): `state/consults/gates/2026-09-27-b1-engine-kernel-half-gate2-reviewer.md:90 @ cec34b8 sha256:758a00b82be9780b94420c95a8581bea9d17652983e6981914568a2391f9c189`.
- Amendment 6, its cites (`state/consults/gates/2026-09-27-b1-engine-kernel-half-gate2-reviewer.md:80-85 @ cec34b8 sha256:182ecdaa73f6fa1610ab5fedcd1a1838fe7c602a0ef84b1ef723f84559dc803e`): the `cargo fmt` baseline drift is Amendment 3's, its last bullet; X19's content is Amendment 5's superseded index, its third entry; E-15's mutation is this amendment's X10 row; the two unnamed tests are named in this amendment's X6 and X7 rows; X12's mutation is this amendment's X12 and class-4 (X12) rows.
- Amendment 7, its re-verification paragraph and its suite counts: this amendment's table, and the reviewer's suite line cited above.

P6 sight list (round 12 (e)): read the last amendment first.

### Amendment 9 — 2026-09-27, post-result: scope addition on RULED 2026-09-24 (night), item (2): `protocol/skp/tests/conformance/` at the merge of `main`; E-15's mutation

Class 9 (scope addition), with one class-4 row (9.6). Written after a trial merge of `main` at `e606af7` was seen failing `spec_derived_fixtures_against_wire_types`, and after Amendment 8's X10 row. This is not a record correction. The merge of `main` precedes this amendment and changes no conformance file; no code of the addition precedes it.

**9.1 Rule and cause.** RULED 2026-09-24 (night), item (2), and §2.8's resolution rule now cover #123's conformance suite (`protocol/skp/tests/conformance/`), which postdates this form. At the merge, `req-viewport-all-null`, `req-viewport-populated`, `req-viewport-hex-zero-and-negzero` and `req-viewport-decu64-max` newly diverge, because they re-serialize with `columns` (§2.1; SKP-V0 §8's `skp/0.6` entry). Round 24, item 4 is not the authority.

**9.2 §2 shape.** One commit after the merge, touching only `protocol/skp/tests/conformance/`:
- `fixtures/*.json`:
  - Every `"skp": "skp/0.5"` becomes `"skp/0.6"`.
  - In `refusals-any-layer.json`, `any-version-skp_0_6` becomes `any-version-skp_0_7` on `skp/0.7`. `any-version-SKP_0_5` becomes `any-version-SKP_0_6` on `SKP/0.6`, and `any-version-skp_0_5SP` becomes `any-version-skp_0_6SP` on `skp/0.6` with its trailing space.
  - The nine version fixtures' `spec` names the `skp/0.6` literal. A `spec` naming the version that introduced a field is unchanged.
- The four fixtures of 9.1 gain `"columns": null`, and their `spec` gains §8's `skp/0.6` entry. No other document gains `columns`.
- `DIVERGENCES.md`: the header's re-run sentence and count line are updated to this run, naming the merge commit and the platform. Its five `path:line` cites are re-pointed to the merged tree (class 3).
- `AMBIGUITIES.md` A9: one clause appended for `skp/0.6`.
- `README.md`: one sentence appended naming this amendment. The commit changes no implementation file.

**9.3 §4.** The test is `spec_derived_fixtures_against_wire_types`, with `main.rs` unchanged. Each mutation is applied, the test is run, its failure is recorded by name with the commit, and the mutation is reverted (round 25, item 2 (c)):
- M-1: `"columns": null` removed from `req-viewport-all-null`. The observed set gains that id.
- M-2: `skip_serializing_if` on `ViewportQueryRequest::columns`. The four ids of 9.1 join the observed set.

The literal half has no mutation, because every version fixture is deferred to the host (`AMBIGUITIES.md` A3). Its proof is the diff and a count of `"skp": "skp/0.5"` under `fixtures/` equal to 0.

**9.4 §5.**
- Declared unchanged:
  - `main.rs`;
  - every fixture's `expect`, `roundtrip` and `expected_refusal_code`, and the number of fixtures;
  - D1's substance;
  - the observed divergence set, which stays `rej-resp-cancel-bad-state` alone;
  - the pass and deferred counts, which equal main's harness at `e606af7`.
- Invalidators (stop and return to the architect):
  - any of the above moves;
  - an implementation file must change for the harness to pass;
  - a divergence other than 9.1's four appears at the merge.

**9.5 §8 and §9.**
- Block-on-sight 24: the fixture commit touches a path outside `protocol/skp/tests/conformance/`; a fixture refuses `skp/0.6` or carries `skp/0.5` as its literal; or `columns` is non-null or appears outside 9.1's four fixtures.
- The reviewer reads:
  - the commit's diff;
  - M-1's and M-2's observations;
  - the harness's `--nocapture` count line at a named commit, beside main's count at `e606af7`.
- The architect checks 9.2 against `main.rs`'s `check` (round-trip value equality).

**9.6 E-15 (class 4, on gate 2's A-E6 and Amendment 8's X10).** X10's survival stands.
- The full-length copy that E-15's doc names is observed against E-15.
- X10's realization (an unchanged window over a whole-chunk buffer) is observed against `every_emitted_attribute_column_retains_at_most_the_declared_factor` and `a_live_projected_text_stream_emits_every_attribute_column_within_the_declared_retention_bound`, as 9.3 prescribes. At least one must fail by name.
- If both survive, stop: the retention proof has a gap, and a test is declared by amendment before it is written.

**Record.** Gate 3's reviewer report is the observation of record for 9.3 and 9.6. No closing amendment follows (the record cap).
