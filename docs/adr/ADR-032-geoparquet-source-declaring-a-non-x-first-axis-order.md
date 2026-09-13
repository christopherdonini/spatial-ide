# ADR-032 — Axis order for a GeoParquet source whose CRS definition declares a non-x-first order

*Redrafted 2026-09-10 at Brief A's P0 by the architect agent on the custodian's brief, as this cut's accepting record — for the human's sight on `cut/admission-format-semantics`. Sentences marked **[H]** are the human's verbatim; everything else is drafting. Cites marked **[2nd]** are taken from `RELEASE-DRAFTS-0.1.0/post-tag/architect-consult-adr-032.md` and were not re-read in the P0 pass. The 2026-09-08 filing this replaces is in git history (`docs/README.md` still describes it as "decision deliberately open" until acceptance).*

**Status:** **Proposed** — filed 2026-09-08 on the human's ruling (DECISIONS-PENDING entry 59 = (a), verbatim: **[H]** *"ADR-032 filed Proposed (4326 via the GeoParquet x,y override, decision open)"*). **This text is the accepting draft prepared at Brief A's P0; acceptance comes at P6 and only in the human's own words. Until then it binds nothing.** The human's sequencing note, not a decision: **[H]** *"ADR-032 (4326 admission) likely outranks LOD."*

**Related:** ADR-015 §5 (`:56-60`; conflict block `:62-75`; OPEN block `:150-153`, unanswered here) · ADR-013 · ADR-010 rule 1 · ADR-017 §14 and its spent v1 schema lever · ADR-025 (the refuse-typed-at-preflight pattern, `:3-4`) · ADR-026 · ADR-003 (the accepted rendering claim is EPSG:2056 on Windows/WebView2) · docs/01 principle 8 and docs/01:21 · docs/05.

## Context

ADR-015 §5 establishes axis order from the CRS definition and refuses a non-x-first source rather than reinterpreting it: `engine/src/dataset.rs:302-307` (`EngineError::AxisOrderUnsupported`), the message at `engine/src/error.rs:213-217`, `engine/src/crs.rs:120-124`. The refusal is the **resolved** behaviour of a genuine docs/05-vs-docs/01 conflict, decided lower-number-wins (`ADR-015:62-75`), not a gap.

GeoParquet 1.1.0 states — pinned verbatim with URL, retrieval date and page sha256 at `spikes/item8-crs-catalog-extension/README.md:55-72` — that WKB coordinates in a GeoParquet are *"always (x, y)"* and that this *"explicitly overrides the axis order as specified in the CRS"*, with the note that *"EPSG:4326 and OGC:CRS84 are equivalent with respect to this specification"*. So a conforming EPSG:4326 GeoParquet holds two facts in conflict, both present in the file: a definition whose `coordinate_system.axis` is latitude-first, over WKB that is longitude-first. Today's engine reads the *declared* order and applies it to the *data*, which the format says are not the same fact.

The pinned record states its own limit at `:74-77`: it does not establish that any producer honours the rule. A check can convict a violating producer; it can never confirm conformance.

Three corrections to the 2026-09-09 draft's cites, made before this text: the "equirectangular" wording is carried at `RELEASE-0.1.md:1041`, and the architect's "said in the UI and the manifest" correction in `DECISIONS-PENDING.md`'s entry-59 record; `DECISIONS-PENDING.md:37` carries the ruling that the wording is binding for future geographic entries **[2nd]**. The `crs_transform` string is at `kernel/src/publish/mod.rs:1259`, not `:1187` **[2nd]**. `MIN_ANCHOR_SPAN = 1` is justified at `frontends/shell/src/canvas/tileGrid.ts:76-78` as "one authoritative-CRS unit", which in degrees is a declared bound that stops being true — a substantive consequence, not a naming problem **[2nd]**.

The v0.1.0 release shipped EPSG:3857 alone; KNOWN-LIMITATIONS states the 4326 refusal prominently.

## Decision

As stated by Brief A's settled boundary 1 (`RELEASE-DRAFTS-0.1.0/post-tag/DRAFT-2-BRIEF-A-admission-and-session-lifecycle.md:25-29`), which this ADR records rather than reopens:

1. **An absent `crs` key is the format's own default, not a guess.** It admits as OGC:CRS84 with provenance **`crs:format-default`**, carrying the specification version and the pinned rule that established it. The provenance is shown to the operator and recorded on the envelope.
2. **An explicit `crs: null` is unchanged**: unknown — assertion required (`engine/src/geoparquet.rs:98-109`, `engine/src/crs.rs:236-239`).
3. **WKB coordinate order is established from the format specification**, with provenance **`axis:format-override`**. **The definition's own axis order is RETAINED as a recorded fact for future reprojection and export, and is never discarded.**
4. **Reader-only.** The data order is established in the GeoParquet reader. `crs.rs::is_x_first` (`:120-124`) and `crs::admit` (`:218-240`) are not touched, and a diff that touches either fails on sight.
5. **Nothing is normalized**: `axis_normalization` stays `none-performed` (`engine/src/envelope.rs:88`). No coordinate value is transformed.
6. **A format rule applies only where its governing text is pinned in-tree** (URL, retrieval date, page sha256). Where it is not, no rule applies and the existing typed refusal stands.
7. **A range check may convict, never confirm.** No string, comment or status may report that a producer conformed.

This is candidate (B) of the original Decision block, decided; (A) and (C) are not taken. Neither licenses reprojection — docs/05's definitional-equivalence machinery stays owed.

## Consequences

- **ADR-015 Amendment 1** is required and is the human's: §5 sentence 1 carries two facts (declared order from the definition; data order from the source format's specification where that format states one), and sentence 3's `AxisOrderUnsupported` narrows to sources for which no format rule establishes the data order. Sentence 2 (`AxisOrderUnestablished`) and sentence 4 (`none-performed`) are unchanged; the docs/05 conflict resolution is unchanged; §5's OPEN block is **not** answered.
- **ADR-013** gains a geographic-degrees **instance**, not a new coordinate-space class: class is compile-time, CRS is runtime instance data, and §1's warning that class alone confers no ground-truth permission is the governing text.
- **The display convention must be named wherever a degrees dataset is shown**, in the human's binding wording: **[H]** *"no coordinate value is transformed; the display convention is equirectangular"* (`RELEASE-0.1.md:1041` **[2nd]**). docs/01:21 permits display reprojection only through an explicit, visible view transform, so an unnamed convention is a silent one. No metre-denominated readout, scalebar or area may appear in this mode (docs/01:21; docs/05).
- **ADR-017 §14 is deferred to Brief B**, via Brief A's boundary 8 (`DRAFT-2…:61-62`): **publishing a degrees dataset refuses at preflight by name** until Brief B's reader change — the ADR-025 pattern (`docs/adr/ADR-025-publish-above-the-readers-ceilings.md:3-4`), never a dead artifact. No manifest key is added at `bundle_version` 1; no bundle is written that a shipped reader pins `easting,northing` against.
- **`MIN_ANCHOR_SPAN`** and the metre-named records in `offsetFrame.ts` / `tileGrid.ts` need a unit-aware declared value or a typed refusal for degrees (ADR-010 rule 6); this is a declared bound going false, not a rename.
- **No precision, rendering-quality or performance figure attaches to a geographic CRS.** ADR-003's and ADR-010 rule 3's evidence is EPSG:2056 on Windows/WebView2; a carried-across number fails on sight (docs/08).
- **ADR-026**'s 2026-09-08 implementation note becomes dated-stale; its definition-supply provenance is unchanged.
- The refusal message at `engine/src/error.rs:213-217` is corrected: it claims the engine "emits (easting, northing) only" while `engine/src/crs.rs:122-123` already admits `LongitudeLatitude`.

## What this does NOT decide

Reprojection, or the ADR-013 §2 transform service, which does not exist · normalization on ingest (candidate C) · ADR-015 §5's OPEN normalize-later question · ADR-016's stability-across-reopen OPEN block · the GeoArrow export path: `engine/src/geoarrow.rs:97-103` embeds the definition verbatim, so an external consumer would receive a lat-first definition over an x-first buffer — that contradiction is resolved only against a **pinned** GeoArrow metadata reading, which does not exist in this tree, and no GeoArrow export is licensed until it does · the geometry-type admission gate at `engine/src/dataset.rs:275-282`, which is untouched and refuses most public GeoParquet before any rule here is reached (DECISIONS-PENDING entry 73) · any `docs/08` row.

## Reopen conditions

A GeoParquet specification revision that changes or withdraws the axis-order override, or that changes the absent-key default · a pinned reading of a specification version whose rules differ from those pinned here · evidence of a producer population that violates the override at a rate the falsification check cannot convict · the arrival of a second bundle reader, which is ADR-025's own reopen trigger and is what lifts the boundary-8 preflight refusal · acceptance of the transform service, at which point ADR-015 §5's OPEN block, not this ADR, is the venue.
