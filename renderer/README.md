# `renderer/` — the renderer module

`docs/02`'s **renderer** module: "GPU map rendering, labels, **style compilation**". This first cut
implements **style compilation and the bundle viewer**, and nothing else. There is no GPU code, no
scene graph and no label engine here, and none is claimed — naming a directory does not conjure a
module, and `docs/07`'s method is vertical slices.

| | |
|---|---|
| **`src/`** (Rust, `spatial-renderer`) | Style v0: the document schema, its refusals, the declared canonical-JSON subset, and compilation against a dataset schema |
| **`bundle-viewer/`** (TypeScript) | The static viewer that ships inside a published bundle: projected canvas in the source CRS, pan/zoom, hover, legend, and asset verification |

## Its relationship to `frontends/canvas-probe`

Four sentences, because this is a boundary and not a footnote.

1. **This is docs/02's renderer module**; it owns style compilation and the bundle viewer.
2. **`frontends/canvas-probe` is an instrument, not a predecessor implementation.** No code was
   promoted from it — not a file, not a function body, not a type name.
3. The probe independently exercised **ADR-010 rules 1, 3, 5 and 7 on the streaming data plane**;
   this module derives the same rules **from ADR-010 directly** and cites the ADR by rule number.
4. **The probe is not superseded.** It consumes a socket; this consumes static files. They exercise
   different paths and both remain live.

Two of those are checked rather than remembered. `bundle-viewer/scripts/boundaries.test.mjs` asserts
that **no file anywhere under `renderer/` mentions the probe** — this README and that test are the
only exceptions, because they are where the rule is written down. And there is no import, no
dependency, and no build-graph edge: `bundle-viewer/` has its own `package.json` and builds standing
alone.

Where the two converge on the same arithmetic — `f32(coord − origin)` is one line however you write
it — that convergence is the rule doing its job, not promotion. Where they diverge, they diverge
because the jobs differ: this viewer additionally checks the declared **attribute-column list** and
the manifest's byte count, content hash and row count for every partition, none of which the probe
knows about. See "What is verified" below for the exact set, stated because "stronger" is not a
specification.

**`frontends/canvas-probe` is byte-identical to `a64b861` and stays that way.**
`kernel/RESULTS.md`'s third section discharges its invalidator 14 on exactly that fact, so editing
the probe — even to add a comment pointing here — would retire a discharged invalidator and be a
post-result change to a pinned instrument. Everything about the relationship therefore lives in this
file, which is new text and cannot perturb anything measured.

## Style v0

Four properties over polygons — fill colour, fill opacity, outline colour, outline width — whose
values are **literals plus at most one categorical `match`** over a named text column.

- **`on_null` and `on_unmatched` are required.** Omitting either is a compile error rather than a
  default, because the two questions a categorical style always faces are exactly the ones a default
  answers invisibly.
- **Everything not in v0 is refused by the schema, never ignored**: labels, icons, scale-dependent
  rules, any expression language. The refusal names the construct.
- **Compilation is against a dataset *and* a published projection.** A match on a column that exists
  but is not published would compile and then fail at view time; `MatchColumnNotPublished` catches it
  before a bundle is written.
- **The legend is a function of the style, not of the data.** Every declared case appears whether or
  not the bundle contains one. Deriving it from the data would make it filter-dependent.

### The canonical-JSON subset, and why it is stated in implementation-independent terms

`docs/14` makes every file format open, permanently. A canonical form defined by a Rust
standard-library formatting detail is not an open format, so the grammar is written out — encoding,
key order, string escapes, and a **number grammar** — and Rust's agreement with it is a property
test rather than the definition.

Doubles are the part that matters: **the shortest fixed-point decimal with at least one fractional
digit that parses back to the identical IEEE-754 double, never an exponent**, with `-0.0` normalized
to `0.0` and non-finite values refused. To keep "never an exponent" a promise rather than a
coincidence, the admissible domain is restricted to `0` or `1e-6 ≤ |v| < 1e15`, and anything outside
it is **refused** rather than written in a form the grammar cannot express. EPSG:2056 magnitudes sit
comfortably inside, which is what the manifest's `bounds` need.

This is a **declared canonical subset**. It is deliberately not RFC 8785 / JCS, it is not described
as such anywhere, and JCS is not implemented.

### One grammar, two artifacts

The bundle manifest canonicalizes through this same module. That is a decision, not convenience:
two grammars would be two things to specify, two to re-implement, and two that can drift while
looking identical.

## The bundle viewer

Static and self-contained. Everything it loads is in the bundle and hash-listed in the manifest, and
it makes **zero external requests** — no CDN, no font, no tile, no basemap, no beacon. The built
bundle is scanned for absolute URLs rather than trusted to have none.

**Projected canvas in the source CRS.** ADR-010 rule 3 binds: the origin subtraction happens in f64
before the canvas narrows, and the render origin is renderer-local state that crosses no boundary —
it is not in the manifest and must never be, because persisting one would be persisting an untagged
renderer-local coordinate.

**No basemap**, stated on the page as the recorded consequence of the decided publishing path rather
than as a missing feature: basemap tiles are Web Mercator, and showing one would mean either
reprojecting the data — which this cut deliberately does not do — or drawing two coordinate systems
on one canvas.

**Hover is a lookup, per ADR-010 rule 2.** The cursor is unprojected to select a candidate and the
value is then discarded; identity comes from `partition.ids[featureIndex]`, never from the index
itself, and the `(partition, feature index)` pair is never flattened into a global ordinal. **No
cursor-derived coordinate is displayed at all** — stronger than rule 2's requirement that one be
visibly marked.

### What is verified, exactly

Stated as a list rather than as an adjective, because a reader deciding how much to trust a rendered
map needs the set and not a summary of it.

**Checked, before anything is drawn:**

| | |
|---|---|
| `manifest.json` | parses; `bundle_version` is one this build implements; every asset path is bundle-relative with no `..`, no drive letter and no leading `/` |
| `style.json` | content hash matches the manifest; parses; `style_version` is one this build implements; the geometry is `polygon` and all four properties are style values |
| every partition | byte count matches the manifest; **content hash** matches the manifest; decodes; row count matches the manifest; the envelope's `frame`, `crs` (against the manifest's), `axis_order`, `geometry_encoding` and `attribute_columns` (against the manifest's) all match; every declared attribute column is present |
| ceilings | features, partitions, resident bytes and attribute columns are all inside the declared ceilings |

**Carried but not checked, and this is the part an adjective would hide:**

- **The identity facts.** `id_source`, `id_uniqueness`, `id_verified_rows` and the caveat are read
  from the manifest and **displayed**. They are never compared against the partition envelopes, and
  nothing here re-verifies uniqueness — it is a claim the publisher made, shown as one.
- **The schema, beyond column names.** Attribute presence is checked; **Arrow types are not
  compared** against the manifest's `schema` block.
- **The viewer's own assets.** `manifest.viewer` lists a hash for each, and this page **does not
  fetch or hash them**. It cannot: it *is* them. Those hashes are for an **external** verifier, and
  the chain of trust does not close inside the browser.
- **`build-info.json`.** Not hash-listed, not fetched, not trusted, and its absence changes nothing.

**How it is verified.** Pure-JS SHA-256 as the single unconditional path: `crypto.subtle` needs a
secure context, and ADR-008's targets include plain-HTTP and `file://` hosts, so branching on
availability would make *whether verification happens* depend on the origin. Hashing is chunked and
yielded so it cannot block the canvas.

**On failure: stop, keep what is drawn, name the state.** Loading halts, the canvas keeps every
partition that passed its hash, and a non-dismissable banner names the failure state and the asset,
says the map is incomplete, and says that hover covers only what loaded. Erasing the canvas would
destroy verified information while telling the reader less; ADR-010 rule 5 asks for a visible signal,
not for erasure.

### Declared ceilings (ADR-010 rule 6), and the behaviour at each

`MAX_FEATURES` 2 000 000 · `MAX_PARTITIONS` 100 000 · `MAX_RESIDENT_BYTES` 512 MiB ·
`MAX_ATTRIBUTE_COLUMNS` 32 · `MAX_ATTRIBUTE_DISPLAY_CHARS` 512. A bundle declaring more than any of
these produces the `ceiling-exceeded` failure state and is refused — it does not load until the tab
dies.

**Picking is exact point-in-polygon containment on authoritative f64, in world space, with no pixel
tolerance.** Two consequences are declared rather than discovered:

- There is **no pick radius and no style dependence**. Rule 6's **2.27 px** discrimination figure
  does **not** apply here and must not be carried across: it measures a styled deck.gl point symbol
  at 1:500 on one GPU, which is a different mechanism. The 24-bit pick ceiling does not apply either
  — that is deck.gl's colour-encoded index, and nothing here encodes an index into a colour.
- The honest cost of zero tolerance: **a feature whose on-screen footprint is smaller than a pixel is
  effectively unhoverable.** Nothing snaps to the nearest feature, and a design that did would need
  its own decision.

**Overlap is resolved by draw order, declared:** partitions in manifest order, features in array
order within a partition, last drawn winning — which, since the publish path orders rows by ascending
identity, means the **highest id wins**. The pick search runs backwards through the identical order,
so what is picked is what is visible.

Keeping that true is why **each feature is filled on its own path** rather than batched by style
group. Batching is cheaper, and it breaks the claim twice over: even-odd over a merged path cancels
the intersection of two overlapping features, rendering a hole no feature has; and it makes painter's
order group-major, so a feature in a later style group covers an earlier one regardless of identity
while `pick` still returns the higher id. *(An earlier version did batch, and both defects were live.
The fixture's polygons tile a grid and never overlap, so the acceptance run would not have surfaced
either — it took a reviewer reading the two functions against each other.)* Fill and hit test both
apply **even-odd per feature**, so a point inside an interior ring reads as a hole in both,
regardless of winding, which the engine does not guarantee.

**Every frame is drawn from the authoritative coordinates** — no cached raster, no level of detail,
no tiles. Showing a scaled copy of the previous frame during a drag would be cheaper and would
create a window in which the pixels disagree with what a hover resolves against, which is a staleness
hazard invented for no reason on a static artifact. The consequence is that drawing cost scales with
visible features, and **no frame-time figure is claimed, measured or met**.

## Declared recovery policy (ADR-010 rule 7)

**`none` — fail visibly and terminate with a surfaced error.** No retry, no reconnect, no partial map
presented as complete. Global `error` and `unhandledrejection` handlers are unconditional and
installed before anything else runs. No heartbeat and no watchdog: rule 7 requires those only where
the declared policy is something other than `none`.

**One clause this artifact cannot fully satisfy, named rather than skipped.** Rule 7 asks that the
output be both *visible* and *persisted to a log that outlives the session*. A static bundle served
from a file share has no durable sink, and inventing one would mean a network request — which the
zero-external-request guarantee forbids and which `docs/09` would make a capability grant. So:
**visible on the page, and persisted in-page for the session only.** That is a declared limit of the
artifact, not an omission.

## This viewer is a third canvas, and it is provisional

ADR-003 names two canvases: a deck.gl **projected working canvas** and a MapLibre **web publishing
canvas**. A projected 2D canvas rendering a published bundle is neither. Its existence rests on the
ADR-003 amendment proposal drafted in this cut, which is **unapplied and awaits the human's
approval**. Until then the projected-canvas publishing path is provisional, and nothing here is
evidence for or against deck.gl — this is a 2D canvas, not deck.gl, and it measures nothing.

## Running

```bash
cd bundle-viewer
npm install
npm run verify        # typecheck, build, and the boundary + agreement + sha256 tests

# the Rust half
cargo test -p spatial-renderer
```

`dist/` is what the publish operation reads as its `ViewerAssets`. It is **not committed**: `cargo
test --workspace` must stay green on a clean checkout without Node, and a build artifact in the
repository would be machine provenance in a tree whose derived rule is "version lineage, not data".
Two builds of the same sources produce byte-identical output — `sourcemap: false`, because a
sourcemap embeds absolute paths, which would break that and put a filesystem path in a published
artifact.

## Scope of anything this module says

Windows 10 Pro 22H2 / WebView2 and Edge. Nothing here says anything about macOS or Linux — the same
limit `docs/07` places on ADR-003 — and nothing here is a performance measurement of any kind.
