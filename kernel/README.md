# `kernel/` — the composition root, and nothing more

`docs/02` scopes the kernel to "orchestration, dataset registry, lineage DAG, permissions, undo".
This slice implements **orchestration** — of a streamed query, of the SKP v0 control plane in front
of it, and of publishing a bundle — and of the rest only a name → dataset map and a subset of
`docs/09`'s permission model, both described below.

It is the only crate that turns an engine stream into a data-plane source: `EngineSourceFactory` is
the one `SourceFactory` over engine streams. Keeping that knowledge here
is what lets those two crates stay ignorant of each other, which is what makes ADR-004's
control/data-plane split structural rather than stylistic (`docs/02` warns that collapsing
`protocol/` into `kernel/` is how the SKP surface gets absorbed).

## What is here

- **`Catalog`** — datasets opened at startup (`slice-host --data`) or at runtime through SKP's
  `open_dataset`/`close_dataset` (`SkpHost`), and afterwards addressable by **name**. Never by path:
  a client-supplied filesystem path on a listening socket is an arbitrary-file-read primitive
  (`docs/09`). Under SKP the name is a `DatasetHandle` the host mints per open, never caller text.
  Opening before any query also means the CRS admission decision (ADR-015) happens at open, in front
  of an operator, not on a consumer's first request.
- **`EngineSourceFactory`** — turns one operation request into one engine stream. That is the whole
  engine-to-data-plane composition. A process installs one of two admission paths, never both: raw
  `StreamParams` in the START frame (`slice-host`), or a single-use ticket minted by
  `SkpHost::viewport_query` and redeemed once (`EngineSourceFactory::ticket_only`, ADR-019), which
  `frontends/shell` installs.
- **`StreamParams`** — the operation's parameters as fixed-layout binary. Viewport edges cross as
  **IEEE-754 bit patterns**, never JSON numbers: ADR-004 amendment 1 measured 1-ULP drift on JSON
  floats crossing the webview boundary, and a viewport edge that moves by 1 ULP silently changes
  which features are selected. The viewport also **names its own CRS**, because the engine can only
  refuse a mismatch it is told about.
- **`SkpHost`** (`src/skp.rs`) — the five SKP v0 commands (`protocol/skp/SKP-V0.md` §1) over the
  catalog. It mints `viewport_query` tickets, keeps one dataset-session generation per open, and
  arms the advisory source watcher at open; see the dataset-sessions section below.
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

**The `engine` row is the bound of a stream that carries no projected attributes.** A live
projected stream (`viewport_query` with `columns`, ADR-023) holds attribute buffers that
`engine/src/stream.rs` bounds separately, in the docs of `MAX_QUEUED_BATCHES` and
`MAX_ATTRIBUTE_RETENTION_FACTOR`. The rows above do not compose that bound, and no figure here
claims to cover it.

**Outside all of it, and not claimed to be inside:** DuckDB's own streaming buffer, and the OS and
webview allocations the process does not control. The spatial index is *inside* the process and
declares its own bound, but it is **per dataset, not per stream**, so multiplying it by
`MAX_CONCURRENT_STREAMS` would overstate it. The producer-resident *counter* sees only the
data-plane window — that is what it is instrumented to see — so the counter and these bounds answer
different questions, and `RESULTS.md` says which.

### DuckDB connections, and the coincidence that is not a decision

`engine` owns a bounded connection pool **per open dataset**: `MAX_STREAM_CONNECTIONS` 4 +
`MAX_MAINTENANCE_CONNECTIONS` 1 + `MAX_ADMISSION_CONNECTIONS` 4 = **9 physical connections per
dataset**. The composed process
ceiling is therefore **`open datasets × MAX_PHYSICAL_CONNECTIONS`**, and it scales with the catalog
rather than with the concurrent-stream ceiling — a reader who takes 9 as the process figure will be
wrong the moment a second dataset is registered. `slice-host` opens exactly one, so **9** today.
One query per physical connection; a lease moves
the connection out of the pool and no lock is held across a query. A stream that completes returns
its connection after a drained verification statement; a stream that fails or is cancelled discards
and replaces it, because this engine has established no post-interrupt health guarantee for DuckDB.

**The engine's stream ceiling and `protocol/data-plane`'s `MAX_CONCURRENT_STREAMS` are both 4, and this file is
the only one entitled to notice that.** The engine computes no ceiling from a binding's constant —
`docs/02` makes that split structural — and it justifies each of its own by what it will serve over
one dataset. The composition is the fact, and it is recorded here.

**The same shape, for the admission class (ADR-033 (accepted 2026-09-14); DECISIONS-PENDING entry 91 (a)).**
`MAX_ADMISSION_CONNECTIONS` is 4 and the shell's `MAX_IN_FLIGHT_TILE_STREAMS`
(`frontends/shell/src/canvas/tileGridConstants.ts:40`) is 3; the engine's ceiling is a literal it
owns, chosen so that the shell's three concurrent tile-keyed `viewport_query` admissions plus the
one baseline (non-tiled) viewport query — `3 + 1 = 4` — cannot collide at this class. The engine
says in `pool.rs`'s own doc what quantity it sized that ceiling against (ADR-010 rule 6); the
**composition** claim that follows — that in the shipped shell this class therefore never refuses,
so a per-tile filter admission is never lost to a lease — is stated only here. Two consequences, and
both are consequences of the *equality holding*, never guarantees independent of it: raising the
shell's fan-out above 3 without raising this ceiling puts the residual refusal back in reach, and
that residual, when reached, is `engine.connections_exhausted` carrying `class`/`capacity` — never
`skp.filter_rejected_by_binder` (`kernel/src/skp.rs`'s `predicate_admit_error_of`, which matches on
`PredicateAdmitError` rather than folding it into the filter taxonomy). The shell retries that code
and only that code.

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
was already outside every bound in the table. It is now a **larger** remainder: up to 9 resident
in-memory DuckDB instances per open dataset (`MAX_PHYSICAL_CONNECTIONS`, ADR-033), rather than one per live stream. Nothing above covers
it and no figure here claims to. The measured process private commit is recorded in `RESULTS.md`
beside the bound, as it always was, and the two answer different questions.

**The session and credential posture is unchanged by any of this.** A DuckDB connection opens no
socket, mints no credential and persists nothing (`open_in_memory`). Connection reuse creates no
credential store: loopback-only bind and ephemeral port, OS-CSPRNG session token, constant-time
comparison and the existing Origin checks, the credential carried as a WebSocket subprotocol entry
and never in a query string, nothing written to disk by the data-plane crate, and the OS keychain
still deferred because the token is ephemeral and nothing persists across sessions. `physical_id` is
a monotonic counter and never a pointer value, so no address reaches an evidence artifact.

## Dataset sessions: generations, the source watcher, the session-end event

`SkpHost` keeps one **dataset-session generation** per successful `open_dataset`, in
`GenerationRegistry`, paired with the `SessionRef` that `open_dataset` mints and returns (ADR-035).
A generation is a counter in this process's memory: never persisted, never published, never on the
wire. Every ticket `viewport_query` hands out is attributed to the live generation it was minted
under, or is cancelled and refused. `slice-host`'s raw path has no `SkpHost` and no generations: a
post-check finding there still ends its stream with its typed code, and ends nothing else.

**A generation ends in one place, `SessionInvalidator::end_generation`, whichever route reaches
it:** the engine's descriptor pre-check refusing a `viewport_query`, a stream's post-check read at
its terminal (or, best-effort, on its drop), or the source watcher's signal. The reason is
`ObservedChange` or `CoverageLost`, and the first one recorded stands. The order is fixed: the end
is recorded; then, once per ended generation, one `DatasetSessionEnded` is offered to a bounded
channel (`session_end_channel`, `SESSION_END_EVENT_QUEUE_BOUND`) that the shell drains into the
`dataset_session_ended` event; then the generation's tickets are cancelled through
`StreamRegistry::cancel`. For a redeemed ticket, that call and a data-plane CANCEL converge at the
producer's own `CancelToken`, each by its own route. The event is advisory: a full queue
loses it and never blocks the end. The refusal is the authority: until the dataset is closed, every
later `viewport_query` on it refuses with the end's own code (`engine.source_changed` or
`engine.source_coverage_lost`), and so does the redemption of one of its tickets while the
dead-ticket record lasts. An ended dataset stays in the catalog: `describe` reports `session_end`,
and `cancel` and `close_dataset` still answer. No ticket state is dropped while `StreamRegistry`'s
lock is held, because dropping a pending ticket's source can itself end a generation and cancel
through that registry.

**The source watcher** is armed by `open_dataset`, through the `SourceWatchArm` the host was built
with, before the engine reads the file's descriptor; the shell builds the host with
`spatial_engine::PlatformWatch`, which watches on Windows only. A signal before admission refuses the
open with its own code; a signal after it ends the generation. When no watch can be armed the open
proceeds checks-only, with the reason in `describe`'s `coverage`. `coverage` is fixed at admission,
and a watch is never re-armed: a reopen is a new open, with a new handle and a new generation.

**`close_dataset`** drops the dataset's watch first, on every outcome after the version check, and
then refuses a name the catalog does not hold. Otherwise it marks the name closing, cancels every
ticket minted for it, forgets its generation and every record of it, and removes the catalog entry
last. The close takes effect at the closing mark: a racing `viewport_query` answers as it would
wholly before or wholly after the close, no ticket minted after the mark stays redeemable, and an
end that reaches the registry after the close writes no mark and emits nothing.

**`viewport_query`'s projection and filter refusals are synchronous and typed, before the stream's
connection lease and before any ticket.** A projection (`columns`, ADR-023) is admitted before a
filter (ADR-021), and each refusal carries its own `skp.projection_*` or `skp.filter_*` code
(`protocol/skp/SKP-V0.md` §7.5, §9.5 and §8). Bind admission refuses an implicit conversion outside
its admitted class as `skp.filter_type_not_admitted`
(`engine/FILTER-BIND-COERCIONS-PREREGISTRATION.md` §2).

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

**Publishing is a class-3 external side effect, and as of 2026-08-07 it is gated.** ADR-006 classes
it; `docs/09` says "Export and publish are distinct capabilities, never implied by write. Class-3
side effects always require approval."

**ADR-006's row for external side effects requires three things. All three now exist.** The row is:
*audit log · explicit approval · declared reversible / compensatable / irreversible.*

| ADR-006 requires | Status here |
|---|---|
| a declared reversibility class | **done** — `irreversible`, on the operation's own API |
| explicit approval | **done** — `permission/approval.rs`: a confirmation naming the destination, refusal the default on anything else and on EOF. There is deliberately **no timeout**; see the write-up for why `std` cannot give one honestly, and for what supplies the property a timeout would have |
| an **audit log** | **done** — `permission/audit/`: two-phase (intent before authorization, outcome at every terminal), append-only, per-user, **outside the bundle**, with declared rotation and retention ceilings and `docs/09` redaction applied to the record itself. **An unauditable class-3 operation does not run** |
| *(the scope both are checked against)* | `permission/grant.rs`: a scoped, expiring grant, checked against the operation's **actual** content hash and resolved destination rather than against what the request says about itself |

`permission/boundary.rs` is the only path through them, and `tests/permission_boundary.rs` asserts
that with a scan over this crate's own source.

**The full design, its declared properties, and eight findings flagged for the custodian are in
[`PERMISSION-BOUNDARY.md`](PERMISSION-BOUNDARY.md).** Three things from it are worth repeating here,
because each is a place this table could be read as claiming more than is true:

- **No SKP message reaches it.** No SKP message is defined and nothing in `protocol/` is touched.
  Two callers reach the operation, both through `permission/boundary.rs`: the shell's binding-local
  `binding_publish_*` commands (`frontends/shell/src-tauri/src/publish.rs`), the UI surface for
  which ADR-017's acceptance condition was discharged on 2026-08-17; and this crate's
  `publish-bundle` binary, which ADR-017 keeps as developer/test tooling.
- **At the command line the grant is self-minted, and in the default invocation it checks nothing** —
  both its halves are derived from the request it is authorizing. `--grant-destination` is the one
  part that is a real check. What gates a command-line publish is the approval and the audit record;
  the grant's teeth are at the library boundary.
- **`publish_unguarded` is still `pub`**, so an external caller can reach an ungated publish. The
  name is the mitigation and the residual is flagged (F-2).

**This audit log is not the ADR-006 class-2 command/event log**, and the two must not be conflated in
either direction. The bullet below lists "no command/event log" as a deliberate absence: that is the
*workspace-mutation* machinery ADR-006 assigns to a different class, it would not serve as an audit
record for an external side effect, and — the converse, which matters now that this log exists — this
log is class-3 only, is not a transaction log, does not participate in undo, and replays nothing.

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

- **No lineage DAG, no undo, no command/event log — and the reason differs per operation, which the
  single sentence that used to sit here hid.** This crate now orchestrates **two** operations with
  **different ADR-006 classes**:
  - **Streaming a query** is a **pure transformation**: an input snapshot plus parameters produce a
    derived output, it writes nothing, so no transaction boundary and no undo machinery is owed.
  - **Publishing a bundle** is a **class-3 external side effect**: it writes files outside any
    transaction, in a location it does not own. It is **not undoable and is never described as
    undoable** — ADR-006 requires a declared reversibility class instead, and publish declares
    `irreversible` on its own API. Undo machinery is not "not owed" here; it is **impossible**, and
    those are different reasons for the same absence.

  Calling both a pure transformation would put the wrong ADR-006 class on the one operation in this
  crate that actually has external effects.
- **Not `docs/09`'s permission model — a subset of it, with the boundary named.** What exists is one
  operation kind, one principal kind, no authentication, no client, no extension surface, and grants
  that die with the process. Where the subset stops being one is stated in
  [`PERMISSION-BOUNDARY.md`](PERMISSION-BOUNDARY.md) (F-8): a default-deny store cannot express
  "may do everything **except** publish", which is needed the moment a second class-3 operation
  exists, and `docs/09`'s "grants attach to any client" becomes binding at exposure.

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

## Owner's index (data-path lead; a current-state summary, edited in place)

*Pointers only: nothing here restates a schema, an ADR or a limitation. Updated in the PR of every piece that changes what a pointer points to. At most 60 lines.*

- **Last verified at:** 3c29bc67 (every pointer checked at that commit)
- **Interfaces this module owns:**
  - SKP v0 host, the five commands → `protocol/skp/SKP-V0.md` §1; `spatial_kernel::skp::SkpHost` · pinned by `kernel/tests/skp_admission.rs::viewport_query_refuses_synchronously_on_a_crs_mismatch_before_minting_a_handle`, `kernel/tests/source_watch_ordering.rs::describe_after_an_end_carries_session_end_and_describe_cancel_close_still_answer`, `kernel/src/skp.rs::tests::the_real_describe_geometry_carries_the_engines_encoding_for_each_open`
  - Stream tickets → SKP-V0 §1 (`viewport_query`, `cancel`), §3 (`StreamHandle`); `spatial_kernel::skp::StreamRegistry`, `spatial_kernel::EngineSourceFactory::ticket_only` · pinned by `kernel/src/skp.rs::tests::a_ticket_redeems_exactly_once`, `kernel/tests/skp_admission.rs::a_raw_stream_params_start_is_refused_in_ticket_only_mode`, `kernel/src/skp.rs::ticket_drop_under_lock_regression::an_unwind_through_cancel_drops_its_swept_source_after_releasing_the_guard`, `kernel/src/skp.rs::ticket_drop_under_lock_regression::an_unwind_through_cancel_all_for_dataset_drops_its_retired_source_after_releasing_the_guard`
  - The cancel handed to the data plane → `protocol/data-plane/TERMINAL-WITHOUT-CREDIT-PREREGISTRATION.md`; `spatial_data_plane::transport::SourceCancel` (`cancel`, `on_cancel`), implemented by the crate-private `EngineCancel` and its `CancelNotice` (`kernel/src/lib.rs`) · pinned by `kernel/src/lib.rs::cancel_notice_tests::engine_cancel_runs_the_registered_notice_once_in_either_order`, `kernel/tests/skp_cancel_terminal_without_credit.rs::an_skp_cancel_reaches_the_client_as_a_terminal_with_no_credit_granted`, `kernel/tests/skp_cancel_terminal_without_credit.rs::a_close_dataset_reaches_the_client_as_a_terminal_with_no_credit_granted`
  - Dataset-session generations and their end → ADR-035; `spatial_kernel::skp::GenerationRegistry`, `spatial_kernel::skp::SessionInvalidator::end_generation`, `spatial_kernel::skp::SessionEndReason` · pinned by `kernel/tests/session_generation.rs::live_generation_never_resurrects_an_invalidated_generation`, `kernel/tests/session_generation.rs::a_ticket_whose_generation_ended_refuses_at_redemption_with_its_typed_code`
  - Session-end event → ADR-035; SKP-V0 §8 (`skp/0.5`); `spatial_kernel::skp::session_end_channel` · pinned by `kernel/tests/session_end_event.rs::a_pre_check_end_emits_once_and_refuses_its_call`, `kernel/tests/session_end_event.rs::a_full_queue_loses_the_event_never_blocks_the_end_and_the_next_call_still_refuses`
  - Watcher arming and admission → `engine/SOURCE-WATCHER-PREREGISTRATION.md` §2b, `kernel/WATCH-GRANDPARENT-SPAWN-SIGNAL-PREREGISTRATION.md`; `spatial_kernel::skp::SkpHost::open_dataset` · pinned by `kernel/tests/source_watch_ordering.rs::a_signal_between_arming_and_admission_refuses_the_open`, `kernel/tests/source_watch_ordering.rs::a_signal_recorded_before_a_checks_only_outcome_refuses_the_open`, `kernel/tests/source_watch_ordering.rs::coverage_loss_refuses_with_its_own_code_never_source_changed`, `kernel/tests/watcher_first_read_windows.rs::the_opener_threads_exit_does_not_end_a_healthy_session`
  - Close ordering → `spatial_kernel::skp::SkpHost::close_dataset` · pinned by `kernel/src/skp.rs::ticket_drop_under_lock_regression::the_close_race_mints_no_generation_so_no_unheld_reference_exists`, `kernel/src/skp.rs::ticket_drop_under_lock_regression::a_close_whose_catalog_entry_is_already_gone_still_drops_its_watch`, `kernel/src/skp.rs::ticket_drop_under_lock_regression::cancel_of_a_pending_ticket_whose_post_check_found_a_change_does_not_hang`
  - Wire error codes → SKP-V0 §5, §7.5, §9.5; `spatial_kernel::skp::error_of`, `spatial_kernel::skp::filter_error_of`, `spatial_kernel::skp::terminal_detail_of` · pinned by `kernel/tests/typed_terminal_codes.rs::the_prefix_is_the_convention_for_every_engine_refusal_not_a_special_case`, `kernel/tests/skp_projection.rs::every_projection_refusal_is_synchronous_typed_and_pre_mint`, `kernel/tests/skp_admission.rs::a_filtered_viewport_query_comparing_text_with_a_number_refuses_synchronously_typed_and_mints_no_ticket`
  - Catalog → `spatial_kernel::Catalog` · pinned by `kernel/tests/catalog_replace.rs::replacing_a_name_through_open_cancellable_serves_the_new_dataset_and_drops_the_old_one_before_it_returns`
  - Raw admission path → `spatial_kernel::EngineSourceFactory`, `spatial_kernel::StreamParams`, `spatial_kernel::OPERATION` · pinned by `kernel/tests/end_to_end.rs::h1_the_payload_that_arrives_is_the_payload_the_file_holds`, `kernel/tests/end_to_end.rs::a_create_time_engine_refusal_on_the_raw_path_carries_its_typed_code`, `kernel/src/params.rs::tests::viewport_edges_cross_as_exact_bit_patterns`
  - Publish and the bundle format → ADR-017; `spatial_kernel::publish::preflight`, `spatial_kernel::publish::publish_unguarded`, `spatial_kernel::bundle` · pinned by `kernel/tests/publish.rs::the_emitted_manifest_has_exactly_the_key_sets_adr_017_declares`, `kernel/tests/publish.rs::an_existing_destination_is_refused_rather_than_replaced`, `kernel/tests/verify_bundle.rs::every_corruption_class_is_caught_with_its_declared_state`, `kernel/tests/publish.rs::a_multipolygon_encoded_dataset_refuses_at_preflight_by_name_before_any_pin_or_write`
  - Class-3 permission boundary and audit log → `kernel/PERMISSION-BOUNDARY.md`; `spatial_kernel::permission::boundary::execute`, `spatial_kernel::permission::audit` · pinned by `kernel/tests/permission_boundary.rs::the_permission_boundary_is_the_only_caller_of_the_publish_operation_in_this_crate`, `kernel/tests/permission_boundary.rs::an_intent_without_an_outcome_is_a_readable_state_not_a_missing_record`
  - Binaries and the bundle verifier → `slice-host` (`kernel/src/main.rs`), `publish-bundle` (`kernel/src/bin/publish-bundle.rs`), the `verify-bundle` example (`kernel/examples/verify-bundle.rs`) · pinned by `kernel/tests/publish_cli.rs::the_interactive_approval_requires_the_destination_name_and_refuses_everything_else`, `kernel/tests/verify_bundle.rs::a_real_bundle_verifies`
  - No generation or session reference in a persisted artifact → pinned by `kernel/tests/no_generation_in_persisted_artifacts.rs::the_published_bundle_carries_no_session_reference_key_or_value`
- **Consumed from other modules:**
  - `spatial_engine` (`Dataset`, `BatchStream`, `CancelToken`, `EngineError`, and the admission, projection, filter and watch types) ← engine
  - `spatial_data_plane::transport` (`SourceFactory`, `BatchSource`, `SourceCancel`, `OpenRequest`, `BatchMeta`), `spatial_data_plane::serve` ← protocol/data-plane
  - `spatial_skp::v0` (commands, handles, `SkpError`, `DatasetSessionEnded`, `SKP_VERSION`) ← protocol/skp
  - `spatial_renderer::compile`, `spatial_renderer::canonical` ← renderer
  - `renderer/bundle-viewer/ceilings.json` (compiled in by `kernel/src/publish/ceilings.rs`), and the built viewer passed in as `spatial_kernel::publish::ViewerAssets` ← renderer/bundle-viewer
- **Governed by:**
  - accepted ADRs: ADR-004, ADR-005, ADR-006, ADR-008, ADR-009, ADR-010, ADR-015, ADR-016, ADR-017, ADR-018, ADR-021, ADR-025, ADR-026, ADR-033, ADR-034, ADR-035
  - preregistrations in this module: `kernel/GENERATION-CLOSE-RACES-PREREGISTRATION.md`, `kernel/TICKET-DROP-UNDER-LOCK-PREREGISTRATION.md`, `kernel/TICKET-LIVENESS-REDEEM-PREREGISTRATION.md`, `kernel/CLOSE-DATASET-UNKNOWN-KEEPS-OPENRECORD-PREREGISTRATION.md`, `kernel/CATALOG-OPEN-REPLACE-DROP-NOTE-PREREGISTRATION.md`, `kernel/RAW-PATH-CREATE-REFUSAL-CODE-PREREGISTRATION.md`, `kernel/AUDIT-READER-CHAR-BOUNDARY-PREREGISTRATION.md`, `kernel/FIXTURE-REGENERATION-ENTRY-POINT-PREREGISTRATION.md`, `kernel/FIXTURES-REGENERATE-ORDER-PREREGISTRATION.md`, `kernel/TICKET-DROP-FOLLOWUPS-PREREGISTRATION.md`, `kernel/WATCH-GRANDPARENT-SPAWN-SIGNAL-PREREGISTRATION.md`, `kernel/TIMING-TESTS-PROPERTY-NOT-BUDGET-PREREGISTRATION.md`, `kernel/TIMING-ASSERTIONS-UNDER-CONTENTION-PREREGISTRATION.md`
  - measurement passes: `kernel/PROBE-PREREGISTRATION.md`, `kernel/FIRST-BATCH-AND-PRUNING-PREREGISTRATION.md`, `kernel/QUERY-WINDOW-ATTRIBUTION-PREREGISTRATION.md`, `kernel/CANCEL-RESCORE-PREREGISTRATION.md`, `kernel/IMPORT-LAYOUT-PREREGISTRATION.md`, `kernel/SCALE-PASS-PREREGISTRATION.md`
  - kernel halves of pieces filed elsewhere: `engine/SOURCE-WATCHER-PREREGISTRATION.md` (§2b), `engine/ADMISSION-PREREGISTRATION.md`, `engine/B1-PROJECTION-PREREGISTRATION.md`, `engine/FILTER-BIND-COERCIONS-PREREGISTRATION.md`, `engine/WATCHER-FIRST-READ-PREREGISTRATION.md`, `engine/MULTIPOLYGON-MP1-PREREGISTRATION.md`, `frontends/shell/OWNER-INVALIDATION-PREREGISTRATION.md`, `protocol/skp/CANCEL-STATE-CLOSED-SET-PREREGISTRATION.md`, `protocol/data-plane/TERMINAL-WITHOUT-CREDIT-PREREGISTRATION.md`
- **Proposed ADRs, binding nothing:** ADR-012, ADR-019, ADR-023, ADR-024
- **Declared limits:** KNOWN-LIMITATIONS 5, 6, 8, 12, 16, 21, 28, 30, 32
- **Ceilings:**
  - `TICKET_TTL`, `MAX_PENDING_TICKETS`, `TERMINAL_ENTRY_MAX_AGE`, `SESSION_END_EVENT_QUEUE_BOUND` (`kernel/src/skp.rs`)
  - `MAX_VIEWER_ASSETS`, `MAX_VIEWER_ASSET_BYTES` (`kernel/src/publish/viewer_assets.rs`) · `PUBLISH_WRITE_CHUNK_BYTES` (`kernel/src/publish/mod.rs`) · the reader's ceilings, `spatial_kernel::publish::ceilings::reader_ceilings` (`kernel/src/publish/ceilings.rs`)
  - `MAX_GRANT_LIFETIME`, `MAX_GRANTS` (`kernel/src/permission/grant.rs`) · `MAX_AUDIT_LOG_BYTES`, `MAX_AUDIT_LOG_GENERATIONS` (`kernel/src/permission/audit/log.rs`)
  - the composed per-stream and per-dataset figures: this README's section *Declared composed ceilings (ADR-010 rule 6)*
