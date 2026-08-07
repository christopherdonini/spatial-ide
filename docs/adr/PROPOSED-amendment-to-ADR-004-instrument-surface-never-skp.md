# PROPOSED appended amendment to ADR-004 — instrument surface is never an SKP field

**Status: PROPOSED, 2026-08-07. NOT APPLIED.** ADR-004 is Accepted and immutable; this file is a
draft of text to be *appended* to it if the human accepts. **Nothing here is in force**, and it may
not be cited to block a review or as settled design.

Filed as a separate file rather than appended directly, following the precedent of
`PROPOSED-amendment-to-ADR-003-projected-canvas-publishing.md`.

**Why ADR-004 and not `docs/10`:** the constraint is about **what may appear on the wire**, which is
ADR-004's subject. `docs/10` is marked "Changes via ADR" in `docs/README.md`, so a normative rule
foreclosing a future SKP design option cannot be landed there as prose. `docs/10` now carries a
*descriptive* pointer to where the engine-side instrument lives; this is the *normative* half, and the
split is deliberate.

---

## Proposed text

### Amendment 4 — instrument surface is never an SKP field, and the proof is a byte comparison

**Producer-side instrument surface — counters, spans, events, connection facts, timing records — is
never an SKP field, never a frame payload, and never crosses the wire in any form.**

This is already how the codebase behaves. `ConnectionFacts` carries `physical_id` and
`lease_generation` on the engine's Rust API and says in its own doc that these are never SKP fields;
`engine/src/trace.rs` states the same rule for spans. **What this amendment adds is standing** — the
rule currently lives in two module comments, and a module comment is not a constraint a future design
has to argue against.

#### What the rule forbids

- A trace, span or correlation identifier as a frame field, a payload member, or a reserved byte.
- Widening an existing wire identifier so it can double as a trace key.
- Reinterpreting an existing field's documented meaning to carry instrument state.
- Any control-plane message whose purpose is to propagate trace context.

#### What it does not forbid

- **Producer-side and consumer-side instruments, joined off the wire.** A consumer's spans are its
  own artifacts; correlating them with a producer's is the harness's job, using identities that
  already exist. `adapter_ws` already announces the stream's identity in band as the documented
  purpose of its OPEN frame, and a harness that keeps a string it already receives has added nothing
  to the protocol.
- **A future ADR deciding SKP should carry trace context.** This amendment makes that a decision
  someone has to take deliberately, with its own reasoning, rather than a field that appears in a
  patch because it was convenient. `docs/10` lists distributed tracing as in scope and this does not
  close it.

#### The proof obligation

**A regression test over serialized bytes, not a review conclusion.** With tracing enabled and
disabled, the same deterministic operation must serialize **byte-identical** frames.

"No identifier crosses the wire" is easy to assert in a comment and easy to break later with one
well-meaning field; a byte comparison is a claim that keeps being checked. `kernel/tests/wire_bytes_invariant.rs`
is the current implementation: it drives a real data-plane session and compares every emitted frame,
prefix and payload, excluding only the OPEN frame's payload — whose identifiers are minted per process
from a counter and the pid and therefore differ between two runs **with tracing untouched** — and
comparing that frame's *length* instead, which is what would move if a field were appended or an
identifier widened.

Its present scope is the viewport/data-plane operation class. Publish emits no protocol frames, so
nothing is uncovered today, but **the invariant is proven for one operation class and not for "all"**,
and a new operation class that emits frames owes its own case.

#### Relationship to ADR-004's existing rules

This is a narrowing of amendment 1's "no JSON on data hot paths" in spirit rather than in letter:
that rule is about what the data plane may carry per batch, and this is about what it may carry at
all. Instrument surface is written as JSONL **after an operation is terminal**, off every hot path —
which is where ADR-004 already puts it and where `ConnectionFacts` already lives.

---

## If accepted

- Append the section above to ADR-004 under its amendment sequence, dated, without rewriting anything
  accepted.
- Strike item 7 from ADR-018 (if that is also accepted) rather than carrying the rule in two places;
  ADR-018's subject is cancellation semantics and it should defer here on the wire question.
- Replace the closing paragraph of `docs/10`'s "Distributed tracing" pointer, which currently says
  this amendment is proposed, with a citation to the accepted amendment.

## If rejected

`docs/10`'s descriptive pointer stands unchanged — it describes what exists and claims nothing —
and the rule remains what it is today: a convention held by two module comments and one test, with no
standing against a future design that wants to add a field.
