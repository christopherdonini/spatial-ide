*Custodian's filing note (2026-09-24): the architect agent's assessment for PLAN node `multipolygon-assessment-consult` (`node:multipolygon-assessment-consult@g1`, night program 2026-09-24 item 8), filed as returned. Everything below the rule is the agent's text. It is a consult only, not a preregistration. Its §0 count was checked by the custodian against `engine/ADMISSION-RESULTS.md` rows #2, #4, #5, #11 and #12 (5 of 12 refused on geometry type; #11 and #12 mixed Polygon/MultiPolygon). Its §5 decisions go to the morning question round (`DECISIONS-PENDING.md` entry 126).*

---

**Verdict: pass with notes.** MultiPolygon can be assessed and needs no block. It is not a change to the admission check alone. It crosses three wires: the data-plane envelope, SKP `describe`, and the bundle partition schema (ADR-017 §4). Decisions for the human are listed at the end.

Locators: every `file:line` below is at main `a78d621`. They are unpinned code locators for the next preregistration, not binding-text cites. The custodian or reviewer pins any that a record must carry (the architect has no shell). Ledger passages are cited by round, item or entry only.

## 0. Problem statement, corrected

- The "8 of 12" in RULED 2026-09-14 question set B, item B4 is conditional ("if 8 of 12…"). It carries entry 73's count from before the retirements.
- The P4 run (`engine/ADMISSION-RESULTS.md`, generated at `f1b9c85`, Predictions row 1) records **5 of 12** refused on geometry type:
  - #2, #4, #5 are `Point`.
  - #11 declares `[Polygon, MultiPolygon]`; #12 declares `[MultiPolygon, Polygon]`.
- So the MultiPolygon gain is **2 files, and both are mixed columns**. If mixed columns do not admit, the corpus gains nothing (decision 1).
- The PLAN node's summary should cite the P4 table, not B4's conditional.

## 1. Per surface

### Reading (engine admission and WKB decode)

**Assumes Polygon today:**
- `engine/src/dataset.rs:326-333`: the metadata gate. It admits only an all-`Polygon` or an empty `geometry_types`.
- `engine/src/wkb.rs:19-20, 67-71`: the row decoder accepts type 3 only.
- `wkb.rs:27-40`: `PolygonBuilder` has two offset levels.
- `wkb.rs:156-171`: the only test encoder.
- `engine/src/fixture.rs:510`: the fixture writer declares `["Polygon"]`.
- `engine/src/stream.rs:1863-1865, 1963, 2141`: the stream builder.
- Empty `geometry_types` admits at open, and then a MultiPolygon row kills the stream mid-way at `wkb.rs:67-71`.

**MultiPolygon needs:**
- WKB type 6. Each part has its own byte-order byte and type code. Each part must be checked for type 3 and for no EWKB flags.
- A third offset level (parts).
- An EMPTY MultiPolygon is refused by name, consistent with `wkb.rs:73-76`.
- The encoding is fixed at open from the declared types (decision 2). A Polygon row in a MultiPolygon-encoded dataset becomes a one-part MultiPolygon with bit-identical coordinates.
- The row-size estimate at `stream.rs:1839` (`wkb.len()/16`) still over-counts vertices. The per-part offset (4 B) is unaccounted for. It should be declared, not assumed.

**Wire:** data plane, yes (below). **ADR:** none. **Risk:** low.

**Piece boundary:** decode, admission and encoding-at-open are one unit. A decoder whose output nothing emits has no product caller.

### Encoding (engine to data plane)

**Assumes Polygon today:**
- `engine/src/geoarrow.rs:26, 46-49, 52-79`: the extension name, storage type and array builder.
- `geoarrow.rs:95`: `geometry_field` hard-codes the name.
- `geoarrow.rs:179-221`: the validator accepts two levels only.
- `geoarrow.rs:157-171`: `coordinate_values` returns `None` on three levels. The bounds report then silently degrades to "no bound established". That is safe, but it is lost.
- `engine/src/envelope.rs:184`: `geometry_encoding` is hard-coded.

**MultiPolygon needs:** a `geoarrow.multipolygon` field (`List<List<List<FixedSizeList<f64>[2]>>>`), its validator, a walk over three levels, and the envelope value taken from the dataset. Parts add one offsets buffer and no extra coordinate copy, so ADR-004 is satisfied.

**Wire:** yes. There is a second value of the ADR-010 rule 1 envelope tag. Rule 1 is satisfied; no amendment is needed.

**Hard constraint: one row per feature on the wire.** Splitting parts into rows would repeat ids, which breaks ADR-016 §7's uniqueness. It would also make `frontends/shell/src/canvas/tileResidentSet.ts:184-216` drop every part after the first, because it deduplicates by id. That is silent geometry loss. Splitting on the wire is ruled out by the architecture, not left open as a choice.

**Risk:** medium (seams).

### SKP (control plane)

**Assumes Polygon today:**
- `protocol/skp/src/v0/commands.rs:146` documents the value as always `geoarrow.polygon`.
- `protocol/skp/SKP-V0.md:64` gives the literal.
- `kernel/src/skp.rs:1064` hard-codes it.
- `frontends/shell/src/admission/DescribeSummary.tsx:25` displays it.

**MultiPolygon needs:** a second documented value. I also recommend a `declared_types` field carrying the file's `geometry_types` verbatim: a source fact next to the engine's encoding fact (docs/01 principle 8). Promoting Polygon to a one-part MultiPolygon is then visible, not implied.

**Wire:** yes, so an SKP literal bump. By merge order it takes the literal after B1's (RULED 2026-09-24 (night) item (2) fixes crs-unit, then the watcher, then B1; this extends that order, see decision 6).

### Rendering (shell canvas)

**Assumes Polygon today:**
- `frontends/shell/src/canvas/decodeBatch.ts:34-37`: `ResidentBatch.rings` is indexed by feature, then ring.
- `decodeBatch.ts:82-99`: the decode loop.
- `buildLayers.ts:153-155`: one `SolidPolygonLayer` datum per feature.
- `buildLayers.ts:166-171`: the outline flattening.

**Latent defect, independent of this cut:** `decodeBatch.ts:52-66` checks `frame` but never checks `geometry_encoding`. A MultiPolygon batch would be walked as rings, giving NaN coordinates and no error. The viewer does check it (`renderer/bundle-viewer/src/partition.ts:122-128`). The cut must add the check before any engine emits a second encoding.

**MultiPolygon needs:**
- One internal shape: parts, then rings, per feature, with Polygon decoded as one part. That keeps one render path, so the existing polygon tests exercise the parts level.
- deck.gl data expanded per part, with a part-to-row `Int32Array`.
- Before relying on it, the piece reads installed `@deck.gl/layers` 9.3.9 (the version `buildLayers.ts` records) to confirm that one datum is one polygon. I have not verified this here.

**Other consumers to change** (every `.rings` site outside tests):
- `pick.ts:133`
- `pickResolution.ts:94`
- `extent.ts:27`
- `tileIngest.ts:210, 221`: the trim must stay whole-feature (ADR-028).
- `tileResidentSet.ts:234`
- `WorkingCanvas.tsx:1409`

**Wire:** no (it is a consumer). **ADR:** ADR-010 rule 3 (offsets in f64) is unchanged.

**docs/08:** no budget text changes. A multipart dataset has no defined class in docs/08's matrix ("Polygons: 100k features / 10M vertices"), so there is no performance claim for multipart until a defined fixture exists. Per-part JS arrays are an unmeasured heap cost on top of the one `buildLayers.ts:126-129` already discloses; name it.

**Risk:** medium-high. This is the largest diff.

### Picking and hover

**Assumes Polygon today:**
- `pick.ts:128-136`: the GPU ordinal is used directly as the row index.
- `buildLayers.ts:262`: `checkPickCeiling(batch.ids.length)` counts features.
- `pickResolution.ts:90-115`: average extent (it already takes the union over rings).

**MultiPolygon needs:**
- The lookup becomes ordinal → part → row → id (ADR-010 rule 2, followed, not amended).
- The ceiling is counted in pick ordinals, which are parts (rule 6). Counting features under-counts; that is a defect by name if left.
- Extent is the union over all of a feature's parts.
- A re-pick landing on another part confirms the same id, so one feature gives one hover.

**Test from the real shape:** a multipart feature whose part ordinal differs from its row index resolves to the correct id.

**Wire:** no. **Risk:** medium.

### Attributes (ADR-023, B1)

**Assumes Polygon today:** nothing geometry-specific. Attributes are per row.

**MultiPolygon needs:** B1's hover attribute lookup must receive the row from the part-to-row map. That is a seam, and it is written against B1's interface as merged, so this cut follows B1 (PLAN already orders it that way).

**Wire:** no. **Risk:** low, if it is sequenced after B1.

### Styling

**Assumes Polygon today:** nothing. Style v0 is literal-only in the shell (`buildLayers.ts:35-44`). The viewer assigns a style group per feature (`partition.ts:191-211`).

**MultiPolygon needs:** a test that every part draws in its row's group.

**Named difference on invalid input:** the viewer fills even-odd per feature (`renderer/bundle-viewer/src/render.ts:340-358`). The shell uses earcut per part. For overlapping parts, which make a MultiPolygon invalid, the viewer turns the overlap into a hole while the shell fills it twice. The preregistration declares even-odd per part in the viewer, so the two agree by construction. The engine repairs nothing; that is the data doctor's job (Alpha).

### Publishing

**Assumes Polygon today:**
- ADR-017 §4's Schema row pins `geoarrow.polygon`.
- `kernel/src/publish/mod.rs:1110`: the manifest's `data.format.geometry_encoding` is hard-coded, so it would contradict the partitions.
- `partition.ts:28, 122-128`: the viewer refuses a mismatched encoding, which is honest.
- `partition.ts:146-157`: the viewer walks two levels.
- `kernel/examples/verify-bundle.rs:407`: accepts any `geoarrow.*`, which is weaker than the viewer.

**MultiPolygon needs:** a new partition schema. That is an **ADR-017 amendment** (accepted and architect-blockable; the change is the human's). Under §3, adding a feature means a version bump.

**Wire:** yes, the bundle format. **Risk:** high if done inside this cut.

**Smallest honest boundary:** in this cut, the publish preflight refuses a MultiPolygon-encoded dataset by name, with the kernel as owner stating the consequence. The encoding itself rides Brief B stage B3's bundle v2 (decision 5). That costs the corpus nothing today: #11 and #12 are both degree datasets, which the boundary-8 preflight already refuses.

### LOD

**Assumes Polygon today:**
- `engine/src/lod.rs:1507-1515` refuses anything but Polygon, by name.
- `lod.rs:1563-1588`: helpers typed to Polygon.
- `lod.rs:1547`: `write_polygon`.
- `lod.rs:1656`: the tier metadata writes `["Polygon"]`.
- There is no ADR-031 file on main. The governing text is `engine/LOD-PREREGISTRATION.md`.

**MultiPolygon needs:** simplification per part. `is_valid` (the O1 gate) may fail when simplified parts come to overlap. The refusal is honest, but the rate is unknown.

**Product caller:** none. `build_tiers` has no product caller until lod-tier-selection. Under the caller rule, widening LOD in this cut would be code with no product caller. **Out of scope.** The existing refusal stands and a KNOWN-LIMITATIONS row names it. Widening rides lod-tier-selection's preregistration (decision 7).

## 2. Piece decomposition and order

**MP-1: MultiPolygon, one vertical cut.** Full preregistration, full gate (§21a: wire touch, SKP literal, user-visible behaviour).
- Contents: reading and encoding; SKP (the literal after B1's); the shell's `geometry_encoding` check, parts shape, pick and extent; the styling-group test; the publish preflight refusal; the LOD out-of-scope row.
- It is one cut, not engine-first. An engine emitting `geoarrow.multipolygon` with no shell consumer is a producer without a caller. It would need the human's round-8 pre-commitment, and there is no reason to spend it.
- Evidence to preregister:
  - **Polygon-only byte identity:** for the existing fixtures, the stream IPC bytes and the published bundle's partition hashes are unchanged before and after. This proves the existing wire, the docs/08 measurements and the E2E expectation (`frontends/shell/e2e/regression.mjs:372`) are untouched.
  - **A purpose-written LV95 MultiPolygon fixture** run end to end through the shell. It is the projected real-shape case; the corpus has none.
  - **Corpus #12 end to end** on the canvas: the real Overture shape (seam rule).
  - **A P4 generator re-run**, re-deriving #11 and #12 against §3's rules, not hand-edited.
- No tester and no performance claim.

**MP-2: MultiPolygon partitions.** Folded into briefb-b3-publish-v2's preregistration, with an ADR-017 amendment proposed for the human. The viewer's parts level and per-part even-odd land there. Full gate.

**Docs row:** KNOWN-LIMITATIONS rows (LOD refusal; publish refusal until B3; overlap rendering). Single gate, or folded into MP-1.

**Order:** crs-unit → watcher → B1 → MP-1 → (B2) → B3 with MP-2. This matches PLAN's `depends_on`. MP-1 needs crs-unit merged first: both newly admitted corpus files are degree datasets, so their canvas display relies on crs-unit's degree drift cap and per-unit `MIN_ANCHOR_SPAN`. MP-1 needs B1 first for the attribute seam.

## 3. What the corpus gains

- Refused on geometry type: 5 → 3. The Point files #2, #4, #5 wait for geometry-points-cut.
- #11 and #12 reach the CRS rules.
  - **#11:** declared `OGC:CRS84`, x-first. §3 row 11's own note says no format rule is needed, so admitted-as-declared is expected.
  - **#12:** absent key, so R-C2 applies (`crs:format-default`). Its sanity level is decided by covering-column statistics; record at P4.
  - Identity class for both: not derivable statically; record at P4.
- Both are in degrees, so publish still refuses them at boundary 8. The gain is open, stream, canvas and hover, not the hero publish.

## 4. Missing decision: drafted ADR skeleton

**ADR-034 (number to be confirmed): Geometry type admission and GeoArrow encoding selection. Proposed.**
- **Context:** the engine admits Polygon only. Points and lines follow as their own cuts (geometry-points-cut, geometry-lines-cut). Encoding selection, mixed columns, empty `geometry_types`, one-row-per-feature and the refusal wording need one rule, not three.
- **Decision:**
  1. The admitted type set is declared per engine release.
  2. The encoding is fixed at open from the declared `geometry_types`: an exact `[Polygon]` stays `geoarrow.polygon`; any set within {Polygon, MultiPolygon} that includes MultiPolygon becomes `geoarrow.multipolygon`.
  3. Single parts are promoted to one-part multi-geometries with bit-identical coordinates, and the source's declared types are surfaced on `describe`.
  4. One wire row per feature, always (ADR-016 §7).
  5. Pick ordinals resolve through a part-to-row map (ADR-010 rules 2 and 6).
  6. Anything outside the admitted set is refused by name, and the message states the engine's readable set.
- **Consequences:** polygon-only wire and bundles are byte-identical; `describe` and envelope consumers must check the encoding; the bundle schema needs an ADR-017 amendment per geometry kind; LOD refuses until it is widened by its own preregistration.

## 5. Decisions only the human can make (for the morning round)

1. **Do mixed `[Polygon, MultiPolygon]` columns admit, with Polygon rows promoted?** *Recommend: yes.* Both corpus files are mixed, so without it the gain is zero. Coordinates stay bit-identical and the source types are shown on `describe`.
2. **Is the encoding chosen per dataset, or is MultiPolygon always used?** *Recommend: per dataset.* Polygon-only files keep `geoarrow.polygon` byte-identically, which keeps every existing measurement, fixture, E2E expectation and bundle hash valid.
3. **What does an empty `geometry_types` (undeclared) get?** *Recommend: the MultiPolygon encoding.* That replaces today's mid-stream refusal on the first MultiPolygon row with an honest superset. No corpus or fixture file declares an empty list, so nothing measured changes. Alternative: keep Polygon and the mid-stream refusal.
4. **New wording for the non-polygon refusal.** Today's "reads polygons only" becomes false. Same variant, `engine.geo_metadata`. *Proposed text, not a quote of anything:* "geometry_types [...] include types this engine does not read; it reads Polygon and MultiPolygon". Sighted in the morning round.
5. **Is publishing in MP-1 or in B3?** Options: (a) an ADR-017 v1 amendment adding a second partition encoding, landing in MP-1; or (b) the MP-1 preflight refuses by name and the MultiPolygon partitions ride B3's bundle v2. *Recommend (b):* ADR-017 is not reopened twice, the producer and consumer are designed together, and nothing is lost today (both corpus files are degree datasets).
6. **SKP literal and describe field.** MP-1 takes the literal after B1's, and `describe` gains `declared_types`. *Recommend: yes.* This extends the night ruling's merge order to a fourth piece.
7. **LOD out of MP-1.** *Recommend: yes.* There is no product caller. The existing named refusal stands, and widening rides lod-tier-selection.
8. **ADR-034 (§4 above).** Should the encoding-selection rule be filed Proposed before MP-1's preregistration, so the points and lines cuts inherit it? *Recommend: yes, filed Proposed*, with acceptance at MP-1's gate.
