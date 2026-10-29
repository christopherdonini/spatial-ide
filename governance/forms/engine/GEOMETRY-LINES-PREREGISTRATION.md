# Lines — admission, row decode, encoding selection, the envelope and `describe`, the shell's decode, drawing, picking and styling, and the publish refusal — preregistration

## Header

- **Status.** The preregistration of PLAN node `geometry-lines-cut` (`PLAN.yaml:2298-2314 @ 0053ced0 sha256:42cb61f947d72cd18957c69f2e8e050ab952ad1cf91f63b20b000dabfc20f873`). Committed before any code. Append-only once committed. An amendment written after any outcome has been seen says so in its first line.
- **Form.** Full form, full gating from dispatch (AUTONOMY §21a: the wire and stated-guarantee categories, and §21c's size bound; §25(e)). No five-line form exists for this piece. No ADR is amended.
- **Authority:**
  - the product-first direction, section 4 (the order) and section 8.c (placement): `state/directives/2026-10-05-product-first-direction.md:19 @ 0053ced0 sha256:6b83a5387d8d511d324a992658af70614661aabb1e927aaff39273a1ce56b2c4`, `state/directives/2026-10-05-product-first-direction.md:30 @ 0053ced0 sha256:de5761eeee86d45746c969e980fc262a314b55a251bc2a7fd6001ca5b68f6a77`;
  - ADR-034, Accepted and architect-blockable. Its Consequences paragraph on points and lines binds this cut: `docs/adr/ADR-034-geometry-type-admission-and-geoarrow-encoding-selection.md:139-149 @ 0053ced0 sha256:9f4694ef421fa4d8ecebe69f435b3f2efe8b4f8137dc262f46cde2b2f7a468b8`;
  - the 2026-10-05 ADR-034 acceptance, items 5 and 6: `state/directives/2026-10-05-adr-034-acceptance.md:11-12 @ 0053ced0 sha256:22729130028e0b27bc6c528dcd5924a36f5152dbca8827fe52c688436e4d102f`;
  - question round 62's rulings, carried by reference where §2 says so: `state/directives/2026-10-06-round-62-rulings.md:7-9 @ 0053ced0 sha256:d8ae278313d8d9ded55c649da0f4909bd0888404ea01d7175e19a63af875dbfb`;
  - the points form's closing record, Amendment 5, item 13, second bullet, which routes the index item here: `engine/GEOMETRY-POINTS-PREREGISTRATION.md:711 @ 0053ced0 sha256:f59b1b14b0172ba601cd9446db9cbe50f384dd6e6cc2cd348d9bc40ed10064f2`;
  - RULED 2026-09-24 (night), item (2): literals follow merge order;
  - drafting by the architect: question round 43, item 2;
  - the owner's-index update by the implementing worker, in the same PR: `state/directives/2026-10-05-product-first-direction.md:11 @ 0053ced0 sha256:479c27220ef0add59a1632e8741bd88416a80b0161d634ac6875d984bc3cfc00`.
- **Drafted by** the architect agent, alone, on the custodian's brief, with no impact read (the lead-data pilot is paused). The tree was read from the main checkout at 0053ced0. Read-only: the architect ran no command. The custodian computed every pin at 0053ced0 when filing.
- **Reference form.** As the points form's Header, by section. Code on main is pinned `path:line @ 0053ced0 sha256:<hex>`.
  - A pin is historical: it is authoritative for the fact it names, and the branch base's tree is authoritative for the edit. The worker re-derives every site before editing.
  - Self-references are by section and item. The ledger is cited by round and item. A cite written into code names its target by item, never by line.
- **Branch.** `cut/geometry-lines-cut`, cut from main in its own commit. It merges by a merge commit, never a squash.
- **Conditional parts** are marked **[OPEN-1]** to **[OPEN-5]** (section "OPEN" below). Each is drafted for the recommended option.

## §0. Disclosure

- **Read:**
  - ADR-034 whole, with its Acceptance section;
  - the acceptance directive;
  - the points form with Amendments 1 to 5, and its two gate-1 reports (`state/consults/gates/2026-10-07-geometry-points-cut-gate1-architect.md`, `...-gate1-reviewer.md`);
  - round 62's rulings;
  - MP-1's form;
  - the product-first direction, sections 1, 2, 4 and 8;
  - this template with its Round 25 additions;
  - AUTONOMY §21a to §21d, §22 and §25;
  - docs/08;
  - KNOWN-LIMITATIONS items 9 and 31 to 36;
  - `state/directives/PORTABILITY-2026-09-30.md` §2;
  - the machine directive;
  - the code sites pinned below.
- **Corpus.** `engine/compat-corpus/of-record/MANIFEST.json` was read for every `geometry_types` entry. No file declares LineString or MultiLineString. No corpus file was opened.
- **Evidence, not Authority (untracked).** The architect read the installed `@deck.gl/layers` and `@deck.gl/core` under `frontends/shell/node_modules`; the lock resolves 9.3.9 (`frontends/shell/package-lock.json:476-477 @ 0053ced0 sha256:f9d6fdaf682757097443f98a342e7183aeee0cd1b30c3de79ef469ae140bf674`). What was read:
  - in `path-layer.js`, `instancePickingColors` encodes the datum index;
  - `widthUnits` defaults to metres;
  - in `deck.js`, hover picking passes `props.pickingRadius`, whose default is 0.

  V-L (§2) re-verifies all of this at the branch base before any shell code.
- **Fixture drive:** nothing is measured.

## §1. What this preregistration may and may not claim

- **No performance number, no docs/08 row and no timing assertion [OPEN-5].**
  - docs/08 defines a Lines class (`docs/08_Testing.md:30 @ 0053ced0 sha256:06a530c483e2ff25bd79b19fcb926549e718cefa3510baa6ff33a37753c7164e`), and this cut does not measure it.
  - Every quantity below is an assertion (round 25, item 1 (a)). No claim is made that line rendering meets any docs/08 budget.
- **Byte identity is claimed exactly as §6's instruments prove it, and no further:**
  - Polygon-only, by G-1 and G-2;
  - MultiPolygon and Point, by BF-1 and BF-P against their committed batch files.
- **Copy.** The linestring encoding appends each coordinate once and adds one offsets buffer. The multilinestring encoding adds a second offsets buffer **[OPEN-1]**. The word zero-copy is not used (ADR-004).
- **Operator wording.** Every new operator string is a `[P6 placeholder]` and is the human's at P6 (acceptance item 6). The one exception is the sighted `engine.geo_metadata` template, with its rendered set **[OPEN-2]**.
- **ADRs cited, none amended:** ADR-034, ADR-004, ADR-006, ADR-010 (rules 1, 2, 3 and 6), ADR-016 §5, ADR-017 §4 and §5a (both byte-identical), ADR-018, ADR-022 (read per OPEN-3) and ADR-028 item 4 (applied as written).
- **May not claim:**
  - that any real-world line file opens: no corpus file declares a line type (§0);
  - that a row is ever counted as unread (acceptance item 5);
  - that MultiLineString is read, under OPEN-1 (B);
  - how a line whose positions all coincide is drawn: it is admitted unrepaired, and its drawing is not claimed.

## §2. The change

The content is binding. The wording of code and comments is the worker's, except where a source is pinned.

### The vertical cut against MP-1 and points

| element | MP-1 and points provide on main | this cut adds |
|---|---|---|
| admission | one readable-set declaration, read by the gate and the text; a kind mapping; the encoding fixed at open; the sighted refusal; the mixed-kind refusal | LineString and MultiLineString **[OPEN-1]** join the declaration; a `Line` kind; `{LineString}` gives `geoarrow.linestring`; a lineal set including MultiLineString gives `geoarrow.multilinestring` **[OPEN-1]**; the mixed-kind detail names the kinds present **[OPEN-2]** |
| row decode | the Polygon, MultiPolygon and Point builders; strict, by-name refusals | `LineStringBuilder` (WKB type 2 only); `MultiLineStringBuilder` **[OPEN-1]** |
| encoding | a storage type, builder and validator per encoding; `coordinate_values` walking polygon, multipolygon and point | the linestring and multilinestring storage types, builders and validators; a linestring arm in `coordinate_values` (a multilinestring is walked by the existing two-level path) |
| envelope and `describe` | the envelope key; `describe.encoding` and `declared_types` (`skp/0.9`); a third value (`skp/0.10`) | two more values under `skp/0.11`; no new field |
| shell decode and drawing | the encoding check; `parts`, `partToRow`; `SolidPolygonLayer` per part plus the outline `PathLayer`; `ScatterplotLayer` for points | the line decode (one part per linestring, holding one path); one pickable `PathLayer` per batch for a line open; a non-pickable casing when the style has an outline **[OPEN-3]** |
| picking and attributes | `partToRow`; the ceiling counted in parts; the first-part anchor; the point-spacing selector; no attribute hook (O6) | the ordinal is a line part, mapped by `partToRow`; a pick tolerance for line opens only **[OPEN-4]**; the 9 px rule against the average feature extent, unchanged; still no attribute hook |
| styling | the polygon document's fill and outline; points' plumbing mapping | the same parameters mapped onto the line symbol, plus a declared width **[OPEN-3]** |
| publishing | K2's format-owned refusal | no product change: K2 already refuses any encoding but polygon; K-L2 proves it for both line encodings |
| LOD | refuses MultiPolygon and Point features by name | `lod.rs` unchanged; it already names LineString and MultiLineString in its refusal; L-L pins it |

E-L4's exact type codes:
- `LineStringBuilder` reads type 2 only.
- `MultiLineStringBuilder` reads type 2 as one part and type 5 as parts **[OPEN-1]**.

**What later cuts keep:**
- MultiPoint;
- MultiLineString, under OPEN-1 (B);
- mixed-kind columns;
- an empty or absent declaration with non-polygon rows. It still selects MultiPolygon (ADR-034 Decision 2), so a line row there stays refused by name;
- counting a row as unread (acceptance item 5).

**What B2 keeps:**
- all persistence. The encoding stays a fact of each open, re-derived at reopen and never saved;
- what Save does with a line layer's style document. **This cut adds no path that saves one** (round 62, item 3's rule, applied to lines under OPEN-3).

**What B3 and style v2 keep:** a line partition schema, a line geometry and width in the style document, and `verify-bundle.rs`'s alignment (MP-2).

**ADR-034's inherited rule, item by item** (`docs/adr/ADR-034-geometry-type-admission-and-geoarrow-encoding-selection.md:139-149 @ 0053ced0 sha256:9f4694ef421fa4d8ecebe69f435b3f2efe8b4f8137dc262f46cde2b2f7a468b8`):
1. Encoding fixed at open: E-L2.
2. `declared_types` as the source fact, with any promotion declared as an encoding.
   - A LineString row under a lineal set that includes MultiLineString is a one-part MultiLineString **[OPEN-1]**.
   - `describe` shows the encoding and the declaration as two labelled rows (MP-1's SH-F, unchanged).
3. No silent drop: E-L4, S-L2.
4. One row per feature: E-L4, S-L1.
5. A part-to-row map wherever a kind is multi-part: SH-L1 and SH-L3 **[OPEN-1]**. For LineString alone, `partToRow` is the identity.
6. A refusal stating the readable set: E-L1, E-L2.
7. Every consumer checks the encoding before a new value is emitted: SH-L1, V-L (the viewer, V-T-L), K-L1 and K2.
8. A publish refusal until the bundle carries the kind: K-L2.

### Engine

**E-L1. The readable set.** `READABLE_GEOMETRY_TYPES` becomes Polygon, MultiPolygon, Point, LineString, MultiLineString **[OPEN-1]**, in that order (`engine/src/geoarrow.rs:66-69 @ 0053ced0 sha256:583138e9b21063a96c584649b2b4e6bde2e4e603c13185247f541e0838c8d756`).
- `GeometryKind` gains `Line`, and `kind_of` maps LineString and MultiLineString to it (`engine/src/geoarrow.rs:71-90 @ 0053ced0 sha256:3c1195fd0d81771904f9e0b337934f288fa3b3729bb633a873de560c1a33520d`).
- The gate and the text still read the one declaration (`engine/src/geoarrow.rs:97-104 @ 0053ced0 sha256:9017df78d7d383b411570c66263926de7c70377551fef20d48a0eb4e562f5ea1`).

**E-L2. Admission** (`engine/src/geoarrow.rs:106-145 @ 0053ced0 sha256:205367b2103a7276bb5f25c378aeba2f575ac5de4c08f5d1d3d39f46592f39c6`). Matching stays case-insensitive. The checks run in this order:
1. `None` or `[]` gives `MultiPolygon`, unchanged.
2. Any member outside the readable set is refused with the sighted template, unchanged code (`state/consults/2026-09-24-multipolygon-assessment.md:206 @ 6030dfd2814b sha256:ddae06db5d61fa8f420f73843d5e900805bbb9eb26341f5a53effa571cdc4be3`, a sub-line span; the hash is the line's). Its readable-set clause now renders five types **[OPEN-1]**, **[OPEN-2]**.
3. Every member Point gives `Point`, unchanged.
4. Every member Polygon gives `Polygon`, unchanged.
5. Every member polygonal gives `MultiPolygon`, unchanged.
6. Every member LineString gives `GeometryEncoding::LineString`.
7. Every member lineal, with at least one MultiLineString, gives `GeometryEncoding::MultiLineString` **[OPEN-1]**.
8. Otherwise, a set mixing kinds is refused at open as `EngineError::GeoMetadata` (ADR-034 Decision 7; round 62, item 2, `state/directives/2026-10-06-round-62-rulings.md:7 @ 0053ced0 sha256:a9f46581a22ba3635c46637674f2eb7eb6f94c1823777e2fac2b1fcfd07ec9fd`).
   - **[OPEN-2] (A):** `MIXED_KINDS_DRAFT` stays byte-identical (`engine/src/geoarrow.rs:92-95 @ 0053ced0 sha256:56978072259e9904788d64e0bfe9e234aa21892e366e5719cb331c8b8885948c`).
   - Its span naming the two kinds is replaced by the kinds present: in E-L1's kind order (polygonal, point, line), joined as `readable_set_phrase` joins.
   - So a polygonal-and-point set renders byte-identically to today's detail (A-P2 unchanged).
   - It is still a `[P6 placeholder]` and states engine facts only.
- The call site is unchanged (`engine/src/dataset.rs:368 @ 0053ced0 sha256:d55715b2ea7f8c868f03273394503ff3ba051c30aa369f91cb112ac0e4d96fbb`).

**E-L3. Accessors.**
- `GeometryEncoding` gains `LineString` and `MultiLineString` **[OPEN-1]**. `as_str()` gives `geoarrow.linestring` and `geoarrow.multilinestring` (`engine/src/geoarrow.rs:36-64 @ 0053ced0 sha256:590a7faba7158b5fef7d2f159c49932bf95f9930bb42f7d5444ed8971e2180ac`).
- New `pub(crate)` constants `EXT_NAME_LINESTRING` and `EXT_NAME_MULTILINESTRING`.
- No other new `pub` item. New builders and validators are `pub(crate)`.
- The worker re-greps `kernel`, `protocol`, `renderer` and `frontends/shell/src-tauri` for an exhaustive match on `GeometryEncoding`. None exists at 0053ced0.

**E-L4. Row decode.** `engine/src/wkb.rs` gains:
- `pub(crate) LineStringBuilder`: one coordinate buffer and geometry offsets;
- **[OPEN-1]** `pub(crate) MultiLineStringBuilder`: geometry and part offsets.

Coordinate bits are carried through with no arithmetic (`engine/src/wkb.rs:20-21 @ 0053ced0 sha256:ca0f8f848d0e5c437d2c3d28ab2cece1aeabeb203f541debbfdcbb7e1a8d1687`).
- **LineString encoding:** byte order, then type exactly 2 with no EWKB flag, then a position count, then the positions.
- **MultiLineString encoding [OPEN-1]:**
  - type 2 decodes as one part;
  - type 5 decodes each part with its own byte-order byte and its own type code, which must be exactly 2 with no EWKB flag.
- **Refused by name as `EngineError::Wkb`, each with `[P6 placeholder]` text naming what was met:**
  - EWKB flags, on the header or on a part;
  - any other type, ISO Z, M and ZM codes included;
  - a linestring or part with fewer than 2 positions: WKB's empty LineString (0), and a single position, refused under the strict-decode policy (`engine/src/wkb.rs:12-18 @ 0053ced0 sha256:cb6448453c87087a64aef62b4a9afa2d70d7a247d190158e3c2549fbf2a551d3`) and acceptance item 5;
  - a MultiLineString with zero parts;
  - trailing bytes;
  - truncation.
- **No allocation from a WKB count.**
- **Every refusal** stops the stream at that row, skips nothing, and states no consequence.
- The other three builders are unchanged. Each still refuses type 2 (`engine/src/wkb.rs:72-109 @ 0053ced0 sha256:0936b8a4dfd0b02960fd746b4918fa4b5fc13dbdc6eb11888d52b7adb0be2a9c`, `engine/src/wkb.rs:178-237 @ 0053ced0 sha256:f2e6c30bd86379fe1eb31ccf70455160d82afc8b873bbdbcbc55f9b19f775006`, `engine/src/wkb.rs:274-307 @ 0053ced0 sha256:8445702bfc89749b8b6596349f9f7d5dd2977fcf061246246ab4d55fdc07ac4a`).
- The module doc names the new builders (`engine/src/wkb.rs:4-10 @ 0053ced0 sha256:afa910e1bb530e44843ec832690be103301e067904996bdcfa7997817cc72a9c`).

**E-L5. Encoding.** `engine/src/geoarrow.rs` gains:
- the storage types:
  - `List<vertices: FixedSizeList<xy: Float64>[2]>`;
  - **[OPEN-1]** `List<linestrings: List<vertices: FixedSizeList<xy: Float64>[2]>>`;
- their builders, through `checked_offsets`;
- their structural validators;
- the `storage_type` and `validate_encoding` arms (`engine/src/geoarrow.rs:188-195 @ 0053ced0 sha256:a614947115393e2be33702adbef08f51b757415558b445ba38b949fcae53d270`, `engine/src/geoarrow.rs:505-512 @ 0053ced0 sha256:02f77553b87fdd1ac647176b7937dde000d00eed824b6eeea253c76f6af58e5c`).

In `coordinate_values` (`engine/src/geoarrow.rs:356-406 @ 0053ced0 sha256:ae3a7459cd0df577fda9e786743c3afc16708e44e613b141ad3e3d4bc477af05`):
- a linestring arm, a list whose child is the fixed-size list, reads the vertex run between the slice's first and last geometry offsets;
- a multilinestring is walked by the existing two-level path, which reads it by shape;
- the doc says both.

**The multilinestring storage type is structurally identical to the polygon storage type.** Which one an array is, is decided only by the open's encoding, never by its shape (§8 item 21; I-8).

The other storage types, builders and validators are unchanged.

**E-L6. Envelope.** No code change.
- The key and the field are written from the encoding.
- `assemble` validates through E-L5 (`engine/src/envelope.rs:331 @ 0053ced0 sha256:9a28cc88a4bcebf5ed7061c50ddd4f97544577538ac0e18593863f566846f46c`).
- `xy_bounds` reads lines through `coordinate_values` (`engine/src/envelope.rs:377-398 @ 0053ced0 sha256:b76e53b3d25f07fb448ec34ec5f8515972bdd11705155bcd478f841650629691`).

**E-L7. Stream.**
- `GeometryBuilder` gains the arms (`engine/src/stream.rs:2151-2191 @ 0053ced0 sha256:91866b341034f112a9c773e085b310e245be38e63ae86e7f9800d10f245739e3`).
- **`estimate_bytes` is not edited** (`engine/src/stream.rs:2260-2273 @ 0053ced0 sha256:e536b58a400543ce8030056dd8986824097a70418ec5377d4f54bc36323bfa8d`). Its doc gains one sentence:
  - for a linestring, the offsets are rows plus one, within its `(rows + vertices) * 4` term;
  - for a multilinestring, each part has at least 2 vertices, so parts are at most vertices divided by 2.
  - S-L3 asserts the bound.
- The per-row incoming estimate is unchanged. A linestring's WKB is 9 + 16n bytes, so `wkb.len() / 16` is at least n (`engine/src/stream.rs:1998-2004 @ 0053ced0 sha256:0698e0d217eeef111c6bfb42cf59c3ae0601f23404580a13befbbef010d59e72`).

**E-L8. Module doc.** The encoding sentence names the new encodings (`engine/src/lib.rs:17-24 @ 0053ced0 sha256:937ad30294f8728747c5b1384df1f7866cd00f67f5f30bcc409de5b9f2e84ece`).

**E-L9. Test support, behind the `fixture` feature,** on the `encode_point` precedent (`engine/src/fixture.rs:1285-1324 @ 0053ced0 sha256:4960554969f953c36e7bce9e5e1f3f2b0aa9a99b75dbd8573032f49d468f62bd`):
- `encode_linestring`;
- **[OPEN-1]** `encode_multilinestring`;
- `line_l1` and its rows, with and without bounds for `GeometryMode::RowsWithBounds` (`engine/src/fixture.rs:500-513 @ 0053ced0 sha256:368046e38306b73c6b0422ddcdc633bb23f08cd84074c37fb4160c719495d52b`);
- **[OPEN-1]** `multilinestring_ml1` and its rows.

The default writer stays byte-identical, by G-1's fixture hash.

**E-L10. LOD.** `engine/src/lod.rs` is not edited. It refuses any feature but Polygon by name, and it already names LineString and MultiLineString (`engine/src/lod.rs:1554-1562 @ 0053ced0 sha256:3fbc05148467f2137bf3d549edc9ea4e527c87ecc35dc2f30c196d7beba772d5`, `engine/src/lod.rs:1656-1669 @ 0053ced0 sha256:ab4f3e672c616fdceca0c811877554252fa79183ba04f9c28b0ef4258facd775`). L-L pins it.

### Kernel

**K-L. No product change.**
- `describe_dataset` takes `encoding` from `as_str()` (`kernel/src/skp.rs:1928 @ 0053ced0 sha256:c182efb40a3fa20a668c7023978c62e61199e345fe6154d2a653e00be4d5ad66`).
- K2 compares the encoding with the format's declared one, after the degrees check (`kernel/src/publish/mod.rs:472-498 @ 0053ced0 sha256:e0982b90cf4a8f1c52a083bc3f2a654eb96125d6c912601e3bfd48b1329ccf10`).
- A line dataset is described by its encoding and refused at publish as `publish.geometry_encoding_not_publishable`.

**Walkthrough fixtures,** as ignored generators in `kernel/tests/manual_walkthrough_fixtures.rs`. Each generator's doc names only the Part T row or the E2E step that uses it (the points gates' D-1).
- `generate_the_line_l1_fixture`: L-1, with a covering;
- **[OPEN-1]** `generate_the_multilinestring_ml1_fixture`: ML-1, with a covering;
- `generate_the_declared_geometrycollection_fixture`: P-1's rows, declared `["GeometryCollection"]`, for the sighted refusal;
- `generate_the_declared_polygon_and_linestring_fixture`, for the mixed-kind detail **[OPEN-2]**.

**One doc correction.** The doc of `generate_the_declared_linestring_fixture` (`kernel/tests/manual_walkthrough_fixtures.rs:294-312 @ 0053ced0 sha256:3a8f0215aadeefdfbde39a0783aa1d9428bbaf6690f73faa6ecc029506bc77ce`) states that the open is refused with the sighted template. From this cut that is false: the file opens as `geoarrow.linestring` and the stream stops at row 0 with `engine.wkb`. The doc is corrected to say so. The generator's code is not edited.

### Protocol

**W-L1.** The doc on `GeometryInfo.encoding` lists the values (`protocol/skp/src/v0/commands.rs:169-173 @ 0053ced0 sha256:62096c65dafb00d8b8322c009d3635add6ad62d6493715ba66b55070856bba03`). No field changes, and `deny_unknown_fields` stays.

**W-L2. The literal and its fixtures, in one commit** (`protocol/skp/SKP-V0.md:280-296 @ 0053ced0 sha256:f1fe949196a4ab94241772d978097159bdd2872632ee35a3a4978130dcd50aa5`, condition (iii)).
- **The number:** `skp/0.11`, the literal after main's at the final merge (`protocol/skp/src/v0/mod.rs:96-101 @ 0053ced0 sha256:33b061ab45fdc32f1c4a654c0a1db0a91110375853f618eae084b4a9a6d9c46b`). If an earlier merge forces another number, the closing record states it; this section is not amended.
- **Rust side and TS side together,** `frontends/shell/src/skp/types.ts` among them (`frontends/shell/src/skp/types.ts:15 @ 0053ced0 sha256:b49752c42c266f6a62b4c88729853ab5794a96161772286389e5e1ada66aad54`).
- **The version-refusal conformance fixture** is renumbered from `skp/0.11` to `skp/0.12`, by the `skp/0.10` entry's mechanics (`protocol/skp/SKP-V0.md:1031-1036 @ 0053ced0 sha256:110752ebbc877456750c80329325ed37b5cfef185d14926b03457b9248e1b5a4`).
- **`skp_version_is_skp_0_10` is renamed** to `skp_version_is_skp_0_11`. PL-5 names the rename.

**W-L3. SKP-V0.**
- §1's `geometry` line names the values (`protocol/skp/SKP-V0.md:71-73 @ 0053ced0 sha256:596d720fd45188dc66beede7da1850f922e33ef2acea7f46d853cf7153e73e23`).
- A `skp/0.11` entry is appended at §8's end, as §8 stands at the final merge, last before §9. It records the values only: no command, member or code.
- §5 is unchanged, and `protocol/data-plane/` has an empty diff.

### Shell

**V-L, before any shell code.** The worker reads the installed `@deck.gl/layers` and `@deck.gl/core`, at the version the lock resolves. The report names the file, the function and the version for each. It confirms:
- `PathLayer`'s picking colour encodes the datum index;
- one datum is one path;
- `widthUnits: pixels`, `jointRounded` and `capRounded` exist;
- `Deck`'s `pickingRadius` is applied to hover picking;
- `pickObject` takes its own `radius`, default 0, and returns the object closest to the pointer within it.

If any of these is false, that is I-2.

**SH-L1. Decode** (`frontends/shell/src/canvas/decodeBatch.ts:21-39 @ 0053ced0 sha256:fc6f336de7f0505f82af267a9d9738a8d88160d22c7f29d80a8b54086cceb654`, `frontends/shell/src/canvas/decodeBatch.ts:123-129 @ 0053ced0 sha256:3d79c81347722178a7316b6be930197969fd3256db1f593453c1360ff8edf904`, `frontends/shell/src/canvas/decodeBatch.ts:156-191 @ 0053ced0 sha256:a7a37f8e02752b91f90ff3782bf45b6015b3da85334f63eb1c01d813709de752`).
- `ENCODING_LINESTRING` and **[OPEN-1]** `ENCODING_MULTILINESTRING`; the check accepts them.
- `GeometryKind` gains `line`, and `geometryKindOf` maps both line encodings to it.
- A linestring row decodes to one part holding one path, which is its positions in order. A multilinestring row decodes to one such part per linestring. `partToRow` takes a row per part.
- The decode branch is keyed on the batch's encoding string, never on its shape.
- `ResidentBatch`'s doc states the line shape, and its type is unchanged (`frontends/shell/src/canvas/decodeBatch.ts:68-102 @ 0053ced0 sha256:0f8a5b25f6cf442d5209a8a1c7035f6f04939ed46b33a14f82692db2f2f7f8b7`).
- `UnexpectedEncodingError` names the encodings read, as a `[P6 placeholder]` (`frontends/shell/src/canvas/decodeBatch.ts:41-61 @ 0053ced0 sha256:4bdfbbe4eacccdad56014a4789bf01868ebdf960584828331d37e65deab51148`).

**SH-L2. Drawing.** `buildLayers` gains a `line` overload (`frontends/shell/src/canvas/buildLayers.ts:305-357 @ 0053ced0 sha256:70ca18b7543c2d5d8b8b03ffb9aef6a2d7689c80d39fa1adffa983a7850da3a0`). `checkPickCeiling(batch.partCount)` stays before the kind branch (`frontends/shell/src/canvas/buildLayers.ts:331 @ 0053ced0 sha256:35d17af4cd34484a9911293067ec07a6ad06c073ea56f989d7dc36b70ae9373e`).
- **Line, [OPEN-3] (A):**
  - one pickable `PathLayer` per batch, with id `layerId(batch)`;
  - data: one offset-relative path per part, in `partToRow`'s order, cached by batch identity and origin, under the polygon cache's rule (`frame.toLocal` in f64 before any narrowing; ADR-010 rule 3) (`frontends/shell/src/canvas/buildLayers.ts:188-216 @ 0053ced0 sha256:4725338567b424f0584cf2a509f36a95eead95ac35fb17f564530966772476e6` as precedent);
  - `CARTESIAN`, `widthUnits: pixels`, width `LINE_WIDTH_PX`, colour `draw.fillColor` (fill colour and opacity), `jointRounded` and `capRounded`.
- **The casing,** only when `outlineWidth > 0`:
  - a non-pickable `PathLayer` with id `${layerId(batch)}-casing`, placed before the line so that it draws beneath;
  - the same cached data;
  - width `LINE_WIDTH_PX + 2 × outlineWidth` pixels, in `draw.outlineColor`.
- **No `SolidPolygonLayer`.**
- **Polygonal and point:** the existing paths, unchanged.

**SH-L3. Picking.**
- `resolvePick` is unchanged (`frontends/shell/src/canvas/pick.ts:118-143 @ 0053ced0 sha256:2f760e0a61015866ace7179f7d525c9c3b79e6083df234e5030bdb326fc02b74`): ordinal, then `partToRow`, then row, then id. The anchor is the first part's first vertex, so every part of one feature gives the same result.
- The ceiling counts line parts.
- `PickCeilingExceeded` names pick ordinals as polygon parts, points or line parts, as a `[P6 placeholder]` (`frontends/shell/src/canvas/limits.ts:63-79 @ 0053ced0 sha256:7ab578cd5e698c345d9b6683b0bfdd325e99d12f27474a5d8b11ac1dc17a63b9`).
- `PICKING.md`'s parts sentence names lines (`frontends/shell/src/canvas/PICKING.md:16-23 @ 0053ced0 sha256:2acab06c1dfafbecbf406efd298a5dfc030b19c939e93280c26b6493645784f0`).

**SH-L4. Pick tolerance [OPEN-4] (A).**
- `pickResolution.ts` gains `LINE_PICK_RADIUS_PX = 4` (CSS pixels) and a pure `pickingRadiusFor(kind)`. It returns that value for `line` and `undefined` otherwise.
- `WorkingCanvas` reads it from `geometryKindRef`, at two sites:
  - `Deck`'s construction, where the prop is set only when the value is defined (`frontends/shell/src/canvas/WorkingCanvas.tsx:1900-1911 @ 0053ced0 sha256:b6ac0bfd184bb9d5cf1d7c02baca2f3873a1f1b365063e34e5f5b470f1eb24b7`);
  - the settle re-pick's `pickObject`, which is passed `radius` only when the value is defined (`frontends/shell/src/canvas/WorkingCanvas.tsx:1179-1190 @ 0053ced0 sha256:9ceb87a1f7bdf9c0e8a7f8096ee300159e7f5b9d41588ba6458abf8ba75651e1`). That comment's sentence saying the radius is unchanged is corrected.
- For a polygonal or point open neither site changes: `pickingRadius` stays unset, as round 62, item 4 has it for points.
- **The pick-resolution rule is ADR-028 item 4 as written.** `pickResolutionExtentFor` already returns `averageFeatureExtent` for any kind but `point` (`frontends/shell/src/canvas/pickResolution.ts:165-173 @ 0053ced0 sha256:6683cfb8268387e85c80c293656f44f1f54a872ec799b549aa679b67c8f8dba9`). Its doc names lines. The 9 px threshold is unchanged (`frontends/shell/src/canvas/pickResolution.ts:81 @ 0053ced0 sha256:8540ff19e686430812871511722f8fcb91ab8ada3d977062c4efbc7535a81108`).

**SH-L5. Styling [OPEN-3] (A).**
- The resolved polygon draw parameters map onto the line symbol as rendering plumbing in the working canvas only (ADR-022 Decision 4, read as round 62, item 3 reads it, `state/directives/2026-10-06-round-62-rulings.md:8 @ 0053ced0 sha256:31b0a7ad439283bff4e2e5189e1ba0fcf2809b77fcabd35249186138aca44982`).
- `LINE_WIDTH_PX = 2` (CSS pixels) is declared in `buildLayers.ts`, beside `POINT_RADIUS_PX` (`frontends/shell/src/canvas/buildLayers.ts:179-186 @ 0053ced0 sha256:1bb42aed2bb93234119c8f01d224dab9e07e7dd6b2f98017f287eae6a5dedcb8`).
- `toStyleDocument` still writes `polygon`, and the style panel is unchanged.

**SH-L6. Describe display.** No change.

**SH-L7. `MAX_RESIDENT_VERTICES`' comment** discloses the per-line part arrays, and the casing's second copy of each vertex on the GPU, as unmeasured costs (`frontends/shell/src/canvas/limits.ts:28-61 @ 0053ced0 sha256:22c57cfaa59ddd30539055a52cd50d74b88935999a216bc9bd72adac36836cc1`).

**O6.** No attribute lookup, callback or row accessor is added. `b1-shell-half` lands later and writes against `partToRow`.

### Viewer

No product change. The viewer refuses any encoding but polygon (`renderer/bundle-viewer/src/partition.ts:123-127 @ 0053ced0 sha256:c326d3d3add9c64fafe361e6bb7407c200d9d1017f97eb41fe13fbb9d48a1fc7`). V-T-L pins it for both line encodings.

### Portability

The feature is not OS-dependent, so R3's section is not required.
- **R1:** decode and selection are pure.
- **R2 and R4:** no `cfg` in product code and no path literal.
- **R5:** no level claim.
- **R6:** one kind of ignore, not new: L-L takes the LOD boundary's `cfg_attr(not(windows), ignore = …)` precedent (`engine/tests/lod_tier_builder.rs:1571-1575 @ 0053ced0 sha256:32ea6e75dedad4465c37e74cd88a5fa93affcc35e04fa04ded3d4294fd2f8e8e`). The walkthrough generators are plain ignores.

### KNOWN-LIMITATIONS

All edits are current-state edits in place. Each is a draft for the human's P6 sight, with a source comment.
- **Item 31** (`KNOWN-LIMITATIONS.md:335-337 @ 0053ced0 sha256:93fa059ea3064a17b4e73492b382e596c827be894d3a1136a8fd4efa30313893`):
  - this build also reads LineString and **[OPEN-1]** MultiLineString;
  - a set mixing any two of the polygonal, point and line kinds is refused at open **[OPEN-2]**;
  - a line with fewer than two positions stops the stream;
  - a line row under an empty or absent declaration stops the stream;
  - the sentence listing what the refusal covers no longer names a line.
- **Item 32** (`KNOWN-LIMITATIONS.md:339-341 @ 0053ced0 sha256:11396595bb1e0d30daf82aabce946cd35c3b5dceed6725ed35cec18ad14bc09f`): line datasets are refused at publish.
- **Item 33** (`KNOWN-LIMITATIONS.md:343-345 @ 0053ced0 sha256:a617d5ff47235eb73508c919b32232f25e9b008291bfe1786945a638f533bbb9`): the tier builder refuses line features by name.
- **New item 37 [OPEN-3]:**
  - lines are drawn at a fixed 2 CSS pixel width, in the fill colour and opacity;
  - an outline width above 0 draws a casing in the outline colour;
  - with an opacity below 1 the casing shows through, and crossing lines are drawn darker;
  - the style document has no line geometry yet.
- **New item 38 [OPEN-4]:**
  - a hover names the line whose drawn pixel is closest to the pointer within 4 CSS pixels;
  - the refusal at coarse zoom compares the average line's on-screen extent, so where many long lines cross, a hover can name the topmost line.
- **Not edited:** item 9, items 34 to 36, and `README.md`.

### Owner's index (applied in the PR by the worker)

- **`engine/README.md`:**
  - `Last verified at`;
  - Open and admission (gains A-L1);
  - Viewport stream, envelope, batch sizing (gains S-L1);
  - LOD tier builder (gains L-L);
  - Governed by → preregistrations (+ this form);
  - **Declared limits:** item 34 is removed. The line lists only the limits caused by engine code, and item 34 is caused by the shell's `buildLayers` (the points gates' noticed item 3, both reports) (`engine/README.md:521 @ 0053ced0 sha256:be2cff211f7d6fc28b2e2659c9e3a192441062f5a973bd513ba16ec07c5280d9`).
- **`kernel/README.md`:**
  - `Last verified at`;
  - SKP v0 host (gains K-L1);
  - Publish and the bundle format (gains K-L2);
  - Governed by → kernel halves (+ this form).
  - The worker re-derives this file at the base, because another open PR may edit it.
- Both stay within 60 lines.
- **The routed item, settled.** The engine and kernel lines list module-caused limits. The shell-owned items 34 to 38 are indexed nowhere, because no shell owner's index exists. Creating one is a governance piece under the freeze (product-first direction, section 1). It is recorded as the proposed node `shell-owners-index` in this form's commit.

### Operator

`frontends/shell/MANUAL-WALKTHROUGH.md` gains **Part T**, appended at its end with blank result logs. It runs in the same sitting as Part S and Part P (points), and only on a build after this cut's merge.
- **T1.** L-1 opens and draws as lines. The summary shows `geometry (geoarrow.linestring)` and the declaration `LineString`, labelled.
- **T2.**
  - Hover a line: one id.
  - Hover about 3 px beside a line: the same id **[OPEN-4]**.
  - Hover about 10 px away: nothing.
  - Hover where L-1's two crossing lines meet: one id. Record which, and whether naming the topmost line is acceptable.
  - Zoom out until the named refusal appears.
- **T3 [OPEN-1]:** ML-1 opens as `geoarrow.multilinestring`. Hovering two parts of row 0 gives the same readout.
- **T4 [OPEN-3]:** style edits apply to the lines, as SH-L5 and SH-L2 describe. Record whether 2 px is the width wanted.
- **T5.** Publishing L-1 is refused with `publish.geometry_encoding_not_publishable`, naming `geoarrow.linestring`.
- **T6.** The wording:
  - the sighted refusal, on the GeometryCollection-declared file, with five types;
  - the mixed-kind placeholder, on the Polygon-and-LineString file **[OPEN-2]**;
  - the LineString-declared file, which now opens and stops at row 0 with `engine.wkb`. Record the code;
  - every new `[P6 placeholder]`;
  - items 31 to 33, 37 and 38.

**A dated note** is appended under Part P (points)'s result log, not edited into P7 (`frontends/shell/MANUAL-WALKTHROUGH.md:1638 @ 0053ced0 sha256:2c1c41de101b11d082e2ef7f6692c466054c3e8d4b477acd8d350d8ac7503eca`). It says that from this cut's merge:
- P7(a) uses `declared-geometrycollection.parquet`;
- the readable-set clause names five types;
- Part T's T6 carries the rest.

**The E2E step LN'** is appended to `frontends/shell/e2e/regression.mjs` beside PT' (`frontends/shell/e2e/regression.mjs:2500-2501 @ 0053ced0 sha256:0cecd8ead25b8ba9341297bcd5d6e5dcfdd4167d427ae6f6e921ffe58cf7205d`). MP' and PT' are not edited.

## §3. Fixtures and corpus, with outcomes predicted before any run

Purpose-written fixtures come from `spatial_engine::fixture`. Each is hash-verified before and after the test that generates it.

| id | fixture | predicted |
|---|---|---|
| L-1 | LV95, `["LineString"]`, five rows of 2, 3, 5, 2 and 4 positions, bit-sensitive fractions, rows 1 and 3 crossing (the walkthrough variant has a covering) | admitted, `geoarrow.linestring`, five rows, bit-identical positions in order; publish refused by K2 |
| L-2 | `["linestring"]` | `geoarrow.linestring`; `declared_types` `["linestring"]` |
| L-3 | `["LineString","Polygon"]`, `["Point","LineString"]`, `["MultiPolygon","Point","LineString"]` | each refused at open, `engine.geo_metadata`, E-L2 check 8 **[OPEN-2]** |
| L-4 | `["MultiLineString"]` (ML-1's rows) | (A): `geoarrow.multilinestring`. (B): refused with the sighted template **[OPEN-1]** |
| L-5 | `["LineString","MultiLineString"]`, alternating rows | (A): `geoarrow.multilinestring`, and LineString rows are one part. (B): refused, sighted **[OPEN-1]** |
| L-6 | `["LineString Z"]`; `["GeometryCollection"]` | refused with the sighted template |
| L-7 | `["LineString"]` with one Polygon row; `["LineString"]` with one MultiLineString row | the stream is refused with `engine.wkb` at that row |
| L-8 | `["LineString"]` rows: SRID-flagged; ISO 1002; 0 positions; 1 position; trailing bytes; truncated; big-endian | each refused with `engine.wkb` by name, except big-endian, which decodes to the same values |
| ML-1 **[OPEN-1]** | LV95, `["MultiLineString"]`, three rows of 2, 1 and 3 parts, so that part ordinals differ from row indices | admitted, one row per feature, parts kept |
| ML-8 **[OPEN-1]** | `["MultiLineString"]` rows: zero parts; a part of one position; a part typed 1; an EWKB-flagged part; mixed byte-order parts | each refused with `engine.wkb`, except mixed byte order, which decodes |
| L-9 | P-1's Point rows under `["LineString"]` (the walkthrough's `declared-linestring.parquet`) | open admitted, then the stream is refused with `engine.wkb` at row 0 |
| L-10 | `[]` with one LineString row | `geoarrow.multipolygon`, then the stream is refused with `engine.wkb` at that row (ADR-034 Decision 2, unchanged) |
| L-11 | L-1 in CRS84 degrees | publish refuses `GeographicCrsNotPublishable`, not K2 |
| BF-L, BF-ML | the engine's IPC of L-1's and **[OPEN-1]** ML-1's batch, committed as `engine/tests/data/geoarrow/lv95-linestring-batch.arrows` and `lv95-multilinestring-batch.arrows` | bytes equal the engine's current output |

**Unchanged and re-run:** MP-1's F-10 and F-11, and points' P-6 and P-7.

**The corpus.** No file in the preregistered corpus declares a line type (§0), so no corpus row waits for this cut.
- `engine/ADMISSION-PREREGISTRATION.md`, the P4 generator and `engine/ADMISSION-RESULTS.md` are not edited, and no re-run is committed.
- A line file for the corpus is recorded as the proposed node `corpus-line-files`, for the human's placement.

## §4. Tests, and the mutation per new test

- **How a mutation is observed.** It is applied, the named test is run, the failure is recorded by name with the commit it was observed at, and the mutation is reverted (round 25, item 2 (c)). No `verify-mutation` run is an observation.
- **Where the record lives.** Each test's comment carries its mutation.
- **Real shape.** Rows marked RS consume the engine's own bytes or a real open.

| row | test (file) | asserts | mutation, which fails it by name |
|---|---|---|---|
| LE-1 | `wkb.rs` unit | a LineString row is its positions in order, bits unchanged | narrow through `f32` |
| LE-2 | `wkb.rs` unit | L-8's refusals, each typed `Wkb`, naming what was met, `[P6 placeholder]` | delete the type-2 check |
| LE-3 | `wkb.rs` unit | big-endian decodes to the same values | ignore the byte-order byte |
| LE-4 | `wkb.rs` unit | 0 and 1 positions refused, 2 admitted | `< 2` to `< 1` |
| LE-5 **[OPEN-1]** | `wkb.rs` unit | ML-1: one geometry offset per row, parts kept; a type-2 row is one part, bits unchanged | push a geometry offset per part |
| LE-6 **[OPEN-1]** | `wkb.rs` unit | ML-8's refusals | delete the part-type check |
| LE-7 | `geoarrow.rs` unit | the line storage types; each validator refuses the others' arrays, the point one included | the linestring validator accepts two list levels |
| LE-8 | `geoarrow.rs` unit | `coordinate_values` over a sliced linestring array, and **[OPEN-1]** a sliced multilinestring array, returns the slice's run only | read the run from offset 0 instead of the slice's first geometry offset |
| LE-9 | `envelope.rs` unit | for each line encoding, the key equals the field's extension name | write `EXT_NAME_POLYGON` for LineString |
| A-L1 | `engine/tests/geometry_admission.rs` | L-1 to L-6: the encoding or the refusal | drop E-L2 check 6 |
| A-L2 **[OPEN-2]** | same | L-3's details name the kinds present; a polygonal-and-point set is byte-equal to A-P2's expectation | substitute the ruled kinds span unconditionally |
| A-1, A-2, A-3, A-P1 (changed) | same | F-6 and F-7a re-pointed to `GeometryCollection`; the expected texts render five types; A-3's member loop opens L-1 and ML-1 rows for the line members (`engine/tests/geometry_admission.rs:86-335 @ 0053ced0 sha256:e30b6a40bab41e540367c4e94220c6dda114a503fdc45d591722a9742dfa0957`) | as recorded; the reviewer re-observes each |
| S-L1 | `engine/tests/line_stream.rs`, RS | L-1 and **[OPEN-1]** ML-1 stream one row per feature, unique ids, bit-identical positions and part structure; key and field agree; `xy_bounds` is the vertices' min and max | push y before x |
| S-L2 | same | L-7, L-9 and L-10 end typed `engine.wkb` at the row; no later batch | skip the row |
| S-L3 | same | for 20,000 lines of 2 to 50 positions, and **[OPEN-1]** 20,000 multilinestrings of two-position parts, at the default targets: every batch's geometry, read from its own Arrow buffers, is at most 16V + 4(rows + V), and every batch fits its target. Not a bound recomputed from itself (the points reviewer's S-P3 observation) | `vertices * 16` to `vertices * 4` in `estimate_bytes` |
| BF-L | `engine/tests/geoarrow_batch_fixtures.rs`, RS | BF-L and **[OPEN-1]** BF-ML equal the engine's output from a real open; the three existing files are unchanged | change one coordinate in the BF-L writer |
| L-L | `engine/tests/lod_tier_builder.rs` (the LOD ignore) | `build_tiers` on L-1 refuses `Wkb` naming LineString; no tier written | the `LineString` arm of `geometry_type_name` returns `Polygon` |
| K-L1 | `kernel/src/skp.rs` tests, RS | a real open plus `describe` of L-1, and **[OPEN-1]** of ML-1: the encoding, the declaration, and a key set equal to the shared fixture's | `as_str` returns polygon for LineString |
| K-L2 | `kernel/tests/publish.rs`, RS | L-1 and **[OPEN-1]** ML-1 refuse at `preflight_pinless` with `GeometryEncodingNotPublishable`, naming the encoding, with no destination and no pin; L-11 refuses `GeographicCrsNotPublishable` | K2 compares against multipolygon only |
| W-L2 | `protocol/skp/tests/fixtures.rs` | `skp_version_is_skp_0_11` | the literal back to `skp/0.10` |
| SH-L0 | `decodeBatch.test.ts` | `geometryKindOf` maps both line encodings to `line`, and the others as before | map `geoarrow.multilinestring` to `polygonal` |
| SH-L1 | same, RS (BF-L, BF-ML) | the shape, `partToRow`, `partCount`, `totalVertices`, bits | walk a linestring row as a ring list |
| SH-2 (changed) | same | the unknown-value case uses `geoarrow.geometrycollection`; a line batch under a polygon expectation throws (`frontends/shell/src/canvas/decodeBatch.test.ts:167-195 @ 0053ced0 sha256:8fab154576211281369052b40e3a4bd79c5962a3f28109e83f98ff2618a3976c`) | as recorded |
| SH-L2 | `buildLayers.test.ts` | a line batch gives one pickable `PathLayer` (id, pixel width, colour, rounded), no `SolidPolygonLayer`, and the ceiling spied with `partCount`; with an outline, a non-pickable casing first, of the declared width | build `SolidPolygonLayer` for lines |
| SH-L2c | same | a line batch's data is reference-stable at an unchanged origin and recomputed after a recenter | delete the cache hit |
| SH-L3 | `pick.test.ts`, RS (BF-ML; BF-L under (B)) | ordinal k gives its row's id; two parts of one feature give identical results | index `ids` by the ordinal |
| SH-L4 | `pickResolution.test.ts` **[OPEN-4]** | the selector gives `averageFeatureExtent` for `line`; `pickingRadiusFor` gives 4 for `line` and `undefined` for `polygonal` and `point` | return the radius for `polygonal` |
| V-T-L | `renderer/bundle-viewer/scripts/partition-line-encoding.test.mjs`, RS (BF-L, BF-ML) | each offered as a partition is refused at the encoding check | delete the encoding check |
| E2E | `frontends/shell/e2e/regression.mjs`, new step LN' | L-1 (with a covering) opens; the summary shows `geometry (geoarrow.linestring)` and `LineString`; no refusal or banner | operator-run; no mutation |

**Not pinned here, with the reason:**
- SH-L4's wiring into `WorkingCanvas` is two call sites with no unit seam. The reviewer reads both, and T2 runs them.
- `verify-bundle.rs` is MP-2's.

## §5. Predictions · declared unchanged · invalidators · falsification

**Predictions (wrong is a result):**
- **PL-1.** §3's rows.
- **PL-2.** A re-run of the P4 generator at the head, made by the reviewer and not committed, differs from the committed `engine/ADMISSION-RESULTS.md` only in its commit and generated-date lines.
- **PL-3.**
  - G-1, G-2, BF-1 and BF-P are green at the base and at the head.
  - The five files the points form's Amendment 5, item 4 lists keep the sha256 values it records.
  - The default fixture's hash is unchanged.
- **PL-4.** V-L holds.
- **PL-5.** The run set is the base's plus §4's new tests, with `skp_version_is_skp_0_10` replaced by `skp_version_is_skp_0_11`. The ignored set is the base's plus §2's walkthrough generators and L-L off Windows, and nothing else.

**Declared unchanged:**
- the Polygon, MultiPolygon and Point bytes, as §6 states them;
- `estimate_bytes`' body and every ceiling's value;
- `lod.rs`, `format_declaration`, and ADR-017 §4 and §5a;
- `renderer/src/style.rs`, the style-ts resolver and `frontends/shell/src/style/`;
- `protocol/data-plane/`;
- MP-1's and the points form, `engine/ADMISSION-PREREGISTRATION.md`, `engine/ADMISSION-RESULTS.md`, and every ADR;
- the polygonal and point hover paths, `pickingRadius` for those opens, the 9 px threshold and `POINT_RADIUS_PX`;
- MP' and PT'.

**Invalidators (stop and return to the architect):**
- **I-1.** Any §6 file changes, or G-1, G-2, BF-1 or BF-P fails.
- **I-2.** V-L is false.
- **I-3.** S-L3 fails.
- **I-4.** BF-L or BF-ML is unstable across CI platforms.
- **I-5.** A refusal cannot state the type met without stating another module's consequence.
- **I-6.** The shell commit is reached with OPEN-3 or OPEN-4 unruled.
- **I-7.** OPEN-1 or OPEN-5 is ruled differently after dispatch.
- **I-8.** A consumer is found that decides a geometry's kind from its array's shape.

**Falsification.** Line admission proves unimplementable without moving Polygon, MultiPolygon or Point bytes.

## §6. Instruments

All quantities are assertions. None is a measurement.
- **No new golden commit.** The instruments are:
  - G-1 (`engine/tests/polygon_wire_golden.rs::the_polygon_only_wire_matches_the_golden_file`);
  - G-2 (`kernel/tests/publish_partition_golden.rs::the_published_partitions_and_manifest_match_the_golden_file`);
  - BF-1 (`engine/tests/geoarrow_batch_fixtures.rs::the_committed_batches_equal_the_engines_output_from_a_real_open_and_stream`);
  - BF-P (`engine/tests/geoarrow_batch_fixtures.rs::the_committed_point_batch_equals_the_engines_output_from_a_real_open_and_stream`);
  - the five files of the points form's Amendment 5, item 4.
- **The reviewer:**
  - runs all four tests at the base and at the head;
  - confirms the five files byte-identical by sha256;
  - confirms the default fixture's hash unchanged;
  - runs PL-2's re-run at the head.
- **Can a line arm move a polygon or point cut? No.**
  - `estimate_bytes` is not edited, and the inputs of the other encodings are unchanged.
  - G-1's publish half detects any moved cut.

## §7. Declared values and ceilings

- **The readable set**, declared once: Polygon, MultiPolygon, Point, LineString, MultiLineString **[OPEN-1]** (E-L1).
- **`LINE_WIDTH_PX` = 2 CSS pixels**, and the casing width is `LINE_WIDTH_PX + 2 × outlineWidth` **[OPEN-3]**.
- **`LINE_PICK_RADIUS_PX` = 4 CSS pixels**, for line opens only **[OPEN-4]**.
- **The 9 px threshold** is unchanged, applied to the average line extent (ADR-028 item 4 as written).
- **No new ceiling:**
  - `DECKGL_PICK_INDEX_CEILING` counts line parts;
  - `MAX_RESIDENT_VERTICES` counts vertices;
  - the batch ceilings bound line batches through the unchanged estimate (S-L3).

**Line budget, by §21c's rule** (insertions plus deletions, tests included; this form excluded; binary files counted as files only). The ceilings are declared for OPEN-1 (A). Under (B) the figures only fall, and the ceilings stand.

| group | files | ceiling |
|---|---|---|
| engine product (unit tests inside included) | `wkb.rs`, `geoarrow.rs`, `envelope.rs`, `stream.rs`, `lib.rs`, `fixture.rs` | ≤ 950 |
| engine tests | `geometry_admission.rs`, `line_stream.rs`, `geoarrow_batch_fixtures.rs`, `lod_tier_builder.rs`, BF-L and BF-ML (binary) | ≤ 900 |
| kernel | `src/skp.rs` (tests), `tests/publish.rs`, `tests/manual_walkthrough_fixtures.rs`, `README.md` | ≤ 420 |
| protocol | `commands.rs`, `mod.rs`, `SKP-V0.md`, `tests/fixtures.rs`, `tests/data/*.json`, `tests/conformance/**` | ≤ 260 |
| shell product | `decodeBatch.ts`, `buildLayers.ts`, `pickResolution.ts`, `WorkingCanvas.tsx`, `limits.ts`, `PICKING.md`, `skp/types.ts` | ≤ 400 |
| shell tests and seams | the shell tests in §4, `testUtils/batchFixtures.ts`, the TS literal tests, `e2e/regression.mjs`, the viewer test | ≤ 600 |
| docs | `KNOWN-LIMITATIONS.md`, `engine/README.md`, `MANUAL-WALKTHROUGH.md` | ≤ 220 |
| **Total** | **≤ 66 files** | **≤ 3,750** |

The basis for each figure is the points cut's actual count for that group (its Amendment 4, item 3, and Amendment 5, item 10). Where a group grows:
- the engine groups: two encodings and the changed admission tests, with no corpus tests;
- the kernel group: four generators, counted from the start.

**Counting command, at a named head H, with the base B named in the PR body** (`git merge-base origin/main H`, read before the merge):

`git diff --numstat B H -- . ':!engine/GEOMETRY-LINES-PREREGISTRATION.md'`

After the merge, B is the merge commit's first parent and H is the merge commit. An overrun is class 8, and this section is never edited.

## §8. Block-on-sight (each checked separately)

1. Any change to a §6 file or to the default fixture's hash; or G-1, G-2, BF-1 or BF-P not green at the head.
2. The encoding varies per batch, or the envelope, `describe` and the batch disagree.
3. Any row other than one per feature; parts that become rows.
4. A line layer reached without `checkPickCeiling(partCount)`.
5. Any surface presents an encoding, a promotion included, as the file's type.
6. A row of an unread type skipped or counted; a line with fewer than two positions drawn, dropped or skipped.
7. Any of:
   - the out-of-set detail not byte-equal to the sighted template rendered with the declaration's set;
   - a mixed-kind set admitted;
   - `MIXED_KINDS_DRAFT`'s bytes changed;
   - a polygonal-and-point detail no longer byte-identical to today's.
8. A new operator string without `[P6 placeholder]`, or an engine message stating another module's consequence.
9. A line dataset not refused at K2, or K2 moved or carried as `PublishError::Engine`.
10. An edit to any of §5's declared-unchanged items.
11. A new `pub` item beyond `GeometryEncoding`'s new variants and E-L9's feature-gated helpers; any attribute hook; an option, callback or path with no product caller.
12. Any of:
    - the literal not in one commit with both sides' fixtures;
    - the §8 entry not last before §9;
    - the version-refusal fixture not renumbered.
13. Any code before OPEN-1 and OPEN-5 are ruled; code of OPEN-3 or OPEN-4 before its ruling; MultiLineString admitted under OPEN-1 (B).
14. The word zero-copy, a performance number, a timing assertion, or a docs/08 row.
15. A new `cfg` or platform ignore beyond §2's Portability.
16. The round-25 items, by name:
    - an overrun not recorded as class 8, or §7 edited to match;
    - a scope addition not recorded as class 9, or any code of it before its amendment;
    - a record calling a `verify-mutation` run an observation;
    - a test-text span on the branch pinned by hash at a branch commit, or named without its commit id;
    - a five-line form for this piece.
17. Quotation marks around text not byte-identical to its named source; a line cite into the ledger; a bare self-line.
18. An index edit outside §2's listed sections, or an index over 60 lines.
19. `pickingRadius` set, or `pickObject` given a radius, for a polygonal or point open; the polygonal or point hover or threshold path changed.
20. `toStyleDocument` writing anything but `polygon`, a line property in the style document, or a path that saves a line layer's style document.
21. Any consumer that decides the geometry kind from an array's shape rather than from the encoding string.
22. A walkthrough row or E2E step already on main edited rather than given a dated note.

## §9. Gates

**Commit plan.** Each commit is signed off.
1. Engine (E-L1 to E-L9) with its tests, BF-L and BF-ML, and the changed A-tests. This waits on OPEN-1 and OPEN-5.
2. Kernel tests and the walkthrough generators.
3. Wire (W-L1 to W-L3): the literal and both sides' fixtures, in one commit.
4. Shell (V-L first, then SH-L1 to SH-L7), V-T-L and LN'. This waits on OPEN-3 and OPEN-4.
5. Docs: KNOWN-LIMITATIONS, the indexes, Part T and Part P's note.

**Architect** (full gating):
- §8, item by item;
- ADR-034's inherited list (§2) and Decisions 1, 2, 3, 5, 6, 7, 8, 9 and 10 against the diff;
- acceptance items 5 and 6, and round 62's items as §2 carries them;
- ADR-010 rules 1, 2, 3 and 6; ADR-016 §5; ADR-017 §4 and §5a unchanged;
- ADR-022 Decision 4 per OPEN-3; ADR-028 item 4;
- SKP-V0 §4 item 13;
- the seam rule for each RS row and for O6;
- verbatim quotes and discharge claims resolved;
- the round-25 checks.

**Reviewer:**
- the full diff with `origin/main...HEAD`;
- §6 at the base and at the head, and PL-2's re-run;
- every mutation re-made, the changed tests included;
- §7's count by its command;
- every hash recomputed;
- V-L against the lock;
- SH-L4's two wiring sites read;
- the index lines;
- PL-5 by name.

**Suites, green before either gate.** Heavy runs follow the machine paragraph, `state/directives/2026-10-06-machine-script-adopted.md:12-22 @ 0053ced0 sha256:7350977156bed7c94b0da4e8db806ba34c25c6678e65c46447a62d791ba9e8e1`, carried in the worker's, tester's and reviewer's briefs. No other rule for running builds applies.
- `cargo test --workspace --locked --features spatial-engine/fixture`;
- `cargo fmt --all --check`;
- `cargo clippy --workspace --all-targets --locked --features spatial-engine/fixture`, read as the points form's Amendment 2, item 7 reads it: no new warning on an added line, not `-D warnings`;
- the `src-tauri` tests;
- the shell's unit suite and type check;
- the viewer's `node --test`;
- `node --test scripts/plan/*.test.mjs scripts/hooks/*.test.mjs scripts/evidence/*.test.mjs`;
- `verify.mjs`, `queue --check`, `site --check`, `verify-cites`, `verify-quotes` (a floor) and `verify-test-claims`;
- CI green at the reviewed commit.

**Proportional gates.** The product-first direction's section 2 applies, by reference (`state/directives/2026-10-05-product-first-direction.md:15 @ 0053ced0 sha256:8c0e4e3f404b413db3e506411f401880baf9681ac8dd67362dfba73c20d7b751`).

**Operator.**
- Part T is queued for the same sitting as MP-1's Part S and the points cut's Part P, both still unrun (`engine/GEOMETRY-POINTS-PREREGISTRATION.md:713 @ 0053ced0 sha256:2598accdbf467480e3607d2229fefd35efd416661d0a314ac99c1dc4bd2e881c`).
- LN' runs in the same E2E run as MP' and PT'. MP' is predicted to meet the no-covering refusal there. That is the proposed node `mp-prime-e2e-covered-fixture`'s concern, not this form's.

**PR body:**
- asks for a merge commit;
- names each OPEN ruling;
- names the base B.

**Closing record (references and hashes only):**
1. The PR, its merge commit and the reviewed heads.
2. The gate report paths.
3. The worker reports, each pinned at the commit that added it.
4. §6's files, re-pinned at the merge commit.
5. Each mutation's observation commit.
6. The literal minted.
7. PL-2's re-run result, from the reviewer report.
8. Each done item's test name.
9. §7's count.
10. The proposed nodes recorded.
11. PLAN set to done with `{pr}` in the done commit only.

## §10. Amendments

*(Opens empty; append-only.)*

## OPEN (for the human; each is ruled before the step it names)

- **OPEN-1:** is MultiLineString in scope?
  - (A) LineString and MultiLineString. Recommended.
  - (B) LineString only.
  - Rule before dispatch.
- **OPEN-2:** the refusal wording.
  - The sighted template, with five types under (A) or four under (B).
  - The mixed-kind detail, naming the kinds present, as E-L2 check 8 drafts it.
  - Rule before the PR is set ready.
- **OPEN-3:** the line symbol, `LINE_WIDTH_PX` and the casing (SH-L2, SH-L5). Rule before commit 4.
- **OPEN-4:** the pick tolerance, `LINE_PICK_RADIUS_PX`, for line opens only (SH-L4). Rule before commit 4.
- **OPEN-5:** measure docs/08's Lines class in this cut?
  - (A) No: no claim, and the proposed node `lines-class-budget-measurement`. Recommended.
  - (B) Yes.
  - Rule before dispatch.

### Amendment 1 — question rounds 63 and 64's rulings (OPEN-1 to OPEN-5); a row T4 sight (class 7); the proposed node for the Lines class

*Written by the custodian after question rounds 63 and 64 were answered and before any code: no branch exists. It is appended at the file's end, below the OPEN list, and belongs to §10. The rulings are `state/directives/2026-10-07-round-63-and-64-rulings.md`, lines 6 to 12, at the commit that adds it: line 6, sha256 8590d29a4b2a7dffa9581fbf6f9eec4032f9771cfa6e4fb123bd6a80071c0d92; line 7, sha256 445ec63c10bf05fb0024bbc9a0792cbae603153e8164e1e7c7c77b84fb1d44bd; lines 8 to 10, sha256 a40a9a6ebbe696945bd923e704043160f1349ac7f9db192734ccbaddf69f6471; line 11, sha256 1c6a27b603988da223219d3b640d9f2a4f7cdf9f4ba7a2e4d139d19ecc9b9a82; line 12, sha256 39a173334d96baf873a473e061b194183bc6a44c99066a0b760c5bb966702e0a. Their RULED block is in `DECISIONS-PENDING.md` under rounds 63 and 64, referenced and not restated. Each ruling is read by its own OPEN label, as the directive's filing note says. Nothing below is a quotation.*

1. **OPEN-1, (A).** LineString and MultiLineString. The parts marked [OPEN-1] are binding as drafted for (A):
   - a LineString row under a declared set that includes MultiLineString is read as a one-part MultiLineString;
   - the sighted refusal's set renders five types;
   - §7's ceilings stand as declared for (A).
2. **OPEN-2, (A).** The parts marked [OPEN-2] are binding.
   - A member outside the readable set keeps the sighted template, with its code unchanged and its set rendering five types.
   - The mixed-kind detail keeps round 62's draft byte-identical except for the span naming the kinds. That span names the kinds present, in the order polygonal, point, line, joined as the readable set is joined. So a polygonal-and-point set reads exactly as today.
   - The detail stays a `[P6 placeholder]`, and the human sights it at P6. The PR's ready state no longer waits on OPEN-2.
3. **OPEN-3, (A), with `LINE_WIDTH_PX` = 2 CSS pixels and the casing.** The parts marked [OPEN-3] are binding. Round 62 item 3's reading of ADR-022 Decision 4 applies unchanged:
   - the mapping onto the line symbol is rendering plumbing, in the working canvas only;
   - the style document still says polygon;
   - **this cut adds no path that saves a line layer's style document.** Saving one needs the human's ruling. §8 item 20 already blocks it on sight;
   - KNOWN-LIMITATIONS item 37 is as drafted, for the human's P6 sight;
   - a line geometry and a width in the style document stay with style v2 (B3), as §2 says.
4. **OPEN-4, (A).** `LINE_PICK_RADIUS_PX` = 4 CSS pixels, for line opens only, set as deck's hover `pickingRadius` and as the settle re-pick's radius. The parts marked [OPEN-4] are binding:
   - polygon and point opens are unchanged;
   - the 9 px refusal stays ADR-028 item 4 as written, on the average line extent;
   - KNOWN-LIMITATIONS item 38 is as drafted, for the human's P6 sight;
   - row T2 records whether naming the topmost of two crossing lines is acceptable, as drafted.
5. **OPEN-5, (A).** No measurement and no performance claim. The proposed node `lines-class-budget-measurement` is recorded in this amendment's commit.
6. **Class 7, a sight-list addition from the OPEN-3 ruling:** row T4 also records whether the casing looks right at the default opacity. The worker writes this into Part T's T4 row, with a blank result line.
7. **Generation 2.** Dispatch may start, beginning with commit 1. Commit 4 no longer waits, and §8 item 13's conditions on unruled items are met.

**Superseded index.**
- The OPEN list and every [OPEN-1] to [OPEN-5] mark → items 1 to 5, binding.
- §9's notes that commit 1 waits on OPEN-1 and OPEN-5, and commit 4 on OPEN-3 and OPEN-4 → item 7.
- Part T's row T4 → item 6 adds a sight.

### Amendment 2 — phase A's outcomes: the build's deviations (class 2 and class 3), the engine groups over their ceilings so far, and the clippy reading

*Written by the custodian after phase A's results were seen, at the branch head 26d4ccc0924d97a4af3f2272f735750fa016e4b8, before phase B and before either gate. The record is worker report 1, `state/consults/2026-10-07-geometry-lines-cut-worker-report-1.md` (sha256 06de309693fa6975f2a3569caa26959c999ffffefe2a0dab6e89c54e3b50306e, from its line 5 to the end, at the commit that adds it), cited by section. Nothing below is a quotation.*

1. **Phase A's commits:**
   - 719d2b04, the engine;
   - 534dd647, the kernel tests and generators;
   - 26d4ccc0, the wire, `skp/0.11`.
2. **Class 2, E-L9's helpers.** E-L9 gains `line_l1_rows_with_bounds` and `multilinestring_ml1_rows_with_bounds`, feature-gated, because the ML-1 walkthrough generator needs a covering. §2 names the with-and-without-bounds pair for L-1 only. Both are among E-L9's feature-gated helpers that §8 item 11 allows, and each has a test or generator caller.
3. **Class 2, one rename.** LE-6's test renames one local variable, because the engine's transport-name scan refuses the identifier the first draft used. LE-6's mutation was observed before the rename, and the behaviour is the same.
4. **Class 3, A-2's mutation site.** A-2's recorded mutation now lives in the new `join_phrase` helper, which `readable_set_phrase` calls. A-3's stays in `readable_set_phrase`. Both were re-observed (the report's Mutations table).
5. **Class 3, the declared-LineString generator's doc** is corrected as §2 says, and names Part T's T6. Its code is not edited.
6. **§7 so far:** 2,721 lines over 35 files, against 3,750 over 66. Two groups are over their ceilings so far:
   - engine product: 1,220, against 950;
   - engine tests: 960, against 900.

   The class 8 record is made once, at the gated head, with the final figures. §7 is not edited.
7. **The clippy reading,** as §9 sets it: no warning on a line this branch adds. 44 warning sites remain, all on lines the branch did not add.
8. **The run set:** 903 passed and 54 ignored. That is 18 more passed than the base, the new rows, and 4 more ignored, the four walkthrough generators (PL-5).
9. **Generation 3.**

**Superseded index.** §2's E-L9 helper list → item 2. §4's A-2 mutation site → item 4. Neither is edited.

### Amendment 3 — phase B's outcomes: the build's deviations (class 2 and class 3), and §7 at the build's head

*Written by the custodian after phase B's results were seen, at the branch head e89bf9bf6c2c90965ff75a7fd892bc7b1bae3d40, before either gate. The records are worker report 2 (`state/consults/2026-10-07-geometry-lines-cut-worker-report-2.md`, stage 1) and worker report 3 (`state/consults/2026-10-07-geometry-lines-cut-worker-report-3.md`, stage 2), each pinned by hash in its filing note, cited by section. Nothing below is a quotation.*

1. **Phase B's commits:** ba648a9a, the shell (V-L, SH-L1 to SH-L7, V-T-L, LN'), and e89bf9bf, the docs. V-L holds on all five points, at deck.gl 9.3.9, the lock's version (report 2, V-L).
2. **Class 2, the casing's ends.** The casing is drawn with rounded joints and caps, as the line is, so that a square-capped casing shows no corners beside a round-capped line. SH-L2 named rounding for the line only.
3. **Class 2, one E2E line.** `e2e/regression.mjs`'s fixture-existence list gains the L-1 file beside LN', so that a missing file fails early. MP' and PT' are not edited.
4. **Class 3, `decodeBatch.ts`'s doc.** The custodian's brief said its `skp/0.10` for the point value was stale. It is not: `skp/0.10` is the entry that gave the point value. The stale part was the doc's count of encodings, which now names five: the third from `skp/0.10`, and the fourth and fifth from `skp/0.11`.
5. **Class 2, Part T's T6(c).** `declared-linestring.parquet` has no covering, so a canvas viewport query may meet the no-covering refusal before the engine reaches row 0. T6(c) says so, and asks for the code shown. The generator's code is not edited.
6. **Class 3, the indexes' Last verified at** is ba648a9a, commit 4's head, because commit 5 cannot name its own hash.
7. **§7 at e89bf9bf, by its command:** 3,561 lines over 52 files, against 3,750 over 66.
   - Engine product (1,220 against 950) and engine tests (960 against 900) are over, as Amendment 2 recorded.
   - Every other group is within its ceiling: kernel 307, protocol 221, shell product 242, shell tests and seams 521, and docs 90.

   The class 8 record is made once, at the gated head. §7 is not edited.
8. **The suites at e89bf9bf, all exit 0** (report 3):
   - workspace 903 passed and 54 ignored, with §6's four instruments green and the five files byte-identical;
   - clippy shows no warning on an added line;
   - src-tauri 68, shell 1,125 and viewer 84 passed;
   - the scripts suite passed 450;
   - the four verifiers exit 0.
9. **Generation 4.**

**Superseded index.** SH-L2's casing ends → item 2. §2's Operator LN' paragraph → item 3 adds one fixture-existence line. Part T's T6(c) → item 5. None is edited.

### Amendment 4 — the closing record (class 1, with class 8 for the engine groups)

*Written by the custodian after the outcomes were seen. PR #188 merged at 2026-10-07T22:19:35Z as merge commit e888787eeec1e5ce63adf56a9aff1b087951e889, with parents aa00e565f61f5633170b0efdd723448121d9d6f5 and c3acb40b095784738d4b77e1eededa77963f7dae. It follows §9's closing-record list and routes the gates' record items. References and hashes only. Nothing below is a quotation.*

1. **The PR and its heads:**
   - PR #188, at the merge commit above;
   - both gates' reviewed head, e89bf9bf6c2c90965ff75a7fd892bc7b1bae3d40, at generation 4;
   - the merged head, c3acb40b. Over the reviewed head it adds the merge of main at 248d5f33, whose two conflicts the custodian resolved (the reviewer's D-1: `skp/0.11` last before section 9 of `protocol/skp/SKP-V0.md`, and the union of the kernel README's list), and the architect's D-1, D-4 and D-5 fixed at c3acb40b. The custodian checked each fix against its finding (worker report 4). CI was green there.
2. **The gate reports,** under `state/consults/gates/`:
   - `2026-10-07-geometry-lines-cut-gate1-architect.md`, pass with notes, gate-log 433, sha256 9ccb506931a4bb4d07e4ca0368172b6fe5c81e02b3379ae0f4e092dd51f312b6, added in ed8b89380e4a8704690f683a87ed5b0d04875e66;
   - `2026-10-07-geometry-lines-cut-gate1-reviewer.md`, pass, gate-log 434, sha256 b6897e491527f0a53b7049de3018d4955bb27978383350a65afb7a5cd95458b5, added in 8c20aeb4e454b2d60e4cb2f0454cf1b8cf8d3187.
3. **The worker reports, each pinned at the commit that added it.** Each hash is of the file from its line 5 to the end, and each file is byte-identical at the merge commit:
   - `state/consults/2026-10-07-geometry-lines-cut-worker-report-1.md`, phase A, at 6079bca41940233a77544ef73dc83313a46486b3, sha256 06de309693fa6975f2a3569caa26959c999ffffefe2a0dab6e89c54e3b50306e (Amendment 2);
   - `-report-2.md`, phase B stage 1, at 5924956c3e10e1c98f80bde80bb34207de3108a9, sha256 63b39d93da65d4ab119fba4f5ff30a7b9fa816b13f29f19f29d20de27150dc05 (Amendment 3);
   - `-report-3.md`, phase B stage 2, at 7dd0315db6c62932b96256cf30224fd62136a5e8, sha256 c018db0aa11dc64d1f3b489800a7c4c6404bc26c62cac291a576500afe1a5bb2 (Amendment 3);
   - `-report-4.md`, the gate fixes, at 9ca9055ecb64b0e56d57df6f3a5ebf5da7a35630, sha256 04e4c99034d079f6d95ed2d3c3251288bd83753f69cad1d40663b4d7b2d2ebbb.
4. **§6's files at the merge commit.** The first five are byte-identical to the base B, 6f4cc949:
   - `engine/tests/data/golden/polygon-wire.golden`, sha256 d810e6a8659c82c322231d9c784e8d9fbb4e0f074bb325e3cebf1f94ddcab15d;
   - `kernel/tests/data/golden/publish-partitions.golden`, sha256 5b10ddd64ca60db9009ab1453cf99098353e4a9b93bcf012dca089586b0c7e01;
   - `engine/tests/data/geoarrow/lv95-polygon-batch.arrows`, sha256 d0afe93e143c0e2de16f7fad6eb9272a687195dfec6f68999e7dc7b24ba78197;
   - `engine/tests/data/geoarrow/lv95-multipolygon-batch.arrows`, sha256 831eb54076cf565eac33b673749f8fa3a6a2f481ff3c831a371f740abf6673fa;
   - `engine/tests/data/geoarrow/lv95-point-batch.arrows`, sha256 10c17431583bc49d772ddffe92e59a8644397103f140b055fb38ffd1d65f267f;
   - BF-L, `engine/tests/data/geoarrow/lv95-linestring-batch.arrows`, new in 719d2b04, sha256 6b4f03b16b3cf18592b33e883d0fe75dd821c50f8f0d980a647d05d368c24120;
   - BF-ML, `engine/tests/data/geoarrow/lv95-multilinestring-batch.arrows`, new in 719d2b04, sha256 31f10a83c62623bac4c7a18fc5b7844939a529823ca5b094e253b86fd980b1f5.
5. **The mutations.** Each row's observation commit is in its test's recorded-mutation comment and in the worker reports' Mutations sections: the engine rows over 6f4cc949, the kernel rows over 719d2b04 and W-L2 over 534dd647 (report 1), and the shell rows over 26d4ccc0 (report 2). The reviewer re-made every row at e89bf9bf, and each failed its test by name (the reviewer report's Mutations section).
6. **The literal minted:** `skp/0.11`, at `protocol/skp/src/v0/mod.rs:109 @ e888787e sha256:565dc56ac0b2f54024ba5a8d167c79c72d256d5b69835bd55c0e95f43b187a8b`. Its §8 entry is `protocol/skp/SKP-V0.md:1051-1073 @ e888787e sha256:3b0dd134c78bb5d0663cf6e35365015f8d8d8760e2078bf69fa3f9fb5624902c`.
7. **PL-2 holds:** the reviewer's re-run at e89bf9bf (the reviewer report's Evidence section). `engine/ADMISSION-RESULTS.md` is byte-identical to B at the merge commit, sha256 74b408b520e84692d3664b89ccc594e56120d614389a98f1262a1888cb8f2c43.
8. **The done items' proofs:** §4's rows, by name, each re-observed by name at e89bf9bf (the reviewer report's Mutations section).
9. **§7, budget overrun, §7 not edited (class 8; the architect's D-2 and the reviewer's D-2).** By §7's command with B = aa00e565, the merge commit's first parent, and H = the merge commit: 3,561 changed lines over 52 files, against at most 3,750 over 66. That equals Amendment 3, item 7's count at e89bf9bf, since the gate fixes edit lines the branch added.
   - Engine product: 1,220 against 950. Engine tests: 960 against 900. These two are the class 8 record that Amendment 2, item 6 and Amendment 3, item 7 deferred to the gated head. The reason, read from the diff: the two line decoders and their in-file tests in `engine/src/wkb.rs` and `engine/src/geoarrow.rs` (910 of the 1,220), and in the tests group `engine/tests/line_stream.rs` (513) and the changed admission tests (302). §7's basis was the points cut, which added one encoding.
   - Every other group is within its ceiling: kernel 307, protocol 221, shell product 242, shell tests and seams 521, and docs 90.
10. **The checks the worker reports did not run** (the architect's D-3): `queue --check` and `site --check` passed in Governance CI run 37693075014, job `test · verify:plan · queue/site drift`, at the merged head c3acb40b. Governance CI did not run at e89bf9bf. On main, it passed at the merge commit in run 37695450260.
11. **Two hash references' revs** (the reviewer's D-3): Amendment 1's directive hashes are at 6f4cc949, and Amendment 2's worker report hash is at 6079bca4. Both commits are on main, and every hash matches (the reviewer report's Documentation section). Neither amendment is edited.
12. **The proposed nodes recorded:** `shell-owners-index` and `corpus-line-files` (the form commit), and `lines-class-budget-measurement` (Amendment 1). All three stay proposed, for the human's placement.
13. **Routed:**
    - `frontends/shell/src/canvas/pick.ts`'s doc still describes a polygon part and an exterior ring. It goes to the next piece that edits `pick.ts` (the architect's noticed item).
    - KNOWN-LIMITATIONS item 31's mixed-kinds sentence can be read as refusing Polygon with MultiPolygon, which the engine admits. It is draft wording for the human's P6 sight at the sitting (the reviewer's noted item).
14. **Operator:** Part T and the E2E step LN' are unrun. They are queued for the sitting with MP-1's Part S and the points cut's Part P.
15. **Done:** PLAN marks the node done, with evidence `{pr: 188}`, at generation 5, in this amendment's commit.

**Superseded index.** Amendment 2, item 6 and Amendment 3, item 7's deferred class 8 record → item 9. None is edited.
