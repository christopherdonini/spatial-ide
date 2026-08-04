# ADR-015 — Source CRS Requirement and Caller Assertion

**Status:** Proposed — **binds nothing until accepted.** Not architect-blockable. The engine's first
cut **implements** this policy today because an engine that opens a file must do *something* at
open, and refusal is the only option that cannot be silently wrong; if this ADR is rejected, that
implementation changes.
**Resolves:** the question **ADR-013** explicitly hands over — *"The asserted-CRS path. `asserted(by,
at)` appears in the provenance type because a user-supplied CRS is not a file fact, but the*
***admission policy*** *for undeclared or mismatched source CRS belongs with the engine's first cut
and is not decided here."*
**Related:** `docs/01` principle 8 (no silent conversion) and its derived rule **"CRS is a type"**;
`docs/05` (CRS engine, definitional equivalence, data doctor); ADR-010 rule 1 (tag on the envelope);
ADR-005 (grades — untouched); ADR-013 (Proposed — **not** cited as authority anywhere below);
`docs/11`.
**Implemented by:** `engine/src/crs.rs`, `engine/src/geoparquet.rs`, `engine/src/envelope.rs`;
exercised against real files by `engine/tests/slice.rs`.

## Context

`docs/05` makes CRS "part of the dataset's type", flowing through every operation, and makes mixing
CRS without a declared transform an **error, not a warning**. It does not say what happens when a
source carries no CRS at all, or when a caller believes a different one than the file states.

That case is not exotic. The **GeoParquet specification itself** says an *absent* `crs` key means
OGC:CRS84 and an explicit `"crs": null` means "no CRS". Applying the spec's default would have this
engine supply a CRS the file never stated — the silent conversion `docs/01` principle 8 exists to
prevent, arriving through a standards document rather than through a bug.

The first `engine/` cut performs **no reprojection**: it has no PROJ dependency and runs no
definitional-equivalence check. That constraint is what makes the policy below both necessary and
simple — an engine that cannot compare two CRS definitions must not pretend to.

## Decision

| File declares a CRS | Caller asserts one | Outcome |
|---|---|---|
| yes | no | **admitted**, `crs_source = file` |
| yes | yes | **refused** — `CrsAssertionConflict` |
| no | yes | **admitted**, `crs_source = caller_asserted`, with who and when |
| no | no | **refused** — `CrsUndeclared` |

1. **A CRS read from the file is a file fact**, and the file's own definition travels verbatim with
   the data — the PROJJSON, not a name string (`docs/05`: two datasets labelled "CH1903+ / LV95" may
   carry different definitions).
2. **A file that declares no CRS is refused**, and GeoParquet's OGC:CRS84 default is **not applied**.
   An explicit `"crs": null` is refused the same way. The refusal is typed and says why.
3. **A caller may assert a CRS only for a file that declares none.** The assertion is recorded on the
   batch envelope as an assertion — `crs_source = caller_asserted`, with the asserting party and the
   time — so a consumer can tell a claim from a fact without asking the engine.
4. **An assertion over a file that declares a CRS is refused, without comparing the two.** Deciding
   that a declared and an asserted CRS "agree" is a definitional-equivalence judgement, and `docs/05`
   forbids deciding it by name comparison. An engine that cannot make that judgement correctly
   refuses instead of approximating it. **Refusal holds even when the two strings are identical** —
   that is not an oversight, it is the same rule applied honestly.
5. **Axis order is established from the definition, never assumed.** A definition with no coordinate
   system is refused (`AxisOrderUnestablished`). A source whose established order is not x-first is
   refused (`AxisOrderUnsupported`) rather than reinterpreted, because this slice normalizes nothing;
   the envelope records `axis_normalization = none-performed`, so the record says what was done
   rather than what was assumed (`docs/05`).

   > **This is a deviation from `docs/05`, and is named as one rather than left to an OPEN block.**
   > `docs/05` says: *"Axis-order normalization happens first. Ingestion normalizes to the declared
   > internal **(E, N)** convention *before* the equivalence decision, and the normalization
   > performed is recorded."* This engine **refuses** a non-x-first source instead of normalizing it.
   > The deviation is deliberate and in the safe direction — refusing cannot silently mislabel
   > coordinates, whereas an unimplemented normalization could — but it is a gap against an
   > *Evolves*-stability constitution doc, not a satisfied requirement, and this ADR is where a
   > reader should find that said. Closing it is the second OPEN block below.
6. **No guessing, no default, no fallback, at any point.**

## Consequences

- **Some real files cannot be opened without an explicit human act.** Deliberate. The alternative is
  a map drawn in a CRS nobody chose.
- **Reassignment is out of scope and belongs to the data doctor** (`docs/05`: detect → propose →
  preview → apply, with confidence scores), which is Alpha work (`docs/07`). This ADR is its floor:
  the data doctor may *propose* a CRS with a preview; it may never *silently supply* one.
- **This is a dataset-level envelope fact, not per-row coordinate provenance.** The two are
  deliberately not conflated: ADR-013 §3 makes provenance a per-row Arrow **column**, and this is a
  schema-level tag on the batch envelope (ADR-010 rule 1's carrier). The field is therefore named
  `crs_source`, not `provenance`, and `asserted(by, at)`'s type shape is not reproduced. **If ADR-013
  is accepted, field naming is reconciled against it** — that reconciliation is ADR-013's to make.
- **No ADR-005 amendment is needed or implied.** No reproducibility grade is claimed by the slice
  that implements this; nothing is persisted.
- The refusal reaches a consumer as a typed terminal carrying its own words, not as a dropped
  connection — asserted end-to-end in `kernel/tests/end_to_end.rs`.

## What this ADR does not decide

- **Whether a caller assertion may ever override a declared CRS**, and under what preview or approval
  gate. Deferred to the data doctor's own decision.
- **Non-GeoParquet sources.** FlatGeobuf, GeoPackage, COG, Zarr and COPC (`docs/05`) each state CRS
  differently; the *principle* here is source-independent, but the reading of each format's metadata
  is not decided.
- **CRS identity by definitional equivalence** (`docs/05`). This slice never needs it because it
  never transforms. The moment reprojection exists, that machinery is owed and this ADR does not
  supply it.
- **Anything about macOS or Linux**, and anything about performance.

## Open

> **OPEN:** *Sources whose CRS lives outside the file* — a sidecar `.prj`, a database column, a
> service's declared CRS. Whether those count as "the file declares" or as an assertion is undecided,
> and the answer changes what a connector may admit.

> **OPEN:** *Axis-order normalization.* This ADR refuses a non-x-first source rather than normalizing
> it. `docs/05` requires normalization to (E, N) at ingestion **and** that the normalization
> performed be recorded. Refusing satisfies the record clause vacuously; performing the
> normalization is the more useful behaviour and needs its own decision about where it happens and
> how it is recorded.
