# ADR-019 — Control-Plane Admission Tickets for Data-Plane Streams

**Status:** Proposed — **binds nothing until accepted.** Not architect-blockable. `frontends/shell`
implements it today because a shell with a Tauri control plane must resolve `protocol/data-plane`'s
own declared deviation (see Context), and the *implementation* is licensed by already-accepted
ADR-004 — the same standing under which `protocol/data-plane`'s WebSocket adapter itself proceeds
under ADR-012's provisional status.
**Drafted by:** the architect review gating `frontends/shell` cut 1 (2026-08-09), per CLAUDE.md's
architect-first workflow rule.
**Related:** ADR-004 (control/data-plane split, amendment 1 bit-critical scalars, Amendment 4
instrument surface), ADR-010 rule 6 (declared ceilings), ADR-012 (data-plane transport — Proposed,
status withheld twice), ADR-014 (reserved — data-plane stream concurrency/admission; a different
question, see "What it does not decide"), ADR-018 (cancellation instants — `cancel_requested` must be
stampable on the producer's clock), `docs/09` (loopback socket threat model), `docs/10` (SKP
protocol checklist).

## Context

ADR-004 puts commands, handles and cancellation on the control plane and bulk batches on the data
plane. `protocol/data-plane` was built and measured (the ADR-012 transport bake-off) **before any
control plane existed** — there was no Tauri shell to carry commands — so its `TAG_START` frame had
to carry the operation name *and its parameters* over the data channel itself
(`protocol/data-plane/src/server.rs`, whose own header comment names this a "temporary structural
deviation" with partial cover from `docs/10`'s "websocket for remote clients", and states plainly:
"if it survives past this slice it needs its own ADR."

Three further facts bear on closing that deviation now that a control plane exists:

1. **An SKP `cancel` command has nothing to cancel** unless a handle the control plane hands out
   resolves to the producer's own `CancelToken`. Today nothing does — the data plane is the only
   thing that knows a stream's identity.
2. **A listening loopback socket that accepts a dataset name, a bounding box and a row limit is a
   broader local attack surface than one that accepts an opaque reference.** `docs/09`'s posture is
   that a stolen session token should authorize as little as possible; today it authorizes an
   arbitrary query against an arbitrary open dataset.
3. **`kernel/src/params.rs`'s bit-critical-f64 codec exists only to carry viewport edges the control
   plane could carry instead** (ADR-004 amendment 1 already specifies a hex-string form for exactly
   this purpose on the control plane).

The deviation's stated justification — "this slice has no Tauri shell" — ends with this cut.

## Decision

**A data-plane stream is started by redeeming a control-plane-minted, single-use, expiring ticket.**

1. The control-plane `viewport_query` command validates the request against the open dataset (CRS,
   axis order, covering-bbox presence) **before** any socket is touched, mints a fresh
   `StreamHandle` (`"sh_" + 32 lowercase hex`, OS CSPRNG), and stores a `Ticket { query, dataset:
   Arc<Dataset>, minted_at, state }` in the kernel's stream registry. The handle is returned to the
   caller; the query itself never crosses the data plane.
2. The client opens the existing WebSocket data-plane connection exactly as today (`spatial-dp.v0` +
   `tok.<hex>` subprotocols, origin-checked, loopback-only — **unchanged**) and sends one `TAG_START`
   frame whose `operation` is `"stream_features"` and whose `params` is the ticket handle's ASCII
   bytes, nothing else.
3. The producer redeems the ticket **exactly once** (`Pending → Redeemed`) and streams using the
   query stored against it. A ticket that is unknown, expired, already redeemed, or was cancelled
   before redemption is refused with a typed terminal frame naming which.
4. `protocol/data-plane` itself changes in **no way**: `OpenRequest.params` was already an opaque
   byte blob (`protocol/data-plane/src/wire.rs`), so a ticket handle is simply a different — and
   much smaller — value placed in an already-opaque field.
5. **Declared ceilings on the ticket space** (ADR-010 rule 6 — declared, not discovered):
   `TICKET_TTL = 30s` (an unredeemed ticket is swept and its slot freed); `MAX_PENDING_TICKETS = 8`
   per dataset (a `viewport_query` beyond it is refused rather than queued, because supersede-on-pan
   mints tickets at gesture rate and an unbounded pending set is exactly the failure mode a declared
   ceiling exists to name in advance).
6. **The transport endpoint and session credential are delivered by a binding-local command that is
   explicitly not part of SKP** (`binding_data_plane_attach`) — ADR-012 H6 ("no transport detail
   leaks into the semantic API") forbids a URL, port or token appearing as an SKP field, so this
   command is named, documented, and excluded from SKP's command catalog and from any future
   conformance suite by name.

**Two handle-minting rules, stated so a reviewer can check code against them:** the kernel mints a
handle wherever the handle's possession authorizes *data to flow* (`DatasetHandle`, `StreamHandle`,
OS-CSPRNG, unguessable); the client mints a value wherever its only power is to stop the caller's own
already-authorized work (`CancelKey`, naming an in-flight `open_dataset` before it has returned a
handle). Nothing here revisits `protocol/data-plane`'s own session-token minting.

## Consequences

- **The deviation is retired wherever a control plane exists.** `kernel/src/main.rs`'s `slice-host`
  binary and the existing Rust integration suite (`kernel/tests/end_to_end.rs` and siblings) have no
  control plane and keep the raw `StreamParams`-on-START path unchanged. **One process never installs
  both admission paths** — `frontends/shell` asserts by test that a raw `StreamParams` payload sent
  to its own producer is refused (`TERM_PRODUCER_FAILED`), rather than silently accepted. A future cut
  that wants both paths live in one process needs its own ADR; this one does not authorize that.
- **`cancel` becomes a genuine control-plane command with a producer-side `CancelToken` behind it.**
  This is what makes ADR-018's `cancel_requested` instant stampable on the producer's own clock rather
  than inferred from a client-side event — the two mechanisms (an SKP `cancel` call and a data-plane
  `TAG_CANCEL` frame) now converge on the same token instead of being two independent, unreconciled
  paths.
- **The loopback socket's authority narrows.** A holder of the session token can now only redeem a
  ticket the shell's own control plane already authorized; it can no longer name an arbitrary dataset,
  bounding box, or row limit directly against the socket.
- **The bit-critical-f64 codec moves off the data channel** for this admission path. Viewport edges
  travel once, as `HexF64` on the control plane (ADR-004 amendment 1's own form), not twice.
- **Two handle spaces now exist, each with a stated minting rule** (above) — a future reviewer checks
  a new handle's kind against that rule rather than against precedent alone.

## What this ADR does not decide

- **Stream multiplexing.** The wire carries no stream id distinguishing concurrent streams on one
  connection; `CANCEL` would become ambiguous if it did. Reserved to a future ADR-012 revision or to
  **ADR-014** (data-plane stream concurrency and admission control — reserved, a different question
  from this one: ADR-014 is about *how many* concurrent streams and *who* is admitted; this ADR is
  about *how one stream's parameters reach the producer* regardless of concurrency policy).
- **Handle persistence across sessions.** Both handle kinds are session-scoped and non-persistable by
  construction; making either stable across a restart is blocked on `docs/11`'s ResourceRef model and
  on ADR-016's still-open "stability across reopen" question, neither of which this ADR touches.
- **Any control-plane transport other than Tauri invoke.** `docs/10` still lists "websocket for remote
  clients" as a future control-plane binding; this ADR says nothing about it.
- **Whether ADR-012's candidate selection is settled.** Nothing here accepts ADR-012 — Candidate A
  (the WebSocket adapter) is used because it is the only adapter that exists, exactly as
  `frontends/shell`'s own design note states.
