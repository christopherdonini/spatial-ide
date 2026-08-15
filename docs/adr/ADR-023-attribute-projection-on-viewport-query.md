# ADR-023 — Attribute Projection on `viewport_query`

**Status:** Proposed — **decision deliberately undrafted; binds nothing.** Filed 2026-08-15 as
the named home for a deferral, so the gap has an address instead of being rediscovered (the
ADR-011-gate-8 pattern). Not architect-blockable. No implementation exists or is licensed by this
filing.
**Drafted by:** the architect design consult for the `cut/style-panel` branch (2026-08-15).
**Related:** ADR-021 (the filter predicate's namespace — the same schema surface), ADR-017 §5a
(style v0's `match` needs a match-key column in the projection — the same discipline owed live),
ADR-010 rules 1/2 (frame tag; ordinal→id indirection — a widened batch schema must not disturb
either), `engine/src/attributes.rs` (`admit_projection` — exists, publish-path only),
`engine/src/envelope.rs` (the widened `[id, geometry, …attributes]` constructor — exists,
publish-path only), `docs/09` (what an unbounded projection over a local file requires).

## Context

Data-driven styling (`match`), attribute display in the hover panel, and any client-side
categorical legend all need per-feature attribute values on the **live** stream.
`viewport_query` has no projection parameter; the engine's declared attribute projection and the
widened batch envelope already exist but are reachable only from `stream_for_publish`. Style v0
already requires a `match` column to be present in the published projection — the same discipline
is owed live before the working canvas can style by attribute.

## Decision

> OPEN: whether `viewport_query` gains a declared, bounded, caller-supplied column projection;
> its ceiling (ADR-010 rule 6); its refusal set (the ADR-021 `skp.filter_*` taxonomy is the
> precedent); whether the batch-schema widening is admissible without an ADR-010 amendment (the
> envelope's own comment argues rule 1 is untouched because the frame tag is unchanged — to be
> verified, not inherited); and what `docs/09` requires of an unbounded projection over a local
> file. A future SKP version string is implied (SKP-V0 §4.13).

## Consequences (of the deferral, not of a decision)

Until this is decided: the working canvas styles by literal only; the hover panel shows `id`
only; and the hero slice's "colour by attribute" moment lives in the published bundle rather
than in the shell. Each of those is a named limit, never presented as a product choice.
