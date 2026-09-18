> **Status: consult — the architect's Brief B stage-B1 ADR-004 review of 2026-09-10.**
> Record, not policy — moved from the untracked `RELEASE-DRAFTS-0.1.0/` directory on the human's round-14 ruling (2026-09-17); nothing here binds, and its cites are historical (advisory in `verify-cites`, never gated).

# Architect consult — Brief B stage B1: the ADR-004 review of the data-plane column addition

*Consult of 2026-09-10 on the custodian's brief under the human's authorization ("Brief B, B1 consult only: … the architect's ADR-004 review of the data-plane column addition. No code."). Filed verbatim from the architect agent's report (HTML entities restored to `<`/`>`); the companion document is `architect-consult-b1-adr-023-decision.md`, whose header carries the agent's overall verdict ("pass with notes"). **Nothing here binds.** Brief B is held until Brief A closes (block-on-sight B-1). §9's four conflicts with the record are queued, not resolved — items 1, 2 and 4 for B1's implementer/the custodian at B1's close, item 3 for the architect.*

---

# Document 2 — Architect's ADR-004 review of the data-plane column addition

*Scope: DRAFT-3 block-on-sight B-5. No performance claim, no number, in this document.*

## 1. What the wire carries today

One frame per batch: `[u8 tag][3 reserved zero bytes][u32 big-endian payload_len][payload]`, `TAG_BATCH = 0x10` (`protocol/data-plane/src/wire.rs:13`, `:23-25`). The payload is a **complete, self-contained Arrow IPC stream** — schema + one batch + EOS — so the envelope rides every batch and the consumer's decode is one `tableFromIPC` call (`engine/src/envelope.rs:262-279`; `frontends/shell/src/canvas/decodeBatch.ts:52`).

The Arrow schema today is `[id: UInt64 not null, <geometry>: GeoArrow polygon]` (`envelope.rs:128-131`), with the frame/CRS/axis/identity facts as schema metadata (`envelope.rs:70-111`). The viewport entry point hands `stream_inner` the dataset's own envelope, whose attribute list is empty (`engine/src/stream.rs:762`); the publish entry point hands a widened one (`stream.rs:786-791`).

## 2. What B1 adds

Additional Arrow columns of the §2-admitted types, in declared order, **in the same batch, in the same frame, on the same transport** — binary Arrow IPC, no JSON anywhere on the payload path. No new frame tag, no new control frame, no second channel, no MCP involvement.

**Structurally, this is not new data-plane code.** The producer loop is already projection-generic: `build_sql` takes the attribute fields (`stream.rs:1004`, `:1117-1137`), the chunk loop resolves and type-checks them (`stream.rs:1597-1615`), and assembly checks arrays against declared fields (`envelope.rs:174-208`). What B1 changes is which envelope the viewport entry point constructs. `protocol/data-plane/` should see an **empty diff**, the same property ADR-021 decision 10 recorded for the filter (`ADR-021:117-119`) — and a reviewer should confirm it by `git diff`, not by reading.

JSON appears in exactly one place and it is not the payload: `attribute_columns` in the schema **metadata** map, which is already a string key/value map (`envelope.rs:118-126`). ADR-004's prohibition is on JSON in the data path (`docs/adr/ADR-004-skp-control-data-plane-mcp-adapter.md:17`); this is schema metadata and is admissible there and nowhere nearer the payload.

## 3. The copy-minimized path, with each copy named

Never "zero-copy" (ADR-004 supersedes ADR-001's claim, `ADR-004:17`). Copies on the added columns, producer to consumer:

1. **DuckDB chunk → producer**: `chunk.column_by_name(...).clone()` is an `Arc` clone of the chunk's array, not a data copy (`stream.rs:1601-1614`).
2. **Batch accumulation**: attribute runs are carried as **slices** of the chunk's own arrays, one slice per run (`stream.rs:1617-1621`). At cut time, a single run is `Arc::clone`d — **no copy** (`stream.rs:1971-1972`); a multi-run column is `arrow::compute::concat` — **one copy**, and the shipped producer counts how often it takes that path (`stream.rs:1974-1978`, counter at `stream.rs:559`).
3. **Serialization into the frame**: `write_ipc_into` appends into a buffer whose frame prefix was reserved first, so the producer serializes **directly into the framed buffer** instead of serializing then copying (`wire.rs:44-49`; `envelope.rs:268-272`). **One copy** of the column bytes, into the frame.
4. **Transport write**: below `adapter_ws`, the socket's own buffering is not enumerated by this review and **must not be claimed** as zero or as any count.
5. **Consumer decode**: `tableFromIPC` over the received bytes (`decodeBatch.ts:52`) — Arrow JS's own decode; then per-value materialization when the readout or the style key is read.

**Recommendation, copy-minimization on the consumer side:** keep a projected column as its Arrow `Vector` on `ResidentBatch` and read values at hover/style-resolve time. Eagerly materializing a JS array per column would add a full per-row copy of every projected value for every batch, most of which is never displayed — and it would create a second array to keep co-indexed with `ids`/`rings`, which is the desync hazard `decodeBatch.ts:23-27` is written to make structurally hard.

## 4. Backpressure and chunking — unchanged

Explicit application credit: the consumer grants credit as fixed-layout binary control frames and the writer takes a batch off the pump only while holding credit, consuming the permit rather than returning it (`protocol/data-plane/src/adapter_ws.rs:32-33`, `:185-204`, `TAG_CREDIT` at `wire.rs:29`). Chunking is unchanged: batches are cut by the same size policy, and the producer channel is bounded by `MAX_QUEUED_BATCHES` (`stream.rs:1032`). Cancellation is unchanged and stays a property, never a duration — the producer observes it inside the row loop and returns (`stream.rs:1623-1637`).

## 5. Wire-bytes discipline and Amendment 4 — intact

`kernel/tests/wire_bytes_invariant.rs:4-32` compares every emitted frame, prefix and payload, byte for byte with tracing on and off, excluding only `TAG_OPEN`'s payload (per-process identifiers) whose length is compared instead. B1 widens the **schema of the same operation class** (viewport/data plane); it does not introduce a new frame-emitting operation class, so Amendment 4's "proven for one operation class, not for all" (`ADR-004:53-56`) owes no new case. **It does owe a projection-carrying fixture**: the invariant should be exercised with a projection present, or it proves the property only for the narrow batch.

Amendment 4's forbidden list is untouched: no trace/span/correlation identifier becomes a column, a field or a reserved byte; no existing wire identifier is widened to double as a trace key (`ADR-004:40-43`). The producer's own attribute-concatenation counter is engine-Rust-API-only and must stay so (`stream.rs:561-565`) — it is exactly the "joined off the wire by the harness" case Amendment 4 permits (`ADR-004:45-47`), and a reviewer refuses it on sight if it appears in an SKP struct or a frame payload.

## 6. Batch-size consequence of wide text columns — the mechanism, not a number

Declared, not discovered (ADR-010 rule 6 style):

- Each row's attribute contribution is computed from the **row's content only** — a fixed width, or a string's own byte length plus its offset width — never from allocator state or reserved capacity, so two runs over identical rows cut in identical places (`stream.rs:1866-1894`).
- A NULL costs its validity bit and nothing else; a null slot's contents are never read (`stream.rs:1882-1888`).
- The loop **cuts before appending** (`stream.rs:1640-1656`), so a wide text column reduces rows per batch rather than pushing a batch past the hard ceiling. The ceiling itself is `MAX_BATCH_BYTES` with the cut target below it (`stream.rs:40-42`); an over-ceiling batch can therefore only be a single feature too large to carry, and the refusal names it (`stream.rs:1937-1953`).

**The mechanism is the ceiling, and it already exists.** No new ceiling is owed by wide text on the data plane; the ceiling owed by B1 is the *column-count* one (Doc 1 §4), which is a control-plane admission, not a frame property.

## 7. Identity column position — unchanged (ADR-016)

`id` stays column 0, `UInt64`, non-nullable; geometry stays column 1; projected columns are appended after both (`envelope.rs:128-131`, `:210-213`). Geometry-bounds computation reads column 1 positionally (`envelope.rs:233`), so appending after it is the only safe position — a reviewer refuses any patch that inserts a projected column before geometry. The consumer's own `id`-null refusal stays (`decodeBatch.ts:74-79`).

## 8. What a reviewer must refuse on sight (B-5)

1. Any diff under `protocol/data-plane/` for this cut.
2. Any JSON in a frame payload; any attribute value crossing on the control plane instead of the data plane.
3. The words "zero-copy" anywhere in code, comment, PR text or ledger.
4. A projected column inserted at or before index 1, or `id` made nullable.
5. A second batch constructor, or a `TaggedBatch` assembled without its declared-field check.
6. An instrument counter, span or connection fact appearing as an SKP field, a frame field, or a reserved byte.
7. A batch-boundary estimate that reads an allocation size or a NULL slot's contents.
8. Any credit/chunking change smuggled in with the schema widening.
9. A performance number or a duration attached to the widened batch (B-7).

## 9. Conflicts with the record — queued, not resolved

1. **`frontends/shell/src/style/document.ts:18-21` asserts, in code, "Categorical/match styling is unavailable live regardless (`viewport_query` carries no attributes — ADR-023)", and `StyleDocumentV0` (`document.ts:104-117`) is deliberately typed so a `match` is unrepresentable.** Both become false at B1 and must be changed in the same PR — and the type must gain `match` **without** the shell acquiring its own parse/resolve path (ADR-022 point 2). Queued for B1's implementer; not an ADR-022 amendment, because ADR-022's own sentence is conditional ("remains publish-only until the live stream carries attribute values", `docs/adr/ADR-022-style-v0-as-the-single-style-model.md:63`) and self-discharges.
2. **ADR-023's Context calls `attributes.rs` and `envelope.rs` "publish-path only" (`ADR-023:12-13`).** After B1 that sentence is historical. Because accepted ADR text is immutable, this is a dated corrigendum on ADR-023 at acceptance, not an edit.
3. **Per-column chunk retention at projection width.** `stream.rs:1965-1970` declares that a single-run attribute slice retains its whole DuckDB chunk's buffers until the batch drops, so producer-resident memory can exceed the estimate by up to one chunk per attribute column, and `MAX_QUEUED_BATCHES`'s arithmetic does not account for it. That was declared for a publish path with no canvas waiting; B1 makes it a live-path property multiplied by the projected column count, under the ceiling in Doc 1 §4. Queued for the architect — no number, no claim, and no `docs/08` row is opened by naming it.
4. **`filter_composition`'s pinned SQL prefix** (`stream.rs:2189`, `:2244`) hard-codes `SELECT "id" AS "id", "geometry" FROM read_parquet(?)`. A projection changes that prefix. The tests must be re-pinned projection-aware while keeping the `WHERE` clause assertion verbatim; weakening the `WHERE` assertion to accommodate the prefix is a refusal-on-sight.

**Files referenced:** `docs/adr/ADR-023-attribute-projection-on-viewport-query.md`, `docs/adr/ADR-004-skp-control-data-plane-mcp-adapter.md`, `docs/adr/ADR-021-row-filter-on-viewport-query.md`, `docs/adr/ADR-017-static-bundle-format-and-publish-semantics.md`, `docs/adr/ADR-016-stable-feature-identity-admission.md`, `docs/adr/ADR-010-render-frames-origins-boundaries.md`, `docs/adr/ADR-022-style-v0-as-the-single-style-model.md`, `protocol/skp/SKP-V0.md`, `protocol/skp/src/v0/commands.rs`, `protocol/skp/src/v0/mod.rs`, `protocol/data-plane/src/wire.rs`, `protocol/data-plane/src/adapter_ws.rs`, `kernel/src/skp.rs`, `kernel/tests/wire_bytes_invariant.rs`, `engine/src/attributes.rs`, `engine/src/envelope.rs`, `engine/src/stream.rs`, `frontends/shell/src/canvas/decodeBatch.ts`, `frontends/shell/src/canvas/pick.ts`, `frontends/shell/src/style/document.ts`, `state/drafts/post-tag/DRAFT-3-BRIEF-B-recipe-replay-publish.md`, `state/drafts/post-tag/DRAFT-2-BRIEF-A-admission-and-session-lifecycle.md`.
