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
