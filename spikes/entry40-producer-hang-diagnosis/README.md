
# Spike — entry-40: diagnosing the non-terminating tile stream (producer vs. transport)

**Question (DECISIONS-PENDING entry 40):** in the 2026-09-06 healthy-disk 5 GB attribution trial,
one tile stream never terminated after `pan-east` delivered 222 batches (`streamsIssued: 43,
streamsEnded: 42`, in-flight stuck at 1, console silent 5 s+, 204,850 ms elapsed before the settle
watchdog refused the step, `queueDepthSampleErrors: 0`). Is that a producer bug (a query that never
returns for one tile), a transport drop (a WS stream that stalls), or something else? This spike
**designs the instrumented pass that would discriminate it. It does not run anything, reproduce
anything, or touch product code** — per the routing dispatch and per spike discipline
(`docs/README.md`: written conclusions are the deliverable).

Read-only investigation. Every file:line cited below was opened directly by this pass; where a
claim rests on a document rather than code, it is quoted verbatim or explicitly marked a
paraphrase, per this engagement's citation discipline.

---

## 1. Candidate mechanisms, ranked

### Rank 1 — Producer-side: the viewport query itself never yields a chunk (`producer-query-hang`)

**Code path.** `SkpHost::viewport_query` (`kernel/src/skp.rs:362-406`) builds the query and calls
`open_engine_stream` (`kernel/src/lib.rs:207-214`), which calls `Dataset::stream_with_cancel`
(`engine/src/stream.rs:754-766`) with `index_use: IndexUse::Off` — **the product path never
consults the spatial index**; that seam is reached only through the `*_experimental` entry points
(`engine/src/stream.rs:842-948`, all `#[doc(hidden)]`, "No product path calls this"). Inside the
spawned producer thread, `produce()`'s row loop (`engine/src/stream.rs:1534-1573`) checks
`cancel.is_cancelled()` only **at the top of each loop iteration**; the actual fetch,
`catch_unwind(AssertUnwindSafe(|| arrow.next()))` (`stream.rs:1544`), is a single opaque call into
DuckDB with no chunk boundary the producer can poll inside. The module's own comment names exactly
this shape: *"for a selective, late-matching predicate this one call is where the entire
non-matching prefix gets scanned, because nothing yields a chunk this producer could check
`cancel.is_cancelled()` between until a match is found"* (`stream.rs:1487-1492`, paraphrased
condition, quoted clause verbatim). `kernel/src/main.rs:115-116` states the product posture
directly: *"covering bbox columns present — SQL filter is a linear scan, and the fixed-grid index
is deliberately not in the product planner (kernel/RESULTS.md)"*. `engine/src/pool.rs:53-55`
confirms leases are `try_acquire`-only, never queued or waited on — so pool exhaustion cannot
itself produce a silent hang (it is a typed `ConnectionsExhausted` refusal, ruled out below).

**What it predicts.** The DuckDB connection leased for this one tile (one of
`engine::pool::MAX_STREAM_CONNECTIONS = 4`, `pool.rs:92`) stays held — `ConnectionPool::active_leases()`
(`pool.rs:383-386`) would **not drop** for the stalled tile's slot for the whole stall. The producer
thread is actively executing (CPU-consuming, not blocked on any waitable primitive) inside DuckDB's
own C++ scan. No WS frame is ever queued for this stream, because `produce()` never reaches
`tx.send` (`stream.rs:2002-2013`, "Blocks when the consumer is behind: this is the backpressure
(H3)" — not reached here because nothing is *ready* to send, not because the channel is full).
Client-side credit sits unconsumed (irrelevant, since nothing is produced to spend it on).

**Evidence for.** The architecture is exactly this by design and by an already-measured, already-written
admission (no index in the product planner). The 1a `ATTRIBUTION-PASS.md` §3 independently measured
per-tile service times as **bimodal** at 3-way concurrency — bursts at 0.15–0.6 s/tile against
stretches at 6–17 s/tile, "longest terminal-free gap ≈17.3 s" — on the *same* candidate-arm tiling
architecture, one gesture earlier in the same cut. A single tile landing in a much worse tail of the
same unindexed-scan distribution (worse locality, or a bbox intersecting a long non-matching run of
rows near the file's other end) is not a new mechanism; it is the existing, named, measured cost
model's own extreme percentile. Nothing in the recorded evidence contradicts it: Cancel was never
pressed (RESULTS.md, DECISIONS-PENDING entry 40), so nothing would have interrupted a genuinely slow
but still-working scan, and the 204,850 ms watchdog cutoff is a harness policy, not a proof that the
scan could never have finished later.

**Evidence against / open.** Nothing in the client-observable record (batch cadence for the *other*
42 streams, `queueDepthSampleErrors: 0`) can currently distinguish "still scanning" from "stuck
forever" — that is exactly the gap §2's instrumented pass targets. No engine-side trace exists from
this trial (tracing is off by default, `engine/src/trace.rs:88`), so this rank is presently an
architecture-grounded inference, not a confirmed diagnosis.

### Rank 2 — Transport-side: a WS write/receive stall specific to concurrent streams (`transport-write-stall`)

**Code path.** `protocol/data-plane/src/adapter_ws.rs`'s own file header states the qualification
this rank rests on, verbatim: *"a properly accounted N=2 block reproducing the concurrency inversion
(ADR-012 open risk 1 — and this slice sustains exactly the transient two-stream overlap that raises
it)"* (`adapter_ws.rs:21-24`). ADR-012 itself (`docs/adr/ADR-012-data-plane-transport.md`,
"Phase 3 outcome") records a mechanism diagnostic, quoted verbatim: *"A mechanism diagnostic (§20.8,
'D1') eliminated the credit window, the JS main thread and the Rust producer by elimination, leaving
the cause inside WebView2's opaque WebSocket receive path"* — an **unresolved, explicitly-still-open**
risk, not something this or any later cut has closed. The real trial runs candidate-arm tiling at
`MAX_IN_FLIGHT_TILE_STREAMS = 3` (`frontends/shell/src/canvas/tileGridConstants.ts:40`) — three
concurrent WebSocket connections against the same origin, which is the same *class* of concurrent-WS
configuration ADR-012 flags as unmeasured (the bake-off's own admissible block was N=1; N=2 was
inadmissible on an accounting defect, not on any reason to doubt the timings).

**What it predicts.** The Rust server side would show **no defect**: `sink.send(Message::Binary(...))`
(`adapter_ws.rs:240` and `:257`) parked in its own `tokio::select!` against `halt_rx`, with the
producer having already produced the batch and the pump channel holding it — i.e. `active_leases()`
for this tile's connection would have **already dropped** (the engine stream finished or is
progressing normally) while the client still shows in-flight=1. This is the discriminator against
rank 1: rank 1 predicts the lease *never* drops; rank 2 predicts it *does* drop (or was never
unusual) while the client-visible stream still appears stuck. Because the stall is inside "WebView2's
opaque WebSocket receive path" (ADR-012's own words), no Rust-side instrument can see into it — it is
a genuine dead end for a producer/transport-side instrumented pass past confirming the server's own
state was healthy.

**Evidence for.** This is the only candidate in this list backed by a **previously observed,
already-written, unresolved anomaly in this exact browser engine under concurrent WS streams**
(the N=2 throughput inversion). It is explicitly named in-repo as a live risk for exactly this
slice's concurrency shape.

**Evidence against.** The bake-off's own inversion was a *throughput* anomaly (B faster than A
in aggregate), not a *stall-to-zero* anomaly — extrapolating from "inverted ranking" to "one stream
delivers literally nothing for 200+ s" is not licensed by the cited evidence; it is compatible with
it, not entailed by it. This must be stated as the weaker of the two top-ranked candidates for that
reason, even though it is the one candidate a Rust-side fix could never resolve on its own.

### Rank 3 — Credit-starvation-deadlock

**Code path.** `frontends/shell/src/streaming/adapterWs.ts`'s `startStream` grants
`CREDIT_WINDOW = 4` (`adapterWs.ts:13`) on open (`begin()`, `:52-55`) and re-grants whenever
`outstanding <= CREDIT_WINDOW / 2` on every batch (`:119-123`). Server-side, `drive()`'s writer only
pulls a batch after `credit.acquire()` succeeds (`adapter_ws.rs:201-213`), and the semaphore permit is
`forget()`-ed so it is truly consumed (`:213`, with the review-found defect this fixed named in
the surrounding comment, `:190-200`).

**What it predicts.** If credit were exhausted and never replenished, the server-side writer would
sit parked at `credit.acquire()` (`adapter_ws.rs:204`) — indistinguishable from rank 1 or 2 at the
WS-frame level, but **distinguishable at the engine level**: the producer would have already produced
and buffered a batch (bounded by `MAX_QUEUED_BATCHES = 2` in the engine's own channel,
`engine/src/stream.rs:66`, plus `MAX_INFLIGHT_BATCHES = 4` in the pump, `protocol/data-plane/src/server.rs:62`)
that is never sent — i.e. the engine-side lease could still be **active and producing**, not idle,
while nothing crosses the wire.

**Evidence against (why it ranks low).** The client's credit-grant logic is per-connection,
self-contained, and simple: it re-grants deterministically off `outstanding`, with no dependency on
any other tile's state, on `overBudgetFlag`, or on any queue elsewhere in the manager. Reading it
end-to-end (`adapterWs.ts:37-141`) surfaces no code path by which one specific stream's credit
grant could silently fail to fire while 42 siblings' did — every stream is an independent
`WebSocket`+closure, so a bug here would be expected to be systemic, not tile-specific. Ranked
above rank 4/5 only because it is a genuine no-timeout wait in the server code
(`adapter_ws.rs:201-213`), not because the client code shows any actual defect.

### Rank 4 — Terminal-frame-loss with delayed teardown

**Code path.** `drive()`'s terminal send explicitly discards its own result: `let _ =
sink.send(Message::Binary(tf.into())).await;` (`adapter_ws.rs:281`). If that send silently failed,
the server still waits up to `PEER_DRAIN_TIMEOUT = 30 s` (`server.rs:96`) for the peer to close,
then **aborts the reader task and returns** (`adapter_ws.rs:299-308`) — which drops the socket.

**Evidence against (why it ranks low).** The client's own `close` listener already treats an
unexplained close as a terminal: *"if (!finished) { finished = true; opts.sink.onTerminal({kind:
'TransportFailed', detail: 'the stream ended without a terminal frame'}); }"* (`adapterWs.ts:143-148`,
quoted verbatim) — which **would** increment `streamsEnded` via `countTileStreamEndedOnce`
(`candidateArmSession.ts:475-480`). A lost terminal frame is therefore bounded by
`PEER_DRAIN_TIMEOUT` (30 s) at the outside, not 204,850 ms — the recorded duration is roughly 7×
that bound. This mechanism cannot explain the observed evidence *unless* something else also
prevents the eventual socket teardown from reaching the client, for which there is no code evidence.
Named because the discarded `Result` (`:281`) is a genuine, if unrelated, gap worth carrying forward.

### Rank 5 — Client-side accounting miss

**Code path.** `TileViewportStreamManager`'s `onTerminal` sink callback
(`tileViewportStreamManager.ts:597-610`) is the *only* path that clears `inFlightStreams` and
`tileState` for a tile, which is what `residencyInstrument.ts`'s `streamsEnded`/in-flight sampler
reads. `countTileStreamEndedOnce` (`candidateArmSession.ts:475-480`) likewise only decrements on a
real `onTerminal` call.

**Evidence against (why it ranks lowest, but is named per the routing's own instruction to be
honest about it).** `queueDepthSampleErrors: 0` (RESULTS.md, quoted in DECISIONS-PENDING entry 40)
proves the **sampler** read the manager's own state faithfully — it does not prove the manager's
state was ever updated by a genuine WS event, because both rest on the same `onTerminal` call being
the single source of truth. Reading `startStream`'s event wiring end-to-end
(`adapterWs.ts:94-155`) surfaces no swallow-without-count path: a thrown `onBatch`/`onTerminal`
callback is caught by `abandonStream` (`:67-92`), which *itself* calls `opts.sink.onTerminal`
before returning — so even a poisoned sink still counts as ended. No code defect was found; this
rank exists to record that the check was made, not because it found anything.

### Ruled out, not ranked

- **Connection-pool exhaustion** (`engine/src/pool.rs:262-326`) — `try_acquire` semantics only,
  never blocks; a fifth concurrent lease attempt returns a typed `ConnectionsExhausted` error
  immediately, which the kernel maps to a terminal frame, not a hang. Also structurally
  unreachable here: `MAX_IN_FLIGHT_TILE_STREAMS = 3` client-side never asks for more than 3
  concurrent engine leases, against a ceiling of 4 (`pool.rs:92`).
- **Ticket TTL expiry / registry race** (`kernel/src/skp.rs:31-92`) — a ticket unredeemed past
  `TICKET_TTL = 30 s` is swept and its slot freed (`skp.rs:110-133`); a subsequent redemption
  attempt fails and the kernel returns a typed `TERM_PRODUCER_FAILED` terminal
  (`server.rs:386-402`), again bounded and typed, not a silent hang.

---

## 2. The discriminating instrumented pass — designed, not run

### What already exists and would be reused

| Instrument | Where it lives | What it already gives |
|---|---|---|
| `ConnectionPool::active_leases()` / `live_connections()` / `idle_connections()` | `engine/src/pool.rs:375-386` | Cheap, unconditional (no `Trace` slot needed), already polled with a deadline loop in this repo's own test harnesses: `kernel/tests/cancel_rescore.rs:764`, `kernel/tests/publish_cancellation.rs:456,460`, `kernel/tests/trace_spans.rs:155,159`. |
| `StreamConnectionRecord` reporter | `kernel/src/lib.rs:242-249,362-380`; wired into `kernel::main`'s CLI binary at `kernel/src/main.rs:134-160`ish | Per-stream `physical_id`/`lease_generation`, emitted on stream drop — proves an `EngineSource` (and therefore its DuckDB connection) actually finished, however it finished. **Not wired into `frontends/shell/src-tauri` today** — `kernel/src/skp.rs:393-396` passes `None` explicitly and says so. |
| Producer-side trace marks/spans (`PRODUCER_STARTED`, `SQL_PREPARED`, `EXECUTE_CALLED`, `EXECUTE_RETURNED`, `FIRST_SOURCE_ROW`, `BATCH_FULL`, `PRODUCER_CANCELLED`, `PRODUCER_FINISHED`) | `engine/src/trace.rs`, marked from `engine/src/stream.rs` (e.g. `:1009,1029,1442,1458,1481,1509,1588,1998-2000,1092`) | Would show exactly where a *traced* stream's producer thread is sitting. **Hard limit: one traced stream per traced run** — `trace.rs:90-97` ("a declared limit … not an accident") and `kernel/CANCELLATION-AND-TRACING.md` §7 ("`trace::CURRENT` is a single slot; a second `start` is refused rather than silently replacing the first"). At `MAX_IN_FLIGHT_TILE_STREAMS = 3` concurrency this cannot cover every candidate tile in a step — see limitation below. |
| Client-side per-tile issue/terminal join | `traceStreamIssued`/`traceViewportQuery` (`tileViewportStreamManager.ts:552-553,616`) + `logSessionEvent("candidate-tile-terminal", …)` persisted to the Rust-side session log (`candidateArmSession.ts:886`) | Already named as the harness-only per-stream join in `ATTRIBUTION-PASS.md` §6 (its own citation, not re-verified independently by this pass beyond confirming `candidateArmSession.ts:886` exists as read here). Gives per-tile wall-clock issue time and, for every tile that *does* terminate, its terminal time — the stalled tile would show an issue line with no matching terminal line, which the current evidence already establishes qualitatively. |

### What would need a small, real, **not-done-here** product-code addition

Named so the design is honest about its own cost, per this project's own "DEV-gated instrument
surface" precedent (`spikes/viewport-residency-1a-diagnosis/README.md` §6: "the project's own
established class, but declare them as such if taken"):

1. **Wire `EngineSourceFactory::with_connection_reports` (or equivalent) into
   `frontends/shell/src-tauri`.** Today only `kernel::main`'s CLI binary consumes
   `StreamConnectionRecord` (`kernel/src/main.rs`); the Tauri app that ran the actual 2026-09-06
   trial passes `None` (`kernel/src/skp.rs:402`). Without this, per-stream lease facts for *this
   trial's own binary* are unavailable — the pool poll below is the cheaper alternative that needs
   no such wiring.
2. **A periodic (e.g. 1 s) timestamped poll of `Dataset::connections().active_leases()` /
   `live_connections()`, logged to the existing session log.** Cheapest, most discriminating single
   addition: does not touch the single-slot `Trace`, costs one lock acquisition per tick, and
   directly answers "is a Stream-class connection still held" for the whole stall duration.

### What one completing run would log, and what each signature convicts

Given the pool-poll addition above (the only one this design treats as load-bearing; the others are
optional depth):

- **Lease count for the stalled tile's connection never drops, for the whole stall, and CPU
  attributable to the process stays non-idle** → convicts **Rank 1 (producer-query-hang)**. The
  per-tile session-log line for that tile shows an issue timestamp and no terminal line, matching
  what is already known; the new fact is that the *connection* is still alive and (if a traced
  stream happened to be this one) `EXECUTE_RETURNED` was reached with no further `BATCH_FULL` marks.
- **Lease count drops back to its pre-stall baseline (the connection is released) while the client's
  in-flight counter still reads 1 and no terminal frame or close ever reaches the client** →
  convicts **Rank 2, 3, or 4** (something downstream of the engine) and rules out Rank 1. Whether it
  is 2, 3, or 4 specifically is **not** further separable from Rust-side instrumentation alone if
  the cause is Rank 2 (ADR-012's own words: "WebView2's opaque WebSocket receive path") — this is a
  genuine, named ceiling on what a producer/transport-side pass can prove, not an oversight.
- **`StreamConnectionRecord` for the stalled tile is emitted** (if wired per item 1 above) **yet the
  client never received anything** → confirms the engine genuinely finished; narrows to the
  `drive()` loop's own terminal-send (`adapter_ws.rs:281`) or the browser's receive path — i.e.
  rules out Rank 1 with a stronger fact than the lease-drop alone (a lease can drop on an *error*
  path too; a `StreamConnectionRecord` proves the stream reached `Drop`, i.e. genuinely ended).
- **The cheapest instrument of all, requiring no code change whatsoever: simply let the stalled step
  run far past the watchdog's 204,850 ms cutoff (an hour, say) and see if it ever produces a
  terminal.** If it eventually does, that alone is strong evidence for Rank 1 (a genuinely slow but
  live scan) over Rank 2/3/4, none of which have any code-visible reason to resolve only after an
  arbitrarily long wait with no intervening event.

### Run preconditions

- **Disk:** healthy, matching the 2026-09-06 re-run's own established precedent (42.3 GB free after
  freeing 31 GB) — RESULTS.md's own disk-starvation finding (10.6 GB free) is a *different*,
  already-diagnosed failure mode and must not be re-entered.
- **Warm target:** reuse the main checkout's `src-tauri/target` via `CARGO_TARGET_DIR`, as the
  2026-09-05/06 trials did.
- **If run unattended, reported-only** (this pass's every proposed log line is a reported
  quantity, never a felt verdict, so it qualifies): the full rustdesk-guard protocol per the
  2026-09-04 amendment to 24(g) — arm both restore triggers *before* the kill and verify both live
  (`arm-rustdesk-guard.ps1`'s own `{"armed":true,...}`), verify RustDesk stopped and absent, run
  `check-display-session.ps1` before the trial and invalidate the cell if it does not report
  `ok:true`, touch the heartbeat file throughout, call `disarm-rustdesk-guard.ps1` on completion,
  and record the exact attest string `"unattended, RustDesk stopped and verified absent,
  display-awake verified"` on the cell. If the "let it run an hour" extension above is taken, the
  hard-time-bound scheduled-task backstop's own window must be set at least that long, or the
  backstop would restore RustDesk (harmlessly) mid-measurement without invalidating the run, but the
  operator should not be surprised by it.
- **Not eligible for unattended running:** any step of this pass that would require a felt
  judgment (e.g., watching the canvas for visible thrash) — none is currently proposed, but if one
  is added later it reverts to human-present per the standing 24(g) split.

---

## 3. The LOD-relevance paragraph

NEXT-CUT.md's LOD section names two producer-side candidates, **P1** (server-side aggregation on
`viewport_query`, an SKP change) and **P2** (import-time overview tiers). Both are read from
`NEXT-CUT.md`'s own text (paraphrased where noted).

**Against Rank 1 (unindexed linear scan), the mechanism this pass ranks most likely:**

- **P1 most likely INHERITS it unchanged for base-resolution queries, and may STRESS IT HARDER at
  overview zooms — code-grounded inference, not a measurement.** P1 as scoped computes a
  reduced/aggregated result, but nothing in `NEXT-CUT.md`'s own P1 text pairs it with the spatial
  index that `stream.rs`'s planner comment and `docs/07`'s own open gate both name as a *separate*,
  undesigned item ("the transport bake-off and server-side spatial indexing… named undesigned in
  the spike's Outcome" — `CLAUDE.md`'s own framing of that gate). Without an index, aggregating a
  result still requires scanning the same candidate rows first; an overview-zoom query's bbox
  typically covers *more* of the file than a fine-zoom candidate-arm tile does, so the scan P1 must
  run before it can aggregate is plausibly larger, not smaller, at exactly the zoom range P1
  targets. This is architectural inference from `stream.rs`'s own comments, stated at that strength
  and no higher.
- **P2 REPLACES it, but only for the zoom population it targets — and the entry-40 hang did not
  occur in that population.** Once an overview tier is built, a runtime read against it (per
  `NEXT-CUT.md`'s own description, "reduced levels built once at import and read like any other
  layer") no longer scans the 5 GB file at all for overview-scale queries — a direct replacement of
  Rank 1's mechanism for those queries. But the 2026-09-06 trial's stalled stream was recorded under
  the cell label `candidate/fine/cold` (RESULTS.md) — the candidate arm's own **fine**-resolution
  tiling, the base-resolution read path P2 does not touch. **P2 would not have prevented or fixed
  the specific hang recorded in entry 40**; it addresses a different query population entirely. This
  is stated at full confidence because it follows directly from P2's own declared scope, not from
  any measurement.

**Against Rank 2 (opaque WebView2 concurrency stall):** neither P1 nor P2 touches the wire protocol,
the WebSocket adapter, or the per-tile concurrency pattern (`MAX_IN_FLIGHT_TILE_STREAMS`) at all —
both are INHERITED unchanged, code-grounded. Whether fewer, larger, aggregated tiles (either
candidate, if realized) would lower concurrent-stream *count* and thereby reduce exposure to an
anomaly ADR-012 ties to concurrent streams is plausible but is **conjecture, not established** by
anything read in this pass — no code or measurement here says how tile count scales with either
design.

---

## 4. What this spike did not do

- **No run.** No 5 GB trial, no harness invocation, no CDP session, nothing that touches
  RustDesk, the disk, or the machine's measured state.
- **No repro.** The stalled stream from the 2026-09-06 trial was not reproduced or re-triggered.
- **No product code touched.** Every file read in this investigation is unmodified;
  `git status --porcelain` for this piece shows only the new file under
  `spikes/entry40-producer-hang-diagnosis/`.
- **No docs modified** outside this new file.
- **Cost of the empirical pass, one line:** a completing run costs roughly the wall-clock of the
  2026-09-06 trial itself (the stalled step alone already ran 204,850 ms) plus, if the
  "let it run past the watchdog" discriminator is taken, an unbounded additional wait with no
  guaranteed upper bound — the one instrument in this design that is free of code but not free of
  time.

## 5. The pass, run — 2026-09-07, one cell (PASS-PREREGISTRATION.md §3 + Amendments 1–4): reading **(D)**, a null result for the hang; the instrument itself healthy

**Run facts (runner log `entry40-cell.log`, evidence
`evidence/residency-harness-instrument-on-1788808681244.json`, session log
`evidence/session-1788808612.log`; times UTC).** Launched 19:14:52Z on the human's "window open"
(Amendment 4). Fixture sha256 `5ae955c5…1788` verified before and after the run
(`fixtureHashMatchedAcrossRun: true`). Session unlocked before arming; guard armed 19:15:27Z
(backstop 23:45:25+02:00, watchdog pid 7660); RustDesk `Stopped`, 0 processes, 19:15:32Z; display
check `{"ok":true,"sessionUnlocked":true,"displayAwake":true,"monitorTimeoutAc":0}` 19:15:37Z;
heartbeat every 10 s; harness start 19:15:38Z (launch instant 1788808538, captured pre-spawn —
PR #26). Attest string recorded on the cell verbatim: `unattended, RustDesk stopped and verified
absent, display-awake verified`. Cell: candidate arm, `fine`, cold, `vite-dev` build @ `4f133df`
(main: PRs #24, #26, #28 in), `--per-stream-trace`, `--per-step-watchdog-ms 3600000` (recorded
top-level; the cell is therefore never scored, Amendment 1 §6), `launchedFresh: true`. Pre-flight
`--require-pool-poll` **PASSED** (session log resolved from the app's log directory, threshold
1788808559, 349 candidates listed). Harness exit 0 at 19:18:01Z after 2.4 min; disarm 19:18:04Z
(`{"disarmed":true,"rustdeskService":"Running"}`); backstop unregistered, watchdog gone, monitor
timeout restored (0x258). `invalidated: false`; **11 steps, all `status: measured`, all
`settled: true`, `inFlightAtSettle: 0` on every step.**

**What the instrument logged.** 171 `producer-pool-poll` lines over 171 s, **zero gaps > 1.5 s**
between ticks (Amendment 1 §4: nothing unobserved). Histogram: `active=0` ×150, `active=1` ×2,
`active=2` ×2, `active=3` ×17; `live` reached 3 (the pool grew from 1 to 3 connections during the
first pan and stayed at 3); **first tick** `active=0 live=1 idle=1`, **last tick** `active=0 live=3
idle=3` — every lease returned; no `producer-pool-poll stopped reason=` line (the poll ran to the
dataset's close). 167 `candidate-tile-terminal` lines, **all `Completed`**, spanning 30 s
(19:17:03Z–19:17:33Z); 1 `candidate-grid-frame-established`; 1 `candidate-untiled-terminal`
(`Completed`); 0 truncations, 0 evictions of the first look, 0 refusals.

**Per-step, as the harness recorded it (durations are observed wall times, never scored):**
`fit` 651 ms (3 streams issued); `pan-north` 1,902 ms (12 issued / 15 ended); **`pan-east`
16,304 ms, 65 issued / 65 ended, resident 1,999,902 vertices / 19,054 features at end, first pixel
87 ms** — the step that hung on 2026-09-06; `pan-south` 5,053 ms (84/84); `pan-west` 3,187 ms
(3/3); `pan-northeast` 2,103 ms; `zoom-to-layer` 1,386 ms (3 issued); `zoom-in-1/2/3` 712 / 496 /
491 ms; `zoom-out-1` 496 ms. The per-stream join (`segments`) carries one segment per step, and its
three timings are `null` with reason `no-batch` or `no-query` on every step except where the
step's own first batch fell inside the arm window — the join the README §2 hoped for was **not
populated** in this run beyond that; reported as logged, not interpreted.

**Reading, per §4 — (D).** *"no stall recurs in this run → the pass is a null result, reported as
such: one non-recurrence does not refute the 2026-09-06 observation; the instrument stays in place
for the next 5 GB run."* Neither (A) nor (B) nor (C) can be read: there was no stalled stream to
read them against. Ranks 1–5 stand exactly as §1 ranked them, unconvicted and unrefuted. The
structural answer (`ATTRIBUTION-PASS.md` §7) is unchanged.

**What differs from the 2026-09-06 run, declared so nobody infers a cause.** That run (RESULTS.md
"Refinement, 2026-09-06") hung at `pan-east` after 222 batches — 43 streams issued / 42 ended,
in-flight stuck at 1, 204,850 ms until the settle watchdog refused — on the 1b build before the
close-out fixes, under the admit→evict→re-request thrash the human later saw at L6 (entry 44), with
no per-stream trace and the default per-step watchdog. This run: the post-#24/#28 build (F1
geometric protection; the first look protected while in view — **0 evictions**), per-stream trace
on, 60-min per-step bound, and `pan-east` completing 65/65 in 16.3 s. Whether the client-side
eviction fixes removed the *conditions* of the hang (far less stream churn: the 2026-09-06 run's
re-request storm no longer exists) or the hang is simply intermittent is **not determinable from
one cell** — a conjecture, labelled. The pool instrument's own verdict is narrow and positive: over
this run the producer pool never leaked a lease and never sat at capacity longer than 17 s
(`active=3` ×17 ticks, during `pan-east`/`pan-south`).

**Consequences.** Per Amendment 4 the pass ENDS with this run: no further cell is authorized by this
file. The instrument stays compiled into dev/measure builds (PR #25) and the harness pre-flight
stays (PR #26), so any later 5 GB run reads the pool for free. The LOD cut's P1 risk (README §3)
keeps its status: a structural argument with one unreproduced observation behind it, not a
measured hang. No perf claim is made in either direction (§5).
