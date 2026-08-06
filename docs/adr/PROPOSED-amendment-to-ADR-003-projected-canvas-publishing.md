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

> **Appended 2026-08-06 — the projected publishing canvas.**
>
> **A third canvas is named: the *projected publishing canvas*.** It renders a published static
> bundle **in the bundle's source CRS, with no reprojection**. It is **not** the deck.gl *projected
> working canvas* and must not be conflated with it: the working canvas is an interactive editing
> surface inside the application, and this is a self-contained viewer shipped inside a distributed
> artifact. They share a coordinate discipline — ADR-010 rule 3's offset-relative narrowing — and
> nothing else: not a renderer, not a dependency, not a lifecycle, not a platform commitment.
> **MapLibre remains the *web publishing canvas*** for sources that are web-ready, and this amendment
> neither replaces it nor changes ADR-003's dual-canvas decision for the working canvas.
>
> **Which canvas publishes a given source is an explicit, declared decision — never inferred from a
> CRS identifier string.** Selection is made against a **declared supported-CRS contract**: an
> enumerated set of CRS the web publishing canvas is known to render correctly, together with a
> **definitional-equivalence check** against that set.
>
> **The binding authority is `docs/05`, and ADR-015 supplies the clause that carries it into code.**
> `docs/05` decides CRS identity "by **comparing normalized definitions** ... and **never by
> name-string comparison**", on datum, ellipsoid, prime meridian, projection method and parameters,
> and unit. Choosing a canvas from an identifier is a name-string comparison deciding a definitional
> question, which is what that sentence forbids -- and here it decides *where the coordinates are
> drawn*, so a source labelled `EPSG:3857` whose definition differs would be routed to a Web
> Mercator canvas and drawn in the wrong place, silently.
>
> Two ADR-015 clauses bear on this, and they bear differently -- separated here because the obvious
> citation is the weaker one:
>
> - **ADR-015 §7's closing sentence is what binds later code.** Having admitted an identifier
>   comparison as *"a caller assertion about the query"*, it adds: *"It does not decide that a
>   matching identifier means the definitions agree, **and it licenses no later code to assume
>   so.**"* Canvas selection would be exactly such later code.
> - **§4 is the precedent for the *shape* of the answer, not a clause that literally covers this
>   case.** It governs admitting a caller's assertion over a source that already declares, and its
>   rule is to refuse *without comparing* -- establishing that where this project cannot make a
>   definitional judgement correctly it **refuses rather than approximates**. That posture is what is
>   adopted here; it is not a prohibition that reaches canvas choice on its own terms, and an earlier
>   draft of this document claimed it did.
>
> Until the engine can perform the equivalence check, **the set of sources routed to the web
> publishing canvas is empty by construction**, which is the only honest way to have an unimplemented
> branch.
>
> **What v1 actually does, stated so that nothing here reads as describing shipped behaviour: every
> published bundle uses the projected source-CRS viewer, always. The MapLibre branch is
> unimplemented.** There is no selection code, no supported-CRS set, and no equivalence check in the
> product; this amendment describes the *architecture* those would fit into, and the second paragraph
> is the contract they must satisfy when they are written.
>
> **Publish-time reprojection becomes an explicit, recorded operation** when the engine gains
> transforms (`docs/05`: analytical reprojection is always an explicit workflow operation, and every
> transform is recorded). Until then a bundle records `transform: none — rendered in source CRS` as a
> **fact**, not as a placeholder for a transform that was skipped.
>
> **The consequence, stated rather than apologised for: such a bundle has no basemap.** That is not
> a missing feature; it is what "no reprojection" means when basemap tiles are Web Mercator.

## What this cut established, and what it did not

Being specific here is the whole value of the document, because the easy version of this amendment
would read as though a renderer had been validated.

**Established on Windows 10 Pro 22H2 with headless Chrome 151 — one machine, one browser, and
neither of them WebView2:**

That scope line is load-bearing and is stated before the list rather than after it. **ADR-003's own
acceptance is Windows/WebView2 evidence**, and every measured number in the spike behind it came from
WebView2/ANGLE-D3D11. Nothing below was observed on WebView2. Describing this run as
"Windows/WebView2-class" — as an earlier draft of this document did — would borrow ADR-003's platform
scope for a run that never touched that platform.

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
- **Nothing about WebView2**, which is the platform ADR-003 is actually accepted on. This ran in
  headless Chrome 151. A Tauri shell embeds a system webview, so the viewer's behaviour inside one is
  unobserved here.
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
- `docs/06`'s dual-canvas section becomes a **three**-canvas section: the deck.gl projected *working*
  canvas, the MapLibre *web publishing* canvas, and the *projected publishing* canvas — with the note
  that selection between the two publishing canvases is explicit and contract-driven, never inferred
  from a CRS identifier.
- ADR-017 and `renderer/README.md` drop the word "provisional" from their descriptions of the
  publishing canvas.

## If rejected

The bundle format, the publish operation and the viewer all still work — they are files and a static
page, and nothing about them depends on this being architecture. What changes is that the **projected
publishing canvas stops being a path this project intends to keep**, and the alternatives return:
publish-time reprojection once the engine has transforms, or refusing to publish a non-web-ready
source until it does. Rejection would make the current viewer a one-off rather than a canvas, and
that is a legitimate outcome of asking the question.
