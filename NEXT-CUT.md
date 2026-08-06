# Cut brief — style v0 and static-bundle publish: the hero slice's second half

**Status:** implementation brief — transient. The final docs commit deletes this file; its content
survives as ADR-017 (Proposed), the ADR-003 amendment proposal, `engine/README.md`/viewer docs, and
the appended results section.
**Scope:** one bounded cut. Correctness-based acceptance — **no measurement campaign.** Build time
and bundle size are recorded as facts with no budget attached.
**Decisions already made by the human (do not reopen):** publishing path = **projected-canvas
bundle** (viewer renders in the source CRS; no reprojection in this cut); **DuckDB-WASM in-browser
query deferred to v1** (manifest reserves the surface); style v0 and bundle shape as specified
below.

## Objective

Complete docs/07's hero slice end-to-end: open → SQL filter → **style → publish a static
interactive bundle**. Four pieces, architect first:

1. **Style v0** — typed, versioned, canonical style document compiled deterministically to canvas
   draw parameters.
2. **Bundle format** — versioned manifest + canonical partitioned query data.
3. **Publish operation** — cancellable local static-bundle generation with staging and atomic
   finalize. No upload, no managed service (ADR-008).
4. **Bundle viewer** — static, self-contained, projected-canvas rendering of the bundle with
   pan/zoom/hover/legend.

## Required workflow

1. Clean worktree; record the base commit (branch from pushed `main`).
2. Read `CLAUDE.md`, docs 01/03/05/07/09/11/14, ADR-005, ADR-008, ADR-010, ADR-015, ADR-016, and
   `kernel/RESULTS.md`'s third section.
3. **Architect before code**, settling at minimum: the style document schema and its versioning;
   the manifest's exact fields, including the **minimal docs/11 ResourceRef-conformant subset**
   (this is the project's first persisted artifact — docs/11 and ADR-005 activate; a named,
   minimal conformance is required, a silent partial one is not); staging/atomic-finalize
   semantics including re-publish over an existing bundle (atomic replace or typed refusal —
   declared, not discovered); and the viewer's hover/identity approach under ADR-010 rule 2.
4. Implement; deterministic tests; ordinary workspace suite green.
5. Reviewer over code; resolve blocking findings.
6. Tester validates the acceptance checklist end-to-end and records build time/size facts.
7. Reviewer over the evidence write-up. `git status --porcelain` empty.

## Points the architect must close explicitly (human addendum — where this conflicts with a section below, this wins)

1. **Attribute projection.** The current fixture has only id/bbox/geometry, and the streamed
   envelope carries only id+geometry — style `match`, hover attributes and the legend have nothing
   to bind to. Add a deterministic categorical fixture column, and state: whether the bundle
   publishes all query-result attributes or an explicit projection; which Arrow types are
   admissible as published attributes; and how NULLs travel end-to-end (envelope → partition →
   viewer → legend fallback).
2. **The persistent format is not yet named.** "Partitioned GeoArrow" must become: Arrow IPC file
   vs stream framing; compression choice; maximum partition rows and bytes; deterministic
   stable-ID ordering; partition boundary rule; dictionary policy; asset naming scheme.
   Byte-identical rebuilds depend on every one of these — the determinism assertion is vacuous
   until they are declared.
3. **Bound cancellation by bounding partition size.** Between-partition polling alone is
   insufficient if one partition can take substantial time to encode or write; the declared
   maximum partition size is what makes the cancellation cadence a bound rather than a hope.
4. **The manifest carries the canonical SQL/parameters or an operation digest.** Source hash +
   style hash + engine version cannot reproduce a *filtered* query result by themselves; the
   reproducibility grade's basis is incomplete without the operation.
5. **License honesty.** The fixture declares no license metadata. Represent it as
   `unknown / not-declared`; do not invent attribution to satisfy the checklist.
6. **Build the real `renderer/` ownership boundary.** The viewer reuses the canvas probe's
   *validated coordinate approach*, but probe/archive code is not promoted into the product
   renderer — this cut creates the `renderer/` module docs/02 names, and the probe stays an
   instrument.
7. **Scope honesty in the final result.** Functional style/publish completion is validated on the
   100k fixture. Five-gigabyte publishing scale and DuckDB-WASM queryability remain open — do not
   call them complete.
8. **Projected-canvas publishing is provisional** until the human explicitly approves the ADR-003
   amendment proposal. The bundle ships in this cut; the architectural claim waits.

## Piece 1 — style v0

- **Versioned canonical JSON** (stable key order, canonical number formatting — the style hash must
  be reproducible). `style_version` field mandatory.
- **Polygons only.** Properties: fill color, fill opacity, outline color, outline width.
- Values: **literals, plus exactly one schema-checked categorical `match`** on a named column —
  the column must exist in the dataset schema and its type must be admissible for matching;
  mismatch is a typed error at style-compile time, not a runtime surprise.
- **Explicit NULL/fallback behavior**: the style declares what a NULL match key and an unmatched
  value each render as; omission is a compile error, not a default.
- **Not in v0** (refused by schema, not silently ignored): labels, icons, scale-dependent rules,
  any general expression language, any editor.
- Deterministic compile: same style + same schema → identical draw parameters; property-tested on
  the categorical path.
- The style's canonical hash is computed once at compile and carried into the manifest.

## Piece 2 — bundle format

- **Canonical source of truth: partitioned query data** (GeoArrow, the engine's existing envelope
  discipline — every partition carries its CRS/frame/axis-order tags per ADR-010 rule 1).
  **PMTiles is an optional derived display cache and is NOT built in this cut**; the manifest
  format reserves a slot for derived caches so adding one later is not a format change.
- **Versioned manifest** (`bundle_version`), canonical JSON, recording at minimum: content hash of
  every asset; source CRS and display CRS **with the transform between them recorded explicitly as
  `none — rendered in source CRS` in v0**; schema; bounds; identity provenance (the ADR-016
  envelope facts: id column or mapping, what was checked); style hash; attribution and license
  (docs/14) — carried from dataset metadata when declared, and represented honestly as
  `unknown / not-declared` when absent (the current fixture's case; addendum point 5); the
  **canonical query/operation digest** (addendum point 4); and **reproducibility grade** (ADR-005)
  with its basis stated —
  the grade is claimed from what is actually pinned (source content hash, style hash, engine
  version), and an unstateable grade is reported as its honest lower level, never inflated.
- **Determinism:** publishing the same inputs twice yields byte-identical manifests and identical
  hashes. Wall-clock timestamps, if recorded at all, live in a separate non-hashed sidecar field
  and are excluded from the determinism assertion.
- **Redaction (docs/09):** no local filesystem paths, no usernames, no machine identifiers, no
  credentials anywhere in the bundle. Asserted by a test that greps the emitted bundle, not by
  intention.
- The manifest reserves the **v1 in-browser query surface** (schema + partition layout are already
  canonical); nothing else about WASM lands in this cut.

## Piece 3 — publish operation

- A kernel/engine operation: **cancellable, progress-reporting, streaming** (docs/01 principle 7)
  — cancellation observed between partitions at minimum, leaves no partial output.
- **Staging directory + atomic finalize** (rename). A bundle is either complete and valid or absent;
  no observer can see a partial bundle under the final name. Re-publish behavior per the
  architect's declared choice.
- Typed errors for: destination not writable, insufficient space, source dataset changed underneath
  (content hash mismatch between open and publish — detected, refused), style/schema mismatch.
- Records build wall time and bundle size as facts in the results write-up. No budget, no campaign.

## Piece 4 — bundle viewer

- **Static and self-contained**: works from any generic static file server with the network
  otherwise blocked — zero external requests (no CDN, no fonts, no tiles). Everything it loads is
  in the bundle and hash-listed in the manifest.
- **Projected canvas in the source CRS** (the decided path): OrthographicView-style rendering in
  EPSG:2056, offset-relative f64→f32 per ADR-010 rule 3 — the canvas-probe's validated *approach*,
  implemented in the new **`renderer/` module** this cut creates (addendum point 6; probe code is
  not promoted), applying the style's compiled draw parameters. No basemap in v0; state it in the viewer, not
  as an apology but as the recorded consequence of the decided path.
- **Interactivity:** pan/zoom; hover resolves the feature and shows its attributes via **stable
  id from the loaded authoritative f64 data** (a lookup, per ADR-010 rule 2 — never a
  reconstructed coordinate presented as authoritative); a legend derived from the style's
  categorical match and its declared fallback.
- **Corrupt-asset behavior:** a partition that fails to decode, a manifest hash that does not
  match a verified asset, or a truncated file produces a **visible, named failure state** in the
  viewer — never a silently partial map (ADR-010 rule 5's staleness discipline applied to a
  static artifact). Declare exactly what the viewer verifies (at minimum: manifest parse, asset
  presence, decode success, row/byte counts; full content re-hashing is the architect's call —
  declared either way).

## Constitution work in this cut

- **Draft ADR-017 — Static Bundle Format and Publish Semantics (Proposed).** The manifest is an
  external contract; it gets an ADR. Contents: the manifest schema, determinism and redaction
  guarantees, the derived-cache and v1-query reservations, and versioning policy. Proposed, not
  accepted — acceptance is the human's.
- **Draft the ADR-003 amendment proposal** (appended form, NOT applied): published bundles render
  on the projected canvas when the source CRS is not web-Mercator-ready; MapLibre remains the
  publishing canvas for web-ready CRS; publish-time reprojection becomes an explicit recorded
  operation when the engine gains transforms (docs/05). Leave it as a drafted proposal for human
  approval.
- Do not amend any Accepted ADR. Do not touch ADR-011/012/013/016 statuses.

## Acceptance checklist (correctness, end-to-end)

- Publish the 100k-polygon fixture with a categorical style; serve the bundle from a generic
  static server with network access otherwise blocked; a **visibly styled result** renders, with
  legend and hover working.
- Publishing twice from identical inputs → **byte-identical manifest, identical hashes**.
- Corrupting one partition and one manifest entry each produce the **named failure state**.
- Cancelling mid-publish leaves **no partial bundle** under the final name.
- Redaction grep passes on the emitted bundle.
- Attribution/license and reproducibility grade present in the manifest with stated basis.
- Ordinary workspace suite green; viewer build reproducible.
- Build time and bundle size recorded as facts.
- Architect consulted before code; reviewer over code and evidence; tester owns the checklist run.
- The final write-up states scope honestly: validated on the 100k fixture; 5 GB publishing scale
  and DuckDB-WASM queryability remain open (addendum point 7); projected-canvas publishing is
  provisional pending the human's ADR-003 amendment approval (addendum point 8).
- `git status --porcelain` empty; this file deleted in the final docs commit.

Recommended commit separation:

1. `feat: style v0 — versioned canonical schema, categorical match, deterministic compile`
2. `feat: bundle manifest and partitioned data emission`
3. `feat: cancellable publish with staging and atomic finalize`
4. `feat: static bundle viewer on the projected canvas`
5. `docs: ADR-017 (proposed), ADR-003 amendment proposal, results section`
