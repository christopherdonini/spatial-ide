# `protocol/data-plane` — the data-plane binding

ADR-004's data plane: **binary, chunked, backpressured, copy-minimized, JSON-free**, carrying Arrow
IPC record batches. One operation, one stream per connection, one adapter.

## Status — read this before citing anything here

**ADR-012 (data-plane transport) is Proposed, and no §19.9 branch selected a candidate.** Phase 3's
own words: rule 4 fired at configuration M alone and "that is the ordering's verdict at one
configuration, not a transport decision"; configuration S failed twice; rule 7 (batch-size
dependence) is still not evaluable; and the N=2 concurrency block — the one that **inverted** the
ranking in Candidate B's favour — is inadmissible on an accounting defect, not on any reason to think
its timings wrong.

What licenses building on **Candidate A** anyway is *not* §19.9 rule 5, which preregisters only
"stays Proposed". It is `protocol/transport-bakeoff/README.md` **§19.10's sequencing**, whose step 3
builds the `protocol/` data plane and the first `engine/` scaffolding against a **provisional**
winner, and which declares its own circular gate:

> If the hero-slice confirmation falsifies the provisional choice, step 3 is rework.

This adapter is that provisional choice. **It is not a transport decision and may not be cited as
one.** No throughput or copy figure appears in this crate or is claimed from it (ADR-012 open risk 3:
"No throughput-based claim may cite this ADR"), and no zero-copy claim is made for either candidate.

Two of ADR-012's open risks point straight at this code and would *re-open* the question rather than
be settled by it: a properly accounted N=2 block reproducing the concurrency inversion (risk 1 — and
this slice sustains exactly the transient two-stream overlap that raises it), and an incremental
Arrow reader removing the copy differential (risk 2).

**Reversibility is the whole justification for "provisional", so it is mechanical:**
`tests/no_transport_leakage.rs` scans `src/transport.rs` for the forbidden vocabulary and asserts the
adapter is named in exactly two files — its module declaration and its one construction site.

## Layering

This crate knows nothing about what a batch contains. A `BatchSource` appends bytes to a buffer a
caller provides; a `SourceFactory` interprets opaque operation parameters. There is **no dependency
on `engine/`** — the composition happens in `kernel/`, the only place that knows both sides.

The buffer is handed in with the frame prefix already written, so a producer serializes each batch
**once**, straight into the buffer that goes on the wire. Nothing is said here about copies below
that level: ADR-004 requires copies to be "measured and minimized, not assumed absent", and what the
operating system and the browser do afterwards is not visible from this crate.

## Where the control plane went — declared, not left implicit

ADR-004 splits the control plane (commands, handles, schemas, progress, cancellation, errors — Tauri
IPC on desktop) from the data plane, and ADR-012's Consequences say "Nothing changes for the control
plane." This slice has **no Tauri shell**, so operation-start rides the data channel as a
fixed-layout binary START frame. `docs/10` gives partial cover ("Control plane … websocket for remote
clients"), but this is a **temporary structural deviation** and is recorded as one: **if it survives
past this slice it needs its own ADR**, not a README note. Credit and cancel are in-band binary
control frames, which is the adapter's own mechanism and needs no such note.

## This is not SKP v0

In scope: one operation, a batch stream, cancel, progress, terminal error, credit-based demand.
Unversioned beyond a subprotocol string, single-consumer, no specification document.

Out of scope, because they would be authoring SKP v0 (`docs/10`'s checklist): a command catalog
beyond that one operation, version negotiation, capability discovery, handle lifecycle, idempotency
keys, schema evolution, a generalized auth model, a conformance suite — and the token `skp` on any
type, file, crate or wire field.

## Two defects found in the port, and fixed here

Both were inherited from the bake-off harness's adapter, and each is now pinned by a test that
fails when the fix is removed.

**1. The cancel path dropped the connection before its terminal frame.** The receive half `break`s out
of its loop when it parses a CANCEL — but that task *is* the peer-drain, so returning from it let the
writer finish, drop the socket and abort the connection with the terminal frame still in flight. The
symptom was a cancelled stream ending in `os error 10053` after four batches and **no terminal frame
at all** — the same silent truncation ADR-012's Consequences describe, reached by the cancel path
rather than the completion path. Caught by
`superseded_query_cancel_while_a_second_stream_continues`.

**2. Credit was granted but never consumed.** `Semaphore::acquire` returns a permit that returns
itself on drop, so acquiring without `forget()` waits for a credit to *exist* and hands it straight
back. One grant would have licensed an unbounded number of batches, and the demand signal a consumer
thinks it is giving would do nothing; bounded memory would rest entirely on the pump channel's
capacity — which does hold, so this is a defect in the *mechanism*, not evidence that any past
measurement of memory was wrong. Fixing it required making the credit wait interruptible by the halt
signal, which is what defect 1's fix made necessary.

Pinned by `a_grant_of_n_moves_exactly_n_batches`, and the test was checked against the defect rather
than assumed to cover it: with `forget()` removed, **a grant of 3 moved all 10 000 batches**. No
memory assertion can catch this — the pump channel bounds memory either way — which is why the test
counts batches.

## Declared ceilings (ADR-010 rule 6)

`MAX_CONCURRENT_STREAMS` 4 · `MAX_INFLIGHT_BATCHES` 4 (credit window and pump capacity) ·
`MAX_FRAME_BYTES` 16 MiB · `START_TIMEOUT` 10 s · `PEER_DRAIN_TIMEOUT` 30 s.

A capacity slot is taken **after** the operation is read, and released as soon as the stream's last
frame is handed to the transport. Both ends matter: taking it at connect would let
`MAX_CONCURRENT_STREAMS` idle connections exhaust the ceiling for a full `START_TIMEOUT`, and holding
it across the peer's shutdown would make the ceiling a function of client timing rather than of
load.

**The N+1 case is a refusal, not a queue.** Whether concurrent streams should be queued, and on what
policy, is the question **ADR-014 is reserved for**; implementing a queue here would decide it by
accident. A declared ceiling with a visible, typed refusal decides nothing.

## Security posture (`docs/09`)

Loopback-only bind asserted at startup · ephemeral port · **session token from the OS CSPRNG** ·
constant-time comparison · exact `Origin` match with `null` explicitly rejected and an absent
`Origin` accepted only on a positive `Sec-Fetch-Site: same-origin` · credential offered as a
WebSocket subprotocol entry, never a query string · **nothing written to disk**.

ADR-012's threat model records two things "the production transport must not" do that the harness
did: mint tokens from a splitmix64 stream, and write the credential to disk. `spikes/` has a
messiness carve-out; `protocol/` does not, so both are fixed here rather than later.

**Residual, stated rather than implied.** "Nothing written to disk" is a claim about *this crate*:
it writes no file, and the launch URL is returned to its caller rather than saved. Anything that
*carries* the credential onward can still leave a trace, and the browser probe does: passing the URL
to a browser puts the token in that process's command line (readable by any process running as the
same user) and in the browser profile's own history, and the probe driver's profile cleanup is
best-effort. ADR-012 recorded exactly this class of residual for its `launch-url.txt` instead of
hiding it; the same disclosure is owed here. See `frontends/canvas-probe/README.md`.

Deferred and named rather than skipped: the **OS keychain** (nothing persists across sessions, so an
in-memory ephemeral token is strictly stronger than a stored one) and **peer authentication on
loopback** (ADR-012 open risk 8 — the token authenticates a session, not a process). This slice has
**no capability-grant model** and claims none.

## Declared recovery policy (ADR-010 rule 7)

**`none` — fail visibly and terminate the stream.** Every stream ends in exactly one terminal frame
from the shared taxonomy; a stream that ends without one is a failure the consumer must report, never
a short stream. No retry, no reconnect, no resumption. No watchdog, because the terminal frame *is*
the instrument.

## Tests

```bash
cargo test -p spatial-data-plane
```

`tests/candidate_a.rs` drives the adapter with a real WebSocket client and a synthetic source —
delivery and terminal framing, cancel propagation to the source, credit-bounded memory, the N+1
refusal, a source refusal surfacing with its own words, and the credential/origin rejections the
bake-off left untested (§15.8). Both ends are in one process, so a producer-side observation needs no
clock-relation bound and claims none.
