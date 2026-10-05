# MultiPolygon, MP-1 — admission, row decode, encoding selection, the envelope and `describe`, the shell's decode, picking and styling, and the publish refusal — preregistration

## Header

- **Status.** The preregistration of PLAN node `geometry-types-beyond-polygons` (`PLAN.yaml:1370-1386 @ 15bf4441 sha256:ff2e6004b3beed378d2c7a3dce1900a5a5df84dd45c841a8a5bb3156935a44c4`). Committed before any code. Append-only once committed. An amendment written after any outcome has been seen says so in its first line.
- **Form.** Full form, with full gating from dispatch (AUTONOMY §21a: wire, stated guarantee and ADR categories, plus §21c's size bound; §25(e)). No five-line form exists for this piece.
- **Authority:**
  - question round 17, item 7 (entry 126), with its two riders;
  - ADR-034, Accepted 2026-10-05 and architect-blockable, its Decision 1 to 10 and its Acceptance section;
  - the 2026-10-05 ADR-034 acceptance, items 1, 5 and 6 (`state/directives/2026-10-05-adr-034-acceptance.md:7 @ 15bf4441 sha256:79f708b0f70bb6199fbc03a58a0a23252331395ec129dd2114a4be21b7f984b7`, `state/directives/2026-10-05-adr-034-acceptance.md:11-12 @ 15bf4441 sha256:22729130028e0b27bc6c528dcd5924a36f5152dbca8827fe52c688436e4d102f`);
  - the 2026-09-27 session order, its MultiPolygon paragraph (`state/directives/2026-09-27-session-order.md:15 @ 15bf4441 sha256:c598bfedfc33d2f4ba11e9bc6b48fb3241c94a86e318631e0658524dc345a1d4`);
  - RULED 2026-09-24 (night), item (2) (literals follow merge order);
  - drafting by the architect: question round 43, item 2;
  - the owner's-index update: `state/directives/LEAD-DATA-PILOT-V2-2026-10-05.md` §1, item 2.
- **Drafted by** the architect agent on the custodian's brief. Inputs: lead-data's impact read (`state/consults/2026-10-05-geometry-types-beyond-polygons-impact-read.md`, sha256 6e4faa93fdfbe2541d0d9ae6bca20c82845848d5005d327fc4536a610d56a9df, read at 2d4fa886) and a re-read of main at 15bf4441. Read-only; the architect ran no command.
- **Reference form.**
  - Code and records at main are pinned `path:line @ 15bf4441 sha256:<hex>`.
  - A pin is historical. It is authoritative for the fact it names. The tree at the branch's base is authoritative for the edit, and the worker re-derives every site before editing.
  - Self-references are by section and item. The ledger is cited by round and item.
  - A cite the piece writes into code names its target by item, never by line.
- **Branch.** `cut/geometry-types-beyond-polygons`, cut from main when a product slot frees. It merges by a merge commit, never a squash, so that the golden commit (§6) and every commit the closing record names stay reachable. The custodian sets `merge: merge-commit` on the node (AUTONOMY §27).
- **Conditional parts.** Parts that depend on OPEN-1 are marked **[OPEN-1]**. The commit that bumps the literal (§9, commit 4) waits on the ruling.

## §0. Disclosure

- **Read:**
  - the impact read;
  - ADR-034 in full and its acceptance;
  - the assessment (`state/consults/2026-09-24-multipolygon-assessment.md`); its locators are unpinned and taken at a78d621, and none is used below without a re-read;
  - round 17 item 7's RULED block;
  - the session order;
  - this template, its Round 25 additions included;
  - AUTONOMY §21a to §21d and §25;
  - docs/08;
  - `state/directives/PORTABILITY-2026-09-30.md` §2;
  - the pilot directive;
  - the code sites cited below.
- **O5 evidence, not Authority.** The architect read the installed `@deck.gl/layers` sources under `frontends/shell/node_modules` (untracked). The lock resolves 9.3.9 (`frontends/shell/package-lock.json:476-477 @ 15bf4441 sha256:f9d6fdaf682757097443f98a342e7183aeee0cd1b30c3de79ef469ae140bf674`). `SolidPolygonLayer`'s picking-colour accessor encodes the datum index, and a datum's geometry is normalized as one polygon (rings, with holes). §2 V-1 re-verifies this at the branch base before any shell code.
- **Corpus.** `engine/compat-corpus/of-record/MANIFEST.json` entries #11 and #12 were read for §3's predictions. No corpus file was opened by this engine for this form.
- **Fixture drive:** nothing is measured.

## §1. What this preregistration may and may not claim

- **No performance number, no docs/08 row and no timing assertion.** docs/08 defines no multipart class (`docs/08_Testing.md:31 @ 15bf4441 sha256:60b234b36c6e0ad7d932dba0e2f6634907cc9aa9d940d89dd9f1f681bf16f528`). Every quantity below is an assertion (round 25, item 1 (a)).
- **Polygon-only byte identity is claimed exactly as §6's instrument proves it, and no further.** The publish stream's batch bytes and the published partitions and manifest are claimed byte-identical. For the viewport and projected streams, the schema and every row's payload are claimed identical. Their batch cut points are not claimed, because no reproducibility is declared for an unordered stream's cuts.
- **Copy:** the multipolygon encoding adds one offsets buffer and appends each coordinate once. The word zero-copy is not used (ADR-004).
- **No claim** about multipart rendering cost. The shell's per-part arrays are an unmeasured heap cost, disclosed at `MAX_RESIDENT_VERTICES`'s comment.
- **Operator wording.** Every new operator string is a P6 placeholder and the human's at P6 (acceptance item 6). The one exception is Decision 4's sighted `engine.geo_metadata` wording.
- **ADRs cited, none amended:** ADR-034, ADR-004, ADR-006, ADR-010 (rules 1, 2, 3 and 6), ADR-016 §5 and §7, ADR-017 §3 and §4 (byte-identical), ADR-018 and ADR-028. ADR-023 is Proposed and binds nothing.
- **May not claim** that any surface presents a promotion as the file's own type (rider 2), nor that counting a row as unread exists (acceptance item 5).

## §2. The change

The content is binding. The wording of code and comments is the worker's, except where a source is pinned.

### Engine

**E1. The readable set (Decision 1).**
- One `pub(crate)` declaration in `engine/src/geoarrow.rs`, {Polygon, MultiPolygon}, in that order.
- The admission gate and the refusal text both read it.

**E2. Admission (Decision 2, Decision 7; replaces `engine/src/dataset.rs:364-374 @ 15bf4441 sha256:30d834cceee7330a562af547081e2d87e674a2cd5d095bf47b362a6895261758`).**
- Type names compare case-insensitively, as today.
- A declared set whose members are all `Polygon` gives `GeometryEncoding::Polygon`.
- A non-empty set within the readable set that includes `MultiPolygon` gives `GeometryEncoding::MultiPolygon`.
- An explicit `[]` gives `GeometryEncoding::MultiPolygon`.
- Any member outside the readable set, mixed kinds and Z or M names included, is refused as `EngineError::GeoMetadata`.
  - The detail is Decision 4's sighted wording, `state/consults/2026-09-24-multipolygon-assessment.md:206 @ 6030dfd2814b sha256:ddae06db5d61fa8f420f73843d5e900805bbb9eb26341f5a53effa571cdc4be3` (a sub-line span; the hash is the line's).
  - Its bracketed placeholder is replaced by the declared list, rendered as `{:?}` renders it today (`engine/src/dataset.rs:370-373 @ 15bf4441 sha256:8f46e2a49ba793cdcd6a1d92ee34c020419839bc6a0c0d8b7ba4c96b957bb933`).
  - Its readable-set clause is built from E1's declaration.
  - The `Display` prefix is unchanged (`engine/src/error.rs:337 @ 15bf4441 sha256:e2f5d1fe288996be66a9c33a5eefba4e3a3db55bd1b087f12e02cc689d1ad061`).
- The WKB-encoding gate is unchanged (`engine/src/dataset.rs:358-363 @ 15bf4441 sha256:e26b3f6093335993e5392cf690fb64513e455d96f009c1c2a41e220ce88c7a8c`).
- **[OPEN-1]** Today `GeoMeta::parse` collapses an absent key and non-string members into the empty list (`engine/src/geoparquet.rs:399-408 @ 15bf4441 sha256:9a80870a2192cf7290a02d3013ea3e873510484746fef8bac65399366fea437f`). Under the recommended ruling:
  - (b1) the field becomes `Option<Vec<String>>`, `None` exactly when the key is absent, and an absent key takes the empty list's encoding;
  - (c1) a non-string member is refused at open as `EngineError::GeoMetadata`, with a `[P6 placeholder]` detail naming the member's position.

**E3. Accessors.**
- `pub enum GeometryEncoding { Polygon, MultiPolygon }` with `as_str()`, giving `geoarrow.polygon` or `geoarrow.multipolygon`, re-exported from `engine/src/lib.rs`.
- `Dataset::geometry_encoding()`. Its product callers are `describe_dataset` and the publish preflight.
- `Dataset::declared_geometry_types()`, returning the list as declared, in declared order, case preserved and empty kept empty. **[OPEN-1]** `Option` under (b1). Its product caller is `describe_dataset`.
- No other new `pub` item. New builders and validators are `pub(crate)`.

**E4. Row decode (Decision 3, O1 and O2 as ruled).** `engine/src/wkb.rs` gains a `pub(crate) MultiPolygonBuilder` with three offset levels: geometry, part, ring.
- **Under `MultiPolygon`:**
  - WKB type 6 decodes each part, with its own byte-order byte and type code.
  - A part's type must be exactly 3 with no EWKB flag.
  - WKB type 3 decodes as one part, coordinate bits carried through with no arithmetic.
- **Refused by name as `EngineError::Wkb`:**
  - zero parts;
  - a part with zero rings;
  - a part type other than 3;
  - EWKB flags on the header or a part;
  - a top-level type other than 3 or 6.
- **Under `Polygon`:** `PolygonBuilder::push_wkb` keeps type 3 only (`engine/src/wkb.rs:71-75 @ 15bf4441 sha256:e72b88a0f1a579c1cddfd93ed35e61f8ea1d300ff7ed6380757806df3cf283c4`), so a MultiPolygon row under `[Polygon]` is refused (O2).
- **What every refusal does.** It stops the stream at that row, by name, with nothing skipped. Its text states engine facts: the type met, and the types this open's encoding reads. It states no consequence.
- **New texts carry a `[P6 placeholder]` prefix.** That includes the reworded type-3 refusal, whose "reads polygons only" clause becomes false.
- **No allocation from a WKB count.** Counts only drive loops that read bytes.
- `encode_polygon` is unchanged. The multipolygon test encoder lives in `spatial_engine::fixture`, behind the `fixture` feature (E9).

**E5. Encoding (Decision 2).** `engine/src/geoarrow.rs` gains:
- the `geoarrow.multipolygon` extension name;
- its storage type, `List<polygons: List<rings: List<vertices: FixedSizeList<xy: f64>[2]>>>`;
- an array builder, through the existing `checked_offsets`;
- `geometry_field` writing the open's extension name;
- a validator selected by encoding;
- `coordinate_values` walking either nesting by offsets.

The polygon storage type, builder and validator are unchanged (`engine/src/geoarrow.rs:50-85 @ 15bf4441 sha256:c1d9a2e88ca94e6532a2b47321777ce8ec5edbc81c2997020a3bb953cb27aa71`, `engine/src/geoarrow.rs:193-235 @ 15bf4441 sha256:88bdfb01d2271fa157672fc80815ee7a98bda8e1d0c0f299364fb81ffa13ae53`).

**E6. Envelope (Decision 2).** `BatchEnvelope` carries the open's `GeometryEncoding`:
- `admitted` and `with_attributes` take it (`engine/src/envelope.rs:60-97 @ 15bf4441 sha256:6a0513e8a3b192f8b85df9e8e1157c3f862e940faa451b043ee8f7c69a29980a`);
- the test-only `new` uses `Polygon`;
- `geometry_encoding` is written from it (`engine/src/envelope.rs:209-213 @ 15bf4441 sha256:a600314c4ca5ce5e1b2ee03371bba76ce32cc1ee135bf13ba576ccd5cc911497`);
- `TaggedBatch::assemble` validates against it (`engine/src/envelope.rs:304 @ 15bf4441 sha256:90a198428f0ae9ac7457e36d0a50597ff8c44e914aa12d15933e20ac89bff3ca`);
- `xy_bounds` reads either nesting.

No other envelope key is added, so Polygon-only bytes stay as they are. The call sites are `engine/src/dataset.rs:591 @ 15bf4441 sha256:98efa946634f2e380989d0869698d259734a8ca3ab90eb8c5bb328d6d7357431`, `engine/src/stream.rs:938-943 @ 15bf4441 sha256:6f6d2f20c9a603274166c1f2f5f1869ccf1802a329ba90c377a7ef9a3c0e6ef1` and `engine/src/stream.rs:999-1004 @ 15bf4441 sha256:d78dce1f214a836fd693257487a0bd4479a9ec7fc1fa1390a3b29ef6b27efc64`.

**E7. Stream.**
- `Pending`'s builder becomes a two-arm enum chosen from the envelope's encoding (`engine/src/stream.rs:2131-2158 @ 15bf4441 sha256:8104fdd01377b87af3b8df3e254d757c3457fc9489a88883a8ddcd835f61097a`).
- The flush builds the matching array (`engine/src/stream.rs:2417 @ 15bf4441 sha256:0e336763f9cfdc27c5db440d7be3958b12010d4dd08f013274fa90e42343a790`).
- **`estimate_bytes` is not edited** (`engine/src/stream.rs:2214-2217 @ 15bf4441 sha256:396c198087c4410676cc3df3795e5213a0e5c18a768c15c8f99a8cf4e79828ff`). Its doc gains the declaration that its `vertices * 4` term bounds the part and ring offsets. Each part has at least one ring and each ring at least 4 vertices, so parts plus rings is at most vertices divided by 2. S-3 asserts this bound.
- Polygon cut points therefore depend on unchanged inputs only.

**E8. Module doc.** `engine/src/lib.rs:17-18 @ 15bf4441 sha256:a5a9f620bb5194e4581957c68362f9cdbfd77b48d16d16069ff46bc3008e2d15` states both encodings, chosen at open.

**E9. Test support behind the `fixture` feature.**
- `FixtureSpec` gains a geometry mode, defaulting to today's Polygon writer, byte-identical by G-1's fixture hash.
- `spatial_engine::fixture` gains a multipolygon WKB encoder and declared-list control.
- Its callers are tests and `engine/examples/make-fixture.rs`, on the existing feature-gated precedent. It is not product code.

**E10. LOD.** `engine/src/lod.rs` is not edited. Its by-name refusal stands (`engine/src/lod.rs:1549-1562 @ 15bf4441 sha256:2dbf6d030373305b97972745f1a67b41455c470dfbac158b42ad95d735e954f7`) and L-1 pins it.

### Kernel

**K1. `describe` (Decision 3, O3).** `describe_dataset` sets:
- `encoding` from `Dataset::geometry_encoding().as_str()`, replacing `kernel/src/skp.rs:1926 @ 15bf4441 sha256:199ee207a042de102563bf5df14be1d14c09b363369c79c5afb7d213a2c0b9cc`;
- `declared_types` from `Dataset::declared_geometry_types()`.

**K2. The publish refusal (Decision 10; the impact read's question 4).**
- **Placement.** In `preflight_pinless_parts`, immediately after the degrees check (`kernel/src/publish/mod.rs:472-483 @ 15bf4441 sha256:a838fe8a97bbd0c528997634b7592776e4c7bf70e92cc9a928389761ecd160d0`) and before `dataset_logical_uri`.
- **The check.** The dataset's encoding string is compared with `format_declaration().geometry_encoding` (`kernel/src/publish/mod.rs:1196-1208 @ 15bf4441 sha256:54296c9b73669ccead48f1155b62ec6e0f77a06ff59e3d3ae7c239ba0034cc87`). The refusal is therefore owned by the format and moves with it. The declaration's value stays `geoarrow.polygon`.
- **The variant.** A new `PublishError::GeometryEncodingNotPublishable { encoding: String, carried: String }`:
  - code `publish.geometry_encoding_not_publishable`;
  - `publish_outcome` → `Refused`;
  - `error_kind` → `GeometryEncodingNotPublishable`. Both matches are exhaustive with no wildcard (`kernel/src/publish/error.rs:229-257 @ 15bf4441 sha256:140d7e8083bb78af92d31562e88f508c9867cbb20572f9052cb1836d0e7daf73`, `kernel/src/permission/boundary.rs:220-243 @ 15bf4441 sha256:fee8c5b5ef615b42fdf61f6c303eb43bff8be5d401b4283ee6ed3967af00820d`, `kernel/src/permission/boundary.rs:276-303 @ 15bf4441 sha256:dc634ad9dae8eb2522a82af1bf464322af47c47bc682e4bf6a9c1aa8fe534a29`);
  - `Display` is a `[P6 placeholder]` stating the format fact: a version-1 bundle carries the declared encoding only, and this dataset's encoding is named.
- **Not an engine refusal.** It is never `PublishError::Engine`: that classes as failed, and the consequence belongs to the format.
- **Ordering.** A degrees dataset still refuses as `GeographicCrsNotPublishable`. That keeps #11 and #12 unchanged at publish.
- **No audit record.** The boundary's module doc adds the variant to its no-audit-record preflight list (`kernel/src/permission/boundary.rs:51-63 @ 15bf4441 sha256:7ce263b47d09da8f35d62d5bcae612f6a8a53ba3f3b3cbe926118400aecc8d3f`). The audit reader gains no arm, because no record can carry this kind, and its wildcard renders it (`kernel/src/permission/audit/reader.rs:282 @ 15bf4441 sha256:343a2ce0ac92760ceab43f825daea4719832dc4b37dfee8e07d14cd3bd63cc78`).
- **No shell guidance entry.** Guidance is new wording, P6. `formatPublishRefusal` parses the code generically (`frontends/shell/src/publish/formatPublishRefusal.ts:37-49 @ 15bf4441 sha256:5b533928b39ee008c4611e7e57a524b81be5073f106a42d1278faed1fc9943eb`).

### Protocol

**W1. `GeometryInfo` (O3).**
- It gains `declared_types` after `encoding`. **[OPEN-1]** Under (b1): `Option<Vec<String>>`, where `null` means the key is absent and `[]` means declared empty.
- `encoding`'s doc lists the two values (`protocol/skp/src/v0/commands.rs:165-177 @ 15bf4441 sha256:075a3562a6175c1924e80f2fc552d5af2731021a57bb1cdc9f33bd69a411107e`).
- `deny_unknown_fields` stays.

**W2. The literal and its fixtures, one commit** (§4 item 13, condition (iii): `protocol/skp/SKP-V0.md:279-311 @ 15bf4441 sha256:f778a3aa14706e5c4b809d0fb91641234ac9a35141e46ab99b736596c3e252ef`).
- **The number.** The literal after main's at the final merge (RULED 2026-09-24 (night), item (2)): `skp/0.9` while main stays at `skp/0.8` (`protocol/skp/src/v0/mod.rs:87 @ 15bf4441 sha256:43e75ec61eaab2ada5a35876ecd252bdfb626438b8be6be4ef893d77f19a25be`). A different number forced by an earlier merge is stated in the closing record, not amended.
- **Rust side:**
  - every fixture carrying the literal under `protocol/skp/tests/data/` and `protocol/skp/tests/conformance/fixtures/`;
  - the three describe fixtures gain `declared_types`;
  - `protocol/skp/tests/fixtures.rs`;
  - one appended paragraph in `protocol/skp/tests/conformance/README.md`, after `protocol/skp/tests/conformance/README.md:44-47 @ 15bf4441 sha256:55ee4a63e473039b30ee4711b89c4da5078bf7f77ab8e122e2739d7437b265d4`.
- **TS side, in the same commit:**
  - `frontends/shell/src/skp/types.ts` (literal, `GeometryInfo.declared_types`);
  - `frontends/shell/src/skp/__tests__/fixtures.test.ts`, `client.test.ts` and `admitDataset.test.ts`;
  - the hand-built describe literals in `App.test.ts`, `App.lateResult.test.tsx` and `AdmissionPanel.test.ts`.

**W3. SKP-V0.**
- §1's `describe` block is updated in place (`protocol/skp/SKP-V0.md:71-72 @ 15bf4441 sha256:431c64cee650565bdf19bcf2aa6e56f2ea29b1c4ed60c702bf306d5068dc1f37`). Its `geometry` line names both encoding values and `declared_types`.
- A new §8 version entry is appended at §8's end, as §8 stands after main is merged at the final merge. It records the field, the second value and §1's in-place update.
- §5 is unchanged: `engine.geo_metadata` and `engine.wkb` keep their codes with no fields.

### Shell (O8, O5, O6; Decisions 5 and 6)

**V-1, before any shell code.**
- **What.** The worker reads the installed `@deck.gl/layers` at the base and confirms O5's premise: one `SolidPolygonLayer` datum is one polygon, and its pick index is the datum index.
- **Where.** The worker report names the file and function read and the version from `package-lock.json`.
- **If false.** That is invalidator I-3.

**SH-A. Shape (O8).**
- `ResidentBatch.rings` is replaced by `parts`, indexed feature, then part, then ring, then `[x, y]`. A Polygon decodes as one part.
- `ResidentBatch` gains `partToRow: Int32Array` and `partCount`, built in the same pass as `ids` (`frontends/shell/src/canvas/decodeBatch.ts:29-39 @ 15bf4441 sha256:18f999997e63426594ad89a793b91ee031acd2cd72f150de470db54495ff0803`).

**SH-B. Encoding check.**
- `decodeBatch` takes the expected encoding and throws a typed `UnexpectedEncodingError`, whose message is a `[P6 placeholder]`. It throws when the batch's `geometry_encoding` differs from the expectation or is neither value.
- It walks two or three levels by the batch's own encoding (`frontends/shell/src/canvas/decodeBatch.ts:46-99 @ 15bf4441 sha256:69e785dda4b803b62a9a82055f9a458ca1ea3490b6d46b9754a0b5e6de1c8e39`).
- **The expectation's source.** `describe.geometry.encoding`, passed from `App.tsx` beside `geometryColumn` (`frontends/shell/src/App.tsx:1781 @ 15bf4441 sha256:2af1156bbe2a6225cdf3873fe6c7337d6ff074a361468100569604bbdac23033`) through a new `WorkingCanvas` prop to both decode sites (`frontends/shell/src/canvas/WorkingCanvas.tsx:1346 @ 15bf4441 sha256:6aa07af23315b492d137868d844ad1c4b0688a9fa1808d5b9ced7b2680b9a86d`, `frontends/shell/src/canvas/WorkingCanvas.tsx:1563 @ 15bf4441 sha256:6aa07af23315b492d137868d844ad1c4b0688a9fa1808d5b9ced7b2680b9a86d`).

**SH-C. Picking (Decision 6).**
- `resolvePick` bounds-checks against `partCount` and resolves ordinal → `partToRow` → row → id (`frontends/shell/src/canvas/pick.ts:128-136 @ 15bf4441 sha256:c8dbbbaf6a46ddcd8029c936a3ba69132b1f84ad5361d11def5549ce25fb64cc`).
- The anchor is the row's first part's exterior first vertex, so every part of a feature yields an identical `PickResult` (one hover).
- `PickResult` gains no field: no product caller needs the row.

**SH-D. Ceiling (ADR-010 rule 6).**
- Both product sites call `checkPickCeiling(batch.partCount)` (`frontends/shell/src/canvas/buildLayers.ts:262 @ 15bf4441 sha256:9501215bc695bbfd6aad0ef991b39095194f903907fd7edbb8af7e3e3f92836a`, `frontends/shell/src/canvas/residentSet.ts:73 @ 15bf4441 sha256:9501215bc695bbfd6aad0ef991b39095194f903907fd7edbb8af7e3e3f92836a`).
- `PickCeilingExceeded`'s message names pick ordinals (polygon parts), as a `[P6 placeholder]`.
- `MAX_RESIDENT_VERTICES`'s comment discloses the per-part arrays and `partToRow` as an unmeasured heap cost (`frontends/shell/src/canvas/limits.ts:22-45 @ 15bf4441 sha256:1ba8b8075c95644af571536f55e191a9475f316aff2c27025d11de7faaaee6ca`).

**SH-E. Every `parts` reader.**
- `buildLayers`: one datum per part, with the outline flattening every ring of every part (`frontends/shell/src/canvas/buildLayers.ts:142-171 @ 15bf4441 sha256:651421ae89715fdcf14e2e910c8f9868d95be02e4fcf063ac678efd7f061a367`).
- `extentOfBatch`: all parts (`frontends/shell/src/canvas/extent.ts:21-39 @ 15bf4441 sha256:7b4513c90ac9163cd92e5e8cedc2fefba8289aee79522135803e493fea0bb5ef`).
- `averageFeatureExtent`: union over a feature's parts (`frontends/shell/src/canvas/pickResolution.ts:90-115 @ 15bf4441 sha256:04e55fe3df9fd636d7ecfed7d08b07695b349d0c693314a72f3257ee16cee7c7`).
- `trimBatchToVertexBudget`: whole features with all their parts, `partToRow` a prefix (ADR-028; `frontends/shell/src/canvas/tileIngest.ts:205-224 @ 15bf4441 sha256:dadfe6721d422d483bae9549d0af108da494d787c2474f0cba78e7dc9888a7ce`). The injected signature at `frontends/shell/src/canvas/tileIngest.ts:130 @ 15bf4441 sha256:d95497a68db2ffdbb734e3bbd3ecd786aba08ebf26004f87da7a0d585e4d582c` changes with it.
- `TileResidentSet.addBatch`'s rebuild: parts carried per kept feature, `partToRow` re-indexed (`frontends/shell/src/canvas/tileResidentSet.ts:225-240 @ 15bf4441 sha256:f42e503d890544464806cc8754ba9434fa33b79f281e5ecf382ba7926c678b4f`).
- The trace sample at `frontends/shell/src/canvas/WorkingCanvas.tsx:1419 @ 15bf4441 sha256:7d4c352ea7c29b84f7aaa1b83607e7e61af5fb159927b79a375e1c3ce1b21aa4`.
- `PICKING.md`'s sentence naming the `ids`/`rings` arrays (`frontends/shell/src/canvas/PICKING.md:15-18 @ 15bf4441 sha256:4611fe74225e72bfba0d03eb67ad347878b19c12765e7b5fa18a7fda08593e1d`).

**SH-F. Describe display (O3; rider 2).**
- The Geometry row keeps its `<dd>` text, `{column} ({encoding})`, so the E2E expectation holds (`frontends/shell/e2e/regression.mjs:372 @ 15bf4441 sha256:ca90acd8c8245f3ffc32f56e680d9ac573556a7929c007a45e4e5b08cbac1851`).
- Its `<dt>` becomes a `[P6 placeholder]` label naming the value as the engine's encoding.
- A new row gives the file's declaration, with a `[P6 placeholder]` `<dt>`. Its `<dd>` is the list as declared. Distinct `[P6 placeholder]` texts cover `[]` and **[OPEN-1]** `null` (`frontends/shell/src/admission/DescribeSummary.tsx:31-34 @ 15bf4441 sha256:17bdc706dadeea24da784b9272d89e83d5cb0cc01b5704c08d1a9eef4d13eee5`; the line function lives in `describeSummaryText.ts`).
- No text calls the encoding the file's type.

**SH-G. Publish.** No shell product change. K-5 proves the prepare path.

**O6, the attribute seam.**
- MP-1 adds no attribute lookup, callback or row accessor.
- `b1-shell-half` is held and lands second. It writes its lookup against MP-1's merged `partToRow` and `resolvePick` and proves it end to end. The custodian records that on the node's summary in the done commit.

### Portability

The feature is not OS-dependent, so R3's section is not required.
- **R1:** decode and selection are pure and identical on every platform.
- **R2 and R4:** no `cfg` in product code and no path literal.
- **R5:** no level claim.
- **R6:** two new ignores, neither new to its kind:
  - L-1 takes the LOD-tier boundary's existing `cfg_attr(not(windows), ignore = …)` (precedent `engine/tests/lod_tier_builder.rs:494-499 @ 15bf4441 sha256:9aac6720b20e731b18b45a552fc81398caf2f63c5a74d79b8214f3dbf2943a06`; deferral recorded in `engine/LOD-PREREGISTRATION.md` Amendment 8(a));
  - C-12S is ignored for the on-disk corpus, as the P4 generator is.

### KNOWN-LIMITATIONS

New items go under "On main since v0.1.0" (`KNOWN-LIMITATIONS.md:189-192 @ 15bf4441 sha256:2df896f3f6f734ee402d1bfc8981935785b10a281ef23568baf7595311eaa2f3`), numbered from 31 (item 29 does not exist). Each carries a source comment and is marked as draft wording for the human's sight at P6.
- **S-K1.** Main reads Polygon and MultiPolygon, and other declared types are refused (the sighted text, by reference to the code). A row of a type the open's encoding does not read stops the stream by name, and nothing is skipped.
- **S-K2 (acceptance item 1).** A dataset encoded as MultiPolygon is refused at publish. That includes a projected, Polygon-only file whose `geometry_types` is empty, **[OPEN-1]** or absent under (b1).
- **S-K3 (ADR-034 Consequences, LOD).** The tier builder, which no product path calls yet, refuses a MultiPolygon feature by name.
- **S-K4.** Overlapping parts of an invalid MultiPolygon are filled once per part on the canvas, so with fill opacity below 1 the overlap is drawn darker. The engine repairs nothing.
- **Not edited:**
  - item 9's text, which is true of the v0.1.0 artifact;
  - `README.md`, which describes v0.1.0.
- **In-scope class-3 fixes in this file:**
  - item 9's source comment is pinned at the v0.1.0 tag commit, after the worker verifies the lines there (`KNOWN-LIMITATIONS.md:115 @ 15bf4441 sha256:a633e03fb16ade8412db8739d25b676e832660f4ac336bbc6a45d0a209c45020`);
  - item 21's source comment is repointed by item (`KNOWN-LIMITATIONS.md:253 @ 15bf4441 sha256:664e3c71bd2b9d0c076491b37618f2352abfaad650a28d573c85193579b28e90`).

### Owner's index (applied in the PR; lead-data's text)

- `engine/README.md`, its "Owner's index":
  - `Last verified at`;
  - Interfaces → Open and admission (pinned-by gains A-1);
  - Interfaces → Viewport stream, envelope, batch sizing (gains S-1 and G-1);
  - Interfaces → LOD tier builder (gains L-1);
  - Governed by → accepted ADRs (+ADR-034) and preregistrations in this module (+this form);
  - Declared limits (+S-K1, S-K3, S-K4).
- `kernel/README.md`, its "Owner's index":
  - `Last verified at`;
  - Interfaces → SKP v0 host (gains K-1);
  - Interfaces → Publish and the bundle format (gains K-2);
  - Governed by → accepted ADRs (+ADR-034) and kernel halves of pieces filed elsewhere (+this form);
  - Declared limits (+S-K2).
- Both stay within the 60-line cap.

## §3. Fixtures and corpus, with outcomes predicted before any run

The purpose-written fixtures come from `spatial_engine::fixture` and are hash-verified before and after each test that generates them.

| id | fixture | predicted |
|---|---|---|
| F-1 | LV95, declared `[MultiPolygon]`. Row 0 has 3 parts, the 2nd with a hole; row 1 has 1 part; row 2 has 2 parts. Part ordinal ≠ row index | admitted, `geoarrow.multipolygon`, 3 rows, bit-identical coordinates; publish refused K2 |
| F-2 | LV95, `[Polygon, MultiPolygon]`, alternating rows | admitted, multipolygon; Polygon rows are one part |
| F-3 | LV95, explicit `[]`, Polygon rows only | multipolygon; `declared_types` `[]`; publish refused K2 (the accepted loss) |
| F-4 | **[OPEN-1]** key absent, Polygon rows | (b1): multipolygon, `declared_types` null |
| F-5 | **[OPEN-1]** a non-string member | (c1): refused `engine.geo_metadata` at open |
| F-6 | `[Point]` | refused `engine.geo_metadata`, sighted text |
| F-7 | `[Polygon, LineString]`; `["Polygon Z"]` | refused `engine.geo_metadata` |
| F-8 | `["polygon"]` | `geoarrow.polygon`; `declared_types` `["polygon"]` |
| F-9 | `[Polygon]` with one MultiPolygon row | stream refused `engine.wkb` at that row (O2) |
| F-10 | `[Polygon, MultiPolygon]` with one Point row | stream refused `engine.wkb` (O2) |
| F-11 | `[]` with one Point row | stream refused `engine.wkb` (O1) |
| F-12 | `[MultiPolygon]` rows: zero parts; a zero-ring part; a part typed 6; an EWKB-flagged part; mixed byte-order parts | each refused `engine.wkb` by name, except mixed byte order, which decodes |
| F-13 | F-1 written in CRS84 degrees | publish refuses `GeographicCrsNotPublishable`, not K2 |
| BF | engine-produced IPC, one LV95 polygon batch and one F-1 batch, committed under `engine/tests/data/geoarrow/` | bytes equal the engine's current output (BF-1) |

**Corpus #11 and #12. These predictions are registered here, the impact read's question 3.**
- `engine/ADMISSION-PREREGISTRATION.md` is append-only and is not edited (`engine/ADMISSION-PREREGISTRATION.md:5 @ 15bf4441 sha256:42163a4e0d3f404feff95f74176a84f2bd3c59891666c87a737c85099e18830b`). Its rows 11 and 12 registered the Brief A run under the held gate (`engine/ADMISSION-PREREGISTRATION.md:94-95 @ 15bf4441 sha256:a0eb5eea93679250bd7df5d85102983c9b9cb97ca8e36c8bd2df79d003fc5f7d`).
- From this form's merge, the P4 generator's rows #11 and #12 and its P1 literal cite this section and §5 (`engine/tests/admission_p4_corpus.rs:268-289 @ 15bf4441 sha256:ea82ad9577776e5f2a7c04eeace7db4bb53864715bdbd376eda1e4014c63851b`, `engine/tests/admission_p4_corpus.rs:1052 @ 15bf4441 sha256:545eb54e797d164a8ff65551379466e58bd74c39d0ea5bdd8ce483086e35bd53`).
- The re-run regenerates `engine/ADMISSION-RESULTS.md`, never hand-edited. The prior run stays reachable at its commit.

| row | predicted |
|---|---|
| C-11 | Admitted-as-declared. The declared CRS is x-first, so no format rule applies, and the unpinned 2.0.0 does not matter (`engine/compat-corpus/of-record/MANIFEST.json:2393 @ 15bf4441 sha256:57b4179d0ed1a25274c0a1c6629d244a1798b20a1056358ded74a3a7e192c329`, `engine/compat-corpus/of-record/MANIFEST.json:2410-2424 @ 15bf4441 sha256:2af4c781d2dbab209b8b9f56d1cdd0f8fed01af235944e7a0b318a1c72d42271`). Sanity `none`. Session-ordinal: no `id` column (`engine/compat-corpus/of-record/MANIFEST.json:2442-2473 @ 15bf4441 sha256:8eef5eb5001134de12ca728df22ee9cf4fe10a7dbfa0535fd4724ec183aecbfa`). Encoding `geoarrow.multipolygon`; `declared_types` `[Polygon, MultiPolygon]`. A viewport query refuses `engine.no_covering_bbox`, which is unchanged (no covering: `engine/compat-corpus/of-record/MANIFEST.json:2425-2426 @ 15bf4441 sha256:869f60ec9bcb33697d0460a4fd8042a013a50996961fb8236fe43a5b5aa2c03f`; `engine/src/stream.rs:1471 @ 15bf4441 sha256:ab6c938354fe623d9ad30f221c42a5e6d66297539423a8a3dd4cc232a9286c93`). So #11 opens and describes, and does not reach the canvas. |
| C-12 | Admitted under the format rule, `crs:format-default` (absent key, 1.1.0 pinned: `engine/compat-corpus/of-record/MANIFEST.json:2516 @ 15bf4441 sha256:a4eee66181e266bce26d01d449e15d81152eb90cf92a919853f065bae421c30e`, `engine/compat-corpus/of-record/MANIFEST.json:2533-2534 @ 15bf4441 sha256:cf7fc7793a9ebca2723d0f7b68a6c7f7cd79b2aa98702b89343794974da9aeb7`). Not convicted: the bbox requested is inside the degree domain. Sanity level and identity class are not derivable statically (covering statistics, and a nullable string `id`: `engine/compat-corpus/of-record/MANIFEST.json:2569-2573 @ 15bf4441 sha256:556f2fca23e1d53a5d50a2f330d14006e0e4d905c0c12bffe8e9af50ca905c7c`); both are recorded at the re-run. Encoding `geoarrow.multipolygon`; `declared_types` `[MultiPolygon, Polygon]`. The boundary-8 publish component is unrun, with its reason, as rows #3 and #8. |
| C-12S | Streaming #12 whole-file yields 1,375 rows, one per feature, with unique ids and no refusal. Wrong is a result. |

## §4. Tests, and the mutation per new test

- **How a mutation is observed.** It is applied, the named test is run, the failure is recorded by name with the commit it was observed at, and the mutation is reverted (round 25, item 2 (c)). No `verify-mutation` run is an observation.
- **Where the record lives.** Each test's comment carries its mutation and observation commit.
- **The real shape.** Rows marked RS consume the engine's own bytes or a real open (the cross-module seam rule).

| row | test (file) | asserts | mutation, which fails it by name |
|---|---|---|---|
| E-1 | `wkb.rs` unit | F-1's row 0 offsets at three levels, exact | push the part offset before the part's rings |
| E-2 | `wkb.rs` unit | a Polygon row under MultiPolygon is one part, with coordinate bits identical | narrow promoted coordinates through `f32` |
| E-3 | `wkb.rs` unit | F-12's refusals each typed `Wkb`, naming the type met | delete the per-part type check |
| E-4 | `wkb.rs` unit | `PolygonBuilder` still refuses type 6 | accept type 6 in `PolygonBuilder` |
| E-5 | `wkb.rs` unit | mixed byte-order parts decode to the same values | read part headers with the outer byte order |
| E-6 | `geoarrow.rs` unit | the multipolygon storage type; each validator refuses the other's array | drop the third level from the multipolygon comparison |
| E-7 | `geoarrow.rs` unit | `coordinate_values` over a sliced multipolygon array returns the slice's run only | return the whole child buffer |
| E-8 | `envelope.rs` unit | the envelope `geometry_encoding` equals the field's extension name, for both values | write `EXT_NAME_POLYGON` unconditionally |
| A-1 | `engine/tests/geometry_admission.rs` | F-1 to F-3 and F-6 to F-8: encoding or refusal per row | map a set equal to {Polygon} to MultiPolygon |
| A-2 | same | F-6's detail byte-equal to the sighted wording with its list rendered | join the readable set with `, ` |
| A-3 | same | each member of E1's declaration admits; the refusal lists them in order (Decision 1) | hard-code the text's readable set to `Polygon` |
| A-4 | same, **[OPEN-1]** | F-4 and F-5 per the ruling | treat absent as `[Polygon]` |
| S-1 | `engine/tests/multipolygon_stream.rs`, RS | F-1 and F-2 stream one row per feature, unique ids, parts and coordinates bit-identical to the WKB | emit one row per part |
| S-2 | same | F-9 to F-11 end typed `engine.wkb` at the row; no later batch; text carries `[P6 placeholder]` | skip the unreadable row |
| S-3 | same | for every batch of F-1 at a small target, geometry buffer bytes ≤ the `estimate_bytes` geometry share | in `estimate_bytes`, `(rows + vertices) * 4` to `rows * 4` |
| G-1 | `engine/tests/polygon_wire_golden.rs`, RS | §6 instrument, engine half | select MultiPolygon for `[Polygon]` |
| BF-1 | `engine/tests/geoarrow_batch_fixtures.rs`, RS | BF bytes equal the engine's output from a real open and stream | change one coordinate in the BF writer |
| L-1 | `engine/tests/lod_tier_builder.rs` (LOD ignore) | `build_tiers` on F-1 refuses `Wkb` naming MultiPolygon; no tier written | accept a MultiPolygon's first part as the Polygon |
| C-12S | `engine/tests/multipolygon_corpus.rs` (`#[ignore]`, on-disk corpus) | §3 C-12S | as G-1 |
| K-1 | `kernel/src/skp.rs` tests, beside `the_real_describe_crs_shape_matches_the_shared_fixture` (`kernel/src/skp.rs:2931 @ 15bf4441 sha256:423e0f432286773afcf09c53d0e12cab06d8c298c3083e525100610d6caef447`), RS | a real open plus `describe` of F-1, F-3 and a Polygon fixture: `encoding`, `declared_types` (`[]` kept), and a key set equal to the shared fixture's `geometry` | hard-code `geoarrow.polygon` in `describe_dataset` |
| K-2 | `kernel/tests/publish.rs`, RS | F-1 and F-3: `preflight_pinless` returns the new variant, no destination exists, the source is not pinned | delete the check |
| K-3 | same | F-13 refuses `GeographicCrsNotPublishable` | move the check above the degrees check |
| K-4 | `kernel/tests/typed_terminal_codes.rs` | `refusal_detail` begins `publish.geometry_encoding_not_publishable: ` | change the code's string |
| G-2 | `kernel/tests/publish_partition_golden.rs`, RS | §6 instrument, publish half | as G-1 |
| K-5 | `frontends/shell/src-tauri/src/publish.rs` tests, on `a_license_refusal_reaches_prepare_with_progress_before_any_pin_is_taken`'s shape, RS | F-1 through prepare: `Refused` carrying the code, no pin taken | move the check into `preflight` after `content_pin` |
| P-2 | `protocol/skp/tests/fixtures.rs` and `fixtures.test.ts` | `declared_types: []` round-trips as `[]`, not omitted or null, on both sides | `skip_serializing_if` on an empty list |
| SH-1 | `decodeBatch.test.ts`, RS (BF) | the engine's F-1 batch: parts, `partToRow`, `partCount`, `totalVertices` | walk the multipolygon one level short |
| SH-2 | same | a mismatched or unknown `geometry_encoding` throws `UnexpectedEncodingError` | delete the check |
| SH-3 | same, RS (BF) | the engine's polygon batch gives one part per feature | read a part level under `geoarrow.polygon` |
| SH-4 | `pick.test.ts`, RS (BF) | an ordinal on row 1's part (≠ 1) resolves row 1's id; two parts of row 0 give identical results | index `ids` by the ordinal |
| SH-5 | `buildLayers.test.ts`, `residentSet.test.ts` | both sites pass `partCount` to `checkPickCeiling` (spied) | pass `ids.length` at either site |
| SH-6 | `extent.test.ts`, `pickResolution.test.ts` | a feature with two distant parts has one extent spanning both | read part 0 only |
| SH-7 | `tileIngest.test.ts`, `tileResidentSet.test.ts` | trim and dedupe keep features whole; `partToRow` consistent | slice parts by feature count |
| SH-8 | `buildLayers.test.ts` (styling) | one datum per part, all with the style's fill; the outline holds every ring of every part | one datum per feature |
| SH-9 | the describe-summary test | `[]` and **[OPEN-1]** `null` render distinctly, each labelled; the Polygon Geometry row still contains `geometry (geoarrow.polygon)` | render `[]` and `null` alike |
| V-2 | `renderer/bundle-viewer/scripts/` (one new test), RS (BF) | the engine's F-1 batch as a partition refuses `envelope-encoding-mismatch` (`renderer/bundle-viewer/src/partition.ts:123-129 @ 15bf4441 sha256:0c95081b1d1228773ba81ad9af668b91da412993d489ef2358b68eac8c40ea35`) | delete the encoding check |
| E2E | `frontends/shell/e2e/regression.mjs`, a new step | F-1 opens; the summary shows `geoarrow.multipolygon`; the stream ends clean | (operator-run; no mutation) |

**Changed tests, real shape unchanged:**
- the hand-built `ResidentBatch` and describe literals in the shell tests, migrated to `parts` and `declared_types`;
- the three describe fixtures, the literal everywhere, and the generator rows #11 and #12 with P1.

**Not pinned here, with the reason:** `kernel/examples/verify-bundle.rs`'s prefix check. Aligning it is MP-2's (ADR-034 Consequences), and K-2 proves MP-1 writes no multipolygon bundle.

## §5. Predictions · declared unchanged · invalidators · falsification

**Predictions (wrong is a result):**
- **P-1.** §3's F rows, C-11, C-12 and C-12S.
- **P-2.** The re-run's P1 set is #2, #4 and #5, with the sighted text. Every other corpus row's outcome equals `engine/ADMISSION-RESULTS.md` at 15bf4441.
- **P-3.** G-1 and G-2 are green at the golden commit and at the head.
- **P-4.** V-1 holds at 9.3.9.
- **P-5.** The workspace suite at the head has the base's passed set plus §4's new tests, and the base's ignored set plus L-1 (off Windows) and C-12S.

**Declared unchanged:**
- Polygon-only stream and publish bytes as §6 states them;
- `format_declaration`'s values and ADR-017 §4;
- `estimate_bytes`, every ceiling's value, and `PolygonBuilder`'s type-3 path;
- `engine/src/lod.rs`;
- the bundle viewer's and the canvas probe's product code, and `kernel/examples/verify-bundle.rs`;
- `protocol/data-plane/`;
- `engine/ADMISSION-PREREGISTRATION.md` and every other form;
- KNOWN-LIMITATIONS items 1 to 30's text;
- docs/08 and every ADR.

**Invalidators (stop and return to the architect; nothing is adjusted to pass):**
- **I-1.** G-1 or G-2 fails at the golden commit, or the default fixture's hash changes.
- **I-2.** Any Polygon-only byte in §6 changes at the head.
- **I-3.** V-1's premise is false.
- **I-4.** S-3 fails, meaning the estimate does not bound the third level.
- **I-5.** BF-1 is not stable across the CI platforms.
- **I-6.** Either pick-ceiling site cannot count parts.
- **I-7.** The literal commit is reached with OPEN-1 unruled.
- **I-8.** A refusal cannot state the type met without stating another module's consequence.

**Falsification.** Decision 2 proves unimplementable without changing Polygon-only bytes, which would make ADR-034's first Consequence false.

## §6. Instruments (the impact read's question 2)

All quantities are assertions. None is a measurement.
- **The golden commit.**
  - **What.** The branch's first commit adds only G-1, G-2 and their golden files. It has no product line.
  - **The goldens.** Computed at that commit and green there:
    - the default fixture file's sha256;
    - per-batch IPC sha256 of `stream_for_publish`, whose ordered, flat plan declares its cuts reproducible;
    - for `stream_with_cancel` and `stream_projected_with_cancel`, the schema metadata map and the field's metadata and type, plus the id-keyed multiset of each row's geometry offsets and coordinate bits;
    - for the publish fixture of `kernel/tests/publish.rs:72-86 @ 15bf4441 sha256:f00ebfd83b14cd1f6b37c862ba2a51c4273182ab7d7c24c0b6578c80301f551a`, the manifest bytes' sha256 and each partition's sha256.
  - **The proof.** The same tests green at the head prove identity. The reviewer re-runs both at the golden commit and at the head. Until merge, the golden commit is named by its id in words (round 25, item 2 (d)).
- **Can the per-part declaration move a polygon cut? No.** `estimate_bytes` is not edited (E7). The polygon path's inputs (rows, vertices, attribute bytes) do not change. G-1's publish half detects any moved cut.

## §7. Declared values and ceilings

- **The readable set** {Polygon, MultiPolygon}, declared once (E1).
- **No new ceiling.** `MAX_BATCH_BYTES`, `MAX_ROWS_PER_BATCH` and `PUBLISH_PARTITION_TARGET_BYTES` bound multipolygon batches through the unchanged estimate (S-3).
- `DECKGL_PICK_INDEX_CEILING` is counted in parts (SH-D).
- `MAX_RESIDENT_VERTICES` is unchanged, with the per-part arrays disclosed as unmeasured.

**Line budget, by §21c's rule** (insertions plus deletions, tests included; this form excluded; `engine/ADMISSION-RESULTS.md` excluded as generated; the binary files counted as files only):

| group | files | ceiling |
|---|---|---|
| engine product | `wkb.rs`, `geoarrow.rs`, `envelope.rs`, `stream.rs`, `dataset.rs`, `geoparquet.rs` [OPEN-1], `lib.rs`, `fixture.rs` | ≤ 1,200 |
| engine tests | the five new files, `lod_tier_builder.rs`, `admission_p4_corpus.rs`, golden data, BF (2 binary) | ≤ 1,150 |
| kernel | `skp.rs`, `publish/mod.rs`, `publish/error.rs`, `permission/boundary.rs`, `tests/publish.rs`, `tests/typed_terminal_codes.rs`, `tests/publish_partition_golden.rs` + data | ≤ 560 |
| protocol | `commands.rs`, `mod.rs`, `SKP-V0.md`, `tests/fixtures.rs`, `tests/data/*.json`, `tests/conformance/**` (literal, in place) | ≤ 330 |
| shell product | the 14 files of SH-A to SH-F, `PICKING.md` | ≤ 460 |
| shell tests and seams | the shell tests named in §4 and W2, `e2e/regression.mjs`, `src-tauri/src/publish.rs`, the viewer test | ≤ 820 |
| docs | `KNOWN-LIMITATIONS.md`, `engine/README.md`, `kernel/README.md`, `frontends/shell/MANUAL-WALKTHROUGH.md` | ≤ 130 |
| **Total** | **≤ 80 files** | **≤ 4,500** |

**Counting command, at a named commit:** `git diff --numstat $(git merge-base origin/main HEAD) HEAD -- . ':!engine/MULTIPOLYGON-MP1-PREREGISTRATION.md' ':!engine/ADMISSION-RESULTS.md'`. An overrun is class 8, and this section is never edited.

## §8. Block-on-sight (each checked separately)

1. Any Polygon-only byte change in §6, or a golden computed after a product line.
2. The encoding varies per batch, or the envelope, `describe` and the batch disagree (Decision 2).
3. Parts become rows, or any id repeats within a batch for one feature (Decision 5).
4. Either `checkPickCeiling` site counts features (Decision 6).
5. Any surface presents a promotion as the file's type, or shows `encoding` and `declared_types` unlabelled side by side (rider 2).
6. A row of an unread type is skipped, or counted as unread (acceptance item 5).
7. The `engine.geo_metadata` detail is not byte-equal to the sighted wording as rendered, or its readable set is not read from E1.
8. A new operator string without `[P6 placeholder]`, or an engine message stating another module's consequence.
9. The publish refusal carried as `PublishError::Engine`, placed after the pin, or before the degrees check.
10. An edit to ADR-017, `format_declaration`'s values, `estimate_bytes`, `engine/src/lod.rs`, `protocol/data-plane/` or `engine/ADMISSION-PREREGISTRATION.md`.
11. A new `pub` item, option, callback or path with no product caller. `fixture` stays feature-gated, and there is no attribute hook for B1.
12. The literal bump not in one commit with both sides' fixtures, or the §8 entry not at §8's end.
13. **[OPEN-1]** Code for the absent-key or non-string states before the ruling.
14. The word zero-copy, a performance number or a timing assertion.
15. A new `cfg` or platform ignore beyond §2's Portability.
16. The round-25 items, by name:
    - an overrun not recorded as class 8, or §7 edited to match;
    - a scope addition not recorded as class 9, or any code of it before its amendment;
    - a record calling a `verify-mutation` run an observation;
    - a test-text span on the branch pinned by hash at a branch commit, or named without its commit id;
    - a five-line form for this piece.
17. Quotation marks around text not byte-identical to its named source; a line cite into the ledger; a bare self-line.
18. An index edit outside §2's listed sections, or an index over 60 lines.

## §9. Gates

**Commit plan.** Each commit is signed off, and the branch merges by a merge commit.
1. The golden commit (§6).
2. Engine (E1 to E9) with its tests.
3. Kernel (K1, K2) with its tests.
4. Wire (W1 to W3), the literal bump and both sides' fixtures, after OPEN-1 is ruled.
5. Shell (SH-A to SH-F), K-5, V-2 and the E2E step.
6. Docs: S-K1 to S-K4, the indexes, Part S of the walkthrough, and the P4 re-run.

**Architect** (full gating):
- §8, item by item;
- ADR-034 Decisions 1 to 10 against the diff;
- the riders and acceptance items 1, 5 and 6;
- ADR-010 rules 1, 2 and 6; ADR-016 §5; ADR-017 §4 unchanged;
- SKP-V0 §4 item 13;
- the seam rule for each RS row and for O6;
- verbatim quotes and discharge claims resolved;
- the round-25 checks.

**Reviewer:**
- the full diff with `origin/main...HEAD`;
- G-1 and G-2 re-run at the golden commit and at the head;
- every mutation re-made;
- §7's count by its command;
- every hash recomputed;
- V-1's read checked against the lock;
- `ADMISSION-RESULTS.md` checked as the generator's own output;
- the index lines checked against the diff.

**Suites, green before either gate:**
- `cargo test --workspace --locked --features spatial-engine/fixture`, `cargo fmt --check` and clippy;
- the shell's unit suite and type check;
- the viewer's `node --test`;
- `node --test scripts/plan/*.test.mjs scripts/hooks/*.test.mjs`;
- `verify.mjs`, `queue --check`, `site --check`, `verify-cites`, `verify-quotes` (a floor) and `verify-test-claims`;
- CI green at the reviewed commit.

**Operator.** `frontends/shell/MANUAL-WALKTHROUGH.md` gains Part S, appended at its end, with blank result logs, queued for the next sitting:
- **S1.** Corpus #12 on the canvas: it renders, and a hover on a multi-part building resolves one id.
- **S2.** F-1 (LV95): hover two parts of one feature, which give the same readout.
- **S3.** Publish F-1: the refusal is shown.
- **S4.** The describe labels and the placeholder strings, for the human's wording.

**PR body:**
- asks for a merge commit, never a squash;
- names the golden commit by id;
- names OPEN-1's ruling.

**Closing record (after the merge; references and hashes only):**
1. The PR, its merge commit and the reviewed head.
2. The gate report paths.
3. The worker report, by section.
4. The golden commit, and its golden files pinned at the merge commit with their hashes.
5. Each mutation's observation commit.
6. The literal minted.
7. The re-run's `ADMISSION-RESULTS.md` pinned at the merge commit.
8. Each done item names its proof by test name: Decisions 1 to 10 by §4's rows, O3 to O8 by §2's items, and acceptance item 1 by S-K2.
9. §7's count.
10. PLAN set to done with `{pr}` in the done commit only, with O6's line added to `b1-shell-half`.

## §10. Amendments

*(Opens empty; append-only.)*
