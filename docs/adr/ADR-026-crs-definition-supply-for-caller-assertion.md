# ADR-026 — CRS definition supply for a caller assertion

**Status:** Proposed (2026-08-18) — binds nothing until accepted. Its supply-route decision is
queued for the human (DECISIONS-PENDING entry 10); the admission-remediation cut's P2 builds to
the recommendation below unless overridden.

**Related:** ADR-015 §3/§5 (Accepted, architect-blockable); docs/05 (CRS identity by definitional
equivalence; grids identified by content hash, not filename); docs/01 principle 8 (plain text
everywhere); ADR-016 §3 (no inference discipline); ADR-021's recorded security property
(admission performs no runtime fetch).

## Context

ADR-015 §3 admits a caller's CRS assertion, and §5 requires axis order to be established *from
the definition*: `engine/src/geoparquet.rs::axis_order_from_projjson` refuses PROJJSON that
carries no `coordinate_system.axis`. So an operator cannot assert by typing `EPSG:2056` — a
definition must come from somewhere, and this engine has **no PROJ dependency** (ADR-015
Context). docs/05 forbids deciding CRS identity by name string; supplying a definition *by name*
from a lookup table is adjacent to that rule and must be handled explicitly rather than by
accident. Nothing in the constitution says where a definition comes from. This ADR is that
decision's home.

## Decision

1. **Two supply routes, both explicit operator acts.**
   **(a)** A pinned, in-tree, plain-text definition set (docs/01 "plain text everywhere"), each
   entry carrying authority, code, and a full PROJJSON definition **including
   `coordinate_system`** — displayed **in full** before assertion, never selected silently.
   **(b)** Paste a PROJJSON definition verbatim.
2. **Choosing a catalog entry is not an equivalence judgement.** Nothing is compared; the
   operator chooses a definition and the definition travels verbatim (ADR-015 §1). The record
   names the definition's own provenance — catalog entry id **and content hash**, or `pasted` —
   never just the identifier string (docs/05's grid rule, applied to definitions).
3. **The set is small, versioned, content-hashed, and never fetched at runtime** — the ADR-021
   statically-linked-parser security property, applied here: an assertion works offline and its
   inputs are exactly what the repository pins.
4. **Nothing in the set is offered as a suggestion for a particular file.** There is no matching,
   no scoring, no default, no "files like this usually use…" (ADR-016 §3's discipline applied
   to CRS).

## Consequences

- An operator can admit a real CRS-less GeoParquet without a PROJ dependency.
- A wrong assertion is a wrong assertion, recorded as one, with who and when (ADR-015 §3); the
  provenance record makes the definition itself auditable by hash.
- The set is a maintained artifact with an update policy and a hash; growing it is a reviewed
  change, not a data update.
- When PROJ (or any authority database) arrives, the set becomes an interim and the
  definitional-equivalence machinery docs/05 describes is owed — ADR-015 already says so.
- No reproducibility grade is claimed; nothing is persisted (ADR-005 untouched; reopening a file
  requires re-declaring).

## What this ADR does not decide

- Whether an assertion may ever override a **declared** CRS (ADR-015 §4 refuses it and defers
  the question to the data doctor).
- Sources whose CRS lives outside the file (ADR-015 OPEN).
- Axis normalization (ADR-015 §5's OPEN stands: refusing non-x-first is the resolved behavior).
- Non-GeoParquet formats.

*(Numbering note: ADR-025 is reserved for the publish dead-artifact / reader-ceiling decision
pending Part H8; if H8 does not confirm it, renumber that skeleton rather than reusing 025.)*
