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

> **Amendment to H3 (2026-08-03, during implementation — unit correction, and the reasoning behind
> it corrected in public).** The bound was computed as `5 × ROWS_PER_BATCH × COLUMN_BYTES_PER_ROW`
> = 12,000,000 B, but the resident counter accumulates **serialized Arrow IPC** bytes, not column
> bytes. Comparing the two is an apples-to-oranges comparison that happened to pass. The bound is
> now derived from an actual serialized batch measured at startup (deterministic for the fixed
> workload and seed, so still declared before the run): `5 × 2,438,344` = **12,191,720 B**, a
> **1.6 % increase** in the declared ceiling.
>
> **Why this is not a post-hoc loosening, stated because it would be easy to do that here and call
> it a unit fix.** I initially believed a correct producer would report FAIL against the old number.
> The tester falsified that from the data: measured maximum producer-resident payload was
> **9,753,376 B** (= 4 × 2,438,344) held flat across the whole 3,000 ms pause, in all four
> candidate×invocation pairs — because `tx.reserve()` precedes generation, so the "+1 in
> construction" the 5× ceiling allows for is never actually counted. The bound is slack in **either**
> unit, the measured margin is 18.7 %, and **no verdict turns on this change**. It is corrected so
> the stated bound means what it says, not to rescue a result.

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

> **Amendment to H4 (2026-08-03, during implementation — recorded rather than silently applied).**
> As first written, H4 required that "a connection with no `Origin` is rejected". That predicate is
> wrong, and the first live run proved it: per the Fetch standard a browser **omits `Origin`
> entirely on same-origin GET/HEAD**, so the rule rejected the harness page's own requests and the
> run died at the clock-sync step. The requirement is now stated as: **a stated `Origin` must match
> exactly (`null` and any foreign origin rejected), and an absent `Origin` is accepted only with a
> positive `Sec-Fetch-Site: same-origin` Fetch-Metadata signal**, which the browser sets and page
> script cannot forge. A client sending neither header is still rejected, so this is a narrowing of
> *how* same-origin is proven, not a relaxation of whether it must be. Regression-tested both ways
> (`same_origin_get_without_an_origin_header_is_allowed`,
> `null_and_bare_absent_origin_are_rejected_explicitly`), including that a forged
> `Sec-Fetch-Site: same-origin` cannot rescue a stated foreign origin. Recorded here because
> changing a preregistered pass/fail predicate after seeing a failure is exactly the move that
> destroys a preregistration's value if it is done quietly.

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
for GPU upload, not a reprojection, so it touches neither CRS-as-a-type nor the analytical/display
split that `docs/01` and ADR-003 govern.

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
- **a run in a hidden or backgrounded tab, or one in which `requestAnimationFrame` was throttled**
  *(added 2026-08-03 during implementation, after the first live run hung for two minutes on a
  suspended rAF with a demonstrably healthy transport underneath it)*. A hidden tab does not
  composite, so "time to first meaningful pixels" is not a slow number, it is not a number. The
  harness now detects this, waits up to 30 s for a visible tab, and marks the run invalid rather
  than reporting a timing taken while throttled.
- **a run on a software rasterizer** where the GPU string names a fallback adapter (e.g. Microsoft
  Basic Render Driver / WARP / SwiftShader) rather than real hardware. Recorded per run in
  `environment.gpu` so this is checkable after the fact rather than assumed.

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

> **Amendment (2026-08-03, during implementation).** §4 originally cited ADR-011 in passing, which
> directly contradicted the clause immediately above and cited it *as settled design* — the one
> thing CLAUDE.md forbids for that ADR. The citation is removed. Recorded here rather than applied
> silently, because editing the preregistration body without a note is the failure mode the whole
> document exists to prevent.
>
> **Amendment (2026-08-03, after the first measured runs) — the workload is generation-bound, and
> that bounds what §12 can mean.** The tester measured producer generation at **95.0–98.9 % of every
> run's wall time**: both transports idle behind a ~200 MB/s generator, and per-batch p50 throughput
> came out *identical* between candidates (212.031 vs 212.031 MB/s) in one invocation. Consequence,
> stated plainly: **this workload cannot discriminate the transports on throughput**, its MB/s
> figures are a floor rather than a capability, and §12's tie-break is therefore reached by the
> workload's design rather than by a discovered near-equality. Any throughput-based claim needs a
> re-run with a pre-generated payload that decouples generation from transfer. This does not affect
> the H1–H7 eligibility gates, which are not throughput measurements.

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

## 13. How to run

```sh
# 1. Build the browser consumer (also typechecks and runs the H6 leakage scan)
cd protocol/transport-bakeoff/web && npm install && npm run verify

# 2. Build and test the producer + adapters  (release only — §8)
cd .. && cargo test --release && cargo build --release

# 3. Run. --launch opens the page in Edge, whose engine is the WebView2 runtime.
./target/release/transport-bakeoff --launch

# 4. Summarize. Prints the validity verdict first and unconditionally.
node scripts/summarize-report.mjs <report path printed by the harness>
```

**The browser window must be visible and focused for the whole run**, on hardware GPU. A hidden or
backgrounded tab suspends `requestAnimationFrame`; the harness detects this, waits up to 30 s, and
then marks the run invalid rather than reporting a meaningless pixel timing (§8). `?smoke=1` runs a
reduced repetition count for wiring checks and **always marks its own report invalid**.

## 14. Implementation findings

Recorded here, dated, because building and running the harness surfaced things that change how the
results must be read. **Every figure in this section comes from a smoke or pre-fix run and is
therefore inadmissible as a measurement** (§8) — each is stated as the *reason for a change*, never
as evidence for a conclusion. Admissible numbers live in §15 and are the tester's alone.

| # | Finding | Status |
|---|---|---|
| F1 | **Same-origin GET omits `Origin` entirely**, so H4's original "reject absent Origin" predicate rejected the harness's own requests. Now requires a positive `Sec-Fetch-Site: same-origin` signal. | Fixed; amendment recorded in §3 H4 |
| F2 | **A hidden tab suspends `requestAnimationFrame`**, hanging the run with a demonstrably healthy transport underneath. Now detected, waited on for 30 s, then marked invalid. | Fixed; §8 inadmissibility rule added |
| F3 | **A 5-byte frame prefix misaligned the Arrow payload.** Arrow needs an 8-byte-aligned message start to hand out buffer views; misaligned, it copies the whole batch. Prefix is now 8 bytes. Observation from an invalid smoke run: `arrowParseSharesBuffer` was 0/100 on both candidates before the change. Whether the fix buys shared buffers is §15's to establish. | Fixed; verify in §15 |
| F4 | **WebSocket truncated silently at 98/100 batches.** The producer emitted all 100 and a Rust client received all 100; a *server-initiated* Close raced the frames still in the browser's receive path. The producer now never initiates the close, and a stream ending without a terminal frame is reported as `TransportFailed` rather than as a short-but-unremarkable stream. | Fixed; pinned by `websocket_delivers_every_batch_and_a_terminal_frame` |
| F5 | **`GET /` served the session token to any unauthenticated local client.** It was the one route that never called `check()`, so every other gate was decoration against a local process. The token now arrives via the URL fragment, which is never transmitted; the served document contains no credential. | Fixed |
| F6 | **Three H1 predicates were declared but never executed** — id contiguity, consumer-vs-producer digest comparison, cross-adapter wire-byte equality. A gate that runs no comparison is worse than no gate, because §8 prints `VALID: true` regardless. All three now execute. | Fixed |
| F7 | **Unequal instrumentation between adapters** (§8 lists this as inadmissible): the WebSocket adapter accounted `note_written` after the flushed send while HTTP accounted at chunk yield, and it issued two awaited sends per batch where HTTP sent one coalesced chunk — doubling A's window in which a CANCEL frame is invisible. Both now account at handoff and send one chunk per batch. | Fixed |
| F8 | **`--launch` failed silently** on the reference machine: Edge is installed under the split `EdgeCore\<version>\` layout with no `msedge` on `PATH`, and the spawn error was discarded. Now enumerates versioned EdgeCore directories, uses an isolated profile, and reports failures. | Fixed |
| F9 | **`dangling_checkpoint` is a snapshot, not a stall signal.** `finish()` snapshots before the generator closes its `produce` checkpoint, so a reported `dangling: produce` after a cancellation injection is an artefact of snapshot ordering. It must not be read as a producer stall. | Known; interpret accordingly |
| F10 | **The producer-side cancellation ack sits below the harness's own clock resolution.** The pre-fix runs recorded two *negative* acks, which is physically impossible and is clean evidence that the point estimate is under the ±0.300 ms clock bound. Report it as "under 1 ms, indistinguishable from zero at this resolution", never as a precise figure. The <100 ms gate verdict is unaffected — the margin is orders of magnitude. | Known; constrains how §15 quotes H2 |

## 15. Results

*Filled by the tester agent from its own independent execution against commit `6f44d88`, 2026-08-03.
Every figure is transcribed from a report artifact the harness wrote itself. Nothing here is rounded
to flatter, extrapolated, or estimated, and no figure from a pre-fix or invalid run appears.*

### 15.0 Every run attempted, and its verdict

| # | Attempt | Report artifact | `valid` | Verdict |
|---|---|---|---|---|
| 1 | Full §13 run | `bakeoff-report-1785787274.json` (20:01:14.694Z) | **true** | `invalidReasons: []`. **This is the measurement.** It satisfies §9 in full: 3 full runs, 10 cancellation trials, 1 backpressure trial and 3 error injections per candidate. |
| 2 | Reproducibility check, attempt 1 | *none written* | — | **Produced no report at all.** `--launch` printed `Opening in existing browser session.`: Edge reused the still-open window from attempt 1 and opened the page as a **background tab**, which suspends `requestAnimationFrame`. No report after 500 s. |
| 3 | Reproducibility check, attempt 2 (Edge fully closed first) | `bakeoff-report-1785788012.json` (20:13:32.962Z) | **false** | **INVALID.** `invalidReasons`: `document hidden at completion — pixel timings inadmissible`; `requestAnimationFrame throttled 12x — pixel timings inadmissible`; `tab was backgrounded mid-run — frame timings inadmissible`. |

**Attempt 3 is reported as invalid and none of its numbers are used.** §8 is explicit that such a run
is not a slower result, it is not a result. For the record of what the gate caught rather than as a
measurement: its first-pixel figures inflated to ~3000 ms and full-render to ~7000 ms, which is the
2000 ms rAF timeout showing through — exactly the failure mode F2 was added to detect, working.

**I did not keep re-running to obtain a second clean invocation.** §9 declares 3 runs per adapter and
attempt 1 delivers them, valid. A reproducibility check is a bonus this environment could not
supply: nothing here can hold a browser window foregrounded for ~40 s while automation continues, so
the tab loses focus. That is an environment limitation, not a harness defect, and the honest record
is one admissible invocation plus two failed attempts at a second.

### 15.1 Reference profile actually measured

| Item | Value (recorded per run, not assumed) |
|---|---|
| OS | Windows 10 Pro 22H2, build 19045 |
| Webview | Edge / WebView2 runtime **150.0.4078.105**; UA `Chrome/150.0.0.0 Edg/150.0.0.0`; isolated profile |
| GPU | `ANGLE (Intel, Intel(R) UHD Graphics 630 (0x00003E9B) Direct3D11 vs_5_0 ps_5_0, D3D11)` — **real hardware**. Not Basic Render Driver / WARP / SwiftShader, so §8's software-rasterizer bar is cleared. Edge selected the integrated UHD 630, not this machine's GTX 1650. |
| CPU / display | `hardwareConcurrency: 16`, `devicePixelRatio: 1` |
| Rust / Node | `rustc 1.97.1 (8bab26f4f 2026-07-14)`, MSVC · Node v24.18.1 / npm 11.16.0 |
| Build profile | **Release, `debug_assertions` off.** Verified independently of the harness: `cargo rustc --release -- --print cfg` emits no `debug_assertions` cfg, and no `.cargo/config.toml` override exists at project or user level. `[profile.release] debug = true` adds debuginfo only. |
| Test suite | `cargo test --release`: **27 passed, 0 failed, 0 ignored** (1.14 s). Forced full recompile (`--all-targets`): **zero warnings**. `npm run verify`: typecheck clean; `check-leakage: PASS — canary caught 5 planted leaks`; bundle 416.3 kb. |
| Clock relation | offset 326.849 ms, **bound ±0.400 ms** (min RTT 0.800 ms, 21 probes) — well under the 10 ms invalidator |

### 15.2 Eligibility — H1–H7, decided before any throughput comparison

**Both candidates are eligible. No hard requirement failed for either.**

| Gate | A — binary WebSocket | B — loopback HTTP streaming | Evidence |
|---|---|---|---|
| **H1** correctness | **PASS** | **PASS** | 10,000,000 rows on 6/6 runs. Digest `5f0cbe2c7780f60f284bfcacf4212d547f826049f984acad5b15f3cfb9052c2d` identical across both adapters and all 6 runs, **and equal to the producer's own digest on 6/6** (now compared, not merely recorded). **id contiguity failures: 0** on every run. **Coordinate-domain failures: 0** on every run. Wire bytes **243,835,200**, a single distinct value across both adapters. CRS tag 100/100 batches every run. |
| **H2** producer-visible cancel | **PASS** | **PASS** | Worst single trial of 20: **8.4013 ms** against a 100 ms gate. `batches_after_cancel_observed` ≤ 1 in 20/20. Detail in 15.4. |
| **H3** bounded-memory backpressure | **PASS** | **PASS** | Max producer-resident payload **9,753,376 B** against the amended **12,191,720 B** bound, flat for the whole pause. Detail in 15.5. |
| **H4** security posture | **PASS** | **PASS** | Loopback-only bind + ephemeral port asserted at startup; constant-time compare; 5 live negative tests + positive control; `the_served_document_contains_no_credential` now pins F5. Browser probes `noToken=401 wrongToken=401 valid=200`. Byte-scan of the artifact: **no token** — the only 64-hex strings are the payload digest and one partial-stream producer digest, both identified individually. |
| **H5** JSON-free data path | **PASS** | **PASS** | Consumer `jsonFramesSeen: 0` and producer `json_frames_on_data_path: 0` on **6/6** runs — and unlike the pre-fix build, every producer figure is a measured zero rather than an unset default, because producer terminals resolved on all 6 runs. |
| **H6** no transport leakage | **PASS** | **PASS** | Scan clean on both neutral files; one construction site; **the scan self-tests — 5 planted leaks were caught**, so a PASS is not vacuous. |
| **H7** progress + terminal | **PASS** | **PASS** | Progress monotonic 6/6; exactly one terminal per stream; `Completed` 6/6. All 6 injections: `terminal=Cancelled`, `producerObservedCancel=true`, `viewSignalledIncomplete=true`. No partial view presented as complete. |

### 15.3 Evidence table

Per run, in run order. Invocation of record: `bakeoff-report-1785787274.json`.

| Metric | Definition (§) | A — binary WebSocket | B — loopback HTTP streaming | Method |
|---|---|---|---|---|
| Time to first batch | §6 | **24.8 / 25.5 / 27.9 ms** | **23.0 / 21.2 / 19.0 ms** | Consumer `performance.now()`, clamped by Edge to 100 µs. |
| **First meaningful pixels** (first-batch-rendered) | §6 | **52.0 / 36.1 / 57.1 ms** | **55.7 / 33.8 / 27.6 ms** | `await raf()` → `draw()` → `gl.finish()`. **Not** full-payload-rendered. |
| **Full-payload render** | §6 | **1284.4 / 1278.6 / 1331.4 ms** | **1212.2 / 1217.8 / 1239.3 ms** | Quoted alongside the row above by §6's requirement, so the ~30–57 ms figure is never read against M1's 2178–2243 ms unchunked baseline as though it were the same measurement. |
| Throughput per-batch p50 / p95 | §6, n=297 | **p50 208.406 / p95 243.835 MB/s** | **p50 212.031 / p95 256.669 MB/s** | Pooled over 3 runs; sort-and-index. **Generation-bound — see 15.7. Not a transport capability.** |
| Throughput whole-transfer | §6, 1/run | **193.459 / 192.087 / 184.166 MB/s** | **203.111 / 201.617 / 198.031 MB/s** | Same caveat. |
| Peak **producer** memory | §6 | Private commit **14,823,424 / 26,378,240 / 16,752,640 B**; `PeakWorkingSetSize` 18,440,192 / 26,001,408 / 27,328,512 B | Private commit **19,308,544 / 14,479,360 / 14,471,168 B**; `PeakWorkingSetSize` 27,328,512 B (all three) | `GetProcessMemoryInfo` → `PrivateUsage`. Measured cadence ~62.6 ms, not the declared 50 ms. `PeakWorkingSetSize` is a process-lifetime peak, hence B's three identical values — it ran second. |
| Peak **consumer** memory | §6 | (a) **81,641,512 B** (all runs) · (b) 109,606,962 / 106,432,053 / 54,691,121 B | (a) **81,641,512 B** (all runs) · (b) 82,452,958 / 76,375,323 / 70,754,163 B | (a) is now real accounting — GPU-resident vertex data + digest chain + payload in hand — and reproduces exactly as 99×800,000 + 99×32 + 2,438,344. `maxSingleBatchBytes` reported separately at 2,438,344 B. (b) is `usedJSHeapSize`, sampled per batch not per 50 ms, with §6's own `ArrayBuffer`-accounting limitation. |
| Copies, stage 5 (Arrow parse) | §7 — **live-asserted** | **100 / 100** batches share the wire buffer, every run | **100 / 100** batches share the wire buffer, every run | Confirms F3's 8-byte prefix fix on both candidates. |
| Copies, stage 3 (**discriminating**) | §7 — **live-asserted** | **0 reassembly copies**; 100/100 contiguous | **100 reassembly copies per run**; 0/100 contiguous | Measured, not assumed. One WS message = one frame, so no batch spans a chunk. An HTTP body-chunk boundary falls inside **every** batch, forcing a 2,438,344-byte reassembly each — ~243.8 MB per run that A does not pay. Producer-side framing copies once on both (source-read), so the asymmetry is entirely consumer-side. |

### 15.4 H2 — how this must be quoted (F10)

| Quantity | A | B |
|---|---|---|
| Ack p50 | 0.1124 ms | 0.5370 ms |
| Ack p95 | 0.1609 ms | 8.4013 ms |
| Worst of 10 | 0.1609 ms | 8.4013 ms |
| Min | **−0.0400 ms** (negative) | 0.3529 ms |
| Producer observed | 10/10 | 10/10 |
| `batches_after_cancel_observed` | 0 in 10/10 | 1 in 1/10, 0 in 9/10 |
| Per-batch generation cost | p50 12.289 / p95 15.856 / max 21.410 ms (n=300) | p50 11.744 / p95 14.205 / max 18.217 ms (n=300) |
| **Gate (< 100 ms)** | **PASS** | **PASS**, by ~12× on the worst trial |

**The correct statement, per F10:** *the producer observes cancellation in under 1 ms, indistinguishable
from zero at this clock resolution.* It must not be quoted as "0.1124 ms". The clock bound is
±0.400 ms; A's p50 sits below it, and this run again recorded a **negative** ack (−0.0400 ms), which
is physically impossible and is the clean proof the point estimate is under the harness's own
resolution. **The gate verdict is unaffected** — the margin to 100 ms is orders of magnitude larger
than the uncertainty.

Two further constraints on reading this table:

- **The ~12 ms per-batch generation cost does not bound the observation, only the stopping.** Neither
  candidate detects at a write boundary — both observe on a path concurrent with the generator — so a
  sub-millisecond ack is not a contradiction. What that cost bounds is when production actually
  **ceases**: at most one further batch, i.e. **≤ 21.410 ms** of additional generation at the
  measured worst case. That is the operationally meaningful cancellation figure, not the ack.
- **`batches_after_cancel_observed` is timing-sensitive, not a stable property.** On the pre-fix build
  B reported 1 in 19/20 trials; here it reports 1 in 1/10. Both satisfy ≤ 1. The counter is read at a
  `finish()` snapshot that is not synchronised with the generator loop, so it should be read as
  "never more than one", never as a per-candidate score.
- **F9 stands: `dangling_checkpoint: produce`** appears on all three of A's injections and none of
  B's. This is snapshot ordering — `finish()` runs before the generator closes its checkpoint — **not
  a producer stall**, and must not be read as one.

### 15.5 H3 — bounded-memory backpressure

| Quantity | A | B |
|---|---|---|
| Pause actually applied | **3009.2 ms** | **3008.8 ms** (declared 3000 ms) |
| Max producer-resident payload | **9,753,376 B** | **9,753,376 B** |
| Amended declared bound | 12,191,720 B | 12,191,720 B |
| Headroom | 2,438,344 B (20.0 %) | 2,438,344 B (20.0 %) |
| **Verdict** | **PASS** | **PASS** |

The plateau is exactly 4 × 2,438,344 B — the four in-flight batches the bounded channel permits.
`tx.reserve()` precedes generation, so the "+1 in construction" the 5× ceiling allows for is never
counted; the observed ceiling therefore sits one batch below the bound by construction, in both
units. This reproduces the pre-fix figure exactly, which is what §3's H3 amendment records.

### 15.6 M5 baseline comparability

Stated for ADR-012 to quote directly:

> **The bake-off did not measure either transport's throughput ceiling, and its MB/s figures must not
> be compared with spike M5's.** M5 measured `fetch()` + `arrayBuffer()` on a single unchunked
> 162,500,488-byte response with the data already in hand — a *transfer-bound* measurement. This
> harness's figures are *generation-bound*: producer synthesis and Arrow serialization account for
> **97.2 %–98.9 %** of every run's wall-clock time, so both transports spent essentially the whole
> run idle behind the generator. The two numbers measure different subsystems. Quoting ≈200 MB/s
> against M5's ≈105–112 MB/s as a ~2× transport improvement would be a fabricated result.

The copy comparison is not like-for-like either. M5's model was 4 avoidable application-level copies
+ 1 required GPU upload on the Tauri custom-protocol path. Here, **live-asserted**: stage 5 is 0
copies on both candidates, and the discriminating consumer-side reassembly is 0 for A and 100/run for
B. The remaining stages — generation, IPC serialization, producer-side framing, OS→JS `ArrayBuffer`,
f64→f32 narrowing, GPU upload — are **source-read**, not live-asserted, and are equal between
candidates. This harness therefore does **not** demonstrate a reduction against M5's count. What it
demonstrates is that the two candidates differ by exactly one whole-payload copy per batch, in A's
favour.

### 15.7 Throughput does not decide this, and the tie-break is reached by design

Producer generation is **97.2 %–98.9 %** of every run's wall time (sum of per-batch
`generation_cost_us` ÷ `fullRenderMs`; A: 97.2 / 97.9 / 98.9 %, B: 98.3 / 98.5 / 98.9 %).

The clearest single demonstration that the throughput figure tracks the *generator* and not the
transport: A's per-batch generation cost happened to run slower in its three runs than B's did in its
three (p50 12.289 ms vs 11.744 ms). Converted to a rate, that alone predicts 198.4 vs 207.6 MB/s —
and the measured per-batch p50s are 208.406 vs 212.031 MB/s. **A's apparent 1.739 % throughput
deficit is explained by the generator being slower during its runs, not by the socket.**

So: the two candidates' per-batch p50 figures are **1.739 % apart**, far inside §12's 10 % band, and
**§12's tie-break is therefore reached by the workload's design rather than by a discovered
near-equality between the transports** (§11 amendment). Its first criterion, fewer copies, resolves
on measured data: **A pays 0 consumer-side reassembly copies, B pays 100 per run.** Criterion 1
being decisive, criteria 2 and 3 are not reached; recorded as context only, criterion 2's ack
difference sits at the edge of the ±0.400 ms clock bound and should not be leaned on, and criterion 3
favours B, which has no consumer→producer channel at all.

Counter-evidence for A, recorded so the ADR does not read one-sided: a WebSocket data plane has an
application-visible shutdown protocol that both ends must get right, and getting it wrong truncates
**silently** — F4 is a real instance, caught only because a Rust client disagreed with the browser. B
gets ordered-delivery-then-EOF from the transport and has no equivalent failure mode.

### 15.8 Harness gaps still open after `6f44d88`

Recorded so ADR-012 does not over-read this evidence. None of these invalidate the run of record.

1. **`debugAssertions` is emitted but never recorded.** `/clock` returns it, but `clockSync()` reads
   only `serverNanosSinceT0` and discards it; the string appears **0 times** in the report and no
   validity check consults it. §8's "a debug build measured as release" invalidator still has no
   mechanism behind it *in the artifact*. I confirmed the release profile independently instead
   (15.1), so this run is admissible — but the next person cannot confirm it from the report alone.
   The same applies to `batchWireBytes`, also returned and also discarded.
2. **H4's live negative tests still target `/clock`, not the data endpoints.** `/stream/ws` extracts
   the credential from the WebSocket subprotocol list — a different code path from the
   `Authorization` header — and no negative test drives it. A reject-side bug there would be missed.
3. **The new H1 checks add real per-batch consumer work** inside the timed loop (a 100,000-element id
   progression scan plus a 100,000-element domain scan). Equal across candidates, so the comparison
   is unaffected, but it further compresses an already generation-bound throughput figure.
4. **Consumer JS-heap sampling is still per-batch, and producer memory sampling still runs at
   ~62.6 ms**, against §6's declared 50 ms cadence.
5. **The consumer's accounted peak now counts GPU-resident bytes as consumer memory.** That matches
   §6(a)'s "payload bytes retained by harness code", but it is VRAM, not JS heap, and the two should
   not be summed with (b) or compared against a host-RAM budget.

### 15.9 Scope limits

§11's pre-declared limits all hold. Additionally: **one machine, one GPU (Intel UHD 630, not the
GTX 1650 also present), one Edge build (150.0.4078.105), one admissible invocation** — the
reproducibility check could not be obtained (15.0), so run-to-run variance on this build is
uncharacterised. Windows/WebView2 only; nothing transfers to macOS/WKWebView or Linux/WebKitGTK. The
payload is synthetic uniform-random points at a fixed seed: no GeoParquet, no DuckDB, no spatial
index, no picking, no editing, no reprojection, no concurrent streams, no WAN path. Interruptible
Tauri IPC channels — ADR-004 amendment 2's third transport class — were **not measured**, and
ADR-012 must record that exclusion.
