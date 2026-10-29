# Points — admission, row decode, encoding selection, the envelope and `describe`, the shell's decode, drawing, picking and styling, and the publish refusal — preregistration

## Header

- **Status.** The preregistration of PLAN node `geometry-points-cut` (`PLAN.yaml:2279-2295 @ 7e3a00a6 sha256:dc93752dda38945f36f072023e1a70b6af9ef461476181050d96b4bc93ee277a`). Committed before any code. Append-only once committed. An amendment written after any outcome has been seen says so in its first line.
- **Form.** Full form, full gating from dispatch (AUTONOMY §21a: wire, stated guarantee and ADR categories, and §21c's size bound; §25(e)). No five-line form exists for this piece.
- **Authority:**
  - the product-first direction, section 4 (the order) and section 8.c (placement): `state/directives/2026-10-05-product-first-direction.md:19 @ 7e3a00a6 sha256:6b83a5387d8d511d324a992658af70614661aabb1e927aaff39273a1ce56b2c4`, `state/directives/2026-10-05-product-first-direction.md:30 @ 7e3a00a6 sha256:de5761eeee86d45746c969e980fc262a314b55a251bc2a7fd6001ca5b68f6a77`;
  - ADR-034, Accepted and architect-blockable. Its Consequences paragraph on points and lines binds this cut: `docs/adr/ADR-034-geometry-type-admission-and-geoarrow-encoding-selection.md:139-149 @ 7e3a00a6 sha256:9f4694ef421fa4d8ecebe69f435b3f2efe8b4f8137dc262f46cde2b2f7a468b8`;
  - the 2026-10-05 ADR-034 acceptance, items 5 and 6: `state/directives/2026-10-05-adr-034-acceptance.md:11-12 @ 7e3a00a6 sha256:22729130028e0b27bc6c528dcd5924a36f5152dbca8827fe52c688436e4d102f`;
  - MP-1's closing record, Amendment 6, item 12, routing C-n1 and DR-3 here: `engine/MULTIPOLYGON-MP1-PREREGISTRATION.md:712-714 @ 7e3a00a6 sha256:5cf5205a6d42f942aceac913a3320a8e75eba9ab6679641b62719f71a6df3c2c`;
  - RULED 2026-09-24 (night), item (2): literals follow merge order;
  - drafting by the architect, question round 43, item 2;
  - the owner's-index update by the implementing worker, in the same PR: `state/directives/2026-10-05-product-first-direction.md:11 @ 7e3a00a6 sha256:479c27220ef0add59a1632e8741bd88416a80b0161d634ac6875d984bc3cfc00`.
- **Drafted by** the architect agent, alone, on the custodian's brief, with no impact read (the lead-data pilot is paused). The tree was read from the main checkout at 7e3a00a6. Read-only: the architect ran no command. The custodian computed every pin at 7e3a00a6 when filing.
- **Reference form.** As MP-1's Header (by section): code on main is pinned `path:line @ 7e3a00a6 sha256:<hex>`. A pin is historical: it is authoritative for the fact it names, and the branch base's tree is authoritative for the edit. The worker re-derives every site before editing. Self-references are by section and item. The ledger is cited by round and item. A cite written into code names its target by item, never by line.
- **Branch.** `cut/geometry-points-cut`, cut from main in its own commit. It merges by a merge commit, never a squash, so that T-1's branch span (§2) and every commit the closing record names stay reachable.
- **Conditional parts** are marked **[OPEN-1]** to **[OPEN-4]** (section "OPEN" below). Each is drafted for the recommended option.

## §0. Disclosure

- **Read:**
  - ADR-034 whole, with its Acceptance section;
  - the acceptance directive;
  - MP-1's form with Amendments 1 to 6;
  - MP-1's two gate-1 reports (`state/consults/gates/2026-10-06-geometry-types-beyond-polygons-gate1-architect.md`, `...-gate1-reviewer.md`);
  - the product-first direction;
  - this template with its Round 25 additions;
  - AUTONOMY §21a to §21d, §22 and §25;
  - docs/08;
  - KNOWN-LIMITATIONS;
  - `state/directives/PORTABILITY-2026-09-30.md` §2;
  - ADR-017 §5a, ADR-022 and ADR-028 items 4 and 24(c);
  - the code sites pinned below.
- **Corpus.** `engine/compat-corpus/of-record/MANIFEST.json` entries #2, #4 and #5 were read for §3. No corpus file was opened.
- **Not read:** the installed `@deck.gl/layers` `ScatterplotLayer`. V-P (§2) is the worker's precondition.
- **Fixture drive:** nothing is measured.

## §1. What this preregistration may and may not claim

- **No performance number, no docs/08 row and no timing assertion.**
  - docs/08 defines a Points class, with the visible count undefined (`docs/08_Testing.md:29 @ 7e3a00a6 sha256:c0bb1e279539ebfd56dff5626134e29478b4ba341cb1fd861a4994204582233d`). No budget can therefore be measured for it.
  - Every quantity below is an assertion (round 25, item 1 (a)).
  - No claim is made that point rendering meets any docs/08 budget.
- **Byte identity is claimed exactly as §6's instruments prove it, and no further:**
  - **Polygon-only:** as MP-1 §1 and §6 define it, by G-1 and G-2 against the golden files on main.
  - **MultiPolygon:** the committed F-1 batch equals the engine's output (BF-1). MP-1's engine unit tests are unchanged and green. Nothing wider is claimed.
- **Copy:** the point encoding appends each coordinate once and carries no offsets buffer. The word zero-copy is not used (ADR-004).
- **Operator wording.** Every new operator string is a `[P6 placeholder]` and is the human's at P6 (acceptance item 6). The one exception is the sighted `engine.geo_metadata` template, with its rendered set (OPEN-2).
- **ADRs cited, none amended:** ADR-034, ADR-004, ADR-006, ADR-010 (rules 1, 2, 3 and 6), ADR-016 §5, ADR-017 §4 and §5a (both byte-identical), ADR-018, ADR-022 (read per OPEN-3) and ADR-028 item 4 (applied per OPEN-4).
- **May not claim:**
  - that any corpus Point file reaches the canvas: none of #2, #4 and #5 declares a covering;
  - that a row is ever counted as unread (acceptance item 5);
  - that MultiPoint is read **[OPEN-1]**.

## §2. The change

The content is binding. The wording of code and comments is the worker's, except where a source is pinned.

### The vertical cut against MP-1

| element | MP-1 provides on main | this cut adds |
|---|---|---|
| admission | one readable-set declaration, read by the gate and the text; the encoding fixed at open; the sighted refusal | Point joins the declaration; `{Point}` gives `geoarrow.point`; a set mixing kinds is refused (E-P2) |
| row decode | the Polygon and MultiPolygon builders; strict, by-name refusals; the null-geometry refusal | `PointBuilder`, WKB type 1 only; an empty Point is refused |
| encoding | a storage type, builder and validator per encoding; `coordinate_values` walking both nestings | the point storage type, builder and validator; a point arm in `coordinate_values` |
| envelope and `describe` | the envelope key; `describe.encoding` and `declared_types` (`skp/0.9`) | a third value under `skp/0.10`; no new field |
| shell decode and drawing | the encoding check; `parts` and `partToRow`; one `SolidPolygonLayer` datum per part; the outline `PathLayer` | the point decode; one `ScatterplotLayer` per batch for a point open |
| picking and attributes | `partToRow`; the ceiling counted in parts; the first-part anchor; no attribute hook (O6) | the point ordinal is the row; the ceiling is counted in points; a pick-resolution rule for points **[OPEN-4]**; still no attribute hook |
| styling | the polygon document's fill and outline | the same parameters mapped onto the point symbol, plus a declared radius **[OPEN-3]** |
| publishing | K2's format-owned refusal | no product change: K2 already refuses `geoarrow.point`, and K-P2 proves it |
| LOD | refuses a MultiPolygon feature by name | `lod.rs` unchanged; it refuses a Point feature by name; L-P pins it |

**What the lines cut keeps:**
- LineString and MultiLineString;
- MultiPoint, unless OPEN-1 (B);
- mixed-kind columns;
- an empty or absent declaration with non-polygon rows. That still selects MultiPolygon (ADR-034 Decision 2), so such rows stay refused by name.
- Counting a row as unread stays open (acceptance item 5).

**What B2 keeps:** all persistence. The encoding stays a fact of each open, re-derived at reopen and never saved.

**What B3 and style v2 keep:** a point partition schema, a point geometry in the style document, and `verify-bundle.rs`'s alignment (MP-2).

**ADR-034's inherited rule, item by item:**
1. Encoding fixed at open: E-P2.
2. `declared_types` as the source fact: unchanged (K1 of MP-1); no promotion exists for points.
3. No silent drop: E-P4.
4. One row per feature: E-P4 and S-P1.
5. A part-to-row map wherever a kind is multi-part: Point is single-part, and `partToRow` is the identity (SH-P1).
6. A refusal stating the readable set: E-P1 and E-P2.
7. Every consumer checks the encoding before a new value is emitted: SH-P1; the viewer (V-P); `describe` (K-P1).
8. A publish refusal until the bundle carries the kind: K-P2.

### Engine

**E-P1. The readable set.** `READABLE_GEOMETRY_TYPES` becomes `Polygon`, `MultiPolygon`, `Point`, in that order (`engine/src/geoarrow.rs:63 @ 7e3a00a6 sha256:7ae29efcb0f7fcbacd184499bb9d2a08cbdbd56c307ad310222c74f833a92ff2`).
- It is still read by the gate and by the text (`engine/src/geoarrow.rs:66-72 @ 7e3a00a6 sha256:a32d1d0d704246ef6e4366d3dacf9caa83e4db61be5583c23c04d6090e5f5707`).
- A `pub(crate)` kind mapping beside it: Polygon and MultiPolygon are polygonal; Point is point.

**E-P2. Admission** (`engine/src/geoarrow.rs:84-105 @ 7e3a00a6 sha256:f63a46b85c43ac4768a7fa14dbd1abc33699523f3edc3b2fe96a3cc221300aa1`). Matching stays case-insensitive. The checks run in this order:
1. `None` or `[]` gives `MultiPolygon`, unchanged (ADR-034 Decision 2).
2. Any member outside the readable set is refused with the sighted template, unchanged code. The template is `state/consults/2026-09-24-multipolygon-assessment.md:206 @ 6030dfd2814b sha256:ddae06db5d61fa8f420f73843d5e900805bbb9eb26341f5a53effa571cdc4be3` (a sub-line span; the hash is the line's). Its readable-set clause now renders three types. MultiPoint and Z or M names land here **[OPEN-1]**.
3. Every member Point gives `GeometryEncoding::Point`.
4. Every member Polygon gives `Polygon`, unchanged.
5. Members within {Polygon, MultiPolygon} give `MultiPolygon`, unchanged.
6. Otherwise, Point with a polygonal member: refused at open as `EngineError::GeoMetadata`, as ADR-034 Decision 7 requires (`docs/adr/ADR-034-geometry-type-admission-and-geoarrow-encoding-selection.md:93-96 @ 7e3a00a6 sha256:57e6df8af233cafd2b9c96356174cf488f7c52568a578a8d04d80c4d2dbb8bd0`).
   - **[OPEN-2] (A):** a `[P6 placeholder]` detail stating the declared list, rendered as today's message renders it, and that the engine reads one kind per column, naming the kinds from E-P1's mapping.
   - It states engine facts only.
- The call site is unchanged (`engine/src/dataset.rs:364-368 @ 7e3a00a6 sha256:c32ae11be7f7098b2412d190de63058a07452bc98e807bafc981e70b56031f59`).

**E-P3. Accessors, and C-n1.**
- `GeometryEncoding` gains `Point`; `as_str()` gives `geoarrow.point`.
- New `pub(crate) const EXT_NAME_POINT`.
- **N-1 (C-n1, narrowed here).** `EXT_NAME_MULTIPOLYGON` (`engine/src/geoarrow.rs:31 @ 7e3a00a6 sha256:778b6717eddb66ebd3b28764151077b1cd31b8761987690eb5566f64d93b3217`) and `BatchEnvelope::geometry_encoding` (`engine/src/envelope.rs:292-294 @ 7e3a00a6 sha256:907cc5a090e4f72821897020755e4c52302df19ca5ce8af9b7c040b73bc8eb50`) become `pub(crate)`.
  - Reason: this cut edits both files, and neither item has a caller outside the crate (PR #182's gate-1 reviewer report, DR-1). The worker re-greps `kernel`, `protocol`, `renderer` and `frontends/shell/src-tauri` at the base.
  - Proof: both Cargo workspaces build. No mutation applies to a visibility change.
- No other new `pub` item. New builders and validators are `pub(crate)`.

**E-P4. Row decode.** `engine/src/wkb.rs` gains `pub(crate) PointBuilder`, with one interleaved coordinate buffer.
- **Reads:** byte order; then a type code that must be exactly 1, with no EWKB flag; then x and y, with their bits carried through and no arithmetic (`engine/src/wkb.rs:19-20 @ 7e3a00a6 sha256:ca0f8f848d0e5c437d2c3d28ab2cece1aeabeb203f541debbfdcbb7e1a8d1687`).
- **Refused by name as `EngineError::Wkb`, each with `[P6 placeholder]` text naming what was met:**
  - EWKB flags;
  - any type other than 1, ISO Z, M and ZM codes included;
  - a NaN in either coordinate. That is WKB's empty-Point convention, and it is refused under the strict-decode policy (`engine/src/wkb.rs:11-17 @ 7e3a00a6 sha256:cb6448453c87087a64aef62b4a9afa2d70d7a247d190158e3c2549fbf2a551d3`), rider 1 and acceptance item 5;
  - trailing bytes;
  - truncation.
- **Every refusal** stops the stream at that row, skips nothing, and states no consequence.
- `PolygonBuilder` and `MultiPolygonBuilder` are unchanged: both still refuse type 1 (`engine/src/wkb.rs:176-234 @ 7e3a00a6 sha256:215063514f72881c6088f428e90fc7e92c44bceebc6312c4ea3c75129762a7fd`, `engine/src/wkb.rs:597-613 @ 7e3a00a6 sha256:97af6f3724f2e24542891db89556c4b42d3acbea41a1f7540bb2eb4855bbc584`).

**E-P5. Encoding.** `engine/src/geoarrow.rs` gains:
- the point storage type, `FixedSizeList<xy: Float64>[2]`, non-null;
- `build_point_array`;
- a structural `validate_point_encoding`;
- the `storage_type` and `validate_encoding` arms (`engine/src/geoarrow.rs:144-149 @ 7e3a00a6 sha256:1156e724e48b6d0948eeb36d6054849ffeb4ee6f66c10687fc525ef086e16f6f`, `engine/src/geoarrow.rs:422-427 @ 7e3a00a6 sha256:fb8e42856fead0dbf0c39960595597e54f2b8aac023eabb9d82053f46ebdaa7c`);
- in `coordinate_values` (`engine/src/geoarrow.rs:308-339 @ 7e3a00a6 sha256:367d64ae140bfad30da485591c05dc6530093e6e70f34df5d0aa325b36e4d15f`), an arm that reads a top-level fixed-size list over its own slice window only.

The polygon and multipolygon types, builders and validators are unchanged.

**E-P6. Envelope.** No code change beyond N-1.
- The key and the field are written from the encoding.
- `TaggedBatch::assemble` validates through E-P5's arm (`engine/src/envelope.rs:331 @ 7e3a00a6 sha256:9a28cc88a4bcebf5ed7061c50ddd4f97544577538ac0e18593863f566846f46c`).
- `xy_bounds` reads points through `coordinate_values` (`engine/src/envelope.rs:377-381 @ 7e3a00a6 sha256:ca5e0010e76c4a7e5e76a243733e8c3843c6f33664324a4b7c911d1a4ea207cb`).

**E-P7. Stream.**
- `GeometryBuilder` gains a `Point` arm (`engine/src/stream.rs:2149-2184 @ 7e3a00a6 sha256:34d1a4568ac748241183750c650c3b7a77ef7c369fdb0c1fe03facfb1c4d8f33`).
- **`estimate_bytes` is not edited** (`engine/src/stream.rs:2253-2264 @ 7e3a00a6 sha256:37f4ef58f673b9ceee9801d378acf9bae427b8582b73c22ba76a2bbd831dad13`). Its doc gains one sentence: for points, vertices equals rows and no offsets are written, so the estimate bounds a point batch. S-P3 asserts it.
- The per-row incoming estimate counts a 21-byte point WKB as one vertex (`engine/src/stream.rs:1996-2002 @ 7e3a00a6 sha256:0698e0d217eeef111c6bfb42cf59c3ae0601f23404580a13befbbef010d59e72`).

**E-P8. Module doc.** The encoding sentence names the third encoding (`engine/src/lib.rs:17-22 @ 7e3a00a6 sha256:f83d5e27213656835672782036eb420dda331a3a71e9a436c78790b0c0c0441f`).

**E-P9. Test support, behind the `fixture` feature:**
- `encode_point`;
- `GeometryMode::RowsWithBounds`: explicit WKB rows, each with the covering bounds it declares, so a fixture can carry a covering (`engine/src/fixture.rs:500-508 @ 7e3a00a6 sha256:6679e5b8673f1040993e8d7a539af43e8783e63b7815a7b03127a6d47cd53651`; the refusal at `engine/src/fixture.rs:913-917 @ 7e3a00a6 sha256:2d13926cdc99e08e18bf570618db233c9e807b262b94e937851165b3b1b093f0` still holds for plain `Rows`);
- point-row helpers.

The default writer stays byte-identical, by G-1's fixture hash.

**E-P10. LOD.** `engine/src/lod.rs` is not edited. It refuses a Point feature by name (`engine/src/lod.rs:1554-1562 @ 7e3a00a6 sha256:3fbc05148467f2137bf3d549edc9ea4e527c87ecc35dc2f30c196d7beba772d5`, `engine/src/lod.rs:1656-1669 @ 7e3a00a6 sha256:ab4f3e672c616fdceca0c811877554252fa79183ba04f9c28b0ef4258facd775`). L-P pins it.

**T-1 (DR-3, class-3 test text).** Correct L-1's recorded-mutation comment. Superseded span: `engine/tests/lod_tier_builder.rs:1494-1496 @ 7e3a00a6 sha256:9ca51efedf877012f1cd9b6fea02749abb8ebd212fc4d1432df075512c212767`.
- **The new text keeps the mutation.** It states that the mutated build is refused by the tier-size ceiling, and that the test fails by name at its `Err(other)` arm.
- **The observation of record** is PR #182's gate-1 reviewer report, its Mutations table, row L-1, at c4c251d46e55 (round 25, item 2 (c)).
- **The reviewer** re-makes the mutation at this cut's head.
- **Until the merge,** the new span is named in words with its branch commit id (round 25, item 2 (d)). The closing record pins it at the merge commit.

### Kernel

**K-P. No product change.**
- `describe_dataset` takes `encoding` from `as_str()` (`kernel/src/skp.rs:1928 @ 7e3a00a6 sha256:c182efb40a3fa20a668c7023978c62e61199e345fe6154d2a653e00be4d5ad66`).
- K2 compares the dataset's encoding with the format's declared one (`kernel/src/publish/mod.rs:484-498 @ 7e3a00a6 sha256:ca464db60f94e19f612fe675907a2e0928e7e2474caf690e77d9b988c7704788`), after the degrees check (`kernel/src/publish/mod.rs:472-483 @ 7e3a00a6 sha256:a838fe8a97bbd0c528997634b7592776e4c7bf70e92cc9a928389761ecd160d0`).
- A point dataset is therefore described as `geoarrow.point` and refused at publish as `publish.geometry_encoding_not_publishable`.

**Walkthrough fixtures.** These are ignored generators in `kernel/tests/manual_walkthrough_fixtures.rs`:
- `generate_the_point_p1_fixture`: P-1, with a covering, via E-P9;
- `generate_the_declared_linestring_fixture`;
- `generate_the_declared_polygon_and_point_fixture`;
- **[C-1]** `generate_the_multipolygon_f1_with_covering_fixture`, only if the custodian confirms that MP-1's F-1 meets `engine.no_covering_bbox` in the app. F-1's own generator is not edited (`kernel/tests/manual_walkthrough_fixtures.rs:207-229 @ 7e3a00a6 sha256:e656d5f8c283a06ee0c205bcfd8ee541fb83956410267e439b1330afd34834d2`).

### Protocol

**W-P1.** The doc on `GeometryInfo.encoding` lists three values (`protocol/skp/src/v0/commands.rs:169-173 @ 7e3a00a6 sha256:0a872b0696c7a68fc2be01542ad15d37f0b89d700cefdaff9ca4616bbad00935`). No field changes. `deny_unknown_fields` stays.

**W-P2. The literal and its fixtures, in one commit** (`protocol/skp/SKP-V0.md:280-296 @ 7e3a00a6 sha256:f1fe949196a4ab94241772d978097159bdd2872632ee35a3a4978130dcd50aa5`, condition (iii)).
- **The number.** `skp/0.10`, the literal after main's at the final merge (`protocol/skp/src/v0/mod.rs:88-95 @ 7e3a00a6 sha256:168bdc69d52c88c4ff8c598f43515dee7faf0b5e7c399b7971892969ac764189`). Another number forced by an earlier merge is stated in the closing record, not amended.
- **Rust side and TS side together:** every file that carries the literal, `frontends/shell/src/skp/types.ts` among them (`frontends/shell/src/skp/types.ts:15 @ 7e3a00a6 sha256:0d13c18f914fb4684b940d2a48453ab5a8d597052ec7d1e0ba683aa30958f195`).
- **The version-refusal conformance fixture** is renumbered from `skp/0.10` to `skp/0.11`, as `skp/0.9` did (`protocol/skp/SKP-V0.md:1008-1014 @ 7e3a00a6 sha256:33d993f8c7bcb81c47fcf99992a98f836c79e44470b05549ac3b6ad67d8e4e4e`).
- **`skp_version_is_skp_0_9` is renamed** to `skp_version_is_skp_0_10`. P-5 names this rename.

**W-P3. SKP-V0.**
- §1's `geometry` line names the third value (`protocol/skp/SKP-V0.md:71-73 @ 7e3a00a6 sha256:db5505b6ccf9d986a8d5c248e9a7b223f35d5eb8db622b17fd99389913e000b9`).
- A `skp/0.10` entry is appended at §8's end, as §8 stands at the final merge. It records the value only: no command, member or code.
- §5 is unchanged. `protocol/data-plane/` has an empty diff.

### Shell

**V-P, before any shell code.**
- **What.** The worker reads the installed `@deck.gl/layers` `ScatterplotLayer` at the version the lock resolves, and confirms three things:
  - its picking colour encodes the datum index;
  - one datum is one point;
  - `radiusUnits` and `lineWidthUnits` accept `pixels`.
- **Where.** The worker report names the file, the function and the version.
- **If false.** That is I-2.

**SH-P1. Decode** (`frontends/shell/src/canvas/decodeBatch.ts:21-24 @ 7e3a00a6 sha256:064f5e8d2c4ad6c8cea9dca6c9aeaccad0ada6ef491b85eb67ea0012ca715613`, `:103-109`, `:136-165`).
- `ENCODING_POINT`, and the check accepts three values.
- A point row decodes to one part holding one single-position ring. `ResidentBatch`'s doc states this shape (`frontends/shell/src/canvas/decodeBatch.ts:64-82 @ 7e3a00a6 sha256:3a19ebcb554e08b18826e655697853cc4e1e4b27cab1ea5caf222fbbf246f96b`); its type is unchanged.
- `partToRow` is the identity, and `partCount` and `totalVertices` equal the row count.
- A pure `geometryKindOf(encoding)` returns `polygonal` or `point`.
- `UnexpectedEncodingError`'s text names three encodings, as a `[P6 placeholder]` (`frontends/shell/src/canvas/decodeBatch.ts:33-45 @ 7e3a00a6 sha256:ae059d1c045d8ce1f83d5e3961a9dee72fe61c27ea36c47487dee5ce05a9615d`).

**SH-P2. Drawing.** `buildLayers` takes the open's kind (`frontends/shell/src/canvas/buildLayers.ts:262-287 @ 7e3a00a6 sha256:899420ea28a7b4517e921cafd775921d02f1768b2d14cdb5cd0afe9617ca858b`). `WorkingCanvas` derives the kind once from `geometryEncoding` and passes it.
- **Point:** one `ScatterplotLayer` per batch.
  - Its id is `layerId(batch)`.
  - Its data is cached offset-relative positions, under the same cache rule as polygons (`frame.toLocal` in f64 before any narrowing; ADR-010 rule 3).
  - `CARTESIAN`, pickable, `radiusUnits: pixels`, radius `POINT_RADIUS_PX` **[OPEN-3]**.
  - Fill from `draw.fillColor`. A stroke only when `outlineWidth > 0`, in pixels, from `draw.outlineColor` and `draw.outlineWidth`.
  - No `PathLayer`.
  - `checkPickCeiling(batch.partCount)`.
- **Polygonal:** the existing path, unchanged.

**SH-P3. Picking.**
- `resolvePick` is unchanged (`frontends/shell/src/canvas/pick.ts:134-143 @ 7e3a00a6 sha256:ce156d3a79730919f8a921ef027f38be4c518ef9b749201048ea4eecb1fd5606`). Ordinal, then `partToRow`, then row, then id; the anchor is the point itself.
- The ceiling counts points.
- `PickCeilingExceeded` names pick ordinals as polygon parts or points, as a `[P6 placeholder]` (`frontends/shell/src/canvas/limits.ts:57-65 @ 7e3a00a6 sha256:55b83c087be577a1ccecad27004579baddc3c45dfc61e474b4181c8c33d9a2dc`).
- deck's `pickingRadius` stays unset.
- `PICKING.md`'s parts sentence names points.

**SH-P4. Pick resolution for points [OPEN-4].** Drafted for (A).
- `pickResolution.ts` gains `averagePointSpacing(batches)` and a selector `pickResolutionExtentFor(kind, batches)`.
- **Spacing**, over the resident points:
  - n points over a bbox of width w and height h give the square root of w×h/n when w×h > 0;
  - otherwise the larger of w and h divided by (n−1) when n > 1;
  - and +Infinity when n ≤ 1, where there is nothing to confuse.
- `WorkingCanvas` assigns the selector's value where it assigns `averageFeatureExtent` today (`frontends/shell/src/canvas/WorkingCanvas.tsx:1253 @ 7e3a00a6 sha256:afdf87474932dce3b15450c3b2ec88d4505c8dd37853f8ec2b8c3e66b18f1a9a`).
- The 9 px threshold is unchanged (`frontends/shell/src/canvas/pickResolution.ts:81 @ 7e3a00a6 sha256:8540ff19e686430812871511722f8fcb91ab8ada3d977062c4efbc7535a81108`).
- The polygonal path is unchanged in behaviour.

**SH-P5. Styling [OPEN-3].** Drafted for (A).
- The resolved polygon draw parameters map onto the point symbol's fill and stroke, as plumbing (ADR-022 Decision 4, read per the ruling).
- `POINT_RADIUS_PX = 4` (CSS pixels) is declared in `buildLayers.ts`. Its doc explains the value: an 8 px diameter stays below the 9 px threshold, so symbols at the threshold spacing do not overlap.
- `toStyleDocument` still writes `polygon` (`frontends/shell/src/style/document.ts:109-118 @ 7e3a00a6 sha256:f4017650ff734303b5cb2ceb04195557bb50eb179be1ab5844f04cd1ac922e19`). The style panel is unchanged.

**SH-P6. Describe display.** No change. The Geometry row renders `{column} ({encoding})`, beside MP-1's labelled declaration row.

**SH-P7. `MAX_RESIDENT_VERTICES`' comment.** A point counts one vertex. Its per-point part arrays are disclosed as an unmeasured heap cost (`frontends/shell/src/canvas/limits.ts:50-55 @ 7e3a00a6 sha256:09f46e8b2840db82ccd22802cc9277cedd4134e3331248e924425823406ae200`).

**O6.** No attribute lookup, callback or row accessor is added. `b1-shell-half` lands later and writes against `partToRow`, which is the identity for points.

### Viewer

No product change. The viewer refuses any encoding but polygon (`renderer/bundle-viewer/src/partition.ts:123-127 @ 7e3a00a6 sha256:c326d3d3add9c64fafe361e6bb7407c200d9d1017f97eb41fe13fbb9d48a1fc7`). V-T pins it for points.

### Portability

The feature is not OS-dependent, so R3's section is not required.
- **R1:** decode and selection are pure.
- **R2 and R4:** no `cfg` in product code and no path literal.
- **R5:** no level claim.
- **R6:** two kinds of ignore, neither new to its kind:
  - L-P takes the LOD boundary's existing `cfg_attr(not(windows), ignore = …)` precedent (`engine/tests/lod_tier_builder.rs:1500-1505 @ 7e3a00a6 sha256:99ea93111e01032dbd54d3e54e6a7977d7a2cf5502953fcf746714dd2c663732`);
  - the two `point_corpus.rs` tests are plain on-disk-corpus ignores.

### KNOWN-LIMITATIONS

All edits are current-state edits in place, each a draft for the human's P6 sight with a source comment.
- **Item 31:** this build reads Polygon, MultiPolygon and Point.
  - Point is read only when the declaration is exactly Point.
  - Point mixed with a polygonal type is refused at open.
  - MultiPoint is refused **[OPEN-1]**.
  - An empty Point stops the stream by name.
  - A Point row under an empty or absent declaration still stops the stream.
  - Source: `KNOWN-LIMITATIONS.md:335-337 @ 7e3a00a6 sha256:7dc1cc7a87677e64fe4f2141c60c919bf4a20c0ca82524fb558dc853feab2817`.
- **Item 32:** a point dataset is refused at publish (`KNOWN-LIMITATIONS.md:339-341 @ 7e3a00a6 sha256:ec0da705f506da1da5901fe0708c987d3013b730714bc7e5ed83648ce0b4ccb0`).
- **Item 33:** the tier builder refuses MultiPolygon and Point features by name (`KNOWN-LIMITATIONS.md:343-345 @ 7e3a00a6 sha256:6fccb4855a6edf0c1f15673e5b29eec782d864cdcaa48104f0c47c0492931f7e`).
- **New item 35 [OPEN-3]:** points are drawn as fixed-radius symbols with the polygon style's fill and outline. The style document has no point geometry yet.
- **New item 36 [OPEN-4]:** the point pick rule compares average spacing, so clustered or coincident points can name the topmost symbol.
- **Not edited:** item 9 and `README.md`.

### Owner's index (applied in the PR by the worker)

- **`engine/README.md`:**
  - `Last verified at`;
  - Interfaces → Open and admission (gains A-P1);
  - Viewport stream, envelope, batch sizing (gains S-P1);
  - LOD tier builder (gains L-P);
  - Governed by → preregistrations (+ this form).
- **`kernel/README.md`:**
  - `Last verified at`;
  - SKP v0 host (gains K-P1);
  - Publish and the bundle format (gains K-P2);
  - Governed by (+ this form).
- Both stay within 60 lines.

### Operator

`frontends/shell/MANUAL-WALKTHROUGH.md` gains Part P, appended at its end with blank result logs, and run in the same sitting as Part S:
- **P1.** P-1 opens and draws as symbols. The summary shows `geometry (geoarrow.point)` and the declaration `Point`, labelled.
- **P2.** Hover a point: one id. Hover between points: nothing. Zoom out until the named refusal appears **[OPEN-4]**.
- **P3.** Style edits apply to the points **[OPEN-3]**.
- **P4.** Publishing P-1 is refused with `publish.geometry_encoding_not_publishable`.
- **P5.** Corpus #5 opens: format rule, degrees, `geoarrow.point`. The canvas shows the no-covering refusal.
- **P6.** Corpus #2 is refused as `engine.crs_undeclared`, and #4 as `engine.format_default_contradicted`.
- **P7.** The wording:
  - the sighted refusal, on the LineString-declared file;
  - the mixed-kind placeholder, on the Polygon-and-Point file **[OPEN-2]**;
  - every new `[P6 placeholder]` string;
  - items 31 to 36.

A dated note under Part S, appended and not edited into S4, says that from this cut's merge corpus #2 no longer reaches the sighted refusal, and that P7 carries it. **[C-1]** adds a second note naming F-1c for S2.

## §3. Fixtures and corpus, with outcomes predicted before any run

Purpose-written fixtures come from `spatial_engine::fixture`, and each is hash-verified before and after the test that generates it.

| id | fixture | predicted |
|---|---|---|
| P-1 | LV95, `["Point"]`, six rows with distinct bit-sensitive coordinates (the walkthrough variant has a covering) | admitted, `geoarrow.point`, six rows, bit-identical coordinates; publish refused by K2 |
| P-2 | `["point"]` | `geoarrow.point`; `declared_types` `["point"]` |
| P-3 | `["Point","Polygon"]` | refused at open, `engine.geo_metadata`, E-P2 check 6 **[OPEN-2]** |
| P-4 | `["MultiPoint"]` | refused at open with the sighted template, which renders three types **[OPEN-1]** |
| P-5 | `["Point Z"]` | refused with the sighted template |
| P-6 | `["Point"]` with one Polygon row | the stream is refused with `engine.wkb` at that row |
| P-7 | `["Point"]` with one MultiPoint row (type 4) | `engine.wkb` at that row |
| P-8 | `["Point"]` rows: SRID-flagged; ISO 1001; NaN NaN; trailing bytes; big-endian | each refused with `engine.wkb` by name, except big-endian, which decodes to the same values |
| P-11 | P-1 in CRS84 degrees | publish refuses `GeographicCrsNotPublishable`, not K2 |
| BF-P | the engine's IPC of P-1's batch, committed as `engine/tests/data/geoarrow/lv95-point-batch.arrows` | its bytes equal the engine's current output |

**Unchanged and re-run:** MP-1's F-10 and F-11 (a Point row under a polygonal or empty declaration is refused with `engine.wkb`).

**The corpus. These predictions are registered here.** `engine/ADMISSION-PREREGISTRATION.md` is not edited (its rows: `engine/ADMISSION-PREREGISTRATION.md:85 @ 7e3a00a6 sha256:83ab232ec2ed8d99d0fe84dfbc763f3e169d5ca90029fef89b914f3c1812c505`, `:87`, `:88`).
- From this form's merge, the P4 generator's rows #2, #4 and #5 cite this section (`engine/tests/admission_p4_corpus.rs:169-212 @ 7e3a00a6 sha256:d1f83ebef34a1ea7d37fe5b0cdeafb1af64d6b8e03203d52c03bd558f19c86db`). So do its P1 and P2 literals (`engine/tests/admission_p4_corpus.rs:1060-1064 @ 7e3a00a6 sha256:3f8408e6e8b157316d3a24cb6bee3753879db7db8f3f71b6a0e9bc6e188a247f`, `:1078`, `:1259`, `:1266`).
- The re-run regenerates `engine/ADMISSION-RESULTS.md`. It is made at a committed tree, and its header names that commit (MP-1's DR-4).

| row | predicted |
|---|---|
| C-2 | Refused by name, `engine.crs_undeclared`. The geometry gate admits `[Point]`. The `crs` key is explicitly `null` under version 1.0.0 (`engine/compat-corpus/of-record/MANIFEST.json:1471-1475 @ 7e3a00a6 sha256:4f0a6ed2ba9cf00f41bb38539fe6a7c862b5efa739b261046d39645522e5a137`, `:1454`). This is the corpus's first exercise of the explicit-null case. |
| C-4 | Refused by name, `engine.format_default_contradicted`, at level `metadata` from the `bbox` member, which leaves ±180/±90 (`engine/compat-corpus/of-record/MANIFEST.json:1677-1681 @ 7e3a00a6 sha256:57379d04ac6f49987d29cb4b48d3cdc5e5e25793715148c03f5fe491190f2389`, `:1689-1694`). |
| C-5 | Admitted under the format rule, `crs:format-default`: OGC:CRS84, `axis:format-override`, `geoparquet:1.0.0#crs-absent-default`, degree. Sanity at `metadata`, not convicted (`engine/compat-corpus/of-record/MANIFEST.json:1774-1778 @ 7e3a00a6 sha256:57379d04ac6f49987d29cb4b48d3cdc5e5e25793715148c03f5fe491190f2389`, `:1786-1791`). Identity session-ordinal: no `id` column (`:1815-1816`). Encoding `geoarrow.point`; `declared_types` `["Point"]`. A viewport query refuses `engine.no_covering_bbox` (`:1783-1784`). The publish component is entered as unrun with its reason: a single open cannot reach a publish preflight. |
| C-5S | #5 streamed whole: 300 rows, one per feature, unique ids, no refusal, every coordinate inside the `bbox` member. Wrong is a result. |
| C-4A | #4 opened with the catalog assertion `epsg-2056`: admitted, caller-asserted, session-ordinal (`:1723-1732`, no `id` column). A whole-file stream gives 300 rows, every coordinate inside its `bbox` member. |

## §4. Tests, and the mutation per new test

- **How a mutation is observed.** It is applied, the named test is run, the failure is recorded by name with the commit it was observed at, and the mutation is reverted (round 25, item 2 (c)). No `verify-mutation` run is an observation.
- **Where the record lives.** Each test's comment carries its mutation.
- **Real shape.** Rows marked RS consume the engine's own bytes or a real open.

| row | test (file) | asserts | mutation, which fails it by name |
|---|---|---|---|
| PE-1 | `wkb.rs` unit | a Point row is one coordinate pair with its bits unchanged | narrow through `f32` |
| PE-2 | `wkb.rs` unit | P-8's refusals, each typed `Wkb`, naming the type met, `[P6 placeholder]` | delete the type-1 check |
| PE-3 | `wkb.rs` unit | big-endian decodes to the same values | ignore the byte-order byte |
| PE-4 | `wkb.rs` unit | NaN in x, in y, or in both is refused | delete the NaN check |
| PE-5 | `geoarrow.rs` unit | the point storage type; each validator refuses the others' arrays | the point validator accepts one list level |
| PE-6 | `geoarrow.rs` unit | `coordinate_values` over a sliced point array returns the slice's run only | return the whole child |
| PE-7 | `envelope.rs` unit | for Point, the key equals the field's extension name | write `EXT_NAME_POLYGON` for Point |
| A-P1 | `engine/tests/geometry_admission.rs` | P-1 to P-5: the encoding or the refusal | drop E-P2 check 3 |
| A-P2 | same, **[OPEN-2]** | P-3's detail, byte-equal to the ruled text | admit a mixed set as MultiPolygon |
| A-1, A-2, A-3 (changed) | same | F-6 re-pointed to `["LineString"]`. A-2's expected text renders three types; A-3 parses the clause by the phrase rule | as recorded; the reviewer re-observes each |
| S-P1 | `engine/tests/point_stream.rs`, RS | P-1 streams one row per feature, unique ids, bit-identical coordinates; key and field agree; `xy_bounds` is the points' min and max | push y before x |
| S-P2 | same | P-6 and P-7 end typed `engine.wkb` at the row; no later batch | skip the row |
| S-P3 | same | for 50,000 points at the default targets, every batch's geometry is at most 16V + 4(rows + V) and fits its target | `vertices * 16` to `vertices * 4` in `estimate_bytes` |
| BF-P | `engine/tests/geoarrow_batch_fixtures.rs`, RS | BF-P equals the engine's output from a real open; the two existing files are unchanged | change one coordinate in the BF-P writer |
| L-P | `engine/tests/lod_tier_builder.rs` (LOD ignore) | `build_tiers` on P-1 refuses `Wkb` naming Point; no tier written | the `Point` arm of `geometry_type_name` returns `Polygon` |
| C-5S, C-4A | `engine/tests/point_corpus.rs` (`#[ignore]`) | §3 | swap x and y in `PointBuilder` |
| K-P1 | `kernel/src/skp.rs` tests, RS | a real open plus `describe` of P-1: `geoarrow.point`, `["Point"]`, and a key set equal to the shared fixture's | `as_str` returns polygon for Point |
| K-P2 | `kernel/tests/publish.rs`, RS | P-1: `preflight_pinless` refuses `GeometryEncodingNotPublishable` with `geoarrow.point`; no destination; no pin | K2 compares against multipolygon only |
| SH-P1 | `decodeBatch.test.ts`, RS (BF-P) | the shape, `partToRow` the identity, `partCount`, `totalVertices`, bits | walk a point row as a ring list |
| SH-2 (changed) | same | the unknown-value case uses `geoarrow.linestring`; a point batch under a polygon expectation throws | as recorded |
| SH-P2 | `buildLayers.test.ts` | a point batch gives one pickable `ScatterplotLayer` with the radius, fill and stroke rule, no `PathLayer`, and the ceiling spied with `partCount` | build `SolidPolygonLayer` for points |
| SH-P3 | `pick.test.ts`, RS (BF-P) | ordinal k gives row k's id, anchored at the point | decode a point row into no part |
| SH-P4 | `pickResolution.test.ts`, **[OPEN-4]** | the spacing branches (grid, coincident, collinear, one point) and the selector per kind | return `averageFeatureExtent` for points |
| V-T | `renderer/bundle-viewer/scripts/`, RS (BF-P) | the point batch offered as a partition is refused at the encoding check | delete the encoding check |
| E2E | `frontends/shell/e2e/regression.mjs`, new step PT' | P-1 (with covering) opens; the summary shows `geometry (geoarrow.point)` and `Point`; no refusal or banner | operator-run; no mutation |

**Not pinned here, with the reason:**
- K-3 and K-5 are MP-1's and are encoding-agnostic, so they are re-run unchanged.
- `verify-bundle.rs` is MP-2's.

## §5. Predictions · declared unchanged · invalidators · falsification

**Predictions (wrong is a result):**
- **PP-1.** §3's P rows and C rows.
- **PP-2.**
  - The re-run's P1 set is empty: no geometry-gate refusal in the main set.
  - P2 is #4 and #6.
  - Every row §3 does not predict equals `engine/ADMISSION-RESULTS.md` at 7e3a00a6.
- **PP-3.**
  - G-1, G-2 and BF-1 are green at the base and at the head.
  - The golden files keep sha256 d810e6a8659c82c322231d9c784e8d9fbb4e0f074bb325e3cebf1f94ddcab15d and 5b10ddd64ca60db9009ab1453cf99098353e4a9b93bcf012dca089586b0c7e01.
  - Both existing BF files are byte-identical.
- **PP-4.** V-P holds.
- **PP-5.** The head's run set is the base's plus §4's new tests, with `skp_version_is_skp_0_9` replaced by `skp_version_is_skp_0_10`. The ignored set is the base's plus:
  - C-5S and C-4A;
  - L-P off Windows;
  - the walkthrough generators named in §2;
  - and nothing else.

**Declared unchanged:**
- the Polygon and MultiPolygon bytes, as §6 states them;
- `estimate_bytes`' body, every ceiling's value, `lod.rs`, `format_declaration` and ADR-017 §4 and §5a;
- `renderer/src/style.rs` and the style-ts resolver;
- `protocol/data-plane/`;
- MP-1's form, `engine/ADMISSION-PREREGISTRATION.md` and every ADR;
- the polygonal hover path, `pickingRadius`, and the 9 px threshold.

**Invalidators (stop and return to the architect):**
- **I-1.** Any §6 file changes, or G-1, G-2 or BF-1 fails.
- **I-2.** V-P is false.
- **I-3.** S-P3 fails.
- **I-4.** BF-P is unstable across CI platforms.
- **I-5.** A refusal cannot state the type met without stating another module's consequence.
- **I-6.** The shell commit is reached with OPEN-3 or OPEN-4 unruled.
- **I-7.** OPEN-1 is ruled (B) after dispatch.

**Falsification.** Point admission proves unimplementable without moving Polygon or MultiPolygon bytes.

## §6. Instruments

All quantities are assertions. None is a measurement.
- **No new golden commit.**
  - G-1 (`engine/tests/polygon_wire_golden.rs::the_polygon_only_wire_matches_the_golden_file`) and G-2 (`kernel/tests/publish_partition_golden.rs::the_published_partitions_and_manifest_match_the_golden_file`) and their golden files are on main since d8276158.
  - BF-1 (`engine/tests/geoarrow_batch_fixtures.rs::the_committed_batches_equal_the_engines_output_from_a_real_open_and_stream`) and the two committed batch files are on main since MP-1.
- **The reviewer:**
  - runs all three at the base and at the head;
  - confirms the four files byte-identical by sha256;
  - confirms the default fixture's hash unchanged.
- **Can the point arm move a polygon cut? No.**
  - `estimate_bytes` is not edited.
  - The polygonal inputs are unchanged.
  - G-1's publish half detects any moved cut.

## §7. Declared values and ceilings

- **The readable set**, declared once: Polygon, MultiPolygon, Point (E-P1).
- **`POINT_RADIUS_PX` = 4 CSS pixels [OPEN-3].**
- **The 9 px threshold** is unchanged, and is applied to point spacing **[OPEN-4]**.
- **No new ceiling.**
  - `DECKGL_PICK_INDEX_CEILING` counts points.
  - `MAX_RESIDENT_VERTICES` counts one vertex per point.
  - The batch ceilings bound point batches through the unchanged estimate (S-P3).

**Line budget, by §21c's rule** (insertions plus deletions, tests included; this form and `engine/ADMISSION-RESULTS.md` excluded; binary files counted as files only):

| group | files | ceiling |
|---|---|---|
| engine product (unit tests inside included) | `wkb.rs`, `geoarrow.rs`, `envelope.rs`, `stream.rs`, `lib.rs`, `fixture.rs` | ≤ 750 |
| engine tests | `geometry_admission.rs`, `point_stream.rs`, `point_corpus.rs`, `geoarrow_batch_fixtures.rs`, `lod_tier_builder.rs`, `admission_p4_corpus.rs`, BF-P (binary) | ≤ 850 |
| kernel | `src/skp.rs` (tests), `tests/publish.rs`, `tests/manual_walkthrough_fixtures.rs`, `README.md` | ≤ 220 |
| protocol | `commands.rs`, `mod.rs`, `SKP-V0.md`, `tests/fixtures.rs`, `tests/data/*.json`, `tests/conformance/**` | ≤ 260 |
| shell product | `decodeBatch.ts`, `buildLayers.ts`, `pickResolution.ts`, `WorkingCanvas.tsx`, `limits.ts`, `PICKING.md`, `skp/types.ts` | ≤ 380 |
| shell tests and seams | the shell tests in §4, `testUtils/batchFixtures.ts`, the TS literal tests, `e2e/regression.mjs`, the viewer test | ≤ 560 |
| docs | `KNOWN-LIMITATIONS.md`, `engine/README.md`, `MANUAL-WALKTHROUGH.md` | ≤ 200 |
| **Total** | **≤ 64 files** | **≤ 3,220** |

**Counting command, at a named head H, with the base B named in the PR body** (`git merge-base origin/main H`, read before the merge):

`git diff --numstat B H -- . ':!engine/GEOMETRY-POINTS-PREREGISTRATION.md' ':!engine/ADMISSION-RESULTS.md'`

After the merge, B is the merge commit's first parent and H is the merge commit (MP-1's DR-5). An overrun is class 8, and this section is never edited.

## §8. Block-on-sight (each checked separately)

1. Any change to the two golden files, the two existing BF files or the default fixture's hash; or G-1, G-2 or BF-1 not green at the head.
2. The encoding varies per batch, or the envelope, `describe` and the batch disagree.
3. Any row other than one per feature.
4. A point layer that does not call `checkPickCeiling(partCount)`.
5. Any surface presents an encoding as the file's type.
6. A row of an unread type skipped or counted; an empty Point drawn, dropped or skipped.
7. The unreadable-member detail not byte-equal to the sighted template, rendered with the declaration's set; or a mixed-kind set admitted.
8. A new operator string without `[P6 placeholder]`, or an engine message stating another module's consequence.
9. A point dataset not refused at K2, or K2 moved or carried as `PublishError::Engine`.
10. An edit to:
    - any ADR, `format_declaration`'s values, `estimate_bytes`' body or `lod.rs`;
    - `protocol/data-plane/`, `renderer/src/style.rs` or the style-ts resolver;
    - MP-1's form or `engine/ADMISSION-PREREGISTRATION.md`.
11. A new `pub` item beyond `GeometryEncoding::Point`; either C-n1 item still `pub`; any attribute hook.
12. The literal not in one commit with both sides' fixtures; the §8 entry not last before §9; the version-refusal fixture not renumbered.
13. Code of OPEN-3 or OPEN-4 before its ruling; MultiPoint admitted under OPEN-1 (A).
14. The word zero-copy, a performance number, a timing assertion, or a docs/08 row.
15. A new `cfg` or platform ignore beyond §2's Portability.
16. The round-25 items, by name:
    - an overrun not recorded as class 8, or §7 edited to match;
    - a scope addition not recorded as class 9, or any code of it before its amendment;
    - a record calling a `verify-mutation` run an observation;
    - T-1's branch span pinned by hash at a branch commit, or named without its commit id;
    - a five-line form for this piece.
17. Quotation marks around text not byte-identical to its named source; a line cite into the ledger; a bare self-line.
18. An index edit outside §2's listed sections, or an index over 60 lines.
19. `pickingRadius` set, or the polygonal hover or threshold path changed.
20. `toStyleDocument` writing anything but `polygon`, or a point property added to the style document.

## §9. Gates

**Commit plan.** Each commit is signed off.
1. Engine (E-P1 to E-P9, N-1, T-1) with its tests, BF-P, and the changed A-1 to A-3.
2. Kernel tests and the walkthrough generators.
3. Wire (W-P1 to W-P3): the literal and both sides' fixtures, in one commit.
4. Shell (V-P first, then SH-P1 to SH-P7), V-T and PT'. This commit waits on OPEN-3 and OPEN-4.
5. Docs: KNOWN-LIMITATIONS, the indexes, Part P and Part S's note. Then the P4 generator edits, committed. Then the re-run at that commit, in the next commit.

**Architect** (full gating):
- §8, item by item;
- ADR-034's inherited list (§2) and Decisions 1, 2, 5, 6, 7, 8, 9 and 10 against the diff;
- acceptance items 5 and 6;
- ADR-010 rules 1, 2, 3 and 6;
- ADR-016 §5;
- ADR-017 §4 and §5a unchanged;
- ADR-022 Decision 4 per OPEN-3;
- ADR-028 item 4 per OPEN-4;
- SKP-V0 §4 item 13;
- the seam rule for each RS row and for O6;
- verbatim quotes and discharge claims resolved;
- the round-25 checks.

**Reviewer:**
- the full diff with `origin/main...HEAD`;
- §6 at the base and at the head;
- every mutation re-made, the changed tests and T-1 included;
- §7's count by its command;
- every hash recomputed;
- V-P against the lock;
- `ADMISSION-RESULTS.md` checked as the generator's output at a named, committed tree;
- the index lines;
- P-5 by name.

**Suites, green before either gate.** Heavy runs follow the machine paragraph, `state/directives/2026-10-06-machine-script-adopted.md:12-22 @ 7e3a00a6 sha256:7350977156bed7c94b0da4e8db806ba34c25c6678e65c46447a62d791ba9e8e1`, carried in the worker's, tester's and reviewer's briefs. No other rule for running builds applies.
- `cargo test --workspace --locked --features spatial-engine/fixture`, `cargo fmt --check` and clippy;
- `src-tauri` tests;
- the shell's unit suite and type check;
- the viewer's `node --test`;
- `node --test scripts/plan/*.test.mjs scripts/hooks/*.test.mjs scripts/evidence/*.test.mjs`;
- `verify.mjs`, `queue --check`, `site --check`, `verify-cites`, `verify-quotes` (a floor) and `verify-test-claims`;
- CI green at the reviewed commit.

**Proportional gates.** The product-first direction's section 2 applies, by reference (`state/directives/2026-10-05-product-first-direction.md:15 @ 7e3a00a6 sha256:8c0e4e3f404b413db3e506411f401880baf9681ac8dd67362dfba73c20d7b751`).

**Operator.** Part P, queued for the same sitting as MP-1's Part S, which is still unrun (`engine/MULTIPOLYGON-MP1-PREREGISTRATION.md:715 @ 7e3a00a6 sha256:a3e73032c733c0e675e6aee29ff696db46115dbb5e95d1af7a2486e81b77b1fa`).

**PR body:**
- asks for a merge commit;
- names T-1's branch span by commit id;
- names each OPEN ruling;
- names the base B.

**Closing record (references and hashes only):**
1. The PR, its merge commit and the reviewed heads.
2. The gate report paths.
3. The worker reports.
4. §6's files, re-pinned at the merge commit.
5. Each mutation's observation commit.
6. The literal minted.
7. `ADMISSION-RESULTS.md` pinned at the merge commit.
8. T-1's new span pinned at the merge commit (class 3).
9. Each done item's test name.
10. §7's count.
11. PLAN set to done with `{pr}` in the done commit only.

## §10. Amendments

*(Opens empty; append-only.)*

## OPEN (for the human; each is ruled before the step it names)

- **OPEN-1:** MultiPoint in scope? (A) Point only, recommended; (B) Point and MultiPoint. Rule before dispatch.
- **OPEN-2:** the refusal wording: the sighted template with three types, and a mixed-kind placeholder. Rule before the PR is set ready.
- **OPEN-3:** styling and `POINT_RADIUS_PX`. Rule before commit 4.
- **OPEN-4:** the pick-resolution rule for points. Rule before commit 4.

### Amendment 1 — question round 62's rulings (OPEN-1 to OPEN-4); row P2's pile of points (class 7); C-1 confirmed by code

*Written by the custodian after question round 62 was answered and before any code: no branch exists. It is appended at the file's end, below the OPEN list, and belongs to §10. The rulings are `state/directives/2026-10-06-round-62-rulings.md`, lines 6 to 9 (sha256 ab74437d85a8720bd274cf7f26f372d96f4032e3dcf5bae5f2964606f38e7577, a9f46581a22ba3635c46637674f2eb7eb6f94c1823777e2fac2b1fcfd07ec9fd, 31b0a7ad439283bff4e2e5189e1ba0fcf2809b77fcabd35249186138aca44982 and d5c6424f95c7eb5b4531251fc7cb0819c256f85b4b3499483e47e1ab798356f3, one per line, at the commit that adds it), with their RULED block in `DECISIONS-PENDING.md` under round 62, referenced and not restated. Nothing below is a quotation.*

1. **OPEN-1, (A).** Point only. The parts marked [OPEN-1] are binding as drafted for (A): MultiPoint is refused at open with the sighted template, whose set renders three types (P-4).
2. **OPEN-2, (A).** The parts marked [OPEN-2] are binding.
   - A member outside the readable set keeps the sighted template, with its code unchanged.
   - A set that mixes readable kinds stays refused at open as `engine.geo_metadata`, with its own detail. That detail is a `[P6 placeholder]`, and the human sights it at P6. The worker's placeholder text is the draft in the ruling (line 7), byte-copied from the directive file by script, and marked as the placeholder.
   - The PR's ready state no longer waits on OPEN-2, because the wording is sighted at P6.
3. **OPEN-3, (A), with `POINT_RADIUS_PX` = 4 CSS pixels.** The parts marked [OPEN-3] are binding, read as the ruling reads ADR-022 Decision 4:
   - the mapping onto the point symbol is rendering plumbing, in the working canvas only;
   - the style document's meaning does not change: it still says polygon, and the radius is a shell constant outside it;
   - **this cut adds no path that saves a point layer's style document.** Saving one as a polygon document needs the human's ruling, and B2's form says what Save does. Adding such a path is block-on-sight for both gates, as an addition to §8;
   - KNOWN-LIMITATIONS item 35 is as drafted, for the human's P6 sight;
   - a walkthrough verdict may revise the radius.
4. **OPEN-4, (A).** The parts marked [OPEN-4] are binding:
   - ADR-028 item 4's 9 px threshold is compared with the average on-screen spacing of the resident points, computed once per render, with the same named refusal state and text;
   - deck's `pickingRadius` stays unset;
   - KNOWN-LIMITATIONS item 36 is as drafted, for the human's P6 sight.
5. **Class 7, a sight-list addition from the OPEN-4 ruling:** operator row P2 also hovers a visible pile of points, and the human records whether naming the topmost symbol is acceptable. Option (B) is the follow-up only if that verdict says it is not. The worker writes this step into Part P's P2 row, with a blank result line.
6. **C-1 applies.** The custodian confirmed by reading the code at 7e3a00a6, not by an app run, that MP-1's F-1 meets the no-covering refusal on the canvas:
   - F-1's generator writes rows with no covering;
   - the engine refuses a bbox query on a file without one;
   - the shell's viewport path always sends a bbox.

   So the [C-1] parts are in scope: the covered F-1c generator, and Part S's second dated note naming F-1c for S2. The app run that confirms it is the operator's, at the sitting.
7. **Generation 2.** Dispatch may start, beginning with commit 1. Commit 4 no longer waits.

**Superseded index.**
- The OPEN list and every [OPEN-1] to [OPEN-4] mark → items 1 to 4, binding.
- §9's note that commit 4 waits on OPEN-3 and OPEN-4 → item 7.
- The [C-1] condition → item 6.
- Part P's row P2 → item 5 adds a step.

### Amendment 2 — phase A's outcomes: the build's deviations (class 2), the kernel group over its ceiling so far, and the clippy reading

*Written by the custodian after phase A's results were seen, at the branch head edbc0f3c1e45adbc7e7c19e3131bba820faaca2e, before phase B and before either gate. The record is worker report 1, `state/consults/2026-10-06-geometry-points-cut-worker-report-1.md` (sha256 dfa3c82ea78701f358f61ef495890f8b9a5a0209624f2680d250fe492729058f, from its line 5 to the end), cited by section. Nothing below is a quotation.*

1. **Phase A's commits:** b4a6fd9d8f6f9583e27149b30b149b5a789f6f7d (engine), ffa42b5d13650e9ea9bbbe6dee2adb6c39053316 (kernel tests and generators, F-1c included) and edbc0f3c (wire, `skp/0.10`).
2. **Class 2, PE-6:** §4's registered mutation, returning the whole child, cannot fail its test, because Arrow's slice already windows a fixed-size list's child. The mutation that fails it reads only the first two values. The test's comment records both (the report's Deviations). §4 is not edited.
3. **Class 2, failure points:** the observed failure points of PE-2, PE-4, PE-5 and A-3 differ from the drafted ones. Each test still fails by name, and its comment states what was observed (the report's Mutations table).
4. **Class 2, two more:**
   - S-P2's test is named so that it does not repeat an MP-1 test name;
   - the batch regenerator's one added line changes an existing ignored test, whose mutation was re-observed.
5. **OPEN-2's placeholder:** the code holds the ruling's draft (round 62, line 7) byte-copied by script, without the sentence's final period, behind the `[P6 placeholder]` tag. The declared list is substituted, and the kind labels are fixed text, not derived from E-P1's mapping at run time. The human sights the wording at P6. The reviewer checks the bytes against the directive file.
6. **§7 so far:** 1,809 lines over 35 files, against 3,220 over 64. The kernel group is at 260 against 220, before phase B adds the kernel README's index lines. The class 8 record is made once, at the gated head, with the final figures. §7 is not edited.
7. **The clippy reading:** §9's suites name clippy without flags, and no CI workflow runs it. As MP-1's reviewer ran it, the reading is clippy over the workspace's targets with no new warning on an added line. Under `-D warnings` it fails at the base on code this diff does not touch (the report's Checks). The brief's `-D warnings` was the custodian's error.
8. **Generation 3.**

**Superseded index.** §4's PE-6 mutation → item 2. §4's drafted failure points for PE-2, PE-4, PE-5 and A-3 → item 3. §9's clippy line → item 7, read and not edited.

### Amendment 3 — phase B's outcomes (class 2 and class 3), and a pile-of-points fixture for row P2 (class 9)

*Written by the custodian after phase B's results were seen, at the branch head 7620550a8a5cbf1bca5f9f43059c28fe834115af, before either gate. The record is worker report 2, `state/consults/2026-10-06-geometry-points-cut-worker-report-2.md` (sha256 42d59115baa75256c300a1f80f12c32c763fd5eb88bd3978a4911d46d1918207, from its line 5 to the end), cited by section. Nothing below is a quotation.*

1. **Phase B's commits:**
   - 70bcb3295970937c02105751ff8b9399bd3689e0, the shell;
   - 55df46fd1b52de15f152439dd15664f75b1f04a6, the docs;
   - ac54f4d399b0c05379f4a9e1145b6abac7927e65, the P4 generator edits;
   - 7620550a, the P4 re-run at ac54f4d3.

   §9's commit 5 is split into three, so that the re-run ran at a clean committed tree.
2. **Class 2, the walkthrough's Part P.** `frontends/shell/MANUAL-WALKTHROUGH.md` already holds a Part P, for an earlier piece. The new Part keeps the form's name and rows P1 to P7, so that the form's and Amendment 1's references stand, and its first paragraph says which Part P it is.
3. **Class 2, tests beyond §4's rows,** each with its own observed mutation (the report's Mutations table):
   - SH-P2's cache-rule test;
   - SH-P4, written as two tests: the spacing branches, and the selector.
4. **Class 2, `buildLayers`'s `kind`.** It is a required parameter, as `geometryEncoding` is, so 25 existing call sites in its test file change. The polygonal path is unchanged in behaviour.
5. **Class 2, KNOWN-LIMITATIONS items 31 to 33** are edited in place for Point, as §2 lists them. Items 35 and 36 are as drafted.
6. **Class 3, the P4 generator's literals:** the boundary-8 line and its row label name #5. An empty set prints as none.
7. **Class 9, a scope addition from the human's OPEN-4 ruling** (round 62, line 9; Amendment 1, item 5):
   - **The gap:** row P2 must hover a visible pile of points, and no fixture draws one. P-1's six points are at least 10 m apart, and the spacing refusal starts before their symbols touch (the report's Deviations, item 2).
   - **The addition:** one more ignored walkthrough generator in `kernel/tests/manual_walkthrough_fixtures.rs`. It writes P-1's rows and a pile at one point of P-1's extent, all with a covering, so that the average spacing stays above the 9 px threshold at a zoom where the pile's symbols overlap.
   - **Row P2's pile step** names that file in place of its no-pile fallback. The test count is unchanged, because a generator carries no recorded mutation, as phase A's generators do not.
   - It lands in one fix commit before either gate, and §7's class 8 record then gives the final figures.
8. **Noticed by the worker and not done, for the gates** (the report's Noticed section):
   - MP-1's E2E step MP' still opens F-1, which has no covering, so by Amendment 1's item 6 it is expected to meet the no-covering refusal. F-1c is its covered twin. The form keeps existing E2E steps unedited, so whether MP' moves to F-1c is for the gates to weigh.
   - The generated P3 line names only #8 as excluded by the primary-provenance precedence, and #5 is now excluded too.
   - The engine README's Declared-limits line does not list items 35 and 36; §8 item 18 keeps that line out of the index edit.
   - No KNOWN-LIMITATIONS line names a Point file with no covering.
9. **A timing-sensitive failure in a shared run,** not recorded as a failure: `src/notices/noticeDeterminism.test.ts` failed once while a held cargo build ran, and passed when the worker re-ran it with nothing else of this project running. The custodian's re-run alone under an exclusive hold gave up with 96 at 22:16:16Z, because another heavy run kept the machine busy. It is re-run when status shows none.
10. **Generation 4.**

**Superseded index.** §9's five-commit plan → item 1. Part P's row P2, its no-pile fallback → item 7. §4's row list → item 3 adds tests.

### Amendment 4 — budget overrun, §7 not edited (class 8), at the gated head

Budget overrun, §7 not edited. *Written by the custodian after the build's results were seen, at the head 2e481e743e48a73b402acdf51c02ade172cce0dc, before either gate. The figures are §7's command from d3fe60558568d2db8ffdc09220134442acff8144 to that head, grouped by §7's table. The fix commit is worker report 3, `state/consults/2026-10-06-geometry-points-cut-worker-report-3.md` (sha256 bf97e536764b463e04373e55782c52c05a608cca0af4b4cd845428407e156155, from its line 5 to the end). Nothing below is a quotation.*

1. **Declared:** at most 3,220 changed lines over at most 64 files (§7).
2. **Final:** 2,660 lines over 53 files, within both totals.
3. **By group:**
   - engine product: 573 over 6, against 750;
   - engine tests: 806 over 7, against 850;
   - **kernel: 306 over 4, against 220, over by 86.** It is phase A's tests and generators (260), the kernel README's index lines (8), and Amendment 3's pile generator (38);
   - protocol: 209 over 17, against 260;
   - shell product: 245 over 7, against 380;
   - shell tests and seams: 425 over 9, against 560;
   - docs: 96 over 3, against 200.
4. **Why the kernel group grew:** the generators for F-1c and the pile, which §7's ceiling did not foresee (C-1 was conditional, and the pile is a class 9 addition), and phase A's kernel tests. No kernel product line changed: the 78 lines in `kernel/src/skp.rs` are one hunk inside its `mod tests`.
5. **The fix commit (2e481e74):** `generate_the_point_pile_fixture` writes `point-pile.parquet`. It holds P-1's six points and five more within about 7 cm of P-1's second point, with a covering. By worker report 3's figures, the average spacing reaches the 9 px threshold at about zoom 1.07, and the pile's symbols overlap up to about zoom 6.8. Row P2 names the file. No helper or `pub` item was added. The workspace gives 885 passed and 50 ignored.
6. **Generation 5.**

**Superseded index.** None. §7 is not edited.

### Amendment 5 — the closing record (class 1, with class 3 for T-1's span)

*Written by the custodian after the outcomes were seen. PR #185 merged at 2026-10-07T04:12:28Z as merge commit 37b420029d3482c654e62f6e1db5d1ad1f994ead, with parents dec87a1d62c411c915637ef4945a56c55408b6b2 and 6d5a6cf33da92135cb48104b129f11e8667824f6. It follows §9's closing-record list and routes the gates' record items. References and hashes only. Nothing below is a quotation.*

1. **The PR and its heads:**
   - PR #185, at the merge commit above;
   - both gates' reviewed head, 2e481e743e48a73b402acdf51c02ade172cce0dc, at generation 5;
   - the merged head, 6d5a6cf3. It adds only the gate-1 Documentation fixes, in 2ff9a8e67fb3472172974755bb182c486bc97e44, 0a6324e09e64baa3cf6bc3c38ee9ee1b721dbee3 and 6d5a6cf3. The custodian checked each against its finding (worker report 4), and CI was green there.
2. **The gate reports,** under `state/consults/gates/`:
   - `2026-10-07-geometry-points-cut-gate1-architect.md`, pass with notes, gate-log 427, sha256 56b937d7f7c484e4a8ccd681ed628258074746f47fc3028156380f9fe0f23e46, added in 54f304193a76f3ff90593513da5dbe5910c16819;
   - `2026-10-07-geometry-points-cut-gate1-reviewer.md`, pass, gate-log 428, sha256 3c083f8ddae3ee01bf7edee1919999f80699b5e65fdb113b438948657f41910d, added in a14aceb6b2f96e2e84d61d55e1daddf6b0193ea3.
3. **The worker reports, each pinned at the commit that added it** (the reviewer's D-5). Each hash is of the file from its line 5 to the end, and each file is byte-identical at the merge commit:
   - `state/consults/2026-10-06-geometry-points-cut-worker-report-1.md`, at ff6d05a54a55ac5605c3efb9f0fd9da238dde09a, sha256 dfa3c82ea78701f358f61ef495890f8b9a5a0209624f2680d250fe492729058f (Amendment 2);
   - `-report-2.md`, at 4ea0c6c0cb949a3f39897cf95a6b379abdd5dcbb, sha256 42d59115baa75256c300a1f80f12c32c763fd5eb88bd3978a4911d46d1918207 (Amendment 3);
   - `-report-3.md`, at 0723892baf8da6047640da234a671feac5853048, sha256 bf97e536764b463e04373e55782c52c05a608cca0af4b4cd845428407e156155 (Amendment 4);
   - `state/consults/2026-10-07-geometry-points-cut-worker-report-4.md`, the gate fixes, at 99f4c437e81ad3286a9f388ea466e3f76d322556, sha256 cd27bcab2418d9436f2439c18d654a444c2bc188ba442f2b234c01d6ec2c4ea1.
4. **§6's files at the merge commit.** Each of the first four is byte-identical to the base d3fe6055:
   - `engine/tests/data/golden/polygon-wire.golden`, sha256 d810e6a8659c82c322231d9c784e8d9fbb4e0f074bb325e3cebf1f94ddcab15d;
   - `kernel/tests/data/golden/publish-partitions.golden`, sha256 5b10ddd64ca60db9009ab1453cf99098353e4a9b93bcf012dca089586b0c7e01;
   - `engine/tests/data/geoarrow/lv95-polygon-batch.arrows`, sha256 d0afe93e143c0e2de16f7fad6eb9272a687195dfec6f68999e7dc7b24ba78197;
   - `engine/tests/data/geoarrow/lv95-multipolygon-batch.arrows`, sha256 831eb54076cf565eac33b673749f8fa3a6a2f481ff3c831a371f740abf6673fa;
   - BF-P, `engine/tests/data/geoarrow/lv95-point-batch.arrows`, which is new in b4a6fd9d, sha256 10c17431583bc49d772ddffe92e59a8644397103f140b055fb38ffd1d65f267f.
5. **The mutations:** each row's observation commit is in its test's recorded-mutation comment and in the worker reports' Mutations tables. The reviewer re-made every row at 2e481e74, and each failed its test by name except PE-6's registered mutation, as Amendment 2, item 2 records (the reviewer report's Mutations section).
6. **The literal minted:** `skp/0.10`, at `protocol/skp/src/v0/mod.rs:101 @ 37b42002 sha256:a8309142dd0c7612f3b7fbbb69439604013081d476792ac5f58500c2f7e86de6`. Its §8 entry is `protocol/skp/SKP-V0.md:1016-1036 @ 37b42002 sha256:bbcd090cb13fa3fa3d24cb3bb0e7fbf1921e14ba1e8553162e88e1f1af948226`.
7. **`engine/ADMISSION-RESULTS.md`** has sha256 74b408b520e84692d3664b89ccc594e56120d614389a98f1262a1888cb8f2c43 at the merge commit. Its header names the tree 0a6324e0, a committed branch commit, and 6d5a6cf3 committed the output.
8. **T-1's new span, class 3:** `engine/tests/lod_tier_builder.rs:1494-1501 @ 37b42002 sha256:48c8e24ef2bc76a5fa5a8426f522d9f949c21c63b58d9e7d5a27a0a9cddd8bce`. It was changed in b4a6fd9d and replaces §2's superseded span.
9. **The done items' proofs:**
   - §4's rows, by name, with Amendment 3, item 3's added tests;
   - each one re-observed by name at 2e481e74 (the reviewer report's Mutations and P-5 sections).
10. **§7:** 2,666 changed lines (2,400 insertions, 266 deletions) over 53 files, against at most 3,220 over 64. The count is `git diff --numstat dec87a1d 37b42002` with §7's two exclusions.
    - This is Amendment 4's 2,660 plus the gate fixes' 6 lines: engine tests reach 810 against 850, and shell product reaches 247 against 380.
    - The kernel group stays at 306 against 220 (Amendment 4, class 8).
11. **Amendment 3, item 7's spacing figure, corrected by reference** (the architect's D-3): the closest pairs of P-1's points, k and k+3 in `point_p1`, are about 9.64 m apart, not at least 10 m. The conclusion stands, because they are about 15 px apart where the spacing refusal starts. Row P2 was fixed in 2ff9a8e6, and Amendment 3 is not edited.
12. **PP-5's ignored set** (the architect's D-6): its closed list gains one more ignored test, the pile generator `generate_the_point_pile_fixture`, under Amendment 3, item 7. That makes 50 ignored at 2e481e74 (Amendment 4, item 5). §5 is not edited.
13. **Routed:**
    - MP' still opens F-1, which has no covering, and is predicted to meet the no-covering refusal at its next run (Amendment 1, item 6). The proposed node `mp-prime-e2e-covered-fixture` is appended to PLAN in this amendment's commit, for the human's placement (Amendment 3, item 8; the architect's noticed item 1).
    - The engine README's Declared-limits line and the shell-owned items 35 and 36 go to the next piece that touches the indexes (the architect's noticed item 3).
    - `noticeDeterminism.test.ts`'s re-run, alone under an exclusive hold, is still owed (Amendment 3, item 9).
14. **Operator:** Part P (the points one) and the E2E step PT' are unrun. They are queued for the sitting with MP-1's Part S.
15. **Done:** PLAN marks the node done, with evidence `{pr: 185}`, at generation 6, in this amendment's commit.

**Superseded index.** Amendment 3, item 7's spacing figure → item 11. §5's PP-5 ignored set → item 12. §2's T-1 superseded span → item 8. None is edited.
