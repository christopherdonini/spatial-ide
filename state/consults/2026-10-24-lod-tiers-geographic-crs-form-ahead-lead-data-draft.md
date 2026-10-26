*Custodian's filing note (2026-10-24): lead-data's form ahead for `lod-tiers-geographic-crs`, drafts only by the human's word, read only at main ae8cfdcc. Nothing is committed from it until the node is placed and its paths are free. The run 14:18:32Z to 14:29:38Z by its transcript (Grep 37, Read 36, Glob 6; no write and no shell). Extracted by script from its SubagentHandback call, with one final newline added; nothing else is changed. Its sha256, from line 5 to the end, is 6ce7c07b29d4304584d84d3a196ac181015498a71330e5b870ace29c1a258eaf.*

---

Drafted: lod-tiers-geographic-crs, a form ahead, at main ae8cfdcc

I read only at ae8cfdcc and changed no file. I have no shell, so this report carries no sha256 and every pin below still needs its hash computed. The whole draft is in my own words. The only quoted text is two short spans from docs/01 and the reuse-index lines, both byte-copied and marked.

Blocking questions for the human (details under OPEN items below):
- OPEN-5: lift the refusal at all, and if so by which method? I recommend per-feature conversion at the latitude nearest the equator.
- OPEN-1: may `LodTierKey`, the key set the human accepted in round 3, gain the source's coordinate space and the conversion rule?
- OPEN-2: where does the ellipsoid come from?
- OPEN-3: should `edges` and `epoch` be read and refused or carried across? This needs a pinned spec text first.
- OPEN-4: is a square-metre value in tiers.json for a degrees dataset forbidden by ADR-013 Amendment 1 item 7 and ADR-032?

---

# The draft form

**Proposed path:** `engine/LOD-GEOGRAPHIC-CRS-PREREGISTRATION.md`. It is committed only once the node is placed and its paths are free (see Rule (00) below).

## Header

- **Title:** Preregistration: LOD tiers for a source in a geographic CRS.
- **Authority:**
  - the node, `PLAN.yaml:5652-5668 @ ae8cfdcc` (status proposed);
  - the forms-ahead word, `state/directives/2026-10-24-weekend-exception-third-product-slot-placements-forms-ahead-250-click.md:17 @ ae8cfdcc`;
  - RULED 2026-10-21 (headed), item 2e, `state/directives/2026-10-20-232-redaction-go-22-rows-placed-d1-b-accepted-234-items-45-46-yes-s5d-a-ttl-ten-minutes-plan-practice-stands.md:15 @ ae8cfdcc`;
  - the owed gate, `engine/LOD-PREREGISTRATION.md:342 @ ae8cfdcc` (Amendment 1 (ii), on RULED 2026-09-16, question round 3, item 1).
- **Guardrails line:** it meets R1, R6 and R10 of `state/consults/GUARDRAILS-EPOCHS-HEIGHTS-DGGS-2026-10-12.md` (:17, :27, :35), and R5 (:25) if OPEN-3 is (a). It was checked against that brief's §3 row for `build_tiers` (:46).
- **Drafted by** lead-data from the inputs cited below, read at main ae8cfdcc.
- **Committed before any code.** Append-only once committed. An amendment written after any outcome has been seen says so in its first line.

### Which form applies, and why: the full form

- **A §21a category applies** (`AUTONOMY.md:315-332 @ ae8cfdcc`). The piece changes a property currently under test. T8, `geographic_crs_source_is_refused_for_tier_building` (`engine/tests/lod_tier_builder.rs:1025-1056 @ ae8cfdcc`), asserts the refusal this piece lifts.
- It also touches the CRS-is-a-type invariant (`docs/01_Principles.md:21 @ ae8cfdcc`).
- It reopens two choices the human pre-committed:
  - the refusal itself (`engine/LOD-PREREGISTRATION.md:91 @ ae8cfdcc`, accepted in round 3, item 1);
  - the key set (`engine/LOD-PREREGISTRATION.md:113 @ ae8cfdcc`).
- **Size.** My estimate is about 850 changed lines over 7 files plus this form, which is above §21c (`AUTONOMY.md:347-357 @ ae8cfdcc`).
- **Consequence for placement.** The piece cannot go in the weekend third slot, which takes §21c-sized five-line forms only (the directive's line 8). It takes both gates from dispatch.

## §0. Disclosure

- **No geographic tier has ever been built.** No spike, pilot or consult exists for one.
- **Nothing carries across from `engine/LOD-RESULTS.md`.** Its figures are EPSG:2056 only, and ADR-013 Amendment 1 item 8 (`docs/adr/ADR-013-typed-coordinate-spaces-and-provenance.md:314-316 @ ae8cfdcc`) forbids carrying any figure to a geographic instance.
- **Reuse index, as the custodian's brief carried it** (byte-copied):
  `$ node tools/reuse.mjs lod tiers geographic crs` → `No prior art recorded for "lod tiers geographic crs". Research it before planning an implementation.`
  `$ node tools/reuse.mjs geographic level of detail` → `No prior art recorded for "geographic level of detail". Research it before planning an implementation.`
  - The miss is noted here. The method in §2 is my own derivation from the ellipsoid's area element, and its unit tests (G7, G8) pin it.
- **Hypotheses**, each labelled with the test that discriminates it:
  - the area scale falls monotonically with latitude (G8);
  - the open path admits the fixtures in §3 (invalidator I-1).
- **Fixture-drive confound:** none. Nothing is measured against the 5 GB fixture.

## §1. What this may and may not claim

- **No numbers.** No performance, precision or cancellation-latency figure, and no `docs/08` row, for a geographic tier. See ADR-013 Amendment 1 item 8, and ADR-032's Consequences (`docs/adr/ADR-032-geoparquet-source-declaring-a-non-x-first-axis-order.md:42 @ ae8cfdcc`).
- **No wire change.**
  - No SKP command reaches `build_tiers`.
  - The new refusal identifiers would ride the existing `engine.lod_refused` arm's `refusal` field (`kernel/src/skp.rs:2700-2707 @ ae8cfdcc`).
  - `protocol/` is untouched.
- **No ADR is amended and no ADR status changes.** ADR-031 stays a reserved number. Cited: ADR-010 rules 5 and 6, ADR-013 Amendment 1, ADR-026, ADR-028, ADR-032. ADR-011 is not cited.
- **No reprojection** and no transform library (no `Cargo.toml` change).
- **Strings the app could show are P6 placeholders:** every new refusal detail and every new tiers.json description.
- **Selection, residency and the shell surface stay out of scope**, as in the LOD form.

## §2. The change, stated before code

### Admission to the geographic path

- A source takes the geographic path exactly when `Dataset::is_geographic_degrees_instance()` is true (`engine/src/dataset.rs:1040-1043 @ ae8cfdcc`), that is, the admission recorded `degree` on both axes.
- The unit comes from the admission record, not only from the definition. Today the builder reads only the definition (`engine/src/lod.rs:453-477 @ ae8cfdcc`), so a format-default OGC:CRS84 source, which has no definition, is refused as unit-undeclared. Under this piece the unit's source is `unit:definition` or `unit:format-rule` (`engine/src/geoparquet.rs:746-766 @ ae8cfdcc`).
- The data axis order must be `LongitudeLatitude`. Otherwise the build is refused typed, `engine.lod_axes_not_longitude_latitude` (identifier mine).
- Every non-degree path keeps today's logic and messages byte for byte (`engine/src/lod.rs:485-546 @ ae8cfdcc`). So a GeographicCRS with any other angular unit, or with no established unit, is still refused as `engine.lod_crs_not_linear`.

### The design question: what a minimum triangle area means in degrees (my words)

The ladder stays `[0.1, 1.0, 5.0]` square metres (`engine/src/lod.rs:79 @ ae8cfdcc`). A threshold in square degrees is ruled out: the source text (`docs/01_Principles.md:21 @ ae8cfdcc`) reads `"area in degrees²" is unrepresentable` (byte-copied), and a square degree is not a uniform area anyway.

Recommended method (OPEN-5, option G1):

1. For each feature, take its own latitude band [ymin, ymax].
2. Its reference latitude φ0 is the latitude in that band nearest the equator: 0 if the band spans 0, otherwise min(|ymin|, |ymax|). φ0 is capped at `LOD_GEOGRAPHIC_REFERENCE_LATITUDE_CAP_DEGREES`.
3. The ellipsoid's area element, in m² per square degree, is k(φ) = (π/180)² · M(φ) · N(φ) · cos φ.
4. The feature's epsilon handed to `simplify_vw_preserve` is A_m² / k(φ0). It is computed per feature, inside the existing per-feature call (`engine/src/lod.rs:1569 @ ae8cfdcc`).

Why this choice (my derivation, to be pinned by G8):

- k(φ) decreases monotonically in |φ| for any ellipsoid with e² < 1/4.
- So for every triangle VW removes inside the feature's band, its area on the ellipsoid is below the declared A. This holds for planar edges in lon/lat, which is why OPEN-3 matters.
- The bound is conservative: high-latitude parts are simplified less, never more.
- The cap only lowers epsilon, so the bound still holds under it.

What a tier's cell, extent and precision mean in degrees:

- **Cell:** this builder has no cell, tile or grid. A tier is a whole simplified copy of the source. The shell's per-unit tile-grid constants are untouched. R10 holds: a tier is a drawing resource, never a location.
- **Extent:** each tier row's covering bbox is the simplified geometry's own extent in degrees (`engine/src/lod.rs:1595 @ ae8cfdcc`). That is a coordinate extent, never recorded in metres.
- **Precision:** f64 in, f64 WKB out, encoding unchanged. No precision figure is claimed.
- **Antimeridian:** a ring is simplified exactly as its planar lon/lat coordinates state it, with no special case.

### Refused, and how

All refusals are typed `EngineError::LodRefused`. The details are P6 placeholders.

- **New identifiers:**
  - `engine.lod_crs_ellipsoid_undeclared` (under OPEN-2 (b)) is checked before any byte is hashed or written.
  - `engine.lod_latitude_out_of_domain` fires on any vertex with |latitude| > 90. It is per feature: the build stops and the partial tier is removed by the existing recovery path (`engine/src/lod.rs:1321-1335 @ ae8cfdcc`).
  - `engine.lod_axes_not_longitude_latitude`.
  - `engine.lod_edges_not_planar` (under OPEN-3 (a)).
- **Narrowed:** `engine.lod_crs_not_linear` now covers non-degree angular units only. Its doc comment (`engine/src/lod.rs:178-184 @ ae8cfdcc`) is updated to say that the dated gap is discharged by this form.

### Key and record (OPEN-1)

- `LodTierKey` (`engine/src/lod.rs:249-264 @ ae8cfdcc`) gains two members:
  - `crs_identity`: the admitted definition's sha256, or the format rule reference where there is no definition;
  - `area_scale`: either linear with its factor, or geographic with its ellipsoid parameters, the reference-latitude rule and the cap.
- `LOD_BUILDER_VERSION` goes from 1 to 2 (`engine/src/lod.rs:88 @ ae8cfdcc`).
- Why: today the key names no space. A file whose `crs` is null, opened under two different assertions, has one content hash, so a tier built under one assertion would be admitted under the other. That is my reading of `engine/src/lod.rs:679-691`, `:1052` and `:1167-1180 @ ae8cfdcc`, and it is untested. It fails R1 and R6.
- **Geographic records carry no square-degree value.**
  - tiers.json (`engine/src/lod.rs:694-723 @ ae8cfdcc`) gets an `area_scale` block instead of `min_triangle_area_source_units` and `area_unit` (`:701-702`). The block holds the method, the ellipsoid parameters and their provenance, and the cap.
  - `TierRecord::min_triangle_area_source_units()` becomes `Option<f64>`, `None` for a geographic record.
- The tier footer keeps its source's CRS provenance exactly. A format-default source writes no `crs` key (`engine/src/lod.rs:1710-1734 @ ae8cfdcc`), so its tier opens as format-default too. This is now asserted (G2).

### Portability (`docs/PREREGISTRATION-TEMPLATE.md:177 @ ae8cfdcc`)

- The piece adds no OS-dependent behaviour.
- Building tiers stays wherever `build_tiers` reaches: Windows today (`engine/LOD-PREREGISTRATION.md:386 @ ae8cfdcc`), plus whatever port-2 adds when it merges.
- Tests that build tiers carry the same `cfg_attr(not(windows), ignore)` boundary as their siblings (pattern at `engine/tests/lod_tier_builder.rs:1111-1115 @ ae8cfdcc`), or port-2's replacement for it.
- The pure conversion unit tests run on every platform.
- No user-visible reduction, so no KNOWN-LIMITATIONS item.

## §3. Fixtures and pre-declared outcomes

| # | Fixture | How it is written | Outcome predicted |
|---|---|---|---|
| F-A | format-default OGC:CRS84 | `write_geoparquet`, `CrsMode::AbsentKey` + `CoordinateDomain::Wgs84Degrees` (`engine/src/fixture.rs:125`, `:72-73 @ ae8cfdcc`) | three tiers, 0 invalid, identity and row order preserved; opens as format-default with `unit:format-rule` |
| F-D | declared CRS84 with a datum ensemble and WGS 84 ellipsoid | the test file's own `write_source`-style helper | as F-A, opening as `crs:declared` with `unit:definition` |
| F-N | declared CRS84 without a datum | `CrsMode::DeclaredCrs84Degrees`; the helper writes no datum (`engine/src/fixture.rs:714-722 @ ae8cfdcc`) | refused `engine.lod_crs_ellipsoid_undeclared`, no tier directory (under OPEN-2 (b)) |
| F-L | F-D with one vertex at latitude 91 | helper | refused `engine.lod_latitude_out_of_domain`, no tier file left |
| F-U | CRS84 with no unit on either axis | `CrsMode::DeclaredAxisUnitAbsent` (`engine/src/fixture.rs:777 @ ae8cfdcc`) | refused `engine.lod_crs_not_linear`, unchanged |

- No reduction expectation is declared, because nothing has been measured.
- Fixtures are hash-recorded before and after.
- `engine/src/fixture.rs` is not edited (see §8).

## §4. Tests, and one mutation per new test

| # | Test | Mutation that makes it fail by name |
|---|---|---|
| G1 | `a_format_default_geographic_source_builds_three_valid_tiers` (F-A) | Restore the degree-instance refusal → `Err` instead of `Ok`. |
| G2 | `a_geographic_tier_opens_as_a_degrees_instance_with_its_sources_provenance` (F-A, F-D) | Write a CRS84 definition into the tier footer for a definition-less source → the tier opens as `crs:declared`. |
| G3 | `a_declared_geographic_source_takes_its_ellipsoid_from_its_definition` (unit test in lod.rs, a synthetic GeographicCRS on the Bessel 1841 parameters from `engine/src/crs-catalog.json:8 @ ae8cfdcc`) | Always use the WGS 84 constants. |
| G4 | `a_geographic_definition_without_an_ellipsoid_is_refused` (F-N) | Default an absent ellipsoid to WGS 84 → the build returns `Ok`. |
| G5 | `a_tier_built_under_one_asserted_crs_is_not_admitted_under_another` (same bytes, `crs: null`, two catalog assertions) | A hand-written `PartialEq` that skips `crs_identity` → reuse, where `KeyMismatch` was expected. |
| G6 | `a_latitude_outside_the_geographic_domain_is_refused_by_name` (F-L) | Delete the domain check → a negative epsilon reaches the simplifier and the build returns `Ok`. |
| G7 | `the_reference_latitude_is_the_one_nearest_the_equator_and_capped` (unit test; bands (10,20)→10, (−20,−10)→10, (−5,5)→0, (88.5,89.9)→cap) | Use the band's mid latitude. |
| G8 | `the_area_scale_falls_with_latitude_so_the_bound_holds_across_the_band` (unit test) | Drop the cos φ factor. |
| G9 | `a_geographic_tier_record_carries_no_square_degree_area` (F-A tiers.json; the accessor returns `None`) | Emit `area_unit: format!("square {}", unit.name)` for a geographic record. |
| G10 | `a_non_degree_angular_crs_is_still_refused` (grad, helper) | Treat any angular unit as degrees. |
| G11 (OPEN-3 (a)) | `a_spherical_edges_source_is_refused_for_tier_building` | Skip the edges check. |
| G12 (OPEN-3 (a)) | `the_sources_epoch_and_edges_members_are_carried_into_the_tier_footer` | Drop the copy. |
| G13 | `the_wgs84_constants_equal_the_catalogs_pinned_ellipsoid` (`engine/src/crs-catalog.json:21 @ ae8cfdcc`, inside the epsg-3857 entry that begins at `:16`) | Change one digit. |

Changed tests, each re-observed under its existing recorded mutation:

- **T8, name kept.** It is claimed by name in the LOD form (`engine/LOD-PREREGISTRATION.md:201 @ ae8cfdcc`), so the name stays. Its fixture moves to F-U and it still asserts `engine.lod_crs_not_linear`. This form records the LOD form's T8 row as narrowed.
- **The kernel seam test** `an_engine_produced_lod_refusal_reaches_the_wire_as_engine_dot_lod_refused` (`kernel/src/skp.rs:2649-2714 @ ae8cfdcc`). Its fixture mode at `:2679` moves to `DeclaredAxisUnitAbsent`, and its identifier assertions stay.
- **Call sites updated** for the key and accessor signatures: `engine/tests/lod_tier_builder.rs:839`, `:920`, `:1211`, `:1456`, and `engine/tests/lod_tier_measurements.rs:170 @ ae8cfdcc`.

## §5. Predictions, declared unchanged, invalidators, falsification

**Predictions** (wrong is a result):

- P1: 0 invalid output on F-A and F-D at every rung.
- P2: identity and row order preserved.
- P3: each tier opens as a degrees instance with its source's provenance.
- P4: vertex counts do not increase from rung to rung (direction only, no number).
- P5: every refusal in §3 fires before a tier file survives.

**Declared unchanged:**

- the projected path: epsilon, messages, refusals and order of checks;
- the ladder, `LOD_CANCEL_*`, the per-tier and set ceilings, and the preflight;
- `geoparquet.rs`, `crs.rs`, `dataset.rs` and `fixture.rs`;
- no product caller of `build_tiers`;
- KNOWN-LIMITATIONS item 44 (`KNOWN-LIMITATIONS.md:197 @ ae8cfdcc`) stays true of the app. It owes a revision when a product caller lands, if OPEN-3 (a) is taken.

**Invalidators** (each stops the piece):

- I-1: the open path refuses F-A or F-D. Stop; there is no admission change in this piece.
- I-2: any invalid output. The LOD form's I2 is inherited: return to the human, no rescue step.
- I-3: a `fixture.rs`, `dataset.rs` or `geoparquet.rs` edit becomes necessary.
- I-4: port-2 changes `build_tiers`' root or preflight shape. Rebase onto it; never merge over it.
- I-5: OPEN-3 (a) chosen and the `edges` text cannot be pinned in-tree.

**Falsification:** a square-degree value reaches any record, accessor or message; or a tier's CRS provenance differs from its source's; or G8's monotonicity fails.

## §6. Instruments

All are assertions: typed outcomes, the record's keys, the opened tier's admission record, and vertex counts. There are no measurements and no tester gate.

## §7. Declared values and ceilings (each at its own site in `engine/src/lod.rs`)

- `LOD_GEOGRAPHIC_REFERENCE_LATITUDE_CAP_DEGREES = 89.0`, my proposal. Any cap keeps the bound; this one limits epsilon's growth to 1/cos 89°, about 57× its value at the equator (my arithmetic).
- `WGS84_SEMI_MAJOR_AXIS_METRES = 6378137.0` and `WGS84_INVERSE_FLATTENING = 298.257223563`, used for format-default sources only. Their source is the pinned catalog's WGS 84 ellipsoid (`engine/src/crs-catalog.json:21 @ ae8cfdcc`), and G13 ties them to it.
- `LOD_BUILDER_VERSION = 2`.
- The new identifiers listed in §2.
- **Line budget:** ≤ 950 changed lines over ≤ 8 files, this form excluded, under §21c's counting rule. An overrun is recorded as class 8.

## §8. Block-on-sight

1. A square-degree value in any record, accessor, message or comment presented as an area.
2. Any reprojection, transform library or manifest change.
3. A default ellipsoid for a definition that declares none (under OPEN-2 (b)).
4. A tier whose CRS provenance differs from its source's.
5. Any edit to `engine/src/fixture.rs`, `geoparquet.rs`, `crs.rs` or `dataset.rs`.
6. Any figure for a geographic tier.
7. A product caller of `build_tiers`.
8. Any change to the projected path beyond OPEN-1's key members.
9. The LOD form's §8 items 5 to 9, inherited.
10. `edges` or `epoch` read anywhere outside `lod.rs`.

## §9. Gates

- **Architect:** full; ADR-013 Amendment 1 items 6 to 8, ADR-032's Consequences, R1, R6 and R10, and §8 one by one.
- **Reviewer:** full diff.
- **Suites:** G1 to G13 and the changed tests green, each mutation observed by name; `verify-test-claims` green with T8's name kept.
- **Tester:** none, because nothing is measured.
- **Operator:** none, because there is no surface and no product caller.
- **The human:** OPEN-1 to OPEN-5, and the P6 strings.

## §10. Amendments

Opens empty; append-only from the first commit.

---

# Rule (00): path overlap with the in-flight pieces

**This piece's paths:**

- `engine/src/lod.rs`
- `engine/tests/lod_tier_builder.rs`
- `engine/tests/lod_tier_geographic.rs` (new)
- `engine/tests/lod_tier_measurements.rs`
- `kernel/src/skp.rs` (test module only)
- `engine/README.md` (owner's index: the LOD row and the preregistration list, `:543`, `:550`, `:560`)
- `kernel/README.md` (owner's index: "kernel halves of pieces filed elsewhere", `:389`)
- the form itself

**Overlaps:**

- **port-2:** `engine/src/lod.rs` and `engine/tests/lod_tier_builder.rs`, directly. Its other LOD test files (`lod_tier_cancellation.rs`, `lod_tier_preflight.rs`, `lod_tier_root.rs`) are not edited here.
- **#241:** `engine/README.md` and `kernel/README.md`, for the owner's-index updates.
- **covering-case:** `engine/README.md`'s owner's index, after #241 merges.

**No overlap with:** 1c step 1, `b1-shell-half`, #244, #249, #251, or the AUTONOMY §36 PR. `engine/src/fixture.rs` (#241) is used but not edited; §8 item 5 makes that binding. Nothing touches `protocol/`. No KNOWN-LIMITATIONS item is touched.

**So this piece cannot start until port-2 merges.** Its index rows also wait for #241 and covering-case's index update.

# OPEN items, each with options and my recommendation

- **OPEN-5, the method.**
  - (G1) per-feature conversion at the latitude nearest the equator, as in §2;
  - (G3) one dataset-wide scale from the dataset's extent: simpler, but it under-simplifies wide datasets more and needs a dataset bbox;
  - (G2) a ladder declared in square degrees, which docs/01:21 rules out;
  - (D) a geodesic VW of our own, which is new correctness surface;
  - (C) reprojection, which needs a transform library: a new dependency, so a red line;
  - (K) keep the refusal, which would contradict Amendment 1's dated gap.
  - **Recommend G1.**
- **OPEN-1, the key** (a pre-committed set; the human's word).
  - (a) add `crs_identity` and `area_scale`, and bump the builder version;
  - (b) bump the version only, which leaves the asserted-CRS gap open and fails R1 and R6;
  - (c) a separate geographic key type.
  - **Recommend (a).**
- **OPEN-2, the earth model.**
  - (b) read the top-level `datum` or `datum_ensemble` ellipsoid from the definition, never from `base_crs`; refuse when it is absent; WGS 84 constants for format-default only. This is consistent with §2c's no-default-factor rule;
  - (a) WGS 84 always, recorded as such;
  - (c) a declared sphere.
  - **Recommend (b).** Cost: our own CRS84 fixture mode carries no datum, so F-D needs a test-local definition.
- **OPEN-3, `edges` and `epoch`.**
  - (a) `lod.rs` reads the source `geo` column's `edges`: absent or `planar` is admitted, anything else is refused. It also carries `epoch` and `edges` verbatim into the tier footer (R5). This needs GeoParquet's `edges` text pinned in-tree first (ADR-032 decision 6, `:30`). I found no pin: no `edges` text in `spikes/item8-crs-catalog-extension/README.md`, and `engine/ADMISSION-PREREGISTRATION.md:94` only records one file's value.
  - (b) admit only an explicit `planar`. The of-record corpus manifest has 18 `"edges": null` entries and one `"planar"` (`engine/compat-corpus/of-record/MANIFEST.json:2434 @ ae8cfdcc`), so (b) refuses nearly all of it.
  - (c) ignore `edges`. A spherical-edges source would then be simplified as if planar, a meaning change nothing reports.
  - **Recommend (a).** The custodian pins the text before code.
- **OPEN-4, the square-metre record in degrees mode.** Context: ADR-013 Amendment 1 item 7 (`:309-312`) and ADR-032's Consequences (`:39`) forbid a metre-denominated area readout for a degrees dataset.
  - (a) read tiers.json's `min_triangle_area_square_metres` as a recipe parameter (a bound per removed triangle), not a readout of the data. Its wording is P6;
  - (b) treat it as a readout, which needs an ADR-013 amendment.
  - **Recommend (a).** The reading of an Accepted ADR is the human's.

# What I could not settle

- **Re-derivation needed.** I could not run anything. Whether `Dataset::open` admits F-D, F-L and the grad definition is unverified (I-1), as are the line estimate and the 300-minute budget. The budget looks tight for about 850 lines.
- **A finding outside this scope** (my reading, untested): `tier_footer_metadata` writes a caller-asserted definition into the tier as the tier's own `crs` (`engine/src/lod.rs:1711-1734 @ ae8cfdcc`). A tier of an asserted source would therefore open as `crs:declared`, against R8 (`:31`). Not widened here; I suggest a separate node.
- **The node's record.** Its `needs_human` reads `none` while this form carries five questions for the human. That is the custodian's to update.
- **Hashes.** All pins here need their sha256 computed by someone with a shell.

**Report path:** C:/dev/spatial-ide/state/consults/2026-10-24-lod-tiers-geographic-crs-form-ahead-lead-data-draft.md
**sha256:** not computed (no shell). The custodian hashes the filed bytes.
