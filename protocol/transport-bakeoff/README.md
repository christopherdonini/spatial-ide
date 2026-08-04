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
> unit — the measured headroom is **20.0 % against the amended bound** (2,438,344 B of 12,191,720 B;
> it is 18.7 % against the superseded 12,000,000 B figure, and §15.5 quotes the former) — and **no
> verdict turns on this change**. It is corrected so the stated bound means what it says, not to
> rescue a result.

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

> **Amendment to H6 (2026-08-03, during implementation — narrowing, recorded so the gate is not
> passed against wording it does not meet).** As written, H6 claimed the scan covers the neutral
> interface "**or from semantic-layer code**". It does not, and it should not: `main.ts` legitimately
> speaks HTTP to the *control* endpoints (`/clock`, `/facts`, `/report`), which ADR-004 places on the
> control plane, so scanning it for the word `fetch` would be theatre and would fail honestly-written
> code. **The scan's actual scope is the transport-neutral *data* interface** (`web/src/transport.ts`,
> `src/transport.rs`), plus the single-construction-site assertion over `main.ts`, plus a canary that
> fails the build if planted leaks stop being caught. H6's PASS in §15 is recorded against that
> narrower predicate. Two further corrections made at the same time: `\bword\b` matching missed every
> realistic leak shape (`WebSocketTransport`, `httpStatus`, `ws_handle`) and now matches identifier
> parts; and the quote-stripper corrupted Rust lifetimes, which would have silently made the whole
> scan vacuous the day one was introduced — the canary now plants a leak *between* two lifetime ticks
> specifically to catch that regression.
>
> **Also declared here rather than left implicit:** stream ids appear in the `/facts/{stream_id}`
> telemetry path, which §5's "never a URL path segment" forbids as written. That rule is about the
> **data channel** and the semantic API; `/facts` is out-of-band diagnostics that exists only because
> the producer's own observations must be readable. The rule is narrowed to the data channel, and the
> production transport must not expose stream ids in a URL at all.

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
> **Amendment (2026-08-03) — the workload is generation-bound, and that bounds what §12 can mean.**
> Producer generation dominates every run's wall-clock time, so both transports idle behind the
> generator. Consequence, stated plainly: **this workload cannot discriminate the transports on
> throughput**, its MB/s figures are a floor rather than a capability, and **§12's precondition — a
> *measured* per-batch p50 near-equality — is therefore untested rather than satisfied**. Falling
> back to the tie-break is a choice made after seeing the data, not the preregistration resolving;
> §1 pre-declared only A, B, or neither-if-both-fail-a-gate. Any throughput-based claim needs a
> re-run with a pre-generated payload that decouples generation from transfer. None of this affects
> the H1–H7 eligibility gates, which are not throughput measurements.
>
> *(The figures for this are in §15, from the run of record. An earlier draft of this amendment
> quoted 95.0–98.9 % and "212.031 vs 212.031 MB/s" from **pre-fix runs**, without the
> inadmissibility qualifier §14 applies to every other pre-fix number, and they contradicted the run
> of record. Removed — quoting inadmissible figures in the preregistration body is precisely what
> this document exists to prevent.)*

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
deficit is more than accounted for by the generator being slower during its runs, not by the socket** —
the generator alone predicts a 4.6 % gap where 1.739 % was measured, so the residual runs the other
way.

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

---

# 16. Phase 2 addendum — transfer-isolated benchmark (preregistered)

> **Void clause, mirroring §0.** This addendum is written and committed **before any Phase-2 harness
> code exists**. Git history is the proof: **if any Phase-2 harness commit precedes this §16 commit,
> §16 is void.**

## 16.0 Why there is a Phase 2, and why this is not result-shopping

Adding a phase after seeing a result is the shape of a post-hoc redesign, so the justification is
stated first and plainly.

**The deficiency was recorded by the harness's own reporting before anyone directed a Phase 2.**
§11's 2026-08-03 amendment and §15.7 already state that §12's precondition was **untested, not
satisfied**, and §15.6 already states that the bake-off did not measure either transport's
throughput ceiling. The trigger is an instrument failure this study self-declared — not a disliked
winner.

**What Phase 1 established, and what it did not:**

| | Status |
|---|---|
| H1–H7 hard gates, both candidates | **Established.** Correctness, producer-visible cancellation, bounded backpressure, security posture, JSON-free data path, no transport leakage, progress/terminal propagation — all PASS, both candidates, on an admissible run. |
| Transport throughput | **Not established, for either candidate.** Producer generation and Arrow serialization consumed **97.2–98.9 %** of every run's wall time. Both transports idled behind the generator. |
| §12's tie-break precondition | **Untested.** Two figures that both measure the same generator being 1.739 % apart is not evidence that the transports are within 10 % of each other. |

**"Throughput could not be measured" is not "throughput is within the 10 % tie band."** Phase 1
selected a candidate on the tie-break's first criterion while the precondition for reaching that
criterion was unverified. Phase 2 exists to measure the thing Phase 1 could not see.

**Phase 2 must be able to overturn Phase 1.** If Phase 2 selects Candidate B, ADR-012's Decision is
**replaced, not annotated**. An addendum that can only confirm is confirmatory theatre.

## 16.1 Phase 1 is frozen, by hash

Phase 1's results are preserved, not revised. Artifacts are committed at
`protocol/transport-bakeoff/results/phase1/` with `SHA256SUMS`, so "preserved untouched" is
checkable rather than asserted.

| Artifact | SHA-256 | Standing |
|---|---|---|
| `bakeoff-report-1785787274.json` | `2231c51ae65ed6546bdd8fbc4d576bc71c61a04a746c9014e5ca3d6a87f0b9dd` | **The Phase 1 run of record.** `valid: true`, commit `6f44d88`, full §9 counts. |
| `bakeoff-report-1785788012.json` | `a64ab960db98776e6d902f2c0751f402778557082b6ccbc550afb2b692d81629` | Reproducibility attempt, `valid: false` — backgrounded tab. Kept because §15.0 reports it. |
| `bakeoff-report-1785785809.json` | `a5a9233e350d2b44f6f1042ea01e7db633e534e04638945c3651fb59c958b039` | Pre-fix build (`c66e080`), superseded. Kept, not used. |
| `bakeoff-report-1785786129.json` | `aecc0e88a57d04117dc53d203a16a993e62773d772c4fddbeddc963bb0c22826` | Pre-fix build (`c66e080`), superseded. Kept, not used. |

**No re-analysis of Phase 1 data under Phase-2 rules.** Phase 1's H1–H7 verdicts stand as recorded.
If a Phase-2 regression test falsifies one, the Phase 1 verdict is amended by an **appended dated
note**, never by editing §15.

## 16.2 The transfer-isolated workload

**One deterministic Arrow corpus, pre-generated and serialized *before* the timed interval**, held
as an ordered list of immutable byte slices. Batch boundaries are owned by the corpus, not by either
transport. Both candidates send the **identical immutable bytes, in the same order**.

- Both adapters take the **same shared immutable slice type**; neither may clone a payload. §8's
  "unequal instrumentation between adapters" makes anything else inadmissible. Asserted: **zero
  allocations of payload size inside the timed interval, on both candidates**, reported per run.
- **No generation, no warm-up, and no harness-only cloning inside transport timing.** The whole
  corpus is touched before the timed interval on both candidates, so page-cache warmth is equal.
- Fresh connection per run on both. `TCP_NODELAY` set identically and recorded. One write per batch
  on both, re-verifying that F7's fix survives the corpus change.

**Batch-size configurations.** Total payload is held constant at 10,000,000 rows / 240,000,000
column bytes so the configurations are comparable:

| Configuration | Rows/batch | Batches | Approx. wire bytes/batch |
|---|---|---|---|
| **S — small** | 10,000 | 1,000 | ~244 KB |
| **M — current** | 100,000 | 100 | 2,438,344 B (Phase 1's size) |
| **L — large** | 500,000 | 20 | ~12.2 MB |

> **Declared ceiling raise, before measuring — ADR-010 rule 6.** §4 declared `MAX_FRAME_BYTES` =
> 4 MiB, sized for Phase 1's single configuration. Configuration **L exceeds it**. The ceiling is
> raised to **16 MiB for Phase 2**, declared here *before any Phase-2 measurement*. Raising a
> declared ceiling mid-run to make a configuration work would be exactly the "discovered" failure
> rule 6 forbids; raising it in advance, in writing, with the reason, is not.

**Concurrency — derived from the hero slice, not invented.** The hero slice sustains one Arrow
stream per active query result (`docs/05` streaming, cancellable queries; `docs/06` layers binding
directly to engine Arrow streams); two streams coexist only transiently — a superseded query
cancelling while its replacement starts, and a publish/export read running while the canvas keeps
streaming (`docs/01`'s never-block-the-canvas rule, `docs/03`/ADR-008) — so **N=1 is the primary
configuration and N=2 is the secondary**, the only concurrency level the slice justifies.
Concurrency is **not** justified by viewport tiling (that is ADR-011, which §11 forbids citing as
settled design) nor by per-column streams (a record batch carries all columns, `docs/11`).

## 16.3 Declared capacity ceilings (ADR-010 rule 6), and the exercise that drives to them

Declared before measuring, and **deliberately driven to and past** — rule 6's "we are comfortably
under it today is not a strategy". Each overrun must produce the declared terminal outcome,
surfaced, never a silent truncation or a wrong-but-plausible result (rule 7).

| Ceiling | Value |
|---|---|
| Max frame/message bytes accepted by the consumer | **16 MiB** (raised above, was 4 MiB) |
| Max in-flight batches (credit window), per stream | **4** |
| Credit window **in bytes**, per configuration | S ~976 KB · M 9,753,376 B · L ~48.8 MB |
| Producer-resident bound, per stream | <= (4 + 1) x configuration batch wire bytes |
| Producer-resident bound, aggregate | N x per-stream bound — credit is **per-stream**, not a global pool |
| Max concurrent streams | **2** |
| Total corpus bytes resident | one configuration at a time, fully RAM-resident; residency model recorded per run |
| Consumer decoder buffer high-water | <= 2 x configuration batch wire bytes |
| Watchdog interval / max wall-clock per run | 180 s / 600 s |
| VRAM | rendering is **excluded from the transfer-isolated timed path**; first-pixel is measured as a separate segment so GPU-resident bytes never enter the transport comparison |

## 16.4 Metrics — three timestamps, not two

The split that separates a **decoder limitation** from a **transport property** is the load-bearing
one, because that is precisely the weakness in Phase 1's criterion 1.

- **t1 — raw transport receipt.** Last payload byte received at transport level.
- **t2 — checksum complete.** Fed by a **streaming, chunk-by-chunk hasher on both candidates**, and
  reported as its own segment. A checksum that concatenated chunks in order to hash would move the
  reassembly copy *into* the raw-receipt segment and erase the very difference being measured.
- **t3 — Arrow-decoded and usable.**

Reported per configuration, per candidate: first-batch latency · full-transfer throughput to t1 ·
Arrow decode time (t3 − t2) · first-pixel (separate segment) · total completion · CPU time · peak JS
and native memory · allocation pressure (count and bytes of payload-sized allocations inside the
timed interval) · **p50/p95/p99** · confidence intervals.

**Analysis plan, fixed in advance.** p50/p95/p99 by sort-and-index, as every prior spike figure.
Confidence intervals by **percentile bootstrap over run-level means**, 10,000 resamples, seed
`0x5EED205600000002`. **Per-batch samples within a run are not independent**; pooling them would be
pseudo-replication and would narrow the interval by construction, so CIs are computed over run-level
means and any per-batch pooled figure is reported as descriptive only.

**The result artifact must contain every declared assertion and the *actual* memory-sampling
cadence**, not the intended one — §15.8 item 4 recorded that Phase 1 sampled at ~62.6 ms against a
declared 50 ms, which was only discoverable because the timestamps were retained.

## 16.5 Schedule, stopping rule, and order effects

- **At least 5 clean release runs per candidate per configuration**, in **counterbalanced order**:
  `ABBA BAAB ABBA` per configuration — 12 runs, 6 per candidate, balanced by position.
- **No optional stopping.** The full counterbalanced schedule completes **before any per-metric
  comparison is computed**.
- **An invalid run invalidates and re-runs the whole counterbalanced block**, never the single run.
  Replacing one run inside a block reintroduces the order effect counterbalancing exists to remove.
- **Order effects are reported**: a candidate x position interaction is computed and stated; if it
  exceeds **5 %** of the candidate main effect, the block is reported as confounded and invalid.

## 16.6 Symmetric consumption — and the timebox

Phase 1's consumer required every HTTP batch to be concatenated into a new `Uint8Array`, while a
WebSocket message arrived contiguous. That asymmetry is a property of **the JS Arrow decoder's
contiguity requirement**, not self-evidently of HTTP.

**Timeboxed investigation:** attempt an incremental/segmented consumer using Arrow JS's streaming
`RecordBatchReader` over the response body, and compare it against an **equivalent** WebSocket
consumer. **If a symmetric incremental consumer is not working within the timebox, run with the
concatenating consumer and report the copy as a limitation of the JS Arrow decoder's contiguity
requirement, never as a property of HTTP** — with a note on what removing it would take.

**WebView2-internal WebSocket message assembly is opaque.** Its copy count is reported as
**unknown**. No zero-copy claim is made for either candidate, and **an unknown internal copy count
is not counted as a win** (ADR-004: copies are "measured and minimized, **not assumed absent**").

## 16.7 Hard gates — retained, plus new regression coverage

All of §3's H1–H7 are retained unchanged, with two corrections and one extension:

> **Correction to H1's digest invariant, for re-chunking.** §3 asserted one wire digest identical
> across adapters and runs. Three batch sizes are three serializations, so wire digests differ
> **by construction**. Replaced by the stronger pair: **wire digest identical *within* a
> configuration** across adapters and runs, **and decoded column-bytes digest identical across all
> configurations and both adapters**. Also: every batch's envelope must still carry
> `crs`/`frame`/`axis_order` **after re-chunking** — ADR-010 rule 1 binds each batch, not the
> corpus, and a stream that shipped only RecordBatch messages would be shipping untagged bulk
> buffers.

> **Correction to §4's rule-6 parenthetical (appended, not rewritten).** §4 said ADR-010 rule 6 was
> "non-binding here since nothing is pickable". Picking was rule 6's *measured instance*; the
> "declared, not discovered" clause is general and **binds Phase 2's ceilings** (§16.3).

> **Extension to H7 under N>1.** Terminal outcomes and incompleteness signalling are asserted
> **per stream**: a partially-delivered or failed stream must not leave a view that reads as
> complete (ADR-010 rule 5, third bullet). The watchdog covers **each** stream.

**New regression coverage, required to pass before any Phase-2 measurement is admissible:**

| # | Scenario | Required behaviour |
|---|---|---|
| R1 | Byte-length mismatch | Detected; declared terminal outcome; never silently accepted |
| R2 | Checksum mismatch | Detected; declared terminal outcome |
| R3 | Partial/truncated terminal frame | Reported as failure, not as a short-but-complete stream |
| R4 | Mid-stream disconnect | Producer observes it through its own transport; declared terminal outcome |
| R5 | Oversized message, above the declared 16 MiB ceiling | Rejected at the declared limit, surfaced |
| R6 | Cancellation | Producer-visible, < 100 ms, at most 1 further batch (H2 retained) |
| R7 | Backpressure | Bounded to the declared per-stream and aggregate bounds (H3 retained) |
| R8 | **WebSocket silent-truncation race** (F4) | Every batch and a terminal frame delivered; pinned browser-free |

## 16.8 Phase-2 invalidators, additional to §8

- corpus digest mismatch between candidates or runs
- unequal corpus residency or page-cache warmth between candidates
- any allocation of payload size inside the timed interval, on either candidate
- any timed-interval work not identical between candidates
- a comparison computed before the counterbalanced block completed
- single-run replacement instead of whole-block replacement
- order effect exceeding the declared 5 % threshold
- a declared ceiling raised during, rather than before, measurement

## 16.9 Decision rule — fixed before viewing any Phase-2 result

1. **A failed hard gate disqualifies the candidate**, regardless of throughput.
2. **If transfer-isolated throughput differs by more than 10 %**, select the faster eligible
   candidate.
3. **If within 10 %**, apply §12's existing ordering using **measured end-to-end cost**:
   copies and allocation pressure, then cancellation simplicity, then security surface.
4. **An unknown internal copy count is not a win.**
5. **If results change materially with batch size**, report that **no transport-independent winner
   exists**, and identify the **batch-size policy the product needs**. In that case ADR-012 records
   the policy requirement and **stays Proposed** — a transport chosen only for one batch size is not
   a transport decision.

## 16.10 Scope of any Phase-2 claim

Windows/WebView2 only. **Candidate A versus Candidate B only** — the interruptible Tauri IPC-channel
class named by ADR-004 amendment 2 remains **outside the decision** and unmeasured. The corpus
remains synthetic and structurally regular (fixed-width, non-nullable, numeric); GeoArrow
variable-width geometry, dictionary/string columns and nulls are **not** exercised, so any
buffer-sharing result is conditional on that shape. No GeoParquet, no DuckDB, no spatial index, no
picking, no editing, no reprojection, no WAN path.

**The hero-slice / real-SKP data-path exercise is not part of Phase 2** and is not performed in this
directory: `docs/02` places DuckDB and GeoParquet in `engine/` ("the data-engine module and nothing
else"), and a real SKP surface would require `docs/10`'s specification checklist and `docs/08`'s
normative conformance suite. It is engine-module work that must follow the transport decision,
because the engine's streaming output has nowhere to go until a transport exists. That sequencing,
and the status ADR-012 should therefore carry, is put to the human rather than resolved here.

---

# 17. Phase 2 results

*Filled by the tester agent from its own independent execution against commit `2e627fe`, 2026-08-04.
Every figure is transcribed from a report artifact the harness wrote itself, or from a committed
diagnostic script named beside it. Nothing is rounded to flatter, extrapolated, or estimated, and no
figure from an invalid block is used as evidence for a conclusion.*

**Headline, before any table: two of the three preregistered batch-size configurations produced no
admissible block, so Phase 2 does not close the transport decision.** Configuration S is admissible
and resolves §16.9 in Candidate A's favour on measured copies. Configurations M and L are invalid on
§16.5's order-effect rule across two blocks each, so §16.9 rule 5's batch-size question cannot be
answered — and rule 5's own closing clause states that a transport chosen on one batch size is not a
transport decision. Detail in 17.9.

## 17.1 Gate — verified before measuring, per §16.7

| Check | Result |
|---|---|
| `cargo test --release` | **33 passed, 0 failed, 0 ignored** (4.83 s) |
| `cd web && npm test` | **19 consumer checks, all PASS** — R1 (2), R2 (2), R3 (2), R5 (3), framing invariants (10) |
| Forced full recompile | `cargo clean -p transport-bakeoff` then `cargo build --release --all-targets`: **zero warnings** |
| `npm run verify` | typecheck clean · `check-leakage: PASS — canary caught all 4 planted leaks` · bundle rebuilt from HEAD sources, `dist/app.js` 431.9 kb |
| R4 / R6 / R7 / R8 | producer-side, inside the 33: `mid_stream_disconnect_is_observed_by_the_producer` (R4), `dropping_the_body_early_makes_cancellation_producer_visible` + `cancel_observation_is_idempotent…` (R6), bounded-channel/corpus tests (R7), `websocket_delivers_every_batch_and_a_terminal_frame` (R8) |
| Preregistration ordering | `git log --oneline --stat` confirms `6444d1a` (§16, README + Phase 1 artifacts **only**) precedes every Phase-2 code commit — `86df830`, `728d5c3`, `2e627fe`. §16's void clause is **not** triggered. |

**Build profile, verified independently of the harness** (§8's "a debug build measured as release"):
`cargo rustc --release -- --print cfg` emits **no** `debug_assertions` cfg, and no `.cargo/config.toml`
exists at project or user level. This is still not checkable *from the artifact* — see 17.8 item 1.

## 17.2 Reference profile actually measured

| Item | Value (recorded per block, not assumed) |
|---|---|
| OS | Windows 10 Pro 22H2, build 19045 |
| Webview | Edge / WebView2 runtime **150.0.4078.105**; UA `Chrome/150.0.0.0 Edg/150.0.0.0`; isolated profile, fresh window per block |
| GPU | `ANGLE (Intel, Intel(R) UHD Graphics 630 (0x00003E9B) Direct3D11 vs_5_0 ps_5_0, D3D11)` — **real hardware**, not Basic Render Driver / WARP / SwiftShader, so §8's software-rasterizer bar is cleared. Rendering is outside Phase 2's timed path (§16.3); the GPU string is recorded because §8's invalidator is retained. |
| CPU | `hardwareConcurrency: 16` |
| Rust / Node | `rustc 1.97.1` MSVC · Node v24.18.1 |
| Runner | `scripts/run-phase2.mjs <S\|M\|L>` — kills Edge before and after each block, so no block ran in a reused window / background tab |
| Block wall-clock | S 178.9 s · M 185.0 s / 178.4 s · L 182.1 s / 177.2 s |

## 17.3 Every block attempted, and its verdict

Five blocks, 60 runs, 30 per candidate. `invalidReasons` verbatim from each artifact. Artifacts are
committed at `results/phase2/` with `SHA256SUMS`.

| # | Config | Artifact | `valid` | `invalidReasons` (verbatim) |
|---|---|---|---|---|
| 1 | **S** | `bakeoff-report-1785794188.json` | **true** | `[]` |
| 2 | **M** | `bakeoff-report-1785794447.json` | **false** | `"watchdog fired"`, `"order effect 1569.8% exceeds the declared 5% threshold — block confounded"` |
| 3 | **L** | `bakeoff-report-1785794694.json` | **false** | `"order effect 226.1% exceeds the declared 5% threshold — block confounded"` |
| 4 | **M** (whole-block replacement of #2) | `bakeoff-report-1785795205.json` | **false** | `"order effect 51.5% exceeds the declared 5% threshold — block confounded"` |
| 5 | **L** (whole-block replacement of #3) | `bakeoff-report-1785795403.json` | **false** | `"order effect 514.1% exceeds the declared 5% threshold — block confounded"` |

**Whole-block replacement only.** Blocks 4 and 5 replace blocks 2 and 3 entirely, per §16.5. No run
was replaced individually, and no run was dropped from any block. **One replacement block per invalid
configuration was run, and then I stopped** — running blocks until one passes is the optional-stopping
failure §16.5 forbids, and the order-effect rule's behaviour here (17.5) is deterministic in kind,
not a fluctuation a re-run would clear.

**Independent re-derivation of every verdict.** `scripts/analyze-phase2.mjs` recomputes the validity
gate and every statistic from the raw per-run records rather than reading the harness's `summary`
block. It agrees with the harness on all five verdicts and reproduces every order-effect ratio to the
displayed digit. The one invalidator it cannot re-derive is `"watchdog fired"` — no heartbeat
timeline is recorded in the artifact — so that reason is carried through from the harness rather than
confirmed; the harness's own `log` array puts it at `[181.14s]`, and it is diagnosed in 17.5.

**No comparison was computed before a schedule completed.** The harness computes its summary only
after all 12 runs return, and the analysis script only ever reads finished artifacts.

## 17.4 Corpus identity — verified, not assumed

| Config | Wire digest (SHA-256 over framed wire bytes, in order) | Column digest | Batches × rows | Wire bytes | Batch wire bytes |
|---|---|---|---|---|---|
| **S** | `078b1b1fb1c5d6a990b640de3fdfe0a1ad6209ad3176990e656832f728e9d6dc` | `ba687a44…94974` | 1000 × 10,000 | 244,560,000 | 244,560 |
| **M** | `13cc89914b520f90cb6d91f6e161e1ea9292e8dded492b7913ba5ddf98ecc73a` | `ba687a44…94974` | 100 × 100,000 | 243,835,200 | 2,438,352 |
| **L** | `ac048081b2a389dd1bd252301ef8a8fdea2503018c2a21adb52edb53f9abfefe` | `ba687a44…94974` | 20 × 500,000 | 243,766,080 | 12,188,304 |

- **The consumer's independently computed wire digest matched the manifest on 60/60 runs**, both
  candidates, all five blocks (`wireDigestMatchesManifest: true` on every run; exactly one distinct
  consumer digest per configuration). The digest is accumulated chunk-wise by the consumer's own
  streaming hasher over the raw frame slices, so it is an independent computation, not an echo.
- **§16.7's re-chunking invariant holds, measured across three configurations**: the column digest
  `ba687a443ed1211c5865f74d0e00866ec16feadcf7979e37b75ac89a50294974` is identical for S, M and L,
  while the three wire digests differ — exactly the pair §16.7's correction to H1 demands.
- **Both configurations that ran twice produced the identical corpus on the second build** (M and L
  wire digests are byte-identical between blocks 2/4 and 3/5), so the corpus is deterministic across
  process lifetimes, not merely within one.
- **CRS envelope after re-chunking:** `crs=EPSG:2056` + `frame=authoritative-project-crs` present on
  **every batch of every run** — 1000/1000, 100/100, 20/20 — so ADR-010 rule 1's per-batch binding
  survives all three batch granularities.
- Rows decoded: 10,000,000 on 60/60 runs. JSON frames on the data path: **0** on 60/60 runs, both
  endpoints. Terminal: `Completed` on 60/60 runs.
- **H4 byte-scan of all five artifacts:** the only 64-hex strings present are the column digest and
  the block's own wire digest — **no token in any artifact**.

## 17.5 Order effects — the reason four blocks are invalid

§16.5 computes a candidate × position interaction and invalidates past **5 % of the candidate main
effect**. Recomputed independently; the harness's figure is reproduced exactly.

| # | Config | early gap A−B | late gap A−B | main effect | interaction | **ratio** | verdict |
|---|---|---|---|---|---|---|---|
| 1 | S | −1.503 MB/s | −1.435 MB/s | **1.4689 MB/s** | 0.0681 MB/s | **4.6 %** | **within 5 % — valid** |
| 2 | M | −0.622 | +0.804 | **0.0909** | 1.4267 | **1569.8 %** | confounded |
| 3 | L | −0.090 | +1.462 | **0.6861** | 1.5514 | **226.1 %** | confounded |
| 4 | M | −0.507 | −0.859 | **0.6827** | 0.3519 | **51.5 %** | confounded |
| 5 | L | +0.071 | −0.161 | **0.0452** | 0.2322 | **514.1 %** | confounded |

**What the numbers say, stated plainly.** The ratio's denominator is the candidate main effect. At
configurations M and L the two candidates are separated by **0.045–0.686 MB/s** — under 2 % of a
~33 MB/s figure — while within-block drift moves throughput by **0.23–1.55 MB/s**. Whenever the
candidates are closer together than the block drifts, the normalized interaction is large by
construction; block 5's 514 % comes from a 0.232 MB/s interaction over a 0.045 MB/s main effect, not
from a large effect. Blocks 2 and 3 also decline from the early half to the late half on **both**
candidates (block 2: A 32.929 → 31.909, B 33.551 → 31.105 MB/s), so the drift is real and not only a
denominator artifact.

**This is reported as the rule's outcome, not argued around.** §16.5 is preregistered and I may not
reinterpret it: the interaction exceeds the declared threshold, therefore those blocks are confounded
and their numbers are not evidence. The substantive reading points the same way — at M and L,
within-block drift is larger than the candidate difference, so those blocks could not have separated
the candidates even if the metric had passed.

### What the four invalid blocks contained — the record, **not evidence**

> **Inadmissible.** §8 heads its list with `Inadmissible measurements (not "worse data" — not data)`.
> These figures are printed for the same reason §15.0 printed attempt 3's: so the record shows what
> the gate caught. **No conclusion in 17.9 rests on any number in this sub-table**, and none of it may
> be quoted as a Phase-2 measurement.

p50 per candidate, run-level, n = 6 per candidate per block.

| # | Config | t1 A / B (ms) | t2−t1 A / B (ms) | decode A / B (ms) | t3 A / B (ms) | first batch A / B (ms) | MB/s A / B | reassembly A / B | shares A / B |
|---|---|---|---|---|---|---|---|---|---|
| 2 | M | 7587.90 / 7514.80 | 0.20 / 0.10 | 29.00 / 28.20 | 7597.10 / 7302.80 | 81.00 / 77.60 | 32.31 / 33.00 | 0 / 100 | 100 / 100 |
| 4 | M | 7304.90 / 7176.60 | 0.30 / 0.10 | 28.00 / 27.60 | 7346.50 / 7222.00 | 79.50 / 76.80 | 33.44 / 34.31 | 0 / 100 | 100 / 100 |
| 3 | L | 7339.10 / 7388.30 | 0.80 / 0.20 | 8.40 / 8.20 | 7409.40 / 7388.70 | 399.70 / 401.40 | 33.28 / 33.13 | 0 / 20 | 20 / 20 |
| 5 | L | 7257.20 / 7226.50 | 0.90 / 0.10 | 8.40 / 7.60 | 7250.20 / 7155.70 | 391.80 / 383.80 | 33.59 / 33.76 | 0 / 20 | 20 / 20 |

Two structural observations that would need an admissible block to become findings. At M and L
**every** Candidate B frame spans a chunk boundary (contiguous 0/100 and 0/20), so B's copy is one
reassembly per batch with the Arrow parse then sharing 100 %; at S the same single copy per batch
splits into 116 reassemblies plus 884 Arrow-parse copies. And the throughput *direction* is unstable
across the invalid blocks (B faster in 2, 4 and 5; A faster in 3, by 0.44 %), which is what a block
whose drift exceeds its candidate difference looks like.

**Block 2's second invalidator, `"watchdog fired"`, is a harness artifact and is diagnosed rather than
excused.** Phase 2's flow calls `heartbeat()` only through `begin()`/`end()`, and it brackets the
**entire 12-run block** in one `begin('phase2-block')`/`end('phase2-block')` pair — so no heartbeat is
emitted for the whole block. Any block whose 12 runs exceed the declared 180 s watchdog interval
therefore trips it with a completely healthy transport underneath. Measured: the watchdog fired at
`[181.14s]`, during run 12/12, and block 2's runs took 181.3 s. Block 1 (178.9 s) and blocks 3–5
(177–182 s) sat just under. **The declared 180 s interval was not raised** — §16.8 makes raising a
declared ceiling during measurement an invalidator, so the block is reported invalid instead.

## 17.6 Evidence table — configuration S, the only admissible block

Artifact `bakeoff-report-1785794188.json`, block 1, schedule `ABBA BAAB ABBA`, n = 6 runs per
candidate (≥ 5 declared). p50/p95/p99 by sort-and-index over run-level values; **95 % CI by percentile
bootstrap over run-level means, 10,000 resamples** (§16.4's fixed plan — per-batch samples are not
independent and are not pooled for any CI).

| Metric (§16.4) | A — binary WebSocket | B — loopback HTTP streaming | Method / note |
|---|---|---|---|
| **t1 — raw transport receipt** | p50 **7299.30** · p95 7393.40 · p99 7393.40 ms · CI [7195.10, 7354.70] | p50 **7055.70** · p95 7096.40 · p99 7096.40 ms · CI [6879.68, 7065.52] | Consumer `performance.now()`, last payload byte at transport level. **Not a pure transport figure — see 17.7.** |
| **t2 − t1 — checksum segment** | p50 **0.10** · p95 0.40 ms · CI [0.10, 0.25] | p50 **0.10** · p95 0.10 ms · CI [0.03, 0.10] | Streaming chunk-wise hasher fed *during* receipt, so this segment holds only the final padding block. The per-byte hashing cost sits inside t1. |
| **Arrow decode (summed per-batch)** | p50 **101.80** · p95 108.10 ms · CI [93.80, 103.88] | p50 **149.70** · p95 152.40 ms · CI [133.63, 150.58] | Sum of `tableFromIPC` + column access per batch, mode F. B is **47.1 % slower**, consistent with Arrow copying 884/1000 batches for B and 0 for A. |
| **t3 — end-to-usable** | p50 **7444.30** · p95 7520.10 · p99 7520.10 ms · CI [7336.32, 7492.30] | p50 **7256.70** · p95 8576.60 · p99 8576.60 ms · CI [7122.17, 7896.00] | Mode F is a **separate transfer** from mode R, so t3 is that transfer's end-to-usable, not `t1 + decode` on one timeline. Stated because the naming invites the other reading. |
| **First-batch latency** | p50 **13.30** · p95 19.90 ms · CI [11.62, 16.35] | p50 **59.10** · p95 65.40 ms · CI [32.88, 61.60] | **A is 45.8 ms (4.44×) faster at p50**, and far tighter: A's six runs span 10.1–19.9 ms, B's span 18.4–65.4 ms. |
| **Transport throughput to t1** | p50 **33.60** · p95 34.54 · p99 34.54 MB/s · CI [33.25, 34.01] | p50 **35.01** · p95 36.05 · p99 36.05 MB/s · CI [34.61, 35.56] | `totalWireBytes ÷ t1`, 1 sample/run. **B faster by 4.02 %** (of B) / 4.20 % (of A) — **inside §16.9's 10 % band**. CIs do **not** overlap, so B's edge is real; it is simply under the declared threshold. |
| **Peak consumer JS heap** | p50 **22,616,507** · max 39,480,483 B · CI [16.44, 29.65] MB | p50 **42,861,791** · max 42,887,615 B · CI [33.73, 42.87] MB | `performance.memory.usedJSHeapSize`, sampled **per batch** (not on a time cadence). §6's `ArrayBuffer`-accounting limitation applies; this is an approximation, and WebView2 child-process totals are not summed. |

### Copy accounting — §7 stage 3 and stage 5, live-asserted per run

| Quantity | A | B |
|---|---|---|
| Frames needing reassembly (stage 3) | **0** / 1000, all 6 runs | **116** in 4 runs, **117** in 2 runs |
| Contiguous frames | 1000/1000 | 884 or 883 / 1000 |
| Arrow parse shares the wire buffer (stage 5) | **1000 / 1000**, all 6 runs | **116 / 1000**, all 6 runs |
| Arrow-parse copies (batches − shares) | **0** | **884** |
| **Total whole-payload copies per run** | **0** | **1000–1001** |
| Bytes copied per run | **0 B** | ~**244.6 MB** — one whole payload |

**The counter-intuitive line, and why it is not a reporting error.** B's *reassembled* frames share
the Arrow buffer (116/116) while its *contiguous* frames — the ones that paid no reassembly copy —
share it **0/884 times**. `web/scripts/bench-arrow-alignment.mjs` establishes the mechanism by
measurement rather than assertion: Arrow JS hands out a view **only when the payload's byte offset
inside its `ArrayBuffer` is a multiple of 8**, and copies otherwise (measured at offsets 0, 8, 16, 24,
40, 64, 128, 244600 → shares; 1, 2, 4, 7, 9, 12, 33, 65, 244601 → copies). A reassembled frame is a
fresh allocation with the payload at offset 8 — aligned. A contiguous frame is a subarray of a
network chunk at whatever offset the previous frame left. Since every frame stride here is itself a
multiple of 8 (244,568 B batch frame, 32 B progress frame), a run of contiguous frames can only be
misaligned if the **chunk's own base offset** is — which the 0/884 result therefore *demonstrates* for
WebView2's `fetch` body chunks. Candidate A escapes it because each WebSocket message arrives as its
own `ArrayBuffer` at offset 0, putting every payload at offset 8.

**Net effect: B pays exactly one whole-payload copy per batch either way** — 116 as an explicit
reassembly plus 884 hidden inside the Arrow parse. Counting only the reassembly counter would have
under-reported B's copies by **8.6×** (1000 ÷ 116).

**§16.9 rule 4 is honoured explicitly: A's `0` is 0 *application-level* copies, not zero copies.**
WebView2-internal WebSocket message assembly is opaque and its copy count is **UNKNOWN**; WebView2's
internal assembly of HTTP body chunks is equally opaque and equally **UNKNOWN**. No zero-copy claim is
made for either candidate (ADR-004). What is measured is a **differential on the instrumented,
application-level path**, and the unknown internal counts are not scored as a win for anyone. If
WebView2's internal WebSocket assembly copies more than its HTTP chunk delivery does, part or all of
A's differential could be offset — **this instrument cannot see that**, and 17.8 records it as an open
gap rather than resolving it by assumption.

### Allocation pressure

| Side | A | B | How established |
|---|---|---|---|
| **Producer, inside the timed interval** | **0 payload-sized allocations** | **0 payload-sized allocations** | Corpus batches are `bytes::Bytes`; both adapters clone the refcount and write the already-framed slice through unchanged. Pinned by `cloning_a_batch_shares_storage_rather_than_copying` and by both adapters emitting batch and progress as **separate** chunks. **Source-read + test-pinned, NOT live-asserted per run** — §16.2 asks for it "reported per run" and the artifact does not carry it (17.8 item 2). |
| **Producer-resident payload bytes** | — | S **978,240 B** · M **9,753,408 B** · L **48,753,216 B** | Measured out-of-band via `scripts/probe-producer-facts.mjs`. Each is **exactly 4 × batch wire bytes** against declared bounds of 1,222,800 / 12,191,760 / 60,941,520 B (5 ×) — the same one-batch-below-bound construction §15.5 records, holding at all three granularities. **Candidate B only** (see the script's scope note). |
| **Consumer, inside the timed interval** | **0** payload-sized allocations | **1000–1001 per run** at config S (116–117 reassembly buffers + 884 Arrow-parse copies) | Live-asserted per run by the decoder's reassembly counter and the per-batch buffer-identity check. |

§16.8's invalidator "any allocation of payload size inside the timed interval, on either candidate"
is read as **producer-side**, which is the context §16.2's bullet states it in ("both adapters take
the same shared immutable slice type"), and is the only reading consistent with §16.6 — which
explicitly anticipates the consumer-side reassembly copy and directs that it be **reported as a
limitation of the JS Arrow decoder's contiguity requirement, never as a property of HTTP**. Under the
strict literal reading, B's reassembly would invalidate every block including S. The ambiguity is
recorded here rather than resolved silently; the harness implements the producer-side reading.

Per §16.6's timebox clause: **no symmetric incremental consumer was attempted in Phase 2** — the
consumer that ran is the concatenating one, and B's copy is reported as the JS Arrow decoder's
contiguity requirement (now measured as an **8-byte alignment** requirement), not as a property of
HTTP.

### Memory sampling — the *actual* cadence, per §16.4

§15.8 item 4 found Phase 1 sampling at ~62.6 ms against a declared 50 ms. Measured again, from the
producer's own recorded inter-sample gaps:

| Config | samples | gap mean | gap p50 | gap p95 | gap max | declared |
|---|---|---|---|---|---|---|
| S | 14 | **60.98 ms** | 62.31 | 64.91 | 64.91 | 50 ms |
| M | 10 | **55.69 ms** | 53.88 | 63.46 | 63.46 | 50 ms |
| L | 16 | **59.46 ms** | 61.55 | 64.04 | 64.04 | 50 ms |

**The overrun found in Phase 1 persists: mean gaps run 11.4–22.0 % over the declared 50 ms interval
(p50s 7.8–24.6 % over), and no configuration's p95 came within 13 ms of it.** Peak producer memory
(`PrivateUsage`, `GetProcessMemoryInfo`), Candidate B, same probe: S **248,774,656 B** · M
**247,226,368 B** · L **246,132,736 B** (peak working set 250,904,576 / 253,779,968 / 272,760,832 B)
— consistent with §16.3's declared "one configuration at a time, fully RAM-resident" (~244 MB corpus
plus process overhead).

**These figures are out-of-band.** The Phase 2 browser artifact carries **none** of them: `phase2.ts`
never reads the stream id out of the OPEN frame, so it never calls `/facts/{stream_id}`, so no Phase 2
artifact contains producer memory, producer-resident bytes, or a sampling cadence at all. §16.4
requires the artifact to carry the actual cadence; it does not. Rather than assert the gap or edit
the harness after its gate, `scripts/probe-producer-facts.mjs` drives the real endpoints from outside
on a **separate server instance** that perturbs no measured block. Scope: **Candidate B only** — Node's
global WebSocket client cannot set an `Origin` header, so the WebSocket handshake correctly rejects
it. The sampler is candidate-independent (`start_sampler` is called from the shared `start_stream`),
so the **cadence** generalizes; the memory figures are labelled B-only.

## 17.7 The instrument's own ceiling — t1 is not a pure transport figure

Reported in the same place as the result it qualifies, because it is the single most important thing
to know about the throughput numbers above.

**All ten candidate × block throughput p50s fall in 32.31–35.01 MB/s** — a total spread of 8.4 %
across a **49.8× change in bytes per batch** (244,560 B → 12,188,304 B). A figure that barely moves
when the batch size moves 50× is not measuring the batch-oriented behaviour of a transport.

The consumer feeds every payload byte to a **pure-JavaScript streaming SHA-256** synchronously inside
the frame decoder, *before* the batch is yielded — so the hashing cost is inside t1, and the reported
t2 − t1 segment holds only the final padding block (measured 0.1–0.9 ms p50 across all blocks).
`scripts/bench-consumer-hasher.mjs` measures the harness's own `Sha256Stream`, unmodified, over the
Phase 2 payload:

| Chunk size | ms p50 | ms min | MB/s p50 | MB/s max |
|---|---|---|---|---|
| 244,560 B (S) | **4456.8** | 4072.8 | **54.71** | 59.87 |
| 2,438,352 B (M) | **4089.9** | 4051.5 | **59.62** | 60.18 |
| 12,188,304 B (L) | **4102.5** | 4038.5 | **59.42** | 60.36 |

Correctness gated first against `node:crypto` — a fast wrong hasher would prove nothing. **Method
limit: Node's V8, not WebView2's** — same engine family and JIT, different embedder, so this is
**indicative of** the in-browser cost, not identical to it.

**At configuration S the hasher alone accounts for 4456.8 ms of a 7055.7–7299.3 ms t1 — 61–63 %.**
So t1 is substantially consumer-hasher-bound, and 33–35 MB/s is a **floor, not a transport
capability**. This is the same class of instrument failure §16.0 records for Phase 1's generator,
relocated from the producer to the consumer; Phase 2 removed generation from the timed interval and
then put a comparably large per-byte cost back into it.

**Sensitivity check, and why it matters to the decision.** Both candidates pay the identical hashing
cost on the same thread, which compresses the *relative* gap between them. Subtracting the
S-configuration hasher p50 as a first-order correction: A 7299.3 − 4456.8 = 2842.5 ms, B
7055.7 − 4456.8 = 2598.9 ms → **86.04 vs 94.10 MB/s, a 9.37 % gap** where 4.02 % was measured.
That is still inside §16.9's 10 % band, but with **~0.6 pp of margin instead of ~6**. Since rule 2
selects **B** and rule 3 selects **A**, the branch this correction sits astride is the whole decision.
The correction is first-order only — receive and hash are not perfectly serial, and the constant is
Node-measured — so it is **not** used to switch branches. It is reported because a reader must not
take the 10 %-band finding as comfortable.

## 17.8 Harness gaps still open after `2e627fe`

Recorded so ADR-012 does not over-read this evidence. None of these change block 1's verdict.

1. **`debugAssertions` still never reaches an artifact, and Phase 2 does not even fetch `/clock`.**
   §15.8 item 1 recorded this for Phase 1; in Phase 2 the consumer skips `clockSync()` entirely, so
   the artifact has no build-profile record and no clock-offset bound. I verified release
   independently (17.1), so block 1 is admissible — but the next person still cannot confirm it from
   the report alone.
2. **§16.2's "zero payload-sized allocations inside the timed interval, **reported per run**" is not
   reported per run.** It is established by source-read and one unit test. The artifact contains no
   producer allocation counter.
3. **The Phase 2 artifact carries no producer-side facts at all** — no memory, no resident bytes, no
   sampling cadence, no producer digest comparison — because the stream id is never read from the
   OPEN frame. §16.4's "the result artifact must contain … the actual memory-sampling cadence" is
   therefore **not met by the artifact**; 17.6 supplies the numbers out-of-band instead.
4. **The bootstrap seed in the artifact is not the declared seed.** §16.4 declares
   `0x5EED205600000002`; `phase2.ts` uses `0x5eed2056` in a 32-bit LCG, which cannot hold the declared
   64-bit value. `scripts/analyze-phase2.mjs` re-runs the declared plan with the declared seed through
   splitmix64; every CI in 17.6 is from that script. The harness's own throughput CIs agree to within
   bootstrap noise (its S figures: A [33.25, 34.00], B [34.62, 35.56]).
5. **Report filenames have one-second resolution and silently overwrite.** In block 2 the watchdog's
   partial-failure report and the block report were both written as
   `bakeoff-report-1785794447.json`; the block report survived and the partial-failure artifact was
   lost. In an artifact-based methodology this is a data-loss hazard, not a cosmetic one.
6. **The progress frame's `total` field is wrong at S and L.** Both adapters are handed Phase 1's
   `BATCH_COUNT` (100) as `total_batches` regardless of configuration, so progress frames announce
   `total=100` for a 1000-batch or 20-batch stream. Phase 2's consumer does not read it, so no
   measurement is affected — but the same constant also drives the HTTP facts watcher, which
   therefore declares `Completed` early at configuration S.
7. **H2 and H3 are not exercised in Phase 2 at all.** The Phase 2 flow runs no cancellation trial and
   no backpressure pause; those gates stand on Phase 1's §15 record, per §16.1. The producer-resident
   plateaus in 17.6 are the only Phase-2 bounded-memory evidence, and they were obtained out-of-band.
8. **N=2 concurrency (§16.2's secondary configuration) was NOT executed** — see 17.10.

## 17.9 §16.9's decision rule, applied exactly as written

Applied in order, quoting only figures from **block 1, configuration S**, the sole admissible block.

**1. "A failed hard gate disqualifies the candidate, regardless of throughput."**
Neither candidate failed a hard gate. Within Phase 2's scope: correctness (60/60 runs, digest matched
manifest, 10 M rows, CRS tag on every batch after re-chunking), JSON-free data path (0 frames, both
endpoints), no transport leakage (leakage scan PASS with a live canary), progress + single terminal
per stream (`Completed` 60/60). H2, H3 and H4 stand on Phase 1's §15 verdicts, which §16.1 preserves.
**Both candidates remain eligible. Rule 1 disqualifies neither.**

**2. "If transfer-isolated throughput differs by more than 10 %, select the faster eligible candidate."**
Measured at S: **A 33.60 MB/s p50 (CI [33.25, 34.01]) vs B 35.01 MB/s p50 (CI [34.61, 35.56])**.
B is faster by **4.02 %** of B, **4.20 %** of A. Both are **under 10 %**, so **rule 2 does not fire**,
and the tie-break is reached — this time on a *measured* near-equality rather than Phase 1's untested
one. Two qualifications, both stated rather than buried: the CIs do **not** overlap, so B's advantage
is statistically real and merely sub-threshold; and 17.7's sensitivity check puts the
hasher-corrected gap at **9.37 %**, still under 10 % but close enough that this branch cannot be
called robust.

**3. "If within 10 %, apply §12's existing ordering using measured end-to-end cost: copies and
allocation pressure, then cancellation simplicity, then security surface."**
Criterion 1, **copies and allocation pressure**, resolves on measured data:

| | A | B |
|---|---|---|
| Whole-payload copies per run (S) | **0** | **1000–1001** |
| Bytes copied per run | **0 B** | ~**244.6 MB** |
| Payload-sized consumer allocations per run | **0** | **1000–1001** |
| Peak consumer JS heap, p50 | **22.6 MB** | **42.9 MB** |

**Criterion 1 selects Candidate A**, and decisively: B copies one whole payload per run that A does
not, and carries ~1.9× A's peak JS heap. Criterion 1 being decisive, criteria 2 and 3 are not reached.
Recorded as context only, and unchanged from §15.7: criterion 2's cancellation-ack difference sits at
the edge of Phase 1's ±0.400 ms clock bound and must not be leaned on, and criterion 3 **favours B**,
which has no consumer→producer channel at all.

**4. "An unknown internal copy count is not a win."**
Honoured. A's **0** is **0 application-level copies**; WebView2-internal WebSocket message assembly is
**UNKNOWN**, as is WebView2's internal HTTP chunk delivery. Neither candidate is claimed zero-copy.
The win recorded under criterion 1 is a **measured differential on the instrumented path**, not a
claim about the opaque segment — and if WebView2's internal WebSocket assembly copies more than its
HTTP path does, that differential shrinks by an amount this instrument cannot measure.

**5. "If results change materially with batch size, report that no transport-independent winner
exists, and identify the batch-size policy the product needs."**
**This rule cannot be evaluated, and that is the finding that governs the outcome.** Two of the three
preregistered batch sizes produced **no admissible block** across two blocks each (17.3, 17.5), so
there is admissible evidence at exactly **one** batch size. I cannot report that results change
materially with batch size, and I cannot report that they do not.

### Outcome

**Candidate A — binary WebSocket — is selected at configuration S, and Phase 2 does not close the
transport decision.**

Rules 1–4 resolve in A's favour on the one admissible block: both eligible, throughput inside the
10 % band, and A pays 0 whole-payload copies per run where B pays 1000–1001. **That is the same
candidate Phase 1 provisionally selected, but it is now supported by a transfer-isolated measurement
rather than a generation-bound one** — §16.0's precondition for reaching the tie-break is, at
configuration S, tested rather than assumed. Phase 2 was explicitly allowed to overturn Phase 1
(§16.0) and did not; that is a result, not a confirmation of the earlier method.

It does not close the decision, for reasons stated in §16.9's own text and §16.10's:

- **§16.9 rule 5's closing clause is binding: "a transport chosen only for one batch size is not a
  transport decision."** One admissible configuration is what this execution produced.
- **The throughput branch is not robust.** Rule 2 would select **B**; rule 3 selects **A**. The
  measured 4.02 % gap sits inside the 10 % band, but 17.7's first-order correction for the shared
  consumer-side hashing cost moves it to 9.37 % — and the instrument cannot say where inside or
  outside that band the true figure lies.
- **The instrument's throughput ceiling is the consumer's own hasher, not either transport** (17.7).
  Phase 2 removed the generator from the timed interval and left a comparably large per-byte cost in
  it. §16.0's diagnosis of Phase 1 applies again, in a new place.

**What this recommends to ADR-012, put to the human rather than decided here:** ADR-012 stays
**Proposed**. Its Decision is not replaced — Phase 2 selected the same candidate — but its evidence
basis should be amended to cite configuration S's transfer-isolated block and this section's limits,
and its throughput language must not claim a measured transport ceiling for either candidate.

**The batch-size policy question §16.9 rule 5 asks the product to answer is left open, deliberately.**
Naming a policy from one admissible batch size would be exactly the inference rule 5 forbids. What
block 1 does supply toward it, as a measured input rather than a conclusion: at 244 KB batches A
delivers the first batch in **13.30 ms p50 (10.1–19.9 ms across six runs)** against B's **59.10 ms
p50 (18.4–65.4 ms)** — 4.44× faster and far tighter, which is the figure `docs/01`'s never-block-the-
canvas rule cares about.

## 17.10 Scope limits

§16.10's pre-declared limits all hold. Additionally, and specific to this execution:

- **N = 2 concurrency, §16.2's secondary configuration, was NOT executed.** It is **not implemented in
  the consumer** — no concurrent-stream path exists in `web/src/` (grep for concurrency/parallel/
  `Promise.all` across the consumer sources returns nothing). Every figure here is **single-stream,
  N = 1**. Nothing in this section may be read as covering concurrency, and §16.3's declared "max
  concurrent streams: 2" ceiling was never driven to.
- **Only configuration S has admissible numbers.** M and L appear in 17.3 and 17.5 solely as the
  record of what the gate caught. Their per-run figures are in the committed artifacts and are
  **inadmissible as measurements** (§8), exactly as §14's pre-fix figures are.
- **One machine, one GPU, one Edge build (150.0.4078.105), one admissible block per §16.5's minimum.**
  Block 1 supplies 6 runs per candidate against a declared minimum of 5; there is no second
  admissible S block, so between-block variance at configuration S is uncharacterised.
- **Rendering is excluded from Phase 2 entirely** (§16.3), so this section reports **no** first-pixel,
  frame-time or VRAM figure. §16.4 lists first-pixel as a separate segment; the Phase 2 consumer does
  not render, and no such number is fabricated here. Phase 1's §15.3 remains the only measured
  first-pixel evidence.
- **The corpus is synthetic and structurally regular** — fixed-width, non-nullable, `u64` + two `f64`
  columns. The buffer-sharing and alignment results in 17.6 are **conditional on that shape**;
  GeoArrow variable-width geometry, dictionary/string columns and nulls are not exercised and could
  change the Arrow-parse copy result in either direction.
- Windows/WebView2 only. Loopback only. No GeoParquet, no DuckDB, no spatial index, no picking, no
  editing, no reprojection. Interruptible Tauri IPC channels — ADR-004 amendment 2's third transport
  class — remain **unmeasured**, and ADR-012 must keep recording that exclusion.

## 17.11 Reproducing this

Scripts are committed beside the harness rather than run by hand, so a block and its analysis are
reproducible rather than a described sequence.

```sh
cd protocol/transport-bakeoff
cargo test --release && cd web && npm run verify && cd ..
cargo build --release

node scripts/run-phase2.mjs S          # one configuration = one 12-run counterbalanced block
node scripts/run-phase2.mjs M
node scripts/run-phase2.mjs L

node scripts/analyze-phase2.mjs results/phase2/*.json          # independent verdict + statistics
node --experimental-strip-types --no-warnings \
     scripts/bench-consumer-hasher.mjs                          # 17.7's instrument ceiling
cd web && node scripts/bench-arrow-alignment.mjs                # 17.6's alignment law
cd .. && node scripts/probe-producer-facts.mjs M                # 17.6's cadence + producer memory
```

Artifacts for all five blocks are committed at `results/phase2/` with `SHA256SUMS`.

---

# 18. Phase 2 instrument findings — recorded by the harness author, post-review

§17 is the tester's record of what the runs produced. This section records defects in **the
instrument** found during the review of Phase 2, including two declared controls that were not
actually in force. Recorded here rather than in §17 so the tester's execution record stays its own,
and rather than by editing §16, which is the preregistration.

**None of these change the §16.9 outcome** — the outcome is "rule 5 unevaluable", and it is
unevaluable because M and L returned no admissible block, which none of the below affects. They do
change what a future phase must fix first.

| # | Finding | Status |
|---|---|---|
| P1 | **F7's fix was partially reverted, and §16.2 claims otherwise.** §16.2 declared "one write per batch on both, re-verifying that F7's fix survives the corpus change". It does not survive: `86df830` split batch and progress into two writes on **both** adapters (`adapter_ws.rs`, `adapter_http.rs`) because concatenating them would have allocated a payload-sized buffer inside the timed interval. F7's *accounting* half does survive — both still `note_written` at handoff — so §8's unequal-instrumentation invalidator is not tripped. But F7's stated rationale was **cancel-window doubling on Candidate A**, and that is reintroduced: the `biased` select cannot poll for a CANCEL frame while either send is pending, so A has two cancel-blind windows per batch and B, having no consumer→producer channel, has no analogue. **The two writes are symmetric in count but not in consequence.** Nothing caught it because Phase 2 runs no cancellation trial. | **Open** — must be resolved before any phase that measures cancellation |
| P2 | **`TCP_NODELAY` was declared but never set or recorded.** §16.2 declared it "set identically and recorded". It is neither: the listener sets no socket options and no artifact field records the state. This compounds P1 — a 32-byte progress write issued immediately after a large batch write, with Nagle live, is exactly the shape where delayed-ACK interaction appears. No claim is made that it affected the S-block figures; the claim is that a declared control was silently absent while §17 presents itself as the compliance record. | **Open** — set and record it, or strike the declaration |
| P3 | **§16.5's order-effect gate cannot be passed by a true null.** As operationalized, `ratio = \|earlyGap − lateGap\| / \|mean gap\|` divides the interaction by **the effect under test**. As the candidate difference approaches zero the ratio diverges regardless of how clean the block is, so "the candidates are indistinguishable" is mechanically converted into "block inadmissible" — which is what happened at M and L. The gate was honoured as written rather than argued around (§17.5), and that was right; but **the gate as written is unusable and must be respecified before another block is run** — normalize to within-block SD or to the grand mean, or gate on the interaction in absolute MB/s. | **Open** — respecify before the next phase |
| P4 | Configuration S — the sole admissible block — **passed the order-effect gate at 4.6 % against the 5 % threshold**, clearing by 0.4 pp the gate that invalidated the other four blocks. Recorded because it further supports withholding a status change: the one block that survived did so narrowly, under a gate P3 shows to be miscalibrated in both directions. | Recorded |
| P5 | The Phase 2 **watchdog brackets all 12 runs in one begin/end pair with no heartbeat inside**, so any block exceeding 180 s trips it with a healthy transport underneath (block 2, fired at run 12/12). The declared interval was **not** raised — §16.8 forbids raising a ceiling mid-measurement. | **Open** — needs a per-run heartbeat |
| P6 | The Phase 2 artifact **carries no producer facts at all**: the consumer never reads the stream id, so it never calls `/facts`. Producer-side resident bytes, cancellation instants and memory samples had to be obtained out of band. Every producer-side assertion in §16 is therefore unverifiable from the Phase 2 artifact alone. | **Open** |
| P7 | The declared bootstrap seed `0x5EED205600000002` is **truncated to 32 bits** by the harness's LCG, so the seed used is not the seed declared. The tester worked around it by recomputing every CI with the declared 64-bit seed through splitmix64 out of band, so §17's intervals follow the declared plan — but the harness does not. | **Open** |
| P8 | `declaredAssertions.ceilings.creditWindowBytes` in the artifact carries the **producer-resident bound** (5 × batch), not the credit window (4 × batch). §16.3's credit-window figure appears in no artifact under its own name. Mislabelling only; §17 uses the correct figure in prose. | **Open** |
| P9 | §16.9 rule 2 says "differs by more than 10 %" without defining **the denominator**. The S-block gap is 4.02 % of B or 4.20 % of A; the hasher-corrected gap is 8.57 % of B or 9.37 % of A. §17 uses the conservative pairing, erring toward overstating risk — but an undefined denominator in a decision rule is a researcher degree of freedom and must be fixed before the rule decides anything. | **Open** — fix §16.9 before the next phase |

**Consequence, stated plainly:** P1, P2, P3, P5, P6 and P7 all have to be closed before another
counterbalanced block is worth running, and P3 and P9 have to be closed before §16.9 can decide
anything at all. Phase 2's contribution is therefore narrower than "it measured the transports": it
established that the S configuration behaves as Phase 1 suggested, and it established that this
instrument is not yet capable of answering the batch-size question the decision turns on.

---

# 19. Phase 3 addendum — repaired instrument, re-measurement (preregistered)

> **Void clause, mirroring §0 and §16.** This addendum is written and committed **before any Phase-3
> harness code exists**. Git history is the proof: **if any Phase-3 harness commit precedes this §19
> commit, §19 is void.** Two files are committed *with* §19 and are covered by this clause rather
> than excepted from it: `scripts/sim-order-statistic.mjs` (§19.2's operating-characteristic
> simulation) and `scripts/precision-check.mjs` (§19.7's budget check). Neither touches a transport,
> an adapter, a consumer or a corpus; both are justification for the design and are committed here so
> the reasoning is auditable at the moment it is declared, not reconstructed later.

## 19.0 Why there is a Phase 3, and what it can and cannot contribute

Phase 2 returned one admissible block of five. §18 records nine instrument defects, two of which are
**declared controls that were never in force**. Phase 3 repairs the instrument and re-measures.

**Stated against myself, because the chronology matters.** §16.5's order-effect gate was declared
before Phase 2 ran. It fired on four of five blocks. Its defect was identified **afterwards**, in
post-review, and recorded as §18 P3. A reader must not have to infer that ordering: I am removing a
preregistered invalidator **after seeing it reject most of my data**. That is the exact shape of
result-shopping, and no amount of good faith on my part distinguishes it from the real thing. What
distinguishes it is that the defect is **algebraic and demonstrable without any data at all**
(§19.2), and that the demonstration is committed as a seeded simulation anyone can re-run. If the
argument in §19.2 does not stand on its own, this change should be rejected regardless of what
Phase 3 measures.

**What Phase 3 can contribute, declared before measuring so it cannot be inflated afterwards.** At
the precision this budget buys (§19.7), the CI for the candidate effect will most likely sit
**entirely inside ±10%**, which routes to the equivalence branch, which falls through to the
copies-first ordering, which currently favours Candidate A. **Phase 3 is therefore not primarily a
race, and must not be reported as one.** Its informational contribution is:

1. **Whether the ranking depends on batch size** — §16.9 rule 5, unevaluable in Phase 2, and the one
   question that determines whether a transport decision is possible at all.
2. **Whether the copy differential persists** once the consumer-side hasher is out of the timed path
   and at every configuration, not just at S.
3. **Whether N=2 changes anything**, and whether the declared aggregate ceilings hold.

Saying this in advance is the honest disclosure required by `docs/01` principle 1: a design that can
only confirm its expected answer is not a study. The branch that keeps this falsifiable is
**inconclusive** (§19.9), and it is retained at its declared width rather than widened to make a
decision more likely.

## 19.1 What is superseded, enumerated

§16 is **left byte-identical**. Nothing in §1–§18 is edited. The following named clauses are
superseded **for Phase 3 only**, dated **2026-08-04**; Phase 2's verdicts under them stand unchanged.

| Superseded clause | Text | Replaced by | Ground |
|---|---|---|---|
| §16.5 bullet 4 | "Order effects are reported … if it exceeds **5%** of the candidate main effect, the block is reported as confounded and invalid." | §19.3 | §18 P3 / §19.2 — the statistic is degenerate for its stated purpose |
| §16.8 bullet 7 | "order effect exceeding the declared 5% threshold" (as an invalidator) | §19.3 + §19.8 | as above; the invalidator count does not decrease — see §19.8 |
| §16.4 sentence 2 | "**t2 — checksum complete.** Fed by a streaming, chunk-by-chunk hasher on both candidates" | §19.5 | §17.7 — the hasher consumed 61–63% of t1, so t1 was not a transport figure |
| §16.4 analysis plan | "Confidence intervals by percentile bootstrap over run-level means" | §19.3 | measured under-coverage (86.9–90.8%) at these sample sizes; see §19.3 |
| §16.3 watchdog row | "180 s / 600 s" | §19.7 | §18 P5 — one begin/end per block with no heartbeat; a 20-run block trips it with a healthy transport |
| §16.9 rules 2–3 | "differs by more than 10%" (denominator undefined) | §19.9 | §18 P9 — undefined denominator is a researcher degree of freedom |

**Phase-2 blocks are not re-analysed under any of this.** §16.1's discipline carries forward: the
four invalid Phase-2 blocks stay invalid, the new statistic is **not** applied to them, and no signed
effect estimate derived from them appears in this document, in any Phase-3 results table, or in
ADR-012. §19.7 uses **dispersion** from those blocks as declared design input, which is a different
thing and is labelled as such where it is used.

## 19.2 The defect in §16.5's statistic — algebra first, simulation second

As implemented in `web/src/phase2.ts::orderEffect`:

```
ratio = |earlyGap − lateGap| / |(earlyGap + lateGap) / 2|
```

The numerator is the **drift × candidate interaction** — the quantity an order-effect gate should
measure. The denominator is the **candidate main effect** — the quantity the entire study exists to
estimate. As the two candidates converge, the denominator → 0 and `ratio` → ∞ **for any non-zero
interaction noise whatever**. The gate therefore rejects most strongly exactly when the candidates
are most alike. "The transports are indistinguishable" — a legitimate and pre-declared outcome of
this study (§16.9 rule 3) — is mechanically converted into "the block is inadmissible."

This holds independent of any measurement. `scripts/sim-order-statistic.mjs` (seed
`0x5eed305100000001`, 4000 blocks per cell) makes the operating characteristic concrete:

| True candidate effect | §16.5 invalidation rate, **zero drift** |
|---|---|
| 0.0% (true null) | **98.4%** |
| 1.0% | 96.4% |
| 5.0% | 83.5% |
| 10.0% | 68.9% |
| 20.0% | 44.2% |

**At zero drift the gate rejects 98.4% of blocks.** Its rejection rate is driven almost entirely by
the effect size and barely at all by drift — the rows at 1%, 3% and 5% drift are within ~1 pp of the
zero-drift row throughout. For a gate whose declared purpose is detecting drift, that is the
diagnosis: it is not measuring what it was declared to measure.

## 19.3 The replacement — paired symmetric effect, with drift reported separately

**Estimator.** The `ABBA BAAB ABBA` schedule already decomposes into adjacent pairs, each holding one
A run and one B run, alternating `AB`/`BA` so the decomposition is order-balanced by construction.
Phase 3 keeps that property at its own length (§19.7). For each pair *i*:

```
θ_i = 2 · (thr_B − thr_A) / (thr_A + thr_B)
```

where `thr` is throughput (bytes ÷ t1), so **higher is better** and **θ > 0 means Candidate B is
faster**. Pair-level θ values are the unit of analysis — one number per pair, more conservative than
run-level means, and per-batch samples are never pooled (§16.4's pseudo-replication discipline
carries forward unchanged).

**This closes §18 P9, and that is stated here rather than left to be noticed.** §16.9 rules 2–3 said
"differs by more than 10%" without saying 10% *of what*: the Phase-2 S gap was 4.02% of B or 4.20%
of A, and the hasher-corrected gap 8.57% of B or 9.37% of A — a spread that straddled a decision
boundary purely by choice of denominator. The symmetric form takes the denominator to be the **mean
of the two candidates**, `(A + B)/2`, which is fixed by the formula and cannot be chosen after the
fact. §19.9's ±10% is on this symmetric scale. **Conversion, so the redefinition is visible rather
than inferred:** a symmetric θ of 10% corresponds to B being 10.53% faster than A when expressed
against A, or 9.52% when expressed against B. The band is therefore marginally *stricter* than the
more permissive of the two readings §16.9 allowed, not looser.

**Interval — Student-t, chosen on measured coverage, not convention.** §16.4 declared a percentile
bootstrap. At these sample sizes it under-covers, and the direction of the error matters: an
under-covering interval is too narrow, which systematically over-selects "entirely within ±10%" —
the branch that falls through to the copies ordering and selects Candidate A. An anti-conservative
interval would bias this study toward its own expected answer. Measured coverage of a nominal 95%
interval (same simulation, 4000 blocks, true effect 2%, drift 3%, noise SD 1%):

| Pairs | Percentile bootstrap | **Student-t** | BCa |
|---|---|---|---|
| 6 | 86.9% | **95.8%** | 87.1% |
| 8 | 88.4% | **94.9%** | 88.4% |
| 10 | 90.0% | **95.1%** | 90.1% |
| 12 | 90.8% | **95.3%** | 90.6% |

**The Student-t interval over pair-level θ is the decision interval.** The percentile bootstrap is
retained and reported alongside it — 10,000 resamples, declared seed `0x5EED305100000001`, **held at
full 64 bits through splitmix64**, closing §18 P7. It is reported because the human directed the
bootstrap discipline be carried forward, and because a disagreement between the two is itself
informative: **if the t interval and the bootstrap interval select different §19.9 branches, the
outcome is inconclusive**, regardless of which branch the t interval alone would pick. That rule is
declared here, before measuring.

**Drift is reported, and — contrary to what I expected when designing this — is not a gate.** The
adjacent-pair decomposition cancels drift exactly when drift is linear in position; I assumed
non-linear drift would degrade the estimator and that a drift gate would therefore be the
replacement control. The simulation falsifies that. Across four drift shapes (linear, quadratic,
step, transient spike) at 10 pairs, measured coverage stays within **94.5–98.0% up to 50% drift**:
drift inflates the between-pair SD, which *widens* the interval, which is the conservative
direction. Inventing a drift invalidator anyway would repeat §16.5's error — discarding sound blocks
to look rigorous.

So the declared control is weaker than an invalidator, deliberately, and says so:

- **Observed drift** is defined as `(max pair-mean throughput − min pair-mean throughput) / grand
  mean of pair-means`, reported per block.
- **Above 20%**, a block is **flagged**: reported with its drift stated, and **its result may not be
  the sole basis for a §19.9 decision** — it may corroborate other blocks but not decide alone. The
  ground is not estimator bias (there is none up to 50%) but that a 20% swing in machine throughput
  within a single block means the §2 reference profile was not held, which is a §8 concern in its own
  right.
- **The residual assumption is stated:** pair-level cancellation is exact only for drift linear in
  position, and the simulation covers four shapes, not all shapes. An adversarial drift correlated
  with the AB/BA alternation itself would defeat it; nothing in the design rules that out, and the
  counterbalanced alternation is what makes it unlikely rather than impossible.

**§19.8 shows the invalidator count does not silently decrease.**

## 19.4 Instrument repairs required before any Phase-3 measurement

Every §18 finding is closed here. **No Phase-3 measurement is admissible until all of these are
committed and R1–R8 pass on the repaired tree (§19.6).**

| # | Repair | Verified by |
|---|---|---|
| P1 | Candidate A's control path is split from its send path, so a CANCEL frame is observed **while a send is pending**. F7's fix is not merely restored — the two-write structure stays (it is what keeps the timed interval allocation-free) and the cancel-blind window is removed instead. | **R6 must demonstrate it.** A source diff is not acceptable evidence; the regression must show the window is gone against a send deliberately held in flight. |
| P2 | `TCP_NODELAY` set on every accepted connection for **both** candidates, and its state written into every artifact. | Assertion in the artifact; a test that reads the socket option back |
| P3 | §16.5's gate replaced per §19.3 | `scripts/sim-order-statistic.mjs` |
| P4 | (recorded observation, no repair — configuration S cleared the old gate by 0.4 pp) | n/a |
| P5 | Per-run watchdog heartbeat. Declared intervals raised **in advance** (§19.7): **60 s per run**, **1800 s per block**, replacing §16.3's 180 s/600 s. | A block of the declared length must not trip it with a healthy transport |
| P6 | The consumer reads the stream id from the OPEN frame and fetches `/facts`, so **producer-side facts reach the artifact**: resident bytes, memory samples, the actual sampling cadence, the producer's own digest, allocation counters. | Artifact contains a non-empty producer facts block for every run |
| P7 | Declared 64-bit seed held through splitmix64; no 32-bit truncation anywhere. | Unit test: the declared seed's first outputs match a reference vector |
| P8 | `creditWindowBytes` renamed to what it holds. The artifact carries **both** `producerResidentBoundBytes` = (4+1)×batch and `creditWindowBytes` = 4×batch, under their own names. | Artifact field assertion |
| P9 | Closed by §19.3's symmetric denominator — see the explicit statement there. | n/a |

Additionally, two Phase-2 gaps recorded in §17.8 are closed because Phase 3's assertions depend on
them: `debugAssertions`/build profile and clock-offset bound must reach the artifact (§17.8 item 1),
and the progress frame's `total_batches` must carry the **configuration's** batch count rather than
Phase 1's constant (§17.8 item 6).

## 19.5 Hashing off the timed path — and what H1 no longer claims

§17.7 established that a pure-JS streaming SHA-256 inside the frame decoder consumed **61–63% of t1**
at configuration S, making "33–35 MB/s" a floor of the instrument rather than a capability of either
transport. Phase 3 removes it from the timed path.

**Design.** Timed runs carry **no cryptographic hasher**. Correctness is established two ways:

1. **Inside every timed run — a structural digest, O(batches) not O(bytes).** For each batch: its
   index, its declared length, and its first and last 8 bytes, folded into a 64-bit accumulator.
   Cost is independent of payload size, so it cannot become §17.7's defect at reduced amplitude.
2. **Alongside every configuration — a separate untimed verification run per candidate**, which
   hashes the entire stream and asserts the wire digest against the server manifest.

**What this detects, and what it does not — stated plainly rather than papered over with a
loopback-TCP argument.** The timed run detects truncation, dropped or reordered batches, frame
boundary corruption, and a length field that lies. It does **not** detect silent corruption of
payload interior bytes. That is covered by the untimed verification run, on a different transfer of
the same corpus. `docs/01` principle 3 permits a claim at a declared level; it does not permit
carrying the old claim's wording. Accordingly:

> **H1's grade for Phase 3, declared:** cryptographic digest identity is established **per candidate
> per configuration, on a dedicated verification transfer** — not on every timed run. ADR-012's
> evidence sentence "digest identical across both adapters and all runs" does not survive Phase 3
> unamended and must be corrected when Phase-3 evidence is written.

**Equal instrumentation, which is the §8 hazard this creates.** The verification run and the timed
runs must be **the same build**, with hashing gated by a runtime flag. The flag's value is written
into every artifact. A test pins that the transport and decoder paths are byte-identical between the
two modes apart from the hasher call itself — otherwise the thing verified is not the thing measured,
which is §8's "unequal instrumentation" in a new location.

**Why not the alternative.** Retaining every batch and hashing after t1 with native
`crypto.subtle.digest` would keep H1 same-run, which is better on its face. It is rejected because
retaining 240 MB inside the timed window contaminates peak JS heap and allocation pressure — and
those are precisely the measurements §19.9's equivalence branch decides on. Trading the decisive
metric to improve a metric that is already covered is the wrong trade. A per-byte non-cryptographic
checksum (CRC32) is rejected outright: it reintroduces a per-byte cost of the same order as the
figure being measured.

## 19.6 R1–R8 re-run — the admissibility gate, restated

§16.7's R1–R8 are retained verbatim and **must all pass on the repaired tree before any Phase-3
measurement is admissible**. Passing them in Phase 2 does not carry over: the tree has changed, and
P1 changes an adapter's control path.

**R6 carries an additional, explicit obligation.** P1's fix may not be asserted from the diff. R6
must demonstrate, browser-free, that Candidate A observes a CANCEL frame **while a batch send is
pending** — the specific window `86df830` reintroduced. A regression that only shows cancellation
working between sends does not discharge P1 and leaves Phase 3 inadmissible.

**R7 gains the aggregate case:** bounded memory must hold at N=2 against the declared aggregate
bound (§19.7), measured, not derived.

## 19.7 Budget, schedule, restart policy, stopping rule, and the precision check

**Configurations.** Four: **S**, **M**, **L** (§16.2's sizes, unchanged) and **N=2**.

**Configuration S is included, and the reason is a rule-5 requirement rather than thoroughness.**
§19.9 rule 5 compares across batch sizes. Phase 2's S block carried the hasher in the timed path;
Phase 3's M and L will not. Comparing the two would confound an instrument change with a batch-size
effect and produce a rule-5 answer that is an artifact of the repair. S is also the cheapest
configuration to run.

**N=2, fully specified — an underspecified concurrency configuration would be §18 P9 repeating one
section later.**

| Parameter | Value | Why |
|---|---|---|
| Batch size | **M** (2,438,344 B) | N=2 tests concurrency, not batch size; holding batch size at M makes the concurrency delta attributable by comparison against the M block |
| Candidates | **Both streams the same candidate** | The comparison is A vs B; a mixed pair measures neither |
| Start offset | **Simultaneous** — the second stream opens as soon as the first's OPEN frame is received | `docs/05`/`docs/06`'s justifying case is a publish/export read running *while* the canvas streams (`docs/01`'s never-block-the-canvas rule, `docs/03`/ADR-008) — genuine overlap, not a stagger |
| Payload | Each stream sends the **full corpus**; 480 MB aggregate | Halving per stream would make per-stream behaviour differ from the M block and destroy the comparison |
| θ denominator | **Aggregate** throughput: total bytes across both streams ÷ (first open → last t1) | The ceiling is declared on the aggregate; per-stream figures are reported as descriptive |
| Corpus residency | One shared corpus, built once — both streams send the same immutable bytes | 244 MB corpus + 2 × 12,191,720 B producer-resident, not 2 × 244 MB |

**Declared aggregate ceilings (ADR-010 rule 6), and the exercise that drives past them.**

| Ceiling | Value |
|---|---|
| Max concurrent streams | **2** |
| Producer-resident bound, aggregate | **2 × (4+1) × batch wire bytes** = 24,383,440 B at M — asserted as **measured**, not derived from "credit is per-stream" |
| Consumer decoder buffer high-water, aggregate | ≤ 2 × 2 × batch wire bytes |
| Watchdog | **60 s per run** (heartbeat), **1800 s per block** — raised here, in advance, replacing §16.3's 180 s/600 s |

**The N+1 exercise.** A third concurrent stream is opened. It must be **refused at open**, surfaced
as a declared terminal outcome, never admitted-and-degraded and never silently queued. Two
constraints follow, and they are limits on this harness's authority as much as on its code:

- **No new error variant, no new control frame.** §5 declares the taxonomy
  `Cancelled | ProducerFailed | TransportFailed | DecodeFailed`. The refusal maps into
  `TransportFailed` with an opaque `detail`. Minting a variant would be the data plane acquiring
  control-plane vocabulary, blurring the `docs/02` split inside scaffolding.
- **The harness declares its own recovery policy only.** ADR-010 rule 7 binds long-lived sessions to
  declare a recovery policy; §10 already declares `none` for this harness, and that is what is
  declared for the refused third stream: surfaced as a terminal outcome, no retry, run invalid if not
  surfaced. **What a real client should do on an admission refusal — retry, back off, queue — is not
  declared here and must not be inferred from this harness.** That is SKP surface design, which
  `docs/10`'s specification checklist owns and §5 puts outside this directory. The concurrency and
  admission decision is owed and is **not** ADR-012's; it is recorded as an open item, not resolved.

**Sample count.** **10 pairs = 20 timed runs per configuration**, in `AB BA AB BA AB BA AB BA AB BA`
— 5 `AB` and 5 `BA`, order-balanced at the pair level. Plus **2 untimed verification runs** per
configuration (one per candidate, §19.5). Total: 80 timed runs, 8 verification runs.

**Process-restart schedule.** Fresh server process and fresh browser profile **per configuration
block**; fresh connection **per run** (§16.2, unchanged). **No restart within a block** — a mid-block
restart is itself an order effect, and it is what §16.5's whole-block-replacement rule exists to
prevent.

**Stopping rule, bounded in advance.** No optional stopping: every block runs its full 20 runs before
any comparison is computed. An invalidated block is replaced **whole**, and **at most once**. A block
that fails twice is reported as failed and **not attempted a third time in this phase**. Total wall
clock is bounded at **90 minutes**; if exceeded, the session stops and reports what completed. This
is what "one bounded schedule" means, and it is fixed here so that a disappointing result cannot buy
another attempt.

**Precision check — run and reported before the schedule, per the human's directive.**
`scripts/precision-check.mjs` computes the predicted CI half-width for θ at the declared budget.

Its dispersion input is **pair-level SD from the Phase-2 blocks, including the invalid ones**, and
that provenance is declared rather than hidden (`docs/01` principle 8). This is legitimate where a
signed effect estimate would not be: a run-count choice cannot select a candidate, only widen or
narrow an interval, and the inconclusive branch already absorbs the consequence. **No signed effect
from those blocks is computed, reported, or carried into ADR-012.** Sizing is against the **largest**
observed dispersion, not the mean.

The check must also carry the hasher correction: removing a large common per-byte cost rescales both
θ and its SD by `t1_mean / (t1_mean − hasher_ms)`, measured at **2.18–2.67×** across the Phase-2
blocks. Predicted half-widths at 10 pairs (t, 9 df = 2.262), as the script actually computes them:

| Dispersion basis | Pair-level SD, projected | Predicted half-width | Fits ±10%? |
|---|---|---|---|
| Cleanest Phase-2 block | 1.75 pp | **±1.25 pp** | yes, comfortably |
| Noisiest Phase-2 block | 12.64 pp | **±9.04 pp** | yes — by under 1 pp |

**Verdict rule, declared before the check is run:** if the predicted half-width cannot fit inside
±10% **even on the optimistic basis**, the budget is insufficient, and the session stops for the
human rather than being spent. On the pessimistic basis it need not fit — that outcome is
**inconclusive**, which §19.9 already treats as legitimate.

**Read honestly, the pessimistic basis is not reassuring even though it passes.** A block as noisy as
the worst Phase-2 block would produce a ±9.04 pp interval, which clears the ±10% band by under a
percentage point — meaning almost any non-trivial effect would put a boundary inside the interval and
return **inconclusive**. The budget is sufficient to be *capable* of a decision; it does not
guarantee one, and no run count within this bound would. The noisiest Phase-2 blocks were noisy in
part *because of* defects Phase 3 repairs (P5's watchdog firing mid-block, P2's absent
`TCP_NODELAY`), so post-repair dispersion is likely nearer the optimistic basis — but Phase 3 does
not assume that, and §19.8 checks the **realized** half-width against the same ±10% after the fact.

## 19.8 Phase-3 invalidators

Every §8 invalidator and every §16.8 invalidator carries forward **except §16.8 bullet 7**, which
§19.1 supersedes. To make plain that the control count does not silently decrease, the following are
**added**:

- a pair whose two runs are not one A and one B — the decomposition is broken
- `AB`/`BA` imbalance: the block must contain exactly half of each
- fewer than the declared 10 pairs completing, for any reason
- **realized** CI half-width exceeding ±10 pp — the block is too imprecise to decide, pre-declared
  rather than discovered
- the t interval and the bootstrap interval selecting different §19.9 branches (§19.3)
- the hasher flag absent from an artifact, or differing between runs being compared (§19.5)
- a verification run whose cryptographic digest does not match the manifest (§19.5)
- `TCP_NODELAY` state absent from an artifact, or unequal between candidates (§19.4 P2)
- producer facts absent from an artifact (§19.4 P6)
- at N=2: measured aggregate producer-resident bytes exceeding the declared aggregate bound, or the
  third stream being admitted rather than refused (§19.7)

A block flagged for drift >20% (§19.3) is **not** invalid; it is constrained in what it may decide.

## 19.9 Decision rule — fixed before viewing any Phase-3 result

Applied in order. **±10% is on §19.3's symmetric scale**, with the conversion stated there.

1. **A failed hard gate disqualifies the candidate**, regardless of throughput. H1–H7 retained;
   H1 at the grade §19.5 declares.
2. **CI entirely above +10%** → **Candidate B** is selected.
3. **CI entirely below −10%** → **Candidate A** is selected.
4. **CI entirely within ±10%** → **performance-equivalent**. Fall through to §12's existing ordering,
   applied on **measured end-to-end cost**: copies and allocation pressure, then cancellation
   simplicity, then security surface.
   - **This branch's outcome is foreseeable and that is disclosed, not hidden.** Candidate A leads on
     measured application-level copies. Retaining an ordering fixed in §12 *before Phase 1 measured
     anything* is legitimate; changing it now that its outcome is known would not be. The asymmetry is
     the whole answer to "the design knows where this branch lands."
   - **The decisive input must be re-measured, not inherited.** Copies and allocation pressure are
     live-asserted **per run at every configuration**, including M and L, where §17.5 records the
     mechanism differs from S. Deciding on a copy differential measured at one batch size would be
     rule 5's own failure committed inside the branch meant to survive it.
5. **CI overlapping either boundary** → **inconclusive**. ADR-012 stays **Proposed**.
6. **An unknown internal copy count is not a win.** WebView2-internal WebSocket message assembly
   remains opaque and is reported as **unknown**. **No zero-copy claim is made for either candidate**
   (ADR-004: copies are "measured and minimized, not assumed absent").
7. **Rule 5 — batch-size dependence**, evaluated across the admissible configurations. If the ranking
   or the decisive copy differential changes materially with batch size, **no transport-independent
   winner exists**; ADR-012 records the **batch-size policy requirement** the product must satisfy
   and **stays Proposed**. Rule 5 is not evaluable unless at least S plus one of M/L are admissible.

## 19.10 Scope, and the sequencing Phase 3 does not shortcut

Windows/WebView2 only. **Candidate A versus Candidate B only** — the interruptible Tauri IPC-channel
class named by ADR-004 amendment 2 stays outside the decision and unmeasured. Corpus remains
synthetic and structurally regular (fixed-width, non-nullable, numeric); GeoArrow variable-width
geometry, dictionary/string columns and nulls are **not** exercised, so any buffer-sharing result is
conditional on that shape. No GeoParquet, no DuckDB, no spatial index, no picking, no editing, no
reprojection, no WAN path. **N=2 is two synthetic streams and must never be reported as query
concurrency.**

**The hero-slice / real-SKP confirmation is not part of Phase 3**, and the architect's block on
attempting it here stands — harder than before, because Phase 3 adds an admission exercise, the
closest this harness has come to authoring protocol semantics. `docs/02` places DuckDB and GeoParquet
in `engine/`; a real SKP surface requires `docs/10`'s specification checklist and `docs/08`'s
normative conformance suite. The sequencing, recorded so it is not rediscovered:

1. **Phase 3, this directory** — repair, re-measure S/M/L/N=2, evaluate rule 5, produce a
   **provisional** winner and the batch-size policy *requirement*.
2. **ADR-012 amended by appended dated note.** Status stays **Proposed**.
3. **`protocol/` data plane plus first `engine/` scaffolding, as one vertical slice** (`docs/07`
   method) — not a longer bake-off.
4. **Hero-slice confirmation** across `engine/` + `protocol/` + `renderer/` against `docs/08` budgets.
5. **ADR-012 → Accepted**, Windows/WebView2 only; macOS/Linux stays `docs/07`'s separate open gate.

**The circular gate, named because nobody has named it.** Step 3 builds against a *provisional*
winner, so acceptance depends on work that must be built before acceptance can happen. If the
hero-slice confirmation falsifies the provisional choice, step 3 is rework. That risk is real, is
accepted deliberately rather than designed away, and belongs in ADR-012's consequences.

