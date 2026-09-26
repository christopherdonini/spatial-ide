*Custodian's filing note (2026-09-25): the architect agent's consult for PLAN node `b1-engine-kernel-half`, revising its own draft (`state/consults/2026-09-24-b1-engine-prereg-draft.md`) to RULED 2026-09-24 — question round 17, items 3 and 4, filed as returned (extracted by script from the agent's hand-back; byte-identical). Everything below the rule is the agent's text. Section 1's fenced block is committed as `engine/B1-PROJECTION-PREREGISTRATION.md`; its stop list O1–O8 goes to the human.*

---

**Verdict: pass with notes.** The rulings settle the draft's stop items 1–8 and remove the ADR-017 skeleton. Re-reading the code at c16f41d turned up one internal contradiction in the sighted draft (O8) and seven choices no ruling covers (O1–O7). The text marks each one where it attaches and resolves none of them. The path stays `engine/B1-PROJECTION-PREREGISTRATION.md`; I found no reason to move it. Next to it are `engine/ADMISSION-PREREGISTRATION.md` and `engine/LOD-PREREGISTRATION.md`.

I quote nothing from any ruling or ADR. Every binding passage is cited by round and item, or by section, so no script byte-copy is owed.

---

## 1. The file to commit: `engine/B1-PROJECTION-PREREGISTRATION.md`

```markdown
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
```

---

## 2. Changes from the draft

1. The Verdict preamble, the draft status, the stop list and the ADR-017 amendment skeleton are removed. The Status is now the node's sighted preregistration (round 17 items 3 and 4).
2. An OPEN-marker line is added for O1–O8.
3. Authority: round 17 items 3 and 4 and round 21 item 1 are added. The draft node and night-program item 7 are no longer cited as authority.
4. What it decomposes: ADR-023 §2's sentence of 2026-09-24 and ADR-021's Note 2026-09-24 are added.
5. Drafted-by: the re-read is at c16f41d, with the draft at eab8e82 named as the source.
6. Branch: set by the draft's stop item 7 as recommended.
7. §0: the code list is re-read at c16f41d. Added: `publish/error.rs`, `preflight_pinless_parts`, `client.ts`, `client.test.ts`, `pool.rs`, `skp_admission.rs`, `publish_stream.rs`, `IdentityMode`.
8. F2 and F3 are restated as resolved by round 17 item 3.
9. F5 now names `open_engine_stream`'s raw-path caller.
10. F6: §10's `skp/0.4` is now crs-unit's literal.
11. F8–F16 are added (new findings at c16f41d).
12. §1: the may-claim list adds Float32 filterability, the dictionary exclusion and the publish restriction. The ADR list now says none is edited, ADR-017 stays byte-identical, and ADR-035 is cited.
13. §2.1: the SKP-V0 section is numbered after the last one at merge, and a dated §7.3 note is added.
14. §2.2: the publish bullet is now round 17 item 3's restriction, refusing by source type with today's text. Order against filter admission is marked O3; `[id]` is marked O8. `build_viewport_query`'s error type is stated.
15. §2.2: the `known_columns` comma rule is settled per stop item 8 as recommended.
16. §2.3: the gate's refusal detail is marked O2. `projectable` is stated as live admission. `predicate.rs` is settled to the ruling. The F1 refusal variant is marked O4. The filter-text byte-identity now excepts dictionaries. The later-widening sentence is added from the PLAN node.
17. §2.4: the builder list is corrected to `client.ts::viewportQuery`, with no parameter added. The code-union clause is dropped, since none exists. `client.test.ts` is added.
18. §2.6: no ADR is edited.
19. §2.7: the literal chain is `skp/0.4`, then the watcher's `skp/0.5` (ADR-035 Decision 6), then B1's `skp/0.6`.
20. §2.8: crs-unit is recorded as merged. The watcher's additions are listed from ADR-035. `client.test.ts` joins the list of expected conflicts.
21. §2.9: the seams are rewritten to the real interfaces. The caller-rule exemption is settled per round 17 item 4. The consumer's node id is marked O7.
22. §3: the new `AttributeMode` columns are named. A Float32 filter row is added. The mapped `[id]` row is marked O8. The dictionary row follows stop item 6 as recommended.
23. §4: E-3's name is decoupled from detail text (O2). E-18 is settled with both tests. E-19 is settled to ADR-021's Note. E-20 is added. The E-17 twin is named. The changed existing test is listed without its old name, so `verify:test-claims` does not bind to a removed name.
24. §4: K-1's harness is corrected (F12). K-2's assertions are corrected (F11). K-9 is renamed and settled to the ruling. S-2 is moved to `client.test.ts`. P-4 now includes `client.test.ts`.
25. §5: H5 is added. A false H4 is marked O5. The declared-unchanged list and the invalidators are set to the ruling plus O1.
26. §7: `MAX_INFLIGHT_BATCHES` is placed in the data plane, and `flush`'s comment is added to the rewrites.
27. §8: items 12, 15, 16 and 18 are updated. Items 21–23 are added.
28. §9: the operator and acceptance lines are unchanged in substance; merge order is after the watcher.

## 3. Stop list: choices the rulings do not cover

- **O1. Publish refusals beyond the two ruled texts.** Three effects are open:
  - (a) Publish's count refusal renders `EngineError::CeilingExceeded`'s Display, which names the constant. The rename changes it.
  - (b) Which refusal fires when a list has more than one failure: count before names; the restriction's position among geometry, identity, duplicate and type; and `[id]` under O8.
  - (c) A `Dict(_, Date32)` column is refused by admission before the restriction sees it.

  *Recommendation:* keep the rename and count-first order, as the draft declared them, and run the restriction after shared admission. Every single-failure publish request keeps today's code and text, rendered from the source type so that (c) keeps today's dictionary text; the one exception is the mapped `[id]` case, if O8 goes as recommended. A new test pins the multi-failure order. *The alternative:* publish stays identical in every request, which needs a publish-only order hook inside the one admission function.
- **O2. The detail text for types still refused.** Today's final-arm text lists a published attribute's admissible set ending at `float64`, which is false on the live path and speaks of publishing. ADR-023 §3 names the existing text as the `detail`.

  *Recommendation:* the gate returns typed facts (column and source type), and each owner renders its own text. Publish and filter keep today's texts byte for byte (the filter case is F7). The live `detail` is new engine-fact text, sighted at B1's close.
- **O3. Projection versus filter admission order in `build_viewport_query`.** *Recommendation:* projection first. It is pure and takes no admission-class lease, and a request carrying both is refused before any DuckDB parse.
- **O4. The typed refusal that replaces `bind_admit`'s `expect`.** `filter_rejected_by_binder` would be a false binder refusal (the entry 91 (a) precedent).

  *Recommendation:* namespace admission refuses a column whose type has no surrogate as `filter_column_not_filterable`, by name, so the namespace never carries one. `bind_admit`'s lookup returns that same refusal. *The alternative:* a third `PredicateAdmitError` kind, mapped to `engine.internal_inconsistency`.
- **O5. If H4 is false.** *Recommendation:* the exclusion lands as ruled, because round 17 item 3 states it unconditionally. The result is a class-2 record and a ledger entry for your word on the reason stated in ADR-021's Note.
- **O6. If H2 holds**, E-19's and K-9's dictionary cases are unreachable through `read_parquet`. *Recommendation:* prove both through their own per-field functions over a constructed `Field`, and record them as unreachable. This is the pattern round 17 item 4 accepted for the decode.
- **O7. The consumer has no PLAN node id.** B1's shell half is named only by description and its gate. *Recommendation:* add a proposed node that depends on `b1-engine-kernel-half` and `shell-redesign-map-studio`, so round 8's named-and-gated check resolves to an id.
- **O8. The sighted draft contradicts itself on `[id]` over a mapped identity** (a file with `parcel_key` and no `id` column). Its admission order (names before per-column rules) refuses it as `projection_column_unknown`. Its §3 row, and §2.3's Display sentence about the reserved name, predict `projection_column_is_identity`.

  *Recommendation:* the reserved `id` is recognised during name resolution, before the unknown check, so it gets the identity refusal. On the shared path this also changes publish's refusal for that list (O1).

Files relevant to this consult:
- C:\dev\spatial-ide\state\consults\2026-09-24-b1-engine-prereg-draft.md
- C:\dev\spatial-ide\DECISIONS-PENDING.md
- C:\dev\spatial-ide\docs\adr\ADR-021-row-filter-on-viewport-query.md
- C:\dev\spatial-ide\docs\adr\ADR-023-attribute-projection-on-viewport-query.md
- C:\dev\spatial-ide\docs\adr\ADR-035-dataset-session-ended-control-plane-event.md
- C:\dev\spatial-ide\engine\src\attributes.rs
- C:\dev\spatial-ide\engine\src\predicate.rs
- C:\dev\spatial-ide\engine\src\stream.rs
- C:\dev\spatial-ide\kernel\src\skp.rs
- C:\dev\spatial-ide\kernel\src\publish\mod.rs
- C:\dev\spatial-ide\kernel\src\publish\error.rs
- C:\dev\spatial-ide\kernel\tests\skp_admission.rs
- C:\dev\spatial-ide\frontends\shell\src\skp\client.ts
- C:\dev\spatial-ide\frontends\shell\src\skp\client.test.ts
- C:\dev\spatial-ide\PLAN.yaml
