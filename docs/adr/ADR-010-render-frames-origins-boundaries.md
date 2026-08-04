# ADR-010 — Render Frames, Origins, and Boundary Rules

**Status:** Accepted — 2026-08-03. Drafted at ADR-003 spike close from measured findings; revised the same day to separate measured invariants from unmeasured implementation (see Reconciliation); accepted after human review of the revision.
**Sources:** spike M2/M3/M4 measured results and diagnostic notes (`spikes/adr-003-crs-rendering/README.md`)
**Related:** ADR-003 (Resolution), ADR-004 (+ amendments), ADR-006, ADR-007; **ADR-011** (Proposed) carries the tiled-buffer implementation this ADR no longer contains.

## Context

The ADR-003 spike surfaced a family of silent-failure modes at renderer boundaries: untagged local-frame values structurally indistinguishable from CRS coordinates (a 3 116 272 m frame error wearing a coordinate's clothes, M3); precision destroyed by f32 narrowing performed *before* offset subtraction (M2's naive-absolute control, 0.9494 px against a 0.5 px budget **at 1:500**); a 24-bit picking ceiling that wraps silently (M3, read from deck.gl 9.3.7 source); and an uncaught exception that presented as indistinguishable from a hardware freeze for an entire investigation cycle (M4 forensics). None are deck.gl-specific; all bind any renderer this project builds on.

**Scope of the evidence** — carried from the spike's own Scope-limits section rather than left to be inferred: every measurement cited below is a **Windows 10 Pro 22H2 / WebView2 / ANGLE-D3D11** result. M4's figures are dual-GPU (Intel UHD 630 + NVIDIA GTX 1650); **M2's and M3's are single-GPU (UHD 630 only)** — the discrete card arrived after those milestones. Every frame-time and vsync-floor number assumes **one display's 60 Hz refresh**. Every dataset is **synthetic and structurally regular** (P1 uniform-random points; P2 a regular polygon grid whose cells no feature crosses by construction). macOS/WKWebView and Linux/WebKitGTK are entirely unrepresented (07). The rules below are stated as invariants because their *mechanisms* are platform-independent — a type error, an ordering error, an encoding ceiling, an unhandled exception — not because the numbers have been reproduced elsewhere. Where a rule leans on a magnitude rather than a mechanism, the platform caveat travels with it.

**Scope discipline.** The first draft of this ADR mixed those measured invariants with an explicitly *unmeasured* implementation direction (per-tile static buffers with per-tile origins, partial GPU range updates, asynchronous cache consolidation). The spike itself records that direction as "design direction only, not implemented", with an unmet gate. Binding both in one architect-blockable document would let the unmeasured half inherit the measured half's authority. This ADR therefore states **only invariants that follow from measured evidence or from already-accepted decisions**; the implementation direction is now **ADR-011 — Tiled Render Batches and GPU Cache Lifecycle (Proposed)**, which is *not* architect-blockable and must clear its own acceptance gates.

## Rules

### 1. Coordinate spaces are discriminated types, and no untagged coordinate crosses a boundary

Three distinct spaces exist and are never interchangeable:

| Space | Carries | Precision | May cross a module/API boundary |
|---|---|---|---|
| **Authoritative project-CRS coordinate** | CRS identity (e.g. `EPSG:2056`) | f64 | Yes — this is the only coordinate a caller outside the renderer may treat as ground truth |
| **Renderer-local coordinate** | render-frame identity **and** that frame's origin | f64 before narrowing, f32 on the GPU | Only when tagged with frame identity + origin; never as a bare pair |
| **Screen coordinate** | framebuffer identity and dimensions | device/CSS px | Only when tagged; framebuffer dimensions are part of its meaning |

A value that does not carry its space's tag does not leave the module that produced it. deck.gl's bare `info.coordinate` is a renderer-local value with no tag, so it is **renderer-internal** and may not cross a boundary at all (M3 diagnostic note 1: the sampled raw value `[4.894791666666664, −3.042708333333324]` against a real easting of ~2.6×10⁶ m — the error *is the origin*, a fixed 3 116 272 m offset that no averaging or zooming touches). This is docs/01's "CRS is a type" applied one level below the CRS: a frame is a type too.

**Where the tag lives (bulk data).** The tag rides on the **batch, stream, or schema envelope** — GeoArrow/Arrow schema metadata, tile-stream headers, buffer descriptors; transfer representations are already typed per resource (02, 10, 11) — never on each individual coordinate. Per-value tagging is structurally incompatible with the data plane docs/10 and ADR-004 define: a GPU-ready attribute buffer is by construction a bare numeric array, and interleaving a tag per value would make the payload something other than the copy-minimized binary buffer that definition requires. The rule binds **boundary-crossing values, handles, and the envelopes that describe bulk buffers**; a bare float array satisfies this rule through its schema, and only through its schema. A bulk buffer whose envelope does not name its frame is untagged and is in violation.

### 2. Authoritative coordinates are looked up; cursor unprojection is scoped and never authoritative

**Picking an existing feature** resolves **GPU ordinal → stable feature ID → authoritative host-side f64 coordinate**. The GPU ordinal equals feature identity only by accident of buffer order, and any cull, chunk, sort or LOD ends that accident silently, returning a wrong-but-plausible coordinate with nothing raised (M3: validated against a deliberately reversed buffer where sending the ordinal would have returned a feature 206.6–221.0 km away; 70/70 correct id, 70/70 bit-exact f64 round trip). Scope of that 70/70, as the spike states it rather than as the headline reads: the datasets are **synthetic 5- and 10-feature sets, not P1/P2 scale**, and reversing a 5-element buffer leaves the middle element a fixed point, so **4 of 5** shuffled probes actually discriminate. It is a correctness assertion about the indirection, not an accuracy measurement at scale. Stable per-feature identity is already required by 11 for editing and lineage; this rule consumes it, it does not invent it.

**Cursor unprojection is permitted** for:

- **navigation** — pan/zoom/view-state, where the cursor *is* the input;
- **previews and hover feedback** — transient, non-committed display;
- **creating new candidate geometry** — a digitized point that does not yet exist in the workspace.

Its result is tagged as a **derived candidate coordinate** and is bound by three limits:

- It may **never** reconstruct, refresh, or overwrite the coordinate of an **existing** authoritative vertex. Unprojection cannot reach centimetres at map scales: at 1:500, 1 cm is 0.076 px, and M3 measured the dead-centre residual at 0.1789 m (1.352 px), ~18× the 1 cm budget, entirely attributable to integer-pixel click quantization — a hypothetical perfect sub-pixel cursor would still leave ~0.066 m, 6.6× the budget. Implementation quality cannot close this.
- **Snap resolution discards the cursor value.** When a candidate snaps to an existing vertex, segment, or grid node (ADR-002's 1.0 minimal snapping), the committed value is the snap target's authoritative f64 obtained **by lookup**, not the unprojected cursor position. "Creating a new vertex *at* an existing one" is the same hazard as overwriting one, and must not pass this rule by wording.
- **Promotion is explicit.** A derived candidate becoming an authoritative coordinate is an explicit, logged operation (docs/01 principle 8), never an implicit side effect of a commit. Its declared accuracy travels with it and constrains the reproducibility grade the containing workflow may claim (ADR-005, principle 3). See the OPEN block below — the typed provenance model this depends on is not yet decided.

Any user-visible readout of a derived coordinate is visibly marked as cursor-derived, and does not enter the action console (03) untagged.

### 3. Offset subtraction happens in f64, before narrowing to f32

`f32(coord − origin)`, never `f32(coord) − f32(origin)` and never `f32(coord)` at all for absolute projected magnitudes. This is the spike's central measured result, **at 1:500** (0.1322917 m/px — the error and the budget are both functions of scale, and the spike itself once carried an M2-scale budget into an M4-scale row by mistake, so scale is quoted with every px figure here): at EPSG:2056 magnitudes (~2.6×10⁶ m) the naive-absolute control measured **0.9494 px** worst case against a 0.5 px budget — and, enumerated exhaustively outside the harness, **56.96 %** of every centimetre fraction in a 1 m window at the far corner exceeds budget — while all three offset-relative policies passed: `offset-fixed` worst **0.0813 px**, `offset-dynamic` at zero drift 0.0358 px, and `offset-dynamic-max-drift` — the worst state *that* policy permits before it rebuilds, and the figure the milestone rests on — **0.0446 px**, ~11× inside budget (M2, UHD 630 only).

The counter-intuitive corroboration matters for review: the naive control's *wobble* was fine (0.0366 px, indistinguishable from all three offset policies, which spanned 0.0352–0.0360 px) while its *static* error was ~0.95 px. Precision was destroyed at the moment of narrowing and nothing downstream recovers it. A design that looks stable in motion is not thereby correct.

### 4. Editing separates static presentation from dynamic feedback, and the commit stays atomic and synchronous

- **Drag feedback uses a small dynamic overlay.** The static buffer holding everything not currently being edited is not rebuilt, not patched, and not re-uploaded mid-interaction; the actively-edited geometry is a small separate layer drawn last. Measured: the **graded visible-subset** drag scenario — ~15–20 polygons / ~1 500–2 000 vertices, ≈0.02 % of P2 — held the display's vsync floor on both GPU profiles (16.7 ms p50 on a 60 Hz display; see docs/08's vsync-interval budget, amended from this same finding), and pick-to-grab against the overlay was 1.7 ms, GPU-independent (M4). The scenario qualifier is load-bearing: in the same milestone the ungraded `fullP2Visible` case — the identical drag with the whole 100 000-polygon static buffer live underneath — measured **137.0–139.0 ms p50 on the UHD 630**, ~8× over budget, while the GTX 1650 stayed at the vsync floor. The split is what makes a drag cheap; it is not what makes a large resident buffer cheap, and workload shaping remains the binding lever (ADR-003 Resolution).
- **The authoritative workspace commit remains atomic and synchronous** per ADR-006 (workspace mutations are transactional) and ADR-007 (the owning store runs the transaction). A workspace mutation is never eventually consistent, and no renderer-side scheduling convenience may make it so.

What this split does *not* cover is equally measured and stated here so no design claims otherwise: whole-buffer origin rebase (830 ms–1.1 s chunked at P2 scale) and whole-buffer commit re-upload (80–330 ms) are O(dataset) regardless of edit size and **miss budget by one to two orders of magnitude** (M4). Fixing that is ADR-011's subject, not this ADR's claim.

### 5. Renderer caches are derived state

Standalone, and binding on every renderer cache — including the single global static buffer the spike itself used, not only the tiled scheme ADR-011 proposes:

- A renderer cache is **derived** from committed authoritative state. It is never the system of record and **never redefines transaction semantics**.
- **Negative form, which is what actually blocks a bad design in review:** no renderer-side cache work participates in, extends, gates, or delays an ADR-007 transaction. A commit does not wait on a cache; a cache failure does not fail or roll back a commit.
- **Staleness is signalled, never silently served.** Any window in which the renderer can return a pick result, a coordinate, or a visibly rendered geometry from state it knows to be behind the committed state is a **named hazard requiring a visible signal** — not silent eventual consistency (docs/01 principle 8). This is an invariant of *having a cache*, so it holds whether or not ADR-011 is ever accepted; ADR-011 supplies the mechanism (versioning, cross-tile detection), not the obligation.

### 6. Capacity ceilings are declared, not discovered

deck.gl's pick index is 24-bit: 16 777 215 features per layer, and past it `encodePickingColor`/`decodePickingColor` truncate to a **wrong-but-plausible index with nothing raised** (M3 diagnostic note 2, read from deck.gl 9.3.7 source). The spike's own P1 and P2 datasets sit at ~60 % of that ceiling. A layer design **states its ceiling and its sharding strategy before approaching it** — multiple picking passes with reassembled index ranges, or coarser polygon-level rather than vertex-level picking. "We are comfortably under it today" is not a strategy.

Related, and part of the same declaration: picking resolution is a **style-dependent** property. Id discrimination was reliable only from **2.27 px** separation (0.30 m at 1:500), corroborated by a *fit* — not a measurement — of an effective picked radius of 1.49–1.57 px against a styled 1 px radius, with last-drawn-fragment winning where footprints overlap (M3). Two limits travel with that number: it is quoted in pixels because pixels are the scale-free property of the pick machinery, but **scale invariance was never verified at a second zoom**, so 2.27 px is a measurement at 1:500 rather than a demonstrated invariant; and because the figure moves with *style*, a heavier symbol raises it with no change to the data or the CRS. Any "pick the nearest feature" behaviour is built on top of that, never assumed from it.

### 7. Failure and recovery are observable — a stated contract, not hygiene

The M4 forensics are the evidence and they are specific: every liveness signal available (Rust heartbeat, JS heartbeat, CDP `Runtime.evaluate` in 3 ms, a fresh `requestAnimationFrame` in 0.5 ms) stayed healthy while the harness was, in fact, permanently dead — an unhandled `TypeError: Do not know how to serialize a BigInt` had terminated an async function with zero visible symptom. Liveness probes answer "is anything still scheduled?"; none of them answers "did an exception fire?".

The contract:

- **Async entry points surface their errors.** An async operation may not terminate silently; a rejected promise on any entry-point chain is reported, not dropped.
- **Global `error` and `unhandledrejection` handlers are unconditional** in any long-lived rendering session, and their output is both **visible** (to the user or operator) and **persisted** (to a log that outlives the session). This clause is not conditioned on anything — it is the one instrument that would have answered the question the whole investigation was asking.
- **Every long-lived session or worker declares a recovery policy.** `none — fail visibly and terminate with a surfaced error` is a valid declaration; *not declaring* is not (same discipline as rule 6's "declared, not discovered" and ADR-006's declared reversibility class). Heartbeat and watchdog mechanisms are **required wherever the declared policy is anything other than `none`** — a policy that says "restart the worker" needs the instrument that detects when to.
- **Long-running operations report progress, and their silence is detectable.** This is docs/01 principle 7 verbatim ("cancellable, streaming, and progress-reporting") and docs/08's <100 ms cancellation-acknowledged budget. In the M4 investigation a BEGIN/END checkpoint scheme — "the last BEGIN with no matching END names the culprit" — narrowed the failure to a *phase*, which is genuinely useful and is the property this clause requires; it did **not** identify the cause, and on its own it supported two successive wrong hypotheses — `pickDeck` reuse, falsified by the investigation's own control experiment, and then WebGL-context churn, which was written up as a verdict and later retracted. Only the global exception handler above answered the actual question, on the very next run. Progress observability localizes; it does not diagnose. Both clauses are needed, and neither substitutes for the other.

An application error must never present as a hardware hang.

## Evidence basis

Each rule's standing, so a reviewer can see what is measured and what is derived from an accepted decision rather than from a number:

| Rule | Basis | Status of the evidence | Hardware scope |
|---|---|---|---|
| 1 — discriminated spaces | M3 diagnostic note 1 (3 116 272 m untagged frame error); docs/01 CRS-is-a-type; typed transfer representations (02, 11) | Measured + constitutional | UHD 630 only |
| 2 — lookup, scoped unprojection | M3 (70/70 bit-exact via id indirection, 4-of-5 discriminating probes, 5/10-feature synthetic sets; 0.1789 m unprojection residual, ~0.066 m floor) | Measured; the *promotion/provenance* half is constitutional, and incomplete — see OPEN | UHD 630 only |
| 3 — f64 subtract before f32 narrow | M2 (0.9494 px control vs 0.0446 px offset-dynamic-max-drift and 0.0813 px offset-fixed, 0.5 px budget @1:500) | Measured — four origin policies through one harness, plus exhaustive enumeration outside it | UHD 630 only |
| 4 — static/dynamic editing split | M4 (vsync floor held on both GPUs for the graded visible subset; overlay pick 1.7 ms; fullP2Visible 137–139 ms on UHD 630) + ADR-006/ADR-007 | Measured + accepted-ADR consequence | UHD 630 + GTX 1650 |
| 5 — caches are derived state | ADR-006/ADR-007 consequence; hazard form stated in the spike's own M4 architecture note | Constitutional, not a perf claim | n/a |
| 6 — declared ceilings | M3 diagnostic notes 2–3 | Three distinct standings: 24-bit ceiling **read from deck.gl 9.3.7 source**; 2.27 px discrimination **measured** (one zoom only); 1.49–1.57 px effective radius **fitted**, corroboration not measurement | UHD 630 only |
| 7 — observable failure/recovery | M4 freeze forensics (root-caused) | A root cause, not a benchmark — and the mechanism (an unhandled synchronous exception) is platform-independent | Reproduced on both GPUs |

Rules 1–7 contain **no unmeasured performance or precision claim**. Everything that did is in ADR-011. What they do contain is measured evidence with a stated platform ceiling — see the Context scope paragraph; a rule is proposed on the strength of its mechanism, and its numbers are quoted with the hardware that produced them.

## Consequences

- These rules bind renderer, engine, and protocol module design (02, 06, 10) and are **architect-blockable in review** from now, per CLAUDE.md, even while this ADR is Proposed.
- Rule 1 constrains the SKP surface (04, 10): any coordinate-bearing message or batch envelope names its space.
- Rules 2, 4 and 5 constrain the editing plugin (ADR-002) and the local mutable store's transaction boundary (ADR-007) from the renderer side only — no accepted ADR's decision changes.
- Rule 6 constrains layer design and, transitively, the docs/08 benchmark matrix's dataset classes.
- Nothing here commits the project to a tiled renderer. If ADR-011 is rejected, rules 1–7 stand unchanged.

> **OPEN:** *Typed coordinate provenance and candidate-to-authoritative promotion.* Rule 1 discriminates three **spatial** spaces, but authoritative-vs-derived is an **orthogonal** axis: a cursor-derived f64 and a surveyed f64 in the same CRS are, today, the same type. Rule 2's promotion and snap clauses therefore rest on discipline rather than on the type system — exactly what "CRS is a type" exists to prevent. What is undecided: whether provenance becomes a typed attribute alongside CRS (`authoritative` | `derived(method, declared accuracy)`), recorded per feature in metadata under 11's stable-ID policy, constraining the reproducibility grade the containing workflow may claim (ADR-005), and adding a provenance column to the ADR-007 delta store. **Must be resolved before the editing plugin's digitizing path is built (ADR-002, 1.0; 07)** — a new ADR is the expected vehicle. Raised by the architect review of this revision.
>
> **Appended 2026-08-04 — vehicle assigned, not a rewrite of the above.** **ADR-013 — Typed
> Coordinate Spaces and Provenance (Proposed)** is the ADR this block calls for. It proposes the
> typed provenance attribute, its recording granularity, and the ADR-007 delta-store column. On the
> ADR-005 clause in this block and in rule 2's promotion clause, ADR-013 **proposes** reading
> "constrains the reproducibility grade" as **bounds the accuracy claim, displayed alongside the
> reproducibility grade** — declared accuracy becoming a second, parallel attribute with its own
> weakest-input composition rule, leaving ADR-005's ladder intact and unamended. **That reading
> contradicts rule 2's clause as written, so it is a proposal and not a resolution: rule 2 stands as
> written, and accepting ADR-013 will require an appended amendment to this ADR revising that
> clause, approved as its own decision.** This note assigns a vehicle and records the proposal; the
> OPEN block's text above is unchanged and the block stays open until ADR-013 is accepted.

## Reconciliation — old rule numbers to new locations

The ADR-003 spike README is an archived deliverable and is not edited. It cites this ADR's *original* rule numbers in **five** places — README lines 274, 304, 305, 307 and 308 — and the mapping is recorded here so those citations resolve rather than silently drift.

*Sentence-numbering note:* the original rules opened with a bolded lead clause, and the README's two citations of rule 3 count it differently — §1 treats the lead as a title (so "second sentence" is the f64-narrowing clause) while §4 treats it as sentence one (so "first sentence" is the per-tile-buffers clause). That ambiguity is the README's and cannot be edited away; both destinations below are unambiguous on substance.

| Spike citation | Original ADR-010 rule | Now |
|---|---|---|
| README:304, findings §1 — "codified as ADR-010 rule 3's second sentence" | rule 3, f64-subtract-before-f32-narrow clause | **ADR-010 rule 3**, in full |
| README:305, findings §2 — "codified as ADR-010 rules 1–2" | rules 1–2 (untagged frames; look up, don't reconstruct) | **ADR-010 rules 1–2**, with rule 2's unprojection permission newly scoped (snap-lookup + explicit promotion) and rule 1's tag-on-envelope clause added |
| README:307, findings §4 — "now ADR-010 rule 3's first sentence and rule 4" | rule 3's per-tile-buffers clause + rule 4 (overlay split, partial GPU range updates, async consolidation) | **ADR-011**, *except* the static/dynamic overlay split and the atomic-commit requirement, which are measured and stay as **ADR-010 rule 4**. Only the unmeasured half moved. |
| README:308, findings §5 — "ADR-010 rule 6 makes global error handling, heartbeat, and watchdog mandatory" | rule 6 | **ADR-010 rule 7**, reworded: global error/unhandledrejection stay unconditional; heartbeat/watchdog now attach to a **declared recovery policy** rather than being mandated as blanket hygiene, and a progress-observability clause is added |
| README:274, M4 architecture note — "folding this direction into its rule 3" | rule 3's per-tile-buffers clause + rule 4's partial-update/consolidation half | **ADR-011** — and the spike's own gate for it ("provisional until re-measured at P2 scale on both GPUs") is carried into ADR-011's acceptance gates, in substance |

The original rule 5 (declared capacity ceilings) is now rule 6; the original rule 4's editing-boundary content is split between **rule 4** (static/dynamic split, atomic commit — measured) and **ADR-011** (partial range updates, async consolidation — unmeasured), with **rule 5** carrying the cache-is-derived-state invariant that belongs to any cache, tiled or not.
