# ADR-013 — Typed Coordinate Spaces and Provenance

**Status:** Accepted — 2026-08-09, with the granularity ruling and three clarifications recorded in the **Acceptance appendix** below, and the ADR-010 rule-2 amendment its §5 requires applied the same day. Architect-blockable from acceptance. **ADR-010 rule 1 remains the binding text** for coordinate spaces; the table below refines its naming and may not be read as replacing it.
**Resolves:** the `> OPEN:` block in **ADR-010** (*Typed coordinate provenance and candidate-to-authoritative promotion*), which names a new ADR as its expected vehicle.
**Deadline, inherited from that block:** the question **must be resolved** — by this ADR or a successor — **before the editing plugin's digitizing path is built** (ADR-002, 1.0; `07`).
**Related:** ADR-010 rules 1–4 (Accepted — refined, never amended), ADR-005 (grades — **left intact**), ADR-007 (delta store), ADR-006 (operation classes), ADR-002 (editing scope), `docs/01` principles 3 and 8, `docs/05`, `docs/10`, `docs/11`.
**Not related:** ADR-011 is **not** cited as settled design anywhere in this ADR.

## Context

ADR-010 rule 1 discriminates three **spatial** coordinate spaces. Authoritative-versus-derived is an
**orthogonal** axis: a cursor-derived f64 and a surveyed f64 in the same CRS are, today, the same
type. Rule 2's promotion and snap clauses therefore rest on developer discipline rather than on the
type system — which is exactly what `docs/01`'s "CRS is a type" exists to prevent, applied one level
down.

This ADR proposes the typed model that rule 2 depends on. It is written to *refine* ADR-010, never to
amend it. Rows 1 and 2 keep their names, precision columns and boundary-crossing permissions
verbatim; row 3 is **split** into two strictly finer rows that keep its precision vocabulary
("device/CSS px") and its tagging requirement. §5 is the one place this ADR proposes a change to
accepted rule text, and it is labelled as such there rather than presented as a refinement.

## Decision

### 1. Coordinate space classes — four, discriminated at compile time

Space **class** is a compile-time discrimination. Space **instance** — which CRS, which render
frame, which framebuffer, which pipeline — is **runtime data carried with the value and validated at
every conversion**. CRS identifiers are **not** baked into the type system.

| Class | ADR-010 rule 1 origin | Carries (runtime) | Precision |
|---|---|---|---|
| **Authoritative project-CRS coordinate** | row 1, name unchanged | CRS identity | f64 |
| **Renderer-local coordinate** | row 2, name unchanged | render-frame identity **and** that frame's origin | f64 before narrowing, f32 on the GPU |
| **Screen-CSS coordinate** | row 3, split | framebuffer identity and dimensions | CSS px |
| **Screen-device coordinate** | row 3, split | framebuffer identity and dimensions | device px |

**What changed from the harvested proposal, and why.** The external source proposed six classes,
adding `view` and `analysis`. Those are **not** adopted as classes, on the ground
that **there is nothing for a compile-time class to discriminate**: neither carries a distinct
precision, and neither carries a distinct boundary-crossing permission, which are the two columns
rule 1's table exists to fix. A display-reprojected f64 in a view CRS and an analysis-CRS f64 are the
*same shape* as an authoritative project-CRS coordinate, differing by **CRS instance** and by the
**provenance attribute** in §3 — both runtime data. They become instance and
provenance values instead.

The **screen** split into CSS and device *is* adopted: it is strictly finer than rule 1 row 3, which
already says "device/CSS px", and it preserves the row's boundary permission exactly. Both halves
still carry framebuffer identity **and dimensions**; a `devicePixelRatio` is not a substitute for
either.

**Class membership does not confer rule 1 row 1's permission.** Row 1's boundary column grants
exactly one thing — *"this is the only coordinate a caller outside the renderer may treat as ground
truth"*. Because view-CRS and analysis-CRS values are folded into this class as CRS **instances**,
that permission is explicitly **not** inherited by class alone: **a value in this class whose CRS
instance is not the authoritative project CRS, or whose provenance (§3) is not `authoritative`, does
not carry row 1's ground-truth permission.** Class answers *what shape*; instance and provenance
answer *what may be trusted*.

**Renderer-local is plural.** Frame identity is runtime instance data and N simultaneous frames are
permitted. A bare "the render offset" is the untagged-frame error ADR-010 rule 1 records at
3 116 272 m.

### 2. One transform service, bounded by the module map

All CRS↔CRS conversions go through a **single transform service in `engine/`** (`docs/02`: the CRS
engine is the data-engine module's). **Render-frame and screen conversions stay renderer-internal**
and do not route across a module boundary — ADR-010 rule 1 says a renderer-local value "may not cross
a boundary at all" untagged, which settles it on typing alone; no cost claim is made or needed.

**Display reprojection is a CRS↔CRS conversion and so belongs to the service**, but it is performed
**once per view-transform change**, not per frame — `docs/05`'s visible map-view transform is a
declared operation, so it does not put a module boundary on the per-frame canvas path.

The harvested phrasing "all conversions go through one central transform service" is adopted **only**
in that bounded form.

### 3. Provenance as a typed attribute, orthogonal to CRS

```
provenance := authoritative | derived(method, declared_accuracy) | asserted(by, at)
```

Provenance is orthogonal to CRS: it answers *where did this value's authority come from*, not *what
space is it in*.

**Carried as a per-row column, never per coordinate.** Provenance travels as a per-row Arrow
**column** in the batch itself — it is data-plane **payload**, not an envelope tag, and the two are
deliberately not conflated. What it borrows from ADR-010 rule 1 is only the negative half of that
rule's reasoning: per-*value* tagging is structurally incompatible with a copy-minimized binary
buffer (ADR-004), and the same objection applies here. It is data-plane payload; it is never MCP bulk (`docs/02`, ADR-004).

**Granularity: per-feature, with a weakest-vertex composition rule.**

> A feature containing **any** derived vertex is `derived`, at the **worst** declared accuracy among
> its vertices.

This mirrors ADR-005's existing weakest-input rule and fits the ADR-007 delta store's row model.

> **OPEN, for the approving human:** per-feature **cannot express** the case rule 2 exists to
> prevent — one cursor-derived vertex inside an otherwise-surveyed polygon. The weakest-vertex rule
> makes that case *safe* (the whole feature degrades) but not *precise* (the surveyed vertices lose
> their standing). The alternative is **per-vertex** provenance, which is more faithful but must be
> reconciled against ADR-010 rule 1's envelope-tagging clause and costs a parallel array per
> geometry column in the delta store and on the wire. **Per-feature is proposed; per-vertex is the
> named alternative.** This choice should be made explicitly at acceptance, not inherited.

> **RESOLVED at acceptance (2026-08-09): per-feature with the weakest-vertex rule**, as proposed.
> The human's grounds: it fits Arrow's row model and the delta store; it conservatively prevents
> mixed geometry from claiming survey accuracy; it avoids a parallel provenance array per
> coordinate; and it avoids prematurely designing **stable vertex identity** and compaction
> behavior, which per-vertex provenance would presuppose. Per-vertex remains a **named future
> refinement**, contingent on that identity design existing first. Additionally ruled: **a degraded
> feature never automatically regains authoritative status — the only path back is the explicit,
> logged promotion** (rule 2).

**Snapping inherits, it does not derive.** A vertex snapped to an existing feature takes **the snap
target's provenance**, because ADR-010 rule 2 already says the committed value *is* the target's
authoritative f64 — it is a lookup, not a measurement. This is the commonest case in ADR-002 1.0's
minimal snapping and would otherwise be mis-graded as `derived`.

**Promotion is explicit** (ADR-010 rule 2, unchanged): a derived candidate becoming authoritative is
a logged operation, never an implicit side effect of a commit.

### 4. The provenance invariant

Every **persisted, exported, compared, reported, or snapped** spatial result identifies its
authoritative coordinate space **and** its transformation pipeline. **Display-only view coordinates
are never silently promoted to authoritative values.**

### 5. Declared accuracy is a second, parallel attribute — ADR-005 is left intact

This section **proposes** a resolution of the ADR-005 clause in ADR-010 rule 2 and in its OPEN
block. It does not enact one — see the contradiction notice immediately below.

> **This contradicts ADR-010 rule 2 as written, and says so rather than narrowing it quietly.**
> ADR-010:45 is **rule text**, not open text: *"Its declared accuracy travels with it and constrains
> the reproducibility grade the containing workflow may claim (ADR-005, principle 3)."* Only the
> dependent provenance *model* is deferred to the OPEN block; the constraint itself reads as binding.
> The reading proposed here says the opposite — that declared accuracy bounds an **accuracy** claim
> and leaves the reproducibility grade alone. **Until ADR-013 is accepted, rule 2's clause stands as
> written.** Accepting ADR-013 therefore requires an **appended ADR-010 amendment** revising that
> clause, drafted at acceptance and approved as its own decision. §7 refuses to enlarge an accepted
> rule by side channel; §5 must equally refuse to narrow one.
>
> **The amendment was applied at acceptance** — ADR-010, appended amendment of 2026-08-09.

**The two axes are orthogonal, and conflating them would corrupt both.** ADR-005's ladder answers
*"will replaying this produce the same result?"* A hand-digitized point is **perfectly replayable** —
the digitized coordinate itself *is* the pinned input, and content-addressed, the workflow is honestly
**Exact**-grade. Demoting it for being cursor-derived would make the grade mean two unrelated things
at once. What ADR-010's "constrains" reaches for is an **accuracy** claim, not a reproducibility one: a
workflow built on coarse cursor-derived inputs can be perfectly reproducible while never being
entitled to claim survey-grade accuracy. **No number is quoted for that coarseness here** — ADR-010's
cursor-unprojection figures are scale- and hardware-bound (M3, 1:500, UHD 630), and quoting one bare
would be the scope-stripping ADR-010:51 forbids.

Therefore:

- **Declared accuracy** is a second attribute with **its own composition rule, mirroring ADR-005's**:
  a derived output's declared accuracy is bounded by the **weakest declared accuracy among its
  spatial inputs**, plus the transform pipeline's declared accuracy where one applies.
- The two attributes are **displayed side by side and never combined into one number**.
- ADR-010's "constrains the reproducibility grade the containing workflow may claim" is **proposed to
  be read** as *"bounds the accuracy claim, displayed alongside the reproducibility grade"* — subject
  to the appended ADR-010 amendment named above.
- **No ADR-005 amendment is needed or implied.** ADR-005's ladder is untouched, and adding a parallel
  attribute changes nothing in it.

### 6. Point transforms only, and the bit-identity invariant

- Edits computed in a **non-native view** are inverse-transformed **as points**, through the
  **recorded pipeline** (`docs/05`, pipeline pinning).
- **Displacement vectors are never transformed between projections.** A delta is not a coordinate;
  transforming one is meaningful only in the degenerate case and silently wrong otherwise.
- **Untouched coordinate values remain bit-identical through any edit.**
  - **Scope:** the invariant holds **within one CRS and one recorded pipeline**. Analytical
    reprojection and an honoured pipeline/grid change legitimately alter every coordinate.
  - **Carve-out:** where a storage provider re-serializes whole geometries, the invariant binds
    **extracted coordinate values, not blob bytes**. A GeoPackage/SQLite row rewrite on commit, and
    compaction into immutable GeoParquet (ADR-007), legitimately change envelope and header bytes
    with no coordinate changed; without this carve-out the invariant would be false on its first
    commit.
  - Any **text** serialization uses round-trip float formatting or declares its precision
    (`docs/01`, plain text everywhere). This binds project files and exports, not the binary data path.
- **Operation class:** an edit is a **workspace mutation** (ADR-006), so this invariant is assertable
  against the ADR-007 delta store's transaction log rather than by inspection.

### 7. The f32 surfaces ADR-010 rule 3 already binds — recorded, not extended

Rule 3 prohibits an **operation**: `f32(coord − origin)`, never `f32(coord) − f32(origin)`, and never
`f32(coord)` at all for an absolute projected magnitude. It enumerates no surfaces, so **every** f32
destination is already covered by construction.

This ADR therefore **records, non-normatively, the surfaces on which rule 3's existing prohibition
binds** — it does **not** extend rule 3, and could not: enlarging what an Accepted, architect-blockable
rule binds would be amending an immutable document by side channel.

> No absolute world coordinate enters any **f32 vertex attribute, uniform, matrix translation, shader
> intermediate, or label/icon anchor**. Anchors go through the same offset-relative path as geometry.

**The test that keeps this honest:** if ADR-013 is rejected, rule 3 must still bind label and icon
anchors, unchanged. Under "records what rule 3 already covers" it does. Under "extends rule 3's
reach" it would not — which is why that wording is not used.

**No number is asserted here.** Rule 3's evidence is spike M2, geometry vertices, at 1:500, on UHD 630
only. Label and icon anchors were **never measured**, and `docs/08`'s label class carries no
anchor-precision measurement.

## Consequences

- A **provenance column** in the ADR-007 delta store, written **inside the same transaction** as the
  edit it describes (ADR-006 workspace mutation), never as a renderer-side write. Its shape (one
  column or three: class / method / declared accuracy), its nullability and default for existing rows,
  its survival through compaction into GeoParquet, and its queryability across the overlay are
  **explicitly deferred past acceptance** to the open item below, whose own deadline — before the
  delta store gains the column — governs. *(Corrected at acceptance: the earlier "decided at
  acceptance" wording contradicted that deadline.)*
- A **schema field on SKP data-plane envelopes** (`docs/10`, ADR-004) — a field, not a new message
  type, and not a control-plane concept.
- A **metadata field** under `docs/11`'s stable-ID policy, including a declared default for datasets
  imported without provenance.
- **`docs/08` correctness cases** for provenance preservation across edit → commit → compact.
- **No performance claim** until the column's cost is measured at `docs/08`'s dataset classes.

## What this ADR does not decide

- **Provenance granularity** is proposed as per-feature; per-vertex is recorded as the named
  alternative (§3).
- **The delta-store column's exact shape**, defaults for pre-existing rows, and compaction survival.
- **The asserted-CRS path.** `asserted(by, at)` appears in the provenance type because a
  user-supplied CRS is not a file fact, but the *admission policy* for undeclared or mismatched source
  CRS belongs with the engine's first cut and is not decided here.
- **Anything ADR-011 covers.** Not cited, not adopted.
- **Any measured number**, on any surface named above.

## Open items

> **OPEN:** *Provenance granularity.* Per-feature with a weakest-vertex rule is proposed; per-vertex
> is the alternative. Must be settled at acceptance, before the ADR-002 1.0 digitizing path.

> **OPEN:** *Delta-store column shape.* One column or three; defaults for existing rows; survival
> through compaction; queryability across the ADR-007 overlay. Must be settled before the delta store
> gains the column.

## Acceptance appendix (2026-08-09, the human's rulings)

1. **Granularity:** per-feature with the weakest-vertex rule, per §3's RESOLVED note. Per-vertex is
   a named future refinement contingent on a stable-vertex-identity design; it is never introduced
   as a side effect of a provenance column. No automatic regrade — explicit, logged promotion is
   the only path from `derived` back to `authoritative`.
2. **The envelope/§3 reconciliation:** the envelope declares the provenance **column's schema and
   encoding** — a batch-layout fact, which is what envelopes are for — while the provenance
   **values** are per-row Arrow payload. §3's "never an envelope tag" governs values; the
   Consequences' "schema field on SKP data-plane envelopes" governs the layout declaration. Both
   stand once distinguished; neither survives read alone.
3. **Column shape:** explicitly deferred (Consequences corrected accordingly); the open item's own
   deadline governs.
4. **Implementation naming:** the authoritative-class type is **not** implemented under a name that
   grants trust — not `AuthoritativeProjectCrsCoordinate`. A neutral name (`CrsCoordinate` or
   equivalent), with **CRS instance and provenance determining trust at runtime, never the type
   name** — §1's own rule ("class answers *what shape*; instance and provenance answer *what may be
   trusted*") applied to the code that will implement it.
