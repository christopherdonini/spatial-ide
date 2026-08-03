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
