# ADR-034 — Geometry type admission and GeoArrow encoding selection

**Status:** Proposed 2026-09-27 — filed on the human's ruling (`DECISIONS-PENDING.md`, RULED 2026-09-24 — question round 17, item 7; entry 126). It binds nothing and is not architect-blockable until the human accepts it; acceptance is the human's (a red line), and it is sought before MP-1's preregistration is written (the 2026-09-27 session order, `state/directives/2026-09-27-session-order.md`). The ruling's two riders bind MP-1's preregistration (PLAN node `geometry-types-beyond-polygons`) through the ruling itself, whatever this ADR's status.
**Drafted by:** the architect agent on the custodian's brief, reconciling its own skeleton (`state/consults/2026-09-24-multipolygon-assessment.md` §4) with that assessment's §5 decisions as ruled and the ruling's two riders. Every tree claim below was read at main `0ada14f`.
**Related:** `docs/01` principles 7 and 8 · `docs/02` · `docs/08_Testing.md` · `docs/10` · ADR-004 · ADR-006 · ADR-010 rules 1, 2 and 6 · ADR-016 §5, §6 and §7 · ADR-017 §3 and §4 (Accepted; not amended here) · `protocol/skp/SKP-V0.md` §1 (`describe`), §4 item 13, §5, §8 · `engine/LOD-PREREGISTRATION.md` · `engine/ADMISSION-RESULTS.md` · RULED 2026-09-24 (night) item (2) · RULED 2026-09-24 — question round 17, items 3 and 7.

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
- **LOD.** `engine/src/lod.rs` refuses any feature that is not a Polygon, by name. `build_tiers` has no product caller: `kernel/src/skp.rs` records that nothing on the control plane calls it.
- **The corpus.** The P4 run (`engine/ADMISSION-RESULTS.md`) records 5 of 12 files refused on geometry type.
  - #2, #4 and #5 are Point files.
  - #11 and #12 declare mixed Polygon and MultiPolygon columns.
- **Points and lines** follow as their own cuts (PLAN nodes `geometry-points-cut`, `geometry-lines-cut`). Encoding selection, mixed columns, an empty `geometry_types`, one row per feature and the refusal wording need one rule, not one per cut.

## The ruling

The human ruled all eight of the assessment's §5 decisions as recommended, sighted decision 4's wording as proposed, and added two riders: one on decision 3 and one on decision 1's promotion. The human's typed answer, byte-copied by script from that item and marked so:

*"All eight as recommended, and decision 4's wording sighted as proposed. Rider on decision 3: a column with an empty geometry_types admits under the MultiPolygon encoding, but any row of a type the engine does not read is refused by name or counted as unread and shown, never silently dropped. Decision 1's promotion of Polygon rows is declared as an encoding in describe (decision 6's declared_types), never presented as the file's own type."*

Decision 4's wording, as sighted, byte-copied by script from the assessment's §5 item 4 and marked so:

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
   - an empty `geometry_types` gives `geoarrow.multipolygon`;
   - a declared set with any member outside the readable set is refused at open (point 7).

   The encoding is a fact of the open. The envelope, `describe` and every batch carry the same value, and it never varies per batch or per stream.

3. **Promotion is declared as an encoding, never as the file's type** (decision 1 and its rider; decision 6).
   - Under the multipolygon encoding, a Polygon row becomes a one-part MultiPolygon. Its coordinate bit patterns are carried through with no arithmetic, as `engine/src/wkb.rs` does today.
   - `describe` gains `declared_types`. It carries the file's `geometry_types` as declared and in declared order, with an empty list kept empty. It is a source fact beside `encoding`, which is the engine's fact (`docs/01` principle 8).
   - By the rider (paraphrase), no surface presents the promotion as the file's own type. This covers `describe`, the envelope, the shell's display and operator text. Where both facts are shown, each is labelled as what it is. The labels' wording is the owner's (P6).

4. **A row of a type the engine does not read is never silently dropped** (decision 3's rider).
   - Under an empty `geometry_types`, such a row takes one of the two treatments the rider allows:
     - (a) it is refused by name; or
     - (b) it is counted as unread, and the count is shown.
   - **The ruling does not choose between (a) and (b), and neither does this ADR. MP-1's preregistration chooses (open item O1).**
   - Either treatment is bound by rules already in force:
     - Under (a), the refusal is a typed engine refusal stating the engine fact: the type met and the readable set.
     - Under (b), a count shown on `describe` has to be a fact open already established, because `describe` runs no new query (`SKP-V0.md` §1, `describe`). A whole-column count at open is an operation under `docs/01` principle 7, with no `docs/08` figure. Under (b), no row count or extent may imply that every row is drawn.
   - Today's refusal text for a non-Polygon row (`PolygonBuilder::push_wkb`) states a readable set that becomes false under MP-1, and MP-1 restates it as an engine fact.

5. **One wire row per feature, always.**
   - Parts never become rows.
   - The rule rests on ADR-016 §5 (uniqueness verified over the emitted identity) and ADR-010 rule 2 (GPU ordinal → stable id → authoritative f64).
   - The shell's `TileResidentSet.addBatch` (`frontends/shell/src/canvas/tileResidentSet.ts`) drops a repeated id. Rows split per part would therefore lose every part after the first, silently.

6. **Picking goes through a part-to-row map** (ADR-010 rules 2 and 6; followed, not amended).
   - A GPU ordinal resolves ordinal → part → row → id. `resolvePick` (`frontends/shell/src/canvas/pick.ts`) uses the ordinal as the row index today.
   - The pick ceiling is counted in pick ordinals, which are parts. `checkPickCeiling(batch.ids.length)` in `buildLayers` counts features, which undercounts once features have several parts, and that is a defect by name if left.
   - A feature's extent is the union over its parts. A re-pick that lands on another part of the same feature confirms the same id, so one feature gives one hover.
   - Every per-row lookup, attribute columns included, takes its row from the same map.

7. **A declared type outside the readable set is refused at open, by name.**
   - It is the same variant, `engine.geo_metadata`, with decision 4's sighted wording.
   - The text states engine facts only: the declared types and the readable set. It states no consequence belonging to another module.
   - A declared set that mixes kinds, such as Polygon with LineString, is refused under this point until a later decision covers it.

8. **Wire and version.**
   - The second encoding value and `declared_types` go on one SKP literal. MP-1 takes the literal after B1's, by merge order (decision 6; RULED 2026-09-24 (night) item (2)). No literal number is written here.
   - `GeometryInfo` is `deny_unknown_fields`. The new member lands with its §8 entry and with both-side fixtures in the same commit (`SKP-V0.md` §4 item 13).
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

- **Polygon-only datasets.**
  - Their stream IPC bytes and published partition hashes are unchanged. MP-1 preregisters the proof over the existing fixtures, which keeps every `docs/08` measurement and the shell E2E's encoding expectation valid.
  - The `describe` response gains one member for every dataset.
- **The shell must check `geometry_encoding` before any engine emits a second value.**
  - `decodeBatch` checks `frame` only. A multipolygon batch would be walked one nesting level short, misread, with no error raised.
  - MP-1 adds the check, and the one internal shape of parts, then rings, per feature.
- **The viewer and the bundle verifier.** The viewer already refuses a foreign encoding. `verify-bundle.rs`'s `geoarrow.*` check is weaker than the viewer's and is MP-2's to align.
- **Publishing (decision 5).**
  - The multipolygon partition schema is MP-2's. It rides Brief B stage B3's bundle version 2 (PLAN node `briefb-b3-publish-v2`), through whatever instrument B3's preregistration puts to the human.
  - This ADR does not amend ADR-017.
  - Corpus #11 and #12 are degree datasets, which `GeographicCrsNotPublishable` already refuses, so nothing publishable today is lost.
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
  - The shell's per-part arrays are an unmeasured heap cost.
  - The stream's row-size bound (`wkb.len() / 16`, `engine/src/stream.rs`) does not count per-part offsets, and MP-1 declares them.
- **The corpus.** Refusals on geometry type go from 5 to 3. #11 and #12 reach the CRS rules, and the three Point files wait for `geometry-points-cut`.

## What this ADR does not decide

- The choice between treatment (a) and treatment (b), and the surface where (b)'s count is shown (O1).
- Whether a row that contradicts a non-empty declaration takes the same treatment. Examples are a MultiPolygon row under `[Polygon]`, or a Point row under `[Polygon, MultiPolygon]` (O2).
- `declared_types`' exact placement and wire form within `describe`.
- Whether type matching stays case-insensitive.
- Types with Z or M.
- Mixed-kind columns.
- The shell's rendering internals.
- The multipolygon partition schema (MP-2 and B3).
- LOD widening (`lod-tier-selection`).
- The SKP literal's number.

## For the human, at acceptance

- Decision 5 cites ADR-016 §5 for uniqueness. The skeleton cited ADR-016 §7, which states the identity's width.
- The Decision reads decision 4's bracketed placeholder as the declared list, rendered as today's message renders it.
- O1 and O2 are open for MP-1's preregistration and are not settled here.
