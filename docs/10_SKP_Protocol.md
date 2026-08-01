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
