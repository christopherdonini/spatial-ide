# `kernel/` — the composition root, and nothing more

`docs/02` scopes the kernel to "orchestration, dataset registry, lineage DAG, permissions, undo".
This slice implements **orchestration for exactly one operation** and deliberately implements none of
the rest.

It is the only place that knows both `engine/` and `protocol/data-plane`. Keeping that knowledge here
is what lets those two crates stay ignorant of each other, which is what makes ADR-004's
control/data-plane split structural rather than stylistic (`docs/02` warns that collapsing
`protocol/` into `kernel/` is how the SKP surface gets absorbed).

## What is here

- **`Catalog`** — datasets opened at startup and addressable by **name**. Never by path: a
  client-supplied filesystem path on a listening socket is an arbitrary-file-read primitive
  (`docs/09`). Opening at startup also means the CRS admission decision (ADR-015) happens in front of
  an operator, not on a consumer's first request.
- **`EngineSourceFactory`** — turns one operation request into one engine stream. That is the whole
  composition.
- **`StreamParams`** — the operation's parameters as fixed-layout binary. Viewport edges cross as
  **IEEE-754 bit patterns**, never JSON numbers: ADR-004 amendment 1 measured 1-ULP drift on JSON
  floats crossing the webview boundary, and a viewport edge that moves by 1 ULP silently changes
  which features are selected. The viewport also **names its own CRS**, because the engine can only
  refuse a mismatch it is told about.
- **`slice-host`** — the binary that runs it end to end.

## What is deliberately absent

- **No lineage DAG, no undo, no command/event log.** The operation is a **pure transformation**
  (ADR-006) — an input snapshot plus parameters produce a derived output — so no transaction boundary
  and no undo machinery is owed.
- **No persistence.** Nothing is written. The moment this caches a result to disk, names datasets by
  URI, or emits a bundle, `docs/11`'s ResourceRef model and ADR-005's grades are owed and this file
  stops being honest. **The slice claims no reproducibility grade.**
- **No permission model.** `docs/09`'s capability grants do not exist here, and none is claimed.

## Running it

```bash
# 1. a fixture (test support; the file is never committed)
cargo run -p spatial-engine --features fixture --example make-fixture -- \
    --out target/fixtures/probe.parquet --features 40000

# 2. the consumer bundle
cd frontends/canvas-probe && npm install && npm run build && cd ../..

# 3. the slice
cargo run -p spatial-kernel --bin slice-host -- \
    --data target/fixtures/probe.parquet --assets frontends/canvas-probe/dist
```

It prints the URL to open. **The credential is in that URL's fragment**, which browsers never
transmit, and it is printed rather than written — ADR-012's threat model requires that the production
transport not write the credential to disk, so the harness's `launch-url.txt` is not reproduced.

## Tests

```bash
cargo test -p spatial-kernel
```

**`tests/end_to_end.rs` carries the bake-off's H1–H7 forward as permanent tests.** They were pass/fail
gates for one measurement; a gate that ran once is a claim about a commit, not a property of the
system. What changed since: the payload is now **real variable-width GeoArrow read from a GeoParquet
file through DuckDB**, so every requirement is asked of the thing that will actually ship.

| | Carried forward as |
|---|---|
| **H1** payload correctness | every feature and vertex arrives; ids unique and complete; **coordinate bit-identity** from file → DuckDB → WKB decode → GeoArrow → IPC → wire, asserted with no tolerance; the envelope on **every** batch; identical across runs |
| **H2** producer-visible cancellation < 100 ms | observed on the producer's own clock — and both ends are in one process, so no clock-relation bound is needed or claimed; **including the cancel-before-the-first-batch case**, which a flag polled between batches cannot serve; at most one batch after cancel |
| **H3** bounded-memory backpressure | a consumer that withholds credit stops the producer at a declared plateau — asserted on the **batch count**, because the byte bound alone is larger than the whole test payload and a producer with backpressure removed would still pass it |
| **H4** security posture | `protocol/data-plane/tests/candidate_a.rs` |
| **H5** zero JSON on the data path | counted per frame and reported as an explicit `0` |
| **H6** no transport leakage | scans **both** sides of the boundary — the neutral interface, and this engine's own source |
| **H7** progress and terminal propagation | progress is monotonic and reports its total as **unknown** rather than inventing a denominator; every refusal arrives as a typed terminal carrying its own words |
| **8-byte framing** | asserted against the messages that arrived: **one frame per message**, which is what puts a payload at a fixed, 8-byte-aligned offset in the consumer's buffer. Whether Arrow can then *view* that buffer instead of realigning it is measured by the browser probe on this payload shape, not inherited from the bake-off's fixed-width one |

`tests/concurrency_in_situ.rs` instruments the real pattern — a superseded query cancelled while
another stream continues — and writes `target/slice-evidence/concurrency-in-situ.json`. It is
**hypothesis-forming, not a preregistered measurement**: it may not be cited in ADR-012 and may not
re-open it; it is raw material for the reserved **ADR-014**. All comparisons are within-session, and
the artifact carries a fixed transport-insensitive **canary** so a reader can see whether the machine
was itself (bake-off README §21 Q1 / §22.1).
