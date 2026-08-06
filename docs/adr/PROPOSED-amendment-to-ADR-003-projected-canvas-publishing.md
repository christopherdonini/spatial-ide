# Proposed amendment to ADR-003 — the publishing canvas for non-web-ready CRS

**Status:** **Proposal. NOT APPLIED.** ADR-003 is Accepted and its text is untouched; this document
is a drafted amendment awaiting the human's approval, and until then **projected-canvas publishing is
provisional**. Nothing in this repository may cite it as settled.
**Would amend:** ADR-003 (renderer + arbitrary-CRS strategy — Accepted 2026-08-03 for
Windows/WebView2), by **appended amendment**, never by rewriting.
**Related:** ADR-008 (static publishing first), ADR-017 (static bundle format — Proposed),
`docs/06` (dual canvas), `docs/05` (analytical vs display reprojection), `docs/07`.

## Why an amendment is needed

ADR-003 names **two** canvases, and `docs/06` restates them:

- a **projected 2D canvas** — the *working* canvas: current project CRS, offset-relative rendering,
  deck.gl custom views/layers;
- a **web publishing canvas** — MapLibre: Web Mercator/globe, basemaps, PMTiles/vector tiles,
  **published bundles** (ADR-008).

The hero slice's publishing half has now been built, and what it produces is **neither**. A bundle
whose source CRS is EPSG:2056 renders on a **projected 2D canvas in that CRS, with no reprojection at
all** — because this cut has no reprojection to offer, and drawing a Web Mercator basemap under
LV95 coordinates would mean either transforming the data (which `docs/05` makes an explicit,
recorded operation this engine cannot yet perform) or putting two coordinate systems on one canvas
and hoping.

So the choice was: reproject at publish time without the machinery to do it correctly, refuse to
publish a non-web-ready source, or publish on a projected canvas. The human chose the third. This
amendment is where that choice would become architecture rather than an implementation detail that
quietly contradicts an Accepted ADR.

## The proposed amendment text

> **Appended 2026-08-06 — publishing canvas for sources that are not web-Mercator-ready.**
>
> A **published static bundle renders on the projected canvas, in the source CRS**, when the source
> CRS is not web-Mercator-ready. **MapLibre remains the publishing canvas for web-ready sources**,
> and this amendment neither replaces it nor changes ADR-003's dual-canvas decision for the working
> canvas.
>
> **Publish-time reprojection becomes an explicit, recorded operation** when the engine gains
> transforms (`docs/05`: analytical reprojection is always an explicit workflow operation, and every
> transform is recorded). Until then a bundle from a non-web-ready source records
> `transform: none — rendered in source CRS` as a **fact**, not as a placeholder for a transform that
> was skipped.
>
> **The consequence, stated rather than apologised for: such a bundle has no basemap.** That is not
> a missing feature; it is what "no reprojection" means when basemap tiles are Web Mercator.

## What this cut established, and what it did not

Being specific here is the whole value of the document, because the easy version of this amendment
would read as though a renderer had been validated.

**Established, on Windows/WebView2-class hardware, one browser, one machine:**

- A projected 2D canvas in EPSG:2056 renders a published bundle **functionally and correctly** at
  100 000 polygons: every partition verified against the manifest, the style's four declared branches
  visibly applied, a legend derived from the style, and hover resolving through the stable feature id.
- All 100 000 published `(id, attribute)` pairs matched an independent oracle — so the identity
  indirection rule 2 requires is intact end to end through publish and re-decode.

**Established by unit test rather than by that run, and attributed here so the two are not
conflated:** the ADR-010 rule 3 discipline on this path — the origin subtraction happening in f64
before the canvas narrows, with a control that loses the same offset when the absolute coordinate is
narrowed first. That is arithmetic asserted in a test, **not a precision measurement**, and the next
section says so.

**Not established, and none of it may be inferred:**

- **No frame time. No picking latency. No precision measurement.** This cut is correctness-based and
  measures nothing. No figure from it bears on `docs/08`'s budgets.
- **Nothing at 5 GB.** `docs/07`'s hero slice names a 5 GB GeoParquet; this is 100 000 features.
- **Nothing about macOS or Linux** — the same limit `docs/07` already places on ADR-003.
- **This viewer is a 2D canvas, not deck.gl.** It is therefore **not evidence about ADR-003's chosen
  projected-canvas implementation**, in either direction. The dual-canvas decision, the deck.gl
  choice, and ADR-003's per-platform acceptance status are all untouched by it.
- **It is a third canvas.** ADR-003 names two; a projected 2D canvas rendering a published bundle is
  neither of them, and this amendment is what would make its existence architectural rather than
  incidental.

## Both of ADR-008's stated Consequences are outstanding

ADR-008 says: *"The web publishing canvas (ADR-003) renders these bundles; DuckDB-WASM keeps them
queryable in the browser."* **Neither holds today.** This proposal addresses the first. The second is
the human's explicit deferral of in-browser query to v1, with only the manifest surface reserved
(ADR-017 §9). Naming both is what keeps this amendment honest rather than partial.

## If approved

- ADR-003 gains the appended text above, and nothing else changes in it.
- `docs/06`'s dual-canvas section gains a sentence noting the publishing canvas is chosen by whether
  the source CRS is web-ready.
- ADR-017 and `renderer/README.md` drop the word "provisional" from their descriptions of the
  publishing canvas.

## If rejected

The bundle format, the publish operation and the viewer all still work — they are files and a static
page, and nothing about them depends on this being architecture. What changes is that the **projected
publishing canvas stops being a path this project intends to keep**, and the alternatives return:
publish-time reprojection once the engine has transforms, or refusing to publish a non-web-ready
source until it does. Rejection would make the current viewer a one-off rather than a canvas, and
that is a legitimate outcome of asking the question.
