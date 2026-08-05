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
4. **Only a deterministic, value-preserving mapping is admitted.**
   - **Deterministic**, meaning a pure function of file content and the declared mapping: the same
     file opened twice, in two processes, with DuckDB free to reach row groups in a different order,
     yields a bit-identical identity per feature. Anything derived from **scan order or a dictionary
     index is a synthesized ordinal wearing a mapping's clothes** and is refused — §2 refuses
     synthesized ordinals, and a mapping may not readmit them under another name.
   - Determinism is also what keeps this **orthogonal to ADR-005**. A deterministic mapping is
     recipe material: replay returns the same feature for the same id, so Exact stays reachable and
     no grade is capped. A nondeterministic one is *not* orthogonal — it would cap the grade under
     principle 3 — so orthogonality is obtained **by construction**, by refusing the rest, rather
     than asserted.
5. **Uniqueness is verified over the mapped values, at open, over the whole dataset, and what was
   verified is recorded.**
   - **On the mapped values, not the source column.** For anything but a value-preserving widening,
     `COUNT(DISTINCT source_key) = COUNT(*)` proves nothing about the identity the engine emits;
     collision in the *mapped* space is the same wrong-but-plausible hazard ADR-010 rule 2 exists to
     prevent, reached through a different door.
   - The same verification applies to a **native** `id` column, which §"Context" records as
     previously trusted without it.
   - **Verifying uniqueness reads a whole column, so it is an operation**, not a lookup: cancellable
     and progress-reporting per `docs/01` principle 7, and its cost measurable on its own. At
     `docs/07`'s 5 GB it lands on the same `docs/08` cold-open budget `kernel/RESULTS.md` records as
     unmeasured.
6. **The envelope records the identity's provenance and what was checked** — never a bare claim.
   - A consumer can tell a **mapped** identity from a **native** one without asking the engine, in
     the way ADR-015 §3's `crs_source` lets it tell a caller's claim from a file fact. That is the
     *form* precedent.
   - The **basis** is `docs/11` — "the ID-assignment policy is per dataset and recorded in
     metadata" — together with `docs/01` principle 8. **It is not ADR-010 rule 1**, whose
     tag-on-envelope clause is about *coordinate space*; citing rule 1 here would enlarge an
     Accepted, architect-blockable rule by analogy, which is what ADR-013 §7 refuses to do for
     rule 3 and what this ADR must not do for rule 1.
   - Following ADR-015 §5's `axis_normalization = none-performed` discipline, the record says what
     was *checked*, not what is hoped — a uniqueness state distinguishing verified-over-the-whole-
     file from verified-over-a-query-result from declared-but-unverified. **Never the bare word
     "unique" as a fact.** Exact field names are settled at acceptance — see the OPEN block.
7. **The identity's width is part of the contract.** It reaches consumers exact or not at all. A JS
   consumer reading ids as `BigUint64Array` is correct only while values stay below 2⁵³; a mapping
   that emits larger values makes any narrowing to a JS `Number` a rule-2 violation — and an
   unhandled BigInt serialization is literally the M4 root cause behind ADR-010 rule 7. A mapping
   whose range this engine cannot carry exactly is refused rather than narrowed.

## Consequences

- `docs/11` says ID assignment is "per dataset and recorded in metadata". This ADR is that record
  for this engine.
- **Uniqueness verification costs a pass over one column at open.** No performance claim is made
  here; the cost is measured against `docs/08`'s dataset classes when the code exists, and `docs/08`
  gains a correctness case for a duplicate-id source being refused.
- **Nothing here claims a reproducibility grade** (ADR-005). The slice persists nothing.
- **A mapped identity is not a licence to edit, and this ADR does not claim `docs/11` is satisfied.**
  It satisfies the **read-path** half — the stable id ADR-010 rule 2's indirection consumes. It does
  **not** satisfy the editing and lineage half: ADR-007's delta store needs identities stable across
  edits, snapshots and compaction, and it needs source-derived identities not to collide with
  identities minted for features *created* in the delta store. That namespace question is not solved
  here and is owed before ADR-002's 1.0 digitizing path.
- **Identity is a function of (file, declared mapping), so two callers declaring different columns
  get two identity spaces over the same bytes.** Until anything is persisted, the envelope naming
  the mapping is the only thing that stops a consumer being handed a different identity space on
  reopen without noticing. That is a reason the envelope record in §6 is load-bearing rather than
  informational.

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
