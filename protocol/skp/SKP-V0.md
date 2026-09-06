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
{ skp, path: String, cancel_key: String,
  crs_assertion: Option<{ identifier: String, definition_json: String }>,
  identity: Option<{ column: String }> }
  →  { dataset: DatasetHandle }
```

`path` is UTF-8, absolute, and comes from the OS file picker. The host canonicalizes it and refuses
a non-file with `EngineError::Source`'s own text. **Cut 1 offered no `crs_assertion` and no
`identity` field** — the remediation flows that use them were cut-2 UI work, and the fields arrived
with the UI that exercises them, not before. **`skp/0.2` (§8) adds both fields to the wire**,
following exactly `viewport_query.bbox_crs`/`filter`'s own discipline (§7.2) as written: `null`
declares "none declared" and the key is always present, never omitted, on anything this codebase
writes; the wire carries no attribution — no `by`, no `at` — the host mints both when it records an
assertion or a declaration (ADR-004 Amendment 4; ADR-024 F-5). *(§7.2's own text goes further and
states an omitted key is a deserialize failure on the **reading** side too; `P0` found — and left
in place, not being P0's fix to make — that a plain `Option<T>` field with no `#[serde(default)]`
does not actually refuse an omitted key under this crate's derive, for `bbox_crs`/`filter` or for
these two new fields alike; see `protocol/skp/tests/fixtures.rs`'s
`omitting_crs_assertion_or_identity_key_is_currently_tolerated_not_refused`.)* Admission of either
value (ADR-015 §4, ADR-016 §3–§7) and the host-minted attribution are P1 work, threaded through
`open_cancellable`; this section states the wire shape `skp/0.2` opened, not that P0 alone admits
anything.

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
this reaches the producer's own `CancelToken` (ADR-019's Consequences: the SKP `cancel` call and a
data-plane `TAG_CANCEL` frame converge on the same token); for an unredeemed ticket it marks the
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
   **v0.1 (§7 below) does not add a sixth command** — `viewport_query` gains an optional row-filter
   parameter; `sql` stays absent, named absent by ADR-021's own "what this ADR does not decide."
2. **Transport bindings** — one: Tauri invoke. No control-plane websocket, no stdio, no MCP adapter.
3. **Version negotiation** — *"beyond a version field" means, minimally:* every request carries
   `skp: "skp/0"`, compared with `==`. No ranges, no min/max, no capability sets, no per-command
   versions, no downgrade path, no handshake. A client and host that disagree fail on the first call.
   **v0.1 (§7) bumps the compared literal to `skp/0.1`, `==` unchanged** — still no ranges, no
   min/max, no handshake; a v0-only client and a v0.1 host fail on the first call exactly as any two
   disagreeing literals always have here. **`skp/0.2` (§8) bumps the compared literal again, `==`
   unchanged** — still no ranges, min/max, capability set, or handshake. A `skp/0.1` client and a
   `skp/0.2` host fail on the first call.
4. **Capability discovery** — none. No `capabilities` command. The client hardcodes v0's five
   commands and cannot adapt to a future kernel.
5. **Cancellation and progress** — cancellation: yes, for streams and for `open_dataset` (§2, C3).
   Progress: data-plane batches only. `open_dataset` is cancellable but not progress-reporting.
   **v0.1 (§7) adds a named shortfall to this item, not a new gap**: for a filtered scan whose
   predicate matches late, "progress: data-plane batches only" can mean *zero* batches for a long
   time — see §7's own shortfall paragraph.
   **v0.1 scan-progress debt — re-deferred 2026-08-14, with reason, per ADR-021's acceptance
   condition (discharged here, not dropped).** True scan progress for a filtered `viewport_query` —
   any signal that a scan is advancing while no batch has been emitted — is **not** resolved by the
   filter-panel cut. Three reasons. **(1) It is a protocol change, not a client one.** No
   batch-independent carrier exists: `TAG_PROGRESS` is emitted only after a batch is sent
   (`protocol/data-plane/src/adapter_ws.rs`), and item 7 below declares no control-plane
   server→client push at all — so resolving it means new producer-side wire semantics on a data
   plane ADR-021 decision 10 recorded as unchanged, plus a new engine-side instrument. **(2) What
   the quantity *is* has not been decided.** Rows scanned, bytes read, row groups completed, and
   elapsed-since-first-source-row are four different claims with four different costs and honesty
   properties; choosing one is an ADR-class decision (`docs/01` principle 8 — a progress number
   that does not name what it counts is not progress), not an implementation detail. **(3) The
   acceptance condition's own interim ships instead**: indeterminate liveness plus a working
   cancel, both derived client-side from signals that already exist (`TAG_OPEN`, batch arrival,
   `cancel`), with no wire change. **What carries it:** the next SKP version that opens the wire
   for any reason — a `skp/0.2`, or `docs/07`'s 1.0 freeze, whichever comes first; until then this
   item stays on this list, unmet and named. **What may not be claimed meanwhile:** that
   `viewport_query` is progress-reporting (principle 7's progress clause stays unmet for a
   late-matching predicate, exactly as §7.7 states), and no `docs/08` first-pixels figure for a
   filtered scan.
6. **Backpressure** — data-plane credit only (`MAX_INFLIGHT_BATCHES = 4`, unchanged). None on the
   control plane; commands are unqueued, bounded only by the declared ticket/stream ceilings.
7. **Subscriptions and events** — none. No server-to-client push on the control plane in any form.
8. **Error taxonomy** — §6. The existing `engine::EngineError` taxonomy, surfaced verbatim; no new
   error invented, none flattened to a string. **v0.1 (§7) adds eleven `skp.filter_*` codes** to this
   taxonomy — still no new error *invented outside a declared, exhaustive taxonomy*: every one of the
   eleven is named, matched exhaustively with no wildcard arm, exactly this item's own discipline
   applied to predicate admission. **`skp/0.2` (§8) adds two `engine.*` codes** —
   `engine.crs_assertion_identifier_blank` and `engine.crs_assertion_definition_too_large`
   (`limit`/`saw`) — and one structured field, `candidate_columns` on `engine.identity_unusable`.
   Both codes map 1:1 from their `EngineError` variants through `error_of`'s existing no-wildcard
   `match`; no message text changed.
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
    version string, not a tolerant reader. **v0.1 (§7) is exactly one instance of this rule being
    exercised**, not an exception to it: `viewport_query`'s new `filter` field shipped together with
    the `skp/0.1` version bump, every fixture on both sides of the wire updated in the same commit
    (`CUT-STATE.md` P1) — a tolerant reader was never introduced.

    **`skp/0.2` (§8) is the second instance of this rule, and the first assembled across several
    commits.** Its field set grew after the literal was bumped (P2's `CrsInfo.definition_provenance`,
    P3c's two codes and `candidate_columns` refinement). That is **assembly of one unreleased
    version, not evolution of a released one**, and it is permitted only under all four of: (i) the
    literal has never been merged to `main` and appears in no persisted artifact — no bundle
    manifest, audit record or project file carries an `skp` version string; (ii) every addition is
    recorded in that version's own §8 entry **before** merge; (iii) both-side fixtures in the same
    commit as each addition; (iv) **the version freezes at merge** — any later change is a new
    literal. Condition (iv) is what makes (ii) load-bearing: the §8 entry is the version's full
    field set, and after merge it is a historical record, not a growing one.

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

## 7. v0.1 — a row filter on `viewport_query`

**Appended 2026-08-13. §§1–6 above are the original v0 text, unrewritten** (except the five §4 items
marked above — items 1, 3, 5, 8, and 13 — each carrying its own short v0.1 note in place rather than being rewritten wholesale) —
this section is additive. **ADR-021 was accepted 2026-08-13** (carrying a human acceptance
condition — the filter-panel liveness/cancel obligation; see that ADR's Status line), so this
section documents an accepted SKP v0.1 surface. It was written and merged ahead of that acceptance
under already-accepted ADR-004's license, the ADR-019/ADR-020 precedent; that "ahead of acceptance"
standing is now historical.

### 7.1 Version

`skp` is now compared against `"skp/0.1"`, still with a plain `==` (§4 item 3, updated above) — no
richer negotiation was added, `deny_unknown_fields` stays on every derived struct in both directions,
and every fixture on both the Rust and TypeScript sides of the wire was updated in the same commit
that bumped the literal (`CUT-STATE.md` P1). `skp/1` stays RESERVED, for docs/07's 1.0 freeze.

### 7.2 The wire shape

```
{ skp, dataset, bbox: Option<{xmin,ymin,xmax,ymax: HexF64}>, bbox_crs: Option<String>,
  limit: Option<DecU64>, filter: Option<{ predicate: String, dialect: String }> }
  →  { stream: StreamHandle, expires_in_ms: u32 }
```

`filter` is the only change to `viewport_query`'s request; the response is untouched, and `describe`
is untouched too — it stays the pure, in-memory, no-IO command §1 describes, with nothing to say
about a filter that only ever attaches to a stream request. **`filter: null` declares "no filter,"
never an absent key** — exactly `bbox_crs`'s own discipline: the field carries no
`#[serde(default)]`, so a request that omits the `filter` key entirely is a deserialize failure, not
a tolerated omission, and a present `Option<Filter>` with `None` still serializes to JSON `null`.
*(See the correction below.)*

> **Correction, 2026-08-18 (admission-remediation cut, architect re-review).** The sentence above is
> wrong about the **reading** side and has been since v0.1: a plain `Option<T>` struct field is
> deserialized as `None` when its key is absent, with or without `#[serde(default)]`, so an omitted
> `bbox_crs`, `filter`, `crs_assertion` or `identity` key is **tolerated as "none declared", not
> refused**. Documented by
> `protocol/skp/tests/fixtures.rs::omitting_crs_assertion_or_identity_key_is_currently_tolerated_not_refused`.
> What *is* true and is tested on both sides: **nothing this codebase writes ever omits the key** —
> `None` serializes to explicit `null`. Omitted and `null` mean the identical thing for all four
> fields, and the `==` version literal, not field presence, is what refuses a mismatched client.
> **Named absent, per §4's own discipline:** a wire-required-key mechanism, applied uniformly to
> every optional field on the wire. Not built here; §6's "no claim without the thing" applies to
> this spec's own sentences, which is why this correction is appended rather than the finding being
> left to a test comment.

`dialect`'s one admitted value is `"duckdb-expr/0"` (`FILTER_DIALECT_DUCKDB_EXPR_0`,
`protocol/skp/src/v0/commands.rs`) — any other value is refused by `Filter::new` at construction and
at deserialization alike, before the predicate text is ever looked at. A second dialect, if one is
ever added, gets its own version string; none exists in v0.1.

`predicate` is a single boolean **expression** — never a statement, never a `SELECT` (§7.3).

### 7.3 The SQL contract

A boolean expression in the declared dialect, composed by the host, verbatim, into the query it
already builds. **Never** a whole SQL statement, and **never** a derived-dataset handle: docs/11's
ResourceRef model and ADR-016's reopen-stability question are both unsatisfied, so a filtered result
is a shaped version of one `viewport_query` request, not a new addressable resource.

**Composition rule, stated as a string and tested as one** (`engine/src/stream.rs::build_sql`, its
own `filter_composition` test module):

```
WHERE (<predicate verbatim>) AND <bbox> [AND <ranges>]
```

Exactly two transformations, both mechanical: one added paren pair around the predicate text (never
rewritten, normalized, or case-folded on the way in or out), and the predicate placed **leftmost** —
every condition the query plan itself contributes (the bbox comparison, and any experimental
`FilterPlan` range predicate) is `AND`-appended after it, never before. With no bbox and a filter
present, the predicate is the entire `WHERE` clause.

**Namespace**: `describe.schema` minus the geometry column minus any column whose type is not
admitted for filtering (`engine::attributes::admit_attribute_type`) — an unqualified name; this
predicate never names a table.

### 7.4 Admitted constructs and the refused-by-name list

**Admitted**: column references (one unqualified name per reference), literals (dollar-quoted
strings included — DuckDB's parser lowers `$$...$$` to the identical node a `'...'` literal
produces, so there is nothing left to refuse by construct name once parsed), `AND`/`OR`
conjunctions, every `=`/`<`/`>`/`<>`/`<=`/`>=` comparison, `BETWEEN`, `IN` with a **literal** list,
`NOT`, `IS [NOT] NULL`, the four basic arithmetic operators (`+ - * /`), and `LIKE`/`ILIKE` with a
**literal** pattern (the second operand must itself be a constant, never a sub-expression).

**Refused, by name**: `CAST`, any subquery (`(SELECT ...)`, `x IN (SELECT ...)`), any bind
parameter (`?`, a named placeholder), a star expression, and every function call **except** the two
small, named sets just above — `read_csv`, `random()`, and every other scalar or table function
alike. **The construct allowlist is a docs/09 security boundary, not taste**: the no-subquery,
no-function-call rules are what stop a "read dataset A" grant from becoming "read any local file" via
`read_csv` reached through a filter predicate. The walker is allowlist-shaped throughout — an
unrecognized construct is always the final, unconditional-refusal arm, never a silent pass
(`engine/src/predicate.rs`).

### 7.5 Refusal taxonomy — eleven `skp.filter_*` codes

Exhaustive, no wildcard arm, mapped field-for-field from `engine::predicate::FilterError`
(`kernel/src/skp.rs::filter_error_of`) — exactly §6/§4 item 8's own "no wildcard arm" discipline,
applied to predicate admission.

| Code | Fields |
|---|---|
| `skp.filter_dialect_unsupported` | `declared` |
| `skp.filter_unparsable` | `detail` |
| `skp.filter_not_a_single_expression` | `statements` |
| `skp.filter_construct_not_admitted` | `construct` |
| `skp.filter_unknown_column` | `column` |
| `skp.filter_column_not_filterable` | `column`, `reason` |
| `skp.filter_identity_alias_ambiguous` | `column`, `source_column` |
| `skp.filter_not_boolean` | `inferred_type` |
| `skp.filter_too_long` | `limit`, `saw` |
| `skp.filter_too_deep` | `limit`, `saw` |
| `skp.filter_rejected_by_binder` | `detail` |

`skp.filter_identity_alias_ambiguous` is currently unreachable from any product entry point — no
constructor `kernel/` uses today produces a declared identity mapping whose source column differs
from the wire's own `id` name while the file also carries its own, unrelated `id` column. Written
now, fires the day a caller supplies one.

### 7.6 Three-stage admission, pre-lease and pre-mint

`AdmittedPredicate::admit` (`engine/src/predicate.rs`) runs three named stages, on `spawn_blocking`,
before `kernel/src/skp.rs::viewport_query` leases a stream connection or mints a ticket — a refused
predicate returns synchronously and typed, exactly §1's `viewport_query` entry already states for
`ViewportCrsMismatch`/`ViewportCrsUnidentifiable`/`NoCoveringBbox`, never as a data-plane terminal
frame arriving after a round trip:

1. **Structural admission** — DuckDB's own parser (`json_serialize_sql`, the predicate bound as
   `CAST(? AS VARCHAR)`, never string-concatenated into the query text). **Never a hand-rolled SQL
   lexer** — a second SQL grammar is not admitted. The returned expression tree is walked against
   the declared allowlist (§7.4).
2. **Namespace admission** — every column name the walk collected is checked against the dataset's
   resident schema (§7.3's namespace rule).
3. **Bind admission** — the predicate is prepared against a zero-row, typed surrogate relation built
   from the admitted namespace (`CAST(NULL AS ...)` literals only, no file I/O), and its inferred
   type is asserted `BOOLEAN`; an implicit int-to-bool (or any other) coercion is refused rather
   than silently accepted.

### 7.7 Named shortfall

A selective predicate over a large file can emit **no batches for a long time**. Progress on
`viewport_query` is data-plane-batches-only (§4 item 5) — there is no other progress signal a
filtered scan can emit — so principle 7's progress clause is **unmet** for a filtered scan whose
predicate matches late, and docs/08's first-pixels budget is **structurally unreachable** for such a
predicate: there is nothing to measure "first pixels" against until a matching row is found. Not
papered over. *(Re-deferred 2026-08-14 with reasons per ADR-021's acceptance condition — see §4
item 5's dated entry; the filter panel ships the condition's own interim: indeterminate liveness +
a working cancel, no wire change.)*

### 7.8 Data plane

**Unchanged, empty diff.** The predicate rides the ticket mint (§7.2 above, §1's existing
`viewport_query` entry); `TAG_START` stays ticket-only (ADR-019); nothing under
`protocol/data-plane/` changed for this feature.

Full design, consequences, and the security property this carries:
`docs/adr/ADR-021-row-filter-on-viewport-query.md` (**Accepted 2026-08-13**, carrying the human's
filter-panel liveness/cancel acceptance condition — see that ADR's Status line).

## 8. Change log

**Append-only from here down.** Each entry records what a version bump changed; **earlier entries
are never rewritten**, only added to below. §§1–7 above stay the live, current-shape description of
the protocol (updated in place where a version note says so, per each section's own discipline);
this section is the dated history of how it got there.

### skp/0.2 — admission-remediation cut, P0 (2026-08-18)

- **`open_dataset` gains two optional members**: `crs_assertion: Option<{ identifier: String,
  definition_json: String }>` (ADR-015 §4 — a caller-asserted CRS, admitted only over a file
  declaring none) and `identity: Option<{ column: String }>` (ADR-016 §3–§7 — a caller-declared
  identity column). Both follow `bbox_crs`/`filter`'s discipline as written (§7.2): `null` is a
  present, explicit "none declared"; `deny_unknown_fields` stays on both directions; no new
  command. The wire carries no attribution — no `by`, no `at`, no timestamp, no username — the
  host mints `by`/`at` when it records either (ADR-004 Amendment 4; ADR-024 F-5); that minting is
  P1 work, not this version bump.
- **`engine.identity_unusable`'s refusal payload gains `candidate_columns`**: the file's 64-bit
  integer columns (`Int64` and `UInt64` only), in schema order, unranked and unpreselected — no
  scoring, no "looks like an id" guess (ADR-016 §3's "declared, never inferred" extended to the
  candidate list itself). Carried as a comma-joined string in `SkpError.fields.candidate_columns`
  (the envelope has no list shape — §5). `EngineError::IdentityUnusable`'s `Display` text is
  unchanged, byte-for-byte, from `skp/0.1` — the walkthrough verbatim message and an E2E assertion
  both depend on that text staying exactly what it was; the new data rides only in the structured
  field.
- Every fixture on both the Rust (`protocol/skp/tests/data/*.json`, `protocol/skp/tests/fixtures.rs`)
  and TypeScript (`frontends/shell/src/skp/__tests__/fixtures.test.ts`) sides of the wire was
  updated in this same commit, per §4 item 13's own discipline, applied again.

**P2 addendum (2026-08-18, appended — the P0 bullets above are unchanged):** `skp/0.2` also adds
`definition_provenance: Option<String>` to `CrsInfo` on the `describe` **response** (`Some` only
for a caller-asserted CRS: `catalog:<id>@sha256:<12-hex>` or `pasted`, host-derived by exact
content hash of the supplied definition — never wire-carried, ADR-026 implementation note). This
field is part of the same `skp/0.2` this cut is still assembling on one branch — no `skp/0.2`
reader was ever released without it, so §4 item 13's no-tolerant-reader rule is not engaged
between released implementations; it IS engaged in spirit, which is why this addendum exists: the
version's record must list its full field set. Both-side fixtures updated in the same commit
(P2). Flagged for the cut's architect re-review alongside the §7.2 prose finding above.

**P3c addendum (2026-08-18, appended):** `skp/0.2` also picks up three refusal-shaping corrections
from the P0–P3 reviewer gate's SHOULD-FIX findings, host side:

- **Two new typed refusal codes on `open_dataset`**, both checked on the caller's CRS assertion
  before anything about it is parsed: `engine.crs_assertion_identifier_blank` (SF3 — an
  empty-or-whitespace-only `identifier` no longer admits as a nameless caller-asserted CRS that
  would otherwise flow, unnamed, into `describe` and a published bundle's `crs_identifier`) and
  `engine.crs_assertion_definition_too_large` (SF4 — `fields.limit`/`fields.saw`, both decimal
  byte counts). Both map 1:1 from `EngineError::CrsAssertionIdentifierBlank` /
  `EngineError::CrsAssertionDefinitionTooLarge` via `kernel/src/skp.rs::error_of`'s existing
  no-wildcard discipline.
- **`definition_json` on a caller's assertion is now bounded** at `MAX_CRS_DEFINITION_BYTES`
  (`engine/src/crs.rs`, 65 536 bytes) — checked host-side before the text is ever parsed as JSON,
  and mirrored client-side (`frontends/shell/src/admission/crsAssertionState.ts`, same constant
  value, comment naming the Rust source of truth) so an over-bound paste is never even sent: the
  multi-MB `invoke` serialization the check exists to avoid runs on the webview UI thread
  regardless of which side ultimately refuses it.
- **`candidate_columns` (the comma-joined field on `engine.identity_unusable`, `skp/0.2`'s own P0
  bullet above) now omits any column whose name itself contains a comma** (SF6 —
  `engine::identity::candidate_identity_columns`). A comma-joined wire field cannot carry such a
  name without becoming indistinguishable, once the shell splits on `,`, from two candidates that
  do not exist. The omission is scoped to this *offered* list only: such a column stays fully
  declarable — typed, uniqueness-checked, and usable as `identity.column` — by a caller who names
  it directly, unaffected by its absence from the candidate list.

No new command, no wire field removed, no existing field's shape changed. Both-side fixtures
(`protocol/skp/tests/data/*.json` / `protocol/skp/tests/fixtures.rs` and
`frontends/shell/src/skp/__tests__/fixtures.test.ts`) gain one new populated `describe` response
fixture (SF10 — `v0-describe-response-caller-asserted`, `source: caller_asserted` with
`asserted_by`/`asserted_at`/`definition_provenance` all populated together, the shape no existing
fixture exercised). Flagged for the cut's architect re-review alongside the P2 addendum above.

**CONFIRMED, 2026-09-02 — re-deferral of §4 item 5's scan-progress debt
(`DECISIONS-PENDING.md`'s resolved entry 9).** §4 item 5's dated 2026-08-14 entry parked the true-scan-progress
debt on "the next SKP version that opens the wire for any reason — a `skp/0.2`, or `docs/07`'s 1.0
freeze, whichever comes first." This version, `skp/0.2`, is that version: it opens the wire (the
two `open_dataset` fields above), so item 5's carrier clause fires. The debt is explicitly
re-deferred again, with the same three reasons item 5 already gives — **(1)** no batch-independent
data-plane carrier exists (`TAG_PROGRESS` still fires only after a batch, and this cut touches no
data-plane frame); **(2)** what the quantity *is* — rows scanned, bytes read, row groups completed,
elapsed-since-first-source-row — remains undecided and is an ADR-class question, not an
implementation detail; **(3)** the interim the acceptance condition asked for already shipped
(indeterminate liveness + a working cancel, client-derived, no wire change) — plus a **stronger
carrier than last time**: the quantity question is filed as its own Proposed-with-open-decision
ADR — **ADR-029** (filed 2026-09-02, the ADR-023 pattern), due before `docs/07`'s Prototype
exit, so "the next version" can no longer roll over silently. **This clause descends from
ADR-021's human acceptance condition, and the human has confirmed it, 2026-09-02** — this text is
**merged as discharged**, no longer flagged. See `DECISIONS-PENDING.md`'s resolved entry 9.

**P6 architect re-review (2026-08-18, appended):** the cut's scheduled merge-gating architect
re-review returned **pass with notes** and ruled on this entry's three flagged questions: (1) §7.2's
omitted-key prose is corrected (see §7.2's appended correction), not hardened — ADR-021's accepted
text is not contradicted, only this spec's own sentence was; a wire-required-key mechanism is now a
§4 named-absent item. (2) Host-derived `definition_provenance` is blessed as built — the F-5 form
applied to a provenance record, exact-byte bookkeeping that nothing branches on; the `pasted`
naming question goes to ADR-026's acceptance (DECISIONS-PENDING entry 10), not this review.
(3) The within-version assembly is blessed under §4 item 13's appended four-condition rule —
**`skp/0.2` freezes at merge**; its §8 entries above are its full field set. The re-deferral
above is now **CONFIRMED** (2026-09-02, entry 9) — this review had no standing over a clause
descending from the human's ADR-021 acceptance condition, and did not decide it; the human did.

**Entry-30 addendum (2026-09-03, appended): `definition_provenance`'s no-definition value.**
Per the human's entry-25 ruling and its entry-30 corollary, an assertion carrying no definition
at all (the CLI `--assert-crs` route, `definition_provenance(None)`) now records
**`none-supplied`** instead of `pasted` — the old value asserted an action that never happened;
the new one records only the observed non-supply (no hash, no catalog comparison ever ran).
`pasted` is retained, unchanged, for the supplied-but-not-catalog-identical case (entry 25's own
ruling). **Versioning disposition, RULED 2026-09-04 — `skp/0.2` stands, no bump.** The human's
rule, applied: a new value in an EXISTING key's domain rides the current version as a value-domain
widening (a new KEY would force `skp/0.3`). `none-supplied` is exactly the former — the
`definition_provenance` field (key) already exists in `skp/0.2`'s `CrsInfo`; only the set of
strings it can return widens, from {`catalog:…`, `pasted`} to add `none-supplied`. No field is
added or removed, and nothing branches on the value (the F-5 form's own "exact-byte bookkeeping"
blessing above). This is the **same shape as DECISIONS-PENDING entry 6** (the
`ApprovalRoute::ShellDialog` value-domain widening of the `spatial-audit/1` audit format,
APPROVED 2026-09-02), and it carries **entry 6's own expiry clause, restated not weakened**: the
widening-rides-the-version license holds only while no external reader of `skp/0.2` exists (a
dated fact — pre-ADR-009, repo private); the moment such a reader exists, a value-set change of
this class is a compatibility event that a version bump must carry. Until then, `skp/0.2` stands.
