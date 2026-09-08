# ADR-032 — Axis order for a GeoParquet source whose CRS definition declares a non-x-first order

**Status:** Proposed — filed 2026-09-08 on the human's ruling (DECISIONS-PENDING entry 59 = (a),
verbatim: *"ADR-032 filed Proposed (4326 via the GeoParquet x,y override, decision open)"*). The
decision is deliberately OPEN (the ADR-023/ADR-029 pattern). Drafted from the architect's skeleton at
the release cut's item-8 consult (`RELEASE-0.1.md` Amendment 7). Binds nothing until accepted. The
human's sequencing note for the post-release call, not a decision: *"ADR-032 (4326 admission) likely
outranks LOD."*

**Related:** ADR-015 §5 (axis order established from the definition; a non-x-first source refused
rather than reinterpreted; its OPEN block reserves the normalize-later question), ADR-026 (the pinned
CRS catalog; its implementation note declines this question), ADR-010 rule 1 (the envelope names the
space it carries), ADR-017 §14 (the bundle viewer's reader contract) and its spent schema lever,
ADR-003 (the accepted rendering claim is EPSG:2056 on Windows/WebView2), docs/01 principle 8 and the
CRS-is-a-type rule (docs/01:21), docs/05:26 ("the EPSG:4326 lat/lon trap") and docs/05:66.

## Context

ADR-015 §5 establishes axis order from the CRS definition and refuses a non-x-first source rather than
reinterpreting it (`engine/src/dataset.rs:303-307`, `EngineError::AxisOrderUnsupported`;
`engine/src/crs.rs:120-124` "refused rather than reinterpreted"; `engine/tests/slice.rs:310-324`),
resolving a docs/05 conflict lower-number-wins; ADR-026's implementation note restates the refusal.
The GeoParquet specification v1.1.0 states — pinned verbatim with URL, retrieval date and page hash in
`spikes/item8-crs-catalog-extension/README.md` §2 — that the WKB coordinates it stores are always
(x, y) and that this *"explicitly overrides the axis order as specified in the CRS"*, and that
*"EPSG:4326 and OGC:CRS84 are equivalent with respect to this specification"*. If that holds, an
EPSG:4326-declared GeoParquet — the commonest file a stranger brings; most public GeoParquet is
WGS 84 — is refused with a message that misdescribes the file (`engine/src/error.rs:72-76` calls the
refused order "the EPSG:4326 trap `docs/05` names, in its GeoParquet form", when the format's form of
the trap is the opposite), and no catalog entry can fix it: the caller-assertion path reads axis order
through the same function (`engine/src/dataset.rs:291-300`). Three readers pin `easting,northing`:
`renderer/bundle-viewer/src/partition.ts:29` (checked per partition at `:115-121` → the ADR-017 §14
state `envelope-axis-order-mismatch`), `frontends/canvas-probe/src/geoarrow.ts:90-92`, and the
envelope's own value (`engine/src/envelope.rs:87`). `engine/src/geoarrow.rs:97-103` embeds the
definition verbatim in the GeoArrow field, so under an override an external reader would receive a
lat-first CRS over an x-first buffer unless the field's metadata is resolved against the GeoArrow
specification.

The release cut shipped EPSG:3857 alone (entry 59 = (a)); v0.1.0's KNOWN-LIMITATIONS states the 4326
refusal prominently.

## Decision — OPEN

Candidates, ranked by the architect's consult of 2026-09-08 (the ranking is not a decision):

- **(A) Hold the refusal.** Admit only definitions whose declared order is x-first — OGC:CRS84 as
  the honest catalog entry for "WGS 84 longitude/latitude" — stating the limitation. Zero code
  change; helps only files that declare NO CRS (the assertion path admits an assertion only when the
  file declares nothing, `engine/src/crs.rs:218-240`), not a stranger's 4326-declared file; the OGC
  authority escapes the EPSG attribution guard (`crs_catalog.rs`) while the values are EPSG-derived —
  a conscious, recorded decision if taken.
- **(B) Establish the data's order from the format specification, in the format reader only**
  (`engine/src/geoparquet.rs`, never `crs.rs`'s `is_x_first`): record BOTH facts — the declared order
  and the data order with the rule and spec version — leave `axis_normalization = none-performed`
  (nothing is normalized), widen the x-first reader set (the three readers above), and add a
  falsification-only guard (geographic + degree units → refuse if the covering bbox has |latitude| >
  90 — it can convict a violating producer, never establish conformance). Consequences: an ADR-015
  amendment (the human's); ADR-017 §14's reader contract and digest row 11 restated, `bundle_version`
  2 if any manifest key is added (the v1 schema lever is spent); an SKP value-domain statement; a
  degree-domain fixture mode (`CrsMode::DeclaredLatLonFirst` is a metadata trap over LV95 metres, not
  a degrees dataset); the GeoArrow field's declared-vs-buffer contradiction resolved against the
  GeoArrow metadata specification, pinned; ADR-026's note dated-stale; the rendering claim stated as
  "no coordinate value is transformed; the display convention is equirectangular" (binding wording
  for any geographic entry — entry 59), with an appended dated note on ADR-003's `crs_transform`
  string; metre-named records (`offsetFrame.ts`, `tileGrid.ts`) renamed or noted; no precision or
  perf claim attaches (ADR-003's and ADR-010 rule 3's evidence is EPSG:2056 only).
- **(C) Normalize on ingest** per docs/05:64-67 — out of scope for a slice with no transform.

Neither (A) nor (B) licenses reprojection; docs/05's definitional-equivalence machinery stays owed.

## Consequences

Of the OPEN state: the hero slice refuses the commonest CRS in the wild, declared in KNOWN-LIMITATIONS
(v0.1.0). Of (B), the only candidate with cost: listed above; a cut of its own, never a release-cut
item. Of (A): a QUICKSTART sentence that CRS84 helps a file that declares nothing, not a 4326 file.

## Reopen / decide condition

Decided when the human rules between (A) and (B) — the post-release sequencing call the human has
noted ("likely outranks LOD"). Any GeoParquet specification revision that changes the axis-order
override reopens the context.
