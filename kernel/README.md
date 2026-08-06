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

## Declared recovery policy (ADR-010 rule 7)

**`slice-host`: `none` — fail visibly and terminate with a surfaced error.** No restart, no
supervision, no watchdog.

Rule 7 makes this a *required declaration*, not optional documentation: "`none — fail visibly and
terminate with a surfaced error` is a valid declaration; *not declaring* is not." The other three
modules each declare theirs; the kernel is the composition root, so the composed policy is the one
that governs the process and it belongs here.

What follows from choosing `none`: no heartbeat and no watchdog are required (rule 7 attaches those
to policies that promise recovery, and a policy that promises none has nothing to detect *when* to
do). What is still required, and is implemented: a failed stream surfaces a typed terminal to its
consumer rather than dropping a connection, and one stream's failure never terminates another's.

## Declared composed ceilings (ADR-010 rule 6)

The two crates each declare their own, and the composition adds them — a reader who takes either
crate's bound as the process's bound will be wrong:

| | |
|---|---|
| `engine` | `(MAX_QUEUED_BATCHES + 1) × MAX_BATCH_BYTES` = (2 + 1) × 4 MiB = **12 MiB** |
| `protocol/data-plane` | `(MAX_INFLIGHT_BATCHES + 1) × MAX_FRAME_BYTES` = (4 + 1) × 16 MiB = **80 MiB** |
| `engine` spatial index, when built | `features × 40 B` + 4 B per grid-bucket entry, capped per feature — **not per stream**: one index is shared by every stream over that dataset, and it is declared per index by `IndexReport`. *(The earlier `features × 48 B` counted one slot per feature and ignored the buckets; it was wrong and is corrected here.)* |
| **composed, per stream** | **92 MiB**, plus the shared index |
| × `MAX_CONCURRENT_STREAMS` (4) | **368 MiB** |

**These stay valid upper bounds across progressive batch sizing, and get looser.**
`MAX_INFLIGHT_BATCHES` counts batches, not bytes, so a window of early, deliberately small batches
holds fewer bytes than the same window of steady-state ones. A measured "percentage of bound"
figure therefore describes the batch shape it was taken under and may not be carried across a
sizing-policy change.

**Outside all of it, and not claimed to be inside:** DuckDB's own streaming buffer, and the OS and
webview allocations the process does not control. The spatial index is *inside* the process and
declares its own bound, but it is **per dataset, not per stream**, so multiplying it by
`MAX_CONCURRENT_STREAMS` would overstate it. The producer-resident *counter* sees only the
data-plane window — that is what it is instrumented to see — so the counter and these bounds answer
different questions, and `RESULTS.md` says which.

### DuckDB connections, and the coincidence that is not a decision

`engine` owns a bounded connection pool **per open dataset**: `MAX_STREAM_CONNECTIONS` 4 +
`MAX_MAINTENANCE_CONNECTIONS` 1 = **5 physical connections per dataset**. The composed process
ceiling is therefore **`open datasets × MAX_PHYSICAL_CONNECTIONS`**, and it scales with the catalog
rather than with the concurrent-stream ceiling — a reader who takes 5 as the process figure will be
wrong the moment a second dataset is registered. `slice-host` opens exactly one, so **5** today.
One query per physical connection; a lease moves
the connection out of the pool and no lock is held across a query. A stream that completes returns
its connection after a drained verification statement; a stream that fails or is cancelled discards
and replaces it, because this engine has established no post-interrupt health guarantee for DuckDB.

**The engine's stream ceiling and this crate's `MAX_CONCURRENT_STREAMS` are both 4, and this file is
the only one entitled to notice that.** The engine names no constant belonging to a binding —
`docs/02` makes that split structural and `engine/tests/slice.rs` scans that crate's own source to
keep it so — and it justifies its own ceiling by what it will serve over one dataset. The
composition is the fact, and it is recorded here.

Two consequences follow from the equality, and both matter in review:

- **The engine's `ConnectionsExhausted { class: "stream" }` refusal is unreachable on the
  natural-completion path, and reachable on the cancel path.** On completion the producer resolves
  its lease before it drops the batch channel, so a consumer that has seen a stream end has already
  seen its lease returned. **On a cancel the two ceilings are released by different, unsynchronized
  threads and the admission permit goes back first** — `drive` returns on CANCEL, the pump drops the
  source, that cancels the token, and only then does the engine's producer thread observe it, detach
  and discard. So at the concurrency ceiling a consumer that cancels and immediately re-requests
  (the ordinary pan/zoom supersession shape) can be **admitted here and refused by the engine**.

  This is a typed, visible refusal of a request this crate had already admitted — not a wrong
  result, not a silent degradation — and it is **new** with the connection pool: before it, every
  stream simply made its own connection. Adding slack does not close it, because N cancelled streams
  can leave N leases in flight; closing it means ordering the two releases, which is a decision about
  **admission**. It is therefore recorded as raw material for the reserved **ADR-014** and is not
  fixed by inventing capacity here. `frontends/canvas-probe`'s supersede scenario runs two streams,
  well under the ceiling, so nothing measured in this repository has met it.
- **Neither ceiling is evidence about the other, and neither decides ADR-014.** Refuse-don't-queue at
  admission is provisional and reversible (`protocol/data-plane/README.md`), and the engine's pool
  says the same of itself. Three independently chosen bounds now coincide with no decision behind the
  coincidence; that is raw material for **ADR-014**, not a finding, and may not be cited as evidence
  that the reserved question is settled.

**What this enlarges, stated here rather than discovered later.** DuckDB's own per-connection memory
was already outside every bound in the table. It is now a **larger** remainder: up to 5 resident
in-memory DuckDB instances per open dataset, rather than one per live stream. Nothing above covers
it and no figure here claims to. The measured process private commit is recorded in `RESULTS.md`
beside the bound, as it always was, and the two answer different questions.

**The session and credential posture is unchanged by any of this.** A DuckDB connection opens no
socket, mints no credential and persists nothing (`open_in_memory`). Connection reuse creates no
credential store: loopback-only bind and ephemeral port, OS-CSPRNG session token, constant-time
comparison and the existing Origin checks, the credential carried as a WebSocket subprotocol entry
and never in a query string, nothing written to disk by the data-plane crate, and the OS keychain
still deferred because the token is ephemeral and nothing persists across sessions. `physical_id` is
a monotonic counter and never a pointer value, so no address reaches an evidence artifact.

## Publishing, and the trigger this file named in advance

This README used to say: *"No persistence. Nothing is written. The moment this caches a result to
disk, names datasets by URI, or emits a bundle, `docs/11`'s ResourceRef model and ADR-005's grades
are owed and this file stops being honest. The slice claims no reproducibility grade."*

**A bundle is emitted now**, so that sentence has come due and is settled rather than deleted:

| What was owed | What discharges it |
|---|---|
| `docs/11`'s ResourceRef model | The manifest carries **three** ResourceRefs — bundle, source, style — each with all six members named, and an unknown member recorded as a typed state carrying its basis rather than a bare null |
| Datasets named by URI | `spatial://dataset/<name>`, from a **validated** catalog name. A name carrying a path separator, a drive letter or `..` is refused rather than escaped, because escaping would let a filesystem path through in encoded form |
| ADR-005's grades | Every bundle claims one. It is **Snapshot**, with its basis in the manifest and the reason Exact is not claimed written beside it: the inputs are content-hashed but their immutability is not established, and a crate version is not a pinned build |

**Publishing is a class-3 external side effect and there is no approval gate.** ADR-006 classes it;
`docs/09` says "Export and publish are distinct capabilities, never implied by write. Class-3 side
effects always require approval." The operation declares its reversibility class (`irreversible`) on
its own API, and the gate is recorded as **owed and absent**. Shipping it ungated while saying
nothing would be the silent version of the same gap.

Two consequences worth stating here rather than leaving to the module:

- **Re-publishing over an existing bundle is a typed refusal**, not a replace. The alternative never
  exposes a *partial* bundle, but its failure mode destroys a published artifact as a side effect of
  re-running a command — which is what the class-3 gate exists to prevent.
- **The source must be pinned explicitly first.** Hashing a whole file is ~600 ms on the 100 000
  feature fixture and `docs/07` opens a 5 GB one, so `Dataset::open` does not do it; the caller that
  needs the check pays for it at a call site that can be grepped. Publishing an unpinned source is
  refused, because a bundle claiming Snapshot on a basis nobody established is a grade claimed and
  not honored.

## What is deliberately absent

- **No lineage DAG, no undo, no command/event log.** The operation is a **pure transformation**
  (ADR-006) — an input snapshot plus parameters produce a derived output — so no transaction boundary
  and no undo machinery is owed.
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

# …and the measurement control, which is NOT a product mode:
#   --duckdb-connections fresh   keeps no configured connection between queries
```

**`--duckdb-connections` defaults to `reuse` and that is the product behaviour.** `fresh` exists
only as the control for the reused-connection contrast in `RESULTS.md` — it is a capacity of zero on
the same code path, not a second implementation, so the contrast measures reuse rather than two
branches. It is an operator-facing flag on the binary that composes the modules, deliberately not a
stream parameter: `StreamParams` is the operation's SKP-facing surface, and putting a storage-engine
setting there would enlarge that surface and change the wire format in order to run an experiment.

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
