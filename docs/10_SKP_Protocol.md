# 10 — SKP Protocol

Implements ADR-004: **one semantic API and permission model, with multiple optimized bindings** — never one literal wire protocol for every workload.

## Structure

```text
Spatial Kernel semantic API
├── Native/generated bindings (in-process)
├── SKP — desktop UI, CLI, notebooks, CI, plugins
└── MCP adapter — external LLMs and agent hosts (04)
```

## Control plane vs data plane

- **Control plane** — commands, handles, schemas, progress, cancellation, errors. Transport: Tauri IPC on desktop; websocket for remote clients.
- **Data plane** — Arrow/GeoArrow batches, tile streams, raster chunks, GPU-ready attribute buffers. Dedicated local binary transport: chunked, backpressured, copy-minimized, JSON-free (ADR-004). Transfer representations are typed per resource (11).

## The specification must cover

Semantic command model · transport bindings · version negotiation · capability discovery · cancellation and progress · backpressure · subscriptions and events · error taxonomy · idempotency · stable vs temporary handles · authentication and authorization (09) · distributed tracing · schema evolution.

## Conformance

The SKP conformance suite (08) is normative: any client or kernel implementation must pass it. The MCP adapter is additionally tested via replayed agent sessions. Plugins pin to SKP major versions; the suite is the compatibility contract (12).

## Distributed tracing — where the engine-side half is, 2026-08-07

**Descriptive pointer, not a decision.** The checklist above names distributed tracing as in scope for
this document. **The protocol-level design remains open and nothing here forecloses it.**

What exists today is the **producer-side half only, as instrument surface**:

- `engine/src/trace.rs` — events (stamped instants) and spans (ordered event pairs with a duration),
  a bounded buffer with drop-with-count, one monotonic clock domain per operation, relative
  nanoseconds from an operation-local epoch, off by default.
- `kernel/src/publish/mod.rs::trace_names` — the publish-side boundaries the engine cannot name.
- `kernel/CANCELLATION-AND-TRACING.md` — the frozen boundary definitions and the cancellation-instant
  vocabulary.

**None of it crosses the wire.** No trace identifier is serialized, no frame gained a tag, a field or
a byte, and the join between a producer's spans and a consumer's is done by the harness from
identities that already exist. `kernel/tests/wire_bytes_invariant.rs` asserts this by comparing every
emitted frame byte-for-byte with tracing enabled and disabled, rather than by review.

**What is deliberately absent:** any cross-process trace propagation, any persisted trace id, any
correlation field on SKP. Whether SKP should ever carry trace context is exactly the open question,
and the rule that it must not — as a normative constraint rather than a description of today — is
drafted as a proposed appended amendment to ADR-004, since this document changes via ADR.
