# SKP v0 — the skeleton's command set

**Status:** implemented by `protocol/skp` (types) and `kernel/src/skp.rs` (host). First real SKP
surface; everything before this cut spoke to the engine and the data plane directly, in-process,
with no control plane at all.
**Scope:** exactly what `frontends/shell` cut 1 needs and nothing else — `docs/10`'s "vertical
slices, not horizontal modules" applied to the protocol itself. This document is normative for v0;
it is not a promise about v1.
**Settled by:** the architect review gating `frontends/shell` cut 1 (2026-08-09), per CLAUDE.md's
architect-first workflow rule. Three premises in the cut brief were corrected in that review and the
corrections are recorded here rather than smoothed over (§2).

## 1. The five commands

Every request carries `skp: "skp/0"`. The host compares it with `==` and refuses anything else
(`skp.version_unsupported`) — see §4 for why nothing richer exists yet. Every response is
`Result<T, SkpError>`; every request and response struct is `#[serde(deny_unknown_fields)]` in both
directions, so schema evolution is impossible without a new version string.

### `open_dataset`

```
{ skp, path: String, cancel_key: String }  →  { dataset: DatasetHandle }
```

`path` is UTF-8, absolute, and comes from the OS file picker. The host canonicalizes it and refuses
a non-file with `EngineError::Source`'s own text. **Cut 1 offers no `crs_assertion` and no
`identity` field** — the remediation flows that would use them are cut-2 UI work, and the fields
arrive with the UI that exercises them, not before.

`cancel_key` is a client-minted string (see §3) naming this specific open so `cancel` can stop it
before it returns a handle. **`open_dataset` is cancellable but not progress-reporting** — a named
docs/01 principle-7 shortfall, not a silent gap (§2, C3).

### `describe`

```
{ skp, dataset }  →  DescribeResponse
```

Pure, in-memory, no IO beyond what `Dataset::open` already did, no lease taken, not cancellable
(ADR-006 class 1 — a pure transformation over already-resident state). Every field maps to an
existing `engine::Dataset` accessor; none of them runs a new query:

```
source   { path_display, geoparquet_version }
crs      { identifier, definition_json, source: "file"|"caller_asserted",
           asserted_by, asserted_at, axis_order, axis_normalization: "none-performed" }
geometry { column, encoding: "geoarrow.polygon", coordinate_layout: "interleaved-xy",
           frame: "authoritative-project-crs" }
identity { source: "file:id"|"mapped:<col>",
           uniqueness: "verified-at-open-full-file"|"declared-not-verified",
           verified_rows: Option<DecU64>, max_value: Option<DecU64>, js_exact: Option<bool> }
schema   [ { name, arrow_type, nullable } ]
covering_bbox: bool
row_count { basis, value: Option<DecU64> }
extent    { basis: "not-established-at-open", value: null }
license  { license, attribution, redistribution, declares_anything }
```

`duckdb_version()` is deliberately **not** in `describe`: it runs a query and can fail on connection
pressure (`ConnectionsExhausted`), which would make a command described as pure able to fail on
resource contention.

### `viewport_query`

```
{ skp, dataset, bbox: Option<{xmin,ymin,xmax,ymax: HexF64}>, bbox_crs: Option<String>,
  limit: Option<DecU64> }
  →  { stream: StreamHandle, expires_in_ms: u32 }
```

Validated against the dataset **before** any handle is minted, so `ViewportCrsMismatch` /
`ViewportCrsUnidentifiable` / `NoCoveringBbox` return synchronously with their full text on the
control plane — never as a data-plane terminal frame arriving after a round trip. `bbox_crs = null`
declares "in the dataset's own CRS" (ADR-015 §7). Data never crosses this command: it mints a
ticket (ADR-019) and the batches flow on the existing WebSocket data plane.

### `cancel`

```
{ skp, handle: String }  →  { state: "requested" | "unknown" | "already_terminal" }
```

`handle` is either a `StreamHandle` or a `CancelKey`. No timestamp, counter or duration in this
response (ADR-004 Amendment 4 — instrument surface is never an SKP field). For a redeemed stream
this reaches the producer's own `CancelToken` (ADR-019 §D2.4); for an unredeemed ticket it marks the
ticket cancelled so a later redemption is refused, closing the cancel-then-redeem race.

### `close_dataset`

```
{ skp, dataset }  →  { cancelled_streams: u32 }
```

Invalidates every unredeemed ticket for the dataset, cancels every live stream, then removes the
name from the catalog. Safe by refcount: each live stream's registry entry holds its own
`Arc<Dataset>` clone, so the dataset outlives its last stream regardless of close ordering.

## 2. Three corrections to the cut brief, made by the architect review

The brief said a successful open "shows schema, bounds, feature count." Two of those three do not
exist as stated:

- **C1 — no `bounds()` accessor exists on `engine::Dataset`.** Bounding box is only ever computed
  per batch on the publish path. `describe.extent` is therefore `{ basis:
  "not-established-at-open", value: null }`, and the canvas fits from the authoritative f64
  coordinates of batches it actually receives — labelled in the UI "extent of features received",
  never "dataset bounds." A dataset-extent operation is named cut-2 work, not a `describe` field.
- **C2 — "feature count" is not always known.** `identity().verified_rows()` is `Some(n)` only under
  `IdUniqueness::VerifiedAtOpenFullFile`; under `DeclaredNotVerified` it is `None`. `describe`
  therefore returns `row_count: { basis, value }`, never a bare integer — the same discipline ADR-016
  §6 already applies to uniqueness ("never the bare word 'unique' as a fact").
- **C3 — `open_dataset` was not cancellable.** `Dataset::open` and its sibling constructors all
  passed a throwaway `CancelToken::new()` nobody else could reach. At docs/07's 5 GB, ADR-016's
  whole-column uniqueness scan inside open is a multi-second uninterruptible operation — an
  unqualified docs/01 principle-7 violation. `engine::Dataset::open_cancellable` (new) exposes the
  cancel token the other constructors already threaded internally but never let a caller hold; the
  host runs `open_dataset` on `spawn_blocking` with the request's `cancel_key` bound to it. Progress
  reporting on open remains absent and is named, not hidden, in §5 item 5.

## 3. Handles and scalar codecs

**Two minting rules, stated so a reviewer can check code against them without re-deriving them:**
the kernel mints a handle wherever holding it authorizes *data to flow*; the client mints a value
wherever its only power is to stop the caller's *own already-authorized* work.

```
DatasetHandle  "ds_" + 32 lowercase hex   kernel-minted, OS CSPRNG
StreamHandle   "sh_" + 32 lowercase hex   kernel-minted, OS CSPRNG, single-use ticket (ADR-019)
CancelKey      client-minted, 1..=64 chars of [A-Za-z0-9_-]
```

All three are session-scoped and non-persistable. None may be written to disk, logged, or reused
across a process restart — docs/11's ResourceRef model and ADR-016's "stability across reopen" OPEN
block are both unsatisfied, so no handle may address a feature or dataset across sessions.
`protocol/data-plane`'s own `OperationId`/`StreamId` are transport-internal instrument identities,
not SKP handles, and are never used to join anything but the harness's own logs off the wire
(ADR-004 Amendment 4's "not forbidden" clause).

**Scalar codecs, strict — a malformed value is a refusal, never a best-effort parse:**

- `HexF64` — exactly 16 lowercase hex digits, no `0x`, big-endian `f64::to_bits`. A wrong length or
  case, or a non-finite bit pattern, is `skp.malformed_hex_f64` / `skp.bbox_not_finite`. This is
  ADR-004 amendment 1's control-plane form, applied for the first time in product code — JSON floats
  crossing a webview boundary were measured 1-ULP-unstable in 3/9 runs (spike M4), and a viewport
  edge that drifts by 1 ULP silently changes which features are selected.
- `DecU64` — decimal string. Every `u64` on the control plane (ids, row counts, byte counts) crosses
  this way; **no JSON number ever carries a u64 or a coordinate.** The JS side keeps ids as `bigint`
  and may narrow to `Number` only when `describe.identity.js_exact === true`.
- Ordinary bounded integers (batch counts, `expires_in_ms`) may be plain JSON numbers.

## 4. The mandatory named-deferral list

Every item on docs/10's "the specification must cover" checklist, stated as present or explicitly
absent — a v0 that goes silent on an item is not a smaller spec, it is an unstated one.

1. **Semantic command model** — the five commands above. Nothing else: no `list_datasets`, no `sql`,
   no `style`, no `publish` (ADR-017's acceptance condition keeps publish unreachable regardless).
2. **Transport bindings** — one: Tauri invoke. No control-plane websocket, no stdio, no MCP adapter.
3. **Version negotiation** — *"beyond a version field" means, minimally:* every request carries
   `skp: "skp/0"`, compared with `==`. No ranges, no min/max, no capability sets, no per-command
   versions, no downgrade path, no handshake. A client and host that disagree fail on the first call.
4. **Capability discovery** — none. No `capabilities` command. The client hardcodes v0's five
   commands and cannot adapt to a future kernel.
5. **Cancellation and progress** — cancellation: yes, for streams and for `open_dataset` (§2, C3).
   Progress: data-plane batches only. `open_dataset` is cancellable but not progress-reporting.
6. **Backpressure** — data-plane credit only (`MAX_INFLIGHT_BATCHES = 4`, unchanged). None on the
   control plane; commands are unqueued, bounded only by the declared ticket/stream ceilings.
7. **Subscriptions and events** — none. No server-to-client push on the control plane in any form.
8. **Error taxonomy** — §6. The existing `engine::EngineError` taxonomy, surfaced verbatim; no new
   error invented, none flattened to a string.
9. **Idempotency** — none. Retrying `open_dataset` opens a second `Dataset` and a second connection
   pool. `cancel`'s idempotence is a property of `CancelToken::cancel` and `StreamState::observe_cancel`
   already keeping the first instant — an accident of two existing implementations, not a mechanism,
   and must not be cited as one.
10. **Stable vs temporary handles** — all three handle kinds are temporary and session-scoped (§3).
    No stable resource URI; the publish path's `spatial://dataset/<name>` is not reachable here.
11. **Authentication and authorization** — none on the control plane beyond "only this shell's own
    webview can invoke it." No capability grants, no principals. The data plane keeps its existing
    session token, origin check and loopback bind, unchanged.
12. **Distributed tracing** — forbidden as a field, permanently, by ADR-004 Amendment 4. Instrument
    surface joins off the wire, by identities that already exist.
13. **Schema evolution** — none. `deny_unknown_fields` both directions; any field change is a new
    version string, not a tolerant reader.

**Also named absent:** a conformance suite. `protocol/data-plane/tests/candidate_a.rs` and
`kernel/tests/end_to_end.rs`'s H1–H7 assertions are the seed material a future docs/08 conformance
suite will draw on — v0 has no such suite today and may not be described as having one.

## 5. Error taxonomy

```rust
pub struct SkpError { pub code: String, pub message: String, pub fields: BTreeMap<String, String> }
```

- `message` is `EngineError`'s own `Display` output, verbatim — that text is the refusal UX the cut
  brief asks for.
- `code` is `engine.` + the variant name in snake_case (`engine.crs_undeclared`,
  `engine.axis_order_unsupported`, `engine.identity_unusable`, …) for every `EngineError` variant, or
  `skp.` for a protocol-level refusal (`skp.version_unsupported`, `skp.unknown_handle`,
  `skp.malformed_hex_f64`, `skp.bbox_not_finite`, `skp.cancel_key_in_use`,
  `skp.too_many_pending_streams`, …).
- `fields` carries that variant's own named fields as strings (`declared`, `asserted`, `column`,
  `detail`, `limit`, `saw`, …), so a client can build UI without parsing `message`.
- **The mapping is one exhaustive `match` with no wildcard arm** (`kernel/src/skp.rs::error_of`). A
  new `EngineError` variant fails the build until it is mapped — a wildcard here is exactly how a
  typed refusal degrades into "failed", which is the one thing this cut refuses to let happen.

## 6. What this is not

Not SKP v1. Not a conformance suite. Not a capability-discovery protocol. Not a stable-handle
system. Not an authentication model. Every one of those is named above rather than silently
missing, per docs/01 principle 8 — "no numbers, no claim" applied to specification completeness as
much as to performance.

See `docs/adr/ADR-019-control-plane-admission-tickets.md` for how `viewport_query`'s ticket reaches
the data plane, and `docs/adr/ADR-001-frontend-stack.md`'s 2026-08-09 amendment for the shell's
frontend framework decision this document assumes but does not itself make.
