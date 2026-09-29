# SKP conformance fixtures (proposal)

Golden request/response and refusal fixtures written **from `protocol/skp/SKP-V0.md` alone**
(phase 1), then run against `protocol/skp`'s wire types (phase 2, `main.rs` here). Each fixture
carries a `spec` citation naming the section it encodes. Ambiguities found while writing are in
`AMBIGUITIES.md`; no fixture was written for an ambiguous point.

This is not the conformance suite §4 names absent: it covers only what the `protocol/skp` crate
itself can observe (serde deserialization/serialization of the wire types). Host-side behaviour
(`==` version check, handle lookup, admission) is out of this crate's reach without a new
dependency, which was not added.

## Fixture schema

`fixtures/*.json` — arrays of `{ id, spec, wire_type, expect, roundtrip, document,
expected_refusal_code? }`.

- `expect: "accept"` — the document must deserialize; if `roundtrip`, re-serializing must yield the
  identical JSON value (explicit `null`s included, §7.2 Correction: "nothing this codebase writes
  ever omits the key").
- `expect: "reject_at_deserialize"` — the spec places the refusal at the type layer
  (`deny_unknown_fields`, §7.2's dialect rule, a stated field type).
- `expect: "refused_any_layer"` — the spec says the value is refused but not where (AMBIGUITIES A3).
  A type-level rejection satisfies it; a type-level acceptance is reported as "deferred to host",
  not as a divergence.

Run: `cargo test -p spatial-skp --test conformance -- --nocapture`.

Observed divergences are in `DIVERGENCES.md`. The harness asserts the observed divergence set
equals `REPORTED_DIVERGENCES` in `main.rs` in both directions, so a new divergence fails the run and
so does a reported one that stops diverging; neither is absorbed silently. Phases 1 and 2 (baseline
`bb98f71`) changed no existing fixture or implementation file. This directory's fixtures were since
updated in place, to the `skp/0.5` literal current on `main` (RULED 2026-09-26, question round 24,
item 4); no implementation file changed for that update either.

This directory's fixtures were updated again in place, to the `skp/0.6` literal at the merge of
`main` into `cut/b1-engine-projection`, engine/B1-PROJECTION-PREREGISTRATION.md's Amendment 9;
no implementation file changed for that update either.

This directory's fixtures were updated again in place, to the `skp/0.7` literal minted on
`cut/b1-close-nul-names` (§10 Amendment 12, PLAN node `b1-close-nul-column-names`); no
implementation file changed for that update either.
