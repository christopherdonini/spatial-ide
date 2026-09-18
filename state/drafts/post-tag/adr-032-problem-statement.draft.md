> **Status: draft — the ADR-032 problem statement (2026-09-09); superseded by `docs/adr/ADR-032-geoparquet-source-declaring-a-non-x-first-axis-order.md` (Proposed).**
> Record, not policy — moved from the untracked `RELEASE-DRAFTS-0.1.0/` directory on the human's round-14 ruling (2026-09-17); nothing here binds, and its cites are historical (advisory in `verify-cites`, never gated).

# ADR-032 — Problem statement (DRAFT, for the human's sight — not filed)

*Drafted 2026-09-09 during the away window by the architect agent on the custodian's brief; read-only against the tree at `main` 998be05 + the day's docs commits. Nothing decided, nothing filed; ADR-032 stays Proposed with the decision open. Every `file:line` was read by the drafter; paraphrases are labelled. The architect's own notes on the sources follow the draft. The custodian changed nothing but this header.*

*Status of this text: a draft problem statement for the human, written after the v0.1.0 cut. It decides nothing, ranks nothing, and is not the ADR's Context. ADR-032 stays Proposed with the decision open (`docs/adr/ADR-032-geoparquet-source-declaring-a-non-x-first-axis-order.md:3-8`).*

## 1. The fact pattern

GeoParquet 1.1.0's axis-order rule, pinned verbatim in the tree at `spikes/item8-crs-catalog-extension/README.md:62-68` (retrieved 2026-09-08T07:29Z, page sha256 recorded at `:57-59`):

> **Coordinate axis order** — The axis order of the coordinates in WKB stored in a GeoParquet follows the de facto standard for axis order in WKB and is therefore always (x, y) where x is easting or longitude and y is northing or latitude. This ordering explicitly overrides the axis order as specified in the CRS. This follows the precedent of GeoPackage, see the note in their spec.

> Note: EPSG:4326 and OGC:CRS84 are equivalent with respect to this specification because this specification specifically overrides the coordinate axis order in the crs to be longitude-latitude.

(The spike file records at `:70-72` that the heading is the page's own section title, joined to its paragraph with an em dash.)

So a GeoParquet declaring EPSG:4326 contains, if its producer conforms: a CRS definition whose `coordinate_system.axis` is latitude-first (`spikes/item8-crs-catalog-extension/README.md:35-36`, read from the pinned `projinfo` rendering), over WKB whose coordinates are longitude-first. Two facts, in conflict, both present in the file. The pinned record states its own limit at `:74-77`: it does **not** establish that any given producer honours the rule — a violating producer transposes silently, and a check can convict, never confirm.

## 2. What the engine does today, and why

Admission establishes axis order from the CRS definition alone — declared or asserted, through the same function (`engine/src/geoparquet.rs:159-189`; the asserted path calls it at `engine/src/dataset.rs:293-300`) — and refuses anything not x-first:

```rust
// engine/src/dataset.rs:302-307
let crs = crs::admit(geo.declared_crs.clone(), assertion.as_ref(), asserted_axis)?;
if !crs.axis_order().is_x_first() {
    return Err(EngineError::AxisOrderUnsupported { established: crs.axis_order().as_str().to_string() });
}
```

The refusal text, verbatim (`engine/src/error.rs:213-217`):

> `refused: established axis order is {established}; this slice performs no axis normalization and emits (easting, northing) only`

For a 4326 declaration `{established}` is `latitude,longitude` — pinned by `engine/tests/slice.rs:315-324`. On the wire it is `axis_order_unsupported` with the `established` value (`kernel/src/skp.rs:620-622`).

Why: ADR-015 §5 (`docs/adr/ADR-015-source-crs-requirement-and-caller-assertion.md:56-60`) plus its conflict block (`:62-75`), which resolves docs/05's normalize-first clause (`docs/05_Data_Engine.md:64-67`) against docs/01 principle 8 lower-number-wins — refusing is the **resolved** behaviour, not a gap. The catalog cannot route around it: an assertion is admitted only for a file that declares nothing (`engine/src/crs.rs:223-239`), and the assertion's own definition goes through the same axis check. ADR-026 leaves the refusal in place explicitly (`docs/adr/ADR-026-crs-definition-supply-for-caller-assertion.md:61`, and the 2026-09-08 note at `:144-148`).

The point of tension: today's rule reads the *declared* order and applies it to the *data*, and for GeoParquet the format says those are not the same fact.

## 3. Candidates

### (A) Hold the refusal — admit only x-first declarations

**Changes:** nothing in the engine. Optionally an `ogc-crs84` catalog entry so an operator can assert longitude-first WGS 84 for a file that declares **no** CRS.

**ADRs touched:** none amended. ADR-026's growth gate applies to a new entry (`engine/src/crs_catalog.rs:23-30`, and the pinned-hash tests at `:291-308`); note that its EPSG-attribution guard filters on `authority == "EPSG"` (`engine/src/crs_catalog.rs:316-319`), so an `OGC` entry carrying EPSG-derived values would pass without attribution — a conscious, recorded decision if taken, not an accident.

**Does not establish:** any help for a stranger's 4326-declared file. That file declares a CRS, so the assertion path refuses it (`engine/src/crs.rs:225-228`) before the catalog is consulted.

**Falsification:** show that the CRS84 entry helps a real 4326 file. It cannot, on the code above — so A's honest claim is only "the refusal is safe", and the observation that would embarrass it is a corpus in which the declared-vs-data order is externally determinable and uniformly x-first, i.e. we are refusing data whose order *is* knowable.

### (B) Establish the data's order from the format specification, in the reader only

**Changes:** in `engine/src/geoparquet.rs` (never in `crs.rs::is_x_first`, `engine/src/crs.rs:120-124`): record **both** facts — the order the definition declares, and the order the data is in, with the rule and spec version that established it. `axis_normalization` stays `none-performed` (`engine/src/envelope.rs:87-88`) because nothing is normalized. Widen the x-first reader set: `renderer/bundle-viewer/src/partition.ts:29` + its per-partition check at `:115-121`, `frontends/canvas-probe/src/geoarrow.ts:90-92`, and the envelope value itself. Add a falsification-only guard (geographic + degree units → refuse if any |latitude| > 90); it can convict a violating producer, never confirm conformance.

**ADRs touched:**
- **ADR-015 §5** — two clauses, precisely. Sentence 1, *"Axis order is established from the definition, never assumed"* (`:56`), becomes: the *declared* order from the definition; the *data* order from the source format's specification where that format states one. Sentence 3, *"A source whose established order is not x-first is refused (`AxisOrderUnsupported`) rather than reinterpreted, because this slice normalizes nothing"* (`:57-59`), narrows to sources where no format rule establishes the data order. Sentence 2 (`AxisOrderUnestablished`) and sentence 4 (`none-performed`) are untouched. The §5 OPEN block (`:150-153`) is *not* answered — B is not normalization, and the normalize-later question stays open.
- **ADR-017** — `$.crs` carries `axis_order` and `axis_normalization` today (`:193`, `:215`; key sets enforced exactly at `renderer/bundle-viewer/src/manifest.ts:86-89`), and digest rows 10-11 pin them (`:362-363`). A second recorded fact means a new manifest key ⇒ `bundle_version` 2, since the viewer refuses unknown keys and unimplemented versions (`renderer/bundle-viewer/src/manifest.ts:256-267`, `:659-667`) and §5's v1 schema lever is spent. §14's reader contract (`:521-525`) is restated.
- **ADR-026** — the definition still travels verbatim and provenance is unchanged; the 2026-09-08 note's last paragraph (`:144-148`) becomes dated-stale.
- **ADR-013** — no new coordinate-space class. Class is compile-time, CRS is runtime instance data (`:27-29`), and a degrees value in a geographic CRS is the same shape as a projected one; what changes is the instance, and §1's warning that class alone confers no ground-truth permission (`:52-58`) is the relevant text.
- **SKP** — an `axis_order` value-domain widening (ADR-026's entry-30 precedent, `:119-129`); a *new key* would be a version question, not a widening.

**Does not establish:** that the file's producer conformed; that any coordinate is correct; any precision or performance claim (ADR-003's and ADR-010 rule 3's evidence is EPSG:2056 only — `RELEASE-0.1.md:953-954`). It licenses no reprojection: docs/05's definitional-equivalence machinery (`docs/05_Data_Engine.md:57-70`) stays owed.

**Falsification:** a file declaring 4326 whose WKB is genuinely latitude-first and whose values all satisfy |lat| ≤ 90 (Swiss-extent degrees do) — it would pass the guard and draw transposed. Second falsifier: a GeoParquet revision that changes the override. Third: an external GeoArrow consumer that reads the field metadata this engine embeds verbatim (`engine/src/geoarrow.rs:97-103`) and re-orders on the declared axis — the declared-vs-buffer contradiction must be resolved against a pinned GeoArrow metadata reading, or B exports the ambiguity.

### (C) Normalize on ingest — out of scope

Transpose at read and record the normalization (`docs/05_Data_Engine.md:64-67`). Out of scope for a slice with no transform service. ADR-013 §2 puts every CRS↔CRS conversion in one engine service (`:64-73`), which does not exist. What would bring C back: acceptance of that service and of the equivalence machinery — at which point ADR-015 §5's OPEN block (`:150-153`), not this ADR, is the venue.

## 4. The display question, separately

A geographic CRS admitted under B still has **no projection**. Degrees would be plotted directly as x and y. The human's binding wording (DECISIONS-PENDING entry 59, `DECISIONS-PENDING.md:37-38`; the correction at `:371-374`): **"no coordinate value is transformed; the display convention is equirectangular"** — and it must be said *in the UI and in the manifest*, because docs/01:21 permits display reprojection only through an explicit, visible map-view transform. An unnamed convention is a silent one.

What the canvas would show: an equirectangular plot, north-south proportions distorted away from the equator relative to any conformal view. What it must not show: any metre-denominated readout. Today's manifest says `display` = the source identifier and `transform` = `none — rendered in source CRS` (`kernel/src/publish/mod.rs:1258-1259`, written at `kernel/src/bundle/mod.rs:748-751`, pinned at `kernel/tests/publish.rs:751-755`, and ADR-017:232-233 calls it a recorded fact, not a placeholder). Under B that string stays literally true and becomes incomplete: it records that nothing was transformed while saying nothing about the convention the pixels are laid out under. A dated appended note is owed (the human's word — `RELEASE-0.1.md:951-953`). Per `RELEASE-0.1.md:947-949` (recorded there; not re-verified in the source files for this draft) `offsetFrame.ts`'s `LocalFrameM`/`RECENTER_MAX_DRIFT_M` and `tileGrid.ts`'s "one metre for a projected CRS" become false names. docs/05:24 ("area in degrees²" unrepresentable) bars any measurement readout in this mode.

## 5. Open questions for the human

1. Pick: **(A)**, **(B)**, or "not yet — leave Proposed".
2. If B: does the format-derived data order belong in the reader only, with `crs.rs::is_x_first` untouched — yes/no?
3. If B: is a *new* manifest key acceptable at `bundle_version` 2 — yes/no? (Alternative: encode both facts in the existing `axis_order` string's value domain, no new key, no bump.)
4. If B: is the |lat| ≤ 90 guard required at admission, or optional — pick one? (It refuses on evidence; it never confirms.)
5. If B: does the guard read row-group statistics, an aggregate over the covering-bbox columns (the reader stores column *paths*, not values — `engine/src/geoparquet.rs:111`, `:117-126`), or the `geo` metadata's own file-level bbox (not read today) — pick one, or defer to the preregistration?
6. If A: add an `ogc-crs84` catalog entry — yes/no? And if yes, does the non-EPSG authority carry an attribution anyway — yes/no?
7. Either way: does the equirectangular wording appear in the manifest as a `crs.display` value change, or as prose in the viewer's CRS panel, or both — pick?
8. Is the refusal message's wording ("emits (easting, northing) only") to be corrected under A as well as B — yes/no? (See note c below.)
9. Sequencing: does ADR-032 precede LOD, as the note at `RELEASE-0.1.md:1045` anticipates — yes/no?

**Architect's recommendation (one line, the drafting agent's, not a ruling):** take B, gated on a preregistration that pre-commits the fixtures in §6 — the refusal currently applies a CRS-definition fact to a buffer whose order the format specifies, and that is the one thing about today's behaviour that is not merely conservative.

## 6. What a preregistration for B must pre-commit

**Fixtures** (all three before any code; the existing `CrsMode::DeclaredLatLonFirst` is not one of them — its arm supplies only the `crs` JSON fragment, `engine/src/fixture.rs:309-314`, so it is a metadata trap over the generator's existing coordinates, per ADR-032:60):

| # | Fixture | Contents |
|---|---|---|
| F1 | 4326-declared, degrees, known bbox | Coordinates x-first per spec; bbox stated in the preregistration as literals |
| F2 | OGC:CRS84-declared, same coordinates | Admitted today's way; must remain byte-identical in output to F1 under B |
| F3 | 4326-declared, \|lat\| > 90 present | A violating producer, convicted by the guard |

**Expected outcomes, written before the run:** F1 admits; envelope records declared `latitude,longitude`, data order `longitude,latitude`, `axis_normalization = none-performed`, plus the rule and spec version. F2 admits with an identical geometry buffer and an identical bbox to F1 (the spec's own equivalence claim, tested rather than assumed). F3 is refused with a typed error naming the guard, not `AxisOrderUnsupported`. All three bundle-publish paths either fail closed on `bundle_version` or emit v2 — stated in advance which. No performance number is claimed anywhere in the piece (docs/08: no numbers, no claim).

**Walkthrough row:** one operator-visible row — open F1 → the CRS panel shows the declared order, the data order, "no coordinate value is transformed; the display convention is equirectangular", and no metre readout → publish → the reference viewer loads it and displays the same three facts. A row that only says "it opened" does not discharge §4.

---

### Architect notes on the sources (not part of the draft)

a. `RELEASE-0.1.md:952-953` cites the `crs_transform` string at `kernel/src/publish/mod.rs:1187`; the string is at `kernel/src/publish/mod.rs:1259` today (the only other occurrences are `kernel/src/bundle/mod.rs:751` and `kernel/tests/publish.rs:752`). Stale line cite in the record — a dated correction is recorded in `RELEASE-0.1.md` Amendment 14 (the custodian).

b. ADR-032:28-30 says the refusal message "misdescribes the file". Confirmed against the source: the misdescription lives in the *doc comment* (`engine/src/error.rs:74-75`, "the EPSG:4326 trap `docs/05` names, in its GeoParquet form"), not in the user-visible string at `:213-217`.

c. Independently of this decision: the user-visible string says the engine "emits (easting, northing) only", but `is_x_first` already admits `LongitudeLatitude` (`engine/src/crs.rs:122-123`), so a CRS84 file is admitted and the message's claim is already too narrow. Small, real, fixable under either candidate — hence open question 8.

Files read for this draft: `docs/adr/ADR-032-…`, `ADR-015-…`, `ADR-026-…`, `ADR-017-…`, `ADR-013-…`, `docs/01_Principles.md`, `docs/05_Data_Engine.md`, `spikes/item8-crs-catalog-extension/README.md`, `engine/src/{dataset,error,crs,geoparquet,geoarrow,envelope,fixture,crs_catalog}.rs`, `engine/src/crs-catalog.json`, `renderer/bundle-viewer/src/{partition,manifest}.ts`, `frontends/canvas-probe/src/geoarrow.ts`, `kernel/src/publish/mod.rs`, `kernel/src/bundle/mod.rs`, `RELEASE-0.1.md`, `DECISIONS-PENDING.md`. No files written by the drafter.
