> **Status: draft — Brief A P0 digest for the human's ruling, assembled 2026-09-13; superseded by the RULED blocks in `DECISIONS-PENDING.md`.**
> Record, not policy — moved from the untracked `RELEASE-DRAFTS-0.1.0/` directory on the human's round-14 ruling (2026-09-17); nothing here binds, and its cites are historical (advisory in `verify-cites`, never gated).

# Brief A P0 digest

*For the human's sight, on a phone. Assembled 2026-09-13 from `main` at 84e3035 (read-only; no other
file in the tree was touched).*

**What this is.** Brief A's P0 records — the admission preregistration's classification rules and
corpus manifest, and the five Proposed ADR texts — merged to `main` in PR #44 on 2026-09-11 without
the human's sight. P3 is held until the human rules.Open rulings that touch Brief A: entry 73 (the polygon-only gate and the P6 sight list) and entry 83's question whether P3 is released. Entries 80 and 81 were ruled on 2026-09-11; their outputs are the branch commits quoted below, held in PR #46.
Every quoted block below is copied mechanically from its named file and section; the only changes
are line re-wrapping at ~100 columns and the §3 table rendered as one block per file, cell text
unchanged. Two items the brief names are not on `main`: the ADR-013 draft's "Clarification appended
2026-09-11" and preregistration §14 item V exist only on branch `cut/admission-format-semantics` at
a5d0832 (unmerged, after #44); they are quoted from that commit and labelled so.

## Contents

Part 1. Preregistration §2 — the classification rules
Part 2. Preregistration §3 — the corpus manifest (12 files)
Part 3. Preregistration §14 — P2 amendments (I–IV on main; V on the branch)
Part 4. ADR-013 amendment — Proposed text 1–8, and the 2026-09-11 clarification
Part 5. ADR-015 amendment — Proposed text
Part 6. ADR-016 amendment — Proposed text
Part 7. ADR-028 amendment — Proposed text
Part 8. ADR-032 — Status and Decision

---

## Part 1 — preregistration §2, the classification rules

*Source: `engine/ADMISSION-PREREGISTRATION.md` §2 (2a–2e), `main` 84e3035 lines 35–74. Verbatim;
long lines re-wrapped.*

## 2. The classification rules — stated before they are applied

Rules run in the reader's own order. **The admission table records the first outcome reached**, so a
file may never reach a rule this cut adds.

### 2a. Pre-existing gates (unchanged by this cut, listed because they fire first)

- **R-P1** Not a readable file → `EngineError::Source` (`dataset.rs:241-243`).
- **R-P2** No `geo` key in the footer → `EngineError::GeoMetadata` (`dataset.rs:684-686`).
- **R-P3** `geo.version`, `geo.primary_column`, `geo.columns.<primary>` or `encoding` missing →
  `EngineError::GeoMetadata` (`geoparquet.rs:61-86`); `geo` not JSON → same (`geoparquet.rs:58-59`).
- **R-P4** `encoding` ≠ WKB → `EngineError::GeoMetadata` (`dataset.rs:269-274`).
- **R-P5** `geometry_types` non-empty and not all `Polygon` → `EngineError::GeoMetadata`
  (`dataset.rs:275-282`). **This gate is not changed by Brief A and refuses `Point`, `MultiPolygon`
  and mixed lists.** Whether it is widened is DECISIONS-PENDING entry 73, the human's.
- **R-P6** Geometry column absent or non-binary → `EngineError::Source` (`dataset.rs:872-888`).

### 2b. CRS provenance (boundary 1)

- **R-C1 Pinned-version precondition.** The format rules R-C2/R-C4 apply only when the file's
  declared `geo.version` has its governing text **pinned in-tree** under the entry-51 discipline
  (URL, retrieval date, page sha256). Before this cut only 1.1.0's axis-order passage was pinned
  (`spikes/item8-crs-catalog-extension/README.md:55-72`), and the absent-key default was pinned for
  **no** version; Appendix A of this file pins the `crs` text for 1.0.0, 1.1.0, 2.0.0-rc.1 and
  `main`; the precondition holds for `1.0.0` and `1.1.0`, and **not** for a file declaring `2.0.0`
  until `v2.0.0` is tagged and pinned (§3's note). A file declaring an unpinned version takes **no**
  format rule; an absent key refuses under the existing `EngineError::CrsUndeclared` with `detail`
  naming the unpinned version. Applying a rule from a specification version the file does not claim
  would be a guess (docs/01 principle 8).
- **R-C2 Absent `crs` key** → admitted as OGC:CRS84 with provenance `crs:format-default`, carrying
  the spec version and the pinned-rule reference. The provenance value is recorded on the envelope
  and surfaced in `describe.crs.provenance`.
- **R-C3 Explicit `crs: null`** → unchanged: not a declaration; `CrsUndeclared` unless the caller
  asserts (`geoparquet.rs:98-109`, `crs.rs:236-239`).
- **R-C4 Declared CRS whose definition axis order is not x-first** → the **data** order is
  established from the format's WKB override, provenance `axis:format-override`; **the definition's
  own declared order is retained as a recorded fact** and is never discarded. Reader-only:
  `crs.rs::is_x_first` (`:120-124`) and `crs::admit` (`:218-240`) are not touched.
- **R-C5 Declared CRS, x-first** → admitted-as-declared, no provenance marker beyond `crs_source =
  file` (`envelope.rs:72-74`).
- **R-C6 Caller assertion** → unchanged in every respect (`crs.rs:203-240`), including refusal over
  a declaring file.

### 2c. The sanity check (boundary 2)

- **R-S1 Level selection, in order.** `metadata` if the geometry column carries a `bbox` member
  **or** the covering columns carry Parquet statistics (both footer-resident); else `sample` — the
  **first row group of the covering bbox columns only**, capped at `SANITY_SAMPLE_MAX_ROWS` (§7);
  else `none`. Never two levels, never all coordinates, never a WKB decode at open.
- **R-S2 Conviction.** The check applies only where a format rule supplied the CRS (R-C2). A
  coordinate outside ±180/±90 convicts the assumed CRS84 →
  `engine.format_default_contradicted{detail}`. A file inside the domain is **not** thereby correct
  (a projected file may sit inside it); KNOWN-LIMITATIONS says so verbatim.
- **R-S3 Covering pointing at columns absent from the probed schema** → level `none` with the reason
  recorded. Open still succeeds; today's code accepts such a covering at parse (`geoparquet.rs:111`,
  `:117-131` check only that the path is strings) and fails later at query. Refusing at open instead
  is a user-visible behaviour change and is on §12's human list, not taken here.

### 2d. Identity class (boundaries 3, 6, 7)

- **R-I1 native** — the file carries an `id` column admissible under ADR-016; full verification scan
  runs, unchanged (`dataset.rs:741-831`).
- **R-I2 mapped** — a caller declaration; verification scan runs, unchanged.
- **R-I3 session-ordinal** — reached when neither R-I1 nor R-I2 yields an admissible identity on a
  **single-file** source: identity = (generation G, `file_row_number`). **No whole-file read, no
  content hash, no uniqueness scan** (boundary 6). The ADR-016 candidate list is still reported so
  an operator can declare a mapping.
- **R-I4 refused** — partitioned source on the R-I3 path →
  `engine.identity_ordinal_partitioned_unsupported` (boundary 7); or any pre-existing typed identity
  refusal on the native/mapped path.

### 2e. Change detection (boundary 4)

- **R-D1** Descriptor = byte size, mtime, footer length, footer hash; footer hash omitted and the
  degradation shown when the footer exceeds §7's ceiling (boundary 5).
- **R-D2** Checked before every query issue and after every stream terminal. A difference in **any**
  component invalidates G → `engine.source_changed{detail: <which component>}`.
- **R-D3** The descriptor is a change detector, not what makes ordinals unique; uniqueness within a
  generation is by construction (boundary 3).

---

## Part 2 — preregistration §3, the corpus manifest

*Source: `engine/ADMISSION-PREREGISTRATION.md` §3 preamble, `main` 84e3035 lines 78–81. Verbatim;
long lines re-wrapped.*

## 3. The compatibility-corpus manifest — one row per file, two pre-declared outcomes

Hashes are the first 12 hex of each `observed` block's `sha256` in `MANIFEST.json`. "Today" = the
tree at `main` 279b43f, derived from the cited lines. "Brief A" = the rules in §2 with the polygon
gate (R-P5) **held** (DECISIONS-PENDING entry 73 pending). Every axis-dependent row is resolved from
the manifest's `crs_axis_directions`; nothing here is conditional.


*Source: `engine/ADMISSION-PREREGISTRATION.md` §3 table, `main` 84e3035 lines 82–95. Eight-column
table rendered as one block per file; every cell's text verbatim; long cells re-wrapped. Column
names are the table's own.*

**#1 — `geopandas/gp-epsg2056-intkey.parquet`**

- pipeline: GeoPandas/pyarrow
- sha256: `66afc49203cb`
- observed that matters: geo `1.0.0`; `projjson:EPSG:2056`; axes
  `["Easting","Northing"]`/`["east","north"]`; types `[Polygon]`; `covering_present false`; `bbox`
  present; `parcel_id` int64; no `id`
- today: **refused** `identity_unusable` (`dataset.rs:756-769`), candidates `[parcel_id]`
- Brief A: **admitted-as-declared** (R-C5, x-first per `crs.rs:123`); sanity level `none` (nothing
  assumed to check)
- class: **session-ordinal**

**#2 — `geopandas/gp-nocrs-nokey.parquet`**

- pipeline: GeoPandas/pyarrow
- sha256: `a55e41bbfd4c`
- observed that matters: types `[Point]`; `crs_shape` `null` (explicit); no integer- or string-typed
  column
- today: **refused** `GeoMetadata` non-polygon (`dataset.rs:275-282`)
- Brief A: **refused-by-name, unchanged** — R-P5 precedes every rule this cut adds. Its
  explicit-null case (R-C3) stays **unexercised by the corpus**; F-3 carries it
- class: n/a

**#3 — `geopandas/gp-epsg4326-covering.parquet`**

- pipeline: GeoPandas/pyarrow
- sha256: `bbb8d0bcb0c3`
- observed that matters: geo `1.0.0`; `projjson:EPSG:4326`; axes `["Geodetic latitude","Geodetic
  longitude"]`/`["north","east"]`; types `[Polygon]`; covering → `bbox` struct; `bbox` `[7.24…,
  46.75…, 7.64…, 47.15…]`; `fid` int64; no `id`
- today: **refused** `AxisOrderUnsupported{established:"latitude,longitude"}` — resolved:
  `("north","east")` + geographic axis names → `LatitudeLongitude` (`geoparquet.rs:174-184`),
  `is_x_first` false (`crs.rs:122-123`), refusal at `dataset.rs:303-307`
- Brief A: **admitted-under-format-rule-with-provenance `axis:format-override`** (1.0.0 pinned,
  Appendix A); declared order `latitude,longitude` **retained** as a recorded fact; sanity
  `metadata`, not convicted (y within ±90). Degrees dataset → boundary-8 publish preflight refusal +
  the equirectangular statement
- class: **session-ordinal**

**#4 — `duckdb-spatial/duckdb-lv95range-intkey.parquet`**

- pipeline: DuckDB spatial
- sha256: `7a9da0271676`
- observed that matters: types `[Point]`; `crs_shape` `absent-key`; `bbox` in the LV95 metre range
- today: **refused** `GeoMetadata` non-polygon
- Brief A: **refused-by-name, unchanged**. Would otherwise be a second `format_default_contradicted`
  instance
- class: n/a

**#5 — `duckdb-spatial/duckdb-degreesrange-nokey.parquet`**

- pipeline: DuckDB spatial
- sha256: `b471a90f2e87`
- observed that matters: types `[Point]`; `absent-key`; `bbox` inside ±180/±90; no integer- or
  string-typed column
- today: **refused** `GeoMetadata` non-polygon
- Brief A: **refused-by-name, unchanged**. Would otherwise be a second `crs:format-default` admit
- class: n/a

**#6 — `duckdb-spatial/duckdb-mercatorrange-strkey.parquet`**

- pipeline: DuckDB spatial
- sha256: `94c737ebb4e7`
- observed that matters: geo `1.0.0`; types `[Polygon]`; **`absent-key`**; `covering_present false`;
  `bbox` `[827975.0, 5932975.0, 834194.0, 5947154.0]`; primary column `geom`; no integer column
- today: **refused** `crs_undeclared` (`crs.rs:236-239`, message `error.rs:175-179`)
- Brief A: **refused-by-name `engine.format_default_contradicted`** — R-C2 supplies CRS84, R-S1
  gives level `metadata` from the geo `bbox`, R-S2 convicts on \|x\| ≫ 180
- class: n/a (refused)

**#7 — `gdal/ogr2ogr-epsg2056-default.parquet`**

- pipeline: GDAL 3.11.3 `ogr2ogr` (local, QGIS 3.44.2's)
- sha256: `4e8e21d423dc`
- observed that matters: geo `1.1.0`; `projjson:EPSG:2056`; axes `east/north`; types `[Polygon]`;
  covering → `geometry_bbox`; `bbox` present; `parcel_id` int64; no `id`
- today: **refused** `identity_unusable`, candidates `[parcel_id]`
- Brief A: **admitted-as-declared**; sanity `none`
- class: **session-ordinal**

**#8 — `gdal/ogr2ogr-epsg4326-default.parquet`**

- pipeline: GDAL 3.11.3 `ogr2ogr` (local)
- sha256: `79dabf9db66a`
- observed that matters: geo `1.1.0`; **`crs_shape` `absent-key`**, `crs_key_present false`,
  `crs_axis_names`/`crs_axis_directions` `null` — written from a source declaring EPSG:4326
  lat-first (#3); types `[Polygon]`; covering → `geometry_bbox`; `bbox` `[7.24…, 46.75…, 7.64…,
  47.15…]`; `fid` int64; no `id`
- today: **refused** `crs_undeclared`
- Brief A: **admitted-under-format-rule-with-provenance `crs:format-default`** (OGC:CRS84, 1.1.0
  pinned); sanity `metadata`, **not** convicted (whole bbox inside ±180/±90). Degrees dataset →
  boundary-8 preflight refusal + the equirectangular statement
- class: **session-ordinal**

**#9 — `gdal/ogr2ogr-epsg2056-no-covering.parquet`**

- pipeline: GDAL 3.11.3 `ogr2ogr` (local, `-lco WRITE_COVERING_BBOX=NO`)
- sha256: `9d6f01256274`
- observed that matters: geo `1.1.0`; `projjson:EPSG:2056`; axes `east/north`; types `[Polygon]`;
  **`covering_present false`**; `bbox` present; no `geometry_bbox` column
- today: **refused** `identity_unusable`, candidates `[parcel_id]` — the absent covering does
  **not** refuse at open (`dataset.rs:439-442` is a `build_index`/viewport-filter path, not
  admission)
- Brief A: **admitted-as-declared**; sanity `none`. A later viewport filter still refuses
  `NoCoveringBbox`, unchanged by this cut
- class: **session-ordinal**

**#10 — `qgis/qgis-savefeatures-epsg2056.parquet`**

- pipeline: QGIS 3.44.2 `qgis_process native:savefeatures`
- sha256: `a36914b3f075`
- observed that matters: geo `1.1.0`; `projjson:EPSG:2056`; axes `east/north`; types `[Polygon]`;
  covering → `geometry_bbox`; `bbox` present; `parcel_id` int64; `label` `string` (not
  `large_string` — the one schema difference from #7); no `id`
- today: **refused** `identity_unusable`, candidates `[parcel_id]`
- Brief A: **admitted-as-declared**; sanity `none`
- class: **session-ordinal**

**#11 — `geoparquet-spec/example.parquet`**

- pipeline: spec example (downloaded)
- sha256: `ff90b4800d71`
- observed that matters: geo **`2.0.0`**; `projjson:OGC:CRS84`; axes `["Geodetic
  longitude","Geodetic latitude"]`/`["east","north"]`; types `[Polygon, MultiPolygon]`; `edges`
  `planar`
- today: **refused** `GeoMetadata` non-polygon
- Brief A: **refused-by-name, unchanged**. Recorded for the rule: its `2.0.0` is unpinned (R-C1 —
  Appendix A pins `v2.0.0-rc.1` and `main`, neither of which is the `2.0.0` release), and its CRS is
  declared and x-first, so no format rule is needed either way
- class: n/a

**#12 — `overture/overture-2026-08-19.0-building-bern.parquet`**

- pipeline: Overture CLI
- sha256: `6cd47a3e6e31`
- observed that matters: geo `1.1.0`; types `[MultiPolygon, Polygon]`; `absent-key`; covering →
  `bbox` struct; **`bbox_present_in_column_metadata false`**
- today: **refused** `GeoMetadata` non-polygon
- Brief A: **refused-by-name, unchanged**. The only main-set file whose sanity level would be
  decided by covering-column statistics rather than a geo `bbox` member
- class: n/a

*Source: `engine/ADMISSION-PREREGISTRATION.md` §3, the paragraphs after the table, `main` 84e3035
lines 96–103. Verbatim; long lines re-wrapped.*


**Retired — observed blocks kept, not run:** `retired/gp-epsg3857-strkey.parquet` (`fc8a150a5519`),
`retired/poly.parquet` (`002f42489f96` — the corpus's only EPSG:27700, axes `east/north`),
`retired/test_geoparquet_1_1.parquet` (`f7703e1f2a43`),
`retired/test_with_fid_and_geometry_bbox.parquet` (`a29df781c644`); moved 2026-09-10 to keep the
main set at the brief's ceiling, full `observed` blocks retained in `MANIFEST.json`'s `retired`
array, no outcome predicted and none run against them.

**On Appendix A and `2.0.0`, the rule kept:** a release candidate is not the release, and `main` is
a moving branch pinned at a commit. R-C1's precondition holds for `1.0.0` and `1.1.0` and **not**
for a file declaring `geo.version` `2.0.0` until `v2.0.0` is tagged and pinned; such a file with an
absent key refuses under the existing `CrsUndeclared` naming the unpinned version. The spike README
pins the *rendered* 1.1.0 page and Appendix A the *tagged raw markdown* — two artifacts of one
version; either satisfies R-C1, and the pair is not a cross-check.

**Rule-derived summary of the main set (12), registered as predictions (§5).** Refused at R-P5
before any rule this cut adds: **5** (#2, #4, #5, #11, #12 — three `Point` files and two
`MultiPolygon`-bearing files). Reaching the CRS rules: **7**. Under Brief A: **4
admitted-as-declared** (#1, #7, #9, #10), **2 admitted-under-format-rule** (#8 `crs:format-default`;
#3 `axis:format-override`), **1 refused-by-name `engine.format_default_contradicted`** (#6).
Identity class of every admit: **session-ordinal, 6 of 6** — no main-set file yields native or
mapped identity, so G-A1's native/mapped direction is carried only by fixtures F-8/F-9. Sanity
levels recorded: `metadata` ×3 (#3, #6, #8), `none` ×4 (#1, #7, #9, #10), `sample` ×0. Explicit-null
(R-C3) exercised by **0** main-set files.

**Files arriving later** are classified by §2 without amendment to this file: run R-P1…R-P6, then
R-C1…R-C6, then R-S1…R-S3, then R-I1…R-I4, and record the first outcome reached. A file whose class
cannot be decided from `observed` alone is recorded **not derivable statically — record at P4**,
never predicted.

*`target/fixtures/compat-corpus/MANIFEST.json` (`files`, main set) checked: its 12 paths and sha256
prefixes match §3 rows 1–12 in order; the 5 `mutations/` and 4 `retired` entries beyond them are not
shown.*

---

## Part 3 — preregistration §14, amendments recorded at P2

*Source: `engine/ADMISSION-PREREGISTRATION.md` §14, `main` 84e3035 lines 497–517. Verbatim; long
lines re-wrapped. Items I–IV are all `main` holds.*

## §14. Amendments recorded at P2 (architect-routed values)

*Drafted 2026-09-10 at Brief A's P2, **after P1's results were seen** (P1 landed at 92d87f1) — §5's
rule. What it touches: P2's own declared values only. No P1 outcome, prediction (§3, §5) or fixture
(§4) is altered by it, and none is invalidated.*

*(Custodian's filing note: the four items below are the architect agent's text, appended verbatim on
the P2 consult of 2026-09-10 under Draft 2 boundary 5 — "architect sets the value; recorded in the
preregistration". Item IV is the human's and is queued as DECISIONS-PENDING entry 81; nothing in
item IV is decided here.)*

- **I. The coordinate unit is read, never inferred.** From `coordinate_system.axis[0..2].unit` of the
  admitted PROJJSON only — never `base_crs`, never `conversion.parameters[].unit`
  (`engine/src/crs-catalog.json:8`).
  Both axes angular-degree → degrees instance; disagreeing, missing or unrecognized → `unestablished`,
  which is **not** an instance and **not** a refusal. Recorded on `AdmissionRecord`
  (`engine/src/geoparquet.rs:177-188`).
- **II. `MIN_ANCHOR_SPAN` under degrees = `1e-6` degree** (`frontends/shell/src/canvas/tileGrid.ts:78`
  is the metre-basis value). Declared, not discovered (ADR-010 rule 6); the arithmetic is in the P2
  architect consult. Sibling owed, value NOT set: `RECENTER_MAX_DRIFT_M` (`offsetFrame.ts:37`).
- **III. The fourth typed refusal** is `publish.geographic_crs_not_publishable`, publish-class
  (§13 H), a `PublishError` variant (`kernel/src/publish/error.rs`) with no SKP code and no
  `error_of` arm — publish is not an SKP command (`protocol/skp/SKP-V0.md:175`).
- **IV. Open, the human's:** whether an absent-key CRS84 admit (definition `None`,
  `geoparquet.rs:392-399`) yields the instance. Unresolved, §3 row 8's degrees prediction stands
  unmet and is recorded as a deviation at P4 (§8).

*Source: `engine/ADMISSION-PREREGISTRATION.md` §14 item V — NOT on `main`; from
`cut/admission-format-semantics` at a5d0832 (unmerged), lines 518–525. Verbatim.*

- **V. Item IV resolved — 2026-09-11, the human (DECISIONS-PENDING entry 81 = "(b), unit:format-rule
  beside unit:definition"); recorded BEFORE the code.** The pinned format rule is a second admissible
  source of the unit fact: the R-C2 (absent-key, pinned-version) admission records `coordinate_unit =
  degree` on both axes with `coordinate_unit_source = unit:format-rule`; `unit:definition` is unchanged;
  the identifier string stays forbidden as a source; no definition is invented. §3 row 8's degrees
  prediction is thereby reachable (at the publish preflight, P2's held part). The P4 record names item
  I's original reading, this resolution and its date. The Proposed ADR-013 amendment carries the
  matching clarification, appended the same day.

---

## Part 4 — ADR-013 amendment (Proposed)

*Source: `docs/adr/PROPOSED-amendment-to-ADR-013-geographic-degrees-instance.md`, Status and
Would-amend lines, `main` 84e3035 lines 5–8. Verbatim.*

**Status:** Proposed — appended to the ADR only on the human's word, at which point this file is
deleted in the same commit.
**Would amend:** ADR-013 (Accepted 2026-08-09, architect-blockable — `ADR-013:3`) as **Amendment 1**,
by appended text, never by rewriting.

*Source: same file, "Proposed text" block (points 1–8), `main` 84e3035 lines 14–66. Verbatim.*

## Proposed text

> **Amendment 1 (date, appended) — a geographic-degrees CRS instance, and how it is displayed.**
>
> **1. No new compile-time class.** §1 already rules: *"Space **class** is a compile-time
> discrimination. Space **instance** — which CRS, which render frame, which framebuffer, which
> pipeline — is **runtime data** carried with the value and validated at every conversion. CRS
> identifiers are **not** baked into the type system."* (`ADR-013:27-29`.) A geographic CRS in
> degrees is therefore an **instance** of the existing **Authoritative project-CRS coordinate**
> class, not a fifth class. There is nothing for a compile-time class to discriminate: the shape is
> f64, and the boundary permission is row 1's — the two columns rule 1's table exists to fix.
>
> **2. The instance carries its declared unit.** The unit is **read from the CRS definition** and
> recorded as a fact of the instance — never inferred from the identifier string (`docs/05`: CRS
> identity is decided by comparing normalized definitions and never by name-string comparison), and
> never defaulted. A definition from which no unit can be established does not yield this instance.
>
> **3. §1's trust clause governs, unchanged.** *"Class answers what shape; instance and provenance
> answer what may be trusted."* A degrees instance carries row 1's ground-truth permission only on
> §1's own terms, and this amendment grants nothing further.
>
> **4. The display convention.** For a dataset in a geographic CRS this project states, in the
> human's binding wording: **"no coordinate value is transformed; the display convention is
> equirectangular"** **[the human's words, verbatim; ruled on 2026-09-08 (evening) on DECISIONS-PENDING
> entry 59 — the RULED block at `DECISIONS-PENDING.md:37`, "equirectangular wording binding for future
> geographic entries" — and carried in the quoted form at `RELEASE-0.1.md:1041`]**. It is a statement
> about the **display** only. `axis_normalization` stays `none-performed`, no reprojection occurs, and
> this amendment licenses none: `docs/05`'s definitional-equivalence machinery and the transform
> service (§2) stay owed and unbuilt.
>
> **5. The surfaces that must carry it, this cut.** (i) the **shell's own status** at open, and (ii)
> **`describe`**. Without (i), a geographic dataset would draw on the canvas with the statement made
> nowhere before publish, which is what `docs/01:21` forbids. **Publish is deferred**: a degrees
> dataset **refuses at preflight, by name**, until Brief B's reader change (Brief A boundary 8) —
> never a dead artifact. The bundle manifest and reference viewer surfaces are Brief B's to add with
> that change; this amendment does not pre-empt them.
>
> **6. Declared bounds must be unit-aware (ADR-010 rule 6).** A declared constant whose value was
> chosen in metres does not silently apply to degrees. `MIN_ANCHOR_SPAN = 1` —
> `frontends/shell/src/canvas/tileGrid.ts:78`, justified at `:73-77` as *"One authoritative-CRS unit
> (e.g. one metre for a projected CRS)"* — is a declared bound that **stops being true** under
> degrees, where one unit is a degree. Every such constant either takes a **declared, unit-aware
> value** read from the instance's unit, or it does not run. Rule 6's discipline is that the value is
> declared, not discovered; a metre-shaped constant reused under degrees is discovered.
>
> **7. No measurement readout in degrees.** `docs/05:24`: *"Measurements are units-aware (geodesic
> where appropriate); 'area in degrees²' is unrepresentable."* No metre-denominated distance, area,
> scalebar or coordinate readout is produced for a degrees dataset. A readout that cannot be produced
> units-aware is **absent or refused, never rendered in metres**.
>
> **8. No number is carried across.** ADR-003's and ADR-010 rule 3's evidence is EPSG:2056 on
> Windows/WebView2 (`ADR-010:11`, `:51`, `:103`). No precision, frame-time or rendering-quality
> figure attaches to a geographic instance, in either direction.

*Source: same file, "Clarification appended 2026-09-11" — NOT on `main`; from
`cut/admission-format-semantics` at a5d0832 (unmerged), lines 122–130. Verbatim; long lines
re-wrapped.*

## Clarification appended 2026-09-11 on the human's ruling (DECISIONS-PENDING entry 81 = (b)) — becomes part of the proposed text at acceptance

*The architect's P2 consult escalated this; the human ruled "(b), unit:format-rule beside
unit:definition". The Context/Decision/Consequences below expand the architect's own skeleton; the
Proposed status is unchanged and nothing here is in force before acceptance at P6.*

**Context.** §2 requires the unit to be read from the CRS definition. The format-default admission
(Brief A boundary 1, rule R-C2 — an absent `crs` key under a pinned GeoParquet version) deliberately
carries **no** definition: the engine never writes a definition it did not read. Read strictly, §2
left a CRS84-by-absent-key dataset with no unit, therefore no instance, no display statement, and no
publish preflight refusal — the geographic bundle boundary 8 exists to prevent — and it left the
preregistration's §3 row 8 prediction unmet.

**Decision.** The **pinned format rule** is a second admissible source of the unit fact, beside the
definition. GeoParquet 1.1.0's absent-key default names OGC:CRS84, whose axes are longitude and
latitude in degrees; an admission under that rule records the unit `degree` on both axes with the
source `unit:format-rule` (and the rule's reference the envelope already carries), where a unit read
from a definition records `unit:definition`. The identifier string remains forbidden as a source
(block-on-sight 8 unchanged); no PROJJSON is invented; P1's "never write a definition it did not
read" stands. §2's sentence "A definition from which no unit can be established does not yield this
instance" applies to definitions; a rule-sourced unit is a distinct, recorded source.

**Consequences.** Corpus #8 (the ogr2ogr CRS84 file) reaches the degrees instance, the display
statement and the publish preflight refusal as §3 row 8 predicted. The record shows which of the two
sources supplied the unit, so a reader can tell a declared-degrees file from a rule-defaulted one.
Nothing changes for a file with a definition, for explicit `null`, or for an unpinned version (which
takes no format rule).

---

## Part 5 — ADR-015 amendment (Proposed)

*Source: `docs/adr/PROPOSED-amendment-to-ADR-015-format-governed-inputs-and-provenance-classes.md`,
Status and Would-amend lines, `main` 84e3035 lines 5–10. Verbatim.*

**Status:** Proposed — appended to the ADR only on the human's word, at which point this file is
deleted in the same commit. Filed as a separate file per the precedent of
`PROPOSED-amendment-to-ADR-003-projected-canvas-publishing.md` and
`PROPOSED-amendment-to-ADR-004-instrument-surface-never-skp.md`.
**Would amend:** ADR-015 (Accepted 2026-08-05, architect-blockable — `ADR-015:3`) as **Amendment 1**,
by appended text, never by rewriting.

*Source: same file, "Proposed text" block (points 1–7), `main` 84e3035 lines 17–65. Verbatim.*

## Proposed text

> **Amendment 1 (date, appended) — format-governed inputs, and provenance as a recorded fact.**
>
> **1. §5 sentence 1 carries two facts, not one.** The **declared** axis order is established from
> the CRS definition, never assumed. The **data's** axis order is established from the source
> format's own specification where that specification states one, and from the definition otherwise.
> Where the two differ, **both are recorded**, with the rule and the specification version that
> established the data order, and neither is inferred from the other. **The definition's own axis
> order is retained as a recorded fact and never discarded** — it is what a later reprojection or
> export needs, and a slice that discards it has destroyed a file fact to save a field.
>
> **2. Sentence 3 narrows.** `AxisOrderUnsupported` refuses sources for which **no format rule
> establishes the data order**. Sentence 2 (`AxisOrderUnestablished` — a definition with no
> coordinate system) and sentence 4 (`axis_normalization = none-performed`) are **unchanged**:
> nothing is normalized, and the record still says what was done rather than what was assumed. The
> `docs/05` conflict block quoted in §5 is unchanged — refusing remains the resolved behaviour
> wherever it still applies, not a gap.
>
> **3. §2's second sentence narrows, and this is a reversal stated plainly rather than smuggled.**
> §2 reads *"GeoParquet's OGC:CRS84 default is not applied."* Under this amendment an **absent**
> `crs` key is admitted under the format's own published rule and recorded as `crs:format-default`.
> An explicit `"crs": null` is **unchanged**: unknown, refused, assertion required. The distinction
> is the whole of the narrowing — absent means the format has already spoken; explicit null means
> the file has said "I do not know", and no rule may answer for it.
>
> **4. §6 stands, and this amendment is not an exception to it.** *"No guessing, no default, no
> fallback"* forbids an **engine-invented** default. A format's own published rule, applied only to
> inputs that format governs, quoted verbatim and pinned by URL, retrieval date and page hash, is a
> read fact and is recorded as one. **A format rule that is not pinned in the tree may not be
> applied** — the pinning is the difference between reading a rule and remembering one.
>
> **5. The provenance classes are recorded facts, never judgements.** Five values, each naming what
> was read and from where: `crs:declared` (the file's own `crs`), `crs:asserted` (§3, unchanged),
> `crs:format-default` (the format's rule, absent key), `axis:declared` (from the definition),
> `axis:format-override` (from the format's specification, with its version). They are recorded on
> `describe` and travel with the dataset. **None of them is an equivalence finding** — §4 and §7's
> closing sentence are untouched, and this amendment licenses no later code to assume otherwise.
>
> **6. The range check is a sanity check, not a truth test, and its assurance is recorded.** Its
> level is recorded per open as exactly one of `metadata` (geo `bbox` or column statistics), `sample`
> (first row group) or `none`. **It never reads all coordinates at open.** It can convict a
> malformed file; it can never establish conformance. Its stated limit, which travels with it into
> KNOWN-LIMITATIONS: *"A projected file inside ±180/±90 is NOT detected by it"* **[Brief A boundary
> 2, verbatim]**. No text may describe it as verifying, confirming or validating anything.
>
> **7. Unchanged:** §1, §3, §4, §6 (as read in item 4), §7 in full, the Consequences, and the two
> OPEN blocks. **The §5 OPEN block — the normalize-later question — is not answered here**, and this
> amendment must not be cited as answering it.

---

## Part 6 — ADR-016 amendment (Proposed)

*Source: `docs/adr/PROPOSED-amendment-to-ADR-016-identity-tier-model.md`, Status and Would-amend
lines, `main` 84e3035 lines 5–8. Verbatim.*

**Status:** Proposed — appended to the ADR only on the human's word, at which point this file is
deleted in the same commit.
**Would amend:** ADR-016 (Accepted 2026-09-02, architect-blockable — `ADR-016:3-10`) as
**Amendment 1**, by appended text, never by rewriting.

*Source: same file, "Proposed text" block (points 1–6), `main` 84e3035 lines 14–71. Verbatim.*

## Proposed text

> **Amendment 1 (date, appended) — three tiers, named, with the session tier defined and bounded.**
>
> This ADR admits identity through one door (a native `id` column, §2) or a declared mapping (§3).
> **Three tiers are named instead, and the session tier is defined here.**
>
> **1. The session tier.** Identity is the pair **(dataset-session generation G, physical file-row
> ordinal read via DuckDB `file_row_number`)**. It is **generation-namespaced**: an ordinal has no
> meaning outside the G it was minted under, and no comparison across two G values is defined.
>
> - **It is never a snapshot claim.** No text, comment, status string or test name may say or imply
>   that one open reads one snapshot.
> - **G is minted per open, lives in kernel and client state, and is never persisted and never
>   published.** G is not a ResourceRef field: it is neither logical URI, content hash, source
>   revision, locator, cache status nor portability policy (ADR-005; `docs/11:21-33`). No ADR-005
>   amendment is needed or implied — nothing is persisted and no grade is claimed.
> - **Uniqueness is by construction within a generation**, not by scan. `file_row_number` names a
>   physical row position, so within one G it is distinct by construction and is a pure function of
>   file content in §4's own sense — **not** scan order, not arrival order, not a dictionary index.
>   That `file_row_number` is physical rather than scan-ordered is the assumption this tier rests on
>   and is **verified against the corpus, never assumed**.
> - **§1's "no synthesis, no row ordinals" is not contradicted, and the reason is the namespacing.**
>   §1 refuses a synthesized ordinal offered as *stable feature identity*. This tier claims no
>   stability: it does not survive an open, a reopen, or a change, and it refuses to cross either
>   boundary. The ADR-010 rule 2 hazard — a wrong-but-plausible coordinate — is closed by
>   construction, because the space dies with G rather than outliving it silently.
> - **§5's full-column uniqueness scan does not run on this path** and must not be reported as
>   though it had. The §6 record gains a third what-was-checked value naming this basis
>   (`by-construction-within-generation`); the bare word "unique" still appears nowhere.
>
> **2. The structural descriptor is a change detector, not the uniqueness basis.** Byte size, mtime,
> footer length and footer hash. Its only job is to **invalidate G**. The footer read is bounded by a
> **declared ceiling** (ADR-010 rule 6; the value is set by the architect and recorded in
> `engine/ADMISSION-PREREGISTRATION.md`, not fixed in this ADR); past the ceiling the descriptor
> degrades to size + mtime + footer length and **the degradation is shown**. Footer bytes read are
> reported per open, reported-only, never gated. No number appears in this ADR text.
>
> **3. Change handling — the read-around policy, declared.** Checks run **before every query issue
> and after every stream terminal**. A detected change invalidates G: new tickets refused under G,
> in-flight producer streams cancelled through the **existing** cancel, residency cleared, picks
> refused until reopen, and a typed status "source changed during use". Its limitation, stated here
> and in KNOWN-LIMITATIONS in these words: the policy **"does not establish snapshot consistency,
> cannot detect every in-place modification, and may detect a change during a query only at the
> post-check"** **[Brief A boundary 4, verbatim]**.
>
> **4. The verified tier — defined here, landing later.** Identity pinned to a **content-addressed
> revision**: a content hash over the source, recorded, so two opens can be compared and two files
> presenting the same identities can be told apart. **It is not built in this cut**; it lands with
> Brief B, and no claim about it may be made before it exists.
>
> **5. Single file only.** A partitioned source is refused for session-ordinal identity **by name** —
> `engine.identity_ordinal_partitioned_unsupported`. Its existing declared-mapping route is
> untouched. No file-list or packing contract is introduced here.
>
> **6. Native and mapped identity are unchanged.** §1-§7 continue to govern them in full, including
> §5's whole-file verification scan with its liveness and Cancel. Additive fields only; existing
> tests stay green unmodified.

---

## Part 7 — ADR-028 amendment (Proposed)

*Source: `docs/adr/PROPOSED-amendment-to-ADR-028-within-generation-qualification.md`, Status and
Would-amend lines, `main` 84e3035 lines 5–8. Verbatim.*

**Status:** Proposed — appended to the ADR only on the human's word, at which point this file is
deleted in the same commit.
**Would amend:** ADR-028 (Accepted 2026-09-02; **not** architect-blockable — `ADR-028:6`) as
**Amendment 4**, by appended text, never by rewriting.

*Source: same file, "Proposed text" block (points 1–6), `main` 84e3035 lines 16–62. Verbatim.*

## Proposed text

> **Amendment 4 (date, appended) — the within-generation qualification.**
>
> **1. Scope, not substance.** Every residency statement this ADR makes is **scoped to one dataset-
> session generation G**. This changes **no accepted rule**; it bounds the referent every rule
> already had. Specifically:
>
> - **Protection** — Amendment 3's geometric rule (*"A tile intersecting the viewport is protected
>   whether it is complete or partial, tracked this round or a prior one, or never requested at
>   all"*) protects tiles **of the current G**.
> - **Completeness** — no completeness claim ("Showing all N…") survives an invalidation. A claim
>   made under an invalidated G is stale by construction and is cleared, per Amendment 2(c)'s own
>   rule that silence and staleness never represent state.
> - **The declared partial view** and its persistent status describe the current G's resident set.
> - **The over-budget latch**, `fits`, and the fill-completeness predicate are read within G.
>
> **2. On invalidation.** Residency is **cleared**; in-flight streams are **cancelled through the
> existing cancel** (the existing `cancel` SKP command, ADR-018 — no new wire, the same lever
> Amendment 2(a) already repoints); **picks are refused** until reopen; and **late batches are
> dropped by ticket**. A batch is attributed to a generation **via its ticket**; the client drops any
> batch whose ticket belongs to an invalidated generation, so a late result never repopulates the
> canvas.
>
> **3. The drop is a second predicate at an existing site — no wire field.** The ticket already
> reaches the batch: `frontends/shell/src/streaming/tileViewportStreamManager.ts:685` captures
> `streamHandleAtStart = ticket.stream` at mint and `:699` passes it out through `onBatch`;
> `viewportStreamManager.ts:189-212` has the same shape, with an existing supersede drop at
> `:193-201` as the precedent this one sits beside. **Data plane: EMPTY DIFF.** Generation
> attribution rides the existing ticket and no new wire field is introduced.
>
> **4. Duties, split.** The **kernel** is the refusal authority: no ticket is minted or honoured
> under an invalidated G. The **client** is the drop authority: a batch already in flight is dropped
> at its sink. Both hold a ticket→generation mapping; neither puts it on the wire.
>
> **5. Interaction with the appended note of 2026-09-09 — both stand.** That note declares an
> exception past a bounded tile cover: past `MAX_COVERING_TILES` the windowed array is both the
> eviction-protected set and the supersede keep-set, so Amendment 3's geometric rule holds **inside
> the window only** at those zooms. That is a **spatial** narrowing of the protection rule. This
> amendment is a **temporal** one. They compose and neither weakens the other: inside G, protection
> is geometric within the window; outside G, there is nothing to protect. The note's completeness
> guarantee is likewise per-generation — `coveringTruncated` refuses a completeness claim over a
> windowed cover (`ADR-028:514`), and an invalidated G refuses one regardless of the cover.
>
> **6. What this amendment does not do.** It states no new residency behaviour, retires no reopen
> condition, discharges no binding debt, and touches neither the gate-8 evidence nor its ruling. It
> attaches no number and no duration to anything.

---

## Part 8 — ADR-032 (Proposed), Status and Decision

*Source: `docs/adr/ADR-032-geoparquet-source-declaring-a-non-x-first-axis-order.md`, Status line,
`main` 84e3035 line 5. Verbatim; re-wrapped.*

**Status:** **Proposed** — filed 2026-09-08 on the human's ruling (DECISIONS-PENDING entry 59 = (a),
verbatim: **[H]** *"ADR-032 filed Proposed (4326 via the GeoParquet x,y override, decision open)"*).
**This text is the accepting draft prepared at Brief A's P0; acceptance comes at P6 and only in the
human's own words. Until then it binds nothing.** The human's sequencing note, not a decision:
**[H]** *"ADR-032 (4326 admission) likely outranks LOD."*

*Source: same file, "Decision" section, `main` 84e3035 lines 21–33. Verbatim; long lines re-wrapped.*

## Decision

As stated by Brief A's settled boundary 1
(`state/drafts/post-tag/DRAFT-2-BRIEF-A-admission-and-session-lifecycle.md:25-29`), which
this ADR records rather than reopens:

1. **An absent `crs` key is the format's own default, not a guess.** It admits as OGC:CRS84 with
   provenance **`crs:format-default`**, carrying the specification version and the pinned rule that
   established it. The provenance is shown to the operator and recorded on the envelope.
2. **An explicit `crs: null` is unchanged**: unknown — assertion required
   (`engine/src/geoparquet.rs:98-109`, `engine/src/crs.rs:236-239`).
3. **WKB coordinate order is established from the format specification**, with provenance
   **`axis:format-override`**. **The definition's own axis order is RETAINED as a recorded fact for
   future reprojection and export, and is never discarded.**
4. **Reader-only.** The data order is established in the GeoParquet reader. `crs.rs::is_x_first`
   (`:120-124`) and `crs::admit` (`:218-240`) are not touched, and a diff that touches either fails
   on sight.
5. **Nothing is normalized**: `axis_normalization` stays `none-performed`
   (`engine/src/envelope.rs:88`). No coordinate value is transformed.
6. **A format rule applies only where its governing text is pinned in-tree** (URL, retrieval date,
   page sha256). Where it is not, no rule applies and the existing typed refusal stands.
7. **A range check may convict, never confirm.** No string, comment or status may report that a
   producer conformed.

This is candidate (B) of the original Decision block, decided; (A) and (C) are not taken. Neither
licenses reprojection — docs/05's definitional-equivalence machinery stays owed.
