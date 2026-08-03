# Data-plane transport bake-off — preregistration

> **What this directory is.** Decision evidence for **ADR-012** (data-plane transport choice). It is
> *not* the `protocol` module. It will be superseded by the module's real transport implementation
> and may be deleted once ADR-012 is decided. Nothing outside this directory may depend on it.
>
> **This interface is scaffolding for a transport measurement. It is not SKP, and it constrains SKP
> only to the extent ADR-012 explicitly decides.**

**Status of this document:** written and committed **before** the harness exists, so the targets
cannot be quietly reinterpreted to fit whatever comes out. This is the discipline the ADR-003 spike
established for M3 ("Recorded here ahead of the harness…") and it is the reason any number below is
admissible at all. Git history is the proof: if the harness commit precedes this one, this document
is void.

---

## 0. Why this exists, and where it sits

`docs/07` names the transport bake-off as an open gate for the Prototype hero slice — a real
streaming/backpressured binary transport for ADR-004's data-plane clause — and the ADR-003 spike's
Outcome lists it under "What remains undesigned — post-spike engine work". ADR-004's 2026-08-03
amendment 2 disqualified the Tauri custom protocol as the production data plane (no producer-side
cancellation path) and named the replacement candidates, deferring the choice: *"the final choice is
made when the engine module is built, measured against the spike M5 baseline."* This harness is that
measurement.

**Directory placement, and a docs wording note.** This lives in `protocol/` because `docs/02`'s
module map assigns `protocol/` = "SKP control/data plane + MCP adapter (see 04, 10)", and a
data-plane transport is literally that module's subject; `docs/02` further warns that collapsing
`protocol/` into `kernel/` is "how the SKP surface gets absorbed into the kernel and the ADR-004
control/data-plane split stops being structural". `docs/07` describes this work as
"engine/kernel-module work, not renderer work" — that sentence is *negative* scoping (not renderer,
not a spike), it predates `docs/02`'s Directory column, and it covers two items at once: it is
precise for the other one (server-side spatial indexing → `engine/`, per 05) and loose for this one.
Both readings agree this is not renderer work and not a spike. A `docs/07` wording correction is
**proposed separately for human approval**, not folded into this change.

**Scaffolded per slice, not up front** (`docs/02`): this change creates `protocol/` and nothing else.
No `kernel/`, `engine/`, `renderer/`, or `frontends/`. No `protocol/src/`, no `protocol` crate, no
root workspace manifest — the module's real surface stays unwritten until someone designs it.

---

## 1. The decision this exists to make

**Which wire transport is adopted for the SKP data plane on the Windows/WebView2 reference profile.**

- **Candidate A — binary WebSocket.** Producer→consumer Arrow IPC record batches as binary WS
  frames; consumer→producer credit and cancel as binary control frames on the same socket.
- **Candidate B — loopback HTTP streaming response**, consumed through `fetch` + `ReadableStream`.
  Backpressure is TCP-native (consumer stops reading → window closes → producer's write pends);
  cancellation is `AbortController` → connection close → producer's next write fails.

**What selects A:** A is eligible, and either B is ineligible, or A wins the throughput comparison
outside the tie-break band, or the tie-break resolves to A.

**What selects B:** symmetric.

**What selects neither — pre-declared so the design cannot guarantee a winner:** if **both**
candidates fail one or more hard requirements (§3), ADR-012 records **no candidate selected**, states
which requirement each failed, and the data plane remains undecided. This is a real possible outcome
of this bake-off, not a rhetorical hedge. A third path — interruptible Tauri IPC channels, the third
class ADR-004 amendment 2 names — is **out of scope here and deliberately unmeasured** (see §11);
ADR-012 must record that exclusion so its conclusion does not claim more than was measured.

**Eligibility precedes speed.** The hard requirements in §3 are pass/fail gates evaluated *before*
any throughput comparison. **A faster candidate that fails any hard requirement cannot win**, and its
throughput figures are reported as context only, never as a comparison.

---

## 2. Reference hardware and software profile

Every number is a **Windows-only** result. Nothing here transfers to macOS/WKWebView or
Linux/WebKitGTK — the same scope limit `docs/07` already places on ADR-003's acceptance.

| Item | Value |
|---|---|
| OS | Windows 10 Pro 22H2, build 19045 |
| Webview | WebView2 / Edge runtime — exact build recorded per run |
| GPU | recorded per run, even though this workload is not expected to be GPU-bound (M4's lesson: "irrelevant" is a finding, not an assumption) |
| Rust | `rustc 1.97.1` / `cargo 1.97.1`, MSVC toolchain |
| Node | v24.18.1 |
| Build profile | **`--release` only.** A debug-build measurement is inadmissible (§8). |

---

## 3. Hard requirements — eligibility gates

Each is a pass/fail predicate with a stated **observation point**. Failing any one makes a candidate
**ineligible**, regardless of throughput.

### H1 — Correctness of the delivered payload
- **Assertion:** the consumer reconstructs exactly 10,000,000 rows; the SHA-256 of the concatenated
  decoded column bytes is **identical across both adapters and across all runs**; every batch's
  schema carries the CRS tag (§4); `id` values are exactly `0..=9,999,999` with no gaps or repeats.
- **Observed:** consumer side, plus a producer-side hash of what was serialized.
- **Failure looks like:** any hash mismatch, short/long row count, missing CRS metadata on any batch.

### H2 — Producer-visible cancellation
- **Assertion:** on client abort, the **producer** observes cancellation *through its own data
  transport* (not via a side channel), within **< 100 ms** (`docs/08`: cancellation acknowledged
  < 100 ms, any operation; ADR-004 amendment 2 makes producer visibility a hard transport
  requirement), **and stops producing**: at most **1** further batch may be generated after the
  cancel is observed (the one already in construction).
- **Observed:** producer side, on the producer's own monotonic clock. A client-side
  abort→promise-rejection latency is **explicitly not** an acceptable measurement of this — that is
  precisely the mistake M5 made and flagged ("Clears the stated budget by 2-3 orders of magnitude,
  but the number is not the finding"). Cross-process clock relation and its error bound: §6.
- **Failure looks like:** the producer never observes the cancel; observes it ≥ 100 ms after abort;
  or keeps generating batches afterwards.
- **Anti-flattery constraint:** the producer must do **real per-batch work** (seeded coordinate
  generation + Arrow serialization, §4), not spin in a tight write loop. The measured per-batch
  generation cost is reported alongside, because it is a **lower bound** on how fast a
  write-boundary-detected cancellation can possibly be seen.

### H3 — Bounded-memory backpressure
- **Assertion:** with the consumer deliberately paused for **3,000 ms** mid-stream (after batch 20),
  producer-resident payload bytes stay **≤ 5 × batch bytes** (the declared credit ceiling, §5) at
  every 50 ms sample, and the producer process's private bytes do not grow monotonically during the
  pause.
- **Observed:** producer side — an explicit accounted counter of retained payload bytes, plus the
  Windows process counter named in §6.
- **Failure looks like:** unbounded growth during the pause (the producer racing ahead into a queue),
  or the pause not actually taking effect (which invalidates the run rather than passing it).

### H4 — Security posture (`docs/09`)
- **Assertions, each individually checked:** the listener binds **127.0.0.1 only** (asserted not
  `0.0.0.0` / not `::`); the port is **ephemeral** (OS-assigned, port 0); an unauthenticated
  connection is **rejected**; a connection with a **foreign `Origin`** is rejected; a connection with
  `Origin: null` is rejected **explicitly** (not accepted by omission — the specific failure mode
  the architect flagged for WebView2); the session token is compared in **constant time**; the token
  appears **nowhere** in the report JSON, stdout, or any log (redacted as `<redacted>`).
- **Observed:** negative tests run against the live server, plus a byte-scan of every produced
  artifact for the token.
- **Failure looks like:** any negative test succeeding in connecting, or any token byte found in an
  artifact.
- **Note:** a listening TCP socket is a real change in local attack surface. `docs/09`'s "To be
  specified" does not cover it, so ADR-012 states the threat model.

### H5 — JSON-free data path (ADR-004; `docs/10`)
- **Assertion:** **zero** JSON bytes traverse the data channel in either direction. Data frames are
  Arrow IPC; control frames on the data channel (credit, cancel) are **fixed-layout binary**, not
  JSON. Asserted by byte-level inspection of every frame, counted and reported as an explicit `0`.
- **Observed:** both sides.
- **Failure looks like:** any nonzero count. Interleaving JSON progress/metadata on the data channel
  and still reporting "JSON-free" is the specific dishonesty this gate exists to prevent.

### H6 — No transport leakage into the semantic API
- **Assertion (falsifiable, and recorded as a checked outcome, not a design claim):** switching
  A→B changes **exactly one construction site** and **zero** lines of producer operation code or
  consumer semantic code. Additionally, an automated scan asserts that no adapter-specific token
  (`socket`, `websocket`, `ws`, `http`, `url`, `header`, `status`, `fetch`, `Response`, `port`,
  `opcode`, `close code`) is reachable from the transport-neutral interface or from semantic-layer
  code.
- **Observed:** repository scan + diff inspection, recorded in the results table.
- **Failure looks like:** an error enum shaped `Http(u16) | WsClose(u16)`; an interface method
  meaning "pause the socket"; ids that embed a URL path segment or subprotocol string.

### H7 — Progress and terminal error propagation
- **Assertion:** progress is reported and monotonically non-decreasing; every stream ends in
  **exactly one** terminal outcome from the declared taxonomy `Completed | Cancelled | ProducerFailed
  | TransportFailed | DecodeFailed`; and for each of the three injected failure points —
  **cancel during production**, **cancel during transfer**, **cancel during decode** — the outcome is
  the declared one, is surfaced, and **no partially-rendered view is presented as complete**
  (ADR-010 rule 5, third bullet: staleness is signalled, never silently served — the live analogue
  here being a cancelled/errored stream leaving a partial render).
- **Observed:** both sides; the consumer's rendered state is checked for an explicit
  incomplete/cancelled signal.
- **Failure looks like:** a silent stall; two terminal events; a terminal event that never surfaces;
  or a partial render indistinguishable from a complete one.

---

## 4. The fixed workload

**Identical for both adapters, by construction:** one shared seeded generator, one shared Arrow
serializer, one shared consumer. Identity is *enforced*, not assumed — H1's SHA-256 must match across
adapters, and the run is invalid if it does not.

| Parameter | Value |
|---|---|
| Rows, total | **10,000,000** |
| Batch size | **100,000 rows** |
| Batch count | **100** |
| Column bytes per row | **24** (8 + 8 + 8) |
| Column bytes, total | **240,000,000** |
| Wire bytes, total | Arrow IPC stream framing included; **exact byte count measured and recorded per run**, and asserted **identical** across adapters and runs |
| PRNG | ChaCha8, fixed seed `0x5EED_2056_0000_0001` |
| Coordinate domain | EPSG:2056 (LV95): E ∈ [2,485,000, 2,834,000], N ∈ [1,075,000, 1,296,000], uniform |

**Schema** (Arrow, all fields non-nullable):

| Field | Type | Purpose |
|---|---|---|
| `id` | `UInt64` | stable feature identity — ADR-010 rule 2's id indirection requires it; `docs/11` requires stable per-feature identity |
| `e` | `Float64` | easting, authoritative project-CRS coordinate |
| `n` | `Float64` | northing, authoritative project-CRS coordinate |

**Schema metadata — ADR-010 rule 1, the tag-on-envelope clause.** Rule 1 requires that a bulk buffer
whose envelope does not name its frame is in violation, and that the tag rides on *the batch, stream,
or schema envelope*, never on each coordinate (per-value tagging would be both a `docs/08` budget
failure and a copy multiplier, contradicting ADR-004). This harness therefore carries, in the Arrow
schema metadata of every batch:

```
crs         = "EPSG:2056"
frame       = "authoritative-project-crs"
axis_order  = "easting,northing"
```

`axis_order` is explicit because `docs/05` names the EPSG:4326 lat/lon trap as a thing handled once,
centrally, correctly — an untagged axis convention is the same class of silent error.

**No reprojection happens anywhere in this harness** (`docs/05`): bytes move in the source CRS only,
analytically untouched. The consumer's f64→f32 offset subtraction is a float-precision translation
for GPU upload, not a reprojection — the same distinction ADR-011 draws for per-tile origins.

**Producer schedule.** Batches are generated on demand as credit allows (§5). Generation is real
work — seeded coordinate synthesis plus Arrow serialization — and its per-batch cost is measured and
reported separately, because H2's cancellation latency is bounded below by it.

**Declared ceilings** (ADR-010 rule 6's *discipline* — declared, not discovered; the rule itself is
non-binding here since nothing is pickable):

| Ceiling | Value |
|---|---|
| Max single frame / chunk | 4 MiB |
| Max in-flight (uncredited) batches | 4 |
| Producer-resident payload bound | ≤ 5 × batch bytes (4 in flight + 1 in construction) |

---

## 5. The transport-neutral interface, and what it may not become

**Permitted vocabulary:** operation, stream, batch, cancel, progress, terminal error, demand/credit.
**Forbidden vocabulary anywhere in the interface:** socket, websocket, URL, path, HTTP status,
header, fetch, `Response`, port, close code, opcode.

**Identifiers.** Operation and stream ids are **opaque strings**, harness-allocated,
adapter-independent, with identical shape and value-space across both adapters — reading two logs,
you cannot tell which adapter produced which id. They are never a URL path segment, a WS subprotocol
string, or a request-id header. They are **strings, never JSON numbers**: ADR-004 amendment 1's
1-ULP finding makes a JSON number the wrong carrier for anything requiring exact identity, and using
strings sidesteps that class entirely rather than mitigating it. Byte counters in progress messages
are likewise integers or strings, never JSON floats.

**Backpressure** is expressed in the interface as demand/credit, and implemented per adapter:
Candidate A grants credit as explicit binary control frames; Candidate B grants it implicitly by not
reading, letting the TCP window close. That the mechanisms differ *is the thing being compared*.

**Cancellation** is expressed in the interface as `cancel(stream_id)`. Semantic-layer code never
touches an `AbortController` or a socket directly.

**Errors** use one taxonomy — `Cancelled | ProducerFailed | TransportFailed | DecodeFailed` — with
adapter specifics confined to an opaque `detail` string.

**The SKP v0 line, stated so it cannot be crossed by accident.** In scope: exactly one operation
("produce N synthetic batches"), a batch stream, cancel, progress, terminal error, credit-based
demand. Unversioned, single-consumer, no spec document. **Out of scope, because they would be
authoring SKP v0** (`docs/10`'s "The specification must cover" checklist): a command catalog beyond
that one operation, version negotiation, capability discovery, handle lifecycle, idempotency keys,
schema evolution, a generalized auth model, a conformance suite — and the token `skp` on any type,
file, crate, or wire field.

---

## 6. Metric definitions — exact clocks, both endpoints

| Metric | Definition |
|---|---|
| **Time to first batch** | Consumer `performance.now()` from *just before the operation is started* to *the moment the first complete Arrow batch is decoded*. |
| **Time to first meaningful pixels** | Consumer `performance.now()` from the same start instant to the **completion of the first `requestAnimationFrame` callback that has drawn the first decoded batch** — i.e. **first-batch-rendered**, explicitly **not** full-payload-rendered. |
| **Time to full-payload render** | Same clock, to the rAF completion that has drawn all 100 batches. **Reported separately and always alongside the previous row**, because M1's baseline (2178–2243 ms) measured query-start → first `onAfterRender` on a single *unchunked* 162.5 MB fetch. Quoting first-batch-rendered against that number without both figures present would manufacture a fake improvement. |
| **Throughput, per-batch (p50/p95)** | Sample = `batch_wire_bytes ÷ (t_arrival[i] − t_arrival[i−1])`, i ∈ 2..100 → 99 samples/run, pooled across runs. p50/p95 by sorting and indexing (the same method every spike figure used). **This is the streaming-relevant figure.** |
| **Throughput, whole-transfer** | `total_wire_bytes ÷ (t_last_byte − t_operation_start)`, 1 sample/run. |
| **Peak producer memory** | Windows `GetProcessMemoryInfo` → `PROCESS_MEMORY_COUNTERS_EX.PrivateUsage` (private commit), sampled every 50 ms for the whole run; peak and the value during the H3 pause both reported. `PeakWorkingSetSize` recorded alongside. |
| **Peak consumer memory** | Two figures, both reported, because neither alone is trustworthy: (a) an **accounted** counter of payload bytes retained by harness code, which is what the bounded-memory claim actually rests on; (b) `performance.memory.usedJSHeapSize` sampled every 50 ms, reported as an approximation with its limitation stated (it does not cleanly account for `ArrayBuffer`s and is WebView2/Chromium-specific). WebView2 child-process totals are **not** summed — declared here as a known gap, not discovered later. |
| **Copy count** | The M5 seven-stage model restated for this harness (§7), each stage marked **live-asserted** or **source-read**. |
| **Producer-side cancellation ack** | `t_producer_observes_cancel − t_client_calls_abort`. Client instant on `performance.now()`; producer instant on `std::time::Instant`. **Cross-process clock relation:** at session start, 21 round-trip probes between consumer and producer; offset estimated from the probe with minimum RTT, error bound declared as ±RTT_min/2 and **recorded in the report**. If the bound exceeds 10 ms (10 % of the 100 ms gate) the run is **invalid**, not merely noisy. Reported alongside: producer-side batches generated after cancel observed (H2 requires ≤ 1) and the measured per-batch generation cost. |
| **Backpressure boundedness** | Producer-resident payload bytes at 50 ms samples across a 3,000 ms consumer pause starting after batch 20; **bound = 5 × batch bytes**, declared before the run. |

---

## 7. Copy accounting — the M5 model, restated for this harness

M5's baseline was **4 avoidable application-level copies + 1 physically-required GPU upload** on
P1's hot path. The same seven stages, re-walked here:

| # | Stage | Expectation | How established |
|---|---|---|---|
| 1 | Rust generation into the Arrow array's buffer | 1 copy | source-read |
| 2 | Arrow IPC serialization into the frame buffer | 1 copy | source-read |
| 3 | Adapter handoff (WS frame payload / HTTP body chunk) | **per-adapter — this is a discriminating stage** | source-read, reported per candidate |
| 4 | OS/webview → JS `ArrayBuffer` | 1 copy, inherent to the process boundary | source-read |
| 5 | JS Arrow IPC parse | **0 copies — live-asserted per run** by buffer-identity check, exactly as M5's `verifyNoCopyAtArrowParse` did | **live** |
| 6 | f64 → f32 recenter before GPU upload | 1 copy, unavoidable (WebGL2 has no f64 attributes) | source-read |
| 7 | GPU CPU-RAM → VRAM upload | 1 copy, physically required — **not** counted as "avoidable" | source-read |

**"Copy-minimized", never "zero-copy"** (ADR-004; ADR-001's "zero-copy" claim is superseded).
Whether this harness *reduces* the M5 count is a result, not an assumption — and if it does not, that
is reported as such.

**Baseline comparability, stated up front.** M5's ~105–112 MB/s measured `fetch()` + `arrayBuffer()`
only — the Rust→IPC→JS handoff on a single unchunked 162,500,488-byte response — explicitly excluding
the Arrow parse and the f32/GPU stages. This harness's whole-transfer throughput window differs
(streamed, 100 batches, decode interleaved). The comparison is therefore **indicative, not
like-for-like**, and ADR-012 must say so rather than quoting the numbers side by side as equals.

---

## 8. Validity gate and inadmissibility

Every run emits `valid: boolean` and `invalidReasons: string[]`, in the M2/M3/M4 form. **A run that
trips the gate is reported as invalid, never silently dropped or quietly re-run.**

**Invalidators:**
- payload SHA-256 mismatch across runs or adapters; unexpected row count or schema on any batch
- any JSON byte observed on the data path (H5's counter non-zero)
- CRS tag absent or mismatched on any batch (ADR-010 rule 1)
- the producer never observed the cancel, or the consumer pause was not actually applied
- clock-offset error bound > 10 ms
- watchdog fired, or a heartbeat gap exceeded its declared interval
- any report written outside `std::env::temp_dir()` or the harness's own output directory — M5 lost
  several runs to report writes landing in a file-watched source tree and silently re-triggering the
  entire harness 2–3× per invocation
- any adapter-specific symbol reachable from the semantic layer (H6)
- fewer than the declared sample count for any metric

**Inadmissible measurements** (not "worse data" — not data):
- a debug build measured as release
- a run under a dev server with HMR active
- unequal instrumentation between adapters
- different GPU, power profile, or machine state between adapters without re-running **both**
- fewer than the declared runs

M2's precedent is why this section is explicit: before its validity gate existed, a *failed* capture
produced `NaN` and could score **better** than a working run.

---

## 9. Runs and sample counts — declared before measuring

| Configuration | Runs |
|---|---|
| Full-payload streaming transfer, per adapter | **3** |
| Cancellation trials, per adapter per run | **10** (abort fired at a fixed 400 ms into the stream, matching M5's protocol) |
| Backpressure pause, per adapter per run | **1** (3,000 ms after batch 20) |
| Error-behaviour injections, per adapter | **3** — one each at production / transfer / decode |
| Security negative tests, per adapter | **4** — no token, wrong token, foreign origin, `null` origin |

All runs are reported, including invalid ones. p50/p95 are computed over pooled samples with `n`
stated.

---

## 10. Resilience — ADR-010 rule 7, and its declared recovery policy

Rule 7 requires global `error` and `unhandledrejection` handlers **unconditionally**, and requires
every long-lived session to **declare a recovery policy**.

**Declared recovery policy for this harness: `none — fail visibly, mark the run invalid, and
terminate with a surfaced error.`** That is a valid declaration under rule 7, and it is the right one
for a benchmark: silently recovering from a fault would corrupt the comparison. Because the policy is
`none`, heartbeat and watchdog are still instrumented — not to recover, but so a stall is
*detectable* and lands as `invalid` rather than as a fast-looking number.

**BEGIN/END checkpoints.** The harness brackets each phase (generate / serialize / send / receive /
decode / render) so that "the last BEGIN with no matching END names the culprit". This is what makes
cancel-during-production, cancel-during-transfer, and cancel-during-decode separable in the results
rather than one undifferentiated stall. It is the property M4's forensics found load-bearing after an
uncaught `TypeError` presented as a hardware freeze for an entire investigation cycle.

---

## 11. Pre-declared non-comparisons and scope limits

Stated now so they cannot be read into the results later:

- **Windows/WebView2 only.** Nothing here says anything about macOS/WKWebView or Linux/WebKitGTK.
- **No third candidate.** ADR-004 amendment 2 names three transport classes; interruptible Tauri IPC
  channels are **not measured here**. Scope is bounded deliberately, and ADR-012 records the
  exclusion — a bounded scope is legitimate, a silent omission is not.
- **Synthetic, structurally regular payload.** Uniform-random points with a fixed seed. Real
  irregular cadastral data is not exercised, exactly as the spike's own scope-limits section states
  for P1/P2.
- **No DuckDB, no GeoParquet, no bbox filtering, no spatial indexing.** The moment the producer reads
  GeoParquet it becomes `engine/` work (05) and leaves this directory. Server-side spatial indexing
  is `docs/07`'s *other* open gate and is not touched here.
- **No picking, no editing, no unprojection.** ADR-010 rules 2, 4 and 6 are non-binding on this
  harness and it stays that way; adding picking to demonstrate "first pixels" would pull them in.
- **Single stream, single consumer.** Concurrent streams are untested.
- **No remote/WAN path.** Loopback only.
- **ADR-011 is cited nowhere** — it binds nothing, is not architect-blockable, and may not be cited
  as settled design. The consumer keeps the single-origin offset model the spike actually measured.

---

## 12. Tie-break — declared before measuring

If both candidates are **eligible** and their per-batch throughput p50 figures are within **10 %** of
each other, throughput does not decide. The tie-break, in order:

1. **Fewer copies** on the end-to-end path (§7 stage 3 is the discriminating stage).
2. **Simpler cancellation semantics** — fewer moving parts between client abort and producer
   observation, and a smaller gap between the two.
3. **Smaller security surface** — fewer endpoints, fewer authentication paths, less state.

Without this rule declared in advance, a 3 % margin writes the ADR.

---

## 13. Results

*Empty by construction — this document is committed before the harness exists. The tester agent fills
this section from its own independent execution; measurements recorded here by any other route are
inadmissible.*
