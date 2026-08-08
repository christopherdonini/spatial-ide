# ADR-004 — SKP Semantic API, Control/Data Plane Split, MCP as Adapter

**Status:** Accepted — 2026-07-31

## Decision

One **semantic kernel API** with multiple optimized bindings — never one literal wire protocol forced onto every workload:

```text
Spatial Kernel semantic API
├── Native/generated bindings (in-process)
├── SKP — desktop UI, CLI, notebooks, CI, plugins
└── MCP adapter — external LLMs and agent hosts
```

- **Control plane** — commands, handles, schemas, progress, cancellation, errors. Tauri IPC is sufficient here.
- **Data plane** — Arrow/GeoArrow batches, tile streams, raster chunks, GPU-ready attribute buffers. A dedicated local binary transport: chunked, backpressured, **copy-minimized** — copies are measured and minimized, not assumed absent. No JSON on the hot path. This supersedes ADR-001's "zero-copy" claim.
- **MCP is an adapter over SKP** for AI hosts. It carries control and context; it is never the renderer's bulk data plane nor the low-latency editing path.

Protocol specification (version negotiation, capability discovery, error taxonomy, idempotency, handles, auth, tracing, schema evolution): see `10_SKP_Protocol.md`.

## Consequences

Kernel logic is written once against the semantic API; bindings stay thin; AI capability automatically tracks the platform. Cross-platform webview differences (Windows/macOS/Linux) become part of the validation matrix (08).

## Amendments (2026-08-03, from spike ADR-003 findings)

- **Bit-critical scalars on the control plane.** JSON float transport through webview IPC is not reliably bit-exact: 1-ULP drift observed in 3/9 runs on arrival at the Tauri command handler (spike M4). Rule: commands and metadata cross as JSON; numeric scalars requiring IEEE-754 binary identity cross as explicit bit patterns (hex string → `f64::from_bits`); bulk numerics only ever cross as binary on the data plane. Validated: 200,026 property-test patterns + 40 live exercises of the fixed path, zero mismatches (spike M5).
- **Producer-side cancellation is a hard transport requirement.** Tauri's custom protocol has no server-side interrupt path — a client abort never reaches the producer, so the kernel keeps computing cancelled work, violating docs/01 principle 7. The custom protocol is therefore **disqualified as the production data plane** (it remains acceptable for static assets). Candidate transports must make cancellation visible to the producer (WebSocket, localhost HTTP with connection-close semantics, interruptible IPC channels); the final choice is made when the engine module is built, measured against the spike M5 baseline (~105–112 MB/s, 4 avoidable copies + 1 GPU upload).

## Amendment 4 (2026-08-08, accepted) — instrument surface is never an SKP field, and the proof is a byte comparison

**Producer-side instrument surface — counters, spans, events, connection facts, timing records — is
never an SKP field, never a frame payload, and never crosses the wire in any form.**

This is already how the codebase behaves; what this amendment adds is **standing** — the rule
previously lived in two module comments, and a module comment is not a constraint a future design
has to argue against.

**Forbidden:** a trace, span or correlation identifier as a frame field, payload member, or reserved
byte; widening an existing wire identifier so it can double as a trace key; reinterpreting an
existing field's documented meaning to carry instrument state; any control-plane message whose
purpose is to propagate trace context.

**Not forbidden:** producer-side and consumer-side instruments joined off the wire by the harness,
using identities that already exist; and **a future ADR deciding SKP should carry trace context** —
this amendment makes that a deliberate decision with its own reasoning, not a field that appears in
a patch because it was convenient. `docs/10` lists distributed tracing as in scope and this does not
close it.

**The proof obligation: a regression test over serialized bytes, not a review conclusion.** With
tracing enabled and disabled, the same deterministic operation must serialize **byte-identical**
frames. `kernel/tests/wire_bytes_invariant.rs` is the current implementation (OPEN-frame payload
excluded for its per-process identifiers, its *length* compared instead). Its scope is the
viewport/data-plane operation class; **the invariant is proven for one operation class, not for
"all"** — a new operation class that emits frames owes its own case.

*Accepted from `PROPOSED-amendment-to-ADR-004-instrument-surface-never-skp.md`, retained as the
decision record. ADR-018's item 7 was struck the same day in this amendment's favor.*
