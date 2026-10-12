*Custodian's filing note (2026-10-07): the architect's draft of `geometry-lines-cut`'s preregistration, on the custodian's brief at main 0053ced0, drafted alone while the lead-data pilot is paused. It arrived as a message and is extracted here by script from the SubagentHandback call in the subagent's own transcript, with nothing changed except one final newline. Its sha256, from this file's line 5 to the end, is f09fcb1b12761bb770939ac08bcc45117278f1916e95f96d24109921f91c0fd6. Write audit PASS: zero write calls (Read 54, Grep 42, Glob 1, SubagentHandback 1). Run window from the transcript: 2026-10-07T04:42:41.079Z to 2026-10-07T04:56:52.203Z (the harness's usage line: 353,821 subagent tokens, 98 tool uses, 851,197 ms). The form as committed, `engine/GEOMETRY-LINES-PREREGISTRATION.md`, is part 2's block with its 78 HASH-TBD pins computed at 0053ced0, the one sentence that said the custodian computes them rewritten to say they were computed, and the one correction this draft's closing paragraph asks for: the vertical-cut table's row-decode cell loses its stub parenthetical, which named type 6 where a WKB MultiLineString is type 5. Nothing else changed. The pins in parts 1 and 3 below are left as returned.*

---

Reviewed: main @ 0053ced0

I read the tree from the main checkout. The git status snapshot puts HEAD on main at 0053ced0 with only untracked files, so the line numbers below are taken as 0053ced0's. I ran no command. Before filing, check the checkout HEAD and compute every `HASH-TBD`.

## 1. Which form, and why; what is the human's

**The full form, with full gating from dispatch** (AUTONOMY §21a, §25(e)). No five-line form is possible.
- **Categories touched:**
  - **Wire.** `protocol/skp/**` changes: a new `skp/0.11` literal, the `GeometryInfo.encoding` doc, SKP-V0 §1 and §8.
  - **A stated guarantee, or a property under test.** One row per feature; no silent drop; Polygon, MultiPolygon and Point bytes stay identical; refusals by name.
  - **The size threshold, §21c.**
- **No ADR is amended.** ADR-034 governs the cut and is architect-blockable.
- **Size, by §21c's rule** (insertions plus deletions, tests included):
  - Expected: about 3,100 lines over about 55 files.
  - Declared ceiling: ≤ 3,750 lines over ≤ 66 files, with a ceiling for each group.
  - Each group's figure is defended from the points cut's actual per-group counts (its Amendment 4, item 3 and Amendment 5, item 10).
  - The kernel ceiling counts the walkthrough generators from the start. That is where points overran.
- **Where it lives:** `engine/GEOMETRY-LINES-PREREGISTRATION.md`.
  - In the same commit, the custodian sets the node's `gate:` to that path and adds `merge: merge-commit` (AUTONOMY §27).

**What is the human's.** Each item below has options, a recommendation, whether it is a red line, and what waits on it in section 3.
- **OPEN-1:** is MultiLineString in scope?
- **OPEN-2:** the refusal wording. ADR-034's Consequences say each cut puts its own refusal wording to the human.
- **OPEN-3:** line styling and the line width.
- **OPEN-4:** the pick tolerance, in CSS pixels.
- **OPEN-5:** whether to measure docs/08's Lines class.
- **Also the human's:** the P6 wording of every new placeholder, Part T's verdicts, and where three proposed nodes go:
  - `shell-owners-index`;
  - `corpus-line-files`;
  - `lines-class-budget-measurement` (under OPEN-5 (A)).

**Carried by reference, with no new ruling.**
- ADR-034's inherited rule and its Decisions.
- Acceptance items 5 and 6.
- Round 62, item 2: a set that mixes readable kinds is refused at open. That ruling is general.
- Round 62, item 4: pickingRadius stays unset, for polygonal and point opens. It is not extended to lines.
- ADR-028 item 4: the 9 px threshold against the average feature extent. It applies to lines as written, because a line has an extent; a point needed a ruling because it has none.

**The routed item** (the points form, Amendment 5, item 13, second bullet) **is settled here, not deferred:**
- The engine index's Declared-limits line lists only the limits caused by engine code, so item 34 leaves it.
- The shell-owned items (34 to 38) stay unindexed, because no shell owner's index exists.
- Creating one is outside this form under the freeze, so it is recorded as a proposed node.

**Three hazards found in the tree, which the draft handles:**
1. **Part P's row P7(a) breaks.** The unrun Part P's P7(a) uses `declared-linestring.parquet` to show the sighted refusal. After this cut that file opens, and the stream stops at row 0. The draft adds a replacement fixture, declared `["GeometryCollection"]`, and a dated note under Part P.
2. **Merged tests use LineString as the unreadable example, and would break.** They are re-pointed, and §4 lists them as changed:
   - A-1's F-6 and F-7a, A-2, A-3 and A-P1's P-4 and P-5;
   - SH-2, which builds a polygon-shaped batch and labels it `geoarrow.linestring`.
3. **A multilinestring array is structurally identical to a polygon array** (`List<List<FixedSizeList<f64>[2]>>`). Every consumer must decide the kind from the encoding string, never from the array's shape. The draft makes this a block-on-sight item and an invalidator.

## 2. The draft

````markdown
# Lines — admission, row decode, encoding selection, the envelope and `describe`, the shell's decode, drawing, picking and styling, and the publish refusal — preregistration

## Header

- **Status.** The preregistration of PLAN node `geometry-lines-cut` (`PLAN.yaml:2298-2314 @ 0053ced0 sha256:HASH-TBD`). Committed before any code. Append-only once committed. An amendment written after any outcome has been seen says so in its first line.
- **Form.** Full form, full gating from dispatch (AUTONOMY §21a: the wire and stated-guarantee categories, and §21c's size bound; §25(e)). No five-line form exists for this piece. No ADR is amended.
- **Authority:**
  - the product-first direction, section 4 (the order) and section 8.c (placement): `state/directives/2026-10-05-product-first-direction.md:19 @ 0053ced0 sha256:HASH-TBD`, `state/directives/2026-10-05-product-first-direction.md:30 @ 0053ced0 sha256:HASH-TBD`;
  - ADR-034, Accepted and architect-blockable. Its Consequences paragraph on points and lines binds this cut: `docs/adr/ADR-034-geometry-type-admission-and-geoarrow-encoding-selection.md:139-149 @ 0053ced0 sha256:HASH-TBD`;
  - the 2026-10-05 ADR-034 acceptance, items 5 and 6: `state/directives/2026-10-05-adr-034-acceptance.md:11-12 @ 0053ced0 sha256:HASH-TBD`;
  - question round 62's rulings, carried by reference where §2 says so: `state/directives/2026-10-06-round-62-rulings.md:7-9 @ 0053ced0 sha256:HASH-TBD`;
  - the points form's closing record, Amendment 5, item 13, second bullet, which routes the index item here: `engine/GEOMETRY-POINTS-PREREGISTRATION.md:711 @ 0053ced0 sha256:HASH-TBD`;
  - RULED 2026-09-24 (night), item (2): literals follow merge order;
  - drafting by the architect: question round 43, item 2;
  - the owner's-index update by the implementing worker, in the same PR: `state/directives/2026-10-05-product-first-direction.md:11 @ 0053ced0 sha256:HASH-TBD`.
- **Drafted by** the architect agent, alone, on the custodian's brief, with no impact read (the lead-data pilot is paused). The tree was read from the main checkout at 0053ced0. Read-only: the architect ran no command. The custodian computes every pin at 0053ced0 when filing.
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
- **Evidence, not Authority (untracked).** The architect read the installed `@deck.gl/layers` and `@deck.gl/core` under `frontends/shell/node_modules`; the lock resolves 9.3.9 (`frontends/shell/package-lock.json:476-477 @ 0053ced0 sha256:HASH-TBD`). What was read:
  - in `path-layer.js`, `instancePickingColors` encodes the datum index;
  - `widthUnits` defaults to metres;
  - in `deck.js`, hover picking passes `props.pickingRadius`, whose default is 0.

  V-L (§2) re-verifies all of this at the branch base before any shell code.
- **Fixture drive:** nothing is measured.

## §1. What this preregistration may and may not claim

- **No performance number, no docs/08 row and no timing assertion [OPEN-5].**
  - docs/08 defines a Lines class (`docs/08_Testing.md:30 @ 0053ced0 sha256:HASH-TBD`), and this cut does not measure it.
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
| row decode | the Polygon, MultiPolygon and Point builders; strict, by-name refusals | `LineStringBuilder` (WKB type 2 only); `MultiLineStringBuilder` (types 2 and 6... see E-L4 for the exact codes) **[OPEN-1]** |
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

**ADR-034's inherited rule, item by item** (`docs/adr/ADR-034-geometry-type-admission-and-geoarrow-encoding-selection.md:139-149 @ 0053ced0 sha256:HASH-TBD`):
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

**E-L1. The readable set.** `READABLE_GEOMETRY_TYPES` becomes Polygon, MultiPolygon, Point, LineString, MultiLineString **[OPEN-1]**, in that order (`engine/src/geoarrow.rs:66-69 @ 0053ced0 sha256:HASH-TBD`).
- `GeometryKind` gains `Line`, and `kind_of` maps LineString and MultiLineString to it (`engine/src/geoarrow.rs:71-90 @ 0053ced0 sha256:HASH-TBD`).
- The gate and the text still read the one declaration (`engine/src/geoarrow.rs:97-104 @ 0053ced0 sha256:HASH-TBD`).

**E-L2. Admission** (`engine/src/geoarrow.rs:106-145 @ 0053ced0 sha256:HASH-TBD`). Matching stays case-insensitive. The checks run in this order:
1. `None` or `[]` gives `MultiPolygon`, unchanged.
2. Any member outside the readable set is refused with the sighted template, unchanged code (`state/consults/2026-09-24-multipolygon-assessment.md:206 @ 6030dfd2814b sha256:ddae06db5d61fa8f420f73843d5e900805bbb9eb26341f5a53effa571cdc4be3`, a sub-line span; the hash is the line's). Its readable-set clause now renders five types **[OPEN-1]**, **[OPEN-2]**.
3. Every member Point gives `Point`, unchanged.
4. Every member Polygon gives `Polygon`, unchanged.
5. Every member polygonal gives `MultiPolygon`, unchanged.
6. Every member LineString gives `GeometryEncoding::LineString`.
7. Every member lineal, with at least one MultiLineString, gives `GeometryEncoding::MultiLineString` **[OPEN-1]**.
8. Otherwise, a set mixing kinds is refused at open as `EngineError::GeoMetadata` (ADR-034 Decision 7; round 62, item 2, `state/directives/2026-10-06-round-62-rulings.md:7 @ 0053ced0 sha256:HASH-TBD`).
   - **[OPEN-2] (A):** `MIXED_KINDS_DRAFT` stays byte-identical (`engine/src/geoarrow.rs:92-95 @ 0053ced0 sha256:HASH-TBD`).
   - Its span naming the two kinds is replaced by the kinds present: in E-L1's kind order (polygonal, point, line), joined as `readable_set_phrase` joins.
   - So a polygonal-and-point set renders byte-identically to today's detail (A-P2 unchanged).
   - It is still a `[P6 placeholder]` and states engine facts only.
- The call site is unchanged (`engine/src/dataset.rs:368 @ 0053ced0 sha256:HASH-TBD`).

**E-L3. Accessors.**
- `GeometryEncoding` gains `LineString` and `MultiLineString` **[OPEN-1]**. `as_str()` gives `geoarrow.linestring` and `geoarrow.multilinestring` (`engine/src/geoarrow.rs:36-64 @ 0053ced0 sha256:HASH-TBD`).
- New `pub(crate)` constants `EXT_NAME_LINESTRING` and `EXT_NAME_MULTILINESTRING`.
- No other new `pub` item. New builders and validators are `pub(crate)`.
- The worker re-greps `kernel`, `protocol`, `renderer` and `frontends/shell/src-tauri` for an exhaustive match on `GeometryEncoding`. None exists at 0053ced0.

**E-L4. Row decode.** `engine/src/wkb.rs` gains:
- `pub(crate) LineStringBuilder`: one coordinate buffer and geometry offsets;
- **[OPEN-1]** `pub(crate) MultiLineStringBuilder`: geometry and part offsets.

Coordinate bits are carried through with no arithmetic (`engine/src/wkb.rs:20-21 @ 0053ced0 sha256:HASH-TBD`).
- **LineString encoding:** byte order, then type exactly 2 with no EWKB flag, then a position count, then the positions.
- **MultiLineString encoding [OPEN-1]:**
  - type 2 decodes as one part;
  - type 5 decodes each part with its own byte-order byte and its own type code, which must be exactly 2 with no EWKB flag.
- **Refused by name as `EngineError::Wkb`, each with `[P6 placeholder]` text naming what was met:**
  - EWKB flags, on the header or on a part;
  - any other type, ISO Z, M and ZM codes included;
  - a linestring or part with fewer than 2 positions: WKB's empty LineString (0), and a single position, refused under the strict-decode policy (`engine/src/wkb.rs:12-18 @ 0053ced0 sha256:HASH-TBD`) and acceptance item 5;
  - a MultiLineString with zero parts;
  - trailing bytes;
  - truncation.
- **No allocation from a WKB count.**
- **Every refusal** stops the stream at that row, skips nothing, and states no consequence.
- The other three builders are unchanged. Each still refuses type 2 (`engine/src/wkb.rs:72-109 @ 0053ced0 sha256:HASH-TBD`, `engine/src/wkb.rs:178-237 @ 0053ced0 sha256:HASH-TBD`, `engine/src/wkb.rs:274-307 @ 0053ced0 sha256:HASH-TBD`).
- The module doc names the new builders (`engine/src/wkb.rs:4-10 @ 0053ced0 sha256:HASH-TBD`).

**E-L5. Encoding.** `engine/src/geoarrow.rs` gains:
- the storage types:
  - `List<vertices: FixedSizeList<xy: Float64>[2]>`;
  - **[OPEN-1]** `List<linestrings: List<vertices: FixedSizeList<xy: Float64>[2]>>`;
- their builders, through `checked_offsets`;
- their structural validators;
- the `storage_type` and `validate_encoding` arms (`engine/src/geoarrow.rs:188-195 @ 0053ced0 sha256:HASH-TBD`, `engine/src/geoarrow.rs:505-512 @ 0053ced0 sha256:HASH-TBD`).

In `coordinate_values` (`engine/src/geoarrow.rs:356-406 @ 0053ced0 sha256:HASH-TBD`):
- a linestring arm, a list whose child is the fixed-size list, reads the vertex run between the slice's first and last geometry offsets;
- a multilinestring is walked by the existing two-level path, which reads it by shape;
- the doc says both.

**The multilinestring storage type is structurally identical to the polygon storage type.** Which one an array is, is decided only by the open's encoding, never by its shape (§8 item 21; I-8).

The other storage types, builders and validators are unchanged.

**E-L6. Envelope.** No code change.
- The key and the field are written from the encoding.
- `assemble` validates through E-L5 (`engine/src/envelope.rs:331 @ 0053ced0 sha256:HASH-TBD`).
- `xy_bounds` reads lines through `coordinate_values` (`engine/src/envelope.rs:377-398 @ 0053ced0 sha256:HASH-TBD`).

**E-L7. Stream.**
- `GeometryBuilder` gains the arms (`engine/src/stream.rs:2151-2191 @ 0053ced0 sha256:HASH-TBD`).
- **`estimate_bytes` is not edited** (`engine/src/stream.rs:2260-2273 @ 0053ced0 sha256:HASH-TBD`). Its doc gains one sentence:
  - for a linestring, the offsets are rows plus one, within its `(rows + vertices) * 4` term;
  - for a multilinestring, each part has at least 2 vertices, so parts are at most vertices divided by 2.
  - S-L3 asserts the bound.
- The per-row incoming estimate is unchanged. A linestring's WKB is 9 + 16n bytes, so `wkb.len() / 16` is at least n (`engine/src/stream.rs:1998-2004 @ 0053ced0 sha256:HASH-TBD`).

**E-L8. Module doc.** The encoding sentence names the new encodings (`engine/src/lib.rs:17-24 @ 0053ced0 sha256:HASH-TBD`).

**E-L9. Test support, behind the `fixture` feature,** on the `encode_point` precedent (`engine/src/fixture.rs:1285-1324 @ 0053ced0 sha256:HASH-TBD`):
- `encode_linestring`;
- **[OPEN-1]** `encode_multilinestring`;
- `line_l1` and its rows, with and without bounds for `GeometryMode::RowsWithBounds` (`engine/src/fixture.rs:500-513 @ 0053ced0 sha256:HASH-TBD`);
- **[OPEN-1]** `multilinestring_ml1` and its rows.

The default writer stays byte-identical, by G-1's fixture hash.

**E-L10. LOD.** `engine/src/lod.rs` is not edited. It refuses any feature but Polygon by name, and it already names LineString and MultiLineString (`engine/src/lod.rs:1554-1562 @ 0053ced0 sha256:HASH-TBD`, `engine/src/lod.rs:1656-1669 @ 0053ced0 sha256:HASH-TBD`). L-L pins it.

### Kernel

**K-L. No product change.**
- `describe_dataset` takes `encoding` from `as_str()` (`kernel/src/skp.rs:1928 @ 0053ced0 sha256:HASH-TBD`).
- K2 compares the encoding with the format's declared one, after the degrees check (`kernel/src/publish/mod.rs:472-498 @ 0053ced0 sha256:HASH-TBD`).
- A line dataset is described by its encoding and refused at publish as `publish.geometry_encoding_not_publishable`.

**Walkthrough fixtures,** as ignored generators in `kernel/tests/manual_walkthrough_fixtures.rs`. Each generator's doc names only the Part T row or the E2E step that uses it (the points gates' D-1).
- `generate_the_line_l1_fixture`: L-1, with a covering;
- **[OPEN-1]** `generate_the_multilinestring_ml1_fixture`: ML-1, with a covering;
- `generate_the_declared_geometrycollection_fixture`: P-1's rows, declared `["GeometryCollection"]`, for the sighted refusal;
- `generate_the_declared_polygon_and_linestring_fixture`, for the mixed-kind detail **[OPEN-2]**.

**One doc correction.** The doc of `generate_the_declared_linestring_fixture` (`kernel/tests/manual_walkthrough_fixtures.rs:294-312 @ 0053ced0 sha256:HASH-TBD`) states that the open is refused with the sighted template. From this cut that is false: the file opens as `geoarrow.linestring` and the stream stops at row 0 with `engine.wkb`. The doc is corrected to say so. The generator's code is not edited.

### Protocol

**W-L1.** The doc on `GeometryInfo.encoding` lists the values (`protocol/skp/src/v0/commands.rs:169-173 @ 0053ced0 sha256:HASH-TBD`). No field changes, and `deny_unknown_fields` stays.

**W-L2. The literal and its fixtures, in one commit** (`protocol/skp/SKP-V0.md:280-296 @ 0053ced0 sha256:HASH-TBD`, condition (iii)).
- **The number:** `skp/0.11`, the literal after main's at the final merge (`protocol/skp/src/v0/mod.rs:96-101 @ 0053ced0 sha256:HASH-TBD`). If an earlier merge forces another number, the closing record states it; this section is not amended.
- **Rust side and TS side together,** `frontends/shell/src/skp/types.ts` among them (`frontends/shell/src/skp/types.ts:15 @ 0053ced0 sha256:HASH-TBD`).
- **The version-refusal conformance fixture** is renumbered from `skp/0.11` to `skp/0.12`, by the `skp/0.10` entry's mechanics (`protocol/skp/SKP-V0.md:1031-1036 @ 0053ced0 sha256:HASH-TBD`).
- **`skp_version_is_skp_0_10` is renamed** to `skp_version_is_skp_0_11`. PL-5 names the rename.

**W-L3. SKP-V0.**
- §1's `geometry` line names the values (`protocol/skp/SKP-V0.md:71-73 @ 0053ced0 sha256:HASH-TBD`).
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

**SH-L1. Decode** (`frontends/shell/src/canvas/decodeBatch.ts:21-39 @ 0053ced0 sha256:HASH-TBD`, `frontends/shell/src/canvas/decodeBatch.ts:123-129 @ 0053ced0 sha256:HASH-TBD`, `frontends/shell/src/canvas/decodeBatch.ts:156-191 @ 0053ced0 sha256:HASH-TBD`).
- `ENCODING_LINESTRING` and **[OPEN-1]** `ENCODING_MULTILINESTRING`; the check accepts them.
- `GeometryKind` gains `line`, and `geometryKindOf` maps both line encodings to it.
- A linestring row decodes to one part holding one path, which is its positions in order. A multilinestring row decodes to one such part per linestring. `partToRow` takes a row per part.
- The decode branch is keyed on the batch's encoding string, never on its shape.
- `ResidentBatch`'s doc states the line shape, and its type is unchanged (`frontends/shell/src/canvas/decodeBatch.ts:68-102 @ 0053ced0 sha256:HASH-TBD`).
- `UnexpectedEncodingError` names the encodings read, as a `[P6 placeholder]` (`frontends/shell/src/canvas/decodeBatch.ts:41-61 @ 0053ced0 sha256:HASH-TBD`).

**SH-L2. Drawing.** `buildLayers` gains a `line` overload (`frontends/shell/src/canvas/buildLayers.ts:305-357 @ 0053ced0 sha256:HASH-TBD`). `checkPickCeiling(batch.partCount)` stays before the kind branch (`frontends/shell/src/canvas/buildLayers.ts:331 @ 0053ced0 sha256:HASH-TBD`).
- **Line, [OPEN-3] (A):**
  - one pickable `PathLayer` per batch, with id `layerId(batch)`;
  - data: one offset-relative path per part, in `partToRow`'s order, cached by batch identity and origin, under the polygon cache's rule (`frame.toLocal` in f64 before any narrowing; ADR-010 rule 3) (`frontends/shell/src/canvas/buildLayers.ts:188-216 @ 0053ced0 sha256:HASH-TBD` as precedent);
  - `CARTESIAN`, `widthUnits: pixels`, width `LINE_WIDTH_PX`, colour `draw.fillColor` (fill colour and opacity), `jointRounded` and `capRounded`.
- **The casing,** only when `outlineWidth > 0`:
  - a non-pickable `PathLayer` with id `${layerId(batch)}-casing`, placed before the line so that it draws beneath;
  - the same cached data;
  - width `LINE_WIDTH_PX + 2 × outlineWidth` pixels, in `draw.outlineColor`.
- **No `SolidPolygonLayer`.**
- **Polygonal and point:** the existing paths, unchanged.

**SH-L3. Picking.**
- `resolvePick` is unchanged (`frontends/shell/src/canvas/pick.ts:118-143 @ 0053ced0 sha256:HASH-TBD`): ordinal, then `partToRow`, then row, then id. The anchor is the first part's first vertex, so every part of one feature gives the same result.
- The ceiling counts line parts.
- `PickCeilingExceeded` names pick ordinals as polygon parts, points or line parts, as a `[P6 placeholder]` (`frontends/shell/src/canvas/limits.ts:63-79 @ 0053ced0 sha256:HASH-TBD`).
- `PICKING.md`'s parts sentence names lines (`frontends/shell/src/canvas/PICKING.md:16-23 @ 0053ced0 sha256:HASH-TBD`).

**SH-L4. Pick tolerance [OPEN-4] (A).**
- `pickResolution.ts` gains `LINE_PICK_RADIUS_PX = 4` (CSS pixels) and a pure `pickingRadiusFor(kind)`. It returns that value for `line` and `undefined` otherwise.
- `WorkingCanvas` reads it from `geometryKindRef`, at two sites:
  - `Deck`'s construction, where the prop is set only when the value is defined (`frontends/shell/src/canvas/WorkingCanvas.tsx:1900-1911 @ 0053ced0 sha256:HASH-TBD`);
  - the settle re-pick's `pickObject`, which is passed `radius` only when the value is defined (`frontends/shell/src/canvas/WorkingCanvas.tsx:1179-1190 @ 0053ced0 sha256:HASH-TBD`). That comment's sentence saying the radius is unchanged is corrected.
- For a polygonal or point open neither site changes: `pickingRadius` stays unset, as round 62, item 4 has it for points.
- **The pick-resolution rule is ADR-028 item 4 as written.** `pickResolutionExtentFor` already returns `averageFeatureExtent` for any kind but `point` (`frontends/shell/src/canvas/pickResolution.ts:165-173 @ 0053ced0 sha256:HASH-TBD`). Its doc names lines. The 9 px threshold is unchanged (`frontends/shell/src/canvas/pickResolution.ts:81 @ 0053ced0 sha256:HASH-TBD`).

**SH-L5. Styling [OPEN-3] (A).**
- The resolved polygon draw parameters map onto the line symbol as rendering plumbing in the working canvas only (ADR-022 Decision 4, read as round 62, item 3 reads it, `state/directives/2026-10-06-round-62-rulings.md:8 @ 0053ced0 sha256:HASH-TBD`).
- `LINE_WIDTH_PX = 2` (CSS pixels) is declared in `buildLayers.ts`, beside `POINT_RADIUS_PX` (`frontends/shell/src/canvas/buildLayers.ts:179-186 @ 0053ced0 sha256:HASH-TBD`).
- `toStyleDocument` still writes `polygon`, and the style panel is unchanged.

**SH-L6. Describe display.** No change.

**SH-L7. `MAX_RESIDENT_VERTICES`' comment** discloses the per-line part arrays, and the casing's second copy of each vertex on the GPU, as unmeasured costs (`frontends/shell/src/canvas/limits.ts:28-61 @ 0053ced0 sha256:HASH-TBD`).

**O6.** No attribute lookup, callback or row accessor is added. `b1-shell-half` lands later and writes against `partToRow`.

### Viewer

No product change. The viewer refuses any encoding but polygon (`renderer/bundle-viewer/src/partition.ts:123-127 @ 0053ced0 sha256:HASH-TBD`). V-T-L pins it for both line encodings.

### Portability

The feature is not OS-dependent, so R3's section is not required.
- **R1:** decode and selection are pure.
- **R2 and R4:** no `cfg` in product code and no path literal.
- **R5:** no level claim.
- **R6:** one kind of ignore, not new: L-L takes the LOD boundary's `cfg_attr(not(windows), ignore = …)` precedent (`engine/tests/lod_tier_builder.rs:1571-1575 @ 0053ced0 sha256:HASH-TBD`). The walkthrough generators are plain ignores.

### KNOWN-LIMITATIONS

All edits are current-state edits in place. Each is a draft for the human's P6 sight, with a source comment.
- **Item 31** (`KNOWN-LIMITATIONS.md:335-337 @ 0053ced0 sha256:HASH-TBD`):
  - this build also reads LineString and **[OPEN-1]** MultiLineString;
  - a set mixing any two of the polygonal, point and line kinds is refused at open **[OPEN-2]**;
  - a line with fewer than two positions stops the stream;
  - a line row under an empty or absent declaration stops the stream;
  - the sentence listing what the refusal covers no longer names a line.
- **Item 32** (`KNOWN-LIMITATIONS.md:339-341 @ 0053ced0 sha256:HASH-TBD`): line datasets are refused at publish.
- **Item 33** (`KNOWN-LIMITATIONS.md:343-345 @ 0053ced0 sha256:HASH-TBD`): the tier builder refuses line features by name.
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
  - **Declared limits:** item 34 is removed. The line lists only the limits caused by engine code, and item 34 is caused by the shell's `buildLayers` (the points gates' noticed item 3, both reports) (`engine/README.md:521 @ 0053ced0 sha256:HASH-TBD`).
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

**A dated note** is appended under Part P (points)'s result log, not edited into P7 (`frontends/shell/MANUAL-WALKTHROUGH.md:1638 @ 0053ced0 sha256:HASH-TBD`). It says that from this cut's merge:
- P7(a) uses `declared-geometrycollection.parquet`;
- the readable-set clause names five types;
- Part T's T6 carries the rest.

**The E2E step LN'** is appended to `frontends/shell/e2e/regression.mjs` beside PT' (`frontends/shell/e2e/regression.mjs:2500-2501 @ 0053ced0 sha256:HASH-TBD`). MP' and PT' are not edited.

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
| A-1, A-2, A-3, A-P1 (changed) | same | F-6 and F-7a re-pointed to `GeometryCollection`; the expected texts render five types; A-3's member loop opens L-1 and ML-1 rows for the line members (`engine/tests/geometry_admission.rs:86-335 @ 0053ced0 sha256:HASH-TBD`) | as recorded; the reviewer re-observes each |
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
| SH-2 (changed) | same | the unknown-value case uses `geoarrow.geometrycollection`; a line batch under a polygon expectation throws (`frontends/shell/src/canvas/decodeBatch.test.ts:167-195 @ 0053ced0 sha256:HASH-TBD`) | as recorded |
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

**Suites, green before either gate.** Heavy runs follow the machine paragraph, `state/directives/2026-10-06-machine-script-adopted.md:12-22 @ 0053ced0 sha256:HASH-TBD`, carried in the worker's, tester's and reviewer's briefs. No other rule for running builds applies.
- `cargo test --workspace --locked --features spatial-engine/fixture`;
- `cargo fmt --all --check`;
- `cargo clippy --workspace --all-targets --locked --features spatial-engine/fixture`, read as the points form's Amendment 2, item 7 reads it: no new warning on an added line, not `-D warnings`;
- the `src-tauri` tests;
- the shell's unit suite and type check;
- the viewer's `node --test`;
- `node --test scripts/plan/*.test.mjs scripts/hooks/*.test.mjs scripts/evidence/*.test.mjs`;
- `verify.mjs`, `queue --check`, `site --check`, `verify-cites`, `verify-quotes` (a floor) and `verify-test-claims`;
- CI green at the reviewed commit.

**Proportional gates.** The product-first direction's section 2 applies, by reference (`state/directives/2026-10-05-product-first-direction.md:15 @ 0053ced0 sha256:HASH-TBD`).

**Operator.**
- Part T is queued for the same sitting as MP-1's Part S and the points cut's Part P, both still unrun (`engine/GEOMETRY-POINTS-PREREGISTRATION.md:713 @ 0053ced0 sha256:HASH-TBD`).
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
````

## 3. The OPEN items

**OPEN-1: is MultiLineString in scope?**
- **Options:**
  - (A) LineString and MultiLineString.
  - (B) LineString only, as points took Point only.
- **Recommendation: (A).**
  - The multi-part machinery (`partToRow`, a ceiling counted in parts, the first-part anchor) is on main from MP-1, so the extra cost is one builder, one storage type and one shell decode branch.
  - Real line files often declare `["LineString","MultiLineString"]`, for example when GeoPandas reads a shapefile. Under (B) every such file is refused at open.
- **Red line:** yes under (A), because it admits a type beyond the placed node's name (user-visible behaviour not already ruled). Not under (B).
- **What waits:** dispatch, commit 1.

**OPEN-2: the refusal wording.**
- **Options:**
  - (A) Keep the sighted template, with its clause rendering five types (four under (B)). For mixed kinds, keep `MIXED_KINDS_DRAFT` byte-identical and substitute the kinds actually present for the draft's two kind names, so that a polygonal-and-point set reads exactly as today.
  - (B) A separate placeholder for each pair of kinds.
  - (C) Keep the ruled draft unchanged for every mix. That would state a false engine fact for a line mix.
- **Recommendation: (A).**
- **Red line:** yes. Round 62 asked the human for its wording, and ADR-034 says each cut puts its refusal wording to the human.
- **What waits:** the PR's ready state. The code is drafted as (A) from dispatch. Every new output is a P6 placeholder, sighted at P6.

**OPEN-3: the line symbol and its width.**
- **Options:**
  - (A) The line takes the fill colour and opacity, at a fixed `LINE_WIDTH_PX` = 2 CSS px, with rounded joins and caps. An outline width above 0 adds a non-pickable casing beneath it, in the outline colour, of width 2 + 2 × outline. Round 62, item 3's reading of ADR-022 Decision 4 applies to lines: the mapping is rendering plumbing, the document still says polygon, and nothing saves a line layer's style document.
  - (B) As (A), with no casing: the outline has no effect on lines.
  - (C) The line takes the outline colour and width, with a floor. The default outline width is 0 (`DEFAULT_STYLE_STATE`), so lines would be invisible by default without the floor.
- **Recommendation: (A).** Every style control then does something visible on every kind, in parallel with the points' stroke.
- **Red line:** yes.
- **What waits:** commit 4 (the shell).

**OPEN-4: the pick tolerance.**
- **Options:**
  - (A) `LINE_PICK_RADIUS_PX` = 4 CSS px, for line opens only. It is set at deck's hover `pickingRadius` and at the settle re-pick's `pickObject` `radius`. Polygonal and point opens are unchanged, and round 62's unset `pickingRadius` stands for them.
  - (B) No tolerance: the hover must land on the line's 2 px.
  - (C) No tolerance, and a wider line instead.
- **Recommendation: (A).** A 2 px line with ±4 px gives a target about as wide as the 9 px threshold's human-aiming basis.
- **Red line:** yes.
- **What waits:** commit 4.
- **Carried with it, no new ruling:** the 9 px refusal compares the average line extent (ADR-028 item 4 as written). Part T's T2 records whether naming the topmost of two crossing lines is acceptable.

**OPEN-5: measure docs/08's Lines class?**
- docs/08 defines Lines as 1M features and 10M vertices.
- **Options:**
  - (A) No. Make no performance claim, and record the proposed node `lines-class-budget-measurement`.
  - (B) Yes, in this cut: a scale fixture and an operator-run harness row.
- **Recommendation: (A).** docs/08's own note says its budgets are not CI-enforced, and this cut's value is admission and drawing.
- **Red line:** not under (A). (B) is a scope addition the human must rule. No docs/08 row changes under either option.
- **What waits:** dispatch, under (B) only.

**Not OPEN, for the custodian to record:** three proposed nodes, for placement after the freeze or at the human's call.
- `shell-owners-index`: the routed item's remainder;
- `corpus-line-files`: no corpus file declares a line type;
- `lines-class-budget-measurement`: under OPEN-5 (A).

## 4. Files read

- `C:\dev\spatial-ide\docs\adr\ADR-034-geometry-type-admission-and-geoarrow-encoding-selection.md`
- `C:\dev\spatial-ide\state\directives\2026-10-05-adr-034-acceptance.md`
- `C:\dev\spatial-ide\engine\GEOMETRY-POINTS-PREREGISTRATION.md` (whole)
- `C:\dev\spatial-ide\state\consults\gates\2026-10-07-geometry-points-cut-gate1-architect.md`
- `C:\dev\spatial-ide\state\consults\gates\2026-10-07-geometry-points-cut-gate1-reviewer.md`
- `C:\dev\spatial-ide\state\directives\2026-10-06-round-62-rulings.md`
- `C:\dev\spatial-ide\engine\MULTIPOLYGON-MP1-PREREGISTRATION.md` (the Header to §9, and Amendment 6)
- `C:\dev\spatial-ide\state\directives\2026-10-05-product-first-direction.md`
- `C:\dev\spatial-ide\PLAN.yaml` (the nodes `geometry-lines-cut`, `geometry-points-cut`, `geometry-types-beyond-polygons` and `briefb-b2-save-reopen`)
- `C:\dev\spatial-ide\docs\PREREGISTRATION-TEMPLATE.md`
- `C:\dev\spatial-ide\AUTONOMY.md` (§21 to §22 and §25)
- `C:\dev\spatial-ide\AI_DEVELOPMENT.md` (§B's red lines)
- `C:\dev\spatial-ide\docs\08_Testing.md` (lines 1 to 60)
- `C:\dev\spatial-ide\KNOWN-LIMITATIONS.md` (items 9 and 31 to 36, and the section header)
- `C:\dev\spatial-ide\state\directives\PORTABILITY-2026-09-30.md`
- `C:\dev\spatial-ide\state\directives\2026-10-06-machine-script-adopted.md`
- `C:\dev\spatial-ide\engine\src\geoarrow.rs`, `wkb.rs`, `stream.rs` (the builder, the estimate and the incoming estimate), `envelope.rs` (lines 280 to 404), `lib.rs`, `fixture.rs` (the modes and the helpers), `lod.rs` (the refusal), and `dataset.rs` (the call site)
- `C:\dev\spatial-ide\engine\tests\geometry_admission.rs`, `geoarrow_batch_fixtures.rs` (its test names), `lod_tier_builder.rs` (L-P)
- `C:\dev\spatial-ide\engine\compat-corpus\of-record\MANIFEST.json` (`geometry_types` entries), `C:\dev\spatial-ide\engine\ADMISSION-RESULTS.md` (its header and rows)
- `C:\dev\spatial-ide\engine\README.md` and `C:\dev\spatial-ide\kernel\README.md` (the owner's indexes)
- `C:\dev\spatial-ide\kernel\src\publish\mod.rs` (K2), `kernel\src\skp.rs` (`describe`), `kernel\tests\manual_walkthrough_fixtures.rs` (by grep)
- `C:\dev\spatial-ide\protocol\skp\SKP-V0.md` (§1's `describe`, §4 item 13, and §8's `skp/0.10`), `protocol\skp\src\v0\commands.rs`, `protocol\skp\src\v0\mod.rs`
- `C:\dev\spatial-ide\frontends\shell\src\canvas\decodeBatch.ts`, `buildLayers.ts`, `pick.ts`, `pickResolution.ts`, `limits.ts`, `WorkingCanvas.tsx` (the kind, the render, the settle pick, `Deck` and `onHover`), `PICKING.md`, `decodeBatch.test.ts` (SH-2), and `src\style\document.ts`
- `C:\dev\spatial-ide\frontends\shell\MANUAL-WALKTHROUGH.md` (Part S, Part P (points), and the Part letters), `frontends\shell\e2e\regression.mjs` (MP', PT' and `runStep`)
- `C:\dev\spatial-ide\renderer\bundle-viewer\src\partition.ts` (the encoding check)
- Evidence only, untracked: `C:\dev\spatial-ide\frontends\shell\node_modules\@deck.gl\layers\dist\path-layer\path-layer.js`, `C:\dev\spatial-ide\frontends\shell\node_modules\@deck.gl\core\dist\lib\deck.js`, and `frontends\shell\package-lock.json` (the 9.3.9 lines)

**One correction to make before filing.** In the draft's vertical-cut table, the row-decode cell for `MultiLineStringBuilder` contains the stub text "types 2 and 6... see E-L4 for the exact codes". Six is the wrong code, because WKB MultiLineString is type 5. Remove the parenthetical so the cell reads only `MultiLineStringBuilder` **[OPEN-1]**; the exact codes are stated once, in the line under the table and in E-L4.
