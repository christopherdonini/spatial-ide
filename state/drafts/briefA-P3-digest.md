> **Status: draft — Brief A P3 digest for the human's ruling, 2026-09-13; superseded by the RULED blocks in `DECISIONS-PENDING.md`.**
> Record, not policy — moved from the untracked `RELEASE-DRAFTS-0.1.0/` directory on the human's round-14 ruling (2026-09-17); nothing here binds, and its cites are historical (advisory in `verify-cites`, never gated).

# Brief A P3 digest

*Digest for the human's P3 ruling on Brief A. From `main` at 847f7bd (2026-09-13), read-only. P1
(92d87f1, e59f667) and P2 (65166b4, 8875e27, fbf5500), engine-side, gated, on `main` via PR #44;
entries 80/81 (089052a, 290d044) in PR #46, unmerged. P3 = the row quoted next. Open rulings on it:
entry 73 (polygon-only gate; P6 sight list + its 2026-09-10 addition), entry 83's P3 question, entry
69 (MSVCP140). P2 parts held (entry 83): the kernel preflight refusal
`publish.geographic_crs_not_publishable`, the shell status sentence, the `describe` carrier (new
`CrsInfo` member, SKP 0.3 bump). Blocks below: mechanical copies, re-wrapped at ~100 columns.*

*Source: `NEXT-CUT.md` (untracked working tree), Phases table, row P3, line 103. Rendered as one
block; the three cell texts verbatim; column names are the table's own.*

- Phase: Session identity tier: `file_row_number` ordinals; generation minted per open (kernel
  state) and mirrored client-side via ticket→generation mapping; descriptor with bounded footer
  read; read-around checks; invalidation path (tickets refused, in-flight cancelled, residency
  cleared, picks refused, typed status); SKP 0.3 describe fields + refusals + fixtures
- Budget: 180 min
- Gate: Reviewer; **architect-blockable** (ADR-016/010/028)

---

## 2. Preregistration §2 in full; §14 items I–V

*Source: `engine/ADMISSION-PREREGISTRATION.md` §2 (2a–2e), `main` 847f7bd lines 35–74. Verbatim;
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

*Source: `engine/ADMISSION-PREREGISTRATION.md` §14 (items I–IV), `main` 847f7bd lines 497–517.
Verbatim; long lines re-wrapped.*

## §14. Amendments recorded at P2 (architect-routed values)

*Drafted 2026-09-10 at Brief A's P2, **after P1's results were seen** (P1 landed at 92d87f1) — §5's
rule. What it touches: P2's own declared values only. No P1 outcome, prediction (§3, §5) or fixture
(§4) is altered by it, and none is invalidated.*

*(Custodian's filing note: the four items below are the architect agent's text, appended verbatim on
the P2 consult of 2026-09-10 under Draft 2 boundary 5 — "architect sets the value; recorded in the
preregistration". Item IV is the human's and is queued as DECISIONS-PENDING entry 81; nothing in
item IV is decided here.)*

- **I. The coordinate unit is read, never inferred.** From `coordinate_system.axis[0..2].unit` of
  the
  admitted PROJJSON only — never `base_crs`, never `conversion.parameters[].unit`
  (`engine/src/crs-catalog.json:8`).
  Both axes angular-degree → degrees instance; disagreeing, missing or unrecognized →
  `unestablished`,
  which is **not** an instance and **not** a refusal. Recorded on `AdmissionRecord`
  (`engine/src/geoparquet.rs:177-188`).
- **II. `MIN_ANCHOR_SPAN` under degrees = `1e-6` degree**
  (`frontends/shell/src/canvas/tileGrid.ts:78`
  is the metre-basis value). Declared, not discovered (ADR-010 rule 6); the arithmetic is in the P2
  architect consult. Sibling owed, value NOT set: `RECENTER_MAX_DRIFT_M` (`offsetFrame.ts:37`).
- **III. The fourth typed refusal** is `publish.geographic_crs_not_publishable`, publish-class
  (§13 H), a `PublishError` variant (`kernel/src/publish/error.rs`) with no SKP code and no
  `error_of` arm — publish is not an SKP command (`protocol/skp/SKP-V0.md:175`).
- **IV. Open, the human's:** whether an absent-key CRS84 admit (definition `None`,
  `geoparquet.rs:392-399`) yields the instance. Unresolved, §3 row 8's degrees prediction stands
  unmet and is recorded as a deviation at P4 (§8).

*Source: `engine/ADMISSION-PREREGISTRATION.md` §14 item V — NOT on `main`; from
`cut/admission-format-semantics` at 290d044 (PR #46, unmerged), lines 518–525. Verbatim.*

- **V. Item IV resolved — 2026-09-11, the human (DECISIONS-PENDING entry 81 = "(b), unit:format-rule
  beside unit:definition"); recorded BEFORE the code.** The pinned format rule is a second
  admissible
  source of the unit fact: the R-C2 (absent-key, pinned-version) admission records `coordinate_unit
  =
  degree` on both axes with `coordinate_unit_source = unit:format-rule`; `unit:definition` is
  unchanged;
  the identifier string stays forbidden as a source; no definition is invented. §3 row 8's degrees
  prediction is thereby reachable (at the publish preflight, P2's held part). The P4 record names
  item
  I's original reading, this resolution and its date. The Proposed ADR-013 amendment carries the
  matching clarification, appended the same day.

---

## 3. Preregistration §13 — the P3-relevant architect answers A–H

*Source: `engine/ADMISSION-PREREGISTRATION.md` §13 "Architect-routed answers recorded at P0", items
A–H, `main` 847f7bd lines 244–258. Verbatim; long lines re-wrapped.*

**A. Footer ceiling.** `FOOTER_DESCRIPTOR_MAX_BYTES = 8 MiB` — §7's basis: a declared byte bound in
the shape of `MAX_CRS_DEFINITION_BYTES` (`engine/src/crs.rs:26-36`), sized by arithmetic on
row-group × column counts, not by any measurement. Over the ceiling the descriptor degrades to size
+ mtime + footer length and says so; it never refuses, never gates. Footer bytes read are reported
per open.

**B. Sanity-check sample size and level semantics.** `SANITY_SAMPLE_MAX_ROWS = 8,192` — one row
group. **`metadata`** = decided from footer-resident facts only (the geo `bbox` member and/or
Parquet statistics on the covering columns); **`sample`** = the first row group of the **covering
bbox columns only**, never the WKB; **`none`** = neither available, and the status says *not
checked*, never *passed*. Selection is ordered and exclusive (R-S1). The check applies only where a
format rule supplied the CRS; a file with a declared CRS is not range-checked, because there is
nothing assumed to convict.

**C. Post-check placement.** The post-check runs **after DuckDB's result iterator is fully drained
and the stream's lease released, and before the stream's terminal status is emitted** — never inside
the batch loop (a per-batch descriptor read would put filesystem work on the data path, docs/10, and
would multiply one refusal into many). Rules: (i) the terminal is `ok` only if the post-check finds
no change; otherwise the terminal *is* the typed `engine.source_changed`; (ii) a **cancelled**
stream keeps its `cancelled` terminal (ADR-018 vocabulary) — the check still runs and may invalidate
G, but a cancel is never reported as a source change; (iii) a change detected only at the post-check
is exactly boundary 4's declared limit and the status text says so. The precise call site is named
at P3 against `engine/src/stream.rs`, which the consult did not read.

**D. Where the ticket→generation mapping lives.** **Both sides, and no generation value crosses the
wire.** Kernel side is authoritative — the ticket registry already exists and already has
per-dataset lifetime authority (`kernel/src/skp.rs:432`, `cancel_all_for_dataset`) — and it decides
refusals under an invalidated G. Client side mirrors by *live-ticket set*, not by value: on
invalidation the client clears its live set and drops any batch whose ticket is not in it. This
satisfies boundary 4's "every batch is attributed to a generation via its ticket" with **no new wire
field** (boundary 9, A3), and both sides fail closed independently. A generation value must not
appear in `describe` either; `describe` gains only the three fields boundary 9 names plus the sanity
level.

**E. SKP 0.3 bump mechanics, coordinated with Brief B.** Follow the `skp/0.2` precedent exactly
(`protocol/skp/SKP-V0.md:456-486`): one literal bumped once on Brief A's branch; plain `==`
comparison retained (`kernel/src/skp.rs:438-443`); `deny_unknown_fields` both directions; **every
fixture on both the Rust and the TypeScript side updated in the same commit**; an appended §8
change-log entry listing the version's **full** field set. While 0.3 is unmerged, further additions
to it are appended addenda to that same entry — the `skp/0.2` P2/P3c addendum precedent
(`SKP-V0.md:482-484`). **Once Brief A merges to `main`, 0.3's field set is closed and Brief B bumps
to 0.4.** `skp/1` stays RESERVED (`protocol/skp/src/v0/mod.rs:22-23`).

**F. Conditional escalation, flagged now.** `file_row_number` appears nowhere in this tree (grepped:
the brief is its only occurrence). Whether the vendored `duckdb` crate exposes it on the
`read_parquet` path is verified at the **start** of P3, before any session-ordinal code. If it is
unavailable, the identity mechanism itself changes and the question becomes the human's, not the
architect's.

**G. Naming.** `generation` already names a connection **lease** generation in
`engine/src/pool.rs:406,426-434` (`ConnectionFacts.lease_generation`, ADR-004 Amendment 4). Brief
A's dataset-session generation G is named distinctly at P3 (`dataset_session_generation` or
equivalent) so the A2 grep test reads the right symbol.

**H. A fourth typed refusal.** Boundary 9 names three new typed refusals, all open/describe-class;
boundary 8's degrees-publish preflight refusal is a publish-class refusal boundary 8 mandates
independently. Read together, not as a contradiction; its name is minted at P2 and this reading is
recorded so A3/A5 reviewers do not read it as scope creep.

---

## 4. Preregistration §3 — the corpus manifest

*Source: `engine/ADMISSION-PREREGISTRATION.md` §3 preamble, `main` 847f7bd lines 78–81. Verbatim;
long lines re-wrapped.*

## 3. The compatibility-corpus manifest — one row per file, two pre-declared outcomes

Hashes are the first 12 hex of each `observed` block's `sha256` in `MANIFEST.json`. "Today" = the
tree at `main` 279b43f, derived from the cited lines. "Brief A" = the rules in §2 with the polygon
gate (R-P5) **held** (DECISIONS-PENDING entry 73 pending). Every axis-dependent row is resolved from
the manifest's `crs_axis_directions`; nothing here is conditional.


*Source: `engine/ADMISSION-PREREGISTRATION.md` §3 table, `main` 847f7bd lines 82–95. Eight-column
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

*Source: `engine/ADMISSION-PREREGISTRATION.md` §3, the paragraphs after the table, `main` 847f7bd
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

*`target/fixtures/compat-corpus/MANIFEST.json` (`files`, `set: main`) checked: its 12 paths and
sha256 prefixes match §3 rows 1–12 in order; the 5 `mutations` and 4 `retired` entries beyond them
are not shown.*

---

## 5. The ADR drafts — Status lines and Decision paragraphs

### 5.1 ADR-016 amendment (P3's own)

*Source: `docs/adr/PROPOSED-amendment-to-ADR-016-identity-tier-model.md`, Status and Would-amend
lines, `main` 847f7bd lines 5–8. Verbatim.*

**Status:** Proposed — appended to the ADR only on the human's word, at which point this file is
deleted in the same commit.
**Would amend:** ADR-016 (Accepted 2026-09-02, architect-blockable — `ADR-016:3-10`) as
**Amendment 1**, by appended text, never by rewriting.

*Source: same file, "Proposed text" block (points 1–6), `main` 847f7bd lines 14–71. Verbatim.*

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
> footer length and footer hash. Its only job is to **invalidate G**. The footer read is bounded by
> a
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
> **5. Single file only.** A partitioned source is refused for session-ordinal identity **by name**
> —
> `engine.identity_ordinal_partitioned_unsupported`. Its existing declared-mapping route is
> untouched. No file-list or packing contract is introduced here.
>
> **6. Native and mapped identity are unchanged.** §1-§7 continue to govern them in full, including
> §5's whole-file verification scan with its liveness and Cancel. Additive fields only; existing
> tests stay green unmodified.

### 5.2 ADR-028 amendment (P3's own)

*Source: `docs/adr/PROPOSED-amendment-to-ADR-028-within-generation-qualification.md`, Status and
Would-amend lines, `main` 847f7bd lines 5–8. Verbatim.*

**Status:** Proposed — appended to the ADR only on the human's word, at which point this file is
deleted in the same commit.
**Would amend:** ADR-028 (Accepted 2026-09-02; **not** architect-blockable — `ADR-028:6`) as
**Amendment 4**, by appended text, never by rewriting.

*Source: same file, "Proposed text" block (points 1–6), `main` 847f7bd lines 16–62. Verbatim.*

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
> dropped by ticket**. A batch is attributed to a generation **via its ticket**; the client drops
> any
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

### 5.3 ADR-015 amendment

*Source: `docs/adr/PROPOSED-amendment-to-ADR-015-format-governed-inputs-and-provenance-classes.md`,
Status and Would-amend lines, `main` 847f7bd lines 5–10. Verbatim.*

**Status:** Proposed — appended to the ADR only on the human's word, at which point this file is
deleted in the same commit. Filed as a separate file per the precedent of
`PROPOSED-amendment-to-ADR-003-projected-canvas-publishing.md` and
`PROPOSED-amendment-to-ADR-004-instrument-surface-never-skp.md`.
**Would amend:** ADR-015 (Accepted 2026-08-05, architect-blockable — `ADR-015:3`) as **Amendment
1**,
by appended text, never by rewriting.

*Source: same file, "Proposed text" block (points 1–7), `main` 847f7bd lines 17–65. Verbatim.*

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
> level is recorded per open as exactly one of `metadata` (geo `bbox` or column statistics),
> `sample`
> (first row group) or `none`. **It never reads all coordinates at open.** It can convict a
> malformed file; it can never establish conformance. Its stated limit, which travels with it into
> KNOWN-LIMITATIONS: *"A projected file inside ±180/±90 is NOT detected by it"* **[Brief A boundary
> 2, verbatim]**. No text may describe it as verifying, confirming or validating anything.
>
> **7. Unchanged:** §1, §3, §4, §6 (as read in item 4), §7 in full, the Consequences, and the two
> OPEN blocks. **The §5 OPEN block — the normalize-later question — is not answered here**, and this
> amendment must not be cited as answering it.

### 5.4 ADR-013 amendment

*Source: `docs/adr/PROPOSED-amendment-to-ADR-013-geographic-degrees-instance.md`, Status and
Would-amend lines, `main` 847f7bd lines 5–8. Verbatim.*

**Status:** Proposed — appended to the ADR only on the human's word, at which point this file is
deleted in the same commit.
**Would amend:** ADR-013 (Accepted 2026-08-09, architect-blockable — `ADR-013:3`) as **Amendment
1**,
by appended text, never by rewriting.

*Source: same file, "Proposed text" block (points 1–8), `main` 847f7bd lines 14–66. Verbatim.*

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
> equirectangular"** **[the human's words, verbatim; ruled on 2026-09-08 (evening) on
> DECISIONS-PENDING
> entry 59 — the RULED block at `DECISIONS-PENDING.md:37`, "equirectangular wording binding for
> future
> geographic entries" — and carried in the quoted form at `RELEASE-0.1.md:1041`]**. It is a
> statement
> about the **display** only. `axis_normalization` stays `none-performed`, no reprojection occurs,
> and
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
> value** read from the instance's unit, or it does not run. Rule 6's discipline is that the value
> is
> declared, not discovered; a metre-shaped constant reused under degrees is discovered.
>
> **7. No measurement readout in degrees.** `docs/05:24`: *"Measurements are units-aware (geodesic
> where appropriate); 'area in degrees²' is unrepresentable."* No metre-denominated distance, area,
> scalebar or coordinate readout is produced for a degrees dataset. A readout that cannot be
> produced
> units-aware is **absent or refused, never rendered in metres**.
>
> **8. No number is carried across.** ADR-003's and ADR-010 rule 3's evidence is EPSG:2056 on
> Windows/WebView2 (`ADR-010:11`, `:51`, `:103`). No precision, frame-time or rendering-quality
> figure attaches to a geographic instance, in either direction.

*Source: same file, "Clarification appended 2026-09-11" — NOT on `main`; from
`cut/admission-format-semantics` at 290d044 (PR #46, unmerged), lines 122–130. Verbatim; long lines
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

### 5.5 ADR-032

*Source: `docs/adr/ADR-032-geoparquet-source-declaring-a-non-x-first-axis-order.md`, Status line,
`main` 847f7bd line 5. Verbatim; re-wrapped.*

**Status:** **Proposed** — filed 2026-09-08 on the human's ruling (DECISIONS-PENDING entry 59 = (a),
verbatim: **[H]** *"ADR-032 filed Proposed (4326 via the GeoParquet x,y override, decision open)"*).
**This text is the accepting draft prepared at Brief A's P0; acceptance comes at P6 and only in the
human's own words. Until then it binds nothing.** The human's sequencing note, not a decision:
**[H]** *"ADR-032 (4326 admission) likely outranks LOD."*

*Source: same file, "Decision" section, `main` 847f7bd lines 21–33. Verbatim; long lines
re-wrapped.*

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

---

## 6. Draft 2 — boundaries 3, 4, 9; gates G-A1…G-A4; open questions

*Source: `NEXT-CUT.md` (untracked working tree), "Settled boundaries (binding)", boundary 3, lines
48–53. Verbatim.*

3. **Session identity is generation-namespaced, never a snapshot claim.** Identity =
   (dataset-session generation G, physical file-row ordinal via DuckDB `file_row_number`). G is
   minted per open, lives in kernel + client state, is **never persisted and never published**.
   The structural descriptor — byte size, mtime, footer length, footer hash — is a **change
   detector that invalidates G**; it is not what makes ordinals unique (uniqueness is by
   construction within a generation).

*Source: same file, boundary 4, lines 54–63. Verbatim.*

4. **Read-only preview policy, declared.** Checks run before every query issue and after every
   stream terminal. A detected change invalidates G: new tickets refused under G, in-flight
   producer streams cancelled through the existing cancel, residency cleared, picks refused
   until reopen, typed status "source changed during use." **Every batch is attributed to a
   generation via its ticket; the client drops any batch whose ticket belongs to an invalidated
   generation** — late results never repopulate the canvas. The policy does not establish
   snapshot consistency, cannot detect every in-place modification, and may detect a change
   during a query only at the post-check. This limitation is stated verbatim in the ADR-016
   amendment and in KNOWN-LIMITATIONS. No text or code comment may claim "one open reads one
   snapshot."

*Source: same file, boundary 9, lines 77–82. Verbatim.*

9. **Data plane: EMPTY DIFF under `protocol/data-plane/`.** Generation attribution rides the
   existing ticket; no new wire field. Control plane: `describe` gains `crs.provenance`,
   `axis.provenance`, `identity.class` (+ session-tier statement) and the sanity-check level;
   new typed refusals `engine.source_changed{detail}`, `engine.format_default_contradicted
   {detail}`, `engine.identity_ordinal_partitioned_unsupported`. `SKP_VERSION` bumps (0.3),
   fixtures updated in the same commit, `deny_unknown_fields` kept.

*Source: same file, "Gates — the explicit acceptance checks", G-A1 to G-A4, lines 110–122.
Verbatim.*

- **G-A1 Fast admission is structural.** A test that observes reads on the open path (byte
  accounting or an instrumented reader): session-ordinal open → zero whole-file reads, no hash
  call, no uniqueness scan; mapped-ID open on the same file → exactly its verification scan.
  Both directions asserted in one test module so the distinction cannot drift apart.
- **G-A2 Detected-change invalidation.** Open; issue a query; mutate the file (mutation fixture);
  the next read refuses `engine.source_changed`; residency cleared; picks refused; status text
  verbatim. Asserted at the pre-check and at the post-check paths separately.
- **G-A3 Late-generation rejection.** A batch whose ticket belongs to an invalidated generation,
  delivered after invalidation, is dropped and never rendered (client test with a delayed
  batch; E2E on the shipped default). The test text states it demonstrates detection of a
  *detected* change, not of every possible modification.
- **G-A4 No generation persisted.** Typed-schema test + grep over every persisted and published
  artifact the tree can produce.

*Source: same file, "Open questions — routed", lines 134–144. Verbatim.*

## Open questions — routed

**Architect (implementation-level; do not reach the human unless they change behaviour,
authority, guarantees or scope):** the footer ceiling value; sanity-check sample size; the
exact placement of the post-check relative to DuckDB's own scan and the stream terminal; whether
the ticket→generation mapping lives in kernel state, client state, or both; SKP 0.3 bump
mechanics with Brief B's later bump.

**Human (only if they arise):** if the architect finds the post-read check cannot be honoured
without a wire change (a guarantee change); if any corpus file forces a scope change to a ruled
item.

---

## 7. The P4 records already ledgered

*Source: `.cut-archive/CUT-STATE-2026-09-13-release-0.1.0.md` (untracked working tree), the
2026-09-10 ledger line and the architect's P4 records (i) and (ii), lines 219–221. Verbatim; long
lines re-wrapped.*

- 2026-09-10 — **ARCHITECT on P1's two readings: pass with notes; neither reading needs a code
  change or an amendment — both are P4 records, verbatim below (the architect's text, to be carried
  into the P4 brief unedited).**
  - P4 record (i): "F-4 and corpus #3 (declared CRS, data axis order from the format's WKB rule):
    `sanity_level = metadata`, `sanity_reason` naming the `geo` `bbox` read and stating that no
    range check applies. Matches §3 row #3 and §3's registered `metadata ×3`. §13 B's 'a file with a
    declared CRS is not range-checked' is read with its own reason clause as R-S2's conviction
    scope, not as R-S1 level selection. No registered prediction deviates."
  - P4 record (ii): "Deviation — §5 prediction 3. Files recording `axis_provenance =
    axis:format-override`: **2** (#3 `gp-epsg4326-covering`, #8 `ogr2ogr-epsg4326-default`), not 1.
    Cause: the prediction counted the rule each file was admitted under (§3's per-row labels); the
    field records where the **data's** axis order came from. §2b assigns an axis class only in R-C4;
    the R-C2 admission is unassigned there, and of the classes named in the ADR-015 Amendment 1
    draft only `axis:format-override` ('from the format's specification, with its version') is true
    of it — no definition existed, so `axis:declared` would be false. The prediction stands as
    registered, unedited. The two routes remain distinguishable by `crs_provenance` and
    `format_rule_reference` (`geoparquet:1.1.0#crs-absent-default` vs `…#coordinate-axis-order`)."

*Source: same file, the 2026-09-11 ledger line and the architect's four P4 lines for §3 row 8, lines
251–255. Verbatim; long lines re-wrapped.*

- 2026-09-11 — **Brief A 80+81 ARCHITECT GATE: PASS** (rule path keyed on the provenance class,
  never a string; the two sources exclusive by construction; no hazard on main from the unsurfaced
  instance — the declared ordering; G-A6 satisfied as the human's qualification reads it). **P4
  lines for §3 row 8, the architect's, verbatim (carry into the P4 brief unedited):**
  > Admitted under R-C2 as predicted: `crs:format-default`, `format_rule_reference
  > geoparquet:1.1.0#crs-absent-default`, sanity `metadata`, not convicted; identity
  > session-ordinal.
  > **Original reading.** §14 item I (2026-09-10) read the unit from the admitted definition only.
  > This file carries none, so under that reading the admission recorded `coordinate_unit =
  > unestablished` with no source key, it was not a degrees instance, and this row's degrees
  > prediction stood unmet (§14 item IV, left open to the human).
  > **Resolution.** §14 item V — the human's ruling of 2026-09-11, DECISIONS-PENDING entry 81 =
  > "(b), unit:format-rule beside unit:definition", recorded before the code. The admission now
  > records `coordinate_unit = degree`, `coordinate_unit_source = unit:format-rule`; no definition
  > was read and none was invented (`declared_axis_order` absent). Not a deviation: the prediction
  > is met, by a source the original reading did not admit.
  > **What the prediction still awaits.** The row's two remaining consequences are surfaces this
  > phase does not build — the equirectangular statement on the shell status and `describe`, and the
  > publish preflight refusal `publish.geographic_crs_not_publishable` (§14 item III). Recorded
  > **`unrun — surface not built in this phase`** (§8), never as a pass by omission.
