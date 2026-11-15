# Pan-anchor preregistration — DECISIONS-PENDING entry 95

**Filed 2026-09-15** from the architect consult (Custodian architect-first rule), against the
2026-09-14/15 sitting's Row 6 (c). This is the pre-commitment record; the fix commit may not land
until the cause is reproduced and measured and the tolerance below is frozen (the entry-86
discipline: "95 only after the cause is shown", the analogue of `renderer/bundle-viewer/ZOOM-ANCHOR-PREREGISTRATION.md`'s "86 only if it reproduces").

## The finding (the human, verbatim, Row 6 (c))

> "when i pan i'd like for the pointer to be still in the exactly same position from where i pressed
> to start the pan, now it goes slightly sideways, but everything else is perfect."

During a drag-pan on the shell working canvas the world point grabbed under the pointer at mousedown
should stay pinned under the pointer through the whole drag; it drifts slightly sideways. The pan
**re-pick** (entry 75 (1)) passed — this is a distinct anchoring-precision defect.

## Established facts (architect-verified against `src/canvas/WorkingCanvas.tsx`)

- deck.gl `OrthographicView({ id:"working", flipY:false })`, `controller: true`, **uncontrolled**
  (`initialViewState` only; the load-bearing why is the file header :86-101). deck owns `this.viewState`.
- **But deck does NOT own the transform uninterrupted during a drag.** `onViewStateChange`
  (:1886-1927) runs `frame.maybeRecenter(worldX, worldY)` (`offsetFrame.ts` :131-158) each settled
  tick and, past a budget-derived threshold, calls `deckRef.setProps({ initialViewState:{ target,
  zoom } })` + `render()` (:1907-1914) — snapping deck's viewState into a NEW origin frame mid-gesture.
  The recenter threshold is large at ordinary zooms (`offsetFrame.ts` :49-56), so it likely fires
  only on LARGE pans.
- deck is built with **no `useDevicePixels`** (→ default `true`) and **no explicit `width`/`height`**
  (→ deck auto-sizes from the canvas).
- **Live doc contradiction on this defect's axis:** `viewportBbox.ts:16` says "one world unit is
  2^zoom **device** pixels"; `WorkingCanvas.tsx:531-537` (`pixelsPerWorldUnitAtZoom`) says "2^zoom
  **CSS** pixels ... not device." Both feed `clientWidth` (CSS). The bbox math is self-consistent
  with the CSS reading; the `viewportBbox.ts:16` comment is the odd one out (see §5.2).

## §1 — Cause before fix: reproduce & MEASURE headlessly, BEFORE any fix

Two complementary instruments (they discriminate the cause), on the quiet machine via the shell E2E
surface (`e2e/lib.mjs` `attachOrLaunch`/`waitForSettle`, `e2e-test-surface.ts` `capturePixels`/
`e2eSetViewState`, `regression.mjs` `doPan` :242-247 and `bufferPointToCss` :278-289 — inherit
`bufferPointToCss`'s element-measured buffer/box ratio, do NOT re-derive DPR):

- **Instrument A — trace-derived world coordinate (localizes the cause; ADR-010 rule-1 clean).**
  Compute the world point under a fixed pixel from the shell's OWN authoritative model —
  `world = (target + origin) + (pixel − center)/2^zoom`, `center = (clientWidth/2, clientHeight/2)`,
  Y per `flipY:false` — reading `target`/`origin`/`zoom` off the always-on `traceViewState` line
  (:1896) plus `clientWidth`/`clientHeight`. Grab pixel p → W₀; drag N CSS px (8 steps); after settle
  read the new trace → W₁ under the SAME pixel p; residual = W₁ − W₀. **Never read deck's
  `info.coordinate`/`deck.unproject`** — that is the untagged renderer-local value ADR-010 rule 1
  forbids crossing a boundary, and it would mask a deck-vs-shell mismatch. A-drift ⇒ the shell's
  target/origin bookkeeping (candidate 3).
- **Instrument B — painted-pixel truth (the real discriminator; what the human sees).** Seat a known
  feature at a known world point (`e2eSetViewState`); find its drawing-buffer pixel via
  `capturePixels` before the drag; grab that pixel (`bufferPointToCss`); drag N CSS px; after settle
  re-find the feature's buffer pixel. Painted displacement must equal drag delta (N CSS px × the
  element-measured buffer ratio); residual_B = painted − expected. Independent of any internal math.
  A clean + B drift ⇒ a deck-logical-viewport-vs-element / DPR space mismatch (candidate 1/2).
- **Four-width diagnostic (DEV-only, throwaway, delete/gate before landing):** log side by side
  `deck.getViewports()[0].width/height` (deck's logical viewport — a screen dimension, rule-1-legal
  to read), `canvas.clientWidth/Height`, `gl.drawingBufferWidth/Height`, `window.devicePixelRatio`.
  A divergence among {deck logical} vs {client} vs {buffer/DPR} is the smoking gun for candidate 1/2.
- **Signature:** a real space mismatch grows with drag distance AND distance-from-centre
  (proportional), and a there-and-back drag does NOT return to zero if cumulative — distinguish from
  bounded, non-growing integer-pixel quantization noise.
- **Conditions (pre-committed):** two window sizes (small + large), BOTH drag directions, a
  there-and-back leg. Two DPRs **if reachable** — attempt CDP `Emulation.setDeviceMetricsOverride
  {deviceScaleFactor}`; if WebView2 ignores it (likely; it is not a Playwright-managed chromium),
  record that as a disclosed limitation and measure at the host's actual scaling — **never fabricate
  a second DPR.** The human's box is Win10 19045, likely 100% → DPR 1.0; drift reproducing at DPR 1.0
  REFUTES the fractional-DPR sub-hypothesis and points at candidate 1 or 3.

**Pre-fix readings (which instrument fired, the growth signature, the four widths) are recorded in a
commit BEFORE the fix commit.**

## §2 — Candidate causes, ranked

1. **deck logical viewport width/height ≠ the CSS client box** (entry-86 family, in deck's terms) —
   pointer-event space and paint space disagree → proportional sideways drift. Read the Deck ctor
   (:1874-1878), `.working-canvas{width:100%;height:100%}` (`styles.css` :195-199), and the A9'
   scrollbar-narrowing history (`styles.css` :29-48) that already bit this canvas. Confirm with the
   four-width diagnostic.
2. **`useDevicePixels`/fractional-DPR rounding** — at DPR 1.25/1.5, buffer = round(client·DPR); if
   deck derives logical width as buffer/DPR it is no longer exactly clientWidth. Refuted if drift
   persists at DPR 1.0.
3. **Mid-drag origin recenter snapping deck's viewState** — `maybeRecenter`→`setProps`+`render`
   (:1907-1914) re-frames the camera while the controller's pan-start is still in the OLD frame.
   Confirm by correlating drift with a `recenter` event / LARGE pans; refute for small pans with no
   recenter.
4. **Controller inertia/transition** (`controller:true`, no options → defaults). A persistent
   residual after settle argues against pure inertia; rule out by checking the residual survives settle.
5. **`flipY:false` axis** — Y not "sideways"; low prior, rule out by whether the residual is X-only.

Do not prejudge; the fix follows the measured cause.

## §3 — The fix's shape (constraints; cause not prejudged)

- Candidate 1/2 → make deck's logical viewport, the drawing buffer and the element's CSS box share
  ONE declared pixel space (pin `useDevicePixels` and/or feed deck an explicit measured width/height,
  or correct whatever makes deck's logical width diverge from `clientWidth`). **Stay in deck's
  uncontrolled model** (no `viewState`, no controlled mode — preserve :86-101). One pixel space,
  conversion in exactly ONE place; measure the ratio from the element, never assume DPR.
- Candidate 3 → keep the origin recenter OUT of the live drag (defer to drag-end / gesture idle) or
  re-express the controller's pan-start into the new frame on recenter — a recenter must not
  desynchronize the in-flight gesture. Still uncontrolled.
- **Never:** flip to controlled mode; add a second device→world path; let any cursor-derived
  coordinate become authoritative, visible, or stored (ADR-010 rules 1, 2). Resolve the
  `viewportBbox.ts:16` vs `WorkingCanvas.tsx:531-537` contradiction as part of the fix (§5.2).

## §4 — The E2E that pins the invariant

- Lives at `frontends/shell/e2e/pan-anchor.mjs` — a standalone operator-run instrument, **NOT** wired
  into `verify`/CI (CI lacks the fixture/WebView2/real display; same convention and reason as
  entry-86's `test:e2e`). Reuse `lib.mjs` attach + `waitForSettle` + `doPan` + `bufferPointToCss`.
- Asserts: the world point grabbed under a pixel at mousedown is under that same pixel after settle
  (Instrument A within tolerance) AND the painted feature's displacement equals the drag delta
  (Instrument B within tolerance), at both window sizes, both directions, returning to ~0 on
  there-and-back. Named cases per configuration so the mutation check fails one BY NAME.
- A pure-unit companion only if the fix creates a pure seam (as entry 86's `resizeStore`/`zoomAt`
  did); a real `Deck` needs WebGL jsdom lacks, so the E2E is the primary evidence.

## §5 — Pre-commitments (FROZEN before the fix commit; later changes are appended deviations)

1. **Tolerance — basis and value.** Declared in **drawing-buffer px** (the discriminator's scale-free
   native unit), grounded in the discriminator's own resolution + ADR-010 rule 2's integer-pixel
   quantization floor (M3 measured a 1.352 px dead-centre residual at 1:500 from quantization alone;
   the tolerance may NOT claim precision below that floor — no sub-pixel anchoring claim). The NUMBER
   is derived from the pre-fix noise floor against a KNOWN-CORRECT reference (a temporarily-patched,
   uncommitted correct build, or a configuration where the bug is provably absent) — **NEVER from the
   post-fix build** (entry 86, Amendment 1: measuring the floor off the post-fix build would measure
   the very bug the test exists to catch). **VALUE: `4.0` drawing-buffer px.** Basis (frozen
   2026-09-15, this execution): the empirical noise floor on a KNOWN-CORRECT reference build — the
   temporarily-patched, uncommitted fix (candidate 3 deferred; §Measured results) — measured
   `1.000` buffer px worst case across both drag directions, both axes, and a there-and-back leg,
   with Instrument A itself at `≤0.333` buffer px. That `1.000` is bounded below by ADR-010 rule 2's
   integer-pixel quantization floor of `1.352` buffer px (rule 2, quoted: "M3 measured the dead-centre
   residual at 0.1789 m (1.352 px) … entirely attributable to integer-pixel click quantization"), so
   the floor, not the noise, is the binding lower bound. `4.0` sits above both, asserts no sub-pixel
   anchoring (rule 6), and the measured cause fails it by ~1100 buffer px (single crossing) to ~18160
   buffer px (repeated crossing) pre-fix — the separation is not marginal. Once set, frozen.
2. **Authoritative pixel space for the OrthographicView zoom.** Declared: **CSS pixels** — the shell's
   authoritative model (`pixelsPerWorldUnitAtZoom` :531-537 and the `viewportBbox.ts` math) already
   reads `clientWidth` (CSS); the fix aligns deck's logical viewport to this, and the
   `viewportBbox.ts:16` "device pixels" comment is corrected to "CSS pixels" as part of the fix.
   **Caveat:** if the measured cause proves the bbox math itself wrong (device is in fact
   authoritative), that reversal is recorded here as an appended deviation before the fix commit,
   not a silent edit.
3. **Mutation check.** Reverting the fix at its single site makes the named large-window E2E case
   fail BY NAME (recorded), as entry 86 did.
4. **Block-on-sight (any occurrence stops the piece for the human):** any perf/quality number
   anywhere (comment, commit, test name — no "smoother/sharper/faster", no p50/p95 without a docs/08
   measurement); a second device→world path beside the shell's authoritative math; a cursor-derived
   coordinate becoming visible or stored; a flip to deck controlled mode; a DPR value assumed rather
   than measured from the element; an invented §-cite (quote ADR-010/docs mechanically, label
   paraphrases — MEMORY: worker citation fabrication).

## §6 — ADR-010 bearing

- **Rule 1** (renderer-local coords never authoritative): measurement and fix compute world
  coordinates through the shell's authoritative model (target+origin), never deck's untagged
  `info.coordinate`/`unproject`; reading deck's viewport width/height (a screen dimension) is fine.
- **Rule 2** (unprojection scoped to navigation, never authoritative): pan IS an explicitly permitted
  navigation unprojection; the cursor-derived value stays scoped to navigation, never overwrites a
  vertex or becomes visible/stored. Rule 2's accuracy floor bounds the tolerance (§5.1).
- **Rule 5** (no stale served): the mid-drag `render()` after a recenter must not paint behind the
  committed camera (watch if candidate 3 is the cause).
- **Rule 6** (declared, not discovered; sub-pixel picking refused): the tolerance is DECLARED before
  the fix; no sub-pixel anchoring is asserted.
- **Architect-blockable: YES** (ADR-010 Consequences bullet 1). **ADR-011 does NOT apply and must NOT
  be cited** (no tiled buffers / GPU cache here; CLAUDE.md: it binds nothing, not architect-blockable).
- **ADR-006 class:** pan is ephemeral navigation view-state — correctly not undoable; unchanged.
- **No new ADR** (like entry 86 — touches no format, no ADR, no control/data plane; ADR-010 governs).
  If §5.2 proves the OrthographicView pixel space is genuinely undecided project-wide, the vehicle is
  a one-line declared-convention note appended here, not an ADR amendment (ADR-010 is immutable).

## §7 — Constitution

- **Principle 7 / docs/08:** `onViewStateChange` fires continuously during a drag — any per-move work
  the fix adds stays cheap; never blocks the canvas. **No perf claim** (docs/01) — the pixel-space
  statement is a grid correspondence, not a quality claim (entry 86's closing note).
- **Scope (docs/07, ADR-003 gate concluded):** in-scope — renderer/shell against ADR-010; the hero
  slice's own interact canvas. Scope risk = a controller/controlled-mode rewrite; keep it minimal and
  uncontrolled.
- **Module boundary (docs/02, docs/10):** entirely within `frontends/shell` canvas — no control/data
  plane, no SKP/MCP, no kernel/engine/protocol; byte-identical wire.

## Sequencing

Worker executes under this record: reproduce → measure (pre-fix readings committed) → freeze §5.1 →
fix → `e2e/pan-anchor.mjs` → mutation check. Then reviewer + architect gates. The **felt re-verdict
is the human's, at a sitting** — held for tonight; nothing here claims it.

## Measured results (entry 95 execution, 2026-09-15)

Headless via `e2e/pan-anchor.mjs` + throwaway diagnostics (since removed), on the quiet Win10 19045
host, DPR 1.0, against `target/fixtures/manual-walkthrough/100k-happy-path.parquet`. Instrument A is
the trace-derived grab-point invariant; the synthetic-drag `dx/steps` deficit (deck's controller
registers its pan-start on the first `pointermove`, not on pointerdown — measured residual ratio ==
1/steps to 5 decimals across steps=1,2,4,8,16,32, zero excess) is a harness property, not the app,
and is subtracted.

**Four-width diagnostic (candidate 1/2, refuted).** deck logical viewport, deck width/height,
`clientWidth/Height`, `gl.drawingBufferWidth/Height` and the canvas attribute size ALL coincided at
`1280×200` (and again after resize, e.g. `1400×277`), buffer/CSS ratio `1.000`, `devicePixelRatio`
`1`. A CDP `Emulation.setDeviceMetricsOverride{deviceScaleFactor:1.25/1.5}` moved
`window.devicePixelRatio` to 1.25/1.5 but left the GL drawing-buffer ratio at `1.000` — WebView2 does
not rescale the backing store from that override, so a genuine fractional-DPR backing store was NOT
achievable (disclosed limitation). Instrument A excess stayed `0.000` even with the spoofed DPR.
Candidate 1 (viewport≠box) and candidate 2 (fractional-DPR rounding) are refuted at the host's real
scaling.

**Instrument B (paint vs event, refuted split).** With the finite dataset seated fully in frame, the
painted non-background centroid shift equalled deck's own target shift within ~1 buffer px (e.g.
painted −243.0 vs deck −243.0), both carrying only the `dx/steps` deficit. Paint == event; no
candidate-1/2 paint-vs-event split.

**Growth signature.** In normal near-data use (all zooms z=−4…+2, both directions, off-centre grabs),
Instrument A excess drift == `0.000` and the there-and-back nets `~0` — the app anchors correctly.
The drift does NOT grow with distance-from-centre and is NOT cumulative. Candidate 4 (inertia) is
refuted (residual survives settle == the exact `dx/steps` artifact, no more); candidate 5 (flipY) is
refuted (an x-drag yields an x-only residual).

**The cause — candidate 3 (mid-drag origin recenter).** Drift appears if and only if the mid-drag
`maybeRecenter → setProps({initialViewState}) + render()` fires during the gesture. At a zoomed-out
camera (z=−7) whose pan crosses the recenter threshold, the grab-point invariant broke by ~18160
buffer px (steps=40, ~15 origin jumps) — a runaway: each recenter re-frames deck's uncontrolled view
state while deck's controller pan-start is still expressed in the OLD frame, so the next tick
re-crosses. A single controlled crossing (steps=12, dx=1200) broke it by ~1100 buffer px. Repeated
crossings could close the WebView2 page (observed once at z=−7/−8, dx=4000). No recenter fires in
normal near-data panning (threshold is 131072 m, capped, at ordinary zooms), which is why the defect
is invisible there and only a large / zoomed-out pan reaches it.

**Fix.** Single site, `WorkingCanvas.tsx` `onViewStateChange`: gate the recenter on
`!isDragging` (deck's own `interactionState.isDragging`; measured 10 `true` ticks then one `false`
tick at gesture end), deferring the origin advance to the settled non-dragging tick. The origin still
advances (offset-relative f32 precision preserved, ADR-010 rule 3 / offsetFrame.ts) but with no live
pan-start to desynchronize. Stays in deck's uncontrolled model. `viewportBbox.ts:16` corrected
"device"→"CSS" (§5.2), measurement-backed.

**pan-anchor.mjs (post-fix).** 16/16 PASS at both window sizes: `normal-A` `±0.50` buffer px,
`paint-vs-event` `≤~1.1` buffer px, `there-and-back-net` `1.00`, `recenter-crossing-A` `~0.00`.
**Mutation check:** reverting the gate at its single site makes `large: recenter-crossing-A dx=1200`
(and its three siblings) FAIL BY NAME at `−1100` buffer px; the normal/paint/there-and-back cases
still pass (12/16). Restored → 16/16.

**Not claimed.** The felt re-verdict is the human's, at a sitting. The reproduced candidate-3 drift is
large, not "slight"; whether it is the same thing the human felt is theirs to judge. A residual the
human may still perceive — deck's own pan-start-on-first-`pointermove` startup lag — is a deck/mjolnir
controller property, not the app defect this piece fixes, and is out of this piece's scope.
