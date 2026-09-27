*Custodian's filing note (2026-09-27): the architect agent's consult for PLAN node `geometry-types-beyond-polygons` (ADR-034 filed Proposed, on the 2026-09-27 session order), transcribed from the hand-back message with the harness's two-space indent removed; the fenced ADR under (a) is the returned text byte for byte (the custodian's scratch copy, from which the branch file was built). Everything below the rule is the agent's text. On the branch `docs/adr-034-geometry-admission` the custodian filled the two `[[VERBATIM: …]]` markers by script (the human's typed answer for round 17 item 7 from `DECISIONS-PENDING.md`, 441 bytes; the assessment's §5 item 4 proposed text, 95 bytes) and replaced the Status line's acceptance-timing clause, as the agent's note (d) 3 provides, because the 2026-09-27 session order (`state/directives/2026-09-27-session-order.md`) brings the ADR to the human for acceptance before MP-1's preregistration. Profile paths redacted at filing (0).*

---

**Verdict: pass with notes.** Reviewed: main @ 0ada14f

The draft is below. It changes no Accepted ADR and crosses no red line beyond its own Proposed status. Two things need your attention before you file it. First, the ADR-016 section cite is corrected from §7 to §5 (see (d)). Second, filing the file breaks one generated sentence and the test that pins it (see (d)).

## (a) Proposed file: `docs/adr/ADR-034-geometry-type-admission-and-geoarrow-encoding-selection.md`

```markdown
# ADR-034 — Geometry type admission and GeoArrow encoding selection

**Status:** Proposed 2026-09-27 — filed on the human's ruling (`DECISIONS-PENDING.md`, RULED 2026-09-24 — question round 17, item 7; entry 126). It binds nothing and is not architect-blockable until the human accepts it; acceptance is the human's (a red line), and by that ruling's decision 8, taken as recommended (paraphrase), it is sought at MP-1's gate. The ruling's two riders bind MP-1's preregistration (PLAN node `geometry-types-beyond-polygons`) through the ruling itself, whatever this ADR's status.
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

[[VERBATIM: R17-I7]]

Decision 4's wording, as sighted, byte-copied by script from the assessment's §5 item 4 and marked so:

[[VERBATIM: ASSESSMENT-5-4]]

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
```

## (b) Tree claims, each read at `0ada14f`

1. Admission gate: `engine/src/dataset.rs`, in `Dataset::open`. It admits an empty or all-Polygon list via `eq_ignore_ascii_case` and returns `EngineError::GeoMetadata` with the polygons-only text.
2. Code `engine.geo_metadata`: `kernel/src/skp.rs::error_of` (the `EngineError::GeoMetadata(_) => ("geo_metadata", …)` arm), plus `SKP-V0.md` §5. The Display prefix is in `engine/src/error.rs`.
3. Type 3 only: `engine/src/wkb.rs`, `WKB_POLYGON` and `PolygonBuilder::push_wkb`. The stream calls `pending.builder.push_wkb(wkb)?` in `engine/src/stream.rs`.
4. `EXT_NAME_POLYGON`, `geometry_field` and `validate_polygon_encoding`: `engine/src/geoarrow.rs`.
5. Envelope key: `engine/src/envelope.rs`, `md.insert("geometry_encoding", geoarrow::EXT_NAME_POLYGON…)`.
6. `describe`: `kernel/src/skp.rs::describe_dataset` sets `GeometryInfo { encoding: "geoarrow.polygon" }`. `protocol/skp/src/v0/commands.rs` has `GeometryInfo`, which is `deny_unknown_fields` with an always-polygon doc comment. `SKP-V0.md` §1's `describe` block states it is pure and runs no new query (ADR-006 class 1).
7. `frontends/shell/src/admission/DescribeSummary.tsx` renders `describe.geometry.encoding`.
8. `frontends/shell/src/canvas/decodeBatch.ts::decodeBatch` checks `frame` only.
9. `renderer/bundle-viewer/src/partition.ts`: `EXPECTED_ENCODING` and its mismatch refusal.
10. `kernel/examples/verify-bundle.rs` checks only the `geoarrow.` prefix.
11. `kernel/src/publish/mod.rs`: `format_declaration` hard-codes the encoding. `preflight_pinless_parts` holds `GeographicCrsNotPublishable` before the pin, and `admit_bundle_format` is the round-17 item-3 format-owned pattern.
12. `engine/src/lod.rs` refuses non-Polygon with the expected-a-Polygon message. `build_tiers` has no control-plane caller, per the `LodRefused` arm comment in `kernel/src/skp.rs`; its only kernel caller is a test.
13. `frontends/shell/src/canvas/tileResidentSet.ts`: `TileResidentSet.addBatch` drops a repeated id.
14. `frontends/shell/src/canvas/pick.ts::resolvePick` uses the ordinal as the row index. `buildLayers.ts` calls `checkPickCeiling(batch.ids.length)`, and `limits.ts::checkPickCeiling` takes a feature count.
15. `engine/src/stream.rs`: the `wkb.len() / 16` bound.
16. `engine/ADMISSION-RESULTS.md`: rows #2, #4, #5 (Point) and #11, #12 (mixed), all `engine.geo_metadata`.
17. PLAN nodes `geometry-types-beyond-polygons`, `briefb-b3-publish-v2`, `lod-tier-selection`, `geometry-points-cut` and `geometry-lines-cut` exist. `b1-shell-half` is `proposed`.
18. ADR-016 §5 is uniqueness and §7 is width. ADR-017 §4's Schema row pins `geoarrow.polygon`. ADR-010 rule 1's tag is `frame`.

## (c) Open items for MP-1's preregistration

- **O1.** The rider's choice: refuse by name, or count as unread and show. Under counting, MP-1 also decides where the count is shown. On `describe` it must come from open's own work, which is an operation with no `docs/08` figure; otherwise the owner shows it per stream.
- **O2.** Whether a row contradicting a non-empty declaration takes O1's treatment. Today's by-name stream refusal already avoids a silent drop.
- **O3.** Placement and wire form of `declared_types` in `describe`, and the operator labels for encoding versus declared types (P6).
- **O4.** The literal: MP-1 states the one after B1's by merge order. If another wire piece merges first (for example `kernel-generation-close-races`, if it takes a literal), MP-1 states the actual predecessor.
- **O5.** The form of the readable-set declaration, and whether type matching stays case-insensitive.
- **O6.** New wording for the WKB-level non-Polygon refusal, which today states polygons-only. It is an engine fact, not covered by decision 4's sight; whether it goes to the human for sight is your call.
- **O7.** Confirm against installed `@deck.gl/layers` that one datum is one polygon (the assessment left this unverified). Per-part arrays and their disclosed heap cost.
- **O8.** The attribute seam. B1's shell half (`b1-shell-half`, proposed) is not on main, so no shell attribute lookup exists yet. MP-1's part-to-row map is the row source, and whichever of the two lands second writes its seam against the other's merged interface.
- **O9.** The evidence set from assessment §2:
  - Polygon-only byte identity (stream IPC and partition hashes);
  - an LV95 MultiPolygon fixture run end to end;
  - corpus #12 end to end;
  - a P4 generator re-run;
  - the KNOWN-LIMITATIONS rows for LOD and publish.

## (d) Accepted ADRs and red lines

No Accepted ADR is amended and ADR-017 stays untouched. The only red line is this ADR's own acceptance. Four notes:

1. **ADR-016 cite corrected.** Both your brief and the assessment cite ADR-016 §7 for uniqueness, but §7 is identity width; uniqueness is §5. The draft cites §5 and lists the correction under "For the human, at acceptance". Carrying §7 forward would be a stale cite by name.
2. **Filing breaks one generated sentence and its test.** Once the ADR file exists, the `HEADER_LINE` sentence listing ADR-014, ADR-031 and ADR-034 as reserved numbers with no file becomes false. It is in `frontends/shell/scripts/adrIndex.mjs`, and `frontends/shell/src/docs/adrIndex.test.ts` asserts that exact substring. The filing PR must:
   - correct the sentence;
   - update the test;
   - run `npm run adr-index` to regenerate `docs/README.md`.

   The header is built so the Status paragraph ends at `**Drafted by:**`, a known field label, and the verbatim markers sit outside the Status paragraph.
3. **Timing of acceptance.** The Status line says acceptance is sought at MP-1's gate, a paraphrase of decision 8 as recommended. If the human reads decision 8 otherwise, drop that clause.
4. **Where the quotations go.** The ADR types no quotation. The human's words and decision 4's wording enter only through the two `[[VERBATIM: …]]` markers, which you fill by script.

Source files read: `C:\dev\spatial-ide\DECISIONS-PENDING.md`, `C:\dev\spatial-ide\state\consults\2026-09-24-multipolygon-assessment.md`, `C:\dev\spatial-ide\docs\adr\ADR-035-dataset-session-ended-control-plane-event.md`, `C:\dev\spatial-ide\frontends\shell\scripts\adrIndex.mjs`.
