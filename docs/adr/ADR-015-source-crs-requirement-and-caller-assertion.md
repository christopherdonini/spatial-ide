# ADR-015 — Source CRS Requirement and Caller Assertion

**Status:** Accepted — 2026-08-05, after the stable-identity content (§8) was split into ADR-016 and
the axis-order conflict wording was resolved, per the human's stated condition. Architect-blockable
from acceptance. The engine's first cut implemented this policy ahead of acceptance because an
engine that opens a file must do *something* at open, and refusal is the only option that cannot be
silently wrong.
**Resolves:** the question **ADR-013** explicitly hands over — *"The asserted-CRS path. `asserted(by,
at)` appears in the provenance type because a user-supplied CRS is not a file fact, but the*
***admission policy*** *for undeclared or mismatched source CRS belongs with the engine's first cut
and is not decided here."*
**Related:** `docs/01` principle 8 (no silent conversion) and its derived rule **"CRS is a type"**;
`docs/05` (CRS engine, definitional equivalence, data doctor); ADR-010 rule 1 (tag on the envelope);
ADR-005 (grades — untouched); ADR-013 (Proposed — **not** cited as authority anywhere below);
`docs/11`.
**Implemented by:** `engine/src/crs.rs`, `engine/src/geoparquet.rs`, `engine/src/envelope.rs`,
`engine/src/stream.rs` (§7); exercised against real files by `engine/tests/slice.rs`.

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

   > **This departs from `docs/05`'s letter, and the conflict resolves in favour of refusing.**
   > `docs/05` says: *"Axis-order normalization happens first. Ingestion normalizes to the declared
   > internal **(E, N)** convention *before* the equivalence decision, and the normalization
   > performed is recorded."* This engine **refuses** a non-x-first source instead of normalizing it.
   >
   > That is a genuine conflict between two constitution documents, and `docs/README.md` resolves
   > conflicts **lower-number-wins**: `docs/01` principle 8 (no silent conversion) governs, and
   > `docs/05`'s normalization clause yields to it. Refusing is therefore the **resolved** behaviour,
   > not a gap or an unmet requirement — an unimplemented normalization could silently mislabel
   > coordinates, and refusing cannot.
   >
   > What remains open is **not** whether refusing is permitted. It is whether normalizing *later* —
   > which is the more useful behaviour once it can be done correctly and recorded — should replace
   > it, and where that would happen. That question, and only that question, is the OPEN block below.
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

> **Feature identity moved out, 2026-08-05.** This ADR carried a §8 on stable feature identity as an
> admission requirement, plus an OPEN block on source-key mapping. Both are now
> **ADR-016 — Stable Feature Identity Admission and Source-Key Mapping (Proposed)**, unchanged in
> policy. They travelled together only because both are decided at open; CRS admission and identity
> admission are different subjects, and accepting one must not silently accept the other.

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

> **OPEN:** *Axis-order normalization — the normalize-later question only.* Whether refusing a
> non-x-first source is *permitted* is settled in §5: the `docs/05` conflict resolves lower-number-
> wins in favour of `docs/01` principle 8. What is undecided is whether normalizing should replace
> refusing once it can be done correctly, and where that would happen and how it would be recorded.

## Amendment 1 — format-governed inputs, and provenance as a recorded fact (2026-09-23, appended — Accepted)


**1. §5 sentence 1 carries two facts, not one.** The **declared** axis order is established from
the CRS definition, never assumed. The **data's** axis order is established from the source
format's own specification where that specification states one, and from the definition otherwise.
Where the two differ, **both are recorded**, with the rule and the specification version that
established the data order, and neither is inferred from the other. **The definition's own axis
order is retained as a recorded fact and never discarded** — it is what a later reprojection or
export needs, and a slice that discards it has destroyed a file fact to save a field.

**2. Sentence 3 narrows.** `AxisOrderUnsupported` refuses sources for which **no format rule
establishes the data order**. Sentence 2 (`AxisOrderUnestablished` — a definition with no
coordinate system) and sentence 4 (`axis_normalization = none-performed`) are **unchanged**:
nothing is normalized, and the record still says what was done rather than what was assumed. The
`docs/05` conflict block quoted in §5 is unchanged — refusing remains the resolved behaviour
wherever it still applies, not a gap.

**3. §2's second sentence narrows, and this is a reversal stated plainly rather than smuggled.**
§2 reads *"GeoParquet's OGC:CRS84 default is not applied."* Under this amendment an **absent**
`crs` key is admitted under the format's own published rule and recorded as `crs:format-default`.
An explicit `"crs": null` is **unchanged**: unknown, refused, assertion required. The distinction
is the whole of the narrowing — absent means the format has already spoken; explicit null means
the file has said "I do not know", and no rule may answer for it.

**4. §6 stands, and this amendment is not an exception to it.** *"No guessing, no default, no
fallback"* forbids an **engine-invented** default. A format's own published rule, applied only to
inputs that format governs, quoted verbatim and pinned by URL, retrieval date and page hash, is a
read fact and is recorded as one. **A format rule that is not pinned in the tree may not be
applied** — the pinning is the difference between reading a rule and remembering one.

**5. The provenance classes are recorded facts, never judgements.** Five values, each naming what
was read and from where: `crs:declared` (the file's own `crs`), `crs:asserted` (§3, unchanged),
`crs:format-default` (the format's rule, absent key), `axis:declared` (from the definition),
`axis:format-override` (from the format's specification, with its version). They are recorded on
`describe` and travel with the dataset. **None of them is an equivalence finding** — §4 and §7's
closing sentence are untouched, and this amendment licenses no later code to assume otherwise.

**6. The range check is a sanity check, not a truth test, and its assurance is recorded.** Its
level is recorded per open as exactly one of `metadata` (geo `bbox` or column statistics), `sample`
(first row group) or `none`. **It never reads all coordinates at open.** It can convict a
malformed file; it can never establish conformance. Its stated limit, which travels with it into
KNOWN-LIMITATIONS: *"A projected file inside ±180/±90 is NOT detected by it"* **[Brief A boundary
2, verbatim]**. No text may describe it as verifying, confirming or validating anything.

**7. Unchanged:** §1, §3, §4, §6 (as read in item 4), §7 in full, the Consequences, and the two
OPEN blocks. **The §5 OPEN block — the normalize-later question — is not answered here**, and this
amendment must not be cited as answering it.

**Acceptance (2026-09-23).** Amendment 1 is accepted on the human's word, as it stands: `DECISIONS-PENDING.md`, the RULED 2026-09-23 (late) block, entry 119 item (1). Its text above is appended verbatim from the Proposed text block of `docs/adr/PROPOSED-amendment-to-ADR-015-format-governed-inputs-and-provenance-classes.md` as it stood at 433413a, which this commit deletes: the blockquote markers are removed and the heading's date is filled; nothing else changes. Evidence: `frontends/shell/MANUAL-WALKTHROUGH.md` Part N rows N1, N2 and N4, operator-verified in its Part N run section; `engine/ADMISSION-RESULTS.md`.
