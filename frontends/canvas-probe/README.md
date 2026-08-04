# `frontends/canvas-probe` — the minimal canvas consumer

The consumer end of the first engine slice: connects to the data plane, decodes GeoArrow batches,
draws them to a 2D canvas, and supersedes one stream with another while both are running.

## What this is not

- **Not the renderer module.** `docs/02` scopes `renderer/` to GPU map rendering, labels and style
  compilation; `docs/06`'s pipeline is deck.gl + MapLibre. This has no style compilation, no label
  placement, no picking, no scene graph and no cache — it strokes polygons so a human can see that
  the stream works. **Add any of those and it is renderer work and must move.**
- **Not the desktop app**, and **it does not decide ADR-001's open React-versus-Svelte question.**
  Vanilla TypeScript here is a deliberate non-decision, not a vote; the spike carve-out that
  justified vanilla TS does not extend to a module directory, so this says so explicitly instead.
- **Not a benchmark.** Everything it records is in-situ, single-session and **hypothesis-forming**:
  not citable in ADR-012, which remains Proposed, and raw material for the reserved ADR-014.

## What binds it anyway

ADR-010's Consequences bind renderer, engine **and** protocol design, so these hold wherever this
code lives:

- **Rule 3 — `f32(coord − origin)`, never `f32(coord)`.** JavaScript numbers are f64, so the
  narrowing happens at the canvas boundary. The subtraction therefore happens **first, in f64**,
  against a declared render origin, and the canvas only ever sees origin-relative values. At
  EPSG:2056 magnitudes (~2.6 × 10⁶ m) narrowing an absolute coordinate destroys the sub-metre detail
  the whole slice exists to carry.
- **Rule 1 — the tag is checked, not assumed.** `geoarrow.ts` verifies frame, CRS, axis order and
  geometry encoding on **every** batch before anything is drawn, and refuses a batch that fails. The
  render origin is renderer-local state and crosses no boundary.
- **Rule 5 and H7 — a partial layer is labelled.** A cancelled or failed stream leaves a partial
  layer on the canvas, and the canvas says so in a banner. No partial view is presented as complete.
- **Rule 7 — global `error` and `unhandledrejection` handlers are unconditional**, visible on the
  page and persisted in `window.__probeLog`. Declared recovery policy: **`none` — fail visibly and
  terminate.** The M4 forensics are why: every liveness signal stayed healthy while an unhandled
  `TypeError` had silently killed the session, and only the global handler answered the question.

## The scenario

1. **S1 — solo stream.** The within-session baseline.
2. **S2 — two streams overlap.** A second stream opens while the first is still delivering; the
   moment it opens, the first is **superseded and cancelled**. Both are read to their terminals.

The supersede fires when the new stream *opens*, not when it has drawn something — that is what a
viewport change actually does, and it is the only trigger that reliably catches the old stream
**mid-flight**. An earlier version waited for the new stream's second batch and caught nothing: the
new stream's first batch did not arrive for ~2.1 s because this consumer's **single main thread** was
busy decoding and drawing the other stream. That starvation is itself a finding and is recorded in
the artifact rather than tuned away — any future concurrency measurement that does not separate the
consumer's main thread from the transport is measuring the consumer.

## Running

```bash
npm install
npm run build            # bundles into dist/, which `slice-host --assets` serves

# with the slice host running, open the URL it printed, or drive it headlessly:
node scripts/run-probe.mjs --url "http://127.0.0.1:PORT/#TOKEN" \
    --out ../../target/slice-evidence/canvas-probe.json
# add --headed for a visible window
```

The driver finds Edge in either the `Edge/Application` or the versioned `EdgeCore/<version>` layout,
newest first, and records the **exact user agent** in the artifact — bake-off README §21 Q9 records
"the exact browser build reaches no artifact" as an open defect, and guessing the path is how that
happens. The credential is passed in the URL fragment, which is never transmitted, and is **stripped
from the artifact before it is written**; the writer refuses if the scrub fails.

### Credential residuals this driver creates, stated rather than implied

The data plane writes the credential nowhere. **This driver does put it in two places it cannot
fully clean up**, and `docs/09` plus ADR-012's own threat-model precedent say to name them:

- **The browser's command line.** The URL — fragment included — is an argument to `msedge.exe` (and
  to `node`), readable by any process running as the same user for the lifetime of the run.
- **The browser profile.** Edge records visited URLs, fragment included, in the throwaway profile
  under the OS temp directory. The driver deletes that profile afterwards, but the deletion is
  best-effort: the browser may still hold a lock, and the failure is tolerated rather than fatal.

Both are acceptable for a **development probe on a loopback session token with a process lifetime**,
and neither is acceptable for a production credential path — where delivery is the control plane
(Tauri IPC, ADR-004) and the token comes from the OS keychain (`docs/09`). Nothing here should be
copied into that path.

A headless run is the default because it is the less intrusive one; the artifact says so, because the
compositor and GPU path differ from a windowed session and pixel timings from headless are indicative
only.

## What the artifact records

Per stream: batches, features, vertices, payload bytes, opened / first-batch / first-pixels /
last-pixels timings, terminal outcome, the envelope as received, reassembly copies, JSON frames seen,
and **how many batches Arrow could view directly out of the delivered bytes** rather than copying to
realign.

That last one is asked again here rather than inherited: the bake-off measured buffer sharing on
fixed-width columns and scoped its result to that shape, and this payload is variable-width GeoArrow.
It is reported as a count, never as a zero-copy claim (ADR-004: copies are measured and minimized,
not assumed absent).
