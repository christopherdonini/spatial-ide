# ADR-016 — Stable Feature Identity Admission and Source-Key Mapping

**Status:** Proposed — **binds nothing until accepted.** Not architect-blockable. The engine
implements the refusal half today because an engine that opens a file must do *something* at open,
and refusing is the only option that cannot be silently wrong.
**Split from:** **ADR-015 §8** and its source-key OPEN block, 2026-08-05. ADR-015 is about *CRS*
admission; feature identity is a different subject that had been carried along in it because both
are decided at open. Splitting is not a change of policy — the refusal below is what ADR-015 §8
already stated — it is a separation so that accepting a CRS policy does not silently accept an
identity policy, and so the mapping question below gets a vehicle of its own.
**Related:** ADR-010 rule 2 (authoritative coordinates are looked up through a stable feature ID —
Accepted, architect-blockable); ADR-005 (reproducibility grades — untouched); ADR-007 (delta store);
`docs/11` (typed resources, stable IDs, ResourceRef); `docs/05`; `docs/07`.
**Implemented by:** `engine/src/dataset.rs`.

## Context — and what the current check does *not* establish

The first `engine/` cut refuses any GeoParquet that does not carry a 64-bit column literally named
`id`. Refusing is right: ADR-010 rule 2 resolves picking through **GPU ordinal → stable feature ID →
authoritative f64 coordinate**, and its whole reason for existing is that a row ordinal equals
feature identity "only by accident of buffer order", where "any cull, chunk, sort or LOD ends that
accident silently, returning a wrong-but-plausible coordinate with nothing raised". Synthesizing an
ordinal here would reintroduce exactly that hazard one layer lower. `docs/11` independently requires
stable per-feature identity for editing and lineage.

**But the check as built is weaker than the words "stable feature identity" suggest, and this ADR
exists partly to say so plainly.** It verifies that a column named `id` exists and is a 64-bit
integer. It does **not** establish:

- **Dataset-wide uniqueness.** Nothing checks that the values are distinct. A file whose `id` column
  repeats a value — or is all zeroes — is admitted today, and every consumer downstream of ADR-010
  rule 2 would then resolve two different features to one identity. This is the failure rule 2
  describes, arriving through the data rather than through the buffer order.
- **Stability across reopen.** The engine reads the column each time it opens the file. For an
  immutable file that is the same answer every time by construction, but "the same answer because
  the bytes did not change" is a property of *this* source, not a property the engine has
  established or recorded. Nothing pins which revision of which file produced a given identity, so
  two datasets that differ can present identical identities and nothing notices.
- **That the values mean anything.** A 64-bit column named `id` may be a row number the exporter
  invented, which is the synthesized ordinal this policy exists to refuse, wearing a column name.

The check is therefore best understood as a **narrow structural precondition**, not as a guarantee
of identity. Stating the gap is the point: a reader who sees "stable feature identity is required"
would otherwise reasonably assume all three properties hold.

The requirement also bounds the hero slice hard. `docs/07`'s Prototype opens "a 5 GB GeoParquet";
most GeoParquet in the world carries no column named `id`, so as built this engine would refuse the
slice's own headline input. That is not an argument for weakening the refusal — it is the argument
for deciding the mapping question below.

## Decision

1. **A source is admitted only if it carries a per-feature identity the engine can use.** No
   synthesis, no row ordinals, no fallback. A source without one is refused with a typed error at
   open — in front of an operator, per the catalog's open-at-startup rule — not at a consumer's
   first request.
2. **Refusal is the default.** Absent an explicitly declared mapping (§3), the engine recognises
   exactly one form of identity: a 64-bit integer column named `id`.
3. **A caller may declare a mapping from a named source column to the engine's identity.** The
   mapping is explicit and per dataset; it is never inferred from column names, types, or
   cardinality. Inferring "this looks like an id" is the data doctor's *proposal* territory
   (`docs/05`: detect → propose → preview → apply, with confidence scores), Alpha work, and this ADR
   is its floor: the data doctor may propose an identity column with a preview; it may never
   silently supply one.
4. **Uniqueness is verified at open, over the whole dataset, and the verification is recorded.** A
   declared mapping whose values are not distinct is refused. This closes the first gap above for
   mapped identities — and the same verification applies to a native `id` column, which was
   previously trusted without it.
5. **The envelope records the identity's provenance, not just its presence.** A consumer can tell a
   **mapped** identity from a **native** one without asking the engine, in the way ADR-015's
   `crs_source` lets it tell a caller's CRS claim from a file fact, and per ADR-010 rule 1's
   tag-on-envelope clause. What is recorded is settled at acceptance — see the OPEN block.

## Consequences

- `docs/11` says ID assignment is "per dataset and recorded in metadata". This ADR is that record
  for this engine.
- **Uniqueness verification costs a pass over one column at open.** No performance claim is made
  here; the cost is measured against `docs/08`'s dataset classes when the code exists, and `docs/08`
  gains a correctness case for a duplicate-id source being refused.
- **Nothing here claims a reproducibility grade** (ADR-005). The slice persists nothing.
- **A mapped identity is not a licence to edit.** ADR-007's delta store needs identities stable
  across edits, snapshots and compaction; this ADR establishes uniqueness within one immutable
  source at one open, which is strictly less. Anything the editing path needs beyond that is owed
  before ADR-002's 1.0 digitizing path, not here.

## What this ADR does not decide

- **Composite keys.** Real sources carry identity across two or three columns. Whether the engine
  composes them, and how a composed identity is represented in a single 64-bit field without
  colliding, is undecided.
- **Non-integer keys** — UUIDs, strings, and anything requiring a hash to reach 64 bits, where the
  hash introduces a collision probability that a stable identity is not allowed to have.
- **Non-GeoParquet sources.** Each format states identity differently.
- **Any performance number.**

## Open

> **OPEN:** *What the envelope records for a mapped identity.* At minimum whether the identity is
> native or mapped, and which source column it came from. Whether it also records the uniqueness
> verification (that it ran, and over how many rows) is the open half — a consumer that cannot tell a
> verified identity from an unverified one is in the position §"Context" describes. **Must be settled
> at acceptance.**

> **OPEN:** *Stability across reopen, and what pins it.* Uniqueness at open says nothing about two
> opens agreeing, or about two different files presenting the same identities. `docs/11`'s
> ResourceRef — logical URI, content hash, source revision — is the obvious carrier, and the
> revision-keying a spatial index needs is the same question asked of derived state. Whether identity
> is pinned to a content-addressed revision, and what a mismatch does, is undecided. **Must be
> settled before any identity is persisted or used to address a feature across sessions.**

> **OPEN:** *Composite and non-integer keys*, per "does not decide" above.
