> **Status: consult — the architect's ADR-032 draft consult of 2026-09-09, for the human's sight.**
> Record, not policy — moved from the untracked `RELEASE-DRAFTS-0.1.0/` directory on the human's round-14 ruling (2026-09-17); nothing here binds, and its cites are historical (advisory in `verify-cites`, never gated).

# Architect consult — ADR-032 draft (2026-09-09, for the human's sight; nothing filed, nothing decided)

*Read-only consult by the architect agent on the custodian's brief, verifying the draft's cites against the tree at `main` 279b43f. The recommendation line is the architect's, not a ruling. The custodian changed nothing but this header.*

*Read-only. Every `file:line` below was opened in this pass unless labelled otherwise. No file written.*

## 1. Verdict on the draft: **pass with notes**

Complete enough to rule on: the fact pattern, the three candidates, the reader/ADR blast radius and the display question are all present, and it decides nothing — the recommendation is labelled and ADR-032 stays Proposed.

**Cites I re-read and found correct:** the pinned spec text and its stated limit (`spikes/item8-crs-catalog-extension/README.md:62-68`, `:74-77`, hash at `:57-59`); the refusal (`engine/src/dataset.rs:302-307`, message verbatim at `engine/src/error.rs:213-217`, doc comment at `:72-76`); the asserted path (`dataset.rs:293-300`); `is_x_first` (`engine/src/crs.rs:120-124`, admitting `LongitudeLatitude` at `:122-123`); the assertion gate (`crs.rs:223-239`); axis establishment (`engine/src/geoparquet.rs:159-189`); covering-bbox stores *paths* not values (`geoparquet.rs:111`, `:117-131`); envelope (`engine/src/envelope.rs:87-88`); readers (`renderer/bundle-viewer/src/partition.ts:29`, `:115-121`; `frontends/canvas-probe/src/geoarrow.ts:90-92`); manifest key sets (`renderer/bundle-viewer/src/manifest.ts:86-89`), unknown-key refusal (`:256-267`), version gate (`:659-667`); ADR-015 §5 and its conflict block (`docs/adr/ADR-015-…:56-60`, `:62-75`, OPEN at `:150-153`); ADR-017 `$.crs` (`:193`, `:215`), digest rows 10-11 (`:362-363`), §14 (`:521-525`), `transform` (`:232-233`); ADR-026 (`:61`, `:144-148`); ADR-013 (`:27-29`, `:52-58`, `:64-73`); docs/01:21; docs/05:24, `:64-67`; the fixture trap (`engine/src/fixture.rs:309-314`); GeoArrow field metadata (`engine/src/geoarrow.rs:97-103`); `crs_transform` at `kernel/src/publish/mod.rs:1259` (note (a) is right; `RELEASE-0.1.md:952-953`'s `:1187` is stale).

**Two cites wrong, both in §4:**
- The quoted wording is *not* at `DECISIONS-PENDING.md:37-38`. Those lines carry only the human's ruling *"equirectangular wording binding for future geographic entries"* (`DECISIONS-PENDING.md:37-38`). The quoted sentence, with the "said in the UI and the manifest" requirement, is the architect's correction recorded at **`DECISIONS-PENDING.md:392-395`**; the ruling's own carrier of the quoted form is **`RELEASE-0.1.md:1041`**.
- The draft's "the correction at `:371-374`" points at the GeoParquet-spec pinning paragraph, not the correction. Correct cite: `DECISIONS-PENDING.md:392-395`.

**One thing the draft left unverified, now verified — and it is more than a naming problem.** `LocalFrameM` is `frontends/shell/src/canvas/offsetFrame.ts:34`, `RECENTER_MAX_DRIFT_M` `:37` (both as recorded); but "one metre for a projected CRS" is at **`frontends/shell/src/canvas/tileGrid.ts:76`**, not `:68-73` — a second stale cite in `RELEASE-0.1.md:948` beside note (a)'s. Substantively: that comment justifies **`MIN_ANCHOR_SPAN = 1`** (`tileGrid.ts:78`) as "one authoritative-CRS unit … small enough to never matter for any real dataset", declared under ADR-010 rule 6. In degrees, one unit is ~10⁵ m. So this is a **declared bound that stops being true in a degrees dataset**, not a false name; §4 treats it as renaming only.

**Two completeness gaps:**
- §3(B)/open question 3 offer "encode both facts in the existing `axis_order` value domain, no new key, no bump" as a cost-free alternative. It is not: `manifest.ts` accepts any string there (`:694`), but `partition.ts:115-121` compares the *envelope* value by equality against `easting,northing`, so a v1 bundle with a widened value is refused by every shipped reader — the dead-artifact shape the record itself names for the 4326 case (`DECISIONS-PENDING.md:379-380`) and the subject ADR-025 was accepted on (`docs/adr/ADR-025-…:3-4`, scoped to ceilings).
- The draft does not say that ADR-017's version exception is **spent and its dated basis expired**: `ADR-017:855-859` ("no further schema change — key, type, or nested member — is available at `bundle_version` 1"), and the "no bundle outside this repository / no external reader" fact is gone since the repository went public 2026-08-03 (`ADR-017:1144-1155`). That is what turns Q3 from preference into a forced answer.
- §6's "either fail closed on `bundle_version` or emit v2" pre-empts Q3 by assuming a v2 exists.

Nothing in it needs blocking; it never rewrites an accepted ADR and never claims a number.

## 2. Block-on-sight conditions

### Either candidate
1. No claim that a producer conformed to the override — a check reporting "verified x-first" rather than "not convicted" fails on sight (`spikes/item8-crs-catalog-extension/README.md:74-77`; docs/01 principle 3).
2. No precision, perf or rendering-quality figure attached to a geographic CRS: ADR-003's and ADR-010 rule 3's evidence is EPSG:2056 (`RELEASE-0.1.md:953-954`); a carried-across number fails on sight (docs/08).
3. No metre-denominated readout, scalebar or area in a degrees dataset (docs/01:21; docs/05:24).
4. No edit to any accepted ADR body — appended amendments only (`ADR-017:660-667`'s own precedent).
5. No refusal message left claiming "emits (easting, northing) only" while `is_x_first` admits `LongitudeLatitude` (`engine/src/crs.rs:122-123` vs `engine/src/error.rs:213-217`).

### (A) only
6. No new catalog entry without the ADR-026 growth gate updated consciously — the ids+count assertion and a per-entry hash pin (`crs_catalog.rs:377-383`, `:291-297`, per `RELEASE-0.1.md:1008`).
7. No non-EPSG entry carrying EPSG-derived values without a recorded attribution decision (the draft's `crs_catalog.rs:316-319` authority filter — the draft's cite, not re-read here).
8. No sentence anywhere saying CRS84 helps a 4326 file: an assertion over a declaring file is refused (`engine/src/crs.rs:225-228`).
9. No limitation text presenting the refusal as a *format* fact — the format says the opposite; the refusal is this project's resolved policy (`ADR-015:62-71`).

### (B) only
10. No establishment of the data order outside the format reader — a diff touching `crs.rs::is_x_first` (`:120-124`) or `crs::admit` (`:218-240`) fails on sight.
11. No B code before the ADR-015 §5 amendment is accepted in the human's own words (ADR-015 is Accepted, architect-blockable — `ADR-015:3`).
12. No new manifest key at `bundle_version` 1 (`ADR-017` §3 + `:855-859`; basis expired, `:1144-1155`).
13. No publish path emitting a geographic bundle while any shipped reader pins `easting,northing` (`partition.ts:29`, `canvas-probe/src/geoarrow.ts:90-92`) — either the readers widen in the same change, or publish refuses geographic sources typed at preflight (`DECISIONS-PENDING.md:379-380`).
14. No test resting on `CrsMode::DeclaredLatLonFirst` as a degrees dataset (`engine/src/fixture.rs:309-314`; `RELEASE-0.1.md:939-941`).
15. No guard reading values the reader does not hold — covering-bbox is field *paths* (`geoparquet.rs:111`, `:117-131`); and no guard described as confirming anything.
16. No GeoArrow export under B without a pinned reading of the GeoArrow metadata spec (URL, date, hash — the item-8 discipline at `README.md:57-59`), since the field carries the declared definition verbatim (`geoarrow.rs:97-103`).
17. No metre-named declared bound left unit-blind: `MIN_ANCHOR_SPAN = 1` (`tileGrid.ts:73-78`) needs a unit-aware declared value or a typed refusal for degrees (ADR-010 rule 6).
18. No equirectangular statement missing any of the three surfaces below.

### ADR-015 §5 amendment — **DRAFT wording, for the human**
> *Amendment (date, appended). §5 sentence 1 carries two facts, not one: the **declared** axis order is established from the CRS definition, never assumed; the **data's** axis order is established from the source format's own specification where that specification states one, and from the definition otherwise. Where the two differ both are recorded, with the rule and the specification version that established the data order, and neither is inferred from the other. Sentence 3's `AxisOrderUnsupported` refusal narrows to sources for which no format rule establishes the data order. Sentence 2 (`AxisOrderUnestablished`) and sentence 4 (`axis_normalization = none-performed`) are unchanged — nothing is normalized. The docs/05 conflict resolution in the quoted block is unchanged: refusing remains permitted. The §5 OPEN block is not answered.*

### ADR-017 consequence — what the constitution forces
A **new key ⇒ `bundle_version` 2**, no exception available (§3; `:855-859`; the population fact expired `:1144-1155`). A **value-domain widening of `axis_order`** is neither a key nor a type change, so §3 does not force a bump — but it does not buy a shippable artifact, because the envelope check is exact equality (`partition.ts:115-121`). So the forced pair is: **v2 with readers widened in the same change, or no geographic publish path at all.** "v1 plus a widened value" is the one option the rules exclude.

### The equirectangular statement — required surfaces
(i) **manifest** — inside `crs.display` (value change, no key) or a new key at v2; `crs_transform` stays literally true and incomplete (`kernel/src/publish/mod.rs:1258-1259`; `ADR-017:232-233`), so a dated appended note on ADR-003 is owed (`DECISIONS-PENDING.md:392-395`); (ii) **reference viewer** — §14 is "verify, **and do**" and already carries display obligations (`ADR-017:513`, `:903-908`); (iii) **the shell at open** — its canvas gates nothing on axis order (`RELEASE-0.1.md:942-943`), so without this a geographic dataset draws with no statement anywhere before publish (docs/01:21).

## 3. Sequencing input (facts; the order is the human's)

**Needed before ADR-032 can start:** the human's pick (`ADR-032:42-44`); if B, the accepted §5 amendment (`DECISIONS-PENDING.md:376-378`); a degree-domain fixture mode, which does not exist (`fixture.rs:309-314`); a pinned GeoArrow metadata reading, which does not exist in the tree (only the GeoParquet page is pinned).

**What it does not block.** The docs/08 scale-class row is defined by **feature/vertex brackets, not by a named file or a CRS** (`NEXT-CUT.md:171-179`), so its dataset class does not depend on ADR-032; a degrees fixture would be one more member of the class.

**LOD coupling, one-directional and small.** Tier/grid derivation is anchor-relative and unit-agnostic except the degenerate-anchor arm: `MIN_ANCHOR_SPAN = 1` "authoritative-CRS unit (e.g. one metre for a projected CRS)" (`tileGrid.ts:73-78`). LOD does not need ADR-032 decided; if B lands first, LOD inherits a declared bound already made unit-aware. If LOD lands first, that constant becomes one more site B must revisit. The LOD companion note's own block-on-sight items (`NEXT-CUT.md:357-368`) are CRS-blind.

**What ADR-032 does not touch:** reprojection or the transform service (`ADR-032:69`; `ADR-013:64-73` — service does not exist); coordinate values (`axis_normalization` stays `none-performed`, `ADR-032:54-55`), so the geometric-protection piece's subject — half-open index ranges (`NEXT-CUT.md:393`) — is disjoint on the record's own description.

**Recommendation (architect's, one line, not a ruling):** *decide* ADR-032 first — the decision is cheap and unblocks limitation/QUICKSTART wording — but *build* it after the geometric-protection piece if the pick is (B), because B alone has three unmet preconditions (no degrees fixture, no accepted §5 amendment, no pinned GeoArrow reading) that the other two items do not.

## 4. Open questions the draft does not list

1. Under B, does a geographic source get a publish path in the first cut, or is publish refused typed at preflight until the readers widen (the ADR-025 shape, whose accepted decision is scoped to ceilings only)?
2. Does `MIN_ANCHOR_SPAN`'s declared value get made unit-aware in ADR-032's cut, in LOD's, or by a typed refusal for degrees?
3. Must the GeoArrow metadata reading be pinned (entry-51 discipline) *before* B is dispatched, as the GeoParquet text was for item 8 — i.e. is its absence a block on dispatch?
4. Under A, does KNOWN-LIMITATIONS gain a dated line saying the format states the opposite, so the refusal reads as policy rather than as a format fact?
5. Does the equirectangular statement bind the shell's own canvas surface, or only the publish/viewer surfaces?
6. Which document is the *home* of the binding equirectangular wording — ADR-032's decision text, or an appended ADR-003 note (the record so far names only that the note is "owed")?

**Files read:** the ADR-032 draft; ADR-032, ADR-015, ADR-017, ADR-025; `frontends/shell/src/canvas/tileGrid.ts`; `DECISIONS-PENDING.md`; `RELEASE-0.1.md`; `NEXT-CUT.md`; the engine and viewer sources the draft cites.
