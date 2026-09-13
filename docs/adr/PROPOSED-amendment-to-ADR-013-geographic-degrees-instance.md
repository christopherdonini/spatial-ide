# PROPOSED appended amendment to ADR-013 — the geographic-degrees space instance and the equirectangular display convention

*Drafted 2026-09-10 at Brief A's P0 by the architect agent on the custodian's brief, for the human's sight. Filed on `cut/admission-format-semantics`; nothing here is in force. One cite corrected by the custodian at filing: the equirectangular ruling is the human's 2026-09-08 evening ruling on DECISIONS-PENDING entry 59 (item 8), not "entry 8".*

**Status:** Proposed — appended to the ADR only on the human's word, at which point this file is
deleted in the same commit.
**Would amend:** ADR-013 (Accepted 2026-08-09, architect-blockable — `ADR-013:3`) as **Amendment 1**,
by appended text, never by rewriting.
**Basis:** Brief A's settled boundaries 8 and 10, and phase P2 (2026-09-09, binding).
**Related:** ADR-010 rule 1 (`ADR-010:17-29`) and rule 6 (`:70-74`); ADR-003 (accepted for
EPSG:2056 on Windows/WebView2); ADR-032 (Proposed, decision open — untouched here);
`docs/01:21`; `docs/05:24`, `:26`.

## Proposed text

> **Amendment 1 (date, appended) — a geographic-degrees CRS instance, and how it is displayed.**
>
> **1. No new compile-time class.** §1 already rules: *"Space **class** is a compile-time
> discrimination. Space **instance** — which CRS, which render frame, which framebuffer, which
> pipeline — is **runtime data** carried with the value and validated at every conversion. CRS
> identifiers are **not** baked into the type system."* (`ADR-013:27-29`.) A geographic CRS in
> degrees is therefore an **instance** of the existing **Authoritative project-CRS coordinate**
> class, not a fifth class. There is nothing for a compile-time class to discriminate: the shape is
> f64, and the boundary permission is row 1's — the two columns rule 1's table exists to fix.
>
> **2. The instance carries its declared unit.** The unit is **read from the CRS definition** and
> recorded as a fact of the instance — never inferred from the identifier string (`docs/05`: CRS
> identity is decided by comparing normalized definitions and never by name-string comparison), and
> never defaulted. A definition from which no unit can be established does not yield this instance.
>
> **3. §1's trust clause governs, unchanged.** *"Class answers what shape; instance and provenance
> answer what may be trusted."* A degrees instance carries row 1's ground-truth permission only on
> §1's own terms, and this amendment grants nothing further.
>
> **4. The display convention.** For a dataset in a geographic CRS this project states, in the
> human's binding wording: **"no coordinate value is transformed; the display convention is
> equirectangular"** **[the human's words, verbatim; ruled on 2026-09-08 (evening) on DECISIONS-PENDING
> entry 59 — the RULED block at `DECISIONS-PENDING.md:37`, "equirectangular wording binding for future
> geographic entries" — and carried in the quoted form at `RELEASE-0.1.md:1041`]**. It is a statement
> about the **display** only. `axis_normalization` stays `none-performed`, no reprojection occurs, and
> this amendment licenses none: `docs/05`'s definitional-equivalence machinery and the transform
> service (§2) stay owed and unbuilt.
>
> **5. The surfaces that must carry it, this cut.** (i) the **shell's own status** at open, and (ii)
> **`describe`**. Without (i), a geographic dataset would draw on the canvas with the statement made
> nowhere before publish, which is what `docs/01:21` forbids. **Publish is deferred**: a degrees
> dataset **refuses at preflight, by name**, until Brief B's reader change (Brief A boundary 8) —
> never a dead artifact. The bundle manifest and reference viewer surfaces are Brief B's to add with
> that change; this amendment does not pre-empt them.
>
> **6. Declared bounds must be unit-aware (ADR-010 rule 6).** A declared constant whose value was
> chosen in metres does not silently apply to degrees. `MIN_ANCHOR_SPAN = 1` —
> `frontends/shell/src/canvas/tileGrid.ts:78`, justified at `:73-77` as *"One authoritative-CRS unit
> (e.g. one metre for a projected CRS)"* — is a declared bound that **stops being true** under
> degrees, where one unit is a degree. Every such constant either takes a **declared, unit-aware
> value** read from the instance's unit, or it does not run. Rule 6's discipline is that the value is
> declared, not discovered; a metre-shaped constant reused under degrees is discovered.
>
> **7. No measurement readout in degrees.** `docs/05:24`: *"Measurements are units-aware (geodesic
> where appropriate); 'area in degrees²' is unrepresentable."* No metre-denominated distance, area,
> scalebar or coordinate readout is produced for a degrees dataset. A readout that cannot be produced
> units-aware is **absent or refused, never rendered in metres**.
>
> **8. No number is carried across.** ADR-003's and ADR-010 rule 3's evidence is EPSG:2056 on
> Windows/WebView2 (`ADR-010:11`, `:51`, `:103`). No precision, frame-time or rendering-quality
> figure attaches to a geographic instance, in either direction.

## The `MIN_ANCHOR_SPAN` question, answered against the boundaries

Two options exist: **(i)** a declared, unit-aware value, or **(ii)** a typed refusal for degrees.
**The brief's boundaries force (i).** Boundary 5 hands declared-constant values to the architect
("architect sets the value; recorded in the preregistration"), and P2 and P6 both require a degrees
dataset to **open and display** with its provenance and convention read off the screen — a refusal on
the display path would contradict the walkthrough rows the cut is verified by. Option (ii) is a new
behaviour outside every settled boundary. What is **not** optional either way is that it stop being
unit-blind: leaving a metre-chosen constant to act on degrees is a silent unit conversion
(`docs/01` principle 8) and an undeclared bound (ADR-010 rule 6). **Routed to the human only if they
prefer the refusal**, which would be theirs to rule, not the architect's to assume.

## What this changes / does not change

**Changes:** names a CRS instance and its declared unit; states the display convention and the two
surfaces that carry it this cut; makes unit-blind declared bounds a rule-6 violation.

**Does not change:** ADR-013 §1's four classes, §2's transform service (still unbuilt), §3-§7, the
Acceptance appendix, ADR-010 rule 1 or rule 3, ADR-003's accepted scope, ADR-032 (its decision
stays open and this amendment must not be read as taking candidate (B)).

## Accepted at

Brief A's **P6**, on the human's word only. Red line. P2 additionally carries an architect gate
(ADR-013 / ADR-010 rule 1) at review.

## Block-on-sight conditions (P1–P3 reviewers)

1. A fifth compile-time coordinate class, or a CRS identifier reaching the type system
   (`ADR-013:27-29`).
2. The equirectangular sentence paraphrased, shortened, or reworded — it is the human's, verbatim,
   and "no reprojection / plate carrée" phrasings are not it.
3. The statement missing from either required surface (shell status, `describe`).
4. Any publish path emitting a geographic bundle in this cut, or a preflight refusal that is not
   named.
5. Any metre-denominated readout, scalebar, distance or area under a degrees instance
   (`docs/05:24`; `docs/01:21`).
6. `MIN_ANCHOR_SPAN` (`tileGrid.ts:78`) — or any sibling metre-chosen constant — applied under
   degrees without a declared unit-aware value.
7. Any precision, frame-time or quality number attached to a geographic CRS (**A6**).
8. A unit inferred from a CRS identifier string rather than read from the definition.

## Open questions routed

**Architect:** the declared unit-aware value(s) for `MIN_ANCHOR_SPAN` and any sibling constant; the
name of the publish preflight refusal (its *existence* is boundary 8; note it is a fourth typed
refusal beyond boundary 9's three, which are open/describe-class — record the reading so A5/A3
reviewers do not read it as scope creep); the exact `describe` field the convention rides on.

**Human:** whether they want a typed refusal instead of a declared value at the degenerate-anchor
path (behaviour); whether the binding equirectangular wording's **home** is this amendment or an
appended ADR-003 note — the record so far names only that an ADR-003 note is "owed", and two homes
for one binding sentence is a decision, not an implementation detail.
