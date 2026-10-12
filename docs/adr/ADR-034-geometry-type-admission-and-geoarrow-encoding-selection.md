# ADR-034 — Geometry type admission and GeoArrow encoding selection

**Status:** Accepted 2026-10-05 — on the human's word, as merged, and architect-blockable as of acceptance (`state/directives/2026-10-05-adr-034-acceptance.md`, with its RULED 2026-10-05 block in `DECISIONS-PENDING.md`). The human's answers to the items put at acceptance are recorded in the Acceptance section at the end. Filed Proposed 2026-09-27 on the human's ruling (`DECISIONS-PENDING.md`, RULED 2026-09-24 — question round 17, item 7; entry 126). MP-1's preregistration may now be written. The ruling's two riders bind MP-1's preregistration (PLAN node `geometry-types-beyond-polygons`) through the ruling itself.
**Drafted by:** the architect agent on the custodian's brief, reconciling its own skeleton (`state/consults/2026-09-24-multipolygon-assessment.md` §4) with that assessment's §5 decisions as ruled and the ruling's two riders; redrafted after its first and second full gates (attempts 1 and 2) for PLAN node `geometry-types-beyond-polygons`. Every tree claim below was read at main `0ada14f`.
**Related:** `docs/01` principles 7 and 8 · `docs/02` · `docs/08_Testing.md` · `docs/10` · ADR-004 · ADR-006 · ADR-010 rules 1, 2 and 6 · ADR-016 §5, §6 and §7 · ADR-017 §3 and §4 (Accepted; not amended here) · `protocol/skp/SKP-V0.md` §1 (`describe`), §4 item 13, §5, §8 · `engine/LOD-PREREGISTRATION.md` · `engine/ADMISSION-RESULTS.md` · `engine/compat-corpus/of-record/MANIFEST.json` · RULED 2026-09-24 (night) item (2) · RULED 2026-09-24 — question round 17, items 3 and 7 · the 2026-09-27 session order, its MultiPolygon paragraph and its holds.

## Context

The engine admits Polygon only, and the assumption is spread across three wires: the data-plane envelope, SKP `describe`, and the bundle partition schema.

- **Admission.** `Dataset::open` (`engine/src/dataset.rs`) admits a `geometry_types` that is empty or all `Polygon`, compared case-insensitively. It refuses anything else by name: `EngineError::GeoMetadata`, which reaches the wire as `engine.geo_metadata` under `SKP-V0.md` §5's variant-name rule. The refusal text states that the slice reads polygons only.
- **Row decode.** `PolygonBuilder::push_wkb` (`engine/src/wkb.rs`) accepts WKB type 3 only. The stream builder (`engine/src/stream.rs`) calls it with `?`. A dataset admitted with an empty `geometry_types` therefore fails its stream, by name (`EngineError::Wkb`), at the first row that is not a Polygon.
- **Encoding is a constant.**
  - `EXT_NAME_POLYGON`, `geometry_field` and `validate_polygon_encoding` live in `engine/src/geoarrow.rs`.
  - The envelope's `geometry_encoding` key is written from `EXT_NAME_POLYGON` (`engine/src/envelope.rs`).
  - `describe_dataset` (`kernel/src/skp.rs`) hard-codes `geoarrow.polygon` into `GeometryInfo.encoding`. `GeometryInfo`'s doc comment (`protocol/skp/src/v0/commands.rs`) and `SKP-V0.md` §1's `describe` block both state it as the only value.
  - The shell displays it (`frontends/shell/src/admission/DescribeSummary.tsx`).
- **Consumers.**
  - The shell's `decodeBatch` (`frontends/shell/src/canvas/decodeBatch.ts`) checks the envelope's `frame` and never checks `geometry_encoding`.
  - The viewer refuses a mismatched encoding (`EXPECTED_ENCODING`, `renderer/bundle-viewer/src/partition.ts`).
  - `kernel/examples/verify-bundle.rs` accepts any `geoarrow.*` value.
  - The publish manifest's encoding is hard-coded (`format_declaration`, `kernel/src/publish/mod.rs`).
- **Declared lists in the tree.**
  - Every `geometry_types` the engine tree writes declares Polygon. The writers are `engine/src/fixture.rs`, `engine/src/geoparquet.rs`, `engine/src/lod.rs`, and the engine tests `lod_tier_builder`, `lod_tier_preflight` and `publish_stream`.
  - The corpus manifest (`engine/compat-corpus/of-record/MANIFEST.json`) records no empty `geometry_types` for any file.
- **LOD.** `engine/src/lod.rs` refuses any feature that is not a Polygon, by name. `build_tiers` has no product caller: `kernel/src/skp.rs` records that nothing on the control plane calls it.
- **The corpus.** The P4 run (`engine/ADMISSION-RESULTS.md`) records 5 of 12 files refused on geometry type.
  - #2, #4 and #5 are Point files.
  - #11 and #12 declare mixed Polygon and MultiPolygon columns.
- **Points and lines** follow as their own cuts (PLAN nodes `geometry-points-cut`, `geometry-lines-cut`). Encoding selection, mixed columns, an empty `geometry_types`, one row per feature and the refusal wording need one rule, not one per cut.

## The ruling

The human ruled all eight of the assessment's §5 decisions as recommended, sighted decision 4's wording as proposed, and added two riders: one on decision 3 and one on decision 1's promotion. The human's typed answer, byte-copied by script from that item and marked so:

*"All eight as recommended, and decision 4's wording sighted as proposed. Rider on decision 3: a column with an empty geometry_types admits under the MultiPolygon encoding, but any row of a type the engine does not read is refused by name or counted as unread and shown, never silently dropped. Decision 1's promotion of Polygon rows is declared as an encoding in describe (decision 6's declared_types), never presented as the file's own type."*

Decision 4's wording, as sighted, byte-copied by script from the assessment's §5 item 4 and marked so; the span is part of one line and carries that line's hash:
`state/consults/2026-09-24-multipolygon-assessment.md:206 @ 6030dfd2814b sha256:ddae06db5d61fa8f420f73843d5e900805bbb9eb26341f5a53effa571cdc4be3`

*"geometry_types [...] include types this engine does not read; it reads Polygon and MultiPolygon"*

*This ADR's reading of that wording:* it is the `EngineError::GeoMetadata` detail. The variant's `Display` prefix is unchanged. The bracketed placeholder stands for the declared list, rendered as today's message renders it.

## Decision

1. **The readable type set is declared per engine release.**
   - After MP-1 it is {Polygon, MultiPolygon}.
   - It is one declaration in the engine. The admission gate and the refusal text (point 7) both read it, so the text can never state a set the gate does not admit.
   - The declaration's form is MP-1's to choose.

2. **The encoding is fixed at open from the declared `geometry_types`** (decisions 2 and 3):
   - a declared set equal to {Polygon} gives `geoarrow.polygon`, byte-identical to today;
   - a non-empty declared set within the readable set that includes MultiPolygon gives `geoarrow.multipolygon` (`List<List<List<FixedSizeList<Float64>[2]>>>`);
   - an empty `geometry_types` gives `geoarrow.multipolygon`, even when every row is a Polygon;
   - a declared set with any member outside the readable set is refused at open (point 7).

   The encoding is a fact of the open. The envelope, `describe` and every batch carry the same value, and it never varies per batch or per stream.

3. **Promotion is declared as an encoding, never as the file's type** (decision 1 and its rider; decision 6).
   - Under the multipolygon encoding, a Polygon row becomes a one-part MultiPolygon. Its coordinate bit patterns are carried through with no arithmetic, as `engine/src/wkb.rs` does today.
   - `describe` gains `declared_types`. It carries the file's `geometry_types` as declared and in declared order, with an empty list kept empty. It is a source fact beside `encoding`, which is the engine's fact.
   - For each open, those two `describe` facts are the promotion's inspectable record (`docs/01` principle 8). How principle 8's logging requirement is met for the promotion is open item O7.
   - By the rider (paraphrase), no surface presents the promotion as the file's own type. This covers `describe`, the envelope, the shell's display and operator text. Where both facts are shown, each is labelled as what it is. The labels' wording is the shell's, as the owner, and is fixed in MP-1's preregistration (O3).

4. **A row of a type the engine does not read is never silently dropped** (decision 3's rider).
   - Under an empty `geometry_types`, such a row takes one of the two treatments the rider allows:
     - (a) it is refused by name; or
     - (b) it is counted as unread, and the count is shown.
   - **The ruling does not choose between (a) and (b), and neither does this ADR. MP-1's preregistration chooses (open item O1).**
   - Either treatment is bound by rules already in force:
     - Under (a), the refusal is a typed engine refusal stating the engine fact: the type met and the readable set.
     - Under (b), a count shown on `describe` has to be a fact open already established, because `describe` runs no new query (`SKP-V0.md` §1, `describe`). A whole-column count at open is an operation under `docs/01` principle 7, with no `docs/08` figure. Under (b), no row count or extent may imply that every row is drawn.
   - Today's refusal text for a non-Polygon row (`PolygonBuilder::push_wkb`) states a readable set that becomes false under MP-1. Its new wording, and whether the human sights it, are open item O4.

5. **One wire row per feature, always.**
   - Parts never become rows.
   - The rule rests on ADR-016 §5 (uniqueness verified over the emitted identity) and ADR-010 rule 2 (GPU ordinal → stable id → authoritative f64).
   - Rows split per part would reach the shell as repeated ids. `TileResidentSet.addBatch` (`frontends/shell/src/canvas/tileResidentSet.ts`) checks each id only against ids already resident.
     - Repeats within one batch are therefore all admitted under one id.
     - A repeat arriving later, from the same tile or another, is dropped and counted in `duplicatesDropped`, like any duplicate.
     - Either way, the id no longer names one row.

6. **Picking goes through a part-to-row map** (ADR-010 rules 2 and 6; followed, not amended).
   - `resolvePick` (`frontends/shell/src/canvas/pick.ts`) uses the GPU ordinal as the row index today.
   - *Premise, pending open item O5:* one deck.gl datum is one polygon, so a pick ordinal names a part. Under that premise:
     - a GPU ordinal resolves ordinal → part → row → id;
     - the pick ceiling is counted in parts. Two product sites call `checkPickCeiling(batch.ids.length)`, which counts features: `buildLayers` (`frontends/shell/src/canvas/buildLayers.ts`) and `ResidentSet.addBatch` (`frontends/shell/src/canvas/residentSet.ts`). Both undercount once features have several parts, and either one left unchanged is a defect by name.
   - If O5 finds the premise false, the map and the ceiling are keyed on whatever unit the installed version picks by.
   - A feature's extent is the union over its parts. A re-pick that lands on another part of the same feature confirms the same id, so one feature gives one hover.
   - Every per-row lookup, attribute columns included, takes its row from the same map (see O6 for the seam).

7. **A declared type outside the readable set is refused at open, by name.**
   - It is the same variant, `engine.geo_metadata`, with decision 4's sighted wording.
   - The text states engine facts only: the declared types and the readable set. It states no consequence belonging to another module.
   - A declared set that mixes kinds, such as Polygon with LineString, is refused under this point until a later decision covers it.

8. **Wire and version.**
   - The second encoding value and `declared_types` go on one SKP literal. MP-1 takes the literal after B1's, by merge order (decision 6; RULED 2026-09-24 (night) item (2)). No literal number is written here.
   - `GeometryInfo` is `deny_unknown_fields`, and `SKP-V0.md` §4 item 13 applies:
     - any field change is a new version string;
     - a version is assembled across several commits only under all four of the item's conditions. Among them, (ii) records every addition in that version's own §8 entry before merge, (iii) puts both-side fixtures in the same commit as each addition, and (iv) freezes the version at merge.
   - ADR-010 rule 1's tag is the envelope's `frame`, and it is unchanged. `geometry_encoding` is a sibling envelope key, so no reading of rule 1 is enlarged (compare ADR-016 §6's caution).
   - On the data plane, the multipolygon encoding adds one offsets buffer and no coordinate copy (ADR-004, copy-minimized). No cost is claimed.
   - The control plane carries no bulk data.

9. **Operation class.**
   - Admission, promotion and `describe` are ADR-006 class 1.
   - Point 10's refusal fires at preflight, before any external side effect. Nothing is called undoable.

10. **Publishing refuses the multipolygon encoding until the bundle format carries it** (decision 5).
    - The kernel's publish preflight refuses a multipolygon-encoded dataset by name, before the pin. That places it in `preflight_pinless_parts` (`kernel/src/publish/mod.rs`), like the geographic refusal there.
    - The refusal is owned by the format: it states what a version-1 bundle cannot carry. This follows the pattern round 17 item 3 set, in which the bundle check is format-owned (paraphrase).
    - ADR-017 §4 stays byte-identical. `format_declaration`'s value stays true.

## Consequences

- **Datasets declaring exactly Polygon.**
  - Their stream IPC bytes and published partition hashes are unchanged. The engine's fixtures declare exactly Polygon. MP-1 preregisters the proof over the existing fixtures, which keeps every `docs/08` measurement and the shell E2E's encoding expectation valid.
  - The `describe` response gains one member for every dataset.
- **Undeclared Polygon-only datasets.**
  - A dataset whose `geometry_types` is empty now gets `geoarrow.multipolygon` (point 2), even when every row is a Polygon. Its stream IPC bytes change.
  - A projected dataset of that kind publishes today, because `preflight_pinless_parts` reads no geometry type. Point 10 refuses it until B3. That is a real loss for any user file with an empty list, and a KNOWN-LIMITATIONS row names it.
  - At `0ada14f`, no corpus file and no engine writer declares an empty list (Context, "Declared lists in the tree"), so no measured, fixture or corpus result changes. MP-1's P4 generator re-run confirms it.
- **The shell must check `geometry_encoding` before any engine emits a second value.**
  - `decodeBatch` checks `frame` only. A multipolygon batch would be walked one nesting level short, misread, with no error raised.
  - MP-1 adds the check. The shell's internal shape is MP-1's to choose; the assessment recommends one shape, parts then rings, per feature.
- **The viewer and the bundle verifier.** The viewer already refuses a foreign encoding. `verify-bundle.rs`'s `geoarrow.*` check is weaker than the viewer's and is MP-2's to align.
- **Publishing (decision 5).**
  - The multipolygon partition schema is MP-2's. It rides Brief B stage B3's bundle version 2 (PLAN node `briefb-b3-publish-v2`), through whatever instrument B3's preregistration puts to the human.
  - This ADR does not amend ADR-017.
  - Corpus #11 and #12 are degree datasets, which `GeographicCrsNotPublishable` already refuses, so refusing them again under point 10 loses nothing.
  - The loss that does occur is the undeclared projected Polygon-only case above.
  - A KNOWN-LIMITATIONS row names the refusal.
- **LOD stays out (decision 7).**
  - The by-name refusal in `engine/src/lod.rs` stands. `build_tiers` has no product caller.
  - Widening LOD rides `lod-tier-selection`'s preregistration, under `engine/LOD-PREREGISTRATION.md`.
  - A KNOWN-LIMITATIONS row names the refusal.
- **Points and lines inherit the rule.** `geometry-points-cut` and `geometry-lines-cut` inherit:
  - an encoding fixed at open from the declared types;
  - `declared_types` as the source fact, with any promotion declared as an encoding;
  - no silent drop of a row;
  - one row per feature;
  - picking through a part-to-row map wherever a kind is multi-part;
  - a refusal stating the readable set;
  - every consumer checking the encoding before a new value is emitted;
  - a publish refusal until the bundle format carries the kind.

  Each cut widens the readable set by its own preregistration and literal, and puts its own refusal wording to the human.
- **`docs/08`.**
  - No performance claim is made. `docs/08` defines no multipart dataset class.
  - The shell's per-part arrays are an unmeasured heap cost, and MP-1 discloses it.
  - The stream's row-size bound (`wkb.len() / 16`, `engine/src/stream.rs`) does not count per-part offsets, and MP-1 declares them.
- **The corpus.** Refusals on geometry type go from 5 to 3. #11 and #12 reach the CRS rules, and the three Point files wait for `geometry-points-cut`.

## What this ADR does not decide

Open items for MP-1's preregistration:
- **O1.** The choice between treatment (a) and treatment (b), and the surface where (b)'s count is shown.
- **O2.** Whether a row that contradicts a non-empty declaration takes the same treatment. Examples are a MultiPolygon row under `[Polygon]`, or a Point row under `[Polygon, MultiPolygon]`.
- **O3.** `declared_types`' exact placement and wire form within `describe`, and the shell's labels for `encoding` and `declared_types`.
- **O4.** The new WKB-level refusal wording (`PolygonBuilder::push_wkb`), and whether it goes to the human's sight. Round 17 item 7 sighted only the `engine.geo_metadata` wording.
- **O5.** Verifying against the installed `@deck.gl/layers` that one datum is one polygon, which is Decision 6's premise for counting pick ordinals as parts.
- **O6.** The attribute seam.
  - No shell attribute lookup exists at `0ada14f`, and B1's shell half (PLAN node `b1-shell-half`) is held by the 2026-09-27 session order (its holds; paraphrase).
  - Of MP-1 and B1's shell half, whichever lands second writes its seam against the other's merged interface, never an imagined one, and proves it end to end.
- **O7.** How `docs/01` principle 8's logging requirement is met for the promotion: whether `describe`'s `encoding` and `declared_types` discharge it, or a separate log entry is needed.
- **O8.** The shell's internal shape and rendering internals (Consequences).

Not decided here:
- Whether type matching stays case-insensitive.
- Types with Z or M.
- Mixed-kind columns.
- The multipolygon partition schema (MP-2 and B3).
- LOD widening (`lod-tier-selection`).
- The SKP literal's number.

## For the human, at acceptance

- **Decision 5's basis.**
  - The assessment's §5 recommended decision 5 on grounds including that nothing publishable is lost today, and decision 3 on the ground that no corpus or fixture file declares an empty list (paraphrase of its items 3 and 5).
  - At `0ada14f` the second ground holds for the corpus and the engine's writers (Context, "Declared lists in the tree").
  - Under the rider and point 10, a user's projected, Polygon-only file with an empty `geometry_types` publishes today and is refused until B3 (Consequences, "Undeclared Polygon-only datasets").
- **Timing.** The Status line reads the 2026-09-27 session order as setting acceptance earlier than decision 8's recommended timing. The human confirms or corrects that reading.
- **ADR-016 cite.** Decision 5 cites ADR-016 §5 for uniqueness. The skeleton cited ADR-016 §7, which states the identity's width.
- **Placeholder.** The Decision reads decision 4's bracketed placeholder as the declared list, rendered as today's message renders it.
- **Blockability.** Whether acceptance makes this ADR architect-blockable is the human's to say. ADR-016 recorded the answer at acceptance; ADR-028 recorded that it was not raised.
- **Open items.** O1 to O8 are open for MP-1's preregistration and are not settled here.

## Acceptance (2026-10-05)

*Recorded by the custodian in the acceptance commit, from `state/directives/2026-10-05-adr-034-acceptance.md`, lines 6-13 (their sha256 f3a8c75f9833edef2853331bd70118b460774b26ceb849d44b7f7587984c9485 at the commit that adds it), referenced by item and not restated as a quotation. Nothing below is a quotation. The Decision above is accepted as merged; nothing in it is changed.*

- **Blockability:** architect-blockable as of acceptance (the directive's opening line).
- **Decision 5's basis** (item 1): the human accepts the loss the ADR names (Consequences, "Undeclared Polygon-only datasets"), and a KNOWN-LIMITATIONS row names it.
- **Timing** (item 2): the Status line's reading of the 2026-09-27 session order is confirmed. Acceptance comes before MP-1's preregistration.
- **ADR-016 cite** (item 3): §5, as the Decision has it.
- **Placeholder** (item 4): read as the declared list, rendered as today's message renders it, as the Decision reads it.
- **O1 and O2** (item 5): ruled for MP-1 by that item, which keeps today's refusal by name. Counting a row as unread stays open for a later cut.
- **O3 to O8** (item 6): open for MP-1's preregistration. New operator wording ships as a P6 placeholder and is the human's at P6.
- **MP-1's preregistration** may be written now (the directive's closing line).

**The human's words, verbatim.** Appended under this section on the human's clarification of 2026-10-05 (`state/directives/2026-10-05-product-first-clarification.md`), the bullets above staying as they are. The note opening this section, that nothing below it is a quotation, covers those bullets; the block below is the quotation. Byte-copied by script from `state/directives/2026-10-05-adr-034-acceptance.md:6-13 @ a1109023445211651627541a0c1f637690fe2f1d sha256:f3a8c75f9833edef2853331bd70118b460774b26ceb849d44b7f7587984c9485`; the fence lines are not part of the words.

```text
ADR-034: accepted as merged, and architect-blockable as of acceptance. On what it puts to me:
1. Decision 5's basis: I accept the loss it names. A projected, Polygon-only file with an empty geometry_types publishes today and is refused under point 10 until B3. A KNOWN-LIMITATIONS row names it.
2. Timing: the Status line reads my session order correctly. Acceptance comes before MP-1's preregistration.
3. The ADR-016 cite is section 5, as the Decision has it.
4. The placeholder is read as the declared list, rendered as today's message renders it.
5. O1 and O2, for MP-1: a row of a type the engine does not read is refused by name, as today. Counting it as unread stays open for a later cut.
6. O3 to O8 stay open for MP-1's preregistration. New operator wording ships as a P6 placeholder and is mine at P6.
MP-1's preregistration may be written now.
```
