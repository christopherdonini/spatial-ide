# ADR-028 — Viewport-bounded residency and the over-budget render contract

Status: Proposed — binds nothing. Filed as the home of record for ADR-011 gate 8's
"what replaces whole-dataset residency" question. Not architect-blockable until accepted.
Related: ADR-010 (rules 1, 3, 5, 6 — the invariants this must satisfy, not replace),
ADR-011 (the unmeasured tiled direction this works toward; not presumed),
ADR-016 (stable identity, which cross-tile de-duplication depends on),
ADR-019/ADR-014 (stream admission and concurrency, which fan-out pressures),
ADR-027 (console display of a per-pan command fan-out).

## Context
- The shell's MAX_RESIDENT_VERTICES = 2,000,000 refusal is a declared ceiling
  (frontends/shell/src/canvas/limits.ts), honest interim per ADR-011 gate 8.
- Part H at 5 GB (2026-08-30, operator observations, not measurements): ~19k of
  3,300,000 features resident; every pan/zoom refills from empty; Zoom-to-layer fits the
  visited-viewport union, not the dataset extent.
- At fit-to-extent the viewport IS the dataset, so viewport scoping alone cannot retire
  the refusal; and at that zoom features are sub-pixel, so hover has no honest answer
  (PR #15 disclosure 4).
- kernel/RESULTS.md fifth section finding 4: smaller viewports cost more to first batch.

## Decision
DELIBERATELY OPEN pending the preregistered measurement
(frontends/shell/RESIDENCY-PREREGISTRATION.md). Candidate, to be accepted or rejected on
that evidence:
1. Residency is bounded by viewport and a declared vertex budget, held as a tile-keyed
   cache over a fixed, declared grid; a single render origin is retained (ADR-010 rule 3
   untouched; ADR-011's per-tile origins are NOT adopted here).
2. Over-budget is a declared, labelled partial view with distance-ordered eviction — not
   an error and not a cancelled stream. The persistent rendered/total status is retained.
3. Cross-tile de-duplication by stable feature id is required; a boundary-spanning
   feature returned by two tile queries resolves to exactly one resident feature.
4. Picking below a declared pixel-size threshold refuses by name rather than returning a
   plausible-but-arbitrary feature (ADR-010 rule 6 discipline).
5. Completeness at overview scales is NOT delivered by this decision; LOD/aggregation is
   separate and owes its own preregistered gate.

## Consequences
- If accepted: retires the ceiling-refusal interim for the hero path in the restated
  form; ADR-011 gate 8 gains its written answer (the human rules on the gate, not this ADR);
  gates 1–7 of ADR-011 remain entirely open.
- If rejected: the declared-ceiling refusal with its persistent status remains the shell's
  contract, per ADR-011 gate 8's own text, and LOD becomes the only remaining lever.
- docs/08: no row is added by this ADR. Rows land with measurements, human-sight-approved.
- docs/07 line 22 reopen condition (2) is NOT triggered by this ADR — that condition needs
  ADR-011 accepted in a form removing whole-extent reads from the hot path, and a fresh
  preregistered gate either way.

## Resolved inputs (2026-08-30)

The human resolved three of this cut's outstanding decisions (`NEXT-CUT.md` 24(a)–(c)) on
2026-08-30. They do not change the Decision above — the candidate stays deliberately open,
pending the preregistered measurement — but they are now inputs the candidate assumes
rather than open questions the candidate would otherwise still be carrying:

- **24(a)** confirms Decision item 2's shape as the only one considered: over-budget
  renders as a **declared partial view**, never an error-shaped refusal and never a
  cancelled stream, with the **persistent rendered/total status indicator retained** — the
  indicator's presence is settled; only its wording (24(b)) was still open.
- **24(b)** approves that the status indicator's *meaning* changes (from "the whole
  dataset, capped" to "this tile-bounded view, capped") — the exact wording is deferred to
  the human's sight at the PR that implements it, not preregistered or decided here.
- **24(c)** confirms Decision item 4's mechanism: a hover below a declared pixel-size
  threshold **refuses by name** (a typed, named refusal — e.g. sub-pixel, no honest
  single-feature answer), rather than snapping to a plausible-but-arbitrary feature or
  silently returning nothing.

These resolutions are recorded here as the state the preregistration
(`frontends/shell/RESIDENCY-PREREGISTRATION.md` §2c) cites and assumes; they do not
themselves accept or reject the candidate decision above, which still awaits the
preregistered measurement's evidence.

## Architect-gate clarifications to the candidate Decision (2026-08-31, appended — Proposed)

The architect gate at the complex's tip found the as-built code diverging from the candidate's
Decision text in three ways the evidence session would otherwise silently absorb. Proposed
clarifications (the human rules at acceptance):

1. Item 1's grid is *fixed for a dataset session and declared in shape, derived in position*
   from a bounded bootstrap query — the derivation, its declared row bound, and its unproven
   representativeness are part of the decision, not an implementation detail.
2. Item 2 requires partiality to be a **durable property of the resident set** — a truncated
   or superseded-partial tile is marked partial, is re-requestable when headroom returns, and
   no completeness claim ("Showing all N…") may be emitted while any covering tile is partial
   or unfilled.
3. Item 3's "never evict a tile intersecting the current viewport" admits one declared
   exception — the dedupe-owner cascade — or the cascade is replaced by a re-fetch marker.

Item 4 (sub-pixel pick refusal by name) had no implementation at the gate's tip; ADR-028's
candidate cannot be accepted or rejected on evidence until it exists, since the
preregistration's pick-agreement assertion has no subject without it.
