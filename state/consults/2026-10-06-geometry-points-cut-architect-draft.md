*Custodian's filing note (2026-10-06): the architect's draft of `geometry-points-cut`'s preregistration, on the custodian's brief at main 7e3a00a6, drafted alone while the lead-data pilot is paused. It arrived as a message and is extracted here by script from the SubagentHandback call in the subagent's own transcript, with nothing changed except one final newline. Its sha256, from this file's line 5 to the end, is f9e1d87ecc63a2051014af35903417dc7275497ad0011bbbd4a7943e307ac6ab. Write audit PASS: zero write calls (Read 57, Grep 45, Glob 3, SubagentHandback 1). Run window from the transcript: 2026-10-06T18:30:32.943Z to 2026-10-06T18:48:35.082Z (the harness's usage line: 400,197 subagent tokens, 106 tool uses, 1,082,211 ms). The form as committed, `engine/GEOMETRY-POINTS-PREREGISTRATION.md`, is part 2's block with its 67 HASH-TBD pins computed at 7e3a00a6, and with the one sentence that said the custodian computes them rewritten to say they were computed; nothing else changed. The pins in parts 1 and 3 below are left as returned.*

---

Reviewed: main @ 7e3a00a6

## 1. Which form, why, and what is the human's

**Form.** This piece needs the full form, with full gating from dispatch. A five-line form is not available.
- **§21a categories it touches:**
  - **Wire.** A third `describe.geometry.encoding` value and the literal `skp/0.10`. ADR-034's Consequences have each cut take its own literal (`docs/adr/ADR-034-geometry-type-admission-and-geoarrow-encoding-selection.md:139-149 @ 7e3a00a6 sha256:HASH-TBD`).
  - **Stated guarantees.** The Polygon and MultiPolygon bytes must not move. ADR-034's no-silent-drop rider applies. ADR-028 item 4's sub-pixel pick refusal has to be applied to a new kind of geometry.
  - **ADR.** It inherits ADR-034, which can block. It also needs the human's reading of ADR-022 Decision 4 (OPEN-3).
- **Size.** About 3,200 lines by §21c's count, tests included, so it is far over the bound anyway.
- §25(e) therefore closes the five-line route at dispatch.

**Where it lives.** `engine/GEOMETRY-POINTS-PREREGISTRATION.md`, on branch `cut/geometry-points-cut`, merged by a merge commit.
- When the form commits, the custodian sets `gate:` and `merge: merge-commit` on the node.
- The node does not go in progress until the form is committed.

**What is the human's.** Four OPEN items, detailed in section 3:
- OPEN-1: is MultiPoint in scope?
- OPEN-2: the refusal wording for this cut.
- OPEN-3: how points are styled, and the symbol radius.
- OPEN-4: the pick-resolution rule for points.
- Recommended timing: rule OPEN-1 before dispatch. Rule OPEN-3 and OPEN-4 before the shell commit (commit 4). OPEN-2 holds only the PR's ready state.

**Found while drafting, for you to route.** I read these; I ran nothing.
- **MP-1's F-1 fixture has no covering.** Its generator writes rows with `with_covering_bbox: false` (`kernel/tests/manual_walkthrough_fixtures.rs:207-229 @ 7e3a00a6 sha256:HASH-TBD`). The shell sends a bbox on every viewport query and never reads `describe.covering_bbox`. The engine refuses a bbox query on a file with no covering (`engine/src/stream.rs:1472-1475 @ 7e3a00a6 sha256:HASH-TBD`).
  - So MP-1's E2E step MP' (it asserts no refusal or banner after the stream) and Part S row S2 (all six parts drawn) are likely to meet `engine.no_covering_bbox` on the canvas.
  - The draft's item C-1 offers a fixture with a covering, built on this cut's new writer mode. It is your choice, and depends on confirming the problem first.
- **Part S row S4 will go stale at this cut's merge.** It reads the sighted wording by opening corpus #2 (`frontends/shell/MANUAL-WALKTHROUGH.md:1582 @ 7e3a00a6 sha256:HASH-TBD`). After this cut, #2 refuses on its CRS, not its geometry type. The draft adds a dated note under Part S and gives the wording check to Part P, row P7.
- **Several MP-1 tests change by necessity,** because each uses `["Point"]` as its example of an unreadable type:
  - A-1, A-2 and A-3 (`engine/tests/geometry_admission.rs:118-119 @ 7e3a00a6 sha256:HASH-TBD`, `:147-203`);
  - SH-2 (`frontends/shell/src/canvas/decodeBatch.test.ts:183 @ 7e3a00a6 sha256:HASH-TBD`).
  - The draft re-points each one and has the reviewer re-observe its mutation.
- **On a point dataset, every hover would be refused.** `averageFeatureExtent` is 0 for a single-vertex feature (`frontends/shell/src/canvas/pickResolution.ts:90-117 @ 7e3a00a6 sha256:HASH-TBD`), and the hover site refuses below 9 px (`frontends/shell/src/canvas/WorkingCanvas.tsx:2000-2003 @ 7e3a00a6 sha256:HASH-TBD`). Hence OPEN-4.
- **The style document only allows polygons.** The shell's document producer is typed `geometry: "polygon"` (`frontends/shell/src/style/document.ts:109-118 @ 7e3a00a6 sha256:HASH-TBD`). ADR-017 §5a says v1 styles polygons only (`docs/adr/ADR-017-static-bundle-format-and-publish-semantics.md:260-261 @ 7e3a00a6 sha256:HASH-TBD`). Hence OPEN-3.

## 2. The draft

````markdown
# Points — admission, row decode, encoding selection, the envelope and `describe`, the shell's decode, drawing, picking and styling, and the publish refusal — preregistration

## Header

- **Status.** The preregistration of PLAN node `geometry-points-cut` (`PLAN.yaml:2279-2295 @ 7e3a00a6 sha256:HASH-TBD`). Committed before any code. Append-only once committed. An amendment written after any outcome has been seen says so in its first line.
- **Form.** Full form, full gating from dispatch (AUTONOMY §21a: wire, stated guarantee and ADR categories, and §21c's size bound; §25(e)). No five-line form exists for this piece.
- **Authority:**
  - the product-first direction, section 4 (the order) and section 8.c (placement): `state/directives/2026-10-05-product-first-direction.md:19 @ 7e3a00a6 sha256:HASH-TBD`, `state/directives/2026-10-05-product-first-direction.md:30 @ 7e3a00a6 sha256:HASH-TBD`;
  - ADR-034, Accepted and architect-blockable. Its Consequences paragraph on points and lines binds this cut: `docs/adr/ADR-034-geometry-type-admission-and-geoarrow-encoding-selection.md:139-149 @ 7e3a00a6 sha256:HASH-TBD`;
  - the 2026-10-05 ADR-034 acceptance, items 5 and 6: `state/directives/2026-10-05-adr-034-acceptance.md:11-12 @ 7e3a00a6 sha256:HASH-TBD`;
  - MP-1's closing record, Amendment 6, item 12, routing C-n1 and DR-3 here: `engine/MULTIPOLYGON-MP1-PREREGISTRATION.md:712-714 @ 7e3a00a6 sha256:HASH-TBD`;
  - RULED 2026-09-24 (night), item (2): literals follow merge order;
  - drafting by the architect, question round 43, item 2;
  - the owner's-index update by the implementing worker, in the same PR: `state/directives/2026-10-05-product-first-direction.md:11 @ 7e3a00a6 sha256:HASH-TBD`.
- **Drafted by** the architect agent, alone, on the custodian's brief, with no impact read (the lead-data pilot is paused). The tree was read from the main checkout at 7e3a00a6. Read-only: the architect ran no command. The custodian computes every `HASH-TBD`.
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
  - docs/08 defines a Points class, with the visible count undefined (`docs/08_Testing.md:29 @ 7e3a00a6 sha256:HASH-TBD`). No budget can therefore be measured for it.
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

**E-P1. The readable set.** `READABLE_GEOMETRY_TYPES` becomes `Polygon`, `MultiPolygon`, `Point`, in that order (`engine/src/geoarrow.rs:63 @ 7e3a00a6 sha256:HASH-TBD`).
- It is still read by the gate and by the text (`engine/src/geoarrow.rs:66-72 @ 7e3a00a6 sha256:HASH-TBD`).
- A `pub(crate)` kind mapping beside it: Polygon and MultiPolygon are polygonal; Point is point.

**E-P2. Admission** (`engine/src/geoarrow.rs:84-105 @ 7e3a00a6 sha256:HASH-TBD`). Matching stays case-insensitive. The checks run in this order:
1. `None` or `[]` gives `MultiPolygon`, unchanged (ADR-034 Decision 2).
2. Any member outside the readable set is refused with the sighted template, unchanged code. The template is `state/consults/2026-09-24-multipolygon-assessment.md:206 @ 6030dfd2814b sha256:ddae06db5d61fa8f420f73843d5e900805bbb9eb26341f5a53effa571cdc4be3` (a sub-line span; the hash is the line's). Its readable-set clause now renders three types. MultiPoint and Z or M names land here **[OPEN-1]**.
3. Every member Point gives `GeometryEncoding::Point`.
4. Every member Polygon gives `Polygon`, unchanged.
5. Members within {Polygon, MultiPolygon} give `MultiPolygon`, unchanged.
6. Otherwise, Point with a polygonal member: refused at open as `EngineError::GeoMetadata`, as ADR-034 Decision 7 requires (`docs/adr/ADR-034-geometry-type-admission-and-geoarrow-encoding-selection.md:93-96 @ 7e3a00a6 sha256:HASH-TBD`).
   - **[OPEN-2] (A):** a `[P6 placeholder]` detail stating the declared list, rendered as today's message renders it, and that the engine reads one kind per column, naming the kinds from E-P1's mapping.
   - It states engine facts only.
- The call site is unchanged (`engine/src/dataset.rs:364-368 @ 7e3a00a6 sha256:HASH-TBD`).

**E-P3. Accessors, and C-n1.**
- `GeometryEncoding` gains `Point`; `as_str()` gives `geoarrow.point`.
- New `pub(crate) const EXT_NAME_POINT`.
- **N-1 (C-n1, narrowed here).** `EXT_NAME_MULTIPOLYGON` (`engine/src/geoarrow.rs:31 @ 7e3a00a6 sha256:HASH-TBD`) and `BatchEnvelope::geometry_encoding` (`engine/src/envelope.rs:292-294 @ 7e3a00a6 sha256:HASH-TBD`) become `pub(crate)`.
  - Reason: this cut edits both files, and neither item has a caller outside the crate (PR #182's gate-1 reviewer report, DR-1). The worker re-greps `kernel`, `protocol`, `renderer` and `frontends/shell/src-tauri` at the base.
  - Proof: both Cargo workspaces build. No mutation applies to a visibility change.
- No other new `pub` item. New builders and validators are `pub(crate)`.

**E-P4. Row decode.** `engine/src/wkb.rs` gains `pub(crate) PointBuilder`, with one interleaved coordinate buffer.
- **Reads:** byte order; then a type code that must be exactly 1, with no EWKB flag; then x and y, with their bits carried through and no arithmetic (`engine/src/wkb.rs:19-20 @ 7e3a00a6 sha256:HASH-TBD`).
- **Refused by name as `EngineError::Wkb`, each with `[P6 placeholder]` text naming what was met:**
  - EWKB flags;
  - any type other than 1, ISO Z, M and ZM codes included;
  - a NaN in either coordinate. That is WKB's empty-Point convention, and it is refused under the strict-decode policy (`engine/src/wkb.rs:11-17 @ 7e3a00a6 sha256:HASH-TBD`), rider 1 and acceptance item 5;
  - trailing bytes;
  - truncation.
- **Every refusal** stops the stream at that row, skips nothing, and states no consequence.
- `PolygonBuilder` and `MultiPolygonBuilder` are unchanged: both still refuse type 1 (`engine/src/wkb.rs:176-234 @ 7e3a00a6 sha256:HASH-TBD`, `engine/src/wkb.rs:597-613 @ 7e3a00a6 sha256:HASH-TBD`).

**E-P5. Encoding.** `engine/src/geoarrow.rs` gains:
- the point storage type, `FixedSizeList<xy: Float64>[2]`, non-null;
- `build_point_array`;
- a structural `validate_point_encoding`;
- the `storage_type` and `validate_encoding` arms (`engine/src/geoarrow.rs:144-149 @ 7e3a00a6 sha256:HASH-TBD`, `engine/src/geoarrow.rs:422-427 @ 7e3a00a6 sha256:HASH-TBD`);
- in `coordinate_values` (`engine/src/geoarrow.rs:308-339 @ 7e3a00a6 sha256:HASH-TBD`), an arm that reads a top-level fixed-size list over its own slice window only.

The polygon and multipolygon types, builders and validators are unchanged.

**E-P6. Envelope.** No code change beyond N-1.
- The key and the field are written from the encoding.
- `TaggedBatch::assemble` validates through E-P5's arm (`engine/src/envelope.rs:331 @ 7e3a00a6 sha256:HASH-TBD`).
- `xy_bounds` reads points through `coordinate_values` (`engine/src/envelope.rs:377-381 @ 7e3a00a6 sha256:HASH-TBD`).

**E-P7. Stream.**
- `GeometryBuilder` gains a `Point` arm (`engine/src/stream.rs:2149-2184 @ 7e3a00a6 sha256:HASH-TBD`).
- **`estimate_bytes` is not edited** (`engine/src/stream.rs:2253-2264 @ 7e3a00a6 sha256:HASH-TBD`). Its doc gains one sentence: for points, vertices equals rows and no offsets are written, so the estimate bounds a point batch. S-P3 asserts it.
- The per-row incoming estimate counts a 21-byte point WKB as one vertex (`engine/src/stream.rs:1996-2002 @ 7e3a00a6 sha256:HASH-TBD`).

**E-P8. Module doc.** The encoding sentence names the third encoding (`engine/src/lib.rs:17-22 @ 7e3a00a6 sha256:HASH-TBD`).

**E-P9. Test support, behind the `fixture` feature:**
- `encode_point`;
- `GeometryMode::RowsWithBounds`: explicit WKB rows, each with the covering bounds it declares, so a fixture can carry a covering (`engine/src/fixture.rs:500-508 @ 7e3a00a6 sha256:HASH-TBD`; the refusal at `engine/src/fixture.rs:913-917 @ 7e3a00a6 sha256:HASH-TBD` still holds for plain `Rows`);
- point-row helpers.

The default writer stays byte-identical, by G-1's fixture hash.

**E-P10. LOD.** `engine/src/lod.rs` is not edited. It refuses a Point feature by name (`engine/src/lod.rs:1554-1562 @ 7e3a00a6 sha256:HASH-TBD`, `engine/src/lod.rs:1656-1669 @ 7e3a00a6 sha256:HASH-TBD`). L-P pins it.

**T-1 (DR-3, class-3 test text).** Correct L-1's recorded-mutation comment. Superseded span: `engine/tests/lod_tier_builder.rs:1494-1496 @ 7e3a00a6 sha256:HASH-TBD`.
- **The new text keeps the mutation.** It states that the mutated build is refused by the tier-size ceiling, and that the test fails by name at its `Err(other)` arm.
- **The observation of record** is PR #182's gate-1 reviewer report, its Mutations table, row L-1, at c4c251d46e55 (round 25, item 2 (c)).
- **The reviewer** re-makes the mutation at this cut's head.
- **Until the merge,** the new span is named in words with its branch commit id (round 25, item 2 (d)). The closing record pins it at the merge commit.

### Kernel

**K-P. No product change.**
- `describe_dataset` takes `encoding` from `as_str()` (`kernel/src/skp.rs:1928 @ 7e3a00a6 sha256:HASH-TBD`).
- K2 compares the dataset's encoding with the format's declared one (`kernel/src/publish/mod.rs:484-498 @ 7e3a00a6 sha256:HASH-TBD`), after the degrees check (`kernel/src/publish/mod.rs:472-483 @ 7e3a00a6 sha256:HASH-TBD`).
- A point dataset is therefore described as `geoarrow.point` and refused at publish as `publish.geometry_encoding_not_publishable`.

**Walkthrough fixtures.** These are ignored generators in `kernel/tests/manual_walkthrough_fixtures.rs`:
- `generate_the_point_p1_fixture`: P-1, with a covering, via E-P9;
- `generate_the_declared_linestring_fixture`;
- `generate_the_declared_polygon_and_point_fixture`;
- **[C-1]** `generate_the_multipolygon_f1_with_covering_fixture`, only if the custodian confirms that MP-1's F-1 meets `engine.no_covering_bbox` in the app. F-1's own generator is not edited (`kernel/tests/manual_walkthrough_fixtures.rs:207-229 @ 7e3a00a6 sha256:HASH-TBD`).

### Protocol

**W-P1.** The doc on `GeometryInfo.encoding` lists three values (`protocol/skp/src/v0/commands.rs:169-173 @ 7e3a00a6 sha256:HASH-TBD`). No field changes. `deny_unknown_fields` stays.

**W-P2. The literal and its fixtures, in one commit** (`protocol/skp/SKP-V0.md:280-296 @ 7e3a00a6 sha256:HASH-TBD`, condition (iii)).
- **The number.** `skp/0.10`, the literal after main's at the final merge (`protocol/skp/src/v0/mod.rs:88-95 @ 7e3a00a6 sha256:HASH-TBD`). Another number forced by an earlier merge is stated in the closing record, not amended.
- **Rust side and TS side together:** every file that carries the literal, `frontends/shell/src/skp/types.ts` among them (`frontends/shell/src/skp/types.ts:15 @ 7e3a00a6 sha256:HASH-TBD`).
- **The version-refusal conformance fixture** is renumbered from `skp/0.10` to `skp/0.11`, as `skp/0.9` did (`protocol/skp/SKP-V0.md:1008-1014 @ 7e3a00a6 sha256:HASH-TBD`).
- **`skp_version_is_skp_0_9` is renamed** to `skp_version_is_skp_0_10`. P-5 names this rename.

**W-P3. SKP-V0.**
- §1's `geometry` line names the third value (`protocol/skp/SKP-V0.md:71-73 @ 7e3a00a6 sha256:HASH-TBD`).
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

**SH-P1. Decode** (`frontends/shell/src/canvas/decodeBatch.ts:21-24 @ 7e3a00a6 sha256:HASH-TBD`, `:103-109`, `:136-165`).
- `ENCODING_POINT`, and the check accepts three values.
- A point row decodes to one part holding one single-position ring. `ResidentBatch`'s doc states this shape (`frontends/shell/src/canvas/decodeBatch.ts:64-82 @ 7e3a00a6 sha256:HASH-TBD`); its type is unchanged.
- `partToRow` is the identity, and `partCount` and `totalVertices` equal the row count.
- A pure `geometryKindOf(encoding)` returns `polygonal` or `point`.
- `UnexpectedEncodingError`'s text names three encodings, as a `[P6 placeholder]` (`frontends/shell/src/canvas/decodeBatch.ts:33-45 @ 7e3a00a6 sha256:HASH-TBD`).

**SH-P2. Drawing.** `buildLayers` takes the open's kind (`frontends/shell/src/canvas/buildLayers.ts:262-287 @ 7e3a00a6 sha256:HASH-TBD`). `WorkingCanvas` derives the kind once from `geometryEncoding` and passes it.
- **Point:** one `ScatterplotLayer` per batch.
  - Its id is `layerId(batch)`.
  - Its data is cached offset-relative positions, under the same cache rule as polygons (`frame.toLocal` in f64 before any narrowing; ADR-010 rule 3).
  - `CARTESIAN`, pickable, `radiusUnits: pixels`, radius `POINT_RADIUS_PX` **[OPEN-3]**.
  - Fill from `draw.fillColor`. A stroke only when `outlineWidth > 0`, in pixels, from `draw.outlineColor` and `draw.outlineWidth`.
  - No `PathLayer`.
  - `checkPickCeiling(batch.partCount)`.
- **Polygonal:** the existing path, unchanged.

**SH-P3. Picking.**
- `resolvePick` is unchanged (`frontends/shell/src/canvas/pick.ts:134-143 @ 7e3a00a6 sha256:HASH-TBD`). Ordinal, then `partToRow`, then row, then id; the anchor is the point itself.
- The ceiling counts points.
- `PickCeilingExceeded` names pick ordinals as polygon parts or points, as a `[P6 placeholder]` (`frontends/shell/src/canvas/limits.ts:57-65 @ 7e3a00a6 sha256:HASH-TBD`).
- deck's `pickingRadius` stays unset.
- `PICKING.md`'s parts sentence names points.

**SH-P4. Pick resolution for points [OPEN-4].** Drafted for (A).
- `pickResolution.ts` gains `averagePointSpacing(batches)` and a selector `pickResolutionExtentFor(kind, batches)`.
- **Spacing**, over the resident points:
  - n points over a bbox of width w and height h give the square root of w×h/n when w×h > 0;
  - otherwise the larger of w and h divided by (n−1) when n > 1;
  - and +Infinity when n ≤ 1, where there is nothing to confuse.
- `WorkingCanvas` assigns the selector's value where it assigns `averageFeatureExtent` today (`frontends/shell/src/canvas/WorkingCanvas.tsx:1253 @ 7e3a00a6 sha256:HASH-TBD`).
- The 9 px threshold is unchanged (`frontends/shell/src/canvas/pickResolution.ts:81 @ 7e3a00a6 sha256:HASH-TBD`).
- The polygonal path is unchanged in behaviour.

**SH-P5. Styling [OPEN-3].** Drafted for (A).
- The resolved polygon draw parameters map onto the point symbol's fill and stroke, as plumbing (ADR-022 Decision 4, read per the ruling).
- `POINT_RADIUS_PX = 4` (CSS pixels) is declared in `buildLayers.ts`. Its doc explains the value: an 8 px diameter stays below the 9 px threshold, so symbols at the threshold spacing do not overlap.
- `toStyleDocument` still writes `polygon` (`frontends/shell/src/style/document.ts:109-118 @ 7e3a00a6 sha256:HASH-TBD`). The style panel is unchanged.

**SH-P6. Describe display.** No change. The Geometry row renders `{column} ({encoding})`, beside MP-1's labelled declaration row.

**SH-P7. `MAX_RESIDENT_VERTICES`' comment.** A point counts one vertex. Its per-point part arrays are disclosed as an unmeasured heap cost (`frontends/shell/src/canvas/limits.ts:50-55 @ 7e3a00a6 sha256:HASH-TBD`).

**O6.** No attribute lookup, callback or row accessor is added. `b1-shell-half` lands later and writes against `partToRow`, which is the identity for points.

### Viewer

No product change. The viewer refuses any encoding but polygon (`renderer/bundle-viewer/src/partition.ts:123-127 @ 7e3a00a6 sha256:HASH-TBD`). V-T pins it for points.

### Portability

The feature is not OS-dependent, so R3's section is not required.
- **R1:** decode and selection are pure.
- **R2 and R4:** no `cfg` in product code and no path literal.
- **R5:** no level claim.
- **R6:** two kinds of ignore, neither new to its kind:
  - L-P takes the LOD boundary's existing `cfg_attr(not(windows), ignore = …)` precedent (`engine/tests/lod_tier_builder.rs:1500-1505 @ 7e3a00a6 sha256:HASH-TBD`);
  - the two `point_corpus.rs` tests are plain on-disk-corpus ignores.

### KNOWN-LIMITATIONS

All edits are current-state edits in place, each a draft for the human's P6 sight with a source comment.
- **Item 31:** this build reads Polygon, MultiPolygon and Point.
  - Point is read only when the declaration is exactly Point.
  - Point mixed with a polygonal type is refused at open.
  - MultiPoint is refused **[OPEN-1]**.
  - An empty Point stops the stream by name.
  - A Point row under an empty or absent declaration still stops the stream.
  - Source: `KNOWN-LIMITATIONS.md:335-337 @ 7e3a00a6 sha256:HASH-TBD`.
- **Item 32:** a point dataset is refused at publish (`KNOWN-LIMITATIONS.md:339-341 @ 7e3a00a6 sha256:HASH-TBD`).
- **Item 33:** the tier builder refuses MultiPolygon and Point features by name (`KNOWN-LIMITATIONS.md:343-345 @ 7e3a00a6 sha256:HASH-TBD`).
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

**The corpus. These predictions are registered here.** `engine/ADMISSION-PREREGISTRATION.md` is not edited (its rows: `engine/ADMISSION-PREREGISTRATION.md:85 @ 7e3a00a6 sha256:HASH-TBD`, `:87`, `:88`).
- From this form's merge, the P4 generator's rows #2, #4 and #5 cite this section (`engine/tests/admission_p4_corpus.rs:169-212 @ 7e3a00a6 sha256:HASH-TBD`). So do its P1 and P2 literals (`engine/tests/admission_p4_corpus.rs:1060-1064 @ 7e3a00a6 sha256:HASH-TBD`, `:1078`, `:1259`, `:1266`).
- The re-run regenerates `engine/ADMISSION-RESULTS.md`. It is made at a committed tree, and its header names that commit (MP-1's DR-4).

| row | predicted |
|---|---|
| C-2 | Refused by name, `engine.crs_undeclared`. The geometry gate admits `[Point]`. The `crs` key is explicitly `null` under version 1.0.0 (`engine/compat-corpus/of-record/MANIFEST.json:1471-1475 @ 7e3a00a6 sha256:HASH-TBD`, `:1454`). This is the corpus's first exercise of the explicit-null case. |
| C-4 | Refused by name, `engine.format_default_contradicted`, at level `metadata` from the `bbox` member, which leaves ±180/±90 (`engine/compat-corpus/of-record/MANIFEST.json:1677-1681 @ 7e3a00a6 sha256:HASH-TBD`, `:1689-1694`). |
| C-5 | Admitted under the format rule, `crs:format-default`: OGC:CRS84, `axis:format-override`, `geoparquet:1.0.0#crs-absent-default`, degree. Sanity at `metadata`, not convicted (`engine/compat-corpus/of-record/MANIFEST.json:1774-1778 @ 7e3a00a6 sha256:HASH-TBD`, `:1786-1791`). Identity session-ordinal: no `id` column (`:1815-1816`). Encoding `geoarrow.point`; `declared_types` `["Point"]`. A viewport query refuses `engine.no_covering_bbox` (`:1783-1784`). The publish component is entered as unrun with its reason: a single open cannot reach a publish preflight. |
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

**Suites, green before either gate.** Heavy runs follow the machine paragraph, `state/directives/2026-10-06-machine-script-adopted.md:12-22 @ 7e3a00a6 sha256:HASH-TBD`, carried in the worker's, tester's and reviewer's briefs. No other rule for running builds applies.
- `cargo test --workspace --locked --features spatial-engine/fixture`, `cargo fmt --check` and clippy;
- `src-tauri` tests;
- the shell's unit suite and type check;
- the viewer's `node --test`;
- `node --test scripts/plan/*.test.mjs scripts/hooks/*.test.mjs scripts/evidence/*.test.mjs`;
- `verify.mjs`, `queue --check`, `site --check`, `verify-cites`, `verify-quotes` (a floor) and `verify-test-claims`;
- CI green at the reviewed commit.

**Proportional gates.** The product-first direction's section 2 applies, by reference (`state/directives/2026-10-05-product-first-direction.md:15 @ 7e3a00a6 sha256:HASH-TBD`).

**Operator.** Part P, queued for the same sitting as MP-1's Part S, which is still unrun (`engine/MULTIPOLYGON-MP1-PREREGISTRATION.md:715 @ 7e3a00a6 sha256:HASH-TBD`).

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
````

## 3. OPEN items

**OPEN-1. Is MultiPoint in this cut?**
- **Options:**
  - (A) Point only. MultiPoint stays refused at open, as today, with the sighted template now listing three types.
  - (B) Point and MultiPoint. That adds `geoarrow.multipoint`, the promotion of a Point row to a one-part MultiPoint, and the pick map through parts.
- **Recommendation:** (A). The corpus has only `["Point"]` files. The common writers I checked (GeoPandas, DuckDB) declare what the rows hold. MP-1 has already proven the multi-part machinery, so (B) can follow as a small piece.
- **Red line:** no under (A), which changes nothing for MultiPoint. Yes under (B), which is new user-visible behaviour.
- **What waits:** dispatch, only if (B) is chosen. The form would then be redrafted before any code.

**OPEN-2. The refusal wording for this cut.** ADR-034's Consequences give each cut's wording to the human. Decision 7 refuses a mixed-kind set with the sighted wording, and that wording would state a false fact for `["Polygon","Point"]`, where each type is readable but the combination is not.
- **Options:**
  - (A) Keep the sighted template, unchanged, for a member outside the readable set; its set renders as Polygon, MultiPolygon and Point. Add a new `[P6 placeholder]` detail for a set mixing readable kinds.
  - (B) One reworded text for both cases, sighted before merge.
  - (C) The sighted template for both. Rejected: it would state a false engine fact.
- **Recommendation:** (A).
- **Red line:** the code is ruled by Decision 7. The wording is the human's (acceptance item 6). Departing from Decision 7's sighted-wording clause for this one case needs the human's typed word.
- **What waits:** the PR's ready state and the final gate. As in MP-1's OPEN-2, the arm is built with the placeholder and the code does not wait.

**OPEN-3. How points are styled, and the symbol radius.** ADR-022 makes style v0 the single model, and ADR-017 §5a says v1 styles polygons only.
- **Options:**
  - (A) Map the resolved polygon draw parameters (fill colour and opacity, outline colour and width) onto the point symbol, as rendering plumbing under ADR-022 Decision 4. The radius is a declared shell constant outside the document. The document still says polygon. A KNOWN-LIMITATIONS line names this.
  - (B) Draw points with fixed default parameters. The style panel does not apply to them, and a `[P6 placeholder]` note says so.
  - (C) Add a point geometry and a radius to the style document. That is a style v2 or ADR-017 change, out of this cut, riding B3.
- **Radius options:** 3, 4 or 5 CSS pixels. Recommended: 4, an 8 px diameter below the 9 px threshold.
- **Recommendation:** (A) with 4 px.
- **Red line:** yes. It is user-visible behaviour not already ruled, and it reads an ADR's boundary.
- **What waits:** commit 4's styling code, SH-P2's style assertions, and KNOWN-LIMITATIONS item 35.

**OPEN-4. The pick rule for points.** Under today's rule a point's geometric extent is 0, so every hover is refused. ADR-028 item 4 requires a declared pixel-size threshold that refuses by name.
- **Options:**
  - (A) Compare the average resident point spacing on screen with the same 9 px threshold, computed once per render like today's average. Clustered or coincident points within a sparse extent can then name the topmost symbol; a KNOWN-LIMITATIONS line says so.
  - (B) Refuse when two or more symbols overlap at the pointer, using a depth-2 GPU pick per hover. This is exact at that pixel, but adds a second pick pass per hover, unmeasured. Coincident points would then meet a refusal whose text advises zooming, which cannot separate them, so it needs a new state and new wording.
  - (C) Treat a symbol's own diameter as its extent. With a 4 px radius, every hover would then be refused. With 4.5 px or more, nothing would be refused, which weakens item 4 for points.
- **Pick tolerance:** in every option, deck's `pickingRadius` stays unset, because setting it moves polygon hover. The symbol is the target.
- **Recommendation:** (A). It uses the same mechanic, the same named state and text, and adds no hover cost.
- **Red line:** yes. It is user-visible behaviour, and it applies ADR-028 item 4 to a new kind.
- **What waits:** commit 4's hover branch, SH-P4, and KNOWN-LIMITATIONS item 36.

## 4. Files read

All paths are under `C:\dev\spatial-ide\`.
- **Plan, directives and rules:**
  - `PLAN.yaml` (the nodes `geometry-points-cut`, `geometry-types-beyond-polygons`, `geometry-lines-cut`, `b1-shell-half`, `shell-migration-milestone-1`, `briefb-b2-save-reopen`, `briefb-b3-publish-v2`, `lod-tier-selection`)
  - `state\directives\2026-10-05-product-first-direction.md`
  - `state\directives\2026-10-05-adr-034-acceptance.md`
  - `state\directives\PORTABILITY-2026-09-30.md`
  - `state\directives\2026-10-06-machine-script-adopted.md`
  - `AUTONOMY.md` (§21 to §22, §25)
  - `AI_DEVELOPMENT.md` (lines 425 to 464)
  - `docs\PREREGISTRATION-TEMPLATE.md`
  - `docs\08_Testing.md`
  - `KNOWN-LIMITATIONS.md`
- **ADRs:**
  - `docs\adr\ADR-034-geometry-type-admission-and-geoarrow-encoding-selection.md`
  - `docs\adr\ADR-022-style-v0-as-the-single-style-model.md`
  - `docs\adr\ADR-017-static-bundle-format-and-publish-semantics.md` (§5a)
  - `docs\adr\ADR-028-viewport-bounded-residency-over-budget-contract.md` (items 4 and 24(c))
- **MP-1's record:**
  - `engine\MULTIPOLYGON-MP1-PREREGISTRATION.md`
  - `state\consults\gates\2026-10-06-geometry-types-beyond-polygons-gate1-architect.md`
  - `state\consults\gates\2026-10-06-geometry-types-beyond-polygons-gate1-reviewer.md`
- **Engine:**
  - `engine\ADMISSION-RESULTS.md`
  - `engine\ADMISSION-PREREGISTRATION.md` (rows 2, 4 and 5)
  - `engine\compat-corpus\of-record\MANIFEST.json` (#2, #4, #5)
  - `engine\src\geoarrow.rs`, `engine\src\wkb.rs`, `engine\src\lib.rs`
  - `engine\src\dataset.rs`, `engine\src\envelope.rs`, `engine\src\stream.rs` (parts)
  - `engine\src\lod.rs` (parts), `engine\src\fixture.rs` (parts)
  - `engine\tests\lod_tier_builder.rs` (L-1), `engine\tests\geometry_admission.rs` (A-1 to A-3)
  - `engine\tests\multipolygon_corpus.rs`, `engine\tests\admission_p4_corpus.rs` (parts)
  - `engine\tests\geoarrow_batch_fixtures.rs` (outline), `engine\tests\multipolygon_stream.rs` (S-3)
  - `engine\README.md` (Owner's index)
- **Kernel:**
  - `kernel\README.md` (index lines)
  - `kernel\src\publish\mod.rs` (lines 470 to 504)
  - `kernel\tests\manual_walkthrough_fixtures.rs` (F-1)
- **Protocol:**
  - `protocol\skp\src\v0\commands.rs`, `protocol\skp\src\v0\mod.rs`
  - `protocol\skp\SKP-V0.md` (§1, §4 item 13, the `skp/0.9` entry)
- **Shell:**
  - `frontends\shell\src\canvas\decodeBatch.ts`, `pick.ts`, `pickResolution.ts`, `buildLayers.ts`, `extent.ts`, `limits.ts`
  - `frontends\shell\src\canvas\WorkingCanvas.tsx` (hover site)
  - `frontends\shell\src\style\document.ts`, `frontends\shell\src\skp\types.ts`, `frontends\shell\src\skp\client.ts` (bbox)
  - `frontends\shell\e2e\regression.mjs` (MP')
  - `frontends\shell\MANUAL-WALKTHROUGH.md` (Part S)
- **Renderer:**
  - `renderer\src\style.rs` (header)
  - `renderer\bundle-viewer\src\partition.ts` (the encoding check)
