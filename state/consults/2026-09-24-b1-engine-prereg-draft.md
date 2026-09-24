*Custodian's filing note (2026-09-24): the architect agent's consult for PLAN node `b1-engine-prereg-draft` (`node:b1-engine-prereg-draft@g1`, night program 2026-09-24 item 7), filed as returned. Everything below the rule is the agent's text. It is a DRAFT for the human's morning sight, not a gate, and licenses no code. Its stop list is carried into the morning question round (`DECISIONS-PENDING.md` entry 123).*

---

**Verdict: pass with notes.** The draft can go to the human's sight. Two conflicts need the human's word before code starts, because each one crosses an accepted ADR:
- ADR-017 §4. The bundle format's closed type list refuses `float32` and dictionaries, but ADR-023 §2 as amended admits both through the shared gate.
- ADR-021. The filter's namespace is defined by that same gate, so widening the gate widens the filter namespace too.

There is also one defect that exists today and becomes live the moment the gate widens. `engine/src/predicate.rs::bind_admit` calls `duckdb_type_name(ty).expect(..)` on every admitted column in the file, not just the columns a predicate names. Once `Float32` or a dictionary type is admitted, a filtered query panics on any file that has such a column. The fix is compulsory, whatever the stop list rules. The missing decision is drafted as an ADR-017 amendment skeleton after the stop list.

---

# Brief B stage B1, engine/kernel half: attribute projection on `viewport_query`. Preregistration, DRAFT for the human's sight

## Header

- **Status: DRAFT, for the human's sight at the morning question round. Not a gate. No code exists and none is licensed by this text.** It becomes the preregistration of `b1-engine-kernel-half` only after the human's sight, and it is committed before any code.
- **Authority:**
  - PLAN nodes `b1-engine-prereg-draft` (this draft), `b1-engine-kernel-half` (the implementation) and `entry-79-b1-consult-items`.
  - RULED 2026-09-14, question set D, item D2 (ADR-023's Decision text with its two §2 amendments and four B1 conditions).
  - RULED 2026-09-11, entry 79, items (1)–(3).
  - RULED 2026-09-23 (late), shell direction items (a)–(e), item (b) especially.
  - RULED 2026-09-24 (night), items (1) and (2).
  - RULED 2026-09-14, question set C, item C2 (the precedent that literals follow merge order).
  - The night program of 2026-09-24, item 7.
- **What it decomposes:**
  - ADR-023 (Proposed) Decision §§1–5 and §§8–11, plus its B1 conditions (1)–(4). The entry-79 applications are folded into ADR-023's text.
  - DRAFT-3 Stage B1: its engine/kernel half only.
  - The two architect consults of 2026-09-10 (Doc 1: the ADR-023 decision; Doc 2: the ADR-004 data-plane review), whose cites are historical.
- **Drafted by** the architect agent on the custodian's brief (`node:b1-engine-prereg-draft@g1`). Read-only. Read at `main` eab8e82. The architect ran no command. Every statement below about how DuckDB or arrow-rs behaves is a P0 question (§5), not a claim.
- **Reference form.** Code is cited by symbol (`path::item`), documents by section, and the ledger by round and item. There are no line cites, so no pins are owed. If a gate asks for a line, it is pinned at a commit on `main`.
- **Committed before any code. Append-only once committed.** An amendment written after any outcome has been seen says so in its first line.
- Proposed file: `engine/B1-PROJECTION-PREREGISTRATION.md`. Proposed branch: `cut/b1-engine-projection`. Both are the custodian's to place. The branch base is stop item 7.

## §0. Disclosure

- **Read in full:**
  - ADR-023.
  - The ledger blocks named in the Header.
  - `state/directives/2026-09-24-program-order-and-literals.md` and `state/directives/2026-09-24-watcher-sight.md`.
  - DRAFT-3 (Stage B1, B-1…B-7) and both 2026-09-10 consults.
  - ADR-017 §4.
  - `docs/08`, `docs/PREREGISTRATION-TEMPLATE.md`, and the PLAN nodes named above.
- **Code read at eab8e82:**
  - Protocol: `protocol/skp/src/v0/{mod.rs,commands.rs}` and `protocol/skp/SKP-V0.md` (§1, §4, §5, §7, §8).
  - Kernel: `kernel/src/skp.rs` (`SkpHost::{describe,viewport_query}`, `build_viewport_query`, `describe_dataset`, `error_of`, `filter_error_of`, `predicate_admit_error_of`), `kernel/src/lib.rs::open_engine_stream`, `kernel/src/publish/{mod.rs,ceilings.rs}`.
  - Engine: `engine/src/attributes.rs`, `engine/src/stream.rs` (`stream_with_cancel`, `stream_for_publish`, `resolve_projection`, `stream_inner`, `build_sql`, the chunk loop's declared-type check, `attr_row_bytes`, `flush`, the `filter_composition` tests), `engine/src/predicate.rs::{namespace_admit,duckdb_type_name,bind_admit}`, `engine/src/error.rs`, `engine/src/fixture.rs::AttributeMode`.
  - Tests: `kernel/tests/wire_bytes_invariant.rs`.
  - Shell: `frontends/shell/src/skp/types.ts`, `frontends/shell/src/skp/__tests__/fixtures.test.ts` (it reads the same `protocol/skp/tests/data/*.json` the Rust side reads), `frontends/shell/src/style/document.ts`.
- There was no pilot, spike or corpus run, and nothing was measured. The fixture-drive confound does not apply: the 5 GB fixture is not read.
- **Findings from reading the code, disclosed rather than silently absorbed:**
  - **F1.** `predicate.rs::bind_admit` builds its surrogate relation from **every** admitted column in the file and calls `duckdb_type_name(..).expect(..)` on each one. `duckdb_type_name` has no arm for `Float32` or `Dictionary`. Widening `admit_attribute_type` without widening it makes every filtered query panic on a file that carries such a column.
  - **F2.** ADR-017 §4 (Accepted, architect-blockable) lists the bundle's admissible attribute types and refuses `float32` and every dictionary type. Today that list is enforced by the same `admit_attribute_type` that ADR-023 §2 makes the one live gate. → Stop item 1.
  - **F3.** SKP-V0 §7.3 defines the filter's namespace by reference to `admit_attribute_type`, so the D2 amendments widen the filter namespace (ADR-021) automatically. → Stop item 2.
  - **F4.** `resolve_projection(&[])` is the publish path's valid empty projection (`kernel/src/publish`, and the tests `engine/tests/publish_stream.rs` and `row_group_seam.rs`). So the ruled `columns: []` refusal cannot live in the shared gate. It is a wire-spelling refusal and lives at the SKP boundary (§2.2).
  - **F5.** The raw `StreamParams` / `EngineSourceFactory` path (`AdmissionMode::Raw`) is a separate product path. B1 gives it no projection (caller rule). The ADR-004 review's projection fixture for the wire-bytes invariant therefore goes through the SKP ticket path (K-6).
  - **F6.** ADR-023 carries two stale sentences:
    - Its Status line still says the decision is undrafted.
    - §10 names `skp/0.4`, which merge order now supersedes (RULED 2026-09-24 (night), item (2)). §10's own last sentence requires the number to be corrected before B1's PR and never assumed.
    - Both are corrected by dated notes at ADR-023's acceptance (B1's close), next to condition (2)'s corrigendum. This half does not edit ADR-023.
  - **F7 (out of scope; ledger note only).** A filter refusal's `reason` for a column whose type is refused today renders `EngineError::AttributeUnpublishable`'s Display, which speaks of publishing. B1 keeps those bytes identical (§5) and does not fix them.
- **Hypotheses H1–H4** are labelled as hypotheses. Each has its discriminator in §5 P0.

## §1. What this preregistration may and may not claim

- **May claim, once the tests pass:**
  - `viewport_query` accepts a declared projection and streams it as additional Arrow columns in the same batch.
  - Admission refuses with seven typed codes, synchronously, before any lease or ticket is taken.
  - `describe` carries a kernel-computed `projectable` fact on each schema row.
  - The `columns: null` path is unchanged.
- **May not claim:**
  - That hover shows attributes, that `match` styling works live, that B1 is done, or anything about the workflow (DRAFT-3 B-1).
  - Any duration or performance number, or any `docs/08` row (DRAFT-3 B-7; ADR-023 §9).
  - "zero-copy" (ADR-004).
  - That ADR-023 is accepted. It stays Proposed until B1's close, after the shell half.
- **The wire changes (SKP), scoped and gated for it.** MCP is untouched and nothing is exposed to an agent host (ADR-023 §9).
- **ADRs cited and not amended here:** ADR-004, ADR-006, ADR-010 (rules 1, 2 and 6), ADR-016, ADR-017, ADR-019, ADR-021, ADR-022 and ADR-023. Any ADR-017 or ADR-021 text is the human's (stop items 1 and 2).
- **The wording of every new refusal message is the human's**, sighted at B1's close with the shell half that first displays it. Engine messages state engine facts only. None of them states a consequence for the shell (the operator-visible-text rule).
- **No new display surface** (RULED 2026-09-23 (late), shell direction items (b)–(d)). The shell changes in §2.4 are the wire mirror that SKP-V0 §4 item 13 forces. They add no component and no visible string, so there is no migration-inventory item.

## §2. The change, stated before it is applied

### 2.1 `protocol/skp`

- `ViewportQueryRequest` gains `columns: Option<Vec<String>>`, an ordered list of caller-supplied names.
  - It follows the `bbox_crs`/`filter` discipline: no `#[serde(default)]`, no `skip_serializing_if`, and `None` serializes as `null`, never as an absent key.
  - The reader's tolerance of an absent key is the known property recorded in the SKP-V0 §7.2 correction, not a promise.
- `FieldInfo` (each `describe.schema` row) gains `projectable: bool`.
- `SKP_VERSION` becomes the literal after the watcher's (§2.7). `deny_unknown_fields` stays on every struct in both directions, and comparison stays `==`.
- New JSON fixtures, read by both the Rust and the TypeScript fixture tests:
  - `v0-viewport_query-request-with-columns.json`, whose declared order differs from the file's order.
  - Every existing `viewport_query` request fixture gains `"columns": null`.
  - Every existing `describe` response fixture gains `projectable` on every schema row.
  - One error fixture per new code (seven in all).
- `SKP-V0.md`:
  - A new **§9 "Attribute projection on `viewport_query`"**, laid out as §7 is: version, wire shape, contract (order, nullability, the batch schema as authority for emitted types), the refusal table, pre-lease admission, and the data plane (empty diff).
  - A §8 change-log entry giving the version's **full** field set.
  - Short version notes in §4 items 1, 3, 8 and 13, per the §7 precedent.
  - Nothing earlier is rewritten.

### 2.2 `kernel`

- `SkpHost::viewport_query` keeps its order: version, then dataset, then live generation, then `build_viewport_query`. Projection admission runs inside `build_viewport_query`, beside filter admission, and so **before** `open_engine_stream` leases and before `tickets.mint` mints (ADR-023 §3; ADR-019).
- Admission order, deterministic and declared:
  1. `Some([])` → `skp.projection_empty_list` (no fields). This is a protocol-level refusal minted in the kernel (F4), never read as `null` (entry 79, item (1)).
  2. The engine's count ceiling is checked before any name is resolved.
  3. Unknown names are resolved in declared order.
  4. Per-column rules run in declared order: geometry, identity, duplicate, type.
  5. The first failure is the one reported.
- `projection_error_of(&ProjectionError) -> SkpError` is **one exhaustive `match` with no wildcard arm**, on the `filter_error_of` precedent. The six engine variants map to the six ADR-023 §3 codes with their ruled fields:

  | Code | Fields |
  |---|---|
  | `skp.projection_column_unknown` | `column`, `known_columns` |
  | `skp.projection_type_not_admitted` | `column`, `arrow_type`, `detail` |
  | `skp.projection_column_is_geometry` | `column` |
  | `skp.projection_column_is_identity` | `column`, `id_column` |
  | `skp.projection_column_duplicated` | `column` |
  | `skp.projection_too_many_columns` | `limit`, `saw` |

  - `known_columns` is comma-joined in the `candidate_columns` form (stop item 8 covers a name that contains a comma).
  - `arrow_type` is the same Display string that `describe.schema[].arrow_type` uses.
- `open_engine_stream` takes the admitted projection and calls the engine's new live entry point (§2.3) when one is present. `columns: null` calls today's `stream_with_cancel`, unchanged.
- `describe_dataset` fills `projectable` from the engine's per-column admission function (§2.3). It is pure and in-memory with no IO (ADR-006 class 1, as `describe` already is).
- **Publish:** only what stop item 1 rules. The recommendation keeps publish's observable refusals byte-identical.

### 2.3 `engine`

- **`attributes.rs`: the one gate.**
  - `admit_attribute_type` implements ADR-023 §2 as amended:
    - `Float32` is admitted and emitted as `Float32`, never widened.
    - `Dictionary(k, v)` is admitted exactly when `v` is admitted, and the emitted field is `v`.
    - Every other refusal keeps today's detail text byte-for-byte.
  - It returns the **emitted** field type, so that decoding a dictionary is a fact of the gate, not a second rule.
  - The module doc's dictionary and `Float32` paragraphs are rewritten to the amended rule.
- **Typed refusals.**
  - A new `ProjectionError` enum has six variants and is returned by `admit_projection` and `resolve_projection`.
  - `From<ProjectionError> for EngineError` rebuilds exactly today's `AttributeUnpublishable { column, detail }` and `CeilingExceeded` for the publish path. The publish refusal codes do not change.
  - `projection_column_is_identity` fires for the identity's source column and for the reserved `id` name. Its Display states whichever of the two facts applies: the source column (when the file's own column is the identity), or the name reserved for the identity in every batch (when it is not).
- **Per-column admission.** `admit_projection_column(field, geometry_column, identity_column)` holds the per-column rules (geometry, identity, type). `admit_projection` uses it, and `describe`'s `projectable` uses it. That makes one function and one policy (stop item 4).
- **The constant.** `MAX_PUBLISHED_ATTRIBUTES` is renamed `MAX_PROJECTED_ATTRIBUTES`: one declared number (32) bounding both surfaces (ADR-023 §4). The engine README row and the doc comment in `kernel/src/publish/ceilings.rs` are updated.
- **The projection type.** `PublishedProjection` is renamed `AdmittedProjection`. Its single-constructor discipline is unchanged.
- **The live entry point.** `Dataset::stream_projected_with_cancel(q, &AdmittedProjection, cancel)`:
  - It runs `stream_inner` with the viewport `StreamPlan` (`IndexUse::Off`, `Unordered`, the default policy, `report_bounds: false`) and `BatchEnvelope::with_attributes`.
  - Its product caller is `kernel::open_engine_stream`.
  - There is no second batch constructor: assembly stays `TaggedBatch::assemble`, which checks the declared fields.
- **The chunk loop.**
  - A dictionary column is decoded to its value type (`arrow::compute::cast`), which is a **named copy** (ADR-004).
  - The decode happens **before** the declared-type check, so the index never reaches the envelope, the wire, or anything downstream.
  - `attr_row_bytes` gains a `Float32` arm costing 4 bytes and costs a decoded column by its value type.
- **`flush`: the retention rule** (condition (3); §7).
  - A single-run attribute slice is kept as a slice unless the buffers it retains exceed `MAX_ATTRIBUTE_RETENTION_FACTOR` × the slice's own memory. Past that it is compacted by one copy.
  - Cut boundaries are unaffected: the decision is taken after the cut and reads no allocation size for any boundary.
  - Emitted IPC bytes are identical either way (H3, E-15). This preserves ADR-017's publish determinism.
- **`predicate.rs`:**
  - `duckdb_type_name` covers every type the gate admits (`Float32` → `REAL`). The `expect` is replaced by a typed refusal, so gate/namespace drift fails typed instead of panicking.
  - The namespace treats dictionary columns as stop item 2 rules.
  - A filter refusal's `reason` for every type still refused stays byte-identical (F7).
- **`build_sql`:** unchanged. It is already projection-generic. Projected names come only from the resident schema, matched exactly and quoted by `quote_ident`, so no caller text reaches SQL.

### 2.4 `frontends/shell`: the wire mirror only

- `src/skp/types.ts`:
  - the version literal;
  - `columns: string[] | null` on `ViewportQueryRequest`;
  - `projectable: boolean` on `FieldInfo`;
  - the seven codes, if a code union exists.
- Every request builder that constructs a `viewport_query` sends `columns: null`. The worker enumerates them at P1: at least `viewportStreamManager.ts`, `tileViewportStreamManager.ts` and `candidateArmSession.ts`.
- `fixtures.test.ts` covers the new keys.
- `src/style/document.ts`: the sentence claiming `viewport_query` carries no attributes is corrected to the new fact (the wire can carry a projection, and this shell requests none yet) — condition (1), stop item 5. `StyleDocumentV0`'s type stays literal-only; that is the shell half's.
- `src-tauri` passes the types through and needs a recompile only.

### 2.5 Data plane

**`protocol/data-plane/` has an empty diff** (Doc 2 §2). The widening is inside the Arrow IPC payload: the same frame, the same tag, the same credit and the same transport. `attribute_columns` rides the schema-metadata string map, as it already does for publish. No attribute value crosses the control plane.

### 2.6 Documents

- This half does not edit ADR-023 (F6). ADR-017 and ADR-021 follow stop items 1 and 2. Nothing is written to `docs/08`.

### 2.7 The wire literal (RULED 2026-09-24 (night), item (2); the C2 precedent)

- **B1 takes the literal that follows the watcher's, by merge order.** `main` is `skp/0.3` today. The order ruled is crs-unit-fact-and-bounds, then the watcher, then B1. If they land in that order with no other wire change between them, they are `skp/0.4`, `skp/0.5` and **`skp/0.6`**.
- The number is whatever follows `main`'s literal when B1 merges. If any other wire change merges in between (ADR-029's lifecycle literal, for instance), B1 renumbers before its PR. The number itself is immaterial (C2).
- The literal is minted once, on B1's branch. It freezes at merge (SKP-V0 §4 item 13 (iv)). Both sides' fixtures change in the same commit.

### 2.8 How B1's `describe` change composes with crs-unit and the watcher

- **Independent fields.** crs-unit's typed unit fact and the watcher's two facts (coverage, checks) are designed by their own preregistrations, not here. B1 adds only `projectable`, and only on `FieldInfo` (each `schema[]` row). B1 changes no field, value or error arm those pieces add.
- B1's error mapping is its own function (`projection_error_of`), so B1 adds no arm to `error_of`. The watcher's coverage-loss variant and B1's codes do not share a match.
- **Stacking and merge-order consequences only:**
  - Every `describe` response fixture on B1's branch carries both earlier pieces' fields as they merged, plus `projectable`.
  - Conflicts are expected in `SKP_VERSION` (both sides), `commands.rs` (neighbouring structs), `describe_dataset`, `types.ts`, the shared fixtures and SKP-V0 §8. They are resolved by carrying every piece's fields.
  - §8 entries are appended in merge order.
  - B1's §8 entry lists B1's fields only.
  - The reviewer confirms that B1's diff changes none of the other two pieces' lines.

### 2.9 Seams the diff crosses: the consumer's actual interface, and the end-to-end proof from the real shape

| Seam | The interface as it actually exists (read at eab8e82) | Proof from the real shape |
|---|---|---|
| shell TS → protocol JSON → kernel | `types.ts` request builders; serde `ViewportQueryRequest` (`deny_unknown_fields`) | K-1 deserializes the committed JSON fixture that the TS test also reads; the shell's existing E2E suite runs on the branch under the new literal |
| kernel → engine | `Dataset::resolve_projection`, the new `stream_projected_with_cancel`, `ProjectionError` | K-1 and K-2 |
| engine → data plane → consumer | `TaggedBatch::write_ipc_into` into the existing frame | K-1 decodes the real frames; K-6 compares bytes |
| gate → predicate namespace | `namespace_admit` / `duckdb_type_name` / `bind_admit` | E-18 and E-19 |
| gate → publish | `kernel/src/publish::preflight` via `resolve_projection` and `From<EngineError> for PublishError` | K-9; the existing publish and determinism suites unchanged |
| kernel → shell `describe` | `FieldInfo` in both mirrors | P-3, S-1, K-5 |

Caller rule: every new `pub` item above has a product caller in the same diff, except the non-null `columns` path and `projectable`, whose consumer is the held shell half. That is stop item 3. There is no option on `StreamParams` (F5) and no instrument accessor.

## §3. Fixtures: outcomes declared in advance

Every fixture is generated in-test through `engine::fixture` (feature `fixture`, not shipped): a new `AttributeMode` variant adding `Float32`, `Int64`, `Boolean`, `Date32` and wide-text columns with NULLs, beside the existing `CategoricalZone`. Every fixture is hash-verified before and after each run.

| Fixture | Request | Predicted outcome |
|---|---|---|
| native `id`, declared `[area, zone]` against file order `[zone, area]` | projected | schema `[id, geometry, area, zone]`, all projected fields nullable, NULLs travel as NULL |
| same | `columns: null` | frames equal today's shape; no `attribute_columns` entries |
| same | `[]` | `skp.projection_empty_list`, before any lease or mint |
| same | 33 unknown names | `skp.projection_too_many_columns` {32, 33} |
| same | `[nope]` | `skp.projection_column_unknown`, with `known_columns` |
| same | `[geometry]` / `[id]` / `[zone, zone]` / `[d32]` | geometry / identity / duplicated / type_not_admitted (`arrow_type` Date32) |
| mapped identity `parcel_key` | `[parcel_key]`, `[id]` | identity (`id_column` = `parcel_key`) for both, each Display stating its own fact |
| `Float32` column | `[f32]` | emitted `Float32`, values bit-equal to the source |
| wide text (≈1 KiB values), default policy | `[text]` | every emitted batch satisfies the retention bound (E-14) |
| dictionary column | per H2 | reachable → emitted as the value type; unreachable → recorded as unreachable from `read_parquet` (stop item 6) |

## §4. Tests, one mutation per new test

Each mutation makes its test fail by name and is verified mechanically as a pre-gate self-check.

**Protocol**
- **P-1** `viewport_query_request_carries_columns_as_explicit_null_when_absent`. Mutation: `skip_serializing_if = "Option::is_none"` on `columns`.
- **P-2** `viewport_query_request_with_columns_fixture_reads_in_declared_order`. Mutation: `#[serde(rename = "projection")]`.
- **P-3** `describe_fixtures_carry_projectable_on_every_schema_row`. Mutation: `skip_serializing_if` on `projectable` whenever it is false.
- **P-4** The existing literal-equality assertions on both sides, named by the worker at P1. Mutation: revert the literal.

**Engine**
- **E-1** `float32_is_admitted_as_its_own_type_and_never_widened`. Mutation: the emitted field is `Float64`.
- **E-2** `a_dictionary_is_admitted_under_its_value_types_rule_and_emitted_as_the_value_type`: `Dict(Int32, Utf8)` is admitted as `Utf8`; `Dict(Int8, Date32)` is refused. Mutation: admit every `Dictionary`.
- **E-3** `every_type_still_refused_keeps_its_refusal_and_detail_text`: Binary, Date32, Decimal128, Timestamp, List, Struct. Mutation: admit `Date32`.
- **E-4** `each_projection_refusal_is_its_own_variant`. Mutation: the duplicate arm returns `ColumnIsIdentity`.
- **E-5** `the_count_ceiling_is_checked_before_any_name_is_resolved`. Mutation: check the count after resolution.
- **E-6** `names_resolve_before_per_column_rules_in_declared_order`. Mutation: resolve per column, interleaved.
- **E-7** `projectable_is_the_per_column_admission`. Mutation: compute `projectable` from `admit_attribute_type` alone.
- **E-8** `a_live_projected_stream_emits_id_geometry_then_the_declared_columns` (`engine/tests/live_projection.rs`). Values are checked row by row against a DuckDB read of the fixture keyed on `id`, NULLs included. Mutation: `resolve_projection` sorts by file order.
- **E-9** `projection_leaves_frame_crs_axis_and_identity_metadata_byte_identical`. Mutation: `with_attributes` drops the `axis_normalization` key.
- **E-11** `float32_costs_four_bytes_in_the_estimate`. Mutation: remove the `Float32` arm.
- **E-12** `a_dictionary_chunk_is_decoded_before_the_declared_type_check_and_no_index_reaches_the_envelope`. Mutation: skip the decode.
- **E-14** `every_emitted_attribute_column_retains_at_most_the_declared_factor`. Mutation: remove the compaction branch.
- **E-15** `a_compacted_and_a_sliced_single_run_serialize_to_identical_ipc_bytes`. Mutation: compact the whole chunk instead of the slice.
- **E-17** (condition (4)) `filter_composition` re-pinned projection-aware. The matrix doubles to 16 cells (none, `[zone]`). The verbatim test gets a projected twin. `BBOX_COND` and every `WHERE`/`LIMIT` suffix string stay **byte-identical** to today's; only the `SELECT` prefix gains the projected names after `"geometry"`. Mutation: `build_sql` emits projected columns before geometry. The reviewer checks that no `WHERE` assertion is weakened.
- **E-18** `a_file_with_a_float32_column_binds_every_predicate_without_panicking`, plus `a_float32_column_is_filterable` if stop item 2 is ruled yes. Mutation: remove the `REAL` arm.
- **E-19** `a_dictionary_column_is_refused_as_not_filterable_with_its_reason`, on the recommended ruling for stop item 2. Mutation: remove the exclusion.

**Kernel** (`kernel/tests/skp_projection.rs`)
- **K-1, the seam test.** `a_projected_viewport_query_from_the_wire_fixture_streams_the_declared_columns` runs: committed JSON fixture bytes → `SkpHost::open_dataset` + `viewport_query` → ticket redeemed over the real data-plane WebSocket (the harness shape of `skp_filter_cancellation.rs`) → IPC decoded → schema and values checked against an oracle. Mutation: `build_viewport_query` ignores `req.columns`.
- **K-2** `every_projection_refusal_is_synchronous_typed_and_pre_mint`: seven codes, each with its exact field keys; the pending-ticket count and the stream-class lease count are unchanged. Mutation: move projection admission after `open_engine_stream`.
- **K-3** `columns_empty_list_is_refused_never_read_as_null`. Mutation: map `Some([])` to `None`.
- **K-4** `projection_error_of_maps_each_variant_to_its_own_code`. Mutation: two variants share a code.
- **K-5** `describe_projectable_agrees_with_viewport_query_admission_for_every_column`, over the native, mapped and session-ordinal fixtures. Mutation: as E-7.
- **K-6** The `wire_bytes_invariant` projection case, through the SKP ticket path. Mutation: `attribute_columns` metadata is written only while tracing is on.
- **K-7** `a_projection_composes_with_a_filter`. Mutation: the projection is dropped when a filter is present.
- **K-9** `publish_refuses_float32_and_dictionary_by_the_bundle_format_rule_byte_identically`, on stop item 1's recommendation. Mutation: remove the publish-site restriction.

**Shell**
- **S-1** `fixtures.test.ts` covers `columns` and `projectable`. Mutation: drop `projectable` from the TS declared key set.
- **S-2** `every viewport_query the shell builds carries columns: null`, one case per builder. Mutation: omit the key from one builder.
- The existing shell E2E suite runs on the branch, unchanged and green.

**Condition (1)'s proof** is the corrected sentence in `document.ts`. The reviewer resolves it by reading the line in the diff; there is no test, because it is a comment.

## §5. P0 (before code) · registered predictions · declared unchanged · invalidators · falsification

**P0 is read-only probes on the branch, each naming the pinned crate versions from `Cargo.lock`** (round 15 (c): a claim about a tool's behaviour names that tool's version):
- **H1.** DuckDB reports a parquet `FLOAT`/REAL column as Arrow `Float32` in `Dataset::file_schema`. *Predicted yes.*
- **H2.** DuckDB's `read_parquet` never reports an Arrow `Dictionary` type, whether for dictionary-encoded pages or for a pandas-categorical file with an Arrow dictionary schema. *Predicted: unreachable.*
- **H3.** The pinned arrow-rs exposes a slice's own memory size beside `get_buffer_memory_size`, and its IPC writer emits identical bytes for a slice and for its compacted copy. *Predicted yes.*
- **H4.** DuckDB orders ENUM values by declared position under `<`/`>`. *Predicted yes.* This is the reason for stop item 2's recommendation.

A prediction that turns out wrong is a result, recorded under class 2, and is never edited.

**Declared unchanged:**
- `columns: null` frames.
- Frame tag, `crs`, `crs_source`, `axis_order`, `axis_normalization` and identity metadata.
- `id` is column 0 (`UInt64`, non-null) and geometry is column 1.
- The `WHERE` composition rule.
- The duckdb-expr/0 dialect.
- Credit, chunking, `MAX_*` batch constants and cancellation mechanics.
- Every publish refusal code and every publish output byte (subject to stop item 1).
- Every filter refusal text for types still refused.
- The raw `StreamParams` path.
- `protocol/data-plane/`.
- Every field of crs-unit's and the watcher's.
- MCP.

**Invalidators (the piece stops and returns to the architect):**
- H3 is false. The retention rule is then redesigned; nothing lands as it stands.
- A publish determinism or publish refusal test changes.
- A data-plane diff turns out to be needed.
- A projection refusal cannot be made pre-lease.
- A second batch constructor turns out to be needed.

A change in merge order renumbers the literal (§2.7). It does not invalidate the piece.

**Falsification:** the preregistration is wrong if the live projection cannot share `admit_attribute_type` with the filter and publish paths without a second type policy beyond the bundle-format restriction stop item 1 names.

## §6. Instruments

Every instrument here is an **assertion** (a typed outcome, a schema, a byte comparison, a buffer-size inequality over emitted arrays). None is a measurement. There is no `docs/08` figure. No new counter or accessor is added. The existing `attribute_concatenations()` stays engine-API-only and never becomes an SKP field (ADR-004 Amendment 4).

## §7. Declared values and ceilings (ADR-010 rule 6)

- **`MAX_PROJECTED_ATTRIBUTES = 32`** bounds the projected columns of one live query **and** of one bundle. It is one number (ADR-023 §4). If the two ever need to differ, that is a new ADR-023 declaration.
- **`MAX_ATTRIBUTE_RETENTION_FACTOR = 2`** (condition (3), the architect's). The attribute buffers each emitted batch retains are at most 2 × that batch's own attribute slice memory, asserted by E-14.
  - Producer-resident payload is therefore bounded by `(MAX_QUEUED_BATCHES + 1)` batches, each retaining at most the factor times its slice memory, plus the chunk DuckDB is currently producing (DuckDB's, uncounted, as today).
  - `MAX_QUEUED_BATCHES`'s doc comment is rewritten to say so. This is a declared bound, not a measured figure.
- **Unchanged:** `MAX_BATCH_BYTES` 4 MiB, `TARGET_BATCH_BYTES`, `FIRST_TARGET_BATCH_BYTES`, `MIN_BATCH_BYTES`, `MAX_ROWS_PER_BATCH`, `MAX_QUEUED_BATCHES` 2, `MAX_INFLIGHT_BATCHES` 4.
- No list-size ceiling is added to the wire. The count check runs first, so at most 32 names are ever resolved. `known_columns` is bounded by the file's own column count, as today's detail already is.
- **`docs/08` rows touched (none measured, none claimed; no row is added):**
  - **First pixels:** a projection spends first-batch bytes on attributes, so the first batch carries fewer rows at the same target. The `null` path is unchanged.
  - **Memory:** the retention bound above.
  - **Cancellation:** the mechanism is unchanged; a dictionary decode is one bounded per-chunk step between the checks already in the row loop.
  - **Cold open:** unchanged; `projectable` is computed at `describe`, not at open.
  - **VRAM / frame time:** the shell half's.

## §8. Block-on-sight (each checked separately at the gate)

1. A projection refusal delivered as a data-plane terminal frame, or taken after a lease or a mint (ADR-023 §11 item 1).
2. A wildcard or `String`-flattened arm in `projection_error_of`, or a code outside the seven (§11 item 2; ADR-021 decision 8).
3. A projected column admitted by any gate other than `admit_attribute_type` / `admit_projection_column` (§11 item 3).
4. A version literal that is not the one following `main`'s at merge, or a literal bump without both fixture sides in the same commit (§11 item 8).
5. Any diff under `protocol/data-plane/`, JSON in a frame payload, or an attribute value on the control plane (Doc 2 §8 items 1–2; B-5).
6. "zero-copy" anywhere (Doc 2 §8 item 3).
7. A projected column at or before index 1, a nullable `id`, a second batch constructor, or an assembly that skips the declared-field check (Doc 2 §8 items 4–5).
8. An instrument counter, span or connection fact as an SKP or frame field (Doc 2 §8 item 6).
9. A batch-boundary estimate that reads an allocation size or a NULL slot's contents (Doc 2 §8 item 7). The retention decision is taken after the cut and is exempt only for that reason.
10. A credit or chunking change (Doc 2 §8 item 8). Any performance number or duration (B-7; Doc 2 §8 item 9).
11. `columns: []` read as `null`, or the empty-list check placed in the shared gate (F4).
12. `duckdb_type_name` missing any type the gate admits, or any remaining `expect` on that path (F1).
13. `Float32` widened anywhere, or a dictionary index reaching the envelope, the wire or a fixture.
14. A `WHERE`/`LIMIT` assertion in `filter_composition` weakened or rewritten (condition (4)).
15. A publish or filter observable change beyond what stop items 1 and 2 rule.
16. A `pub` item, option or code path with no product caller outside stop item 3's pre-commitment (for example, projection on `StreamParams`).
17. Any display surface, component or visible string in the shell (shell direction (b)–(d)). Any sentence describing B1 or the workflow as complete (B-1).
18. A B1 change to any `describe` field or error arm belonging to crs-unit or the watcher.
19. An engine message stating another module's consequence.
20. A seam test that encodes an imagined interface instead of the committed JSON fixture and the real data plane (the seam rule, by name).

## §9. Gates

- **Architect (full gating: a wire change, a data-plane-adjacent change, ADR-bound conditions).** §8 checked one item at a time; ADR-023 conditions (1)–(4); the seam and caller rules against §2.9; verbatim quotes and discharge claims in every amendment resolved against their sources.
- **Reviewer.**
  - The full diff, including `git diff --stat origin/main...HEAD -- protocol/data-plane/` shown empty.
  - Condition (4), which is reviewer-checked.
  - Every discharge claim resolved to its named test or line.
  - Hashes recomputed for any pin (the architect has no shell).
- **Suites, green before either gate:**
  - `cargo test --workspace` (engine built with `fixture`), `cargo fmt --check`, `clippy`;
  - the shell's `vitest` and `tsc --noEmit`, and the shell E2E suite;
  - `node --test` over the scripts suite;
  - `verify:cites`, `verify:quotes` (a floor, not the proof);
  - the licence audit, showing no new crate or package;
  - each mutation in §4 run as a pre-gate self-check.
- **Operator.** None in this half: nothing is displayed. DRAFT-3's B1 E2E (hover attributes, `match` round-tripping through the viewer via the F7 pattern) and the sighting of the new strings belong to the shell half. ADR-023's acceptance (with condition (2)'s corrigendum and F6's two notes) happens at B1's close.
- **Merge order.** After crs-unit-fact-and-bounds and the watcher. The literal is computed at merge (§2.7).

## §10. Amendments

*(Opens empty; append-only.)*

---

# Stop list: choices no ruling covers yet (for the morning question round)

1. **ADR-017 §4 against the D2 amendments on the publish path (red line: an accepted ADR).** The shared gate would admit `Float32` and decoded dictionaries into bundles, while ADR-017 §4 refuses both.
   - *Recommend:* publish keeps §4's list, enforced at the publish site as a named bundle-format restriction, with byte-identical refusal text, until the bundle_version-2 ADR (B3) decides. See the skeleton below.
   - The same sight covers the two publish-surface deltas this draft declares:
     - (a) the `ceiling` field value becomes `MAX_PROJECTED_ATTRIBUTES`;
     - (b) the count check now runs before unknown-name resolution, which changes which refusal fires for an over-count list that also contains an unknown name.
2. **The ADR-021 filter namespace widens by reference (SKP-V0 §7.3).**
   - *Recommend:* `Float32` becomes filterable (surrogate `REAL`).
   - Dictionary columns stay **not filterable** in B1, with a named reason. DuckDB would compare them by enum position under `<`/`>` (H4), which exposes exactly the index order that amendment (b) forbids exposing.
   - The F1 fix lands whatever is ruled.
3. **The producer lands ahead of its consumer (round 8's exemption).** The non-null `columns` path and `projectable` have no product caller until the held shell half.
   - *Recommend:* your acceptance of this draft is the pre-commitment. It names B1's shell half (the hover readout under ADR-023 §6, `match` under §7, and the panel consuming `projectable`) as the consumer, and `shell-redesign-map-studio` as its gate. The PR body and PLAN name both.
   - The alternative is that the engine half is built and gated on its branch but merges only with the shell half.
4. **What `projectable` means.** The ported text says it is derived from `admit_attribute_type`, which alone would mark the identity column projectable, and the kernel then refuses it.
   - *Recommend:* the full per-column admission (type + not geometry + not identity) through one function, so the fact never contradicts the refusal.
5. **Condition (1) timing.**
   - *Recommend:* the engine half corrects `document.ts`'s sentence now, since the wire fact changes at this merge. `StyleDocumentV0`'s literal-only type stays for the shell half.
6. **If H2 holds (no dictionary type is reachable from `read_parquet`).**
   - *Recommend:* build the gate arm and the decode anyway. Prove them through the real chunk-loop function over an arrow-rs `DictionaryArray`, and record them as currently unreachable from `read_parquet` (the SKP-V0 §7.5 precedent).
   - The alternative is to admit in the gate and defer the decode, which would make `projectable: true` false for such a column.
7. **B1's branch base.**
   - *Recommend:* cut from `main` after the watcher merges, not stacked three deep. If code is wanted earlier, stack on the watcher's branch under the same merge-order rule.
8. **`known_columns` and a column name that contains a comma.**
   - *Recommend:* follow the `candidate_columns` form's SF6 omission, since ADR-023 §3 named that form, and have the Display text state that such names are omitted.

---

# Drafted amendment skeleton: ADR-017 amendment (proposed, for the human; covers stop item 1's recommended option)

- **Context.** ADR-023 §2 (RULED 2026-09-14, question set D, item D2) admits `Float32` unchanged and decodes dictionaries to their value type through `admit_attribute_type`, the one type gate shared with publish. ADR-017 §4's closed list refuses `float32` and every dictionary type, and ADR-017 §4's partition estimate has no 4-byte `float32` row. If the shared gate is widened silently, the bundle format changes without an ADR-017 decision.
- **Decision (proposed).**
  - The type policy stays one function.
  - ADR-017 §4's list is restated as a **bundle-format capability**: what a partition and the reader can carry. It is enforced at publish preflight on the admitted projection, and it refuses `float32` and dictionary-origin columns with today's refusal code and text, byte for byte.
  - Widening the bundle's list, including a `float32` row in the §4 estimate and the reader's decode, is deferred to the bundle_version-2 ADR (B3). It is never decided by B1.
- **Consequences.**
  - A `REAL` or ENUM column can be projected live but is refused at publish, by name, before any write.
  - B3 inherits the widening question.
  - Publish determinism and every published byte are unchanged.
  - The two lists stay a policy and a capability. They are never two admission policies.
