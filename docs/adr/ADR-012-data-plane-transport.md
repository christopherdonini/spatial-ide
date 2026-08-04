# ADR-012 — Data-Plane Transport

**Status:** Proposed — **awaiting human approval. Not accepted.** A status change was pre-approved conditional on a phase selecting a winner. It is **withheld for the second time**: Phase 2 returned confounded blocks at two of three batch sizes, and Phase 3 — run on a repaired instrument — returned **no §19.9 branch that selects a candidate**. See "Phase 3 outcome", then "Phase 2 outcome".
**Scope of any evidence below:** Windows 10 Pro 22H2 / WebView2-class engine only. Nothing here says anything about macOS/WKWebView or Linux/WebKitGTK, the same limit `docs/07` already places on ADR-003.
**Sources:** `protocol/transport-bakeoff/README.md` — §1–§13 preregistration (committed before the harness), §14 Implementation findings, **§15 Results** (Phase 1, tester-filled), §16 Phase 2 preregistration (committed before Phase-2 code), **§17 Phase 2 results** (tester-filled), §18 Phase 2 instrument findings, §19 Phase 3 preregistration (committed before Phase-3 code), **§20 Phase 3 results** (tester-filled), §21 Phase 3 instrument findings
**Related:** **ADR-004** (+ 2026-08-03 amendments — this ADR *implements* its deferred choice and does not modify it), ADR-003 spike M1.5/M5 findings, ADR-010 rules 1/3/5/7, `docs/07`, `docs/09`, `docs/10`, `docs/11`

## Phase 3 outcome (2026-08-04) — status change **withheld again**

Phase 3 ran the repaired-instrument benchmark preregistered in `protocol/transport-bakeoff/README.md` §19, which exists because §18 recorded nine instrument defects in Phase 2 — including two declared controls that were never in force — and because §16.5's order-effect gate was shown to be degenerate: at a true null with zero drift it rejects **98.4 %** of blocks, and its rejection rate tracks the *effect under test* rather than drift. Results: §20. Instrument defects found in review of Phase 3: §21.

**What Phase 3 fixed, and what it then found.** The consumer-side SHA-256 left the timed path, and measured throughput rose from Phase 2's 33–35 MB/s to 449–830 MB/s — confirming §17.7's diagnosis that Phase 2 measured a hasher, not a transport. §19.3's paired symmetric estimator did what §16.5's could not: it classified a near-perfect null at configuration M as **equivalence** instead of rejecting it as confounded.

**The outcome under §19.9, applied in order:**

| Configuration | Verdict | §19.9 branch |
|---|---|---|
| **M** — 2,438,344 B batches | valid | CI [−6.69 %, +6.23 %] → **rule 4, performance-equivalent** |
| **L** — ~12.2 MB batches | valid | CI [−13.40 %, +2.89 %] overlaps the boundary → **rule 5, inconclusive** |
| **S** — ~244 KB batches | **failed twice** | realized half-widths ±24.62 pp and ±21.87 pp against the declared ±10 pp; §19.7 forbids a third attempt |
| **N=2** — concurrency | **inadmissible** | §19.8's own invalidators bind: no producer facts and no hashing flag in the artifact, no verification transfer, and the aggregate resident bound vacuous by construction (§21 Q2–Q4) |

**No branch selects a candidate.** Rule 4 fires at M alone; its fall-through to §12's ordering selects **Candidate A** on re-measured copies and allocation pressure — but that is the ordering's verdict at one configuration, not a transport decision. **Rule 7 (batch-size dependence) remains not evaluable**, for the second phase running: §19.7 requires S plus one of M/L admissible, and S failed.

**The N=2 result is recorded and is explicitly not evidence.** That block measured θ = +38.58 %, CI [+32.47 %, +44.69 %] — a decisive win for Candidate B on aggregate throughput with two concurrent streams, inverting the N=1 ranking. A declared mechanism diagnostic eliminated the credit window (a 50× sweep moved A's aggregate only 13 %), the JS main thread, and the Rust producer, leaving the cause inside **WebView2's opaque WebSocket receive path** — §19.9 rule 6's UNKNOWN region. The effect reproduced across three batch sizes and two orders. It cannot select a candidate, because the block fails §19.8; it is the strongest open question this study has produced, and it points the opposite way from every other measurement here.

**Two limits a reader must carry forward, both from §21:**

- **No Phase-3 block should be treated as reproducible between sessions.** A *valid* pre-fix L block selects A decisively at [−38.10 %, −21.09 %]; the post-fix L block of record is inconclusive at θ = −5.26 %. The functional difference is five lines and one moved `drop`, entirely outside the timed path, and Candidate A's throughput fell 25–27 % between sessions while Candidate B's fell 5–9 % — asymmetric, so a ratio does not cancel it. §19 has no control for this (§21 Q1).
- **The ≈14× throughput gain may not be credited to the hasher removal alone.** At least 2,317.9 ms per run at S is unexplained by §17.7's own hasher figure. The leading candidate is `TCP_NODELAY` — declared in §16.2, found absent in §18 P2, and fixed in the same phase. Two changes, one measurement (§21 Q6).

## Phase 2 outcome (2026-08-04) — status change **withheld**

Phase 2 ran the transfer-isolated benchmark preregistered in `protocol/transport-bakeoff/README.md` §16, which exists because Phase 1 measured a generator at 97.2–98.9 % of wall time and therefore never tested §12's tie-break precondition. Results: §17.

**A status change was pre-approved conditional on Phase 2 selecting a winner. It is withheld.**

The reasoning is *a fortiori*, and is stated that way rather than claiming more preregistration than exists: §16.9 rule 5 pre-commits "stays Proposed" for the case where batch-size dependence is **demonstrated**. Phase 2 landed in a strictly *less* informed state than that — it cannot say whether the ranking is batch-size dependent, because M and L returned no admissible data. A state strictly weaker than a pre-declared "stays Proposed" state cannot warrant a stronger status.

- **4 of 5 counterbalanced blocks were invalid.** Only configuration **S** produced an admissible block. Configurations **M** and **L** failed §16.5's order-effect gate on both their original and their replacement blocks (ratios 1569.8 %, 226.1 %, 51.5 %, 514.1 % against a declared 5 % threshold). Whole-block replacement was used throughout; no single run was replaced.
- The substantive reading matches the arithmetic: within-block drift (0.23–1.55 MB/s) **exceeded the candidate difference** (0.045–0.686 MB/s) at M and L, so those configurations could not have separated the candidates regardless.
- **§16.9 rule 5 could not be evaluated.** Whether the ranking is batch-size dependent is exactly what M and L were there to answer, and neither returned admissible data. Rule 5's own closing clause is decisive here: *a transport chosen only for one batch size is not a transport decision.*

**What configuration S did establish**, and it is consistent with Phase 1 rather than a new result: neither candidate was disqualified; the throughput gap was 4.02 %, inside the 10 % band, so rule 2 did not fire; and rule 3's first criterion — copies and allocation pressure — selects **Candidate A**, 0 whole-payload copies per run against B's 1000–1001 (~244.6 MB).

**Three findings that further bound what Phase 2 measured**, recorded because they change how the figures must be read and because two of them are defects in the instrument rather than in either transport:

1. **t1 is not a pure transport figure.** The consumer's pure-JS SHA-256 runs at 54.7–59.6 MB/s and is fed synchronously inside the decoder, accounting for **61–63 % of t1**. Phase 2 removed the generator from the timed interval and reintroduced a comparable per-byte cost at the consumer. All ten candidate×block p50s sit within 32.31–35.01 MB/s across a **49.8× change in bytes per batch**, which is the signature of a shared per-byte bottleneck rather than of transport behaviour.
2. **The rule 2 / rule 3 branch is not robust.** Rule 2 would select B; rule 3 selects A. Subtracting the shared hasher cost as a first-order correction moves the gap from 4.02 % to **9.37 %** — still inside the band, but with ~0.6 pp of margin rather than ~6. The decision sits close to a branch boundary.
3. **Counting only the reassembly counter under-reports Candidate B's copies by 8.6×.** B's *reassembled* frames share the Arrow buffer 116/116 while its *contiguous* frames share 0/884, because Arrow JS yields a view only at payload byteOffset ≡ 0 mod 8 and WebView2's fetch chunk views are misaligned. This strengthens the direction of criterion 1 while showing the metric that fed it was incomplete.

**Not executed:** the **N=2 concurrency** configuration §16.2 declares as secondary — it is not implemented in the consumer. Everything here is single-stream. Rendering is excluded from Phase 2, so there is no first-pixel, frame-time or VRAM figure.

**Consequence for this ADR:** the Decision below is **unchanged** — Phase 2 selected the same candidate at the one configuration that produced admissible data, so there is nothing to replace. But its evidence basis is now narrower than a reader would assume: transport throughput remains uncharacterised for both candidates, and **no throughput-based claim may cite this ADR**. Re-open condition 1 (throughput measured on a transfer-bound workload) is *not* discharged by Phase 2, because Phase 2 was not transfer-bound.

Before this ADR can reach Accepted, the following must land: admissible M and L blocks (which requires removing the consumer-side hashing cost from the timed path, or measuring it out of band), the N=2 configuration, and §16.9 rule 5 actually evaluated.

## Recommended status change — **none, as of Phase 3**

**Remain Proposed.** This section previously recommended Proposed → Accepted on Phase 1's evidence. **That recommendation is withdrawn**, not because the candidate changed — it did not — but because Phase 2 showed the evidence base is narrower than the recommendation assumed: the batch-size dependence question that rule 5 exists to answer returned no admissible data at two of three configurations, and the one configuration that did produce a block was not transfer-bound.

The prerequisites for revisiting are listed at the end of "Phase 2 outcome" above.

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
2. **The throughput comparison the preregistration required was never obtained.** This must be stated as a gap, not as a result. Producer generation consumed 97.2–98.9 % of every run's wall time, so both transports spent essentially the whole run idle behind the generator, and **neither transport's throughput was measured at all**. The two per-batch p50 figures differ by 1.739 %, but that gap is *more than* accounted for by the generator running slower during A's runs than B's (12.289 ms vs 11.744 ms per batch, which alone predicts a 4.6 % gap) — so it measures the generator, not the sockets.
   §12 says the tie-break applies "if both candidates are eligible and their per-batch throughput p50 figures are within 10 % of each other". **That precondition is untested, not satisfied**: two numbers that both measure the same generator being 1.7 % apart is not evidence that the transports are within 10 % of each other. Falling back to the tie-break here is therefore a *fourth* outcome, chosen after seeing the data — §1 pre-declared only A, B, or neither-if-both-fail-a-gate. It is a defensible choice, but it is a choice, and calling it "the preregistration resolving" would dress a criterion-ordering decision as a measurement result.
3. **On the evidence that does exist, criterion 1 — fewer copies — favours A.** Candidate B performs **one additional full pass over the payload in JS** that Candidate A does not: 100 reassembly copies per run, one per batch, 2,438,344 bytes each ≈ **243.8 MB per 240 MB payload**. One WebSocket message is one frame, so no batch spans a chunk; an HTTP body-chunk boundary falls inside *every* batch, and Arrow IPC needs a contiguous message. This is ADR-004's "copy-minimized" clause in as many words.
4. Criterion 1 being the first that discriminates, criteria 2 and 3 are **not reached**. Both are recorded below as context, and **criterion 3 favours B**.

**Three things make this decision weaker than its headline, all stated here rather than buried in the risks.**

- **Criterion 1 is measured at the JS boundary, not end-to-end.** The 0-vs-100 figure counts copies performed by harness JavaScript. A WebSocket message is assembled from TCP segments *inside the browser* before JS ever sees it, and that copy is below the measurement boundary; for HTTP the equivalent reassembly happens above it, where the counter can see it. ADR-004 requires copies to be "measured and minimized, **not assumed absent**", so the honest claim is narrower than "A copies zero times": **A pays 0 JS-observable reassembly copies and B pays 100 per run; the sub-JS ingestion cost is unmeasured on both sides.** What survives that caveat is the *difference* — both candidates must get bytes from the kernel into the process, and B additionally pays a full JS-side pass — but the absolute count is not established, and if the browser's WebSocket assembly turns out to be materially more expensive than chunk delivery, this criterion stops discriminating.
- **It rests on the declared batch size** — and Phase 2 has now tested one point of that. At ~244 KB batches (configuration S) Candidate B still paid **1000–1001 whole-payload copies per run**: the copy did not vanish at a smaller batch size, it relocated into the Arrow parse, because Arrow JS yields a buffer view only at 8-byte-aligned offsets and WebView2's fetch chunk views are misaligned. That is a *stronger* result for A than this ADR previously claimed. It remains untested at larger batch sizes, which is the direction that matters for rule 5 and the direction Phase 2 could not measure.
- **The counter-evidence is real.** A WebSocket data plane has an application-visible shutdown protocol both ends must implement correctly, and getting it wrong **truncates silently** — this harness did exactly that, with a healthy-looking producer, caught only because a Rust client disagreed with the browser. B gets ordered-delivery-then-EOF from the transport and has no equivalent failure mode. A reviewer weighing that above one copy per batch would reasonably prefer B, and it is the pre-declared criterion *ordering*, not the evidence, that rules it out here.

**Re-open this ADR if any of these becomes true:**

1. Throughput is measured on a transfer-bound workload and the candidates fall **outside** §12's 10 % band — in which case §12 says throughput decides and the copy criterion is never reached. **The decision could flip.**
2. B's per-batch reassembly copy is shown removable by smaller frames or an incremental Arrow reader.
3. Sub-JS message assembly is shown to differ materially between the two transports.

A human approving this ADR is approving the criterion ordering, and the decision to fall back to it at all, as much as the measurement.

## Eligibility precedes speed

The preregistration fixes seven hard requirements as pass/fail gates, evaluated **before** any throughput comparison. **A faster candidate that fails any hard requirement cannot win**, and its throughput figures are context only, never a comparison.

| | Requirement | Why it is a gate and not a preference |
|---|---|---|
| H1 | Payload correctness — exact row count, CRS tag on every batch, and digest identity. **Grade changed by Phase 3 (§19.5):** cryptographic digest identity is established **per candidate per configuration on a dedicated untimed verification transfer** (8/8 at S, M, L; **not established at N=2**), tied to the timed runs by an identical structural digest. It is no longer asserted on every timed run, because the hasher that made that possible was consuming 61–63 % of the measurement. A timed run detects truncation, reordering, frame-boundary corruption and a lying length field; it does **not** detect interior byte corruption | A transport that delivers a *different* payload has not delivered the payload |
| H2 | Producer-visible cancellation < 100 ms, and the producer stops producing | ADR-004 amendment 2 + `docs/01` principle 7 + `docs/08`. This is the exact requirement that disqualified the custom protocol |
| H3 | Bounded-memory backpressure under a deliberately paused consumer | ADR-004's data-plane clause |
| H4 | Loopback-only, ephemeral port, per-session auth, origin validation, redacted credentials | `docs/09` |
| H5 | Zero JSON bytes on the data path, in either direction | ADR-004; `docs/10` |
| H6 | No transport detail leaks into the semantic API | ADR-004's "one semantic API, multiple optimized *bindings*" |
| H7 | Progress and terminal-error propagation; no partial view presented as complete | `docs/01` principle 7; ADR-010 rule 5 |

**H2 is the one to be most suspicious of, and the preregistration says so.** Spike M5 measured client-side `AbortController`-to-rejection latency at p50 0 ms and wrote plainly that "the number is not the finding" — nothing had actually stopped on the producer. This harness therefore measures the instant the **producer** observes cancellation on the **producer's own clock**, relates the two clocks by minimum-RTT probing with a declared error bound, invalidates the run if that bound exceeds 10 ms, and additionally requires that at most one further batch is generated after the cancel is observed. The per-batch generation cost is reported alongside because it is a lower bound on how fast a write-boundary-detected cancellation can possibly be seen — and because a producer spinning in a tight write loop with no real work would flatter this figure while making the bake-off produce the wrong answer.

## Evidence

Recorded independently by the tester agent against commit `6f44d88`, from a run whose own validity gate passed (`valid: true`, `invalidReasons: []`), satisfying the preregistration's declared counts in full. Full detail, method columns and scope limits: `protocol/transport-bakeoff/README.md` §15.

*The harness has changed since that commit, so the measured tree is named explicitly rather than implied by HEAD. **Correction (2026-08-04):** an earlier version of this note claimed the later changes did not alter transport behaviour. That is false as of Phase 2 — `86df830` split each batch and its progress frame into two writes on both adapters, so HEAD no longer reproduces Phase 1's wire behaviour and Phase 1's figures cannot be regenerated from it. Phase 1's evidence stands **as recorded at `6f44d88`**, which is why that tree is named; it is not reproducible from HEAD. See README §18 P1 — the change also reintroduces a cancel-blind window on Candidate A that F7 had removed.*

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
| ↳ *B is ~5 % faster on this metric, on all three runs.* It is the only end-to-end wall-clock figure here and it favours the candidate this ADR does not select, so it is called out rather than left for a reader to notice. It has the same cause as the throughput gap: A's generator ran 4.6 % slower during its runs, which more than accounts for the difference. Like the throughput figures, it is generation-bound and is not a transport result. | | |
| Throughput per-batch p50 / p95 (n=297) | 208.406 / 243.835 MB/s | 212.031 / 256.669 MB/s |
| Throughput whole-transfer | 193.5 / 192.1 / 184.2 MB/s | 203.1 / 201.6 / 198.0 MB/s |
| Peak producer memory (private commit) | 14.8 / 26.4 / 16.8 MB | 19.3 / 14.5 / 14.5 MB |
| Peak consumer memory (accounted) | 81,641,512 B | 81,641,512 B |
| **Copies — stage 5, Arrow parse** *(live-asserted)* | 100/100 batches share the wire buffer | 100/100 batches share the wire buffer |
| **Copies — consumer-side reassembly** *(live-asserted, discriminating; **JS-observable only**)* | **0 copies**, 100/100 contiguous | **100 copies/run**, 0/100 contiguous |
| Producer-observed cancellation ack | **<1 ms, at clock resolution** (worst trial 0.1609 ms) | **<1 ms p50, at clock resolution**; worst trial 8.4013 ms |
| Cancellation gate (<100 ms) | **PASS** | **PASS** |
| Batches generated after cancel observed | **never more than 1** | **never more than 1** |
| Backpressure: max resident vs bound | 9,753,376 B vs 12,191,720 B — **PASS** | 9,753,376 B vs 12,191,720 B — **PASS** |
| Cancel during production / transfer / decode | `Cancelled`, producer observed, view signalled incomplete | same |

**How the cancellation figure must be quoted.** *The producer observes cancellation in under 1 ms, indistinguishable from zero at this clock resolution.* It must **not** be quoted as "0.1124 ms": the clock bound is ±0.400 ms, and the run recorded a **negative** ack (−0.0400 ms), which is physically impossible and is clean proof the point estimate sits below the harness's own resolution. The gate verdict is untouched — the margin to 100 ms is orders of magnitude larger than the uncertainty. Separately, the operationally meaningful figure is not the ack but when production actually *ceases*: at most one further batch, **≤ 21.4 ms** at the measured worst case.

### Baseline comparability — the bake-off did not measure what M5 measured

> **The bake-off did not measure either transport's throughput ceiling, and its MB/s figures must not be compared with spike M5's.** M5 measured `fetch()` + `arrayBuffer()` on a single unchunked 162,500,488-byte response with the data already in hand — a *transfer-bound* measurement. This harness's figures are *generation-bound*: producer synthesis and Arrow serialization account for **97.2 %–98.9 %** of every run's wall-clock time, so both transports spent essentially the whole run idle behind the generator. The two numbers measure different subsystems. Quoting ≈200 MB/s against M5's ≈105–112 MB/s as a ~2× transport improvement would be a fabricated result.

The copy comparison is likewise not like-for-like. M5's model was 4 avoidable application-level copies + 1 required GPU upload on the now-disqualified custom-protocol path. Here only the Arrow-parse stage and the consumer-side reassembly are **live-asserted**; generation, IPC serialization and producer-side framing are source-read and equal between candidates. **This ADR therefore claims no reduction against M5's 4+1 count.**

**Two stages are neither live-asserted nor established, and one of them carries the decision.** The preregistration's stage 4 (OS/webview → JS `ArrayBuffer`) was expected to be "1 copy, inherent to the process boundary" and equal on both sides. It is *asserted* equal, not shown: a WebSocket message is assembled from TCP segments inside the browser before JS sees it, whereas HTTP chunk delivery hands JS the segments and the reassembly happens above the boundary where the counter can see it. Both candidates must pay some kernel→process ingestion, so the measured **difference** — one additional full JS-side pass that B pays — is robust; the **absolute** counts are not. ADR-004 requires copies to be "measured and minimized, not assumed absent", and this stage is currently assumed. Establishing it (a source-read of the browser's WebSocket message-assembly path, the same treatment the other stages got) is the single highest-value follow-up, because it is what the decision turns on.

What this ADR claims, at full strength: the two candidates differ by exactly one whole-payload **JS-observable** copy per batch, in A's favour.

## Threat model for a listening loopback socket

Both candidates require a listening TCP socket, which is a real change in local attack surface. `docs/09`'s posture is local-first with no network access without an explicit grant, and its "To be specified" section does not cover this case, so it is stated here.

- **Bind:** `127.0.0.1` only, asserted at startup, never `0.0.0.0` or `::`. Port is OS-assigned (ephemeral), never fixed.
- **Authentication:** a per-session token, required on every data and control endpoint, compared in constant time. Delivered to the consumer in the **URL fragment**, which browsers never transmit — so it appears in no request line, no access log and no response body, and the page-serving endpoint returns a document containing no credential. In production this delivery is the **control plane** (Tauri IPC); the fragment stands in for it. The token is never placed in a URL query string and never logged.
- **Residual, on disk:** the harness writes the launch URL — fragment included — to `<out-dir>/launch-url.txt` so an operator can open it. That file is **deleted immediately after a successful `--launch`**, but on the manual path it persists next to the reports until the operator removes it. Any local process running as the same user can read it. This is strictly narrower than the earlier design, in which the credential was served over the network to any unauthenticated caller, but it is not nothing, and the production transport must deliver the token over the control plane and never write it to disk.
- **Origin:** a stated `Origin` must match exactly; `null` and any foreign origin are rejected. An absent `Origin` — which browsers omit on same-origin GET — is accepted only with a positive `Sec-Fetch-Site: same-origin` Fetch-Metadata signal that page script cannot forge. A client presenting neither header is rejected.
- **Redaction:** the token is stripped from every artifact before it is written, and the write is refused if redaction fails.
- **Known limitation, stated rather than hidden:** the harness's token is minted from a splitmix64 stream over time and PID, not an OS CSPRNG. That is adequate for an ephemeral loopback benchmark session and is **not** adequate for the production transport; whichever candidate is adopted must draw session tokens from an OS CSPRNG and hold them in the OS keychain per `docs/09`.
- **Not addressed here:** any local process running as the same user can reach a loopback port and will be limited only by the token. Process-level authentication of the peer is out of scope for this bake-off and is named as open work below.

## What this ADR does not decide

- **It is not SKP, and it does not define SKP v0.** The harness's interface is scaffolding for a measurement — one operation, a batch stream, cancel, progress, terminal error, credit. Unversioned, single-consumer, no spec document. Everything on `docs/10`'s "The specification must cover" checklist — version negotiation, capability discovery, handle lifecycle, idempotency, schema evolution, a conformance suite — is untouched and remains open.
- **It does not adopt the harness's framing as the wire format.** If a future decision wants to bind "data-plane frames are Arrow IPC record batches behind an 8-byte binary prefix", that is a **second, separate decision** and must be stated as one so that approving this ADR is not silently approving that. What this ADR records about alignment, stated at the strength the evidence actually supports: **the 8-byte-aligned path measures 100/100 batches sharing the wire buffer on both candidates.** The misaligned case was observed at 0/100 during development, but that observation comes from a smoke run, which the preregistration classifies as inadmissible — so "misalignment costs a full extra copy" is the *reason the prefix was widened*, not a measured claim. Confirming it is a one-constant A/B (`FRAME_PREFIX_LEN` 5 vs 8) that has not been run.
- **It does not modify ADR-004.** ADR-004 is accepted and immutable; this ADR implements the choice it deferred. If an amendment to ADR-004 turns out to be warranted, it is proposed separately as a draft for human approval, in the form the ADR-003 spike used.
- **It says nothing about macOS or Linux.** Those platforms have their own open gate in `docs/07`.

## Consequences

**If accepted:**

- The `protocol` module's data plane is built on a binary WebSocket carrying Arrow IPC record batches, with explicit application-level credit for demand and in-band binary control frames for cancellation. `docs/10`'s data-plane row gains a concrete transport; ADR-004's deferred clause is closed for Windows/WebView2 only.
- **A shutdown protocol becomes a correctness requirement, not an implementation detail.** The producer must never initiate the close, and a stream that ends without a terminal frame must be reported as a failure rather than as a short stream. This is not advice: violating it truncated this harness silently — a partial delivery with every liveness signal healthy, caught only because a Rust client disagreed with the browser. (The batch count from that episode is a pre-fix smoke figure and is deliberately not quoted; the requirement is what matters, and it is pinned by `websocket_delivers_every_batch_and_a_terminal_frame`.) The conformance suite (`docs/08`) must carry a case for it.
- Credit accounting becomes part of the transport's contract, and its ceiling is declared rather than discovered (`MAX_INFLIGHT_BATCHES`, max frame size, credit window).
- Frame alignment becomes a documented constraint: the 8-byte-aligned path measures 100/100 batches sharing the wire buffer, so framing must preserve that alignment. The harness's 8-byte prefix is one way to satisfy it, not the only one — see "What this ADR does not decide".
- Nothing changes for the control plane. Tauri IPC remains the control plane per ADR-004, including its amendment 1 rule on bit-critical scalars.

**Regardless of the decision, these hold** — they were measured, and they bind whichever transport is eventually built:

- A client-side abort is not evidence of cancellation. Producer-side observation is the only admissible measurement, and both candidates can supply it.
- Bounded-memory backpressure via reserve-before-generate holds a hard plateau at the channel's capacity, in both candidates.
- Arrow payload alignment is worth one whole-payload copy per batch.

## Open risks and follow-up work

1. **The decision's only measured basis may be removable — but smaller batches do not remove it.** Phase 2 measured configuration S (~244 KB batches): B still paid 1000–1001 whole-payload copies per run, the copy having relocated from reassembly into the Arrow parse via misaligned chunk views. An incremental Arrow reader that does not require a contiguous message might still eliminate it; **that remains untested**, as does the large-batch direction. If it can be eliminated, criterion 1 stops discriminating and this ADR should be re-opened rather than quietly retained.
2. **Throughput is uncharacterised for both candidates.** The workload is generation-bound at 97.2–98.9 %; neither transport's ceiling was measured. Any future throughput claim needs a re-run with a pre-generated payload that decouples generation from transfer. **No throughput-based claim may cite this ADR.**
3. **One admissible invocation.** Run-to-run variance on the fixed build is uncharacterised: the reproducibility check could not be obtained, because nothing in this environment can hold a browser window foregrounded while automation continues. Two invocations on the *pre-fix* build did agree, which is weak corroboration and not a substitute.
4. **One machine, one GPU, one Edge build.** Intel UHD 630 — not the GTX 1650 also present — and Edge 150.0.4078.105.
5. **Cross-platform validation.** Every figure is Windows-only. macOS/WKWebView and Linux/WebKitGTK are unmeasured, and `docs/07`'s hardware-validation gate covers them.
6. **Interruptible IPC channels remain unmeasured** — ADR-004 amendment 2's third candidate class. A future comparison needs its own harness run, not an argument from these results.
7. **Peer authentication on loopback** is unaddressed: the token authenticates a session, not a process. Any local process running as the same user can reach the port — and on the manual (non-`--launch`) path need not attack the token at all, since it can read `launch-url.txt`. The production transport must not write the credential to disk.
8. **Production token material** must come from an OS CSPRNG and the OS keychain (`docs/09`), not the harness's splitmix64 minting.
9. **The harness's own remaining gaps**, recorded in README §15.8 and to be closed before it is used again: `debugAssertions` is emitted by the server but never recorded in the artifact, so §8's debug-build invalidator has no mechanism behind it *in the report* (the profile was confirmed independently for this run); H4's live negative tests target `/clock` rather than the two data endpoints, leaving the WebSocket subprotocol reject path untested; sampling cadence ran at ~62.6 ms against a declared 50 ms.
10. **Synthetic, structurally regular payload.** Uniform-random points at a fixed seed; no GeoParquet, no DuckDB, no spatial index, no picking, no editing, no reprojection, no concurrent streams, no WAN path. Real irregular cadastral data is unexercised, exactly as the ADR-003 spike's own scope-limits section states for P1/P2.
11. **Server-side spatial indexing** — `docs/07`'s *other* open gate — is untouched here and stays `engine/` work per `docs/05`.
