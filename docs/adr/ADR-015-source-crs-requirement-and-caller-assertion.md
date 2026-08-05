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
**Implemented by:** `engine/src/crs.rs`, `engine/src/geoparquet.rs`, `engine/src/envelope.rs`,
`engine/src/stream.rs` (§7), `engine/src/dataset.rs` (§8); exercised against real files by
`engine/tests/slice.rs`.

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
   >
   > **Precedence, added after architect review.** The safety argument stands but understates the
   > case. `docs/README.md` resolves conflicts **lower-number-wins**, so `docs/01` principle 8 (no
   > silent conversion) beats `docs/05`'s normalization clause on precedence alone. This is
   > therefore a *resolved conflict*, not an unjustified gap — the OPEN block below stays because
   > normalizing is still the more useful behaviour, not because refusing needs an excuse.
6. **No guessing, no default, no fallback, at any point.**

### 7. A viewport's CRS is a caller assertion about the query, never an equivalence judgement

**Context.** §1–§6 govern the **source**. A caller's *query* also names a CRS — `kernel`'s stream
parameters carry the identifier the viewport was authored against — and the engine must do something
with it. The first cut compared it against the dataset's identifier and admitted the query when the
two strings matched. **That is a name-string comparison deciding CRS agreement, which `docs/05`
forbids in as many words and which §4 refuses to make on the source path even when the two strings
are identical.** The engine was applying opposite rules to the same question depending on which door
the CRS arrived through.

**Decision.** The comparison stays, and is **named for what it is**:

1. A viewport CRS identifier is a **caller assertion about the query** — the caller's claim that the
   viewport was authored against this dataset's CRS. It is not, and may not be reported as, a
   finding that two CRS definitions are equivalent.
2. **A mismatch is refused** (`ViewportCrsMismatch`). This slice has no reprojection, so a viewport
   in another CRS cannot be honoured; `docs/05` makes mixing CRS without a declared transform an
   error.
3. **A definition-only dataset refuses any viewport CRS at all** (`ViewportCrsUnidentifiable`).
   Where the PROJJSON carries no authority and code, the engine's identifier is a placeholder shared
   by *every* such dataset; matching a caller's echo of it against itself would be a name comparison
   over a string that is not a name — the weakest possible form of the check §4 already rejects. A
   caller may still send a viewport with **no** CRS, which declares it to be in the dataset's own.
4. **The two refusals are separate error variants.** They were one, and its message spoke only of
   caller assertions, so a caller who asserted nothing was told about assertions it never made.

**What this does not do.** It does not decide that a matching identifier means the definitions
agree, and it licenses no later code to assume so. The moment reprojection exists, the
definitional-equivalence machinery `docs/05` describes is owed here and identifier matching is
retired, not promoted.

### 8. Stable feature identity is an admission requirement, and is recorded here

**Context.** The first cut also refuses any GeoParquet lacking a 64-bit column named `id`. Refusing
is right — ADR-010 rule 2 resolves picking through **stable feature ID**, and synthesizing a row
ordinal is the M3 hazard that rule exists to prevent, while `docs/11` requires stable per-feature
identity for editing and lineage. But it was written down nowhere, and it bounds which real files
the hero slice can open far more tightly than anything in `docs/07` does: most GeoParquet in the
world carries no such column.

**Decision.** The requirement is an **admission policy of the same class as §1–§6** and is stated
with them: a source is admitted only if it carries a per-feature identity the engine can use, and
this slice recognises exactly one form of it. A source without one is refused with a typed error at
open — in front of an operator, per the catalog's open-at-startup rule — rather than being given
synthesized ordinals.

**Consequences.** `docs/11` says ID assignment is "per dataset and recorded in metadata"; this
policy is that record for this slice. **The mapping from an arbitrary source key to the engine's
identity column is not decided** — see the OPEN block below.

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

> **OPEN:** *Source-key to identity-column mapping* (§8). This slice recognises exactly one form of
> stable identity: a 64-bit column named `id`. Real sources carry theirs under other names, other
> widths, and sometimes as a composite. Whether a connector may *map* one to the engine's identity
> column, and what makes such a mapping stable enough for `docs/11`'s editing and lineage
> requirements, is undecided — and it is what stands between this engine and most GeoParquet in the
> world.

> **OPEN:** *Axis-order normalization.* This ADR refuses a non-x-first source rather than normalizing
> it. `docs/05` requires normalization to (E, N) at ingestion **and** that the normalization
> performed be recorded. Refusing satisfies the record clause vacuously; performing the
> normalization is the more useful behaviour and needs its own decision about where it happens and
> how it is recorded.
