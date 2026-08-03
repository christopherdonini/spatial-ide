# ADR-012 — Data-Plane Transport

**Status:** Proposed — **awaiting human approval. Not accepted.**
**Scope of any evidence below:** Windows 10 Pro 22H2 / WebView2-class engine only. Nothing here says anything about macOS/WKWebView or Linux/WebKitGTK, the same limit `docs/07` already places on ADR-003.
**Sources:** `protocol/transport-bakeoff/README.md` (preregistration, committed before the harness) and `§14 Results` (filled by the tester)
**Related:** **ADR-004** (+ 2026-08-03 amendments — this ADR *implements* its deferred choice and does not modify it), ADR-003 spike M1.5/M5 findings, ADR-010 rules 1/3/5/7, `docs/07`, `docs/09`, `docs/10`, `docs/11`

## Recommended status change — for the human, not applied here

**Proposed → Accepted**, scoped to Windows/WebView2, with the two qualifications in the Decision carried into the acceptance text: that the decision rests on the declared batch size, and that criterion 3 and the silent-truncation counter-evidence both favour B.

This ADR has **not** been accepted, and nothing here modifies ADR-004 — its 2026-08-03 amendment 2 explicitly deferred this choice, and this ADR fills that deferral rather than amending it. If accepting this would in your judgement warrant an ADR-004 amendment, that is a separate proposal for you to make, in the append-only form the ADR-003 spike used.

Approving this means approving the pre-declared criterion ordering (copies → cancellation simplicity → security surface), because that ordering, not the throughput measurement, is what selects A.

## Context

ADR-004 split the control plane from the data plane and required the data plane to be "chunked, backpressured, **copy-minimized** — no JSON on the hot path". It did not choose a wire transport. Its 2026-08-03 amendment 2 then **disqualified** the Tauri custom protocol as the production data plane — `register_uri_scheme_protocol`'s handler is a single synchronous closure with no interrupt path, so a client abort never reaches the producer and the kernel keeps computing cancelled work, violating `docs/01` principle 7 — and deferred the replacement explicitly:

> Candidate transports must make cancellation visible to the producer (WebSocket, localhost HTTP with connection-close semantics, interruptible IPC channels); the final choice is made when the engine module is built, measured against the spike M5 baseline (~105–112 MB/s, 4 avoidable copies + 1 GPU upload).

`docs/07` carries the same item as an open gate for the Prototype hero slice, and the ADR-003 spike's Outcome lists it under "What remains undesigned — post-spike engine work", noting that "a rendering-and-CRS spike was never the right place to design a wire protocol". This ADR is that deferred choice, made against measurement rather than argument.

**A note on where the harness lives, so this ADR does not read as contradicting `docs/07`.** `docs/07` describes this work as "engine/kernel-module work, not renderer work". That sentence is *negative* scoping — not renderer, not a spike — and it predates `docs/02`'s Directory column. It also covers two items at once, and is precise for the other one (server-side spatial indexing → `engine/`, per `docs/05`) while loose for this one. `docs/02` assigns `protocol/` = "SKP control/data plane + MCP adapter", and warns that collapsing `protocol/` into `kernel/` is "how the SKP surface gets absorbed into the kernel and the ADR-004 control/data-plane split stops being structural". The harness therefore lives in `protocol/transport-bakeoff/`. A one-phrase `docs/07` wording correction is proposed separately for human approval rather than folded into this change.

## Candidates measured

| | Candidate A | Candidate B |
|---|---|---|
| Transport | Binary WebSocket | Loopback HTTP streaming response via `fetch` + `ReadableStream` |
| Demand / backpressure | Explicit application credit, as fixed-layout binary control frames | TCP-native: consumer stops reading → receive window closes → producer's write pends |
| Cancellation | CANCEL control frame or peer close, observed on the producer's own socket | `AbortController` → connection close → response body dropped, observed producer-side |
| Consumer→producer channel | Yes | **None** |

Both sit behind one transport-neutral operation/stream interface. Swapping candidates changes exactly one construction site and zero lines of semantic code — asserted mechanically by `web/scripts/check-leakage.mjs`, not claimed in prose.

## The third candidate class, excluded — stated so this ADR does not claim more than it measured

ADR-004 amendment 2 names **three** candidate classes. **Interruptible IPC channels (Tauri IPC channel/event streaming) were not measured here.** The scope was bounded deliberately to two adapters that could be built and measured end-to-end within one bounded piece of work; a bounded scope is legitimate, a silent omission is not. Consequence: this ADR can say which of A and B is better on the measured profile. It **cannot** say either is better than an interruptible IPC channel, and any future claim to that effect needs its own measurement.

## Decision

**Adopt Candidate A — a binary WebSocket — as the data-plane transport on the Windows/WebView2 reference profile.**

The reasoning, in the order the preregistration fixed in advance:

1. **Both candidates are eligible.** All seven hard requirements pass for both (evidence below). Neither is excluded, so "no candidate selected" — a pre-declared legitimate outcome — does not apply.
2. **Throughput does not decide this, and could not have.** Producer generation consumed 97.2–98.9 % of every run's wall time, so both transports spent essentially the whole run idle behind the generator. The two per-batch p50 figures differ by 1.739 %, and that difference is fully explained by the generator running slower during A's runs than B's (12.289 ms vs 11.744 ms per batch, which alone predicts 198.4 vs 207.6 MB/s). **§12's tie-break is therefore reached by the workload's design, not by a discovered near-equality between the transports.**
3. **The tie-break's first criterion — fewer copies — resolves decisively on measured data.** Candidate A pays **0** consumer-side reassembly copies; Candidate B pays **100 per run**, one per batch, each 2,438,344 bytes — roughly **243.8 MB of additional copying per 240 MB payload**, a full extra copy of the entire payload. One WebSocket message is one frame, so no batch ever spans a chunk; an HTTP body-chunk boundary falls inside *every* batch, and Arrow IPC needs a contiguous message. This is the clause ADR-004 states in as many words: "chunked, backpressured, **copy-minimized**".
4. Criterion 1 being decisive, criteria 2 and 3 are **not reached**. Both are recorded below as context, and criterion 3 favours B.

**This decision is weaker than it looks, and the two reasons are stated here rather than buried in the risks.**

- **It rests on the declared batch size.** B's copy cost is a consequence of 2,438,344-byte frames crossing ~64 KB chunk boundaries. Smaller batches, or a consumer that feeds Arrow incrementally instead of requiring a contiguous message, might reduce or remove it. **That was not tested**, and if it can be removed, criterion 1 stops discriminating and this decision loses its only measured basis.
- **The counter-evidence is real.** A WebSocket data plane has an application-visible shutdown protocol both ends must implement correctly, and getting it wrong **truncates silently**: this harness did exactly that, delivering 98 of 100 batches with a healthy-looking producer, and it was caught only because a Rust client disagreed with the browser. B gets ordered-delivery-then-EOF from the transport and has no equivalent failure mode. A reviewer who weighs that above one copy per batch would reasonably prefer B, and the pre-declared criterion ordering — not the evidence — is what rules it out here.

A human approving this ADR is approving the criterion ordering as much as the measurement.

## Eligibility precedes speed

The preregistration fixes seven hard requirements as pass/fail gates, evaluated **before** any throughput comparison. **A faster candidate that fails any hard requirement cannot win**, and its throughput figures are context only, never a comparison.

| | Requirement | Why it is a gate and not a preference |
|---|---|---|
| H1 | Payload correctness — identical digest across adapters and runs, exact row count, CRS tag on every batch | A transport that delivers a *different* payload has not delivered the payload |
| H2 | Producer-visible cancellation < 100 ms, and the producer stops producing | ADR-004 amendment 2 + `docs/01` principle 7 + `docs/08`. This is the exact requirement that disqualified the custom protocol |
| H3 | Bounded-memory backpressure under a deliberately paused consumer | ADR-004's data-plane clause |
| H4 | Loopback-only, ephemeral port, per-session auth, origin validation, redacted credentials | `docs/09` |
| H5 | Zero JSON bytes on the data path, in either direction | ADR-004; `docs/10` |
| H6 | No transport detail leaks into the semantic API | ADR-004's "one semantic API, multiple optimized *bindings*" |
| H7 | Progress and terminal-error propagation; no partial view presented as complete | `docs/01` principle 7; ADR-010 rule 5 |

**H2 is the one to be most suspicious of, and the preregistration says so.** Spike M5 measured client-side `AbortController`-to-rejection latency at p50 0 ms and wrote plainly that "the number is not the finding" — nothing had actually stopped on the producer. This harness therefore measures the instant the **producer** observes cancellation on the **producer's own clock**, relates the two clocks by minimum-RTT probing with a declared error bound, invalidates the run if that bound exceeds 10 ms, and additionally requires that at most one further batch is generated after the cancel is observed. The per-batch generation cost is reported alongside because it is a lower bound on how fast a write-boundary-detected cancellation can possibly be seen — and because a producer spinning in a tight write loop with no real work would flatter this figure while making the bake-off produce the wrong answer.

## Evidence

Recorded independently by the tester agent against commit `6f44d88`, from a run whose own validity gate passed (`valid: true`, `invalidReasons: []`), satisfying the preregistration's declared counts in full. Full detail, method columns and scope limits: `protocol/transport-bakeoff/README.md` §15.

**Profile:** Windows 10 Pro 22H2 build 19045 · Edge/WebView2 150.0.4078.105, isolated profile · `ANGLE (Intel, Intel(R) UHD Graphics 630) Direct3D11` — real hardware, not a software rasterizer · release build, `debug_assertions` off · clock relation bound ±0.400 ms.

### Eligibility — decided before any throughput comparison

| Gate | A — WebSocket | B — HTTP streaming |
|---|---|---|
| H1 correctness | **PASS** | **PASS** |
| H2 producer-visible cancellation | **PASS** | **PASS** |
| H3 bounded-memory backpressure | **PASS** | **PASS** |
| H4 security posture | **PASS** | **PASS** |
| H5 JSON-free data path | **PASS** | **PASS** |
| H6 no transport leakage | **PASS** | **PASS** |
| H7 progress + terminal propagation | **PASS** | **PASS** |

H1 is now a gate that can actually fail: 10,000,000 rows on 6/6 runs; digest `5f0cbe2c…052c2d` identical across both adapters, all runs, **and equal to the producer's own digest**; id-contiguity failures 0; coordinate-domain failures 0; wire bytes a single value of 243,835,200; CRS tag on 100/100 batches every run.

### Measured comparison

| Metric | A — WebSocket | B — HTTP streaming |
|---|---|---|
| Time to first batch | 24.8 / 25.5 / 27.9 ms | 23.0 / 21.2 / 19.0 ms |
| First meaningful pixels (first-batch-rendered) | 52.0 / 36.1 / 57.1 ms | 55.7 / 33.8 / 27.6 ms |
| Full-payload render *(different definition, quoted alongside)* | 1284.4 / 1278.6 / 1331.4 ms | 1212.2 / 1217.8 / 1239.3 ms |
| Throughput per-batch p50 / p95 (n=297) | 208.406 / 243.835 MB/s | 212.031 / 256.669 MB/s |
| Throughput whole-transfer | 193.5 / 192.1 / 184.2 MB/s | 203.1 / 201.6 / 198.0 MB/s |
| Peak producer memory (private commit) | 14.8 / 26.4 / 16.8 MB | 19.3 / 14.5 / 14.5 MB |
| Peak consumer memory (accounted) | 81,641,512 B | 81,641,512 B |
| **Copies — stage 5, Arrow parse** *(live-asserted)* | 100/100 batches share the wire buffer | 100/100 batches share the wire buffer |
| **Copies — stage 3, reassembly** *(live-asserted, discriminating)* | **0 copies**, 100/100 contiguous | **100 copies/run**, 0/100 contiguous |
| Producer-observed cancellation ack | p50 0.1124 / p95 0.1609 ms | p50 0.5370 / p95 8.4013 ms |
| Cancellation gate (<100 ms) | **PASS** | **PASS** |
| Batches generated after cancel observed | 0 in 10/10 | ≤1 in 10/10 |
| Backpressure: max resident vs bound | 9,753,376 B vs 12,191,720 B — **PASS** | 9,753,376 B vs 12,191,720 B — **PASS** |
| Cancel during production / transfer / decode | `Cancelled`, producer observed, view signalled incomplete | same |

**How the cancellation figure must be quoted.** *The producer observes cancellation in under 1 ms, indistinguishable from zero at this clock resolution.* It must **not** be quoted as "0.1124 ms": the clock bound is ±0.400 ms, and the run recorded a **negative** ack (−0.0400 ms), which is physically impossible and is clean proof the point estimate sits below the harness's own resolution. The gate verdict is untouched — the margin to 100 ms is orders of magnitude larger than the uncertainty. Separately, the operationally meaningful figure is not the ack but when production actually *ceases*: at most one further batch, **≤ 21.4 ms** at the measured worst case.

### Baseline comparability — the bake-off did not measure what M5 measured

> **The bake-off did not measure either transport's throughput ceiling, and its MB/s figures must not be compared with spike M5's.** M5 measured `fetch()` + `arrayBuffer()` on a single unchunked 162,500,488-byte response with the data already in hand — a *transfer-bound* measurement. This harness's figures are *generation-bound*: producer synthesis and Arrow serialization account for **97.2 %–98.9 %** of every run's wall-clock time, so both transports spent essentially the whole run idle behind the generator. The two numbers measure different subsystems. Quoting ≈200 MB/s against M5's ≈105–112 MB/s as a ~2× transport improvement would be a fabricated result.

The copy comparison is likewise not like-for-like. M5's model was 4 avoidable application-level copies + 1 required GPU upload on the now-disqualified custom-protocol path. Here only stage 5 and the stage-3 reassembly are live-asserted; generation, IPC serialization, producer-side framing, OS→JS, f64→f32 narrowing and GPU upload are source-read and equal between candidates. **This ADR therefore claims no reduction against M5's 4+1 count.** What it claims is narrower and measured: the two candidates differ by exactly one whole-payload copy per batch, in A's favour.

## Threat model for a listening loopback socket

Both candidates require a listening TCP socket, which is a real change in local attack surface. `docs/09`'s posture is local-first with no network access without an explicit grant, and its "To be specified" section does not cover this case, so it is stated here.

- **Bind:** `127.0.0.1` only, asserted at startup, never `0.0.0.0` or `::`. Port is OS-assigned (ephemeral), never fixed.
- **Authentication:** a per-session token, required on every data and control endpoint, compared in constant time. Delivered to the consumer by injection into the served document — which in production is delivery over the **control plane** (Tauri IPC); the token is never placed in a URL query string, never written to a repo file, and never logged.
- **Origin:** a stated `Origin` must match exactly; `null` and any foreign origin are rejected. An absent `Origin` — which browsers omit on same-origin GET — is accepted only with a positive `Sec-Fetch-Site: same-origin` Fetch-Metadata signal that page script cannot forge. A client presenting neither header is rejected.
- **Redaction:** the token is stripped from every artifact before it is written, and the write is refused if redaction fails.
- **Known limitation, stated rather than hidden:** the harness's token is minted from a splitmix64 stream over time and PID, not an OS CSPRNG. That is adequate for an ephemeral loopback benchmark session and is **not** adequate for the production transport; whichever candidate is adopted must draw session tokens from an OS CSPRNG and hold them in the OS keychain per `docs/09`.
- **Not addressed here:** any local process running as the same user can reach a loopback port and will be limited only by the token. Process-level authentication of the peer is out of scope for this bake-off and is named as open work below.

## What this ADR does not decide

- **It is not SKP, and it does not define SKP v0.** The harness's interface is scaffolding for a measurement — one operation, a batch stream, cancel, progress, terminal error, credit. Unversioned, single-consumer, no spec document. Everything on `docs/10`'s "The specification must cover" checklist — version negotiation, capability discovery, handle lifecycle, idempotency, schema evolution, a conformance suite — is untouched and remains open.
- **It does not adopt the harness's framing as the wire format.** If a future decision wants to bind "data-plane frames are Arrow IPC record batches behind an 8-byte binary prefix", that is a **second, separate decision** and must be stated as one so that approving this ADR is not silently approving that. What this ADR does record is a measured fact that any such framing must respect: an Arrow payload that does not start 8-byte aligned cannot be handed out as buffer views and costs a full extra copy of the batch at parse.
- **It does not modify ADR-004.** ADR-004 is accepted and immutable; this ADR implements the choice it deferred. If an amendment to ADR-004 turns out to be warranted, it is proposed separately as a draft for human approval, in the form the ADR-003 spike used.
- **It says nothing about macOS or Linux.** Those platforms have their own open gate in `docs/07`.

## Consequences

**If accepted:**

- The `protocol` module's data plane is built on a binary WebSocket carrying Arrow IPC record batches, with explicit application-level credit for demand and in-band binary control frames for cancellation. `docs/10`'s data-plane row gains a concrete transport; ADR-004's deferred clause is closed for Windows/WebView2 only.
- **A shutdown protocol becomes a correctness requirement, not an implementation detail.** The producer must never initiate the close, and a stream that ends without a terminal frame must be reported as a failure rather than as a short stream. This is not advice: violating it truncated this harness silently at 98/100 batches with every liveness signal healthy. The conformance suite (`docs/08`) must carry a case for it.
- Credit accounting becomes part of the transport's contract, and its ceiling is declared rather than discovered (`MAX_INFLIGHT_BATCHES`, max frame size, credit window).
- Frame alignment becomes a documented constraint: an Arrow payload that does not start 8-byte aligned costs a full extra copy of the batch at parse. The harness's 8-byte prefix is one way to satisfy that, not the only one — see "What this ADR does not decide".
- Nothing changes for the control plane. Tauri IPC remains the control plane per ADR-004, including its amendment 1 rule on bit-critical scalars.

**Regardless of the decision, these hold** — they were measured, and they bind whichever transport is eventually built:

- A client-side abort is not evidence of cancellation. Producer-side observation is the only admissible measurement, and both candidates can supply it.
- Bounded-memory backpressure via reserve-before-generate holds a hard plateau at the channel's capacity, in both candidates.
- Arrow payload alignment is worth one whole-payload copy per batch.

## Open risks and follow-up work

1. **The decision's only measured basis may be removable.** B's per-batch reassembly copy follows from 2,438,344-byte frames crossing ~64 KB chunk boundaries. Smaller batches, or an incremental Arrow reader that does not require a contiguous message, might eliminate it — **untested**. If it can be eliminated, criterion 1 stops discriminating and this ADR should be re-opened rather than quietly retained.
2. **Throughput is uncharacterised for both candidates.** The workload is generation-bound at 97.2–98.9 %; neither transport's ceiling was measured. Any future throughput claim needs a re-run with a pre-generated payload that decouples generation from transfer. **No throughput-based claim may cite this ADR.**
3. **One admissible invocation.** Run-to-run variance on the fixed build is uncharacterised: the reproducibility check could not be obtained, because nothing in this environment can hold a browser window foregrounded while automation continues. Two invocations on the *pre-fix* build did agree, which is weak corroboration and not a substitute.
4. **One machine, one GPU, one Edge build.** Intel UHD 630 — not the GTX 1650 also present — and Edge 150.0.4078.105.
5. **Cross-platform validation.** Every figure is Windows-only. macOS/WKWebView and Linux/WebKitGTK are unmeasured, and `docs/07`'s hardware-validation gate covers them.
6. **Interruptible IPC channels remain unmeasured** — ADR-004 amendment 2's third candidate class. A future comparison needs its own harness run, not an argument from these results.
7. **Peer authentication on loopback** is unaddressed: the token authenticates a session, not a process. Any local process running as the same user can reach the port and is limited only by the token.
8. **Production token material** must come from an OS CSPRNG and the OS keychain (`docs/09`), not the harness's splitmix64 minting.
9. **The harness's own remaining gaps**, recorded in README §15.8 and to be closed before it is used again: `debugAssertions` is emitted by the server but never recorded in the artifact, so §8's debug-build invalidator has no mechanism behind it *in the report* (the profile was confirmed independently for this run); H4's live negative tests target `/clock` rather than the two data endpoints, leaving the WebSocket subprotocol reject path untested; sampling cadence ran at ~62.6 ms against a declared 50 ms.
10. **Synthetic, structurally regular payload.** Uniform-random points at a fixed seed; no GeoParquet, no DuckDB, no spatial index, no picking, no editing, no reprojection, no concurrent streams, no WAN path. Real irregular cadastral data is unexercised, exactly as the ADR-003 spike's own scope-limits section states for P1/P2.
11. **Server-side spatial indexing** — `docs/07`'s *other* open gate — is untouched here and stays `engine/` work per `docs/05`.
